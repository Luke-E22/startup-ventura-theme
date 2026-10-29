// Netlify event function: runs on EVERY form submission (the file name
// `submission-created` is the trigger). Pushes the submission into the
// Startup Ventura CRM in Notion as:
//   1. a Person (deduped by email; existing people get enriched, not duplicated)
//   2. an Interaction logged against that person ("Logged By: AI Intake")
//
// Requires NOTION_TOKEN in the Netlify environment (same internal integration
// fetch-events.mjs uses). The integration must have access to the CRM parent
// page (People + Interactions inherit it) and the Insert/Update content
// capabilities. Fails loud in the function log; never throws back at Netlify,
// so a Notion outage can never break form submission itself.
import { mapSubmission, FORMS } from './lib/map-submission.mjs';

const NOTION = 'https://api.notion.com/v1';
const PEOPLE_DB = '8894e86a-9cf0-4638-9d67-459d74d3b397';       // CRM > People
const INTERACTIONS_DB = 'da19c694-737b-4953-8bb4-16a1a17f69c6'; // CRM > Interactions

const headers = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
});

async function notion(token, path, method, body) {
  const res = await fetch(`${NOTION}${path}`, { method, headers: headers(token), body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Notion ${method} ${path} -> ${res.status}: ${json.message || JSON.stringify(json).slice(0, 300)}`);
  return json;
}

const text = (s) => [{ type: 'text', text: { content: String(s).slice(0, 2000) } }];

async function findPersonByEmail(token, email) {
  if (!email) return null;
  const q = await notion(token, `/databases/${PEOPLE_DB}/query`, 'POST', {
    filter: { property: 'Email', email: { equals: email } },
    page_size: 1,
  });
  return q.results?.[0] || null;
}

function personProperties(m, existing) {
  const props = {};
  if (!existing) {
    props['Name'] = { title: text(m.name) };
    props['Email'] = { email: m.email || null };
    props['How We Met'] = { rich_text: text(`Website form: ${m.formLabel}`) };
    props['Stage'] = { select: { name: 'Warm' } };
    if (m.relationship.length) props['Relationship Type'] = { multi_select: m.relationship.map((name) => ({ name })) };
  } else {
    // Merge multi-selects so an existing donor who later volunteers keeps both.
    const have = (p) => (existing.properties?.[p]?.multi_select || []).map((o) => o.name);
    const rel = [...new Set([...have('Relationship Type'), ...m.relationship])];
    if (rel.length) props['Relationship Type'] = { multi_select: rel.map((name) => ({ name })) };
    m.interest = [...new Set([...have('Interest'), ...m.interest])];
    if (!existing.properties?.['How We Met']?.rich_text?.length) props['How We Met'] = { rich_text: text(`Website form: ${m.formLabel}`) };
  }
  if (m.interest.length) props['Interest'] = { multi_select: m.interest.map((name) => ({ name })) };
  if (m.phone) props['Phone'] = { phone_number: m.phone };
  if (m.company && !(existing?.properties?.Company?.rich_text?.length)) props['Company'] = { rich_text: text(m.company) };
  props['Last Touch Date'] = { date: { start: m.date } };
  return props;
}

function interactionProperties(m, personId) {
  const props = {
    'Summary': { title: text(m.summary) },
    'Type': { select: { name: 'Other' } },
    'Date': { date: { start: m.date } },
    'Channel': { rich_text: text(`startupventura.com form: ${m.form}`) },
    'Logged By': { select: { name: 'AI Intake' } },
    'Notes': { rich_text: text(m.notes) },
    'Person': { relation: [{ id: personId }] },
  };
  if (m.topics.length) props['Topics'] = { multi_select: m.topics.map((name) => ({ name })) };
  return props;
}

// Optional direct Klaviyo route for the newsletter (no Zapier, no on-page Klaviyo
// script): set KLAVIYO_PRIVATE_KEY and KLAVIYO_LIST_ID in the Netlify environment
// and every "newsletter" submission is subscribed to that list with the "I am a"
// answer stored as the profile property "interest". Without the two variables
// this step is skipped and a Zapier zap (Netlify form submission -> Klaviyo
// "Add subscriber to list") can carry the same data instead.
// The subscribe endpoint accepts only email and consent, so the interest property
// is written first with a profile upsert (Klaviyo's create-then-subscribe flow);
// if that upsert fails the subscription still goes through. Klaviyo retires an API
// revision two years after release: move KLAVIYO_REVISION forward before 2028-10.
// Functions read environment variables at deploy time, so redeploy after setting them.
const KLAVIYO_REVISION = '2026-10-15';
async function klaviyoSubscribe(m) {
  const key = process.env.KLAVIYO_PRIVATE_KEY;
  const list = process.env.KLAVIYO_LIST_ID;
  if (!key || !list || m.form !== 'newsletter' || !m.email) return 'skipped';
  const headers = { Authorization: `Klaviyo-API-Key ${key}`, revision: KLAVIYO_REVISION, 'Content-Type': 'application/vnd.api+json', Accept: 'application/vnd.api+json' };
  if (m.detail) {
    const up = await fetch('https://a.klaviyo.com/api/profile-import', {
      method: 'POST', headers,
      body: JSON.stringify({ data: { type: 'profile', attributes: { email: m.email, properties: { interest: m.detail } } } }),
    });
    if (up.status !== 200 && up.status !== 201) console.error(`submission-created: Klaviyo profile upsert ${up.status} for ${m.email}; subscribing without the interest property: ${(await up.text()).slice(0, 200)}`);
  }
  const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs', {
    method: 'POST', headers,
    body: JSON.stringify({ data: { type: 'profile-subscription-bulk-create-job', attributes: {
      custom_source: 'Website: newsletter',
      profiles: { data: [{ type: 'profile', attributes: { email: m.email, subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } } } }] },
    }, relationships: { list: { data: { type: 'list', id: list } } } } }),
  });
  if (res.status !== 202) throw new Error(`Klaviyo ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return 'subscribed';
}

export const handler = async (event) => {
  const token = process.env.NOTION_TOKEN;
  let payload;
  try { payload = JSON.parse(event.body).payload; } catch (e) {
    console.error('submission-created: unreadable event body');
    return { statusCode: 200, body: 'ignored' };
  }
  const m = mapSubmission(payload);
  if (!m) { console.log(`submission-created: no mapping for form "${payload?.form_name}" (ignored)`); return { statusCode: 200, body: 'ignored' }; }
  // Klaviyo runs on its own so a problem on one side never blocks the other.
  const klaviyo = klaviyoSubscribe(m)
    .then((r) => { if (r === 'subscribed') console.log(`submission-created: Klaviyo subscribed ${m.email} (${m.detail || 'no interest'})`); return r; })
    .catch((err) => { console.error(`submission-created: Klaviyo FAILED for ${m.email}: ${err.message}`); return 'klaviyo failed'; });
  if (!token) { console.error('submission-created: NOTION_TOKEN missing; submission NOT synced:', m.summary); await klaviyo; return { statusCode: 200, body: 'no token' }; }
  try {
    const existing = await findPersonByEmail(token, m.email);
    let personId;
    if (existing) {
      personId = existing.id;
      await notion(token, `/pages/${personId}`, 'PATCH', { properties: personProperties(m, existing) });
    } else {
      const created = await notion(token, '/pages', 'POST', { parent: { database_id: PEOPLE_DB }, properties: personProperties(m, null) });
      personId = created.id;
    }
    await notion(token, '/pages', 'POST', { parent: { database_id: INTERACTIONS_DB }, properties: interactionProperties(m, personId) });
    console.log(`submission-created: synced "${m.summary}" -> person ${personId} (${existing ? 'existing' : 'new'})`);
    await klaviyo;
    return { statusCode: 200, body: 'synced' };
  } catch (err) {
    // Netlify keeps the submission regardless; this log is the recovery trail.
    console.error(`submission-created: FAILED for "${m.summary}" (${m.email}): ${err.message}`);
    await klaviyo;
    return { statusCode: 200, body: 'sync failed' };
  }
};

export { FORMS };
