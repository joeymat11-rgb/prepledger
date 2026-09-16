/* P3-IMPORT-UI - WHY THE IMPORT SCREEN IS NOT ON THE PHONE YET, EXECUTED.

   The ticket asks for an Import route inside the shipped Today page: pick the
   bundle, type the six words, review, confirm. Steps one and two are reachable
   (rebuild/m3/w6/local/import-bundle.mjs imports only the repository, strict
   JSON and the local client). The review and the confirm are not: they are
   rebuild/m3/w6/local/source-admission.mjs, and that module's graph is refused
   by the page's OWN accepted build law.

   This cell does not argue that. It runs the accepted page bundler over the
   one reach an Import route must make and records what happens, so the wall is
   a standing fact with a number on it rather than a paragraph in a report.

   IT WILL GO RED THE DAY THE WALL COMES DOWN. That is the point: whoever makes
   the admission stack page-safe (the A2 pattern - an accepted host-owned mirror
   under rebuild/m3/w6/host/, as engine-runtime-host.cjs already is for
   engine-runtime.cjs) should have to come back here and say so. It asserts a
   fact about today's tree; it authorises nothing and relaxes nothing. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { builtinModules, createRequire } from 'node:module';
import { REPO } from './support.mjs';
import { buildBrowser } from '../../../w6/build-browser.mjs';
import { assertBundleInputs } from '../../today/build.mjs';

const SCRATCH = path.join(REPO, '.tmp/p3-page-bundle-probe');
const ENTRY = path.join(SCRATCH, 'reaches-admission.mjs');
/* The shipped page entry PLUS the one import an Import route cannot avoid. */
const SOURCE = 'import * as Entry from "'
  + path.join(REPO, 'rebuild/m3/w7-preview/today/today-entry.mjs').replaceAll('\\', '/') + '";\n'
  + 'import { createLocalSourceController } from "'
  + path.join(REPO, 'rebuild/m3/w6/local/source-admission.mjs').replaceAll('\\', '/') + '";\n'
  + 'export default { Entry, createLocalSourceController };\n';

test('P3-B1 - the SHIPPED page still builds, so this cell is measuring a change '
  + 'and not a broken tree', async () => {
  const out = path.join(SCRATCH, 'baseline/app.js');
  const built = await buildBrowser({ outfile: out,
    entryPoints: [path.join(REPO, 'rebuild/m3/w7-preview/today/today-entry.mjs')] });
  assert.doesNotThrow(() => assertBundleInputs(built.inventory));
  const paths = built.inventory.map(i => i.path);
  assert.equal(paths.filter(p => /^rebuild\/m4\/import\//.test(p)).length, 0,
    'the page carries none of the import lane today');
  assert.equal(paths.filter(p => /^rebuild\/engine\/test\//.test(p)).length, 0);
});

test('P3-B2 - the accepted page bundler REFUSES the graph an Import route needs',
  async () => {
    fs.mkdirSync(SCRATCH, { recursive: true });
    fs.writeFileSync(ENTRY, SOURCE);
    let refusal = null;
    try {
      await buildBrowser({ outfile: path.join(SCRATCH, 'with-admission/app.js'),
        entryPoints: [ENTRY] });
    } catch (error) { refusal = error; }
    assert.ok(refusal, 'the page boundary refused the build');
    const files = [...new Set((refusal.errors || [])
      .map(e => (e.location ? e.location.file : '?').replaceAll('\\', '/')))];
    assert.ok(files.length > 0, 'esbuild named the modules it refused: ' + refusal.message);
    /* rebuild/m4/workout/engine-runtime.cjs composes the engine through one
       COMPUTED require; esbuild answers a computed require by globbing the
       directory, which in a full checkout sweeps in rebuild/engine/test and,
       through it, rebuild/conform. Both are Node-only, and both are already
       FORBIDDEN in the page by name (today/build.mjs). */
    assert.ok(files.some(f => /^rebuild\/engine\/test\//.test(f)),
      'the engine test harnesses were swept in: ' + files.join(', '));
    assert.ok(files.every(f => /^rebuild\/(?:engine\/test|conform)\//.test(f)),
      'nothing else was refused: ' + files.join(', '));
  });

/* The P2 consumer witness got the admission stack into a browser realm by
   ADDING a plugin that stubs the swept-in Node-only harnesses - "ONE addition
   this witness needs and the page build does not", in its own words
   (rebuild/m3/w6/test/local-source-consumer-browser.mjs). Granting the page
   that same addition is the most generous reading of the ticket, so this cell
   grants it and then asks the page's OWN input law what it thinks. */
test('P3-B3 - even with the swept-in harnesses stubbed, the page input law still '
  + 'refuses, and these are the modules it refuses', async () => {
  const { build } = createRequire(new URL('../../../w6/build-browser.mjs', import.meta.url))('esbuild');
  const builtins = new Set(builtinModules.flatMap(n => [n, 'node:' + n.replace(/^node:/, '')]));
  const approved = new Set(['ops.cjs', 'plan.cjs']
    .map(n => path.resolve(REPO, 'rebuild/client', n).replaceAll('\\', '/')));
  const swept = /rebuild[\\/](?:engine[\\/]test|conform)[\\/]/;
  fs.mkdirSync(SCRATCH, { recursive: true });
  fs.writeFileSync(ENTRY, SOURCE);
  const result = await build({ absWorkingDir: REPO, entryPoints: [ENTRY],
    outfile: path.join(SCRATCH, 'stubbed/app.js'), bundle: true, platform: 'browser',
    format: 'esm', target: 'es2022', metafile: true, logLevel: 'silent',
    logOverride: { 'unsupported-dynamic-import': 'silent' },
    plugins: [{ name: 'p3-stub-swept-in', setup(b) {
      b.onResolve({ filter: /.*/ }, args => {
        if (swept.test(args.path) || swept.test(path.resolve(args.resolveDir || REPO, args.path)))
          return { path: args.path, namespace: 'p3-never' };
        if (args.path === 'node:crypto' && approved.has(String(args.importer).replaceAll('\\', '/')))
          return { path: path.resolve(REPO, 'rebuild/m3/w6/node-sha256-browser.mjs') };
        if (builtins.has(args.path)) return { errors: [{ text: 'Unapproved browser Node import ' + args.path }] };
        return undefined;
      });
      b.onLoad({ filter: /.*/, namespace: 'p3-never' },
        () => ({ contents: 'module.exports = {};', loader: 'js' }));
    } }] });
  const paths = Object.keys(result.metafile.inputs).map(p => p.replaceAll('\\', '/'));
  const inventory = paths.filter(p => !/^p3-never:/.test(p)).map(p => ({ path: p, sha256: '' }));
  assert.throws(() => assertBundleInputs(inventory), /BUNDLE-INPUTS FAIL/,
    'the accepted page input law refuses this graph');
  /* Each of these is FORBIDDEN in the page BY NAME in today/build.mjs, with its
     own recorded reason. Naming them here is naming the cause, not restating
     the law: the assertion above is the law itself, run. */
  for (const forbidden of ['rebuild/m4/workout/engine-runtime.cjs',
    'rebuild/m4/import/local-source-profile.cjs', 'rebuild/m4/import/local-source-order.cjs',
    'rebuild/m4/import/browser-replay.mjs', 'rebuild/m4/import/engine-provider.cjs',
    'rebuild/m4/import/replay-core.cjs', 'rebuild/engine/migrate.cjs',
    'rebuild/engine/merge.cjs', 'rebuild/engine/index.cjs', 'rebuild/engine/seed.cjs']) {
    assert.ok(paths.includes(forbidden), 'expected in the admission graph: ' + forbidden);
  }
  /* The page is a READER of an already-migrated state; the walk happens on the
     PC and the sealed bundle carries the result (port README, "What it does").
     rebuild/m4/import/engine-provider.cjs requires migrate.cjs and merge.cjs by
     literal path in order to REPRODUCE that walk on the phone
     (SOURCE_PREPARATION_REPRODUCTION_MISMATCH), which is exactly the thing the
     page's law says must not ship. The conflict is deliberate on both sides,
     which is why it is a ruling and not a fix. */
});

test('P3-B4 - and it is not a small addition: the size of what an Import route '
  + 'would put on the phone', async () => {
  const base = fs.statSync(path.join(SCRATCH, 'baseline/app.js')).size;
  const stubbed = fs.statSync(path.join(SCRATCH, 'stubbed/app.js')).size;
  assert.ok(stubbed > base, 'recorded for the record, not a threshold to tune');
  /* Measured on this tree: 1 660 910 -> 2 177 580 bytes, 121 -> 159 modules.
     A third again the page, including the whole of rebuild/engine/test if the
     stub above were not there. */
  assert.ok(stubbed - base > 400000,
    'the admission stack is a third again the page: +' + (stubbed - base) + ' bytes');
});

process.on('exit', () => { try { fs.rmSync(SCRATCH, { recursive: true, force: true }); } catch {} });
