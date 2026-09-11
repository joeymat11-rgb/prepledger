// import-bundle.mjs — THE PHONE SIDE OF JOE'S PORT (C2b).
//
// C2 (rebuild/m3/setup/port/) migrates his ledger on the PC, runs the frozen
// port-oracle over the engine that did it, and seals the result into one file.
// unseal.cjs is that file's REFERENCE DECODER and the single source of the
// sealing parameters. This module is the SECOND implementation of the same
// parameters, on WebCrypto, so the phone can open the bundle in a browser with
// no Node crypto and no dependency — and the test proves a bundle sealed by
// port.cjs opens here byte for byte. rebuild/m3/setup/port/** is NOT edited:
// the contract is reused, not changed.
//
// WHAT AN IMPORT IS, AND WHAT IT IS NOT
//
// OPS ARE TRUTH. That rule is C1's and it does not bend for an import. The
// operations in collections.ops are the only record of what the athlete did on
// THIS phone; collections.derived is a cache of engine state computed from them.
// So an import does exactly two durable things:
//   * it keeps the ORIGINAL source bytes, immutable and named, through
//     import-custody.mjs — the same custody the recovery work already uses, in
//     the same generations store, sealed under the same device key; and
//   * it records that the import happened, in metadata.imports[].
// Seeding collections.derived with the migrated state is a THIRD thing, and it
// is allowed in exactly one case: a generation with ZERO operations. There the
// cache describes no ops, so replacing its value invents nothing and the host's
// engine starts from Joe's real history.
//
// THE FRESH-START-THEN-PORT CASE (DECISIONS.md:100). Joe starts FRESH at S2 and
// the port lands UNDERNEATH later, so the phone that imports may already hold
// local-era operations. Overwriting derived.value there would silently discard
// everything he logged since S2 — the cache would describe the PC's history
// while the ops describe the phone's. So the import does not touch derived.value
// at all. It records rebaseRequired on the import entry, and boot() reports
// derivedStale with derivedCode IMPORT_REBASE_REQUIRED, which is the existing
// C1 signal for "rebuild from ops". THE REBASE ITSELF IS THE HOST'S PROJECTOR'S
// JOB. C2b never replays an operation: it has no engine, it does not know what a
// weighIn means, and a module that replayed ops would be a second engine beside
// the real one. It hands the host the imported base (importOriginal) and the
// ops, and the host's projector computes the state.
//
// This module imports local-client.mjs and local-client.mjs imports this one —
// the same deliberate cycle host-bindings.mjs already uses. Neither side touches
// the other's bindings at module-evaluation time, only inside functions.
import { StorageFailure } from "../repository.mjs";
import { parseStrictJson } from "../strict-json.mjs";
import { opsBasis, DERIVED, LOCAL_SCOPE } from "./local-client.mjs";

// --- THE SEAL CONTRACT, COPIED FROM unseal.cjs AND PINNED BY A TEST ----------
// These five constants are the whole compatibility surface. The test does not
// take them on trust: it imports unseal.cjs and asserts each one matches, so a
// change on either side fails here rather than on Joe's phone at 6am.
export const BUNDLE_PROFILE = "earned/local-import-bundle/v1";
export const KDF = Object.freeze({ name: "PBKDF2", hash: "SHA-256", iterations: 600000, saltBytes: 16, keyBits: 256 });
export const CIPHER = Object.freeze({ name: "AES-GCM", keyBits: 256, ivBytes: 12, tagBits: 128 });
export const TAG_BYTES = CIPHER.tagBits / 8;
// Every structural, key or tag failure raises the SAME code. unseal.cjs states
// the reason and it holds here: a decoder that tells "bad passphrase" apart from
// "bad bytes" tells an attacker which half to keep working on, and tells Joe
// nothing he can act on either — he retypes the words or refetches the file.
export const BUNDLE_FAILURE = "BUNDLE_AUTH_FAILED";
// A well-sealed bundle whose PAYLOAD is the wrong shape is a different fact: the
// passphrase was right and the bytes are intact, so this is an encoder that does
// not speak this profile. It names the field, never the value.
export const PAYLOAD_FAILURE = "BUNDLE_PAYLOAD_INVALID";
export const LOCAL_IMPORT_PROFILE = "earned/local-import/v1";
export const IMPORT_REBASE_CODE = "IMPORT_REBASE_REQUIRED";
const HEX64 = /^[0-9a-f]{64}$/;
const encoder = new TextEncoder();
const clone = value => structuredClone(value);
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);

function fail(code, state = 3, extra = null) {
  const error = new StorageFailure(code, state);
  if (extra) Object.assign(error, extra);
  throw error;
}

// base64 through the platform's own atob/btoa — no node:buffer, so the same
// bytes run in the phone bundle. Chunked because String.fromCharCode.apply
// overflows the argument stack somewhere around 100k characters and the
// ciphertext here is half a megabyte.
export function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
// unseal.cjs round-trips every base64 field because Buffer.from is lenient and a
// mangled field would silently shrink. atob is stricter than Buffer, but the
// round-trip is kept anyway: it is the check that makes both decoders refuse the
// same inputs, and it costs one pass over bytes already in memory.
export function base64ToBytes(value, expectedLength) {
  if (typeof value !== "string") fail(BUNDLE_FAILURE);
  let binary;
  try { binary = atob(value); } catch { fail(BUNDLE_FAILURE); }
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i) & 0xff;
  if (bytesToBase64(out) !== value) fail(BUNDLE_FAILURE);
  if (expectedLength !== undefined && out.length !== expectedLength) fail(BUNDLE_FAILURE);
  return out;
}

export async function sha256Hex(crypto, bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

// The AAD binds the sealed payload to the ORIGINAL source bytes: re-pointing a
// bundle at a different ledger changes sourceSha256 and the tag stops verifying.
// JSON.stringify of a two-element array of plain strings is byte-identical in
// Node and in every browser, which is what lets the two decoders agree.
export function aadBytes(sourceSha256) {
  if (typeof sourceSha256 !== "string" || !HEX64.test(sourceSha256)) fail("BUNDLE_AAD_INVALID");
  return encoder.encode(JSON.stringify([BUNDLE_PROFILE, sourceSha256]));
}

// NFKD so a passphrase typed on the phone keyboard derives the same key as one
// typed on the PC. unseal.cjs says the same; the word list is plain ASCII, so
// this is belt and braces — but the phone is exactly where it stops being so.
async function deriveKey(crypto, passphrase, salt, iterations) {
  if (typeof passphrase !== "string" || !passphrase) fail(BUNDLE_FAILURE);
  if (!(salt instanceof Uint8Array) || salt.length !== KDF.saltBytes) fail(BUNDLE_FAILURE);
  // unseal.cjs refuses any iteration count but its own, so an attacker cannot
  // hand Joe a bundle that claims 1 round. Refused here for the same reason.
  if (!Number.isSafeInteger(iterations) || iterations !== KDF.iterations) fail(BUNDLE_FAILURE);
  let material;
  try {
    material = await crypto.subtle.importKey("raw", encoder.encode(passphrase.normalize("NFKD")), "PBKDF2", false, ["deriveKey"]);
    return await crypto.subtle.deriveKey({ name: KDF.name, hash: KDF.hash, salt, iterations },
      material, { name: CIPHER.name, length: CIPHER.keyBits }, false, ["decrypt"]);
  } catch { fail(BUNDLE_FAILURE); }
}

function envelopeOf(bundleBytes) {
  let text;
  if (bundleBytes instanceof Uint8Array) text = new TextDecoder().decode(bundleBytes);
  else if (bundleBytes instanceof ArrayBuffer) text = new TextDecoder().decode(new Uint8Array(bundleBytes));
  else if (typeof bundleBytes === "string") text = bundleBytes;
  else fail(BUNDLE_FAILURE);
  let env;
  try { env = JSON.parse(text); } catch { fail(BUNDLE_FAILURE); }
  if (!object(env) || env.profile !== BUNDLE_PROFILE) fail(BUNDLE_FAILURE);
  const kdf = env.kdf, cipher = env.cipher;
  if (!kdf || !cipher || kdf.name !== KDF.name || kdf.hash !== KDF.hash ||
      cipher.name !== CIPHER.name || cipher.keyBits !== CIPHER.keyBits ||
      cipher.ivBytes !== CIPHER.ivBytes || cipher.tagBits !== CIPHER.tagBits) fail(BUNDLE_FAILURE);
  if (!Array.isArray(env.aad) || env.aad.length !== 2 || env.aad[0] !== BUNDLE_PROFILE ||
      typeof env.aad[1] !== "string" || !HEX64.test(env.aad[1])) fail(BUNDLE_FAILURE);
  return env;
}

// --- THE PAYLOAD SHAPE, CHECKED STRICTLY -------------------------------------
//
// The tag already proves nobody edited the payload. This is a different
// question: does this bundle say what THIS importer needs, in the shape it
// needs? An encoder that shipped a bundle with no engine.schemaV, or a
// migrated.state whose hash does not describe it, is a bug on the PC — and the
// phone is the wrong place to discover it halfway through a durable commit.
//
// HOW migrated.sha256 IS COMPUTED, AND WHY RE-STRINGIFY REPRODUCES IT.
// port.cjs takes it from rebuild/m4/import/prepare.cjs:67-70, which is
//   sha256(utf8(JSON.stringify(candidate)))
// — PLAIN JSON.stringify, NOT a sorted or otherwise canonical form. That is
// safe to re-check here because the bytes that were hashed are themselves
// stringify output: JSON.stringify emits integer-like keys first in ascending
// order and every other key in insertion order, JSON.parse rebuilds an object
// with exactly that enumeration order, so stringify(parse(s)) === s for any s
// stringify produced. The test asserts it on the real 154 KB preimage rather
// than leaving it as an argument.
async function payloadOf(crypto, plain, sourceSha256) {
  let payload;
  try { payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(plain)); } catch { fail(BUNDLE_FAILURE); }
  // unseal.cjs checks exactly these two and no more before returning, because
  // the tag proves the rest. Same two, same code, same place in the sequence.
  if (!object(payload) || payload.profile !== BUNDLE_PROFILE || !object(payload.source) ||
      payload.source.sha256 !== sourceSha256) fail(BUNDLE_FAILURE);
  const bad = field => fail(PAYLOAD_FAILURE, 3, { field });
  if (typeof payload.createdAt !== "string" || !Number.isFinite(Date.parse(payload.createdAt))) bad("createdAt");
  if (!object(payload.engine) || !HEX64.test(payload.engine.sha256 ?? "")) bad("engine.sha256");
  if (!Number.isSafeInteger(payload.engine.schemaV) || payload.engine.schemaV < 1) bad("engine.schemaV");
  if (typeof payload.source.bytes !== "string") bad("source.bytes");
  if (!object(payload.migrated) || !HEX64.test(payload.migrated.sha256 ?? "")) bad("migrated.sha256");
  if (!object(payload.migrated.state)) bad("migrated.state");
  if (!object(payload.oracle) || typeof payload.oracle.verdict !== "string") bad("oracle.verdict");
  if (!object(payload.dataLoss)) bad("dataLoss");
  if (payload.local !== undefined && (!object(payload.local) || typeof payload.local.bytes !== "string" ||
      !HEX64.test(payload.local.sha256 ?? ""))) bad("local");
  return payload;
}

/* unsealBundle — open a sealed C2 port bundle on WebCrypto alone.
   Returns { payload, sourceBytes, localBytes, migratedJson }: the decoded
   payload plus the three derived byte strings every caller needs, so nobody
   base64-decodes a 500 KB field twice or re-stringifies the state by hand.
   Throws StorageFailure(BUNDLE_AUTH_FAILED) for anything the tag or the
   envelope refuses, and StorageFailure(BUNDLE_PAYLOAD_INVALID) with a `field`
   for a well-sealed bundle this profile cannot read. Writes nothing, ever. */
export async function unsealBundle(bundleBytes, passphrase, { crypto = globalThis.crypto } = {}) {
  if (!crypto?.subtle) fail("LOCAL_CRYPTO_UNAVAILABLE", 18);
  const env = envelopeOf(bundleBytes);
  const sourceSha256 = env.aad[1];
  const salt = base64ToBytes(env.kdf.salt, KDF.saltBytes);
  const iv = base64ToBytes(env.cipher.iv, CIPHER.ivBytes);
  const sealed = base64ToBytes(env.ciphertext);
  if (sealed.length <= TAG_BYTES) fail(BUNDLE_FAILURE);
  const key = await deriveKey(crypto, passphrase, salt, env.kdf.iterations);
  let plain;
  try {
    // port.cjs APPENDS the 16-byte tag, which is the WebCrypto convention — so
    // the whole buffer goes to decrypt unchanged and nothing is split here.
    plain = new Uint8Array(await crypto.subtle.decrypt(
      { name: CIPHER.name, iv, additionalData: aadBytes(sourceSha256), tagLength: CIPHER.tagBits }, key, sealed));
  } catch { fail(BUNDLE_FAILURE); }
  const payload = await payloadOf(crypto, plain, sourceSha256);
  const sourceBytes = base64ToBytes(payload.source.bytes);
  if (await sha256Hex(crypto, sourceBytes) !== payload.source.sha256) fail(PAYLOAD_FAILURE, 3, { field: "source.bytes" });
  const migratedJson = JSON.stringify(payload.migrated.state);
  if (await sha256Hex(crypto, encoder.encode(migratedJson)) !== payload.migrated.sha256)
    fail(PAYLOAD_FAILURE, 3, { field: "migrated.state" });
  let localBytes = null;
  if (payload.local !== undefined) {
    localBytes = base64ToBytes(payload.local.bytes);
    if (await sha256Hex(crypto, localBytes) !== payload.local.sha256) fail(PAYLOAD_FAILURE, 3, { field: "local.bytes" });
  }
  return { payload, sourceBytes, localBytes, migratedJson };
}

// --- NAMES, ENTRIES AND THE REBASE MARKING -----------------------------------
//
// The default name is derived from the source, not from the clock or a counter,
// so importing the same bundle twice is a no-op BY CONSTRUCTION rather than by
// remembering to check. 16 hex characters is 64 bits of the source hash; the
// full hash is recorded on the entry and the custody bytes are compared before
// any name is reused, so a truncation collision cannot silently replace a file.
export const importNameFor = sourceSha256 => `port:${sourceSha256.slice(0, 16)}`;
// import-custody.mjs's own id rule (validId). Checked here so an override is
// refused with a name a caller can act on, not with a custody INPUT code.
const VALID_NAME = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/;

export function importEntries(generation) {
  const entries = generation?.metadata?.imports;
  return Array.isArray(entries) ? entries.filter(object) : [];
}
export const importSummaries = generation => importEntries(generation).map(entry => ({
  name: entry.name, sourceSha256: entry.sourceSha256, migratedSha256: entry.migratedSha256,
  schemaV: entry.schemaV ?? null, engineSha256: entry.engineSha256 ?? null,
  oracleVerdict: entry.oracleVerdict ?? null, createdAt: entry.createdAt ?? null,
  importedAt: entry.importedAt, opsBasisAtImport: clone(entry.opsBasisAtImport ?? null),
  rebaseRequired: entry.rebaseRequired === true, rebasedAt: entry.rebasedAt ?? null }));

// WHY THIS IS A STICKY FLAG AND NOT AN INFERENCE. The obvious cheap rule — mark
// it while the sidecar is stale — is WRONG, and wrong in the dangerous
// direction. A host whose projector kept the cache fresh over the phone's own
// ops has a sidecar that is fresh with respect to those ops and knows nothing
// about the imported history, so the cheap rule would report "fine" over a
// cache that is missing Joe's entire PC ledger. Nothing this module can read
// tells it whether the host folded the import in; only the host knows. So the
// flag is set by the import and cleared by markImportRebased(name) — an
// acknowledgement, not a guess.
export const importRebasePending = generation => importEntries(generation).some(entry => entry.rebaseRequired === true);

// --- THE DURABLE SIDE --------------------------------------------------------
const MAX_ATTEMPTS = 4;
const sameBytes = (a, b) => a instanceof Uint8Array && b instanceof Uint8Array &&
  a.length === b.length && a.every((byte, index) => byte === b[index]);

function scopeOf(target) {
  if (!target || target[LOCAL_SCOPE] !== true) fail("LOCAL_IMPORT_SCOPE_REQUIRED", 18);
  return target;
}
// Same fence as hostBindings(): an import is a durable write, so it is refused
// unless boot() has reported ready. boot() is where the era's lease self-renewal
// runs, and an import must never be the thing that discovers a lapsed era.
function refuseUnlessWritable(scope) {
  const status = scope.client ? scope.client.status() : null;
  if (!scope.alive()) return { state: 3, code: "LOCAL_CLIENT_CLOSED" };
  if (status?.code === "LOCAL_LEASE_EXPIRED") return { state: 20, code: "LOCAL_LEASE_EXPIRED" };
  if (!scope.booted()) return { state: 18, code: "LOCAL_IMPORT_BOOT_REQUIRED" };
  return null;
}
const refused = (failure, extra = {}) => ({ imported: false, code: failure.code, state: failure.state,
  name: null, durableRevision: null, opsAtImport: null, rebaseRequired: false, ...extra });

function custodyOf(scope) {
  return scope.repository.importCustody({ parseStrictJson,
    validateContext: () => (scope.alive() ? null : { code: "LOCAL_CLIENT_CLOSED", state: 3 }) });
}

// What import-custody keeps: the ORIGINAL source bytes exactly as the PC read
// them, the migrated state as the bytes its own hash describes, the local file
// if the port merged one, and the bundle's provenance as JSON. custody re-parses
// all four with the W6 strict parser, so a bundle carrying a duplicate key or a
// BOM is refused before anything is written — port.cjs already refuses those at
// PREPARE, so a bundle that exists has passed the same parser once already.
function custodyMaterial(opened) {
  const { payload, sourceBytes, localBytes, migratedJson } = opened;
  return { sourceBytes, candidateBytes: encoder.encode(migratedJson), localBytes,
    engineContextJson: JSON.stringify({ profile: LOCAL_IMPORT_PROFILE, bundleProfile: payload.profile,
      createdAt: payload.createdAt, engine: payload.engine, sourceSha256: payload.source.sha256,
      migratedSha256: payload.migrated.sha256, oracle: payload.oracle, dataLoss: payload.dataLoss,
      census: payload.census ?? null, local: payload.local ? { sha256: payload.local.sha256 } : null }) };
}

// The custody record is IMMUTABLE and INACTIVE by its own module's rule, and it
// is staged in its OWN transaction — import-custody.mjs cannot be handed one,
// and editing it is out of scope for C2b. So the sequence is: keep the original
// first, then commit the generation that ADOPTS it. A crash between the two
// leaves a named, inactive original and NO import: metadata.imports is what
// makes an import real, and it is written in one repository.commit with the
// derived seeding. A retry finds the original and reuses it byte for byte,
// which is why this helper exists rather than a bare stage() call.
async function keepOriginal(custody, name, expected, material) {
  let existing = null;
  try { existing = await custody.load(name); }
  catch (error) { if (error?.code !== "IMPORT_CUSTODY_MISSING") throw error; }
  if (existing) {
    if (!sameBytes(existing.sourceBytes, material.sourceBytes) ||
        !sameBytes(existing.candidateBytes, material.candidateBytes)) fail("LOCAL_IMPORT_NAME_TAKEN", 3);
    return "reused";
  }
  await custody.stage(name, expected, material);
  return "staged";
}

function importEntryFor({ payload, name, basis, importedAt, rebaseRequired }) {
  return { profile: LOCAL_IMPORT_PROFILE, name, sourceSha256: payload.source.sha256,
    migratedSha256: payload.migrated.sha256, schemaV: payload.engine.schemaV,
    engineSha256: payload.engine.sha256, oracleVerdict: payload.oracle.verdict,
    createdAt: payload.createdAt, importedAt,
    opsBasisAtImport: { opCount: basis.opCount, lastOpId: basis.lastOpId },
    rebaseRequired, rebasedAt: null };
}

// Not a refusal — the import already happened, so `state` stays null rather
// than borrowing a failure state to describe a success that is already durable.
const existingResult = (entry, revision) => ({ imported: false, code: "LOCAL_IMPORT_ALREADY_PRESENT",
  state: null, name: entry.name, durableRevision: revision,
  opsAtImport: entry.opsBasisAtImport?.opCount ?? null, rebaseRequired: entry.rebaseRequired === true });

/* importBundle(localClient, {bundleBytes, passphrase, name}) — ONE durable
   commit that adopts a sealed C2 port bundle into this installation.

   Result: {imported, code, state, name, durableRevision, opsAtImport,
            rebaseRequired}
   SAVED SEMANTICS, as everywhere in the local era: `imported: true` is returned
   only after the IndexedDB transaction COMPLETED. An abort — quota, a kill, a
   refused validator — returns imported:false and leaves the previous generation
   exactly as it was, custody included (the original is inactive until an entry
   in metadata.imports adopts it). */
async function runImport(scope, { bundleBytes, passphrase, name } = {}) {
  const blocked = refuseUnlessWritable(scope);
  if (blocked) return refused(blocked);
  let opened;
  // NOTHING HAS TOUCHED STORAGE YET. A wrong passphrase or a tampered byte
  // fails here, before the first load(), which is what makes "no write" a
  // property of the sequence rather than of a cleanup path.
  try { opened = await unsealBundle(bundleBytes, passphrase, { crypto: scope.crypto }); }
  catch (error) {
    return refused({ code: error?.code || BUNDLE_FAILURE, state: error?.state ?? 3 },
      error?.field ? { field: error.field } : {});
  }
  const chosen = name === undefined ? importNameFor(opened.payload.source.sha256) : name;
  if (typeof chosen !== "string" || !VALID_NAME.test(chosen))
    return refused({ code: "LOCAL_IMPORT_NAME_INVALID", state: 3 });
  const material = custodyMaterial(opened), custody = custodyOf(scope);
  const importedAt = scope.clock.now();
  if (typeof importedAt !== "string" || !Number.isFinite(Date.parse(importedAt)))
    return refused({ code: "LOCAL_CLOCK_UNUSABLE", state: 3 });
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const snapshot = await scope.repository.load();
      const already = importEntries(snapshot.generation).find(entry => entry.name === chosen);
      // A repeat is a NAMED no-op, never a replace: the original is immutable by
      // custody's own rule and the entry is history. Checked before staging, so
      // a second import writes nothing at all.
      //
      // But "same name" is not "same file". The default name is derived from the
      // source hash, so a repeat under it really is the same bundle — a CHOSEN
      // name is not, and answering ALREADY_PRESENT to a different ledger offered
      // under a taken name would tell Joe the wrong thing in the one case where
      // it matters. So the recorded source hash decides, not the name.
      if (already) {
        if (already.sourceSha256 !== opened.payload.source.sha256)
          return refused({ code: "LOCAL_IMPORT_NAME_TAKEN", state: 3 },
            { name: chosen, durableRevision: snapshot.revision });
        return existingResult(already, snapshot.revision);
      }
      const basis = opsBasis(snapshot.generation);
      await keepOriginal(custody, chosen, { revision: snapshot.revision, token: snapshot.token }, material);
      const rebaseRequired = basis.opCount > 0;
      const next = clone(snapshot.generation);
      next.metadata.imports = [...importEntries({ metadata: next.metadata }),
        importEntryFor({ payload: opened.payload, name: chosen, basis, importedAt, rebaseRequired })];
      // THE ONE PLACE derived.value MAY BE REPLACED: a generation with zero
      // operations. The cache describes nothing, so seeding it invents nothing.
      // TWO imports onto a zero-op generation is therefore LAST-WINS for the
      // cache. That is not a workflow — there is one port — but it is what the
      // code does, and it loses nothing: both originals stay in custody under
      // their own names and both entries stay in metadata.imports.
      if (!rebaseRequired) next.collections[DERIVED] = { basis: { opCount: 0, lastOpId: null },
        value: clone(opened.payload.migrated.state) };
      const commit = await scope.repository.commit(snapshot, next,
        () => (scope.alive() ? null : { state: 3, code: "LOCAL_CLIENT_CLOSED" }));
      return { imported: true, code: rebaseRequired ? "LOCAL_IMPORT_REBASE_REQUIRED" : "LOCAL_IMPORT_SEEDED",
        state: null, name: chosen, durableRevision: commit.revision, opsAtImport: basis.opCount, rebaseRequired };
    } catch (error) {
      if (error instanceof StorageFailure && error.retryable && attempt + 1 < MAX_ATTEMPTS) continue;
      return refused({ code: error?.code || "LOCAL_IMPORT_FAILED", state: error?.state ?? 3 });
    }
  }
  return refused({ code: "LOCAL_IMPORT_CONTENDED", state: 3 });
}

/* The read side. imports() is a plain read of the sealed generation's own
   metadata — no custody decryption, so a host can render "ported from the PC on
   the 11th" without touching 300 KB of originals. */
async function runImports(scope) {
  if (!scope.alive()) fail("LOCAL_CLIENT_CLOSED", 3);
  return importSummaries((await scope.repository.load()).generation);
}

/* importOriginal(name) — the bytes Joe's PC actually read, authenticated.
   custody.load decrypts under the device key and re-parses all four fields with
   the strict parser, so a record that was tampered with in the store fails here
   rather than being handed back as "his history". */
async function runImportOriginal(scope, name) {
  if (!scope.alive()) fail("LOCAL_CLIENT_CLOSED", 3);
  if (typeof name !== "string" || !VALID_NAME.test(name)) fail("LOCAL_IMPORT_NAME_INVALID", 3);
  const loaded = await custodyOf(scope).load(name);
  let context = null;
  try { context = JSON.parse(loaded.engineContextJson); } catch { /* reported as null, never thrown away silently */ }
  return { name, sourceBytes: loaded.sourceBytes, candidateBytes: loaded.candidateBytes,
    localBytes: loaded.localBytes, context, checkpointRevision: loaded.checkpoint.revision };
}

/* markImportRebased(name) — the host says it has rebuilt engine state from the
   imported base plus the ops it already held. C2b cannot observe that: nothing
   in the sidecar distinguishes a projection that folded the import in from one
   that ignored it, and guessing would be worse than asking. So this is an
   acknowledgement the host makes, in its own durable commit, and it is the only
   thing that clears IMPORT_REBASE_REQUIRED. It never touches derived. */
async function runMarkRebased(scope, name) {
  const blocked = refuseUnlessWritable(scope);
  if (blocked) return { marked: false, ...blocked, name: null };
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const snapshot = await scope.repository.load();
      const entries = importEntries(snapshot.generation);
      const index = entries.findIndex(entry => entry.name === name);
      if (index < 0) return { marked: false, state: 3, code: "LOCAL_IMPORT_UNKNOWN", name: null };
      if (entries[index].rebaseRequired !== true)
        return { marked: false, state: null, code: "LOCAL_IMPORT_NOT_PENDING", name,
          durableRevision: snapshot.revision };
      const next = clone(snapshot.generation);
      next.metadata.imports = importEntries({ metadata: next.metadata }).map((entry, at) =>
        at === index ? { ...entry, rebaseRequired: false, rebasedAt: scope.clock.now() } : entry);
      const commit = await scope.repository.commit(snapshot, next,
        () => (scope.alive() ? null : { state: 3, code: "LOCAL_CLIENT_CLOSED" }));
      return { marked: true, state: null, code: "LOCAL_IMPORT_REBASED", name, durableRevision: commit.revision };
    } catch (error) {
      if (error instanceof StorageFailure && error.retryable && attempt + 1 < MAX_ATTEMPTS) continue;
      return { marked: false, state: error?.state ?? 3, code: error?.code || "LOCAL_IMPORT_REBASE_MARK_FAILED", name: null };
    }
  }
  return { marked: false, state: 3, code: "LOCAL_IMPORT_CONTENDED", name: null };
}

// --- ENTRY POINTS ------------------------------------------------------------
// Each takes EITHER an opened local client (the brief's signature) or the
// factory's own internal scope (what local-client.mjs's additive methods pass).
// A client is delegated to its own method so there is exactly one code path.
const dispatch = (target, method, run, ...args) => (target && typeof target[method] === "function" && target[LOCAL_SCOPE] !== true
  ? target[method](...args) : run(scopeOf(target), ...args));

export const importBundle = (target, options) => dispatch(target, "importBundle", runImport, options);
export const listImports = target => dispatch(target, "imports", runImports);
export const importOriginal = (target, name) => dispatch(target, "importOriginal", runImportOriginal, name);
export const markImportRebased = (target, name) => dispatch(target, "markImportRebased", runMarkRebased, name);

// Used by local-client.mjs boot(). Returns the derivedCode to report, or null.
// It does NOT overrule a more specific sidecar fault: a malformed cache keeps
// its own code, because that names damage while this names work outstanding —
// and both answers are "the host must rebuild from ops", which is the only
// thing the caller does with either.
export const importRebaseCode = generation => (importRebasePending(generation) ? IMPORT_REBASE_CODE : null);

export const importInternals = Object.freeze({ runImport, runImports, runImportOriginal, runMarkRebased });
