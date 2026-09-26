'use strict';
/* =====================================================================
   M2-S11 SUPERSEDES THE NATIVE-CARRIERS CARRIER `source-carriers`
   (gates migrate-source, merge-source, writers-source)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. Not that the engine was
   pinned but that it was RECONSTRUCTED: `native-carriers-source.cjs` reads
   every carried engine file from a frozen `BASE` with `git show`, applies the
   48 literal carriers of `native-carriers-changes.json` (whose bytes are
   pinned by `CHANGES_SHA` at native-carriers-source.cjs:37), asserts the
   constructed sha equals the declared post-image, and then asserts the file
   ON DISK is byte-identical to the construction. Every other `rebuild/engine`
   file is asserted equal to `git show BASE:` outright. The three original gate
   programmes do the same from the frozen `fe516c1:src/app.jsx` declarations.

   WHY S11 CANNOT CARRY IT, AND WHY S10'S REASON CANNOT BE REUSED. M2-S11
   moves rebuild/engine bytes, and not the ones S10 moved: it ADDS
   native-load.cjs and edits writers.cjs (FG01) and progression.cjs (FG02),
   each asserted below as the parent's post plus exactly its declared hunks,
   and every other tracked file stands at the parent's own post; SUP-1 asserts
   all of it over the whole inventory. The reconstruction was already false at
   the parent, because S11's ANCESTORS moved four of the files it rebuilds:
   constants.cjs and writers.cjs (M2-H3-CLEAN-INIT), merge.cjs and today.cjs
   (M2-S3-COMPANION), today.cjs and writers.cjs again by one clause each
   (M2-S10-TODAY-SPLIT, DECISIONS:631 O-1a), and migrate.cjs has stood apart
   from the frozen src/app.jsx declaration since long before B-NTC. The PARENT,
   M2-S10-TODAY-SPLIT, retired these same gates under its own token line
   DECISIONS:829 for exactly that reason. S11 mends none of it and adds two
   walls of its own, both measured in SUP-2: its new native-load.cjs stands
   outside the carrier's CLOSED engine inventory, which is now the first thing
   verify() refuses, and FG02 moves progression.cjs, which stood exactly at
   the construction's post-image until this package. S11 can neither reproduce
   the construction nor re-target the sha-pinned list, whose bytes CHANGES_SHA
   pins, and it declares no product pin over either native-carriers file (SUP-4).

   THIS IS THE NINTH GENERATION, AND THE POINT IS THAT NOTHING DECAYS. S3
   was the child, S4 the grandchild, S5 the great-grandchild, S6 the fourth,
   S7 the fifth, S8 the sixth, S9 the seventh, S10 the eighth and S11 the
   ninth in the line; each retires the nine AGAIN under its OWN token line and
   its OWN executed evidence, inheriting from its parent's retirement nothing
   but the gate list (b-package.cjs parentCarrierGates). DECISIONS:153 is the
   standing role; :422 note 3 named this compounding effect before it was
   measured; :443 measured it as the first of the nineteen gates refusing;
   :829 is the PARENT's token line and this package's own is the one the PM
   writes when this brief is accepted.

   RED-FIRST, EXECUTED HERE, TWICE: SUP-2 runs the carrier's own verifier and
   it refuses; SUP-3 runs the ORIGINAL gate programme migrate-source and it
   refuses. Four of SUP-2's five files had left the reconstruction before this
   package; SUP-3's is not moved by it at all.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S11.json'), 'utf8'));
const OPTION = SPEC.parent.options.find(o => o.id === SPEC.parent.chosen);
const PARENT_RAW = fs.readFileSync(path.join(REPO, OPTION.artifact));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
assert.equal(sha(PARENT_RAW), OPTION.sha256, 'the accepted parent artifact is the bytes this spec pins');
const PARENT = JSON.parse(PARENT_RAW);
const NC = require('../../spec/native-carriers-source.cjs');
const git = a => cp.execFileSync('git', a, { cwd: REPO, maxBuffer: 9e7 });
const disk = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const diskSha = f => sha(fs.readFileSync(path.join(REPO, f)));
const blob = (rev, f) => git(['show', rev + ':' + f]).toString('utf8');
const blobSha = (rev, f) => sha(git(['show', rev + ':' + f]));
const ENGINE_ROOT = 'rebuild/engine/';
const tracked = git(['ls-files', '-z', 'rebuild/engine']).toString('utf8').split('\0').filter(f => f.startsWith(ENGINE_ROOT));
/* What the parent's own artifact says this file must be: its declared post
   where it declares one, otherwise the blob at the parent's own sourceBase. */
const parentWant = f => {
  const pin = PARENT.product[f];
  return pin && pin.post !== null && pin.post !== undefined ? pin.post : blobSha(PARENT.sourceBase, f);
};
/* WHAT S11 DOES MOVE UNDER rebuild/engine/, AND IT IS WHY S10'S REASON CANNOT BE CARRIED.
   S10 retired these gates because it moved two files, today.cjs and writers.cjs, by one
   owner-worded clause each (DECISIONS:631 O-1a). M2-S11 moves the NATIVE-LOAD engine part
   instead, under the owner grants its brief's THEME names (DECISIONS:784-785 (a), :796 (c),
   :803 (e), :804 (f)): it ADDS rebuild/engine/native-load.cjs, and it edits two files it
   inherits at the parent's own post. writers.cjs by FG01 (NATIVE-LOAD-SPEC R7 section C,
   engine item 2): the honest-opener governor of completeSession, moved into
   updateOpenerHold, called once at the original site and exported so native-load.cjs can
   replay it - three hunks, and the moved lines are ONE declared string (FG01_GOVERNOR),
   removed from the call site and placed in the function unchanged. progression.cjs by FG02
   (DECISIONS:804 (f)): the native-row reader _prescribedLoads reads a set past the listed
   per-set weights as the repeated last listed weight - one hunk. today.cjs, which S10
   moved, is carried here at the parent's post, and S10's one writers.cjs clause stands in
   the parent bytes these hunks apply to. Each edited file is asserted here as the PARENT'S
   OWN BYTES (read from Git at this package's sourceBase and tied to the parent artifact's
   post) PLUS EXACTLY ITS DECLARED HUNKS, applied in order, each at exactly one site, AND
   NOTHING ELSE, and as declared "edited" with pre = the parent post and post = the byte on
   disk. Files this package ADDS under rebuild/engine/ carry pre null and have no parent
   image at all. */
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

test('S11/SUP-1 - source-carriers: M2-S11 moves EXACTLY two rebuild/engine files, each by its declared hunks only, and adds exactly one, over the whole tracked inventory', () => {
  assert(tracked.length >= 40, 'the real tracked inventory under ' + ENGINE_ROOT + ': ' + tracked.length);
  const named = tracked.filter(f => Object.hasOwn(SPEC.product, f));
  const outside = tracked.filter(f => !Object.hasOwn(SPEC.product, f));
  assert(named.length && outside.length, 'the brief names some engine files and leaves others');
  const moved = [], added = [];
  for (const f of tracked) {
    if (addedHere(f)) {
      assert.equal(SPEC.product[f].role, 'new', 'an engine file this package adds is declared new: ' + f);
      assert.equal(SPEC.product[f].post, diskSha(f), 'and stands at its declared post: ' + f);
      added.push(f); continue;
    }
    if (diskSha(f) !== parentWant(f)) { moved.push(f); continue; }
    /* And the same bytes stand in Git at this package's own sourceBase, so the
       claim is not a reading of a dirty tree. */
    assert.equal(diskSha(f), blobSha(SPEC.sourceBase, f), 'disk equals the sourceBase blob: ' + f);
  }
  assert.deepEqual(moved.sort(), Object.keys(NL_MOVES).sort(),
    'exactly the two NATIVE-LOAD files move from the parent post, and no other tracked rebuild/engine file');
  assert.deepEqual(added.sort(), ['rebuild/engine/native-load.cjs'],
    'and exactly one tracked rebuild/engine file is added, declared new: native-load.cjs');
  for (const f of moved) assertNlMovesOnly(f);
  for (const f of named) {
    if (nlMoved(f) || addedHere(f)) continue;
    const p = SPEC.product[f];
    assert.equal(p.role, 'carried', 'every other engine file this package names is declared carried: ' + f);
    assert.equal(p.pre, p.post, 'and its pre-image IS its post-image: ' + f);
    assert.equal(p.post, diskSha(f), 'and that is the byte on disk: ' + f);
    assert.equal(p.post, parentWant(f), 'and it is the parent artifact\'s own pin: ' + f);
  }
  console.log('  ENGINE MOVES ' + tracked.length + ' tracked file(s), ' + named.length + ' named, ' + outside.length +
    ' outside, ' + moved.length + ' moved, each by its declared hunks only, ' + added.length + ' added, declared new');
});

test('S11/SUP-2 - source-carriers: RED-FIRST - the carrier\'s own verifier, EXECUTED here, refuses on this tree', () => {
  /* The construction itself is intact: the frozen BASE plus the 48 pinned
     carriers still builds what it always built. It is the tree that has left
     it. At the parent it had already left it at four files; S11 adds two walls
     of its own and mends none: the file it adds stands outside the carrier's
     CLOSED inventory, which verify() now refuses first, and FG02 moves a file
     that stood exactly at the construction's post-image until this package. */
  const built = NC.construct(NC.baseline(REPO));
  assert(/^[a-f0-9]{40}$/.test(NC.BASE), 'the carrier reads a frozen BASE');
  assert.notEqual(NC.BASE, SPEC.sourceBase, 'and it is not this package\'s own base');
  assert.throws(() => NC.verify(REPO), /Closed engine file inventory/,
    'the carrier refuses at its closed engine inventory, before it compares a single rebuilt file');
  const closed = NC.ENGINE.map(f => path.basename(f)).sort();
  const onDisk = fs.readdirSync(path.join(REPO, ENGINE_ROOT)).filter(n => n.endsWith('.cjs')).sort();
  assert.deepEqual(closed.filter(n => !onDisk.includes(n)), [], 'no file of the closed inventory is missing from the tree');
  assert.deepEqual(onDisk.filter(n => !closed.includes(n)), ['native-load.cjs'],
    'and exactly one stands outside it: the native-load.cjs this package adds');
  assert.equal(SPEC.product[ENGINE_ROOT + 'native-load.cjs'].role, 'new', 'which this package declares new');
  /* Every divergence past the inventory, enumerated rather than summarised. */
  const diverged = [];
  for (const f of Object.keys(built)) if (f.startsWith(ENGINE_ROOT) && disk(f) !== built[f]) diverged.push(f);
  for (const f of NC.RETAINED) if (!Object.hasOwn(built, f) && disk(f) !== blob(NC.BASE, f)) diverged.push(f);
  assert.deepEqual(diverged.sort(), ['rebuild/engine/constants.cjs', 'rebuild/engine/merge.cjs',
    'rebuild/engine/progression.cjs', 'rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs'],
    'exactly five engine files stand outside the reconstruction, and they are named here');
  /* Which of the five had ALREADY left it at the parent, measured on the parent's own
     post, and which one this package is the first to move off it. */
  const leftAtParent = diverged.filter(f => Object.hasOwn(built, f)
    ? parentWant(f) !== sha(Buffer.from(built[f], 'utf8')) : parentWant(f) !== blobSha(NC.BASE, f));
  assert.deepEqual(leftAtParent, ['rebuild/engine/constants.cjs', 'rebuild/engine/merge.cjs',
    'rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs'],
    'four had already left the reconstruction at the parent, so the refusal predates this package');
  assert.equal(parentWant('rebuild/engine/progression.cjs'), NC.CARRIED['rebuild/engine/progression.cjs'].after,
    'and progression.cjs stood AT the construction\'s post-image at the parent: FG02 is what moves it off');
  for (const f of diverged) {
    if (nlMoved(f)) {
      assertNlMovesOnly(f);
      console.log('  RECONSTRUCTION REFUSES ' + f + ' disk ' + diskSha(f).slice(0, 12) + ' = the parent post plus ' +
        NL_MOVES[f].length + ' declared hunk(s)' + (leftAtParent.includes(f) ? '' : ', first moved off the construction here'));
      continue;
    }
    assert.equal(diskSha(f), parentWant(f), 'and each of them stands at the PARENT\'s own post: ' + f);
    assert.equal(SPEC.product[f].pre, SPEC.product[f].post, 'and this package declares it carried, pre === post: ' + f);
    console.log('  RECONSTRUCTION REFUSES ' + f + ' disk ' + diskSha(f).slice(0, 12) + ' inherited unmoved from the parent');
  }
  console.log('  RECONSTRUCTION REFUSES the closed inventory at native-load.cjs, added here and declared new');
});

test('S11/SUP-3 - source-carriers: RED-FIRST - the ORIGINAL gate migrate-source, EXECUTED, refuses at its first declaration', () => {
  const GATE = 'rebuild/engine/test/migrate-source.cjs';
  const r = cp.spawnSync(process.execPath, [GATE], { cwd: REPO, encoding: 'utf8', maxBuffer: 9e7 });
  assert.notEqual(r.status, 0, 'the gate programme refuses on this tree');
  assert(/exact declaration migrate/.test(String(r.stderr)), 'and it refuses at the migrate declaration: ' +
    String(r.stderr).split('\n').find(l => /AssertionError/.test(l)));
  assert.equal(/MIGRATE SOURCE PASS/.test(String(r.stdout)), false, 'it never reaches its own success line');
  /* AND IT IS NOT MIGRATE.CJS THAT MOVED HERE. The file stands at the parent's
     post and is byte-identical to the frozen BASE blob; the divergence is
     between the frozen `fe516c1:src/app.jsx` declaration and an engine byte
     settled long before this package's base. */
  const M = 'rebuild/engine/migrate.cjs';
  assert.equal(diskSha(M), parentWant(M), 'migrate.cjs stands at the parent post');
  assert.equal(disk(M), blob(NC.BASE, M), 'and is byte-identical to the carrier\'s own frozen BASE blob');
  assert.equal(SPEC.product[M].pre, SPEC.product[M].post, 'and this package declares it carried');
  /* The gate's SECOND wall, quoted from its own bytes: it re-reads eleven prior
     modules against a frozen commit, and today.cjs is one of them. */
  const src = disk(GATE);
  assert(src.includes('7347ca976b1131cc44adc6a562c2a795c9e78d0b'), 'the gate pins a frozen prior commit');
  assert(src.includes('"dates", "constants", "seed", "plan", "progression", "sleep", "energy", "policy", "today", "volume", "oracle-shim"'),
    'and names the prior modules it re-reads, today.cjs among them');
  for (const f of ['rebuild/engine/today.cjs', 'rebuild/engine/constants.cjs'])
    assert.notEqual(disk(f), blob('7347ca976b1131cc44adc6a562c2a795c9e78d0b', f),
      'a prior module the gate pins has stood apart from that commit since before this package: ' + f);
});

test('S11/SUP-4 - source-carriers: the pinned list cannot be extended, and the parent\'s own retirement is on the record', () => {
  const src = disk('rebuild/m4/spec/native-carriers-source.cjs');
  assert(/const BASE='[0-9a-f]{40}'/.test(src), 'the carrier reads a frozen BASE');
  assert(src.includes("const CHANGES_FILE='rebuild/m4/spec/native-carriers-changes.json'"), 'and a literal carrier list');
  assert(/const CHANGES_SHA='[0-9a-f]{64}'/.test(src), 'whose bytes it PINS');
  const listRaw = fs.readFileSync(path.join(REPO, NC.CHANGES_FILE));
  assert.equal(JSON.parse(listRaw).length, 48, 'the parent list is 48 carriers');
  assert.equal(sha(listRaw), NC.CHANGES_SHA, 'the list on disk IS the pinned list, so extending it moves a sha no substitution may re-target');
  /* And this package declares neither the list nor the carrier, so no
     re-target is even available to it. */
  for (const f of [NC.CHANGES_FILE, 'rebuild/m4/spec/native-carriers-source.cjs'])
    assert.equal(Object.hasOwn(SPEC.product, f), false, 'this package declares no product pin over ' + f);
  /* The parent's own retirement of these three gates, from the parent artifact. */
  assert.deepEqual(PARENT.coverage.supersededByCarrier['source-carriers'],
    ['merge-source', 'migrate-source', 'writers-source'], 'the parent retired exactly these three under this carrier');
  assert.deepEqual(PARENT.coverage.byChild, {}, 'and covered no gate by a carrier of its own');
  /* THE PARENT IS S10, NOT S9, AND THAT IS THE WHOLE SHAPE OF THIS PACKAGE. S10
     did not COVER these gates - it RETIRED them - and b-package.cjs's
     parentCarrierGates reads a parent's gate map from BOTH halves, `byChild`
     (covered) and `supersededByCarrier` (retired), so a carrier the parent
     retired is one this child may retire AGAIN under its own token line. It
     inherits the gate list and nothing else: every condition of DECISIONS:153
     (ii)-(iii) is asked of this package exactly as it was asked of S10. */
  assert.equal(PARENT.packageId, 'M2-S10-TODAY-SPLIT', 'the bound parent is S10');
  assert.deepEqual(Object.keys(PARENT.coverage.supersededByCarrier).sort(),
    ['defect-witnesses', 'inherited-carriers', 'second-gate', 'source-carriers', 'writers-differential'],
    'and it retired all five byte-identity carriers, over nine gates, which is the list this package retires again');
  assert.equal(PARENT.coverage.superseded.length, 9, 'nine gates, counted on the parent artifact itself');
  /* THE CITATION. Before the PM writes this package's own GATE-SUPERSESSION
     line the field is null BY DESIGN, and the RUNNER - not this cell - is what
     refuses: supersessionRuling() throws GATE-SUPERSESSION-RULING-NOT-CITED
     before one byte of evidence is read. So the cell states which of the two
     states the spec is in and asserts the shape of each; it does not assert
     past the PM, and it does not restate a refusal the runner already owns. */
  const ruling = SPEC.coverage.superseded.rulingLineSha256;
  assert(ruling === null || /^[a-f0-9]{64}$/.test(ruling),
    'the ruling citation is either not yet written by the PM (null, and the runner refuses ' +
    'GATE-SUPERSESSION-RULING-NOT-CITED) or a sha256 of exactly 64 hex digits: ' + JSON.stringify(ruling));
});
