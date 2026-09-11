// Build the host page bundle with the EXISTING browser build (no change to
// build-browser.mjs) and report what entered the graph. Installs nothing.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBrowser } from '../build-browser.mjs';
const here = dirname(fileURLToPath(import.meta.url));
const out = process.env.W6_HOST_OUT ? resolve(process.env.W6_HOST_OUT) : resolve(here, '.tmp/host');
const result = await buildBrowser({ outfile: resolve(out, 'app.js'), entryPoints: [resolve(here, 'host-entry.mjs')] });
const forbidden = [
  ['rebuild/engine/seed.cjs', p => p === 'rebuild/engine/seed.cjs'],
  ['rebuild/engine/migrate.cjs', p => p === 'rebuild/engine/migrate.cjs'],
  ['rebuild/engine/merge.cjs', p => p === 'rebuild/engine/merge.cjs'],
  ['rebuild/engine/index.cjs', p => p === 'rebuild/engine/index.cjs'],
  ['rebuild/authority/* (except canonical)', p => /^rebuild\/authority\//.test(p) && p !== 'rebuild/authority/canonical.cjs'],
  ['rebuild/m3/w5/crypto.cjs', p => p === 'rebuild/m3/w5/crypto.cjs'],
  ['rebuild/m4/import/*', p => /^rebuild\/m4\/import\//.test(p)],
  ['rebuild/engine/test/*', p => /^rebuild\/engine\/test\//.test(p)],
  // The accepted runtime is the one file whose non-literal require would
  // glob-expand rebuild/engine; the page uses the host mirror instead.
  ['rebuild/m4/workout/engine-runtime.cjs', p => p === 'rebuild/m4/workout/engine-runtime.cjs'],
];
// The engine modules the host runtime is allowed to pull in: exactly the
// twelve it names, plus entered-load.cjs, which performed.cjs requires.
const ALLOWED_ENGINE = new Set([...['dates', 'constants', 'plan', 'performed', 'progression', 'sleep',
  'energy', 'policy', 'today', 'volume', 'earn', 'writers', 'entered-load'].map(n => 'rebuild/engine/' + n + '.cjs')]);
const paths = result.inventory.map(i => i.path);
let clean = true;
for (const [label, match] of forbidden) {
  const hits = paths.filter(match);
  if (hits.length) { clean = false; console.log('FORBIDDEN IN GRAPH: ' + label + ' -> ' + hits.join(', ')); }
}
const engineInputs = paths.filter(p => /^rebuild\/engine\//.test(p));
const unexpected = engineInputs.filter(p => !ALLOWED_ENGINE.has(p));
if (unexpected.length) { clean = false; console.log('UNEXPECTED ENGINE INPUT: ' + unexpected.join(', ')); }
console.log('W6 HOST BUILD ' + (clean ? 'PASS' : 'FAIL') + ' — ' + result.inventory.length + ' pinned inputs at ' + result.outfile);
console.log('rebuild/engine inputs (' + engineInputs.length + '): ' + (engineInputs.join(', ') || 'none'));
if (!clean) process.exitCode = 1;
