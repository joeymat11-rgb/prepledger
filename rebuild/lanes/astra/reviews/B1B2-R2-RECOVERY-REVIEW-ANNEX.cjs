// R2 rerun of original reviewer assertions. Only five source pins changed; semantics retained.
'use strict';
// Independent reviewer annex, cc6a1315003adc7f3f96d635980cfdf32b5a7a74.
// Read-only at execution. Root reviewer owns execution after closure verification.
// Binding bars: accepted B1 v1.3 U3/U9 and combined F-G FG4.
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
assert.ok(process.env.EARNED_REVIEW_ROOT, 'Explicit EARNED_REVIEW_ROOT required');
assert.equal(process.env.TZ, 'America/New_York', 'Use the licensed review timezone');
const root = fs.realpathSync(path.resolve(process.env.EARNED_REVIEW_ROOT));
// Git blob object hashes name exact immutable public candidate bytes, including LF.
// Pin every file read/loaded by the public helper before loading any candidate code.
const pins = {
  'dates.cjs': 'e0e06df2ecc1f2e3f5d70b8dc208744ecd041465',
  'constants.cjs': 'eda12c46a010d492bb25d248e78a6db1b6143b62',
  'entered-load.cjs': 'e9662526c46fcbdc721149c887ff9d159ea205b1',
  'performed.cjs': '6e5d3d35afb15e80f1ce82907e0e1b761c40c95c',
  'plan.cjs': '7c9481cfe0b652a4789cb09d7581e5baa0f1ecf5',
  'progression.cjs': '634888e4c96ca2fe596f3d8e2caee7a92c4ae7fe',
  'sleep.cjs': '42e39c9f8e6da144488ffaedb7469f2dfbeb36c7',
  'energy.cjs': 'c2264a5d77ec8100870b6e026d411bcf2fcb04cd',
  'policy.cjs': '7cc0597911ab23e8f3cc52a9974db6eb687f3401',
  'today.cjs': 'e041d06ec0c756205cbb7c960513c6ab5ffbaae7',
  'volume.cjs': 'ebdd171f30a0ad37af6058faab6457de986a05b0',
  'migrate.cjs': '0e283e7e4ece8d2e5362ed579a34c3edbd2cf708',
  'earn.cjs': '1659e14ec656b1b03def5e0d643c0f8872df231d',
  'merge.cjs': '5d03859568ce3119a27afd82e5cc8d7560290f6f',
  'writers.cjs': '74e9cc7ad03f4dd34f6e1886b9c27e639c2f7427',
  'index.cjs': 'a4d1ad3741e522486d6e4d61f39b8b6793674902',
  'test/b1b2-public-engine.cjs': '069fa9875ade712ce1f8bb2a0aacb5417775c030',
};
for (const [relative, expected] of Object.entries(pins)) {
  const file = fs.realpathSync(path.join(root, 'rebuild/engine', relative));
  const within = path.relative(root, file);
  assert.ok(within && !within.startsWith('..') && !path.isAbsolute(within), 'Public source escapes review root');
  const bytes = fs.readFileSync(file);
  const got = crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
  assert.equal(got, expected, 'Exact candidate public source pin: ' + relative);
}
const H = require(path.join(root, 'rebuild/engine/test/b1b2-public-engine.cjs'));
const engine = () => H.createEngine({ clock: H.clockAt('2026-09-03'), ids: { fresh: () => 'independent-review-id' } }).__test;
function clockState(target) {
  const s = H.syntheticState();
  s.exercises = [];
  if (target === undefined) delete s.sleep.cleanH; else s.sleep.cleanH = target;
  s.sleep.nights = ['2026-08-26', '2026-08-27', '2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01', '2026-09-02']
    .map(d => ({ d, h: 8.3, bed: '22:30', wake: '07:30', sol: 15 }));
  return s;
}
for (const target of [8, 9]) test(`REVIEW-FG4 known target ${target} preserves actual coaching comparison`, () => {
  const T = engine(), s = clockState(target), before = structuredClone(s);
  const anchor = T.sleepAnchor(s), out = T.askContext(s);
  assert.equal(anchor.measured, true);
  assert.equal(anchor.target, target);
  if (target === 8) assert.match(out, /He already clears his target\./);
  else {
    assert.equal(anchor.shiftMin, 15);
    assert.match(out, /To clear his 9 h target at the wake time he already keeps, lights out 22:15 — 15 minutes earlier\./);
  }
  assert.deepEqual(s, before, 'Reviewer calls preserve recorded state');
});
for (const [name, target] of [['missing', undefined], ['null', null], ['NaN', NaN], ['positive infinity', Infinity], ['negative infinity', -Infinity], ['numeric string', '8']]) {
  test(`REVIEW-FG4 ${name} target with factual clock cannot claim clearance`, () => {
    const T = engine(), s = clockState(target), before = structuredClone(s);
    const anchor = T.sleepAnchor(s), out = T.askContext(s);
    assert.equal(anchor.measured, true, 'Must reach measured-clock consumer');
    assert.equal(anchor.target, null);
    assert.equal(anchor.shiftMin, null);
    assert.match(out, /sleep target not recorded; comparison unavailable/);
    assert.deepEqual(s, before, 'Reviewer calls preserve recorded state');
    assert.doesNotMatch(out, /He already clears his target\.|To clear his .*? h target/, 'Unknown target must not produce a comparison verdict elsewhere in askContext');
  });
}
function todayState(hours) {
  const s = H.syntheticState();
  s.exercises = [];
  const latest = { d: '2026-09-02' };
  if (hours !== undefined) latest.h = hours;
  s.sleep.nights = [{ d: '2026-08-31', h: 8 }, { d: '2026-09-01', h: 8 }, latest];
  s.reads = [{ d: '2026-09-03', w: 180, pt: 180 }];
  s.dailyLogs = { '2026-09-02': { cal: 2200, pro: 180, steps: 10000 }, '2026-09-03': { cal: 2200, pro: 180, steps: 10000 } };
  s.sessionLog = { '2026-09-03': { entries: [] } };
  return s;
}
for (const h of [0, 2, 8]) test(`REVIEW-U3/U9 actual Today valid ${h}h control`, () => {
  const T = engine(), s = todayState(h), before = structuredClone(s);
  const rec = T.recoveryIndex(s), lever = T.fiveLevers(s).sleep;
  assert.equal(T.nowFocus(s).owed.length, 0, 'Logging must not mask sleep decision');
  assert.equal(rec.band, h < 6.5 ? 'WATCH' : 'GREEN');
  assert.equal(lever.state, h < 6.5 ? 'caution' : 'good');
  const fix = T.theOneFix(s);
  if (h < 6.5) assert.equal(fix.rung, 'sleep', 'Real short/zero observation preserves existing advice');
  else assert.notEqual(fix.rung, 'sleep');
  assert.deepEqual(s, before, 'Reviewer calls preserve recorded state');
});
for (const [name, h] of [['missing', undefined], ['null', null], ['numeric string', '8'], ['NaN', NaN], ['positive infinity', Infinity], ['negative infinity', -Infinity]]) {
  test(`REVIEW-U3/U9 actual Today ${name} current hours cannot become failed sleep`, () => {
    const T = engine(), s = todayState(h), before = structuredClone(s);
    const rec = T.recoveryIndex(s), lever = T.fiveLevers(s).sleep, fix = T.theOneFix(s);
    assert.equal(rec.band, 'UNKNOWN');
    assert.equal(rec.score, null);
    assert.equal(T.nowFocus(s).owed.length, 0, 'Logging must not mask the actual downstream decision');
    assert.deepEqual(s, before, 'Reviewer calls preserve recorded state');
    assert.equal(lever.state, 'quiet', 'Absent finite current evidence cannot become a failed-night verdict');
    assert.notEqual(fix.rung, 'sleep', 'Absent finite current evidence cannot supply a short-sleep restriction');
  });
}
test('REVIEW-DIAGNOSTIC target absence on the same two observed nights', () => {
  // Diagnostic only: distinguish the accepted no-extra-restriction wording from
  // the retained historic cost convention; do not silently choose a new policy.
  const T = engine(), known = H.syntheticState();
  known.exercises = [];
  known.sleep.cleanH = 7.5;
  known.sleep.nights = [{ d: '2026-09-02', h: 2 }, { d: '2026-09-03', h: 8 }];
  const unknown = structuredClone(known);
  delete unknown.sleep.cleanH;
  const a = T.recoveryIndex(known), b = T.recoveryIndex(unknown);
  assert.deepEqual(known.sleep.nights, unknown.sleep.nights);
  assert.equal(T.currentSleepObservation(known).h, 8);
  assert.equal(T.currentSleepObservation(unknown).h, 8);
  assert.equal(T.sleepInfo(known).targetKnown, true);
  assert.equal(T.sleepInfo(unknown).targetKnown, false);
  const reading = r => ({ band: r.band, score: r.score, flags: r.flags.map(f => ({ key: f.k, cost: f.cost })) });
  console.log('REVIEW_DIAGNOSTIC_IDENTICAL_NIGHTS_TARGET_AVAILABILITY ' + JSON.stringify({ known: reading(a), unknown: reading(b) }));
});
