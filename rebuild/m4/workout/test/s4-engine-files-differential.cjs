'use strict';
/* =====================================================================
   DECISIONS:153 (ii) - THE NAMED-FILES ENGINE DIFFERENTIAL, FOR M2-S4-REAL-DAY
   The fifth required evidence slot of the standing gate-supersession role
   (DECISIONS:153), under this package's own token line DECISIONS:444.
   Templated on S3's s3-engine-files-differential.cjs, with one difference that
   is the whole point of this package: S4 NAMES eighteen files under
   rebuild/engine/ and MOVES NONE OF THEM. So the differential has no "moved"
   half at all, and it proves the stronger sentence instead:

     every tracked file under rebuild/engine/, named or not, stands
     BYTE-IDENTICAL to the PARENT'S OWN POST.

   WHAT IT PROVES, EXACTLY. For each tracked path: the parent artifact's
   declared `post` where it declares one, and otherwise the blob at the
   parent's own `sourceBase`. The runner computes the same identity itself over
   the files this package does NOT declare (`supersessionEngineIdentity`,
   b-package.cjs) and then holds this child's verdict line to the count IT
   measured, so neither side can drift alone; this child measures the declared
   eighteen as well, which the runner by construction cannot.

   WHY THAT IS THE RIGHT COROBORATION. The five superseded carriers are
   byte-identity reconstructions of the engine. They refuse on this tree
   because FOUR files four ancestor packages moved are no longer what the
   frozen reconstruction builds - not because this package moved anything. The
   only way to say that as a measurement rather than as a claim is to compare
   every engine byte against the parent and report the count.

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

const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S4.json'), 'utf8'));
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
/* The eighteen this package DOES name, said out loud on the same run so the
   split is visible rather than implied. Not one of them moves: each stands at
   the parent's own post, and its declared pre-image IS its declared
   post-image, which is what "this package changes no engine byte" means when
   it is written down as a measurement. */
const moved = [];
for (const f of named) {
  const w = want(f), got = diskSha(f);
  const p = SPEC.product[f];
  assert.equal(p.role, 'carried', 'a named engine file is declared carried: ' + f);
  assert.equal(p.pre, p.post, 'its declared pre-image is its declared post-image: ' + f);
  assert.equal(got, p.post, 'and that is the byte on disk: ' + f);
  assert.equal(got, w.want, 'which is the parent\'s own ' + w.against + ': ' + f);
  if (got !== w.want) moved.push(f);
  console.log('  CARRIED ' + f + ' ' + got.slice(0, 12) + ' against the ' + w.against + ' (declared, pre === post)');
}
assert.deepEqual(moved, [], 'M2-S4-REAL-DAY moves no engine byte, so no named file moves either');
assert.equal(rows.length + named.length, tracked.length, 'the split is exhaustive');
console.log('ENGINE FILES DIFFERENTIAL: ' + rows.length + ' tracked rebuild/engine file(s) outside this package\'s declared product, all byte-identical to the parent; '
  + named.length + ' named and NOT ONE moves, so all ' + tracked.length + ' tracked rebuild/engine file(s) stand byte-identical to the parent\'s own post;');
