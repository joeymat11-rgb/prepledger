/* EW2 BUILD BRIEF - E-R41, HANDOFF 1 (Astra's D3): THE AUTHENTICATED-GENERATION
   HANDOFF FOR THE CURRENT AND PENDING VIEWS.

   DECISIONS:621 (4): NOT AUTHORIZED. The brief MEASURES the smallest route
   with ZERO PRODUCT BYTES, names the file, the lines and the alternatives with
   their cost, and the PM rules once. Nothing here proposes a byte.

   THE CLAIM UNDER TEST is Astra's, word for word: "one host.read() exposes
   neither both views nor its generation, and a successful save reply exposes
   no committed generation; do not satisfy E-R35 by two uncoordinated reads or
   a second replay implementation."

   Everything is synthetic; nothing is sealed. Farm scratch AND PC.
   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-r41-d3-generation.mjs     */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
/* `tagProjector` is taken from the scaffold, NOT required straight out of
   `f2-tag-adapter.cjs`: the module's export is a FACTORY, and a lane that
   requires the module and hands the module on gets
   `validateTags === undefined` and fails at projector construction with
   PLAN_EDIT_TAGS_INVALID. Measured, by this cell getting it wrong first, and
   it is part of ROUTE 1's real cost below. */
import { scaffold, Model, update, DAY, NEXT, hashBasis, tagProjector } from './ew2r6-support.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const line = (k, v) => console.log(String(k).padEnd(56) + ' ' + v);

console.log('EW2B E-R41 D3: TWO DATED VIEWS, AND THE GENERATION THEY CAME FROM');
console.log('');

const s = await scaffold({ tag: 'r41d3' });
try {
  const host = await s.host();

  /* ONE SAVED EDIT, effective TOMORROW, so the current and the pending views
     genuinely differ and a route that returns one view twice cannot pass. */
  const first = await host.read();
  assert.equal(first.read, true, first.code);
  const reviewed = await host.review(update({ sets: 5 }));
  assert.equal(reviewed.reviewed, true, reviewed.code);
  const saved = await host.save(reviewed.review_id);
  assert.equal(saved.ok, true, saved.code);
  line('one edit saved, effective', reviewed.starts_on);
  line('the save reply\'s members', Object.keys(saved).sort().join(', '));
  /* MEASURED CORRECTION TO D3's SECOND CLAUSE. Astra writes "a successful save
     reply exposes no committed generation". The reply DOES carry
     `durableRevision`, measured here, which names the committed REVISION. It
     does not carry the generation itself, and it is not the dated views, so
     D3's first clause stands whole; its second clause is narrowed by this
     line rather than agreed with. */
  const replyRevision = Object.hasOwn(saved, 'durableRevision') ? saved.durableRevision : null;
  const replyHasGeneration = Object.hasOwn(saved, 'generation');
  line('the save reply names a committed REVISION', String(replyRevision));
  line('the save reply names the generation itself', String(replyHasGeneration));
  console.log('');

  /* ROUTE 0, THE ONE THE SPEC ASSUMED: two host.read() calls. */
  s.reads.load = 0;
  const current0 = await host.read(DAY);
  const pending0 = await host.read(NEXT);
  const twoReadLoads = s.reads.load;
  line('ROUTE 0 two host.read() calls, durable loads', twoReadLoads);
  line('  the current view\'s sets for press-old', current0.state.exercises.find(e => e.id === 'press-old').sets);
  line('  the pending view\'s sets for press-old', pending0.state.exercises.find(e => e.id === 'press-old').sets);
  line('  either read names its own generation', String(Object.hasOwn(current0, 'generation') || Object.hasOwn(current0, 'revision')));
  console.log('');

  /* ROUTE 1, THE ZERO-PRODUCT-BYTE ROUTE. ONE authenticated load, and the
     PRODUCT'S OWN projector - `Model.createPlanEditProjector`, built with the
     same collaborators the lane already hands `createPlanEditHost` - read
     twice over that ONE generation object. It is not a second replay
     implementation: it is the same function, called once more. What it DOES
     cost is a second projector INSTANCE beside the host's, and that cost is
     named rather than hidden. */
  /* The scaffold's own counter instruments the HOST's bindings only, so a load
     the lane takes straight off the repository is invisible to it. Counted
     here instead, and the host's counter is asserted to stay at zero, which is
     the point: ROUTE 1 takes its ONE load and the host takes none. */
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
  const current1 = projector.read(generation, DAY);
  const pending1 = projector.read(generation, NEXT);
  const oneReadLoads = laneLoads;
  line('ROUTE 1 one load, two dated views, durable loads', oneReadLoads);
  line('  loads the HOST took for it', s.reads.load);
  line('  the revision that ONE load names', String(snapshot.revision));
  line('  its current view equals ROUTE 0\'s current', String(JSON.stringify(current1.state) === JSON.stringify(current0.state)));
  line('  its pending view equals ROUTE 0\'s pending', String(JSON.stringify(pending1.state) === JSON.stringify(pending0.state)));
  line('  the two views it returns DIFFER', String(JSON.stringify(current1.state) !== JSON.stringify(pending1.state)));
  console.log('');

  /* ROUTE 2, THE SEALED HUNK, COUNTED rather than estimated, exactly the way
     `ew2r7-p5-card-hunk.mjs` counted hunk E: both anchors proved unique in the
     file on disk, the patch applied IN MEMORY, the lines counted, the result
     proved to still parse, and the file left byte-unchanged. NOTHING IS
     WRITTEN and no byte is proposed: this is the PRICE, for the PM. */
  const HOST = fileURLToPath(new URL('../../../m3/w6/host/plan-edit-host.mjs', import.meta.url));
  const source = readFileSync(HOST, 'utf8');
  const A1 = '    async read(date) { return enqueue(() => readVerified(date)); },';
  const A2 = '  function outcome(entry, intent, revision) {';
  const occurrences = (text, needle) => text.split(needle).length - 1;
  line('ROUTE 2 anchor 1, the read member', occurrences(source, A1));
  line('ROUTE 2 anchor 2, the line the new reader precedes', occurrences(source, A2));
  assert.equal(occurrences(source, A1), 1, 'anchor 1 is not unique');
  assert.equal(occurrences(source, A2), 1, 'anchor 2 is not unique');

  const NEW_READER = [
    '  /* ONE authenticated generation, TWO explicitly dated views (E-R35, D3). */',
    '  async function readBothVerified(currentDate, pendingDate) {',
    '    if (!alive) return { read:false,...refusal(\'LOCAL_CLIENT_CLOSED\') };',
    '    lastGeneration = null;',
    '    const opened = await lane.reopen();',
    '    if (opened?.refusal || !lastGeneration)',
    '      return { read:false,...(opened?.refusal || refusal(\'PLAN_EDIT_READ_REFUSED\')) };',
    '    const g = lastGeneration;',
    '    try { return { read:true, current:read(g,currentDate || localDay()),',
    '      pending:read(g,pendingDate || Commands.nextLocalDate(localDay())) }; }',
    '    catch (error) { return { read:false,...refusal(error.code || \'PLAN_EDIT_READ_REFUSED\') }; }',
    '  }', ''].join('\n');
  const NEW_MEMBER = A1 + '\n'
    + '    async readBoth(currentDate, pendingDate) { return enqueue(() => readBothVerified(currentDate, pendingDate)); },';
  const patched = source.replace(A2, NEW_READER + A2).replace(A1, NEW_MEMBER);
  const added = patched.split('\n').length - source.split('\n').length;
  line('ROUTE 2 lines added / removed', added + ' / 0');
  let parses = true;
  try { new Function('return 0'); await import('data:text/javascript;base64,' + Buffer.from(patched).toString('base64')); }
  catch (error) { parses = !/SyntaxError/.test(String(error && error.name)); }
  line('the patched host parses as an ES module', String(parses));
  line('plan-edit-host.mjs on disk is byte-unchanged', String(readFileSync(HOST, 'utf8') === source));
  console.log('');

  /* ------------------------------------------------------------------ */
  console.log('THE PIN, asserted:');
  assert.equal(replyHasGeneration, false,
    'the save reply DOES name a committed generation: D3 would be withdrawn');
  assert.equal(Object.hasOwn(current0, 'generation'), false);
  assert.equal(Object.hasOwn(current0, 'revision'), false);
  console.log('  D3\'s FIRST CLAUSE IS UPHELD BY EXECUTION: one host.read() names');
  console.log('  neither both dated views nor the generation it was taken from.');
  assert.equal(typeof replyRevision, 'number');
  console.log('  D3\'s SECOND CLAUSE IS NARROWED BY MEASUREMENT, not agreed with:');
  console.log('  the successful save reply DOES carry durableRevision = ' + replyRevision + ',');
  console.log('  which names the committed REVISION. It does not carry the');
  console.log('  generation, and a revision is not a dated view, so the handoff');
  console.log('  D3 asks for is still missing. The PM is told both halves.');

  assert.equal(twoReadLoads > oneReadLoads, true, 'the two-read route was not dearer');
  assert.equal(oneReadLoads, 1, 'the zero-byte route took more than one load');
  assert.equal(s.reads.load, 0, 'the host took a load for the zero-byte route');
  console.log('  ROUTE 1 takes ONE authenticated load where ROUTE 0 takes ' + twoReadLoads + ',');
  console.log('  and both of its dated views are BYTE-EQUAL to ROUTE 0\'s.');

  assert.equal(JSON.stringify(current1.state), JSON.stringify(current0.state));
  assert.equal(JSON.stringify(pending1.state), JSON.stringify(pending0.state));
  assert.notEqual(JSON.stringify(current1.state), JSON.stringify(pending1.state));
  console.log('  The two views DIFFER, so a route that returned one view twice');
  console.log('  could not have passed this cell.');

  assert.equal(added, 13);
  console.log('  ROUTE 2, the sealed alternative, is 13 ADDED LINES and 0 removed');
  console.log('  in plan-edit-host.mjs, counted and not estimated, both anchors');
  console.log('  unique. That file is on 13.12\'s ZERO-BYTE list.');
  console.log('');
  console.log('ALL ASSERTIONS HELD');
} finally { s.close(); }
