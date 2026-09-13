/* food.test.mjs - N1 NUTRITION ENTRY (DECISIONS:143), the acceptance bar N1.1-N1.20.

   Real here: the encrypted repository over fake-indexeddb, the accepted durable public
   client, the page's own food lane through `client.hostBindings`, the shipped template
   and the real engine. The projector is never asserted against this file's idea of what
   the engine does: N1.7 replays the same rows through `E.writeDaily` INDEPENDENTLY and
   deep-equals the two states, so a projector that quietly computed something of its own
   fails whatever it computed. */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createFoodHost, foodDaysIn, PROFILE, OP_CLASS, OP_KIND } from '../food-host.mjs';
import FoodCommands from '../food-commands.cjs';
import FoodModel from '../food-model.cjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import design from '../design.cjs';
import Ops from '../../../../client/ops.cjs';
import { createCleanInitState, createSetupModel } from '../setup-model.mjs';
import { buildToday } from '../build.mjs';

const { createTodayModel, SYNTHETIC_DAY, createBasisState, engineClockFor } = TodayModel;
const { mountToday, NOT_WIRED, FOOD_HEAD, FOOD_SAVE, FOOD_SAVED, FOOD_CORRECTION,
  FOOD_NO_TARGETS, FOOD_NOT_PRESCRIBED, FOOD_REFUSAL_COPY, FOOD_REFUSED,
  FOOD_REFUSED_ACTION, FOOD_REASON, FOOD_NO_STORE, FOOD_KEPT_UNREADABLE,
  FOOD_PLAN_UNWIRED, FOOD_SAVED_UNREAD, FOOD_UNKNOWN, FOOD_READ_ACTION,
  FOOD_READ_RETRY } = TodayApp;
const { prepare, validate, dayOf, LIMITS, MEMBERS, ACTION } = FoodCommands;
const DAY = SYNTHETIC_DAY;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const readRepo = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const shaOf = (rel) => createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');
const AI_DASH = /[–—]/;
/* THE CODE, with its prose removed: a file that explains why it does NOT do something
   must not fail a "this never appears" check for saying so (DECISIONS:114 (1)). */
const codeOf = (text) => text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
const NEW_FILES = ['food-commands.cjs', 'food-model.cjs', 'food-host.mjs'];

/* ONE device: one IndexedDB factory is one installation of the local era, so every
   host below is in the SAME sealed generation the other four lanes are in. */
async function device(options = {}) {
  const fault = options.fault || faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const open = (day = DAY) => createFoodHost({ day, ...lane });
  const host = await open();
  return { fault, lane, open, host };
}
const opsOf = async (repository) => Object.values((await repository.load()).generation.collections.ops || {});
const outboxOf = async (repository) => Object.values((await repository.load()).generation.collections.outbox || {});

/* The lane object today-app.cjs builds for itself, built here instead so the tests
   drive the same shape the page does. */
function entryFor(host, rows) {
  let cache = rows;
  return {
    host,
    rows: () => cache,
    async refresh() { cache = await host.all(); return cache; },
    async save(day) {
      const result = await host.save(day);
      if (result && result.ok) await this.refresh();
      return result;
    },
    close() { host.close(); },
  };
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
    async tapSave() {
      pick('food-save').dispatchEvent(new dom.window.Event('click'));
      await api.foodPending();
      await new Promise((resolve) => setTimeout(resolve, 0));
    },
  };
}
const rowsFor = (pairs) => pairs.map(([date, day], index) => ({ op_id: 'op-' + index, date, day }));

/* ==========================================================================
   WHICH ENGINE IS UNDER US (H3 / DECISIONS:142 (3)).

   Two cells below were written against the PRE-H3 engine and say so in their
   own prose: a clean-init athlete has no trend, so every figure derived from
   one is non-finite and the engine refuses to read him at all. H3 makes the
   FIRST weigh-in seed the trend (writers.cjs applyRead, `first`), and with
   that the refusal goes away: the engine answers for him, with a null figure,
   because he still has no reading.

   This file has to be green on BOTH trees - it is one file, and it lands on a
   tree that does not have H3 and stays there after H3 merges - so the two
   cells ask the engine WHICH IT IS and then assert what that engine owes.

   The probe is deliberately not `model.read()` and not `loggedFood()`: those
   are the things the cells themselves assert, and a detector that is also the
   assertion proves nothing on either tree. It is the narrowest neighbouring
   surface that moves with H3 and with nothing else - the engine's own protein
   target for this very athlete, which throws out of the missing
   body-composition anchor before H3 and answers after it. No version string,
   no file bytes, no date: the engine is asked about the athlete in question. */
const H3_SEEDS_FIRST_READ = (() => {
  const clean = createCleanInitState({ setup: firstRunDocument() });
  const engine = createTodayModel({ today: DAY, basisState: clean }).engine;
  try { engine.proteinTarget(clean); return true; }
  catch { return false; }
})();

/* Review C1. The paragraph above is an argument about WHICH SURFACE the detector
   asks, and an argument is not a test: swapping the probe for `model.read()` (the
   surface N1.11 itself asserts) leaves all 56 cells green on this tree, because
   here both surfaces throw. It would only come apart on a tree where they
   disagree, which is the one place this file is supposed to be trustworthy.
   So the probe's own text is pinned, the way this repo already pins PAGE_PINS
   and the design harvest. Comments are stripped first, because the prose around
   the detector deliberately names the very calls this forbids. */
test('H3 probe - the detector asks the ENGINE, not the surface the cells assert', () => {
  const own = codeOf(readRepo('rebuild/m3/w7-preview/today/test/food.test.mjs'));
  const start = own.indexOf('const H3_SEEDS_FIRST_READ');
  assert(start > 0, 'the engine detector is gone');
  const end = own.indexOf('})();', start);
  assert(end > start, 'the engine detector is not the IIFE it was');
  const probe = own.slice(start, end);
  assert(probe.includes('engine.proteinTarget(clean)'),
    'the probe no longer asks the engine for this athlete: ' + probe);
  /* and it must not be any of the things the two cells go on to assert */
  assert.equal(/\.read\(\)/.test(probe), false, 'the probe became model.read(), which N1.11 asserts');
  assert.equal(/loggedFood\(/.test(probe), false, 'the probe became loggedFood(), which D2.1 asserts');
  assert.equal(/foodUnavailable\(/.test(probe), false, 'the probe became foodUnavailable(), which D2.1 asserts');
});

/* THE FIRST RUN'S OWN DOCUMENT, built through the accepted reducer rather than by
   hand, so the clean-init athlete N1.11 uses is the athlete A4 actually creates: a
   hand-written setup object is refused by createCleanInitState, and a fixture that
   drifted from the contract would fail here rather than quietly describe nobody. */
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
   N1.1 / N1.2 - THE PRODUCER, AND THE ACCEPTED CLASS IT WRITES.
   ========================================================================== */
test('N1.1 - the producer builds ONE food-day fact of the accepted envelope', () => {
  const action = prepare({ action: ACTION, input: { day: { cal: 2100, pro: 150 } } });
  assert.equal(action.class, OP_CLASS);
  assert.equal(action.kind, OP_KIND);
  assert.deepEqual(Object.keys(action.payload), ['profile', 'day']);
  assert.equal(action.payload.profile, PROFILE);
  assert.deepEqual(action.payload.day, { cal: 2100, pro: 150 });
  assert.deepEqual(action.parents, []);
});

test('N1.2 - the class and kind are read out of rebuild/client/ops.cjs at test time', () => {
  /* Not restated from the brief: the accepted lists themselves. A class this lane
     invented would fail here, whatever the brief said. */
  assert(Array.isArray(Ops.CLASSES), 'the accepted client still publishes CLASSES');
  assert(Ops.CLASSES.includes(OP_CLASS), OP_CLASS + ' is not an accepted class: ' + Ops.CLASSES);
  assert(Ops.KINDS.includes(OP_KIND), OP_KIND + ' is not an accepted kind: ' + Ops.KINDS);
  /* And the source says the same, so a list rebuilt at runtime cannot hide a change. */
  const source = readRepo('rebuild/client/ops.cjs');
  assert(source.includes('"' + OP_CLASS + '"') || source.includes("'" + OP_CLASS + "'"),
    'the class is not spelled in the accepted source');
});

test('N1.1 - the producer refuses every request that is not its own', () => {
  const good = { day: { cal: 2100 } };
  assert.throws(() => prepare({ action: 'checkin', input: good }), /FOOD_INPUT_INVALID/);
  assert.throws(() => prepare({ action: ACTION, input: good, extra: 1 }), /FOOD_INPUT_INVALID/);
  assert.throws(() => prepare({ action: ACTION }), /FOOD_INPUT_INVALID/);
  assert.throws(() => prepare({ action: ACTION, input: { day: good.day, steps: 10 } }), /FOOD_INPUT_INVALID/);
  assert.throws(() => prepare(null), /FOOD_INPUT_INVALID/);
});

test('N1.3 - at least one of cal or pro is required, and an empty day writes nothing', () => {
  assert.throws(() => dayOf({}), /FOOD_INPUT_INVALID/);
  assert.throws(() => prepare({ action: ACTION, input: { day: {} } }), /FOOD_INPUT_INVALID/);
  assert.deepEqual(dayOf({ cal: 1800 }), { cal: 1800 });
  assert.deepEqual(dayOf({ pro: 120 }), { pro: 120 });
});

test('N1.3 - an unanswered figure is ABSENT, never null and never zero', () => {
  const action = prepare({ action: ACTION, input: { day: { pro: 140 } } });
  assert.deepEqual(Object.keys(action.payload.day), ['pro']);
  assert.equal(Object.hasOwn(action.payload.day, 'cal'), false, 'cal is absent, not null');
  assert.throws(() => dayOf({ cal: null, pro: 140 }), /FOOD_INPUT_INVALID/);
  assert.throws(() => dayOf({ cal: undefined, pro: 140 }), /FOOD_INPUT_INVALID/,
    'an explicit undefined is still a named key and is refused');
  /* Zero is a real answer and is allowed - it is just never INVENTED for a blank. */
  assert.deepEqual(dayOf({ cal: 0 }), { cal: 0 });
});

test('N1.4 - every bound refuses at the producer, and nothing is clamped', () => {
  for (const bad of [2100.5, -1, LIMITS.cal.max + 1, '2100', NaN, Infinity, {}, []]) {
    assert.throws(() => dayOf({ cal: bad }), /FOOD_INPUT_INVALID/, 'cal ' + String(bad));
  }
  for (const bad of [150.5, -1, LIMITS.pro.max + 1, '150', NaN]) {
    assert.throws(() => dayOf({ pro: bad }), /FOOD_INPUT_INVALID/, 'pro ' + String(bad));
  }
  assert.deepEqual(dayOf({ cal: LIMITS.cal.max, pro: LIMITS.pro.max }),
    { cal: LIMITS.cal.max, pro: LIMITS.pro.max }, 'the bound itself is allowed');
  assert.deepEqual(dayOf({ cal: LIMITS.cal.min, pro: LIMITS.pro.min }),
    { cal: LIMITS.cal.min, pro: LIMITS.pro.min });
});

test('N1.1 - the provenance triple is carried, and a malformed one refuses', () => {
  const effective = { local_date: DAY, local_time: '21:40:00', utc_offset: '-05:00' };
  const action = prepare({ action: ACTION, input: { day: { cal: 2000 }, effective } });
  assert.deepEqual(action.effective, effective);
  for (const broken of [{ local_date: DAY }, { ...effective, extra: 'x' },
    { ...effective, utc_offset: 5 }, 'today']) {
    assert.throws(() => prepare({ action: ACTION, input: { day: { cal: 2000 }, effective: broken } }),
      /FOOD_INPUT_INVALID/);
  }
});

test('N1.1 - validate accepts this lane own envelope and refuses everything else', () => {
  const op = { kind: OP_KIND, class: OP_CLASS, athlete_id: 'owner', causal_parents: [],
    effective: { local_date: DAY, local_time: '08:00:00', utc_offset: '-05:00' },
    payload: { profile: PROFILE, day: { cal: 2100, pro: 150 } } };
  const none = () => null;
  assert.equal(validate(op, none), true);
  assert.equal(validate({ ...op, class: 'reading' }, none), false);
  assert.equal(validate({ ...op, kind: 'tombstone' }, none), false);
  assert.equal(validate({ ...op, payload: { profile: 'earned/other/v1', day: { cal: 1 } } }, none), false);
  assert.equal(validate({ ...op, payload: { profile: PROFILE, day: { cal: 1 }, extra: 2 } }, none), false);
  assert.equal(validate({ ...op, payload: { profile: PROFILE, day: {} } }, none), false);
  assert.equal(validate({ ...op, payload: { profile: PROFILE, day: { cal: 1.5 } } }, none), false);
  assert.equal(validate({ ...op, effective: { local_date: 'today' } }, none), false);
});

test('N1.1 - validate refuses a causal parent the log does not hold, or another athlete', () => {
  const op = { kind: OP_KIND, class: OP_CLASS, athlete_id: 'owner', causal_parents: ['op-1'],
    effective: { local_date: DAY, local_time: '08:00:00', utc_offset: '-05:00' },
    payload: { profile: PROFILE, day: { cal: 2100 } } };
  assert.equal(validate(op, () => null), false, 'a parent the log does not hold');
  assert.equal(validate(op, () => ({ athlete_id: 'someone-else' })), false, 'another athlete');
  assert.equal(validate(op, () => ({ athlete_id: 'owner' })), true);
});

/* ==========================================================================
   N1.3 / N1.4 - THE SCREEN'S RULE, AND ITS WORDS.
   ========================================================================== */
test('N1.4 - refusalFor names the refusal for every entry the screen can produce', () => {
  assert.equal(FoodModel.refusalFor({ cal: '', pro: '' }), 'NOTHING');
  assert.equal(FoodModel.refusalFor({}), 'NOTHING');
  assert.equal(FoodModel.refusalFor({ cal: '2100', pro: '150' }), null);
  assert.equal(FoodModel.refusalFor({ cal: '2100', pro: '' }), null);
  assert.equal(FoodModel.refusalFor({ cal: '2100.5' }), 'CAL_RANGE');
  assert.equal(FoodModel.refusalFor({ cal: '-3' }), 'CAL_RANGE');
  assert.equal(FoodModel.refusalFor({ cal: '20001' }), 'CAL_RANGE');
  assert.equal(FoodModel.refusalFor({ cal: 'lots' }), 'CAL_RANGE');
  assert.equal(FoodModel.refusalFor({ pro: '1001' }), 'PRO_RANGE');
  assert.equal(FoodModel.refusalFor({ pro: 'some' }), 'PRO_RANGE');
});

test('N1.3 - dayFromEntry leaves an unanswered box out, and refuses rather than guessing', () => {
  assert.deepEqual(FoodModel.dayFromEntry({ cal: '2100', pro: '' }), { cal: 2100 });
  assert.deepEqual(FoodModel.dayFromEntry({ cal: '', pro: '150' }), { pro: 150 });
  assert.deepEqual(FoodModel.dayFromEntry({ cal: ' 2100 ', pro: '150' }), { cal: 2100, pro: 150 });
  assert.equal(FoodModel.dayFromEntry({ cal: '', pro: '' }), null);
  assert.equal(FoodModel.dayFromEntry({ cal: '2100.5' }), null);
});

test('N1.4 - every refusal code has a sentence, and no sentence is orphaned', () => {
  const codes = Object.keys(FoodModel.REFUSALS);
  assert.deepEqual(codes.sort(), Object.keys(FOOD_REFUSAL_COPY).sort(),
    'the rule and the wording name the same refusals');
  for (const code of codes) {
    const line = FOOD_REFUSAL_COPY[code];
    assert(typeof line === 'string' && line.length > 0, code);
    assert(/Nothing was recorded\.$/.test(line), 'a refusal says nothing was recorded: ' + line);
    assert.equal(AI_DASH.test(line), false, line);
  }
});

/* ==========================================================================
   N1.7 / N1.8 / N1.9 - THE PROJECTOR, AGAINST THE ENGINE ITSELF.
   ========================================================================== */
test('N1.6 - winningRows keeps the LAST row for each date, date-ascending', () => {
  const rows = rowsFor([['2026-09-01', { cal: 1 }], ['2026-09-03', { cal: 2 }],
    ['2026-09-01', { cal: 3 }], ['2026-09-02', { pro: 4 }], ['2026-09-01', { cal: 5 }]]);
  const won = FoodModel.winningRows(rows);
  assert.deepEqual(won.map((r) => r.date), ['2026-09-01', '2026-09-02', '2026-09-03']);
  assert.deepEqual(won[0].day, { cal: 5 }, 'the latest op for that date wins');
  assert.deepEqual(won[2].day, { cal: 2 });
});

test('N1.6 - a row that is not a dated day is ignored rather than guessed at', () => {
  const rows = [{ date: 'today', day: { cal: 1 } }, { date: '2026-09-01' }, null,
    { date: '2026-09-02', day: { pro: 3 } }];
  assert.deepEqual(FoodModel.winningRows(rows).map((r) => r.date), ['2026-09-02']);
});

test('N1.7 - the projector EQUALS the engine: an independent replay is byte-identical', () => {
  const model = createTodayModel({ today: DAY });
  const E = model.engine;
  const rows = rowsFor([['2026-09-01', { cal: 2100, pro: 150 }], ['2026-09-02', { pro: 140 }],
    ['2026-09-03', { cal: 1900 }], ['2026-09-01', { cal: 2200, pro: 160 }]]);
  const mine = FoodModel.projectFoodDays(createBasisState(DAY), rows, E);
  /* The independent replay, written here rather than imported: the winning row per
     date, date-ascending, straight through the engine's own writer. */
  const winners = new Map();
  for (const row of rows) winners.set(row.date, row);
  let theirs = createBasisState(DAY);
  for (const date of [...winners.keys()].sort()) {
    theirs = E.writeDaily(theirs, date, winners.get(date).day);
  }
  assert.deepEqual(mine, theirs, 'the projector computed something of its own');
  assert.equal(typeof E.writeDaily, 'function', 'the engine writer really is on the composition');
});

test('N1.8 - a missing day is ABSENT from dailyLogs, and no zero is ever written', () => {
  const model = createTodayModel({ today: DAY });
  const before = createBasisState(DAY);
  const after = FoodModel.projectFoodDays(before, rowsFor([['2026-09-02', { cal: 2000 }]]), model.engine);
  assert.equal(Object.hasOwn(after.dailyLogs || {}, '2026-09-01'), false, 'an unentered day is absent');
  const row = after.dailyLogs['2026-09-02'];
  assert.equal(row.cal, 2000);
  assert.equal(row.pro === undefined || row.pro === null, true,
    'a member the op did not carry is not a figure: ' + JSON.stringify(row));
  /* The engine readers filter on `!= null`, which is why an absent day is absent from
     every average rather than a zero dragging it down. Asserted on the engine's own
     rows rather than restated. */
  assert.equal(FoodModel.loggedDay(after, '2026-09-01'), null);
  assert.deepEqual(FoodModel.loggedDay(after, '2026-09-02'), { cal: 2000, pro: null });
});

test('N1.9 - writeDaily partial merge does not leak across ops: a correction replaces the day', () => {
  const model = createTodayModel({ today: DAY });
  const rows = rowsFor([['2026-09-02', { cal: 2400, pro: 120 }], ['2026-09-02', { pro: 155 }]]);
  const state = FoodModel.projectFoodDays(createBasisState(DAY), rows, model.engine);
  const row = state.dailyLogs['2026-09-02'];
  assert.equal(row.pro, 155, 'the winning op is the one that counts');
  assert.equal(row.cal === undefined || row.cal === null, true,
    'the calories it does not carry are GONE, not stale: ' + JSON.stringify(row));
  assert.deepEqual(FoodModel.loggedDay(state, '2026-09-02'), { cal: null, pro: 155 });
});

test('N1.7 - with no rows the projector writes nothing at all', () => {
  const model = createTodayModel({ today: DAY });
  const before = createBasisState(DAY);
  assert.deepEqual(FoodModel.projectFoodDays(before, [], model.engine), before);
  assert.deepEqual(FoodModel.projectFoodDays(before, null, model.engine), before);
  assert.deepEqual(FoodModel.projectFoodDays(before, [{ date: '2026-09-02', day: {} }], model.engine),
    before, 'an empty day is not a write');
});

/* ==========================================================================
   N1.5 / N1.6 / N1.10 - THE DURABLE LANE, ON THE REAL STACK.
   ========================================================================== */
test('N1.5 - one save is ONE operation and its outbox entry, in one transaction', async () => {
  const kit = await device();
  assert.deepEqual(await opsOf(kit.host.repository), []);
  const written = await kit.host.save({ cal: 2100, pro: 150 });
  assert.equal(written.ok, true, written.code);
  const ops = await opsOf(kit.host.repository);
  const outbox = await outboxOf(kit.host.repository);
  assert.equal(ops.length, 1);
  assert.equal(outbox.length, 1, 'the outbox entry co-exists with the operation');
  assert.equal(ops[0].class, OP_CLASS);
  assert.equal(ops[0].kind, OP_KIND);
  assert.equal(ops[0].payload.profile, PROFILE);
  assert.deepEqual(ops[0].payload.day, { cal: 2100, pro: 150 });
  assert.equal(typeof ops[0].canonical_content_commitment, 'string');
  assert.equal(ops[0].op_id, written.op_id, 'the id reported is the id the CLIENT minted');
  kit.host.close();
});

test('N1.5 - a refused entry writes NO part of itself', async () => {
  const kit = await device();
  const refused = await kit.host.save({ cal: 2100.5 });
  assert.equal(refused.ok, false);
  assert.deepEqual(await opsOf(kit.host.repository), [], 'nothing was written');
  assert.deepEqual(await outboxOf(kit.host.repository), []);
  const empty = await kit.host.save({});
  assert.equal(empty.ok, false);
  assert.deepEqual(await opsOf(kit.host.repository), []);
  kit.host.close();
});

test('N1.5 - the read-back carries the date, the time, the offset and the day', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ cal: 1800 })).ok, true);
  const rows = await kit.host.all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].date, DAY);
  assert.match(rows[0].time, /^\d{2}:\d{2}(:\d{2})?$/);
  assert.match(rows[0].offset, /^[+-]\d{2}:\d{2}$/);
  assert.deepEqual(rows[0].day, { cal: 1800 });
  assert.deepEqual(await kit.host.forDate(DAY), rows);
  assert.deepEqual(await kit.host.forDate('2026-09-01'), []);
  kit.host.close();
});

test('N1.6 - three saves leave THREE operations and ONE projected row', async () => {
  const kit = await device();
  for (const day of [{ cal: 2000 }, { cal: 2100, pro: 150 }, { cal: 1950, pro: 160 }]) {
    assert.equal((await kit.host.save(day)).ok, true);
  }
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, 3, 'a correction is a NEW op; nothing is updated or deleted');
  const rows = await kit.host.all();
  assert.equal(rows.length, 3);
  const model = createTodayModel({ today: DAY, foodDays: { rows: () => rows } });
  const state = model.stateFromOps();
  assert.equal(Object.keys(state.dailyLogs || {}).filter((d) => d === DAY).length, 1);
  assert.deepEqual(FoodModel.loggedDay(state, DAY), { cal: 1950, pro: 160 }, 'the LAST one wins');
  kit.host.close();
});

test('N1.10 - the intake survives a new host over the same encrypted store', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ cal: 2250, pro: 165 })).ok, true);
  kit.host.close();
  const again = await kit.open();
  const rows = await again.all();
  assert.equal(rows.length, 1, 'a relaunch reads it off disk');
  assert.deepEqual(rows[0].day, { cal: 2250, pro: 165 });
  again.close();
});

test('N1.10 - a second day is its own row, and neither day touches the other', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ cal: 2000 })).ok, true);
  /* The next day is the next LAUNCH of the page, not a second lane open beside the
     first: one installation holds one authority lease, so the day before is closed
     before the day after opens. */
  kit.host.close();
  const TOMORROW = '2030-02-05';
  const second = await kit.open(TOMORROW);
  assert.equal((await second.save({ pro: 130 })).ok, true);
  const rows = await second.all();
  assert.equal(rows.length, 2);
  const model = createTodayModel({ today: DAY, foodDays: { rows: () => rows } });
  const state = model.stateFromOps();
  assert.deepEqual(FoodModel.loggedDay(state, DAY), { cal: 2000, pro: null });
  assert.deepEqual(FoodModel.loggedDay(state, TOMORROW), { cal: null, pro: 130 });
  second.close();
});

test('N1.5 - this lane reads back ONLY its own facts out of the one generation', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ cal: 2100 })).ok, true);
  const generation = (await kit.host.repository.load()).generation;
  assert.equal(foodDaysIn(generation).length, 1);
  assert.equal(foodDaysIn(generation, 'earned/other/v1').length, 0,
    'the profile match is what isolates this lane in one generation');
  kit.host.close();
});

test('N1.5 - a closed lane refuses in the client own shape and writes nothing', async () => {
  const kit = await device();
  kit.host.close();
  const refused = await kit.host.save({ cal: 2000 });
  assert.equal(refused.ok, false);
  assert.equal(refused.code, 'LOCAL_CLIENT_CLOSED');
});

test('N1.10 - the model replays readings AND food days into one state', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ cal: 2100, pro: 150 })).ok, true);
  const rows = await kit.host.all();
  const model = createTodayModel({ today: DAY, foodDays: { rows: () => rows } });
  const state = model.stateFromOps();
  assert.deepEqual(FoodModel.loggedDay(state, DAY), { cal: 2100, pro: 150 });
  /* The reading replay is untouched by the food replay: the basis still carries the
     fixture's own reads, and dailyLogs is the only thing N1 wrote into. */
  const without = createTodayModel({ today: DAY }).stateFromOps();
  assert.deepEqual(state.reads, without.reads, 'N1 did not touch the reading replay');
  assert.equal(model.storedFoodDays().length, 1);
  assert.deepEqual(model.loggedFood(DAY), { cal: 2100, pro: 150 });
  kit.host.close();
});

test('N1.10 - the lane can be attached after the model was built, as the page does', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ pro: 175 })).ok, true);
  const model = createTodayModel({ today: DAY });
  assert.equal(model.loggedFood(DAY), null, 'no lane, no row');
  model.setFoodDays(await laneOver(kit.host));
  assert.deepEqual(model.loggedFood(DAY), { cal: null, pro: 175 });
  model.setFoodDays(null);
  assert.equal(model.loggedFood(DAY), null, 'and detaching it takes the rows away again');
  kit.host.close();
});

/* ==========================================================================
   THE SCREEN: N1.11 to N1.16, and N1.19.
   ========================================================================== */
/* D2 round 1, finding 3 (BLOCKING, P2). The ONLY sentence here used to be the unwired
   one, which answered none of the three questions a refusal owes the athlete. What is
   true of a device with no entry is that THIS DEVICE would not give the page a store,
   and that sentence now comes first, with the store's own reason and the action. The
   unwired sentence stays last because the nutrition PLAN behind this tile really is
   unbuilt, and because view.test.mjs, which asserts it, is pinned on disk by B-NTC. */
test('N1.16 / D2.3 - with no store the nutrition screen says so, and offers no entry', () => {
  const kit = screenOn();
  kit.doc.querySelector('[data-go="nutrition"]').click();
  const note = kit.pick('stub-note').textContent;
  assert(note.startsWith(FOOD_NO_STORE), 'what cannot happen, and what to do FIRST: ' + note);
  assert(note.includes(FOOD_REASON + 'NO_LOCAL_STORE.'), 'and why: jsdom offers no store');
  /* The unwired sentence survives, LAST, and describes the PLAN rather than the entry:
     view.test.mjs is pinned on disk by B-NTC and asserts it here. */
  assert(note.endsWith(FOOD_PLAN_UNWIRED), 'the plan behind this tile is still unbuilt');
  assert.equal(note.indexOf('not wired yet') > note.indexOf(FOOD_REASON), true,
    'it never comes before the sentence he can act on');
  assert.equal(kit.pick('food-entry').hidden, true, 'and offers no entry it cannot keep');
  const rows = [...kit.doc.querySelectorAll('.macro-row')].map((r) => r.textContent);
  assert.equal(rows.length, 4);
});

test('N1.13 - carbohydrate and fat are named as not prescribed, with no figure', () => {
  const kit = screenOn();
  kit.doc.querySelector('[data-go="nutrition"]').click();
  const rows = [...kit.doc.querySelectorAll('.macro-row')].map((r) => r.textContent);
  assert.match(rows[2], /Carbohydrate/);
  assert.match(rows[2], /Not prescribed/);
  assert.match(rows[3], /Fat/);
  assert.match(rows[3], /Not prescribed/);
  assert.doesNotMatch(rows[2] + rows[3], /\d/, 'no carbohydrate or fat figure is invented');
  assert.equal(/carb/i.test(FOOD_NOT_PRESCRIBED) && /fat/i.test(FOOD_NOT_PRESCRIBED), true);
});

test('N1.12 - with a lane the entry is on the screen, in its own words', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { food: await laneOver(kit.host) } });
  page.api.render('nutrition');
  assert.equal(page.pick('food-entry').hidden, false);
  assert.equal(page.pick('food-head').textContent, FOOD_HEAD);
  assert.equal(page.pick('food-save-label').textContent, FOOD_SAVE);
  assert.equal(page.doc.querySelector('#food-cal').value, '', 'both boxes start blank');
  assert.equal(page.doc.querySelector('#food-pro').value, '');
  assert.doesNotMatch(page.text(), /not wired yet/, 'the entry is wired now');
  assert.match(page.text(), /Not prescribed/);
  kit.host.close();
});

test('N1.5 - the screen records ONE operation, and reads it back from the engine', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { food: await laneOver(kit.host) } });
  page.api.render('nutrition');
  page.doc.querySelector('#food-cal').value = '2100';
  page.doc.querySelector('#food-pro').value = '150';
  await page.tapSave();
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, 1, 'one tap, one operation');
  assert.deepEqual(ops[0].payload.day, { cal: 2100, pro: 150 });
  assert.deepEqual(model.loggedFood(DAY), { cal: 2100, pro: 150 }, 'and the engine holds it');
  assert.match(page.pick('food-recorded').textContent, /Recorded today/);
  assert.match(page.pick('food-recorded').textContent, /2,100 kcal/);
  assert.match(page.pick('food-recorded').textContent, /150 g protein/);
  assert.equal(page.pick('food-recorded').hidden, false);
  kit.host.close();
});

test('N1.4 - the screen refuses in its own words and records nothing at all', async () => {
  const kit = await device();
  const page = screenOn({ model: createTodayModel({ today: DAY }), mount: { food: await laneOver(kit.host) } });
  page.api.render('nutrition');
  for (const [cal, pro, code] of [['', '', 'NOTHING'], ['2100.5', '', 'CAL_RANGE'],
    ['-5', '', 'CAL_RANGE'], ['20001', '', 'CAL_RANGE'], ['', '1001', 'PRO_RANGE'],
    /* A word typed into a number box never reaches the rule: the platform drops it and
       the box reads back empty, so the screen refuses as an EMPTY entry. The rule's own
       answer for the word itself is asserted purely, above (refusalFor). */
    ['', 'lots', 'NOTHING']]) {
    page.doc.querySelector('#food-cal').value = cal;
    page.doc.querySelector('#food-pro').value = pro;
    await page.tapSave();
    assert.equal(page.pick('food-error').textContent, FOOD_REFUSAL_COPY[code],
      'refusal for ' + JSON.stringify([cal, pro]));
    assert.deepEqual(await opsOf(kit.host.repository), [], 'and nothing was written');
  }
  kit.host.close();
});

test('N1.6 - a second entry for the same day is a CORRECTION: a new op, the latest wins', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { food: await laneOver(kit.host) } });
  page.api.render('nutrition');
  page.doc.querySelector('#food-cal').value = '2400';
  await page.tapSave();
  assert.deepEqual(model.loggedFood(DAY), { cal: 2400, pro: null });
  assert.match(page.pick('food-recorded').textContent, /replaces today/);
  page.doc.querySelector('#food-pro').value = '165';
  page.doc.querySelector('#food-cal').value = '';
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 2, 'two operations, nothing updated');
  assert.deepEqual(model.loggedFood(DAY), { cal: null, pro: 165 },
    'the winning op carries the whole day: the replaced calories are gone');
  kit.host.close();
});

test('N1.11 - H3: a clean-init athlete gets NO INVENTED figure, and a working entry', async () => {
  /* Executed rather than asserted from the brief, on whichever engine is under us. */
  const clean = createCleanInitState({ setup: firstRunDocument() });
  const model = createTodayModel({ today: DAY, basisState: clean });
  if (H3_SEEDS_FIRST_READ) {
    /* H3. The engine now ANSWERS for this athlete rather than throwing - he has a
       trend the moment he weighs in - so Today can read him. He still has no
       reading here, so what it reads back is a plan with no figures in it. */
    assert.doesNotThrow(() => model.read(), 'H3 reads a clean-init athlete without throwing');
  } else {
    /* Pre-H3. The engine does not return a blocked view for this athlete: it
       THROWS, out of energy.cjs, because there is no body-composition estimate to
       build a band on. That is the fact H3 changes, executed here, not quoted. */
    assert.throws(() => model.read(), /./, 'the engine cannot produce a plan for a clean-init athlete yet');
  }
  const kit = await device();
  /* Landed on nutrition, as ?screen= does, so the unreadable view is met by the one
     screen that knows how to say so rather than by Today. */
  const page = screenOn({ model, query: '?screen=nutrition', mount: { food: await laneOver(kit.host) } });
  page.api.render('nutrition');
  /* THE INVARIANT, on both trees and the whole point of the cell: whatever the
     engine does with him, NOTHING on this screen invents a figure for an athlete
     who has declared no bodyweight. Pre-H3 that is said by printing no macro row
     at all and giving the reason; on H3 the rows exist but every one of them
     reads "Not prescribed". Neither may carry a digit. */
  const rows = [...page.doc.querySelectorAll('.macro-row')];
  for (const row of rows) {
    assert.doesNotMatch(row.textContent, /\d/, 'a macro row invented a figure: ' + row.textContent);
  }
  assert.doesNotMatch(page.pick('stub-note').textContent, /\d/, 'and no number in the reason');
  if (H3_SEEDS_FIRST_READ) {
    assert.equal(rows.length, 4, 'H3 shows the four macro rows');
    for (const row of rows) {
      assert.match(row.textContent, /Not prescribed/, 'and says so in words: ' + row.textContent);
    }
  } else {
    assert.equal(rows.length, 0, 'NO figure at all');
    assert.equal(page.pick('stub-note').textContent, FOOD_NO_TARGETS);
  }
  /* And his intake is still his fact, on either engine. */
  assert.equal(page.pick('food-entry').hidden, false);
  page.doc.querySelector('#food-cal').value = '1800';
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the entry still records');
  /* Unbranched on purpose. A CALORIE-only day replays on both engines: the owed
     ledger is consulted for protein, and it is protein alone that the pre-H3
     engine refuses (see D2.1). Branching here would have hidden that. */
  assert.deepEqual(model.loggedFood(DAY), { cal: 1800, pro: null });
  kit.host.close();
});

test('N1.19 - Today says what the DURABLE record says, and A1 marker until there is a lane', async () => {
  const bare = screenOn();
  assert.equal(bare.pick('nutrition-state').textContent, NOT_WIRED,
    'no lane on this device, and the marker that has always described it');
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const lane = await laneOver(kit.host);
  const page = screenOn({ model, mount: { food: lane } });
  assert.equal(page.pick('nutrition-state').textContent, '',
    'a lane with nothing recorded says NOTHING, never a placeholder');
  assert.equal((await lane.save({ cal: 2000 })).ok, true);
  page.api.render('today');
  assert.equal(page.pick('nutrition-state').textContent, FOOD_SAVED);
  kit.host.close();
});

test('N1.19 - the nutrition route does not touch first-run or restore-required', () => {
  /* The route is reachable from Today and from nowhere else; it neither offers
     enrolment nor re-enrols, and a page with no setup lane still reaches it. */
  const source = readRepo('rebuild/m3/w7-preview/today/today-app.cjs');
  const route = source.slice(source.indexOf('if (next === "setup"'), source.indexOf('if (next === "why")'));
  assert(route.includes('firstRun()'), 'the setup refusal is where it was');
  for (const file of NEW_FILES) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    assert.equal(/firstRun|enrol|RESTORE_REQUIRED/i.test(text), false,
      file + ' has nothing to say about enrolment');
  }
});

test('N1.15 - no em or en dash in N1 own sources, its template or its rendered screen', async () => {
  for (const file of [...NEW_FILES, 'today-app.cjs', 'today-model.cjs']) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    /* Comments are not the athlete's text (DECISIONS:114 (1)); string literals are. */
    for (const match of text.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)) {
      const literal = match[1] === undefined ? match[2] : match[1];
      assert.equal(AI_DASH.test(literal), false, file + ' string literal: ' + literal);
    }
  }
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-nutrition">');
  const section = template.slice(start, template.indexOf('</template>', start));
  assert.equal(AI_DASH.test(section), false, 'the shipped nutrition template');
  const kit = await device();
  const page = screenOn({ model: createTodayModel({ today: DAY }), mount: { food: await laneOver(kit.host) } });
  page.api.render('nutrition');
  assert.equal(AI_DASH.test(page.text()), false, 'the rendered screen');
  kit.host.close();
});

test('N1.14 - the design binding covers the entry, and REFUSES a dropped sentence', () => {
  const approved = design.readApproved();
  const source = design.appSource();
  const approvedText = approved.map((a) => a.html).join('\n');
  for (const line of [FOOD_HEAD, FOOD_SAVE, FOOD_CORRECTION, FOOD_NO_TARGETS, FOOD_REFUSED,
    ...Object.values(FOOD_REFUSAL_COPY)]) {
    assert(design.PREVIEW_RUNTIME_COPY.includes(line), 'declared: ' + line);
    assert.equal(approvedText.includes(line), false, 'preview-owned, so ABSENT upstream: ' + line);
    assert(source.includes(line), 'present in a view source: ' + line);
  }
  assert.doesNotThrow(() => design.assertDesignBinding(approved, design.templateHtml(), source));
  assert.throws(() => design.assertDesignBinding(approved, design.templateHtml(),
    source.split(FOOD_SAVE).join('')), /COPY-BINDING FAIL/);
});

test('N1.14 - every class the entry uses is a selector in the APPROVED stylesheets', () => {
  const approved = design.readApproved();
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-nutrition">');
  const section = template.slice(start, template.indexOf('</template>', start));
  assert(section.includes('data-slot="food-entry"'), 'the entry is in the shipped template');
  const css = approved.map((a) => a.styles).join('\n');
  for (const token of design.classTokens(section)) {
    if (design.PREVIEW_CLASSES.includes(token)) continue;
    const selector = new RegExp('\\.' + token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w-])');
    assert(selector.test(css), '.' + token + ' is not in the approved stylesheets');
  }
  for (const line of design.textOf(section)) {
    assert.equal(/\d/.test(line), false, 'the template carries a literal figure: "' + line + '"');
  }
});

test('N1.16 - the entry sets no width a 390px or 320px phone cannot hold', () => {
  /* The geometry itself is food-check.mjs's row in a real browser; what is asserted
     here is that N1 invented no fixed width and no class of its own to carry one. */
  const css = design.chromeCss();
  assert.equal(/\.food/.test(css), false, 'N1 invents no class');
  for (const file of ['today-app.cjs', ...NEW_FILES]) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    /* `stroke-width` on the shipped chevron is not a layout width, so the property
       may not be preceded by a hyphen or a word character. */
    assert.equal(/(?<![-\w])(min-width|width)\s*[:=]\s*['"]?\d/.test(text), false, file + ' sets a width');
  }
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-nutrition">');
  const section = template.slice(start, template.indexOf('</template>', start));
  assert.equal(/style="/.test(section), false, 'no inline style on the entry');
  /* The boxes take the approved numeric control's class, which preview.css already
     holds at 16px for exactly the iOS zoom reason A3 named. */
  assert(section.includes('class="hours"'), 'the boxes are the approved direct-entry control');
  assert.match(css, /\.view \.hours,?[\s\S]{0,80}font-size: 16px/);
});

test('N1.18 - today-bindings.mjs and the four PAGE_PINS files are BYTE-UNCHANGED', () => {
  const pkg = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/B-NTC.json'));
  const pinned = 'rebuild/m3/w6/local/today-bindings.mjs';
  assert(pkg.product[pinned], 'the package still pins it');
  assert.equal(shaOf(pinned), pkg.product[pinned].post,
    'N1 must not touch a file the B-NTC artifact pins ON DISK (DECISIONS:144)');
  const journey = readRepo('rebuild/m3/w6/test/local-today-journey.test.mjs');
  assert.equal(shaOf('rebuild/m3/w6/test/local-today-journey.test.mjs'),
    pkg.product['rebuild/m3/w6/test/local-today-journey.test.mjs'].post);
  for (const name of ['today-entry.mjs', 'gym-host.mjs', 'reading-host.mjs', 'checkin-host.mjs']) {
    const pin = new RegExp("'" + name.replace('.', '\\.') + "':\\s*'([a-f0-9]{64})'").exec(journey);
    assert(pin, 'PAGE_PINS still pins ' + name);
    assert.equal(shaOf('rebuild/m3/w7-preview/today/' + name), pin[1],
      name + ' must stay byte-identical: N1 opens its lane through client.hostBindings instead');
  }
});

test('N1.18 - the lane really is opened through client.hostBindings, not a w6 factory', () => {
  const source = readRepo('rebuild/m3/w7-preview/today/food-host.mjs');
  assert(source.includes('era.client.hostBindings('), 'the honest extension point');
  /* The header EXPLAINS which factories this lane does not call, and a file that says
     why it does not do something must not fail for saying so (DECISIONS:114 (1)). */
  assert.equal(/era\.create(Reading|Gym|CheckIn|Setup|Food)Host/.test(codeOf(source)), false,
    'no w6 factory is asked for a fifth lane');
  assert(source.includes('createDurablePublicClient'), 'the accepted durable client');
  assert(source.includes('LOCAL_ERA_SCHEMA_VERSION'), 'the era own lease schema');
});

test('N1.17 - the build carries N1 three modules and still names no network', async () => {
  const result = await buildToday();
  for (const file of NEW_FILES) {
    assert(result.inputs.includes('rebuild/m3/w7-preview/today/' + file),
      file + ' is not in the built page');
  }
  assert.equal(result.assets.length, 3);
  /* assertNoNetworkReference and the dash guard both ran inside buildToday; a failure
     of either would have thrown before this line. */
  assert(result.inputs.length >= 107, 'the pinned input inventory grew with N1');
  assert.match(result.buildTag, /^earned-[0-9a-f]{12}$/);
});

test('N1.7 - the projector is the ONLY place this page writes a daily log', () => {
  /* A figure computed in adapter code instead of through the engine's writer is the
     mutant P6 exists for. There is exactly one caller of writeDaily in the page. */
  const files = fs.readdirSync(path.join(ROOT, 'rebuild/m3/w7-preview/today'))
    .filter((name) => /\.(cjs|mjs)$/.test(name));
  const callers = files.filter((name) =>
    readRepo('rebuild/m3/w7-preview/today/' + name).includes('writeDaily('));
  assert.deepEqual(callers, ['food-model.cjs'], 'writeDaily is called from one place: ' + callers);
  const model = readRepo('rebuild/m3/w7-preview/today/food-model.cjs');
  assert(model.includes('engine.writeDaily(next, row.date, partial)'), 'through the engine it is handed');
  assert.equal(/require\(["']\.\.\/\.\.\/\.\.\/\.\.\/engine/.test(model), false,
    'food-model imports no engine of its own');
});

test('N1.20 - N1 touches nothing outside its custody', () => {
  /* The files N1 adds and edits, named here so a widening shows up as a test change
     rather than as a quiet diff. */
  const own = ['food-commands.cjs', 'food-model.cjs', 'food-host.mjs', 'food-check.mjs',
    'today-app.cjs', 'today-model.cjs', 'screens.template.html', 'design.cjs', 'build.mjs',
    'test/food.test.mjs'];
  for (const name of own) {
    assert(fs.existsSync(path.join(ROOT, 'rebuild/m3/w7-preview/today', name)), name);
  }
  /* And the engine and the client are untouched by construction: N1 imports the
     writer, it does not carry one. */
  const commands = readRepo('rebuild/m3/w7-preview/today/food-commands.cjs');
  assert.equal(/require\(["'].*\/client\//.test(commands), false,
    'the producer imports nothing from rebuild/client');
});

/* ==========================================================================
   D2 ROUND 1 - the three blocking findings on N1, reproduced and closed.
   Every cell below was RED against 25650f8 and is GREEN here; the evidence is
   in rebuild/lanes/c/N1-REPORT.md.
   ========================================================================== */
test('D2.1 - a clean-init athlete can record PROTEIN: kept, replayed, read back', async () => {
  const clean = createCleanInitState({ setup: firstRunDocument() });
  const model = createTodayModel({ today: DAY, basisState: clean });
  const kit = await device();
  const page = screenOn({ model, query: '?screen=nutrition', mount: { food: await laneOver(kit.host) } });
  page.api.render('nutrition');
  page.doc.querySelector('#food-pro').value = '150';
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the protein intake IS recorded');
  /* The crash this cell was written for: writeDaily consults the OWED LEDGER for
     any day carrying pro, and proteinTarget throws on this athlete state. The
     projector must survive it. On H3 there is no refusal left to survive, and
     the same call must still not throw - so this line is not branched. */
  assert.doesNotThrow(() => model.stateFromOps(), 'the projection survives the refusal');
  const line = page.pick('food-recorded').textContent;
  /* HIS OWN RECORD IS NEVER HIDDEN AND NEVER ALTERED, on either engine. That is
     what D2 was raised about, and it is the half that must not move. */
  assert.equal(page.pick('food-recorded').hidden, false, 'his own record is never hidden');
  assert.match(line, /150 g protein/, 'his protein is read back off the operation');
  assert.doesNotMatch(page.pick('stub-note').textContent, /\d/, 'and still no invented target');
  if (H3_SEEDS_FIRST_READ) {
    /* H3. The owed ledger opens for him, so the day replays and there is no
       refusal to report: the line is the ordinary correction notice. */
    assert.deepEqual(model.loggedFood(DAY), { cal: null, pro: 150 }, 'H3 replays his protein');
    assert.equal(model.foodUnavailable(DAY), false, 'and nothing is unreadable any more');
    assert.equal(line.includes(FOOD_KEPT_UNREADABLE), false,
      'a reason for a refusal that did not happen would be a lie');
  } else {
    assert.equal(model.loggedFood(DAY), null, 'the engine holds no figure for him yet');
    assert.equal(model.foodUnavailable(DAY), true, 'and the screen is told exactly that');
    assert(line.includes(FOOD_KEPT_UNREADABLE), 'with the reason his ledger has nothing');
  }
  /* Calories AND protein together take the same path, and a reopen still holds it. */
  page.doc.querySelector('#food-cal').value = '2100';
  page.doc.querySelector('#food-pro').value = '150';
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 2);
  assert.match(page.pick('food-recorded').textContent, /2,100 kcal/);
  kit.host.close();
  const again = await kit.open();
  const rows = await again.all();
  assert.deepEqual(rows[rows.length - 1].day, { cal: 2100, pro: 150 }, 'durable across a reopen');
  const reread = createTodayModel({ today: DAY, basisState: clean, foodDays: { rows: () => rows } });
  assert.doesNotThrow(() => reread.loggedFood(DAY), 'and the replay survives the reopen too');
  assert.equal(reread.foodUnavailable(DAY), !H3_SEEDS_FIRST_READ,
    'unreadable before H3, readable after it, and never a throw either way');
  again.close();
});

test('D2.1 - the projector NAMES the days the engine refused, and never throws', () => {
  const engine = {
    writeDaily(state, date, partial) {
      if (partial.pro !== undefined) throw new TypeError('SYNTHETIC_NO_LEDGER');
      return { ...state, dailyLogs: { ...state.dailyLogs, [date]: partial } };
    },
  };
  const rows = rowsFor([['2030-02-04', { cal: 2000 }], ['2030-02-05', { pro: 150 }]]);
  const out = FoodModel.foodProjection({ dailyLogs: {} }, rows, engine);
  assert.deepEqual(out.unavailable, ['2030-02-05'], 'the refused day is named');
  assert.deepEqual(out.state.dailyLogs, { '2030-02-04': { cal: 2000 } }, 'nothing half applied');
  assert.deepEqual(FoodModel.recordedDay(rows, '2030-02-05').day, { pro: 150 },
    'and the refused day is still the athlete own record');
  assert.equal(FoodModel.recordedDay(rows, '2030-02-06'), null);
});

test('D2.3 - a store refusal says WHAT, WHY in the store own words, and WHAT TO DO', async () => {
  const kit = await device();
  const lane = await laneOver(kit.host);
  const page = screenOn({ model: createTodayModel({ today: DAY }), mount: { food: lane } });
  page.api.render('nutrition');
  /* The CLOSED case, through the real composition rather than a stub. */
  kit.host.close();
  page.doc.querySelector('#food-cal').value = '2100';
  page.doc.querySelector('#food-pro').value = '150';
  await page.tapSave();
  const said = page.pick('food-error').textContent;
  assert(said.startsWith(FOOD_REFUSED), 'WHAT was refused: ' + said);
  assert(said.includes(FOOD_REASON + 'LOCAL_CLIENT_CLOSED.'), 'WHY, in the code it named');
  assert(said.includes(FOOD_REFUSED_ACTION), 'and WHAT TO DO next');
  assert.equal(page.doc.querySelector('#food-cal').value, '2100', 'his figures are still there');
  assert.equal(page.doc.querySelector('#food-pro').value, '150');
  assert.equal(lane.rows().length, 0, 'and nothing was recorded');
  /* And a refusal that DOES carry the client own sentence is never reworded. */
  const copy = 'This device has to be restored before it can record again.';
  const spoken = screenOn({ model: createTodayModel({ today: DAY }),
    mount: { food: { rows: () => [], async refresh() { return []; },
      async save() { return { ok: false, state: 4, copy, code: 'RESTORE_REQUIRED' }; } } } });
  spoken.api.render('nutrition');
  spoken.doc.querySelector('#food-cal').value = '2100';
  await spoken.tapSave();
  const restore = spoken.pick('food-error').textContent;
  assert(restore.includes(copy), 'the client own words, verbatim');
  assert.equal(restore.includes('RESTORE_REQUIRED'), false, 'a code is the fallback, not an extra');
  assert(restore.includes(FOOD_REFUSED_ACTION));
});

test('D2.3 - a store that REFUSES TO OPEN says its reason, not that the feature is unbuilt', async () => {
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/?screen=nutrition' });
  Object.defineProperty(dom.window, 'indexedDB',
    { value: { open() { throw new Error('SYNTHETIC_STORE_BLOCKED'); } }, configurable: true });
  Object.defineProperty(dom.window, 'crypto', { value: webcrypto, configurable: true });
  const api = mountToday(dom.window.document, createTodayModel({ today: DAY }), {});
  await api.foodReady();
  await new Promise((resolve) => setTimeout(resolve, 0));
  const note = dom.window.document.querySelector('#phone [data-slot="stub-note"]').textContent;
  assert(note.startsWith(FOOD_NO_STORE), 'what cannot happen, and what to do: ' + note);
  assert(note.includes(FOOD_REASON), 'and the reason the store itself gave');
  assert.equal(note.indexOf('not wired yet') > note.indexOf(FOOD_REASON), true,
    'the unwired PLAN sentence never stands in for the store refusal');
  assert.equal(dom.window.document.querySelector('#phone [data-slot="food-entry"]').hidden, true);
  dom.window.close();
});

test('D2.4 - the recorded line carries the STORED effective time and offset', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { food: await laneOver(kit.host) } });
  page.api.render('nutrition');
  page.doc.querySelector('#food-cal').value = '2100';
  await page.tapSave();
  const first = (await kit.host.all())[0];
  assert.match(first.time, /^\d{2}:\d{2}(:\d{2})?$/, 'the operation carries an effective time');
  const line = page.pick('food-recorded').textContent;
  assert(line.includes(first.time), 'and the screen shows it: ' + line);
  if (first.offset) assert(line.includes(first.offset), 'with the offset it was recorded in');
  /* A CORRECTION reads its provenance off the WINNING operation. */
  page.doc.querySelector('#food-cal').value = '2400';
  await page.tapSave();
  const rows = await kit.host.all();
  assert.equal(rows.length, 2, 'two operations, the latest winning');
  const corrected = page.pick('food-recorded').textContent;
  assert(corrected.includes(rows[1].time), 'the winning operation stamp: ' + corrected);
  assert.match(corrected, /2,400 kcal/);
  assert(corrected.includes(FOOD_CORRECTION));
  /* And a REOPEN reads the same provenance back out of the durable log. */
  kit.host.close();
  const again = await kit.open();
  const kept = await again.all();
  const reread = createTodayModel({ today: DAY, foodDays: { rows: () => kept } });
  const page2 = screenOn({ model: reread, mount: { food: { host: again, rows: () => kept,
    async refresh() { return kept; },
    async save() { return { ok: false, state: 3, copy: null, code: 'NOT_USED' }; } } } });
  page2.api.render('nutrition');
  const back = page2.pick('food-recorded').textContent;
  assert(back.includes(kept[kept.length - 1].time), 'provenance survives a reopen: ' + back);
  assert.match(back, /2,400 kcal/);
  again.close();
});

test('D2.3 / D2.4 - the new sentences are declared, dash free, and carry no figure', () => {
  const source = design.appSource();
  for (const line of [FOOD_REFUSED_ACTION, FOOD_NO_STORE, FOOD_KEPT_UNREADABLE]) {
    assert(design.PREVIEW_RUNTIME_COPY.includes(line), 'declared: ' + line);
    assert(source.includes(line), 'present in a view source: ' + line);
    assert.equal(AI_DASH.test(line), false, 'dash free: ' + line);
    assert.equal(/\d/.test(line), false, 'no invented figure: ' + line);
  }
  assert.equal(AI_DASH.test(FOOD_REASON), false);
});

/* ==========================================================================
   D2 ROUND 2 - R2-1. A COMMIT AND THE READ THAT FOLLOWS IT ARE TWO OUTCOMES.
   ========================================================================== */

/* THE REAL HOST, with the read-back that today-app's own lane performs after an
   acknowledged write made to fail. `entryFor` above is that lane, byte for byte in
   shape; here it is built over a host whose `all()` refuses on demand. */
function laneOverFailingRead(host, rows, failing) {
  let cache = rows;
  const lane = {
    host,
    rows: () => cache,
    async refresh() {
      if (failing.on) throw new Error('SYNTHETIC_READBACK_FAILURE');
      cache = await host.all();
      return cache;
    },
    async save(day) {
      const result = await host.save(day);
      if (!result || result.ok !== true) return result;
      try { await lane.refresh(); return { ...result, readBack: true, readCode: null }; }
      catch (error) {
        return { ...result, readBack: false, readCode: error.message };
      }
    },
    close() { host.close(); },
  };
  return lane;
}

test('D2.R2 - an ACKNOWLEDGED intake whose read-back fails stays on screen, with a retry', async () => {
  const kit = await device();
  const failing = { on: true };
  const lane = laneOverFailingRead(kit.host, await kit.host.all(), failing);
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { food: lane } });
  page.api.render('nutrition');
  page.doc.querySelector('#food-cal').value = '1800';
  /* The event promise must SETTLE, not reject: a rejected one is the silence D2 found. */
  await assert.doesNotReject(async () => {
    page.pick('food-save').dispatchEvent(new page.dom.window.Event('click'));
    await page.api.foodPending();
  }, 'the save event promise rejected into silence');
  await new Promise((resolve) => setTimeout(resolve, 0));
  /* The operation IS durable: the client acknowledged it. */
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the intake committed');
  const said = page.pick('food-recorded').textContent;
  assert.equal(page.pick('food-recorded').hidden, false, 'the acknowledgment is on the screen');
  assert(said.startsWith(FOOD_SAVED), 'and it says it was recorded: ' + said);
  assert.match(said, /1,800 kcal/, 'from the COMMITTED operation, not from a log it could not read');
  assert(said.includes(FOOD_SAVED_UNREAD), 'with the read failure named beside it');
  const error = page.pick('food-error').textContent;
  assert(error.includes(FOOD_SAVED_UNREAD), 'the read failure is stated: ' + error);
  assert(error.includes(FOOD_REASON + 'SYNTHETIC_READBACK_FAILURE.'), 'with its own reason');
  assert(error.includes(FOOD_READ_ACTION), 'and what to do about it');
  assert.equal(page.doc.querySelector('#food-cal').value, '1800', 'his figures are still in the box');
  /* THE RETRY READS, and submits no second intake. */
  const retry = page.pick('food-retry');
  assert.equal(retry.hidden, false, 'the read is offered again');
  assert.equal(retry.textContent, FOOD_READ_RETRY);
  failing.on = false;
  retry.dispatchEvent(new page.dom.window.Event('click'));
  await page.api.foodPending();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the retry wrote NOTHING');
  assert.equal(page.pick('food-retry').hidden, true, 'and the read succeeded, so it is gone');
  assert.equal(page.pick('food-error').textContent, '', 'no failure is left on the screen');
  assert.deepEqual(model.loggedFood(DAY), { cal: 1800, pro: null }, 'the record reads back normally');
  assert.match(page.pick('food-recorded').textContent, /1,800 kcal/);
  kit.host.close();
});

test('D2.R2 - the page own lane reports the read-back failure instead of throwing it', async () => {
  /* The lane today-app builds for itself, driven straight: a refresh that refuses
     must come back as an outcome on the acknowledged result, never as a rejection. */
  const kit = await device();
  const api = mountToday(new JSDOM(shell()).window.document, createTodayModel({ today: DAY }), {});
  assert.equal(typeof api.foodReady, 'function');
  const source = readRepo('rebuild/m3/w7-preview/today/today-app.cjs');
  const lane = source.slice(source.indexOf('function foodEntryFor'), source.indexOf('function openFoodLane'));
  assert(lane.includes('readBack: true'), 'the lane reports a read-back that landed');
  assert(lane.includes('readBack: false'), 'and one that did not');
  assert.equal(/if \(result && result\.ok\) await this\.refresh\(\);/.test(lane), false,
    'the read-back is no longer allowed to reject out of save');
  kit.host.close();
});

test('D2.R2 - a save whose outcome is UNKNOWN says unknown, and never that nothing was stored', async () => {
  const kit = await device();
  const page = screenOn({ model: createTodayModel({ today: DAY }),
    mount: { food: { rows: () => [], async refresh() { return []; },
      async save() { throw new Error('SYNTHETIC_WRITE_INTERRUPTED'); } } } });
  page.api.render('nutrition');
  page.doc.querySelector('#food-cal').value = '2100';
  await assert.doesNotReject(async () => {
    page.pick('food-save').dispatchEvent(new page.dom.window.Event('click'));
    await page.api.foodPending();
  }, 'a throwing save rejected the event promise');
  await new Promise((resolve) => setTimeout(resolve, 0));
  const error = page.pick('food-error').textContent;
  assert(error.includes(FOOD_UNKNOWN), 'it says UNKNOWN: ' + error);
  assert(error.includes(FOOD_REASON + 'SYNTHETIC_WRITE_INTERRUPTED.'), 'with its own reason');
  assert(error.includes(FOOD_READ_ACTION), 'and what to do');
  assert.equal(error.includes(FOOD_REFUSED), false,
    'it never claims that no part of it was recorded');
  assert.equal(page.doc.querySelector('#food-cal').value, '2100', 'his figures are still there');
  assert.equal(page.pick('food-retry').hidden, false, 'and the read is offered');
});

test('D2.R2 - the new sentences are declared, dash free, and carry no figure', () => {
  const source = design.appSource();
  for (const line of [FOOD_SAVED_UNREAD, FOOD_UNKNOWN, FOOD_READ_ACTION, FOOD_READ_RETRY]) {
    assert(design.PREVIEW_RUNTIME_COPY.includes(line), 'declared: ' + line);
    assert(source.includes(line), 'present in a view source: ' + line);
    assert.equal(AI_DASH.test(line), false, 'dash free: ' + line);
    assert.equal(/\d/.test(line), false, 'no invented figure: ' + line);
  }
});
