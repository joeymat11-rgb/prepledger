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
function syntheticPair() {
  const source = fs.readFileSync(SYNTHETIC);
  const local = JSON.parse(source.toString('utf8'));
  local.reads = local.reads.concat([{ d: '2029-12-02', w: 181, note: 'SYNTHETIC local-only', sealed: false }]);
  const sourceFile = path.join(SCRATCH, 'synthetic remote.json');
  const localFile = path.join(SCRATCH, 'synthetic local.json');
  fs.writeFileSync(sourceFile, source);
  fs.writeFileSync(localFile, Buffer.from(JSON.stringify(local), 'utf8'));
  return { sourceFile, localFile, source };
}

test('--local merges the pair, and Windows paths with spaces and backslashes work', async () => {
  const { sourceFile, localFile, source } = syntheticPair();
  // A folder with a space in it, addressed the way a Windows shell would.
  const out = path.join(SCRATCH, 'out dir with spaces');
  const winish = p => (path.sep === '\\' ? p.split('/').join('\\') : p);
  const run = runPort(['--source', winish(sourceFile), '--out', winish(out), '--local', winish(localFile)]);
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
  assert.match(inside.out, /must be OUTSIDE the repository/);
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
