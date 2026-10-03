'use strict';
// NATIVE-LOAD FC03 (rebuild/coach/NATIVE-LOAD-SPEC.md R9.10 d3a3ffa, sha256 6bd14f81..., on R9.9 679567a and R9.4 a575692; first built on R7 6ddf7af):
// the ONE shared source fold and the native-load response family. Pure and
// synchronous: it reads an immutable base programme, the authenticated operations
// of one generation and the registered typed workout facts, and reconstructs load,
// vector, native queue, landing, spend index and issues together. It persists
// nothing, keeps no cache and never writes a Finish. Every engine judgement goes
// through the two exposed native-load functions of an injected runtime:
//   engine = { revision, at(day) -> { evaluateNativeLoad, applyNativeLoadDecision } }
// Owner answer YES (DECISIONS:784-785): no automatic record exists in this build;
// [NO-ONLY] clauses (automatic records, FC15) are not built.
const PRODUCER = 'earned/native-load/v1';
const FAMILY = 'native-load';
const DECISION = 'earned/native-load-decision/v1';
const ISSUANCE_KEYS = ['body', 'moment', 'producer', 'reason', 'revision', 'source'];
const BLOCKING = new Set(['NATIVE_LOAD_RECORD_INVALID', 'NATIVE_LOAD_EFFECT_CONFLICT', 'NATIVE_LOAD_SOURCE_OVERLAP']);
// FC01's DERIVABLE refusal fields (spec R9 :156).
const UNDERIVABLE = new Set(['target_load', 'candidate', 'base_load', 'compensates', 'load_basis.wSets']);
// Accept refusals that a later state of the programme causes, not the record itself.
const HELD_BACK = new Set(['NATIVE_LOAD_LEGACY_PENDING', 'NATIVE_LOAD_VECTOR_ADOPTION_UNDEFINED']);

const json = (x) => JSON.parse(JSON.stringify(x));
const map = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
// Spec :61 "semantic equality compares the validated full data" (round 31, Astra L21-B3; round 32, DECISIONS:863 (1), Astra L22-B1 =
// Fable D-R31F-1 = Claude D-R31C-1, B-R31C-2, L22-B6): the ONE data comparison of this module is semantic: the JSON of the
// recursively member-sorted data, so member order never decides at any site (array order is data). The strict-JSON check, the
// negative-zero check (recordShape) and the proposal digest run on the record as received, before any comparison.
const canon = (x) => (Array.isArray(x) ? x.map(canon) : map(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, canon(x[k])])) : x);
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const text = (x) => typeof x === 'string' && x.length > 0;
const byOp = (a, b) => (a.op_id < b.op_id ? -1 : a.op_id > b.op_id ? 1 : 0);
// S11 FC09 round 6 (PM ruling DECISIONS:881 and its round-6 ruling, option (b') of s11-fc09-scratch/Q3-SEAM-DESIGN.md 7.4):
// LINEAGE RESOLUTION. A native record keeps the lift id it was issued under (spec I4: records are never rewritten). After a
// real-shape import (P3-REAL-SHAPE option A, DECISIONS:520-521) the base may name the same lift by the file's id. The caller
// hands ONE closed correspondence, built by lift-correspondence.cjs liftResolver from the setup document and the admitted
// state: record lift -> base lift. Every lift JOIN below compares LK(a) with LK(b), at read time only. With no correspondence
// (shared ids) PAIRS is null, LK is the identity and every byte this module produces is what it was (FC09-LINEAGE-IDENTITY).
const LINEAGE_PROFILE = 'earned/lift-resolver/v1';
let PAIRS = null;
const LK = (id) => (PAIRS !== null && typeof id === 'string' && Object.hasOwn(PAIRS, id) ? PAIRS[id] : id);
const sameLift = (a, b) => LK(a) === LK(b);
// A consumes root, compared by lineage: ['start', lift, 'close'] or the legacy ['legacy', day, lift] (E/native-load.cjs rootOf).
function rootKey(c) {
  if (PAIRS === null) return c;
  try { const k = JSON.parse(c); if (Array.isArray(k) && k.length === 3) return JSON.stringify(k[0] === 'legacy' ? [k[0], k[1], LK(k[2])] : [k[0], LK(k[1]), k[2]]); } catch (_) { /* not a root */ }
  return c;
}
const sameRoots = (xs, ys) => xs.some((c) => ys.some((d) => rootKey(c) === rootKey(d)));
// The closed, refusing check of a handed correspondence against the base it resolves into: a liftResolver result that is not
// refused, plain text -> text pairs, no key a base lift, every target a base lift, injective. Anything else refuses the fold by
// name (RECORD_INVALID, field 'lineage'); nothing falls back. Returns null (identity), the pairs, or false (refused).
function lineagePairs(lineage, base) {
  if (lineage === undefined || lineage === null) return null;
  if (!map(lineage) || lineage.profile !== LINEAGE_PROFILE || lineage.refused !== null || !map(lineage.pairs)) return false;
  const ids = new Set(base.exercises.filter((x) => x && text(x.id)).map((x) => x.id)), seen = new Set(), out = {};
  for (const [k, v] of Object.entries(lineage.pairs)) {
    if (!text(k) || !text(v) || k === v || ids.has(k) || !ids.has(v) || seen.has(v)) return false;
    seen.add(v); out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}
function withLineage(pairs, fn) { const was = PAIRS; PAIRS = pairs; try { return fn(); } finally { PAIRS = was; } }
// THE ENGINE BOUNDARY (Q3-SEAM-DESIGN 7.1-7.2, measured by the scratch cell Q3-ENGINE-SEAM): FC01 finds the exercise by the
// decision's lift (E/native-load.cjs:553) and binds a request's or a compensation's lift to the lift its spend_id encodes (:386,
// :513). So a call FC03 makes FOR A RECORD, or for the Undo of one, whose lift the base names by another id runs on a VIEW: a
// copy of the state (and of a landing's completion entry) in which that ONE base lift is renamed to the record's lift over a
// CLOSED member list, and FC01's result is renamed back. Records, operations and requests reach FC01 exactly as they are. A
// record lift the base already carries, the base lift left anywhere outside the list, or FC01 changing any member but
// exercises and queue refuses by name: RECORD_INVALID, field 'lineage'.
class LineageRefused extends Error { constructor(where) { super('NATIVE_LOAD_LINEAGE_VIEW ' + where); this.where = where; } }
const LINEAGE_REFUSAL = Object.freeze({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [], field: 'lineage' });
// Every lift_lineage_id under a facts value (entries, their facts, removed facts, capture slots) whose lineage is `from`.
function renameLineage(x, from, to) {
  if (Array.isArray(x)) { for (const y of x) renameLineage(y, from, to); return; }
  if (!map(x)) return;
  for (const [k, v] of Object.entries(x)) { if (k === 'lift_lineage_id' && typeof v === 'string' && LK(v) === from) x[k] = to; else renameLineage(v, from, to); }
}
// Any exId at any depth (queue, proposals[].apply, agentProposals, adjustments' exUndo, suggestionLog[].apply).
function renameExId(x, from, to) {
  if (Array.isArray(x)) { for (const y of x) renameExId(y, from, to); return; }
  if (!map(x)) return;
  for (const [k, v] of Object.entries(x)) { if (k === 'exId' && v === from) x[k] = to; else renameExId(v, from, to); }
}
// The names under which this codebase carries a lift id (W/ and E/: exId, lift_lineage_id, and the id of an exercise or a legacy
// log entry, which the list renames). A lift id left under one of these names outside the list is an UNKNOWN lift-keyed field and
// refuses. A string that merely EQUALS the id under any other name is not a lift reference and is left alone: a muscle group
// 'abs' beside the lift 'abs' (the real-shape file's mg; FC09-Q3-B measured), a name, a note (FC09-LINEAGE-S31).
const LIFT_KEYS = new Set(['exId', 'lift_lineage_id', 'liftId', 'lift_id', 'exerciseId', 'exercise_id', 'lift']);
function leftover(x, from, at) {
  if (Array.isArray(x)) { for (let i = 0; i < x.length; i++) { const h = leftover(x[i], from, at + '[' + i + ']'); if (h) return h; } return null; }
  if (!map(x)) return null;
  for (const [k, v] of Object.entries(x)) { if (LIFT_KEYS.has(k) && v === from) return at + '.' + k; const h = leftover(v, from, at + '.' + k); if (h) return h; }
  return null;
}
function lineageView(state, from, to) {
  if (!map(state) || !Array.isArray(state.exercises)) return state; // FC01 refuses a malformed state by its own name
  if (state.exercises.some((x) => x && x.id === to)) throw new LineageRefused('exercises');
  const s = structuredClone(state); // keeps the imported-log alias (workoutFacts.legacy_baseline.session_log IS sessionLog)
  for (const x of s.exercises) if (map(x) && x.id === from) x.id = to;
  renameExId(s, from, to);
  if (map(s.exOrder)) for (const ids of Object.values(s.exOrder)) if (Array.isArray(ids)) for (let i = 0; i < ids.length; i++) if (ids[i] === from) ids[i] = to;
  for (const book of ['retirements', 'insertions']) if (map(s[book]) && Object.hasOwn(s[book], from)) {
    if (Object.hasOwn(s[book], to)) throw new LineageRefused(book);
    s[book][to] = s[book][from]; delete s[book][from];
  }
  if (map(s.sessionLog)) for (const day of Object.values(s.sessionLog)) if (map(day) && Array.isArray(day.entries)) for (const e of day.entries) if (map(e) && e.id === from) e.id = to;
  if (map(s.workoutFacts)) renameLineage(s.workoutFacts, from, to);
  const left = leftover(s, from, 'state');
  if (left) throw new LineageRefused(left);
  return s;
}
function lineageContext(context, from, to) {
  if (!map(context) || !map(context.completion) || !map(context.completion.entry)) return context;
  const entry = structuredClone(context.completion.entry);
  renameLineage(entry, from, to);
  return { ...context, completion: { ...context.completion, entry } };
}
function lineageBack(input, result, view, from, to) {
  if (!map(result) || !map(result.state)) return result;
  const r = result.state, out = {};
  for (const k of new Set([...Object.keys(r), ...Object.keys(view)])) {
    if (k === 'exercises' || k === 'queue' || k === 'workoutFacts') continue;
    if (!same(view[k], r[k])) throw new LineageRefused('state.' + k);
  }
  for (const k of Object.keys(r)) {
    if (k === 'exercises') out[k] = r[k].map((x) => (map(x) && x.id === to ? { ...x, id: from } : x));
    else if (k === 'queue') out[k] = r[k].map((q) => (map(q) && q.exId === to ? { ...q, exId: from } : q));
    else out[k] = Object.hasOwn(input, k) ? json(input[k]) : r[k];
  }
  return { ...result, state: out };
}
// The runtime FC03 hands FC01 for one record lift: the injected runtime itself when the base carries that lift (always, with
// shared ids), else the view above around each of its two functions.
function atLift(rt, recordLift) {
  const from = LK(recordLift);
  if (PAIRS === null || from === recordLift || !text(recordLift)) return rt;
  return Object.freeze({
    evaluateNativeLoad: (s, request) => {
      let v;
      try { v = lineageView(s, from, recordLift); } catch (error) {
        if (!(error instanceof LineageRefused)) throw error;
        let basis = null; try { basis = map(request) && request.basis !== undefined ? json(request.basis) : null; } catch (_) { basis = null; }
        return { profile: PRODUCER, status: 'refused', basis, offers: [], refusal: { ...LINEAGE_REFUSAL } };
      }
      return rt.evaluateNativeLoad(v, request);
    },
    applyNativeLoadDecision: (s, decision, context) => {
      try { const v = lineageView(s, from, recordLift); return lineageBack(s, rt.applyNativeLoadDecision(v, decision, lineageContext(context, from, recordLift)), v, from, recordLift); }
      catch (error) {
        if (!(error instanceof LineageRefused)) throw error;
        let kept = null; try { kept = json(s); } catch (_) { kept = null; }
        return { status: 'refused', state: kept, effect: null, refusal: { ...LINEAGE_REFUSAL } };
      }
    } });
}

// The client's own digest, byte for byte (rebuild/client/index.cjs:48-93, which does
// not export it): a dependency-free synchronous SHA-256 and the proposal digest
// respond() checks. The fold must reproduce the id the client accepted.
const PROPOSAL_DOMAIN = 'earned/coach/proposal/v1';
const rotr32 = (x, n) => (x >>> n) | (x << (32 - n));
const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
function sha256Hex(str) {
  const bytes = new TextEncoder().encode(str);
  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const len = bytes.length, withLen = Math.ceil((len + 9) / 64) * 64, msg = new Uint8Array(withLen);
  msg.set(bytes); msg[len] = 0x80;
  const view = new DataView(msg.buffer);
  view.setUint32(withLen - 4, (len * 8) >>> 0);
  view.setUint32(withLen - 8, Math.floor((len * 8) / 0x100000000));
  const w = new Uint32Array(64);
  for (let offset = 0; offset < withLen; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr32(w[i - 15], 7) ^ rotr32(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr32(w[i - 2], 17) ^ rotr32(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (let i = 0; i < 64; i++) {
      const S1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25), ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22), maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
  }
  return Array.from(h).map((x) => x.toString(16).padStart(8, '0')).join('');
}
const proposalDigest = (producer, body, reason) => 'prop-' + sha256Hex(PROPOSAL_DOMAIN + JSON.stringify({ producer, body, reason })).slice(0, 16);
const sha = (x) => 'sha256:' + sha256Hex(JSON.stringify(x === undefined ? null : x));

// ---------- authenticated operations and the typed facts of a cut ----------
// The caller hands an AUTHENTICATED generation (the repository and the T2 stage
// verified it); a rejected operation is evidence, never a fact.
function operationsOf(generation) {
  const c = map(generation) && map(generation.collections) ? generation.collections : {};
  const rejected = map(c.rejected) ? c.rejected : {};
  const ops = Object.values(map(c.ops) ? c.ops : {}).filter((op) => map(op) && text(op.op_id) && !Object.hasOwn(rejected, op.op_id));
  ops.sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1));
  return { ops, byId: new Map(ops.map((op) => [op.op_id, op])), dispositions: map(c.dispositions) ? c.dispositions : {} };
}
const refOf = (op) => ({ op_id: op.op_id, commitment: op.canonical_content_commitment });
const isNative = (op) => op.class === 'plan' && op.kind === 'proposal-response' && map(op.payload) &&
  (map(op.payload.issuance) && op.payload.issuance.producer === PRODUCER);
function factsAtCut(facts, startIds, frontier) {
  const keep = new Set(startIds);
  const out = json(facts);
  out.sessions = out.sessions.filter((s) => keep.has(s.start_op_id));
  out.order = { ...out.order, frontier, start_ids: startIds.slice() };
  return out;
}
function withFacts(state, facts) { const s = json(state); delete s.workoutFacts; if (facts) s.workoutFacts = json(facts); return s; }
// A multi-lift session records every lift under ONE Close, so a completion is the
// pair (Close, lift) and never the first entry that names the Close (review B4).
function sessionOf(facts, closeId, lift) {
  for (const s of (facts && facts.sessions) || []) for (const e of s.record.entries || [])
    if (e && e.completion && e.completion.op_id === closeId && (lift === undefined || sameLift(e.lift_lineage_id, lift))) return { session: s, entry: e };
  return null;
}
// The prescription a Start captured for one lift, per ORIGINAL position (spec :122
// "using the immutable Start capture"; :151 "the captured prescription"). Read from
// the authenticated Start op's prescription_capture cell for that logical slot (the
// shape W/engine-capture.cjs loadCell writes); a typed slot's own prescribed_load is
// used only when the Start carries no capture cell for it. Unreadable -> null.
function cellValue(load) {
  if (!map(load) || load.state !== 'specified' || !text(load.source_json)) return null;
  try { const v = JSON.parse(load.source_json); return map(v) && v.unit === 'lb' && Number.isFinite(v.value) ? v.value : null; } catch (_) { return null; }
}
function captureOf(start, entry) {
  const cells = new Map();
  const pc = start && map(start.prescription_capture) && Array.isArray(start.prescription_capture.slots) ? start.prescription_capture.slots : [];
  for (const cell of pc) if (map(cell) && sameLift(cell.lift_lineage_id, entry.lift_lineage_id) && text(cell.logical_set_slot)) cells.set(cell.logical_set_slot, cell.load);
  return entry.slots.filter((s) => s.origin !== 'added').map((s) => (cells.has(s.logical_set_slot) ? cellValue(cells.get(s.logical_set_slot))
    : s.prescribed_load && s.prescribed_load.state === 'specified' && s.prescribed_load.source ? s.prescribed_load.source.value : null));
}
// One Start's captured load vector for one lift, in position order (the same cells).
function startCapture(start, lift) {
  const pc = map(start.prescription_capture) && Array.isArray(start.prescription_capture.slots) ? start.prescription_capture.slots : [];
  const cells = [];
  for (const cell of pc) {
    if (!map(cell) || !sameLift(cell.lift_lineage_id, lift) || !text(cell.logical_set_slot)) continue;
    let at = null;
    try { const k = JSON.parse(cell.logical_set_slot); at = Array.isArray(k) && sameLift(k[0], lift) && Number.isSafeInteger(k[1]) ? k[1] : null; } catch (_) { at = null; }
    if (at !== null) cells.push([at, cellValue(cell.load)]);
  }
  return cells.sort((a, b) => a[0] - b[0]).map((c) => c[1]);
}
// Spec R9.9 :152 SELECTED ENTRY (DECISIONS:801 (1)): is `cap` (one Start's captured loads, per
// original position) the card generated from native entry e ({newW, newWSets}, a queue entry or an
// earn candidate)? Non-empty and newW on every cell, whatever their number, when e has no
// newWSets; exactly newWSets otherwise. Spec R9.10 L (1) FIT IN SELECTED ENTRY (DECISIONS:803 (e)): a vector
// entry's card at another layout is its FITTED card, fitVector(newWSets, captured count).
function selectedEntry(cap, e) {
  if (!Array.isArray(cap) || !cap.length || !map(e)) return false;
  return Array.isArray(e.newWSets) ? same(cap, fitVector(e.newWSets, cap.length)) : cap.every((v) => v === e.newW);
}
// The load entry e prescribes on each of `count` captured original slots (newWSets fitted, else newW).
const entryTargetOf = (e, count) => (Array.isArray(e.newWSets) ? fitVector(e.newWSets, count) : Array.from({ length: count }, () => e.newW));
// Spec R9.10 L FIT (DECISIONS:803 (e)), the capture rule of W/engine-capture.cjs, copied at this module boundary
// (engine-capture.cjs exports none): every entry of the stored vector a finite number >= 0 and not -0, then fewer
// slots take the first n, extra slots repeat the last listed weight; anything else null.
function fitVector(v, n) {
  if (!Array.isArray(v) || v.length < 1 || !Array.from(v).every((x) => typeof x === 'number' && Number.isFinite(x) && x >= 0 && !Object.is(x, -0))) return null;
  return n <= v.length ? v.slice(0, n) : [...v, ...Array.from({ length: n - v.length }, () => v[v.length - 1])];
}
// Spec R9 :156 DERIVABLE (c2), FC01 baseLoad's own projection of a recorded FieldImage over n slots:
// w ABSENT or null gives all null; otherwise position i takes wSets[i] when wSets is an array with
// a non-null entry there, else w (a number as a Load, a string as its configuration). Spec R9.10 L READER
// (DECISIONS:804 (f)), as E/progression.cjs:80-82: a position beyond a non-empty wSets reads its last entry.
function projectBase(fields, n) {
  const dec = (x) => (map(x) && x.present === true ? x.value : null);
  const w = dec(fields.w), wSets = dec(fields.wSets);
  const load = (v) => (v === null || v === undefined ? null : typeof v === 'number' ? { value: v, unit: 'lb' } : { kind: 'configuration', configuration_key: String(v) });
  return Array.from({ length: Math.max(1, n) }, (_, i) => { const k = Array.isArray(wSets) && wSets.length > 0 ? Math.min(i, wSets.length - 1) : -1; return w === null ? null : load(k >= 0 && wSets[k] != null ? wSets[k] : w); });
}
// Spec :153 "only if no later Start captured the accepted effect" (review B9): some
// authenticated Start after the accept (provenBefore) captured exactly its target vector.
// Scoped to the EXACT effect (review B13; R8 :151 proven causality, :153, :154 original
// cut): a Start can have captured this effect only while it was pending, i.e. after its
// accept AND not after the compensation being judged (`undoOps`). A Start proven to follow
// that compensation captured some other, later effect of the same vector, never this one.
// Spec R9.9 :154 with K LAYOUT (3) (DECISIONS:801 (1)): for an earn, "captured" is the SELECTED
// ENTRY test (a scalar debut card at a changed set count is a descendant); any other effect keeps
// exact equality with its recorded target vector.
function capturedAfter(g, ops, byId, undoOps) {
  const lift = g.body.lift_lineage_id, want = (g.body.target_load && Array.isArray(g.body.target_load.vector) ? g.body.target_load.vector : []).map((x) => (map(x) ? x.value : null));
  const hit = g.body.kind === 'earn' && map(g.body.candidate) ? (cap) => selectedEntry(cap, g.body.candidate) : (cap) => same(cap, want);
  return ops.some((op) => op.class === 'session' && op.kind === 'session-start' && hit(startCapture(op, lift)) && provenBefore(g.ops, op, byId) &&
    !(Array.isArray(undoOps) && undoOps.length && provenBefore(undoOps, op, byId)));
}
// Spec :60 "semantic equality compares the validated full data, not merely the client's
// shortened proposal digest" and :148 "checks the ENTIRE issued body/reason/producer"
// (review D11): a fresh offer equals the held issuance in producer, body and reason, and
// both digest to the held proposal id.
function sameIssued(offer, held) {
  if (!map(offer) || !map(held) || !map(held.issuance)) return false;
  const iss = held.issuance;
  return iss.producer === PRODUCER && same(offer.body, iss.body) && offer.reason === iss.reason &&
    proposalDigest(PRODUCER, offer.body, offer.reason) === held.proposal_id && proposalDigest(iss.producer, iss.body, iss.reason) === held.proposal_id;
}
// One Start's captured prescription for one lift as the plan vector reads it: a numeric
// load, a configuration key, or null for not prescribed (the engine-capture.cjs cells).
function startPlanCapture(start, lift) {
  const pc = map(start && start.prescription_capture) && Array.isArray(start.prescription_capture.slots) ? start.prescription_capture.slots : [];
  const cells = [];
  for (const cell of pc) {
    if (!map(cell) || !sameLift(cell.lift_lineage_id, lift) || !text(cell.logical_set_slot)) continue;
    let at = null, v = null;
    try { const k = JSON.parse(cell.logical_set_slot); at = Array.isArray(k) && sameLift(k[0], lift) && Number.isSafeInteger(k[1]) ? k[1] : null; } catch (_) { at = null; }
    const load = cell.load;
    if (map(load) && load.state === 'specified' && text(load.source_json)) {
      try { const s = JSON.parse(load.source_json); v = map(s) && s.unit === 'lb' && Number.isFinite(s.value) ? s.value : map(s) && s.kind === 'configuration' ? s.configuration_key : null; } catch (_) { v = null; }
    }
    if (at !== null) cells.push([at, v]);
  }
  return cells.sort((a, b) => a[0] - b[0]).map((c) => c[1]);
}
// The rep target each Start capture cell prescribed for one lift (the engine-capture.cjs
// `reps` cell: {value, unit:'rep'}), in cell order; cells without one are skipped.
function startWindowCapture(start, lift) {
  const pc = map(start && start.prescription_capture) && Array.isArray(start.prescription_capture.slots) ? start.prescription_capture.slots : [];
  const out = [];
  for (const cell of pc) {
    if (!map(cell) || !sameLift(cell.lift_lineage_id, lift) || !map(cell.reps) || cell.reps.state !== 'specified' || !text(cell.reps.source_json)) continue;
    try {
      const v = JSON.parse(cell.reps.source_json);
      if (map(v) && v.unit === 'rep' && Number.isFinite(v.value)) out.push({ value: v.value, window_hi: Number.isSafeInteger(v.window_hi) && v.window_hi > 0 ? v.window_hi : null });
    } catch (_) { /* unreadable: not a window */ }
  }
  return out;
}
// Spec R9.1 :127 WINDOW BINDING (earn branch only): is the window this completion was
// captured under provably the lift's current hi? Only an FC16 capture proves it: every
// specified reps cell carries window_hi and each equals the current hi. A capture made
// before FC16 (no reps cell, or any cell without window_hi) cannot prove its window, even
// when the current hi equals the largest target (targets sit above hi through the
// delivered floor, or below it), so it never proves one: every new earn check refuses.
function windowUnproven(cells, hi) {
  if (!cells.length || cells.some((c) => c.window_hi === null)) return true;
  return cells.some((c) => c.window_hi !== hi);
}
// FC01 refusals that come after its step 2 (plan identity) in the evaluation order.
const AFTER_STEP_2 = new Set(['NATIVE_LOAD_PREFIX_UNRESOLVED', 'NATIVE_LOAD_VECTOR_ADOPTION_UNDEFINED', 'NATIVE_LOAD_SOURCE_OVERLAP', 'NATIVE_LOAD_PROVISIONAL',
  'NATIVE_LOAD_WINDOW_NOT_TOP', 'NATIVE_LOAD_EFFORT_UNRESOLVED', 'NATIVE_LOAD_ORDER_RULE_UNREPRESENTABLE', 'NATIVE_LOAD_NO_NEXT_LOAD', 'NATIVE_LOAD_HELD_OR_HOT']);
// FC01 refusals that only the earn branch (steps 4-10) makes (native-load.cjs:259-301).
const EARN_READER_CODES = new Set(['NATIVE_LOAD_PROVISIONAL', 'NATIVE_LOAD_WINDOW_NOT_TOP', 'NATIVE_LOAD_EFFORT_UNRESOLVED',
  'NATIVE_LOAD_ORDER_RULE_UNREPRESENTABLE', 'NATIVE_LOAD_NO_NEXT_LOAD', 'NATIVE_LOAD_HELD_OR_HOT']);
// Spec R8 :156 (D7b): the reconstructed lift no longer has the base the accept recorded.
function movedBase(ex, body) {
  const img = (k) => (Object.hasOwn(ex, k) ? { present: true, value: ex[k] === undefined ? null : json(ex[k]) } : { present: false, value: null });
  const f = map(body.base_load) && map(body.base_load.fields) ? body.base_load.fields : {};
  const forks = map(body.basis) && map(body.basis.technique) && Array.isArray(body.basis.technique.forks) ? body.basis.technique.forks : [];
  // Spec :61 semantic equality (round 31, Astra L21-B3): a recorded wrapper equals the image by presence and value, whatever its
  // member order.
  const sameImage = (a, b) => map(b) && a.present === b.present && same(a.value, b.value);
  return !sameImage(img('w'), f.w) || !sameImage(img('wSets'), f.wSets) || !same(json(ex.forks || []), forks);
}
// Spec R9.2 :158: the named refusals that hold a lift (earns refused, the adoption exit open).
const HOLD_CODES = new Set(['NATIVE_LOAD_RECORD_INVALID', 'NATIVE_LOAD_EFFECT_CONFLICT', 'NATIVE_LOAD_SOURCE_OVERLAP', 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED']);
// Spec R9.9 :158 (DECISIONS:796 (c)): a missed debut is NOT a hold (it consumes its entry and holds
// nothing, :152); holds are exactly these four codes.
const isHold = (i) => !!i && HOLD_CODES.has(i.code);
const activeHolds = (issues, lift) => (issues || []).filter((i) => i && i.lift === lift && isHold(i) && !i.superseded_by);
// TRAINABLE WHILE HELD (spec R9.2 :158): a held lift's new prescription is unavailable, so its
// w and wSets project null (genSession's baseline ask) and its native queue entries are not
// prescribed. A projection only: nothing durable is written, history is kept.
// Spec R9.4 :159 (D-R9-LEGACY-ENTRY): the REGISTERED projection (legacy: true) also hides every
// unfinished legacy debut/unlock entry of a held lift, so today.cjs never picks it and no
// legacy newW reaches the baseline-ask card (engine-capture.cjs:64 would refuse the day). The
// check and the fold keep legacy entries visible, so a legacy entry keeps its own branch
// (LEGACY_PENDING, :162); the entries stay in the fold state either way.
const HIDDEN_LEGACY_KINDS = new Set(['debut', 'unlock']);
function projectHeld(state, lifts, { legacy = false } = {}) {
  const set = new Set(lifts);
  if (!set.size) return state;
  return { ...state,
    exercises: state.exercises.map((x) => (x && set.has(x.id) ? { ...x, w: null, wSets: null } : x)),
    queue: state.queue.filter((q) => !(q && set.has(q.exId) && (typeof q.native_load_spend === 'string' || (legacy && !q.done && HIDDEN_LEGACY_KINDS.has(q.kind))))) };
}
// The registered projection of a fold: every lift with an active hold, projected as above.
// Spec R9.13 (v) LEGACY-OVER-NULL (PM ruling (v), DECISIONS:819; D-R20-RESTORE-OVER-LEGACY): the registered projection also hides
// every unfinished LEGACY debut/unlock entry of an UNHELD lift whose fold-state w is null or absent, so that lift's card is the
// existing baseline ask (E/today.cjs:96-110) and never a legacy newW over a null w (W/engine-capture.cjs:67 refused the whole day).
// Native entries keep the held-only rule (the :158 INVARIANT already excludes a native entry on a w-null lift). projectHeld as the
// fold (:696) and the check (:993) call it, legacy false, is unchanged, so FC01's LEGACY_PENDING (E/native-load.cjs:222, :544)
// still sees the entry. A projection only: the entry, its history and the fold state are unchanged, and nothing is raised.
function heldProjection(fold) {
  const issues = (fold && fold.issues ? fold.issues : []).filter((i) => i && typeof i.lift === 'string' && isHold(i) && !i.superseded_by);
  const lifts = new Set(issues.map((i) => i.lift));
  if (!fold || !fold.state) return { state: null, lifts, issues };
  const state = projectHeld(fold.state, [...lifts], { legacy: true });
  const nullW = new Set(state.exercises.filter((x) => x && x.w == null).map((x) => x.id));
  const hide = (q) => !!q && nullW.has(q.exId) && typeof q.native_load_spend !== 'string' && !q.done && HIDDEN_LEGACY_KINDS.has(q.kind);
  return { state: state.queue.some(hide) ? { ...state, queue: state.queue.filter((q) => !hide(q)) } : state, lifts, issues };
}
// The lift a native-load spend_id names (its canonical JSON's second member), or null.
function decodeLift(spendId) {
  try { const d = JSON.parse(spendId); return Array.isArray(d) && d[0] === 'native-load' && typeof d[1] === 'string' ? d[1] : null; } catch { return null; }
}
// The load authority root of a spend_id (canonical JSON ['native-load', lift, root,
// technique, consumes]); null when it is not a native-load spend or has no root.
function authorityRoot(spendId) {
  try { const d = JSON.parse(spendId); return Array.isArray(d) && d[0] === 'native-load' && typeof d[2] === 'string' ? d[2] : null; } catch { return null; }
}
// Proven causality (spec :151 "Require acceptance before Start by proven causality";
// :156 "same-lift dependencies follow witnessed causal/source order"): the accept is
// an ancestor of the Start through causal_parents or device_predecessor_op_id, or it
// precedes the Start in ONE device's own sequence. Nothing else orders two devices.
function provenBefore(acceptOps, start, byId) {
  if (acceptOps.some((op) => op.device_id === start.device_id && (op.device_seq || 0) < (start.device_seq || 0))) return true;
  const want = new Set(acceptOps.map((op) => op.op_id)), seen = new Set(), stack = [start];
  while (stack.length) {
    const op = stack.pop();
    const parents = [...(Array.isArray(op.causal_parents) ? op.causal_parents : []), ...(text(op.device_predecessor_op_id) ? [op.device_predecessor_op_id] : [])];
    for (const id of parents) {
      if (want.has(id)) return true;
      if (seen.has(id)) continue;
      seen.add(id);
      const next = byId.get(id);
      if (next) stack.push(next);
    }
  }
  return false;
}

// ---------- the Basis of the current cut (spec B "Basis and exact durable decision shape") ----------
// Encodings are this module's, shared by check, respond and the fold; FC01 treats
// plan hashes as opaque and binds them into every issued body.
function basisOf({ state, generation, workoutFacts, source, athleteId, plan = {}, lift, spent }) {
  const { ops, dispositions } = operationsOf(generation);
  const ex = state.exercises.find((x) => x && x.id === lift) || {};
  const opt = (k) => (Object.hasOwn(ex, k) ? { present: true, value: ex[k] === undefined ? null : json(ex[k]) } : { present: false, value: null });
  const coverage = ops.filter((op) => op.class === 'session' || isNative(op))
    .map((op) => ({ op_id: op.op_id, commitment: op.canonical_content_commitment,
      disposition: map(dispositions[op.op_id]) && text(dispositions[op.op_id].status) ? dispositions[op.op_id].status : 'stored-on-this-device', source_member: null }))
    .sort(byOp);
  const captures = ((workoutFacts && workoutFacts.sessions) || []).map((s) => (s.record.entries || []).filter((e) => e && sameLift(e.lift_lineage_id, lift))
    .map((e) => e.slots.map((slot) => slot.prescribed_load || null)));
  return {
    athlete_id: athleteId, source: json(source),
    coverage,
    order: { start_ids: workoutFacts.order.start_ids.slice(), frontier: workoutFacts.order.frontier },
    plan: { plan_basis: plan.plan_basis === undefined ? null : plan.plan_basis, input_basis: plan.input_basis === undefined ? null : plan.input_basis,
      programme_sha256: sha(state.exercises), capture_sha256: sha(captures), structural_queue_sha256: sha(state.queue) },
    technique: { forks: json(ex.forks || []), fork_refs: [] },
    load_basis: { authority_refs: [], tenure_start: null, sets: ex.sets === undefined ? null : ex.sets, prefix: ex.sets === undefined ? null : ex.sets,
      hi: ex.hi === undefined ? null : ex.hi, steps: opt('steps'), inc: opt('inc'), w: opt('w'), wSets: opt('wSets') },
    effect_frontier: (spent || []).map((x) => ({ spend_id: x.spend_id, response_refs: json(x.response_refs), close_ref: x.close_ref ? json(x.close_ref) : null }))
      .sort((a, b) => (a.spend_id < b.spend_id ? -1 : a.spend_id > b.spend_id ? 1 : 0)),
  };
}

// ---------- one native accept record, structurally (spec B "REVISION RETENTION") ----------
function structural(op, byId, athleteId, base) {
  const p = op.payload, iss = p.issuance;
  if (p.answer !== 'accept' || !text(p.proposal_id) || !map(iss) || !same(Object.keys(iss).sort(), ISSUANCE_KEYS)) return 'answer or issuance shape';
  if (!text(iss.reason) || !text(iss.revision) || !text(iss.source) || !text(iss.moment) || !Number.isFinite(Date.parse(iss.moment))) return 'issuance fields';
  let body;
  try { body = json(iss.body); } catch (_) { return 'issuance body not strict JSON'; }
  if (!same(body, iss.body)) return 'issuance body not strict JSON';
  if (!map(body) || body.profile !== DECISION || !text(body.spend_id) || !Array.isArray(body.consumes) || !Array.isArray(body.evidence) || !map(body.basis)) return 'decision shape';
  if (proposalDigest(iss.producer, iss.body, iss.reason) !== p.proposal_id) return 'proposal digest';
  if (body.basis.athlete_id !== athleteId) return 'athlete scope';
  if (!base.exercises.some((x) => x && x.id === LK(body.lift_lineage_id))) return 'lineage';
  const shape = recordShape(p); // round 30: the ONE total record validator, below
  if (shape) return 'field ' + shape;
  for (const item of body.evidence) {
    const refs = [item.start, item.close, ...item.sets.flatMap((s) => [s.original, ...(s.edits || [])])].filter((r) => r !== null);
    for (const r of refs) { const o = byId.get(r && r.op_id); if (!o || o.canonical_content_commitment !== r.commitment) return 'consumed reference absent'; }
  }
  return null;
}
// The ONE total record validator (round 30, DECISIONS:856 (1) (b); it replaces round 29b's scattered H-01..H-04 guards). Spec :101
// ("Accept payload is exactly {proposal_id,answer:'accept',issuance}"), :104-:112 (every Decision field required, null where stated;
// evidence, base_load with its FieldImage, target_load, candidate), :117-:119 (Basis is exactly its eight members; plan and load_basis
// are listed member for member; order, technique and effect_frontier are described, not listed), :120 (Ref), :61 (strict plain JSON:
// own data properties only, no extras), :175 (a malformed native accept is refused RECORD_INVALID, never dropped). It checks a record
// EXACTLY as deep as that definition goes and no deeper (the answer to D-R29F-2): members, containers, Refs, Loads and presence
// wrappers; a value the spec leaves to another clause (S1-S8, DERIVABLE, re-evaluation) is judged there. The first defect names the
// field of the clause that owns the member (:155 "field = the failing field"): the envelope and the Basis containers no S clause
// names 'payload' (the head's precedent, R28B-BODY-NULL, R29-H04-BASIS-MEMBERS); the Decision's own members 'decision' (FC01's
// Decision check; R28B-FORGED-UNDO-TARGET, R29-H02); a consumes root that is not text S1 'lift_lineage_id'; evidence S4; coverage
// S5; order S6; source S7; load_basis and base_load S8 / DERIVABLE (c1)-(c2) 'base_load'; DERIVABLE 'candidate' and 'target_load'.
const has = (x, keys) => map(x) && same(Object.keys(x).sort(), keys.slice().sort());
const isRef = (r) => has(r, ['op_id', 'commitment']) && text(r.op_id) && text(r.commitment);
const isLoad = (x) => x === null || (has(x, ['value', 'unit']) && x.unit === 'lb' && typeof x.value === 'number' && Number.isFinite(x.value)) ||
  (has(x, ['kind', 'configuration_key']) && x.kind === 'configuration' && text(x.configuration_key));
const isWrapper = (x) => has(x, ['present', 'value']) && typeof x.present === 'boolean' && (x.present || x.value === null);
// Round 31 (Astra L21-B1): :109 "current is typed resolved load/reps/reserve or null", typed as the typed performed slot types them
// (E/performed.cjs recorded() and effort(), which every evidence set passed when FC01 issued it): load a Load (:110) or null, reps
// {value,unit:'rep'} with a whole count, reserve null (absent) or the typed effort: {tag} unknown/skipped/not_asked, exact 0-2 or
// at_least 3 in reps.
const isReps = (x) => has(x, ['value', 'unit']) && x.unit === 'rep' && Number.isSafeInteger(x.value) && x.value >= 0;
const isReserve = (x) => x === null || (has(x, ['tag']) && ['unknown', 'skipped', 'not_asked'].includes(x.tag)) ||
  (has(x, ['tag', 'value', 'unit']) && x.unit === 'rep' && ((x.tag === 'exact' && [0, 1, 2].includes(x.value)) || (x.tag === 'at_least' && x.value === 3)));
const isCurrent = (x) => x === null || (has(x, ['load', 'reps', 'reserve']) && isLoad(x.load) && isReps(x.reps) && isReserve(x.reserve));
const DECISION_KEYS = ['profile', 'kind', 'lift_lineage_id', 'basis', 'evidence', 'base_load', 'target_load', 'candidate', 'reason_key', 'spend_id', 'consumes', 'compensates'];
const BASIS_KEYS = ['athlete_id', 'source', 'coverage', 'order', 'plan', 'technique', 'load_basis', 'effect_frontier'];
const FIELD_KEYS = ['w', 'wSets', 'wAt', 'last', 'lastMeta', 'own', 'std', 'topAt', 'topRun'];
const REASON_KEYS = { 'adopt-baseline': 'baseline', 'adopt-observed': 'observed-load', earn: 'canonical-earn', compensate: 'compensation' };
// Round 32 (Astra L22-B3; :61 "no negative zero"; DECISIONS:863 (2)): a negative zero anywhere in the record, read as received (the
// strict-JSON copy and the digest print it as 0, so they cannot see it), is refused by the clause that owns the member, below.
const negZero = (x) => Object.is(x, -0) || (Array.isArray(x) ? x.some(negZero) : map(x) ? Object.values(x).some(negZero) : false);
function recordShape(p) {
  const body = p.issuance.body, bs = body.basis, T = body.target_load, lb = bs.load_basis, bl = body.base_load, c = body.candidate;
  if (!has(p, ['proposal_id', 'answer', 'issuance']) || Object.keys(bs).some((k) => !BASIS_KEYS.includes(k)) ||
    !has(bs.plan, ['plan_basis', 'input_basis', 'programme_sha256', 'capture_sha256', 'structural_queue_sha256']) || !map(bs.technique) ||
    !Array.isArray(bs.effect_frontier) || !bs.effect_frontier.every((f) => map(f) && text(f.spend_id)) || !map(bl) || !map(bl.fields) ||
    negZero(bs.athlete_id) || negZero(bs.plan) || negZero(bs.technique) || negZero(bs.effect_frontier)) return 'payload';
  if (!has(body, DECISION_KEYS) || REASON_KEYS[body.kind] !== body.reason_key || (body.kind === 'compensate' ? !text(body.compensates) : body.compensates !== null) ||
    (body.kind === 'earn' ? !map(c) : c !== null) || !has(T, ['scalar', 'vector']) || !Array.isArray(T.vector)) return 'decision';
  if (!body.consumes.every(text)) return 'lift_lineage_id';
  if (negZero(body.evidence) || !body.evidence.every((i) => has(i, ['start', 'close', 'sets']) && isRef(i.start) && isRef(i.close) && Array.isArray(i.sets) &&
    i.sets.every((s) => has(s, ['slot', 'position', 'origin', 'state', 'original', 'edits', 'current']) && (s.original === null || isRef(s.original)) &&
      Array.isArray(s.edits) && s.edits.every(isRef) && isCurrent(s.current)))) return 'evidence';
  if (!Array.isArray(bs.coverage) || negZero(bs.coverage) || !bs.coverage.every((x) => has(x, ['op_id', 'commitment', 'disposition', 'source_member']) && text(x.op_id) && text(x.commitment))) return 'basis.coverage';
  if (!map(bs.order) || negZero(bs.order) || !Array.isArray(bs.order.start_ids) || !bs.order.start_ids.every(text)) return 'basis.order';
  // Round 33 (Astra L23-B2; DECISIONS:865 (2); :119, E/performed.cjs:168): a record count is a non-negative safe integer, never
  // coerced: the verified frontier here, load_basis.prefix below (null when the programme has no count, as basisOf writes it).
  if (!Number.isSafeInteger(bs.order.frontier) || bs.order.frontier < 0) return 'basis.order';
  if (!Object.hasOwn(bs, 'source') || negZero(bs.source)) return 'basis.source';
  if (!has(lb, ['authority_refs', 'tenure_start', 'sets', 'prefix', 'hi', 'steps', 'inc', 'w', 'wSets']) || !Array.isArray(lb.authority_refs) || !lb.authority_refs.every(isRef) ||
    !['w', 'wSets', 'inc', 'steps'].every((k) => isWrapper(lb[k])) || !has(bl, ['scalar', 'vector', 'fields']) || !isLoad(bl.scalar) || !Array.isArray(bl.vector) ||
    !bl.vector.every(isLoad) || !has(bl.fields, FIELD_KEYS) || !FIELD_KEYS.every((k) => isWrapper(bl.fields[k])) || negZero(lb) || negZero(bl)) return 'base_load';
  if (!(lb.prefix === null || (Number.isSafeInteger(lb.prefix) && lb.prefix >= 0))) return 'base_load';
  if (body.kind === 'earn' && (negZero(c) || !has(c, ['kind', 'newW', 'newWSets', 'state', 't', 'gate', 'rule']) || c.kind !== 'debut' || !(c.newWSets === null || Array.isArray(c.newWSets)))) return 'candidate';
  if (negZero(T) || !isLoad(T.scalar) || !T.vector.every(isLoad)) return 'target_load';
  return null;
}

// STRUCTURAL CORRESPONDENCE (spec R9 :155, B26): a record that is NOT re-evaluated
// (revision absent, its cut not reproducible, or its basis corrected) applies only when
// S1-S8 all hold; the first failure names its field. Returns that field, or null.
// Technique basis as spendIdOf reads it: the latest reset fork (plan.cjs:31 resetForksOf).
const resetForks = (forks) => (Array.isArray(forks) ? forks : []).filter((f) => f && (f.kind ? f.kind !== 'context' : !f.split));
// Spec R9.13 (i) REFS-ARM (PM ruling (i), DECISIONS:819; STOP-R20B2-3 = Astra L13-B1): the refs half of correspondence's S8
// ADOPT-BASELINE arm, as ONE function (Fable D-R13L1-1) called by correspondence below AND by the fold's present-revision
// reproducible gate, so the two can never drift. True for a body that is not an adopt-baseline, and for a baseline-ask (all-null)
// capture: the arm is numeric-only (a null capture is governed by R9.11 M (1), dissolvedExit). For a numeric capture of the latest
// consumed Start (ranked as S8 ranks it), true iff load_basis.authority_refs is non-empty and EVERY ref is authentic, a
// proposal-response of this lift, and holding (an ACTIVE hold issue of the lift names it) or dissolved (NO hold issue of the lift
// names it, active or superseded) and proven before that Start (R9.12 (1b), ONE ANCHOR; RESIDUAL (iv) :157 meets the same test).
// Unresolvable roots, Start or session: false (correspondence then names its own field).
function refsArm(body, { facts, byId, issues = [] }) {
  if (!map(body) || body.kind !== 'adopt-baseline') return true;
  const lift = body.lift_lineage_id;
  const roots = (Array.isArray(body.consumes) ? body.consumes : []).map((r) => { try { const k = JSON.parse(r); return Array.isArray(k) && k.length === 3 && text(k[0]) && text(k[2]) ? { start: k[0], lift: k[1], close: k[2] } : null; } catch (_) { return null; } });
  if (!roots.length || roots.some((r) => !r)) return false;
  const rank = new Map(((facts && facts.order && facts.order.start_ids) || []).map((id, k) => [id, k]));
  const latest = roots.slice().sort((a, b) => (rank.get(a.start) ?? -1) - (rank.get(b.start) ?? -1)).pop();
  const start = byId.get(latest.start), hit = sessionOf(facts, latest.close, lift);
  if (!start || !hit) return false;
  const cap = captureOf(start, { ...hit.entry, slots: hit.entry.slots.filter((x) => x.origin !== 'added') });
  if (!cap.some((v) => typeof v === 'number')) return true;
  const ar = map(body.basis) && map(body.basis.load_basis) && Array.isArray(body.basis.load_basis.authority_refs) ? body.basis.load_basis.authority_refs : [];
  const names = (i, id) => !!i && i.lift === LK(lift) && isHold(i) && (i.refs || []).some((x) => map(x) && x.op_id === id);
  const holding = (id) => (issues || []).some((i) => names(i, id) && !i.superseded_by);
  const dissolved = (id) => !(issues || []).some((i) => names(i, id));
  const ok = (r) => { if (!map(r) || !byId.has(r.op_id) || byId.get(r.op_id).canonical_content_commitment !== r.commitment) return false; const o = byId.get(r.op_id);
    return o.class === 'plan' && o.kind === 'proposal-response' && map(o.payload) && map(o.payload.issuance) && map(o.payload.issuance.body) &&
      sameLift(o.payload.issuance.body.lift_lineage_id, lift) && (holding(r.op_id) || (dissolved(r.op_id) && provenBefore([o], start, byId))); };
  return ar.length > 0 && ar.every(ok);
}
// Round 31 (Astra L21-B2; :155 S4): the typed edit fold (rebuild/m4/workout/edit-history.cjs fold) replayed for ONE fact over the
// listed edit operation ids (the fact's edit order): a correction patches its target (a {clear:true} value removes the member), a
// tombstone removes its target, and an edit that is itself corrected or removed acts as corrected or not at all. Returns
// {active, value} for the fact, or null when an operation is not an edit that fold interprets. Loops only over the listed ids.
function replayEdits(f, ids, byId) {
  const corrections = new Map(), removals = new Set(), rank = new Map(ids.map((id, i) => [id, i]));
  const patched = (id, value) => {
    for (const c of (corrections.get(id) || []).slice().sort((a, b) => a.rank - b.rank)) for (const [k, v] of Object.entries(c.patch)) { if (has(v, ['clear']) && v.clear === true) delete value[k]; else value[k] = json(v); }
    return value;
  };
  for (let i = ids.length - 1; i >= 0; i--) {
    const op = byId.get(ids[i]);
    if (!op || !map(op.payload) || !text(op.target_op_id)) return null;
    const value = patched(ids[i], json(op.payload)), active = !removals.has(ids[i]);
    if (op.kind === 'correction' && has(op.payload, ['replacement_fields']) && map(value.replacement_fields)) {
      if (active) corrections.set(op.target_op_id, [...(corrections.get(op.target_op_id) || []), { rank: rank.get(ids[i]), patch: value.replacement_fields }]);
    } else if (op.kind === 'tombstone' && has(op.payload, ['reason'])) { if (active) removals.add(op.target_op_id); } else return null;
  }
  return { active: !removals.has(f.source_op_id), value: patched(f.source_op_id, json(f.original)) };
}
// The typed slot states that name no fact and no skip (rebuild/m4/workout/engine-history.cjs: unlogged, unresolved, and removed when
// more than one removed fact leaves none to name); S4 binds a set that names neither to one of them (round 33).
const NO_FACT_STATES = ['unlogged', 'unresolved', 'removed'];
function correspondence(body, { facts, byId, source, issues = [], spent = [], groups = null }) {
  const lift = body.lift_lineage_id;
  const isOp0 = (id, kind) => { const o = byId.get(id); return !!o && o.class === 'session' && o.kind === kind; };
  // Spec R9.1 :155 (B-R9-4): a compensation keeps the existing cancellation identity: S1
  // body lift = the compensated spend's lift; S2 the canonical compensation spend; consumes
  // and evidence both []; S3-S5 and S8 vacuous; S6 and S7 as for every record.
  if (body.kind === 'compensate') {
    let target = null;
    try { target = JSON.parse(body.compensates); } catch (_) { target = null; }
    if (!Array.isArray(target) || !sameLift(target[1], lift)) return 'lift_lineage_id';
    if (body.spend_id !== JSON.stringify(['native-load-compensation', lift, body.compensates])) return 'spend_id';
    if (body.consumes.length) return 'consumes';
    if (body.evidence.length) return 'evidence';
    const order0 = map(body.basis.order) && Array.isArray(body.basis.order.start_ids) ? body.basis.order.start_ids : null;
    if (!order0 || order0.some((id) => !isOp0(id, 'session-start'))) return 'basis.order';
    if (source !== undefined && !same(body.basis.source, source)) return 'basis.source';
    return null;
  }
  const roots = body.consumes.map((r) => { try { const k = JSON.parse(r); return Array.isArray(k) && k.length === 3 && text(k[0]) && text(k[2]) ? { start: k[0], lift: k[1], close: k[2] } : null; } catch (_) { return null; } });
  // S1 lift: the lift of every consumes root.
  if (roots.some((r) => !r || !sameLift(r.lift, lift))) return 'lift_lineage_id';
  // S2 spend: the canonical encoding from the body's own lift, authority, technique, consumes.
  let d = null;
  try { d = JSON.parse(body.spend_id); } catch (_) { d = null; }
  if (body.kind === 'compensate') {
    if (body.spend_id !== JSON.stringify(['native-load-compensation', lift, body.compensates])) return 'spend_id';
  } else {
    const forks = resetForks(map(body.basis.technique) ? body.basis.technique.forks : []);
    const technique = forks.length ? String(forks.slice().sort((a, b) => (a.from < b.from ? -1 : 1)).pop().from) : null;
    if (!Array.isArray(d) || d.length !== 5 || !(d[2] === null || text(d[2])) ||
        body.spend_id !== JSON.stringify(['native-load', lift, d[2], technique, body.consumes])) return 'spend_id';
  }
  // S3 authentic work: an authenticated Start and its normal Close, the lift typed in it.
  const isOp = (id, kind) => { const o = byId.get(id); return !!o && o.class === 'session' && o.kind === kind; };
  for (const r of roots) {
    const hit = sessionOf(facts, r.close, lift);
    if (!isOp(r.start, 'session-start') || !isOp(r.close, 'session-close') || !hit || hit.session.start_op_id !== r.start ||
        !map(hit.entry.completion) || hit.entry.completion.kind !== 'normal') return 'consumes';
  }
  // S4 evidence: exactly the consumed pairs; every set item equal to the authentic slot.
  const pair = (a, b) => JSON.stringify([a, b]);
  const pairs = body.evidence.map((i) => pair(i && i.start && i.start.op_id, i && i.close && i.close.op_id)).sort();
  if (!same(pairs, roots.map((r) => pair(r.start, r.close)).sort())) return 'evidence';
  const authentic = (ref) => ref === null || (map(ref) && byId.has(ref.op_id) && byId.get(ref.op_id).canonical_content_commitment === ref.commitment);
  const cur = (c) => (c ? { load: c.load, reps: c.reps, reserve: c.reserve === undefined ? null : c.reserve } : null);
  for (const item of body.evidence) {
    const hit = sessionOf(facts, item.close.op_id, lift);
    if (!hit || !authentic(item.start) || !authentic(item.close) || !Array.isArray(item.sets) || item.sets.length !== hit.entry.slots.length) return 'evidence';
    for (let i = 0; i < item.sets.length; i++) {
      // A set removed after the evidence was issued keeps its fact among removed_facts; the
      // correspondence is to that authentic fact (the removal is the later edit, :157).
      const set = item.sets[i], slot = hit.entry.slots[i];
      const gone = Array.isArray(slot.removed_facts) ? slot.removed_facts.filter((x) => map(x) && map(set) && map(set.original) && x.source_op_id === set.original.op_id) : [];
      const f = slot.fact || (gone.length === 1 ? gone[0] : null);
      if (!map(set) || set.slot !== slot.logical_set_slot || set.position !== slot.position || set.origin !== (slot.origin === undefined ? null : slot.origin)) return 'evidence';
      const original = f ? f.source_op_id : text(slot.skip_op_id) ? slot.skip_op_id : null;
      if ((set.original ? set.original.op_id : null) !== original || !authentic(set.original)) return 'evidence';
      const edits = Array.isArray(set.edits) ? set.edits : null, now = f && Array.isArray(f.edit_op_ids) ? f.edit_op_ids : [];
      if (!edits || edits.length > now.length || edits.some((r, k) => !map(r) || r.op_id !== now[k] || !authentic(r))) return 'evidence';
      const performed = slot.state === 'performed' && f;
      if (edits.length === now.length && !same(set.current, performed && f.current ? cur(f.current) : null)) return 'evidence';
      // Before any edit the slot's value is its original fact (a later removal or correction
      // changes the current value, never the value the evidence recorded).
      if (edits.length === 0 && now.length > 0 && !same(set.current, f && f.original ? cur(f.original) : null)) return 'evidence';
      // Round 33 (Astra L23-B1 = Claude D-R32C-2; DECISIONS:865 (1); :109 "position/origin/state are the typed slot's fields"): the
      // state is bound to the authentic fact after exactly the listed edits, as current is. Every edit listed: the typed slot's own
      // state (a removed fact named among removed_facts: removed); none listed of a fact that has edits: performed (its original);
      // a proper prefix: below, beside its current. No fact and no skip named: a state that names neither (unlogged, unresolved,
      // removed).
      const listed = edits.length === now.length ? (f ? (f === slot.fact ? slot.state : 'removed') : original !== null ? slot.state : null) : edits.length === 0 ? 'performed' : undefined;
      if (listed === null ? !NO_FACT_STATES.includes(set.state) : listed !== undefined && set.state !== listed) return 'evidence';
      // Round 31 (Astra L21-B2): a non-empty PROPER prefix binds current too (:155 S4 "its current equals the slot's value after
      // exactly those edits"): the original fact replayed through exactly the listed edit operations (replayEdits). The replay
      // binds when it is faithful, i.e. replaying ALL the slot's edits reproduces the authentic current value (as every history
      // the typed edit fold produces does; an operation that fold cannot interpret leaves no performed fact to name it).
      if (edits.length > 0 && edits.length < now.length && f && map(f.original)) {
        const all = replayEdits(f, now, byId);
        if (all && (performed ? all.active && same(cur(all.value), f.current ? cur(f.current) : null) : !all.active)) {
          // Round 32 (Claude B-R31C-1 = Astra L22-B2; DECISIONS:863 (4)): whether the prefix has a current value is the AUTHENTIC
          // fact's, after exactly the listed edits (active: its value; removed: null), never the record's own claimed state.
          const upTo = replayEdits(f, now.slice(0, edits.length), byId);
          if (!upTo || !same(set.current, upTo.active ? cur(upTo.value) : null)) return 'evidence';
          if (set.state !== (upTo.active ? 'performed' : 'removed')) return 'evidence'; // round 33: its state, as its current
        }
      }
    }
  }
  // S5 coverage: every consumed Start and Close and every Ref the evidence names.
  const covered = new Set((Array.isArray(body.basis.coverage) ? body.basis.coverage : []).map((c) => (map(c) ? c.op_id : null)));
  const named = [...roots.flatMap((r) => [r.start, r.close]), ...body.evidence.flatMap((i) => i.sets.flatMap((s) => [s.original, ...(s.edits || [])]).filter((r) => r).map((r) => r.op_id))];
  if (named.some((id) => !covered.has(id))) return 'basis.coverage';
  // S6 order: authenticated Starts only, naming every consumed Start.
  const order = map(body.basis.order) && Array.isArray(body.basis.order.start_ids) ? body.basis.order.start_ids : null;
  if (!order || order.some((id) => !isOp(id, 'session-start')) || roots.some((r) => !order.includes(r.start))) return 'basis.order';
  // S7 source: the generation's admitted source basis.
  if (source !== undefined && !same(body.basis.source, source)) return 'basis.source';
  // S8 anchor: base_load equals the latest consumed Start's capture; the actual loads anchor the result.
  if (body.kind === 'earn' || body.kind === 'adopt-observed' || body.kind === 'adopt-baseline') {
    const rank = new Map(((facts && facts.order && facts.order.start_ids) || []).map((id, k) => [id, k]));
    const latest = roots.slice().sort((a, b) => (rank.get(a.start) ?? -1) - (rank.get(b.start) ?? -1)).pop();
    if (!latest) return 'base_load';
    const hit = sessionOf(facts, latest.close, lift), originals = hit.entry.slots.filter((s) => s.origin !== 'added');
    const cap = captureOf(byId.get(latest.start), { ...hit.entry, slots: originals });
    const baseVec = Array.isArray(body.base_load.vector) ? body.base_load.vector.map((x) => (map(x) && typeof x.value === 'number' ? x.value : null)) : [];
    // Actual loads as the evidence recorded them (S4 has bound each set to its authentic fact);
    // a set removed or corrected after issuance is the later edit (:157), not a forgery.
    // Round 33 (DECISIONS:865 (1); :155 "Actual loads here are the values S4 binds"): read from the bound current alone, never a
    // claimed state (a set that is not performed has current null).
    const item = body.evidence.find((x) => x.close.op_id === latest.close);
    const actual = item.sets.filter((s) => s.origin !== 'added').map((s) => (map(s.current) && map(s.current.load) ? s.current.load.value : null));
    const ar = map(body.basis.load_basis) && Array.isArray(body.basis.load_basis.authority_refs) ? body.basis.load_basis.authority_refs : [];
    if (body.kind === 'adopt-baseline') {
      // Spec R9.9 :155 ADOPT-BASELINE ANCHOR (the other-hold anchor): the base is the record's own
      // projection (all null, DERIVABLE c2); a NUMERIC capture of the consumed Start is admitted
      // only when load_basis.authority_refs names the lift's hold records, checked against the
      // ops, never trusted (R9.7, Fable l8 D-L8F-4): each ref must be a proposal-response of this
      // lift that an active hold issue of the lift names at this point in the fold. R9.9 removes
      // the missed-Close arm (a missed debut is no longer a hold, :152): a Close is never an
      // admitted ref of an adopt-baseline; the Close claim moved to the MISSED-DEBUT ANCHOR below.
      if (baseVec.some((v) => v !== null)) return 'base_load';
      // Spec R9.12 (1b) (:155 arm (ii), Astra L12-B5; PM ruling STOP-R912-1/-2 option (C)) and R9.13 (i): the refs half is
      // REFS-ARM (refsArm above), the one function the fold's present-revision reproducible gate also runs.
      if (!refsArm(body, { facts, byId, issues })) return 'base_load';
    } else if (body.kind === 'adopt-observed' && ar.length) {
      // Spec R9.9 :155 MISSED-DEBUT ANCHOR (DECISIONS:796 (c); l11 A1, A2): an adopt-observed claims
      // it by load_basis.authority_refs exactly [the Ref of the latest consumed Close]; the claim is
      // verified structurally and never inferred. The selected native entry is read from the fold's
      // ACCEPTED records at this point, never from the replay-time queue (walk seed 20268799): the
      // LAST spend in fold order among this lift's uncancelled earns that are unlanded or landed by
      // the claimed Close itself (A2), whose target passes SELECTED ENTRY against the capture and
      // whose accept is proven before the consumed Start; and some original slot's S4-bound actual
      // load differs from that target at that slot. The base is then that earn's recorded
      // base_load (scalar, fields.w and fields.wSets exactly; the vector as that base projected by
      // DERIVABLE (c2) over the captured original slot count, DECISIONS:801 (1)), not the capture.
      if (ar.length !== 1 || !map(ar[0]) || !authentic(ar[0]) || ar[0].op_id !== latest.close) return 'base_load';
      const startOp = byId.get(latest.start);
      const picks = (spent || []).filter((x) => x && !x.cancelled_by && (!x.close_ref || (map(x.close_ref) && x.close_ref.op_id === latest.close)))
        .map((x) => (groups && groups.get(x.spend_id) ? groups.get(x.spend_id) : null))
        .filter((g) => g && g.body.kind === 'earn' && sameLift(g.body.lift_lineage_id, lift) && map(g.body.candidate) && selectedEntry(cap, g.body.candidate) &&
          !!startOp && provenBefore(g.ops, startOp, byId));
      const pick = picks.length ? picks[picks.length - 1] : null;
      if (!pick) return 'base_load';
      const target = entryTargetOf(pick.body.candidate, cap.length);
      if (!actual.some((v, i) => v !== target[i])) return 'base_load';
      const rb = pick.body.base_load, bf = map(body.base_load.fields) ? body.base_load.fields : {};
      if (!map(rb) || !map(rb.fields) || !same(body.base_load.scalar, rb.scalar) || !same(bf.w, rb.fields.w) || !same(bf.wSets, rb.fields.wSets)) return 'base_load';
      if (!same(body.base_load.vector, projectBase(rb.fields, cap.length))) return 'base_load';
    }
    else if (!cap.every((v) => typeof v === 'number') || !same(baseVec, cap)) return 'base_load';
    if (body.kind === 'earn' && !same(actual, cap)) return 'base_load';
    const tv = Array.isArray(body.target_load.vector) ? body.target_load.vector.map((x) => (map(x) ? x.value : null)) : [];
    if (body.kind !== 'earn' && !same(tv, actual)) return 'target_load';
  }
  return null;
}
// Did a consumed completion change after the record was issued (spec B, "After an
// accepted basis is corrected")? Compared by operation identity and typed value.
function evidenceChanged(body, facts) {
  const shape = (s) => ({ slot: s.slot, position: s.position, state: s.state, original: s.original ? s.original.op_id : null,
    edits: (s.edits || []).map((r) => r.op_id), current: s.current });
  for (const item of body.evidence) {
    const hit = sessionOf(facts, item.close && item.close.op_id, body.lift_lineage_id);
    if (!hit) return true;
    // Round 33 (DECISIONS:865 (3)): the slot as FC01's evidenceOf now records it (a slot whose ONE fact is removed names that fact
    // and its edits); the round-32 form of that same slot (original null, no edits) is the same slot, unchanged.
    const removedFact = (slot) => (!slot.fact && slot.state === 'removed' && Array.isArray(slot.removed_facts) && slot.removed_facts.length === 1 && map(slot.removed_facts[0]) ? slot.removed_facts[0] : null);
    const now = (named) => hit.entry.slots.map((slot) => {
      const f = slot.fact || (named ? removedFact(slot) : null), cur = slot.state === 'performed' && f && f.current ? f.current : null;
      return { slot: slot.logical_set_slot, position: slot.position, state: slot.state,
        original: f ? f.source_op_id : text(slot.skip_op_id) ? slot.skip_op_id : null,
        edits: f && Array.isArray(f.edit_op_ids) ? f.edit_op_ids.slice() : [],
        current: cur ? { load: cur.load, reps: cur.reps, reserve: cur.reserve === undefined ? null : cur.reserve } : null };
    });
    const was = item.sets.map(shape);
    if (!same(now(true), was) && !same(now(false), was)) return true;
  }
  return false;
}
function dayOf(body, facts) {
  const closes = body.evidence.map((item) => item.close && item.close.op_id);
  for (let i = closes.length - 1; i >= 0; i--) { const hit = sessionOf(facts, closes[i], body.lift_lineage_id); if (hit) return hit.session.effective.local_date; }
  const all = ((facts && facts.sessions) || []).map((s) => s.effective.local_date).sort();
  return all.length ? all[all.length - 1] : '1970-01-01';
}
function checkedCompletion(body, facts) {
  if (body.evidence.length) return body.evidence[body.evidence.length - 1].close.op_id;
  const ids = ((facts && facts.order && facts.order.start_ids) || []);
  for (let i = ids.length - 1; i >= 0; i--) {
    const s = facts.sessions.find((x) => x.start_op_id === ids[i]);
    const e = s && s.record.entries.find((x) => x && sameLift(x.lift_lineage_id, body.lift_lineage_id));
    if (e) return e.completion.op_id;
  }
  return '';
}
const refusedFold = (issue) => ({ status: 'refused', state: null, effects: [], spent: [], issues: [issue], coverage: [] });

// ---------- the fold (spec B "Apply and fold", every current projection) ----------
// Round 31 PER-RECORD CONTAINMENT, complete (Astra L21-B4, Claude D-R30C-2; spec :155 RECORD_INVALID "nothing applied", :175,
// DECISIONS:856 (1) (b)): an unexpected exception while judging one record's accept or landing refuses THAT record, and the fold is
// replayed with it refused before anything applies (foldOnce's `excluded`), exactly like a malformed accept. So every mutation of
// the failed event (in-place writes to earlier entries, a spend's close_ref included) and every earlier effect of the refused record
// are gone: nothing of it is applied, and every other lift folds exactly as without it. Each replay refuses at least one more
// record, so the replays end (at most once per record).
class Contained extends Error { constructor(ids) { super('NATIVE_LOAD_CONTAINED'); this.ids = ids; } }
function foldNativeLoad(args = {}) {
  const pairs = map(args.base) && Array.isArray(args.base.exercises) ? lineagePairs(args.lineage, args.base) : null;
  if (pairs === false) return refusedFold({ ...LINEAGE_REFUSAL });
  return withLineage(pairs, () => {
    const excluded = new Set();
    for (;;) {
      try { return foldOnce(args, excluded); } catch (error) {
        if (!(error instanceof Contained) || error.ids.every((id) => excluded.has(id))) throw error;
        for (const id of error.ids) excluded.add(id);
      }
    }
  });
}
function foldOnce({ base, generation, workoutFacts, engine, athleteId, source } = {}, excluded = new Set()) {
  if (!map(base) || !Array.isArray(base.exercises) || !Array.isArray(base.queue)) return refusedFold({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [], field: 'base' });
  if (!map(engine) || !text(engine.revision) || typeof engine.at !== 'function') return refusedFold({ code: 'NATIVE_LOAD_CAPABILITY_REQUIRED', refs: [], field: 'engine' });
  const facts = map(workoutFacts) ? workoutFacts : null;
  let state = withFacts(base, facts);
  const { ops, byId } = operationsOf(generation);
  // ADMISSION GATE (spec R9.1 :157): a native plan record is admitted only when committed
  // through this installation's guarded host into its own local log. A generation that
  // carries an imported source (the codec's 'sourceImports' collection, w5/source/codec.cjs:6)
  // is refused before folding whenever it holds any native record, exactly as the local host
  // refuses it (today-bindings.mjs project), so every FC03 caller (import replay included)
  // folds no native record from an imported or foreign source.
  const imports = map(generation) && map(generation.collections) && map(generation.collections.sourceImports) ? generation.collections.sourceImports : null;
  if (imports && Object.keys(imports).length && ops.some(isNative)) return refusedFold({ code: 'NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN', refs: [], field: 'source' });
  const issues = [], effects = new Map(), spent = [], groups = new Map();
  // A spend index entry. kind and base_load (the record's own) let FC01 judge a RESTORE-shaped
  // undo against the adoption it names (spec R9.2 :156), whatever the replay state.
  const entryOf = (b, refs) => ({ spend_id: b.spend_id, consumes: b.consumes.slice(), response_refs: refs, close_ref: null, cancelled_by: null, kind: b.kind, base_load: json(b.base_load) });
  // Spec :156 PER LIFT: a record or conflict that cannot be admitted makes ONLY its own
  // lift's new native prescription unavailable (every later effect of that lift is held
  // back and check refuses by the same code); other lifts and every fact save stand. An
  // issue whose lift cannot be resolved carries lift:null and holds back every check.
  // lift -> its holds. A record refused RECORD_INVALID holds the lift from its own place in
  // the authenticated log, never from the cut it claims (spec R9.2 :158, D1 :311 (a): a
  // record claiming an earlier cut, written after a genuine yes, does not hold that yes);
  // any other named refusal holds every later record of the lift.
  const disputed = new Map();
  const liftOf = (op) => { const b = map(op.payload) && map(op.payload.issuance) && map(op.payload.issuance.body) ? op.payload.issuance.body : null;
    const l = b && text(b.lift_lineage_id) ? LK(b.lift_lineage_id) : null;
    return l && base.exercises.some((x) => x && x.id === l) ? l : null; };
  const dispute = (issue) => {
    issues.push(issue);
    if (!issue.lift) return;
    const holdOps = (issue.refs || []).map((r) => byId.get(r.op_id)).filter(Boolean);
    disputed.set(issue.lift, [...(disputed.get(issue.lift) || []), { issue, ops: holdOps, logOrdered: issue.code === 'NATIVE_LOAD_RECORD_INVALID' }]);
  };
  // Is this record held back by the lift's holds? A log-ordered hold holds only records
  // that are not proven to precede it in the log.
  const behindHolds = (lift, recOps) => (disputed.get(lift) || []).some((h) => !h.issue.superseded_by &&
    (!h.logOrdered || !h.ops.length || !h.ops.every((hop) => provenBefore(recOps, hop, byId))));
  // Spec R9.11 M (1), R9.12 (:158 EXIT AFTER ITS HOLDS DISSOLVE; ONE ANCHOR; PM ruling STOP-R912-1/-2 option (C), no
  // witness): an adopt-baseline naming a non-empty load_basis.authority_refs, on a lift with NO active hold at its place,
  // keeps its exit (b) meaning when every ref is an authentic proposal-response of this lift, proven before the Start of
  // the latest consumed completion (the consumed root of greatest rank in facts.order.start_ids, ranked as S8 ranks it;
  // no facts or no consumed root: no anchor, no exit), and no hold issue of the lift, active or superseded, names it.
  // A ref that no hold ever named passes the same test: RESIDUAL (iv) (:157). A null and a numeric capture alike.
  const dissolvedExit = (body, holdIssues) => {
    if (body.kind !== 'adopt-baseline' || holdIssues.length || !facts) return false;
    const lift = LK(body.lift_lineage_id);
    const ar = map(body.basis) && map(body.basis.load_basis) && Array.isArray(body.basis.load_basis.authority_refs) ? body.basis.load_basis.authority_refs : [];
    if (!ar.length) return false;
    const rank = new Map(((facts.order && facts.order.start_ids) || []).map((id, k) => [id, k]));
    const roots = body.consumes.map((c) => { try { const k = JSON.parse(c); return Array.isArray(k) && k.length === 3 && text(k[0]) ? k[0] : null; } catch (_) { return null; } }).filter(Boolean);
    const latest = roots.slice().sort((a, b) => (rank.get(a) ?? -1) - (rank.get(b) ?? -1)).pop();
    const anchor = latest ? byId.get(latest) : null;
    if (!anchor || anchor.class !== 'session' || anchor.kind !== 'session-start') return false;
    return ar.every((r) => {
      if (!map(r) || !byId.has(r.op_id) || byId.get(r.op_id).canonical_content_commitment !== r.commitment) return false;
      const o = byId.get(r.op_id);
      return o.class === 'plan' && o.kind === 'proposal-response' && map(o.payload) && map(o.payload.issuance) && map(o.payload.issuance.body) &&
        LK(o.payload.issuance.body.lift_lineage_id) === lift && provenBefore([o], anchor, byId) &&
        !issues.some((i) => i && i.lift === lift && isHold(i) && (i.refs || []).some((x) => map(x) && x.op_id === r.op_id));
    });
  };
  // The native-load family: every native accept is admitted, coalesced or refused BY NAME.
  for (const op of ops) {
    if (!(op.class === 'plan' && op.kind === 'proposal-response' && map(op.payload) && map(op.payload.issuance) && op.payload.issuance.producer === PRODUCER)) continue;
    // Round 30 PER-RECORD CONTAINMENT (DECISIONS:856 (1) (b); spec :175, :155 per lift): no record makes the fold throw; an
    // unexpected exception while judging its shape refuses that record RECORD_INVALID, field payload, like any malformed accept.
    let why;
    try { why = structural(op, byId, athleteId, base); } catch (_) { why = 'unexpected exception'; }
    // A consumed reference absent from the log is spec R9 S3 (authentic work): field 'consumes'.
    // Spec R9.6 :155 S1 (fresh l1 N2): an absent lineage refuses field lift_lineage_id, never a generic field.
    // Round 30: the record validator names the field of the clause that owns the malformed member ('field <name>').
    if (why && why.startsWith('field ')) { dispute({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [refOf(op)], field: why.slice(6), reason: 'record shape', lift: liftOf(op) }); continue; }
      if (why) { dispute({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [refOf(op)], field: why === 'consumed reference absent' ? 'consumes' : why === 'lineage' ? 'lift_lineage_id' : 'payload', reason: why, lift: liftOf(op) }); continue; }
    const body = op.payload.issuance.body, g = groups.get(body.spend_id);
    if (!g) groups.set(body.spend_id, { body, ops: [op], seq: op.device_seq || 0, device: op.device_id });
    else if (same(g.body, body)) g.ops.push(op);
    // Two compensations of the SAME effect are one decision (spec R8 :121 "permanently
    // cancels the targeted effect"; its spend_id names only the target): a later body,
    // issued at another basis, is the same cancellation, folded unchanged with its ref kept
    // (review B14). Its representative is chosen below by op id, never by device order.
    else if (g.body.kind === 'compensate' && body.kind === 'compensate' && g.body.compensates === body.compensates) g.alt = (g.alt || []).concat([op]);
    else { g.conflict = true; g.others = (g.others || []).concat([op]); }
  }
  // ORDER-FREE canonical record (review B19, Claude l5 D-B5-1): every group's records are
  // ordered by op id, never by a device counter; a cancellation recorded as several bodies
  // takes the least op id as its representative, keeps every record as proof and sits at
  // the EARLIEST cut any of them was issued at.
  const cutOf = (b) => (map(b.basis) && map(b.basis.order) && Array.isArray(b.basis.order.start_ids) ? b.basis.order.start_ids.length : 0);
  for (const g of groups.values()) {
    const every = [...g.ops, ...(g.alt || [])].sort(byOp), bodyOf = (op) => op.payload.issuance.body;
    g.body = bodyOf(every[0]);
    g.ops = every.filter((op) => same(bodyOf(op), g.body));
    g.alt = every.filter((op) => !same(bodyOf(op), g.body));
    g.cut = Math.min(...every.map((op) => cutOf(bodyOf(op))));
  }
  // Round 31 (complete containment, above): a record whose accept or landing threw in an earlier pass is refused here, before
  // anything applies: RECORD_INVALID, field payload, refs = all its records, its own lift only; it takes no part in this pass.
  for (const g of [...groups.values()]) if ([...g.ops, ...g.alt].some((op) => excluded.has(op.op_id))) {
    groups.delete(g.body.spend_id);
    dispute({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [...g.ops, ...g.alt].map(refOf).sort(byOp), field: 'payload', reason: 'unexpected exception', lift: LK(g.body.lift_lineage_id) });
  }
  // Incompatible accepts are refused TOGETHER before anything applies: same spend with
  // different bodies, or different spends over overlapping evidence. Never a clock winner.
  const all = [...groups.values()];
  for (const g of all) for (const h of all) if (g !== h && g.body.spend_id < h.body.spend_id && sameLift(g.body.lift_lineage_id, h.body.lift_lineage_id) &&
    sameRoots(g.body.consumes, h.body.consumes)) { g.conflict = true; h.conflict = true; g.others = (g.others || []).concat(h.ops); h.others = (h.others || []).concat(g.ops); }
  // Every lift any conflicting body names is held, never the lift of whichever record the
  // log happened to list first (round 11, property seed 1003155: bodies of one spend naming
  // different lifts made the delivery order choose the held lift).
  for (const g of all) if (g.conflict) {
    const members = [...g.ops, ...(g.others || [])];
    const refs = [...new Map(members.map((op) => [op.op_id, refOf(op)])).values()].sort(byOp);
    const lifts = [...new Set(members.map((op) => LK(op.payload.issuance.body.lift_lineage_id)))].sort();
    for (const lift of lifts) if (!issues.some((i) => i.code === 'NATIVE_LOAD_EFFECT_CONFLICT' && i.lift === lift && same(i.refs, refs))) dispute({ code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs, field: null, lift });
  }
  // SOURCE ORDER, never a device-local counter (review B6; spec :150 "established causal
  // acceptance order", :156 "witnessed causal/source order"): a Close sits at its Start's
  // rank in the authenticated workout order; an accept sits just after the last Start of
  // the cut it was issued at. Equal places: accepts first, then fewer frontier effects
  // (a compensation names the effect it undoes), then op id (never a device counter).
  const events = all.filter((g) => !g.conflict).map((g) => {
    const frontier = map(g.body.basis) && Array.isArray(g.body.basis.effect_frontier) ? g.body.basis.effect_frontier.length : 0;
    return { type: 'accept', at: g.cut - 0.5, frontier, seq: 0, id: g.ops[0].op_id, g };
  });
  (facts && facts.order ? facts.order.start_ids : []).forEach((id, rank) => {
    const start = byId.get(id), session = facts.sessions.find((s) => s.start_op_id === id);
    if (!start || !session) return; // no causal witness in this log: nothing can land on it
    for (const entry of session.record.entries || []) if (entry && entry.completion) events.push({ type: 'close', at: rank, frontier: 0, seq: 0, id, start, session, entry });
  });
  events.sort((a, b) => a.at - b.at || (a.type === b.type ? 0 : a.type === 'accept' ? -1 : 1) || a.frontier - b.frontier || a.seq - b.seq || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const repair = new Map(); // spend_id -> its BASIS_REPAIR_REQUIRED issue (spec :157)
  const held = new Map();   // spend_id -> its load_basis EFFECT_CONFLICT issue (spec R8 :156)
  // Is a record's ORIGINAL cut reproduced by today's projection (DECISIONS:793, spec :154)?
  // Its issued basis binds what the evaluator read at issuance: plan.programme_sha256 is
  // the digest of every exercise record as the projection showed it (after the governor
  // replay over the facts of that cut), plan.structural_queue_sha256 the queue, and
  // coverage every fact op. Equal digests and covered fact ops: the same inputs.
  // Round 34 (B-R33C-1, DECISIONS:867; :155 ORIGINAL CUT, D-R9-1): `yes` are the record's responses. A set removed AFTER the yes
  // keeps its fact among the slot's removed_facts; an op of it outside coverage and not proven before the yes is a later edit, so
  // the cut is not reproduced (as for a later correction of a live fact). One proven before the yes is judged as before.
  const sameCut = (b, cut, S = state, yes = []) => {
    const p = map(b.basis) && map(b.basis.plan) ? b.basis.plan : {};
    if (sha(S.queue) !== p.structural_queue_sha256) return false;
    let s0 = withFacts(S, cut);
    try {
      const gv = engine.at(dayOf({ evidence: [] }, cut)).applyNativeLoadDecision(s0, null, { event: 'governor', basis: null, spent: [], authority: null, completion: null });
      if (gv && gv.status === 'applied' && map(gv.state)) s0 = gv.state;
    } catch (_) { return false; }
    if (sha(s0.exercises) !== p.programme_sha256) return false;
    const covered = new Set((Array.isArray(b.basis.coverage) ? b.basis.coverage : []).map((c) => (map(c) ? c.op_id : null)));
    for (const s of (cut && cut.sessions) || []) {
      if (!covered.has(s.start_op_id)) return false;
      for (const e of (s.record && s.record.entries) || []) {
        if (e && e.completion && !covered.has(e.completion.op_id)) return false;
        for (const slot of (e && e.slots) || []) {
          const f = slot.fact;
          if (f && (!covered.has(f.source_op_id) || (Array.isArray(f.edit_op_ids) && f.edit_op_ids.some((id) => !covered.has(id))))) return false;
          if (text(slot.skip_op_id) && !covered.has(slot.skip_op_id)) return false;
          for (const r of Array.isArray(slot.removed_facts) ? slot.removed_facts : []) if (map(r) && [r.source_op_id, ...(Array.isArray(r.edit_op_ids) ? r.edit_op_ids : [])]
            .some((id) => !covered.has(id) && !(byId.has(id) && yes.some((y) => provenBefore([byId.get(id)], y, byId))))) return false;
        }
      }
    }
    return true;
  };
  // Round 30 PER-RECORD CONTAINMENT (DECISIONS:856 (1) (b); spec :175, :155 per lift, :185): `judging` is the record whose accept or
  // landing is being judged; an unexpected exception there never escapes the fold: round 31 hands that record to foldNativeLoad,
  // which replays the fold with it refused RECORD_INVALID, field payload, for its own lift only (nothing of it applied).
  let judging = null;
  for (const ev of events) {
    judging = ev.type === 'accept' ? ev.g : null;
    try {
    if (ev.type === 'accept') {
      const g = ev.g, body = g.body, iss = g.ops[0].payload.issuance, refs = [...g.ops, ...(g.alt || [])].map(refOf).sort(byOp), lift = LK(body.lift_lineage_id);
      // Same-lift records wait behind a named refusal (the hold stands; nothing guesses past
      // it), but spec R9.1 :158 NO TRAP: a VALID record behind the hold is still accepted
      // history (kept in the spend index, never applied), so its undo stays reachable, and a
      // recorded undo is judged and applied as usual (RETIRE when unapplied).
      // Spec R9.2 :158 NO TRAP exit (b): an adoption of the athlete's actual loads on a held
      // lift, recorded after EVERY holding record, is judged on the held projection it was
      // issued on (w/wSets null, held native entries hidden) and supersedes the holds.
      const holdIssues = activeHolds(issues, lift);
      // The held projection's w is null, so the exit is always an adopt-baseline (c3: base null);
      // an adopt-observed issued on a held effect's weight is its dependent (R7-P1), not an exit.
      // "After" is the check's own order (walk seeds 20261013, 20261282, 20261316): a holding
      // record is proven before the adoption's response, or before the Start of the completion
      // it adopts when that Start is itself proven before the response.
      const anchors = [g.ops[0], ...body.consumes.map((c) => { try { const k = JSON.parse(c); return Array.isArray(k) ? byId.get(k[0]) : null; } catch { return null; } })
        .filter((s) => s && s.kind === 'session-start' && provenBefore([s], g.ops[0], byId))];
      const exitB = (body.kind === 'adopt-baseline' && holdIssues.length > 0 &&
        holdIssues.flatMap((i) => i.refs || []).every((r) => { const hop = byId.get(r.op_id); return !!hop && anchors.some((a) => provenBefore([hop], a, byId)); })) ||
        dissolvedExit(body, holdIssues);
      const V = exitB ? projectHeld(state, [lift]) : state;
      const behind = !exitB && behindHolds(lift, g.ops);
      const overlap = spent.filter((x) => x.spend_id !== body.spend_id && sameRoots(x.consumes, body.consumes));
      if (overlap.length) { dispute({ code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs: [...refs, ...overlap.flatMap((x) => x.response_refs)].sort(byOp), field: null, lift }); continue; }
      const rt0 = engine.at(dayOf(body, facts)), rt = atLift(rt0, body.lift_lineage_id);
      // Spec :153 (review B9): compensation is offered "only if no later Start captured the
      // accepted effect". A compensation recorded while such a Start exists is not applied;
      // that captured debut keeps its landing on its own Close.
      if (body.kind === 'compensate') {
        const target = groups.get(body.compensates);
        // Every record of the cancellation is proof of when it happened (review B19).
        if (target && capturedAfter(target, ops, byId, [...g.ops, ...g.alt])) { issues.push({ code: 'NATIVE_LOAD_COMPENSATION_DESCENDANTS', refs, field: 'capture', lift }); continue; }
      }
      // Spec R8 :156 UNPROVABLE ORDER (D7b, table :196): the base this accept was issued on
      // (base_load w/wSets, technique) is not the reconstructed one and no authenticated plan
      // op orders the change (this fold admits none), so the lift is refused EFFECT_CONFLICT,
      // refs = its response refs, field 'load_basis', before any re-validation, identically
      // under every revision and delivery order. The effect is neither applied as load nor
      // dropped: an earn keeps its queue entry (never captured: the registrar holds the lift,
      // never landed: see the Close below), the spend is kept, and only its compensation
      // (retire-only, no w write) or a later plan authority resolves it.
      // A same-lift effect issued on the working weight a HELD effect adopted (its spend_id's
      // load authority root is that spend) depends on it and is held with it: it read an
      // authority this fold never applied (property seeds 20269845, 20274085).
      // A record must BE a valid record before it can be held as accepted history: S1-S8
      // and DERIVABLE (spec R9 :155-156) run before the unprovable-order hold below
      // (round 11, property seed 20261111: a forged record under a later-moved base was
      // held with its spend kept, so a compensation could cancel it and a plan return
      // then dropped that proof).
      const changed = evidenceChanged(body, facts);
      const present = iss.revision === engine.revision;
      const atCut = (b) => factsAtCut(facts, b.basis.order.start_ids, b.basis.order.frontier);
      const members = body.kind === 'compensate' ? [...g.ops, ...g.alt].map((op) => op.payload.issuance.body) : [body];
      // Spec R9.13 (i) REFS-ARM-EVERY-REVISION, FORM (B) (PM ruling (i), DECISIONS:819; STOP-R20B2-3 = Astra L13-B1 = Fable
      // D-R20L1-6): a record that fails REFS-ARM is never re-evaluated under a present revision; it takes the correspondence branch
      // below, which refuses it RECORD_INVALID by its first failing field, exactly as an absent revision does (R1 = R2, :165
      // UNPROVABLE ORDER). A record that passes REFS-ARM (every genuine host exit in the ordered layout) is re-evaluated as before.
      const reproducible = present && !changed && members.every((b) => sameCut(b, atCut(b), V, [...g.ops, ...(g.alt || [])])) && refsArm(body, { facts, byId, issues });
      // STRUCTURAL CORRESPONDENCE (spec R9 :155): a record that is not re-evaluated applies
      // only when S1-S8 hold; the first failure refuses that lift by the failing field.
      if (!reproducible) {
        const field = correspondence(body, { facts, byId, source, issues, spent, groups });
        if (field) {
          const owner = field === 'lift_lineage_id' ? (() => { try { const k = JSON.parse(body.consumes[0]); return base.exercises.some((x) => x && x.id === LK(k[1])) ? LK(k[1]) : lift; } catch (_) { return lift; } })() : lift;
          dispute({ code: 'NATIVE_LOAD_RECORD_INVALID', refs, field, lift: owner }); continue;
        }
      }
      // DERIVABLE (spec R9 :156, FC01): every record, reproduced or not, before any
      // re-evaluation. FC01's own transition makes the judgement; its result is reused.
      const t = rt.applyNativeLoadDecision(V, body, { event: 'accept', basis: body.basis, spent: json(spent),
        authority: { response_refs: refs, issuance: iss, source_cut: iss.source }, completion: null });
      if (t.status === 'refused' && t.refusal && t.refusal.code === 'NATIVE_LOAD_RECORD_INVALID' && UNDERIVABLE.has(t.refusal.field)) {
        dispute({ code: 'NATIVE_LOAD_RECORD_INVALID', refs, field: t.refusal.field, lift }); continue;
      }
      const exNow = V.exercises.find((x) => x && x.id === lift);
      if (!behind && !exitB && body.kind !== 'compensate' && exNow && (movedBase(exNow, body) || held.has(authorityRoot(body.spend_id)))) {
        const issue = { code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs, field: 'load_basis', lift, spend_id: body.spend_id };
        issues.push(issue); held.set(body.spend_id, issue);
        if (body.kind === 'earn') {
          const t = rt.applyNativeLoadDecision(state, body, { event: 'accept', basis: body.basis, spent: json(spent),
            authority: { response_refs: refs, issuance: iss, source_cut: iss.source }, completion: null });
          if (t.status === 'applied') { state = t.state; effects.set(body.spend_id, t.effect); }
        }
        spent.push(entryOf(body, refs));
        continue;
      }
      // A refused accept transition. A yes that a LATER state precondition holds back (a legacy
      // PROPOSED entry for the lift, a vector plan under an adoption) is accepted history
      // (R8 :156 "Keep accepted history and facts"): its spend is kept and held unapplied, so
      // no landing uses it and its recorded cancellation still cancels it (:121, :153; round-8
      // seed 20261004); the issue keeps the transition's own name (:150, :176).
      // Spec R9.10 L LATER HOLD UNDO (D-R9.9-LATER-HOLD-UNDO, DECISIONS:804; :155): a claimed adopt-observed (non-empty
      // authority_refs, the MISSED-DEBUT ANCHOR's claim, verified above) refused TARGET_QUEUED because the lift's
      // pending native entries belong to earns this fold's repair map disputes (the later correction) is also held
      // back: its spend is kept, never applied, so its recorded Undo cancels it. Any other TARGET_QUEUED keeps today's rule.
      const laterHold = (code) => {
        if (code !== 'NATIVE_LOAD_TARGET_QUEUED' || body.kind !== 'adopt-observed' || !map(body.basis.load_basis) ||
            !Array.isArray(body.basis.load_basis.authority_refs) || !body.basis.load_basis.authority_refs.length) return false;
        const pending = V.queue.filter((q) => q && q.exId === lift && !q.done && typeof q.native_load_spend === 'string');
        return pending.length > 0 && pending.every((q) => repair.has(q.native_load_spend) && !!groups.get(q.native_load_spend) && groups.get(q.native_load_spend).body.kind === 'earn');
      };
      const refusedAccept = (refusal) => {
        const issue = { code: refusal.code, refs, field: refusal.field, lift };
        if (BLOCKING.has(issue.code)) { dispute(issue); return; }
        issues.push(issue);
        if (body.kind !== 'compensate' && (HELD_BACK.has(issue.code) || laterHold(issue.code)) && !spent.some((x) => x.spend_id === body.spend_id)) {
          issue.spend_id = body.spend_id; held.set(body.spend_id, issue);
          spent.push(entryOf(body, refs));
        }
      };
      if (changed) {
        const issue = { code: 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED', refs, field: null, lift, spend_id: body.spend_id };
        issues.push(issue); repair.set(body.spend_id, issue);
      }
      if (present) {
        if (reproducible) {
          // A CANCELLATION (spec R8 :121 "permanently cancels the targeted effect"; its
          // transition reads only the effect it names, never its recorded target) is valid
          // when, at the original cut of ANY of its records, that effect was eligible for
          // compensation; its recorded target is presentation, never re-priced against any
          // later base, including a return to the original one (reviews B15, B18). Every
          // other record must reproduce its exact body and reason at its original cut.
          // ORIGINAL CUT ONLY (DECISIONS:793, spec :154): a record is judged only against the
          // inputs its evaluator read at issuance. The issued basis binds them (the whole
          // programme, names, windows, caches and every lift's forks included, the structural
          // queue, and the coverage of every fact op). When today's reconstruction of that cut
          // is byte-identical by those digests, the record is re-evaluated on it; when it is
          // not (a rename, a window or cache edit, another lift's fork, a later correction of
          // an unconsumed fact), its inputs are no longer reproducible from the current
          // projection, and a later edit never revokes consent: the body applies as written,
          // exactly as under an absent revision. Newer plan authority is judged only by :156
          // (movedBase above). Nothing is guessed (review B23: no name candidates).
          const at = atCut, records = members;
          let again = null, reproduced;
          if (body.kind === 'compensate') {
            // Round 16b (spec :155 "validates each historical issuance at its ORIGINAL cut"):
            // EVERY record of the cancellation must re-evaluate to EXACTLY its own body. FC01's
            // compensation body is a pure function of the request (lift, compensates, the echoed
            // basis with its own effect_frontier), the lift's exercise and the queue, which the
            // cut digests cover, so a genuine record always does; naming the same compensates is
            // not enough (a re-shaped, re-digested body was accepted before).
            reproduced = records.every((b) => {
              const cut = at(b), ev2 = rt.evaluateNativeLoad(withFacts(V, cut), { lift_lineage_id: b.lift_lineage_id, completion_op_id: checkedCompletion(b, cut),
                intent: { compensate: b.compensates }, basis: b.basis });
              const ok = ev2.status === 'offer' && ev2.offers.some((o) => same(o.body, b));
              if (!ok && !again) again = ev2;
              return ok;
            });
          } else {
            const cut = at(body);
            const ev2 = rt.evaluateNativeLoad(withFacts(V, cut), { lift_lineage_id: body.lift_lineage_id,
              completion_op_id: checkedCompletion(body, cut), intent: 'check', basis: body.basis });
            again = ev2;
            reproduced = ev2.status === 'offer' && ev2.offers.some((o) => same(o.body, body) && o.reason === iss.reason);
          }
          if (!reproduced) {
            if (again.status === 'refused' && again.refusal.code === 'NATIVE_LOAD_PLAN_CHANGED') { issues.push({ code: 'NATIVE_LOAD_PLAN_CHANGED', refs, field: null, lift }); continue; }
            // (Round 8's "refusal the transition itself makes" branch is subsumed: a later
            // legacy entry changes the cut's structural queue digest, so such a record applies
            // as written and the transition names its refusal below, under every revision.)
            dispute({ code: 'NATIVE_LOAD_RECORD_INVALID', refs, field: 'issuance', reason: 'not reproduced at its original cut', lift }); continue;
          }
        }
      } else issues.push({ code: 'NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED', refs, field: null, lift });
      if (behind && body.kind !== 'compensate') {
        if (!spent.some((x) => x.spend_id === body.spend_id)) spent.push(entryOf(body, refs));
        continue;
      }
      if (t.status !== 'applied') {
        if (t.refusal) refusedAccept(t.refusal);
        continue;
      }
      if (exitB) {
        // The adopted loads become w; the lift's held native entries are retired (their
        // spends kept); every hold of the lift is superseded, kept as recorded history.
        // The projection's wSets null is not carried into the programme: the adopted loads are
        // one scalar w for every set (engine-capture reads any present wSets as a vector).
        const nx = { ...t.state.exercises.find((x) => x && x.id === lift) };
        if (nx.wSets === null) delete nx.wSets;
        state = { ...state, exercises: state.exercises.map((x) => (x && x.id === lift ? nx : x)),
          queue: state.queue.map((q) => (q && q.exId === lift && !q.done && typeof q.native_load_spend === 'string' ? { ...q, done: true, state: 'SUPERSEDED' } : q)) };
        for (const i of holdIssues) i.superseded_by = body.spend_id;
        for (const book of [repair, held]) for (const [k, v] of [...book]) if (v.lift === lift) book.delete(k);
        disputed.delete(lift);
      } else state = t.state;
      spent.push(entryOf(body, refs));
      if (body.kind === 'compensate') {
        const target = spent.find((x) => x.spend_id === body.compensates);
        if (target) target.cancelled_by = body.spend_id;
        const e = effects.get(body.compensates);
        if (e) e.kind = 'compensated';
        // Spec :157: the eligible compensating choice resolves the disputed basis.
        // Spec R8 :156: its compensation also clears an unprovable-order conflict.
        for (const book of [repair, held]) {
          const resolved = book.get(body.compensates);
          if (resolved) { issues.splice(issues.indexOf(resolved), 1); book.delete(body.compensates); }
        }
      } else effects.set(body.spend_id, t.effect);
      continue;
    }
    // A later Close: land the SAME native entry its Start captured, accepted before that Start.
    const lift = LK(ev.entry.lift_lineage_id);
    for (const q of state.queue.filter((x) => x && x.exId === lift && !x.done && typeof x.native_load_spend === 'string')) {
      const g = groups.get(q.native_load_spend);
      if (!g) continue;
      judging = g;
      const got = captureOf(ev.start, ev.entry);
      // Spec R9.9 :152 SELECTED ENTRY (DECISIONS:801 (1)): the card generated from q (newW on every
      // captured original slot whatever their number, else exactly newWSets); any other capture is
      // not this debut's card: nothing lands and nothing is consumed.
      if (!selectedEntry(got, q)) continue;
      const close = byId.get(ev.entry.completion.op_id);
      if (!close) continue;
      // Spec :157: no landing on a disputed basis; its BASIS_REPAIR_REQUIRED issue stands.
      if (repair.has(q.native_load_spend) || held.has(q.native_load_spend)) continue; // R8 :156: nor on an unprovable order
      // Spec :151 "Require acceptance before Start by proven causality"; table :198 names the
      // outcome: DEBUT_BASIS_UNPROVEN, Close saved, target pending/disputed, w does not land.
      // Proof is causal ancestry or one device's own sequence (provenBefore), never a
      // device-local counter compared across devices: unproven is REPORTED, never silent.
      if (!provenBefore(g.ops, ev.start, byId)) {
        issues.push({ code: 'NATIVE_LOAD_DEBUT_BASIS_UNPROVEN', refs: [refOf(close), ...g.ops.map(refOf).sort(byOp)], field: 'causality', lift });
        continue;
      }
      const t = atLift(engine.at(ev.session.effective.local_date), g.body.lift_lineage_id).applyNativeLoadDecision(state, g.body, { event: 'close', basis: g.body.basis, spent: json(spent),
        authority: { response_refs: g.ops.map(refOf).sort(byOp), issuance: g.ops[0].payload.issuance, source_cut: g.ops[0].payload.issuance.source },
        completion: { start: refOf(ev.start), close: refOf(close), capture: got, entry: ev.entry, source_basis: g.body.basis.source } });
      if (t.status === 'applied') {
        state = t.state;
        // Spec R9.9 :123/:152: the spend index's close_ref is written by a landing only; a MISSED
        // DEBUT (effect 'missed') consumes the entry and leaves close_ref null.
        const x = spent.find((y) => y.spend_id === g.body.spend_id); if (x && t.effect && t.effect.kind === 'landed') x.close_ref = refOf(close);
        effects.set(g.body.spend_id, t.effect);
      } else if (t.refusal) issues.push({ code: t.refusal.code, refs: t.refusal.refs, field: t.refusal.field, lift });
    }
    } catch (error) {
      if (!judging) throw error;
      throw new Contained([...judging.ops, ...(judging.alt || [])].map((op) => op.op_id));
    }
  }
  // Step 6 (spec R8 :135): the governor projection, ONCE per projection, after the accepted
  // effects and before registration, seeded by this projection's immutable base (no
  // transition above writes holdFlag), so a re-projection never replays its own output.
  if (facts) {
    const gv = engine.at(dayOf({ evidence: [] }, facts)).applyNativeLoadDecision(state, null, { event: 'governor', basis: null, spent: [], authority: null, completion: null });
    if (gv.status === 'applied') state = gv.state;
    else if (gv.status === 'refused' && gv.refusal) issues.push({ code: gv.refusal.code, refs: [], field: 'governor', lift: null });
  }
  const blocked = false; // spec :156: refusals are per lift (disputed) and never refuse the whole programme
  const coverage = [...groups.values()].filter((g) => spent.some((x) => x.spend_id === g.body.spend_id)).map((g) => {
    const x = spent.find((y) => y.spend_id === g.body.spend_id);
    return { spend_id: x.spend_id, response_refs: x.response_refs, issue_cut: json(g.body.basis.order), source: g.ops[0].payload.issuance.source, consumes: x.consumes, close_ref: x.close_ref };
  });
  return { status: blocked ? 'refused' : 'ready', state: blocked ? null : state, effects: [...effects.values()], spent, issues, coverage };
}

// ---------- check at the current cut and the exact issuance ----------
function checkNativeLoad(args = {}) {
  const pairs = map(args.base) && Array.isArray(args.base.exercises) ? lineagePairs(args.lineage, args.base) : null;
  return withLineage(pairs === false ? null : pairs, () => checkOnce(args));
}
function checkOnce(args = {}) {
  const { generation, workoutFacts, engine, source, athleteId, plan, request } = args;
  const fold = foldNativeLoad(args);
  const refused = (refusal) => ({ fold, evaluation: { profile: PRODUCER, status: 'refused', basis: null, offers: [], refusal } });
  if (fold.status !== 'ready') { const i = fold.issues.find((x) => BLOCKING.has(x.code)) || fold.issues[0]; return refused({ code: i.code, refs: i.refs, field: i.field || null }); }
  if (!map(request) || !text(request.lift_lineage_id) || !text(request.completion_op_id)) return refused({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [], field: 'request' });
  // Spec :156 per lift: this lift's (or an unattributable) blocking issue refuses its check by the same code and refs.
  // Spec R8 :156: an unprovable-order conflict keeps its own compensation reachable
  // ("dispatched before this refusal"), so only that spend's undo passes it.
  const undoOf = map(request.intent) && text(request.intent.compensate) ? request.intent.compensate : null;
  const lift = LK(request.lift_lineage_id);
  // An unattributable refusal (lift null) still holds back every check.
  const unattributed = fold.issues.find((x) => BLOCKING.has(x.code) && (x.lift === null || x.lift === undefined));
  if (unattributed) return refused({ code: unattributed.code, refs: unattributed.refs, field: unattributed.field || null });
  // Spec R9.2 :158 NO TRAP: a hold refuses EARNS only. Its refusal names the holding
  // record(s): a record-level refusal first, else the disputed bases (spec :157/:161).
  const holds = activeHolds(fold.issues, lift);
  const holdRefusal = () => {
    const first = holds.find((x) => BLOCKING.has(x.code));
    if (first) return refused({ code: first.code, refs: first.refs, field: first.field || null });
    return refused({ code: 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED', refs: holds.flatMap((x) => x.refs).sort(byOp), field: null });
  };
  // Exit (a): the undo of every genuine accepted spend of the lift (kept in the spend index,
  // not yet cancelled) is dispatched before the hold refusal; FC01 and the capture guard
  // below judge it (COMPENSATION_DESCENDANTS unchanged).
  const undoable = !!undoOf && fold.spent.some((x) => x.spend_id === undoOf && !x.cancelled_by && sameLift(decodeLift(undoOf), lift));
  const evalLift = undoOf && text(decodeLift(undoOf)) && sameLift(decodeLift(undoOf), lift) ? decodeLift(undoOf) : lift;
  // Fable l8 D-L8F-3 (spec :158 NO TRAP, I7): a cancellation group the fold refused (an active
  // RECORD_INVALID naming a record of this very cancellation) can never apply, so its Undo is
  // not offered again (a yes that could never take effect); that hold's own refusal is shown and
  // exit (b) stays the way out.
  if (undoOf) {
    const undoSpend = JSON.stringify(['native-load-compensation', evalLift, undoOf]), { byId: byId0 } = operationsOf(generation);
    const spoiled = holds.find((x) => x.code === 'NATIVE_LOAD_RECORD_INVALID' && (x.refs || []).some((r) => { const op = map(r) ? byId0.get(r.op_id) : null;
      return !!op && map(op.payload) && map(op.payload.issuance) && map(op.payload.issuance.body) && op.payload.issuance.body.spend_id === undoSpend; }));
    if (spoiled) return refused({ code: spoiled.code, refs: spoiled.refs, field: spoiled.field || null });
  }
  if (undoOf && holds.length && !undoable) return holdRefusal();
  // Spec :153 "only if no later Start captured the accepted effect" (review B9). FC01's
  // request carries no Start capture (:91), which lives on the authenticated Start op
  // (:122), so this check reads it here and refuses by FC01's own name and refs.
  if (undoOf) {
    // The target is read from its retained issuance, so a HELD (unapplied) effect is judged
    // by the same capture predicate the fold applies to a recorded undo (review B16).
    const x = fold.spent.find((y) => y.spend_id === undoOf);
    if (x) {
      const { ops, byId } = operationsOf(generation);
      const acceptOps = x.response_refs.map((r) => byId.get(r.op_id)).filter((op) => op && map(op.payload) && map(op.payload.issuance) && map(op.payload.issuance.body));
      const g = acceptOps.length ? { body: acceptOps[0].payload.issuance.body, ops: acceptOps } : null;
      if (g && capturedAfter(g, ops, byId)) return refused({ code: 'NATIVE_LOAD_COMPENSATION_DESCENDANTS', refs: x.response_refs.slice(), field: null });
    }
  }
  // Exit (b): on a held lift, a completion ordered after EVERY holding record is evaluated on
  // the held projection (w/wSets null, held native entries hidden, so TARGET_QUEUED blocks
  // earns only and step 2 sees no plan change); only its step-3 adoption is offered.
  if (holds.length && !undoOf) {
    if (!map(workoutFacts) || !map(workoutFacts.order)) return holdRefusal();
    const { byId } = operationsOf(generation), hit0 = sessionOf(workoutFacts, request.completion_op_id, lift);
    const start = hit0 ? byId.get(hit0.session.start_op_id) : null;
    // Spec R9.9 :152/:158: no hold names a Close any more (a missed debut is not a hold), so the
    // completion must be proven after every holding record.
    const after = !!start && holds.flatMap((x) => x.refs || []).every((r) => { const hop = byId.get(r.op_id); return !!hop && provenBefore([hop], start, byId); });
    // Spec R9.3 :162 (G3): a completion not proven after every holding record is never
    // offered an adoption. If its Start captured a numeric load (a card closed after the
    // hold included), the projection differs from its capture: PLAN_CHANGED [Close Ref];
    // otherwise the hold's own refusal.
    if (!after) {
      if (hit0 && start && captureOf(start, hit0.entry).some((v) => typeof v === 'number'))
        return refused({ code: 'NATIVE_LOAD_PLAN_CHANGED', refs: [refOf(byId.get(request.completion_op_id))].filter(Boolean), field: null });
      return holdRefusal();
    }
    const shown = projectHeld(fold.state, [lift]);
    const pb = basisOf({ state: shown, generation, workoutFacts, source, athleteId, plan, lift, spent: fold.spent });
    // Spec R9.9 :155 ADOPT-BASELINE ANCHOR: an exit issued under the held projection names the
    // hold's own records in load_basis.authority_refs (holding proposal-responses; never a Close).
    const holdRefs = new Map();
    for (const x of holds) for (const r of x.refs || []) if (map(r) && text(r.op_id)) holdRefs.set(r.op_id, { op_id: r.op_id, commitment: r.commitment });
    pb.load_basis.authority_refs = [...holdRefs.values()].sort(byOp);
    const ev = engine.at(hit0.session.effective.local_date).evaluateNativeLoad(shown, { lift_lineage_id: lift, completion_op_id: request.completion_op_id, intent: 'check', basis: pb });
    if (ev.status === 'offer' && ev.offers.length && ev.offers.every((o) => map(o.body) && (o.body.kind === 'adopt-baseline' || o.body.kind === 'adopt-observed'))) return { fold, evaluation: ev };
    // Spec R9.4 :162: a lift with a legacy PROPOSED entry keeps LEGACY_PENDING (the check sees
    // legacy entries; only the registered projection hides them, :159), by FC01's own refusal.
    if (ev.status === 'refused' && map(ev.refusal) && ev.refusal.code === 'NATIVE_LOAD_LEGACY_PENDING') return { fold, evaluation: ev };
    // Spec R9.6 :163 SCOPE (fresh l1 N1, Astra L8 B30): outside the supported adoption domain the
    // domain refusal is shown [Close Ref], never the hold's own code; the lift stays held.
    if (ev.status === 'refused' && map(ev.refusal) && (ev.refusal.code === 'NATIVE_LOAD_VECTOR_ADOPTION_UNDEFINED' || ev.refusal.code === 'NATIVE_LOAD_SCALAR_SLICE_ONLY')) return { fold, evaluation: ev };
    return holdRefusal();
  }
  if (!map(workoutFacts) || !map(workoutFacts.order)) return refused({ code: 'NATIVE_LOAD_COMPLETION_REQUIRED', refs: [], field: 'workoutFacts' });
  const basis = basisOf({ state: fold.state, generation, workoutFacts, source, athleteId, plan, lift, spent: fold.spent });
  // Spec R9.9 :152 MISSED CLOSE / :155 MISSED-DEBUT ANCHOR (l11 A1): when the fold marks a native
  // entry of this lift consumed MISSED by this very Close, the check claims it: authority_refs =
  // [that Close's Ref], as an exit carries its hold refs. Filled for a check only; FC01 judges the
  // Close as the MISSED CLOSE with both the mark and this claim. Every other request keeps [].
  const missedQ = fold.state.queue.find((q) => q && q.exId === lift && q.done === true && q.state === 'MISSED' &&
    typeof q.native_load_spend === 'string' && q.native_load_missed_by === request.completion_op_id);
  const claimCov = missedQ ? basis.coverage.find((c) => map(c) && c.op_id === request.completion_op_id) : null;
  if (claimCov && (request.intent === undefined || request.intent === 'check')) basis.load_basis.authority_refs = [{ op_id: claimCov.op_id, commitment: claimCov.commitment }];
  const hit = sessionOf(workoutFacts, request.completion_op_id, lift);
  const day = hit ? hit.session.effective.local_date : dayOf({ evidence: [] }, workoutFacts);
  const evaluation = atLift(engine.at(day), evalLift).evaluateNativeLoad(fold.state, { lift_lineage_id: evalLift,
    completion_op_id: request.completion_op_id, intent: request.intent === undefined ? 'check' : request.intent, basis });
  // Step 2 (spec :126 "an older completion cannot silently replace a newer athlete
  // choice"; :127, :148; review B22): FC01 compares the captured vector with the current plan
  // for typed v2 slots, which carry it. Host v1 slots do not; their capture lives on the
  // authenticated Start op (:122), so the same comparison is made here, by the same rule
  // (planVector, null when w is null) and with FC01's name and refs. The rep WINDOW is
  // bound as far as the capture proves it (:126 "load/vector/count/window/technique remain
  // identical", :184; review B25): every Start capture cell carries the rep target the
  // window allowed then, so a captured target above the current window top proves the
  // window changed since that completion and refuses PLAN_CHANGED, for typed and host
  // slots alike. (The capture records targets, not the window itself: a change that keeps
  // every captured target inside the new window is not provable here; reported.) Step 2
  // precedes every reader, so the refusal replaces an offer or any refusal FC01 makes after
  // its own step 2; earlier refusals keep FC01's precedence.
  const judged = evaluation.status === 'offer' || (evaluation.status === 'refused' && map(evaluation.refusal) && AFTER_STEP_2.has(evaluation.refusal.code));
  if (judged && (request.intent === undefined || request.intent === 'check') && hit) {
    const { byId } = operationsOf(generation), start = byId.get(hit.session.start_op_id);
    const originals = hit.entry.slots.filter((s) => s.origin !== 'added'), ex = fold.state.exercises.find((x) => x && x.id === lift);
    // Spec :176 refs = [Close Ref], read from the basis coverage exactly as FC01 reads it;
    // never an empty list (review D-B6-2).
    const cov = basis.coverage.find((c) => map(c) && c.op_id === request.completion_op_id);
    if (start && ex && cov) {
      // Spec R9.10 L (3) FIT GUARD (:146): the same guard as FC01 step 2 (b), first, before the comparison below and
      // step3Earn, with the same code, refs and field (typed v2 and host v1 slots agree, N20).
      if (Array.isArray(ex.wSets) && ex.wSets.length !== originals.length) return refused({ code: 'NATIVE_LOAD_SET_COUNT_BASIS_UNPROVEN', refs: [{ op_id: cov.op_id, commitment: cov.commitment }], field: null });
      const cap = originals.every((s) => s.prescribed_load === undefined) ? startPlanCapture(start, lift) : [];
      // Spec R9.10 L READER (DECISIONS:804 (f)): planVector's rule, as E/progression.cjs:80-82 (a position beyond a
      // non-empty wSets reads its last entry).
      const planNow = Array.from({ length: Math.max(1, ex.sets || 1) }, (_, i) => { const k = Array.isArray(ex.wSets) && ex.wSets.length > 0 ? Math.min(i, ex.wSets.length - 1) : -1; return ex.w == null ? null : k >= 0 && ex.wSets[k] != null ? ex.wSets[k] : ex.w; });
      // Spec R9.9 :152 MISSED CLOSE (DECISIONS:801 (1)): a Close the fold marks as this lift's missed
      // debut is compared with the missed entry's target (newWSets, else newW on every captured
      // slot, whatever their number) instead of the plan; FC01 already refused its earn branch.
      const want = missedQ ? entryTargetOf(missedQ, cap.length) : planNow;
      const window = startWindowCapture(start, lift), hi = ex.hi === undefined ? null : ex.hi;
      // Spec R9.1 :127: the window binds only the earn branch (FC01 steps 4-10). Adoption
      // (step 3: w null, or a performed load unlike the plan) and compensation never are.
      // An offer names its branch; a refusal is placed by FC01's own step-3 predicate.
      const loadAt = (s) => (s.state === 'performed' && s.fact && s.fact.current && map(s.fact.current.load) ? s.fact.current.load.value : undefined);
      // Spec R9.2 :127 C2: only after step 3 has CHOSEN earn. A refusal from before step 3
      // (an unresolved slot) or from the adoption branch keeps FC01's own code. Earn-only
      // reader codes are earn; SOURCE_OVERLAP and VECTOR_ADOPTION_UNDEFINED occur in both
      // branches and are placed by FC01's step-3 predicate (w present and every original
      // slot performed at the planned load).
      const code = evaluation.status === 'refused' && map(evaluation.refusal) ? evaluation.refusal.code : null;
      const step3Earn = ex.w != null && originals.length > 0 && originals.every((s, i) => s.state === 'performed' && loadAt(s) === planNow[i]);
      const earnBranch = evaluation.status === 'offer' ? evaluation.offers.some((o) => map(o.body) && o.body.kind === 'earn')
        : EARN_READER_CODES.has(code) || ((code === 'NATIVE_LOAD_SOURCE_OVERLAP' || code === 'NATIVE_LOAD_VECTOR_ADOPTION_UNDEFINED') && step3Earn);
      if ((cap.length && !same(cap, want)) || (earnBranch && windowUnproven(window, hi)))
        return refused({ code: 'NATIVE_LOAD_PLAN_CHANGED', refs: [{ op_id: cov.op_id, commitment: cov.commitment }], field: null });
    }
  }
  return { fold, evaluation };
}
// The host-held issuance: exactly {producer, body, reason, revision, source, moment},
// in the field order respond() digests; the UI never receives an editable copy.
function issuanceFor(offer, { revision, source, moment } = {}) {
  if (!map(offer) || !map(offer.body) || !text(offer.reason) || !text(revision) || !text(source) || !text(moment)) throw new TypeError('NATIVE_LOAD_ISSUANCE_INCOMPLETE');
  const issuance = { producer: PRODUCER, body: json(offer.body), reason: offer.reason, revision, source, moment };
  return { proposal_id: proposalDigest(issuance.producer, issuance.body, issuance.reason), issuance };
}
// The completed lifts of one Close, for a post-Finish check (route B) or the button (A).
function completedLifts(workoutFacts, closeOpId) {
  const out = [];
  for (const s of (workoutFacts && workoutFacts.sessions) || []) for (const e of s.record.entries || [])
    if (e && e.completion && (closeOpId === undefined || e.completion.op_id === closeOpId) && e.completion.kind === 'normal') out.push({ lift_lineage_id: e.lift_lineage_id, completion_op_id: e.completion.op_id, date: s.effective.local_date });
  return out;
}
// The producer revision (spec B "revision identifies the sealed producer bytes"; D-B-2):
// sha256 over, in runtime MODULES order then entered-load, one line per producer file
// "rebuild/engine/<name>.cjs" NUL sha256hex(file bytes) LF, for dates, constants, plan,
// performed, progression, sleep, energy, policy, today, volume, earn, writers,
// native-load, entered-load. The bundle cannot read files, so this is a CONSTANT that
// CI verifies against the bytes (FC12 row R2-REVISION, run by rebuild.yml's FC12 step):
// any engine byte change without re-binding turns that row red. A record issued under
// any other revision is applied from its body with PRODUCER_REVISION_ABSENT_APPLIED.
const PRODUCER_REVISION = 'earned/native-load/v1+sha256:f4955594d9532949789cd7031b650a7eb84c84f499dee69330a2d220290d7366';
const BLOCKING_CODES = Object.freeze([...BLOCKING]);
module.exports = { PRODUCER, PRODUCER_REVISION, BLOCKING_CODES, FAMILY, proposalDigest, sha256Hex, basisOf, foldNativeLoad, checkNativeLoad, issuanceFor, sameIssued, completedLifts, operationsOf,
  heldProjection, HOLD_CODES: Object.freeze([...HOLD_CODES]), isHold, LINEAGE_PROFILE,
  // S11 FC09 round 6: FC01 as one record lift sees it under a correspondence (the engine boundary), for FC09-LINEAGE-BOUNDARY.
  lineageRuntime: (rt, recordLift, lineage, base) => { const pairs = lineagePairs(lineage, base);
    if (pairs === false) throw new TypeError('NATIVE_LOAD_LINEAGE_REFUSED');
    return Object.freeze({ evaluateNativeLoad: (s, q) => withLineage(pairs, () => atLift(rt, recordLift).evaluateNativeLoad(s, q)),
      applyNativeLoadDecision: (s, d, c) => withLineage(pairs, () => atLift(rt, recordLift).applyNativeLoadDecision(s, d, c)) }); } };
