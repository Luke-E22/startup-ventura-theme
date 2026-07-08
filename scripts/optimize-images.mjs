// One-time image optimizer for the Startup Ventura static site.
// Outputs are committed into the assets tree so the Netlify build stays
// dependency-free (no sharp at deploy time). Re-run after adding/replacing a
// source photo:  node optimize.mjs
// Requires sharp (not a build dep — run locally):  cd scripts && npm i sharp && node optimize-images.mjs
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const IMG = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'startup-ventura', 'assets', 'img');
const kb = (p) => Math.round(fs.statSync(p).size / 1024);
const log = [];

// --- Team photos: two WebP widths (360 for board cards, 760 for news heroes)
//     + a recompressed 760 JPEG fallback. Framing is done in CSS (object-fit +
//     object-position/zoom), so we preserve aspect ratio and never crop here.
const team = fs.readdirSync(path.join(IMG, 'team')).filter((f) => f.endsWith('.jpg') && !/-\d+\./.test(f));
for (const f of team) {
  const base = path.join(IMG, 'team', f.replace('.jpg', ''));
  const src = path.join(IMG, 'team', f);
  const before = kb(src);
  await sharp(src).resize({ width: 360, withoutEnlargement: true }).webp({ quality: 80 }).toFile(base + '-360.webp');
  await sharp(src).resize({ width: 760, withoutEnlargement: true }).webp({ quality: 80 }).toFile(base + '-760.webp');
  await sharp(src).resize({ width: 760, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(base + '-760.jpg');
  log.push(`team/${f}: ${before}KB jpg -> ${kb(base + '-360.webp')}KB(360w) / ${kb(base + '-760.webp')}KB(760w) webp, ${kb(base + '-760.jpg')}KB jpg fallback`);
}

// --- Other content photos used as news thumbnails / entry heroes: same
//     -360/-760 webp + -760 jpg convention so pic() can serve them uniformly.
const content = ['news/candid-platinum-seal.jpg', 'news/board-gonzalez-kraus.jpg', 'event/annual-benefit-venue.jpg', 'ventura-pier.jpg'];
for (const rel of content) {
  const src = path.join(IMG, rel);
  if (!fs.existsSync(src)) { log.push(`SKIP ${rel} (missing)`); continue; }
  const base = path.join(IMG, rel.replace('.jpg', ''));
  const before = kb(src);
  await sharp(src).resize({ width: 360, withoutEnlargement: true }).webp({ quality: 80 }).toFile(base + '-360.webp');
  await sharp(src).resize({ width: 760, withoutEnlargement: true }).webp({ quality: 80 }).toFile(base + '-760.webp');
  await sharp(src).resize({ width: 760, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(base + '-760.jpg');
  log.push(`${rel}: ${before}KB -> ${kb(base + '-360.webp')}/${kb(base + '-760.webp')}KB webp, ${kb(base + '-760.jpg')}KB jpg`);
}

// --- Hero: full-bleed. WebP at 960 + 1600, recompressed 1600 JPEG fallback.
{
  const src = path.join(IMG, 'hero.jpg');
  const before = kb(src);
  await sharp(src).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(IMG, 'hero-960.webp'));
  await sharp(src).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(IMG, 'hero-1600.webp'));
  await sharp(src).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(path.join(IMG, 'hero-1600.jpg'));
  log.push(`hero.jpg: ${before}KB -> ${kb(path.join(IMG, 'hero-960.webp'))}KB(960w) / ${kb(path.join(IMG, 'hero-1600.webp'))}KB(1600w) webp, ${kb(path.join(IMG, 'hero-1600.jpg'))}KB jpg`);
}

// --- Partner logos: downscale in place to ~2x display (rendered at height 64,
//     so ~150px tall is 2x). Keep PNG for transparency.
for (const f of fs.readdirSync(path.join(IMG, 'partners')).filter((f) => f.endsWith('.png'))) {
  const src = path.join(IMG, 'partners', f);
  const before = kb(src);
  const buf = await sharp(src).resize({ height: 150, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toBuffer();
  fs.writeFileSync(src, buf);
  log.push(`partners/${f}: ${before}KB -> ${kb(src)}KB (downscaled, still png)`);
}

// --- Favicons from the 512x512 source: 32 (tab), 180 (apple-touch), 192/512 (PWA).
{
  const src = path.join(IMG, 'favicon.png');
  for (const s of [32, 180, 192, 512]) {
    await sharp(src).resize(s, s).png({ compressionLevel: 9 }).toFile(path.join(IMG, `favicon-${s}.png`));
  }
  log.push(`favicon: 32/180/192/512 generated (${[32, 180, 192, 512].map((s) => kb(path.join(IMG, `favicon-${s}.png`)) + 'KB').join(', ')})`);
}

console.log(log.join('\n'));
