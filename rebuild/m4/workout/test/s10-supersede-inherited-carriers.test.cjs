'use strict';
/* =====================================================================
   M2-S10 SUPERSEDES THE NATIVE-CARRIERS CARRIER `inherited-carriers`
   (gates witnesses-2, witnesses-5, migrate-differential)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS.
   `native-carriers-source-carriers.cjs:priorModule` re-reads EVERY PRIOR
   ENGINE MODULE as each gate walks the composition: a module the carrier list
   does not name is asserted byte-identical to its frozen prior bytes, and a
   module it does name is REBUILT from those bytes by the declared carriers, in
   the declared order, and asserted equal to what is on disk - with the visit
   order itself pinned (`CARRIED_VISITS`, today(9) among them).

   WHY S10 CANNOT CARRY IT. The frozen prior bytes come from the same sha-pinned
   list as `source-carriers`, and today.cjs and writers.cjs on this tree are no
   longer the declared post-image of that list: M2-S3-COMPANION and
   M2-H3-CLEAN-INIT moved them first, under their own token lines, the parent
   M2-S9-UI-PINS inherited them unmoved and retired these gates again at
   DECISIONS:787, and S10 now moves each by exactly one owner-worded clause
   (DECISIONS:631 O-1a), further from the list and never back to it
   (s10-supersede-source-carriers SUP-1).
   SUP-5 executes priorModule's own rule and shows exactly where it refuses.

   WHAT S10 PUTS IN ITS PLACE, HERE, EXECUTED. Both halves of the same claim,
   pointed at what S10 actually is - a RESEAL child (DECISIONS:455) that
   moves two engine modules by one owner-worded clause each. (a) EVERY other
   prior engine module on this tree is byte-identical to the PARENT'S OWN POST,
   and the two it moves are the parent's bytes plus exactly their clause - and the instrument that says so is shown to detect a single moved
   byte (SUP-6). (b) The capabilities the parent's two declared files carry are
   still THERE and still reached: the sessionMembership reader answers the
   frozen seed's own pool, and the nativeDate seam is reached at every routed
   site (SUP-7). An inheritance claim that never executes the inherited thing
   is a sha comparison wearing a capability's name.

   RED-FIRST: SUP-5 refuses on the parent-declared paths; SUP-6 carries its own
   mutation control; SUP-7 asserts the accepted engine's absent member first.
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
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const PARENT_RAW = fs.readFileSync(path.join(REPO, OPTION.artifact));
assert.equal(sha(PARENT_RAW), OPTION.sha256, 'the accepted parent artifact is the bytes this spec pins');
const PARENT = JSON.parse(PARENT_RAW);
const NC = require('../../spec/native-carriers-source.cjs');
const git = a => cp.execFileSync('git', a, { cwd: REPO, maxBuffer: 9e7 });
const disk = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const diskSha = f => sha(fs.readFileSync(path.join(REPO, f)));
const blob = (rev, f) => git(['show', rev + ':' + f]).toString('utf8');
const blobSha = (rev, f) => sha(git(['show', rev + ':' + f]));
const tracked = git(['ls-files', '-z', 'rebuild/engine']).toString('utf8').split('\0').filter(f => f.startsWith('rebuild/engine/'));
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

test('S10/SUP-5 - inherited-carriers: RED-FIRST - priorModule\'s own rule, re-executed over the real carried modules', () => {
  /* The rule, transcribed from native-carriers-source-carriers.cjs and applied
     to the bytes rather than to a description of them: the frozen prior module
     must be the declared carrier PRE-image, the declared carriers rebuild it
     into the declared POST-image, and the file on disk must be that. */
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
    'rebuild/engine/progression.cjs', 'rebuild/engine/sleep.cjs'], 'four carried modules still ARE the declared carriers');
  assert.deepEqual(refused.sort(), ['rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs'],
    'and two are not, so priorModule refuses this tree before any witness is taken');
  /* The visit order the carrier pins, quoted from its own bytes, with the
     count that makes today.cjs unavoidable. */
  const src = disk('rebuild/m4/spec/native-carriers-source-carriers.cjs');
  assert(src.includes("'migrate-source':['plan(1)','progression(28)','sleep(4)','today(9)']"),
    'the carrier pins the carried modules each gate re-reads, in order, with their counts');
  assert.equal((byModule.get('rebuild/engine/today.cjs') || []).length, 9, 'today.cjs really carries nine declared carriers');
  for (const f of refused) {
    assertEppClauseOnly(f); /* the refused file is the parent's post plus this package's one declared clause */
    console.log('  PRIORMODULE REFUSES ' + f + ' declared post ' + NC.CARRIED[f].after.slice(0, 12) + ', tree ' + diskSha(f).slice(0, 12));
  }
});

test('S10/SUP-6 - inherited-carriers: every other prior engine module is byte-identical to the PARENT\'S OWN POST, the two EPP files are it plus one clause, and the instrument has teeth', () => {
  const rows = [];
  for (const f of tracked) {
    rows.push(f);
    if (addedHere(f)) { assert.equal(SPEC.product[f].post, diskSha(f), 'an added engine file stands at its declared post: ' + f); continue; }
    if (eppMoved(f)) { assertEppClauseOnly(f); continue; }
    const want = parentWant(f), got = diskSha(f);
    assert.equal(got, want, 'engine file moved from the parent post: ' + f);
  }
  assert.equal(rows.length, tracked.length, 'the whole tracked inventory, not a sample: ' + rows.length);
  assert(rows.length >= 40, 'and it is the real one');
  /* MUTATION CONTROL. "Everything is identical" is worth nothing unless the
     comparison can tell when it is not, so it is shown failing on one byte. */
  const probe = 'rebuild/engine/index.cjs';
  const mutant = Buffer.from(disk(probe).replace('require("./seed.cjs")', 'require("./seed.cjs") /* mutant */'), 'utf8');
  assert.notEqual(sha(mutant), parentWant(probe), 'RED CONTROL: a single inserted comment is detected by the same comparison');
  assert.equal(diskSha(probe), parentWant(probe), 'and the real bytes still stand at the parent post');
  console.log('  PARENT POST IDENTITY ' + rows.length + ' tracked rebuild/engine file(s), ' + Object.keys(EPP_CLAUSES).length + ' moved by one declared clause each, 1 mutation control detected');
});

test('S10/SUP-7 - inherited-carriers: the inherited capabilities are still THERE and still reached, executed', () => {
  const DAY = '2026-09-07';
  const clock = { today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'),
    stamp: () => DAY + 'T13:00:00.000Z', nowISO: () => DAY + 'T13:00:00.000Z', nowMs: () => Date.parse(DAY + 'T13:00:00.000Z') };
  const { createEngine } = require('../../../engine/index.cjs');
  const E = createEngine({ clock });
  /* RED-FIRST: the member the RECONSTRUCTION would hand back does not exist.
     The carrier's own built today.cjs knows no membership reader at all. */
  const built = NC.construct(NC.baseline(REPO))['rebuild/engine/today.cjs'];
  assert.equal(built.includes('sessionMembership'), false, 'RED: the reconstruction\'s today.cjs has no membership reader');
  assert(disk('rebuild/engine/today.cjs').includes('function sessionMembership(s, iso)'), 'the tree\'s does');
  assert.equal(typeof E.sessionMembership, 'function', 'and the composition exposes it');
  const state = JSON.parse(JSON.stringify(E.SEED));
  const m = E.sessionMembership(state, DAY);
  const g = E.genSession(JSON.parse(JSON.stringify(state)), DAY, E.sleepInfo(state));
  if (m === null) assert.equal(g, null, 'a rest day on both readers');
  else assert.deepEqual(m.exercise_ids.slice(), g.ex.map(c => c.id), 'the reader names exactly genSession\'s own pool');
  /* The other inherited capability: the nativeDate seam, reached at every routed site. */
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
