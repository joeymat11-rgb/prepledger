'use strict';
// Isolated-prototype check only. Source candidates compile in disposable child
// processes; neither this file nor its children changes any product file.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../../../..');
const target = path.join(__dirname, 'session-kind-prototype.cjs');
const suite = path.join(__dirname, 'session-kind-prototype.test.cjs');
const source = fs.readFileSync(target, 'utf8');
const parent = path.join(root, '.tmp', 'lane-d-f1');
fs.mkdirSync(parent, { recursive: true });
const out = fs.mkdtempSync(path.join(parent, 'mutants-'));
const mutations = [
  ['omit-lower', 'if (i < lower.length) ordered.push(lower[i]);', 'if (false) ordered.push(lower[i]);'],
  ['duplicate-upper', 'if (i < upper.length) ordered.push(upper[i]);', 'if (i < upper.length) ordered.push(upper[i], upper[i]);'],
  ['reverse-family-order', 'return ordered;', 'return ordered.reverse();'],
  ['double-session', 'if (kind === \'F\') { count.F++; count.U++; count.L++; }', 'if (kind === \'F\') { count.F++; count.U++; count.L++; count.sessions++; }'],
  ['omit-lower-exposure', 'count.F++; count.U++; count.L++;', 'count.F++; count.U++;'],
  ['fixed-weekly-addition', 'addedWeekly: checkedSum(Array(exposures[exercise.day]).fill(delta)),', 'addedWeekly: delta * 2,'],
  ['per-exercise-cap', 'allowed: after <= directSessionCap,', 'allowed: exercise.sets + delta <= directSessionCap,'],
  ['collapse-heads', 'const bucket = row => row.head || row.mg;', 'const bucket = row => row.mg;'],
];
let killed = 0;
const results = [];
for (const [id, before, after] of mutations) {
  if (source.split(before).length !== 2) throw new Error('MUTANT_ANCHOR_NOT_UNIQUE: ' + id);
  const candidate = source.replace(before, after);
  const preload = path.join(out, id + '-preload.cjs');
  const log = path.join(out, id + '.tap');
  // JSON below is JS source data written to a file, never shell quoting.
  fs.writeFileSync(preload, [
    "const Module = require('node:module');",
    'const filename = ' + JSON.stringify(target) + ';',
    'const candidate = new Module(filename);',
    'candidate.filename = filename;',
    'candidate.paths = Module._nodeModulePaths(require(\'node:path\').dirname(filename));',
    'candidate._compile(' + JSON.stringify(candidate) + ', filename);',
    'require.cache[filename] = candidate;',
  ].join('\n') + '\n');
  const run = spawnSync(process.execPath,
    ['--test', '--test-reporter=tap', '--require', preload, suite],
    { cwd: root, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024 });
  const output = (run.stdout || '') + (run.stderr || '');
  fs.writeFileSync(log, output);
  const count = name => Number(output.match(new RegExp('^# ' + name + ' (\\d+)$', 'm'))?.[1] || 0);
  const failedTests = count('fail');
  const assertionFailure = /ERR_ASSERTION|AssertionError/.test(output);
  const hit = run.status === 1 && failedTests > 0 && assertionFailure && count('tests') === 19;
  if (hit) killed++;
  results.push({ id, killed: hit, tests: count('tests'), failures: failedTests, log: path.relative(root, log) });
}
fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify({ scope: 'isolated-prototype', killed, total: mutations.length, results }, null, 2) + '\n');
console.log('F1 ISOLATED MUTANTS: ' + killed + '/' + mutations.length + ' killed; ' + path.relative(root, path.join(out, 'summary.json')));
if (killed !== mutations.length) process.exitCode = 1;
