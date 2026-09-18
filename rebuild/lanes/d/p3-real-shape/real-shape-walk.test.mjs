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

/* THE OWNER'S PATH, STEP 0. INVERTED by P3-REAL-SHAPE (DECISIONS:521).
   BEFORE: the same walk refused at Import this history on field `split`,
   because the file's period carries a third member `why` - which is the field
   the owner's own screenshot named. AFTER: `why` is the file's own note,
   retained and never read as a rule, and the walk admits. */
test('D-RS-a0 (the owner\'s screenshot, answered) - the real-shape bundle '
  + 'unlocks, takes the identity Yes, and is ADMITTED at Import this history: '
  + 'the `why` on the file\'s period is no longer a refusal', async () => {
  const out = await walk('a0', sealed(0));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  assert.equal(out.line, null, 'a refusal line was rendered');
  assert.equal(out.stage, 'done');
  const after = await durable(out.kit.era);
  assert.equal(after.applied, true);
  assert.equal(after.basis, true);
  const taken = await listImportRetractions(out.kit.era.client);
  assert.equal(taken.length, 0, 'the file was taken back');
  /* The period really does carry the member that used to refuse. */
  assert.deepEqual(Object.keys(variant(0).split[0]).sort(), ['from', 'map', 'why']);
  out.kit.close();
});

/* (a) ONE VARIABLE: `why` removed from every period. INVERTED.
   BEFORE: with `why` stripped the week passed and the NEXT refusal was
   `exercise_id`, because the file's short handles are not the ids slugOf minted
   from the same names. AFTER: the handles are the athlete's ids and nothing per
   lift is compared, so stripping `why` changes NOTHING - which is the point:
   `why` is no longer the variable that decides anything. */
test('D-RS-a (gap 1 and gap 2 closed) - with `why` stripped the same file '
  + 'admits exactly as it does with `why` present: the handle ids are no '
  + 'longer the next refusal', async () => {
  const out = await walk('a1', sealed(1));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  assert.equal(out.stage, 'done');
  assert.equal(PHONE_ID.lateral, 'lateral-machine');
  assert.equal(variant(1).exercises[0].id, 'lateral', 'the file still carries handles');
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  assert.equal(state.exercises.some(e => e.id === 'lateral'), true);
  assert.equal(state.exercises.some(e => e.id === 'lateral-machine'), false,
    'the corresponded document row was kept as its own lift');
  out.kit.close();
});

/* (b) THE IDS REWRITTEN TO THE PHONE'S SLUGS. INVERTED.
   BEFORE: the refusal was `steps`, because the OLD app has no rung ladder on
   any lift and the retained-value bound asked the constructor for one. AFTER:
   `steps` is RETAINED and bounded ONLY WHEN PRESENT (spec 2.3), because a file
   with no ladder is the normal shape of the old app and not a fault. */
test('D-RS-b1 (gap 3 closed) - a file with NO rung ladder on any lift admits: '
  + 'the ladder is bounded only when it is there', async () => {
  const out = await walk('b1', sealed(2));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  for (const e of variant(2).exercises) assert.equal(Object.hasOwn(e, 'steps'), false);
  out.kit.close();
});

/* INVERTED. BEFORE: the refusal was `inc` on the bodyweight lift, because the
   constructor requires a finite positive increment. AFTER: `inc` is bounded to
   the OLD APP'S own vocabulary - a finite number above zero, OR null, which is
   what it writes where there is no plate to add. */
test('D-RS-b2 (gap 4 closed) - a file whose bodyweight lift carries inc: null '
  + 'admits, and the null rides through to the admitted state', async () => {
  const out = await walk('b2', sealed(3));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  assert.equal(variant(3).exercises.find(e => e.id === PHONE_ID.hanging).inc, null);
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  assert.equal(state.exercises.find(e => e.id === PHONE_ID.hanging).inc, null);
  out.kit.close();
});

/* INVERTED IN ITS REASON (spec 3.3). It already admitted; the bracket step it
   seals has changed. BEFORE it was "with the ladder and the increment supplied
   the file finally admits"; the ladder and the increment are no longer what
   make it admit, so what this now seals is that adding them changes nothing. */
test('D-RS-b3 - supplying a ladder and a positive increment changes NOTHING: '
  + 'the same file admits with them and without them', async () => {
  const out = await walk('b3', sealed(4));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  assert.equal(out.stage, 'done');
  const after = await durable(out.kit.era);
  assert.equal(after.applied, true);
  assert.equal(after.basis, true);
  const bare = await walk('b3-bare', sealed(0));
  assert.equal(bare.refusal, null, JSON.stringify(bare.refusal));
  bare.kit.close();
  out.kit.close();
});

/* (c) IT ADMITS AND IS NOW ADOPTED. INVERTED.
   BEFORE: an admitted real-shape import was SILENTLY NOT ADOPTED - the old app
   carries no athlete_label, local-source-basis.mjs:54 returned null, and the
   owner saw a successful import and the setup document's numbers the next
   morning with nothing on screen to read. AFTER: a file that names nobody takes
   this installation's own first-run label when it is admitted (spec 2.4), and
   :54 is the LAST guard rather than the first. */
test('D-RS-c (gap 3 closed) - an ADMITTED real-shape import carrying no '
  + 'athlete_label is ADOPTED under this phone\'s own first-run label', async () => {
  const out = await walk('c', sealed(4));
  assert.equal(out.refusal, null);
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  assert.equal(Object.hasOwn(variant(4), 'athlete_label'), false,
    'the file must carry no label, or this cell proves nothing');
  assert.equal(state.athlete_label, PHONE.setup.athlete_label,
    'admission did not write this phone\'s label onto the admitted state');
  assert.notEqual(admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: out.kit.scope.namespace }), null,
    'the page still will not adopt');
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
   not always a number, and the page's own capture producer used to be the v1
   one, which refuses to prescribe one at all.

   THIS CELL WAS THE NAMED RECORD OF GAP 5 AND IS NOW THE RECORD OF ITS CLOSE
   (spec 3.3: "INVERTS ONLY IF PM QUESTION 1 is answered yes"). DECISIONS:521
   ruled Q1 YES subject to a measurement; q1-producer.test.mjs measured BOTH
   DIRECTIONS REFUSING, so P3-REAL-SHAPE stopped on the item and left this cell
   green as the record. DECISIONS:522 then ruled on exactly that, and
   P3-LAYOUT-V2 built it: the projector's layout law admits the v2 layout beside
   v1, the host reads each stored capture with its own adapter, and the page
   produces v2. The claim below is the SAME walk, restated to what it now
   measures; the fixture and the bracket level are untouched. */
test('D-RS-h (gap 5, CLOSED) - once the real-shape file is adopted, the day '
  + 'that carries a lift whose working load is a configuration string (the old '
  + 'app\'s `BW` and `hold`) has a READY gym card carrying the FILE\'s set '
  + 'count', async () => {
  const out = await walk('h', sealed(5));
  assert.equal(out.refusal, null, 'the import must admit, or this cell proves nothing');
  out.kit.close();
  /* 2026-09-18 is the Friday the FILE's split map calls L, and the L day holds
     the bodyweight raise ('BW') and the held hack ('hold'). */
  const next = await reopen(out.kit.indexedDB, out.kit.scope, '2026-09-18');
  const card = await next.booted.workout.gym.read();
  assert.equal(card.phase, 'ready', card.code || card.phase);
  const file = variant(5);
  assert.deepEqual(file.exercises.filter(e => typeof e.w === 'string').map(e => e.w).sort(),
    ['BW', 'hold'], 'the fixture must still carry the two configuration loads');
  const fileL = file.exercises.filter(e => e.day === 'L').reduce((n, e) => n + e.sets, 0);
  const phoneL = PHONE.setup.exercises.filter(e => e.day === 'L').reduce((n, e) => n + e.sets, 0);
  assert.notEqual(fileL, phoneL);
  assert.equal(card.total, fileL);
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
