/* EW2 SPEC ROUND 5 - THE ID SPACE CELL. Throwaway, never pushed, synthetic only.

   IT CONTINUES REVIEW R4's r4b-capture-lift.mjs, which measured that
   source-admission.mjs:613 resolves a capture into the FILE's id space while
   FOLDED holds DOCUMENT ids, and that E-R16 as worded therefore refused 12 of
   16 lifts on the old app's own shape.

   WHAT THIS ONE ADDS, and it is what E-R16 PRIME asks to be measured:
     (a) the MEMBERSHIP question asked in DOCUMENT space: the capture's OWN
         document lift id (slot.lift_lineage_id, which :615's comment names as
         the document's own id, before the re-key) against FOLDED's ids;
     (b) the ATTACHMENT question left at :613 in FILE space, and whether every
         corresponded lift's target is byte-unchanged;
     (c) a lift a plan edit ADDED: what the admitted state carries for it and
         under which id its captures attach;
     (d) a lift a plan edit RETIRED: FOLDED before and on/after starts_on.

   FOLDED is built the way SPIKE M5 row 3 built it: the model's own
   createPlanEditProjector over a documentState that F2's projectSetupTags has
   run over, read at a date. That is the prototype of 4.3 ruling 2's
   foldPlanEditsAt, which does not exist yet.

   The DOCUMENT is the p3-real-shape PHONE setup (slugOf's slugs). The FILE is
   variant(0), the old app's own shape (short handles), and variant(7), the
   shape SPIKE M4 sealed, whose level 2 has already remapped the file's ids to
   the phone's slugs. Both fixtures are synthetic. Nothing is sealed here and no
   port is needed. */
import * as S from './r5-support.mjs';
import { createRequire } from 'node:module';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { PHONE, PHONE_ID, variant, SETUP_DAY } from '../p3-real-shape/real-shape-support.mjs';

const require = createRequire(import.meta.url);
const Corr = require('../../../m4/workout/lift-correspondence.cjs');

const ADDED = 'ew2-added-lift';
const REMOVED = 'machine-fly';          // a DOCUMENT lift the file DOES correspond to
const DAY0 = SETUP_DAY;                 // 2026-09-16, the day the edits are reviewed
const out = {};

const h = await S.scaffold({ tag: 'r5-idspace', document: PHONE.setup, day: DAY0 });
try {
  const host = await h.host();
  const saved = [];
  for (const edit of [
    { kind: 'add', exercise: { id: ADDED, n: 'Ew2 added lift', mg: 'chest', day: 'U',
      sets: 3, hi: 10, inc: 5, steps: [20, 25, 30] }, tags: { head: null, secondary: [] } },
    { kind: 'remove', exercise_id: REMOVED },
  ]) {
    const r = await host.review(edit);
    if (!r.reviewed) throw new Error('review refused ' + r.code);
    const ok = await host.save(r.review_id);
    if (!ok.ok) throw new Error('save refused ' + ok.code);
    saved.push({ kind: edit.kind, starts_on: ok.starts_on });
  }
  out['0. the two real edits saved through the real host'] = saved;
  const STARTS = saved[0].starts_on;
  const BEFORE = DAY0;                              // strictly before starts_on

  const generation = await h.generation();
  const tagged = S.tagProjector.projectSetupTags(
    S.createCleanInitState({ setup: h.document }),
    { setup: h.document, tags: h.tags, op_id: h.setupOperation.op_id, date: DAY0 });

  const foldAt = date => S.caught(() => S.Model.createPlanEditProjector({
    basisState: tagged, setupOperation: h.setupOperation,
    validateTags: S.tagProjector.validateExerciseTags,
    projectNewExerciseTags: S.tagProjector.projectNewExerciseTags,
    hashBasis: S.hashBasis,
    admittedBasisOf: g => admittedLocalSourceBasis(g,
      { athleteLabel: h.document.athlete_label, namespace: h.options.namespace }),
  }).read(generation, date));

  const foldedOn = foldAt(STARTS), foldedBefore = foldAt(BEFORE);
  if (!foldedOn.ok) throw new Error('fold refused on starts_on: ' + foldedOn.code);
  if (!foldedBefore.ok) throw new Error('fold refused before starts_on: ' + foldedBefore.code);

  /* The ACTIVE lifts of a folded state, which is what a membership test asks.
     `retirements` is how :361 records a remove and a replace, and the admitted
     state's own append block writes into the same member. */
  const activeIds = state => state.exercises
    .filter(e => !(state.retirements || {})[e.id]).map(e => e.id);
  const allIds = state => state.exercises.map(e => e.id);

  out['1. FOLDED, built as SPIKE M5 row 3 builds it'] = {
    ['at BEFORE starts_on (' + BEFORE + '): exercises']: foldedOn.value.state.exercises.length,
    'at BEFORE: active ids carry the ADDED lift': activeIds(foldedBefore.value.state).includes(ADDED),
    'at BEFORE: active ids carry the REMOVED lift': activeIds(foldedBefore.value.state).includes(REMOVED),
    ['at ON/AFTER starts_on (' + STARTS + '): active carries the ADDED lift']:
      activeIds(foldedOn.value.state).includes(ADDED),
    'at ON/AFTER: active carries the REMOVED lift': activeIds(foldedOn.value.state).includes(REMOVED),
    'at ON/AFTER: retirements keys': Object.keys(foldedOn.value.state.retirements || {}),
    'applied edit ids at ON/AFTER': foldedOn.value.applied_ids.length,
    'applied edit ids at BEFORE': foldedBefore.value.applied_ids.length,
  };

  /* The admitted state as source-admission.mjs:477-:484 builds it: the FILE's
     own lifts, plus every DOCUMENT lift that neither corresponds nor is already
     held, appended as a RETIRED lift. It iterates documentProgramme.state, which
     is createCleanInitState of the setup - NOT the fold. */
  const documentState = S.createCleanInitState({ setup: h.document });
  function admitted(file, corr) {
    const held = new Set(file.exercises.map(e => e.id));
    const exercises = file.exercises.map(e => ({ id: e.id }));
    const retirements = {};
    for (const row of documentState.exercises) {
      if (corr[row.id] || held.has(row.id)) continue;
      exercises.push({ id: row.id });
      retirements[row.id] = DAY0;
    }
    return { exercises, retirements };
  }

  const one = (list, id) => list.filter(e => e.id === id).length === 1;

  function measure(level, date, folded) {
    const file = variant(level);
    const corr = Corr.correspondence(file.exercises, h.document.exercises);
    const state = admitted(file, corr);
    const foldedAll = allIds(folded.value.state).map(id => ({ id }));
    const foldedActive = activeIds(folded.value.state).map(id => ({ id }));
    /* Every slot a pre-import session can carry names a DOCUMENT lift by its own
       id (:600-:611 and :615's comment), plus the lift a plan edit ADDED. */
    const slots = [...documentState.exercises.map(e => e.id), ADDED];
    const rows = slots.map(slotId => {
      const target = corr[slotId] ?? slotId;
      return {
        slotId, target,
        differs: target !== slotId,
        today: one(state.exercises, target),
        ER16: one(foldedAll, target),                 // the OLD ruling: file id vs document set
        ER16PRIME_a: one(foldedAll, slotId),          // (a) document id vs document set
        ER16PRIME_a_active: one(foldedActive, slotId),
      };
    });
    const tally = k => rows.filter(r => r[k]).length + '/' + rows.length;
    return {
      file: level === 0 ? "variant(0), the old app's own shape (short handles)"
        : 'variant(' + level + "), the bracket's level 2 remap has run (file ids ARE the phone's slugs)",
      date,
      'slot ids whose :613 target DIFFERS from the slot id': rows.filter(r => r.differs).length + '/16',
      'PASS today (:614 over the ADMITTED state, FILE id)': tally('today'),
      'PASS under E-R16 as worded (:614 over FOLDED, FILE id)': tally('ER16'),
      'PASS under E-R16 PRIME (a) (:614 over FOLDED, DOCUMENT id, all rows)': tally('ER16PRIME_a'),
      'PASS under E-R16 PRIME (a) counting ACTIVE rows only': tally('ER16PRIME_a_active'),
      'refused by E-R16 as worded that pass today':
        rows.filter(r => r.today && !r.ER16).map(r => r.slotId + ' -> ' + r.target),
      'refused by E-R16 PRIME (a) that pass today':
        rows.filter(r => r.today && !r.ER16PRIME_a).map(r => r.slotId + ' -> ' + r.target),
      'admitted by E-R16 PRIME (a) that refuse today':
        rows.filter(r => !r.today && r.ER16PRIME_a).map(r => r.slotId),
      'ACTIVE spelling: rows that REFUSE':
        rows.filter(r => !r.ER16PRIME_a_active).map(r => r.slotId),
      'ACTIVE spelling: rows that refuse AND pass today':
        rows.filter(r => !r.ER16PRIME_a_active && r.today).map(r => r.slotId),
      'ACTIVE spelling: rows that PASS and refuse today':
        rows.filter(r => r.ER16PRIME_a_active && !r.today).map(r => r.slotId),
      '(b) ATTACHMENT: corresponded lifts whose :613 target is unchanged by this ruling':
        rows.filter(r => r.differs).length + '/' + rows.filter(r => r.differs).length
        + ' (no row of this ruling touches :613)',
      '(b) the twelve, printed': rows.filter(r => r.differs).map(r => r.slotId + ' -> ' + r.target),
    };
  }

  out['2. THE TABLE, at a capture date ON OR AFTER starts_on'] = {
    A_old_app_shape: measure(0, STARTS, foldedOn),
    B_spike_M4_shape: measure(7, STARTS, foldedOn),
  };
  out['3. THE SAME TABLE at a capture date BEFORE starts_on'] = {
    A_old_app_shape: measure(0, BEFORE, foldedBefore),
    B_spike_M4_shape: measure(7, BEFORE, foldedBefore),
  };

  /* (c) THE LIFT A PLAN EDIT ADDED. It has no file lift, so nothing corresponds
     to it and nothing appends it: the append block iterates the SETUP document,
     which never carried it. */
  const corr0 = Corr.correspondence(variant(0).exercises, h.document.exercises);
  const corr7 = Corr.correspondence(variant(7).exercises, h.document.exercises);
  const adm0 = admitted(variant(0), corr0), adm7 = admitted(variant(7), corr7);
  out['4. (c) THE LIFT A PLAN EDIT ADDED'] = {
    'the document (createCleanInitState of the setup) carries it':
      documentState.exercises.some(e => e.id === ADDED),
    'FOLDED at/after starts_on carries it': allIds(foldedOn.value.state).includes(ADDED),
    'lift_correspondence has an entry for it (variant 0)': corr0[ADDED] ?? null,
    'lift_correspondence has an entry for it (variant 7)': corr7[ADDED] ?? null,
    ':613 target for a capture naming it (variant 0)': corr0[ADDED] ?? ADDED,
    'the ADMITTED state carries that target (variant 0)': one(adm0.exercises, corr0[ADDED] ?? ADDED),
    'the ADMITTED state carries that target (variant 7)': one(adm7.exercises, corr7[ADDED] ?? ADDED),
    'so: under which id do its captures attach': 'its OWN document id, unchanged by :613',
    'and the admitted state carries that id': one(adm0.exercises, ADDED),
  };

  /* (d) THE LIFT A PLAN EDIT RETIRED. */
  const retOn = (foldedOn.value.state.retirements || {})[REMOVED] ?? null;
  const retBefore = (foldedBefore.value.state.retirements || {})[REMOVED] ?? null;
  out['5. (d) THE LIFT A PLAN EDIT RETIRED'] = {
    'the edit': 'remove ' + REMOVED + ', starts_on ' + STARTS,
    ['FOLDED at ' + BEFORE + ' (before starts_on): retirement recorded']: retBefore,
    ['FOLDED at ' + BEFORE + ': the lift is in exercises']:
      allIds(foldedBefore.value.state).includes(REMOVED),
    ['FOLDED at ' + BEFORE + ': the lift is ACTIVE']: activeIds(foldedBefore.value.state).includes(REMOVED),
    ['FOLDED at ' + STARTS + ' (on starts_on): retirement recorded']: retOn,
    ['FOLDED at ' + STARTS + ': the lift is in exercises']:
      allIds(foldedOn.value.state).includes(REMOVED),
    ['FOLDED at ' + STARTS + ': the lift is ACTIVE']: activeIds(foldedOn.value.state).includes(REMOVED),
    ['ONE-OF over exercises (what :614 asks) at ' + BEFORE]:
      one(allIds(foldedBefore.value.state).map(id => ({ id })), REMOVED),
    ['ONE-OF over exercises (what :614 asks) at ' + STARTS]:
      one(allIds(foldedOn.value.state).map(id => ({ id })), REMOVED),
    ['ONE-OF over ACTIVE rows at ' + BEFORE]:
      one(activeIds(foldedBefore.value.state).map(id => ({ id })), REMOVED),
    ['ONE-OF over ACTIVE rows at ' + STARTS]:
      one(activeIds(foldedOn.value.state).map(id => ({ id })), REMOVED),
  };

  out['6. THE CONTROL R4 FOUND, restated as four assertions'] = {
    "correspondence(variant(0), document)['lateral-machine']": corr0['lateral-machine'],
    'the document does NOT carry a lift `lateral`': !documentState.exercises.some(e => e.id === 'lateral'),
    "correspondence(variant(7), document)['lateral-machine']": corr7['lateral-machine'] ?? null,
    'PHONE_ID.lateral': PHONE_ID.lateral,
  };
} finally { h.close(); }

console.log(JSON.stringify(out, null, 1));
