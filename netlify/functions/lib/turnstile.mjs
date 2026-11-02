// Cloudflare Turnstile, server side, shared by submit.mjs (verifies the token before
// a submission reaches Netlify Forms) and submission-created.mjs (only syncs entries
// that submit.mjs signed). Same approach as the VCIF site. Without
// TURNSTILE_SECRET_KEY (local preview) every submission passes and nothing is
// signed; submit.mjs logs that once per cold start. Nothing here logs form values.
import { createHmac, timingSafeEqual } from 'node:crypto';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
export const TOKEN_FIELD = 'cf-turnstile-response';
export const HONEYPOT_FIELD = 'website';
export const SIGNATURE_FIELD = 'sv-verified';
export const NOT_A_PERSON = 'We could not confirm this came from a person. Please try the check again and resubmit.';

export const secret = () => process.env.TURNSTILE_SECRET_KEY || '';

/** Checks a widget token with Cloudflare. Returns { ok, reason }. */
export async function verifyTurnstile(token, ip) {
  const key = secret();
  if (!key) return { ok: true, reason: 'no-secret' };
  if (!token) return { ok: false, reason: 'missing-input-response' };
  const body = new URLSearchParams({ secret: key, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    const data = await res.json();
    if (data.success === true) return { ok: true };
    return { ok: false, reason: (data['error-codes'] || ['unknown']).join(',') };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

/** Signature submit.mjs adds to a verified submission so the CRM sync can tell it from a direct POST. */
export function signSubmission(formName, email) {
  const key = secret();
  if (!key) return '';
  return createHmac('sha256', key).update(`${formName}\n${(email || '').trim().toLowerCase()}`).digest('hex').slice(0, 32);
}

export function isSignedSubmission(formName, email, signature) {
  const expected = signSubmission(formName, email);
  if (!expected) return true; // no secret configured: nothing to check
  if (typeof signature !== 'string' || signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/** Best-effort client IP on Netlify. */
export function clientIp(headers = {}) {
  const h = (k) => headers[k] || headers[k.toLowerCase()] || '';
  return (h('x-nf-client-connection-ip') || h('x-forwarded-for')).split(',')[0].trim() || undefined;
}
