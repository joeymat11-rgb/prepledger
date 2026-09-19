// N3-A. All quantities, dates and identities in these cells are invented.
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { faultDatabase, deferred } from '../../../w6/test/support.mjs';
import { createFoodHost } from '../food-host.mjs';
import Food from '../food-commands.cjs';
import Client from '../../../../client/index.cjs';
import Model from '../food-model.cjs';
import Today from '../today-model.cjs';
import { loggedDaysFromRows, loggedDaysIn, weeksFromState } from '../../measure/measure-sources.mjs';
import { createLocalSourceFixture, fixtureEffective } from '../../../../m4/import/test/s3/fixtures.mjs';

const DAY = Today.SYNTHETIC_DAY;
const BASE = { cal: 1234, pro: 88 };
const prepare = day => Food.prepare({ action: Food.ACTION, input: { day } });
const envelope = day => ({ kind: 'fact', class: 'food-day', causal_parents: [],
  effective: { local_date: DAY }, payload: { profile: Food.PROFILE, day } });
const valid = day => Food.validate(envelope(day), () => null);
async function device(t) {
  const fault = faultDatabase();
  const options = { day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto };
  const host = await createFoodHost(options);
  t.after(() => host.close());
  return { fault, options, host };
}
const generation = async host => (await host.repository.load()).generation;
const preferences = async indexedDB => (await import('../device-preferences.mjs')).openDevicePreferences({ indexedDB });

test('N3 omission control: blank and undefined entry keys vanish; one acknowledged op', async t => {
  const { host } = await device(t);
  for (const entry of [BASE, { ...BASE, fat: '', carbs: '' }, { ...BASE, fat: undefined, carbs: undefined }]) {
    const day = Model.dayFromEntry(entry);
    assert.deepEqual(day, BASE);
    assert.deepEqual(prepare(day).payload.day, BASE);
  }
  assert.equal((await host.save(Model.dayFromEntry({ ...BASE, fat: '', carbs: undefined }))).ok, true);
  const rows = await host.all();
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].day, BASE);
  const g = await generation(host);
  assert.equal(Object.keys(g.collections.ops).length, 1);
  assert.equal(Object.keys(g.collections.outbox).length, 1);
  assert.deepEqual(Model.recordedDay(rows, DAY).day, BASE);
});

test('N3 legacy rule control: cal or pro alone remains valid; macros alone refuse', async t => {
  const { host } = await device(t);
  for (const day of [{ cal: 0 }, { pro: 88 }]) {
    assert.deepEqual(prepare(day).payload.day, day);
    assert.equal(valid(day), true);
    assert.deepEqual(Model.dayFromEntry(day), day);
  }
  const before = await generation(host);
  for (const day of [{}, { fat: 0 }, { carbs: 1000 }, { fat: 37, carbs: 149 }]) {
    assert.throws(() => prepare(day), /FOOD_INPUT_INVALID/);
    assert.equal(valid(day), false);
    assert.equal(Model.dayFromEntry(day), null);
    assert.equal((await host.save(day)).ok, false);
  }
  assert.deepEqual(await generation(host), before);
});

for (const key of ['fat', 'carbs']) {
  test(`N3 ${key}: endpoints and trimmed digits survive independently`, () => {
    for (const value of [0, 37, 1000]) {
      const expected = { ...BASE, [key]: value };
      assert.deepEqual(Model.dayFromEntry({ ...BASE, [key]: ' 00' + value + ' ' }), expected);
      assert.deepEqual(prepare(expected).payload.day, expected);
      assert.equal(valid(expected), true);
      assert.equal(Object.hasOwn(expected, key === 'fat' ? 'carbs' : 'fat'), false);
    }
  });
  test(`N3 ${key}: every malformed entry refuses with a code and proposed sentence`, () => {
    for (const value of [null, ' ', '\t', 'no', -1, '-1', 0.5, '0.5', NaN, Infinity,
      -Infinity, 1001, '1001', '1e2', '+1', true, false, {}, [], [12]]) {
      const entry = { ...BASE, [key]: value };
      const code = Model.refusalFor(entry);
      assert.equal(code, key === 'fat' ? 'FAT_RANGE' : 'CARBS_RANGE', String(value));
      assert.equal(Model.dayFromEntry(entry), null);
      assert.equal(Model.MACRO_REFUSAL_COPY[code], `Enter ${key} as a whole number of grams from 0 to 1000, or leave it blank. Nothing was recorded.`);
    }
  });
  test(`N3 ${key}: malformed raw values refuse atomically in the real host`, async t => {
    const { host } = await device(t);
    assert.equal((await host.save(BASE)).ok, true);
    const before = await generation(host);
    for (const value of [null, undefined, '', ' ', 'no', -1, 0.5, NaN, Infinity,
      -Infinity, 1001, '12', true, false, {}, [], [12]]) {
      const day = { ...BASE, [key]: value };
      assert.throws(() => prepare(day), /FOOD_INPUT_INVALID/);
      assert.equal(valid(day), false, 'raw validator: ' + String(value));
      const result = await host.save(day);
      assert.equal(result.ok, false);
      // The sealed host carries this existing code in copy, not result.code.
      assert.equal(result.state, 3);
      assert.equal(result.copy, Client.copy.SAVE_FAILED_INVALID('WORKOUT_INPUT_INVALID'));
      assert.deepEqual(await generation(host), before, 'no op, outbox or metadata write');
    }
  });
}

test('N3 durable raw macros: close and reopen retain every presence combination and zero', async t => {
  const { host, options } = await device(t);
  const days = [BASE, { ...BASE, fat: 0 }, { ...BASE, carbs: 1000 }, { ...BASE, fat: 37, carbs: 0 }];
  for (const day of days) assert.equal((await host.save(day)).ok, true);
  const before = await host.all();
  assert.deepEqual(before.map(row => row.day), days);
  host.close();
  const reopened = await createFoodHost(options);
  t.after(() => reopened.close());
  assert.deepEqual(await reopened.all(), before);
  assert.deepEqual(Model.recordedDay(await reopened.all(), DAY).day, days.at(-1));
  for (const [index, row] of (await reopened.all()).entries()) {
    for (const key of ['fat', 'carbs']) assert.equal(Object.hasOwn(row.day, key), Object.hasOwn(days[index], key));
  }
});

test('N3 projection control: actual writer arguments and whole state equal macro-free control', () => {
  const engine = Today.createTodayModel({ today: DAY }).engine;
  const state = Today.createBasisState(DAY);
  const run = day => {
    const calls = [];
    const projection = Model.foodProjection(structuredClone(state), [{ date: DAY, day }], {
      writeDaily(...args) { calls.push(structuredClone(args)); return engine.writeDaily(...args); },
    });
    assert.deepEqual(projection.unavailable, []);
    assert.equal(calls.length, 1);
    return { calls, projection, logged: Model.loggedDay(projection.state, DAY) };
  };
  const control = run(BASE);
  for (const extra of [{ fat: 0 }, { carbs: 149 }, { fat: 1000, carbs: 0 }]) {
    assert.deepEqual(run({ ...BASE, ...extra }), control);
  }
  assert.deepEqual(control.calls[0][2], BASE);
});

test('N3 adherence control: real measure readers count identical complete and historical partial days', () => {
  const dates = ['2026-09-01', '2026-09-02', '2026-09-03'];
  const plain = [BASE, { cal: 0 }, { pro: 88 }].map((day, i) => ({ date: dates[i], day }));
  const macros = plain.map(row => ({ ...row, day: { ...row.day, fat: 0, carbs: 149 } }));
  const stateFor = rows => ({ dailyLogs: Object.fromEntries(rows.map(row => [row.date, row.day])) });
  assert.deepEqual(loggedDaysFromRows(plain, dates), { food: 3, energy: 2 });
  assert.deepEqual(loggedDaysFromRows(macros, dates), loggedDaysFromRows(plain, dates));
  assert.deepEqual(loggedDaysIn(stateFor(macros), dates), loggedDaysIn(stateFor(plain), dates));
  const week = (rows, raw) => weeksFromState({ state: stateFor(rows), startDate: dates[0], weeks: 1,
    today: dates[2], ...(raw ? { foodRows: rows } : {}) });
  for (const raw of [false, true]) {
    assert.deepEqual(week(macros, raw), week(plain, raw));
    assert.equal(week(plain, raw)[0].foodAdherencePct, 100);
  }
});

test('N3 native admission: shared validator admits raw macros and retained originals', async t => {
  const f = await createLocalSourceFixture({ indexedDB: faultDatabase().inner, crypto: webcrypto,
    databaseName: 'n3-synthetic-admission' });
  t.after(() => f.close());
  // Construct native envelopes without the producer so baseline failure reaches admission.
  const days = [{ cal: 1234, fat: 0 }, { pro: 88, carbs: 149 }, { ...BASE, fat: 37, carbs: 0 }];
  for (const [i, day] of days.entries()) await f.append('N3-native-' + i, {
    class: 'food-day', kind: 'fact', payload: { profile: Food.PROFILE, day }, parents: [],
    effective: fixtureEffective(),
  });
  const before = (await f.repository.load()).generation;
  const handle = await f.controller.prepareSource(await f.review(), { identityConfirmed: true, prefixAnswer: true });
  assert.notEqual(handle.ready, false, JSON.stringify(handle.issues));
  const view = await f.controller.view(handle);
  assert.equal(view.ready, true);
  assert.deepEqual(view.state.dailyLogs['2026-09-04'], BASE);
  for (const i of [0, 1]) assert.deepEqual(view.retained.find(op => op.op_id === 'N3-native-' + i).payload.day, days[i]);
  assert.deepEqual((await f.repository.load()).generation, before);
  assert.deepEqual(before.collections.ops['N3-native-2'].payload.day, days[2]);
});

// Fault injection wraps the real fake-indexeddb transaction API, outside product code.
function preferenceFault() {
  const inner = faultDatabase().inner;
  const state = { mode: null, entered: deferred(), release: false, completed: false };
  const indexedDB = { open(...args) {
    if (state.mode === 'open') throw new Error('synthetic open failure');
    const request = inner.open(...args);
    request.addEventListener('success', () => {
      const db = request.result, transaction = db.transaction.bind(db);
      db.transaction = (...args) => {
        if (state.mode === 'transaction') throw new Error('synthetic transaction failure');
        const tx = transaction(...args);
        tx.addEventListener('complete', () => { state.completed = true; });
        const store = tx.objectStore('preferences');
        for (const method of ['get', 'put']) {
          const original = store[method].bind(store);
          store[method] = (...values) => {
            if (state.mode === method) throw new Error('synthetic ' + method + ' failure');
            const req = original(...values);
            if (state.mode === 'abort-' + method) req.addEventListener('success', () => tx.abort());
            if (method === 'put') state.entered.resolve();
            return req;
          };
        }
        tx.objectStore = () => store;
        if (state.mode === 'delay') {
          const hold = () => { if (!state.release) store.get('trackMacros').onsuccess = hold; };
          hold();
        }
        return tx;
      };
    });
    return request;
  } };
  return { inner, indexedDB, state };
}

test('N3 preference: default OFF, Boolean-only, durable ON/OFF and separate device isolation', async t => {
  const a = preferenceFault(), b = preferenceFault();
  const pref = await preferences(a.indexedDB);
  t.after(() => pref.close());
  assert.equal(await pref.readTrackMacros(), false);
  for (const value of [undefined, null, 0, 1, '', 'true', {}]) await assert.rejects(() => pref.writeTrackMacros(value));
  assert.equal(await pref.writeTrackMacros(true), true);
  pref.close();
  const reopened = await preferences(a.indexedDB), other = await preferences(b.indexedDB);
  t.after(() => { reopened.close(); other.close(); });
  assert.equal(await reopened.readTrackMacros(), true);
  assert.equal(await other.readTrackMacros(), false);
  assert.equal(await reopened.writeTrackMacros(false), false);
  assert.equal(await reopened.readTrackMacros(), false);
  assert.deepEqual((await a.inner.databases()).map(db => db.name), ['earned-device-preferences']);
});

test('N3 preference: acknowledgement waits for transaction completion', async t => {
  const fault = preferenceFault(), pref = await preferences(fault.indexedDB);
  t.after(() => pref.close());
  fault.state.completed = false;
  fault.state.mode = 'delay';
  let settled = false;
  const saving = pref.writeTrackMacros(true).then(value => { settled = true; return value; });
  try {
    await fault.state.entered.promise;
    await new Promise(resolve => setTimeout(resolve, 15));
    assert.equal(settled, false);
    assert.equal(fault.state.completed, false);
  } finally { fault.state.release = true; }
  assert.equal(await saving, true);
  assert.equal(fault.state.completed, true);
});

test('N3 preference: failures reject, prior value and food generation remain unchanged', async t => {
  const { host, options } = await device(t);
  assert.equal((await host.save(BASE)).ok, true);
  const before = await generation(host);
  const fault = preferenceFault();
  fault.state.mode = 'open';
  await assert.rejects(() => preferences(fault.indexedDB), { code: 'DEVICE_PREFERENCES_OPEN_FAILED' });
  fault.state.mode = null;
  const pref = await preferences(fault.indexedDB);
  t.after(() => pref.close());
  await pref.writeTrackMacros(true);
  for (const mode of ['get', 'abort-get', 'transaction']) {
    fault.state.mode = mode;
    await assert.rejects(() => pref.readTrackMacros(), { code: 'DEVICE_PREFERENCES_READ_FAILED' });
  }
  for (const mode of ['put', 'abort-put', 'transaction']) {
    fault.state.mode = mode;
    await assert.rejects(() => pref.writeTrackMacros(false), { code: 'DEVICE_PREFERENCES_WRITE_FAILED' });
    fault.state.mode = null;
    assert.equal(await pref.readTrackMacros(), true);
  }
  // Open the preference beside the actual food store, proving separate database custody.
  const sameDevice = await preferences(options.indexedDB);
  t.after(() => sameDevice.close());
  await sameDevice.writeTrackMacros(true);
  assert.deepEqual(await generation(host), before);
  assert.equal((await host.save({ cal: 1456 })).ok, true);
  assert.equal(await sameDevice.readTrackMacros(), true);
  pref.close();
  await assert.rejects(() => pref.readTrackMacros(), { code: 'DEVICE_PREFERENCES_READ_FAILED' });
  await assert.rejects(() => pref.writeTrackMacros(false), { code: 'DEVICE_PREFERENCES_WRITE_FAILED' });
});
