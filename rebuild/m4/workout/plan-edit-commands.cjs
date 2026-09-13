'use strict';
// Local athlete-authored intent through the existing injected producer seam.
// Vocabulary is proposed in BRIEF-PLAN-EDIT-COMPANION-v1.0.md, not authority consent.
const PROFILE = 'earned/plan-edit/v1', ACTION = 'plan-edit', FIELD = 'training.exercise-edit';
const fail = (code = 'PLAN_EDIT_INPUT_INVALID') => { const e = new TypeError(code); e.code = code; throw e; };
const own = (o, k) => Object.hasOwn(o, k);
function plain(value, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value || typeof value !== 'object' || seen.has(value)) fail();
  const array = Array.isArray(value), proto = Object.getPrototypeOf(value);
  if (array ? proto !== Array.prototype : proto !== Object.prototype && proto !== null) fail();
  const ds = Object.getOwnPropertyDescriptors(value), keys = Reflect.ownKeys(ds);
  if (keys.some(k => typeof k !== 'string' || !own(ds[k], 'value') || (!ds[k].enumerable && !(array && k === 'length')))) fail();
  seen.add(value);
  let out;
  if (array) {
    if (keys.length !== value.length + 1 || keys.some(k => k !== 'length' && !/^(0|[1-9]\d*)$/.test(k))) fail();
    out = [];
    for (let i = 0; i < value.length; i++) { if (!own(ds, String(i))) fail(); out.push(plain(ds[i].value, seen)); }
  } else {
    out = {};
    for (const k of keys) Object.defineProperty(out, k, { value: plain(ds[k].value, seen), enumerable: true, writable: true, configurable: true });
  }
  seen.delete(value); return out;
}
function exact(value, required, optional = []) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || required.some(k => !own(value, k)) ||
      Object.keys(value).some(k => !required.includes(k) && !optional.includes(k))) fail();
  return value;
}
const text = value => { if (typeof value !== 'string' || !value.trim()) fail(); return value; };
const positive = v => typeof v === 'number' && Number.isFinite(v) && v > 0;
function dateOf(day) {
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) fail('PLAN_EDIT_DATE_INVALID');
  const [y, m, d] = day.split('-').map(Number), at = new Date(0);
  at.setUTCHours(0, 0, 0, 0); at.setUTCFullYear(y, m - 1, d);
  if (at.toISOString().slice(0, 10) !== day) fail('PLAN_EDIT_DATE_INVALID');
  return at;
}
function nextLocalDate(day) {
  const at = dateOf(day); at.setUTCDate(at.getUTCDate() + 1);
  const result = at.toISOString().slice(0, 10); dateOf(result); return result;
}
const EXERCISE = ['id', 'n', 'mg', 'day', 'sets', 'hi', 'inc', 'steps'];
const CHANGES = ['n', 'day', 'sets', 'hi', 'inc', 'steps'];
function fieldOf(k, v) {
  if (['id', 'n', 'mg'].includes(k)) text(v);
  else if (k === 'day') { if (v !== 'U' && v !== 'L') fail(); }
  else if (['sets', 'hi'].includes(k)) { if (!Number.isSafeInteger(v) || v < 1) fail(); }
  else if (k === 'inc') { if (!positive(v)) fail(); }
  else if (k === 'steps') {
    if (!Array.isArray(v) || !v.length || v.some((x, i) => !positive(x) || i > 0 && x <= v[i - 1])) fail();
  } else fail();
}
function exerciseOf(value) { exact(value, EXERCISE); for (const k of EXERCISE) fieldOf(k, value[k]); return value; }
function tagsOf(exercise, tags, validateTags) {
  exact(tags, ['head', 'secondary']);
  if (tags.head !== null) text(tags.head);
  if (!Array.isArray(tags.secondary)) fail();
  for (const s of tags.secondary) {
    exact(s, ['mg', 'lend'], ['head']); text(s.mg);
    if (!positive(s.lend) || s.lend > 1) fail();
    if (own(s, 'head')) text(s.head);
  }
  if (typeof validateTags !== 'function' || validateTags(plain(exercise), plain(tags)) !== true) fail('PLAN_EDIT_TAGS_INVALID');
  return tags;
}
function editOf(value, validateTags) {
  if (!value || typeof value !== 'object') fail();
  if (value.kind === 'update') {
    exact(value, ['kind', 'exercise_id', 'changes']); text(value.exercise_id); exact(value.changes, [], CHANGES);
    if (!Object.keys(value.changes).length) fail();
    for (const [k, v] of Object.entries(value.changes)) fieldOf(k, v);
  } else if (value.kind === 'remove') { exact(value, ['kind', 'exercise_id']); text(value.exercise_id); }
  else if (value.kind === 'add' || value.kind === 'replace') {
    exact(value, ['kind', 'exercise', 'tags', ...(value.kind === 'replace' ? ['exercise_id'] : [])]);
    exerciseOf(value.exercise); tagsOf(value.exercise, value.tags, validateTags);
    if (value.kind === 'replace') { text(value.exercise_id); if (value.exercise_id === value.exercise.id) fail(); }
  } else fail();
  return value;
}
function validateInput(value, { validateTags } = {}) {
  const input = plain(value);
  exact(input, ['intent_id', 'seen_plan_basis', 'starts_on', 'edit', 'causal_parents']);
  text(input.intent_id); text(input.seen_plan_basis); dateOf(input.starts_on); editOf(input.edit, validateTags);
  if (!Array.isArray(input.causal_parents) || !input.causal_parents.length ||
      new Set(input.causal_parents).size !== input.causal_parents.length) fail();
  input.causal_parents.forEach(text); return input;
}
function createPlanEditCommands({ validateTags } = {}) {
  function prepare(value) {
    const request = plain(value); exact(request, ['action', 'input']); if (request.action !== ACTION) fail();
    const input = validateInput(request.input, { validateTags });
    return { kind: 'plan-mutation', class: 'plan', payload: null, parents: input.causal_parents,
      plan: { domain: 'training', seen_plan_basis: input.seen_plan_basis, members: [{ field: FIELD,
        unit: 'record', provenance: 'athlete_edited', value: { profile: PROFILE, intent_id: input.intent_id,
          starts_on: input.starts_on, edit: input.edit } }] } };
  }
  function validate(value, readOperation) {
    try {
      const op = plain(value);
      exact(op, ['op_id','athlete_id','device_id','device_seq','device_predecessor_op_id','causal_parents',
        'class','kind','effective','schema_version','lease_id','payload','canonical_content_commitment',
        'conflict_domain_id','conflict_domain_lineage_id','requested_transaction_id','members','seen_plan_basis','member_set_commitment']);
      for (const k of ['op_id','athlete_id','device_id','lease_id','conflict_domain_lineage_id','requested_transaction_id']) text(op[k]);
      if (op.device_predecessor_op_id !== null) text(op.device_predecessor_op_id);
      if (!Number.isSafeInteger(op.device_seq) || op.device_seq < 1 || op.schema_version !== 2 ||
          op.kind !== 'plan-mutation' || op.class !== 'plan' || op.conflict_domain_id !== 'training' || op.payload !== null ||
          !/^[a-f0-9]{64}$/.test(op.canonical_content_commitment) || !/^[a-f0-9]{64}$/.test(op.member_set_commitment)) return false;
      exact(op.effective, ['local_date','local_time','utc_offset']); dateOf(op.effective.local_date);
      // Client.index localTime() records ISO.slice(11,16): HH:MM, no seconds.
      if (typeof op.effective.local_time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(op.effective.local_time) ||
          typeof op.effective.utc_offset !== 'string' || !/^[+-](0\d|1[0-4]):[0-5]\d$/.test(op.effective.utc_offset)) return false;
      if (!Array.isArray(op.members) || op.members.length !== 1) return false;
      const member = exact(op.members[0], ['field','value','unit','provenance']);
      if (member.field !== FIELD || member.unit !== 'record' || member.provenance !== 'athlete_edited') return false;
      const intent = exact(member.value, ['profile','intent_id','starts_on','edit']); if (intent.profile !== PROFILE) return false;
      const input = validateInput({ intent_id: intent.intent_id, starts_on: intent.starts_on, edit: intent.edit,
        seen_plan_basis: op.seen_plan_basis, causal_parents: op.causal_parents }, { validateTags });
      if (input.starts_on !== nextLocalDate(op.effective.local_date) || input.causal_parents.includes(op.op_id)) return false;
      if (readOperation !== undefined) {
        if (typeof readOperation !== 'function') return false;
        for (const id of input.causal_parents) { const parent = plain(readOperation(id)); if (parent?.op_id !== id || parent.athlete_id !== op.athlete_id) return false; }
      }
      return true;
    } catch { return false; }
  }
  return Object.freeze({ schemaVersion: 2, prepare, validate });
}
module.exports = { PROFILE, ACTION, FIELD, createPlanEditCommands, validateInput, nextLocalDate,
  plain, exact, text, dateOf, editOf, exerciseOf, tagsOf, EXERCISE, fail };
