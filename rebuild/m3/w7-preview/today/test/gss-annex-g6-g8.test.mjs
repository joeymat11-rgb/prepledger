/* GSS annex G6-G8: held real set writes at the current settings repaint and navigation boundaries.
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
        if (seam === 'before-prepare') { reached.resolve({ seam }); await release.promise; }
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

async function page(unit, model, draft, onBack = () => {}, onChanged = () => {}, options = {}) {
  const dom = unit.dom || new JSDOM(shell(), { url: 'http://127.0.0.1/' });
  unit.dom = dom;
  const phone = dom.window.document.getElementById('phone');
  const mounted = mountGym(dom.window.document, phone,
    { model, draft, settings: options.settings || unit.settings, onBack, onChanged });
  await within(mounted, 'mount');
  const reading = mounted.settings.read();
  if (reading && options.awaitSettingsRead !== false) await within(reading, 'settings read');
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

function editorRows(page) {
  return [...page.phone.querySelectorAll('[data-settings-name]')].map((name) => {
    const index = name.getAttribute('data-settings-name');
    return { name: name.value, value: page.pick('[data-settings-value="' + index + '"]')?.value || '' };
  });
}

function assertTyped(envelope, label) {
  assert.equal(envelope.kind, 'returned', label + '-THREW');
  assert.equal(typeof envelope.result?.ok, 'boolean', label + '-UNTYPED-OK');
  if (!envelope.result.ok) assert.equal(typeof envelope.result.code, 'string', label + '-UNTYPED-CODE');
}

async function closeAndRead(unit) {
  unit.settings.close(); unit.settings = null; unit.gymHost.close(); unit.gymHost = null;
  const reopened = await unit.openGym();
  return { reopened, maps: await collections(reopened.repository) };
}

async function runG6(seam, plant = false) {
  const unit = await device('g6-' + seam + '-' + (plant ? 'plant' : 'candidate'));
  const held = heldLogModel(unit, seam), draft = newGymDraft();
  let mounted = null, reopened = null, changed = 0;
  try {
    const before = await collections(unit.gymHost.repository);
    mounted = await page(unit, held.model, draft, () => {}, () => { changed += 1; });
    const active = await held.model.read();
    const expected = { startId: active.startId, slot: active.set.slot, lift: active.set.lift,
      load: '45', reps: '11', effort: CHOICE.reserve };
    mounted.input('#gym-weight', '45'); mounted.input('#gym-reps', '11'); mounted.chooseEffort();
    await mounted.openEditor();
    mounted.input('[data-settings-name="0"]', 'Seat');
    mounted.input('[data-settings-value="0"]', 'four');
    mounted.click('[data-slot="log"]'); await within(held.reached, 'G6 ' + seam);
    mounted.click('[data-action="settings-add"]');
    await until(() => mounted.pick('[data-settings-name="1"]'), 'G6 added row repaint');
    mounted.input('[data-settings-name="1"]', 'Pin');
    mounted.input('[data-settings-value="1"]', '3');
    if (plant) mounted.input('[data-settings-value="1"]', 'PLANTED_LOSS');
    held.release(); const envelope = await within(held.done, 'G6 delivery'); await settle();
    assertTyped(envelope, 'GSS-G6-' + seam.toUpperCase());
    if (envelope.result.ok) {
      assert.match(mounted.pick('[data-slot="saved-title"]')?.textContent || '', /logged/,
        'GSS-G6-SAVED-SCREEN');
      assert(mounted.pick('[data-action="undo"]'), 'GSS-G6-UNDO');
      mounted.click('[data-slot="primary"]');
      await until(() => mounted.pick('[data-slot="log"]'), 'G6 next active repaint');
    }
    const rows = editorRows(mounted);
    assert.deepEqual(rows, [{ name: 'Seat', value: 'four' }, { name: 'Pin', value: '3' }],
      'GSS-G6-ROWS-LOST-' + seam);
    if (!envelope.result.ok)
      assert((mounted.pick('#gym-error')?.textContent || '').includes(envelope.result.code),
        'GSS-G6-PRECOMMIT-CURRENT-CODE');
    mounted.click('[data-action="back"]'); await settle();
    const closed = await closeAndRead(unit); reopened = closed.reopened;
    if (envelope.result.ok) {
      proveOneSet(before, closed.maps, held.submitted(), expected, envelope.result.opId);
      assert.equal(changed, 1, 'GSS-G6-ONCHANGED-COUNT-' + seam);
    } else {
      assert.equal(seam, 'before-commit', 'GSS-G6-ACK-REFUSED');
      assert.equal(envelope.result.code, 'WORKOUT_RESUME_REQUIRED', 'GSS-G6-PRECOMMIT-CODE');
      assert.deepEqual(closed.maps, before, 'GSS-G6-PRECOMMIT-WROTE');
      assert.equal(changed, 0, 'GSS-G6-PRECOMMIT-CALLBACK');
    }
  } finally {
    held.release(); reopened?.close(); unit.settings?.close(); unit.gymHost?.close(); unit.dom?.window.close();
  }
}

async function runG6NeutralRepaint(kind) {
  const unit = await device('g6-neutral-' + kind);
  const held = heldLogModel(unit, 'after-commit'), draft = newGymDraft();
  const readReached = deferred(), readRelease = deferred();
  let mounted = null, reopened = null, changed = 0;
  let readDelivered = false, lastMountedView = null, mountedReadCount = 0;
  try {
    const before = await collections(unit.gymHost.repository);
    const observedModel = Object.freeze({ ...held.model, read: async (...args) => {
      const view = await held.model.read(...args);
      mountedReadCount += 1;
      lastMountedView = copy(view);
      return view;
    } });
    let settings = unit.settings;
    const options = {};
    if (kind === 'settings-read') {
      settings = { latest: async (...args) => {
        const actual = await unit.settings.latest(...args);
        readReached.resolve(copy(actual));
        await readRelease.promise;
        readDelivered = true;
        return actual;
      }, save: (...args) => unit.settings.save(...args), close() {} };
      options.settings = settings;
      options.awaitSettingsRead = false;
    }
    mounted = await page(unit, observedModel, draft, () => {}, () => { changed += 1; }, options);
    const active = copy(lastMountedView);
    assert.equal(active?.phase, 'active', 'GSS-G6-NEUTRAL-INITIAL-VIEW-' + kind);
    const expected = { startId: active.startId, slot: active.set.slot, lift: active.set.lift,
      load: '45', reps: '11', effort: CHOICE.reserve };
    assert.equal(mounted.pick('[data-slot="settings-editor"]')?.hidden, true,
      'GSS-G6-NEUTRAL-EDITOR-OPEN-' + kind);
    if (kind === 'settings-read') {
      await within(readReached.promise, 'G6 neutral actual settings result held');
      assert.equal(readDelivered, false, 'GSS-G6-NEUTRAL-READ-EARLY');
      assert.equal(mounted.mounted.settings.stateFor(active.set.lift), 'reading',
        'GSS-G6-NEUTRAL-READ-NOT-PENDING');
    }
    mounted.input('#gym-weight', '45'); mounted.input('#gym-reps', '11'); mounted.chooseEffort();
    const capturedLog = mounted.pick('[data-slot="log"]');
    assert(capturedLog?.isConnected, 'GSS-G6-NEUTRAL-CAPTURED-LOG-MISSING-' + kind);
    capturedLog.click(); await within(held.reached, 'G6 neutral ' + kind);
    if (kind === 'why-toggle') {
      mounted.click('[data-action="why"]');
      await settle();
    } else {
      readRelease.resolve();
      await within(mounted.mounted.settings.read(), 'G6 neutral actual settings delivery');
      await settle();
      assert.equal(readDelivered, true, 'GSS-G6-NEUTRAL-READ-NOT-DELIVERED');
    }
    await until(() => lastMountedView?.phase === 'active'
      && lastMountedView.startId === expected.startId
      && lastMountedView.set?.lift === expected.lift
      && lastMountedView.set?.slot !== expected.slot
      && capturedLog.isConnected === false
      && mounted.pick('[data-slot="log"]')?.isConnected,
    'G6 neutral observed advanced repaint ' + kind);
    const advanced = copy(lastMountedView);
    assert.equal(advanced.phase, 'active', 'GSS-G6-NEUTRAL-NOT-ACTIVE-' + kind);
    assert.equal(advanced.startId, expected.startId, 'GSS-G6-NEUTRAL-WORKOUT-MOVED-' + kind);
    assert.equal(advanced.set.lift, expected.lift, 'GSS-G6-NEUTRAL-LIFT-MOVED-' + kind);
    assert.notEqual(advanced.set.slot, expected.slot, 'GSS-G6-NEUTRAL-SLOT-NOT-ADVANCED-' + kind);
    assert.equal(capturedLog.isConnected, false, 'GSS-G6-NEUTRAL-DOM-NOT-REPAINTED-' + kind);
    assert(mounted.pick('[data-slot="log"]')?.isConnected,
      'GSS-G6-NEUTRAL-ADVANCED-BINDING-MISSING-' + kind);
    held.release(); const envelope = await within(held.done, 'G6 neutral delivery'); await settle();
    assertTyped(envelope, 'GSS-G6-NEUTRAL-' + kind.toUpperCase());
    assert.equal(envelope.result.ok, true, 'GSS-G6-NEUTRAL-ACK-' + kind);
    const saved = /logged/.test(mounted.pick('[data-slot="saved-title"]')?.textContent || '');
    const undo = !!mounted.pick('[data-action="undo"]');
    const clearedEntry = copy(draft.entry), clearedEffort = copy(draft.effort);
    let nextActive = false, nextLoad = null, nextReps = null, nextPressed = [];
    let nextExpectedLoad = null, nextExpectedReps = null;
    if (saved && undo) {
      const readsBeforeNext = mountedReadCount;
      mounted.click('[data-slot="primary"]');
      await until(() => mountedReadCount > readsBeforeNext && mounted.pick('[data-slot="log"]'),
        'G6 neutral next active repaint');
      const nextView = copy(lastMountedView);
      assert.equal(nextView?.phase, 'active', 'GSS-G6-NEUTRAL-NEXT-VIEW-' + kind);
      assert.equal(nextView.startId, expected.startId, 'GSS-G6-NEUTRAL-NEXT-WORKOUT-' + kind);
      assert.equal(nextView.set.lift, expected.lift, 'GSS-G6-NEUTRAL-NEXT-LIFT-' + kind);
      assert.equal(nextView.set.slot, advanced.set.slot, 'GSS-G6-NEUTRAL-NEXT-SLOT-' + kind);
      assert.notEqual(nextView.set.slot, expected.slot, 'GSS-G6-NEUTRAL-NEXT-SLOT-STALE-' + kind);
      nextExpectedLoad = nextView.entry.load === null ? '' : String(nextView.entry.load);
      nextExpectedReps = nextView.entry.reps === null ? '' : String(nextView.entry.reps);
      assert.notEqual(nextExpectedLoad, expected.load, 'GSS-G6-NEUTRAL-NEXT-LOAD-FIXTURE-' + kind);
      assert.notEqual(nextExpectedReps, expected.reps, 'GSS-G6-NEUTRAL-NEXT-REPS-FIXTURE-' + kind);
      nextActive = true;
      nextLoad = mounted.pick('#gym-weight')?.value;
      nextReps = mounted.pick('#gym-reps')?.value;
      nextPressed = [...mounted.phone.querySelectorAll('[data-slot="choices"] button')]
        .filter((button) => button.getAttribute('aria-pressed') === 'true')
        .map((button) => button.textContent);
    }
    const closed = await closeAndRead(unit); reopened = closed.reopened;
    proveOneSet(before, closed.maps, held.submitted(), expected, envelope.result.opId);
    assert.equal(saved, true, 'GSS-G6-NEUTRAL-SAVED-SCREEN-' + kind);
    assert.equal(undo, true, 'GSS-G6-NEUTRAL-UNDO-' + kind);
    assert.deepEqual(clearedEntry, { load: null, reps: null },
      'GSS-G6-NEUTRAL-ENTRY-NOT-CLEARED-' + kind);
    assert.equal(clearedEffort, null, 'GSS-G6-NEUTRAL-EFFORT-NOT-CLEARED-' + kind);
    assert.equal(nextActive, true, 'GSS-G6-NEUTRAL-NEXT-CARD-MISSING-' + kind);
    assert.equal(nextLoad, nextExpectedLoad, 'GSS-G6-NEUTRAL-NEXT-LOAD-NOT-CLEARED-' + kind);
    assert.equal(nextReps, nextExpectedReps, 'GSS-G6-NEUTRAL-NEXT-REPS-NOT-CLEARED-' + kind);
    assert.deepEqual(nextPressed, [], 'GSS-G6-NEUTRAL-NEXT-EFFORT-NOT-CLEARED-' + kind);
    assert.equal(changed, 1, 'GSS-G6-NEUTRAL-ONCHANGED-' + kind);
  } finally {
    held.release(); readRelease.resolve(); reopened?.close(); unit.settings?.close();
    unit.gymHost?.close(); unit.dom?.window.close();
  }
}

async function runG7(mode, plant = false) {
  const unit = await device('g7-' + mode + '-' + (plant ? 'plant' : 'candidate'));
  const seam = mode === 'quota-after-repaint' || mode === 'clean-after-repaint'
    ? 'before-prepare' : mode === 'clean-before-commit' ? 'before-commit' : 'after-commit';
  const clean = mode.startsWith('clean-');
  const held = heldLogModel(unit, seam), draft = newGymDraft();
  let mounted = null, reopened = null, changed = 0;
  try {
    const before = await collections(unit.gymHost.repository);
    mounted = await page(unit, held.model, draft, () => {}, () => { changed += 1; });
    const active = await held.model.read();
    const expected = { startId: active.startId, slot: active.set.slot, lift: active.set.lift,
      load: '45', reps: '11', effort: CHOICE.reserve };
    mounted.input('#gym-weight', '45'); mounted.input('#gym-reps', '11'); mounted.chooseEffort();
    await mounted.openEditor();
    mounted.input('[data-settings-name="0"]', 'Seat');
    mounted.input('[data-settings-value="0"]', 'four');
    if (mode === 'quota-result-held') { unit.fault.state.armed = true; unit.fault.state.mode = 'quota'; }
    mounted.click('[data-slot="log"]'); const reached = await within(held.reached, 'G7 ' + mode);
    if (mode === 'quota-result-held') {
      assert.equal(reached.result?.acknowledged, false, 'GSS-G7-NOT-ACTUAL-REFUSAL');
      assert.equal(reached.result?.code, 'TRANSACTION_WRITE_FAILED', 'GSS-G7-RAW-QUOTA-CODE');
    }
    mounted.click('[data-action="settings-add"]');
    await until(() => mounted.pick('[data-settings-name="1"]'), 'G7 added row repaint');
    mounted.input('[data-settings-name="1"]', 'Pin'); mounted.input('[data-settings-value="1"]', '3');
    if (mode === 'quota-after-repaint') { unit.fault.state.armed = true; unit.fault.state.mode = 'quota'; }
    held.release(); const envelope = await within(held.done, 'G7 delivery'); await settle();
    unit.fault.state.armed = false; unit.fault.state.mode = null;
    assertTyped(envelope, 'GSS-G7-' + mode.toUpperCase());
    if (envelope.result.ok) {
      assert.match(mounted.pick('[data-slot="saved-title"]')?.textContent || '', /logged/,
        'GSS-G7-CLEAN-SAVED-SCREEN');
      assert(mounted.pick('[data-action="undo"]'), 'GSS-G7-CLEAN-UNDO');
      mounted.click('[data-slot="primary"]');
      await until(() => mounted.pick('[data-slot="log"]'), 'G7 clean next active repaint');
    }
    assert.deepEqual(editorRows(mounted), [{ name: 'Seat', value: 'four' }, { name: 'Pin', value: '3' }],
      'GSS-G7-ROWS-LOST-' + mode);
    if (!envelope.result.ok) {
      assert.deepEqual(draft.entry, { load: '45', reps: '11' }, 'GSS-G7-REFUSAL-ENTRY-' + mode);
      assert.deepEqual(draft.effort, { label: CHOICE.label, reserve: CHOICE.reserve },
        'GSS-G7-REFUSAL-EFFORT-' + mode);
      assert.equal(mounted.pick('#gym-weight')?.value, '45', 'GSS-G7-REFUSAL-DOM-LOAD-' + mode);
      assert.equal(mounted.pick('#gym-reps')?.value, '11', 'GSS-G7-REFUSAL-DOM-REPS-' + mode);
      const pressed = [...mounted.phone.querySelectorAll('[data-slot="choices"] button')]
        .find((button) => button.textContent === CHOICE.label);
      assert.equal(pressed?.getAttribute('aria-pressed'), 'true', 'GSS-G7-REFUSAL-DOM-EFFORT-' + mode);
    }
    if (clean && !envelope.result.ok) {
      assert.equal(envelope.result.code, 'WORKOUT_RESUME_REQUIRED', 'GSS-G7-CLEAN-REFUSAL-CODE');
      assert((mounted.pick('#gym-error')?.textContent || '').includes(envelope.result.code),
        'GSS-G7-CLEAN-CURRENT-CODE');
    }
    if (!clean) {
      assert.equal(envelope.result.ok, false, 'GSS-G7-QUOTA-FALSE-SUCCESS-' + mode);
      assert.equal(envelope.result.code, 'TRANSACTION_WRITE_FAILED', 'GSS-G7-QUOTA-CODE-' + mode);
      if (plant) mounted.pick('#gym-error').textContent = '';
      assert((mounted.pick('#gym-error')?.textContent || '').includes('TRANSACTION_WRITE_FAILED'),
        'GSS-G7-CURRENT-ERROR-' + mode);
    }
    mounted.click('[data-action="back"]'); await settle();
    const closed = await closeAndRead(unit); reopened = closed.reopened;
    if (envelope.result.ok) {
      proveOneSet(before, closed.maps, held.submitted(), expected, envelope.result.opId);
      assert.equal(changed, 1, 'GSS-G7-CLEAN-CALLBACK');
    } else {
      assert.deepEqual(closed.maps, before, 'GSS-G7-REFUSAL-WROTE-' + mode);
      assert.equal(changed, 0, 'GSS-G7-REFUSAL-CALLBACK-' + mode);
    }
  } finally {
    unit.fault.state.armed = false; held.release(); reopened?.close();
    unit.settings?.close(); unit.gymHost?.close(); unit.dom?.window.close();
  }
}

async function runG8(plant = false) {
  const unit = await device('g8-' + (plant ? 'plant' : 'candidate'));
  const held = heldLogModel(unit, 'after-commit'), draft = newGymDraft();
  const readReached = deferred(), readRelease = deferred();
  let mounted = null, reopened = null, changed = 0, ownedInsideBack = null;
  let readDelivered = false;
  try {
    const before = await collections(unit.gymHost.repository);
    const dom = new JSDOM(shell(), { url: 'http://127.0.0.1/' }); unit.dom = dom;
    const phone = dom.window.document.getElementById('phone');
    const settings = { latest: async (...args) => {
      const actual = await unit.settings.latest(...args);
      readReached.resolve(copy(actual));
      await readRelease.promise;
      readDelivered = true;
      return actual;
    }, save: (...args) => unit.settings.save(...args), close() {} };
    mounted = mountGym(dom.window.document, phone, { model: held.model, draft, settings,
      onChanged: () => { changed += 1; }, onBack: () => {
        ownedInsideBack = mounted.settings.owns();
        const destination = dom.window.document.createElement('section');
        destination.dataset.slot = 'g8-destination'; destination.textContent = 'SYNTHETIC_TODAY';
        phone.replaceChildren(destination);
      } });
    await within(mounted, 'G8 mount');
    const pick = (selector) => phone.querySelector(selector);
    const input = (selector, value) => { const control = pick(selector); assert(control); control.value = value;
      control.dispatchEvent(new dom.window.Event('input', { bubbles: true })); };
    input('#gym-weight', '45'); input('#gym-reps', '11');
    [...phone.querySelectorAll('[data-slot="choices"] button')].find((b) => b.textContent === CHOICE.label).click();
    const active = await held.model.read();
    const expected = { startId: active.startId, slot: active.set.slot, lift: active.set.lift,
      load: '45', reps: '11', effort: CHOICE.reserve };
    await within(readReached.promise, 'G8 actual settings result held');
    assert.equal(mounted.settings.stateFor(active.set.lift), 'reading', 'GSS-G8-READ-NOT-PENDING-BEFORE-LOG');
    assert.equal(readDelivered, false, 'GSS-G8-READ-DELIVERED-BEFORE-LOG');
    pick('[data-slot="log"]').click(); await within(held.reached, 'G8 actual acknowledgement');
    assert.equal(readDelivered, false, 'GSS-G8-READ-DELIVERED-BEFORE-BACK');
    pick('[data-action="back"]').click();
    assert.equal(ownedInsideBack, false, 'GSS-G8-OWNERSHIP-INSIDE-BACK');
    assert.equal(readDelivered, false, 'GSS-G8-READ-NOT-PENDING-AFTER-BACK');
    held.release(); const envelope = await within(held.done, 'G8 log delivery');
    readRelease.resolve(); await within(mounted.settings.read(), 'G8 actual optional read delivery'); await settle();
    assert.equal(readDelivered, true, 'GSS-G8-ACTUAL-READ-NOT-DELIVERED');
    if (plant) phone.textContent = 'PLANTED_RECLAIM';
    assert.equal(phone.querySelector('[data-slot="g8-destination"]')?.textContent, 'SYNTHETIC_TODAY',
      'GSS-G8-DESTINATION-LOST');
    assert.equal(mounted.settings.owns(), false, 'GSS-G8-OWNERSHIP-RETURNED');
    assertTyped(envelope, 'GSS-G8'); assert.equal(envelope.result.ok, true, 'GSS-G8-ACK-NOT-SUCCESS');
    const closed = await closeAndRead(unit); reopened = closed.reopened;
    proveOneSet(before, closed.maps, held.submitted(), expected, envelope.result.opId);
    assert.equal(changed, 0, 'GSS-G8-RETIRED-CALLBACK');
  } finally {
    held.release(); readRelease.resolve(); reopened?.close(); unit.settings?.close();
    unit.gymHost?.close(); unit.dom?.window.close();
  }
}

test('D-GSS-G6: held Log delivery preserves row add/edit through repaint', { timeout: 45000 }, async () => {
  await runG6('after-commit');
  await assert.rejects(runG6('after-commit', true), /GSS-G6-ROWS-LOST/);
  await runG6('before-commit');
});

test('D-GSS-NEUTRAL-REPAINT: Why toggle cannot strand a committed Log acknowledgement',
  { timeout: 30000 }, async () => {
    await runG6NeutralRepaint('why-toggle');
  });

test('D-GSS-NEUTRAL-REPAINT: settings-read repaint cannot strand a committed Log acknowledgement',
  { timeout: 30000 }, async () => {
    await runG6NeutralRepaint('settings-read');
  });

test('D-GSS-G7: actual quota result and post-repaint quota retain current state', { timeout: 60000 }, async () => {
  await assert.rejects(runG7('quota-result-held', true), /GSS-G7-CURRENT-ERROR/);
  await runG7('quota-result-held');
  await runG7('quota-after-repaint');
  await runG7('clean-after-repaint');
  await runG7('clean-before-commit');
});

test('D-GSS-G8: pending settings read plus actual Log plus Back is one owned journey',
  { timeout: 30000 }, async () => {
    await assert.rejects(runG8(true), /GSS-G8-DESTINATION-LOST/);
    await runG8(false);
  });
