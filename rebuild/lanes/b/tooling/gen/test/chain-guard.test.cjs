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
   no command outside it contains a writing verb. That is what stops the next stage someone
   adds from dodging the guard the way a3 and b1 did. */
const WRITES = ['a3', 'b1', 'b6'];

test('GUARD-1 - the guarded set IS every run stage whose command writes', () => {
  const r = throwaway();
  standOn(r, 'rebuild/b-seal-gen');
  const writing = /\b(merge|push|commit|rebase|reset|checkout)\b/;
  const found = [];
  for (const [key, kind] of chain.STAGES) {
    if (kind !== 'run') continue;
    let c = null;
    try { c = chain.commandFor('S9', key, { root: r.dir }); } catch (e) { found.push(key); continue; }
    if (c && writing.test(c)) found.push(key);
  }
  assert.deepEqual(found.sort(), WRITES.slice().sort(),
    'a run stage whose command writes must be in the guarded set: ' + found.join(','));
  assert.deepEqual(chain.WRITE_STAGES.slice().sort(), WRITES.slice().sort(),
    'and seal-chain.cjs must declare exactly that set');
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

test('GUARD-3 - the throwaway repositories this cell made are removed', () => {
  /* R2 N2 in spirit: a cell that leaves folders behind on a PC several lanes share is a
     cell that costs something every run. Only what this cell created is removed. */
  for (const d of MADE.splice(0)) fs.rmSync(d, { recursive: true, force: true });
  assert.equal(MADE.length, 0);
});
