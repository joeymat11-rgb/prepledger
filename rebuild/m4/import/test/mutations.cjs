'use strict';
// Effective behavioral faults in disposable product copies, never an engine,
// original gate, test assertion, private fixture or active repository mutation.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const assert = require('node:assert/strict'), {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '../../../..');
const modulePath = path.join(__dirname, '../prepare.cjs'), source = fs.readFileSync(modulePath, 'utf8');
const sha = text => createHash('sha256').update(text).digest('hex');
const sourceSha = sha(source), dir = fs.mkdtempSync(path.join(root, '.tmp/import-preparation-faults-'));
const testPath = path.join(__dirname, 'prepare.test.cjs');
const cases = [
  ['source-alias', 'const originalBytes = Buffer.from(sourceBytes);', 'const originalBytes = sourceBytes;',
    'all exposed copies and caller buffers'],
  ['mutated-preimage', 'engine.migrate(copy(original))', 'engine.migrate(original)',
    'actual current-schema migration mutates input'],
  ['discard-migration-return', 'let migrated = engine.migrate(copy(original));',
    'let migrated = copy(original); engine.migrate(migrated);', 'a supported earlier schema'],
  ['omit-local-guard', '[original, ...(local ? [local.state] : [])]', '[original]',
    'actual guard refuses local-only loss'],
  ['omit-remote-guard', '[original, ...(local ? [local.state] : [])]', '[]',
    'actual guard refuses a reached remote loss'],
  ['count-only-guard', 'engine.dataLossGuard(copy(preimage), copy(candidate))',
    '({safe: JSON.stringify(engine.recordCounts(preimage)) === JSON.stringify(engine.recordCounts(candidate)), lost: []})',
    'actual D33 identity guard detects a replaced date'],
  ['duplicate-key-parser', 'original = parseStrictJson(Buffer.from(originalBytes))',
    'original = JSON.parse(originalBytes)', 'strict source parser refuses duplicate keys'],
  ['future-fallthrough', "if (original.v > engine.SCHEMA_V) fail('IMPORT_SOURCE_FUTURE_SCHEMA');",
    'if (false) fail(\'IMPORT_SOURCE_FUTURE_SCHEMA\');', 'future schemas and seed-dependent inputs'],
  ['lossy-json', "if (!isDeepStrictEqual(migrated, candidate)) fail('IMPORT_MIGRATION_NOT_LOSSLESS_JSON');",
    "if (false) fail('IMPORT_MIGRATION_NOT_LOSSLESS_JSON');", 'migration result must retain current schema'],
  ['private-error-leak', "fail('IMPORT_MIGRATION_FAILED');", 'throw error;',
    'private engine error prose and guard details'],
];
function run(file, name, label) {
  const args = ['--test', '--test-reporter=tap', ...(name ? ['--test-name-pattern=' + name] : []), testPath];
  const out = cp.spawnSync(process.execPath, args, {cwd: root, windowsHide: true, encoding: 'utf8', timeout: 30000,
    env: {...process.env, IMPORT_PREPARATION_MODULE: file}});
  const log = (out.stdout || '') + (out.stderr || '');
  fs.writeFileSync(path.join(dir, label + '.log'), log, {flag: 'wx'});
  assert(!out.error, 'Test process must run');
  return {status: out.status, log};
}
assert.equal(run(modulePath, undefined, 'baseline').status, 0, 'Original focused suite GREEN');
const receipts = [];
for (const [id, before, after, name] of cases) {
  assert.equal(source.split(before).length, 2, 'One exact product site: ' + id);
  const candidate = source.replace(before, after), file = path.join(dir, id + '.cjs');
  fs.writeFileSync(file, candidate, {flag: 'wx'});
  const out = run(file, name, id);
  assert.equal(out.status, 1, 'Mutant must fail: ' + id);
  assert.match(out.log, /not ok 1 - /, 'Named test body must be reached: ' + id);
  assert.match(out.log, /ERR_ASSERTION/, 'Behavioral assertion must fail: ' + id);
  assert(!/SyntaxError|MODULE_NOT_FOUND|IMPORT_PREPARATION_DEPENDENCIES/.test(out.log), 'No setup/pin failure: ' + id);
  assert(out.log.includes(name), 'The specified test must fail: ' + id);
  receipts.push({id, test: name, mutant_sha256: sha(candidate), effective: true});
}
assert.equal(sha(fs.readFileSync(modulePath)), sourceSha, 'Product original unchanged');
assert.equal(run(modulePath, undefined, 'restored').status, 0, 'Restored focused suite GREEN');
fs.writeFileSync(path.join(dir, 'evidence.json'), JSON.stringify({source_sha256: sourceSha,
  test_sha256: sha(fs.readFileSync(testPath)), cases: receipts, restored: true}, null, 2), {flag: 'wx'});
console.log('IMPORT PREPARATION: 10/10 effective product faults; original/restored 14/14 PASS');
console.log('Evidence: ' + dir);
