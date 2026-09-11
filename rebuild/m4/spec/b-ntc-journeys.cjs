'use strict';
// Replacement evidence for the retired memory-only preview child. These are
// the shipped one-store page and host tests; historical preview tests stay put.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const {sha}=require('../../conform/v4/postfix/target.cjs');
const files=[...['adapter.test.mjs','checkin.test.mjs','design.test.cjs','gym.test.mjs','ntc-h6-delta.test.mjs','package.test.cjs','view.test.mjs'].map(n=>'rebuild/m3/w7-preview/today/test/'+n),
  'rebuild/m3/w6/host/test/journey.test.mjs','rebuild/m3/w6/host/test/engine-equivalence.test.cjs',
  'rebuild/m3/w6/test/local-today-journey.test.mjs'];
const spec=JSON.parse(fs.readFileSync(path.join(root,'rebuild/lanes/b/tooling/packages/B-NTC.json')));
for(const file of files)assert.equal(sha(fs.readFileSync(path.join(root,file))),spec.product[file]?.post,'Pinned executed journey '+file);
const r=cp.spawnSync(process.execPath,['--test','--test-reporter=tap',...files],{cwd:root,encoding:'utf8',windowsHide:true,
  env:{...process.env,TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',NODE_OPTIONS:'',NODE_V8_COVERAGE:''},timeout:180000,maxBuffer:8e6});
process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');
assert(!r.error&&r.status===0&&/^# pass 237$/m.test(r.stdout)&&/^# fail 0$/m.test(r.stdout),'All original journey assertions execute');
console.log('B-NTC DURABLE JOURNEYS: 237/237 PASS; Today, gym, check-in, default-provider multi-day, host equivalence and one-store joins');
