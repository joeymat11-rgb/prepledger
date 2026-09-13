'use strict';
// Test-only, exact source mutations compiled in memory by the public fixture.
// Each run selects a named product assertion. Source files are never rewritten.
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const V = 'rebuild/engine/volume.cjs', W = 'rebuild/engine/writers.cjs';
const S = 'rebuild/m4/workout/setup-tags.cjs';
const helper = "if (hasVolumeTags(ex)) return (ex.secondary || []).map(x => [x.head || x.mg, x.lend]);";
const cases = {
  empty_falls_back: [V, helper,
    "if (hasVolumeTags(ex) && ex.secondary.length) return ex.secondary.map(x => [x.head || x.mg, x.lend]);", 'F2-03a'],
  remove_primary_head: [V, 'const bucket = (e) => e.head || e.mg;',
    'const bucket = (e) => e.mg;', 'F2-03b'],
  duplicate_helper: [V, helper,
    "if (hasVolumeTags(ex)) return (ex.secondary || []).flatMap(x => [[x.head || x.mg, x.lend], [x.head || x.mg, x.lend]]);", 'F2-05-two-F'],
  double_F_exposure: [V, 'const n = e.sets * days;',
    'const n = e.sets * days * (week.hasFullBody && hasVolumeTags(e) ? 2 : 1);', 'F2-05-two-F'],
  scheduled_for_observed: [V, 'const n6 = (e.reps || []).length;',
    'const n6 = ex6.sets;', 'F2-06a'],
  delts_always_front: [V, helper,
    "if (hasVolumeTags(ex)) return (ex.secondary || []).map(x => [x.head || (x.mg === 'delts' ? 'delts_front' : x.mg), x.lend]);", 'F2-07a'],
  coarse_distributed: [V, helper,
    "if (hasVolumeTags(ex)) return (ex.secondary || []).flatMap(x => (ex.volumeTags.regionsByMuscle[x.head || x.mg] || [x.head || x.mg]).map(mg => [mg, x.lend]));", 'F2-07a'],
  omit_spillover_family: [V, 'return [...new Set(keys.flatMap(mg => [mg, ...(regions[mg] || [])]).filter(Boolean))];',
    'return [...new Set(keys.filter(Boolean))];', 'F2-08b'],
  qualify_coarse: [V, "? { qualified: false, qualification: 'region-unspecified' } : { qualified: true };",
    '? { qualified: true } : { qualified: true };', 'F2-07b'],
  indirect_taker: [V, 'm.qualified !== false && m.sets < VOL_BANDS.floor && !m.indirectOnly',
    'm.qualified !== false && m.sets < VOL_BANDS.floor', 'F2-08c'],
  unresolved_offer: [W, 'const cands = pv.filter((m) => m.qualified !== false && !m.indirectOnly)',
    'const cands = pv.filter((m) => !m.indirectOnly)', 'F2-07b'],
  coarse_F_cap: [W, 'const bucket = volBucket(ex);\n  return orderedExercisesForDay(s, "F").filter((e) => volBucket(e) === bucket)',
    'const bucket = ex.mg;\n  return orderedExercisesForDay(s, "F").filter((e) => e.mg === bucket)', 'F2-09'],
  drop_helper_head: [V, helper,
    "if (hasVolumeTags(ex)) return (ex.secondary || []).map(x => [x.mg, x.lend]);",
    'F2-CAT02-chest_press_machine', 'heads.test.mjs'],
  discard_projected_helper_head: [S, 'e.secondary = snapshot[e.id].secondary;',
    'e.secondary = snapshot[e.id].secondary.map(({ mg, lend }) => ({ mg, lend }));',
    'F2-CAT01', 'heads.test.mjs'],
  admit_incompatible_helper_head: [S, "|| regions[helper.head] !== helper.mg))) fail();",
    '))) fail();', 'F2-CAT05', 'heads.test.mjs'],
};
function mutate(name, file, source) {
  assert(Object.hasOwn(cases, name), 'F2_MUTANT_NOT_ALLOWLISTED');
  const [target, from, to] = cases[name];
  if (file !== target) return source;
  source = source.replaceAll('\r\n', '\n');
  assert.equal(source.split(from).length - 1, 1, 'F2_MUTANT_ANCHOR_COUNT:' + name);
  return source.replace(from, to);
}
if (require.main === module) {
  const cwd = path.resolve(__dirname, '../../../..');
  let killed = 0;
  for (const [name, [, , , cell, file = 'engine.test.cjs']] of Object.entries(cases)) {
    assert(['engine.test.cjs', 'heads.test.mjs'].includes(file), 'F2_MUTANT_TEST_NOT_ALLOWLISTED');
    const env = { ...process.env, F2_MUTANT: name, F2_SOURCE_REF: '' };
    const run = spawnSync(process.execPath, ['--test', '--test-reporter=tap',
      '--test-name-pattern=^' + cell + '(?: |$)', path.join(__dirname, file)],
      { cwd, env, encoding: 'utf8', timeout: 30000, maxBuffer: 1024 * 1024 });
    const output = run.stdout || '';
    assert.equal(run.error, undefined, name + ': child failed');
    assert.equal(run.status, 1, name + ': must fail');
    assert(new RegExp('not ok \\d+ - ' + cell + '(?: |$)').test(output), name + ': wrong assertion');
    assert(output.includes('code: \'ERR_ASSERTION\''), name + ': not an assertion failure');
    assert(!/F2_MUTANT_ANCHOR_COUNT|SyntaxError|ReferenceError|TypeError|testCodeFailure.*hook/.test(output + run.stderr), name + ': invalid kill');
    killed++;
    process.stdout.write(name + ' -> ' + cell + ' assertion KILLED\n');
  }
  process.stdout.write(killed + '/' + Object.keys(cases).length + ' named assertion kills; no source files changed\n');
}
module.exports = { mutate };
