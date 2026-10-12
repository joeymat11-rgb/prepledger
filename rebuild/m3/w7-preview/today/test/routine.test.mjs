/* S15 "CHANGE MY ROUTINE" - the page's composition, the editor's model and the
   real Today page, over a real encrypted local era in jsdom.
   PUBLIC SYNTHETIC ONLY: a setup document driven through the shipped setup
   reducer with invented names and numbers; no private fixture, no ledger.
   Run with TZ=America/New_York:
     node --test rebuild/m3/w7-preview/today/test/routine.test.mjs */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { webcrypto } from 'node:crypto';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import design from '../design.cjs';
import * as Entry from '../today-entry.mjs';
import { openTodayOverLocalEra } from '../../../w6/local/today-bindings.mjs';
import { createSetupModel } from '../setup-model.mjs';
import Setup from '../setup-commands.mjs';
import { searchByName } from '../exercise-catalogue.mjs';
import M, { COPY } from '../routine-model.mjs';
import { createRoutineEntry } from '../routine-host.mjs';

const require = createRequire(import.meta.url);
const { IDBFactory } = createRequire(new URL('../../../w6/test/support.mjs', import.meta.url))('fake-indexeddb');
const { createEngineRuntime } = require('../../../../m4/workout/engine-runtime.cjs');

// 2026-09-16 is a Wednesday; 2026-09-17 a Thursday; 2026-09-18 a Friday.
const DAY1 = '2026-09-16', DAY2 = '2026-09-17', DAY3 = '2026-09-18';
const AT = day => () => new Date(day + 'T16:00:00.000Z');
const copy = value => JSON.parse(JSON.stringify(value));
const LIFTS = [{ day: 'U', n: 'Synthetic press', mg: 'chest', first: '40' },
  { day: 'U', n: 'Synthetic pulldown', mg: 'back', first: '60' },
  { day: 'U', n: 'Synthetic raise', mg: 'delts', first: '10' },
  { day: 'L', n: 'Synthetic leg press', mg: 'quads', first: '100' }];

function shipped(today) {
  const model = createSetupModel({ today });
  model.setName('synthetic-routine');
  for (const [d, k] of [['1', 'U'], ['2', 'L'], ['5', 'U'], ['6', 'L']]) { model.toggleDay(d); model.setDayKind(d, k); }
  for (const lift of LIFTS) {
    const row = model.addExercise(lift.day);
    model.setExerciseField(row.key, 'n', lift.n); model.chooseMg(row.key, lift.mg);
    model.setExerciseField(row.key, 'first', lift.first);
  }
  const built = model.document();
  assert.equal(built.ok, true, JSON.stringify(built.missing));
  /* Fable l1 B1: one KEPT lift carries a catalogue head in the setup tag snapshot (the side delt), so a basis
     whose kept lifts gained the tag-projected members (head, secondary, volumeTags) would bucket its volume
     differently from the state Today stands on. */
  built.tags['synthetic-raise'] = { head: 'delts_side', secondary: [] };
  return built;
}
/* Fable l1 B1, PM ruling (b): every member of every KEPT lift is exactly the basis Today stands on, except
   the fields an edit changed (and the rename record an edit of the name adds). */
function assertKeptExactly(adopted, basis, edited = {}) {
  for (const was of basis.exercises) {
    const now = adopted.exercises.find(e => e.id === was.id);
    assert.ok(now, was.id + ' is still on the record');
    const fields = edited[was.id] || [];
    const strip = e => Object.fromEntries(Object.entries(e).filter(([k]) => !fields.includes(k) && !(fields.includes('n') && k === 'renames')));
    assert.deepEqual(strip(now), strip(was), was.id + ': a kept lift carries members the basis does not');
  }
  const rest = s => Object.fromEntries(Object.entries(s).filter(([k]) => !['exercises', 'exOrder', 'split', 'retirements'].includes(k)));
  assert.deepEqual(rest(adopted), rest(basis), 'only the routine members of the state may differ');
}
function shellWindow() {
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'https://example.test/' });
  Object.defineProperty(dom.window, 'crypto', { configurable: true, value: webcrypto });
  return dom.window;
}
const slot = (doc, name) => doc.querySelector('[data-slot="' + name + '"]');
const slots = (doc, name) => [...doc.querySelectorAll('[data-slot="' + name + '"]')];
const tap = node => { assert.ok(node, 'nothing to tap'); node.dispatchEvent(new node.ownerDocument.defaultView.Event('click', { bubbles: true })); };
function type(node, value) {
  node.value = value; const view = node.ownerDocument.defaultView;
  node.dispatchEvent(new view.Event('input', { bubbles: true })); node.dispatchEvent(new view.Event('change', { bubbles: true }));
}
async function until(check, what, ms = 8000) {
  const end = Date.now() + ms;
  for (;;) { const v = check(); if (v) return v; if (Date.now() > end) throw new Error('timed out waiting for ' + what); await new Promise(r => setTimeout(r, 15)); }
}
const scope = tag => ({ databaseName: 's15-routine-' + tag, namespace: 'synthetic/s15-routine-' + tag,
  athleteId: 'ath-s15', deviceId: 'dev-s15' });
const eraOn = (indexedDB, tag, day) => openTodayOverLocalEra({ indexedDB, crypto: webcrypto, ...scope(tag), live: AT(day) });
async function enrolled(tag) {
  const indexedDB = new IDBFactory(), era = await eraOn(indexedDB, tag, DAY1), doc = shipped(DAY1);
  const host = await era.createSetupHost({ day: DAY1, commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  const saved = await host.save({ setup: doc.setup, tags: doc.tags }); host.close();
  assert.equal(saved.ok, true, saved.code);
  return { indexedDB, era, document: doc };
}
async function bootOn(indexedDB, tag, day) {
  const era = await eraOn(indexedDB, tag, day), win = shellWindow();
  Object.defineProperty(win, 'indexedDB', { configurable: true, value: indexedDB });
  const booted = await Entry.boot({ document: win.document, hosts: era, now: AT(day), setupFirst: false });
  await booted.api.ready;
  return { era, win, doc: win.document, booted, close: () => { booted.rollover && booted.rollover.stop(); booted.teardown(); era.close(); } };
}
const ops = async era => (await era.generation()).generation.collections;
const membership = (state, day) => createEngineRuntime({ clock: { today: () => day } }).sessionMembership(copy(state), day);

test('RT-01 owner rule: a new exercise, typed or picked, starts at 3 sets with no load', () => {
  const taken = ['synthetic-press', 'cable-fly'];
  const typed = M.newExerciseEdit({ n: ' Cable fly ', mg: 'chest', day: 'U', first: '15', inc: '' }, taken);
  assert.equal(typed.ok, true);
  assert.deepEqual(typed.edit, { kind: 'add', exercise: { id: 'cable-fly-2', n: 'Cable fly', mg: 'chest', day: 'U',
    sets: 3, hi: 10, inc: 5, steps: [15] }, tags: { head: null, secondary: [] } });
  assert.equal('w' in typed.edit.exercise, false, 'no load field at all');
  const entry = searchByName('lat pulldown')[0];
  const picked = M.newExerciseEdit({ n: entry.n, mg: entry.mg, day: 'U', first: '50', inc: '2.5', entry }, [], { replaces: 'old-row' });
  assert.equal(picked.edit.kind, 'replace'); assert.equal(picked.edit.exercise_id, 'old-row');
  assert.equal(picked.edit.exercise.sets, 3); assert.equal(picked.edit.exercise.inc, 2.5);
  assert.deepEqual(picked.edit.tags, { head: entry.head, secondary: copy(entry.secondary) }, 'the catalogue tags ride along');
  const moved = M.newExerciseEdit({ n: entry.n, mg: 'biceps', day: 'U', first: '50', entry }, []);
  assert.deepEqual(moved.edit.tags, { head: null, secondary: [] }, 'a changed muscle drops the entry tags');
  const bad = M.newExerciseEdit({ n: ' ', mg: '', day: 'U', first: 'x', inc: '0' }, []);
  assert.equal(bad.ok, false);
  assert.deepEqual(bad.errors.map(e => e.field), ['n', 'mg', 'first', 'inc']);
});

test('RT-02 changing a kept exercise sends only what changed', () => {
  const row = { id: 'press', n: 'Press', mg: 'chest', day: 'U', sets: 2, hi: 8 };
  assert.deepEqual(M.updateEdit(row, { n: 'Press', sets: 4, hi: 8, day: 'U' }).edit,
    { kind: 'update', exercise_id: 'press', changes: { sets: 4 } });
  assert.deepEqual(M.updateEdit(row, { n: ' Incline press ', sets: 2, hi: 12, day: 'L' }).edit.changes,
    { n: 'Incline press', hi: 12, day: 'L' });
  assert.deepEqual(M.updateEdit(row, { ...row }), { ok: false, field: null, copy: COPY.nothingChanged });
  assert.equal(M.updateEdit(row, { ...row, n: '  ' }).field, 'n');
  assert.deepEqual(M.moved(['a', 'b', 'c'], 0, 1), ['b', 'a', 'c']);
  assert.deepEqual(M.moved(['a', 'b'], 0, -1), ['a', 'b']);
  assert.equal(M.dateWords('2026-10-12'), 'Monday, October 12');
  assert.equal(M.refusalWords('PLAN_EDIT_WORKOUT_EMPTY'), 'Each workout with days needs at least one exercise.');
});

test('RT-03 new words: plain, no dashes, no exclamation marks, and the Today link says the same two words', () => {
  for (const [key, line] of Object.entries(COPY)) {
    assert.equal(/[\u2013\u2014!]/.test(line), false, key);
    assert.equal(/ - /.test(line), false, key);
  }
  const app = fs.readFileSync(new URL('../today-app.cjs', import.meta.url), 'utf8');
  assert.match(app, new RegExp('const ROUTINE_LINK = "' + COPY.entry + '";'));
});

test('RT-04 the routine lane: one save is one dated op, history is never touched, a refusal writes nothing, '
  + 'and Today adopts the change only from the next day', async () => {
  const { indexedDB, era, document } = await enrolled('lane');
  const { createCleanInitState } = await import('../setup-model.mjs');
  const basis = createCleanInitState({ setup: document.setup });
  try {
    const routine = createRoutineEntry({ installation: era, day: DAY1, live: AT(DAY1) });
    assert.ok(routine);
    const session = await routine.session();
    assert.equal(session.ok, true, session.code);
    const view = await session.view();
    assert.equal(view.ok, true, view.code); assert.equal(view.today, DAY1); assert.equal(view.starts_on, DAY2);
    const rows = M.rowsOf(view.state);
    assert.deepEqual(rows.U.map(r => r.n), ['Synthetic press', 'Synthetic pulldown', 'Synthetic raise']);
    const before = await ops(era), beforeOps = copy(before.ops);
    // A refusal: a week with no Lower day while a Lower exercise remains.
    const refused = await session.save(M.splitEdit({ 0: 'REST', 1: 'U', 2: 'U', 3: 'REST', 4: 'REST', 5: 'U', 6: 'REST' }), view.starts_on);
    assert.equal(refused.ok, false); assert.equal(refused.code, 'PLAN_EDIT_DAY_UNCOVERED');
    assert.deepEqual(copy((await ops(era)).ops), beforeOps, 'a refusal writes nothing');
    // A shown date that is not the date the review would use refuses too.
    const wrongDay = await session.save(M.reorderEdit('U', [...rows.U.map(r => r.id)].reverse()), DAY3);
    assert.equal(wrongDay.code, 'PLAN_EDIT_DAY_TURNED');
    assert.deepEqual(copy((await ops(era)).ops), beforeOps);
    const order = [rows.U[2].id, rows.U[0].id, rows.U[1].id];
    const saved = await session.save(M.reorderEdit('U', order), view.starts_on);
    assert.equal(saved.ok, true, saved.code); assert.equal(saved.starts_on, DAY2);
    const after = await ops(era);
    assert.equal(Object.keys(after.ops).length, Object.keys(before.ops).length + 1);
    assert.equal(Object.keys(after.outbox).length, Object.keys(before.outbox).length + 1);
    for (const [id, op] of Object.entries(beforeOps)) assert.deepEqual(copy(after.ops[id]), op, 'op ' + id + ' untouched');
    assert.equal(after.ops[saved.op_id].kind, 'plan-mutation');
    assert.equal(after.ops[saved.op_id].effective.local_date, DAY1);
    // A catalogue pick that has a head (Fable l1 B1): the NEW lift keeps its own tag snapshot.
    const entry = searchByName('back extension')[0];
    assert.equal(entry.head, 'lower_back');
    const added = await session.save(M.newExerciseEdit({ n: 'Synthetic curl', mg: entry.mg, day: 'L', first: '20', entry },
      (await session.view()).taken).edit, view.starts_on);
    assert.equal(added.ok, true, added.code);
    const pulldown = rows.U[1].id;
    const setsSaved = await session.save(M.updateEdit(rows.U[1], { ...rows.U[1], sets: 4 }).edit, view.starts_on);
    assert.equal(setsSaved.ok, true, setsSaved.code);
    session.close();
    // TODAY keeps its basis: the changes start tomorrow.
    assert.deepEqual(await routine.adopt(copy(basis)), basis, 'today adopts the unchanged basis');
    // A basis that is not this installation's is never replaced.
    const foreign = { ...copy(basis), athlete_label: 'someone else' };
    assert.deepEqual(await createRoutineEntry({ installation: era, day: DAY2, live: AT(DAY2) }).adopt(foreign), foreign);
    era.close();
    // THE NEXT DAY: the same store, the same lane, and the change is in force.
    const next = await eraOn(indexedDB, 'lane', DAY2);
    try {
      const adopted = await createRoutineEntry({ installation: next, day: DAY2, live: AT(DAY2) }).adopt(copy(basis));
      assert.deepEqual(adopted.exOrder.U, order);
      const curl = adopted.exercises.find(e => e.n === 'Synthetic curl');
      assert.equal(curl.w, null, 'no known load'); assert.equal(curl.sets, 3); assert.deepEqual(curl.steps, [20]);
      assert.equal(curl.head, 'lower_back', 'the new lift keeps its catalogue head');
      assert.deepEqual(curl.secondary, copy(entry.secondary));
      // EVERY member of every kept lift is the basis Today stands on, but the one field the athlete changed.
      assertKeptExactly(adopted, basis, { [pulldown]: ['sets'] });
      assert.equal(adopted.exercises.find(e => e.id === pulldown).sets, 4);
      assert.equal(Object.hasOwn(adopted.exercises.find(e => e.id === 'synthetic-raise'), 'head'), false,
        'the kept side-delt lift did not gain its tag head: its volume buckets as it did before the edit');
      // Monday is Upper: the engine serves the athlete's order.
      assert.deepEqual(membership(adopted, '2026-09-21').exercise_ids, order);
      assert.deepEqual(membership(adopted, '2026-09-22').exercise_ids, [basis.exercises[3].id, curl.id]);
    } finally { next.close(); }
  } finally { try { era.close(); } catch (_) { /* closed above */ } }
});

const words = doc => (doc.getElementById('phone') || doc.body).textContent.replace(/\s+/g, ' ');
async function openEditor(page) {
  const link = await until(() => slot(page.doc, 'routine-entry'), 'the Change my routine entry');
  assert.equal(link.textContent, COPY.entry);
  tap(link);
  await until(() => slots(page.doc, 'routine-row').length, 'the routine list');
}
const saved = async (page, date) => until(() => {
  const line = slot(page.doc, 'routine-message');
  return line && line.textContent === M.withDate(COPY.savedFor, date) && !slot(page.doc, 'routine-save')?.disabled;
}, 'the saved line');

test('RT-05 the real Today page: open, reorder, add, change days; the date is shown before saving; '
  + 'today keeps its workout and the next day serves the new routine', { timeout: 60000 }, async () => {
  const { indexedDB, era, document } = await enrolled('page');
  era.close();
  let page = await bootOn(indexedDB, 'page', DAY1);
  try {
    const basisBefore = copy(page.booted.model.basisState());
    await openEditor(page);
    assert.equal(slot(page.doc, 'routine-starts').textContent,
      'Changes start on Thursday, September 17. Today\u2019s workout stays as it is.');
    // REORDER Upper: move the first lift down, then save the order.
    const upper = () => slots(page.doc, 'routine-row').filter(r => r.closest('[data-slot="routine-U"]'));
    const first = upper()[0].dataset.id;
    tap(upper()[0].querySelector('[data-slot="routine-down"]'));
    assert.equal(upper()[1].dataset.id, first, 'the draft moved');
    tap(slot(page.doc, 'routine-save-order'));
    await until(() => slot(page.doc, 'routine-message'), 'a save answer');
    assert.equal(slot(page.doc, 'routine-message').textContent, M.withDate(COPY.savedFor, DAY2));
    const order = upper().map(r => r.dataset.id);
    assert.equal(order[1], first);
    // ADD a Lower exercise: no load field, the standard start stated.
    tap(page.doc.querySelector('[data-slot="routine-L"] [data-slot="routine-add"]'));
    assert.equal(slot(page.doc, 'routine-new-rule').textContent, 'A new exercise starts at 3 sets with no weight. Your first workout sets it.');
    type(page.doc.getElementById('routine-new-name'), 'Synthetic curl');
    tap(slot(page.doc, 'routine-mg-hams'));
    type(page.doc.getElementById('routine-first'), '20');
    // A refusal keeps the draft: the jump is invalid.
    type(page.doc.getElementById('routine-inc'), '0');
    tap(slot(page.doc, 'routine-save'));
    assert.match(slot(page.doc, 'routine-message').textContent, /jump/);
    assert.equal(page.doc.getElementById('routine-new-name').value, 'Synthetic curl', 'the draft survives a refusal');
    type(page.doc.getElementById('routine-inc'), '');
    tap(slot(page.doc, 'routine-save'));
    await until(() => slot(page.doc, 'routine-message') && slots(page.doc, 'routine-row').length === LIFTS.length + 1, 'the added row');
    // DAYS: Thursday becomes Upper.
    tap(slot(page.doc, 'routine-week'));
    tap(slot(page.doc, 'routine-day-4-U'));
    tap(slot(page.doc, 'routine-save'));
    await until(() => slot(page.doc, 'routine-message') && slot(page.doc, 'routine-week'), 'back on the list');
    assert.equal(slot(page.doc, 'routine-message').textContent, M.withDate(COPY.savedFor, DAY2));
    const plan = Object.values((await ops(page.era)).ops).filter(op => op.kind === 'plan-mutation');
    assert.deepEqual(plan.map(op => op.members[0].value.edit.kind), ['reorder', 'add', 'split']);
    // TODAY is unchanged, on this page and on a fresh boot of the same day.
    assert.deepEqual(page.booted.model.basisState(), basisBefore);
    tap(slot(page.doc, 'routine-back'));
    page.close();
    page = await bootOn(indexedDB, 'page', DAY1);
    assert.deepEqual(page.booted.model.basisState(), basisBefore, 'a reboot today still stands on today\u2019s routine');
    page.close();
    // THE NEXT DAY, Thursday, is now an Upper day in the athlete's order.
    page = await bootOn(indexedDB, 'page', DAY2);
    const state = page.booted.model.stateFromOps();
    // Fable l1 B1: the basis the page now stands on keeps every kept lift exactly as the first run built it.
    const { createCleanInitState } = await import('../setup-model.mjs');
    assertKeptExactly(page.booted.model.basisState(), createCleanInitState({ setup: document.setup }));
    assert.deepEqual(membership(state, DAY2).exercise_ids, order, 'the engine serves his order on his new day');
    const curl = state.exercises.find(e => e.n === 'Synthetic curl');
    assert.equal(curl.w, null); assert.equal(curl.sets, 3);
    const card = await page.booted.workout.gym.read();
    assert.equal(card.phase, 'ready', 'the gym card prepares on the changed routine: ' + (card.code || card.phase));
    assert.equal(card.total, 9, 'three Upper lifts at three sets');
    assert.equal(/[\u2013\u2014]/.test(words(page.doc)), false);
  } finally { page.close(); }
});

/* THE IMPORTED ATHLETE'S BRANCH (the owner's path: history imported from the old
   app, so his basis is the admitted import, not a clean first run). A real
   admission seals a bundle through the port, which this seat may not run, so the
   generation here is built by hand in the shape local-source-basis.mjs admits,
   and the REAL companion is run over it on its local-source branch. */
test('RT-06 an admitted import is the basis the routine is edited over, with its own ids, days and history kept', async () => {
  const Ops = require('../../../../client/ops.cjs');
  const Commands = require('../../../../m4/workout/plan-edit-commands.cjs');
  const { createPlanEditProjector } = require('../../../../m4/workout/plan-edit-model.cjs');
  const { createHash } = await import('node:crypto');
  const { admittedLocalSourceBasis } = await import('../local-source-basis.mjs');
  const { routineBasis } = await import('../routine-host.mjs');
  const doc = shipped('2026-09-01'), namespace = 'synthetic/s15-imported';
  const origin = Ops.build({ kind: 'fact', class: 'event', payload: { profile: Setup.PROFILE, setup: doc.setup, tags: doc.tags },
    op_id: 'op-s15-1', athlete_id: 'ath-s15', device_id: 'dev-s15', device_seq: 1, predecessor: null,
    effective: { local_date: '2026-09-01', local_time: '12:00', utc_offset: '-04:00' }, lease_id: 'lease-s15', schema_version: 2 }, 'synthetic-test-identity');
  // The old app's own lifts: short ids, different numbers, a lift the phone never had, and history.
  const { createCleanInitState } = await import('../setup-model.mjs');
  const state = copy(createCleanInitState({ setup: doc.setup }));
  state.exercises = state.exercises.map((e, i) => ({ ...e, id: ['p', 'pd', 'r', 'lp'][i], sets: 4, w: 50 + i }));
  state.exOrder = { U: ['r', 'p', 'pd'], L: ['lp'] };
  state.split = [{ from: '2026-08-01', map: copy(doc.setup.split.map), why: 'old app week' }];
  state.sessionLog = { '2026-08-20': { entries: [{ id: 'p', reps: [8, 8], w: 50 }] } };
  const B = { installation_id: namespace, source_digest: 'x'.repeat(64) };
  const generation = { metadata: { localSourceApplication: { core_complete: true, selection_id: 'sel-1', basis: B },
    localSources: { active: 'sel-1' } },
    collections: { ops: { [origin.op_id]: origin }, rejected: {}, outbox: {}, sync: { snapshot: { plan: {} } },
      derived: { localSource: { basis: B, view: { ready: true, pending: false, issues: [], basis: B, state } } } } };
  const basis = routineBasis(generation, { namespace });
  assert.equal(basis.source, 'local-source');
  assert.deepEqual(basis.state, state, 'the admitted import itself, not a clean first run');
  const SetupTags = require('../../../../m4/workout/setup-tags.cjs');
  const { ENGINE_MG, REGION_MG } = await import('../exercise-catalogue.mjs');
  const rules = SetupTags.createSetupTagProjector({ taxonomy: { muscles: [...ENGINE_MG], regions: { ...REGION_MG } } });
  const projector = createPlanEditProjector({ basisState: basis.state, setupOperation: origin, validateTags: rules.validateExerciseTags,
    projectNewExerciseTags: rules.projectNewExerciseTags, basisSource: 'local-source',
    hashBasis: text => createHash('sha256').update(text, 'utf8').digest('hex'),
    admittedBasisOf: g => admittedLocalSourceBasis(g, { athleteLabel: doc.setup.athlete_label, namespace }) });
  const now = projector.read(generation, DAY1);
  const commands = Commands.createPlanEditCommands({ validateTags: rules.validateExerciseTags });
  const edits = [M.reorderEdit('U', ['p', 'pd', 'r']), M.splitEdit({ ...doc.setup.split.map, 4: 'U' }),
    M.newExerciseEdit({ n: 'Synthetic curl', mg: 'hams', day: 'L', first: '20' }, now.state.exercises.map(e => e.id)).edit];
  let last = origin;
  for (const [i, edit] of edits.entries()) {
    const r = projector.read(generation, DAY1);
    const prepared = commands.prepare({ action: Commands.ACTION, input: { intent_id: 'i' + i, seen_plan_basis: r.plan_basis,
      starts_on: DAY2, edit, causal_parents: r.causal_parents } });
    const op = Ops.build({ ...prepared, op_id: 'op-s15-' + (i + 2), athlete_id: 'ath-s15', device_id: 'dev-s15', device_seq: i + 2,
      predecessor: last.op_id, effective: { local_date: DAY1, local_time: '12:00', utc_offset: '-04:00' },
      lease_id: 'lease-s15', schema_version: 2 }, 'synthetic-test-identity');
    generation.collections.ops[op.op_id] = op; last = op;
  }
  assert.deepEqual(projector.read(generation, DAY1).state, state, 'today keeps the imported basis');
  const next = projector.read(generation, DAY2).state;
  assert.deepEqual(membership(next, DAY2).exercise_ids, ['p', 'pd', 'r'], 'Thursday is Upper, in his order');
  assert.deepEqual(next.split.slice(0, 1), state.split, 'the imported week history is kept');
  assert.deepEqual(next.sessionLog, state.sessionLog, 'imported history is never rewritten');
  for (const kept of state.exercises) assert.deepEqual(next.exercises.find(e => e.id === kept.id), kept, kept.id + ' kept every field');
  const curl = next.exercises.find(e => e.n === 'Synthetic curl');
  assert.equal(curl.w, null); assert.equal(curl.sets, 3);
});

/* Fable l1 N1 and N2: after the day turns under an open screen the editor reads the routine again (and so shows
   the new start date) and keeps the draft, and it says the day changed rather than that the routine did. */
test('RT-07 a turned day reloads the routine, keeps the draft and says so in its own words', async () => {
  const { mountRoutine } = await import('../routine-app.mjs');
  const { createCleanInitState } = await import('../setup-model.mjs');
  const state = createCleanInitState({ setup: shipped(DAY1).setup });
  let views = 0, saves = 0;
  const starts = ['2026-09-17', '2026-09-18'];
  const session = { ok: true,
    async view() { const i = Math.min(views, 1); views += 1; return { ok: true, today: DAY1, starts_on: starts[i], state, pending_dates: [], taken: [] }; },
    async save(edit, shown) { saves += 1; return saves === 1 ? { ok: false, code: 'PLAN_EDIT_DAY_TURNED' } : { ok: true, starts_on: shown }; },
    close() {} };
  const win = shellWindow(), root = win.document.createElement('div');
  win.document.body.append(root);
  const view = mountRoutine(win.document, root, { routine: { session: async () => session } });
  await view.settled();
  tap(root.querySelector('[data-slot="routine-L"] [data-slot="routine-add"]'));
  type(win.document.getElementById('routine-new-name'), 'Synthetic curl');
  tap(root.querySelector('[data-slot="routine-mg-hams"]'));
  type(win.document.getElementById('routine-first'), '20');
  tap(root.querySelector('[data-slot="routine-save"]'));
  await view.settled();
  assert.equal(views, 2, 'the routine was read again');
  assert.equal(root.querySelector('[data-slot="routine-message"]').textContent, 'The day has changed. Look it over and save again.');
  assert.equal(root.querySelector('[data-slot="routine-starts"]').textContent,
    'Changes start on Friday, September 18. Today\u2019s workout stays as it is.', 'the new start date is shown');
  assert.equal(win.document.getElementById('routine-new-name').value, 'Synthetic curl', 'the draft survives');
  tap(root.querySelector('[data-slot="routine-save"]'));
  await view.settled();
  assert.equal(saves, 2);
  assert.equal(root.querySelector('[data-slot="routine-message"]').textContent, 'Saved. It starts on Friday, September 18.');
  view.close();
});

/* S15 F10, PM ruling option B (the F4 precedent): AN IMPORT REPLACES THE ROUTINE. A change saved on the first-run
   routine BEFORE the import is kept on record and no longer used; a change saved AFTER the import is used as normal.
   Which changes the import superseded is admission's own verdict, read from the admitted view's F10 rows. The
   generation is built by hand in the shape local-source-basis.mjs admits, as RT-06 builds it (a real admission seals
   a bundle through the port, which this seat may not run; rebuild/lanes/d/p3-replay-all/plan-edit-import.test.mjs is
   the real-admission cell). */
test('RT-08 an import supersedes the routine changes made before it, keeps them on record, and a change after it applies',
  async () => {
    const Ops = require('../../../../client/ops.cjs');
    const Commands = require('../../../../m4/workout/plan-edit-commands.cjs');
    const { createPlanEditProjector } = require('../../../../m4/workout/plan-edit-model.cjs');
    const { createHash } = await import('node:crypto');
    const { admittedLocalSourceBasis } = await import('../local-source-basis.mjs');
    const { routineBasis } = await import('../routine-host.mjs');
    const { createCleanInitState } = await import('../setup-model.mjs');
    const SetupTags = require('../../../../m4/workout/setup-tags.cjs');
    const { ENGINE_MG, REGION_MG } = await import('../exercise-catalogue.mjs');
    const rules = SetupTags.createSetupTagProjector({ taxonomy: { muscles: [...ENGINE_MG], regions: { ...REGION_MG } } });
    const commands = Commands.createPlanEditCommands({ validateTags: rules.validateExerciseTags });
    const hashBasis = text => createHash('sha256').update(text, 'utf8').digest('hex');
    const doc = shipped('2026-09-01'), namespace = 'synthetic/s15-superseded';
    const effective = { local_date: DAY1, local_time: '12:00', utc_offset: '-04:00' };
    const origin = Ops.build({ kind: 'fact', class: 'event', payload: { profile: Setup.PROFILE, setup: doc.setup, tags: doc.tags },
      op_id: 'op-f10-1', athlete_id: 'ath-s15', device_id: 'dev-s15', device_seq: 1, predecessor: null,
      effective: { ...effective, local_date: '2026-09-01' }, lease_id: 'lease-s15', schema_version: 2 }, 'synthetic-test-identity');
    const generation = { metadata: {}, collections: { ops: { [origin.op_id]: origin }, rejected: {}, outbox: {},
      sync: { snapshot: { plan: {} } } } };
    const projectorOn = (basis, source) => createPlanEditProjector({ basisState: basis.state, setupOperation: origin,
      validateTags: rules.validateExerciseTags, projectNewExerciseTags: rules.projectNewExerciseTags, basisSource: source, hashBasis,
      admittedBasisOf: g => admittedLocalSourceBasis(g, { athleteLabel: doc.setup.athlete_label, namespace }) });
    const write = (projector, edit, seq, predecessor) => {
      const r = projector.read(generation, DAY1);
      const prepared = commands.prepare({ action: Commands.ACTION, input: { intent_id: 'f10-' + seq, seen_plan_basis: r.plan_basis,
        starts_on: DAY2, edit, causal_parents: r.causal_parents } });
      const op = Ops.build({ ...prepared, op_id: 'op-f10-' + seq, athlete_id: 'ath-s15', device_id: 'dev-s15', device_seq: seq,
        predecessor, effective, lease_id: 'lease-s15', schema_version: 2 }, 'synthetic-test-identity');
      generation.collections.ops[op.op_id] = op;
      return op;
    };
    // BEFORE THE IMPORT: the first-run routine, and one change to it (the press goes to five sets).
    const firstRun = routineBasis(generation, { namespace });
    assert.equal(firstRun.source, 'first-run');
    const press = firstRun.state.exercises.find(e => e.n === 'Synthetic press');
    const before = write(projectorOn(firstRun, 'first-run'), M.updateEdit(press, { ...press, sets: 5 }).edit, 2, origin.op_id);
    assert.equal(projectorOn(firstRun, 'first-run').read(generation, DAY2).state.exercises.find(e => e.id === press.id).sets, 5);
    // THE IMPORT: the old app's own routine, admitted, and admission's F10 verdict on the change made before it.
    const state = copy(createCleanInitState({ setup: doc.setup }));
    state.exercises = state.exercises.map((e, i) => ({ ...e, id: ['p', 'pd', 'r', 'lp'][i], sets: 4, w: 50 + i }));
    state.exOrder = { U: ['r', 'p', 'pd'], L: ['lp'] };
    state.split = [{ from: '2026-08-01', map: copy(doc.setup.split.map), why: 'old app week' }];
    const B = { installation_id: namespace, source_digest: 'y'.repeat(64) };
    const families = [{ family: 'F10', state: 'superseded', op_id: before.op_id }];
    generation.metadata = { localSourceApplication: { core_complete: true, selection_id: 'sel-f10', basis: B },
      localSources: { active: 'sel-f10' } };
    generation.collections.derived = { localSource: { basis: B,
      view: { ready: true, pending: false, issues: [], basis: B, state, families } } };
    const imported = routineBasis(generation, { namespace });
    assert.equal(imported.source, 'local-source');
    const projector = projectorOn(imported, 'local-source');
    // SUPERSEDED, NOT DELETED: the routine is the imported one, and the change is still on the record.
    const read = projector.read(generation, DAY2);
    assert.deepEqual(read.state, state, 'the imported routine is used; the change made before the import is not');
    assert.deepEqual(read.applied_ids, []);
    assert.deepEqual(read.intents.map(i => [i.op_id, i.status]), [[before.op_id, 'superseded']]);
    assert.deepEqual(read.causal_parents, [origin.op_id], 'a superseded change is not a parent of the next one');
    assert.deepEqual(generation.collections.ops[before.op_id], before, 'the change is kept on record, byte for byte');
    // AFTER THE IMPORT: a change to an imported lift applies from its start date, as normal.
    const pulldown = state.exercises.find(e => e.id === 'pd');
    const after = write(projector, M.updateEdit(pulldown, { ...pulldown, sets: 5 }).edit, 3, before.op_id);
    assert.deepEqual(projector.read(generation, DAY1).state, state, 'today keeps the imported routine');
    const next = projector.read(generation, DAY2);
    assert.equal(next.state.exercises.find(e => e.id === 'pd').sets, 5, 'the change made after the import applies');
    assert.deepEqual(next.applied_ids, [after.op_id]);
    assert.deepEqual(next.intents.map(i => [i.op_id, i.status]), [[before.op_id, 'superseded'], [after.op_id, 'active']]);
    for (const kept of state.exercises.filter(e => e.id !== 'pd'))
      assert.deepEqual(next.state.exercises.find(e => e.id === kept.id), kept, kept.id + ' kept every field');
    // ... and the verdict has teeth: an F10 row that names anything but a routine change on this record refuses.
    families.push({ family: 'F10', state: 'superseded', op_id: origin.op_id });
    assert.throws(() => projector.read(generation, DAY2), { code: 'PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE' });
  });

/* S15 ROUND 5 POLISH, item 8 (PM UI pass): the routine's exercise search answers as he types. An input
   event alone, with no Enter and no change event, lists the catalogue picks, and the box he is typing
   in is the same box afterwards, so the caret never leaves his hands. */
test('RT-09 the routine search lists picks while typing, without Enter, and keeps the same search box', async () => {
  const { mountRoutine } = await import('../routine-app.mjs');
  const { createCleanInitState } = await import('../setup-model.mjs');
  const state = createCleanInitState({ setup: shipped(DAY1).setup });
  const session = { ok: true,
    async view() { return { ok: true, today: DAY1, starts_on: DAY2, state, pending_dates: [], taken: [] }; },
    async save() { return { ok: true, starts_on: DAY2 }; }, close() {} };
  const win = shellWindow(), root = win.document.createElement('div');
  win.document.body.append(root);
  const view = mountRoutine(win.document, root, { routine: { session: async () => session } });
  await view.settled();
  tap(root.querySelector('[data-slot="routine-L"] [data-slot="routine-add"]'));
  const box = win.document.getElementById('routine-search');
  assert.ok(box, 'the search box is on the screen');
  box.value = 'leg press';
  box.dispatchEvent(new win.Event('input', { bubbles: true }));
  const picks = [...root.querySelectorAll('[data-slot="routine-pick"]')].map(b => b.textContent);
  assert.ok(picks.some(t => /leg press/i.test(t)), 'the picks appear while typing: ' + JSON.stringify(picks));
  assert.equal(win.document.getElementById('routine-search'), box, 'the box he is typing in was not replaced');
  box.value = 'zzzznotalift';
  box.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(root.querySelectorAll('[data-slot="routine-pick"]').length, 0, 'the list follows the words');
  const { COPY: SETUP_COPY } = await import('../setup-model.mjs');
  assert.ok(root.textContent.includes(SETUP_COPY.searchNone), 'and says so when nothing matches');
  view.close();
});

/* S15 ROUND 5 POLISH, item 1 (PM UI pass, shots 13/16/24/26): the workout's header named the PREVIEW
   athlete's session ("UPPER BODY . TODAY") on the athlete's own Lower day. The gym card took its title from
   the Today view read at boot, before Today adopted his own week; it now reads it when the card reads. */
test('RT-10 on his own Lower day the workout header names his Lower session, the same title Today shows', { timeout: 60000 }, async () => {
  const { indexedDB, era } = await enrolled('title');
  era.close();
  // 2026-09-26 is a Saturday: a Lower day in this athlete's week, and not the preview athlete's.
  const page = await bootOn(indexedDB, 'title', '2026-09-26');
  try {
    const today = page.booted.model.read();
    assert.ok(today.workout && today.workout.today === true, 'Today has a session today');
    assert.match(today.workout.title, /LOWER/, 'Today names his Lower session: ' + today.workout.title);
    const card = await page.booted.workout.gym.read();
    assert.equal(card.title, today.workout.title, 'the workout header is the session Today names');
  } finally { page.close(); }
});

/* S15 ROUND 5 POLISH, item 9 (PM UI pass, shot 32 and its console error): a fresh athlete has no lean-mass
   estimate, so the engine's protein target is not a number and its explanation read "NaN g today ... NaN kg".
   Why this plan now shows nothing for protein rather than NaN; every other section is unchanged. */
test('RT-11 Why this plan never shows NaN: with no protein target there is no protein section', { timeout: 60000 }, async () => {
  const { indexedDB, era } = await enrolled('nan');
  era.close();
  const page = await bootOn(indexedDB, 'nan', DAY1);
  try {
    const view = page.booted.model.read();
    assert.equal(Number.isFinite(view.proteinTarget.g), false, 'precondition: this athlete has no protein target yet');
    for (const section of view.why) assert.doesNotMatch(String(section.body || ''), /NaN/, section.heading);
    assert.equal(view.why.some(s => s.heading === 'Your protein'), false, 'no protein section without a target');
    assert.ok(view.why.some(s => s.heading === 'Your calories'), 'the other sections stay');
  } finally { page.close(); }
});

/* S15 ROUND 5 POLISH, items 5 and 6 (PM UI pass, shots 11/12/13/17). Today marks a training day, and the
   stylesheet puts today's workout first on it, makes the weigh-in one row and keeps a rest day's order; the
   set entry's two boxes are drawn before anything is typed, and the machine row stands clear of the effort
   row. The layout itself is the look gate's to measure; these cells pin the hooks and the rules. */
test('RT-12 a training day is marked and laid out workout-first; a rest day keeps its order; the set boxes are drawn',
  { timeout: 60000 }, async () => {
  const { indexedDB, era } = await enrolled('order');
  era.close();
  let page = await bootOn(indexedDB, 'order', '2026-09-22');   // Tuesday: a Lower day
  try {
    const day = page.doc.querySelector('#phone .body.page, .body.page');
    assert.ok(day, 'the Today day is on the screen');
    assert.equal(day.getAttribute('data-day'), 'train', 'a training day is marked');
  } finally { page.close(); }
  page = await bootOn(indexedDB, 'order', DAY1);               // Wednesday: a rest day
  try {
    assert.equal(page.doc.querySelector('.body.page').getAttribute('data-day'), 'rest', 'a rest day is marked');
  } finally { page.close(); }
  const css = fs.readFileSync(new URL('../preview.css', import.meta.url), 'utf8');
  const begin = css.indexOf('/* ===== S15 ROUND 5 POLISH'), end = css.indexOf('/* ===== S15 ROUND 5 POLISH: END');
  assert.ok(begin >= 0 && end > begin, 'the polish block is in preview.css');
  const rules = css.slice(begin, end).replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(rules, /\.body\[data-day="train"\] > \.timeline > #card-train \{ order: -1; \}/, 'the workout card first');
  assert.match(rules, /\.body\[data-day="train"\] > section,[\s\S]*?\{ order: 2; \}/, 'the headline after the cards');
  assert.doesNotMatch(rules, /data-day="rest"/, 'a rest day keeps the order it had');
  assert.match(rules, /\.numerals \.value input \{[^}]*border-bottom: 1px solid var\(--line-gold\)/, 'the set boxes are drawn');
  assert.match(rules, /#machine \{[^}]*z-index: 1;[^}]*margin-bottom/, 'the machine row stands clear of the effort row');
  assert.doesNotMatch(rules, /#[0-9a-f]{3,8}\b|rgba?\(/i, 'no colour is invented');
});

/* S15 ROUND 6 POLISH (PM re-capture of f65a7bd, shots 02/03, 06/07, 09/11, 14/15, 20). Measured at 390x844 at
   the builder seat: on a training day the workout card is the first thing under the date and Start is on the
   first screen; the three appended controls are one quiet group at the foot; the build line is off the
   screen but still in the page; the set screen's machine and check-in rows end above the effort row; the
   recorded workout's heading is one line and its offers sit under the count, above Back to Today; a
   focused heading draws no ring; the routine picks are a list under the search box. Layout is the look
   gate's to measure; these cells pin the hooks and the rules. */
test('RT-13 round 6: Today is workout-first with its controls at the foot; the set, recorded, setup and routine '
  + 'screens are laid out as measured', { timeout: 60000 }, async () => {
  const { indexedDB, era } = await enrolled('round6');
  era.close();
  const page = await bootOn(indexedDB, 'round6', '2026-09-22');   // Tuesday: a Lower day
  try {
    const day = page.doc.querySelector('.body.page');
    assert.equal(day.getAttribute('data-day'), 'train', 'a training day is marked');
    for (const slot of ['measure-tile', 'import-entry', 'routine-entry']) {
      const node = day.querySelector(':scope > [data-slot="' + slot + '"]');
      assert.ok(node, slot + ' is one of the day\'s own controls');
    }
    const build = page.doc.querySelector('[data-slot="build-id"]');
    assert.ok(build && build.textContent.trim(), 'the build line is still in the page for the problem report');
  } finally { page.close(); }
  const css = fs.readFileSync(new URL('../preview.css', import.meta.url), 'utf8');
  const begin = css.indexOf('/* ===== S15 ROUND 6 POLISH'), end = css.indexOf('/* ===== S15 ROUND 6 POLISH: END');
  assert.ok(begin >= 0 && end > begin, 'the round 6 block is in preview.css');
  const rules = css.slice(begin, end).replace(/\/\*[\s\S]*?\*\//g, '');
  // A. Workout first, controls last, no build line, no long headline on a training day.
  assert.match(rules, /\.body\[data-day="train"\] > :is\(\[data-slot="measure-tile"\], \[data-slot="import-entry"\], \[data-slot="routine-entry"\]\) \{ order: 4; \}/,
    'the three controls after the cards (-1), the headline (2) and the foot (3)');
  assert.match(rules, /\[data-slot="build-id"\] \{ position: absolute;[^}]*clip-path: inset\(50%\)/, 'the build line leaves the screen');
  assert.match(rules, /\.body\[data-day="train"\] > section > :is\(\.label, \.greeting, \[data-slot="instruction-why"\]\) \{ display: none; \}/,
    'the headline and its long sentence give way on a training day');
  // B. The set screen ends above the effort row.
  assert.match(rules, /\.w-reasons \.w-reason \{[^}]*-webkit-line-clamp: 2;/, 'the reason reads two lines until Why? opens it');
  assert.match(rules, /#setcard \{ margin-top: 8px; \}/, 'the card sits close under the reason');
  assert.match(rules, /#machine \{ min-height: 52px;/, 'the machine row is compact');
  assert.match(rules, /\.rowcard\[data-action="checkin"\] \{ min-height: 52px; margin-top: 0;/, 'the check-in row is compact');
  assert.match(rules, /\.screen-workout \.ui > \[data-native-load="gym"\] > \.stack, \.screen-workout \.ui > \.stack \{ margin-top: 0; \}/,
    'the effort row no longer reaches up over the body');
  // C. The recorded workout.
  assert.match(rules, /article\.page \{ display: contents; \}/, 'the recorded page lays out in the host column');
  assert.match(rules, /article\.page > \.bottom \{ order: 3; z-index: 3; \}/, 'Back to Today after the offers, and above them');
  assert.match(rules, /\.detail-head h1 \{ font-size: 30px;/, 'a heading that keeps to one line');
  // D. A focused heading draws no ring; controls keep theirs.
  assert.match(rules, /:not\(button, input, select, textarea, a, \[role="button"\]\)\[tabindex="-1"\]:focus \{ outline: none; \}/,
    'a programmatically focused heading draws no ring');
  assert.doesNotMatch(rules, /focus-visible/, 'no control loses its keyboard ring');
  // E. The routine picks.
  assert.match(rules, /\[data-slot="routine-search-results"\]:not\(\[hidden\]\) \{ display: flex; flex-direction: column;/,
    'the picks are a list under the box');
  assert.doesNotMatch(rules, /#[0-9a-f]{3,8}\b|rgba?\(/i, 'no colour is invented');
});
