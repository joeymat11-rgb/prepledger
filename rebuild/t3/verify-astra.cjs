"use strict";
const assert = require("node:assert/strict");
const { createAuthority, memoryBackend, Store } = require("../authority");
const O = require("../conform/lib/ops.cjs");
const { signLease } = require("../authority/crypto.cjs");
const config = backend => ({ backend, authorityKey: O.AUTH_KEY, identityKeys: () => O.K_IDENTITY,
  clock: { now: () => "2026-09-03T12:00:00Z" }, athletes: {
    "ath-1": { plan: { protein_g: 150, steps: 8000 }, devices: { "dev-A": { lease: O.lease("dev-A") }, "dev-B": { lease: O.lease("dev-B") } } },
    "ath-2": { plan: { protein_g: 150, steps: 8000 }, devices: { "dev-C": { lease: O.lease("dev-C", { athlete_id: "ath-2" }) } } },
  } });
const fact = (id, seq, extra = {}) => O.build({ op_id: id, device_id: "dev-A", device_seq: seq, ...extra });
let checks = 0;
function check(name, run) { run(); checks++; console.log("PASS " + name); }

check("restart from serialized rows preserves history, plan, ownership and replay", () => {
  const backend = memoryBackend(); const a = createAuthority(config(backend));
  const w = fact("shared", 1); const receipt = a.admit("ath-1", w);
  assert.equal(a.admit("ath-2", fact("shared", 1, { athlete_id: "ath-2", device_id: "dev-C" })).status, "ACCEPTED");
  const edit = fact("plan", 2, { kind: "plan-mutation", class: "plan", payload: null, parents: ["shared"], plan: {} });
  a.admit("ath-1", edit);
  const b = createAuthority(config(memoryBackend(JSON.parse(JSON.stringify(backend.snapshot())))));
  assert.deepEqual(b.admit("ath-1", w), receipt);
  assert.equal(b.plan("ath-1").protein_g, 155); assert.equal(b.frontier("ath-1"), 2);
  assert.equal(b.frontier("ath-2"), 1);
  assert.equal(b.admit("ath-1", fact("child", 3, { parents: ["shared"] })).status, "ACCEPTED");
});
check("fault after staged admission rolls back log, slot, plan and counter", () => {
  const memory = memoryBackend(); let fail = false;
  const backend = { ...memory, put(key, value) {
    if (fail && JSON.parse(key)[1] === "transactions") throw new Error("disk failure");
    memory.put(key, value);
  } };
  const a = createAuthority(config(backend));
  const edit = fact("edit", 1, { kind: "plan-mutation", class: "plan", payload: null, plan: {} });
  fail = true; assert.equal(a.admit("ath-1", edit).status, "UNAVAILABLE");
  assert.equal(a.frontier("ath-1"), 0); assert.equal(a.plan("ath-1").protein_g, 150);
  assert.deepEqual(a.dispositionHistory("ath-1", "dev-A", 1), []);
  fail = false; const r = a.admit("ath-1", edit);
  assert.equal(r.athlete_log_seq, 1); assert.deepEqual(a.admit("ath-1", edit), r);
  assert.equal(a.planTransactions("ath-1").length, 1);
});
check("commit failure publishes no staged state and retry is a single accept", () => {
  const memory = memoryBackend(); let fail = false;
  const a = createAuthority(config({ ...memory, commit() { if (fail) throw new Error("commit failure"); memory.commit(); } }));
  const w = fact("commit", 1); fail = true;
  assert.equal(a.admit("ath-1", w).status, "UNAVAILABLE"); assert.equal(a.frontier("ath-1"), 0);
  fail = false; assert.equal(a.admit("ath-1", w).athlete_log_seq, 1);
});
check("callers cannot mutate durable operations or disposition histories", () => {
  const a = createAuthority(config()); const w = fact("copy", 1); const receipt = a.admit("ath-1", w);
  w.payload.lb.value = 900; receipt.status = "REJECTED";
  a.log("ath-1")[0].payload.lb.value = 500;
  a.dispositionHistory("ath-1", "dev-A", 1)[0].status = "REJECTED";
  assert.equal(a.log("ath-1")[0].payload.lb.value, 160);
  assert.equal(a.disposition("ath-1", "dev-A", 1).status, "ACCEPTED");
});
check("child waiting before rejected parent terminates without an unrelated accept", () => {
  const a = createAuthority(config());
  assert.equal(a.admit("ath-1", fact("child", 2, { parents: ["parent"] })).status, "WAITING");
  assert.equal(a.admit("ath-1", fact("parent", 1, { payload: { lb: 160 } })).status, "REJECTED");
  assert.deepEqual(a.dispositionHistory("ath-1", "dev-A", 2).map(d => d.status), ["WAITING", "REJECTED_DEPENDENCY"]);
});
check("revocation applies again when a waiting operation becomes ready", () => {
  const a = createAuthority(config()); a.admit("ath-1", fact("first", 1));
  a.admit("ath-1", fact("later", 2, { parents: ["parent"] }));
  assert.equal(a.revokeDevice("ath-1", "dev-A").barrier, 1);
  a.admit("ath-1", fact("parent", 1, { device_id: "dev-B" }));
  assert.equal(a.disposition("ath-1", "dev-A", 2).rejection_code, "LEASE_REVOKED_BEYOND_BARRIER");
});
check("unknown dependency revealed on a foreign athlete becomes cross-athlete rejection", () => {
  const a = createAuthority(config()); a.admit("ath-1", fact("wait", 1, { parents: ["foreign"] }));
  a.admit("ath-2", fact("foreign", 1, { athlete_id: "ath-2", device_id: "dev-C" }));
  assert.equal(a.disposition("ath-1", "dev-A", 1).rejection_code, "CROSS_ATHLETE_REFERENCE");
});
check("authority rejects tampered commitment and incorrectly bound signed leases", () => {
  const a = createAuthority(config()); const w = fact("tamper", 1); w.payload.lb.value = 190;
  assert.equal(a.admit("ath-1", w).rejection_code, "MALFORMED");
  const cfg = config(); cfg.athletes["ath-1"].devices["dev-A"].lease = signLease({ ...O.lease("dev-A"), athlete_id: "ath-2" }, O.AUTH_KEY);
  assert.equal(createAuthority(cfg).admit("ath-1", fact("bind", 1)).rejection_code, "LEASE_FORGED");
});
check("identity strings are ordinary keys and storage enforces append-only rows", () => {
  const backend = memoryBackend(); const a = createAuthority(config(backend));
  assert.equal(a.admit("ath-1", fact("__proto__", 1)).status, "ACCEPTED");
  assert.equal(a.admit("ath-1", fact("constructor", 2, { parents: ["__proto__"] })).status, "ACCEPTED");
  const store = new Store(backend);
  assert.equal(store.transaction("ath-1", tx => tx.put("log", "1", { seq: 99 })).ok, false);
  assert.equal(a.frontier("ath-1"), 2);
});
check("key lookup outage is retryable and cannot become a terminal rejection", () => {
  let fail = true; const cfg = config(); cfg.identityKeys = () => { if (fail) throw new Error("key store offline"); return O.K_IDENTITY; };
  const a = createAuthority(cfg); const w = fact("key-outage", 1);
  assert.equal(a.admit("ath-1", w).status, "UNAVAILABLE");
  assert.deepEqual(a.dispositionHistory("ath-1", "dev-A", 1), []);
  fail = false; assert.equal(a.admit("ath-1", w).status, "ACCEPTED");
});
check("plan member unit and member-set commitment are validated before acceptance", () => {
  const a = createAuthority(config());
  const missingUnit = fact("unit", 1, { kind: "plan-mutation", class: "plan", payload: null,
    plan: { members: [{ field: "protein_g", value: 155, provenance: "athlete_edited" }] } });
  assert.equal(a.admit("ath-1", missingUnit).rejection_code, "MALFORMED");
  const wrongGroup = fact("group", 2, { kind: "plan-mutation", class: "plan", payload: null, plan: {}, extra: { member_set_commitment: "invented" } });
  assert.equal(a.admit("ath-1", wrongGroup).rejection_code, "MALFORMED");
  assert.equal(a.plan("ath-1").protein_g, 150);
});
check("waiting retry resumes after dependency acceptance encountered a storage failure", () => {
  const memory = memoryBackend(); let fail = false;
  const backend = { ...memory, put(key, value) { if (fail && JSON.parse(key)[1] === "transactions") throw new Error("interrupted waiting admission"); memory.put(key, value); } };
  const a = createAuthority(config(backend));
  const child = fact("waiting-retry", 1, { device_id: "dev-B", kind: "plan-mutation", class: "plan", payload: null, plan: {}, parents: ["dependency"] });
  assert.equal(a.admit("ath-1", child).status, "WAITING");
  fail = true; assert.equal(a.admit("ath-1", fact("dependency", 1)).status, "ACCEPTED");
  assert.equal(a.disposition("ath-1", "dev-B", 1).status, "WAITING");
  fail = false; assert.equal(a.admit("ath-1", child).status, "ACCEPTED");
  assert.deepEqual(a.dispositionHistory("ath-1", "dev-B", 1).map(r => r.status), ["WAITING", "ACCEPTED"]);
  assert.equal(a.planTransactions("ath-1").length, 1);
});
console.log("ASTRA durability/admission verification: " + checks + "/" + checks + " PASS");
