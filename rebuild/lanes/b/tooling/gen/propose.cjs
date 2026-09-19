#!/usr/bin/env node
'use strict';
/* SEAL-AUTOMATION / propose.cjs - chain A stage a5: the acceptance artifact is written by
   the RUNNER'S OWN proposed(), never by hand and never by this file's idea of the shape.
   The compile is the one rebuild/lanes/b/tooling/test/execution-targets.test.cjs already
   uses: take the runner's source up to its own main-sequence delimiter, compile it as a
   module in place, and export the functions. Nothing below the delimiter runs, so no
   campaign starts and no --full can be reached from here. DECISIONS:516 is the round that
   did this by hand; this is the same act with the same runner bytes. */
const fs = require('fs');
const path = require('path');
const Module = require('node:module');
const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..');
const RUNNER_REL = 'rebuild/lanes/b/tooling/b-package.cjs';
const DELIM = '// ------------------------------------------------------------------ 8. main sequence';

function loadRunner(pkg) {
  const file = path.join(REPO, RUNNER_REL);
  const source = fs.readFileSync(file, 'utf8');
  const parts = source.split(DELIM);
  if (parts.length !== 2) throw new Error('PROPOSE-RUNNER-BOUNDARY-MOVED; the main-sequence delimiter is not where execution-targets.test.cjs expects it');
  const m = new Module(file, module);
  m.filename = file;
  m.paths = Module._nodeModulePaths(path.dirname(file));
  const saved = process.argv;
  process.argv = [process.execPath, file, '--ci', '--package', pkg];
  try { m._compile(parts[0] + '\nmodule.exports={proposed};', file); }
  finally { process.argv = saved; }
  return m.exports;
}
function main(argv) {
  let pkg = null, out = null, write = false;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--package') pkg = argv[++i];
    else if (argv[i] === '--out') out = argv[++i];
    else if (argv[i] === '--write') write = true;
    else throw new Error('PROPOSE-ARGV-UNKNOWN ' + argv[i]);
  }
  if (!pkg) throw new Error('PROPOSE-ARGV-MISSING --package');
  const api = loadRunner(pkg);
  if (typeof api.proposed !== 'function') throw new Error('PROPOSE-RUNNER-HAS-NO-proposed; the export list at the compile above must be widened and the change reviewed');
  console.log('runner compiled to its main-sequence boundary; proposed() is in hand for --package ' + pkg + '.');
  console.log('THIS FILE DOES NOT WRITE THE ARTIFACT BY ITSELF. proposed(spec, bound) needs the');
  console.log('spec object and the bound parent the runner builds in its own campaign, and the round');
  console.log('that earned S7 and S8 assembled those in a scratch script the PM read (DECISIONS:516).');
  console.log('Pass --write only once that assembly has been reviewed in this generation;');
  console.log('out = ' + (out || 'rebuild/m4/spec/acceptance-<slug>.json') + ', write = ' + write + '.');
  return write ? 1 : 0;
}
if (require.main === module) {
  try { process.exit(main(process.argv.slice(2))); }
  catch (e) { console.error('PROPOSE FAILED: ' + e.message); process.exit(1); }
}
module.exports = { loadRunner, DELIM, RUNNER_REL };
