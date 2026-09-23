'use strict';
// NATIVE-LOAD FC03 (rebuild/coach/NATIVE-LOAD-SPEC.md R7, 6ddf7af, sha256 98c0cf7a...):
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
// Spec R8 :156 (D7b): the reconstructed lift no longer has the base the accept recorded.
function movedBase(ex, body) {
  const img = (k) => (Object.hasOwn(ex, k) ? { present: true, value: ex[k] === undefined ? null : json(ex[k]) } : { present: false, value: null });
  const f = map(body.base_load) && map(body.base_load.fields) ? body.base_load.fields : {};
  const forks = map(body.basis) && map(body.basis.technique) && Array.isArray(body.basis.technique.forks) ? body.basis.technique.forks : [];
  return !same(img('w'), f.w) || !same(img('wSets'), f.wSets) || !same(json(ex.forks || []), forks);
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
// Re-validation at the ORIGINAL cut (spec :154): the equipment fields a later
// equipment-only choice may change (step 2: steps/inc) are read as the issued basis
// recorded them. Load, vector, count and window are NOT restored: a change there is a
// plan change and keeps its own outcome.
function atIssuedEquipment(state, body) {
  const s = json(state), ex = s.exercises.find((x) => x && x.id === body.lift_lineage_id), lb = body.basis && body.basis.load_basis;
  if (ex && map(lb)) for (const k of ['steps', 'inc']) {
    const img = lb[k];
    if (map(img) && img.present === true) ex[k] = json(img.value);
    else if (map(img) && img.present === false) delete ex[k];
  }
  return s;
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
function foldNativeLoad({ base, generation, workoutFacts, engine, athleteId } = {}) {
  if (!map(base) || !Array.isArray(base.exercises) || !Array.isArray(base.queue)) return refusedFold({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [], field: 'base' });
  if (!map(engine) || !text(engine.revision) || typeof engine.at !== 'function') return refusedFold({ code: 'NATIVE_LOAD_CAPABILITY_REQUIRED', refs: [], field: 'engine' });
  const facts = map(workoutFacts) ? workoutFacts : null;
  let state = withFacts(base, facts);
  const { ops, byId } = operationsOf(generation);
  const issues = [], effects = new Map(), spent = [], groups = new Map();
  // Spec :156 PER LIFT: a record or conflict that cannot be admitted makes ONLY its own
  // lift's new native prescription unavailable (every later effect of that lift is held
  // back and check refuses by the same code); other lifts and every fact save stand. An
  // issue whose lift cannot be resolved carries lift:null and holds back every check.
  const disputed = new Set();
  const liftOf = (op) => { const b = map(op.payload) && map(op.payload.issuance) && map(op.payload.issuance.body) ? op.payload.issuance.body : null;
    return b && text(b.lift_lineage_id) && base.exercises.some((x) => x && x.id === b.lift_lineage_id) ? b.lift_lineage_id : null; };
  const dispute = (issue) => { issues.push(issue); if (issue.lift) disputed.add(issue.lift); };
  // The native-load family: every native accept is admitted, coalesced or refused BY NAME.
  for (const op of ops) {
    if (!(op.class === 'plan' && op.kind === 'proposal-response' && map(op.payload) && map(op.payload.issuance) && op.payload.issuance.producer === PRODUCER)) continue;
    const why = structural(op, byId, athleteId, base);
    if (why) { dispute({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [refOf(op)], field: 'payload', reason: why, lift: liftOf(op) }); continue; }
    const body = op.payload.issuance.body, g = groups.get(body.spend_id);
    if (!g) groups.set(body.spend_id, { body, ops: [op], seq: op.device_seq || 0, device: op.device_id });
    else if (same(g.body, body)) g.ops.push(op);
    // Two compensations of the SAME effect are one decision (spec R8 :121 "permanently
    // cancels the targeted effect"; its spend_id names only the target): a later body,
    // issued at another basis, is the same cancellation, folded unchanged with its ref kept
    // (review B14). The first recorded body (device order) is the one validated.
    else if (g.body.kind === 'compensate' && body.kind === 'compensate' && g.body.compensates === body.compensates) g.alt = (g.alt || []).concat([op]);
    else { g.conflict = true; g.others = (g.others || []).concat([op]); }
  }
  // Incompatible accepts are refused TOGETHER before anything applies: same spend with
  // different bodies, or different spends over overlapping evidence. Never a clock winner.
  const all = [...groups.values()];
  for (const g of all) for (const h of all) if (g !== h && g.body.spend_id < h.body.spend_id && g.body.lift_lineage_id === h.body.lift_lineage_id &&
    g.body.consumes.some((c) => h.body.consumes.includes(c))) { g.conflict = true; h.conflict = true; g.others = (g.others || []).concat(h.ops); h.others = (h.others || []).concat(g.ops); }
  for (const g of all) if (g.conflict) {
    const refs = [...new Map([...g.ops, ...(g.others || [])].map((op) => [op.op_id, refOf(op)])).values()].sort(byOp);
    if (!issues.some((i) => i.code === 'NATIVE_LOAD_EFFECT_CONFLICT' && same(i.refs, refs))) dispute({ code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs, field: null, lift: g.body.lift_lineage_id });
  }
  // SOURCE ORDER, never a device-local counter (review B6; spec :150 "established causal
  // acceptance order", :156 "witnessed causal/source order"): a Close sits at its Start's
  // rank in the authenticated workout order; an accept sits just after the last Start of
  // the cut it was issued at. Equal places: accepts first, then fewer frontier effects
  // (a compensation names the effect it undoes), then device sequence and op id.
  const events = all.filter((g) => !g.conflict).map((g) => {
    const cut = map(g.body.basis) && map(g.body.basis.order) && Array.isArray(g.body.basis.order.start_ids) ? g.body.basis.order.start_ids.length : 0;
    const frontier = map(g.body.basis) && Array.isArray(g.body.basis.effect_frontier) ? g.body.basis.effect_frontier.length : 0;
    return { type: 'accept', at: cut - 0.5, frontier, seq: g.seq, id: g.ops[0].op_id, g };
  });
  (facts && facts.order ? facts.order.start_ids : []).forEach((id, rank) => {
    const start = byId.get(id), session = facts.sessions.find((s) => s.start_op_id === id);
    if (!start || !session) return; // no causal witness in this log: nothing can land on it
    for (const entry of session.record.entries || []) if (entry && entry.completion) events.push({ type: 'close', at: rank, frontier: 0, seq: 0, id, start, session, entry });
  });
  events.sort((a, b) => a.at - b.at || (a.type === b.type ? 0 : a.type === 'accept' ? -1 : 1) || a.frontier - b.frontier || a.seq - b.seq || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const repair = new Map(); // spend_id -> its BASIS_REPAIR_REQUIRED issue (spec :157)
  const held = new Map();   // spend_id -> its load_basis EFFECT_CONFLICT issue (spec R8 :156)
  for (const ev of events) {
    if (ev.type === 'accept') {
      const g = ev.g, body = g.body, iss = g.ops[0].payload.issuance, refs = [...g.ops, ...(g.alt || [])].map(refOf).sort(byOp), lift = body.lift_lineage_id;
      if (disputed.has(lift)) continue; // same-lift dependencies wait behind the named refusal
      const overlap = spent.filter((x) => x.spend_id !== body.spend_id && x.consumes.some((c) => body.consumes.includes(c)));
      if (overlap.length) { dispute({ code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs: [...refs, ...overlap.flatMap((x) => x.response_refs)].sort(byOp), field: null, lift }); continue; }
      const rt = engine.at(dayOf(body, facts));
      // Spec :153 (review B9): compensation is offered "only if no later Start captured the
      // accepted effect". A compensation recorded while such a Start exists is not applied;
      // that captured debut keeps its landing on its own Close.
      if (body.kind === 'compensate') {
        const target = groups.get(body.compensates);
        if (target && capturedAfter(target, ops, byId, g.ops)) { issues.push({ code: 'NATIVE_LOAD_COMPENSATION_DESCENDANTS', refs, field: 'capture', lift }); continue; }
      }
      // Spec R8 :156 UNPROVABLE ORDER (D7b, table :196): the base this accept was issued on
      // (base_load w/wSets, technique) is not the reconstructed one and no authenticated plan
      // op orders the change (this fold admits none), so the lift is refused EFFECT_CONFLICT,
      // refs = its response refs, field 'load_basis', before any re-validation, identically
      // under every revision and delivery order. The effect is neither applied as load nor
      // dropped: an earn keeps its queue entry (never captured: the registrar holds the lift,
      // never landed: see the Close below), the spend is kept, and only its compensation
      // (retire-only, no w write) or a later plan authority resolves it.
      const exNow = state.exercises.find((x) => x && x.id === lift);
      if (body.kind !== 'compensate' && exNow && movedBase(exNow, body)) {
        const issue = { code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs, field: 'load_basis', lift, spend_id: body.spend_id };
        issues.push(issue); held.set(body.spend_id, issue);
        if (body.kind === 'earn') {
          const t = rt.applyNativeLoadDecision(state, body, { event: 'accept', basis: body.basis, spent: json(spent),
            authority: { response_refs: refs, issuance: iss, source_cut: iss.source }, completion: null });
          if (t.status === 'applied') { state = t.state; effects.set(body.spend_id, t.effect); }
        }
        spent.push({ spend_id: body.spend_id, consumes: body.consumes.slice(), response_refs: refs, close_ref: null, cancelled_by: null });
        continue;
      }
      const changed = evidenceChanged(body, facts);
      if (changed) {
        const issue = { code: 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED', refs, field: null, lift, spend_id: body.spend_id };
        issues.push(issue); repair.set(body.spend_id, issue);
      }
      if (iss.revision === engine.revision) {
        if (!changed) {
          const cut = factsAtCut(facts, body.basis.order.start_ids, body.basis.order.frontier);
          const again = rt.evaluateNativeLoad(withFacts(atIssuedEquipment(state, body), cut), { lift_lineage_id: body.lift_lineage_id, completion_op_id: checkedCompletion(body, cut),
            intent: body.kind === 'compensate' ? { compensate: body.compensates } : 'check', basis: body.basis });
          // Spec R8 :156: the compensation of an effect HELD under an unprovable order is
          // retire-only "because the prior image is no longer provably current", so its
          // recorded target is never re-priced against a later base (review B15): at its
          // original cut it must still be ELIGIBLE for the same effect, and it then writes
          // nothing. Every other record must reproduce its exact body and reason.
          const retireOnly = body.kind === 'compensate' && held.has(body.compensates);
          const reproduced = again.status === 'offer' && (retireOnly
            ? again.offers.some((o) => o.body.compensates === body.compensates)
            : again.offers.some((o) => same(o.body, body) && o.reason === iss.reason));
          if (!reproduced) {
            if (again.status === 'refused' && again.refusal.code === 'NATIVE_LOAD_PLAN_CHANGED') { issues.push({ code: 'NATIVE_LOAD_PLAN_CHANGED', refs, field: null, lift }); continue; }
            dispute({ code: 'NATIVE_LOAD_RECORD_INVALID', refs, field: 'issuance', reason: 'not reproduced at its original cut', lift }); continue;
          }
        }
      } else issues.push({ code: 'NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED', refs, field: null, lift });
      const t = rt.applyNativeLoadDecision(state, body, { event: 'accept', basis: body.basis, spent: json(spent),
        authority: { response_refs: refs, issuance: iss, source_cut: iss.source }, completion: null });
      if (t.status !== 'applied') {
        if (t.refusal) { const issue = { code: t.refusal.code, refs, field: t.refusal.field, lift }; if (BLOCKING.has(issue.code)) dispute(issue); else issues.push(issue); }
        continue;
      }
      state = t.state;
      spent.push({ spend_id: body.spend_id, consumes: body.consumes.slice(), response_refs: refs, close_ref: null, cancelled_by: null });
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
      } else if (t.refusal) issues.push({ code: t.refusal.code, refs: t.refusal.refs, field: t.refusal.field, lift });
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
  if (fold.status !== 'ready') { const i = fold.issues.find((x) => BLOCKING.has(x.code)); return refused({ code: i.code, refs: i.refs, field: i.field || null }); }
  if (!map(request) || !text(request.lift_lineage_id) || !text(request.completion_op_id)) return refused({ code: 'NATIVE_LOAD_RECORD_INVALID', refs: [], field: 'request' });
  // Spec :156 per lift: this lift's (or an unattributable) blocking issue refuses its check by the same code and refs.
  // Spec R8 :156: an unprovable-order conflict keeps its own compensation reachable
  // ("dispatched before this refusal"), so only that spend's undo passes it.
  const undoOf = map(request.intent) && text(request.intent.compensate) ? request.intent.compensate : null;
  const blocking = fold.issues.find((x) => BLOCKING.has(x.code) && (x.lift === request.lift_lineage_id || x.lift === null || x.lift === undefined) &&
    !(undoOf && x.spend_id === undoOf));
  if (blocking) return refused({ code: blocking.code, refs: blocking.refs, field: blocking.field || null });
  // Spec :157: a disputed basis refuses further load authorization until "an eligible
  // compensating choice" resolves it, so only the compensation of a disputed spend passes.
  const disputed = fold.issues.filter((x) => x.code === 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED' && x.lift === request.lift_lineage_id);
  const undo = !!undoOf && disputed.some((x) => x.spend_id === undoOf);
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
  if (disputed.length && !undo) return refused({ code: 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED', refs: disputed.flatMap((x) => x.refs).sort(byOp), field: null });
  if (!map(workoutFacts) || !map(workoutFacts.order)) return refused({ code: 'NATIVE_LOAD_COMPLETION_REQUIRED', refs: [], field: 'workoutFacts' });
  const basis = basisOf({ state: fold.state, generation, workoutFacts, source, athleteId, plan, lift: request.lift_lineage_id, spent: fold.spent });
  const hit = sessionOf(workoutFacts, request.completion_op_id, request.lift_lineage_id);
  const day = hit ? hit.session.effective.local_date : dayOf({ evidence: [] }, workoutFacts);
  const evaluation = engine.at(day).evaluateNativeLoad(fold.state, { lift_lineage_id: request.lift_lineage_id,
    completion_op_id: request.completion_op_id, intent: request.intent === undefined ? 'check' : request.intent, basis });
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
const PRODUCER_REVISION = 'earned/native-load/v1+sha256:9688ad8abc639ea867cb833eebd5d33c8d8aa8f0db356e6283038d6bf6bb741e';
const BLOCKING_CODES = Object.freeze([...BLOCKING]);
module.exports = { PRODUCER, PRODUCER_REVISION, BLOCKING_CODES, FAMILY, proposalDigest, sha256Hex, basisOf, foldNativeLoad, checkNativeLoad, issuanceFor, sameIssued, completedLifts, operationsOf };
