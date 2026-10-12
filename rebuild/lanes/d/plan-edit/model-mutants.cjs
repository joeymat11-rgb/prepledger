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
  // An index entry is not an authority disposition, whatever shape it has.
  { id:'unproved-rejection-is-authority', file:'model', test:'a PLAN rejection refuses whatever shape it has and never excludes an edit', replacements:[
    ["    if (Object.keys(rejected).some(planClass)) fail('PLAN_EDIT_REJECTION_UNPROVEN');",
     "    for (const id of Object.keys(rejected)) if (planClass(id) &&\n      (!rejected[id] || typeof rejected[id] !== 'object' || rejected[id].op_id !== id)) fail('PLAN_EDIT_REJECTION_UNPROVEN');"]] },
  // R1 finding 2: fail-closed reaching past its own subject. One unrelated
  // rejected record must not dark-screen the plan read and the editor.
  { id:'unrelated-rejection-dark-screens', file:'model', test:'a rejection of an operation this companion does not own reads normally', replacements:[
    ['Object.keys(rejected).some(planClass)', 'Object.keys(rejected).length']] },
  // The other direction: an op this generation does not carry, or a tombstone
  // chain that never lands on one, must not be waved through as somebody else's.
  { id:'unclassifiable-rejection-waved-through', file:'model', test:'a rejection naming no operation of this generation cannot be shown unrelated and refuses', replacements:[
    ['        if (!op || seen.has(op.op_id) || op.op_id === origin.op_id',
     '        if (!op || seen.has(op.op_id)) return false;\n        if (op.op_id === origin.op_id']] },
  // The setup descriptor and a tombstone over a plan edit are plan ops too.
  { id:'only-mutations-are-plan-class', file:'model', test:'a rejected setup descriptor and a rejected plan tombstone are plan-class and refuse', replacements:[
    ["        if (!op || seen.has(op.op_id) || op.op_id === origin.op_id || op.kind === 'plan-mutation') return true;\n        if (op.kind !== 'tombstone') return false;\n        seen.add(op.op_id);",
     "        return !op || op.kind === 'plan-mutation';\n        seen.add(op.op_id);"]] },
  { id:'next-local-date', file:'commands', test:'the built operation must start on the next authored local date', replacements:[
    ["input.starts_on !== nextLocalDate(op.effective.local_date) || ", '']] },
  // S17 (PM ruling): the authored day itself is a start date too, and the begun-day rule holds on every replay.
  { id:'same-day-refused', file:'commands', test:'S17 a change may start on its authored day or the next one, and on no other day', replacements:[
    ["input.starts_on !== op.effective.local_date && ", '']] },
  // S17 (PM ruling on Fable l1 D1): a same-day change recorded after that day's workout began is deferred, never refused.
  { id:'same-day-after-session', file:'model', test:'S17 a same-day change recorded after that day\'s session start on a hand-built record replays as a next-day change, and Today keeps every other routine change', replacements:[
    ["? C.nextLocalDate(recorded) : recorded);", '? recorded : recorded);']] },
  { id:'same-day-after-session-refused', file:'model', test:'S17 a same-day change recorded after that day\'s workout started replays from the next day; one recorded before it applies today', replacements:[
    ["? C.nextLocalDate(recorded) : recorded);", "? fail('PLAN_EDIT_SAME_DAY_AFTER_SESSION') : recorded);"]] },
  // S18 (PM ruling): a bare Start does not begin the day; a set, a skip or a close does.
  { id:'bare-start-begins', file:'model', test:'S18 a same-day change after a bare Start, opened with nothing recorded, applies today on every replay', replacements:[
    ["const BEGUN = Object.freeze(['session-set', 'session-skip', 'session-close']);", "const BEGUN = Object.freeze(['session-start', 'session-set', 'session-skip', 'session-close']);"]] },
  { id:'only-a-set-begins', file:'model', test:'S18 a set, a skip or a close recorded that day before a same-day change begins the day: it replays from the next date', replacements:[
    ["const BEGUN = Object.freeze(['session-set', 'session-skip', 'session-close']);", "const BEGUN = Object.freeze(['session-set']);"]] },
  { id:'order-ignores-deferral', file:'model', test:'S17 a deferred same-day change keeps date order: a later record that would start before it refuses', replacements:[
    ["starts.get(active[i - 1].op_id) > starts.get(op.op_id)", 'active[i - 1].members[0].value.starts_on > op.members[0].value.starts_on']] },
  { id:'empty-tags-fall-back', file:'model', test:'explicit empty original tag snapshots require exact provenance and survive rename', replacements:[
    ["  if (!tagsOk) fail('PLAN_EDIT_TAG_BASIS_UNPROVEN');", '  void tagsOk;']] },
  // An unknown collection is an effect nobody mapped; projecting over it anyway
  // is how an import the admission lane never saw becomes the athlete's plan.
  { id:'open-collections', file:'model', test:'source identity, foreign-device, imported frontier and unknown training members refuse', replacements:[
    ['Object.keys(collections).some(k => !COLLECTIONS.includes(k)) ||\n        ', '']] },
  // P0-B/P2: the declared basis stands without the generation agreeing.
  { id:'declared-basis-unchecked', file:'model', test:'PE16 an unadmitted import refuses and never falls back to the clean-init basis', replacements:[
    ["    if (importPresentIn(generation) !== !firstRun) fail('PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE');\n", '']] },
  { id:'admitted-basis-unmatched', file:'model', test:'PE16 an admitted import is the basis and must be the state handed over', replacements:[
    ["      if (!equal(adopted, base)) fail('PLAN_EDIT_IMPORTED_BASIS_MISMATCH');\n", '']] },
  { id:'rename-overwrites-history', file:'model', test:'rename and repeated same-date rename use names seams without technique forks', replacements:[
    ["(target.renames || (target.renames = [])).push({ from: starts_on, prevN: target.n });", 'void starts_on;']] },
  { id:'future-applies-today', file:'model', test:'two pending saves compose globally while current state and history remain exact', replacements:[
    ['if (from <= date)', 'if (true)']] },
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
    /* S17: the model has required ./lift-correspondence.cjs (no requires of its own) since P3-REAL-SHAPE, and this
       closed list never named it, so every MODEL mutant failed to load and none could be counted as killed. */
    const allowed = new Set([files.commands, files.canonical, path.join(root, 'rebuild/m4/workout/lift-correspondence.cjs')]);
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
