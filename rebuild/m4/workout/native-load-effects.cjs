'use strict';
// NATIVE-LOAD FC03 (rebuild/coach/NATIVE-LOAD-SPEC.md R9.8 105cc28, sha256 28c73fa4..., on R9.4 a575692; first built on R7 6ddf7af):
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
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const map = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = (x) => typeof x === 'string' && x.length > 0;
const byOp = (a, b) => (a.op_id < b.op_id ? -1 : a.op_id > b.op_id ? 1 : 0);

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
    if (e && e.completion && e.completion.op_id === closeId && (lift === undefined || e.lift_lineage_id === lift)) return { session: s, entry: e };
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
  for (const cell of pc) if (map(cell) && cell.lift_lineage_id === entry.lift_lineage_id && text(cell.logical_set_slot)) cells.set(cell.logical_set_slot, cell.load);
  return entry.slots.filter((s) => s.origin !== 'added').map((s) => (cells.has(s.logical_set_slot) ? cellValue(cells.get(s.logical_set_slot))
    : s.prescribed_load && s.prescribed_load.state === 'specified' && s.prescribed_load.source ? s.prescribed_load.source.value : null));
}
// One Start's captured load vector for one lift, in position order (the same cells).
function startCapture(start, lift) {
  const pc = map(start.prescription_capture) && Array.isArray(start.prescription_capture.slots) ? start.prescription_capture.slots : [];
  const cells = [];
  for (const cell of pc) {
    if (!map(cell) || cell.lift_lineage_id !== lift || !text(cell.logical_set_slot)) continue;
    let at = null;
    try { const k = JSON.parse(cell.logical_set_slot); at = Array.isArray(k) && k[0] === lift && Number.isSafeInteger(k[1]) ? k[1] : null; } catch (_) { at = null; }
    if (at !== null) cells.push([at, cellValue(cell.load)]);
  }
  return cells.sort((a, b) => a[0] - b[0]).map((c) => c[1]);
}
// Spec :153 "only if no later Start captured the accepted effect" (review B9): some
// authenticated Start after the accept (provenBefore) captured exactly its target vector.
// Scoped to the EXACT effect (review B13; R8 :151 proven causality, :153, :154 original
// cut): a Start can have captured this effect only while it was pending, i.e. after its
// accept AND not after the compensation being judged (`undoOps`). A Start proven to follow
// that compensation captured some other, later effect of the same vector, never this one.
function capturedAfter(g, ops, byId, undoOps) {
  const lift = g.body.lift_lineage_id, want = (g.body.target_load && Array.isArray(g.body.target_load.vector) ? g.body.target_load.vector : []).map((x) => (map(x) ? x.value : null));
  return ops.some((op) => op.class === 'session' && op.kind === 'session-start' && same(startCapture(op, lift), want) && provenBefore(g.ops, op, byId) &&
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
    if (!map(cell) || cell.lift_lineage_id !== lift || !text(cell.logical_set_slot)) continue;
    let at = null, v = null;
    try { const k = JSON.parse(cell.logical_set_slot); at = Array.isArray(k) && k[0] === lift && Number.isSafeInteger(k[1]) ? k[1] : null; } catch (_) { at = null; }
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
    if (!map(cell) || cell.lift_lineage_id !== lift || !map(cell.reps) || cell.reps.state !== 'specified' || !text(cell.reps.source_json)) continue;
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
  return !same(img('w'), f.w) || !same(img('wSets'), f.wSets) || !same(json(ex.forks || []), forks);
}
// Spec R9.2 :158: the named refusals that hold a lift (earns refused, the adoption exit open).
const HOLD_CODES = new Set(['NATIVE_LOAD_RECORD_INVALID', 'NATIVE_LOAD_EFFECT_CONFLICT', 'NATIVE_LOAD_SOURCE_OVERLAP', 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED']);
// Spec R9.6 :152/:158: a MISSED DEBUT (DEBUT_BASIS_UNPROVEN, reason missed_target) also holds its lift.
const isMissed = (i) => !!i && i.code === 'NATIVE_LOAD_DEBUT_BASIS_UNPROVEN' && i.reason === 'missed_target';
const isHold = (i) => !!i && (HOLD_CODES.has(i.code) || isMissed(i));
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
function heldProjection(fold) {
  const issues = (fold && fold.issues ? fold.issues : []).filter((i) => i && typeof i.lift === 'string' && isHold(i) && !i.superseded_by);
  const lifts = new Set(issues.map((i) => i.lift));
  return { state: fold && fold.state ? projectHeld(fold.state, [...lifts], { legacy: true }) : null, lifts, issues };
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
  const captures = ((workoutFacts && workoutFacts.sessions) || []).map((s) => (s.record.entries || []).filter((e) => e && e.lift_lineage_id === lift)
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
  if (!base.exercises.some((x) => x && x.id === body.lift_lineage_id)) return 'lineage';
  for (const item of body.evidence) {
    const refs = [item.start, item.close, ...item.sets.flatMap((s) => [s.original, ...(s.edits || [])])].filter((r) => r !== null);
    for (const r of refs) { const o = byId.get(r && r.op_id); if (!o || o.canonical_content_commitment !== r.commitment) return 'consumed reference absent'; }
  }
  return null;
}

// STRUCTURAL CORRESPONDENCE (spec R9 :155, B26): a record that is NOT re-evaluated
// (revision absent, its cut not reproducible, or its basis corrected) applies only when
// S1-S8 all hold; the first failure names its field. Returns that field, or null.
// Technique basis as spendIdOf reads it: the latest reset fork (plan.cjs:31 resetForksOf).
const resetForks = (forks) => (Array.isArray(forks) ? forks : []).filter((f) => f && (f.kind ? f.kind !== 'context' : !f.split));
function correspondence(body, { facts, byId, source, issues = [], spent = [], groups = null }) {
  const lift = body.lift_lineage_id;
  const isOp0 = (id, kind) => { const o = byId.get(id); return !!o && o.class === 'session' && o.kind === kind; };
  // Spec R9.1 :155 (B-R9-4): a compensation keeps the existing cancellation identity: S1
  // body lift = the compensated spend's lift; S2 the canonical compensation spend; consumes
  // and evidence both []; S3-S5 and S8 vacuous; S6 and S7 as for every record.
  if (body.kind === 'compensate') {
    let target = null;
    try { target = JSON.parse(body.compensates); } catch (_) { target = null; }
    if (!Array.isArray(target) || target[1] !== lift) return 'lift_lineage_id';
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
  if (roots.some((r) => !r || r.lift !== lift)) return 'lift_lineage_id';
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
    const item = body.evidence.find((x) => x.close.op_id === latest.close);
    const actual = item.sets.filter((s) => s.origin !== 'added').map((s) => (s.state === 'performed' && map(s.current) && map(s.current.load) ? s.current.load.value : null));
    if (body.kind === 'adopt-baseline') {
      // Spec R9.6/R9.7 :155 ADOPT-BASELINE ANCHOR: the base is the record's own projection (all
      // null, DERIVABLE c2); a NUMERIC capture of the consumed Start is admitted only when
      // load_basis.authority_refs names the lift's hold records, checked against the ops, never
      // trusted (R9.7, Fable l8 D-L8F-4):
      // - a MISSED DEBUT Close: it is the consumed Close, the consumed Start captured this lift's
      //   selected native entry (an accepted, uncancelled, unlanded earn of this lift whose
      //   target vector is that capture; read from the fold's accepted records, not from the
      //   replay-time queue, so a later legacy entry that holds the yes back never revokes a
      //   verified miss: property seed 20268799), and the S4-bound actual loads differ from
      //   that entry's target;
      // - any other ref: a record of this lift that the fold itself classifies as holding at
      //   this cut (an active hold issue of the lift naming it).
      if (baseVec.some((v) => v !== null)) return 'base_load';
      if (cap.some((v) => typeof v === 'number')) {
        const ar = map(body.basis.load_basis) && Array.isArray(body.basis.load_basis.authority_refs) ? body.basis.load_basis.authority_refs : [];
        const vec = (b) => (map(b) && map(b.target_load) && Array.isArray(b.target_load.vector) ? b.target_load.vector.map((x) => (map(x) ? x.value : null)) : null);
        const entries = (spent || []).filter((x) => x && !x.cancelled_by && !x.close_ref).map((x) => (groups && groups.get(x.spend_id) ? groups.get(x.spend_id).body : null))
          .filter((b) => b && b.kind === 'earn' && b.lift_lineage_id === lift && same(vec(b), cap));
        const target = entries.length ? vec(entries[0]) : null;
        const holding = (id) => (issues || []).some((i) => i && i.lift === lift && isHold(i) && !i.superseded_by && (i.refs || []).some((x) => map(x) && x.op_id === id));
        const ok = (r) => { if (r === null || !authentic(r)) return false; const o = byId.get(r.op_id);
          if (o.class === 'session' && o.kind === 'session-close')
            return r.op_id === latest.close && !!target && same(cap, target) && !same(actual, target);
          return o.class === 'plan' && o.kind === 'proposal-response' && map(o.payload) && map(o.payload.issuance) && map(o.payload.issuance.body) &&
            o.payload.issuance.body.lift_lineage_id === lift && holding(r.op_id); };
        if (!ar.length || !ar.every(ok)) return 'base_load';
      }
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
    const now = hit.entry.slots.map((slot) => {
      const f = slot.fact, cur = slot.state === 'performed' && f && f.current ? f.current : null;
      return { slot: slot.logical_set_slot, position: slot.position, state: slot.state,
        original: f ? f.source_op_id : text(slot.skip_op_id) ? slot.skip_op_id : null,
        edits: f && Array.isArray(f.edit_op_ids) ? f.edit_op_ids.slice() : [],
        current: cur ? { load: cur.load, reps: cur.reps, reserve: cur.reserve === undefined ? null : cur.reserve } : null };
    });
    if (!same(now, item.sets.map(shape))) return true;
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
    const e = s && s.record.entries.find((x) => x && x.lift_lineage_id === body.lift_lineage_id);
    if (e) return e.completion.op_id;
  }
  return '';
}
const refusedFold = (issue) => ({ status: 'refused', state: null, effects: [], spent: [], issues: [issue], coverage: [] });

// ---------- the fold (spec B "Apply and fold", every current projection) ----------
function foldNativeLoad({ base, generation, workoutFacts, engine, athleteId, source } = {}) {
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
    return b && text(b.lift_lineage_id) && base.exercises.some((x) => x && x.id === b.lift_lineage_id) ? b.lift_lineage_id : null; };
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
  // The native-load family: every native accept is admitted, coalesced or refused BY NAME.
  for (const op of ops) {
    if (!(op.class === 'plan' && op.kind === 'proposal-response' && map(op.payload) && map(op.payload.issuance) && op.payload.issuance.producer === PRODUCER)) continue;
    const why = structural(op, byId, athleteId, base);
    // A consumed reference absent from the log is spec R9 S3 (authentic work): field 'consumes'.
    // Spec R9.6 :155 S1 (fresh l1 N2): an absent lineage refuses field lift_lineage_id, never a generic field.
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
  // Incompatible accepts are refused TOGETHER before anything applies: same spend with
  // different bodies, or different spends over overlapping evidence. Never a clock winner.
  const all = [...groups.values()];
  for (const g of all) for (const h of all) if (g !== h && g.body.spend_id < h.body.spend_id && g.body.lift_lineage_id === h.body.lift_lineage_id &&
    g.body.consumes.some((c) => h.body.consumes.includes(c))) { g.conflict = true; h.conflict = true; g.others = (g.others || []).concat(h.ops); h.others = (h.others || []).concat(g.ops); }
  // Every lift any conflicting body names is held, never the lift of whichever record the
  // log happened to list first (round 11, property seed 1003155: bodies of one spend naming
  // different lifts made the delivery order choose the held lift).
  for (const g of all) if (g.conflict) {
    const members = [...g.ops, ...(g.others || [])];
    const refs = [...new Map(members.map((op) => [op.op_id, refOf(op)])).values()].sort(byOp);
    const lifts = [...new Set(members.map((op) => op.payload.issuance.body.lift_lineage_id))].sort();
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
  const sameCut = (b, cut, S = state) => {
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
        }
      }
    }
    return true;
  };
  for (const ev of events) {
    if (ev.type === 'accept') {
      const g = ev.g, body = g.body, iss = g.ops[0].payload.issuance, refs = [...g.ops, ...(g.alt || [])].map(refOf).sort(byOp), lift = body.lift_lineage_id;
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
      const exitB = body.kind === 'adopt-baseline' && holdIssues.length > 0 &&
        holdIssues.flatMap((i) => i.refs || []).every((r) => { const hop = byId.get(r.op_id); return !!hop && anchors.some((a) => provenBefore([hop], a, byId)); });
      const V = exitB ? projectHeld(state, [lift]) : state;
      const behind = !exitB && behindHolds(lift, g.ops);
      const overlap = spent.filter((x) => x.spend_id !== body.spend_id && x.consumes.some((c) => body.consumes.includes(c)));
      if (overlap.length) { dispute({ code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs: [...refs, ...overlap.flatMap((x) => x.response_refs)].sort(byOp), field: null, lift }); continue; }
      const rt = engine.at(dayOf(body, facts));
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
      const reproducible = present && !changed && members.every((b) => sameCut(b, atCut(b), V));
      // STRUCTURAL CORRESPONDENCE (spec R9 :155): a record that is not re-evaluated applies
      // only when S1-S8 hold; the first failure refuses that lift by the failing field.
      if (!reproducible) {
        const field = correspondence(body, { facts, byId, source, issues, spent, groups });
        if (field) {
          const owner = field === 'lift_lineage_id' ? (() => { try { const k = JSON.parse(body.consumes[0]); return base.exercises.some((x) => x && x.id === k[1]) ? k[1] : lift; } catch (_) { return lift; } })() : lift;
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
      const refusedAccept = (refusal) => {
        const issue = { code: refusal.code, refs, field: refusal.field, lift };
        if (BLOCKING.has(issue.code)) { dispute(issue); return; }
        issues.push(issue);
        if (body.kind !== 'compensate' && HELD_BACK.has(issue.code) && !spent.some((x) => x.spend_id === body.spend_id)) {
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
    const lift = ev.entry.lift_lineage_id;
    for (const q of state.queue.filter((x) => x && x.exId === lift && !x.done && typeof x.native_load_spend === 'string')) {
      const g = groups.get(q.native_load_spend);
      if (!g) continue;
      const want = g.body.target_load.vector.map((x) => x.value);
      const got = captureOf(ev.start, ev.entry);
      if (!same(want, got)) continue; // this Start did not capture the debut: nothing lands
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
      const t = engine.at(ev.session.effective.local_date).applyNativeLoadDecision(state, g.body, { event: 'close', basis: g.body.basis, spent: json(spent),
        authority: { response_refs: g.ops.map(refOf).sort(byOp), issuance: g.ops[0].payload.issuance, source_cut: g.ops[0].payload.issuance.source },
        completion: { start: refOf(ev.start), close: refOf(close), capture: got, entry: ev.entry, source_basis: g.body.basis.source } });
      if (t.status === 'applied') {
        state = t.state;
        const x = spent.find((y) => y.spend_id === g.body.spend_id); if (x) x.close_ref = refOf(close);
        effects.set(g.body.spend_id, t.effect);
      } else if (t.refusal) issues.push({ code: t.refusal.code, refs: t.refusal.refs, field: t.refusal.field, lift,
        ...(t.refusal.field === 'missed_target' ? { reason: 'missed_target' } : {}) });
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
  const { generation, workoutFacts, engine, source, athleteId, plan, request } = args;
  const fold = foldNativeLoad(args);
  const refused = (refusal) => ({ fold, evaluation: { profile: PRODUCER, status: 'refused', basis: null, offers: [], refusal } });
  if (fold.status !== 'ready') { const i = fold.issues.find((x) => BLOCKING.has(x.code)) || fold.issues[0]; return refused({ code: i.code, refs: i.refs, field: i.field || null }); }
  if (!map(request) || !text(request.lift_lineage_id) || !text(request.completion_op_id)) return refused({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [], field: 'request' });
  // Spec :156 per lift: this lift's (or an unattributable) blocking issue refuses its check by the same code and refs.
  // Spec R8 :156: an unprovable-order conflict keeps its own compensation reachable
  // ("dispatched before this refusal"), so only that spend's undo passes it.
  const undoOf = map(request.intent) && text(request.intent.compensate) ? request.intent.compensate : null;
  const lift = request.lift_lineage_id;
  // An unattributable refusal (lift null) still holds back every check.
  const unattributed = fold.issues.find((x) => BLOCKING.has(x.code) && (x.lift === null || x.lift === undefined));
  if (unattributed) return refused({ code: unattributed.code, refs: unattributed.refs, field: unattributed.field || null });
  // Spec R9.2 :158 NO TRAP: a hold refuses EARNS only. Its refusal names the holding
  // record(s): a record-level refusal first, else the disputed bases (spec :157/:161).
  const holds = activeHolds(fold.issues, lift);
  const holdRefusal = () => {
    const first = holds.find((x) => BLOCKING.has(x.code) || isMissed(x));
    if (first) return refused({ code: first.code, refs: first.refs, field: first.field || null });
    return refused({ code: 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED', refs: holds.flatMap((x) => x.refs).sort(byOp), field: null });
  };
  // Exit (a): the undo of every genuine accepted spend of the lift (kept in the spend index,
  // not yet cancelled) is dispatched before the hold refusal; FC01 and the capture guard
  // below judge it (COMPENSATION_DESCENDANTS unchanged).
  const undoable = !!undoOf && fold.spent.some((x) => x.spend_id === undoOf && !x.cancelled_by && decodeLift(undoOf) === lift);
  // Fable l8 D-L8F-3 (spec :158 NO TRAP, I7): a cancellation group the fold refused (an active
  // RECORD_INVALID naming a record of this very cancellation) can never apply, so its Undo is
  // not offered again (a yes that could never take effect); that hold's own refusal is shown and
  // exit (b) stays the way out.
  if (undoOf) {
    const undoSpend = JSON.stringify(['native-load-compensation', lift, undoOf]), { byId: byId0 } = operationsOf(generation);
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
    // Spec R9.6 :152: the missed completion is itself exit-eligible (its own Close is its hold's record).
    const after = !!start && holds.flatMap((x) => x.refs || []).every((r) => r.op_id === request.completion_op_id || (() => { const hop = byId.get(r.op_id); return !!hop && provenBefore([hop], start, byId); })());
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
    // Spec R9.6 :155 ADOPT-BASELINE ANCHOR: an exit issued under the held projection names the
    // hold's own records in load_basis.authority_refs (a missed debut: the missed Close).
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
  const basis = basisOf({ state: fold.state, generation, workoutFacts, source, athleteId, plan, lift: request.lift_lineage_id, spent: fold.spent });
  const hit = sessionOf(workoutFacts, request.completion_op_id, request.lift_lineage_id);
  const day = hit ? hit.session.effective.local_date : dayOf({ evidence: [] }, workoutFacts);
  const evaluation = engine.at(day).evaluateNativeLoad(fold.state, { lift_lineage_id: request.lift_lineage_id,
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
    const originals = hit.entry.slots.filter((s) => s.origin !== 'added'), ex = fold.state.exercises.find((x) => x && x.id === request.lift_lineage_id);
    // Spec :176 refs = [Close Ref], read from the basis coverage exactly as FC01 reads it;
    // never an empty list (review D-B6-2).
    const cov = basis.coverage.find((c) => map(c) && c.op_id === request.completion_op_id);
    if (start && ex && cov) {
      const cap = originals.every((s) => s.prescribed_load === undefined) ? startPlanCapture(start, request.lift_lineage_id) : [];
      const planNow = Array.from({ length: Math.max(1, ex.sets || 1) }, (_, i) => (ex.w == null ? null : Array.isArray(ex.wSets) && ex.wSets[i] != null ? ex.wSets[i] : ex.w));
      const window = startWindowCapture(start, request.lift_lineage_id), hi = ex.hi === undefined ? null : ex.hi;
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
      if ((cap.length && !same(cap, planNow)) || (earnBranch && windowUnproven(window, hi)))
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
const PRODUCER_REVISION = 'earned/native-load/v1+sha256:1d87743d41827618de425e971563ea11e1e2b770305ed75f88a410a8942c443d';
const BLOCKING_CODES = Object.freeze([...BLOCKING]);
module.exports = { PRODUCER, PRODUCER_REVISION, BLOCKING_CODES, FAMILY, proposalDigest, sha256Hex, basisOf, foldNativeLoad, checkNativeLoad, issuanceFor, sameIssued, completedLifts, operationsOf,
  heldProjection, HOLD_CODES: Object.freeze([...HOLD_CODES]), isHold };
