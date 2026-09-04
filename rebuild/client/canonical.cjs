"use strict";
/* canonical.cjs — CANONICAL ENCODING v1 (earned/canonical/v1), an independent implementation.
   Sheet A1 (lines 96–102): the canonical encoding version declares decimal representation, units, Unicode
   normalization, map ordering, set ordering and distinct encodings for absent / null / value.

   PROFILE (what this module emits — every rule is deterministic, no platform defaults are relied upon):
     absent    → the key is OMITTED (an undefined value is never written; an undefined array item is dropped)
     null      → the literal  null
     boolean   → true | false
     string    → Unicode NFC, then JSON string quoting (see quote(): ", \, control characters and LONE
                 surrogates are escaped with lowercase hex; everything else is emitted literally)
     number    → canonical decimal (see decimal())
     array     → "[" items joined by "," "]" (order preserved)
     SET field → an array under a declared SET key (causal_parents) is de-duplicated and sorted by the
                 items' canonical encodings (UTF-16 code-unit order)
     map       → "{" + "key":encoding pairs sorted by the key's UTF-16 code units, joined by "," + "}";
                 map KEYS are emitted as-is (not normalized); quantities {value, unit} are maps, so the unit
                 is part of every quantity's encoding
     anything else (function, symbol, bigint) → throws: unencodable

   DECIMAL PROFILE NOTES (ratified v1 as it is actually gated — these are reproduced deliberately so that two
   implementations agree byte-for-byte; see the T2 report for the defects they carry):
     · ±0 → "0" · non-finite → the JSON string of its name ("NaN", "Infinity", "-Infinity"): encodable, never
       equal to a finite encoding
     · |n| in [1e-6, 1e21): the shortest round-trip decimal (no exponent, no trailing zeros, no ".0")
     · |n| < 1e-6: rounded HALF-UP IN MAGNITUDE to 20 fractional digits, trailing zeros stripped
       (so 1e-7 → "0.0000001"; values below 5e-21 collapse to "0" / "-0")
     · |n| ≥ 1e21: the shortest round-trip form INCLUDING its exponent ("1e+21"), with the trailing-zero
       strip still applied when a "." is present ("1.5e+30" → "1.5e+3") */
const SET_FIELDS = new Set(["causal_parents"]);
const VERSION = "earned/canonical/v1";

const codeUnitCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);   /* UTF-16 code-unit order, spelled out */
const hex4 = (c) => c.toString(16).padStart(4, "0");

function quote(s) {
  let out = '"';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 0x22) out += '\\"';
    else if (c === 0x5c) out += "\\\\";
    else if (c < 0x20) {
      if (c === 0x08) out += "\\b"; else if (c === 0x09) out += "\\t"; else if (c === 0x0a) out += "\\n";
      else if (c === 0x0c) out += "\\f"; else if (c === 0x0d) out += "\\r"; else out += "\\u" + hex4(c);
    } else if (c >= 0xd800 && c <= 0xdfff) {
      if (c <= 0xdbff && i + 1 < s.length) { const d = s.charCodeAt(i + 1); if (d >= 0xdc00 && d <= 0xdfff) { out += s[i] + s[i + 1]; i++; continue; } }
      out += "\\u" + hex4(c);   /* a lone surrogate is escaped so the output is always well-formed */
    } else out += s[i];
  }
  return out + '"';
}

/* exact rational decomposition of a finite double: |n| = mant × 2^exp */
function decompose(abs) {
  const dv = new DataView(new ArrayBuffer(8)); dv.setFloat64(0, abs);
  const hi = dv.getUint32(0), lo = dv.getUint32(4);
  const expBits = (hi >>> 20) & 0x7ff; let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  if (expBits === 0) return { mant, exp: -1074 };
  return { mant: mant | (1n << 52n), exp: expBits - 1075 };
}
/* round |n| half-up to 20 fractional digits using exact integer arithmetic, then strip trailing zeros */
function fixed20(n) {
  const neg = n < 0; const { mant, exp } = decompose(Math.abs(n));
  let num = mant * 10n ** 20n, den = 1n;
  if (exp >= 0) num <<= BigInt(exp); else den <<= BigInt(-exp);
  let q = num / den; const r = num - q * den; if (2n * r >= den) q += 1n;
  const digits = q.toString().padStart(21, "0");
  const intPart = digits.slice(0, -20), frac = digits.slice(-20).replace(/0+$/, "");
  return (neg ? "-" : "") + intPart + (frac ? "." + frac : "");
}
function decimal(n) {
  if (typeof n !== "number") throw new Error("decimal(): not a number");
  if (n !== n) return '"NaN"';
  if (n === Infinity) return '"Infinity"';
  if (n === -Infinity) return '"-Infinity"';
  if (n === 0) return "0";
  const s = String(n);                       /* shortest round-trip digits (ECMAScript Number::toString) */
  if (s.indexOf("e") < 0) return s;          /* plain decimal: never has trailing zeros or a bare ".0" */
  if (Math.abs(n) < 1e21) return fixed20(n); /* tiny magnitudes: 20-place fixed profile */
  return s.indexOf(".") > -1 ? s.replace(/0+$/, "") : s;   /* huge magnitudes: ratified exponent form */
}

function encode(value, key) {
  if (value === undefined) return undefined;
  if (value === null) return "null";
  const t = typeof value;
  if (t === "string") return quote(value.normalize("NFC"));
  if (t === "number") return decimal(value);
  if (t === "boolean") return value ? "true" : "false";
  if (t !== "object") throw new Error("unencodable " + t);
  if (Array.isArray(value)) {
    let items = [];
    for (const x of value) { const e = encode(x); if (e !== undefined) items.push(e); }
    if (key !== undefined && SET_FIELDS.has(key)) items = Array.from(new Set(items)).sort(codeUnitCompare);
    return "[" + items.join(",") + "]";
  }
  const keys = Object.keys(value).sort(codeUnitCompare); const parts = [];
  for (const k of keys) { const e = encode(value[k], k); if (e === undefined) continue; parts.push(quote(k) + ":" + e); }
  return "{" + parts.join(",") + "}";
}

module.exports = { encode, decimal, quote, SET_FIELDS, VERSION };
