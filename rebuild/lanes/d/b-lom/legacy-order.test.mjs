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
  createSourcePlatform, Profile, SETUP, IMPORTED_LOADS,
  SOURCE_SESSION_DAYS } from '../../../m3/w7-preview/import/test/support.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';
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
