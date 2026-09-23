'use strict';
/* PROPOSED-PICK REPAIR, the red-first cell (rows EPP-R1 to EPP-R8).
   Specification: rebuild/coach/EARN-ON-PHONE-OPTIONS-CHECK.md at a731f483, section 8.
   Owner's word for the two engine clauses: DECISIONS:631 answer 1a.
   EVERY NUMBER IN THIS FILE IS INVENTED. One synthetic lift "press": working load 100,
   rung ladder 95/100/105/110/115, 2 sets, rep window 8 to 10, per-set vector [100,100].
   Every row stands on the PRODUCER: the queue pair is minted by the engine's own
   completeSession (earnWalk) in the engine's own order, never hand-built. The only
   reordering is EPP-R6, which swaps the two minted entries on purpose as a control.
   Nothing here writes into the tree: the half-repair engines of EPP-R7 are compiled in
   memory from the repaired files with one clause reverted by an exact-match replace. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const ENGINE = path.join(__dirname, '..');
const REBUILD = path.join(ENGINE, '..');
const TODAY = path.join(ENGINE, 'today.cjs');
const WRITERS = path.join(ENGINE, 'writers.cjs');
const INDEX = path.join(ENGINE, 'index.cjs');

/* The two clauses, exact text, as the check's section 8 writes them. */
const OLD_T = 'const q = isDebutNow ? s.queue.find((x) => x.exId === e.id && !x.done && (x.kind === "debut" || x.kind === "unlock")) : null;';
const NEW_T = 'const q = isDebutNow ? s.queue.find((x) => x.exId === e.id && !x.done && x.state !== "PROPOSED" && (x.kind === "debut" || x.kind === "unlock")) : null;';
const OLD_W = 'const q = qFind((x) => x.exId === ex.id && !x.done && (x.kind === "debut" || x.kind === "unlock"));';
const NEW_W = 'const q = qFind((x) => x.exId === ex.id && !x.done && x.state !== "PROPOSED" && (x.kind === "debut" || x.kind === "unlock"));';

const clock = { today: () => '2026-09-03', nowISO: () => '2026-09-03T12:00:00.000Z',
  nowMs: () => Date.parse('2026-09-03T12:00:00.000Z'), hour: () => 8, dow: () => 4, tz: 'America/New_York' };
function mkIds() { let n = 0; return { next: () => 'id_' + (++n), fresh: (p) => (p || 'f') + '_' + (++n) }; }
const slp = { clean: true, last: { h: 8 }, mean3: 8, mean: 8 };
const clone = (x) => JSON.parse(JSON.stringify(x));
const count = (hay, needle) => hay.split(needle).length - 1;

function baseState() {
  return { v: 60, trend: 180, reads: [], weekly: [], dailyLogs: {}, sessionLog: {},
    sleep: { nights: [], needed: 3, debts: [], target: 8 },
    exercises: [{ id: 'press', n: 'Synthetic press', mg: 'chest', day: 'U', w: 100, inc: 5,
      steps: [95, 100, 105, 110, 115], sets: 2, hi: 10, lo: 8, wSets: [100, 100],
      setup: 'Synthetic setup', renames: [], forks: [] }],
    queue: [], feed: [], forecasts: [], adjustments: [], proposals: [], suggestionLog: [],
    targets: {}, learned: { tdee: [], anchors: [] }, plan: { goals: [], ifthen: [], setAt: {}, phaseLog: [] },
    exOrder: { U: ['press'], L: [] }, planGen: 52, retirements: {}, insertions: {},
    waist: [], photos: [], events: [], trials: [], agentProposals: [],
    blackout: { until: '2026-08-01' }, model: { lean: 150, drip: 0, src: 'DEXA', anchorISO: '2026-01-01' },
    split: null, labSeen: {}, dayCtx: {}, reclassLog: [] };
}
/* A top-of-window session: reps at the top (10,10), honest opener 2, terminal reserve 3. */
const top = () => [{ id: 'press', n: 'Synthetic press', w: 100, tgt: [10, 10], reps: [10, 10],
  isDebutNow: false, rir: 2, rirEnd: 3, rirSets: [2, 3] }];
/* A session finished at exactly what the card prescribed. */
const land = (c) => [{ id: 'press', n: 'Synthetic press', w: c.w, tgt: c.tgt, reps: [8, 8],
  isDebutNow: c.isDebutNow, rir: 2, rirEnd: 1, rirSets: [2, 1] }];
const live = (s) => s.queue.filter((q) => !q.done).map((q) => q.state + ' ' + q.newW);

/* ---- engines ---------------------------------------------------------------------- */
/* The tree's engine, exactly as shipped at this head. */
const { createEngine } = require(INDEX);
const treeEngine = () => createEngine({ clock, ids: mkIds() });
/* The two shipped read compositions that expose genSession (both load the tree's files). */
const nativeRt = () => require(path.join(REBUILD, 'm4', 'workout', 'engine-runtime.cjs')).createEngineRuntime({ clock, ids: mkIds() });
const hostRt = () => require(path.join(REBUILD, 'm3', 'w6', 'host', 'engine-runtime-host.cjs')).createEngineRuntime({ clock, ids: mkIds() });

/* Compile a module from TEXT at its real filename, in memory, with some requires overridden. */
function compileInMemory(file, src, overrides) {
  const m = new Module(file, module);
  m.filename = file;
  m.paths = Module._nodeModulePaths(path.dirname(file));
  const realRequire = m.require.bind(m);
  m.require = (id) => (Object.prototype.hasOwnProperty.call(overrides, id) ? overrides[id] : realRequire(id));
  m._compile(src, file);
  return m.exports;
}
/* Exact-match replace that refuses unless the needle occurs exactly once. */
function replaceOnce(src, from, to, label) {
  const n = count(src, from);
  if (n !== 1) return { ok: false, why: label + ': the clause to revert matched ' + n + ' times (expected exactly 1)' };
  return { ok: true, src: src.replace(from, () => to) };
}
/* A half repair: the tree's (repaired) files with ONE clause reverted, loaded in memory. */
function halfEngine(revert) {
  let t = fs.readFileSync(TODAY, 'utf8');
  let w = fs.readFileSync(WRITERS, 'utf8');
  if (revert === 'today') {
    const r = replaceOnce(t, NEW_T, OLD_T, 'today.cjs'); if (!r.ok) return r; t = r.src;
  } else if (revert === 'writers') {
    const r = replaceOnce(w, NEW_W, OLD_W, 'writers.cjs'); if (!r.ok) return r; w = r.src;
  } else throw new Error('unknown half ' + revert);
  const overrides = {
    './today.cjs': compileInMemory(TODAY, t, {}),
    './writers.cjs': compileInMemory(WRITERS, w, {}),
  };
  const idx = compileInMemory(INDEX, fs.readFileSync(INDEX, 'utf8'), overrides);
  return { ok: true, engine: idx.createEngine({ clock, ids: mkIds() }) };
}

/* ---- the producer ----------------------------------------------------------------- */
/* Two top-of-window sessions through the engine's own completeSession. */
function mint(E) {
  let s = E.completeSession(baseState(), '2026-08-27', top(), slp, {}).s;
  s = E.completeSession(s, '2026-09-03', top(), slp, {}).s;
  return s;
}
const NEXT_U = '2026-09-07';
const AFTER_U = '2026-09-10';
const cardOf = (rt, s, iso) => rt.genSession(clone(s), iso, slp).ex.find((e) => e.id === 'press');
/* Card, then finish that session at the card's load, through the same engine. */
function cardThenLand(E, s, iso) {
  const c = cardOf(E, s, iso);
  const after = E.completeSession(clone(s), iso, land(c), slp, {}).s;
  const ex = after.exercises.find((e) => e.id === 'press');
  return { card: c, after, w: ex.w, wSets: ex.wSets };
}

/* ---- the rows --------------------------------------------------------------------- */
test('EPP-R1 PRODUCER-ORDER: completeSession twice at the top of the window, terminal reserve 3, laddered lift, mints PROPOSED before the classic DEBUT', () => {
  const s = mint(treeEngine());
  const press = s.queue.filter((q) => q.exId === 'press');
  assert.deepEqual(press.map((q) => [q.id, q.state, q.done, q.newW]), [
    ['q_press_105_2026-08-27_1s', 'SUPERSEDED', true, 105],
    ['q_press_110_2026-09-03_2r', 'PROPOSED', false, 110],
    ['q_press_105_2026-09-03', 'DEBUT', false, 105],
  ]);
  assert.deepEqual(live(s), ['PROPOSED 110', 'DEBUT 105']);
  assert.deepEqual(press[1].newWSets, [110, 110]);
  assert.deepEqual(press[2].newWSets, [105, 105]);
  assert.equal(s.exercises[0].w, 100, 'the earn itself stores nothing');
});

test('EPP-R2 CARD-TAKES-THE-SELECTED-ENTRY: the card load equals the newW of the entry pickStructural selected, on the engine and on both shipped read compositions', () =>
  rowR2(treeEngine(), { native: nativeRt(), host: hostRt() }));
/* D-EPP-4: rows R2, R3 and R4 are functions of the engine so that EPP-R9 can run the SAME
   bodies, with the same assertions, against the half-repair engines. */
function rowR2(E, compositions) {
  const s = mint(E);
  const picked = E.pickStructural(clone(s), NEXT_U, slp).main;
  assert.ok(picked, 'pickStructural selects an entry');
  assert.equal(picked.id, 'q_press_105_2026-09-03');
  assert.equal(picked.state, 'DEBUT');
  const got = { engine: cardOf(E, s, NEXT_U) };
  for (const [name, rt] of Object.entries(compositions)) got[name] = cardOf(rt, s, NEXT_U);
  for (const [name, c] of Object.entries(got)) {
    assert.equal(c.isDebutNow, true, name + ' isDebutNow');
    assert.equal(c.w, picked.newW, name + ' card load ' + c.w + ' against the selected entry ' + picked.newW);
  }
}

test('EPP-R3 NO-UNTAPPED-ENTRY-IS-EVER-ESTABLISHED: finishing at the card load marks no PROPOSED entry ESTABLISH and stores no PROPOSED load', () =>
  rowR3(treeEngine()));
function rowR3(E) {
  const s = mint(E);
  const proposedIds = s.queue.filter((q) => !q.done && q.state === 'PROPOSED').map((q) => q.id);
  assert.deepEqual(proposedIds, ['q_press_110_2026-09-03_2r']);
  const r = cardThenLand(E, s, NEXT_U);
  const byId = new Map(r.after.queue.map((q) => [q.id, q]));
  for (const id of proposedIds) {
    assert.equal(byId.get(id).state, 'PROPOSED', id + ' must still be PROPOSED (untapped), found ' + byId.get(id).state);
    assert.equal(byId.get(id).done, false, id + ' must still be open');
  }
  assert.deepEqual(r.after.queue.filter((q) => q.state === 'ESTABLISH').map((q) => q.id), ['q_press_105_2026-09-03']);
  assert.equal(r.w, 105, 'stored working weight');
  assert.deepEqual(r.wSets, [105, 105], 'stored per-set vector');
  assert.equal(r.card.w, r.w, 'card and record agree');
}

test('EPP-R4 NO-DOWN-PULL-AND-NO-DOUBLE-DEBUT: after the debut lands the next card is not below the stored load, and one earn establishes at most one debut', () =>
  rowR4(treeEngine()));
function rowR4(E) {
  const s = mint(E);
  const first = cardThenLand(E, s, NEXT_U);
  const second = cardThenLand(E, first.after, AFTER_U);
  assert.ok(second.card.w >= first.w, 'next card ' + second.card.w + ' is below the stored ' + first.w);
  const established = second.after.queue.filter((q) => q.exId === 'press' && q.state === 'ESTABLISH');
  assert.ok(established.length <= 1, 'one earn established ' + established.length + ' debuts: ' + established.map((q) => q.newW).join(','));
  assert.ok(second.w >= first.w, 'stored load walked back from ' + first.w + ' to ' + second.w);
}

test('EPP-R5 TAP CONTROL: after takeProposedDebut the card, the stored load and the open queue agree at the tapped load', () => {
  const E = treeEngine();
  const s = mint(E);
  const tapped = E.takeProposedDebut(clone(s), 'q_press_110_2026-09-03_2r');
  assert.deepEqual(live(tapped), ['DEBUT 110']);
  for (const rt of [E, nativeRt(), hostRt()]) assert.equal(cardOf(rt, tapped, NEXT_U).w, 110);
  const r = cardThenLand(E, tapped, NEXT_U);
  assert.equal(r.card.w, 110);
  assert.equal(r.w, 110);
  assert.deepEqual(r.wSets, [110, 110]);
  assert.equal(r.after.queue.filter((q) => !q.done).length, 0, 'no open entry after the tapped debut lands');
  const next = cardOf(E, r.after, AFTER_U);
  assert.equal(next.w, 110);
  assert.equal(next.isDebutNow, false);
});

/* The engine as it stood before the repair, rebuilt in memory for EPP-R6's comparison:
   if the tree carries both repaired clauses, both are reverted by exact-match replace;
   if the tree carries neither (the red commit), the tree itself is that engine. */
function unrepairedEngine() {
  let t = fs.readFileSync(TODAY, 'utf8');
  let w = fs.readFileSync(WRITERS, 'utf8');
  const repaired = count(t, NEW_T) === 1 && count(w, NEW_W) === 1;
  const unrepaired = count(t, OLD_T) === 1 && count(w, OLD_W) === 1 && count(t, NEW_T) === 0 && count(w, NEW_W) === 0;
  assert.ok(repaired || unrepaired, 'the tree carries exactly one of the two states of both clauses');
  if (repaired) {
    t = replaceOnce(t, NEW_T, OLD_T, 'today.cjs').src;
    w = replaceOnce(w, NEW_W, OLD_W, 'writers.cjs').src;
  }
  const overrides = { './today.cjs': compileInMemory(TODAY, t, {}), './writers.cjs': compileInMemory(WRITERS, w, {}) };
  return { repaired, engine: compileInMemory(INDEX, fs.readFileSync(INDEX, 'utf8'), overrides).createEngine({ clock, ids: mkIds() }) };
}
/* The minted pair with its two live entries swapped: classic first, the order the engine never mints. */
function reversed(s) {
  const r = clone(s);
  const iP = r.queue.findIndex((q) => !q.done && q.state === 'PROPOSED');
  const iD = r.queue.findIndex((q) => !q.done && q.state === 'DEBUT');
  const t0 = r.queue[iP]; r.queue[iP] = r.queue[iD]; r.queue[iD] = t0;
  return r;
}
function reversedFlow(E) {
  const s = reversed(mint(E));
  const r = cardThenLand(E, s, NEXT_U);
  const next = cardOf(E, r.after, AFTER_U);
  return { card: r.card, stored: { w: r.w, wSets: r.wSets }, queue: r.after.queue, next: { w: next.w, isDebutNow: next.isDebutNow } };
}

test('EPP-R6 REVERSED-ORDER CONTROL: with the classic entry first, card, store and standing offer are unchanged by the repair', () => {
  const now = reversedFlow(treeEngine());
  assert.equal(now.card.w, 105);
  assert.deepEqual(now.stored, { w: 105, wSets: [105, 105] });
  assert.deepEqual(now.queue.filter((q) => !q.done).map((q) => [q.id, q.state, q.newW]), [['q_press_110_2026-09-03_2r', 'PROPOSED', 110]]);
  assert.deepEqual(now.next, { w: 105, isDebutNow: false });
  const base = unrepairedEngine();
  const was = reversedFlow(base.engine);
  assert.equal(JSON.stringify(now), JSON.stringify(was), 'byte-identical to the unrepaired engine (' + (base.repaired ? 'both clauses reverted in memory' : 'the tree is unrepaired') + ')');
});

test('EPP-R7 HALF-REPAIR CONTROL: today.cjs alone and writers.cjs alone each leave card and record disagreeing', () => {
  const halves = { 'today.cjs only (writers.cjs clause reverted)': 'writers', 'writers.cjs only (today.cjs clause reverted)': 'today' };
  const seen = {};
  for (const [name, revert] of Object.entries(halves)) {
    const h = halfEngine(revert);
    if (!h.ok) assert.fail('EPP-R7 ' + name + ': NOTHING TO REVERT, the repair is not in the tree (' + h.why + ')');
    const r = cardThenLand(h.engine, mint(h.engine), NEXT_U);
    seen[name] = { card: r.card.w, stored: r.w };
    assert.notEqual(r.card.w, r.w, name + ': card ' + r.card.w + ' and stored ' + r.w + ' agree, so this half is not the harm the row names');
  }
  assert.deepEqual(seen, {
    'today.cjs only (writers.cjs clause reverted)': { card: 105, stored: 110 },
    'writers.cjs only (today.cjs clause reverted)': { card: 110, stored: 105 },
  });
});

test('EPP-R8 IMPORT MERGE ROAD: the shipped import preparation (replay-core.cjs into merge.cjs into migrate.cjs) mints the same pair, and card and record agree at the one-rung load', () => {
  const { createImportPreparation } = require(path.join(REBUILD, 'm4', 'import', 'prepare.cjs'));
  const E = treeEngine();
  /* Two invented replicas, each with ONE top-of-window sighting and no standing offer for the lift. */
  const strip = (x) => { const c = clone(x); c.queue = []; return c; };
  const A = strip(E.completeSession(baseState(), '2026-08-27', top(), slp, {}).s);
  const B = strip(E.completeSession(baseState(), '2026-08-31', top(), slp, {}).s);
  const prep = createImportPreparation({ engine: E, parseStrictJson: (x) => JSON.parse(Buffer.from(x).toString('utf8')) })
    .prepare(Buffer.from(JSON.stringify(A)), { localBytes: Buffer.from(JSON.stringify(B)) });
  const s = prep.candidateState();
  assert.deepEqual(live(s), ['PROPOSED 110', 'DEBUT 105'], 'the merge itself mints the pair, PROPOSED first');
  const r = cardThenLand(E, s, NEXT_U);
  assert.equal(r.card.w, 105, 'card');
  assert.equal(r.w, 105, 'stored working weight');
  assert.equal(r.card.w, r.w, 'card and record agree');
  assert.ok(r.after.queue.some((q) => !q.done && q.state === 'PROPOSED' && q.newW === 110), 'the untapped offer still stands');
});

/* D-EPP-4, THE SELF-SENSITIVITY GUARD (REVIEW-EPP-l1 f0a5eb1a section 5; Astra 901ee41e section 4;
   paid by S10, the package that wires this cell, DECISIONS:780 Q3 and :792). The seven semantic
   mutants were killed, but deleting a row's MAIN assertion stayed green: the sensitivity pass
   (EPP-D4-SENSITIVITY-REPORT.md) measured that the today.cjs clause's behavioural guard rests on
   two single assertions, R2's card check and R3's card/record check. This row runs the SAME row
   bodies against the two half-repair engines EPP-R7 already builds in memory, and requires each
   to fail AT THE NAMED ASSERTION: today reverted (RT) fails R2's card check and R3's card/record
   check; writers reverted (RW) fails R3's untapped-entry check and R4's no-down-pull check. So
   deleting any of those assertions turns THIS row red. Nothing is written into the tree. */
test('EPP-R9 SELF-SENSITIVITY (D-EPP-4): each half-repair engine fails R2/R3 (today reverted) and R3/R4 (writers reverted) at the named assertion', () => {
  const RT = halfEngine('today'), RW = halfEngine('writers');
  if (!RT.ok) assert.fail('EPP-R9: NOTHING TO REVERT in today.cjs (' + RT.why + ')');
  if (!RW.ok) assert.fail('EPP-R9: NOTHING TO REVERT in writers.cjs (' + RW.why + ')');
  const failsAt = (run, pattern, label) => assert.throws(run,
    (e) => e instanceof assert.AssertionError && pattern.test(String(e.message)),
    label + ': the row must fail at this assertion; if it passes, or fails elsewhere, the assertion that guards the clause is gone');
  failsAt(() => rowR2(RT.engine, {}), /^engine card load 110 against the selected entry 105/, 'RT x R2 card check');
  failsAt(() => rowR3(RT.engine), /^card and record agree/, 'RT x R3 card/record check');
  failsAt(() => rowR3(RW.engine), /^q_press_110_2026-09-03_2r must still be PROPOSED \(untapped\), found ESTABLISH/, 'RW x R3 untapped-entry check');
  failsAt(() => rowR4(RW.engine), /^next card 105 is below the stored 110/, 'RW x R4 no-down-pull check');
});
