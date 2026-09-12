'use strict';
// Public product mutations only. Each child keeps the product fixture's strict
// loader; a preload changes one allowlisted current source read in memory.
// Frozen Git sources, product files, laws and the prototype are never changed.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { ROOT, MODULES } = require('./product-fixture.cjs');

const suite = path.join(__dirname, 'product-laws.test.cjs');
const plan = 'rebuild/engine/plan.cjs';
const today = 'rebuild/engine/today.cjs';
const writers = 'rebuild/engine/writers.cjs';
const ALLOWED_TARGETS = new Set([plan, today, writers]);
const sourcePaths = [...MODULES.map(name => `rebuild/engine/${name}.cjs`),
  'rebuild/engine/entered-load.cjs', 'rebuild/m4/workout/athlete-state.cjs',
  'rebuild/m3/w6/host/engine-runtime-host.cjs',
  'rebuild/lanes/d/f1/product-fixture.cjs', 'rebuild/lanes/d/f1/product-laws.test.cjs'];
const knownRed = 'F1-02b query week selects the latest dated split on each date, irrespective of insertion order';
const temp = path.join(ROOT, '.tmp', 'lane-d-f1');
fs.mkdirSync(temp, { recursive: true });
const out = fs.mkdtempSync(path.join(temp, 'product-mutants-'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceHashes = Object.fromEntries(sourcePaths.map(rel => [rel, hash(fs.readFileSync(path.join(ROOT, rel)))]));
const env = { ...process.env, TZ: 'America/New_York' };
delete env.F1_SOURCE_REF;
const named = (...prefixes) => prefixes;
const mutations = [
  { id: 'f-is-rest', target: plan,
    before: 'return isTrainingKind(v) ? v : "REST";',
    after: 'return v !== "F" && isTrainingKind(v) ? v : "REST";',
    cells: named('F1-02a ') },
  { id: 'omit-lower-pool', target: plan,
    before: 'if (lower[i]) out.push(lower[i]);', after: 'if (false) out.push(lower[i]);',
    cells: named('F1-03a ') },
  { id: 'duplicate-upper-pool', target: plan,
    before: 'if (upper[i]) out.push(upper[i]);', after: 'if (upper[i]) out.push(upper[i], upper[i]);',
    cells: named('F1-03a ') },
  { id: 'lose-family-order', target: plan,
    before: 'return out;\n}\nfunction trainingWeek', after: 'return out.reverse();\n}\nfunction trainingWeek',
    cells: named('F1-03a ') },
  { id: 'truncate-debut-sets', target: today,
    before: 'tgt = new Array(Math.max(1, e.sets || 1)).fill(0);',
    after: 'tgt = new Array(dt === "F" ? 1 : Math.max(1, e.sets || 1)).fill(0);',
    cells: named('F1-04a ') },
  { id: 'double-f-session-count', target: plan,
    before: 'sessions: kinds.filter(isTrainingKind).length,',
    after: 'sessions: kinds.filter(isTrainingKind).length + kinds.filter(k => k === "F").length,',
    cells: named('F1-06-two-F ', 'F1-06-three-F ', 'F1-06-U-F-L ', 'F1-06-U-F-F ') },
  { id: 'omit-lower-exposure', target: plan,
    before: 'exposure: { U: count("U"), L: count("L") },',
    after: 'exposure: { U: count("U"), L: kinds.filter(k => k === "L").length },',
    cells: named('F1-06-two-F ', 'F1-06-three-F ', 'F1-06-U-F-L ', 'F1-06-U-F-F ') },
  { id: 'per-exercise-cap-bypass', target: writers,
    before: 'if (!week.hasFullBody) return (ex.sets || 1) + delta;',
    after: 'if (true) return (ex.sets || 1) + delta;',
    cells: named('F1-07b ') },
  { id: 'fixed-weekly-addition', target: writers,
    before: 'const toWk = +(m.sets + dSess * freq).toFixed(1);',
    after: 'const toWk = +(m.sets + dSess * 2).toFixed(1);',
    cells: named('F1-07c ') },
];
const controls = [
  { id: 'control-unchanged-known-red', target: plan,
    before: 'function dayType(iso, s) {', after: 'function dayType(iso, s) {',
    cells: named('F1-02a ') },
  { id: 'control-import-crash', target: plan,
    before: 'function dayType(iso, s) {',
    after: 'throw new Error("F1_CONTROL_IMPORT_CRASH");\nfunction dayType(iso, s) {',
    cells: named('F1-02a ') },
];

function parse(output) {
  const count = name => Number(output.match(new RegExp('^# ' + name + ' (\\d+)$', 'm'))?.[1] || 0);
  const rows = [...output.matchAll(/^(ok|not ok) \d+ - (.+)$/gm)];
  const tests = rows.map((match, index) => {
    const diagnostic = output.slice(match.index, rows[index + 1]?.index ?? output.length);
    return { name: match[2], pass: match[1] === 'ok' && !/# (?:SKIP|TODO)/.test(match[2]),
      assertion: match[1] === 'not ok' && /code: ['"]?ERR_ASSERTION['"]?/.test(diagnostic) &&
        /failureType: ['"]?testCodeFailure['"]?/.test(diagnostic) };
  });
  return { count: count('tests'), pass: count('pass'), fail: count('fail'),
    cancelled: count('cancelled'), skipped: count('skipped'), tests };
}
function run(id, preload) {
  const args = ['--test', '--test-reporter=tap'];
  if (preload) args.push('--require', preload);
  args.push(suite);
  const result = spawnSync(process.execPath, args,
    { cwd: ROOT, env, encoding: 'utf8', timeout: 60000, maxBuffer: 2 * 1024 * 1024 });
  const output = (result.stdout || '') + (result.stderr || '');
  const log = path.join(out, id + '.tap');
  fs.writeFileSync(log, output);
  return { status: result.status, executionError: result.error?.code || null,
    signal: result.signal, log: path.relative(ROOT, log), ...parse(output) };
}
function preloadFor(mutation) {
  if (!ALLOWED_TARGETS.has(mutation.target)) throw new Error('F1_MUTANT_TARGET_NOT_ALLOWLISTED');
  const source = fs.readFileSync(path.join(ROOT, mutation.target), 'utf8');
  if (source.split(mutation.before).length !== 2) throw new Error('F1_MUTANT_ANCHOR_NOT_UNIQUE: ' + mutation.id);
  const directory = path.join(out, mutation.id);
  fs.mkdirSync(directory);
  const filename = path.join(directory, 'preload.cjs');
  fs.writeFileSync(filename, [
    "'use strict';",
    "const fs = require('node:fs'); const path = require('node:path'); const crypto = require('node:crypto');",
    'const target = ' + JSON.stringify(path.join(ROOT, mutation.target)) + ';',
    'const before = ' + JSON.stringify(mutation.before) + ';',
    'const after = ' + JSON.stringify(mutation.after) + ';',
    'const expected = ' + JSON.stringify(sourceHashes[mutation.target]) + ';',
    'const original = fs.readFileSync; let reads = 0;',
    'fs.readFileSync = function (file, options) {',
    '  const bytes = original.apply(this, arguments);',
    "  if (typeof file !== 'string' || path.resolve(file) !== target) return bytes;",
    "  const source = typeof bytes === 'string' ? bytes : bytes.toString('utf8');",
    "  if (crypto.createHash('sha256').update(source).digest('hex') !== expected) throw new Error('F1_MUTANT_SOURCE_DRIFT');",
    "  if (source.split(before).length !== 2) throw new Error('F1_MUTANT_ANCHOR_DRIFT');",
    '  reads++; const candidate = source.replace(before, after);',
    "  return typeof bytes === 'string' ? candidate : Buffer.from(candidate, 'utf8');",
    '};',
    "process.on('exit', () => fs.writeFileSync(" + JSON.stringify(path.join(directory, 'applied-')) +
      " + process.pid + '.json', JSON.stringify({ reads })));",
  ].join('\n') + '\n');
  return { filename, directory };
}

const baseline = run('baseline');
const baselineFailed = baseline.tests.filter(t => !t.pass).map(t => t.name);
const baselineValid = baseline.status === 1 && !baseline.executionError && !baseline.signal &&
  baseline.count === baseline.tests.length && baseline.count > 0 && !baseline.cancelled && !baseline.skipped &&
  baselineFailed.length === 1 && baselineFailed[0] === knownRed &&
  baseline.tests.find(t => t.name === knownRed)?.assertion;
const baselinePassing = new Set(baseline.tests.filter(t => t.pass).map(t => t.name));
const results = [];
if (baselineValid) for (const mutation of [...mutations, ...controls]) {
  const preload = preloadFor(mutation);
  const result = run(mutation.id, preload.filename);
  const appliedReads = fs.readdirSync(preload.directory).filter(name => /^applied-\d+\.json$/.test(name))
    .reduce((n, name) => n + JSON.parse(fs.readFileSync(path.join(preload.directory, name), 'utf8')).reads, 0);
  const witnesses = result.tests.filter(t => !t.pass && t.assertion && baselinePassing.has(t.name) &&
    mutation.cells.some(prefix => t.name.startsWith(prefix))).map(t => t.name);
  const killed = appliedReads > 0 && result.status === 1 && !result.executionError && !result.signal &&
    result.count === baseline.count && !result.cancelled && !result.skipped && witnesses.length > 0;
  results.push({ id: mutation.id, target: mutation.target, control: controls.includes(mutation),
    killed, appliedReads, witnesses, tests: result.count, passed: result.pass, failed: result.fail,
    nonAssertionFailures: result.tests.filter(t => !t.pass && !t.assertion).map(t => t.name),
    log: result.log, executionError: result.executionError });
}
const changedSources = sourcePaths.filter(rel => hash(fs.readFileSync(path.join(ROOT, rel))) !== sourceHashes[rel]);
const killed = results.filter(r => !r.control && r.killed).length;
const controlsPassed = results.filter(r => r.control && !r.killed && r.appliedReads > 0).length;
const passed = baselineValid && changedSources.length === 0 && killed === mutations.length && controlsPassed === controls.length;
const summary = { scope: 'actual-product-public-f1', passed, sourceHashes,
  baseline: { valid: baselineValid, tests: baseline.count, passed: baseline.pass, failed: baseline.fail,
    failures: baselineFailed, knownRedExcludedFromKills: knownRed, log: baseline.log },
  killed, total: mutations.length, controlsPassed, controlsTotal: controls.length, changedSources, results };
const summaryFile = path.join(out, 'summary.json');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2) + '\n');
console.log(`F1 PRODUCT MUTANTS: ${killed}/${mutations.length} killed; attribution controls ${controlsPassed}/${controls.length}; baseline ${baseline.pass}/${baseline.count}; ${path.relative(ROOT, summaryFile)}`);
if (!passed) process.exitCode = 1;
