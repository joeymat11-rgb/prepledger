'use strict';
/* rebuild/m3/setup/port/test/port-harden.test.cjs — P3-HARDEN (DECISIONS:454).
   Cases for the two seal-time refusals this ticket adds: (1) malformed-source
   shape/date refusal, (2) synced-folder --out refusal. Public fixture shape
   only (rebuild/conform/fixtures/preimage-2026-08-15.json, cloned and
   mutated in memory); nothing here reads a private or real ledger path. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { unseal } = require('../unseal.cjs');
const { GATE, REPO, shapeIssues, syncedFolderRefusal, outRefusal } = require('../port.cjs');

process.env.MEASURED_TEST_NOW = GATE.clock;
process.env.TZ = GATE.tz;

const PORT = path.join(__dirname, '..', 'port.cjs');
const PREIMAGE = path.join(REPO, 'rebuild', 'conform', 'fixtures', 'preimage-2026-08-15.json');
const BASE = JSON.parse(fs.readFileSync(PREIMAGE, 'utf8'));
const SCRATCH = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-p3h-'));
test.after(() => { try { fs.rmSync(SCRATCH, { recursive: true, force: true }); } catch { /* leave it */ } });

function clone() { return JSON.parse(JSON.stringify(BASE)); }
function writeSource(name, obj) {
  const file = path.join(SCRATCH, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(obj));
  return file;
}
function runPort(args, env) {
  const res = spawnSync(process.execPath, [PORT, ...args], {
    cwd: REPO, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
    env: env ? { ...process.env, ...env } : process.env,
  });
  assert.equal(res.error, undefined, String(res.error));
  return { code: res.status, out: String(res.stdout || '') + String(res.stderr || '') };
}

/* --- (a)/(b) SEAL-TIME MALFORMED SOURCE REFUSAL ----------------------------
   (a) bundle (c) of P3-STAGE (missing exercises + a broken date) is refused
   at seal time with BOTH codes, and NO --out folder is created at all. */
test('BOTH codes: missing exercises + an impossible date refuse together, nothing written', () => {
  const s = clone();
  delete s.exercises;
  s.reads[0] = { ...s.reads[0], d: '2026-13-40' };
  const file = writeSource('stage-c-analog', s);
  const out = path.join(SCRATCH, 'stage-c-out');
  const run = runPort(['--source', file, '--out', out]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /^\d+\. SHAPE\s+FAIL/m);
  assert.match(run.out, /PORT_SOURCE_CLASS_MISSING\s+class exercises is missing/);
  assert.match(run.out, /PORT_SOURCE_DATE_INVALID\s+class reads date at position 0 is invalid: "2026-13-40"/);
  assert.equal(fs.existsSync(out), false, 'nothing written, no folder created');
});

/* (b) exercises: [] (present, EMPTY) must NOT be caught by the new missing-
   class refusal - the decrease rule still governs an empty-but-present class. */
test('a present-but-empty exercises array is not refused by the missing-class check', () => {
  const s = clone();
  s.exercises = [];
  const file = writeSource('empty-exercises', s);
  const out = path.join(SCRATCH, 'empty-exercises-out');
  const run = runPort(['--source', file, '--out', out]);
  assert.ok(!/PORT_SOURCE_CLASS_MISSING/.test(run.out), run.out);
  assert.ok(!/^\d+\. SHAPE\s+FAIL/m.test(run.out), 'SHAPE did not refuse it');
  // it is free to fail later (e.g. the gate, on an engine with no lifts at
  // all) - the only claim here is that the NEW check did not fire.
});

/* (c) one cell per guarded class missing. 'debuts' has no key of its own -
   census derives it from queue (kind==='debut'), so removing queue is the
   same underlying defect as removing debuts, and 'earned' likewise has no key
   of its own (census derives it from feed). Each case removes exactly one
   underlying source field and confirms the CLASS_MISSING refusal names the
   right guarded class, and only that class.
   'waist' is DELIBERATELY EXCLUDED here: m4/workout/athlete-state.cjs's own
   accepted createCleanInitState() never writes a waist member at all (not
   even []), and rebuild/m3/w6/test/local-source-consumer.test.mjs seals
   exactly that shape through the real port.cjs and expects it to succeed. So
   waist's absence is tolerated (see the next test); only its TYPE is checked
   when present. */
const MISSING_CASES = [
  ['reads', s => { delete s.reads; }, 'reads'],
  ['sleep.nights (backs nights)', s => { delete s.sleep.nights; }, 'nights'],
  ['dailyLogs', s => { delete s.dailyLogs; }, 'dailyLogs'],
  ['sessionLog', s => { delete s.sessionLog; }, 'sessionLog'],
  ['exercises', s => { delete s.exercises; }, 'exercises'],
  ['queue (also backs debuts)', s => { delete s.queue; }, 'queue'],
  ['feed (backs earned)', s => { delete s.feed; }, 'earned'],
  ['events', s => { delete s.events; }, 'events'],
];
for (const [label, mutate, expectClass] of MISSING_CASES) {
  test(`missing guarded class: ${label}`, () => {
    const s = clone();
    mutate(s);
    const file = writeSource(`missing-${expectClass}`, s);
    const out = path.join(SCRATCH, `missing-${expectClass}-out`);
    const run = runPort(['--source', file, '--out', out]);
    assert.equal(run.code, 2, run.out);
    assert.match(run.out, new RegExp(`PORT_SOURCE_CLASS_MISSING\\s+class ${expectClass} is missing`));
    assert.equal(fs.existsSync(out), false, `${label}: nothing written`);
  });
}

/* waist: absence is tolerated (see MISSING_CASES comment above), but a wrong
   TYPE, when it is present, is still caught by PORT_SOURCE_SHAPE_INVALID. */
test('waist: absent is tolerated, but a present-and-wrong-typed waist is refused', () => {
  const absent = clone();
  delete absent.waist;
  assert.deepEqual(shapeIssues(absent).filter(i => i.detail.includes('waist')), []);
  const wrongType = clone();
  wrongType.waist = 'not an array';
  const issues = shapeIssues(wrongType);
  assert.ok(issues.some(i => i.code === 'PORT_SOURCE_SHAPE_INVALID' && i.detail.includes('class waist is not a(n) array')));
});

/* (d) the calendar rule itself, exercised through shapeIssues() directly (unit
   level - no child process needed) by placing each candidate date at reads[0].d. */
test('date validity: the same rule admission uses (validDay), through reads[0].d', () => {
  const refused = ['2026-02-30', '2026-00-10', '2026-1-5', '20260105', '2023-02-29'];
  for (const bad of refused) {
    const s = clone();
    s.reads[0] = { ...s.reads[0], d: bad };
    const issues = shapeIssues(s);
    assert.ok(issues.some(i => i.code === 'PORT_SOURCE_DATE_INVALID' && i.detail.includes(JSON.stringify(bad))),
      `${bad} should be refused: ${JSON.stringify(issues)}`);
  }
  const accepted = ['2024-02-29'];
  for (const good of accepted) {
    const s = clone();
    s.reads[0] = { ...s.reads[0], d: good };
    const issues = shapeIssues(s);
    assert.deepEqual(issues.filter(i => i.code === 'PORT_SOURCE_DATE_INVALID'), [], `${good} should be accepted`);
  }
});

/* --- (e) SYNCED-FOLDER --out REFUSAL ---------------------------------------
   outRefusal / syncedFolderRefusal exercised directly: no need to actually
   sync a folder for this check, since it is a NAME/PATH guard, not a live
   sync-state probe. Non-existent target folders resolve through their nearest
   existing ancestor (realPathOf), so these do not need mkdir first. */
test('a folder literally named OneDrive is refused, naming the segment', () => {
  const target = path.join(SCRATCH, 'OneDrive', 'earned-port');
  const refusal = outRefusal(target);
  assert.ok(refusal, 'refused');
  assert.match(refusal, /synced folder \("OneDrive"\)/);
});
test('a folder named Dropbox is refused', () => {
  const refusal = outRefusal(path.join(SCRATCH, 'Dropbox', 'earned-port'));
  assert.match(refusal, /synced folder \("Dropbox"\)/);
});
test('a folder named "Google Drive" is refused', () => {
  const refusal = outRefusal(path.join(SCRATCH, 'Google Drive', 'earned-port'));
  assert.match(refusal, /synced folder \("Google Drive"\)/);
});
test('a case-differing segment (onedrive) is refused too', () => {
  const refusal = outRefusal(path.join(SCRATCH, 'onedrive', 'earned-port'));
  assert.match(refusal, /synced folder \("onedrive"\)/);
});
test('a sibling folder named OneDriveBackup2 is NOT refused (exact segment match only)', () => {
  const refusal = outRefusal(path.join(SCRATCH, 'OneDriveBackup2', 'earned-port'));
  assert.equal(refusal, null, refusal || '');
});
test('a path under %OneDrive% is refused even without the literal segment name', () => {
  const envRoot = path.join(SCRATCH, 'env-onedrive-root');
  fs.mkdirSync(envRoot, { recursive: true });
  const prior = process.env.OneDrive;
  process.env.OneDrive = envRoot;
  try {
    const refusal = outRefusal(path.join(envRoot, 'nested', 'earned-port'));
    assert.match(refusal, /synced folder %OneDrive%/);
    // and a folder OUTSIDE %OneDrive%, with no synced segment, is fine
    assert.equal(outRefusal(path.join(SCRATCH, 'plain-out')), null);
  } finally {
    if (prior === undefined) delete process.env.OneDrive; else process.env.OneDrive = prior;
  }
});

/* (f) the three PRE-EXISTING refusals are byte-identical to before this ticket. */
test('the three pre-existing --out refusals are unchanged, verbatim', () => {
  const inRepo = outRefusal(path.join(REPO, 'rebuild', 'm3', 'setup', 'port', 'nope'));
  assert.match(inRepo, /^inside this repository \(.*\)$/);
  const inRebuildNamed = outRefusal(path.join(SCRATCH, 'rebuild', 'nope'));
  assert.match(inRebuildNamed, /^inside a folder called "rebuild" \(.*\)$/);
  assert.match(inRepo, /^inside this repository \(/, 'string shape unchanged (byte-for-byte prefix)');
});

/* (g) happy path: bundle (a)'s shape (the unmodified public preimage fixture)
   still seals PASS end to end and unseals to the same migrated state. */
test('a well-formed source still seals PASS and round-trips through unseal', () => {
  const out = path.join(SCRATCH, 'happy-out');
  const run = runPort(['--source', PREIMAGE, '--out', out]);
  assert.equal(run.code, 0, run.out);
  assert.match(run.out, /^\d+\. ORACLE\s+PASS/m);
  const bundleFile = fs.readdirSync(out).find(n => /^earned-port-\d{4}-\d{2}-\d{2}\.json$/.test(n));
  const passFile = fs.readdirSync(out).find(n => /-PASSPHRASE\.txt$/.test(n));
  assert.ok(bundleFile && passFile);
  const passphrase = fs.readFileSync(path.join(out, passFile), 'utf8').trim();
  const payload = unseal(fs.readFileSync(path.join(out, bundleFile)), passphrase);
  assert.equal(payload.oracle.verdict, 'PASS');
  assert.equal(payload.dataLoss.safe, true);
});

/* (h) no U+2013/U+2014 in the NEW user-facing strings this ticket adds
   (checked on the actual generated messages, not the whole file - port.cjs
   already carries U+2014 in its pre-existing prose comments, untouched here). */
test('no en dash or em dash in the new refusal messages', () => {
  const s = clone();
  delete s.exercises;
  const issues = shapeIssues(s);
  const shapeText = issues.map(i => i.code + ' ' + i.detail).join('\n');
  const syncedText = [
    outRefusal(path.join(SCRATCH, 'OneDrive', 'x')),
    outRefusal(path.join(SCRATCH, 'Google Drive', 'x')),
  ].join('\n');
  for (const text of [shapeText, syncedText]) {
    assert.ok(!text.includes('–'), 'no U+2013 (en dash): ' + text);
    assert.ok(!text.includes('—'), 'no U+2014 (em dash): ' + text);
  }
});
