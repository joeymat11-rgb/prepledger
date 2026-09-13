'use strict';
// Public registration and historical cell35 only. Never load the protected
// ci-second-gate.test module or execute its engine/CLI/reference callbacks.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm');
const Module=require('node:module'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../../..');
const L=require('../../../../conform/v4/postfix/legacy-gates.cjs');
const workflow='.github/workflows/rebuild.yml',M='100820aa47a4f8729642033499eaec0f0ee282e1';
const before='run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package H3';
const after='run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package B1-B2';
const oldName='- name: Cumulative H3 clean-init, native-carrier and legacy-census evidence';
const newName='- name: Cumulative B1-B2 repairs, clean-init, native-carrier and legacy-census evidence';
const historyMarker='      # M2-H3-CLEAN-INIT SUCCEEDS M2-B-NTC HERE,';
const successorMarker='      # B1-B2 now owns this cumulative step under DECISIONS:214.\n      # Historical H3 registration rationale follows.\n'+historyMarker;
const repairRegistration='      # PM246 adds four closed B1-B2 children in the dispatcher profile:\n      # b2-public-source-cells, b2-public-source-audit,\n      # b2-era30-cells and b2-era30-audit. Each has its own exact argv and pin.\n';
const TODAY=['adapter.test.mjs','catalogue.test.mjs','checkin.test.mjs','copy.test.mjs','design.test.cjs','food.test.mjs','gym.test.mjs','machine-settings-ui.test.mjs','ntc-h6-delta.test.mjs','package.test.cjs','problem.test.mjs','setup.test.mjs','view.test.mjs'];
// Exact named admission236. Previous heads' results do not prove this composition.
const N2_ADMISSION='bfc293573e1010559e0119bdc7ff666e89f740cc';
const SLEEP='rebuild/m3/w7-preview/today/test/sleep.test.mjs';
const TODAY_WITH_SLEEP=[...TODAY,'sleep.test.mjs'];
const original=L.object(root,M,workflow).toString('utf8');
function currentWorkflow(text) {
  for(const part of [before,oldName,historyMarker])assert.equal(original.split(part).length,2,'CURRENT-BASE-EXACT');
  const appendSleep=text=>text.replace('rebuild/m3/w7-preview/today/test/view.test.mjs','rebuild/m3/w7-preview/today/test/view.test.mjs '+SLEEP);
  const expected=appendSleep(original.replace(before,after).replace('      '+oldName,repairRegistration+'      '+newName).replace(historyMarker,successorMarker));
  assert.equal(text,expected,'CURRENT-WORKFLOW-EXACT');
  assert.equal(text.split(after).length,2,'CURRENT-CUMULATIVE-EXACTLY-ONCE');
  assert.equal(text.split(before).length,1,'CURRENT-PARENT-COMMAND-RETIRED');
  assert(text.includes('os: [ubuntu-latest, windows-latest]'),'CURRENT-BOTH-OS');
  assert(!text.includes('|| true'),'CURRENT-NO-SUCCESS-BYPASS');
  const actual=fs.readdirSync(path.join(root,'rebuild/m3/w7-preview/today/test')).filter(n=>/\.test\.(?:cjs|mjs|js)$/.test(n)).sort();
  assert.deepEqual(actual,TODAY_WITH_SLEEP.slice().sort(),'CURRENT-TODAY-EXACT');
  const oldRuns=original.split('\n').filter(line=>/^\s+(?:- )?run:/.test(line)),newRuns=text.split('\n').filter(line=>/^\s+(?:- )?run:/.test(line));
  for(const name of TODAY_WITH_SLEEP)assert.equal(newRuns.join('\n').split('rebuild/m3/w7-preview/today/test/'+name).length,2,'CURRENT-TODAY-ONCE '+name);
  assert.deepEqual(newRuns,oldRuns.map(line=>appendSleep(line.replace(before,after))),'CURRENT-ALL-STANDING-COMMANDS');
  return true;
}
test('C3-C4 current cumulative command preserves exact M workflow and thirteen Today files plus admitted sleep',()=>currentWorkflow(fs.readFileSync(path.join(root,workflow),'utf8')));
const setupFile='rebuild/m3/w7-preview/today/test/setup.test.mjs';
const oldSetup=L.object(root,M,setupFile).toString('utf8');
const currentSetup=fs.readFileSync(path.join(root,setupFile),'utf8');
const lookupStart='  const child = (() => {',lookupEnd='  const missed = [], licensed = [];';
function lookup(source){
 assert.equal(source.split(lookupStart).length,2);assert.equal(source.split(lookupEnd).length,2);
 const start=source.indexOf(lookupStart),end=source.indexOf(lookupEnd,start);
 return {before:source.slice(0,start),code:source.slice(start,end),after:source.slice(end)};
}
test('C6 only the licensed child-product lookup hunk changes in setup.test',()=>{
 const old=lookup(oldSetup),now=lookup(currentSetup);
 assert.equal(now.before,old.before);assert.equal(now.after,old.after);
 assert(now.code.includes("const current = 'rebuild/lanes/b/tooling/packages/B1-B2.json';"));
});
function childLookup(files){
 const source=lookup(currentSetup).code;
 const context={assert,fs:{existsSync:p=>Object.hasOwn(files,p)},repoPath:p=>p,readRepo:p=>{if(!Object.hasOwn(files,p))throw Error('absent fixture');return files[p];}};
 return new vm.Script(source+'\n({child,declared});').runInNewContext(context,{timeout:1000});
}
const profilePath='rebuild/lanes/b/tooling/packages/B1-B2.json',historicalPath='rebuild/lanes/b/tooling/packages/H3.json';
const pin={pre:'a'.repeat(64),post:'b'.repeat(64),role:'edited'};
const present={version:1,lanePackage:'B1-B2',packageId:'M2-B1-B2',product:{'rebuild/engine/sleep.cjs':pin}};
test('C7 current lookup chooses B1-B2 and requires its exact post image',()=>{
 const got=childLookup({[profilePath]:JSON.stringify(present),[historicalPath]:JSON.stringify({product:{old:pin}})});
 assert(got.declared('rebuild/engine/sleep.cjs',pin.post));assert(!got.declared('rebuild/engine/sleep.cjs',pin.pre));assert(!Object.hasOwn(got.child,'old'));
});
test('C7 historical lookup fallback is reached only when B1-B2 is absent',()=>{
 const got=childLookup({[historicalPath]:JSON.stringify({product:{old:pin}})});assert(got.declared('old',pin.post));
 assert.equal(Object.keys(childLookup({}).child).length,0);
});
for(const[name,body]of[
 ['malformed JSON','{'],['null','null'],['wrong schema',JSON.stringify({...present,version:2})],
 ['wrong package',JSON.stringify({...present,packageId:'M2-B1-B2-OTHER'})],
 ['missing product',JSON.stringify({version:1,lanePackage:'B1-B2',packageId:'M2-B1-B2'})],
 ['array product',JSON.stringify({...present,product:[]})],
 ['null pin',JSON.stringify({...present,product:{x:null}})],
 ['missing post',JSON.stringify({...present,product:{x:{pre:pin.pre,role:'edited'}}})],
 ['wrong post',JSON.stringify({...present,product:{x:{...pin,post:'PASS'}}})],
 ['extra pin field',JSON.stringify({...present,product:{x:{...pin,skip:true}}})],
])test('C8 present malformed profile refuses without historical fallback: '+name,()=>{
 assert.throws(()=>childLookup({[profilePath]:body,[historicalPath]:JSON.stringify({product:{old:pin}})}));
});
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

// Compile only the production declaration checker and its fixed constants.
// No main sequence, package/native factory, protected test or fixture executes.
const runnerPath='rebuild/lanes/b/tooling/b-package.cjs';
const runnerSource=fs.readFileSync(path.join(root,runnerPath),'utf8');
const inventoryStart='const B1B2_SOURCE_BASE =',inventoryEnd='// N2. A child never runs inline code';
assert.equal(runnerSource.split(inventoryStart).length,2);assert.equal(runnerSource.split(inventoryEnd).length,2);
const declaration=runnerSource.slice(runnerSource.indexOf(inventoryStart),runnerSource.indexOf(inventoryEnd));
const idsLine=runnerSource.split('\n').find(l=>l.startsWith('const B1B2_D_IDS ='));
const familyBlock=runnerSource.slice(runnerSource.indexOf('const B1B2_FAMILIES ='),runnerSource.indexOf('const B1B2_REPAIRED ='));
const toolLine=runnerSource.split('\n').find(l=>l.startsWith('const B1B2_TOOL_TESTS ='));
function inventoryModule(code=declaration){
 const m=new Module(path.join(root,'.tmp','registration-reader.cjs'));
 m.require=name=>{assert.equal(name,'node:assert/strict');return assert;};
 m._compile("const assert=require('node:assert/strict'), ID='B1-B2', TOOLING='rebuild/lanes/b/tooling';\n"+idsLine+'\n'+familyBlock+'\n'+toolLine+'\n'+code+'\nmodule.exports={check:b1b2Inventory,argv:B1B2_CHILD_ARGV};',m.id);
 return m.exports;
}
const inventory=inventoryModule();
const currentProfile=()=>JSON.parse(fs.readFileSync(path.join(root,profilePath)));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
test('C12c public law source admission retains M/R/S/T and the closed Today-only U repair',()=>{
 const source=fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs'),'utf8');
 const start='function publicLawSourceSide(',end='\nfunction runPublicLaws()';assert.equal(source.split(start).length,2);assert.equal(source.split(end).length,2);
 const code=source.slice(source.indexOf(start),source.indexOf(end));
 const check=text=>new vm.Script(text+'\npublicLawSourceSide;').runInNewContext({assert},{timeout:1000});
 const checker=check(code),admitted=(manifest,pins,repair,current,r9Manifest=r9)=>checker(manifest,pins,repair,current,r9Manifest);
 const names=['dates','constants','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','migrate','earn','merge','writers'].map(n=>n+'.cjs');
 const pins=Object.fromEntries(names.map(n=>[n,{base:'a'.repeat(64),candidate:'b'.repeat(64)}]));
 const repair={sourceBase:'6c9248e695a4478abdbaae0f9f48395ac56000fa',runtime:Object.fromEntries(['progression','sleep','today','writers'].map(n=>['rebuild/engine/'+n+'.cjs',{pre:'b'.repeat(64),post:'c'.repeat(64)}]))};
 const today='rebuild/engine/today.cjs',current={sourceBase:'48a3063a23528ed240eb2356226d237d2793a9da',runtime:{[today]:{pre:'c'.repeat(64),post:'80d4196cfe50637ed373dcf5fa0eab1c2ef549b957aea7c032ab518d2a67ba91'}}};
 const r9={sourceBase:'797e4cf39fac39148ccae784116999669b82caf3',runtime:{[today]:{pre:current.runtime[today].post,post:'180cdfd01be61de258477bf78c5de27f4deecaee748710c613976a303b29998f'}}};
 const old=key=>Object.fromEntries(names.map(n=>[n,pins[n][key]]));const next={...old('candidate'),...Object.fromEntries(['progression','sleep','today','writers'].map(n=>[n+'.cjs','c'.repeat(64)]))};
 const repaired={...next,'today.cjs':current.runtime[today].post};
 assert.equal(admitted(old('base'),pins,repair,current),'M');assert.equal(admitted(old('candidate'),pins,repair,current),'candidate');assert.equal(admitted(next,pins,repair,current),'successor');assert.equal(admitted(repaired,pins,repair,current),'repair');
 const latest={...repaired,'today.cjs':r9.runtime[today].post};assert.equal(admitted(latest,pins,repair,current,r9),'r9');
 const wrong={...next,'constants.cjs':'d'.repeat(64)};assert.throws(()=>admitted(wrong,pins,repair,current),/exact public/);
 assert.throws(()=>admitted({...next,extra:'c'.repeat(64)},pins,repair,current),/module inventory/);
 assert.throws(()=>admitted(next,pins,{...repair,sourceBase:'1'.repeat(40)},current),/fixed R/);
 assert.throws(()=>admitted(next,pins,{...repair,runtime:{...repair.runtime,'rebuild/engine/energy.cjs':{pre:'b'.repeat(64),post:'c'.repeat(64)}}},current),/four repair/);
 const bad=structuredClone(repair);bad.runtime['rebuild/engine/sleep.cjs'].pre='e'.repeat(64);assert.throws(()=>admitted(next,pins,bad,current),/R preimage/);
 const wrongT={...repaired,'sleep.cjs':pins['sleep.cjs'].candidate};assert.throws(()=>admitted(wrongT,pins,repair,current),/exact public/);
 assert.throws(()=>admitted(repaired,pins,repair,{...current,sourceBase:repair.sourceBase}),/fixed S/);
 assert.throws(()=>admitted(repaired,pins,repair,{...current,extra:true}),/closed S\/T manifest/);
 assert.throws(()=>admitted(repaired,pins,repair,{...current,runtime:{}}),/one T repair image/);
 assert.throws(()=>admitted(repaired,pins,repair,{...current,runtime:{...current.runtime,'rebuild/engine/sleep.cjs':{pre:'c'.repeat(64),post:'d'.repeat(64)}}}),/one T repair image/);
 for(const [key,value,refusal]of[['pre','d'.repeat(64),/S preimage/],['post','d'.repeat(64),/exact T postimage/],['extra',true,/closed T repair row/]]) {
  const changed=structuredClone(current);changed.runtime[today][key]=value;assert.throws(()=>admitted(repaired,pins,repair,changed),refusal);
 }
 const guard="names.every(n=>manifest[n]===(repair.runtime['rebuild/engine/'+n]?.post||pins[n].candidate))";
 assert.equal(code.split(guard).length,2);const mutant=check(code.replace(guard,"Object.entries(repair.runtime).every(([file,row])=>manifest[file.slice('rebuild/engine/'.length)]===row.post)"));
 assert.throws(()=>assert.throws(()=>mutant(wrong,pins,repair,current,r9)),e=>e.code==='ERR_ASSERTION'&&/^Missing expected exception/.test(e.message));
 const repairGuard="names.every(n=>manifest[n]===(current.runtime['rebuild/engine/'+n]?.post||repair.runtime['rebuild/engine/'+n]?.post||pins[n].candidate))";
 assert.equal(code.split(repairGuard).length,2);const repairMutant=check(code.replace(repairGuard,"Object.entries(current.runtime).every(([file,row])=>manifest[file.slice('rebuild/engine/'.length)]===row.post)"));
 assert.throws(()=>assert.throws(()=>repairMutant(wrongT,pins,repair,current,r9)),e=>e.code==='ERR_ASSERTION'&&/^Missing expected exception/.test(e.message));
 const wrongU={...latest,'sleep.cjs':pins['sleep.cjs'].candidate};assert.throws(()=>admitted(wrongU,pins,repair,current,r9),/exact public/);
 assert.throws(()=>admitted(latest,pins,repair,current,{...r9,sourceBase:current.sourceBase}),/fixed T/);
 assert.throws(()=>admitted(latest,pins,repair,current,{...r9,extra:true}),/closed T\/U manifest/);
 assert.throws(()=>admitted(latest,pins,repair,current,{...r9,runtime:{}}),/one U R9 image/);
 assert.throws(()=>admitted(latest,pins,repair,current,{...r9,runtime:{...r9.runtime,'rebuild/engine/sleep.cjs':{pre:'c'.repeat(64),post:'d'.repeat(64)}}}),/one U R9 image/);
 for(const [key,value,refusal]of[['pre','d'.repeat(64),/T preimage/],['post','d'.repeat(64),/exact U postimage/],['extra',true,/closed U R9 row/]]) {
  const changed=structuredClone(r9);changed.runtime[today][key]=value;assert.throws(()=>admitted(latest,pins,repair,current,changed),refusal);
 }
 const r9Guard="names.every(n=>manifest[n]===(r9.runtime['rebuild/engine/'+n]?.post||current.runtime['rebuild/engine/'+n]?.post||repair.runtime['rebuild/engine/'+n]?.post||pins[n].candidate))";
 assert.equal(code.split(r9Guard).length,2);const r9Mutant=check(code.replace(r9Guard,"Object.entries(r9.runtime).every(([file,row])=>manifest[file.slice('rebuild/engine/'.length)]===row.post)"));
 assert.throws(()=>assert.throws(()=>r9Mutant(wrongU,pins,repair,current,r9)),e=>e.code==='ERR_ASSERTION'&&/^Missing expected exception/.test(e.message));
});
test('C9 full current profile passes the actual closed registration checker',()=>{
 const s=currentProfile();inventory.check(s);
 assert.equal(s.children.length,26);assert.equal(s.witnessFlips.length,35);
 for(const [name,count]of [['unknown-and-target-cells',331],['b1b2-sup-source',94],['b1b2-sup-writers',335],['tooling-cohort',267]])
  assert.equal(s.children.find(c=>c.name===name).needle,'# pass '+count,'exact R4 expectation; prospective until that child runs');
 assert.equal(s.children.find(c=>c.name==='public-census').needle,'B1B2 PUBLIC CENSUS: 2 complete original public runs; 3 complete M/U frame comparisons; ');
 assert.equal(s.parent.chosen,'H3');assert.equal(s.parent.options.length,1);
 assert.equal(s.parent.options[0].receiptLedgerLine,187);
 assert.equal(s.parent.options[0].sha256,'b457b539a384d8c72531b880cd771e996c6b231f034a49272e899c1fba61e61f');
 assert.equal(s.parent.options[0].reviewSha256,'42295d2f4327cef9f4fa736848645f641c91a637b21445c95235d0e19af8f23d');
 assert.deepEqual(s.laws,{...JSON.parse(L.object(root,M,'rebuild/lanes/b/tooling/packages/B1.json')).laws,...JSON.parse(L.object(root,M,'rebuild/lanes/b/tooling/packages/B2.json')).laws});
 assert.deepEqual(s.privateLiveTriggered,['D16','D30']);
});
for(const name of Object.keys(inventory.argv))test('C10 required current child cannot be omitted: '+name,()=>{
 const s=currentProfile();inventory.check(s);s.children=s.children.filter(c=>c.name!==name);
 assert.throws(()=>inventory.check(s),/B1B2-REGISTRATION-CLOSED-CHILDREN/);
});
for(const[name,mutate,code]of[
 ['sourceBase override',s=>s.sourceBase='1'.repeat(40),'SOURCE-BASE'],
 ['suffix package alias',s=>s.packageId='M2-B1-B2-ALIAS','PACKAGE-ID'],
 ['missing D identity',s=>s.dIds.pop(),'24-IDS'],
 ['reordered D identity',s=>s.dIds.reverse(),'24-IDS'],
 ['extra child',s=>s.children.push({...s.children[0],name:'extra'}),'CLOSED-CHILDREN'],
 ['duplicated child',s=>s.children.push(s.children[0]),'CLOSED-CHILDREN'],
 ['wrong application mode',s=>s.children.find(c=>c.name==='public-laws').argv[1]='--witness-2','EXACT-ARGV'],
 ['wrong public source audit mode',s=>s.children.find(c=>c.name==='b2-public-source-audit').argv[1]='--audit-historical-mutations','EXACT-ARGV'],
 ['wrong ERA30 audit mode',s=>s.children.find(c=>c.name==='b2-era30-audit').argv[1]='--public-laws','EXACT-ARGV'],
 ['missing public source ownership',s=>delete s.product['rebuild/engine/test/b2-public-source-faults.test.cjs'],'EXECUTABLE-OWNERSHIP'],
 ['missing ERA30 ownership',s=>delete s.product['rebuild/engine/test/b2-era30.test.cjs'],'EXECUTABLE-OWNERSHIP'],
 ['missing target ownership',s=>delete s.product['rebuild/engine/test/b1b2-sleep-target-cells.cjs'],'EXECUTABLE-OWNERSHIP'],
 ['missing source helper',s=>delete s.product['rebuild/m4/workout/test/b1b2-evidence.cjs'],'HELPER-OWNERSHIP'],
 ['missing source manifest',s=>delete s.product['rebuild/m4/workout/test/b1b2-source-changes.json'],'HELPER-OWNERSHIP'],
 ['stale H3 child selection',s=>s.children.find(c=>c.name==='h3-cells').argv[2]='rebuild/m4/workout/test/h3-clean-init.test.cjs','EXACT-ARGV'],
 ['missing Today file',s=>s.children.find(c=>c.name==='today-suites').argv.pop(),'EXACT-ARGV'],
 ['duplicate sleep file',s=>s.children.find(c=>c.name==='today-suites').argv.push(SLEEP),'EXACT-ARGV'],
 ['missing sleep file',s=>s.children.find(c=>c.name==='today-suites').argv=s.children.find(c=>c.name==='today-suites').argv.filter(a=>a!==SLEEP),'EXACT-ARGV'],
 ['changed sleep post-image',s=>s.product[SLEEP].post='0'.repeat(64),'N2-EXACT-POST'],
 ['missing admitted N2 source',s=>delete s.product['rebuild/m3/w7-preview/today/sleep-host.mjs'],'N2-EXACT-POST'],
 ['missing tooling file',s=>s.children.find(c=>c.name==='tooling-cohort').argv.pop(),'EXACT-ARGV'],
 ['inherited credit',s=>s.coverage.inherited={'witnesses-1':'combined-legacy'},'NO-INHERITED-CREDIT'],
 ['gate move',s=>s.coverage.moves={selftest:{child:'combined-legacy'}},'NO-MOVES'],
 ['old successor shortcut',s=>s.coverage.successors={carriers:{}},'NO-OLD-SUCCESSOR-ROUTE'],
 ['omitted family',s=>delete s.coverage.superseded.gates['second-gate'],'FIVE-FAMILIES'],
 ['old runner census shortcut',s=>s.coverage.superseded.gates['second-gate'].evidence.census='runner-live-triggered-line','CURRENT-FAMILY-EVIDENCE'],
 ['sampled law inventory',s=>s.coverage.superseded.gates['second-gate'].evidence.laws=s.dIds.slice(0,1),'CURRENT-FAMILY-EVIDENCE'],
])test('C11 actual declaration guard refuses '+name,()=>{
 const s=currentProfile();inventory.check(s);mutate(s);
 assert.throws(()=>inventory.check(s),new RegExp('B1B2-REGISTRATION-'+code));
});
test('C12 profile binds actual public product bytes, fixed M preimages and untouched parent inventory',()=>{
 const s=currentProfile(),a=JSON.parse(fs.readFileSync(path.join(root,'rebuild/m4/spec/acceptance-h3-clean-init.json')));
 const tracked=new Set(L.git(root,['ls-tree','-r','--name-only',M]).toString().trim().split('\n'));
 for(const p of Object.keys(a.product))assert(Object.hasOwn(s.product,p),'every parent product inherited');
 for(const[p,pin]of Object.entries(s.product)){
  if(p==='rebuild/engine/seed.cjs'){assert.deepEqual(pin,{pre:a.product[p].post,post:a.product[p].post,role:'carried'});continue;}
  assert(!/soak|\/private\/|^ledger\/|^src\/history/i.test(p),'protected data is not opened');
  assert.equal(hash(fs.readFileSync(path.join(root,p))),pin.post,'current public post '+p);
  assert.equal(tracked.has(p)?hash(L.object(root,M,p)):null,pin.pre,'fixed M preimage '+p);
 }
 assert.equal(hash(Buffer.from(runnerSource)),s.tooling.runnerSha256,'actual runner pin');
 assert.equal(hash(fs.readFileSync(path.join(root,s.brief.file))),s.brief.sha256,'actual brief pin');
});
test('C12b exact PM236 N2 source/report hashes and fourteen Today targets are all carried',()=>{
 const go=L.object(root,'061fe6ba68469989dd29c20009ba36351d19fac3','rebuild/lanes/astra/N2-R6-COMPOSITION-PM-GO.md');
 assert.equal(hash(go),'7985cc08d6bbf98aa06556641e646cab658fc082d86cb08dc69e18c24a35272b');
 const rows=[...go.toString().matchAll(/^\| (rebuild\/[^ |]+) \| ([a-f0-9]{64}) \|$/gm)];assert.equal(rows.length,13);
 const s=currentProfile();
 for(const[,file,post]of rows){assert.equal(hash(L.object(root,N2_ADMISSION,file)),post);assert.equal(s.product[file].post,post);}
 const today=s.children.find(c=>c.name==='today-suites');
 assert.deepEqual(today.argv.slice(2),TODAY_WITH_SLEEP.map(n=>'rebuild/m3/w7-preview/today/test/'+n));
 assert.equal(today.needle,'# pass 630','prospective retained553 plus admitted77; this test does not run them');
});
for(const[name,guard,mutate]of[
 ['closed children',"  assert.deepEqual(s.children.map(c=>c.name),Object.keys(B1B2_CHILD_ARGV),'B1B2-REGISTRATION-CLOSED-CHILDREN');",s=>s.children.pop()],
 ['sourceBase',"  assert.equal(s.sourceBase,B1B2_SOURCE_BASE,'B1B2-REGISTRATION-SOURCE-BASE');",s=>s.sourceBase='2'.repeat(40)],
 ['argv',"    assert.deepEqual(c.argv,B1B2_CHILD_ARGV[c.name],'B1B2-REGISTRATION-EXACT-ARGV '+c.name);",s=>s.children.find(c=>c.name==='public-laws').argv[1]='--not-allowed'],
])test('C13 behavioral source mutant removes the runnable '+name+' refusal',()=>{
 assert.equal(declaration.split(guard).length,2);const s=currentProfile();inventory.check(s);mutate(s);
 assert.throws(()=>inventory.check(s),/B1B2-REGISTRATION-/);
 const mutant=inventoryModule(declaration.replace(guard,'// intentional guard-removal mutant'));
 assert.doesNotThrow(()=>mutant.check(s));
});
