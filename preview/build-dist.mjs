// Builds a self-contained static site into dist/ for static hosting (Netlify).
//
// The WordPress theme in startup-ventura/ is the source of truth, but Netlify
// cannot run PHP. This script packages the generated static pages (preview/site/)
// together with the theme's assets into a standalone dist/ where:
//   - the homepage is served at /
//   - every asset reference resolves locally (dist/assets/...)
//   - the impact calculator (self-contained) is carried along
//
// Netlify runs this as its build command; it is also safe to run locally.
// Run: node preview/build-dist.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEN = path.join(root, 'preview', 'gen.mjs');
const SITE = path.join(root, 'preview', 'site');
const ASSETS = path.join(root, 'startup-ventura', 'assets');
const DIST = path.join(root, 'dist');

// 0. Refresh the events schedule from Notion (fail-soft: on any problem the
//    committed preview/events-data.json snapshot is used instead).
try {
  execSync(`node ${JSON.stringify(path.join(root, 'scripts', 'fetch-events.mjs'))}`, { stdio: 'inherit', cwd: root });
} catch (err) {
  console.warn('events: fetch step crashed — continuing with the committed snapshot.');
}

// 1. Regenerate the static pages so dist/ is never stale against the theme.
execSync(`node ${JSON.stringify(GEN)}`, { stdio: 'inherit', cwd: root });

// 2. Start from a clean dist/.
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// 3. Copy the assets tree intact. CSS/JS use relative url()s (../fonts, ../img)
//    that stay valid once the whole tree lives under dist/assets/.
fs.cpSync(ASSETS, path.join(DIST, 'assets'), { recursive: true });

// 3a. Minify the CSS in dist/ only (source stays readable). Conservative and
//     dependency-free: strip comments, collapse newlines/indentation and runs
//     of spaces to one. Verified safe — no comment or 2+-space run lives inside
//     a content:"" string in this stylesheet.
{
  const cssPath = path.join(DIST, 'assets', 'css', 'main.css');
  const min = fs.readFileSync(cssPath, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
  fs.writeFileSync(cssPath, min);
}

// 4. Copy every generated file, rewriting the shared asset prefix so pages
//    reference their own local assets/ instead of ../../startup-ventura/assets.
const SHARED_PREFIX = /\.\.\/\.\.\/startup-ventura\/assets/g;
let pages = 0;
for (const name of fs.readdirSync(SITE)) {
  const src = path.join(SITE, name);
  if (!fs.statSync(src).isFile()) continue;
  if (name.endsWith('.html')) {
    const html = fs.readFileSync(src, 'utf8').replace(SHARED_PREFIX, 'assets');
    fs.writeFileSync(path.join(DIST, name), html);
    pages++;
  } else {
    fs.copyFileSync(src, path.join(DIST, name));
  }
}

// 5. Sanity check: no page may still point outside dist/.
const leaked = fs.readdirSync(DIST)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => fs.readFileSync(path.join(DIST, f), 'utf8').includes('startup-ventura/assets'));
if (leaked.length) {
  console.error('ERROR: pages still reference the shared asset path:', leaked.join(', '));
  process.exit(1);
}

console.log(`Built dist/: ${pages} HTML pages + assets/ (home at /).`);
