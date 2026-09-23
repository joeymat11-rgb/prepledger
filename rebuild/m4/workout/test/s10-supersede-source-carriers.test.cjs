'use strict';
/* =====================================================================
   M2-S10 SUPERSEDES THE NATIVE-CARRIERS CARRIER `source-carriers`
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

   WHY S10 CANNOT CARRY IT, AND WHY S9'S REASON CANNOT BE REUSED. M2-S10 DOES
   move rebuild/engine bytes: exactly two files, today.cjs and writers.cjs, each
   by the one owner-worded clause of DECISIONS:631 O-1a, and every other tracked
   file stands at the parent's own post; SUP-1 asserts both halves over the
   whole inventory. The
   reconstruction is nevertheless already false on this tree, because S10's
   ANCESTORS moved four of the files it rebuilds: constants.cjs and writers.cjs
   (M2-H3-CLEAN-INIT) and merge.cjs and today.cjs (M2-S3-COMPANION), and
   migrate.cjs has stood apart from the frozen src/app.jsx declaration since
   long before B-NTC. The PARENT, M2-S9-UI-PINS, moved none of them either -
   it is where this package inherits them from, unmoved - and it retired these
   same gates under its own token line DECISIONS:787 for exactly this reason.
   Both files S10 moves had ALREADY left the reconstruction at the parent, so
   S10's clauses move them further from it and never back: S10 can neither
   reproduce the construction nor re-target the sha-pinned list, whose bytes
   CHANGES_SHA pins (SUP-4), and its brief names no native-carriers file.

   THIS IS THE EIGHTH GENERATION, AND THE POINT IS THAT NOTHING DECAYS. S3
   was the child, S4 the grandchild, S5 the great-grandchild, S6 the fourth,
   S7 the fifth, S8 the sixth, S9 the seventh and S10 the eighth in the line; each retires the nine
   AGAIN under its OWN token line and its OWN executed evidence, inheriting from
   its parent's retirement nothing but the gate list (b-package.cjs
   parentCarrierGates). DECISIONS:153 is the standing role; :422 note 3 named
   this compounding effect before it was measured; :443 measured it as the
   first of the nineteen gates refusing; :787 is the PARENT's token line and
   this package's own is the one the PM writes when this brief is accepted.

   RED-FIRST, EXECUTED HERE, TWICE: SUP-2 runs the carrier's own verifier and
   it refuses; SUP-3 runs the ORIGINAL gate programme migrate-source and it
   refuses. SUP-2's four files had all left the reconstruction before this
   package; SUP-3's is not moved by it at all.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S10.json'), 'utf8'));
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
/* WHAT S10 DOES MOVE UNDER rebuild/engine/, AND IT IS WHY S9'S REASON CANNOT BE CARRIED.
   S9 retired these gates because it "changes NO engine byte". M2-S10 changes two files,
   each by exactly ONE owner-worded clause (DECISIONS:631 O-1a; REVIEW-EPP-l1 f0a5eb1a
   upheld both; D-EPP-3's declared departure, its payer the S10 seal chain by
   DECISIONS:780 Q3): the untapped-PROPOSED exclusion pickStructural already had, added to
   genSession's debut lookup and to completeSession's. Each is asserted here as the
   PARENT'S OWN BYTES (read from Git at this package's sourceBase and tied to the parent
   artifact's post) PLUS THAT ONE CLAUSE AND NOTHING ELSE, and as declared "edited" with
   pre = the parent post and post = the byte on disk. Files this package ADDS under
   rebuild/engine/ carry pre null and have no parent image at all. */
const EPP_CLAUSES = {
  'rebuild/engine/today.cjs': ['x.exId === e.id && !x.done && (x.kind', 'x.exId === e.id && !x.done && x.state !== "PROPOSED" && (x.kind'],
  'rebuild/engine/writers.cjs': ['x.exId === ex.id && !x.done && (x.kind', 'x.exId === ex.id && !x.done && x.state !== "PROPOSED" && (x.kind'],
};
const eppMoved = f => Object.hasOwn(EPP_CLAUSES, f);
const addedHere = f => Object.hasOwn(SPEC.product, f) && SPEC.product[f].pre === null;
function assertEppClauseOnly(f) {
  const [before, after] = EPP_CLAUSES[f];
  const parentBytes = git(['show', SPEC.sourceBase + ':' + f]).toString('utf8');
  assert.equal(sha(Buffer.from(parentBytes, 'utf8')), parentWant(f), 'the parent bytes at this package\'s sourceBase are the parent\'s own post: ' + f);
  assert.equal(parentBytes.split(before).length, 2, 'the parent carries the unrepaired debut lookup exactly once: ' + f);
  assert.equal(fs.readFileSync(path.join(REPO, f), 'utf8'), parentBytes.replace(before, () => after),
    'and the tree is the parent plus exactly the one owner-worded clause, nothing else: ' + f);
  const p = SPEC.product[f];
  assert.equal(p.role, 'edited', 'this package declares it edited: ' + f);
  assert.equal(p.pre, parentWant(f), 'its declared pre-image is the parent post: ' + f);
  assert.equal(p.post, diskSha(f), 'and its declared post-image is the byte on disk: ' + f);
}

test('S10/SUP-1 - source-carriers: M2-S10 moves EXACTLY two rebuild/engine files, each by one owner-worded clause, over the whole tracked inventory', () => {
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
  assert.deepEqual(moved.sort(), Object.keys(EPP_CLAUSES).sort(),
    'exactly the two EPP files move from the parent post, and no other tracked rebuild/engine file');
  for (const f of moved) assertEppClauseOnly(f);
  for (const f of named) {
    if (eppMoved(f) || addedHere(f)) continue;
    const p = SPEC.product[f];
    assert.equal(p.role, 'carried', 'every other engine file this package names is declared carried: ' + f);
    assert.equal(p.pre, p.post, 'and its pre-image IS its post-image: ' + f);
    assert.equal(p.post, diskSha(f), 'and that is the byte on disk: ' + f);
    assert.equal(p.post, parentWant(f), 'and it is the parent artifact\'s own pin: ' + f);
  }
  console.log('  ENGINE MOVES ' + tracked.length + ' tracked file(s), ' + named.length + ' named, ' + outside.length +
    ' outside, ' + moved.length + ' moved by one declared clause each, ' + added.length + ' added');
});

test('S10/SUP-2 - source-carriers: RED-FIRST - the carrier\'s own verifier, EXECUTED here, refuses on this tree', () => {
  /* The construction itself is intact: the frozen BASE plus the 48 pinned
     carriers still builds what it always built. It is the tree that has left
     it, and SUP-1 has just shown that S10's two clauses land in two files that
     had already left it. */
  const built = NC.construct(NC.baseline(REPO));
  assert(/^[a-f0-9]{40}$/.test(NC.BASE), 'the carrier reads a frozen BASE');
  assert.notEqual(NC.BASE, SPEC.sourceBase, 'and it is not this package\'s own base');
  assert.throws(() => NC.verify(REPO), /Exact product construction: rebuild\/engine\/today\.cjs/,
    'the carrier refuses at the first file it rebuilds that this tree has left behind');
  /* Every divergence, enumerated rather than summarised. */
  const diverged = [];
  for (const f of Object.keys(built)) if (f.startsWith(ENGINE_ROOT) && disk(f) !== built[f]) diverged.push(f);
  for (const f of NC.RETAINED) if (!Object.hasOwn(built, f) && disk(f) !== blob(NC.BASE, f)) diverged.push(f);
  assert.deepEqual(diverged.sort(), ['rebuild/engine/constants.cjs', 'rebuild/engine/merge.cjs',
    'rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs'],
    'exactly four engine files stand outside the reconstruction, and they are named here');
  for (const f of diverged) {
    if (eppMoved(f)) {
      assertEppClauseOnly(f);
      console.log('  RECONSTRUCTION REFUSES ' + f + ' disk ' + diskSha(f).slice(0, 12) + ' = the parent post plus one declared clause');
      continue;
    }
    assert.equal(diskSha(f), parentWant(f), 'and each of them stands at the PARENT\'s own post: ' + f);
    assert.equal(SPEC.product[f].pre, SPEC.product[f].post, 'and this package declares it carried, pre === post: ' + f);
    console.log('  RECONSTRUCTION REFUSES ' + f + ' disk ' + diskSha(f).slice(0, 12) + ' inherited unmoved from the parent');
  }
});

test('S10/SUP-3 - source-carriers: RED-FIRST - the ORIGINAL gate migrate-source, EXECUTED, refuses at its first declaration', () => {
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

test('S10/SUP-4 - source-carriers: the pinned list cannot be extended, and the parent\'s own retirement is on the record', () => {
  const src = disk('rebuild/m4/spec/native-carriers-source.cjs');
  assert(/const BASE='[0-9a-f]{40}'/.test(src), 'the carrier reads a frozen BASE');
  assert(src.includes("const CHANGES_FILE='rebuild/m4/spec/native-carriers-changes.json'"), 'and a literal carrier list');
  assert(/const CHANGES_SHA='[0-9a-f]{64}'/.test(src), 'whose bytes it PINS');
  const listRaw = fs.readFileSync(path.join(REPO, NC.CHANGES_FILE));
  assert.equal(JSON.parse(listRaw).length, 48, 'the parent list is 48 carriers');
  assert.equal(sha(listRaw), NC.CHANGES_SHA, 'the list on disk IS the pinned list, so extending it moves a sha no substitution may re-target');
  /* And this package declares neither the list nor the carrier, so no
     re-target is even available to it: its brief names no native-carriers
     file under rebuild/m4/spec at all. */
  for (const f of [NC.CHANGES_FILE, 'rebuild/m4/spec/native-carriers-source.cjs'])
    assert.equal(Object.hasOwn(SPEC.product, f), false, 'this package declares no product pin over ' + f);
  /* The parent's own retirement of these three gates, from the parent artifact. */
  assert.deepEqual(PARENT.coverage.supersededByCarrier['source-carriers'],
    ['merge-source', 'migrate-source', 'writers-source'], 'the parent retired exactly these three under this carrier');
  assert.deepEqual(PARENT.coverage.byChild, {}, 'and covered no gate by a carrier of its own');
  /* THE PARENT IS S9, NOT S8, AND THAT IS THE WHOLE SHAPE OF THIS PACKAGE. S9
     did not COVER these gates - it RETIRED them - and b-package.cjs's
     parentCarrierGates reads a parent's gate map from BOTH halves, `byChild`
     (covered) and `supersededByCarrier` (retired), so a carrier the parent
     retired is one this child may retire AGAIN under its own token line. It
     inherits the gate list and nothing else: every condition of DECISIONS:153
     (ii)-(iii) is asked of this package exactly as it was asked of S9. */
  assert.equal(PARENT.packageId, 'M2-S9-UI-PINS', 'the bound parent is S9');
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
