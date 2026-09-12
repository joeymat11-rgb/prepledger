// C6 structural wire boundary. Consent approval, identity, replay, money and
// transport live outside this module. No provider or request configuration here.
// INVENTED ingress bound: 98304 UTF-8 bytes, including JSON syntax and whitespace.
// SDP's separately proposed 65536-byte bound is on the decoded string.
const MAX_REQUEST_BYTES = 98304;
const MAX_SDP_BYTES = 65536;
const utf8 = new TextEncoder();
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const UTC_MILLIS = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\.[0-9]{3}Z$/;
const ERROR_STATUS = Object.freeze({
  COACH_REQUEST_INVALID: 400,
  COACH_AUTH_REQUIRED: 403,
  COACH_USER_NOT_NAMED: 403,
  COACH_OPT_IN_REQUIRED: 403,
  COACH_SESSION_REQUEST_REPLAYED: 409,
  COACH_SESSION_CAP_REACHED: 429,
  COACH_CAP_NOT_VERIFIED: 503,
  COACH_ENFORCEMENT_UNAVAILABLE: 503,
  COACH_RELAY_UNAVAILABLE: 503,
});
const knownCode = (code) => typeof code === "string" && Object.hasOwn(ERROR_STATUS, code)
  ? code : "COACH_RELAY_UNAVAILABLE";
const safeNonce = (value) => typeof value === "string" && UUID_V4.test(value) ? value : null;
const nonempty = (value) => typeof value === "string" && value.length > 0;
const sdpValid = (value) => nonempty(value) && value.length <= MAX_SDP_BYTES
  && utf8.encode(value).byteLength <= MAX_SDP_BYTES;
const exactObject = (value, keys) => value !== null && typeof value === "object"
  && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype
  && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
const realTimestamp = (value) => {
  if (typeof value !== "string" || !UTC_MILLIS.test(value)) return false;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString() === value;
};

export class ProtocolError extends Error {
  constructor(code = "COACH_REQUEST_INVALID", nonce = null) {
    const safeCode = knownCode(code);
    super(safeCode);
    this.name = "ProtocolError";
    this.code = safeCode;
    this.nonce = safeNonce(nonce);
  }
}

// Scan before parsing the whole JSON document: JSON.parse itself loses duplicate
// keys. Decode each string token to compare escaped-equivalent property names.
// This iterative scanner imposes no recursive-depth risk; JSON.parse subsequently
// checks the grammar. Names in different objects do not share a duplicate set.
function duplicateNames(text) {
  const stack = [];
  let duplicate = false;
  let duplicateNonce = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "{") stack.push({ type: "object", names: new Set() });
    else if (ch === "[") stack.push({ type: "array" });
    else if (ch === "}" || ch === "]") stack.pop();
    else if (ch === '"') {
      const start = i;
      for (i += 1; i < text.length; i += 1) {
        if (text[i] === "\\") i += 1;
        else if (text[i] === '"') break;
      }
      const token = JSON.parse(text.slice(start, i + 1));
      let next = i + 1;
      while (next < text.length && /[ \t\r\n]/.test(text[next])) next += 1;
      const current = stack.at(-1);
      if (text[next] === ":" && current?.type === "object") {
        if (current.names.has(token)) {
          duplicate = true;
          if (stack.length === 1 && token === "nonce") duplicateNonce = true;
        }
        current.names.add(token);
      }
    }
  }
  return { duplicate, duplicateNonce };
}

export function parseUniqueJSON(text) {
  if (typeof text !== 'string' || utf8.encode(text).byteLength > MAX_REQUEST_BYTES
    || duplicateNames(text).duplicate) throw new ProtocolError();
  return JSON.parse(text);
}

export function parseSessionRequest(text) {
  if (typeof text !== "string" || text.length > MAX_REQUEST_BYTES
      || utf8.encode(text).byteLength > MAX_REQUEST_BYTES) throw new ProtocolError();
  let parsed;
  let names;
  try {
    names = duplicateNames(text);
    parsed = JSON.parse(text);
  } catch {
    // Malformed JSON has no trustworthy request envelope from which to echo.
    throw new ProtocolError();
  }
  const nonce = !names.duplicateNonce && parsed !== null && typeof parsed === "object"
    && Object.hasOwn(parsed, "nonce") ? safeNonce(parsed.nonce) : null;
  const invalid = () => { throw new ProtocolError("COACH_REQUEST_INVALID", nonce); };
  if (names.duplicate || !exactObject(parsed, ["user", "opt_in", "nonce", "sdp_offer"])) invalid();
  if (!nonce || !["joe", "dad"].includes(parsed.user) || !sdpValid(parsed.sdp_offer)) invalid();
  const opt = parsed.opt_in;
  if (!exactObject(opt, ["user", "accepted", "accepted_at", "screen_version", "wording"])
      || opt.user !== parsed.user || opt.accepted !== true || !realTimestamp(opt.accepted_at)
      || !nonempty(opt.screen_version) || !nonempty(opt.wording)) {
    throw new ProtocolError("COACH_OPT_IN_REQUIRED", nonce);
  }
  // Supported screen version, exact reviewed wording and authenticated principal
  // binding are admission prerequisites for the caller, not claims of this parser.
  return parsed;
}

export function validateProviderResult(result) {
  if (!exactObject(result, ["sessionId", "sdpAnswer"])
      || !nonempty(result.sessionId) || !sdpValid(result.sdpAnswer)) {
    throw new ProtocolError("COACH_RELAY_UNAVAILABLE");
  }
  return { sessionId: result.sessionId, sdpAnswer: result.sdpAnswer };
}

export function errorResponse(code, nonce) {
  const safeCode = knownCode(code);
  return new Response(JSON.stringify({ ok: false, code: safeCode, nonce: safeNonce(nonce) }), {
    status: ERROR_STATUS[safeCode],
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
