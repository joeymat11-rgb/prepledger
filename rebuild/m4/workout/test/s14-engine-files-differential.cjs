'use strict';
/* =====================================================================
   DECISIONS:153 (ii) - THE NAMED-FILES ENGINE DIFFERENTIAL, FOR M2-S14-HOLD
   The fifth required evidence slot of the standing gate-supersession role
   (DECISIONS:153), under this package's OWN token line - GATE-SUPERSESSION
   M2-S14-HOLD, cited in the spec by its own sha256. Templated on
   s11-engine-files-differential.cjs, its parent's, which has the same shape.
   S14 is in a simpler position than S11: it moves ONE engine file,
   native-load.cjs, by its declared hunks (s14-native-load-moves.cjs; brief
   S14-HOLD-BW-BRIEF.md E1), and adds none. So it proves two sentences:

     every tracked file under rebuild/engine/ other than native-load.cjs stands
     BYTE-IDENTICAL to the PARENT'S OWN POST (named carried, or outside this
     package's product); native-load.cjs is the parent's bytes plus exactly its
     declared hunks.

   WHAT IT PROVES, EXACTLY. For each tracked path: the parent artifact's
   declared `post` where it declares one, and otherwise the blob at the
   parent's own `sourceBase`. The runner computes the same identity itself over
   the files this package does NOT declare (`supersessionEngineIdentity`,
   b-package.cjs) and then holds this child's verdict line to the count IT
   measured, so neither side can drift alone; this child measures the declared
   named files as well, which the runner by construction cannot.

   THE PARENT HERE IS M2-S11-NATIVE-LOAD, WHICH ITSELF MOVED TWO ENGINE FILES AND
   ADDED ONE, so the comparison chains: S11's own differential proved every file
   it did not name identical to S10's post and named its moves and its addition,
   and this one proves every file this package does not move identical to S11's
   and says its one move out loud, with its pre and post.

   Every path and every sha below is read at run time from Git and from disk.
   Nothing is hard-coded but the two roots, the spec's own file name and the
   declared hunks of the one moved file.
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
const { NL_MOVES } = require('./s14-native-load-moves.cjs');

const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S14.json'), 'utf8'));
const OPTION = SPEC.parent.options.find(o => o.id === SPEC.parent.chosen);
const PARENT_RAW = fs.readFileSync(path.join(REPO, OPTION.artifact));
assert.equal(sha(PARENT_RAW), OPTION.sha256, 'the accepted parent artifact is the bytes this spec pins: ' + OPTION.artifact);
const PARENT = JSON.parse(PARENT_RAW);
assert.equal(PARENT.packageId, 'M2-S11-NATIVE-LOAD', 'the bound parent is S11');
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
const moved = [], added = [];
for (const f of named) {
  const p = SPEC.product[f], got = diskSha(f);
  if (p.pre === null) { added.push(f); continue; }
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
assert.deepEqual(moved.slice().sort(), Object.keys(NL_MOVES).sort(), 'exactly the one file the brief declares is the only engine byte that moves');
assert.deepEqual(added, [], 'and no engine file is added');
assert.equal(rows.length + named.length, tracked.length, 'the split is exhaustive');
console.log('ENGINE FILES DIFFERENTIAL: ' + rows.length + ' tracked rebuild/engine file(s) outside this package\'s declared product, all byte-identical to the parent; '
  + moved.length + ' named file moves, by its declared hunks only, and ' + added.length + ' named file(s) are added;');
