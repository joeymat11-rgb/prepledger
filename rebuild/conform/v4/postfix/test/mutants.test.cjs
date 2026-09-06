'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const T=require('../target.cjs'),L=require('../legacy-gates.cjs'),M=require('../mutant-proposals.cjs');
const a=require('../acceptance-import-guards.json'),mod=require('../laws/import-guards.cjs'),root=path.resolve(__dirname,'../../../../..'),dir=path.join(root,'rebuild/conform/v4/postfix');
const pins={...a.baseline.publicPins};for(const p of ['helpers/import-guards-frozen.cjs','helpers/import-guards-hosts.cjs'])pins['rebuild/conform/v4/postfix/'+p]=T.sha(fs.readFileSync(path.join(dir,p)));
const inventory=Object.fromEntries(Object.keys(a.baseline.engine).map(f=>[f,T.sha(fs.readFileSync(path.join(root,'rebuild/engine',f)))])),rows=M.buildMutants(root);
for(const [defect,list]of Object.entries(rows))for(const mutant of list)for(const cell of a.matrix)test(defect+' '+mutant.id+' '+cell.mode+'/'+cell.day+' actual fault RED and restored GREEN',()=>{
  const law=mod.laws.find(l=>l.defect===defect),expected=mod.ASSERTION_INVENTORY.filter(x=>x.caseId===mutant.caseId).map(x=>({id:x.id,count:1}));
  const input={kind:'direct',caseFile:path.join(dir,'laws/import-guards.cjs'),caseSha256:T.sha(fs.readFileSync(path.join(dir,'laws/import-guards.cjs'))),lawId:law.id,caseId:mutant.caseId,...cell,traceProfile:2,helperRoot:root,helperPins:pins,hostsHelper:a.helperFiles.hosts};
  const result=L.faultRun({candidate:path.join(root,'rebuild/engine'),inventory,scratch:path.join(root,'.tmp/postfix/mutant-tests'),mutant,caseInput:input,expected});
  assert.equal(result.status,'EFFECTIVE');assert.deepEqual(result.failedAssertions,[...mutant.expectedFailures].sort());assert.equal(result.restoredSha256,inventory['migrate.cjs']);
});
