# Startup Ventura

Website for **Startup Ventura**, a 501(c)(3) nonprofit startup accelerator in Ventura County, California.

This repository holds two things:

- **`startup-ventura/`** is the source of truth: a hand-coded WordPress classic theme (PHP). Deploy this to a WordPress host.
- **`preview/`** holds a generator (`gen.mjs`) that produces a static mirror of the site, plus `build-dist.mjs` which packages a self-contained static build into `dist/` for static hosting.

## Static deployment (Netlify)

Netlify cannot run WordPress/PHP, so the live Netlify site is the **static build**.

- Build command: `node preview/build-dist.mjs`
- Publish directory: `dist`

Both are pre-configured in `netlify.toml`. On every push, Netlify regenerates the static pages, copies the theme's assets alongside them, and serves the result with the homepage at `/`.

What works on the static build: navigation, all content, the Give button (Zeffy modal), and the impact calculator. The contact, "notify me," and newsletter forms POST to WordPress, so they are inert on the static build.

## Local development

```bash
# Regenerate the static preview into preview/site/
node preview/gen.mjs

# Build the deployable static site into dist/
node preview/build-dist.mjs
```

Serve the repo root and open `/dist/index.html` for the deployable build, or `/preview/site/index.html` for the dev mirror.

## WordPress theme

The deployable theme is the inner `startup-ventura/` folder: zip it and upload via Appearance > Themes, or deploy to a WordPress host. Client-editable settings (cohort dates, emails, Zeffy URLs, analytics ID) live in the CONFIG block at the top of `startup-ventura/functions.php`.
