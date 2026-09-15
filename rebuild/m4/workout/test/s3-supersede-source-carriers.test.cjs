'use strict';
/* =====================================================================
   M2-S3-COMPANION SUPERSEDES THE NATIVE-CARRIERS CARRIER `source-carriers`
   (gates migrate-source, merge-source, writers-source)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. Not that the engine was
   pinned but that it was RECONSTRUCTED: `native-carriers-source.cjs` reads
   every carried engine file from a frozen `BASE` with `git show`, applies the
   48 literal carriers of `native-carriers-changes.json` (whose bytes are
   pinned by `CHANGES_SHA` at native-carriers-source.cjs:37), asserts the
   constructed sha equals the declared post-image, and then asserts the file
   ON DISK is byte-identical to the construction. Every other `rebuild/engine`
   file is asserted equal to `git show BASE:` outright.

   WHY S3 CANNOT CARRY IT. S3 changes two engine files (merge.cjs, the
   nativeDate seam; today.cjs, the session pool and membership reader), and
   the carrier list is sha-pinned, so the construction cannot produce S3's
   bytes; moving `CHANGES_SHA` is not a pin re-target and `DECISIONS:113 (1)
   (c)`, even as `:147` widened it, admits nothing else. H3 measured the same
   wall for its two files (BRIEF-H3-CLEAN-INIT section 9), and H3's own
   artifact retired these gates under DECISIONS:153/:160; this package stands
   on the same standing role with its own token line.

   WHAT S3 PUTS IN ITS PLACE, HERE, EXECUTED. The same mechanic, over S3's own
   declared hunks: a literal carrier list, stated below and NOT read from the
   diff, applied FORWARD to the `sourceBase` blobs and INVERSE to the bytes on
   disk. Both directions must be byte-exact, every `before` and every `after`
   must stand exactly once, and every other file under `rebuild/engine` must
   be byte-identical to `sourceBase`, with the file inventory closed on both
   sides.

   RED-FIRST: on the parent's engine bytes the inverse table finds no site and
   the two declared post-images are absent (cells 2 and 4 below).
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S3.json'), 'utf8'));
const BASE = SPEC.sourceBase;
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const disk = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const CHANGED = ['rebuild/engine/merge.cjs', 'rebuild/engine/today.cjs'];

/* S3'S OWN LITERAL CARRIER LIST. One row per contiguous hunk, `before` the
   sourceBase text and `after` S3's, both verbatim. Nothing here is derived at
   run time: this is the declaration the two cells below hold S3 to. The merge
   rows are the six routed calendar operations and the signature; the today
   rows are the pool extraction, the reader and the export. */
const CARRIERS = [
 {
  "file": "rebuild/engine/merge.cjs",
  "id": "merge-signature",
  "before": "module.exports = function createMerge(E, { clock }) {\n",
  "after": "module.exports = function createMerge(E, { clock, nativeDate = Date }) {\n/* M2-S3-COMPANION (rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md, B custody) — THE\n   NATIVE-DATE SEAM. `nativeDate` is the ONE constructor every calendar operation in this\n   engine goes through: the five parse sites (_corrOf, _fileCorr x2, _mergeSession,\n   _adjInstant) and the single constructor site in _fileCorr. It DEFAULTS TO THE NATIVE\n   `Date`, so every existing caller — createEngine, the runtime, every gate — composes\n   exactly the engine it composed before, byte for byte in behaviour: same coercion,\n   same NaN on a malformed stamp, same invalid-Date throw on toISOString, same +1 ms\n   live bump. An import provider (D custody, rebuild/m4/import) may supply an\n   instance-local adapter that captures the real native implementation and validates\n   each reached operation against a proved calendar; nothing here interprets a date\n   differently, and _sessionAtMs stays numeric coercion with no date reading at all. */\n"
 },
 {
  "file": "rebuild/engine/merge.cjs",
  "id": "merge-corrOf",
  "before": "  if (!at || !isFinite(Date.parse(at))) return null;        // malformed -> unstamped, falls to rule 1",
  "after": "  if (!at || !isFinite(nativeDate.parse(at))) return null;        // malformed -> unstamped, falls to rule 1"
 },
 {
  "file": "rebuild/engine/merge.cjs",
  "id": "merge-fileCorr-at",
  "before": "    let at9 = typeof at === \"string\" && isFinite(Date.parse(at)) ? at : ((rec.corr && rec.corr.at) || null);",
  "after": "    let at9 = typeof at === \"string\" && isFinite(nativeDate.parse(at)) ? at : ((rec.corr && rec.corr.at) || null);"
 },
 {
  "file": "rebuild/engine/merge.cjs",
  "id": "merge-fileCorr-bump",
  "before": "      at9 = new Date(Date.parse(latest9) + 1).toISOString();",
  "after": "      at9 = new nativeDate(nativeDate.parse(latest9) + 1).toISOString();"
 },
 {
  "file": "rebuild/engine/merge.cjs",
  "id": "merge-richerSession",
  "before": "  return _sessionAtMs(plain) > Date.parse(c.at) ? plain : stamped;             // 3 : 2",
  "after": "  return _sessionAtMs(plain) > nativeDate.parse(c.at) ? plain : stamped;             // 3 : 2"
 },
 {
  "file": "rebuild/engine/merge.cjs",
  "id": "merge-adjInstant",
  "before": "  if (x && x.at) { const t7 = Date.parse(x.at); if (isFinite(t7)) return t7; }",
  "after": "  if (x && x.at) { const t7 = nativeDate.parse(x.at); if (isFinite(t7)) return t7; }"
 },
 {
  "file": "rebuild/engine/today.cjs",
  "id": "today-pool-and-reader",
  "before": "// Copied from frozen src/app.jsx @ fe516c1:1481-1595.\nfunction genSession(s, iso, slp) {\n  const dt = dayType(iso, s);\n  if (dt !== \"U\" && dt !== \"L\") return null;\n  const { main, riders } = pickStructural(s, iso, slp);\n  const active = new Set([main, ...riders].filter(Boolean).map((q) => q.exId));\n  const ord = (s.exOrder && s.exOrder[dt]) || [];\n  const pool = s.exercises.filter((e) => e.day === dt && exActive(s, e.id)).sort((a, b) => {   /* SPLIT item d — retired lifts leave the day pool; the raw record is never filtered */\n    const ia = ord.indexOf(a.id), ib = ord.indexOf(b.id);\n    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);\n  });\n  const ex = pool.map((e) => {",
  "after": "/* M2-S3-COMPANION (rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md, B custody) — THE\n   SESSION POOL, extracted verbatim from genSession below: the day's exercise order,\n   the active-lift filter and the order sort, and nothing else. genSession keeps its\n   original day guard and its pickStructural -> active -> pool call order; this helper is\n   the pool step of that sequence, moved into a name so that sessionMembership can ask\n   the same question without reading sleep or the structural picker. */\nfunction _sessionPool(s, dt) {\n  const ord = (s.exOrder && s.exOrder[dt]) || [];\n  return s.exercises.filter((e) => e.day === dt && exActive(s, e.id)).sort((a, b) => {   /* SPLIT item d — retired lifts leave the day pool; the raw record is never filtered */\n    const ia = ord.indexOf(a.id), ib = ord.indexOf(b.id);\n    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);\n  });\n}\n/* M2-S3-COMPANION — SESSION MEMBERSHIP. The complete ordered pool of a training day, by\n   id, and nothing more: null for exactly the days genSession answers null (the non-U/L\n   predicate), otherwise a FRESH, frozen `{ day, exercise_ids }` carrying the ids of the\n   same pool genSession maps its cards from, in the same order. It reads no sleep, calls\n   no structural picker, computes no target or load, and hands out no exercise-object\n   alias, so a caller can prove pool and order of a recorded capture without inventing a\n   night to reproduce a prescription. */\nfunction sessionMembership(s, iso) {\n  const dt = dayType(iso, s);\n  if (dt !== \"U\" && dt !== \"L\") return null;\n  return Object.freeze({ day: dt, exercise_ids: Object.freeze(_sessionPool(s, dt).map((e) => e.id)) });\n}\n\n// Copied from frozen src/app.jsx @ fe516c1:1481-1595.\nfunction genSession(s, iso, slp) {\n  const dt = dayType(iso, s);\n  if (dt !== \"U\" && dt !== \"L\") return null;\n  const { main, riders } = pickStructural(s, iso, slp);\n  const active = new Set([main, ...riders].filter(Boolean).map((q) => q.exId));\n  const pool = _sessionPool(s, dt);\n  const ex = pool.map((e) => {"
 },
 {
  "file": "rebuild/engine/today.cjs",
  "id": "today-export",
  "before": "return { pickStructural, genSession, nowFocus,",
  "after": "return { pickStructural, genSession, sessionMembership, nowFocus,"
 }
];

test('S3/SUP-1 - source-carriers: S3 declares a literal carrier list and it reproduces the engine FORWARD from sourceBase, byte-exact', () => {
  assert.equal(CARRIERS.length, 8, 'eight declared carriers, no more');
  for (const c of CARRIERS) {
    assert(CHANGED.includes(c.file), c.id + ' touches a file S3 declares changed');
    assert(c.before.length && c.after.length && c.before !== c.after, c.id + ' is a real substitution');
  }
  for (const file of CHANGED) {
    let out = blob(file);
    for (const c of CARRIERS.filter(x => x.file === file)) {
      assert.equal(out.split(c.before).length, 2, 'unique exact source site: ' + c.id);
      out = out.replace(c.before, () => c.after);
    }
    assert.equal(out, disk(file), 'exact product construction: ' + file);
    assert.equal(sha(Buffer.from(out, 'utf8')), SPEC.product[file].post,
      'constructed carrier postimage is the declared post: ' + file);
  }
});

test('S3/SUP-2 - source-carriers: the INVERSE recovers the accepted preimage exactly, and RED on the parent bytes', () => {
  for (const file of CHANGED) {
    let back = disk(file);
    for (const c of CARRIERS.filter(x => x.file === file).slice().reverse()) {
      assert.equal(back.split(c.after).length, 2, 'unique inverse site: ' + c.id);
      back = back.replace(c.after, () => c.before);
    }
    assert.equal(back, blob(file), 'recovered accepted preimage: ' + file);
    assert.equal(sha(Buffer.from(back, 'utf8')), SPEC.product[file].pre, 'recovered preimage is the declared pre: ' + file);
    /* RED-FIRST, both directions. On the parent's bytes the post-image is not
       on disk and no `after` site exists to invert. */
    assert.notEqual(SPEC.product[file].pre, SPEC.product[file].post, file + ' really moves');
    for (const c of CARRIERS.filter(x => x.file === file))
      assert.equal(blob(file).includes(c.after), false, 'the parent bytes carry none of S3\'s own carrier text: ' + c.id);
  }
});

test('S3/SUP-3 - source-carriers: the rebuild/engine inventory is CLOSED and every other file is byte-identical to sourceBase', () => {
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
    'exactly the two files S3 declares differ from sourceBase, and no other engine byte moves');
});

test('S3/SUP-4 - source-carriers: what the gate cannot do, said with the numbers that make it impossible', () => {
  const src = disk('rebuild/m4/spec/native-carriers-source.cjs');
  /* The gate's own reconstruction, quoted from its own bytes. */
  assert(/const BASE='[0-9a-f]{40}'/.test(src), 'the carrier reads a frozen BASE');
  assert(src.includes("const CHANGES_FILE='rebuild/m4/spec/native-carriers-changes.json'"), 'and a literal carrier list');
  assert(/const CHANGES_SHA='[0-9a-f]{64}'/.test(src), 'whose bytes it PINS');
  const list = JSON.parse(disk('rebuild/m4/spec/native-carriers-changes.json'));
  assert.equal(list.length, 48, 'the parent list is 48 carriers');
  assert.equal(list.some(c => c.file === 'rebuild/engine/merge.cjs'), false,
    'and it carries no entry for merge.cjs at all, which is why that file is asserted equal to git show BASE:');
  /* S3's own hunks are not in it, and adding them would move CHANGES_SHA. */
  for (const c of CARRIERS)
    assert.equal(list.some(x => x.after === c.after), false, 'S3 hunk ' + c.id + ' is not one of the parent carriers');
  assert.equal(sha(Buffer.from(disk('rebuild/m4/spec/native-carriers-changes.json'), 'utf8')),
    /const CHANGES_SHA='([0-9a-f]{64})'/.exec(src)[1],
    'the list on disk IS the pinned list, so extending it moves a sha no substitution may re-target');
  /* And the grandparent's own retirement of these gates is on the record: the H3
     artifact this package stands on names them SUPERSEDED, not covered. */
  const H3 = JSON.parse(disk(SPEC.parent.options.find(o => o.id === SPEC.parent.chosen).artifact));
  assert.deepEqual(H3.coverage.supersededByCarrier['source-carriers'], ['merge-source', 'migrate-source', 'writers-source']);
  assert.deepEqual(H3.coverage.byChild, {}, 'the parent covered no gate by a carrier of its own');
});
