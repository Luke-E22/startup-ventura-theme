// Header responsive sweep: step 320→1440 (and named breakpoints), screenshot the
// header at each width and measure crowding / collision / collapse behavior.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
const BASE = 'http://localhost:8198/preview/site/about.html'; // solid header, items identical across pages
const SHOTS = path.resolve('../qa-screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

const widths = new Set([360, 414, 768, 1024, 1280, 1440]);
for (let w = 320; w <= 1440; w += 40) widths.add(w);
const WIDTHS = [...widths].sort((a, b) => a - b);

const METRICS = () => {
  const r = (el) => el ? el.getBoundingClientRect() : null;
  const vis = (el) => el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
  const nav = document.querySelector('.primary-nav');
  const navUl = document.querySelector('.primary-nav > ul');
  const brand = document.querySelector('.site-brand');
  const cta = document.querySelector('.header-cta');
  const give = document.querySelector('.header-cta .btn--give');
  const toggle = document.querySelector('.menu-toggle');
  const nb = r(nav), bb = r(brand), cb = r(cta);
  return {
    navVisible: vis(nav),
    toggleVisible: vis(toggle),
    giveVisible: vis(give),
    bothNavAndToggle: vis(nav) && vis(toggle),
    navOverflow: navUl ? navUl.scrollWidth > navUl.clientWidth + 1 : false,
    collideNavGive: nb && cb ? Math.round(nb.right - cb.left) > 1 : false,   // nav overlaps the right cluster (Give)
    collideNavBrand: nb && bb ? Math.round(bb.right - nb.left) > 1 : false,  // nav overlaps the logo
    navRightPastViewport: nb ? Math.round(nb.right) > window.innerWidth + 1 : false,
    horizScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
    gap_nav_give: nb && cb ? Math.round(cb.left - nb.right) : null,          // +ve = clear space, -ve = overlap
    gap_brand_nav: nb && bb ? Math.round(nb.left - bb.right) : null,
  };
};

const browser = await chromium.launch();
const out = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('sv_intro_seen', '1'); } catch (e) {} });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  try { await page.waitForLoadState('networkidle', { timeout: 5000 }); } catch (e) {}
  await page.waitForTimeout(150);
  const m = await page.evaluate(METRICS);
  try { await page.locator('.site-header').screenshot({ path: path.join(SHOTS, `header-${w}.png`) }); } catch (e) {}
  out.push({ w, ...m });
  const flags = [];
  if (m.bothNavAndToggle) flags.push('BOTH-NAV+TOGGLE');
  if (m.navVisible && (m.collideNavGive || m.navOverflow || m.navRightPastViewport)) flags.push('NAV-CRAMPED');
  if (m.collideNavBrand) flags.push('NAV/LOGO-COLLIDE');
  if (m.horizScroll) flags.push('H-SCROLL');
  console.log(`${String(w).padStart(4)}  nav=${m.navVisible?'Y':'-'} tog=${m.toggleVisible?'Y':'-'} give=${m.giveVisible?'Y':'-'}  gapNavGive=${m.gap_nav_give}  ${flags.join(' ')}`);
  await ctx.close();
}
await browser.close();
fs.writeFileSync('header-sweep.json', JSON.stringify(out, null, 2));
// summarize the cramped zone
const cramped = out.filter(o => o.navVisible && (o.collideNavGive || o.navOverflow || o.navRightPastViewport)).map(o => o.w);
const collapseAt = (() => { for (let i = 1; i < out.length; i++) if (out[i - 1].navVisible && !out[i].navVisible) return out[i].w; return null; })();
const navFitsFrom = out.filter(o => o.navVisible && !o.collideNavGive && !o.navOverflow && o.gap_nav_give >= 16).map(o => o.w);
console.log('\nCollapse (nav→hamburger just below): ~' + collapseAt + 'px');
console.log('Cramped widths (nav visible but crowded): ' + (cramped.length ? cramped.join(',') : 'none'));
console.log('Nav fits with >=16px clearance from: ' + (navFitsFrom.length ? Math.min(...navFitsFrom) + 'px+' : 'never'));
