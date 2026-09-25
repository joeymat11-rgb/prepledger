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
      for (const screen of ['today', 'recovery', 'workout']) {
        await api.render(screen);
        assert.doesNotMatch(dom.window.document.getElementById('phone').textContent,
          /NaN|undefined/, screen + ' rendered an unavailable number');
      }
    } finally { dom.window.close(); }
    assert.deepEqual(await collections(kit.host), before, 'consumer reads append no operation or outbox');
  } finally { recovery.host?.close(); workout.gymHost.close(); }
}

for (const [label, night, expectedClean, band, score] of [
  ['missing', null, true, 'UNKNOWN', null],
  ['stale zero', { date: '2030-02-01', hours: 0 }, true, 'UNKNOWN', null],
  ['current zero', { date: NIGHT, hours: 0 }, false, 'WATCH', 70],
  ['current eight hours', { date: NIGHT, hours: 8 }, true, 'GREEN', 100],
]) test('COMBINED N2 recovery and actual consumers distinguish ' + label, async () => {
  const kit = await device();
  try {
    if (night) assert.equal((await kit.host.save(night, { supersedes: null })).ok, true);
    const model = await projected(kit.host), state = model.stateFromOps(), E = model.engine;
    assert.equal(Object.hasOwn(state.sleep, 'cleanH'), false, 'no target was supplied');
    assert.equal(E.sleepInfo(state).clean, expectedClean);
    assert.deepEqual(E.atSleepTarget(state), { run: null, at: null, targetKnown: false });
    const recovery = E.recoveryIndex(state);
    assert.equal(recovery.band, band); assert.equal(recovery.score, score);
    assert.equal(recovery.flags.some(f => f.k === 'sleep'), !expectedClean);
    assert.deepEqual(E.fiveLevers(state).sleep,
      { label: 'SLEEP', state: 'quiet', detail: 'sleep target not recorded' });
    assert.equal(E.lightsOutT(state).target, null);
    assert.equal(E.lightsOutT(state).t, null, 'a night does not invent a bedtime target');
    const current = night?.date === NIGHT;
    assert.equal(E.currentSleepObservation(state)?.h ?? null, current ? night.hours : null);
    await consumers(model, kit, current ? NIGHT : null, current ? night.hours : null);
  } finally { kit.host.close(); }
});

test('COMBINED N2 real correction changes observed debt without manufacturing a target or deleting a fact', async () => {
  const kit = await device();
  try {
    const first = await kit.host.save({ date: NIGHT, hours: 0 }, { supersedes: null });
    assert.equal(first.ok, true);
    const before = await collections(kit.host), zero = await projected(kit.host);
    assert.equal(zero.engine.sleepInfo(zero.stateFromOps()).clean, false);
    const fixed = await kit.host.save({ date: NIGHT, bed: '22:00', wake: '06:00' }, { supersedes: first.op_id });
    assert.equal(fixed.ok, true);
    const after = await collections(kit.host), model = await projected(kit.host), state = model.stateFromOps();
    for (const kind of ['ops', 'outbox']) {
      assert.equal(Object.keys(after[kind]).length, Object.keys(before[kind]).length + 1);
      for (const [id, row] of Object.entries(before[kind])) assert.deepEqual(after[kind][id], row);
    }
    assert.equal((await kit.host.forDate(NIGHT)).length, 2);
    assert.equal(model.recordedSleep(NIGHT).savedDate, DAY);
    assert.equal(model.loggedSleep(NIGHT).h, 8);
    assert.equal(model.engine.sleepInfo(state).clean, true);
    assert.equal(model.engine.recoveryIndex(state).band, 'GREEN');
    assert.equal(model.engine.atSleepTarget(state).targetKnown, false);
    await consumers(model, kit, NIGHT, 8);
  } finally { kit.host.close(); }
});

test('COMBINED N2 late zero remains historical after actual installation rollover', async () => {
  const kit = await device(); let next;
  try {
    assert.equal((await kit.host.save({ date: NIGHT, hours: 0 }, { supersedes: null })).ok, true);
    const before = await collections(kit.host);
    next = await createSleepHost({ day: '2030-02-05', ...kit.lane });
    assert.equal(kit.host.today(), '2030-02-05', 'the installation clock really advanced');
    const model = await projected(next, basis(), '2030-02-05'), state = model.stateFromOps();
    assert.equal(model.loggedSleep(NIGHT).h, 0, 'the old zero is retained');
    assert.equal(model.recordedSleep(NIGHT).savedDate, DAY, 'the original saved date is retained');
    assert.equal(model.engine.currentSleepObservation(state), null);
    assert.equal(model.engine.recoveryIndex(state).band, 'UNKNOWN');
    assert.equal(model.engine.recoveryIndex(state).score, null);
    assert.equal(model.engine.sleepInfo(state).clean, true, 'stale sleep cannot restrict this day');
    const entry = await createCheckInEntry(model, kit.lane);
    try { assert.equal(entry.checkin.sleepRecord, null); } finally { entry.host?.close(); }
    assert.deepEqual(await collections(next), before, 'rollover retains exact operations and outbox');
  } finally { next?.close(); kit.host.close(); }
});

test('COMBINED N2 recorded target and three real clock-time nights remain distinct from absent target', async () => {
  const kit = await device();
  try {
    for (const date of ['2030-02-01', '2030-02-02', NIGHT])
      assert.equal((await kit.host.save({ date, bed: '22:00', wake: '06:00' }, { supersedes: null })).ok, true);
    const missing = await projected(kit.host), state = basis();
    state.sleep.cleanH = 7.5; // Explicit synthetic athlete input, never a product/source substitution.
    const known = await projected(kit.host, state), observed = known.stateFromOps();
    assert.deepEqual(known.engine.atSleepTarget(observed), { run: 3, at: true, targetKnown: true });
    assert.equal(known.engine.lightsOutT(observed).target, 7.5);
    assert.match(known.engine.lightsOutT(observed).t, /^\d\d:\d\d$/);
    assert.equal(known.engine.fiveLevers(observed).sleep.state, 'good');
    assert.deepEqual(missing.engine.atSleepTarget(missing.stateFromOps()), { run: null, at: null, targetKnown: false });
    assert.equal(missing.engine.lightsOutT(missing.stateFromOps()).t, null);
    assert.deepEqual(known.storedSleepNights(), missing.storedSleepNights(), 'same genuine facts, different recorded target');
    await consumers(known, kit, NIGHT, 8);
  } finally { kit.host.close(); }
});
