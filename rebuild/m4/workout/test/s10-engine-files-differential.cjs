'use strict';
/* =====================================================================
   DECISIONS:153 (ii) - THE NAMED-FILES ENGINE DIFFERENTIAL, FOR M2-S10
   The fifth required evidence slot of the standing gate-supersession role
   (DECISIONS:153), under this package's OWN token line - the one the PM writes
   when this brief is accepted by name, cited in the spec by its own sha256.
   Templated on S9's s9-engine-files-differential.cjs for its parent and runner
   plumbing, and on S3's s3-engine-files-differential.cjs for its MOVED half,
   because S10 is NOT in S9's position: S9 moved no engine byte, and S10 moves
   two - today.cjs and writers.cjs, each by exactly one owner-worded clause
   (DECISIONS:631 O-1a, D-EPP-3's declared departure) - and ADDS the EPP cell
   and its author report under rebuild/engine/. So it proves three sentences:

     every tracked file under rebuild/engine/ that this package does NOT name
     stands BYTE-IDENTICAL to the PARENT'S OWN POST; the named files move only
     where declared, and the two that move are the parent plus one clause.

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
   frozen reconstruction builds. Two of those four (today.cjs, writers.cjs) THIS
   package then moves one owner-worded clause further, and nothing else: the
   refusal predates S10, and S10's clauses neither cause nor mend it (D-REASON-TEXT,
   Astra S10-INTEGRATION-REVIEW-L1). The only way to say that as a measurement
   rather than as a claim is to compare every engine byte against the parent,
   report the count, and name the two moves with their pre and post.

   THE PARENT HERE IS M2-S9-UI-PINS, WHICH ITSELF MOVED NO ENGINE BYTE, so the
   comparison chains: S9's own differential proved all 45 identical to S8's
   post, and this one proves every file this package does not name identical
   to S9's and says the two it moves out loud, with their pre and post.

   Every path and every sha below is read at run time from Git and from disk.
   Nothing is hard-coded but the two roots and the spec's own file name.
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
const EPP_CLAUSES = {
  'rebuild/engine/today.cjs': ['x.exId === e.id && !x.done && (x.kind', 'x.exId === e.id && !x.done && x.state !== "PROPOSED" && (x.kind'],
  'rebuild/engine/writers.cjs': ['x.exId === ex.id && !x.done && (x.kind', 'x.exId === ex.id && !x.done && x.state !== "PROPOSED" && (x.kind'],
};

const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S10.json'), 'utf8'));
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
   from Git at this package's sourceBase, plus the one owner-worded clause and nothing
   else - and the files it ADDS under rebuild/engine/ are declared new. Every other
   named file stands at the parent's own post with pre === post. */
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
  if (Object.hasOwn(EPP_CLAUSES, f)) {
    const [before, after] = EPP_CLAUSES[f];
    const parentBytes = git(['show', SPEC.sourceBase + ':' + f]).toString('utf8');
    assert.equal(sha(Buffer.from(parentBytes, 'utf8')), w.want, 'the parent bytes at the sourceBase are the parent\'s ' + w.against + ': ' + f);
    assert.equal(parentBytes.split(before).length, 2, 'the parent carries the unrepaired lookup exactly once: ' + f);
    assert.equal(fs.readFileSync(path.join(REPO, f), 'utf8'), parentBytes.replace(before, () => after), 'the tree is the parent plus exactly one clause: ' + f);
    assert.equal(p.role, 'edited', 'declared edited: ' + f);
    assert.equal(p.pre, w.want, 'pre is the parent post: ' + f);
    assert.equal(p.post, got, 'post is the byte on disk: ' + f);
    moved.push(f);
    console.log('  MOVED ' + f + ' ' + p.pre.slice(0, 12) + ' -> ' + p.post.slice(0, 12) + ' (declared, one clause)');
    continue;
  }
  assert.equal(p.role, 'carried', 'a named engine file is declared carried: ' + f);
  assert.equal(p.pre, p.post, 'its declared pre-image is its declared post-image: ' + f);
  assert.equal(got, p.post, 'and that is the byte on disk: ' + f);
  assert.equal(got, w.want, 'which is the parent\'s own ' + w.against + ': ' + f);
  console.log('  CARRIED ' + f + ' ' + got.slice(0, 12) + ' against the ' + w.against + ' (declared, pre === post)');
}
assert.deepEqual(moved.slice().sort(), Object.keys(EPP_CLAUSES).sort(), 'exactly the two files the brief declares are the only engine bytes that move');
assert.equal(rows.length + named.length, tracked.length, 'the split is exhaustive');
console.log('ENGINE FILES DIFFERENTIAL: ' + rows.length + ' tracked rebuild/engine file(s) outside this package\'s declared product, all byte-identical to the parent; '
  + moved.length + ' named files move, each by one declared clause, and ' + added.length + ' named file(s) are added;');
