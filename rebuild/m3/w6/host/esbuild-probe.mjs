// Evidence probe for L2-HOST-ASSEMBLY-BRIEF §4.2: does the non-literal require
// at rebuild/m4/workout/engine-runtime.cjs:10 survive the existing browser
// build? Writes two bundles and reports what esbuild did. Changes no product
// file; installs nothing.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { buildBrowser } from '../build-browser.mjs';
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '.tmp/esbuild-probe');
mkdirSync(out, { recursive: true });
const entry = resolve(out, 'runtime-entry.mjs');
const runtimePath = resolve(here, '../../../m4/workout/engine-runtime.cjs').replaceAll('\\', '/');
writeFileSync(entry, "export {createEngineRuntime} from '" + runtimePath + "';\n");
let result = null, error = null;
try { result = await buildBrowser({ outfile: resolve(out, 'runtime.js'), entryPoints: [entry] }); }
catch (e) { error = e; }
if (error) {
  console.log('ENGINE RUNTIME BUNDLE FAILED');
  const files = [...new Set((error.errors || []).map(e => e.location?.file).filter(Boolean))];
  console.log('esbuild errors: ' + (error.errors || []).length + ' across ' + files.length + ' files');
  for (const f of files) console.log('  ' + f);
  for (const e of (error.errors || []).slice(0, 4)) console.log('  TEXT: ' + e.text);
}
else {
  const text = readFileSync(result.outfile, 'utf8');
  const engineInputs = result.inventory.filter(i => i.path.startsWith('rebuild/engine/'));
  console.log('ENGINE RUNTIME BUNDLE BUILT');
  console.log('inputs: ' + result.inventory.length + ' | rebuild/engine inputs bundled: ' + engineInputs.length);
  console.log('bundle retains a bare require(: ' + /(^|[^.\w])require\(/.test(text));
  const m = text.match(/[^\n]*require\([^\n]*/g);
  if (m) for (const line of m.slice(0, 6)) console.log('  ' + line.trim().slice(0, 160));
}
