# Startup Ventura — Visual QA Report

**Date:** 2026-06-20 · **Status:** Pass 1–4 complete. **All 7 issues fixed and verified** (see [Pass 4 — Fixes applied](#pass-4--fixes-applied)).

## How this was run

WordPress can't run in this environment, so QA used two complementary passes:

1. **Rendered (Pass 2) — Playwright headless Chromium** against the click-navigable static preview at `http://localhost:8198/preview/site/` (14 pages × 4 widths: 375/768/1024/1440, height 900), plus reduced-motion and reveal-JS-disabled variants. Full-page screenshots in `qa-screenshots/`. The preview uses the **real `assets/css/main.css` and `assets/js/main.js`**, so it faithfully validates layout, overflow, alignment, duplicates, CLS, and overlap.
2. **Code review (Pass 1) — 7 parallel reviewers** over the PHP templates + CSS + JS, each finding adversarially verified to drop false positives.

**Important:** the preview is a static mirror. It **hardcodes the wave markup** and **omits the `.reveal` class**, so a few theme-only behaviors (the `sv_wave()` default, the `.reveal` no-JS fallback, `single.php` post footer/nav) cannot surface in the rendered pass — they were caught by code review and verified directly in the code. Conversely, the rendered pass is authoritative for overflow/alignment/CLS/overlap on the live CSS.

> Note: the home hero title position was adjusted (per a separate request) *after* the Playwright screenshots were taken, so `qa-screenshots/index-*.png` show the previous (higher) hero. Everything else is current.

## Summary

| Severity | Count |
|---|---|
| Blocker | 1 |
| High | 2 |
| Medium | 2 |
| Low | 1 |
| Preview-only (not a theme bug) | 1 |

### By class
| Class | Count |
|---|---|
| Scroll-transition / animation | 2 (QA-01 wave render, QA-05 intro handoff) |
| Other (content hidden) | 1 (QA-02 reveal no-JS) |
| Overlap | 1 (QA-03 give bar) |
| Misalignment | 1 (QA-04 single.php) |
| Layout-shift | 1 (QA-06 partner logos) |
| Duplicate | 1 (QA-P1, preview only) |

### By page (real theme issues)
| Page | Issues |
|---|---|
| Home / hero / intro | QA-01, QA-02, QA-05 |
| Stat band / CTA bands (all pages) | QA-01 |
| Single news post | QA-04, QA-02 |
| All pages (footer, mobile) | QA-03 |
| Partner / About / Home (logos) | QA-06 |

### Pages that passed the rendered checks clean (no overflow, CLS < 0.1, no overlap, no duplicate sections, consistent left edge)
**All 14** at all 4 breakpoints: home, program, accelerator, workshops, why-ventura-county, impact, give, partner, partner-cities-county, partner-foundations, about, news, news-annual-benefit, contact. Header/footer/hero counts were exactly 1 on every page (no duplicate hero/nav/footer). Max CLS observed = 0.011 (home). No horizontal overflow on any page/width.

---

## Blocker

### QA-01 — `sv_wave()` defaults to `'divider'`; the four-band signature wave + intro animation never render in the theme
- **Severity:** Blocker · **Class:** Scroll-transition / animation
- **Pages/breakpoints:** Home hero, the intro overlay, every stat band, every CTA band — all widths. (Theme only; the preview hardcodes the full wave, so `qa-screenshots/index-1440.png` shows it *correctly*, masking the bug.)
- **What's wrong:** The hero, intro, stat-band, and cta-band call `sv_wave()` with no args. The wrapper forces `variant => 'divider'`, so each renders the thin 64px section-seam wave instead of the four-band wave with the coral crest. The hero/intro animation choreography (rising bands, crest stroke-draw, drift) and the stat/CTA watermark all target a `.wave` element that never exists. The hero also keeps reserving wave-height padding for a wave that isn't there.
- **Root cause:** Conflicting defaults. `template-parts/wave.php:12` defaults `variant` to `'full'`, but `inc/helpers.php:120` `sv_wave()` does `wp_parse_args($args, array('variant' => 'divider'))`, overriding it for every no-arg call. (`404.php` passes `'full'` explicitly, which is why only it renders the wave correctly.)
- **Proposed fix (1 line):** `inc/helpers.php:120` → change the default to `array( 'variant' => 'full' )`. The two intentional section-seam callers (`front-page.php:70`, `page-why-ventura.php:69`) already pass `'divider'` explicitly, so they're unaffected.

---

## High

### QA-02 — `.reveal` content has no no-JS fallback; page bodies stay invisible if `main.js` fails or is blocked
- **Severity:** High · **Class:** Other (content hidden)
- **Pages/breakpoints:** Sitewide, all widths, **non-reduced-motion users only**. (Theme only — the preview omits the `.reveal` class, so the rendered reveal-JS-disabled variant shows 0 stuck elements because there are 0 reveals to measure; verified in code.)
- **What's wrong:** `main.css:530` sets `.reveal{opacity:0;transform:translateY(22px)}` unconditionally on most body sections; visibility is restored only by `.is-in`, added by `reveals()` in `main.js`. If JS is disabled/blocked, `main.js` fails to load, or any earlier section in the shared IIFE throws, `.is-in` is never added and the content stays at `opacity:0`. (Reduced-motion users are safe — `main.css:572` forces `.reveal` visible.)
- **Root cause:** The hidden initial state is applied in CSS unconditionally instead of being gated behind proof that JS is alive.
- **Proposed fix (CSS-first):** Add `document.documentElement.classList.add('js')` to the existing inline `<script>` in `header.php` (it already runs synchronously for the intro gate), then scope the hidden rule: `main.css:530` `.reveal{...}` → `.js .reveal{...}`. Without JS the class never lands and content renders fully visible. Optionally wrap each `main.js` section in try/catch so one failure can't suppress reveals.

### QA-03 — Mobile Give bar doesn't reserve the iPhone safe-area inset; it overlaps the footer legal line on notched phones
- **Severity:** High · **Class:** Overlap
- **Pages/breakpoints:** All pages at ≤ 880px, on devices with a non-zero `safe-area-inset-bottom` (notched iPhones). (Not reproducible in desktop Chromium, which has no inset — code-review finding.)
- **What's wrong:** `.give-bar` (`main.css:195`) adds `env(safe-area-inset-bottom)` to its own bottom padding, so its real height is ~`68px + inset`. But the space reserved to clear it, `body{--givebar-h:72px}` (`main.css:551`, consumed at `:61`), is a static 72px with no inset term. On a notched iPhone (~34px inset) the bar is ~102px while only 72px is reserved, so the bottom ~30px of the bar covers the final footer content (EIN / copyright).
- **Root cause:** The reservation and the bar's true height use different formulas; the reservation omits the `env()` term the bar adds.
- **Proposed fix (1 line):** `main.css:551` → `body{--givebar-h:calc(68px + env(safe-area-inset-bottom))}`.

---

## Medium

### QA-04 — `single.php` post footer (`.entry-terms`) and prev/next nav (`.post-nav`) sit flush-left under the centered article
- **Severity:** Medium · **Class:** Misalignment
- **Pages/breakpoints:** Single news posts, all widths > ~820px. (Theme only — the preview's article pages don't include these two blocks.)
- **What's wrong:** The article column centers itself (`.entry-header`/`.entry-hero`/`.entry-content` all `margin:… auto`). But `single.php:52` and `:68` use `class="… wrap--narrow"` standalone. `.wrap--narrow` (`main.css:88`) sets **only** `max-width:820px` — it has none of `.wrap`'s `margin-inline:auto`, and the global `*{margin:0}` reset zeroes the margin — so these two blocks render 820px wide but left-aligned, jutting left of the centered body above them.
- **Root cause:** `wrap--narrow` is a width *modifier* meant to compose with `.wrap` (as on every page template); used alone it doesn't center.
- **Proposed fix (CSS-first):** add `.entry-terms.wrap--narrow,.post-nav.wrap--narrow{margin-inline:auto}` near the blog rules (optionally `max-width:720px` to match the body column). No markup change.

### QA-05 — Intro→hero wave handoff jumps vertically on mobile
- **Severity:** Medium · **Class:** Layout-shift / animation
- **Pages/breakpoints:** Home, mobile browsers where the toolbar makes `lvh ≠ svh` (handoff moment only). Desktop is seamless.
- **What's wrong:** The intro wave and hero wave share geometry, each pinned to the bottom of its container. The intro is `.intro{position:fixed;inset:0}` (sizes to the **large** viewport) while the hero is `min-height:100svh` (**small** viewport, 92svh < 620px). On a phone with browser chrome the two wave bottoms differ by ~the toolbar height, so the wave shifts when the intro lifts. (Partly masked by the intro's simultaneous `translateY(-18px)` fade.)
- **Root cause:** Intro and hero use different viewport-height references for the same wave anchor.
- **Proposed fix (CSS):** give the intro an explicit small-viewport height to match the hero — `main.css:239` `.intro{… height:100svh}` — and reconcile the 620px hero `92svh` override (match it or drop it on home).

---

## Low

### QA-06 — Partner logos omit `width`, causing a small horizontal reflow as logos decode
- **Severity:** Low · **Class:** Layout-shift
- **Pages/breakpoints:** Home partner row, `/partner`-area pages, About (logos variant). Mostly off-screen (logos are `loading="lazy"` below the fold). The list variant is unaffected (fixed 120px grid track).
- **What's wrong:** `template-parts/partner-row.php:39` sets `height="64"` but no width, so the centered flex row re-centers as each logo's intrinsic width pops in.
- **Root cause:** No reserved horizontal box (no width/aspect-ratio) for variable-width logo bitmaps.
- **Proposed fix (CSS-first):** reserve the box — `.partner{flex:0 0 160px;max-width:160px}` and `.partner img{height:64px;width:100%;object-fit:contain}`.

---

## Preview-only (NOT a theme bug)

### QA-P1 — Partner page repeats its headline (h1 == closing band) in the preview
- **Severity:** Low (preview fidelity) · **Class:** Duplicate · **Where:** `partner-1440.png` (and all widths)
- **What's wrong:** The rendered partner page shows "Partner with us to keep talent here." twice — as the `<h1>` and again as the closing CTA band `<h2>`. **This is only in the preview generator** (`preview/gen.mjs:219` and `:221` use the same string). The actual theme is correct: `page-partner.php` h1 is "Partner with us to keep talent here." and the CTA band heading is "Invest in the founders who will keep Ventura County strong." (different).
- **Proposed fix:** update the preview generator's partner `ctaBand()` text to match the theme. No theme change needed.

---

## Verified clean / false positives (reported, not bugs)

- **Horizontal overflow:** none on any page at any width (rendered). Code-review "html missing overflow-x:clip" and "dropdown panel overflow" were verified as latent-only — no fixed element actually overflows; dropdowns are hidden ≤ 880px. Optional hardening only.
- **Duplicate sections / nav / hero / footer:** none — header/footer/hero counts were exactly 1 on every page.
- **CLS:** all pages < 0.1 (max 0.011). Code-review "post-card 4:3 vs 16:10" and "font-display:swap without metric overrides" verified as non-defects (render-blocking CSS + `aspect-ratio` win before paint; fonts are preloaded/self-hosted). Optional polish only.
- **Sticky-header anchors:** the real in-page anchor (`#notify` on Contact) lands correctly below the header. The `#main` skip-link "hidden under header" flags on every page are a **measurement artifact** — the checker measured during the `scroll-behavior:smooth` animation (longer pages = larger negative top); not a site bug.
- **Reduced motion:** reveals and the divider stroke are forced visible (`main.css:572-573`); 0 stuck in the reduced-motion variant.
- **`.post-nav`/`.entry-terms` "no flex layout":** the prev/next links use `.card__link` (inline-flex) and render fine; only the centering (QA-04) is a real issue.

---

## Proposed fix order (on approval)

1. QA-01 (Blocker, 1 line) → 2. QA-02 (High) → 3. QA-03 (High, 1 line) → 4. QA-04 (Medium) → 5. QA-05 (Medium) → 6. QA-06 (Low) → 7. QA-P1 (preview only).

All theme fixes are CSS/one-liners except QA-02 (one inline-script line in `header.php` + one CSS scope). None touch copy or structure. **QA-P1 and any copy-level call are flagged, not changed.** After each fix I'll re-run the affected page's rendered checks and confirm no regression.

---

## Pass 4 — Fixes applied

Approved "fix all." All changes are CSS / one-liners (plus one inline-script line); **no copy or page structure changed.**

| ID | File · change |
|---|---|
| QA-01 | `inc/helpers.php` — `sv_wave()` default `'divider'` → `'full'` |
| QA-02 | `header.php` — inline script now adds `document.documentElement.classList.add('js')`; `main.css` — `.reveal{…}` → `.js .reveal{…}` and the reduced-motion override → `.js .reveal{opacity:1}` |
| QA-03 | `main.css` — `body{--givebar-h:72px}` → `calc(68px + env(safe-area-inset-bottom))` |
| QA-04 | `main.css` — added `.entry-terms.wrap--narrow,.post-nav.wrap--narrow{max-width:720px;margin-inline:auto}` |
| QA-05 | `main.css` — `.intro` now `height:100svh` (was `inset:0`), with a matching `.intro{height:92svh}` at the 620px breakpoint |
| QA-06 | `main.css` — `.partner{flex:0 0 160px;max-width:160px}` + `.partner img{width:100%}` to reserve the logo box |
| QA-P1 | `preview/gen.mjs` — partner closing-band text set to the theme's actual heading ("Invest in the founders who will keep Ventura County strong.") |

### Verification
- **PHP lint** (php-parser): 42 files, 0 errors.
- **Rendered regression** (Playwright, all 14 pages × {1440, 375} after fixes): **ALL CLEAN — no overflow, CLS < 0.1, no duplicate headings/ids, consistent alignment, one header/footer each, no section overlap.** The partner duplicate heading (QA-P1) is resolved.
- **Verified by code only** (not reproducible in the static preview, which hardcodes the wave / omits `.reveal` / has no single-post footer): QA-01, QA-02, QA-04, and the mobile-specific aspects of QA-03 (notched safe-area) and QA-05 (lvh≠svh). Recommend a final confirmation on WordPress staging and one real notched phone for QA-03/QA-05.
- The evidence screenshots in `qa-screenshots/` are the **pre-fix** state (kept as the record); the post-fix regression was run check-only to preserve them.

---

# Responsive & Dropdown QA Pass (2026-06-20)

Scope: header behavior as the screen narrows, and dropdown hover smoothness. (Alignment/overflow/scroll were the prior pass; re-verified clean on the pages touched.) Method: code read + Playwright header sweep 320→1440 in 40px steps (`qa/header-sweep.mjs`, results `qa/header-sweep.json`, header shots `qa-screenshots/header-{w}.png`).

## A. Responsive header — PASS (one optional note)

The header sweep found the collapse is a **single clean switch at 880px**, with no broken in-between zone:
- **≤ 880px:** logo + hamburger; the persistent Give moves to the bottom Give bar (`.header-cta .btn--give` hidden, `.give-bar` shown). Confirmed clean at 360/414/768/880.
- **≥ 881px:** logo + the 6-item desktop nav (Program ▾, Why Ventura County, Impact, Partner ▾, About ▾, News) + Give button.
- Across **every** width 320→1440: no horizontal scroll, no nav↔logo or nav↔Give overlap, the desktop nav and hamburger are never shown at once, and the Give button / logo always keep their reserved space (`flex:0 0 auto`). Verified at the tightest just-desktop width (884px): nav→Give clearance **37px**, Give not clipped, no scroll. Clearance widens from there (53px @920, 100px @1024, ~135px capped ≥1120 by the `.wrap` max-width).

**RH-1 — Low / optional (report only, not a break).** In the narrow 881–~920px band the desktop nav clears the Give button by only ~37–53px — functional but a little tight. If you'd prefer extra breathing room you could raise the collapse breakpoint from 880 to ~940px (so the hamburger takes over slightly sooner and the desktop nav always has comfortable clearance). Not required — there is no overlap or break. *Where:* `assets/css/main.css:548` (`@media (max-width:880px)`).

## B. Dropdown hover — ND-1

### ND-1 — Submenus snap open/closed with no transition, no close delay, and no reduced-motion handling
- **Severity:** Medium · **Class:** Nav-interaction · **Pages/widths:** desktop nav (≥ 881px) on every page with a dropdown (Program, Partner, About). *Before* shot context: `qa-screenshots/header-1024.png` (closed state; the snap is motion, not visible in a still).
- **What's wrong:** Hovering Program / Partner / About makes the submenu **appear and disappear instantly** — no ease, and it vanishes the moment the cursor leaves the trigger.
- **Root cause:** `assets/css/main.css:148` sets `.sub-menu,.dropdown{… display:none …}` and `:150` flips it to `display:block` on `:hover`/`.is-open`/`:focus-within`. **`display` is not animatable, so it snaps.** There is no `transition`, no close delay (`transition-delay`/hover-intent), and no `prefers-reduced-motion` branch. (The mobile accordion at `:188` is separate and correct.)
- **Proposed fix (CSS, scoped to `.primary-nav` so the mobile accordion is untouched):**
  - Replace the desktop `display` toggle with an animatable hidden state: `.primary-nav .sub-menu{opacity:0;visibility:hidden;transform:translateY(-6px); transition:opacity .18s ease .12s, transform .18s ease .12s, visibility 0s linear .30s}`.
  - Open state (`:hover` / `.is-open` / `:focus-within`): `opacity:1;visibility:visible;transform:translateY(0); transition:opacity .18s ease, transform .18s ease, visibility 0s` — opens immediately, the `.12s` delay on the *closed* state gives a ~120ms grace period so it doesn't vanish instantly.
  - Hover bridge: `.primary-nav .sub-menu::before{content:'';position:absolute;top:-8px;left:0;right:0;height:8px}` (belt-and-suspenders — the submenu is already a DOM child of the `<li>`, so `:hover` persists across it; the bridge covers any sub-pixel gap).
  - Keep the global `.sub-menu{display:none}` base + the mobile `.mobile-menu .sub-menu` display rules as-is (mobile stays a tap accordion).
  - `prefers-reduced-motion`: add `.primary-nav .sub-menu,.primary-nav .dropdown{transform:none}` so it just fades/show-instantly.
  - `aria-haspopup`/`aria-expanded`/keyboard focus/Escape (in `main.js`) keep working — `:focus-within` is included so keyboard opens it too.
- **Note:** because the submenu becomes `visibility:hidden` instead of `display:none` when closed, its links are correctly removed from tab order until opened (same as before).

## Fixes applied (approved: ND-1 + RH-1)

| ID | File · change |
|---|---|
| ND-1 | `main.css` — added `.primary-nav`-scoped dropdown animation: closed `opacity:0;visibility:hidden;translateY(-6px)` with `transition: opacity/transform .18s ease (.12s close delay), visibility 0s linear .3s`; open flips visibility immediately + fades in; `.primary-nav .sub-menu::before` 8px hover bridge; reduced-motion → `transform:none`. Global `.sub-menu{display:none}` base + the `.mobile-menu` accordion left untouched. |
| RH-1 | `main.css` — desktop→hamburger collapse `@media (max-width:880px)` → `940px`, so the desktop nav always has comfortable clearance. |
| ND-2 | `main.css` — `.menu-toggle` was a flex **row**, so the 3 hamburger bars laid out side-by-side (shrunk to 15px) and the `margin-top` staggered them into a broken icon. Added `flex-direction:column` so the bars stack into a proper ☰. Verified: bars now share one x, stack 7px apart, full 22px wide. |

### Verification
- **Dropdown (ND-1):** computed style confirms the transition is on `opacity/transform/visibility` (0.18s, 0.12s close delay) — it eases, no longer snaps; visibility flips to visible immediately on open so the menu is reachable during the fade; hover bridge present; the open dropdown renders correctly (`qa-screenshots/header-1024.png` is closed-state context — open state confirmed live). **Mobile accordion still works** (hamburger → menu → caret expands submenu, fully visible) — ND-1's `.primary-nav` scope left it alone.
- **Breakpoint (RH-1):** re-ran the header sweep — collapse now at **940px**; below it the hamburger shows, at ≥~960px the desktop nav shows with **71px+** clearance from Give (widening to ~135px). No horizontal scroll at any width 320→1440. (The sweep's `navOverflow=true` ≥960 is a checker artifact — the now-rendered-but-invisible `position:absolute` submenus add to the `<ul>` `scrollWidth`; page `horizScroll=false` everywhere, nav/Give clearance always positive.)
- **Regression:** full check (all 14 pages × {1440, 375}) after both fixes → **ALL CLEAN** (no overflow, CLS < 0.1, no duplicate headings/ids, consistent alignment, one header/footer each, no overlap).
- Header screenshots for every sweep width are in `qa-screenshots/header-{w}.png`.
