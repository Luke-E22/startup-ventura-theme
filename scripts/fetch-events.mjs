// Pulls the events schedule from the Notion "Website Events" database into
// preview/events-data.json, which gen.mjs renders on /events.
//
// Design: fail-soft. This script NEVER breaks the build — if NOTION_TOKEN is
// missing (local dev) or Notion errors, it logs and leaves the committed
// snapshot in place, so the site simply serves the last known schedule.
//
// Source of truth: Notion > Startup Ventura CRM > "Website Events".
// Published rows: Status = Scheduled, sorted by Date. Rebuilds nightly via the
// GitHub Action (.github/workflows/nightly-rebuild.yml -> Netlify build hook).
//
// Requires (Netlify env): NOTION_TOKEN — internal integration secret with
// read access, connected to the Website Events database in Notion.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DB_ID = 'f22d74a84b6f472086ee692bea414265'; // Website Events (not secret)
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'preview', 'events-data.json');

const token = process.env.NOTION_TOKEN;
if (!token) {
  console.log('events: NOTION_TOKEN not set — using the committed snapshot.');
  process.exit(0);
}

try {
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: { property: 'Status', select: { equals: 'Scheduled' } },
      sorts: [{ property: 'Date', direction: 'ascending' }],
      page_size: 100,
    }),
  });
  if (!res.ok) throw new Error(`Notion API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();

  const events = (data.results || []).map((p) => ({
    date: p.properties?.Date?.date?.start || '',
    tag: p.properties?.Category?.select?.name || '',
    title: (p.properties?.Name?.title || []).map((t) => t.plain_text).join('').trim(),
  })).filter((e) => e.title && /^\d{4}-\d{2}-\d{2}/.test(e.date));

  if (!events.length) throw new Error('query returned zero valid Scheduled events — keeping snapshot');

  fs.writeFileSync(OUT, JSON.stringify(events, null, 2) + '\n');
  console.log(`events: fetched ${events.length} from Notion.`);
} catch (err) {
  console.warn(`events: Notion fetch failed (${err.message}) — using the committed snapshot.`);
  process.exit(0);
}
