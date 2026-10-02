'use strict';
// Hosted NATIVE-LOAD sweep preload: ONE in-memory single-clause overlay. It is the three PC preloads of the
// round 17c/21b/24b sweeps in one file, with the checkout root taken from NLR_ROOT instead of a fixed PC path:
//   mode cjs : the CommonJS compile of <file>            (PC: nlr-build/r17c/overlay.cjs,     tag OVERLAY)
//   mode fs  : the text fs.readFileSync returns for <file> (PC: nlr21b/fsoverlay.cjs,          tag FSOVERLAY)
//   mode esm : the ESM loader's source of <file>, through module.registerHooks, in-thread and synchronous
//                                                         (PC: nlr-r24b-scratch/esmoverlay.cjs, tag ESMOVERLAY)
// NLR_SWEEP_SPEC names a JSON {id,file,mode,before,after}. Each time the hooked path sees <file>, exactly one
// occurrence of `before` must exist (otherwise it throws <TAG>_ANCHOR_NOT_UNIQUE) and it is replaced by `after`.
// The file on disk is never written. At exit it writes `<TAG> <id> applied <n> <file>` to stderr; in a
// `node --test` child that line reaches the parent's TAP as a `# ` comment, which is the count the runner checks.
const Module = require('node:module'), path = require('node:path'), fs = require('node:fs');
const { fileURLToPath } = require('node:url');
const ROOT = path.resolve(process.env.NLR_ROOT || process.cwd());
const spec = JSON.parse(fs.readFileSync(process.env.NLR_SWEEP_SPEC, 'utf8'));
const TAG = { cjs: 'OVERLAY', fs: 'FSOVERLAY', esm: 'ESMOVERLAY' }[spec.mode];
if (!TAG) throw new Error('NLSWEEP_OVERLAY_MODE_UNKNOWN ' + String(spec.mode));
const target = path.resolve(ROOT, spec.file).toLowerCase();
let applied = 0;
function swap(text) {
  const parts = String(text).split(spec.before);
  if (parts.length !== 2) throw new Error(TAG + '_ANCHOR_NOT_UNIQUE ' + spec.id + ' ' + (parts.length - 1));
  applied++;
  return parts.join(spec.after);
}
if (spec.mode === 'cjs') {
  const compile = Module.prototype._compile;
  Module.prototype._compile = function (content, filename, ...rest) {
    if (path.resolve(filename).toLowerCase() === target) content = swap(content);
    return compile.call(this, content, filename, ...rest);
  };
} else if (spec.mode === 'fs') {
  const read = fs.readFileSync;
  fs.readFileSync = function (p, ...rest) {
    let out = read.call(this, p, ...rest);
    let at = null;
    try { at = path.resolve(String(p instanceof URL ? p.pathname.replace(/^\/([A-Za-z]:)/, '$1') : p)).toLowerCase(); } catch { at = null; }
    if (at === target) {
      const next = swap(typeof out === 'string' ? out : out.toString('utf8'));
      out = typeof out === 'string' ? next : Buffer.from(next, 'utf8');
    }
    return out;
  };
} else {
  if (typeof Module.registerHooks !== 'function') throw new Error('ESMOVERLAY_NEEDS_MODULE_REGISTERHOOKS ' + process.version);
  Module.registerHooks({ load(url, context, nextLoad) {
    const out = nextLoad(url, context);
    let at = null;
    try { at = String(url).startsWith('file:') ? path.resolve(fileURLToPath(url)).toLowerCase() : null; } catch { at = null; }
    if (at === target && out != null && out.source != null) {
      out.source = swap(typeof out.source === 'string' ? out.source : Buffer.from(out.source).toString('utf8'));
    }
    return out;
  } });
}
process.on('exit', () => { process.stderr.write(TAG + ' ' + spec.id + ' applied ' + applied + ' ' + spec.file + '\n'); });
