import { parseSessionRequest, parseUniqueJSON, validateProviderResult, errorResponse } from './protocol.mjs';

// Owner :156/:158. Reservations price the admitted voice minutes, not metered
// billing or proof of remote termination. All post-reservation failures consume
// the allowance; an ambiguous response must never purchase a second session.
export const SESSION_MINUTES = 10;
export const MONTH_MINUTES = 300; // $15 / documented $0.05 voice-minute.
export const USER_MINUTES = 150; // Declared equal allocation across joe and dad.
const DAY = 86400000, MAX_BODY = 98304;
const users = ['joe', 'dad'];
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const exact = (o, keys) => o && typeof o === 'object' && !Array.isArray(o)
  && Object.keys(o).length === keys.length && keys.every(k => own(o, k));
const utc = s => typeof s === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(s)
  && Number.isFinite(Date.parse(s)) && new Date(s).toISOString() === s;
const json = s => { try { return parseUniqueJSON(s); } catch { return null; } };
export async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(n => n.toString(16).padStart(2, '0')).join('');
}
function equalHash(a, b) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < 64; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
function allowedOrigin(origin, configured) {
  try { return typeof configured === 'string' && configured === new URL(configured).origin
    && new URL(configured).protocol === 'https:' && origin === configured; } catch { return false; }
}
function capReady(env, now) {
  const cap = json(env.CAP_VERIFICATION_JSON);
  return exact(cap, ['project_id','month_limit_usd','verified_at','verified_by','model','minute_price_usd','enabled'])
    && typeof env.OPENAI_PROJECT_ID === 'string' && env.OPENAI_PROJECT_ID.length > 0
    && cap.project_id === env.OPENAI_PROJECT_ID && cap.month_limit_usd === 50
    && cap.verified_by === 'owner' && cap.model === 'gpt-live-1' && cap.minute_price_usd === 0.05
    && cap.enabled === true && utc(cap.verified_at) && Date.parse(cap.verified_at) <= now
    && now - Date.parse(cap.verified_at) <= 30 * DAY;
}
async function principal(request, env) {
  const header = request.headers.get('Authorization');
  if (!/^Bearer [A-Za-z0-9_-]{43}$/.test(header || '')) return null;
  const phones = json(env.PHONE_CREDENTIALS_JSON);
  if (!Array.isArray(phones) || !phones.length || phones.length > 32) return null;
  const seen = new Set();
  for (const p of phones) {
    if (!exact(p, ['user','digest']) || !users.includes(p.user) || !/^[a-f0-9]{64}$/.test(p.digest)
      || seen.has(p.digest)) return null;
    seen.add(p.digest);
  }
  const hashed = await digest(header.slice(7));
  let user = null;
  for (const p of phones) if (equalHash(hashed, p.digest)) user = p.user;
  return user;
}
function consentReady(input, env, now) {
  const versions = json(env.CONSENT_SCREENS_JSON);
  return versions && typeof versions === 'object' && !Array.isArray(versions)
    && own(versions, input.opt_in.screen_version)
    && versions[input.opt_in.screen_version] === input.opt_in.wording
    && Date.parse(input.opt_in.accepted_at) <= now;
}
async function readBody(request) {
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('Content-Type') || '')) throw Error();
  if (request.headers.has('Content-Encoding')) throw Error();
  const reader = request.body?.getReader();
  if (!reader) throw Error();
  const chunks = []; let count = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      count += value.byteLength;
      if (count > MAX_BODY) { await reader.cancel(); throw Error(); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(count); let offset = 0;
    for (const c of chunks) { bytes.set(c, offset); offset += c.byteLength; }
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } finally { reader.releaseLock(); }
}
function cors(response, origin) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Vary', 'Origin');
  headers.set('Cache-Control', 'no-store');
  return new Response(response.body, { status: response.status, headers });
}
export function unavailableResponse(request, env) {
  const response = errorResponse('COACH_RELAY_UNAVAILABLE', null), origin = request.headers.get('Origin');
  return allowedOrigin(origin, env.APP_ORIGIN) ? cors(response, origin) : response;
}
function monthAt(now) {
  const d = new Date(now), y = d.getUTCFullYear(), m = d.getUTCMonth();
  return { key: d.toISOString().slice(0, 7), expiresAt: Date.UTC(y, m + 1, 1) + 7 * DAY };
}
function expiresAt(key, row) {
  if (key.startsWith('session:')) return row.deadline + DAY;
  if (/^month:\d{4}-\d{2}$/.test(key)) return monthAt(Date.parse(key.slice(6) + '-01T00:00:00.000Z')).expiresAt;
  return NaN;
}
function validCounter(row) {
  return exact(row, ['joe','dad']) && users.every(u => Number.isSafeInteger(row[u]) && row[u] >= 0 && row[u] <= USER_MINUTES)
    && row.joe + row.dad <= MONTH_MINUTES;
}
function validSession(key, row) {
  return /^session:[a-f0-9]{64}$/.test(key)
    && exact(row, ['user','nonceDigest','sessionId','deadline','state','reservation'])
    && users.includes(row.user) && row.nonceDigest === key.slice(8)
    && Number.isSafeInteger(row.deadline) && row.deadline > 0 && row.deadline <= 8640000000000000 - DAY
    && ['reserved','admitted','unknown'].includes(row.state) && row.reservation === SESSION_MINUTES
    && (row.sessionId === null ? row.state !== 'admitted' : typeof row.sessionId === 'string' && row.sessionId.trim().length > 0 && row.sessionId.length <= 1024);
}

export class AdmissionService {
  constructor({ storage, env, createSession, companionPolicySha, now = Date.now }) {
    this.storage = storage; this.env = env; this.createSession = createSession;
    this.companionPolicySha = companionPolicySha; this.now = now;
  }
  async cleanup() {
    const now = this.now();
    return this.storage.transaction(async tx => {
      const rows = await tx.list(); let next = Infinity;
      for (const [key, value] of rows) {
        if (!(key.startsWith('session:') ? validSession(key, value) : /^month:\d{4}-(0[1-9]|1[0-2])$/.test(key) && validCounter(value))) throw Error('Invalid control state');
        const expiry = expiresAt(key, value);
        if (!Number.isFinite(expiry)) throw Error('Invalid retention state');
        if (expiry <= now) await tx.delete(key);
        else next = Math.min(next, expiry);
      }
      if (Number.isFinite(next)) await tx.setAlarm(next);
      else await tx.deleteAlarm();
    });
  }
  async reserve(user, nonce, now) {
    const nonceDigest = await digest(user + ':' + nonce), key = 'session:' + nonceDigest;
    const deadline = now + SESSION_MINUTES * 60000;
    const months = [monthAt(now)];
    const endMonth = monthAt(deadline - 1);
    if (endMonth.key !== months[0].key) months.push(endMonth);
    return this.storage.transaction(async tx => {
      if (await tx.get(key)) return { code: 'COACH_SESSION_REQUEST_REPLAYED' };
      const active = await tx.list({ prefix: 'session:' });
      if ([...active.values()].some(r => r.user === user && r.deadline > now)) return { code: 'COACH_SESSION_CAP_REACHED' };
      const counters = [];
      for (const month of months) {
        const counter = await tx.get('month:' + month.key) || { joe: 0, dad: 0 };
        if (!validCounter(counter)) throw Error('Invalid counter');
        if (counter[user] + SESSION_MINUTES > USER_MINUTES
          || counter.joe + counter.dad + SESSION_MINUTES > MONTH_MINUTES) return { code: 'COACH_SESSION_CAP_REACHED' };
        counters.push({ month, counter });
      }
      const row = { user, nonceDigest, sessionId: null, deadline, state: 'reserved',
        reservation: SESSION_MINUTES };
      // Install cleanup durably in the same transaction, before any provider IO.
      const alarm = await tx.getAlarm();
      await tx.setAlarm(Math.min(alarm || Infinity, row.deadline + DAY, ...months.map(m => m.expiresAt)));
      // A boundary-spanning call reserves its full allowance in both months;
      // crediting seconds to either month would imply unobserved billing data.
      for (const { month, counter } of counters) await tx.put('month:' + month.key, { ...counter, [user]: counter[user] + SESSION_MINUTES });
      await tx.put(key, row);
      return { key, row };
    });
  }
  async finish(admission, state, sessionId = null) {
    return this.storage.transaction(async tx => {
      const row = await tx.get(admission.key);
      if (!row || this.now() >= row.deadline + DAY) return;
      if (!validSession(admission.key, row)) throw Error('Invalid control state');
      await tx.put(admission.key, { ...row, state, sessionId });
      return true;
    });
  }
  async handle(request) {
    const origin = request.headers.get('Origin');
    if (!allowedOrigin(origin, this.env.APP_ORIGIN)) return errorResponse('COACH_AUTH_REQUIRED', null);
    const respond = r => cors(r, origin);
    let nonce = null;
    try {
      const url = new URL(request.url);
      if (url.pathname !== '/session' || url.search || request.headers.has('Upgrade')) return respond(errorResponse('COACH_REQUEST_INVALID', null));
      if (request.method === 'OPTIONS') {
        const requested = (request.headers.get('Access-Control-Request-Headers') || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        if (request.headers.get('Access-Control-Request-Method') !== 'POST'
          || requested.some(h => !['authorization','content-type'].includes(h))) return respond(errorResponse('COACH_REQUEST_INVALID', null));
        return respond(new Response(null, { status: 204, headers: { 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Authorization, Content-Type' } }));
      }
      if (request.method !== 'POST') return respond(errorResponse('COACH_REQUEST_INVALID', null));
      let text;
      try { text = await readBody(request); } catch { return respond(errorResponse('COACH_REQUEST_INVALID', null)); }
      let input;
      try { input = parseSessionRequest(text); } catch (e) { return respond(errorResponse(e.code, e.nonce)); }
      nonce = input.nonce;
      const user = await principal(request, this.env);
      if (!user) return respond(errorResponse('COACH_AUTH_REQUIRED', nonce));
      if (user !== input.user) return respond(errorResponse('COACH_USER_NOT_NAMED', nonce));
      const now = this.now();
      if (!consentReady(input, this.env, now)) return respond(errorResponse('COACH_OPT_IN_REQUIRED', nonce));
      if (!capReady(this.env, now)) return respond(errorResponse('COACH_CAP_NOT_VERIFIED', nonce));
      // Operator attestation installed only after C's actual dispatcher and
      // pre-speech gate are reviewed. A syntactically valid hash is not proof.
      const review = json(this.env.COMPANION_REVIEW_JSON);
      if (!exact(review, ['artifact_sha','policy_sha','reviewed']) || review.reviewed !== true
        || !/^[a-f0-9]{40}$/.test(review.artifact_sha) || !this.companionPolicySha
        || review.policy_sha !== this.companionPolicySha) return respond(errorResponse('COACH_ENFORCEMENT_UNAVAILABLE', nonce));
      if (typeof this.env.OPENAI_API_KEY !== 'string' || !this.env.OPENAI_API_KEY.length) return respond(errorResponse('COACH_RELAY_UNAVAILABLE', nonce));
      await this.cleanup();
      const admission = await this.reserve(user, nonce, now);
      if (admission.code) return respond(errorResponse(admission.code, nonce));
      let result;
      try {
        result = await this.createSession({ apiKey: this.env.OPENAI_API_KEY,
          projectId: this.env.OPENAI_PROJECT_ID, sdpOffer: input.sdp_offer,
          signal: AbortSignal.timeout(20000) });
        validateProviderResult(result);
        if (this.now() >= admission.row.deadline) throw Error('Expired admission');
        if (!await this.finish(admission, 'admitted', result.sessionId)) throw Error('Admission lost');
      } catch {
        // Never release a reservation on an uncertain creation, malformed reply,
        // timeout or storage failure. Restart/replay also consumes no new call.
        try { await this.finish(admission, 'unknown'); } catch {}
        return respond(errorResponse('COACH_RELAY_UNAVAILABLE', nonce));
      }
      return respond(Response.json({ nonce, session_id: result.sessionId, sdp_answer: result.sdpAnswer,
        session_minute_cap: SESSION_MINUTES, deadline_at: new Date(admission.row.deadline).toISOString(),
        provider: 'openai', model: 'gpt-live-1' }, { headers: { 'Cache-Control': 'no-store' } }));
    } catch { return respond(errorResponse('COACH_RELAY_UNAVAILABLE', nonce)); }
  }
}
