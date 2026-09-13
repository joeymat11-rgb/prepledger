'use strict';
// BUILDER PREFLIGHT — DECISIONS:135 (3), each of the six checks measured RED and GREEN in a
// Git repository this test builds. The preflight is run as a real child process, because
// what :135 (3) buys is a ONE-LINE terminal a builder pastes, and a terminal is only real
// if it is the process's own stdout and exit code.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');

const sourceRoot = path.resolve(__dirname, '../../../..');
const toolRel = 'rebuild/lanes/tooling/preflight.cjs';
const source = fs.readFileSync(path.join(sourceRoot, toolRel), 'utf8');
assert(source.split(/\r?\n/).length <= 200, 'the preflight stays under 200 lines');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-preflight-'));
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  return text;
}
const git = (...argv) => cp.execFileSync('git', argv, { cwd: scratch, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const REPORT = 'rebuild/lanes/b/BUILD-REPORT-FIXTURE.md';
const STATUS = 'rebuild/lanes/b/STATUS.md';
const UI = 'rebuild/m3/w7-preview/today/screens.template.html';
const goodReport = ['# BUILD REPORT', 'Suites: 9/9 green.', 'Terminals unchanged.', ''].join('\n');
const goodStatus = ['# STATUS', 'STATUS lane B - r7 tooling - suites green - PR-READY', ''].join('\n');

write(toolRel, source);
write(REPORT, goodReport);
write(STATUS, goodStatus);
write(UI, '<p>a clean hyphen-only line</p>\n');
write('rebuild/DECISIONS.md', '- 2026-09-12 · cowork · the chain\n');
git('init', '--quiet', '-b', 'chain');
git('config', 'user.email', 'tooling7@earned.local');
git('config', 'user.name', 'lane-b-tooling7');
git('add', '-A'); git('commit', '--quiet', '-m', 'chain base');
// The tool resolves CHAIN_REF as a remote-tracking ref, so the fixture makes one.
fs.mkdirSync(path.join(scratch, '.git/refs/remotes/origin/rebuild'), { recursive: true });
fs.writeFileSync(path.join(scratch, '.git/refs/remotes/origin/rebuild/t2-client-core'), git('rev-parse', 'HEAD').trim() + '\n');
git('checkout', '--quiet', '-b', 'lane');
write(REPORT, goodReport + 'one more disclosed line.\n');
git('add', '-A'); git('commit', '--quiet', '-m', 'lane work inside custody');

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-preflight-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

function run(extra = []) {
  const argv = ['--custody', 'rebuild/lanes/b/,rebuild/m3/w7-preview/today/', '--report', REPORT,
    '--status-line', STATUS, ...extra];
  const r = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), ...argv],
    { cwd: scratch, encoding: 'utf8' });
  const lines = r.stdout.split(/\r?\n/).filter(Boolean);
  assert.equal(lines.length, 1, 'exactly one line on stdout, got ' + JSON.stringify(r.stdout));
  return { line: lines[0], code: r.status, stderr: r.stderr };
}
const GREEN = ['--ci-run', '18443120077'];

test(':135 (3) — the whole preflight green is ONE PASS line carrying the head sha', () => {
  const r = run(GREEN);
  assert.equal(r.code, 0);
  assert.equal(r.line, 'PREFLIGHT PASS ' + git('rev-parse', 'HEAD').trim());
});

test(':135 (3) — a change outside custody fails, committed or merely sitting there', () => {
  write('rebuild/engine/plan.cjs', 'console.log("outside every custody glob");\n');
  const untracked = run(GREEN);
  assert.equal(untracked.code, 1);
  assert.equal(untracked.line, 'PREFLIGHT FAIL DIFF-OUTSIDE-CUSTODY');
  assert.match(untracked.stderr, /rebuild\/engine\/plan\.cjs/);
  git('add', '-A'); git('commit', '--quiet', '-m', 'a change outside custody');
  assert.equal(run(GREEN).line, 'PREFLIGHT FAIL DIFF-OUTSIDE-CUSTODY');
  git('reset', '--quiet', '--hard', 'HEAD~1');
  fs.rmSync(path.join(scratch, 'rebuild/engine/plan.cjs'), { force: true });
  assert.equal(run(GREEN).code, 0);
});

test(':135 (3) — a report over 60 lines fails, and 60 exactly passes', () => {
  const sixty = ['# BUILD REPORT', 'Suites: 9/9 green.'].concat(Array.from({ length: 58 }, (_, i) => 'line ' + i)).join('\n') + '\n';
  assert.equal(sixty.split('\n').filter(Boolean).length, 60);
  write(REPORT, sixty);
  assert.equal(run(GREEN).code, 0, 'sixty lines is inside the bound');
  write(REPORT, sixty + 'the sixty-first line\n');
  const r = run(GREEN);
  assert.equal(r.line, 'PREFLIGHT FAIL REPORT-TOO-LONG');
  assert.match(r.stderr, /61 lines, max 60/);
  write(REPORT, goodReport);
});

test(':135 (3) — a report with no counts fails; "n/n" or "pass n" satisfies it', () => {
  write(REPORT, '# BUILD REPORT\nthe suites are green and everything is fine.\n');
  assert.equal(run(GREEN).line, 'PREFLIGHT FAIL REPORT-COUNTS-MISSING');
  write(REPORT, '# BUILD REPORT\nthe suites are green: pass 25, fail 0.\n');
  assert.equal(run(GREEN).code, 0);
  write(REPORT, '# BUILD REPORT\nthe suites are green: 25/25.\n');
  assert.equal(run(GREEN).code, 0);
  write(REPORT, goodReport);
});

test(':135 (3) — a STATUS line over 400 characters fails, counted in code points', () => {
  write(STATUS, '# STATUS\n' + 'x'.repeat(400) + '\n');
  assert.equal(run(GREEN).code, 0, '400 is inside the bound');
  write(STATUS, '# STATUS\n' + 'x'.repeat(401) + '\n');
  const r = run(GREEN);
  assert.equal(r.line, 'PREFLIGHT FAIL STATUS-LINE-TOO-LONG');
  assert.match(r.stderr, /401 characters, max 400/);
  // An em dash is ONE character, not three bytes: the bound is about what a reader sees.
  write(STATUS, '# STATUS\n' + '—'.repeat(400) + '\n');
  assert.equal(run(GREEN).code, 0);
  write(STATUS, goodStatus);
});

test(':135 (3) — U+2013 and U+2014 in UI custody fail; outside it they are not asked', () => {
  const ui = ['--ui-custody', 'rebuild/m3/w7-preview/today/*.html'];
  assert.equal(run([...GREEN, ...ui]).code, 0);
  for (const dash of ['–', '—']) {
    write(UI, '<p>a line with an ' + dash + ' in it</p>\n');
    git('add', '-A'); git('commit', '--quiet', '-m', 'a dash in the UI');
    const r = run([...GREEN, ...ui]);
    assert.equal(r.line, 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH');
    assert.match(r.stderr, /screens\.template\.html:1/);
    // The SAME bytes with no --ui-custody declared are not a failure, and the summary says
    // the check did not run rather than reading as if it had.
    const quiet = run(GREEN);
    assert.equal(quiet.code, 0);
    assert.match(quiet.stderr, /UI custody not declared/);
  }
  write(UI, '<p>a clean hyphen-only line</p>\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'the dash removed');
  assert.equal(run([...GREEN, ...ui]).code, 0);
});

test('r8 — the UI dash check scans UNTRACKED files too, as check (1) already did', () => {
  // r8 change 5, measured: an em dash in a screen template not yet committed read as
  // PREFLIGHT PASS, while the custody diff counted the same untracked file. The two checks
  // now scan the same set — `git ls-files` plus `--others --exclude-standard`.
  const ui = ['--ui-custody', 'rebuild/m3/w7-preview/today/*.html'];
  const fresh = 'rebuild/m3/w7-preview/today/screens.fresh.html';
  write(fresh, '<p>an untracked line with an — in it</p>\n');
  const r = run([...GREEN, ...ui]);
  assert.equal(r.line, 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH');
  assert.match(r.stderr, /screens\.fresh\.html:1/);
  // Clean bytes in the same untracked file pass, so this is the dash and not the file.
  write(fresh, '<p>an untracked line with a hyphen - in it</p>\n');
  assert.equal(run([...GREEN, ...ui]).code, 0);
  fs.rmSync(path.join(scratch, fresh));
});

test(':135 (3) — CI is UNVERIFIED without --ci-run, and the exact command is printed', () => {
  const r = run();
  assert.equal(r.code, 1);
  assert.equal(r.line, 'PREFLIGHT FAIL CI-UNVERIFIED');
  // The command and the URL the builder must look at, at the EXACT head sha.
  const head = git('rev-parse', 'HEAD').trim();
  assert.match(r.stderr, new RegExp('gh run list --repo .+ --commit ' + head));
  assert.match(r.stderr, new RegExp('https://github\\.com/.+/commits/' + head));
  // And the id is recorded, never verified — the tool says so in its own words.
  const green = run(GREEN);
  assert.match(green.stderr, /CI run id 18443120077 recorded/);
  assert.match(green.stderr, /did NOT verify it/);
  assert.equal(run(['--ci-run', 'not a valid id']).line, 'PREFLIGHT FAIL CI-RUN-ID-SHAPE');
});

test(':135 (3) — usage is closed: missing, unknown and valueless arguments all refuse', () => {
  const bare = cp.spawnSync(process.execPath, [path.join(scratch, toolRel)], { cwd: scratch, encoding: 'utf8' });
  assert.equal(bare.stdout.trim(), 'PREFLIGHT FAIL USAGE');
  assert.equal(bare.status, 1);
  const unknown = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), '--custody', 'a/', '--danger', 'x'],
    { cwd: scratch, encoding: 'utf8' });
  assert.equal(unknown.stdout.trim(), 'PREFLIGHT FAIL USAGE');
  const valueless = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), '--custody', '--report'],
    { cwd: scratch, encoding: 'utf8' });
  assert.equal(valueless.stdout.trim(), 'PREFLIGHT FAIL USAGE');
  // A REPEATED argument refuses rather than quietly taking the first — a second --report is
  // a builder pointing the preflight at a file it is not measuring.
  assert.equal(run([...GREEN, '--report', REPORT]).line, 'PREFLIGHT FAIL USAGE');
  // A named file that does not exist is its own refusal, not a crash.
  const missing = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), '--custody', 'rebuild/lanes/b/',
    '--report', 'rebuild/lanes/b/NOT-WRITTEN.md', '--status-line', STATUS, ...GREEN], { cwd: scratch, encoding: 'utf8' });
  assert.equal(missing.stdout.trim(), 'PREFLIGHT FAIL REPORT-MISSING');
  const noStatus = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), '--custody', 'rebuild/lanes/b/',
    '--report', REPORT, '--status-line', 'rebuild/lanes/b/NO-STATUS.md', ...GREEN], { cwd: scratch, encoding: 'utf8' });
  assert.equal(noStatus.stdout.trim(), 'PREFLIGHT FAIL STATUS-LINE-MISSING');
});
