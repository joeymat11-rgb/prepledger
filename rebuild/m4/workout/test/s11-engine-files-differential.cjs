'use strict';
/* =====================================================================
   DECISIONS:153 (ii) - THE NAMED-FILES ENGINE DIFFERENTIAL, FOR M2-S11
   The fifth required evidence slot of the standing gate-supersession role
   (DECISIONS:153), under this package's OWN token line - the one the PM writes
   when this brief is accepted by name, cited in the spec by its own sha256.
   Templated on S10's s10-engine-files-differential.cjs, which is its parent's
   and has the same shape: a package that moves named engine files and adds
   others. S11 is not in S10's position either: S10 moved today.cjs and
   writers.cjs by one owner-worded clause each (DECISIONS:631 O-1a), and S11
   moves writers.cjs by its NATIVE-LOAD FG01 hunks and progression.cjs by its
   FG02 hunk, and ADDS native-load.cjs under rebuild/engine/. So it proves
   three sentences:

     every tracked file under rebuild/engine/ that this package does NOT name
     stands BYTE-IDENTICAL to the PARENT'S OWN POST; the named files move only
     where declared, and the two that move are the parent plus exactly their
     declared hunks; the one it adds stands at its declared post.

   WHAT IT PROVES, EXACTLY. For each tracked path: the parent artifact's
   declared `post` where it declares one, and otherwise the blob at the
   parent's own `sourceBase`. The runner computes the same identity itself over
   the files this package does NOT declare (`supersessionEngineIdentity`,
   b-package.cjs) and then holds this child's verdict line to the count IT
   measured, so neither side can drift alone; this child measures the declared
   named files as well, which the runner by construction cannot.

   WHY THAT IS THE RIGHT COROBORATION. The five superseded carriers are
   byte-identity reconstructions of the engine. They refuse on this tree
   because FOUR files this package's ancestors moved are no longer what the
   frozen reconstruction builds; the parent retired them for that reason. S11
   moves one of those four (writers.cjs) further, takes a fifth
   (progression.cjs) off the construction for the first time, and adds a file
   outside the carrier's closed inventory: it neither causes the old refusal
   nor mends it, and it adds two walls of its own (s11-supersede-source-carriers
   SUP-2). The only way to say that as a measurement rather than as a claim is
   to compare every engine byte against the parent, report the count, and name
   the two moves and the one addition with their pre and post.

   THE PARENT HERE IS M2-S10-TODAY-SPLIT, WHICH ITSELF MOVED TWO ENGINE FILES,
   so the comparison chains: S10's own differential proved every file it did
   not name identical to S9's post and named its two moves out loud, and this
   one proves every file this package does not name identical to S10's and
   says its own two moves and its one addition out loud, with their pre and
   post.

   Every path and every sha below is read at run time from Git and from disk.
   Nothing is hard-coded but the two roots, the spec's own file name and the
   declared hunks of the two moved files.
   ===================================================================== */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const ENGINE_ROOT = 'rebuild/engine/';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const git = args => cp.execFileSync('git', args, { cwd: REPO, maxBuffer: 9e7 });
const diskSha = f => sha(fs.readFileSync(path.join(REPO, f)));
const blobSha = (rev, f) => sha(git(['show', rev + ':' + f]));
/* The declared NATIVE-LOAD hunks, in order, each with exactly one site: FG01 in
   writers.cjs (the honest-opener governor moved unchanged into updateOpenerHold,
   called once at the original site, exported) and FG02 in progression.cjs. The
   same table stands in the five s11-supersede-* cells. */
const FG01_GOVERNOR = '    if (en.rir != null) {\n' +
  '      ex.rirHist = [...(ex.rirHist || []).slice(-2), en.rir];\n' +
  '      if (en.rir >= 1 && ex.holdFlag) { ex.holdFlag = false; push(`${ex.n.toUpperCase()} \u2014 HOLD RELEASED`, `opener back to ${en.rir} RIR \u2014 honest again, loads can earn`); }\n' +
  '      const h2 = ex.rirHist.slice(-2);\n' +
  '      if (h2.length === 2 && h2.every((x) => x === 0)) { ex.holdFlag = true; push(`${ex.n.toUpperCase()} \u2014 RIR 0 TWICE`, "opener running hot two sessions straight \u2014 load HELD until an honest session lands"); }\n' +
  '    }\n';
const FG01_HEAD = '// NATIVE-LOAD FG01 (NATIVE-LOAD-SPEC R7 section C, engine item 2): the honest-opener\n' +
  '// governor, moved unchanged out of completeSession so the native evaluator can replay it\n' +
  '// on an isolated lift. completeSession calls it once, at the original site.\n';
const FG01_ANCHOR = '// Copied from frozen src/app.jsx @ fe516c1:2559-2777.\nfunction completeSession(';
const FG01_SITE = '    /* opener RIR \u2014 the honest-opener rule with teeth */\n';
const NL_MOVES = {
  'rebuild/engine/progression.cjs': [
    ['(_, i) => (Array.isArray(ex.wSets) && ex.wSets[i] != null ? ex.wSets[i] : ex.w));',
      '(_, i) => { const k = Array.isArray(ex.wSets) && ex.wSets.length > 0 ? Math.min(i, ex.wSets.length - 1) : -1; return k >= 0 && ex.wSets[k] != null ? ex.wSets[k] : ex.w; });'],
  ],
  'rebuild/engine/writers.cjs': [
    [FG01_ANCHOR, FG01_HEAD + 'function updateOpenerHold(ex, en, push) {\n' + FG01_GOVERNOR + '}\n\n' + FG01_ANCHOR],
    [FG01_SITE + FG01_GOVERNOR, FG01_SITE + '    updateOpenerHold(ex, en, push);\n'],
    ['takeProposedDebut, completeSession, applyRead,', 'takeProposedDebut, completeSession, updateOpenerHold, applyRead,'],
  ],
};

const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S11.json'), 'utf8'));
const OPTION = SPEC.parent.options.find(o => o.id === SPEC.parent.chosen);
const PARENT_RAW = fs.readFileSync(path.join(REPO, OPTION.artifact));
/* The parent artifact by its own immutable sha256, exactly as the spec pins it:
   nothing below is read until the bytes are the accepted bytes. */
assert.equal(sha(PARENT_RAW), OPTION.sha256, 'the accepted parent artifact is the bytes this spec pins: ' + OPTION.artifact);
const PARENT = JSON.parse(PARENT_RAW);
const BASE = PARENT.sourceBase;
assert(/^[a-f0-9]{40}$/.test(BASE), 'the parent artifact names its own sourceBase');

const tracked = git(['ls-files', '-z', ENGINE_ROOT.slice(0, -1)]).toString('utf8')
  .split('\0').filter(f => f.startsWith(ENGINE_ROOT));
assert(tracked.length >= 40, 'the real tracked inventory under ' + ENGINE_ROOT + ': ' + tracked.length);
const named = tracked.filter(f => Object.hasOwn(SPEC.product, f));
const outside = tracked.filter(f => !Object.hasOwn(SPEC.product, f));
assert(named.length && outside.length, 'the brief names some engine files and leaves others');

function want(f) {
  const pin = PARENT.product[f];
  const declared = pin && pin.post !== null && pin.post !== undefined;
  return { want: declared ? pin.post : blobSha(BASE, f), against: declared ? 'parent post' : 'parent sourceBase ' + BASE.slice(0, 7) };
}
const rows = [];
for (const f of outside) {
  const w = want(f), got = diskSha(f);
  rows.push({ f, against: w.against, got });
  assert.equal(got, w.want, 'engine file outside the brief moved: ' + f +
    ' (disk ' + got.slice(0, 12) + ', parent ' + w.want.slice(0, 12) + ')');
}
for (const r of rows) console.log('  SAME ' + r.f + ' ' + r.got.slice(0, 12) + ' against the ' + r.against);
/* The files this package DOES name, said out loud on the same run so the split is
   visible rather than implied. Exactly two move - each the parent's own bytes, read
   from Git at this package's sourceBase, plus exactly its declared hunks, applied in
   order, each at one site, and nothing else - and the one file it ADDS under
   rebuild/engine/ is declared new. Every other named file stands at the parent's own
   post with pre === post. */
const moved = [], added = [];
for (const f of named) {
  const p = SPEC.product[f], got = diskSha(f);
  if (p.pre === null) {
    assert.equal(p.role, 'new', 'a named engine file with no pre-image is declared new: ' + f);
    assert.equal(got, p.post, 'and stands at its declared post: ' + f);
    added.push(f);
    console.log('  ADDED ' + f + ' ' + got.slice(0, 12) + ' (declared new)');
    continue;
  }
  const w = want(f);
  if (Object.hasOwn(NL_MOVES, f)) {
    const parentBytes = git(['show', SPEC.sourceBase + ':' + f]).toString('utf8');
    assert.equal(sha(Buffer.from(parentBytes, 'utf8')), w.want, 'the parent bytes at the sourceBase are the parent\'s ' + w.against + ': ' + f);
    let body = parentBytes;
    NL_MOVES[f].forEach(([before, after], i) => {
      assert.equal(body.split(before).length, 2, 'declared hunk ' + (i + 1) + ' has exactly one site, applied in order: ' + f);
      body = body.replace(before, () => after);
    });
    assert.equal(fs.readFileSync(path.join(REPO, f), 'utf8'), body, 'the tree is the parent plus exactly its declared hunks: ' + f);
    assert.equal(p.role, 'edited', 'declared edited: ' + f);
    assert.equal(p.pre, w.want, 'pre is the parent post: ' + f);
    assert.equal(p.post, got, 'post is the byte on disk: ' + f);
    moved.push(f);
    console.log('  MOVED ' + f + ' ' + p.pre.slice(0, 12) + ' -> ' + p.post.slice(0, 12) + ' (declared, ' + NL_MOVES[f].length + ' hunk(s))');
    continue;
  }
  assert.equal(p.role, 'carried', 'a named engine file is declared carried: ' + f);
  assert.equal(p.pre, p.post, 'its declared pre-image is its declared post-image: ' + f);
  assert.equal(got, p.post, 'and that is the byte on disk: ' + f);
  assert.equal(got, w.want, 'which is the parent\'s own ' + w.against + ': ' + f);
  console.log('  CARRIED ' + f + ' ' + got.slice(0, 12) + ' against the ' + w.against + ' (declared, pre === post)');
}
assert.deepEqual(moved.slice().sort(), Object.keys(NL_MOVES).sort(), 'exactly the two files the brief declares are the only engine bytes that move');
assert.deepEqual(added.slice().sort(), ['rebuild/engine/native-load.cjs'], 'and exactly one engine file is added: native-load.cjs');
assert.equal(rows.length + named.length, tracked.length, 'the split is exhaustive');
console.log('ENGINE FILES DIFFERENTIAL: ' + rows.length + ' tracked rebuild/engine file(s) outside this package\'s declared product, all byte-identical to the parent; '
  + moved.length + ' named files move, each by its declared hunks only, and ' + added.length + ' named file(s) are added;');
