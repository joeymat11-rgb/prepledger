// Evidence probe: why the host owns its own runtime module.
//
// Builds BOTH prescription runtimes through the existing browser build and
// reports what each does to the graph:
//
//   rebuild/m4/workout/engine-runtime.cjs   one non-literal require; esbuild
//                                           glob-expands it over rebuild/engine
//   rebuild/m3/w6/host/engine-runtime-host.cjs  twelve literal requires
//
// Changes no product file and installs nothing.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildBrowser } from '../build-browser.mjs';
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '.tmp/esbuild-probe');
mkdirSync(out, { recursive: true });

const TARGETS = [
  ['accepted  rebuild/m4/workout/engine-runtime.cjs', resolve(here, '../../../m4/workout/engine-runtime.cjs')],
  ['host      rebuild/m3/w6/host/engine-runtime-host.cjs', resolve(here, 'engine-runtime-host.cjs')],
];

for (const [label, target] of TARGETS) {
  const slug = label.trim().split(/\s+/)[0];
  const entry = resolve(out, slug + '-entry.mjs');
  writeFileSync(entry, "export {createEngineRuntime} from '" + target.replaceAll('\\', '/') + "';\n");
  let result = null, error = null;
  try { result = await buildBrowser({ outfile: resolve(out, slug + '.js'), entryPoints: [entry] }); }
  catch (e) { error = e; }
  if (error) {
    const errors = error.errors || [];
    const files = [...new Set(errors.map(e => e.location?.file).filter(Boolean))];
    const tests = files.filter(f => f.startsWith('rebuild/engine/test/'));
    console.log(label + ' -> BUILD FAILED: ' + errors.length + ' errors across ' + files.length +
      ' files (' + tests.length + ' under rebuild/engine/test/)');
    if (errors[0]) console.log('    first: ' + errors[0].text + ' [' + (errors[0].location?.file || '?') + ']');
  } else {
    const engineInputs = result.inventory.map(i => i.path).filter(p => /^rebuild\/engine\//.test(p));
    console.log(label + ' -> BUILT: ' + result.inventory.length + ' pinned inputs, ' +
      engineInputs.length + ' from rebuild/engine');
    console.log('    engine: ' + engineInputs.map(p => p.slice('rebuild/engine/'.length)).join(' '));
  }
}
