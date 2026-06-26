# Startup Ventura Website Audit

Report only. Nothing on the site was changed. This file is the single deliverable.

**Scope and method.** No `TARGET_URL` was set, so this audit reads the theme source of truth at `startup-ventura/` (PHP templates, `inc/*.php`, `template-parts/*.php`, `assets/css/main.css`, `assets/js/main.js`) and the static rendered mirror at `preview/site/*.html` (which uses the real CSS and JS). SEO meta and JSON-LD were judged from `inc/schema.php` because that output is generated at runtime by WordPress and is not present in the static mirror. The home mirror was loaded live and the console was clean (no JS errors). Every finding is grounded in a file, line, or page. Eight lenses were run: conversion, information architecture, features, content, SEO, technical, accessibility, and mobile.

**The yardstick.** Primary goal: donations to fund the inaugural Spring 2027 (S27) cohort. Secondary goals: founder applications and institutional partnerships. Three audiences: donors and investors, founders, and government, institutions, and foundations.

---

## Executive summary

The site is well built. The donation rail is genuinely strong (one-click Zeffy from anywhere, four giving tiers, a complete `/give` page), the SEO foundation is real (Organization, Article, and Breadcrumb JSON-LD), the front end is lean and fast, and the mobile conversion scaffolding (persistent give-bar, safe-area padding, 48px tap targets) is better than most hand-coded themes. The problems are not structural. They are trust leaks and unfinished pieces sitting on the exact pages where donors and founders decide.

The five biggest opportunities:

1. **The site reads as unfinished at the moment of the ask.** Literal editorial placeholders render to visitors: `[Confirm stock/DAF details]` on the Give page (`page-give.php:91`), `[Confirm specifics.]` and `[Confirm eligibility specifics.]` on the accelerator page (`page-accelerator.php:65,103`), `[Confirm specifics...]` on the government partner page (`page-partner-government.php:65`), four `[Confirm topic]` notes on workshops, and a `[Name]` token in the Legacy tier (`inc/helpers.php:244`). The accelerator "Key dates" block prints unset constants (`SV_APP_OPEN`, `SV_COHORT_START`, and the rest) as bracket tokens. These sit on the Give, partner, and founder pages where money and applications are decided.

2. **Apply is a bait and switch for founders.** `SV_APPLICATION_URL` is still the placeholder `[APPLICATION_URL]` (`functions.php:18`), so every "Apply to the cohort" button degrades to `/contact/#notify` (`inc/helpers.php:40-46`), a "notify me when applications open" email field. The promise does not match the destination and nothing on arrival explains the gap. The entire secondary applications goal currently converts to a waitlist.

3. **The strongest proof is hidden, and it contradicts itself.** The traction stat band (75 attended, $17K raised, 5 speakers) is fully built (`template-parts/stat-band.php`, `inc/helpers.php:176-182`) but is included by no template, so it renders nowhere. The only place the benefit appears is the news post, which says **$15,000** twice (`inc/seed.php:209,215`) while the stat code says **$17K** (`inc/helpers.php:179`). A donor sees the weaker number, and the stronger one is both unused and inconsistent.

4. **The Impact page proves nothing.** `page-impact.php` is titled "Traction now. A cohort next." but contains no numbers, no use-of-funds, no board, no benefit recap, and no progress meter. It is the page a careful donor or a foundation opens to verify the organization, and it is a due-diligence dead end.

5. **The primary donate button fails color contrast.** White text on the coral Give button is 3.48:1 against `--coral #EA5A3D` (`main.css:109`), below the WCAG AA threshold of 4.5:1 for its size. The single most important control on the site is hard to read for low-vision donors, and it is reused on the header, hero, mobile give-bar, and every tier card.

**The single highest-impact move:** run a one-day credibility pass on the conversion pages. Strip every live placeholder, make Apply honest while the portal is pending, reconcile and surface the traction stat, fix the Give-button contrast, and bring the 501(c)(3) and EIN signals up next to the home-page ask. Every item is small effort, and together they stop the site from actively repelling the two most valuable audiences before any bigger bet is built.

---

## Goal scorecard

| Goal | Grade | Read |
|---|---|---|
| **Donations (primary)** | C+ | Excellent low-friction rail (Zeffy one-click, tiers, strong `/give`), undercut by hidden and contradictory proof, no urgency or progress meter, no recurring option, placeholder text near the ask, and a failing Give-button contrast. The machine is good; the trust layer leaks. |
| **Applications (secondary)** | D | No real application portal. Apply silently routes to a notify form, the timeline shows placeholder dates, the founder story is thinner than the donor story, and there is no mentors page to prove program quality. |
| **Partnerships (secondary)** | C+ | The institutional story is the content high point (City of Ventura $49,500, economic-development framing, a clear Partner hub split). Held back by a `[Confirm]` placeholder on the government partner page, no donor or sponsor recognition wall, and no transparency or impact page that foundations require before granting. |

| Audience | Read |
|---|---|
| **Donors and investors** | A clear path exists and the donation mechanics are solid, but the proof a donor needs (traction numbers, where the money goes, EIN and 501(c)(3) at the point of decision) is misplaced, hidden, or contradictory. No way to see momentum toward the S27 goal. |
| **Founders** | The weakest path. Apply dead-ends at a waitlist, key dates are placeholders, and there is no mentors page or real portal. The founder audience also has no page where their own primary action is the dominant CTA. |
| **Government, institutions, foundations** | The best content and a genuine differentiator, but missing the transparency and impact page these funders open first, missing the recognition the tiers promise, and carrying a visible placeholder on their own page. |

---

## Recommendations

Effort is S, M, or L. Impact is High, Medium, or Low. Priority is P0 (do now) to P3 (someday).

### New pages

| Page | Purpose and audience | Effort | Impact | Priority |
|---|---|---|---|---|
| **Ways to Give** (or rebuild `page-give.php`) | Lead with recurring and monthly giving as a first-class option, plus real sections for stock, donor-advised funds, employer matching, and major gifts. Replaces the mailto-only cards and the `[Confirm]` placeholder at `page-give.php:91`. Audience: donors. Recurring is the highest-retention mechanism for a 501(c)(3) and is absent today. | M | High | P0 |
| **Impact / Annual Report** | Turn `page-impact.php` into a real transparency page: verified traction numbers, use-of-funds breakdown, board accountability, the benefit recap, partner logos, and a downloadable report. Audience: major donors and foundations who verify before giving. | L | High | P1 |
| **Donor Wall / Founders Circle recognition** | A page that lists named supporters and logos by tier, fulfilling the recognition every tier already promises (`inc/helpers.php:208,216,227,246`). Audience: major and institutional donors. Without it the tier pitch is undeliverable. | M | High | P1 |
| **Founder Application page and portal** | A real application destination, wire `SV_APPLICATION_URL`, and fill the date constants so the accelerator timeline renders real dates. Audience: founders. This is the secondary applications goal, currently at zero. | L | High | P1 |
| **Privacy Policy and Terms** | Baseline legal pages for a site running a Zeffy donation flow plus four PII-collecting forms (`inc/forms.php`). Link in the footer legal cluster. Audience: all, especially cautious donors and institutions. | S | Medium | P1 |
| **Mentors / Network** | Profile the operators and mentors founders will work with. Mentorship is the headline product benefit and a donor-facing perk, but no page proves who the mentors are. Audience: founders and donors. | M | Medium | P2 |
| **Events / Demo Day** | Cover Demo Day and the Annual Benefit with dates and RSVP. These are the main donor-cultivation moments and are sold as tier perks with no page to make them tangible. Audience: donors and founders. | M | Medium | P2 |
| **FAQ** (consolidated or per-audience blocks) | Answer the recurring donor, founder, and institution questions (tax-deductibility, recurring, equity, eligibility, reporting) that block conversion. Add FAQPage schema. Audience: all three. | M | Medium | P3 |
| **Press / Media Kit** | Boilerplate, logos, EIN, board bios, press contact. The contact form already invites Press inquiries (`page-contact.php:36`) but gives journalists nothing to work from. Audience: media and institutions. | S | Low | P3 |

### New features

| Feature | Purpose and value | Effort | Impact | Priority |
|---|---|---|---|---|
| **Recurring / monthly giving surfaced on-site** | Confirm the Zeffy form has a monthly option, then add a "Give monthly" variant on `/give` and the home gift band. Monthly gifts are the most reliable way to fund a repeating annual cohort. Today monthly is invisible (`template-parts/give-button.php`). | S | High | P0 |
| **Live fundraising progress meter** | A "X of $Y raised to launch the Spring 2027 cohort" bar on Give, Home, and Impact, driven by two editable constants and the existing count-up engine (`main.js:151-177`). Creates urgency and proves momentum. | M | High | P0 |
| **Surface the existing traction stat band** | Render the already-built `sv_stat_band` (75 attended, $17K, 5 speakers) on Home and Impact after reconciling the number. Built code, zero new design, immediate donor proof. | S | High | P1 |
| **Donor wall data and render** | The data layer plus a render that backs the recognition page above. Named-donor social proof lifts the next gift. | M | High | P1 |
| **General newsletter / nurture capture** | A "stay in the loop" signup distinct from the S27 notify list, reusing the existing AJAX form (new `type=newsletter`). Captures warm donors and partners not ready to act today. | S | Medium | P1 |
| **Gift calculator** | Turn the static three-amount grid into an input where a donor sees the impact of their own number, with quick-pick chips. Reduces drop-off from the $10K anchor and serves small and mid gifts. | M | Medium | P1 |
| **Event RSVP wired to the form backend** | RSVP capture on the Events page, ideally sharing the backend the iOS app already uses for events. Builds the list and makes the Demo Day perk real. | M | Medium | P2 |

### Fixes

**Conversion and trust**

| Fix | Why (goal) | Effort | Impact | Priority |
|---|---|---|---|---|
| Strip all live `[Confirm ...]` and `[Name]` placeholders (`page-give.php:91`, `page-accelerator.php:65,103`, `page-partner-government.php:65`, `page-workshops.php:36,53,61,69`, `inc/helpers.php:244`), and hide or fill the accelerator "Key dates" block until the date constants are set. | Visible unfinished text on the Give, partner, and founder pages suppresses donations, sponsorships, and applications at the decision point. | S | High | P0 |
| Make Apply honest while the portal is pending: relabel to "Get notified when applications open" or add an on-arrival explanation at `/contact/#notify`. Centralize via `sv_apply_button`. | Closes the biggest leak in the founder path. An honest label keeps the email and sets expectations instead of bouncing the founder. | S | High | P0 |
| Reconcile $17K vs $15,000 to one verified figure and use it everywhere (`inc/helpers.php:179` and `inc/seed.php:209,215`). Confirm "75 attended" and "5 speakers" against the recap. | A self-contradicting traction number undermines proof at the moment of giving and reads as careless to funders doing diligence. | S | High | P0 |
| Bring the 501(c)(3) plus EIN plus "Secure via Zeffy" trust trio up next to the home-page asks (`template-parts/hero.php:32-37`, `front-page.php:93`), matching the pattern already used on `/give`. | Most donors first decide on the home page, where the trust proof is currently absent and only appears far down. | S | Medium | P1 |
| Set `SV_GTM_ID` and the Turnstile keys before launch (`functions.php:26,31-32`). | Without analytics you cannot see which CTAs and channels drive gifts (instrumentation already fires in `main.js:214-254`); without Turnstile the lead forms run honeypot-only and real donor and partner leads get buried in spam. | S | Medium | P1 |

**Content**

| Fix | Why (goal) | Effort | Impact | Priority |
|---|---|---|---|---|
| Rebuild the Impact page to lead with proof: corrected stats, the City of Ventura $49,500 win, board credibility, partner logos, and a progress line. | Impact is the page donors and foundations open to justify a gift; today it contradicts its own "Traction now" headline and makes no case. (Overlaps the Impact page rebuild above.) | M | High | P1 |
| Fix the stale launch date and terminology: the benefit recap says an "incubator launching in early 2026" (`inc/seed.php:216`) while every page now promises Spring 2027, and the org is called both accelerator and incubator. | A published post promising a launch that did not happen makes a momentum story read as a missed deadline. | S | Medium | P1 |
| Restore news cadence and lead the index with forward progress, not a four-month-old board appointment (newest post is Feb 28 2026; three of five are board adds). | News is where donors and institutions gauge momentum right before the ask. | M | Medium | P2 |

**SEO**

| Fix | Why (goal) | Effort | Impact | Priority |
|---|---|---|---|---|
| Set a unique per-page meta description on every static page via `$GLOBALS['sv_meta']['description']`. The plumbing exists (`inc/schema.php:18-21`); only the override values are missing, so every page currently shows one identical Google snippet. | Intent-matched snippets lift click-through for donors, founders, and institutions searching exactly these terms, especially on the Give and Partner pages. | M | High | P0 |
| Give the front page a keyword-rich title via a `pre_get_document_title` filter (for example "Startup Ventura, Nonprofit Startup Accelerator in Ventura County") instead of the bare site name. | The home title is the highest-weight on-page SEO element for the brand, category, and location search. | S | High | P0 |
| Enrich the NGO JSON-LD (`inc/schema.php:107-133`) with `foundingDate`, `areaServed` (Ventura County), `slogan`, `knowsAbout`, and links to GuideStar/Candid and ProPublica once live. Add Event schema for Demo Day and the Annual Benefit when dates exist. Curate the sitemap (drop the author sitemap, noindex search results). | These are the structured signals grant officers and major donors verify a 501(c)(3) against, and they keep crawl budget on the pages that convert. | S to M | Medium | P2 |

**Technical**

| Fix | Why (goal) | Effort | Impact | Priority |
|---|---|---|---|---|
| Preload the home hero image in `<head>` on the front page only, alongside the existing font preloads (`inc/enqueue.php:56-70`). | The hero is the home-page LCP and the donor's first impression; preloading cuts LCP on the page that drives donations. | S | High | P0 |
| Compress and add responsive sources for the hero (`hero.jpg` is 290KB, single resolution, no WebP/AVIF) and `ventura-pier.jpg` (151KB). | Most donor traffic is mobile and cellular; halving the hero weight speeds the first paint donors judge the org by. | M | High | P1 |
| Make slow-JS `.reveal` content fail open, and trim or make more obvious the first-visit intro overlay (it runs about 2.6s over the hero before resolving). | Below-hero content carries secondary conversion paths and can sit invisible on a slow deferred `main.js`; the intro hides the hero and Give button on first arrival. | S to M | Medium | P2 |

**Accessibility**

| Fix | Why (goal) | Effort | Impact | Priority |
|---|---|---|---|---|
| Darken the Give-button fill so white text passes AA. White on `--coral #EA5A3D` is 3.48:1 and the hover `--coral-deep` is 4.20:1 (`main.css:109-110`); a fill near `#C5442B` reaches about 4.6:1. Keep brighter coral for accents only. | The Give button is the primary donation control sitewide; low-vision donors who cannot read it cannot convert. | S | High | P0 |
| Mark invalid form fields programmatically on error (`aria-invalid`, `aria-describedby`) in `main.js:281-284`, not just the visual `.is-err` class. | A screen-reader user on the contact, partner, or notify forms is not told which field failed and may abandon, losing a founder or partner lead. | S | Medium | P1 |
| Lift the small-text label pairs under 4.5:1 (steel on sky-pale, coral-deep stat numerals), and add a focus guard so the intro overlay cannot leave Tab on the hidden header Give and Apply buttons. | Credibility copy on partner and stat strips should not fail AA, and the home keyboard path should stay predictable over the primary CTA. | S to M | Low | P2 |

**Mobile**

| Fix | Why (goal) | Effort | Impact | Priority |
|---|---|---|---|---|
| Move the full-width Give to the top of the open mobile menu (currently below all six nav items, `header.php:66`). | Reduces friction for mobile users who open the hamburger looking for "Donate." | S | Medium | P2 |
| Suppress the fixed give-bar on `/give` itself, where the hero and tier Give buttons already fill the screen and the bar steals about 68px from the tier cards. | Reclaims space for the highest-value donation asks on the smallest screens. | S | Medium | P2 |
| Nudge the home hero CTAs clear of the give-bar on short viewports, and raise the give-bar label from 12px muted mono for outdoor legibility. | Protects the first impression of the primary CTA pair and the only always-visible donation prompt on phones. | S to M | Low | P3 |

---

## Prioritized roadmap

Quick wins first (high impact, small effort), then the bigger bets.

| Phase | Item | Effort | Impact | Priority |
|---|---|---|---|---|
| **1. Credibility pass (the half-day that unblocks everything)** | Strip live placeholders and the empty date block | S | High | P0 |
| | Make Apply honest until the portal ships | S | High | P0 |
| | Reconcile and surface the traction stat ($17K vs $15K) | S | High | P0 |
| | Fix Give-button contrast | S | High | P0 |
| | Bring EIN and 501(c)(3) to the home ask | S | Medium | P1 |
| **2. Quick SEO and technical wins** | Per-page meta descriptions and a real home title | S to M | High | P0 |
| | Preload the hero image | S | High | P0 |
| | Set GTM and Turnstile keys | S | Medium | P1 |
| | Add Privacy and Terms pages | S | Medium | P1 |
| | aria-invalid on form errors | S | Medium | P1 |
| **3. Donation momentum** | Surface recurring / monthly giving | S | High | P0 |
| | Live fundraising progress meter | M | High | P0 |
| | Newsletter / nurture capture | S | Medium | P1 |
| | Gift calculator | M | Medium | P1 |
| | Compress and make the hero responsive | M | High | P1 |
| **4. Trust and depth pages** | Rebuild Impact into a transparency / annual-report page | L | High | P1 |
| | Ways to Give page (recurring, stock, DAF, match) | M | High | P0 to P1 |
| | Donor wall page and data | M | High | P1 |
| | Founder application portal and wired dates | L | High | P1 |
| **5. Bigger bets** | Mentors page | M | Medium | P2 |
| | Events / Demo Day page and RSVP | M | Medium | P2 |
| | FAQ page with schema | M | Medium | P3 |
| | Press / media kit | S | Low | P3 |
| | Schema enrichment, Event markup, sitemap curation | S to M | Medium | P2 |

---

## Next step

Pick the items you want from the buckets above. Reply with the list (by name or by priority tier, for example "all of Phase 1" or specific rows), and I will plan and build only those. I will not start implementing anything until you choose.
