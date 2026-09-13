/* N2 SLEEP ENTRY (DECISIONS:167; brief rebuild/lanes/d2/BRIEF-N2-SLEEP-ENTRY.md v1.0,
   sha256 b0969edb…, NARROWED). The cells are named N2-01 to N2-18 so each row of that
   brief's executable bar can be run on its own:
     node --test --test-name-pattern=N2-05 rebuild/m3/w7-preview/today/test/sleep.test.mjs

   Real here: the encrypted repository over fake-indexeddb, the accepted durable public
   client, the page's own sleep lane through `client.hostBindings`, the shipped template
   and the real engine. THE PROJECTOR IS NEVER ASSERTED AGAINST THIS FILE'S IDEA OF THE
   SPAN: N2-03 calls writers.cjs sleepSpanH directly and deep-equals the two, so a
   projector that computed a span of its own fails whatever it computed. */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createSleepHost, sleepNightsIn, PROFILE, OP_CLASS, OP_KIND } from '../sleep-host.mjs';
import SleepCommands from '../sleep-commands.cjs';
import SleepModel from '../sleep-model.cjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import design from '../design.cjs';
import Ops from '../../../../client/ops.cjs';
import { createCleanInitState, createSetupModel } from '../setup-model.mjs';
import { sleepNightFor, dayBefore } from '../checkin-model.mjs';
import { buildToday } from '../build.mjs';

const { createTodayModel, SYNTHETIC_DAY } = TodayModel;
const { mountToday, SLEEP_TITLE, SLEEP_NONE, SLEEP_MODE_TIMES, SLEEP_MODE_HOURS,
  SLEEP_ESTIMATE_PREFIX, SLEEP_CLOCK_CHANGE, SLEEP_HOURS_NOTE, SLEEP_FROM_TIMES,
  SLEEP_USE_CHECKIN, SLEEP_SAVE, SLEEP_NO_SAVE_TIME, SLEEP_NOT_SAVED, SLEEP_NO_STORE,
  SLEEP_NOTHING_RECORDED, SLEEP_REFUSAL_COPY, SLEEP_RECORDED_PREFIX } = TodayApp;
const { prepare, validate, nightOf, ACTION } = SleepCommands;
const DAY = SYNTHETIC_DAY;                 // 2030-02-04
const NIGHT = dayBefore(DAY);              // 2030-02-03
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const readRepo = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const shaOf = (rel) => createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');
const AI_DASH = /[–—]/;
/* THE CODE, with its prose removed (DECISIONS:114 (1)). */
const codeOf = (text) => text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
const NEW_FILES = ['sleep-commands.cjs', 'sleep-model.cjs', 'sleep-host.mjs'];

/* ONE device: one IndexedDB factory is one installation of the local era, so every
   host below is in the SAME sealed generation the other five lanes are in. */
async function device(options = {}) {
  const fault = options.fault || faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const open = (day = DAY) => createSleepHost({ day, ...lane });
  const host = await open();
  return { fault, lane, open, host };
}
const opsOf = async (repository) => Object.values((await repository.load()).generation.collections.ops || {});
const outboxOf = async (repository) => Object.values((await repository.load()).generation.collections.outbox || {});

/* The lane object today-app.cjs builds for itself, built here so the tests drive the
   same shape the page does. */
function entryFor(host, rows) {
  const lane = {
    host,
    rows: () => rows,
    async refresh() { rows = await host.all(); return rows; },
    async save(night) {
      const result = await host.save(night);
      if (!result || result.ok !== true) return result;
      try { await lane.refresh(); return { ...result, readBack: true }; }
      catch (_) { return { ...result, readBack: false }; }
    },
    close() { host.close(); },
  };
  return lane;
}
async function laneOver(host) { return entryFor(host, await host.all()); }

const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
function screenOn(options = {}) {
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' + (options.query || '') });
  const doc = dom.window.document;
  const model = options.model || createTodayModel({ today: DAY });
  const api = mountToday(doc, model, options.mount || {});
  const pick = (slot) => doc.querySelector('#phone [data-slot="' + slot + '"]');
  return { dom, doc, model, api, pick,
    text: () => doc.getElementById('phone').textContent,
    type(slot, value) {
      const box = doc.querySelector('#phone [data-slot="' + slot + '"]');
      box.value = value;
      box.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    },
    /* A select or a date field answers to `change`, not `input`. */
    choose(slot, value) {
      const box = doc.querySelector('#phone [data-slot="' + slot + '"]');
      box.value = value;
      box.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    },
    click(selector) {
      doc.querySelector('#phone ' + selector).dispatchEvent(new dom.window.Event('click'));
    },
    async tapSave() {
      pick('sleep-save').dispatchEvent(new dom.window.Event('click'));
      await api.sleepPending();
      await new Promise((resolve) => setTimeout(resolve, 0));
    },
  };
}
const rowsFor = (nights) => nights.map((night, index) => ({
  op_id: 'op-' + index, device_seq: index + 1, savedDate: DAY, savedTime: '08:00', savedOffset: '+00:00', night }));

/* THE FIRST RUN'S OWN DOCUMENT, built through the accepted reducer. */
function firstRunDocument({ today = DAY } = {}) {
  const model = createSetupModel({ today });
  model.setName('Dad');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  model.toggleDay('4'); model.setDayKind('4', 'L');
  const press = model.addExercise('U');
  model.setExerciseField(press.key, 'n', 'Chest press');
  model.chooseMg(press.key, 'chest');
  model.setExerciseField(press.key, 'first', '20');
  model.setExerciseField(press.key, 'inc', '10');
  const legs = model.addExercise('L');
  model.setExerciseField(legs.key, 'n', 'Leg press');
  model.chooseMg(legs.key, 'quads');
  model.setExerciseField(legs.key, 'first', '45');
  model.setExerciseField(legs.key, 'inc', '15');
  model.togglePriority('quads');
  const built = model.document();
  assert.equal(built.ok, true, 'the first-run fixture is complete: ' + JSON.stringify(built.missing));
  return built.setup;
}

/* ==========================================================================
   N2-01 - THE CLOSED COMMAND AND THE ACCEPTED ENVELOPE.
   ========================================================================== */
test('N2-01 - the producer builds ONE sleep/fact op of the accepted envelope', () => {
  const action = prepare({ action: ACTION, input: { night: { date: NIGHT, bed: '23:00', wake: '06:30' } } });
  /* The class and the kind are read out of the ACCEPTED list, not restated here. */
  assert(Ops.CLASSES.includes(OP_CLASS), 'rebuild/client/ops.cjs already knows this class');
  assert(Ops.KINDS.includes(OP_KIND), 'and this kind');
  assert.equal(action.class, OP_CLASS);
  assert.equal(action.kind, OP_KIND);
  assert.deepEqual(Object.keys(action.payload).sort(), ['night', 'profile']);
  assert.equal(action.payload.profile, PROFILE);
  assert.deepEqual(action.payload.night, { date: NIGHT, bed: '23:00', wake: '06:30' });
  assert.deepEqual(action.parents, []);
});

test('N2-01 - unknown keys, foreign shapes and a forged check-in reference all refuse', () => {
  const good = { date: NIGHT, hours: 7 };
  for (const input of [
    { ...good, score: 9 },                       // an unknown member
    { ...good, quality: 'Good' },                // no quality member exists here
    { date: NIGHT },                             // neither shape
    { hours: 7 },                                // no night date
    { ...good, from_checkin_op_id: '' },         // an empty reference is not a reference
    { ...good, from_checkin_op_id: 7 },
    { date: NIGHT, bed: '23:00', wake: '06:30', from_checkin_op_id: 'op-1' },
  ]) assert.throws(() => nightOf(input), /SLEEP_INPUT_INVALID/, JSON.stringify(input));
  for (const request of [
    { action: 'sleep-night' },
    { action: 'other', input: { night: good } },
    { action: ACTION, input: { night: good, extra: 1 } },
    { action: ACTION, input: { night: good, effective: { local_date: NIGHT } } },
  ]) assert.throws(() => prepare(request), /SLEEP_INPUT_INVALID/, JSON.stringify(request));
  /* And validate() refuses the same shapes on the envelope the client actually built. */
  const read = () => null;
  assert.equal(validate({ kind: OP_KIND, class: OP_CLASS, effective: { local_date: NIGHT },
    payload: { profile: PROFILE, night: { date: NIGHT, hours: 7 } }, causal_parents: [] }, read), true);
  assert.equal(validate({ kind: OP_KIND, class: OP_CLASS, effective: { local_date: NIGHT },
    payload: { profile: 'earned/other/v1', night: { date: NIGHT, hours: 7 } }, causal_parents: [] }, read), false);
  assert.equal(validate({ kind: 'event', class: OP_CLASS, effective: { local_date: NIGHT },
    payload: { profile: PROFILE, night: { date: NIGHT, hours: 7 } }, causal_parents: [] }, read), false);
});

/* ==========================================================================
   N2-02 - BOTH MODES, AND EVERY BOUND, HANDLED BY THE EXACT CONTRACT.
   ========================================================================== */
test('N2-02 - an explicit zero is an ANSWER and a blank is unknown', () => {
  assert.deepEqual(nightOf({ date: NIGHT, hours: 0 }), { date: NIGHT, hours: 0 },
    'zero hours is a legitimate entered answer (A3 own 0..24 precedent)');
  assert.deepEqual(nightOf({ date: NIGHT, hours: 24 }), { date: NIGHT, hours: 24 });
  assert.equal(SleepModel.hoursRefusal({ hours: '0', date: NIGHT }, DAY), null);
  assert.equal(SleepModel.hoursRefusal({ hours: '', date: NIGHT }, DAY), SleepModel.REFUSALS.NOTHING,
    'a blank is UNKNOWN and is refused rather than becoming a zero');
  assert.equal(SleepModel.hoursRefusal({ hours: '   ', date: NIGHT }, DAY), SleepModel.REFUSALS.NOTHING);
});

test('N2-02 - hours, dates, strings, null, NaN and infinity are refused by name', () => {
  for (const hours of [-1, 24.5, 7.125, Number.NaN, Number.POSITIVE_INFINITY, '7', null, true]) {
    assert.throws(() => nightOf({ date: NIGHT, hours }), /SLEEP_INPUT_INVALID/, String(hours));
  }
  for (const date of ['2030-02-30', '2030-13-01', '30-02-03', '2030-2-3', '', null, 20300203]) {
    assert.throws(() => nightOf({ date, hours: 7 }), /SLEEP_INPUT_INVALID/, String(date));
  }
  assert.equal(SleepModel.hoursRefusal({ hours: '7.125', date: NIGHT }, DAY), SleepModel.REFUSALS.HOURS);
  assert.equal(SleepModel.hoursRefusal({ hours: '25', date: NIGHT }, DAY), SleepModel.REFUSALS.HOURS);
  assert.equal(SleepModel.hoursRefusal({ hours: 'lots', date: NIGHT }, DAY), SleepModel.REFUSALS.HOURS);
  /* A FUTURE night has not happened: a completed night is refused by name. */
  assert.equal(SleepModel.hoursRefusal({ hours: '7', date: DAY }, DAY), SleepModel.REFUSALS.NIGHT_DATE);
  assert.equal(SleepModel.hoursRefusal({ hours: '7', date: '2030-02-05' }, DAY), SleepModel.REFUSALS.NIGHT_DATE);
});

test('N2-02 - lone times, equal times, bad clock values and excessive awake minutes refuse', () => {
  for (const input of [
    { date: NIGHT, bed: '23:00' },
    { date: NIGHT, wake: '06:30' },
    { date: NIGHT, awake_min: 30 },
    { date: NIGHT, bed: '23:00', wake: '23:00' },       // sleepSpanH would wrap this to 24 h
    { date: NIGHT, bed: '24:00', wake: '06:30' },
    { date: NIGHT, bed: '23:0', wake: '06:30' },
    { date: NIGHT, bed: '23:60', wake: '06:30' },
    { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 451 },   // the span is 450 minutes
    { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 30.5 },
    { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: -1 },
    { date: NIGHT, bed: '23:00', wake: '06:30', hours: 7 },         // never both shapes
  ]) assert.throws(() => nightOf(input), /SLEEP_INPUT_INVALID/, JSON.stringify(input));
  assert.deepEqual(nightOf({ date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 450 }),
    { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 450 }, 'the whole span is allowed');
  const refusals = SleepModel.REFUSALS;
  assert.equal(SleepModel.timesRefusal({ bed: '', wake: '', date: NIGHT }, DAY), refusals.NOTHING);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: '', date: NIGHT }, DAY), refusals.BOTH_TIMES);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: 'x', date: NIGHT }, DAY), refusals.TIME_FORM);
  assert.equal(SleepModel.timesRefusal({ bed: '07:00', wake: '07:00', date: NIGHT }, DAY), refusals.SAME_TIME);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: '06:30', awake_min: '451', date: NIGHT }, DAY), refusals.AWAKE);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: '06:30', awake_min: '4.5', date: NIGHT }, DAY), refusals.AWAKE);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: '06:30', date: NIGHT }, DAY), null);
});

/* ==========================================================================
   N2-03 - THE HOURS ARE THE ENGINE'S. Seam S2 is the ROW, never the span.
   ========================================================================== */
test('N2-03 - every projected h deep-equals a direct writers.cjs sleepSpanH call', () => {
  const model = createTodayModel({ today: DAY });
  const E = model.engine;
  const table = [
    { bed: '23:00', wake: '06:30' },                    // past midnight
    { bed: '22:15', wake: '05:45', awake_min: 20 },     // awake subtracted
    { bed: '01:00', wake: '09:00' },                    // no wrap at all
    { bed: '23:59', wake: '00:01' },                    // two minutes
    { bed: '23:00', wake: '06:30', awake_min: 450 },    // the whole span awake
  ];
  for (const night of table) {
    const row = SleepModel.rowFor({ date: NIGHT, ...night }, E);
    const direct = E.sleepSpanH(night.bed, night.wake,
      Object.hasOwn(night, 'awake_min') ? night.awake_min : 0);
    assert.equal(row.h, direct, JSON.stringify(night));
    assert.equal(row.d, NIGHT);
    assert.equal(row.bed, night.bed);
    assert.equal(row.wake, night.wake);
  }
  /* A TYPED duration is the athlete's own number, unchanged, with no clock fields. */
  const typed = SleepModel.rowFor({ date: NIGHT, hours: 6.25 }, E);
  assert.deepEqual(typed, { d: NIGHT, h: 6.25 });
});

test('N2-03 - the page computes no span of its own, and a mode correction drops the clock fields', () => {
  /* A source scan, because a screen that did the subtraction itself could agree with
     the engine on this table and disagree on the next one. */
  for (const file of ['sleep-model.cjs', 'today-app.cjs']) {
    const code = codeOf(readRepo('rebuild/m3/w7-preview/today/' + file));
    assert.equal(/1440/.test(code), false, file + ' carries the midnight wrap itself');
    assert.equal(/\/\s*60/.test(code.replace(/span - awakeMin/g, '')), false,
      file + ' converts minutes to hours itself');
  }
  assert(readRepo('rebuild/m3/w7-preview/today/sleep-model.cjs')
    .includes('engine.sleepSpanH(night.bed, night.wake, awake)'), 'through the engine it is handed');
  const model = createTodayModel({ today: DAY });
  const rows = rowsFor([{ date: NIGHT, bed: '23:00', wake: '06:30' }, { date: NIGHT, hours: 5 }]);
  const state = SleepModel.projectSleepNights({ sleep: { nights: [] } }, rows, model.engine);
  assert.deepEqual(state.sleep.nights, [{ d: NIGHT, h: 5 }],
    'switching to a duration REMOVES the obsolete bed and wake');
});

/* ==========================================================================
   N2-04 - THE NIGHT LABEL, AND THE SAVE STAMP, ARE DIFFERENT FACTS.
   ========================================================================== */
test('N2-04 - the night is the day BEFORE, across month, year and leap boundaries', () => {
  assert.equal(SleepModel.nightDateFor(DAY), NIGHT);
  assert.equal(SleepModel.nightDateFor(DAY), dayBefore(DAY), 'the check-in own rule, not a second one');
  for (const [day, night] of [['2030-03-01', '2030-02-28'], ['2028-03-01', '2028-02-29'],
    ['2031-01-01', '2030-12-31'], ['2030-02-03', '2030-02-02']]) {
    assert.equal(SleepModel.nightDateFor(day), night, day);
    assert.equal(SleepModel.nightDateFor(day), dayBefore(day), day);
  }
});

test('N2-04 - a late entry keeps the chosen night, and the save stamp stays separate', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ date: '2030-01-30', hours: 7 })).ok, true, 'a night recorded late');
  const [row] = await kit.host.all();
  assert.equal(row.night.date, '2030-01-30', 'the NIGHT label is the athlete choice');
  assert.equal(row.savedDate, DAY, 'and the save stamp is the client own envelope');
  assert.match(row.savedTime, /^\d{2}:\d{2}(:\d{2})?$/);
  assert.notEqual(row.night.date, row.savedDate);
  kit.host.close();
});

/* ==========================================================================
   N2-05 - ONE DELIBERATE SAVE, ONE OPERATION, ONE TRANSACTION.
   ========================================================================== */
test('N2-05 - a real save adds ONE op and its outbox entry in one generation', async () => {
  const kit = await device();
  const before = await opsOf(kit.host.repository);
  const result = await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 15 });
  assert.equal(result.ok, true, result.code || '');
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, before.length + 1, 'exactly one operation');
  const op = ops.find((o) => o.class === OP_CLASS);
  assert.equal(op.kind, OP_KIND);
  assert.deepEqual(op.payload.night, { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 15 });
  assert.equal((await outboxOf(kit.host.repository)).length, 1, 'and its outbox entry');
  kit.host.close();
});

test('N2-05 - a closed lane records nothing and says which refusal it was', async () => {
  const kit = await device();
  kit.host.close();
  const refused = await kit.host.save({ date: NIGHT, hours: 7 });
  assert.equal(refused.ok, false);
  assert.equal(refused.code, 'LOCAL_CLIENT_CLOSED');
  assert.equal(refused.op_id, null);
});

/* ==========================================================================
   N2-06 - A CORRECTION APPENDS, THE PROJECTION IS DETERMINISTIC, AND NOTHING
   INVENTS A WINNER.
   ========================================================================== */
test('N2-06 - a correction is a NEW op, the latest wins, and the projection is idempotent', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  assert.equal((await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30' })).ok, true);
  assert.equal((await kit.host.save({ date: NIGHT, hours: 5.5 })).ok, true);
  const rows = await kit.host.all();
  assert.equal(rows.length, 2, 'two operations, nothing updated and nothing deleted');
  const state = SleepModel.projectSleepNights({ sleep: { nights: [] } }, rows, model.engine);
  assert.deepEqual(state.sleep.nights, [{ d: NIGHT, h: 5.5 }], 'the LATEST op for the night wins');
  /* Replaying twice, and replaying a reversed object order, give the same answer. */
  const again = SleepModel.projectSleepNights(state, rows, model.engine);
  assert.deepEqual(again.sleep.nights, state.sleep.nights, 'replay is idempotent');
  kit.host.close();
});

test('N2-06 - many nights sort ascending however the log is read, and unrelated dates survive', () => {
  const model = createTodayModel({ today: DAY });
  const rows = rowsFor([{ date: '2030-02-02', hours: 6 }, { date: '2030-01-30', hours: 8 },
    { date: NIGHT, bed: '23:00', wake: '06:30' }]);
  const basis = { sleep: { nights: [{ d: '2029-12-31', h: 7, bed: '22:00', wake: '05:00' }] }, other: 1 };
  const state = SleepModel.projectSleepNights(basis, rows, model.engine);
  assert.deepEqual(state.sleep.nights.map((n) => n.d),
    ['2029-12-31', '2030-01-30', '2030-02-02', NIGHT], 'sorted ascending by d');
  assert.deepEqual(state.sleep.nights[0], { d: '2029-12-31', h: 7, bed: '22:00', wake: '05:00' },
    'an unrelated basis night is untouched');
  assert.equal(state.other, 1, 'and every unrelated member of the state survives');
  assert.deepEqual(basis.sleep.nights.length, 1, 'the original object was not mutated');
  /* The same rows in the reverse read order give the same sorted projection. */
  const reversed = SleepModel.projectSleepNights(basis, [...rows].reverse(), model.engine);
  assert.deepEqual(reversed.sleep.nights.map((n) => n.d).sort(), state.sleep.nights.map((n) => n.d).sort());
});

test('N2-06 - rejected, tombstoned and foreign-profile facts are excluded, and no winner is invented', () => {
  const night = { date: NIGHT, hours: 7 };
  const generation = { collections: {
    ops: {
      good: { op_id: 'good', kind: OP_KIND, class: OP_CLASS, device_seq: 2,
        payload: { profile: PROFILE, night }, effective: { local_date: DAY, local_time: '08:00' } },
      dead: { op_id: 'dead', kind: OP_KIND, class: OP_CLASS, device_seq: 1,
        payload: { profile: PROFILE, night: { date: NIGHT, hours: 1 } }, effective: { local_date: DAY } },
      stone: { op_id: 'stone', kind: 'tombstone', target_op_id: 'dead' },
      other: { op_id: 'other', kind: OP_KIND, class: OP_CLASS, device_seq: 3,
        payload: { profile: 'earned/other/v1', night: { date: NIGHT, hours: 2 } }, effective: { local_date: DAY } },
      refused: { op_id: 'refused', kind: OP_KIND, class: OP_CLASS, device_seq: 4,
        payload: { profile: PROFILE, night: { date: NIGHT, hours: 3 } }, effective: { local_date: DAY } },
    },
    rejected: { refused: { reason: 'SYNTHETIC' } },
  } };
  const rows = sleepNightsIn(generation, PROFILE);
  assert.deepEqual(rows.map((r) => r.op_id), ['good'], 'one row survives the filter');
  /* THE CONFLICT SEAM (:167 (1)): the rendered state is deferred to hosted sync, and
     the projector must still refuse to invent a winner. On one device the winner is
     the HIGHEST authenticated device sequence, which is a fact about the log. */
  const ordered = SleepModel.winningNights(rowsFor([{ date: NIGHT, hours: 6 }, { date: NIGHT, hours: 9 }]));
  assert.equal(ordered.length, 1);
  assert.equal(ordered[0].device_seq, 2, 'the later device sequence, never wall-clock time');
  assert.equal(SleepModel.winningNights([]).length, 0, 'and nothing at all invents a night');
});

/* ==========================================================================
   N2-07 / N2-08 - THE CHECK-IN STOPS ASKING TWICE, ON THE SAME PAGE, WITH
   checkin-* BYTE-IDENTICAL.
   ========================================================================== */
test('N2-08 - a saved night is what the check-in own reader finds, with no A3 edit', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY, sleepNights: null });
  assert.equal((await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30' })).ok, true);
  model.setSleepNights(await laneOver(kit.host));
  const state = model.stateFromOps();
  /* checkin-model.mjs sleepNightFor, called here exactly as A3 calls it. */
  const found = sleepNightFor(state, DAY);
  assert(found, 'the check-in own reader finds the night N2 wrote');
  assert.equal(found.date, NIGHT);
  assert.equal(found.hours, model.engine.sleepSpanH('23:00', '06:30'));
  kit.host.close();
});

test('N2-08 - the check-in files are BYTE-IDENTICAL: N2 changes A3 not at all', () => {
  /* The reuse path already existed and was dead because nothing wrote a night. N2 is
     what brings it to life, and the cleanest proof that the shape is right is that
     none of these files moved. The hashes are re-read from disk at test time. */
  const pinned = {
    'checkin-model.mjs': shaOf('rebuild/m3/w7-preview/today/checkin-model.mjs'),
    'checkin-app.mjs': shaOf('rebuild/m3/w7-preview/today/checkin-app.mjs'),
    'checkin-commands.cjs': shaOf('rebuild/m3/w7-preview/today/checkin-commands.cjs'),
    'checkin-host.mjs': shaOf('rebuild/m3/w7-preview/today/checkin-host.mjs'),
  };
  const head = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/B-NTC.json'));
  assert.equal(pinned['checkin-host.mjs'],
    /'checkin-host\.mjs':\s*'([a-f0-9]{64})'/.exec(readRepo('rebuild/m3/w6/test/local-today-journey.test.mjs'))[1],
    'checkin-host.mjs is a PAGE_PINS file and must stay byte-identical');
  assert.equal(shaOf('rebuild/m3/w6/local/today-bindings.mjs'),
    head.product['rebuild/m3/w6/local/today-bindings.mjs'].post,
    'today-bindings.mjs is pinned ON DISK by the merged B-NTC artifact (DECISIONS:144)');
  for (const name of ['today-entry.mjs', 'gym-host.mjs', 'reading-host.mjs', 'checkin-host.mjs']) {
    const pin = new RegExp("'" + name.replace('.', '\\.') + "':\\s*'([a-f0-9]{64})'")
      .exec(readRepo('rebuild/m3/w6/test/local-today-journey.test.mjs'));
    assert.equal(shaOf('rebuild/m3/w7-preview/today/' + name), pin[1], name + ' moved');
  }
  /* And N2's own modules say nothing about enrolment or a second store. */
  for (const file of NEW_FILES) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    assert.equal(/firstRun|enrol|RESTORE_REQUIRED/i.test(text), false, file);
  }
  assert(Object.keys(pinned).length === 4);
});

/* ==========================================================================
   THE SCREEN: N2-14, N2-15, N2-16, N2-18.
   ========================================================================== */
test('N2-15 - with no store the sleep screen says what cannot happen, why and what to do', () => {
  const page = screenOn();
  page.doc.querySelector('#phone [data-go="sleep"]').dispatchEvent(new page.dom.window.Event('click'));
  assert.equal(page.api.screen(), 'sleep');
  const note = page.pick('sleep-note').textContent;
  assert(note.startsWith(SLEEP_NO_STORE), 'what cannot happen and what to do: ' + note);
  assert(note.includes('NO_LOCAL_STORE'), 'and why: jsdom offers no encrypted store');
  assert.equal(page.pick('sleep-entry-form').hidden, true, 'and no entry it cannot keep');
  assert.equal(page.pick('sleep-recorded').textContent, '', 'nothing is read back');
  assert.equal(page.pick('sleep-save').closest('[data-slot="sleep-entry-form"]').hidden, true,
    'and the save control is inside the hidden entry');
});

test('N2-14 - with a lane and nothing recorded the entry is honest and offers both modes', async () => {
  const kit = await device();
  /* A basis with NO night for this date: the preview fixture athlete already has a
     month of nights, and an empty state has to be measured on an athlete who has none.
     The first-run document is the one this product actually creates. */
  const clean = createCleanInitState({ setup: firstRunDocument() });
  const page = screenOn({ model: createTodayModel({ today: DAY, basisState: clean }),
    mount: { sleep: await laneOver(kit.host) }, query: '?screen=sleep' });
  page.api.render('sleep');
  assert.equal(page.pick('sleep-entry-form').hidden, false);
  assert.equal(page.pick('sleep-title').textContent, SLEEP_TITLE);
  assert.match(page.pick('sleep-night').textContent, new RegExp(NIGHT));
  assert.equal(page.pick('sleep-note').textContent, SLEEP_NONE, 'the honest empty state');
  assert.doesNotMatch(page.pick('sleep-note').textContent, /0 h/, 'never a zero');
  assert.equal(page.pick('sleep-mode-times').getAttribute('aria-pressed'), 'true',
    'TIMES is the first mode (:167 (3))');
  assert.equal(page.pick('sleep-mode-hours').getAttribute('aria-pressed'), 'false');
  assert.equal(page.pick('sleep-times').hidden, false);
  assert.equal(page.pick('sleep-hours-mode').hidden, true);
  assert.equal(page.doc.querySelector('#phone #sleep-bed').value, '', 'both boxes start blank');
  assert.equal(page.doc.querySelector('#phone #sleep-wake').value, '');
  assert.equal(page.pick('sleep-recorded').hidden, true);
  assert.equal(page.doc.querySelectorAll('#phone .primary').length, 1, 'ONE primary action');
  assert.equal(page.pick('sleep-save-label').textContent, SLEEP_SAVE);
  kit.host.close();
});

test('N2-03 / N2-14 - the estimate on screen is the ENGINE own span, and equal times route to hours', async () => {
  const kit = await device();
  const page = screenOn({ model: createTodayModel({ today: DAY }), mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  const direct = createTodayModel({ today: DAY }).engine.sleepSpanH('23:00', '06:30');
  assert.equal(page.pick('sleep-estimate').textContent,
    SLEEP_ESTIMATE_PREFIX + direct + ' h Time awake was not recorded.');
  page.type('sleep-wake', '23:00');
  assert.equal(page.pick('sleep-estimate').textContent, SLEEP_CLOCK_CHANGE,
    'a clock-change night is offered the hours mode, never a clamped 24');
  kit.host.close();
});

test('N2-05 / N2-14 - the screen records ONE op and reads it back off the ENGINE, with provenance', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, 1, 'one tap, one operation');
  assert.deepEqual(ops[0].payload.night, { date: NIGHT, bed: '23:00', wake: '06:30' });
  const logged = model.loggedSleep(NIGHT);
  assert.equal(logged.h, model.engine.sleepSpanH('23:00', '06:30'), 'the engine holds it');
  const line = page.pick('sleep-recorded').textContent;
  assert.equal(page.pick('sleep-recorded').hidden, false);
  assert(line.startsWith(logged.h + ' h'), line);
  assert(line.includes(SLEEP_FROM_TIMES), 'and says which shape it came from');
  assert(line.includes(SLEEP_RECORDED_PREFIX), 'with the stamp the operation carries');
  assert.equal(line.includes(SLEEP_NO_SAVE_TIME), false);
  kit.host.close();
});

test('N2-14 - every refusal is the page own sentence and records nothing at all', async () => {
  const kit = await device();
  const page = screenOn({ mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  for (const [bed, wake, code] of [['', '', 'NOTHING'], ['23:00', '', 'BOTH_TIMES'],
    ['07:00', '07:00', 'SAME_TIME']]) {
    page.type('sleep-bed', bed);
    page.type('sleep-wake', wake);
    await page.tapSave();
    assert.equal(page.pick('sleep-error').textContent,
      SLEEP_REFUSAL_COPY[code] + ' ' + SLEEP_NOTHING_RECORDED, code);
    assert.deepEqual(await opsOf(kit.host.repository), [], 'and nothing was written');
  }
  /* The hours mode, including its own bound. */
  page.click('[data-action="sleep-mode-hours"]');
  page.type('sleep-hours', '25');
  await page.tapSave();
  assert.equal(page.pick('sleep-error').textContent,
    SLEEP_REFUSAL_COPY.HOURS + ' ' + SLEEP_NOTHING_RECORDED);
  assert.deepEqual(await opsOf(kit.host.repository), []);
  /* An explicit zero IS an answer and records. */
  page.type('sleep-hours', '0');
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'zero hours is recorded');
  assert.deepEqual((await kit.host.all())[0].night, { date: NIGHT, hours: 0 });
  kit.host.close();
});

test('N2-06 / N2-14 - a correction through the screen replaces the night and shows the new shape', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  assert.equal(model.loggedSleep(NIGHT).bed, '23:00');
  page.click('[data-action="sleep-mode-hours"]');
  page.type('sleep-hours', '5.5');
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 2, 'a correction is a NEW op');
  assert.deepEqual(model.loggedSleep(NIGHT), { d: NIGHT, h: 5.5 },
    'and the obsolete clock fields are gone, not stale');
  assert(page.pick('sleep-recorded').textContent.includes(SLEEP_HOURS_NOTE));
  kit.host.close();
});

/* ==========================================================================
   N2-09 / N2-10 / N2-11 / N2-13 - ONE STORE, AND WHAT THE NIGHT REACHES.
   ========================================================================== */
test('N2-09 - the lane is opened through client.hostBindings, in the SAME installation', async () => {
  const source = readRepo('rebuild/m3/w7-preview/today/sleep-host.mjs');
  assert(source.includes('era.client.hostBindings('), 'the honest extension point');
  assert.equal(/era\.create(Reading|Gym|CheckIn|Setup|Food|Sleep)Host/.test(codeOf(source)), false,
    'no w6 factory is asked for a sixth lane');
  assert(source.includes('createDurablePublicClient'), 'the accepted durable client');
  assert(source.includes('LOCAL_ERA_SCHEMA_VERSION'), 'the era own lease schema');
  assert.equal(/indexedDB\.open|new Date\(\)|Date\.now\(\)/.test(codeOf(source)), false,
    'no second store and no second clock');
  /* And a real host really does land in the same generation as a food day. */
  const kit = await device();
  const { createFoodHost } = await import('../food-host.mjs');
  const food = await createFoodHost({ day: DAY, ...kit.lane });
  assert.equal((await kit.host.save({ date: NIGHT, hours: 7 })).ok, true);
  assert.equal((await food.save({ cal: 2100 })).ok, true);
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.filter((o) => o.class === OP_CLASS).length, 1);
  assert.equal(ops.filter((o) => o.class === 'food-day').length, 1,
    'both facts are in ONE sealed generation under ONE lease');
  assert.deepEqual(kit.host.lease, food.lease, 'the same authority lease');
  food.close(); kit.host.close();
});

test('N2-10 - the night reaches the state the workout preparation and Today read', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const before = model.stateFromOps();
  assert.equal((await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30' })).ok, true);
  model.setSleepNights(await laneOver(kit.host));
  const after = model.stateFromOps();
  assert.notDeepEqual(after.sleep.nights, before.sleep.nights, 'the night is in the state');
  assert.equal(after.sleep.nights[after.sleep.nights.length - 1].d, NIGHT);
  /* The plan still prepares over that state, through the engine and nothing else. */
  const view = model.read();
  assert.equal(view.blocked, false);
  assert(view.workout, 'the workout preparation still answers with the night projected');
  /* And the readings replay is untouched by the sleep replay. */
  assert.deepEqual(after.reads, before.reads, 'N2 did not touch the reading replay');
  assert.deepEqual(after.dailyLogs, before.dailyLogs, 'nor the food replay');
  kit.host.close();
});

test('N2-13 - an existing basis night survives, and a same-date correction keeps the rest', () => {
  const model = createTodayModel({ today: DAY });
  const basis = model.basisState();
  assert(basis.sleep.nights.length > 0, 'the fixture athlete already has nights');
  const first = basis.sleep.nights[0];
  /* A date the basis does NOT hold, so an addition is measured as an addition. */
  const fresh = '2029-12-30';
  assert.equal(basis.sleep.nights.some((n) => n.d === fresh), false);
  const state = SleepModel.projectSleepNights(basis, rowsFor([{ date: fresh, hours: 6 }]), model.engine);
  assert.deepEqual(state.sleep.nights[1], first, 'every old row is preserved');
  assert.equal(state.sleep.nights.length, basis.sleep.nights.length + 1);
  /* And a date the basis DOES hold is MERGED, never doubled and never emptied.
     D2 ROUND 1, FINDING 7 - this cell previously asserted an exact two-member
     REPLACEMENT, which enforced the very behaviour the contract forbids: an op speaks
     only about the duration of a night, so a member it does not carry is not news and
     must survive. Only the members the hours form CONTRADICTS are removed. */
  const held = basis.sleep.nights[0].d;
  const replaced = SleepModel.projectSleepNights(basis, rowsFor([{ date: held, hours: 3 }]), model.engine);
  assert.equal(replaced.sleep.nights.length, basis.sleep.nights.length, 'one row per date');
  assert.equal(replaced.sleep.nights[0].d, held);
  assert.equal(replaced.sleep.nights[0].h, 3, 'the new duration wins');
  assert.equal(Object.hasOwn(replaced.sleep.nights[0], 'bed'), false, 'obsolete clock fields go');
  assert.equal(Object.hasOwn(replaced.sleep.nights[0], 'wake'), false);
  assert.equal(Object.hasOwn(replaced.sleep.nights[0], 'awakeMin'), false);
  assert.equal(state.sleep.needed, basis.sleep.needed, 'unrelated sleep members survive');
  /* Zero sleep ops leave an existing basis exactly as it was. */
  assert.equal(SleepModel.projectSleepNights(basis, [], model.engine), basis,
    'an empty op set changes nothing at all');
});

test('N2-11 - a clean-init athlete records a night and NO screen this lane owns prints NaN', async () => {
  /* THE FINDING N2 MAKES REACHABLE, RENDERED HONESTLY RATHER THAN PRINTED.
     createCleanInitState writes `sleep: {nights: []}` and, before H3 lands, may carry
     no `needed`; several engine readers read `s.sleep.needed`, and with no nights they
     are unreachable. The first night N2 writes makes them reachable. This cell asserts
     the SCREEN, not the engine: nothing this lane owns may print undefined or NaN. */
  const clean = createCleanInitState({ setup: firstRunDocument() });
  const model = createTodayModel({ today: DAY, basisState: clean });
  const kit = await device();
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'his night is recorded');
  const text = page.text();
  assert.doesNotMatch(text, /NaN/, 'no NaN on the sleep screen');
  assert.doesNotMatch(text, /undefined/, 'and no undefined');
  assert.match(page.pick('sleep-recorded').textContent, /h /, 'his own night is read back');
  /* TODAY IS NOT RENDERED HERE, and that is the residual, not an omission: for a
     clean-init athlete `model.read()` THROWS out of energy.cjs before H3 lands, which
     is the state N1 met too and which this lane may not repair. */
  assert.throws(() => model.read(), /./, 'the engine still cannot plan for him (H3)');
  /* The engine reader itself is NAMED here rather than repaired locally: it is an
     m4/workout constructor question and belongs beside H3 (:154 (6)). */
  const state = model.stateFromOps();
  assert.equal(state.sleep.nights.length, 1, 'the night really is in his state');
  kit.host.close();
});

/* ==========================================================================
   N2-16 / N2-17 / N2-18 - THE BUILD, THE DESIGN BINDING, DURABILITY, CUSTODY.
   ========================================================================== */
test('N2-17 - a night survives a NEW host over the same encrypted store', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ date: NIGHT, bed: '22:45', wake: '06:15', awake_min: 10 })).ok, true);
  kit.host.close();
  const again = await kit.open();
  const rows = await again.all();
  assert.equal(rows.length, 1, 'the relaunch found the durable night');
  assert.deepEqual(rows[0].night, { date: NIGHT, bed: '22:45', wake: '06:15', awake_min: 10 });
  const model = createTodayModel({ today: DAY, sleepNights: { rows: () => rows } });
  assert.equal(model.loggedSleep(NIGHT).h, model.engine.sleepSpanH('22:45', '06:15', 10));
  again.close();
});

test('N2-16 - the build carries N2 three modules and still names no network', async () => {
  const result = await buildToday();
  for (const file of NEW_FILES) {
    assert(result.inputs.includes('rebuild/m3/w7-preview/today/' + file), file + ' is not in the built page');
  }
  assert.equal(result.assets.length, 3);
  assert(result.inputs.length >= 110, 'the pinned input inventory grew with N2');
  assert.match(result.buildTag, /^earned-[0-9a-f]{12}$/);
});

test('N2-16 - every sleep sentence is DECLARED, and the binding refuses a dropped one', () => {
  const approved = design.readApproved();
  const source = design.appSource();
  const approvedText = approved.map((a) => a.html).join('\n');
  const lines = [SLEEP_TITLE, SLEEP_NONE, SLEEP_MODE_TIMES, SLEEP_MODE_HOURS, SLEEP_SAVE,
    SLEEP_CLOCK_CHANGE, SLEEP_HOURS_NOTE, SLEEP_FROM_TIMES, SLEEP_USE_CHECKIN,
    SLEEP_NOT_SAVED, SLEEP_NO_STORE, ...Object.values(SLEEP_REFUSAL_COPY)];
  for (const line of lines) {
    assert(design.PREVIEW_RUNTIME_COPY.includes(line), 'declared: ' + line);
    assert(source.includes(line), 'present in a view source: ' + line);
    if (line !== SLEEP_TITLE) {
      assert.equal(approvedText.includes(line), false, 'preview-owned, so ABSENT upstream: ' + line);
    }
  }
  assert.doesNotThrow(() => design.assertDesignBinding(approved, design.templateHtml(), source));
  assert.throws(() => design.assertDesignBinding(approved, design.templateHtml(),
    source.split(SLEEP_SAVE).join('')), /COPY-BINDING FAIL/);
});

test('N2-16 - no em or en dash in N2 own sources, its template or its rendered screen', async () => {
  for (const file of [...NEW_FILES, 'today-app.cjs', 'today-model.cjs']) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    for (const match of text.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)) {
      const literal = match[1] === undefined ? match[2] : match[1];
      assert.equal(AI_DASH.test(literal), false, file + ' string literal: ' + literal);
    }
  }
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-sleep">');
  assert(start >= 0, 'the sleep screen is in the shipped template');
  const section = template.slice(start, template.indexOf('</template>', start));
  assert.equal(AI_DASH.test(section), false, 'the shipped sleep template');
  const kit = await device();
  const page = screenOn({ mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  assert.equal(AI_DASH.test(page.text()), false, 'the rendered screen');
  kit.host.close();
});

test('N2-18 - every class the sleep screen uses is an APPROVED selector, and it invents no width', () => {
  const approved = design.readApproved();
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-sleep">');
  const section = template.slice(start, template.indexOf('</template>', start));
  const css = approved.map((a) => a.styles).join('\n');
  for (const token of design.classTokens(section)) {
    if (design.PREVIEW_CLASSES.includes(token)) continue;
    const selector = new RegExp('\\.' + token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w-])');
    assert(selector.test(css), '.' + token + ' is not in the approved stylesheets');
  }
  for (const line of design.textOf(section)) {
    assert.equal(/\d/.test(line), false, 'the template carries a literal figure: "' + line + '"');
  }
  assert.equal(/style="/.test(section), false, 'no inline style on the entry');
  assert.equal(/\.sleep/.test(design.chromeCss()), false, 'N2 invents no class');
  for (const file of ['today-app.cjs', ...NEW_FILES]) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    assert.equal(/(?<![-\w])(min-width|width)\s*[:=]\s*['"]?\d/.test(text), false, file + ' sets a width');
  }
  assert(section.includes('class="hours"'), 'the boxes are the approved direct-entry control');
});

test('N2-16 - N2 touches nothing outside its custody', () => {
  const own = ['sleep-commands.cjs', 'sleep-model.cjs', 'sleep-host.mjs', 'sleep-check.mjs',
    'today-app.cjs', 'today-model.cjs', 'screens.template.html', 'design.cjs', 'build.mjs',
    'test/sleep.test.mjs'];
  for (const name of own) {
    assert(fs.existsSync(path.join(ROOT, 'rebuild/m3/w7-preview/today', name)), name);
  }
  /* The engine and the client are untouched by construction: N2 imports the span
     function through the composition it is handed and carries no engine of its own. */
  const model = readRepo('rebuild/m3/w7-preview/today/sleep-model.cjs');
  assert.equal(/require\(["']\.\.\/\.\.\/\.\.\/\.\.\/engine/.test(model), false,
    'sleep-model imports no engine of its own');
  const commands = readRepo('rebuild/m3/w7-preview/today/sleep-commands.cjs');
  assert.equal(/require\(["'].*\/client\//.test(commands), false,
    'the producer imports nothing from rebuild/client');
  /* ONE caller of the span function on this page, and it is the projector. */
  const files = fs.readdirSync(path.join(ROOT, 'rebuild/m3/w7-preview/today'))
    .filter((name) => /\.(cjs|mjs)$/.test(name));
  const callers = files.filter((name) =>
    /sleepSpanH\(/.test(codeOf(readRepo('rebuild/m3/w7-preview/today/' + name))));
  assert.deepEqual(callers.sort(), ['sleep-model.cjs', 'today-app.cjs'],
    'the projector and the screen estimate, and nothing else: ' + callers);
});

/* ==========================================================================
   N2-07 - THE SAME-PAGE JOURNEY, through the REAL check-in entry.
   ========================================================================== */
test('N2-07 - save a night, open the check-in WITHOUT a reload, and it stops asking twice', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sleepHost = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: firstRunDocument() }) });
  /* THE REAL check-in entry, from the pinned today-entry.mjs, over the same store. */
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  assert.equal(entry.summary().durable, true, 'the check-in really opened its durable lane');
  assert.equal(entry.checkin.sleepRecord, null, 'and it captured a state with no night in it');
  const checkinOps = async () => (await opsOf(sleepHost.repository))
    .filter((op) => op.class !== OP_CLASS);
  const before = (await checkinOps()).length;

  const page = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(sleepHost), checkin: entry } });
  await page.api.checkInKitReady();
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  assert.equal((await opsOf(sleepHost.repository)).filter((o) => o.class === OP_CLASS).length, 1);

  /* NO RELOAD. The route rebinds the check-in over the same host and the CURRENT
     projected state; the screen is the same screen, mounted by checkin-app.mjs. */
  const opened = page.api.render('recovery');
  await opened;
  await new Promise((resolve) => setTimeout(resolve, 0));
  const sheet = page.text();
  const hours = model.loggedSleep(NIGHT).h;
  assert(sheet.includes(String(hours)),
    'the check-in did not offer the night N2 just recorded: ' + sheet.slice(0, 200));
  assert(sheet.includes(NIGHT), 'and it carries the night date with it');
  assert.equal((await checkinOps()).length, before,
    'opening the check-in wrote NOTHING: no automatic confirmation, no check-in op');
  sleepHost.close();
  if (entry.host) entry.host.close();
});

/* ==========================================================================
   N2-12 - THE READ SIDE. The PM narrowed the coach companion to optional
   (:167 (2)): it rides only if this row cannot pass without it.
   ========================================================================== */
test('N2-12 - any reader gets the same dated night and provenance from the shared projector', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  assert.equal((await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 20 })).ok, true);
  const rows = await kit.host.all();
  /* The projector is PURE and takes the state and the engine it is handed, so a second
     reader composing its own state reaches the identical row without a companion. */
  const mine = SleepModel.projectSleepNights(model.basisState(), rows, model.engine);
  const theirs = SleepModel.projectSleepNights(model.basisState(), rows, model.engine);
  assert.deepEqual(SleepModel.loggedNight(mine, NIGHT), SleepModel.loggedNight(theirs, NIGHT));
  assert.equal(SleepModel.loggedNight(mine, NIGHT).h, model.engine.sleepSpanH('23:00', '06:30', 20));
  /* And on REOPENING the lane the same reader gets the same answer, with provenance. */
  kit.host.close();
  const again = await kit.open();
  const reopened = await again.all();
  assert.deepEqual(reopened[0].night, rows[0].night, 'the same night, byte for byte');
  assert.equal(reopened[0].savedDate, rows[0].savedDate, 'and the same save stamp');
  /* THE COACH'S OWN WORLD IS UNTOUCHED: no new tool, no network, no tier rule. */
  const world = readRepo('rebuild/coach/local-world.mjs');
  assert.equal(/sleep-night|earned\/sleep-night/.test(world), false,
    'the coach companion is NOT needed for this row and was not written (:167 (2))');
  again.close();
});

/* ==========================================================================
   D2 ROUND 1 - ONE CELL PER FINDING. Each was written RED against the head D2
   reviewed (3925e90) and is listed in N2-REPORT.md with the failure it printed.
   ========================================================================== */

/* FINDING 1. A reference is a claim about another operation, and a claim is
   worth exactly what authenticating it is worth. */
test('N2-01 - D2 finding 1: a forged check-in reference is refused, and a stale correction cannot supersede', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const host = await createSleepHost({ day: DAY, ...lane });
  const sleepOps = async () => (await opsOf(host.repository)).filter((op) => op.class === OP_CLASS);

  /* (a) AN ID NOTHING ANSWERS TO. Nothing is written and the reason names itself. */
  const forged = await host.save({ date: NIGHT, hours: 7, from_checkin_op_id: 'no-such-operation' });
  assert.equal(forged.ok, false, 'a forged source was accepted');
  assert.equal(forged.code, 'SLEEP_SOURCE_MISSING');
  assert.equal((await sleepOps()).length, 0, 'and it wrote nothing at all');

  /* (b) A REAL CHECK-IN, saved through the accepted entry over the SAME store. */
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: firstRunDocument() }) });
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  const draft = entry.checkin.draft();
  draft.answerSleepHere();
  draft.set('sleep_hours', '7');
  assert.equal((await entry.checkin.save()).ok, true, 'the check-in itself recorded');
  const source = entry.checkin.recorded().op_id;
  assert(source, 'and it has an op id to cite');

  /* The same id with the WRONG hours is refused: a citation must match what it cites. */
  const mismatched = await host.save({ date: NIGHT, hours: 6, from_checkin_op_id: source });
  assert.equal(mismatched.ok, false);
  assert.equal(mismatched.code, 'SLEEP_SOURCE_WRONG_HOURS');
  /* And for the wrong NIGHT: this check-in speaks for the night before its own day. */
  const wrongNight = await host.save({ date: '2030-01-20', hours: 7, from_checkin_op_id: source });
  assert.equal(wrongNight.ok, false);
  assert.equal(wrongNight.code, 'SLEEP_SOURCE_WRONG_NIGHT');
  assert.equal((await sleepOps()).length, 0, 'three refusals, zero writes');

  /* The honest citation is accepted, once it is really a citation. */
  const good = await host.save({ date: NIGHT, hours: 7, from_checkin_op_id: source });
  assert.equal(good.ok, true, good.code || '');
  const first = (await host.forDate(NIGHT))[0].op_id;

  /* (c) A STALE EDITOR. A second screen corrects the night; the first, which still
     believes it is looking at `first`, may not silently replace the newer one. */
  assert.equal((await host.save({ date: NIGHT, hours: 8 }, { supersedes: first })).ok, true);
  const stale = await host.save({ date: NIGHT, hours: 5 }, { supersedes: first });
  assert.equal(stale.ok, false, 'a stale editor overwrote a newer save');
  assert.equal(stale.code, 'SLEEP_STALE_NIGHT');
  assert.equal((await sleepOps()).length, 2, 'the refusal appended nothing');
  assert.equal(SleepModel.recordedNight(await host.all(), NIGHT).night.hours, 8,
    'and the newer night still wins');
  host.close();
  if (entry.host) entry.host.close();
});

/* FINDING 2. Today changing is not the gym host changing. */
test('N2-09 - D2 finding 2: the REAL gym host sees the night after a same-page save', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sleepHost = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY });
  const { createWorkoutEntry } = await import('../today-entry.mjs');
  const workout = await createWorkoutEntry(model, lane);
  const nightsIn = (entry) => {
    const projection = entry.gymHost.host.lastProjection();
    const state = projection && projection.accepted_state;
    return (state && state.sleep && Array.isArray(state.sleep.nights)) ? state.sleep.nights : [];
  };
  /* A night the athlete has NOT got, so the gym host's answer is unambiguous. */
  const fresh = '2029-12-30';
  assert.equal(nightsIn(workout).some((n) => n.d === fresh), false,
    'the fixture must not already hold the night under test');

  const page = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(sleepHost), workout } });
  /* The page can only rebind where it can reach a store, exactly as it opens its own
     lanes: this window is given the same one device the hosts above are in. */
  Object.defineProperty(page.dom.window, 'indexedDB', { value: fault.indexedDB, configurable: true });
  Object.defineProperty(page.dom.window, 'crypto', { value: webcrypto, configurable: true });
  page.api.render('sleep');
  /* A half-typed set on the gym card, which the athlete has not logged yet. */
  const before = workout.gymDraft();
  before.reps = '8';
  page.choose('sleep-date', fresh);
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '05:00');
  await page.tapSave();
  assert.equal(page.pick('sleep-error').textContent, '', 'the night had to be recorded first');
  await page.api.workoutRebound();

  const rebound = page.api.workoutEntry();
  assert.notEqual(rebound, workout, 'the entry was never rebuilt');
  const row = nightsIn(rebound).find((n) => n.d === fresh);
  assert(row, 'the real gym host still cannot see the night this page just recorded');
  assert.equal(row.h, model.engine.sleepSpanH('23:00', '05:00', 0));
  assert.equal(nightsIn(workout).some((n) => n.d === fresh), false,
    'and the OLD host is left as it was, which is why it had to be replaced');
  assert.equal(rebound.gymDraft().reps, '8', 'the half-typed set did not survive the rebind');
  sleepHost.close();
});

/* FINDING 3. The rebind changes ONE answer. Everything else is still his. */
test('N2-07 - D2 finding 3: rebinding the check-in keeps an unrelated half-typed answer', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sleepHost = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: firstRunDocument() }) });
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  /* HALF A CHECK-IN, typed before the night was recorded and never saved. */
  const draft = entry.checkin.draft();
  draft.choose('soreness', 'Mild');
  draft.set('soreness_location', 'left knee on the stairs');
  draft.choose('energy', 'Moderate');
  draft.toggleIssue('illness');
  draft.set('illness_note', 'sore throat since Tuesday');

  const page = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(sleepHost), checkin: entry } });
  await page.api.checkInKitReady();
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();

  await page.api.render('recovery');
  await new Promise((resolve) => setTimeout(resolve, 0));
  /* A typed answer lives in an input's VALUE, which no amount of textContent shows. */
  const typed = [...page.doc.querySelectorAll('#phone input, #phone textarea')]
    .map((box) => box.value).filter(Boolean);
  const sheet = page.text();
  assert(typed.includes('left knee on the stairs'),
    'the rebind threw away an answer that had nothing to do with sleep: ' + typed.join(' | '));
  assert(typed.includes('sore throat since Tuesday'), 'and it threw away the illness note too');
  /* The choices he made are still pressed, not merely remembered. */
  assert(page.doc.querySelector('#phone [aria-pressed="true"]'), 'his choices were lost too');
  /* The one thing that MUST change is the night it reads back. */
  assert(sheet.includes(String(model.loggedSleep(NIGHT).h)), 'the new night is what it now offers');
  sleepHost.close();
  if (entry.host) entry.host.close();
});

/* FINDING 4. One device's sequence is an order. Two devices' is not. */
test('N2-06 - D2 finding 4: two unordered devices produce NO winner, and the ambiguous date is named', () => {
  const model = createTodayModel({ today: DAY });
  const twoDevices = [
    { op_id: 'a1', device_id: 'device-A', device_seq: 4, savedDate: DAY, savedTime: '07:00',
      savedOffset: '+00:00', night: { date: NIGHT, hours: 5 } },
    { op_id: 'b1', device_id: 'device-B', device_seq: 2, savedDate: DAY, savedTime: '07:30',
      savedOffset: '+00:00', night: { date: NIGHT, hours: 9 } },
  ];
  assert.deepEqual(SleepModel.winningNights(twoDevices), [],
    'a winner was invented between two devices that carry no order');
  assert.deepEqual(SleepModel.ambiguousNights(twoDevices), [NIGHT],
    'and the date the sync seam must resolve is not even named');

  /* The basis stands: an ambiguous date is projected NOT AT ALL, so no figure on any
     screen is a guess about which device was later. */
  const basis = { sleep: { nights: [{ d: NIGHT, h: 7, bed: '22:00', wake: '05:00' }] } };
  const state = SleepModel.projectSleepNights(basis, twoDevices, model.engine);
  assert.deepEqual(SleepModel.loggedNight(state, NIGHT), { d: NIGHT, h: 7, bed: '22:00', wake: '05:00' });
  /* Reversing the read order changes nothing, because nothing was chosen. */
  assert.deepEqual(SleepModel.winningNights([...twoDevices].reverse()), []);

  /* ONE device with two rows is still ordered, and still has a winner: the narrowing
     at :167 (1) deferred the conflict SCREEN, not this distinction. */
  const oneDevice = twoDevices.map((row) => ({ ...row, device_id: 'device-A' }));
  const won = SleepModel.winningNights(oneDevice);
  assert.equal(won.length, 1);
  assert.equal(won[0].op_id, 'a1', 'the highest device sequence on ONE device wins');
  assert.deepEqual(SleepModel.ambiguousNights(oneDevice), []);
  /* And the real host carries the device identity the projector needs to tell them
     apart, rather than dropping it on the way out. */
  const source = readRepo('rebuild/m3/w7-preview/today/sleep-host.mjs');
  assert.match(source, /device_id:/, 'the host drops the device identity again');
});

/* FINDING 5. The date is chosen, the quality is reused, and nothing is guessed. */
test('N2-04 - D2 finding 5: the night is dated by choice, quality is reused, and no source date is guessed', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  /* (a) THE NIGHT IS DATED, and the athlete may say which night it is. */
  assert.equal(page.pick('sleep-date').value, NIGHT, 'the default is the night just gone');
  assert.equal(page.pick('sleep-date').max, NIGHT, 'and a night still running cannot be chosen');
  const older = '2029-12-30';
  page.choose('sleep-date', older);
  assert.match(page.pick('sleep-night').textContent, new RegExp(older),
    'the label does not follow the night that was chosen');
  page.click('[data-slot="sleep-mode-hours"]');
  page.type('sleep-hours', '6.5');
  await page.tapSave();
  assert.equal(page.pick('sleep-error').textContent, '', 'the chosen night had to record');
  assert.deepEqual((await kit.host.forDate(older))[0].night, { date: older, hours: 6.5 },
    'the night was recorded against a date the athlete never chose');

  /* (b) QUALITY IS THE CHECK-IN'S, DISPLAYED AND NEVER ASKED AGAIN. */
  assert.equal(page.pick('sleep-quality').textContent, TodayApp.SLEEP_QUALITY_NONE);
  assert.equal(page.pick('sleep-open-checkin').hidden, false, 'with no quality, offer the check-in');
  const withQuality = screenOn({ model: createTodayModel({ today: DAY }), query: '?screen=sleep',
    mount: { sleep: await laneOver(kit.host),
      checkin: { summary: () => ({ recorded: true }), host: null,
        checkin: { recorded: () => ({ date: DAY, op_id: 'checkin-1',
          answers: { sleep_quality: 'Good', sleep_hours: 7 } }) } } } });
  withQuality.api.render('sleep');
  assert.equal(withQuality.pick('sleep-quality').textContent, TodayApp.SLEEP_QUALITY_PREFIX + 'Good');
  assert.equal(withQuality.pick('sleep-open-checkin').hidden, true, 'and never asks a second time');

  /* (c) A CITED CHECK-IN THIS SCREEN CANNOT SEE IS NOT DATED WITH TODAY'S DATE. */
  const ghost = [{ op_id: 'ghost-1', device_seq: 1, savedDate: '2030-01-15', savedTime: '08:00',
    savedOffset: '+00:00', night: { date: NIGHT, hours: 7, from_checkin_op_id: 'gone' } }];
  const cited = screenOn({ model: createTodayModel({ today: DAY }), query: '?screen=sleep',
    mount: { sleep: { host: null, rows: () => ghost, refresh: async () => ghost,
      save: async () => ({ ok: false }), close() {} } } });
  cited.api.render('sleep');
  const line = cited.pick('sleep-recorded').textContent;
  assert(line.includes(TodayApp.SLEEP_CONFIRMED_PLAIN), 'it must say only what it knows: ' + line);
  assert.equal(line.includes(DAY), false, "today's date was substituted for provenance: " + line);
  kit.host.close();
});

/* FINDING 6. A commit is a fact; a read is a hope; and a late save owns nothing. */
test('N2-05 - D2 finding 6: an acknowledged night survives a failed read, and a late save never navigates', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: firstRunDocument() }) });
  /* (a) THE COMMIT LANDS, THE READ DOES NOT. The op is durable, so the screen may not
     go blank and the typed value may not be thrown away with it. */
  let readFails = true;
  let rows = await kit.host.all();
  const brittle = {
    host: kit.host,
    rows: () => rows,
    async refresh() {
      if (readFails) throw Object.assign(new Error('READ_REFUSED'), { code: 'READ_REFUSED' });
      rows = await kit.host.all(); return rows;
    },
    async save(night, precondition) {
      const result = await kit.host.save(night, precondition);
      if (!result || result.ok !== true) return result;
      try { await this.refresh(); return { ...result, readBack: true, readCode: null }; }
      catch (error) { return { ...result, readBack: false, readCode: error.code }; }
    },
    close() {},
  };
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: brittle } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the night really committed');
  assert.equal(page.pick('sleep-recorded').hidden, false, 'a committed night vanished from the screen');
  assert.match(page.pick('sleep-recorded').textContent, /7\.5 h/, 'and its own figure with it');
  assert.equal(page.api.sleepAck().date, NIGHT);
  assert.equal(page.pick('sleep-bed').value, '23:00', 'what he typed was thrown away');
  assert.equal(page.pick('sleep-read-retry').hidden, false, 'and he was not offered the read again');
  assert.match(page.pick('sleep-error').textContent, /could not refresh/);

  /* The retry is a READ, not a second write, and it settles the screen. */
  readFails = false;
  page.pick('sleep-read-retry').dispatchEvent(new page.dom.window.Event('click'));
  await page.api.sleepPending();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the retry wrote a second op');
  assert.equal(page.api.sleepAck(), null, 'the record can speak for itself now');
  assert.equal(page.pick('sleep-read-retry').hidden, true);
  kit.host.close();
});

test('N2-05 - D2 finding 6: a save that resolves after the athlete has left does not steal the screen', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  let release = null;
  const held = new Promise((resolve) => { release = resolve; });
  let rows = await kit.host.all();
  const slow = {
    host: kit.host,
    rows: () => rows,
    async refresh() { rows = await kit.host.all(); return rows; },
    async save(night, precondition) {
      await held;                                    // the write the athlete did not wait for
      const result = await kit.host.save(night, precondition);
      if (!result || result.ok !== true) return result;
      await this.refresh();
      return { ...result, readBack: true, readCode: null };
    },
    close() {},
  };
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: slow } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  page.pick('sleep-save').dispatchEvent(new page.dom.window.Event('click'));
  /* HE LEAVES while it is in flight. */
  page.api.render('today');
  const onToday = page.text();
  assert.equal(page.api.screen(), 'today');
  release();
  await page.api.sleepPending();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(page.api.screen(), 'today', 'the late save navigated back to its own screen');
  assert.equal(page.text(), onToday, 'and repainted Today from under him');
  assert.equal((await opsOf(kit.host.repository)).length, 1,
    'the write itself still landed, because it was acknowledged');
  kit.host.close();
});

/* FINDING 7. An op carries what it carries; nothing else is news. */
test('N2-13 - D2 finding 7: a same-date overlay keeps unrelated row fields and drops only obsolete clock fields', () => {
  const model = createTodayModel({ today: DAY });
  /* A basis row carrying a member this lane has never heard of - which is precisely
     the case a projector must not destroy. */
  const basis = { sleep: { needed: 8, nights: [
    { d: NIGHT, h: 7, bed: '22:00', wake: '05:00', awakeMin: 15, sourceNote: 'imported from the old app' },
    { d: '2030-02-02', h: 6, sourceNote: 'keep me too' },
  ] } };
  const overlaid = SleepModel.projectSleepNights(basis,
    rowsFor([{ date: NIGHT, hours: 6.25 }]), model.engine);
  const row = SleepModel.loggedNight(overlaid, NIGHT);
  assert.equal(row.h, 6.25, 'the op wins on the member it carries');
  assert.equal(row.sourceNote, 'imported from the old app',
    'the overlay destroyed a field the operation says nothing about');
  assert.equal(Object.hasOwn(row, 'bed'), false, 'and the contradicted clock fields must go');
  assert.equal(Object.hasOwn(row, 'wake'), false);
  assert.equal(Object.hasOwn(row, 'awakeMin'), false);
  /* A TIMES op over the same row keeps the unrelated member and replaces the clock. */
  const timed = SleepModel.projectSleepNights(basis,
    rowsFor([{ date: NIGHT, bed: '23:00', wake: '06:30' }]), model.engine);
  const second = SleepModel.loggedNight(timed, NIGHT);
  assert.equal(second.sourceNote, 'imported from the old app');
  assert.equal(second.bed, '23:00');
  assert.equal(Object.hasOwn(second, 'awakeMin'), false, 'an omitted awake value is not kept');
  /* THE BASIS ITSELF IS NEVER MUTATED. */
  assert.equal(basis.sleep.nights[0].h, 7, 'the basis row was written through');
  assert.equal(basis.sleep.nights[0].bed, '22:00');
  assert.equal(SleepModel.loggedNight(overlaid, '2030-02-02').sourceNote, 'keep me too');
});

/* FINDING 1, the other half. A3's `existing-record` answer is the athlete CONFIRMING a
   night that already exists. It is not where a night comes from, so it may not be cited
   as the origin of one - otherwise a night could cite the check-in that cited it. */
test('N2-01 - D2 finding 1: a confirmed existing record is not the ORIGIN of a night', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const host = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: firstRunDocument() }) });
  /* The night first, so the check-in has something real to confirm. */
  assert.equal((await host.save({ date: NIGHT, hours: 7 })).ok, true);
  model.setSleepNights(await laneOver(host));
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  assert(entry.checkin.sleepRecord, 'the check-in must have found the night to confirm it');
  entry.checkin.draft().confirmSleep();
  assert.equal((await entry.checkin.save()).ok, true);
  const confirmed = entry.checkin.recorded();
  assert.equal(confirmed.answers.sleep_hours_source, 'existing-record',
    'this cell is only meaningful over a CONFIRMATION');

  const cited = await host.save({ date: NIGHT, hours: 7, from_checkin_op_id: confirmed.op_id });
  assert.equal(cited.ok, false, 'a confirmation was accepted as the origin of the night it confirmed');
  assert.equal(cited.code, 'SLEEP_SOURCE_NOT_ENTERED');
  assert.equal((await host.forDate(NIGHT)).length, 1, 'and nothing was appended');
  host.close();
  if (entry.host) entry.host.close();
});
