/* B-LOM - THE CARD OPENS AFTER THE PORT (DECISIONS:486; rebuild/lanes/b/B-LOM-BRIEF.md).

   THE BOUNDARY. rebuild/engine/performed.cjs:176-183 refuses
   PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED as soon as an imported session log
   and a native workout coexist, because nothing on the installation had ever
   composed workoutFacts.legacy_baseline or order.import_anchor. A daily trainer
   would be refused every day after his first post-import workout.

   ONE store, ONE installation, REAL hosts: the first run, the Measure screen,
   the gym card and the S3 admission controller all stand on the same generation
   over real fake-indexeddb, with a real sealed bundle from the real port.cjs on
   the S4 LIVE clock. Nothing is stubbed and no harness shortcut is taken: every
   assertion below is read off the product's own card model.

   THE TWO IDS, stated before the first cell and measured in LOM-ID:
     source_generation_id = basis.source_digest, the admitted source's content
       digest on this installation - WHICH imported history the baseline is.
     activation_op_id = basis.local_selection_id, the recorded selection id that
       metadata.localSources.active names - the act that activated it, since the
       local era mints no activation operation (DECISIONS:486 (b)).

   SUMMER AND WINTER, like the ticket this one follows: an EDT pair
   (2026-10-16/17, -04:00) and an EST pair (2026-11-20/21, -05:00).

   SYNTHETIC ONLY: the bundle is invented in the OS temp folder through the
   ACCEPTED clean-init constructor and sealed by the real port.cjs outside every
   git working tree. No private fixture, no ledger, no owner file. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, firstRun, admit, durable, liveAt,
  createSourcePlatform, Profile, SETUP, IMPORTED_LOADS, parseStrictJson,
  SOURCE_SESSION_DAYS } from '../../../m3/w7-preview/import/test/support.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';
import { createWorkoutEntry } from '../../../m3/w7-preview/today/today-entry.mjs';
import TodayModel from '../../../m3/w7-preview/today/today-model.cjs';
import Capture from '../../../m4/workout/capture.cjs';
import Commands from '../../../m4/workout/commands.cjs';
import { createMeasureHost } from '../../../m3/w7-preview/measure/measure-host.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const SEALED = sealInventedBundle();
const EFFORT = { tag: 'exact', value: 2, unit: 'rep' };
const WINTER = { name: 'winter EST', day: '2026-11-20', second: '2026-11-21', at: '2026-11-20T17:00:00.000Z' };
const SUMMER = { name: 'summer EDT', day: '2026-10-16', second: '2026-10-17', at: '2026-10-16T16:00:00.000Z' };
const SEASONS = [WINTER, SUMMER];
const LATER = [1, 3, 4, 7];
const BLOCKER = 'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED';
const ok = r => assert.equal(r.ok, true, 'the gym card refused: ' + (r.code || r.copy));
const offsetDay = (day, days) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

/* The engine state the card stands on BEFORE any import, through the ACCEPTED
   clean-init constructor - the very athlete the first run records. */
function nativeState() {
  const state = JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
  for (const ex of state.exercises)
    ex.w = typeof ex.steps?.[0] === 'number' ? ex.steps[0] : 20;
  return state;
}

/* ONE ENROLLED INSTALLATION on the season's own day, on the S4 LIVE clock. The
   installation scope is the SAME for every install so two of them can be
   compared member for member; only the database differs. */
async function install(t, tag, season) {
  const scope = { namespace: 'joe/b-lom', athleteId: 'ath-b-lom', deviceId: 'dev-b-lom' };
  const era = await eraFor({ indexedDB: new IDBFactory(), databaseName: 'b-lom-' + tag,
    ...scope, live: liveAt(season.at) });
  t.after(() => era.close());
  await firstRun(era, season.day);
  return { era, scope: { databaseName: 'b-lom-' + tag, ...scope } };
}

/* WHAT TODAY AND THE GYM CARD STAND ON, through the SAME consumer today-app
   adopts by. Before an import it is null and the clean-init athlete stands. */
const adopted = async era => admittedLocalSourceBasis(
  (await era.generation()).generation, { namespace: era.namespace ?? null });
const standing = async era => (await adopted(era)) || nativeState();

/* OPEN the card on a day: a PAGE LOAD, a brand new host over the same storage,
   exactly as reopening the app builds a new host over the IndexedDB already
   there. Returns the card model's own view, unedited. */
async function openCard(era, day, state) {
  const open = d => era.createGymHost({ day: d, engineState: state,
    plannedSplitSlotId: 'earned-today-preview/' + d });
  const gymHost = await open(day);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: open });
  return { gymHost, gym, view: await gym.read() };
}

/* ONE COMPLETE WORKOUT through the REAL gym host and the REAL card model. */
async function recordWorkout(era, day, state) {
  const { gymHost, gym, view: ready } = await openCard(era, day, state);
  assert.equal(ready.phase, 'ready', day + ': ' + (ready.code || ready.phase));
  ok(await gym.start());
  let view = await gym.read();
  const startId = view.startId;
  for (let n = 0; n <= view.total; n += 1) {
    if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
    if (view.phase !== 'active') break;
    ok(await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift,
      load: view.entry.load, reps: view.entry.reps, effort: EFFORT }));
    view = await gym.read();
  }
  assert.equal(view.complete === true || view.phase === 'complete', true,
    'the card did not reach a complete session: ' + view.phase);
  ok(await gym.finish({ startId }));
  gymHost.close();
  return startId;
}

/* EVERY LATER SCHEDULED DAY, read off the card itself. A day this athlete does
   not train answers with the layer's own rest-day words - the split is not in
   force on it, or the engine prescribes no session for it - and those are those
   rules, not this cell's to work around. What this measures is that NO day is
   refused by the legacy-order blocker any more, and that every day the athlete
   DOES train carries a real prescription with a named lift. */
const REST = ['WORKOUT_SPLIT_NOT_IN_FORCE', 'ENGINE_CAPTURE_NO_WORKOUT'];
async function laterDays(era, from, state) {
  const seen = [];
  for (const offset of LATER) {
    const day = offsetDay(from, offset);
    const { gymHost, gym, view } = await openCard(era, day, state);
    assert.notEqual(view.code, BLOCKER, 'day+' + offset + ' is still blocked by the port');
    if (view.phase === 'ready') {
      assert.ok(view.total > 0, 'day+' + offset + ' opened with no sets');
      assert.equal(typeof view.set.lift, 'string', 'day+' + offset + ' names no lift');
      assert.ok(view.set.lift.length > 0);
      seen.push({ offset, day, lift: view.set.lift, total: view.total,
        previous: view.previous, prev: gym.previous().get(view.set.lift) || null });
    } else {
      assert.equal(view.phase, 'blocked', 'day+' + offset + ': ' + view.phase);
      assert.ok(REST.includes(view.code), 'day+' + offset + ': ' + view.code);
      seen.push({ offset, day, lift: null, total: 0, previous: null, prev: null, rest: view.code });
    }
    gymHost.close();
  }
  assert.ok(seen.some(row => row.lift), 'not one later day opened at all');
  return seen;
}

/* BAR ROW 4, MEASURED - round 2 (review R1 finding 1, R3 MAJOR 3). laterDays
   collected `previous` and `prev` and compared neither, so "the prescription is
   the RIGHT one" rested on a table the reviewers built by hand. Here is that
   table, in the cells, read off the card model itself.

   `previous` is the line the card prints (gym-model.mjs previousLine). `prev` is
   the record that line came out of, and its SHAPE says which record governs: the
   imported file's own {d, w, reps} entry, replayed out of the old engine's
   sessionLog, or an `earned/performed-lift/v1` record this device wrote. That
   distinction is the whole of bar row 4: a regression that read the imported row
   where the native row governs would print a plausible line and be caught by no
   other assertion here. */
const governs = prev => prev === null ? null
  : typeof prev.d === 'string' && typeof prev.w === 'number' ? 'imported'
    : typeof prev.profile === 'string' && prev.profile.startsWith('earned/performed-lift/')
      ? 'native' : 'unknown';
const handTable = rows => rows.filter(row => row.lift)
  .map(row => [row.offset, row.lift, row.previous, governs(row.prev)]);

/* The facts the host itself registered for the day just read: the order the
   engine was actually given, anchor and all. Never rebuilt here. */
const factsOf = gymHost => gymHost.host.lastProjection()?.workout_history || null;

/* The native order, read off the card's own host on a day it prepared. */
async function orderOn(era, day, state) {
  const { gymHost, view } = await openCard(era, day, state);
  const facts = factsOf(gymHost);
  gymHost.close();
  return { phase: view.phase, code: view.code || null, facts };
}

for (const season of SEASONS) {
  test('LOM-ID [' + season.name + '] - the two ids are the admission\'s own digests, and the '
    + 'generation records both', async t => {
      const { era, scope } = await install(t, 'id-' + season.name, season);
      const result = await admit(era, SEALED, { day: season.day, ...scope });
      assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
      const g = (await era.generation()).generation;
      const active = g.metadata.localSources.active;
      const selection = g.metadata.localSources.selections[active];
      const baseline = result.view.workout_baseline.engine_baseline;
      assert.equal(baseline.profile, 'earned/imported-engine-history/v1');
      assert.equal(baseline.source_generation_id, result.view.basis.source_digest,
        'source_generation_id is the admitted source\'s content digest');
      assert.equal(baseline.activation_op_id, result.view.basis.local_selection_id,
        'activation_op_id is the recorded selection id');
      assert.equal(baseline.activation_op_id, active,
        'and metadata.localSources.active names it, which is what makes it checkable');
      assert.equal(selection.basis.source_digest, baseline.source_generation_id);
      assert.deepEqual(Object.keys(baseline.session_log).sort(), SOURCE_SESSION_DAYS);
      /* NOT an operation: the local era mints none, which is the whole reason
         engine-order.cjs reads the recorded selection instead of the sequence. */
      assert.equal(Object.hasOwn(g.collections.ops || {}, baseline.activation_op_id), false,
        'an activation OPERATION was minted after all');
      /* The local-v1 shape the admission has always published is still there. */
      assert.equal(result.view.workout_baseline.profile, 'earned/imported-engine-history/local-v1');
      assert.ok(result.view.workout_baseline.local_source_basis);
    });
}

for (const season of SEASONS) {
  test('LOM-A [' + season.name + '] - IMPORT THEN TRAIN: the next scheduled day OPENS with a '
    + 'real prescription, and the native session is listed once', async t => {
      const { era, scope } = await install(t, 'a-' + season.name, season);
      const measure = await createMeasureHost({ day: season.day, era });
      t.after(() => measure.close());
      const dayOne = await measure.ensureTrialStart();
      const result = await admit(era, SEALED, { day: season.day, ...scope });
      assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
      assert.equal(result.view.order_map, null,
        'nothing native existed at admission, so no order map was recorded, and that is itself the answer');
      const state = await standing(era);
      assert.deepEqual(state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
      assert.deepEqual(Object.keys(state.sessionLog).sort(), SOURCE_SESSION_DAYS);
      const staged = await durable(era);

      const first = await recordWorkout(era, season.day, state);
      const later = await laterDays(era, season.day, state);
      assert.ok(later.some(row => row.lift), JSON.stringify(later));
      /* BAR ROW 4. The imported prefix governs the lift he has not trained here
         (leg-press, off the file's own 2026-08-17 entry, 120 lb for 10); the
         record this device wrote governs the one he has (db-bench, 45 lb for 7,
         the first set of the session recorded on season.day). */
      assert.deepEqual(handTable(later), [[1, 'leg-press', 'Last time: 120 lb × 10', 'imported'],
        [7, 'db-bench', 'Last time: 45 lb × 7', 'native']], JSON.stringify(handTable(later)));
      const importedRow = later.find(row => row.offset === 1).prev;
      assert.equal(importedRow.d, '2026-08-17', 'the imported line came off another day of the file');
      assert.deepEqual(importedRow.reps, [10, 10, 9], 'and off that day\'s own recorded set');
      const nativeRow = later.find(row => row.offset === 7).prev;
      assert.equal(nativeRow.start_op_id, first,
        'the native line came off the very Start this installation just wrote');
      assert.equal(nativeRow.lift_lineage_id, 'db-bench');

      /* THE NATIVE SESSION IS A MEMBER, ONCE: not dropped into the imported
         prefix and not counted twice, and the anchor on the order is the one
         engine-order.cjs derived from the recorded selection. */
      const opened = later.find(row => row.lift);
      const { facts } = await orderOn(era, opened.day, state);
      assert.deepEqual(facts.order.start_ids, [first], JSON.stringify(facts.order.start_ids));
      assert.deepEqual(facts.order.import_anchor,
        { source_generation_id: result.view.basis.source_digest,
          activation_op_id: result.view.basis.local_selection_id },
        'the order carries the anchor the law proved, not one bolted on afterwards');
      assert.equal(await measure.trialStart(), dayOne, 'training after the import moved day one');
      const after = await durable(era);
      assert.equal(after.applied, true);
      assert.ok(after.ops > staged.ops, 'the workout really was written');

      /* THE SECOND WORKOUT, and the hand table again after it. This is the row
         the owner actually reaches on his third day: the line the card prints
         for a lift he has now trained HERE must come off the record this device
         wrote, not off the file he imported, and the imported prefix must not
         move under it. */
      const secondStart = await recordWorkout(era, offsetDay(season.day, 1), state);
      assert.notEqual(secondStart, first, 'the second workout wrote no Start of its own');
      const trained = [], previousOf = new Map();
      for (const offset of [3, 4, 7, 8]) {
        const card = await openCard(era, offsetDay(season.day, offset), state);
        const lift = card.view.set ? card.view.set.lift : null;
        const prev = lift ? card.gym.previous().get(lift) || null : null;
        trained.push([offset, card.view.phase, card.view.code || null, lift,
          card.view.previous || null, governs(prev)]);
        if (prev) previousOf.set(lift, prev);
        if (offset === 7) assert.deepEqual(factsOf(card.gymHost).order.start_ids,
          [first, secondStart], 'both Starts, in device order, each exactly once');
        card.gymHost.close();
      }
      /* Day+8 is the row that matters and the reason the SHAPE is compared and
         not only the line: leg-press still reads 120 lb for 10, character for
         character what the imported file said, but it is now governed by the
         record of the SECOND workout - which was prescribed off that imported
         row and performed at it. A regression that kept reading the file here
         would print exactly this line, and only `governs` tells them apart. */
      assert.deepEqual(trained, [[3, 'blocked', 'ENGINE_CAPTURE_NO_WORKOUT', null, null, null],
        [4, 'blocked', 'ENGINE_CAPTURE_NO_WORKOUT', null, null, null],
        [7, 'ready', null, 'db-bench', 'Last time: 45 lb × 7', 'native'],
        [8, 'ready', null, 'leg-press', 'Last time: 120 lb × 10', 'native']], JSON.stringify(trained));
      assert.equal(previousOf.get('leg-press').start_op_id, secondStart,
        'leg-press is still being read off the imported file after he trained it here');
      assert.equal(previousOf.get('db-bench').start_op_id, first);
      assert.deepEqual(Object.keys((await standing(era)).sessionLog).sort(), SOURCE_SESSION_DAYS,
        'a native workout was absorbed into the imported prefix');
    });
}

for (const season of SEASONS) {
  test('LOM-B [' + season.name + '] - TRAIN THEN IMPORT: the same, and the anchor holds although '
    + 'the Start was written BEFORE the source was ever activated', async t => {
      const { era, scope } = await install(t, 'b-' + season.name, season);
      const first = await recordWorkout(era, season.day, nativeState());
      const result = await admit(era, SEALED, { day: season.day, ...scope });
      assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
      assert.equal(result.view.order_map.assertion.answer, true,
        'the athlete answered the prefix question, and that answer is the recorded evidence');
      assert.equal(result.view.order_map.native_root_id, first);
      const state = await standing(era);
      const later = await laterDays(era, season.day, state);
      const opened = later.find(row => row.lift);
      assert.ok(opened, JSON.stringify(later));
      /* BAR ROW 4, the other order. The imported prefix still governs the lift
         he has not trained here; the pre-import session governs the one he has,
         on the clean-init numbers it was actually performed at - it is LATER
         than the file's last day, which is exactly what the athlete's recorded
         prefix answer asserted, so it governs and the file does not. */
      assert.deepEqual(handTable(later), [[1, 'leg-press', 'Last time: 120 lb × 10', 'imported'],
        [7, 'db-bench', 'Last time: 20 lb × 8', 'native']], JSON.stringify(handTable(later)));
      const { facts } = await orderOn(era, opened.day, state);
      assert.deepEqual(facts.order.start_ids, [first]);
      assert.deepEqual(facts.order.import_anchor,
        { source_generation_id: result.view.basis.source_digest,
          activation_op_id: result.view.basis.local_selection_id });
      /* A Start written before the import can never CAUSALLY descend from it,
         and on a local era there is no operation for it to descend from at all.
         The recorded order map is what proves its place, and it names this very
         Start as the one native root it saw. */
      assert.equal(facts.order.start_ids[0], result.view.order_map.native_root_id);
    });

  test('LOM-C [' + season.name + '] - TWO native workouts before the import: both keep device '
    + 'order, both appear once, and the day after opens', async t => {
      const { era, scope } = await install(t, 'c-' + season.name, season);
      const first = await recordWorkout(era, season.day, nativeState());
      const second = await recordWorkout(era, season.second, nativeState());
      const result = await admit(era, SEALED, { day: season.second, ...scope });
      assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
      assert.deepEqual(result.view.workout_facts.order.start_ids, [first, second]);
      const state = await standing(era);
      assert.deepEqual(Object.keys(state.sessionLog).sort(), SOURCE_SESSION_DAYS,
        'a native workout was absorbed into the imported log');
      const later = await laterDays(era, season.second, state);
      const opened = later.find(row => row.lift);
      assert.ok(opened, JSON.stringify(later));
      const { facts } = await orderOn(era, opened.day, state);
      assert.deepEqual(facts.order.start_ids, [first, second],
        'device order, each Start exactly once');
      assert.equal(new Set(facts.order.start_ids).size, 2);
      assert.equal(facts.sessions.length, 2);
    });
}

/* THE REPAIR OF P3-CSR5 (DECISIONS:486 MAJOR 2). The old mirror cell compared
   `adopted(a)` with `adopted(b)`, which is the IMPORTED replay only, so it held
   with one of B's workouts dropped. THE RULE NOW: two mirror installations are
   compared on what the ENGINE READS - the imported prefix, the full native
   order member for member, and the prescription the card opens with - and the
   digests that hold a Start's position are compared where they CAN be equal,
   which is within one installation against its own records. A basis record
   cannot be identical across two orders and the members that differ are named
   with their reason instead of being waved at. Both comparisons carry a MUTANT
   that is a genuinely dropped workout, and both go red on it. */
const MIRROR_DIFFERS = ['era_id', 'checkpoint_digest', 'local_selection_id',
  'operation_digest', 'interpretation_digest', 'order_map_digest'];

/* Everything the engine is handed, from the card's own host: the imported
   prefix, the native order by day, and the day the card opens on. */
async function engineView(era, from) {
  const state = await standing(era);
  const later = await laterDays(era, from, state);
  const opened = later.find(row => row.lift);
  const { facts } = await orderOn(era, opened.day, state);
  return { imported: Object.keys(state.sessionLog).sort(),
    loads: state.exercises.map(e => [e.id, e.w]).sort(),
    natives: facts.order.start_ids.map(id =>
      facts.sessions.find(s => s.start_op_id === id).effective.local_date),
    members: facts.order.start_ids.length,
    lift: opened.lift, total: opened.total, previous: opened.previous };
}

for (const season of SEASONS) {
  test('LOM-D [' + season.name + '] - MIRROR: the two orders leave the engine reading the same '
    + 'thing, and a DROPPED workout is detected', async t => {
      const a = await install(t, 'd-a-' + season.name, season);
      const rA = await admit(a.era, SEALED, { day: season.day, ...a.scope });
      assert.equal(rA.admitted, true, JSON.stringify(rA.codes || rA.code || rA.stage));
      await recordWorkout(a.era, season.day, await standing(a.era));

      const b = await install(t, 'd-b-' + season.name, season);
      await recordWorkout(b.era, season.day, nativeState());
      const rB = await admit(b.era, SEALED, { day: season.day, ...b.scope });
      assert.equal(rB.admitted, true, JSON.stringify(rB.codes || rB.code || rB.stage));

      const vA = await engineView(a.era, season.day), vB = await engineView(b.era, season.day);
      assert.deepEqual(vA, vB, 'the two orders leave the engine reading different things');
      assert.equal(vA.members, 1);

      /* The named differences, with their reason: B recorded an order map
         because it held a native Start when it admitted and A did not, and the
         selection id is bound to that map, the input revision and the token. */
      const differ = Object.keys(rA.view.basis).filter(k =>
        JSON.stringify(rA.view.basis[k]) !== JSON.stringify(rB.view.basis[k]));
      assert.deepEqual(differ.sort(), MIRROR_DIFFERS.slice().sort(), JSON.stringify(differ));
      assert.equal(rA.view.order_map, null);
      assert.equal(rB.view.order_map.assertion.answer, true);

      /* THE MUTANT, and it is a real dropped workout: the same train-then-import
         installation with TWO native workouts instead of one. Every member the
         old cell compared is still equal; the order is not. */
      const c = await install(t, 'd-c-' + season.name, season);
      await recordWorkout(c.era, season.day, nativeState());
      await recordWorkout(c.era, season.second, nativeState());
      const rC = await admit(c.era, SEALED, { day: season.second, ...c.scope });
      assert.equal(rC.admitted, true, JSON.stringify(rC.codes || rC.code || rC.stage));
      const vC = await engineView(c.era, season.second);
      assert.deepEqual(vC.imported, vB.imported, 'the imported replay is the same either way');
      assert.deepEqual(vC.loads, vB.loads, 'and so is the basis the old cell compared');
      assert.notDeepEqual(vC.natives, vB.natives, 'A DROPPED WORKOUT WENT UNDETECTED');
      assert.equal(vC.members, 2);
    });
}

test('LOM-D2 - order_map_digest is SENSITIVE to a dropped workout: recomputed from the '
  + 'installation\'s own recorded input, one operation short, it changes', async t => {
    const season = WINTER;
    const { era, scope } = await install(t, 'd2', season);
    const first = await recordWorkout(era, season.day, nativeState());
    const second = await recordWorkout(era, season.second, nativeState());
    const result = await admit(era, SEALED, { day: season.second, ...scope });
    assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
    const platform = createSourcePlatform();
    const map = result.view.order_map;
    assert.equal(Profile.digest(platform.hash, 'earned/local-source-order-map/v1', map),
      result.view.basis.order_map_digest, 'the recorded digest is the digest of the recorded map');
    const g = (await era.generation()).generation;
    const selection = g.metadata.localSources.selections[g.metadata.localSources.active];
    const operations = selection.order_input.operations;
    assert.equal(Profile.digest(platform.hash, 'earned/local-source-native-members/v1',
      Object.entries(operations)), map.native_members_digest,
      'and the members digest is the digest of the operations it saw');
    /* DROP the second workout's Start and everything the drop implies. */
    const short = Object.fromEntries(Object.entries(operations).filter(([id]) => id !== second));
    assert.notEqual(Object.keys(short).length, Object.keys(operations).length);
    const dropped = Profile.digest(platform.hash, 'earned/local-source-native-members/v1',
      Object.entries(short));
    assert.notEqual(dropped, map.native_members_digest, 'A DROPPED WORKOUT LEFT THE DIGEST EQUAL');
    assert.notEqual(Profile.digest(platform.hash, 'earned/local-source-order-map/v1',
      { ...map, native_members_digest: dropped }), result.view.basis.order_map_digest);
    /* And a REORDER: the map's own root is the first Start, not the second. */
    assert.equal(map.native_root_id, first);
    assert.notEqual(Profile.digest(platform.hash, 'earned/local-source-order-map/v1',
      { ...map, native_root_id: second }), result.view.basis.order_map_digest);
  });

test('LOM-E - AN INSTALLATION WITH NO IMPORT: nothing changes, and the provider is never '
  + 'reached', async t => {
    const season = SUMMER;
    const a = await install(t, 'e-a', season);
    const b = await install(t, 'e-b', season);
    for (const era of [a.era, b.era]) {
      const g = (await era.generation()).generation;
      assert.equal(g.metadata.localSources, undefined,
        'a fresh installation records no local source, so nothing composes a baseline');
      assert.equal(await adopted(era), null);
    }
    await recordWorkout(a.era, season.day, nativeState());
    await recordWorkout(b.era, season.day, nativeState());
    const vA = await engineView(a.era, season.day), vB = await engineView(b.era, season.day);
    assert.deepEqual(vA, vB, 'two identical no-import installations disagree');
    assert.deepEqual(vA.imported, [], 'the legacy branch of performed.cjs is never entered');
    const { gymHost } = await openCard(a.era, offsetDay(season.day, 1), nativeState());
    const facts = factsOf(gymHost);
    gymHost.close();
    assert.equal(facts && Object.hasOwn(facts, 'legacy_baseline'), false,
      'a baseline was attached to an installation that has imported nothing');
    assert.equal(facts && Object.hasOwn(facts.order, 'import_anchor'), false,
      'an import anchor was attached to an installation that has imported nothing');
  });

test('LOM-F - REOPEN AND ROLLBACK to a selection recorded before any native workout: a NAMED '
  + 'refusal, never a silent replay', async t => {
    const season = WINTER;
    const { era, scope } = await install(t, 'f', season);
    const result = await admit(era, SEALED, { day: season.day, ...scope });
    assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
    assert.equal(result.view.order_map, null, 'this selection carries no order map, by construction');
    const selectionId = result.view.basis.local_selection_id;
    await recordWorkout(era, season.day, await standing(era));
    const staged = await durable(era);
    /* Before B-LOM this replayed with the answer `undefined`, which is neither
       his Yes nor a refusal he can read, and reported LOCAL_SOURCE_WORKOUT_
       UNRESOLVED as if the records were at fault. The selection is what cannot
       answer, and it is named. */
    await assert.rejects(() => result.controller.reopen(result.name),
      { code: 'LOCAL_SOURCE_ORDER_MAP_REQUIRED' }, 'reopen replayed under no answer at all');
    await assert.rejects(() => result.controller.rollback(selectionId),
      { code: 'LOCAL_SOURCE_ORDER_MAP_REQUIRED' }, 'rollback replayed under no answer at all');
    const after = await durable(era);
    assert.equal(after.ops, staged.ops, 'a refusal minted an operation');
    assert.equal(after.revision, staged.revision, 'a refusal moved the generation');
    assert.equal(after.applied, true, 'the admitted import is still admitted');
  });

/* ROUND 2. THE DURABLE RECORD, DAMAGED - and written the way the product writes
   anything, through the repository's own compare-and-set commit. Nothing below
   fabricates a selection: it takes the one the REAL admission recorded and
   removes or contradicts exactly one field of it, which is what a store damaged
   between two page loads looks like from the page's side. */
const workoutCommands = Commands.createWorkoutCommands({
  prescriptionCapture: Capture.createPrescriptionCapture({ parseStrictJson }) });

async function damage(era, mutate) {
  const repository = (await era.client.hostBindings({ workoutCommands })).repository;
  const before = await repository.load();
  const next = JSON.parse(JSON.stringify(before.generation));
  const registry = next.metadata.localSources;
  mutate(registry.selections[registry.active], registry);
  await repository.commit({ revision: before.revision, token: before.token }, next, () => null);
  const after = await repository.load();
  assert.equal(after.revision, before.revision + 1, 'the damage was not made durable');
  return after.generation.metadata.localSources.selections[after.generation.metadata.localSources.active];
}

/* Every later day, read for its CODE alone. laterDays above asserts that no day
   is blocked; this is its mirror, and it names the code rather than accepting
   any refusal at all. */
async function blockedDays(era, from, state, code) {
  for (const offset of [1, 7]) {
    const { gymHost, view } = await openCard(era, offsetDay(from, offset), state);
    assert.equal(view.phase, 'blocked', 'day+' + offset + ' opened on a record that proves nothing');
    assert.equal(view.code, code, 'day+' + offset + ': ' + view.code);
    gymHost.close();
  }
}

for (const season of SEASONS) {
  test('LOM-G [' + season.name + '] - THE MAP\'S ABSENCE IS NOT A PROOF: a selection whose '
    + 'recorded order_input holds a native Start and whose order map is GONE is refused', async t => {
      /* ROUND 2, R3 MAJOR 1. The brief's section 3 red side, on the real route.
         It was written as "with the selection's order_map removed from the
         generation, the same four days are blocked", and round 1 had it
         INVERTED: a deleted map read as "nothing native existed at admission",
         which is the one reading a record that has LOST its map also produces,
         so the days OPENED. They must not. The train-then-import order is the
         one that records a map at all, so it is the one that can lose it. */
      const { era, scope } = await install(t, 'g-' + season.name, season);
      const first = await recordWorkout(era, season.day, nativeState());
      const result = await admit(era, SEALED, { day: season.day, ...scope });
      assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
      assert.equal(result.view.order_map.native_root_id, first, 'a map really was recorded');
      const state = await standing(era);
      assert.deepEqual(handTable(await laterDays(era, season.day, state)),
        [[1, 'leg-press', 'Last time: 120 lb × 10', 'imported'],
          [7, 'db-bench', 'Last time: 20 lb × 8', 'native']], 'the intact record opens the days');

      /* DELETED, then NULL. Both are the same absence and both are refused, and
         the record still says why: its own order_input holds the session-start
         this device wrote before the import, beside the legacy log it adopted,
         which is exactly the condition admission records a map for. */
      const stripped = await damage(era, selection => { delete selection.order_map; });
      assert.equal(Object.hasOwn(stripped, 'order_map'), false);
      assert.ok(Object.keys(stripped.order_input.legacyLog).length, 'the record still shows the adoption');
      assert.ok(Object.values(stripped.order_input.operations)
        .some(op => op.class === 'session' && op.kind === 'session-start'),
      'and it still shows the native Start that made a map mandatory');
      await blockedDays(era, season.day, state, 'LEGACY_ORDER_MAPPING_UNPROVEN');

      await damage(era, selection => { selection.order_map = null; });
      await blockedDays(era, season.day, state, 'LEGACY_ORDER_MAPPING_UNPROVEN');

      /* AND IT IS THE ABSENCE, NOT THE DAMAGE: put the recorded map back,
         byte for byte, and the same days open again. */
      await damage(era, selection => { selection.order_map = JSON.parse(JSON.stringify(result.view.order_map)); });
      assert.deepEqual(handTable(await laterDays(era, season.day, state)),
        [[1, 'leg-press', 'Last time: 120 lb × 10', 'imported'],
          [7, 'db-bench', 'Last time: 20 lb × 8', 'native']], 'the restored record opens them again');
      const ops = await durable(era);
      assert.equal(ops.applied, true, 'the admitted import is still admitted');
    });
}

for (const season of SEASONS) {
  test('LOM-H [' + season.name + '] - A PROVIDER REFUSAL IS A CARD REFUSAL: Today BOOTS through '
    + 'the real entry and the card reads blocked by name', async t => {
      /* ROUND 2, R3 MAJOR 2. With the recorded answer contradicted, the provider
         refuses - correctly. Round 1 threw that refusal out of createGymHost,
         which today-entry.mjs awaits uncaught, so the whole page failed to open
         and the athlete got no screen at all. The BASE, on the identical record,
         left Today standing and the card blocked PERFORMED_LEGACY_ORDER_MAPPING_
         REQUIRED. A refusal must be a code the athlete can read on a card, not a
         boot failure, so this cell drives the REAL entry - today-entry.mjs's own
         createWorkoutEntry over the real gym host and the real card model. */
      const { era, scope } = await install(t, 'h-' + season.name, season);
      await recordWorkout(era, season.day, nativeState());
      const result = await admit(era, SEALED, { day: season.day, ...scope });
      assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
      const damaged = await damage(era, selection => { selection.order_map.assertion.answer = false; });
      assert.equal(damaged.order_map.assertion.answer, false, 'the record still carries his Yes');

      const state = await standing(era);
      assert.deepEqual(Object.keys(state.sessionLog).sort(), SOURCE_SESSION_DAYS,
        'Today still adopts the imported basis, so the engine still needs the mapping');
      const day = offsetDay(season.day, 1);
      const model = TodayModel.createTodayModel({ today: day, basisState: state });
      /* THE BOOT ITSELF. If this rejects, Today does not open at all. */
      const entry = await createWorkoutEntry(model, { hosts: { createGymHost: era.createGymHost } });
      assert.ok(entry && typeof entry.refresh === 'function', 'Today did not boot');
      const summary = await entry.refresh();
      assert.equal(summary.phase, 'blocked', JSON.stringify(summary));
      assert.equal(summary.code, 'LEGACY_ORDER_MAPPING_UNPROVEN',
        'the card refuses with a code, and it is the provider\'s own: ' + summary.code);
      assert.equal(summary.sets, 0);
      assert.deepEqual(entry.summary(), summary, 'the entry is standing and holds the refusal');

      /* AND THE REST OF TODAY STANDS. The plan renders off the same adopted
         state, and another lane of the same page opens over the same store. */
      const view = model.read();
      assert.ok(view && typeof view === 'object', 'the plan did not render');
      const measure = await createMeasureHost({ day, era });
      t.after(() => measure.close());
      assert.equal(typeof await measure.ensureTrialStart(), 'string',
        'the Measure lane went down with the gym card');
      /* The card model, opened directly, reads the same refusal - the entry is
         not the thing containing it, the seam is. */
      const { gymHost, view: card } = await openCard(era, day, state);
      assert.equal(card.phase, 'blocked');
      assert.equal(card.code, 'LEGACY_ORDER_MAPPING_UNPROVEN');
      gymHost.close();
    });
}
