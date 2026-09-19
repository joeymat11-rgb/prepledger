/* EW2 BUILD BRIEF, LOOP ROUND 1 FIX - BLOCKING B2, RE-MEASURED BY THE AUTHOR.

   ASTRA'S B2, in her words: "D3's recommended zero-byte route bypasses
   immutable-operation authentication and applies a saved edit to the wrong
   lift." Section 3.1 of this brief called ROUTE 1 an authenticated load and
   recommended it. This cell re-measures that claim with a program of its own
   before a word of the brief is changed.

   THE INVARIANT UNDER TEST, and it is the brief's own claim, not hers: a route
   the brief calls AUTHENTICATED must refuse the same history the product's own
   host refuses. Encrypted storage is not proof of an immutable operation's
   identity; that is the existing PE09-auth fault class
   (`durable-host.test.mjs:372`), applied here to the one member a plan edit
   stores its target in.

   THE INPUT. One edit, `update sets=5` on `press-old`, saved through the REAL
   host. Then ONE field of the stored operation is changed through the
   scaffold's encrypted repository commit - `members[0].value.edit.exercise_id`,
   from `press-old` to `row-old` - and nothing else: the operation's
   `member_set_commitment` and `canonical_content_commitment` are left exactly
   as the product wrote them. No guard is removed, no projector is patched and
   no assertion is relaxed.

   THIS CELL IS COMMITTED RED. It is the author's own reproduction of a blocking
   finding, taken before the brief is touched.

   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-b2-route1-auth.mjs         */
import assert from 'node:assert/strict';
import { laneScaffold, Model, update, DAY, NEXT, hashBasis, tagProjector }
  from './ew2b-support.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const line = (k, v) => console.log(String(k).padEnd(56) + ' ' + v);
const setsOf = (state, id) => state.exercises.find(e => e.id === id).sets;

console.log('EW2B B2: IS THE BRIEF\'S ZERO-BYTE ROUTE ACTUALLY AUTHENTICATED?');
console.log('');

const s = await laneScaffold({ tag: 'b2' });
try {
  const host = await s.host();
  const first = await host.read();
  assert.equal(first.read, true, first.code);
  const reviewed = await host.review(update({ sets: 5 }));
  assert.equal(reviewed.reviewed, true, reviewed.code);
  const saved = await host.save(reviewed.review_id);
  assert.equal(saved.ok, true, saved.code);
  line('input: saved update sets=5 on press-old', String(saved.ok));
  line('  the operation it wrote', saved.op_id);
  line('  effective', reviewed.starts_on);

  /* THE CONTROL, before anything is changed: the pending view the athlete
     would be shown, through the product's own host. */
  const controlPending = await host.read(NEXT);
  assert.equal(controlPending.read, true, controlPending.code);
  line('control pending press / row', setsOf(controlPending.state, 'press-old')
    + ' / ' + setsOf(controlPending.state, 'row-old'));
  console.log('');

  /* ONE FIELD CHANGED, THE COMMITMENTS LEFT ALONE. */
  const before = await s.generation();
  const opBefore = structuredClone(before.collections.ops[saved.op_id]);
  await s.tamper(g => { g.collections.ops[saved.op_id].members[0].value.edit.exercise_id = 'row-old'; });
  const opAfter = (await s.generation()).collections.ops[saved.op_id];
  line('the stored edit now names', opAfter.members[0].value.edit.exercise_id);
  line('its member_set_commitment is unchanged',
    String(opAfter.member_set_commitment === opBefore.member_set_commitment));
  line('its canonical_content_commitment is unchanged',
    String(opAfter.canonical_content_commitment === opBefore.canonical_content_commitment));
  console.log('');

  /* THE PRODUCT'S OWN ANSWER. */
  const hostRead = await host.read(NEXT);
  line('host read over the changed history', String(hostRead.read));
  line('  the code it refuses with', String(hostRead.code));
  console.log('');

  /* ROUTE 1, EXACTLY AS SECTION 3.1 SPECIFIES IT: ONE repository.load(), the
     PRODUCT'S OWN projector read twice over that one generation object. */
  s.reads.load = 0;
  let laneLoads = 0;
  const snapshot = await (async () => { laneLoads += 1; return s.repository.load(); })();
  const generation = snapshot.generation;
  const projector = Model.createPlanEditProjector({
    basisState: s.basisState, setupOperation: s.setupOperation,
    validateTags: tagProjector.validateExerciseTags,
    projectNewExerciseTags: tagProjector.projectNewExerciseTags,
    basisSource: Model.importPresentIn(generation) ? 'local-source' : 'first-run',
    hashBasis,
    admittedBasisOf: g => admittedLocalSourceBasis(g,
      { athleteLabel: s.document.athlete_label, namespace: s.options.namespace }) });
  const route1Current = projector.read(generation, DAY);
  const route1Pending = projector.read(generation, NEXT);
  line('ROUTE 1 durable loads', laneLoads);
  line('ROUTE 1 pending press / row', setsOf(route1Pending.state, 'press-old')
    + ' / ' + setsOf(route1Pending.state, 'row-old'));
  line('ROUTE 1 applied_ids', JSON.stringify(route1Pending.applied_ids));
  line('ROUTE 1 current press / row', setsOf(route1Current.state, 'press-old')
    + ' / ' + setsOf(route1Current.state, 'row-old'));
  console.log('');

  console.log('THE INVARIANT, ASSERTED:');
  assert.equal(hostRead.read, false, 'the host did not refuse the changed history');
  assert.equal(hostRead.code, 'LOCAL_HISTORY_IDENTITY_UNPROVEN',
    'the host refused for some other reason');
  /* THE RED LINE. Section 3.1 calls ROUTE 1 an authenticated load and
     recommends it as equivalent to the host. If that is true, ROUTE 1 cannot
     hand back a view the host has just refused to produce. */
  assert.equal(setsOf(route1Pending.state, 'row-old'), 2,
    'ROUTE 1 applied the saved edit to the WRONG LIFT over a history the host refuses: '
    + 'the brief calls this route AUTHENTICATED and it is not');
  console.log('ALL ASSERTIONS HELD');
} finally { s.close(); }
