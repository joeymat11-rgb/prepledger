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
// RETRACT IS APPEND-ONLY, AND THAT IS THE WHOLE OF IT (P3-IMPORT-RETRACT).
// Custody is a byte vault with no status: retractImport DELETES NOTHING. The
// original source bytes, the candidate and the provenance stay in the
// generations store exactly as they were staged, under the same name and the
// same device key, and import-custody.mjs gains no remove and is not edited.
// What retract writes is ONE durable record of its own kind — the retract
// operation — in metadata.importRetractions[], carrying the whole superseded
// entry verbatim, the athlete's reason and the clock. The entry leaves
// metadata.imports[] in the same commit, because THAT array is the live
// register of imports this installation has adopted, and two consumers read it
// raw and cannot be taught a status field: source-admission.mjs:64 (an entry
// there is a file offered for review) and m4/workout/plan-edit-model.cjs:31
// (a non-empty array means "an import is present, refuse a clean-init basis").
// Leaving a tombstone in the register would keep both of them refusing over a
// file that was never adopted, which is the residue this ticket exists to
// remove. Nothing is lost: the record is in importRetractions[], the bytes are
// in custody, and importOriginal refuses to hand back a retracted entry's
// bytes by name rather than pretending they are gone.
//
// TWO BOUNDARIES THIS LEAVES OPEN, NAMED HERE RATHER THAN LEFT TO DISCOVERY
// (independent review r1, MINOR 2 and MINOR 3; Fable r3 MINOR 1 and NOTE 5).
//
// (a) A DIFFERENT FILE UNDER A RETRACTED NAME IS STILL REFUSED. Custody is
// immutable and retract deletes nothing, so the custody record keeps the name
// it was staged under: importing OTHER bytes under that same name refuses
// LOCAL_IMPORT_NAME_TAKEN, and it does so over a name listImports no longer
// shows, because the live register is empty. Re-importing the SAME bytes is
// fine - the custody record is reused, and the entry stages fresh. The name is
// carried in the retract record, so a host CAN explain it; saying so on a
// screen is P3-IMPORT-UI-2's.
//
// (b) RETRACT IS A ONE-WAY DOOR ONCE ANYTHING IS LOGGED ON A SEEDED IMPORT.
// A zero-op device that imports (so the cache is SEEDED), then logs one thing,
// then asks to retract, is refused LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN and
// nothing is written: his logged work now sits on the imported base and this
// module will not invent the state underneath it. The refusal is the right
// shape, and its cost is that plan-edit-model.cjs:31 importPresentIn stays true
// for a file he never adopted. Handing that athlete a way back out needs an
// engine to rebuild from his ops, which is the host projector's job and not in
// this module's reach.
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
// The retract operation's own kind. A record under this profile supersedes the
// import entry it carries; it is never itself an import.
export const LOCAL_IMPORT_RETRACT_PROFILE = "earned/local-import-retract/v1";
export const IMPORT_REBASE_CODE = "IMPORT_REBASE_REQUIRED";
// A bundle that is well-formed and correctly sealed, but whose OWN recorded
// verdicts say the migration inside it was not vouched for. Distinct from both
// other codes on purpose: the passphrase was right, the bytes are intact, the
// profile is understood — and the thing is still not fit to adopt.
export const NOT_QUALIFIED = "BUNDLE_NOT_QUALIFIED";
// The exact string port.cjs writes (port.cjs:479), and the ONLY one it can:
// the bundle is not written at all unless the gate came back ok, so any other
// value means something other than port.cjs produced this file.
export const ORACLE_PASS = "PASS";
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
  // SHAPE here, CONTENT in qualifyBundle. port.cjs writes
  // {safe, lost, before, after} (port.cjs:497) where before/after are
  // engine.recordCounts(...) — plain class→count objects. A bundle missing any
  // of the four cannot be judged at all, which is a profile problem.
  if (!object(payload.dataLoss) || typeof payload.dataLoss.safe !== "boolean" ||
      !Number.isSafeInteger(payload.dataLoss.lost) || payload.dataLoss.lost < 0 ||
      !object(payload.dataLoss.before) || !object(payload.dataLoss.after)) bad("dataLoss");
  if (payload.local !== undefined && (!object(payload.local) || typeof payload.local.bytes !== "string" ||
      !HEX64.test(payload.local.sha256 ?? ""))) bad("local");
  return payload;
}

/* --- DOES THIS BUNDLE'S OWN RECORD SAY IT MAY BE ADOPTED? -------------------
   REVIEW D1. Everything above this line asks "is this file intact and in this
   profile". It is a different question from "did the migration inside it pass",
   and C2b used to answer only the first — `oracle.verdict` was checked for
   being a STRING and `dataLoss` for being an OBJECT, and nothing read either
   value. A bundle whose own oracle said FAIL was adopted durably and, on a
   zero-op phone, became the engine state Joe sees. The verdict is the ONLY
   field that says the migration was ever checked; not reading it is exactly the
   failure mode CLAUDE.md names as this codebase's dominant defect — research
   written down and never enforced in code.

   port.cjs cannot currently produce an unqualified bundle: it exits before
   writing anything if the gate is not green (port.cjs:440 for the guard, the
   ORACLE step for the gate). That is precisely why this is worth having on the
   phone — the check costs nothing while the two agree, and it is the only thing
   standing there if they ever stop agreeing, or if the file came from somewhere
   that is not port.cjs.

   `reason` is a fixed enum and `detail` is a class NAME and two COUNTS. That is
   the same disclosure port.cjs itself makes on Joe's console ("a count is not a
   value", port.cjs:177), and it is what lets a host say WHICH class shrank
   rather than "something is wrong". No ledger value is ever in here. */
export function qualifyBundle(payload) {
  if (payload?.oracle?.verdict !== ORACLE_PASS)
    return { code: NOT_QUALIFIED, state: 3, reason: "oracle-verdict", detail: String(payload?.oracle?.verdict) };
  const loss = payload.dataLoss;
  if (loss.safe !== true) return { code: NOT_QUALIFIED, state: 3, reason: "data-loss-unsafe", detail: "safe=false" };
  if (loss.lost !== 0) return { code: NOT_QUALIFIED, state: 3, reason: "data-loss-classes", detail: `lost=${loss.lost}` };
  // The decrease rule, over every class either side names. port.cjs's own
  // countsCheck reads a missing key as 0 (port.cjs:322) and so does this.
  for (const key of [...new Set([...Object.keys(loss.before), ...Object.keys(loss.after)])].sort()) {
    const before = loss.before[key] || 0, after = loss.after[key] || 0;
    if (after < before) return { code: NOT_QUALIFIED, state: 3, reason: "count-decrease",
      detail: `${key} ${before}->${after}` };
  }
  return null;
}

/* unsealBundle — open a sealed C2 port bundle on WebCrypto alone.
   Returns { payload, sourceBytes, localBytes, migratedJson }: the decoded
   payload plus the three derived byte strings every caller needs, so nobody
   base64-decodes a 500 KB field twice or re-stringifies the state by hand.
   Throws StorageFailure(BUNDLE_AUTH_FAILED) for anything the tag or the
   envelope refuses, StorageFailure(BUNDLE_PAYLOAD_INVALID) with a `field` for a
   well-sealed bundle this profile cannot read, and StorageFailure
   (BUNDLE_NOT_QUALIFIED) with `reason`/`detail` for one whose own verdicts say
   the migration was not vouched for. Writes nothing, ever.

   `allowUnqualified: true` returns such a bundle instead of throwing, with the
   refusal on `qualification`. It exists so a host can OPEN a bad bundle in
   order to tell Joe what is wrong with it — the default has to be the throw,
   because a caller that forgets to look at a returned field is exactly how an
   unchecked verdict got here in the first place. */
export async function unsealBundle(bundleBytes, passphrase,
  { crypto = globalThis.crypto, allowUnqualified = false } = {}) {
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
  // LAST, after every integrity check — asking whether a migration passed is
  // pointless until the bytes describing it are proved to be the ones sealed.
  const qualification = qualifyBundle(payload);
  if (qualification && !allowUnqualified)
    fail(qualification.code, qualification.state, { reason: qualification.reason, detail: qualification.detail });
  return { payload, sourceBytes, localBytes, migratedJson, qualification };
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
  localSha256: entry.localSha256 ?? null,
  importedAt: entry.importedAt, opsBasisAtImport: clone(entry.opsBasisAtImport ?? null),
  rebaseRequired: entry.rebaseRequired === true, rebasedAt: entry.rebasedAt ?? null }));

/* THE RETRACT REGISTER. Separate from metadata.imports[] by design (see the
   header): this is the history of files that were staged and then taken back,
   and NOTHING in the tree treats a record here as an import. A host renders it
   to say "you removed this file on the 16th"; every consumer that asks "is
   there an import?" reads the other array and correctly answers no. */
export function importRetractions(generation) {
  const records = generation?.metadata?.importRetractions;
  return Array.isArray(records) ? records.filter(object) : [];
}
export const importRetractionSummaries = generation => importRetractions(generation).map(record => ({
  name: record.name, sourceSha256: record.sourceSha256 ?? null, reason: record.reason ?? null,
  retractedAt: record.retractedAt ?? null, importedAt: record.entry?.importedAt ?? null }));
// A name is retracted when the register holds it and the live array does not.
// A re-import of the same bundle stages a fresh entry under the same name, and
// from that moment the name is live again — the retract record stays as history.
export const importRetracted = (generation, name) =>
  importRetractions(generation).some(record => record.name === name) &&
  !importEntries(generation).some(entry => entry.name === name);

// WHAT MAKES TWO IMPORTS THE SAME IMPORT. Review round 2 (R2-1): this used to be
// sourceSha256 alone, and that is not an identity. A re-port of the SAME ledger
// with --local keeps source.sha256 (the --source file did not change) and moves
// migrated.sha256 (the merge produced a different candidate) — and, because the
// default name derives from the source hash, it lands on the SAME NAME. So the
// committed-entry check answered LOCAL_IMPORT_ALREADY_PRESENT and the richer
// merged history was silently not adopted: a refusal dressed as reassurance,
// which is the worst shape a refusal can have.
//
// The identity is now the same tuple keepOriginal compares through
// engineContextJson, so the committed path and the custody path agree about what
// "a different bundle" means instead of disagreeing at the two ends of one
// import. `?? null` on the entry side keeps an entry written before this change
// reading as the same import when the bundle really is the same one.
const IMPORT_IDENTITY = ["sourceSha256", "migratedSha256", "engineSha256", "createdAt",
  "oracleVerdict", "schemaV", "localSha256"];
export const importIdentityOf = payload => ({ sourceSha256: payload.source.sha256,
  migratedSha256: payload.migrated.sha256, engineSha256: payload.engine.sha256,
  createdAt: payload.createdAt, oracleVerdict: payload.oracle.verdict,
  schemaV: payload.engine.schemaV, localSha256: payload.local ? payload.local.sha256 : null });
export function sameImport(entry, payload) {
  const identity = importIdentityOf(payload);
  return IMPORT_IDENTITY.every(field => (entry?.[field] ?? null) === identity[field]);
}

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
  // REVIEW D2. ALL FOUR material fields, not just the two byte strings.
  // engineContextJson carries createdAt, the engine sha, the oracle verdict,
  // dataLoss and census — the PROVENANCE. A custody record is immutable, so
  // reusing one whose provenance differs would leave two durable records of one
  // import disagreeing about which engine did the migration and what its oracle
  // said: metadata.imports[] would carry bundle B's, the custody record bundle
  // A's. Because the default name is port:<sourceSha256[0..16]>, two seals of
  // the SAME ledger always collide on the name, so this is ordinary, not exotic.
  //
  // The legitimate retry is unaffected, and that is a property of
  // custodyMaterial rather than a hope: every field it puts in
  // engineContextJson comes from the PAYLOAD — createdAt included — and none
  // from the clock or the environment, so re-opening the same bundle rebuilds a
  // byte-identical string. The aborted-commit case proves it end to end.
  if (existing) {
    if (!sameBytes(existing.sourceBytes, material.sourceBytes) ||
        !sameBytes(existing.candidateBytes, material.candidateBytes) ||
        existing.engineContextJson !== material.engineContextJson ||
        (existing.localBytes === null) !== (material.localBytes === null) ||
        (existing.localBytes !== null && !sameBytes(existing.localBytes, material.localBytes)))
      fail("LOCAL_IMPORT_NAME_TAKEN", 3);
    return "reused";
  }
  await custody.stage(name, expected, material);
  return "staged";
}

function importEntryFor({ payload, name, basis, importedAt, rebaseRequired }) {
  return { profile: LOCAL_IMPORT_PROFILE, name, sourceSha256: payload.source.sha256,
    migratedSha256: payload.migrated.sha256, schemaV: payload.engine.schemaV,
    engineSha256: payload.engine.sha256, oracleVerdict: payload.oracle.verdict,
    createdAt: payload.createdAt,
    // Recorded so imports() can say a MERGED port landed here, and so the
    // committed identity covers the same ground as the custody one.
    localSha256: payload.local ? payload.local.sha256 : null, importedAt,
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
  // allowUnqualified stays FALSE: a bundle whose own oracle verdict is not PASS,
  // or whose own dataLoss records a loss, is refused here — before the first
  // load(), so an unqualified migration cannot reach storage at all, let alone
  // become the derived cache on a zero-op phone.
  try { opened = await unsealBundle(bundleBytes, passphrase, { crypto: scope.crypto }); }
  catch (error) {
    return refused({ code: error?.code || BUNDLE_FAILURE, state: error?.state ?? 3 },
      { ...(error?.field ? { field: error.field } : {}),
        ...(error?.reason ? { reason: error.reason, detail: error.detail } : {}) });
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
      // But "same name" is not "same file", and — review round 2 — "same source"
      // is not "same bundle" either. A re-port of the same ledger WITH --local
      // keeps the source hash, moves the migrated hash, and lands on the same
      // derived name. sameImport() compares the whole recorded identity, so that
      // case is a refusal a host can act on rather than an ALREADY_PRESENT that
      // quietly declines to adopt the richer history.
      if (already) {
        if (!sameImport(already, opened.payload))
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
  // A retracted entry's bytes are still in custody — nothing was deleted — and
  // that is exactly why this refuses by NAME instead of letting custody answer.
  // The athlete took the file back; handing its history to a caller that asked
  // for "the imported original" would be the residue in another shape. The
  // refusal is named so a host can say which it is rather than "missing".
  // A generation with a stranded custody record and no entry at all (a crash
  // between stage and commit) is NOT this: it has no retract record and keeps
  // its existing behaviour, which local-import.test.mjs pins.
  if (importRetracted((await scope.repository.load()).generation, name))
    fail("LOCAL_IMPORT_ENTRY_RETRACTED", 3);
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

/* --- RETRACT: THE ATHLETE TAKES THE FILE BACK -------------------------------
   Fable's constraint (ii), ruled as its own ticket at DECISIONS:475 (2). The
   review stage reads from custody, so importBundle must commit BEFORE the
   review or the identity question can be shown; a refused or cancelled review
   therefore leaves a named entry with rebaseRequired: true and boot() reporting
   IMPORT_REBASE_REQUIRED for a file that was never adopted. markImportRebased
   would clear that flag by telling the host's lie for it. This clears it by
   recording the truth: he took the file back, and here is when and why. */
const RETRACT_ADMITTED = "LOCAL_IMPORT_RETRACT_REFUSED_ADMITTED";
// A reason is a LABEL, not a note: LETTERS, hyphens and underscores, up to 64
// of them — "review-refused", "athlete-cancelled",
// "LOCAL_SOURCE_PROGRAMME_UNRESOLVED". This string is written durably into the
// generation and read back by a host, so the alphabet is chosen to make a
// ledger value UNREPRESENTABLE rather than discouraged: no digits, no dots, no
// colons, no spaces, so no weight, no date, no note he typed and no pasted
// refusal detail can ride out of his history on it. A cell proves it.
const RETRACT_REASON = /^[A-Za-z][A-Za-z_-]{0,63}$/;

/* AN ADMITTED HISTORY IS HIS DATA AND LEAVES ONLY BY AN OWNER-RULED PATH.
   Four places record an admission (the same four m4/workout/plan-edit-model.cjs
   calls an import's presence), and this refuses if ANY of them names this
   entry — the widest reading, because the cost of refusing a retract is one
   honest refusal and the cost of allowing one is an adopted history torn out
   from under the screens that are already painting it. */
function admissionTrace(generation, entry) {
  const metadata = generation?.metadata || {}, selections = metadata.localSources?.selections;
  if (typeof entry.localSourceSelectionId === "string") return "entry.localSourceSelectionId";
  if (object(selections)) for (const [id, selection] of Object.entries(selections))
    if (object(selection) && (selection.name === entry.name ||
      (entry.localSourceSelectionId && selection.id === entry.localSourceSelectionId))) return "localSources.selections." + id;
  if (object(metadata.localSourceApplication) &&
    metadata.localSourceApplication.source_digest === entry.sourceSha256) return "localSourceApplication";
  const basis = generation?.collections?.[DERIVED]?.localSource?.basis;
  if (object(basis) && basis.source_digest === entry.sourceSha256) return "derived.localSource";
  return null;
}

/* THE SEEDED CACHE. On a ZERO-OP generation importBundle replaces
   derived.value with the migrated state, so retracting THAT import must put the
   cache back or his screens keep reading a history he took back. The only
   authenticated copy of the pre-stage cache in the store is the one the custody
   record checkpointed when it took the original — so it is read from there,
   under the device key, and only when the checkpoint provably describes the
   moment before this entry: zero ops then and still zero ops now, and no entry
   of this name in the checkpoint itself. Anything else
   refuses rather than guess, because a guessed cache is exactly the class of
   defect this module's header spends forty lines refusing to commit. */
const seeded = entry => entry.rebaseRequired !== true && (entry.opsBasisAtImport?.opCount ?? null) === 0;
async function priorSidecar(scope, entry, snapshot) {
  if (opsBasis(snapshot.generation).opCount !== 0) fail("LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN", 3);
  /* THE SEEDED SIBLING (independent review r1, MAJOR 1). A zero-op device can
     hold TWO seeded entries: the header calls that LAST-WINS, so the cache
     belongs to whichever was staged last, and this entry's own checkpoint
     describes a moment before BOTH of them. Restoring it would put back a cache
     that belongs to no live entry at all - importPresentIn stays true and the
     companion demands an imported basis while Today paints clean-init, which is
     precisely the guessed-cache class the header above refuses at length. So
     when ANY OTHER live entry is itself seeded, the retract refuses instead.
     That is deliberately wider than the one direction the review reproduced
     (retracting the OLDER of two): retracting the newer would need this module
     to reason that the newer entry's checkpoint is the older one's cache, and
     inferring a cache is the thing it will not do. The retract is not lost -
     retract the other entry first, or retract this one once the sibling is
     gone, and the register keeps the whole account either way. */
  if (importEntries(snapshot.generation)
    .some(other => other.name !== entry.name && seeded(other)))
    fail("LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN", 3);
  let checkpoint;
  try { checkpoint = (await custodyOf(scope).load(entry.name)).checkpoint; }
  catch { fail("LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN", 3); }
  const prior = checkpoint?.generation;
  if (!object(prior) || importEntries(prior).some(other => other.name === entry.name) ||
    opsBasis(prior).opCount !== 0) fail("LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN", 3);
  return clone(prior.collections?.[DERIVED] ?? { basis: { opCount: 0, lastOpId: null }, value: null });
}

// The retract operation's own durable record. It carries the superseded entry
// VERBATIM — the whole of it, not a summary — so the register plus custody is a
// complete account of an import that once existed here.
const retractRecordFor = (entry, reason, retractedAt, basis) => ({
  profile: LOCAL_IMPORT_RETRACT_PROFILE, name: entry.name, sourceSha256: entry.sourceSha256 ?? null,
  migratedSha256: entry.migratedSha256 ?? null, reason, retractedAt,
  opsBasisAtRetract: { opCount: basis.opCount, lastOpId: basis.lastOpId }, entry: clone(entry) });

// entryId (the custody name) or the bundle's sourceSha256. A name is tried
// first: every name this module mints is port:<16 hex>, so the two cannot
// collide in practice, and a hand-chosen name that happens to be 64 hex
// characters still means the name its owner chose.
function resolveRetract(generation, selector) {
  const entries = importEntries(generation), byName = entries.filter(entry => entry.name === selector);
  return byName.length || !HEX64.test(selector) ? byName
    : entries.filter(entry => entry.sourceSha256 === selector);
}

/* retractImport(selector, reason) — ONE durable commit, fenced exactly like the
   other two writers here (boot() ready, era lease alive, client open), which is
   what "authenticated like the others" means: it rides the same sealed
   generation under the same device key and the same optimistic revision check.
   Result: {retracted, code, state, name, durableRevision, reason, retractedAt}. */
async function runRetract(scope, selector, reason) {
  const blocked = refuseUnlessWritable(scope);
  if (blocked) return { retracted: false, ...blocked, name: null };
  if (typeof selector !== "string" || !VALID_NAME.test(selector))
    return { retracted: false, state: 3, code: "LOCAL_IMPORT_NAME_INVALID", name: null };
  if (typeof reason !== "string" || !RETRACT_REASON.test(reason))
    return { retracted: false, state: 3, code: "LOCAL_IMPORT_RETRACT_REASON_INVALID", name: null };
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const snapshot = await scope.repository.load(), generation = snapshot.generation;
      const matches = resolveRetract(generation, selector);
      if (matches.length > 1) return { retracted: false, state: 3, name: null,
        code: "LOCAL_IMPORT_RETRACT_AMBIGUOUS", durableRevision: snapshot.revision };
      if (!matches.length) {
        // Retracting twice is a NAMED no-op, not a fault: the athlete asked for
        // a state the store is already in. state stays null, as it does for
        // ALREADY_PRESENT and NOT_PENDING, because nothing failed.
        const already = importRetractions(generation).some(record =>
          record.name === selector || record.sourceSha256 === selector);
        return { retracted: false, state: already ? null : 3, name: already ? selector : null,
          code: already ? "LOCAL_IMPORT_ALREADY_RETRACTED" : "LOCAL_IMPORT_UNKNOWN",
          durableRevision: snapshot.revision };
      }
      const entry = matches[0], admitted = admissionTrace(generation, entry);
      if (admitted) return { retracted: false, state: 3, code: RETRACT_ADMITTED, name: entry.name,
        durableRevision: snapshot.revision, admittedBy: admitted };
      const retractedAt = scope.clock.now();
      if (typeof retractedAt !== "string" || !Number.isFinite(Date.parse(retractedAt)))
        return { retracted: false, state: 3, code: "LOCAL_CLOCK_UNUSABLE", name: null };
      const restored = seeded(entry) ? await priorSidecar(scope, entry, snapshot) : null;
      const next = clone(generation), basis = opsBasis(generation);
      next.metadata.imports = importEntries({ metadata: next.metadata }).filter(other => other.name !== entry.name);
      next.metadata.importRetractions = [...importRetractions({ metadata: next.metadata }),
        retractRecordFor(entry, reason, retractedAt, basis)];
      if (restored) next.collections[DERIVED] = restored;
      const commit = await scope.repository.commit(snapshot, next,
        () => (scope.alive() ? null : { state: 3, code: "LOCAL_CLIENT_CLOSED" }));
      return { retracted: true, state: null, code: "LOCAL_IMPORT_RETRACTED", name: entry.name,
        durableRevision: commit.revision, reason, retractedAt };
    } catch (error) {
      if (error instanceof StorageFailure && error.retryable && attempt + 1 < MAX_ATTEMPTS) continue;
      return { retracted: false, state: error?.state ?? 3, name: null,
        code: error?.code || "LOCAL_IMPORT_RETRACT_FAILED" };
    }
  }
  return { retracted: false, state: 3, code: "LOCAL_IMPORT_CONTENDED", name: null };
}

/* The read side of the register, the twin of imports(). A host that wants to
   show "you removed this file" reads this; nothing else in the tree does. */
async function runRetractions(scope) {
  if (!scope.alive()) fail("LOCAL_CLIENT_CLOSED", 3);
  return importRetractionSummaries((await scope.repository.load()).generation);
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
export const retractImport = (target, selector, reason) =>
  dispatch(target, "retractImport", runRetract, selector, reason);
export const listImportRetractions = target => dispatch(target, "retractions", runRetractions);

// Used by local-client.mjs boot(). Returns the derivedCode to report, or null.
// It does NOT overrule a more specific sidecar fault: a malformed cache keeps
// its own code, because that names damage while this names work outstanding —
// and both answers are "the host must rebuild from ops", which is the only
// thing the caller does with either.
export const importRebaseCode = generation => (importRebasePending(generation) ? IMPORT_REBASE_CODE : null);

export const importInternals = Object.freeze({ runImport, runImports, runImportOriginal, runMarkRebased,
  runRetract, runRetractions });
