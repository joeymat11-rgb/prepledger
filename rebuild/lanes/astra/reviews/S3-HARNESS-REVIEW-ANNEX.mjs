// Independent reviewer annex. Authored without executing candidate code.
// Run only against a fresh dispatcher-owned, independently installed S3 tree.
// All generated fixtures are harmless reviewer inputs in a new run-local directory.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const PIN = 'c7623bcaa982182ab2cccd5ca542c450a758a4b8a2be99b0d4c063d55926a15d';
const MANIFEST = 'rebuild/m4/spec/s3-portable-sources.json';
const CANDIDATE = 'ebc4c4e870497199c113c5e5c85bdced679589cf';
const annexFile = fileURLToPath(import.meta.url);
const sourceRoot = path.resolve(path.dirname(annexFile), '../../../..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a, b) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
const options = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  const name = process.argv[i], value = process.argv[i + 1];
  assert.ok(['--tree', '--browser-evidence'].includes(name) && value && !options.has(name),
    'Usage: node S3-HARNESS-REVIEW-ANNEX.mjs --tree <installed copied tree> [--browser-evidence <same-run evidence.json>]');
  options.set(name, value);
}
assert.ok(options.has('--tree'), 'Explicit copied tree is required');
assert.match(process.versions.node, /^22\./, 'Node 22 is required');
const tree = path.resolve(options.get('--tree'));
const run = path.dirname(tree);
function contained(base, target) {
  const absolute = path.resolve(target), relative = path.relative(base, absolute);
  assert.ok(relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative), 'Reviewer path must remain contained');
  let existing = absolute;
  while (!fs.existsSync(existing)) existing = path.dirname(existing);
  assert.ok(same(fs.realpathSync.native(existing), existing), 'Reviewer path cannot traverse a link or junction');
  return absolute;
}
assert.equal(path.basename(tree), 'tree', 'Dispatcher copied-tree name');
contained(run, tree);
const record = JSON.parse(fs.readFileSync(contained(run, path.join(run, 'run.json')), 'utf8'));
assert.equal(record.profile, 'earned/s3-scratch-run/v1');
assert.equal(record.installed, true, 'Independent install must have completed');
assert.ok(same(path.resolve(record.tree), tree) && same(path.resolve(record.run), run));
assert.ok(same(path.resolve(record.sourceRoot), sourceRoot), 'Run must derive from this materialized review tree');

function verifyPinnedTree() {
  const raw = fs.readFileSync(contained(tree, path.join(tree, MANIFEST)));
  assert.equal(hash(raw), PIN, 'Exact independently pinned provisional manifest');
  const manifest = JSON.parse(raw);
  assert.equal(manifest.profile, 'earned/s3-provisional-public-sources/v1');
  assert.equal(manifest.sources.length, 111, 'Exact public-source inventory');
  const seen = new Set();
  for (const entry of manifest.sources) {
    assert.ok(typeof entry.path === 'string' && !seen.has(entry.path));
    seen.add(entry.path);
    assert.ok(!entry.path.includes('\\') && !entry.path.split('/').some(p => !p || p === '.' || p === '..'));
    const file = contained(tree, path.join(tree, entry.path));
    assert.equal(hash(fs.readFileSync(file)), entry.sha256, 'Pinned source: ' + entry.path);
  }
  return {manifest_sha256: PIN, source_count: seen.size};
}

// This is the first candidate import; every source and the manifest were verified first.
const before = verifyPinnedTree();
const candidate = await import(pathToFileURL(path.join(tree, 'rebuild/m4/import/test/s3/run.mjs')));
const output = fs.mkdtempSync(contained(run, path.join(run, 'reviewer-s3-harness-')));
const results = [];
function probe(name, expectation, action) {
  try {
    const observed = action();
    results.push({name, expectation, pass: true, observed});
    console.log('REVIEW PASS ' + name);
  } catch (error) {
    results.push({name, expectation, pass: false, error: {name: error.name, code: error.code || null, message: error.message}});
    console.log('REVIEW FAIL ' + name + ': ' + error.message);
  }
}
function edgeFixture(name, importer, includeTarget = false) {
  const root = contained(output, path.join(output, name));
  fs.mkdirSync(root);
  fs.writeFileSync(path.join(root, 'entry.mjs'), importer);
  const sources = [{path: 'entry.mjs', sha256: hash(importer)}];
  if (includeTarget) {
    const target = 'export const value = 1;\n';
    fs.writeFileSync(path.join(root, 'listed.mjs'), target);
    sources.push({path: 'listed.mjs', sha256: hash(target)});
  }
  return {root, manifest: {profile: 'earned/s3-provisional-public-sources/v1', sources, deferredRedSources: []}};
}
function inspect(fixture) { return candidate.inspectStaticEdges(fixture.root, fixture.manifest); }

probe('literal-listed-positive', 'A listed literal import resolves to exactly one listed edge', () => {
  const f = edgeFixture('literal-listed', "import {value} from './listed.mjs';\n", true);
  const edges = inspect(f);
  assert.deepEqual(edges, [['entry.mjs', 'listed.mjs']]);
  return edges;
});
probe('literal-unlisted-refusal-control', 'The matched literal syntax refuses a harmless unlisted path', () => {
  const f = edgeFixture('literal-unlisted', "import {value} from './reviewer-unlisted.mjs';\n");
  assert.throws(() => inspect(f), {code: 'S3_UNLISTED_EDGE'});
  return {refused: true};
});
probe('side-effect-unlisted-refusal', 'A side-effect import must refuse before any target load', () => {
  const f = edgeFixture('side-effect-unlisted', "import './reviewer-unlisted.mjs';\n");
  assert.throws(() => inspect(f), {code: 'S3_UNLISTED_EDGE'});
  return {refused: true};
});
probe('computed-unlisted-refusal', 'A computed import must be resolved or refused before any target load', () => {
  const f = edgeFixture('computed-unlisted', "const target = './reviewer-unlisted.mjs'; await import(target);\n");
  assert.throws(() => inspect(f), {code: 'S3_UNLISTED_EDGE'});
  return {refused: true};
});

const childEnv = {...process.env, S3_SCRATCH: tree, S3_RUN_ROOT: run, TEMP: path.join(run, 'temp'), TMP: path.join(run, 'temp')};
for (const key of ['NODE_OPTIONS', 'NODE_PATH', 'NODE_TEST_CONTEXT', 'S3_MUTATION', 'PERFORMED_W6_DIR', 'EARNED_READING_W6_ROOT', 'EARNED_SOURCE_R1_ROOT', 'W6_PLAYWRIGHT_DIR']) delete childEnv[key];
function child(label, args) {
  const result = spawnSync(process.execPath, args, {cwd: tree, env: childEnv, windowsHide: true, encoding: 'utf8', timeout: 15000, maxBuffer: 4 * 1024 * 1024});
  assert.equal(result.error, undefined, 'Child must actually launch and finish: ' + label);
  assert.equal(result.signal, null, 'Child must not be terminated: ' + label);
  const log = (result.stdout || '') + (result.stderr || '');
  fs.writeFileSync(contained(output, path.join(output, label + '.log')), log);
  return {status: result.status, log};
}
function tapChild(label, selectedAssertion) {
  const file = contained(output, path.join(output, label + '.cjs'));
  const source = [
    "const test = require('node:test');",
    "const assert = require('node:assert/strict');",
    "test('reviewer selected guard', () => { " + (selectedAssertion ? "assert.equal(1, 2, 'selected assertion control');" : "throw new TypeError('selected guard is not an assertion');") + ' });',
    "test('reviewer unrelated guard', () => { assert.equal(3, 4, 'unrelated assertion'); });",
    ''
  ].join('\n');
  fs.writeFileSync(file, source);
  // Generated Node-test controls use builtins only; no candidate product is loaded.
  const result = child(label, ['--test', '--test-reporter=tap', file]);
  assert.equal(result.status, 1);
  assert.match(result.log, /^# tests 2$/m);
  assert.match(result.log, /^# skipped 0$/m);
  assert.match(result.log, /^# cancelled 0$/m);
  const blocks = result.log.split(/(?=^not ok \d+ - )/m);
  const selected = blocks.find(block => /^not ok \d+ - reviewer selected guard\r?$/m.test(block));
  assert.ok(selected, 'Actual selected failure must appear');
  const ownDiagnostic = selected.split(/(?=^# Subtest:|^not ok \d+ - |^ok \d+ - )/m).find(part => part.startsWith('not ok'));
  assert.ok(ownDiagnostic, 'Selected TAP record owns its diagnostic');
  assert.match(ownDiagnostic, selectedAssertion ? /code: ['"]?ERR_ASSERTION/ : /name: ['"]?TypeError/);
  if (!selectedAssertion) assert.doesNotMatch(ownDiagnostic, /ERR_ASSERTION/);
  return result;
}
probe('selected-assertion-positive', 'The selected test itself failing ERR_ASSERTION qualifies', () => {
  const result = tapChild('selected-assertion', true);
  const summary = candidate.mutantSummary(result.log, result.status, 'reviewer selected guard');
  assert.equal(summary.assertion, true);
  return summary;
});
probe('unrelated-assertion-cannot-qualify-selected-typeerror', 'A selected TypeError plus unrelated ERR_ASSERTION must be rejected', () => {
  const result = tapChild('selected-typeerror-unrelated-assertion', false);
  assert.throws(() => candidate.mutantSummary(result.log, result.status, 'reviewer selected guard'), {code: 'S3_MUTANT_NOT_ASSERTION'});
  return {refused: true};
});

// This paired runtime check loads only a harmless reviewer-owned sentinel. The
// current-head preload and all 111 candidate sources remain byte-identical.
const sentinel = contained(output, path.join(output, 'unlisted-sentinel.mjs'));
fs.writeFileSync(sentinel, "process.stdout.write('REVIEWER_UNLISTED_ESM_EXECUTED\\n'); export const harmless = 1;\n");
const preload = path.join(tree, 'rebuild/m4/import/test/s3/current-head.cjs');
probe('current-head-cjs-unlisted-refusal-control', 'The unchanged preload blocks CommonJS resolution of the unlisted sentinel', () => {
  const result = child('current-head-cjs-sentinel', ['--require', preload, '--eval', 'require(' + JSON.stringify(sentinel) + ');']);
  assert.equal(result.status, 1);
  assert.match(result.log, /S3_UNLISTED_MODULE/);
  assert.doesNotMatch(result.log, /REVIEWER_UNLISTED_ESM_EXECUTED/);
  return {refused: true};
});
probe('current-head-esm-unlisted-refusal', 'The same unchanged preload must block ESM loading of that unlisted sentinel', () => {
  const result = child('current-head-esm-sentinel', ['--require', preload, '--input-type=module', '--eval', 'await import(' + JSON.stringify(pathToFileURL(sentinel).href) + ');']);
  assert.notEqual(result.status, 0, 'Unlisted ESM executed successfully: ' + result.log.trim());
  assert.match(result.log, /S3_UNLISTED_MODULE/);
  assert.doesNotMatch(result.log, /REVIEWER_UNLISTED_ESM_EXECUTED/);
  return {refused: true};
});

if (options.has('--browser-evidence')) {
  probe('browser-evidence-schema-identity', 'Actual browser evidence keeps its schema profile separate from its browser directory', () => {
    const file = contained(run, path.resolve(options.get('--browser-evidence')));
    assert.equal(file, path.join(run, 'browser-core-evidence.json'), 'Only the same dispatcher run browser evidence is inspected');
    const raw = fs.readFileSync(file), evidence = JSON.parse(raw);
    assert.equal(evidence.source_manifest_sha256, PIN, 'Browser evidence binds the exact manifest');
    assert.equal(evidence.scope, 'PORTABLE ONLY');
    assert.equal(evidence.profile, 'earned/s3-browser-core/v1', 'Duplicate profile property must not replace evidence schema with the browser directory');
    return {sha256: hash(raw), profile: evidence.profile, scope: evidence.scope};
  });
}

const after = verifyPinnedTree();
const evidence = {
  profile: 'earned/independent-s3-harness-review/v1', candidate: CANDIDATE,
  node: process.version, platform: process.platform, tree, run, before, after,
  reviewer_source_sha256: hash(fs.readFileSync(annexFile)),
  scope: 'Public harness adversaries only. No private, port, oracle, retained-tree or actual owner data. No acceptance or final P1 verdict.',
  browser_probe: options.has('--browser-evidence') ? 'requested' : 'not requested; rerun with the same-run browser-core-evidence.json after browser-core',
  results, passed: results.filter(r => r.pass).length, failed: results.filter(r => !r.pass).length
};
const evidenceFile = contained(output, path.join(output, 'annex-evidence.json'));
fs.writeFileSync(evidenceFile, JSON.stringify(evidence, null, 2) + '\n');
console.log('REVIEW ANNEX ' + evidence.passed + ' pass / ' + evidence.failed + ' fail; ' + evidenceFile);
process.exitCode = evidence.failed ? 1 : 0;
