"use strict";

// Synthetic only. The baseline comes from the accepted integration commit,
// never by undoing the candidate seam or deriving expected results from it.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"), os = require("node:os"), path = require("node:path");
const vm = require("node:vm"), { createRequire } = require("node:module");
const { execFileSync } = require("node:child_process");
const nativeCrypto = require("node:crypto");
const C = require("../crypto.cjs"), { buildCore } = require("../build.cjs");
const O = require("../../../conform/lib/ops.cjs");
const currentDefault = require("../../../authority/index.cjs");
const { laws } = require("../../../conform/laws/sheet-A-authority.cjs");
const BASE = "0e3103431b1bf824d577e40cd83a401b0d7ce571";
const root = path.resolve(__dirname, "../../../..");
const authorityRoot = path.join(root, "rebuild/authority");
const boundaryPath = path.join(root, "rebuild/m3/w5/crypto.cjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "earned-r1-core-crypto-"));
const git = (...args) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8" });
const source = file => git("show", BASE + ":" + file);
const json = value => JSON.stringify(value);
let actual, baseline, baselineCryptoSource;
let oldKey, newKey, thirdKey, oldPin, newPin, ring;

function loadCjs(text, filename, overrides = {}) {
  const module = { exports: {} }, localRequire = createRequire(filename);
  const requireFrom = name => Object.hasOwn(overrides, name) ? overrides[name] : localRequire(name);
  vm.runInThisContext("(function(require,module,exports,__filename,__dirname){" + text + "\n})", { filename })(
    requireFrom, module, module.exports, filename, path.dirname(filename));
  return module.exports;
}

before(async () => {
  const baselineRoot = path.join(scratch, "authority");
  fs.mkdirSync(baselineRoot);
  for (const file of git("ls-tree", "-r", "--name-only", BASE, "--", "rebuild/authority").trim().split("\n")) {
    if (file.endsWith(".cjs")) fs.writeFileSync(path.join(baselineRoot, path.basename(file)), source(file));
  }
  baseline = require(path.join(baselineRoot, "index.cjs"));
  baselineCryptoSource = source("rebuild/m3/w5/crypto.cjs");
  const output = await buildCore({ authorityRoot, outfile: path.join(scratch, "actual-public-core.cjs") });
  actual = require(output);
  oldKey = C.generateSigningKey("r1-old"); newKey = C.generateSigningKey("r1-current"); thirdKey = C.generateSigningKey("r1-third");
  oldPin = C.publicKeyOf(oldKey); newPin = C.publicKeyOf(newKey);
  ring = { activeSigningKey: newKey, verificationKeys: [oldPin, newPin] };
});

after(() => {
  assert.equal(path.dirname(scratch), path.resolve(os.tmpdir()));
  assert(path.basename(scratch).startsWith("earned-r1-core-crypto-"));
  fs.rmSync(scratch, { recursive: true });
});

function lease(device = "dev-A", id = "lease-A", key = oldKey, extra = {}) {
  return C.signLease({ lease_id: id, athlete_id: "ath-1", device_id: device, schema_version: 1,
    range: [1, 500], not_before: "2026-09-03T00:00:00.000Z", not_after: "2026-10-03T00:00:00.000Z",
    issued_server_time: "2026-09-03T00:00:00.000Z", ...extra }, key);
}
function op(id, seq = 1, extra = {}) {
  return O.build({ op_id: id, device_id: "dev-A", device_seq: seq, lease_id: "lease-A", ...extra });
}
function fixture({ key = ring, devices, resolver = "issued", leases = [], core = actual } = {}) {
  const backend = core.memoryBackend(), store = new core.Store(backend), calls = [];
  const config = { store, authorityKey: key, identityKeys: () => O.K_IDENTITY,
    clock: () => "2027-01-01T00:00:00.000Z", // Deliberately after the old lease's expiry.
    athletes: { "ath-1": { devices: devices || { "dev-A": { lease: lease("dev-A", "lease-B", newKey) } }, plan: { protein_g: 150 } } } };
  if (resolver === "issued") config.resolveIssuedLease = (tx, athlete, device, id) => {
    calls.push([athlete, device, id]);
    return tx.get("issuedLeases", JSON.stringify([device, id]))?.lease;
  };
  else if (resolver !== "omitted") config.resolveIssuedLease = resolver;
  const authority = core.createAuthority(config);
  const put = (fn) => { const result = store.transaction("ath-1", fn); if (!result.ok) throw result.error; };
  for (const value of leases) put(tx => tx.insert("issuedLeases", JSON.stringify([value.device_id, value.lease_id]), { lease: value }));
  const renewPointer = value => put(tx => {
    const metadata = tx.get("metadata", "state");
    metadata.devices[value.device_id].lease = value;
    tx.put("metadata", "state", metadata);
  });
  return { authority, backend, store, calls, put, renewPointer };
}

test("default authority: all 34 original laws match the pinned pre-amendment results", () => {
  assert.equal(laws.length, 34);
  const adapterPath = path.join(root, "rebuild/conform/adapters/authority.cjs");
  const adapterSource = fs.readFileSync(adapterPath, "utf8");
  const adapter = core => loadCjs(adapterSource, adapterPath, { "../../authority/index.cjs": core });
  const original = adapter(baseline), candidate = adapter(currentDefault);
  for (const law of laws) {
    O.reset(); const before = law.run({ authority: original.create });
    O.reset(); const after = law.run({ authority: candidate.create });
    assert.equal(before.ok, true, "baseline " + law.id);
    assert.equal(after.ok, true, "candidate " + law.id);
    assert.equal(json(after), json(before), "exact default law result: " + law.id);
  }
});

test("default authority: exact durable rows, returns, input bytes and clock calls remain unchanged", () => {
  function capture(core, includeUndefined) {
    const backend = core.memoryBackend(), clockCalls = [];
    const config = { backend, authorityKey: O.AUTH_KEY, identityKeys: () => O.K_IDENTITY,
      clock: () => { clockCalls.push("now"); return "2026-09-03T00:00:00Z"; },
      athletes: { "ath-1": { devices: { "dev-A": { lease: O.lease("dev-A") }, "dev-B": { lease: O.lease("dev-B") } }, plan: { protein_g: 150 } } } };
    if (includeUndefined) config.resolveIssuedLease = undefined;
    const a = core.createAuthority(config), inputs = [
      O.build({ op_id: "child", device_id: "dev-B", device_seq: 1, parents: ["parent"] }),
      O.build({ op_id: "parent", device_id: "dev-A", device_seq: 1 }),
      O.build({ op_id: "unknown", device_id: "dev-A", device_seq: 2, lease_id: "absent" }),
    ];
    const inputBytes = json(inputs), results = inputs.map(value => a.admit("ath-1", value));
    results.push(a.admit("ath-1", inputs[1]), a.revokeDevice("ath-1", "dev-A"), a.receipts("ath-1"), a.plan("ath-1"));
    assert.equal(json(inputs), inputBytes);
    return json({ results, rows: backend.snapshot(), clockCalls, inputBytes });
  }
  const expected = capture(baseline, false);
  assert.equal(capture(currentDefault, false), expected);
  assert.equal(capture(currentDefault, true), expected);
});

test("default crypto: original canonical/HMAC and deterministic signature-encoding bytes remain exact", () => {
  const raw = Buffer.alloc(64); raw[31] = 1; raw[63] = 2;
  const primitive = { ...nativeCrypto, sign: () => Buffer.from(raw) };
  const original = loadCjs(baselineCryptoSource, boundaryPath, { "node:crypto": primitive });
  const candidate = loadCjs(fs.readFileSync(boundaryPath, "utf8"), boundaryPath, { "node:crypto": primitive });
  const record = { n: 1.5, text: "Cafe\u0301", causal_parents: ["b", "a", "a"], nil: null };
  for (const [kind, domain] of Object.entries(original.DOMAINS)) {
    const suffix = kind[0].toUpperCase() + kind.slice(1), field = kind === "lease" ? "signature" : "authority_signature";
    assert.equal(candidate.canonicalBytes(record, domain, field).toString("hex"), original.canonicalBytes(record, domain, field).toString("hex"));
    assert.equal(json(candidate["sign" + suffix](record, oldKey)), json(original["sign" + suffix](record, oldKey)));
  }
  assert.equal(candidate.commitmentOf(record, O.K_IDENTITY), original.commitmentOf(record, O.K_IDENTITY));
  assert.equal(candidate.hmac(O.K_IDENTITY, "synthetic"), original.hmac(O.K_IDENTITY, "synthetic"));
});

test("generated public core admits the original lease after renewal and preserves exact replay bytes", () => {
  const old = lease(), f = fixture({ leases: [old] }), operation = op("late-old");
  const before = json(operation), result = f.authority.admit("ath-1", operation);
  assert.equal(result.status, "ACCEPTED");
  assert.equal(json(operation), before);
  assert.equal(C.verifyDisposition(result, ring), true);
  assert(result.authority_signature.startsWith("ES256.r1-current."));
  assert.equal(json(f.authority.admit("ath-1", operation)), json(result));
  assert.equal(f.authority.frontier("ath-1"), 1);
  assert.deepEqual(f.calls, [["ath-1", "dev-A", "lease-A"]]);
  assert.equal(f.store.read("ath-1", tx => tx.get("metadata", "state").devices["dev-A"].lease.lease_id), "lease-B");
});

test("WAITING drain resolves every original lease across B/C renewal and interleaved devices", () => {
  const old = lease(), middle = lease("dev-A", "lease-B", newKey), current = lease("dev-A", "lease-C", newKey);
  const foreignDevice = lease("dev-B", "lease-other", oldKey);
  const f = fixture({ devices: { "dev-A": { lease: old }, "dev-B": { lease: foreignDevice } }, leases: [old, middle, current, foreignDevice] });
  const a = op("old-child", 2, { parents: ["parent"] }), b = op("middle-child", 3, { lease_id: "lease-B", parents: ["old-child"] });
  const other = op("other-child", 1, { device_id: "dev-B", lease_id: "lease-other", parents: ["middle-child"] });
  assert.equal(f.authority.admit("ath-1", a).status, "WAITING");
  f.renewPointer(middle);
  assert.equal(f.authority.admit("ath-1", b).status, "WAITING");
  assert.equal(f.authority.admit("ath-1", other).status, "WAITING");
  f.renewPointer(current);
  const callStart = f.calls.length;
  assert.equal(f.authority.admit("ath-1", op("parent", 1)).status, "ACCEPTED");
  assert.deepEqual(f.authority.log("ath-1").map(value => value.op_id), ["parent", "old-child", "middle-child", "other-child"]);
  for (const [device, seq, leaseId] of [["dev-A", 2, "lease-A"], ["dev-A", 3, "lease-B"], ["dev-B", 1, "lease-other"]]) {
    const history = f.authority.dispositionHistory("ath-1", device, seq);
    assert.deepEqual(history.map(value => value.status), ["WAITING", "ACCEPTED"]);
    assert(history.every(value => C.verifyDisposition(value, ring)));
    assert(f.calls.slice(callStart).some(value => value[1] === device && value[2] === leaseId));
  }
  assert.equal(f.store.read("ath-1", tx => tx.get("metadata", "state").devices["dev-A"].lease.lease_id), "lease-C");
});

test("omitted resolver still refuses an old lease when metadata points at the renewed one", () => {
  const f = fixture({ resolver: "omitted", leases: [lease()] });
  assert.equal(f.authority.admit("ath-1", op("legacy-lookup")).rejection_code, "LEASE_UNKNOWN");
});

test("undefined and wrong-ID results never fall back to the otherwise valid metadata lease", () => {
  for (const resolver of [() => undefined, () => lease("dev-A", "different")]) {
    const f = fixture({ devices: { "dev-A": { lease: lease() } }, resolver });
    assert.equal(f.authority.admit("ath-1", op("no-fallback")).rejection_code, "LEASE_UNKNOWN");
    assert.equal(f.authority.frontier("ath-1"), 0);
  }
});

test("missing historical device refuses without consulting the issued-lease resolver", () => {
  let calls = 0;
  const f = fixture({ devices: {}, resolver: () => { calls++; return lease(); } });
  assert.equal(f.authority.admit("ath-1", op("not-enrolled")).rejection_code, "LEASE_UNKNOWN");
  assert.equal(calls, 0);
});

test("Promise, malformed and throwing resolvers are unavailable with no partial rows", () => {
  const invalid = [null, false, 3, "lease-A", [], {}, { lease_id: 3 }, { lease_id: "" },
    Promise.resolve(lease()), { lease_id: "lease-A", then() {} }];
  for (const value of invalid) {
    const f = fixture({ resolver: () => value }), before = json(f.backend.snapshot());
    assert.deepEqual(f.authority.admit("ath-1", op("invalid-resolver")), { status: "UNAVAILABLE", retry: true, op_id: "invalid-resolver" });
    assert.equal(json(f.backend.snapshot()), before);
  }
  const f = fixture({ resolver: () => { throw new Error("unavailable"); } }), before = json(f.backend.snapshot());
  assert.equal(f.authority.admit("ath-1", op("throws")).status, "UNAVAILABLE");
  assert.equal(json(f.backend.snapshot()), before);
  assert.throws(() => fixture({ resolver: 1 }), /synchronous function/);
});

test("failed historical resolver during WAITING drain preserves pending bytes until the resolver recovers", () => {
  const old = lease(), parentLease = lease("dev-B", "parent-lease", oldKey);
  let available = true;
  const f = fixture({ devices: { "dev-A": { lease: old }, "dev-B": { lease: parentLease } },
    resolver: (tx, athlete, device) => device === "dev-B" ? parentLease : available ? old : Promise.resolve(old) });
  const waiting = op("waiting", 1, { parents: ["parent"] });
  assert.equal(f.authority.admit("ath-1", waiting).status, "WAITING");
  const original = f.store.read("ath-1", tx => tx.get("operations", "waiting"));
  available = false;
  assert.equal(f.authority.admit("ath-1", op("parent", 1, { device_id: "dev-B", lease_id: "parent-lease" })).status, "ACCEPTED");
  assert.equal(json(f.store.read("ath-1", tx => tx.get("operations", "waiting"))), json(original));
  available = true;
  assert.equal(f.authority.admit("ath-1", waiting).status, "ACCEPTED");
  assert.equal(f.authority.frontier("ath-1"), 2);
});

test("historical capabilities retain original forged, schema, range and revocation dispositions", () => {
  const cases = [
    [lease("dev-A", "lease-A", thirdKey), op("forged"), "LEASE_FORGED"],
    [lease("dev-B", "lease-A"), op("wrong-device"), "LEASE_FORGED"],
    [lease("dev-A", "lease-A", oldKey, { athlete_id: "ath-2" }), op("wrong-athlete"), "LEASE_FORGED"],
    [lease("dev-A", "lease-A", oldKey, { schema_version: 2 }), op("schema"), "MALFORMED"],
    [lease("dev-A", "lease-A", oldKey, { range: [2, 5] }), op("range"), "DEVICE_SEQ_OUT_OF_RANGE"],
  ];
  for (const [capability, operation, code] of cases) {
    const f = fixture({ resolver: () => capability }), result = f.authority.admit("ath-1", operation);
    assert.equal(result.status, "REJECTED"); assert.equal(result.rejection_code, code);
    assert.equal(f.authority.frontier("ath-1"), 0);
    assert.equal(C.verifyDisposition(result, ring), true);
  }
  const f = fixture({ leases: [lease()] }), accepted = f.authority.admit("ath-1", op("before-revoke"));
  assert.equal(f.authority.revokeDevice("ath-1", "dev-A").barrier, 1);
  assert.equal(f.authority.admit("ath-1", op("after-revoke", 2)).rejection_code, "LEASE_REVOKED_BEYOND_BARRIER");
  assert.equal(json(f.authority.admit("ath-1", op("before-revoke"))), json(accepted));
});

test("all old signed surfaces and a new generic domain verify by exact historical kid after rotation", () => {
  const oldBoundary = loadCjs(baselineCryptoSource, boundaryPath);
  for (const kind of Object.keys(C.DOMAINS)) {
    const suffix = kind[0].toUpperCase() + kind.slice(1), field = kind === "lease" ? "signature" : "authority_signature";
    const old = oldBoundary["sign" + suffix]({ value: 3, text: "Café" }, oldKey);
    assert.equal(C["verify" + suffix](old, ring), true);
    const fresh = C["sign" + suffix]({ value: 3, text: "Café" }, ring);
    assert(fresh[field].startsWith("ES256.r1-current."));
    assert.equal(oldBoundary["verify" + suffix](fresh, newPin), true);
    assert.equal(C["verify" + suffix]({ ...old, [field]: old[field].replace("r1-old", "r1-current") }, ring), false);
    assert.equal(C["verify" + suffix]({ ...old, value: 4 }, ring), false);
    assert.equal(C["verify" + suffix](old, { activeSigningKey: newKey, verificationKeys: [newPin] }), false);
  }
  const domain = "earned/reconcile-manifest/v1", record = { key_epoch: C.activeKeyId(ring), n: 1 };
  record.authority_signature = C.signatureOver(record, ring, domain);
  assert.equal(C.verifyRecord(record, ring, domain), true);
  assert.equal(C.verifyRecord(record, ring, "earned/reconciliation-manifest/v1"), false);
  assert.equal(C.activeKeyId(oldKey), oldKey.kid);
  assert.equal(C.activeKeyId(ring), newKey.kid);
  assert.equal(json(C.publicKeyOf(ring)), json(newPin));
  assert.equal(C.verifyRecord(record, { activeSigningKey: newPin, verificationKeys: [oldPin, newPin] }, domain), true);
});

test("malformed, missing, duplicate and private verification pins fail closed", () => {
  const record = C.signDisposition({ n: 1 }, oldKey);
  const privateObject = nativeCrypto.createPrivateKey({ key: oldKey.privateKey, format: "jwk" });
  const invalid = [
    { activeSigningKey: newKey, verificationKeys: [] },
    { activeSigningKey: newKey, verificationKeys: [oldPin] },
    { activeSigningKey: newKey, verificationKeys: [oldPin, newPin, oldPin] },
    { activeSigningKey: newKey, verificationKeys: [oldKey, newPin] },
    { activeSigningKey: newKey, verificationKeys: [{ kid: oldKey.kid, publicKey: oldKey.privateKey }, newPin] },
    { activeSigningKey: newKey, verificationKeys: [{ kid: oldKey.kid, publicKey: privateObject }, newPin] },
    { activeSigningKey: newKey, verificationKeys: [{ kid: oldKey.kid, publicKey: privateObject.export({ format: "pem", type: "pkcs8" }) }, newPin] },
    { activeSigningKey: newKey, verificationKeys: [oldPin, { ...newPin, publicKey: thirdKey.publicKey }] },
    { activeSigningKey: newKey, verificationKeys: [oldPin, newPin], kid: "stale-alias" },
    { activeSigningKey: newKey, verificationKeys: [oldPin, newPin, { kid: 123, publicKey: thirdKey.publicKey }] },
    { activeSigningKey: newKey, verificationKeys: [oldPin, newPin, { kid: "bad", publicKey: {} }] },
    { activeSigningKey: newKey, verificationKeys: [{ ...oldPin, publicKey: { ...oldPin.publicKey, key_ops: ["sign"] } }, newPin] },
  ];
  for (const config of invalid) {
    assert.equal(C.verifyDisposition(record, config), false);
    assert.throws(() => C.signDisposition({ n: 1 }, config));
    assert.throws(() => C.activeKeyId(config));
  }
  const mismatch = { activeSigningKey: { ...newKey, privateKey: thirdKey.privateKey }, verificationKeys: [oldPin, newPin] };
  assert.throws(() => C.signDisposition({ n: 1 }, mismatch), /private key must match/);
});

test("key rotation does not rewrite historical receipts, capabilities or device counters", () => {
  const old = lease(), f = fixture({ key: oldKey, devices: { "dev-A": { lease: old } }, leases: [old] });
  const operation = op("old-receipt"), result = f.authority.admit("ath-1", operation), before = json(f.backend.snapshot());
  const rotated = actual.createAuthority({ store: f.store, authorityKey: ring, identityKeys: () => O.K_IDENTITY,
    clock: () => "2027-01-01T00:00:00.000Z", athletes: { "ath-1": { devices: {}, plan: {} } },
    resolveIssuedLease: (tx, athlete, device, id) => tx.get("issuedLeases", JSON.stringify([device, id]))?.lease });
  assert.equal(json(f.backend.snapshot()), before);
  assert.equal(json(rotated.admit("ath-1", operation)), json(result));
  assert.equal(json(f.backend.snapshot()), before);
  assert.equal(rotated.verifyDisposition(result), true);
  const fresh = rotated.admit("ath-1", op("new-receipt", 2));
  assert.equal(fresh.status, "ACCEPTED");
  assert(fresh.authority_signature.startsWith("ES256.r1-current."));
  assert.equal(json(rotated.disposition("ath-1", "dev-A", 1)), json(result));
  assert.equal(json(f.store.read("ath-1", tx => tx.get("issuedLeases", JSON.stringify(["dev-A", "lease-A"])).lease)), json(old));
});

test("effective disposable bite: disabling the resolver only during WAITING drain turns the exact assertion RED", async () => {
  const copyRoot = path.join(scratch, "waiting-bite-authority");
  fs.cpSync(authorityRoot, copyRoot, { recursive: true });
  const file = path.join(copyRoot, "admit.cjs"), original = fs.readFileSync(file);
  const before = original.toString("utf8"), anchor = "resolveIssuedLease === undefined ? device.lease";
  assert.equal(before.split(anchor).length, 2);
  const mutated = before.replace(anchor, "(resolveIssuedLease === undefined || reconsider) ? device.lease");
  const hash = bytes => nativeCrypto.createHash("sha256").update(bytes).digest("hex");
  async function check(name) {
    const output = await buildCore({ authorityRoot: copyRoot, cryptoPath: boundaryPath, outfile: path.join(scratch, name + ".cjs") });
    const core = require(output), old = lease(), current = lease("dev-A", "lease-B", newKey);
    const f = fixture({ core, devices: { "dev-A": { lease: old } }, leases: [old, current] });
    assert.equal(f.authority.admit("ath-1", op("bite-child", 2, { parents: ["bite-parent"] })).status, "WAITING");
    f.renewPointer(current);
    assert.equal(f.authority.admit("ath-1", op("bite-parent", 1)).status, "ACCEPTED");
    assert.deepEqual(f.authority.log("ath-1").map(value => value.op_id), ["bite-parent", "bite-child"]);
    assert.deepEqual(f.authority.dispositionHistory("ath-1", "dev-A", 2).map(value => value.status), ["WAITING", "ACCEPTED"]);
  }
  await check("waiting-control");
  let detected = false;
  try {
    fs.writeFileSync(file, mutated);
    try { await check("waiting-mutant"); }
    catch (error) { if (error.code !== "ERR_ASSERTION") throw error; detected = true; }
    assert.equal(detected, true, "an inert mutation earns nothing");
    console.log("R1 CORE BITE RED — WAITING drain omitted historical resolver; exact accepted log assertion failed");
  } finally { fs.writeFileSync(file, original); }
  assert.equal(hash(fs.readFileSync(file)), hash(original));
  assert.equal(hash(fs.readFileSync(path.join(authorityRoot, "admit.cjs"))), hash(original));
  await check("waiting-restored");
  console.log("R1 CORE BITE RESTORED PASS sha256=" + hash(original));
});
