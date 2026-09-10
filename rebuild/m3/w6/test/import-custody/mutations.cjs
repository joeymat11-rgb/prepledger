'use strict';
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), cp = require('node:child_process');
const assert = require('node:assert/strict'), {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '../../../../..'), prepared = path.resolve(process.argv[2] || '');
assert(prepared.startsWith(path.resolve(os.tmpdir()) + path.sep) && /^earned-w6-current-head-/.test(path.basename(prepared)), 'Use a prepared disposable W6 composition');
assert.equal(JSON.parse(fs.readFileSync(path.join(prepared, 'source-manifest.json'))).w6SourceRoot, root);
const relative = 'rebuild/m3/w6/import-custody.mjs', file = path.join(prepared, relative), source = fs.readFileSync(path.join(root, relative), 'utf8');
const testRelative = 'rebuild/m3/w6/test/import-custody.test.mjs', testFile = path.join(prepared, testRelative);
assert.equal(fs.readFileSync(file, 'utf8'), source, 'Same unmodified product before faults');
const originalTest = fs.readFileSync(testFile);
function execute() {
// Current assertion cleanup is copied explicitly; no expectations are changed.
fs.writeFileSync(testFile, fs.readFileSync(path.join(root, testRelative)));
const sha = value => createHash('sha256').update(value).digest('hex');
const output = fs.mkdtempSync(path.join(root, '.tmp/import-custody-faults-'));
const cases = [
  ['rotating-previous', "store.add(record, recordKey(record.source_id));", "store.put(record, 'previous');", 'named custody survives two later'],
  ['caller-checkpoint', 'const checkpoint = await loadActive();', 'const checkpoint = expected;', 'checkpoint is read from the actual repository'],
  ['omit-final-basis', 'if (current.result?.revision !== expected.revision || activeToken(current.result) !== expected.token)', 'if (false)', 'another real commit during encryption'],
  ['omit-final-context', 'checkContext();\n              store.add', 'store.add', 'guard revocation at the final transaction'],
  ['early-result', 'tx.oncomplete = resolve;', 'resolve(); tx.oncomplete = resolve;', 'real custody transaction complete'],
  ['omit-namespace', 'JSON.stringify([PROFILE, namespace, id])', 'JSON.stringify([PROFILE, id])', 'encrypted custody binds source name and namespace'],
  ['ignore-changed-source', 'JSON.stringify(value.material) !== JSON.stringify(captured)', 'false', 'same name cannot replace bytes'],
  ['normalize-source', 'parseStrictJson(value);\n      return value;', 'return JSON.stringify(parseStrictJson(value));', 'named custody survives two later'],
];
function run(label, pattern) {
  const result = cp.spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...(pattern ? ['--test-name-pattern=' + pattern] : []), testFile],
    {cwd: prepared, windowsHide: true, encoding: 'utf8', timeout: 30000});
  assert(!result.error, 'Test must finish: ' + label);
  const log = (result.stdout || '') + (result.stderr || '');
  fs.writeFileSync(path.join(output, label + '.log'), log, {flag: 'wx'});
  return {status: result.status, log};
}
assert.equal(run('baseline').status, 0);
const evidence = [];
try {
  for (const [name, before, after, pattern] of cases) {
    assert.equal(source.split(before).length, 2, 'One exact source site: ' + name);
    const mutant = source.replace(before, after);
    fs.writeFileSync(file, mutant); fs.writeFileSync(path.join(output, name + '.mjs'), mutant, {flag: 'wx'});
    const result = run(name, pattern);
    assert.equal(result.status, 1, 'Fault must fail: ' + name);
    assert.match(result.log, /not ok 1 - /); assert.match(result.log, /ERR_ASSERTION/);
    assert(!/ERR_MODULE_NOT_FOUND|SyntaxError|IMPORT_CUSTODY_CONFIGURATION/.test(result.log), 'Behavioral, not setup failure');
    assert(result.log.includes(pattern), 'Named assertion reached');
    evidence.push({name, test: pattern, mutant_sha256: sha(mutant), effective: true});
    fs.writeFileSync(file, source);
  }
} finally { fs.writeFileSync(file, source); }
assert.equal(run('restored').status, 0);
assert.equal(sha(fs.readFileSync(file)), sha(source));
fs.writeFileSync(path.join(output, 'evidence.json'), JSON.stringify({source_sha256: sha(source),
  test_sha256: sha(fs.readFileSync(testFile)), cases: evidence, restored: true}, null, 2), {flag: 'wx'});
fs.writeFileSync(path.join(output, 'test-source.mjs'), fs.readFileSync(testFile), {flag: 'wx'});
console.log('IMPORT CUSTODY: 8/8 effective product faults; original/restored11/11 PASS');
console.log('Evidence: ' + output);
}
try { execute(); } finally {
  fs.writeFileSync(file, source);
  fs.writeFileSync(testFile, originalTest);
}
