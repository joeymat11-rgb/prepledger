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
// Synthetic and labelled: the athlete only (rebuild/m3/w7-preview/fixtures.cjs,
// the same invented athlete A1's Today uses). C4b removed the rest: the device
// keys, the lease and the enrolment are this installation's own local era now,
// and nothing in the page mints any of them.
//
// This file needs rebuild/m3/w6's own dependencies (fake-indexeddb), exactly as
// package.test.cjs and browser-check.mjs already do.
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createGymHost, causalTips, startOrderRefusalOf } from '../gym-host.mjs';
import { createGymModel, EFFORT_CHOICES, effortWords, prescriptionLine, effortInstruction } from '../gym-model.mjs';
import { mountGym, NO_REST_PRESCRIBED, COULD_NOT_PREPARE } from '../gym-app.mjs';
import { createWorkoutEntry } from '../today-entry.mjs';
import { createReadingHost } from '../reading-host.mjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import design from '../design.cjs';
import EditValues from '../../../../m4/workout/edit-values.cjs';

const { createTodayModel, SYNTHETIC_DAY } = TodayModel;
const DAY = SYNTHETIC_DAY;
const SLOT = 'earned-today-preview/' + DAY;

// One device: one IndexedDB factory, which is one installation of the local era,
// reused across "relaunches" exactly as a real browser reuses its own storage
// and key custody. No key is minted here — the page does not take one.
async function device(options = {}) {
  const fault = faultDatabase();
  const today = createTodayModel({});
  const state = options.engineState || today.stateFromOps();
  async function open() {
    return createGymHost({ day: DAY, engineState: state, indexedDB: fault.indexedDB,
      crypto: webcrypto, plannedSplitSlotId: SLOT });
  }
  const gymHost = await open();
  return { fault, today, state, gymHost, open,
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
    const base = createTodayModel({}).stateFromOps();
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
    const base = createTodayModel({}).stateFromOps();
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

  /* REVIEW B1 — a refusal that came from the accepted layer is shown in the layer's
     own terms, with the code exactly once, and is NEVER described as a fault of this
     device. The device sentence belongs only to a page that has no workout host. */
  await t.test('a layer refusal on the gym screen names the layer, not the device', async () => {
    const base = createTodayModel({}).stateFromOps();
    const future = JSON.parse(JSON.stringify(base));
    future.split = [{ from: '2031-01-01', map: base.split[0].map }];
    const blocked = await device({ engineState: future });
    const other = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
      { url: 'http://127.0.0.1:4178/' }).window.document;
    await mountGym(other, other.getElementById('phone'), { model: blocked.model, onBack: () => {} });
    const shown = other.getElementById('phone').textContent;
    assert(shown.includes(COULD_NOT_PREPARE), 'the neutral lead is shown: ' + shown);
    assert(!shown.includes(TodayApp.NO_LOCAL_STORE), 'an engine refusal never blames the device: ' + shown);
    assert.equal(shown.split('WORKOUT_SPLIT_NOT_IN_FORCE').length, 2, 'the code appears exactly once: ' + shown);
    assert(shown.includes('no split entry has from <='), 'and the layer\'s own reason is carried');
    assert.doesNotMatch(shown.replace(/\d{4}-\d{2}-\d{2}/g, ''), /\d/,
      'a refusal screen shows no prescription figure');
    blocked.gymHost.close();
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
  const readings = await createReadingHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  const today = createTodayModel({ today: DAY, readings });
  /* C4b — ONE STORE: the reading host and the workout entry open the SAME
     installation, so this is the whole screen over one sealed generation. */
  const workout = await createWorkoutEntry(today, { indexedDB: fault.indexedDB, crypto: webcrypto });
  assert.equal(workout.gymHost.repository, readings.repository, 'one repository handle');
  const api = TodayApp.mountToday(doc, today, { workout });
  const slot = name => doc.querySelector(`[data-slot="${name}"]`);

  await t.test('with no workout started, Today offers Start once the morning is recorded', async () => {
    // Before the weigh-in the single primary action is the engine's marching order
    // (A1's accepted hierarchy); the workout entry point opens after it.
    assert.match(slot('primary-label').textContent, /^Log the scale$/i);
    assert((await today.weighIn(179.4)).ok);
    api.render('today');
    assert.match(slot('workout-count').textContent, /Your set targets are ready$/);
    assert.match(slot('primary-label').textContent, /^Start /);
  });

  await t.test('with one in progress, Today offers Resume and says so', async () => {
    /* C4b — ONE STORE. The preparation this entry took at construction was
       resolved BEFORE the weigh-in, and one store means the weigh-in moved the
       generation, so that preparation is stale and is refused BY NAME. The
       shipped screen re-prepares before every Start (gym-app.mjs paint() calls
       model.read()); this line is that re-preparation, stated. */
    const stale = await workout.gym.start();
    assert.equal(stale.ok, false, 'a preparation taken before the weigh-in is stale');
    assert.equal(stale.code, 'WORKOUT_PREPARATION_STALE', JSON.stringify(stale));
    await workout.refresh();
    const started = await workout.gym.start();
    assert.equal(started.ok, true, started.code);
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
    const owed = createTodayModel({});
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
  readings.close();
});

/* ---------------------------------------------------------------------------
   REVIEW B1 — WHEN THE ACCEPTED LAYER WILL PREPARE A WORKOUT, AND WHEN IT WILL NOT.
   Executed, not argued. These tests record the boundary A2 actually sits on, so
   §9.1 of the report cannot drift from it.
   --------------------------------------------------------------------------- */
async function lane(state, label) {
  const fault = faultDatabase();
  /* on(day) is A PAGE LOAD: a brand new host over the SAME device storage and the
     SAME key custody, exactly as reopening the app builds a new host over the
     IndexedDB that is already there. Nothing is carried in memory between these. */
  async function on(day) {
    const host = await createGymHost({ day, engineState: state, indexedDB: fault.indexedDB, crypto: webcrypto,
      plannedSplitSlotId: 'slot', databaseName: 'probe-' + label });
    return { host, model: createGymModel({ gymHost: host, sessionTitle: 'T' }) };
  }
  return { on, fault };
}
const opCount = async host => Object.keys((await host.repository.load()).generation.collections.ops || {}).length;
const opsIn = async host => (await host.repository.load()).generation.collections.ops || {};

/* Conduct one whole training day through the screen's own actions, on a host
   that was created fresh for this day: probe, Start, every set, Finish. Returns
   what the layer did at each step so a test can assert on it rather than on a
   phase alone. */
async function conductDay(handle, { expect = 'recorded' } = {}) {
  const before = await opCount(handle.host);
  const probe = await handle.model.read();
  if (probe.phase !== 'ready') return { probe: probe.phase, code: probe.code, copy: probe.copy, before, after: before };
  const started = await handle.model.start();
  if (!started.ok) return { probe: probe.phase, startRefused: started.code, before, after: await opCount(handle.host) };
  const afterStart = await handle.model.read();
  const last = await logEverySet(handle.model);
  const closed = await handle.model.finish({ startId: last.startId });
  const settled = await handle.model.read();
  const result = { probe: probe.phase, startOp: started.opId, phaseAfterStart: afterStart.phase,
    sets: last.total, closed: closed.ok, closeCode: closed.code || null, settled: settled.phase,
    before, after: await opCount(handle.host) };
  if (expect === 'recorded') {
    assert.equal(result.phaseAfterStart, 'active', 'a written Start must leave the screen usable');
    assert.equal(result.closed, true, 'the session must close: ' + result.closeCode);
    assert.equal(result.settled, 'finished');
  }
  return result;
}
const offsetDay = (day, days) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

/* REVIEW ROUND 2 — the headline finding. The athlete does not live inside one
   page load. These tests CONDUCT consecutive training days, each on its own new
   host over the same storage, and assert what the layer did: the op count, the
   phase after a written Start, and that Finish succeeded. A probe alone proves
   nothing — round 1's suite was green while day 2 stranded the athlete. */
test('A2 — a FRESH athlete (DECISIONS:100, Joe at S2) trains day after day, each day on a NEW page load', async t => {
  const fresh = createTodayModel({}).stateFromOps();
  fresh.sessionLog = {};
  const L = await lane(fresh, 'fresh');
  let firstClose = null;

  let handle = await L.on(DAY);
  await t.test('day 1 — prepared, started, every set recorded, closed', async () => {
    const done = await conductDay(handle);
    assert.equal(done.probe, 'ready');
    assert.equal(done.before, 0);
    assert.equal(done.after, 6, 'one Start, four sets and one close');
    const ops = await opsIn(handle.host);
    const close = Object.values(ops).find(op => op.kind === 'session-close');
    firstClose = close.op_id;
    assert.deepEqual(Object.values(ops).find(op => op.kind === 'session-start').causal_parents, [],
      'the first session in an empty log descends from nothing');
  });
  handle.host.close();

  await t.test('day 2 — a NEW page load: prepared, started, recorded, closed, and it descends from day 1', async () => {
    handle = await L.on(offsetDay(DAY, 1));
    /* The defect this replaces: a new host began from an empty causal frontier,
       so this Start did not descend from day 1's close. Two concurrent Starts
       are unorderable (WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED) and, once one
       is on disk, every later read refuses WORKOUT_HISTORY_RECONCILIATION_REQUIRED
       forever. The parents are now DERIVED from the stored log on every
       resolution, so a page load cannot lose them. */
    const done = await conductDay(handle);
    assert.equal(done.probe, 'ready');
    assert.equal(done.before, 6);
    assert.equal(done.after, 12, 'a second whole session really is on disk');
    const ops = await opsIn(handle.host);
    const start = Object.values(ops).find(op => op.kind === 'session-start' && op.op_id === done.startOp);
    assert.deepEqual(start.causal_parents, [firstClose],
      'day 2 descends from day 1\'s close, read off the log and not remembered');
    handle.host.close();
  });

  await t.test('day 3 — a rest day is not a refusal: the engine schedules no session', async () => {
    handle = await L.on(offsetDay(DAY, 2));
    const view = await handle.model.read();
    assert.equal(view.phase, 'blocked');
    assert.equal(view.code, 'ENGINE_CAPTURE_NO_WORKOUT');
    assert.equal(await opCount(handle.host), 12, 'a rest day writes nothing');
    handle.host.close();
  });

  /* THE FIRST GENUINE ENGINE WALL, and the day it bites. Days 1 and 2 are this
     athlete's two distinct training days; day 4 comes back to day 1's lifts, and
     the engine then needs the numeric native trend context no accepted host
     composes. It is an engine-tier provider gap, for Track B — not a screen's. */
  await t.test('day 4 — the first wall: PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED, and nothing is written', async () => {
    handle = await L.on(offsetDay(DAY, 3));
    const view = await handle.model.read();
    assert.equal(view.phase, 'blocked');
    assert.equal(view.code, 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
    assert.equal(view.copy, 'resolver_failed', 'the layer\'s own reason, and no invented sentence');
    assert.notEqual(view.copy, view.code, 'a refusal never prints its code twice');
    const refused = await handle.model.start();
    assert.equal(refused.ok, false, 'Start is refused, not offered');
    assert.equal(await opCount(handle.host), 12, 'a refused day writes NOTHING');
    handle.host.close();
  });

  await t.test('every day after the wall stays readable — the log is never poisoned', async () => {
    for (const offset of [4, 5, 6, 7, 10, 14]) {
      handle = await L.on(offsetDay(DAY, offset));
      const view = await handle.model.read();
      assert.equal(view.phase, 'blocked', 'day+' + offset);
      assert(['ENGINE_CAPTURE_NO_WORKOUT', 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'].includes(view.code),
        'day+' + offset + ' refuses for an ENGINE reason, never a poisoned local order: ' + view.code);
      const read = await handle.host.host.client.readWorkoutHistory();
      assert.equal(read.read, true, 'the durable history still reads on day+' + offset);
      assert.equal(read.history.sessions.length, 2, 'both recorded sessions are still there');
      assert.equal(await opCount(handle.host), 12);
      handle.host.close();
    }
  });

  await t.test('a SECOND session on the same day is refused, with the layer\'s own code', async () => {
    handle = await L.on(DAY);
    const view = await handle.model.read();
    // The day's session is closed, so the screen reports it as recorded rather
    // than offering a Start that the layer would refuse.
    assert.equal(view.phase, 'finished');
    const prepared = await handle.host.host.client.prepareWorkout({ planned_split_slot_id: 'slot' });
    assert.notEqual(prepared.prepared, true);
    assert.equal(handle.host.host.lastProducerRefusal().code, 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
    assert.equal(handle.host.host.lastProducerRefusal().reason, 'resolver_failed');
    handle.host.close();
  });
});

/* REVIEW ROUND 2, point 3 — the OTHER way a written Start strands the athlete, and
   the accepted path out of it. A session abandoned mid-way blocks every later day in
   the accepted client; A2 now names it and offers the layer's own `early` close. */
test('A2 — a session abandoned on an earlier day is named, and the accepted close retires it', async t => {
  const fresh = createTodayModel({}).stateFromOps();
  fresh.sessionLog = {};
  const L = await lane(fresh, 'abandoned');
  const hostForDay = async (other) => (await L.on(other)).host;

  let handle = await L.on(DAY);
  let startId = null;
  await t.test('day 1 — start, log one set, and walk away', async () => {
    const started = await handle.model.start();
    assert.equal(started.ok, true);
    startId = started.opId;
    const view = await handle.model.read();
    const logged = await handle.model.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
      load: String(view.entry.load), reps: String(view.entry.reps), effort: CHOSEN });
    assert.equal(logged.ok, true);
    assert.equal(await opCount(handle.host), 2, 'a Start and one set, and no close');
  });
  handle.host.close();

  await t.test('the next day says WHICH day is unfinished, and offers the close', async () => {
    handle = await L.on(offsetDay(DAY, 1));
    const model = createGymModel({ gymHost: handle.host, hostForDay, sessionTitle: 'T' });
    const view = await model.read();
    assert.equal(view.phase, 'unfinished', view.code || '');
    assert.equal(view.code, 'WORKOUT_HISTORY_RECONCILIATION_REQUIRED',
      'the layer\'s own code is still reported beside it');
    assert.equal(view.unfinished.day, DAY, 'the day named is the session\'s own');
    assert.equal(view.unfinished.startId, startId);
    assert.equal(view.unfinished.sets, 1, 'and how much of it was recorded');
    assert.equal(await opCount(handle.host), 2, 'naming it writes nothing');
  });

  await t.test('the close writes ONE operation, keeps the recorded set, and unblocks today', async () => {
    const model = createGymModel({ gymHost: handle.host, hostForDay, sessionTitle: 'T' });
    const stale = (await model.read()).unfinished;
    const closed = await model.closeUnfinished(stale);
    assert.equal(closed.ok, true, closed.code || '');
    assert.equal(await opCount(handle.host), 3, 'exactly one close operation, and no deletion');
    const ops = await opsIn(handle.host);
    const close = ops[closed.opId];
    assert.equal(close.kind, 'session-close');
    assert.equal(close.payload.completion_kind, 'early',
      'the layer\'s own kind for a session that did not finish');
    assert.deepEqual(close.causal_parents.slice(0, 1), [startId]);
    const read = await handle.host.host.client.readWorkoutHistory();
    assert.equal(read.read, true);
    assert.equal(read.history.sessions[0].projection.facts.filter(f => f.included === true).length, 1,
      'the set the athlete actually did is still recorded');
    const after = await model.read();
    assert.equal(after.phase, 'ready', 'and today can now be started: ' + (after.code || ''));
  });

  /* A recovery that reports success on a write the layer refused would be the same
     class of lie as B2-M12's optimistic weigh-in, and it is the one write on this
     path, so it is exercised directly: a storage fault during the close. */
  await t.test('a recovery the layer refuses is reported as refused, and records nothing', async () => {
    const own = await lane(fresh, 'abandoned-fault');
    const ownHostForDay = async (other) => (await own.on(other)).host;
    let h = await own.on(DAY);
    assert.equal((await h.model.start()).ok, true);
    const stale = { startId: (await opsIn(h.host)) && Object.values(await opsIn(h.host))
      .find(op => op.kind === 'session-start').op_id, day: DAY };
    h.host.close();

    h = await own.on(offsetDay(DAY, 1));
    const model = createGymModel({ gymHost: h.host, hostForDay: ownHostForDay, sessionTitle: 'T' });
    const before = await opCount(h.host);
    own.fault.state.armed = true;
    own.fault.state.mode = 'quota';
    const refused = await model.closeUnfinished(stale);
    own.fault.state.armed = false;
    assert.equal(refused.ok, false, 'a refused close is never reported as done');
    assert(refused.code, 'and it names the layer\'s own code');
    assert.equal(await opCount(h.host), before, 'nothing survived the fault');
    h.host.close();
  });

  await t.test('with no way to reach that day, the recovery says so and writes nothing', async () => {
    const model = createGymModel({ gymHost: handle.host, sessionTitle: 'T' });   // no hostForDay
    const before = await opCount(handle.host);
    const refused = await model.closeUnfinished({ startId, day: DAY });
    assert.equal(refused.ok, false);
    assert.equal(refused.code, 'WORKOUT_RECOVERY_UNAVAILABLE');
    assert.equal(await opCount(handle.host), before);
  });
  handle.host.close();
});

/* REVIEW ROUND 2, points 1-3 — the causal frontier itself. */
test('A2 — the causal frontier is DERIVED from the durable log, never remembered', async t => {
  const fresh = createTodayModel({}).stateFromOps();
  fresh.sessionLog = {};
  const L = await lane(fresh, 'frontier');

  let handle = await L.on(DAY);
  await t.test('an empty store has no tip, and the first Start claims none', async () => {
    assert.deepEqual(await handle.host.causalTipsNow(), []);
    assert.equal(await handle.host.startOrderRefusal(), null);
    await conductDay(handle);
  });
  const closeId = Object.values(await opsIn(handle.host)).find(op => op.kind === 'session-close').op_id;
  handle.host.close();

  await t.test('a host that has written nothing still reports the stored tip immediately', async () => {
    handle = await L.on(offsetDay(DAY, 1));
    assert.deepEqual(await handle.host.causalTipsNow(), [closeId],
      'the tip comes off the log at once, before this host has resolved anything');
    assert.equal(handle.host.causalParents().length, 0, 'and nothing was resolved merely by opening');
    handle.host.close();
  });

  await t.test('the probe and Start resolve the SAME parents over the SAME generation', async () => {
    handle = await L.on(offsetDay(DAY, 1));
    const probe = await handle.model.read();
    assert.equal(probe.phase, 'ready');
    const atProbe = handle.host.causalParents();
    assert.deepEqual(atProbe, [closeId]);
    const started = await handle.model.start();
    assert.equal(started.ok, true);
    const ops = await opsIn(handle.host);
    assert.deepEqual(ops[started.opId].causal_parents, atProbe,
      'what the probe resolved is exactly what was written');
    handle.host.close();
  });

  /* The guard itself, over generations written by hand, because the product can
     no longer produce the broken one — which is the point. `gen` is the shape
     the accepted order resolver reads: ops keyed by op_id, each with its own
     causal_parents. */
  /* C4c — these fixtures now carry the `class` the product actually writes.
     They omitted it while the workout owned a generation by itself; since ONE
     STORE put the reading and the check-in in the same one, `causalTips()` is
     class-scoped (A3 review F2), so a fixture without a class is not a workout
     op at all. Adding it makes the fixture truthful — every assertion below is
     unchanged. */
  const gen = ops => ({ collections: { ops: Object.fromEntries(ops.map(op => [op.op_id, op])) } });
  const start = (id, parents, seq) => ({ op_id: id, kind: 'session-start', class: 'session', causal_parents: parents, device_seq: seq });
  const close = (id, parents, seq) => ({ op_id: id, kind: 'session-close', class: 'session', causal_parents: parents, device_seq: seq });

  await t.test('the guard refuses exactly the parents round 1 would have written', () => {
    const empty = gen([]);
    assert.equal(startOrderRefusalOf(empty, causalTips(empty)), null, 'an empty store is orderable');
    const oneDay = gen([start('s1', [], 1), close('c1', ['s1'], 2)]);
    assert.equal(startOrderRefusalOf(oneDay, causalTips(oneDay)), null,
      'a second Start carrying the derived tip is orderable');
    // ROUND 1's parents on ROUND 1's store: a new page load resolved [] over a
    // log that already held a Start. That is the write that stranded the athlete.
    const refusal = startOrderRefusalOf(oneDay, []);
    assert(refusal, 'a Start that descends from nothing must be refused');
    assert.equal(refusal.code, 'WORKOUT_START_ORDER_UNPROVEN');
    assert.match(refusal.reason, /would not descend from 1 session/);
    // An id that is not in the log at all reaches nothing, and is refused too.
    assert(startOrderRefusalOf(oneDay, ['not-an-op']), 'an invented parent is refused');
    // The tip of a store holding one closed session IS that close.
    assert.deepEqual(causalTips(oneDay), ['c1']);
  });

  /* The screen must HONOUR the guard, not merely have one. A host that reports an
     unorderable Start must never reach "ready", and Start must write nothing. */
  await t.test('the screen honours an order refusal: never ready, and nothing is written', async () => {
    const own = await lane(fresh, 'frontier-guard');
    let guardHandle = await own.on(DAY);
    await conductDay(guardHandle);                 // one recorded day on its own store
    guardHandle.host.close();

    guardHandle = await own.on(offsetDay(DAY, 1));
    const refusal = { code: 'WORKOUT_START_ORDER_UNPROVEN', reason: 'this session would not descend from 1 session' };
    const guarded = { ...guardHandle.host, startOrderRefusal: async () => refusal };
    const model = createGymModel({ gymHost: guarded, sessionTitle: 'T' });
    const before = await opCount(guardHandle.host);
    const view = await model.read();
    assert.equal(view.phase, 'blocked', 'a Start that cannot be ordered is never called ready');
    assert.equal(view.code, 'WORKOUT_START_ORDER_UNPROVEN');
    assert.equal(view.copy, refusal.reason, 'the reason is the guard\'s own, not an invented sentence');
    const started = await model.start();
    assert.equal(started.ok, false, 'Start is refused');
    assert.equal(started.code, 'WORKOUT_START_ORDER_UNPROVEN');
    assert.equal(await opCount(guardHandle.host), before, 'and NOTHING was written');
    guardHandle.host.close();
  });

  /* The race the probe alone cannot close: the store changes BETWEEN the probe and
     the tap. Start re-checks against the generation it is about to write on, so a
     "ready" screen from a moment ago still cannot produce an unorderable Start. */
  await t.test('Start re-checks at the moment of writing, not only at the probe', async () => {
    const own = await lane(fresh, 'frontier-race');
    let raceHandle = await own.on(DAY);
    await conductDay(raceHandle);
    raceHandle.host.close();

    raceHandle = await own.on(offsetDay(DAY, 1));
    let asked = 0;
    const racing = { ...raceHandle.host,
      // Orderable when the screen probes; unorderable by the time the athlete taps.
      startOrderRefusal: async () => (asked++ === 0 ? null
        : { code: 'WORKOUT_START_ORDER_UNPROVEN', reason: 'the store moved under this preparation' }) };
    const model = createGymModel({ gymHost: racing, sessionTitle: 'T' });
    const before = await opCount(raceHandle.host);
    assert.equal((await model.read()).phase, 'ready', 'the probe was satisfied');
    const started = await model.start();
    assert.equal(started.ok, false, 'the write is refused on the re-check');
    assert.equal(started.code, 'WORKOUT_START_ORDER_UNPROVEN');
    assert.equal(await opCount(raceHandle.host), before, 'and NOTHING reached the log');
    raceHandle.host.close();
  });

  /* A store is not always a single chain. An Undo leaves a removal edit that the
     close never names as a parent, so that day has TWO tips; a session left open
     has one tip per unclaimed op. Both are carried whole — a Start that descends
     from every tip descends from everything — and this pins the shapes rather
     than assuming a chain. */
  await t.test('a day containing an Undo has two tips, and both are carried', () => {
    const set = (id, parents, seq) => ({ op_id: id, kind: 'session-set', class: 'session', causal_parents: parents, device_seq: seq });
    const tomb = (id, parents, seq) => ({ op_id: id, kind: 'tombstone', class: 'session', causal_parents: parents, device_seq: seq });
    const undone = gen([start('s1', [], 1), set('x1', [], 2), tomb('t1', ['x1'], 3),
      set('x2', [], 4), close('c1', ['s1', 'x2'], 5)]);
    assert.deepEqual(causalTips(undone), ['t1', 'c1'], 'the removal edit is a tip of its own');
    assert.equal(startOrderRefusalOf(undone, causalTips(undone)), null);
    // An open session: the Start and its sets are each unclaimed.
    const open = gen([start('s1', [], 1), set('x1', [], 2), set('x2', [], 3)]);
    assert.deepEqual(causalTips(open), ['s1', 'x1', 'x2']);
    assert.equal(startOrderRefusalOf(open, causalTips(open)), null,
      'a later Start still reaches the open session\'s Start');
  });

  /* C4c — A3 REVIEW F2, the reason causalTips() is class-scoped. The weigh-in,
     the workout and the recovery check-in now share ONE generation. A kind-blind
     frontier would take a check-in fact (class "event") or a morning reading
     (class "reading") as a causal tip, and the next Start would descend from it
     — a workout ordered behind a wellness answer. It must not. */
  await t.test('a check-in and a reading in the same generation are NOT workout tips', () => {
    const checkin = (id, seq) => ({ op_id: id, kind: 'fact', class: 'event', causal_parents: [], device_seq: seq });
    const reading = (id, seq) => ({ op_id: id, kind: 'fact', class: 'reading', causal_parents: [], device_seq: seq });
    const shared = gen([reading('r1', 1), start('s1', [], 2), close('c1', ['s1'], 3),
      checkin('k1', 4), reading('r2', 5)]);
    assert.deepEqual(causalTips(shared), ['c1'],
      'the only tip of the workout order is the close — not the check-in, not the readings');
    assert.equal(startOrderRefusalOf(shared, causalTips(shared)), null,
      'and a Start on that tip is orderable');
    // The negative control: a Start that descends ONLY from the check-in is refused.
    const refusal = startOrderRefusalOf(shared, ['k1']);
    assert(refusal, 'a Start ordered behind a wellness answer reaches no session and is refused');
    assert.equal(refusal.code, 'WORKOUT_START_ORDER_UNPROVEN');
    // A generation holding ONLY non-workout ops has no workout tip at all.
    const wellnessOnly = gen([reading('r1', 1), checkin('k1', 2)]);
    assert.deepEqual(causalTips(wellnessOnly), []);
    assert.equal(startOrderRefusalOf(wellnessOnly, []), null,
      'and the first Start of the day descends from nothing, exactly as on an empty store');
  });

  await t.test('the tip of a store holding two closed sessions is the LAST close, and nothing else', () => {
    const two = gen([start('s1', [], 1), close('c1', ['s1'], 2), start('s2', ['c1'], 3), close('c2', ['s2'], 4)]);
    assert.deepEqual(causalTips(two), ['c2']);
    assert.equal(startOrderRefusalOf(two, causalTips(two)), null,
      'a third Start on the derived tip reaches BOTH recorded sessions');
    assert(startOrderRefusalOf(two, ['c1']),
      'the tip of the FIRST day is stale: it does not reach the second session');
  });
});

test('A2 — an athlete carrying a LEGACY session log (Joe after the S3 port) is refused a second session outright', async t => {
  const legacy = createTodayModel({}).stateFromOps();     // the fixture keeps its legacy sessionLog
  assert(Object.keys(legacy.sessionLog).length > 0, 'this athlete really does carry a legacy log');
  const L = await lane(legacy, 'legacy');

  let handle = await L.on(DAY);
  await t.test('the first session records and closes normally', async () => {
    assert((await handle.model.start()).ok);
    const last = await logEverySet(handle.model);
    assert((await handle.model.finish({ startId: last.startId })).ok);
  });
  handle.host.close();

  await t.test('every later scheduled day refuses PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED', async () => {
    for (const offset of [1, 3, 4, 7]) {
      handle = await L.on(offsetDay(DAY, offset));
      const view = await handle.model.read();
      assert.equal(view.phase, 'blocked', 'day+' + offset);
      assert.equal(view.code, 'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED', 'day+' + offset);
      assert.equal(view.copy, null, 'this refusal carries no reason, and none is invented');
      handle.host.close();
    }
  });
});
