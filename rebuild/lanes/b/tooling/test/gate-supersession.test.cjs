'use strict';
// LANE B — REQUESTS 2026-09-12 08:40 (b), the GATE SUPERSESSION role, PENDING A PM LINE and
// built speculatively under DECISIONS:100. (DECISIONS:147's own (b) is the H3-CORE split and
// says nothing about supersession — TOOLING-REVIEW-r10 F6.)
//
// TWO H3 builders measured the same wall independently. BRIEF-H3-CLEAN-INIT v1.7 §9: the
// five NATIVE-CARRIERS carriers do not PIN rebuild/engine, they RECONSTRUCT it from a frozen
// BASE plus a sha-pinned literal carrier list, so a child that changes an engine byte cannot
// carry them by substitution. BRIEF-H3-CORE §5, with the citation TOOLING-REVIEW-r10
// corrected: `b-ntc-successors.cjs:142` (the `else` branch of the child-state model) refuses
// `Unlisted parent pin drift rebuild/engine/writers.cjs` for H3, and :141/:145 hold every
// declared child supersession and every path `packages/B-NTC.json` declares AT B-NTC'S OWN
// POST — so no child that changes ANY declared file can carry them either.
//
// This suite measures the role and every one of TOOLING-REVIEW-r10's seven findings.
// Method is the house one: compile the REAL runner with only CHAIN_REF re-pointed, asserted
// below to be the only line that differs. The fixture builds its own Git repository; no ref,
// object or commit of the real repository is read.
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
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-r10-supersession-'));
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

// --------------------------------------------- the parent's own covered set, as B-NTC seals it
// Exactly `acceptance-b-ntc-native-trend-context.json`'s `coverage.byChild`: nine of the
// nineteen original gates, covered by five carrier children. The five VALUES are the five
// byte-identity carriers; the nine KEYS are the gates they cover.
const BY_CHILD = {
  'migrate-source': 'source-carriers', 'merge-source': 'source-carriers', 'writers-source': 'source-carriers',
  'witnesses-2': 'inherited-carriers', 'witnesses-5': 'inherited-carriers', 'migrate-differential': 'inherited-carriers',
  'witnesses-7': 'defect-witnesses', 'writers-differential': 'writers-differential', 'second-gate': 'second-gate',
};
const CARRIERS = [...new Set(Object.values(BY_CHILD))];
assert.equal(CARRIERS.length, 5);
const GATES_OF = c => Object.entries(BY_CHILD).filter(([, v]) => v === c).map(([g]) => g).sort();

// ------------------------------------------------------------ the child's own evidence
// TOOLING-REVIEW-r10 F5: each superseded carrier needs evidence of its OWN, the three slots
// may not be one child three times, and every named child must execute a file this package
// declares. So: one red-first cell PER CARRIER, plus two distinct differentials and a census
// cell, and every one of them runs a `role:"new"` product file of this package.
const CELL = c => 'rebuild/m4/workout/test/h3-' + c + '-cells.test.cjs';
const LEGACY = 'rebuild/conform/v4/postfix/legacy-h3-differential.cjs';
const WRITERS = 'rebuild/conform/v4/postfix/writers-h3-differential.cjs';
const CENSUS = 'rebuild/m4/workout/test/h3-census-identity.test.cjs';
const ENGINE_DIFF = 'rebuild/conform/v4/postfix/engine-files-h3-differential.cjs';
const UNRELATED = 'rebuild/m4/spec/h3-unrelated-probe.cjs';
const needleOf = f => 'H3 ' + path.posix.basename(f).toUpperCase() + ': PASS;';
for (const f of [...CARRIERS.map(CELL), LEGACY, WRITERS, CENSUS, UNRELATED])
  write(f, "'use strict';\nconsole.log(" + JSON.stringify(needleOf(f)) + ");\n");
const CELL_CHILD = c => 'h3-cells-' + c;
const LEGACY_CHILD = 'h3-legacy-differential', WRITERS_CHILD = 'h3-writers-differential';
const CENSUS_CHILD = 'h3-census-identity', UNRELATED_CHILD = 'h3-unrelated';
const ENGINE_DIFF_CHILD = 'h3-engine-files-differential';

// ------------------------------- DECISIONS:153 (ii), the named-files differential
// `rebuild/engine` as the PARENT sealed it: three files the parent pins at a post, one the
// parent does not pin at all (so the runner falls back to the parent's `sourceBase` blob),
// and one this package's own brief declares — which is the file the differential must EXCLUDE.
const ENGINE = ['rebuild/engine/plan.cjs', 'rebuild/engine/energy.cjs', 'rebuild/engine/volume.cjs',
  'rebuild/engine/constants.cjs', 'rebuild/engine/writers.cjs'];
const ENGINE_DECLARED = 'rebuild/engine/writers.cjs';           // H3's own brief names this one
for (const f of ENGINE) write(f, "'use strict';\n// " + f + '\nmodule.exports = ' + JSON.stringify(f) + ';\n');
// The runner compares every tracked engine file this package does NOT declare: four of five.
const ENGINE_COMPARED = ENGINE.length - 1;
const ENGINE_NEEDLE = 'H3 ENGINE FILES DIFFERENTIAL: ' + ENGINE_COMPARED +
  ' rebuild/engine file(s) outside the brief byte-identical to the parent post;';
write(ENGINE_DIFF, "'use strict';\nconsole.log(" + JSON.stringify(ENGINE_NEEDLE) + ");\n");

// The PM's line, in the ledger's own shape, carrying the F1 GRANT TOKEN. Everything around
// the token is prose and the runner never reads it; the token, the package id, the carrier
// list and the `RULED` terminal word are the whole of the admission.
// TOOLING-REVIEW-r10b N1: the token BEGINS ITS OWN `·` clause and is the whole of it.
const GRANT = 'GATE-SUPERSESSION M2-H3-CLEAN-INIT ' + CARRIERS.join(',');
const RULING_LINE = '- 2026-09-12 · cowork · LANE B RULINGS — REQUESTS 08:40 (b) RATIFIED: the NATIVE-CARRIERS ' +
  'byte-identity carriers are not inheritable by a child that changes any file the parent spec declares · ' + GRANT + ' · RULED';
// N1's own controls: the same token NEGATED, QUOTED, BRACKETED, EMPHASISED and BACKTICKED
// inside a clause. r10-fix admitted every one of them; none of them begins a clause.
const WRAPPED_LINES = [
  '- 2026-09-12 · cowork · M2-H3-CLEAN-INIT may not ' + GRANT + ' until the cells land · RULED',
  '- 2026-09-12 · cowork · the token would read "' + GRANT + '" if it were granted · RULED',
  '- 2026-09-12 · cowork · (' + GRANT + ') is REFUSED for now · RULED',
  '- 2026-09-12 · cowork · **' + GRANT + '** is under discussion, not ruled · RULED',
  '- 2026-09-12 · cowork · `' + GRANT + '` is the shape a future line would carry · RULED',
];
// r10 F1's own controls, both of which the keyword scan admitted: a line about something
// else that merely CONTAINS the words, and a line that REFUSES the role outright.
const PROSE_LINE = '- 2026-09-12 · cowork · LANE B RULINGS — MOVES_RULING B-NTC-INHERITED-1 RATIFIED AS WRITTEN, ' +
  'exactly as NATIVE-CARRIERS\' inherited-carriers superseded LOAD-WRITES for M2-H3-CLEAN-INIT · RULED';
const REFUSING_LINE = '- 2026-09-12 · cowork · M2-H3-CLEAN-INIT may NOT declare source-carriers SUPERSEDED; ' +
  'REQUESTS 08:40 option (b) is REFUSED and the five carriers stay inheritable · RULED';
// A grant token for somebody else, one naming a gate that is not a byte-identity carrier,
// one naming a single carrier, and one that is not RULED at all.
const OTHER_PACKAGE_LINE = '- 2026-09-12 · cowork · GATE-SUPERSESSION M2-B1-GRADING-TIME-WINDOW second-gate · RULED';
const SIXTH_LINE = '- 2026-09-12 · cowork · GATE-SUPERSESSION M2-H3-CLEAN-INIT conformance · RULED';
const ONE_LINE = '- 2026-09-12 · cowork · GATE-SUPERSESSION M2-H3-CLEAN-INIT second-gate · RULED';
const UNRULED_LINE = '- 2026-09-12 · cowork · GATE-SUPERSESSION M2-H3-CLEAN-INIT source-carriers · PROPOSED';
const LEDGER = [RULING_LINE, PROSE_LINE, REFUSING_LINE, OTHER_PACKAGE_LINE, SIXTH_LINE, ONE_LINE, UNRULED_LINE, ...WRAPPED_LINES];
write('rebuild/DECISIONS.md', [...LEDGER, ''].join('\n'));
const shaOf = line => sha(Buffer.from(line));

git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 'tooling7@earned.local');
git('config', 'user.name', 'lane-b-tooling7');
git('add', '-A'); git('commit', '--quiet', '-m', 'the parent programme and the ledger');
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
    '\nmodule.exports={coverage,supersededSpecShape,supersededGates,supersededGateIds,supersededByCarrier,' +
    'supersessionRuling,proposed,GATE_IDS,BYTE_IDENTITY_CARRIERS,SUPERSESSION_EVIDENCE_KEYS,' +
    'SUPERSESSION_RUNNER_CENSUS,SUPERSESSION_GRANT_SHAPE,SUPERSESSION_STANDING_RULING,' +
    'supersessionEngineIdentity,ENGINE_ROOT,FAIL_CODES,failCode,' +
    'init(){logDir=root;specRaw=Buffer.from("{}");}};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
api.init();

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-r10-supersession-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

const at = f => sha(fs.readFileSync(path.join(scratch, f)));
// The parent artifact as B-NTC SEALED IT — TOOLING-REVIEW-r10 F7. Its `coverage` carries the
// five PRE-r10 keys and no `superseded`/`supersessions`/`supersededByCarrier` at all, because
// it was written by an older runner. Every parent-side reader must read it unchanged.
const PRE_R10_COVERAGE_KEYS = ['covered', 'run', 'moves', 'successors', 'byChild'];
const bound = () => ({
  option: { id: 'B-NTC', artifact: 'rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json', sha256: 'a'.repeat(64),
    review: 'rebuild/m4/spec/review-b-ntc-native-trend-context.json', reviewSha256: 'b'.repeat(64),
    receiptLedgerLine: { ledgerLine: 104, role: 'receipt', line: 'x', lineSha256: 'c'.repeat(64) }, note: null },
  decided: true, reviewedCommit: PARENT_COMMIT,
  acceptance: { product: Object.fromEntries(ENGINE.slice(0, 3).map(f => [f, { pre: at(f), post: at(f), role: 'carried' }])),
    executionPins: {}, sourceBase: PARENT_COMMIT,
    coverage: { covered: Object.keys(BY_CHILD).sort(), run: [], moves: {}, successors: null, byChild: { ...BY_CHILD } } },
});
const WHY = 'the gate reconstructs rebuild/engine byte-for-byte from a frozen BASE and asserts every path the parent spec declares at the parent post';
const evidence = c => ({ laws: null, redFirst: [CELL_CHILD(c)], census: api.SUPERSESSION_RUNNER_CENSUS,
  legacyDifferential: LEGACY_CHILD, writersDifferential: WRITERS_CHILD, engineFilesDifferential: ENGINE_DIFF_CHILD });
const childrenOf = () => [
  ...CARRIERS.map(c => ({ name: CELL_CHILD(c), argv: [CELL(c)], needle: needleOf(CELL(c)) })),
  { name: LEGACY_CHILD, argv: [LEGACY], needle: needleOf(LEGACY) },
  { name: WRITERS_CHILD, argv: [WRITERS], needle: needleOf(WRITERS) },
  { name: CENSUS_CHILD, argv: [CENSUS], needle: needleOf(CENSUS) },
  { name: ENGINE_DIFF_CHILD, argv: [ENGINE_DIFF], needle: ENGINE_NEEDLE },
  { name: UNRELATED_CHILD, argv: [UNRELATED], needle: needleOf(UNRELATED) },
];
// This package's own declared product: its cells, its three differentials, its census cell —
// and the ONE engine file its accepted brief names, which the differential must exclude.
const productOf = () => Object.fromEntries([...CARRIERS.map(CELL), LEGACY, WRITERS, CENSUS, ENGINE_DIFF, ENGINE_DECLARED]
  .map(f => [f, { pre: at(f), post: at(f), role: 'new' }]));
const spec = (carriers = CARRIERS, rulingLineSha256 = shaOf(RULING_LINE)) => ({
  packageId: 'M2-H3-CLEAN-INIT', sourceBase: PARENT_COMMIT, status: 'PROPOSED',
  brief: { file: 'rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md', sha256: 'd'.repeat(64), acceptedLedgerLine: null },
  dIds: [], laws: [], carriedAcceptedIds: [], privateLiveTriggered: [],
  authorizations: { owner: null, contract: null, theme: null, review: null },
  product: productOf(), carrierSuccessor: null, witnessFlips: [], protectedSurfaces: [],
  children: childrenOf(),
  coverage: {
    // Every gate the superseded carriers cover is DROPPED from inherited — that is what
    // "not inheritable" means, and coverage() refuses a spec that keeps one.
    inherited: Object.fromEntries(Object.entries(BY_CHILD).filter(([, c]) => !carriers.includes(c))),
    moves: {}, successors: null,
    superseded: { rulingLineSha256, gates: Object.fromEntries(carriers.map(c => [c, { why: WHY, evidence: evidence(c) }])) },
  },
});
const ran = (red = null) => new Map(childrenOf().map(c =>
  [c.name, { ok: c.name !== red, needle: c.needle, bytes: 400, targets: c.argv, moved: [] }]));
const names = s => new Set(s.children.map(c => c.name));
const shape = s => api.supersededSpecShape(s, names(s));

test('r10 F6 — the role is REQUESTS 08:40 (b), not DECISIONS:147 (b), everywhere it is named', () => {
  assert(!/DECISIONS:147 \(b\)/.test(source), 'no site attributes the role to DECISIONS:147 (b)');
  assert(source.includes('REQUESTS 2026-09-12 08:40 (b)'), 'the runner names the real request');
  assert(source.includes('REQUESTS 08:40 (b) needs a PM line'), 'and so does the user-visible refusal');
  // The r10 note, with TOOLING-REVIEW-r10's citation correction.
  assert(source.includes('b-ntc-successors.cjs:142'), 'the refusing line for H3 is :142, the else branch');
});

test(':153 (ii) — the named-files engine differential, computed by the RUNNER and by the child', () => {
  // The fifth evidence kind the STANDING ROLE adds, and it is a required slot.
  assert.deepEqual(api.SUPERSESSION_EVIDENCE_KEYS,
    ['laws', 'redFirst', 'census', 'legacyDifferential', 'writersDifferential', 'engineFilesDifferential']);
  assert.equal(api.ENGINE_ROOT, 'rebuild/engine/');
  const s = spec(), b = bound();
  // The runner's own comparison: four of the five tracked engine files — every one this
  // package does NOT declare. Three come from the parent's post, one (constants.cjs, which
  // the parent does not pin at all) from the parent's sourceBase blob.
  assert.equal(api.supersessionEngineIdentity(s, b), ENGINE_COMPARED);
  assert(Object.hasOwn(s.product, ENGINE_DECLARED), 'the brief names one engine file');
  assert(!Object.hasOwn(b.acceptance.product, 'rebuild/engine/constants.cjs'), 'and the parent pins one of them nowhere');
  shape(s);
  const got = api.supersededGates(s, b, ran());
  assert.equal(got.get('second-gate').engineCompared, ENGINE_COMPARED);
  // (a) an engine file OUTSIDE the brief that moved refuses by name — the whole point.
  const before = fs.readFileSync(path.join(scratch, 'rebuild/engine/plan.cjs'), 'utf8');
  write('rebuild/engine/plan.cjs', before + '// a byte this package never declared\n');
  assert.throws(() => api.supersessionEngineIdentity(s, b), /SUPERSESSION-ENGINE-FILE-OUTSIDE-THE-BRIEF-MOVED/);
  assert.throws(() => api.supersededGates(s, b, ran()), /SUPERSESSION-ENGINE-FILE-OUTSIDE-THE-BRIEF-MOVED/);
  write('rebuild/engine/plan.cjs', before);
  // (b) the same for the file the parent pins nowhere: the sourceBase blob is the anchor.
  const wasConst = fs.readFileSync(path.join(scratch, 'rebuild/engine/constants.cjs'), 'utf8');
  write('rebuild/engine/constants.cjs', wasConst + '// moved, and the parent has no post for it\n');
  assert.throws(() => api.supersessionEngineIdentity(s, b), /SUPERSESSION-ENGINE-FILE-OUTSIDE-THE-BRIEF-MOVED/);
  write('rebuild/engine/constants.cjs', wasConst);
  // (c) the file the brief DOES name may move freely — that is what "outside the brief" means.
  const wasWriters = fs.readFileSync(path.join(scratch, ENGINE_DECLARED), 'utf8');
  write(ENGINE_DECLARED, wasWriters + '// H3 changes this one, and its brief says so\n');
  const moved = spec(); moved.product[ENGINE_DECLARED] = { pre: at(ENGINE_DECLARED), post: at(ENGINE_DECLARED), role: 'new' };
  assert.equal(api.supersessionEngineIdentity(moved, b), ENGINE_COMPARED);
  write(ENGINE_DECLARED, wasWriters);
  // (d) the child's needle must STATE the runner's own count and claim byte-identity.
  const wrong = spec();
  wrong.children = childrenOf().map(c => c.name === ENGINE_DIFF_CHILD
    ? { ...c, needle: 'H3 ENGINE FILES DIFFERENTIAL: 99 rebuild/engine file(s) byte-identical;' } : c);
  assert.throws(() => api.supersededGates(wrong, b, ran()),
    /GATE-SUPERSESSION-ENGINE-DIFFERENTIAL-NEEDLE-DOES-NOT-STATE-THE-COUNT/);
  const vague = spec();
  vague.children = childrenOf().map(c => c.name === ENGINE_DIFF_CHILD
    ? { ...c, needle: 'H3 ENGINE FILES DIFFERENTIAL: ' + ENGINE_COMPARED + ' file(s) all good;' } : c);
  assert.throws(() => api.supersededGates(vague, b, ran()),
    /GATE-SUPERSESSION-ENGINE-DIFFERENTIAL-NEEDLE-DOES-NOT-CLAIM-BYTE-IDENTITY/);
  // (e) the slot is required, must be a declared child, and must differ from the other two.
  const missing = spec();
  for (const c of CARRIERS) delete missing.coverage.superseded.gates[c].evidence.engineFilesDifferential;
  assert.throws(() => shape(missing), /GATE-SUPERSESSION-EVIDENCE-KEYS-NOT-CLOSED/);
  const dup = spec();
  dup.coverage.superseded.gates['second-gate'].evidence.engineFilesDifferential = LEGACY_CHILD;
  assert.throws(() => shape(dup), /GATE-SUPERSESSION-EVIDENCE-DIFFERENTIALS-ARE-THE-SAME-CHILD/);
  // And the STANDING ROLE's own coordinate is recorded as vocabulary.
  assert.equal(api.SUPERSESSION_STANDING_RULING.at, 153);
  assert.match(api.SUPERSESSION_STANDING_RULING.lineSha256, /^b6f84af6a014/);
  assert(source.includes('whose own token stands inside a prose clause'), 'and the refusal points at it');
});

test('r10b N1 — the token must BEGIN its own · clause; negated, quoted or wrapped frees nothing', () => {
  // r10-fix matched the token after any whitespace, so all five of these ADMITTED five
  // carriers. A ledger clause is the smallest unit a PM writes deliberately, so the grant is
  // one: nothing before the token, nothing after its carrier list.
  for (const line of WRAPPED_LINES)
    assert.throws(() => api.supersessionRuling(spec(CARRIERS, shaOf(line))),
      /GATE-SUPERSESSION-RULING-DOES-NOT-CARRY-THE-GRANT-TOKEN/, 'wrapped token frees nothing: ' + line.slice(30, 70));
  // And the bare grant, alone in its clause, still passes.
  assert.deepEqual([...api.supersessionRuling(spec()).granted].sort(), api.BYTE_IDENTITY_CARRIERS.slice().sort());
});

test('r10 F1 — the grant is a TOKEN, and prose about the role frees nothing', () => {
  assert.equal(api.SUPERSESSION_GRANT_SHAPE,
    'GATE-SUPERSESSION <packageId> <carrier>[,<carrier>…], alone in its own · clause');
  const ok = api.supersessionRuling(spec());
  assert.deepEqual([...ok.granted].sort(), api.BYTE_IDENTITY_CARRIERS.slice().sort());
  assert.equal(ok.line, RULING_LINE);
  // r10's OWN F1 control: DECISIONS:112's shape — a line about MOVES_RULING whose only
  // "grant" is the clause "…inherited-carriers superseded LOAD-WRITES", which the keyword
  // scan ADMITTED. It names the package, carries the word, names a carrier. No token.
  assert.throws(() => api.supersessionRuling(spec(CARRIERS, shaOf(PROSE_LINE))),
    /GATE-SUPERSESSION-RULING-DOES-NOT-CARRY-THE-GRANT-TOKEN/);
  // And r10's second control: a line that REFUSES the role, which also passed all three.
  assert.throws(() => api.supersessionRuling(spec(CARRIERS, shaOf(REFUSING_LINE))),
    /GATE-SUPERSESSION-RULING-DOES-NOT-CARRY-THE-GRANT-TOKEN/);
  assert.throws(() => api.supersessionRuling(spec(CARRIERS, shaOf(OTHER_PACKAGE_LINE))),
    /GATE-SUPERSESSION-RULING-DOES-NOT-NAME-THIS-PACKAGE/);
  assert.throws(() => api.supersessionRuling(spec(CARRIERS, shaOf(SIXTH_LINE))),
    /GATE-SUPERSESSION-RULING-NAMES-A-CARRIER-THAT-IS-NOT-A-BYTE-IDENTITY-GATE/);
  assert.throws(() => api.supersessionRuling(spec(CARRIERS, shaOf(UNRULED_LINE))),
    /GATE-SUPERSESSION-RULING-IS-NOT-A-RULED-LINE/);
  assert.throws(() => api.supersessionRuling(spec(CARRIERS, null)), /GATE-SUPERSESSION-RULING-NOT-CITED/);
  assert.throws(() => api.supersessionRuling(spec(CARRIERS, 'f'.repeat(64))),
    /GATE-SUPERSESSION-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH/);
});

test('r10 F2 — a line naming ONE carrier admits that one alone, and the count is per carrier', () => {
  // r10 measured a line reading "may declare second-gate SUPERSEDED and nothing else"
  // ADMITTING all five carriers and nine gates. The grant is matched carrier by carrier now.
  const one = spec(CARRIERS, shaOf(ONE_LINE));
  shape(one);
  assert.throws(() => api.supersededGates(one, bound(), ran()), /GATE-SUPERSESSION-CARRIER-IS-NOT-IN-THE-RULING/);
  // Declaring only what that line grants is admitted, and it retires ONE gate, not nine.
  const just = spec(['second-gate'], shaOf(ONE_LINE));
  shape(just);
  const got = api.supersededGates(just, bound(), ran());
  assert.deepEqual([...got.keys()], ['second-gate']);
  assert.deepEqual(got.get('second-gate').gates, ['second-gate']);
  // The full grant retires nine gates over five carriers, and the per-carrier map says which.
  const all = api.supersededGates(spec(), bound(), ran());
  assert.equal(all.size, 9);
  assert.deepEqual(api.supersededByCarrier(spec(), bound()), {
    'defect-witnesses': ['witnesses-7'], 'inherited-carriers': ['migrate-differential', 'witnesses-2', 'witnesses-5'],
    'second-gate': ['second-gate'], 'source-carriers': ['merge-source', 'migrate-source', 'writers-source'],
    'writers-differential': ['writers-differential'],
  });
  for (const c of CARRIERS) assert.deepEqual(all.get(GATES_OF(c)[0]).gates, GATES_OF(c));
});

test('r10 F4 — the chain line is RE-READ on every call, so a withdrawal refuses in-process', () => {
  const s = spec();
  assert.equal(api.supersessionRuling(s).line, RULING_LINE);        // first read: ADMITTED
  // r10 deleted the line from the chain mid-run and the cached second call still ADMITTED.
  write('rebuild/DECISIONS.md', [...LEDGER.filter(l => l !== RULING_LINE), ''].join('\n'));
  git('add', '-A'); git('commit', '--quiet', '-m', 'the ruling withdrawn');
  assert.throws(() => api.supersessionRuling(s), /GATE-SUPERSESSION-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH/,
    'the withdrawal refuses WITHIN the process, not only in the next one');
  // Put it back and the same call admits again: nothing is remembered either way.
  write('rebuild/DECISIONS.md', [...LEDGER, ''].join('\n'));
  git('add', '-A'); git('commit', '--quiet', '-m', 'the ruling restored');
  assert.equal(api.supersessionRuling(s).line, RULING_LINE);
  assert(!/SUPERSESSION_KEY|SUPERSESSION_TEXT/.test(source), 'no cache of the supersession line survives in the runner');
});

test('r10 F3 — the seal assert is PHASED, so a supersession package can reach a seal', () => {
  // The exact ACCEPTED-branch block, sliced out of the real runner the way execution-targets
  // slices the Y1 seal block. r10 asserted the map unconditionally, so the FIRST envelope()
  // call of the main sequence — the header-only one, which runs BEFORE coverage() — refused
  // GATE-SUPERSESSION-NOT-ADMITTED-AT-SEAL, and no package declaring a supersession could
  // ever reach a PASS (which needs an authorized review).
  const start = source.indexOf('  if (s.coverage.superseded != null) {', source.indexOf('function envelope('));
  const end = source.indexOf('\n  }\n', start) + 5;
  assert(start > 0 && end > start);
  const block = source.slice(start, end);
  assert(block.includes('if (ran) assert(SUPERSEDED_RESOLVED.size'), 'the assert is phased on `ran`, as Y1 already is');
  const sealBlock = new Function('assert', 's', 'ran', 'supersessionRuling', 'SUPERSEDED_RESOLVED', block);
  const s = spec(), r = ran();
  const resolved = api.supersededGates(s, bound(), r);
  // (a) the FIRST call, header-only, with the map still empty: the ruling is asked, the
  // admitted map is not, and nothing refuses. This is the case r10 measured as fatal.
  sealBlock(assert, s, undefined, api.supersessionRuling, new Map());
  // (b) the END-of-run re-evaluation with the map empty: that IS a real defect and refuses.
  assert.throws(() => sealBlock(assert, s, r, api.supersessionRuling, new Map()),
    /GATE-SUPERSESSION-NOT-ADMITTED-AT-SEAL/);
  // (c) the END-of-run re-evaluation with the map coverage() actually produced: admitted,
  // and the seal continues to Y1, the theme and the brief exactly as for any other package.
  sealBlock(assert, s, r, api.supersessionRuling, resolved);
  // And the phasing is real in the main sequence: the first call passes no `ran` at all,
  // exactly as the Y1 execution half is already phased.
  assert(source.includes('const first = envelope(s, bound);'), 'the first envelope() call is header-only');
  assert(source.includes('if (ran) for (const c of own)'), 'Y1 is phased the same way');
});

test('r10 F5 — per-carrier evidence, distinct slots, and it must bear on this package', () => {
  // (a) one child in three slots — r10 admitted it and reported "3 named child(ren)".
  const thrice = spec();
  for (const c of CARRIERS) {
    const e = thrice.coverage.superseded.gates[c].evidence;
    e.legacyDifferential = CELL_CHILD(c); e.writersDifferential = CELL_CHILD(c);
  }
  assert.throws(() => shape(thrice), /GATE-SUPERSESSION-EVIDENCE-DIFFERENTIALS-ARE-THE-SAME-CHILD/);
  const twice = spec();
  twice.coverage.superseded.gates['second-gate'].evidence.legacyDifferential = CELL_CHILD('second-gate');
  assert.throws(() => shape(twice), /GATE-SUPERSESSION-EVIDENCE-SLOTS-SHARE-A-CHILD/);
  // (b) the SAME evidence set under all five carriers — the real H3 probe's shape.
  const shared = spec();
  for (const c of CARRIERS) shared.coverage.superseded.gates[c].evidence.redFirst = [CELL_CHILD('second-gate')];
  assert.throws(() => shape(shared), /GATE-SUPERSESSION-EVIDENCE-IS-NOT-THIS-CARRIER-OWN/);
  // (c) a child that executes nothing this package declares is not this package's evidence.
  const unrelated = spec();
  unrelated.coverage.superseded.gates['second-gate'].evidence.redFirst = [UNRELATED_CHILD];
  assert.throws(() => shape(unrelated), /GATE-SUPERSESSION-EVIDENCE-CHILD-DOES-NOT-EXECUTE-THIS-PACKAGE-PRODUCT/);
  // (d) the faithful shape, one cell per carrier, is admitted and reports three DIFFERENT
  // children per carrier.
  const s = spec();
  shape(s);
  const got = api.supersededGates(s, bound(), ran());
  for (const c of CARRIERS) {
    const e = got.get(GATES_OF(c)[0]);
    assert.deepEqual(e.executed, [CELL_CHILD(c), LEGACY_CHILD, WRITERS_CHILD, ENGINE_DIFF_CHILD]);
    assert.equal(new Set(e.executed).size, 4);
  }
  // (e) `Required child` carries a code now, so the role's most likely real failure is named.
  assert(api.FAIL_CODES.has('CHILD-REQUIRED-EXIT-ZERO'), 'children() refuses a red child by name');
  assert(!/'Required child '/.test(source), 'and the bare sentence is gone');
  assert.equal(api.failCode('CHILD-REQUIRED-EXIT-ZERO h3-cells; status 1'), 'CHILD-REQUIRED-EXIT-ZERO');
  // The map-level refusals stay as belt-and-braces: children() refuses earlier and harder,
  // and `ran` is empty on the CHILDREN PENDING path, where -NOT-EXECUTED is what fires.
  assert.throws(() => api.supersededGates(s, bound(), new Map()), /GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-EXECUTED/);
  assert.throws(() => api.supersededGates(s, bound(), ran(LEGACY_CHILD)), /GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-GREEN/);
});

test('r10 F7 — a PRE-r10 parent artifact is read unchanged; only its own re-seal recomputes', () => {
  // B-NTC's sealed artifact predates `coverage.superseded`: its `coverage` carries the five
  // pre-r10 keys and nothing else. Every parent-side reader must accept it as it stands.
  const b = bound();
  assert.deepEqual(Object.keys(b.acceptance.coverage).sort(), PRE_R10_COVERAGE_KEYS.slice().sort());
  assert(!Object.hasOwn(b.acceptance.coverage, 'superseded'));
  assert(!Object.hasOwn(b.acceptance.coverage, 'supersessions'));
  const s = spec();
  assert.equal(api.supersededGates(s, b, ran()).size, 9);
  assert.equal(api.supersededGateIds(s, b).length, 9);
  assert.equal(api.coverage(s, b, ran()).size, 0);
  // The same artifact still carries its nine inherited gates for a child that supersedes
  // nothing — the r9b reading, unchanged.
  const none = spec(); none.coverage.superseded = null; none.coverage.inherited = { ...BY_CHILD };
  const b2 = bound(), r = ran();
  none.children = [...childrenOf(), ...CARRIERS.map(c => ({ name: c, argv: [CELL(c)], needle: needleOf(CELL(c)) }))];
  for (const c of CARRIERS) {
    b2.acceptance.executionPins[CELL(c)] = at(CELL(c));
    r.set(c, { ok: true, needle: needleOf(CELL(c)), bytes: 400, targets: [CELL(c)], moved: [] });
  }
  assert.equal(api.coverage(none, b2, r).size, 9);
  // The top-level artifact key set is unchanged from r9b — only the `coverage` sub-object
  // grew, and only in artifacts THIS runner writes.
  const artifact = api.proposed(spec(), bound());
  assert.deepEqual(Object.keys(artifact.coverage).sort(),
    ['byChild', 'covered', 'moves', 'run', 'successors', 'superseded', 'supersededByCarrier', 'supersessions']);
});

test('r10 — the ARTIFACT records the supersession, the per-carrier gates and a disjoint run set', () => {
  const s = spec(), b = bound();
  const artifact = api.proposed(s, b);
  assert.deepEqual(artifact.coverage.covered, []);
  assert.deepEqual(artifact.coverage.superseded, Object.keys(BY_CHILD).sort());
  assert.equal(artifact.coverage.superseded.length + artifact.coverage.run.length, api.GATE_IDS.length);
  assert(!artifact.coverage.run.some(g => artifact.coverage.superseded.includes(g)));
  assert.deepEqual(artifact.coverage.supersededByCarrier['source-carriers'], GATES_OF('source-carriers'));
  assert.equal(artifact.coverage.supersessions.rulingLineSha256, shaOf(RULING_LINE));
  const row = artifact.coverage.supersessions.gates['source-carriers'];
  assert.equal(row.why, WHY);
  assert.equal(row.evidence.laws, null);
  assert.deepEqual(row.evidence.redFirst, [CELL_CHILD('source-carriers')]);
  assert.equal(row.evidence.census, api.SUPERSESSION_RUNNER_CENSUS);
  // A package that declares none records `null` and an empty map, as `successors` does.
  const none = spec(); none.coverage.superseded = null; none.coverage.inherited = { ...BY_CHILD };
  const plain = api.proposed(none, b);
  assert.equal(plain.coverage.supersessions, null);
  assert.deepEqual(plain.coverage.superseded, []);
  assert.deepEqual(plain.coverage.supersededByCarrier, {});
  assert.equal(plain.coverage.run.length, api.GATE_IDS.length - Object.keys(BY_CHILD).length);
});

test('r10 — a sixth gate, a non-parent carrier, and the inherited/superseded conflict', () => {
  for (const sixth of ['cases', 'traces', 'witnesses', 'conformance', 'migrate-full']) {
    const s = spec();
    s.coverage.superseded.gates[sixth] = { why: WHY, evidence: evidence('second-gate') };
    assert.throws(() => shape(s), /GATE-SUPERSESSION-CARRIER-IS-NOT-A-BYTE-IDENTITY-GATE/, 'a sixth gate refuses: ' + sixth);
  }
  const s = spec(['second-gate']);
  const b = bound();
  delete b.acceptance.coverage.byChild['second-gate'];
  s.coverage.inherited = { ...b.acceptance.coverage.byChild };
  assert.throws(() => api.supersededGates(s, b, ran()), /GATE-SUPERSESSION-CARRIER-IS-NOT-A-PARENT-CARRIER/);
  const kept = spec();
  kept.coverage.inherited = { 'second-gate': CELL_CHILD('second-gate') };
  assert.throws(() => api.coverage(kept, bound(), ran()), /GATE-SUPERSESSION-GATE-IS-ALSO-INHERITED/);
});

test('r10 — laws may move only per the child\'s own registered D-ids and an accepted brief', () => {
  const moved = spec();
  for (const c of CARRIERS) moved.coverage.superseded.gates[c].evidence.laws = ['D7'];
  assert.throws(() => shape(moved), /GATE-SUPERSESSION-EVIDENCE-LAWS-MOVED-OUTSIDE-THE-REGISTERED-INVENTORY/);
  moved.dIds = ['D7'];
  assert.throws(() => shape(moved), /GATE-SUPERSESSION-EVIDENCE-LAWS-MOVED-WITHOUT-AN-ACCEPTED-BRIEF/);
  moved.brief.acceptedLedgerLine = { ledgerLine: 146, role: 'brief', line: 'x', lineSha256: 'e'.repeat(64) };
  shape(moved);
  assert.equal(api.supersededGates(moved, bound(), ran()).size, 9);
  // The runner's own census line is evidence only while it says `none`.
  const live = spec();
  live.dIds = ['D7']; live.privateLiveTriggered = ['D7'];
  assert.throws(() => api.supersededGates(live, bound(), ran()), /GATE-SUPERSESSION-EVIDENCE-CENSUS-LINE-IS-NOT-CLEAN/);
});

test('r10 — the block is closed, and every refusal carries a name in the vocabulary', () => {
  const extra = spec(); extra.coverage.superseded.note = 'a key the block does not have';
  assert.throws(() => shape(extra), /GATE-SUPERSESSION-BLOCK-KEYS-NOT-CLOSED/);
  const row = spec(); row.coverage.superseded.gates['second-gate'].note = 'a key a row does not have';
  assert.throws(() => shape(row), /GATE-SUPERSESSION-ROW-KEYS-NOT-CLOSED/);
  const ev = spec(); delete ev.coverage.superseded.gates['second-gate'].evidence.census;
  assert.throws(() => shape(ev), /GATE-SUPERSESSION-EVIDENCE-KEYS-NOT-CLOSED/);
  const why = spec(); why.coverage.superseded.gates['second-gate'].why = 'too short';
  assert.throws(() => shape(why), /GATE-SUPERSESSION-WHY-MISSING/);
  const empty = spec(); empty.coverage.superseded.gates = {};
  assert.throws(() => shape(empty), /GATE-SUPERSESSION-GATES-UNDECLARED/);
  assert.deepEqual(api.SUPERSESSION_EVIDENCE_KEYS,
    ['laws', 'redFirst', 'census', 'legacyDifferential', 'writersDifferential', 'engineFilesDifferential']);
  assert.deepEqual(api.BYTE_IDENTITY_CARRIERS.slice().sort(),
    ['defect-witnesses', 'inherited-carriers', 'second-gate', 'source-carriers', 'writers-differential']);
  for (const code of ['GATE-SUPERSESSION-RULING-NOT-CITED', 'GATE-SUPERSESSION-RULING-LINE-SHA256-SHAPE',
    'GATE-SUPERSESSION-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH',
    'GATE-SUPERSESSION-RULING-IS-NOT-A-RULED-LINE', 'GATE-SUPERSESSION-RULING-DOES-NOT-CARRY-THE-GRANT-TOKEN',
    'GATE-SUPERSESSION-RULING-DOES-NOT-NAME-THIS-PACKAGE',
    'GATE-SUPERSESSION-RULING-NAMES-A-CARRIER-THAT-IS-NOT-A-BYTE-IDENTITY-GATE',
    'GATE-SUPERSESSION-CARRIER-IS-NOT-IN-THE-RULING', 'GATE-SUPERSESSION-BLOCK-KEYS-NOT-CLOSED',
    'GATE-SUPERSESSION-CARRIER-IS-NOT-A-BYTE-IDENTITY-GATE', 'GATE-SUPERSESSION-CARRIER-IS-NOT-A-PARENT-CARRIER',
    'GATE-SUPERSESSION-CARRIER-IS-ALSO-CLAIMED-BY-A-SUCCESSOR', 'GATE-SUPERSESSION-EVIDENCE-KEYS-NOT-CLOSED',
    'GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-DECLARED', 'GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-EXECUTED',
    'GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-GREEN', 'GATE-SUPERSESSION-EVIDENCE-CENSUS-LINE-IS-NOT-CLEAN',
    'GATE-SUPERSESSION-EVIDENCE-LAWS-MOVED-WITHOUT-AN-ACCEPTED-BRIEF', 'GATE-SUPERSESSION-GATE-IS-ALSO-INHERITED',
    'GATE-SUPERSESSION-EVIDENCE-DIFFERENTIALS-ARE-THE-SAME-CHILD', 'GATE-SUPERSESSION-EVIDENCE-SLOTS-SHARE-A-CHILD',
    'GATE-SUPERSESSION-EVIDENCE-IS-NOT-THIS-CARRIER-OWN',
    'GATE-SUPERSESSION-EVIDENCE-CHILD-DOES-NOT-EXECUTE-THIS-PACKAGE-PRODUCT',
    'GATE-SUPERSESSION-NOT-ADMITTED-AT-SEAL', 'GATE-SUPERSESSION-WITHOUT-A-BOUND-PARENT-ARTIFACT',
    'CHILD-REQUIRED-EXIT-ZERO',
    // DECISIONS:153 (ii)'s own four.
    'SUPERSESSION-ENGINE-FILE-OUTSIDE-THE-BRIEF-MOVED', 'SUPERSESSION-ENGINE-PARENT-SOURCEBASE-UNAVAILABLE',
    'SUPERSESSION-ENGINE-DIFFERENTIAL-COMPARED-NOTHING',
    'GATE-SUPERSESSION-ENGINE-DIFFERENTIAL-NEEDLE-DOES-NOT-STATE-THE-COUNT',
    'GATE-SUPERSESSION-ENGINE-DIFFERENTIAL-NEEDLE-DOES-NOT-CLAIM-BYTE-IDENTITY'])
    assert(api.FAIL_CODES.has(code), 'the vocabulary carries ' + code);
});
