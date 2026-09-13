import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../rebuild/m3/w6/test/support.mjs';
import { createSleepHost } from '../rebuild/m3/w7-preview/today/sleep-host.mjs';
import { createSetupModel, createCleanInitState } from '../rebuild/m3/w7-preview/today/setup-model.mjs';
import { createWorkoutEntry, createCheckInEntry } from '../rebuild/m3/w7-preview/today/today-entry.mjs';
import TodayModel from '../rebuild/m3/w7-preview/today/today-model.cjs';
import TodayApp from '../rebuild/m3/w7-preview/today/today-app.cjs';
import design from '../rebuild/m3/w7-preview/today/design.cjs';

const DAY = '2030-02-04', NIGHT = '2030-02-03';
function basis() {
  const setup = createSetupModel({ today: DAY });
  setup.setName('D2 synthetic');
  setup.toggleDay('1'); setup.setDayKind('1', 'U');
  setup.toggleDay('4'); setup.setDayKind('4', 'L');
  for (const [kind, name, mg, first, inc] of [
    ['U', 'Chest press', 'chest', '20', '10'],
    ['L', 'Leg press', 'quads', '45', '15'],
  ]) {
    const ex = setup.addExercise(kind);
    setup.setExerciseField(ex.key, 'n', name); setup.chooseMg(ex.key, mg);
    setup.setExerciseField(ex.key, 'first', first); setup.setExerciseField(ex.key, 'inc', inc);
  }
  setup.togglePriority('quads');
  const document = setup.document();
  assert.equal(document.ok, true, JSON.stringify(document.missing));
  return JSON.parse(JSON.stringify(createCleanInitState({ setup: document.setup })));
}
async function device() {
  const lane = { indexedDB: faultDatabase().indexedDB, crypto: webcrypto };
  return { lane, host: await createSleepHost({ day: DAY, ...lane }) };
}
async function projected(host, state = basis(), today = DAY) {
  const rows = await host.all();
  return TodayModel.createTodayModel({ today, basisState: state, sleepNights: { rows: () => rows } });
}
async function collections(host) {
  const { ops, outbox } = (await host.repository.load()).generation.collections;
  return { ops, outbox };
}
async function consumers(model, kit, expectedNight, expectedHours) {
  const before = await collections(kit.host);
  const recovery = await createCheckInEntry(model, kit.lane);
  const workout = await createWorkoutEntry(model, kit.lane);
  try {
    assert.deepEqual(recovery.checkin.sleepRecord,
      expectedNight ? { date: expectedNight, hours: expectedHours } : null);
    assert.equal(recovery.checkin.read().draft.sleepConfirm, null, 'reading is not confirmation');
    assert.equal(workout.summary().phase, 'ready', JSON.stringify(workout.summary()));
    assert.deepEqual(workout.gymHost.host.lastProjection().accepted_state.sleep,
      model.stateFromOps().sleep, 'the real gym received the same projected sleep state');
    const view = model.read();
    assert.equal(view.blocked, false);
    assert.match(view.workout.title, /UPPER BODY/);
    // The initial attempt scanned every raw, unrendered engine field, including
    // unrelated clean-init body-composition strings. Its six failures are retained
    // verbatim. This scoped witness checks what these actual consumers render.
    const shell = design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
    const dom = new JSDOM(shell, { url: 'http://127.0.0.1/' });
    try {
      const api = TodayApp.mountToday(dom.window.document, model, { workout, checkin: recovery });
      await api.checkInKitReady();
      for (const screen of ['today', 'recovery']) {
        await api.render(screen);
        assert.doesNotMatch(dom.window.document.getElementById('phone').textContent,
          /NaN|undefined/, screen + ' rendered an unavailable number');
      }
      assert.deepEqual(await collections(kit.host), before, 'preparation and recovery reads append no operation or outbox');
      // Entering the workout invokes its real Start. The second trial mistakenly
      // called this a read; its exact six failures and source are retained too.
      await api.render('workout');
      assert.doesNotMatch(dom.window.document.getElementById('phone').textContent,
        /NaN|undefined/, 'workout rendered an unavailable number');
      const started = await collections(kit.host);
      for (const kind of ['ops', 'outbox']) {
        assert.equal(Object.keys(started[kind]).length, Object.keys(before[kind]).length + 1);
        for (const [id, row] of Object.entries(before[kind])) assert.deepEqual(started[kind][id], row);
      }
      const addition = Object.entries(started.ops).find(([id]) => !Object.hasOwn(before.ops, id))[1];
      assert.equal(addition.kind, 'session-start');
      assert.equal(addition.effective.local_date, DAY);
    } finally { dom.window.close(); }
  } finally { recovery.host?.close(); workout.gymHost.close(); }
}

export { DAY, NIGHT, basis, device, projected, collections, consumers };
