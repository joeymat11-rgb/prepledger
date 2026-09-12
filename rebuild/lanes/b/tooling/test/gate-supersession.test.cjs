'use strict';
// LANE B — DECISIONS:147 contingency (b), the GATE SUPERSESSION role, built speculatively
// under :100 while the PM is asked to ratify it as plan of record.
//
// TWO H3 builders measured the same wall independently. BRIEF-H3-CLEAN-INIT v1.7 §9: the
// five NATIVE-CARRIERS carriers do not PIN rebuild/engine, they RECONSTRUCT it from a
// frozen BASE plus a sha-pinned literal carrier list, so a child that changes an engine
// byte cannot carry them by substitution. BRIEF-H3-CORE §5: `b-ntc-successors.cjs:141/:145`
// additionally hold every path `packages/B-NTC.json` declares AT B-NTC'S OWN POST, so no
// child that changes ANY declared file — engine byte or not — can carry them either. The
// role under test lets such a child declare the gate SUPERSEDED and stand its own EXECUTED
// evidence in its place, and it is bounded by the PM's line, by the five carrier names the
// runner fixes, and by the evidence children actually running green in the same run.
//
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

// The child's own evidence children: the red-first cells, the two differentials, and (in one
// case below) a census cell. Each is a real file that prints its needle, because the runner
// is handed the map a real run produced and this suite must be able to build both answers.
const CELLS = 'rebuild/m4/workout/test/h3-clean-init.test.cjs';
const LEGACY = 'rebuild/conform/v4/postfix/legacy-h3-differential.cjs';
const WRITERS = 'rebuild/conform/v4/postfix/writers-h3-differential.cjs';
const CENSUS = 'rebuild/m4/workout/test/h3-census-identity.test.cjs';
for (const [f, needle] of [[CELLS, 'H3 CLEAN INIT CELLS: 9/9 PASS;'], [LEGACY, 'H3 LEGACY DIFFERENTIAL: 9/9 identical'],
  [WRITERS, 'H3 WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;'], [CENSUS, 'H3 PUBLIC CENSUS: byte-identical']])
  write(f, "'use strict';\nconsole.log(" + JSON.stringify(needle) + ");\n");

// The PM's line, in the ledger's own shape. It names this package, grants the supersession
// in the word, and names a byte-identity carrier. A fixture line is exactly what this is:
// the real one does not exist yet, which is why the shipped specs hold `null` and refuse.
const RULING_LINE = '- 2026-09-12 · cowork · LANE B RULINGS — DECISIONS:147 (b) RATIFIED: for M2-H3-CLEAN-INIT the five ' +
  'NATIVE-CARRIERS byte-identity carriers source-carriers, inherited-carriers, defect-witnesses, writers-differential and ' +
  'second-gate are NOT-INHERITABLE by a child that changes any file the parent spec declares; such a child declares them ' +
  'SUPERSEDED in coverage and stands its own executed evidence in their place · RULED';
const OTHER_LINE = '- 2026-09-12 · cowork · a chain line that grants nothing at all to anybody · RULED';
write('rebuild/DECISIONS.md', [OTHER_LINE, RULING_LINE, ''].join('\n'));
const RULING_SHA = sha(Buffer.from(RULING_LINE));
const OTHER_SHA = sha(Buffer.from(OTHER_LINE));

git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 'tooling7@earned.local');
git('config', 'user.name', 'lane-b-tooling7');
git('add', '-A'); git('commit', '--quiet', '-m', 'the parent programme and the ruling');
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
    '\nmodule.exports={coverage,supersededSpecShape,supersededGates,supersededGateIds,supersessionRuling,proposed,' +
    'GATE_IDS,BYTE_IDENTITY_CARRIERS,SUPERSESSION_EVIDENCE_KEYS,SUPERSESSION_RUNNER_CENSUS,FAIL_CODES,' +
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
const bound = () => ({
  option: { id: 'B-NTC', artifact: 'rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json', sha256: 'a'.repeat(64),
    review: 'rebuild/m4/spec/review-b-ntc-native-trend-context.json', reviewSha256: 'b'.repeat(64),
    receiptLedgerLine: { ledgerLine: 104, role: 'receipt', line: 'x', lineSha256: 'c'.repeat(64) }, note: null },
  decided: true, reviewedCommit: PARENT_COMMIT,
  acceptance: { product: {}, executionPins: {}, coverage: { byChild: { ...BY_CHILD } } },
});
// The evidence, in the shape the spec declares it: the 45-law row, the red-first cells, the
// public census, and the two differentials. `laws: null` is "the register did not move".
const evidence = () => ({ laws: null, redFirst: [CELLS_CHILD], census: api.SUPERSESSION_RUNNER_CENSUS,
  legacyDifferential: LEGACY_CHILD, writersDifferential: WRITERS_CHILD });
const CELLS_CHILD = 'h3-cells', LEGACY_CHILD = 'h3-legacy-differential', WRITERS_CHILD = 'h3-writers-differential';
const CENSUS_CHILD = 'h3-census-identity';
const WHY = 'the gate reconstructs rebuild/engine byte-for-byte from a frozen BASE and asserts every path the parent spec declares at the parent post';
const spec = (carriers = CARRIERS, rulingLineSha256 = RULING_SHA) => ({
  packageId: 'M2-H3-CLEAN-INIT', sourceBase: PARENT_COMMIT, status: 'PROPOSED',
  brief: { file: 'rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md', sha256: 'd'.repeat(64), acceptedLedgerLine: null },
  dIds: [], laws: [], carriedAcceptedIds: [], privateLiveTriggered: [],
  authorizations: { owner: null, contract: null, theme: null, review: null },
  product: {}, carrierSuccessor: null, witnessFlips: [], protectedSurfaces: [],
  children: [
    { name: CELLS_CHILD, argv: [CELLS], needle: 'H3 CLEAN INIT CELLS: 9/9 PASS;' },
    { name: LEGACY_CHILD, argv: [LEGACY], needle: 'H3 LEGACY DIFFERENTIAL: 9/9 identical' },
    { name: WRITERS_CHILD, argv: [WRITERS], needle: 'H3 WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;' },
    { name: CENSUS_CHILD, argv: [CENSUS], needle: 'H3 PUBLIC CENSUS: byte-identical' },
  ],
  coverage: {
    // Every gate the superseded carriers cover is DROPPED from inherited — that is what
    // "not inheritable" means, and coverage() refuses a spec that keeps one.
    inherited: Object.fromEntries(Object.entries(BY_CHILD).filter(([, c]) => !carriers.includes(c))),
    moves: {}, successors: null,
    superseded: { rulingLineSha256, gates: Object.fromEntries(carriers.map(c => [c, { why: WHY, evidence: evidence() }])) },
  },
});
const ran = (green = true) => new Map([
  [CELLS_CHILD, { ok: green, needle: 'H3 CLEAN INIT CELLS: 9/9 PASS;', bytes: 400, targets: [CELLS], moved: [] }],
  [LEGACY_CHILD, { ok: true, needle: 'H3 LEGACY DIFFERENTIAL: 9/9 identical', bytes: 400, targets: [LEGACY], moved: [] }],
  [WRITERS_CHILD, { ok: true, needle: 'H3 WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;', bytes: 400, targets: [WRITERS], moved: [] }],
  [CENSUS_CHILD, { ok: true, needle: 'H3 PUBLIC CENSUS: byte-identical', bytes: 400, targets: [CENSUS], moved: [] }],
]);
const names = s => new Set(s.children.map(c => c.name));

test(':147 (b) — the five byte-identity carriers, and only those five, are the role\'s subject', () => {
  assert.deepEqual(api.BYTE_IDENTITY_CARRIERS.slice().sort(),
    ['defect-witnesses', 'inherited-carriers', 'second-gate', 'source-carriers', 'writers-differential']);
  // They are the parent artifact's own byChild VALUES, not a list this runner invented: the
  // nine gates B-NTC covers are covered by exactly these five carrier children.
  assert.deepEqual([...new Set(Object.values(BY_CHILD))].sort(), api.BYTE_IDENTITY_CARRIERS.slice().sort());
  assert.deepEqual(api.SUPERSESSION_EVIDENCE_KEYS,
    ['laws', 'redFirst', 'census', 'legacyDifferential', 'writersDifferential']);
});

test(':147 (b) — an H3-shaped spec with the five superseded and its evidence is ADMITTED', () => {
  const s = spec();
  // The case H3 could not declare: all nine inherited gates gone, none carried, none
  // re-executed, and the child's own four children standing in their place.
  assert.deepEqual(s.coverage.inherited, {});
  api.supersededSpecShape(s, names(s));
  const superseded = api.supersededGates(s, bound(), ran());
  assert.equal(superseded.size, 9, 'the five carriers cover nine of the nineteen gates');
  assert.deepEqual([...new Set([...superseded.values()].map(r => r.carrier))].sort(), api.BYTE_IDENTITY_CARRIERS.slice().sort());
  for (const r of superseded.values()) {
    assert.equal(r.why, WHY);
    assert.deepEqual(r.executed, [CELLS_CHILD, LEGACY_CHILD, WRITERS_CHILD], 'every named child, and the census is the runner\'s own line');
  }
  // And the whole coverage pass runs: nothing is carried, nothing is inherited, and the
  // covered-set bound holds as |byChild| = covered + superseded.
  const covered = api.coverage(s, bound(), ran());
  assert.equal(covered.size, 0);
  // A named child census cell instead of the runner's own line is equally admissible.
  const cell = spec();
  for (const row of Object.values(cell.coverage.superseded.gates)) row.evidence.census = CENSUS_CHILD;
  const withCell = api.supersededGates(cell, bound(), ran());
  assert.equal(withCell.size, 9);
  assert.deepEqual(withCell.get('second-gate').executed, [CELLS_CHILD, LEGACY_CHILD, WRITERS_CHILD, CENSUS_CHILD]);
});

test(':147 (b) — a SIXTH gate refuses by name, in the spec phase and again at run time', () => {
  // The list is fixed in the runner (W7). `cases`, `traces` and `direct` are real parent
  // children and real gate names, and not one of them is a byte-identity reconstruction.
  for (const sixth of ['cases', 'traces', 'witnesses', 'conformance', 'migrate-full']) {
    const s = spec();
    s.coverage.superseded.gates[sixth] = { why: WHY, evidence: evidence() };
    assert.throws(() => api.supersededSpecShape(s, names(s)), /GATE-SUPERSESSION-CARRIER-IS-NOT-A-BYTE-IDENTITY-GATE/,
      'a sixth gate refuses: ' + sixth);
  }
  // And a name that IS one of the five but is NOT a carrier of THIS parent refuses at run
  // time, against the parent artifact's own map rather than against the runner's list.
  const s = spec(['second-gate']);
  const b = bound();
  delete b.acceptance.coverage.byChild['second-gate'];
  s.coverage.inherited = Object.fromEntries(Object.entries(b.acceptance.coverage.byChild));
  assert.throws(() => api.supersededGates(s, b, ran()), /GATE-SUPERSESSION-CARRIER-IS-NOT-A-PARENT-CARRIER/);
});

test(':147 (b) — a MISSING evidence child refuses, at whichever phase can see it', () => {
  // Named but never declared: the spec phase sees it, because `names` is the declared set.
  const undeclared = spec();
  undeclared.coverage.superseded.gates['second-gate'].evidence.legacyDifferential = 'a-child-nobody-declared';
  assert.throws(() => api.supersededSpecShape(undeclared, names(undeclared)), /GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-DECLARED/);
  // Declared and NOT RUN: only the run phase can see that, and it is the difference between
  // evidence and a claim — `ran` is the map built by actually spawning the children.
  const s = spec();
  const short = ran(); short.delete(WRITERS_CHILD);
  assert.throws(() => api.supersededGates(s, bound(), short), /GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-EXECUTED/);
  // The red-first cells cannot be empty either: there is no supersession without them.
  const bare = spec();
  for (const row of Object.values(bare.coverage.superseded.gates)) row.evidence.redFirst = [];
  assert.throws(() => api.supersededSpecShape(bare, names(bare)), /GATE-SUPERSESSION-EVIDENCE-RED-FIRST-UNDECLARED/);
});

test(':147 (b) — an evidence child that ran RED refuses', () => {
  const s = spec();
  assert.throws(() => api.supersededGates(s, bound(), ran(false)), /GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-GREEN/);
  // The runner's own census line is evidence only while it says `none`: a package whose
  // census is live-triggered on one of its own D-ids cannot cite that line for identity.
  const live = spec();
  live.dIds = ['D7']; live.privateLiveTriggered = ['D7'];
  assert.throws(() => api.supersededGates(live, bound(), ran()), /GATE-SUPERSESSION-EVIDENCE-CENSUS-LINE-IS-NOT-CLEAN/);
});

test(':147 (b) — NO RULING refuses, and that is the expected state until the PM writes one', () => {
  // The placeholder. Every shipped spec holds `superseded: null`; a spec that declares the
  // block before the line lands refuses HERE, by name, and reaches no evidence at all.
  const placeholder = spec(CARRIERS, null);
  api.supersededSpecShape(placeholder, names(placeholder));      // the SHAPE is legal
  assert.throws(() => api.supersededGates(placeholder, bound(), ran()), /GATE-SUPERSESSION-RULING-NOT-CITED/);
  // A sha that hashes to no line on the chain branch finds nothing — the bytes are Git's.
  const absent = spec(CARRIERS, 'f'.repeat(64));
  assert.throws(() => api.supersededGates(absent, bound(), ran()),
    /GATE-SUPERSESSION-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH/);
  // A real line on the chain branch that grants nothing is refused on its CONTENT: it does
  // not name this package, so the three content tests are reached in order.
  const other = spec(CARRIERS, OTHER_SHA);
  assert.throws(() => api.supersededGates(other, bound(), ran()), /GATE-SUPERSESSION-RULING-DOES-NOT-NAME-THIS-PACKAGE/);
  // And the grant word and the carrier name are asked too. The runner's own source carries
  // both tests beside each other, so a line naming the package alone frees nothing.
  assert(source.includes('GATE-SUPERSESSION-RULING-DOES-NOT-GRANT-A-SUPERSESSION'));
  assert(source.includes('GATE-SUPERSESSION-RULING-DOES-NOT-NAME-A-BYTE-IDENTITY-CARRIER'));
});

test(':147 (b) — a superseded gate may not ALSO be inherited, and the covered-set bound holds', () => {
  const carrierFile = 'rebuild/m4/spec/b-ntc-second-gate.cjs';
  write(carrierFile, "'use strict';\nconsole.log('NATIVE SECOND GATE:');\n");
  const carried = () => {
    const r = ran();
    r.set('second-gate', { ok: true, needle: 'NATIVE SECOND GATE:', bytes: 400, targets: [carrierFile], moved: [] });
    return r;
  };
  // Superseded AND claimed as inherited. The covering child runs green, so the refusal is
  // the supersession conflict and not the ordinary "child did not execute".
  const kept = spec();
  kept.coverage.inherited = { 'second-gate': 'second-gate' };
  kept.children.push({ name: 'second-gate', argv: [carrierFile], needle: 'NATIVE SECOND GATE:' });
  const keptBound = bound();
  keptBound.acceptance.executionPins[carrierFile] = at(carrierFile);
  assert.throws(() => api.coverage(kept, keptBound, carried()), /GATE-SUPERSESSION-GATE-IS-ALSO-INHERITED/);
  // Four carriers superseded, the fifth still inherited and carried by the parent's own
  // pinned executable: the mixed case, and the bound is covered + superseded = |byChild|.
  const mixed = spec(['source-carriers', 'inherited-carriers', 'defect-witnesses', 'writers-differential']);
  const b = bound();
  b.acceptance.executionPins[carrierFile] = at(carrierFile);
  mixed.children.push({ name: 'second-gate', argv: [carrierFile], needle: 'NATIVE SECOND GATE:' });
  const r = carried();
  assert.deepEqual(mixed.coverage.inherited, { 'second-gate': 'second-gate' });
  const covered = api.coverage(mixed, b, r);
  assert.equal(covered.size, 1, 'one gate still inherited and carried');
  assert.equal(api.supersededGateIds(mixed, b).length, 8, 'eight superseded, and 1 + 8 = the parent\'s nine');
});

test(':147 (b) — the ARTIFACT records the supersession, the evidence names and a disjoint run set', () => {
  const s = spec();
  const b = bound();
  const artifact = api.proposed(s, b);
  assert.deepEqual(artifact.coverage.covered, []);
  assert.deepEqual(artifact.coverage.superseded, Object.keys(BY_CHILD).sort());
  // Disjoint and exhaustive: a superseded gate is neither carried here nor re-executed.
  assert.equal(artifact.coverage.superseded.length + artifact.coverage.run.length, api.GATE_IDS.length);
  assert(!artifact.coverage.run.some(g => artifact.coverage.superseded.includes(g)));
  // The EVIDENCE NAMES travel into the sealed artifact, so a later reader sees what stood in
  // the gate's place without trusting the spec that produced it — and so does the PM line.
  assert.equal(artifact.coverage.supersessions.rulingLineSha256, RULING_SHA);
  assert.deepEqual(Object.keys(artifact.coverage.supersessions.gates).sort(), api.BYTE_IDENTITY_CARRIERS.slice().sort());
  const row = artifact.coverage.supersessions.gates['source-carriers'];
  assert.equal(row.why, WHY);
  assert.equal(row.evidence.laws, null);
  assert.deepEqual(row.evidence.redFirst, [CELLS_CHILD]);
  assert.equal(row.evidence.census, api.SUPERSESSION_RUNNER_CENSUS);
  assert.equal(row.evidence.legacyDifferential, LEGACY_CHILD);
  assert.equal(row.evidence.writersDifferential, WRITERS_CHILD);
  // And a package that declares none records `null`, exactly as `successors` does.
  const none = spec(); none.coverage.superseded = null;
  none.coverage.inherited = { ...BY_CHILD };
  const plain = api.proposed(none, b);
  assert.equal(plain.coverage.supersessions, null);
  assert.deepEqual(plain.coverage.superseded, []);
  assert.equal(plain.coverage.run.length, api.GATE_IDS.length - Object.keys(BY_CHILD).length);
});

test(':147 (b) — laws may move only per the child\'s own accepted brief D-ids', () => {
  // `laws: null` is the unmoved case and needs nothing. A moved register must name D-ids
  // this package REGISTERED, and its brief must itself be accepted: a law cannot move on a
  // spec's word, which is the whole of why the 45-law row is evidence at all.
  const moved = spec();
  for (const row of Object.values(moved.coverage.superseded.gates)) row.evidence.laws = ['D7'];
  assert.throws(() => api.supersededSpecShape(moved, names(moved)),
    /GATE-SUPERSESSION-EVIDENCE-LAWS-MOVED-OUTSIDE-THE-REGISTERED-INVENTORY/);
  moved.dIds = ['D7'];
  assert.throws(() => api.supersededSpecShape(moved, names(moved)),
    /GATE-SUPERSESSION-EVIDENCE-LAWS-MOVED-WITHOUT-AN-ACCEPTED-BRIEF/);
  moved.brief.acceptedLedgerLine = { ledgerLine: 146, role: 'brief', line: 'x', lineSha256: 'e'.repeat(64) };
  api.supersededSpecShape(moved, names(moved));
  assert.equal(api.supersededGates(moved, bound(), ran()).size, 9);
});

test(':147 (b) — the block is closed, and every refusal carries a name in the vocabulary', () => {
  const extra = spec();
  extra.coverage.superseded.note = 'a key the block does not have';
  assert.throws(() => api.supersededSpecShape(extra, names(extra)), /GATE-SUPERSESSION-BLOCK-KEYS-NOT-CLOSED/);
  const row = spec();
  row.coverage.superseded.gates['second-gate'].note = 'a key a row does not have';
  assert.throws(() => api.supersededSpecShape(row, names(row)), /GATE-SUPERSESSION-ROW-KEYS-NOT-CLOSED/);
  const ev = spec();
  delete ev.coverage.superseded.gates['second-gate'].evidence.census;
  assert.throws(() => api.supersededSpecShape(ev, names(ev)), /GATE-SUPERSESSION-EVIDENCE-KEYS-NOT-CLOSED/);
  const why = spec();
  why.coverage.superseded.gates['second-gate'].why = 'too short';
  assert.throws(() => api.supersededSpecShape(why, names(why)), /GATE-SUPERSESSION-WHY-MISSING/);
  for (const code of ['GATE-SUPERSESSION-RULING-NOT-CITED', 'GATE-SUPERSESSION-RULING-LINE-SHA256-SHAPE',
    'GATE-SUPERSESSION-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH',
    'GATE-SUPERSESSION-RULING-DOES-NOT-NAME-THIS-PACKAGE', 'GATE-SUPERSESSION-RULING-DOES-NOT-GRANT-A-SUPERSESSION',
    'GATE-SUPERSESSION-RULING-DOES-NOT-NAME-A-BYTE-IDENTITY-CARRIER', 'GATE-SUPERSESSION-BLOCK-KEYS-NOT-CLOSED',
    'GATE-SUPERSESSION-CARRIER-IS-NOT-A-BYTE-IDENTITY-GATE', 'GATE-SUPERSESSION-CARRIER-IS-NOT-A-PARENT-CARRIER',
    'GATE-SUPERSESSION-CARRIER-IS-ALSO-CLAIMED-BY-A-SUCCESSOR', 'GATE-SUPERSESSION-EVIDENCE-KEYS-NOT-CLOSED',
    'GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-DECLARED', 'GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-EXECUTED',
    'GATE-SUPERSESSION-EVIDENCE-CHILD-NOT-GREEN', 'GATE-SUPERSESSION-EVIDENCE-CENSUS-LINE-IS-NOT-CLEAN',
    'GATE-SUPERSESSION-EVIDENCE-LAWS-MOVED-WITHOUT-AN-ACCEPTED-BRIEF', 'GATE-SUPERSESSION-GATE-IS-ALSO-INHERITED',
    'GATE-SUPERSESSION-NOT-ADMITTED-AT-SEAL', 'GATE-SUPERSESSION-WITHOUT-A-BOUND-PARENT-ARTIFACT'])
    assert(api.FAIL_CODES.has(code), 'the vocabulary carries ' + code);
});
