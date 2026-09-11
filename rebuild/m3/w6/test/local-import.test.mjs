// local-import.test.mjs — C2b. The phone side of Joe's PC port, against real
// (fake-indexeddb) IndexedDB and against a bundle THIS RUN sealed with the real
// rebuild/m3/setup/port/port.cjs.
//
// NOTHING PRIVATE IS TOUCHED. The only ledger any case reads is the PUBLIC
// frozen preimage rebuild/conform/fixtures/preimage-2026-08-15.json. There is no
// skip: the bundle is produced at module load by spawning port.cjs, and a
// failure to produce it fails every case loudly rather than passing silently.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { webcrypto, createHash, pbkdf2Sync, createCipheriv, randomBytes } from "node:crypto";
import { IDBFactory } from "fake-indexeddb";
import { faultDatabase, deferred } from "./support.mjs";
import { openLocalDurableClient, DERIVED, opsBasis } from "../local/local-client.mjs";
import { unsealBundle, importBundle, listImports, importOriginal, markImportRebased,
  importNameFor, importSummaries, importRebasePending, importRebaseCode, base64ToBytes,
  bytesToBase64, sha256Hex, BUNDLE_PROFILE, KDF, CIPHER, TAG_BYTES, BUNDLE_FAILURE,
  PAYLOAD_FAILURE, LOCAL_IMPORT_PROFILE, IMPORT_REBASE_CODE } from "../local/import-bundle.mjs";
const require = createRequire(import.meta.url);
const Unseal = require("../../setup/port/unseal.cjs");

const REPO = fileURLToPath(new URL("../../../../", import.meta.url));
const FIXTURE = path.join(REPO, "rebuild/conform/fixtures/preimage-2026-08-15.json");
const PORT = path.join(REPO, "rebuild/m3/setup/port/port.cjs");

// --- ONE REAL BUNDLE, SEALED BY port.cjs, PRODUCED ONCE ----------------------
// --out must be outside every git working tree and may carry no `rebuild`
// segment (C2's own guard), so the OS temp folder is the only place this can go.
function sealRealBundle() {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "w6-c2b-"));
  const run = spawnSync(process.execPath, [PORT, "--source", FIXTURE, "--out", out],
    { cwd: REPO, encoding: "utf8", timeout: 600000 });
  if (run.status !== 0) {
    throw new Error(`port.cjs did not seal a bundle (status ${run.status}). ` +
      `stdout tail: ${String(run.stdout).slice(-600)} stderr tail: ${String(run.stderr).slice(-600)}`);
  }
  const names = fs.readdirSync(out);
  const bundleName = names.find(name => name.endsWith(".json"));
  const passName = names.find(name => name.endsWith("-PASSPHRASE.txt"));
  if (!bundleName || !passName) throw new Error(`port.cjs wrote ${JSON.stringify(names)}`);
  return { out, bytes: new Uint8Array(fs.readFileSync(path.join(out, bundleName))),
    passphrase: fs.readFileSync(path.join(out, passName), "utf8").trim(), stdout: run.stdout };
}
const REAL = sealRealBundle();
process.on("exit", () => { try { fs.rmSync(REAL.out, { recursive: true, force: true }); } catch {} });
const SOURCE_BYTES = new Uint8Array(fs.readFileSync(FIXTURE));

// --- helpers -----------------------------------------------------------------
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const envelopeOf = bytes => JSON.parse(Buffer.from(bytes).toString("utf8"));
const bytesOf = envelope => new Uint8Array(Buffer.from(JSON.stringify(envelope, null, 1) + "\n", "utf8"));
// Re-seal a chosen payload with port.cjs's own parameters. Test-side only: it
// is how a WELL-SEALED bundle with a broken payload can exist at all, which is
// the only way to reach BUNDLE_PAYLOAD_INVALID rather than BUNDLE_AUTH_FAILED.
function reseal(payload, passphrase, sourceSha256) {
  const salt = randomBytes(KDF.saltBytes), iv = randomBytes(CIPHER.ivBytes);
  const key = pbkdf2Sync(Buffer.from(passphrase.normalize("NFKD"), "utf8"), salt, KDF.iterations, KDF.keyBits / 8, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv, { authTagLength: TAG_BYTES });
  cipher.setAAD(Buffer.from(JSON.stringify([BUNDLE_PROFILE, sourceSha256]), "utf8"));
  const body = Buffer.concat([cipher.update(Buffer.from(JSON.stringify(payload), "utf8")), cipher.final()]);
  return bytesOf({ profile: BUNDLE_PROFILE, sealedAt: new Date().toISOString(),
    kdf: { name: KDF.name, hash: KDF.hash, iterations: KDF.iterations, salt: salt.toString("base64") },
    cipher: { name: CIPHER.name, keyBits: CIPHER.keyBits, ivBytes: CIPHER.ivBytes, tagBits: CIPHER.tagBits, iv: iv.toString("base64") },
    aad: [BUNDLE_PROFILE, sourceSha256], ciphertext: Buffer.concat([body, cipher.getAuthTag()]).toString("base64") });
}

const DB = "earned-local-import-test", NS = "joe/phone-A", DEVICE = "dev-phone-A", ATHLETE = "ath-1";
const AT = "2026-09-11T08:00:00.000Z";
const clock = () => ({ now: () => AT, today: () => AT.slice(0, 10), tz: "+00:00", monotonicMs: () => 0 });
const base = (indexedDB, extra = {}) => ({ indexedDB, crypto: webcrypto, databaseName: DB, namespace: NS,
  athleteId: ATHLETE, deviceId: DEVICE, clock: clock(), ...extra });
async function ready(indexedDB, extra = {}, cleanInit = { profile: "host-clean-init", s: { v: 1 } }) {
  const client = await openLocalDurableClient(base(indexedDB, extra));
  assert.equal((await client.enroll(cleanInit)).enrolled, true);
  assert.equal((await client.boot()).ready, true);
  return client;
}
const IMPORT = { bundleBytes: REAL.bytes, passphrase: REAL.passphrase };
// The active record's revision, read WITHOUT the factory, so "nothing was
// written" is observed at the store rather than inferred from a return value.
function activeRevision(indexedDB) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction("generations", "readonly");
      let value;
      tx.objectStore("generations").get("active").onsuccess = event => { value = event.target.result; };
      tx.oncomplete = () => { db.close(); resolve(value === undefined ? null : value.revision); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  });
}

test("port.cjs sealed a real bundle and WebCrypto opens it byte for byte", async () => {
  // The seal-compat proof: the same envelope, the same passphrase, two
  // independent decoders — Node's createDecipheriv in unseal.cjs and
  // crypto.subtle here — and one deep-equal payload.
  const opened = await unsealBundle(REAL.bytes, REAL.passphrase, { crypto: webcrypto });
  assert.deepEqual(opened.payload, Unseal.unseal(Buffer.from(REAL.bytes), REAL.passphrase));
  assert.equal(opened.payload.profile, BUNDLE_PROFILE);
  assert.equal(opened.payload.oracle.verdict, "PASS");
  // The five sealing constants are PINNED to unseal.cjs, not copied and hoped.
  assert.equal(BUNDLE_PROFILE, Unseal.PROFILE);
  assert.deepEqual({ ...KDF }, { ...Unseal.KDF });
  assert.deepEqual({ ...CIPHER }, { ...Unseal.CIPHER });
  assert.equal(TAG_BYTES, Unseal.TAG_BYTES);
  assert.equal(BUNDLE_FAILURE, Unseal.FAILURE);
  // AAD is byte-identical, which is what makes the two tags agree at all.
  const { aadBytes } = await import("../local/import-bundle.mjs");
  assert.deepEqual(new Uint8Array(aadBytes(opened.payload.source.sha256)),
    new Uint8Array(Unseal.aadBytes(opened.payload.source.sha256)));
});

test("the payload's own hashes are reproduced here, including the plain-stringify one", async () => {
  const opened = await unsealBundle(REAL.bytes, REAL.passphrase, { crypto: webcrypto });
  // source.bytes decode to the fixture on disk, byte for byte.
  assert.deepEqual(opened.sourceBytes, SOURCE_BYTES);
  assert.equal(sha(Buffer.from(opened.sourceBytes)), opened.payload.source.sha256);
  assert.equal(await sha256Hex(webcrypto, opened.sourceBytes), opened.payload.source.sha256);
  // migrated.sha256 is sha256(utf8(JSON.stringify(candidate))) — PLAIN
  // stringify (prepare.cjs:67-70), not a sorted canonical form. Re-stringifying
  // the parsed state reproduces it because the bytes hashed were themselves
  // stringify output. Asserted here on the real 154 KB state, not argued.
  assert.equal(opened.migratedJson, JSON.stringify(opened.payload.migrated.state));
  assert.equal(sha(Buffer.from(opened.migratedJson, "utf8")), opened.payload.migrated.sha256);
  assert.ok(opened.migratedJson.length > 100000, "the real preimage, not a stub");
  assert.equal(opened.payload.engine.schemaV, opened.payload.migrated.state.v);
  assert.equal(opened.localBytes, null, "no --local on this run");
  // base64 helpers round-trip the real 490 KB ciphertext through atob/btoa.
  const envelope = envelopeOf(REAL.bytes);
  assert.equal(bytesToBase64(base64ToBytes(envelope.ciphertext)), envelope.ciphertext);
});

test("a wrong passphrase, one flipped byte and a re-pointed AAD all fail the same way", async () => {
  await assert.rejects(unsealBundle(REAL.bytes, "not-the-right-words-at-all", { crypto: webcrypto }),
    { code: BUNDLE_FAILURE });
  const envelope = envelopeOf(REAL.bytes), cipherBytes = base64ToBytes(envelope.ciphertext);
  for (const at of [0, cipherBytes.length >> 1, cipherBytes.length - 1]) {
    const flipped = Uint8Array.from(cipherBytes);
    flipped[at] ^= 0x01;
    const bundle = bytesOf({ ...envelope, ciphertext: bytesToBase64(flipped) });
    await assert.rejects(unsealBundle(bundle, REAL.passphrase, { crypto: webcrypto }), { code: BUNDLE_FAILURE },
      `a flipped byte at ${at} must not open`);
  }
  // The AAD binds the payload to the ORIGINAL source hash. Editing it — in the
  // envelope, where it is plaintext — breaks the tag.
  const other = sha(Buffer.from("a different ledger"));
  await assert.rejects(unsealBundle(bytesOf({ ...envelope, aad: [BUNDLE_PROFILE, other] }),
    REAL.passphrase, { crypto: webcrypto }), { code: BUNDLE_FAILURE });
});

test("every structural edit to the envelope is refused, and with the same code", async () => {
  const envelope = envelopeOf(REAL.bytes);
  const variants = {
    profile: { ...envelope, profile: "earned/local-import-bundle/v2" },
    "kdf.iterations": { ...envelope, kdf: { ...envelope.kdf, iterations: 1 } },
    "kdf.hash": { ...envelope, kdf: { ...envelope.kdf, hash: "SHA-512" } },
    "kdf.salt length": { ...envelope, kdf: { ...envelope.kdf, salt: Buffer.alloc(15).toString("base64") } },
    "cipher.iv length": { ...envelope, cipher: { ...envelope.cipher, iv: Buffer.alloc(13).toString("base64") } },
    "cipher.tagBits": { ...envelope, cipher: { ...envelope.cipher, tagBits: 96 } },
    "aad too short": { ...envelope, aad: [BUNDLE_PROFILE] },
    "aad not hex": { ...envelope, aad: [BUNDLE_PROFILE, "not-a-hash"] },
    "ciphertext not base64": { ...envelope, ciphertext: "@@@not base64@@@" },
    "ciphertext shorter than the tag": { ...envelope, ciphertext: Buffer.alloc(8).toString("base64") },
  };
  for (const [name, variant] of Object.entries(variants)) {
    await assert.rejects(unsealBundle(bytesOf(variant), REAL.passphrase, { crypto: webcrypto }),
      { code: BUNDLE_FAILURE }, `${name} must be refused as ${BUNDLE_FAILURE}`);
  }
  // Not JSON at all, and the wrong kind of input.
  await assert.rejects(unsealBundle(new Uint8Array([1, 2, 3]), REAL.passphrase, { crypto: webcrypto }), { code: BUNDLE_FAILURE });
  await assert.rejects(unsealBundle(42, REAL.passphrase, { crypto: webcrypto }), { code: BUNDLE_FAILURE });
  await assert.rejects(unsealBundle(REAL.bytes, "", { crypto: webcrypto }), { code: BUNDLE_FAILURE });
});

test("a WELL-SEALED bundle with a broken payload is named, not confused with a bad tag", async () => {
  const good = Unseal.unseal(Buffer.from(REAL.bytes), REAL.passphrase);
  const broken = {
    createdAt: { ...good, createdAt: "not a date" },
    "engine.schemaV": { ...good, engine: { ...good.engine, schemaV: "60" } },
    "engine.sha256": { ...good, engine: { ...good.engine, sha256: "short" } },
    "migrated.sha256": { ...good, migrated: { ...good.migrated, sha256: sha(Buffer.from("something else")) } },
    "migrated.state": { ...good, migrated: { ...good.migrated, state: [1, 2, 3] } },
    "oracle.verdict": { ...good, oracle: { ...good.oracle, verdict: 7 } },
    dataLoss: { ...good, dataLoss: null },
    "source.bytes": { ...good, source: { ...good.source, bytes: bytesToBase64(new Uint8Array([1, 2, 3])) } },
  };
  for (const [field, payload] of Object.entries(broken)) {
    await assert.rejects(unsealBundle(reseal(payload, REAL.passphrase, good.source.sha256),
      REAL.passphrase, { crypto: webcrypto }), error => {
        assert.equal(error.code, PAYLOAD_FAILURE, `${field}: expected ${PAYLOAD_FAILURE}`);
        assert.equal(error.field, field.startsWith("migrated.sha256") ? "migrated.state" : field);
        return true;
      });
  }
  // A payload whose own source.sha256 disagrees with the AAD is an AUTH failure,
  // exactly as unseal.cjs decides it — the two decoders must not diverge here.
  await assert.rejects(unsealBundle(reseal({ ...good, source: { ...good.source, sha256: sha(Buffer.from("x")) } },
    REAL.passphrase, good.source.sha256), REAL.passphrase, { crypto: webcrypto }), { code: BUNDLE_FAILURE });
});

test("import on a fresh enrolled phone seeds derived, keeps the original, and survives reopen", async () => {
  const indexedDB = new IDBFactory();
  const client = await ready(indexedDB);
  const opened = await unsealBundle(REAL.bytes, REAL.passphrase, { crypto: webcrypto });
  const before = await activeRevision(indexedDB);
  const result = await client.importBundle(IMPORT);
  assert.deepEqual(result, { imported: true, code: "LOCAL_IMPORT_SEEDED", state: null,
    name: importNameFor(opened.payload.source.sha256), durableRevision: before + 1,
    opsAtImport: 0, rebaseRequired: false });
  assert.equal(result.name, `port:${opened.payload.source.sha256.slice(0, 16)}`);
  // ONE durable revision for the whole import, and it is the revision the
  // result reported — Saved only after the IDB transaction completed.
  assert.equal(await activeRevision(indexedDB), before + 1);

  const booted = await client.boot();
  assert.equal(booted.ready, true);
  assert.equal(booted.ops, 0);
  // ZERO ops, so the cache described nothing and the import may seed it.
  assert.deepEqual(booted.derived, opened.payload.migrated.state);
  assert.equal(booted.derived.v, opened.payload.engine.schemaV);
  assert.equal(booted.derivedStale, false, "a basis of 0 ops over 0 ops is fresh");
  assert.equal(booted.derivedCode, null);
  assert.equal(booted.importRebaseRequired, false);
  assert.equal(booted.imports.length, 1);
  assert.deepEqual(booted.imports[0], { name: result.name, sourceSha256: opened.payload.source.sha256,
    migratedSha256: opened.payload.migrated.sha256, schemaV: opened.payload.engine.schemaV,
    engineSha256: opened.payload.engine.sha256, oracleVerdict: "PASS",
    createdAt: opened.payload.createdAt, importedAt: AT,
    opsBasisAtImport: { opCount: 0, lastOpId: null }, rebaseRequired: false, rebasedAt: null });
  assert.deepEqual(await client.imports(), booted.imports);
  client.close();

  // A WHOLE NEW FACTORY over the same IndexedDB: the import is durable, the
  // custody original is byte-identical to the file port.cjs read on the PC, and
  // its provenance decrypts to what the bundle said.
  const reopenedClient = await openLocalDurableClient(base(indexedDB));
  const again = await reopenedClient.boot();
  assert.equal(again.ready, true);
  assert.deepEqual(again.derived, opened.payload.migrated.state);
  assert.deepEqual(await reopenedClient.imports(), booted.imports);
  const original = await reopenedClient.importOriginal(result.name);
  assert.deepEqual(original.sourceBytes, SOURCE_BYTES);
  assert.equal(sha(Buffer.from(original.sourceBytes)), opened.payload.source.sha256);
  assert.equal(new TextDecoder().decode(original.candidateBytes), opened.migratedJson);
  assert.equal(original.localBytes, null);
  assert.equal(original.context.profile, LOCAL_IMPORT_PROFILE);
  assert.equal(original.context.engine.schemaV, opened.payload.engine.schemaV);
  assert.equal(original.context.oracle.verdict, "PASS");
  assert.equal(original.context.sourceSha256, opened.payload.source.sha256);
  assert.equal(original.checkpointRevision, before);
  reopenedClient.close();
});

test("a second import of the same bundle is a named no-op, never a replace", async () => {
  const indexedDB = new IDBFactory();
  const client = await ready(indexedDB);
  const first = await client.importBundle(IMPORT);
  assert.equal(first.imported, true);
  const settled = await activeRevision(indexedDB);
  const repeat = await client.importBundle(IMPORT);
  assert.deepEqual(repeat, { imported: false, code: "LOCAL_IMPORT_ALREADY_PRESENT", state: null,
    name: first.name, durableRevision: settled, opsAtImport: 0, rebaseRequired: false });
  assert.equal(await activeRevision(indexedDB), settled, "a repeat writes nothing at all");
  assert.equal((await client.imports()).length, 1, "and never a second entry");
  // Even across a whole new factory.
  client.close();
  const second = await openLocalDurableClient(base(indexedDB));
  assert.equal((await second.boot()).ready, true);
  assert.equal((await second.importBundle(IMPORT)).code, "LOCAL_IMPORT_ALREADY_PRESENT");
  assert.equal(await activeRevision(indexedDB), settled);
  second.close();
});

test("a wrong passphrase and a tampered bundle each write NOTHING", async () => {
  const indexedDB = new IDBFactory();
  const client = await ready(indexedDB);
  const before = await activeRevision(indexedDB);
  const wrong = await client.importBundle({ bundleBytes: REAL.bytes, passphrase: "wrong-words-entirely-here" });
  assert.deepEqual(wrong, { imported: false, code: BUNDLE_FAILURE, state: 3, name: null,
    durableRevision: null, opsAtImport: null, rebaseRequired: false });
  const envelope = envelopeOf(REAL.bytes), flipped = base64ToBytes(envelope.ciphertext);
  flipped[flipped.length >> 1] ^= 0x40;
  const tampered = await client.importBundle({ bundleBytes: bytesOf({ ...envelope, ciphertext: bytesToBase64(flipped) }),
    passphrase: REAL.passphrase });
  assert.equal(tampered.imported, false);
  assert.equal(tampered.code, BUNDLE_FAILURE);
  assert.equal(await activeRevision(indexedDB), before, "the revision never moved");
  assert.deepEqual(await client.imports(), []);
  // And no custody original was kept either: the unseal happens before the
  // first load(), so there is nothing to clean up rather than a cleanup path.
  await assert.rejects(client.importOriginal(importNameFor(sha(Buffer.from(SOURCE_BYTES)))),
    { code: "IMPORT_CUSTODY_MISSING" });
  // A good bundle still imports afterwards — a refusal leaves nothing poisoned.
  assert.equal((await client.importBundle(IMPORT)).imported, true);
  client.close();
});

test("FRESH START THEN PORT (DECISIONS:100): the import lands UNDER existing ops and never overwrites derived", async () => {
  const indexedDB = new IDBFactory();
  // A projector, so the cache is genuinely FRESH over the phone's own ops right
  // up to the import. This is the case the cheap "mark it stale" rule gets
  // wrong: a fresh cache that knows nothing about Joe's PC history.
  const seen = [];
  const projector = (generation, context) => {
    seen.push(context.command);
    return { profile: "host-derived/v1", phoneOps: Object.keys(generation.collections.ops).length };
  };
  const client = await ready(indexedDB, { projector });
  for (const lb of [170.6, 170.2]) {
    assert.equal((await client.execute("weighIn", { date: "2026-09-11", lb })).acknowledged, true);
  }
  const beforeBoot = await client.boot();
  assert.equal(beforeBoot.ops, 2);
  assert.equal(beforeBoot.derivedStale, false, "the projector kept the cache fresh over the phone's ops");
  assert.deepEqual(beforeBoot.derived, { profile: "host-derived/v1", phoneOps: 2 });
  const beforeRevision = await activeRevision(indexedDB);

  const opened = await unsealBundle(REAL.bytes, REAL.passphrase, { crypto: webcrypto });
  const result = await client.importBundle(IMPORT);
  assert.deepEqual(result, { imported: true, code: "LOCAL_IMPORT_REBASE_REQUIRED", state: null,
    name: importNameFor(opened.payload.source.sha256), durableRevision: beforeRevision + 1,
    opsAtImport: 2, rebaseRequired: true });

  const after = await client.boot();
  // THE POINT OF THIS CASE. derived.value is UNTOUCHED — the two weigh-ins Joe
  // logged since the fresh start are still what the cache describes — and the
  // import is reported as work outstanding rather than silently applied.
  assert.deepEqual(after.derived, { profile: "host-derived/v1", phoneOps: 2 });
  assert.notDeepEqual(after.derived, opened.payload.migrated.state);
  assert.equal(after.derivedStale, true);
  assert.equal(after.derivedCode, IMPORT_REBASE_CODE);
  assert.equal(after.importRebaseRequired, true);
  assert.equal(after.ops, 2, "no operation was replayed, invented or dropped");
  assert.deepEqual(after.imports[0].opsBasisAtImport, { opCount: 2, lastOpId: "op-dev-phone-A-2" });
  assert.equal(after.imports[0].rebaseRequired, true);
  // The imported base is available to the host's projector, as bytes.
  const original = await client.importOriginal(result.name);
  assert.equal(new TextDecoder().decode(original.candidateBytes), opened.migratedJson);
  client.close();
});

test("saving still works after an import, and the sidecar follows C1's rules unchanged", async () => {
  const indexedDB = new IDBFactory();
  const client = await ready(indexedDB);
  assert.equal((await client.importBundle(IMPORT)).imported, true);
  const afterImport = await activeRevision(indexedDB);
  // No projector: C1 CARRIES the cache unchanged, so the seeded value survives
  // and its basis falls behind the ops — derivedStale true, derivedCode null.
  const saved = await client.execute("weighIn", { date: "2026-09-11", lb: 170.6 });
  assert.equal(saved.acknowledged, true);
  assert.equal(saved.durableRevision, afterImport + 1);
  assert.equal(saved.op_id, "op-dev-phone-A-1", "the import consumed no device sequence");
  const booted = await client.boot();
  assert.equal(booted.ops, 1);
  const opened = await unsealBundle(REAL.bytes, REAL.passphrase, { crypto: webcrypto });
  assert.deepEqual(booted.derived, opened.payload.migrated.state, "the imported base is carried, not discarded");
  assert.equal(booted.derivedStale, true, "one op, a basis of zero: stale, exactly as C1 says");
  assert.equal(booted.derivedCode, null, "older, not damaged, and no rebase was pending");
  assert.equal(booted.importRebaseRequired, false);
  assert.deepEqual(booted.view.layer1.reads, [{ date: "2026-09-11", lb: 170.6, op_id: "op-dev-phone-A-1" }]);
  // Three more saves in a row: an import never makes the write path fragile.
  for (const lb of [170.4, 170.2, 170.0]) {
    assert.equal((await client.execute("weighIn", { date: "2026-09-12", lb })).acknowledged, true);
  }
  assert.equal((await client.boot()).ops, 4);
  assert.equal((await client.imports()).length, 1, "and the import entry rides every later commit");
  client.close();
});

test("markImportRebased is the ONLY thing that clears the flag, and it is the host's word", async () => {
  const indexedDB = new IDBFactory();
  const client = await ready(indexedDB, { projector: () => ({ profile: "host-derived/v1" }) });
  assert.equal((await client.execute("weighIn", { date: "2026-09-11", lb: 170.6 })).acknowledged, true);
  const result = await client.importBundle(IMPORT);
  assert.equal(result.rebaseRequired, true);
  // A later save does NOT clear it: a projector run proves nothing about
  // whether the host folded the imported base in.
  assert.equal((await client.execute("weighIn", { date: "2026-09-12", lb: 170.2 })).acknowledged, true);
  const still = await client.boot();
  assert.equal(still.derivedStale, true);
  assert.equal(still.derivedCode, IMPORT_REBASE_CODE);
  const unknown = await client.markImportRebased("port:0000000000000000");
  assert.deepEqual(unknown, { marked: false, state: 3, code: "LOCAL_IMPORT_UNKNOWN", name: null });
  const before = await activeRevision(indexedDB);
  const marked = await client.markImportRebased(result.name);
  assert.deepEqual(marked, { marked: true, state: null, code: "LOCAL_IMPORT_REBASED",
    name: result.name, durableRevision: before + 1 });
  const cleared = await client.boot();
  assert.equal(cleared.importRebaseRequired, false);
  assert.equal(cleared.derivedCode, null);
  assert.equal(cleared.derivedStale, false, "the projector's own cache is fresh again");
  assert.equal(cleared.imports[0].rebasedAt, AT);
  assert.equal((await client.markImportRebased(result.name)).code, "LOCAL_IMPORT_NOT_PENDING");
  client.close();
});

test("an aborted commit imports NOTHING, and the inactive original it leaves is reused on retry", async () => {
  const fault = faultDatabase();
  const client = await ready(fault.indexedDB);
  const before = await activeRevision(fault.indexedDB);
  fault.state.armed = true; fault.state.mode = "quota";
  const refused = await client.importBundle(IMPORT);
  fault.state.armed = false; fault.state.mode = null;
  assert.equal(refused.imported, false);
  assert.equal(refused.state, 3);
  // The generation never moved, so there is NO import — metadata.imports is
  // what makes one real, and it is written in the aborted transaction.
  assert.equal(await activeRevision(fault.indexedDB), before);
  assert.deepEqual(await client.imports(), []);
  const booted = await client.boot();
  assert.equal(booted.importRebaseRequired, false);
  assert.deepEqual(booted.derived, { profile: "host-clean-init", s: { v: 1 } }, "derived was not seeded");
  // Custody DID keep the original, in its own earlier transaction. That is the
  // shape its own module documents: an immutable INACTIVE original, pending
  // activation. A retry finds it and reuses it byte for byte rather than
  // failing IMPORT_CUSTODY_ID_CONFLICT on a checkpoint that has since moved.
  const name = importNameFor(sha(Buffer.from(SOURCE_BYTES)));
  const stranded = await client.importOriginal(name);
  assert.deepEqual(stranded.sourceBytes, SOURCE_BYTES);
  assert.equal((await client.execute("weighIn", { date: "2026-09-11", lb: 170 })).acknowledged, true,
    "and the checkpoint the custody record pinned is now stale");
  const retry = await client.importBundle(IMPORT);
  assert.equal(retry.imported, true);
  assert.equal(retry.name, name);
  assert.equal(retry.opsAtImport, 1);
  assert.deepEqual((await client.importOriginal(name)).sourceBytes, SOURCE_BYTES);
  client.close();
});

test("an import is refused before boot(), after close(), and under an unusable name", async () => {
  const indexedDB = new IDBFactory();
  const unbooted = await openLocalDurableClient(base(indexedDB));
  assert.deepEqual(await unbooted.importBundle(IMPORT),
    { imported: false, code: "LOCAL_IMPORT_BOOT_REQUIRED", state: 18, name: null,
      durableRevision: null, opsAtImport: null, rebaseRequired: false });
  assert.equal((await unbooted.enroll({ profile: "host-clean-init" })).enrolled, true);
  assert.equal((await unbooted.importBundle(IMPORT)).code, "LOCAL_IMPORT_BOOT_REQUIRED",
    "enrolled is not booted: boot() is where the lease renewal runs");
  assert.equal((await unbooted.boot()).ready, true);
  assert.equal((await unbooted.importBundle({ ...IMPORT, name: "not a valid name" })).code, "LOCAL_IMPORT_NAME_INVALID");
  assert.equal(await activeRevision(indexedDB), 1);
  unbooted.close();
  assert.equal((await unbooted.importBundle(IMPORT)).code, "LOCAL_CLIENT_CLOSED");
  await assert.rejects(unbooted.imports(), { code: "LOCAL_CLIENT_CLOSED" });
  await assert.rejects(unbooted.importOriginal("port:aaaaaaaaaaaaaaaa"), { code: "LOCAL_CLIENT_CLOSED" });
  assert.equal((await unbooted.markImportRebased("port:aaaaaaaaaaaaaaaa")).code, "LOCAL_CLIENT_CLOSED");
});

test("a lapsed era refuses an import with LOCAL_LEASE_EXPIRED / 20, not the boot fence's 18", async () => {
  const indexedDB = new IDBFactory();
  const client = await ready(indexedDB);
  client.close();
  // Day 1000: the era was never opened inside its 400-day window, so it lapsed.
  // The data is perfectly READABLE — 18 would say "stored truth needs recovery"
  // about a generation that is fine. The truth is 20: the write allowance ran
  // out. C1b made that correction for hostBindings(); an import is a durable
  // write too, so it has to answer the same way.
  const later = new Date(Date.parse(AT) + 1000 * 86400000).toISOString();
  const lapsed = await openLocalDurableClient(base(indexedDB,
    { clock: { now: () => later, today: () => later.slice(0, 10), tz: "+00:00", monotonicMs: () => 0 } }));
  assert.deepEqual(lapsed.status(), { state: "restore-required", code: "LOCAL_LEASE_EXPIRED" });
  const booted = await lapsed.boot();
  assert.equal(booted.ready, false);
  assert.equal(booted.readable, true);
  assert.equal(booted.leaseExpired, true);
  const refusedImport = await lapsed.importBundle(IMPORT);
  assert.equal(refusedImport.code, "LOCAL_LEASE_EXPIRED");
  assert.equal(refusedImport.state, 20);
  assert.equal(refusedImport.imported, false);
  assert.equal((await lapsed.markImportRebased("port:aaaaaaaaaaaaaaaa")).code, "LOCAL_LEASE_EXPIRED");
  assert.equal(await activeRevision(indexedDB), 1, "nothing was written");
  // Reads still work on a lapsed era: the data is intact, only writing stops.
  assert.deepEqual(await lapsed.imports(), []);
  lapsed.close();
});

test("a different bundle under a name already taken is refused rather than replacing the original", async () => {
  const indexedDB = new IDBFactory();
  const client = await ready(indexedDB);
  assert.equal((await client.importBundle({ ...IMPORT, name: "port:chosen-by-hand" })).imported, true);
  const settled = await activeRevision(indexedDB);
  // A DIFFERENT payload, honestly sealed, offered under the same name. "Same
  // name" is not "same file": the recorded source hash decides, so this is
  // NAME_TAKEN and not the reassuring ALREADY_PRESENT.
  const good = Unseal.unseal(Buffer.from(REAL.bytes), REAL.passphrase);
  const otherState = { ...good.migrated.state, v: good.migrated.state.v };
  otherState.__c2bProbe = "a different migrated state";
  const otherJson = JSON.stringify(otherState);
  const otherSource = new Uint8Array(Buffer.from(otherJson, "utf8"));
  const otherSha = sha(Buffer.from(otherSource));
  const other = reseal({ ...good, source: { sha256: otherSha, bytes: bytesToBase64(otherSource) },
    migrated: { sha256: sha(Buffer.from(otherJson, "utf8")), state: otherState } }, REAL.passphrase, otherSha);
  const refusedResult = await client.importBundle({ bundleBytes: other, passphrase: REAL.passphrase, name: "port:chosen-by-hand" });
  assert.equal(refusedResult.imported, false);
  assert.equal(refusedResult.code, "LOCAL_IMPORT_NAME_TAKEN");
  assert.equal(refusedResult.name, "port:chosen-by-hand");
  assert.equal(await activeRevision(indexedDB), settled, "refused before staging, so nothing was written");
  assert.equal((await client.imports()).length, 1);
  assert.deepEqual((await client.importOriginal("port:chosen-by-hand")).sourceBytes, SOURCE_BYTES,
    "the first original is still the one on disk");
  // Under its OWN derived name it imports cleanly, alongside the first. Both
  // originals survive; the zero-op seed is last-wins, which is stated in the
  // module's design notes rather than left for a reader to discover.
  const second = await client.importBundle({ bundleBytes: other, passphrase: REAL.passphrase });
  assert.equal(second.imported, true);
  assert.equal(second.name, importNameFor(otherSha));
  assert.equal((await client.imports()).length, 2);
  assert.equal((await client.boot()).derived.__c2bProbe, "a different migrated state");
  assert.deepEqual((await client.importOriginal("port:chosen-by-hand")).sourceBytes, SOURCE_BYTES);
  client.close();
});

test("the module-level entry points accept a client, and the helpers judge a generation", async () => {
  const indexedDB = new IDBFactory();
  const client = await ready(indexedDB);
  // The brief's signature — importBundle(localClient, {...}) — and the methods
  // are one code path: the free function delegates to the client's own method.
  const result = await importBundle(client, IMPORT);
  assert.equal(result.imported, true);
  assert.deepEqual(await listImports(client), await client.imports());
  assert.deepEqual((await importOriginal(client, result.name)).sourceBytes, SOURCE_BYTES);
  assert.equal((await markImportRebased(client, result.name)).code, "LOCAL_IMPORT_NOT_PENDING");
  // Anything that is neither a client nor the factory's internal scope.
  assert.throws(() => listImports({}), { code: "LOCAL_IMPORT_SCOPE_REQUIRED" });
  assert.throws(() => importBundle(null, IMPORT), { code: "LOCAL_IMPORT_SCOPE_REQUIRED" });
  // Pure helpers over a generation shape.
  assert.deepEqual(importSummaries({ metadata: {} }), []);
  assert.equal(importRebasePending({ metadata: { imports: [{ name: "a", rebaseRequired: true }] } }), true);
  assert.equal(importRebaseCode({ metadata: { imports: [{ name: "a", rebaseRequired: false }] } }), null);
  assert.equal(importRebaseCode({ metadata: { imports: "not an array" } }), null);
  assert.equal(importNameFor("b5eb62d459d6e58bfb26bfa65f772db193998825166d7538403dad41eddda499"), "port:b5eb62d459d6e58b");
  client.close();
});
