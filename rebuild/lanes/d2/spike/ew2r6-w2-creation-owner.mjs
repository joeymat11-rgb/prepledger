/* EW2 ROUND 6 WITNESS 2 - throwaway.
   J2: save an add, import (E-R25 shape (a) appends the folded row to the admitted
   state), reopen the editor, read, add again with a new label.
   Reproduces (or refutes) Astra F2: two owners of creation. */
import { scaffold, admitState, addEdit } from './ew2r6-support.mjs';

const line = (k, v) => console.log(k.padEnd(56) + ' ' + v);

/* THE APPEND E-R25 (ii) ADOPTS, spelled exactly as source-admission.mjs:477-484
   spells the one it already does: a row under the DOCUMENT's own id, carrying a
   retirement stamp, for every lift the file does not answer for. */
function appendFoldedRow(state, row, { retired = true, day = '2026-09-14' } = {}) {
  const out = structuredClone(state);
  out.exercises = [...out.exercises, { ...row }];
  if (retired) out.retirements = { ...(out.retirements || {}), [row.id]: day };
  out.exOrder = { ...(out.exOrder || {}) };
  return out;
}

const s = await scaffold({ tag: 'w2' });
try {
  const h = await s.host();
  const rv = await h.review(addEdit('new-lift'));
  line('review the add', rv.reviewed + ' starts_on=' + rv.starts_on);
  const sv = await h.save(rv.review_id);
  line('save the add', sv.ok + ' acknowledged=' + sv.acknowledged);

  // The folded row, as the editor itself computed it on starts_on.
  const folded = await h.read(rv.starts_on);
  const row = folded.state.exercises.find(e => e.id === 'new-lift');
  line('folded row exists on starts_on', String(!!row));
  h.close();

  const imported = structuredClone(s.basisState);
  imported.reads = [{ d: '2026-08-01', w: 181.2 }];

  for (const retired of [true, false]) {
    const admitted = appendFoldedRow(imported, row, { retired });
    line('--- admitted base carries the appended row, retired=' + retired,
      'rows=' + admitted.exercises.length);
    const dbtag = 'w2';
    await s.tamper(g => admitState(g, admitted, { namespace: s.options.namespace }));
    const h2 = await s.host({ basisState: admitted });
    const after = await h2.read();
    line('  SECOND OPEN read', after.read + ' code=' + (after.code || '-'));
    if (after.read) {
      const rv2 = await h2.review(addEdit('another-lift'));
      line('  second add reviewed', rv2.reviewed + ' code=' + (rv2.code || '-'));
    }
    h2.close();
  }

  // CONTROL: the same import WITHOUT the append (today's behaviour).
  await s.tamper(g => admitState(g, imported, { namespace: s.options.namespace }));
  const h3 = await s.host({ basisState: imported });
  const ctrl = await h3.read();
  line('CONTROL, no append: SECOND OPEN read', ctrl.read + ' code=' + (ctrl.code || '-'));
  if (ctrl.read) {
    const r = ctrl.state.exercises.find(e => e.id === 'new-lift');
    line('  the replay created the row itself', String(!!r));
    const rv3 = await h3.review(addEdit('another-lift'));
    line('  second add reviewed', rv3.reviewed + ' code=' + (rv3.code || '-'));
  }
  h3.close();
} finally { s.close(); }
