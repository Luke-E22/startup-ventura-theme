// Bot checks on the form front door (netlify/functions/submit.mjs) and the CRM sync
// gate (submission-created.mjs). Run with: npm test
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { handler as submit } from '../netlify/functions/submit.mjs';
import { signSubmission } from '../netlify/functions/lib/turnstile.mjs';

const realFetch = globalThis.fetch;
const calls = [];
const fakeFetch = (replies) => async (url, opts = {}) => {
  calls.push({ url: String(url), body: String(opts.body || '') });
  const reply = replies[String(url)] || { status: 200, json: {} };
  return { ok: reply.status < 400, status: reply.status, json: async () => reply.json, text: async () => JSON.stringify(reply.json) };
};
const post = (fields) => ({ httpMethod: 'POST', headers: { 'x-nf-client-connection-ip': '203.0.113.9' }, body: new URLSearchParams(fields).toString() });
const fields = { 'form-name': 'contact', name: 'Test Person', email: 'test@example.org', message: 'Hello' };

beforeEach(() => {
  calls.length = 0;
  process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  process.env.URL = 'https://example.test';
  delete process.env.DEPLOY_PRIME_URL;
});
afterEach(() => { globalThis.fetch = realFetch; });

test('a filled honeypot answers ok and forwards nothing', async () => {
  globalThis.fetch = fakeFetch({});
  const res = await submit(post({ ...fields, website: 'http://spam.example' }));
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.equal(calls.length, 0);
});

test('a missing token is refused before anything is forwarded', async () => {
  globalThis.fetch = fakeFetch({});
  const res = await submit(post(fields));
  assert.equal(res.statusCode, 400);
  assert.match(JSON.parse(res.body).error, /person/i);
  assert.equal(calls.length, 0);
});

test('a token Cloudflare rejects is refused with the same message', async () => {
  globalThis.fetch = fakeFetch({ 'https://challenges.cloudflare.com/turnstile/v0/siteverify': { status: 200, json: { success: false, 'error-codes': ['invalid-input-response'] } } });
  const res = await submit(post({ ...fields, 'cf-turnstile-response': 'bad' }));
  assert.equal(res.statusCode, 400);
  assert.equal(calls.length, 1, 'only Cloudflare was called');
  assert.match(calls[0].body, /remoteip=203\.0\.113\.9/);
});

test('a valid token is forwarded to Netlify Forms, signed, without the token', async () => {
  globalThis.fetch = fakeFetch({ 'https://challenges.cloudflare.com/turnstile/v0/siteverify': { status: 200, json: { success: true } } });
  const res = await submit(post({ ...fields, 'cf-turnstile-response': 'good', website: '' }));
  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, 'https://example.test/');
  const sent = new URLSearchParams(calls[1].body);
  assert.equal(sent.get('form-name'), 'contact');
  assert.equal(sent.get('message'), 'Hello');
  assert.equal(sent.get('cf-turnstile-response'), null);
  assert.equal(sent.get('website'), null);
  assert.equal(sent.get('sv-verified'), signSubmission('contact', 'test@example.org'));
});

test('the sync ignores a submission that did not come through submit', async () => {
  const { handler: sync } = await import('../netlify/functions/submission-created.mjs');
  globalThis.fetch = fakeFetch({});
  process.env.NOTION_TOKEN = 'secret_test';
  const payload = { form_name: 'contact', data: { name: 'Test Person', email: 'test@example.org', message: 'Hello' }, created_at: '2026-11-01T12:00:00Z' };
  const unsigned = await sync({ body: JSON.stringify({ payload }) });
  assert.equal(unsigned.body, 'ignored');
  assert.equal(calls.length, 0, 'no Notion or Klaviyo call');
  payload.data['sv-verified'] = signSubmission('contact', 'test@example.org');
  const signed = await sync({ body: JSON.stringify({ payload }) });
  assert.notEqual(signed.body, 'ignored');
  assert.ok(calls.some((c) => c.url.includes('api.notion.com')), 'Notion was called for the signed one');
});
