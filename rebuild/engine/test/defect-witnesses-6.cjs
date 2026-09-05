'use strict';
// Preserved merge defects/contract gaps. Every record is synthetic. These tests
// assert observed frozen behavior, not proposed fixes or commutativity by fiat.
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync, execFileSync } = require('node:child_process');
const NativeDate = globalThis.Date;
if (!process.argv.includes('--worker')) {
  for (const mode of ['frozen', 'native']) {
    const child = spawnSync(process.execPath, [__filename, '--worker', mode], {
      env: { ...process.env, TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03' }, encoding: 'utf8', windowsHide: true
    });
    process.stdout.write(child.stdout || ''); process.stderr.write(child.stderr || '');
    if (child.error) throw child.error;
    assert.equal(child.status, 0, mode + ' defect witnesses failed');
  }
  process.exit(0);
}
const mode = process.argv.at(-1);
assert.equal(execFileSync('git', ['hash-object', 'src/app.jsx'], { cwd: path.resolve(__dirname, '../../..'), encoding: 'utf8', windowsHide: true }).trim(),
  'f98671d823f0d8cd83e730cdd930afe5f5e7b628');
const G = require(path.resolve(process.env.ENGINE_MAIN || path.join(__dirname, '../../conform/engines/engine-main.cjs'))).__test;
globalThis.Date = NativeDate;
const clock = day => {
  const instant = day + 'T16:00:00.000Z', ms = NativeDate.parse(instant), d = new NativeDate(ms);
  return { today: () => day, nowISO: () => instant, nowMs: () => ms, hour: () => d.getHours(), dow: () => d.getDay(), tz: 'America/New_York' };
};
class AmbientFrozenDate extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [clock('2026-09-03').nowMs()])); }
  static now() { return clock('2026-09-03').nowMs(); }
}
const CandidateDate = mode === 'frozen' ? AmbientFrozenDate : NativeDate;
globalThis.Date = CandidateDate;
const { createEngine } = require('../index.cjs');
const clone = value => structuredClone(value);
const state = () => ({ v: 60, trend: 180, reads: [], weekly: [], dailyLogs: {}, sessionLog: {},
  sleep: { nights: [], needed: 3 }, exercises: [], queue: [], feed: [], forecasts: [], adjustments: [],
  proposals: [], suggestionLog: [], targets: {}, learned: { tdee: [], anchors: [] },
  plan: { goals: [], ifthen: [], setAt: {}, phaseLog: [] }, exOrder: { U: [], L: [] }, planGen: 52,
  retirements: {}, insertions: {}, waist: [], photos: [], events: [], trials: [], agentProposals: [],
  model: { lean: 150, drip: 0, src: 'DEXA', anchorISO: '2026-01-01' } });
const exercise = extra => ({ id: 'synthetic_press', n: 'Synthetic press', mg: 'chest', day: 'U',
  w: 100, inc: 5, sets: 2, hi: 10, lo: 8, setup: 'Synthetic setup', ...extra });
function frozenCall(name, args, c) {
  class ReferenceDate extends NativeDate {
    constructor(...values) { super(...(values.length ? values : [c.nowMs()])); }
    static now() { return c.nowMs(); }
  }
  const old = globalThis.Date; globalThis.Date = ReferenceDate;
  try { return G[name](...args); } finally { globalThis.Date = old; }
}
function observedMerge(pair, c = clock('2026-09-03')) {
  const referenceInputs = clone(pair), candidateInputs = clone(pair);
  const reference = frozenCall('mergeState', referenceInputs, c);
  assert.equal(globalThis.Date, CandidateDate);
  const candidate = createEngine({ clock: c }).mergeState(...candidateInputs);
  assert.equal(JSON.stringify({ result: candidate, inputs: candidateInputs }), JSON.stringify({ result: reference, inputs: referenceInputs }),
    'Exact complete frozen/candidate output and post-call inputs');
  assert.equal(globalThis.Date, CandidateDate);
  return candidate;
}
let count = 0;
function witness(label, run) { run(); count++; console.log('REPRODUCED ' + label); }

witness('D37 same merge inputs yield a different earned receipt at a later clock (app.jsx:14441,2493,2533,2163,2132)', () => {
  const pair = ['2026-08-28', '2026-08-30'].map(d => {
    const s = state(); s.exercises = [exercise({ topAt: 100, topRun: 1 })];
    s.sessionLog[d] = { entries: [{ id: 'synthetic_press', w: 100, reps: [10, 10], rir: 2, rirSets: [2, 0] }] };
    s.feed = [{ d, t: 'SYNTHETIC PRESS — TOP OF WINDOW, PROVISIONAL', how: 'Synthetic first sighting', op: 'synthetic:' + d }];
    return s;
  });
  pair[0].exercises.push(exercise({ id: 'synthetic_noise', n: 'Synthetic noise', w: 50,
    forks: [{ from: '2026-09-01', kind: 'technique', why: 'Synthetic technique change' }] }));
  for (const [d, reps] of [['2026-08-20',[1,1]], ['2026-08-21',[9,9]], ['2026-08-22',[1,1]], ['2026-08-23',[9,9]]]) {
    pair[0].sessionLog[d] = { entries: [{ id: 'synthetic_noise', w: 50, reps }] };
  }
  const before = observedMerge(pair, clock('2026-08-30')), after = observedMerge(pair, clock('2026-09-03'));
  const earned = s => s.feed.find(f => f.t === 'SYNTHETIC PRESS 105 EARNED');
  assert.match(earned(before).how, /±5\.01-rep spread/);
  assert.match(earned(after).how, /±0\.90-rep spread/);
  assert.equal(earned(before).d, '2026-08-30'); assert.equal(earned(after).d, '2026-08-30');
  assert.notEqual(earned(before).how, earned(after).how);
  for (const s of [before, after]) assert.equal(s.queue.filter(q => q.newW === 105 && q.state === 'DEBUT').length, 1);
});

witness('D38 merge drops actual writer-shaped accepted and declined trial records (app.jsx:10125-10126,10138,13876,14070)', () => {
  const ap = { id: 'synthetic-trial', kind: 'trial', custom: { abId: 'synthetic-ab', t: 'Synthetic trial' } };
  const initial = state(); initial.agentProposals = [ap];
  for (const name of ['applyAgentProposal', 'dismissAgentProposal']) {
    // The real frozen writer makes the input; no hypothetical trial schema.
    const decided = frozenCall(name, [clone(initial), clone(ap), '2026-08-30'], clock('2026-08-30'));
    assert.equal(decided.trials.length, 1); assert.equal(decided.trials[0].id, undefined); assert.equal(decided.trials[0].d, undefined);
    assert.equal(name === 'applyAgentProposal' ? decided.trials[0].started : decided.trials[0].declined,
      name === 'applyAgentProposal' ? '2026-08-30' : true);
    for (const pair of [[decided, state()], [state(), decided]]) {
      const merged = observedMerge(pair); assert.deepEqual(merged.trials, []);
      assert.equal(merged.feed.filter(f => /^TRIAL (STARTED|PASSED)/.test(f.t)).length, 1);
    }
  }
});

witness('D39 a stale replica restores a dismissed current-generation offer (app.jsx:10132-10141,14071,14216)', () => {
  const ap = { id: 'synthetic-volume', kind: 'volume', pg: 52, mg: 'chest', exId: 'synthetic_press', dir: 1, title: 'Synthetic volume offer' };
  const initial = state(); initial.agentProposals = [ap]; initial.exercises = [exercise({})];
  const dismissed = frozenCall('dismissAgentProposal', [clone(initial), clone(ap), '2026-08-30'], clock('2026-08-30'));
  assert.equal(dismissed.agentProposals.length, 0);
  for (const pair of [[dismissed, initial], [initial, dismissed]]) {
    const merged = observedMerge(pair);
    assert.deepEqual(merged.agentProposals, [ap]);
    assert.equal(merged.feed.filter(f => f.t === 'VOLUME PASSED — CHEST').length, 1);
    assert.equal(merged.exercises[0].sets, 2); // No claim that a second application ran.
  }
});

witness('D40 equal-richness daily calorie conflicts resolve differently by merge direction (app.jsx:13372,13881-13885,14081,14240)', () => {
  // The source documents local-wins ties. This is a preserved convergence gap,
  // requiring an owner ruling before replacing the tie policy with a new rule.
  const a = state(), b = state(); a.dailyLogs['2026-08-30'] = { cal: 2000 }; b.dailyLogs['2026-08-30'] = { cal: 2100 };
  assert.equal(JSON.stringify(a.dailyLogs).length, JSON.stringify(b.dailyLogs).length);
  const ab = observedMerge([a,b]), ba = observedMerge([b,a]);
  assert.equal(ab.dailyLogs['2026-08-30'].cal, 2000); assert.equal(ba.dailyLogs['2026-08-30'].cal, 2100);
  assert.notEqual(JSON.stringify(ab), JSON.stringify(ba));
});
console.log('M6 preserved defects ' + mode + ': ' + count + '/4 PASS; frozen and candidate execute every merge witness.');
