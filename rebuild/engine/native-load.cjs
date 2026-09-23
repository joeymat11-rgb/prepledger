'use strict';
// NATIVE-LOAD FC01 (rebuild/coach/NATIVE-LOAD-SPEC.md R7, 6ddf7af, sha256 98c0cf7a...).
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
// The authorised per-position load vector, exactly as progression.cjs:82-84 projects it.
const planVector = (ex) => Array.from({ length: Math.max(1, ex.sets || 1) }, (_, i) => (Array.isArray(ex.wSets) && ex.wSets[i] != null ? ex.wSets[i] : ex.w));
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
function adoptReason(ex, row, target, baseline) {
  const name = String(ex.n || ex.id);
  return name + ': on ' + row.date + ' you completed every set at ' + setLoads(target) + (baseline ? ', and no working weight was on file'
    : ' (the card said ' + setLoads(planVector(ex).map(loadOf)) + ')') + '. Offer: make that your working weight. This sets your working weight; it is not an earned increase. Nothing changes unless you say yes.';
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
  if (originals.length !== Math.max(1, ex.sets || 1) || (typed && !same(originals.map(captured), planNow)) || forks.some((f) => f && String(f.from) > cur.date))
    refuse('PLAN_CHANGED', [closeRef, ...refsOf(b.load_basis.authority_refs), ...(forks.some((f) => f && String(f.from) > cur.date) ? forkRefs : [])]);
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
    return [{ body, reason: adoptReason(ex, cur, target.vector, kind === 'adopt-baseline') }];
  }
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

// Compensation offer (spec B Apply, "At compensation"): only before any descendant
// training or landing; it consumes no training and refunds no evidence.
function compensation(state, req, ex, rows, R) {
  const spendId = req.intent.compensate, lift = ex.id;
  const fe = req.basis.effect_frontier.find((f) => map(f) && f.spend_id === spendId);
  const decoded = fe ? decodeSpend(spendId) : null;
  if (!decoded || decoded.lift !== lift) refuse('RECORD_INVALID', [], 'intent');
  const authRefs = refsOf(fe.response_refs);
  if (fe.close_ref) refuse('COMPENSATION_DESCENDANTS', authRefs);
  const lastConsumed = rows.reduce((at, row, i) => (decoded.consumes.includes(rootOf(row, lift)) ? i : at), -1);
  if (lastConsumed < 0 || lastConsumed !== rows.length - 1) refuse('COMPENSATION_DESCENDANTS', authRefs);
  const q = state.queue.find((x) => x && x.native_load_spend === spendId && !x.done);
  const auth = map(ex.native_load_authority) && ex.native_load_authority.spend_id === spendId && ex.native_load_authority.kind === 'adopted' ? ex.native_load_authority : null;
  if (!q && !auth) refuse('COMPENSATION_DESCENDANTS', authRefs);
  let target;
  if (q) target = { scalar: loadOf(ex.w), vector: (ex.w == null ? [] : planVector(ex)).map(loadOf) };
  else {
    const prior = auth.prior || {}, w = prior.w && prior.w.present ? prior.w.value : null;
    const wSets = prior.wSets && prior.wSets.present ? prior.wSets.value : null;
    target = { scalar: loadOf(w), vector: (w == null ? Array.from({ length: Math.max(1, ex.sets || 1) }, () => null) : planVector({ ...ex, w, wSets })).map(loadOf) };
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
  if (spent.some((x) => map(x) && x.spend_id === d.spend_id)) return { status: 'unchanged', state: s, effect: null, refusal: null };
  const clash = spent.filter((x) => map(x) && Array.isArray(x.consumes) && x.consumes.some((c) => d.consumes.includes(c)));
  if (clash.length) refuse('EFFECT_CONFLICT', [...responseRefs, ...clash.flatMap((x) => refsOf(x.response_refs))].sort(byOp));
  const lift = ex.id;
  if (d.kind === 'compensate') return compensate(s, ex, d, responseRefs);
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
  ex.wAt = session.effective.local_date;
  ex.topAt = null; ex.topRun = 0;
  ex.native_load_authority = { kind: 'adopted', spend_id: d.spend_id, response_refs: responseRefs, prior };
  return { status: 'applied', state: s, effect: effectOf('adopted', d, responseRefs), refusal: null };
}
function compensate(s, ex, d, responseRefs) {
  const q = s.queue.find((x) => x && x.native_load_spend === d.compensates && !x.done);
  if (q) {
    q.done = true; q.state = 'COMPENSATED'; q.native_load_compensated_by = d.spend_id;
  } else {
    const auth = map(ex.native_load_authority) ? ex.native_load_authority : null;
    if (!auth || auth.kind !== 'adopted' || auth.spend_id !== d.compensates || !map(auth.prior)) refuse('COMPENSATION_DESCENDANTS', responseRefs);
    for (const k of FIELDS) { const img = auth.prior[k]; if (img && img.present) ex[k] = json(img.value); else delete ex[k]; }
    ex.native_load_authority = { kind: 'compensated', spend_id: d.spend_id, compensates: d.compensates, response_refs: responseRefs };
  }
  return { status: 'applied', state: s, effect: effectOf('compensated', d, responseRefs), refusal: null };
}

// Qualified landing (spec B Apply, "For each later Close"): the SAME native entry, a
// normal Close whose Start captured the accepted target, every original position
// completed at exactly that vector. A rep miss at the target load still lands.
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
  const want = d.target_load.vector.map((x) => x.value);
  if (!entry || entry.lift_lineage_id !== ex.id || entry.start_op_id !== c.start.op_id || entry.completion.op_id !== closeRef.op_id || entry.completion.kind !== 'normal')
    refuse('DEBUT_BASIS_UNPROVEN', [closeRef], 'completion');
  const originals = originalSlots(entry);
  // The captured prescription is the immutable Start capture the fold hands in
  // (spec :122 context.completion.capture); a typed slot that also carries its own
  // prescribed_load must agree with it. Host v1 slots carry none.
  const capture = Array.isArray(c.capture) ? c.capture : null;
  const exact = !!capture && capture.length === want.length && originals.length === want.length && originals.every((slot, i) => slot.state === 'performed' &&
    capture[i] === want[i] && (slot.prescribed_load === undefined || captured(slot) === want[i]) &&
    slot.fact.current.load.unit === 'lb' && slot.fact.current.load.value === want[i]);
  if (!exact) refuse('DEBUT_BASIS_UNPROVEN', [closeRef], 'completion');
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
