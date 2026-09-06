"use strict";

// Standalone real-browser proof of the browser-only bundle. Dependencies may
// be resolved normally, or from the operator's installed tool runtime. No
// install/download is attempted and no generated key is written to disk.
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), http = require("node:http");
const crypto = require("../crypto.cjs"), protocol = require("../public-client.cjs");
const fixtures = require("./contract-v1.json");
function option(name) { const at = process.argv.indexOf(name); return at < 0 ? undefined : process.argv[at + 1]; }
function installed(name, flag) { const supplied = option(flag); return require(supplied ? path.resolve(supplied) : name); }

async function run() {
  const esbuild = installed("esbuild", "--esbuild-path"), playwright = installed("playwright", "--playwright-path");
  const bundled = esbuild.buildSync({ entryPoints: [path.resolve(__dirname, "../public-client.cjs")],
    platform: "browser", format: "iife", globalName: "PublicBoundary", bundle: true, write: false });
  const bundle = bundled.outputFiles[0].text;
  assert(!bundle.includes("node:crypto"), "browser bundle imports a native signing module");
  const key = crypto.generateSigningKey("browser-run"), pub = crypto.publicKeyOf(key);
  const op = { athlete_id: "browser-athlete", device_id: "browser-device", device_seq: 1, op_id: "browser-op",
    payload: { lb: { value: 165, unit: "lb" } } };
  op.canonical_content_commitment = crypto.commitmentOf(op, "synthetic-browser-identity");
  const wire = { wire_version: protocol.WIRE_VERSION, key_epoch: key.kid };
  const scope = { athlete_id: op.athlete_id, device_id: op.device_id };
  const receipt = crypto.signReceipt({ seq: 1, op_id: op.op_id, op,
    canonical_content_commitment: op.canonical_content_commitment, accepted_at: "2026-09-03T12:00:00Z" }, key);
  const data = { publicKey: pub, op, fixtures,
    signedDomains: Object.keys(crypto.DOMAINS).map(kind => ({ kind,
      record: crypto["sign" + kind[0].toUpperCase() + kind.slice(1)]({ text: "Cafe\u0301", causal_parents: ["b", "a", "b"] }, key) })),
    disposition: crypto.signDisposition({ op_id: op.op_id, device_id: op.device_id, device_seq: op.device_seq,
      canonical_content_commitment: op.canonical_content_commitment, status: "ACCEPTED", athlete_log_seq: 1 }, key),
    pull: crypto.signPull({ ...wire, ...scope, after: 0, through: 1, receipts: [receipt] }, key),
    snapshot: crypto.signSnapshot({ ...wire, ...scope, W: 1, records: 1, entries: [receipt] }, key),
    lease: crypto.signLease({ ...scope, lease_id: "browser-lease", schema_version: 1, range: [1, 64],
      not_before: "2026-09-01T00:00:00Z", not_after: "2026-10-01T00:00:00Z" }, key),
  };
  const browserTest = async function (input) {
    const check = (condition, label) => { if (!condition) throw new Error(label); };
    check(globalThis.isSecureContext && !!crypto.subtle, "secure browser WebCrypto unavailable");
    const { createPublicVerifier, createPublicBoundary, canonicalBytes } = PublicBoundary;
    const verifier = createPublicVerifier({ keys: [input.publicKey] });
    for (const vector of input.fixtures.canonicalVectors) {
      const bytes = canonicalBytes(vector.record, vector.domain, vector.field);
      check(Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("") === vector.utf8Hex, "browser canonical bytes disagree");
    }
    for (const signed of input.signedDomains) {
      const method = "verify" + signed.kind[0].toUpperCase() + signed.kind.slice(1);
      check(await verifier[method](signed.record), "native/browser signature disagreement: " + signed.kind);
      check(!await verifier[method]({ ...signed.record, text: "tampered" }), "tampered signature passed");
    }
    const state = { outbox: 1, frontier: 0, snapshot: null, lease: null, time: null };
    const boundary = createPublicBoundary({ keys: [input.publicKey], athleteId: input.op.athlete_id, deviceId: input.op.device_id,
      client: {
        deliverDisposition: () => { state.outbox = 0; return { stored: true }; },
        deliverReceipts: rows => { state.frontier = rows.at(-1)?.seq || state.frontier; return state.frontier; },
        receiveSnapshot: snapshot => { state.snapshot = snapshot; return { stored: true }; },
        receiveLease: lease => { state.lease = lease; return { stored: true }; },
        syncedServerTime: time => { state.time = time; return { confirmed: true }; },
      } });
    check(!(await boundary.acceptDisposition({ ...input.disposition, authority_signature: "unsigned" }, input.op)).accepted, "unsigned disposition passed");
    check(state.outbox === 1 && state.frontier === 0, "unsigned disposition changed state");
    check(!(await boundary.acceptPull({ ...input.pull, through: 2 })).accepted, "tampered pull passed");
    check(state.frontier === 0, "tampered pull advanced frontier");
    check(!(await boundary.acceptSnapshot({ ...input.snapshot, records: 2 }, 1)).accepted, "tampered snapshot passed");
    check(state.snapshot === null, "tampered snapshot published");
    check(!(await boundary.acceptLease({ ...input.lease, schema_version: 2 })).accepted, "tampered lease passed");
    check(state.lease === null, "tampered lease published");
    check((await boundary.acceptDisposition(input.disposition, input.op)).accepted && state.outbox === 0, "verified disposition was not committed");
    check((await boundary.acceptPull(input.pull)).accepted && state.frontier === 1, "verified pull was not committed");
    check((await boundary.acceptSnapshot(input.snapshot, 1)).accepted, "verified snapshot refused");
    check((await boundary.acceptLease(input.lease)).accepted, "verified lease refused");
    const challenge = boundary.beginTimeChallenge();
    const response = await fetch("/time", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(challenge) });
    const time = await response.json();
    check(!(await boundary.acceptServerTime({ ...time, time_profile: "future" })).accepted, "tampered time passed");
    check(state.time === null, "tampered time published");
    check((await boundary.acceptServerTime(time)).accepted && !!state.time, "verified challenge time refused");
    check(!(await boundary.acceptServerTime(time)).accepted, "time challenge replay passed");
    return { domains: input.signedDomains.length, outbox: state.outbox, frontier: state.frontier, userAgent: navigator.userAgent };
  };
  const server = http.createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    if (request.method === "POST" && request.url === "/time") {
      let body = "";
      for await (const chunk of request) body += chunk;
      let challenge;
      try { challenge = JSON.parse(body).challenge; } catch (_) { /* reject malformed test request */ }
      if (!/^[A-Za-z0-9_-]{43}$/.test(challenge || "")) { response.writeHead(400); response.end(); return; }
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(crypto.signServerTime({ ...wire, ...scope, time_profile: protocol.TIME_PROFILE,
        challenge, server_time: "2026-09-03T12:00:00Z" }, key)));
      return;
    }
    if (request.method !== "GET" || request.url !== "/") { response.writeHead(404); response.end(); return; }
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    const script = `(${browserTest.toString()})(${JSON.stringify(data)}).then(result=>{window.testResult={ok:true,...result};document.body.textContent="PUBLIC-BROWSER PASS";}).catch(error=>{window.testResult={ok:false,error:error.message};document.body.textContent="PUBLIC-BROWSER FAIL";});`;
    response.end("<!doctype html><meta charset=utf-8><title>Public signature browser verification</title><body>Running<script>" + bundle + "\n" + script + "</script>");
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    const executablePath = option("--browser-executable");
    const channel = !executablePath && process.platform === "win32" && !fs.existsSync(playwright.chromium.executablePath()) ? "msedge" : undefined;
    browser = await playwright.chromium.launch({ headless: true, ...(executablePath ? { executablePath } : channel ? { channel } : {}) });
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:" + server.address().port + "/");
    await page.waitForFunction(() => !!window.testResult, null, { timeout: 15000 });
    const result = await page.evaluate(() => window.testResult);
    assert.equal(result.ok, true, result.error);
    assert.equal(result.domains, 6); assert.equal(result.outbox, 0); assert.equal(result.frontier, 1);
    const line = "PUBLIC-BROWSER PASS (6 native/browser signed domains; esbuild browser-only bundle; tampered state untouched; single-use time)";
    console.log(line);
    console.log("PUBLIC-BROWSER ENGINE " + await browser.version());
    return line;
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
if (require.main === module) run().catch(error => { console.error("PUBLIC-BROWSER FAIL " + error.message); process.exitCode = 1; });
module.exports = { run };
