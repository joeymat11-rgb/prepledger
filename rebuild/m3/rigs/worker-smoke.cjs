"use strict";

// Supplemental to rig190's real HTTP fault host: execute the same product
// Worker, bridge and unchanged authority bundle inside real workerd, with D1.
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const { createRequire } = require("node:module");
const { randomBytes } = require("node:crypto");
const directory = path.resolve(__dirname, "../w5");
const dependency = createRequire(path.join(directory, "package.json"));
const wrangler = createRequire(dependency.resolve("wrangler/package.json"));
const { createBridge } = require("../w5/bridge.cjs");
const { buildCore } = require("../w5/build.cjs");
const { generateSigningKey, publicKeyOf, signLease } = require("../w5/crypto.cjs");
const { createPublicBoundary, WIRE_VERSION } = require("../w5/public-client.cjs");
const { testIssuer } = require("./rig190.cjs");
const { build } = require("../../client/ops.cjs");
const NOW = "2026-09-04T16:00:00.000Z";

async function run(options = {}) {
  assert.equal(wrangler("./package.json").version, "4.129.0");
  const { Miniflare, Log, LogLevel, convertV4MiniflareOptions } = wrangler("miniflare");
  await buildCore();
  const bundle = await dependency("esbuild").build({
    stdin: { resolveDir: directory, sourcefile: "workerd-smoke-entry.mjs", contents: `
      import { createWorker } from './worker.cjs';
      import { createBridge } from './bridge.cjs';
      export default { fetch(request, env) {
        const authorityKey = JSON.parse(env.AUTHORITY_KEY);
        const bridge = createBridge({ db: env.DB, authorityKey,
          identityKeys: JSON.parse(env.IDENTITY_KEYS), clock: () => env.TEST_NOW });
        return createWorker({ bridge, authorityKey, auth: JSON.parse(env.AUTH_CONFIG),
          clock: () => env.TEST_NOW }).fetch(request);
      } };
    ` }, bundle: true, platform: "node", format: "esm", write: false, logLevel: "silent",
    banner: { js: "import * as w5NodeCrypto from 'node:crypto'; const require = name => { if (name === 'node:crypto') return w5NodeCrypto; throw new Error('Unsupported bundled builtin'); };" },
  });
  const authorityKey = generateSigningKey("workerd-smoke-run");
  const identityKeys = { first: randomBytes(32).toString("hex") }, issuer = testIssuer();
  const mf = new Miniflare(await convertV4MiniflareOptions({ modules: true, script: bundle.outputFiles[0].text,
    compatibilityDate: "2026-09-03", compatibilityFlags: ["nodejs_compat"],
    d1Databases: { DB: "earned-w5-workerd-smoke" },
    resourcePersistencePath: fs.mkdtempSync(path.join(os.tmpdir(), "earned-w5-workerd-")),
    bindings: { AUTHORITY_KEY: JSON.stringify(authorityKey), IDENTITY_KEYS: JSON.stringify(identityKeys),
      AUTH_CONFIG: JSON.stringify(issuer.config), TEST_NOW: NOW },
    log: new Log(LogLevel.ERROR), telemetry: { enabled: false }, cf: false,
  }));
  try {
    const db = await mf.getD1Database("DB");
    const migration = fs.readFileSync(path.join(directory, "migrations/0001_authority.sql"), "utf8").replace(/--[^\n]*/g, "");
    await db.batch(migration.split(";").map(sql => sql.trim()).filter(Boolean).map(sql => db.prepare(sql)));
    const lease = signLease({ lease_id: "lease-workerd", athlete_id: "first", device_id: "workerd",
      schema_version: 1, range: [1, 100], not_before: "2026-09-01T00:00:00.000Z",
      not_after: "2026-10-01T00:00:00.000Z", issued_server_time: "2026-09-01T00:00:00.000Z" }, authorityKey);
    const bridge = createBridge({ db, authorityKey, identityKeys, clock: () => NOW });
    await bridge.initialize({ first: { plan: { protein_g: 150, steps: 8000 }, devices: { workerd: { lease } } } }, { "clerk-first": "first" });
    const operation = build({ op_id: "workerd-op-1", athlete_id: "first", device_id: "workerd", device_seq: 1,
      predecessor: null, parents: [], kind: "fact", class: "reading", lease_id: lease.lease_id,
      effective: { local_date: "2026-09-04", local_time: "12:00", utc_offset: "-04:00" },
      payload: { lb: { value: 160, unit: "lb" }, source: "athlete" } }, identityKeys.first);
    let drains = 0, frontier = 0, times = 0;
    const client = createPublicBoundary({ keys: [publicKeyOf(authorityKey)], athleteId: "first", deviceId: "workerd", client: {
      receiveLease() {},
      deliverDisposition(disposition) { assert.equal(disposition.status, "ACCEPTED"); drains++; },
      deliverReceipts(rows) { for (const row of rows) { assert.equal(row.seq, frontier + 1); frontier++; } },
      syncedServerTime() { times++; },
    } });
    const request = async (route, body, token = issuer.token("clerk-first")) => {
      const response = await mf.dispatchFetch("http://worker.local" + route, { method: "POST", headers: {
        "Content-Type": "application/json", Origin: issuer.config.origins[0], Authorization: "Bearer " + token,
      }, body: JSON.stringify({ device_id: "workerd", ...body }) });
      assert.equal(response.headers.get("earned-wire-version"), WIRE_VERSION);
      assert.match(response.headers.get("cache-control"), /no-store/);
      return { status: response.status, body: await response.json() };
    };
    const enrolled = await request("/enrol", {});
    assert.equal(enrolled.status, 200);
    assert.equal((await client.acceptLease(enrolled.body.lease)).accepted, true);
    const admitted = await request("/op", { operation });
    assert.equal(admitted.status, 200);
    assert.equal((await client.acceptDisposition(admitted.body.disposition, operation)).accepted, true);
    assert.equal(drains, 1);
    const replay = await request("/op", { operation });
    assert.equal(replay.status, 200); assert.deepEqual(replay.body.disposition, admitted.body.disposition);
    assert.equal(await bridge.invoke("frontier", ["first"]), 1);
    const pull = await request("/pull", { after: 0 });
    assert.equal(pull.status, 200); assert.equal((await client.acceptPull(pull.body)).accepted, true); assert.equal(frontier, 1);
    const time = await request("/time", client.beginTimeChallenge());
    assert.equal(time.status, 200); assert.equal((await client.acceptServerTime(time.body)).accepted, true); assert.equal(times, 1);
    assert.equal((await client.acceptServerTime(time.body)).accepted, false);
    const denied = await request("/op", { operation }, issuer.token("clerk-first", { aud: "wrong" }));
    assert.equal(denied.status, 401); assert.equal(await bridge.invoke("frontier", ["first"]), 1);
    if (!options.quiet) console.log("WORKER-WORKERD PASS (bundled Worker + nodejs_compat + local D1 + RS256 auth + P-256 signatures + replay)");
    return { ok: true, runtime: "workerd", d1: true };
  } finally { await mf.dispose(); }
}

module.exports = { run };
if (require.main === module) run().catch(error => { console.error("WORKER-WORKERD FAIL " + error.message); process.exitCode = 1; });
