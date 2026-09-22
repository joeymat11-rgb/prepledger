/* GSS annex G4/G5: held real set writes at the current mounted-card boundary.
 *
 * The workout and settings stores are the current encrypted synthetic hosts. The
 * only interception is the current client's set continuation call, either before
 * it commits or after it returns its real acknowledgement. No lifecycle API is
 * restored and every wait is bounded.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createGymHost } from '../gym-host.mjs';
import { createGymModel, EFFORT_CHOICES } from '../gym-model.mjs';
import { mountGym, newGymDraft } from '../gym-app.mjs';
import { createMachineSettingsHost } from '../machine-settings-host.mjs';
import TodayModel from '../today-model.cjs';
import design from '../design.cjs';

const { createTodayModel, SYNTHETIC_DAY: DAY } = TodayModel;
const SLOT = 'earned-today-preview/' + DAY;
const CHOICE = EFFORT_CHOICES.find((choice) => choice.label === '2');
const REPLACEMENT_CHOICE = EFFORT_CHOICES.find((choice) => choice.label === '1');
const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
const copy = (value) => structuredClone(value);
const deferred = () => { let resolve; const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve }; };
const settle = async (rounds = 8) => {
  for (let index = 0; index < rounds; index += 1) await new Promise((done) => setTimeout(done, 0));
};
async function within(value, label, milliseconds = 5000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('GSS-ANNEX-BOUNDED-WAIT: ' + label)), milliseconds);
  });
  try { return await Promise.race([Promise.resolve(value), timeout]); }
  finally { clearTimeout(timer); }
}
async function until(check, label) {
  for (let index = 0; index < 400; index += 1) {
    if (check()) return;
    await new Promise((done) => setTimeout(done, 1));
  }
  throw new Error('GSS-ANNEX-TIMEOUT: ' + label);
}

async function collections(repository) {
  const value = (await repository.load()).generation.collections;
  return copy({ ops: value.ops || {}, outbox: value.outbox || {} });
}

async function device(label) {
  const fault = faultDatabase();
  const today = createTodayModel({});
  const state = today.stateFromOps();
  const databaseName = 'gss-annex-log-' + label;
  const openGym = () => createGymHost({ day: DAY, engineState: state,
    indexedDB: fault.indexedDB, crypto: webcrypto, plannedSplitSlotId: SLOT, databaseName });
  const gymHost = await openGym();
  const base = createGymModel({ gymHost, sessionTitle: today.read().workout.title });
  const started = await base.start();
  assert.equal(started.ok, true, 'GSS-LOG-START-REFUSED ' + (started.code || ''));
  const settings = await createMachineSettingsHost({ day: DAY, indexedDB: fault.indexedDB,
    crypto: webcrypto, databaseName });
  return { fault, today, state, databaseName, gymHost, settings, openGym };
}

function heldLogModel(unit, seam) {
  const reached = deferred(), release = deferred(), done = deferred();
  const client = unit.gymHost.host.client;
  const heldClient = Object.freeze({ ...client,
    executeResumedWorkout: async (request) => {
      if (!request || request.action !== 'set') return client.executeResumedWorkout(request);
      if (seam === 'before-commit') { reached.resolve({ seam }); await release.promise; }
      const result = await client.executeResumedWorkout(request);
      if (seam === 'after-commit') { reached.resolve({ seam, result: copy(result) }); await release.promise; }
      return result;
    } });
  const heldHost = Object.freeze({ ...unit.gymHost.host, client: heldClient });
  const composed = Object.freeze({ ...unit.gymHost, host: heldHost });
  const actual = createGymModel({ gymHost: composed, sessionTitle: unit.today.read().workout.title });
  let submitted = null;
  const model = Object.freeze({ ...actual,
    logSet: async (raw) => {
      submitted = copy(raw);
      let envelope;
      try {
        const result = await actual.logSet(raw);
        envelope = { kind: 'returned', result: copy(result) };
        return result;
      } catch (error) {
        envelope = { kind: 'threw', name: error?.name || null, message: error?.message || null };
        throw error;
      } finally { done.resolve(envelope); }
    } });
  return { model, reached: reached.promise, release: release.resolve, done: done.promise,
    submitted: () => copy(submitted) };
}

async function page(unit, model, draft, onBack = () => {}, onChanged = () => {}) {
  const dom = unit.dom || new JSDOM(shell(), { url: 'http://127.0.0.1/' });
  unit.dom = dom;
  const phone = dom.window.document.getElementById('phone');
  const mounted = mountGym(dom.window.document, phone,
    { model, draft, settings: unit.settings, onBack, onChanged });
  await within(mounted, 'mount');
  const reading = mounted.settings.read();
  if (reading) await within(reading, 'settings read');
  await settle();
  const pick = (selector) => phone.querySelector(selector);
  const click = (selector) => {
    const control = pick(selector);
    assert(control, 'GSS-LOG-MISSING-CONTROL ' + selector);
    control.click();
  };
  const input = (selector, value) => {
    const control = pick(selector);
    assert(control, 'GSS-LOG-MISSING-INPUT ' + selector);
    control.value = value;
    control.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  };
  const chooseEffort = (choice = CHOICE) => {
    const control = [...phone.querySelectorAll('[data-slot="choices"] button')]
      .find((button) => button.textContent === choice.label);
    assert(control, 'GSS-LOG-MISSING-EFFORT');
    control.click();
  };
  const openEditor = async () => {
    click('[data-action="settings-open"]');
    await until(() => pick('[data-slot="settings-editor"]')?.hidden === false
      && pick('[data-settings-value="0"]'), 'settings editor');
  };
  return { dom, phone, mounted, pick, click, input, chooseEffort, openEditor };
}

function added(before, after, table) {
  for (const [id, row] of Object.entries(before[table]))
    assert.deepEqual(after[table][id], row, 'GSS-LOG-PRIOR-' + table.toUpperCase() + '-CHANGED ' + id);
  return Object.keys(after[table]).filter((id) => !Object.hasOwn(before[table], id));
}

function proveOneSet(before, after, submitted, expectedSubmitted, returnedOpId) {
  const opIds = added(before, after, 'ops');
  const outboxIds = added(before, after, 'outbox');
  assert.equal(opIds.length, 1, 'GSS-LOG-OP-COUNT');
  assert.equal(outboxIds.length, 1, 'GSS-LOG-OUTBOX-COUNT');
  const op = after.ops[opIds[0]], outbox = after.outbox[outboxIds[0]];
  assert.equal(op.kind, 'session-set', 'GSS-LOG-OP-KIND');
  assert.deepEqual(submitted, expectedSubmitted, 'GSS-LOG-SUBMITTED-SNAPSHOT');
  assert.equal(op.session_start_op_id, expectedSubmitted.startId,
    'GSS-LOG-DURABLE-START-ID');
  assert.equal(op.logical_set_slot, expectedSubmitted.slot,
    'GSS-LOG-DURABLE-SET-SLOT');
  assert.equal(op.lift_lineage_id, expectedSubmitted.lift,
    'GSS-LOG-DURABLE-LIFT-LINEAGE');
  assert.deepEqual(op.payload.load, { value: 45, unit: 'lb' }, 'GSS-LOG-DURABLE-LOAD');
  assert.deepEqual(op.payload.reps, { value: 11, unit: 'rep' }, 'GSS-LOG-DURABLE-REPS');
  assert.deepEqual(op.payload.reserve, CHOICE.reserve, 'GSS-LOG-DURABLE-EFFORT');
  assert.equal(outbox.op_id, op.op_id, 'GSS-LOG-OUTBOX-LINK');
  assert.equal(returnedOpId, op.op_id, 'GSS-LOG-RETURNED-OP-LINK');
  assert.equal(Object.values(after.outbox).filter((row) => row.op_id === op.op_id).length, 1,
    'GSS-LOG-OUTBOX-EXACTLY-ONCE');
}

async function runG4(seam, plant = false) {
  const unit = await device('g4-' + seam + '-' + (plant ? 'plant' : 'candidate'));
  let reopened = null, first = null, replacement = null;
  const held = heldLogModel(unit, seam), draft = newGymDraft();
  let replacementPromise = null, oldOwnedInsideBack = null;
  try {
    const before = await collections(unit.gymHost.repository);
    first = await page(unit, held.model, draft, () => {
      oldOwnedInsideBack = first.mounted.settings.owns();
      replacementPromise = page(unit, held.model, draft);
    });
    const active = await held.model.read();
    assert.equal(active.phase, 'active', 'GSS-G4-PRESUBMIT-NOT-ACTIVE ' + seam);
    const expectedSubmitted = { startId: active.startId, slot: active.set.slot, lift: active.set.lift,
      load: '45', reps: '11', effort: CHOICE.reserve };
    first.input('#gym-weight', '45'); first.input('#gym-reps', '11'); first.chooseEffort();
    first.click('[data-slot="log"]');
    await within(held.reached, 'G4 ' + seam + ' reached');
    first.click('[data-action="back"]');
    replacement = await within(replacementPromise, 'G4 ' + seam + ' remount');
    assert.equal(oldOwnedInsideBack, false, 'GSS-G4-OLD-OWNERSHIP ' + seam);
    replacement.input('#gym-weight', '52'); replacement.input('#gym-reps', '9');
    replacement.chooseEffort(REPLACEMENT_CHOICE);
    held.release();
    const envelope = await within(held.done, 'G4 ' + seam + ' delivery'); await settle();
    assert.deepEqual(draft.entry, { load: '52', reps: '9' },
      'GSS-G4-NEWER-DRAFT-ENTRY-LOST ' + seam);
    assert.deepEqual(draft.effort,
      { label: REPLACEMENT_CHOICE.label, reserve: REPLACEMENT_CHOICE.reserve },
      'GSS-G4-NEWER-DRAFT-EFFORT-LOST ' + seam);
    if (plant) replacement.input('#gym-weight', '');
    const pressed = [...replacement.phone.querySelectorAll('[data-slot="choices"] button')]
      .find((button) => button.textContent === REPLACEMENT_CHOICE.label);
    const observed = { load: replacement.pick('#gym-weight').value,
      reps: replacement.pick('#gym-reps').value,
      effort: pressed?.getAttribute('aria-pressed') };
    replacement.click('[data-action="back"]'); await settle();
    unit.settings.close(); unit.settings = null; unit.gymHost.close(); unit.gymHost = null;
    reopened = await unit.openGym();
    const after = await collections(reopened.repository);
    assert.equal(envelope.kind, 'returned', 'GSS-G4-LOG-THREW ' + seam);
    if (seam === 'after-commit' || envelope.result?.ok === true) {
      assert.equal(envelope.result?.ok, true, 'GSS-G4-ACKNOWLEDGED-SUCCESS ' + seam);
      proveOneSet(before, after, held.submitted(), expectedSubmitted, envelope.result.opId);
    } else {
      assert.equal(envelope.result?.ok, false, 'GSS-G4-PRECOMMIT-UNTYPED-OUTCOME');
      assert.equal(envelope.result?.code, 'WORKOUT_RESUME_REQUIRED',
        'GSS-G4-PRECOMMIT-UNEXPECTED-REFUSAL');
      assert.deepEqual(after, before, 'GSS-G4-PRECOMMIT-REFUSAL-WROTE');
    }
    assert.equal(observed.load, '52', 'GSS-G4-NEWER-LOAD-LOST ' + seam);
    assert.equal(observed.reps, '9', 'GSS-G4-NEWER-REPS-LOST ' + seam);
    assert.equal(observed.effort, 'true', 'GSS-G4-NEWER-EFFORT-LOST ' + seam);
  } finally {
    held.release();
    replacement?.mounted.settings.owns() && replacement.click('[data-action="back"]');
    reopened?.close(); unit.settings?.close(); unit.gymHost?.close(); unit.dom?.window.close();
  }
}

async function runG5(plant = false) {
  const unit = await device('g5-' + (plant ? 'plant' : 'candidate'));
  let reopened = null, mounted = null, changed = 0;
  const held = heldLogModel(unit, 'after-commit'), draft = newGymDraft();
  try {
    const before = await collections(unit.gymHost.repository);
    mounted = await page(unit, held.model, draft, () => {}, () => { changed += 1; });
    const active = await held.model.read();
    assert.equal(active.phase, 'active', 'GSS-G5-PRESUBMIT-NOT-ACTIVE');
    const expectedSubmitted = { startId: active.startId, slot: active.set.slot, lift: active.set.lift,
      load: '45', reps: '11', effort: CHOICE.reserve };
    mounted.input('#gym-weight', '45'); mounted.input('#gym-reps', '11'); mounted.chooseEffort();
    await mounted.openEditor();
    const retiredValue = mounted.pick('[data-settings-value="0"]');
    const retiredSave = mounted.pick('[data-slot="settings-save"]');
    mounted.click('[data-slot="log"]');
    await within(held.reached, 'G5 held Log acknowledgement');
    mounted.input('[data-settings-name="0"]', 'Seat');
    mounted.input('[data-settings-value="0"]', 'four');
    held.release();
    const envelope = await within(held.done, 'G5 Log delivery'); await settle();
    assert.equal(envelope.kind, 'returned', 'GSS-G5-LOG-THREW');
    assert.equal(envelope.result?.ok, true, 'GSS-G5-LOG-NOT-ACKNOWLEDGED');
    const savedTitle = mounted.pick('[data-slot="saved-title"]')?.textContent || '';
    const undoPresent = !!mounted.pick('[data-action="undo"]');
    const performed = copy({ entry: draft.entry, effort: draft.effort });
    mounted.click('[data-slot="primary"]');
    await until(() => mounted.pick('[data-slot="log"]'), 'G5 next active set');
    await settle();
    const next = await held.model.read();
    assert.equal(next.phase, 'active', 'GSS-G5-NEXT-NOT-ACTIVE');
    const settingsBefore = await collections(unit.settings.repository);
    retiredValue.value = 'retired mutation';
    retiredValue.dispatchEvent(new unit.dom.window.Event('input', { bubbles: true }));
    retiredSave.click(); await settle();
    assert.deepEqual(await collections(unit.settings.repository), settingsBefore,
      'GSS-G5-RETIRED-CONTROLS-WROTE');
    assert.equal(mounted.pick('[data-settings-value="0"]')?.value, 'four',
      'GSS-G5-RETIRED-INPUT-MUTATED-FRESH-EDITOR');
    proveOneSet(before, settingsBefore, held.submitted(), expectedSubmitted,
      envelope.result.opId);
    let expectedReopened = settingsBefore;
    if (plant && mounted.pick('[data-settings-value="0"]'))
      mounted.input('[data-settings-value="0"]', 'planted-loss');
    const observed = { editorHidden: mounted.pick('[data-slot="settings-editor"]')?.hidden,
      name: mounted.pick('[data-settings-name="0"]')?.value,
      value: mounted.pick('[data-settings-value="0"]')?.value };
    if (!plant) {
      mounted.click('[data-slot="settings-save"]');
      const pending = mounted.mounted.settings.pending();
      if (pending) await within(pending, 'G5 fresh settings save');
      await settle();
      const settingsAfter = await collections(unit.settings.repository);
      assert.equal(added(settingsBefore, settingsAfter, 'ops').length, 1,
        'GSS-G5-SETTINGS-OP-COUNT');
      assert.equal(added(settingsBefore, settingsAfter, 'outbox').length, 1,
        'GSS-G5-SETTINGS-OUTBOX-COUNT');
      const latest = await unit.settings.latest(next.lift.id);
      assert.equal(latest?.machine?.exercise_id, next.lift.id, 'GSS-G5-SETTINGS-LIFT');
      assert.deepEqual(latest?.machine?.settings, [{ name: 'Seat', value: 'four' }],
        'GSS-G5-SETTINGS-DURABLE');
      expectedReopened = settingsAfter;
    }
    mounted.click('[data-action="back"]'); await settle();
    unit.settings.close(); unit.settings = null; unit.gymHost.close(); unit.gymHost = null;
    reopened = await unit.openGym();
    assert.deepEqual(await collections(reopened.repository), expectedReopened,
      'GSS-G5-REOPENED-MAPS');
    assert.match(savedTitle, /logged/, 'GSS-G5-SAVED-SCREEN-MISSING');
    assert.equal(undoPresent, true, 'GSS-G5-UNDO-MISSING');
    assert.equal(changed, 1, 'GSS-G5-ONCHANGED-COUNT');
    assert.deepEqual(performed.entry, { load: null, reps: null }, 'GSS-G5-PERFORMED-ENTRY-NOT-CLEARED');
    assert.equal(performed.effort, null, 'GSS-G5-PERFORMED-EFFORT-NOT-CLEARED');
    assert.equal(observed.editorHidden, false, 'GSS-G5-EDITOR-LOST-AFTER-LOG');
    assert.equal(observed.name, 'Seat', 'GSS-G5-NAME-LOST-AFTER-LOG');
    assert.equal(observed.value, 'four', 'GSS-G5-ANSWER-LOST-AFTER-LOG');
  } finally {
    held.release();
    mounted?.mounted.settings.owns() && mounted.click('[data-action="back"]');
    reopened?.close(); unit.settings?.close(); unit.gymHost?.close(); unit.dom?.window.close();
  }
}

async function rejectsForeignCarry(field) {
  const unit = await device('g5-boundary-' + field);
  let first = null, replacement = null;
  const draft = newGymDraft();
  const model = createGymModel({ gymHost: unit.gymHost,
    sessionTitle: unit.today.read().workout.title });
  try {
    first = await page(unit, model, draft);
    await first.openEditor();
    first.input('[data-settings-name="0"]', 'Seat');
    first.input('[data-settings-value="0"]', 'four');
    const retiredValue = first.pick('[data-settings-value="0"]');
    first.click('[data-action="back"]'); await settle();
    const foreign = Object.freeze({ ...model, read: async () => {
      const view = copy(await model.read());
      assert.equal(view.phase, 'active', 'GSS-G5-BOUNDARY-NOT-ACTIVE ' + field);
      if (field === 'workout') view.startId += '-foreign';
      else { view.lift.id += '-foreign'; view.set.lift = view.lift.id; }
      return view;
    } });
    replacement = await page(unit, foreign, draft);
    assert.equal(replacement.pick('[data-slot="settings-editor"]')?.hidden, true,
      'GSS-G5-FOREIGN-CARRY-RESTORED ' + field);
    await replacement.openEditor();
    assert.notEqual(replacement.pick('[data-settings-value="0"]')?.value, 'four',
      'GSS-G5-FOREIGN-DRAFT-INHERITED ' + field);
    retiredValue.value = 'retired mutation';
    retiredValue.dispatchEvent(new unit.dom.window.Event('input', { bubbles: true }));
    assert.notEqual(replacement.pick('[data-settings-value="0"]')?.value, 'retired mutation',
      'GSS-G5-FOREIGN-OLD-INPUT-MUTATED ' + field);
  } finally {
    replacement?.mounted.settings.owns() && replacement.click('[data-action="back"]');
    unit.settings.close(); unit.gymHost.close(); unit.dom?.window.close();
  }
}

test('D-GSS-G4: replacement draft survives before and after real set commit',
  { timeout: 45000 }, async () => {
    await assert.rejects(runG4('after-commit', true), (error) =>
      error && error.message.includes('GSS-G4-NEWER-LOAD-LOST'));
    await runG4('before-commit');
    await runG4('after-commit');
  });

test('D-GSS-G5: settings edits survive held Log and only performed entry clears',
  { timeout: 30000 }, async () => {
    await runG5(false);
    await assert.rejects(runG5(true), (error) =>
      error && error.message.includes('GSS-G5-ANSWER-LOST-AFTER-LOG'));
  });

test('D-GSS-G5: settings carry rejects a different workout or lift',
  { timeout: 30000 }, async () => {
    await rejectsForeignCarry('workout');
    await rejectsForeignCarry('lift');
  });
