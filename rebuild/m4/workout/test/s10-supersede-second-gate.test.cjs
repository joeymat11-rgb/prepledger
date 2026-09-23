'use strict';
/* =====================================================================
   M2-S10 SUPERSEDES THE NATIVE-CARRIERS CARRIER `second-gate`
   (gate second-gate)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. `NATIVE SECOND GATE:` - the
   independent second reading of the adopted engine: the same frozen inputs put
   through the engine a second time, by a different route, and required to come
   back with the same bytes. It is the gate that says "the public record does
   not move", and it reaches the engine through the same sha-pinned
   reconstruction as the other four: `native-carriers-second-gate.cjs` goes
   through the profile, and the original `second-gate.mjs` pins the frozen
   source commit `fe516c1` with a static inventory and assertion catalogue.

   WHY S10 CANNOT CARRY IT. Same wall, same measurement: the reconstruction
   refuses on this tree at files this package's ancestors moved, two of which
   S10 moves one owner-worded clause further (s10-supersede-source-carriers
   SUP-1, SUP-2). The parent
   M2-S9-UI-PINS stood in exactly this position and retired the gate at
   DECISIONS:787; S10 retires it again, under its own line and its own evidence,
   because a retirement is never inherited - only the gate list is.

   WHAT S10 PUTS IN ITS PLACE, HERE, EXECUTED. The claim the second gate makes,
   made directly and from a second, independent source of bytes: the ACCEPTED
   engine composed from GIT at this package's own sourceBase - each module tied
   to the parent artifact's declared post before it is compiled - and the
   engine ON DISK, driven over the frozen SEED athlete through every reader the
   public census reads, through genSession across a whole week, through the
   inherited membership reader, and through mergeState of the record with a
   diverged copy of itself. The whole projection is compared BYTE FOR BYTE and
   nothing may move; S10's two clauses change only which queue entry a debut
   lookup may establish from, so any difference here would have to be D-EPP-3's
   declared departure and would show red, never be absorbed. The census log itself is proved unmoved by this package's
   own `--ci` census line; this cell is the in-process half a reviewer can
   re-run in a second.

   RED-FIRST: SUP-16 refuses the reconstruction and then shows this comparison
   detecting a one-line engine change, so "nothing moved" is a measurement.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');
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

function privately(file, source) {
  const abs = path.join(REPO, file);
  const m = new Module(abs, module);
  m.filename = abs;
  m.paths = Module._nodeModulePaths(path.dirname(abs));
  const normal = m.require.bind(m);
  m.require = name => (name.startsWith('.') ? require(path.resolve(path.dirname(abs), name)) : normal(name));
  m._compile(source, abs);
  return m.exports;
}
const ORDER = [...disk('rebuild/engine/index.cjs').matchAll(/require\("\.\/([a-z-]+)\.cjs"\)/g)].map(m => m[1]);
assert.equal(ORDER.length, 16, 'the real composition, sixteen modules');
const DAY = '2026-09-07';
const clock = { today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'),
  stamp: () => DAY + 'T13:00:00.000Z', nowISO: () => DAY + 'T13:00:00.000Z', nowMs: () => Date.parse(DAY + 'T13:00:00.000Z') };
function engineOf(side) {
  const E = {};
  const deps = { clock, ids: undefined, drafts: Object.freeze({ length: 0, key: () => null }) };
  for (const name of ORDER) Object.assign(E, (side[name] || require('../../../engine/' + name + '.cjs'))(E, deps));
  return E;
}
function acceptedSide() {
  const side = {};
  for (const name of ORDER) {
    const f = 'rebuild/engine/' + name + '.cjs';
    const bytes = blob(SPEC.sourceBase, f);
    assert.equal(sha(Buffer.from(bytes, 'utf8')), parentWant(f), 'the accepted module is the parent\'s own post: ' + f);
    side[name] = privately(f, bytes);
  }
  return side;
}
const READERS = ['nowModel', 'statusFace', 'currentRate', 'calorieTarget', 'proteinTarget',
  'marchingOrder', 'readRecency', 'fiveLevers', 'recoveryIndex', 'sleepInfo', 'observedTDEE',
  'weekDigest', 'debtLedger', 'theOneThing', 'dossierData', 'nowFocus', 'theOneFix'];
function project(E, state) {
  const out = {};
  for (const r of READERS) {
    if (typeof E[r] !== 'function') { out[r] = 'ABSENT-FROM-THE-COMPOSITION'; continue; }
    try { out[r] = JSON.stringify(E[r](state)); } catch (e) { out[r] = 'THREW ' + String(e && e.message).slice(0, 80); }
  }
  for (let i = 0; i < 7; i++) {
    const day = new Date(Date.UTC(2026, 8, 7 + i)).toISOString().slice(0, 10);
    try { out['genSession:' + day] = JSON.stringify(E.genSession(JSON.parse(JSON.stringify(state)), day, E.sleepInfo(state))); }
    catch (e) { out['genSession:' + day] = 'THREW ' + String(e && e.message).slice(0, 80); }
  }
  const diverged = JSON.parse(JSON.stringify(state));
  diverged.reads.push({ d: DAY, w: 186.4, sealed: false, note: 'SYNTHETIC second-gate divergence' });
  out.mergeState = JSON.stringify(E.mergeState(JSON.parse(JSON.stringify(state)), diverged));
  return out;
}

test('S10/SUP-14 - second-gate: the reader surface is real, and both compositions expose it', () => {
  const B = engineOf({}), A = engineOf(acceptedSide());
  assert.deepEqual(READERS.filter(r => typeof B[r] !== 'function'), [], 'every reader this cell compares exists on the tree\'s composition');
  assert.deepEqual(READERS.filter(r => typeof A[r] !== 'function'), [], 'and on the accepted composition built from Git at ' + SPEC.sourceBase.slice(0, 7));
  assert(READERS.length >= 15, 'the whole public surface, not a sample: ' + READERS.length);
  const added = Object.keys(B).filter(k => !(k in A)).sort();
  const removed = Object.keys(A).filter(k => !(k in B)).sort();
  assert.deepEqual(added, [], 'this package adds no engine member');
  assert.deepEqual(removed, [], 'and removes none');
});

test('S10/SUP-15 - second-gate: over the FROZEN RECORD the accepted engine and this tree agree BYTE FOR BYTE', () => {
  const A = engineOf(acceptedSide()), B = engineOf({});
  const state = JSON.parse(JSON.stringify(B.SEED));
  assert(Number.isFinite(state.trend), 'the frozen record carries a trend');
  const a = project(A, state), b = project(B, state);
  const keys = Object.keys(a);
  assert.deepEqual(Object.keys(b), keys, 'the same projection keys');
  assert.deepEqual(keys.filter(k => a[k] !== b[k]), [], 'no reader moves: the public record does not move');
  assert.equal(JSON.stringify(b), JSON.stringify(a), 'the whole projection, compared as one string');
  assert(keys.some(k => k.startsWith('genSession:') && b[k] !== 'null' && !b[k].startsWith('THREW')), 'the frozen week really produced a session');
  /* The inherited reader still names the seed's own pool, on both sides. */
  const m = B.sessionMembership(state, DAY);
  const g = B.genSession(JSON.parse(JSON.stringify(state)), DAY, B.sleepInfo(state));
  if (m === null) assert.equal(g, null, 'a rest day on both');
  else assert.deepEqual(m.exercise_ids.slice(), g.ex.map(c => c.id), 'and it names the seed\'s own pool');
  console.log('  SECOND READING ' + keys.length + ' projection key(s) over the frozen SEED, 0 moved');
});

test('S10/SUP-16 - second-gate: RED-FIRST - the gate cannot be TAKEN over this tree, and the comparison has teeth', () => {
  /* The original gate's own frozen anchor, quoted from its bytes. */
  const gate = disk('rebuild/engine/test/second-gate.mjs');
  assert(gate.includes('sourceCommit:"fe516c1"'), 'the second gate pins the frozen source commit');
  assert(gate.includes('second-gate-inventory.json') && gate.includes('second-gate-assertions.json'),
    'and a static inventory and assertion catalogue taken over that source');
  assert(disk('rebuild/m4/spec/native-carriers-second-gate.cjs').includes("Profile=require('./native-carriers-profile.cjs')"),
    'and the carrier that stood in for it goes through the same profile');
  assert.throws(() => NC.verify(REPO), /Exact product construction: rebuild\/engine\//,
    'whose reconstruction refuses on this tree before anything is read a second time');
  for (const f of ['rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs', 'rebuild/engine/merge.cjs', 'rebuild/engine/constants.cjs'])
    if (eppMoved(f)) assertEppClauseOnly(f);
    else assert.equal(diskSha(f), parentWant(f), 'and every file it refuses at is carried unmoved from the parent: ' + f);
  /* TEETH. One line of one engine module, and this reading sees it. */
  const f = 'rebuild/engine/today.cjs';
  const real = disk(f);
  const marker = 'if (dt !== "U" && dt !== "L") return null;\n  const { main, riders } = pickStructural(s, iso, slp);';
  assert.equal(real.split(marker).length, 2, 'one genSession guard site, exactly');
  const mutant = privately(f, real.replace(marker, marker.replace('return null;', 'return null; /* S10 RED CONTROL */')));
  const B = engineOf({}), M = engineOf({ today: mutant });
  const state = JSON.parse(JSON.stringify(B.SEED));
  const bp = project(B, state), mp = project(M, state);
  assert.deepEqual(Object.keys(bp).filter(k => bp[k] !== mp[k]), [],
    'a comment-only change moves nothing, as it must not');
  const mutant2 = privately(f, real.replace(marker, 'if (dt !== "U" && dt !== "L") return null;\n  const { main, riders } = { main: null, riders: [] };'));
  const M2 = engineOf({ today: mutant2 });
  const m2 = project(M2, state);
  assert(Object.keys(bp).some(k => bp[k] !== m2[k]), 'RED CONTROL: a one-line engine change IS detected by this reading');
});
