#!/usr/bin/env node
'use strict';
/* SEAL-AUTOMATION / seal-chain.cjs - chain A (DECISIONS:516 to :519) and chain B (:528 to
   :529) as named, restartable stages, each with its own log and its own .done file under
   %TEMP%, so a stage that outlives one tool call can be started and then polled.

   FIVE THINGS IT WILL NOT DO, and they are the point:
   0. IT NEVER LETS AN ARGUMENT BECOME A SECOND COMMAND. This script BUILDS A COMMAND LINE
      BY CONCATENATION and writes it into a .cmd that cmd.exe runs, so every value that
      reaches that string is checked for SHAPE first: `--id` must be /^[A-Za-z0-9-]{1,16}$/,
      `--tip-ref` and `--branch` must be a plain ref name, and so must the branch Git
      resolves. Without that, `--id "S9 & <anything>"` or
      `--tip-ref "x & git push origin HEAD:main"` puts a SECOND command in the file and
      walks round writeBranch() entirely - measured, before this guard: the body of
      sealgen-chain-a3.cmd read `git fetch origin && git merge --no-edit x & git push
      origin HEAD:main` while the banner above it said WRITES INTO: rebuild/b-seal-gen.
      The operator is trusted; the point of this script is that it cannot be talked into a
      write it was not shown, by a typo or by a confused hand (PM final read, G-F1).
   1. IT NEVER WRITES A BRANCH IT WAS NOT SHOWN. EVERY stage that merges, commits or
      pushes - a3, b1 and b6, the closed list `WRITE_STAGES` - goes through ONE guard,
      `writeBranch()`: it resolves the branch this worktree stands on and refuses `main`,
      `rebuild/t2-client-core` and a detached HEAD BY NAME (R1 B2 for b6; R2 M1 for a3 and
      b1, which MERGE and were not guarded). b6 additionally names the branch on both
      sides of the refspec. The branch being written is printed in the stage banner and in
      `--plan`. The fast-forward of the chain branch is stage b7 and it is a `hand` stage.
   2. IT NEVER RUNS --full UNLESS STARTED WITH --pm-runs-full. --full needs the private
      census and belongs to the PM alone. Without the flag a `pm` stage prints exactly
      what the PM must run and stops with exit 3.
   3. IT NEVER CREATES THE PRIVATE JUNCTION. The PM's own s8-prep.cmd does that; nothing
      here does, and nothing here reads rebuild/conform/private.
   4. IT STOPS AT EVERY JUDGMENT. The three token lines, the receipt line, the review
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
  /* R1 N10: this stage used to be marked `run`, and running it wrote nothing. propose.cjs
     compiles the runner to its main-sequence boundary and confirms proposed() is reachable;
     it does NOT assemble the spec/bound pair, which in S7 and S8 was a PM-read scratch
     script (DECISIONS:516). A stage that exits 0 having written no artifact is exactly the
     green a chain script must never show, so it is a `hand` stage that names its own
     check. It goes back to `run` on the day the assembly exists. */
  ['a5', 'hand', 'chain A', 'PROPOSE THE ARTIFACT through the runner\'s OWN proposed(), never by hand, into rebuild/m4/spec/acceptance-<slug>.json. This is still the PM\'s scratch script (DECISIONS:516). Check FIRST that the runner still compiles to its main-sequence boundary and proposed() is reachable: node rebuild/lanes/b/tooling/gen/propose.cjs --package <ID> (it writes nothing, by design).'],
  ['a6', 'run', 'chain A', '--ci --package <ID> again. Expect ENVELOPE PENDING artifact=... spec=... runner=..., PUBLIC CI EVIDENCE PASS; independent exact-artifact acceptance required.'],
  ['a7', 'pm', 'chain A', '--full --package <ID> WITH THE PRIVATE CENSUS, verdict-only, to POSTFIX PACKAGE REVIEW-PENDING with exactly ONE open obligation (the acceptance). S7 found a second one here and it was a runner defect, not a flake (DECISIONS:516).'],
  ['a8', 'hand', 'chain A', 'THE RECEIPT LINE, in the :500 format and matched by the runner\'s own regex at b-package.cjs RECEIPT: POSTFIX-ACCEPTANCE <NAME> <40-hex reviewed commit> <artifact path> <64-hex artifact sha256> ACCEPTED. receipt.commit must be the CHAIN-BRANCH commit carrying the line (RECEIPT-BASE-NOT-ON-THE-CHAIN-BRANCH); the reviewed commit is the lane head.'],
  ['a9', 'hand', 'chain A', 'THE REVIEW JSON rebuild/m4/spec/review-<slug>.json {status ACCEPTED, receipt {commit, line verbatim, lineSha256}}, then merge the tip into the reviewed head (never rebase).'],
  ['b1', 'run', 'chain B', 'MERGE THE TIP into the reviewed head one more time, so the authorized --full runs on the tip (SEAL BASE ON THE TIP).'],
  ['b2', 'pm', 'chain B', 'THE AUTHORIZED --full: SEAL BASE ON THE TIP, ENVELOPE AUTHORIZED, PARENT PINS RE-ASSERTED, LAWS executed, PRIVATE ORACLE PRESENT, AUDIT RED-FIRST OBSERVED, SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/<ID>.json, POSTFIX PACKAGE PASS.'],
  ['b3', 'hand', 'chain B', 'VERDICT-<ID>.md naming the receipt sha256, the four terminals, the two reseal rules re-applied and every carried note.'],
  ['b4', 'run', 'chain B', 'THE COACH CONSTANT moves ONCE, to <NAME>@<first 16 of the receipt sha>. Check: the coach suite and the production-mapping/admission pair green in the sealed state.'],
  ['b5', 'pm', 'chain B', 'THE BYTE-IDENTITY --full on the coach commit: artifact, runner, spec and every pinned product file byte-identical to the sealed run, POSTFIX PACKAGE PASS.'],
  ['b6', 'run', 'chain B', 'PUSH THE LANE BRANCH BY NAME (never `HEAD`, and never main or rebuild/t2-client-core: this stage refuses both by name) and watch GitHub Actions on BOTH runners with the standing step --package <ID>.'],
  ['b7', 'hand', 'chain B', 'THE FAST-FORWARD of rebuild/t2-client-core onto the lane head, and the merge line in the ledger. PM only; this lane never pushes that branch.'],
  ['b8', 'hand', 'chain B', 'THE SLICE DEPLOY. The slice-host workflow triggers only on today/** or slice/pwa/** pushes; if the seal touches neither, the commit carrying the merge line adds the docs-only rebuild/slice/pwa/DEPLOYS.md trigger (DECISIONS:519).'],
];

const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs';
/* R1 B2. `git push -u origin HEAD` pushes whatever branch the worktree this file sits in
   happens to be standing on, and this file is lane B tooling: it travels to every lane
   worktree there is. The day a stage b6 is run from a worktree standing on the chain
   branch or on main, a script has pushed the branch no script may push. So b6 names a
   BRANCH, the branch is resolved from Git, these two are refused by name, and a detached
   HEAD is refused as well (there is no branch to name). */
const NEVER_WRITE = ['main', 'rebuild/t2-client-core'];
const NEVER_PUSH = NEVER_WRITE;                     // the name R1 B2 introduced, kept
/* R2 M1. The R1 fix put that guard inside pushBranch(), which only b6 calls - and a3 and
   b1 are `run` stages whose command is `git fetch origin && git merge --no-edit <tip>`,
   started with `cd /d "<REPO>"` where REPO is resolved from __dirname. Nothing asked which
   branch that worktree stood on, so a3 or b1 started from a worktree on `main` was a
   script MERGING THE CHAIN TIP INTO MAIN. "Never merge into main" is the same
   stop-the-line rule as "never push the chain branch", so there is now ONE guard and every
   writing stage goes through it. WRITE_STAGES is the closed list and
   test/chain-guard.test.cjs holds it to the commands, and since R3 n6 it does so with an
   ALLOW list rather than a list of writing verbs: a `run` stage outside this list may be
   the runner's own --ci command or a git command whose VERB is one of eight read verbs
   (fetch included, because it writes refs under refs/remotes and never the worktree), and
   anything else fails that cell. A deny list of verbs was shorter than git is - `pull`,
   `am`, `apply`, `cherry-pick`, `revert`, `stash`, `restore`, `clean`, `tag`,
   `update-ref`, `branch -f`, `worktree add` were all missing from it. */
const WRITE_STAGES = ['a3', 'b1', 'b6'];
/* THE ARGV SHAPE GUARD (PM final read, G-F1). Three values reach a command line that
   cmd.exe will run: --id (into `--ci --package <id>`), --tip-ref (into
   `git merge --no-edit <tip>`) and the branch Git resolves (into
   `git push -u origin <b>:<b>`). None of them was checked, so an ampersand in any one of
   them was a SECOND COMMAND in the .cmd body - past the banner, past writeBranch(), past
   everything this file claims about what it will not do. These two shapes are the whole
   fix, and they are deliberately narrower than Git is: a package id is a short token, and
   a ref this lane merges or pushes is a plain name. `..` is refused because it is the
   revision range syntax, and a leading `-` because it is how an argument becomes an
   option (`--upload-pack=...`). PLAN_ID is the placeholder --plan prints when no --id was
   given; it can never come from argv, because argvShape() below rejects it there. */
const ID_SHAPE = /^[A-Za-z0-9-]{1,16}$/;
const REF_SHAPE = /^[A-Za-z0-9._/-]{1,200}$/;
const PLAN_ID = '<ID>';
const shapeError = (what, v) => new Error('CHAIN-ARGV-SHAPE ' + what + ' ' + JSON.stringify(String(v)) +
  ' is not a shape this script will put on a command line. Nothing was built, nothing was written and nothing was started.');
/* `$` in a JavaScript regexp matches before a TRAILING newline as well as at the end of
   the string, so "S9\n" would satisfy /^[A-Za-z0-9-]{1,16}$/ and carry a line break into a
   .cmd body, where a line break is a command separator. Both checks say so explicitly. */
const oneLine = s => !/[\r\n]/.test(s);
function checkId(id) {
  if (id === PLAN_ID) return id;                       // --plan's own placeholder, never argv
  const s = String(id);
  if (!ID_SHAPE.test(s) || !oneLine(s)) throw shapeError('--id', s + ' (wanted ' + String(ID_SHAPE) + ', one line)');
  return id;
}
function checkRef(what, v) {
  const s = String(v);
  if (!REF_SHAPE.test(s) || !oneLine(s) || s.includes('..') || s.startsWith('-')) {
    throw shapeError(what, s + ' (wanted ' + String(REF_SHAPE) + ', no "..", no leading "-")');
  }
  return s;
}
/* Everything argv carries, checked ONCE, before --plan prints anything and before any
   stage is looked up. */
function argvShape(o) {
  /* checkId() lets PLAN_ID through because --plan prints it; argv may not carry it, so
     the exemption exists in exactly one place and never on a value a caller typed. */
  if (o.id === PLAN_ID) throw shapeError('--id', PLAN_ID + ' (that is --plan\'s own placeholder, not a package id)');
  if (o.id !== undefined) checkId(o.id);
  if (o.tipRef !== undefined) checkRef('--tip-ref', o.tipRef);
  if (o.branch !== undefined) checkRef('--branch', o.branch);
  return o;
}
function currentBranch(root) {
  const r = M.git(root, ['symbolic-ref', '--quiet', '--short', 'HEAD'], { encoding: 'utf8' });
  return r.status === 0 ? String(r.stdout).trim() : null;
}
/* THE ONE GUARD. Resolves the branch this worktree stands on and refuses, BY NAME, a
   detached HEAD and the two branches no script of this lane writes. `verb` only changes
   the refusal code (CHAIN-PUSH-REFUSED / CHAIN-MERGE-REFUSED) so each stage's refusal
   still says what it was about to do. */
function writeBranch(root, verb) {
  const here = currentBranch(root);
  const what = verb === 'PUSH' ? 'push' : 'merge into';
  if (!here) throw new Error('CHAIN-' + verb + '-REFUSED: HEAD is detached in ' + root + '; there is no branch to ' + what + '. Check out the lane branch first.');
  /* G-F1. Git allows characters in a branch name that cmd.exe reads as syntax (`&`, `|`,
     `;`, `$`, `(`), and this name goes into `git push -u origin <b>:<b>` in a .cmd body.
     A branch this script cannot spell safely is refused before it is compared with
     anything, so the refusal is about the SHAPE and not about which branch it is. */
  checkRef('the branch git resolved in ' + root, here);
  if (NEVER_WRITE.includes(here)) throw new Error('CHAIN-' + verb + '-REFUSED: this worktree stands on ' + here + ', which no script of this lane writes. ' + (verb === 'PUSH'
    ? 'b6 pushes a LANE branch only; the fast-forward of ' + NEVER_WRITE[1] + ' is stage b7 and it is the PM\'s hand.'
    : 'a3 and b1 merge the chain tip INTO THE LANE BRANCH; merging it into ' + here + ' is a merge commit nobody asked for. Check out the lane branch first.'));
  return here;
}
/* The command a `run` stage actually executes. Every one of them is the --ci side or a
   plain git read/merge; not one of them can reach --full. */
function commandFor(id, key, o) {
  /* G-F1: THE SHAPES FIRST, in the function that builds the string, so no caller and no
     future stage can reach concatenation without passing them. main() checks the same two
     values off argv; this is the check that is true of every call. */
  checkId(id);
  const tip = checkRef('--tip-ref', o.tipRef || 'origin/rebuild/t2-client-core');
  switch (key) {
    case 'a1': case 'a4': case 'a6': return '"' + NODE + '" ' + RUNNER + ' --ci --package ' + id;
    /* R2 M1: resolve the branch FIRST. The command is unchanged; what changed is that it
       is not returned at all from a worktree standing where this lane does not merge. */
    case 'a3': case 'b1': {
      writeBranch(o.root || REPO, 'MERGE');
      return 'git fetch origin && git merge --no-edit ' + tip;
    }
    case 'b4': return 'git -c core.pager=cat diff --stat -- rebuild/coach';
    case 'b6': {
      const branch = pushBranch(o);
      return 'git push -u origin ' + branch + ':' + branch;
    }
    default: return null;
  }
}
/* The branch b6 will push, by name, or a refusal. --branch <name> must AGREE with the
   branch the worktree stands on: naming a branch you are not on is how the wrong head
   gets pushed, and this script would rather stop than guess which one was meant. */
function pushBranch(o) {
  const here = writeBranch(o.root || REPO, 'PUSH');
  if (o.branch && o.branch !== here) throw new Error('CHAIN-PUSH-REFUSED: --branch ' + o.branch + ' but this worktree stands on ' + here + '. Check out ' + o.branch + ', or drop --branch.');
  return here;
}
/* THE BANNER (R2 M1): the branch a writing stage is about to write, or its refusal, so the
   fact the PM most wants before pressing go is on the screen in both --plan and the run.
   A stage that writes nothing answers null and prints no banner. */
function writeTargetFor(key, o) {
  if (!WRITE_STAGES.includes(key)) return null;
  try { return key === 'b6' ? pushBranch(o || {}) : writeBranch((o && o.root) || REPO, 'MERGE'); }
  catch (e) { return e.message; }
}
/* R2 N4. `c.replace(NODE, 'node')` left the quotes that stood around the executable path,
   so --plan printed `$ "node" rebuild/...`, which is not the command. */
const pretty = c => String(c).split('"' + NODE + '"').join('node').split(NODE).join('node');
/* THE STAGE FILES CARRY THE ID (PM final read, G-F2). They used to be
   sealgen-chain-<key>.{cmd,log,done}, so two chains on one PC - and S9 and S10 WILL
   overlap - shared a log and a .done: `--poll` of one read the other's DONE and printed
   the other's log as this stage's evidence. The id is in the name now, and checkId() has
   already said the id is a shape that can be a file name. */
function paths(id, key) {
  const base = path.join(TMP, 'sealgen-chain-' + checkId(id) + '-' + key);
  return { cmd: base + '.cmd', log: base + '.log', done: base + '.done' };
}
/* One stage = one .cmd that sets its env on its OWN LINES (chaining `set` with & on one
   line mis-sets TZ and turns every suite red), redirects to a log, and writes its .done
   file as the LAST line. Started detached, polled by its .done. */
function startStage(id, key, cmdline, o) {
  const p = paths(id, key);
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
    /* --branch <name>: the branch stage b6 pushes. It must be the branch this worktree
       stands on; it is a second pair of eyes, not an override (R1 B2). */
    else if (a === '--branch') o.branch = argv[++i];
    else if (a === '--plan') o.plan = true;
    else if (a === '--poll') o.poll = true;
    else if (a === '--dry-run') o.dryRun = true;
    else if (a === '--pm-runs-full') o.pmRunsFull = true;
    else throw new Error('CHAIN-ARGV-UNKNOWN ' + a);
  }
  /* G-F1: BEFORE ANYTHING. Not before the run - before the plan, before the stage lookup,
     before a single string is joined. Everything below this line may be concatenated. */
  argvShape(o);
  if (o.plan || !o.stage) {
    console.log('SEAL-AUTOMATION seal-chain.cjs --plan' + (o.id ? '  (' + o.id + ')' : ''));
    let part = null;
    for (const [k, kind, group, what] of STAGES) {
      if (group !== part) { console.log('\n== ' + group.toUpperCase() + ' =='); part = group; }
      const mark = kind === 'run' ? '[run ]' : kind === 'pm' ? '[PM  ]' : '[hand]';
      console.log('  ' + mark + ' ' + k + '  ' + what.replace(/<ID>/g, o.id || PLAN_ID));
      /* A stage that would REFUSE says so here, in the plan, rather than at the moment
         someone runs it: --plan from a worktree standing on the chain branch prints b6's
         refusal by name (R1 B2). */
      const target = kind === 'run' ? writeTargetFor(k, o) : null;
      if (target) console.log('           WRITES INTO: ' + target);
      let c = null;
      try { c = kind === 'run' ? commandFor(o.id || PLAN_ID, k, o) : null; }
      catch (e) { console.log('           $ ' + e.message); }
      if (c) console.log('           $ ' + pretty(c));
    }
    console.log('\n  [run ] this script runs; [PM  ] needs --full and the private census, refused without --pm-runs-full;');
    console.log('  [hand] a judgment or a ledger write, printed and never executed.');
    /* G-F2: the id is in the file name, so this line prints the id it was given. */
    console.log('  logs and .done files: ' + path.join(TMP, 'sealgen-chain-' + (o.id || PLAN_ID) + '-<stage>.{cmd,log,done}'));
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
  const p = paths(o.id, key);
  if (o.poll) {
    const done = fs.existsSync(p.done);
    console.log('  ' + (done ? 'DONE' : 'RUNNING') + '  ' + p.log + '\n' + tail(p.log, 25));
    return done ? 0 : 4;
  }
  /* R2 M1: the banner, before anything is started. A refusal reaches the caller through
     commandFor below; this line is so the branch is on the screen either way. */
  if (WRITE_STAGES.includes(key)) console.log('  WRITES INTO: ' + writeTargetFor(key, o));
  const c = commandFor(o.id, key, o);
  if (!c) throw new Error('CHAIN-STAGE-HAS-NO-COMMAND ' + key);
  startStage(o.id, key, c, o);
  /* R1 N11. --dry-run writes the .cmd and starts nothing, so it says that and stops: a
     script whose whole value is that you can trust what it tells you it did does not get
     to print "started detached" when it started nothing. */
  if (o.dryRun) {
    console.log('\n  DRY RUN: the stage .cmd was written and NOTHING was started.');
    console.log('  cmd: ' + p.cmd + '\n  it would run:  ' + pretty(c));
    return 0;
  }
  console.log('\n  started detached. Poll with:  node ' + path.relative(REPO, __filename).split(path.sep).join('/') + ' --id ' + o.id + ' --stage ' + key + ' --poll');
  console.log('  log: ' + p.log);
  return 0;
}
if (require.main === module) {
  try { process.exit(main(process.argv.slice(2))); }
  catch (e) { console.error('CHAIN FAILED: ' + e.message); process.exit(1); }
}
module.exports = { STAGES, commandFor, paths, main, pushBranch, currentBranch, NEVER_PUSH, NEVER_WRITE, WRITE_STAGES, writeBranch, writeTargetFor, pretty, checkId, checkRef, argvShape, ID_SHAPE, REF_SHAPE, PLAN_ID, RUNNER };
