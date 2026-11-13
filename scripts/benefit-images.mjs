// One-off helper for the Annual Benefit artwork (2026-11). Rebuilds the responsive
// WebP set, the JPEG fallback and the square share image from the two source files:
//   node scripts/benefit-images.mjs <rooftop.jpg> [square.png]
// Output lands in startup-ventura/assets/img/event/ and assets/img/og/.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVENT = path.join(root, 'startup-ventura', 'assets', 'img', 'event');
const OG = path.join(root, 'startup-ventura', 'assets', 'img', 'og');
const [rooftop, square] = process.argv.slice(2);
if (!rooftop) { console.error('usage: node scripts/benefit-images.mjs <rooftop.jpg> [square.png]'); process.exit(1); }

const src = path.join(EVENT, 'benefit-rooftop.jpg');
if (path.resolve(rooftop) !== src) fs.copyFileSync(rooftop, src);
for (const w of [640, 960, 1600, 2400]) {
  await sharp(src).resize({ width: w }).webp({ quality: w >= 1600 ? 72 : 76 }).toFile(path.join(EVENT, `benefit-rooftop-${w}.webp`));
}
await sharp(src).resize({ width: 1600 }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(EVENT, 'benefit-rooftop-1600.jpg'));
if (square) {
  await sharp(square).resize({ width: 1200, height: 1200 }).png({ palette: true, quality: 85, effort: 8 }).toFile(path.join(OG, 'benefit-square.png'));
}
for (const f of fs.readdirSync(EVENT).filter((x) => x.startsWith('benefit-rooftop'))) console.log(f, fs.statSync(path.join(EVENT, f)).size);
if (square) console.log('og/benefit-square.png', fs.statSync(path.join(OG, 'benefit-square.png')).size);
