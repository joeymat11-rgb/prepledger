'use strict';

// Independent reviewer annex for cc6a1315003adc7f3f96d635980cfdf32b5a7a74.
// Authored statically; the author did not execute it or edit candidate runtime.
// Root supplies the real b1b2-public-engine.cjs helper after independently
// verifying its complete copied public closure. This file performs no fs,
// process, network, loader, runtime-patch, seed, history or private operation.
const assert = require('node:assert/strict');

const CANDIDATE = 'cc6a1315003adc7f3f96d635980cfdf32b5a7a74';
const BASE = '100820aa47a4f8729642033499eaec0f0ee282e1';
const QUERY = '2026-09-03';
const FUTURE = '2026-09-10';
const clone = value => JSON.parse(JSON.stringify(value));
const lift = extra => ({
  id: 'review-lift', n: 'Review press', w: 100, inc: 5, sets: 2, hi: 15,
  last: null, first: [8, 7], setup: 'invented review setup', day: 'U', mg: 'chest',
  ...extra,
});
function engine(H, day) {
  assert.equal(typeof H.createEngine, 'function', 'real public helper required');
  assert.equal(typeof H.syntheticState, 'function', 'explicit invented fixture required');
  return H.createEngine({ clock: H.clockAt(day) }).__test;
}
function state(H, exercises) {
  const s = H.syntheticState();
  s.exercises = exercises;
  s.sessionLog = {};
  s.feed = [];
  s.adjustments = [];
  s.retirements = {};
  return s;
}

function q2Fixture(H, prefixNotes) {
  // Distinct groups make wrong owner selection visible at the budget output.
  // Neither invented id has an INDIRECT entry.
  const s = state(H, [
    lift({ id: 'review-short', n: 'Press', mg: 'back', sets: 3 }),
    lift({ id: 'review-incline', n: 'Press incline', mg: 'chest', sets: 3 }),
  ]);
  for (let i = 0; i < prefixNotes; i++) s.feed.push({ d: '2026-09-01', t: 'REVIEW NOTE ' + i });
  s.feed.push({ d: '2026-09-01', t: 'VOLUME +1 — CHEST via Press incline (now 3 sets)' });
  return s;
}
function q2Read(T, s) {
  const before = clone(s);
  const got = T.structuralMovesThisWeek(s);
  assert.deepEqual(s, before, 'Q2 reader must not mutate the invented state');
  return { owners: got.sets.map(m => m.exId), mgsTouched: got.mgsTouched };
}
function observeQ2(H) {
  const T = engine(H, QUERY);
  return {
    atFront: q2Read(T, q2Fixture(H, 0)),
    pastDisplayPrefix: q2Read(T, q2Fixture(H, 95)),
  };
}
function runQ2(H) {
  // Fixed candidate obligations: no side or Q2 detection chooses an answer.
  // Deliberately intended to fail on the original substring lookup.
  const got = observeQ2(H);
  for (const [name, row] of Object.entries(got)) {
    assert.deepEqual(row.owners, ['review-incline'], 'Q2 FIXED OWNER: ' + name + ' must charge the whole-name owner');
    assert.deepEqual(row.mgsTouched, ['chest'], 'Q2 FIXED MUSCLE: ' + name + ' must charge chest, never the shorter back lift');
  }
  const T = engine(H, QUERY);
  for (const reversed of [false, true]) {
    const xs = [
      lift({ id: 'review-live', n: 'Bench', mg: 'chest', sets: 3 }),
      lift({ id: 'review-former', n: 'Row heavy', mg: 'back', sets: 3, renames: [{ prevN: 'Bench' }] }),
    ];
    const s = state(H, reversed ? xs.reverse() : xs);
    s.feed = [{ d: '2026-09-01', t: 'VOLUME +1 — CHEST via Bench (now 3 sets)' }];
    assert.deepEqual(q2Read(T, s), { owners: ['review-live'], mgsTouched: ['chest'] }, 'Q2 live name wins in both orders');
    s.feed[0].exId = 'review-former';
    assert.deepEqual(q2Read(T, s), { owners: ['review-former'], mgsTouched: ['back'] }, 'Q2 structured identity is terminal');
    s.feed[0].exId = 'review-absent';
    assert.deepEqual(q2Read(T, s), { owners: [], mgsTouched: [] }, 'Q2 an unresolved id cannot fall back to prose');
  }
  return { status: 'PASS', assertions: 'fixed owner/group at two positions; live-name order and terminal-id controls', ...got };
}

function tracedLegacyRecord(d, values, trace) {
  const en = { id: 'review-lift', w: 100 };
  Object.defineProperty(en, 'reps', {
    enumerable: true,
    get() { trace.push({ d, read: 'legacy.reps' }); return values.slice(); },
  });
  const rec = {};
  Object.defineProperty(rec, 'entries', {
    enumerable: true,
    get() { trace.push({ d, read: 'legacy.entries' }); return [en]; },
  });
  return rec;
}
function inventedPerformedSession(d, values, trace) {
  // Entirely invented v1 facts, shaped only from public performed.cjs.
  // No original native test or constructor is imported or reproduced.
  const start = 'review-start-' + d;
  const lineage = 'review-lift';
  const entry = {
    profile: 'earned/performed-lift/v1', start_op_id: start, lift_lineage_id: lineage,
    completion: { op_id: start + '-complete', kind: 'normal', status: 'stored-on-this-device' },
    slots: values.map((value, i) => {
      const slot = JSON.stringify([lineage, i + 1]);
      const reps = { unit: 'rep' };
      Object.defineProperty(reps, 'value', {
        enumerable: true,
        get() { trace.push({ d, position: i + 1, read: 'performed.reps.value' }); return value; },
      });
      return {
        position: i + 1, logical_set_slot: slot, state: 'performed',
        fact: {
          included: true, source_op_id: start + '-set-' + (i + 1), logical_set_slot: slot,
          lift_lineage_id: lineage, source_status: 'stored-on-this-device', current_status: 'stored-on-this-device',
          edit_op_ids: [], issues: [], current: { load: { unit: 'lb', value: 100 }, reps },
        },
      };
    }),
  };
  return { start_op_id: start, effective: { local_date: d }, record: { entries: [entry] } };
}
function observeAnchor(H, day, rows, origin) {
  const T = engine(H, day), trace = [];
  const s = state(H, [lift()]);
  s.workoutFacts = { profile: 'earned/workout-facts/v1', sessions: [] };
  if (origin === 'legacy-in-native-view') {
    for (const [d, values] of rows) s.sessionLog[d] = tracedLegacyRecord(d, values, trace);
  } else {
    assert.equal(origin, 'performed-diagnostic');
    s.workoutFacts.sessions = rows.map(([d, values]) => inventedPerformedSession(d, values, trace));
    s.workoutFacts.source_revision = 1;
    s.workoutFacts.order = {
      profile: 'earned/workout-order/v1', frontier: rows.length,
      start_ids: s.workoutFacts.sessions.map(x => x.start_op_id),
    };
  }
  try {
    const anchor = T.progressAnchor(s.exercises[0], s);
    return { kind: 'RETURN', origin, query: day, anchor, trace };
  } catch (e) {
    return { kind: 'THROW', origin, query: day, name: e.name, code: e.code || null, message: e.message, reason: e.reason || null, trace };
  }
}
function runD7(H, side) {
  assert.ok(['base', 'candidate'].includes(side), 'root must name the immutable side');
  const origin = 'legacy-in-native-view';
  const a = {
    futureOnly: observeAnchor(H, QUERY, [[FUTURE, [13, 12]]], origin),
    currentOnly: observeAnchor(H, QUERY, [[QUERY, [9, 8]]], origin),
    earlierOnly: observeAnchor(H, QUERY, [['2026-08-31', [8, 7]]], origin),
    earlierAndFuture: observeAnchor(H, QUERY, [['2026-08-31', [8, 7]], [FUTURE, [13, 12]]], origin),
    futureBecomesCurrent: observeAnchor(H, FUTURE, [[FUTURE, [13, 12]]], origin),
  };
  for (const [name, expected] of [
    ['currentOnly', [9, 8]], ['earlierOnly', [8, 7]], ['futureBecomesCurrent', [13, 12]],
    ['earlierAndFuture', side === 'candidate' ? [8, 7] : [13, 12]],
  ]) {
    assert.equal(a[name].kind, 'RETURN', 'D7 native-view legacy control must be runnable: ' + name);
    assert.deepEqual(a[name].anchor, expected, 'D7 native-view legacy control: ' + name);
  }
  // This is a disclosed diagnostic, not a successful native-context control.
  // The actual public helper supplies no nativeTrendContext resolver. Preserve
  // that refusal; never inject a fake resolver to get a green observation.
  const diagnostic = {
    futureOnly: observeAnchor(H, QUERY, [[FUTURE, [13, 12]]], 'performed-diagnostic'),
    currentOnly: observeAnchor(H, QUERY, [[QUERY, [9, 8]]], 'performed-diagnostic'),
    futureBecomesCurrent: observeAnchor(H, FUTURE, [[FUTURE, [13, 12]]], 'performed-diagnostic'),
  };
  for (const name of ['currentOnly', 'futureBecomesCurrent']) {
    assert.equal(diagnostic[name].kind, 'THROW', 'performed control must retain its resolver boundary: ' + name);
    assert.equal(diagnostic[name].code, 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
    assert.equal(diagnostic[name].reason, 'resolver_missing');
  }
  return {
    side,
    coverage: 'actual native governing branch over invented legacy rows; actual performed rows are diagnostic only',
    nativeViewLegacy: a,
    performedDiagnostic: diagnostic,
    futureOnlyUsesFutureLine: a.futureOnly.kind === 'RETURN' && JSON.stringify(a.futureOnly.anchor) === '[13,12]',
    nativeContextControlsProven: false,
  };
}
function assertFutureOnlyExclusion(result) {
  // Separate from runnable controls: root may invoke this expecting the exact
  // behavioral assertion failure. It deliberately does not invent which
  // replacement baseline policy the PM should approve.
  assert.equal(result.nativeViewLegacy.futureOnly.kind, 'RETURN', 'D7 future-only public probe must run');
  assert.notDeepEqual(result.nativeViewLegacy.futureOnly.anchor, [13, 12], 'D7 FUTURE-ONLY EXCLUSION: a future governing row must not return through the fallback');
}

const Q2_LOOKUP_MUTANT = Object.freeze({
  relativePath: 'rebuild/engine/volume.cjs',
  name: 'volume-owner-returns-to-substring',
  expectedOccurrences: 1,
  before: [
    '    const at9 = f.t.indexOf("via "); const tail9 = at9 < 0 ? null : f.t.slice(at9 + 4);   /* "VOLUME PASSED" carries no "via" — declines are not moves */',
    '    const cut9 = tail9 === null ? -1 : tail9.lastIndexOf(" (now "); const own9 = tail9 === null ? null : (cut9 < 0 ? tail9 : tail9.slice(0, cut9));',
    '    const xs9 = (s.exercises || []); const owns9 = (n9) => !!n9 && (own9 === n9 || tail9 === n9);   /* C3 — two exact comparisons over one name, nothing else */',
    '    const ex = f.exId != null ? xs9.find((x) => String(f.exId) === String(x.id)) : (xs9.find((x) => owns9(String((x && x.n) || ""))) || xs9.find((x) => _formerNames(x).some(owns9)));   /* Q2 — §2 C1→C2→C3: structured identity is terminal, else the producer\'s whole-name boundary over the lift\'s whole NAME FAMILY — the same two exact comparisons _volDeltas makes, so the two readers cannot disagree about one receipt (C6). Where the family admits two owners the LIVE name (C1: ex.n is the display name, renames[].prevN is history) is preferred over a former one, so WHERE A LIVE NAME MATCHES the receipt\'s muscle group is never charged to a different lift by s.exercises order; where ONLY former names match, array order still decides — C6\'s excluded class (ii), pinned by cell B2-Q2j-b */',
  ].join('\n'),
  after: '    const ex = (s.exercises || []).find((x) => f.t.indexOf("via " + x.n) > -1);   /* "VOLUME PASSED" carries no "via" — declines are not moves */',
  instructions: [
    'Root only: use a separately verified public-only disposable copy; record every exact original source byte/hash first.',
    'Assert before occurs exactly once, then replace it with after. This is the original M lookup, with D18 and every neighboring byte retained.',
    'Load the actual copied public helper in a fresh process and call runQ2(helper). The unchanged candidate must pass first.',
    'The mutant must fail Q2 FIXED OWNER atFront with review-short instead of review-incline; observeQ2 also reports back instead of chest.',
    'A syntax/pin/setup/timeout failure is not a kill. Restore exact original bytes/hash and rerun runQ2 for the restored positive.',
    'The optional historical NOT APPLIED delta-cell branch cannot be the assertion that earns this kill.',
  ],
});

const MISSING_EVIDENCE = Object.freeze({
  status: 'NOT SATISFIED BY THIS REVIEWER ANNEX',
  candidate: CANDIDATE, base: BASE,
  b2Brief: { commit: '992b49c21a9c33de4def12abd4337e0605fcb201', path: 'rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.4.md', sha256: '5139bb799df64ecf890c5b18a812ec344dfb88ca3d01f6651e0c2fc78091ca88' },
  d30Brief: { commit: '992b49c21a9c33de4def12abd4337e0605fcb201', path: 'rebuild/m2/BRIEF-SET-ONE-ERA.md', sha256: 'a2e88bed8edf566b4551d9a48b79282b9e367b2fd195bde5f1be41f13baa84b3' },
  obligations: [
    { cite: 'D30 brief:25,29-40', missing: 'complete ERA30 case families in four frozen/native-Date by injected-day cells, including independent complete numeric and consumer outputs' },
    { cite: 'D30 brief:33,37,39', missing: 'future-era, pre-read accessor-cut and conditional query-clock controls' },
    { cite: 'D30 brief:62', missing: 'all listed actual source faults at intended behavioral assertions, with exact restoration; no setup-error credit' },
    { cite: 'B2 brief:1314-1315,1701', missing: 'native-view first-target fitting and governing-test mutant; annex does not execute targetsFor' },
    { cite: 'B2 brief:1432,1701', missing: 'complete native anchor/source-fault evidence; annex public legacy-origin native-view probes do not prove a supplied native trend context' },
    { cite: 'B2 brief:1705', missing: 'PROGRESSION_RESET_MAPPING_REQUIRED through both targetsFor and progressAnchor' },
    { cite: 'B2 brief:438; per-defect source-mutant lists in section1', missing: 'effective B2 source-fault suite; one reviewer Q2 bite is not the complete suite' },
  ],
  d7aScope: 'PM aa60db5 permits unchanged literal b2-delta only in independently verified public-only subset: report D7a as partial public source scan; full tracked census UNEXECUTED.',
  noAcceptanceClaim: 'Reviewer synthetic probes do not grant package PASS, frozen/native census parity, private evidence, FULL, receipt, integration or release.',
});

module.exports = { CANDIDATE, BASE, observeQ2, runQ2, observeAnchor, runD7, assertFutureOnlyExclusion, Q2_LOOKUP_MUTANT, MISSING_EVIDENCE };
