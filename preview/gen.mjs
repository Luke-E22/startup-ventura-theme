// Generates a fully click-navigable static preview of the Startup Ventura site
// into preview/site/*.html, sharing one header/footer with the production nav,
// wiring the real stylesheet + JS, and binding Give to the real Zeffy modal.
// This is a VERIFICATION/DEMO artifact only — the WordPress theme is the source
// of truth. Run: node preview/gen.mjs
import fs from 'fs';
import path from 'path';

const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'site');
// Clean first so removed/renamed pages never linger as stale files (which
// build-dist would otherwise copy into the deploy).
fs.rmSync(OUT, { recursive: true, force: true });
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
// Centered section header (wave-rule centers via .section-head--center).
const headC = (e, h, lede = '') => `<header class="section-head section-head--center"><p class="eyebrow">${e}</p>${waveRule}<h2 class="section-head__title display">${h}</h2>${lede ? `<p class="section-head__intro lede">${lede}</p>` : ''}</header>`;
// The Mead epigraph — one source so styling stays uniform everywhere the
// "small group" framing earns its place (/connected, Give, Donor Wall, About).
const MEAD_QUOTE = `<blockquote class="pull-quote">&ldquo;Never doubt that a small group of thoughtful, committed citizens can change the world; indeed, it is the only thing that ever has.&rdquo;<footer>Attributed to Margaret Mead</footer></blockquote>`;

// <picture> with WebP + a resized JPEG fallback. Variants are pre-generated by
// the image optimizer (committed into the assets tree), following the
// -360/-760 (content) or hero-960/hero-1600 naming. Any src without variants
// (e.g. PNG logos) degrades to a plain lazy <img>.
const pic = (src, { cls = '', w, h, style = '', alt = '', sizes = '100vw', eager = false } = {}) => {
  const bareJpg = src.replace(/\?.*$/, '');
  const m = bareJpg.match(/^(.*\/img\/)(.+)\.jpg$/);
  const load = eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
  let srcset = '', fallback = src;
  if (m) {
    const [, dir, key] = m;
    if (key === 'hero') {
      srcset = `${dir}hero-960.webp 960w, ${dir}hero-1600.webp 1600w`;
      fallback = `${dir}hero-1600.jpg`;
    } else {
      srcset = `${dir}${key}-360.webp 360w, ${dir}${key}-760.webp 760w`;
      fallback = `${dir}${key}-760.jpg`;
    }
  }
  const img = `<img${cls ? ` class="${cls}"` : ''} src="${fallback}"${w ? ` width="${w}"` : ''}${h ? ` height="${h}"` : ''}${style ? ` style="${style}"` : ''} alt="${alt}"${load}>`;
  return srcset ? `<picture><source type="image/webp" srcset="${srcset}" sizes="${sizes}">${img}</picture>` : img;
};

// Flip to true when the events series is announced: adds Events to the nav
// (right half, before Contact) AND lifts the noindex on events.html so it
// enters the sitemap. Until then the page is live but unlisted.
const SHOW_EVENTS_NAV = false;
const NAV = [
  { label: 'Program', href: 'program.html', children: [['7-Week Accelerator', 'accelerator.html'], ['Workshop Series', 'workshops.html']] },
  { label: 'Impact', href: 'impact.html' },
  { label: 'Partner', href: 'partner.html', children: [['For Cities &amp; County', 'partner-cities-county.html'], ['For Foundations', 'partner-foundations.html']] },
  { label: 'About', href: 'about.html', children: [['Board of Directors', 'about.html'], ['Leadership', 'lukeerickson.html'], ['Why Ventura County', 'why-ventura-county.html']] },
  ...(SHOW_EVENTS_NAV ? [{ label: 'Events', href: 'events.html' }] : []),
  { label: 'Contact', href: 'contact.html' },
  { label: 'News', href: 'news.html' },
];
const navList = (items = NAV) => `<ul class="sv-menu">${items.map(i => i.children
  ? `<li class="menu-item menu-item-has-children"><a href="${i.href}">${i.label}</a><ul class="sub-menu">${i.children.map(c => `<li class="menu-item"><a href="${c[1]}">${c[0]}</a></li>`).join('')}</ul></li>`
  : `<li class="menu-item"><a href="${i.href}">${i.label}</a></li>`).join('')}</ul>`;

const header = (overHero = false) => `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header${overHero ? ' site-header--over-hero' : ''}">
  <div class="wrap site-header__inner">
    <nav class="primary-nav primary-nav--left" aria-label="Primary">${navList(NAV.slice(0, 3))}</nav>
    <a class="site-brand" href="index.html" rel="home" aria-label="Startup Ventura home">
      <img class="brand-mark brand-mark--color" src="${A}/img/logo-mark.png" height="36" alt="Startup Ventura">
      <img class="brand-mark brand-mark--white" src="${A}/img/logo-mark-white.png" height="36" alt="" aria-hidden="true">
    </a>
    <div class="nav-right">
      <div class="primary-nav primary-nav--right">${navList(NAV.slice(3))}</div>
      <div class="header-cta">${give('header')}
        <button class="menu-toggle" type="button" aria-controls="sv-mobile-menu" aria-expanded="false"><span class="sr-only">Menu</span><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
      </div>
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
    <div class="footer-brand"><img src="${A}/img/logo-white.png" width="280" height="91" alt="Startup Ventura"><p>A 501(c)(3) nonprofit startup accelerator backing local founders in Ventura County.</p>${candidSeal('footer-seal')}${chamberBadge()}
    <div class="footer-social">
      <a href="https://www.linkedin.com/company/startup-ventura" aria-label="LinkedIn" rel="noopener" target="_blank"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.3 8h4.4v13H.3V8zm7.5 0h4.2v1.8h.06c.58-1.05 2-2.16 4.12-2.16 4.4 0 5.22 2.9 5.22 6.67V21h-4.4v-5.92c0-1.41-.03-3.23-1.97-3.23-1.97 0-2.27 1.54-2.27 3.13V21h-4.4V8z"/></svg></a>
      <a href="https://www.facebook.com/startupventura/" aria-label="Facebook" rel="noopener" target="_blank"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"/></svg></a>
      <a href="https://www.instagram.com/startup_ventura/" aria-label="Instagram" rel="noopener" target="_blank"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.98c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.22.55.47.94.88 1.35.41.41.8.66 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07zm0 3.37a4.45 4.45 0 1 1 0 8.9 4.45 4.45 0 0 1 0-8.9zm0 7.34a2.89 2.89 0 1 0 0-5.78 2.89 2.89 0 0 0 0 5.78zm5.66-7.57a1.04 1.04 0 1 1-2.08 0 1.04 1.04 0 0 1 2.08 0z"/></svg></a>
    </div></div>
    <div class="footer-col"><p class="footer-col__title">Explore</p><ul><li><a href="program.html">The Program</a></li><li><a href="why-ventura-county.html">Why Ventura County</a></li><li><a href="impact.html">Impact</a></li><li><a href="give.html">Give</a></li><li><a href="partner.html">Partner</a></li><li><a href="about.html">About</a></li><li><a href="news.html">News</a></li><li><a href="contact.html">Contact</a></li><li><a href="faq.html">FAQ</a></li><li><a href="donor-wall.html">Donor Wall</a></li><li class="footer-hiring"><a href="careers.html">Join our team <span class="sep">|</span> Careers</a></li><li class="footer-note-link"><a href="explore-83-palm.html">83 Palm St &middot; concept study</a></li></ul></div>
    <div class="footer-col"><p class="footer-col__title">Get in touch</p><ul><li><a href="mailto:info@startupventura.com">info@startupventura.com</a></li><li><a href="mailto:sponsor@startupventura.com">sponsor@startupventura.com</a></li><li><a href="press.html">Press &amp; media kit</a></li></ul></div>
  </div><div class="footer-legal"><span>Startup Ventura is a 501(c)(3) nonprofit. EIN 39-2204612. Gifts are tax-deductible to the extent allowed by law.</span><span>&copy; 2026 Startup Ventura</span><span class="footer-legal__links"><a href="privacy.html">Privacy</a> &middot; <a href="terms.html">Terms</a></span><span class="footer-legal__credit">Website by <a href="https://lukeerickson.com" target="_blank" rel="noopener">Luke Erickson</a></span></div></div>
</footer>`;

const crumbs = (trail) => `<nav class="breadcrumbs wrap" aria-label="Breadcrumb"><ol>${trail.map((t, i) => `<li>${t[1] && i < trail.length - 1 ? `<a href="${t[1]}">${t[0]}</a>` : `<span aria-current="page">${t[0]}</span>`}</li>`).join('')}</ol></nav>`;

// Production origin for absolute SEO URLs (canonical, Open Graph, JSON-LD).
const SITE = 'https://startupventura.com';

// News post dates are authored as human strings ('July 8, 2026'); article:published_time
// and schema datePublished need ISO 8601. Anchor to 9am Pacific so the calendar date is
// unambiguous across time zones.
const MONTHS = { January: '01', February: '02', March: '03', April: '04', May: '05', June: '06', July: '07', August: '08', September: '09', October: '10', November: '11', December: '12' };
const isoDate = (human) => {
  const m = String(human).match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  return m ? `${m[3]}-${MONTHS[m[1]] || '01'}-${m[2].padStart(2, '0')}T09:00:00-07:00` : '';
};

// Organization entity — emitted on every page so search + AI engines have a
// consistent, machine-readable identity for Startup Ventura.
const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['NGO', 'NonprofitOrganization'],
  '@id': `${SITE}/#organization`,
  name: 'Startup Ventura',
  url: `${SITE}/`,
  logo: `${SITE}/assets/img/logo.png`,
  image: `${SITE}/assets/img/og/og-default.jpg`,
  description: 'Startup Ventura is a 501(c)(3) nonprofit startup accelerator in Ventura County, California, backing early-stage founders with mentorship, capital connections, and community so they can build high-growth companies at home.',
  slogan: 'Great founders grow up here.',
  foundingDate: '2025',
  founder: { '@type': 'Person', name: 'Luke Erickson', url: 'https://lukeerickson.com' },
  nonprofitStatus: 'Nonprofit501c3',
  taxID: '39-2204612',
  email: 'info@startupventura.com',
  areaServed: { '@type': 'AdministrativeArea', name: 'Ventura County, California' },
  address: { '@type': 'PostalAddress', addressLocality: 'Ventura', addressRegion: 'CA', addressCountry: 'US' },
  knowsAbout: ['startup accelerator', 'entrepreneurship', 'economic development', 'venture capital', 'Ventura County'],
  sameAs: [
    'https://www.linkedin.com/company/startup-ventura',
    'https://www.instagram.com/startup_ventura/',
    'https://www.facebook.com/startupventura/',
  ],
};

// Google Analytics: paste the ID and rebuild. Supports a GA4 Measurement ID
// ("G-XXXXXXXXXX", loads gtag.js) or a Tag Manager container ("GTM-XXXXXXX").
// Empty string = no analytics emitted.
const ANALYTICS_ID = 'G-6S0JCLV6SJ';
// GTM container + GA4 run side by side: GA4 (gtag) owns analytics + key events;
// GTM is the tag bus for everything else (Ads conversion tags, pixels). RULE: do
// NOT add a GA4 tag inside the GTM container or every pageview double-counts.
const GTM_ID = 'GTM-NGTJPLVT';
const analyticsHead = () => {
  let h = '';
  if (GTM_ID) h += `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');</script>\n`;
  if (ANALYTICS_ID) h += `<script async src="https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ANALYTICS_ID}');</script>\n`;
  return h;
};
// GTM noscript fallback — emitted immediately after <body> on every page.
const analyticsBody = () => GTM_ID ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n` : '';

// Public calendar-subscribe URL for the /events page. NOTE: Luke's original
// link had /u/1/ in it, which targets the SECOND signed-in account of whoever
// clicks it; /calendar/r?cid=... works for any visitor's default account.
const EVENTS_CAL_URL = 'https://calendar.google.com/calendar/r?cid=Y18yZjM4Y2Y3Y2EwMDU5ZGQxYmIyZDBiYzEwMjFlMjhlN2YwYTlhODRhYmY1ZTQzNzJhMmY1MWQ3NjY4YTk0ZTljQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20';

// Events schedule — sourced from the Notion "Website Events" database via
// scripts/fetch-events.mjs, which refreshes preview/events-data.json at build
// time (the committed JSON is the fail-soft snapshot; edit events in NOTION,
// not here). Rendering rules: upcoming only (past events fall off on the next
// nightly rebuild), sorted by date, year shown when it differs from the build
// year. Titles/tags are external data, so the renderer escapes them.
const EVENTS_JSON = path.join(path.dirname(new URL(import.meta.url).pathname), 'events-data.json');
const fmtEventDate = (iso) => {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  const label = `${d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${d.getUTCDate()}`;
  return d.getUTCFullYear() === new Date().getUTCFullYear() ? label : `${label}, ${d.getUTCFullYear()}`;
};
const eventCutoff = new Date(Date.now() - 864e5).toISOString().slice(0, 10); // yesterday
const workshopEvents = JSON.parse(fs.readFileSync(EVENTS_JSON, 'utf8'))
  .filter((e) => e.date.slice(0, 10) >= eventCutoff)
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((e) => ({ iso: e.date.slice(0, 10), date: fmtEventDate(e.date), tag: e.tag, title: e.title }));

// Per-event "add to calendar": a Google Calendar template link plus a static
// .ics file (Apple/Outlook), one per event, generated alongside the pages.
// All-day events until times are set in Notion; description points at /events.
const EVENT_BLURB = 'A free Startup Ventura founder workshop. Details and invitations: https://startupventura.com/events';
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const dayAfter = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
const gcalAddUrl = (e) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${e.iso.replace(/-/g, '')}/${dayAfter(e.iso).replace(/-/g, '')}&details=${encodeURIComponent(EVENT_BLURB)}&ctz=America/Los_Angeles`;
const icsEsc = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');
const icsFile = (e) => {
  const file = `event-${slugify(e.title)}.ics`;
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Startup Ventura//Events//EN', 'BEGIN:VEVENT',
    `UID:sv-${slugify(e.title)}-${e.iso}@startupventura.com`, `DTSTAMP:${e.iso.replace(/-/g, '')}T000000Z`,
    `DTSTART;VALUE=DATE:${e.iso.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${dayAfter(e.iso).replace(/-/g, '')}`,
    `SUMMARY:${icsEsc(e.title)}`, `DESCRIPTION:${icsEsc(EVENT_BLURB)}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n') + '\r\n';
  fs.writeFileSync(path.join(OUT, file), body);
  return file;
};

// Collected as pages are generated; used to emit sitemap.xml at the end.
const PAGE_MANIFEST = [];

// Per-page meta descriptions, keyed by output filename (mirrors the WP theme's
// sv_meta_description map). Used as the fallback when a page() call omits desc.
const DESC = {
  'index.html': 'Startup Ventura is a 501(c)(3) nonprofit startup accelerator in Ventura County. Donate to fund the inaugural Spring 2027 founder cohort, apply, or partner with us.',
  'give.html': "Donate to fund Ventura County's first startup accelerator cohort, launching Spring 2027. Startup Ventura is a 501(c)(3), so your gift is tax-deductible.",
  'impact.html': "See Startup Ventura's traction and where your gift goes, from jobs to founder revenue, and model your own impact with the Ventura County cohort calculator.",
  'faq.html': 'Common questions about Startup Ventura, the 501(c)(3) startup accelerator in Ventura County: how the program works, how to apply, and ways to give or partner.',
  'partner.html': 'Partner with Startup Ventura. Cities, the county, foundations, and corporate sponsors backing high-growth founders across Ventura County.',
  'partner-foundations.html': 'Foundation and corporate giving for Startup Ventura, a 501(c)(3) accelerator in Ventura County. Sponsorship levels, grants, and partner recognition.',
  'partner-cities-county.html': 'A public-private economic development partner for Ventura County cities and the county. Keep founders, jobs, and the tax base local.',
  'why-ventura-county.html': 'Why Ventura County loses its best founders, and how Startup Ventura keeps high-growth companies and the jobs they create at home.',
  'accelerator.html': 'A 7-week accelerator for Ventura County founders. Mentorship, capital connections, workshops, and a Demo Day. Join the Spring 2027 notify list.',
  'program.html': 'The Startup Ventura program: a 7-week accelerator plus a workshop series for Ventura County founders, ending in a Demo Day.',
  'workshops.html': "Startup Ventura's founder workshop series, the on-ramp to the accelerator for early-stage founders in Ventura County.",
  'about.html': 'Startup Ventura is a 501(c)(3) nonprofit keeping Ventura County the best place to build, led by operators behind Curri, SevenRooms, and the Ventura Chamber.',
  'contact.html': 'Contact Startup Ventura for general questions, press, major gifts, sponsorship, mentoring, and investor inquiries. Based in Ventura County, California.',
  'news.html': 'News and announcements from Startup Ventura, the 501(c)(3) nonprofit startup accelerator backing founders across Ventura County, California.',
  'press.html': 'Press and media kit for Startup Ventura, the Ventura County nonprofit startup accelerator. Logos, boilerplate, EIN, board bios, and a press contact.',
  'privacy.html': 'How Startup Ventura collects, uses, and protects the information you share through donations and forms on this site.',
  'terms.html': 'The terms that govern your use of the Startup Ventura website.',
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Per-page SEO head tags: description, canonical, Open Graph, Twitter, JSON-LD.
const seoHead = ({ title, desc, canonical, ogType = 'website', ogImage, jsonld, robots, article }) => {
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
  h += `<meta property="fb:app_id" content="202766592142804">\n`;
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
  // Article metadata: gives LinkedIn/Facebook a publish date + author on news posts
  // (and Google an authored/dated document for article rich results).
  if (ogType === 'article' && article) {
    if (article.published) h += `<meta property="article:published_time" content="${esc(article.published)}">\n`;
    h += `<meta property="article:modified_time" content="${esc(article.modified || article.published)}">\n`;
    // LinkedIn's Post Inspector reads the plain HTML <meta name="author"> for its
    // "Author" field — it ignores article:author (a profile-URL property) and JSON-LD.
    // Emit both: name="author" for LinkedIn, article:author for OG-aware scrapers.
    h += `<meta name="author" content="${esc(article.author || 'Startup Ventura')}">\n`;
    h += `<meta property="article:author" content="${esc(article.author || 'Startup Ventura')}">\n`;
    if (article.section) h += `<meta property="article:section" content="${esc(article.section)}">\n`;
  }
  if (jsonld) {
    for (const obj of [].concat(jsonld)) {
      h += `<script type="application/ld+json">${JSON.stringify(obj)}</script>\n`;
    }
  }
  return h;
};

const page = (file, { title, overHero = false, body, crumbsTrail, desc, canonical, ogType = 'website', ogImage, jsonld, robots, noZeffy = false, article }) => {
  const fullTitle = `${title} — Startup Ventura`;
  // Every page gets a canonical: the home root, an explicit pretty route, or its real .html URL.
  const canon = canonical || (file === 'index.html' ? `${SITE}/` : `${SITE}/${file}`);
  PAGE_MANIFEST.push({ file, canonical: canon, robots: robots || '' });
  const metaDesc = desc || DESC[file] || '';
  // Organization schema on every page + any page-specific JSON-LD (Person, Article, JobPosting, FAQPage).
  const allJsonld = [ORG_SCHEMA].concat(jsonld ? [].concat(jsonld) : []);
  const seo = seoHead({ title: fullTitle, desc: metaDesc, canonical: canon, ogType, ogImage, jsonld: allJsonld, robots, article });
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${fullTitle}</title>
${seo}<link rel="preload" href="${A}/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${A}/fonts/hanken-latin.woff2" as="font" type="font/woff2" crossorigin>
${overHero ? `<link rel="preload" as="image" type="image/webp" imagesrcset="${A}/img/hero-960.webp 960w, ${A}/img/hero-1600.webp 1600w" imagesizes="100vw" fetchpriority="high">\n` : ''}
<link rel="icon" href="${A}/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${A}/img/favicon.png" sizes="any" type="image/png">
<link rel="apple-touch-icon" href="${A}/img/favicon-180.png">
<link rel="stylesheet" href="${A}/css/main.css?v=43">
${analyticsHead()}</head>
<body class="${overHero ? 'home' : ''}">
${analyticsBody()}
${header(overHero)}
${crumbsTrail ? crumbs(crumbsTrail) : ''}
${body}
${footer()}
${noZeffy ? '' : '<script src="https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js" defer></script>'}
<script src="${A}/js/main.js?v=39"></script>
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
  // ARCHIVED (board-requested, 2026-07-08): hidden until Sean is officially onboarded (~week of 2026-07-15). Remove `archived: true` to republish.
  { archived: true, n: 'Sean Herwaldt', r: 'Board Member, Director at Curri · SpaceX alum', p: 'team/sean-herwaldt.jpg', pos: 'center 40%', zoom: 1.4, li: 'https://www.linkedin.com/in/seanherwaldt/',
    bio: `Sean Herwaldt is a Director at Curri, the Series B last-mile logistics company, where he leads delivery operations. He started his career at SpaceX, which shaped how he works: first principles, no assumptions, move fast, and never confuse activity with progress. He then joined the longevity company NOVOS to build its operations from scratch, spending four years standing up a supply chain with no playbook, launching products from concept to shelf, rebuilding a customer-experience team with AI that made the team better rather than redundant, and writing his own tools when spreadsheets were no longer enough. Sean is drawn to the craft of taking an idea to something real, then making it repeatable and ready to scale, and he cares as much about the people doing the work as the work itself.` },
];
// On the About page the full bio shows by default (open); the home teaser keeps it collapsed.
const boardGrid = (openBios = false, shown = board.filter(b => !b.archived)) => `<div class="board-grid${openBios ? ' board-grid--wide' : ''}" style="--board-cols:${shown.length}">${shown.map(b => `<article class="board-card">${b.p ? `<div class="board-card__media">${pic(`${A}/img/${b.p}`, { cls: 'board-card__photo', w: 600, h: 720, alt: b.n, sizes: '(max-width:620px) 92vw, (max-width:1024px) 45vw, 240px', style: `${b.pos ? `object-position:${b.pos};` : ''}${b.zoom ? `transform:scale(${b.zoom});transform-origin:${b.pos || 'center'};` : ''}` })}</div>` : ''}<div class="board-card__body"><h3 class="board-card__name">${b.n}</h3><p class="board-card__role">${b.r}</p><details class="board-card__details"${openBios ? ' open' : ''}><summary>${openBios ? 'Bio' : 'Read bio'}</summary><p class="board-card__bio">${b.bio}</p></details>${(b.li || b.ig || b.site) ? `<p class="board-card__links">${b.li ? `<a href="${b.li}" target="_blank" rel="noopener">LinkedIn &nearr;</a>` : ''}${b.ig ? `<a href="${b.ig}" target="_blank" rel="noopener">Instagram &nearr;</a>` : ''}${b.site ? `<a href="${b.site}" target="_blank" rel="noopener">${b.site.replace(/^https?:\/\/(www\.)?/, '')} &nearr;</a>` : ''}</p>` : ''}</div></article>`).join('')}</div>`;

// Testimonials (mirror sv_testimonials(), verbatim) + partner logos (mirror sv_partners()).
const testimonials = [
  ['Sean H.', 'I was fortunate to attend the first annual Startup Ventura benefit dinner, and the energy in the room was contagious. Operators, founders, and policy makers all came together with one shared mission: expand opportunity in Ventura, attract top talent, and strengthen the community. I firmly believe that building an entrepreneurial culture here will create economic growth and open doors for generations to come. This is only the beginning, and I am excited to play a part in it.'],
  ['Jeff', 'Throughout my career I have worked with many of the premier venture and private equity firms. Last week I had the privilege to attend an inaugural event for Startup Ventura, meeting an impressive team led by Luke Erickson. It was a pleasure to see a group so focused on benefiting the community, creating new opportunities to support emerging businesses, support entrepreneurs and create jobs in Ventura County.'],
  ['John Will', 'Startup Ventura is building something special. Their remarkable team is not only helping entrepreneurs launch and grow, but also creating the kind of opportunities that allow people to plant real roots here in Ventura. Because of their work, more people can build a life in this community and play an active role in shaping its future.'],
  ['Rob Russel', 'Ventura County has an affordability problem that is also a brain drain problem. People grow up here, get educated here, and then have to leave because there are not enough opportunities to stay. Luke and the team are building something from the ground up by bringing together education, capital, entrepreneurs, and government to create the kind of community where founders can actually succeed, where local innovation drives local jobs and we stop losing our best people to other cities.'],
];
const testimonialGrid = () => `<div class="testimonials">${testimonials.map(([who, q]) => `<figure class="testimonial"><span class="testimonial__mark" aria-hidden="true">&ldquo;</span><blockquote class="testimonial__quote">${q}</blockquote><figcaption class="testimonial__attr">${who}</figcaption></figure>`).join('')}</div>`;
const partners = [
  ['City of Ventura', 'partners/city-of-ventura.png'],
  ['Ventura Community College District', 'partners/ventura-community-college.png'],
  ['Ventura County Credit Union', 'partners/ventura-county-credit-union.png'],
  ['Ventura Chamber of Commerce', 'partners/ventura-chamber.png'],
];
const partnerRow = () => `<div class="partner-row">${partners.map(([n, logo]) => `<div class="partner"><img src="${A}/img/${logo}" height="64" loading="lazy" decoding="async" alt="${n}"></div>`).join('')}</div>`;

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
  careers: 'Thanks for applying. We review every application and will reach out if there is a fit.',
  connect: 'Thanks. A real person will reach out within a day or two to find a time that works.',
  apply: 'You are in. When applications open for the Spring 2027 cohort, you will hear from us first.',
  mentor: 'Thank you. We will reach out to match your expertise with our founders.',
  workshop: 'Seat saved. You will get the first invitation when the next workshop is scheduled.',
  events: 'You are on the list. Every event invitation will land in your inbox.',
};
const form = (type, submit, org = false, msg = true, opts = {}) => {
  const phone = !!opts.phone, interest = opts.interest || null, two = !!opts.twoCol;
  const interestLabel = opts.interestLabel || 'Area of interest';
  const linkLabel = opts.linkLabel || null; // optional URL field (e.g. LinkedIn/resume)
  const msgLabel = opts.msgLabel || 'Message';
  const full = two ? ' field--full' : '';
  const id = (f) => `${type}-${f}`;
  return `<form class="form${two ? ' form--grid' : ''}" name="${type}" method="POST" data-netlify="true" data-netlify-honeypot="bot-field"${opts.redirect ? ` action="${opts.redirect}" data-redirect="${opts.redirect}"` : ''} data-success="${FORM_SUCCESS[type] || 'Thanks, we got it.'}">
<input type="hidden" name="form-name" value="${type}">
<p class="nf-hp" hidden aria-hidden="true"><label>Do not fill this out if you are human: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
${(type !== 'notify' && type !== 'newsletter') ? `<div class="field"><label for="${id('name')}">Name <span class="req">*</span></label><input id="${id('name')}" name="name" type="text" autocomplete="name" required></div>` : ''}
${org ? `<div class="field${full}"><label for="${id('org')}">Organization <span class="req">*</span></label><input id="${id('org')}" name="organization" type="text" autocomplete="organization" required></div>` : ''}
<div class="field"><label for="${id('email')}">Email <span class="req">*</span></label><input id="${id('email')}" name="email" type="email" autocomplete="email" required></div>
${phone ? `<div class="field"><label for="${id('phone')}">Phone</label><input id="${id('phone')}" name="phone" type="tel" autocomplete="tel"></div>` : ''}
${interest ? `<div class="field"><label for="${id('interest')}">${interestLabel}</label><select id="${id('interest')}" name="interest">${interest.map(o => `<option>${o}</option>`).join('')}</select></div>` : ''}
${linkLabel ? `<div class="field"><label for="${id('link')}">${linkLabel}</label><input id="${id('link')}" name="link" type="url" placeholder="https://" autocomplete="url"></div>` : ''}
${msg ? `<div class="field${full}"><label for="${id('message')}">${msgLabel}${opts.msgOptional ? '' : ' <span class="req">*</span>'}</label><textarea id="${id('message')}" name="message" rows="6"${opts.msgOptional ? '' : ' required'}></textarea></div>` : ''}
<div class="form__submit${full}"><button class="btn btn--blue" type="submit">${submit}</button></div><p class="form__status${full}" role="status" aria-live="polite"></p></form>`;
};
// Delegated submit handler for every Netlify form on a page (injected by page()).
const NF_SCRIPT = `<script>document.addEventListener('submit',function(e){var f=e.target;if(!f||!f.querySelector||!f.querySelector('input[name="form-name"]'))return;e.preventDefault();var s=f.querySelector('.form__status');var b=f.querySelector('button[type=submit]');if(b)b.disabled=true;fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()}).then(function(r){if(!r.ok)throw new Error(r.status);var tr=function(){try{if(window.dataLayer){dataLayer.push({event:'form_submit',form_name:f.getAttribute('name')});}if(window.gtag){gtag('event','form_submit',{form_name:f.getAttribute('name')});}}catch(err){}};var rd=f.getAttribute('data-redirect');if(rd){tr();window.location.href=rd;return;}if(s){s.className=s.className.replace(' is-err','')+' is-ok';s.textContent=f.getAttribute('data-success')||'Thanks, we got it.';}f.reset();tr();}).catch(function(){if(s){s.className=s.className.replace(' is-ok','')+' is-err';s.textContent='Something went wrong. Please email info@startupventura.com and we will take care of it.';}}).finally(function(){if(b)b.disabled=false;});});</script>`;

const pageHead = (e, h, lede) => `<section class="section"><div class="wrap"><header class="page-head"><p class="eyebrow">${e}</p>${waveRule}<h1 class="display">${h}</h1><p class="lede">${lede}</p></header></div></section>`;
const card = (href, eyebrow, title, text, link) => `<a class="card card--link" href="${href}"><div class="card__body">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h3 class="card__title">${title}</h3><p class="card__text">${text}</p><span class="card__link">${link}</span></div></a>`;

/* ---------------- pages ---------------- */

// HOME
page('index.html', {
  title: 'Home', overHero: true,
  body: `<section class="hero">${pic(`${A}/img/hero.jpg`, { cls: 'hero-bg-img', w: 1600, h: 1060, alt: 'Ventura, California', sizes: '100vw', eager: true })}<div class="hero-scrim"></div>
  <div class="hero-inner"><p class="eyebrow">Ventura County &middot; A 501(c)(3) Startup Accelerator</p><h1 class="display">Great founders grow up <span class="coral">here.</span></h1><p class="sub">Startup Ventura backs local founders with the mentorship, capital connections, and community to build high-growth companies right here in Ventura County.</p><div class="cta-row">${give('hero')}${apply('Apply', 'btn--ghost')}</div><p class="cta-note">Funds the inaugural Spring 2027 cohort.</p></div>${waveFull}</section>
  <section class="section mission-strip"><div class="wrap"><p class="eyebrow" style="color:var(--coral-light)">Our mission</p>${waveRule}<p class="mission">To keep Ventura County the best place in the world to live by fueling entrepreneurship, building high-growth companies, and transforming our region into a recognized hub of innovation that creates lasting economic success.</p></div></section>
  <section class="section section--pale grain"><div class="wrap">${head('The Program', 'The on-ramp founders need.', 'Everything entrepreneurs would leave town to find: a true accelerator with a pathway to raising venture capital.')}<div class="card-grid card-grid--2">${card('accelerator.html', 'Spring 2027 · S27', '7-Week Accelerator', 'Mentorship, capital connections, hands-on workshops, community, and a Demo Day.', 'Explore the accelerator')}${card('workshops.html', 'Pre-accelerator', 'Workshop Series', 'A workshop series that readies earlier-stage founders and feeds the pipeline.', 'Explore the workshops')}</div><div class="center" style="margin-top:32px">${apply('Apply to the cohort', 'btn--outline btn--lg')}</div></div></section>
  <section class="section"><div class="wrap"><header class="section-head section-head--center"><p class="eyebrow">In the room</p>${waveRule}<h2 class="section-head__title display">What people are saying.</h2></header>${testimonialGrid()}</div></section>
  <section class="section section--pale section--tight"><div class="wrap"><header class="section-head section-head--center"><p class="eyebrow">Backed by the community</p>${waveRule}<h2 class="section-head__title display">Partners &amp; supporters.</h2></header>${partnerRow()}</div></section>
  <section class="section"><div class="wrap"><header class="section-head section-head--center"><p class="eyebrow">Who we are</p>${waveRule}<h2 class="section-head__title display">A board that has built and scaled here.</h2></header>${boardGrid()}<div class="center" style="margin-top:32px"><a class="btn btn--outline" href="about.html">Meet the full board</a></div></div></section>
  ${waveDivider}
  <section class="section section--pale"><div class="wrap">${head('Why Ventura County', 'Great talent grows up here. Too much of it leaves.')}<p class="lede">The county raises and educates talent, then watches affordability and a lack of opportunity push it out. High-growth companies are the fix.</p><div style="margin-top:32px">${statStrip()}</div><div style="margin-top:28px"><a class="card__link" href="why-ventura-county.html" style="font-size:1.05rem">Read the full case</a></div></div></section>
  ${ctaBand('Give Ventura County&rsquo;s founders a reason to stay.', 'apply')}`,
});

// PROGRAM
page('program.html', {
  title: 'The Program', crumbsTrail: [['Home', 'index.html'], ['The Program', '']],
  body: pageHead('The Program', 'The on-ramp founders need.', 'Everything entrepreneurs would leave town to find: a true accelerator with a pathway to raising venture capital.') +
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
  body: `<section class="section" style="padding-top:0"><div class="wrap"><header class="page-head"><p class="eyebrow">Impact</p>${waveRule}<h1 class="display">Model your impact</h1><p class="lede">See what your support builds in Ventura County: program longevity, jobs, and startup revenue. Adjust the inputs to explore the numbers.</p></header><iframe id="sv-impact-calc" src="${A}/impact-calculator.html" title="Startup Ventura Impact Calculator" loading="lazy" style="width:100%;border:0;min-height:1200px;display:block"></iframe></div></section>
    <script>(function(){window.addEventListener('message',function(e){if(e.origin!==window.location.origin)return;if(e&&e.data&&e.data.type==='sv-impact-calc-height'){var f=document.getElementById('sv-impact-calc');if(f)f.style.height=e.data.height+'px';}});})();</script>
    <section class="section section--pale"><div class="wrap wrap--narrow">${head('Where it goes', 'Every dollar stays in Ventura County.')}<p class="lede">Your gift backs Ventura County founders and the program that supports them. It does not leave the county. Local innovation drives local jobs, and that is how we keep our best people here.</p></div></section>` +
    ctaBand('Give Ventura County&rsquo;s founders a reason to stay.', 'none'),
});

// GIVE
page('give.html', {
  title: 'Give', crumbsTrail: [['Home', 'index.html'], ['Give', '']],
  body: `<section class="section section--navy"><div class="wrap"><div class="give-hero"><div class="give-hero__copy"><h1 class="display">Fund Ventura County's first founder cohort.</h1><p class="lede">A gift funds local founders and the program that backs them. It stays in Ventura County.</p>${give('give-hero', 'btn--lg', 'Secure payment via Zeffy.')}</div><ul class="trust"><li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span>Secure payment</span></li><li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>501(c)(3) nonprofit</span></li><li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>EIN 39-2204612</span></li></ul></div></div></section>
  <section class="section"><div class="wrap">${MEAD_QUOTE}</div></section>
  <section class="section section--tight"><div class="wrap">${head("Founder's Circle", 'Lead the inaugural cohort.', 'Recognition tiers for the founders and partners who launch Spring 2027. Each tier includes everything below it.')}${tierGrid()}<p class="center muted" style="margin-top:32px">To discuss a Founder&rsquo;s Circle or corporate gift, email <a href="mailto:sponsor@startupventura.com">sponsor@startupventura.com</a>.</p></div></section>
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
    `<section class="section section--tight"><div class="wrap">${MEAD_QUOTE}</div></section>
    <section class="section section--pale"><div class="wrap">${head("Founder's Circle", 'The donors launching the first cohort.', 'Recognition scales with the gift, highest tier first. Each tier includes everything below it.')}<div class="donor-ladder">${[...tiers].reverse().map(([n, a], i, arr) => {
      const names = donors[n] || [];
      const lvl = arr.length - i; // 4 = Legacy (top, grandest) … 1 = Catalyst
      return `<div class="donor-rank donor-rank--l${lvl}"><p class="donor-rank__tier"><span class="donor-rank__label">${n}</span> <span class="donor-rank__amount">${a}+</span></p>${names.length ? `<ul class="donor-rank__donors">${names.map((x) => `<li>${x}</li>`).join('')}</ul>` : `<p class="donor-rank__invite"><a href="give.html">Be the first at this level &rarr;</a></p>`}</div>`;
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
    <section class="section section--tight"><div class="wrap" style="padding-top:26px">${MEAD_QUOTE}</div></section>
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
      <div class="contact-aside__block"><h3>Follow us</h3><p>Follow Startup Ventura for events, founders, and announcements.</p><span class="contact-aside__social"><a href="https://www.linkedin.com/company/startup-ventura" target="_blank" rel="noopener">LinkedIn</a><a href="https://www.instagram.com/startup_ventura/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/startupventura/" target="_blank" rel="noopener">Facebook</a></span></div>
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
    // ARCHIVED (board-requested, 2026-07-08): hidden until Sean is officially onboarded (~week of 2026-07-15). Remove `archived: true` to republish.
    archived: true,
    file: 'news-sean-herwaldt-board.html', crumb: 'New Board Member',
    title: 'Welcoming Sean Herwaldt to the Startup Ventura Board',
    date: 'July 8, 2026', img: `${A}/img/team/sean-herwaldt.jpg`, alt: 'Sean Herwaldt',
    excerpt: 'Sean Herwaldt, a SpaceX supply chain veteran and now a Director at Curri in Ventura, has joined the Startup Ventura Board of Directors.',
    paras: [
      'Startup Ventura is honored to welcome Sean Herwaldt to our Board of Directors.',
      'Sean spent six years at SpaceX, rising to global supply chain manager at one of the most demanding engineering companies in the world, now publicly traded after the largest IPO in history this past June. Keeping a rocket company supplied means solving hard problems under constant pressure and building the planning systems and supplier relationships that let ambitious teams actually ship. That is exactly the kind of operating experience early founders need in their corner.',
      'His path reflects the kind of hands-on background our board is built on. Before SpaceX, Sean worked in supply chain and operations for major manufacturers including Owens Corning and Progress Rail, learning how real things get built and moved at scale. Today he leads delivery operations as a Director at Curri, the last-mile logistics company headquartered right here in Ventura. He knows what it takes to build something and see it through, from the ground floor up.',
      'What Sean brings to Startup Ventura is more than a resume. He feels strongly about building a strong entrepreneurial ecosystem in Ventura, so founders with big ideas can build them at home instead of leaving to do it somewhere else. That belief is the entire reason we exist.',
      'We could not be more excited to have him help guide what comes next. Welcome, Sean.',
    ],
  },
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
  <div class="post-grid">${newsPosts.filter(p => !p.archived).map(p => `<article class="post-card"><a href="${p.file}" tabindex="-1" aria-hidden="true">${pic(p.img, { cls: 'post-card__thumb', alt: '', sizes: '(max-width:640px) 92vw, 360px' })}</a><div class="post-card__body"><p class="post-card__date">${p.date}</p><h2 class="post-card__title"><a href="${p.file}">${p.title}</a></h2><p class="post-card__excerpt">${p.excerpt}</p><a class="post-card__more" href="${p.file}">Read more &rarr;</a></div></article>`).join('')}</div></div></section>` +
    ctaBand('Help fund the inaugural cohort.', 'none'),
});

// NewsArticle structured data for a news post — headline, dated + authored to the
// Org (publisher). Feeds Google article rich results and gives social scrapers a
// machine-readable date/author alongside the article:* OG tags.
const newsArticleSchema = (p, canon, imgAbs) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: p.title,
  description: p.excerpt,
  image: [imgAbs],
  datePublished: isoDate(p.date),
  dateModified: isoDate(p.date),
  author: { '@type': 'Organization', name: 'Startup Ventura', url: `${SITE}/` },
  publisher: { '@type': 'Organization', name: 'Startup Ventura', logo: { '@type': 'ImageObject', url: `${SITE}/assets/img/logo-mark.png` } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': canon },
});

newsPosts.filter(p => !p.custom && !p.archived).forEach(p => {
  const imgAbs = `${SITE}/assets/img/` + p.img.replace(/^.*\/img\//, '').replace(/\?.*$/, '');
  const canon = `${SITE}/${p.file}`;
  page(p.file, {
    title: p.title, desc: p.excerpt, ogType: 'article',
    ogImage: imgAbs,
    article: { published: isoDate(p.date), author: 'Startup Ventura', section: 'News' },
    jsonld: newsArticleSchema(p, canon, imgAbs),
    crumbsTrail: [['Home', 'index.html'], ['News', 'news.html'], [p.crumb, '']],
    body: `<section class="section"><div class="wrap"><article class="single-post">
    <header class="entry-header"><p class="entry-meta">News &middot; ${p.date}</p><h1 class="display">${p.title}</h1></header>
    <div class="entry-hero">${pic(p.img, { alt: p.alt, sizes: '(max-width:1040px) 92vw, 1000px', eager: true })}</div>
    <div class="entry-content">${p.paras.map(t => `<p>${t}</p>`).join('')}${p.extra || ''}</div>
  </article></div></section>` +
      ctaBand('Help fund the inaugural cohort.', 'none'),
  });
});

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
  `The move formalizes what has been true from the beginning. Startup Ventura is <a href="https://lukeerickson.com" target="_blank" rel="noopener">Luke Erickson's</a> vision, built on a conviction that the region he calls home has everything it needs to compete with the country's great startup ecosystems, and that no one was yet doing the work to make it happen. So he decided to do it himself.`,
  `That conviction came from a problem he watched play out for years. Ventura County raises ambitious, talented people, educates them at strong local universities, and then loses them to San Francisco, Los Angeles, and beyond, because there is nowhere here to build. The shortage runs both directions. Even high-growth companies already rooted here, like Curri, the logistics startup headquartered in downtown Ventura, have to work hard to find the local talent they need to grow. He saw a region exporting its own future while the employers who stayed competed over too small a pool. Rather than accept it, he founded Startup Ventura to give local founders the mentorship, capital connections, and community to build high-growth companies without leaving, and to deepen the talent pool that every local company depends on. The idea is simple and ambitious at once: keep the talent, build the companies, and let the jobs and investment follow.`,
  `Under his leadership, the organization has moved quickly from idea to institution. Startup Ventura earned its 501(c)(3) status, secured a founding investment from the City of Ventura, and was awarded Candid's Platinum Seal of Transparency, the highest level, held by fewer than one percent of U.S. nonprofits. Its first annual benefit drew 75 supporters and raised funds toward an inaugural cohort of founders launching in Spring 2027. What began as one person's argument about his hometown has become a coalition of city government, universities, investors, and business leaders.`,
  `<a href="https://lukeerickson.com" target="_blank" rel="noopener">Luke Erickson</a> brings a background in technology and business development to the civic sector, having built and exited his own company before turning his focus to building institutions. He pairs an ambitious long-term vision with the patience to assemble the partnerships that make it real, the kind of leadership that gets a city, a college district, and a room full of investors pulling in the same direction.`,
  `His commitment to Ventura County reaches well beyond Startup Ventura. He serves on the board of directors of the New West Symphony, mentors students at CSU Channel Islands, and works closely with local civic and economic development organizations to strengthen the region's future. A former collegiate lacrosse player, he brings the same competitiveness and discipline to building institutions that he once brought to the field.`,
  `"After I exited my first business, I made a conscious decision that I was going to have an outsized impact on this city and county, and turn it into a place that ambitious, innovative people want to call home," Erickson said. "That is the whole reason Startup Ventura exists. We are just getting started."`,
  `As Executive Director, he will lead Startup Ventura into its first full program year, with the inaugural cohort set to begin in Spring 2027. For Luke Erickson, it is less a new title than a deeper commitment to a mission he has carried from the start: making Ventura County the best place in the world to build something that lasts.`,
];
// NewsArticle for the announcement, tied via `about` to the shared Luke Person entity.
const lukePost = newsPosts.find(p => p.file === 'luke-erickson-executive-director.html');
const lukeImgAbs = `${SITE}/assets/img/team/luke-erickson.jpg`;
const lukeArticleSchema = { ...newsArticleSchema(lukePost, lukeUrl, lukeImgAbs), about: { '@id': `${SITE}/lukeerickson#luke` } };
page('luke-erickson-executive-director.html', {
  title: 'Luke Erickson Steps Into the Role of Executive Director at Startup Ventura',
  crumbsTrail: [['Home', 'index.html'], ['News', 'news.html'], ['Executive Director', '']],
  desc: lukeExcerpt,
  canonical: lukeUrl,
  ogType: 'article',
  ogImage: lukeImgAbs,
  article: { published: isoDate(lukePost.date), author: 'Startup Ventura', section: 'News' },
  jsonld: [LUKE_PERSON, lukeArticleSchema],
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

// CAREERS — open roles with expandable descriptions + an application form,
// plus a mentorship / volunteer section linking to Contact.
const svJobAbout = `<h4>About Startup Ventura</h4><p>Startup Ventura is a 501(c)(3) nonprofit with one goal: keep Ventura County the best place in the world to live by fueling entrepreneurship. This county produced companies like The Trade Desk and Curri. Our job is to make sure the next generation of great companies starts here and stays here.</p><p>We are launching nationally ranked accelerator programming for early-stage founders, with our inaugural Spring 2027 cohort and committed funding from the City of Ventura. You would be joining at the moment it all becomes real.</p>`;
const roles = [
  {
    title: 'Community Operations Coordinator',
    meta: 'Part-time &middot; $20&ndash;$30/hour &middot; Mostly remote, with in-person events across Ventura County',
    teaser: 'The operational right hand to our Executive Director, and the person who makes our events happen end to end.',
    full: `${svJobAbout}<h4>About the role</h4><p>Half of it is being the operational right hand to our Founder &amp; Executive Director: owning his calendar, scheduling meetings with donors, city and county officials, board members, and partners, prepping him for those meetings, and making sure every follow-up actually happens.</p><p>The other half is making our events happen: community workshops, accelerator programming like weekly Lunch &amp; Learns and a Pitch Day with 25+ investors, donor gatherings, and our Annual Benefit. You will own them end to end, from venue and vendors to run-of-show to the thank-you emails after.</p><p>Small team, high trust, real ownership. You will see exactly how a nonprofit gets built and be a big part of building it.</p><h4>What you&rsquo;ll do</h4><p class="role__subhead">Events (roughly 1/3 your time)</p><ul><li>Plan and execute events end to end: venue, vendors, catering, registration, run of show, day-of hosting, post-event follow-up</li><li>Run logistics for accelerator programming: weekly Lunch &amp; Learns, mentor sessions, and Pitch Day</li><li>Coordinate community workshops and donor and stakeholder events, including our Annual Benefit</li><li>Track event budgets, RSVPs, and follow-up so every attendee gets a next touch</li></ul><p class="role__subhead">Executive and operations support (the other 2/3)</p><ul><li>Manage the Executive Director&rsquo;s calendar and scheduling across donors, elected officials, board members, and partners</li><li>Prep meeting briefs and handle follow-ups: thank-yous, intros, and scheduling next steps</li><li>Keep our CRM current by logging interactions and updating records after meetings and events</li><li>General operations: inbox triage, document prep, light vendor coordination</li></ul><h4>What we&rsquo;re looking for</h4><ul><li>Experience planning and executing events, professional or community. You have owned an event end to end, not just helped at one</li><li>Experience managing a busy executive&rsquo;s calendar or a comparably coordination-heavy role</li><li>Strong stakeholder management: you are comfortable and polished with donors, elected officials, executives, and volunteers, and people trust you with their time</li><li>Extremely organized with dependable follow-through. Nothing you own falls through the cracks</li><li>Based in or near Ventura County. Most of the work is remote, but you will host events in person</li><li>Comfortable with modern tools (Google Workspace, Notion or a similar CRM). We use AI tools daily and you should be excited to</li></ul><h4>Nice to have</h4><ul><li>Nonprofit, fundraising, or event sponsorship experience</li><li>An existing network in Ventura County&rsquo;s business or civic community</li></ul>`,
  },
  {
    title: 'Grant Writer',
    meta: 'Part-time, ~5&ndash;10 hrs/week &middot; $40&ndash;$65/hour &middot; Fully remote',
    teaser: 'Turn a strong story and real traction into a steady rhythm of funded grant applications.',
    full: `${svJobAbout}<h4>About the role</h4><p>We have a strong story and real traction: committed city funding, grant applications already in flight, and a program model with the outcomes funders want to see, like jobs created, startups launched, and follow-on capital raised. What we need is someone who turns that story into a steady rhythm of funded applications.</p><p>You will build our grant calendar, research and qualify opportunities, and get high-quality applications out the door every month. You will work directly with our Founder &amp; Executive Director, who owns funder relationships and final sign-off. We use AI tools daily to speed up drafting and research, and you should be excited to as well, while owning the accuracy and quality of every submission.</p><h4>What you&rsquo;ll do</h4><ul><li>Build and maintain a 12-month grant calendar spanning community foundations, corporate giving programs, civic organizations, and state and federal economic development funding</li><li>Research and qualify new opportunities against our mission, programs, and eligibility</li><li>Write and submit 1&ndash;2 applications per month: narratives, budgets (with our Executive Director), and attachments</li><li>Track every submission through decision, including deadlines, reporting requirements, and outcomes</li><li>Build a reusable library of boilerplate: mission language, program descriptions, budget templates, board bios</li><li>Write post-award funder reports so we stay relevant and in good standing</li></ul><h4>What we&rsquo;re looking for</h4><ul><li>2+ years of grant writing with funded applications you can point to</li><li>Clear, persuasive narrative writing that holds up to a skim</li><li>Comfort working with program budgets and outcome metrics</li><li>Self-directed and deadline-proof: you run the calendar, we do not chase you</li></ul><h4>Nice to have</h4><ul><li>Experience with economic development, entrepreneurship, or workforce funders</li><li>Knowledge of Ventura County or California funders (community foundations, state small business programs)</li><li>Capacity-building grant experience</li></ul><h4>Details</h4><ul><li>Approximately 5&ndash;10 hours per week to start, flexible scheduling</li><li>$40&ndash;$65/hour depending on experience; open to per-application pricing</li><li>Fully remote with occasional video calls</li><li>Reports to the Executive Director</li></ul>`,
  },
  {
    title: 'Corporate Partnerships & Sponsorship Lead',
    meta: 'Part-time &middot; $25&ndash;$35/hour plus performance bonus &middot; Remote, with in-person meetings and events across Ventura County',
    teaser: 'Own the partner revenue that keeps our accelerator free for founders. Build the pipeline, run the meetings, close the deals.',
    full: `${svJobAbout}<h4>About the role</h4><p>Our accelerator programming is free for founders. No tuition, no equity. It is funded by community partners who believe the next great companies should start here. This role owns that partner revenue.</p><p>You will build and work a pipeline of corporate sponsors across Ventura County: employers, banks and credit unions, law and accounting firms, and service providers who want to be in front of founders, investors, and civic leaders. And you will have real inventory to sell: an 8-week accelerator cohort, weekly Lunch &amp; Learns, a culminating Pitch Day with 25+ investors, community workshops, and our Annual Benefit.</p><p>You will work directly with our Founder &amp; Executive Director, who will open doors with anchor relationships while you run the pipeline, the meetings, and the closes.</p><h4>What you&rsquo;ll do</h4><ul><li>Build and manage a corporate sponsor pipeline in our CRM, from prospect research through close and renewal</li><li>Package sponsorship tiers with our Executive Director: event sponsorships, cohort sponsorships, and in-kind partnerships</li><li>Run outreach and sponsor meetings, present the value, and close</li><li>Make sure sponsors get what they paid for: recognition, event presence, and reporting</li><li>Steward relationships year-round so sponsors renew and grow</li><li>Support anchor-employer conversations alongside our Executive Director</li></ul><h4>What we&rsquo;re looking for</h4><ul><li>2+ years in B2B sales, sponsorships, partnerships, or business development with deals you personally closed</li><li>Experience closing in the $10K&ndash;$100K range</li><li>Polished and credible in rooms with executives, elected officials, and business owners</li><li>Disciplined pipeline habits. We run a Notion-based CRM and use AI tools daily, and you should be excited to</li><li>Based in or near Ventura County</li></ul><h4>Nice to have</h4><ul><li>An existing network in Ventura County&rsquo;s business or civic community</li><li>Nonprofit sponsorship, chamber of commerce, or event sales experience</li></ul>`,
  },
  {
    // ARCHIVED (2026-07-09): hidden from the Careers page, JobPosting schema, and apply dropdown. Remove `archived: true` to republish.
    archived: true,
    title: 'Development Director',
    meta: 'Fractional / contract &middot; 8&ndash;10 hrs/week &middot; $40&ndash;$80/hour &middot; Mostly remote, Ventura County',
    teaser: 'A senior fundraiser who owns strategy across major gifts, grants, sponsorships, and events, and makes it all compound.',
    full: `${svJobAbout}<h4>About the role</h4><p>Startup Ventura has momentum: committed city funding, an engaged board of operators and civic leaders, warm major-gift prospects, and grant applications in flight. What we do not have yet is a senior fundraiser making all of it compound. That is this role.</p><p>As our fractional Development Director, you will own fundraising strategy and the revenue calendar across four streams: major gifts, institutional grants, corporate sponsorships, and events. You will prep and coach our Founder &amp; Executive Director for major asks, oversee part-time development contractors as we add them, and make sure every prospect in our CRM has a next step.</p><p>This is a build role at a young organization: 8&ndash;10 hours a week of senior judgment. You will shape how this organization raises money for the next decade.</p><h4>What you&rsquo;ll do</h4><ul><li>Own the annual fundraising plan, revenue targets, and calendar across major gifts, grants, sponsorships, and events</li><li>Manage the major-gifts pipeline: prospect strategy, ask amounts, meeting prep, and follow-through</li><li>Coach and prep the Executive Director for donor meetings and asks</li><li>Oversee the grant calendar and sponsorship pipeline, managing part-time specialists in those seats</li><li>Build out donor recognition and stewardship, including our Founder&rsquo;s Circle giving society</li><li>Report fundraising progress and forecasts to the board</li></ul><h4>What we&rsquo;re looking for</h4><ul><li>5+ years of nonprofit fundraising, including development leadership at a small or growing organization</li><li>You have personally closed five-figure and larger gifts</li><li>Breadth across grants, sponsorships, and events, with real depth in major gifts</li><li>Comfortable operating fractionally: high leverage, low oversight, clear priorities</li><li>Fluent with modern tools. We run a Notion-based CRM and use AI daily, and you should be excited to</li></ul><h4>Nice to have</h4><ul><li>CFRE credential</li><li>A funder and donor network in Ventura County or Southern California</li><li>Experience fundraising for economic development, entrepreneurship, or education</li></ul><h4>Details</h4><ul><li>Contract, 8&ndash;10 hours per week with flexible scheduling</li><li>$40&ndash;$80/hour depending on experience</li><li>Remote for most work; in person for key donor meetings, board meetings, and events in Ventura County</li><li>Reports to the Executive Director</li></ul>`,
  },
  {
    title: 'Student Internship',
    meta: 'Internship &middot; Part-time, flexible &middot; Ventura County',
    teaser: 'Get real, resume-ready experience helping build a startup accelerator from the ground up.',
    full: `${svJobAbout}<h4>About the role</h4><p>This is a flexible, learn-by-doing internship shaped around your interests and where we need help. You will work alongside a small team building a startup accelerator from the ground up, and get real exposure to nonprofit operations, live events, and Ventura County&rsquo;s founder community.</p><h4>What you might do</h4><ul><li>Support event planning and day-of logistics for workshops, Lunch &amp; Learns, and Pitch Day</li><li>Help with founder, funder, and sponsor research</li><li>Pitch in on marketing, social media, and content</li><li>Keep our CRM and records organized</li><li>Take on whatever the week needs, with real ownership</li></ul><h4>Who it&rsquo;s for</h4><p>Students and early-career people in or near Ventura County who want hands-on experience and a local network. Apply below and tell us what you are studying, your availability, and how you would like to help.</p>`,
  },
];
// JobPosting structured data per role (Google for Jobs + AI job search).
const jobMeta = {
  'Community Operations Coordinator': { emp: 'PART_TIME', min: 20, max: 30 },
  'Grant Writer': { emp: ['PART_TIME', 'CONTRACTOR'], min: 40, max: 65 },
  'Corporate Partnerships & Sponsorship Lead': { emp: 'PART_TIME', min: 25, max: 35 },
  'Development Director': { emp: 'CONTRACTOR', min: 40, max: 80 },
  'Student Internship': { emp: 'INTERN' },
};
const JOBS_POSTED = '2026-07-08';
// Google for Jobs delists postings ~30 days after datePosted unless validThrough
// is set. These roles stay open until filled; bump this date when refreshing them.
const JOBS_VALID_THROUGH = '2027-01-08';
const jobPostingSchema = (r) => {
  const m = jobMeta[r.title] || {};
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: r.title,
    description: r.full,
    datePosted: JOBS_POSTED,
    validThrough: JOBS_VALID_THROUGH,
    employmentType: m.emp,
    directApply: true,
    url: `${SITE}/careers`,
    hiringOrganization: { '@type': 'Organization', name: 'Startup Ventura', sameAs: `${SITE}/`, logo: `${SITE}/assets/img/logo.png` },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: { '@type': 'AdministrativeArea', name: 'Ventura County, California' },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Ventura', addressRegion: 'CA', addressCountry: 'US' } },
  };
  if (m.min) obj.baseSalary = { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', minValue: m.min, maxValue: m.max, unitText: 'HOUR' } };
  return obj;
};
page('careers.html', {
  title: 'Careers',
  desc: 'Join the team building Ventura County’s startup accelerator. Open roles plus ways to mentor founders and volunteer your skills.',
  canonical: `${SITE}/careers`,
  jsonld: roles.filter(r => !r.archived).map(jobPostingSchema),
  body: pageHead('Careers', 'Help build what founders build here.', 'Startup Ventura is a small team with outsized ambition for Ventura County. If you want your work to keep talent, jobs, and companies in the region, we would love to meet you.') +
    `<section class="section section--pale"><div class="wrap wrap--narrow">${head('Open roles', 'We are hiring.', 'Click a role to read the full description. Do not see your exact fit? Apply below and tell us how you would help.')}<div class="roles">${roles.filter(r => !r.archived).map((r) => `<article class="role"><details class="role__d"><summary class="role__summary"><div class="role__head"><h3 class="role__title">${r.title}</h3><p class="role__meta">${r.meta}</p><p class="role__desc">${r.teaser}</p></div><span class="role__toggle" aria-hidden="true">Details</span></summary><div class="role__full">${r.full}</div></details><div class="role__actions"><a class="btn btn--outline role__apply" href="#apply" data-role="${r.title}">Apply for this role &darr;</a></div></article>`).join('')}</div></div></section>
    <section class="section" id="apply"><div class="wrap wrap--narrow">${head('Apply', 'Tell us about you.')}${form('careers', 'Submit application', false, true, { interest: [...roles.filter(r => !r.archived).map(r => r.title), 'General interest'], interestLabel: 'Role you are applying for', linkLabel: 'LinkedIn or resume link', msgLabel: 'Why you, and how you would help', twoCol: true })}</div></section>
    <section class="section section--pale"><div class="wrap wrap--narrow">${headC('Mentor & volunteer', 'Lend your skills to a founder.', 'Not looking for a job, but want to help? Our founders grow fastest with operators, experts, and mentors in their corner. Whether you can give an hour or an ongoing commitment, we would love to hear what you bring.')}<div class="center"><a class="btn btn--blue" href="contact.html">Get in touch to mentor or volunteer</a></div></div></section>` +
    `<script>document.querySelectorAll('.role__apply').forEach(function(a){a.addEventListener('click',function(){var s=document.getElementById('careers-interest');if(s){var r=a.getAttribute('data-role');for(var i=0;i<s.options.length;i++){if(s.options[i].value===r){s.selectedIndex=i;break;}}}});});</script>` +
    ctaBand('Build the thing that builds Ventura County&rsquo;s founders.', 'none'),
});

// FAQ — plain, quotable answers to the questions people (and AI answer engines)
// actually ask, plus FAQPage structured data.
const faqs = [
  ['What is Startup Ventura?', 'Startup Ventura is a 501(c)(3) nonprofit startup accelerator in Ventura County, California. It backs early-stage founders with mentorship, capital connections, and community so they can build high-growth companies at home instead of leaving for San Francisco or Los Angeles.'],
  ['Is the accelerator free for founders?', 'Yes. Startup Ventura’s accelerator and workshops are free for founders, with no tuition and no equity taken. The program is funded by donors and community partners.'],
  ['Who can apply, and when does the first cohort start?', 'Early-stage founders based in or building in Ventura County. The inaugural cohort is planned for Spring 2027, backed by committed funding from the City of Ventura. Join the notify list to apply when applications open.'],
  ['Where is Startup Ventura located?', 'Startup Ventura serves founders across Ventura County, California.'],
  ['Is my donation tax-deductible?', 'Yes. Startup Ventura is a 501(c)(3) nonprofit (EIN 39-2204612), so donations are tax-deductible to the extent allowed by law. Gifts fund the inaugural cohort and the program that backs local founders.'],
  ['Who runs Startup Ventura?', 'Startup Ventura was founded by Luke Erickson, who serves as Executive Director. It is guided by a board of operators and civic leaders, including people behind companies like Curri and the Ventura Chamber of Commerce.'],
  ['How can I get involved?', 'You can donate to fund the cohort, partner or sponsor as a business or foundation, mentor a founder or volunteer your skills, apply as a founder, or join the team through an open role. See the Give, Partner, and Careers pages.'],
];
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};
page('faq.html', {
  title: 'FAQ',
  canonical: `${SITE}/faq`,
  jsonld: faqSchema,
  body: pageHead('FAQ', 'Frequently asked questions', 'Quick answers about Startup Ventura, the accelerator, and how to get involved.') +
    `<section class="section section--pale"><div class="wrap wrap--narrow"><div class="faq">${faqs.map(([q, a]) => `<details class="faq__item"><summary class="faq__q">${q}</summary><div class="faq__a"><p>${a}</p></div></details>`).join('')}</div></div></section>` +
    ctaBand('Still have a question? We&rsquo;d love to hear from you.', 'none'),
});

// BOARD OF ADVISORS — unlisted for now (noindex, no nav/footer/sitemap link).
// Direct URL only until the org is ready to make it public. Names only for now;
// add title/bio/photo per advisor to enrich the cards later.
const advisors = [
  { n: 'Jeff Forester' },
  { n: 'Connor Macleod' },
  { n: 'Immanuel Portus' },
];
const initials = (n) => n.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
page('advisors.html', {
  title: 'Board of Advisors',
  robots: 'noindex, nofollow',
  desc: 'The advisors who help guide Startup Ventura.',
  canonical: `${SITE}/advisors`,
  body: pageHead('Advisory Board', 'Board of Advisors', 'Experienced advisors who lend their guidance, networks, and expertise as Startup Ventura builds Ventura County&rsquo;s accelerator.') +
    `<section class="section section--pale"><div class="wrap"><div class="advisor-grid">${advisors.map((a) => `<article class="advisor-card">${a.photo ? `<div class="advisor-card__media"><img src="${A}/img/${a.photo}" width="200" height="200" alt="${a.n}"></div>` : `<div class="advisor-mono" aria-hidden="true">${initials(a.n)}</div>`}<h3 class="advisor-card__name">${a.n}</h3><p class="advisor-card__role">${a.role || 'Advisor'}</p>${a.bio ? `<p class="advisor-card__bio">${a.bio}</p>` : ''}</article>`).join('')}</div></div></section>` +
    ctaBand('Guiding what founders build here.', 'none'),
});

// PAID-TRAFFIC LANDING PAGE — /connect (unlisted, noindex; built for the Google
// Ad Grant and other paid campaigns). One job: turn a high-intent click into a
// booked conversation with the founder instead of a cold Give ask. The 'connect'
// Netlify form feeds the scheduling workflow (assistant follows up, Luke takes
// the meeting and makes the direct ask). Give stays available as the closing
// band for ready-now donors. Not in the nav, footer, or sitemap.
page('connect.html', {
  title: 'Talk With Our Founder',
  robots: 'noindex',
  desc: 'Book a conversation with Startup Ventura founder Luke Erickson. See the plan for Ventura County\'s startup accelerator, then decide where you fit.',
  canonical: `${SITE}/connect`,
  body: pageHead('Make an Impact', 'Talk with our founder before you get involved.', 'Serious support starts with a conversation, not a checkout page. Tell us how you want to help and we will set up time with our founder, Luke Erickson. See the plan, ask the hard questions, then decide where you fit.') +
    `<section class="section section--pale"><div class="wrap wrap--narrow">${headC('How it works', 'Three steps, no pressure.')}<div class="steps"><div class="step"><div class="step__num">01</div><div class="step__content"><h3 class="step__title">Tell us how you want to help</h3><p class="step__body">The form takes 30 seconds. Contributing, partnering, or still exploring, every answer is a good answer.</p></div></div><div class="step"><div class="step__num">02</div><div class="step__content"><h3 class="step__title">We reach out personally</h3><p class="step__body">No automated sequences. A member of our team emails you to find a time that fits your calendar.</p></div></div><div class="step"><div class="step__num">03</div><div class="step__content"><h3 class="step__title">Meet Luke and see the plan</h3><p class="step__body">Thirty minutes on the accelerator, the funding model, and where Ventura County is headed. You decide what role you want in it.</p></div></div></div></div></section>
  <section class="section"><div class="wrap"><div class="contact-layout">
    <div>${head('Start the conversation', 'Tell us how you want to help.')}<div style="margin-top:28px">${form('connect', 'Request a conversation', false, true, { phone: true, twoCol: true, interest: ['Personal contribution', 'Corporate partnership / sponsorship', 'Still exploring'], interestLabel: 'How would you like to make an impact?', msgLabel: 'Anything we should know before we reach out?', msgOptional: true, redirect: '/connected' })}</div></div>
    <aside class="contact-aside">
      <div class="contact-card"><h3>What happens next</h3><p>A real person reaches out within a day or two to find a time that works. Then you meet with Luke, over coffee in Ventura or on a call, for about 30 minutes.</p></div>
      <div class="contact-aside__block"><h3>Backed by the City of Ventura</h3><p>Startup Ventura earned a founding investment from the City of Ventura to launch the county&rsquo;s accelerator.</p></div>
      <div class="contact-aside__block"><h3>Candid Platinum Seal</h3><p>We hold Candid&rsquo;s Platinum Seal of Transparency, the highest level, held by fewer than 1% of U.S. nonprofits.</p></div>
      <div class="contact-aside__block"><h3>A board of operators</h3><p>Our board includes leadership behind SevenRooms&rsquo; $1.2B acquisition and the Ventura Chamber of Commerce.</p></div>
      <div class="contact-aside__block"><h3>Rather start by email?</h3><p><a href="mailto:info@startupventura.com">info@startupventura.com</a></p></div>
    </aside>
  </div></div></section>` +
    ctaBand('Already know you want to fund the cohort?', 'none'),
});

// AD-FUNNEL LANDING PAGES — same pattern as /connect: unlisted + noindex, one
// job each, short form, redirect to a /thanks-* page that fires that funnel's
// own GA4 event. No fake dates or open applications: the founder and workshop
// funnels are honest first-access lists until the real thing opens.

// FOUNDERS → /apply (form 'apply' → /thanks-apply → founder_lead)
page('apply.html', {
  title: 'Founders: Get First Access',
  robots: 'noindex',
  desc: 'Get first access when applications open for Startup Ventura\'s Spring 2027 accelerator cohort. Free for founders: no tuition, no equity.',
  canonical: `${SITE}/apply`,
  body: pageHead('Founders', 'Build it here. Not somewhere else.', 'Our first accelerator cohort launches Spring 2027: free for founders, no tuition, no equity, with mentorship, capital connections, and a Pitch Day in front of 25+ investors. Tell us what you are building and you go to the front of the line when applications open.') +
    `<section class="section section--pale"><div class="wrap"><div class="contact-layout">
    <div>${head('First access', 'Tell us what you are building.')}<div style="margin-top:28px">${form('apply', 'Get first access', false, true, { twoCol: true, interest: ['Idea stage', 'Building, pre-revenue', 'Revenue, growing', 'Not sure yet'], interestLabel: 'Where are you today?', msgLabel: 'What are you building? A sentence or two is perfect.', linkLabel: 'Company or LinkedIn link', redirect: '/thanks-apply' })}</div></div>
    <aside class="contact-aside">
      <div class="contact-card"><h3>What the accelerator includes</h3><p>Mentorship from operators who have built and scaled, capital connections, weekly Lunch &amp; Learns, and a Pitch Day in front of 25+ investors.</p></div>
      <div class="contact-aside__block"><h3>What it costs you</h3><p>Nothing. No tuition and no equity. The program is funded by the City of Ventura and community partners who want founders building here.</p></div>
      <div class="contact-aside__block"><h3>The path</h3><p>The founder workshop series runs first as the on-ramp, then applications open ahead of the Spring 2027 cohort. This list hears everything first.</p></div>
      <div class="contact-aside__block"><h3>Questions?</h3><p><a href="mailto:info@startupventura.com">info@startupventura.com</a></p></div>
    </aside>
  </div></div></section>` +
    ctaBand('Know someone who backs founders? Send them here.', 'none'),
});

// MENTORS → /mentor (form 'mentor' → /thanks-mentor → mentor_lead)
page('mentor.html', {
  title: 'Mentor a Founder',
  robots: 'noindex',
  desc: 'Mentor Ventura County founders through Startup Ventura. An hour of your experience can change a company\'s trajectory.',
  canonical: `${SITE}/mentor`,
  body: pageHead('Mentors', 'Lend your skills to a founder.', 'Startup Ventura founders grow fastest with operators, experts, and investors in their corner. Tell us what you know and how much time you can give, whether that is a single workshop or an ongoing mentorship. We will match you where you matter most.') +
    `<section class="section section--pale"><div class="wrap"><div class="contact-layout">
    <div>${head('Raise your hand', 'Tell us where you can help.')}<div style="margin-top:28px">${form('mentor', 'Raise my hand', false, true, { twoCol: true, interest: ['Sales & marketing', 'Product & engineering', 'Finance, legal, or operations', 'Fundraising & investing', 'General mentorship'], interestLabel: 'Where could you help most?', msgLabel: 'Your background, in a sentence or two', msgOptional: true, linkLabel: 'LinkedIn', redirect: '/thanks-mentor' })}</div></div>
    <aside class="contact-aside">
      <div class="contact-card"><h3>What mentors do</h3><p>Lead a Lunch &amp; Learn, hold office hours with cohort founders, help a team get Pitch Day ready, or take one founder under your wing.</p></div>
      <div class="contact-aside__block"><h3>The time commitment</h3><p>You set it. An hour counts. Founders remember the person who showed up when nobody had to.</p></div>
      <div class="contact-aside__block"><h3>You are in good company</h3><p>Our board includes leadership behind SevenRooms&rsquo; $1.2B acquisition and the Ventura Chamber of Commerce.</p></div>
      <div class="contact-aside__block"><h3>Questions?</h3><p><a href="mailto:info@startupventura.com">info@startupventura.com</a></p></div>
    </aside>
  </div></div></section>` +
    ctaBand('Prefer to back founders financially?', 'none'),
});

// WORKSHOPS → /workshop (form 'workshop' → /thanks-workshop → workshop_lead)
page('workshop.html', {
  title: 'Founder Workshops: Save a Seat',
  robots: 'noindex',
  desc: 'Get first invitations to Startup Ventura\'s founder workshop series in Ventura County: practical sessions on starting and growing a company, free to attend.',
  canonical: `${SITE}/workshop`,
  body: pageHead('Workshops', 'Learn to build, right here at home.', 'Our founder workshop series is the on-ramp to the accelerator: practical, no-fluff sessions on starting and growing a company in Ventura County. Seats are limited and invitations go to this list first. Tell us you want in and we will save you a seat when the next workshop is scheduled.') +
    `<section class="section section--pale"><div class="wrap"><div class="contact-layout">
    <div>${head('Save a seat', 'Get the first invitation.')}<div style="margin-top:28px">${form('workshop', 'Save my seat', false, true, { twoCol: true, msgLabel: 'What do you want to learn?', msgOptional: true, redirect: '/thanks-workshop' })}</div></div>
    <aside class="contact-aside">
      <div class="contact-card"><h3>Who it is for</h3><p>Anyone in Ventura County with an idea, a side project, or an early company. No pitch deck required. Curiosity counts.</p></div>
      <div class="contact-aside__block"><h3>What it costs</h3><p>Workshops are free to attend, funded by the community partners behind Startup Ventura.</p></div>
      <div class="contact-aside__block"><h3>Where it leads</h3><p>The workshop series is the on-ramp to our accelerator, whose first cohort launches Spring 2027.</p></div>
      <div class="contact-aside__block"><h3>Questions?</h3><p><a href="mailto:info@startupventura.com">info@startupventura.com</a></p></div>
    </aside>
  </div></div></section>` +
    ctaBand('Help keep founder programming free.', 'none'),
});

// EVENTS → /events (form 'events' → /thanks-events → events_subscribe).
// Full events page: fall workshop schedule + calendar subscribe + invite list.
// Hidden until SHOW_EVENTS_NAV flips: no nav tab, noindex, out of sitemap.
page('events.html', {
  title: 'Events: The Fall Workshop Series',
  robots: SHOW_EVENTS_NAV ? undefined : 'noindex',
  desc: 'Startup Ventura\'s fall workshop series for Ventura County small businesses and founders: ten free sessions every other Tuesday starting September 1, plus Pitch Day and the Annual Benefit.',
  canonical: `${SITE}/events`,
  body: pageHead('Events', 'Be in the room.', 'Ten free workshops for Ventura County small businesses and founders, every other Tuesday starting September 1. Plus Lunch &amp; Learns, Pitch Day, and our Annual Benefit. Get on the list and every invitation lands in your inbox.') +
    `<section class="section"><div class="wrap wrap--narrow">${head('The schedule', 'Ten workshops. Every other Tuesday.', 'Practical, no-fluff sessions built on Google&rsquo;s small business curriculum, free to attend. Times and venues come with your invitation.')}
    ${workshopEvents.length ? `<ol class="event-list">${workshopEvents.map((e) => `<li class="event-row"><span class="event-row__date">${esc(e.date)}</span><div><h3 class="event-row__title">${esc(e.title)}</h3><p class="event-row__add">Add to calendar: <a href="${gcalAddUrl(e)}" target="_blank" rel="noopener">Google</a> &middot; <a href="${icsFile(e)}">Apple / Outlook</a></p></div>${e.tag ? `<span class="event-tag">${esc(e.tag)}</span>` : ''}</li>`).join('')}</ol>` : `<p class="muted" style="margin-top:12px">The next series is being scheduled now. Get on the list below and you will hear first.</p>`}
    ${EVENTS_CAL_URL ? `<div class="center" style="margin-top:30px"><a class="btn btn--blue" href="${EVENTS_CAL_URL}" target="_blank" rel="noopener">Subscribe to the events calendar</a></div><p class="center muted" style="margin-top:10px;font-size:14px">Adds the series to your Google Calendar, updates included.</p>` : ''}</div></section>
    <section class="section section--pale"><div class="wrap"><div class="contact-layout">
    <div>${head('Get invited', 'Every event, first.')}<div style="margin-top:28px">${form('events', 'Get event invites', false, false, { redirect: '/thanks-events' })}</div></div>
    <aside class="contact-aside">
      <div class="contact-card"><h3>The last one</h3><p>Our first Annual Benefit drew 75 supporters, 5 keynote speakers, and raised $17K in one night for the inaugural cohort.</p></div>
      <div class="contact-aside__block"><h3>What is coming</h3><p>The fall workshop series above, weekly Lunch &amp; Learns during the cohort, and a Pitch Day in front of 25+ investors.</p></div>
      <div class="contact-aside__block"><h3>Questions?</h3><p><a href="mailto:info@startupventura.com">info@startupventura.com</a></p></div>
    </aside>
  </div></div></section>` +
    ctaBand('Want these rooms to keep happening?', 'none'),
});

// THANK YOU — post-donation page. Zeffy's custom redirect (set via Zeffy
// support) points here after a completed gift, so this is where the donation
// conversion fires. noindex (not a page anyone should find via search).
const confettiScript = `<script>
(function(){
  var canvas=document.getElementById('sv-confetti'); if(!canvas) return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var ctx=canvas.getContext('2d'), DPR=Math.min(window.devicePixelRatio||1,2), W,H;
  function size(){W=canvas.width=innerWidth*DPR;H=canvas.height=innerHeight*DPR;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';}
  size(); addEventListener('resize',size);
  // Startup Ventura wave blues + coral.
  var COLORS=['#A9CCE8','#6FA8DC','#4E86C0','#2E5E9C','#1F3A52','#EA5A3D','#FF8A6E'];
  var parts=[], raf=null, running=false, G=0.14*DPR;
  function rnd(a,b){return a+Math.random()*(b-a);}
  function spawn(n,x,y,a0,a1,pmin,pmax){
    for(var i=0;i<n;i++){
      var ang=rnd(a0,a1), sp=rnd(pmin,pmax);
      parts.push({x:x,y:y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,
        w:rnd(6,13)*DPR,h:rnd(9,18)*DPR,rot:rnd(0,6.28),vr:rnd(-.3,.3),
        color:COLORS[(Math.random()*COLORS.length)|0],life:0,ttl:rnd(180,340),
        sway:rnd(.4,1.8),swayr:rnd(0,6.28),circle:Math.random()<.28});
    }
  }
  function party(){
    // two bottom-corner cannons firing inward-up + a wide top rain = lots of confetti
    spawn(150, W*0.04, H*0.98, -1.35, -0.75, 13*DPR, 20*DPR);
    spawn(150, W*0.96, H*0.98, -2.39, -1.79, 13*DPR, 20*DPR);
    spawn(160, W*0.5, -20*DPR, 1.15, 1.99, 4*DPR, 9*DPR);
    if(!running){running=true; raf=requestAnimationFrame(tick);}
  }
  function tick(){
    ctx.clearRect(0,0,W,H);
    for(var i=parts.length-1;i>=0;i--){
      var p=parts[i]; p.life++; p.vy+=G;
      p.x+=p.vx+Math.sin(p.life*0.05+p.swayr)*p.sway*DPR; p.y+=p.vy; p.rot+=p.vr;
      var a=p.life>p.ttl-50?Math.max(0,(p.ttl-p.life)/50):1;
      ctx.save(); ctx.globalAlpha=a; ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.color;
      if(p.circle){ctx.beginPath();ctx.arc(0,0,p.w/2,0,6.29);ctx.fill();}
      else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
      if(p.y>H+60||p.life>p.ttl) parts.splice(i,1);
    }
    if(parts.length) raf=requestAnimationFrame(tick); else running=false;
  }
  if(reduce) return; // no motion for those who opt out
  party();
  setTimeout(party,650); // second wave — really a lot of confetti
  var again=document.getElementById('sv-confetti-again');
  if(again) again.addEventListener('click',function(){party();setTimeout(party,500);});
})();
</script>`;

// Donation conversion. Fires when a donor reaches this page after completing on
// Zeffy. Fill in the Google Ads conversion send_to once the Ads conversion
// action exists; the GA4 'donate' event works as soon as analytics is live.
const conversionScript = `<script>
(function(){try{
  if(window.dataLayer){ window.dataLayer.push({event:'donate',transaction_source:'zeffy'}); }
  if(window.gtag){
    gtag('event','donate',{transaction_source:'zeffy'});
    /* Google Ads: replace AW-XXXXXXXXXX/LABEL with your conversion action, then uncomment:
    gtag('event','conversion',{send_to:'AW-XXXXXXXXXX/LABEL'}); */
  }
}catch(e){}})();
</script>`;

page('thank-you.html', {
  title: 'Thank You',
  robots: 'noindex',
  noZeffy: true, // post-donation page: skip the heavy embed so the confetti runs smoothly
  desc: 'Thank you for supporting Startup Ventura and the founders building in Ventura County.',
  body: `<canvas id="sv-confetti" aria-hidden="true"></canvas>
  <section class="section thankyou"><div class="wrap wrap--narrow" style="text-align:center;position:relative;z-index:2">
    <p class="eyebrow">Thank You</p>${waveRule}
    <h1 class="display">You just helped a founder build here.</h1>
    <p class="lede" style="margin-inline:auto">Your gift goes straight to the inaugural Spring 2027 cohort &mdash; the mentorship, capital connections, and community that keep Ventura County&rsquo;s best founders building at home. We could not do this without you.</p>
    <div class="center" style="margin-top:30px"><a class="btn btn--blue" href="index.html">Back to home</a>&nbsp;&nbsp;<a class="btn btn--outline" href="donor-wall.html">See the donor wall</a></div>
    <p class="muted" style="margin-top:34px;font-size:14px;max-width:60ch;margin-inline:auto">A receipt is on its way to your inbox from Zeffy. Startup Ventura is a 501(c)(3) nonprofit (EIN 39-2204612); your donation is tax-deductible to the extent allowed by law.</p>
    <button id="sv-confetti-again" class="thankyou__again" type="button">Celebrate again &#127881;</button>
  </div></section>
  ${confettiScript}${conversionScript}
  <script>/* Zeffy embed is omitted here, so make any Give button open the hosted form. */
  document.querySelectorAll('[zeffy-form-link]').forEach(function(btn){btn.addEventListener('click',function(){window.open('https://www.zeffy.com/donation-form/donate-to-startup-ventura','_blank','noopener');});});</script>`,
});

// /connected — success page for the /connect form (both the AJAX redirect and
// Netlify's native-POST action land here). Unlisted + noindex. Fires the GA4
// generate_lead event, which is the clean Google Ads conversion for the paid
// funnel: only real conversation requests ever reach this URL, unlike the
// form_submit event which fires for every form on the site.
page('connected.html', {
  title: 'Talk Soon',
  robots: 'noindex',
  noZeffy: true, // post-submit page: skip the heavy embed so the confetti runs smoothly
  desc: 'Your conversation request is in. A member of the Startup Ventura team will reach out to set up time with founder Luke Erickson.',
  canonical: `${SITE}/connected`,
  body: `<canvas id="sv-confetti" aria-hidden="true"></canvas>
  <section class="section thankyou"><div class="wrap wrap--narrow" style="text-align:center;position:relative;z-index:2">
    <p class="eyebrow">Connected</p>${waveRule}
    <h1 class="display">Big change starts with a conversation.</h1>
    <p class="lede" style="margin-inline:auto">The kind between people who are ready to make a difference. You just started one. A real member of our team will reach out within a day or two to set up time with our founder, Luke Erickson.</p>
    <div style="margin-top:34px">${MEAD_QUOTE}</div>
    <div class="center" style="margin-top:30px"><a class="btn btn--blue" href="index.html">See what we are building</a>&nbsp;&nbsp;<a class="btn btn--outline" href="impact.html">Explore the impact</a></div>
    <p class="muted" style="margin-top:34px;font-size:14px;max-width:60ch;margin-inline:auto">Prefer email? Reach us anytime at <a href="mailto:info@startupventura.com">info@startupventura.com</a>.</p>
    <button id="sv-confetti-again" class="thankyou__again" type="button">Celebrate again &#127881;</button>
  </div></section>
  ${confettiScript}<script>(function(){try{if(window.dataLayer){window.dataLayer.push({event:'generate_lead',form_name:'connect'});}if(window.gtag){gtag('event','generate_lead',{form_name:'connect'});}}catch(e){}})();</script>
  <script>/* Zeffy embed is omitted here, so make any Give button open the hosted form. */
  document.querySelectorAll('[zeffy-form-link]').forEach(function(btn){btn.addEventListener('click',function(){window.open('https://www.zeffy.com/donation-form/donate-to-startup-ventura','_blank','noopener');});});</script>`,
});

// Ad-funnel success pages — one per funnel so each fires its own GA4 event
// (clean per-campaign conversions) and each URL doubles as a remarketing
// audience. Thank-you pattern: confetti, noZeffy, noindex, Give fallback.
const funnelThanks = (file, o) => page(file, {
  title: o.title,
  robots: 'noindex',
  noZeffy: true,
  desc: o.desc,
  canonical: `${SITE}/${file.replace('.html', '')}`,
  body: `<canvas id="sv-confetti" aria-hidden="true"></canvas>
  <section class="section thankyou"><div class="wrap wrap--narrow" style="text-align:center;position:relative;z-index:2">
    <p class="eyebrow">${o.eyebrow}</p>${waveRule}
    <h1 class="display">${o.h1}</h1>
    <p class="lede" style="margin-inline:auto">${o.lede}</p>
    ${o.quote ? `<div style="margin-top:34px">${MEAD_QUOTE}</div>` : ''}${o.extra || ''}
    <div class="center" style="margin-top:30px"><a class="btn btn--blue" href="${o.primary[1]}">${o.primary[0]}</a>&nbsp;&nbsp;<a class="btn btn--outline" href="${o.secondary[1]}">${o.secondary[0]}</a></div>
    <p class="muted" style="margin-top:34px;font-size:14px;max-width:60ch;margin-inline:auto">Prefer email? Reach us anytime at <a href="mailto:info@startupventura.com">info@startupventura.com</a>.</p>
    <button id="sv-confetti-again" class="thankyou__again" type="button">Celebrate again &#127881;</button>
  </div></section>
  ${confettiScript}<script>(function(){try{if(window.dataLayer){window.dataLayer.push({event:'${o.event}'});}if(window.gtag){gtag('event','${o.event}');}}catch(e){}})();</script>
  <script>document.querySelectorAll('[zeffy-form-link]').forEach(function(btn){btn.addEventListener('click',function(){window.open('https://www.zeffy.com/donation-form/donate-to-startup-ventura','_blank','noopener');});});</script>`,
});

funnelThanks('thanks-apply.html', {
  title: 'You Are on the Inside Track', eyebrow: 'First Access', event: 'founder_lead',
  desc: 'You have first access when applications open for Startup Ventura\'s Spring 2027 accelerator cohort.',
  h1: 'Front of the line.',
  lede: 'You have first access when applications open for the Spring 2027 cohort. We read every submission, and we will reach out as timing and fit line up. Until then: keep building.',
  primary: ['See the program', 'program.html'], secondary: ['Meet the board', 'about.html'],
});
funnelThanks('thanks-mentor.html', {
  title: 'Welcome, Mentor', eyebrow: 'Welcome', event: 'mentor_lead', quote: true,
  desc: 'Thank you for offering your experience to Ventura County founders through Startup Ventura.',
  h1: 'Founders just got stronger.',
  lede: 'Thank you. We will reach out to match your expertise with the founders and programming where you matter most. The workshop series comes first, and the inaugural cohort launches Spring 2027.',
  primary: ['See what we are building', 'index.html'], secondary: ['Explore the impact', 'impact.html'],
});
funnelThanks('thanks-workshop.html', {
  title: 'Seat Saved', eyebrow: 'Seat Saved', event: 'workshop_lead',
  desc: 'Your seat is saved. You will get the first invitation when the next Startup Ventura founder workshop is scheduled.',
  h1: 'You are on the list.',
  lede: 'When the next workshop is scheduled, your invitation goes out first. Bring your idea, your questions, or just your curiosity.',
  primary: ['What the series covers', 'workshops.html'], secondary: ['See the full program', 'program.html'],
});
funnelThanks('thanks-events.html', {
  title: 'See You in the Room', eyebrow: 'On the List', event: 'events_subscribe',
  desc: 'You are on the Startup Ventura events list: workshops, Lunch & Learns, Pitch Day, and the Annual Benefit.',
  h1: 'See you in the room.',
  lede: 'Every Startup Ventura event invitation will land in your inbox, from founder workshops to Pitch Day to the Annual Benefit.',
  extra: EVENTS_CAL_URL ? `<p style="margin-top:26px"><a class="btn btn--outline" href="${EVENTS_CAL_URL}" target="_blank" rel="noopener">Subscribe to the events calendar</a></p>` : '',
  primary: ['See what we are building', 'index.html'], secondary: ['Latest news', 'news.html'],
});

// 404 — Netlify serves /404.html automatically for missing routes.
page('404.html', {
  title: 'Page not found',
  robots: 'noindex',
  body: `<section class="section"><div class="wrap wrap--narrow" style="text-align:center;padding-block:8vh">
    <header class="section-head section-head--center"><p class="eyebrow">404</p>${waveRule}<h1 class="section-head__title display">This page drifted out with the tide.</h1></header>
    <p class="lede" style="margin-inline:auto">The page you are looking for does not exist or has moved. Head back to shore.</p>
    <div class="center" style="margin-top:28px"><a class="btn btn--blue" href="index.html">Back to the homepage</a>&nbsp;&nbsp;<a class="btn btn--outline" href="contact.html">Contact us</a></div>
  </div></section>`,
});

// sitemap.xml + robots.txt (indexing). Noindex pages and the standalone
// calculator app are excluded from the sitemap.
const sitemapUrls = PAGE_MANIFEST
  .filter((p) => !p.robots.includes('noindex') && p.file !== 'impact-calculator.html')
  .map((p) => `  <url><loc>${p.canonical}</loc></url>`)
  .join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /explore-83-palm.html\nDisallow: /explore/83-palm\nDisallow: /advisors.html\nDisallow: /advisors\n\nSitemap: ${SITE}/sitemap.xml\n`);

// llms.txt — a curated markdown map of the site for AI crawlers/answer engines.
const llmsTxt = `# Startup Ventura

> Startup Ventura is a 501(c)(3) nonprofit startup accelerator in Ventura County, California. It backs early-stage founders with mentorship, capital connections, and community so they can build high-growth companies at home instead of leaving for San Francisco or Los Angeles.

Startup Ventura was founded in 2025 by Luke Erickson, who serves as Executive Director. Its accelerator and workshops are free for founders (no tuition, no equity), funded by donors and community partners. The inaugural cohort is planned for Spring 2027, backed by committed funding from the City of Ventura. Startup Ventura holds Candid's 2026 Platinum Seal of Transparency.

## Key facts
- Type: 501(c)(3) nonprofit startup accelerator (EIN 39-2204612)
- Location: Ventura County, California
- Founded: 2025 by Luke Erickson (Executive Director)
- Program: a free accelerator plus a pre-accelerator workshop series for early-stage founders; mentorship, capital connections, and a Demo Day / Pitch Day with investors
- Inaugural cohort: Spring 2027, with committed funding from the City of Ventura
- Contact: info@startupventura.com

## Main pages
- [Home](${SITE}/): mission and overview
- [The Program](${SITE}/program): accelerator + workshops
- [Why Ventura County](${SITE}/why-ventura-county): the problem Startup Ventura solves
- [Impact](${SITE}/impact): traction and where donations go
- [Give](${SITE}/give): donate to fund the cohort (tax-deductible)
- [Partner](${SITE}/partner): sponsorship and public/foundation partnership
- [About](${SITE}/about): board, team, and story
- [Careers](${SITE}/careers): open roles and how to apply
- [FAQ](${SITE}/faq): common questions answered
- [News](${SITE}/news): announcements and updates
- [Contact](${SITE}/contact): get in touch
`;
fs.writeFileSync(path.join(OUT, 'llms.txt'), llmsTxt);

console.log('Generated', fs.readdirSync(OUT).length, 'files into preview/site/ (incl. sitemap.xml + robots.txt)');
