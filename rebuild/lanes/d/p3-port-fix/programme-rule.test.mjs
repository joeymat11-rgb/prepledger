/* P3-PORT-FIX (lane D, CELLS). THE PROGRAMME ADMISSION RULE, AT THE CONTROLLER.

   Spec of record: rebuild/lanes/d/P3-PORT-FIX-SPEC.md (v2), cells 5 (a) to
   5 (e). The phone's setup document is built by the REAL setup reducer
   (setup-model.mjs document()) driven through its own actions, because the
   shipped flow can write neither a per-lift set count nor a split.from that is
   not today (setup-model.mjs:622-623,:633), and a cell that gives the phone a
   document the screens cannot produce proves nothing about the owner's path.

   SYNTHETIC ONLY. Every bundle is sealed by the real
   rebuild/m3/setup/port/port.cjs over a legacy state built through the accepted
   clean-init constructor, with --out in the OS temp folder outside every git
   working tree. No private fixture, no ledger and no owner file is read, named
   or reachable from here.

   THE ONE STUB THAT STANDS (spec 5 (i)): every admitting cell qualifies its
   engine context through a TEST-ONLY producer mapping, because DECISIONS:472
   BLOCKER 2 is not closed by this ticket and no production producer mapping
   exists in the tree. A green bar here proves the RULE on the real path; it is
   not a promise that the owner's real bundle will qualify.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, liveAt, durable, carry, material,
  producerRegistryFor, createSourcePlatform, Profile, shippedSetup, firstRunWith,
  variedProgramme, variedLegacyState, VARIED_PRIORITIES, STRANGER_SETUP,
  STRANGER_WEEK_SETUP }
  from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController, localSourceCommitCapability }
  from '../../../m3/w6/local/source-admission.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const SETUP_DAY = '2026-09-16', IMPORT_DAY = '2026-09-17', NEXT_DAY = '2026-09-18';
const clone = value => JSON.parse(JSON.stringify(value));
/* Every day any operation in these cells can carry, so a day the mapping does
   not name refuses SOURCE_ENGINE_CONTEXT_UNPROVEN instead of passing quietly. */
const DAYS = ['2026-08-14', '2026-08-17', '2026-08-18', '2026-08-21', '2026-08-24',
  '2026-08-31', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19'];
const instantOn = day => day + 'T16:00:00.000Z';
const scopeFor = tag => ({ databaseName: 'p3-pf-' + tag, namespace: 'joe/p3-pf-' + tag,
  athleteId: 'ath-p3-pf', deviceId: 'dev-p3-pf' });

/* THE PHONE, as the shipped screens wrote it on the day setup was completed. */
const PHONE = shippedSetup({ today: SETUP_DAY });

/* THE OLD APP'S FILE: the same week, the same lift ids and the same day and mg,
   and different in every field the new rule RETAINS. `mutate` is how one cell
   varies ONE thing. */
function sealProgramme({ setup: mutateSetup = null, state: mutateState = null } = {}) {
  const varied = variedProgramme(PHONE.setup);
  if (mutateSetup) mutateSetup(varied);
  const state = variedLegacyState(varied);
  if (mutateState) mutateState(state);
  return { sealed: sealInventedBundle(varied, { state }), setup: varied, state };
}

const openEra = async (tag, day) => {
  const scope = scopeFor(tag);
  const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(instantOn(day)), ...scope });
  return { era, scope };
};

/* THE CALL SEQUENCE THE IMPORT SCREEN MAKES, with this lane's execution
   calendar. Identical in order to support.mjs admit(). */
async function admitAt(era, sealed, options) {
  const { day, namespace, athleteId, deviceId } = options;
  const { carried, platform } = await carry(era, sealed);
  if (!carried.imported) return { admitted: false, stage: 'custody', code: carried.code };
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository,
    namespace, athleteId, deviceId,
    producerRegistry: producerRegistryFor({ platform, context: held.context,
      materialDigest: held.materialDigest }, { days: DAYS }),
    asOf: () => day, platform });
  let review;
  try { review = await controller.reviewSource(carried.name); }
  catch (error) { return { admitted: false, stage: 'review', code: error.code || error.message }; }
  /* Naming the key with an undefined value is the question he never answered,
     and it must not collapse into the default Yes. */
  const answers = !Object.hasOwn(options, 'prefixAnswer')
    ? { identityConfirmed: true, prefixAnswer: true }
    : options.prefixAnswer === undefined ? { identityConfirmed: true }
      : { identityConfirmed: true, prefixAnswer: options.prefixAnswer };
  const prepared = await controller.prepareSource(review, answers);
  if (prepared.profile !== 'earned/local-source-qualification/v1') {
    return { admitted: false, stage: 'prepare', name: carried.name,
      issues: clone(prepared.issues || []), families: clone(prepared.families || []),
      codes: (prepared.issues || []).map(issue => issue.code) };
  }
  const capability = localSourceCommitCapability(prepared);
  await capability.publish();
  const settled = await capability.reconcile();
  return { admitted: true, name: carried.name, platform,
    view: await controller.view(settled) };
}

async function setupOpOf(era) {
  const loaded = await era.generation();
  const ops = Object.values(loaded.generation.collections.ops || {});
  const setup = ops.filter(op => op.payload?.profile === 'earned/first-run-setup/v1');
  assert.equal(setup.length, 1, 'exactly one first-run document');
  return setup[0];
}

/* THE DOCUMENT UNDER TEST IS THE ONE THE SCREENS PRODUCE (spec 5 (a) 1). */
test('PF-0 - the phone\'s setup document comes from the shipped reducer: '
  + 'split.from is the day setup was completed and every lift carries the same '
  + 'one set count and the same one rep target', () => {
  assert.equal(PHONE.setup.split.from, SETUP_DAY);
  assert.equal(new Set(PHONE.setup.exercises.map(e => e.sets)).size, 1);
  assert.equal(new Set(PHONE.setup.exercises.map(e => e.hi)).size, 1);
  assert.deepEqual(PHONE.setup.exercises.map(e => e.id),
    ['db-bench', 'lat-pulldown', 'leg-press']);
  const file = variedProgramme(PHONE.setup);
  assert.ok(file.split.from < PHONE.setup.split.from, 'the file started earlier');
  assert.equal(new Set(file.exercises.map(e => e.sets)).size, 3, 'per-lift set counts');
  assert.equal(new Set(file.exercises.map(e => e.hi)).size, 3, 'per-lift rep targets');
  assert.deepEqual(file.exercises.map(e => e.day), PHONE.setup.exercises.map(e => e.day));
  assert.deepEqual(file.exercises.map(e => e.mg), PHONE.setup.exercises.map(e => e.mg));
  assert.notDeepEqual(file.priority_muscles, PHONE.setup.priority_muscles);
});

/* CELL (a), CONTROLLER HALF. The owner's own case: a fresh-start phone set up
   yesterday admits the old app's file, and what lands is the FILE's programme.
   RED against the pre-fix tree with exactly LOCAL_SOURCE_PROGRAMME_UNRESOLVED,
   which is the refusal he saw on 2026-09-17. */
test('PF-a - the owner\'s own bundle ADMITS, F4 is retained, and the admitted '
  + 'state carries the FILE\'s set counts, rep targets, increments, ladders, '
  + 'tags and priorities', async () => {
  const { era, scope } = await openEra('owner', SETUP_DAY);
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const op = await setupOpOf(era);
  const file = sealProgramme();
  const result = await admitAt(era, file.sealed, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, true,
    'the owner\'s own history was refused: ' + JSON.stringify(result.codes || result.code));
  const f4 = result.view.families.filter(row => row.op_id === op.op_id);
  assert.deepEqual(f4.map(row => row.family + ':' + row.state), ['F4:retained'],
    'the phone\'s own setup record is RETAINED once the proof stands');
  const state = result.view.state;
  for (const ex of file.state.exercises) {
    const landed = state.exercises.find(e => e.id === ex.id);
    assert.ok(landed, 'the file\'s lift ' + ex.id + ' is in the admitted state');
    assert.equal(landed.sets, ex.sets, ex.id + ' set count is the file\'s');
    assert.equal(landed.hi, ex.hi, ex.id + ' rep target is the file\'s');
    assert.equal(landed.inc, ex.inc, ex.id + ' increment is the file\'s');
    assert.deepEqual(landed.steps, ex.steps, ex.id + ' ladder is the file\'s');
    const document = PHONE.setup.exercises.find(e => e.id === ex.id);
    assert.notEqual(landed.sets === document.sets && landed.hi === document.hi, true,
      ex.id + ' must not have taken the document\'s numbers');
  }
  assert.deepEqual(state.priority_muscles, VARIED_PRIORITIES.slice(),
    'state.priority_muscles after admission is the FILE\'s array');
  assert.deepEqual(state.split.map(p => p.from), [file.setup.split.from],
    'the admitted split is the file\'s own period, start date and all');
  /* THE PROGRAMME DIGEST INPUT (spec 1.3 third note, 5 (a)). The record of what
     was admitted must not narrow with the comparison: the digest input carries
     `id` and all seven per-lift members, with the FILE's values. Recomputed
     here from the admitted state, so a projection that dropped a member would
     produce a different digest and this cell would go red. */
  /* P3-REAL-SHAPE. `n` JOINS THE PROJECTION and `lift_correspondence` joins the
     basis: after option A the athlete's own name for a lift is part of what was
     admitted, and which setup lift each file lift answers for is part of it too
     (spec 2.3). The digest therefore CHANGES SHAPE, which the spec names as a
     risk (6.2 (3)): every recorded basis is bound to the old shape. There are
     no such devices - the owner's import has never been committed. */
  const PROJECTED = ['id', 'n', 'day', 'mg', 'sets', 'hi', 'inc', 'steps', 'head', 'secondary'];
  const expected = { op_id: op.op_id, split: clone(state.split),
    exercises: state.exercises.map(ex => Object.fromEntries(PROJECTED
      .filter(k => Object.hasOwn(ex, k)).map(k => [k, clone(ex[k])]))),
    priority_muscles: clone(state.priority_muscles ?? []),
    lift_correspondence: Object.fromEntries(PHONE.setup.exercises
      .map(row => [row.id, row.id])) };
  for (const row of expected.exercises)
    assert.deepEqual(Object.keys(row).filter(k => k !== 'head' && k !== 'secondary'),
      ['id', 'n', 'day', 'mg', 'sets', 'hi', 'inc', 'steps'],
      'every lift carries its id, its name and all seven members in the digest input');
  assert.equal(result.view.basis.programme_digest,
    Profile.digest(result.platform.hash, 'earned/local-source-programme/v1', expected),
    'the committed programme digest is the digest of the FILE\'s own programme');
  const after = await durable(era);
  assert.equal(after.applied, true);
  assert.equal(after.basis, true);
  era.close();
});

/* The refusal shape every negative cell below asserts: ONE issue, its own
   field, and nothing written. */
async function refuses(tag, seal, expectedIssue) {
  const { era, scope } = await openEra(tag, SETUP_DAY);
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const before = await durable(era);
  const result = await admitAt(era, seal, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, false, tag + ' was admitted');
  assert.equal(result.stage, 'prepare');
  assert.deepEqual(result.issues, [expectedIssue],
    tag + ': the controller answered ' + JSON.stringify(result.issues));
  const after = await durable(era);
  assert.equal(after.ops, before.ops, 'an operation was minted');
  assert.equal(after.revision, before.revision + 1, 'only the custody write stands');
  assert.equal(after.applied, false);
  assert.equal(after.basis, false);
  era.close();
  return result;
}

/* CELL (b), INVERTED BY P3-REAL-SHAPE (DECISIONS:520 option A, accepted :521).
   BEFORE: a file that listed a different number of lifts refused `exercises`,
   and a file that substituted one id refused `exercise_id` naming the PHONE's
   own lift. AFTER: the file's lift list IS the athlete's lift list. The count
   comparison and the per-lift id multiset equality are both GONE, and what
   happens instead is that the document lift with no correspondent is kept as an
   inactive tombstoned lift so nothing of his is lost (spec 2.4). */
test('PF-b1 (INVERTED) - a file that lists FEWER lifts than the phone ADMITS, '
  + 'and the lift the file does not hold is kept as a retired lift', async () => {
  const { era, scope } = await openEra('missing-count', SETUP_DAY);
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  let gone = null;
  const file = sealProgramme({ state: s => {
    gone = s.exercises.pop();
    for (const day of Object.values(s.sessionLog))
      day.entries = day.entries.filter(e => e.id !== gone.id);
    /* A well-formed old-app state does not keep an order entry for a lift it no
       longer lists, so the file's own exOrder loses it too: what this cell
       claims about exOrder is about the APPENDED lift, not about a dangling id
       the fixture left behind. */
    s.exOrder = { U: s.exOrder.U.filter(x => x !== gone.id),
      L: s.exOrder.L.filter(x => x !== gone.id) };
  } });
  const result = await admitAt(era, file.sealed, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.issues || result.code));
  const state = result.view.state;
  assert.equal(state.exercises.some(e => e.id === gone.id), true, 'his lift was dropped');
  assert.equal((state.retirements || {})[gone.id], IMPORT_DAY, 'it was not tombstoned');
  assert.equal(state.exOrder.U.includes(gone.id), false);
  assert.equal(state.exOrder.L.includes(gone.id), false);
  era.close();
});

test('PF-b2 (INVERTED) - a file that carries one lift under a DIFFERENT id but '
  + 'the SAME name ADMITS, and the lift lands under the FILE\'s id because the '
  + 'correspondence is by name and not by id', async () => {
  const { era, scope } = await openEra('substituted-id', SETUP_DAY);
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const file = sealProgramme({ state: s => {
    const row = s.exercises[0], was = row.id;
    row.id = 'db-bench-other';
    for (const day of Object.values(s.sessionLog))
      for (const entry of day.entries) if (entry.id === was) entry.id = row.id;
    s.exOrder = { U: s.exOrder.U.map(x => (x === was ? row.id : x)),
      L: s.exOrder.L.map(x => (x === was ? row.id : x)) };
  } });
  const result = await admitAt(era, file.sealed, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.issues || result.code));
  const state = result.view.state;
  assert.equal(state.exercises.some(e => e.id === 'db-bench-other'), true);
  /* Corresponded by NAME, so the phone's own row is not kept as a stranger. */
  assert.equal(state.exercises.some(e => e.id === 'db-bench'), false);
  assert.equal(result.view.basis.programme_digest.length > 0, true);
  era.close();
});

/* THE NEGATIVE THAT SURVIVES, and it is the one that always mattered: TWO lifts
   under ONE id is a file the engine cannot read, whatever the ids are. */
test('PF-b3 (NEW) - two lifts of the FILE sharing one id still refuse '
  + 'exercise_id, naming the id they share', async () => {
  const file = sealProgramme({ state: s => {
    const kept = s.exercises[0].id, was = s.exercises[1].id;
    s.exercises[1].id = kept;
    const remap = x => (x === was ? kept : x);
    s.exOrder = { U: s.exOrder.U.map(remap), L: s.exOrder.L.map(remap) };
    for (const day of Object.values(s.sessionLog))
      for (const entry of day.entries) entry.id = remap(entry.id);
  } });
  await refuses('duplicate-id', file.sealed,
    { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'exercise_id',
      exercise_id: 'db-bench' });
});

/* CELL (c), INVERTED BY P3-REAL-SHAPE. BEFORE: a lift the file filed on the
   other day refused `day`, and one filed under another muscle group refused
   `mg`; both were the `fields=['day','mg']` comparison. AFTER: where a lift
   sits and what it trains are the FILE's answer, not the phone's - that is what
   "the file wins" means - and what is still proved is only that the engine can
   read them at all. */
test('PF-c1 (INVERTED) - a lift the file files on the other training day ADMITS, '
  + 'and lands on the FILE\'s day', async () => {
  const { era, scope } = await openEra('wrong-day', SETUP_DAY);
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const file = sealProgramme({ setup: v => { v.exercises[0].day = 'L'; } });
  const result = await admitAt(era, file.sealed, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.issues || result.code));
  assert.equal(result.view.state.exercises.find(e => e.id === 'db-bench').day, 'L');
  assert.equal(PHONE.setup.exercises.find(e => e.id === 'db-bench').day, 'U',
    'the document must still say U, or this cell proves nothing');
  era.close();
});

test('PF-c1n (NEW) - a lift on a day that is NEITHER U NOR L still refuses '
  + '`day`, naming the lift', async () => {
  const file = sealProgramme({ state: s => { s.exercises[0].day = 'X'; } });
  await refuses('unknown-day', file.sealed,
    { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'day', exercise_id: 'db-bench' });
});

test('PF-c2 (INVERTED) - a lift the file files under another muscle group '
  + 'ADMITS, and lands under the FILE\'s muscle group', async () => {
  const { era, scope } = await openEra('wrong-mg', SETUP_DAY);
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const file = sealProgramme({ setup: v => { v.exercises[0].mg = 'triceps'; } });
  const result = await admitAt(era, file.sealed, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.issues || result.code));
  assert.equal(result.view.state.exercises.find(e => e.id === 'db-bench').mg, 'triceps');
  era.close();
});

/* CELL (d). THE BOUND. What the old equality was silently doing: a file whose
   week starts TOMORROW could never match a document dated today, so it could
   never be admitted and then dead-end the athlete at WORKOUT_SPLIT_NOT_IN_FORCE
   (workout-host.mjs:39-48). The bound keeps that impossible by name. */
test('PF-d1 - the file\'s single split period starts TOMORROW: field split.from',
  async () => {
    const file = sealProgramme({ setup: v => { v.split.from = NEXT_DAY; } });
    await refuses('future-from', file.sealed,
      { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'split.from' });
  });

test('PF-d2 - two periods, one in force and one dated TOMORROW: field split.from, '
  + 'because the bound is per period and not per state', async () => {
    const file = sealProgramme({ state: s => {
      s.split = [s.split[0], { from: NEXT_DAY, map: clone(s.split[0].map) }];
    } });
    await refuses('future-period', file.sealed,
      { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'split.from' });
  });

test('PF-d3 (the boundary) - a period dated exactly TODAY ADMITS, so the bound is '
  + 'proved to be "not after today" and not "strictly before"', async () => {
    const { era, scope } = await openEra('today-from', SETUP_DAY);
    await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
    const file = sealProgramme({ setup: v => { v.split.from = IMPORT_DAY; } });
    const result = await admitAt(era, file.sealed, { day: IMPORT_DAY, ...scope });
    assert.equal(result.admitted, true,
      'a period in force today was refused: ' + JSON.stringify(result.issues || result.code));
    assert.deepEqual(result.view.state.split.map(p => p.from), [IMPORT_DAY]);
    era.close();
  });

/* B-C, THE PERIOD SHAPE. The old equality was shape-closed by accident; P-A and
   B-A alone would let a member no rule has looked at into state.split and into
   the programme digest. */
test('PF-d4 - a period carrying a third member refuses: field split', async () => {
  const file = sealProgramme({ state: s => { s.split[0].label = 'SYNTHETIC'; } });
  await refuses('open-period', file.sealed,
    { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'split' });
});

/* CELL (e). A STRANGER'S PROGRAMME, under the rule as it now stands. */
/* P3-REAL-SHAPE RE-POINT. STRANGER_WEEK_SETUP carries a stranger's NAME as well
   as a stranger's week, and P-LABEL is tested BEFORE anything else (spec 2.3,
   review R1 N9), so that bundle now refuses by the NAME. Both cells are kept:
   the week keeps its own subject by carrying this phone's label. */
test('PF-e1 - a bundle whose week differs in one day letter, under THIS phone\'s '
  + 'own name: field split.map', async () => {
    const same = clone(STRANGER_WEEK_SETUP);
    same.athlete_label = PHONE.setup.athlete_label;
    await refuses('stranger-week', sealInventedBundle(same),
      { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'split.map' });
  });

test('PF-e1n (NEW) - a bundle that differs in the week AND in the name is '
  + 'refused BY THE NAME, because P-LABEL is tested first', async () => {
    await refuses('stranger-week-and-name', sealInventedBundle(STRANGER_WEEK_SETUP),
      { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'athlete_label' });
  });

/* INVERTED BY P3-REAL-SHAPE (spec 2.1 P-LABEL). BEFORE: a bundle differing only
   in athlete_label and in the RETAINED fields ADMITTED at the controller and
   was then SILENTLY NOT ADOPTED by the page - the athlete would simply keep
   seeing his setup document's numbers, with nothing on screen to read. That
   silence is the half of gap 3 P-LABEL exists to remove: a file that names
   someone else is now REFUSED, BY THAT NAME, with its own sentence, and the
   import retracts.
   WHAT IS NOT CLOSED, and the PM should keep reading it (spec 6.2 (5)): a file
   that names NOBODY still takes this phone's label on the owner's identity Yes
   alone. P-LABEL cannot fire on any old-app file, because the old app has no
   athlete_label anywhere. */
test('PF-e2 (INVERTED) - a stranger\'s bundle that differs only in label is '
  + 'REFUSED by name, field athlete_label, and nothing is adopted', async () => {
    const { era, scope } = await openEra('stranger-retained', SETUP_DAY);
    await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
    const stranger = sealInventedBundle(STRANGER_SETUP);
    const result = await admitAt(era, stranger, { day: IMPORT_DAY, ...scope });
    assert.equal(result.admitted, false, 'a stranger\'s named file was admitted');
    assert.deepEqual(result.issues,
      [{ code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'athlete_label' }]);
    const loaded = await era.generation();
    assert.equal(admittedLocalSourceBasis(loaded.generation,
      { athleteLabel: PHONE.setup.athlete_label, namespace: scope.namespace }), null);
    assert.equal(admittedLocalSourceBasis(loaded.generation,
      { athleteLabel: STRANGER_SETUP.athlete_label, namespace: scope.namespace }), null,
    'nothing at all was adopted');
    const after = await durable(era);
    assert.equal(after.applied, false);
    assert.equal(after.basis, false);
    era.close();
  });

/* ===== THE DIAGNOSIS CELLS, CARRIED FORWARD (spec 4.3, 5 (h)) =====
   rebuild/lanes/d/p3-port-refusal/ lives on rebuild/d-p3-port-refusal and is
   left as the record of what it was. Its cells are carried here, and where the
   rule changed their expected results INVERT, which is the point.

   D-PR-0 and D-PR-6 are below, unchanged in substance.
   D-PR-1 and D-PR-2 are PF-a above: the two used to differ only in whether the
     phone's document carried the file's own start date, and under the new rule
     the one the SCREENS can write is the one that admits. D-PR-1's document,
     which the screens cannot write, is retired with the rewrite spec 5 (h)
     requires rather than kept as a second green.
   D-PR-3 is PF-e1 and PF-e2: a stranger's file is now told apart from the
     owner's own by the week, and the old stranger fixture's admission is
     written down instead of hidden.
   D-PR-4 a/b/c are below, INVERTED.
   D-PR-5's delta is re-measured in capture-codes.test.mjs D-PF-f1 and D-PF-f2:
     with pre-import writes the surviving delta is no longer the programme code
     but the recorded capture's set count, which is a finding, not a pass.
   D-PRR-1 and D-PRR-2 are in owner-route.test.mjs, both rewritten. */

test('D-PR-0 - the file carries the OLD app\'s own start date and the phone\'s '
  + 'document carries the day setup was completed, and they differ in NOTHING '
  + 'the new rule proves', () => {
  const file = variedProgramme(PHONE.setup);
  assert.notEqual(file.split.from, PHONE.setup.split.from);
  assert.deepEqual(file.split.map, PHONE.setup.split.map);
  assert.deepEqual(file.exercises.map(e => [e.id, e.day, e.mg]),
    PHONE.setup.exercises.map(e => [e.id, e.day, e.mg]));
});

/* THE IDENTITY / ORDERING ANSWER WAS NEVER THE LEVER, and still is not: with no
   native Start on this phone the question is not required, and the programme
   rule has already run either way. INVERTED: all three now ADMIT. */
for (const [label, prefixAnswer] of [['a Yes', true], ['a No', false],
  ['no answer at all', undefined]]) {
  test('D-PR-4 (' + label + ', INVERTED) - the owner\'s own bundle admits '
    + 'whatever he answers', async () => {
    const { era, scope } = await openEra('answer-' + String(prefixAnswer), SETUP_DAY);
    await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
    const file = sealProgramme();
    const result = await admitAt(era, file.sealed,
      { day: IMPORT_DAY, prefixAnswer, ...scope });
    assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code));
    era.close();
  });
}

/* D-PR-6, UNCHANGED. The product law behind the old refusal is not touched by
   this ticket: whatever the athlete answers, the setup screens write TODAY as
   split.from and one global set count and rep target. Spec 6 says setup-model
   does not move, and this is the cell that holds it to that. */
test('D-PR-6 - the setup screens still write split.from = the day setup was '
  + 'completed, and still one sets and one hi for every lift', () => {
  for (const today of ['2026-09-16', '2026-09-17', '2027-01-04']) {
    const built = shippedSetup({ today });
    assert.equal(built.setup.split.from, today, 'the flow found some other start date');
    assert.equal(new Set(built.setup.exercises.map(e => e.sets)).size, 1);
    assert.equal(new Set(built.setup.exercises.map(e => e.hi)).size, 1);
  }
});

/* ===== REWRITTEN BY P3-PORT-FIX-2 (DECISIONS:509 NOTE 4 / D-PF-n4) =====

   THE GAP THIS CELL RECORDED IS CLOSED IN ONE DIRECTION, AND THE CELL NOW
   ASSERTS THE REFUSAL. Before P3-PORT-FIX every retained number had to EQUAL
   the phone's document, and the document has been through createCleanInitState,
   so the file's numbers were incidentally bounded to values the engine accepts.
   Retaining them dropped that bound. The PM ruled that admission applies THE
   DOCUMENT CONSTRUCTOR'S OWN BOUNDS to the retained members, and nothing else.

   WHAT THE CONSTRUCTOR ACTUALLY BOUNDS, read line by line at
   rebuild/m4/workout/athlete-state.cjs:118-135: every member of
   REQUIRED_EXERCISE must be PRESENT (the `closed` check at :119); `sets` and
   `hi` must be positiveInt (:95, Number.isSafeInteger and > 0); `inc` must be a
   finite number > 0 (:129); `steps` must be a non-empty array of finite numbers
   > 0 in strictly ascending order (:130-132). THERE IS NO UPPER BOUND ON
   ANYTHING. So `sets: 0` is refused and `sets: 40` is not, and this cell says
   both out loud rather than pretending a ceiling exists. Inventing one here
   would be a new rule and belongs to the PM, not to a build.

   THE POSITIVE SIDE of this ruling is PF-a at the head of this file: a file
   whose varied per-lift numbers are all in bounds still admits, and what lands
   in the admitted state is the FILE's. D-PF-n5 below carries the other three
   bounded members.

   THIS CELL IS A PM GATE TRIP-WIRE (fix round, review R1 NOTE 5). The warning
   used to sit on D-PF-f3, which no longer measures a refusal now that f1, f2
   and f3 all admit; this cell and D-PF-f5 are where a refusal is still
   measured. It must not be edited away, and the `sets: 40` half must not be
   turned into a refusal without a PM ruling: the constructor has no ceiling,
   and inventing one here would be a new rule written by a build. */
test('D-PF-n4 (REWRITTEN by P3-PORT-FIX-2) - a file whose set count is zero is '
  + 'REFUSED with field sets and the lift named, and a file whose set count is '
  + 'forty is ADMITTED, because the constructor bounds the floor and not the '
  + 'ceiling', async () => {
  /* THE FLOOR. `sets: 0` is exactly what athlete-state.cjs:126 refuses
     (CLEAN_INIT_EXERCISE_REQUIRED / sets), and admission now refuses it too,
     under its own code and naming the lift. */
  const zero = sealProgramme({ state: state => {
    for (const ex of state.exercises) {
      if (ex.id !== 'db-bench') continue;
      ex.sets = 0; ex.last = [];
    }
    for (const day of Object.values(state.sessionLog || {}))
      for (const entry of day.entries) {
        if (entry.id !== 'db-bench') continue;
        entry.sets = 0; entry.reps = [];
      }
  } });
  await refuses('bound-sets-zero', zero.sealed,
    { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'sets', exercise_id: 'db-bench' });

  /* THE CEILING THAT IS NOT THERE. */
  const { era, scope } = await openEra('unbounded-sets', SETUP_DAY);
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  /* The number is written into the FILE'S OWN STATE after it is built, the way
     it was before, because the lane's builder runs createCleanInitState and a
     value the constructor refuses cannot be built through it. FORTY is not one
     of those: positiveInt(40) is true, so the constructor accepts it and, under
     the PM's ruling, so does admission. The file's recorded sets are carried
     along so the history stays consistent with its own programme. */
  const ABSURD = { 'lat-pulldown': 40 };
  const file = sealProgramme({ state: state => {
    for (const ex of state.exercises) {
      if (!Object.hasOwn(ABSURD, ex.id)) continue;
      ex.sets = ABSURD[ex.id];
      ex.last = Array.from({ length: ex.sets }, () => 8);
    }
    for (const day of Object.values(state.sessionLog || {}))
      for (const entry of day.entries) {
        if (!Object.hasOwn(ABSURD, entry.id)) continue;
        entry.sets = ABSURD[entry.id];
        entry.reps = Array.from({ length: ABSURD[entry.id] }, () => 8);
      }
  } });
  const result = await admitAt(era, file.sealed, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, true,
    'a CEILING has landed on the retained numbers. The constructor has none '
    + '(athlete-state.cjs:95,:126), so whoever added one added a rule the '
    + 'document does not carry: take it to the PM rather than editing this '
    + 'cell: ' + JSON.stringify(result.issues || result.code));
  const loaded = await era.generation();
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: scope.namespace });
  assert.notEqual(adopted, null, 'the page did not adopt the admitted import');
  for (const [id, sets] of Object.entries(ABSURD))
    assert.equal(adopted.exercises.find(e => e.id === id).sets, sets,
      id + ': the number rode all the way into the adopted basis');
  era.close();
});

/* D-PF-n5, NEW (P3-PORT-FIX-2, DECISIONS:509 NOTE 4). THE OTHER THREE BOUNDED
   MEMBERS, each under its own field name, so the four values the ruling adds to
   the closed vocabulary of spec 3.1 are each executed and not merely declared.
   Every violation below is one the DOCUMENT CONSTRUCTOR itself refuses, and
   none of them is a bound this build invented:
     hi: 0      - athlete-state.cjs:127, positiveInt
     inc: 0     - athlete-state.cjs:129, a finite number > 0
     steps desc - athlete-state.cjs:130-132, strictly ascending
   The `steps` violation REVERSES the file's own ladder rather than replacing
   it, so the same loads are present and only their order is wrong: the refusal
   is then the ordering rule and nothing else. */
const BOUND_VIOLATIONS = [
  ['hi', 'db-bench', ex => { ex.hi = 0; }],
  ['inc', 'lat-pulldown', ex => { ex.inc = 0; }],
  ['steps', 'leg-press', ex => { ex.steps = ex.steps.slice().reverse(); }],
];

for (const [field, lift, mutate] of BOUND_VIOLATIONS)
  test('D-PF-n5 (' + field + ') - a file carrying a ' + field + ' the document '
    + 'constructor refuses is refused at admission, naming the field and the '
    + 'lift', async () => {
    const file = sealProgramme({ state: state => {
      for (const ex of state.exercises) if (ex.id === lift) mutate(ex);
    } });
    await refuses('bound-' + field, file.sealed,
      { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field, exercise_id: lift });
  });
