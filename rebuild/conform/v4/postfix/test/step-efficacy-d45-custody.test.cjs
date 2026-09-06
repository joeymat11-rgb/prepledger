'use strict';
// Runtime-only protected expectations. Only verdicts and fixed site identifiers
// leave custody; real source mutations live in disposable copies.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const C=require('../helpers/step-efficacy-d45-custody.cjs'),A=require('../acceptance.cjs'),T=require('../target.cjs'),B=require('../helpers/build-step-efficacy-expectations.cjs');
const a=JSON.parse(fs.readFileSync(path.join(P,'acceptance-step-efficacy.json'),'utf8'));
a.executionPins[C.PROJECTOR]=T.sha(fs.readFileSync(path.join(root,C.PROJECTOR)));
a.inventory.find(r=>r.defect==='D45').consequence=C.descriptor(a.executionPins[C.PROJECTOR]);
const source=B.createFrozenSource({root}),row=a.inventory.find(r=>r.defect==='D45'),bundles=require('../legacy-gates.cjs').publicReferences({baseline:root,scratch:path.join(root,'.tmp/postfix/custody-test-package-reference'),sourcePins:a.baseline.buildSources});
const custody=C.prepareCustody({root,baseline:root,bundles,acceptance:a});
const scratchParent=path.join(root,'.tmp/postfix/d45-custody-tests');fs.mkdirSync(scratchParent,{recursive:true});const scratch=fs.mkdtempSync(path.join(scratchParent,'run-'));
const trace=r=>({frames:r.frames,detail:r.detail}),call=(cell,candidate=path.join(root,'rebuild/engine'),inventory=a.candidateEngine)=>T.runRaw({baseline:root,law:row.law,...cell,traceProfile:2,candidate,inventory});
const originals=new Map(a.matrix.map(cell=>[cell.mode+'/'+cell.day,T.runRaw({kind:'raw-frozen',baseline:root,law:row.law,...cell,traceProfile:2,bundle:source.bundle,bundleSha256:source.bundleSha256,helperRoot:root,helperPins:a.baseline.publicPins})]));
const old=cell=>originals.get(cell.mode+'/'+cell.day);
const rejects=(fn,code)=>assert.throws(fn,e=>e.code===code);
let disposed=false;
test.after(()=>{if(!disposed)custody.dispose();originals.clear();assert(scratch.startsWith(scratchParent+path.sep));fs.rmSync(scratch,{recursive:true,force:true});});

test('separately built public bundles may differ in generated source-path comments but must reproduce exact original traces',()=>{assert.equal(fs.readFileSync(source.bundle).equals(fs.readFileSync(bundles.main)),false);});

test('D45 only closed descriptor leaves every parent field, original trace pin and remaining defect unchanged',()=>{
 A.validate(a);const parent=A.parentArtifact(),r=structuredClone(row);delete r.consequence;
 assert.deepEqual(r,parent.inventory.find(x=>x.defect==='D45'));assert.equal(r.implementation,'PENDING');assert.equal(a.inventory.filter(x=>x.implementation==='PRESENT').length,4);
 for(const mutate of [x=>x.classification='GREEN',x=>x.preservedDefect='D44',x=>x.raw.path='/frames/0',x=>x.reason+=' unbounded',x=>x.extra=true,x=>x.newExpression=x.oldExpression]){const x=structuredClone(row.consequence);mutate(x);rejects(()=>C.validateDescriptor(x,a.executionPins[C.PROJECTOR]),'D45-CUSTODY-DESCRIPTOR');}
 const misplaced=structuredClone(a);misplaced.inventory[0].consequence=misplaced.inventory.find(x=>x.defect==='D45').consequence;rejects(()=>A.validate(misplaced),'CARRIED-OR-UNSELECTED-INVENTORY');
});

test('actual candidate raw D45 four cells remain RED and match whole runtime source-derived traces',()=>{
 for(const cell of a.matrix){const current=call(cell);assert.equal(current.status,'RED');assert.match(custody.compareRaw({original:old(cell),current,cell}),/^D45 CONSEQUENTIAL-RED/);}
});

test('real restore-times1000 source fault is detected by comparison, not pin or syntax',()=>{
 const dir=path.join(scratch,'restore'),inventory={...a.candidateEngine};fs.mkdirSync(dir);
 for(const file of Object.keys(inventory))fs.copyFileSync(path.join(root,'rebuild/engine',file),path.join(dir,file));
 const file=path.join(dir,'energy.cjs'),original=fs.readFileSync(file,'utf8'),d=row.consequence;
 assert.equal(original.split(d.newExpression).length,2);const changed=original.replace(d.newExpression,d.oldExpression);fs.writeFileSync(file,changed);inventory['energy.cjs']=T.sha(changed);
 for(const cell of a.matrix){const current=call(cell,dir,inventory);assert.equal(current.status,'RED');rejects(()=>custody.compareRaw({original:old(cell),current,cell}),'D45-CUSTODY-RAW-MISMATCH');}
 fs.writeFileSync(file,original);assert.equal(T.sha(fs.readFileSync(file)),a.candidateEngine['energy.cjs']);
});

test('real extra caller-state cell is detected with valid updated source inventory and RED verdict',()=>{
 const dir=path.join(scratch,'extra'),inventory={...a.candidateEngine};fs.mkdirSync(dir);
 for(const file of Object.keys(inventory))fs.copyFileSync(path.join(root,'rebuild/engine',file),path.join(dir,file));
 const file=path.join(dir,'writers.cjs'),original=fs.readFileSync(file,'utf8'),anchor='function askContext(s, docs) {';
 assert.equal(original.split(anchor).length,2);const changed=original.replace(anchor,anchor+'\n  s.__custodyExtraCell = true;');fs.writeFileSync(file,changed);inventory['writers.cjs']=T.sha(changed);
 for(const cell of a.matrix){const current=call(cell,dir,inventory);assert.equal(current.status,'RED');rejects(()=>custody.compareRaw({original:old(cell),current,cell}),'D45-CUSTODY-RAW-MISMATCH');}
 fs.writeFileSync(file,original);assert.equal(T.sha(fs.readFileSync(file)),a.candidateEngine['writers.cjs']);
});

test('full old/new protected strings and JSON-escaped strings are blocked before output',()=>{
 for(const cell of a.matrix){const original=old(cell),current=call(cell);for(const r of [original,current]){const value=r.frames[0].after[4][1][5][1];rejects(()=>custody.assertSafePublicText(value),'D45-CUSTODY-LEAK');rejects(()=>custody.assertSafePublicText(JSON.stringify({text:value})),'D45-CUSTODY-LEAK');}}
 assert.equal(custody.assertSafePublicText('D45 RED / verdict-only'),'D45 RED / verdict-only');
});

test('all original witness-7 assertions and writer differential modes/clock/alias/isolation checks execute',()=>{
 for(const mode of ['frozen','native'])assert.equal(custody.runLegacy('defect-witnesses-7',mode).status,'PASS');
 for(const mode of ['frozen','native','trap'])assert.equal(custody.runLegacy('writers-differential',mode).status,'PASS');
 rejects(()=>custody.runLegacy('defect-witnesses-7','trap'),'D45-CUSTODY-MODE');rejects(()=>custody.runLegacy('other','frozen'),'D45-CUSTODY-LEGACY-ID');
});

test('actual successor child dispatch preserves both witness modes and all three differential modes',()=>{
 const carrier=require('../legacy-step-efficacy-carriers.cjs');
 for(const [id,modes]of [['defect-witnesses-7',['frozen','native']],['writers-differential',['frozen','native','trap']]])for(const mode of modes){const result=carrier.runCarrier({id,mode,root,baseline:root,bundles,acceptance:a});assert.equal(result.status,'PASS');assert.equal(result.id,id);assert.equal(result.mode,mode);custody.assertSafePublicText(JSON.stringify(result));}
});

test('a new custody authoring session refuses after an actual candidate was loaded; disposal clears private expectations',()=>{
 rejects(()=>C.prepareCustody({root,baseline:root,bundles,acceptance:a}),'D45-CUSTODY-CANDIDATE-EARLY');
 custody.dispose();disposed=true;rejects(()=>custody.assertSafePublicText('fixed'),'D45-CUSTODY-DISPOSED');rejects(()=>custody.compareRaw({cell:a.matrix[0]}),'D45-CUSTODY-DISPOSED');
});
