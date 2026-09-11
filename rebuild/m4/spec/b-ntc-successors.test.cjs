'use strict';
// LANE B — the child-pin refusal controls for the B-NTC successors.
//
// B-NTC-REVIEW-r2 R10 / change 10. This suite proves that the actual-child preflight
// refuses undeclared drift, and the only way to prove that is to introduce some. The
// version r2 reviewed wrote the drift into three TRACKED files and restored only in a
// `finally`: killed mid-run it left corrupted bytes in the owner's checkout, and it is
// declared as a CI child, so a cancelled workflow could do the same. Three things fix it
// here, and none of them weakens the check:
//
//   1. the checkout must be CLEAN before the suite touches anything, and clean again after
//      — `git status --porcelain` over the whole tree, not over the three files, so a
//      stray edit from an earlier interrupted run is caught rather than carried;
//   2. every mutation is registered in RESTORE before it is written, and RESTORE is drained
//      by `process.on('exit')` and by SIGINT/SIGTERM handlers as well as by the `finally`.
//      An interrupt, an uncaught throw anywhere in the suite, or a `process.exit()` from
//      node:test itself all put the bytes back. (A SIGKILL cannot be caught by anything in
//      this process; what covers that case is 1, on the next run.)
//   3. the mutation window is one write and one assertion, with nothing else inside it.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const root = path.resolve(__dirname, '../../..');
const S = require('./b-ntc-successors.cjs');

// TRACKED files only (`-uno`). What R10 is about is corrupted tracked bytes left behind by
// an interrupted run; the gates themselves create and remove a transient `test-support/`
// directory, and requiring that to be absent would make this suite unrunnable after any
// gate run for a reason that has nothing to do with the finding.
const status = () => cp.execFileSync('git', ['status', '--porcelain', '-uno'], { cwd: root, encoding: 'utf8' }).trim();
const RESTORE = new Map(); // absolute path -> the bytes that stood there before this suite
function drain() {
  for (const [p, bytes] of RESTORE) { try { fs.writeFileSync(p, bytes); } catch (_) { /* best effort on the way out */ } }
  RESTORE.clear();
}
process.on('exit', drain);
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'])
  try { process.on(signal, () => { drain(); process.exit(130); }); } catch (_) { /* not every signal exists on every OS */ }

const CLEAN_AT_START = status();
assert.equal(CLEAN_AT_START, '', 'B-NTC-REVIEW-r2 change 10: this suite mutates tracked files and refuses to start on a dirty checkout');

// The three candidate-owned paths whose undeclared drift the preflight must refuse: the two
// the child declares superseded-by-child, and one it declares new.
for (const file of ['rebuild/m4/workout/engine-runtime.cjs', '.github/workflows/rebuild.yml', 'rebuild/m4/workout/native-trend-context.cjs']) {
  test('actual-child preflight refuses undeclared drift in ' + file, () => {
    const p = path.join(root, file), before = fs.readFileSync(p);
    RESTORE.set(p, before);
    try {
      fs.writeFileSync(p, Buffer.concat([before, Buffer.from('\n// undeclared child drift\n')]));
      assert.throws(() => S.preflight(), /Exact actual child supersession|Exact declared child bytes/);
    } finally { fs.writeFileSync(p, before); RESTORE.delete(p); }
    assert(fs.readFileSync(p).equals(before), 'Candidate byte restoration ' + file);
    assert.equal(status(), '', 'the checkout is clean again after ' + file);
  });
}

test('full archived-parent plus actual-child preflight succeeds after all restorations', () => {
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
  assert.equal(RESTORE.size, 0, 'no mutation is still outstanding');
});
