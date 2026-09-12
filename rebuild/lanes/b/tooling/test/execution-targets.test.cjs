'use strict';
// Focused component regressions: compile the REAL runner before its main campaign,
// changing only its filesystem root by its module location. Original dependencies
// load from the real checkout. Children run real Node processes in an isolated tree.
// No accepted artifact, receipt, Git ref, private input or source function is forged.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const Module = require('node:module');
const crypto = require('node:crypto');
const sourceRoot = path.resolve(__dirname, '../../../../..');
const runnerRel = 'rebuild/lanes/b/tooling/b-package.cjs';
const source = fs.readFileSync(path.join(sourceRoot, runnerRel), 'utf8');
const delimiter = '// ------------------------------------------------------------------ 8. main sequence';
assert.equal(source.split(delimiter).length, 2, 'one real campaign boundary');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-tooling-argv-'));
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}
write(runnerRel, source);
write('rebuild/conform/v4/postfix/run.cjs', fs.readFileSync(path.join(sourceRoot, 'rebuild/conform/v4/postfix/run.cjs')));
// TOOLING-REVIEW r6 change 6: FAIL_CODES now harvests the originals' own closed refusal
// codes by READING these modules off disk (not by requiring them), so the fixture carries
// their real bytes exactly as it already carries run.cjs. Copies, never re-typed.
for (const original of ['rebuild/conform/v4/postfix/target.cjs', 'rebuild/conform/v4/postfix/legacy-gates.cjs',
  'rebuild/conform/v4/postfix/strict-json.cjs', 'rebuild/m4/spec/native-carriers-errors.cjs',
  'rebuild/m4/spec/load-write-reference.cjs'])
  write(original, fs.readFileSync(path.join(sourceRoot, original)));
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
  m._compile(source.slice(0, source.indexOf(delimiter)) + '\nmodule.exports={childArgv,ownChildren,children,coverage,product,noRegister,proposed,init(){logDir=root;specRaw=Buffer.from("{}");},MOVES_RULING};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
api.init();
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(scratch, file))).digest('hex');
const pass = 'rebuild/m4/spec/probe-pass.cjs';
const good = 'rebuild/m4/spec/probe-own.cjs';
const fail = 'rebuild/m4/spec/probe-fail.cjs';
write(pass, 'console.log("PROBE PASS\\n" + "x".repeat(240));');
write(good, 'console.log("OWN PASS\\n" + "y".repeat(240));');
write(fail, 'throw new Error("SECOND TARGET EXECUTED");');
const child = (argv, name = 'probe-child', needle = 'PROBE PASS') => ({ name, argv, needle });
const packageFor = c => ({ children: [c], product: { [good]: { role: 'new', pre: sha(good), post: null } }, coverage: { inherited: {}, moves: {}, successors: null, superseded: null } });
const env = { ...process.env, NODE_OPTIONS: '', NODE_V8_COVERAGE: '' };
delete env.NODE_TEST_CONTEXT; // The outer node:test worker is not the package runner's environment.
const execute = c => api.children(packageFor(c), env);
const targets = argv => api.childArgv(child(argv));
const sealStart = source.indexOf('  const own = NO_REGISTER_IDS.has(ID) ? ownChildren(s) : [];', source.indexOf('function envelope('));
const sealEnd = source.indexOf('  assert(s.authorizations.theme', sealStart);
assert(sealStart > 0 && sealEnd > sealStart);
// The exact existing seal requirement, with no accepted envelope constructed.
const sealBlock = new Function('assert', 'NO_REGISTER_IDS', 'ID', 'ownChildren', 'MIN_OWN_CHILDREN', 's', 'ran', source.slice(sealStart, sealEnd));
const seal = (s, ran) => sealBlock(assert, new Set(['B-NTC', 'B-LOM']), 'B-NTC', api.ownChildren, 1, s, ran);

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(resolved, path.resolve(scratch));
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-tooling-argv-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

test('bare first-pass / second-throw argv refuses before own or inherited evidence', () => {
  const c = child([pass, fail]);
  assert.throws(() => targets(c.argv), /CHILD-ARGV-BARE-SCRIPT-ARGUMENTS/);
  const s = packageFor(c); s.product[fail] = { pre: sha(fail), post: null, role: 'new' };
  assert.throws(() => api.ownChildren(s), /CHILD-ARGV-BARE-SCRIPT-ARGUMENTS/);
  assert.throws(() => api.children(s, env), /CHILD-ARGV-BARE-SCRIPT-ARGUMENTS/);
  assert.throws(() => seal(s, new Map()), /CHILD-ARGV-BARE-SCRIPT-ARGUMENTS/);
});
test('direct own execution passes, missing execution and throwing execution refuse', () => {
  const c = child([good], 'own-pass', 'OWN PASS'); const s = packageFor(c);
  const ran = api.children(s, env);
  assert.deepEqual(ran.get(c.name).targets, [good]);
  assert.equal(api.ownChildren(s).length, 1);
  api.noRegister(s, ran); seal(s, ran);
  assert.throws(() => seal(s, new Map()), /OWN-CHILD-DID-NOT-EXECUTE/);
  const noOwn = packageFor(child([pass]));
  assert.throws(() => seal(noOwn, new Map()), /SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT/);
  assert.throws(() => execute(child([fail])), /Required child/);
});
test('Node --test executes both good targets and fails a throwing second target', () => {
  const c = child(['--test', '--test-reporter=tap', pass, good], 'multi-good', 'TAP version 13');
  const ran = execute(c);
  assert.deepEqual(ran.get(c.name).targets, [pass, good]);
  assert.match(fs.readFileSync(path.join(scratch, c.name + '.log'), 'utf8'), /OWN PASS/);
  assert.throws(() => execute(child(['--test', pass, fail], 'multi-fail', 'TAP version 13')), /Required child/);
  assert.match(fs.readFileSync(path.join(scratch, 'multi-fail.log'), 'utf8'), /SECOND TARGET EXECUTED/);
});
test('inherited pinned original cannot become a trailing application argument', () => {
  const c = child([pass, good]);
  const s = packageFor(c); s.coverage.inherited = { example: c.name };
  const bound = { option: { id: 'CONTROL' }, acceptance: { product: {}, executionPins: { [good]: sha(good) }, coverage: { byChild: s.coverage.inherited } } };
  assert.throws(() => api.coverage(s, bound, api.children(s, env)), /CHILD-ARGV-BARE-SCRIPT-ARGUMENTS/);
  // TOOLING-REVIEW-r5 Z8 / r2 R8. This case used to read the REAL packages/B-NTC.json and
  // assert `children.length === 5`. That number is a property of one branch — the spec
  // declares 5 on rebuild/lane-b-tooling and 15 on rebuild/lane-b-ntc — so the suite was
  // 9/9 here and 8/9 there for a reason that has nothing to do with the rule under test.
  // The rule under test is: an inherited pinned original must not be reachable only as a
  // trailing application argument. So the map is BUILT here, the way every other case in
  // this file builds its inputs, and the suite is deterministic on any single branch.
  const fixture = { children: [], coverage: { inherited: {}, moves: {}, successors: null, superseded: null }, product: {} };
  const carriers = ['source-carriers', 'inherited-carriers', 'defect-witnesses', 'writers-differential', 'second-gate'];
  const gatesOf = { 'source-carriers': ['migrate-source', 'merge-source', 'writers-source'],
    'inherited-carriers': ['witnesses-2', 'witnesses-5', 'migrate-differential'],
    'defect-witnesses': ['witnesses-7'], 'writers-differential': ['writers-differential'], 'second-gate': ['second-gate'] };
  for (const name of carriers) {
    const file = 'rebuild/m4/spec/probe-' + name + '.cjs';
    write(file, 'throw new Error("INHERITED ORIGINAL EXECUTED");');
    fixture.children.push({ name, argv: [file], needle: 'NATIVE ' + name.toUpperCase() + ':' });
    for (const g of gatesOf[name]) fixture.coverage.inherited[g] = name;
  }
  assert.equal(Object.keys(fixture.coverage.inherited).length, 9);
  assert.equal(fixture.children.length, carriers.length);
  for (const original of fixture.children) {
    const forged = { ...original, argv: [pass, ...original.argv.filter(a => !a.startsWith('-'))], needle: 'PROBE PASS' };
    assert.throws(() => api.children({ ...fixture, children: [forged] }, env), /CHILD-ARGV-BARE-SCRIPT-ARGUMENTS/);
  }
  // Real parent-pinned execution still establishes the unchanged coverage rule.
  const direct = child([good], 'inherited-good', 'OWN PASS'); s.children = [direct];
  s.coverage.inherited = { example: direct.name }; bound.acceptance.coverage.byChild = s.coverage.inherited;
  assert.equal(api.coverage(s, bound, api.children(s, env)).size, 1);
});
test('proposed execution pins share the validated executed-target definition', () => {
  const c = child(['--test', pass, good], 'pin-good', 'TAP version 13');
  const s = packageFor(c); s.brief = { file: 'missing-public-brief.md' };
  const bound = { option: {}, acceptance: {} };
  const proposed = api.proposed(s, bound);
  assert.equal(proposed.executionPins[pass], sha(pass));
  assert.equal(proposed.executionPins[good], sha(good));
  s.children = [child([pass, good])];
  assert.throws(() => api.proposed(s, bound), /CHILD-ARGV-BARE-SCRIPT-ARGUMENTS/);
});
test('parent product roles carried/edited admitted; new/superseded/wrong pre refuse', () => {
  const pin = { pre: sha(good), post: sha(good), role: 'carried' };
  const s = { product: { [good]: pin } };
  const bound = { acceptance: { product: { [good]: sha(good) }, executionPins: {} } };
  api.product(s, bound);
  // r6 change 5 (F4): `edited` declares a CHANGE, so pre === post is refused for it — an
  // untouched parent pin can no longer read as a satisfied product claim. `carried` above
  // is pre === post by definition and is untouched.
  pin.role = 'edited'; assert.throws(() => api.product(s, bound), /PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE/);
  pin.post = '1'.repeat(64); api.product(s, bound);
  pin.role = 'new'; assert.throws(() => api.product(s, bound), /PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED/);
  pin.role = 'superseded-by-child'; assert.throws(() => api.product(s, bound), /PRODUCT-ROLE-MISLABELLED|PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED/);
  pin.role = 'edited'; pin.pre = '0'.repeat(64);
  assert.throws(() => api.product(s, bound), /pre-image is not the parent pin/);
});
test('parent execution role requires superseded and exact pre; genuinely new passes', () => {
  const pin = { pre: sha(good), post: '1'.repeat(64), role: 'superseded-by-child' };
  const s = { product: { [good]: pin } };
  const bound = { acceptance: { product: {}, executionPins: { [good]: sha(good) } } };
  api.product(s, bound);
  // r6 change 5 (F4): the supersession of a parent EXECUTION pin declares a change too, so
  // an untouched pin declared pre === post refuses instead of counting as produced.
  pin.post = pin.pre; assert.throws(() => api.product(s, bound), /PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE/);
  pin.post = '1'.repeat(64);
  for (const role of ['new', 'carried', 'edited']) {
    pin.role = role; assert.throws(() => api.product(s, bound), /PARENT-EXECUTION-PIN-NOT-DECLARED-SUPERSEDED/);
  }
  pin.role = 'superseded-by-child'; pin.pre = '0'.repeat(64);
  assert.throws(() => api.product(s, bound), /pre-image is not the parent execution pin/);
  pin.role = 'new'; pin.pre = sha(good); bound.acceptance.executionPins = {};
  api.product(s, bound);
});
test('two exact new roots execute real tests; adjacent and foreign roots refuse', () => {
  for (const file of ['rebuild/m3/w6/host/test/probe.test.mjs', 'rebuild/m3/w7-preview/today/test/probe.test.mjs']) {
    write(file, 'console.log("ROOT PASS\\n" + "z".repeat(240));');
    assert.deepEqual(targets(['--test', file]), [file]);
    execute(child(['--test', '--test-reporter=tap', file], 'root-good', 'TAP version 13'));
  }
  for (const file of ['rebuild/m3/w6/host/probe.cjs', 'rebuild/m3/w7-preview/today/probe.cjs', 'rebuild/lanes/b/tooling/probe.cjs']) {
    write(file, 'console.log("SHOULD NOT RUN");');
    assert.throws(() => targets([file]), /CHILD-ARGV-TARGET/);
  }
});
test('path, extension, option and positional controls remain closed', () => {
  for (const file of ['rebuild/m4/spec/probe.txt', 'rebuild/m4/spec/nested/../probe-own.cjs']) {
    if (!file.includes('..')) write(file, 'console.log("not an executable target");');
    assert.throws(() => targets([file]), /CHILD-ARGV-TARGET/);
  }
  for (const argv of [[path.join(scratch, good)], ['--eval=1', good], ['--version', good], ['--require', good], ['--test-only', good], ['--', good], [good, '--test'], ['--test'], ['--test-reporter=tap', good], ['--test', '--test', good], ['--test', '--test-reporter=tap', '--test-reporter=tap', good]])
    assert.throws(() => targets(argv), /CHILD-ARGV-/);
  assert.equal(api.MOVES_RULING, null);
});
