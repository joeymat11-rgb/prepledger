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

// r7b F-C. The ruling is no longer a constant naming one package: successorRuling() reads
// the LINE the spec cites by sha256 off the chain branch and requires it to name this
// package, grant a SUCCESSOR, stand on the base ruling's conditions and name the support
// file. So the fixture's chain branch carries a line of its own, in the ledger's shape.
const SUPPORT = 'rebuild/m4/workout/engine-runtime.cjs';
const RULING_LINE = '- 2026-09-11 · cowork · LANE B RULINGS — MOVES_RULING B-NTC-INHERITED-1 RATIFIED AS WRITTEN: ' +
  'for M2-B-NTC only, the child may declare coverage.inherited naming a SUCCESSOR executable per parent child name, ' +
  'on the conditions (a)-(e); the pin re-target is the one engine-runtime supersession makes necessary · RULED';
const OTHER_RULING = '- 2026-09-11 · cowork · a chain line that grants nothing · RULED';
write('rebuild/DECISIONS.md', [OTHER_RULING, RULING_LINE, ''].join('\n'));
// DECISIONS:147 / ":113 (1) (c) … enumerated verbatim in the package spec AND IN THE REVIEW".
// The review the fixture spec cites, carrying the one substitution verbatim.
const REVIEW_FILE = 'rebuild/lanes/b/reviews/B-NTC-REVIEW-r2.md';
write(REVIEW_FILE, ['# B-NTC REVIEW r2', 'The enumerated substitution, quoted verbatim:',
  '  from: ' + FROM, '  to:   ' + TO, ''].join('\n'));
write(ORIGINAL, originalText);
write(WRAPPER, wrapperText);
write(MODULE, moduleText);
write(SUCCESSOR, successorText);
write('rebuild/conform/v4/postfix/run.cjs', fs.readFileSync(path.join(sourceRoot, 'rebuild/conform/v4/postfix/run.cjs')));
// TOOLING-REVIEW r6 change 6: FAIL_CODES harvests the originals' own closed refusal codes
// by READING these modules off disk, so the fixture carries their real bytes as it already
// carries run.cjs. Copies, never re-typed.
for (const original of ['rebuild/conform/v4/postfix/target.cjs', 'rebuild/conform/v4/postfix/legacy-gates.cjs',
  'rebuild/conform/v4/postfix/strict-json.cjs', 'rebuild/m4/spec/native-carriers-errors.cjs',
  'rebuild/m4/spec/load-write-reference.cjs'])
  write(original, fs.readFileSync(path.join(sourceRoot, original)));

// A real Git repository of this fixture's own, so the runner's Git-anchored assertions run
// against bytes this test controls. No ref, object or commit of the real repository is read.
git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 'fixer5@earned.local');
git('config', 'user.name', 'lane-b-fixer5');
git('add', '-A');
git('commit', '--quiet', '-m', 'fixture');
const parentCommit = git('rev-parse', 'HEAD').trim();

// The runner, compiled with exactly ONE literal changed: the chain branch (this fixture's
// own branch). r7b F-C removed the second — `SUCCESSOR_PARENT_COMMIT` was a constant naming
// B-NTC's parent and is now taken from the parent's OWN receipt (`bound.reviewedCommit`),
// so the fixture supplies it as data like every other parent fact.
const fixtureSource = source
  .replace("const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';", "const CHAIN_REF = 'refs/heads/fixture-chain';");
{
  const a = source.split('\n'), b = fixtureSource.split('\n');
  assert.equal(a.length, b.length, 'the fixture changes no line count');
  const moved = a.map((line, i) => [i, line]).filter(([i, line]) => line !== b[i]);
  assert.equal(moved.length, 1, 'exactly one constant is re-pointed at the fixture');
  for (const [, line] of moved) assert.match(line, /^const CHAIN_REF = '/);
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
    '\nmodule.exports={closure,parentClosure,successorGates,successorRuling,acceptedVerdicts,successorTable,successorProof,successorCoverage,coverage,failCode,MOVES_RULING,SUCCESSOR_RULING,SUCCESSOR_RULING_ID,SUCCESSOR_LOAD_FLOOR,SUBSTITUTION_FORBIDDEN,FAIL_CODES,init(){logDir=root;specRaw=Buffer.from("{}");}};', runnerFile);
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
// r7b F-C: `reviewedCommit` is the parent's own receipt commit, which option() reads out of
// the ledger line; the runner takes the acceptance commit from THERE, never from a constant.
// The parent here is an accepted ORIGINAL, so it carries no `children` of its own and the
// accepted schedule is read from the declared WRAPPER — the older of the two shapes.
const bound = () => ({ option: { id: 'NATIVE-CARRIERS' }, decided: true, reviewedCommit: parentCommit, acceptance: {
  product: {},
  executionPins: { [ORIGINAL]: sha(fs.readFileSync(path.join(scratch, ORIGINAL))), [WRAPPER]: sha(fs.readFileSync(path.join(scratch, WRAPPER))) },
  coverage: { byChild: { ...inherited } } } });
const pin = f => ({ pre: sha(fs.readFileSync(path.join(scratch, f))), post: sha(fs.readFileSync(path.join(scratch, f))), role: 'new' });
const RULING_SHA = sha(Buffer.from(RULING_LINE));
const spec = () => ({
  packageId: 'M2-B-NTC-NATIVE-TREND-CONTEXT',
  // The successor and the module it loads are this package's OWN new product; the closure
  // walk is bounded by exactly that set, and everything it reaches outside it is a boundary
  // file the runner requires to be a parent pin or the immutable conform library. The
  // SUPPORT file is declared a change of this package, which is what makes the successor
  // necessary at all — r7b F-C requires that fact, never the spec's word for it.
  product: { [SUCCESSOR]: pin(SUCCESSOR), [MODULE]: pin(MODULE),
    [SUPPORT]: { pre: '1'.repeat(64), post: '2'.repeat(64), role: 'superseded-by-child' } },
  children: [{ name: CHILD, argv: [SUCCESSOR], needle: VERDICT }],
  coverage: { inherited: { ...inherited }, moves: {}, successors: {
    ruling: 'MOVES_RULING=' + api.SUCCESSOR_RULING + ' ' + api.SUCCESSOR_RULING_ID,
    rulingLineSha256: RULING_SHA,
    support: SUPPORT,
    wrapper: WRAPPER,
    reviewFile: REVIEW_FILE,
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
  assert.deepEqual([...api.successorGates(spec(), bound()).keys()].sort(), ['merge-source', 'migrate-source', 'writers-source']);
  // The accepted schedule is read out of the wrapper, in full, not as a prefix.
  assert.equal(api.acceptedVerdicts(spec(), bound()).get(PARENT_CHILD), VERDICT);
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
  assert.equal(api.successorGates(spec(), quiet).size, 0);
  write(ORIGINAL, originalText);
  // A declared carrier the spec does not name.
  // DECISIONS:147: with no carrier declared there is no parent gate closure for a
  // substitution to live in either, so this refuses one assertion earlier than it did.
  const missing = spec(); delete missing.coverage.successors.carriers[PARENT_CHILD];
  assert.throws(() => carry(missing), /SUCCESSOR-SUBSTITUTION-TARGET-NOT-IN-THE-PARENT-GATE-CLOSURE|SUCCESSOR-GATE-NOT-IN-THE-RULING|SUCCESSOR-CARRIER-NOT-DECLARED/);
  // r7b F-C. `SUCCESSOR_PACKAGES` is gone — a constant naming one package could not read
  // DECISIONS:142's grant to another. What admits a package is the RULING'S OWN LINE on the
  // chain branch, located by the sha256 the spec records and required to name THIS package.
  const wrongSha = spec(); wrongSha.coverage.successors.rulingLineSha256 = '0'.repeat(64);
  assert.throws(() => carry(wrongSha), /SUCCESSOR-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH/);
  const grantsNothing = spec(); grantsNothing.coverage.successors.rulingLineSha256 = sha(Buffer.from(OTHER_RULING));
  assert.throws(() => carry(grantsNothing), /SUCCESSOR-RULING-DOES-NOT-NAME-THIS-PACKAGE|SUCCESSOR-RULING-DOES-NOT-GRANT-A-SUCCESSOR/);
  // The base conditions (a)-(e) are still this runner's, and the coordinate and id with them.
  assert.equal(api.SUCCESSOR_RULING, 'DECISIONS:113');
  assert.equal(api.SUCCESSOR_RULING_ID, 'B-NTC-INHERITED-1');
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
  // A spec substitution whose `from` is not in the original at all. DECISIONS:147 asks the
  // review first, so the review is given the same text: this case is about the ORIGINAL.
  const absent = spec(); absent.coverage.successors.substitutions[0].from = 'const NOT_IN_THE_ORIGINAL_AT_ALL = 1;';
  const reviewBefore = fs.readFileSync(path.join(scratch, REVIEW_FILE), 'utf8');
  write(REVIEW_FILE, reviewBefore + '  from: const NOT_IN_THE_ORIGINAL_AT_ALL = 1;\n');
  write(MODULE, moduleText.replace(JSON.stringify(substitutions, null, 1), JSON.stringify(absent.coverage.successors.substitutions, null, 1)));
  assert.throws(() => carry(absent), /SUCCESSOR-SUBSTITUTION-NOT-EXACTLY-ONCE-IN-THE-ORIGINAL/);
  write(REVIEW_FILE, reviewBefore);
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
  // r7b F-C: the spec must agree with the PARENT'S OWN RECEIPT, which option() read out of
  // the ledger line — not with a constant in the runner. A spec that names another commit
  // refuses by name, so it can still never choose one.
  const other = spec(); other.coverage.successors.parentAcceptanceCommit = 'f'.repeat(40);
  assert.throws(() => carry(other), /SUCCESSOR-PARENT-ACCEPTANCE-COMMIT-IS-NOT-THE-PARENT-REVIEWED-COMMIT/);
  // Z5: the withdrawn code read `p.sourceCommit` off a policy file and checked nothing
  // about where that commit sat. There is no such read anywhere in the runner now.
  assert(!/\.sourceCommit\b/.test(fixtureSource), 'the runner reads no policy sourceCommit');
  // The anchoring is a real ancestry question asked of Git, not a string compare: the
  // branch moves forward and the commit stays an ancestor, so the successor still carries.
  git('commit', '--quiet', '--allow-empty', '-m', 'later');
  assert.notEqual(git('rev-parse', 'HEAD').trim(), parentCommit);
  assert.equal(carry().verdict, VERDICT);
  // The commit is still never an input's choice: it is the parent receipt's own, and both
  // ancestry asks still stand over it. TOOLING-REVIEW r7 F3: both go through the ONE named
  // ancestry helper, so the refusal carries a code instead of reaching the catch as
  // "Command failed"; the asks are the same `merge-base --is-ancestor` as ever.
  assert.equal(fixtureSource.split("ancestor(PARENT_COMMIT, CHAIN_REF, 'SUCCESSOR-PARENT-COMMIT-NOT-ON-THE-CHAIN-BRANCH')").length, 2);
  assert.equal(fixtureSource.split("ancestor(PARENT_COMMIT, 'HEAD', 'SUCCESSOR-PARENT-COMMIT-NOT-BEHIND-HEAD')").length, 2);
  assert.equal(fixtureSource.split("const PARENT_COMMIT = bound.reviewedCommit;").length, 2, 'the commit comes from the parent receipt, once');
  assert.equal(fixtureSource.split("L.git(root, ['merge-base', '--is-ancestor', commit, of]);").length, 2, 'exactly one ancestry call site');
});

test('Z6 — the refusal vocabulary is derived from the runner and covers these codes', () => {
  for (const code of ['INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE', 'SUCCESSOR-GATE-NOT-IN-THE-RULING',
    'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-EXECUTION-PIN', 'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-ACCEPTANCE-BLOB',
    'SUCCESSOR-COPIES-THE-ORIGINAL-INSTEAD-OF-LOADING-IT', 'SUCCESSOR-SUBSTITUTION-TABLE-DISAGREES-WITH-THE-SPEC',
    'SUCCESSOR-REPLACEMENT-NOT-DRIVEN-BY-THE-DECLARED-TABLE', 'SUCCESSOR-EXECUTED-VERDICT',
    'SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT', 'COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING',
    'SUCCESSOR-RULING-NOT-CITED', 'SUCCESSOR-RULING-DOES-NOT-NAME-THIS-PACKAGE',
    'SUCCESSOR-RULING-DOES-NOT-GRANT-A-SUCCESSOR', 'SUCCESSOR-RULING-DOES-NOT-STAND-ON-THE-BASE-CONDITIONS',
    'SUCCESSOR-RULING-DOES-NOT-NAME-THE-SUPPORT-FILE', 'SUCCESSOR-SUPPORT-IS-NOT-A-DECLARED-CHANGE-OF-THIS-PACKAGE',
    'SUCCESSOR-PARENT-ACCEPTANCE-COMMIT-IS-NOT-THE-PARENT-REVIEWED-COMMIT', 'SUCCESSOR-ACCEPTED-SCHEDULE-UNAVAILABLE',
    'PARENT-PIN-SHAPE'])
    assert(api.FAIL_CODES.has(code), 'vocabulary carries ' + code);
  // It is a vocabulary, not an echo: a string an input could shape is not in it.
  assert(!api.FAIL_CODES.has('ARBITRARY-TEXT-FROM-A-CHILD-PROCESS'));
  assert(api.FAIL_CODES.size >= 40);
  // And what the terminal prints is the CODE alone, never the rest of the message.
  // assert.equal appends "\n\na !== b"; the token stops before it.
  let thrown;
  try { assert.equal(1, 2, 'SUCCESSOR-EXECUTED-VERDICT source-carriers; the successor is held'); } catch (e) { thrown = e; }
  assert.equal(api.failCode(thrown.message), 'SUCCESSOR-EXECUTED-VERDICT');
  try { assert.equal('a', 'b', 'SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT'); } catch (e) { thrown = e; }
  assert.equal(api.failCode(thrown.message), 'SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT');
  // An unnamed assertion and anything an input could shape return null, not an echo.
  assert.equal(api.failCode('Child argv probe-child'), null);
  assert.equal(api.failCode('NOT-A-REAL-CODE-AT-ALL something'), null);
  assert.equal(api.failCode('ENOENT: no such file or directory'), null);
  assert.equal(api.failCode(undefined), null);
  // TOOLING-REVIEW r6 change 6 (F5). The vocabulary now also carries the ORIGINALS' own
  // closed codes, read out of their modules the way BLOCKED is imported, so the highest-
  // value forgery refusals print a code instead of a bare FAIL.
  for (const code of ['RECEIPT-EXACT-LINE-MISSING', 'RECEIPT-CONTENT', 'RECEIPT-SCHEMA', 'RECEIPT-ROLE',
    'JSON-NONCANONICAL-BYTES', 'JSON-DUPLICATE-KEY', 'WORKTREE-SOURCE-PIN', 'GIT-SOURCE-PIN', 'SOURCE-PIN-SCHEMA'])
    assert(api.FAIL_CODES.has(code), 'vocabulary carries the original refusal ' + code);
  let original;
  try { require(path.join(sourceRoot, 'rebuild/conform/v4/postfix/strict-json.cjs')).parseExact(Buffer.from('{ }')); }
  catch (e) { original = e; }
  assert.equal(original.code, 'JSON-NONCANONICAL-BYTES');
  assert.equal(api.failCode(original.message), 'JSON-NONCANONICAL-BYTES');
});

test('r6 change 3 — a successor that REQUIRES the original instead of compiling it refuses', () => {
  // DECISIONS:113 (b): the parent body is compiled "in a private module that never enters
  // require.cache". A require() of the original is exactly how it would enter it, so the
  // clause is enforced by reading the successor's own closure for such a specifier. The
  // faithful module above reads the bytes and hands them on; this one requires them.
  const requiring = moduleText.replace("const fs = require('node:fs'), path = require('node:path');",
    "const fs = require('node:fs'), path = require('node:path');\n// the whole of the mutant: the original as a MODULE, not as bytes.\nfunction loaded() { return require('./native-carriers-source-carriers.cjs'); }");
  assert.notEqual(requiring, moduleText);
  write(MODULE, requiring);
  try {
    assert.throws(() => carry(), /SUCCESSOR-REQUIRES-THE-ORIGINAL-INSTEAD-OF-COMPILING-IT/);
    assert(api.FAIL_CODES.has('SUCCESSOR-REQUIRES-THE-ORIGINAL-INSTEAD-OF-COMPILING-IT'));
  } finally { write(MODULE, moduleText); }
  // Restored, the faithful successor is admitted again — the rule is the require, not the edit.
  assert.equal(carry().verdict, VERDICT);
});
