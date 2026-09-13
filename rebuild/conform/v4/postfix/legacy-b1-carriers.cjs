'use strict';
// Closed successor of the accepted STEP-EFFICACY carriers for package
// M2-B1-GRADING-TIME-WINDOW (BRIEF-B1-GRADING-TIME-WINDOW-v1.1 §3).
//
// The three frozen defect-witness programs stay BYTE-IDENTICAL on disk: each is
// a pinned carrier input, so editing one fails STEP-WITNESS-ORIGINAL-PIN /
// B1-WITNESS-ORIGINAL-PIN. Every expectation B1's ten repairs move is replaced
// IN MEMORY, one enumerated assertion at a time, through parent.exactReplace —
// the mechanism legacy-step-efficacy-carriers.cjs:17-18 already uses for D12.
//
// 18 assertions in 10 witness cells, measured on a non-throwing observer over
// the pristine and repaired engines. Two neighbours deliberately do NOT move and
// carry no substitution: defect-witnesses-2.cjs:95 (calibration still contains
// "7-day call") and defect-witnesses-3.cjs:41 (genSession called with two
// arguments still throws TypeError — B1 repairs the caller, never genSession).
// The printed tails stay exactly "DEFECT WITNESSES: 10/10",
// "DEFECT WITNESSES 2: 11/11" and "DEFECT WITNESSES 3: 5/5".
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), Module = require('node:module');
const { spawnSync } = require('node:child_process');
const parent = require('./legacy-carriers.cjs');
const Step = require('./legacy-step-efficacy-carriers.cjs');
const L = require('./legacy-gates.cjs');
const S = require('./source-proof.cjs');
const { sha, fail } = require('./target.cjs');

const PACKAGE_ID = 'M2-B1-GRADING-TIME-WINDOW';
// The two witness programs B1 adds to the carried set, plus the one the
// STEP-EFFICACY parent already carries. Pins are the ORIGINAL_COMMIT bytes.
const WITNESS_PINS = Object.freeze({
  'defect-witnesses': '557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644',
  'defect-witnesses-2': Step.WITNESS_PIN,
  'defect-witnesses-3': 'f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6',
});
const WITNESS_IDS = Object.freeze(Object.keys(WITNESS_PINS));
const ADDED_IDS = Object.freeze(['defect-witnesses', 'defect-witnesses-3']);
const CARRIER_IDS = Object.freeze([...Step.CARRIER_IDS, ...ADDED_IDS]);
// Gate ids in postfix/run.cjs:9-23 that this child covers, so they move from
// coverage.run to coverage.covered in the package artifact (§3).
const COVERS = Object.freeze(['witnesses-1', 'witnesses-2', 'witnesses-3']);
const TAILS = Object.freeze({
  'defect-witnesses': 'DEFECT WITNESSES: 10/10',
  'defect-witnesses-2': 'DEFECT WITNESSES 2: 11/11',
  'defect-witnesses-3': 'DEFECT WITNESSES 3: 5/5',
});
const REPRODUCED = Object.freeze({ 'defect-witnesses': 10, 'defect-witnesses-2': 11, 'defect-witnesses-3': 5 });

// ---------------------------------------------------------------------------
// The reviewed successor expectations. site ids name the defect and the cell.
// Each `before` occurs EXACTLY once in its pinned file (verified); exactReplace
// fails CARRIER-ONE-SITE otherwise, so no substitution can silently widen.
const EXPECTATIONS = Object.freeze({
  'defect-witnesses': [
    // D8 — an eight-month-old night no longer controls current sleep context.
    ['  assert.equal(T.cleanAtDate({ sleep: { nights: [{ d: "2026-01-01", h: 5 }] } }, "2026-09-03"), false);',
     '  assert.equal(T.cleanAtDate({ sleep: { nights: [{ d: "2026-01-01", h: 5 }] } }, "2026-09-03"), true);',
     'B1-D8-stale-night-is-unknown-not-debt'],
    // D10 — seven calendar dates is exactly one week across either transition.
    ['    assert.ok(Math.abs(T.weeksBetween("2026-03-08", "2026-03-15") - 167 / 168) < 1e-12);',
     '    assert.equal(T.weeksBetween("2026-03-08", "2026-03-15"), 1);',
     'B1-D10-spring-forward-week'],
    ['    assert.ok(Math.abs(T.weeksBetween("2026-11-01", "2026-11-08") - 169 / 168) < 1e-12);',
     '    assert.equal(T.weeksBetween("2026-11-01", "2026-11-08"), 1);',
     'B1-D10-fall-back-week'],
  ],
  'defect-witnesses-2': [
    // D16 — a month-late read leaves the 7-day call UNGRADED, never a hit.
    ['  assert.equal(r.graded, 1);', '  assert.equal(r.graded, 0);', 'B1-D16-month-late-read-is-ungraded'],
    ['  assert.equal(r.rows[0].hit, true);', '  assert.equal(r.rows[0].hit, null);', 'B1-D16-ungraded-row-has-no-hit'],
    // D17 — an undone adjustment is retained but no longer reported as applied.
    ['  assert.equal(r.decisions[0].applied, true);', '  assert.equal(r.decisions[0].applied, false);', 'B1-D17-undone-is-not-applied'],
    // D19 — the inclusive last active day is day 7 of 7 and resumes the NEXT date.
    ['  assert.ok(p.line.includes("day 6 of 7, 0 to go"));', '  assert.ok(p.line.includes("day 7 of 7, 0 to go"));', 'B1-D19-one-based-break-day'],
    ['  assert.equal(p.next.when, "resumes " + T.fmtShort("2026-09-07"));',
     '  assert.equal(p.next.when, "resumes " + T.fmtShort("2026-09-08"));', 'B1-D19-resumption-is-the-next-date'],
    // D21 — the night logged ON the fall-back date is inside the clean window.
    ['  assert.equal(T.sleepInfo(s).clean, true);', '  assert.equal(T.sleepInfo(s).clean, false);', 'B1-D21-fall-back-same-date-night-counts'],
  ],
  'defect-witnesses-3': [
    // D23 — the scheduled lower session is a workout, not a rest day.
    ['  assert.equal(model.workout.title, "REST DAY");', '  assert.equal(model.workout.title, "LOWER BODY · TODAY");', 'B1-D23-scheduled-session-title'],
    ['  assert.equal(model.workout.today, false);', '  assert.equal(model.workout.today, true);', 'B1-D23-scheduled-session-is-today'],
    ['  assert.equal(model.workout.iso, undefined);', '  assert.equal(model.workout.iso, "2026-09-03");', 'B1-D23-scheduled-session-carries-its-date'],
    // D24 — a steps-only yesterday stays owed.
    ['  assert.equal(focus.clear, true);', '  assert.equal(focus.clear, false);', 'B1-D24-partial-yesterday-is-not-clear'],
    ['  assert.equal(focus.owed.some((item) => item.k === "yesterday"), false);',
     '  assert.equal(focus.owed.some((item) => item.k === "yesterday"), true);', 'B1-D24-partial-yesterday-is-owed'],
    // D25 — zero successes out of the sole logged day cannot read good.
    ['  assert.equal(T.fiveLevers(s).protein.state, "good");', '  assert.equal(T.fiveLevers(s).protein.state, "caution");', 'B1-D25-zero-of-one-is-caution'],
    // D27 — committed maintenance is not diagnosed as a long stalled cut.
    ['  assert.equal(fix.rung, "break");', '  assert.equal(fix.rung, "hold");', 'B1-D27-maintenance-holds'],
    ['  assert.equal(fix.title, "A diet break has earned its place");',
     '  assert.equal(fix.title, "Nothing to fix — hold the line");', 'B1-D27-quiet-title'],
    ['  assert.ok(fix.body.startsWith("You\'ve held the deficit for weeks"));',
     '  assert.ok(fix.body.startsWith("The five are covered and the trend is doing its job"));', 'B1-D27-quiet-body'],
  ],
});

// ---------------------------------------------------------------------------
let activeContext;
const context = () => { if (!activeContext) fail('B1-CARRIER-NO-CONTEXT'); return activeContext; };

function substitutions(id) { if (!Object.hasOwn(EXPECTATIONS, id)) fail('B1-CARRIER-TARGET'); return EXPECTATIONS[id]; }

// In-memory expectation substitution only. The pinned bytes are never written.
function prepareCarrier(id, bytes) {
  if (!CARRIER_IDS.includes(id)) fail('B1-CARRIER-TARGET');
  if (!WITNESS_IDS.includes(id)) return Step.prepareCarrier(id, bytes);
  if (sha(bytes) !== WITNESS_PINS[id]) fail(id === 'defect-witnesses-2' ? 'STEP-WITNESS-ORIGINAL-PIN' : 'B1-WITNESS-ORIGINAL-PIN');
  let source, edits;
  if (id === 'defect-witnesses-2') {
    // Inherit the accepted D12 slope/resolution successors, then add B1's six.
    const inherited = Step.prepareCarrier(id, bytes);
    source = inherited.source; edits = [...inherited.edits];
  } else { source = Buffer.isBuffer(bytes) ? bytes.toString('utf8') : bytes; edits = []; }
  for (const [before, after, site] of substitutions(id)) source = parent.exactReplace(source, before, after, site, edits);
  return { source, edits, sourceHash: sha(bytes), carrierHash: sha(source) };
}

// The pinned original, read from Git at the audit commit AND from disk, both
// byte-equal to the recorded pin. This is what makes "the file is untouched" a
// checked fact rather than a claim.
function pinned(root, baseline, id) {
  const relative = 'rebuild/engine/test/' + id + '.cjs';
  const bytes = L.object(baseline, parent.ORIGINAL_COMMIT, relative);
  const expected = WITNESS_IDS.includes(id) ? WITNESS_PINS[id] : parent.ORIGINAL_PINS[id];
  if (sha(bytes) !== expected || !fs.readFileSync(path.join(root, relative)).equals(bytes))
    fail(WITNESS_IDS.includes(id) ? 'B1-CARRIER-ORIGINAL-PIN' : 'STEP-CARRIER-ORIGINAL-PIN');
  return bytes;
}

// Compile the prepared program against the candidate engine on disk and require
// its own original accounting to hold: every REPRODUCED id in order, and the
// original printed count in the tail.
function runWitness({ id, root, baseline, bundles, mode = 'native' }) {
  if (!WITNESS_IDS.includes(id)) fail('B1-CARRIER-TARGET');
  if (!['frozen', 'native'].includes(mode)) fail('B1-CARRIER-CONFIG');
  const prepared = prepareCarrier(id, pinned(root, baseline, id));
  const file = path.join(root, 'rebuild/engine/test', id + '.cjs');
  const output = [];
  activeContext = { capture: (...args) => output.push(args.map(String).join(' ')) };
  const compiled = new Module(file, module);
  compiled.filename = file; compiled.paths = Module._nodeModulePaths(path.dirname(file));
  if (bundles && bundles.main) { process.env.ENGINE_MAIN = bundles.main; process.env.ENGINE_OLD = bundles.old || bundles.main; }
  process.env.TZ = 'America/New_York'; process.env.MEASURED_TEST_NOW = '2026-09-03';
  const oldArgv = process.argv; process.argv = [process.execPath, file, '--worker', mode];
  const Native = globalThis.Date;
  try {
    if (mode === 'frozen') globalThis.Date = class extends Native { constructor(...a) { super(...(a.length ? a : [1788451200000])); } static now() { return 1788451200000; } };
    compiled._compile('const __carrier=require(' + JSON.stringify(__filename) + ').context();\nconst console={log:(...a)=>__carrier.capture(...a)};\n' + prepared.source, file);
    const reproduced = output.filter(l => l.startsWith('REPRODUCED '));
    assert.equal(reproduced.length, REPRODUCED[id], 'every original witness of ' + id + ' still reproduces');
    assert.ok(String(output.at(-1)).startsWith(TAILS[id]), 'original printed accounting: ' + TAILS[id]);
  } finally { globalThis.Date = Native; process.argv = oldArgv; activeContext = null; }
  return { id, mode, status: 'PASS', sourceHash: prepared.sourceHash, carrierHash: prepared.carrierHash,
    edits: prepared.edits, reproduced: REPRODUCED[id], tail: TAILS[id],
    note: id.toUpperCase() + ' B1 SUCCESSOR PASS — ' + REPRODUCED[id] + ' original witnesses; only the enumerated B1 expectations changed; file byte-identical' };
}

// A carried gate runs in its own process, as the parents do: no ambient Date,
// argv or env leaks back into the caller's gate sequence.
async function runWorker(input) {
  const { id, root, baseline, bundles, acceptance, mode } = input;
  if (!CARRIER_IDS.includes(id)) fail('B1-CARRIER-CONFIG');
  if (acceptance && acceptance.packageId !== PACKAGE_ID) fail('B1-CARRIER-CONFIG');
  if (!WITNESS_IDS.includes(id)) return Step.runCarrier(input);
  if (acceptance) S.verifyProductSources({ root, baseline, acceptance, gitHead: true });
  return runWitness({ id, root, baseline, bundles, mode });
}
function runCarrier(input) {
  const child = spawnSync(process.execPath, [__filename, '--carrier-worker'], {
    cwd: input.root, input: JSON.stringify(input), encoding: 'utf8', windowsHide: true,
    timeout: 1200000, maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, NODE_OPTIONS: '', NODE_V8_COVERAGE: '', TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03' },
  });
  if (child.error) fail('B1-CARRIER-PROCESS');
  let result; try { result = JSON.parse(child.stdout); } catch { fail('B1-CARRIER-OUTPUT'); }
  if (child.status !== 0 || result.status !== 'PASS') fail(result.code || 'B1-CARRIER-FAILED');
  return result;
}
module.exports = { PACKAGE_ID, CARRIER_IDS, ADDED_IDS, WITNESS_IDS, WITNESS_PINS, COVERS, TAILS, REPRODUCED,
  EXPECTATIONS, prepareCarrier, pinned, runWitness, runCarrier, context };
if (require.main === module) {
  if (process.argv.length !== 3 || process.argv[2] !== '--carrier-worker') fail('B1-CARRIER-CLI');
  Promise.resolve().then(() => runWorker(JSON.parse(fs.readFileSync(0, 'utf8'))))
    .then(r => process.stdout.write(JSON.stringify(r)))
    .catch(e => { process.stdout.write(JSON.stringify({ status: 'FAIL', code: e.code || 'B1-CARRIER-ASSERTION', message: e.code ? undefined : String(e.message).split('\n')[0] })); process.exitCode = 1; });
}
