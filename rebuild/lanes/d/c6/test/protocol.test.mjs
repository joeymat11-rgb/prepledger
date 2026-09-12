import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseSessionRequest, validateProviderResult, errorResponse, ProtocolError } from "../protocol.mjs";

const examples = JSON.parse(readFileSync(new URL("../wire/examples.json", import.meta.url), "utf8"));
const request = () => structuredClone(examples.requests[0]);
const NONCE = examples.requests[0].nonce;
const encode = (value) => JSON.stringify(value);
function refuses(text, code = "COACH_REQUEST_INVALID", nonce = NONCE) {
  assert.throws(() => parseSessionRequest(text), (error) => {
    assert.ok(error instanceof ProtocolError);
    assert.equal(error.code, code);
    assert.equal(error.message, code);
    assert.equal(error.nonce, nonce);
    return true;
  });
}

test("both named synthetic requests retain exactly their four and five fields", () => {
  for (const value of examples.requests) {
    const parsed = parseSessionRequest(encode(value));
    assert.deepEqual(parsed, value);
    assert.equal(Object.getPrototypeOf(parsed), Object.prototype);
    assert.equal(Object.getPrototypeOf(parsed.opt_in), Object.prototype);
    assert.equal(Object.keys(parsed).length, 4);
    assert.equal(Object.keys(parsed.opt_in).length, 5);
  }
});

test("duplicate root and nested keys refuse before their overwritten value can be used", () => {
  refuses(encode(request()).replace('"user":"joe"', '"user":"dad","user":"joe"'));
  refuses(encode(request()).replace('"accepted":true', '"accepted":false,"accepted":true'));
});

test("escaped equivalent object keys are duplicate keys", () => {
  refuses(encode(request()).replace('"accepted":true', '"accepted":false,"\\u0061ccepted":true'));
  refuses(encode(request()).replace('"nonce":', '"\\u006eonce":"00000000-0000-4000-8000-000000000002","nonce":'),
    "COACH_REQUEST_INVALID", null);
});

test("duplicate nonce never reflects either candidate even when both are valid", () => {
  refuses(encode(request()).replace('"nonce":', '"nonce":"00000000-0000-4000-8000-000000000002","nonce":'),
    "COACH_REQUEST_INVALID", null);
});

test("key-like text, escaped quotes and braces inside a value are ordinary strings", () => {
  const value = request();
  value.opt_in.wording = 'Synthetic \\ "accepted":false, "accepted":true } [ text';
  assert.deepEqual(parseSessionRequest(encode(value)), value);
});

test("malformed JSON and non-string inputs have no nonce echo", () => {
  for (const value of [null, {}, 7, "", "{", "{} false", encode(request()).slice(0, -1),
    encode(request()).replace('"joe"', '"jo\\qe"'), "\uFEFF" + encode(request())]) {
    refuses(value, "COACH_REQUEST_INVALID", null);
  }
});

test("root shape is closed and all four members are required", () => {
  for (const field of ["model", "tools", "cap", "provider", "instructions", "backend", "__proto__"]) {
    const value = request();
    Object.defineProperty(value, field, { value: "synthetic", enumerable: true });
    refuses(encode(value));
  }
  for (const field of Object.keys(request())) {
    const value = request();
    delete value[field];
    refuses(encode(value), "COACH_REQUEST_INVALID", field === "nonce" ? null : NONCE);
  }
  for (const value of [null, [], 1, "request"]) refuses(encode(value), "COACH_REQUEST_INVALID", null);
});

test("unknown users and malformed nonces refuse; an invalid nonce is never reflected", () => {
  for (const user of ["Joe", "guest", null, {}, 1]) refuses(encode({ ...request(), user }));
  for (const nonce of ["", null, 1, {}, NONCE.toUpperCase().replace("4000", "4ABC"),
    NONCE.replace("4000", "5000"), NONCE.replace("8000", "7000"), NONCE + "\n"]) {
    refuses(encode({ ...request(), nonce }), "COACH_REQUEST_INVALID", null);
  }
});

test("opt-in is a closed five-member object with matching user and boolean true", () => {
  for (const opt_in of [null, [], true, "yes", { ...request().opt_in, extra: true }]) {
    refuses(encode({ ...request(), opt_in }), "COACH_OPT_IN_REQUIRED");
  }
  for (const field of Object.keys(request().opt_in)) {
    const value = request();
    delete value.opt_in[field];
    refuses(encode(value), "COACH_OPT_IN_REQUIRED");
  }
  for (const patch of [{ user: "dad" }, { accepted: "true" }, { accepted: 1 }, { accepted: false },
    { screen_version: 1 }, { screen_version: "" }, { wording: {} }, { wording: "" }]) {
    const value = request();
    Object.assign(value.opt_in, patch);
    refuses(encode(value), "COACH_OPT_IN_REQUIRED");
  }
});

test("accepted_at must be a real calendar date in exact UTC millisecond form", () => {
  for (const accepted_at of ["2030-02-29T09:30:00.000Z", "2032-02-30T09:30:00.000Z",
    "2030-04-31T09:30:00.000Z", "2030-02-01T24:00:00.000Z", "2030-02-01T09:30:60.000Z",
    "2030-02-01T09:30:00Z", "2030-02-01T09:30:00.00Z", "2030-02-01T09:30:00.000+00:00",
    "2030-02-01T09:30:00.000Z\n", null, 0]) {
    const value = request();
    value.opt_in.accepted_at = accepted_at;
    refuses(encode(value), "COACH_OPT_IN_REQUIRED");
  }
  const value = request();
  value.opt_in.accepted_at = "2032-02-29T09:30:00.000Z";
  assert.deepEqual(parseSessionRequest(encode(value)), value);
});

test("decoded SDP is nonempty and bounded by UTF-8 bytes, not character count", () => {
  for (const sdp_offer of [null, 1, "", "x".repeat(65537), "\u00e9".repeat(32769), "\ud83d\ude80".repeat(16385)]) {
    refuses(encode({ ...request(), sdp_offer }));
  }
  for (const sdp_offer of ["x".repeat(65536), "\u00e9".repeat(32768), "\ud83d\ude80".repeat(16384)]) {
    assert.equal(parseSessionRequest(encode({ ...request(), sdp_offer })).sdp_offer, sdp_offer);
  }
});

test("the whole JSON body has a 98304-byte UTF-8 boundary including syntax and whitespace", () => {
  const text = encode(request());
  const room = 98304 - Buffer.byteLength(text);
  assert.deepEqual(parseSessionRequest(text + " ".repeat(room)), request());
  refuses(text + " ".repeat(room + 1), "COACH_REQUEST_INVALID", null);
  const value = request();
  value.opt_in.wording = "\u00e9".repeat(50000);
  refuses(encode(value), "COACH_REQUEST_INVALID", null);
});

test("provider results are closed, retain an opaque id and enforce the decoded SDP bound", () => {
  const value = { sessionId: "synthetic opaque id", sdpAnswer: "\u00e9".repeat(32768) };
  assert.deepEqual(validateProviderResult(value), value);
  for (const bad of [null, [], {}, { ...value, token: "synthetic" }, { ...value, sessionId: "" },
    { ...value, sessionId: 1 }, { ...value, sdpAnswer: "" }, { ...value, sdpAnswer: null },
    { ...value, sdpAnswer: "\u00e9".repeat(32769) }]) {
    assert.throws(() => validateProviderResult(bad), (error) => error instanceof ProtocolError
      && error.code === "COACH_RELAY_UNAVAILABLE" && error.nonce === null);
  }
});

test("all nine fixed errors use their pinned HTTP status and no-store JSON envelope", async () => {
  for (const [code, status] of Object.entries(examples._meta.http_status_by_code)) {
    const response = errorResponse(code, NONCE, 200);
    assert.equal(response.status, status);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("Content-Type"), "application/json; charset=utf-8");
    assert.deepEqual(await response.json(), { ok: false, code, nonce: NONCE });
  }
});

test("unknown error values become fixed unavailable responses without upstream text", async () => {
  for (const code of ["upstream synthetic detail", "__proto__", "toString", new Error("synthetic detail"), null, 4]) {
    const response = errorResponse(code, "not a nonce", 418);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { ok: false, code: "COACH_RELAY_UNAVAILABLE", nonce: null });
  }
});

test("error nonce filtering does not depend on error code", async () => {
  for (const code of Object.keys(examples._meta.http_status_by_code)) {
    for (const nonce of [undefined, null, "invalid", NONCE + "\n", { nonce: NONCE }]) {
      assert.equal((await errorResponse(code, nonce).json()).nonce, null);
    }
  }
});
