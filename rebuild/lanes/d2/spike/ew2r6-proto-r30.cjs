/* EW2 ROUND 6 PROTOTYPE LOADER - throwaway, and it deliberately keeps NO copy of
   a sealed module in the repository. It reads rebuild/m4/workout/plan-edit-model.cjs
   at run time, applies the E-R30 hunk as two textual replacements, and compiles
   the result UNDER THE PRODUCT'S OWN FILENAME so its relative requires resolve.
   The hunk below IS the hunk section 13.2 prices: 23 added lines, 2 removed. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const PRODUCT = path.resolve(__dirname, '../../../m4/workout/plan-edit-model.cjs');

const OLD_SIGNATURE = "  if (!equal(adopted, base)) fail('PLAN_EDIT_IMPORTED_BASIS_MISMATCH');";
const NEW_SIGNATURE = "  if (!equal(adopted, base)) fail('PLAN_EDIT_IMPORTED_BASIS_MISMATCH');\n" +
  "      liftCorrespondence = correspondenceIn(generation);";

const OLD_APPLY = [
  "  function apply(state, edit, starts_on, op) {",
  "    const target = edit.exercise_id === undefined ? null : state.exercises.find(e => e.id === edit.exercise_id);",
  "    if (edit.exercise_id !== undefined && (!target || (state.retirements || {})[target.id])) fail('PLAN_EDIT_TARGET_UNAVAILABLE');"
].join('\n');

const NEW_APPLY = [
  "  /* E-R30, THE ONE NAMED BOUNDARY. A stored edit names the DOCUMENT lift id it",
  "     was saved against and is NEVER rewritten. On an imported installation the",
  "     base is the FILE's, so the TARGET LOOKUP - and nothing else - translates",
  "     that id through the SAME correspondence admission recorded. Where the",
  "     correspondence has no entry and the base carries no row under the raw id,",
  "     the fold refuses BY NAME and never falls back to the raw plan. */",
  "  /* THE MAP IS THE ADMITTED ONE, read from the same authenticated derived record",
  "     admittedBasisOf has already proved, so the host passes NOTHING new and no",
  "     second map exists anywhere. */",
  "  let liftCorrespondence = null;",
  "  const correspondenceIn = g => (g && g.collections && g.collections.derived &&",
  "    g.collections.derived.localSource && g.collections.derived.localSource.view &&",
  "    g.collections.derived.localSource.view.lift_correspondence) || null;",
  "  function targetIdOf(state, id) {",
  "    if (id === undefined || firstRun) return id;",
  "    const mapped = liftCorrespondence ? liftCorrespondence[id] : undefined;",
  "    if (typeof mapped === 'string' && mapped.trim()) return mapped;",
  "    if (state.exercises.some(e => e.id === id)) return id;",
  "    fail('PLAN_EDIT_TARGET_UNTRANSLATED');",
  "  }",
  "  function apply(state, edit, starts_on, op) {",
  "    const targetId = targetIdOf(state, edit.exercise_id);",
  "    const target = targetId === undefined ? null : state.exercises.find(e => e.id === targetId);",
  "    if (targetId !== undefined && (!target || (state.retirements || {})[target.id])) fail('PLAN_EDIT_TARGET_UNAVAILABLE');"
].join('\n');

function loadPatched() {
  const source = fs.readFileSync(PRODUCT, 'utf8');
  for (const needle of [OLD_SIGNATURE, OLD_APPLY])
    if (!source.includes(needle)) throw new Error('the product has moved under this prototype: ' + needle.slice(0, 60));
  const patched = source.replace(OLD_SIGNATURE, NEW_SIGNATURE).replace(OLD_APPLY, NEW_APPLY);
  const added = patched.split('\n').length - source.split('\n').length;
  const module_ = new Module(PRODUCT, null);
  module_.filename = PRODUCT;
  module_.paths = Module._nodeModulePaths(path.dirname(PRODUCT));
  module_._compile(patched, PRODUCT);
  return { ...module_.exports, HUNK_NET_LINES: added };
}

module.exports = loadPatched();
