'use strict';
/* =====================================================================
   M2-S19-LIVE SUPERSEDES THE NATIVE-CARRIERS CARRIER `source-carriers`
   (gates migrate-source, merge-source, writers-source)

   Child 30 of S19, replacing s14-supersede-source-carriers.test.cjs there exactly as S14 replaced its parent's: that
   child reads S14.json and holds native-load.cjs as the ONLY engine byte that may move, so it cannot stand once this
   package moves rebuild/engine/energy.cjs under the owner's rulings DECISIONS:982 and :999 (E2b, the lean-mass stand-in;
   ported from E1's own child, b99c5e6) (calorieTarget skips a calorie floor
   that is not a finite number) and the token clause GATE-SUPERSESSION M2-S19-LIVE recorded at DECISIONS:989.

   WHAT THAT CARRIER PROVED, AND WHY S19 CANNOT CARRY IT, are S14's own words (s14-supersede-source-carriers.test.cjs):
   the carrier RECONSTRUCTS rebuild/engine from a frozen BASE plus the 48 literal carriers pinned by CHANGES_SHA, and
   the tree had already left that construction before S14 (five rebuilt files moved by S14's ancestors, native-load.cjs
   added outside the closed inventory by S11). S19 adds one more leaver of its own, energy.cjs, by its seventeen declared
   hunks (s19-energy-moves.cjs), and mends nothing.

   EVERY S14 ASSERTION IS KEPT, pointed at S19's own parent (S14), and S14's native-load proof is REPLAYED: native-load.cjs,
   carried here at the S14 post, is still the S11 post plus exactly S14's six declared hunks (s14-native-load-moves.cjs).
   SUP-1 says exactly which engine files move: energy.cjs against the S14 post by its own hunks, nothing else, nothing
   added; SUP-P shows that sentence has teeth with two RED plants (a third moving file; an undeclared line inside
   energy.cjs), built in memory over the real tree, nothing written.

   RED-FIRST, EXECUTED HERE, TWICE, as S14's: SUP-2 runs the carrier's own verifier and it refuses; SUP-3 runs the
   ORIGINAL gate programme migrate-source and it refuses. It reads every tracked engine file's bytes, the protected
   engine files among them, so it runs at the PM seat.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const readJson = f => JSON.parse(fs.readFileSync(path.join(REPO, f), 'utf8'));
const SPEC = readJson('rebuild/lanes/b/tooling/packages/S19.json');
const S14_SPEC = readJson('rebuild/lanes/b/tooling/packages/S14.json');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const OPTION = SPEC.parent.options.find(o => o.id === SPEC.parent.chosen);
const PARENT_RAW = fs.readFileSync(path.join(REPO, OPTION.artifact));
assert.equal(sha(PARENT_RAW), OPTION.sha256, 'the accepted parent artifact is the bytes this spec pins');
const PARENT = JSON.parse(PARENT_RAW);
const G_OPTION = S14_SPEC.parent.options.find(o => o.id === S14_SPEC.parent.chosen);
const GRAND_RAW = fs.readFileSync(path.join(REPO, G_OPTION.artifact));
assert.equal(sha(GRAND_RAW), G_OPTION.sha256, 'the parent\'s own accepted parent artifact is the bytes S14\'s spec pins');
const GRAND = JSON.parse(GRAND_RAW);
const NC = require('../../spec/native-carriers-source.cjs');
const { NL_MOVES } = require('./s14-native-load-moves.cjs');
const { ENERGY_MOVES } = require('./s19-energy-moves.cjs');
const git = a => cp.execFileSync('git', a, { cwd: REPO, maxBuffer: 9e7 });
const disk = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const blob = (rev, f) => git(['show', rev + ':' + f]).toString('utf8');
const blobSha = (rev, f) => sha(git(['show', rev + ':' + f]));
const ENGINE_ROOT = 'rebuild/engine/';
const NATIVE_LOAD = ENGINE_ROOT + 'native-load.cjs';
const ENERGY = ENGINE_ROOT + 'energy.cjs';
assert.deepEqual(Object.keys(ENERGY_MOVES), [ENERGY], 'this package\'s one declared move is energy.cjs');
assert.deepEqual(Object.keys(NL_MOVES), [NATIVE_LOAD], 'S14\'s one declared move is native-load.cjs');
const tracked = git(['ls-files', '-z', 'rebuild/engine']).toString('utf8').split('\0').filter(f => f.startsWith(ENGINE_ROOT));
/* What the parent's own artifact (S14) says this file must be: its declared post where it declares one, otherwise the
   blob at the parent's own sourceBase. */
const parentWant = f => {
  const pin = PARENT.product[f];
  return pin && pin.post !== null && pin.post !== undefined ? pin.post : blobSha(PARENT.sourceBase, f);
};
const ownMoved = f => Object.hasOwn(ENERGY_MOVES, f);
const addedHere = f => Object.hasOwn(SPEC.product, f) && SPEC.product[f].pre === null;
/* The tree, as a view: the real one reads disk; the plants below wrap it in memory. */
function realView() {
  const cache = new Map();
  const bytes = f => { if (!cache.has(f)) cache.set(f, fs.readFileSync(path.join(REPO, f))); return cache.get(f); };
  return { diskSha: f => sha(bytes(f)), diskText: f => bytes(f).toString('utf8') };
}
const REAL = realView();
/* This package's own move: the S14 post (Git at this package's sourceBase) plus exactly its declared hunks. */
function assertOwnMovesOnly(f, view = REAL) {
  const parentBytes = git(['show', SPEC.sourceBase + ':' + f]).toString('utf8');
  assert.equal(sha(Buffer.from(parentBytes, 'utf8')), parentWant(f), 'the parent bytes at this package\'s sourceBase are the parent\'s own post: ' + f);
  let body = parentBytes;
  ENERGY_MOVES[f].forEach(([before, after], i) => {
    assert.equal(body.split(before).length, 2, 'declared hunk ' + (i + 1) + ' has exactly one site, applied in order: ' + f);
    body = body.replace(before, () => after);
  });
  assert.equal(view.diskText(f), body, 'and the tree is the parent plus exactly its declared hunks, nothing else: ' + f);
  const p = SPEC.product[f];
  assert.equal(p.role, 'edited', 'this package declares it edited: ' + f);
  assert.equal(p.pre, parentWant(f), 'its declared pre-image is the parent post: ' + f);
  assert.equal(p.post, view.diskSha(f), 'and its declared post-image is the byte on disk: ' + f);
}
/* S14's own proof, replayed: native-load.cjs is the S11 post (Git at S14's sourceBase) plus exactly S14's declared
   hunks, S14 declared it so, and this package carries it at the S14 post. */
function assertS14NativeLoadProof(view = REAL) {
  const f = NATIVE_LOAD;
  const parentBytes = git(['show', S14_SPEC.sourceBase + ':' + f]).toString('utf8');
  const s14 = S14_SPEC.product[f];
  assert.equal(sha(Buffer.from(parentBytes, 'utf8')), s14.pre, 'the bytes at S14\'s sourceBase are S14\'s declared pre-image: ' + f);
  assert.equal(GRAND.product[f].post, s14.pre, 'which is S14\'s own parent\'s post: ' + f);
  let body = parentBytes;
  NL_MOVES[f].forEach(([before, after], i) => {
    assert.equal(body.split(before).length, 2, 'S14\'s declared hunk ' + (i + 1) + ' has exactly one site, applied in order: ' + f);
    body = body.replace(before, () => after);
  });
  assert.equal(view.diskText(f), body, 'and the tree is the S11 post plus exactly S14\'s declared hunks, nothing else: ' + f);
  assert.equal(s14.role, 'edited', 'S14 declared it edited: ' + f);
  assert.equal(s14.post, view.diskSha(f), 'S14\'s declared post-image is the byte on disk: ' + f);
  assert.equal(s14.post, parentWant(f), 'and it is the parent artifact\'s own pin: ' + f);
  const p = SPEC.product[f];
  assert.equal(p.role, 'carried', 'this package declares it carried: ' + f);
  assert.equal(p.pre, p.post, 'its pre-image IS its post-image: ' + f);
  assert.equal(p.post, view.diskSha(f), 'and that is the byte on disk: ' + f);
}
/* SUP-1's sentence, over a view. */
function engineMoves(view) {
  const named = tracked.filter(f => Object.hasOwn(SPEC.product, f));
  const outside = tracked.filter(f => !Object.hasOwn(SPEC.product, f));
  assert(named.length && outside.length, 'the brief names some engine files and leaves others');
  const moved = [], added = [];
  for (const f of tracked) {
    if (addedHere(f)) { added.push(f); continue; }
    if (view.diskSha(f) !== parentWant(f)) { moved.push(f); continue; }
    /* And the same bytes stand in Git at this package's own sourceBase, so the claim is not a reading of a dirty tree. */
    assert.equal(view.diskSha(f), blobSha(SPEC.sourceBase, f), 'disk equals the sourceBase blob: ' + f);
  }
  assert.deepEqual(moved.sort(), Object.keys(ENERGY_MOVES).sort(),
    'exactly energy.cjs moves from the parent post, and no other tracked rebuild/engine file');
  assert.deepEqual(added, [], 'and no rebuild/engine file is added');
  for (const f of moved) assertOwnMovesOnly(f, view);
  assertS14NativeLoadProof(view);
  for (const f of named) {
    if (ownMoved(f)) continue;
    const p = SPEC.product[f];
    assert.equal(p.role, 'carried', 'every other engine file this package names is declared carried: ' + f);
    assert.equal(p.pre, p.post, 'and its pre-image IS its post-image: ' + f);
    assert.equal(p.post, view.diskSha(f), 'and that is the byte on disk: ' + f);
    assert.equal(p.post, parentWant(f), 'and it is the parent artifact\'s own pin: ' + f);
  }
  return { named, outside, moved, added };
}

test('S19/SUP-1 - source-carriers: M2-S19 moves EXACTLY one rebuild/engine file, energy.cjs, by its declared hunks only, S14\'s native-load.cjs proof still holds, and nothing is added, over the whole tracked inventory', () => {
  assert.equal(PARENT.packageId, 'M2-S14-HOLD', 'the bound parent is S14');
  assert.equal(GRAND.packageId, 'M2-S11-NATIVE-LOAD', 'and its own parent is S11');
  assert(tracked.length >= 40, 'the real tracked inventory under ' + ENGINE_ROOT + ': ' + tracked.length);
  const r = engineMoves(REAL);
  console.log('  ENGINE MOVES ' + tracked.length + ' tracked file(s), ' + r.named.length + ' named, ' + r.outside.length +
    ' outside, ' + r.moved.length + ' moved, by its declared hunks only (DECISIONS:982, :999), ' + r.added.length +
    ' added; native-load.cjs is the S11 post plus S14\'s ' + NL_MOVES[NATIVE_LOAD].length + ' declared hunk(s)');
});

test('S19/SUP-P - source-carriers: RED PLANTS - a third moving engine file, and an undeclared line inside energy.cjs, are each refused by SUP-1\'s own sentence', () => {
  const third = tracked.find(f => f.endsWith('.cjs') && !ownMoved(f) && f !== NATIVE_LOAD && !addedHere(f) && Object.hasOwn(SPEC.product, f));
  assert(third, 'a named, carried engine module to plant');
  const flip = { diskSha: g => (g === third ? sha(Buffer.from('planted move of ' + g, 'utf8')) : REAL.diskSha(g)), diskText: REAL.diskText };
  assert.throws(() => engineMoves(flip), (e) => e instanceof assert.AssertionError &&
    e.message.startsWith('exactly energy.cjs moves from the parent post, and no other tracked rebuild/engine file'),
    'PLANT 1: a third moving file is refused: ' + third);
  const text = REAL.diskText(ENERGY);
  const anchor = ENERGY_MOVES[ENERGY][0][1];
  assert.equal(text.split(anchor).length, 2, 'the plant\'s anchor (hunk 1\'s after) has one site');
  const planted = text.replace(anchor, () => anchor + '  const undeclaredByThisPackage = 0;\n');
  const inside = { diskSha: g => (g === ENERGY ? sha(Buffer.from(planted, 'utf8')) : REAL.diskSha(g)),
    diskText: g => (g === ENERGY ? planted : REAL.diskText(g)) };
  assert.throws(() => engineMoves(inside), (e) => e instanceof assert.AssertionError &&
    e.message.startsWith('and the tree is the parent plus exactly its declared hunks, nothing else: ' + ENERGY),
    'PLANT 2: an undeclared line inside energy.cjs is refused');
  assert.doesNotThrow(() => engineMoves(REAL), 'and the real tree, unplanted, is not');
  console.log('  PLANTS RED 2 of 2: a third moving file (' + third + ') and an undeclared line inside energy.cjs');
});

test('S19/SUP-2 - source-carriers: RED-FIRST - the carrier\'s own verifier, EXECUTED here, refuses on this tree', () => {
  /* The construction itself is intact: the frozen BASE plus the 48 pinned carriers still builds what it always built.
     It is the tree that has left it: the closed inventory refuses first (S11's native-load.cjs), five rebuilt files had
     moved off it before S14, and energy.cjs leaves it here, by this package's declared hunks only. */
  const built = NC.construct(NC.baseline(REPO));
  assert(/^[a-f0-9]{40}$/.test(NC.BASE), 'the carrier reads a frozen BASE');
  assert.notEqual(NC.BASE, SPEC.sourceBase, 'and it is not this package\'s own base');
  assert.throws(() => NC.verify(REPO), /Closed engine file inventory/,
    'the carrier refuses at its closed engine inventory, before it compares a single rebuilt file');
  const closed = NC.ENGINE.map(f => path.basename(f)).sort();
  const onDisk = fs.readdirSync(path.join(REPO, ENGINE_ROOT)).filter(n => n.endsWith('.cjs')).sort();
  assert.deepEqual(closed.filter(n => !onDisk.includes(n)), [], 'no file of the closed inventory is missing from the tree');
  assert.deepEqual(onDisk.filter(n => !closed.includes(n)), ['native-load.cjs'],
    'and exactly one stands outside it: the native-load.cjs S14\'s parent added');
  assert.equal(GRAND.product[NATIVE_LOAD].role, 'new', 'which S14\'s PARENT declared new, so the wall predates both packages');
  assert.equal(PARENT.product[NATIVE_LOAD].role, 'edited', 'which the parent S14 declared edited');
  assert.equal(SPEC.product[NATIVE_LOAD].role, 'carried', 'and which this package declares carried');
  assert(NC.RETAINED.includes(ENERGY) && !Object.hasOwn(NC.CARRIED, ENERGY), 'energy.cjs is a RETAINED file of the construction, no carrier');
  /* Every divergence past the inventory, enumerated rather than summarised. */
  const diverged = [];
  for (const f of Object.keys(built)) if (f.startsWith(ENGINE_ROOT) && disk(f) !== built[f]) diverged.push(f);
  for (const f of NC.RETAINED) if (!Object.hasOwn(built, f) && disk(f) !== blob(NC.BASE, f)) diverged.push(f);
  assert.deepEqual(diverged.sort(), ['rebuild/engine/constants.cjs', ENERGY, 'rebuild/engine/merge.cjs',
    'rebuild/engine/progression.cjs', 'rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs'],
    'exactly six engine files stand outside the reconstruction, and they are named here');
  /* Five had ALREADY left it at the parent, measured on the parent's own post; energy.cjs had not, and leaves it here. */
  const leftAtParent = diverged.filter(f => Object.hasOwn(built, f)
    ? parentWant(f) !== sha(Buffer.from(built[f], 'utf8')) : parentWant(f) !== blobSha(NC.BASE, f));
  assert.deepEqual(leftAtParent, diverged.filter(f => f !== ENERGY),
    'five had already left the reconstruction at the parent, so that refusal predates this package entirely');
  assert.equal(parentWant(ENERGY), blobSha(NC.BASE, ENERGY), 'and energy.cjs stood ON it at the parent: this package moves it off');
  for (const f of diverged) {
    if (f === ENERGY) continue;
    assert.equal(ownMoved(f), false, 'this package moves none of them: ' + f);
    assert.equal(REAL.diskSha(f), parentWant(f), 'and each of them stands at the PARENT\'s own post: ' + f);
    assert.equal(SPEC.product[f].pre, SPEC.product[f].post, 'and this package declares it carried, pre === post: ' + f);
    console.log('  RECONSTRUCTION REFUSES ' + f + ' disk ' + REAL.diskSha(f).slice(0, 12) + ' inherited unmoved from the parent');
  }
  assertOwnMovesOnly(ENERGY);
  console.log('  RECONSTRUCTION REFUSES ' + ENERGY + ', moved here by ' + ENERGY_MOVES[ENERGY].length + ' declared hunk(s) (DECISIONS:982, :999)');
  assertS14NativeLoadProof();
  console.log('  RECONSTRUCTION REFUSES the closed inventory at native-load.cjs, added by S11, moved by S14 by ' + NL_MOVES[NATIVE_LOAD].length + ' declared hunk(s), carried here');
});

test('S19/SUP-3 - source-carriers: RED-FIRST - the ORIGINAL gate migrate-source, EXECUTED, refuses at its first declaration', () => {
  const GATE = 'rebuild/engine/test/migrate-source.cjs';
  const r = cp.spawnSync(process.execPath, [GATE], { cwd: REPO, encoding: 'utf8', maxBuffer: 9e7 });
  assert.notEqual(r.status, 0, 'the gate programme refuses on this tree');
  assert(/exact declaration migrate/.test(String(r.stderr)), 'and it refuses at the migrate declaration: ' +
    String(r.stderr).split('\n').find(l => /AssertionError/.test(l)));
  assert.equal(/MIGRATE SOURCE PASS/.test(String(r.stdout)), false, 'it never reaches its own success line');
  /* AND IT IS NOT MIGRATE.CJS THAT MOVED HERE. The file stands at the parent's post and is byte-identical to the
     frozen BASE blob. */
  const M = 'rebuild/engine/migrate.cjs';
  assert.equal(REAL.diskSha(M), parentWant(M), 'migrate.cjs stands at the parent post');
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

test('S19/SUP-4 - source-carriers: the pinned list cannot be extended, and the parent\'s own retirement is on the record', () => {
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
  /* THE PARENT IS S14. S14 RETIRED these gates under its own token line, and b-package.cjs's parentCarrierGates reads a
     parent's gate map from BOTH halves, so a carrier the parent retired is one this child may retire AGAIN under its
     own token line (DECISIONS:989). It inherits the gate list and nothing else. */
  assert.equal(PARENT.packageId, 'M2-S14-HOLD', 'the bound parent is S14');
  assert.deepEqual(Object.keys(PARENT.coverage.supersededByCarrier).sort(),
    ['defect-witnesses', 'inherited-carriers', 'second-gate', 'source-carriers', 'writers-differential'],
    'and it retired all five byte-identity carriers, over nine gates, which is the list this package retires again');
  assert.equal(PARENT.coverage.superseded.length, 9, 'nine gates, counted on the parent artifact itself');
  /* THE CITATION. Before the PM writes this package's own GATE-SUPERSESSION line into the spec the field is null BY
     DESIGN, and the RUNNER - not this cell - is what refuses: supersessionRuling() throws
     GATE-SUPERSESSION-RULING-NOT-CITED before one byte of evidence is read. */
  assert(SPEC.coverage.superseded && typeof SPEC.coverage.superseded === 'object', 'this package declares its own supersession block');
  const ruling = SPEC.coverage.superseded.rulingLineSha256;
  assert(ruling === null || /^[a-f0-9]{64}$/.test(ruling),
    'the ruling citation is either not yet written by the PM (null, and the runner refuses ' +
    'GATE-SUPERSESSION-RULING-NOT-CITED) or a sha256 of exactly 64 hex digits: ' + JSON.stringify(ruling));
});
