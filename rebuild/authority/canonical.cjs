"use strict";

// Version 1 is a byte profile, including its decimal defects: tiny values round
// to 20 places, large values retain exponents, and fractional exponent strings
// lose terminal zeroes (1.5e30 becomes 1.5e+3). Changing this needs a new version.
const VERSION = "earned/canonical/v1";
const SET_FIELDS = new Set(["causal_parents"]);

function decimal(value) {
  if (typeof value !== "number") throw new TypeError("decimal requires a number");
  if (!Number.isFinite(value)) return JSON.stringify(String(value));
  if (value === 0) return "0";
  let result = String(value);
  if (Math.abs(value) < 0.000001 || Math.abs(value) >= 1e21) result = value.toFixed(20);
  if (result.includes(".")) {
    let end = result.length;
    while (result[end - 1] === "0") end--;
    if (result[end - 1] === ".") end--;
    result = result.slice(0, end);
  }
  return result;
}

function visit(value, field) {
  switch (typeof value) {
    case "undefined": return undefined;
    case "string": return JSON.stringify(value.normalize("NFC"));
    case "boolean": return value ? "true" : "false";
    case "number": return decimal(value);
    case "object": break;
    default: throw new TypeError("unencodable " + typeof value);
  }
  if (value === null) return "null";
  if (Array.isArray(value)) {
    const encoded = [];
    for (const item of value) {
      const result = visit(item);
      if (result !== undefined) encoded.push(result);
    }
    const items = SET_FIELDS.has(field) ? Array.from(new Set(encoded)).sort() : encoded;
    return `[${items.join(",")}]`;
  }
  const members = [];
  // Keys retain their original Unicode bytes; only string values normalize.
  for (const key of Object.keys(value).sort()) {
    const result = visit(value[key], key);
    if (result !== undefined) members.push(JSON.stringify(key) + ":" + result);
  }
  return `{${members.join(",")}}`;
}

const canonicalEncode = value => visit(value);
module.exports = { canonicalEncode, encode: canonicalEncode, decimal, VERSION };
