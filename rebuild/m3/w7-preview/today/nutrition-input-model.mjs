import Wire from '../../../m4/nutrition/inputs-wire.cjs';

export const NUTRITION_FIELDS = ['calories', 'protein', 'carbohydrate', 'fat'];
const copy = structuredClone;
const emptyField = () => ({ kind: '', amount: '', lower: '', upper: '', lower_inclusive: '', upper_inclusive: '', reason: '' });
export function newNutritionDraft() {
  return { goal: { kind: '', statement: '', phase: '', reason: '' }, existing_plan: { kind: '', source: '', agreed_date: '', reason: '', fields: Object.fromEntries(NUTRITION_FIELDS.map(k => [k, emptyField()])) }, change: 'update' };
}
function fromInputs(inputs) {
  const draft = newNutritionDraft();
  for (const key of ['goal', 'existing_plan']) Object.assign(draft[key], copy(inputs[key]));
  if (inputs.existing_plan.kind === 'recorded') draft.existing_plan.fields = Object.fromEntries(NUTRITION_FIELDS.map(key => {
    const f = inputs.existing_plan.fields[key];
    return [key, { ...emptyField(), ...copy(f), amount: f.amount ? String(f.amount.value) : '', lower: f.lower ? String(f.lower.value) : '', upper: f.upper ? String(f.upper.value) : '',
      lower_inclusive: f.lower_inclusive === undefined ? '' : String(f.lower_inclusive), upper_inclusive: f.upper_inclusive === undefined ? '' : String(f.upper_inclusive) }];
  }));
  return draft;
}
function invalid(path, message) { const e = new Error(message); e.field = path; throw e; }
const text = (value, path, label) => { if (!value?.trim()) invalid(path, label); return value; };
function number(value, path) { if (typeof value !== 'string' || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim()) || !Number.isFinite(Number(value))) invalid(path, 'Enter a number of zero or more. Blank is not zero.'); return Number(value); }
function toInputs(draft) {
  const g = draft.goal, p = draft.existing_plan;
  let goal, existing_plan;
  if (g.kind === 'declared') goal = { kind: g.kind, statement: text(g.statement, 'goal.statement', 'Write your goal in your own words.'), phase: text(g.phase, 'goal.phase', 'Name your current phase in your own words.') };
  else if (g.kind === 'unknown') goal = { kind: g.kind };
  else if (g.kind === 'cleared') goal = { kind: g.kind, reason: text(g.reason, 'goal.reason', 'Say why you are clearing this goal.') };
  else invalid('goal.kind', 'Choose a goal answer, including “I’m not sure yet” if needed.');
  if (['none', 'unknown'].includes(p.kind)) existing_plan = { kind: p.kind };
  else if (p.kind === 'cleared') existing_plan = { kind: p.kind, reason: text(p.reason, 'existing_plan.reason', 'Say why you are clearing this recorded plan.') };
  else if (p.kind === 'recorded') {
    const source = text(p.source, 'existing_plan.source', 'Enter where your plan came from.'), date = p.agreed_date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date) invalid('existing_plan.agreed_date', 'Enter the date you agreed this plan.');
    const fields = Object.fromEntries(NUTRITION_FIELDS.map(key => {
      const f = p.fields[key], path = `existing_plan.fields.${key}`, unit = key === 'calories' ? 'kcal/day' : 'g/day';
      const q = name => ({ value: number(f[name], `${path}.${name}`), unit });
      let value;
      if (['target', 'minimum'].includes(f.kind)) value = { kind: f.kind, amount: q('amount') };
      else if (f.kind === 'range') {
        if (!['true', 'false'].includes(f.lower_inclusive)) invalid(`${path}.lower_inclusive`, 'Choose whether the lower limit is included.');
        if (!['true', 'false'].includes(f.upper_inclusive)) invalid(`${path}.upper_inclusive`, 'Choose whether the upper limit is included.');
        value = { kind: 'range', lower: q('lower'), upper: q('upper'), lower_inclusive: f.lower_inclusive === 'true', upper_inclusive: f.upper_inclusive === 'true' };
        if (value.lower.value > value.upper.value || value.lower.value === value.upper.value && (!value.lower_inclusive || !value.upper_inclusive)) invalid(`${path}.upper`, 'The range must contain at least one amount.');
      } else if (f.kind === 'not_prescribed') value = { kind: f.kind };
      else if (f.kind === 'unavailable') value = { kind: f.kind, reason: f.reason.trim() || 'I don’t know this amount.' };
      else invalid(`${path}.kind`, `Choose what your plan says for ${key}, including “I don’t know.”`);
      return [key, value];
    }));
    existing_plan = { kind: 'recorded', source, agreed_date: date, fields };
  } else invalid('existing_plan.kind', 'Choose whether you have an existing plan.');
  return Wire.inputs({ goal, existing_plan });
}
export function describeNutritionInputs(inputs) {
  const g = inputs.goal, p = inputs.existing_plan;
  const rows = [['Goal', g.kind === 'declared' ? g.statement : g.kind === 'unknown' ? 'Not sure yet' : `Cleared: ${g.reason}`]];
  if (g.kind === 'declared') rows.push(['Phase', g.phase]);
  rows.push(['Existing plan', p.kind === 'recorded' ? `From ${p.source}; agreed ${p.agreed_date}` : p.kind === 'none' ? 'I have no existing plan' : p.kind === 'unknown' ? 'I’m not sure' : `Cleared: ${p.reason}`]);
  if (p.kind === 'recorded') for (const k of NUTRITION_FIELDS) {
    const f = p.fields[k], unit = k === 'calories' ? 'kcal/day' : 'g/day';
    rows.push([k[0].toUpperCase() + k.slice(1), f.kind === 'target' ? `Target: ${f.amount.value} ${unit}` : f.kind === 'minimum' ? `At least ${f.amount.value} ${unit}` : f.kind === 'range' ? `${f.lower_inclusive ? 'At least' : 'More than'} ${f.lower.value} and ${f.upper_inclusive ? 'at most' : 'less than'} ${f.upper.value} ${unit}` : f.kind === 'not_prescribed' ? 'Not prescribed in my plan' : `Unknown: ${f.reason}`]);
  }
  return rows;
}
const remedy = result => result?.committed ? 'The record reached this phone, but the connection closed before confirmation. Reopen Your nutrition to check it; your draft is still here.'
  : result?.code === 'NUTRITION_INPUT_STALE' ? 'Another entry was saved. Your answers are still here. Refresh and review them again.'
  : result?.code === 'LOCAL_CALENDAR_DAY_CHANGED' ? 'The local date changed. Your answers are still here. Review them for today before saving.'
  : result?.code === 'LOCAL_LEASE_EXPIRED' ? 'Saving is paused on this phone. Reopen the app to check your saved records; your draft is still here.'
  : /CLOSED|INTEGRITY|SCOPE|RESTORE|IDENTITY/.test(result?.code || '') ? 'This record cannot be confirmed. Reopen the app to check storage; your draft is still here.'
  : 'This entry was not saved. Your answers are still here. Check available device storage and try saving again.';

// Pass the SAME installation and calendar owned by Today. The calendar owns the
// operation sample; its action uses the existing client method to avoid nesting
// Today's forwarding calendar.run inside itself. No page-created durable basis.
export function createNutritionInputModel({ installation, calendar }) {
  if (!installation?.client?.commitNutritionInputs || !calendar?.run) throw new TypeError('Actual installation and calendar required');
  const listeners = new Set(); let basis = null, prepared = null, busy = false, closed = false;
  let state = { phase: 'loading', draft: newNutritionDraft(), message: '', errorField: null, review: null, saved: null, canRetry: false, conflicting: false };
  const snapshot = () => copy({ ...state, busy });
  const publish = () => { for (const fn of listeners) fn(snapshot()); };
  async function task(fn) {
    if (busy || closed) return snapshot(); busy = true; publish();
    try { await fn(); } catch (e) { state.message = e.field ? e.message : remedy({ code: e.code }); state.errorField = e.field || null; }
    finally { busy = false; if (!closed) publish(); }
    return snapshot();
  }
  async function read(replace) {
    const r = await installation.readNutritionInputs();
    if (!r.read || r.view.local.requirements.length) { state.message = 'Your saved answers could not be read. Reopen the app to check storage; no answers have been replaced.'; return false; }
    const current = r.view.local.current;
    if (!replace && basis && current?.sourceOpId !== basis.current?.sourceOpId) { state.conflicting = true; state.message = 'Your saved nutrition answers changed elsewhere. Load those answers before making another change. Your draft is still shown.'; return false; }
    basis = { revision: r.revision, current }; state.saved = current; state.conflicting = false;
    if (replace) { state.draft = current ? fromInputs(current.inputs) : newNutritionDraft(); prepared = null; state.review = null; state.phase = 'edit'; }
    return true;
  }
  const api = {
    snapshot, subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    load: () => task(async () => { state.message = ''; await read(true); }),
    update(path, value) {
      if (busy || closed || state.phase !== 'edit') return;
      const keys = path.split('.'); let obj = state.draft;
      for (const k of keys.slice(0, -1)) { if (!Object.hasOwn(obj, k)) return; obj = obj[k]; }
      const key = keys.at(-1); if (!Object.hasOwn(obj, key) || typeof obj[key] !== 'string' || typeof value !== 'string') return;
      obj[key] = value; prepared = null; state.message = ''; state.errorField = null;
    },
    edit() { if (busy || closed) return; state.phase = 'edit'; state.canRetry = false; prepared = null; state.review = null; state.message = ''; publish(); },
    review: () => task(async () => {
      state.message = ''; state.errorField = null; state.canRetry = false;
      const inputs = toInputs(state.draft);
      if (!basis || !await read(false)) return;
      const day = calendar.sample().day;
      const r = await calendar.run(day, async at => {
        const proposal = { effective: { local_date: at.day, local_time: at.time, utc_offset: at.offset }, change: basis.current ? state.draft.change : 'assert', supersedes: basis.current?.sourceOpId ?? null, inputs };
        return installation.prepareNutritionInputs({ expectedRevision: basis.revision, proposal });
      });
      if (!r.prepared) { state.message = remedy(r); return; }
      prepared = r; state.review = r.view; state.phase = 'review';
    }),
    confirm: () => task(async () => {
      if (!prepared || !['review', 'error'].includes(state.phase)) return;
      const at = calendar.sample(), eff = prepared.view.effective;
      if (at.day !== eff.local_date || at.offset !== eff.utc_offset) { state.phase = 'edit'; prepared = null; state.review = null; state.message = 'The local date or time zone changed. Your answers are still here. Review them for today before saving.'; return; }
      const r = await calendar.run(eff.local_date, context => context.offset !== eff.utc_offset ? { acknowledged: false, code: 'LOCAL_CALENDAR_DAY_CHANGED' } : installation.client.commitNutritionInputs({ preparedId: prepared.preparedId }));
      if (r.acknowledged === true) {
        // Display the exact acknowledged operation, even if a later read would
        // fail or another writer changes current. The next review reads afresh.
        state.saved = { sourceOpId: r.op_id, effective: copy(prepared.view.effective), inputs: copy(prepared.view.inputs), status: 'pending-local' };
        basis = { revision: r.durableRevision, current: state.saved }; state.draft = fromInputs(state.saved.inputs);
        state.phase = 'saved'; state.message = 'Saved on this phone · not yet synced'; state.canRetry = false;
      }
      else { state.phase = 'error'; state.message = remedy(r); state.canRetry = !r.committed && r.state !== 18 && r.state !== 20 && !/STALE|CLOSED|DAY_CHANGED/.test(r.code || ''); }
    }),
    close() { closed = true; listeners.clear(); },
  };
  return Object.freeze(api);
}
