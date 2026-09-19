/* EW2 ROUND 6 WITNESS 1 - throwaway, written by the round 6 author.
   J1: first-run edit -> import with DIFFERENT ids -> reload -> read -> Start.
   Reproduces (or refutes) Astra F1 without using her scripts. */
import { scaffold, admitState, update } from './ew2r6-support.mjs';

const line = (k, v) => console.log(k.padEnd(52) + ' ' + v);

/* The imported file, in FILE space: different ids, SAME normalised names, so the
   model's local-source branch can bind each document row by name. */
function importedDifferentIds(basisState) {
  const map = { 'press-old': 'file-press', 'row-old': 'file-row', 'squat-old': 'file-squat' };
  const out = structuredClone(basisState);
  out.exercises = out.exercises.map(e => ({ ...e, id: map[e.id] || e.id }));
  out.exOrder = Object.fromEntries(Object.entries(out.exOrder || {})
    .map(([d, ids]) => [d, ids.map(id => map[id] || id)]));
  out.reads = [{ d: '2026-08-01', w: 181.2 }];
  return { imported: out, map };
}

const s = await scaffold({ tag: 'w1' });
try {
  // 1. FIRST RUN: save one edit, sets 5, against the DOCUMENT id press-old.
  const h = await s.host();
  const before = await h.read();
  line('first-run read', before.read + ' press-old sets=' +
    before.state.exercises.find(e => e.id === 'press-old').sets);
  const rv = await h.review(update({ sets: 5 }));
  line('review', rv.reviewed + ' starts_on=' + rv.starts_on);
  const sv = await h.save(rv.review_id);
  line('save', sv.ok + ' acknowledged=' + sv.acknowledged);
  const stored = (await s.generation()).collections.ops[sv.op_id];
  line('stored edit.exercise_id', JSON.stringify(stored.members[0].value.edit.exercise_id));
  h.close();

  // 2. THE IMPORT ARRIVES with a different id space.
  const { imported, map } = importedDifferentIds(s.basisState);
  line('file ids', imported.exercises.map(e => e.id).join(','));
  line('document ids', s.document.exercises.map(e => e.id).join(','));
  line('correspondence the admission would record', JSON.stringify(map));
  await s.tamper(g => admitState(g, imported, { namespace: s.options.namespace }));

  // 3. RELOAD: a new host on the admitted basis, exactly as the page rebuilds it.
  const h2 = await s.host({ basisState: imported });
  const after = await h2.read();
  line('SECOND OPEN read', after.read + ' code=' + (after.code || after.refusal || '-'));
  if (after.read) {
    const row = after.state.exercises.find(e => e.id === (map['press-old']));
    line('  sets on the imported press row', row && row.sets);
  }

  // 4. What the RAW imported state prescribes for the same lift.
  line('raw imported file-press sets', imported.exercises.find(e => e.id === 'file-press').sets);
  line('saved edit asked for sets', 5);

  // 5. Where exactly it refuses: apply() looks the target up by exact id, and
  //    the imported state carries no row under the id the edit was saved against.
  line('imported state has a row with id press-old',
    String(imported.exercises.some(e => e.id === 'press-old')));
  line('plan-edit-model.cjs apply() resolves by', 'state.exercises.find(e => e.id === edit.exercise_id)');
  h2.close();
} finally { s.close(); }
