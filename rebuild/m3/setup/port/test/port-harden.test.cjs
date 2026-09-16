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
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { unseal } = require('../unseal.cjs');
const { GATE, REPO, shapeIssues, syncedFolderRefusal, outRefusal, realPathOf } = require('../port.cjs');

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

/* (f) the three PRE-EXISTING refusals, asserted BYTE-FOR-BYTE against this
   worktree's own wording (not a regex shape), including the git-working-tree
   refusal a prior round of this cell omitted entirely. */
test('the three pre-existing --out refusals are unchanged, byte-for-byte', () => {
  const repoTarget = path.join(REPO, 'rebuild', 'm3', 'setup', 'port', 'nope');
  assert.equal(outRefusal(repoTarget), `inside this repository (${realPathOf(repoTarget)})`);

  const treeRoot = path.join(SCRATCH, 'fake-worktree');
  fs.mkdirSync(treeRoot, { recursive: true });
  fs.writeFileSync(path.join(treeRoot, '.git'), 'gitdir: /elsewhere\n');
  try {
    const treeTarget = path.join(treeRoot, 'nested', 'out');
    assert.equal(outRefusal(treeTarget),
      `inside a git working tree (${realPathOf(treeRoot)}) - a commit there could publish it`);
  } finally {
    fs.rmSync(path.join(treeRoot, '.git'), { force: true });
  }

  const namedTarget = path.join(SCRATCH, 'rebuild', 'nope');
  assert.equal(outRefusal(namedTarget), `inside a folder called "rebuild" (${realPathOf(namedTarget)})`);
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


/* --- P3-HARDEN ROUND 2 (PM order, DECISIONS:431 point 17) ------------------
   (i) nights are no longer pre-guarded by `typeof entry.d === 'string'`: a
   numeric d and an object d both refuse now (as PORT_SOURCE_DATE_INVALID,
   same as a malformed string would), and a night with NO d at all refuses as
   PORT_SOURCE_SHAPE_INVALID rather than sealing PASS silently. */
test('sleep.nights: numeric d, missing d and object d are all refused', () => {
  const numeric = clone();
  numeric.sleep.nights[0] = { ...numeric.sleep.nights[0], d: 20260610 };
  const numericIssues = shapeIssues(numeric);
  assert.ok(numericIssues.some(i => i.code === 'PORT_SOURCE_DATE_INVALID' && i.detail.startsWith('class nights')),
    JSON.stringify(numericIssues));

  const missing = clone();
  delete missing.sleep.nights[0].d;
  const missingIssues = shapeIssues(missing);
  assert.ok(missingIssues.some(i => i.code === 'PORT_SOURCE_SHAPE_INVALID' &&
    i.detail === 'class nights entry at position 0 is missing d'), JSON.stringify(missingIssues));

  const objectD = clone();
  objectD.sleep.nights[0] = { ...objectD.sleep.nights[0], d: { evil: 'ledger-secret' } };
  const objectIssues = shapeIssues(objectD);
  const dateIssue = objectIssues.find(i => i.code === 'PORT_SOURCE_DATE_INVALID' && i.detail.startsWith('class nights'));
  assert.ok(dateIssue, JSON.stringify(objectIssues));
  assert.ok(!dateIssue.detail.includes('evil'), 'no object key leaked: ' + dateIssue.detail);
  assert.ok(!dateIssue.detail.includes('ledger-secret'), 'no object value leaked: ' + dateIssue.detail);
  assert.match(dateIssue.detail, /<object>$/);
});

/* (j) Opus MINOR 3 (cosmetic): a nulled class reports "null", not "object"
   (typeof null), and an object-shaped sleep.nights entry names the entry's
   KEY, not a numeric "position". */
test('cosmetic: a nulled class reports "null" (not "object")', () => {
  const s = clone();
  s.dailyLogs = null;
  const issues = shapeIssues(s);
  assert.ok(issues.some(i => i.code === 'PORT_SOURCE_SHAPE_INVALID' &&
    i.detail === 'class dailyLogs is not a(n) object (got null)'), JSON.stringify(issues));
});
test('cosmetic: object-shaped nights (synthetic-fixture shape) name the KEY', () => {
  const s = clone();
  s.sleep.nights = { '7': { d: null, h: 7 } };
  const issues = shapeIssues(s);
  const issue = issues.find(i => i.code === 'PORT_SOURCE_DATE_INVALID');
  assert.ok(issue, JSON.stringify(issues));
  assert.equal(issue.detail, 'class nights date at key 7 is invalid: <null>');
});

/* (k) corrections: _fileCorr (engine/migrate.cjs, read-only) writes
   {op:"kind:YYYY-MM-DD:id", kind, at:ISO}, never a top-level `d`. The old
   check read entry.d and was vacuous; this validates the day embedded in
   `op` and that `at` parses. */
test('corrections: op day 2026-02-30 refuses', () => {
  const day = Object.keys(BASE.sessionLog)[0];
  const s = clone();
  s.sessionLog[day].corrLog = [{ op: 'edit:2026-02-30:x1', kind: 'edit', at: new Date().toISOString() }];
  const issues = shapeIssues(s);
  assert.ok(issues.some(i => i.code === 'PORT_SOURCE_DATE_INVALID' && i.detail.startsWith('class corrections date')),
    JSON.stringify(issues));
});
test('corrections: a malformed op (no kind:date:id shape) refuses', () => {
  const day = Object.keys(BASE.sessionLog)[0];
  const s = clone();
  s.sessionLog[day].corrLog = [{ op: 'not-shaped-right', at: new Date().toISOString() }];
  const issues = shapeIssues(s);
  assert.ok(issues.some(i => i.code === 'PORT_SOURCE_SHAPE_INVALID' && i.detail.includes('malformed op')),
    JSON.stringify(issues));
});
test('corrections: an unparsable at refuses', () => {
  const day = Object.keys(BASE.sessionLog)[0];
  const s = clone();
  s.sessionLog[day].corrLog = [{ op: `edit:${day}:x1`, kind: 'edit', at: 'not-a-date' }];
  const issues = shapeIssues(s);
  assert.ok(issues.some(i => i.code === 'PORT_SOURCE_DATE_INVALID' && i.detail.startsWith('class corrections-at')),
    JSON.stringify(issues));
});
test('corrections: a valid op and at are accepted', () => {
  const day = Object.keys(BASE.sessionLog)[0];
  const s = clone();
  s.sessionLog[day].corrLog = [{ op: `edit:${day}:x1`, kind: 'edit', at: new Date().toISOString() }];
  const issues = shapeIssues(s).filter(i => i.detail.includes('corrections'));
  assert.deepEqual(issues, []);
});

/* (l) --local is now shape-checked too, before the gate, with codes prefixed
   "local:". A clean source cannot save a malformed --local. */
function sha256First8(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 8); }

test('--local with a bad date refuses (local:PORT_SOURCE_DATE_INVALID), nothing written', () => {
  const local = clone();
  local.reads[9] = { ...local.reads[9], d: '2026-13-40' };
  const sourceFile = writeSource('local-baddate-source', clone());
  const localFile = writeSource('local-baddate-local', local);
  const confirm = sha256First8(fs.readFileSync(localFile));
  const out = path.join(SCRATCH, 'local-baddate-out');
  const run = runPort(['--source', sourceFile, '--local', localFile, '--local-confirm', confirm, '--out', out]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /local:PORT_SOURCE_DATE_INVALID/);
  assert.equal(fs.existsSync(out), false, 'nothing written');
});
test('--local with a missing class refuses (local:PORT_SOURCE_CLASS_MISSING), nothing written', () => {
  const local = clone();
  delete local.exercises;
  const sourceFile = writeSource('local-missing-source', clone());
  const localFile = writeSource('local-missing-local', local);
  const confirm = sha256First8(fs.readFileSync(localFile));
  const out = path.join(SCRATCH, 'local-missing-out');
  const run = runPort(['--source', sourceFile, '--local', localFile, '--local-confirm', confirm, '--out', out]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /local:PORT_SOURCE_CLASS_MISSING\s+class exercises is missing/);
  assert.equal(fs.existsSync(out), false, 'nothing written');
});
test('a clean --local still seals PASS (the new check does not over-refuse)', () => {
  const sourceFile = writeSource('local-clean-source', clone());
  const localFile = writeSource('local-clean-local', clone());
  const confirm = sha256First8(fs.readFileSync(localFile));
  const out = path.join(SCRATCH, 'local-clean-out');
  const run = runPort(['--source', sourceFile, '--local', localFile, '--local-confirm', confirm, '--out', out]);
  assert.equal(run.code, 0, run.out);
  assert.match(run.out, /^\d+\. ORACLE\s+PASS/m);
});

/* (m) privacy: an object d on a READ (the exact repro from review round 3) is
   never echoed whole or in part - only its type. */
test('privacy: an object reads[].d never echoes the object\'s keys or values', () => {
  const s = clone();
  s.reads[2] = { ...s.reads[2], d: { secret: 'do-not-print', w: 999 } };
  const issues = shapeIssues(s);
  const issue = issues.find(i => i.code === 'PORT_SOURCE_DATE_INVALID' && i.detail.startsWith('class reads'));
  assert.ok(issue, JSON.stringify(issues));
  assert.equal(issue.detail, 'class reads date at position 2 is invalid: <object>');
  assert.ok(!issue.detail.includes('secret'), issue.detail);
  assert.ok(!issue.detail.includes('do-not-print'), issue.detail);
});

/* (n) a malformed STRING date is still echoed, truncated to 10 characters. */
test('a malformed string date is still echoed, truncated to 10 characters', () => {
  const s = clone();
  s.reads[0] = { ...s.reads[0], d: '2026-99-99-way-too-long' };
  const issues = shapeIssues(s);
  const issue = issues.find(i => i.code === 'PORT_SOURCE_DATE_INVALID' && i.detail.startsWith('class reads'));
  assert.ok(issue, JSON.stringify(issues));
  // A truncated echo carries a trailing "..." (round 3, Fable r5 NOTE 7) so
  // it can never be mistaken for a valid, whole 10-character date.
  assert.equal(issue.detail, 'class reads date at position 0 is invalid: "2026-99-99"...');
});

/* --- P3-HARDEN ROUND 3 (PM order, round-2 review r4/r5 findings) ----------- */

/* Finding 1 (Opus r4 / Fable r5, MAJOR): a night entry that is not an object
   at all used to be silently skipped (`continue`), admitting null, a string,
   a number, a boolean, or (via a keyed-nights container) a scalar entry.
   Every one of those now refuses PORT_SOURCE_SHAPE_INVALID naming the index. */
test('finding 1: a non-object night entry (null/string/number/boolean) refuses, does not seal PASS', () => {
  const cases = [
    ['null', null], ['string', 'a-string-night'], ['number', 42], ['boolean', true],
  ];
  for (const [label, bad] of cases) {
    const s = clone();
    s.sleep.nights[0] = bad;
    const issues = shapeIssues(s);
    assert.ok(issues.some(i => i.code === 'PORT_SOURCE_SHAPE_INVALID' &&
      i.detail === `class nights entry at position 0 is not an object (got ${typeof bad === 'object' ? 'null' : typeof bad})`),
      `${label}: ${JSON.stringify(issues)}`);
  }
});
test('finding 1: object-shaped nights with a scalar entry ({a: 1}) refuses too', () => {
  const s = clone();
  s.sleep.nights = { a: 1 };
  const issues = shapeIssues(s);
  assert.ok(issues.some(i => i.code === 'PORT_SOURCE_SHAPE_INVALID' &&
    i.detail === 'class nights entry at key a is not an object (got number)'), JSON.stringify(issues));
});
test('finding 1 end to end: sleep.nights[0] = null no longer seals PASS', () => {
  const s = clone();
  s.sleep.nights[0] = null;
  const file = writeSource('nights-null-source', s);
  const out = path.join(SCRATCH, 'nights-null-out');
  const run = runPort(['--source', file, '--out', out]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /PORT_SOURCE_SHAPE_INVALID\s+class nights entry at position 0 is not an object/);
  assert.equal(fs.existsSync(out), false, 'nothing written');
});
test('finding 1 via --local: a non-object night entry refuses local:PORT_SOURCE_SHAPE_INVALID', () => {
  const local = clone();
  local.sleep.nights[0] = 'a-string-night';
  const sourceFile = writeSource('local-nights-source', clone());
  const localFile = writeSource('local-nights-local', local);
  const confirm = sha256First8(fs.readFileSync(localFile));
  const out = path.join(SCRATCH, 'local-nights-out');
  const run = runPort(['--source', sourceFile, '--local', localFile, '--local-confirm', confirm, '--out', out]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /local:PORT_SOURCE_SHAPE_INVALID\s+class nights entry at position 0 is not an object/);
  assert.equal(fs.existsSync(out), false, 'nothing written');
});

/* Finding 2 (Fable r5, MAJOR): the --local shape check now runs on the RAW
   parsed --local, right after it is read, before relatedness or prepare can
   crash on a wrong-typed ARRAY class with a bare JavaScript error. */
test('finding 2: --local queue={} refuses local:PORT_SOURCE_SHAPE_INVALID, not a crash', () => {
  const local = clone();
  local.queue = {};
  const sourceFile = writeSource('local-queueobj-source', clone());
  const localFile = writeSource('local-queueobj-local', local);
  const confirm = sha256First8(fs.readFileSync(localFile));
  const out = path.join(SCRATCH, 'local-queueobj-out');
  const run = runPort(['--source', sourceFile, '--local', localFile, '--local-confirm', confirm, '--out', out]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /local:PORT_SOURCE_SHAPE_INVALID\s+class queue is not a\(n\) array \(got object\)/);
  assert.equal(fs.existsSync(out), false, 'nothing written');
});
test('finding 2: --local reads="x" refuses local:PORT_SOURCE_SHAPE_INVALID, not a crash', () => {
  const local = clone();
  local.reads = 'x';
  const sourceFile = writeSource('local-readsstr-source', clone());
  const localFile = writeSource('local-readsstr-local', local);
  const confirm = sha256First8(fs.readFileSync(localFile));
  const out = path.join(SCRATCH, 'local-readsstr-out');
  const run = runPort(['--source', sourceFile, '--local', localFile, '--local-confirm', confirm, '--out', out]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /local:PORT_SOURCE_SHAPE_INVALID\s+class reads is not a\(n\) array \(got string\)/);
  assert.equal(fs.existsSync(out), false, 'nothing written');
});
test('finding 2: --local corrLog={} (on a sessionLog record) refuses local:PORT_SOURCE_SHAPE_INVALID', () => {
  const local = clone();
  const day = Object.keys(local.sessionLog)[0];
  local.sessionLog[day].corrLog = {};
  const sourceFile = writeSource('local-corrobj-source', clone());
  const localFile = writeSource('local-corrobj-local', local);
  const confirm = sha256First8(fs.readFileSync(localFile));
  const out = path.join(SCRATCH, 'local-corrobj-out');
  const run = runPort(['--source', sourceFile, '--local', localFile, '--local-confirm', confirm, '--out', out]);
  assert.equal(run.code, 2, run.out);
  assert.match(run.out, /local:PORT_SOURCE_SHAPE_INVALID\s+class corrections is not a\(n\) array \(got object\)/);
  assert.equal(fs.existsSync(out), false, 'nothing written');
});

/* Finding 3 (Fable r5, MINOR, privacy): object-shaped nights echoed the
   entry's KEY whole; dailyLogs/sessionLog keys already truncated to 10 via
   badDate. The key label now truncates the same way, with the same "..."
   trailing marker used for a truncated date value. */
test('finding 3: a long object-shaped nights key never appears whole in the SHAPE line', () => {
  const longKey = 'PERSONAL-LOOKING-KEY-THAT-IS-LONG';
  const s = clone();
  s.sleep.nights = { [longKey]: { h: 7 } };  // missing d -> SHAPE_INVALID
  const issues = shapeIssues(s);
  const issue = issues.find(i => i.code === 'PORT_SOURCE_SHAPE_INVALID' && i.detail.startsWith('class nights'));
  assert.ok(issue, JSON.stringify(issues));
  assert.ok(!issue.detail.includes(longKey), 'the full key must not appear: ' + issue.detail);
  assert.equal(issue.detail, 'class nights entry at key "PERSONAL-L"... is missing d');
});
test('finding 3: a long object-shaped nights key never appears whole in the DATE_INVALID line', () => {
  const longKey = 'ANOTHER-PERSONAL-LOOKING-KEY-HERE';
  const s = clone();
  s.sleep.nights = { [longKey]: { d: null } };
  const issues = shapeIssues(s);
  const issue = issues.find(i => i.code === 'PORT_SOURCE_DATE_INVALID');
  assert.ok(issue, JSON.stringify(issues));
  assert.ok(!issue.detail.includes(longKey), 'the full key must not appear: ' + issue.detail);
  assert.equal(issue.detail, 'class nights date at key "ANOTHER-PE"... is invalid: <null>');
});

/* Finding 4 (Opus r4, MINOR): PORT_SOURCE_CLASS_MISSING for 'earned' used to
   print "(no earned key)"; 'earned' is backed by 'feed', which has no key of
   its own, so the line now names the REAL backing key. */
test('finding 4: earned CLASS_MISSING names the real backing key (feed)', () => {
  const s = clone();
  delete s.feed;
  const issues = shapeIssues(s);
  const issue = issues.find(i => i.code === 'PORT_SOURCE_CLASS_MISSING' && i.detail.includes('earned'));
  assert.ok(issue, JSON.stringify(issues));
  assert.equal(issue.detail, 'class earned is missing from the source (no feed key)');
});

/* Finding 5 (Opus r4, MINOR): a corrLog present but not an array (object,
   string, number) used to be treated as [] here, raising no issue at all
   (PREPARE refused it downstream, but this check did not say so). */
test('finding 5: an object-typed corrLog now refuses PORT_SOURCE_SHAPE_INVALID', () => {
  const day = Object.keys(BASE.sessionLog)[0];
  const s = clone();
  s.sessionLog[day].corrLog = { not: 'an array' };
  const issues = shapeIssues(s);
  assert.ok(issues.some(i => i.code === 'PORT_SOURCE_SHAPE_INVALID' &&
    i.detail === 'class corrections is not a(n) array (got object)'), JSON.stringify(issues));
});
