'use strict';

// Preserved migration defects, not desired-behavior acceptance laws.
// Every changed record is synthetic. The pristine-fingerprint witness starts from
// the public authored SEED and changes one value; no private fixture is read.
// Both candidate and pinned frozen-source implementations execute each witness.
const assert = require('node:assert/strict');
const path = require('node:path');
const { createEngine } = require('../index.cjs');
const { createMigrationReference, deterministicIds } = require('./migrate-reference.cjs');
const referencePath = path.resolve(process.env.ENGINE_MAIN || path.join(__dirname, '../../conform/engines/engine-main.cjs'));
const NativeDate = globalThis.Date;
let G;
try { G = require(referencePath).__test; }
finally { globalThis.Date = NativeDate; } // The frozen bundle installs FixedDate at load.
const clock = () => ({ today: () => '2026-09-03', hour: () => 12, dow: () => 4,
  nowISO: () => '2026-09-03T16:00:00.000Z', nowMs: () => 1788451200000,
  tz: 'America/New_York' });
const clone = value => JSON.parse(JSON.stringify(value));
const engine = () => createEngine({ clock: clock(), ids: deterministicIds() }).__test;
const reference = () => createMigrationReference(G, { clock: clock(), ids: deterministicIds(), Date: NativeDate });
const state = () => ({ v: 59, trend: 170, reads: [], weekly: [],
  sleep: { nights: [], needed: 3 }, dailyLogs: {}, sessionLog: {},
  exercises: [], queue: [], feed: [], adjustments: [], suggestionLog: [],
  learned: { tdee: [], anchors: [] }, waist: [], photos: [], targets: {},
  model: { lean: 140, drip: 0, anchorISO: '2026-01-01' }, plan: {} });
let count = 0;
function witness(label, run) {
  const frozen = run(reference()), candidate = run(engine());
  assert.deepEqual(candidate, frozen, 'Frozen/candidate defect outcomes differ');
  assert.equal(globalThis.Date, NativeDate, 'Reference Date leaked into the candidate');
  count++;
  console.log('REPRODUCED ' + label + ' — frozen and candidate');
}
assert.equal(process.env.TZ, 'America/New_York', 'Set TZ=America/New_York');

witness('D33 counts-only guard permits unfiled set loss and replacement of a read day (app.jsx:13294-13297,13329-13334)', T => {
  const before = state();
  before.reads = [{ d: '2026-09-01', w: 170 }];
  before.sessionLog['2026-09-01'] = { entries: [{ id: 'synthetic-lift', w: 100, reps: [10, 9, 8] }] };
  const fewerSets = clone(before);
  fewerSets.sessionLog['2026-09-01'].entries[0].reps.pop();
  assert.deepEqual(T.recordCounts(fewerSets), T.recordCounts(before));
  assert.deepEqual(T.dataLossGuard(before, fewerSets), { safe: true, lost: [] });
  assert.equal(fewerSets.sessionLog['2026-09-01'].corrLog, undefined);
  const replacedDay = clone(before);
  replacedDay.reads = [{ d: '2026-09-02', w: 171 }];
  assert.equal(replacedDay.reads.some(r => r.d === '2026-09-01'), false);
  assert.deepEqual(T.dataLossGuard(before, replacedDay), { safe: true, lost: [] });
  return { sets: fewerSets.sessionLog['2026-09-01'].entries[0].reps, lostReadDay: true,
    setVerdict: T.dataLossGuard(before, fewerSets), readVerdict: T.dataLossGuard(before, replacedDay) };
});

witness('D34 pristine-seed fingerprint ignores edited record values (app.jsx:13235-13239)', T => {
  const changed = clone(T.SEED);
  assert.equal(T.isPristineSeed(changed), true);
  const last = changed.reads.at(-1), originalWeight = last.w;
  last.w = originalWeight + 1;
  assert.notDeepEqual(changed.reads, T.SEED.reads);
  assert.equal(T.isPristineSeed(changed), true);
  // Return only the synthetic change and verdict, never authored record values.
  return { changedWeightBy: 1, incorrectlyPristine: T.isPristineSeed(changed) };
});

witness('D35 newer-schema untouched exit mutates the supplied state first (app.jsx:12266,12268-12274)', T => {
  const future = { v: T.SCHEMA_V + 1, sleep: null, reads: null, dailyLogs: null,
    sessionLog: null, futurePayload: { marker: 'invented-future-schema' } };
  const before = clone(future), out = T.migrate(future);
  assert.equal(out, future);
  assert.notDeepEqual(out, before);
  assert.deepEqual(out.sleep, { nights: [], needed: 3 });
  assert.deepEqual(out.reads, []);
  assert.deepEqual(out.dailyLogs, {});
  assert.deepEqual(out.sessionLog, {});
  assert.deepEqual(out.futurePayload, before.futurePayload);
  return out;
});

witness('D36 curl migration receipt hard-codes the next per-set loads (app.jsx:11387-11396)', T => {
  const s = state();
  s.exercises = [{ id: 'curl', n: 'Synthetic curl', w: '40·40·35', sets: 3,
    inc: 5, hi: 12, lo: 8, day: 'U', mg: 'biceps', setup: 'Synthetic setup' }];
  s.queue = [{ id: 'q_curl_grad', kind: 'unlock', exId: 'curl', done: false }];
  const migrated = T.migrate(s);
  const ex = migrated.exercises[0], receipt = migrated.feed.find(f => f.op === 'patch60:curlgrad');
  assert.equal(ex.w, 40);
  assert.deepEqual(ex.wSets, [40, 40, 35]);
  assert.equal(T.nextLoad(ex), 45);
  assert.match(receipt.how, /price the next line at 60·60·55/);
  assert.equal(migrated.queue[0].state, 'SUPERSEDED');
  return { w: ex.w, wSets: ex.wSets, actualNext: T.nextLoad(ex), claimed: '60·60·55', receipt: receipt.how };
});

console.log('DEFECT WITNESSES 5: ' + count + '/' + count + ' reproduced; behavior intentionally unchanged');
