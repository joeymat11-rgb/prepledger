/* EW2 ROUND 6 WITNESS 4 - throwaway. Astra F6 (E-R35) and F4 (E-R33).
   Which dated view the editor's list and field defaults can come from, and where
   the retained family's discriminator really lives. */
import { scaffold, addEdit, update, removeEdit } from './ew2r6-support.mjs';

const line = (k, v) => console.log(k.padEnd(58) + ' ' + v);
const ids = st => st.exercises.filter(e => !(st.retirements || {})[e.id]).map(e => e.id).join(',');

const s = await scaffold({ tag: 'w4' });
try {
  const h = await s.host();
  const rv = await h.review(addEdit('brand-new'));
  const sv = await h.save(rv.review_id);
  line('saved add', sv.ok + ' starts_on=' + rv.starts_on);

  const today = await h.read();
  const next = await h.read(rv.starts_on);
  line('host.read() active ids', ids(today.state));
  line('host.read(starts_on) active ids', ids(next.state));
  line('host.read() pending_dates', JSON.stringify(today.pending_dates));
  line('host.read() applied_ids', JSON.stringify(today.applied_ids));
  line('brand-new selectable in today\'s list', String(today.state.exercises.some(e => e.id === 'brand-new')));

  // A saved REMOVAL: does it leave today's list?
  const rr = await h.review(removeEdit('row-old'));
  const rs = await h.save(rr.review_id);
  line('saved remove row-old', rs.ok);
  const today2 = await h.read();
  const next2 = await h.read(rr.starts_on);
  line('after the remove, host.read() active ids', ids(today2.state));
  line('after the remove, host.read(starts_on) active ids', ids(next2.state));

  // A SECOND edit for the SAME effective day: does it compose?
  const u = await h.review(update({ sets: 7 }, 'press-old'));
  const us = await h.save(u.review_id);
  line('second same-day edit saved', us.ok + ' code=' + (us.code || '-'));
  const next3 = await h.read(u.starts_on);
  line('press-old sets on starts_on', next3.state.exercises.find(e => e.id === 'press-old').sets);
  line('field default if seeded from TODAY', (await h.read()).state.exercises.find(e => e.id === 'press-old').sets);

  // F4: what the STORED operation really carries.
  const op = (await s.generation()).collections.ops[sv.op_id];
  line('stored op.payload', JSON.stringify(op.payload));
  line('stored op.class / op.kind', op.class + ' / ' + op.kind);
  line('payload.value.profile (the spec S1786 discriminator)',
    JSON.stringify(op.payload && op.payload.value && op.payload.value.profile));
  line('members[0].value.profile (where it is)', JSON.stringify(op.members[0].value.profile));
  line('members[0].field', JSON.stringify(op.members[0].field));
  h.close();
} finally { s.close(); }
