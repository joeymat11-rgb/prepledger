"use strict";
// Reproducible final verification. All provider data/key fixtures are local and
// synthetic. Private conformance preparation emits only its mandated verdict.
const cp = require('node:child_process'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../../..'), directory = path.resolve(__dirname, '../w5');
let failed = false;
function run(label, args, expected = 0, env = process.env) {
  const result = cp.spawnSync(process.execPath, args, { cwd: root, env, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const output = (result.stdout || '') + (result.stderr || '');
  fs.writeFileSync(path.join(directory, label + '.log'), output);
  const lines = output.split(/\r?\n/).filter(line => /^(AUTH-D1 |HTTP-190 |run.cjs SUMMARY|RIG191 PASS|D1-(RACE PASS|CRASH PASS|REOPEN PASS|LOST-REPLY PASS)|PUBLIC-|WORKER-WORKERD|BITE |GOLDEN PREPARATION|SUITE |SELFTEST |INFO 9|All checks passed)/.test(line));
  console.log('VERIFY ' + label + ' exit=' + result.status);
  lines.forEach(line => console.log(line));
  if (result.status !== expected) { failed = true; console.log(output.split(/\r?\n/).slice(-14).join('\n')); }
}
run('crypto-gate', ['rebuild/m3/w5/fixtures/verify.cjs']);
if (process.argv.includes('--browser')) {
  const option = name => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; };
  const browserArgs = ['rebuild/m3/w5/fixtures/browser-verify.cjs', '--esbuild-path', path.join(directory, 'node_modules/esbuild')];
  const playwright = option('--playwright-path');
  if (playwright) browserArgs.push('--playwright-path', playwright);
  run('browser-gate', browserArgs);
}
run('worker-smoke', ['rebuild/m3/rigs/worker-smoke.cjs']);
run('bite-gate', ['rebuild/m3/rigs/bite.cjs']);
run('local-gate', ['rebuild/m3/rigs/run.cjs', '--env', 'local']);
run('remote-gate', ['rebuild/m3/rigs/run.cjs', '--env', 'synthetic-remote'], 2);
run('prepare-gate', ['rebuild/m3/w5/prepare-gate.cjs']);
const fixed = { ...process.env, MEASURED_TEST_NOW: '2026-09-03', TZ: 'America/New_York',
  ENGINE_MAIN: path.join(root, 'rebuild/conform/engines/engine-main.cjs'),
  ENGINE_OLD: path.join(root, 'rebuild/conform/engines/engine-old.cjs') };
run('conform-gate', ['rebuild/conform/run.cjs'], 0, fixed);
run('selftest-gate', ['rebuild/conform/run.cjs', '--selftest'], 0, fixed);
const strictEnv = { ...process.env }; delete strictEnv.MEASURED_TEST_NOW;
run('strict-gate', ['scripts/check.mjs', '--strict'], 0, strictEnv);
console.log('VERIFY-LOCAL ' + (failed ? 'FAIL' : 'PASS'));
process.exitCode = failed ? 1 : 0;
