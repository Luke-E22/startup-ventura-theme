# Startup Ventura - Copy Revision Proposal (draft for review)

**Status: proposal only. Nothing in the site has been changed.** This document is the single new file created for this task; no components, templates, content, or seed data were edited.

**The lens applied to every line:** what is this for, and who is going to see it? The public site is the front door for a prospective founder (picture a 25 year old with an idea). Lead with possibility and the strength of the program. Reframe loss to gain: we are building something founders get to join, not plugging a leak. Problem and scarcity framing ("reason to stay," "keep," "brain drain," "lack of") is pitch deck language for funders and stakeholders, and it quietly signals the ecosystem is deficient to the exact person we want to recruit.

**Where the copy lives (so review and later edits are accurate).** This site stores copy in two places that must stay in sync:
- **Source of truth:** the PHP theme - page templates (`startup-ventura/*.php`), shared parts (`startup-ventura/template-parts/*.php`), and accessors/seed (`startup-ventura/inc/helpers.php`, `inc/seed.php`).
- **Static mirror:** `preview/gen.mjs` duplicates the same strings for the Netlify build. Every change below exists in **both** places, so implementation should update both. Line numbers for the mirror are noted as `gen.mjs:NN`.
- There is no separate CMS for this marketing copy (the WordPress hero/sections are hardcoded defaults, and News posts are seeded from `inc/seed.php`).

No em dashes are used in any drafted copy below.

---

## 1. Homepage hero headline (recommended rewrite)

**Current copy** - `startup-ventura/template-parts/hero.php:16` (rendered via `front-page.php`; mirror `preview/gen.mjs:190`):

> **Headline:** Great founders grow up here. Let's give them a *reason to stay.*
> _("reason to stay" is set in the coral accent span.)_

> **Sub copy (PRESERVED, do not change)** - `hero.php:17`:
> Startup Ventura backs local founders with the mentorship, capital connections, and community to build high-growth companies right here in Ventura County.

**Recommended headline:**

> ## Great founders grow up here.

**What changes:** keep the strong first sentence exactly, delete the second sentence ("Let's give them a reason to stay."). The coral accent can move onto the final word ("Great founders grow up **here.**") to preserve the visual treatment, or drop the accent. Sub copy stays as is.

**Rationale (one sentence):** "Let's give them a reason to stay" is the only loss-framed line in the hero and it tells a first-time founder the ecosystem might not be enough to keep people, so removing it leaves a confident, possibility-forward brag the sub copy already backs with the program's value.

_Optional, if you want a more active second beat instead of a single line (not recommended over the clean version, offered only as a workshop alternative): "Great founders grow up here. Build yours with us." Both avoid the loss frame; the single sentence is the most surgical and on-brand._

---

## 2. Loss-framed "keep" on a secondary page (recommended rewrite)

Of the loss-framed "keep" uses, the clearest "stop something from leaving" instance on a secondary page is the Partner page headline. It is also exactly the keep -> grow swap described in the feedback.

**Current copy** - `startup-ventura/page-partner.php:21` (mirror `preview/gen.mjs:258`):

> # Partner with us to keep talent here.

**Recommended rewrite:**

> # Partner with us to grow talent here.

**Rationale (one sentence):** swapping "keep" to "grow" flips the frame from preventing talent from leaving to actively developing it, which reads as gaining something rather than defending against a loss, exactly the subconscious shift the feedback is after.

**Companion note (same page, same pattern):** the sub line directly beneath it, `page-partner.php:22` (`gen.mjs:258`), continues the frame: "Cities, county offices, foundations, and companies all have a stake in **keeping** Ventura County's founders **building here**." If you take the headline change, this sub line should move with it (for example "in **growing** what founders build here"). It is listed again in the scan below so you can decide together.

---

## 3. Other candidates (list only, not rewritten)

Grouped by priority so you can triage. Each: file path, exact phrase, one-line reframe direction. Mirror line in `gen.mjs` noted where it exists.

### A. Homepage, public front door (highest priority - same audience as the hero)

| File | Exact phrase | Reframe direction |
|---|---|---|
| `front-page.php:115` (`gen.mjs:196`) | "Give Ventura County's founders a **reason to stay**." (closing CTA) | The homepage repeats the exact hero loss frame in its closing CTA. Move to a build/join frame, e.g. fund what founders build here. |
| `front-page.php:101` (`gen.mjs:195`) | section title: "Great talent grows up here. **Too much of it leaves.**" | Drop the "leaves" beat; lead with the talent and the opportunity, not the leak. |
| `front-page.php:102` (`gen.mjs:195`) | "The county raises and educates talent, then watches affordability and **a lack of opportunity push it out. Brain drain** and the cost of living are the same problem..." | This is the most pitch-deck block on the public home. Reframe to what gets built here, or move the case to the stakeholder page. |
| `front-page.php:30` (`gen.mjs` program teaser) | "...built for Ventura County founders **who would rather build here than leave.**" | Cut "than leave"; "built for Ventura County founders" is enough. |

### B. Shared closing-CTA line (one fix, many pages - high leverage)

The string "Give Ventura County's founders a reason to stay." is reused as the closing CTA on multiple pages. Reframing it once updates all of them.

| File | Exact phrase |
|---|---|
| `front-page.php:115`, `page-impact.php:55`, `page-contact.php:106`, `page-why-ventura.php:90` (mirror `gen.mjs:196, 243, 305, 234`) | "Give Ventura County's founders a **reason to stay**." |

Reframe direction: a possibility/build CTA, e.g. invite support for what founders are building, not for stopping them leaving.

### C. Founder-facing secondary pages with loss "keep" (medium-high)

| File | Exact phrase | Reframe direction |
|---|---|---|
| `page-about.php:21` (`gen.mjs:285`) | H1: "Built to **keep** Ventura County the best place to live." | "keep ... best place" reads as preserve/defend; consider a build/grow frame. See section 4 (ties to the formal mission). |
| `page-about.php:67` (`gen.mjs:288`) | CTA: "Help us **keep** Ventura County the best place to live." | Same as above. |
| `page-impact.php:48` (`gen.mjs:242`) | "...that is how we **keep our best people here**." | "keep our best people here" is stop-leaving framing; reframe to growing companies and opportunity here. |
| `page-lukeerickson.php:55` (`gen.mjs:474`) | "...to **keep the region's ambitious, talented people building here rather than leaving** for San Francisco or Los Angeles." | Bio copy; reframe to building here, drop the "rather than leaving" contrast. |
| `page-lukeerickson.php:71` (`gen.mjs:501`) | CTA: "Help **keep** Ventura County's founders **building here**." | Reframe to helping founders build / grow here. |

### D. Stakeholder pages (lower priority - pitch-deck audience, loss framing is more defensible here)

These pages target cities, county, foundations, and companies. The feedback explicitly says that loss framing is what the pitch deck is for, so these are optional and only worth changing if you want consistency.

| File | Exact phrase | Reframe direction |
|---|---|---|
| `page-partner.php:48` (`gen.mjs:260`) | CTA: "Invest in the founders who will **keep** Ventura County strong." | "grow" / "build" Ventura County. |
| `page-partner-government.php:24` | H1: "**Keep the talent, and the tax base, in** Ventura County." | Optional; stakeholder audience. Could lead with growth of the local economy. |
| `page-partner-government.php:30` | "Every **founder who leaves** takes a future employer, a payroll, and a tax base with them. **Keeping** them here is the highest-leverage..." | Optional; this is the economic-development case. |
| `page-partner-government.php:73` | "...bring a plan to **keep** your talent and tax base local." | Optional; "grow your talent and tax base locally." |
| `page-partner-foundations.php:34` | "Ventura County **raises and educates talent, then loses it** to affordability and **a lack of opportunity**. High-growth companies are the fix..." | Optional; stakeholder case. |
| `inc/schema.php:35-36` | SEO meta: "**Keep** founders, jobs, and the tax base local." | Shows in search results; reframe if you reframe the page. |

### E. News, bios, and SEO meta (low priority - archival or behind the scenes)

| File | Exact phrase | Reframe direction |
|---|---|---|
| `inc/seed.php:238` (`gen.mjs:391`) | 501(c)(3) news post: "...exists to **keep** Ventura County the best place in the world to live by helping local founders build high-growth companies here, **instead of leaving** to build them somewhere else." | Dated news; low urgency. Reframe to building here if touched. |
| `inc/seed.php:192 / lukeExcerpt` (`gen.mjs:316, 419`) | ED announcement excerpt: "...the accelerator he built to **keep local talent home**." | Reframe to growing local founders/companies. |
| `page-press.php:28` (`gen.mjs:519`) | "...to build high-growth companies, and to **keep that talent and those jobs** in Ventura County." | Press boilerplate; reframe to building/growing here. |
| `inc/schema.php:41` | About SEO meta: "...nonprofit **keeping** Ventura County the best place to build..." | Reframe to "building" / "growing" if you reframe About. |

---

## 4. Where removing problem-framing would lose meaning that matters (your call before cutting)

Flagging these so you decide rather than reflexively reframing:

1. **The formal mission statement** - `inc/helpers.php:219` (rendered on the home mission strip and About; mirror `gen.mjs:191, 286`): "To **keep** Ventura County the best place in the world to live by fueling entrepreneurship, building high-growth companies, and transforming our region into a recognized hub of innovation that creates lasting economic success." This is the organization's stated mission, not just web copy. "keep ... the best place to live" can read as preserve, but rewording the mission is a board/brand decision. Recommend deciding the official mission wording first, then letting the site follow it.

2. **The entire "Why Ventura County" page** - `page-why-ventura.php` (lede :25, stakes :38 and :50, "The Opportunity" :74; mirror `gen.mjs:228-233`). This page **is** the case: the affordability and brain-drain argument with supporting stats. It is the pitch-deck content living on the public site. Removing the problem framing would gut the page. Decision to make: keep it as the stakeholder-facing case (and make sure a prospective founder is not funneled here first), soften it toward opportunity, or de-emphasize it in the founder journey. Do not blanket-reframe it line by line without settling its role.

3. **The Rob Russel testimonial** - `inc/helpers.php:371` (rendered on Why Ventura County; mirror `gen.mjs:233`): the quote contains "brain drain," "have to leave," and "we stop losing our best people." This is a real attributed quote and should not be reworded. If the loss language is a problem in context, the move is to choose a different pull quote or a different excerpt of his words, not to edit the quote.

4. **The "Stakes" statistics** on Why Ventura County (cost of living vs the US, 1 in 7 households, population decline since 2017). These are factual substance, not framing. Copy around them can shift toward opportunity, but the numbers themselves are the argument and are fine to keep if the page keeps its role.

---

## Suggested sequence (if you approve)

1. Hero headline (section 1) and the homepage closing CTA (3A / 3B) - highest visibility, same front-door audience.
2. The Partner H1 keep -> grow (section 2) plus its companion sub line.
3. The founder-facing "keep" set (3C).
4. Decide the role of Why Ventura County and the mission wording (section 4) before touching 3D, 3E, and the stakeholder pages.

Every approved change should be made in both the PHP source and `preview/gen.mjs`.
