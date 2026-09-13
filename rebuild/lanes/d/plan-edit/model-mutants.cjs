'use strict';
// Builder witnesses only. Each mutant must fail its named semantic assertion;
// parse errors, load/API failures and fixture failures are never kills.
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../../../..');
const files = {
  commands: path.join(root, 'rebuild/m4/workout/plan-edit-commands.cjs'),
  model: path.join(root, 'rebuild/m4/workout/plan-edit-model.cjs'),
  canonical: path.join(root, 'rebuild/client/canonical.cjs'),
};
const cases = [
  { id:'next-local-date', file:'commands', test:'the built operation must start on the next authored local date', replacements:[
    ["input.starts_on !== nextLocalDate(op.effective.local_date) || ", '']] },
  { id:'empty-tags-fall-back', file:'model', test:'explicit empty original tag snapshots require exact provenance and survive rename', replacements:[
    ["} else fail('PLAN_EDIT_TAG_BASIS_UNPROVEN');", '} else {}']] },
  { id:'rename-overwrites-history', file:'model', test:'rename and repeated same-date rename use names seams without technique forks', replacements:[
    ["(target.renames || (target.renames = [])).push({ from: starts_on, prevN: target.n });", 'void starts_on;']] },
  { id:'future-applies-today', file:'model', test:'two pending saves compose globally while current state and history remain exact', replacements:[
    ['if (value.starts_on <= date)', 'if (true)']] },
  { id:'remove-deletes-history', file:'model', test:'dated remove retains old record and historical projection while excluding future order', replacements:[
    ["const retirements = state.retirements || (state.retirements = {}); put(retirements, target.id, op?.op_id || 'preview');",
      "state.exercises = state.exercises.filter(e => e.id !== target.id); const retirements = state.retirements || (state.retirements = {}); put(retirements, target.id, op?.op_id || 'preview');"]] },
  { id:'ignore-seen-basis', file:'model', test:'review requires both the complete basis and exact causal parents', replacements:[
    ['input.seen_plan_basis !== info.basis', 'false']] },
  { id:'ignore-seen-parents', file:'model', test:'review requires both the complete basis and exact causal parents', replacements:[
    ['!equal([...input.causal_parents].sort(), [...info.parents].sort())', 'false']] },
  { id:'borrow-new-row-load', file:'model', test:'malformed or borrowed new-row enrichment is refused before it can form a projection', replacements:[
    [' || next.w !== null', '']] },
  { id:'reuse-retained-id', file:'model', test:'new ID uniqueness spans retained and pending records and stable supplied IDs survive replay', replacements:[
    ["if (input.edit.exercise && info.added.has(input.edit.exercise.id)) fail('PLAN_EDIT_ID_REUSED');", ''],
    ["if (state.exercises.some(e => e.id === row.id)) fail('PLAN_EDIT_ID_REUSED');", '']] },
];

if (process.env.PLAN_EDIT_MUTANT) {
  const selected = cases.find(c => c.id === process.env.PLAN_EDIT_MUTANT);
  if (!selected) throw new Error('Unknown named plan-edit mutant');
  const file = files[selected.file];
  let source = fs.readFileSync(file, 'utf8');
  for (const [from, to] of selected.replacements) {
    if (source.split(from).length !== 2) throw new Error('Mutant anchor is not unique: ' + selected.id);
    source = source.replace(from, to);
  }
  const original = Module._load;
  Module._load = function(request, parent, isMain) {
    const resolved = Module._resolveFilename(request, parent, isMain);
    if (resolved !== file) return original.apply(this, arguments);
    if (Module._cache[file]) return Module._cache[file].exports;
    const altered = new Module(file, parent); altered.filename = file;
    altered.paths = Module._nodeModulePaths(path.dirname(file));
    const allowed = new Set([files.commands, files.canonical]);
    altered.require = function(name) {
      const dependency = Module._resolveFilename(name, altered);
      if (!allowed.has(dependency)) throw new Error('Mutant dependency outside closed allowlist');
      return Module._load(name, altered, false);
    };
    Module._cache[file] = altered;
    try { altered._compile(source, file); altered.loaded = true; }
    catch (error) { delete Module._cache[file]; throw error; }
    return altered.exports;
  };
} else if (require.main === module) {
  const outDir = path.join(root, '.tmp'); fs.mkdirSync(outDir, { recursive:true });
  const testFile = path.join(__dirname, 'model.test.cjs');
  const before = Object.fromEntries(['commands','model'].map(k => [k, fs.readFileSync(files[k], 'utf8')]));
  const run = (args, extra={}) => spawnSync(process.execPath, args, { cwd:root,
    env:{...process.env, ...extra},encoding:'utf8',windowsHide:true });
  const baseline = run(['--test','--test-reporter=tap',testFile]);
  fs.writeFileSync(path.join(outDir, 'plan-edit-mutant-baseline.log'), baseline.stdout + baseline.stderr);
  if (baseline.status !== 0) throw new Error('Unchanged baseline failed; no mutants counted');
  const results = [];
  for (const item of cases) {
    const result = run(['--require',__filename,'--test','--test-reporter=tap','--test-name-pattern','^'+item.test+'$',testFile],{PLAN_EDIT_MUTANT:item.id});
    const log = result.stdout + result.stderr;
    fs.writeFileSync(path.join(outDir, 'plan-edit-mutant-'+item.id+'.log'), log);
    const failed = log.split('\n').filter(line => /^not ok \d+ - /.test(line));
    const killed = result.status !== 0 && failed.length === 1 && failed[0].endsWith(item.test) &&
      log.includes('ERR_ASSERTION') && !/hookFailed|SyntaxError|Cannot find module|Mutant anchor|closed allowlist/.test(log);
    results.push({id:item.id,assertion:item.test,killed});
  }
  for (const k of ['commands','model']) if (fs.readFileSync(files[k], 'utf8') !== before[k]) throw new Error('Original source changed');
  fs.writeFileSync(path.join(outDir, 'plan-edit-model-mutants.json'),JSON.stringify(results,null,2)+'\n');
  const killed=results.filter(r=>r.killed).length;
  process.stdout.write(JSON.stringify({baseline:true,total:results.length,killed,survived:results.length-killed,originalsUnchanged:true})+'\n');
  if(killed!==results.length)process.exitCode=1;
}
