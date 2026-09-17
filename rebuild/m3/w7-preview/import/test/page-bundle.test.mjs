/* P3-IMPORT-UI / P3-D-FOLLOWONS - WHAT THE IMPORT SCREEN STILL COSTS THE PAGE.

   THIS FILE HAS BEEN REWRITTEN BECAUSE THE WALL CAME DOWN, which is what its
   first version demanded of whoever brought it down: "IT WILL GO RED THE DAY
   THE WALL COMES DOWN ... whoever makes the admission stack page-safe (the A2
   pattern - an accepted host-owned mirror under rebuild/m3/w6/host/, as
   engine-runtime-host.cjs already is for engine-runtime.cjs) should have to
   come back here and say so." That is done: source-admission.mjs now imports
   the accepted mirror (DECISIONS:475 Route 1 step one), so the ONE computed
   require is gone from the graph and with it the glob sweep of rebuild/engine.

   NOTHING BELOW IS RELAXED. The old file asserted three things: the shipped
   page builds; the accepted bundler refuses the Import graph; and the page's
   own input law refuses it too, over a named list. The second is now FALSE as
   written - esbuild builds the graph - so it is replaced by the stronger,
   narrower statement of the same fact: exactly which FORBIDDEN names are left.
   The third is UNCHANGED in force: the page's own law still refuses, and it is
   still run, not quoted. The screen is still not on the phone; what changed is
   that the remaining question is two engine files and one name ban, and it is
   a ruling for P3-IMPORT-UI-2, not a bundler defect.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { REPO } from './support.mjs';
import { buildBrowser } from '../../../w6/build-browser.mjs';
import { assertBundleInputs } from '../../today/build.mjs';

const SCRATCH = path.join(REPO, '.tmp/p3-page-bundle-probe');
const ENTRY = path.join(SCRATCH, 'reaches-admission.mjs');
const abs = p => path.join(REPO, p).replaceAll('\\', '/');
/* The shipped page entry PLUS the one import an Import route cannot avoid. */
const SOURCE = 'import * as Entry from "' + abs('rebuild/m3/w7-preview/today/today-entry.mjs') + '";\n'
  + 'import { createLocalSourceController } from "'
  + abs('rebuild/m3/w6/local/source-admission.mjs') + '";\n'
  + 'export default { Entry, createLocalSourceController };\n';

/* The page's OWN FORBIDDEN list, restated by name so this cell can say WHICH
   entries a graph trips instead of only that it trips one. assertBundleInputs
   below is the law itself, run; this map is the reading of its answer. */
const FORBIDDEN = Object.freeze([
  ['rebuild/engine/seed.cjs', p => p === 'rebuild/engine/seed.cjs'],
  ['rebuild/engine/migrate.cjs', p => p === 'rebuild/engine/migrate.cjs'],
  ['rebuild/engine/merge.cjs', p => p === 'rebuild/engine/merge.cjs'],
  ['rebuild/engine/index.cjs', p => p === 'rebuild/engine/index.cjs'],
  ['rebuild/engine/test/*', p => /^rebuild\/engine\/test\//.test(p)],
  ['rebuild/conform/*', p => /^rebuild\/conform\//.test(p)],
  ['rebuild/m4/import/*', p => /^rebuild\/m4\/import\//.test(p)],
  ['rebuild/m4/workout/engine-runtime.cjs', p => p === 'rebuild/m4/workout/engine-runtime.cjs']]);
const tripped = paths => FORBIDDEN.filter(([, match]) => paths.some(match)).map(([label]) => label);

let baseline = null, withAdmission = null;

test('P3-B1 - the SHIPPED page still builds, so this cell is measuring a change '
  + 'and not a broken tree', async () => {
  const out = path.join(SCRATCH, 'baseline/app.js');
  baseline = await buildBrowser({ outfile: out,
    entryPoints: [path.join(REPO, 'rebuild/m3/w7-preview/today/today-entry.mjs')] });
  assert.doesNotThrow(() => assertBundleInputs(baseline.inventory));
  const paths = baseline.inventory.map(i => i.path);
  assert.deepEqual(tripped(paths), [], 'the page carries no forbidden name today');
  assert.equal(paths.filter(p => /^rebuild\/m4\/import\//.test(p)).length, 0,
    'the page carries none of the import lane today');
  assert.equal(paths.filter(p => /^rebuild\/engine\/test\//.test(p)).length, 0);
});

/* WHAT THE SWAP ACTUALLY REMOVED. The old P3-B2 asserted that esbuild REFUSED
   this graph, and named the refused files as rebuild/engine/test/** and
   rebuild/conform/** - the glob sweep of the one computed require. With the
   accepted mirror in source-admission.mjs there is no computed require left in
   the graph, so the build SUCCEEDS and those two directories are absent. This
   cell is the same fact stated from the other side, and it is the cell that
   goes red if anyone puts the accepted engine-runtime.cjs back. */
test('P3-B2 - the accepted page bundler now BUILDS the Import graph: no computed '
  + 'require, no glob sweep, no engine/test, no engine/seed.cjs, no engine/index.cjs',
  async () => {
    fs.mkdirSync(SCRATCH, { recursive: true });
    fs.writeFileSync(ENTRY, SOURCE);
    withAdmission = await buildBrowser({ outfile: path.join(SCRATCH, 'with-admission/app.js'),
      entryPoints: [ENTRY] });
    const paths = withAdmission.inventory.map(i => i.path);
    for (const gone of ['rebuild/engine/seed.cjs', 'rebuild/engine/index.cjs',
      'rebuild/m4/workout/engine-runtime.cjs'])
      assert.equal(paths.includes(gone), false, gone + ' is still in the admission graph');
    assert.deepEqual(paths.filter(p => /^rebuild\/engine\/test\//.test(p)), [],
      'an engine test harness is still swept in');
    assert.deepEqual(paths.filter(p => /^rebuild\/conform\//.test(p)), [],
      'rebuild/conform is still reached through the sweep');
    /* THE FIGURE, measured on this tree and on the brief's (DECISIONS:472 row E,
       "133 modules"): the same 133. It is recorded exactly so that whoever
       moves the page comes back and re-measures rather than assuming.
       RE-MEASURED BY P3-REPLAY-MEASURE-FAMILY (lane D), and saying so as the
       message above demands: 134. The one added module is
       rebuild/m4/import/measure-replay.cjs, the F7 family, reached ONLY from
       source-admission.mjs. Its own two reads, the S5 producer
       measure-commands.cjs and client/ops.cjs, were already in this graph
       (the page ships the Measure screen), so the family costs exactly one
       module and no new leaf.
       RE-MEASURED AGAIN BY P3-REPLAY-ALL-FAMILIES (lane D): 136. The two added
       modules are rebuild/m4/import/sleep-replay.cjs, the F8 family, and
       rebuild/m4/import/body-composition-class.cjs, the shared class's router
       (RV-G4) - both reached ONLY from source-admission.mjs. F8's own read, the
       N2 producer sleep-commands.cjs, was already in this graph (the page ships
       the Sleep lane) and the router imports nothing at all, so the two cost
       exactly two modules and no new leaf.
       RE-MEASURED AGAIN BY B-LOM (lane D, DECISIONS:486): 137. The one added
       module is rebuild/m4/workout/legacy-order-mapping.cjs, the legacy order
       mapping provider, reached from rebuild/m3/w6/local/today-bindings.mjs -
       so it is in the SHIPPED PAGE's own graph (P3-B1 above), not the Import
       route's, and the DELTA this file measures in P3-B4 is unmoved by it. It
       imports nothing at all: it is a pure function of the recorded selection,
       and it is written that way precisely so that the import lane's own
       encoder and digests stay out of the page (DECISIONS:480). One module, no
       new leaf, no new forbidden name. */
    assert.equal(withAdmission.inventory.length, 137,
      'the Import graph is ' + withAdmission.inventory.length + ' modules, not the '
      + 'measured 137 (the brief\'s 133 plus the F7 family, the F8 family, the '
      + 'shared-class router and B-LOM\'s order-mapping provider): re-measure and say so');
    assert.ok(paths.includes('rebuild/m4/workout/legacy-order-mapping.cjs'));
  });

/* AND THE LAW STILL REFUSES. This is the old P3-B3 with its stub plugin
   deleted (there is nothing left to stub) and its named list narrowed to what
   the graph really carries. The assertion is the page's own assertBundleInputs,
   run over the real inventory - the law, not a restatement of it. */
test('P3-B3 - the page input law STILL refuses that graph, and what it refuses '
  + 'is now EXACTLY engine/migrate.cjs, engine/merge.cjs and the m4/import lane',
  async () => {
    assert.ok(withAdmission, 'P3-B2 builds the graph this cell reads');
    const paths = withAdmission.inventory.map(i => i.path);
    assert.throws(() => assertBundleInputs(withAdmission.inventory), /BUNDLE-INPUTS FAIL/,
      'the accepted page input law refuses this graph');
    assert.deepEqual(tripped(paths).sort(),
      ['rebuild/engine/merge.cjs', 'rebuild/engine/migrate.cjs', 'rebuild/m4/import/*'],
      'the remaining forbidden names are not the three the brief measured');
    /* The six import-lane files, named. rebuild/m4/import/engine-provider.cjs:3
       requires migrate and merge by LITERAL path, to reproduce on the phone the
       walk port.cjs already did on the PC (SOURCE_PREPARATION_REPRODUCTION_
       MISMATCH); that is why those two are here and why removing them is a
       ruling for P3-IMPORT-UI-2, not an author's fix.
       SEVEN since P3-REPLAY-MEASURE-FAMILY: measure-replay.cjs, the F7 family,
       joins them. It is the ONLY name added by that ticket, it is reached only
       from source-admission.mjs, and it reaches nothing of its own - it takes
       the S5 producer's validate() by injection rather than importing it. The
       list stays EXACT: the law is not widened, one measured name is added.
       NINE since P3-REPLAY-ALL-FAMILIES: sleep-replay.cjs, the F8 family, and
       body-composition-class.cjs, the shared class's router (RV-G4). Both are
       reached only from source-admission.mjs; F8 takes the N2 producer's
       validate() by injection rather than importing it, and the router imports
       nothing at all. Two measured names added, the list still EXACT. */
    assert.deepEqual(paths.filter(p => /^rebuild\/m4\/import\//.test(p)).sort(),
      ['rebuild/m4/import/body-composition-class.cjs',
        'rebuild/m4/import/browser-replay.mjs', 'rebuild/m4/import/daily-history.cjs',
        'rebuild/m4/import/engine-provider.cjs', 'rebuild/m4/import/local-source-order.cjs',
        'rebuild/m4/import/local-source-profile.cjs', 'rebuild/m4/import/measure-replay.cjs',
        'rebuild/m4/import/replay-core.cjs', 'rebuild/m4/import/sleep-replay.cjs']);
  });

test('P3-B4 - and the size of what an Import route would put on the phone, '
  + 'measured again now that the sweep is gone', async () => {
  const base = fs.statSync(path.join(SCRATCH, 'baseline/app.js')).size;
  const admission = fs.statSync(path.join(SCRATCH, 'with-admission/app.js')).size;
  assert.ok(admission > base, 'recorded for the record, not a threshold to tune');
  /* Measured on this tree: 121 -> 133 modules, 1 668 175 -> 1 927 799 bytes,
     +259 624 B (+15.6%). Before the swap the same graph was 159 modules and
     +516 670 B, and only with the swept-in engine/test harnesses STUBBED; the
     unstubbed build did not complete at all. */
  assert.ok(admission - base < 400000, 'the admission stack used to cost more than 400 kB '
    + 'with the sweep stubbed; it now costs +' + (admission - base) + ' bytes');
  /* 13 since P3-REPLAY-MEASURE-FAMILY: the seventh m4/import file, the F7
     family measure-replay.cjs. It is ONE module and no new leaf - the delta
     moved by exactly one, which is itself the evidence that the family's two
     reads were already in the page. */
  /* 15 since P3-REPLAY-ALL-FAMILIES: the eighth and ninth m4/import files, the
     F8 family sleep-replay.cjs and the shared class's router
     body-composition-class.cjs. Two modules and no new leaf - the delta moved
     by exactly two, which is itself the evidence that F8's one read was
     already in the page and that the router reads nothing. */
  assert.equal(withAdmission.inventory.length - baseline.inventory.length, 15,
    'the delta is 15 modules: the nine m4/import files, migrate, merge and their reach');
});

process.on('exit', () => { try { fs.rmSync(SCRATCH, { recursive: true, force: true }); } catch {} });
