// Independent reviewer-only R2 probes. Root reviewer reads this before execution.
// Invented fixtures only; no candidate edits and no builder report dependency.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const CANDIDATE = '0df6ad3f3ec8d69a6e10ba68c279b7b77d061596';
const SOURCE = '946c36059a7ce6b949933da3904db3db8e6b8bd3';
const PIN = '5e5266c253a36304543757a360b74bd0567134dd64da03aae09bf4fe38e6fbee';
const MANIFEST = 'rebuild/m4/spec/s3-portable-sources.json';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a, b) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
const ownerRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
function contained(base, target) {
  const absolute = path.resolve(target), relative = path.relative(path.resolve(base), absolute);
  assert.ok(relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative), 'EXTRA_CONTAINED_PATH');
  let existing = absolute;
  while (!fs.existsSync(existing)) existing = path.dirname(existing);
  assert.ok(same(fs.realpathSync.native(existing), existing), 'EXTRA_NO_LINK_OR_JUNCTION');
  return absolute;
}
assert.match(process.versions.node, /^22\./, 'EXTRA_NODE22');
assert.ok(process.env.S3_SCRATCH && process.env.S3_RUN_ROOT, 'EXTRA_EXPLICIT_RUN_AND_TREE');
const run = contained(path.join(ownerRoot, '.tmp', 's3'), process.env.S3_RUN_ROOT);
const tree = contained(run, process.env.S3_SCRATCH);
assert.ok(same(tree, path.join(run, 'tree')), 'EXTRA_EXACT_COPIED_TREE');
const record = JSON.parse(fs.readFileSync(contained(run, path.join(run, 'run.json')), 'utf8'));
assert.equal(record.profile, 'earned/s3-scratch-run/v1');
assert.equal(record.installed, true, 'EXTRA_OWN_INSTALL_COMPLETED');
assert.ok(same(path.resolve(record.run), run) && same(path.resolve(record.tree), tree));
assert.ok(same(path.resolve(record.sourceRoot), ownerRoot), 'EXTRA_OWN_SOURCE_ROOT');

function verifyFixedSources() {
  const raw = fs.readFileSync(contained(tree, path.join(tree, MANIFEST)));
  assert.equal(hash(raw), PIN, 'EXTRA_FIXED_SUCCESSOR_MANIFEST');
  const manifest = JSON.parse(raw);
  assert.equal(manifest.profile, 'earned/s3-provisional-public-sources/v1');
  assert.equal(manifest.sources.length, 111, 'EXTRA_FIXED_SOURCE_COUNT');
  const seen = new Set();
  for (const entry of manifest.sources) {
    assert.ok(typeof entry.path === 'string' && !seen.has(entry.path));
    assert.ok(!entry.path.includes('\\') && !entry.path.split('/').some(x => !x || x === '.' || x === '..'));
    assert.match(entry.sha256, /^[a-f0-9]{64}$/);
    seen.add(entry.path);
    assert.equal(hash(fs.readFileSync(contained(tree, path.join(tree, entry.path)))), entry.sha256, 'EXTRA_SOURCE_PIN ' + entry.path);
  }
  return {manifest_sha256: PIN, source_count: seen.size};
}

const before = verifyFixedSources();
// First candidate import: its entire fixed 111-source graph has been verified.
const candidate = await import(pathToFileURL(path.join(tree, 'rebuild/m4/import/test/s3/run.mjs')));
const output = fs.mkdtempSync(contained(run, path.join(run, 'reviewer-r2-harness-extra-')));
const results = [], children = [];
const childEnv = {...process.env, TZ: 'America/New_York', S3_SCRATCH: tree, S3_RUN_ROOT: run, TEMP: path.join(run, 'temp'), TMP: path.join(run, 'temp')};
for (const key of Object.keys(childEnv)) {
  if (['NODE_OPTIONS', 'NODE_PATH', 'NODE_TEST_CONTEXT', 'NODE_V8_COVERAGE', 'S3_MUTATION', 'W6_PLAYWRIGHT_DIR', 'PERFORMED_W6_DIR', 'EARNED_READING_W6_ROOT', 'EARNED_SOURCE_R1_ROOT', 'IMPORT_PREPARATION_MODULE', 'EARNED_REPLAY_CANDIDATE'].includes(key.toUpperCase())) delete childEnv[key];
}
function child(label, args) {
  const value = spawnSync(process.execPath, args, {cwd: tree, env: childEnv, windowsHide: true, encoding: 'utf8', timeout: 15000, maxBuffer: 4 * 1024 * 1024});
  const log = (value.stdout || '') + (value.stderr || '');
  const logFile = contained(output, path.join(output, label + '.log'));
  fs.writeFileSync(logFile, log);
  const evidence = {label, argv: args, status: value.status, signal: value.signal, error: value.error ? {name: value.error.name, code: value.error.code, message: value.error.message} : null, log_file: logFile, log_sha256: hash(log)};
  children.push(evidence);
  assert.equal(value.error, undefined, 'EXTRA_CHILD_LAUNCH ' + label);
  assert.equal(value.signal, null, 'EXTRA_CHILD_NOT_TERMINATED ' + label);
  return {status: value.status, log, evidence};
}
function probe(id, expectation, action) {
  const result = {id, expectation, pass: false, observed: {}};
  try {
    action(result.observed);
    result.pass = true;
  } catch (error) {
    result.error = {name: error.name, code: error.code || null, message: error.message};
  }
  results.push(result);
  console.log('EXTRA ' + (result.pass ? 'PASS ' : 'FAIL ') + id + (result.error ? ': ' + result.error.message : ''));
}

const sentinel = contained(output, path.join(output, 'sentinel.mjs'));
fs.writeFileSync(sentinel, "process.stdout.write('R2_EXTRA_UNLISTED_SENTINEL_EXECUTED\\n'); export const harmless = 1;\n");
function lexical(id, source, expected) {
  probe(id, expected === 'refuse' ? 'Actual unlisted import refuses before copying' : 'Legitimate regex syntax contributes no module edge', observed => {
    const file = contained(output, path.join(output, id + '.mjs'));
    fs.writeFileSync(file, source);
    observed.source = source;
    observed.source_sha256 = hash(source);
    // Syntax validation performs no source evaluation or candidate module load.
    const syntax = child(id + '-syntax', ['--check', file]);
    observed.syntax_status = syntax.status;
    assert.equal(syntax.status, 0, 'EXTRA_VALID_JS_SYNTAX ' + id);
    const manifest = {profile: 'earned/s3-provisional-public-sources/v1', sources: [{path: path.basename(file), sha256: hash(source)}], deferredRedSources: []};
    let error = null;
    try { observed.edges = candidate.inspectStaticEdges(output, manifest); }
    catch (caught) { error = caught; observed.refusal = {name: caught.name, code: caught.code || null, message: caught.message}; }
    if (expected === 'refuse') assert.equal(error?.code, 'S3_UNLISTED_EDGE', 'EXTRA_UNLISTED_IMPORT_MUST_REFUSE ' + id);
    else {
      assert.equal(error, null, 'EXTRA_LEGITIMATE_REGEX_MUST_PASS ' + id);
      assert.deepEqual(observed.edges, [], 'EXTRA_REGEX_IS_DATA ' + id);
    }
  });
}
// Each string below deliberately writes one literal backslash before x2f.
lexical('division-property-x', "const obj={x:1}; obj.x / import('.\\x2fsentinel.mjs') / 2;\n", 'refuse');
lexical('division-property-of', "const obj={of:1}; obj.of / import('.\\x2fsentinel.mjs') / 2;\n", 'refuse');
lexical('regex-at-assignment', "const value = /import(x)/; value.test('ok');\n", 'no-edge');
lexical('regex-after-if', "if (true) /import(x)/.test('ok');\n", 'no-edge');

function tapCase(id, selectedFails) {
  probe(id, selectedFails ? 'Selected test owns the credited ERR_ASSERTION' : 'Passing selected test cannot borrow a substring-named failure', observed => {
    const file = contained(output, path.join(output, id + '.cjs'));
    const selected = 'selected boundary';
    const unrelated = selectedFails ? 'unrelated boundary' : 'unrelated selected boundary suffix';
    const source = [
      "const test=require('node:test'),assert=require('node:assert/strict');",
      "test('selected boundary',()=>assert.equal(1," + (selectedFails ? '2' : '1') + "));",
      'test(' + JSON.stringify(unrelated) + ',()=>assert.equal(3,4));', ''
    ].join('\n');
    fs.writeFileSync(file, source);
    observed.source_sha256 = hash(source);
    // Generated controls use only node:test and node:assert, without preload.
    const actual = child(id, ['--test', '--test-reporter=tap', file]);
    assert.equal(actual.status, 1, 'EXTRA_ACTUAL_TAP_FAILURE');
    assert.match(actual.log, /^# tests 2$/m);
    assert.match(actual.log, /^# skipped 0$/m);
    assert.match(actual.log, /^# cancelled 0$/m);
    const selectedLine = actual.log.split(/\r?\n/).filter(line => /^(?:not )?ok \d+ - selected boundary$/.test(line));
    assert.equal(selectedLine.length, 1, 'EXTRA_EXACT_SELECTED_RECORD');
    assert.match(selectedLine[0], selectedFails ? /^not ok / : /^ok /, 'EXTRA_SELECTED_ACTUAL_OUTCOME');
    observed.selected_tap_line = selectedLine[0];
    observed.unrelated_name = unrelated;
    let error = null;
    try { observed.classification = candidate.mutantSummary(actual.log, actual.status, selected); }
    catch (caught) { error = caught; observed.refusal = {name: caught.name, code: caught.code || null, message: caught.message}; }
    if (selectedFails) {
      assert.equal(error, null, 'EXTRA_SELECTED_ASSERTION_MUST_QUALIFY');
      assert.equal(observed.classification.assertion, true);
      assert.equal(observed.classification.name, selected, 'EXTRA_EXACT_SELECTED_IDENTITY');
    } else assert.equal(error?.code, 'S3_MUTANT_NOT_ASSERTION', 'EXTRA_PASSING_SELECTED_CANNOT_BORROW_ASSERTION');
  });
}
tapCase('exact-selected-assertion', true);
tapCase('selected-pass-substring-failure', false);

probe('actual-esm-sentinel-refusal', 'Unchanged real preload prevents the same harmless unlisted sentinel from executing', observed => {
  const preload = contained(tree, path.join(tree, 'rebuild/m4/import/test/s3/current-head.cjs'));
  observed.preload_sha256 = hash(fs.readFileSync(preload));
  observed.sentinel_sha256 = hash(fs.readFileSync(sentinel));
  const actual = child('actual-esm-sentinel-refusal', ['--require', preload, '--input-type=module', '--eval', 'await import(' + JSON.stringify(pathToFileURL(sentinel).href) + ');']);
  observed.status = actual.status;
  assert.equal(actual.status, 1, 'EXTRA_REAL_ESM_CHILD_REFUSES');
  assert.match(actual.log, /S3_UNLISTED_MODULE/, 'EXTRA_REAL_ESM_BOUNDARY_DIAGNOSTIC');
  assert.doesNotMatch(actual.log, /R2_EXTRA_UNLISTED_SENTINEL_EXECUTED/, 'EXTRA_SENTINEL_NEVER_EXECUTED');
});

const after = verifyFixedSources();
const evidence = {profile: 'earned/reviewer-s3-r2-harness-extra/v1', candidate: CANDIDATE, source: SOURCE, scope: 'Owned invented harness fixtures only; no product mutations', reviewer_script_sha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), node: process.versions.node, timezone: 'America/New_York', tree, run, before, after, results, children, total: results.length, passed: results.filter(r => r.pass).length, failed: results.filter(r => !r.pass).length};
const evidenceFile = contained(output, path.join(output, 'evidence.json'));
fs.writeFileSync(evidenceFile, JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({profile: evidence.profile, total: evidence.total, passed: evidence.passed, failed: evidence.failed, evidence_file: evidenceFile, evidence_sha256: hash(fs.readFileSync(evidenceFile))}));
process.exitCode = evidence.failed ? 1 : 0;
