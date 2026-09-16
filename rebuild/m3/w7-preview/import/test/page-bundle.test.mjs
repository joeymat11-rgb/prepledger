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
       comes back and re-measures rather than assuming, and TWO tickets have
       moved it since, each saying so here instead of editing the number:
       P3-REPLAY-MEASURE-FAMILY (lane D) added ONE, measure-replay.cjs, the F7
       family, reached ONLY from source-admission.mjs, whose own two reads (the
       S5 producer measure-commands.cjs and client/ops.cjs) were already in this
       graph because the page ships the Measure screen - one module, no new
       leaf. P3-IMPORT-UI-2 adds FOUR of the route's own: import-screen.mjs,
       production-mapping.cjs, engine-revision.cjs and browser-entry.mjs, which
       this entry reaches through today-entry.mjs rather than through the
       admission stack. 133 + 1 + 4, re-measured after the rebase onto the
       family, not assumed. */
    assert.equal(withAdmission.inventory.length, 138,
      'the Import graph is ' + withAdmission.inventory.length + ' modules, not the '
      + 'measured 138 (the brief\'s 133, the F7 family\'s one and the route\'s own '
      + 'four): re-measure and say so');
    /* AND THE DELTA, which P3-REPLAY-MEASURE-FAMILY asserted (at 13) in its own
       P3-B4 over these same two inventories. That cell's SIZE bound is replaced
       in P3-B5 below, where the reason it could not fail is written out; its
       module-delta assertion is not dropped with it, it stands here, over the
       graph it was always about. 13 + the route's four. */
    assert.equal(withAdmission.inventory.length - baseline.inventory.length, 17,
      'the delta is 17 modules: the eight m4/import files, migrate, merge, their '
      + 'reach, and the route\'s own four');
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
    /* The EIGHT import-lane files, named. engine-provider.cjs:3 requires migrate
       and merge by LITERAL path, to reproduce on the phone the walk port.cjs
       already did on the PC (SOURCE_PREPARATION_REPRODUCTION_MISMATCH); that is
       why those two are here, and why they are now permitted on ONE route. */
    assert.deepEqual(withAdmission.inventory.map(i => i.path)
      .filter(p => /^rebuild\/m4\/import\//.test(p)).sort(),
      ['rebuild/m4/import/browser-replay.mjs', 'rebuild/m4/import/daily-history.cjs',
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
        'rebuild/m4/import/production-mapping.cjs', 'rebuild/m4/import/replay-core.cjs']);
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
  assert.deepEqual(only, ['rebuild/coach/engine-revision.cjs', 'rebuild/engine/merge.cjs',
    'rebuild/engine/migrate.cjs', 'rebuild/m3/w6/local/browser-entry.mjs',
    'rebuild/m3/w6/local/source-admission.mjs', 'rebuild/m3/w6/local/source-platform.mjs',
    'rebuild/m3/w6/reading-history.mjs', IMPORT_ENTRY,
    'rebuild/m4/import/browser-replay.mjs', 'rebuild/m4/import/daily-history.cjs',
    'rebuild/m4/import/engine-provider.cjs', 'rebuild/m4/import/local-source-order.cjs',
    'rebuild/m4/import/local-source-profile.cjs', 'rebuild/m4/import/measure-replay.cjs',
    'rebuild/m4/import/production-mapping.cjs', 'rebuild/m4/import/replay-core.cjs'],
    'the Import route costs the page exactly these modules and no others');
});

test('P3-B5 - A1 BUILDS with the new law, and what the Import route costs the '
  + 'one page is measured, not assumed', async () => {
  today = await buildToday({ dist: path.join(REPO, '.tmp/p3-a1-dist'),
    scratch: path.join(REPO, '.tmp/p3-a1-scratch') });
  assert.deepEqual(today.assets, ['index.html', 'styles.css', 'app.js'],
    'the page is still three assets: the route is lazy, not a second document');
  assert.equal(today.importRoute.route, IMPORT_ENTRY);
  const built = fs.statSync(path.join(today.dist, 'app.js')).size;
  const before = fs.statSync(path.join(SCRATCH, 'baseline/app.js')).size;
  /* Measured on this tree: the shipped page WITHOUT the route was 1 668 330 B /
     121 modules; with it, 1 961 006 B / 136 modules, +292 676 B (+17.5%). The
     brief measured +260 KB for source-admission alone (DECISIONS:475); the
     difference is the route's own four extra modules - production-mapping.cjs,
     engine-revision.cjs, browser-entry.mjs and import-screen.mjs itself - which
     the brief's probe did not carry. Recorded so the next author re-measures. */
  assert.ok(built > before, 'the route costs bytes and this cell records how many');
  assert.ok(built - before < 400000,
    'the route now costs +' + (built - before) + ' bytes on the one page');
  assert.equal(today.inventory.length - 121, 15, 'the delta is 15 modules');
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
