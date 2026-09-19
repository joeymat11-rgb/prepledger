/* EW2 ROUND 6 PROTOTYPE 1b - throwaway. E-R30, the SMALLER variant.
   The correspondence is read from the SAME authenticated derived record
   admittedBasisOf has already proved, so plan-edit-host.mjs keeps its ZERO-byte
   row and no second map exists. Driven through the REAL host, not by hand. */
import { createRequire } from 'node:module';
import { scaffold, admitState, update } from './ew2r6-support.mjs';

const require = createRequire(import.meta.url);
const Proto = require('./ew2r6-proto-r30.cjs');
const line = (k, v) => console.log(k.padEnd(58) + ' ' + v);

const MAP = { 'press-old': 'file-press', 'row-old': 'file-row', 'squat-old': 'file-squat' };
function importedDifferentIds(basisState) {
  const out = structuredClone(basisState);
  out.exercises = out.exercises.map(e => ({ ...e, id: MAP[e.id] || e.id }));
  out.exOrder = Object.fromEntries(Object.entries(out.exOrder || {})
    .map(([d, ids]) => [d, ids.map(id => MAP[id] || id)]));
  out.reads = [{ d: '2026-08-01', w: 181.2 }];
  return out;
}

const s = await scaffold({ tag: 'p1b' });
try {
  const h = await s.host();
  await h.read();
  const rv = await h.review(update({ sets: 5 }));
  await h.save(rv.review_id);
  h.close();

  const imported = importedDifferentIds(s.basisState);
  for (const record of ['MAP RECORDED on the admitted view', 'no map recorded at all']) {
    await s.tamper(g => {
      admitState(g, imported, { namespace: s.options.namespace });
      if (record[0] === 'M') g.collections.derived.localSource.view.lift_correspondence = { ...MAP };
    });
    const gen = await s.generation();
    const answer = (() => { try {
      const view = Proto.createPlanEditProjector({ basisState: imported, setupOperation: s.setupOperation,
        validateTags: () => true, projectNewExerciseTags: r => r, basisSource: 'local-source',
        hashBasis: t => require('node:crypto').createHash('sha256').update(t, 'utf8').digest('hex'),
        admittedBasisOf: g2 => (g2.collections.derived.localSource.view.state) })
        .read(gen, rv.starts_on);
      const row = view.state.exercises.find(e => e.id === 'file-press');
      return 'read OK, file-press sets=' + (row && row.sets);
    } catch (e) { return 'REFUSED ' + (e.code || e.message); } })();
    line(record, answer);
    line('  the admitted view still passes its three-copy basis identity',
      String(!!gen.collections.derived.localSource.view.ready));
  }
  line('bytes the host must change under this variant', '0');
} finally { s.close(); }
