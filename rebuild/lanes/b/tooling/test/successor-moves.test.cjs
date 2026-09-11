'use strict';
// LANE B's own regression for the DECISIONS:113 successor path (TOOLING-REVIEW-r5 Z9).
//
// It replaces the withdrawn successor-authority.test.cjs, which was not self-contained: it
// read B_NTC_SOURCE_ROOT defaulting to a sibling worktree and `git archive`d a commit that
// exists on one lane branch only, so its result depended on what else was checked out
// beside it. NOTHING here reads outside this file's own scratch tree except the real
// runner source and the two original modules the runner itself requires. There is no
// network, no sibling worktree, no second branch, no accepted artifact, no receipt and no
// Git ref of the real repository: the fixture builds its own Git repository in a temp
// directory, commits into it, and drives the runner's exported functions against it. On a
// fresh single-branch clone this suite gives the same answer it gives here.
//
// Every case is a PAIR: the faithful shape passes, and one named tamper refuses with its
// own code. Z1 (only the ruling admits a successor), Z2 (the successor loads the parent's
// own original and replaces only what the spec enumerates), Z3 (the parent's own accepted
// verdict in full), Z5 (the parent acceptance commit is anchored, and there is no policy
// sourceCommit to trust).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const Module = require('node:module');
const crypto = require('node:crypto');

const sourceRoot = path.resolve(__dirname, '../../../../..');
const runnerRel = 'rebuild/lanes/b/tooling/b-package.cjs';
const source = fs.readFileSync(path.join(sourceRoot, runnerRel), 'utf8');
const delimiter = '// ------------------------------------------------------------------ 8. main sequence';
assert.equal(source.split(delimiter).length, 2, 'one real campaign boundary');
const sha = buf => crypto.createHash('sha256').update(buf).digest('hex');

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-successor-'));
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  return text;
}
const git = (...argv) => cp.execFileSync('git', argv, { cwd: scratch, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

// ---------------------------------------------------------------- the fixture tree
const ORIGINAL = 'rebuild/m4/spec/native-carriers-source-carriers.cjs';
const WRAPPER = 'rebuild/m4/spec/native-carriers-package.cjs';
const SUCCESSOR = 'rebuild/m4/spec/b-ntc-source-carriers.cjs';
const MODULE = 'rebuild/m4/spec/b-ntc-successors.cjs';
const FROM = "const PINNED_SUPPORT = 'rebuild/m4/workout/engine-runtime.cjs@parent-pin-of-record';";
const TO = "const PINNED_SUPPORT = 'rebuild/m4/workout/engine-runtime.cjs@child-pin-of-record';";
const VERDICT = 'NATIVE SOURCE CARRIERS: 6/6 PASS;';

const originalText = [
  "'use strict';",
  '// The parent carrier, standing in for the accepted original. Its body is what a',
  '// faithful successor must LOAD; every line below is deliberately long enough that a',
  '// successor which pasted it instead would be caught by the copy check in the runner.',
  FROM,
  "const CARRIERS = ['migrate-source', 'merge-source', 'writers-source'];",
  'function assertEverySourceCarrierAgreesWithItsPinnedProjection(rows) {',
  '  if (!Array.isArray(rows) || rows.length !== CARRIERS.length) throw new Error("carrier row count");',
  '  for (const row of rows) if (typeof row !== "object") throw new Error("carrier row shape");',
  '  return CARRIERS.length + CARRIERS.length + CARRIERS.length;',
  '}',
  'const observed = assertEverySourceCarrierAgreesWithItsPinnedProjection([{}, {}, {}]);',
  'if (observed !== 9) throw new Error("source carrier projection disagreed with the pin");',
  "console.log('" + VERDICT + " ' + PINNED_SUPPORT + ' over ' + observed + ' comparisons');",
  '',
].join('\n');

const wrapperText = ['const names=[];', 'const verdicts={',
  " traces:'NATIVE CARRIER TRACES: 7/7 public census laws GREEN on both clocks;',",
  " direct:'NATIVE CARRIERS DIRECT: 713/713 PASS;',",
  " legacy:'NATIVE CARRIERS LEGACY DIFFERENTIAL: 9/9 legacy-only comparisons identical',",
  " witnesses:'NATIVE CARRIERS WITNESSES: 6/6 input/alarm branches;',",
  " cases:'NATIVE CARRIERS CASES: 7/7 effective mutants, one per carrier file, all restored',",
  " 'source-carriers':'" + VERDICT + "',",
  " 'inherited-carriers':'NATIVE INHERITED CARRIERS: 6/6 PASS;',",
  " 'defect-witnesses':'NATIVE DEFECT WITNESSES: 10/10 complete comparisons PASS;',",
  " 'writers-differential':'NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;',",
  " 'second-gate':'NATIVE SECOND GATE:',", '};', ''].join('\n');

const substitutions = [{ original: ORIGINAL, from: FROM, to: TO,
  why: 'the support file is declared superseded-by-child at this head, so the parent pin re-targets' }];

const moduleText = ["'use strict';",
  '// Lane B successor module. It LOADS the parent original and replaces only what the',
  '// table below states; the table is the one the package spec enumerates verbatim.',
  "const fs = require('node:fs'), path = require('node:path');",
  'const SUBSTITUTIONS = ' + JSON.stringify(substitutions, null, 1) + ';',
  'const ORIGINALS = ' + JSON.stringify({ 'source-carriers': ORIGINAL }, null, 1) + ';',
  'function prepare(name) {',
  "  const file = ORIGINALS[name];",
  "  let body = fs.readFileSync(path.join(__dirname, '../../..', file), 'utf8');",
  '  for (const sub of SUBSTITUTIONS) if (sub.original === file) body = body.replace(sub.from, sub.to);',
  '  return body;',
  '}',
  'module.exports = { prepare, run(name) { return prepare(name); } };', ''].join('\n');

const successorText = ["'use strict';", "require('./b-ntc-successors.cjs').run('source-carriers');", ''].join('\n');

write(ORIGINAL, originalText);
write(WRAPPER, wrapperText);
write(MODULE, moduleText);
write(SUCCESSOR, successorText);
write('rebuild/conform/v4/postfix/run.cjs', fs.readFileSync(path.join(sourceRoot, 'rebuild/conform/v4/postfix/run.cjs')));

// A real Git repository of this fixture's own, so the runner's Git-anchored assertions run
// against bytes this test controls. No ref, object or commit of the real repository is read.
git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 'fixer5@earned.local');
git('config', 'user.name', 'lane-b-fixer5');
git('add', '-A');
git('commit', '--quiet', '-m', 'fixture');
const parentCommit = git('rev-parse', 'HEAD').trim();

// The runner, compiled with exactly TWO literals changed: the chain branch (this fixture's
// own branch) and the parent acceptance commit (this fixture's own commit). Both are
// asserted below to be the only differences, so no other rule is relaxed for the test.
const fixtureSource = source
  .replace("const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';", "const CHAIN_REF = 'refs/heads/fixture-chain';")
  .replace(/const SUCCESSOR_PARENT_COMMIT = '[a-f0-9]{40}';/, "const SUCCESSOR_PARENT_COMMIT = '" + parentCommit + "';");
{
  const a = source.split('\n'), b = fixtureSource.split('\n');
  assert.equal(a.length, b.length, 'the fixture changes no line count');
  const moved = a.map((line, i) => [i, line]).filter(([i, line]) => line !== b[i]);
  assert.equal(moved.length, 2, 'exactly two constants are re-pointed at the fixture');
  for (const [, line] of moved) assert.match(line, /^const (?:CHAIN_REF|SUCCESSOR_PARENT_COMMIT) = '/);
}
write(runnerRel, fixtureSource);
const runnerFile = path.join(scratch, runnerRel);
const m = new Module(runnerFile, module);
m.filename = runnerFile;
m.paths = Module._nodeModulePaths(path.dirname(path.join(sourceRoot, runnerRel)));
const baseRequire = m.require.bind(m);
m.require = file => baseRequire(path.isAbsolute(file) && file.startsWith(scratch + path.sep)
  ? path.join(sourceRoot, path.relative(scratch, file)) : file);
const savedArgv = process.argv;
process.argv = [process.execPath, runnerFile, '--ci', '--package', 'B-NTC'];
try {
  m._compile(fixtureSource.slice(0, fixtureSource.indexOf(delimiter)) +
    '\nmodule.exports={closure,successorGates,acceptedVerdicts,successorTable,successorProof,successorCoverage,coverage,MOVES_RULING,SUCCESSOR_RULING,SUCCESSOR_PACKAGES,FAIL_CODES,init(){logDir=root;specRaw=Buffer.from("{}");}};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
api.init();

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-successor-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

// ------------------------------------------------------------------ the fixture spec
const GATE = 'migrate-source', PARENT_CHILD = 'source-carriers', CHILD = 'source-carriers';
const inherited = { 'migrate-source': CHILD, 'merge-source': CHILD, 'writers-source': CHILD };
const bound = () => ({ option: { id: 'NATIVE-CARRIERS' }, decided: true, acceptance: {
  product: {},
  executionPins: { [ORIGINAL]: sha(fs.readFileSync(path.join(scratch, ORIGINAL))), [WRAPPER]: sha(fs.readFileSync(path.join(scratch, WRAPPER))) },
  coverage: { byChild: { ...inherited } } } });
const spec = () => ({
  children: [{ name: CHILD, argv: [SUCCESSOR], needle: VERDICT }],
  coverage: { inherited: { ...inherited }, moves: {}, successors: {
    ruling: 'MOVES_RULING=' + api.SUCCESSOR_RULING + ' B-NTC-INHERITED-1',
    parentAcceptanceCommit: parentCommit,
    carriers: { [PARENT_CHILD]: { successor: SUCCESSOR, original: ORIGINAL } },
    substitutions: JSON.parse(JSON.stringify(substitutions)) } },
});
const ran = () => new Map([[CHILD, { ok: true, needle: VERDICT, bytes: 400, targets: [SUCCESSOR], moved: [] }]]);
// The whole path a real run takes: prove every declared successor, then admit the gate.
const carry = (s = spec(), b = bound(), r = ran()) =>
  api.successorCoverage(s, b, api.successorProof(s, b, r), GATE, CHILD, [SUCCESSOR]);

test('the faithful successor is admitted, and every derived fact is the parent\'s own', () => {
  const proof = carry();
  assert.equal(proof.parentChild, PARENT_CHILD);
  assert.equal(proof.original, ORIGINAL);
  assert.equal(proof.successor, SUCCESSOR);
  assert.equal(proof.substitutions, 1);
  assert.equal(proof.verdict, VERDICT);
  // The admitted gate set is DERIVED, not declared: three gates, all from the parent map.
  assert.deepEqual([...api.successorGates(bound()).keys()].sort(), ['merge-source', 'migrate-source', 'writers-source']);
  // The accepted schedule is read out of the wrapper, in full, not as a prefix.
  assert.equal(api.acceptedVerdicts(bound()).get(PARENT_CHILD), VERDICT);
  // The source closure is the successor plus the module it loads, and nothing else.
  assert.deepEqual([...api.closure(SUCCESSOR).keys()].sort(), [MODULE, SUCCESSOR].sort());
});

test('Z1 — only the ruling admits a successor; no other id, package or gate does', () => {
  // No successor block at all: the ordinary rule, with its own unchanged code.
  const none = spec(); none.coverage.successors = null;
  assert.throws(() => carry(none), /INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE/);
  // A gate the PARENT does not record against a support-reading carrier.
  const b = bound(); delete b.acceptance.coverage.byChild[GATE];
  assert.throws(() => carry(spec(), b), /SUCCESSOR-GATE-NOT-IN-THE-RULING/);
  // A carrier whose own source does not reach the superseded support file drops out of the
  // derived set entirely — the ruling is about that supersession and nothing else.
  const quiet = bound();
  write(ORIGINAL, originalText.replace(FROM, "const PINNED_SUPPORT = 'rebuild/m4/spec/unrelated.cjs';"));
  quiet.acceptance.executionPins[ORIGINAL] = sha(fs.readFileSync(path.join(scratch, ORIGINAL)));
  assert.equal(api.successorGates(quiet).size, 0);
  write(ORIGINAL, originalText);
  // A declared carrier the spec does not name.
  const missing = spec(); delete missing.coverage.successors.carriers[PARENT_CHILD];
  assert.throws(() => carry(missing), /SUCCESSOR-CARRIER-NOT-DECLARED/);
  // And the id itself is a runner constant, never a spec's word for itself.
  assert.equal(api.SUCCESSOR_RULING, 'DECISIONS:113');
  assert.deepEqual([...api.SUCCESSOR_PACKAGES], ['B-NTC']);
  assert.equal(api.MOVES_RULING, null); // X1 is NOT widened by any of this
});

test('Z2 — the original must be the parent\'s own byte, on disk and in Git at its commit', () => {
  const drifted = bound(); drifted.acceptance.executionPins[ORIGINAL] = '0'.repeat(64);
  assert.throws(() => carry(spec(), drifted), /SUCCESSOR-ORIGINAL-NOT-THE-PARENT-EXECUTION-PIN/);
  // Move the original on disk and re-pin it in lockstep — the forge that defeats a
  // single-anchor check. The Git blob at the parent's acceptance commit still refuses.
  const tampered = originalText.replace('if (observed !== 9)', 'if (observed !== 8)');
  write(ORIGINAL, tampered);
  const relockstep = bound(); relockstep.acceptance.executionPins[ORIGINAL] = sha(Buffer.from(tampered));
  assert.throws(() => carry(spec(), relockstep), /SUCCESSOR-ORIGINAL-NOT-THE-PARENT-ACCEPTANCE-BLOB/);
  write(ORIGINAL, originalText);
  carry(); // restored
});

test('Z2 — a successor that COPIES the original instead of loading it refuses', () => {
  const copied = moduleText.replace(
    "  let body = fs.readFileSync(path.join(__dirname, '../../..', file), 'utf8');",
    '  let body = ' + JSON.stringify(originalText) + ';');
  write(MODULE, copied);
  assert.throws(() => carry(), /SUCCESSOR-COPIES-THE-ORIGINAL-INSTEAD-OF-LOADING-IT/);
  // A successor that neither loads nor names the original refuses for the other reason.
  write(MODULE, moduleText.replaceAll(ORIGINAL, 'rebuild/m4/spec/not-the-original.cjs'));
  assert.throws(() => carry(), /SUCCESSOR-DOES-NOT-NAME-THE-ORIGINAL/);
  write(MODULE, moduleText);
  carry();
});

test('Z2 — the substitutions are exactly the spec\'s, and nothing else replaces', () => {
  // A retarget quietly weakened in the successor while the spec keeps the old text.
  const weakened = JSON.parse(JSON.stringify(substitutions));
  weakened[0].to = "const PINNED_SUPPORT = 'ignored'; // assert.ok(true)                 ";
  write(MODULE, moduleText.replace(JSON.stringify(substitutions, null, 1), JSON.stringify(weakened, null, 1)));
  assert.throws(() => carry(), /SUCCESSOR-SUBSTITUTION-TABLE-DISAGREES-WITH-THE-SPEC/);
  write(MODULE, moduleText);
  // A replacement performed outside the declared table.
  write(MODULE, moduleText.replace('  return body;', "  return body.replace('throw', 'return');"));
  assert.throws(() => carry(), /SUCCESSOR-REPLACEMENT-NOT-DRIVEN-BY-THE-DECLARED-TABLE/);
  write(MODULE, moduleText);
  // A spec substitution whose `from` is not in the original at all.
  const absent = spec(); absent.coverage.successors.substitutions[0].from = 'const NOT_IN_THE_ORIGINAL_AT_ALL = 1;';
  write(MODULE, moduleText.replace(JSON.stringify(substitutions, null, 1), JSON.stringify(absent.coverage.successors.substitutions, null, 1)));
  assert.throws(() => carry(absent), /SUCCESSOR-SUBSTITUTION-NOT-EXACTLY-ONCE-IN-THE-ORIGINAL/);
  write(MODULE, moduleText);
  // No table at all.
  write(MODULE, moduleText.replace('const SUBSTITUTIONS = ', 'const NOT_THE_TABLE = '));
  assert.throws(() => carry(), /SUCCESSOR-SUBSTITUTION-TABLE-MISSING/);
  write(MODULE, moduleText);
  carry();
});

test('Z3 — the successor is held to the parent\'s accepted verdict in full, not a prefix', () => {
  const prefix = spec(); prefix.children[0].needle = 'NATIVE SOURCE CARRIERS:';
  assert.throws(() => carry(prefix), /SUCCESSOR-EXECUTED-VERDICT/);
  const zero = spec(); zero.children[0].needle = 'NATIVE SOURCE CARRIERS: 0/6 PASS;';
  assert.throws(() => carry(zero), /SUCCESSOR-EXECUTED-VERDICT/);
  // The schedule comes from the wrapper's pinned bytes, so an edited wrapper refuses.
  const edited = bound(); edited.acceptance.executionPins[WRAPPER] = '0'.repeat(64);
  assert.throws(() => carry(spec(), edited), /SUCCESSOR-WRAPPER-BYTES/);
});

test('Z5 — the parent acceptance commit is anchored, and no spec names a commit', () => {
  // The spec must agree with the runner's constant; it can never choose another commit.
  const other = spec(); other.coverage.successors.parentAcceptanceCommit = 'f'.repeat(40);
  // spec() enforces that equality; successorCoverage never reads the spec's value at all.
  assert.equal(carry(other).original, ORIGINAL);
  // Z5: the withdrawn code read `p.sourceCommit` off a policy file and checked nothing
  // about where that commit sat. There is no such read anywhere in the runner now.
  assert(!/\.sourceCommit\b/.test(fixtureSource), 'the runner reads no policy sourceCommit');
  // The anchoring is a real ancestry question asked of Git, not a string compare: the
  // branch moves forward and the commit stays an ancestor, so the successor still carries.
  git('commit', '--quiet', '--allow-empty', '-m', 'later');
  assert.notEqual(git('rev-parse', 'HEAD').trim(), parentCommit);
  assert.equal(carry().verdict, VERDICT);
  // A commit that is NOT an ancestor cannot be substituted by any input, because the
  // commit is a runner constant; what the source must carry is the two ancestry asks.
  assert.equal(fixtureSource.split("'merge-base', '--is-ancestor', SUCCESSOR_PARENT_COMMIT, CHAIN_REF").length, 2);
  assert.equal(fixtureSource.split("'merge-base', '--is-ancestor', SUCCESSOR_PARENT_COMMIT, 'HEAD'").length, 2);
});

test('Z6 — the refusal vocabulary is derived from the runner and covers these codes', () => {
  for (const code of ['INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE', 'SUCCESSOR-GATE-NOT-IN-THE-RULING',
    'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-EXECUTION-PIN', 'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-ACCEPTANCE-BLOB',
    'SUCCESSOR-COPIES-THE-ORIGINAL-INSTEAD-OF-LOADING-IT', 'SUCCESSOR-SUBSTITUTION-TABLE-DISAGREES-WITH-THE-SPEC',
    'SUCCESSOR-REPLACEMENT-NOT-DRIVEN-BY-THE-DECLARED-TABLE', 'SUCCESSOR-EXECUTED-VERDICT',
    'SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT', 'COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING',
    'SUCCESSOR-RULING-NOT-CITED', 'SUCCESSOR-PACKAGE-NOT-RULED'])
    assert(api.FAIL_CODES.has(code), 'vocabulary carries ' + code);
  // It is a vocabulary, not an echo: a string an input could shape is not in it.
  assert(!api.FAIL_CODES.has('ARBITRARY-TEXT-FROM-A-CHILD-PROCESS'));
  assert(api.FAIL_CODES.size >= 40);
});
