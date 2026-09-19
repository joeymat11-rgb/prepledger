'use strict';
/* =====================================================================
   LANE B - S9-PREP-A. RELEASE-FROM-SEAL, the role DECISIONS:536 asks for,
   MEASURED against the runner instead of argued from it.

   Design of record: rebuild/lanes/b/S9-RELEASE-SPEC.md v4, sections B.2 to
   B.8, as corrected by rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R4.md. Twelve
   cells, one per numbered row of B.8, and every one of them was RED against
   the runner as it stood at sha256
   e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e before a
   single hunk landed. The author report records the refusal each one printed
   on that runner, and the mutation table records which cell each hunk turns.

   METHOD is the house one (gate-supersession.test.cjs): the REAL runner is
   compiled with only CHAIN_REF re-pointed at a fixture branch, and the cell
   asserts below that this is the only line that differs. The fixture builds
   its OWN Git repository and its OWN DECISIONS.md.

   WHY THE FIXTURE LEDGER, and not the real one: the PM writes the
   RELEASE-FROM-SEAL line only AFTER reviewing this grammar, because a ledger
   line must match a grammar that is final. A cell that read the real ledger
   for that line would be reading a line that does not exist. So this suite
   builds its own, exactly as gate-supersession.test.cjs does for the
   GATE-SUPERSESSION token. No ref, object or commit of the real repository
   is read here.
   ===================================================================== */
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
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-s9-release-'));
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

/* ------------------------------------------------------- the fixture tree
   The two paths of the closed list (S9-RELEASE-SPEC A.6) by their real names,
   because a cell that tests a grammar over paths should read as the thing it
   tests; their BYTES here are the fixture's own and nothing of the real tree
   is read. KEPT is the sealed file that stays sealed, and it is the control
   for every refusal below: whatever a release is allowed to do, KEPT must
   still refuse it. */
const RELEASED = 'rebuild/m3/w7-preview/today/preview.css';
const RELEASED2 = 'rebuild/m3/w7-preview/today/build.mjs';
const KEPT = 'rebuild/m3/w7-preview/today/today-app.cjs';
const NEVER_SEALED = 'rebuild/m3/w7-preview/today/screens.template.html';
const CELL = 'rebuild/m4/workout/test/s9-release-probe.test.cjs';
/* A sealed path that stands under a CHILD ROOT, so B.8 row (8) can ask the
   one question a .css file cannot: what happens when a path a child EXECUTES
   is released. proposed() :2800 would re-pin it through executionPins, which
   is the back door F.1 R2 names. */
const ARGV_TARGET = 'rebuild/m3/w7-preview/today/test/view.test.mjs';
write(ARGV_TARGET, "console.log('S9 VIEW PROBE: PASS;');\n");
write(RELEASED, '.card { padding: 1rem; }\n');
write(RELEASED2, "'use strict';\nmodule.exports = { REQUIRED_INPUTS: [] };\n");
write(KEPT, "'use strict';\nmodule.exports = { render() { return 'today'; } };\n");
write(NEVER_SEALED, '<template id="t-today"></template>\n');
write(CELL, "'use strict';\nconsole.log('S9 RELEASE PROBE: PASS;');\n");

/* --------------------------------------------------------- the PM's line
   The token BEGINS ITS OWN clause and is the whole of it, exactly as
   TOOLING-REVIEW-r10b N1 requires of GATE-SUPERSESSION. The separator is
   BUILT rather than typed, so this file stays pure ASCII on disk and no
   editor, transport or encoding between here and the runner can mangle it;
   the character is U+00B7, the ledger's own clause separator. */
const MID = String.fromCharCode(0xB7);
const PKG = 'M2-S9-UI-PINS';
const GRANT = 'RELEASE-FROM-SEAL ' + PKG + ' ' + RELEASED + ',' + RELEASED2;
const head = '- 2026-09-19 ' + MID + ' cowork (PM, EARNED - PM4) ' + MID + ' ';
const RULING_LINE = head + GRANT + ' ' + MID + ' the owner\'s ruling DECISIONS:536 releases ' +
  'presentation-only files from the sealed package inventory ' + MID + ' RULED';
/* One path of the two: the spec releases both, so this line is the "a spec
   releases a path the token does not name" half of B.8 row (7). */
const PARTIAL_LINE = head + 'RELEASE-FROM-SEAL ' + PKG + ' ' + RELEASED + ' ' + MID + ' one path only ' + MID + ' RULED';
/* The other one alone, so a cell can DROP a released path from the inventory
   with the ledger still exactly matching what the spec declares, and reach
   the completeness walk at :1975 rather than the set-equality assert. */
const PARTIAL2_LINE = head + 'RELEASE-FROM-SEAL ' + PKG + ' ' + RELEASED2 + ' ' + MID + ' the other path only ' + MID + ' RULED';
/* Three paths where the spec declares two: the other half of row (7). */
const WIDE_LINE = head + 'RELEASE-FROM-SEAL ' + PKG + ' ' + RELEASED + ',' + RELEASED2 + ',' + KEPT +
  ' ' + MID + ' one path more than the spec declares ' + MID + ' RULED';
/* Somebody else's package, and a line the PM has not ruled yet. */
const OTHER_PACKAGE_LINE = head + 'RELEASE-FROM-SEAL M2-S10-TODAY-SPLIT ' + RELEASED + ' ' + MID + ' RULED';
/* The grant B.8 row (8) needs: the two paths of the closed list plus one that
   a declared child executes. The PM can write such a line; the runner is what
   must refuse the pair. */
const ARGV_LINE = head + 'RELEASE-FROM-SEAL ' + PKG + ' ' + RELEASED + ',' + RELEASED2 + ',' +
  ARGV_TARGET + ' ' + MID + ' a released path that a declared child executes ' + MID + ' RULED';
/* S9-PREP-RUNNER-REVIEW-R1 BLOCKING-1. proposed() has FIVE routes into
   executionPins and the first cut of the guard closed the argv one alone.
   These two lines are the two routes pinned UNCONDITIONALLY, so the cell can
   ask about them without arranging anything: the runner itself, and the spec
   file this run reads. The PM can write either line; the runner must refuse. */
const SPEC_FILE = 'rebuild/lanes/b/tooling/packages/S8.json';
const RUNNER_LINE = head + 'RELEASE-FROM-SEAL ' + PKG + ' ' + RELEASED + ',' + RELEASED2 + ',' +
  runnerRel + ' ' + MID + ' the seal runner itself ' + MID + ' RULED';
const SPECFILE_LINE = head + 'RELEASE-FROM-SEAL ' + PKG + ' ' + RELEASED + ',' + RELEASED2 + ',' +
  SPEC_FILE + ' ' + MID + ' the package spec this run reads ' + MID + ' RULED';
const UNRULED_LINE = head + GRANT + ' ' + MID + ' PROPOSED';
/* P-A1 (the PM's ruling of 2026-09-19; S9-PREP-RUNNER-REVIEW-R1 BLOCKING-3 and
   R2 N1). The phrasings that satisfied the OLD terminal test without being a
   ruling: the test admitted the word RULED anywhere at the end of the trimmed
   line, after a space as readily as after a clause separator, so a clause that
   says the OPPOSITE freed both paths. Two of them, because the negation can be
   flat ("NOT RULED") or temporal ("not yet RULED"), and both were measured
   ADMITTED by two reviewers in turn. */
const NOT_RULED_LINE = head + GRANT + ' ' + MID + ' this is NOT RULED';
const NOT_YET_RULED_LINE = head + GRANT + ' ' + MID + ' not yet RULED';
/* r10b N1's own controls, carried over: the same token negated, quoted,
   bracketed, emphasised and backticked INSIDE a clause. None of them begins
   a clause, so none of them frees a path. */
const WRAPPED_LINES = [
  head + PKG + ' may not ' + GRANT + ' until the cells land ' + MID + ' RULED',
  head + 'the token would read "' + GRANT + '" if it were granted ' + MID + ' RULED',
  head + '(' + GRANT + ') is REFUSED for now ' + MID + ' RULED',
  head + '**' + GRANT + '** is under discussion, not ruled ' + MID + ' RULED',
  head + '`' + GRANT + '` is the shape a future line would carry ' + MID + ' RULED',
];

/* ------------------------------------------- the two ancestor artifacts
   The GRANDPARENT is the package that sealed the two paths (S8 in the real
   chain); the PARENT is the package that released them (S9). B.3's whole
   finding is that the grandparent walk of pins() re-asserts the S8 pin
   against a package two generations later, so the fixture needs both. */
const OTHER = 'rebuild/m3/w7-preview/today/today-model.cjs';
write(OTHER, "'use strict';\nmodule.exports = { plan() { return null; } };\n");
const at = f => sha(fs.readFileSync(path.join(scratch, f)));
const PRE = at(RELEASED), PRE2 = at(RELEASED2), KEPT_SHA = at(KEPT), CELL_SHA = at(CELL), OTHER_SHA = at(OTHER);
const ARGV_SHA = at(ARGV_TARGET);
const GA_FILE = 'rebuild/m4/spec/acceptance-s8-fixture.json';
const A_FILE = 'rebuild/m4/spec/acceptance-s9-fixture.json';
const pin = h => ({ pre: h, post: h, role: 'carried' });
write(GA_FILE, JSON.stringify({ version: 1, packageId: 'M2-S8-FIXTURE',
  product: { [RELEASED]: pin(PRE), [RELEASED2]: pin(PRE2), [KEPT]: pin(KEPT_SHA),
    [OTHER]: pin(OTHER_SHA), [ARGV_TARGET]: pin(ARGV_SHA) },
  executionPins: { [CELL]: CELL_SHA } }, null, 2) + '\n');
const GA_SHA = at(GA_FILE);
write('rebuild/DECISIONS.md', [RULING_LINE, PARTIAL_LINE, PARTIAL2_LINE, WIDE_LINE, OTHER_PACKAGE_LINE,
  ARGV_LINE, RUNNER_LINE, SPECFILE_LINE, UNRULED_LINE, NOT_RULED_LINE, NOT_YET_RULED_LINE,
  ...WRAPPED_LINES, ''].join('\n'));
const shaOf = line => sha(Buffer.from(line));

git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 's9a@earned.local');
git('config', 'user.name', 'lane-b-s9a');
git('add', '-A'); git('commit', '--quiet', '-m', 'the sealed tree and the fixture ledger');
const BASE = git('rev-parse', 'HEAD').trim();
/* LANE C EDITS THE RELEASED FILE. This is the event the whole role exists
   for, and B.3 measures that it is the event that turns the grandparent
   walk red on today's runner. Both released files move, on disk AND in Git,
   so held()'s :1830 and :1831 would both refuse without H17. */
write(RELEASED, '.card { padding: 1.25rem; border-radius: 12px; }\n');
write(RELEASED2, "'use strict';\nmodule.exports = { REQUIRED_INPUTS: ['today/preview.css'] };\n");
git('add', '-A'); git('commit', '--quiet', '-m', 'lane C edits the released files after the release');
const HEAD = git('rev-parse', 'HEAD').trim();
assert.notEqual(at(RELEASED), PRE, 'the released file really moved');

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
process.argv = [process.execPath, runnerFile, '--ci', '--package', 'S8'];
try {
  /* releaseRuling and RELEASE_GRANT_SHAPE are reached through `typeof` on
     purpose: this suite is committed RED, against a runner that has neither,
     and a bare reference would turn twelve measured refusals into one load
     error. Both consts are initialised long before this line runs, so there
     is no temporal-dead-zone case to worry about. */
  m._compile(fixtureSource.slice(0, fixtureSource.indexOf(delimiter)) +
    '\nmodule.exports={product,proposed,pins,sealedRunReceipt,writeSealedRunReceipt,childArgv,same,keys,' +
    'PRODUCT_ROLES,SPEC_KEYS,ARTIFACT_KEYS,FAIL_CODES,failCode,VERDICT_FILE,CHAIN_REF,' +
    "releaseRuling:typeof releaseRuling==='function'?releaseRuling:null," +
    "RELEASE_GRANT_SHAPE:typeof RELEASE_GRANT_SHAPE==='string'?RELEASE_GRANT_SHAPE:null," +
    'init(a,raw){logDir=root;ARTIFACT=a;specRaw=raw;}};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
const SPEC_BYTES = Buffer.from('{"the":"reviewed spec bytes"}\n');
api.init(GA_FILE, SPEC_BYTES);

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-s9-release-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

/* --------------------------------------------- the spec and the parent bound
   `over` is a shallow override so each cell states ONLY the thing it moves,
   and every other field stays the one the happy path uses. */
const NEEDLE = 'S9 RELEASE PROBE: PASS;';
const probeChild = () => ({ name: 's9-release-probe', argv: ['--test', CELL], needle: NEEDLE });
const parentProduct = () => ({ [RELEASED]: pin(PRE), [RELEASED2]: pin(PRE2),
  [KEPT]: pin(KEPT_SHA), [ARGV_TARGET]: pin(ARGV_SHA) });
const bound = () => ({
  option: { id: 'S8', artifact: GA_FILE, sha256: GA_SHA, review: null, reviewSha256: null,
    receiptLedgerLine: null, note: null },
  decided: true, reviewedCommit: BASE,
  acceptance: { packageId: 'M2-S8-FIXTURE', product: parentProduct(), executionPins: { [CELL]: CELL_SHA },
    sourceBase: BASE, parent: { id: 'S7', artifact: GA_FILE, sha256: GA_SHA, review: null } },
});
const released = h => ({ pre: h, post: null, role: 'released' });
const spec = (over = {}) => ({
  version: 1, lanePackage: 'S9', packageId: PKG, status: 'PROPOSED',
  brief: { file: 'missing-public-brief.md', sha256: 'd'.repeat(64), acceptedLedgerLine: null },
  sourceBase: HEAD, dIds: [], laws: {}, carriedAcceptedIds: [], privateLiveTriggered: [],
  parent: { decided: true, chosen: 'S8', options: [] },
  tooling: { runner: runnerRel, runnerSha256: sha(Buffer.from(fixtureSource)) },
  product: { [RELEASED]: released(PRE), [RELEASED2]: released(PRE2),
    [KEPT]: pin(KEPT_SHA), [ARGV_TARGET]: pin(ARGV_SHA) },
  release: { rulingLineSha256: shaOf(RULING_LINE) },
  coverage: { inherited: {}, moves: {}, successors: null, superseded: null },
  carrierSuccessor: null, witnessFlips: [], protectedSurfaces: [],
  authorizations: { owner: null, contract: null, theme: null, review: null },
  artifact: { file: A_FILE, review: 'rebuild/m4/spec/review-s9-fixture.json' },
  children: [probeChild()], notes: [],
  ...over,
});
/* Everything product() prints, captured, because two of the hunks are SAY
   clauses and a count that moves in silence is the thing the design refuses
   everywhere else (R2 N2, S9-RELEASE-SPEC F.2 STOP-2). */
function said(fn) {
  const lines = [], real = console.log;
  console.log = line => lines.push(String(line));
  try { fn(); } finally { console.log = real; }
  return lines.join('\n');
}

/* ============================ B.8 (1) the closed role vocabulary, W7 ===== */
test('B.8 (1) - "released" is the SIXTH role, fixed at PRODUCT_ROLES and nowhere else', () => {
  assert.deepEqual(api.PRODUCT_ROLES,
    ['edited', 'carried', 'new', 'superseded-by-child', 'pinned-unchanged', 'released']);
  assert.equal(api.PRODUCT_ROLES.length, 6);
  /* The refusal a spec gets today for the word, and the one it keeps getting
     for any word that is not one of the six. Both names stay in the closed
     refusal vocabulary, so neither can ever print as a bare FAIL. */
  assert(api.FAIL_CODES.has('PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY'));
  assert.equal(api.failCode('PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY x "invented"'),
    'PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY');
  /* The grammar itself is fixed in the runner too, beside the only precedent
     the runner has for "a PM grants a named package a named exemption". */
  assert.equal(api.RELEASE_GRANT_SHAPE,
    'RELEASE-FROM-SEAL <packageId> <path>[,<path>...], alone in its own ' + MID + ' clause');
  /* `release` is a spec key the runner knows, and an OPTIONAL one: adding it
     to the closed list must not make every spec sealed before the role
     unreadable. The closure that actually decides whether it may stand is
     releaseRuling(), below. */
  assert(api.SPEC_KEYS.includes('release'));
  assert(api.ARTIFACT_KEYS.includes('released'));
});

/* ===== B.8 (1b) H4 and H5, THE TWO HUNKS THAT LIVE INSIDE spec() ========
   FOUND BY THE MUTATION TABLE, and said plainly rather than left out: this is
   a SOURCE pin and not an execution, because spec() cannot be called from a
   lane-B cell. It reads packages/<ID>.json off disk, holds it to its own bytes
   IN GIT at HEAD, and then validates a whole envelope - parent options, laws,
   coverage, children, authorizations, artifact coordinates - so exercising it
   needs a fixture package rather than a fixture object, which is its own
   round's work. Every OTHER hunk in this suite is measured by executing the
   runner; these two are measured by reading it, and the difference is stated
   here so a reviewer does not have to infer it. Reverting either one turns
   this cell red, which is the property the mutation table asked for.
   The house precedent for a source pin is gate-supersession.test.cjs, which
   asserts the runner's own refusal text at three sites the same way. */
test('B.8 (1b) - H4 and H5 stand at their sites in spec(), pinned by reading the runner', () => {
  // H4: a released pin declares no post-image, and the refusal has its own name.
  assert(source.includes("assert(pin.role !== 'released' || pin.post === null,"),
    'H4 stands in the spec() product loop');
  assert(source.includes("'PRODUCT-RELEASED-DECLARES-A-POST ' + file"),
    'and it refuses by name, so it can never print a bare FAIL');
  assert(api.FAIL_CODES.has('PRODUCT-RELEASED-DECLARES-A-POST'));
  // H5: the freeze pattern, which is what makes `release` an OPTIONAL key. The
  // expression itself is exercised below through the runner's own keys() and
  // SPEC_KEYS, so the RULE is executed even though the call site is only read.
  assert(source.includes("keys({ ...s, release: null }, SPEC_KEYS, 'Closed package-spec keys');"),
    'H5 closes the spec keys with the freeze pattern');
  assert(source.includes("keys(s.release, ['rulingLineSha256'], 'Release grant citation');"),
    'and the block has a closed key set of its own');
  assert(api.FAIL_CODES.has('RELEASE-BLOCK-SHAPE'));
  const base = Object.fromEntries(api.SPEC_KEYS.filter(k => k !== 'release').map(k => [k, null]));
  api.keys({ ...base, release: null }, api.SPEC_KEYS, 'a spec that carries no release block');
  api.keys({ ...base, release: { rulingLineSha256: 'a'.repeat(64) } }, api.SPEC_KEYS, 'and one that does');
  assert.throws(() => api.keys({ ...base, release: null, invented: 1 }, api.SPEC_KEYS, 'closed'),
    /closed/, 'and any OTHER key is still refused, which is what "optional" must not cost');
});

/* ==== B.8 (2) the parent-pin branch, the one place a role is judged ====== */
test('B.8 (2) - a parent PRODUCT pin declared "released" is admitted where carried and edited are', () => {
  const s = spec(), b = bound();
  /* NOT-IMPLEMENTED, and that is the answer worth asserting: this fixture's
     whole unreleased inventory is `carried`, so nothing stands at a post and
     nothing is pinned-unchanged. A released path is counted in NEITHER of the
     two buckets the phase reads, so releasing two files can never move a
     package's phase - a release is not a thing a package PRODUCED. */
  const out = said(() => assert.equal(api.product(s, b, null), 'NOT-IMPLEMENTED'));
  assert.match(out, /PRODUCT NOT-IMPLEMENTED/);
  assert.match(out, /0 at the declared post-image/);
  assert.match(out, /2 carried byte-identical from the parent/);
  /* And nothing else was admitted with it: the roles the branch has always
     refused still refuse, by their own names, over the same parent pin. */
  for (const role of ['new', 'pinned-unchanged']) {
    const wrong = spec();
    wrong.product[KEPT] = { pre: KEPT_SHA, post: KEPT_SHA, role };
    assert.throws(() => api.product(wrong, b, null), /PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED/,
      'role ' + role + ' over a parent product pin');
  }
  /* And the word cannot be borrowed for a path the ruled line does not name:
     a parent pin declared released without a grant is refused BEFORE the
     role branch is reached, by the ledger rather than by the vocabulary. */
  const ungranted = spec();
  ungranted.product[KEPT] = released(KEPT_SHA);
  assert.throws(() => api.product(ungranted, b, null), /RELEASE-DECLARED-PATH-IS-NOT-GRANTED/);
  /* A released pin still has to be the byte the parent sealed: B.2 step 6 is
     the pre-image equality every parent pin has carried since r7b F-E. */
  const lying = spec();
  lying.product[RELEASED] = released('0'.repeat(64));
  assert.throws(() => api.product(lying, b, null), /RELEASE-PATH-PRE-IMAGE-IS-NOT-THE-PARENT-PIN/);
});

/* ==== B.8 (3) the released path is never hashed, and the fence holds ==== */
test('B.8 (3) - a byte moved in a RELEASED file is not drift; the same move in a SEALED file still is', () => {
  const s = spec(), b = bound();
  /* Both released files already stand at lane C's bytes, not at the pin. */
  assert.notEqual(at(RELEASED), PRE);
  assert.notEqual(at(RELEASED2), PRE2);
  const out = said(() => assert.equal(api.product(s, b, null), 'NOT-IMPLEMENTED'));
  /* H8: said out loud on every run, with the count and the sha the parent
     sealed each path at. A release that printed nothing would be a release
     nobody reading the log could see. */
  assert.match(out, /2 released under DECISIONS:\d+, each at the sha256 M2-S8-FIXTURE sealed it at, not hashed here/);
  assert.match(out, new RegExp(RELEASED.replace(/[./]/g, '\\$&')));
  /* THE FENCE. The same byte move in a file this package does NOT release is
     refused exactly as it always was, and the refusal names the path. */
  const wasKept = fs.readFileSync(path.join(scratch, KEPT), 'utf8');
  write(KEPT, wasKept + '// a byte nobody released\n');
  assert.throws(() => api.product(spec(), b, null), /UNLISTED-PRODUCT-DRIFT/);
  write(KEPT, wasKept);
  assert.equal(at(KEPT), KEPT_SHA);
  /* And a released path is still DECLARED: :1975's completeness walk finds
     it, so a release can never be a way of dropping a path from the
     inventory. Removing it refuses by the completeness code. */
  const dropped = spec();
  delete dropped.product[RELEASED];
  dropped.release = { rulingLineSha256: shaOf(PARTIAL2_LINE) };
  assert.throws(() => api.product(dropped, b, null), /UNLISTED-PRODUCT-DRIFT/,
    'the completeness walk finds a parent-pinned path that left the inventory');
});

/* ==== B.8 (4) no PM line, no release ==================================== */
test('B.8 (4) - a released path with no token line refuses RELEASE-NOT-RULED', () => {
  const b = bound();
  const none = spec({ release: null });
  assert.throws(() => api.product(none, b, null), /RELEASE-NOT-RULED/);
  const absent = spec();
  delete absent.release;
  assert.throws(() => api.product(absent, b, null), /RELEASE-NOT-RULED/);
  /* The placeholder shape the S8 spec uses for the supersession block: a
     block that stands with a null sha is CITED BY NOBODY and refuses too. */
  assert.throws(() => api.product(spec({ release: { rulingLineSha256: null } }), b, null), /RELEASE-NOT-RULED/);
  assert.throws(() => api.product(spec({ release: { rulingLineSha256: 'nope' } }), b, null),
    /RELEASE-RULING-LINE-SHA256-SHAPE/);
  /* A sha that hashes to no line on the chain branch, and one that hashes to
     more than one, are the same refusal supersessionRuling() has carried
     since r10 F4: the line is located BY ITS OWN BYTES or not at all. */
  assert.throws(() => api.product(spec({ release: { rulingLineSha256: 'f'.repeat(64) } }), b, null),
    /RELEASE-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH/);
  /* And a spec that carries the block while releasing nothing is refused
     rather than ignored: an unused grant in a sealed spec reads as a grant. */
  const idle = spec();
  idle.product[RELEASED] = pin(PRE); idle.product[RELEASED2] = pin(PRE2);
  write(RELEASED, '.card { padding: 1rem; }\n'); write(RELEASED2, "'use strict';\nmodule.exports = { REQUIRED_INPUTS: [] };\n");
  assert.throws(() => api.product(idle, b, null), /RELEASE-BLOCK-WITHOUT-A-RELEASED-DECLARATION/);
  write(RELEASED, '.card { padding: 1.25rem; border-radius: 12px; }\n');
  write(RELEASED2, "'use strict';\nmodule.exports = { REQUIRED_INPUTS: ['today/preview.css'] };\n");
});

/* ==== B.8 (5) and (6) whose line it is, and whether it is ruled ========== */
test('B.8 (5) - a token line naming another package frees nothing here', () => {
  assert.throws(() => api.product(spec({ release: { rulingLineSha256: shaOf(OTHER_PACKAGE_LINE) } }), bound(), null),
    /RELEASE-RULING-DOES-NOT-NAME-THIS-PACKAGE/);
});

/* THE TITLE IS B.8 (6)'s OWN WORDING AGAIN, and it is true again as of the
   PM's P-A1 ruling. R1 BLOCKING-3 measured the one phrasing that satisfied the
   old terminal test without being a ruling - a line whose last two words are
   "NOT RULED" - and R2 N1 re-measured it ADMITTED on its own fixture. The hole
   was INHERITED (supersessionRuling() carried the identical test), so it could
   not be closed on one side of a line-for-line mirror by an author; the PM
   measured every ruling line the specs cite, found all eight still ruled under
   the narrower rule, and closed it in BOTH functions at once. The cell that
   measures the closure is (P-A1) below, in this suite and in
   gate-supersession.test.cjs; this one keeps the rows B.8 gives it. */
test('B.8 (6) - a token line that does not end in a RULED clause frees nothing, and neither does a wrapped token', () => {
  assert.throws(() => api.product(spec({ release: { rulingLineSha256: shaOf(UNRULED_LINE) } }), bound(), null),
    /RELEASE-RULING-IS-NOT-A-RULED-LINE/);
  /* r10b N1's controls, which the keyword scan of an earlier runner admitted:
     the token NEGATED, QUOTED, BRACKETED, EMPHASISED and BACKTICKED inside a
     clause. A ledger clause is the smallest unit a PM writes deliberately, so
     the grant is one, and none of these five is one. */
  for (const line of WRAPPED_LINES)
    assert.throws(() => api.product(spec({ release: { rulingLineSha256: shaOf(line) } }), bound(), null),
      /RELEASE-RULING-DOES-NOT-CARRY-THE-GRANT-TOKEN/, 'wrapped token frees nothing: ' + line.slice(40, 80));
});

/* ==== B.8 (7) the ledger and the spec cannot drift apart ================ */
test('B.8 (7) - set equality BOTH ways: the spec may not release what the line omits, nor omit what it names', () => {
  const b = bound();
  /* The spec declares two; the line names one. */
  assert.throws(() => api.product(spec({ release: { rulingLineSha256: shaOf(PARTIAL_LINE) } }), b, null),
    /RELEASE-DECLARED-PATH-IS-NOT-GRANTED/);
  /* The line names three; the spec declares two. The third is a path this
     package DOES declare, as `carried`, so the only thing wrong with it is
     that the ledger says released and the spec does not. */
  assert.throws(() => api.product(spec({ release: { rulingLineSha256: shaOf(WIDE_LINE) } }), b, null),
    /RELEASE-GRANTED-PATH-IS-NOT-DECLARED-RELEASED/);
  /* B.2 step 6: you cannot release what the parent never sealed. */
  const unsealed = spec();
  unsealed.product[NEVER_SEALED] = released(sha(fs.readFileSync(path.join(scratch, NEVER_SEALED))));
  const line = head + 'RELEASE-FROM-SEAL ' + PKG + ' ' + RELEASED + ',' + RELEASED2 + ',' + NEVER_SEALED + ' ' + MID + ' RULED';
  const ledger = fs.readFileSync(path.join(scratch, 'rebuild/DECISIONS.md'), 'utf8');
  write('rebuild/DECISIONS.md', ledger + line + '\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'a line releasing a path the parent never sealed');
  unsealed.release = { rulingLineSha256: shaOf(line) };
  assert.throws(() => api.product(unsealed, b, null), /RELEASE-PATH-IS-NOT-A-PARENT-PRODUCT-PIN/);
});

/* ==== B.8 (8) a released path may not be a child argv target ============ */
test('B.8 (8) - a released path that a declared child EXECUTES refuses, so proposed() cannot re-pin it', () => {
  const b = bound();
  const s = spec({ release: { rulingLineSha256: shaOf(ARGV_LINE) } });
  s.product[ARGV_TARGET] = released(ARGV_SHA);
  s.children = [{ name: 's9-view-probe', argv: ['--test', ARGV_TARGET], needle: 'S9 VIEW PROBE: PASS;' }];
  assert.throws(() => api.product(s, b, null), /RELEASE-PATH-IS-A-CHILD-ARGV-TARGET/);
  /* The same package with the same three released paths and a child that
     runs something else is admitted: the refusal is about the PAIR, not
     about the third path. */
  const ok = spec({ release: { rulingLineSha256: shaOf(ARGV_LINE) } });
  ok.product[ARGV_TARGET] = released(ARGV_SHA);
  said(() => api.product(ok, b, null));
});

/* ==== (R1-B1) EVERY ROUTE INTO executionPins, not the argv one alone =====
   S9-PREP-RUNNER-REVIEW-R1 BLOCKING-1. proposed() has FIVE routes into
   executionPins: the runner, this package's own spec file, the brief, the
   carrier successor, and every declared child's argv target. The first cut above
   closed the LAST one while its own comment named the CLASS. MEASURED by the
   reviewer against that runner: a released path that is also the brief, or the
   carrier successor, is ADMITTED, and the artifact then says the same path is
   released AND execution-pinned. The next package refuses PARENT-PIN-BROKEN on
   the first lane C edit - through the PARENT walk, which has no skip and must
   not get one - so the release lasts exactly one generation, which is the
   failure H17 exists to prevent arriving one generation later by another door.
   The argv route keeps its own refusal name, because that is the name B.5 and
   F.1 R2 give it and the name B.8 (8) pins; the other four share one. */
test('(R1-B1) - a released path that is the brief, the carrier successor, the runner or the spec file refuses', () => {
  const b = bound();
  /* (a) THE BRIEF. The happy path of this fixture with one field moved, so the
     only thing wrong with it is the thing under test. */
  const asBrief = spec();
  asBrief.brief = { ...asBrief.brief, file: RELEASED };
  assert.throws(() => api.product(asBrief, b, null), /RELEASE-PATH-IS-AN-EXECUTION-PIN-TARGET/);
  try { api.product(asBrief, b, null); assert.fail('admitted'); } catch (e) {
    assert(e.message.includes(RELEASED), 'the refusal names the path: ' + e.message);
    assert(e.message.includes('the brief'), 'and the route it would be re-pinned by: ' + e.message);
  }
  /* (b) THE CARRIER SUCCESSOR, the other conditional route. */
  const asCarrier = spec({ carrierSuccessor: { file: RELEASED2, parent: KEPT, witnessPins: {} } });
  assert.throws(() => api.product(asCarrier, b, null), /RELEASE-PATH-IS-AN-EXECUTION-PIN-TARGET/);
  try { api.product(asCarrier, b, null); assert.fail('admitted'); } catch (e) {
    assert(e.message.includes(RELEASED2) && e.message.includes('the carrier successor'), e.message);
  }
  /* (c) and (d) THE RUNNER and THIS PACKAGE'S OWN SPEC FILE, the two routes
     proposed() takes unconditionally. Each needs its own ruled line, because the
     granted set and the declared set are equal both ways; each is declared over
     a parent that sealed it, so the only thing left wrong is the route. */
  const three = (file, hash, lineSha) => {
    const s = spec({ release: { rulingLineSha256: lineSha } });
    s.product[file] = released(hash);
    return s;
  };
  const b2 = bound(), rsha = at(runnerRel), ssha = 'e'.repeat(64);
  b2.acceptance.product[runnerRel] = pin(rsha);
  b2.acceptance.product[SPEC_FILE] = pin(ssha);
  assert.throws(() => api.product(three(runnerRel, rsha, shaOf(RUNNER_LINE)), b2, null),
    /RELEASE-PATH-IS-AN-EXECUTION-PIN-TARGET/, 'the runner itself');
  assert.throws(() => api.product(three(SPEC_FILE, ssha, shaOf(SPECFILE_LINE)), b2, null),
    /RELEASE-PATH-IS-AN-EXECUTION-PIN-TARGET/, 'the spec file this run reads');
  /* THE CONTROL. The same package with its brief, its carrier successor and its
     children where they belong runs to the answer this fixture always gives, so
     the four refusals above are about the PAIR and not about the released paths. */
  const out = said(() => assert.equal(api.product(spec(), b, null), 'NOT-IMPLEMENTED'));
  assert.match(out, /2 released under DECISIONS:\d+/);
  /* AND THE ARGV ROUTE STILL REFUSES BY ITS OWN NAME, so closing the class did
     not cost B.8 (8) the refusal the spec gives it. */
  const argvCase = spec({ release: { rulingLineSha256: shaOf(ARGV_LINE) } });
  argvCase.product[ARGV_TARGET] = released(ARGV_SHA);
  argvCase.children = [{ name: 's9-view-probe', argv: ['--test', ARGV_TARGET], needle: 'S9 VIEW PROBE: PASS;' }];
  assert.throws(() => api.product(argvCase, b, null), /RELEASE-PATH-IS-A-CHILD-ARGV-TARGET/);
});

/* ==== B.8 (9) the artifact: a block of its own, recomputed exactly ====== */
test('B.8 (9) - proposed() keeps a released path OUT of product and builds the released block', () => {
  const s = spec(), b = bound();
  const p = api.proposed(s, b);
  assert.equal(Object.hasOwn(p.product, RELEASED), false, 'a released path is not inherited through product');
  assert.equal(Object.hasOwn(p.product, RELEASED2), false);
  assert.deepEqual(Object.keys(p.product).sort(), [ARGV_TARGET, KEPT].sort());
  assert.deepEqual(Object.keys(p.released).sort(), [RELEASED, RELEASED2].sort());
  assert.deepEqual(p.released[RELEASED], { role: 'released', lastSealedSha256: PRE,
    sealedBy: 'M2-S8-FIXTURE', rulingLineSha256: shaOf(RULING_LINE) });
  assert.deepEqual(p.released[RELEASED2], { role: 'released', lastSealedSha256: PRE2,
    sealedBy: 'M2-S8-FIXTURE', rulingLineSha256: shaOf(RULING_LINE) });
  /* The literal role on every entry (R1 N1): the artifact reads without the
     reader having to know which block implies which role. */
  for (const e of Object.values(p.released)) assert.equal(e.role, 'released');
  /* :3021's recomputation still closes it, both ways. */
  const tampered = JSON.parse(JSON.stringify(p));
  tampered.released[RELEASED].lastSealedSha256 = '0'.repeat(64);
  assert.equal(api.same(tampered, api.proposed(s, b)), false, 'a moved lastSealedSha256 is refused');
  const dropped = JSON.parse(JSON.stringify(p));
  delete dropped.released[RELEASED2];
  assert.equal(api.same(dropped, api.proposed(s, b)), false, 'a dropped released entry is refused');
  const back = JSON.parse(JSON.stringify(p));
  back.product[RELEASED] = released(PRE);
  assert.equal(api.same(back, api.proposed(s, b)), false, 'putting the path back into product is refused');
  assert.equal(api.same(p, api.proposed(s, b)), true, 'and the untouched artifact recomputes');
  /* AND THE KEY IS OPTIONAL. A package that releases nothing carries no
     `released` key at all, so every artifact sealed before this role existed
     recomputes and key-closes exactly as it did. */
  const none = spec();
  delete none.release;
  none.product[RELEASED] = pin(PRE); none.product[RELEASED2] = pin(PRE2);
  assert.equal(Object.hasOwn(api.proposed(none, b), 'released'), false);
});

/* ==== (R1-B2) NOTHING IN THE SEALED BLOCK IS READ OFF THE LIVE CHAIN =====
   S9-PREP-RUNNER-REVIEW-R1 BLOCKING-2, and a reported deviation from what
   S9-RELEASE-SPEC B.4 DRAWS.
   The first cut wrote `rulingLine: release.at`, and `release.at` is the INDEX of
   the ruling line in rebuild/DECISIONS.md, read off CHAIN_REF on EVERY run.
   envelope() refuses on same(m, proposed(s, bound)), so a sealed artifact
   carrying that index stops recomputing - SEALED-PROFILE-RECOMPUTATION, for
   ever, for this package and for the standing CI step - the first time any line
   is inserted ABOVE the ruling, with no byte of the package having changed. It
   was the ONLY value in the artifact recomputed from the live chain rather than
   declared by the spec. r7 F4 already moved the supersession ruling from an
   index to a sha256 for this exact reason, and the sha256 locates the line at
   least as well: it is in the block, and the say still prints the index. */
test('(R1-B2) - the released block survives an insertion ABOVE the ruling line on the chain', () => {
  const s = spec(), b = bound();
  const before = api.proposed(s, b);
  /* The closed key set of a released entry: four keys, and not one of them a
     line number. A number in a sealed block is a number that can move without a
     byte of this package moving with it. */
  for (const e of Object.values(before.released))
    assert.deepEqual(Object.keys(e), ['role', 'lastSealedSha256', 'sealedBy', 'rulingLineSha256']);
  assert.equal(api.releaseRuling(s, b).at, 1, 'the ruling stands at line 1 of the fixture ledger');
  /* THE EVENT, and it is the smallest one there is: the PM writes one line
     ABOVE the ruling. Every index below it moves by one; no path, no sha and no
     byte of this package does. */
  const ledger = fs.readFileSync(path.join(scratch, 'rebuild/DECISIONS.md'), 'utf8');
  write('rebuild/DECISIONS.md', head + 'an older ruling, written above this one ' + MID + ' RULED\n' + ledger);
  git('add', '-A'); git('commit', '--quiet', '-m', 'a line inserted ABOVE the ruling line');
  try {
    assert.equal(api.releaseRuling(s, b).at, 2, 'the ruling really moved down one line');
    assert.equal(JSON.stringify(api.proposed(s, b)), JSON.stringify(before),
      'and the artifact recomputes byte for byte, key order included');
    assert.equal(api.same(before, api.proposed(s, b)), true, ':3021 itself, as envelope() runs it');
  } finally {
    write('rebuild/DECISIONS.md', ledger);
    git('add', '-A'); git('commit', '--quiet', '-m', 'the fixture ledger restored');
  }
  assert.equal(api.releaseRuling(s, b).at, 1, 'and the ledger is back where the other cells left it');
});

/* ==== B.8 (10) the --full byte-identity re-verify ======================= */
const RECEIPT = 'rebuild/lanes/b/tooling/receipts/S8.json';
const KEY = 'ACCEPTED:' + 'a'.repeat(64) + ':' + HEAD + ':' + HEAD;
function seal(s) {
  const wrote = api.writeSealedRunReceipt(s, KEY);
  const lines = ['# VERDICT (fixture)', 'artifact ' + wrote.sealedRun.artifactSha256,
    'spec ' + wrote.sealedRun.specSha256, 'runner ' + wrote.sealedRun.runnerSha256];
  write(api.VERDICT_FILE, lines.join('\n') + '\n');
  write(api.VERDICT_FILE, lines.concat('sealed-run receipt ' + at(RECEIPT)).join('\n') + '\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'the sealed run');
  return wrote;
}
test('B.8 (10) - the receipt does not carry a released path, and lane C editing one does NOT void it', () => {
  const s = spec();
  const wrote = seal(s);
  assert.equal(Object.hasOwn(wrote.sealedRun.product, RELEASED), false, 'H12: the write skips released paths');
  assert.equal(Object.hasOwn(wrote.sealedRun.product, RELEASED2), false);
  assert.deepEqual(Object.keys(wrote.sealedRun.product).sort(), [ARGV_TARGET, KEPT].sort());
  assert.equal(api.sealedRunReceipt(s, KEY).ok, true, 'the receipt this seal step wrote re-verifies');
  /* THE EVENT R3 NAMES: lane C edits the stylesheet after the seal. Without
     H13 this prints SEALED-RUN-RECEIPT-VOID on every authorized rerun for
     ever, and every rerun becomes a FULL run with the private census. */
  write(RELEASED, '.card { padding: 2rem; }\n');
  assert.equal(api.sealedRunReceipt(s, KEY).ok, true, 'a released path moving does not void the receipt');
  /* And the fence: a SEALED product byte moving still voids it, by name. */
  const wasKept = fs.readFileSync(path.join(scratch, KEPT), 'utf8');
  write(KEPT, wasKept + '// moved after the seal\n');
  const void1 = api.sealedRunReceipt(s, KEY);
  assert.equal(void1.code, 'SEALED-RUN-RECEIPT-VOID');
  assert.deepEqual(void1.moved, [KEPT]);
  write(KEPT, wasKept);
  assert.equal(api.sealedRunReceipt(s, KEY).ok, true);
});

/* ==== B.8 (11) and (12) THE GRANDPARENT WALK ============================
   S9-RELEASE-SPEC-REVIEW-R1 BLOCKING-1 (the SPEC review, not the runner one),
   and the reason H17 exists. This is a synthetic S10 standing
   over a synthetic S9 artifact that carries a `released` block, with the
   released files' bytes moved on disk AND in Git - which is to say, the first
   moment the release is used for the thing it exists for. */
const releasedEntry = (last) => ({ role: 'released', lastSealedSha256: last,
  sealedBy: 'M2-S8-FIXTURE', rulingLineSha256: shaOf(RULING_LINE) });
const s9Artifact = (extra = {}) => ({ packageId: 'M2-S9-FIXTURE',
  product: { [KEPT]: pin(KEPT_SHA), [ARGV_TARGET]: pin(ARGV_SHA) },
  executionPins: { [CELL]: CELL_SHA },
  released: { [RELEASED]: releasedEntry(PRE), [RELEASED2]: releasedEntry(PRE2), ...extra },
  parent: { id: 'S8', artifact: GA_FILE, sha256: GA_SHA, review: null } });
const s10 = () => ({ product: {}, sourceBase: HEAD });
const bound10 = (extra = {}) => ({ option: { id: 'S9', artifact: A_FILE, sha256: 'b'.repeat(64) },
  decided: true, reviewedCommit: HEAD, acceptance: s9Artifact(extra) });

test('B.8 (11) - the grandparent pin of a RELEASED path is skipped by name, and every other one still refuses', () => {
  /* On today's runner this line refuses GRANDPARENT-PIN-BROKEN preview.css:
     the skip test at :1852 asks only about a.product and a.executionPins and
     knows nothing about a released block, so it re-asserts S8's pin against
     S10 and the release lasts exactly one generation. */
  const out = said(() => api.pins(s10(), bound10()));
  assert.match(out, /PARENT PINS RE-ASSERTED/);
  assert.match(out, /3 pin\(s\)/);
  assert.match(out, /1 un-superseded grandparent pin\(s\)/);
  /* H17's say clause (R2 N2): gkept has just gone down by two, and a count
     that moves in silence is the thing this design refuses everywhere else. */
  assert.match(out, /plus 2 skipped as released by an ancestor artifact's released block/);
  /* THE SKIP IS NARROW. In the SAME fixture, a DIFFERENT grandparent-pinned
     file whose bytes moved must still refuse - this is F.1 R9's whole cell,
     and a skip written too wide (keyed on the name, or on any artifact found
     on disk) turns it green and nothing else in the chain would notice. */
  const wasOther = fs.readFileSync(path.join(scratch, OTHER), 'utf8');
  write(OTHER, wasOther + '// a byte nobody released\n');
  assert.throws(() => said(() => api.pins(s10(), bound10())), /GRANDPARENT-PIN-BROKEN/);
  try { said(() => api.pins(s10(), bound10())); } catch (e) { assert(e.message.includes(OTHER), 'the refusal names the path'); }
  write(OTHER, wasOther);
  assert.equal(at(OTHER), OTHER_SHA);
  /* And the skip reads the ARTIFACTS THIS WALK READS, not a path any input
     names: an artifact with no released block at all behaves exactly as it
     did before the hunk, which is to say it refuses. */
  const noBlock = bound10();
  delete noBlock.acceptance.released;
  assert.throws(() => said(() => api.pins(s10(), noBlock)), /GRANDPARENT-PIN-BROKEN/);
});

test('B.8 (12) - a released block naming a path the grandparent never pinned changes nothing', () => {
  const plain = said(() => api.pins(s10(), bound10()));
  const wider = said(() => api.pins(s10(), bound10({ [NEVER_SEALED]: releasedEntry('c'.repeat(64)) })));
  assert.equal(wider, plain, 'the skip is a no-op over a path no ancestor pinned, not an admission');
  assert.match(wider, /1 un-superseded grandparent pin\(s\)/);
});

/* ==== (X1) THE ALREADY SEALED ARTIFACTS, which H10 and H11 must not move ==
   The PM asked for this by name before the ancestor re-pins, and it is the
   question every artifact sealed BEFORE this role turns on. ARTIFACT_KEYS is
   an exact key set and :3021 is a JSON string equality, so if H10 or H11 had
   moved one key, one order or one byte of what proposed() builds for a spec
   that declares NO release block, then every one of those artifacts would
   stop recomputing the moment its own spec's tooling.runnerSha256 was
   re-pinned to these runner bytes - which is E fact 7, and it is the next
   thing this lane does. Measured against the REAL S8 artifact's own key
   order, read off disk, because that is the artifact E fact 7 re-points. */
const S8_ARTIFACT_KEYS = Object.keys(JSON.parse(fs.readFileSync(
  path.join(sourceRoot, 'rebuild/m4/spec/acceptance-s8-real-shape.json'), 'utf8')));
const releasesNothing = () => {
  const none = spec();
  delete none.release;
  none.product[RELEASED] = pin(PRE); none.product[RELEASED2] = pin(PRE2);
  return none;
};
test('(X1) - a spec with NO release block recomputes byte for byte, and the artifact key set does not move', () => {
  const b = bound(), none = releasesNothing();
  const p = api.proposed(none, b);
  /* The twenty-one keys S8's own sealed artifact carries, IN ITS ORDER, and
     no twenty-second: H10's spread emits nothing when nothing is released. */
  assert.equal(S8_ARTIFACT_KEYS.length, 21);
  assert.deepEqual(Object.keys(p), S8_ARTIFACT_KEYS);
  assert.equal(Object.hasOwn(p, 'released'), false);
  /* H11 APPENDED and re-ordered nothing, which is the whole of why keys()
     can stay an exact set and still read an artifact sealed before S9. */
  assert.deepEqual(api.ARTIFACT_KEYS, [...S8_ARTIFACT_KEYS, 'released']);
  /* H10 REBUILDS the product map rather than passing s.product through, so
     the thing worth measuring is that the rebuild is byte-identical, key
     order included, and not merely deepEqual. */
  assert.equal(JSON.stringify(p.product), JSON.stringify(none.product));
  /* envelope()'s own closure run over it: the freeze pattern accepts an
     artifact with no released key, and still refuses any other stray one. */
  api.keys({ ...p, released: null }, api.ARTIFACT_KEYS, 'an artifact that releases nothing');
  assert.throws(() => api.keys({ ...p, released: null, invented: 1 }, api.ARTIFACT_KEYS, 'closed'), /closed/);
  /* And :3021 itself, as the runner runs it and as the string it compares. */
  assert.equal(api.same(p, api.proposed(none, b)), true);
  assert.equal(JSON.stringify(p), JSON.stringify(api.proposed(none, b)));
  /* The ruling is not consulted and the grant it hands back is empty. */
  const r = api.releaseRuling(none, b);
  assert.deepEqual([r.at, r.line, [...r.granted], r.declared], [null, null, [], []]);
});

/* ==== (X2) releaseRuling() IS NOT ENTERED for a package that releases =====
   nothing, and "not entered" is MEASURED rather than argued. The runner is
   compiled a SECOND time with CHAIN_REF pointed at a ref that does not
   exist, so any read of the chain ledger throws where it stands. A package
   with no release block then runs product() and proposed() to completion
   under it; the same package with its release block back refuses, and that
   control is what makes the green mean "no read happened" rather than "the
   read happened to succeed". This is the cost S8, H3 and every other already
   sealed package must not pay: no RELEASE-NOT-RULED, and no extra Git read
   on a run that releases nothing. */
function compiledAt(chainRef) {
  const src = fixtureSource.replace("const CHAIN_REF = 'refs/heads/fixture-chain';",
    "const CHAIN_REF = '" + chainRef + "';");
  assert.notEqual(src, fixtureSource, 'the chain ref really moved');
  const mod = new Module(runnerFile, module);
  mod.filename = runnerFile;
  mod.paths = Module._nodeModulePaths(path.dirname(path.join(sourceRoot, runnerRel)));
  const inner = mod.require.bind(mod);
  mod.require = file => inner(path.isAbsolute(file) && file.startsWith(scratch + path.sep)
    ? path.join(sourceRoot, path.relative(scratch, file)) : file);
  const saved = process.argv;
  process.argv = [process.execPath, runnerFile, '--ci', '--package', 'S8'];
  try {
    mod._compile(src.slice(0, src.indexOf(delimiter)) +
      '\nmodule.exports={product,proposed,releaseRuling,init(a,raw){logDir=root;ARTIFACT=a;specRaw=raw;}};', runnerFile);
  } finally { process.argv = saved; }
  mod.exports.init(GA_FILE, SPEC_BYTES);
  return mod.exports;
}
test('(X2) - no release block, no ledger read: the chain is unreachable and the package still runs', () => {
  const blind = compiledAt('refs/heads/no-such-chain-ref-s9a');
  /* The shape S8, H3 and every other already sealed package has: a parent
     that sealed nothing this package releases, and a spec that declares the
     whole of that parent's inventory and releases none of it. The two paths
     of the closed list are taken out of BOTH maps rather than declared
     carried, because lane C has already edited their bytes in this fixture
     and product() would rightly call that drift. */
  const b = bound(), none = releasesNothing();
  for (const f of [RELEASED, RELEASED2]) { delete b.acceptance.product[f]; delete none.product[f]; }
  /* THE CONTROL FIRST, so the green below cannot be green for the wrong
     reason: with the release block back, this runner must fail trying to
     READ the chain it cannot reach, and not at any release rule. */
  let control = null;
  try { said(() => blind.product(spec(), bound(), null)); } catch (e) { control = e; }
  assert(control, 'an unreachable chain must refuse, or this cell proves nothing');
  assert.equal(/RELEASE-/.test(control.message), false,
    'it refuses trying to read the chain, not at a release rule: ' + control.message);
  /* And now the thing itself. No released declaration, no release block, no
     read, no refusal, and the same answer this fixture has always given. */
  const out = said(() => assert.equal(blind.product(none, b, null), 'NOT-IMPLEMENTED'));
  assert.equal(/released under/.test(out), false, 'and H8 says nothing, because nothing was released');
  assert.equal(Object.hasOwn(blind.proposed(none, b), 'released'), false);
  const r = blind.releaseRuling(none, b);
  assert.deepEqual([r.at, r.line, [...r.granted], r.declared], [null, null, [], []]);
});

/* ==== (P-A1) THE RULED TERMINAL TEST, STRENGTHENED IN BOTH FUNCTIONS =====
   The PM's ruling of 2026-09-19, on R1 BLOCKING-3 and R2 N1. The old test
   asked only that the trimmed line END in the word RULED, after a space as
   readily as after a clause separator, so a line reading "... this is NOT
   RULED" freed both paths; two reviewers measured it ADMITTED in turn. The
   new rule is the line's LAST clause, trimmed, EXACTLY the word RULED.
   IT LANDED IN BOTH RULING FUNCTIONS AT ONCE, because a chain with two
   ruling functions that disagree about what a ruled line is has a hole
   wherever the weaker one stands, and only after the measurement the PM
   made the condition of the change: every ruling line the specs under
   rebuild/lanes/b/tooling/packages/ cite by sha256 - DECISIONS:153, :160,
   :421, :444, :462, :490, :514 and :527, eight in all - located on the
   chain ref and tested, every one still ending in a clause that is the bare
   word. A guard on the seal path is never strengthened in a way that voids
   a standing seal, so the measurement came first and the hunk second. */
test('(P-A1) - a line whose LAST clause is not the bare word RULED frees nothing', () => {
  const b = bound();
  for (const line of [NOT_RULED_LINE, NOT_YET_RULED_LINE])
    assert.throws(() => api.product(spec({ release: { rulingLineSha256: shaOf(line) } }), b, null),
      /RELEASE-RULING-IS-NOT-A-RULED-LINE/, 'frees nothing: ' + line.slice(-30));
  /* THE REFUSAL NAMES THE LINE, so the PM who wrote one of these can find it,
     and it is a name in the closed vocabulary rather than a bare FAIL. */
  try { api.product(spec({ release: { rulingLineSha256: shaOf(NOT_RULED_LINE) } }), b, null); assert.fail('admitted'); }
  catch (e) { assert.match(e.message, /RELEASE-RULING-IS-NOT-A-RULED-LINE DECISIONS:\d+/); }
  assert(api.FAIL_CODES.has('RELEASE-RULING-IS-NOT-A-RULED-LINE'));
  /* THE CONTROL, and it is the whole of what the strengthening may not cost:
     the fixture's real ruled line, whose last clause IS the bare word, still
     frees both paths and the package still runs to the answer it always gave.
     This is the same shape as every ruling line the measurement enumerated. */
  const out = said(() => assert.equal(api.product(spec(), b, null), 'NOT-IMPLEMENTED'));
  assert.match(out, /2 released under DECISIONS:\d+/);
});

/* ==== (P-A2) A RELEASE IS REFUSED WITHOUT A BOUND PARENT ================
   The first author's own note 4, adopted by the PM in the author's shape.
   B.2 step 6 - you cannot release what the parent never sealed, and the
   declared pre-image is that parent's own pin - stood behind `if (pmap)`.
   A run with no bound parent, or one whose parent artifact carries no
   product map, therefore SKIPPED the step in silence and admitted a release
   of a path nothing had ever sealed. The skip is the defect: there is no
   honest reading of "released" without the seal it is released from, so the
   run refuses by name instead of quietly checking less than it says. */
test('(P-A2) - a declared release with no bound parent product map refuses by name', () => {
  assert.throws(() => api.releaseRuling(spec(), null), /RELEASE-WITHOUT-A-BOUND-PARENT/);
  assert.throws(() => api.product(spec(), null, null), /RELEASE-WITHOUT-A-BOUND-PARENT/);
  /* A bound parent whose artifact carries no product map at all is the same
     refusal, because it is the same missing fact. */
  const b = bound(); delete b.acceptance.product;
  assert.throws(() => api.product(spec(), b, null), /RELEASE-WITHOUT-A-BOUND-PARENT/);
  assert.throws(() => api.proposed(spec(), b), /RELEASE-WITHOUT-A-BOUND-PARENT/);
  /* The refusal NAMES the paths whose parent pin went unchecked. */
  try { api.releaseRuling(spec(), null); assert.fail('admitted'); }
  catch (e) { assert(e.message.includes(RELEASED) && e.message.includes(RELEASED2), e.message); }
  assert(api.FAIL_CODES.has('RELEASE-WITHOUT-A-BOUND-PARENT'));
  /* AND IT COSTS A PACKAGE THAT RELEASES NOTHING NOTHING, which is (X2)'s
     whole question asked of this hunk: the empty grant comes back with no
     parent at all, exactly as it does for every package sealed before this
     role existed, and no ledger is read to produce it. */
  const r = api.releaseRuling(releasesNothing(), null);
  assert.deepEqual([r.at, r.line, [...r.granted], r.declared], [null, null, [], []]);
});

/* ==== (P-A3) THE GRANDPARENT SKIP IS NARROW BY MEASUREMENT ==============
   S9-PREP-RUNNER-REVIEW-R2 N2's own attack (NEW-1), adopted by the PM. H17
   skipped on the PATH NAME alone: `releasedAncestry()` collected the KEYS of
   the ancestors' released blocks, and an ancestor block naming a path at a
   sha256 the grandparent never sealed was believed on its own say-so. It is
   NOT reachable through this runner - proposed() writes lastSealedSha256
   from the pre-image releaseRuling() has already held to the parent pin, and
   the artifact's own byte-pin closes the loop - so this is defence in depth,
   and the reason to write it anyway is that F.1 R9 names "nothing shows" as
   the risk of a skip written too wide. The skip now MEASURES the block
   against the grandparent's own pin for the same path before it fires. */
test('(P-A3) - an ancestor released block at a sha the grandparent never sealed refuses', () => {
  const wrong = bound10({ [RELEASED]: releasedEntry('a'.repeat(64)) });
  assert.throws(() => said(() => api.pins(s10(), wrong)), /ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN/);
  try { said(() => api.pins(s10(), wrong)); assert.fail('admitted'); }
  catch (e) { assert(e.message.includes(RELEASED), 'the refusal names the path: ' + e.message); }
  /* A block entry with no lastSealedSha256 at all is the same refusal: an
     entry that records nothing is not evidence of anything either. */
  const shapeless = bound10({ [RELEASED]: { role: 'released', sealedBy: 'M2-S8-FIXTURE' } });
  assert.throws(() => said(() => api.pins(s10(), shapeless)), /ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN/);
  assert(api.FAIL_CODES.has('ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN'));
  /* THE TWO CONTROLS. The honest block still skips both paths and still says
     how many it stood aside for; and B.8 (12)'s no-op is still a no-op,
     because the assert stands AT THE SKIP inside the grandparent walk and a
     released entry for a path no ancestor ever pinned never reaches it. */
  const plain = said(() => api.pins(s10(), bound10()));
  assert.match(plain, /plus 2 skipped as released by an ancestor artifact's released block/);
  assert.equal(said(() => api.pins(s10(), bound10({ [NEVER_SEALED]: releasedEntry('c'.repeat(64)) }))), plain);
});

/* ==== (P-A4) H13's COUNT SENTENCE, PINNED BY READING THE RUNNER =========
   S9-PREP-RUNNER-REVIEW-R2 BLOCKING-1, and the PM's ruling on it. H13 also
   had to change the AUTHORIZED STEP re-verify COUNT, or it over-counts by
   the number of released paths; B.6 states that in terms. That sentence
   stands PAST the `// 8. main sequence` delimiter this suite slices off at
   its own :193, so no cell in any of the ten lane-B suites can execute it:
   the reviewer reverted the expression and measured NOTHING RED ANYWHERE.
   The hunk is right and the EVIDENCE was a claim, so it is pinned here the
   way B.8 (1b) pins H4 and H5 - by reading the runner's own text - and the
   report's ordinal table names it in that same unreachable class. This cell
   does not drive a hunk; it stops one from being deleted in silence. */
test('(P-A4) - H13 counts the inventory MINUS the released paths, and names them', () => {
  assert(source.includes(
    "Object.values(s.product).filter(p => p.role !== 'released').length + ' pinned product file(s)'"),
    'the AUTHORIZED STEP re-verify counts the inventory minus the released paths');
  assert(source.includes("Object.values(s.product).some(p => p.role === 'released')"),
    'the extra clause is printed only when something was released');
  assert(source.includes("' released and NOT re-verified here,'"),
    'and the released paths are said out loud rather than dropped in silence');
  /* The FILTER stands once, and it is the only count over s.product that
     needed one. The runner says "pinned product file(s)" at a SECOND site,
     the SEALED RUN RECORDED say of the write step, and that one counts
     `wrote.sealedRun.product` - the map H12 has already built without the
     released paths - so a filter there would be a second rule for one fact.
     Measured here rather than asserted from the report: two say sites, one
     filter, and the other site's count is right for H12's reason. */
  assert.equal(source.split("Object.values(s.product).filter(p => p.role !== 'released').length").length - 1, 1);
  assert.equal(source.split("' pinned product file(s)'").length - 1, 2);
  assert(source.includes("if (s.product[file].role !== 'released' && fs.existsSync(rel(file))) product[file] = diskSha(file);"),
    'H12 keeps the released path out of the receipt map the second say counts');
});
