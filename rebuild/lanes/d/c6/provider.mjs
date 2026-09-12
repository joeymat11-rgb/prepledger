// Transport only. The Worker must verify its reviewed C6-09 companion binding
// before calling this function. A successful SDP exchange proves no tool or
// pre-playback gate. No caller-supplied provider configuration is accepted.

export const LIVE_ENDPOINT = 'https://api.openai.com/v1/live/sessions';
export const PROVIDER_POLICY_VERSION = 'earned-wave1-live-v1';
export const MAX_SDP_BYTES = 65_536;
const MAX_RESPONSE_BYTES = 262_144; // Local defensive bound, not a provider limit.
const utf8 = new TextEncoder();

// Exactly the C5 fifteen plus wave1-tools.cjs's four. This is the companion's
// dispatch policy, NOT an invented Live `tools` field. Client delegation leaves
// tool execution in the application. No Responses backend is configured here.
export const WAVE1_TOOL_TIERS = Object.freeze({
  today_plan: 0, current_set: 0, next_set: 0,
  last_comparable_performance: 0, weight_trend: 0, today_checkin: 0,
  why_this_instruction: 0, record_pain_or_soreness: 1,
  equipment_unavailable_today: 1, correct_set: 1, time_away: 1,
  answer_checkin: 1, request_replan: 2, accept_proposal: 2,
  cannot_change_via_coach: 3, plan_why: 0, machine_settings: 0,
  record_machine_settings: 1, log_set: 1,
});

export const ALLOWED_CLIENT_EVENTS = Object.freeze([
  'session.commentary.append', 'session.close',
]);
export const ALLOWED_SERVER_EVENTS = Object.freeze([
  'session.started', 'session.input_transcript.delta',
  'session.output_transcript.delta', 'session.delegation.created',
  'session.commentary.appended', 'session.usage.updated', 'session.closed',
  'error', 'info',
]);

const INSTRUCTIONS = [
  'You are the spoken interface to Earned, reachable between sets.',
  'Delegate every question about the athlete or a requested action to the application.',
  'The application is the only source of facts, numbers, prescriptions, and write results.',
  'Never invent, round, infer, or replace a missing value. Blank means unknown.',
  'The application alone records confirmation and authorizes writes. Never claim a write succeeded before its verified result.',
  'Read verified results and refusals exactly, including units. Do not add encouragement, urgency, streaks, or dashes.',
  'The application discards untraceable drafts and checks actual audio before playback.',
  'Its closed tool surface is: ' + Object.keys(WAVE1_TOOL_TIERS).join(', ') + '.',
].join(' ');

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

// This exact object is hashed by admission and bound to the independently
// reviewed phone companion commit. It is descriptive policy, never a boolean
// supplied by the requesting phone. No review attestation is shipped here.
export const COMPANION_POLICY = deepFreeze({
  version: PROVIDER_POLICY_VERSION,
  toolTiers: WAVE1_TOOL_TIERS,
  session: {
    model: 'gpt-live-1', store: false, instructions: INSTRUCTIONS,
    delegation: { type: 'client' },
    client: { data_channel: {
      allowed_client_events: [...ALLOWED_CLIENT_EVENTS],
      allowed_server_events: ALLOWED_SERVER_EVENTS.map(type => ({ type })),
    } },
  },
  phoneSafeguards: {
    servedTools: 'rebuild/coach/wave1-tools.cjs',
    confirmation: 'Strip model confirmation flags; only the harness records the spoken yes.',
    proposals: 'Only accept an engine-issued proposal from this conversation after confirmation.',
    traceability: 'Check every drafted answer against the same turn, value, field and unit before any audio plays.',
    charter: 'Discard a failed draft; do not repair or retry it. Check charter and dash restrictions before playback.',
    media: 'Buffer and gate actual model audio, including speech outside a delegation and stale or cancelled output.',
    delegation: 'Correlate opaque delegation IDs with transcript and local turn state; metadata alone is not a tool call.',
    context: 'Only current-turn minimal tool context plus at most two prior turns; never athlete state or logs.',
    maxToolCallsPerTurn: 6, maxDraftsPerTurn: 1,
    sessionMinuteCap: 10,
    cutoff: 'End on the phone at the deadline; do not claim server termination or a proved idle timeout.',
  },
});

export class LiveProviderError extends Error {
  constructor(creation = 'unknown') {
    super('Coach provider unavailable.');
    this.name = 'LiveProviderError';
    this.code = 'COACH_PROVIDER_UNAVAILABLE';
    // No status, upstream message, response body, request, key, or nested cause.
    // A remote failure is never classified as proof that no session was created.
    this.creation = creation;
  }
}

function plainObject(value) {
  return value !== null && typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype;
}
function closed(value, keys) {
  return plainObject(value) && Object.keys(value).length === keys.length &&
    keys.every(key => Object.hasOwn(value, key));
}
function nonempty(value, max) {
  return typeof value === 'string' && value.trim().length > 0 &&
    utf8.encode(value).byteLength <= max;
}
function headerValue(value, max) {
  return nonempty(value, max) && value === value.trim() &&
    !/[\u0000-\u0020\u007f-\u009f]/u.test(value);
}

async function readBounded(response) {
  if (!response.body || typeof response.body.getReader !== 'function') throw new LiveProviderError();
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let body = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_RESPONSE_BYTES) throw new LiveProviderError();
      body += decoder.decode(value, { stream: true });
    }
    return body + decoder.decode();
  } finally {
    // Bound enforcement also releases an unfinished upstream response.
    try { await reader.cancel(); } catch { /* Never expose a transport error. */ }
    reader.releaseLock();
  }
}

function parseReply(raw) {
  // The accepted reply has five distinct property names across all levels.
  // Tokenize complete JSON strings before inspecting key positions, so escaped
  // quotes in SDP cannot masquerade as object keys. Decode escaped key names.
  const keys = [];
  for (const token of raw.matchAll(/"(?:[^"\\]|\\.)*"/gs)) {
    if (/^\s*:/.test(raw.slice(token.index + token[0].length))) keys.push(JSON.parse(token[0]));
  }
  if (keys.length !== 5 || new Set(keys).size !== 5) throw new LiveProviderError();
  const data = JSON.parse(raw);
  if (!closed(data, ['session', 'transport']) ||
      !closed(data.session, ['id']) || !closed(data.transport, ['type', 'sdp']) ||
      !headerValue(data.session.id, 1024) || data.transport.type !== 'webrtc' ||
      !nonempty(data.transport.sdp, MAX_SDP_BYTES) ||
      /[\u0000\u000b\u000c]/u.test(data.transport.sdp)) throw new LiveProviderError();
  return Object.freeze({ sessionId: data.session.id, sdpAnswer: data.transport.sdp });
}

/** Return only the opaque provider session ID and SDP answer.
 * Admission, money reservations, opt-in and companion verification belong to
 * the caller. No retry occurs here: every attempted request may have a cost.
 */
export async function createLiveSession(options) {
  const fields = ['apiKey', 'projectId', 'sdpOffer', 'fetchImpl', 'signal'];
  if (!plainObject(options) || Object.keys(options).some(key => !fields.includes(key))) {
    throw new LiveProviderError('not_attempted');
  }
  const { apiKey, projectId, sdpOffer, signal, fetchImpl = globalThis.fetch } = options;
  if (!headerValue(apiKey, 4096) || !headerValue(projectId, 1024) ||
      !nonempty(sdpOffer, MAX_SDP_BYTES) || typeof fetchImpl !== 'function' ||
      (signal !== undefined && !(signal instanceof AbortSignal)) || signal?.aborted) {
    throw new LiveProviderError('not_attempted');
  }
  // Serialize the same frozen policy covered by the companion attestation.
  const body = JSON.stringify({
    session: COMPANION_POLICY.session,
    transport: { type: 'webrtc', sdp: sdpOffer },
  });
  try {
    const response = await fetchImpl(LIVE_ENDPOINT, {
      // Workerd supports manual/follow, not redirect:error. Never follow a
      // provider redirect with the bearer header; reject its non-201 below.
      method: 'POST', redirect: 'manual', cache: 'no-store', signal,
      headers: { Authorization: 'Bearer ' + apiKey,
        'OpenAI-Project': projectId, 'Content-Type': 'application/json' },
      body,
    });
    if (!response || response.status !== 201 || response.redirected ||
        (response.url && response.url !== LIVE_ENDPOINT) ||
        !/^application\/json(?:\s*;|\s*$)/i.test(response.headers.get('content-type') || '')) {
      // Do not read provider failure bodies, even to extract an error code.
      try { await response?.body?.cancel(); } catch { /* Fixed local error only. */ }
      throw new LiveProviderError();
    }
    return parseReply(await readBounded(response));
  } catch {
    throw new LiveProviderError();
  }
}
