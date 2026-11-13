// Home hero, Mentors tab: prepares the photo that HERO_MENTOR_TAB in preview/gen.mjs needs.
//   node scripts/hero-mentor-images.mjs <photo>   saves the photo as hero-mentor.jpg, then builds the WebP sizes
//   node scripts/hero-mentor-images.mjs           rebuilds the WebP sizes from the hero-mentor.jpg already there
// Output lands in startup-ventura/assets/img/: hero-mentor.jpg (the source, turned
// upright, camera data removed, at most 2400 px wide), hero-mentor-960.webp and
// hero-mentor-1600.webp (what the hero loads, the same two sizes as the Founders photo).
// A wide landscape photo works best: the hero crops it to fill the screen.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(root, 'startup-ventura', 'assets', 'img');
const src = path.join(IMG, 'hero-mentor.jpg');
const [photo] = process.argv.slice(2);

if (photo) {
  if (!fs.existsSync(photo)) { console.error(`No file at ${photo}`); process.exit(1); }
  // Read fully first, so the source may be hero-mentor.jpg itself.
  const upright = await sharp(fs.readFileSync(photo)).rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  fs.writeFileSync(src, upright);
} else if (!fs.existsSync(src)) {
  console.error('usage: node scripts/hero-mentor-images.mjs <photo>\n(no startup-ventura/assets/img/hero-mentor.jpg yet, so the photo is required)');
  process.exit(1);
}
for (const w of [960, 1600]) {
  await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: w >= 1600 ? 72 : 76 }).toFile(path.join(IMG, `hero-mentor-${w}.webp`));
}
for (const f of ['hero-mentor.jpg', 'hero-mentor-960.webp', 'hero-mentor-1600.webp']) console.log(f, fs.statSync(path.join(IMG, f)).size);
const { width } = await sharp(src).metadata();
if (width < 1600) console.log(`Note: the photo is only ${width} px wide. 1600 px or wider looks best on large screens.`);
console.log('Next: set HERO_MENTOR_TAB to true in preview/gen.mjs and commit the three files.');
