'use strict';
/* =====================================================================
   M2-S11 SUPERSEDES THE NATIVE-CARRIERS CARRIER `writers-differential`
   (gate writers-differential)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. That the adopted
   `rebuild/engine/writers.cjs` behaves identically to the frozen writer across
   THREE Date/trap modes - `NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap modes
   PASS;` - by running both over the same inputs with the clock frozen, the
   clock live, and `Date` trapped, and comparing outputs.

   WHY S11 CANNOT CARRY IT. The gate reaches writers.cjs through the same
   sha-pinned reconstruction the other four carriers use, and writers.cjs on
   this tree is neither that reconstruction's pre-image nor its post-image: it
   was moved by M2-H3-CLEAN-INIT under DECISIONS:160, long before this package,
   carried unmoved by M2-S3-COMPANION through M2-S9-UI-PINS, and moved by the
   parent M2-S10-TODAY-SPLIT by one owner-worded clause at :227 (DECISIONS:631
   O-1a). SUP-11 measures both distances. M2-S11 moves writers.cjs by its
   declared FG01 hunks (the honest-opener governor moved unchanged into
   updateOpenerHold, called once at the original site, and exported), further
   from both, so it can neither reproduce the frozen side nor re-target the pin.

   WHAT S11 PUTS IN ITS PLACE, HERE, EXECUTED, AND IT IS THE SAME DIFFERENTIAL.
   The ACCEPTED engine - every module read from GIT at this package's own
   sourceBase and asserted to be the parent artifact's declared post before it
   is compiled - and the engine ON DISK are composed side by side and driven
   over the SAME diverged public replicas in the SAME three modes. mergeState
   and the four writers-owned readers must agree BYTE FOR BYTE in every mode,
   and this tree's own output must be identical ACROSS the three modes, so
   nothing here has acquired a clock dependence. The things S11 moves outside
   this engine - the native-load effects and the workout and host runtimes, the
   Today and admission modules and their tests - are not in it; inside it S11
   moves writers.cjs by FG01 and progression.cjs by FG02 and adds
   native-load.cjs, and neither completeSession, where FG01's call site stands,
   nor progression's native-row reader is among the readers compared here.
   SUP-13 asserts that no OTHER parent-pinned file this package edits lives
   under rebuild/engine/, and that the one file it adds there is native-load.cjs.

   RED-FIRST: SUP-11 refuses on the reconstruction's own two shas; SUP-13
   carries the control - one removed writers export is detected by this very
   differential, in all three modes.
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
const WRITERS = 'rebuild/engine/writers.cjs';
/* The parent's own one owner-worded writers.cjs clause (DECISIONS:631 O-1a), which S11
   inherits in the bytes its FG01 hunks apply to and must not lose. */
const S10_EPP_WRITERS = 'x.exId === ex.id && !x.done && x.state !== "PROPOSED" && (x.kind';
const { createSyntheticState, SYNTHETIC_DAY, dayOffset } = require('../../../m3/w7-preview/fixtures.cjs');

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
const DAY = SYNTHETIC_DAY;
const clockFor = () => ({ today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'),
  stamp: () => DAY + 'T13:00:00.000Z', nowISO: () => DAY + 'T13:00:00.000Z', nowMs: () => 1788451200000 });
function engineOf(side) {
  const E = {};
  const deps = { clock: clockFor(), ids: undefined, drafts: Object.freeze({ length: 0, key: () => null }) };
  for (const name of ORDER) Object.assign(E, (side[name] || require('../../../engine/' + name + '.cjs'))(E, deps));
  return E;
}
/* THE ACCEPTED SIDE, from Git, each module tied to the parent's declared post. */
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
/* THE REPLICAS: the public synthetic athlete, diverged three ways - a corrected
   session with an offset-free March stamp on one side, a late weigh-in and two
   adjustments (one malformed, one with an explicit offset) on the other. */
function replicas() {
  const local = createSyntheticState(), remote = createSyntheticState();
  const d = Object.keys(local.sessionLog).sort().at(-1);
  local.sessionLog[d] = { ...local.sessionLog[d], corr: { at: '2026-03-08T02:30:00', rev: 1 },
    corrLog: [{ op: 'skip:demo-row:1:2026-03-08T02:30:00', kind: 'skip', id: 'demo-row', at: '2026-03-08T02:30:00' }], skipped: ['demo-row'] };
  remote.reads.push({ d: dayOffset(DAY, -1), w: 175.2, sealed: false, note: 'SYNTHETIC late replica' });
  remote.adjustments = [{ id: 'adj_' + (1.7e12).toString(36) + 'aaaa', at: '2026-03-08T03:30:00-04:00', d: dayOffset(DAY, -2), kind: 'note' }];
  local.adjustments = [{ id: 'adj_' + (1.7e12).toString(36) + 'bbbb', at: 'bad-stamp', d: dayOffset(DAY, -3), kind: 'note' }];
  return { local, remote };
}
const NativeDate = Date;
const MODES = {
  frozen: () => { globalThis.Date = class extends NativeDate { constructor(...a) { super(...(a.length ? a : [1788451200000])); } static now() { return 1788451200000; } static parse(v) { return NativeDate.parse(v); } }; },
  live: () => { globalThis.Date = NativeDate; },
  trap: () => {
    globalThis.Date = class extends NativeDate {
      constructor(...a) { if (!a.length) throw new Error('ENGINE_READ_THE_WALL_CLOCK'); super(...a); }
      static now() { throw new Error('ENGINE_READ_THE_WALL_CLOCK'); }
      static parse(v) { return NativeDate.parse(v); }
    };
  },
};
function inMode(mode, fn) { MODES[mode](); try { return fn(); } finally { globalThis.Date = NativeDate; } }
/* The writers-owned readers, plus the merge of the two replicas both ways. */
function run(side) {
  const E = engineOf(side);
  const { local, remote } = replicas();
  const out = { lr: JSON.stringify(E.mergeState(structuredClone(local), structuredClone(remote))),
    rl: JSON.stringify(E.mergeState(structuredClone(remote), structuredClone(local))) };
  /* The writers-owned readers, over the frozen SEED record the public census is
     computed from - the same record on both sides, never the replicas, which
     exist only to drive the merge. */
  const seed = JSON.parse(JSON.stringify(E.SEED));
  for (const r of ['weekDigest', 'debtLedger', 'theOneThing', 'dossierData']) {
    if (typeof E[r] !== 'function') { out[r] = 'ABSENT'; continue; }
    try { out[r] = JSON.stringify(E[r](JSON.parse(JSON.stringify(seed)))); }
    catch (e) { out[r] = 'THREW ' + String(e && e.message).slice(0, 80); }
  }
  return out;
}

test('S11/SUP-11 - writers-differential: the gate\'s own subject is the parent post plus its declared FG01 hunks, and RED-FIRST it is not the reconstruction', () => {
  /* The parent's post plus exactly the three declared FG01 hunks, declared edited. */
  assertNlMovesOnly(WRITERS);
  /* And the parent's own one clause at :227 is inherited, once, untouched by FG01. */
  assert.equal(disk(WRITERS).split(S10_EPP_WRITERS).length, 2, 'the parent\'s one owner-worded clause (DECISIONS:631 O-1a) stands in the tree exactly once');
  /* RED-FIRST, both distances, from the carrier's own pins. */
  const pin = NC.CARRIED[WRITERS];
  assert.equal(blobSha(NC.BASE, WRITERS), pin.before, 'the frozen BASE blob IS the reconstruction\'s declared pre-image');
  const built = NC.construct(NC.baseline(REPO))[WRITERS];
  assert.equal(sha(Buffer.from(built, 'utf8')), pin.after, 'and the construction still builds its declared post-image');
  assert.notEqual(diskSha(WRITERS), pin.before, 'RED: this tree is not the pre-image ' + pin.before.slice(0, 12));
  assert.notEqual(diskSha(WRITERS), pin.after, 'RED: nor the post-image ' + pin.after.slice(0, 12) +
    '; the tree stands at ' + diskSha(WRITERS).slice(0, 12) + ', moved by its ancestors (M2-H3-CLEAN-INIT, then the parent\'s one clause) and by its declared FG01 hunks here');
});

test('S11/SUP-12 - writers-differential: 3/3 Date/trap modes - the accepted engine (from Git) and this tree agree BYTE FOR BYTE', () => {
  const results = {};
  for (const mode of Object.keys(MODES)) {
    const a = inMode(mode, () => run(acceptedSide()));
    const b = inMode(mode, () => run({}));
    assert.deepEqual(Object.keys(b), Object.keys(a), mode + ': the same comparison keys');
    assert.deepEqual(Object.keys(b).filter(k => a[k] !== b[k]), [], mode + ': every key byte-identical');
    for (const r of ['weekDigest', 'debtLedger', 'theOneThing', 'dossierData'])
      assert.notEqual(b[r], 'ABSENT', mode + ': the writers-owned reader is on the composition: ' + r);
    /* Three of the four answer on the frozen seed; theOneThing refuses it on
       both sides identically, which is itself part of the comparison. */
    for (const r of ['weekDigest', 'debtLedger', 'dossierData'])
      assert.equal(String(b[r]).startsWith('THREW'), false, mode + ': and it really answered: ' + r);
    assert.equal(a.theOneThing, b.theOneThing, mode + ': including where both sides refuse: theOneThing');
    results[mode] = b;
  }
  assert.equal(Object.keys(results).length, 3, '3/3 modes');
  for (const mode of Object.keys(results)) {
    assert.deepEqual(results[mode], results.frozen, mode + ': this tree reads no wall clock - identical across modes');
    assert.equal(results[mode].lr, results[mode].rl, mode + ': the merge is order-free on these replicas');
  }
  console.log('  WRITERS DIFFERENTIAL 3/3 modes, ' + Object.keys(results.frozen).length + ' comparison key(s) each, 0 moved');
});

test('S11/SUP-13 - writers-differential: S11 edits exactly the two NATIVE-LOAD engine files and adds one, and RED CONTROL - one removed export is detected in all three modes', () => {
  const touched = Object.entries(SPEC.product).filter(([, p]) => p.role !== 'carried').map(([f]) => f);
  assert(touched.length, 'this package does edit and add files');
  assert.deepEqual(touched.filter(f => f.startsWith('rebuild/engine/') && SPEC.product[f].pre !== null).sort(), Object.keys(NL_MOVES).sort(),
    'of the parent-pinned engine files exactly the two NATIVE-LOAD files are edited; the rest of the engine is carried');
  assert.deepEqual(touched.filter(f => f.startsWith('rebuild/engine/') && SPEC.product[f].pre === null).sort(), ['rebuild/engine/native-load.cjs'],
    'and exactly one engine file is added, native-load.cjs, with no parent image');
  for (const f of Object.keys(NL_MOVES)) assertNlMovesOnly(f);
  /* RED CONTROL. The same differential, with one writers export removed. */
  const real = disk(WRITERS);
  const marker = 'theOneThing, weekDigest, debtLedger,';
  assert.equal(real.split(marker).length, 2, 'one export site, exactly');
  const mutantSource = real.replace(marker, 'theOneThing, debtLedger,');
  let detected = 0;
  for (const mode of Object.keys(MODES)) {
    const b = inMode(mode, () => run({}));
    const m = inMode(mode, () => {
      try { return run({ writers: privately(WRITERS, mutantSource) }); } catch (e) { return { threw: String(e && e.message) }; }
    });
    if (Object.keys(b).some(k => b[k] !== m[k])) detected++;
  }
  assert.equal(detected, 3, 'RED CONTROL: the differential detects the removed writer in every one of the three modes');
});
