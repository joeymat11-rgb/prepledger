"use strict";
// Test-only mapping of the accepted fixture convention to genuine P-256 leases
// and async D1 calls. No RPC route is added to the product for test-only methods.
const path = require("node:path"), fs = require("node:fs"), Module = require("node:module");
const { verifyLease: verifyFixtureLease } = require("../../authority/crypto.cjs");
const { copy } = require("../../authority/store.cjs");
const { AUTH_KEY, K_IDENTITY } = require("../../conform/lib/ops.cjs");
const NOW = "2026-09-03T00:00:00Z";

function loadPublicCore(authorityRoot, cryptoPath) {
  const cache = new Map(), boundary = path.join(authorityRoot, "crypto.cjs");
  function load(filename) {
    filename = path.resolve(filename);
    if (filename === boundary) filename = cryptoPath;
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = new Module(filename, module);
    mod.filename = filename; mod.paths = Module._nodeModulePaths(path.dirname(filename)); cache.set(filename, mod);
    mod.require = function (id) {
      if (id.startsWith(".")) return load(require.resolve(path.resolve(path.dirname(filename), id)));
      return require(id);
    };
    mod._compile(fs.readFileSync(filename, "utf8"), filename);
    return mod.exports;
  }
  return { core: load(path.join(authorityRoot, "index.cjs")), crypto: load(cryptoPath) };
}

async function makeHarness(options = {}) {
  const authorityRoot = options.authorityRoot || path.resolve(__dirname, "../../authority");
  const cryptoPath = options.cryptoPath || path.resolve(__dirname, "../w5/crypto.cjs");
  const loaded = loadPublicCore(authorityRoot, cryptoPath), publicCrypto = loaded.crypto;
  const authorityKey = publicCrypto.generateSigningKey("mapped-law-run"), publicKey = publicCrypto.publicKeyOf(authorityKey);
  const runtimes = [], metrics = { invocations: 0, authorities: 0 };
  const createLocalD1 = options.createLocalD1 || require("../w5/local-d1.cjs").createLocalD1;
  const createBridge = options.createBridge || require("../w5/bridge.cjs").createBridge;
  const convertLease = (lease, athlete) => {
    if (!verifyFixtureLease(lease, AUTH_KEY)) return copy(lease);
    const { signature, ...record } = lease;
    return publicCrypto.signLease({ ...record, ...(athlete ? { athlete_id: athlete } : {}) }, authorityKey);
  };
  async function afterLaw() {
    for (const runtime of runtimes.splice(0)) await runtime.close();
  }
  const bundle = {
    afterLaw,
    async authority(cfg) {
      const athletes = copy(cfg.athletes || {});
      for (const [athlete, setup] of Object.entries(athletes)) {
        setup.plan = { protein_g: 150, steps: 8000, ...setup.plan };
        for (const device of Object.values(setup.devices || {})) device.lease = convertLease(device.lease, athlete);
      }
      const runtime = await createLocalD1(); runtimes.push(runtime); metrics.authorities++;
      let fault = null;
      const bridge = createBridge({ db: runtime.db, authorityKey, identityKeys: () => K_IDENTITY,
        clock: () => NOW, core: loaded.core,
        backendFactory: backend => ({ ...backend, put(key, value) {
          const [, table] = JSON.parse(key);
          if (table === "transactions" && (fault === "between-admission-and-plan-transaction" && value.kind === "plan-mutation" ||
              fault === "between-admission-and-selection-commit" && value.kind === "conflict-selection")) throw new Error("storage write interrupted");
          backend.put(key, value);
        } }),
      });
      await bridge.initialize(athletes);
      const special = {
        injectCrash(point) { fault = point; }, clearCrash() { fault = null; },
        verifyDisposition(record) { return publicCrypto.verifyDisposition(record, publicKey); },
        async localCommitter(lease, clock = {}) {
          // The phone receives the actual async D1 lease result. Every variant
          // (forged, wrong binding, expiry, schema) is stored as its synthetic
          // fixture in a separate local D1, so none skips the durable boundary.
          const capability = convertLease(lease), capabilityRuntime = await createLocalD1();
          runtimes.push(capabilityRuntime);
          const capabilityBridge = createBridge({ db: capabilityRuntime.db, authorityKey, identityKeys: () => K_IDENTITY,
            clock: () => NOW, core: loaded.core });
          await capabilityBridge.initialize({ [capability.athlete_id]: { devices: { [capability.device_id]: { lease: capability } } } });
          const deliveredLease = await capabilityBridge.invoke("lease", [capability.athlete_id, capability.device_id]);
          metrics.invocations++;
          const local = loaded.core.createAuthority({ athletes: {}, authorityKey: publicKey, identityKeys: () => K_IDENTITY, clock: () => NOW })
            .localCommitter(deliveredLease, { mono: NOW, ...clock });
          return { ...local, syncedServerTime(time) { return local.syncedServerTime(publicCrypto.signServerTime({ server_time: time }, authorityKey)); } };
        },
      };
      return new Proxy(special, { get(target, name) {
        if (name === "then") return undefined;
        if (name in target) return target[name];
        return async (...args) => { metrics.invocations++; return bridge.invoke(name, args); };
      } });
    },
  };
  return { bundle, metrics, close: afterLaw };
}
module.exports = { makeHarness, loadPublicCore };
