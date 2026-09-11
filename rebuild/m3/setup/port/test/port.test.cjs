'use strict';
/* End-to-end, on PUBLIC fixtures only. The private blob is never referenced by
   this file, by the CLI it drives, or by anything either of them loads.

   Each case here runs the real CLI in a child process, because the exit code and
   the exact stdout ARE the deliverable: Joe reads that stdout, and the privacy
   case below asserts that nothing from the ledger is in it. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { pathToFileURL } = require('node:url');
const { unseal } = require('../unseal.cjs');
const { GATE, REPO } = require('../port.cjs');

process.env.MEASURED_TEST_NOW = GATE.clock;
process.env.TZ = GATE.tz;

const PORT = path.join(__dirname, '..', 'port.cjs');
const FIXTURES = path.join(REPO, 'rebuild', 'conform', 'fixtures');
const PREIMAGE = path.join(FIXTURES, 'preimage-2026-08-15.json');
const SYNTHETIC = path.join(FIXTURES, 'synthetic-pending-debut.json');
const STRICT_JSON = path.join(REPO, 'rebuild', 'm3', 'w6', 'strict-json.mjs');
// os.tmpdir(), never a hard-coded /tmp: on Windows that resolves to C:\tmp.
const SCRATCH = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-c2-port-'));
test.after(() => { try { fs.rmSync(SCRATCH, { recursive: true, force: true }); } catch { /* leave it */ } });

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
function runPort(args) {
  const res = spawnSync(process.execPath, [PORT, ...args], {
    cwd: REPO, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
  });
  assert.equal(res.error, undefined, String(res.error));
  return { code: res.status, out: String(res.stdout || '') + String(res.stderr || '') };
}
function bundleIn(dir) {
  const names = fs.readdirSync(dir).filter(n => /^earned-port-\d{4}-\d{2}-\d{2}\.json$/.test(n));
  return names.length === 1 ? path.join(dir, names[0]) : null;
}
function passphraseIn(dir) {
  const names = fs.readdirSync(dir).filter(n => /-PASSPHRASE\.txt$/.test(n));
  assert.equal(names.length, 1, 'exactly one passphrase file');
  return fs.readFileSync(path.join(dir, names[0]), 'utf8').trim();
}

/* The same preparation the CLI performs, done here independently, so the test
   compares the bundle against prepare()'s own output rather than against itself. */
async function prepareHere(sourceBytes, localBytes) {
  const { createImportPreparation } = require('../../../../m4/import/prepare.cjs');
  const engineModule = require(path.join(REPO, GATE.engine));
  const engine = engineModule.__test || engineModule;
  const { parseStrictJson } = await import(pathToFileURL(STRICT_JSON).href);
  return createImportPreparation({ engine, parseStrictJson })
    .prepare(sourceBytes, localBytes ? { localBytes } : undefined);
}

let firstRun = null;
test('the public preimage ports end to end: exit 0, one sealed bundle, the migration inside it', async () => {
  const out = path.join(SCRATCH, 'run1');
  const run = runPort(['--source', PREIMAGE, '--out', out]);
  firstRun = run;
  assert.equal(run.code, 0, run.out);
  const bundleFile = bundleIn(out);
  assert.ok(bundleFile, 'a bundle was written');
  const payload = unseal(fs.readFileSync(bundleFile), passphraseIn(out));

  const sourceBytes = fs.readFileSync(PREIMAGE);
  const expected = await prepareHere(sourceBytes);
  assert.equal(payload.profile, 'earned/local-import-bundle/v1');
  assert.equal(payload.source.sha256, sha256(sourceBytes));
  assert.deepEqual(Buffer.from(payload.source.bytes, 'base64'), sourceBytes, 'the ORIGINAL bytes ride along');
  assert.deepEqual(payload.migrated.state, expected.candidateState());
  assert.equal(payload.migrated.sha256, expected.summary.candidate_sha256);
  assert.equal(payload.engine.schemaV, expected.candidateState().v);
  assert.equal(payload.oracle.verdict, 'PASS');
  assert.equal(payload.oracle.gate.clock, GATE.clock);
  assert.equal(payload.oracle.gate.tz, GATE.tz);
  assert.ok(payload.oracle.gate.laws === 7 || payload.oracle.gate.laws === 10, 'the public gate is 7, the full gate 10');
  for (const mode of payload.oracle.gate.modes) assert.equal(mode.green, mode.total);
  assert.equal(payload.dataLoss.safe, true);
  assert.equal(payload.dataLoss.lost, 0);
  assert.ok(payload.dataLoss.before.reads > 0 && payload.dataLoss.after.reads >= payload.dataLoss.before.reads);
});

test('stdout carries paths, counts, hashes and verdicts — and no ledger value', () => {
  assert.ok(firstRun, 'the end-to-end case ran first');
  const out = firstRun.out;
  const fixture = JSON.parse(fs.readFileSync(PREIMAGE, 'utf8'));
  // Values taken from the fixture itself, not typed in here, so this case keeps
  // testing the right thing if the fixture is ever re-cut.
  const candidates = [
    fixture.trend, fixture.phase, fixture.dexaPred,
    fixture.model && fixture.model.lean, fixture.model && fixture.model.anchorISO,
    fixture.model && fixture.model.src, fixture.rate && fixture.rate.redline,
    ...(fixture.maintenance || []).map(m => m && m.label),
    ...(fixture.reads || []).map(r => r && r.w),
    ...(fixture.exercises || []).map(e => e && e.n),
  ].filter(v => v !== undefined && v !== null && String(v).length >= 4).map(String);
  // A value that is also part of a path we are allowed to print is not evidence.
  const paths = [PREIMAGE, SCRATCH].join(' ');
  const leaked = [...new Set(candidates)].filter(v => !paths.includes(v) && out.includes(v));
  assert.deepEqual(leaked, [], 'these fixture values reached stdout');
  const sourceB64 = fs.readFileSync(PREIMAGE).toString('base64');
  assert.ok(!out.includes(sourceB64.slice(0, 48)), 'the source bytes are not echoed');
  assert.ok(!/"reads"|"sessionLog"|"dailyLogs"\s*:/.test(out), 'no state object is printed');
  const pass = passphraseIn(path.join(SCRATCH, 'run1'));
  assert.ok(!out.includes(pass), 'the passphrase is written to a file, never printed');
  // Individual words are ordinary English and appear in the guidance text; what
  // must never appear is anything SHAPED like the passphrase.
  assert.equal(out.match(/\b[a-z]{2,8}(?:-[a-z]{2,8}){5}\b/g), null, 'nothing passphrase-shaped in stdout');
  assert.match(out, /^1\. SOURCE/m);
  assert.match(out, /^\d+\. ORACLE\s+PASS/m);
});

/* The second half of the synthetic pair: the shipped synthetic fixture plus one
   extra read. Written to the scratch folder — rebuild/conform/ is frozen and is
   never written to by this task. */
function pairFrom(fixture, tag) {
  const source = fs.readFileSync(fixture);
  const local = JSON.parse(source.toString('utf8'));
  local.reads = local.reads.concat([{ d: '2029-12-02', w: 181, note: 'SYNTHETIC local-only', sealed: false }]);
  const sourceFile = path.join(SCRATCH, `${tag} remote.json`);
  const localFile = path.join(SCRATCH, `${tag} local.json`);
  fs.writeFileSync(sourceFile, source);
  fs.writeFileSync(localFile, Buffer.from(JSON.stringify(local), 'utf8'));
  return { sourceFile, localFile, source };
}
const syntheticPair = () => pairFrom(SYNTHETIC, 'synthetic');
const preimagePair = () => pairFrom(PREIMAGE, 'preimage');

const first8 = file => sha256(fs.readFileSync(file)).slice(0, 8);

test('--local merges the pair, and Windows paths with spaces and backslashes work', async () => {
  const { sourceFile, localFile, source } = preimagePair();
  // A folder with a space in it, addressed the way a Windows shell would.
  const out = path.join(SCRATCH, 'out dir with spaces');
  const winish = p => (path.sep === '\\' ? p.split('/').join('\\') : p);
  const run = runPort(['--source', winish(sourceFile), '--out', winish(out),
    '--local', winish(localFile), '--local-confirm', first8(localFile)]);
  assert.equal(run.code, 0, run.out);
  const bundleFile = bundleIn(out);
  assert.ok(bundleFile, 'a bundle was written into the folder with spaces');
  const payload = unseal(fs.readFileSync(bundleFile), passphraseIn(out));
  const expected = await prepareHere(source, fs.readFileSync(localFile));
  assert.deepEqual(payload.migrated.state, expected.candidateState());
  const dates = payload.migrated.state.reads.map(r => r.d);
  assert.ok(dates.includes('2029-12-02'), 'the local-only read survived the merge');
  assert.ok(dates.includes(JSON.parse(source.toString('utf8')).reads[0].d), 'the source reads survived too');
  assert.deepEqual(Buffer.from(payload.local.bytes, 'base64'), fs.readFileSync(localFile));
  assert.equal(payload.dataLoss.safe, true);
  assert.match(run.out, /^\s+counts\s+.*reads \d+->\d+/m, 'the counts line is printed');
  assert.match(run.out, /^2\. LOCAL\s+PASS/m);
  assert.match(run.out, /^\s+local\s+reads \d+->\d+/m, 'the census counts run against the local input too');
  assert.equal(payload.local.relatedness.related, true);
  assert.ok(payload.local.relatedness.shared > 0);
});

/* MEASURED, and the reason the happy path above uses the preimage pair.
   `oracle/make-synthetic.cjs` builds `sleep.nights` as an OBJECT keyed "0".."34";
   the real preimage (and the real ledger) carries an ARRAY. mergeState unions
   nights with _unionBy, which returns [] for a non-array, so merging the
   synthetic pair genuinely drops all 35 nights. dataLossGuard cannot see it —
   `recordCounts.nights` is `arr(...)`, which reads that object as 0 both before
   and after — and census counts() (Object.keys) can. The guard refuses. This is
   a fixture-shape quirk, not an engine defect on real data; the preimage pair
   merges with nights 59->59. Reported, not fixed: conform/ is frozen here. */
test('the counts check refuses a merge that drops a class dataLossGuard reads as empty', () => {
  const { sourceFile, localFile } = syntheticPair();
  const out = path.join(SCRATCH, 'synthetic-merge-out');
  const run = runPort(['--source', sourceFile, '--out', out, '--local', localFile, '--local-confirm', first8(localFile)]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /dataLossGuard\s+safe=true\s+lost=0/, 'the engine guard saw nothing');
  assert.match(run.out, /^\d+\. COUNTS\s+FAIL/m);
  assert.match(run.out, /SHRANK \(source\): nights 35->0/);
  assert.match(run.out, /SHRANK \(local\): nights 35->0/);
  assert.equal(fs.existsSync(out), false, 'nothing written, no folder created');
});

/* The realistic accident: Joe reaches for the wrong export. Before this guard the
   ledger silently doubled into a fictional history and the bundle said PASS. */
test('a wrong-file --local is refused, and --local-inspect says what the file is', () => {
  const shifted = JSON.parse(fs.readFileSync(SYNTHETIC, 'utf8'));
  const bump = d => (typeof d === 'string' && /^\d{4}-/.test(d) ? String(Number(d.slice(0, 4)) + 3) + d.slice(4) : d);
  shifted.reads = shifted.reads.map(r => ({ ...r, d: bump(r.d) }));
  const wrongFile = path.join(SCRATCH, 'wrong export.json');
  fs.writeFileSync(wrongFile, Buffer.from(JSON.stringify(shifted), 'utf8'));
  const out = path.join(SCRATCH, 'wrong-local-out');

  const merge = runPort(['--source', SYNTHETIC, '--out', out, '--local', wrongFile, '--local-confirm', first8(wrongFile)]);
  assert.equal(merge.code, 2, merge.out);
  assert.match(merge.out, /^2\. LOCAL\s+FAIL/m);
  assert.match(merge.out, /LOCAL_UNRELATED/);
  assert.match(merge.out, /readings this file has in common with the source: 0/);
  assert.equal(fs.existsSync(out), false, 'nothing written, no folder created');

  const look = runPort(['--source', SYNTHETIC, '--local', wrongFile, '--local-inspect']);
  assert.equal(look.code, 2, look.out);
  assert.match(look.out, /LOCAL_UNRELATED/);
  assert.match(look.out, /--local-inspect only looks/);
});

test('a genuine --local still needs confirming, and --local-inspect prints what to confirm', () => {
  const { sourceFile, localFile } = syntheticPair();
  const out = path.join(SCRATCH, 'unconfirmed-out');
  const bare = runPort(['--source', sourceFile, '--out', out, '--local', localFile]);
  assert.equal(bare.code, 2, bare.out);
  assert.match(bare.out, /^2\. LOCAL\s+PASS/m, 'it is related');
  assert.match(bare.out, /CONFIRM\s+FAIL/);
  assert.match(bare.out, /--local-confirm is required before a merge/);
  assert.equal(fs.existsSync(out), false, 'nothing written');

  const wrong = runPort(['--source', sourceFile, '--out', out, '--local', localFile, '--local-confirm', 'deadbeef']);
  assert.equal(wrong.code, 2, wrong.out);
  assert.match(wrong.out, /--local-confirm does not match this file/);

  const look = runPort(['--source', sourceFile, '--local', localFile, '--local-inspect']);
  assert.equal(look.code, 0, look.out);
  assert.match(look.out, new RegExp('--local-confirm ' + first8(localFile)));
  assert.match(look.out, /readings this file has in common with the source: \d+/);
  assert.equal(fs.existsSync(out), false, '--local-inspect writes nothing');
});

/* An engine that migrates perfectly but READS the ledger differently: targetsFor
   returns a target one rung high for every lift. prepare() and dataLossGuard see
   nothing wrong — no record moved — and the port-oracle census catches it, which
   is exactly the job the gate is here to do. */
function bittenEngine() {
  const dir = fs.mkdtempSync(path.join(SCRATCH, 'bitten-'));
  const shim = path.join(REPO, GATE.engine).split(path.sep).join('/');
  const file = path.join(dir, 'bitten-engine.cjs');
  fs.writeFileSync(file, [
    "'use strict';",
    `const T = require('${shim}').__test;`,
    'module.exports = { __test: { ...T, targetsFor: (ex, st) => {',
    '  const t = T.targetsFor(ex, st);',
    '  return Array.isArray(t) ? t.map((x, i) => (i === 0 && typeof x === "number" ? x + 1 : x)) : t;',
    '} } };',
    '',
  ].join('\n'));
  return file;
}

test('a gate that is not GREEN stops the port: exit 2 and no bundle at all', () => {
  const out = path.join(SCRATCH, 'refused');
  const run = runPort(['--source', PREIMAGE, '--out', out, '--engine', bittenEngine()]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /^\d+\. ORACLE\s+FAIL/m);
  assert.match(run.out, /NO BUNDLE WRITTEN/);
  assert.match(run.out, /not GREEN: (frozen|unfrozen):FAIL PORT-/);
  assert.equal(fs.existsSync(out) ? bundleIn(out) : null, null, 'nothing was written');
  if (fs.existsSync(out)) assert.deepEqual(fs.readdirSync(out), [], 'not even a passphrase file');
});

test('the CLI refuses to write inside the repository, and refuses an unknown argument', () => {
  const inside = runPort(['--source', PREIMAGE, '--out', path.join(REPO, 'rebuild', 'm3', 'setup', 'port', 'nope')]);
  assert.equal(inside.code, 1, inside.out);
  assert.match(inside.out, /--out is inside this repository/);
  assert.equal(fs.existsSync(path.join(REPO, 'rebuild', 'm3', 'setup', 'port', 'nope')), false);
  const bogus = runPort(['--source', PREIMAGE, '--out', path.join(SCRATCH, 'x'), '--wat', '1']);
  assert.equal(bogus.code, 1, bogus.out);
  assert.match(bogus.out, /unknown argument --wat/);
  const missing = runPort(['--source', path.join(SCRATCH, 'not-here.json'), '--out', path.join(SCRATCH, 'y')]);
  assert.equal(missing.code, 1, missing.out);
  assert.match(missing.out, /--source not found/);
});

/* A corrupted SOURCE never reaches the gate: prepare.cjs refuses it first, with
   a fixed code that carries no athlete fact. The W6 strict parser is what makes
   the duplicate-key case a refusal rather than a silent last-one-wins. */
test('a corrupted source is refused before anything is written', () => {
  const raw = fs.readFileSync(PREIMAGE, 'utf8');
  const cases = [
    ['truncated', raw.slice(0, Math.floor(raw.length / 2)), /IMPORT_SOURCE_JSON_INVALID/],
    ['duplicate key', '{"v":54,"v":60' + raw.slice(raw.indexOf(',')), /IMPORT_SOURCE_JSON_INVALID/],
    ['future schema', raw.replace('{"v":54', '{"v":9999'), /IMPORT_SOURCE_FUTURE_SCHEMA/],
    ['not an object', '[1,2,3]', /IMPORT_SOURCE_(JSON_INVALID|SCHEMA_REQUIRED)/],
  ];
  for (const [name, body, expected] of cases) {
    const file = path.join(SCRATCH, `corrupt-${name.replace(/\W+/g, '-')}.json`);
    fs.writeFileSync(file, body);
    const out = path.join(SCRATCH, `corrupt-out-${name.replace(/\W+/g, '-')}`);
    const run = runPort(['--source', file, '--out', out]);
    assert.equal(run.code, 2, `${name}: ${run.out}`);
    assert.match(run.out, expected, name);
    assert.equal(fs.existsSync(out), false, `${name}: no output folder was created`);
  }
});

/* The engine is never mutated: each of these writes a NEW module beside the
   scratch folder that requires the real shim and overrides one function. The
   repository copy is not touched, so there are no bytes to restore. */
function engineOverriding(tag, body) {
  const dir = fs.mkdtempSync(path.join(SCRATCH, tag + '-'));
  const shim = path.join(REPO, GATE.engine).split(path.sep).join('/');
  const file = path.join(dir, tag + '-engine.cjs');
  fs.writeFileSync(file, ["'use strict';", `const T = require('${shim}').__test;`, body, ''].join('\n'));
  return file;
}

/* dataLossGuard was measured NOT to protect the queue: empty it and the guard
   still answers safe. The census counts check is the thing that must refuse. */
test('a class the dataLossGuard does not cover: an emptied queue is caught by the counts check', () => {
  const engine = engineOverriding('dropqueue',
    'module.exports = { __test: { ...T, migrate: s => { const out = T.migrate(s); out.queue = []; return out; } } };');
  const out = path.join(SCRATCH, 'dropped-queue-out');
  const run = runPort(['--source', PREIMAGE, '--out', out, '--engine', engine]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /^\d+\. PREPARE\s+PASS/m, 'prepare and dataLossGuard were happy');
  assert.match(run.out, /dataLossGuard\s+safe=true\s+lost=0/);
  assert.match(run.out, /^\d+\. COUNTS\s+FAIL/m);
  assert.match(run.out, /SHRANK \(source\): queue 18->0/);
  assert.match(run.out, /NO BUNDLE WRITTEN/);
  assert.equal(fs.existsSync(out), false, 'nothing written, no folder created');
});

test('an emptied exercises list is caught too, and the gate is never reached', () => {
  const engine = engineOverriding('dropex',
    'module.exports = { __test: { ...T, migrate: s => { const out = T.migrate(s); out.exercises = []; return out; } } };');
  const out = path.join(SCRATCH, 'dropped-ex-out');
  const run = runPort(['--source', PREIMAGE, '--out', out, '--engine', engine]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /SHRANK \(source\): exercises \d+->0/);
  assert.ok(!/ORACLE/.test(run.out), 'a shrink stops the run before the gate');
  assert.equal(fs.existsSync(out), false);
});

/* --- THE TWO WINDOWS SPELLINGS THAT WALKED THROUGH THE FIRST GUARD ---------
   The independent reviewer wrote the sealed bundle AND the plaintext passphrase
   into the tracked worktree twice: once through a directory junction, once
   through an 8.3 short name. path.resolve() sees neither; realpath sees both.
   These two cases are the regression, and they check the REPOSITORY as well as
   the exit code — a pass here means nothing landed in the tree. */
const IN_REPO_TARGET = path.join(REPO, 'rebuild', 'm3', 'setup', 'port');
// Argument arrays, not a command line: spawnSync's own quoting mangles the
// embedded quotes cmd needs, which is how these two probes came to "skip".
function cmd(args) {
  const res = spawnSync('cmd', ['/c', ...args], { encoding: 'utf8' });
  return { code: res.status, out: String(res.stdout || '') + String(res.stderr || '') };
}
/* `for %A in (path) do @echo %~sA` is the only way to ask Windows for a short
   name from a shell, and it has to live in a .bat (where the token is %%A). */
function shortNameOf(target) {
  const bat = path.join(SCRATCH, 'shortname.bat');
  fs.writeFileSync(bat, `@echo off\r\nfor %%A in ("${target}") do @echo %%~sA\r\n`);
  const res = cmd([bat]);
  const line = res.out.trim().split(/\r?\n/).pop();
  return res.code === 0 && line ? line.trim() : '';
}
function skipUnlessWindows(t) {
  if (path.sep !== '\\') { t.skip('Windows-only: junctions and 8.3 short names'); return true; }
  return false;
}
function assertNothingLanded(leaf) {
  const landed = path.join(IN_REPO_TARGET, leaf);
  const existed = fs.existsSync(landed);
  if (existed) fs.rmSync(landed, { recursive: true, force: true });   // never leave it behind
  assert.equal(existed, false, `${landed} was created inside the tracked worktree`);
}

test('--out through a directory junction into the worktree is refused', t => {
  if (skipUnlessWindows(t)) return;
  const junction = path.join(SCRATCH, 'junc');
  const made = cmd(['mklink', '/J', junction, IN_REPO_TARGET]);
  if (made.code !== 0 || !fs.existsSync(junction)) { t.skip('mklink /J unavailable here: ' + made.out.trim()); return; }
  try {
    // The junction really does reach the worktree: prove it before proving the refusal.
    assert.ok(fs.existsSync(path.join(junction, 'port.cjs')), 'the junction resolves into the repository');
    const run = runPort(['--source', PREIMAGE, '--out', path.join(junction, 'viajunction')]);
    assert.equal(run.code, 1, run.out);
    assert.match(run.out, /--out is inside (this repository|a git working tree|a folder called "rebuild")/);
    assertNothingLanded('viajunction');
  } finally { cmd(['rmdir', junction]); }
});

test('--out through an 8.3 short path into the worktree is refused', t => {
  if (skipUnlessWindows(t)) return;
  const short = shortNameOf(IN_REPO_TARGET);
  if (!short.includes('~')) { t.skip('8.3 short names are off on this volume'); return; }
  assert.notEqual(short.toLowerCase(), IN_REPO_TARGET.toLowerCase(), 'the probe produced a genuinely different spelling');
  assert.ok(fs.existsSync(path.join(short, 'port.cjs')), 'the short path resolves into the repository');
  const run = runPort(['--source', PREIMAGE, '--out', path.join(short, 'viashort')]);
  assert.equal(run.code, 1, run.out);
  assert.match(run.out, /--out is inside (this repository|a git working tree|a folder called "rebuild")/);
  assertNothingLanded('viashort');
});

test('realpath is what decides: both spellings resolve to the repository', t => {
  if (skipUnlessWindows(t)) return;
  const { realPathOf, insideRepo, REPO_REAL } = require('../port.cjs');
  const short = shortNameOf(IN_REPO_TARGET);
  assert.equal(insideRepo(IN_REPO_TARGET), true);
  assert.ok(REPO_REAL.length > 0);
  if (short.includes('~')) {
    assert.equal(realPathOf(short).toLowerCase(), IN_REPO_TARGET.toLowerCase(), 'short name resolves to the long one');
    assert.equal(insideRepo(short), true);
  }
  // and a folder that does not exist yet still resolves through its ancestors
  assert.equal(insideRepo(path.join(IN_REPO_TARGET, 'does', 'not', 'exist')), true);
  assert.equal(insideRepo(SCRATCH), false);
});
