'use strict';
// Real Node test execution under an already allowed spec entry point. Files are
// positional --test targets, not unused arguments to a bare Node script.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),{sha}=require('../../conform/v4/postfix/target.cjs');
const FILES=Object.freeze(['rebuild/m3/w6/test/local-initial-setup.test.mjs',
  'rebuild/m4/workout/test/native-baseline.test.cjs',
  'rebuild/m4/workout/test/native-baseline-journey.test.mjs']);
const spec=JSON.parse(fs.readFileSync(path.join(root,'rebuild/lanes/b/tooling/packages/B-NTC.json')));
for(const file of FILES)assert.equal(sha(fs.readFileSync(path.join(root,file))),spec.product[file]?.post,'Pinned actual setup/baseline test '+file);
require('./b-ntc-runtime-closure.cjs').verify(spec);
const env={...process.env,TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',NODE_OPTIONS:'',NODE_V8_COVERAGE:'',NODE_PATH:path.join(root,'rebuild/m3/w6/node_modules')};delete env.NODE_TEST_CONTEXT;
const r=cp.spawnSync(process.execPath,['--test','--test-reporter=tap',...FILES],{cwd:root,encoding:'utf8',windowsHide:true,env,timeout:180000,maxBuffer:8e6});
process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');
assert(!r.error&&r.status===0&&/^# fail 0$/m.test(r.stdout)&&/^# skipped 0$/m.test(r.stdout)&&/^# cancelled 0$/m.test(r.stdout),'All setup/baseline assertions execute');
const pass=/^# pass (\d+)$/m.exec(r.stdout);assert(pass&&Number(pass[1])===49,'Actual setup/baseline test accounting');
console.log('B-NTC OWNER SETUP/BASELINE: '+pass[1]+' PASS; 0 fail, 0 skipped, 0 cancelled; actual stored-setup and native-baseline tests');
