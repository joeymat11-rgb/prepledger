'use strict';
// LANE B — TOOLING-REVIEW r7, the four changes that are decidable without a Git fixture:
// F1 the "pinned-unchanged" product role and what role "new" now means, F2 change 4's
// branch (B) matched against the RULING'S OWN enumerated descriptions instead of a
// basename token, F3 the refusal names the three bare asserts now carry, and F6 the IDS
// order. Each case states what r7 MEASURED and re-measures it here.
//
// Method is the house one: compile the REAL runner, changing only its filesystem root by
// its module location. Nothing of the real repository is read, written or moved; the
// ruling text used below is a fixture of the ruling's own SHAPE carrying the two
// descriptions DECISIONS:113 (c) writes, quoted from the public ledger line.
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
const sha = buf => crypto.createHash('sha256').update(buf).digest('hex');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-r7-roles-'));
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  return text;
}
// The immutable originals the runner requires at load, and the six modules FAIL_CODES
// harvests the originals' own closed refusal codes out of. Real bytes, never re-typed.
for (const original of ['rebuild/conform/v4/postfix/run.cjs', 'rebuild/conform/v4/postfix/target.cjs',
  'rebuild/conform/v4/postfix/legacy-gates.cjs', 'rebuild/conform/v4/postfix/strict-json.cjs',
  'rebuild/m4/spec/native-carriers-errors.cjs', 'rebuild/m4/spec/load-write-reference.cjs'])
  write(original, fs.readFileSync(path.join(sourceRoot, original)));
write(runnerRel, source);

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
  m._compile(source.slice(0, source.indexOf(delimiter)) +
    '\nmodule.exports={product,describes,ruledDescriptions,failCode,FAIL_CODES,IDS,PRODUCT_ROLES,NO_REGISTER_IDS,' +
    'init(){logDir=root;specRaw=Buffer.from("{}");}};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
api.init();

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-r7-roles-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

// ------------------------------------------------------------ F1. the product roles
const OWN = 'rebuild/m4/spec/fixture-r7-own.cjs';
write(OWN, 'console.log("this package runs it and changes nothing");\n');
const at = f => sha(fs.readFileSync(path.join(scratch, f)));
const noParent = null;
const unsealed = undefined;

test('F1 — role "new" with pre === post refuses when the artifact is UNSEALED', () => {
  // r7 F1, measured on the sealed spec: 7 of B-NTC's 31 `new` files carry pre === post and
  // stand at their own sourceBase bytes, so 7 of "33 at the declared post-image" are files
  // the package did not write. r6 exempted the role outright; this is the exemption closed.
  const s = { product: { [OWN]: { pre: at(OWN), post: at(OWN), role: 'new' } } };
  assert.throws(() => api.product(s, noParent, unsealed), /PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE/);
  // And the two roles r6 already refused are refused on exactly the same line.
  for (const role of ['edited', 'superseded-by-child']) {
    const t = { product: { [OWN]: { pre: at(OWN), post: at(OWN), role } } };
    assert.throws(() => api.product(t, noParent, unsealed), /PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE/);
  }
});

test('F1 — the SEALED artifact grandfathers its own exact declaration, and nothing else', () => {
  // The bound the task set: the role is available to NEW specs, and an existing spec
  // declaring role "new" with pre === post is refused ONLY while its artifact is unsealed.
  // A sealed artifact that carries this file, this role and these two shas keeps it —
  // refusing retroactively would make an accepted package unrunnable without improving the
  // run that sealed it. Everything else about the sealed artifact is ignored.
  const pin = { pre: at(OWN), post: at(OWN), role: 'new' };
  const s = { product: { [OWN]: { ...pin } } };
  assert.equal(api.product(s, noParent, { product: { [OWN]: { ...pin } } }), 'IMPLEMENTED');
  // A sealed artifact that does not carry the file, carries a different role, or carries
  // different shas grandfathers nothing.
  assert.throws(() => api.product(s, noParent, { product: {} }), /PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE/);
  assert.throws(() => api.product(s, noParent, { product: { [OWN]: { ...pin, role: 'edited' } } }), /PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE/);
  assert.throws(() => api.product(s, noParent, { product: { [OWN]: { ...pin, post: '0'.repeat(64) } } }), /PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE/);
  // The grandfathered file is reported, non-blockingly, and still counts at its post-image.
  assert.equal(api.product(s, noParent, { product: { [OWN]: { ...pin } } }), 'IMPLEMENTED');
});

test('F1 — "pinned-unchanged" is the honest role, and it is bounded three ways', () => {
  const s = { product: { [OWN]: { pre: at(OWN), post: at(OWN), role: 'pinned-unchanged' } } };
  assert.equal(api.product(s, noParent, unsealed), 'IMPLEMENTED');
  assert(api.PRODUCT_ROLES.includes('pinned-unchanged') && api.PRODUCT_ROLES.length === 5);
  // (1) the bytes must not have moved,
  const moved = { product: { [OWN]: { pre: '1'.repeat(64), post: '1'.repeat(64), role: 'pinned-unchanged' } } };
  assert.throws(() => api.product(moved, noParent, unsealed), /PRODUCT-PINNED-UNCHANGED-BYTES-MOVED/);
  // (2) the file must not be parent-pinned — a parent PRODUCT pin unchanged is `carried`,
  const asProduct = { acceptance: { product: { [OWN]: at(OWN) }, executionPins: {} } };
  assert.throws(() => api.product(s, asProduct, unsealed), /PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED|PRODUCT-PINNED-UNCHANGED-IS-A-PARENT-PIN/);
  // a parent EXECUTION pin superseded is `superseded-by-child`,
  const asExecution = { acceptance: { product: {}, executionPins: { [OWN]: at(OWN) } } };
  assert.throws(() => api.product(s, asExecution, unsealed), /PARENT-EXECUTION-PIN-NOT-DECLARED-SUPERSEDED|PRODUCT-PINNED-UNCHANGED-IS-A-PARENT-PIN/);
  // (3) and it is counted in its OWN bucket, never among "at the declared post-image":
  // a package whose whole inventory is pinned-unchanged plus one unwritten new file is
  // PARTIAL, not IMPLEMENTED — the unchanged file satisfies its own declaration and
  // produces nothing, and the phase still reads over what is genuinely outstanding.
  const partial = { product: {
    [OWN]: { pre: at(OWN), post: at(OWN), role: 'pinned-unchanged' },
    'rebuild/m4/spec/fixture-r7-absent.cjs': { pre: null, post: null, role: 'new' },
  } };
  assert.equal(api.product(partial, noParent, unsealed), 'PARTIAL');
});

test('F1 — pre: null is role "new" only, and an absent file is still at the pre-image', () => {
  // The other half of "pre === null or pre !== post": a file that did not exist at
  // sourceBase says so, and only the role that WRITES a file may say it.
  const absent = 'rebuild/m4/spec/fixture-r7-absent.cjs';
  assert.equal(api.product({ product: { [absent]: { pre: null, post: null, role: 'new' } } }, noParent, unsealed), 'NOT-IMPLEMENTED');
  // A file declared as not existing that DOES exist is unlisted drift, exactly as before.
  assert.throws(() => api.product({ product: { [OWN]: { pre: null, post: '0'.repeat(64), role: 'new' } } }, noParent, unsealed), /UNLISTED-PRODUCT-DRIFT/);
});

// --------------------------------------------- F2. the ruling's own enumerated descriptions
// The ruling's shape, with the two descriptions DECISIONS:113 (c) writes, quoted.
const RULING = 'MOVES_RULING B-NTC-INHERITED-1 RATIFIED AS WRITTEN: the only text substitution permitted is a pin ' +
  're-target made necessary by a declared superseded-by-child product path, every such substitution enumerated verbatim ' +
  'in the package spec and in the review (two at 71fb2f1: the witnesses exposed-surface deepEqual and the cases ' +
  'mutant-detector target). A cumulative-profile supersession, not a coverage move.';
const WITNESSES = 'rebuild/m4/spec/native-carriers-witnesses.cjs';
const CASES = 'rebuild/m4/spec/native-carriers-cases.cjs';
const PROFILE = 'rebuild/m4/spec/native-carriers-profile.cjs';
const paths = [WITNESSES, CASES, PROFILE, 'rebuild/m4/spec/b-ntc-witnesses.cjs', 'rebuild/m4/spec/b-ntc-cases.cjs'];
// r6's own branch-(B) predicate, re-stated here so the tightening is MEASURED and not
// asserted: the last hyphen segment of the basename anywhere in the ruling, plus any
// six-letter word of the ruling anywhere in the substitution text.
const r6Admits = sub => {
  const low = RULING.toLowerCase(), token = path.posix.basename(sub.original, '.cjs').split('-').pop();
  const text = (sub.from + '\n' + sub.to).toLowerCase();
  const echoed = (low.match(/[a-z][a-z0-9]{5,}/g) || []).filter(w => w !== token && text.includes(w));
  return token.length >= 4 && low.includes(token) && echoed.length > 0;
};
const subs = {
  witnesses: { original: WITNESSES, from: 'assert.deepEqual(exposedSurface(rows), PINNED_SURFACE);',
    to: 'assert.deepEqual(exposedSurface(rows), CHILD_SURFACE);', why: 'the exposed surface deepEqual re-targets' },
  cases: { original: CASES, from: 'const target = MUTANT_DETECTOR_TARGET_OF_RECORD;',
    to: 'const target = CHILD_MUTANT_DETECTOR_TARGET;', why: 'the mutant-detector target re-targets' },
  profile: { original: PROFILE, from: 'const ordering = PRODUCT_PROFILE_ORDERING_OF_RECORD;',
    to: 'const ordering = CHILD_PRODUCT_PROFILE_ORDERING;', why: 'an ordering change the ruling does not describe' },
};

test('F2 — the ruling enumerates two, and describes() admits exactly those two', () => {
  const descriptions = api.ruledDescriptions(RULING);
  assert.deepEqual(descriptions, ['the witnesses exposed-surface deepEqual', 'the cases mutant-detector target']);
  assert(api.describes(descriptions[0], subs.witnesses, paths), 'the witnesses description matches its substitution');
  assert(api.describes(descriptions[1], subs.cases, paths), 'the cases description matches its substitution');
  // Neither description matches the OTHER substitution, so the descriptions cannot be
  // consumed by the wrong one and the pairing is not an accident of word frequency.
  assert(!api.describes(descriptions[0], subs.cases, paths));
  assert(!api.describes(descriptions[1], subs.witnesses, paths));
});

test('F2 — an unratified third substitution is refused, and r6 would have admitted it', () => {
  const descriptions = api.ruledDescriptions(RULING);
  for (const d of descriptions) assert(!api.describes(d, subs.profile, paths), 'no description describes the profile change');
  // The tightening, measured: r6's predicate admits it — "profile" stands in the ruling
  // line and "substitution"/"permitted" echo freely — and r7's does not.
  assert.equal(r6Admits(subs.profile), true, 'r6 branch (B) admitted this substitution');
  // And r6 admitted the two real ones too, so the change removes only the unratified case.
  assert.equal(r6Admits(subs.witnesses), true);
  assert.equal(r6Admits(subs.cases), true);
});

test('F2 — a word that only names a PATH does not describe a change', () => {
  // "the witnesses exposed-surface deepEqual": `witnesses` stands in the module path, so it
  // says WHERE. At least one significant word must stand in the substitution TEXT and in no
  // path, or the description has not described anything.
  const namesOnlyThePath = { original: WITNESSES, from: 'const carrier = "native-carriers-witnesses";',
    to: 'const carrier = "b-ntc-witnesses";', why: 'a path rename and nothing else' };
  assert(!api.describes('the witnesses exposed-surface deepEqual', namesOnlyThePath, paths));
});

test('F2 — a ruling text that enumerates nothing refuses rather than admitting anything', () => {
  assert.throws(() => api.ruledDescriptions('MOVES_RULING B-NTC-INHERITED-1 RATIFIED AS WRITTEN, with no enumeration at all'),
    /SUCCESSOR-RULING-ENUMERATES-NO-SUBSTITUTION/);
});

// ------------------------------------------------- F3 and F6. names, and the ruled order
test('F3 — the four refusals r7 fired bare now carry names in the vocabulary', () => {
  for (const code of ['PARENT-RECEIPT-BASE-NOT-ON-THE-CHAIN-BRANCH', 'THEME-LINE-DOES-NOT-BIND-THIS-PACKAGE-ID',
    'COVERAGE-GATE-IS-NOT-AN-ORIGINAL-GATE', 'COVERAGE-GATE-BOTH-INHERITED-AND-MOVED',
    'PRODUCT-PINNED-UNCHANGED-IS-NOT-EXECUTED-BY-A-DECLARED-CHILD', 'SUCCESSOR-RULING-LINE-IS-NOT-THE-RULING',
    'PRODUCT-PINNED-UNCHANGED-BYTES-MOVED', 'PRODUCT-PINNED-UNCHANGED-IS-A-PARENT-PIN']) {
    assert(api.FAIL_CODES.has(code), 'the vocabulary carries ' + code);
    assert.equal(api.failCode(code + ' and then whatever the assertion said'), code);
  }
  // And the promise the vocabulary makes is unchanged: a token that is not already a name
  // in the runner is never printed, so no message an input shapes can leave this process.
  assert.equal(api.failCode('SOMETHING-AN-INPUT-SHAPED value'), null);
});

test('F6 — IDS carries the order DECISIONS:124 rules', () => {
  assert.deepEqual(api.IDS, ['B-NTC', 'H3', 'B1', 'B2', 'B4', 'B3', 'B-LOM']);
  // ":124 — ORDER B-NTC → H3 → B1 → B2 → B4 → B3". B-LOM is in no ruled sequence and
  // stands after the ruled six rather than inside them.
  assert.deepEqual(api.IDS.slice(0, 6), ['B-NTC', 'H3', 'B1', 'B2', 'B4', 'B3']);
  assert.equal(api.IDS[6], 'B-LOM');
  // The no-register rule, as it stands in this commit: every member is either an H-/F-
  // engine-tier item or a B- id the PM ruled exempt by name. The set itself is widened in
  // its own commit; what is asserted here is the RULE, which cannot be widened by a spec.
  for (const id of api.NO_REGISTER_IDS) assert(/^[HF][0-9]+$/.test(id) || id === 'B-NTC' || id === 'B-LOM');
  for (const id of api.NO_REGISTER_IDS) assert(api.IDS.includes(id));
});
