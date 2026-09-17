/* P3-REAL-SHAPE - THE MEASUREMENT, part 1: THE OWNER'S WALK AND THE BRACKET.

   Every cell here runs against the UNCHANGED S7 product and asserts the CURRENT
   behaviour. They are the measurement, not the bar: the build flips them.
   Each cell names its finding in its own name.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Fixture, PHONE, PHONE_ID, variant, sealed, walk, durable, reopen }
  from './real-shape-support.mjs';
import { listImportRetractions } from '../../../m3/w6/local/browser-entry.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

/* THE SHAPE IS THE OLD APP'S, BEFORE ANY OF IT REACHES A BUNDLE. */
test('D-RS-0 - the fixture of record has the OLD app\'s shape: split entries '
  + 'carry a third member `why`, lift ids are short handles, there is no '
  + 'athlete_label, no priority_muscles and no `steps` on any lift', () => {
  const state = variant(0);
  assert.equal(state.v, 60, 'the seed is authored already-current at SCHEMA_V');
  assert.ok(Array.isArray(state.split) && state.split.length === 1);
  assert.deepEqual(Object.keys(state.split[0]).sort(), ['from', 'map', 'why']);
  assert.equal(typeof state.split[0].why, 'string');
  assert.equal(Object.hasOwn(state, 'athlete_label'), false);
  assert.equal(Object.hasOwn(state, 'priority_muscles'), false);
  for (const e of state.exercises) assert.equal(Object.hasOwn(e, 'steps'), false, e.id);
  assert.equal(state.exercises.length, 16);
  /* The ids are handles; the phone mints slugs from the same names. */
  assert.equal(state.exercises.find(e => e.n === 'Hack squat').id, 'hack');
  assert.equal(PHONE_ID.hack, 'hack-squat');
  assert.equal(PHONE.setup.exercises.length, 16);
  assert.deepEqual(PHONE.setup.exercises.map(e => e.id).sort(),
    Fixture.LIFTS.map(l => PHONE_ID[l.id]).sort());
});

/* (e) THE mg VOCABULARY. Both sides spell the eleven labels the engine's own
   seed spells, so nothing in the muscle group is a gap. */
test('D-RS-e - the OLD app\'s mg values are already the setup flow\'s own '
  + 'vocabulary: mg is NOT one of the gaps', async () => {
  const { MG_LABELS } = await import('../../../m3/w7-preview/today/setup-model.mjs');
  for (const lift of Fixture.LIFTS)
    assert.equal(MG_LABELS.includes(lift.mg), true, lift.id + ' mg=' + lift.mg);
});

/* THE OWNER'S PATH, STEP 0. The bundle carries the REAL shape and it refuses
   where his screenshot refused, by name. */
test('D-RS-a0 (the owner\'s screenshot, reproduced) - the real-shape bundle '
  + 'unlocks, takes the identity Yes, and refuses at Import this history on '
  + 'field `split`, because the file\'s period carries a third member `why`', async () => {
  const out = await walk('a0', sealed(0));
  assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'split', field: 'split' }, 'the screen said something else');
  assert.equal(out.stage, 'pick', 'the picker was not reset');
  assert.equal(out.line, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED (split) This file was '
    + 'written by a different training week than the one you set up on this phone. '
    + 'Nothing on this phone was changed.');
  const after = await durable(out.kit.era);
  assert.equal(after.applied, false);
  assert.equal(after.basis, false);
  const taken = await listImportRetractions(out.kit.era.client);
  assert.equal(taken.length, 1);
  assert.equal(taken[0].reason, 'review-refused');
  out.kit.close();
});

/* (a) ONE VARIABLE: `why` removed from every period. */
test('D-RS-a (gap 1 closed alone) - with `why` stripped the week passes and the '
  + 'NEXT refusal is `exercise_id`: the file\'s short handles are not the ids '
  + 'slugOf minted from the same names', async () => {
  const out = await walk('a1', sealed(1));
  assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'exercise_id lateral-machine', field: 'exercise_id' });
  assert.equal(PHONE_ID.lateral, 'lateral-machine');
  assert.equal(variant(1).exercises[0].id, 'lateral');
  out.kit.close();
});

/* (b) THE IDS REWRITTEN TO THE PHONE'S SLUGS. Two more fields appear that the
   PM ruling did not name, and both are the BOUNDED probe of P3-PORT-FIX-2. */
test('D-RS-b1 (gap 3, unlisted) - with the file\'s ids rewritten to the phone\'s '
  + 'slugs the refusal is `steps`: the OLD app has no rung ladder on any lift, '
  + 'and the retained-value bound asks the constructor for one', async () => {
  const out = await walk('b1', sealed(2));
  assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'steps lateral-machine', field: 'steps' });
  for (const e of variant(2).exercises) assert.equal(Object.hasOwn(e, 'steps'), false);
  out.kit.close();
});

test('D-RS-b2 (gap 4, unlisted) - with a ladder added the refusal is `inc` on '
  + 'the bodyweight lift: the OLD app writes inc: null where there is no plate '
  + 'to add, and the constructor requires a finite positive increment', async () => {
  const out = await walk('b2', sealed(3));
  assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'inc supported-leg-raise-medicine-ball-pad', field: 'inc' });
  assert.equal(variant(3).exercises.find(e => e.id === PHONE_ID.hanging).inc, null);
  out.kit.close();
});

test('D-RS-b3 - with the ladder and the increment supplied the real-shape file '
  + 'ADMITS: nothing else in the old app\'s programme shape refuses', async () => {
  const out = await walk('b3', sealed(4));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  assert.equal(out.stage, 'done');
  const after = await durable(out.kit.era);
  assert.equal(after.applied, true);
  assert.equal(after.basis, true);
  out.kit.close();
});

/* (c) IT ADMITS AND IS NOT ADOPTED. The screen says nothing; the Train screen
   keeps the setup numbers. This is the silent half of DECISIONS:520 gap 3. */
test('D-RS-c (gap 3, measured) - an ADMITTED real-shape import is NOT ADOPTED: '
  + 'the old app carries no athlete_label, local-source-basis.mjs:54 returns '
  + 'null, and the page falls back to the setup document with no refusal shown', async () => {
  const out = await walk('c', sealed(4));
  assert.equal(out.refusal, null);
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  assert.equal(Object.hasOwn(state, 'athlete_label'), false,
    'the migrated file must carry no label, or this cell proves nothing');
  assert.equal(admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: out.kit.scope.namespace }), null,
    'the page adopted a file with no label');
  /* The same generation, asked WITHOUT a label, does adopt: the only thing
     withholding adoption is the label comparison. */
  assert.notEqual(admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: null, namespace: out.kit.scope.namespace }), null);
  out.kit.close();
});

/* (d) THE LABEL SUPPLIED. */
test('D-RS-d (gap 3, the other side) - with an athlete_label equal to the '
  + 'phone\'s first-run label the same file is ADOPTED, and the next morning\'s '
  + 'card carries the FILE\'s lifts and per-lift set counts', async () => {
  const out = await walk('d', sealed(5));
  assert.equal(out.refusal, null);
  out.kit.close();
  const next = await reopen(out.kit.indexedDB, out.kit.scope, '2026-09-20');
  const loaded = await next.era.generation();
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: out.kit.scope.namespace });
  assert.notEqual(adopted, null, 'the page did not adopt');
  const file = variant(5);
  for (const ex of file.exercises) {
    const landed = adopted.exercises.find(e => e.id === ex.id);
    assert.equal(landed.sets, ex.sets, ex.id);
    assert.equal(landed.hi, ex.hi, ex.id);
    assert.equal(landed.n, ex.n, ex.id);
  }
  /* 2026-09-20 is the Sunday the FILE's own split map calls U. */
  const card = await next.booted.workout.gym.read();
  const fileU = file.exercises.filter(e => e.day === 'U').reduce((n, e) => n + e.sets, 0);
  const phoneU = PHONE.setup.exercises.filter(e => e.day === 'U').reduce((n, e) => n + e.sets, 0);
  assert.notEqual(fileU, phoneU, 'the two documents must disagree');
  assert.equal(card.phase, 'ready', card.code || card.phase);
  assert.equal(card.total, fileU, 'the card is not the FILE\'s');
  next.close();
});

/* (f) THE EXTRA EXERCISE MEMBERS. Nothing on the admission or the adoption path
   refuses one or drops one: they ride into the admitted state unchanged. */
test('D-RS-f - the OLD app\'s extra exercise members (lastMeta, setup, setupAt, '
  + 'std, own, first, debutNote, pendingThird, wSets, forks, renames, the *At '
  + 'stamps, rirHist, pauseSec) all survive the port, the migration and the '
  + 'admission unchanged: none of them is a gap', async () => {
  const out = await walk('f', sealed(5));
  assert.equal(out.refusal, null);
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  const before = variant(5);
  const extras = new Set();
  for (const source of before.exercises) {
    const landed = state.exercises.find(e => e.id === source.id);
    assert.notEqual(landed, undefined, source.id);
    for (const key of Object.keys(source)) {
      assert.equal(Object.hasOwn(landed, key), true, source.id + ' lost ' + key);
      /* `lastMeta` and `last` are the ONE exception, and they are RECOMPUTED,
         never dropped: the old app's own settle pass rebuilds each lift's last
         session block from the file's own sessionLog (the entry gains `rir`,
         `debt` is re-derived and `rirSets` carries the logged RIR). That is the
         old app's behaviour reproduced by the accepted migration, so this cell
         asserts the member is present and well formed rather than identical. */
      if (key === 'lastMeta') { assert.equal(typeof landed.lastMeta.d, 'string');
        assert.ok(Array.isArray(landed.lastMeta.reps)); }
      else if (key === 'last') assert.ok(landed.last === null || Array.isArray(landed.last));
      /* `forks` and `renames` are ENRICHED, not dropped: the accepted migration
         attaches the engine's own `ops` list to each fork entry. The member
         survives and grows; nothing the file said is lost. */
      else if (key === 'forks' || key === 'renames') {
        assert.ok(Array.isArray(landed[key]) && landed[key].length === source[key].length);
        for (let i = 0; i < source[key].length; i += 1)
          for (const member of Object.keys(source[key][i]))
            assert.deepEqual(landed[key][i][member], source[key][i][member], source.id + '.' + key);
      }
      /* `steps` is the second exception and is REPAIRED, not dropped: the
         accepted migration's rung normaliser inserts the lift's own current
         working load into the ladder (and a lower rung where the increment is
         fractional), so the ladder always contains the load the athlete is on.
         The ladder is engine-owned; a file that carries one has it repaired,
         and a file that carries NONE still has none, which is D-RS-b1. */
      else if (key === 'steps') { assert.ok(Array.isArray(landed.steps) && landed.steps.length);
        assert.ok(landed.steps.every((x, i) => x > 0 && (i === 0 || x > landed.steps[i - 1]))); }
      else assert.deepEqual(landed[key], source[key], source.id + '.' + key);
      if (!['id', 'n', 'mg', 'day', 'sets', 'hi', 'inc', 'steps', 'w'].includes(key)) extras.add(key);
    }
  }
  for (const key of ['lastMeta', 'setup', 'setupAt', 'std', 'own', 'ownNote', 'first',
    'debutNote', 'pendingThird', 'wSets', 'forks', 'renames', 'rirHist', 'pauseSec',
    'note', 'head', 'last', 'setsAt', 'wAt', 'incAt', 'hiAt'])
    assert.equal(extras.has(key), true, 'the fixture no longer carries ' + key);
  out.kit.close();
});

/* (h) WHAT THE WALK SURFACES THAT NOBODY LISTED. The old app's working load is
   not always a number, and the page's own capture producer is the v1 one. */
test('D-RS-h (gap 5, unlisted, BLOCKS THE TRAIN SCREEN) - once the real-shape '
  + 'file is adopted, a day that carries a lift whose working load is a '
  + 'configuration string (the old app\'s `BW` and `hold`) leaves the gym card '
  + 'BLOCKED on ENGINE_CAPTURE_LOAD_UNPROVEN', async () => {
  const out = await walk('h', sealed(5));
  assert.equal(out.refusal, null, 'the import must admit, or this cell proves nothing');
  out.kit.close();
  /* 2026-09-18 is the Friday the FILE's split map calls L, and the L day holds
     the bodyweight raise ('BW') and the held hack ('hold'). */
  const next = await reopen(out.kit.indexedDB, out.kit.scope, '2026-09-18');
  const card = await next.booted.workout.gym.read();
  assert.equal(card.phase, 'blocked');
  assert.equal(card.code, 'ENGINE_CAPTURE_LOAD_UNPROVEN');
  const file = variant(5);
  assert.deepEqual(file.exercises.filter(e => typeof e.w === 'string').map(e => e.w).sort(),
    ['BW', 'hold'], 'the fixture must still carry the two configuration loads');
  next.close();
});

test('D-RS-h2 (the same day, isolated) - with every configuration load replaced '
  + 'by a number the SAME day prepares and carries the FILE\'s set count, so '
  + 'the block is the load type and nothing else', async () => {
  const out = await walk('h2', sealed(7));
  assert.equal(out.refusal, null);
  out.kit.close();
  const next = await reopen(out.kit.indexedDB, out.kit.scope, '2026-09-18');
  const card = await next.booted.workout.gym.read();
  assert.equal(card.phase, 'ready', card.code || card.phase);
  const file = variant(7);
  const fileL = file.exercises.filter(e => e.day === 'L').reduce((n, e) => n + e.sets, 0);
  const phoneL = PHONE.setup.exercises.filter(e => e.day === 'L').reduce((n, e) => n + e.sets, 0);
  assert.notEqual(fileL, phoneL);
  assert.equal(card.total, fileL);
  next.close();
});
