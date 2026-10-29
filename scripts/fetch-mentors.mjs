// Pulls the Mentor Wall from Notion into data/mentors.json (plus headshots into
// startup-ventura/assets/img/mentors/), which gen.mjs renders on /mentors and in
// the homepage strip. Fail-soft like fetch-events.mjs: no NOTION_TOKEN (local dev)
// or any API error leaves the committed snapshot in place. Only rows with BOTH
// Consent and Published checked are read; a row that loses either disappears on
// the next build. Properties are queried by name: never rename them in Notion.
//
// Source: Notion > Startup Ventura CRM > "Mentor Wall" (a separate database from
// People, which holds donor and pipeline data the build must never read).
//
// Headshots: Notion file URLs expire after an hour, so each one is downloaded at
// build time and resized to a 400 px square WebP when sharp is installed; without
// sharp the file is kept as uploaded. A row with no headshot falls back to a
// local team photo of the same slug (assets/img/team/<slug>.jpg) and otherwise
// renders initials on navy, never a broken image.
//
// Testing without Notion: node scripts/fetch-mentors.mjs --fixture rows.json
// (rows in the simplified shape below; the same Consent + Published filter applies).
import { createHash } from 'node:crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DB_ID = '45f5fa41af0d4bdeb59ca3fa5bc4a89a'; // CRM "Mentor Wall" DB (not secret)
const OUT = path.join(root, 'data', 'mentors.json');
const IMG_DIR = path.join(root, 'startup-ventura', 'assets', 'img', 'mentors');
const TEAM_DIR = path.join(root, 'startup-ventura', 'assets', 'img', 'team');
const ROLES = ['Board', 'Advisor', 'Mentor', 'Speaker'];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const text = (p) => (p?.rich_text || p?.title || []).map((t) => t.plain_text).join('').trim();
const fixtureAt = process.argv.indexOf('--fixture');
const fixture = fixtureAt > -1 ? process.argv[fixtureAt + 1] : null;

let sharp = null;
try { sharp = (await import('sharp')).default; } catch { console.log('mentors: sharp is not installed; headshots are kept as uploaded.'); }

function fromNotion(page) {
  const pr = page.properties || {};
  const file = (pr.Headshot?.files || [])[0];
  return {
    name: text(pr.Name),
    role: pr.Role?.select?.name || '',
    credential: text(pr.Credential),
    affiliation: pr.Affiliation?.select?.name || '',
    link: pr.Link?.url || '',
    order: typeof pr.Order?.number === 'number' ? pr.Order.number : null,
    cohort: (pr.Cohort?.multi_select || []).map((o) => o.name),
    consent: !!pr.Consent?.checkbox,
    published: !!pr.Published?.checkbox,
    headshotUrl: file ? (file.file?.url || file.external?.url || '') : '',
  };
}

async function loadRows() {
  if (fixture) return JSON.parse(fs.readFileSync(fixture, 'utf8'));
  const token = process.env.NOTION_TOKEN;
  if (!token) { console.log('mentors: NOTION_TOKEN not set — using the committed snapshot.'); return null; }
  const rows = [];
  let cursor;
  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filter: { and: [{ property: 'Consent', checkbox: { equals: true } }, { property: 'Published', checkbox: { equals: true } }] },
        sorts: [{ property: 'Order', direction: 'ascending' }, { property: 'Name', direction: 'ascending' }],
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      }),
    });
    if (!res.ok) throw new Error(`Notion API ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    rows.push(...(data.results || []).map(fromNotion));
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return rows;
}

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
async function headshot(row, slug) {
  let buf = null, ext = 'jpg';
  if (row.headshotUrl) {
    const res = await fetch(row.headshotUrl);
    if (!res.ok) throw new Error(`download ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
    ext = EXT[(res.headers.get('content-type') || '').split(';')[0]] || 'jpg';
  } else if (fs.existsSync(path.join(TEAM_DIR, `${slug}.jpg`))) {
    if (!sharp) return `team/${slug}.jpg`;
    buf = fs.readFileSync(path.join(TEAM_DIR, `${slug}.jpg`));
  } else {
    return null;
  }
  // The file name carries a short content hash: /assets/* is served with a one-year
  // immutable cache, so a replaced headshot must get a new URL to show up.
  fs.mkdirSync(IMG_DIR, { recursive: true });
  if (sharp) { buf = await sharp(buf).rotate().resize(400, 400, { fit: 'cover', position: 'top' }).webp({ quality: 82 }).toBuffer(); ext = 'webp'; }
  const name = `${slug}-${createHash('sha1').update(buf).digest('hex').slice(0, 8)}.${ext}`;
  fs.writeFileSync(path.join(IMG_DIR, name), buf);
  return `mentors/${name}`;
}

try {
  const rows = await loadRows();
  if (!rows) process.exit(0);
  const keep = rows.filter((r) => r.name && r.consent && r.published && ROLES.includes(r.role));
  const out = [];
  for (const r of keep) {
    const slug = slugify(r.name);
    let img = null;
    try { img = await headshot(r, slug); } catch (err) { console.warn(`mentors: headshot for ${r.name} failed (${err.message}); initials will render.`); }
    out.push({ name: r.name, slug, role: r.role, credential: (r.credential || '').slice(0, 90), affiliation: r.affiliation || '', link: r.link || '', order: r.order ?? null, cohort: r.cohort || [], img });
  }
  // Drop headshots of people no longer on the wall so a withdrawn consent also
  // removes the file from the deploy.
  if (fs.existsSync(IMG_DIR)) for (const f of fs.readdirSync(IMG_DIR)) if (!out.some((m) => m.img === `mentors/${f}`)) fs.unlinkSync(path.join(IMG_DIR, f));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`mentors: ${out.length} published row(s) written to data/mentors.json${fixture ? ' (fixture)' : ''}.`);
} catch (err) {
  console.warn(`mentors: fetch failed (${err.message}) — using the committed snapshot.`);
  process.exit(0);
}
