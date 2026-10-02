// Hosted NATIVE-LOAD sweep resolve hook: the PC's nlr-build/deps-loader.mjs with its two fixed PC parent
// directories replaced by NLR_DEPS_DIRS (a path-delimiter list of node_modules directories, in order). A bare
// specifier that does not resolve normally is retried as if imported from inside each listed directory; nothing
// is installed or created. It also refuses to resolve any of the protected five, so an ESM import of one fails
// before load (the CommonJS side is guard.cjs).
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const PARENTS = String(process.env.NLR_DEPS_DIRS || '').split(path.delimiter).filter(Boolean)
  .map((d) => pathToFileURL(path.join(path.resolve(d), 'x.mjs')).href);
const source = 'const PARENTS=' + JSON.stringify(PARENTS) + ';\n' +
  'const PROTECTED=/\\/rebuild\\/engine\\/(seed|migrate|merge|index|oracle-shim)\\.cjs$/;\n' +
  'async function guarded(r){ if (r && r.url && PROTECTED.test(r.url)) { const e = new Error("PROTECTED_ENGINE_MODULE_REFUSED " + r.url.split("/").pop()); e.code = "PROTECTED_ENGINE_MODULE_REFUSED"; throw e; } return r; }\n' +
  'export async function resolve(specifier, context, next) {\n' +
  '  try { return await guarded(await next(specifier, context)); } catch (error) {\n' +
  '    if (error?.code !== "ERR_MODULE_NOT_FOUND" || /^(\\.|\\/|node:|file:|data:|[A-Za-z]:)/.test(specifier)) throw error;\n' +
  '    for (const parentURL of PARENTS) { try { return await guarded(await next(specifier, { ...context, parentURL })); } catch (_) {} }\n' +
  '    throw error;\n' +
  '  }\n' +
  '}\n';
register('data:text/javascript,' + encodeURIComponent(source));
