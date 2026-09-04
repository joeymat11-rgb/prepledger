"use strict";
/* canonical.cjs — CANONICAL ENCODING v1 ("earned/canonical/v1") for the authority. An independent implementation of
   the ratified profile (sheet A1, lines 96–102); it must agree byte-for-byte with every other v1 encoder in the system.
     absent   → the key is omitted (an undefined array item is dropped)
     null     → null
     boolean  → true | false
     string   → Unicode NFC, then JSON quoting (", \, control chars as \b \t \n \f \r or \u00xx, lone surrogates \udxxx)
     number   → canonical decimal (decimal() below, with the ratified v1 quirks — see rebuild/t2/REPORT.txt §6a)
     array    → "[" items "," "]" in order; a declared SET field (causal_parents) is de-duplicated and sorted by encoding
     map      → "{" "key":value pairs sorted by the key's UTF-16 code units "}"; keys are quoted as-is (not normalized)
   Nothing here depends on the caller: no platform locale, no Date, no randomness. */
const SET_FIELDS = new Set(["causal_parents"]);
const VERSION = "earned/canonical/v1";
const SHORT = { 8: "\\b", 9: "\\t", 10: "\\n", 12: "\\f", 13: "\\r" };
function quote(s) {
  let out = '"';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 34) { out += '\\"'; continue; }
    if (c === 92) { out += "\\\\"; continue; }
    if (c < 32) { out += SHORT[c] || ("\\u" + c.toString(16).padStart(4, "0")); continue; }
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) { const d = s.charCodeAt(i + 1); if (d >= 0xdc00 && d <= 0xdfff) { out += s[i] + s[i + 1]; i++; continue; } }
    if (c >= 0xd800 && c <= 0xdfff) { out += "\\u" + c.toString(16).padStart(4, "0"); continue; }
    out += s[i];
  }
  return out + '"';
}
/* the v1 decimal profile: shortest round-trip digits; magnitudes toString() would print with an exponent go through a
   20-place fixed expansion (≥ 1e21 keeps the exponent form — a ratified v1 quirk); trailing zeros and a bare "." are
   stripped whenever a "." is present; ±0 → "0"; non-finite → the quoted name (encodable, never equal to a finite value) */
function decimal(n) {
  if (typeof n !== "number") throw new TypeError("decimal(): not a number");
  if (n !== n) return '"NaN"';
  if (n === Infinity) return '"Infinity"';
  if (n === -Infinity) return '"-Infinity"';
  if (n === 0) return "0";
  let s = String(n);
  if (/[eE]/.test(s)) s = n.toFixed(20);
  if (s.indexOf(".") >= 0) { let end = s.length; while (end > 0 && s[end - 1] === "0") end--; if (s[end - 1] === ".") end--; s = s.slice(0, end); }
  return s;
}
function encode(value, setKey) {
  if (value === undefined) return undefined;
  if (value === null) return "null";
  switch (typeof value) {
    case "string": return quote(value.normalize("NFC"));
    case "number": return decimal(value);
    case "boolean": return value ? "true" : "false";
    case "object": break;
    default: throw new TypeError("unencodable " + typeof value);
  }
  if (Array.isArray(value)) {
    const items = [];
    for (const item of value) { const e = encode(item); if (e !== undefined) items.push(e); }
    if (setKey !== undefined && SET_FIELDS.has(setKey)) { const uniq = Array.from(new Set(items)); uniq.sort(); return "[" + uniq.join(",") + "]"; }
    return "[" + items.join(",") + "]";
  }
  const keys = Object.keys(value); keys.sort();
  const parts = [];
  for (const k of keys) { const e = encode(value[k], k); if (e === undefined) continue; parts.push(quote(k) + ":" + e); }
  return "{" + parts.join(",") + "}";
}
module.exports = { encode, decimal, quote, SET_FIELDS, VERSION };
