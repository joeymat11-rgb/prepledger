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
    '\nmodule.exports={parentClosure,successorProof,SUCCESSOR_LOAD_FLOOR,SUBSTITUTION_FORBIDDEN,FAIL_CODES,' +
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
    support: SUPPORT, wrapper: null, reviewFile: REVIEW_FILE,
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
  const s = spec();
  s.coverage.successors.substitutions = [{ original: UNREACHED, from: FROM_SOURCE, to: TO_SOURCE,
    why: 'a file the gate never reaches, however plausible the path looks' }];
  write(REVIEW_FILE, reviewText + '\n- ' + UNREACHED + '\n  from: ' + FROM_SOURCE + '\n  to:   ' + TO_SOURCE + '\n');
  assert.throws(() => prove(s), /SUCCESSOR-SUBSTITUTION-TARGET-NOT-IN-THE-PARENT-GATE-CLOSURE/);
  write(REVIEW_FILE, reviewText);
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
  write(REVIEW_FILE, partial);
  assert.throws(() => prove(), /SUCCESSOR-SUBSTITUTION-NOT-ENUMERATED-IN-THE-REVIEW/);
  fs.rmSync(path.join(scratch, REVIEW_FILE));
  assert.throws(() => prove(), /SUCCESSOR-REVIEW-FILE-ABSENT/);
  write(REVIEW_FILE, reviewText);
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

test(':147 — every new refusal carries a name in the vocabulary', () => {
  for (const code of ['SUCCESSOR-SUBSTITUTION-TARGET-NOT-IN-THE-PARENT-GATE-CLOSURE',
    'SUCCESSOR-SUBSTITUTION-TARGET-IS-A-PROTECTED-SURFACE', 'SUCCESSOR-SUBSTITUTION-NOT-ENUMERATED-IN-THE-REVIEW',
    'SUCCESSOR-REVIEW-FILE-ABSENT', 'SUCCESSOR-REVIEW-FILE-SHAPE', 'SUCCESSOR-ORIGINAL-TOO-SHORT-TO-PROVE-A-LOAD',
    'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-ACCEPTANCE-BLOB'])
    assert(api.FAIL_CODES.has(code), 'the vocabulary carries ' + code);
});
