'use strict';
/* =====================================================================
   DECISIONS:153 (ii) — THE NAMED-FILES ENGINE DIFFERENTIAL
   The fifth required evidence slot of the standing gate-supersession role
   (DECISIONS:153, granted to this package by the token line at DECISIONS:160).

   WHAT IT PROVES. That every tracked file under `rebuild/engine/` which this
   package's brief does NOT name stands byte-identical to the parent's own
   image of it: to the parent artifact's declared `post` where it declares one,
   and otherwise to the blob at the parent's own `sourceBase`. H3's brief names
   eighteen files under that root — the sixteen engine modules it carries and
   the two it edits (`writers.cjs`, F-B, and `constants.cjs`, F2 LABEL) — so the
   comparison here is over the REMAINDER, which on this tree is the twenty-seven
   programmes under `rebuild/engine/test/`: the NATIVE-CARRIERS gate bodies
   themselves, the very files the superseded carriers execute.

   WHY THAT IS THE RIGHT COROBORATION. The five superseded carriers are
   byte-identity reconstructions of the engine. H3 cannot reproduce two of the
   files they reconstruct, and says so. What it CAN show — and must, because
   otherwise "only two files moved" is a claim and not a measurement — is that
   nothing else under that root moved at all, the gate programmes included. The
   runner computes the same set and the same identity itself
   (`supersessionEngineIdentity`, b-package.cjs), and then holds THIS child's
   verdict line to the count IT measured, so neither side can drift alone.

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

const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/H3.json'), 'utf8'));
const PARENT_PATH = SPEC.parent.options.find(o => o.id === SPEC.parent.chosen).artifact;
const PARENT_RAW = fs.readFileSync(path.join(REPO, PARENT_PATH));
/* The parent artifact by its own immutable sha256, exactly as the spec pins it:
   nothing below is read until the bytes are the accepted bytes. */
assert.equal(sha(PARENT_RAW), SPEC.parent.options.find(o => o.id === SPEC.parent.chosen).sha256,
  'the accepted parent artifact is the bytes this spec pins: ' + PARENT_PATH);
const PARENT = JSON.parse(PARENT_RAW);
const BASE = PARENT.sourceBase;
assert(/^[a-f0-9]{40}$/.test(BASE), 'the parent artifact names its own sourceBase');

const tracked = git(['ls-files', '-z', ENGINE_ROOT.slice(0, -1)]).toString('utf8')
  .split('\0').filter(f => f.startsWith(ENGINE_ROOT));
assert(tracked.length >= 40, 'the real tracked inventory under ' + ENGINE_ROOT + ': ' + tracked.length);
const named = tracked.filter(f => Object.hasOwn(SPEC.product, f));
const outside = tracked.filter(f => !Object.hasOwn(SPEC.product, f));
assert(named.length && outside.length, 'the brief names some engine files and leaves others');

const rows = [];
for (const f of outside) {
  const pin = PARENT.product[f];
  const declared = pin && pin.post !== null && pin.post !== undefined;
  const want = declared ? pin.post : blobSha(BASE, f);
  const got = diskSha(f);
  rows.push({ f, against: declared ? 'parent post' : 'parent sourceBase ' + BASE.slice(0, 7), want, got });
  assert.equal(got, want, 'engine file outside the brief moved: ' + f +
    ' (disk ' + got.slice(0, 12) + ', parent ' + want.slice(0, 12) + ')');
}
for (const r of rows) console.log('  SAME ' + r.f + ' ' + r.got.slice(0, 12) + ' against the ' + r.against);
/* The two this package DOES name, said out loud on the same run so the split is
   visible rather than implied: they are the only engine bytes that move, and
   each stands at the post-image the spec declares for it. */
const moved = named.filter(f => diskSha(f) !== (PARENT.product[f] && PARENT.product[f].post ? PARENT.product[f].post : blobSha(BASE, f)));
for (const f of moved) {
  assert.equal(diskSha(f), SPEC.product[f].post, 'a named engine file stands at its declared post: ' + f);
  console.log('  MOVED ' + f + ' ' + SPEC.product[f].pre.slice(0, 12) + ' -> ' + SPEC.product[f].post.slice(0, 12) + ' (declared)');
}
assert.deepEqual(moved.slice().sort(), ['rebuild/engine/constants.cjs', 'rebuild/engine/writers.cjs'],
  'exactly the two files the brief declares are the only engine bytes that move');
console.log('ENGINE FILES DIFFERENTIAL: ' + rows.length + ' tracked rebuild/engine file(s) outside this package\'s declared product, all byte-identical to the parent; '
  + moved.length + ' named files move and each stands at its declared post-image;');
