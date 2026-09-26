'use strict';
/* =====================================================================
   M2-S3-COMPANION SUPERSEDES THE NATIVE-CARRIERS CARRIER `defect-witnesses`
   (gate witnesses-7)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. `NATIVE DEFECT WITNESSES:
   10/10 complete comparisons PASS;` - for each adopted defect it ran the
   FROZEN engine and the CANDIDATE engine over the same witness input and
   compared the two outputs completely, so a repair was evidenced by the
   difference it made and by nothing else. A witness that could not be
   produced on both sides was not a witness.

   WHY S3 CANNOT CARRY IT. The frozen side of every comparison is
   reconstructed from the sha-pinned carrier list that S3's two engine files
   break (see s3-supersede-source-carriers.test.cjs).

   WHAT S3 PUTS IN ITS PLACE, HERE, EXECUTED, AND IT IS THE SAME SHAPE. S3
   closes no register defect; it adds two capabilities, and each is witnessed
   as a COMPLETE COMPARISON between the ACCEPTED engine (the `sourceBase`
   bytes, compiled privately, never in require.cache) and S3's, over the same
   input, with BOTH outputs read out in full. (1) MEMBERSHIP: the accepted
   engine can name a training day's pool only through genSession, which reads
   the structural picker and therefore SLEEP - an admission with no recorded
   night must invent one; S3 answers the pool and its order with no sleep at
   all, and the answer equals the accepted genSession's ids under the recorded
   night. (2) THE SEAM: the accepted merge ignores an injected calendar
   entirely - a poisoned adapter is never reached - so an import provider
   cannot validate a reached operation; S3 routes every reached operation
   through it, and with the native adapter answers byte for byte as before.

   RED-FIRST: every cell asserts the accepted bytes' own limitation before it
   asserts S3's capability; on the parent's engine each S3-side assert fails.
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
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const { createEngine } = require('../../../engine/index.cjs');
const { createSyntheticState, SYNTHETIC_DAY, dayOffset } = require('../../../m3/w7-preview/fixtures.cjs');

function privately(file, source) {
  const abs = path.join(REPO, file);
  const m = new Module(abs, module);
  m.filename = abs;
  m.paths = Module._nodeModulePaths(path.dirname(abs));
  const normal = m.require.bind(m);
  m.require = name => (name.startsWith('.') ? require(path.resolve(path.dirname(abs), name)) : normal(name));
  m._compile(source, abs);
  return m.exports;
}
const ACCEPTED_TODAY = privately('rebuild/engine/today.cjs', blob('rebuild/engine/today.cjs'));
const ACCEPTED_MERGE = privately('rebuild/engine/merge.cjs', blob('rebuild/engine/merge.cjs'));
const OURS_TODAY = require('../../../engine/today.cjs');
const OURS_MERGE = require('../../../engine/merge.cjs');
assert.notEqual(ACCEPTED_TODAY, OURS_TODAY, 'two distinct today factories, one per side');
assert.notEqual(ACCEPTED_MERGE, OURS_MERGE, 'two distinct merge factories, one per side');

const DAY = SYNTHETIC_DAY, L_DAY = dayOffset(DAY, 1);
const clock = { today: () => L_DAY, hour: () => 8, now: () => new Date(L_DAY + 'T13:00:00.000Z'), stamp: () => L_DAY + 'T13:00:00.000Z' };
const table = () => createEngine({ clock });
/* rebuild/engine/index.cjs's own composition with TWO substitutions, the today
   and merge factories of the side under comparison; every other module is the
   real one, in index.cjs's own order (read from its source, never re-typed). */
const ORDER = [...fs.readFileSync(path.join(REPO, 'rebuild/engine/index.cjs'), 'utf8').matchAll(/require\("\.\/([a-z-]+)\.cjs"\)/g)].map(m => m[1]);
assert.equal(ORDER.length, 16);
function sideOf(todayFactory, mergeFactory, deps) {
  const E = {};
  const base = { clock, ids: undefined, drafts: Object.freeze({ length: 0, key: () => null }) };
  for (const name of ORDER) {
    const factory = name === 'today' ? todayFactory : name === 'merge' ? mergeFactory : require('../../../engine/' + name + '.cjs');
    Object.assign(E, factory(E, name === 'merge' ? { ...base, ...deps } : base));
  }
  return E;
}
function pendingHackDebut() {
  const s = createSyntheticState();
  const leg = s.exercises.find(e => e.id === 'demo-leg');
  leg.id = 'hack'; leg.n = 'SYNTHETIC hack squat'; leg.steps = [40, 45, 50]; leg.w = 40;
  for (const d of Object.keys(s.sessionLog)) for (const en of s.sessionLog[d].entries) if (en.id === 'demo-leg') en.id = 'hack';
  s.queue = [{ id: 'SYNTHETIC-hack-debut', kind: 'debut', exId: 'hack', newW: 45, done: false, state: 'READY', t: 'SYNTHETIC recorded debut' }];
  return s;
}

test('S3/SUP-11 - defect-witnesses: MEMBERSHIP, complete comparison - the accepted engine must read sleep to name the pool, S3 need not', () => {
  const s = pendingHackDebut();
  const both = {};
  for (const [side, E] of [['accepted', sideOf(ACCEPTED_TODAY, ACCEPTED_MERGE, {})], ['s3', sideOf(OURS_TODAY, OURS_MERGE, {})]]) {
    const out = { hasReader: typeof E.sessionMembership === 'function', membership: null, noSleep: null, recorded: null };
    if (out.hasReader) out.membership = E.sessionMembership(s, L_DAY);
    try { out.noSleep = { ids: E.genSession(structuredClone(s), L_DAY, undefined).ex.map(c => c.id) }; }
    catch (e) { out.noSleep = { threw: String(e.message) }; }
    out.recorded = E.genSession(structuredClone(s), L_DAY, E.sleepInfo(s)).ex.map(c => ({ id: c.id, w: c.w, tgt: c.tgt }));
    both[side] = out;
  }
  /* THE WITNESS, read out in full. */
  assert.equal(both.accepted.hasReader, false, 'WITNESS: the accepted engine has no membership reader');
  assert(both.accepted.noSleep.threw, 'WITNESS: with no night recorded, the accepted genSession refuses on the pending debut: ' + both.accepted.noSleep.threw);
  assert.deepEqual(both.accepted.recorded.map(c => c.id), ['hack', 'demo-curl'], 'the pool is answerable only under a night');
  /* THE CAPABILITY, read out as completely. */
  assert.equal(both.s3.hasReader, true, 'S3: the reader exists');
  assert.deepEqual(both.s3.membership, { day: 'L', exercise_ids: ['hack', 'demo-curl'] }, 'S3: the pool and its order, with no night');
  assert.deepEqual(both.s3.noSleep, both.accepted.noSleep, 'S3: genSession without a night refuses exactly as before');
  assert.deepEqual(both.s3.recorded, both.accepted.recorded, 'S3: genSession under the recorded night is the accepted answer, ids, loads and targets');
  assert.deepEqual(both.s3.membership.exercise_ids.slice(), both.accepted.recorded.map(c => c.id), 'and the reader names exactly that pool');
});

test('S3/SUP-12 - defect-witnesses: THE SEAM, complete comparison - the accepted merge never reaches an injected calendar, S3 reaches it at every site', () => {
  function poison() {
    const reached = [];
    function P(ms) { reached.push(['construct', ms]); return new Date(ms); }
    P.parse = v => { reached.push(['parse', v]); return Date.parse(v); };
    return { P, reached };
  }
  const stamp = '2026-03-08T02:30:00';
  const rec = () => ({ corr: { at: '2026-09-01T10:00:00.000Z', rev: 1 }, corrLog: [{ op: 'skip:hack:1:2026-09-01T10:00:00.000Z', kind: 'skip', id: 'hack', at: '2026-09-01T10:00:00.000Z' }] });
  const both = {};
  for (const [side, factory] of [['accepted', ACCEPTED_MERGE], ['s3', OURS_MERGE]]) {
    const { P, reached } = poison();
    const M = sideOf(OURS_TODAY, factory, { nativeDate: P });
    const out = {};
    out.corrOf = M._corrOf({ corr: { at: stamp, rev: 2 } });
    out.adj = M._adjInstant({ at: stamp });
    out.fileCorr = M._fileCorr(rec(), 'unskip:hack:1:2026-09-01T09:00:00.000Z', 'unskip', 'hack', '2026-09-01T09:00:00.000Z', undefined, { live: true });
    out.session = M._mergeSession({ corr: { at: stamp, rev: 1 }, entries: [{ id: 'hack', w: 40, reps: [10], rir: 2, sets: 1 }], type: 'L' },
      { at: Date.parse(stamp) + 1, entries: [{ id: 'hack', w: 45, reps: [9], rir: 2, sets: 1 }], type: 'L' });
    out.reached = reached.map(r => r[0] + ':' + String(r[1]));
    both[side] = out;
  }
  /* THE WITNESS. */
  assert.deepEqual(both.accepted.reached, [], 'WITNESS: the accepted merge consulted the injected calendar at no site');
  /* THE CAPABILITY. */
  assert(both.s3.reached.length >= 6, 'S3: every site is routed: ' + both.s3.reached.join(' | '));
  assert(both.s3.reached.includes('parse:' + stamp), 'S3: _corrOf, _adjInstant and the 3:2 rule parsed the raw stamp');
  assert(both.s3.reached.includes('construct:' + (Date.parse('2026-09-01T10:00:00.000Z') + 1)), 'S3: the live bump constructed latest + 1 ms');
  /* And with the native implementation behind the adapter, every answer is byte-identical. */
  for (const k of ['corrOf', 'adj', 'fileCorr', 'session'])
    assert.equal(JSON.stringify(both.s3[k]), JSON.stringify(both.accepted[k]), 'same answer through the seam: ' + k);
});

test('S3/SUP-13 - defect-witnesses: the runtime facade, both sides - four names then, five now, and the fifth is the engine\'s own reader', () => {
  const Runtime = require('../engine-runtime.cjs');
  const parentRuntimeSrc = blob('rebuild/m4/workout/engine-runtime.cjs');
  assert(parentRuntimeSrc.includes("const EXPOSED=Object.freeze(['genSession','rirPlan','dayWeather','cleanAtDate']);"), 'WITNESS: the parent facade exposes four names');
  assert(!parentRuntimeSrc.includes('sessionMembership'), 'WITNESS: and knows no membership');
  // NATIVE-LOAD-SPEC R7 D inventory (s3-supersede-defect-witnesses.test.cjs:152, FC04): five S3 names, then the two native-load names.
  assert.deepEqual(Runtime.COMPOSITION.exposed.slice(), ['genSession', 'rirPlan', 'dayWeather', 'cleanAtDate', 'sessionMembership', 'evaluateNativeLoad', 'applyNativeLoadDecision'], 'S3: five, then NATIVE-LOAD: seven');
  const s = pendingHackDebut();
  const r = Runtime.createEngineRuntime({ clock });
  const E = table();
  assert.deepEqual(r.sessionMembership(s, L_DAY), E.sessionMembership(s, L_DAY), 'the facade forwards the engine\'s own reader, unwrapped');
  assert.deepEqual(Object.keys(Runtime).sort(), ['COMPOSITION', 'absentProvider', 'createEngineRuntime'], 'module exports unchanged');
});
