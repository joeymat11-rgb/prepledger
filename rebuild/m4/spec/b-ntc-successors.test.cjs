'use strict';
// LANE B — the child-pin refusal controls for the B-NTC successors.
//
// B-NTC-REVIEW-r2 R10 / change 10. This suite proves that the actual-child preflight
// refuses undeclared drift, and the only way to prove that is to present it with some.
// The version r2 reviewed wrote the drift into three TRACKED files and restored only in a
// `finally`: killed mid-run it left corrupted bytes in the owner's checkout, and it is
// declared as a CI child, so a cancelled workflow could do the same. r2 offered two fixes
// — copy the tree, or restore on process exit. This takes a third that is stronger than
// either: **it never writes a tracked byte at all.**
//
// Each drift control runs in its own short-lived CHILD PROCESS which installs a read-only
// `fs.readFileSync` overlay over exactly one path, in its own process, and then calls
// `preflight()`. That is the same boundary the check operates at — `preflight()` reads
// every pin through `fs.readFileSync` — so nothing about the refusal is weakened, while
// the repository is never opened for writing by this suite in any process. Kill it at any
// moment, with any signal, and `git status --porcelain` is exactly what it was: there is
// no window in which it is anything else. The suite asserts that before and after, over
// tracked files, and the last case asserts the two are the same string.
//
// The overlay lives ONLY in the probe child. Case 4 re-asserts that no global filesystem
// or module-loader hook survives in THIS process, which is the process the seal runner's
// declared child actually executes.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const root = path.resolve(__dirname, '../../..');
const S = require('./b-ntc-successors.cjs');

// TRACKED files only (`-uno`). What R10 is about is corrupted tracked bytes left behind by
// an interrupted run; the gates themselves create and remove a transient `test-support/`
// directory, and requiring that to be absent would make this suite unrunnable after any
// gate run for a reason that has nothing to do with the finding.
const status = () => cp.execFileSync('git', ['status', '--porcelain', '-uno'], { cwd: root, encoding: 'utf8' }).trim();
const CLEAN_AT_START = status();

// The probe: one path gets two extra comment bytes on the way out of readFileSync, in this
// child and nowhere else. Everything else reads the real tree, unmodified.
const PROBE = [
  'const fs=require("node:fs"),path=require("node:path");',
  'const target=path.resolve(process.argv[1]);',
  'const real=fs.readFileSync.bind(fs);',
  'fs.readFileSync=(file,options)=>{',
  '  const bytes=real(file,options);',
  '  if(typeof file!=="string"||path.resolve(file)!==target)return bytes;',
  '  const drift="\\n// undeclared child drift\\n";',
  '  return typeof bytes==="string"?bytes+drift:Buffer.concat([bytes,Buffer.from(drift)]);',
  '};',
  'require(process.argv[2]).preflight();',
  'console.log("PREFLIGHT DID NOT REFUSE");',
].join('\n');

for (const file of ['rebuild/m4/workout/engine-runtime.cjs', '.github/workflows/rebuild.yml', 'rebuild/m4/workout/native-trend-context.cjs']) {
  test('actual-child preflight refuses undeclared drift in ' + file, () => {
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const r = cp.spawnSync(process.execPath, ['-e', PROBE, path.join(root, file), path.join(__dirname, 'b-ntc-successors.cjs')],
      { cwd: root, env, encoding: 'utf8', timeout: 600000, maxBuffer: 32 * 1024 * 1024 });
    assert.notEqual(r.status, 0, 'the drifted tree must refuse: ' + file);
    assert.match((r.stderr || '') + (r.stdout || ''), /Exact actual child supersession|Exact declared child bytes/,
      'the refusal must name the child-pin assertion for ' + file);
    assert.doesNotMatch(r.stdout || '', /PREFLIGHT DID NOT REFUSE/);
    assert.equal(status(), CLEAN_AT_START, 'no tracked byte moved while proving ' + file);
  });
}

test('full archived-parent plus actual-child preflight succeeds, with no global hook', () => {
  const read = fs.readFileSync, load = require('node:module')._load;
  S.preflight();
  assert.equal(fs.readFileSync, read, 'No global filesystem overlay survives');
  assert.equal(require('node:module')._load, load, 'No global module loader hook');
});

test('the enumerated substitutions are the whole difference from the parent originals', () => {
  // DECISIONS:113 (1) (c). Three, and they are the three the package spec carries verbatim.
  const spec = JSON.parse(fs.readFileSync(path.join(root, 'rebuild/lanes/b/tooling/packages/B-NTC.json'), 'utf8'));
  assert.deepEqual(S.SUBSTITUTIONS, spec.coverage.successors.substitutions);
  for (const substitution of S.SUBSTITUTIONS) {
    const body = fs.readFileSync(path.join(root, substitution.original), 'utf8');
    assert.equal(body.split(substitution.from).length, 2, 'one site in ' + substitution.original);
    assert.equal(body.split(substitution.to).length, 1, 'not already applied in ' + substitution.original);
  }
  // And no successor names an original the spec does not declare.
  assert.deepEqual(Object.values(S.ORIGINALS).slice().sort(),
    Object.values(spec.coverage.successors.carriers).map(c => c.original).sort());
});

test('the checkout this suite started on is the checkout it leaves', () => {
  assert.equal(status(), CLEAN_AT_START, 'no tracked byte moved across this suite');
});
