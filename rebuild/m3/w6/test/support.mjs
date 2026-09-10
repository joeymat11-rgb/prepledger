import { IDBFactory } from "fake-indexeddb";
import { webcrypto } from "node:crypto";
import { createRequire } from "node:module";
import { openRepository } from "../repository.mjs";
import { createBridge } from "../bridge.mjs";
const require = createRequire(import.meta.url);
export const Client = require("../../../client/index.cjs");
export const O = require("../../../conform/lib/ops.cjs");
export const { createT2Stage } = require("../t2-stage.cjs");

export function deferred() { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; }
export function config() {
  return { deviceId: "dev-A", athleteId: "ath-1", identityKey: O.K_IDENTITY, authorityKey: O.AUTH_KEY,
    clock: { now: () => "2026-09-04T00:00:00Z", today: () => "2026-09-04", tz: "+00:00", monotonicMs: () => 0 },
    lease: O.lease("dev-A"), online: false, contract: { client: "1", required: "1" }, standing: "enrolled" };
}
export function initial() {
  return { collections: { meta: { checkpoint: { counts: { ops: 0, outbox: 0 } } },
    sync: { snapshot: { plan: {}, reads: ["2026-09-04"] }, frontier: { W: 0, authorityW: 0 } },
    futureCollection: { unchanged: { nested: [1, { evidence: "synthetic-only" }] } } },
    metadata: { schema: 1, checkpoint: "synthetic", budget: { used: 0 }, leaseHistory: ["synthetic-only"] } };
}
export async function fixture(options = {}) {
  const indexedDB = options.indexedDB || new IDBFactory();
  const key = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const setup = { indexedDB, crypto: webcrypto, databaseName: "w6-synthetic", namespace: "synthetic-athlete/device-A",
    keyProvider: () => key, authorizeEnrollment: evidence => evidence === "synthetic-enrollment-only", ...options };
  const repo = await openRepository(setup);
  const stage = createT2Stage(config);
  return { indexedDB, key, setup, repo, stage, bridge: createBridge({ repository: repo, stage, validateCommit: () => null }),
    async seed() { await repo.initialize(initial(), "synthetic-enrollment-only"); },
    async fresh() { const repository = await openRepository(setup); return { repository, bridge: createBridge({ repository, stage, validateCommit: () => null }) }; } };
}
export async function mutateActive(indexedDB, mutator) {
  const db = await new Promise((resolve, reject) => { const request = indexedDB.open("w6-synthetic", 1); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
  await new Promise((resolve, reject) => {
    const tx = db.transaction("generations", "readwrite"), store = tx.objectStore("generations"), request = store.get("active");
    request.onsuccess = () => { const next = mutator(request.result); if (next === undefined) store.delete("active"); else store.put(next, "active"); };
    tx.oncomplete = resolve; tx.onabort = () => reject(tx.error);
  }); db.close();
}

// Faults are injected at the IDB API, outside product code. Delayed transactions remain genuinely active.
export function faultDatabase() {
  const inner = new IDBFactory();
  const state = { armed: false, mode: null, tx: null, write: deferred(), release: false };
  const indexedDB = { open(...args) {
    const request = inner.open(...args);
    request.addEventListener("success", () => {
      const db = request.result, original = db.transaction.bind(db);
      db.transaction = (...txArgs) => {
        const tx = original(...txArgs);
        if (txArgs[1] !== "readwrite" || !state.armed) return tx;
        state.tx = tx;
        const store = tx.objectStore("generations"), originalPut = store.put.bind(store);
        store.put = (value, key) => {
          if (key === "active") {
            state.write.resolve();
            if (state.mode === "quota") throw new DOMException("Synthetic quota fault", "QuotaExceededError");
          }
          return originalPut(value, key);
        };
        const objectStore = tx.objectStore.bind(tx);
        tx.objectStore = name => name === "generations" ? store : objectStore(name);
        if (state.mode === "delay") {
          const keepAlive = () => {
            if (state.release) return;
            try { const hold = store.get("active"); hold.onsuccess = keepAlive; } catch {}
          };
          keepAlive();
        }
        return tx;
      };
    });
    return request;
  } };
  return { indexedDB, inner, state };
}
