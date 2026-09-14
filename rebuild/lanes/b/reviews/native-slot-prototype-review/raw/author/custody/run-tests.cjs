'use strict';
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '../..');
const { childEnv, runRecorded, write, sha256 } = require(path.join(root, 'rebuild/lanes/b/tooling/native-slot-prototype/build.cjs'));
const [phase] = process.argv.slice(2);
if (!/^[a-z][a-z0-9-]{0,39}$/.test(phase || '')) throw new Error('A unique run phase is required');
const directory = path.join(__dirname, 'runs', phase);
fs.mkdirSync(path.dirname(directory), { recursive: true });
fs.mkdirSync(directory);
const buildPath = path.join(__dirname, 'builds', 'build-01', 'build.json');
const build = JSON.parse(fs.readFileSync(buildPath));
const env = childEnv({ EARNED_SLOT_BINARY: build.binaries.candidate.path,
  EARNED_SLOT_BUILD_JSON: buildPath, EARNED_SLOT_RUN_ROOT: directory });
const args = ['--expose-gc', '--test', '--test-reporter=tap',
  path.join(root, 'rebuild/lanes/b/tooling/native-slot-prototype/test/prototype.test.cjs')];
write(path.join(directory, 'run-inputs.json'), { sourceHead: build.sourceHead,
  testSourceSha256: sha256(args[3]), binarySha256: sha256(build.binaries.candidate.path),
  buildManifestSha256: sha256(buildPath), executable: process.execPath, args, environment: env });
const result = runRecorded(process.execPath, args, directory, 'suite', env, 300000);
const output = fs.readFileSync(result.stdout.path, 'utf8');
const census = {};
for (const match of output.matchAll(/^# (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)$/gm)) census[match[1]] = Number(match[2]);
write(path.join(directory, 'census.json'), { status: result.status, signal: result.signal,
  error: result.error, census, firstFailure: output.split(/\r?\n/).find(line => /^not ok /.test(line)) || null });
console.log(JSON.stringify({ phase, status: result.status, census, directory }));
process.exitCode = result.status === 0 && !result.error ? 0 : 1;
