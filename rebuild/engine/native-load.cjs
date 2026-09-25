'use strict';
// NATIVE-LOAD FC01 (rebuild/coach/NATIVE-LOAD-SPEC.md R9.10 d3a3ffa, sha256 6bd14f81..., on R9.9 679567a and R9.4 a575692; first built on R7 6ddf7af).
// earned/native-load/v1: the native evaluator and transition. Pure: no disk, no
// clock read, no id minting, no mutation of any input. Every earning rule is the
// engine's own, reached through the private table E (earnWalk, _deriveSightingFull,
// _loadTenure, atTopOfWindow, eraFresh, nextLoad, performed readers and the moved
// governor updateOpenerHold). No threshold, error formula, increment or date rule is
// introduced here. Owner answer YES (DECISIONS:784-785): the sealed consent constant
// is 'yes-only', so every candidate, the ordinary one-rung DEBUT included, is an
// offer that needs a yes; adoption asks first (H6). No other policy switch exists.
module.exports = function createNativeLoad(E) {
const PROFILE = 'earned/native-load/v1';
const DECISION = 'earned/native-load-decision/v1';
const CONSENT = 'yes-only';
const DECISION_KEYS = ['base_load', 'basis', 'candidate', 'compensates', 'consumes', 'evidence', 'kind', 'lift_lineage_id', 'profile', 'reason_key', 'spend_id', 'target_load'];
const BASIS_KEYS = ['athlete_id', 'coverage', 'effect_frontier', 'load_basis', 'order', 'plan', 'source', 'technique'];
const FIELDS = ['w', 'wSets', 'wAt', 'last', 'lastMeta', 'own', 'std', 'topAt', 'topRun'];
const KINDS = ['adopt-baseline', 'adopt-observed', 'earn', 'compensate'];
const REASON_KEYS = { 'adopt-baseline': 'baseline', 'adopt-observed': 'observed-load', earn: 'canonical-earn', compensate: 'compensation' };
const STRUCTURAL = ['debut', 'unlock', 'own', 'reclaim', 'ladder'];

const json = (x) => JSON.parse(JSON.stringify(x));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const map = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = (x) => typeof x === 'string' && x.length > 0;
const lb = (value) => ({ value, unit: 'lb' });
const byOp = (a, b) => (a.op_id < b.op_id ? -1 : a.op_id > b.op_id ? 1 : 0);
const sorted = (xs) => [...new Set(xs)].sort();

// A refusal is thrown internally and returned as data: {code, refs, field}.
function refuse(code, refs = [], field = null) {
  const error = new Error('NATIVE_LOAD_' + code);
  error.nativeRefusal = { code: 'NATIVE_LOAD_' + code, refs: json(refs), field };
  throw error;
}
// Named reader refusals keep their own names (spec B, named outcomes); anything
// unexpected is EVALUATION_FAILED and leaks neither message nor facts.
function refusalOf(error) {
  if (error && error.nativeRefusal) return error.nativeRefusal;
  if (error && typeof error.code === 'string' && /^(PERFORMED|PROGRESSION)_[A-Z_]+$/.test(error.code)) return { code: error.code, refs: [], field: null };
  return { code: 'NATIVE_LOAD_EVALUATION_FAILED', refs: [], field: null };
}

// ---------- typed effort adapter (spec B nativeEffort, D1 TYPES) ----------
// Exact 0/1/2 return the number; the registered bound at_least 3 becomes a frozen
// private token (numeric coercion 3, string coercion effortText); unavailable tags
// are null. performed.cjs:30-31 admits at_least only with value 3, so the strict
// sites writers.cjs:238 and earn.cjs:45 never meet a bound. Anything else refuses.
const TOKENS = new Map();
function nativeEffort(value) {
  if (value === undefined || value === null) return null;
  if (!map(value)) refuse('EFFORT_BRIDGE_UNPROVEN', [], 'reserve');
  if (value.tag === 'exact' && value.unit === 'rep' && [0, 1, 2].includes(value.value) && Object.keys(value).length === 3) return value.value;
  if (value.tag === 'at_least' && value.unit === 'rep' && value.value === 3 && Object.keys(value).length === 3) {
    if (!TOKENS.has(3)) {
      const words = E.effortText(value);
      TOKENS.set(3, Object.freeze({ valueOf: () => 3, toString: () => words }));
    }
    return TOKENS.get(3);
  }
  if (['unknown', 'skipped', 'not_asked', 'absent', 'removed', 'unresolved'].includes(value.tag) && Object.keys(value).length === 1) return null;
  refuse('EFFORT_BRIDGE_UNPROVEN', [], 'reserve');
}
const words = (value) => { try { return E.effortText(value); } catch (_) { return 'unknown'; } };

// ---------- request, basis and cut ----------
function validRequest(request) {
  if (!map(request) || !text(request.lift_lineage_id) || !text(request.completion_op_id) || !map(request.basis)) refuse('RECORD_INVALID', [], 'request');
  const intent = request.intent;
  if (!(intent === 'check' || (map(intent) && Object.keys(intent).length === 1 && text(intent.compensate)))) refuse('RECORD_INVALID', [], 'intent');
  const b = request.basis;
  if (!same(Object.keys(b).sort(), BASIS_KEYS)) refuse('RECORD_INVALID', [], 'basis');
  if (!Array.isArray(b.coverage) || !map(b.order) || !Array.isArray(b.order.start_ids) || !Array.isArray(b.effect_frontier) ||
      !map(b.load_basis) || !map(b.technique)) refuse('RECORD_INVALID', [], 'basis');
  return request;
}
function coverageOf(basis) {
  const out = new Map();
  for (const c of basis.coverage) {
    if (!map(c) || !text(c.op_id) || !text(c.commitment) || out.has(c.op_id)) refuse('RECORD_INVALID', [], 'basis.coverage');
    out.set(c.op_id, c.commitment);
  }
  return (id) => { if (!out.has(id)) refuse('SOURCE_FRONTIER_UNPROVEN', [], 'basis.coverage'); return { op_id: id, commitment: out.get(id) }; };
}
const refsOf = (xs) => (Array.isArray(xs) ? xs : []).filter((r) => map(r) && text(r.op_id) && text(r.commitment)).map((r) => ({ op_id: r.op_id, commitment: r.commitment }));
// spend_id is the canonical JSON of ['native-load', lift, load authority root,
// technique basis, consumes] (spec B spend_id); it therefore decodes to its consumes.
function decodeSpend(id) {
  try {
    const v = JSON.parse(id);
    if (Array.isArray(v) && v.length === 5 && v[0] === 'native-load' && text(v[1]) && Array.isArray(v[4]) && v[4].every(text)) return { lift: v[1], consumes: v[4] };
    if (Array.isArray(v) && v.length === 3 && v[0] === 'native-load-compensation' && text(v[1]) && text(v[2])) return { lift: v[1], consumes: [] };
  } catch (_) { /* fall through */ }
  return null;
}

// ---------- typed rows of one lift, in the registered causal order ----------
function liftRows(s, lift, all) {
  const out = [];
  for (const row of all || E.performedHistoryRows(s)) {
    if (row.source !== 'performed') continue;
    const entry = ((row.rec || {}).entries || []).find((e) => E.performedEntry(e) && e.lift_lineage_id === lift);
    if (entry) out.push({ start: row.start_op_id, close: entry.completion.op_id, date: row.d, entry });
  }
  return out;
}
const originalSlots = (entry) => entry.slots.filter((slot) => slot.origin !== 'added');
// The authorised per-position load vector, exactly as progression.cjs:80-82 projects it. Spec R9.10 L READER
// (DECISIONS:804 (f)): a position beyond a non-empty stored vector reads its last listed weight.
const planVector = (ex) => Array.from({ length: Math.max(1, ex.sets || 1) }, (_, i) => { const k = Array.isArray(ex.wSets) && ex.wSets.length > 0 ? Math.min(i, ex.wSets.length - 1) : -1; return k >= 0 && ex.wSets[k] != null ? ex.wSets[k] : ex.w; });
const captured = (slot) => {
  const p = slot.prescribed_load;
  if (!p || p.state !== 'specified') return null;
  return p.source && p.source.kind === 'configuration' ? p.source.configuration_key : p.source.value;
};
const loadOf = (v) => (v === null || v === undefined ? null : typeof v === 'number' ? lb(v) : { kind: 'configuration', configuration_key: String(v) });
// Semantic root of one completed lift (spec B spend_id): Start, lift, Close; never an edit id.
function rootOf(row, lift) {
  if (row.source === 'legacy' || row.native === false) return JSON.stringify(['legacy', String(row.d), lift]);
  const close = row.close || (row.en && row.en.completion && row.en.completion.op_id);
  return JSON.stringify([row.start || row.start_op_id, lift, close]);
}
function fieldImage(ex) {
  const out = {};
  for (const k of FIELDS) out[k] = Object.hasOwn(ex, k) ? { present: true, value: ex[k] === undefined ? null : json(ex[k]) } : { present: false, value: null };
  return out;
}
function baseLoad(ex) {
  return { scalar: loadOf(ex.w), vector: (ex.w == null ? Array.from({ length: Math.max(1, ex.sets || 1) }, () => null) : planVector(ex)).map(loadOf), fields: fieldImage(ex) };
}
function evidenceOf(rows, R) {
  return rows.map((row) => ({ start: R(row.start), close: R(row.close), sets: row.entry.slots.map((slot) => {
    const f = slot.fact, cur = slot.state === 'performed' && f && f.current ? f.current : null;
    return { slot: slot.logical_set_slot, position: slot.position, origin: slot.origin === undefined ? null : slot.origin, state: slot.state,
      original: f ? R(f.source_op_id) : text(slot.skip_op_id) ? R(slot.skip_op_id) : null,
      edits: (f && Array.isArray(f.edit_op_ids) ? f.edit_op_ids : []).map(R),
      current: cur ? { load: json(cur.load), reps: json(cur.reps), reserve: cur.reserve === undefined ? null : json(cur.reserve) } : null };
  }) }));
}
function spendIdOf(ex, lift, consumes) {
  const authority = map(ex.native_load_authority) && text(ex.native_load_authority.spend_id) ? ex.native_load_authority.spend_id : null;
  const forks = E.resetForksOf({ exercises: [ex] }, lift);
  const technique = forks.length ? String(forks.slice().sort((a, b) => (a.from < b.from ? -1 : 1)).pop().from) : null;
  return JSON.stringify(['native-load', lift, authority, technique, consumes]);
}

// ---------- native explanation (spec B step 9): facts only, no training claim ----------
const setLoads = (vector) => {
  const values = vector.map((x) => (x && typeof x.value === 'number' ? x.value + ' lb' : 'no load'));
  return values.every((v) => v === values[0]) ? values[0] + ' on every set' : values.join(', ');
};
function earnReason(ex, cand, rows, target, base, terminal, hot) {
  const name = String(ex.n || ex.id);
  const days = rows.map((r) => r.date).join(', ');
  const how = /_2r$/.test(cand.id) ? 'a two-step increase, because your last set had ' + terminal + ' reps left'
    : /_1s$/.test(cand.id) ? (hot ? 'an early increase from one top of the window: your opening set was hard, your last set had ' + terminal + ' reps left'
      : 'an early increase from one top of the window, with ' + terminal + ' reps left on your last set')
    : 'a one-step increase after topping the rep window';
  return name + ': you topped the rep window at ' + setLoads(base) + ' (workouts on ' + days + '). Offer: ' + setLoads(target) +
    ', ' + how + '. Nothing changes unless you say yes; it then applies on a later ' + name + ' workout.';
}
// Spec R9.9 :152 MISSED CLOSE (wording PROPOSED, not approved copy): on a missed debut Close "the
// card said" names the missed entry's target (the captured debut card) and the sentence names the
// working weight, which the miss kept.
function adoptReason(ex, row, target, baseline, missed) {
  const name = String(ex.n || ex.id);
  const card = missed ? ' (the card said ' + setLoads(missed.map(loadOf)) + ', your first workout at the new weight you agreed; your working weight stayed ' + setLoads(planVector(ex).map(loadOf)) + ')'
    : ' (the card said ' + setLoads(planVector(ex).map(loadOf)) + ')';
  return name + ': on ' + row.date + ' you completed every set at ' + setLoads(target) + (baseline ? ', and no working weight was on file'
    : card) + '. Offer: make that your working weight. This sets your working weight; it is not an earned increase. Nothing changes unless you say yes.';
}
// Spec R9.9 :152 SELECTED ENTRY (DECISIONS:801 (1)): per original slot, the load the card generated
// from native entry q prescribes: newWSets at its accepted layout, else newW on every captured
// original slot whatever their number. Spec R9.10 L (1) FIT IN SELECTED ENTRY: a vector target's card at
// another layout is the fitted card (null only when fit fails on a malformed newWSets).
function entryTarget(q, count) {
  if (Array.isArray(q.newWSets)) return fit(q.newWSets, count);
  return Array.from({ length: count }, () => q.newW);
}
// Spec R9.10 L FIT (DECISIONS:803 (e)), the capture rule of W/engine-capture.cjs, copied at this module boundary
// (engine-capture.cjs exports none): every entry of the stored vector a finite number >= 0 and not -0, then fewer
// slots take the first n, extra slots repeat the last listed weight; anything else null.
function fit(v, n) {
  if (!Array.isArray(v) || v.length < 1 || !Array.from(v).every((x) => typeof x === 'number' && Number.isFinite(x) && x >= 0 && !Object.is(x, -0))) return null;
  return n <= v.length ? v.slice(0, n) : [...v, ...Array.from({ length: n - v.length }, () => v[v.length - 1])];
}

// ---------- evaluation (spec B "Evaluation algorithm", steps 1-10) ----------
function evaluate(state, request) {
  const req = validRequest(request), b = req.basis;
  if (!map(state) || !Array.isArray(state.exercises) || !Array.isArray(state.queue)) refuse('RECORD_INVALID', [], 'state');
  const facts = state.workoutFacts;
  if (!map(facts) || !map(facts.order)) refuse('COMPLETION_REQUIRED', [], 'workoutFacts');
  // Step 1: the exact claimed cut, before any reader can catch an error and answer from a cache.
  if (!same(b.order.start_ids, facts.order.start_ids) || b.order.frontier !== facts.order.frontier) refuse('SOURCE_FRONTIER_UNPROVEN', [], 'basis.order');
  const R = coverageOf(b);
  const lifts = state.exercises.filter((x) => x && x.id === req.lift_lineage_id);
  if (lifts.length !== 1) refuse('LIFT_UNRESOLVED', [], 'lift_lineage_id');
  const ex = lifts[0], lift = ex.id;
  // R9.2 :156 SUPPORTED wSets: ABSENT, present-null (the scalar repeats) or an array.
  if (Object.hasOwn(ex, 'wSets') && ex.wSets !== null && !Array.isArray(ex.wSets)) refuse('RECORD_INVALID', [], 'load_basis.wSets');
  const rows = liftRows(state, lift);
  const idx = rows.findIndex((r) => r.close === req.completion_op_id);
  if (idx < 0) refuse('COMPLETION_REQUIRED', [], 'completion_op_id');
  const cur = rows[idx], closeRef = R(cur.close);
  if (cur.entry.completion.kind !== 'normal') refuse('COMPLETION_REQUIRED', [closeRef], 'completion_op_id');
  const frontier = b.effect_frontier;
  // Compensation (spec :153) targets exactly the queued or adopted effect, so it is
  // dispatched BEFORE the pending-entry refusal; its own rules refuse descendants.
  if (req.intent !== 'check') return compensation(state, req, ex, rows, R);
  // Step 2: an unresolved NATIVE entry refuses before any reader runs (spec :126 refs rule).
  const pending = state.queue.filter((q) => q && q.exId === lift && !q.done && typeof q.native_load_spend === 'string');
  if (pending.length) {
    const spends = new Set(pending.map((q) => q.native_load_spend));
    const refs = frontier.filter((f) => map(f) && spends.has(f.spend_id)).flatMap((f) => refsOf(f.response_refs));
    refuse('TARGET_QUEUED', sorted(refs.map((r) => JSON.stringify(r))).map((r) => JSON.parse(r)).sort(byOp), null);
  }
  const auth = map(ex.native_load_authority) ? ex.native_load_authority : null;
  if (auth && auth.kind === 'landed' && auth.close_op_id === cur.close) refuse('DEBUT_LANDED', [closeRef]);
  if (idx !== rows.length - 1) refuse('COMPLETION_SUPERSEDED', [closeRef]);
  // Legacy structural entries and special branches keep their own rules (spec B, LEGACY_PENDING).
  if (state.queue.some((q) => q && q.exId === lift && !q.done && typeof q.native_load_spend !== 'string' && STRUCTURAL.includes(q.kind))) refuse('LEGACY_PENDING', [closeRef], 'queue');
  if ((ex.std && ex.own) || ex.reclaim || ex.ladder || ex.pendingThird) refuse('LEGACY_PENDING', [closeRef], 'exercise');
  // Same-day Starts under a technique fork dated that day: the date reader cannot order them.
  const forks = E.resetForksOf(state, lift), forkRefs = refsOf(b.technique.fork_refs);
  for (const f of forks) if (f && rows.slice(0, idx + 1).filter((r) => r.date === String(f.from)).length > 1) refuse('ERA_ORDER_BRIDGE_UNPROVEN', [closeRef, ...forkRefs]);
  // An older completion never replaces a newer athlete choice: load, set count or technique.
  const originals = originalSlots(cur.entry);
  const planNow = ex.w == null ? originals.map(() => null) : planVector(ex);
  const typed = cur.entry.profile === 'earned/performed-lift/v2';
  // Spec R9.9 :152/:127 MISSED CLOSE (DECISIONS:796 (c); l11 A1): this Close consumed a native
  // entry of this lift as a MISSED DEBUT (the fold's mark: done, state 'MISSED',
  // native_load_missed_by this Close) AND the request claims it (load_basis.authority_refs exactly
  // [this Close's Ref], which FC03 fills on the check path). Its capture is then compared with the
  // missed entry's target (newWSets, else newW on every captured original slot) instead of the
  // plan; set-count and technique changes still refuse. Mark without claim: compared with the plan.
  const missedQ = state.queue.find((q) => q && q.exId === lift && q.done === true && q.state === 'MISSED' && typeof q.native_load_spend === 'string' && q.native_load_missed_by === cur.close);
  const missedClose = !!missedQ && Array.isArray(b.load_basis.authority_refs) && b.load_basis.authority_refs.length === 1 && same(refsOf(b.load_basis.authority_refs), [closeRef]);
  const missedTarget = missedClose ? entryTarget(missedQ, originals.length) : null;
  const forkLater = forks.some((f) => f && String(f.from) > cur.date);
  // Spec R9.10 L (3) FIT GUARD (:146), step 2 split in order: (a) the count and fork clauses, (b) a stored vector
  // whose length is not the captured original slot count (a fitted layout) never earns or adopts, (c) the typed
  // capture comparison with the plan or, on a MISSED CLOSE, with the missed entry's target. (a) and (c) keep :233's refs.
  const planRefs = () => [closeRef, ...(missedClose ? [] : refsOf(b.load_basis.authority_refs)), ...(forkLater ? forkRefs : [])];
  if (originals.length !== Math.max(1, ex.sets || 1) || forkLater) refuse('PLAN_CHANGED', planRefs());
  if (Array.isArray(ex.wSets) && ex.wSets.length !== originals.length) refuse('SET_COUNT_BASIS_UNPROVEN', [closeRef], null);
  if (typed && !same(originals.map(captured), missedClose ? missedTarget : planNow)) refuse('PLAN_CHANGED', planRefs());
  if (originals.some((slot) => slot.state === 'unresolved')) refuse('PREFIX_UNRESOLVED', [closeRef]);
  E.performedNumericEntry(cur.entry); // configuration magnitude keeps its own reader refusal
  const line = E.performedLine(cur.entry);
  const complete = originals.every((slot) => slot.state === 'performed');
  const values = originals.map((slot) => (slot.state === 'performed' ? slot.fact.current.load.value : null));
  // Step 3: a first baseline or a different observed load is an ADOPTION choice, never an earn.
  if (ex.w == null || !(line.positions > 0 && E.performedLoadMatches(cur.entry, planNow))) {
    if (!complete || !values.every((v) => typeof v === 'number' && Number.isFinite(v) && v > 0)) refuse('PREFIX_UNRESOLVED', [closeRef]);
    if (!values.every((v) => v === values[0]) || Array.isArray(ex.wSets)) refuse('VECTOR_ADOPTION_UNDEFINED', [closeRef]);
    const kind = ex.w == null ? 'adopt-baseline' : 'adopt-observed';
    const spent = new Set(frontier.map((f) => (map(f) ? decodeSpend(f.spend_id) : null)).filter((x) => x && x.lift === lift).flatMap((x) => x.consumes));
    const root = rootOf(cur, lift);
    if (spent.has(root)) refuse('SOURCE_OVERLAP', [closeRef]);
    const consumes = [root], target = { scalar: lb(values[0]), vector: values.map(lb) };
    const body = { profile: DECISION, kind, lift_lineage_id: lift, basis: json(b), evidence: evidenceOf([cur], R), base_load: baseLoad(ex),
      target_load: target, candidate: null, reason_key: REASON_KEYS[kind], spend_id: spendIdOf(ex, lift, consumes), consumes, compensates: null };
    return [{ body, reason: adoptReason(ex, cur, target.vector, kind === 'adopt-baseline', missedClose ? missedTarget : null) }];
  }
  // Spec R9.9 :152 MISSED CLOSE: a debut session is never the checked completion of an earn (a
  // landing Close returns DEBUT_LANDED); its earn branch refuses PLAN_CHANGED [Close Ref], field null.
  if (missedClose) refuse('PLAN_CHANGED', [closeRef]);
  return earn(state, b, R, ex, lift, rows, idx, cur, closeRef, originals, line, planNow);
}

// Step 6, the ONE internal governor (spec R8 :92/:135): the moved canonical
// updateOpenerHold replayed on an isolated {id, n, holdFlag, rirHist} seeded from the
// lift as given, over the ordered native original openers. Unknown openers are null
// (no-op), never 0. Only the resulting boolean leaves; the scratch rirHist (which may
// hold the private effort token) is discarded. push is a no-op; n falls back to the id
// only so the discarded push text can be built.
function governor(ex, rows) {
  const gov = { id: ex.id, n: ex.n == null ? String(ex.id) : ex.n, holdFlag: !!ex.holdFlag, rirHist: Array.isArray(ex.rirHist) ? ex.rirHist.slice() : [] };
  for (const row of rows) {
    const first = originalSlots(row.entry)[0];
    E.updateOpenerHold(gov, { rir: first && first.state === 'performed' ? nativeEffort(first.fact.current.reserve) : null }, () => {});
  }
  return gov.holdFlag;
}

// Steps 4-8: two FULL views, the spend suffix on deriveSighting's OUTPUT, the moved
// governor, then the unchanged earnWalk ONCE on scratch. Every candidate is an offer.
function earn(state, b, R, ex, lift, rows, idx, cur, closeRef, originals, line, planNow) {
  const date = cur.date;
  const V_cur = structuredClone(state);                  // 4a: one call keeps the imported-log alias
  const V_pre = structuredClone(state);                  // 4b: the current cut minus the current and later Starts
  const r = V_pre.workoutFacts.order.start_ids.indexOf(cur.start);
  if (r < 0) refuse('SOURCE_FRONTIER_UNPROVEN', [closeRef], 'basis.order');
  const rank = new Map(V_pre.workoutFacts.order.start_ids.map((id, i) => [id, i]));
  V_pre.workoutFacts.sessions = V_pre.workoutFacts.sessions.filter((s) => rank.get(s.start_op_id) < r);
  V_pre.workoutFacts.order.start_ids = V_pre.workoutFacts.order.start_ids.slice(0, r);
  const exPre = V_pre.exercises.find((x) => x.id === lift);
  // FIX 3c (writers.cjs, completeSession): the era's first session banks nothing.
  if (E.eraFresh(V_pre, lift, date)) refuse('PROVISIONAL', [closeRef]);
  if (!E.atTopOfWindow(line.reps.slice(), exPre, V_pre, date)) refuse('WINDOW_NOT_TOP', [closeRef]);
  const opener = nativeEffort(originals[0].fact.current.reserve);
  if (opener === null) refuse('EFFORT_UNRESOLVED', [closeRef]);
  const rirSets = originals.map((slot) => (slot.state === 'performed' ? nativeEffort(slot.fact.current.reserve) : null));
  // 4d: sightings from the pre-current view with the caches defeated (progression.cjs:649).
  const exP = { ...exPre, topAt: null, topRun: 0 };
  const f = E._deriveSightingFull(V_pre, exP);
  const tenurePre = E._loadTenure(exP, V_pre, null, null).tenure;
  const topRows = f.tops.length ? tenurePre.slice(-f.tops.length).map((t) => t[3]) : [];
  if (!same(topRows.map((row) => String(row.d)), f.tops.map(String))) refuse('ORDER_RULE_UNREPRESENTABLE', [closeRef]);
  const prior = b.effect_frontier.map((fe) => {
    const d = map(fe) ? decodeSpend(fe.spend_id) : null;
    if (map(fe) && d === null) refuse('RECORD_INVALID', [], 'basis.effect_frontier');
    return d;
  }).filter((d) => d && d.lift === lift);
  const spent = new Set(prior.flatMap((d) => d.consumes));
  let run = f.topRun;
  if (prior.length) {
    const history = E.performedHistoryRows(V_pre).filter((row) => ((row.rec || {}).entries || []).some((e) => (row.source === 'performed' ? e && e.lift_lineage_id === lift : e && e.id === lift)));
    for (const d of f.tops) if (history.filter((row) => String(row.d) === String(d)).length > 1) refuse('ORDER_RULE_UNREPRESENTABLE', [closeRef]);
    let k = -1;
    topRows.forEach((row, i) => { if (spent.has(rootOf(row, lift))) k = i; });
    if (k >= 0) run = f.tops.length - (k + 1);
  }
  const runRows = run > 0 ? topRows.slice(topRows.length - run) : [];
  // 5-6: scratch lift seeded with the pre-current run and the replayed governor.
  const exS = V_cur.exercises.find((x) => x.id === lift);
  exS.topAt = run > 0 ? f.topAt : null; exS.topRun = run > 0 ? run : 0;
  exS.holdFlag = governor(ex, rows.slice(0, idx + 1));
  // The immediately prior comparable same-tenure line is the noise comparator.
  const tenureCur = E._loadTenure(exS, V_cur, null, null).tenure;
  const prevRow = tenureCur.length >= 2 ? tenureCur[tenureCur.length - 2] : null;
  const prevMeta = prevRow ? { w: ex.w, reps: prevRow[2].slice() } : null;
  const upNext = E.nextLoad(exS), hot = opener === 0 || exS.holdFlag;
  const en = { w: ex.w, reps: line.reps.slice(), rir: opener, rirSets };
  V_cur.queue = [];
  E.earnWalk(V_cur, exS, en, line.reps.slice(), prevMeta, () => {}, date);
  const cands = V_cur.queue.filter((q) => q.exId === lift && q.kind === 'debut');
  if (!cands.length) {
    if (upNext == null) refuse('NO_NEXT_LOAD', [closeRef]);
    if (hot) refuse('HELD_OR_HOT', [closeRef]);
    refuse('PROVISIONAL', [closeRef]);
  }
  // Consumes: every unspent root of the run, the current completion once, the comparator.
  const used = [...runRows.map((row) => rootOf(row, lift)), rootOf(cur, lift), ...(prevRow ? [rootOf(prevRow[3], lift)] : [])];
  const consumes = sorted(used.filter((x) => !spent.has(x)));
  if (!consumes.includes(rootOf(cur, lift))) refuse('SOURCE_OVERLAP', [closeRef]);
  const consumed = rows.filter((row) => consumes.includes(rootOf(row, lift)));
  const spend = spendIdOf(ex, lift, consumes), base = baseLoad(ex), evidence = evidenceOf(consumed, R);
  const terminalSlot = originals.filter((slot) => slot.state === 'performed').pop();
  const terminal = words(terminalSlot.fact.current.reserve);
  return cands.map((q) => {
    const vector = Array.isArray(q.newWSets) ? q.newWSets : originals.map(() => q.newW);
    if (!Number.isFinite(q.newW) || vector.length !== originals.length || !vector.every((x) => typeof x === 'number' && Number.isFinite(x) && x > 0)) refuse('VECTOR_ADOPTION_UNDEFINED', [closeRef]);
    const target = { scalar: lb(q.newW), vector: vector.map(lb) };
    const candidate = { kind: 'debut', newW: q.newW, newWSets: Array.isArray(q.newWSets) ? q.newWSets.slice() : null, state: q.state, t: String(q.t), gate: String(q.gate), rule: String(q.rule) };
    const body = { profile: DECISION, kind: 'earn', lift_lineage_id: lift, basis: json(b), evidence, base_load: base, target_load: target,
      candidate, reason_key: 'canonical-earn', spend_id: spend, consumes, compensates: null };
    return { body: json(body), reason: earnReason(ex, q, consumed, target.vector, base.vector, terminal, hot) };
  });
}

// Does the state carry ANY trace of an effect of this spend (applied, landed, retired or
// compensated)? None means it was never applied.
function heldTrace(state, ex, spendId) {
  const a = map(ex.native_load_authority) ? ex.native_load_authority : null;
  return state.queue.some((x) => x && x.native_load_spend === spendId) || !!(a && (a.spend_id === spendId || a.compensates === spendId));
}
// Compensation offer (spec B Apply, "At compensation"): only before any descendant
// training or landing; it consumes no training and refunds no evidence.
function compensation(state, req, ex, rows, R) {
  const spendId = req.intent.compensate, lift = ex.id;
  const fe = req.basis.effect_frontier.find((f) => map(f) && f.spend_id === spendId);
  const decoded = fe ? decodeSpend(spendId) : null;
  if (!decoded || decoded.lift !== lift) refuse('RECORD_INVALID', [], 'intent');
  const authRefs = refsOf(fe.response_refs);
  if (fe.close_ref) refuse('COMPENSATION_DESCENDANTS', authRefs);
  // The durable tombstone (spec R8 :121 "permanently cancels the targeted effect", :153):
  // the fold rebuilds every recorded compensation into the effect frontier from its own
  // response, so an already cancelled spend is seen here on every projection and under
  // every revision, whatever trace the state keeps. No second undo is offered (review B14).
  const undoSpend = JSON.stringify(['native-load-compensation', lift, spendId]);
  if (req.basis.effect_frontier.some((f) => map(f) && f.spend_id === undoSpend)) refuse('COMPENSATION_DESCENDANTS', authRefs);
  const lastConsumed = rows.reduce((at, row, i) => (decoded.consumes.includes(rootOf(row, lift)) ? i : at), -1);
  if (lastConsumed < 0 || lastConsumed !== rows.length - 1) refuse('COMPENSATION_DESCENDANTS', authRefs);
  const q = state.queue.find((x) => x && x.native_load_spend === spendId && !x.done);
  const auth = map(ex.native_load_authority) && ex.native_load_authority.spend_id === spendId && ex.native_load_authority.kind === 'adopted' ? ex.native_load_authority : null;
  // A frontier spend with NO trace in the state (no native queue entry, no authority that
  // names it) is an accepted effect the fold HELD unapplied under an unprovable order (spec
  // R8 :156); its compensation is retire-only: the current load stands (review B12).
  const held = !q && !auth && !heldTrace(state, ex, spendId);
  if (!q && !auth && !held) refuse('COMPENSATION_DESCENDANTS', authRefs);
  let target;
  if (q || held) target = { scalar: loadOf(ex.w), vector: (ex.w == null ? Array.from({ length: Math.max(1, ex.sets || 1) }, () => null) : planVector(ex)).map(loadOf) };
  else {
    const prior = auth.prior || {}, w = prior.w && prior.w.present ? prior.w.value : null;
    const wSets = prior.wSets && prior.wSets.present ? prior.wSets.value : null;
    // Spec R9.10 L RESTORE COUNT (D-R18-SETS-RESTORE, DECISIONS:804): the prior image is projected over n0, the
    // original slot count of the one completion the adoption consumed (its recorded base_load's count), never
    // the current set count, so the RESTORE equals the adoption's recorded base_load after a set-count edit.
    const n0 = originalSlots(rows[lastConsumed].entry).length;
    target = { scalar: loadOf(w), vector: (w == null ? Array.from({ length: n0 }, () => null) : planVector({ ...ex, w, wSets, sets: n0 })).map(loadOf) };
  }
  const body = { profile: DECISION, kind: 'compensate', lift_lineage_id: lift, basis: json(req.basis), evidence: [], base_load: baseLoad(ex),
    target_load: target, candidate: null, reason_key: 'compensation', spend_id: JSON.stringify(['native-load-compensation', lift, spendId]), consumes: [], compensates: spendId };
  const name = String(ex.n || ex.id);
  return [{ body, reason: name + ': undo the choice you agreed to before any workout used it. Your working weight goes back to ' + setLoads(target.vector) + '. The workouts it came from stay recorded and are not counted again.' }];
}

// ---------- the transition (spec B applyNativeLoadDecision) ----------
function validDecision(d) {
  if (!map(d) || !same(Object.keys(d).sort(), DECISION_KEYS) || d.profile !== DECISION || !KINDS.includes(d.kind) || REASON_KEYS[d.kind] !== d.reason_key ||
      !text(d.lift_lineage_id) || !text(d.spend_id) || !Array.isArray(d.consumes) || !d.consumes.every(text) || !same(d.consumes, sorted(d.consumes)) ||
      !map(d.target_load) || !Array.isArray(d.target_load.vector) || !map(d.base_load) || !map(d.base_load.fields) || !Array.isArray(d.evidence) ||
      (d.kind === 'compensate' ? !text(d.compensates) : d.compensates !== null) || (d.kind === 'earn' ? !map(d.candidate) : d.candidate !== null)) refuse('RECORD_INVALID', [], 'decision');
  if (d.kind !== 'compensate' && (!map(d.target_load.scalar) || d.target_load.scalar.unit !== 'lb' || !(d.target_load.scalar.value > 0) ||
      !d.target_load.vector.every((x) => map(x) && x.unit === 'lb' && Number.isFinite(x.value) && x.value > 0))) refuse('RECORD_INVALID', [], 'decision.target_load');
  return d;
}
const effectOf = (kind, d, responseRefs, closeRef = null) => ({ kind, spend_id: d.spend_id, response_refs: json(responseRefs), close_ref: closeRef ? json(closeRef) : null, base_load: json(d.base_load), target_load: json(d.target_load) });
// The 'governor' event (spec R8 :92): decision null, authority null, spent [], completion
// null, anything else RECORD_INVALID. For every lift with at least one native original
// opener at the given facts it replays step 6's governor and returns the state with ONLY
// that lift's holdFlag replaced (set only where the replay differs from the given flag,
// so every other byte, rirHist included, is equal); effect null; 'applied' if a flag
// changed, else 'unchanged'.
function governorEvent(state, decision, context) {
  if (decision !== null || context.authority !== null || !Array.isArray(context.spent) || context.spent.length || context.completion !== null ||
      !(context.basis === null || map(context.basis))) refuse('RECORD_INVALID', [], 'context');
  if (!map(state) || !Array.isArray(state.exercises)) refuse('RECORD_INVALID', [], 'state');
  const s = json(state);
  if (!map(s.workoutFacts)) return { status: 'unchanged', state: s, effect: null, refusal: null };
  const all = E.performedHistoryRows(s);
  let changed = false;
  for (const ex of s.exercises) {
    if (!map(ex) || !text(ex.id)) continue;
    const rows = liftRows(s, ex.id, all);
    if (!rows.some((row) => { const first = originalSlots(row.entry)[0]; return first && first.state === 'performed'; })) continue;
    const hold = governor(ex, rows);
    if (hold !== !!ex.holdFlag) { ex.holdFlag = hold; changed = true; }
  }
  return { status: changed ? 'applied' : 'unchanged', state: s, effect: null, refusal: null };
}
// DERIVABLE (spec R9 :156, every accept and record, before any re-evaluation): the
// decision's target must be one its OWN recorded basis could have produced through the
// unchanged engine readers; no rung rule is introduced. ex' = {w, inc, steps} of
// basis.load_basis, whose w and wSets must equal the recorded base_load. Earn: newW is
// E.nextLoad(ex') (r1) or, only with a rung ladder, a PROPOSED candidate and a terminal
// original reserve of at least 3 in the latest consumed completion, E.nextLoad(ex', r1)
// (earn.cjs:75); newWSets and target_load follow earn.cjs:63,80,88,97. Adoption: target is
// the latest consumed completion's actual original loads, all equal. Compensation: it
// names a spend of this lift in the fold (context.spent). Mismatch: RECORD_INVALID.
// R9.1 (B-R9-1) DECODE FIRST: the durable v1 record is read as written. A presence wrapper
// decodes to its value when present, else to ABSENT, which is never null; a Load decodes
// by value AND unit 'lb'; anything else is malformed (UNREADABLE).
const ABSENT = Symbol('absent'), UNREADABLE = Symbol('unreadable');
const dec = (x) => (map(x) && typeof x.present === 'boolean' ? (x.present ? x.value : ABSENT) : UNREADABLE);
const loadValue = (x) => (x === null ? null : map(x) && x.unit === 'lb' && typeof x.value === 'number' && Number.isFinite(x.value) ? x.value : UNREADABLE);
const wellFormedLoad = (x) => x === null || (map(x) && ((x.unit === 'lb' && typeof x.value === 'number' && Number.isFinite(x.value)) || (x.kind === 'configuration' && text(x.configuration_key))));
function derivable(d, spent, refs, ex) {
  const bad = (field) => refuse('RECORD_INVALID', refs, field);
  const T = d.target_load;
  // R9.2 :156 CORRESPONDENCE, kind-aware (B-R9-1), for every kind. (c1) the recorded image
  // agrees with itself as wrappers: load_basis.w = base_load.fields.w and load_basis.wSets =
  // base_load.fields.wSets, presence and value both (ABSENT and present-null stay distinct).
  const lb0 = map(d.basis) && map(d.basis.load_basis) ? d.basis.load_basis : {};
  const fields = map(d.base_load.fields) ? d.base_load.fields : {};
  const wrapped = (x) => map(x) && typeof x.present === 'boolean';
  if (!wrapped(lb0.w) || !wrapped(fields.w) || !same(lb0.w, fields.w) || !wrapped(lb0.wSets) || !wrapped(fields.wSets) || !same(lb0.wSets, fields.wSets)) bad('base_load');
  const w = dec(lb0.w), wSets = dec(lb0.wSets), inc = dec(lb0.inc), steps = dec(lb0.steps);
  // SUPPORTED wSets: ABSENT, present-null (the scalar repeats, as planVector does) or an array.
  if (!(wSets === ABSENT || wSets === null || Array.isArray(wSets))) bad('load_basis.wSets');
  if (inc === UNREADABLE || steps === UNREADABLE) bad('base_load');
  // (c2) base_load is exactly the issuance projection of that image (baseLoad above):
  // ABSENT projects as no w; scalar loadOf(w); vector all null of length max(1, sets) when
  // w is null or ABSENT, else planVector.
  const noW = w === ABSENT || w === null;
  if (!noW && typeof w !== 'number' && typeof w !== 'string') bad('base_load');
  const n = Math.max(1, (Number.isSafeInteger(lb0.sets) ? lb0.sets : 0) || 1);
  const wantScalar = noW ? null : loadOf(w);
  const wantVector = noW ? Array.from({ length: n }, () => null) : planVector({ w, sets: n, ...(Array.isArray(wSets) ? { wSets } : {}) }).map(loadOf);
  if (!same(d.base_load.scalar, wantScalar) || !same(d.base_load.vector, wantVector)) bad('base_load');
  if (d.kind === 'compensate') {
    // R9.1/R9.2 (B-R9-4): compensates names a live, un-landed fold spend of this lift (the
    // tombstone, :342; no descendant, :336). By the RECORD'S OWN SHAPE, never by replay
    // state: a RETIRE shows its own base (target = base_load, :352-353) and is display only,
    // well formed; a RESTORE (target unlike its own base) must name an ADOPTION and equal
    // that adoption's recorded base_load, which replay restores.
    const target = decodeSpend(d.compensates), x = spent.find((y) => map(y) && y.spend_id === d.compensates);
    if (!target || target.lift !== d.lift_lineage_id || !x || (x.cancelled_by && x.cancelled_by !== d.spend_id) || x.close_ref) bad('compensates');
    if (!map(T) || !Array.isArray(T.vector) || !wellFormedLoad(T.scalar === undefined ? UNREADABLE : T.scalar) || !T.vector.every(wellFormedLoad)) bad('target_load');
    const retireShaped = same(T.scalar, d.base_load.scalar) && same(T.vector, d.base_load.vector);
    if (!retireShaped) {
      const adopted = x.kind === 'adopt-baseline' || x.kind === 'adopt-observed';
      if (!adopted || !map(x.base_load) || !same(T.scalar, x.base_load.scalar) || !same(T.vector, x.base_load.vector)) bad('target_load');
    }
    return;
  }
  // (c3) by kind: earn and adopt-observed need a numeric w; adopt-baseline needs w null or
  // ABSENT (scalar null, vector all null by c2).
  if ((d.kind === 'earn' || d.kind === 'adopt-observed') && !(typeof w === 'number' && Number.isFinite(w))) bad('base_load');
  if (d.kind === 'adopt-baseline' && !noW) bad('base_load');
  const last = d.evidence.length ? d.evidence[d.evidence.length - 1] : null;
  const originals = last && Array.isArray(last.sets) ? last.sets.filter((x) => map(x) && x.origin !== 'added') : [];
  const tv = T.vector.map((x) => (map(x) ? x.value : null)), ts = map(T.scalar) ? T.scalar.value : null;
  if (d.kind === 'earn') {
    const ex1 = { w, ...(inc !== ABSENT ? { inc } : {}), ...(steps !== ABSENT ? { steps } : {}) };
    const r1 = E.nextLoad(ex1);
    if (r1 == null) bad('target_load');
    const c = d.candidate, terminal = originals.length ? originals[originals.length - 1] : null;
    const reserve = terminal && map(terminal.current) ? terminal.current.reserve : null;
    const deep = map(reserve) && reserve.tag === 'at_least' && reserve.value >= 3;
    const r2 = E.loadRungs(ex1) && c.state === 'PROPOSED' && deep ? E.nextLoad(ex1, r1) : null;
    if (!(c.newW === r1 || (r2 != null && c.newW === r2))) bad('target_load');
    // newWSets only when dec(wSets) is an array (earn.cjs tests Array.isArray).
    const newWSets = Array.isArray(wSets) ? wSets.map((y) => y + (c.newW - w)) : null;
    if (!same(c.newWSets === undefined ? null : c.newWSets, newWSets)) bad('candidate');
    const vector = newWSets || originals.map(() => c.newW);
    if (ts !== c.newW || !same(tv, vector) || !T.vector.every((y) => map(y) && y.unit === 'lb')) bad('target_load');
    return;
  }
  const actual = originals.map((y) => (map(y.current) && map(y.current.load) ? y.current.load.value : null));
  if (!actual.length || !actual.every((v) => typeof v === 'number' && Number.isFinite(v) && v > 0 && v === actual[0]) || ts !== actual[0] || !same(tv, actual)) bad('target_load');
  if (d.kind === 'adopt-observed' && w === ts) bad('target_load');
}
function transition(state, decision, context) {
  if (map(context) && context.event === 'governor') return governorEvent(state, decision, context);
  const d = validDecision(decision);
  if (!map(context) || !['accept', 'close'].includes(context.event)) refuse('RECORD_INVALID', [], 'context');
  const s = json(state), ex = (s.exercises || []).find((x) => x && x.id === d.lift_lineage_id);
  if (!ex) refuse('LIFT_UNRESOLVED', [], 'lift_lineage_id');
  const authority = map(context.authority) ? context.authority : {};
  const responseRefs = refsOf(authority.response_refs).sort(byOp);
  const spent = Array.isArray(context.spent) ? context.spent : [];
  if (context.event === 'close') return landing(s, ex, d, context, responseRefs);
  if (!responseRefs.length) refuse('CAPABILITY_REQUIRED', [], 'authority');
  derivable(d, spent, responseRefs, ex);
  if (spent.some((x) => map(x) && x.spend_id === d.spend_id)) return { status: 'unchanged', state: s, effect: null, refusal: null };
  const clash = spent.filter((x) => map(x) && Array.isArray(x.consumes) && x.consumes.some((c) => d.consumes.includes(c)));
  if (clash.length) refuse('EFFECT_CONFLICT', [...responseRefs, ...clash.flatMap((x) => refsOf(x.response_refs))].sort(byOp));
  const lift = ex.id;
  if (d.kind === 'compensate') return compensate(s, ex, d, responseRefs, spent);
  if (s.queue.some((q) => q && q.exId === lift && !q.done && typeof q.native_load_spend === 'string')) refuse('TARGET_QUEUED', responseRefs);
  if (s.queue.some((q) => q && q.exId === lift && !q.done && typeof q.native_load_spend !== 'string' && STRUCTURAL.includes(q.kind))) refuse('LEGACY_PENDING', responseRefs, 'queue');
  if (d.kind === 'earn') {
    const c = d.candidate, reason = map(authority.issuance) ? authority.issuance.reason : null;
    if (!text(reason) || c.newW !== d.target_load.scalar.value) refuse('RECORD_INVALID', [], 'authority.issuance');
    // Q exactly as D1: native-owned, DEBUT, no coApproved; w/wSets and active captures unchanged.
    s.queue.push({ id: d.spend_id, kind: 'debut', exId: lift, newW: c.newW, ...(Array.isArray(c.newWSets) ? { newWSets: c.newWSets.slice() } : {}),
      state: 'DEBUT', done: false, t: String(ex.n || lift).toUpperCase() + ' ' + c.newW + ' DEBUT', gate: reason,
      rule: 'Agreed by you. It runs when it wins the structural slot.', native_load_spend: d.spend_id });
    return { status: 'applied', state: s, effect: effectOf('queued', d, responseRefs), refusal: null };
  }
  // Adoption: the working load by name, stamped from the adopted completion's own date (N2).
  const adopted = d.evidence.length ? d.evidence[d.evidence.length - 1] : null;
  const session = adopted && s.workoutFacts && Array.isArray(s.workoutFacts.sessions) ? s.workoutFacts.sessions.find((x) => x.start_op_id === adopted.start.op_id) : null;
  if (!session) refuse('SOURCE_FRONTIER_UNPROVEN', [], 'decision.evidence');
  if (Array.isArray(ex.wSets)) refuse('VECTOR_ADOPTION_UNDEFINED', responseRefs);
  const prior = fieldImage(ex);
  ex.w = d.target_load.scalar.value;
  // Spec R9.11 M (3), SCALAR ADOPTION OVER A NULL VECTOR (:150): a scalar adoption removes a PRESENT null wSets (the
  // prior image above is taken first), so no native path leaves a numeric w over a null wSets (engine-capture.cjs:80-82).
  if (Object.hasOwn(ex, 'wSets') && ex.wSets === null) delete ex.wSets;
  ex.wAt = session.effective.local_date;
  ex.topAt = null; ex.topRun = 0;
  ex.native_load_authority = { kind: 'adopted', spend_id: d.spend_id, response_refs: responseRefs, prior };
  return { status: 'applied', state: s, effect: effectOf('adopted', d, responseRefs), refusal: null };
}
function compensate(s, ex, d, responseRefs, spent = []) {
  const q = s.queue.find((x) => x && x.native_load_spend === d.compensates && !x.done);
  // Spec R9.4 :156 (Astra L8 B28): classified AND applied by the RECORD'S OWN SHAPE, never by
  // replay-time state. A RETIRE (target = its own base_load) writes no new value; a RESTORE
  // (target unlike its own base) restores the adopted effect's prior image, which its
  // recorded base_load holds, even when the adoption itself is held on this replay.
  const restore = !(same(d.target_load.scalar, d.base_load.scalar) && same(d.target_load.vector, d.base_load.vector));
  if (q) {
    q.done = true; q.state = 'COMPENSATED'; q.native_load_compensated_by = d.spend_id;
  } else if (!heldTrace(s, ex, d.compensates)) {
    if (restore) {
      // The adoption is held unapplied on this replay (e.g. a later base with no ordering
      // op): its recorded base_load.fields ARE the prior image the athlete chose to restore.
      const x = spent.find((y) => map(y) && y.spend_id === d.compensates);
      const f = x && map(x.base_load) && map(x.base_load.fields) ? x.base_load.fields : null;
      if (!f || !map(f.w) || !map(f.wSets)) refuse('RECORD_INVALID', responseRefs, 'compensates');
      for (const k of ['w', 'wSets']) { if (f[k].present) ex[k] = json(f[k].value); else delete ex[k]; }
      ex.native_load_authority = { kind: 'compensated', spend_id: d.spend_id, compensates: d.compensates, response_refs: responseRefs };
    }
    // A RETIRE of a never-applied effect writes nothing (spec :156, :165); the fold keeps
    // its spend tombstone and clears its conflict.
  } else {
    const auth = map(ex.native_load_authority) ? ex.native_load_authority : null;
    if (!auth || auth.kind !== 'adopted' || auth.spend_id !== d.compensates || !map(auth.prior)) refuse('COMPENSATION_DESCENDANTS', responseRefs);
    for (const k of FIELDS) { const img = auth.prior[k]; if (img && img.present) ex[k] = json(img.value); else delete ex[k]; }
    ex.native_load_authority = { kind: 'compensated', spend_id: d.spend_id, compensates: d.compensates, response_refs: responseRefs };
  }
  return { status: 'applied', state: s, effect: effectOf('compensated', d, responseRefs), refusal: null };
}

// Qualified landing (spec B Apply, "For each later Close"): the SAME native entry, a
// normal Close whose Start captured the card generated from it, every original position
// completed at exactly its target. A rep miss at the target load still lands. Spec R9.9
// :152: any other completion of that card consumes the entry as a MISSED DEBUT.
function landing(s, ex, d, context, responseRefs) {
  if (d.kind !== 'earn') refuse('RECORD_INVALID', [], 'decision.kind');
  const c = map(context.completion) ? context.completion : null;
  const closeRef = c && map(c.close) && text(c.close.op_id) && text(c.close.commitment) ? { op_id: c.close.op_id, commitment: c.close.commitment } : null;
  if (!c || !closeRef || !map(c.start) || !text(c.start.op_id)) refuse('RECORD_INVALID', [], 'context.completion');
  const auth = map(ex.native_load_authority) ? ex.native_load_authority : null;
  if (auth && auth.kind === 'landed' && auth.spend_id === d.spend_id) return { status: 'unchanged', state: s, effect: null, refusal: null };
  const q = s.queue.find((x) => x && x.native_load_spend === d.spend_id && x.id === d.spend_id && !x.done && x.exId === ex.id);
  if (!q) refuse('DEBUT_BASIS_UNPROVEN', [closeRef], 'queue');
  let entry = null;
  try { entry = E.performedEntry(c.entry); } catch (_) { entry = null; }
  if (!entry || entry.lift_lineage_id !== ex.id || entry.start_op_id !== c.start.op_id || entry.completion.op_id !== closeRef.op_id || entry.completion.kind !== 'normal')
    refuse('DEBUT_BASIS_UNPROVEN', [closeRef], 'completion');
  const originals = originalSlots(entry);
  // The captured prescription is the immutable Start capture the fold hands in
  // (spec :122 context.completion.capture); a typed slot that also carries its own
  // prescribed_load must agree with it. Host v1 slots carry none.
  const capture = Array.isArray(c.capture) ? c.capture : null;
  // Spec R9.9 :152 SELECTED ENTRY and LAYOUT (DECISIONS:801 (1)): the Start's card was generated
  // from q: a scalar target's newW on every captured original slot (whatever their number), a
  // vector target equal to newWSets; a typed slot's own prescribed_load must agree. Otherwise
  // this Close neither lands nor consumes (wrong capture).
  const tgt = entryTarget(q, originals.length);
  const selected = !!capture && capture.length > 0 && capture.length === originals.length && !!tgt &&
    originals.every((slot, i) => capture[i] === tgt[i] && (slot.prescribed_load === undefined || captured(slot) === tgt[i]));
  if (!selected) refuse('DEBUT_BASIS_UNPROVEN', [closeRef], 'completion');
  // It lands iff every original slot is performed at its target load (a rep miss still lands). Spec R9.10 L (2)
  // LANDING LAYOUT (DECISIONS:801 (1)): a vector target lands only at its accepted layout; its fitted card at
  // another layout is consumed MISSED whatever was lifted.
  const exact = (!Array.isArray(q.newWSets) || originals.length === q.newWSets.length) && originals.every((slot, i) => slot.state === 'performed' && map(slot.fact.current.load) &&
    slot.fact.current.load.unit === 'lb' && slot.fact.current.load.value === tgt[i]);
  // Spec R9.9 :152 MISSED DEBUT (H11 option 1, DECISIONS:796 (c)): whatever was lifted (another
  // load, a skipped or unresolved slot, an edit off the target, every slot skipped) the debut is
  // done: the entry is consumed MISSED by this Close and NOTHING else is written.
  if (!exact) {
    q.done = true; q.state = 'MISSED'; q.native_load_missed_by = closeRef.op_id;
    return { status: 'applied', state: s, effect: effectOf('missed', d, responseRefs, closeRef), refusal: null };
  }
  const session = s.workoutFacts && Array.isArray(s.workoutFacts.sessions) ? s.workoutFacts.sessions.find((x) => x.start_op_id === c.start.op_id) : null;
  if (!session) refuse('SOURCE_FRONTIER_UNPROVEN', [closeRef], 'completion');
  q.done = true; q.state = 'ESTABLISH';
  ex.w = q.newW;
  if (Array.isArray(q.newWSets)) ex.wSets = q.newWSets.slice();
  ex.wAt = session.effective.local_date;
  ex.last = E.performedLine(entry).reps.slice(); ex.own = false; ex.std = null;
  ex.native_load_authority = { kind: 'landed', spend_id: d.spend_id, close_op_id: closeRef.op_id, response_refs: responseRefs };
  return { status: 'applied', state: s, effect: effectOf('landed', d, responseRefs, closeRef), refusal: null };
}

function evaluateNativeLoad(state, request) {
  let basis = null;
  try { basis = map(request) && request.basis !== undefined ? json(request.basis) : null; } catch (_) { basis = null; }
  try {
    const offers = evaluate(state, request);
    return { profile: PROFILE, status: 'offer', basis, offers: json(offers), refusal: null };
  } catch (error) {
    return { profile: PROFILE, status: 'refused', basis, offers: [], refusal: refusalOf(error) };
  }
}
function applyNativeLoadDecision(state, decision, context) {
  try { return json(transition(state, decision, context)); } catch (error) {
    let kept = null;
    try { kept = json(state); } catch (_) { kept = null; }
    return { status: 'refused', state: kept, effect: null, refusal: refusalOf(error) };
  }
}
void CONSENT;
return { evaluateNativeLoad, applyNativeLoadDecision };
};
