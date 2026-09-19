/* EW2 ROUND 6 PROTOTYPE 2 - throwaway. E-R31 / JOURNEY J2.
   ONE OWNER OF CREATION. The admitted HISTORY ROSTER (what old sessions attach
   to) is written to its own field of the admitted state; the PRISTINE REPLAY
   BASE never carries a row a retained add will create. No product file is
   edited: the append is done here, in the shape admission would write it.
   The fold horizon is the UNION over every retained edit, past and PENDING. */
import { scaffold, admitState, addEdit, update } from './ew2r6-support.mjs';

const line = (k, v) => console.log(k.padEnd(60) + ' ' + v);

/* E-R25 shape (a) AS WORDED: the row goes into state.exercises.        RED  */
function appendIntoExercises(state, rows, day) {
  const out = structuredClone(state);
  out.exercises = [...out.exercises, ...rows.map(r => ({ ...r }))];
  out.retirements = { ...(out.retirements || {}) };
  for (const r of rows) out.retirements[r.id] = day;
  return out;
}
/* THE PROTOTYPE: the SAME rows, in their own roster.                  GREEN  */
function appendIntoRoster(state, rows, entries) {
  const out = structuredClone(state);
  out.planRoster = Object.fromEntries(rows.map((r, i) => [r.id,
    { row: { ...r }, created_by_op: entries[i].op_id, effective_from: entries[i].starts_on }]));
  return out;
}

const s = await scaffold({ tag: 'p2' });
try {
  const h = await s.host();
  await h.read();
  // ONE retained add whose effective day has passed, and ONE still PENDING.
  const a1 = await h.review(addEdit('added-past'));
  const sv1 = await h.save(a1.review_id);
  line('saved add 1', sv1.ok + ' starts_on=' + a1.starts_on);
  const folded = await h.read(a1.starts_on);
  const row1 = folded.state.exercises.find(e => e.id === 'added-past');
  line('the folded row the roster would carry', JSON.stringify(row1 && row1.id));
  h.close();

  const imported = structuredClone(s.basisState);
  imported.reads = [{ d: '2026-08-01', w: 181.2 }];
  const entries = [{ op_id: sv1.op_id, starts_on: a1.starts_on }];

  // 1. E-R25 (ii) AS WORDED.
  const asWorded = appendIntoExercises(imported, [row1], '2026-09-14');
  await s.tamper(g => admitState(g, asWorded, { namespace: s.options.namespace }));
  const hA = await s.host({ basisState: asWorded });
  const rA = await hA.read();
  line('E-R25 (ii) as worded: second open read', rA.read + ' code=' + (rA.code || '-'));
  hA.close();

  // 2. THE PROTOTYPE.
  const proto = appendIntoRoster(imported, [row1], entries);
  await s.tamper(g => admitState(g, proto, { namespace: s.options.namespace }));
  const hB = await s.host({ basisState: proto });
  const rB = await hB.read(a1.starts_on);
  line('PROTOTYPE: second open read', rB.read + ' code=' + (rB.code || '-'));
  if (rB.read) {
    line('  the replay created the row, one owner', String(rB.state.exercises.some(e => e.id === 'added-past')));
    line('  the roster still carries it for old sessions',
      String(Object.hasOwn(rB.state.planRoster || proto.planRoster, 'added-past')));
    // J2's last step: add again with a NEW label.
    const a2 = await hB.review(addEdit('added-second'));
    line('  add again with a new label', a2.reviewed + ' code=' + (a2.code || '-'));
    const sv2 = await hB.save(a2.review_id);
    line('  and it saves', sv2.ok + ' code=' + (sv2.code || '-'));
    // PLAN_EDIT_ID_REUSED is NOT suppressed: the same id again still refuses.
    const a3 = await hB.review(addEdit('added-past'));
    line('  the SAME id again still refuses by name', a3.reviewed + ' code=' + (a3.code || '-'));
    const a4 = await hB.review(addEdit('press-old'));
    line('  a setup id again still refuses by name', a4.reviewed + ' code=' + (a4.code || '-'));
    // THE FOLD HORIZON: the pending edit's row belongs in the roster too.
    const after = await hB.read(a2.starts_on);
    line('  rows the union roster must carry (past + current + pending)',
      JSON.stringify(after.state.exercises.filter(e => !s.document.exercises.some(d => d.id === e.id)).map(e => e.id)));
    line('  pending_dates at the authored day', JSON.stringify((await hB.read()).pending_dates));
  }
  hB.close();
} finally { s.close(); }
