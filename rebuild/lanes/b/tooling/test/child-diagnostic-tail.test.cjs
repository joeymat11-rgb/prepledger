'use strict';
// S6-B CI-TODAY-CHILD-FLAKE DIAGNOSTICS. Same compile technique as
// execution-targets.test.cjs: the REAL runner source, compiled twice (once under --ci,
// once under --full) so both branches of the ci-only guard are exercised against the same
// bytes, never a rewritten copy or a stub.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const Module = require('node:module');
const sourceRoot = path.resolve(__dirname, '../../../../..');
const runnerRel = 'rebuild/lanes/b/tooling/b-package.cjs';
const source = fs.readFileSync(path.join(sourceRoot, runnerRel), 'utf8');
const delimiter = '// ------------------------------------------------------------------ 8. main sequence';
assert.equal(source.split(delimiter).length, 2, 'one real campaign boundary');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-tooling-tail-'));
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}
write(runnerRel, source);
write('rebuild/conform/v4/postfix/run.cjs', fs.readFileSync(path.join(sourceRoot, 'rebuild/conform/v4/postfix/run.cjs')));
for (const original of ['rebuild/conform/v4/postfix/target.cjs', 'rebuild/conform/v4/postfix/legacy-gates.cjs',
  'rebuild/conform/v4/postfix/strict-json.cjs', 'rebuild/m4/spec/native-carriers-errors.cjs',
  'rebuild/m4/spec/load-write-reference.cjs'])
  write(original, fs.readFileSync(path.join(sourceRoot, original)));
const runnerFile = path.join(scratch, runnerRel);
function compile(mode) {
  const m = new Module(runnerFile, module);
  m.filename = runnerFile;
  m.paths = Module._nodeModulePaths(path.dirname(path.join(sourceRoot, runnerRel)));
  const baseRequire = m.require.bind(m);
  m.require = file => baseRequire(path.isAbsolute(file) && file.startsWith(scratch + path.sep)
    ? path.join(sourceRoot, path.relative(scratch, file)) : file);
  const savedArgv = process.argv;
  process.argv = [process.execPath, runnerFile, mode, '--package', 'B-NTC'];
  try {
    m._compile(source.slice(0, source.indexOf(delimiter)) +
      '\nmodule.exports={children,ci,childDiagnosticTail,PUBLIC_TAIL_ROOTS,TAIL_DENYLIST,' +
      'init(){logDir=root;specRaw=Buffer.from("{}");}};', runnerFile);
  } finally { process.argv = savedArgv; }
  m.exports.init();
  return m.exports;
}
const apiCi = compile('--ci');
const apiFull = compile('--full');
assert.equal(apiCi.ci, true);
assert.equal(apiFull.ci, false);

const packageFor = c => ({ children: [c], product: {}, coverage: { inherited: {}, moves: {}, successors: null, superseded: null } });
const env = { ...process.env, NODE_OPTIONS: '', NODE_V8_COVERAGE: '' };
delete env.NODE_TEST_CONTEXT; // The outer node:test worker is not the package runner's environment.
const child = (argv, name = 'probe-child', needle = 'NEVER MATCHES') => ({ name, argv, needle });

const publicFail = 'rebuild/m4/workout/test/probe-tail-fail.test.cjs';
write(publicFail, 'console.log("PUBLIC FAIL TAIL");\nprocess.exitCode = 1;');
const publicDenylisted = 'rebuild/m4/workout/test/probe-tail-denylisted.test.cjs';
write(publicDenylisted, 'console.log("touches rebuild/conform/private/census.json");\nprocess.exitCode = 1;');
// RV17 (S6-B round-2 review, finding 1): TAIL_DENYLIST's needles are '/'-spelled; on
// Windows a child printing path.join's native separator ('rebuild\conform\private\...')
// matched none of them. This fixture's own stdout names the same private path, spelled
// with backslashes, the way path.join would actually print it on this OS.
const publicDenylistedBackslash = 'rebuild/m4/workout/test/probe-tail-denylisted-backslash.test.cjs';
write(publicDenylistedBackslash, 'console.log("touches rebuild\\\\conform\\\\private\\\\census.json");\nprocess.exitCode = 1;');
// RV18-13/14/15/16 (S6-B round-3 review, finding 1, BLOCKING): RV17's fix normalized a
// SINGLE backslash (path.join's own separator). It does not cover a DOUBLED backslash --
// the shape node:test's own reporter emits for a failing string value via
// JSON.stringify, which escapes each real backslash to two -- because a bare
// replace(/\\/g,'/') turns a doubled backslash into a doubled SLASH, which does not
// contain the single-slash needle. Two fixtures pin the class. Both child sources below
// hold the private path as an ordinary SINGLE-backslash string (the realistic in-memory
// value); each then prints it through JSON.stringify, which is what actually produces the
// doubled backslash on the child's stdout.
const publicDenylistedNodeTest = 'rebuild/m4/workout/test/probe-tail-denylisted-nodetest.test.cjs';
write(publicDenylistedNodeTest,
  "const test = require('node:test');\n" +
  "const assert = require('node:assert/strict');\n" +
  "test('leaks a backslash private path via an assert message', () => {\n" +
  "  assert.fail('touches ' + JSON.stringify('rebuild\\\\conform\\\\private\\\\census.json'));\n" +
  "});\n");
const publicDenylistedDoubledBackslash = 'rebuild/m4/workout/test/probe-tail-denylisted-doubled-backslash.test.cjs';
write(publicDenylistedDoubledBackslash,
  'console.log(JSON.stringify("touches rebuild\\\\conform\\\\private\\\\census.json"));\nprocess.exitCode = 1;');
const privateRootFail = 'rebuild/m4/spec/probe-tail-private-root.cjs';
write(privateRootFail, 'console.log("PRIVATE ROOT FAIL");\nprocess.exitCode = 1;');
const publicPass = 'rebuild/m4/workout/test/probe-tail-pass.test.cjs';
write(publicPass, 'console.log("PUBLIC PASS\\n" + "p".repeat(240));');

function capture(fn) {
  const lines = [];
  const orig = console.log;
  console.log = (...a) => lines.push(a.join(' '));
  try { fn(); } finally { console.log = orig; }
  return lines;
}
function throwsOf(fn) {
  let caught;
  try { fn(); } catch (e) { caught = e; }
  assert(caught, 'expected a throw');
  return caught;
}

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(resolved, path.resolve(scratch));
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-tooling-tail-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

test('a public-root child that exits 1 carries a diagnostic tail in --ci', () => {
  const c = child([publicFail], 'tail-fail');
  const caught = throwsOf(() => apiCi.children(packageFor(c), env));
  assert.match(caught.message, /CHILD-REQUIRED-EXIT-ZERO tail-fail/);
  assert.match(caught.diagnostic,
    /^B PACKAGE B-NTC CHILD tail-fail DIAGNOSTIC exit 1 wall \d+ ms; last 60 lines of stdout\+stderr follow/);
  assert.match(caught.diagnostic, /PUBLIC FAIL TAIL/);
});
test('the same failing child under --full carries no diagnostic tail at all', () => {
  const c = child([publicFail], 'tail-fail-full');
  const caught = throwsOf(() => apiFull.children(packageFor(c), env));
  assert.match(caught.message, /CHILD-REQUIRED-EXIT-ZERO tail-fail-full/);
  assert.equal(caught.diagnostic, undefined);
});
test('a failing child under a non-public root withholds on path policy', () => {
  const c = child([privateRootFail], 'tail-private-root');
  const caught = throwsOf(() => apiCi.children(packageFor(c), env));
  assert.match(caught.diagnostic,
    /^B PACKAGE B-NTC CHILD tail-private-root DIAGNOSTIC exit 1 wall \d+ ms; tail withheld \(path policy\)$/);
});

test('a public-root failing child whose own stdout names a denylisted path withholds too', () => {
  const c = child([publicDenylisted], 'tail-denylisted');
  const caught = throwsOf(() => apiCi.children(packageFor(c), env));
  assert.match(caught.diagnostic, /tail withheld \(path policy\)$/);
  assert.doesNotMatch(caught.diagnostic, /touches rebuild\/conform\/private/);
});
test('RV17 -- a denylisted path spelled with backslashes (Windows path.join) withholds too', () => {
  const c = child([publicDenylistedBackslash], 'tail-denylisted-backslash');
  const caught = throwsOf(() => apiCi.children(packageFor(c), env));
  assert.match(caught.diagnostic, /tail withheld \(path policy\)$/);
  assert.doesNotMatch(caught.diagnostic, /touches rebuild\\conform\\private/);
});
test('RV18 -- a node:test-shaped child whose failing assert message JSON.stringifies a backslash private path withholds too', () => {
  const c = child([publicDenylistedNodeTest], 'tail-denylisted-nodetest');
  const caught = throwsOf(() => apiCi.children(packageFor(c), env));
  assert.match(caught.diagnostic, /tail withheld \(path policy\)$/);
  assert.doesNotMatch(caught.diagnostic, /touches rebuild/);
});
test('RV18 -- a plain-stdout doubled backslash (JSON.stringify shape, no test runner involved) withholds too', () => {
  const c = child([publicDenylistedDoubledBackslash], 'tail-denylisted-doubled-backslash');
  const caught = throwsOf(() => apiCi.children(packageFor(c), env));
  assert.match(caught.diagnostic, /tail withheld \(path policy\)$/);
  assert.doesNotMatch(caught.diagnostic, /touches rebuild/);
});
test('RV17 -- a spawnSync timeout (r.status null, r.error set) prints "exit timeout <code>", not "exit null"', () => {
  const fakeTimedOut = { status: null, error: { code: 'ETIMEDOUT' }, stdout: '', stderr: '' };
  const header = apiCi.childDiagnosticTail({ name: 'hung-child' }, [publicFail], fakeTimedOut, 1800004);
  assert.match(header,
    /^B PACKAGE B-NTC CHILD hung-child DIAGNOSTIC exit timeout ETIMEDOUT wall 1800004 ms; /);
  assert.doesNotMatch(header, /exit null/);
});
test('RV17 -- a spawnSync timeout with no r.error.code still prints "exit timeout", never "exit null"', () => {
  const fakeTimedOutNoCode = { status: null, error: {}, stdout: '', stderr: '' };
  const header = apiCi.childDiagnosticTail({ name: 'hung-child-2' }, [publicFail], fakeTimedOutNoCode, 5);
  assert.match(header, /^B PACKAGE B-NTC CHILD hung-child-2 DIAGNOSTIC exit timeout wall 5 ms; /);
});
test('every child carries its wall time on the OBSERVED line in --ci, none in --full', () => {
  const ciLines = capture(() => apiCi.children(packageFor(child([publicPass], 'tail-pass', 'PUBLIC PASS')), env));
  const ciObserved = ciLines.find(l => l.includes(' OBSERVED;'));
  assert.match(ciObserved || '', /; wall \d+ ms$/);
  const fullLines = capture(() => apiFull.children(packageFor(child([publicPass], 'tail-pass-full', 'PUBLIC PASS')), env));
  const fullObserved = fullLines.find(l => l.includes(' OBSERVED;'));
  assert(fullObserved, 'expected an OBSERVED line under --full too');
  assert.doesNotMatch(fullObserved, /; wall \d+ ms$/);
});
