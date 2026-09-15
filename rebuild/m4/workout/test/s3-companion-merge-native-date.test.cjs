'use strict';
/* =====================================================================
   M2-S3-COMPANION — THE MERGE NATIVE-DATE SEAM, NATIVE VS INJECTED
   (rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md, B custody;
   CRITICAL-PATH-2026-09-15 section 4 P1)

   createMerge(E, { clock, nativeDate = Date }) routes exactly six calendar
   operations through the injected constructor: the five parse sites
   (_corrOf, _fileCorr x2, the _richerSession 3:2 rule that _mergeSession
   reaches, _adjInstant) and the one constructor site in _fileCorr's live +1
   ms bump. Everything below asserts the same thing from six directions: an
   adapter that captures the real native implementation produces the SAME
   answer as the default, on the SAME raw input bytes, with the SAME mutation
   (or none), and the default path never touches an adapter at all.

   The adapter here is a RECORDING one and nothing more: it forwards every
   parse and every construction to the native Date and writes down the raw
   argument it saw. No calendar, no normalisation, no reference data.

   RED-FIRST: on the parent's merge.cjs (sourceBase blob, compiled in a
   private module) the injected adapter is never consulted, so the reach cells
   (S3/MD-2..7) fail on their `calls` assertions, and S3/MD-1 fails on the
   signature. The parent differential cell (S3/MD-9) is the byte-behaviour
   control in the other direction: native results equal the parent's.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S3.json'), 'utf8'));
const BASE = SPEC.sourceBase;
const MERGE = 'rebuild/engine/merge.cjs';
const { createEngine } = require('../../../engine/index.cjs');
const createMerge = require('../../../engine/merge.cjs');
const { createSyntheticState, SYNTHETIC_DAY, dayOffset } = require('../../../m3/w7-preview/fixtures.cjs');

const DAY = SYNTHETIC_DAY;
const clock = { today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'), stamp: () => DAY + 'T13:00:00.000Z' };
const engine = () => createEngine({ clock });

/* The recording adapter: the real native implementation, captured once, with
   every reached operation and its RAW argument written down. `new F(ms)`
   returns the Date instance F returns, so `.toISOString()` is the native one. */
function recordingAdapter() {
  const calls = [];
  const NativeDate = Date;
  function Adapter(ms) { calls.push({ op: 'construct', arg: ms }); return new NativeDate(ms); }
  Adapter.parse = v => { calls.push({ op: 'parse', arg: v }); return NativeDate.parse(v); };
  return { Adapter, calls };
}
/* A poisoned adapter: any reach is a failure. Used to prove the default
   path (no nativeDate supplied, and the whole createEngine composition) never
   consults anything but the native constructor. */
function poisonAdapter() {
  function Poison() { throw new Error('POISON-ADAPTER-REACHED construct'); }
  Poison.parse = () => { throw new Error('POISON-ADAPTER-REACHED parse'); };
  return Poison;
}
const pair = () => {
  const E = engine();
  const native = createMerge(E, { clock });
  const { Adapter, calls } = recordingAdapter();
  const injected = createMerge(E, { clock, nativeDate: Adapter });
  return { native, injected, calls };
};
const same = (a, b, label) => assert.deepEqual(JSON.parse(JSON.stringify(a === undefined ? null : a)), JSON.parse(JSON.stringify(b === undefined ? null : b)), label);

/* THE VECTORS. Offset-free March DST pair (America/New_York springs forward
   2026-03-08 02:00 -> 03:00): one stamp inside the skipped hour, one just
   after it; explicit-offset controls; the +1 ms boundary; malformed inputs. */
const DST_A = '2026-03-08T02:30:00';       // offset-free, inside the skipped hour
const DST_B = '2026-03-08T03:30:00';       // offset-free, first hour after the jump
const OFFSET_A = '2026-03-08T02:30:00-05:00';
const OFFSET_B = '2026-03-08T03:30:00-04:00';
const UTC_A = '2026-09-01T10:00:00.000Z';
const UTC_A1 = '2026-09-01T10:00:00.001Z';
const MALFORMED = ['', 'not-a-date', '2026-13-45T99:99:99Z', '2026-03-08T02:30:00-99:00', '   ', 'NaN'];
const PARSE_VECTORS = [DST_A, DST_B, OFFSET_A, OFFSET_B, UTC_A, UTC_A1, ...MALFORMED];

test('S3/MD-1 - the seam exists: createMerge takes {clock, nativeDate = Date} and the returned members are unchanged', () => {
  const src = fs.readFileSync(path.join(REPO, MERGE), 'utf8');
  assert(src.includes('module.exports = function createMerge(E, { clock, nativeDate = Date }) {'), 'the signature carries the defaulted seam');
  /* Exactly six routed operations, and not a seventh: every `Date.parse(` and
     `new Date(` in executable code is gone; the one remaining `new Date()` is
     the :177-era commentary the proposal names. */
  const executable = src.split('\n').filter(l => !/^\s*(\/\/|\/\*|\*|by `at`)/.test(l)).join('\n');
  assert.equal((executable.match(/\bDate\.parse\(/g) || []).length, 0, 'no bare Date.parse remains in executable code');
  assert.equal((executable.match(/\bnew Date\(/g) || []).length, 0, 'no bare new Date remains in executable code');
  assert.equal((src.match(/nativeDate\.parse\(/g) || []).length, 5, 'five parse sites');
  assert.equal((src.match(/new nativeDate\(/g) || []).length, 1, 'one constructor site');
  const E = engine();
  const parentKeys = Object.keys(createMerge(E, { clock })).sort();
  const injectedKeys = Object.keys(createMerge(E, { clock, nativeDate: recordingAdapter().Adapter })).sort();
  assert.deepEqual(injectedKeys, parentKeys, 'the same returned engine members either way');
  assert(parentKeys.includes('mergeState') && parentKeys.includes('_corrOf') && parentKeys.includes('_fileCorr')
    && parentKeys.includes('_mergeSession') && parentKeys.includes('_adjInstant'), 'the routed members are still returned');
});

test('S3/MD-2 - _corrOf: native and injected agree on every vector, the adapter sees the raw stamp, and malformed stays unstamped', () => {
  const { native, injected, calls } = pair();
  for (const at of PARSE_VECTORS) {
    for (const rev of [undefined, '2', 3, 'x']) {
      const v = { corr: { at, rev } };
      const a = native._corrOf(structuredClone(v)), b = injected._corrOf(structuredClone(v));
      same(a, b, '_corrOf ' + JSON.stringify(at) + ' rev ' + rev);
      if (at && Number.isFinite(Date.parse(at))) { assert(a && a.at === at, 'stamped, raw stamp kept: ' + at); }
      else assert.equal(a, null, 'malformed -> null: ' + JSON.stringify(at));
    }
  }
  const seen = calls.filter(c => c.op === 'parse').map(c => c.arg);
  for (const at of PARSE_VECTORS) if (at) assert(seen.includes(at), 'the adapter was handed the raw bytes ' + JSON.stringify(at));
  assert.equal(calls.filter(c => c.op === 'construct').length, 0, '_corrOf constructs nothing');
  // The DST pair really is offset-free and really parses in the LOCAL calendar:
  // both stamps are finite, and in the runner's own zone (America/New_York) the
  // skipped-hour stamp and the first post-jump stamp land on the SAME instant,
  // 07:30Z, while the explicit-offset controls do by construction. That is
  // precisely the ambiguity the adapter must reproduce and never re-interpret.
  assert(Number.isFinite(Date.parse(DST_A)) && Number.isFinite(Date.parse(DST_B)), 'offset-free stamps parse');
  assert.equal(Date.parse(OFFSET_A), Date.parse(OFFSET_B), 'the explicit-offset controls name one instant');
  if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/New_York')
    assert.equal(Date.parse(DST_A), Date.parse(DST_B), 'in New York the offset-free pair collapses onto one instant');
  for (const junk of [null, undefined, 1, 'x', { corr: null }, { corr: 'x' }, { corr: { at: 5 } }, { corr: { at: '' } }])
    same(native._corrOf(junk), injected._corrOf(junk), 'junk shape ' + JSON.stringify(junk));
});

test('S3/MD-3 - _fileCorr site 1: a malformed `at` falls to the record stamp identically, and a valid one is kept byte-for-byte', () => {
  for (const at of PARSE_VECTORS) {
    const { native, injected, calls } = pair();
    const rec = () => ({ corr: { at: UTC_A, rev: 1 }, corrLog: [] });
    const a = native._fileCorr(rec(), 'skip:demo-press:1:' + at, 'skip', 'demo-press', at, undefined, {});
    const b = injected._fileCorr(rec(), 'skip:demo-press:1:' + at, 'skip', 'demo-press', at, undefined, {});
    same(a, b, '_fileCorr site 1 ' + JSON.stringify(at));
    assert(calls.some(c => c.op === 'parse' && c.arg === at) || at === '', 'the raw `at` reached the adapter: ' + JSON.stringify(at));
    const filed = a.corrLog[a.corrLog.length - 1];
    assert.equal(filed.at, Number.isFinite(Date.parse(at)) ? at : UTC_A, 'valid stamp kept raw, malformed falls to the record stamp');
  }
});

test('S3/MD-4 - _fileCorr site 2 and the constructor: the live +1 ms bump is byte-identical, and never fires off-live', () => {
  const latest = UTC_A;
  const mk = () => ({ corr: { at: latest, rev: 1 }, corrLog: [{ op: 'skip:demo-press:1:' + latest, kind: 'skip', id: 'demo-press', at: latest }] });
  for (const at of [latest, '2026-09-01T09:59:59.999Z', '2026-08-31T10:00:00.000Z', DST_A, OFFSET_A]) {
    if (!(String(at) <= latest)) continue;
    const { native, injected, calls } = pair();
    const a = native._fileCorr(mk(), 'unskip:demo-press:1:' + at, 'unskip', 'demo-press', at, undefined, { live: true });
    const b = injected._fileCorr(mk(), 'unskip:demo-press:1:' + at, 'unskip', 'demo-press', at, undefined, { live: true });
    same(a, b, 'live bump ' + at);
    const bumped = a.corrLog.find(c => c.kind === 'unskip');
    assert.equal(bumped.at, UTC_A1, 'exactly one millisecond after the record\'s newest act');
    assert.equal(bumped.op, 'unskip:demo-press:1:' + UTC_A1, 'the key carries the effective stamp');
    assert.equal(a.corr.at, UTC_A1, 'the record stamp agrees with its own newest act');
    assert.deepEqual(calls.filter(c => c.op === 'construct').map(c => c.arg), [Date.parse(latest) + 1], 'one construction, at latest + 1');
    assert(calls.some(c => c.op === 'parse' && c.arg === latest), 'site 2 parsed the raw latest stamp');
  }
  // Off-live: same inputs, no bump, no construction, either way.
  const { native, injected, calls } = pair();
  const a = native._fileCorr(mk(), 'unskip:demo-press:1:' + latest, 'unskip', 'demo-press', latest, undefined, {});
  const b = injected._fileCorr(mk(), 'unskip:demo-press:1:' + latest, 'unskip', 'demo-press', latest, undefined, {});
  same(a, b, 'off-live');
  assert.equal(a.corrLog.find(c => c.kind === 'unskip').at, latest, 'no bump off-live');
  assert.equal(calls.filter(c => c.op === 'construct').length, 0, 'no construction off-live');
  // A later act is not bumped even live.
  const later = '2026-09-01T11:00:00.000Z';
  const { native: n2, injected: i2, calls: c2 } = pair();
  same(n2._fileCorr(mk(), 'unskip:demo-press:1:' + later, 'unskip', 'demo-press', later, undefined, { live: true }),
    i2._fileCorr(mk(), 'unskip:demo-press:1:' + later, 'unskip', 'demo-press', later, undefined, { live: true }), 'later act');
  assert.equal(c2.filter(c => c.op === 'construct').length, 0, 'a later act needs no bump');
});

test('S3/MD-5 - the constructor on a malformed latest: native RangeError, caught by the existing catch, record unchanged either way', () => {
  const latest = 'zz-not-a-stamp';
  const mk = () => ({ corr: { at: UTC_A, rev: 1 }, corrLog: [{ op: 'skip:demo-press:1:' + latest, kind: 'skip', id: 'demo-press', at: latest }] });
  const at = 'a-stamp-that-sorts-below'; // <= latest by string, so the bump path is entered
  const { native, injected, calls } = pair();
  const a = native._fileCorr(mk(), 'unskip:demo-press:1:' + at, 'unskip', 'demo-press', UTC_A, undefined, { live: true });
  const b = injected._fileCorr(mk(), 'unskip:demo-press:1:' + at, 'unskip', 'demo-press', UTC_A, undefined, { live: true });
  same(a, b, 'malformed latest');
  assert.equal(String(UTC_A) <= latest, true, 'the bump branch is really entered');
  const constructs = calls.filter(c => c.op === 'construct');
  assert.equal(constructs.length, 1, 'the constructor was reached once');
  assert(Number.isNaN(constructs[0].arg), 'with NaN, the native answer for a malformed parse');
  assert.throws(() => new Date(NaN).toISOString(), RangeError, 'and native toISOString on an invalid Date throws');
  same(a, mk(), 'the throw is swallowed by _fileCorr\'s own catch and the record is returned unchanged');
});

test('S3/MD-6 - the _richerSession 3:2 rule reached through _mergeSession: plain-vs-stamped decided identically on every vector', () => {
  for (const at of PARSE_VECTORS) {
    if (!Number.isFinite(Date.parse(at))) continue;   // an unparseable corr is unstamped and never reaches rule 3:2
    for (const plainAt of [Date.parse(at) - 1, Date.parse(at), Date.parse(at) + 1, 'x', undefined]) {
      const stamped = () => ({ corr: { at, rev: 1 }, entries: [{ id: 'demo-press', w: 40, reps: [10, 10], rir: 2, sets: 2 }], type: 'U' });
      const plain = () => ({ at: plainAt, entries: [{ id: 'demo-press', w: 45, reps: [9, 9], rir: 2, sets: 2 }], type: 'U' });
      const { native, injected, calls } = pair();
      same(native._mergeSession(stamped(), plain()), injected._mergeSession(stamped(), plain()), 'x=stamped ' + at + ' plain ' + plainAt);
      same(native._mergeSession(plain(), stamped()), injected._mergeSession(plain(), stamped()), 'x=plain ' + at + ' plain ' + plainAt);
      assert(calls.some(c => c.op === 'parse' && c.arg === at), 'rule 3:2 parsed the raw corr stamp ' + at);
    }
  }
});

test('S3/MD-7 - _adjInstant: parse, id fallback and null on every vector, identically', () => {
  const idAt = 'adj_' + (1.6e12).toString(36) + 'rest';
  for (const at of [...PARSE_VECTORS, undefined, null, 0]) {
    for (const id of [undefined, idAt, 'adj_00000001', 'other']) {
      const { native, injected, calls } = pair();
      const x = { at, id };
      const a = native._adjInstant(structuredClone(x)), b = injected._adjInstant(structuredClone(x));
      same(a, b, '_adjInstant ' + JSON.stringify(x));
      if (at) assert(calls.some(c => c.op === 'parse' && c.arg === at), 'the raw at reached the adapter');
      if (at && Number.isFinite(Date.parse(at))) assert.equal(a, Date.parse(at));
      else if (id === idAt) assert.equal(a, 1.6e12);
      else assert.equal(a, null);
    }
  }
});

test('S3/MD-8 - the DEFAULT is native: createEngine and a bare createMerge never consult an adapter, and inputs are read only', () => {
  const E = engine();
  // A poisoned global would be the only way for the default path to differ; the
  // default binds the real Date at module evaluation of createMerge's signature,
  // so a poisoned adapter handed to a DIFFERENT instance cannot leak into it.
  const poisoned = createMerge(E, { clock, nativeDate: poisonAdapter() });
  assert.throws(() => poisoned._adjInstant({ at: UTC_A }), /POISON-ADAPTER-REACHED parse/, 'the poisoned instance really is poisoned');
  const plain = createMerge(E, { clock });
  assert.equal(plain._adjInstant({ at: UTC_A }), Date.parse(UTC_A), 'the bare instance is untouched');
  assert.equal(E._adjInstant({ at: UTC_A }), Date.parse(UTC_A), 'and so is the composed engine');
  assert.deepEqual(E._corrOf({ corr: { at: DST_A, rev: 1 } }), { at: DST_A, rev: 1 }, 'the composed engine parses natively');
  // Read-only: the pure readers leave their inputs byte-identical.
  const v = { corr: { at: DST_A, rev: '2' }, at: DST_B, id: 'adj_x' };
  const before = JSON.stringify(v);
  plain._corrOf(v); plain._adjInstant(v); E._corrOf(v); E._adjInstant(v);
  assert.equal(JSON.stringify(v), before, 'inputs untouched');
});

/* THE PARENT DIFFERENTIAL: the sourceBase merge.cjs, compiled privately from
   the Git blob (never required, never entering require.cache), composed over
   the same engine table, must answer every vector above exactly as HEAD's
   default path does, and mergeState over two synthetic replicas must be
   byte-identical. This is the byte-behaviour control the proposal asks for. */
function parentMerge(E) {
  const src = cp.execFileSync('git', ['show', BASE + ':' + MERGE], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
  assert(src.includes('module.exports = function createMerge(E, { clock }) {'), 'the parent has no seam');
  const m = new Module(path.join(REPO, 'rebuild/engine/__s3_parent_merge__.cjs'), module);
  m._compile(src, m.id);
  return m.exports(E, { clock });
}
test('S3/MD-9 - parent differential: HEAD\'s default path answers exactly as the sourceBase merge.cjs on every vector and on mergeState', () => {
  const E = engine();
  const head = createMerge(E, { clock }), parent = parentMerge(E);
  for (const at of PARSE_VECTORS) {
    same(head._corrOf({ corr: { at, rev: 1 } }), parent._corrOf({ corr: { at, rev: 1 } }), '_corrOf ' + at);
    same(head._adjInstant({ at }), parent._adjInstant({ at }), '_adjInstant ' + at);
    const rec = () => ({ corr: { at: UTC_A, rev: 1 }, corrLog: [{ op: 'skip:demo-press:1:' + UTC_A, kind: 'skip', id: 'demo-press', at: UTC_A }] });
    same(head._fileCorr(rec(), 'unskip:demo-press:1:' + at, 'unskip', 'demo-press', at, undefined, { live: true }),
      parent._fileCorr(rec(), 'unskip:demo-press:1:' + at, 'unskip', 'demo-press', at, undefined, { live: true }), '_fileCorr live ' + at);
    if (Number.isFinite(Date.parse(at))) {
      const stamped = () => ({ corr: { at, rev: 1 }, entries: [{ id: 'demo-press', w: 40, reps: [10, 10], rir: 2, sets: 2 }], type: 'U' });
      const plain = () => ({ at: Date.parse(at) + 1, entries: [{ id: 'demo-press', w: 45, reps: [9, 9], rir: 2, sets: 2 }], type: 'U' });
      same(head._mergeSession(stamped(), plain()), parent._mergeSession(stamped(), plain()), '_mergeSession ' + at);
    }
  }
  // Two replicas of the public synthetic athlete, diverged: a corrected session
  // on one side, a later weigh-in and an adjustment on the other.
  const local = createSyntheticState(), remote = createSyntheticState();
  const d = Object.keys(local.sessionLog).sort().at(-1);
  local.sessionLog[d] = { ...local.sessionLog[d], corr: { at: DST_A, rev: 1 },
    corrLog: [{ op: 'skip:demo-row:1:' + DST_A, kind: 'skip', id: 'demo-row', at: DST_A }], skipped: ['demo-row'] };
  remote.reads.push({ d: dayOffset(DAY, -1), w: 175.2, sealed: false, note: 'SYNTHETIC late replica' });
  remote.adjustments = [{ id: 'adj_' + (1.7e12).toString(36) + 'aaaa', at: OFFSET_B, d: dayOffset(DAY, -2), kind: 'note' }];
  local.adjustments = [{ id: 'adj_' + (1.7e12).toString(36) + 'bbbb', at: 'bad-stamp', d: dayOffset(DAY, -3), kind: 'note' }];
  const a = head.mergeState(structuredClone(local), structuredClone(remote));
  const b = parent.mergeState(structuredClone(local), structuredClone(remote));
  assert.equal(JSON.stringify(a), JSON.stringify(b), 'mergeState byte-identical to the parent');
  const c = head.mergeState(structuredClone(remote), structuredClone(local));
  const dd = parent.mergeState(structuredClone(remote), structuredClone(local));
  assert.equal(JSON.stringify(c), JSON.stringify(dd), 'and in the other direction');
  // And the injected path over the same replicas is byte-identical too.
  const { Adapter, calls } = recordingAdapter();
  const inj = createMerge(E, { clock, nativeDate: Adapter });
  assert.equal(JSON.stringify(inj.mergeState(structuredClone(local), structuredClone(remote))), JSON.stringify(a), 'injected mergeState byte-identical');
  assert(calls.length > 0, 'and mergeState really reached the seam');
});
