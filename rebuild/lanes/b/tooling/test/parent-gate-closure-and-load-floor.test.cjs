'use strict';
// LANE B — DECISIONS:147. `:113 (1) (c)` admitted a successor substitution only over a file
// the parent pins in executionPins, and BRIEF-H3 v1.6 §9 measured what that costs: every
// file a child of B-NTC must re-target is reached by the gate and pinned by nobody, and the
// load floor was calibrated to NATIVE-CARRIERS' large programmes while B-NTC's carriers are
// nine-line wrappers. :147 amends (c): ANY file of the parent gate's own source closure,
// parent-transitive, sha-anchored to the parent's reviewed commit, enumerated verbatim in
// the spec AND IN THE REVIEW, never reaching private/goldens/oracle; and the floor is
// measured on the body the wrapper LOADS.
//
// The fixture below is B-NTC's own shape in miniature: a nine-line wrapper that loads a
// large support module, which in turn names one original by PATH LITERAL and requires
// another — the two ways a gate reaches its own programme. Method is the house one: compile
// the REAL runner with only CHAIN_REF re-pointed, asserted below to be the only line that
// differs. No ref, object or commit of the real repository is read.
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
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-r9-closure-'));
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  return text;
}
const git = (...argv) => cp.execFileSync('git', argv, { cwd: scratch, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
for (const original of ['rebuild/conform/v4/postfix/run.cjs', 'rebuild/conform/v4/postfix/target.cjs',
  'rebuild/conform/v4/postfix/legacy-gates.cjs', 'rebuild/conform/v4/postfix/strict-json.cjs',
  'rebuild/m4/spec/native-carriers-errors.cjs', 'rebuild/m4/spec/load-write-reference.cjs'])
  write(original, fs.readFileSync(path.join(sourceRoot, original)));

// -------------------------------------------------------------- the parent's own programme
const WRAPPER = 'rebuild/m4/spec/b-ntc-source-carriers.cjs';   // the declared original: 9 lines
const SUPPORT_MOD = 'rebuild/m4/spec/b-ntc-successors.cjs';    // what the wrapper LOADS
const SOURCE = 'rebuild/m4/spec/native-carriers-source.cjs';   // reached by a PATH LITERAL
const REFERENCE = 'rebuild/m4/spec/native-carriers-reference.cjs'; // reached by a REQUIRE
const ORACLE = 'rebuild/conform/oracle/manifest.json';         // reached, and FORBIDDEN by :147
const UNREACHED = 'rebuild/m4/spec/never-reached-by-the-gate.cjs';
const PARENT_PACKAGE = 'rebuild/m4/spec/native-carriers-package.cjs';
const SUPPORT = 'rebuild/engine/writers.cjs';                  // the supersession that makes it necessary
const VERDICT = 'NATIVE SOURCE CARRIERS: 6/6 PASS;';

const FROM_SOURCE = "const RETAINED_OF_RECORD = 'rebuild/engine/writers.cjs@parent-byte-of-record';";
const TO_SOURCE = "const RETAINED_OF_RECORD = 'rebuild/engine/writers.cjs@child-byte-of-record';";
const FROM_REF = "const RECOVERED_PREIMAGE_PIN = 'writers.cjs@accepted-preimage-of-the-parent';";
const TO_REF = "const RECOVERED_PREIMAGE_PIN = 'writers.cjs@accepted-preimage-of-the-child';";
const FROM_MOD = "const SUPERSEDED_PATHS_OF_RECORD = ['rebuild/engine/writers.cjs@parent'];";
const TO_MOD = "const SUPERSEDED_PATHS_OF_RECORD = ['rebuild/engine/writers.cjs@child'];";

// The wrapper: nine lines, seven of them 40+ characters — exactly B-NTC's carriers, and the
// shape the old floor refused outright.
const wrapperText = ["'use strict';",
  '// A parent gate carrier. It carries no programme of its own: the body that runs is the',
  '// shared support module it loads, which is what DECISIONS:113 (b) requires of it.',
  "const support = require('./b-ntc-successors.cjs');",
  "// The carrier exists so the gate has one executable per parent child name to point at.",
  "module.exports = support.run('source-carriers');",
  "// Nine lines, and not one of them is the programme under test.",
  '', ''].join('\n');
const WRAPPER_LONG = wrapperText.split('\n').map(l => l.trim()).filter(l => l.length >= 40).length;
assert.equal(wrapperText.split('\n').length, 9);
assert(WRAPPER_LONG > 0 && WRAPPER_LONG < 8,
  'the wrapper carries fewer qualifying lines than the floor — B-NTC\'s own shape, which refused outright before :147');

const supportText = ["'use strict';",
  '// The shared support module every parent carrier loads. This is the body the floor must',
  '// be measured against, because it is the programme the wrapper exists to run.',
  "const fs = require('node:fs'), path = require('node:path');",
  "const reference = require('./native-carriers-reference.cjs');",
  "const ORIGINALS = { 'source-carriers': 'rebuild/m4/spec/native-carriers-source.cjs' };",
  FROM_MOD,
  'const SUBSTITUTIONS = [];',
  'function prepareTheOriginalBodyForPrivateCompilation(name, root) {',
  '  const file = ORIGINALS[name];',
  "  let body = fs.readFileSync(path.join(root, file), 'utf8');",
  '  for (const sub of SUBSTITUTIONS) if (sub.original === file) body = body.replace(sub.from, sub.to);',
  '  return body;',
  '}',
  'function run(name) { return prepareTheOriginalBodyForPrivateCompilation(name, __dirname); }',
  'module.exports = { run, prepare: prepareTheOriginalBodyForPrivateCompilation, reference };',
  ''].join('\n');

const sourceText = ["'use strict';",
  '// The parent original the support module compiles privately. It is named by a PATH',
  '// LITERAL above and by nothing else, which is the second kind of closure edge :147 needs.',
  FROM_SOURCE,
  "const ORACLE_MANIFEST = 'rebuild/conform/oracle/manifest.json';",
  'function assertEveryRetainedFileStandsAtItsAcceptedByte(rows) {',
  '  if (!Array.isArray(rows)) throw new Error("retained rows shape");',
  '  return rows.length + rows.length + rows.length;',
  '}',
  'module.exports = { assertEveryRetainedFileStandsAtItsAcceptedByte, RETAINED_OF_RECORD, ORACLE_MANIFEST };',
  ''].join('\n');

const referenceText = ["'use strict';",
  '// Reached from the support module by a RELATIVE REQUIRE. It inverse-applies the declared',
  '// edits and pins the recovered preimage, which is why a child that changes the engine has',
  '// to re-target it as well as the source module above.',
  FROM_REF,
  'function recoverTheAcceptedPreimageOfEveryDeclaredEdit(rows) {',
  '  if (!Array.isArray(rows)) throw new Error("reference rows shape");',
  '  return rows.slice().reverse();',
  '}',
  'module.exports = { recoverTheAcceptedPreimageOfEveryDeclaredEdit, RECOVERED_PREIMAGE_PIN };',
  ''].join('\n');

// A second carrier whose loaded module is TINY: the floor still has to refuse this one, or
// moving where it is measured would have turned the copy test off rather than moving it.
const THIN_WRAPPER = 'rebuild/m4/spec/b-ntc-thin-carriers.cjs';
const THIN_MOD = 'rebuild/m4/spec/b-ntc-thin-support.cjs';
write(THIN_WRAPPER, wrapperText.replace('./b-ntc-successors.cjs', './b-ntc-thin-support.cjs'));
write(THIN_MOD, ["'use strict';", "module.exports = { run() { return 1; } };", ''].join('\n'));

write(WRAPPER, wrapperText);
write(SUPPORT_MOD, supportText);
write(SOURCE, sourceText);
write(REFERENCE, referenceText);
write(ORACLE, '{\n  "goldens": {}\n}\n');
write(UNREACHED, "'use strict';\nmodule.exports = { nobody: 'reaches this file from the gate at all' };\n");
write(PARENT_PACKAGE, ['const names=[];', 'const verdicts={', " 'source-carriers':'" + VERDICT + "',",
  " 'inherited-carriers':'NATIVE INHERITED CARRIERS: 6/6 PASS;',", '};', ''].join('\n'));

// The child's own successor, and the module it loads: both role:"new" product of this spec.
const SUCCESSOR = 'rebuild/m4/spec/h3-source-carriers.cjs';
const CHILD_MOD = 'rebuild/m4/spec/h3-successors.cjs';
const substitutions = [
  { original: SOURCE, from: FROM_SOURCE, to: TO_SOURCE, why: 'the retained-file byte re-targets onto the child post-image' },
  { original: REFERENCE, from: FROM_REF, to: TO_REF, why: 'the recovered preimage re-targets onto the child post-image' },
  { original: SUPPORT_MOD, from: FROM_MOD, to: TO_MOD, why: 'the superseded path list re-targets onto the child post-image' },
];
write(CHILD_MOD, ["'use strict';",
  '// The child successor module. It LOADS each parent original by path and replaces only',
  '// what the table states; the table is the one the package spec enumerates verbatim.',
  "const nodeFs = require('node:fs');",
  "const nodePath = require('node:path');",
  'const SUBSTITUTIONS = ' + JSON.stringify(substitutions, null, 1) + ';',
  'const ORIGINALS = ' + JSON.stringify({ 'source-carriers': WRAPPER }, null, 1) + ';',
  'function prepare(name) {',
  '  const target = ORIGINALS[name];',
  "  let text = nodeFs.readFileSync(nodePath.join(__dirname, '../../..', target), 'utf8');",
  '  for (const substitution of SUBSTITUTIONS) {',
  '    if (substitution.original !== target) continue;',
  '    text = text.replace(substitution.from, substitution.to);',
  '  }',
  '  return text;',
  '}',
  'module.exports = { prepare, run(name) { return prepare(name); } };', ''].join('\n'));
write(SUCCESSOR, ["'use strict';", "require('./h3-successors.cjs').run('source-carriers');", ''].join('\n'));

// The review the spec cites: :113 (c) says "enumerated verbatim in the package spec AND IN
// THE REVIEW", and until :147 only the spec half was asserted.
const REVIEW_FILE = 'rebuild/lanes/b/reviews/H3-REVIEW-r1.md';
const reviewText = ['# H3 REVIEW r1', 'The three enumerated substitutions, quoted verbatim:', '',
  ...substitutions.flatMap(s => ['- ' + s.original, '  from: ' + s.from, '  to:   ' + s.to]), ''].join('\n');
write(REVIEW_FILE, reviewText);

const RULING_LINE = '- 2026-09-12 · cowork · SUCCESSOR SHAPE WIDENED — M2-H3-CLEAN-INIT may declare a SUCCESSOR for the parent ' +
  'gate whose carrier pins rebuild/engine/writers.cjs, under conditions (a)-(e) of B-NTC-INHERITED-1, each substitution ' +
  'enumerated verbatim in the package spec and in the review, sha-anchored to the parent reviewed commit · RULED';
write('rebuild/DECISIONS.md', [RULING_LINE, ''].join('\n'));

git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 'tooling7@earned.local');
git('config', 'user.name', 'lane-b-tooling7');
git('add', '-A'); git('commit', '--quiet', '-m', 'the parent programme');
const PARENT_COMMIT = git('rev-parse', 'HEAD').trim();
// TOOLING-REVIEW-r9 F3. The cited review is PINNED and must stand in Git at HEAD, so a
// fixture that changes it changes the pin and commits it — which is the discipline the rule
// asks of a real package. `useReview` is the only way this suite touches the file.
let REVIEW_SHA = sha(Buffer.from(reviewText));
function useReview(text) {
  write(REVIEW_FILE, text);
  git('add', '--', REVIEW_FILE);
  git('commit', '--quiet', '--allow-empty', '-m', 'the review of record');
  REVIEW_SHA = sha(Buffer.from(text));
}

const fixtureSource = source.replace(
  "const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';",
  "const CHAIN_REF = 'refs/heads/fixture-chain';");
{
  const a = source.split('\n'), b = fixtureSource.split('\n');
  assert.equal(a.length, b.length, 'the fixture changes no line count');
  assert.equal(a.filter((line, i) => line !== b[i]).length, 1, 'exactly one constant is re-pointed');
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
process.argv = [process.execPath, runnerFile, '--ci', '--package', 'H3'];
try {
  m._compile(fixtureSource.slice(0, fixtureSource.indexOf(delimiter)) +
    '\nmodule.exports={parentClosure,successorProof,successorSpecShape,SUCCESSOR_LOAD_FLOOR,SUBSTITUTION_FORBIDDEN,REVIEWS_DIR,FAIL_CODES,' +
    'init(){logDir=root;specRaw=Buffer.from("{}");}};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
api.init();

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-r9-closure-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

const at = f => sha(fs.readFileSync(path.join(scratch, f)));
const CHILD = 'source-carriers';
const bound = () => ({ option: { id: 'B-NTC' }, decided: true, reviewedCommit: PARENT_COMMIT, acceptance: {
  product: {}, executionPins: { [WRAPPER]: at(WRAPPER), [THIN_WRAPPER]: at(THIN_WRAPPER), [PARENT_PACKAGE]: at(PARENT_PACKAGE) },
  children: [{ name: CHILD, argv: [WRAPPER], needle: VERDICT }],
  coverage: { byChild: { 'migrate-source': CHILD } } } });
const pin = f => ({ pre: at(f), post: at(f), role: 'new' });
const spec = () => ({
  packageId: 'M2-H3-CLEAN-INIT',
  product: { [SUCCESSOR]: pin(SUCCESSOR), [CHILD_MOD]: pin(CHILD_MOD),
    [SUPPORT]: { pre: '1'.repeat(64), post: '2'.repeat(64), role: 'edited' } },
  children: [{ name: CHILD, argv: [SUCCESSOR], needle: VERDICT }],
  coverage: { inherited: { 'migrate-source': CHILD }, moves: {}, successors: {
    ruling: 'MOVES_RULING=DECISIONS:147 in the B-NTC-INHERITED-1 shape',
    rulingLineSha256: sha(Buffer.from(RULING_LINE)),
    support: SUPPORT, wrapper: null, reviewFile: REVIEW_FILE, reviewFileSha256: REVIEW_SHA,
    parentAcceptanceCommit: PARENT_COMMIT,
    carriers: { [CHILD]: { successor: SUCCESSOR, original: WRAPPER } },
    substitutions: JSON.parse(JSON.stringify(substitutions)) } },
});
const ran = () => new Map([[CHILD, { ok: true, needle: VERDICT, bytes: 400, targets: [SUCCESSOR], moved: [] }]]);
const prove = (s = spec()) => api.successorProof(s, bound(), ran());

test(':147 — the parent gate closure is walked over Git blobs, by require AND by path literal', () => {
  const c = api.parentClosure(PARENT_COMMIT, [WRAPPER]);
  // The wrapper, the module it requires, the module that module requires, and the original
  // named only by a PATH LITERAL — which is how a carrier names the body it compiles.
  for (const f of [WRAPPER, SUPPORT_MOD, REFERENCE, SOURCE, ORACLE]) assert(c.has(f), 'the closure reaches ' + f);
  assert(!c.has(UNREACHED), 'a file nothing reaches is not in the closure');
  // It is GIT's closure at that commit, not the worktree's: a file written now is absent.
  write('rebuild/m4/spec/written-after-the-commit.cjs', "require('./native-carriers-source.cjs');\n");
  assert(!api.parentClosure(PARENT_COMMIT, ['rebuild/m4/spec/written-after-the-commit.cjs']).size);
  fs.rmSync(path.join(scratch, 'rebuild/m4/spec/written-after-the-commit.cjs'));
});

test(':147 — an H3-shaped spec is ADMITTED: three targets, none a parent execution pin', () => {
  // The case BRIEF-H3 v1.6 §9 could not declare. None of the three is in executionPins —
  // the parent pins only its wrappers — and all three are in the gate's own closure.
  const b = bound();
  for (const f of [SOURCE, REFERENCE, SUPPORT_MOD]) assert(!Object.hasOwn(b.acceptance.executionPins, f));
  const proofs = prove();
  const proof = proofs.get(CHILD);
  assert.equal(proof.original, WRAPPER);
  assert.equal(proof.successor, SUCCESSOR);
  assert.equal(proof.verdict, VERDICT);
  assert.equal(proof.substitutions, 0, 'none of the three lands in the wrapper itself');
});

test(':147 — a target OUTSIDE the parent gate closure refuses by name', () => {
  useReview(reviewText + '\n- ' + UNREACHED + '\n  from: ' + FROM_SOURCE + '\n  to:   ' + TO_SOURCE + '\n');
  const s = spec();
  s.coverage.successors.substitutions = [{ original: UNREACHED, from: FROM_SOURCE, to: TO_SOURCE,
    why: 'a file the gate never reaches, however plausible the path looks' }];
  assert.throws(() => prove(s), /SUCCESSOR-SUBSTITUTION-TARGET-NOT-IN-THE-PARENT-GATE-CLOSURE/);
  useReview(reviewText);
});

test(':147 — a private, golden or oracle target refuses, and the roots are not vacuous', () => {
  // The oracle manifest IS in the measured closure, so this refusal is live: without the
  // named exclusion the ruling's "no substitution may reach … goldens" would rest on luck.
  assert(api.parentClosure(PARENT_COMMIT, [WRAPPER]).has(ORACLE));
  const s = spec();
  s.coverage.successors.substitutions = [{ original: ORACLE, from: '{\n  "goldens": {}\n}', to: '{\n  "goldens": {"x":1}\n}',
    why: 'a re-target that reaches the oracle manifest, which :147 forbids by name' }];
  assert.throws(() => prove(s), /SUCCESSOR-SUBSTITUTION-TARGET-IS-A-PROTECTED-SURFACE/);
  for (const p of ['rebuild/conform/private/', 'rebuild/conform/golden/', 'rebuild/conform/goldens/', 'rebuild/conform/oracle/'])
    assert(api.SUBSTITUTION_FORBIDDEN.includes(p), 'the forbidden roots are fixed in the runner: ' + p);
});

test(':147 — the bytes are SHA-ANCHORED to the parent\'s reviewed commit', () => {
  // A closure membership test is worth nothing unless the bytes being substituted are the
  // bytes the parent was accepted on. Move one of them on disk and it refuses.
  const before = fs.readFileSync(path.join(scratch, SOURCE), 'utf8');
  write(SOURCE, before.replace('rows.length + rows.length + rows.length', 'rows.length'));
  assert.throws(() => prove(), /SUCCESSOR-ORIGINAL-NOT-THE-PARENT-ACCEPTANCE-BLOB/);
  write(SOURCE, before);
  assert.equal(prove().get(CHILD).verdict, VERDICT);
});

test(':147 — a substitution missing from the CITED REVIEW refuses', () => {
  // ":113 (1) (c) … enumerated verbatim in the package spec AND IN THE REVIEW". Only the
  // spec half was ever asserted; a review that quotes two of three refuses on the third.
  const partial = reviewText.split(FROM_MOD).join('a paraphrase of the third substitution');
  useReview(partial);
  assert.throws(() => prove(), /SUCCESSOR-SUBSTITUTION-NOT-ENUMERATED-IN-THE-REVIEW/);
  fs.rmSync(path.join(scratch, REVIEW_FILE));
  assert.throws(() => prove(), /SUCCESSOR-REVIEW-FILE-ABSENT/);
  useReview(reviewText);
  assert.equal(prove().get(CHILD).verdict, VERDICT);
});

test('r9 F3 — the cited review is PINNED, committed, and under the reviews directory', () => {
  // r9 read the file off the worktree with no custody test at all: a review the package
  // wrote in its own commit, or edited after the spec was reviewed, was admitted.
  assert.equal(api.REVIEWS_DIR, 'rebuild/lanes/b/reviews/');
  // (a) bytes that are not the pinned bytes — the file moved after the spec cited it.
  const s = spec(); s.coverage.successors.reviewFileSha256 = '0'.repeat(64);
  assert.throws(() => prove(s), /SUCCESSOR-REVIEW-FILE-BYTES-NOT-THE-PINNED-REVIEW/);
  // (b) a review that stands on disk and in the spec's pin, but in nobody's commit.
  const uncommitted = reviewText + '\nA line added after the review was committed.\n';
  write(REVIEW_FILE, uncommitted);
  const drifted = spec(); drifted.coverage.successors.reviewFileSha256 = sha(Buffer.from(uncommitted));
  assert.throws(() => prove(drifted), /SUCCESSOR-REVIEW-FILE-NOT-IN-GIT-AT-HEAD/);
  write(REVIEW_FILE, reviewText);
  // (c) a path outside the reviews directory is refused HERE too, not only in the spec
  // phase — the two functions do not depend on the order they are called in.
  const elsewhere = 'rebuild/lanes/b/BUILD-REPORT-H3.md';
  write(elsewhere, reviewText);
  git('add', '--', elsewhere); git('commit', '--quiet', '--allow-empty', '-m', 'the package own report');
  const own = spec();
  own.coverage.successors.reviewFile = elsewhere;
  own.coverage.successors.reviewFileSha256 = sha(Buffer.from(reviewText));
  assert.throws(() => prove(own), /SUCCESSOR-REVIEW-FILE-NOT-IN-THE-REVIEWS-DIRECTORY/);
  assert.equal(prove().get(CHILD).verdict, VERDICT);
  // NOT proved, and said so in the runner beside the check: that the review's author is not
  // the spec's builder. Nothing in a Git tree records that, and this suite claims it nowhere.
  assert(source.includes('is not machine-checkable here'), 'the runner says which half is not proved');
});

test('r9 C (vi) — a whole-file replacement refuses at RUN phase, not only in spec()', () => {
  // r9 admitted it here and refused it in spec() alone, so the two functions disagreed and
  // the run-phase gate was carried by call order. `from` = the whole parent original.
  const whole = fs.readFileSync(path.join(scratch, SOURCE), 'utf8');
  useReview(reviewText + '\n' + whole + "\n'use strict';\nmodule.exports = {};\n");
  const s = spec();
  s.coverage.successors.substitutions = [{ original: SOURCE, from: whole, to: "'use strict';\nmodule.exports = {};\n",
    why: 'a rewrite of the parent original wearing a substitution name' }];
  assert.throws(() => prove(s), /SUCCESSOR-SUBSTITUTION-IS-A-WHOLE-FILE-REPLACEMENT/);
  useReview(reviewText);
  assert.equal(prove().get(CHILD).verdict, VERDICT);
});

test(':147 — the load floor is measured on the body the wrapper LOADS, not the wrapper', () => {
  // The wrapper carries seven qualifying lines, one short of the floor: under the old rule
  // every B-NTC carrier refused SUCCESSOR-ORIGINAL-TOO-SHORT-TO-PROVE-A-LOAD and no child
  // of B-NTC could ever have declared a successor. It loads a body that carries plenty.
  assert.equal(api.SUCCESSOR_LOAD_FLOOR, 8);
  const wrapperLong = fs.readFileSync(path.join(scratch, WRAPPER), 'utf8')
    .split('\n').map(l => l.trim()).filter(l => l.length >= 40).length;
  assert(wrapperLong < api.SUCCESSOR_LOAD_FLOOR, 'the wrapper itself is below the floor: ' + wrapperLong);
  assert.equal(prove().get(CHILD).verdict, VERDICT, 'and the carrier is admitted on the loaded body');
  // A wrapper whose loaded body is ALSO tiny still refuses — the floor moved, it did not go.
  // Its successor names THAT wrapper, so the refusal is the floor and not the naming rule.
  const THIN_SUCCESSOR = 'rebuild/m4/spec/h3-thin-carriers.cjs';
  const THIN_CHILD_MOD = 'rebuild/m4/spec/h3-thin-successors.cjs';
  write(THIN_CHILD_MOD, ["'use strict';",
    "const ORIGINALS = { 'source-carriers': '" + THIN_WRAPPER + "' };",
    'const SUBSTITUTIONS = [];',
    'module.exports = { run(name) { return ORIGINALS[name] + SUBSTITUTIONS.length; } };', ''].join('\n'));
  write(THIN_SUCCESSOR, ["'use strict';", "require('./h3-thin-successors.cjs').run('source-carriers');", ''].join('\n'));
  const thin = spec();
  thin.product[THIN_SUCCESSOR] = pin(THIN_SUCCESSOR);
  thin.product[THIN_CHILD_MOD] = pin(THIN_CHILD_MOD);
  thin.children = [{ name: CHILD, argv: [THIN_SUCCESSOR], needle: VERDICT }];
  thin.coverage.successors.carriers = { [CHILD]: { successor: THIN_SUCCESSOR, original: THIN_WRAPPER } };
  thin.coverage.successors.substitutions = [];
  const thinRan = new Map([[CHILD, { ok: true, needle: VERDICT, bytes: 400, targets: [THIN_SUCCESSOR], moved: [] }]]);
  assert.throws(() => api.successorProof(thin, bound(), thinRan), /SUCCESSOR-ORIGINAL-TOO-SHORT-TO-PROVE-A-LOAD/);
});

test(':147 — the copy test moved with the floor, so a pasted body still refuses', () => {
  // The floor and the copy test measure the SAME body. A successor that pastes the support
  // module's lines instead of loading it is caught on those lines, not on the wrapper's.
  const before = fs.readFileSync(path.join(scratch, CHILD_MOD), 'utf8');
  const pasted = fs.readFileSync(path.join(scratch, SUPPORT_MOD), 'utf8')
    .split('\n').filter(l => l.trim().length >= 40).slice(0, 3).join('\n');
  write(CHILD_MOD, before.replace("module.exports =", pasted + '\nmodule.exports ='));
  const s = spec(); s.product[CHILD_MOD] = pin(CHILD_MOD);
  assert.throws(() => prove(s), /SUCCESSOR-COPIES-THE-ORIGINAL-INSTEAD-OF-LOADING-IT/);
  write(CHILD_MOD, before);
  assert.equal(prove().get(CHILD).verdict, VERDICT);
});

test('r9 F1 — the floor and the copy test follow the COMPILE EDGE, never a path literal', () => {
  // The whole of F1 in one measurement. The wide closure reaches the oracle manifest and
  // the path-literal original; the COMPILE closure reaches neither, and reaches exactly the
  // module the wrapper requires and what that module requires in turn.
  const wide = api.parentClosure(PARENT_COMMIT, [WRAPPER]);
  const compiled = api.parentClosure(PARENT_COMMIT, [WRAPPER], 'require');
  for (const f of [SUPPORT_MOD, REFERENCE]) assert(compiled.has(f), 'the compile edge reaches ' + f);
  for (const f of [SOURCE, ORACLE]) {
    assert(wide.has(f), 'the wide closure reaches ' + f);
    assert(!compiled.has(f), 'the compile edge does NOT reach ' + f + ' — a path literal is not a load');
  }
  assert(![...compiled.keys()].some(f => f.endsWith('.json')), 'no .json data fixture can ever be the measured body');
});

test('r9 F1 — a successor that pastes the LOADED body refuses, however short that body is', () => {
  // r9's own control, and the defect it proved: a nine-line wrapper whose loaded module is
  // five lines, pasted whole into the successor, came back ADMITTED, because the floor was
  // satisfied by a 7 791-line JSON fixture elsewhere in the closure and the copy test was
  // measured on that same file. The copy test is asked FIRST now: a paste is evidence
  // whatever the length, and "too short to tell" is not an answer to it.
  const PASTE_WRAPPER = 'rebuild/m4/spec/b-ntc-paste-carriers.cjs';
  const PASTE_MOD = 'rebuild/m4/spec/b-ntc-paste-support.cjs';
  const pasteModText = ["'use strict';",
    '// A loaded body of five lines, every one of them long enough to qualify for the floor.',
    'function theOnlyProgrammeThisCarrierEverRuns(rows) { return rows.length + rows.length; }',
    'const THE_PINNED_SUPPORT_OF_RECORD = "rebuild/engine/writers.cjs@the-parent-byte";',
    'module.exports = { run: theOnlyProgrammeThisCarrierEverRuns, THE_PINNED_SUPPORT_OF_RECORD };', ''].join('\n');
  write(PASTE_WRAPPER, wrapperText.replace('./b-ntc-successors.cjs', './b-ntc-paste-support.cjs'));
  write(PASTE_MOD, pasteModText);
  const PASTE_SUCCESSOR = 'rebuild/m4/spec/h3-paste-carriers.cjs';
  const PASTE_CHILD_MOD = 'rebuild/m4/spec/h3-paste-successors.cjs';
  write(PASTE_CHILD_MOD, ["'use strict';",
    "const ORIGINALS = { 'source-carriers': '" + PASTE_WRAPPER + "' };",
    'const SUBSTITUTIONS = [];',
    '// The paste: the loaded module copied in, instead of read and compiled privately.',
    ...pasteModText.split('\n').slice(1, 5),
    'module.exports = { run(name) { return ORIGINALS[name] + SUBSTITUTIONS.length; } };', ''].join('\n'));
  write(PASTE_SUCCESSOR, ["'use strict';", "require('./h3-paste-successors.cjs').run('source-carriers');", ''].join('\n'));
  git('add', '-A'); git('commit', '--quiet', '--allow-empty', '-m', 'the paste control');
  const pasteCommit = git('rev-parse', 'HEAD').trim();
  const b = bound();
  b.reviewedCommit = pasteCommit;
  b.acceptance.executionPins[PASTE_WRAPPER] = at(PASTE_WRAPPER);
  b.acceptance.children = [{ name: CHILD, argv: [PASTE_WRAPPER], needle: VERDICT }];
  const s = spec();
  s.product[PASTE_SUCCESSOR] = pin(PASTE_SUCCESSOR);
  s.product[PASTE_CHILD_MOD] = pin(PASTE_CHILD_MOD);
  s.children = [{ name: CHILD, argv: [PASTE_SUCCESSOR], needle: VERDICT }];
  s.coverage.successors.parentAcceptanceCommit = pasteCommit;
  s.coverage.successors.carriers = { [CHILD]: { successor: PASTE_SUCCESSOR, original: PASTE_WRAPPER } };
  s.coverage.successors.substitutions = [];
  const pasteRan = new Map([[CHILD, { ok: true, needle: VERDICT, bytes: 400, targets: [PASTE_SUCCESSOR], moved: [] }]]);
  assert.throws(() => api.successorProof(s, b, pasteRan), /SUCCESSOR-COPIES-THE-ORIGINAL-INSTEAD-OF-LOADING-IT/);
  // And with the paste removed the SAME carrier refuses on the floor, not on the copy: the
  // five-line body is below it. The two rules measure the same body, in that order.
  write(PASTE_CHILD_MOD, ["'use strict';",
    "const ORIGINALS = { 'source-carriers': '" + PASTE_WRAPPER + "' };",
    'const SUBSTITUTIONS = [];',
    'module.exports = { run(name) { return ORIGINALS[name] + SUBSTITUTIONS.length; } };', ''].join('\n'));
  s.product[PASTE_CHILD_MOD] = pin(PASTE_CHILD_MOD);
  assert.throws(() => api.successorProof(s, b, pasteRan), /SUCCESSOR-ORIGINAL-TOO-SHORT-TO-PROVE-A-LOAD/);
});

test('r9 F5 — the four SPEC-PHASE refusals of the successor block, measured directly', () => {
  // r9 shipped these inside spec(), which reads the package file off disk and validates
  // forty other things first, so no suite could reach them. They are one named function now.
  const closed = spec(); delete closed.coverage.successors.reviewFileSha256;
  assert.throws(() => api.successorSpecShape(closed), /SUCCESSOR-BLOCK-KEYS-NOT-CLOSED/);
  const outside = spec();
  outside.coverage.successors.substitutions = [{ original: 'rebuild/engine/writers.cjs', from: FROM_SOURCE, to: TO_SOURCE,
    why: 'the engine under test is not the parent gate programme' }];
  assert.throws(() => api.successorSpecShape(outside), /SUCCESSOR-SUBSTITUTION-TARGET-SHAPE/);
  const golden = spec();
  golden.coverage.successors.substitutions = [{ original: ORACLE, from: FROM_SOURCE, to: TO_SOURCE,
    why: 'a substitution that reaches a golden the ruling excludes by name' }];
  assert.throws(() => api.successorSpecShape(golden), /SUCCESSOR-SUBSTITUTION-TARGET-IS-A-PROTECTED-SURFACE/);
  // The review shape and its pin stand after the substitution loop, so an empty list reaches
  // them — and an empty list is also the positive control for everything above.
  const empty = spec(); empty.coverage.successors.substitutions = [];
  api.successorSpecShape(empty);
  const report = spec(); report.coverage.successors.substitutions = [];
  report.coverage.successors.reviewFile = 'rebuild/lanes/b/BUILD-REPORT-H3.md';
  assert.throws(() => api.successorSpecShape(report), /SUCCESSOR-REVIEW-FILE-SHAPE/);
  const unpinned = spec(); unpinned.coverage.successors.substitutions = [];
  unpinned.coverage.successors.reviewFileSha256 = 'not-a-sha';
  assert.throws(() => api.successorSpecShape(unpinned), /SUCCESSOR-REVIEW-FILE-SHA256-SHAPE/);
  // A spec with no successor block at all passes through it untouched — five of the seven.
  api.successorSpecShape({ coverage: { successors: null } });
});

test(':147 — every new refusal carries a name in the vocabulary', () => {
  for (const code of ['SUCCESSOR-SUBSTITUTION-TARGET-NOT-IN-THE-PARENT-GATE-CLOSURE',
    'SUCCESSOR-SUBSTITUTION-TARGET-IS-A-PROTECTED-SURFACE', 'SUCCESSOR-SUBSTITUTION-NOT-ENUMERATED-IN-THE-REVIEW',
    'SUCCESSOR-REVIEW-FILE-ABSENT', 'SUCCESSOR-REVIEW-FILE-SHAPE', 'SUCCESSOR-ORIGINAL-TOO-SHORT-TO-PROVE-A-LOAD',
    'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-ACCEPTANCE-BLOB',
    // TOOLING-REVIEW-r9's five new ones, F3/F4/C (vi).
    'SUCCESSOR-REVIEW-FILE-BYTES-NOT-THE-PINNED-REVIEW', 'SUCCESSOR-REVIEW-FILE-NOT-IN-GIT-AT-HEAD',
    'SUCCESSOR-REVIEW-FILE-NOT-IN-THE-REVIEWS-DIRECTORY', 'SUCCESSOR-REVIEW-FILE-SHA256-SHAPE',
    'SUCCESSOR-SUBSTITUTION-IS-A-WHOLE-FILE-REPLACEMENT', 'SPEC-SOURCE-BASE-NOT-A-COMMIT',
    'SPEC-SOURCE-BASE-SHAPE', 'PARENT-ARTIFACT-BYTES'])
    assert(api.FAIL_CODES.has(code), 'the vocabulary carries ' + code);
});
