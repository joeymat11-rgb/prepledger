'use strict';
/* =====================================================================
   M2-S19-LIVE SUPERSEDES THE NATIVE-CARRIERS CARRIER `inherited-carriers`
   (gates witnesses-2, witnesses-5, migrate-differential)

   Child 31 of S19, replacing s14-supersede-inherited-carriers.test.cjs there exactly as S14 replaced its parent's:
   that child reads S14.json and holds every prior engine module but native-load.cjs at S11's post, so it cannot stand
   once this package moves rebuild/engine/energy.cjs under the owner's ruling DECISIONS:982 and the token clause
   GATE-SUPERSESSION M2-S19-LIVE recorded at DECISIONS:989.

   WHAT THAT CARRIER PROVED, AND WHY S19 CANNOT CARRY IT, are S14's own words: priorModule re-reads every prior engine
   module against the same sha-pinned list, and today.cjs, writers.cjs and progression.cjs had left that list before
   S14. energy.cjs, which S19 moves by its seven declared hunks (s19-energy-moves.cjs), is no carried module of that
   list at all (a RETAINED file), so SUP-5's refusal is exactly S14's.

   EVERY S14 ASSERTION IS KEPT, pointed at S19's own parent (S14):
   (a) every other prior engine module on this tree is byte-identical to the PARENT'S OWN POST, energy.cjs is the
   parent's bytes plus exactly its declared hunks, and native-load.cjs is still the S11 post plus exactly S14's six
   declared hunks (S14's proof, replayed), and the instrument is shown to detect a single moved byte (SUP-6), and to
   refuse a third moving file and an undeclared line inside energy.cjs (SUP-P, two RED plants, in memory);
   (b) the capabilities the declared files carry are still THERE and still reached (SUP-7).
   It reads every tracked engine file's bytes and composes the engine, the protected files among them, so it runs at
   the PM seat.
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
const NATIVE_LOAD = 'rebuild/engine/native-load.cjs';
const ENERGY = 'rebuild/engine/energy.cjs';
assert.deepEqual(Object.keys(ENERGY_MOVES), [ENERGY], 'this package\'s one declared move is energy.cjs');
assert.deepEqual(Object.keys(NL_MOVES), [NATIVE_LOAD], 'S14\'s one declared move is native-load.cjs');
const tracked = git(['ls-files', '-z', 'rebuild/engine']).toString('utf8').split('\0').filter(f => f.startsWith('rebuild/engine/'));
const parentWant = f => {
  const pin = PARENT.product[f];
  return pin && pin.post !== null && pin.post !== undefined ? pin.post : blobSha(PARENT.sourceBase, f);
};
const ownMoved = f => Object.hasOwn(ENERGY_MOVES, f);
const addedHere = f => Object.hasOwn(SPEC.product, f) && SPEC.product[f].pre === null;
function realView() {
  const cache = new Map();
  const bytes = f => { if (!cache.has(f)) cache.set(f, fs.readFileSync(path.join(REPO, f))); return cache.get(f); };
  return { diskSha: f => sha(bytes(f)), diskText: f => bytes(f).toString('utf8') };
}
const REAL = realView();
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
/* SUP-6's sentence, over a view. */
function parentPostIdentity(view) {
  const rows = [];
  let movedHere = 0;
  for (const f of tracked) {
    rows.push(f);
    assert.equal(addedHere(f), false, 'this package adds no engine file: ' + f);
    if (ownMoved(f)) { assertOwnMovesOnly(f, view); movedHere++; continue; }
    const want = parentWant(f), got = view.diskSha(f);
    assert.equal(got, want, 'engine file moved from the parent post: ' + f);
  }
  assertS14NativeLoadProof(view);
  assert.equal(rows.length, tracked.length, 'the whole tracked inventory, not a sample: ' + rows.length);
  assert(rows.length >= 40, 'and it is the real one');
  assert.equal(movedHere, 1, 'exactly one file moved, by its declared hunks');
  return { rows, movedHere };
}

test('S19/SUP-5 - inherited-carriers: RED-FIRST - priorModule\'s own rule, re-executed over the real carried modules', () => {
  const carriers = NC.changes();
  const byModule = new Map();
  for (const c of carriers) if (c.file.startsWith('rebuild/engine/')) byModule.set(c.file, [...(byModule.get(c.file) || []), c]);
  const held = [], refused = [];
  for (const [f, pin] of Object.entries(NC.CARRIED)) {
    if (!f.startsWith('rebuild/engine/')) continue;
    const original = blob(NC.BASE, f);
    assert.equal(sha(Buffer.from(original, 'utf8')), pin.before, 'frozen prior module is the declared carrier preimage: ' + f);
    let body = original;
    for (const c of byModule.get(f) || []) {
      assert.equal(body.split(c.before).length, 2, 'unique exact source site: ' + c.id);
      body = body.replace(c.before, () => c.after);
    }
    assert.equal(sha(Buffer.from(body, 'utf8')), pin.after, 'declared carrier postimage: ' + f);
    (disk(f) === body ? held : refused).push(f);
  }
  assert.deepEqual(held.sort(), ['rebuild/engine/index.cjs', 'rebuild/engine/plan.cjs',
    'rebuild/engine/sleep.cjs'], 'three carried modules still ARE the declared carriers');
  assert.deepEqual(refused.sort(), ['rebuild/engine/progression.cjs', 'rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs'],
    'and three are not, so priorModule refuses this tree before any witness is taken');
  /* progression.cjs was taken off its declared carrier by S11 (FG02): the refusal predates this package in every one. */
  assert.notEqual(parentWant('rebuild/engine/progression.cjs'), NC.CARRIED['rebuild/engine/progression.cjs'].after,
    'progression.cjs had already left its declared carrier at the parent');
  assert.equal(Object.hasOwn(NC.CARRIED, NATIVE_LOAD), false, 'native-load.cjs is no carried module at all');
  assert.equal(Object.hasOwn(NC.CARRIED, ENERGY), false, 'and nor is energy.cjs, the one file this package moves');
  const src = disk('rebuild/m4/spec/native-carriers-source-carriers.cjs');
  assert(src.includes("'migrate-source':['plan(1)','progression(28)','sleep(4)','today(9)']"),
    'the carrier pins the carried modules each gate re-reads, in order, with their counts');
  assert.equal((byModule.get('rebuild/engine/today.cjs') || []).length, 9, 'today.cjs really carries nine declared carriers');
  for (const f of refused) {
    assert.equal(ownMoved(f), false, 'this package moves none of the refused modules: ' + f);
    assert.equal(REAL.diskSha(f), parentWant(f), 'the refused file stands at the parent\'s own post, inherited unmoved: ' + f);
    assert.equal(SPEC.product[f].pre, SPEC.product[f].post, 'and this package declares it carried, pre === post: ' + f);
    console.log('  PRIORMODULE REFUSES ' + f + ' declared post ' + NC.CARRIED[f].after.slice(0, 12) + ', tree ' + REAL.diskSha(f).slice(0, 12));
  }
});

test('S19/SUP-6 - inherited-carriers: every other prior engine module is byte-identical to the PARENT\'S OWN POST, energy.cjs is it plus its declared hunks, native-load.cjs is S14\'s proof, and the instrument has teeth', () => {
  assert.equal(PARENT.packageId, 'M2-S14-HOLD', 'the bound parent is S14');
  const { rows, movedHere } = parentPostIdentity(REAL);
  /* MUTATION CONTROL. "Everything is identical" is worth nothing unless the comparison can tell when it is not, so it
     is shown failing on one byte. */
  const probe = 'rebuild/engine/index.cjs';
  const mutant = Buffer.from(disk(probe).replace('require("./seed.cjs")', 'require("./seed.cjs") /* mutant */'), 'utf8');
  assert.notEqual(sha(mutant), parentWant(probe), 'RED CONTROL: a single inserted comment is detected by the same comparison');
  assert.equal(REAL.diskSha(probe), parentWant(probe), 'and the real bytes still stand at the parent post');
  console.log('  PARENT POST IDENTITY ' + rows.length + ' tracked rebuild/engine file(s), ' + movedHere + ' moved by its declared hunks (DECISIONS:982), native-load.cjs S14\'s proof, 1 mutation control detected');
});

test('S19/SUP-P - inherited-carriers: RED PLANTS - a third moving engine file, and an undeclared line inside energy.cjs, are each refused by SUP-6\'s own sentence', () => {
  const third = tracked.find(f => f.endsWith('.cjs') && !ownMoved(f) && f !== NATIVE_LOAD);
  assert(third, 'an engine module to plant');
  const flip = { diskSha: g => (g === third ? sha(Buffer.from('planted move of ' + g, 'utf8')) : REAL.diskSha(g)), diskText: REAL.diskText };
  assert.throws(() => parentPostIdentity(flip), (e) => e instanceof assert.AssertionError &&
    e.message.startsWith('engine file moved from the parent post: ' + third), 'PLANT 1: a third moving file is refused: ' + third);
  const text = REAL.diskText(ENERGY);
  const anchor = ENERGY_MOVES[ENERGY][0][1];
  assert.equal(text.split(anchor).length, 2, 'the plant\'s anchor (hunk 1\'s after) has one site');
  const planted = text.replace(anchor, () => anchor + '  const undeclaredByThisPackage = 0;\n');
  const inside = { diskSha: g => (g === ENERGY ? sha(Buffer.from(planted, 'utf8')) : REAL.diskSha(g)),
    diskText: g => (g === ENERGY ? planted : REAL.diskText(g)) };
  assert.throws(() => parentPostIdentity(inside), (e) => e instanceof assert.AssertionError &&
    e.message.startsWith('and the tree is the parent plus exactly its declared hunks, nothing else: ' + ENERGY),
    'PLANT 2: an undeclared line inside energy.cjs is refused');
  assert.doesNotThrow(() => parentPostIdentity(REAL), 'and the real tree, unplanted, is not');
  console.log('  PLANTS RED 2 of 2: a third moving file (' + third + ') and an undeclared line inside energy.cjs');
});

test('S19/SUP-7 - inherited-carriers: the inherited capabilities are still THERE and still reached, executed', () => {
  const DAY = '2026-09-07';
  const clock = { today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'),
    stamp: () => DAY + 'T13:00:00.000Z', nowISO: () => DAY + 'T13:00:00.000Z', nowMs: () => Date.parse(DAY + 'T13:00:00.000Z') };
  const { createEngine } = require('../../../engine/index.cjs');
  const E = createEngine({ clock });
  const built = NC.construct(NC.baseline(REPO))['rebuild/engine/today.cjs'];
  assert.equal(built.includes('sessionMembership'), false, 'RED: the reconstruction\'s today.cjs has no membership reader');
  assert(disk('rebuild/engine/today.cjs').includes('function sessionMembership(s, iso)'), 'the tree\'s does');
  assert.equal(typeof E.sessionMembership, 'function', 'and the composition exposes it');
  const state = JSON.parse(JSON.stringify(E.SEED));
  const m = E.sessionMembership(state, DAY);
  const g = E.genSession(JSON.parse(JSON.stringify(state)), DAY, E.sleepInfo(state));
  if (m === null) assert.equal(g, null, 'a rest day on both readers');
  else assert.deepEqual(m.exercise_ids.slice(), g.ex.map(c => c.id), 'the reader names exactly genSession\'s own pool');
  const reached = [];
  function P(ms) { reached.push('construct'); return new Date(ms); }
  P.parse = v => { reached.push('parse:' + v); return Date.parse(v); };
  const M = require('../../../engine/merge.cjs')(E, { clock, ids: undefined,
    drafts: Object.freeze({ length: 0, key: () => null }), nativeDate: P });
  const stamp = '2026-03-08T02:30:00';
  M._corrOf({ corr: { at: stamp, rev: 2 } });
  M._adjInstant({ at: stamp });
  assert(reached.includes('parse:' + stamp), 'the seam is reached: ' + reached.join(' | '));
  assert.equal(blob(NC.BASE, 'rebuild/engine/merge.cjs').includes('nativeDate'), false,
    'RED: the merge.cjs the reconstruction asserts - the frozen BASE blob, verbatim - knows no seam at all');
});
