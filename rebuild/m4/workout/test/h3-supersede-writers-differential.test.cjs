'use strict';
/* =====================================================================
   H3 SUPERSEDES THE NATIVE-CARRIERS CARRIER `writers-differential`
   (gate writers-differential)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. That the adopted
   `rebuild/engine/writers.cjs` behaves identically to the frozen writer across
   THREE Date/trap modes — `NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap modes
   PASS;` — by running both over the same inputs with the clock frozen, the
   clock live, and `Date` trapped, and comparing outputs.

   WHY H3 CANNOT CARRY IT. H3 edits that very file (F-B, DECISIONS:142 (3)),
   and the gate reaches it through the same sha-pinned reconstruction the other
   four carriers use. BRIEF-H3-CLEAN-INIT v1.8 section 9 measures the chain.

   WHAT H3 PUTS IN ITS PLACE, HERE, EXECUTED, AND IT IS THE SAME DIFFERENTIAL.
   The ACCEPTED writers factory — the bytes at `sourceBase`, compiled privately
   and never entering require.cache — and H3's are composed on the SAME engine
   table and driven over the SAME battery of reads in the SAME three modes.
   The two must agree EXACTLY on every state that carries a finite trend, which
   is every state the frozen record contains; they must differ ONLY where the
   trend is absent, which is the one input the frozen record cannot hold and the
   defect H3 closes; and H3's own output must be identical across the three
   modes, so the branch introduces no clock dependence.

   RED-FIRST: cell 2 asserts the accepted writer returns a NON-FINITE trend on
   a clean-init first weigh-in and H3's returns the reading itself.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/H3.json'), 'utf8'));
const BASE = SPEC.sourceBase;
const WRITERS = 'rebuild/engine/writers.cjs';
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const { createBrowserEngine } = require('../../../m3/w7-preview/browser-engine.cjs');
const { createCleanInitState } = require('../athlete-state.cjs');

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
const acceptedWriters = privately(WRITERS, blob(WRITERS));
const ourWriters = require('../../../engine/writers.cjs');

const DAY = '2026-09-07';
const refusingIds = Object.freeze({ next: () => { throw new Error('IDS_UNAVAILABLE'); }, fresh: () => { throw new Error('IDS_UNAVAILABLE'); } });
function engineOf(factory, clock) {
  const E = createBrowserEngine({ clock });
  Object.assign(E, factory(E, { clock, ids: refusingIds }));
  assert.equal(typeof E.applyRead, 'function', 'the composition produced applyRead');
  return E;
}
const SETUP = Object.freeze({
  athlete_label: 'synthetic H3 differential athlete',
  split: { from: DAY, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'U', 5: 'REST', 6: 'L' } },
  exercises: [
    { id: 'db-bench', n: 'Dumbbell bench press', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40] },
    { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 12, inc: 10, steps: [90, 100, 110, 120] }],
  priority_muscles: ['chest'],
});
const clean = () => JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
const withTrend = t => { const s = clean(); s.trend = t; return s; };

/* THE BATTERY. Every row is one applyRead call; `trend` is what the state
   carries BEFORE it. The rows with a finite trend are every shape the frozen
   record contains; the two with none are the defect. */
const ROWS = [
  { name: 'finite trend, in window', state: () => withTrend(186.0), args: [DAY, 186.4, { hour: 8 }] },
  { name: 'finite trend, spike above the clamp', state: () => withTrend(180.0), args: [DAY, 186.4, { hour: 8 }] },
  { name: 'finite trend, spike below the clamp', state: () => withTrend(192.0), args: [DAY, 186.4, { hour: 8 }] },
  { name: 'finite trend, late read', state: () => withTrend(186.0), args: [DAY, 186.4, { hour: 23 }] },
  { name: 'finite trend, equal reading', state: () => withTrend(186.4), args: [DAY, 186.4, { hour: 8 }] },
  { name: 'ABSENT trend, in window', state: clean, args: [DAY, 186.4, { hour: 8 }], first: true },
  { name: 'ABSENT trend, late read', state: clean, args: [DAY, 186.4, { hour: 23 }], first: true },
];
/* THE THREE MODES, exactly the gate's own three. */
const NativeDate = Date;
const MODES = {
  frozen: () => { globalThis.Date = class extends NativeDate { constructor(...a) { super(...(a.length ? a : [1788451200000])); } static now() { return 1788451200000; } }; },
  live: () => { globalThis.Date = NativeDate; },
  trap: () => {
    globalThis.Date = class extends NativeDate {
      constructor(...a) { if (!a.length) throw new Error('WRITERS_READ_THE_WALL_CLOCK'); super(...a); }
      static now() { throw new Error('WRITERS_READ_THE_WALL_CLOCK'); }
    };
  },
};
const clockFor = () => ({ today: () => DAY, nowISO: () => DAY + 'T08:00:00.000Z' });
function run(factory, row) {
  const E = engineOf(factory, clockFor());
  const out = E.applyRead(row.state(), ...row.args);
  return { trend: out.trend, reads: out.reads, pt: (out.reads[out.reads.length - 1] || {}).pt,
    note: (out.reads[out.reads.length - 1] || {}).note, sealed: (out.reads[out.reads.length - 1] || {}).sealed };
}
function inMode(mode, fn) {
  MODES[mode]();
  try { return fn(); } finally { globalThis.Date = NativeDate; }
}

test('H3/SUP-8 - writers-differential: 3/3 Date/trap modes - the accepted writer and H3\'s agree on EVERY state carrying a finite trend', () => {
  let compared = 0;
  for (const mode of Object.keys(MODES))
    for (const row of ROWS.filter(r => !r.first)) {
      const a = inMode(mode, () => run(acceptedWriters, row));
      const b = inMode(mode, () => run(ourWriters, row));
      assert.deepEqual(b, a, mode + ' / ' + row.name + ': H3 changes nothing for a state with a trend');
      compared++;
    }
  assert.equal(compared, 15, 'five trend-carrying states across three modes, all compared');
});

test('H3/SUP-9 - writers-differential: RED-FIRST - they differ ONLY where the trend is absent, and only as declared', () => {
  for (const mode of Object.keys(MODES))
    for (const row of ROWS.filter(r => r.first)) {
      const a = inMode(mode, () => run(acceptedWriters, row));
      const b = inMode(mode, () => run(ourWriters, row));
      /* RED on the accepted bytes: the trend is not a number at all. */
      assert.equal(Number.isFinite(a.trend), false, mode + ' / ' + row.name + ': the ACCEPTED writer leaves no finite trend');
      assert.notDeepEqual(b, a, 'and H3 differs here, which is the whole of F-B');
      if (row.args[2].hour === 8) {
        assert.equal(b.trend, row.args[1], 'in window, the seed is the READING ITSELF, verbatim');
        assert.equal(b.pt, null, 'and the prior trend is explicitly null, never a dropped member');
      } else {
        assert.equal(Number.isFinite(b.trend), false,
          'DECISIONS:146 (3) OPTION B: a set-aside first read seeds nothing, for a new athlete exactly as for an old one');
        assert.equal(b.note, a.note, 'and the note the athlete reads is the accepted writer\'s own, unchanged');
      }
    }
});

test('H3/SUP-10 - writers-differential: H3\'s own output is identical across the three modes, so the branch reads no clock', () => {
  for (const row of ROWS) {
    const seen = Object.keys(MODES).map(mode => JSON.stringify(inMode(mode, () => run(ourWriters, row))));
    assert.equal(new Set(seen).size, 1, row.name + ': the same answer frozen, live and trapped');
  }
  /* And the declared branch is the only place the file consults the trend's
     finiteness, so there is one gate and not two. */
  const src = fs.readFileSync(path.join(REPO, WRITERS), 'utf8');
  assert.equal(src.split('!Number.isFinite(s.trend)').length - 1, 1, 'exactly one `first` binding in the whole file');
  /* Scoped to applyRead's own body, because `first` is also the name of an
     unrelated local elsewhere in this file (a rep count, and a sweep flag) —
     said out loud so the count below is not mistaken for a file-wide one. */
  const body = src.slice(src.indexOf('function applyRead('), src.indexOf('function proteinTargetForRegime('));
  assert(body.includes('const first = !Number.isFinite(s.trend);'), 'the declaration is inside applyRead');
  assert.equal(body.split('first ?').length - 1, 3, 'three ternaries consult it');
  assert.equal(body.split('!first').length - 1, 1, 'and the spike guard consults it negated, once');
  assert(body.includes('const spike = !first && Math.abs(dRaw) > 1.5;'), 'that guard, verbatim');
  /* Four consumers, no fifth: every line of applyRead that names the binding as
     CODE is one of the four, the rest of the occurrences being the block comment
     that explains them. */
  const code = body.split('\n').map(l => l.trim())
    .filter(l => /\bfirst\b/.test(l) && (l.startsWith('const ') || l.startsWith('if (')) && l.endsWith(';'));
  assert.equal(code.length, 5, 'five code lines name it - the declaration and its four consumers, and no sixth: '
    + code.map(l => l.slice(0, 44)).join(' | '));
});
