'use strict';
// Dated programme projection only. The caller authenticates the generation;
// this layer proves structural correspondence and refuses unqualified history.
const { encode: canonical } = require('../../client/canonical.cjs');
const C = require('./plan-edit-commands.cjs');
const own = (o, k) => Object.hasOwn(o, k);
const fail = (code = 'PLAN_EDIT_HISTORY_UNPROVEN') => C.fail(code);
const equal = (a, b) => canonical(a) === canonical(b);
const clone = v => C.plain(v);
function freeze(v) { if (v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
const put = (o, k, value) => Object.defineProperty(o, k, { value, enumerable: true, configurable: true, writable: true });
const documentRow = e => Object.fromEntries(C.EXERCISE.map(k => [k, e[k]]));
function createPlanEditProjector({ basisState, setupOperation, validateTags, projectNewExerciseTags, hashBasis } = {}) {
  if (typeof hashBasis !== 'function') fail('PLAN_EDIT_BASIS_HASH_UNAVAILABLE');
  const hash = value => {
    const digest = hashBasis(canonical(value));
    if (typeof digest !== 'string' || !/^[a-f0-9]{64}$/.test(digest)) fail('PLAN_EDIT_BASIS_HASH_INVALID');
    return 'earned/plan-edit-basis/v1:' + digest;
  };
  const base = clone(basisState), origin = clone(setupOperation), commands = C.createPlanEditCommands({ validateTags });
  if (!base || !Array.isArray(base.exercises) || !origin || origin.kind !== 'fact' || origin.class !== 'event' ||
      origin.payload?.profile !== 'earned/first-run-setup/v1' || !origin.payload.setup ||
      !/^[a-f0-9]{64}$/.test(origin.canonical_content_commitment)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
  C.text(origin.op_id); C.text(origin.athlete_id); C.text(origin.device_id); C.dateOf(origin.effective?.local_date);
  const setup = origin.payload.setup;
  C.exact(setup, ['athlete_label','split','exercises','priority_muscles']);
  if (!Array.isArray(setup.exercises) || !setup.exercises.length || setup.exercises.length !== base.exercises.length ||
      base.athlete_label !== setup.athlete_label || !equal(base.split, [setup.split]) ||
      !equal(base.priority_muscles || [], setup.priority_muscles)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
  const baseIds = new Set();
  for (let i = 0; i < setup.exercises.length; i++) {
    const row = C.exerciseOf(setup.exercises[i]), e = base.exercises[i];
    if (!e || baseIds.has(row.id) || !equal(documentRow(e), row) || e.renames?.length || (base.retirements || {})[row.id]) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    baseIds.add(row.id);
    if (origin.payload.tags !== undefined) {
      const tags = origin.payload.tags[row.id]; C.tagsOf(row, tags, validateTags);
      if (own(e, 'head') || own(e, 'secondary') || own(e, 'volumeTags')) {
        if (!equal({ head: e.head ?? null, secondary: e.secondary }, tags) ||
            e.volumeTags?.profile !== 'earned/setup-volume-tags/v1' || e.volumeTags.op_id !== origin.op_id ||
            e.volumeTags.date !== origin.effective.local_date) fail('PLAN_EDIT_TAG_BASIS_UNPROVEN');
      } else fail('PLAN_EDIT_TAG_BASIS_UNPROVEN');
    } else if (own(e, 'volumeTags')) fail('PLAN_EDIT_TAG_BASIS_UNPROVEN');
  }
  if (origin.payload.tags !== undefined && (Object.keys(origin.payload.tags).length !== baseIds.size ||
      Object.keys(origin.payload.tags).some(id => !baseIds.has(id)))) fail('PLAN_EDIT_TAG_BASIS_UNPROVEN');
  const coreOrigin = { op_id: origin.op_id, commitment: origin.canonical_content_commitment, setup: origin.payload,
    athlete_id: origin.athlete_id, device_id: origin.device_id };
  function inspect(raw) {
    const generation = clone(raw), collections = generation?.collections;
    if (!collections || typeof collections !== 'object' || Array.isArray(collections)) fail();
    if (Object.keys(collections.sourceImports || {}).length || (collections.sync?.frontier?.W ?? 0) !== 0 ||
        collections.sync?.snapshot?.recoveryPlan || Object.keys(collections.sync?.snapshot?.plan || {}).length) fail('PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE');
    if (Object.keys(collections.plan || {}).length || Object.keys(collections.planTransactions || {}).length)
      fail('PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT');
    const ops = collections.ops || {}, rejected = collections.rejected ?? {};
    // This companion admits only the local installation context. Its existing
    // host refuses inbound authority dispositions; ciphertext cannot supply one.
    // Keep the records intact and refuse rather than treating an index as proof.
    if (!rejected || typeof rejected !== 'object' || Array.isArray(rejected) || Object.keys(rejected).length)
      fail('PLAN_EDIT_REJECTION_UNPROVEN');
    if (!equal(ops[origin.op_id], origin) || rejected[origin.op_id]) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    const rows = Object.entries(ops).map(([id, op]) => {
      if (!op || op.op_id !== id || op.athlete_id !== origin.athlete_id || op.device_id !== origin.device_id ||
          !Number.isSafeInteger(op.device_seq) || op.device_seq < 1 || !Array.isArray(op.causal_parents) ||
          new Set(op.causal_parents).size !== op.causal_parents.length || !/^[a-f0-9]{64}$/.test(op.canonical_content_commitment)) fail();
      return op;
    }).sort((a, b) => a.device_seq - b.device_seq);
    if (new Set(rows.map(op => op.device_seq)).size !== rows.length) fail();
    for (const op of rows) {
      for (const id of op.causal_parents) if (!ops[id] || ops[id].device_seq >= op.device_seq) fail();
      if (op.device_predecessor_op_id !== null && (!ops[op.device_predecessor_op_id] || ops[op.device_predecessor_op_id].device_seq >= op.device_seq)) fail();
    }
    if (rows.filter(op => op.payload?.profile === origin.payload.profile).length !== 1) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    const edits = rows.filter(op => op.kind === 'plan-mutation');
    if (edits.some(op => op.conflict_domain_id !== 'training')) fail('PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT');
    for (const op of edits) if (!commands.validate(op, id => ops[id])) fail();
    const relevant = new Set([origin.op_id, ...edits.map(op => op.op_id)]);
    const tombstones = rows.filter(op => op.kind === 'tombstone' && relevant.has(op.target_op_id));
    for (const op of tombstones) {
      if (op.target_op_id === origin.op_id || !op.causal_parents.includes(op.target_op_id) ||
          op.device_seq <= ops[op.target_op_id].device_seq || rejected[op.op_id] ||
          rows.some(o => o.kind === 'tombstone' && o.target_op_id === op.op_id)) fail('PLAN_EDIT_TOMBSTONE_UNPROVEN');
    }
    const dead = new Set(tombstones.map(op => op.target_op_id));
    const statuses = new Map(edits.map(op => [op.op_id, rejected[op.op_id] ? 'rejected' : dead.has(op.op_id) ? 'tombstoned' : 'active']));
    const intents = new Set(), added = new Set(baseIds);
    for (const op of edits) {
      if (rejected[op.op_id] && (typeof rejected[op.op_id] !== 'object' || rejected[op.op_id].op_id !== op.op_id)) fail('PLAN_EDIT_REJECTION_UNPROVEN');
      const value = op.members[0].value;
      if (intents.has(value.intent_id)) fail('PLAN_EDIT_DUPLICATE_INTENT'); intents.add(value.intent_id);
      if (value.edit.exercise) { if (added.has(value.edit.exercise.id)) fail('PLAN_EDIT_ID_REUSED'); added.add(value.edit.exercise.id); }
      if (statuses.get(op.op_id) === 'active' && op.causal_parents.some(id => statuses.has(id) && statuses.get(id) !== 'active')) fail('PLAN_EDIT_BASIS_INVALIDATED');
    }
    const basisAt = before => hash({ origin: coreOrigin,
      edits: edits.filter(op => op.device_seq < before).map(op => ({ op_id: op.op_id, commitment: op.canonical_content_commitment,
        status: statuses.get(op.op_id), rejected: rejected[op.op_id] || null })),
      tombstones: tombstones.filter(op => op.device_seq < before).map(op => ({ op_id: op.op_id, commitment: op.canonical_content_commitment, target: op.target_op_id })) });
    const active = edits.filter(op => statuses.get(op.op_id) === 'active');
    for (let i = 0; i < active.length; i++) {
      const op = active[i], parents = [origin.op_id, ...active.slice(0, i).map(o => o.op_id)];
      if (!equal([...op.causal_parents].sort(), [...parents].sort()) || op.seen_plan_basis !== basisAt(op.device_seq)) fail('PLAN_EDIT_BASIS_INVALIDATED');
      if (i && active[i - 1].members[0].value.starts_on > op.members[0].value.starts_on) fail('PLAN_EDIT_DATE_ORDER_UNPROVEN');
    }
    return { generation, edits, active, statuses, basis: basisAt(Infinity), parents: [origin.op_id, ...active.map(op => op.op_id)], added };
  }
  function orderOf(state) {
    const order = state.exOrder || (state.exOrder = {});
    for (const e of state.exercises) if (!own(order, e.day)) put(order, e.day, []);
    return order;
  }
  function apply(state, edit, starts_on, op) {
    const target = edit.exercise_id === undefined ? null : state.exercises.find(e => e.id === edit.exercise_id);
    if (edit.exercise_id !== undefined && (!target || (state.retirements || {})[target.id])) fail('PLAN_EDIT_TARGET_UNAVAILABLE');
    const order = orderOf(state), oldDay = target?.day;
    const covered = day => {
      let split = null; for (const row of state.split || []) if (row.from <= starts_on) split = row;
      const family = day === 'U' || day === 'L', days = Object.values(split?.map || {});
      if (!split || !family || !(days.includes(day) || days.includes('F'))) fail('PLAN_EDIT_DAY_UNCOVERED');
    };
    if (edit.kind === 'update') {
      if (Object.entries(edit.changes).every(([k, value]) => equal(target[k], value))) fail('PLAN_EDIT_NO_CHANGE');
      if (own(edit.changes, 'day')) covered(edit.changes.day);
      if (own(edit.changes, 'n') && target.n !== edit.changes.n) {
        (target.renames || (target.renames = [])).push({ from: starts_on, prevN: target.n });
      }
      for (const [k, value] of Object.entries(edit.changes)) put(target, k, clone(value));
      if (target.day !== oldDay) {
        put(order, oldDay, (order[oldDay] || []).filter(id => id !== target.id));
        if (!own(order, target.day)) put(order, target.day, []); order[target.day].push(target.id);
      }
    } else if (edit.kind === 'remove') {
      const remaining = state.exercises.filter(e => e.id !== target.id && !(state.retirements || {})[e.id]);
      if (!remaining.length) fail('PLAN_EDIT_WEEK_EMPTY');
      const retirements = state.retirements || (state.retirements = {}); put(retirements, target.id, op?.op_id || 'preview');
      put(order, oldDay, (order[oldDay] || []).filter(id => id !== target.id));
    } else {
      const row = clone(edit.exercise); covered(row.day);
      if (state.exercises.some(e => e.id === row.id)) fail('PLAN_EDIT_ID_REUSED');
      let next = { ...row, w: null, forks: [] };
      if (op) {
        if (typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');
        next = clone(projectNewExerciseTags(clone(row), clone(edit.tags), { op_id: op.op_id, date: starts_on }));
        const allowed = [...C.EXERCISE, 'w','forks','head','secondary','volumeTags']; C.exact(next, allowed);
        if (!equal(documentRow(next), row) || next.w !== null || !equal(next.forks, []) ||
            !equal({ head: next.head, secondary: next.secondary }, edit.tags) ||
            next.volumeTags?.profile !== 'earned/setup-volume-tags/v1' || next.volumeTags.op_id !== op.op_id ||
            next.volumeTags.date !== starts_on) fail('PLAN_EDIT_NEW_TAG_PROJECTION_INVALID');
        C.exact(next.volumeTags, ['profile','op_id','date','regionsByMuscle']);
      } else { next.head = edit.tags.head; next.secondary = clone(edit.tags.secondary); }
      state.exercises.push(next);
      if (!own(order, row.day)) put(order, row.day, []);
      if (target) {
        const index = (order[oldDay] || []).indexOf(target.id);
        put(state.retirements || (state.retirements = {}), target.id, op?.op_id || 'preview');
        put(order, oldDay, (order[oldDay] || []).filter(id => id !== target.id));
        if (oldDay === row.day && index >= 0) order[row.day].splice(index, 0, row.id); else order[row.day].push(row.id);
      } else order[row.day].push(row.id);
    }
    return state;
  }
  function result(info, date) {
    C.dateOf(date); let state = clone(base); const applied = [], pending = new Set();
    // Validate the entire pending composition too: invalid later edits cannot
    // supply a trusted seen basis just because the current date precedes them.
    const complete = clone(base);
    for (const op of info.active) {
      const value = op.members[0].value; apply(complete, value.edit, value.starts_on, op);
      if (value.starts_on <= date) { state = clone(complete); applied.push(op.op_id); }
      else pending.add(value.starts_on);
    }
    return freeze({ state, plan_basis: info.basis, causal_parents: info.parents.slice(),
      pending_dates: [...pending].sort(), applied_ids: applied,
      intents: info.edits.map(op => ({ op_id: op.op_id, ...clone(op.members[0].value), status: info.statuses.get(op.op_id) })) });
  }
  function read(generation, date) { return result(inspect(generation), date); }
  function preview(generation, starts_on, value) {
    const input = C.validateInput(value, { validateTags }), info = inspect(generation);
    if (input.starts_on !== starts_on || input.seen_plan_basis !== info.basis ||
        !equal([...input.causal_parents].sort(), [...info.parents].sort())) fail('PLAN_EDIT_STALE_BASIS');
    if (info.edits.some(op => op.members[0].value.intent_id === input.intent_id)) fail('PLAN_EDIT_DUPLICATE_INTENT');
    if (input.edit.exercise && info.added.has(input.edit.exercise.id)) fail('PLAN_EDIT_ID_REUSED');
    if (input.edit.exercise && typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');
    const current = result(info, starts_on), state = clone(current.state);
    apply(state, input.edit, starts_on, null);
    return freeze({ ...current, state });
  }
  return Object.freeze({ read, preview });
}
module.exports = { createPlanEditProjector };
