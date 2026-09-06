import test from "node:test";
import assert from "node:assert/strict";
import { parseStrictJson } from "../strict-json.mjs";

const bytes = value => new TextEncoder().encode(value);
const refuses = (value, code = "STRICT_JSON_SYNTAX") => assert.throws(() => parseStrictJson(value), error => {
  assert.equal(error.constructor, Error);
  assert.equal(error.code, code);
  assert.equal(error.message, code);
  return true;
});

test("duplicate decoded keys are rejected at every nesting depth", () => {
  for (const text of [
    '{"a":1,"a":2}', '{"outer":{"a":1,"a":2}}', '[{"a":1,"a":2}]',
    '{"a":1,"\\u0061":2}', '{"\\u0061":1,"a":2}',
    '{"😀":1,"\\ud83d\\ude00":2}', '{"\\n":1,"\\u000a":2}',
    '{"__proto__":1,"__proto__":2}', '{"":1,"":2}', '{"\\ud800":1,"\\uD800":2}',
  ]) refuses(text, "STRICT_JSON_DUPLICATE_KEY");
});

test("sibling objects may reuse keys and insertion order is not sorted", () => {
  const text = '{"z":0,"a":1,"nested":{"second":2,"first":1},"items":[{"a":1},{"a":2}]}';
  const result = parseStrictJson(text);
  assert.deepEqual(Object.keys(result), ["z", "a", "nested", "items"]);
  assert.deepEqual(Object.keys(result.nested), ["second", "first"]);
  assert.equal(JSON.stringify(result), text);
  assert.deepEqual(parseStrictJson(bytes(text)), result);
  assert.deepEqual(parseStrictJson('{"10":10,"2":2,"z":0}'), JSON.parse('{"10":10,"2":2,"z":0}'));
});

test("prototype-like names remain ordinary own data properties without pollution", () => {
  const result = parseStrictJson('{"__proto__":{"injected":true},"constructor":4,"prototype":5}');
  assert.equal(Object.getPrototypeOf(result), Object.prototype);
  assert.equal(Object.hasOwn(result, "__proto__"), true);
  assert.deepEqual(result.__proto__, { injected: true });
  assert.equal(result.injected, undefined);
  assert.equal({}.injected, undefined);
  assert.equal(JSON.stringify(result), '{"__proto__":{"injected":true},"constructor":4,"prototype":5}');
});

test("escaped strings do not masquerade as structure; lone surrogates remain valid JSON strings", () => {
  const text = String.raw`{"quoted":"\\\"},[ : ","escaped":"\b\f\n\r\t\/\\\"","lone":"\ud800","keys":{"x\\\"y":1,"x\\y":2}}`;
  assert.deepEqual(parseStrictJson(text), JSON.parse(text));
  assert.equal(parseStrictJson(String.raw`"\ud800"`), "\ud800");
  assert.equal(parseStrictJson('"\ud800"'), "\ud800");
  assert.equal(parseStrictJson('"\u2028\u2029"'), "\u2028\u2029");
  assert.deepEqual(parseStrictJson('{"é":1,"é":2}'), { "é": 1, "é": 2 });
});

test("invalid UTF-8 and unsupported inputs fail with bounded content-free errors", () => {
  for (const invalid of [[0x22, 0xc3, 0x28, 0x22], [0x22, 0xed, 0xa0, 0x80, 0x22],
    [0x22, 0xc0, 0xaf, 0x22], [0xf0, 0x9f], [0x80]]) refuses(new Uint8Array(invalid), "STRICT_JSON_UTF8");
  for (const invalid of [null, undefined, 1, {}, [], new ArrayBuffer(0), new Uint16Array([1])]) {
    refuses(invalid, "STRICT_JSON_INPUT");
  }
  const buffer = bytes("junk{\"ok\":true}ignored");
  assert.deepEqual(parseStrictJson(buffer.subarray(4, 15)), { ok: true });
});

test("only JSON whitespace is accepted; a UTF-8 BOM is not silently stripped", () => {
  assert.deepEqual(parseStrictJson(" \t\r\n [1, true, null] \r\n"), [1, true, null]);
  for (const text of ["\ufeff{}", "\u00a0{}", "{}\u00a0", "\v{}", "\f{}"]) refuses(text);
  refuses(new Uint8Array([0xef, 0xbb, 0xbf, 0x7b, 0x7d]));
});

test("malformed strings, delimiters, comments, and trailing tokens are refused", () => {
  for (const text of ["", " ", "{", "[", "}", "]", "[1,]", '{"a":1,}', "[,1]", "[1 2]",
    '{a:1}', '{"a" 1}', '{"a":}', '{"a":1 "b":2}', "{} []", "truefalse", "null 0",
    "undefined", "NaN", "Infinity", "-Infinity", "/*comment*/{}", "[//comment\n1]", "'x'",
    '"unterminated', '"line\nfeed"', '"\u0000"', String.raw`"\x00"`, String.raw`"\v"`,
    String.raw`"\u12"`, String.raw`"\u12xz"`, '"ends\\', "[true}", '{"a":[1}]']) refuses(text);
});

test("number grammar and finite-value rule retain native JSON number semantics", () => {
  for (const text of ["+1", "01", "-01", ".5", "1.", "-", "1e", "1e+", "1e-", "--1", "0x10", "1_000"]) refuses(text);
  for (const text of ["1e400", "-1e400", '[0,{"n":1e400}]']) refuses(text, "STRICT_JSON_NONFINITE");
  for (const text of ["0", "-0", "1", "-1", "0.5", "-0.5", "1e+2", "1E-2", "1e-9999", "9007199254740993", "1.7976931348623157e308"]) {
    assert.ok(Object.is(parseStrictJson(text), JSON.parse(text)));
  }
});

test("explicit parser stack accepts deeply nested valid JSON without a new depth cap", () => {
  const depth = 20000;
  const result = parseStrictJson("[".repeat(depth) + "0" + "]".repeat(depth));
  let cursor = result;
  for (let n = 0; n < depth; n++) { assert.equal(cursor.length, 1); cursor = cursor[0]; }
  assert.equal(cursor, 0);
  refuses("[".repeat(depth) + '{"x":0,"\\u0078":1}' + "]".repeat(depth), "STRICT_JSON_DUPLICATE_KEY");
});

test("generated valid JSON round-trips through string and byte paths without reordering", () => {
  let seed = 19790629;
  const random = max => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; };
  const strings = ["", "plain", 'quote"slash\\', "\n\t\u0000", "😀", "é", "é", "\ud800", "__proto__"];
  const value = depth => {
    const choice = random(depth ? 6 : 4);
    if (choice === 0) return null;
    if (choice === 1) return random(2) === 1;
    if (choice === 2) return (random(200001) - 100000) / 10;
    if (choice === 3) return strings[random(strings.length)];
    if (choice === 4) return Array.from({ length: random(5) }, () => value(depth - 1));
    const result = Object.create(null);
    for (let n = 0, count = random(5); n < count; n++) result[`k${n}_${strings[random(strings.length)]}`] = value(depth - 1);
    return result;
  };
  for (let n = 0; n < 250; n++) {
    const text = JSON.stringify(value(4));
    const expected = JSON.parse(text);
    assert.deepEqual(parseStrictJson(text), expected);
    assert.deepEqual(parseStrictJson(bytes(text)), expected);
    assert.equal(JSON.stringify(parseStrictJson(text)), text);
  }
});
