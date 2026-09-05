'use strict';
// Preserved writer defects. Invented observations only; expected behavior comes
// from the pinned frozen engine. These assertions document defects, not fixes.
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const NativeDate = globalThis.Date; // Capture before any frozen bundle load.
if (!process.argv.includes('--worker')) {
  for (const mode of ['frozen', 'native']) {
    const child = spawnSync(process.execPath, [__filename, '--worker', mode], {
      env: { ...process.env, TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03' }, encoding: 'utf8', windowsHide: true
    });
    process.stdout.write(child.stdout || ''); process.stderr.write(child.stderr || '');
    if (child.error) throw child.error;
    assert.equal(child.status, 0, mode + ' writer defect witnesses failed');
  }
  process.exit(0);
}
const mode = process.argv.at(-1);
const clock = { today: () => '2026-09-03', nowISO: () => '2026-09-03T12:00:00.000Z',
  nowMs: () => NativeDate.parse('2026-09-03T12:00:00.000Z'), hour: () => 8, dow: () => 4, tz: 'America/New_York' };
class AmbientFrozenDate extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [clock.nowMs()])); }
  static now() { return clock.nowMs(); }
}
const CandidateDate = mode === 'frozen' ? AmbientFrozenDate : NativeDate;
globalThis.Date = CandidateDate;
const { createEngine } = require('../index.cjs');
const { createWriterReference, deterministicRandom, deterministicIds } = require('./writers-reference.cjs');
const clone = value => structuredClone(value);
const state = () => ({ v: 60, trend: 180, reads: [], weekly: [], dailyLogs: {}, sessionLog: {},
  sleep: { nights: [], needed: 3, debts: [], target: 8 }, exercises: [], queue: [], feed: [], forecasts: [], adjustments: [],
  proposals: [], suggestionLog: [], targets: {}, learned: { tdee: [], anchors: [] },
  plan: { goals: [], ifthen: [], setAt: {}, phaseLog: [] }, exOrder: { U: [], L: [] }, planGen: 52,
  retirements: {}, insertions: {}, waist: [], photos: [], events: [], trials: [], agentProposals: [],
  blackout: { until: '2026-08-01' }, model: { lean: 150, drip: 0, src: 'DEXA', anchorISO: '2026-01-01' } });
const exercise = extra => ({ id: 'synthetic_press', n: 'Synthetic press', mg: 'chest', day: 'U',
  w: 100, inc: 5, sets: 2, hi: 10, lo: 8, setup: 'Synthetic setup', ...extra });
const sleep = () => ({ clean: true, last: { h: 8 }, mean3: 8 });
const entry = extra => ({ id: 'synthetic_press', w: 100, reps: [10, 10], rir: 2, rirEnd: 0, ...extra });
let count = 0, calls = 0;
function witness(label, run) {
  function execute(E) {
    const frames = [];
    const call = (name, ...args) => {
      const before = clone(args), result = E[name](...args);
      assert.equal(globalThis.Date, CandidateDate, name + ' must restore ambient Date');
      frames.push(clone({ name, before, result, inputsAfter: args }));
      return result;
    };
    run(E, call);
    return frames;
  }
  const R = createWriterReference({ clock, Date: NativeDate, random: deterministicRandom() });
  const expected = execute(R);
  const C = createEngine({ clock, ids: deterministicIds(clock, deterministicRandom()) });
  const actual = execute(C);
  assert.equal(JSON.stringify(actual), JSON.stringify(expected), label + ': exact complete outputs and pre/post-call inputs');
  count++; calls += actual.length; console.log('REPRODUCED ' + label);
}

witness('D41 queued debut and reset change scalar load without advancing the per-set vector (app.jsx:2617-2625,10123)', (E, call) => {
  let s = state(); s.exercises = [exercise({ wSets: [100, 95] })];
  // Both sightings and the queued vector are made by the real session writer.
  for (const d of ['2026-08-27', '2026-08-31']) s = call('completeSession', s, d, [entry()], sleep()).s;
  const q = s.queue.find(x => x.kind === 'debut' && !x.done);
  assert.equal(q.newW, 105); assert.deepEqual(q.newWSets, [105, 100]);
  s = call('completeSession', s, '2026-09-03', [entry({ w: 105, reps: [9, 8], isDebutNow: true })], sleep()).s;
  assert.equal(s.exercises[0].w, 105); assert.deepEqual(s.exercises[0].wSets, [100, 95]);
  assert.equal(s.queue.find(x => x.id === q.id).state, 'ESTABLISH');
  const next = call('genSession', s, '2026-09-07', sleep()).ex[0];
  assert.equal(next.w, 105); // The public card is scalar; wSets stays on the exercise.
  // Same stale-vector class in the consented reset writer, independently.
  const initial = state(); initial.exercises = [exercise({ wSets: [100, 95] })];
  const ap = { id: 'synthetic-reset', kind: 'reset', exId: 'synthetic_press', newW: 90, title: 'Synthetic reset' };
  initial.agentProposals = [ap];
  const reset = call('applyAgentProposal', initial, ap, '2026-09-03');
  assert.equal(reset.exercises[0].w, 90); assert.deepEqual(reset.exercises[0].wSets, [100, 95]);
  assert.equal(call('genSession', reset, '2026-09-07', sleep()).ex[0].w, 90);
});

witness('D42 undoing a break leaves its scale seal active (app.jsx:10015-10021,10252,3675)', (E, call) => {
  const initial = state();
  initial.proposals = [{ id: 'synthetic-break', rid: 'synthetic-break', title: 'Synthetic break',
    apply: { kind: 'break', start: '2026-09-03', end: '2026-09-09' } }];
  const applied = call('applyProposal', initial, 'synthetic-break');
  assert.equal(applied.blackout.until, '2026-09-12');
  const undone = call('undoAdjustment', applied, 'synthetic-break');
  assert.equal(undone.plan.brk, null); assert.equal(undone.adjustments[0].undone, true);
  assert.equal(undone.proposals[0].resolved, false); assert.equal(undone.feed[0].t, 'MOVE UNDONE');
  assert.equal(undone.blackout.until, '2026-09-12');
  const read = call('applyRead', undone, '2026-09-03', 181, { hour: 8 });
  assert.equal(read.reads[0].sealed, true); assert.equal(read.trend, 180);
  const baseline = call('applyRead', initial, '2026-09-03', 181, { hour: 8 });
  assert.equal(baseline.reads[0].sealed, false); assert.equal(baseline.trend, 180.3);
});

witness('D43 own/std completion stores the configured load instead of the entered load (app.jsx:2586,2628-2651,2757)', (E, call) => {
  const initial = state(); initial.exercises = [exercise({ std: [8, 8], own: true })];
  const r = call('completeSession', initial, '2026-09-03', [entry({ w: 110, reps: [8, 8] })], sleep());
  assert.equal(r.s.exercises[0].lastMeta.w, 110);
  assert.equal(r.s.sessionLog['2026-09-03'].entries[0].w, 100);
  assert.equal(r.s.exercises[0].own, false); assert.equal(r.s.exercises[0].std, null);
  assert.equal(r.lines[0].t, 'SYNTHETIC PRESS OWNED');
});

witness('D44 a real one-set give-back offer records a phantom decrement and spends the budget (app.jsx:9181-9183,9220,10120,1071)', (E, call) => {
  const initial = state();
  initial.exercises = Array.from({ length: 4 }, (_, i) => exercise({ id: 'synthetic_press' + i, n: 'Synthetic press ' + i, sets: 1 }));
  for (let i = 0; i < 22; i++) {
    const d = new NativeDate(clock.nowMs() - i * 86400000).toISOString().slice(0, 10);
    initial.sessionLog[d] = { entries: initial.exercises.map(x => ({ id: x.id, w: 100, reps: [8], rir: 2, rirSets: [2] })) };
  }
  const offered = call('sweepVolume', initial, 0);
  const ap = offered.agentProposals.find(a => a.kind === 'volume' && a.dir === -1);
  assert.ok(ap); assert.equal(offered.exercises.find(e => e.id === ap.exId).sets, 1);
  const accepted = call('applyAgentProposal', offered, ap, '2026-09-03');
  const ex = accepted.exercises.find(e => e.id === ap.exId);
  assert.equal(ex.sets, 1); assert.match(accepted.feed[0].t, /^VOLUME −1 /);
  assert.deepEqual(call('_volDeltas', ex, accepted), [['2026-09-03', -1]]);
  assert.equal(call('structuralMovesThisWeek', accepted).sets.length, 1);
});

witness('D45 analyst context says terminal zero blocks earns while the writer awards one (app.jsx:12544,2498-2500)', (E, call) => {
  let s = state(); s.exercises = [exercise()];
  const text = call('askContext', s);
  assert.match(text, /terminal RIR gates every earn \(0 blocks it\)/);
  for (const d of ['2026-08-31', '2026-09-03']) s = call('completeSession', s, d, [entry()], sleep()).s;
  assert.deepEqual(s.sessionLog['2026-09-03'].entries[0].rirSets, [2, 0]);
  const q = s.queue.find(x => x.kind === 'debut' && !x.done);
  assert.equal(q.newW, 105); assert.equal(q.state, 'DEBUT');
  assert.ok(s.feed.some(f => f.t === 'SYNTHETIC PRESS 105 EARNED'));
});
console.log(`PASS ${count} preserved writer defects; ${calls} exact frozen/candidate call pairs; ${mode} Date`);
