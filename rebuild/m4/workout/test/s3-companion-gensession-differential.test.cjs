'use strict';
/* =====================================================================
   M2-S3-COMPANION — genSession BYTE-IDENTICAL TO THE PARENT
   (rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md, B custody;
   CRITICAL-PATH-2026-09-15 section 4 P1)

   The proposal moves genSession's pool step into _sessionPool and adds a
   reader beside it, and promises that genSession itself answers exactly as
   before. This file holds that promise to the bytes: the PARENT's today.cjs
   (the sourceBase blob, `git show`, compiled in a private module that never
   enters require.cache) is composed over the same fifteen other engine
   modules as HEAD's, and the two engines are asked genSession and
   pickStructural on the ordinary and pending-hack-debut public fixtures, on
   the U day, the L day and two rest days, under the recorded fixture sleep,
   a short recorded night and no sleep at all. JSON.stringify of each answer
   must be byte-identical, and the whole card list is compared, not just ids.

   The parent engine is also asked for sessionMembership, to prove the
   differential is between an engine WITHOUT the reader and one WITH it.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S3.json'), 'utf8'));
const BASE = SPEC.sourceBase;
const TODAY = 'rebuild/engine/today.cjs';
const { createSyntheticState, SYNTHETIC_DAY, dayOffset } = require('../../../m3/w7-preview/fixtures.cjs');

/* rebuild/engine/index.cjs's own composition, restated with ONE substitution:
   the today factory is a parameter. The module list and order are read out
   of index.cjs's source so this file cannot drift from it. */
const indexSrc = fs.readFileSync(path.join(REPO, 'rebuild/engine/index.cjs'), 'utf8');
const ORDER = [...indexSrc.matchAll(/require\("\.\/([a-z-]+)\.cjs"\)/g)].map(m => m[1]);
assert.equal(ORDER.length, 16, 'sixteen engine modules');
assert(ORDER.includes('today') && ORDER.includes('merge'), 'today and merge are composed');
function compose(todayFactory, clock) {
  const E = {};
  const deps = { clock, ids: undefined, drafts: Object.freeze({ length: 0, key: () => null }) };
  for (const name of ORDER) {
    const factory = name === 'today' ? todayFactory : require('../../../engine/' + name + '.cjs');
    Object.assign(E, factory(E, deps));
  }
  return E;
}
function parentToday() {
  const src = cp.execFileSync('git', ['show', BASE + ':' + TODAY], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
  assert(!src.includes('sessionMembership'), 'the parent has no reader');
  assert(!src.includes('_sessionPool'), 'and no pool helper');
  const m = new Module(path.join(REPO, 'rebuild/engine/__s3_parent_today__.cjs'), module);
  m._compile(src, m.id);
  return m.exports;
}
const headToday = require('../../../engine/today.cjs');
const clockAt = day => ({ today: () => day, hour: () => 8, now: () => new Date(day + 'T13:00:00.000Z'), stamp: () => day + 'T13:00:00.000Z' });

function pendingHackDebut(shortSleep = false) {
  const s = createSyntheticState();
  const leg = s.exercises.find(e => e.id === 'demo-leg');
  leg.id = 'hack'; leg.n = 'SYNTHETIC hack squat'; leg.steps = [40, 45, 50]; leg.w = 40;
  for (const d of Object.keys(s.sessionLog)) for (const en of s.sessionLog[d].entries) if (en.id === 'demo-leg') en.id = 'hack';
  s.queue = [{ id: 'SYNTHETIC-hack-debut', kind: 'debut', exId: 'hack', newW: 45, done: false, state: 'READY', t: 'SYNTHETIC recorded debut' }];
  if (shortSleep) s.sleep.nights[s.sleep.nights.length - 1] = { ...s.sleep.nights[s.sleep.nights.length - 1], h: 4, bed: '02:00', wake: '06:00' };
  return s;
}
const FIXTURES = {
  'ordinary': () => createSyntheticState(),
  'ordinary, exOrder reversed': () => { const s = createSyntheticState(); s.exOrder = { U: ['demo-row', 'demo-press'], L: ['demo-curl', 'demo-leg'] }; return s; },
  'ordinary, one retired': () => { const s = createSyntheticState(); s.retirements = { 'demo-row': dayOffset(SYNTHETIC_DAY, -3) }; return s; },
  'pending-hack-debut': () => pendingHackDebut(false),
  'pending-hack-debut, short recorded night': () => pendingHackDebut(true),
  'pending-hack-debut, pendingThird': () => { const s = pendingHackDebut(false); s.exercises.find(e => e.id === 'hack').pendingThird = true; return s; },
};
const DAYS = [SYNTHETIC_DAY, dayOffset(SYNTHETIC_DAY, 1), dayOffset(SYNTHETIC_DAY, 2), dayOffset(SYNTHETIC_DAY, -1)];

test('S3/GD-1 - genSession and pickStructural are byte-identical to the parent on every fixture, day and sleep reading', () => {
  let compared = 0, sessions = 0, threw = 0;
  for (const [label, make] of Object.entries(FIXTURES)) {
    for (const day of DAYS) {
      const clock = clockAt(day);
      const head = compose(headToday, clock), parent = compose(parentToday(), clock);
      const s = make();
      const readings = { 'recorded fixture sleep': head.sleepInfo(s), 'no sleep': undefined, 'empty sleep': {} };
      for (const [reading, slp] of Object.entries(readings)) {
        const tag = label + ' / ' + day + ' / ' + reading;
        // A throw is an answer too (a queued debut with no sleep reading refuses in both):
        // the same message from both engines is the same behaviour, byte for byte.
        const ask = (E, fn) => { try { return { value: E[fn](structuredClone(s), day, slp) }; } catch (e) { return { threw: String(e && e.message) }; } };
        const a = ask(head, 'genSession'), b = ask(parent, 'genSession');
        assert.equal(JSON.stringify(a), JSON.stringify(b), 'genSession ' + tag);
        assert.deepEqual(a, b, 'genSession deepEqual ' + tag);
        const pa = ask(head, 'pickStructural'), pb = ask(parent, 'pickStructural');
        assert.equal(JSON.stringify(pa), JSON.stringify(pb), 'pickStructural ' + tag);
        compared++;
        if (a.value) sessions++;
        if (a.threw) threw++;
      }
    }
  }
  assert.equal(compared, Object.keys(FIXTURES).length * DAYS.length * 3, 'every cell compared');
  assert(sessions >= Object.keys(FIXTURES).length * 2 * 2, 'the training days really produced sessions, so nulls were not compared to nulls only');
  assert(threw >= 1 && threw < compared / 4, 'a few cells refuse identically (queued debut, no sleep reading); most answer');
});

test('S3/GD-2 - the differential is between an engine WITHOUT the reader and one WITH it, over the same fifteen other modules', () => {
  const clock = clockAt(SYNTHETIC_DAY);
  const head = compose(headToday, clock), parent = compose(parentToday(), clock);
  assert.equal(typeof head.sessionMembership, 'function');
  assert.equal(parent.sessionMembership, undefined, 'the parent composes no reader');
  const s = pendingHackDebut();
  assert.deepEqual(head.sessionMembership(s, dayOffset(SYNTHETIC_DAY, 1)), { day: 'L', exercise_ids: ['hack', 'demo-curl'] });
  // The member lists differ by exactly the one added name.
  const only = Object.keys(head).filter(k => !(k in parent));
  assert.deepEqual(only, ['sessionMembership']);
  assert.deepEqual(Object.keys(parent).filter(k => !(k in head)), []);
});

test('S3/GD-3 - the HEAD today.cjs is the sourceBase today.cjs plus the declared hunk and nothing else (inverse construction)', () => {
  const parentSrc = cp.execFileSync('git', ['show', BASE + ':' + TODAY], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
  const headSrc = fs.readFileSync(path.join(REPO, TODAY), 'utf8');
  // Remove the reader and the helper from HEAD and put the inlined pool back: the result
  // must be the parent byte for byte. The three `after` texts are HEAD's own bytes.
  const helperStart = headSrc.indexOf('/* M2-S3-COMPANION (rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md, B custody) — THE\n   SESSION POOL');
  const helperEnd = headSrc.indexOf('// Copied from frozen src/app.jsx @ fe516c1:1481-1595.');
  assert(helperStart > 0 && helperEnd > helperStart, 'the helper and reader stand immediately before genSession');
  let back = headSrc.slice(0, helperStart) + headSrc.slice(helperEnd);
  const inlined = '  const ord = (s.exOrder && s.exOrder[dt]) || [];\n' +
    '  const pool = s.exercises.filter((e) => e.day === dt && exActive(s, e.id)).sort((a, b) => {   /* SPLIT item d — retired lifts leave the day pool; the raw record is never filtered */\n' +
    '    const ia = ord.indexOf(a.id), ib = ord.indexOf(b.id);\n' +
    '    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);\n' +
    '  });\n';
  assert.equal(back.split('  const pool = _sessionPool(s, dt);\n').length, 2, 'one call site');
  back = back.replace('  const pool = _sessionPool(s, dt);\n', inlined);
  assert.equal(back.split('return { pickStructural, genSession, sessionMembership, nowFocus,').length, 2, 'one export site');
  back = back.replace('return { pickStructural, genSession, sessionMembership, nowFocus,', 'return { pickStructural, genSession, nowFocus,');
  assert.equal(back, parentSrc, 'HEAD today.cjs minus the declared hunk is the parent, byte for byte');
});
