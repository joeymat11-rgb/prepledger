'use strict';
// LANE B — the two SELF-CLEARING corrections of the r5 follow-up pass, each with the
// controls that say what did NOT change. Both were raised by lane B against its own
// package in FIX-REPORT-B-NTC-r2.md §4.1/§4.2, and both of them clear an obligation that
// was blocking lane B's own `--ci`. **r6 should judge these two before anything else in
// the pass**, which is why they are one distinct commit with this suite beside them.
//
//   1. `product()` asks "is the file at its declared POST-image?" before "is it at its
//      pre-image?". A file a package declares and pins but does not change carries
//      `pre === post`; it was counted as "still at the pinned pre-image" for ever, so
//      PRODUCT could never leave PARTIAL. Cases (a), (b), (c) below.
//   2. `authority()` resolved the package's OWN theme and brief-acceptance lines at its
//      PARENT's receipt base. Those lines are written after the parent was sealed, so they
//      could never be found there — no child's brief could be accepted before its own seal.
//      They now resolve on CHAIN_REF. Cases (d), (e), (f) below.
//
// Method is the house one: compile the REAL runner, changing only its filesystem root by
// its module location, and for the ledger cases one further constant — asserted below to be
// the ONLY line that differs — pointed at a Git repository this test builds itself. No
// accepted artifact, no receipt, no ref of the real repository and no private input is
// forged, read or moved.
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
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-phase-ledger-'));
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  return text;
}
const git = (...argv) => cp.execFileSync('git', argv, { cwd: scratch, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

// ---------------------------------------------------------------- the fixture repository
// A DECISIONS.md of this fixture's own, carrying an owner line, a contract line, and the
// two lines a child package needs. The bullets are shaped exactly as the real ledger's are,
// because verifyReceipt matches ' · <role> · ' and the exact line bytes.
const OWNER_LINE = '- 2026-09-06 · owner · M2-RULE - the fixture owner ruling, shaped as the real one is · M2-RULE DONE';
const CONTRACT_LINE = '- 2026-09-07 · cowork · POSTFIX-GATE BRIEF accepted for the fixture parent · ACCEPTED';
const PACKAGE_ID = 'M2-FIXTURE-CHILD-PROVIDER';
const BRIEF = 'rebuild/lanes/b/BRIEF-FIXTURE.md';
const THEME_LINE = '- 2026-09-11 · cowork · THEME for ' + PACKAGE_ID + ' · ACCEPTED';
const ACCEPT_LINE = '- 2026-09-11 · cowork · BRIEF ACCEPTED for ' + PACKAGE_ID + ' at ' + BRIEF + ' · ACCEPTED';

write('rebuild/DECISIONS.md', [OWNER_LINE, CONTRACT_LINE, ''].join('\n'));
write('rebuild/conform/v4/postfix/run.cjs', fs.readFileSync(path.join(sourceRoot, 'rebuild/conform/v4/postfix/run.cjs')));
// TOOLING-REVIEW r6 change 6: FAIL_CODES harvests the originals' own closed refusal codes
// by READING these modules off disk, so the fixture carries their real bytes as it already
// carries run.cjs. Copies, never re-typed.
for (const original of ['rebuild/conform/v4/postfix/target.cjs', 'rebuild/conform/v4/postfix/legacy-gates.cjs',
  'rebuild/conform/v4/postfix/strict-json.cjs', 'rebuild/m4/spec/native-carriers-errors.cjs',
  'rebuild/m4/spec/load-write-reference.cjs'])
  write(original, fs.readFileSync(path.join(sourceRoot, original)));
git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 'fixer5@earned.local');
git('config', 'user.name', 'lane-b-fixer5');
git('add', '-A'); git('commit', '--quiet', '-m', 'parent era');
const PARENT_RECEIPT_BASE = git('rev-parse', 'HEAD').trim();
// The child's own two lines land LATER, exactly as they do in life: the PM writes them
// after the parent was sealed. This is the commit the old code could never have found them
// at, because it looked at PARENT_RECEIPT_BASE above.
write('rebuild/DECISIONS.md', [OWNER_LINE, CONTRACT_LINE, THEME_LINE, ACCEPT_LINE, ''].join('\n'));
git('add', '-A'); git('commit', '--quiet', '-m', 'the child era');
const CHAIN_HEAD = git('rev-parse', 'HEAD').trim();
assert.notEqual(CHAIN_HEAD, PARENT_RECEIPT_BASE);

const fixtureSource = source.replace(
  "const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';",
  "const CHAIN_REF = 'refs/heads/fixture-chain';");
{
  const a = source.split('\n'), b = fixtureSource.split('\n');
  assert.equal(a.length, b.length, 'the fixture changes no line count');
  const moved = a.map((line, i) => [i, line]).filter(([i, line]) => line !== b[i]);
  assert.equal(moved.length, 1, 'exactly one constant is re-pointed at the fixture');
  assert.match(moved[0][1], /^const CHAIN_REF = '/);
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
    '\nmodule.exports={product,authority,open,CHAIN_REF,init(){logDir=root;specRaw=Buffer.from("{}");}};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
api.init();

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-phase-ledger-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

// ------------------------------------------------------------------ 1. the product phase
const OWN = 'rebuild/m4/spec/fixture-own.cjs';
const CHANGED = 'rebuild/m4/spec/fixture-changed.cjs';
write(OWN, 'console.log("unchanged by this package");\n');
write(CHANGED, 'console.log("this package changed it");\n');
const at = f => sha(fs.readFileSync(path.join(scratch, f)));
const noParent = null;

test('(a) a declared+pinned UNCHANGED file (pre === post) reports IMPLEMENTED', () => {
  // This is B-NTC's seven, in miniature: the package declares the file, pins it by bytes,
  // and does not change it. `pre === post === disk`. Before this change it was counted as
  // "still at the pinned pre-image" and PRODUCT could never be anything but PARTIAL.
  // TOOLING-REVIEW r7 F1: the role that says so is "pinned-unchanged", not "new" — the
  // case is unchanged, only its name is, and the file is counted in its own bucket rather
  // than among "at the declared post-image" because this package produced no byte of it.
  const s = { product: { [OWN]: { pre: at(OWN), post: at(OWN), role: 'pinned-unchanged' } } };
  assert.equal(api.product(s, noParent), 'IMPLEMENTED');
});

test('(b) a file genuinely at a pre-image with a DIFFERENT post still reports pre/PARTIAL', () => {
  // The control that says the change weakened nothing: a declared post the file has NOT
  // reached still reports the pre-image, and the phase is still PARTIAL beside a file that
  // has reached its own post.
  const s = { product: {
    [CHANGED]: { pre: at(CHANGED), post: '0'.repeat(64), role: 'new' },              // declared, not yet there
    [OWN]: { pre: at(OWN), post: at(OWN), role: 'pinned-unchanged' },                // complete
  } };
  assert.equal(api.product(s, noParent), 'PARTIAL');
  // And on its own, a file that has not reached its declared post is NOT-IMPLEMENTED.
  assert.equal(api.product({ product: { [CHANGED]: { pre: at(CHANGED), post: '0'.repeat(64), role: 'new' } } }, noParent), 'NOT-IMPLEMENTED');
});

test('(c) a file matching NEITHER image still refuses, exactly as before', () => {
  const s = { product: { [CHANGED]: { pre: '1'.repeat(64), post: '0'.repeat(64), role: 'new' } } };
  assert.throws(() => api.product(s, noParent), /UNLISTED-PRODUCT-DRIFT/);
  // A `carried` file is still held to pin.pre exactly and is not admitted by a post.
  const carried = { product: { [OWN]: { pre: '1'.repeat(64), post: at(OWN), role: 'carried' } } };
  assert.throws(() => api.product(carried, noParent), /UNLISTED-PRODUCT-DRIFT/);
  // A `new` file declared with post null that does not exist is still "at the pre-image".
  assert.equal(api.product({ product: { 'rebuild/m4/spec/fixture-absent.cjs': { pre: '1'.repeat(64), post: null, role: 'new' } } }, noParent), 'NOT-IMPLEMENTED');
});

// ----------------------------------------------------------------- 2. the ledger anchors
const claim = line => ({ ledgerLine: 1, role: line.includes(' · owner · ') ? 'owner' : 'cowork', line, lineSha256: sha(Buffer.from(line)) });
const bound = () => ({ option: { id: 'FIXTURE' }, decided: true, receiptBase: PARENT_RECEIPT_BASE,
  acceptance: { authorizations: { contract: { lineSha256: sha(Buffer.from(CONTRACT_LINE)) } } } });
const spec = (theme, accepted) => ({
  packageId: PACKAGE_ID,
  brief: { file: BRIEF, sha256: '0'.repeat(64), acceptedLedgerLine: accepted },
  authorizations: { owner: claim(OWNER_LINE), contract: claim(CONTRACT_LINE), theme, review: {} },
});

test('(d) the package\'s OWN two lines are found on the chain branch, not at the parent receipt base', () => {
  // The defect, stated as a fact about the fixture: neither line exists at the parent's
  // receipt base, and both exist on the chain branch. Under the old anchor this case threw
  // RECEIPT-EXACT-LINE-MISSING, which is why no child's brief could ever be accepted.
  const atBase = cp.execFileSync('git', ['show', PARENT_RECEIPT_BASE + ':rebuild/DECISIONS.md'], { cwd: scratch, encoding: 'utf8' });
  assert(!atBase.includes(ACCEPT_LINE), 'the acceptance line is NOT at the parent receipt base');
  assert(!atBase.includes(THEME_LINE), 'the theme line is NOT at the parent receipt base');
  const onChain = cp.execFileSync('git', ['show', api.CHAIN_REF + ':rebuild/DECISIONS.md'], { cwd: scratch, encoding: 'utf8' });
  assert(onChain.includes(ACCEPT_LINE) && onChain.includes(THEME_LINE), 'both are on the chain branch');
  api.open.length = 0;
  api.authority(spec(claim(THEME_LINE), claim(ACCEPT_LINE)), bound());
  assert.deepEqual(api.open.map(o => o.reason), [], 'neither obligation is left open once the PM has written both lines');
});

test('(e) an ABSENT line still leaves its obligation OPEN, and a FORGED one still refuses', () => {
  api.open.length = 0;
  api.authority(spec(null, null), bound());
  assert.deepEqual(api.open.map(o => o.reason).sort(), [
    'brief ' + BRIEF + ' not accepted by a PM ledger line',
    'theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)',
  ].sort(), 'both obligations stay open while the lines are null');
  // A line that exists only in the spec — the N4 case — still refuses. This is the whole
  // point of the anchor: a lane cannot clear an obligation by writing its own citation.
  const forged = '- 2026-09-11 · cowork · BRIEF ACCEPTED for ' + PACKAGE_ID + ' at ' + BRIEF + ' by its own author · ACCEPTED';
  api.open.length = 0;
  assert.throws(() => api.authority(spec(claim(THEME_LINE), claim(forged)), bound()), /RECEIPT-EXACT-LINE-MISSING/);
  // And a real line that does not MENTION this package still refuses on content.
  const other = '- 2026-09-11 · cowork · BRIEF ACCEPTED for M2-SOMEONE-ELSE at ' + BRIEF + ' · ACCEPTED';
  write('rebuild/DECISIONS.md', [OWNER_LINE, CONTRACT_LINE, THEME_LINE, ACCEPT_LINE, other, ''].join('\n'));
  git('add', '-A'); git('commit', '--quiet', '-m', 'another package');
  api.open.length = 0;
  assert.throws(() => api.authority(spec(claim(THEME_LINE), claim(other)), bound()), /RECEIPT-CONTENT/);
});

test('(f) OWNER and CONTRACT still resolve at the PARENT receipt base, and the contract is still inherited', () => {
  // The control that says the change moved only the two lines it meant to move. The owner
  // and contract lines are parent-era; they are still read at the parent's receipt base,
  // and the contract must still be byte-equal to the parent artifact's own.
  api.open.length = 0;
  api.authority(spec(null, null), bound());          // reaches both ledger() calls without throwing
  const wrongContract = bound();
  wrongContract.acceptance.authorizations.contract.lineSha256 = '0'.repeat(64);
  assert.throws(() => api.authority(spec(null, null), wrongContract), /INHERITED-CONTRACT-AUTHORIZATION/);
  // An owner line that is not at the parent's receipt base still refuses there.
  const late = '- 2026-09-11 · owner · M2-RULE written far too late · M2-RULE DONE';
  write('rebuild/DECISIONS.md', [OWNER_LINE, CONTRACT_LINE, THEME_LINE, ACCEPT_LINE, late, ''].join('\n'));
  git('add', '-A'); git('commit', '--quiet', '-m', 'a late owner line');
  const s = spec(null, null); s.authorizations.owner = claim(late);
  assert.throws(() => api.authority(s, bound()), /RECEIPT-EXACT-LINE-MISSING/);
});

test('with no sealed parent at all, both obligations are still refused a claim and left open', () => {
  api.open.length = 0;
  assert.throws(() => api.authority(spec(claim(THEME_LINE), null), null), /THEME-AUTHORIZATION-UNVERIFIABLE/);
  api.open.length = 0;
  assert.throws(() => api.authority(spec(null, claim(ACCEPT_LINE)), null), /BRIEF-ACCEPTANCE-UNVERIFIABLE/);
  api.open.length = 0;
  api.authority(spec(null, null), null);
  assert.equal(api.open.length, 3, 'theme, brief and the un-anchored owner/contract note');
});
