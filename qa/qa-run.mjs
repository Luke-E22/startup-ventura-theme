// Rendered QA pass (Pass 2) for the Startup Ventura preview site.
// Loads every page at every breakpoint, screenshots full-page, and runs
// overflow / alignment / duplicate / anchor / CLS / stuck-reveal / overlap
// checks, plus reduced-motion and reveal-JS-disabled variants.
// Output: qa/qa-results.json + ../qa-screenshots/{slug}-{width}.png
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:8198/preview/site/';
const OUT_SHOTS = path.resolve('../qa-screenshots');
fs.mkdirSync(OUT_SHOTS, { recursive: true });

const PAGES = [
  'index', 'program', 'accelerator', 'workshops', 'why-ventura-county',
  'impact', 'give', 'partner', 'partner-cities-county', 'partner-foundations',
  'about', 'news', 'news-annual-benefit', 'contact',
];
const WIDTHS = [375, 768, 1024, 1440];
const HEIGHT = 900;

// --- injected into every page before its own scripts run ---
const INIT = () => {
  try { sessionStorage.setItem('sv_intro_seen', '1'); } catch (e) {}   // skip the intro overlay
  window.__cls = 0; window.__clsNodes = [];
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) {
          window.__cls += e.value;
          (e.sources || []).forEach((s) => {
            if (s.node && s.node.tagName) {
              window.__clsNodes.push(s.node.tagName.toLowerCase() + (s.node.className && typeof s.node.className === 'string' ? '.' + s.node.className.split(' ')[0] : ''));
            }
          });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}
};

// --- runs in the page after a full scroll; returns findings ---
const CHECKS = () => {
  const sel = (el) => {
    if (!el || el === document.body) return 'body';
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    else if (el.className && typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    return s;
  };
  const winW = window.innerWidth;
  const out = {};

  // 1. Horizontal overflow
  const docW = document.documentElement.scrollWidth;
  out.scrollWidth = docW; out.innerWidth = winW;
  out.hasOverflow = docW > winW + 1;
  out.overflowEls = [];
  if (out.hasOverflow) {
    const seen = new Set();
    [...document.querySelectorAll('body *')].forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > winW + 2 && r.left < winW) {
        const k = sel(el);
        if (!seen.has(k)) { seen.add(k); out.overflowEls.push({ sel: k, right: Math.round(r.right), width: Math.round(r.width) }); }
      }
    });
    out.overflowEls.sort((a, b) => b.right - a.right);
    out.overflowEls = out.overflowEls.slice(0, 15);
  }

  // 2. Container alignment — left edge of standard .wrap containers (exclude intentionally-narrow)
  const wraps = [...document.querySelectorAll('main .wrap:not(.wrap--narrow)')];
  const lefts = wraps.map((w) => Math.round(w.getBoundingClientRect().left));
  const freq = {};
  lefts.forEach((l) => { freq[l] = (freq[l] || 0) + 1; });
  const dominant = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
  out.dominantLeft = dominant !== undefined ? Number(dominant) : null;
  out.misaligned = [];
  wraps.forEach((w) => {
    const l = Math.round(w.getBoundingClientRect().left);
    if (out.dominantLeft !== null && Math.abs(l - out.dominantLeft) > 2) {
      out.misaligned.push({ sel: sel(w.parentElement || w), left: l, expected: out.dominantLeft });
    }
  });

  // 3. Duplicates — headings, ids (button labels noted separately; Give repeats intentionally)
  const norm = (t) => t.replace(/\s+/g, ' ').trim();
  const headings = [...document.querySelectorAll('main h1, main h2')].map((h) => norm(h.textContent)).filter(Boolean);
  const hCount = {}; headings.forEach((t) => { hCount[t] = (hCount[t] || 0) + 1; });
  out.dupHeadings = Object.keys(hCount).filter((t) => hCount[t] > 1).map((t) => ({ text: t, count: hCount[t] }));
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id).filter(Boolean);
  const idCount = {}; ids.forEach((i) => { idCount[i] = (idCount[i] || 0) + 1; });
  out.dupIds = Object.keys(idCount).filter((i) => idCount[i] > 1).map((i) => ({ id: i, count: idCount[i] }));
  // sanity: count heroes, cta bands, headers, footers
  out.counts = {
    header: document.querySelectorAll('.site-header').length,
    footer: document.querySelectorAll('.site-footer').length,
    hero: document.querySelectorAll('.hero').length,
    ctaBand: document.querySelectorAll('.cta-band').length,
    giveButtons: document.querySelectorAll('.btn--give').length,
  };

  // 5. CLS (from the buffered observer)
  out.cls = Math.round((window.__cls || 0) * 1000) / 1000;
  out.clsNodes = [...new Set(window.__clsNodes || [])].slice(0, 12);

  // 6. Stuck reveals (after full scroll)
  out.stuckReveals = [...document.querySelectorAll('.reveal')].filter((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return r.width > 0 && (parseFloat(cs.opacity) < 0.95 || (cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)'));
  }).map((el) => sel(el));
  out.revealTotal = document.querySelectorAll('.reveal').length;

  // 7. Overlap — sibling sections shouldn't vertically overlap; give-bar space reserved
  out.sectionOverlaps = [];
  const secs = [...document.querySelectorAll('main > section')];
  for (let i = 0; i < secs.length - 1; i++) {
    const a = secs[i].getBoundingClientRect(); const b = secs[i + 1].getBoundingClientRect();
    if (a.bottom - b.top > 4) out.sectionOverlaps.push({ a: sel(secs[i]), b: sel(secs[i + 1]), overlap: Math.round(a.bottom - b.top) });
  }
  const bar = document.querySelector('.give-bar');
  if (bar) {
    const visible = getComputedStyle(bar).display !== 'none';
    out.giveBar = { visible, height: Math.round(bar.getBoundingClientRect().height), bodyPadBottom: getComputedStyle(document.body).paddingBottom };
  }
  return out;
};

async function fullScroll(page) {
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += Math.round(window.innerHeight * 0.8);
        if (y < document.body.scrollHeight) setTimeout(step, 110);
        else { window.scrollTo(0, document.body.scrollHeight); setTimeout(res, 450); }
      };
      step();
    });
  });
}

async function settle(page) {
  try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {}
  try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}
  await page.waitForTimeout(350);
}

async function anchorChecks(page) {
  return await page.evaluate(async () => {
    const res = [];
    const hdr = document.querySelector('.site-header');
    const hh = hdr ? hdr.offsetHeight : 0;
    const anchors = [...document.querySelectorAll('a[href^="#"]')].filter((a) => a.getAttribute('href').length > 1);
    for (const a of anchors) {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (!t) continue;
      location.hash = '#' + id;
      await new Promise((r) => setTimeout(r, 250));
      const top = t.getBoundingClientRect().top;
      res.push({ href: '#' + id, top: Math.round(top), headerH: hh, hiddenUnderHeader: top < hh - 2 });
    }
    location.hash = '';
    window.scrollTo(0, 0);
    return res;
  });
}

const results = { base: BASE, generatedAt: 'static', pages: {} };

const browser = await chromium.launch();

for (const slug of PAGES) {
  results.pages[slug] = { breakpoints: {}, variants: {} };
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: HEIGHT }, deviceScaleFactor: 1 });
    await ctx.addInitScript(INIT);
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + slug + '.html', { waitUntil: 'domcontentloaded', timeout: 20000 });
      await settle(page);
      await fullScroll(page);
      const findings = await page.evaluate(CHECKS);
      const anchors = await anchorChecks(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(OUT_SHOTS, `${slug}-${width}.png`), fullPage: true });
      results.pages[slug].breakpoints[width] = { ...findings, anchors };
      console.log(`ok  ${slug} @${width}  overflow=${findings.hasOverflow} cls=${findings.cls} stuck=${findings.stuckReveals.length} dupH=${findings.dupHeadings.length} misA=${findings.misaligned.length}`);
    } catch (e) {
      results.pages[slug].breakpoints[width] = { error: String(e).split('\n')[0] };
      console.log(`ERR ${slug} @${width}: ${String(e).split('\n')[0]}`);
    }
    await ctx.close();
  }

  // Variant A: reduced motion (1440)
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: HEIGHT }, reducedMotion: 'reduce' });
    await ctx.addInitScript(INIT);
    const page = await ctx.newPage();
    await page.goto(BASE + slug + '.html', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await settle(page); await fullScroll(page);
    const f = await page.evaluate(CHECKS);
    results.pages[slug].variants.reducedMotion = { stuckReveals: f.stuckReveals, cls: f.cls, hasOverflow: f.hasOverflow };
    await ctx.close();
  } catch (e) { results.pages[slug].variants.reducedMotion = { error: String(e).split('\n')[0] }; }

  // Variant B: main.js blocked (reveal JS disabled) (1440)
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: HEIGHT } });
    await ctx.addInitScript(INIT);
    await ctx.route('**/main.js', (route) => route.abort());
    const page = await ctx.newPage();
    await page.goto(BASE + slug + '.html', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await settle(page); await fullScroll(page);
    const f = await page.evaluate(CHECKS);
    await page.screenshot({ path: path.join(OUT_SHOTS, `${slug}-1440-nojs.png`), fullPage: true });
    results.pages[slug].variants.noRevealJS = { stuckReveals: f.stuckReveals.length, stuckSample: f.stuckReveals.slice(0, 8), revealTotal: f.revealTotal, hasOverflow: f.hasOverflow };
    await ctx.close();
  } catch (e) { results.pages[slug].variants.noRevealJS = { error: String(e).split('\n')[0] }; }
}

await browser.close();
fs.writeFileSync('qa-results.json', JSON.stringify(results, null, 2));
console.log('\nWROTE qa/qa-results.json and screenshots to qa-screenshots/');
