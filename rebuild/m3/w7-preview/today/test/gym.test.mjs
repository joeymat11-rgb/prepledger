// A2 — the gym card, end to end over the REAL stack.
//
// Real here: the encrypted repository (AES-GCM over fake-indexeddb, the same
// storage the browser uses), the T2 stage over rebuild/client, the accepted
// durable public client, the v2 source-aware prescription capture, the accepted
// null-lane registrar and composite reader, the engine capture adapter, the
// engine history projector and the accepted prescription runtime — all of it
// composed by the ACCEPTED rebuild/m3/w6/host/workout-host.mjs, through the page's
// own gym-host.mjs. Nothing is stubbed; no second engine and no second capture
// path exists.
//
// Synthetic and labelled: the athlete (rebuild/m3/w7-preview/fixtures.cjs, the
// same invented athlete A1's Today uses), the device keys, the lease.
//
// This file needs rebuild/m3/w6's own dependencies (fake-indexeddb), exactly as
// package.test.cjs and browser-check.mjs already do.
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createGymHost, signRecord, LEASE_DOMAIN, AUTHORITY_KID } from '../gym-host.mjs';
import { createGymModel, EFFORT_CHOICES, effortWords, prescriptionLine, effortInstruction } from '../gym-model.mjs';
import { mountGym, NO_REST_PRESCRIBED } from '../gym-app.mjs';
import { createWorkoutEntry } from '../today-entry.mjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import Storage from '../web-storage-backend.cjs';
import design from '../design.cjs';
import EditValues from '../../../../m4/workout/edit-values.cjs';

const { createTodayModel, SYNTHETIC_DAY } = TodayModel;
const { createMemoryStorage } = Storage;
const DAY = SYNTHETIC_DAY;
const SLOT = 'earned-today-preview/' + DAY;

async function deviceKeys() {
  const pair = await webcrypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
  const jwk = await webcrypto.subtle.exportKey('jwk', pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  return { kid: AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, key_ops: ['verify'], ext: true } };
}

// One device: one IndexedDB factory and one set of device keys, reused across
// "relaunches" exactly as a real browser reuses its own storage and key store.
async function device(options = {}) {
  const fault = faultDatabase();
  const keys = await deviceKeys();
  const today = createTodayModel({ storage: createMemoryStorage() });
  const state = options.engineState || today.stateFromOps();
  async function open() {
    return createGymHost({ day: DAY, engineState: state, indexedDB: fault.indexedDB,
      crypto: webcrypto, deviceKeys: keys, plannedSplitSlotId: SLOT });
  }
  const gymHost = await open();
  return { fault, keys, today, state, gymHost, open,
    model: createGymModel({ gymHost, sessionTitle: today.read().workout.title }) };
}
const opsOf = async repository => Object.values((await repository.load()).generation.collections.ops || {});

const CHOSEN = EFFORT_CHOICES.find(c => c.label === '2').reserve;
const UNSURE = EFFORT_CHOICES.find(c => c.label === 'Unsure').reserve;

async function logCurrent(model, view, effort) {
  return model.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
    load: String(view.entry.load), reps: String(view.entry.reps), effort });
}
// Walk the whole session the way the screen does: log the active set, dismiss the
// saved/rest screen, repeat, until the session has no set left.
async function logEverySet(model, effort = CHOSEN) {
  for (let guard = 0; guard < 30; guard++) {
    const view = await model.read();
    if (view.phase === 'saved') {
      if (view.complete) return view;
      model.forget();
      continue;
    }
    if (view.phase !== 'active') return view;
    const result = await logCurrent(model, view, effort);
    assert(result.ok, 'set refused: ' + result.code);
    model.forget();
  }
  throw new Error('the session never completed');
}

test('A2 — the gym card journey, on the real stack', async t => {
  const kit = await device();
  const { model, gymHost } = kit;
  let startId = null, firstSetOp = null;

  await t.test('1. before a workout exists, the engine prescribes and nothing is stored', async () => {
    const before = await opsOf(gymHost.repository);
    assert.equal(before.length, 0);
    const view = await model.read();
    assert.equal(view.phase, 'ready', view.code || '');
    assert.equal(view.lift.count, 2, 'this athlete\'s own U day, two lifts');
    assert.equal(view.set.count, 2);
    assert.equal(view.prescription.line, '40 lb × 12 reps');
    assert.equal(view.prescription.effort, 'Aim to finish with 2 clean reps left.');
    assert.equal(view.entry.load, 40, 'the performed box opens at the prescribed load, editable');
    assert.equal(view.entry.reps, 12);
    assert.equal(view.entry.step, 5, 'the step is this exercise\'s own increment from the engine state');
    assert.deepEqual(await opsOf(gymHost.repository), before, 'reading a prescription stores nothing');
  });

  await t.test('2. every prescription figure is a capture cell, not arithmetic', async () => {
    const view = await model.read();
    const prepared = await gymHost.host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert(prepared.prepared, prepared.code);
    const slot = prepared.view.slots[0];
    assert.equal(view.prescription.line, prescriptionLine(slot));
    assert.equal(view.prescription.effort, effortInstruction(slot));
    assert.equal(view.prescription.line, slot.load.display + ' × ' + slot.reps.display + ' reps');
    assert.equal(JSON.parse(slot.effort.source_json).target, 2);
    // The reason on screen is the engine's own, line for line, never reworded.
    assert.deepEqual(view.prescription.reason, slot.reason.display.split('\n').filter(Boolean));
    assert.equal(view.prescription.setup, slot.setup.display);
  });

  await t.test('3. start — one durable Start operation carrying the capture', async () => {
    const started = await model.start();
    assert(started.ok, started.code);
    startId = started.opId;
    const ops = await opsOf(gymHost.repository);
    assert.equal(ops.filter(o => o.kind === 'session-start').length, 1);
    const start = ops.find(o => o.op_id === startId);
    assert.equal(start.prescription_capture.profile, 'earned/workout-prescription/v2');
    assert.equal(start.prescription_capture.slots.length, 4);
  });

  await t.test('4. the active set shows the stored prescription beside editable performed values', async () => {
    const view = await model.read();
    assert.equal(view.phase, 'active');
    assert.equal(view.lift.index, 1);
    assert.equal(view.set.position, 1);
    assert.deepEqual(view.strip.map(s => s.text), ['12 reps', '12 reps']);
    assert.equal(view.strip[0].current, true);
    assert.equal(view.strip[0].done, false);
    assert.equal(view.upNext.sameLift, true);
  });

  await t.test('5. an entry with no effort answer records NOTHING', async () => {
    const view = await model.read();
    const before = await opsOf(gymHost.repository);
    const result = await logCurrent(model, view, null);
    assert.equal(result.ok, false);
    assert.match(result.copy, /Choose clean reps left, or Unsure\./);
    assert.deepEqual(await opsOf(gymHost.repository), before, 'a refused set wrote nothing');
  });

  await t.test('6. an empty performed box records NOTHING', async () => {
    const view = await model.read();
    const before = await opsOf(gymHost.repository);
    for (const entry of [{ load: '', reps: '10' }, { load: '40', reps: '' }]) {
      const result = await model.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
        ...entry, effort: CHOSEN });
      assert.equal(result.ok, false);
      assert.match(result.copy, /Enter the weight and reps you actually completed\./);
    }
    assert.deepEqual(await opsOf(gymHost.repository), before);
  });

  await t.test('7. a load the accepted layer refuses is refused IN ITS OWN WORDS and stores nothing', async () => {
    const view = await model.read();
    const before = await opsOf(gymHost.repository);
    for (const bad of [{ load: '0', reps: '10' }, { load: '40', reps: '2.5' }, { load: '-5', reps: '10' }]) {
      const result = await model.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
        ...bad, effort: CHOSEN });
      assert.equal(result.ok, false, JSON.stringify(bad));
      assert(result.code, 'the refusal names the layer\'s own code: ' + JSON.stringify(result));
      assert.match(result.code, /WORKOUT_/);
      assert.deepEqual(await opsOf(gymHost.repository), before, 'a refused set wrote nothing: ' + JSON.stringify(bad));
    }
  });

  await t.test('8. log the first set with an explicit UNKNOWN effort — "unknown" is stored, never a number', async () => {
    const view = await model.read();
    const result = await model.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
      load: '45', reps: '11', effort: UNSURE });
    assert(result.ok, result.code);
    firstSetOp = result.opId;
    const op = (await opsOf(gymHost.repository)).find(o => o.op_id === firstSetOp);
    assert.deepEqual(op.payload.reserve, { tag: 'unknown' });
    assert.deepEqual(op.payload.load, { value: 45, unit: 'lb' });
    assert.deepEqual(op.payload.reps, { value: 11, unit: 'rep' });
    assert(!Object.hasOwn(op.payload.reserve, 'value'), 'an unknown effort carries no number');
  });

  await t.test('9. the saved-set screen shows exactly the stored facts, Undo, rest and the next set', async () => {
    const view = await model.read();
    assert.equal(view.phase, 'saved');
    assert.equal(view.saved.opId, firstSetOp);
    assert.equal(view.saved.position, 1);
    assert.equal(view.saved.facts, '45 lb × 11 reps · Effort unknown');
    assert.equal(view.next.sameLift, true);
    assert.equal(view.next.position, 2);
    assert.equal(view.next.count, 2);
    assert.equal(view.next.line, '40 lb × 12 reps');
    assert.equal(view.next.effort, 'Aim to finish with 0 clean reps left.',
      'the next set\'s effort target is the engine\'s own, not a repeat of the last one');
    // The saved facts are the STORED operation, read back through the client's projection.
    const op = (await opsOf(gymHost.repository)).find(o => o.op_id === firstSetOp);
    assert.equal(view.saved.facts, op.payload.load.value + ' lb × ' + op.payload.reps.value
      + ' reps · ' + effortWords(op.payload.reserve));
  });

  await t.test('10. Undo REMOVES the recorded set — it is not masked', async () => {
    const before = await opsOf(gymHost.repository);
    const undone = await model.undo({ startId, opId: firstSetOp });
    assert(undone.ok, undone.code);
    const after = await opsOf(gymHost.repository);
    assert.equal(after.length, before.length + 1, 'the removal is itself a durable operation');
    assert.equal(after.find(o => o.op_id === undone.opId).kind, 'tombstone');
    assert.equal(after.find(o => o.op_id === undone.opId).target_op_id, firstSetOp);
    // The client's OWN projection no longer includes the fact.
    const history = await gymHost.host.client.readWorkoutHistory();
    const fact = history.history.sessions[0].projection.facts.find(f => f.source_op_id === firstSetOp);
    assert.equal(fact.included, false, 'the removed set is not included in any projection');
    // And the layer's own continuation view has no completion in that slot.
    const resumed = await gymHost.host.client.prepareWorkoutContinuation({ session_start_op_id: startId });
    assert.equal(resumed.view.slots.filter(s => s.completion).length, 0);
    const view = await model.read();
    assert.equal(view.phase, 'active', 'the screen is back on the set that was undone');
    assert.equal(view.set.position, 1);
    assert.equal(view.strip[0].done, false);
  });

  await t.test('11. log every set, then finish', async () => {
    const view = await logEverySet(model);
    assert.equal(view.phase, 'saved');
    assert.equal(view.next, null, 'no next set remains');
    assert.equal(view.complete, true);
    const finished = await model.finish({ startId: view.startId });
    assert(finished.ok, finished.code);
    const ops = await opsOf(gymHost.repository);
    assert.equal(ops.filter(o => o.kind === 'session-close').length, 1);
    assert.equal(ops.find(o => o.kind === 'session-close').payload.completion_kind, 'normal');
  });

  await t.test('12. Today reflects the finished workout, and it survives a relaunch', async () => {
    const view = await model.read();
    assert.equal(view.phase, 'finished');
    assert.equal(view.sets, 4);
    gymHost.close();
    const reopened = await kit.open();
    const again = createGymModel({ gymHost: reopened, sessionTitle: kit.today.read().workout.title });
    const after = await again.read();
    assert.equal(after.phase, 'finished');
    assert.equal(after.sets, 4);
    // A second workout on the same day is refused by the accepted layer, in its
    // own words, and stores nothing. (The seam: rebuild/engine/performed.cjs needs
    // a native trend context this host does not compose — A0 §8.5.)
    const prepared = await reopened.host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert.notEqual(prepared.prepared, true);
    assert.equal(prepared.code, 'WORKOUT_PREPARATION_INVALID');
    reopened.close();
  });
});

test('A2 — resume, relaunch and a process kill', async t => {
  const kit = await device();
  const { model, gymHost } = kit;

  const started = await model.start();
  assert(started.ok, started.code);
  const first = await model.read();
  const logged = await logCurrent(model, first, CHOSEN);
  assert(logged.ok, logged.code);

  await t.test('an in-progress workout is resumable and the original instructions are unchanged', async () => {
    const before = JSON.stringify((await opsOf(gymHost.repository)).find(o => o.op_id === started.opId));
    gymHost.close();                                     // the process is gone
    const reopened = await kit.open();                   // a new launch over the same store
    const again = createGymModel({ gymHost: reopened, sessionTitle: kit.today.read().workout.title });
    const view = await again.read();
    assert.equal(view.phase, 'active', view.code || '');
    assert.equal(view.done, 1, 'the recorded set came back');
    assert.equal(view.set.position, 2, 'the session resumes at the next set, not the first');
    assert.equal(view.strip[0].done, true);
    assert.equal(view.strip[0].text, first.entry.reps + ' logged');
    assert.equal(JSON.stringify((await opsOf(reopened.repository)).find(o => o.op_id === started.opId)), before,
      'the instructions the athlete started with are byte-identical after the relaunch');
    assert.equal((await opsOf(reopened.repository)).filter(o => o.kind === 'session-start').length, 1,
      'resuming creates no second Start');
    reopened.close();
  });
});

test('A2 — the refusals the capture layer owns', async t => {
  await t.test('a split that is not in force today is refused and stores nothing', async () => {
    const base = createTodayModel({ storage: createMemoryStorage() }).stateFromOps();
    const future = JSON.parse(JSON.stringify(base));
    future.split = [{ from: '2031-01-01', map: base.split[0].map }];
    const kit = await device({ engineState: future });
    const before = await opsOf(kit.gymHost.repository);
    const view = await kit.model.read();
    assert.equal(view.phase, 'blocked');
    assert.equal(view.code, 'WORKOUT_SPLIT_NOT_IN_FORCE');
    assert.deepEqual(await opsOf(kit.gymHost.repository), before, 'the refusal stored nothing');
    kit.gymHost.close();
  });

  await t.test('a second Start while one workout is open is refused and stores nothing', async () => {
    const kit = await device();
    const started = await kit.model.start();
    assert(started.ok, started.code);
    const before = await opsOf(kit.gymHost.repository);
    const prepared = await kit.gymHost.host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert.notEqual(prepared.prepared, true);
    assert.equal(prepared.code, 'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');
    assert.deepEqual(await opsOf(kit.gymHost.repository), before);
    kit.gymHost.close();
  });

  await t.test('a storage fault during a set is reported, and nothing is recorded', async () => {
    const kit = await device();
    const started = await kit.model.start();
    assert(started.ok, started.code);
    const before = await opsOf(kit.gymHost.repository);
    const view = await kit.model.read();
    kit.fault.state.armed = true;
    kit.fault.state.mode = 'quota';
    const result = await logCurrent(kit.model, view, CHOSEN);
    kit.fault.state.armed = false;
    assert.equal(result.ok, false);
    assert(result.code, 'a storage fault names a code');
    assert.deepEqual(await opsOf(kit.gymHost.repository), before, 'nothing survived the fault');
    kit.gymHost.close();
  });
});

test('A2 — the effort domain is the accepted one, and nothing is preselected', async () => {
  assert.equal(EFFORT_CHOICES.length, 5);
  for (const choice of EFFORT_CHOICES) assert(EditValues.reserve(choice.reserve), choice.label);
  // The domain really is closed: an effort this screen does NOT offer is refused.
  for (const outside of [{ tag: 'exact', value: 3, unit: 'rep' }, { tag: 'at_least', value: 2, unit: 'rep' },
    { tag: 'exact', value: 5, unit: 'rep' }, { tag: 'guessed' }]) {
    assert(!EditValues.reserve(outside), JSON.stringify(outside));
  }
  assert.deepEqual(EFFORT_CHOICES.map(c => c.label), ['0', '1', '2', '3+', 'Unsure']);
  assert.deepEqual(EFFORT_CHOICES[4].reserve, { tag: 'unknown' });
  assert.equal(effortWords({ tag: 'unknown' }), 'Effort unknown');
  assert.equal(effortWords({ tag: 'exact', value: 2, unit: 'rep' }), '2 clean reps left');
  assert.equal(effortWords({ tag: 'at_least', value: 3, unit: 'rep' }), '3+ clean reps left');
});

test('A2 — previous performance is the engine\'s own, or nothing at all', async t => {
  await t.test('with no qualified comparison the screen shows none', async () => {
    const kit = await device();
    const view = await kit.model.read();
    // This synthetic athlete's own governing metadata does exist (a legacy session
    // log); what matters is that the line is the engine's value, never a guess.
    const prev = kit.model.previous().get(view.set.lift);
    if (prev === null || prev === undefined) assert.equal(view.previous, null);
    else assert.equal(view.previous, 'Last time: ' + prev.w + ' lb × ' + prev.reps[0]);
    kit.gymHost.close();
  });

  await t.test('an athlete the engine has no comparison for shows no previous line', async () => {
    const base = createTodayModel({ storage: createMemoryStorage() }).stateFromOps();
    const fresh = JSON.parse(JSON.stringify(base));
    fresh.sessionLog = {};
    for (const exercise of fresh.exercises) delete exercise.last;
    const kit = await device({ engineState: fresh });
    const view = await kit.model.read();
    assert.equal(kit.model.previous().get(view.set.lift) || null, null);
    assert.equal(view.previous, null, 'no previous performance is invented');
    kit.gymHost.close();
  });
});

test('A2 — the gym screens render the capture, with nothing preselected', async t => {
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const phone = doc.getElementById('phone');
  const kit = await device();
  await kit.model.start();
  await mountGym(doc, phone, { model: kit.model, onBack: () => {} });

  await t.test('the active-set screen is Refinement A, bound to the capture', async () => {
    const view = await kit.model.read();
    const slot = name => doc.querySelector(`[data-slot="${name}"]`);
    assert.equal(slot('plan').textContent, view.prescription.line);
    assert.equal(slot('effort-target').textContent, view.prescription.effort);
    assert.equal(slot('entry-title').textContent, 'What you did · Set 1');
    assert.equal(doc.getElementById('gym-weight').value, String(view.entry.load));
    assert.equal(doc.getElementById('gym-reps').value, String(view.entry.reps));
    const choices = [...doc.querySelectorAll('.choice')];
    assert.equal(choices.length, 5);
    for (const choice of choices) assert.equal(choice.getAttribute('aria-pressed'), 'false',
      'no effort answer is preselected');
    assert.deepEqual(choices.map(c => c.textContent), ['0', '1', '2', '3+', 'Unsure']);
    assert.equal(doc.querySelectorAll('.slot').length, 2);
    assert.equal(slot('log-label').textContent, 'Log set 1');
  });

  await t.test('the log button refuses without an effort answer, in the approved words', async () => {
    doc.querySelector('[data-slot="log"]').click();
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.match(doc.getElementById('gym-error').textContent, /Choose clean reps left, or Unsure\./);
  });

  await t.test('choosing an effort, then logging, lands on the saved-set screen', async () => {
    [...doc.querySelectorAll('.choice')].find(c => c.textContent === '2').click();
    doc.querySelector('[data-slot="log"]').click();
    await new Promise(resolve => setTimeout(resolve, 60));
    const view = await kit.model.read();
    assert.equal(view.phase, 'saved');
    assert.equal(doc.querySelector('[data-slot="saved-facts"]').textContent, view.saved.facts);
    assert.equal(doc.querySelector('[data-slot="saved-title"]').textContent, 'Set 1 logged');
    assert(doc.querySelector('[data-action="undo"]'), 'Undo is on the saved screen');
    assert.equal(doc.querySelector('[data-slot="rest-note"]').textContent, NO_REST_PRESCRIBED);
    assert.equal(doc.querySelector('[data-slot="next-plan"]').textContent, view.next.line);
    assert.equal(doc.querySelector('[data-slot="primary-label"]').textContent, 'Ready for set 2');
  });

  await t.test('no figure appears on either gym screen that the layer did not supply', async () => {
    const view = await kit.model.read();
    const clone = phone.cloneNode(true);
    for (const bound of clone.querySelectorAll('[data-slot]')) bound.textContent = '';
    assert.doesNotMatch(clone.textContent, /\d/,
      'a figure survived outside a bound slot: ' + clone.textContent.replace(/\s+/g, ' ').trim());
    void view;
  });

  kit.gymHost.close();
});

test('A2 — Today reflects the durable workout state', async t => {
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const fault = faultDatabase();
  const keys = await deviceKeys();
  const today = createTodayModel({ storage: createMemoryStorage() });
  const workout = await createWorkoutEntry(today, { indexedDB: fault.indexedDB, crypto: webcrypto, deviceKeys: keys });
  const api = TodayApp.mountToday(doc, today, { workout });
  const slot = name => doc.querySelector(`[data-slot="${name}"]`);

  await t.test('with no workout started, Today offers Start once the morning is recorded', () => {
    // Before the weigh-in the single primary action is the engine's marching order
    // (A1's accepted hierarchy); the workout entry point opens after it.
    assert.match(slot('primary-label').textContent, /^Log the scale$/i);
    today.weighIn(179.4);
    api.render('today');
    assert.match(slot('workout-count').textContent, /Your set targets are ready$/);
    assert.match(slot('primary-label').textContent, /^Start /);
  });

  await t.test('with one in progress, Today offers Resume and says so', async () => {
    await workout.gym.start();
    await workout.refresh();
    api.render('today');
    assert.match(slot('workout-count').textContent, new RegExp(TodayApp.WORKOUT_IN_PROGRESS + '$'));
    assert.match(slot('primary-label').textContent, /^Resume /);
    // The workout is wired now: neither the training line nor the primary action
    // may carry A1's unwired marker.
    assert(!slot('workout-count').textContent.includes(TodayApp.NOT_WIRED));
    assert(!slot('primary-label').textContent.includes(TodayApp.NOT_WIRED));
    assert.equal(doc.querySelectorAll('.training [data-slot="workout-count"]').length, 1);
  });

  await t.test('a workout in progress keeps its resume action even with the morning owed', async () => {
    // The unfinished session must never become unreachable. This state cannot be
    // reached through the UI (the workout opens only after a weigh-in), so it is
    // constructed here from the same durable log with a fresh Today store.
    const owed = createTodayModel({ storage: createMemoryStorage() });
    const other = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
      { url: 'http://127.0.0.1:4178/' }).window.document;
    TodayApp.mountToday(other, owed, { workout });
    assert.equal(owed.read().hasReadToday, false, 'the morning really is owed here');
    assert.match(other.querySelector('[data-slot="primary-label"]').textContent, /^Resume /);
  });

  await t.test('with it finished, Today says it is recorded and offers a review', async () => {
    const last = await logEverySet(workout.gym);
    const finished = await workout.gym.finish({ startId: last.startId });
    assert(finished.ok, finished.code);
    await workout.refresh();
    api.render('today');
    assert.match(slot('workout-count').textContent, new RegExp(TodayApp.WORKOUT_RECORDED_TODAY + '$'));
    assert.equal(slot('primary-label').textContent, TodayApp.REVIEW_WORKOUT);
    assert.doesNotMatch(doc.getElementById('phone').textContent, /135 lb|9 reps/, 'no prototype figure');
  });

  workout.gymHost.close();
});
