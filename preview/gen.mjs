// Generates a fully click-navigable static preview of the Startup Ventura site
// into preview/site/*.html, sharing one header/footer with the production nav,
// wiring the real stylesheet + JS, and binding Give to the real Zeffy modal.
// This is a VERIFICATION/DEMO artifact only — the WordPress theme is the source
// of truth. Run: node preview/gen.mjs
import fs from 'fs';
import path from 'path';

const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'site');
fs.mkdirSync(OUT, { recursive: true });
const A = '../../startup-ventura/assets'; // assets path from preview/site/*.html

const ZEFFY = 'https://www.zeffy.com/embed/donation-form/donate-to-startup-ventura?modal=true';
const waveRule = '<svg class="wave-rule" width="64" height="10" viewBox="0 0 64 10" fill="none" aria-hidden="true"><path d="M1 5C9 1 15 9 23 5C31 1 37 9 45 5C53 1 59 9 63 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const band = (d, f) => `<div class="band"><svg viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="${d}" fill="${f}"/></svg></div>`;
const waveFull = `<div class="wave" aria-hidden="true">
${band('M0,90 C300,45 560,125 840,80 C1080,40 1260,110 1440,75 L1440,320 L0,320 Z', '#78B4D8')}
${band('M0,140 C300,95 560,175 840,130 C1080,90 1260,160 1440,125 L1440,320 L0,320 Z', '#5484A8')}
${band('M0,190 C300,145 560,225 840,180 C1080,140 1260,210 1440,175 L1440,320 L0,320 Z', '#316194')}
${band('M0,240 C300,195 560,275 840,230 C1080,190 1260,260 1440,225 L1440,320 L0,320 Z', '#243C48')}
<div class="crest"><svg viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="M0,90 C300,45 560,125 840,80 C1080,40 1260,110 1440,75" fill="none" stroke="#FF8A80" stroke-width="3" vector-effect="non-scaling-stroke"/></svg></div>
</div>`;
const waveDivider = `<div class="wave-divider" aria-hidden="true"><svg viewBox="0 0 1440 70" preserveAspectRatio="none" width="100%" height="64"><path d="M0,32 C300,6 560,56 840,33 C1080,14 1260,50 1440,30 L1440,70 L0,70 Z" fill="#78B4D8" opacity=".20"></path><path d="M0,42 C300,16 560,64 840,42 C1080,22 1260,56 1440,38 L1440,70 L0,70 Z" fill="#5484A8" opacity=".18"></path><path class="crest-path" d="M0,32 C300,6 560,56 840,33 C1080,14 1260,50 1440,30" fill="none" stroke="#FF8A80" stroke-width="2.5" vector-effect="non-scaling-stroke"></path></svg></div>`;

const give = (loc, cls = '', note = '') =>
  `<button class="btn btn--give${cls ? ' ' + cls : ''}" zeffy-form-link="${ZEFFY}" data-cta="give" data-cta-location="${loc}">Give</button>${note ? `<p class="cta-note give-note" style="color:var(--muted)">${note}</p>` : ''}`;
const apply = (label = 'Get notified', cls = 'btn--outline') => `<a class="btn ${cls}" href="contact.html#notify" data-cta="apply">Get notified</a>`;
const partnerBtn = (label = 'Partner with us', cls = 'btn--outline') => `<a class="btn ${cls}" href="partner.html" data-cta="partner">${label}</a>`;
const candidSeal = (cls = '') => `<a class="candid-seal ${cls}" aria-label="Startup Ventura on Candid: 2026 Platinum Seal of Transparency" href="https://app.candid.org/profile/16385291/startup-ventura-39-2204612/?pkId=266ecad1-f625-40ab-acfb-c736d5b97833" target="_blank" rel="noopener"><img src="${A}/img/candid-platinum-seal-badge.png" alt="Candid 2026 Platinum Seal of Transparency" width="150" height="150" loading="lazy"></a>`;
// Ventura Chamber of Commerce membership badge: static "Proud member of" lockup
// (self-hosted Chamber logo) linking to Startup Ventura's verified Chamber listing.
const chamberBadge = () => `<a class="chamber-badge" href="https://ventura.chambermaster.com/list/member/startup-ventura-38811" target="_blank" rel="noopener">
  <span class="chamber-badge__label">Proud member of the</span>
  <img class="chamber-badge__logo" src="${A}/img/partners/ventura-chamber.png" width="800" height="266" alt="Ventura Chamber of Commerce" loading="lazy" decoding="async">
</a>`;

const head = (e, h, lede = '') => `<header class="section-head section-head--left"><p class="eyebrow">${e}</p>${waveRule}<h2 class="section-head__title display">${h}</h2>${lede ? `<p class="section-head__intro lede">${lede}</p>` : ''}</header>`;

const NAV = [
  { label: 'Program', href: 'program.html', children: [['7-Week Accelerator', 'accelerator.html'], ['Workshop Series', 'workshops.html']] },
  { label: 'Impact', href: 'impact.html' },
  { label: 'Partner', href: 'partner.html', children: [['For Cities &amp; County', 'partner-cities-county.html'], ['For Foundations', 'partner-foundations.html']] },
  { label: 'About', href: 'about.html', children: [['Board of Directors', 'about.html'], ['Leadership', 'lukeerickson.html'], ['Why Ventura County', 'why-ventura-county.html']] },
  { label: 'Contact', href: 'contact.html' },
  { label: 'News', href: 'news.html' },
];
const navList = () => `<ul class="sv-menu">${NAV.map(i => i.children
  ? `<li class="menu-item menu-item-has-children"><a href="${i.href}">${i.label}</a><ul class="sub-menu">${i.children.map(c => `<li class="menu-item"><a href="${c[1]}">${c[0]}</a></li>`).join('')}</ul></li>`
  : `<li class="menu-item"><a href="${i.href}">${i.label}</a></li>`).join('')}</ul>`;

const header = (overHero = false) => `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header${overHero ? ' site-header--over-hero' : ''}">
  <div class="wrap site-header__inner">
    <a class="site-brand" href="index.html" rel="home"><span class="brand-text">Startup Ventura</span></a>
    <nav class="primary-nav" aria-label="Primary">${navList()}</nav>
    <div class="header-cta">${give('header')}
      <button class="menu-toggle" type="button" aria-controls="sv-mobile-menu" aria-expanded="false"><span class="sr-only">Menu</span><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="sv-mobile-menu">
  <button class="mobile-menu__close" type="button" aria-label="Close menu">&times;</button>
  <nav aria-label="Mobile">${navList()}</nav>
  ${give('mobile-menu', 'btn--lg btn--full')}
</div>
<main id="main" class="site-main">`;

const ctaBand = (heading, secondary = 'none', note = 'Funds the inaugural Spring 2027 cohort. EIN 39-2204612.') => `<section class="section cta-band">${waveFull}
  <div class="wrap cta-band__inner"><p class="eyebrow">The Ask</p>${waveRule}<h2 class="cta-band__title">${heading}</h2>
  <div class="cta-band__actions">${give('band', 'btn--lg')}${secondary === 'apply' ? apply('Apply to the cohort', 'btn--ghost') : secondary === 'partner' ? partnerBtn('Partner with us', 'btn--ghost') : ''}</div>
  <p class="cta-band__note">${note}</p></div></section>`;

const footer = () => `</main>
<footer class="site-footer">
  <div class="wave-footer" aria-hidden="true"><svg viewBox="0 0 1440 70" preserveAspectRatio="none" width="100%" height="70"><path d="M0,40 C300,5 560,70 840,42 C1080,18 1260,60 1440,38 L1440,0 L0,0 Z" fill="currentColor"></path></svg></div>
  <div class="wrap"><div class="footer-grid">
    <div class="footer-brand"><img src="${A}/img/logo-white.png" width="280" height="91" alt="Startup Ventura"><p>A 501(c)(3) nonprofit startup accelerator backing local founders in Ventura County.</p>${candidSeal('footer-seal')}${chamberBadge()}</div>
    <div class="footer-col"><h4>Explore</h4><ul><li><a href="program.html">The Program</a></li><li><a href="why-ventura-county.html">Why Ventura County</a></li><li><a href="impact.html">Impact</a></li><li><a href="give.html">Give</a></li><li><a href="partner.html">Partner</a></li><li><a href="about.html">About</a></li><li><a href="news.html">News</a></li><li><a href="contact.html">Contact</a></li><li><a href="donor-wall.html">Donor Wall</a></li><li class="footer-note-link"><a href="explore-83-palm.html">83 Palm St &middot; concept study</a></li></ul></div>
    <div class="footer-col"><h4>Get in touch</h4><ul><li><a href="mailto:info@startupventura.com">info@startupventura.com</a></li><li><a href="mailto:sponsor@startupventura.com">sponsor@startupventura.com</a></li><li><a href="press.html">Press &amp; media kit</a></li></ul></div>
  </div><div class="footer-legal"><span>Startup Ventura is a 501(c)(3) nonprofit. EIN 39-2204612. Gifts are tax-deductible to the extent allowed by law.</span><span>&copy; 2026 Startup Ventura</span><span class="footer-legal__links"><a href="privacy.html">Privacy</a> &middot; <a href="terms.html">Terms</a></span></div></div>
</footer>`;

const crumbs = (trail) => `<nav class="breadcrumbs wrap" aria-label="Breadcrumb"><ol>${trail.map((t, i) => `<li>${t[1] && i < trail.length - 1 ? `<a href="${t[1]}">${t[0]}</a>` : `<span aria-current="page">${t[0]}</span>`}</li>`).join('')}</ol></nav>`;

// Intro overlay (plays once per session, gated in main.js). Used on the home page.
const introOverlay = `<div class="intro" id="sv-intro"><div class="intro-center"><div class="wordmark display">STARTUP<br>VENTURA</div><p class="intro-tag">Ventura County &middot; Est. 2025</p></div>${waveFull}<button class="skip" id="sv-intro-skip" type="button">Skip &rarr;</button></div>`;
const introNoFlash = `<script>try{if(sessionStorage.getItem('sv_intro_seen')||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)){document.documentElement.classList.add('sv-skip-intro');}}catch(e){}</script>`;
const introReplay = `<button class="replay" id="sv-intro-replay" type="button">Replay intro &#8635;</button>`;

// Production origin for absolute SEO URLs (canonical, Open Graph, JSON-LD).
const SITE = 'https://startupventura.com';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Per-page SEO head tags: description, canonical, Open Graph, Twitter, JSON-LD.
const seoHead = ({ title, desc, canonical, ogType = 'website', ogImage, jsonld, robots }) => {
  // Default social share image: the branded 1200x630 card (assets/img/og/og-default.jpg).
  // Pages that pass ogImage (e.g. the Luke pages -> headshot) override it.
  const img = ogImage || `${SITE}/assets/img/og/og-default.jpg`;
  const isDefaultCard = !ogImage;
  let h = '';
  if (robots) h += `<meta name="robots" content="${esc(robots)}">\n`;
  if (desc) h += `<meta name="description" content="${esc(desc)}">\n`;
  if (canonical) h += `<link rel="canonical" href="${esc(canonical)}">\n`;
  h += `<meta property="og:type" content="${ogType}">\n`;
  h += `<meta property="og:site_name" content="Startup Ventura">\n`;
  h += `<meta property="og:title" content="${esc(title)}">\n`;
  if (desc) h += `<meta property="og:description" content="${esc(desc)}">\n`;
  if (canonical) h += `<meta property="og:url" content="${esc(canonical)}">\n`;
  h += `<meta property="og:image" content="${esc(img)}">\n`;
  if (isDefaultCard) {
    h += `<meta property="og:image:width" content="1200">\n`;
    h += `<meta property="og:image:height" content="630">\n`;
  }
  h += `<meta name="twitter:card" content="summary_large_image">\n`;
  h += `<meta name="twitter:title" content="${esc(title)}">\n`;
  if (desc) h += `<meta name="twitter:description" content="${esc(desc)}">\n`;
  h += `<meta name="twitter:image" content="${esc(img)}">\n`;
  if (jsonld) {
    for (const obj of [].concat(jsonld)) {
      h += `<script type="application/ld+json">${JSON.stringify(obj)}</script>\n`;
    }
  }
  return h;
};

const page = (file, { title, overHero = false, body, crumbsTrail, intro = false, desc, canonical, ogType = 'website', ogImage, jsonld, robots }) => {
  const fullTitle = `${title} — Startup Ventura`;
  const seo = seoHead({ title: fullTitle, desc, canonical, ogType, ogImage, jsonld, robots });
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${fullTitle}</title>
${seo}<link rel="preload" href="${A}/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${A}/fonts/hanken-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${A}/css/main.css?v=20"></head>
<body class="${overHero ? 'home' : ''}">
${intro ? introNoFlash + '\n' + introOverlay + '\n' : ''}${header(overHero)}
${crumbsTrail ? crumbs(crumbsTrail) : ''}
${body}
${footer()}
${intro ? introReplay + '\n' : ''}<script src="https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js" defer></script>
<script src="${A}/js/main.js?v=20"></script>
${body.includes('data-netlify') ? NF_SCRIPT : ''}
</body></html>`;
  fs.writeFileSync(path.join(OUT, file), html);
};

// shared content
const tiers = [
  ['Catalyst', '$1,000', false, ['Name on the website donor wall', 'Recognition at the annual benefit', 'Listing in the annual impact report']],
  ['Principal', '$5,000', false, ['Everything in Catalyst, plus:', 'Name and logo on the donor wall', 'Invitation to Demo Day']],
  ['Visionary', '$10,000', false, ['Everything in Principal, plus:', 'Logo on Demo Day signage', 'Reserved seating and recognition at the annual benefit', 'Quarterly program updates', 'Invitation to the founder and mentor mixer']],
  ['Legacy', '$25,000', true, ['Everything in Visionary, plus:', 'Presenting recognition for the inaugural Spring 2027 cohort', 'Premier logo placement on the homepage and donor wall', 'A recognition moment and reserved table at the annual benefit', 'A private dinner with the founder cohort and board', 'First look at Demo Day and warm introductions to founders']],
];
const tierGrid = () => `<div class="tier-grid">${tiers.map(([n, a, legacy, bs]) => `<article class="tier${legacy ? ' tier--legacy' : ''}">${legacy ? '<span class="tier__ribbon">Presents the inaugural cohort</span>' : ''}<h3 class="tier__name">${n}</h3><p class="tier__price">${a}</p><ul class="tier__list">${bs.map(b => `<li class="${b.startsWith('Everything') ? 'tier__incl' : ''}">${b}</li>`).join('')}</ul><div class="tier__cta">${give('tier-' + n.toLowerCase(), 'btn--full' + (legacy ? ' btn--lg' : ''), '')}</div></article>`).join('')}</div>`;

const board = [
  { n: 'Luke Erickson', r: 'Board Member, Executive Director', p: 'team/luke-erickson.jpg', pos: 'center 22%', li: 'https://www.linkedin.com/in/luke-erickson/', ig: 'https://www.instagram.com/luke_erickson/', site: 'https://lukeerickson.com',
    bio: `Luke Erickson is the founder of Startup Ventura and serves as Executive Director of the organization. With a background in business development and entrepreneurship, Luke launched Startup Ventura in 2025 to bring nationally recognized accelerator programming to Ventura County. Driven by a passion for empowering founders and strengthening the local economy, he leads the organization's programming, partnerships, and community impact initiatives. Luke's vision is to position Ventura as a hub of innovation and entrepreneurial growth.` },
  { n: 'Brent-Stig Kraus', r: 'Board Member, Senior Revenue Executive', p: 'team/brent-stig-kraus.jpg', pos: '42% 22%', zoom: 1.5, li: 'https://www.linkedin.com/in/brent-stig-kraus-7958125/',
    bio: `Brent Stig Kraus is a senior revenue executive with extensive experience scaling SaaS companies through hypergrowth and strategic exits. He most recently served as CRO at SevenRooms, acquired by DoorDash in a $1.2B transaction, and previously held leadership roles at ChowNow and MINDBODY during its $1.9B acquisition by Vista Equity Partners. Earlier in his career, Brent helped drive Lynda.com's growth leading to its $1.5B acquisition by LinkedIn. With a track record of building high-performing teams and driving transformative growth across multiple SaaS verticals, Brent brings deep expertise in enterprise sales, go-to-market strategy, and operational excellence.` },
  { n: 'Brian Gonzalez', r: 'Board Member, Co-Founder &amp; CTO of Curri', p: 'team/brian-gonzalez.jpg', pos: 'center 30%', li: 'https://www.linkedin.com/in/brianmatthewgonzalez/',
    bio: `Brian Gonzalez is the CTO and co-founder of Curri, a nationwide delivery and logistics platform built for construction wholesalers and distributors. He began his career in startups in 2010 at Dollar Shave Club and has been immersed in the entrepreneurial world ever since. After earning his master's degree in data science, Brian launched Curri in the heart of downtown Ventura, where he continues to lead technology and innovation today. Under his leadership, Curri has raised capital from leading investors including Y Combinator and Bessemer Venture Partners.` },
  { n: 'Stephanie Caldwell', r: 'Board Member, CEO of Ventura Chamber of Commerce', p: 'team/stephanie-caldwell.jpg', pos: 'center 22%', li: 'https://www.linkedin.com/in/stephanie-caldwell-1b02b39/',
    bio: `Stephanie Caldwell has held a senior leadership role at the Ventura Chamber of Commerce since April 2015 and currently serves as a director for the California Chamber of Commerce. With a career spanning sales, operations, and workforce management, she began in the hospitality industry before transitioning into the staffing sector, where she led branch and on-site contingent staffing operations in Silicon Valley supporting major technology companies including Novell and Compaq (now HP). Previously, she served as Chief Operations Officer of the San Jose Silicon Valley Chamber of Commerce and has additional experience in both public service and industry associations, including roles in the district office of a California State Assembly member and as Director of Education and Events for the California Apartment Association's Tri-County Division.` },
  { n: 'Sean Herwaldt', r: 'Board Member, Director at Curri · SpaceX alum', p: 'team/sean-herwaldt.jpg', pos: 'center 40%', zoom: 1.4, li: 'https://www.linkedin.com/in/seanherwaldt/',
    bio: `Sean Herwaldt is a Director at Curri, the Series B last-mile logistics company, where he leads delivery operations. He started his career at SpaceX, which shaped how he works: first principles, no assumptions, move fast, and never confuse activity with progress. He then joined the longevity company NOVOS to build its operations from scratch, spending four years standing up a supply chain with no playbook, launching products from concept to shelf, rebuilding a customer-experience team with AI that made the team better rather than redundant, and writing his own tools when spreadsheets were no longer enough. Sean is drawn to the craft of taking an idea to something real, then making it repeatable and ready to scale, and he cares as much about the people doing the work as the work itself.` },
];
// On the About page the full bio shows by default (open); the home teaser keeps it collapsed.
const boardGrid = (openBios = false) => `<div class="board-grid${openBios ? ' board-grid--wide' : ''}">${board.map(b => `<article class="board-card">${b.p ? `<div class="board-card__media"><img class="board-card__photo" src="${A}/img/${b.p}" width="600" height="720"${(b.pos || b.zoom) ? ` style="${b.pos ? `object-position:${b.pos};` : ''}${b.zoom ? `transform:scale(${b.zoom});transform-origin:${b.pos || 'center'};` : ''}"` : ''} alt="${b.n}"></div>` : ''}<div class="board-card__body"><h3 class="board-card__name">${b.n}</h3><p class="board-card__role">${b.r}</p><details class="board-card__details"${openBios ? ' open' : ''}><summary>${openBios ? 'Bio' : 'Read bio'}</summary><p class="board-card__bio">${b.bio}</p></details>${(b.li || b.ig || b.site) ? `<p class="board-card__links">${b.li ? `<a href="${b.li}" target="_blank" rel="noopener">LinkedIn &nearr;</a>` : ''}${b.ig ? `<a href="${b.ig}" target="_blank" rel="noopener">Instagram &nearr;</a>` : ''}${b.site ? `<a href="${b.site}" target="_blank" rel="noopener">${b.site.replace(/^https?:\/\/(www\.)?/, '')} &nearr;</a>` : ''}</p>` : ''}</div></article>`).join('')}</div>`;

const statStrip = () => `<ul class="stat-strip"><li class="stat-strip__item"><div class="stat-strip__num">54%</div><div class="stat-strip__label">above the U.S. cost of living</div></li><li class="stat-strip__item"><div class="stat-strip__num">1 in 7</div><div class="stat-strip__label">households can afford a median home (down from 1 in 2 a decade ago)</div></li><li class="stat-strip__item"><div class="stat-strip__num">5</div><div class="stat-strip__label">local jobs created by every tech job</div></li></ul>`;
const statBand = () => `<section class="section stat-band">${waveFull}<div class="wrap" style="position:relative;z-index:2"><div class="stat-band__grid"><div class="stat"><div class="stat__num" data-count="75">75</div><div class="stat__label">Attended the first annual benefit</div></div><div class="stat"><div class="stat__num" data-count="17" data-prefix="$" data-suffix="K">$17<span class="unit">K</span></div><div class="stat__label">Raised in one night</div></div><div class="stat"><div class="stat__num" data-count="5">5</div><div class="stat__label">Keynote speakers</div></div></div></div></section>`;
const eventGallery = () => `<div class="event-gallery">${[1, 2, 3, 4, 5, 6].map(n => `<img src="${A}/img/event/benefit-0${n}.jpg" width="900" height="900" loading="lazy" decoding="async" alt="Startup Ventura Annual Benefit, photo ${n}">`).join('')}</div>`;
// LIVE Netlify Forms. Netlify detects each form at deploy time from this static
// HTML (name + data-netlify + hidden form-name input) and captures submissions
// (dashboard + email notifications). The delegated handler injected by page()
// submits via fetch so the branded inline success shows instead of Netlify's
// generic success page. The same form name on two pages (notify) shares one
// submissions bucket on purpose.
const FORM_SUCCESS = {
  contact: 'Thanks, your message is in. We read every message and will get back to you soon.',
  notify: 'You are on the list. We will email you the moment applications open.',
  newsletter: 'You are subscribed. Watch your inbox for events and announcements.',
  'partner-government': 'Request received. We will follow up to schedule a working session.',
  'partner-foundations': 'Thanks, we will be in touch about sponsorship.',
};
const form = (type, submit, org = false, msg = true, opts = {}) => {
  const phone = !!opts.phone, interest = opts.interest || null, two = !!opts.twoCol;
  const full = two ? ' field--full' : '';
  const id = (f) => `${type}-${f}`;
  return `<form class="form${two ? ' form--grid' : ''}" name="${type}" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" data-success="${FORM_SUCCESS[type] || 'Thanks, we got it.'}">
<input type="hidden" name="form-name" value="${type}">
<p class="nf-hp" hidden aria-hidden="true"><label>Do not fill this out if you are human: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
${(type !== 'notify' && type !== 'newsletter') ? `<div class="field"><label for="${id('name')}">Name <span class="req">*</span></label><input id="${id('name')}" name="name" type="text" autocomplete="name" required></div>` : ''}
${org ? `<div class="field${full}"><label for="${id('org')}">Organization <span class="req">*</span></label><input id="${id('org')}" name="organization" type="text" autocomplete="organization" required></div>` : ''}
<div class="field"><label for="${id('email')}">Email <span class="req">*</span></label><input id="${id('email')}" name="email" type="email" autocomplete="email" required></div>
${phone ? `<div class="field"><label for="${id('phone')}">Phone</label><input id="${id('phone')}" name="phone" type="tel" autocomplete="tel"></div>` : ''}
${interest ? `<div class="field"><label for="${id('interest')}">Area of interest</label><select id="${id('interest')}" name="interest">${interest.map(o => `<option>${o}</option>`).join('')}</select></div>` : ''}
${msg ? `<div class="field${full}"><label for="${id('message')}">Message <span class="req">*</span></label><textarea id="${id('message')}" name="message" rows="6" required></textarea></div>` : ''}
<div class="form__submit${full}"><button class="btn btn--blue" type="submit">${submit}</button></div><p class="form__status${full}" role="status" aria-live="polite"></p></form>`;
};
// Delegated submit handler for every Netlify form on a page (injected by page()).
const NF_SCRIPT = `<script>document.addEventListener('submit',function(e){var f=e.target;if(!f||!f.hasAttribute||!f.hasAttribute('data-netlify'))return;e.preventDefault();var s=f.querySelector('.form__status');var b=f.querySelector('button[type=submit]');if(b)b.disabled=true;fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()}).then(function(r){if(!r.ok)throw new Error(r.status);if(s){s.className=s.className.replace(' is-err','')+' is-ok';s.textContent=f.getAttribute('data-success')||'Thanks, we got it.';}f.reset();}).catch(function(){if(s){s.className=s.className.replace(' is-ok','')+' is-err';s.textContent='Something went wrong. Please email info@startupventura.com and we will take care of it.';}}).finally(function(){if(b)b.disabled=false;});});</script>`;

const pageHead = (e, h, lede) => `<section class="section"><div class="wrap"><header class="page-head"><p class="eyebrow">${e}</p>${waveRule}<h1 class="display">${h}</h1><p class="lede">${lede}</p></header></div></section>`;
const card = (href, eyebrow, title, text, link) => `<a class="card card--link" href="${href}"><div class="card__body">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h3 class="card__title">${title}</h3><p class="card__text">${text}</p><span class="card__link">${link}</span></div></a>`;

/* ---------------- pages ---------------- */

// HOME
page('index.html', {
  title: 'Home', overHero: true, intro: true,
  body: `<section class="hero"><img class="hero-bg-img" src="${A}/img/hero.jpg" width="1600" height="1060" alt="Ventura, California" fetchpriority="high"><div class="hero-scrim"></div>
  <div class="hero-inner"><p class="eyebrow">Ventura County &middot; A 501(c)(3) Startup Accelerator</p><h1 class="display">Great founders grow up <span class="coral">here.</span></h1><p class="sub">Startup Ventura backs local founders with the mentorship, capital connections, and community to build high-growth companies right here in Ventura County.</p><div class="cta-row">${give('hero')}${apply('Apply', 'btn--ghost')}</div><p class="cta-note">Funds the inaugural Spring 2027 cohort.</p></div>${waveFull}</section>
  <section class="section mission-strip"><div class="wrap"><p class="eyebrow" style="color:var(--coral-light)">Our mission</p>${waveRule}<p class="mission">To keep Ventura County the best place in the world to live by fueling entrepreneurship, building high-growth companies, and transforming our region into a recognized hub of innovation that creates lasting economic success.</p></div></section>
  <section class="section section--pale grain"><div class="wrap">${head('The Program', 'The program is the product.', 'A focused accelerator and a workshop series, built for Ventura County founders who would rather build here than leave.')}<div class="card-grid card-grid--2">${card('accelerator.html', 'Spring 2027 · S27', '7-Week Accelerator', 'Mentorship, capital connections, hands-on workshops, community, and a Demo Day.', 'Explore the accelerator')}${card('workshops.html', 'Pre-accelerator', 'Workshop Series', 'A workshop series that readies earlier-stage founders and feeds the pipeline.', 'Explore the workshops')}</div><div class="center" style="margin-top:32px">${apply('Apply to the cohort', 'btn--outline btn--lg')}</div></div></section>
  <section class="section"><div class="wrap"><header class="section-head section-head--center"><p class="eyebrow">Who we are</p>${waveRule}<h2 class="section-head__title display">A board that has built and scaled here.</h2></header>${boardGrid()}<div class="center" style="margin-top:32px"><a class="btn btn--outline" href="about.html">Meet the full board</a></div></div></section>
  ${waveDivider}
  <section class="section section--pale"><div class="wrap">${head('Why Ventura County', 'Great talent grows up here. Too much of it leaves.')}<p class="lede">The county raises and educates talent, then watches affordability and a lack of opportunity push it out. High-growth companies are the fix.</p><div style="margin-top:32px">${statStrip()}</div><div style="margin-top:28px"><a class="card__link" href="why-ventura-county.html" style="font-size:1.05rem">Read the full case</a></div></div></section>
  ${ctaBand('Give Ventura County&rsquo;s founders a reason to stay.', 'apply')}`,
});

// PROGRAM
page('program.html', {
  title: 'The Program', crumbsTrail: [['Home', 'index.html'], ['The Program', '']],
  body: pageHead('The Program', 'The program is the product.', 'A focused accelerator and a pre-accelerator workshop series, built for Ventura County founders who would rather build here than leave.') +
    `<section class="section section--pale"><div class="wrap"><div class="card-grid card-grid--2">${card('accelerator.html', 'Spring 2027 · S27', '7-Week Accelerator', 'The flagship program: mentorship, capital connections, workshops, community, and a Demo Day.', 'Explore the accelerator')}${card('workshops.html', 'Pre-accelerator', 'Workshop Series', 'Readies earlier-stage founders and feeds the accelerator pipeline.', 'Explore the workshops')}</div></div></section>` +
    ctaBand('Help us launch Ventura County&rsquo;s first founder cohort.', 'apply'),
});

// ACCELERATOR
page('accelerator.html', {
  title: '7-Week Accelerator', crumbsTrail: [['Home', 'index.html'], ['The Program', 'program.html'], ['7-Week Accelerator', '']],
  body: pageHead('7-Week Accelerator', 'A 7-week accelerator for Ventura County founders.', 'A focused seven-week accelerator for Ventura County founders. The inaugural Spring 2027 (S27) cohort.') +
    `<section class="section section--pale grain"><div class="wrap">${head('What you get', 'Seven weeks built to move you forward.')}<div class="card-grid card-grid--3"><div class="card"><div class="card__body"><h3 class="card__title">Mentorship</h3><p class="card__text">Operators and founders who have built and scaled real companies.</p></div></div><div class="card"><div class="card__body"><h3 class="card__title">Capital connections</h3><p class="card__text">Investor introductions and warm paths to a check.</p></div></div><div class="card"><div class="card__body"><h3 class="card__title">A Demo Day</h3><p class="card__text">A stage in front of investors, partners, and the community.</p></div></div></div></div></section>
    <section class="section"><div class="wrap">${head('How we select', 'We pick founders, not decks.')}<p class="lede measure">What we care about most: the quality of the founder. A great founder with an early idea beats a polished deck and a mediocre team.</p><div class="steps"><div class="step"><div class="step__num">01</div><div class="step__content"><h3 class="step__title">Application</h3><p class="step__body">We weight the founder over the idea.</p></div></div><div class="step"><div class="step__num">02</div><div class="step__content"><h3 class="step__title">Screening Call</h3><p class="step__body">We listen for clarity, drive, and commitment.</p></div></div><div class="step"><div class="step__num">03</div><div class="step__content"><h3 class="step__title">Founder Deep-Dive</h3><p class="step__body">The core interview, where founder quality shows.</p></div></div></div></div></section>
    <section class="section section--pale" id="notify"><div class="wrap wrap--narrow">${head('Applications', 'Not open yet. Be first to know.', 'Leave your email and we will notify you the moment the cohort opens.')}${form('notify', 'Notify me', false, false)}</div></section>` +
    ctaBand('Help us launch Ventura County&rsquo;s first founder cohort.', 'apply'),
});

// WORKSHOPS
page('workshops.html', {
  title: 'Workshop Series', crumbsTrail: [['Home', 'index.html'], ['The Program', 'program.html'], ['Workshop Series', '']],
  body: pageHead('Workshop Series', 'A pre-accelerator workshop series.', 'A pre-accelerator workshop series that readies earlier-stage founders and feeds the accelerator pipeline.') +
    `<section class="section section--pale"><div class="wrap"><p class="lede measure">Working sessions on the hard parts of building a company. <span class="muted">[Confirm format, cadence, topics.]</span></p></div></section>` +
    ctaBand('Help us launch Ventura County&rsquo;s first founder cohort.', 'apply'),
});

// WHY VENTURA COUNTY
page('why-ventura-county.html', {
  title: 'Why Ventura County', crumbsTrail: [['Home', 'index.html'], ['Why Ventura County', '']],
  body: pageHead('Why Ventura County', 'We raise and educate great people. Then we lose them.', 'Ventura County has an affordability problem that is also a brain drain problem. They are the same problem, and high-growth companies are the fix.') +
    `<section class="section section--pale grain"><div class="wrap">${head('The Stakes', 'Three numbers tell the whole story.')}<div class="stakes">
    <div class="stakes__beat"><div class="stakes__index" aria-hidden="true"></div><div><p class="stakes__sub">It&rsquo;s getting too expensive to stay.</p><p class="stakes__text">The median home hit a record <span class="fig">$975,000</span> last year. Today about <span class="fig">one in seven</span> households can afford it.</p></div></div>
    <div class="stakes__beat"><div class="stakes__index" aria-hidden="true"></div><div><p class="stakes__sub">So we&rsquo;re losing people, and getting older.</p><p class="stakes__text">The population has declined since <span class="fig">2017</span>, even as California grew. The average resident is now nearly <span class="fig">40</span>.</p></div></div>
    <div class="stakes__beat"><div class="stakes__index" aria-hidden="true"></div><div><p class="stakes__sub">High-growth companies are the fix.</p><p class="stakes__text">Every tech job creates about <span class="fig">five</span> more local jobs. One founder. Thousands of jobs.</p></div></div></div></div></section>
    <section class="section"><div class="wrap">${head('The Opportunity', 'We can keep our best people here.')}<figure class="testimonial testimonial--feature"><span class="testimonial__mark" aria-hidden="true">&ldquo;</span><blockquote class="testimonial__quote">Luke and the team are building something where founders can actually succeed, where local innovation drives local jobs and we stop losing our best people.</blockquote><figcaption class="testimonial__attr">Rob Russel</figcaption></figure></div></section>` +
    ctaBand('Give Ventura County&rsquo;s founders a reason to stay.', 'partner'),
});

// IMPACT
page('impact.html', {
  title: 'Impact', crumbsTrail: [['Home', 'index.html'], ['Impact', '']],
  body: `<section class="section" style="padding-top:0"><div class="wrap"><header class="page-head"><p class="eyebrow">Impact</p>${waveRule}<h1 class="display">Model your impact</h1><p class="lede">See what your support builds in Ventura County: program longevity, jobs, and startup revenue. Adjust the inputs to explore the numbers.</p></header><iframe id="sv-impact-calc" src="impact-calculator.html" title="Startup Ventura Impact Calculator" loading="lazy" style="width:100%;border:0;min-height:1200px;display:block"></iframe></div></section>
    <script>(function(){window.addEventListener('message',function(e){if(e.origin!==window.location.origin)return;if(e&&e.data&&e.data.type==='sv-impact-calc-height'){var f=document.getElementById('sv-impact-calc');if(f)f.style.height=e.data.height+'px';}});})();</script>
    <section class="section section--pale"><div class="wrap wrap--narrow">${head('Where it goes', 'Every dollar stays in Ventura County.')}<p class="lede">Your gift backs Ventura County founders and the program that supports them. It does not leave the county. Local innovation drives local jobs, and that is how we keep our best people here.</p></div></section>` +
    ctaBand('Give Ventura County&rsquo;s founders a reason to stay.', 'none'),
});

// GIVE
page('give.html', {
  title: 'Give', crumbsTrail: [['Home', 'index.html'], ['Give', '']],
  body: `<section class="section section--navy"><div class="wrap"><div class="give-hero"><div class="give-hero__copy"><h1 class="display">Fund Ventura County's first founder cohort.</h1><p class="lede">A gift funds local founders and the program that backs them. It stays in Ventura County.</p>${give('give-hero', 'btn--lg', 'Secure payment via Zeffy.')}</div><ul class="trust"><li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span>Secure payment</span></li><li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>501(c)(3) nonprofit</span></li><li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>EIN 39-2204612</span></li></ul></div></div></section>
  <section class="section"><div class="wrap">${head("Founder's Circle", 'Lead the inaugural cohort.', 'Recognition tiers for the founders and partners who launch Spring 2027. Each tier includes everything below it.')}${tierGrid()}<p class="center muted" style="margin-top:32px">To discuss a Founder&rsquo;s Circle or corporate gift, email <a href="mailto:sponsor@startupventura.com">sponsor@startupventura.com</a>.</p></div></section>
  <section class="section section--tight"><div class="wrap">${candidSeal('give-seal')}<p class="muted measure">Gifts are tax-deductible to the extent allowed by law. EIN 39-2204612.</p></div></section>` +
    ctaBand('Back the founders who will build the Spring 2027 cohort.', 'none'),
});

// DONOR WALL — data-driven recognition page (linked from the footer Explore list
// only, intentionally not in the top nav). To add a donor: one quoted name in the
// matching tier array below (mirror inc/helpers.php sv_donors()).
const donors = {
  // Tier placement = lifetime giving vs the current tier amounts
  // (sourced from the CRM's received donations, 2026-07-02).
  Legacy: [],
  Visionary: [],
  Principal: ['Brian Gonzalez', 'Brent-Stig Kraus'],
  Catalyst: ['Doug Halter'],
  // Every donor, any amount — the "thank you" name wall (dot-separated),
  // alphabetized by last name.
  all: ['June Dubreuil', 'Victoria Erickson', 'Lynda Girtsman', 'Daniel Gober', 'Brian Gonzalez', 'Doug Halter', 'Sean Herwaldt', 'Sevastian Juarez', 'Anne King', 'Brent-Stig Kraus', 'Michael Panesis', 'Curtis Rogers', 'Genevieve Sasseville', 'Jessica Toren', 'Jeremy Wells'],
  partners: ['City of Ventura &middot; Economic Development', 'Ventura Chamber of Commerce', 'Ventura County Credit Union', 'Santa Cruz Market'],
};
page('donor-wall.html', {
  title: 'Donor Wall', crumbsTrail: [['Home', 'index.html'], ['Donor Wall', '']],
  desc: "The donors and community partners funding Startup Ventura's inaugural Spring 2027 cohort. Founder's Circle recognition and founding supporters.",
  canonical: `${SITE}/donor-wall`,
  body: pageHead('Donor Wall', 'The people funding what founders build here.', 'Startup Ventura is powered by donors and partners who back Ventura County founders. This wall recognizes the Founder&rsquo;s Circle and the community partners behind the inaugural Spring 2027 cohort.') +
    `<section class="section section--pale"><div class="wrap">${head("Founder's Circle", 'The donors launching the first cohort.', 'Each tier includes everything below it. Recognition follows the tier at the time of the gift.')}<div class="donor-wall">${tiers.map(([n, a, legacy]) => {
      const names = donors[n] || [];
      return `<div class="donor-tier${legacy ? ' donor-tier--legacy' : ''}"><h3 class="donor-tier__name">${n}</h3><p class="donor-tier__amount">${a}</p>${names.length ? `<ul class="donor-tier__names">${names.map((x) => `<li>${x}</li>`).join('')}</ul>` : `<p class="donor-tier__invite"><a href="give.html">Be the first name on this tier &rarr;</a></p>`}</div>`;
    }).join('')}</div></div></section>
    <section class="section"><div class="wrap">${head('Founding Supporters', 'The partners who got this started.', 'Public and community partners whose early support launched Startup Ventura.')}<ul class="donor-partners">${donors.partners.map((p) => `<li>${p}</li>`).join('')}</ul></div></section>
    <section class="section section--pale section--tight"><div class="wrap">${head('Thank You', 'To every donor who backs Ventura County&rsquo;s founders.')}${donors.all.length ? `<ul class="donor-all">${donors.all.map((n) => `<li>${n}</li>`).join(' ')}</ul>` : `<p class="donor-all__empty">Every donor&rsquo;s name is listed here, at every level. <a href="give.html">Yours belongs on this wall &rarr;</a></p>`}</div></section>` +
    ctaBand('Put your name behind Ventura County&rsquo;s founders.', 'none'),
});

// 83 PALM — unlisted 3D concept page (noindex; linked ONLY from the tiny footer
// note at the bottom of the Explore column). The render itself is served
// byte-for-byte from assets/explore/83-palm/render.html — never process it.
page('explore-83-palm.html', {
  title: '83 Palm Street · Coworking Concept',
  robots: 'noindex, nofollow',
  desc: "An interactive concept study for Startup Ventura's future coworking and accelerator home at 83 Palm St, Ventura.",
  body: `<section class="section"><div class="wrap"><header class="page-head"><p class="eyebrow">Concept Study</p>${waveRule}<h1 class="display">83 Palm Street &middot; Coworking Concept</h1><p class="lede">An interactive concept study for Startup Ventura&rsquo;s future coworking and accelerator home in the former American Legion hall, modeled from the original 1948 Kenneth H. Hess drawings. Drag to orbit, scroll to zoom, keys 1 to 8 for saved views.</p></header>
  <iframe src="${A}/explore/83-palm/render.html" title="83 Palm 3D concept" style="width:100%; height:85vh; border:0; border-radius:12px;" allowfullscreen loading="lazy"></iframe>
  <p class="muted" style="margin-top:14px;font-size:14px">Concept only. Dimensions approximate from the 1948 drawings. Best experienced on desktop.</p>
  </div></section>`,
});

// PARTNER
page('partner.html', {
  title: 'Partner', crumbsTrail: [['Home', 'index.html'], ['Partner', '']],
  body: pageHead('Partner', 'Partner with us to grow talent here.', 'Cities, county offices, foundations, and companies all have a stake in keeping Ventura County&rsquo;s founders building here.') +
    `<section class="section section--pale"><div class="wrap"><div class="card-grid card-grid--2">${card('partner-cities-county.html', 'Government', 'For Cities &amp; County', 'The economic-development case. We are the execution partner that keeps talent and the tax base local.', 'See the case')}${card('partner-foundations.html', 'Philanthropy &amp; corporate', 'For Foundations &amp; Corporate Giving', 'The grant and sponsorship case, tied to the Founder&rsquo;s Circle levels.', 'See the case')}</div></div></section>` +
    ctaBand('Invest in the founders who will keep Ventura County strong.', 'partner'),
});

// PARTNER - CITIES & COUNTY
page('partner-cities-county.html', {
  title: 'For Cities & County', crumbsTrail: [['Home', 'index.html'], ['Partner', 'partner.html'], ['For Cities & County', '']],
  body: pageHead('For Cities &amp; County', 'Keep talent and the tax base local.', 'Position Startup Ventura as your execution partner for economic development.') +
    `<section class="section section--pale section--tight"><div class="wrap"><p class="lede">The math is local.</p><div style="margin-top:24px">${statStrip()}</div></div></section>
    <section class="section"><div class="wrap wrap--narrow">${head('Request a meeting', 'Start the conversation.')}${form('partner-government', 'Request a meeting', true)}</div></section>` +
    ctaBand('Build the local innovation economy with us.', 'partner'),
});

// PARTNER - FOUNDATIONS
page('partner-foundations.html', {
  title: 'For Foundations & Corporate Giving', crumbsTrail: [['Home', 'index.html'], ['Partner', 'partner.html'], ['For Foundations', '']],
  body: `<section class="section"><div class="wrap"><header class="page-head"><p class="eyebrow">For Foundations &amp; Corporate Giving</p>${waveRule}<h1 class="display">Fund a local economic engine, and put your name on it.</h1><p class="lede">A grant or sponsorship here is a measurable investment in Ventura County.</p><div style="margin-top:24px">${candidSeal()}</div></header></div></section>
    <section class="section section--pale section--tight"><div class="wrap"><div style="margin-top:8px">${statStrip()}</div></div></section>
    <section class="section"><div class="wrap">${head('Sponsorship levels', 'The Founder\'s Circle, built for partners.')}${tierGrid()}</div></section>
    <section class="section section--pale"><div class="wrap wrap--narrow">${head('Become a sponsor', 'Start the conversation.')}${form('partner-foundations', 'Become a sponsor', true)}</div></section>` +
    ctaBand('Put your name behind the inaugural cohort.', 'partner'),
});

// ABOUT
page('about.html', {
  title: 'About', crumbsTrail: [['Home', 'index.html'], ['About', '']],
  body: pageHead('About', 'Built to keep Ventura County the best place to live.', 'A local nonprofit backing local founders.') +
    `<section class="section section--pale grain"><div class="wrap">${head('Mission & Model', 'Why we exist, and how we do the work.')}<div class="measure"><p class="lede">To keep Ventura County the best place in the world to live by fueling entrepreneurship, building high-growth companies, and transforming our region into a recognized hub of innovation.</p><p>We run a nonprofit accelerator paired with a pre-accelerator workshop series. Every dollar stays local.</p></div></div></section>
    <section class="section"><div class="wrap">${head('Board & Team', 'A board that has built and scaled here.')}${boardGrid(true)}<p class="center" style="margin-top:32px"><a class="card__link" href="luke-erickson-executive-director.html">Read the announcement: Luke Erickson, Executive Director &rarr;</a></p></div></section>` +
    ctaBand('Help us keep Ventura County the best place to live.', 'partner'),
});

// CONTACT
page('contact.html', {
  title: 'Contact', crumbsTrail: [['Home', 'index.html'], ['Contact', '']],
  body: `<section class="section"><div class="wrap"><div class="contact-layout">
    <div><p class="eyebrow">Contact</p>${waveRule}<h1 class="display">Send us a message</h1><p class="lede">Fill out the form below and we will get back to you. Tell us a little about yourself and what you are interested in, whether that is the cohort, partnership, mentoring, or something else.</p><div style="margin-top:28px">${form('contact', 'Send Message', false, true, { phone: true, twoCol: true, interest: ['General', 'Press', 'Major Gifts', 'Sponsorship', 'Investor inquiry', 'Mentoring', 'Other'] })}</div></div>
    <aside class="contact-aside"><h2 class="display">Other ways to reach us</h2>
      <div class="contact-aside__block"><h3>Email</h3><a href="mailto:info@startupventura.com">info@startupventura.com</a></div>
      <div class="contact-aside__block"><h3>Partnerships &amp; sponsorship</h3><a href="mailto:sponsor@startupventura.com">sponsor@startupventura.com</a></div>
      <div class="contact-aside__block"><h3>Follow us</h3><p>Follow Startup Ventura for events, founders, and announcements.</p><span class="contact-aside__social"><a href="https://www.linkedin.com/company/startup-ventura" target="_blank" rel="noopener">LinkedIn</a><a href="https://www.instagram.com/startup_ventura/" target="_blank" rel="noopener">Instagram</a></span></div>
      <div class="contact-aside__block"><h3>Area</h3><p>Serving all of Ventura County, California.</p></div>
      <div class="contact-card"><h3>What happens next</h3><p>We read every message. Expect a reply from a real member of the Startup Ventura team, usually within a few days.</p></div>
    </aside>
  </div></div></section>
  <section class="section section--pale" id="notify"><div class="wrap wrap--narrow">${head('Applications', 'Get notified when S27 applications open.', 'Drop your email and we will tell you the moment the cohort opens.')}${form('notify', 'Notify me', false, false)}</div></section>` +
    ctaBand('Give Ventura County&rsquo;s founders a reason to stay.', 'apply'),
});

// NEWS — archive + one clickable article page per post (newest first)
const newsPosts = [
  {
    // Custom single page generated separately (full SEO head + Person schema).
    file: 'luke-erickson-executive-director.html', crumb: 'Executive Director', custom: true,
    title: 'Luke Erickson Steps Into the Role of Executive Director at Startup Ventura',
    date: 'July 1, 2026', img: `${A}/img/team/luke-erickson.jpg`,
    alt: 'Luke Erickson, Founder and Executive Director of Startup Ventura.',
    excerpt: 'Luke Erickson, founder of Startup Ventura, steps into the role of Executive Director, leading the Ventura County accelerator he built to keep local talent home.',
  },
  {
    file: 'news-candid-platinum-seal.html', crumb: 'Platinum Seal',
    title: 'Startup Ventura Earns Candid\'s Platinum Seal of Transparency',
    date: 'June 24, 2026', img: `${A}/img/news/candid-platinum-seal.jpg?v=2`, alt: 'Startup Ventura earns the Candid 2026 Platinum Seal of Transparency',
    excerpt: 'Startup Ventura has earned the 2026 Platinum Seal of Transparency, the highest level Candid awards, giving donors and funders a complete, verified view of how we operate.',
    paras: [
      '<strong>Fewer than 1% of U.S. nonprofits hold Candid&rsquo;s Platinum Seal of Transparency. Startup Ventura is now one of them.</strong>',
      'We earned the 2026 Platinum Seal from Candid, the organization formed by the merger of GuideStar and Foundation Center, whose database funders, foundations, and donors across the country use to research nonprofits. Platinum is the highest of four levels. Earning it means we have published our financials, our governance and board, our mission and programs, and the specific goals and impact metrics we hold ourselves to.',
      'For a young organization asking the community to invest in its first cohort of founders, this matters. We are asking people and institutions to put real money behind local entrepreneurs. They deserve complete visibility into how that money is managed and what it produces. The Platinum Seal is independent, third-party proof that we operate that way.',
      'It also pairs with our 501(c)(3) status to give funders confidence at a glance. Many foundations and corporate and institutional funders now look for a Candid Seal, often at the Gold or Platinum level, before they give. We are starting at the top.',
      'Transparency is how we intend to run this organization, starting now. You can see <a href="https://app.candid.org/profile/16385291/startup-ventura/?pkId=266ecad1-f625-40ab-acfb-c736d5b97833&amp;isActive=true" target="_blank" rel="noopener">our full profile on Candid</a>.',
    ],
  },
  {
    file: 'news-stephanie-board.html', crumb: 'New Board Member',
    title: 'Stephanie Caldwell Joins the Startup Ventura Board of Directors',
    date: 'February 28, 2026', img: `${A}/img/team/stephanie-caldwell.jpg`, alt: 'Stephanie Caldwell',
    excerpt: 'Stephanie Caldwell, a longtime champion of Ventura business and a leader at the Ventura Chamber of Commerce, has joined our Board of Directors.',
    paras: [
      'Startup Ventura is honored to welcome Stephanie Caldwell to our Board of Directors.',
      'Few people have spent more of their career advocating for Ventura business than Stephanie. As President and CEO at the Ventura Chamber of Commerce since 2015, she has built a reputation as a tireless champion for local employers, workforce development, and economic opportunity across the region. She also serves as a director for the California Chamber of Commerce, which gives her a statewide view of what helps businesses grow and what holds them back.',
      'Her path here reflects the kind of operating experience our board is built on. Before Ventura, Stephanie led contingent staffing operations in Silicon Valley supporting major technology companies, and served as Chief Operations Officer of the San Jose Silicon Valley Chamber of Commerce. Her career spans sales, operations, workforce management, public service, and industry associations. She knows how businesses actually get built and supported, from the ground floor up.',
      'What she brings to Startup Ventura is more than a resume. It is a genuine, long-running commitment to seeing Ventura County businesses thrive. That is the entire reason we exist, and Stephanie has been living it for years.',
      'We could not be more excited to have her help guide what comes next. Welcome, Stephanie.',
    ],
  },
  {
    file: 'news-annual-benefit.html', crumb: 'Annual Benefit',
    title: 'Startup Ventura Annual Benefit: A Night to Remember',
    date: 'November 17, 2025', img: `${A}/img/event/annual-benefit-venue.jpg`, alt: 'The Annual Benefit venue at dusk',
    excerpt: 'Founders, officials, and supporters braved the storm and helped raise $17,000 to fuel entrepreneurship in Ventura.',
    paras: [
      'On Friday, November 14th, we hosted our first-ever Startup Ventura Annual Benefit, bringing together an incredible cross-section of our community. Founders, Ventura Community College leadership, Chamber board members, city and county officials, and supporters all showed up despite the stormy weather to rally behind the future of entrepreneurship in Ventura.',
      'With signature cocktails crafted by the Ventura Chamber of Commerce, a full buffet from Santa Cruz Market, and keynote remarks from Startup Ventura leadership and local officials, the evening carried a sense of purpose and momentum. Most importantly, our community helped raise $17,000 to fuel Startup Ventura’s mission.',
      'We heard from Luke Erickson, Deputy Mayor Doug Halter, Brent Kraus, Brian Gonzalez, and John Will III, each helping spotlight the vision for an incubator launching in early 2026.',
      'Conversations throughout the night centered on Ventura’s entrepreneurial potential, and the role local leaders will play in shaping a thriving startup ecosystem.',
      'A massive thank-you to our sponsors: Ventura Chamber of Commerce, Ventura County Credit Union, and Santa Cruz Market.',
      'And we’re grateful to Doug and Randy for opening their beautiful space for the evening.',
    ],
    extra: `<div class="entry-gallery">${[1, 2, 3, 4, 5, 6].map(n => `<img src="${A}/img/event/benefit-0${n}.jpg" alt="Startup Ventura Annual Benefit photo ${n}" loading="lazy">`).join('')}</div>`,
  },
  {
    file: 'news-city-investment.html', crumb: 'City of Ventura',
    title: 'The City of Ventura Invests $49,500 in Startup Ventura',
    date: 'November 1, 2025', img: `${A}/img/ventura-pier.jpg`, alt: 'Aerial view of downtown Ventura and the pier',
    excerpt: 'The City of Ventura’s Economic Development department has committed $49,500 to Startup Ventura, backing local founders and the companies they will build here.',
    paras: [
      'The City of Ventura has invested $49,500 in Startup Ventura through its Economic Development department, a significant vote of confidence in our mission and our model.',
      'This is what a real public-private partnership looks like. The city is not simply endorsing the idea of a stronger entrepreneurial economy. It is funding it. The investment directly supports our accelerator and the founders who come through it. As part of our partnership, seats in each cohort are reserved for entrepreneurs based in the City of Ventura, which ensures this investment comes home to local founders.',
      'The logic is straightforward. High-growth companies create jobs, payroll, and economic activity that ripple across the entire community. By investing early in the founders who build those companies, the City of Ventura is investing in its own future tax base, its own job market, and its own long-term resilience.',
      'We are grateful to the City of Ventura’s Economic Development team for their leadership and their belief in what Ventura County founders can build. This is a model we intend to grow.',
    ],
  },
  {
    file: 'news-board-gonzalez-kraus.html', crumb: 'New Board Members',
    title: 'Brian Gonzalez and Brent Kraus Join the Startup Ventura Board',
    date: 'July 10, 2025', img: `${A}/img/news/board-gonzalez-kraus.jpg`, alt: 'Brian Gonzalez and Brent Kraus',
    excerpt: 'Two proven operators, Curri co-founder Brian Gonzalez and SaaS revenue leader Brent Kraus, have joined the Startup Ventura Board of Directors.',
    paras: [
      'Startup Ventura is proud to welcome two accomplished operators to our Board of Directors: Brian Gonzalez and Brent-Stig Kraus.',
      'Brian Gonzalez is the co-founder and CTO of Curri, the nationwide delivery and logistics platform he launched in downtown Ventura. He has been building in startups since 2010, when he started his career at Dollar Shave Club, and Curri has since raised capital from leading investors including Y Combinator and Bessemer Venture Partners. Brian is proof of exactly what we are trying to make ordinary in Ventura County: a high-growth company, founded and headquartered right here.',
      'Brent Kraus brings two decades of experience scaling SaaS companies through hypergrowth and major exits. He most recently served as Chief Revenue Officer at SevenRooms, acquired by DoorDash in a $1.2 billion deal, and previously held leadership roles at MINDBODY and Lynda.com through their respective billion-dollar acquisitions. His expertise in go-to-market strategy and building high-performing teams is exactly the kind of guidance our founders need.',
      'Together, Brian and Brent strengthen a board built around people who have actually done the work: founded companies, scaled them, and created jobs. Their experience will directly shape how we prepare Ventura County founders to do the same. Welcome to the team.',
    ],
  },
  {
    file: 'news-501c3.html', crumb: '501(c)(3) Status',
    title: 'Startup Ventura Is Now a 501(c)(3) Nonprofit',
    date: 'May 14, 2025', img: `${A}/img/hero.jpg`, alt: 'Ventura, California',
    excerpt: 'The IRS has granted Startup Ventura 501(c)(3) status, making every gift tax-deductible and laying the legal foundation for our work across Ventura County.',
    paras: [
      'Startup Ventura is officially a 501(c)(3) nonprofit. The IRS granted our tax-exempt status on May 14, 2025, a foundational step for everything we are building in Ventura County.',
      'Here is what that means in practical terms. Every gift to Startup Ventura is now tax-deductible to the extent allowed by law. We can pursue grants, accept foundation and corporate support, and operate with the governance and transparency that serious philanthropy requires. Our EIN is 39-2204612.',
      'What it means for the mission is bigger. Startup Ventura exists to keep Ventura County the best place in the world to live by helping local founders build high-growth companies here, instead of leaving to build them somewhere else. 501(c)(3) status turns that mission into an organization that people and institutions can invest in with confidence.',
      'This is the starting line, not the finish. With the legal foundation in place, our focus turns to the work itself: the partnerships, the funding, and the program that will put Ventura County founders in a position to succeed. Thank you to everyone who helped us get here. The best is ahead.',
    ],
  },
];

page('news.html', {
  title: 'News', crumbsTrail: [['Home', 'index.html'], ['News', '']],
  body: `<section class="section"><div class="wrap"><header class="page-head"><p class="eyebrow">News &amp; Updates</p>${waveRule}<h1 class="display">News &amp; Updates</h1></header>
  <div class="news-signup"><div class="news-signup__copy"><h2 class="news-signup__title">Stay up to date with events and announcements</h2><p class="muted">Get Startup Ventura news, events, and cohort updates in your inbox.</p></div><div class="news-signup__form">${form('newsletter', 'Subscribe', false, false)}</div></div>
  <div class="post-grid">${newsPosts.map(p => `<article class="post-card"><a href="${p.file}" tabindex="-1" aria-hidden="true"><img class="post-card__thumb" src="${p.img}" alt=""></a><div class="post-card__body"><p class="post-card__date">${p.date}</p><h2 class="post-card__title"><a href="${p.file}">${p.title}</a></h2><p class="post-card__excerpt">${p.excerpt}</p><a class="post-card__more" href="${p.file}">Read more &rarr;</a></div></article>`).join('')}</div></div></section>` +
    ctaBand('Help fund the inaugural cohort.', 'none'),
});

newsPosts.filter(p => !p.custom).forEach(p => page(p.file, {
  title: p.title, crumbsTrail: [['Home', 'index.html'], ['News', 'news.html'], [p.crumb, '']],
  body: `<section class="section"><div class="wrap"><article class="single-post">
    <header class="entry-header"><p class="entry-meta">News &middot; ${p.date}</p><h1 class="display">${p.title}</h1></header>
    <div class="entry-hero"><img src="${p.img}" alt="${p.alt}"></div>
    <div class="entry-content">${p.paras.map(t => `<p>${t}</p>`).join('')}${p.extra || ''}</div>
  </article></div></section>` +
    ctaBand('Help fund the inaugural cohort.', 'none'),
}));

// Luke Erickson, Executive Director — custom single page with full on-page SEO
// (title + H1 lead with the name, excerpt meta description, OG/Twitter, Person
// JSON-LD tied to the Org). Built to rank for searches of "Luke Erickson".
const lukeUrl = `${SITE}/luke-erickson-executive-director`;
const lukeExcerpt = 'Luke Erickson, founder of Startup Ventura, steps into the role of Executive Director, leading the Ventura County accelerator he built to keep local talent home.';
// Canonical "Luke Erickson" Person entity. Its @id is shared by the profile page
// (/lukeerickson, the person's canonical url) and the announcement post, so search
// engines treat them as one entity instead of two competing Luke pages.
const LUKE_PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE}/lukeerickson#luke`,
  name: 'Luke Erickson',
  jobTitle: 'Founder and Executive Director',
  worksFor: {
    '@type': 'NonprofitOrganization',
    name: 'Startup Ventura',
    taxID: '39-2204612',
    url: `${SITE}/`,
  },
  description: 'Founder and Executive Director of Startup Ventura, a 501(c)(3) startup accelerator in Ventura County, California.',
  image: `${SITE}/assets/img/team/luke-erickson.jpg`,
  url: `${SITE}/lukeerickson`,
  sameAs: [
    'https://www.linkedin.com/in/luke-erickson/',
    'https://www.instagram.com/luke_erickson/',
    'https://lukeerickson.com',
  ],
};
const lukeParas = [
  `Luke Erickson has stepped into the role of Executive Director of <a href="index.html">Startup Ventura</a>, the nonprofit startup accelerator he founded to transform Ventura County into a hub for innovation. He assumes day-to-day <a href="about.html">leadership of the organization</a> effective July 1, 2026, having served as its founder and chairman since its inception.`,
  `The move formalizes what has been true from the beginning. Startup Ventura is Luke Erickson's vision, built on a conviction that the region he calls home has everything it needs to compete with the country's great startup ecosystems, and that no one was yet doing the work to make it happen. So he decided to do it himself.`,
  `That conviction came from a problem he watched play out for years. Ventura County raises ambitious, talented people, educates them at strong local universities, and then loses them to San Francisco, Los Angeles, and beyond, because there is nowhere here to build. The shortage runs both directions. Even high-growth companies already rooted here, like Curri, the logistics startup headquartered in downtown Ventura, have to work hard to find the local talent they need to grow. He saw a region exporting its own future while the employers who stayed competed over too small a pool. Rather than accept it, he founded Startup Ventura to give local founders the mentorship, capital connections, and community to build high-growth companies without leaving, and to deepen the talent pool that every local company depends on. The idea is simple and ambitious at once: keep the talent, build the companies, and let the jobs and investment follow.`,
  `Under his leadership, the organization has moved quickly from idea to institution. Startup Ventura earned its 501(c)(3) status, secured a founding investment from the City of Ventura, and was awarded Candid's Platinum Seal of Transparency, the highest level, held by fewer than one percent of U.S. nonprofits. Its first annual benefit drew 75 supporters and raised funds toward an inaugural cohort of founders launching in Spring 2027. What began as one person's argument about his hometown has become a coalition of city government, universities, investors, and business leaders.`,
  `Luke Erickson brings a background in technology and business development to the civic sector, having built and exited his own company before turning his focus to building institutions. He pairs an ambitious long-term vision with the patience to assemble the partnerships that make it real, the kind of leadership that gets a city, a college district, and a room full of investors pulling in the same direction.`,
  `His commitment to Ventura County reaches well beyond Startup Ventura. He serves on the board of directors of the New West Symphony, mentors students at CSU Channel Islands, and works closely with local civic and economic development organizations to strengthen the region's future. A former collegiate lacrosse player, he brings the same competitiveness and discipline to building institutions that he once brought to the field.`,
  `"After I exited my first business, I made a conscious decision that I was going to have an outsized impact on this city and county, and turn it into a place that ambitious, innovative people want to call home," Erickson said. "That is the whole reason Startup Ventura exists. We are just getting started."`,
  `As Executive Director, he will lead Startup Ventura into its first full program year, with the inaugural cohort set to begin in Spring 2027. For Luke Erickson, it is less a new title than a deeper commitment to a mission he has carried from the start: making Ventura County the best place in the world to build something that lasts.`,
];
page('luke-erickson-executive-director.html', {
  title: 'Luke Erickson Steps Into the Role of Executive Director at Startup Ventura',
  crumbsTrail: [['Home', 'index.html'], ['News', 'news.html'], ['Executive Director', '']],
  desc: lukeExcerpt,
  canonical: lukeUrl,
  ogType: 'article',
  ogImage: `${SITE}/assets/img/team/luke-erickson.jpg`,
  jsonld: LUKE_PERSON,
  body: `<section class="section"><div class="wrap"><article class="single-post">
    <header class="entry-header"><p class="entry-meta">News &middot; July 1, 2026</p><h1 class="display">Luke Erickson Steps Into the Role of Executive Director at Startup Ventura</h1></header>
    <div class="entry-hero"><img src="${A}/img/team/luke-erickson.jpg" alt="Luke Erickson, Founder and Executive Director of Startup Ventura." width="1000" height="1000"></div>
    <div class="entry-content">${lukeParas.map(t => `<p>${t}</p>`).join('')}</div>
  </article></div></section>` +
    ctaBand('Help fund the inaugural cohort.', 'none'),
});

// Luke Erickson — evergreen Leadership profile page (the canonical "Luke Erickson"
// page; the Leadership nav points here). Shares the LUKE_PERSON @id with the
// announcement post so the two don't compete, and cross-links to it.
const lukeProfileParas = [
  `Luke Erickson is the founder and Executive Director of <a href="index.html">Startup Ventura</a>, the 501(c)(3) nonprofit startup accelerator backing founders across Ventura County, California. He started the organization in 2025 to keep the region's ambitious, talented people building here rather than leaving for San Francisco or Los Angeles.`,
  `Luke brings a background in technology and business development to the civic sector, having built and exited his own company before turning his focus to building institutions. He launched Startup Ventura to bring nationally recognized accelerator programming to Ventura County, giving local founders the mentorship, capital connections, and community to build high-growth companies at home.`,
  `Under his leadership, Startup Ventura earned its 501(c)(3) status, secured a founding investment from the City of Ventura, and was awarded Candid's Platinum Seal of Transparency, held by fewer than one percent of U.S. nonprofits. The inaugural cohort of founders launches in Spring 2027.`,
  `His commitment to Ventura County reaches beyond Startup Ventura. He serves on the board of directors of the New West Symphony, mentors students at CSU Channel Islands, and works closely with local civic and economic development organizations. A former collegiate lacrosse player, he brings the same competitiveness and discipline to building institutions that he once brought to the field.`,
];
page('lukeerickson.html', {
  title: 'Luke Erickson — Founder & Executive Director',
  crumbsTrail: [['Home', 'index.html'], ['About', 'about.html'], ['Luke Erickson', '']],
  desc: 'Luke Erickson is the founder and Executive Director of Startup Ventura, the 501(c)(3) startup accelerator backing founders in Ventura County, California.',
  canonical: `${SITE}/lukeerickson`,
  ogType: 'profile',
  ogImage: `${SITE}/assets/img/team/luke-erickson.jpg`,
  jsonld: LUKE_PERSON,
  body: `<section class="section"><div class="wrap">
    <div class="profile">
      <div class="profile__media"><img src="${A}/img/team/luke-erickson.jpg" alt="Luke Erickson, Founder and Executive Director of Startup Ventura." width="1000" height="1000"></div>
      <div class="profile__intro">
        <p class="eyebrow">Leadership</p>${waveRule}
        <h1 class="display">Luke Erickson</h1>
        <p class="profile__role">Founder &amp; Executive Director, Startup Ventura</p>
        <p class="profile__links"><a href="https://www.linkedin.com/in/luke-erickson/" target="_blank" rel="noopener">LinkedIn &nearr;</a><a href="https://www.instagram.com/luke_erickson/" target="_blank" rel="noopener">Instagram &nearr;</a><a href="https://lukeerickson.com" target="_blank" rel="noopener">lukeerickson.com &nearr;</a></p>
      </div>
    </div>
  </div></section>
  <section class="section section--pale"><div class="wrap wrap--narrow">
    <div class="entry-content">${lukeProfileParas.map(t => `<p>${t}</p>`).join('')}<p style="margin-top:8px"><a class="card__link" href="luke-erickson-executive-director.html">Read the announcement: Luke Erickson named Executive Director &rarr;</a></p></div>
  </div></section>` +
    ctaBand('Help keep Ventura County\'s founders building here.', 'partner'),
});

page('privacy.html', {
  title: 'Privacy Policy', crumbsTrail: [['Home', 'index.html'], ['Privacy', '']],
  body: pageHead('Legal', 'Privacy policy', 'How Startup Ventura collects, uses, and protects the information you share with us.') +
    `<section class="section"><div class="wrap wrap--narrow"><div class="entry-content"><p><em>Last updated June 2026.</em></p><p>Startup Ventura is a 501(c)(3) nonprofit based in Ventura County, California. We collect only what we need to do our work.</p><h2>Information we collect</h2><p>The details you submit through our forms (name, email, phone, organization, area of interest, message), and the information needed to acknowledge donations, which are processed by our partner Zeffy. We do not store full payment card numbers.</p><h2>How we use it</h2><p>To respond to you, process and acknowledge gifts, send the updates you requested, and improve the site.</p><h2>Analytics and sharing</h2><p>We may use privacy-conscious analytics and Cloudflare Turnstile to protect our forms. We do not sell your information and share it only with service providers as needed.</p><h2>Your choices</h2><p>Unsubscribe any time, or email us to access, correct, or delete your information.</p><h2>Contact</h2><p>Email <a href="mailto:info@startupventura.com">info@startupventura.com</a>. EIN 39-2204612.</p></div></div></section>`,
});

page('terms.html', {
  title: 'Terms of Use', crumbsTrail: [['Home', 'index.html'], ['Terms', '']],
  body: pageHead('Legal', 'Terms of use', 'The terms that govern your use of the Startup Ventura website.') +
    `<section class="section"><div class="wrap wrap--narrow"><div class="entry-content"><p><em>Last updated June 2026.</em></p><p>By using this site you agree to these terms. If you do not agree, please do not use the site.</p><h2>Donations</h2><p>Donations are processed by our partner Zeffy. Startup Ventura is a 501(c)(3) nonprofit, EIN 39-2204612, and gifts are tax-deductible to the extent allowed by law.</p><h2>Impact calculator and projections</h2><p>Figures shown in our impact calculator are illustrative estimates based on assumptions we choose. They are not a guarantee of any outcome, and they are not investment, financial, tax, or legal advice. Please consult your own advisors.</p><h2>Intellectual property</h2><p>The content, logos, and marks on this site belong to Startup Ventura, except press materials we provide for media use.</p><h2>Disclaimer</h2><p>The site is provided as is, without warranties of any kind, to the fullest extent allowed by law.</p><h2>Contact</h2><p>Email <a href="mailto:info@startupventura.com">info@startupventura.com</a>.</p></div></div></section>`,
});

page('press.html', {
  title: 'Press & Media Kit', crumbsTrail: [['Home', 'index.html'], ['Press', '']],
  body: pageHead('Press', 'Press &amp; media kit', 'Everything you need to cover Startup Ventura. For interviews or more information, contact us any time.') +
    `<section class="section"><div class="wrap wrap--narrow"><div class="entry-content"><h2>About Startup Ventura</h2><p>Startup Ventura is a 501(c)(3) nonprofit startup accelerator in Ventura County, California. We back local founders with the mentorship, capital connections, and community to build high-growth companies, and to keep that talent and those jobs in Ventura County. Our inaugural Spring 2027 cohort is now being funded.</p><h2>Quick facts</h2><ul><li>501(c)(3) nonprofit startup accelerator</li><li>EIN 39-2204612</li><li>Ventura County, California</li><li>A 7-week accelerator, a founder workshop series, and a Demo Day</li><li>Inaugural cohort: Spring 2027</li></ul><h2>Logos</h2><p><a href="${A}/img/logo.png" download>Download logo (color)</a><br><a href="${A}/img/logo-white.png" download>Download logo (white)</a></p><h2>Leadership</h2><p>Led by operators behind Curri, SevenRooms, and the Ventura Chamber of Commerce. Read more on our <a href="about.html">About page</a>.</p><h2>Press contact</h2><p>Email <a href="mailto:info@startupventura.com">info@startupventura.com</a>, or use our <a href="contact.html">contact form</a> and choose "Press."</p></div></div></section>`,
});

console.log('Generated', fs.readdirSync(OUT).length, 'pages into preview/site/:', fs.readdirSync(OUT).sort().join(', '));
