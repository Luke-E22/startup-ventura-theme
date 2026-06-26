# Startup Ventura — WordPress theme

A custom, hand-coded theme for Startup Ventura, a 501(c)(3) nonprofit startup
accelerator in Ventura County. No page builders, no jQuery, no build step
required to deploy. One job: turn a visitor into action — **Give** (primary),
Apply, or Partner.

## What makes it tick

- **One coral action.** Coral (`--coral #EA5A3D`) is reserved for the Give
  button and donation moments; everything else is coastal blues. Donations run
  through the Zeffy pop-up modal (`zeffy-form-link`), so donors never leave the page.
- **The wave signature.** One four-band wave geometry (sky → navy, coral crest)
  is reused across the intro, hero, stat band, section dividers, and footer.
- **The intro.** A hand-coded SVG/CSS intro plays once per session
  (`sessionStorage: sv_intro_seen`), resolves into a hero whose wave holds the
  same screen position, and is fully skipped under `prefers-reduced-motion`. The
  real hero renders in the DOM beneath it, so nothing is hidden from crawlers or
  delays LCP.
- **Self-hosted fonts.** Archivo (display), Hanken Grotesk (body), Space Mono
  (data/eyebrows), preloaded, `font-display: swap`.

## Edit only this

All client-editable settings live in the **CONFIG block at the top of
`functions.php`** (cohort dates, emails, Zeffy URLs, GTM id, Turnstile keys,
CSP enforcement toggle). Replace every `[BRACKETED]` placeholder before launch.

## Structure

```
functions.php        CONFIG + module bootstrap
inc/                 setup · enqueue · security (CSP) · schema (SEO/JSON-LD) · helpers · forms · seed
template-parts/      hero · intro · wave · give-button · cta-band · stat-band · stat-strip ·
                     breadcrumbs · tier-card · board-card · partner-row · testimonial · process-step · form
assets/css/main.css  the entire design system (tokens, components, intro/hero/wave, responsive, reduced-motion)
assets/js/main.js    intro gate · sticky header · dropdowns · mobile menu (focus trap) · count-up ·
                     scroll reveals · Give shine · dataLayer · UTM persistence · AJAX forms
assets/fonts/        self-hosted woff2 (Archivo, Hanken Grotesk, Space Mono)
assets/img/          logo, hero, team/, partners/, event/, og/
```

`CONVENTIONS.md` documents the helper API and CSS vocabulary for anyone extending the theme.

## Assets

Run once to (re)download every remote asset into `assets/`:

```bash
bash assets/download-assets.sh
```

Included:
- `assets/img/og/og-default.jpg` — a generated 1200×630 share image styled like the hero (wired in `inc/schema.php` for og:image/twitter:image). `partner-row` shows a styled text fallback for any missing logo, so nothing renders broken.

Still needed before launch:
- `assets/img/partners/ventura-chamber.png` — the supplied grayscale Chamber logo (not downloadable; add it). Until then the partner row shows the Chamber name as text.
- Convert photos to WebP/AVIF with fallbacks and add `srcset`/`sizes` at deploy time.

## Deploy (on the WordPress host)

1. Back up the site. Work on staging; deploy by upload; never edit live.
2. Fill the CONFIG block: `SV_APPLICATION_URL`, cohort dates, confirm emails. Leave `SV_GTM_ID` blank.
3. Zip the `startup-ventura/` folder; upload and activate.
4. Create the Pages and assign templates + parent/child + slugs:
   `/program` (page-program) → `/program/accelerator` (page-accelerator), `/program/workshops` (page-workshops);
   `/why-ventura-county` (page-why-ventura); `/impact`; `/give`;
   `/partner` (page-partner) → `/partner/cities-county` (page-partner-government), `/partner/foundations` (page-partner-foundations);
   `/about`; `/contact`; `/news` (Posts page).
   WordPress picks `page-{slug}.php` automatically by slug — no Template Name needed.
5. Settings → Reading: Home = a static front page, Posts page = News. Permalinks = Post name.
6. Build the `primary` and `footer` menus (a sensible fallback menu ships until you do). Recommended primary menu: Program ▾ (Accelerator, Workshops), Why Ventura County, Impact, Partner ▾ (Cities & County, Foundations), About ▾ (About, Contact), News. Do **not** add a "Give" item — the persistent coral Give button covers it.
7. Upload/confirm assets; the Annual Benefit recap seeds as a **draft** on activation — set its featured image and publish.
8. Configure SMTP; set SPF, DKIM, DMARC. Add Turnstile keys (`SV_TURNSTILE_SITEKEY/SECRET`) if using it.
9. In Zeffy: campaign form + goal thermometer, suggested amounts $5k/$10k/$25k/$50k plus a smaller default, monthly toggle, Apple/Google Pay, receipts, thank-you. Run a real test donation and confirm the modal opens from a Give button.
10. Security headers ship in **Report-Only** (`SV_CSP_ENFORCE = false`). Verify the full donation flow (incl. Apple/Google Pay), then set `SV_CSP_ENFORCE = true` to enforce.
11. Apply the 301 redirect map (keep it in version control). Optionally forward `#donate` → `/give`.
12. Confirm the XML sitemap; submit to Search Console and Bing.
13. Test on real mobile: sticky header, dropdowns, mobile Give bar, the intro, the Zeffy modal. Run Lighthouse (LCP < 2.5s, INP < 200ms, CLS < 0.1).
14. When ready for analytics: set `SV_GTM_ID`, map `cta_click` events to GA4 conversions, add a consent banner / GA4 consent mode.

## Notes / decisions

- **Give stays the dominant action on every page.** Where the spec's per-page
  notes say "Apply primary" or "Partner primary" on a closing band, the build
  keeps Give as the coral primary with Apply/Partner as the subordinate
  secondary — this resolves a conflict with the hard sitewide rules (Sections 2,
  4, 7) and the color discipline (coral = Give only). Confirm this is the intent.
- `DISALLOW_FILE_EDIT` must be set in `wp-config.php` (cannot be enforced from a theme).
- No PHP runtime was available during authoring, so templates were verified by
  multi-agent review rather than `php -l`; run **Theme Check** + WordPress PHPCS
  on the host before launch.
