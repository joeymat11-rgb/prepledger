'use strict';
// BUILDER PREFLIGHT — DECISIONS:135 (3). "Before any PR-READY the builder runs a mechanical
// preflight (diff inside custody, CI green at the exact head sha, report <= 60 lines, no
// U+2013/U+2014 in UI custody, counts present, STATUS <= 400 chars) and pastes its one PASS
// line; lane B builds it as rebuild/lanes/tooling/preflight.cjs (small, plumbing tier)."
//
// SHARED BY ALL LANES, which is why it lives at rebuild/lanes/tooling/ and not under any
// one lane. PLUMBING TIER: it decides nothing about a package's evidence, it holds no
// exemption anyone could lean on, and a PASS here is not a claim about anything except the
// six mechanical facts below. The lane's own runner is still the judge of its package.
//
// Usage:
//   node rebuild/lanes/tooling/preflight.cjs --custody <glob,glob> --report <path>
//        --status-line <path> [--ui-custody <glob,glob>] [--ci-run <id>]
//
// Exactly ONE line reaches stdout: `PREFLIGHT PASS <head sha>` or `PREFLIGHT FAIL <code>`.
// Everything else — the CI command the builder must run, and what each failure was — goes
// to stderr, so the one line can be pasted without editing.
//
// WHAT THIS CANNOT DO, said plainly: CI green at the exact head sha is a GitHub API fact
// and this machine is offline to it. So the check is not faked: the exact `gh` command and
// URL are PRINTED, and `--ci-run <id>` must be supplied by the builder who looked. Without
// it the preflight FAILS at CI-UNVERIFIED rather than passing quietly — an unverified CI is
// the one of the six that has bitten this project, and a silent skip would be worse than no
// check at all. The id is not itself verified; what it buys is that a human looked and can
// be asked which run they looked at.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';
const REPORT_MAX_LINES = 60, STATUS_MAX_CHARS = 400;
const DASHES = /[–—]/; // en dash, em dash — refused in UI custody files

function die(code, detail) {
  if (detail) process.stderr.write('preflight: ' + code + ': ' + detail + '\n');
  process.stdout.write('PREFLIGHT FAIL ' + code + '\n');
  process.exit(1);
}
function arg(argv, name) {
  const at = argv.indexOf(name);
  if (at < 0) return null;
  const value = argv[at + 1];
  if (typeof value !== 'string' || !value.length || value.startsWith('--')) die('USAGE', name + ' needs a value');
  return value;
}
// A small, closed glob: `*` matches inside one path segment, `**` matches across segments,
// and everything else is literal. A bare directory prefix matches that whole subtree, which
// is how custody is actually written ("rebuild/lanes/b/", "rebuild/m3/w7-preview/today/").
function toRe(glob) {
  const g = glob.endsWith('/') ? glob + '**' : glob;
  let out = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*') {
      if (g[i + 1] === '*') { out += '.*'; i++; if (g[i + 1] === '/') i++; }
      else out += '[^/]*';
    } else out += c.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp('^' + out + '$');
}
const globs = value => value.split(',').map(s => s.trim()).filter(Boolean);

function main() {
  const argv = process.argv.slice(2);
  const known = new Set(['--custody', '--report', '--status-line', '--ui-custody', '--ci-run']), seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    if (!known.has(argv[i])) die('USAGE', 'unknown argument ' + argv[i]);
    // A REPEATED argument is refused rather than silently taking the first: a second
    // --report is a builder pointing the preflight at a file it is not measuring.
    if (seen.has(argv[i])) die('USAGE', 'repeated argument ' + argv[i]);
    seen.add(argv[i]);
  }
  const custody = arg(argv, '--custody'), report = arg(argv, '--report'), statusLine = arg(argv, '--status-line');
  const uiCustody = arg(argv, '--ui-custody'), ciRun = arg(argv, '--ci-run');
  if (!custody || !report || !statusLine) {
    process.stderr.write('usage: node rebuild/lanes/tooling/preflight.cjs --custody <glob,glob> --report <path>' +
      ' --status-line <path> [--ui-custody <glob,glob>] [--ci-run <id>]\n');
    die('USAGE', 'missing --custody, --report or --status-line');
  }
  let root;
  try { root = cp.execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim(); }
  catch { die('NOT-A-GIT-WORKTREE', 'run this from inside the repository'); }
  const git = (...a) => cp.execFileSync('git', a, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const head = git('rev-parse', 'HEAD').trim();

  // (1) THE DIFF IS INSIDE CUSTODY. Every path this branch changed against the chain branch,
  // committed or not, must match one of the custody globs. `git diff --name-only <base> HEAD`
  // gives what the branch added; `git status --porcelain` adds what is not committed yet,
  // because an uncommitted or untracked file outside custody is still a change the reviewer
  // will see — and that is exactly how a stray scratch file escapes.
  let base;
  try { base = git('merge-base', CHAIN_REF, 'HEAD').trim(); }
  catch { die('CHAIN-REF-UNRESOLVED', CHAIN_REF + ' does not resolve in this worktree'); }
  const changed = new Set(git('diff', '--name-only', base, 'HEAD').split(/\r?\n/).filter(Boolean));
  // `--untracked-files=all` matters: the default collapses an untracked directory to
  // "rebuild/engine/", which matches no custody glob by accident rather than by rule and
  // names no file the builder can go and look at. Every stray file is listed by its path.
  for (const line of git('status', '--porcelain', '--untracked-files=all').split(/\r?\n/).filter(Boolean))
    for (const f of line.slice(3).trim().split(' -> ')) changed.add(f.replace(/^"|"$/g, ''));
  const custodyRe = globs(custody).map(toRe);
  const outside = [...changed].filter(f => !custodyRe.some(re => re.test(f))).sort();
  if (outside.length) die('DIFF-OUTSIDE-CUSTODY', outside.length + ' path(s): ' + outside.slice(0, 12).join(' '));

  // (2) THE REPORT IS <= 60 LINES, and (5) IT CARRIES COUNTS. ":135 (1)" makes the brief and
  // the report the place a lane discloses what it decided, and a report nobody finishes
  // reading discloses nothing. The counts rule is the same discipline: a report that says
  // "the suites are green" without a number is not a report, it is a feeling.
  if (!fs.existsSync(path.join(root, report))) die('REPORT-MISSING', report);
  const reportText = fs.readFileSync(path.join(root, report), 'utf8');
  const reportLines = reportText.split(/\r?\n/);
  while (reportLines.length && reportLines[reportLines.length - 1] === '') reportLines.pop();
  if (reportLines.length > REPORT_MAX_LINES) die('REPORT-TOO-LONG', reportLines.length + ' lines, max ' + REPORT_MAX_LINES);
  if (!/\d+\s*\/\s*\d+/.test(reportText) && !/\bpass \d+/i.test(reportText))
    die('REPORT-COUNTS-MISSING', 'no "<n>/<n>" and no "pass <n>" anywhere in ' + report);

  // (3) THE STATUS LINE IS <= 400 CHARACTERS. It is read in a list beside every other lane's,
  // and a STATUS that wraps four times is one nobody compares. Measured on the LONGEST
  // non-empty line of the file, so a STATUS kept under a heading still measures the line
  // that matters, and counted in code points so an em dash counts once.
  if (!fs.existsSync(path.join(root, statusLine))) die('STATUS-LINE-MISSING', statusLine);
  const statusLines = fs.readFileSync(path.join(root, statusLine), 'utf8').split(/\r?\n/).filter(l => l.trim().length);
  if (!statusLines.length) die('STATUS-LINE-EMPTY', statusLine);
  const longest = statusLines.reduce((a, b) => ([...b].length > [...a].length ? b : a), '');
  if ([...longest].length > STATUS_MAX_CHARS)
    die('STATUS-LINE-TOO-LONG', [...longest].length + ' characters, max ' + STATUS_MAX_CHARS);

  // (4) NO U+2013 / U+2014 IN UI CUSTODY. The screens ship these bytes to a phone, where the
  // two dashes render inconsistently and have cost this project a round trip more than once.
  // Only the UI custody globs are asked; prose files are not the target of this rule, and a
  // lane that declares no --ui-custody is told so on the stderr summary rather than passing
  // as if the check had run.
  const uiHits = [];
  if (uiCustody) {
    const uiRe = globs(uiCustody).map(toRe);
    for (const f of git('ls-files').split(/\r?\n/).filter(Boolean).filter(f => uiRe.some(re => re.test(f)))) {
      const full = path.join(root, f);
      if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) continue;
      fs.readFileSync(full, 'utf8').split(/\r?\n/).forEach((line, i) => { if (DASHES.test(line)) uiHits.push(f + ':' + (i + 1)); });
    }
    if (uiHits.length) die('UI-CUSTODY-EN-OR-EM-DASH', uiHits.length + ' line(s): ' + uiHits.slice(0, 12).join(' '));
  }

  // (6) CI GREEN AT THE EXACT HEAD SHA — out of reach offline, so the command is printed and
  // the answer is required. Printed on stderr every time, so a builder who did not supply
  // --ci-run is told exactly what to run rather than guessing.
  let origin = '';
  try { origin = git('config', '--get', 'remote.origin.url').trim(); } catch { origin = ''; }
  const slug = (/[:/]([^/:]+\/[^/]+?)(?:\.git)?$/.exec(origin) || [])[1] || '<owner>/<repo>';
  process.stderr.write('preflight: CI at the exact head sha is not checkable from here. Run:\n' +
    '  gh run list --repo ' + slug + ' --commit ' + head + ' --json databaseId,name,conclusion\n' +
    '  https://github.com/' + slug + '/commits/' + head + '\n' +
    'then re-run with --ci-run <databaseId of the green run>.\n');
  if (!ciRun) die('CI-UNVERIFIED', 'no --ci-run <id> supplied for head ' + head);
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(ciRun)) die('CI-RUN-ID-SHAPE', ciRun);
  process.stderr.write('preflight: CI run id ' + ciRun + ' recorded for head ' + head +
    '; this tool did NOT verify it - the builder who supplied it looked.\n' +
    'preflight: ' + changed.size + ' changed path(s) all inside custody; report ' + reportLines.length +
    '/' + REPORT_MAX_LINES + ' lines with counts; STATUS longest line ' + [...longest].length + '/' + STATUS_MAX_CHARS +
    ' chars; UI custody ' + (uiCustody ? uiHits.length + ' dash hit(s) over the declared globs' : 'not declared') + '.\n');
  process.stdout.write('PREFLIGHT PASS ' + head + '\n');
}
main();
