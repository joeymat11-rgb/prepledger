'use strict';
// Public registration and historical cell35 only. Never load the protected
// ci-second-gate.test module or execute its engine/CLI/reference callbacks.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../../../..');
const L=require('../../../../conform/v4/postfix/legacy-gates.cjs');
const workflow='.github/workflows/rebuild.yml',M='100820aa47a4f8729642033499eaec0f0ee282e1';
const before='run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package H3';
const after='run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package B1-B2';
const oldName='- name: Cumulative H3 clean-init, native-carrier and legacy-census evidence';
const newName='- name: Cumulative B1-B2 repairs, clean-init, native-carrier and legacy-census evidence';
const historyMarker='      # M2-H3-CLEAN-INIT SUCCEEDS M2-B-NTC HERE,';
const successorMarker='      # B1-B2 now owns this cumulative step under DECISIONS:214.\n      # Historical H3 registration rationale follows.\n'+historyMarker;
const TODAY=['adapter.test.mjs','catalogue.test.mjs','checkin.test.mjs','copy.test.mjs','design.test.cjs','food.test.mjs','gym.test.mjs','machine-settings-ui.test.mjs','ntc-h6-delta.test.mjs','package.test.cjs','problem.test.mjs','setup.test.mjs','view.test.mjs'];
// No N2 head has been admitted to this composition. A future explicit admission
// must change this exact inventory and its source/registration pins together.
const N2_ADMISSION=null;
const original=L.object(root,M,workflow).toString('utf8');
function currentWorkflow(text) {
  for(const part of [before,oldName,historyMarker])assert.equal(original.split(part).length,2,'CURRENT-BASE-EXACT');
  const expected=original.replace(before,after).replace(oldName,newName).replace(historyMarker,successorMarker);
  assert.equal(text,expected,'CURRENT-WORKFLOW-EXACT');
  assert.equal(text.split(after).length,2,'CURRENT-CUMULATIVE-EXACTLY-ONCE');
  assert.equal(text.split(before).length,1,'CURRENT-PARENT-COMMAND-RETIRED');
  assert(text.includes('os: [ubuntu-latest, windows-latest]'),'CURRENT-BOTH-OS');
  assert(!text.includes('|| true'),'CURRENT-NO-SUCCESS-BYPASS');
  const actual=fs.readdirSync(path.join(root,'rebuild/m3/w7-preview/today/test')).filter(n=>/\.test\.(?:cjs|mjs|js)$/.test(n)).sort();
  assert.equal(N2_ADMISSION,null);assert.deepEqual(actual,TODAY.slice().sort(),'CURRENT-TODAY-EXACT');
  const oldRuns=original.split('\n').filter(line=>/^\s+(?:- )?run:/.test(line)),newRuns=text.split('\n').filter(line=>/^\s+(?:- )?run:/.test(line));
  for(const name of TODAY)assert.equal(newRuns.join('\n').split('rebuild/m3/w7-preview/today/test/'+name).length,2,'CURRENT-TODAY-ONCE '+name);
  assert.deepEqual(newRuns,oldRuns.map(line=>line.replace(before,after)),'CURRENT-ALL-STANDING-COMMANDS');
  return true;
}
test('C3-C4 current cumulative command preserves exact M workflow and all thirteen Today files',()=>currentWorkflow(fs.readFileSync(path.join(root,workflow),'utf8')));
const historicalFile='rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs';
const historicalSource=fs.readFileSync(path.join(root,historicalFile),'utf8');
const marker="test('historical STEP receipt71 changes exactly one command and retains both OS jobs'";
assert.equal(historicalSource.split(marker).length,2,'one isolated historical cell');
const historicalCell=historicalSource.slice(historicalSource.indexOf(marker));
function historical(code=historicalCell,bindings=L) {
  let calls=0;
  const scope={root,L:bindings,Buffer,assert,require:name=>{assert.equal(name,'node:crypto','HISTORICAL-CELL-REQUIRE-CLOSED');return require(name);},test:(name,run)=>{calls++;assert.match(name,/historical STEP receipt71/);run();}};
  new vm.Script(code,{filename:historicalFile+':cell35'}).runInNewContext(scope,{timeout:30000});
  assert.equal(calls,1,'one actual historical callback');
}
test('C1 exact original cell35 callback verifies receipted historical STEP bytes and ancestry',()=>historical());
function objects(change){return {...L,object:(r,at,file)=>change(at,file,L.object(r,at,file))};}
for(const [name,change] of [
  ['wrong historical artifact hash',(at,file,b)=>file.endsWith('acceptance-step-efficacy.json')?Buffer.concat([b,Buffer.from(' ')]):b],
  ['unrelated baseline byte',(at,file,b)=>at==='a777f64318dfb9b4766fa336d623196d07b5fc00'&&file===workflow?Buffer.concat([b,Buffer.from('# unrelated\n')]):b],
  ['duplicate old command',(at,file,b)=>at==='a777f64318dfb9b4766fa336d623196d07b5fc00'&&file===workflow?Buffer.concat([b,Buffer.from('run: node rebuild/engine/test/second-gate.mjs --candidate\n')]):b],
  ['zero old commands',(at,file,b)=>at==='a777f64318dfb9b4766fa336d623196d07b5fc00'&&file===workflow?Buffer.from(b.toString().replace('run: node rebuild/engine/test/second-gate.mjs --candidate','run: false')):b],
  ['changed historical workflow',(at,file,b)=>at==='904d35ddfb81e1a9b4cfc1d6ccbb50b58651149c'&&file===workflow?Buffer.concat([b,Buffer.from('# unrelated\n')]):b],
  ['forged receipt',(at,file,b)=>file==='rebuild/DECISIONS.md'?Buffer.from(b.toString().replace('POSTFIX-ACCEPTANCE M2-STEP-EFFICACY 904d35d','POSTFIX-ACCEPTANCE M2-STEP-EFFICACY 004d35d')):b],
])test('C2-C5 historical guard refuses '+name,()=>assert.throws(()=>historical(historicalCell,objects(change)),e=>e.code==='ERR_ASSERTION'));
test('C5 historical guard refuses missing chain ancestry',()=>{
  const blocked={...L,git:()=>{throw Object.assign(Error('synthetic ancestry refusal'),{code:'ANCESTRY-REFUSED'});}};
  assert.throws(()=>historical(historicalCell,blocked),{code:'ANCESTRY-REFUSED'});
});
test('mutation: substring-only historical equality loses the unrelated-byte refusal',()=>{
  const from='assert.equal(actual,original.replace(before,after));';assert.equal(historicalCell.split(from).length,2);
  const changed=historicalCell.replace(from,'assert(actual.includes(after));');
  const bad=objects((at,file,b)=>at==='a777f64318dfb9b4766fa336d623196d07b5fc00'&&file===workflow?Buffer.concat([b,Buffer.from('# unrelated\n')]):b);
  assert.throws(()=>assert.throws(()=>historical(changed,bad)),e=>e.code==='ERR_ASSERTION'&&/^Missing expected exception/.test(e.message));
});
for(const [name,change] of [
  ['missing Windows',s=>s.replace('ubuntu-latest, windows-latest','ubuntu-latest')],
  ['missing Today file',s=>s.replace(' rebuild/m3/w7-preview/today/test/food.test.mjs','')],
  ['unnamed N2',s=>s.replace(after,after+' rebuild/m3/w7-preview/today/test/sleep.test.mjs')],
  ['wrong cumulative package',s=>s.replace(after,before)],
  ['duplicate cumulative command',s=>s+'\n        '+after+'\n'],
  ['unconditional success',s=>s.replace(after,after+' || true')],
  ['removed standing PWA suite',s=>s.replace('run: node --test rebuild/slice/pwa/test/package.test.cjs','run: true')],
])test('C3-C4 current guard kills '+name,()=>{
  const text=fs.readFileSync(path.join(root,workflow),'utf8');assert.equal(currentWorkflow(text),true);
  assert.throws(()=>currentWorkflow(change(text)),e=>e.code==='ERR_ASSERTION'&&/CURRENT-/.test(e.message));
});
