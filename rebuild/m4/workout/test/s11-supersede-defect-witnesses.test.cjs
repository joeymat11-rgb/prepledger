'use strict';
/* =====================================================================
   M2-S11 SUPERSEDES THE NATIVE-CARRIERS CARRIER `defect-witnesses`
   (gate witnesses-7)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. `NATIVE DEFECT WITNESSES:
   10/10 complete comparisons PASS;` - for each adopted defect it ran the
   FROZEN engine and the CANDIDATE engine over the same witness input and
   compared the two outputs completely, so a repair was evidenced by the
   difference it made and by nothing else. A witness that could not be produced
   on both sides was not a witness.

   WHY S11 CANNOT CARRY IT. The FROZEN side is not a file: it is built, and it
   is built through `native-carriers-parent-source.cjs` -> `B =
   native-carriers-source.cjs`, the sha-pinned reconstruction whose `verify()`
   refuses on this tree (SUP-8 executes it). Four engine files the
   reconstruction rebuilds were moved by S11's ancestors under their own token
   lines; its parent M2-S10-TODAY-SPLIT moved two of them (today.cjs,
   writers.cjs) by one owner-worded clause each and retired this same carrier
   at DECISIONS:829. S11 moves writers.cjs further by its declared FG01 hunks,
   takes progression.cjs off the construction by FG02, and adds native-load.cjs
   outside the carrier's closed inventory: it cannot mend a frozen side that
   four earlier packages left behind, and it does not try.

   WHAT S11 PUTS IN ITS PLACE, HERE, EXECUTED, AND IT IS THE SAME SHAPE. The
   engine members S11 adds and the readers it moves are named, not assumed:
   FG01 moves completeSession's honest-opener governor into updateOpenerHold
   without changing a byte of it and exports that one new member; FG02 changes
   _prescribedLoads, which progression.cjs reaches only through
   _rowAtCurrentLoad's native branch; native-load.cjs is not in index.cjs's
   composition (index.cjs is carried at the parent's post, which predates the
   file). So the complete comparison S11 owes over the frozen record is still
   MEASURED rather than asserted; if that record reached FG02 the difference
   would have to be FG02's declared reading, and this cell would show it red
   rather than absorb it: the ACCEPTED engine - every module read from GIT at
   this package's own sourceBase, compiled privately, never entering
   require.cache - and the engine ON DISK, composed side by side in index.cjs's
   own order and driven over the frozen SEED through every reader the public
   census reads, through genSession on a whole week and through mergeState of
   the record with a diverged copy of itself. The whole projection must agree
   BYTE FOR BYTE, and the member set may differ by exactly FG01's one added
   member and nothing else.

   RED-FIRST: SUP-8 refuses before anything is compared; SUP-10 carries the
   control that gives SUP-9 its meaning - a single removed export moves the
   projection, so "identical" is a measurement and not a tautology.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S11.json'), 'utf8'));
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

/* A privately compiled engine module: bytes handed in, never on disk, never in
   require.cache, with its own relative specifiers resolved against the real
   directory so the modules it reaches are the real ones. */
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
/* index.cjs's own composition order, read from its source and never re-typed. */
const ORDER = [...disk('rebuild/engine/index.cjs').matchAll(/require\("\.\/([a-z-]+)\.cjs"\)/g)].map(m => m[1]);
assert.equal(ORDER.length, 16, 'the real composition, sixteen modules');
const DAY = '2026-09-07';
const clock = { today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'),
  stamp: () => DAY + 'T13:00:00.000Z', nowISO: () => DAY + 'T13:00:00.000Z', nowMs: () => Date.parse(DAY + 'T13:00:00.000Z') };
/* `side` is a map module-name -> factory; anything it does not name is the real
   module on disk, exactly as index.cjs would load it. */
function engineOf(side) {
  const E = {};
  const deps = { clock, ids: undefined, drafts: Object.freeze({ length: 0, key: () => null }) };
  for (const name of ORDER) Object.assign(E, (side[name] || require('../../../engine/' + name + '.cjs'))(E, deps));
  return E;
}
/* THE ACCEPTED SIDE, read from GIT and not from the tree: every one of the
   sixteen modules at this package's own sourceBase, each asserted to be the
   parent artifact's declared post before it is compiled. */
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
    try { out['membership:' + day] = JSON.stringify(E.sessionMembership ? E.sessionMembership(state, day) : 'NO-READER'); }
    catch (e) { out['membership:' + day] = 'THREW ' + String(e && e.message).slice(0, 80); }
  }
  const diverged = JSON.parse(JSON.stringify(state));
  diverged.reads.push({ d: DAY, w: 186.4, sealed: false, note: 'SYNTHETIC S11 witness divergence' });
  out.mergeState = JSON.stringify(E.mergeState(JSON.parse(JSON.stringify(state)), diverged));
  return out;
}

test('S11/SUP-8 - defect-witnesses: RED-FIRST - the FROZEN side is built through the reconstruction, and it refuses here', () => {
  /* The dependency, quoted from the carrier's own bytes, not described. */
  const carrier = disk('rebuild/m4/spec/native-carriers-defect-witnesses.cjs');
  assert(carrier.includes("S=require('./native-carriers-parent-source.cjs')"), 'the witness carrier stands on the parent-source module');
  assert(disk('rebuild/m4/spec/native-carriers-parent-source.cjs').includes("B=require('./native-carriers-source.cjs')"),
    'which stands on the sha-pinned reconstruction');
  assert.throws(() => NC.verify(REPO), /Closed engine file inventory/,
    'and that reconstruction refuses on this tree, so the frozen side of every comparison cannot be produced');
  /* The original gate reaches the engine the same way. */
  const gate = disk('rebuild/engine/test/defect-witnesses-7.cjs');
  assert(gate.includes("require('../index.cjs')"), 'the gate composes the engine under comparison');
  assert(gate.includes("require('./writers-reference.cjs')"), 'against the frozen writer reference');
  /* AND THE WALL PREDATES S11. Of the four files S11's ancestors left outside the
     reconstruction, three stand at the parent post and the fourth, writers.cjs, is the
     parent post plus exactly S11's declared hunks. S11's own two walls come on top: the
     added native-load.cjs outside the closed inventory, and progression.cjs, the parent
     post plus exactly FG02. */
  for (const f of ['rebuild/engine/today.cjs', 'rebuild/engine/writers.cjs', 'rebuild/engine/merge.cjs', 'rebuild/engine/constants.cjs'])
    if (nlMoved(f)) assertNlMovesOnly(f);
    else assert.equal(diskSha(f), parentWant(f), 'unmoved by this package: ' + f);
  assertNlMovesOnly('rebuild/engine/progression.cjs');
  assert.equal(NC.ENGINE.includes('rebuild/engine/native-load.cjs'), false, 'the added native-load.cjs is outside the closed inventory');
  assert.equal(SPEC.product['rebuild/engine/native-load.cjs'].role, 'new', 'and this package declares it new');
});

test('S11/SUP-9 - defect-witnesses: THE COMPLETE COMPARISON - the accepted engine (from Git) and this tree agree BYTE FOR BYTE', () => {
  const A = engineOf(acceptedSide()), B = engineOf({});
  assert.notEqual(A, B, 'two distinct compositions, one per side');
  assert.deepEqual(READERS.filter(r => typeof B[r] !== 'function'), [], 'every reader compared exists on the tree\'s composition');
  assert.deepEqual(READERS.filter(r => typeof A[r] !== 'function'), [], 'and on the accepted composition built from Git');
  const added = Object.keys(B).filter(k => !(k in A)).sort();
  const removed = Object.keys(A).filter(k => !(k in B)).sort();
  assert.deepEqual(added, ['updateOpenerHold'], 'S11 adds exactly one engine member, the FG01 governor updateOpenerHold');
  assert.deepEqual(removed, [], 'and removes none');
  const state = JSON.parse(JSON.stringify(B.SEED));
  assert(Number.isFinite(state.trend), 'the frozen record carries a trend');
  const a = project(A, state), b = project(B, state);
  const keys = Object.keys(a);
  assert.deepEqual(Object.keys(b), keys, 'the same projection keys');
  assert.deepEqual(keys.filter(k => a[k] !== b[k]), [], 'no reader moves: the public record does not move');
  assert.equal(JSON.stringify(b), JSON.stringify(a), 'the whole projection, compared as one string');
  assert(keys.some(k => k.startsWith('genSession:') && b[k] !== 'null' && !b[k].startsWith('THREW')), 'the frozen week really produced a session');
  assert(keys.filter(k => k.startsWith('membership:')).length === 7, 'and the inherited reader answered every day of it');
  console.log('  COMPLETE COMPARISON ' + keys.length + ' projection key(s), 0 moved, over ' + ORDER.length + ' modules read from Git');
});

test('S11/SUP-10 - defect-witnesses: RED CONTROL - a single removed export moves the projection, so SUP-9 is a measurement', () => {
  const f = 'rebuild/engine/today.cjs';
  const real = disk(f);
  const marker = 'genSession, sessionMembership,';
  assert.equal(real.split(marker).length, 2, 'one export site, exactly');
  const mutant = privately(f, real.replace(marker, 'genSession,'));
  const M = engineOf({ today: mutant }), B = engineOf({});
  assert.equal(typeof B.sessionMembership, 'function', 'the real composition exposes the reader');
  assert.equal(typeof M.sessionMembership, 'undefined', 'the mutant does not');
  const state = JSON.parse(JSON.stringify(B.SEED));
  const mp = project(M, state), bp = project(B, state);
  const moved = Object.keys(bp).filter(k => bp[k] !== mp[k]);
  assert(moved.length, 'RED CONTROL: the projection detects the removed member: ' + moved.slice(0, 3).join(' '));
  assert(moved.every(k => k.startsWith('membership:')), 'and detects exactly it: ' + moved.join(' '));
});
