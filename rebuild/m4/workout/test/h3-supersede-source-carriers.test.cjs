'use strict';
/* =====================================================================
   H3 SUPERSEDES THE NATIVE-CARRIERS CARRIER `source-carriers`
   (gates migrate-source, merge-source, writers-source)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. Not that the engine was
   pinned — that it was RECONSTRUCTED: `native-carriers-source.cjs` reads every
   carried engine file from a frozen `BASE` with `git show`, applies the 48
   literal carriers of `native-carriers-changes.json` (whose bytes are pinned by
   `CHANGES_SHA` at native-carriers-source.cjs:37), asserts the constructed
   sha equals the declared post-image, and then asserts the file ON DISK is
   byte-identical to the construction. Every other `rebuild/engine` file is
   asserted equal to `git show BASE:` outright.

   WHY H3 CANNOT CARRY IT. H3 changes two engine files, and the carrier list is
   sha-pinned, so the construction cannot produce H3's bytes; moving
   `CHANGES_SHA` is not a pin re-target and `DECISIONS:113 (1) (c)` — even as
   `:147` widened it — admits nothing else. BRIEF-H3-CLEAN-INIT v1.8 section 9
   measures the whole chain.

   WHAT H3 PUTS IN ITS PLACE, HERE, EXECUTED. The same mechanic, over H3's own
   declared hunks: a literal carrier list, stated below and NOT read from the
   diff, applied FORWARD to the `sourceBase` blobs and INVERSE to the bytes on
   disk. Both directions must be byte-exact, every `before` and every `after`
   must stand exactly once, and every other file under `rebuild/engine` must be
   byte-identical to `sourceBase`, with the file inventory closed on both sides.
   That is strictly what the carrier asserted, re-based on H3's own post-image.

   RED-FIRST: on the parent's engine bytes the inverse table finds no site and
   the two declared post-images are absent — cells 2 and 4 below.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/H3.json'), 'utf8'));
const BASE = SPEC.sourceBase;
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const disk = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const CHANGED = ['rebuild/engine/writers.cjs', 'rebuild/engine/constants.cjs'];

/* H3'S OWN LITERAL CARRIER LIST. One row per contiguous hunk, `before` the
   sourceBase text and `after` H3's, both verbatim. Nothing here is derived at
   run time: this is the declaration the two cells below hold H3 to. */
const CARRIERS = [
 {
  "file": "rebuild/engine/writers.cjs",
  "id": "writers-1",
  "before": "  const dRaw = w - s.trend, dCl = Math.max(-1.5, Math.min(1.5, dRaw));\n  const spike = Math.abs(dRaw) > 1.5;",
  "after": "  /* H3 / F-B (DECISIONS:142 (3)) — THE FIRST READ. Every state this writer was\n     built for arrived with a `trend` already on it (seed.cjs, or migrate.cjs\n     walking one forward). A CLEAN-INIT athlete has none, and must not: he has\n     declared no bodyweight and nothing may invent one for him. Without this\n     branch `s.trend + 0.3 * dCl` is `undefined + …` = NaN on his very first\n     weigh-in, and every figure downstream stays non-finite for good.\n     The seed is the READING ITSELF — his own number, the engine's first\n     observation of the level, never a default or another athlete's figure. It\n     is taken verbatim rather than rounded, because rounding it would already be\n     changing what he typed; every later trend keeps the accepted 1-dp EMA.\n     THE WINDOW APPLIES TO THE FIRST READ TOO — DECISIONS:146 (3), OPTION B.\n     The first draft seeded the trend whatever the window, and review r1 caught\n     what that made the app say: a first read at 23:00 came back\n     `offWindow: true`, `note: \"late read — set aside\"`, a feed line reading\n     LATE READ - SET ASIDE, and the trend was that reading; a sealed first read\n     said \"sealed - excluded from trend\" and was the trend. The same two calls\n     on a trend-carrying athlete really do leave his trend alone, so two\n     athletes were told the same words and given different arithmetic. The PM\n     ruled the contradiction out rather than rewriting the copy: a set-aside\n     reading is set aside for a new athlete exactly as it is for an old one,\n     and until an in-window, unsealed reading arrives Today keeps saying\n     \"Not available yet\" - which is true, and which H3/5 proves is safe,\n     because every figure derived from an absent trend stays non-finite.\n     Nothing else changes — for any state that already carries a finite trend\n     `first` is false and every line below is the accepted one, byte for byte in\n     behaviour (45 laws unmoved, public census byte-identical). */\n  const first = !Number.isFinite(s.trend);\n  const dRaw = first ? 0 : w - s.trend, dCl = Math.max(-1.5, Math.min(1.5, dRaw));\n  const spike = !first && Math.abs(dRaw) > 1.5;"
 },
 {
  "file": "rebuild/engine/writers.cjs",
  "id": "writers-2",
  "before": "  const row9 = { d: iso, w, sealed, pt: s.trend, note: note9 };",
  "after": "  // `pt` is the PRIOR trend. On the first read there is none, and `null` says\n  // that; `undefined` would be dropped by the JSON round trip above and read\n  // back as a member that was never written.\n  const row9 = { d: iso, w, sealed, pt: first ? null : s.trend, note: note9 };"
 },
 {
  "file": "rebuild/engine/writers.cjs",
  "id": "writers-3",
  "before": "  if (!sealed && !offW) s.trend = +(s.trend + 0.3 * dCl).toFixed(1);",
  "after": "  // DECISIONS:146 (3) option B: the first reading seeds the trend only when the\n  // same row is neither sealed nor off-window — one window test, both branches.\n  if (!sealed && !offW) s.trend = first ? w : +(s.trend + 0.3 * dCl).toFixed(1);"
 },
 {
  "file": "rebuild/engine/constants.cjs",
  "id": "constants-1",
  "before": "const MG_LABEL = { delts_side: \"side delt\", delts_rear: \"rear delt\", delts_front: \"front delt\" };",
  "after": "/* F2 LABEL half (DECISIONS:135 (5), bundled into H3). A lift is bucketed by\n   `e.head || e.mg` (volume.cjs:74) and the bucket is rendered by\n   `<this table>[k] || k` (volume.cjs:32). A REGION HEAD therefore needs an\n   entry here or it prints its own key; a bare muscle label needs none, because\n   for those the key already IS the word people read.\n   The four added below are the BACK region's heads, keyed `<muscle>_<head>`\n   exactly as the three delt heads already are.\n   THEY ARE INERT ON THIS TREE, and saying so is the point. No producer sets\n   `e.head` to any of them: seed.cjs and migrate.cjs set only `delts_side` and\n   `delts_rear`, and lane C's catalogue does not name them either — grep over\n   rebuild/m3/w7-preview/today, rebuild/lanes/c/dad-first-run and rebuild/engine\n   finds these four keys, and the strings \"upper back\" and \"lower back\", nowhere\n   but on the line below. So the table is reachable only once some producer\n   writes one of these heads onto a lift; until then `MG_LABEL[k] || k` is never\n   consulted for them and no screen changes. That is also exactly why the public\n   census cannot move, which the package proves by running it both ways.\n   The leg, arm and core heads the bundle also names are\n   ALREADY the engine's own muscle labels (rebuild/engine/seed.cjs `mg` values;\n   rebuild/m3/w7-preview/today/setup-model.mjs:26 MG_LABELS), so `|| k` renders\n   every one of them identically today and an entry would change no character on\n   any screen. They are deliberately NOT added: lane C's accepted provenance\n   cell 2.8 row 2 in rebuild/m3/w7-preview/today/test/setup.test.mjs asserts this\n   table carries no gloss for the labels first-run collects, and a no-op entry\n   would break that cell to buy nothing. The brief records this as the one place\n   the bundle's wording and the tree disagree, with the measurement. */\nconst MG_LABEL = { delts_side: \"side delt\", delts_rear: \"rear delt\", delts_front: \"front delt\",\n  back_lats: \"lats\", back_upper: \"upper back\", back_traps: \"traps\", back_lower: \"lower back\" };"
 }
];;

test('H3/SUP-1 - source-carriers: H3 declares a literal carrier list and it reproduces the engine FORWARD from sourceBase, byte-exact', () => {
  assert.equal(CARRIERS.length, 4, 'four declared carriers, no more');
  for (const c of CARRIERS) {
    assert(CHANGED.includes(c.file), c.id + ' touches a file H3 declares changed');
    assert(c.before.length && c.after.length && c.before !== c.after, c.id + ' is a real substitution');
  }
  for (const file of CHANGED) {
    let out = blob(file);
    for (const c of CARRIERS.filter(x => x.file === file)) {
      assert.equal(out.split(c.before).length, 2, 'unique exact source site: ' + c.id);
      out = out.replace(c.before, c.after);
    }
    assert.equal(out, disk(file), 'exact product construction: ' + file);
    assert.equal(sha(Buffer.from(out, 'utf8')), SPEC.product[file].post,
      'constructed carrier postimage is the declared post: ' + file);
  }
});

test('H3/SUP-2 - source-carriers: the INVERSE recovers the accepted preimage exactly, and RED on the parent bytes', () => {
  for (const file of CHANGED) {
    let back = disk(file);
    for (const c of CARRIERS.filter(x => x.file === file)) {
      assert.equal(back.split(c.after).length, 2, 'unique inverse site: ' + c.id);
      back = back.replace(c.after, c.before);
    }
    assert.equal(back, blob(file), 'recovered accepted preimage: ' + file);
    assert.equal(sha(Buffer.from(back, 'utf8')), SPEC.product[file].pre, 'recovered preimage is the declared pre: ' + file);
    /* RED-FIRST, both directions. On the parent's bytes the post-image is not
       on disk and no `after` site exists to invert. */
    assert.notEqual(SPEC.product[file].pre, SPEC.product[file].post, file + ' really moves');
    assert.equal(blob(file).includes(CARRIERS.find(c => c.file === file).after), false,
      'the parent bytes carry none of H3\'s own carrier text: ' + file);
  }
});

test('H3/SUP-3 - source-carriers: the rebuild/engine inventory is CLOSED and every other file is byte-identical to sourceBase', () => {
  const dir = 'rebuild/engine';
  const onDisk = fs.readdirSync(path.join(REPO, dir)).filter(n => n.endsWith('.cjs')).sort();
  const atBase = cp.execFileSync('git', ['ls-tree', '--name-only', BASE + ':' + dir], { cwd: REPO, maxBuffer: 9e7 })
    .toString('utf8').split('\n').filter(n => n.endsWith('.cjs')).sort();
  assert.deepEqual(onDisk, atBase, 'no engine file added and none removed');
  const moved = [];
  for (const n of onDisk) {
    const f = dir + '/' + n;
    if (disk(f) !== blob(f)) moved.push(f);
  }
  assert.deepEqual(moved.sort(), CHANGED.slice().sort(),
    'exactly the two files H3 declares differ from sourceBase, and no other engine byte moves');
});

test('H3/SUP-4 - source-carriers: what the gate cannot do, said with the numbers that make it impossible', () => {
  const src = disk('rebuild/m4/spec/native-carriers-source.cjs');
  /* The gate's own reconstruction, quoted from its own bytes. */
  assert(/const BASE='[0-9a-f]{40}'/.test(src), 'the carrier reads a frozen BASE');
  assert(src.includes("const CHANGES_FILE='rebuild/m4/spec/native-carriers-changes.json'"), 'and a literal carrier list');
  assert(/const CHANGES_SHA='[0-9a-f]{64}'/.test(src), 'whose bytes it PINS');
  const list = JSON.parse(disk('rebuild/m4/spec/native-carriers-changes.json'));
  assert.equal(list.length, 48, 'the parent list is 48 carriers');
  assert.equal(list.some(c => c.file === 'rebuild/engine/constants.cjs'), false,
    'and it carries no entry for constants.cjs at all, which is why that file is asserted equal to git show BASE:');
  /* H3's own writers hunks are not in it, and adding them would move CHANGES_SHA. */
  for (const c of CARRIERS)
    assert.equal(list.some(x => x.after === c.after), false, 'H3 hunk ' + c.id + ' is not one of the parent carriers');
  assert.equal(sha(Buffer.from(disk('rebuild/m4/spec/native-carriers-changes.json'), 'utf8')),
    /const CHANGES_SHA='([0-9a-f]{64})'/.exec(src)[1],
    'the list on disk IS the pinned list, so extending it moves a sha no substitution may re-target');
});
