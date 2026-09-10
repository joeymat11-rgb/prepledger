"use strict";
// Synthetic public contract exercises shared by Node baseline and browser bundle.
function runActionVectors(Client, O) {
  const cases = [];
  const scenarios = [
    { name: "weigh-dated", actions: [["weighIn", { date: "2026-09-04", lb: 170.6 }]] },
    { name: "weigh-undated", actions: [["weighIn", { lb: 170.6 }]] },
    { name: "set", actions: [["logSet", { lift: "Café\ud800", load: 120.25, reps: 8 }]] },
    { name: "session-empty", actions: [["logSession", { date: "2026-09-04", sets: [] }]] },
    { name: "session-two", actions: [["logSession", { date: "2026-09-04", sets: [{ lift: "press", load: 120, reps: 8 }, { lift: "row", load: 100, reps: 7 }] }]] },
    { name: "close-fresh", actions: [["finishSession"]] },
    { name: "close-active", actions: [["logSession", { date: "2026-09-04", sets: [{ load: 120, reps: 8 }] }], ["finishSession"], ["logSet", { load: 100, reps: 6 }]] },
    { name: "initial-consent", actions: [["logSession", { date: "2026-09-04", sets: [{ lift: "press", load: 120, reps: 8 }] }], ["acceptInitialPlan", "from-session"]] },
    { name: "no-plan", actions: [["acceptInitialPlan", "no-plan"]] },
    { name: "plan-edit", actions: [["planEdit", { domain: "protein", value: 150.5 }]] },
    { name: "positional-actions", actions: [["weighIn", { date: "2026-09-04", lb: 171 }], ["correction", "op-dev-A-1", { lb: { value: 170.4, unit: "lb" } }], ["tombstone", "op-dev-A-1", "double entry"], ["respond", "p-synthetic", "YES"], ["undoRequest", "txn-synthetic"]] },
    { name: "range-last-and-next", range: [1, 3], actions: [["logSession", { sets: [{ load: 120, reps: 8 }, { load: 110, reps: 7 }] }], ["finishSession"]] },
    { name: "range-crossed-batch", range: [1, 2], actions: [["logSession", { sets: [{ load: 120, reps: 8 }, { load: 110, reps: 7 }] }]] },
    { name: "snapshot-and-receipts", actions: [["receiveSnapshot", { plan: { steps: 8000 }, reads: ["2026-09-04"], planProvenance: "authored", W: 2 }], ["deliverReceipts", []], ["deliverReceipts", [{ seq: 2 }, { seq: 1 }]]] },
  ];
  for (const tz of ["+00:00", "-04:00", "-05:00", "+14:00"]) for (const scenario of scenarios) {
    const trace = [], results = [], backend = Client.memoryBackend({ sync: { snapshot: { reads: ["2026-09-04"] } } });
    const clock = { now() { trace.push("N"); return "2026-09-04T12:34:56.000Z"; }, today() { trace.push("D"); return "2026-09-04"; }, monotonicMs() { trace.push("M"); return 100; }, tz };
    const lease = O.lease("dev-A", scenario.range ? { range: scenario.range } : {});
    const client = Client.createClient({ deviceId: "dev-A", athleteId: "ath-1", identityKey: "synthetic-Cafe\u0301-\ud800", authorityKey: O.AUTH_KEY, clock, lease, backend, online: false });
    client.boot();
    for (const [name, ...args] of scenario.actions) {
      const start = trace.length;
      const result = client[name](...args);
      results.push({ name, result, calls: trace.slice(start) });
    }
    const face = client.face();
    const state = Object.fromEntries(backend.collections().map(name => [name, Object.fromEntries(backend.keys(name).map(key => [key, backend.get(name, key)]))]));
    const issuance = client.deriveInstance({ proposal_family_id: "family-Café", evidence_generation: "e-1", offer_digest: "digest-\ud800" });
    cases.push({ name: scenario.name, tz, results, face, state, trace, issuance });
  }
  return JSON.parse(JSON.stringify(cases));
}
module.exports = { runActionVectors };
