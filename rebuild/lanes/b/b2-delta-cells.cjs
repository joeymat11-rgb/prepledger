'use strict';
/* EARNED — LANE B · PACKAGE B2 — DELTA CELLS (post-review r1)
 *
 * Witness-style cells for the delta sites the accepted-brief text does NOT
 * enumerate. Unlike rebuild/engine/test/defect-witnesses*.cjs these are NOT
 * frozen witnesses: they are lane-B's own pins, they live in lane B's folder
 * (rebuild/lanes/b/*, LANES.md), and they pin BOTH sides — the pre-image
 * behaviour and the B2 behaviour — so the file reads as a before/after record
 * rather than a one-sided expectation.
 *
 * The side is detected from the engine under test, never passed in:
 *   BASE       = pre-image bytes (D2 not repaired)
 *   CANDIDATE  = B2 bytes
 * and, independently, whether the PM-optional Q2 hunk at volume.cjs:159 is in.
 *
 * usage: node rebuild/lanes/b/b2-delta-cells.cjs [engineDir]
 *        engineDir defaults to <repo>/rebuild/engine
 * exit 0 = every cell holds for the detected side; exit 1 = a cell moved.
 */
process.env.TZ = process.env.TZ || 'America/New_York';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ENGINE = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', '..', 'engine');
const { createEngine } = require(path.join(ENGINE, 'index.cjs'));
const T = createEngine({ clock: { today: () => '2026-09-03' } }).__test;

const lift = (x = {}) => ({ id: 'press', n: 'Press', w: 100, inc: 5, sets: 2, hi: 10,
  last: [8, 7], setup: 'known', day: 'U', mg: 'chest', ...x });
const J = (v) => JSON.stringify(v);

/* ---- side detection -------------------------------------------------- */
const SIDE = T._bornValid(lift({ sets: -1 })) ? 'BASE' : 'CANDIDATE';

function q2Fixture() {                       /* the reviewer's r1 B-1 fixture */
  const feed = [];
  for (let i = 0; i < 95; i++) feed.push({ d: '2026-09-01', t: 'NOTE ' + i });
  feed.push({ d: '2026-09-01', t: 'VOLUME +1 — CHEST via Press incline (now 3 sets)' });
  return { exercises: [lift({ id: 'press', n: 'Press', sets: 3 }), lift({ id: 'inc', n: 'Press incline', sets: 3 })],
    feed, adjustments: [], sessionLog: {} };
}
const q2Seen = T.structuralMovesThisWeek(q2Fixture()).sets.map((m) => m.exId);
const Q2 = SIDE === 'BASE' ? 'n/a (D18 not in)' : (J(q2Seen) === J(['inc']) ? 'APPLIED' : 'NOT APPLIED');

let cells = 0, failed = 0;
function cell(id, run) {
  cells++;
  try { const detail = run(); console.log('CELL HOLDS  ' + id + (detail === undefined ? '' : '  ' + J(detail))); }
  catch (e) { failed++; console.log('CELL MOVED  ' + id + '  ' + e.message); }
}
const pick = (m) => { if (!(SIDE in m)) throw new Error('no expectation pinned for side ' + SIDE); return m[SIDE]; };

console.log('B2 DELTA CELLS — engine=' + ENGINE);
console.log('SIDE ' + SIDE + ' · Q2 convention at volume.cjs:159 ' + Q2);
console.log('');

/* ---- DELTA 1 --------------------------------------------------------- *
 * migrate.cjs:1629 — the THIRD _bornValid consumer. migrate.cjs is B3's file
 * and B2 does not edit a byte of it; the delta arrives through plan.cjs's
 * repaired predicate. patchV51 ("the split patch") judges a PRE-EXISTING
 * record wearing a new id with `const wasValid = bornValid(have)`: invalid
 * => quarantine AS BROUGHT, no fill, and put() returns false so no seams,
 * no insertion markers and no FRESH BASELINE receipts fire.                */
function splitPatchFly(bad) {
  const s = JSON.parse(JSON.stringify(T.migrate(null)));
  s.v = 50;                                  /* one below patchV51, so the split patch replays */
  const i = s.exercises.findIndex((e) => e.id === 'fly');
  s.exercises[i] = Object.assign({ id: 'fly', mg: 'chest', n: 'Machine fly', day: 'U', setup: 'brought', hi: 20 }, bad);
  const out = T.migrate(s);
  const f = (out.exercises || []).find((e) => e.id === 'fly');
  return { quarantined: (f && f.quarantined) || null, sets: f && f.sets, filled: ('w' in f) && ('inc' in f) && ('setsAt' in f) };
}
cell('B2-DELTA-1a  migrate.cjs:1629 (patchV51 put) — an impossible pre-existing record', () => {
  const got = splitPatchFly({ sets: -1 });
  assert.deepEqual(got, pick({
    BASE:      { quarantined: null, sets: -1, filled: true },
    CANDIDATE: { quarantined: 'invalid:2026-08-12', sets: -1, filled: false },
  }));
  return got;
});
cell('B2-DELTA-1b  migrate.cjs:1629 — the same for sets 0, 3.5 and hi 0', () => {
  const got = [{ sets: 0 }, { sets: 3.5 }, { sets: 2, hi: 0 }].map((b) => splitPatchFly(b).quarantined);
  assert.deepEqual(got, pick({
    BASE:      [null, null, null],
    CANDIDATE: ['invalid:2026-08-12', 'invalid:2026-08-12', 'invalid:2026-08-12'],
  }));
  return got;
});
cell('B2-DELTA-1c  migrate.cjs:1629 — NEGATIVE CONTROL: a valid record is untouched on both sides', () => {
  const got = splitPatchFly({ sets: 2, hi: 20 });
  assert.deepEqual(got, { quarantined: null, sets: 2, filled: true });
  return got;
});

/* ---- DELTA 2 --------------------------------------------------------- *
 * targetsFor on a STILL-UNQUARANTINED impossible record that carries `first`.
 * The brief pins only the no-`first` shape (the RangeError, which survives);
 * the `first` shape returns a value and that value MOVES.                  */
cell('B2-DELTA-2a  targetsFor({sets:-1, first:[8]}) — an impossible record that carries first', () => {
  const got = T.targetsFor(lift({ sets: -1, last: null, first: [8] }), { sessionLog: {} });
  assert.deepEqual(got, pick({ BASE: [8], CANDIDATE: [] }));
  return got;
});
cell('B2-DELTA-2b  targetsFor({sets:-1}) with NO first — the RangeError survives on both sides', () => {
  assert.throws(() => T.targetsFor(lift({ sets: -1, last: null }), { sessionLog: {} }), RangeError);
  return 'RangeError';
});
cell('B2-DELTA-2c  NEGATIVE CONTROL: a possible record with first is unchanged by D2', () => {
  const got = T.targetsFor(lift({ sets: 3, last: null, first: [8, 7] }), { sessionLog: {} });
  assert.deepEqual(got, pick({ BASE: [8, 7], CANDIDATE: [8, 7, 6] }));   /* D1's own repair, already pinned by the law */
  return got;
});

/* ---- DELTA 3 --------------------------------------------------------- *
 * D3's C3 whole-name boundary against a lift whose OWN NAME contains the
 * producer's delimiter " (now ". A lift's own receipt must never be dropped. */
const NOW_NAME = 'Press (now heavy)';
const exNow = lift({ id: 'pnh', n: NOW_NAME });
const feedOwn = { feed: [{ d: '2026-09-01', t: 'VOLUME +1 — CHEST via ' + NOW_NAME + ' (now 3 sets)' }] };
cell('B2-DELTA-3a  a lift whose NAME contains " (now " keeps its OWN receipt', () => {
  const got = T._volDeltas(exNow, feedOwn);
  assert.deepEqual(got, [['2026-09-01', 1]]);            /* same on both sides — the r1 B-2 regression is closed */
  return got;
});
cell('B2-DELTA-3b  the SHORTER lift does not claim that receipt', () => {
  const got = T._volDeltas(lift(), feedOwn);
  assert.deepEqual(got, pick({ BASE: [['2026-09-01', 1]], CANDIDATE: [] }));
  return got;
});
cell('B2-DELTA-3c  the same lift with NO " (now " suffix on the row still keeps its receipt', () => {
  const got = T._volDeltas(exNow, { feed: [{ d: '2026-09-01', t: 'VOLUME +1 — CHEST via ' + NOW_NAME }] });
  assert.deepEqual(got, [['2026-09-01', 1]]);
  return got;
});
cell('B2-DELTA-3d  D3 proper — "Press" still refuses "Press incline"’s receipt', () => {
  const feedInc = { feed: [{ d: '2026-09-01', t: 'VOLUME +1 — CHEST via Press incline (now 3 sets)' }] };
  const mine = T._volDeltas(lift({ id: 'inc', n: 'Press incline' }), feedInc);
  const theirs = T._volDeltas(lift(), feedInc);
  assert.deepEqual(mine, [['2026-09-01', 1]]);
  assert.deepEqual(theirs, pick({ BASE: [['2026-09-01', 1]], CANDIDATE: [] }));
  return { incline: mine, press: theirs };
});
cell('B2-DELTA-3e  C2 stays terminal — exId decides, prose is not a fallback', () => {
  const match = T._volDeltas(lift(), { feed: [{ d: '2026-09-01', exId: 'press', t: 'VOLUME +1 — CHEST via Press incline (now 3 sets)' }] });
  const miss = T._volDeltas(lift(), { feed: [{ d: '2026-09-01', exId: 'inc', t: 'VOLUME +1 — CHEST via Press (now 3 sets)' }] });
  assert.deepEqual(match, [['2026-09-01', 1]]);
  assert.deepEqual(miss, pick({ BASE: [['2026-09-01', 1]], CANDIDATE: [] }));
  return { match, miss };
});
cell('B2-DELTA-3f  a row with no "via " (VOLUME PASSED) has no owner on either side', () => {
  const got = T._volDeltas(lift(), { feed: [{ d: '2026-09-01', t: 'VOLUME PASSED — nothing moved' }] });
  assert.deepEqual(got, []);
  return got;
});

/* ---- Q2 -------------------------------------------------------------- *
 * volume.cjs:159, the VOLUME-receipt owner lookup inside
 * structuralMovesThisWeek. D18 lifts the 80-row cap over it, so the
 * pre-existing unbounded-substring owner test turns a MISS into a
 * MISATTRIBUTION. PM-optional: the convention hunk lands in its own commit. */
const q2pick = (m) => {
  const key = SIDE === 'BASE' ? 'BASE' : 'CANDIDATE-' + Q2;
  if (!(key in m)) throw new Error('no expectation pinned for ' + key);
  return m[key];
};
cell('B2-Q2a  a current-week VOLUME receipt for "Press incline" PAST feed row 80', () => {
  assert.deepEqual(q2Seen, q2pick({
    'BASE': [],                                  /* the D18 defect: invisible past the cap */
    'CANDIDATE-NOT APPLIED': ['press'],           /* found — and charged to the WRONG lift */
    'CANDIDATE-APPLIED': ['inc'],                 /* found, and charged to its own lift */
  }));
  return q2Seen;
});
cell('B2-Q2b  the same receipt at feed row 0 — the owner bug is pre-existing at that site', () => {
  const s = q2Fixture(); s.feed = [s.feed[s.feed.length - 1]];
  const got = T.structuralMovesThisWeek(s).sets.map((m) => m.exId);
  assert.deepEqual(got, q2pick({ 'BASE': ['press'], 'CANDIDATE-NOT APPLIED': ['press'], 'CANDIDATE-APPLIED': ['inc'] }));
  return got;
});
cell('B2-Q2c  D18 still SEES the receipt past the cap (the repair itself is unharmed)', () => {
  const seen = q2Seen.length > 0;
  assert.equal(seen, SIDE !== 'BASE');
  return { seenPastRow80: seen };
});
cell('B2-Q2d  a lift whose NAME contains " (now " keeps its own structural move', () => {
  const s = { exercises: [lift({ id: 'press', n: 'Press', sets: 3 }), lift({ id: 'pnh', n: NOW_NAME, sets: 3 })],
    feed: [{ d: '2026-09-01', t: 'VOLUME +1 — CHEST via ' + NOW_NAME + ' (now 3 sets)' }], adjustments: [], sessionLog: {} };
  const got = T.structuralMovesThisWeek(s).sets.map((m) => m.exId);
  assert.deepEqual(got, q2pick({ 'BASE': ['press'], 'CANDIDATE-NOT APPLIED': ['press'], 'CANDIDATE-APPLIED': ['pnh'] }));
  return got;
});
cell('B2-Q2e  NEGATIVE CONTROL: VOLUME PASSED is still not a move, on every side', () => {
  const s = { exercises: [lift()], feed: [{ d: '2026-09-01', t: 'VOLUME PASSED — nothing moved' }], adjustments: [], sessionLog: {} };
  assert.equal(T.structuralMovesThisWeek(s).sets.length, 0);
  return 0;
});

/* ---- D7 -------------------------------------------------------------- *
 * The liftTrend half of D7 is INERT on every engine-internal call site: no
 * call inside rebuild/engine/ supplies opts.asOf. It is NOT inert to the D7
 * law or to the D7 witness, both of which call the exported liftTrend with an
 * explicit asOf. The progressAnchor half is live on every path.            */
function futureState() {
  const s = { exercises: [lift()], sessionLog: {}, sleep: { nights: [] } };
  for (const [i, d] of ['2026-09-10', '2026-09-11', '2026-09-12', '2026-09-13'].entries())
    s.sessionLog[d] = { entries: [{ id: 'press', w: 100, reps: [8 + i, 7 + i] }] };
  return s;
}
cell('B2-D7a  SOURCE: no call site inside the engine passes opts.asOf to liftTrend', () => {
  const sites = [];
  for (const f of fs.readdirSync(ENGINE).filter((x) => x.endsWith('.cjs'))) {
    const src = fs.readFileSync(path.join(ENGINE, f), 'utf8');
    const lines = src.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      let from = 0, at;
      while ((at = lines[i].indexOf('liftTrend(', from)) > -1) {
        from = at + 1;
        const before = lines[i].slice(0, at);
        if (/function\s+$/.test(before)) continue;                       /* the declaration */
        if (/E\.$/.test(before)) continue;                               /* the late-bound delegate forwards ...args */
        let depth = 0, end = -1;
        for (let k = at + 'liftTrend'.length; k < lines[i].length; k++) {
          if (lines[i][k] === '(') depth++;
          else if (lines[i][k] === ')') { depth--; if (depth === 0) { end = k; break; } }
        }
        const args = end < 0 ? lines[i].slice(at) : lines[i].slice(at + 'liftTrend'.length, end + 1);
        sites.push({ site: f + ':' + (i + 1), args: args.trim(), asOf: /asOf/.test(args) });
      }
    }
  }
  assert.ok(sites.length >= 6, 'expected the six known in-engine call sites, saw ' + sites.length);
  assert.deepEqual(sites.filter((x) => x.asOf), []);
  return sites.map((x) => x.site);
});
cell('B2-D7b  BEHAVIOUR: liftTrend with NO asOf is byte-identical across B2 — the narrowing', () => {
  const t = T.liftTrend(futureState(), 'press');
  assert.equal(t && t.n, 4);
  assert.equal(t && t.to, '2026-09-13');
  return { n: t.n, from: t.from, to: t.to };
});
cell('B2-D7c  BEHAVIOUR: liftTrend WITH asOf is the half D7’s law and witness exercise', () => {
  const got = T.liftTrend(futureState(), 'press', { asOf: '2026-09-03' });
  const later = T.liftTrend(futureState(), 'press', { asOf: '2026-09-14' });
  assert.equal(got === null, SIDE === 'CANDIDATE');
  if (SIDE === 'BASE') assert.equal(got.n, 4);
  assert.equal(later.n, 4);                                              /* a later as-of view still sees them */
  return { asOf0903: got === null ? null : got.n, asOf0914: later.n };
});
cell('B2-D7d  BEHAVIOUR: progressAnchor — the half that IS live on every in-engine path', () => {
  const got = T.progressAnchor(lift(), futureState());
  assert.deepEqual(got, pick({ BASE: [11, 10], CANDIDATE: [8, 7] }));
  return got;
});

console.log('');
console.log('B2 DELTA CELLS: ' + (cells - failed) + '/' + cells + ' HOLD · side ' + SIDE + ' · Q2 ' + Q2);
process.exit(failed ? 1 : 0);
