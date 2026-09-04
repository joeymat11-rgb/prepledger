/* lib/canonical.cjs — CANONICAL ENCODING v1 (sheet A1 lines 96–102: "The canonical encoding version declares decimal
   representation, units, Unicode normalization, map ordering, set ordering and distinct encodings for absent / null /
   value"). ONE reference encoder; every commitment law is bound to the CANDIDATE's own commitment function and
   compared to this. Sol suite-pass-2 finding 4.
     strings   → Unicode NFC
     maps      → keys sorted by code point, absent keys omitted
     sets      → declared SET fields (causal_parents) sorted by their canonical encoding and de-duplicated
     numbers   → canonical decimal: no exponent, no trailing zeros, "-0" → "0", integers without ".0"
     absent / null / value → three distinct encodings (omitted / the literal null / the value)
     quantities → {value, unit} objects encode like maps (the unit is part of the encoding)
   Output is a deterministic string; the commitment is HMAC(K, "earned/op/v1" || encode(envelope)). */
const SET_FIELDS = new Set(["causal_parents"]);
const opts = { nfc: true, sortMaps: true, sortSets: true, decimal: true, nullDistinct: true };
function decimal(n) { if (!Number.isFinite(n)) return JSON.stringify(String(n));   /* a non-finite number is encodable (so the op can exist and be REJECTED) but never equals any finite encoding */ if (Object.is(n, -0) || n === 0) return "0"; let s = n.toString(); if (/e/i.test(s)) { s = n.toFixed(20); } if (s.indexOf(".") > -1) s = s.replace(/0+$/, "").replace(/\.$/, ""); return s; }
function encode(v, o = opts, key) {
  if (v === undefined) return undefined;                                    /* absent: the caller omits the key */
  if (v === null) return o.nullDistinct ? "null" : undefined;               /* null: the literal */
  if (typeof v === "string") return JSON.stringify(o.nfc ? v.normalize("NFC") : v);
  if (typeof v === "number") return o.decimal ? decimal(v) : JSON.stringify(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (Array.isArray(v)) { let items = v.map((x) => encode(x, o)).filter((x) => x !== undefined); if (key && SET_FIELDS.has(key) && o.sortSets) items = [...new Set(items)].sort(); return "[" + items.join(",") + "]"; }
  if (typeof v === "object") { const keys = o.sortMaps ? Object.keys(v).sort() : Object.keys(v); const parts = []; for (const k of keys) { const e = encode(v[k], o, k); if (e === undefined) continue; parts.push(JSON.stringify(k) + ":" + e); } return "{" + parts.join(",") + "}"; }
  throw new Error("unencodable " + typeof v);
}
module.exports = { encode, decimal, SET_FIELDS, defaults: opts, VERSION: "earned/canonical/v1" };
