'use strict';
// Synthetic-only differential. Expected results come from pinned source declarations
// and the frozen reference bundle, never from candidate helpers or the records DTO.
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const NativeDate = Date;
if (!process.argv.includes('--worker')) {
  for (const mode of ['frozen', 'native']) {
    const child = spawnSync(process.execPath, [__filename, '--worker', mode], {
      env: { ...process.env, MEASURED_TEST_NOW: '2026-09-03', TZ: 'America/New_York' },
      encoding: 'utf8', windowsHide: true
    });
    process.stdout.write(child.stdout || ''); process.stderr.write(child.stderr || '');
    if (child.error) throw child.error;
    assert.equal(child.status, 0, mode + ' migration differential failed');
  }
  process.exit(0);
}
const mode = process.argv[process.argv.indexOf('--worker') + 1];
const G = require(path.resolve(process.env.ENGINE_MAIN || path.join(__dirname, '../../conform/engines/engine-main.cjs'))).__test;
globalThis.Date = NativeDate;
const { createMigrationReference, deterministicIds } = require('./migrate-reference.cjs');
const { records } = require('../../conform/oracle/legacy-records.cjs');
const clone = value => structuredClone(value);
function makeClock(iso = '2026-09-03T16:00:00.000Z', today = '2026-09-03') {
  const ms = NativeDate.parse(iso);
  return { today: () => today, nowMs: () => ms, nowISO: () => iso, hour: () => new NativeDate(ms).getHours() };
}
const clock = makeClock();
class FrozenDate extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [clock.nowMs()])); }
  static now() { return clock.nowMs(); }
}
const CandidateDate = mode === 'frozen' ? FrozenDate : NativeDate;
globalThis.Date = CandidateDate;
const baseDate = globalThis.Date;
const { createEngine } = require('../index.cjs');
assert.strictEqual(globalThis.Date, baseDate, 'candidate module loading preserves Date');
let comparisons = 0, migrationExits = 0;
function synthetic(T, version = 60) {
  const s = clone(T.SEED);
  s.v = version;
  s.reads = [{ d: '2026-08-30', w: 201, morning: true, note: 'synthetic' }];
  s.sleep = { nights: [{ d: '2026-08-30', h: 7.5 }], needed: 3 };
  s.dailyLogs = { '2026-08-30': { cal: 2400, pro: 160, steps: 6000 } };
  s.sessionLog = {}; s.events = []; s.feed = [];
  s.adjustments = []; s.suggestionLog = []; s.corrLog = {};
  s.learned = { tdee: [], anchors: [] }; s.waist = []; s.photos = [];
  for (const e of s.exercises) { delete e.last; delete e.lastMeta; e.topAt = null; e.topRun = 0; }
  return s;
}
// Preserve reference identities as well as values. Shared input/output subtrees are
// observable in legacy v1/v2 exits; JSON alone would miss those aliases.
function aliases(value) {
  const seen = new Map(), repeated = [];
  function visit(v, p) {
    if (!v || typeof v !== 'object') return;
    if (seen.has(v)) { repeated.push([p, seen.get(v)]); return; }
    seen.set(v, p);
    for (const key of Object.keys(v)) visit(v[key], p + '/' + key);
  }
  visit(value, '$'); return repeated;
}
function capture(T, execute) {
  try { return { value: execute(T), error: null }; }
  catch (e) { return { value: null, error: { name: e.name, message: e.message } }; }
}
function pair(options = {}) {
  const c = options.clock || clock;
  const rd = options.drafts ? options.drafts() : undefined;
  const cd = options.drafts ? options.drafts() : undefined;
  return {
    R: createMigrationReference(G, { clock: c, drafts: rd, ids: deterministicIds(), Date: NativeDate }),
    C: createEngine({ clock: c, drafts: cd, ids: deterministicIds() }), rd, cd
  };
}
function compare(label, execute, options = {}) {
  const p = pair(options);
  const expected = capture(p.R, execute);
  assert.strictEqual(globalThis.Date, baseDate, label + ': reference restored Date');
  const actual = capture(p.C, execute);
  assert.strictEqual(globalThis.Date, baseDate, label + ': candidate preserved Date');
  assert.deepEqual(actual, expected, label + ': full values/post-state');
  assert.equal(JSON.stringify(actual), JSON.stringify(expected), label + ': exact JSON bytes/order');
  assert.deepEqual(aliases(actual), aliases(expected), label + ': identities');
  if (!options.exception) assert.equal(actual.error, null, label + ': unexpected matched exception');
  if (options.drafts) assert.deepEqual(p.cd && p.cd.trace, p.rd && p.rd.trace, label + ': draft access order');
  comparisons++;
  return actual.value;
}

for (const v of [null, undefined, 0, 1, 2, ...Array.from({ length: 57 }, (_, i) => i + 3), 60, 61]) {
  const label = v === null ? 'null' : v === undefined ? 'undefined' : 'v' + v;
  const result = compare('migrate exit ' + label, T => {
    const old = v == null ? v : synthetic(T, v);
    if (v === 1) old.queue = ['rows180', 'press245', 'hack3', 'abs100', 'calf315', 'ext150', 'dexa'].map(id => ({ id, done: true }));
    if (v === 61) { old.sleep = null; delete old.dailyLogs; delete old.reads; }
    const first = T.migrate(old);
    const firstSnapshot = clone(first), oldAfterFirst = clone(old);
    const second = T.migrate(first);
    return { old, first, second, firstSnapshot, oldAfterFirst,
      firstIsOld: first === old, secondIsFirst: second === first };
  });
  assert.equal(result.firstIsOld, v === 60 || v === 61, label + ': exit identity');
  assert.equal(result.secondIsFirst, true, label + ': repeat identity');
  if (v === 61) assert.deepEqual(result.oldAfterFirst.sleep, { nights: [], needed: 3 });
  if (v === 1) {
    assert.equal(result.first.exercises.find(e => e.id === 'hack').setsAt, clock.nowISO());
    assert.equal(result.first.exercises.find(e => e.id === 'calves').reclaim, null);
    assert.equal(result.first.queue.find(q => q.id === 'q_calves').done, true);
  }
  migrationExits++;
}

// Direct v1 stamp with a non-gate date, proving the output is injected, not a
// hard-coded census date or the wall clock. Source-era shape is deliberately synthetic.
compare('v1 hack3 nondefault clock', T => {
  const old = synthetic(T, 1); old.queue = [{ id: 'hack3', done: true }];
  const result = T.migrate(old); return { old, result };
}, { clock: makeClock('2026-10-12T03:14:15.000Z', '2026-10-11') });

function facade(keys, throwAt = -1, throwLength = false) {
  const trace = [];
  return { trace, get length() { trace.push('length'); if (throwLength) throw Error('synthetic length failure'); return keys.length; },
    key(i) { trace.push('key:' + i); if (i === throwAt) throw Error('synthetic key failure'); return keys[i] ?? null; } };
}
const draftCases = [
  ['empty', [], -1, '2026-08-14'],
  ['both prefixes', ['prep-ledger-draft-2026-08-18', 'prep-ledger-gymdraft-2026-08-21'], -1, '2026-08-22'],
  ['mixed suffixes', [null, 'foreign-2026-12-01', 'prep-ledger-draft-no-date', 'prep-ledger-gymdraft-2026-8-02', 'prep-ledger-draft-anything-2026-08-22'], -1, '2026-08-23'],
  ['invalid calendar throws after progress', ['prep-ledger-draft-2026-08-20', 'prep-ledger-draft-2026-99-99', 'prep-ledger-draft-2026-12-01'], -1, '2026-08-21'],
  ['partial throwing key', ['prep-ledger-draft-2026-08-20', 'prep-ledger-gymdraft-2026-12-01'], 1, '2026-08-21'],
  ['future key', ['prep-ledger-gymdraft-2030-01-01'], -1, '2030-01-02'],
  ['UTC DST bump', ['prep-ledger-draft-2026-11-01'], -1, '2026-11-02']
];
function patch51Input(T) {
  const s = synthetic(T, 50);
  delete s.insertions;
  for (const e of s.exercises) { delete e.forks; if (e.id === 'fly' || e.id === 'hipthrust') e.birth = '2026-08-12'; }
  return s;
}
for (const [name, keys, at, date] of draftCases) {
  const result = compare('V51 drafts ' + name, T => { const s = patch51Input(T); const result = T.patchV51(s); return { s, result }; },
    { drafts: () => facade(keys, at) });
  assert.equal(result.s.insertions.fly, date, name + ': observed insertion date');
  assert.equal(result.s.insertions.hipthrust, date, name + ': observed insertion date');
}
compare('V51 throwing length', T => { const s = patch51Input(T); return { s, result: T.patchV51(s) }; },
  { drafts: () => facade(['prep-ledger-draft-2030-01-01'], -1, true) });
compare('V51 default facade', T => { const s = patch51Input(T); return { s, result: T.patchV51(s) }; });
const nullDrafts = compare('V51 null facade caught boundary', T => {
  const s = patch51Input(T); return { s, result: T.patchV51(s) };
}, { drafts: () => null });
assert.equal(nullDrafts.s.insertions.fly, '2026-08-14');
for (const active of [false, true]) {
  const result = compare('V51 current-day session ' + active, T => {
    const s = patch51Input(T); s.sessionLog['2026-11-01'] = active ? { entries: [{ id: 'rows', w: 100, reps: [8, 8] }] } : null;
    return { s, result: T.patchV51(s) };
  }, { clock: makeClock('2026-11-02T04:30:00.000Z', '2026-11-01') });
  assert.equal(result.s.insertions.fly, active ? '2026-11-02' : '2026-08-14');
}

for (const existing of [true, false]) compare('V60 instance seed marker ' + existing, T => {
  T.SEED.insertions = { fly: '2026-07-01', hipthrust: '2026-07-02' };
  const s = synthetic(T, 59); s.insertions = existing ? { fly: '2026-09-01', hipthrust: '2026-09-02' } : {};
  return { s, result: T.patchV60(s) };
});
for (const shape of ['string', 'tied numeric', 'advanced numeric', 'wrong sets']) compare('V60 vector ' + shape, T => {
  const s = synthetic(T, 59), ex = s.exercises.find(e => e.id === 'curl');
  ex.w = shape === 'string' ? '55·55·50' : shape === 'advanced numeric' ? 60 : 55;
  ex.sets = shape === 'wrong sets' ? 2 : 3; ex.ladder = [50, 55, 60]; delete ex.wSets;
  s.sessionLog = { '2026-08-20': { entries: [{ id: 'curl', w: 55, wKey: '55·55·50', reps: [10, 10, 10] }] } };
  return { s, result: T.patchV60(s) };
});
compare('V60 seam receipt and order', T => {
  const s = synthetic(T, 59); s.exercises[0].forks = [
    { from: '2026-08-17', split: true, ops: ['fly inserted upstream'] },
    { from: '2026-08-17', split: true, ops: ['owner correction'] }];
  s.feed = [{ d: '2026-08-17', t: 'old projection', op: 'seam:synthetic' }, { d: '2026-08-17', t: 'original note', op: 'fact:keep' }];
  return { s, result: T.patchV60(s) };
});

compare('anchorDexa deterministic IDs and clone identity', T => {
  const s = synthetic(T), before = clone(s);
  const first = T.anchorDexa(s, 17.3), second = T.anchorDexa(first, 17.1);
  assert.deepEqual(s, before); assert.notStrictEqual(first, s); assert.notStrictEqual(second, first);
  assert.equal(first.learned.anchors.at(-1).id, 'dexa_m5_0');
  assert.equal(second.learned.anchors.at(-1).id, 'dexa_m5_1');
  return { s, first, second };
});
const correctionClock = makeClock('2026-10-12T03:14:15.000Z', '2026-10-11');
const stamped = compare('correction stamp injected clock and repeat', T => {
  const rec = { entries: [] };
  const first = T._stampCorr(rec), snapshot = clone(rec), second = T._stampCorr(rec);
  return { rec, first, snapshot, second };
}, { clock: correctionClock });
assert.equal(stamped.rec.corr.at, correctionClock.nowISO());
assert.equal(stamped.rec.corr.rev, 2);
compare('correction filing live monotonic and duplicate identity', T => {
  const rec = { entries: [], corr: { at: '2026-08-30T17:00:00.000Z', rev: 1 },
    corrLog: [{ op: 'corr:rows:strike:2026-08-30T17:00:00.000Z', kind: 'strike', id: 'rows', at: '2026-08-30T17:00:00.000Z', to: 1 }] };
  const first = T._fileCorr(rec, 'corr:rows:strike:2026-08-30T16:00:00.000Z', 'strike', 'rows', '2026-08-30T16:00:00.000Z', 2, { live: true });
  const snapshot = clone(rec), last = rec.corrLog.at(-1);
  const second = T._fileCorr(rec, last.op, 'strike', 'rows', last.at, 2);
  return { rec, first, snapshot, second };
});
for (const change of ['none', 'read value', 'last date', 'read count', 'night count', 'food count', 'session count', 'null']) {
  compare('isPristineSeed ' + change, T => {
    let s = clone(T.SEED);
    if (change === 'read value') s.reads.at(-1).w += 17;
    if (change === 'last date') s.reads.at(-1).d = '2099-01-01';
    if (change === 'read count') s.reads.push({ d: '2099-01-01', w: 200 });
    if (change === 'night count') s.sleep.nights.push({ d: '2099-01-01', h: 8 });
    if (change === 'food count') s.dailyLogs['2099-01-01'] = { cal: 2000 };
    if (change === 'session count') s.sessionLog['2099-01-01'] = { entries: [] };
    if (change === 'null') s = null;
    return { s, result: T.isPristineSeed(s) };
  });
}

function guardBase(T) {
  const s = synthetic(T); s.feed = [{ d: '2026-08-30', t: 'SYNTHETIC FACT', how: 'Original prose.', op: 'fact:one' }];
  s.sessionLog = { '2026-08-30': { entries: [{ id: 'rows', w: 100, reps: [8, 8] }] } };
  s.adjustments = [{ id: 'adjust-synthetic' }];
  s.learned = { tdee: [{ id: 'tdee-synthetic' }], anchors: [{ id: 'anchor-synthetic' }] };
  s.sessionLog['2026-08-30'].corrLog = [{ op: 'corr:synthetic', id: 'rows', kind: 'strike', at: '2026-08-30T16:00:00.000Z', to: 1 }];
  s.waist = [{ d: '2026-08-30', in: 34 }]; s.photos = [{ d: '2026-08-30', id: 'photo-synthetic' }];
  return s;
}
const losses = {
  reads: s => { s.reads = []; }, nights: s => { s.sleep.nights = []; }, food: s => { s.dailyLogs = {}; },
  session: s => { s.sessionLog = {}; }, adjustments: s => { s.adjustments = []; },
  tdee: s => { s.learned.tdee = []; }, anchors: s => { s.learned.anchors = []; },
  correction: s => { s.sessionLog['2026-08-30'].corrLog = []; }, waist: s => { s.waist = []; }, photos: s => { s.photos = []; },
  permanentReceipt: s => { s.feed = []; }
};
for (const [name, lose] of Object.entries(losses)) {
  const result = compare('guard loss ' + name, T => { const prev = guardBase(T), next = clone(prev); lose(next); return { prev, next, result: T.dataLossGuard(prev, next) }; });
  assert.equal(result.result.safe, false, name + ': negative guard fixture must lose a record');
}
compare('guard empty/invalid states', T => [T.dataLossGuard(null, null), T.dataLossGuard({}, null), T.recordCounts(null), T.recordCounts(7)]);
for (const receipt of ['duplicate permanent op', 'opless', 'derived', 'missed unresolved', 'missed clean', 'missed sealed', 'missed offWindow']) {
  const result = compare('guard receipts ' + receipt, T => {
    const prev = guardBase(T); prev.reads = [];
    if (receipt === 'duplicate permanent op') prev.feed.push(clone(prev.feed[0]));
    else if (receipt === 'opless') prev.feed.push({ d: '2026-08-29', t: 'Original uncoded receipt.' });
    else if (receipt === 'derived') prev.feed.push({ d: '2026-08-29', t: 'Derived read', op: 'lateread:2026-08-29' });
    else prev.feed.push({ d: '2026-08-29', t: 'MORNING READ MISSED', how: 'Synthetic missing day.' });
    const next = clone(prev); next.feed.pop();
    if (receipt.startsWith('missed ') && receipt !== 'missed unresolved') next.reads.push({ d: '2026-08-29', w: 200, ...(receipt === 'missed sealed' ? { sealed: true } : receipt === 'missed offWindow' ? { offWindow: true } : {}) });
    return { prev, next, result: T.dataLossGuard(prev, next) };
  });
  assert.equal(result.result.safe, !['opless', 'missed unresolved', 'missed offWindow'].includes(receipt));
}
compare('guard same-day read deduplication', T => { const prev = guardBase(T); prev.reads.push(clone(prev.reads[0])); const next = clone(prev); next.reads.pop(); return { prev, next, result: T.dataLossGuard(prev, next) }; });
compare('guard filed strike correction plus receipt', T => {
  const prev = guardBase(T), next = clone(prev); next.sessionLog['2026-08-30'].entries[0].reps.pop();
  next.sessionLog['2026-08-30'].corrLog.push({ op: 'corr:strike-2', id: 'rows', kind: 'strike', at: '2026-08-30T17:00:00.000Z', to: 1 });
  next.feed.unshift({ d: '2026-08-30', t: 'SET CORRECTED', how: 'Synthetic accidental set.', op: 'corr:strike-2' });
  return { prev, next, result: T.dataLossGuard(prev, next) };
});
compare('read receipt full prose/order and repeat', T => {
  const s = synthetic(T); s.reads = [
    { d: '2026-08-27', w: 202, offWindow: true }, { d: '2026-08-28', w: 201, sealed: true },
    { d: '2026-08-29', w: 200, reclassed: true }];
  s.reclassLog = [{ d: '2026-08-29', morning: true }];
  s.feed = [
    { d: '2026-08-28', t: 'MORNING READ MISSED', how: 'remove because sealed' },
    { d: '2026-08-26', t: 'MORNING READ MISSED', how: 'first duplicate' },
    { d: '2026-08-26', t: 'READ GAP — synthetic', how: 'second duplicate' },
    { d: '2026-08-27', t: 'LATE READ — SET ASIDE', how: 'stale projection', op: 'lateread:old' },
    { d: '2026-08-30', t: 'KEEP EXACT.', how: '  spaces; punctuation!  ', op: 'fact:exact', extra: { preserve: true } }];
  const first = T.reconcileReadReceipts(s), snapshot = clone(s), second = T.reconcileReadReceipts(s);
  return { s, first, snapshot, second };
});

const rename = compare('rename .from full-state DTO gap', T => {
  const a = T.migrate(synthetic(T)), id = a.exercises[0].id;
  a.exercises[0].n = 'NEW NAME'; a.exercises[0].renames = [{ prevN: 'OLD NAME', from: '2026-08-01' }];
  const b = clone(a); b.exercises[0].renames[0].from = '2026-08-03';
  T.migrate(a); T.migrate(b);
  return { a, b, aName: T.nameAt(a, id, '2026-08-02'), bName: T.nameAt(b, id, '2026-08-02'), aDTO: records(a), bDTO: records(b) };
});
assert.notEqual(rename.aName, rename.bName);
assert.deepEqual(rename.aDTO, rename.bDTO);
assert.notEqual(JSON.stringify(rename.a), JSON.stringify(rename.b));

function mintState(T) {
  const s = synthetic(T); s.queue = []; s.retirements = {}; s.insertions = {};
  const ex = { id: 'synthetic_press', n: 'Synthetic press', mg: 'chest', day: 'U', w: 100, inc: 5, sets: 2, hi: 10, lo: 8, topAt: 100, topRun: 2 };
  s.exercises = [ex];
  s.sessionLog = Object.fromEntries(['2026-08-28', '2026-08-30'].map(d => [d, { entries: [{ id: ex.id, w: 100, reps: [10, 10], rir: 2, rirSets: [2, 0] }] }]));
  s.feed = ['2026-08-28', '2026-08-30'].map(d => ({ d, t: 'SYNTHETIC PRESS — TOP OF WINDOW, PROVISIONAL', how: 'synthetic separate first sighting', op: 'synthetic:' + d }));
  return s;
}
const minted = compare('mint qualifying full writer closure', T => {
  const s = mintState(T), before = clone(s), trace = T._deriveSightingFull(s, s.exercises[0]);
  const result = T._mintJointEarn(s, s.exercises[0]), first = clone(s), again = T._mintJointEarn(s, s.exercises[0]);
  return { before, trace, result, first, again, s };
});
assert.equal(minted.trace.tops.length, 2, 'positive mint has two real derived tops');
assert.equal(minted.result, true, 'positive mint really executed writer closure');
assert.equal(minted.first.queue.some(q => q.newW === 105 && q.state === 'DEBUT'), true);
assert.equal(minted.first.feed.some(f => f.t === 'SYNTHETIC PRESS 105 EARNED'), true);
assert.equal(minted.again, false);
for (const why of ['one sighting', 'hot opener', 'missing receipt', 'active debut', 'nonnumeric load']) {
  const result = compare('mint nonqualifying ' + why, T => {
    const s = mintState(T);
    if (why === 'one sighting') delete s.sessionLog['2026-08-28'];
    if (why === 'hot opener') s.sessionLog['2026-08-30'].entries[0].rir = 0;
    if (why === 'missing receipt') s.feed.pop();
    if (why === 'active debut') s.queue.push({ id: 'pending', exId: s.exercises[0].id, kind: 'debut', done: false });
    if (why === 'nonnumeric load') s.exercises[0].w = '100';
    const before = clone(s), result = T._mintJointEarn(s, s.exercises[0]); return { before, result, s };
  });
  assert.equal(result.result, false); assert.deepEqual(result.s, result.before);
}
const boot = compare('boot does not mint qualifying sightings', T => { const s = mintState(T); const result = T.migrate(s); return { s, result }; });
assert.equal(boot.s.queue.some(q => q.kind === 'debut'), false);
assert.equal(boot.s.feed.some(f => / EARNED$/.test(f.t)), false);
const requested = compare('explicit reconcile mint invokes writer', T => { const s = mintState(T); return { s, result: T.reconcileSightings(s, { mint: true }) }; });
assert.equal(requested.s.queue.some(q => q.kind === 'debut'), true);

// Independent instances: table/seed/constants/provider state all belong to their
// engine. This also exercises the default draft facade without ambient storage.
const a = createEngine({ clock, ids: deterministicIds(), drafts: facade(['prep-ledger-draft-2030-01-01']) });
const b = createEngine({ clock, ids: deterministicIds() });
assert.notStrictEqual(a.SEED, b.SEED); assert.notStrictEqual(a.PATCHES, b.PATCHES);
assert.deepEqual(a.PATCHES.map(([n]) => n), Array.from({ length: 57 }, (_, i) => i + 4));
for (const [n, f] of a.PATCHES) assert.strictEqual(f, a['patchV' + n]);
for (const [n, f] of b.PATCHES) assert.notStrictEqual(f, a['patchV' + n]);
const seedBefore = clone(b.SEED); a.SEED.insertions.fly = '2026-07-01';
const sa = synthetic(a, 59), sb = synthetic(b, 59); sa.insertions = { fly: '2030-01-01' }; sb.insertions = clone(sa.insertions);
a.patchV60(sa); b.patchV60(sb);
assert.equal(sa.insertions.fly, '2026-07-01'); assert.equal(sb.insertions.fly, seedBefore.insertions.fly); assert.deepEqual(b.SEED, seedBefore);
assert.equal(a.anchorDexa(synthetic(a), 17).learned.anchors.at(-1).id, 'dexa_m5_0');
assert.equal(a.anchorDexa(synthetic(a), 17).learned.anchors.at(-1).id, 'dexa_m5_1');
assert.equal(b.anchorDexa(synthetic(b), 17).learned.anchors.at(-1).id, 'dexa_m5_0');
const pa = patch51Input(a), pb = patch51Input(b); a.patchV51(pa); b.patchV51(pb);
assert.notEqual(JSON.stringify(pa), JSON.stringify(pb), 'draft provider state changes only its own engine');

assert.strictEqual(globalThis.Date, baseDate);
console.log('M5 SYNTHETIC ' + mode + ': PASS — ' + comparisons + ' exact differential cases; ' + migrationExits + ' migration exits/repeats; identity, receipt bytes, draft scans, seed/ID isolation, real mint and boot boundaries.');
