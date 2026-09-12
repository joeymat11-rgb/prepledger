'use strict';
const path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
require('./b-ntc-successors.cjs').preflight();
const R=require('./native-carriers-reference.cjs'),made=R.create(root);
const r=cp.spawnSync(process.execPath,['--test','--test-reporter=tap','rebuild/m4/spec/b-ntc-native-next-targets.test.cjs',...['native-next-targets-assembly','native-next-targets-correction'].map(n=>'rebuild/m4/workout/test/'+n+'.test.cjs')],
  {cwd:root,encoding:'utf8',windowsHide:true,env:{...process.env,EARNED_NATIVE_PACKET_ROOT:made.packet,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03'},timeout:180000,maxBuffer:8e6});
process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');
assert(!r.error&&r.status===0&&/^# pass 15$/m.test(r.stdout),'Unchanged adopted native tests');
R.removeImportEngine();
console.log('B-NTC FOCUSED: 15/15 PASS; original assertions and actual child runtime');
