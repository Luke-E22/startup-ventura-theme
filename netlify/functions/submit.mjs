// POST /.netlify/functions/submit: the front door for every form on the site.
// The page script posts the form here instead of straight to Netlify Forms. This
// function drops honeypot hits, verifies the Cloudflare Turnstile token (with the
// caller's IP) and only then forwards the fields to Netlify Forms, signed, so the
// inbox, notifications and the submission-created sync (Notion, Klaviyo) all keep
// working as before and never see a submission that failed the check. Logs only
// the form name and the reason, never field values.
import {
  HONEYPOT_FIELD, NOT_A_PERSON, SIGNATURE_FIELD, TOKEN_FIELD, clientIp, secret, signSubmission, verifyTurnstile,
} from './lib/turnstile.mjs';

const json = (statusCode, body) => ({ statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify(body) });
let warned = false;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  let params;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '');
    params = new URLSearchParams(raw);
  } catch {
    return json(400, { error: 'Invalid request' });
  }
  const form = (params.get('form-name') || '').trim();
  if (!form || !/^[a-z][a-z0-9-]{0,40}$/.test(form)) return json(400, { error: 'Invalid request' });

  // Honeypot: real people never see the field. Say "ok" and do nothing.
  if ((params.get(HONEYPOT_FIELD) || '').trim()) {
    console.log(`submit: ${form}: honeypot filled, ignored`);
    return json(200, { ok: true });
  }

  if (!secret() && !warned) {
    warned = true;
    console.warn('submit: TURNSTILE_SECRET_KEY is not set, so submissions are not verified. Local preview only.');
  }
  const check = await verifyTurnstile(params.get(TOKEN_FIELD), clientIp(event.headers));
  if (!check.ok) {
    console.warn(`submit: ${form}: turnstile rejected (${check.reason})`);
    return json(400, { error: NOT_A_PERSON });
  }

  // Forward to Netlify Forms without the token or honeypot, plus the signature.
  const forward = new URLSearchParams();
  for (const [k, v] of params) if (k !== TOKEN_FIELD && k !== HONEYPOT_FIELD && k !== SIGNATURE_FIELD) forward.append(k, v);
  forward.set(SIGNATURE_FIELD, signSubmission(form, params.get('email')));
  const site = process.env.DEPLOY_PRIME_URL || process.env.URL;
  if (!site) {
    console.error(`submit: ${form}: no site URL in the environment; cannot forward`);
    return json(502, { error: 'We could not save your message. Please email info@startupventura.com.' });
  }
  try {
    const res = await fetch(`${site}/`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'startupventura-submit' },
      body: forward.toString(),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`submit: ${form}: Netlify Forms answered ${res.status}`);
      return json(502, { error: 'We could not save your message. Please email info@startupventura.com.' });
    }
  } catch (err) {
    console.error(`submit: ${form}: forward failed (${err.name})`);
    return json(502, { error: 'We could not save your message. Please email info@startupventura.com.' });
  }
  return json(200, { ok: true });
};
