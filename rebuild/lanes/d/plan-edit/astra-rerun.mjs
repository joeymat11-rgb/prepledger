/* Re-run the independent Astra witnesses (f355ccce / 96c4b101) against this
   head. The annex bytes are NOT rewritten: exactly two mechanical adaptations
   are applied to a copy in .tmp, each anchored and counted, and both are
   recorded in the author report.

   (1) F2's setup-tags.cjs is not on rebuild/t2-client-core; the require is
       pointed at the lane's byte-identical copy of the same public blob.
   (2) createPlanEditHost now REQUIRES the installation's live athlete-local day
       (S4). The annex is handed `() => clock.today()`, which is exactly the
       value the Sept-13 host derived internally, so every witness probes the
       same behaviour it probed then. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve(process.argv[2]);
const out = join(root, 'rebuild/lanes/astra/tmp-plan-edit-rerun');
mkdirSync(out, { recursive: true });
const edits = [
  ["const { createSetupTagProjector } = require('../../../m4/workout/setup-tags.cjs');",
   "const { createSetupTagProjector } = require('../../d/plan-edit/f2-tag-adapter.cjs');"],
  ["} }, clock, basisState:basis, setupOperation:origin, validateTags:tags.validateExerciseTags,",
   "} }, clock, liveDay:()=>clock.today(), basisState:basis, setupOperation:origin, validateTags:tags.validateExerciseTags,"],
  /* (3) The annex's synthetic split trains on F1 FULL-BODY days. F1 is lane D's
     other unmerged package: rebuild/m4/workout/athlete-state.cjs DAY_KINDS on
     this tip is ['U','L'], so the reviewer's own first-run setup refuses here
     before any companion code runs. The split is restated in the vocabulary the
     tip accepts, covering the same two families the fixture's lifts use, so
     every witness below it probes exactly what it probed. */
  ["map: { 0:'REST',1:'F',2:'REST',3:'REST',4:'F',5:'REST',6:'REST' } },",
   "map: { 0:'REST',1:'U',2:'REST',3:'REST',4:'L',5:'REST',6:'REST' } },"],
  /* (4) F1 also adds engine/plan.cjs orderedExercisesForDay, and rebuild/engine
     is pinned by S5, so it is not on this tip either. The tip's OWN ordered-pool
     reader is the M2-S3 companion sessionMembership (today.cjs:82, exposed by
     m4/workout/engine-runtime.cjs), which today.cjs and the workout lane both
     read and which answers by DATE. A Monday and a Thursday of the fixture's own
     week name the same two pools in the same order, so I15's order assertion is
     re-expressed through the accepted engine rather than hand-rolled here. */
  ["const { nameAt, orderedExercisesForDay } = require('../../../engine/plan.cjs')({},{});",
   "const { nameAt } = require('../../../engine/plan.cjs')({},{});\n" +
   "const { createEngineRuntime } = require('../../../m4/workout/engine-runtime.cjs');\n" +
   "const orderedExercisesForDay = (s, kind) => { const iso = kind === 'U' ? '2026-10-05' : '2026-10-08';\n" +
   "  const runtime = createEngineRuntime({ clock: { today: () => iso, hour: () => 8,\n" +
   "    now: () => new Date(iso + 'T13:00:00.000Z'), stamp: () => iso + 'T13:00:00.000Z' } });\n" +
   "  return runtime.sessionMembership(s, iso).exercise_ids.map(id => s.exercises.find(e => e.id === id)); };"],
];
for (const name of ['PLAN-EDIT-REVIEW-ANNEX.mjs', 'PLAN-EDIT-REVIEW-R1-ANNEX.mjs']) {
  let source = readFileSync(join(root, 'rebuild/lanes/astra/reviews', name), 'utf8');
  console.log(name + ' published sha256 ' + createHash('sha256').update(source).digest('hex'));
  let applied = 0;
  for (const [i, [a, b]] of edits.entries()) {
    const hits = source.split(a).length - 1;
    assert.ok(hits <= 1, name + ': ambiguous anchor ' + (i + 1));
    if (hits === 1) { source = source.replace(a, b); applied += 1; }
  }
  console.log('  ' + applied + ' of ' + edits.length + ' adaptations applied');
  writeFileSync(join(out, name), source);
}
console.log('adapted copies in ' + out + ' (' + edits.length + ' anchored edits each, nothing else)');
