# Copy Change Log

A record of live copy changes so they can be reverted. Each entry lists the exact
original text and the new text, in both the PHP source of truth and the static
mirror (`preview/gen.mjs`). To revert, paste the "Before" text back into both files
and rebuild (`node preview/gen.mjs && node preview/build-dist.mjs`).

Rationale for these edits: shift the public, founder-facing copy from loss framing
to possibility/gain. See `COPY-REVISIONS-PROPOSAL.md` for the full analysis.

---

## 2026-06-29 — Loss-to-gain copy pass (2 changes)

### Change 1 — Homepage hero headline

- **Files:** `startup-ventura/template-parts/hero.php` (line 16, default `$h1`) and `preview/gen.mjs` (home hero `<h1>`).
- **Before:**
  ```
  Great founders grow up here. Let&rsquo;s give them a <span class="coral">reason to stay.</span>
  ```
- **After:**
  ```
  Great founders grow up <span class="coral">here.</span>
  ```
- **Note:** sub copy unchanged ("Startup Ventura backs local founders with the mentorship, capital connections, and community to build high-growth companies right here in Ventura County."). The coral accent moved from "reason to stay." to "here."

### Change 2 — Partner page headline (keep -> grow)

- **Files:** `startup-ventura/page-partner.php` (line 21, `<h1>`) and `preview/gen.mjs` (`pageHead('Partner', ...)`).
- **Before:**
  ```
  Partner with us to keep talent here.
  ```
- **After:**
  ```
  Partner with us to grow talent here.
  ```
- **Not changed (companion, still loss-framed):** the sub line directly beneath, `page-partner.php:22` / `gen.mjs` partner `pageHead` 3rd arg, still reads "...all have a stake in **keeping** Ventura County's founders building here." Left as-is because only the two flagged rewrites were approved; flagged here so it can be updated next.

---

## Not yet changed (catalogued in COPY-REVISIONS-PROPOSAL.md)

The proposal lists the remaining loss-framed copy (homepage closing CTA "reason to
stay," the shared CTA reused on 4 pages, About/Impact/Luke "keep" lines, stakeholder
pages, news/SEO meta) plus the meaning-matters items (the formal mission statement,
the Why Ventura County case page, the Rob Russel testimonial quote, the stats). None
of those were edited in this pass.
