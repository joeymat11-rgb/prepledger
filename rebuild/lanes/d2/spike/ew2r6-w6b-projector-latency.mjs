/* EW2 ROUND 6 WITNESS 6b - throwaway, the round 6 author's OWN extension of F8.
   preview() applies with op=null, so projectNewExerciseTags is never called at
   review. Where does a refusing projector actually land? */
import { scaffold, addEdit, tagProjector } from './ew2r6-support.mjs';

const line = (k, v) => console.log(k.padEnd(58) + ' ' + v);
const s = await scaffold({ tag: 'w6b' });
try {
  const bad = { throwing: false };
  const projector = (row, tags, ctx) => {
    if (bad.throwing) { const e = new RangeError('fold boom'); throw e; }
    return tagProjector.projectNewExerciseTags(row, tags, ctx);
  };
  const h = await s.host({ projectNewExerciseTags: projector });
  const rv = await h.review(addEdit('late-lift'));
  line('review with a healthy projector', rv.reviewed);
  bad.throwing = true;
  const sv = await h.save(rv.review_id);
  line('SAVE with the projector now throwing', sv.ok + ' / ack=' + sv.acknowledged + ' / ' + (sv.code || '-'));
  const today = await h.read();
  line('read on the AUTHORED day', today.read + ' code=' + (today.code || '-'));
  const next = await h.read(rv.starts_on);
  line('read on starts_on (the fold runs)', next.read + ' code=' + (next.code || '-'));
  const g = await s.generation();
  line('plan-mutation operations on disk',
    Object.values(g.collections.ops).filter(o => o.kind === 'plan-mutation').length);
  h.close();
} finally { s.close(); }
