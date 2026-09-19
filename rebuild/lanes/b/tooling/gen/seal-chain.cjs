#!/usr/bin/env node
'use strict';
/* SEAL-AUTOMATION / seal-chain.cjs - chain A (DECISIONS:516 to :519) and chain B (:528 to
   :529) as named, restartable stages, each with its own log and its own .done file under
   %TEMP%, so a stage that outlives one tool call can be started and then polled.

   THREE THINGS IT WILL NOT DO, and they are the point:
   1. IT NEVER RUNS --full UNLESS STARTED WITH --pm-runs-full. --full needs the private
      census and belongs to the PM alone. Without the flag a `pm` stage prints exactly
      what the PM must run and stops with exit 3.
   2. IT NEVER CREATES THE PRIVATE JUNCTION. The PM's own s8-prep.cmd does that; nothing
      here does, and nothing here reads rebuild/conform/private.
   3. IT STOPS AT EVERY JUDGMENT. The three token lines, the receipt line, the review
      json and the verdict are `hand` stages: it prints the exact shape and the exact
      check to run afterwards, and it stops. A chain script that wrote a ledger line
      would be a chain script that forged an authorization.

   usage:
     node rebuild/lanes/b/tooling/gen/seal-chain.cjs --plan
     node rebuild/lanes/b/tooling/gen/seal-chain.cjs --id S9 --stage a1
     node rebuild/lanes/b/tooling/gen/seal-chain.cjs --id S9 --stage a1 --poll
*/
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const M = require('./lib/measure.cjs');
const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..');
const TMP = process.env.TEMP || process.env.TMPDIR || '/tmp';
const NODE = process.execPath;

/* kind: 'run'  - this script runs it (public, --ci side only)
         'pm'   - it needs --full and the private census: printed, refused without the flag
         'hand' - it is a judgment or a ledger write: printed, never executed  */
const STAGES = [
  ['a1', 'run', 'chain A', '--ci --package <ID> BEFORE the token lines. The design predicts RECEIPT-EXACT-LINE-MISSING and nothing worse: DECISIONS:524 says so of S8 and :511 of S7. Any other refusal is a finding.'],
  ['a2', 'hand', 'chain A', 'THE THREE TOKEN LINES. The PM appends THEME, BRIEF-BY-SHA and GATE-SUPERSESSION to rebuild/DECISIONS.md BYTE-EXACT from gen/out/final-lines.txt, each verified against its sha256 first (DECISIONS:515 did exactly this with a script that re-checked before writing). Check: node gen/hash-lines.cjs <final-lines.txt> and put the three shas in the package.'],
  ['a3', 'run', 'chain A', 'MERGE THE TIP into the lane branch. Never rebase (:511, :515, :519 all say so of their own lanes).'],
  ['a4', 'run', 'chain A', '--ci --package <ID> with the lines standing. Expect AUTHORITY OBSERVED, ENVELOPE ABSENT, PUBLIC CI EVIDENCE PASS, every child OBSERVED exit 0.'],
  ['a5', 'run', 'chain A', 'PROPOSE THE ARTIFACT through the runner\'s OWN proposed(), never by hand, into rebuild/m4/spec/acceptance-<slug>.json. The scratch script compiles the runner the way tooling/test/execution-targets.test.cjs does (b-package.cjs proposed(), DECISIONS:516).'],
  ['a6', 'run', 'chain A', '--ci --package <ID> again. Expect ENVELOPE PENDING artifact=... spec=... runner=..., PUBLIC CI EVIDENCE PASS; independent exact-artifact acceptance required.'],
  ['a7', 'pm', 'chain A', '--full --package <ID> WITH THE PRIVATE CENSUS, verdict-only, to POSTFIX PACKAGE REVIEW-PENDING with exactly ONE open obligation (the acceptance). S7 found a second one here and it was a runner defect, not a flake (DECISIONS:516).'],
  ['a8', 'hand', 'chain A', 'THE RECEIPT LINE, in the :500 format and matched by the runner\'s own regex at b-package.cjs RECEIPT: POSTFIX-ACCEPTANCE <NAME> <40-hex reviewed commit> <artifact path> <64-hex artifact sha256> ACCEPTED. receipt.commit must be the CHAIN-BRANCH commit carrying the line (RECEIPT-BASE-NOT-ON-THE-CHAIN-BRANCH); the reviewed commit is the lane head.'],
  ['a9', 'hand', 'chain A', 'THE REVIEW JSON rebuild/m4/spec/review-<slug>.json {status ACCEPTED, receipt {commit, line verbatim, lineSha256}}, then merge the tip into the reviewed head (never rebase).'],
  ['b1', 'run', 'chain B', 'MERGE THE TIP into the reviewed head one more time, so the authorized --full runs on the tip (SEAL BASE ON THE TIP).'],
  ['b2', 'pm', 'chain B', 'THE AUTHORIZED --full: SEAL BASE ON THE TIP, ENVELOPE AUTHORIZED, PARENT PINS RE-ASSERTED, LAWS executed, PRIVATE ORACLE PRESENT, AUDIT RED-FIRST OBSERVED, SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/<ID>.json, POSTFIX PACKAGE PASS.'],
  ['b3', 'hand', 'chain B', 'VERDICT-<ID>.md naming the receipt sha256, the four terminals, the two reseal rules re-applied and every carried note.'],
  ['b4', 'run', 'chain B', 'THE COACH CONSTANT moves ONCE, to <NAME>@<first 16 of the receipt sha>. Check: the coach suite and the production-mapping/admission pair green in the sealed state.'],
  ['b5', 'pm', 'chain B', 'THE BYTE-IDENTITY --full on the coach commit: artifact, runner, spec and every pinned product file byte-identical to the sealed run, POSTFIX PACKAGE PASS.'],
  ['b6', 'run', 'chain B', 'PUSH the lane branch and watch GitHub Actions on BOTH runners with the standing step --package <ID>.'],
  ['b7', 'hand', 'chain B', 'THE FAST-FORWARD of rebuild/t2-client-core onto the lane head, and the merge line in the ledger. PM only; this lane never pushes that branch.'],
  ['b8', 'hand', 'chain B', 'THE SLICE DEPLOY. The slice-host workflow triggers only on today/** or slice/pwa/** pushes; if the seal touches neither, the commit carrying the merge line adds the docs-only rebuild/slice/pwa/DEPLOYS.md trigger (DECISIONS:519).'],
];

const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs';
/* The command a `run` stage actually executes. Every one of them is the --ci side or a
   plain git read/merge; not one of them can reach --full. */
function commandFor(id, key, o) {
  const tip = o.tipRef || 'origin/rebuild/t2-client-core';
  switch (key) {
    case 'a1': case 'a4': case 'a6': return '"' + NODE + '" ' + RUNNER + ' --ci --package ' + id;
    case 'a3': case 'b1': return 'git fetch origin && git merge --no-edit ' + tip;
    case 'a5': return '"' + NODE + '" "' + path.join(__dirname, 'propose.cjs') + '" --package ' + id;
    case 'b4': return 'git -c core.pager=cat diff --stat -- rebuild/coach';
    case 'b6': return 'git push -u origin HEAD';
    default: return null;
  }
}
function paths(key) {
  const base = path.join(TMP, 'sealgen-chain-' + key);
  return { cmd: base + '.cmd', log: base + '.log', done: base + '.done' };
}
/* One stage = one .cmd that sets its env on its OWN LINES (chaining `set` with & on one
   line mis-sets TZ and turns every suite red), redirects to a log, and writes its .done
   file as the LAST line. Started detached, polled by its .done. */
function startStage(id, key, cmdline, o) {
  const p = paths(key);
  const body = ['@echo off',
    'set "MEASURED_TEST_NOW=2026-09-03"',
    'set "TZ=America/New_York"',
    'cd /d "' + REPO + '"',
    'del /q "' + p.log + '" 2>nul',
    'del /q "' + p.done + '" 2>nul',
    cmdline + ' > "' + p.log + '" 2>&1',
    'echo EXIT %ERRORLEVEL% >> "' + p.log + '"',
    'echo done> "' + p.done + '"', ''].join('\r\n');
  fs.writeFileSync(p.cmd, body);
  if (o.dryRun) { console.log('would start: ' + p.cmd); return p; }
  cp.spawn('cmd', ['/c', 'start', '', '/b', 'cmd', '/c', 'call', p.cmd], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
  return p;
}
function tail(file, n) {
  if (!fs.existsSync(file)) return '(no log yet)';
  const L = fs.readFileSync(file, 'utf8').split('\n');
  return L.slice(Math.max(0, L.length - n)).join('\n');
}

function main(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--id') o.id = argv[++i];
    else if (a === '--stage') o.stage = String(argv[++i]).toLowerCase();
    else if (a === '--tip-ref') o.tipRef = argv[++i];
    else if (a === '--plan') o.plan = true;
    else if (a === '--poll') o.poll = true;
    else if (a === '--dry-run') o.dryRun = true;
    else if (a === '--pm-runs-full') o.pmRunsFull = true;
    else throw new Error('CHAIN-ARGV-UNKNOWN ' + a);
  }
  if (o.plan || !o.stage) {
    console.log('SEAL-AUTOMATION seal-chain.cjs --plan' + (o.id ? '  (' + o.id + ')' : ''));
    let part = null;
    for (const [k, kind, group, what] of STAGES) {
      if (group !== part) { console.log('\n== ' + group.toUpperCase() + ' =='); part = group; }
      const mark = kind === 'run' ? '[run ]' : kind === 'pm' ? '[PM  ]' : '[hand]';
      console.log('  ' + mark + ' ' + k + '  ' + what.replace(/<ID>/g, o.id || '<ID>'));
      const c = kind === 'run' && commandFor(o.id || '<ID>', k, o);
      if (c) console.log('           $ ' + c.replace(NODE, 'node'));
    }
    console.log('\n  [run ] this script runs; [PM  ] needs --full and the private census, refused without --pm-runs-full;');
    console.log('  [hand] a judgment or a ledger write, printed and never executed.');
    console.log('  logs and .done files: ' + path.join(TMP, 'sealgen-chain-<stage>.{cmd,log,done}'));
    return 0;
  }
  const row = STAGES.find(s => s[0] === o.stage);
  if (!row) throw new Error('CHAIN-STAGE-UNKNOWN ' + o.stage + '; one of ' + STAGES.map(s => s[0]).join(','));
  const [key, kind, group, what] = row;
  if (!o.id) throw new Error('CHAIN-ARGV-MISSING --id');
  console.log('[' + group + '] ' + key + ' (' + kind + ')\n  ' + what.replace(/<ID>/g, o.id));
  if (kind === 'hand') { console.log('\n  This stage is a judgment or a ledger write. Nothing was run.'); return 3; }
  if (kind === 'pm') {
    if (!o.pmRunsFull) {
      console.log('\n  REFUSED: this stage runs --full, which needs the private census and belongs to the PM.');
      console.log('  Start it with --pm-runs-full, from the PM seat, with the census junction already made by');
      console.log('  the PM\'s own prep .cmd. This script never makes that junction and never passes that flag.');
      return 3;
    }
    console.log('\n  --pm-runs-full given. This script still does not run it: the PM\'s own s<N>-full<K>.cmd');
    console.log('  pattern (verdict-only, its own log) is the one the receipts were earned with, and this');
    console.log('  stage exists to NAME it, not to replace it. Run it from there and come back to ' + (STAGES[STAGES.indexOf(row) + 1] || ['(done)'])[0] + '.');
    return 3;
  }
  const p = paths(key);
  if (o.poll) {
    const done = fs.existsSync(p.done);
    console.log('  ' + (done ? 'DONE' : 'RUNNING') + '  ' + p.log + '\n' + tail(p.log, 25));
    return done ? 0 : 4;
  }
  const c = commandFor(o.id, key, o);
  if (!c) throw new Error('CHAIN-STAGE-HAS-NO-COMMAND ' + key);
  startStage(o.id, key, c, o);
  console.log('\n  started detached. Poll with:  node ' + path.relative(REPO, __filename).split(path.sep).join('/') + ' --id ' + o.id + ' --stage ' + key + ' --poll');
  console.log('  log: ' + p.log);
  return 0;
}
if (require.main === module) {
  try { process.exit(main(process.argv.slice(2))); }
  catch (e) { console.error('CHAIN FAILED: ' + e.message); process.exit(1); }
}
module.exports = { STAGES, commandFor, paths, main };
