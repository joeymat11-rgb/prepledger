'use strict';
/* SEAL-AUTOMATION ACCEPTANCE: EVERY STAGE THAT WRITES RESOLVES THE BRANCH AND REFUSES BY NAME.
   R2 M1. The R1 fix put the branch guard inside pushBranch(), which only stage b6 calls.
   Stages a3 and b1 are `run` stages whose command is
       git fetch origin && git merge --no-edit origin/rebuild/t2-client-core
   started with `cd /d "<REPO>"`, where REPO is resolved from __dirname - i.e. whatever lane
   worktree this file has travelled to, standing on whatever branch that worktree is on.
   Nothing asked which branch that was, so a3 or b1 run from a worktree on `main` is a
   script merging the chain tip into main. "Never merge into main" is the same stop-the-line
   rule as "never push the chain branch", so it gets the same guard, and this cell is the
   red-first proof, one cell per stage, exercised on a THROWAWAY repository - never a
   worktree of this repo, and never anything this cell did not create itself. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const chain = require('../seal-chain.cjs');

const MADE = [];
function throwaway() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sealgen-guard-'));
  MADE.push(dir);
  const git = (...a) => {
    const r = cp.spawnSync('git', a, { cwd: dir, encoding: 'utf8', windowsHide: true });
    assert.equal(r.status, 0, 'git ' + a.join(' ') + ': ' + r.stderr);
    return r.stdout;
  };
  git('init', '-q', '-b', 'main');
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'seed\n');
  git('add', 'seed.txt');
  git('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'seed');
  for (const b of ['rebuild/t2-client-core', 'rebuild/b-seal-gen']) git('branch', b);
  return { dir, git, head: git('rev-parse', 'HEAD').trim() };
}
const standOn = (r, branch) => r.git('symbolic-ref', 'HEAD', 'refs/heads/' + branch);
/* --no-deref writes the sha straight into .git/HEAD, which is what a detached HEAD is. */
const detach = r => r.git('update-ref', '--no-deref', 'HEAD', r.head);

/* Every `run` stage whose command WRITES: it merges, commits or pushes. The list is not
   typed twice - it is the one seal-chain.cjs exports, and the standing check below is that
   every command OUTSIDE it is on an ALLOW LIST. That is what stops the next stage someone
   adds from dodging the guard the way a3 and b1 did. */
const WRITES = ['a3', 'b1', 'b6'];

/* R3 n6. This check used to be a DENY list of writing verbs,
   /\b(merge|push|commit|rebase|reset|checkout)\b/, offered as the reason the next writing
   stage could not dodge the guard. Git is longer than that list: `pull`, `am`, `apply`,
   `cherry-pick`, `revert`, `stash`, `restore`, `clean`, `tag`, `update-ref`, `branch -f`
   and `worktree add` are all missing from it, and a stage whose command was
   `git pull --ff-only origin <tip>` would have passed it and written the worktree it
   stands in. A guard cannot be a list of the bad things; it has to be a list of the
   allowed ones. So: a `run` stage OUTSIDE WRITE_STAGES may be the runner's own --ci
   command, or a git command whose VERB is one of these eight, and nothing else.
   `fetch` is on the list because it writes refs under refs/remotes and never the
   worktree - it is the one verb here that writes anything at all, and what it writes is
   not the tree. Every other verb reads.
   The command is split on the shell's own separators FIRST, so a second command smuggled
   in behind `&&`, `&`, `|` or `;` is judged on its own (G-F1 is how one got there). */
const GIT_READ_VERBS = ['fetch', 'diff', 'log', 'show', 'status', 'rev-parse', 'ls-tree', 'cat-file'];
const RUNNER_CI = new RegExp('^"[^"]+" ' + chain.RUNNER.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + ' --ci --package [A-Za-z0-9-]{1,16}$');
function segmentAllowed(seg) {
  const s = String(seg).trim();
  if (!s) return true;
  if (RUNNER_CI.test(s)) return true;
  const m = /^git((?:\s+-c\s+\S+)*)\s+([A-Za-z][A-Za-z-]*)\b/.exec(s);
  return !!m && GIT_READ_VERBS.includes(m[2]);
}
const readOnlyCommand = c => String(c).split(/&&|\|\||[&|;]/).every(segmentAllowed);

test('GUARD-1 - every run stage outside the guarded set is on the ALLOW list', () => {
  const r = throwaway();
  standOn(r, 'rebuild/b-seal-gen');
  const found = [];
  for (const [key, kind] of chain.STAGES) {
    if (kind !== 'run') continue;
    let c = null;
    try { c = chain.commandFor('S9', key, { root: r.dir }); } catch (e) { found.push(key); continue; }
    if (c && !readOnlyCommand(c)) found.push(key);
  }
  assert.deepEqual(found.sort(), WRITES.slice().sort(),
    'a run stage whose command is not on the allow list must be in the guarded set: ' + found.join(','));
  assert.deepEqual(chain.WRITE_STAGES.slice().sort(), WRITES.slice().sort(),
    'and seal-chain.cjs must declare exactly that set');
  /* And the allow list must really refuse the shapes R3 n6 named, or it is a list that
     says yes to everything. These are the assertions the old regex failed. */
  assert.equal(readOnlyCommand('git pull --ff-only origin rebuild/t2-client-core'), false, 'git pull writes the worktree it stands in');
  assert.equal(readOnlyCommand('git cherry-pick abc1234'), false, 'nor cherry-pick');
  assert.equal(readOnlyCommand('git update-ref refs/heads/main HEAD'), false, 'nor update-ref');
  assert.equal(readOnlyCommand('git worktree add /tmp/x HEAD'), false, 'nor worktree add');
  assert.equal(readOnlyCommand('git fetch origin && git merge --no-edit origin/x'), false, 'a merge behind && is still a merge');
  assert.equal(readOnlyCommand('git status & git push origin HEAD:main'), false, 'a second command behind & is judged on its own');
  assert.equal(readOnlyCommand('git -c core.pager=cat diff --stat -- rebuild/coach'), true, 'b4 reads and must stay allowed');
  assert.equal(readOnlyCommand('git fetch origin'), true, 'fetch writes refs/remotes, never the worktree');
  assert.equal(readOnlyCommand(chain.commandFor('S9', 'a1', { root: r.dir })), true, 'and the runner --ci command is the other allowed shape');
});

/* One cell per stage, and each one is three refusals and one pass on the same repository,
   so the pass is not a different tree from the refusals. */
for (const key of WRITES) {
  test('GUARD-' + key + ' - stage ' + key + ' refuses main, the chain branch and a detached HEAD, by name', () => {
    const r = throwaway();
    const verb = key === 'b6' ? 'PUSH' : 'MERGE';

    standOn(r, 'main');
    assert.throws(() => chain.commandFor('S9', key, { root: r.dir }),
      e => new RegExp('CHAIN-' + verb + '-REFUSED').test(e.message) && /\bmain\b/.test(e.message),
      key + ' must refuse main by name');

    standOn(r, 'rebuild/t2-client-core');
    assert.throws(() => chain.commandFor('S9', key, { root: r.dir }),
      e => new RegExp('CHAIN-' + verb + '-REFUSED').test(e.message) && /rebuild\/t2-client-core/.test(e.message),
      key + ' must refuse the chain branch by name');

    detach(r);
    assert.throws(() => chain.commandFor('S9', key, { root: r.dir }),
      e => new RegExp('CHAIN-' + verb + '-REFUSED').test(e.message) && /detached/.test(e.message),
      key + ' must refuse a detached HEAD');

    standOn(r, 'rebuild/b-seal-gen');
    const c = chain.commandFor('S9', key, { root: r.dir });
    assert(typeof c === 'string' && c.length, key + ' must return its command on a lane branch');
    if (key === 'b6') assert.equal(c, 'git push -u origin rebuild/b-seal-gen:rebuild/b-seal-gen');
    else assert(/git fetch origin && git merge --no-edit /.test(c), 'a3/b1 merge the tip: ' + c);
  });
}

test('GUARD-2 - the stage banner names the branch being written INTO', () => {
  /* R2 M1: "print the branch being merged INTO in the stage banner, because that is the
     fact the PM most wants to see before pressing go." --plan must say it too, so a
     worktree that cannot run a write stage says so before anyone starts one. */
  const r = throwaway();
  standOn(r, 'rebuild/b-seal-gen');
  for (const key of WRITES) assert.equal(chain.writeTargetFor(key, { root: r.dir }), 'rebuild/b-seal-gen');
  assert.equal(chain.writeTargetFor('a1', { root: r.dir }), null, 'a read-only stage names no branch');
  standOn(r, 'main');
  for (const key of WRITES) {
    const t = chain.writeTargetFor(key, { root: r.dir });
    assert(/REFUSED/.test(String(t)), key + ' banner on main must be the refusal: ' + t);
  }
});

/* THE ARGV SHAPE GUARD (PM final read, G-F1). Measured before the fix, in a throwaway
   repository with its own TEMP: `--id "S9 & echo PWNED-BY-ARGV"` put
       "<node>" rebuild/lanes/b/tooling/b-package.cjs --ci --package S9 & echo PWNED-BY-ARGV
   into the body of sealgen-chain-a1.cmd, and `--tip-ref "x & git push origin HEAD:main"`
   put
       git fetch origin && git merge --no-edit x & git push origin HEAD:main
   into sealgen-chain-a3.cmd - WITH the banner above it reading WRITES INTO:
   rebuild/b-seal-gen, because writeBranch() had been asked and had said yes to the merge
   it was shown. The second command is not a branch this script was shown at all. */
test('GUARD-4 - an argument cannot become a second command: --id, --tip-ref, and the branch git resolves', () => {
  const r = throwaway();
  standOn(r, 'rebuild/b-seal-gen');

  const HOSTILE_IDS = ['S9 & echo pwned', 'S9&del', 'S9 --full', '../S9', 'S9;shutdown', 'S9|more',
    'S9 > x', '"S9"', '', 'S'.repeat(17), 'S9\nS10', 'S9\n', 'S9\r'];
  /* NOT in that list, and it is worth saying why: `-S9` SATISFIES the shape the PM fixed,
     because a package id may contain a hyphen (B-NTC does) and the regexp cannot tell a
     hyphen at the front from one in the middle. It cannot start a second command, which is
     what this guard is about, and the law is the PM's; a hyphen in front of a --package
     value is a runner-side question and it is carried, not narrowed here. */
  assert.equal(chain.ID_SHAPE.test('-S9'), true, 'carried: a leading hyphen is inside the shape the PM fixed');
  for (const id of HOSTILE_IDS) {
    for (const key of ['a1', 'a4', 'a6']) {
      assert.throws(() => chain.commandFor(id, key, { root: r.dir }),
        e => /^CHAIN-ARGV-SHAPE/.test(e.message) && /--id/.test(e.message),
        key + ' must refuse --id ' + JSON.stringify(id) + ' by shape');
    }
  }
  for (const id of ['S9', 'S10', 'B-NTC', 'H3']) {
    assert.equal(chain.commandFor(id, 'a1', { root: r.dir }).endsWith(' --ci --package ' + id), true, 'a real id still builds its command: ' + id);
  }

  const HOSTILE_REFS = ['x & git push origin HEAD:main', 'x && del /q .', 'a b', 'x|y', 'x;y', 'x`y`',
    'origin/..//x', 'HEAD~1..HEAD', '--upload-pack=evil', '$(x)', 'x^{}'];
  for (const t of HOSTILE_REFS) {
    for (const key of ['a3', 'b1']) {
      assert.throws(() => chain.commandFor('S9', key, { root: r.dir, tipRef: t }),
        e => /^CHAIN-ARGV-SHAPE/.test(e.message) && /--tip-ref/.test(e.message),
        key + ' must refuse --tip-ref ' + JSON.stringify(t) + ' by shape');
    }
  }
  assert(/git merge --no-edit origin\/rebuild\/t2-client-core$/.test(chain.commandFor('S9', 'a3', { root: r.dir })), 'the default tip is still built');
  assert(/git merge --no-edit refs\/remotes\/origin\/x$/.test(chain.commandFor('S9', 'a3', { root: r.dir, tipRef: 'refs/remotes/origin/x' })), 'and a real ref still is');

  /* The branch Git resolves is an argument too: it goes into `git push -u origin <b>:<b>`.
     Git permits `&` in a ref name, cmd.exe reads it as a separator, and symbolic-ref will
     stand HEAD on one without the branch existing - which is exactly the shape that has
     to be refused before it is compared with anything. */
  standOn(r, 'lane&echo-pwned');
  for (const key of WRITES) {
    assert.throws(() => chain.commandFor('S9', key, { root: r.dir }),
      e => /^CHAIN-ARGV-SHAPE/.test(e.message) && /branch git resolved/.test(e.message),
      key + ' must refuse a branch name it cannot spell on a command line');
  }
  /* And the refusal reaches the banner as a refusal, not as a branch to write. */
  for (const key of WRITES) assert(/CHAIN-ARGV-SHAPE/.test(String(chain.writeTargetFor(key, { root: r.dir }))), key + ' banner must carry the shape refusal');

  /* argvShape() is the same check off argv, before --plan prints and before a stage is
     looked up: nothing below it in main() may be reached with a value of another shape. */
  assert.throws(() => chain.argvShape({ id: 'S9 & x' }), /CHAIN-ARGV-SHAPE --id/);
  assert.throws(() => chain.argvShape({ tipRef: 'x & y' }), /CHAIN-ARGV-SHAPE --tip-ref/);
  assert.throws(() => chain.argvShape({ branch: 'x & y' }), /CHAIN-ARGV-SHAPE --branch/);
  assert.throws(() => chain.argvShape({ id: chain.PLAN_ID }), /CHAIN-ARGV-SHAPE --id/,
    'the --plan placeholder is not an id argv may carry');
  assert.deepEqual(chain.argvShape({ id: 'S9', tipRef: 'origin/rebuild/t2-client-core', branch: 'rebuild/b-seal-gen' }),
    { id: 'S9', tipRef: 'origin/rebuild/t2-client-core', branch: 'rebuild/b-seal-gen' }, 'and a real argv passes unchanged');
});

/* THE STAGE FILES CARRY THE ID (PM final read, G-F2). S9 and S10 will overlap on this PC,
   and `paths(key)` gave both of them %TEMP%\sealgen-chain-a1.{cmd,log,done}: one chain's
   --poll read the other's .done and printed the other's log as this stage's evidence. */
test('GUARD-5 - two chains on one PC do not share a stage log or a .done', () => {
  const s9 = chain.paths('S9', 'a1'), s10 = chain.paths('S10', 'a1');
  for (const k of ['cmd', 'log', 'done']) {
    assert.notEqual(s9[k], s10[k], 'S9 and S10 must not share the stage ' + k + ': ' + s9[k]);
    assert(s9[k].includes('sealgen-chain-S9-a1.'), 'the id is in the name: ' + s9[k]);
    assert(s10[k].includes('sealgen-chain-S10-a1.'), 'the id is in the name: ' + s10[k]);
  }
  assert.notEqual(chain.paths('S9', 'a1').log, chain.paths('S9', 'a4').log, 'and two stages of one chain still differ');
  /* A name that could not be a file name never reaches path.join. */
  assert.throws(() => chain.paths('S9 & echo x', 'a1'), /CHAIN-ARGV-SHAPE --id/);
  assert.throws(() => chain.paths('../../S9', 'a1'), /CHAIN-ARGV-SHAPE --id/);
});

/* R3 n7. Every cell above passes `{root: <throwaway>}` to commandFor, and `main()` parses
   no --root and no --repo: in real use `writeBranch` is given REPO, resolved from
   __dirname, and that is also the folder `startStage` does `cd /d` into. So the cells
   above prove the GUARD and not the WIRING, and R3 closed that gap by hand. This closes it
   with a cell: gen/ is copied into a throwaway repository AT ITS REAL RELATIVE DEPTH, the
   shipped script is run as an ordinary CHILD PROCESS from there with its own TEMP, and
   what is asserted is the exit status, the refusal on stderr and THE BYTES OF THE .cmd. */
test('GUARD-6 - the SHIPPED command line, run as a child process from a throwaway repository', () => {
  const r = throwaway();
  const genAt = path.join(r.dir, 'rebuild', 'lanes', 'b', 'tooling', 'gen');
  fs.mkdirSync(genAt, { recursive: true });
  fs.cpSync(path.join(__dirname, '..'), genAt, { recursive: true });
  const script = path.join(genAt, 'seal-chain.cjs');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sealgen-guard-tmp-'));
  MADE.push(tmp);
  const run = (...args) => {
    /* The child gets its own %TEMP%, so no stage file of this cell can land beside a real
       chain's, and NOT this process's NODE_TEST_CONTEXT (measure.cjs says why). */
    const env = Object.assign({}, process.env, { TEMP: tmp, TMP: tmp });
    delete env.NODE_TEST_CONTEXT;
    return cp.spawnSync(process.execPath, [script].concat(args), { cwd: r.dir, env, encoding: 'utf8', windowsHide: true });
  };
  const stageFiles = () => fs.readdirSync(tmp).filter(f => f.startsWith('sealgen-chain-')).sort();

  standOn(r, 'main');
  for (const [key, verb] of [['a3', 'MERGE'], ['b1', 'MERGE'], ['b6', 'PUSH']]) {
    const x = run('--id', 'S9', '--stage', key, '--dry-run');
    assert.equal(x.status, 1, key + ' on main must exit 1: ' + x.stdout + x.stderr);
    assert(new RegExp('CHAIN-' + verb + '-REFUSED').test(x.stderr), key + ' must refuse on stderr: ' + x.stderr);
    assert(/\bmain\b/.test(x.stderr), key + ' must name the branch: ' + x.stderr);
  }
  detach(r);
  const d = run('--id', 'S9', '--stage', 'a3', '--dry-run');
  assert.equal(d.status, 1, 'a3 detached must exit 1');
  assert(/CHAIN-MERGE-REFUSED: HEAD is detached/.test(d.stderr), d.stderr);
  assert.deepEqual(stageFiles(), [], 'a refused stage writes no .cmd at all');

  /* G-F1 on the shipped command line. Before the fix this wrote sealgen-chain-a1.cmd with
     `& echo PWNED-BY-ARGV` in its body and exited 0. */
  standOn(r, 'rebuild/b-seal-gen');
  const p = run('--id', 'S9 & echo PWNED-BY-ARGV', '--stage', 'a1', '--dry-run');
  assert.equal(p.status, 1, 'a hostile --id must exit 1: ' + p.stdout + p.stderr);
  assert(/CHAIN-ARGV-SHAPE --id/.test(p.stderr), 'and say which argument: ' + p.stderr);
  const t = run('--id', 'S9', '--tip-ref', 'x & git push origin HEAD:main', '--stage', 'a3', '--dry-run');
  assert.equal(t.status, 1, 'a hostile --tip-ref must exit 1: ' + t.stdout + t.stderr);
  assert(/CHAIN-ARGV-SHAPE --tip-ref/.test(t.stderr), 'and say which argument: ' + t.stderr);
  assert.deepEqual(stageFiles(), [], 'and neither of them wrote a stage file');

  /* And the wiring WORKS where it must: the branch resolved from __dirname, the command
     built from it, and the .cmd that cmd.exe would run. */
  const ok = run('--id', 'S9', '--stage', 'a3', '--dry-run');
  assert.equal(ok.status, 0, 'a3 on the lane branch must exit 0: ' + ok.stdout + ok.stderr);
  assert(/WRITES INTO: rebuild\/b-seal-gen/.test(ok.stdout), 'the banner names the branch: ' + ok.stdout);
  assert(/NOTHING was started/.test(ok.stdout), '--dry-run says it started nothing: ' + ok.stdout);
  assert.deepEqual(stageFiles(), ['sealgen-chain-S9-a3.cmd'], 'one stage file, named for the id (G-F2)');
  const body = fs.readFileSync(path.join(tmp, 'sealgen-chain-S9-a3.cmd'), 'utf8');
  assert(body.includes('git fetch origin && git merge --no-edit origin/rebuild/t2-client-core'), 'the .cmd body is the command and only the command:\n' + body);
  assert(body.includes('cd /d "' + r.dir + '"'), 'and it cds into the repository resolved from __dirname, which is the wiring this cell exists for:\n' + body);
  assert(!/PWNED/.test(body), 'and nothing of the hostile runs survived into it');
});

test('GUARD-3 - the throwaway repositories this cell made are removed', () => {
  /* R2 N2 in spirit: a cell that leaves folders behind on a PC several lanes share is a
     cell that costs something every run. Only what this cell created is removed. */
  for (const d of MADE.splice(0)) fs.rmSync(d, { recursive: true, force: true });
  assert.equal(MADE.length, 0);
});
