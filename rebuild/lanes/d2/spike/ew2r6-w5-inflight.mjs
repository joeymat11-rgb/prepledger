/* EW2 ROUND 6 WITNESS 5 - throwaway. Astra F7 (E-R36).
   The editor closes, or the athlete cancels, the instant the REAL durable commit
   has returned. What he is told, what is on disk, and what the next open does. */
import { scaffold, update, addEdit } from './ew2r6-support.mjs';

const line = (k, v) => console.log(k.padEnd(58) + ' ' + v);

for (const mode of ['close', 'cancel']) {
  const s = await scaffold({ tag: 'w5-' + mode });
  try {
    const box = { handle: null, review: null, hit: 0 };
    s.hooks.afterCommit = () => {
      box.hit++;
      if (mode === 'close') box.handle.close();
      else box.handle.cancel(box.review);
    };
    const h = await s.host();
    box.handle = h;
    const rv = await h.review(mode === 'close' ? addEdit('after-commit') : update({ sets: 6 }));
    box.review = rv.review_id;
    console.log('--- ' + mode.toUpperCase() + ' fires the moment the commit returns');
    line('review', rv.reviewed + ' intent=' + rv.intent_id);
    const sv = await h.save(rv.review_id);
    line('save reply ok / acknowledged / code',
      sv.ok + ' / ' + sv.acknowledged + ' / ' + (sv.code || '-'));
    line('durable commits observed', box.hit);
    h.close();

    const g = await s.generation();
    const ops = Object.values(g.collections.ops).filter(o => o.kind === 'plan-mutation');
    line('plan-mutation operations on disk', ops.length);
    line('outbox entries', Object.keys(g.collections.outbox || {}).length);
    if (ops.length) line('the committed intent_id', ops[0].members[0].value.intent_id);

    s.hooks.afterCommit = null;
    const h2 = await s.host();
    const after = await h2.read(rv.starts_on);
    line('NEXT OPEN read', after.read + ' code=' + (after.code || '-'));
    if (after.read) {
      line('intents the next open sees',
        JSON.stringify(after.intents.map(i => i.intent_id + ':' + i.status)));
      line('applied_ids / pending_dates',
        JSON.stringify(after.applied_ids) + ' / ' + JSON.stringify(after.pending_dates));
      const rv2 = await h2.review(addEdit('a-second-one'));
      line('a second review is offered with a FRESH intent id',
        rv2.reviewed + ' ' + rv2.intent_id);
    }
    h2.close();
  } finally { s.close(); }
}
