/* P3-IMPORT-UI-2 - THE IMPORT ROUTE'S OWN LAW, EXECUTED.

   THIS FILE HAS BEEN REWRITTEN A SECOND TIME, BECAUSE THE WALL IT WAS BUILT TO
   GO RED ON HAS NOW FALLEN ALL THE WAY. Round one asserted that the accepted
   bundler REFUSED the admission graph; P3-D-FOLLOWONS swapped source-admission
   .mjs onto the accepted host mirror and round two replaced that with the
   narrower, stronger statement of the same fact - exactly which FORBIDDEN names
   were left. This round is the ruling on those three names (DECISIONS:475 (1)
   and (4)) and the law that replaced the outright ban.

   NOTHING BELOW IS RELAXED, AND THE RULE IS STATED RATHER THAN DELETED.

   THE OLD RULE: today/build.mjs FORBIDDEN refused rebuild/engine/migrate.cjs,
   rebuild/engine/merge.cjs and rebuild/m4/import/* anywhere in the page, because
   the page is a reader of an already migrated state.

   THE NEW RULE, which is what P3-B3 and P3-B5 now execute: the page is still a
   reader of migrated state EVERYWHERE EXCEPT the Import route, where it must
   reproduce the PC's walk to prove the bundle it is about to adopt. Those three
   names may therefore be in the bundle, and may be reached ONLY through
   build.mjs IMPORT_ENTRY (rebuild/m3/w7-preview/import/import-screen.mjs). The
   guard is build.mjs assertImportRouteIsolation, which walks today-entry.mjs's
   graph WITHOUT crossing the dynamic edge into that module and refuses if any of
   the three is reachable. P3-B3 proves it refuses, on a graph built to trip it.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { REPO } from './support.mjs';
import { buildBrowser } from '../../../w6/build-browser.mjs';
import { assertBundleInputs, assertImportRouteIsolation, IMPORT_ENTRY, buildToday }
  from '../../today/build.mjs';
import { composeSite } from '../../../../slice/pwa/build-pwa.mjs';

const SCRATCH = path.join(REPO, '.tmp/p3-page-bundle-probe');
const ENTRY = path.join(SCRATCH, 'reaches-admission.mjs');
const abs = p => path.join(REPO, p).replaceAll('\\', '/');
/* The shipped page entry PLUS the one import an Import route cannot avoid. */
const SOURCE = 'import * as Entry from "' + abs('rebuild/m3/w7-preview/today/today-entry.mjs') + '";\n'
  + 'import { createLocalSourceController } from "'
  + abs('rebuild/m3/w6/local/source-admission.mjs') + '";\n'
  + 'export default { Entry, createLocalSourceController };\n';

/* The three names the ruling re-reasoned, restated by name so these cells can
   say WHICH one a graph carries instead of only that it carries one. */
const ROUTE_ONLY = Object.freeze([
  ['rebuild/engine/migrate.cjs', p => p === 'rebuild/engine/migrate.cjs'],
  ['rebuild/engine/merge.cjs', p => p === 'rebuild/engine/merge.cjs'],
  ['rebuild/m4/import/*', p => /^rebuild\/m4\/import\//.test(p)]]);
/* The names the ruling did NOT touch. Every one keeps its own reason and its
   outright ban, and this list is what proves the ban is still there. */
const STILL_FORBIDDEN = Object.freeze([
  ['rebuild/engine/seed.cjs', p => p === 'rebuild/engine/seed.cjs'],
  ['rebuild/engine/index.cjs', p => p === 'rebuild/engine/index.cjs'],
  ['rebuild/engine/test/*', p => /^rebuild\/engine\/test\//.test(p)],
  ['rebuild/conform/*', p => /^rebuild\/conform\//.test(p)],
  ['ledger/*', p => /^ledger\//.test(p)],
  ['src/history.js', p => p === 'src/history.js'],
  ['rebuild/m4/workout/engine-runtime.cjs', p => p === 'rebuild/m4/workout/engine-runtime.cjs']]);
/* THE MODULES THE IMPORT ROUTE COSTS THE ONE PAGE, in one place because two
   cells now need the same list: P3-B4 proves it IS the route-only set by
   walking the built graph, and P3-B5 weighs exactly those inputs in the
   shipped asset (round 2, review r1 finding 3). */
const ROUTE_MODULES = Object.freeze(['rebuild/coach/engine-revision.cjs',
  'rebuild/engine/merge.cjs', 'rebuild/engine/migrate.cjs',
  'rebuild/m3/w6/local/browser-entry.mjs', 'rebuild/m3/w6/local/source-admission.mjs',
  'rebuild/m3/w6/local/source-platform.mjs', 'rebuild/m3/w6/reading-history.mjs',
  'rebuild/m3/w7-preview/import/import-screen.mjs',
  'rebuild/m4/import/browser-replay.mjs', 'rebuild/m4/import/daily-history.cjs',
  'rebuild/m4/import/engine-provider.cjs', 'rebuild/m4/import/local-source-order.cjs',
  'rebuild/m4/import/local-source-profile.cjs',
  /* SIXTEENTH SINCE THE REBASE ONTO P3-REPLAY-MEASURE-FAMILY: the F7 family.
     source-admission.mjs reaches it, so the route carries it and the boot path
     still does not. Named, not folded into a wildcard. */
  'rebuild/m4/import/measure-replay.cjs',
  /* SEVENTEENTH AND EIGHTEENTH, AT THE S6 RESEAL: the F8 family sleep-replay.cjs and
     body-composition-class.cjs, the shared class's router (RV-G4). Both arrived on the tip
     with P3-REPLAY-ALL-FAMILIES, after the base this list was last measured against, and
     both are reached ONLY from source-admission.mjs - so, like the F7 family before them,
     the ROUTE carries them and the Today boot path still does not. Named here rather than
     folded into a wildcard, and measured on the post-merge tree rather than added by
     arithmetic: this cell and P3-B5 below both moved by exactly two, which is itself the
     evidence that neither family brought a new leaf with it. */
  'rebuild/m4/import/body-composition-class.cjs', 'rebuild/m4/import/sleep-replay.cjs',
  'rebuild/m4/import/production-mapping.cjs', 'rebuild/m4/import/replay-core.cjs',
  /* NINETEENTH, WITH P3-REAL-SHAPE (DECISIONS:521): the shared lift
     correspondence helper. source-admission.mjs imports it for the programme
     rule and the capture block, and m4/workout/plan-edit-model.cjs imports it
     for the companion - but the companion is not on the Today BOOT path, so
     this module is reached here only through source-admission.mjs and the route
     carries it while the boot path still does not. It is 42 lines of pure
     function, imports nothing at all, brings no forbidden name and adds no
     leaf. Named here rather than folded into a wildcard, and MEASURED on this
     tree rather than added by arithmetic: the graph moved by exactly one. */
  'rebuild/m4/workout/lift-correspondence.cjs']);
const tripped = (list, paths) => list.filter(([, m]) => paths.some(m)).map(([label]) => label);
const graphOf = outfile => JSON.parse(fs.readFileSync(outfile + '.meta.json', 'utf8')).metafile;

let baseline = null, withAdmission = null, today = null;

test('P3-B1 - the SHIPPED page builds, and its graph now carries the Import '
  + 'route: the three re-reasoned names are IN the bundle, every other FORBIDDEN '
  + 'name is still absent', async () => {
  const out = path.join(SCRATCH, 'baseline/app.js');
  baseline = await buildBrowser({ outfile: out,
    entryPoints: [path.join(REPO, 'rebuild/m3/w7-preview/today/today-entry.mjs')] });
  const paths = baseline.inventory.map(i => i.path);
  assert.doesNotThrow(() => assertBundleInputs(baseline.inventory),
    'the page input law accepts its own page');
  assert.deepEqual(tripped(STILL_FORBIDDEN, paths), [],
    'a name the ruling did not touch is in the page');
  assert.deepEqual(tripped(ROUTE_ONLY, paths).sort(),
    ['rebuild/engine/merge.cjs', 'rebuild/engine/migrate.cjs', 'rebuild/m4/import/*'],
    'the Import route is not in the page at all: the screen would open nothing');
  assert.ok(paths.includes(IMPORT_ENTRY), 'the named route entry is in the graph');
});

test('P3-B2 - the accepted page bundler BUILDS the admission graph: no computed '
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
       "133 modules"). It is recorded exactly so that whoever moves the page
       comes back and re-measures rather than assuming, and THREE tickets have
       moved it since, each saying so here instead of editing the number:
       P3-REPLAY-MEASURE-FAMILY (lane D) added ONE, measure-replay.cjs, the F7
       family, reached ONLY from source-admission.mjs, whose own two reads (the
       S5 producer measure-commands.cjs and client/ops.cjs) were already in this
       graph because the page ships the Measure screen - one module, no new leaf.
       P3-REPLAY-ALL-FAMILIES (lane D) added TWO: sleep-replay.cjs, the F8 family,
       and body-composition-class.cjs, the shared class's router (RV-G4), both
       reached ONLY from source-admission.mjs; F8's own read, the N2 producer
       sleep-commands.cjs, was already here because the page ships the Sleep lane,
       and the router imports nothing at all - two modules, no new leaf.
       P3-IMPORT-UI-2 adds FOUR of the route's own: import-screen.mjs,
       production-mapping.cjs, engine-revision.cjs and browser-entry.mjs, which
       this entry reaches through today-entry.mjs rather than through the
       admission stack.
       S6 RESEAL: this cell is where the two lane-D families and the UI-2 route
       first stand on one tree. The branch values 136 and 138 each counted their
       own additions against a base that had not seen the other, so neither is the
       post-merge truth and the number is RE-MEASURED here rather than summed:
       133 + 1 + 2 + 4.
       B-LOM (lane D, DECISIONS:486, :492) is the FOURTH ticket to move it and
       the first to move it off the Import route: legacy-order-mapping.cjs is
       reached from rebuild/m3/w6/local/today-bindings.mjs, so it stands in the
       SHIPPED PAGE's own boot graph and not in the route. B-LOM measured 137 on
       a base that had never seen UI-2's four; this cell had 140 on a base that
       had never seen B-LOM's one. Neither is the post-merge truth, so BOTH
       SIDES ARE RE-MEASURED HERE rather than either being carried forward: the
       measurement is 141. It imports nothing at all, brings no forbidden name,
       and adds no leaf. */
    /* P3-REAL-SHAPE (DECISIONS:521) is the FIFTH ticket to move it, by ONE:
       rebuild/m4/workout/lift-correspondence.cjs, the shared helper the
       programme rule, the capture block and the Edit My Week companion all
       import so the three cannot disagree. It is reached here only through
       source-admission.mjs, so it is route-only and the Today boot count does
       not move. RE-MEASURED on this tree rather than summed: 142. */
    /* PASSPHRASE-NORMALIZE (lane C, DECISIONS:520) is the SIXTH ticket to move
       it, by ONE: rebuild/m3/setup/port/passphrase.cjs, the one canonical form
       of the six words, which unseal.cjs on the PC and import-bundle.mjs on the
       phone now BOTH read instead of each folding on its own. It is the second
       module after B-LOM's to land on the BOOT side rather than in the route:
       import-bundle.mjs is reached from local-client.mjs, which today-bindings
       reaches on boot, so the Today boot graph moves 122 -> 123 and the
       route-only set is UNMOVED at 19 (P3-B4's deepEqual below still holds name
       for name). It is pure, imports nothing at all, brings no forbidden name
       and adds no leaf. RE-MEASURED on this tree rather than summed: 143. */
    assert.equal(withAdmission.inventory.length, 143,
      'the Import graph is ' + withAdmission.inventory.length + ' modules, not the '
      + 'measured 143 (the brief\'s 133, the F7 family\'s one, the F8 family and '
      + 'the shared-class router\'s two, the route\'s own four, B-LOM\'s '
      + 'order-mapping provider, P3-REAL-SHAPE\'s lift-correspondence '
      + 'helper, and PASSPHRASE-NORMALIZE\'s shared passphrase form): '
      + 're-measure and say so');
    assert.ok(paths.includes('rebuild/m4/workout/legacy-order-mapping.cjs'),
      'B-LOM\'s order-mapping provider is not in this graph at all');
    /* AND THE DELTA, which P3-REPLAY-MEASURE-FAMILY asserted (at 13) in its own
       P3-B4 over these same two inventories, and which MEANS SOMETHING ELSE ON
       THIS BRANCH - so it is re-measured and the change of meaning is written
       down rather than the number quietly edited. On the family's base the
       baseline build (today-entry.mjs at HEAD) did NOT carry the admission
       stack, so "what a static import of source-admission.mjs adds" was the
       whole stack: 13 modules. On this branch today-entry.mjs reaches the route
       through the dynamic edge today-app.cjs opens, so the BASELINE already
       carries all 16 route modules and the static import adds no module at all.
       The delta is 1, and the 1 is this probe's own entry file. That is not a
       weaker fact: it is why P3-B3 and P3-B4 below prove ISOLATION - which path
       reaches them - and not presence, which the old number stood for. */
    assert.equal(withAdmission.inventory.length - baseline.inventory.length, 1,
      'the delta is 1 module - the probe entry itself - because the baseline '
      + 'build already carries the whole route through the dynamic edge');
  });

/* THE RULE CHANGE, SAID OUT LOUD AND THEN EXECUTED FROM BOTH SIDES. The old
   P3-B3 asserted `assert.throws(assertBundleInputs)` on this graph. That is now
   FALSE by ruling, not by accident, so the cell states the new rule and proves
   the boundary that replaced it: the same graph, reached STATICALLY from
   today-entry.mjs with no Import route to hide behind, is refused by the law
   cell that now owns the question. */
test('P3-B3 - the input law no longer bans the three names outright, and '
  + 'assertImportRouteIsolation REFUSES a graph whose Today boot path reaches them',
  async () => {
    assert.ok(withAdmission, 'P3-B2 builds the graph this cell reads');
    /* S6 RESEAL, THE RULE THAT WON AND WHY. The tip's side of this cell asserted
       `assert.throws(assertBundleInputs)` - the OLD law. P3-IMPORT-UI-2 did not
       drift off it, it RULED it false at DECISIONS:475 (1): the three names are
       admitted to the page because the Import route must reproduce the PC's walk.
       A ruling supersedes the cell it rules on, so the UI-2 side stands here whole.
       What the UI-2 side could NOT know is what landed on the tip after its base:
       P3-REPLAY-ALL-FAMILIES' two names. Those are carried into the exact list
       below, so the rule is UI-2's and the inventory is the post-merge tree's. */
    assert.doesNotThrow(() => assertBundleInputs(withAdmission.inventory),
      'DECISIONS:475 (1): migrate.cjs, merge.cjs and the m4/import lane are admitted '
      + 'to the page, because the Import route must reproduce the PC\'s walk');

    const planted = graphOf(path.join(SCRATCH, 'with-admission/app.js'));
    assert.throws(() => assertImportRouteIsolation(planted,
      { entry: path.relative(REPO, ENTRY).replaceAll('\\', '/') }),
      /IMPORT-ROUTE FAIL/,
      'a graph that reaches the admission stack without going through the route '
      + 'entry is exactly what this law exists to refuse');
    /* And the refusal NAMES what it found and who reached it. */
    let message = '';
    try { assertImportRouteIsolation(planted, { entry: path.relative(REPO, ENTRY).replaceAll('\\', '/') }); }
    catch (error) { message = error.message; }
    assert.match(message,
      /the Today boot graph reaches rebuild\/engine\/migrate\.cjs -> rebuild\/engine\/migrate\.cjs \(from rebuild\/m4\/import\/engine-provider\.cjs\)/,
      'the refusal must name the file it found AND the module that reached it: ' + message);
    /* The TEN import-lane files, named. engine-provider.cjs:3 requires migrate
       and merge by LITERAL path, to reproduce on the phone the walk port.cjs
       already did on the PC (SOURCE_PREPARATION_REPRODUCTION_MISMATCH); that is
       why those two are here, and why they are now permitted on ONE route.
       S6 RESEAL: UI-2 measured EIGHT against a base that predated
       P3-REPLAY-ALL-FAMILIES. On the post-merge tree that ticket's two names -
       sleep-replay.cjs (the F8 family) and body-composition-class.cjs (the shared
       class's router, RV-G4) - are in this graph too, both reached ONLY from
       source-admission.mjs, F8 taking the N2 producer's validate() by injection
       and the router importing nothing at all. Ten, and the list stays EXACT: the
       law is not widened, the two measured names are named. */
    assert.deepEqual(withAdmission.inventory.map(i => i.path)
      .filter(p => /^rebuild\/m4\/import\//.test(p)).sort(),
      ['rebuild/m4/import/body-composition-class.cjs',
        'rebuild/m4/import/browser-replay.mjs', 'rebuild/m4/import/daily-history.cjs',
        'rebuild/m4/import/engine-provider.cjs', 'rebuild/m4/import/local-source-order.cjs',
        'rebuild/m4/import/local-source-profile.cjs',
        /* The F7 family, from P3-REPLAY-MEASURE-FAMILY, kept by name across this
           rebase: the ONLY name that ticket added, reached only from
           source-admission.mjs, reaching nothing of its own (it takes the S5
           producer's validate() by injection). The list stays EXACT: the law is
           not widened, the measured names are named. */
        'rebuild/m4/import/measure-replay.cjs',
        /* And the whole point of DECISIONS:475 (3): the ONE production execution
           calendar, reached through the route and never through a TEST-ONLY
           registry. */
        'rebuild/m4/import/production-mapping.cjs', 'rebuild/m4/import/replay-core.cjs',
        'rebuild/m4/import/sleep-replay.cjs']);
  });

test('P3-B4 - THE LAW CELL over the REAL page: the Today boot graph excludes '
  + 'migrate.cjs, merge.cjs and the m4/import lane; the Import route includes '
  + 'exactly them plus the lane', async () => {
  const graph = graphOf(path.join(SCRATCH, 'baseline/app.js'));
  const result = assertImportRouteIsolation(graph);
  assert.equal(result.route, IMPORT_ENTRY);
  const inputs = graph.inputs;
  const boot = new Set(), stack = ['rebuild/m3/w7-preview/today/today-entry.mjs'];
  while (stack.length) {
    const at = stack.pop();
    if (boot.has(at) || at === IMPORT_ENTRY) continue;
    boot.add(at);
    for (const edge of (inputs[at] || { imports: [] }).imports)
      if (edge.path !== IMPORT_ENTRY && !boot.has(edge.path)) stack.push(edge.path);
  }
  assert.equal(boot.size, result.boot);
  assert.deepEqual(tripped(ROUTE_ONLY, [...boot]), [], 'the boot path reaches one of the three');
  const route = new Set(), r = [IMPORT_ENTRY];
  while (r.length) {
    const at = r.pop();
    if (route.has(at)) continue;
    route.add(at);
    for (const edge of (inputs[at] || { imports: [] }).imports) if (!route.has(edge.path)) r.push(edge.path);
  }
  const only = [...route].filter(p => !boot.has(p)).sort();
  assert.deepEqual(only, [...ROUTE_MODULES].sort(),
    'the Import route costs the page exactly these modules and no others');
  assert.ok(ROUTE_MODULES.includes(IMPORT_ENTRY), 'the route entry is not in the route-only set');
});

test('P3-B5 - A1 BUILDS with the new law, and what the Import route costs the '
  + 'one page is measured, not assumed', async () => {
  today = await buildToday({ dist: path.join(REPO, '.tmp/p3-a1-dist'),
    scratch: path.join(REPO, '.tmp/p3-a1-scratch') });
  assert.deepEqual(today.assets, ['index.html', 'styles.css', 'app.js'],
    'the page is still three assets: the route is lazy, not a second document');
  assert.equal(today.importRoute.route, IMPORT_ENTRY);
  const built = fs.statSync(path.join(today.dist, 'app.js')).size;
  /* ROUND 2, REVIEW R1 FINDING 3, AND THE RULE WRITTEN WHERE THE OLD ONE STOOD.
     THE OLD ASSERTION was `built - before < 400000`, with `before` the size of
     SCRATCH/baseline/app.js. That file is built from today-entry.mjs AT HEAD and
     therefore ALREADY CARRIES THE ROUTE, so the difference was a few hundred
     bytes and the bound could not fail: it proved nothing and it read as though
     it proved the report's headline figures. It is REPLACED, not dropped, by
     the same fact measured where the bundler actually records it -
     esbuild's per-input bytesInOutput, in the ONE asset the page ships - so
     what the route costs is proved here instead of hand-measured. The base
     build is still what the report quotes for the whole-asset figure, and the
     report now says so in as many words. */
  const outputs = JSON.parse(fs.readFileSync(path.join(REPO, '.tmp/p3-a1-scratch/app.js.meta.json'),
    'utf8')).metafile.outputs;
  const asset = outputs[Object.keys(outputs).find(name => name.endsWith('app.js'))];
  assert.ok(asset && asset.inputs, 'the build recorded no per-input accounting');
  const bytesOf = names => names.reduce((sum, name) =>
    sum + ((asset.inputs[name] || { bytesInOutput: 0 }).bytesInOutput || 0), 0);
  const routeOnly = ROUTE_MODULES.filter(name => asset.inputs[name]);
  assert.deepEqual(routeOnly.sort(), [...ROUTE_MODULES].sort(),
    'a module P3-B4 proved is route-only is not in the shipped asset');
  const routeBytes = bytesOf(ROUTE_MODULES);
  const allBytes = bytesOf(Object.keys(asset.inputs));
  /* The route is a SIXTH of the asset every athlete downloads, and nothing here
     rounds that down. The band is wide enough to survive a bundler patch and
     narrow enough to fail if the route ever doubles or is quietly dropped; the
     exact figure of the day is in the message. */
  assert.ok(routeBytes > 250000 && routeBytes < 400000,
    'the Import route contributes ' + routeBytes + ' B of the asset\'s ' + allBytes
    + ' B (' + (100 * routeBytes / allBytes).toFixed(1) + '%): re-measure and say so');
  assert.ok(allBytes <= built && allBytes > built - 120000,
    'the per-input accounting (' + allBytes + ' B) does not add up to the built asset ('
    + built + ' B), so the figure above is not the whole story');
  /* AND THE MODULE DELTA, against the base this branch is built on. 121 is the
     pinned-input count of the base, measured by building that commit in its own
     worktree; it is a constant here because this cell cannot check out another
     commit, and the report names the sha. RE-MEASURED ON THE NEW BASE
     (origin/rebuild/d-p3-replay-measure 47a223d): the boot count is still 121 -
     the F7 family is reached only from source-admission.mjs and so is route-only
     - and the delta is 16, the fifteen of round 2 plus measure-replay.cjs.
     RE-MEASURED AGAIN AT THE S6 RESEAL, on the post-merge tree: the boot count is
     still 121 - P3-REPLAY-ALL-FAMILIES' two modules, sleep-replay.cjs and the
     shared class's router body-composition-class.cjs, are reached only from
     source-admission.mjs and so are route-only exactly as the F7 family is - and
     the delta is 18, the sixteen above plus those two. The boot count holding at
     121 across all three of these tickets is the fact worth keeping: every module
     any of them added went to the ROUTE and not one reached the Today boot path.
     RE-MEASURED AGAIN WITH B-LOM MERGED (DECISIONS:492), and this is the first
     time that last sentence stops being true, so it is said out loud rather than
     the number edited: legacy-order-mapping.cjs is reached from
     rebuild/m3/w6/local/today-bindings.mjs, which is BOOT, so the Today boot
     graph goes 121 -> 122 and the total goes 139 -> 140. The route-only set is
     UNMOVED at 18 (P3-B4's ROUTE_MODULES is unchanged and the deepEqual above
     still holds name for name), so this delta - total minus the constant base -
     is 19 and is now 18 route modules PLUS ONE BOOT MODULE. The figure that
     still means "what the Import route costs the page" is the 18 of P3-B4 and
     the byte accounting above it, not this subtraction; the subtraction's base
     is a frozen constant of another commit and cannot move with the boot graph.
     BOTH SIDES RE-MEASURED: B-LOM's own 122 pinned inputs was a boot-only tree
     with no route, and this cell's 18 was a tree that had never seen B-LOM. */
  /* RE-MEASURED AGAIN WITH P3-REAL-SHAPE (DECISIONS:521). The route-only set
     moves 18 -> 19: lift-correspondence.cjs is reached only through
     source-admission.mjs, so the Today boot graph is UNMOVED at 122 and the
     sentence B-LOM broke holds again for this ticket - every module it added
     went to the ROUTE. The delta is therefore 20, which is 19 route modules
     plus B-LOM's one boot module. */
  /* RE-MEASURED AGAIN WITH PASSPHRASE-NORMALIZE (DECISIONS:520), and it is the
     SECOND ticket to move the Today boot graph rather than the route, so that is
     said out loud here too: rebuild/m3/setup/port/passphrase.cjs is reached from
     import-bundle.mjs, which local-client.mjs reaches and today-bindings.mjs
     reaches on boot. The boot graph goes 122 -> 123, the route-only set is
     UNMOVED at 19, and the delta is therefore 21: 19 route modules plus TWO boot
     modules, B-LOM's order mapping and this one. The figure that still means
     "what the Import route costs the page" is the 19 of P3-B4 and the byte
     accounting above it, not this subtraction. */
  const BASE_PINNED_INPUTS = 121;
  assert.equal(today.inventory.length - BASE_PINNED_INPUTS, 21,
    'the delta is ' + (today.inventory.length - BASE_PINNED_INPUTS) + ' modules, not the '
    + 'measured 21 (the route\'s 19 plus the two boot modules, B-LOM\'s order '
    + 'mapping and the shared passphrase form): re-measure and say so');
  assert.equal(ROUTE_MODULES.length, 19,
    'the ROUTE-ONLY count moved; the delta above is no longer 19 route plus 1 boot');
});

test('P3-B6 - the route is LAZY in the built asset: its module bodies are behind '
  + 'the initialiser the dynamic import calls, so the Today boot path does not '
  + 'run a byte of the admission stack', async () => {
  assert.ok(today, 'P3-B5 builds the page this cell reads');
  const app = fs.readFileSync(path.join(today.dist, 'app.js'), 'utf8');
  assert.match(app, /var\s+import_screen_exports\s*=\s*\{\}/,
    'the route is not a lazily initialised module at all');
  assert.match(app, /init_import_screen\s*=\s*__esm\(\{/,
    'esbuild did not wrap the route in its own initialiser');
  const calls = app.match(/init_import_screen\(\)/g) || [];
  assert.equal(calls.length, 1, 'the initialiser is called from ' + calls.length
    + ' places: the only caller may be the dynamic import');
  assert.match(app, /Promise\.resolve\(\)\.then\(\(\)\s*=>\s*\(init_import_screen\(\),\s*import_screen_exports\)\)/,
    'the one call site is not the dynamic import today-app.cjs writes');
});

test('P3-B7 - A5 builds the installable slice over that page and PRECACHES the '
  + 'asset the route is in, so the Import screen works offline', async () => {
  assert.ok(today, 'P3-B5 builds the page this cell reads');
  const site = await composeSite({ a1: today });
  const app = site.precache.find(row => /^app\.[0-9a-f]{16}\.js$/.test(row.path));
  assert.ok(app, 'the page bundle is not in the precache manifest: ' + JSON.stringify(site.precache.map(r => r.path)));
  const bytes = site.files.get(app.path).toString('utf8');
  assert.ok(bytes.includes('Choose the earned-port file'),
    'the precached asset does not carry the Import route');
  assert.ok(bytes.includes('init_import_screen'),
    'the precached asset does not carry the route initialiser');
  /* ONE asset, not a second chunk. The route is loaded by a dynamic import, and
     the accepted bundler answers a dynamic import inside an `outfile` build with
     a lazily initialised module in the SAME file (P3-B6). So there is no second
     file for A5 to list, A5 is unchanged, and "the chunk is precached" is true
     of the one asset that carries it. Reported as a deviation from the ticket's
     wording in rebuild/lanes/c/P3-IMPORT-UI-2-AUTHOR-REPORT.md, with the
     splitting alternative measured there. */
  assert.deepEqual(site.precache.filter(r => r.path.endsWith('.js')).map(r => r.path).sort(),
    [app.path, 'preflight.' + site.names.preflightJs.split('.')[1] + '.js'].sort(),
    'the slice serves more JavaScript than the page and its preflight');
});

process.on('exit', () => {
  for (const dir of [SCRATCH, path.join(REPO, '.tmp/p3-a1-dist'), path.join(REPO, '.tmp/p3-a1-scratch')])
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
});
