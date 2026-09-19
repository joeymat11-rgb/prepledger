/* EW2 BUILD BRIEF, LOOP ROUND 1 FIX - BLOCKING B2, RE-MEASURED, AND THE
   SMALLEST ZERO-BYTE ROUTE THAT SURVIVES IT.

   ASTRA'S B2, in her words: "D3's recommended zero-byte route bypasses
   immutable-operation authentication and applies a saved edit to the wrong
   lift." Section 3.1 of this brief called ROUTE 1 an authenticated load and
   RECOMMENDED it. This cell re-measured that claim with a program of its own
   before a word of the brief was changed, and it went RED at exactly her
   counterexample. HER FINDING IS ACCEPTED WHOLE AND NOTHING IN IT IS DISPUTED.

   THE INVARIANT: a route this brief calls AUTHENTICATED must refuse the same
   history the product's own host refuses. Encrypted storage is not proof of an
   immutable operation's identity; that is the existing PE09-auth fault class
   (`rebuild/lanes/d/plan-edit/durable-host.test.mjs:372`), applied here to the
   one member a plan edit stores its target in.

   THE INPUT. One edit, `update sets=5` on `press-old`, saved through the REAL
   host. Then ONE field of the stored operation is changed through the encrypted
   repository commit - `members[0].value.edit.exercise_id`, from `press-old` to
   `row-old` - and nothing else: `member_set_commitment` and
   `canonical_content_commitment` are left exactly as the product wrote them.
   No guard is removed, no projector is patched, no assertion is relaxed.

   THE THREE ROUTES, all with ZERO product bytes:
     ROUTE 0  two `host.read()` calls: authenticated, TWO loads, two generations.
     ROUTE 1  section 3.1's recommendation: `repository.load()` and the
              product's projector twice. ONE load, and NOT AUTHENTICATED.
     ROUTE 1B the lane's OWN `createDurablePublicClient` over the bindings it
              already holds, with the same T2 history-authentication handoff
              `plan-edit-host.mjs:113` uses, capturing the staged generation and
              reading the product's projector twice over it. ONE load, AND
              authenticated. This is new LANE code, not a product byte.

   Nothing is sealed, no browser is opened and no product file is touched.
   Farm scratch AND PC.
   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-b2-route1-auth.mjs         */
import assert from 'node:assert/strict';
import { laneScaffold, Model, update, DAY, NEXT, hashBasis, tagProjector, createDurablePublicClient }
  from './ew2b-support.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const line = (k, v) => console.log(String(k).padEnd(56) + ' ' + v);
const setsOf = (state, id) => state.exercises.find(e => e.id === id).sets;

console.log('EW2B B2: IS THE BRIEF\'S ZERO-BYTE ROUTE ACTUALLY AUTHENTICATED?');
console.log('');

const s = await laneScaffold({ tag: 'b2' });

/* ROUTE 1B, written out in full because its whole claim is that it costs no
   product byte: every line of it is lane code, and the only product functions
   it calls are `createDurablePublicClient`, the bindings' own `stage` and the
   model's own projector. */
function route1b() {
  let authenticated = null;
  const lane = createDurablePublicClient({ ...s.bindings, schemaVersion: 2,
    stage(generation, command, args, integration) {
      const candidate = s.bindings.stage(generation, command, args, { ...integration,
        historyAuthentication: integration?.historyAuthentication || { signedOperationIds: [] } });
      if (candidate?.view && candidate.result?.state !== 18) authenticated = generation;
      return candidate;
    } });
  return { lane, generation: () => authenticated };
}
const projectorOver = generation => Model.createPlanEditProjector({
  basisState: s.basisState, setupOperation: s.setupOperation,
  validateTags: tagProjector.validateExerciseTags,
  projectNewExerciseTags: tagProjector.projectNewExerciseTags,
  basisSource: Model.importPresentIn(generation) ? 'local-source' : 'first-run',
  hashBasis,
  admittedBasisOf: g => admittedLocalSourceBasis(g,
    { athleteLabel: s.document.athlete_label, namespace: s.options.namespace }) });

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
  console.log('');

  /* ---------- THE HEALTHY HISTORY: what each route returns ---------- */
  s.reads.hostLoad = 0;
  const current0 = await host.read(DAY);
  const pending0 = await host.read(NEXT);
  assert.equal(pending0.read, true, pending0.code);
  line('ROUTE 0 two host.read() calls, durable loads', s.reads.hostLoad);
  line('  current / pending press-old sets',
    setsOf(current0.state, 'press-old') + ' / ' + setsOf(pending0.state, 'press-old'));

  s.reads.load = 0;
  const plain = (await s.repository.load()).generation;
  const route1Healthy = projectorOver(plain);
  const c1 = route1Healthy.read(plain, DAY), p1 = route1Healthy.read(plain, NEXT);
  line('ROUTE 1 durable loads', s.reads.load);
  line('  its views equal ROUTE 0\'s', String(JSON.stringify(c1.state) === JSON.stringify(current0.state)
    && JSON.stringify(p1.state) === JSON.stringify(pending0.state)));

  s.reads.load = 0;
  const healthy = route1b();
  const openedHealthy = await healthy.lane.reopen();
  line('ROUTE 1B durable loads', s.reads.load);
  line('  its reopen refusal', String(openedHealthy && openedHealthy.refusal
    ? openedHealthy.refusal.code : null));
  assert.ok(healthy.generation(), 'ROUTE 1B got no authenticated generation on a healthy history');
  const g1b = healthy.generation();
  const projector1b = projectorOver(g1b);
  const c1b = projector1b.read(g1b, DAY), p1b = projector1b.read(g1b, NEXT);
  line('  its current view equals ROUTE 0\'s current',
    String(JSON.stringify(c1b.state) === JSON.stringify(current0.state)));
  line('  its pending view equals ROUTE 0\'s pending',
    String(JSON.stringify(p1b.state) === JSON.stringify(pending0.state)));
  line('  the two views it returns DIFFER',
    String(JSON.stringify(c1b.state) !== JSON.stringify(p1b.state)));
  const revisionBefore = (await s.repository.load()).revision;
  console.log('');

  /* ---------- ONE FIELD CHANGED, THE COMMITMENTS LEFT ALONE ---------- */
  const opBefore = structuredClone((await s.generation()).collections.ops[saved.op_id]);
  await s.tamper(g => { g.collections.ops[saved.op_id].members[0].value.edit.exercise_id = 'row-old'; });
  const opAfter = (await s.generation()).collections.ops[saved.op_id];
  line('the stored edit now names', opAfter.members[0].value.edit.exercise_id);
  line('its member_set_commitment is unchanged',
    String(opAfter.member_set_commitment === opBefore.member_set_commitment));
  line('its canonical_content_commitment is unchanged',
    String(opAfter.canonical_content_commitment === opBefore.canonical_content_commitment));
  console.log('');

  /* ---------- WHAT EACH ROUTE DOES WITH IT ---------- */
  const hostRead = await host.read(NEXT);
  line('host read over the changed history', String(hostRead.read));
  line('  the code it refuses with', String(hostRead.code));

  s.reads.load = 0;
  const tampered = (await s.repository.load()).generation;
  const route1Tampered = projectorOver(tampered);
  const pendingR1 = route1Tampered.read(tampered, NEXT);
  const currentR1 = route1Tampered.read(tampered, DAY);
  line('ROUTE 1 read over the changed history', 'ANSWERED, no refusal');
  line('  pending press / row', setsOf(pendingR1.state, 'press-old')
    + ' / ' + setsOf(pendingR1.state, 'row-old'));
  line('  applied_ids', JSON.stringify(pendingR1.applied_ids));
  line('  current press / row', setsOf(currentR1.state, 'press-old')
    + ' / ' + setsOf(currentR1.state, 'row-old'));

  s.reads.load = 0;
  const guarded = route1b();
  const openedTampered = await guarded.lane.reopen();
  line('ROUTE 1B read over the changed history',
    openedTampered && openedTampered.refusal ? 'REFUSED' : 'ANSWERED');
  line('  the code it refuses with',
    String(openedTampered && openedTampered.refusal ? openedTampered.refusal.code : null));
  line('  the generation it handed the lane', String(guarded.generation()));
  console.log('');

  /* ---------- THE PIN ---------- */
  console.log('THE PIN, asserted:');
  assert.equal(hostRead.read, false, 'the host did not refuse the changed history');
  assert.equal(hostRead.code, 'LOCAL_HISTORY_IDENTITY_UNPROVEN');
  console.log('  The product\'s own host REFUSES this history by name.');

  /* B2, PINNED BY NAME so the brief can never recommend ROUTE 1 again. */
  assert.equal(setsOf(pendingR1.state, 'press-old'), 2);
  assert.equal(setsOf(pendingR1.state, 'row-old'), 5);
  assert.equal(pendingR1.applied_ids.length, 1);
  console.log('  ROUTE 1 ANSWERS IT, and applies the saved edit to the WRONG LIFT:');
  console.log('  press-old back to 2 and row-old to 5, one applied id. Section');
  console.log('  3.1 called that route AUTHENTICATED. IT IS NOT, and B2 stands.');

  assert.ok(openedTampered && openedTampered.refusal, 'ROUTE 1B answered a history the host refuses');
  assert.equal(openedTampered.refusal.code, 'LOCAL_HISTORY_IDENTITY_UNPROVEN');
  assert.equal(guarded.generation(), null, 'ROUTE 1B handed the lane an unproven generation');
  console.log('  ROUTE 1B REFUSES IT WITH THE HOST\'S OWN CODE and hands the lane');
  console.log('  nothing at all, because the refusal is the product\'s, not the lane\'s.');

  assert.equal(JSON.stringify(c1b.state), JSON.stringify(current0.state));
  assert.equal(JSON.stringify(p1b.state), JSON.stringify(pending0.state));
  assert.notEqual(JSON.stringify(c1b.state), JSON.stringify(p1b.state));
  console.log('  On a healthy history ROUTE 1B\'s two dated views are BYTE-EQUAL to');
  console.log('  ROUTE 0\'s and they DIFFER from each other, so a route that returned');
  console.log('  one view twice could not have passed this cell.');

  assert.equal((await s.repository.load()).revision, revisionBefore + 1,
    'a read wrote to the installation beyond the one tamper commit');
  console.log('  The only commit in this cell is the tamper itself: no route wrote.');
  console.log('');
  console.log('  ROUTE 1B costs 0 product bytes. Its named cost is a SECOND public');
  console.log('  client beside the host\'s, over the SAME bindings and the SAME era:');
  console.log('  not a second durable client and not a second replay implementation.');
  console.log('');
  console.log('ALL ASSERTIONS HELD');
} finally { s.close(); }
