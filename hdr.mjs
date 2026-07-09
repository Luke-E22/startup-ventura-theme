import { chromium } from 'playwright';
const OUT='/private/tmp/claude-501/-Users-lukemac/2468d202-f8f9-4ec5-b10c-59efef4d6965/scratchpad';
const b=await chromium.launch();
// 1) subpage (light header)
const p=await (await b.newContext({viewport:{width:1280,height:200}})).newPage();
await p.goto('http://localhost:8198/preview/site/about.html',{waitUntil:'load'});
await p.waitForTimeout(300);
// verify logo centered + which mark visible
const s=await p.evaluate(()=>{
  const inner=document.querySelector('.site-header__inner').getBoundingClientRect();
  const brand=document.querySelector('.site-brand').getBoundingClientRect();
  const color=document.querySelector('.brand-mark--color'), white=document.querySelector('.brand-mark--white');
  return { innerCenter:Math.round(inner.left+inner.width/2), brandCenter:Math.round(brand.left+brand.width/2), colorVisible:getComputedStyle(color).display!=='none', whiteVisible:getComputedStyle(white).display!=='none' };
});
console.log('subpage: logo center', s.brandCenter, 'vs viewport center', s.innerCenter, '| color mark:', s.colorVisible, '| white mark:', s.whiteVisible);
await p.screenshot({path:OUT+'/hdr-subpage.png'});
// 2) home top (over-hero, white mark)
const h=await (await b.newContext({viewport:{width:1280,height:200}})).newPage();
await h.goto('http://localhost:8198/preview/site/index.html',{waitUntil:'load'});
await h.waitForTimeout(300);
const hs=await h.evaluate(()=>({color:getComputedStyle(document.querySelector('.brand-mark--color')).display!=='none',white:getComputedStyle(document.querySelector('.brand-mark--white')).display!=='none'}));
console.log('home top over-hero: color mark:', hs.color, '| white mark:', hs.white, '(want white)');
await h.screenshot({path:OUT+'/hdr-home-top.png'});
// 3) home scrolled
await h.evaluate(()=>window.scrollTo(0,400)); await h.waitForTimeout(400);
console.log('home scrolled: color mark:', await h.evaluate(()=>getComputedStyle(document.querySelector('.brand-mark--color')).display!=='none'),'(want true)');
await h.screenshot({path:OUT+'/hdr-home-scrolled.png'});
// 4) mobile
const m=await (await b.newContext({viewport:{width:390,height:200}})).newPage();
await m.goto('http://localhost:8198/preview/site/about.html',{waitUntil:'load'});
await m.waitForTimeout(300);
await m.screenshot({path:OUT+'/hdr-mobile.png'});
console.log('mobile overflow:', await m.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
await b.close();
