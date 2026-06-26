// Post-fix regression check: all pages at 1440 + 375, no screenshots.
import { chromium } from 'playwright';
const BASE = 'http://localhost:8198/preview/site/';
const PAGES = ['index','program','accelerator','workshops','why-ventura-county','impact','give','partner','partner-cities-county','partner-foundations','about','news','news-annual-benefit','contact'];
const INIT = () => { try { sessionStorage.setItem('sv_intro_seen','1'); } catch(e){} window.__cls=0; try{ new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value;}).observe({type:'layout-shift',buffered:true}); }catch(e){} };
const CHECK = () => {
  const winW = window.innerWidth;
  const out = { ov:document.documentElement.scrollWidth>winW+1, cls:Math.round((window.__cls||0)*1000)/1000 };
  const norm=t=>t.replace(/\s+/g,' ').trim();
  const h=[...document.querySelectorAll('main h1,main h2')].map(x=>norm(x.textContent)).filter(Boolean);
  const c={}; h.forEach(t=>c[t]=(c[t]||0)+1); out.dupH=Object.keys(c).filter(t=>c[t]>1);
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id); const ic={}; ids.forEach(i=>ic[i]=(ic[i]||0)+1); out.dupId=Object.keys(ic).filter(i=>ic[i]>1);
  const wraps=[...document.querySelectorAll('main .wrap:not(.wrap--narrow)')].map(w=>Math.round(w.getBoundingClientRect().left));
  const f={}; wraps.forEach(l=>f[l]=(f[l]||0)+1); const dom=Number(Object.keys(f).sort((a,b)=>f[b]-f[a])[0]); out.misA=wraps.filter(l=>Math.abs(l-dom)>2).length;
  out.counts=[document.querySelectorAll('.site-header').length,document.querySelectorAll('.site-footer').length].join('/');
  let ov=0; const s=[...document.querySelectorAll('main > section')]; for(let i=0;i<s.length-1;i++){const a=s[i].getBoundingClientRect(),b=s[i+1].getBoundingClientRect(); if(a.bottom-b.top>4) ov++;} out.secOverlap=ov;
  return out;
};
async function full(p){ await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{scrollTo(0,y);y+=innerHeight*0.8;if(y<document.body.scrollHeight)setTimeout(s,80);else{scrollTo(0,document.body.scrollHeight);setTimeout(r,300);}};s();});}); }
const b=await chromium.launch(); let issues=0;
for(const slug of PAGES){ for(const w of [1440,375]){
  const ctx=await b.newContext({viewport:{width:w,height:900}}); await ctx.addInitScript(INIT); const p=await ctx.newPage();
  try{ await p.goto(BASE+slug+'.html',{waitUntil:'domcontentloaded',timeout:20000}); try{await p.waitForLoadState('networkidle',{timeout:6000});}catch(e){} await full(p); const r=await p.evaluate(CHECK);
    const bad=[]; if(r.ov)bad.push('OVERFLOW'); if(r.cls>0.1)bad.push('CLS='+r.cls); if(r.dupH.length)bad.push('dupH:'+r.dupH.join('|')); if(r.dupId.length)bad.push('dupId:'+r.dupId.join('|')); if(r.misA)bad.push('misA='+r.misA); if(r.secOverlap)bad.push('overlap='+r.secOverlap); if(r.counts!=='1/1')bad.push('counts='+r.counts);
    if(bad.length){issues++;console.log(`ISSUE ${slug}@${w}: ${bad.join('  ')}`);} else console.log(`ok ${slug}@${w}`);
  }catch(e){issues++;console.log(`ERR ${slug}@${w}: ${String(e).split('\n')[0]}`);} await ctx.close();
}}
await b.close();
console.log('\n'+(issues?issues+' page(s) with issues':'ALL CLEAN — no regressions'));
