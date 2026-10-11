'use strict';
/* =====================================================================
   M2-S14-HOLD SUPERSEDES THE NATIVE-CARRIERS CARRIER `source-carriers`
   (gates migrate-source, merge-source, writers-source)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. Not that the engine was
   pinned but that it was RECONSTRUCTED: `native-carriers-source.cjs` reads
   every carried engine file from a frozen `BASE` with `git show`, applies the
   48 literal carriers of `native-carriers-changes.json` (whose bytes are
   pinned by `CHANGES_SHA`), asserts the constructed sha equals the declared
   post-image, and then asserts the file ON DISK is byte-identical to the
   construction. Every other `rebuild/engine` file is asserted equal to
   `git show BASE:` outright. The three original gate programmes do the same
   from the frozen `fe516c1:src/app.jsx` declarations.

   WHY S14 CANNOT CARRY IT. M2-S14-HOLD (brief S14-HOLD-BW-BRIEF.md, DECISIONS:913,
   :922) moves ONE rebuild/engine file, native-load.cjs, by its declared E1 hunks
   (s14-native-load-moves.cjs; the hold/bodyweight configuration adoption and the
   setLoads key), adds none, and every other tracked file stands at the parent's
   own post; SUP-1 asserts all of it over the whole inventory. The reconstruction
   was already false at the parent: S14's ancestors moved FIVE of the files it
   rebuilds (constants.cjs and writers.cjs by M2-H3-CLEAN-INIT, merge.cjs and
   today.cjs by M2-S3-COMPANION, today.cjs and writers.cjs again by
   M2-S10-TODAY-SPLIT, writers.cjs by FG01 and progression.cjs by FG02 at the
   parent M2-S11-NATIVE-LOAD), and native-load.cjs, which the parent ADDED,
   stands outside the carrier's CLOSED inventory, the first thing verify()
   refuses. The PARENT retired these same gates under its own token line
   DECISIONS:873 for exactly that reason. S14 mends none of it and adds no wall:
   the file it moves already stood outside the closed inventory at the parent.

   THIS IS THE TENTH GENERATION, AND THE POINT IS THAT NOTHING DECAYS. Each
   package in the line retires the nine AGAIN under its OWN token line and its
   OWN executed evidence, inheriting from its parent's retirement nothing but
   the gate list (b-package.cjs parentCarrierGates). DECISIONS:153 is the
   standing role; :873 is the PARENT's token line and this package's own is the
   GATE-SUPERSESSION M2-S14-HOLD line the PM writes (S14-SEAL-RUNBOOK.md S9 (2)).

   RED-FIRST, EXECUTED HERE, TWICE: SUP-2 runs the carrier's own verifier and
   it refuses; SUP-3 runs the ORIGINAL gate programme migrate-source and it
   refuses. Every one of SUP-2's five files had left the reconstruction before
   this package; SUP-3's is not moved by it at all.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S14.json'), 'utf8'));
const OPTION = SPEC.parent.options.find(o => o.id === SPEC.parent.chosen);
const PARENT_RAW = fs.readFileSync(path.join(REPO, OPTION.artifact));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
assert.equal(sha(PARENT_RAW), OPTION.sha256, 'the accepted parent artifact is the bytes this spec pins');
const PARENT = JSON.parse(PARENT_RAW);
const NC = require('../../spec/native-carriers-source.cjs');
const { NL_MOVES } = require('./s14-native-load-moves.cjs');
const git = a => cp.execFileSync('git', a, { cwd: REPO, maxBuffer: 9e7 });
const disk = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const diskSha = f => sha(fs.readFileSync(path.join(REPO, f)));
const blob = (rev, f) => git(['show', rev + ':' + f]).toString('utf8');
const blobSha = (rev, f) => sha(git(['show', rev + ':' + f]));
const ENGINE_ROOT = 'rebuild/engine/';
const NATIVE_LOAD = ENGINE_ROOT + 'native-load.cjs';
const tracked = git(['ls-files', '-z', 'rebuild/engine']).toString('utf8').split('\0').filter(f => f.startsWith(ENGINE_ROOT));
/* What the parent's own artifact says this file must be: its declared post
   where it declares one, otherwise the blob at the parent's own sourceBase. */
const parentWant = f => {
  const pin = PARENT.product[f];
  return pin && pin.post !== null && pin.post !== undefined ? pin.post : blobSha(PARENT.sourceBase, f);
};
const nlMoved = f => Object.hasOwn(NL_MOVES, f);
const addedHere = f => Object.hasOwn(SPEC.product, f) && SPEC.product[f].pre === null;
function assertNlMovesOnly(f) {
  const parentBytes = git(['show', SPEC.sourceBase + ':' + f]).toString('utf8');
  assert.equal(sha(Buffer.from(parentBytes, 'utf8')), parentWant(f), 'the parent bytes at this package\'s sourceBase are the parent\'s own post: ' + f);
  let body = parentBytes;
  NL_MOVES[f].forEach(([before, after], i) => {
    assert.equal(body.split(before).length, 2, 'declared hunk ' + (i + 1) + ' has exactly one site, applied in order: ' + f);
    body = body.replace(before, () => after);
  });
  assert.equal(fs.readFileSync(path.join(REPO, f), 'utf8'), body,
    'and the tree is the parent plus exactly its declared hunks, nothing else: ' + f);
  const p = SPEC.product[f];
  assert.equal(p.role, 'edited', 'this package declares it edited: ' + f);
  assert.equal(p.pre, parentWant(f), 'its declared pre-image is the parent post: ' + f);
  assert.equal(p.post, diskSha(f), 'and its declared post-image is the byte on disk: ' + f);
}

test('S14/SUP-1 - source-carriers: M2-S14 moves EXACTLY one rebuild/engine file, native-load.cjs, by its declared hunks only, and adds none, over the whole tracked inventory', () => {
  assert.equal(PARENT.packageId, 'M2-S11-NATIVE-LOAD', 'the bound parent is S11');
  assert(tracked.length >= 40, 'the real tracked inventory under ' + ENGINE_ROOT + ': ' + tracked.length);
  const named = tracked.filter(f => Object.hasOwn(SPEC.product, f));
  const outside = tracked.filter(f => !Object.hasOwn(SPEC.product, f));
  assert(named.length && outside.length, 'the brief names some engine files and leaves others');
  const moved = [], added = [];
  for (const f of tracked) {
    if (addedHere(f)) { added.push(f); continue; }
    if (diskSha(f) !== parentWant(f)) { moved.push(f); continue; }
    /* And the same bytes stand in Git at this package's own sourceBase, so the
       claim is not a reading of a dirty tree. */
    assert.equal(diskSha(f), blobSha(SPEC.sourceBase, f), 'disk equals the sourceBase blob: ' + f);
  }
  assert.deepEqual(moved.sort(), Object.keys(NL_MOVES).sort(),
    'exactly native-load.cjs moves from the parent post, and no other tracked rebuild/engine file');
  assert.deepEqual(added, [], 'and no rebuild/engine file is added');
  for (const f of moved) assertNlMovesOnly(f);
  for (const f of named) {
    if (nlMoved(f)) continue;
    const p = SPEC.product[f];
    assert.equal(p.role, 'carried', 'every other engine file this package names is declared carried: ' + f);
    assert.equal(p.pre, p.post, 'and its pre-image IS its post-image: ' + f);
    assert.equal(p.post, diskSha(f), 'and that is the byte on disk: ' + f);
    assert.equal(p.post, parentWant(f), 'and it is the parent artifact\'s own pin: ' + f);
  }
  console.log('  ENGINE MOVES ' + tracked.length + ' tracked file(s), ' + named.length + ' named, ' + outside.length +
    ' outside, ' + moved.length + ' moved, each by its declared hunks only, ' + added.length + ' added');
});

test('S14/SUP-2 - source-carriers: RED-FIRST - the carrier\'s own verifier, EXECUTED here, refuses on this tree', () => {
  /* The construction itself is intact: the frozen BASE plus the 48 pinned
     carriers still builds what it always built. It is the tree that has left
     it, and it had left it at the parent already: the parent's added
     native-load.cjs stands outside the CLOSED inventory, which verify() refuses
     first, and five rebuilt files had moved off it. S14 adds no wall. */
  const built = NC.construct(NC.baseline(REPO));
  assert(/^[a-f0-9]{40}$/.test(NC.BASE), 'the carrier reads a frozen BASE');
  assert.notEqual(NC.BASE, SPEC.sourceBase, 'and it is not this package\'s own base');
  assert.throws(() => NC.verify(REPO), /Closed engine file inventory/,
    'the carrier refuses at its closed engine inventory, before it compares a single rebuilt file');
  const closed = NC.ENGINE.map(f => path.basename(f)).sort();
  const onDisk = fs.readdirSync(path.join(REPO, ENGINE_ROOT)).filter(n => n.endsWith('.cjs')).sort();
  assert.deepEqual(closed.filter(n => !onDisk.includes(n)), [], 'no file of the closed inventory is missing from the tree');
  assert.deepEqual(onDisk.filter(n => !closed.includes(n)), ['native-load.cjs'],
    'and exactly one stands outside it: the native-load.cjs the parent added');
  assert.equal(PARENT.product[NATIVE_LOAD].role, 'new', 'which the PARENT declared new, so the wall predates this package');
  assert.equal(SPEC.product[NATIVE_LOAD].role, 'edited', 'and which this package declares edited');
  /* Every divergence past the inventory, enumerated rather than summarised. */
  const diverged = [];
  for (const f of Object.keys(built)) if (f.startsWith(ENGINE_ROOT) && disk(f) !== built[f]) diverged.push(f);
  for (const f of NC.RETAINED) if (!Object.hasOwn(built, f) && disk(f) !== blob(NC.BASE, f)) diverged.push(f);
  assert.deepEqual(diverged.sort(), ['rebuild/engine/constants.cjs', 'rebuild/engine/merge.cjs',
    'rebuild/engine/progression.cjs', 'rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs'],
    'exactly five engine files stand outside the reconstruction, and they are named here');
  /* All five had ALREADY left it at the parent, measured on the parent's own post. */
  const leftAtParent = diverged.filter(f => Object.hasOwn(built, f)
    ? parentWant(f) !== sha(Buffer.from(built[f], 'utf8')) : parentWant(f) !== blobSha(NC.BASE, f));
  assert.deepEqual(leftAtParent, diverged,
    'all five had already left the reconstruction at the parent, so the refusal predates this package entirely');
  for (const f of diverged) {
    assert.equal(nlMoved(f), false, 'this package moves none of them: ' + f);
    assert.equal(diskSha(f), parentWant(f), 'and each of them stands at the PARENT\'s own post: ' + f);
    assert.equal(SPEC.product[f].pre, SPEC.product[f].post, 'and this package declares it carried, pre === post: ' + f);
    console.log('  RECONSTRUCTION REFUSES ' + f + ' disk ' + diskSha(f).slice(0, 12) + ' inherited unmoved from the parent');
  }
  assertNlMovesOnly(NATIVE_LOAD);
  console.log('  RECONSTRUCTION REFUSES the closed inventory at native-load.cjs, added by the parent, moved here by ' + NL_MOVES[NATIVE_LOAD].length + ' declared hunk(s)');
});

test('S14/SUP-3 - source-carriers: RED-FIRST - the ORIGINAL gate migrate-source, EXECUTED, refuses at its first declaration', () => {
  const GATE = 'rebuild/engine/test/migrate-source.cjs';
  const r = cp.spawnSync(process.execPath, [GATE], { cwd: REPO, encoding: 'utf8', maxBuffer: 9e7 });
  assert.notEqual(r.status, 0, 'the gate programme refuses on this tree');
  assert(/exact declaration migrate/.test(String(r.stderr)), 'and it refuses at the migrate declaration: ' +
    String(r.stderr).split('\n').find(l => /AssertionError/.test(l)));
  assert.equal(/MIGRATE SOURCE PASS/.test(String(r.stdout)), false, 'it never reaches its own success line');
  /* AND IT IS NOT MIGRATE.CJS THAT MOVED HERE. The file stands at the parent's
     post and is byte-identical to the frozen BASE blob. */
  const M = 'rebuild/engine/migrate.cjs';
  assert.equal(diskSha(M), parentWant(M), 'migrate.cjs stands at the parent post');
  assert.equal(disk(M), blob(NC.BASE, M), 'and is byte-identical to the carrier\'s own frozen BASE blob');
  assert.equal(SPEC.product[M].pre, SPEC.product[M].post, 'and this package declares it carried');
  const src = disk(GATE);
  assert(src.includes('7347ca976b1131cc44adc6a562c2a795c9e78d0b'), 'the gate pins a frozen prior commit');
  assert(src.includes('"dates", "constants", "seed", "plan", "progression", "sleep", "energy", "policy", "today", "volume", "oracle-shim"'),
    'and names the prior modules it re-reads, today.cjs among them');
  for (const f of ['rebuild/engine/today.cjs', 'rebuild/engine/constants.cjs'])
    assert.notEqual(disk(f), blob('7347ca976b1131cc44adc6a562c2a795c9e78d0b', f),
      'a prior module the gate pins has stood apart from that commit since before this package: ' + f);
});

test('S14/SUP-4 - source-carriers: the pinned list cannot be extended, and the parent\'s own retirement is on the record', () => {
  const src = disk('rebuild/m4/spec/native-carriers-source.cjs');
  assert(/const BASE='[0-9a-f]{40}'/.test(src), 'the carrier reads a frozen BASE');
  assert(src.includes("const CHANGES_FILE='rebuild/m4/spec/native-carriers-changes.json'"), 'and a literal carrier list');
  assert(/const CHANGES_SHA='[0-9a-f]{64}'/.test(src), 'whose bytes it PINS');
  const listRaw = fs.readFileSync(path.join(REPO, NC.CHANGES_FILE));
  assert.equal(JSON.parse(listRaw).length, 48, 'the parent list is 48 carriers');
  assert.equal(sha(listRaw), NC.CHANGES_SHA, 'the list on disk IS the pinned list, so extending it moves a sha no substitution may re-target');
  for (const f of [NC.CHANGES_FILE, 'rebuild/m4/spec/native-carriers-source.cjs'])
    assert.equal(Object.hasOwn(SPEC.product, f), false, 'this package declares no product pin over ' + f);
  /* The parent's own retirement of these three gates, from the parent artifact. */
  assert.deepEqual(PARENT.coverage.supersededByCarrier['source-carriers'],
    ['merge-source', 'migrate-source', 'writers-source'], 'the parent retired exactly these three under this carrier');
  assert.deepEqual(PARENT.coverage.byChild, {}, 'and covered no gate by a carrier of its own');
  /* THE PARENT IS S11. S11 did not COVER these gates - it RETIRED them under :873 - and
     b-package.cjs's parentCarrierGates reads a parent's gate map from BOTH halves, so a
     carrier the parent retired is one this child may retire AGAIN under its own token
     line. It inherits the gate list and nothing else. */
  assert.equal(PARENT.packageId, 'M2-S11-NATIVE-LOAD', 'the bound parent is S11');
  assert.deepEqual(Object.keys(PARENT.coverage.supersededByCarrier).sort(),
    ['defect-witnesses', 'inherited-carriers', 'second-gate', 'source-carriers', 'writers-differential'],
    'and it retired all five byte-identity carriers, over nine gates, which is the list this package retires again');
  assert.equal(PARENT.coverage.superseded.length, 9, 'nine gates, counted on the parent artifact itself');
  /* THE CITATION. Before the PM writes this package's own GATE-SUPERSESSION line the
     field is null BY DESIGN, and the RUNNER - not this cell - is what refuses:
     supersessionRuling() throws GATE-SUPERSESSION-RULING-NOT-CITED before one byte of
     evidence is read. */
  const ruling = SPEC.coverage.superseded.rulingLineSha256;
  assert(ruling === null || /^[a-f0-9]{64}$/.test(ruling),
    'the ruling citation is either not yet written by the PM (null, and the runner refuses ' +
    'GATE-SUPERSESSION-RULING-NOT-CITED) or a sha256 of exactly 64 hex digits: ' + JSON.stringify(ruling));
});
