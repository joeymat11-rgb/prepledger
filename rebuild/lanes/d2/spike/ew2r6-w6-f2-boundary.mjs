/* EW2 ROUND 6 WITNESS 6 - throwaway. Astra F8 (E-R37).
   What the athlete's editor really returns when the F2 tag projector refuses or
   throws, and whether the refusal vocabulary is the one the spec promises. */
import { scaffold, tagProjector } from './ew2r6-support.mjs';

const line = (k, v) => console.log(k.padEnd(56) + ' ' + v);
const EXROW = (id) => ({ id, n: 'Synthetic ' + id, mg: 'chest', day: 'U', sets: 2, hi: 9,
  inc: 2.75, steps: [11, 13.75, 16.5] });

const s = await scaffold({ tag: 'w6' });
try {
  const h = await s.host();
  await h.read();

  const cases = [
    ['head that is not a muscle of the taxonomy',
      { kind: 'add', exercise: EXROW('n1'), tags: { head: 'not-a-muscle', secondary: [] } }],
    ['secondary mg that is not a region',
      { kind: 'add', exercise: EXROW('n2'), tags: { head: null, secondary: [{ mg: 'not-a-region', lend: 1 }] } }],
    ['lend above one (PC numeric law)',
      { kind: 'add', exercise: EXROW('n3'), tags: { head: null, secondary: [{ mg: 'chest', lend: 2 }] } }],
    ['head null, a normal add (control)',
      { kind: 'add', exercise: EXROW('n4'), tags: { head: null, secondary: [] } }],
    ['head equal to the identity muscle (E-R29)',
      { kind: 'add', exercise: EXROW('n5'), tags: { head: 'chest', secondary: [] } }]
  ];
  for (const [what, edit] of cases) {
    const rv = await h.review(edit);
    line(what, rv.reviewed + ' code=' + (rv.code || '-'));
  }

  // The provider called DIRECTLY, so the code is not laundered by the host.
  const direct = (fn) => { try { return 'returned ' + fn(); }
    catch (e) { return 'threw ' + (e.code || e.message); } };
  line('validateExerciseTags(ex, {head:"not-a-muscle"...})',
    direct(() => tagProjector.validateExerciseTags(EXROW('d1'), { head: 'not-a-muscle', secondary: [] })));
  line('validateExerciseTags(ex, null)',
    direct(() => tagProjector.validateExerciseTags(EXROW('d2'), null)));
  line('validateSetupTags(null, null)',
    direct(() => tagProjector.validateSetupTags(null, null)));
  line('validateSetupTags(anything, null)',
    direct(() => tagProjector.validateSetupTags({ any: 'thing' }, null)));

  // A provider that throws something with NO code at all.
  const h2 = await s.host({ validateTags: () => { throw new RangeError('boom'); } });
  const rv2 = await h2.review({ kind: 'add', exercise: EXROW('n6'), tags: { head: null, secondary: [] } });
  line('provider throws a bare RangeError: review', rv2.reviewed + ' code=' + (rv2.code || '-'));

  // A projector that throws at projectNewExerciseTags time (the fold, not review).
  const h3 = await s.host({ projectNewExerciseTags: () => { throw new RangeError('fold boom'); } });
  const rv3 = await h3.review({ kind: 'add', exercise: EXROW('n7'), tags: { head: null, secondary: [] } });
  line('projectNewExerciseTags throws: review', rv3.reviewed + ' code=' + (rv3.code || '-'));
  h.close(); h2.close(); h3.close();
} finally { s.close(); }
