// Pure mapping: Netlify form submission payload -> CRM intent (no IO), so it
// can be unit-tested locally without a Notion token. Option names MUST match
// the People / Interactions select options in Notion exactly.
//
// People.Interest options: Mentoring | Donating | Applying as a founder |
//   Attending events | Volunteering | Partnership / sponsorship
// People.Relationship Type options: Donor | Mentor | Prospect | Board Candidate |
//   Connector | Volunteer | Event Attendee | Board Member | Government | Vendor
// Interactions.Topics options: Mission | Donation | Mentoring | Intro | Event |
//   Partnership | Personal | Operations

export const FORMS = {
  contact:             { label: 'Contact',                 interest: [],                          relationship: [],                 topics: ['Mission'] },
  connect:             { label: 'Connect (ad landing)',    interest: ['Donating'],                relationship: ['Prospect'],       topics: ['Donation'] },
  apply:               { label: 'Founder first access',    interest: ['Applying as a founder'],   relationship: ['Prospect'],       topics: ['Mission'] },
  notify:              { label: 'Founder notify list',     interest: ['Applying as a founder'],   relationship: [],                 topics: ['Mission'] },
  mentor:              { label: 'Mentor signup',           interest: ['Mentoring'],               relationship: ['Mentor'],         topics: ['Mentoring'] },
  workshop:            { label: 'Workshop seat request',   interest: ['Attending events'],        relationship: ['Event Attendee'], topics: ['Event'] },
  events:              { label: 'Events calendar signup',  interest: ['Attending events'],        relationship: [],                 topics: ['Event'] },
  board:               { label: 'Board of Directors interest', interest: ['Volunteering'],        relationship: ['Board Candidate'], topics: ['Mission'] },
  careers:             { label: 'Job application',         interest: [],                          relationship: [],                 topics: ['Operations'] },
  newsletter:          { label: 'Newsletter signup',       interest: [],                          relationship: [],                 topics: ['Mission'] },
  'partner-foundations': { label: 'Foundation partnership', interest: ['Partnership / sponsorship'], relationship: ['Prospect'],    topics: ['Partnership'] },
  'partner-government':  { label: 'Government partnership', interest: ['Partnership / sponsorship'], relationship: ['Prospect', 'Government'], topics: ['Partnership'] },
};

// Per-form refinements driven by the "interest" dropdown value.
function refine(form, interest, out) {
  const v = (interest || '').toLowerCase();
  if (form === 'contact') {
    if (v.includes('major gifts')) { out.interest.push('Donating'); out.relationship.push('Prospect'); out.topics = ['Donation']; }
    else if (v.includes('sponsorship')) { out.interest.push('Partnership / sponsorship'); out.relationship.push('Prospect'); out.topics = ['Partnership']; }
    else if (v.includes('mentoring')) { out.interest.push('Mentoring'); out.topics = ['Mentoring']; }
    else if (v.includes('investor')) { out.relationship.push('Connector'); out.topics = ['Intro']; }
  }
  if (form === 'connect' && v.includes('corporate')) { out.interest = ['Partnership / sponsorship']; out.topics = ['Partnership']; }
  if (form === 'connect' && v.includes('exploring')) { out.interest = []; out.relationship = ['Prospect']; }
}

const SKIP = new Set(['form-name', 'bot-field', 'ip', 'user_agent', 'referrer', 'g-recaptcha-response']);

export function mapSubmission(payload) {
  if (!payload || !payload.form_name) return null;
  const form = payload.form_name;
  const spec = FORMS[form];
  if (!spec) return null;
  const d = payload.data || {};
  const out = { form, formLabel: spec.label, interest: [...spec.interest], relationship: [...spec.relationship], topics: [...spec.topics] };
  refine(form, d.interest, out);

  const email = (d.email || '').trim().toLowerCase() || null;
  const name = (d.name || '').trim() || (email ? email.split('@')[0] : 'Website visitor');
  out.email = email;
  out.name = name;
  out.phone = (d.phone || '').trim() || null;
  out.company = (d.org || d.organization || d.company || '').trim() || null;
  out.date = (payload.created_at || new Date().toISOString()).slice(0, 10);

  const detail = (d.interest || '').trim();
  out.summary = `Website: ${spec.label}${detail ? ` (${detail})` : ''}`;

  // Notes keep everything the person typed so nothing is lost in mapping.
  const lines = [];
  if (d.message) lines.push(d.message.trim());
  for (const [k, v] of Object.entries(d)) {
    if (SKIP.has(k) || ['name', 'email', 'phone', 'message'].includes(k)) continue;
    if (v && String(v).trim()) lines.push(`${k}: ${String(v).trim()}`);
  }
  lines.push(`Submitted via Netlify form "${form}"${payload.id ? ` (id ${payload.id})` : ''}${payload.site_url ? ` on ${payload.site_url}` : ''}`);
  out.notes = lines.join('\n');
  out.interest = [...new Set(out.interest)];
  out.relationship = [...new Set(out.relationship)];
  out.topics = [...new Set(out.topics)];
  return out;
}
