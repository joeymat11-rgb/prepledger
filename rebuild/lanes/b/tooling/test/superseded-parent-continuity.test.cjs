'use strict';
// DECISIONS:232. Real runner readers over explicitly invented Git repositories.
// These are tooling unit fixtures, never package/native/census acceptance evidence.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const Module=require('node:module'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../../../..'),runner='rebuild/lanes/b/tooling/b-package.cjs';
const source=fs.readFileSync(path.join(root,runner),'utf8');
const boundary='// ------------------------------------------------------------------ 8. main sequence';
assert.equal(source.split(boundary).length,2);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=o=>JSON.stringify(o,null,2)+'\n';
const literals=name=>{const match=source.match(new RegExp('^const '+name+' = Object\\.freeze\\((.+)\\);$','m'));assert(match,name);return vm.runInNewContext('('+match[1]+')',Object.create(null));};
const ACTUAL_PARENT=JSON.parse(JSON.stringify(literals('B1B2_PARENT')));
const H3=JSON.parse(fs.readFileSync(path.join(root,ACTUAL_PARENT.artifact)));
const families=H3.coverage.supersededByCarrier;
const carrier='rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs';
const modes={'--witness-1':'defect-witnesses','--witness-3':'defect-witnesses-3','--witness-4':'defect-witnesses-4'};
const witnessPins={
 'witnesses-1':['defect-witnesses',10,12,'557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644'],
 'witnesses-3':['defect-witnesses-3',5,9,'f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6'],
 'witnesses-4':['defect-witnesses-4',5,5,'c90ffeaa953a9b04146432f39702f87fc8c51ce7f0be77876f075fc4142b87f7'],
};
// Read only the already approved literal substitution tables, never their entry points.
function approvedRows(){
 const one=fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/legacy-b1-carriers.cjs'),'utf8');
 const two=fs.readFileSync(path.join(root,'rebuild/m4/spec/b2-inherited-carriers.cjs'),'utf8');
 const a=one.slice(one.indexOf('const EXPECTATIONS ='),one.indexOf('\n// ---------------------------------------------------------------------------\nlet activeContext'));
 const b=two.slice(two.indexOf('const W1 ='),two.indexOf('\n// Expected post-B2 tail'));
 assert(a.startsWith('const EXPECTATIONS =')&&b.startsWith('const W1 ='));
 assert.doesNotMatch(a+b,/\brequire\s*\(|process\.|readFile|import\s*\(/);
 const first=vm.runInNewContext(a+';EXPECTATIONS',Object.create(null));
 const second=vm.runInNewContext('const DASH="—";'+b+';SUCCESSORS',Object.create(null));
 return Object.fromEntries(Object.entries(witnessPins).map(([gate,[name,,,pin]])=>[gate,{
   original:'rebuild/engine/test/'+name+'.cjs',sha256:pin,child:'repaired-'+gate,mode:'--witness-'+gate.slice(-1),
   substitutions:JSON.parse(JSON.stringify([...(first[name]||[]).map(([from,to])=>[from,to]),...(second[name]||[]).map(([,from,to])=>[from,to])])),
 }]));
}
const temp=path.join(root,'.tmp');fs.mkdirSync(temp,{recursive:true});const scratches=[];
function fixture({parentEdit=()=>{},ruleEdit=x=>x,runnerEdit=x=>x,id='B1-B2'}={}){
 const dir=fs.mkdtempSync(path.join(temp,'b1b2-continuity-'));scratches.push(dir);
 const git=(...args)=>cp.execFileSync('git',args,{cwd:dir,encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();
 const write=(file,bytes)=>{const out=path.resolve(dir,file);assert(out.startsWith(dir+path.sep));fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes);};
 const commit=()=>{git('add','-A');git('commit','--quiet','--allow-empty','-m','synthetic tooling boundary');return git('rev-parse','HEAD');};
 git('init','--quiet','-b','fixture-chain');git('config','user.name','Synthetic continuity test');git('config','user.email','continuity@earned.local');git('config','core.autocrlf','false');
 for(const file of ['rebuild/conform/v4/postfix/run.cjs','rebuild/conform/v4/postfix/target.cjs','rebuild/conform/v4/postfix/legacy-gates.cjs','rebuild/conform/v4/postfix/strict-json.cjs','rebuild/m4/spec/native-carriers-errors.cjs','rebuild/m4/spec/load-write-reference.cjs'])write(file,fs.readFileSync(path.join(root,file)));
 write('rebuild/engine/fixture-outside.cjs','module.exports = "synthetic unchanged";\n');
 for(const [name]of Object.values(witnessPins))write('rebuild/engine/test/'+name+'.cjs',fs.readFileSync(path.join(root,'rebuild/engine/test/'+name+'.cjs')));
 const old=structuredClone(H3);old.product={};old.executionPins={};
 for(const child of old.children)for(const f of child.argv.filter(x=>!x.startsWith('-'))){const body='// synthetic parent execution source\n';write(f,body);old.executionPins[f]=sha(body);}
 old.sourceBase=commit();parentEdit(old);
 const artifact=ACTUAL_PARENT.artifact,review=ACTUAL_PARENT.review;
 const artifactBytes=json(old);write(artifact,artifactBytes);const reviewedCommit=commit();
 const receiptLine='- 2026-09-12 · cowork · POSTFIX-ACCEPTANCE M2-H3-CLEAN-INIT '+reviewedCommit+' '+artifact+' '+sha(artifactBytes)+' ACCEPTED';
 write('rebuild/DECISIONS.md',receiptLine+'\n');const receiptBase=commit();
 const receipt={commit:receiptBase,path:'rebuild/DECISIONS.md',line:receiptLine,lineSha256:sha(receiptLine)};
 const reviewBytes=json({version:1,status:'ACCEPTED',receipt});write(review,reviewBytes);
 const handLine='- 2026-09-13 · owner · Synthetic Astra PM handover · RULED';
 const document='rebuild/lanes/astra/OWNER-APPROVED-HANDOVER.md',documentBytes='Synthetic handover; no project authorization.\n';
 write(document,documentBytes);write('rebuild/DECISIONS.md',receiptLine+'\n'+handLine+'\n');const handCommit=commit();
 const handover={commit:handCommit,lineNumber:2,lineSha256:sha(handLine),document,documentSha256:sha(documentBytes)};
 const token='GATE-SUPERSESSION M2-B1-B2 source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate';
 const rule=ruleEdit('- 2026-09-13 · Astra PM · '+token+' · Synthetic tooling grant only · RULED');
 write('rebuild/DECISIONS.md',receiptLine+'\n'+handLine+'\n'+rule+'\n');const sourceBase=commit();
 // PM304: six invented documents/five claims, with the same closed PM300
 // shape. Only immutable fixture identities below change in the real runner.
 const amendmentStart='const B1B2_AMENDMENTS = ',amendmentEnd='function b1b2AmendmentShape(s) {';
 assert.equal(source.split(amendmentStart).length,2);assert.equal(source.split(amendmentEnd).length,2);
 const amendmentLiteral=source.slice(source.indexOf(amendmentStart),source.indexOf(amendmentEnd));
 const amendmentExpected=JSON.parse(vm.runInNewContext(amendmentLiteral+'JSON.stringify(B1B2_AMENDMENTS);'));
 const amendmentClaims={},amendmentDocuments={};
 for(const [id,row]of Object.entries(amendmentExpected)){
  const line='- 2026-09-13 · Astra PM · Synthetic M2-B1-B2 amendment '+id+' · RULED';
  row.lineSha256=sha(line);
  for(const d of row.documents){const body='Synthetic authority document for '+id+' / '+d.file+'\n';amendmentDocuments[d.file]=body;d.sha256=sha(body);write(d.file,body);}
  amendmentClaims[id]={claim:{ledgerLine:4+Object.keys(amendmentClaims).length,role:'Astra PM',line,lineSha256:row.lineSha256},documents:row.documents};
 }
 assert.equal(Object.keys(amendmentClaims).length,5);assert.equal(Object.keys(amendmentDocuments).length,6);
 const amendmentLedger=receiptLine+'\n'+handLine+'\n'+rule+'\n'+Object.values(amendmentClaims).map(r=>r.claim.line).join('\n')+'\n';
 write('rebuild/DECISIONS.md',amendmentLedger);const amendmentsAdmitted=commit();
 const expected={...ACTUAL_PARENT,sha256:sha(artifactBytes),reviewSha256:sha(reviewBytes),reviewedCommit,receiptBase,receiptLineSha256:sha(receiptLine)};
 const option={id:'H3',artifact,sha256:expected.sha256,review,reviewSha256:expected.reviewSha256,receiptLedgerLine:187,note:'Synthetic unit fixture'};
 const s={packageId:'M2-B1-B2',sourceBase,parent:{decided:true,chosen:'H3',options:[option]},product:{},children:[],brief:{file:'rebuild/lanes/b/synthetic-brief.md',acceptedLedgerLine:{}},
   coverage:{inherited:{},moves:{},successors:null,superseded:{rulingLineSha256:sha(rule),gates:{}},repairedWitnesses:approvedRows()},
   dIds:H3.dIds,laws:{},carriedAcceptedIds:[],privateLiveTriggered:[],carrierSuccessor:null,witnessFlips:[],protectedSurfaces:[],authorizations:{...(id==='B1-B2'?{amendments:structuredClone(amendmentClaims)}:{})},artifact:{}};
 const files={};
 function child(name,file,needle){const body='// synthetic child declaration, never native evidence\n';write(file,body);files[file]=body;s.product[file]={pre:null,post:sha(body),role:'new'};s.children.push({name,argv:[file],needle});return name;}
 const legacy=child('current-legacy','rebuild/m4/workout/test/synthetic-legacy.cjs','synthetic legacy');
 const writers=child('current-writers','rebuild/m4/workout/test/synthetic-writers.cjs','synthetic writers');
 const census=child('current-census','rebuild/m4/workout/test/synthetic-census.cjs','synthetic census');
 // Three frozen witnesses plus one fixture engine module lie outside current product.
 const engine=child('current-engine','rebuild/m4/workout/test/synthetic-engine.cjs','4 rebuild/engine files byte-identical');
 for(const family of Object.keys(families)){const red=child('current-'+family,'rebuild/m4/workout/test/synthetic-'+family+'.cjs','synthetic '+family);s.coverage.superseded.gates[family]={why:'New independently executed synthetic tooling evidence.',evidence:{laws:null,redFirst:[red],legacyDifferential:legacy,writersDifferential:writers,engineFilesDifferential:engine,census}};}
 const carrierBytes='const REPAIRED_MODES = '+JSON.stringify(modes)+';\n// declaration fixture only; no witness execution claimed\n';
 write(carrier,carrierBytes);s.product[carrier]={pre:null,post:sha(carrierBytes),role:'new'};
 for(const [gate,row]of Object.entries(s.coverage.repairedWitnesses)){const [,cases,substitutions]=witnessPins[gate];s.children.push({name:row.child,argv:[carrier,row.mode],needle:'B1B2 REPAIRED WITNESS '+gate+': '+cases+' cases; '+substitutions+' substitutions; original SHA256 '+row.sha256});}
  write('rebuild/engine/test/b1-unknown-recovery.test.cjs','// argv fixture\n');
  s.product['rebuild/engine/test/b1-unknown-recovery.test.cjs']={pre:null,post:sha('// argv fixture\n'),role:'new'};
 for(const name of ['b2-public-source-faults.test.cjs','b2-era30.test.cjs']) {
  const file='rebuild/engine/test/'+name;write(file,'// argv fixture\n');
  s.product[file]={pre:null,post:sha('// argv fixture\n'),role:'new'};
 }
 write('rebuild/lanes/b/b2-delta-cells.cjs','// argv fixture\n');
 for(const name of ['astra-issuer-compatibility','product-phase-and-ledger','seal-tip-and-byte-identity','gate-supersession','pinned-unchanged-and-ruled-substitutions','parent-pin-shapes-and-spec-successors','git-blob-pin-classes','b1b2-registration','superseded-parent-continuity'])write('rebuild/lanes/b/tooling/test/'+name+'.test.cjs','// argv fixture\n');
 commit();
 const identityEdits=[
  ['CHAIN_REF',"const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';","const CHAIN_REF = 'refs/heads/fixture-chain';"],
  ['PM_HANDOVER',source.match(/^const PM_HANDOVER = Object\.freeze\(.+\);$/m)[0],'const PM_HANDOVER = Object.freeze('+JSON.stringify(handover)+');'],
  ['B1B2_PARENT',source.match(/^const B1B2_PARENT = Object\.freeze\(.+\);$/m)[0],'const B1B2_PARENT = Object.freeze('+JSON.stringify(expected)+');'],
  ['B1B2_SUPERSESSION_LINE',source.match(/^const B1B2_SUPERSESSION_LINE = '.+';$/m)[0],"const B1B2_SUPERSESSION_LINE = '"+sha(rule)+"';"],
  ['B1B2_AMENDMENTS',amendmentLiteral,amendmentStart+'Object.freeze('+JSON.stringify(amendmentExpected)+');\n'],
 ];
 assert.deepEqual(identityEdits.map(r=>r[0]),['CHAIN_REF','PM_HANDOVER','B1B2_PARENT','B1B2_SUPERSESSION_LINE','B1B2_AMENDMENTS']);
 let code=source;for(const [name,from,to]of identityEdits){assert.equal(code.split(from).length,2,name+' exact identity substitution');code=code.replace(from,to);}
 let inverse=code;for(const [name,from,to]of identityEdits.slice().reverse()){assert.equal(inverse.split(to).length,2,name+' exact inverse');inverse=inverse.replace(to,from);}
 assert.equal(inverse,source,'exactly five identity substitutions; no guard or function-body change');code=runnerEdit(code);
 write(runner,code);write('rebuild/lanes/b/tooling/packages/B1-B2.json','{}\n');
 const file=path.join(dir,runner),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(path.join(root,runner)));
 const originalRequire=m.require.bind(m);m.require=name=>originalRequire(path.isAbsolute(name)&&name.startsWith(dir+path.sep)?path.join(root,path.relative(dir,name)):name);
 const saved=process.argv;process.argv=[process.execPath,file,'--ci','--package',id];
 try{m._compile(code.slice(0,code.indexOf(boundary))+'\nmodule.exports={parentCoverage,repairedWitnesses,repairedWitnessOutput,b1b2Tap,childArgv,supersessionRuling,supersededSpecShape,supersededGates,supersededGateIds,supersededByCarrier,coverage,proposed,envelope,gates,R,GATE_IDS,init(){logDir=root;specRaw=Buffer.from("{}\\n");ARTIFACT="rebuild/m4/spec/absent.json";REVIEW="rebuild/m4/spec/absent-review.json";}};',file);}finally{process.argv=saved;}
 const api=m.exports;api.init();
 const bound={option,acceptance:old,reviewedCommit,receiptBase,decided:true};
  const ran=id==='B1-B2'?new Map(s.children.map(c=>[c.name,{ok:true,targets:api.childArgv(c)}])):new Map();
  if(id==='B1-B2')for(const[gate,row]of Object.entries(s.coverage.repairedWitnesses)){const[,cases,substitutions]=witnessPins[gate];Object.assign(ran.get(row.child),{repairedWitness:gate,originalCases:cases,originalSha256:row.sha256,substitutions});}
 return{dir,git,write,commit,sourceBase,s,bound,ran,api,rule,option,receiptLine,handLine,reviewBytes,artifactBytes,amendmentClaims,amendmentDocuments,amendmentExpected,amendmentLedger,amendmentsAdmitted};
}
test.after(()=>{for(const dir of scratches){const resolved=fs.realpathSync(dir);assert.equal(path.dirname(resolved),fs.realpathSync(temp));assert(path.basename(resolved).startsWith('b1b2-continuity-'));fs.rmSync(resolved,{recursive:true,force:true});}});

test('real 187 artifact/review identities and empty old byChild remain immutable',()=>{
 assert.equal(sha(fs.readFileSync(path.join(root,ACTUAL_PARENT.artifact))),ACTUAL_PARENT.sha256);
 assert.equal(sha(fs.readFileSync(path.join(root,ACTUAL_PARENT.review))),ACTUAL_PARENT.reviewSha256);
 assert.deepEqual(H3.coverage.byChild,{});assert.deepEqual(H3.coverage.covered,[]);
 assert.equal(H3.coverage.superseded.length,9);assert.equal(H3.coverage.run.length,10);
});
test('one actual reader derives all nine H3 superseded gates without changing parent bytes',()=>{
 const f=fixture(),map=f.api.parentCoverage(f.s,f.bound);assert.equal(Object.keys(map).length,9);
 assert.deepEqual(f.api.supersededGateIds(f.s,f.bound),H3.coverage.superseded);
 assert.deepEqual(f.api.supersededByCarrier(f.s,f.bound),families);
 assert.equal(fs.readFileSync(path.join(f.dir,f.option.artifact),'utf8'),f.artifactBytes);
});
for(const[name,edit,code]of[
 ['missing family',a=>delete a.coverage.supersededByCarrier['second-gate'],/FAMILY-GATE-GROUPS/],
 ['gate in wrong family',a=>a.coverage.supersededByCarrier['second-gate']=['selftest'],/FAMILY-GATE-GROUPS/],
 ['duplicate gate',a=>a.coverage.supersededByCarrier['source-carriers'].push('merge-source'),/FAMILY-GATE-GROUPS/],
 ['missing supersession record',a=>delete a.coverage.supersessions.gates['second-gate'],/SUPERSESSION-FAMILIES/],
 ['contradictory covered map',a=>a.coverage.covered=['second-gate'],/COVERED-MUST-STAY-EMPTY/],
 ['contradictory byChild',a=>a.coverage.byChild={'second-gate':'second-gate'},/BYCHILD-MUST-STAY-EMPTY/],
 ['missing original gate',a=>a.gates.pop(),/ORIGINAL-GATES/],
 ['missing original dispatch',a=>a.coverage.run.pop(),/RUN-PARTITION/],
 ['missing parent execution pin',a=>delete a.executionPins[a.children[0].argv.at(-1)],/CHILD-UNPINNED/],
 ['wrong parent execution pin',a=>a.executionPins[a.children[0].argv.at(-1)]='0'.repeat(64),/CHILD-SOURCE-PIN/],
 ['wrong historical ruling',a=>a.coverage.supersessions.rulingLineSha256='0'.repeat(64),/HISTORICAL-SUPERSESSION/],
])test('parent provenance refuses '+name,()=>{const f=fixture({parentEdit:edit});assert.throws(()=>f.api.parentCoverage(f.s,f.bound),code);});
test('unchanged parent proof is re-read after artifact, review, or chain ruling withdrawal',()=>{
 const f=fixture();f.api.parentCoverage(f.s,f.bound);
 f.write(f.option.artifact,f.artifactBytes+' ');assert.throws(()=>f.api.parentCoverage(f.s,f.bound),/PARENT-ARTIFACT-BYTES/);f.write(f.option.artifact,f.artifactBytes);
 f.write(f.option.review,f.reviewBytes+' ');assert.throws(()=>f.api.parentCoverage(f.s,f.bound),/PARENT-REVIEW-BYTES/);f.write(f.option.review,f.reviewBytes);
 f.write('rebuild/DECISIONS.md',f.receiptLine+'\n'+f.handLine+'\n');f.commit();assert.throws(()=>f.api.parentCoverage(f.s,f.bound),/RULING-LINE-SHA256-NOT-A-UNIQUE/);
});
for(const role of ['cowork','Astra reviewer','Astra','owner'])test('current grant refuses wrong issuer '+role,()=>{
 const f=fixture({ruleEdit:s=>s.replace(' · Astra PM · ',' · '+role+' · ')});assert.throws(()=>f.api.supersessionRuling(f.s),/PM-ISSUER|PM-COWORK/);
});
test('old H3 token cannot authorize current B1-B2',()=>{
 const f=fixture();f.s.coverage.superseded.rulingLineSha256=H3.coverage.supersessions.rulingLineSha256;
 assert.throws(()=>f.api.supersessionRuling(f.s),/RULING-LINE-SHA256|CURRENT-RULING/);
});
test('current five-family evidence needs each actual target and green result',()=>{
 const f=fixture();assert.equal(f.api.supersededGates(f.s,f.bound,f.ran).size,9);
 for(const row of Object.values(f.s.coverage.superseded.gates)){const name=row.evidence.redFirst[0],saved=f.ran.get(name);f.ran.delete(name);assert.throws(()=>f.api.supersededGates(f.s,f.bound,f.ran),/CHILD-NOT-EXECUTED/);f.ran.set(name,{...saved,ok:false});assert.throws(()=>f.api.supersededGates(f.s,f.bound,f.ran),/CHILD-NOT-GREEN/);f.ran.set(name,saved);}
 const target=f.s.children[0].argv[0];f.write(target,'changed current child\n');assert.throws(()=>f.api.supersededGates(f.s,f.bound,f.ran),/CURRENT-EVIDENCE-DISK/);
});
test('final accounting and actual gate-dispatch loop are nine plus three plus seven',()=>{
 const f=fixture(),covered=f.api.coverage(f.s,f.bound,f.ran);assert.deepEqual([...covered.keys()].sort(),Object.keys(witnessPins).sort());
 const artifact=f.api.proposed(f.s,f.bound);assert.equal(artifact.coverage.superseded.length,9);assert.equal(artifact.coverage.covered.length,3);assert.equal(artifact.coverage.run.length,7);
 assert.deepEqual(artifact.coverage.repairedWitnesses,f.s.coverage.repairedWitnesses);
 const called=[],original=f.api.R.gateRun;f.api.R.gateRun=(r,b,g)=>called.push(g[0]);
 try{f.api.gates(null,false,covered,f.ran);}finally{f.api.R.gateRun=original;}
 assert.deepEqual(called.slice().sort(),artifact.coverage.run);
 assert.deepEqual([...artifact.coverage.covered,...artifact.coverage.superseded,...called].sort(),f.api.GATE_IDS.slice().sort());
});
test('repair reader binds exact original, approved substitutions, mode and source ownership',()=>{
 const f=fixture();assert.equal(f.api.repairedWitnesses(f.s,f.ran).size,3);
 const row=f.s.coverage.repairedWitnesses['witnesses-1'];
 for(const[key,bad,code]of[['sha256','0'.repeat(64),/REPAIRED-SHA256/],['mode','--witness-3',/REPAIRED-MODE/],['original','rebuild/engine/test/defect-witnesses-3.cjs',/REPAIRED-ORIGINAL/]]){const saved=row[key];row[key]=bad;assert.throws(()=>f.api.repairedWitnesses(f.s,f.ran),code);row[key]=saved;}
 const saved=row.substitutions[0][1];row.substitutions[0][1]='assert.ok(true);';assert.throws(()=>f.api.repairedWitnesses(f.s,f.ran),/APPROVED-SUBSTITUTIONS/);row.substitutions[0][1]=saved;
 f.s.coverage.inherited['witnesses-1']=row.child;assert.throws(()=>f.api.repairedWitnesses(f.s,f.ran),/DUPLICATE-CREDIT/);delete f.s.coverage.inherited['witnesses-1'];
 f.ran.get(row.child).originalCases=0;assert.throws(()=>f.api.repairedWitnesses(f.s,f.ran),/EXECUTION-MISSING/);
});
test('repair stdout parser refuses missing original cases or full original terminal',()=>{
 const f=fixture();for(const[gate,[,cases]]of Object.entries(witnessPins)){
  const row=f.s.coverage.repairedWitnesses[gate],child=f.s.children.find(c=>c.name===row.child),tag=gate==='witnesses-1'?'':' '+gate.slice(-1);
  const old='DEFECT WITNESSES'+tag+': '+cases+'/'+cases+' reproduced; behavior intentionally unchanged';
  const out=Array.from({length:cases},(_,i)=>'REPRODUCED synthetic parser case '+i).join('\n')+'\n'+old+'\n'+child.needle+'\n';
  assert.equal(f.api.repairedWitnessOutput(f.s,child,out).originalCases,cases);
  for(const bad of [child.needle+'\n',out.replace(old,'missing original'),out.replace('REPRODUCED ','omitted '),out+'trailing claim\n',out+child.needle+'\n'])assert.throws(()=>f.api.repairedWitnessOutput(f.s,child,bad),/B1B2-REPAIRED/);
 }
});
test('closed argv modes return only actual targets and reject every other combination',()=>{
 const f=fixture();for(const mode of ['--public-laws','--witness-1','--witness-3','--witness-4'])assert.deepEqual(f.api.childArgv({name:'mode',argv:[carrier,mode]}),[carrier]);
 const unknown='rebuild/engine/test/b1-unknown-recovery.test.cjs';for(const mode of ['--audit-mutations','--audit-historical-mutations'])assert.deepEqual(f.api.childArgv({name:'audit',argv:[unknown,mode]}),[unknown]);
 for(const file of ['rebuild/engine/test/b2-public-source-faults.test.cjs','rebuild/engine/test/b2-era30.test.cjs']) {
  assert.deepEqual(f.api.childArgv({name:'audit',argv:[file,'--audit-mutations']}),[file]);
  assert.deepEqual(f.api.childArgv({name:'cells',argv:['--test','--test-reporter=tap',file]}),[file]);
  for(const mode of ['--audit-historical-mutations','--public-laws','--witness-1'])assert.throws(()=>f.api.childArgv({name:'bad',argv:[file,mode]}),/CHILD-ARGV/);
 }
 for(const argv of [[carrier,'--witness-2'],[carrier,'--eval=x'],['--test',carrier,'--witness-1'],[unknown,'--public-laws'],[carrier,'--witness-1','--witness-3'],['rebuild/lanes/b/tooling/b-package.cjs'],['rebuild/lanes/b/unlisted.cjs']])assert.throws(()=>f.api.childArgv({name:'bad',argv}),/CHILD-ARGV/);
 assert.deepEqual(f.api.childArgv({name:'B2',argv:['rebuild/lanes/b/b2-delta-cells.cjs']}),['rebuild/lanes/b/b2-delta-cells.cjs']);
});
test('older package argv and byChild readers keep their old semantics',()=>{
 const f=fixture({id:'H3'});assert.deepEqual(f.api.parentCoverage({},f.bound),{});
 assert.throws(()=>f.api.childArgv({name:'old',argv:[carrier,'--witness-1']}),/CHILD-ARGV/);
 assert.throws(()=>f.api.childArgv({name:'old',argv:['rebuild/lanes/b/b2-delta-cells.cjs']}),/CHILD-ARGV/);
 for(const file of ['rebuild/engine/test/b2-public-source-faults.test.cjs','rebuild/engine/test/b2-era30.test.cjs'])assert.throws(()=>f.api.childArgv({name:'old',argv:[file,'--audit-mutations']}),/CHILD-ARGV/);
});
// Guard removal must change an otherwise runnable refusal into an admission.
// Malformed repository construction or a different downstream refusal is not a kill.
for(const[name,edit,guard,refusal]of[
 ['covered map',a=>a.coverage.covered=['second-gate'],"  assert.deepEqual(c.covered, [], 'B1B2-PARENT-COVERED-MUST-STAY-EMPTY');",/COVERED-MUST-STAY-EMPTY/],
 ['byChild map',a=>a.coverage.byChild={'second-gate':'second-gate'},"  assert.deepEqual(c.byChild, {}, 'B1B2-PARENT-BYCHILD-MUST-STAY-EMPTY');",/BYCHILD-MUST-STAY-EMPTY/],
 ['original gate inventory',a=>a.gates.pop(),"  assert.deepEqual(a.gates, GATE_IDS.slice().sort(), 'B1B2-PARENT-ORIGINAL-GATES');",/ORIGINAL-GATES/],
 ['superseded agreement',a=>a.coverage.superseded.pop(),"  assert.deepEqual(c.superseded, Object.keys(gateMap).sort(), 'B1B2-PARENT-SUPERSEDED-MAP-AGREEMENT');",/SUPERSEDED-MAP-AGREEMENT/],
 ['remaining original dispatch',a=>a.coverage.run.pop(),"  assert.deepEqual(c.run, GATE_IDS.filter(g => !Object.hasOwn(gateMap, g)).sort(), 'B1B2-PARENT-RUN-PARTITION');",/RUN-PARTITION/],
 ['historical ruling',a=>a.coverage.supersessions.rulingLineSha256='0'.repeat(64),"  assert.equal(c.supersessions.rulingLineSha256, B1B2_PARENT.supersessionLineSha256, 'B1B2-PARENT-HISTORICAL-SUPERSESSION');",/HISTORICAL-SUPERSESSION/],
 ['family assignment',a=>{const c=a.coverage.supersededByCarrier;[c['second-gate'],c['writers-differential']]=[c['writers-differential'],c['second-gate']];},"  assert.deepEqual(c.supersededByCarrier, B1B2_FAMILIES, 'B1B2-PARENT-FAMILY-GATE-GROUPS');",/FAMILY-GATE-GROUPS/],
 ['parent source byte pin',a=>a.executionPins[a.children[0].argv.at(-1)]='0'.repeat(64),"    assert.equal(gitSha(fresh.reviewedCommit, target), a.executionPins[target], 'B1B2-PARENT-CHILD-SOURCE-PIN ' + target);",/CHILD-SOURCE-PIN/],
])test('source mutant removes '+name+' refusal and is detected',()=>{
 assert.equal(source.split(guard).length,2,'one actual guard');
 const original=fixture({parentEdit:edit});assert.throws(()=>original.api.parentCoverage(original.s,original.bound),refusal);
 const mutant=fixture({parentEdit:edit,runnerEdit:code=>code.replace(guard,'// synthetic guard-removal mutant')});
 assert.doesNotThrow(()=>mutant.api.parentCoverage(mutant.s,mutant.bound),'mutant loses precisely the runnable refusal');
});
test('actual historical byChild-only mechanism loses nine gates and is detected',()=>{
 const text="  if (ID !== 'B1-B2') return bound && bound.acceptance.coverage && bound.acceptance.coverage.byChild;";
 assert.equal(source.split(text).length,2);
 const mutant=fixture({runnerEdit:code=>code.replace(text,'  return bound && bound.acceptance.coverage && bound.acceptance.coverage.byChild;')});
 const map=mutant.api.parentCoverage(mutant.s,mutant.bound);assert.equal(Object.keys(map).length,0);
 assert.throws(()=>assert.equal(Object.keys(map).length,9),{code:'ERR_ASSERTION'});
});
test('wrong current execution targets and changed parent review are named refusals',()=>{
 const f=fixture();f.api.parentCoverage(f.s,f.bound);
 const old=f.bound.option.reviewSha256;f.bound.option.reviewSha256='0'.repeat(64);
 assert.throws(()=>f.api.parentCoverage(f.s,f.bound),/PARENT-EXACT-REVIEWSHA256/);f.bound.option.reviewSha256=old;
 const name=f.s.coverage.superseded.gates['second-gate'].evidence.redFirst[0];
 f.ran.get(name).targets=['rebuild/m4/workout/test/synthetic-legacy.cjs'];
 assert.throws(()=>f.api.supersededGates(f.s,f.bound,f.ran),/CURRENT-EVIDENCE-EXECUTABLES/);
});
test('extra repaired gate, duplicate mode, empty child and terminal receipt drift refuse',()=>{
 const f=fixture(),row=f.s.coverage.repairedWitnesses['witnesses-1'];
 f.s.coverage.repairedWitnesses['witnesses-2']=structuredClone(row);assert.throws(()=>f.api.repairedWitnesses(f.s),/CLOSED-GATES/);delete f.s.coverage.repairedWitnesses['witnesses-2'];
 const child=f.s.children.find(c=>c.name===row.child);f.s.children.push({...child,name:'duplicate'});assert.throws(()=>f.api.repairedWitnesses(f.s),/DUPLICATE-EXECUTION/);f.s.children.pop();
 const result=f.ran.get(row.child);f.ran.delete(row.child);assert.throws(()=>f.api.repairedWitnesses(f.s,f.ran),/EXECUTION-MISSING/);f.ran.set(row.child,result);
 const old=f.s.product[carrier].post;f.write(carrier,'changed owned carrier\n');assert.throws(()=>f.api.repairedWitnesses(f.s,f.ran),/CARRIER-DISK/);
 assert.equal(f.s.product[carrier].post,old);
});
test('actual TAP reader refuses zero, omitted, skipped, cancelled, duplicate or truncated evidence',()=>{
 const f=fixture(),child={name:'TAP unit parser',argv:['--test','synthetic.cjs'],needle:'# pass 3'};
 const good='# tests 3\n# suites 0\n# pass 3\n# fail 0\n# cancelled 0\n# skipped 0\n# todo 0\n';
 f.api.b1b2Tap(child,good);
 for(const bad of [good.replace('# tests 3','# tests 2'),good.replace('# pass 3','# pass 0'),good.replace('# skipped 0','# skipped 1'),good.replace('# cancelled 0','# cancelled 1'),good.replace('# fail 0','# fail 1'),good.replace('# todo 0','# todo 1'),good.replace('# tests 3\n',''),good+'# pass 3\n'])assert.throws(()=>f.api.b1b2Tap(child,bad),/B1B2-TAP/);
 assert.throws(()=>f.api.b1b2Tap({...child,needle:'# pass 0'},good),/EXACT-PASS-COUNT/);
});
