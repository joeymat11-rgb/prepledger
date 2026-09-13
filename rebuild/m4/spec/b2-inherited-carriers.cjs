'use strict';
// B2 (TARGETS, IDENTITY & TECHNIQUE ERA) witness-carrier successor.
//
// Modelled on the accepted parent programme rebuild/m4/spec/native-carriers-
// inherited-carriers.cjs and, through it, on the accepted D12 successor
// rebuild/conform/v4/postfix/legacy-step-efficacy-carriers.cjs. The ORIGINAL
// witness files are never edited: every changed expectation is an in-memory
// exactReplace against bytes first verified by sha256, so a drifted original
// refuses instead of silently passing (CARRIER-ONE-SITE / pin failure).
//
// Scope, per BRIEF-B2 §4:
//   defect-witnesses    (witnesses-1) NEW carrier  - 8 of 10 flip (D1 D2 D3 D4
//                                                   D5 D6 D7 D9); D8 and D10
//                                                   are B1's and must still
//                                                   reproduce untouched.
//   defect-witnesses-2  (witnesses-2) EXTENDS the accepted D12 successor with
//                                    exactly one new flip: D18.
//   defect-witnesses-4  (witnesses-4) NEW carrier  - 5 of 5 flip (D28 D29 D30
//                                                   D31 D32), all B2's.
//   defect-witnesses-3  (witnesses-3) UNCHANGED, asserted by execution.
//   defect-witnesses-6  (witnesses-6) UNCHANGED, asserted by execution.
// witnesses-5 and witnesses-7 fail identically on the unmodified merged tip and
// on the B2 candidate; they are pre-existing, carry no B2 successor here, and
// are reported to the PM rather than papered over.
//
// SPECULATIVE: the brief this implements is not accepted (DECISIONS:100 parallel
// authoring). The closed-profile chain (acceptance-b2-*.json, b2-package.cjs,
// receipt verification) is NOT authored here - it waits on the PM's parent
// ruling (brief §7 Q1). This file proves only the carrier substitutions.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../../..');
const P = path.join(root, 'rebuild/conform/v4/postfix');
const Parent = require(path.join(P, 'legacy-carriers.cjs'));
const Step = require(path.join(P, 'legacy-step-efficacy-carriers.cjs'));
const sha = (x) => crypto.createHash('sha256').update(x).digest('hex');
const TEST = path.join(root, 'rebuild/engine/test');

// Original bytes, pinned. witnesses-2's pin is the accepted D12 carrier's own.
const ORIGINAL_PINS = Object.freeze({
  'defect-witnesses': '557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644',
  'defect-witnesses-2': Step.WITNESS_PIN,
  'defect-witnesses-3': 'f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6',
  'defect-witnesses-4': 'c90ffeaa953a9b04146432f39702f87fc8c51ce7f0be77876f075fc4142b87f7',
  'defect-witnesses-6': '71a5fa27293b6e7837ec627b273b266db9d6c4987ff850fb6fe9e2a5f86092c4',
});
const DASH = '—';   // the producers' em dash, written as an escape so this file stays ASCII

// ---------------------------------------------------------------- witnesses-1
const W1 = [
  ['D1-first-targets-fit',
   '{ sessionLog: {} }), [8, 7]);',
   '{ sessionLog: {} }), [8, 7, 6]);'],
  ['D2-born-valid-refuses-negative-sets',
   'assert.equal(T._bornValid(ex), true);',
   'assert.equal(T._bornValid(ex), false);'],
  ['D2-quarantine-survives-the-healer',
   'assert.equal(!!ex.quarantined, false);',
   'assert.equal(!!ex.quarantined, true);'],
  ['D3-volume-receipt-owner-is-the-whole-name',
   '}] }), [["2026-09-02", 1]]);',
   '}] }), []);'],
  ['D4-other-lift-earn-cannot-spend',
   'assert.deepEqual(T.deriveSighting(s, ex), { topAt: null, topRun: 0 });',
   'assert.deepEqual(T.deriveSighting(s, ex), { topAt: 100, topRun: 2 });'],
  ['D5-ladder-counts-distinct-rungs',
   '  assert.deepEqual(T.parseRungs("100,100"), [100]);\n'
   + '  assert.deepEqual(T.loadRungs(lift({ steps: [100, 100] })), [100]);\n'
   + '  assert.equal(T.maxedOut(lift({ steps: [100, 100] })), true);',
   '  assert.equal(T.parseRungs("100,100"), null);\n'
   + '  assert.equal(T.loadRungs(lift({ steps: [100, 100] })), null);\n'
   + '  assert.equal(T.maxedOut(lift({ steps: [100, 100] })), false);\n'
   + '  assert.deepEqual(T.parseRungs("100,105,100"), [100, 105]);'],
  ['D6-deload-preserves-absent-load',
   'assert.equal(T.deloadLoad({ w: null, inc: 5 }), 5);',
   'assert.equal(T.deloadLoad({ w: null, inc: 5 }), null);'],
  ['D7-anchor-and-supplied-asof-trend-exclude-the-future',
   '  assert.deepEqual(T.progressAnchor(lift(), s), [11, 10]);\n'
   + '  const trend = T.liftTrend(s, "press", { asOf: "2026-09-03" });\n'
   + '  assert.equal(trend.n, 4);\n'
   + '  assert.equal(trend.from, "2026-09-10");\n'
   + '  assert.equal(trend.to, "2026-09-13");',
   '  assert.deepEqual(T.progressAnchor(lift(), s), [8, 7]);\n'
   + '  const trend = T.liftTrend(s, "press", { asOf: "2026-09-03" });\n'
   + '  assert.equal(trend, null);\n'
   + '  const open = T.liftTrend(s, "press");\n'
   + '  assert.equal(open.n, 4);\n'
   + '  assert.equal(open.from, "2026-09-10");\n'
   + '  assert.equal(open.to, "2026-09-13");'],
  ['D9-split-selects-the-latest-effective-date',
   'assert.equal(T.dayType("2026-09-03", { split: [current, old] }), "L");',
   'assert.equal(T.dayType("2026-09-03", { split: [current, old] }), "U");'],
];

// ---------------------------------------------------------------- witnesses-2
// One new flip on top of the accepted D12 slope/resolution successor.
const W2 = [
  ['D18-structural-budget-sees-past-the-display-prefix',
   'assert.equal(last.sets.length, 0);',
   'assert.equal(last.sets.length, 1);'],
];

// ---------------------------------------------------------------- witnesses-4
const W4 = [
  ['D28-designed-week-is-the-query-week',
   'assert.equal(T.programmeVolume(s).find(m => m.mg === "chest").sets, 6);',
   'assert.equal(T.programmeVolume(s).find(m => m.mg === "chest").sets, 3);'],
  ['D29-logged-front-delt-keeps-press-indirect-credit',
   'assert.equal(logged.find(m => m.mg === "delts_front").n7, 4);',
   'assert.equal(logged.find(m => m.mg === "delts_front").n7, 7);'],
  ['D30-first-set-trend-respects-the-era',
   '  assert.equal(result.status, "LIVE");\n'
   + '  assert.equal(result.n, 4);\n'
   + '  assert.equal(result.from, "2026-08-10");\n'
   + '  assert.ok(result.lo > 0);',
   '  assert.equal(result.status, "COUNTING");\n'
   + '  assert.equal(result.n, 1);\n'
   + '  assert.equal(result.need, 4);\n'
   + '  assert.equal(result.from, undefined);\n'
   + '  assert.equal(result.lo, undefined);'],
  ['D31-tolerance-needs-post-change-evidence',
   '  assert.equal(result.status, "LIVE");\n'
   + '  assert.equal(result.tier, "TOLERATED");\n'
   + '  assert.equal(result.changedAt, "2026-09-01");\n'
   + '  assert.equal(result.k, 3);\n'
   + '  assert.equal(result.trend.n, 4);\n'
   + '  assert.equal(result.trend.k, 2);\n'
   + '  assert.ok(result.trend.to < result.changedAt);\n'
   + '  assert.ok(result.trend.pts.every(point => point.d < result.changedAt));',
   '  assert.equal(result.status, "READING");\n'
   + '  assert.equal(result.tier, undefined);\n'
   + '  assert.equal(result.changedAt, "2026-09-01");\n'
   + '  assert.equal(result.k, 3);\n'
   + '  assert.equal(result.have, 1);\n'
   + '  assert.equal(result.need, 4);\n'
   + '  const reading = T.liftTrend(s, "synthetic-press");\n'
   + '  assert.equal(reading.n, 4);\n'
   + '  assert.equal(reading.k, 2);\n'
   + '  assert.ok(reading.to < result.changedAt);\n'
   + '  assert.ok(reading.pts.every(point => point.d < result.changedAt));'],
  ['D32-replication-counts-only-the-current-era',
   '  assert.equal(result.tier, "REPLICATED");\n'
   + '  assert.match(result.why, /comparable stable blocks/);',
   '  assert.equal(result.tier, "OUTCOME-COMPATIBLE");\n'
   + '  assert.match(result.why, /has not yet recurred in a comparable block/);'],
];
const SUCCESSORS = { 'defect-witnesses': W1, 'defect-witnesses-2': W2, 'defect-witnesses-4': W4 };

// Expected post-B2 tail of each carried witness identity.
const EXPECTED_TAIL = Object.freeze({
  'defect-witnesses': 'DEFECT WITNESSES: 10/10 reproduced',
  'defect-witnesses-2': 'DEFECT WITNESSES 2: 11/11 reproduced',
  'defect-witnesses-4': 'DEFECT WITNESSES 4: 5/5 reproduced',
});
const EXPECTED_CASES = Object.freeze({
  'defect-witnesses': 10, 'defect-witnesses-2': 11, 'defect-witnesses-4': 5,
});

function prepare(id) {
  const file = path.join(TEST, id + '.cjs');
  const bytes = fs.readFileSync(file);
  assert.equal(sha(bytes), ORIGINAL_PINS[id], 'original witness bytes ' + id);
  const edits = [];
  let source;
  if (id === 'defect-witnesses-2') {
    // Inherit the ACCEPTED D12 successor verbatim, then extend it.
    const inherited = Step.prepareCarrier(id, bytes);
    source = inherited.source;
    for (const e of inherited.edits) edits.push({ ...e, inherited: true });
  } else {
    source = bytes.toString('utf8');
  }
  for (const [site, before, after] of (SUCCESSORS[id] || [])) {
    source = Parent.exactReplace(source, before, after, site, edits);
  }
  return { file, source, edits, sourceSha256: sha(bytes), carrierSha256: sha(source) };
}

// The compiled carrier writes its console through this hook; rebound per run.
let SINK = null;
module.exports = { ORIGINAL_PINS, SUCCESSORS, prepare, __capture: (line) => SINK && SINK.push(line) };

function runCarried(id) {
  const { file, source, edits, sourceSha256, carrierSha256 } = prepare(id);
  const out = [];
  SINK = out;
  const compiled = new Module(file, module);
  compiled.filename = file;
  compiled.paths = Module._nodeModulePaths(path.dirname(file));
  const oldArgv = process.argv;
  process.argv = [process.execPath, file];
  try {
    compiled._compile('const console={log:(...a)=>require(' + JSON.stringify(__filename)
      + ').__capture(a.map(String).join(" "))};\n' + source, file);
  } finally { process.argv = oldArgv; SINK = null; }
  const reproduced = out.filter((l) => l.startsWith('REPRODUCED ')).length;
  const tail = out.at(-1) || '';
  assert.equal(reproduced, EXPECTED_CASES[id], id + ' reproduced-case count (got ' + reproduced + ')');
  assert.ok(tail.startsWith(EXPECTED_TAIL[id]), id + ' tail: ' + tail);
  return { id, edits, sourceSha256, carrierSha256, reproduced, tail };
}

// witnesses-3 and witnesses-6 carry NO substitution: they must pass as authored.
// witnesses-6 re-execs itself per mode, so it runs as its own child process.
function runUnchanged(id) {
  const file = path.join(TEST, id + '.cjs');
  assert.equal(sha(fs.readFileSync(file)), ORIGINAL_PINS[id], 'original witness bytes ' + id);
  assert.equal((SUCCESSORS[id] || []).length, 0, id + ' must receive no substitution');
  const child = spawnSync(process.execPath, [file], { cwd: root, encoding: 'utf8', windowsHide: true,
    env: { ...process.env, TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03' } });
  const lines = String(child.stdout || '').split('\n').map((l) => l.trim()).filter(Boolean);
  assert.equal(child.status, 0, id + ' must still pass unchanged');
  return { id, edits: [], reproduced: lines.filter((l) => l.startsWith('REPRODUCED ')).length, tail: lines.at(-1) || '' };
}

if (require.main === module) {
  process.env.TZ = 'America/New_York';
  if (!process.env.MEASURED_TEST_NOW) process.env.MEASURED_TEST_NOW = '2026-09-03';
  let phase = 'preparation';
  try {
    const results = [];
    for (const id of ['defect-witnesses', 'defect-witnesses-2', 'defect-witnesses-4']) { phase = id; results.push(runCarried(id)); }
    for (const id of ['defect-witnesses-3', 'defect-witnesses-6']) { phase = id + '/unchanged'; results.push(runUnchanged(id)); }
    for (const r of results) {
      console.log('B2 CARRIER ' + r.id + ': PASS; ' + r.reproduced + ' cases; '
        + r.edits.length + ' exact expectation substitution(s)'
        + (r.edits.length ? ' [' + r.edits.map((e) => e.site).join(', ') + ']' : ' (unchanged)')
        + '; ' + r.tail);
    }
    const subs = results.reduce((n, r) => n + r.edits.length, 0);
    console.log('B2 INHERITED CARRIERS: 5/5 PASS; ' + subs
      + ' exact substitutions (witnesses-1 new, witnesses-2 extends the accepted D12 successor, witnesses-4 new,'
      + ' witnesses-3/6 unchanged); witnesses-5/7 pre-existing at the tip, no B2 successor; PACKAGE receipt PENDING');
  } catch (e) {
    console.error('B2 INHERITED CARRIERS FAIL at ' + phase + ': ' + (e.code || e.message));
    process.exitCode = 1;
  }
}
