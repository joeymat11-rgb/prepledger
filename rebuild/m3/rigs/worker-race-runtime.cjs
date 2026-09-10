"use strict";

// Disposable, loopback-only rig RPC. This entry is never a production route.
// Each request constructs an independent bridge with the native Worker D1
// binding; there is no authority singleton, request queue or in-process lock.
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const { createRequire } = require("node:module");
const w5Directory = path.resolve(__dirname, "../w5");
const dependency = createRequire(path.join(w5Directory, "package.json"));
const wrangler = createRequire(dependency.resolve("wrangler/package.json"));
const { buildCore } = require("../w5/build.cjs");
let bundlePromise;

function bundledWorker() {
  if (!bundlePromise) bundlePromise = (async () => {
    await buildCore();
    const result = await dependency("esbuild").build({
      stdin: { resolveDir: w5Directory, sourcefile: "workerd-race-rig-entry.mjs", contents: `
        import { createBridge } from './bridge.cjs';
        import { storageFromTestBinding } from '../rigs/p1-workerd-provider.cjs';
        export default { async fetch(request, env) {
          const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
          if (request.method !== 'POST' || new URL(request.url).pathname !== '/rig-invoke')
            return new Response(JSON.stringify({ error: 'RIG_ROUTE_NOT_FOUND' }), { status: 404, headers });
          try {
            const input = await request.json();
            if (!input || typeof input.method !== 'string' || !Array.isArray(input.args))
              return new Response(JSON.stringify({ error: 'RIG_BAD_REQUEST' }), { status: 400, headers });
            const bridge = createBridge({ db: env.DB, authorityKey: JSON.parse(env.AUTHORITY_KEY),
              identityKeys: JSON.parse(env.IDENTITY_KEYS), clock: () => env.CLOCK_ISO,
              ...(env.P1_TEST_KEY ? {storage:await storageFromTestBinding(env.P1_TEST_KEY)} : {}) });
            const result = await bridge.invoke(input.method, input.args);
            return new Response(JSON.stringify({ result }), { status: 200, headers });
          } catch (_) {
            return new Response(JSON.stringify({ error: 'RIG_EXECUTION_FAILED' }), { status: 500, headers });
          }
        } };
      ` },
      bundle: true, platform: "node", format: "esm", write: false, logLevel: "silent",
      banner: { js: "import * as w5NodeCrypto from 'node:crypto'; const require = name => { if (name === 'node:crypto') return w5NodeCrypto; throw new Error('Unsupported bundled builtin'); };" },
    });
    return result.outputFiles[0].text;
  })();
  return bundlePromise;
}

async function createRaceRuntime({ authorityKey, identityKeys, clockISO, p1TestKey }) {
  if (!authorityKey || !identityKeys || typeof identityKeys !== "object" || Array.isArray(identityKeys) ||
      typeof clockISO !== "string" || !Number.isFinite(Date.parse(clockISO)))
    throw new TypeError("Race runtime requires per-run signing key, athlete identity-key map and ISO clock");
  if (wrangler("./package.json").version !== "4.129.0") throw new Error("Wrangler 4.129.0 required");
  const { Miniflare, Log, LogLevel, convertV4MiniflareOptions } = wrangler("miniflare");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "earned-w5-worker-race-"));
  const mf = new Miniflare(await convertV4MiniflareOptions({ modules: true, script: await bundledWorker(),
    compatibilityDate: "2026-09-03", compatibilityFlags: ["nodejs_compat"], host: "127.0.0.1", port: 0,
    // Use the same resource identity as local-d1.cjs, so its explicit disk
    // reopen check can inspect this database after the Worker is disposed.
    d1Databases: { DB: "earned-w5-local" }, resourcePersistencePath: directory,
    bindings: { AUTHORITY_KEY: JSON.stringify(authorityKey), IDENTITY_KEYS: JSON.stringify(identityKeys), CLOCK_ISO: clockISO,
      ...(p1TestKey ? {P1_TEST_KEY:p1TestKey} : {}) },
    log: new Log(LogLevel.ERROR), telemetry: { enabled: false }, cf: false,
  }));
  let closed = false;
  const close = async () => { if (!closed) { closed = true; await mf.dispose(); } };
  try {
    const db = await mf.getD1Database("DB");
    const migration = fs.readFileSync(path.join(w5Directory, "migrations/0001_authority.sql"), "utf8").replace(/--[^\n]*/g, "");
    await db.batch(migration.split(";").map(sql => sql.trim()).filter(Boolean).map(sql => db.prepare(sql)));
    if(p1TestKey)await require('./p1-test-profile.cjs').provision(db);
    return { db, directory, close,
      async invoke(method, args = []) {
        if (closed) throw new Error("Race runtime is closed");
        const response = await mf.dispatchFetch("http://127.0.0.1/rig-invoke", { method: "POST",
          headers: { "Content-Type": "application/json" }, body: JSON.stringify({ method, args }) });
        if (response.status !== 200) throw new Error("workerd race invocation refused (HTTP " + response.status + ")");
        return (await response.json()).result;
      },
    };
  } catch (error) { await close(); throw error; }
}

module.exports = { createRaceRuntime };
