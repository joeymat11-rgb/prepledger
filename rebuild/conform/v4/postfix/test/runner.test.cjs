'use strict';
// Synthetic repositories only. No D-ID is approved/fixed by these fixtures.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const T=require('../target.cjs'),L=require('../legacy-gates.cjs'),R=require('../run.cjs');
const root=path.resolve(__dirname,'../../../../..');
const parent=path.join(root,'.tmp/postfix/tests');fs.mkdirSync(parent,{recursive:true});
const scratch=fs.mkdtempSync(path.join(parent,'synthetic-'));
test.after(()=>{assert.ok(scratch.startsWith(parent+path.sep));fs.rmSync(scratch,{recursive:true,force:true});});
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../manifest.json')));
const clone=x=>structuredClone(x),throws=(fn,code)=>assert.throws(fn,e=>e.code===code);
function fixture(name,body) {
  const dir=path.join(scratch,name);fs.mkdirSync(dir,{recursive:true});
  const index='const mod=require("./guard.cjs"); exports.createEngine=({clock,ids,drafts})=>{const E={};Object.assign(E,mod(E,{clock,ids,drafts}));return {__test:E};};\n';
  const guard=body||'module.exports=(E,{clock,ids,drafts})=>{function guard(x){return x>=0&&x<=10;}function host(x){return E.guard(x);}function sample(){return [clock.today(),ids.fresh("x"),drafts.length];}return {guard,host,sample,SEED:{value:0}};};\n';
  fs.writeFileSync(path.join(dir,'index.cjs'),index);fs.writeFileSync(path.join(dir,'guard.cjs'),guard);
  return {candidate:dir,inventory:{'index.cjs':T.sha(index),'guard.cjs':T.sha(guard)}};
}
const good=fixture('good');
const caseFile=path.join(scratch,'cases.cjs');
fs.writeFileSync(caseFile,'exports.laws=[{id:"synthetic-range",implementation:"PRESENT",run(target){const E=target.engine(),checks=[["below-refused",E.host(-1)===false],["inside-accepted",E.host(5)===true],["above-refused",E.host(11)===false]];const assertions=checks.map(([id,ok])=>({id,ok}));return {ok:assertions.every(x=>x.ok),assertions};}}];\n');
const expected=['below-refused','inside-accepted','above-refused'].map(id=>({id,count:1}));
const caseInput={kind:'direct',caseFile,caseSha256:T.sha(fs.readFileSync(caseFile)),lawId:'synthetic-range',mode:'native',day:'2026-09-03'};
function fault(id,from,to,failures,declaration='guard') {
  const before=fs.readFileSync(path.join(good.candidate,'guard.cjs'),'utf8');
  return {id,file:'guard.cjs',declaration,preimageHash:T.sha(before),preimage:from,postimage:to,postimageHash:T.sha(before.replace(from,to)),expectedFailures:failures};
}
test('real manifest is BASELINE with 45 unruled IDs and empty approved selection',()=>{R.validate(manifest);assert.equal(manifest.inventory.length,45);assert.deepEqual(manifest.requiredIds,['D33','D34','D35']);assert.deepEqual(manifest.selectedApprovedFixIds,[]);});
for(const [name,mutate,code] of [
  ['missing D-ID',m=>m.inventory.pop(),'D-INVENTORY'],
  ['duplicate D-ID',m=>m.inventory[1]=clone(m.inventory[0]),'D-INVENTORY'],
  ['empty planned required IDs',m=>m.requiredIds=[],'PHASE-OR-REQUIRED-INVENTORY'],
  ['duplicate required ID',m=>m.requiredIds=['D33','D33','D35'],'PHASE-OR-REQUIRED-INVENTORY'],
  ['unknown phase',m=>m.phase='PASS','PHASE-OR-REQUIRED-INVENTORY'],
  ['unknown manifest version',m=>m.version=2,'PHASE-OR-REQUIRED-INVENTORY'],
  ['unapproved PRESENT',m=>m.inventory[32].implementation='PRESENT','DISPOSITION-IMPLEMENTATION'],
  ['invented disposition',m=>m.inventory[32].disposition='AUTOMATIC-FIX','DISPOSITION-IMPLEMENTATION'],
  ['missing dependency',m=>m.inventory[32].dependencies=['D46'],'DEPENDENCY-INVENTORY'],
  ['duplicate dependency',m=>m.inventory[32].dependencies=['D34','D34'],'DEPENDENCY-INVENTORY'],
  ['dependency cycle',m=>m.inventory[32].dependencies=['D33'],'DEPENDENCY-CYCLE'],
  ['missing non-D finding',m=>m.nonD.pop(),'NON-D-INVENTORY'],
  ['extra non-D finding cannot enter version1',m=>m.nonD.push({id:'later-invented'}),'NON-D-INVENTORY'],
  ['non-D falsely completed',m=>m.nonD[0].status='DONE','NON-D-INVENTORY'],
  ['missing legacy gate',m=>m.gates.pop(),'GATE-INVENTORY'],
  ['omitted clock mode',m=>m.matrix.pop(),'MODE-CLOCK-INVENTORY'],
  ['wildcard source exception',m=>m.inventory[32].sourceDeltas=[{file:'*.cjs',declaration:'guard'}],'WILDCARD-SOURCE-EXEMPTION'],
  ['altered frozen pin',m=>m.baseline.frozenBlob='0'.repeat(40),'BASELINE-PIN'],
  ['self-approved selection',m=>m.selectedApprovedFixIds=['D33'],'SELECTED-APPROVAL-MISMATCH'],
  ['unknown top field',m=>m.skipFailures=true,'MANIFEST-SCHEMA']
])test('schema refuses '+name,()=>{const m=clone(manifest);mutate(m);throws(()=>R.validate(m),code);});
test('PACKAGE remains blocked with no owner disposition or actual theme cases',()=>{const m=clone(manifest);m.phase='PACKAGE';R.validate(m);const reasons=R.packagePending(m,{});assert.ok(reasons.some(x=>x.includes('D33 requires')));assert.ok(reasons.some(x=>x.includes('not implemented')));});
test('PACKAGE required KEEP/DEFER/PENDING cannot close repairs',()=>{for(const disposition of ['KEEP','DEFER','APPROVED-FIX']){const m=clone(manifest);m.phase='PACKAGE';m.inventory[32].disposition=disposition;m.selectedApprovedFixIds=disposition==='APPROVED-FIX'?['D33']:[];R.validate(m);const r=R.packagePending(m,{});assert.ok(r.some(x=>x.includes('D33 requires')));assert.ok(r.some(x=>x.includes('owner disposition receipt missing')));}});
test('PACKAGE missing implemented dependency remains pending',()=>{const m=clone(manifest);m.phase='PACKAGE';m.inventory[32].dependencies=['D34'];assert.ok(R.packagePending(m,{}).some(x=>x.includes('dependency D34 pending')));});
for(const args of [[],['--manifest'],['--unknown','x'],['--manifest','x','--manifest','y'],['--manifest','x','--baseline','x','--candidate','x','--skip-gates','yes']])test('unknown/missing/repeated options refuse '+JSON.stringify(args),()=>throws(()=>R.parse(args),'OPTIONS'));
const repo=path.join(scratch,'receipt-repo');fs.mkdirSync(path.join(repo,'rebuild'),{recursive:true});
const owner='- synthetic · owner · D33 APPROVED-FIX; synthetic fixture only';
const other='- synthetic · owner · D34 KEEP; synthetic fixture only';
fs.writeFileSync(path.join(repo,'rebuild/DECISIONS.md'),owner+'\n'+other+'\n');
function git(args){return cp.execFileSync('git',args,{cwd:repo,encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();}
git(['init','-q']);git(['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','add','.']);git(['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','-qm','Synthetic receipts']);
const commit=git(['rev-parse','HEAD']);const receipt={commit,path:'rebuild/DECISIONS.md',lineSha256:T.sha(owner),line:owner};
test('authorization proves exact line at git candidateBase',()=>assert.equal(L.verifyReceipt(repo,commit,receipt,{role:'owner',mentions:['D33','APPROVED-FIX']}),true));
test('existing file does not prove nonexistent authorization',()=>throws(()=>L.verifyReceipt(repo,commit,{...receipt,line:owner+' invented',lineSha256:T.sha(owner+' invented')}),'RECEIPT-EXACT-LINE-MISSING'));
test('wrong actual disposition line is rejected',()=>throws(()=>L.verifyReceipt(repo,commit,{...receipt,line:other,lineSha256:T.sha(other)},{role:'owner',mentions:['D33','APPROVED-FIX']}),'RECEIPT-CONTENT'));
test('cowork receipt cannot substitute for owner',()=>throws(()=>L.verifyReceipt(repo,commit,receipt,{role:'cowork'}),'RECEIPT-ROLE'));
test('later working-tree append cannot invent a committed receipt',()=>{const invented=owner+' after commit';fs.appendFileSync(path.join(repo,'rebuild/DECISIONS.md'),invented+'\n');throws(()=>L.verifyReceipt(repo,commit,{...receipt,line:invented,lineSha256:T.sha(invented)}),'RECEIPT-EXACT-LINE-MISSING');});
test('wrong citation commit is rejected',()=>throws(()=>L.verifyReceipt(repo,'0'.repeat(40),receipt),'RECEIPT-SCHEMA'));
test('current-base merge ancestry is checked, not just an ancestor existing',()=>{git(['update-ref','refs/remotes/origin/rebuild/t2-client-core',commit]);L.verifyBase(repo,commit);fs.writeFileSync(path.join(repo,'next.txt'),'synthetic');git(['add','.']);git(['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','-qm','Synthetic later integration']);const later=git(['rev-parse','HEAD']);git(['update-ref','refs/remotes/origin/rebuild/t2-client-core',later]);throws(()=>L.verifyBase(repo,commit),'CANDIDATE-BASE-STALE');L.verifyBase(repo,later);});
test('wrong source and missing source refuse',()=>{throws(()=>L.checkSources(repo,commit,{'rebuild/DECISIONS.md':'0'.repeat(64)},{disk:false}),'GIT-SOURCE-PIN');assert.throws(()=>L.checkSources(repo,commit,{'missing.cjs':'0'.repeat(64)},{disk:false}));});
test('candidate cannot import another directory or audit controls',()=>{const x=fixture('redirect','module.exports=require("../good/guard.cjs");');throws(()=>T.loadCandidate(x.candidate,x.inventory),'CANDIDATE-IMPORT-OUTSIDE-INVENTORY');});
test('candidate cannot import builtins as reference escape',()=>{const x=fixture('builtin','module.exports=require("node:fs");');throws(()=>T.loadCandidate(x.candidate,x.inventory),'CANDIDATE-IMPORT-OUTSIDE-INVENTORY');});
test('candidate file hash and missing module are enforced',()=>{throws(()=>T.loadCandidate(good.candidate,{...good.inventory,'guard.cjs':'0'.repeat(64)}),'CANDIDATE-SOURCE-PIN');throws(()=>T.loadCandidate(good.candidate,{'index.cjs':good.inventory['index.cjs']}),'CANDIDATE-IMPORT-OUTSIDE-INVENTORY');});
test('candidate exposing repair-control state is rejected',()=>{const x=fixture('control','module.exports=()=>({__auditOriginal:{},guard:()=>true});');throws(()=>T.createTarget(x).engine(),'REPAIR-CONTROL-TARGET');});
test('direct calls use actual internal E graph in a fresh child',()=>{const r=T.runRaw({...caseInput,...good});assert.deepEqual(L.assertions(r,expected),[]);assert.deepEqual(r.frames.map(f=>f.name),['host','host','host']);});
test('a different explicit candidate is actually executed',()=>{const x=fixture('wrong-answer','module.exports=()=>({host:()=>true});');const r=T.runRaw({...caseInput,...x});assert.deepEqual(L.assertions(r,expected),['above-refused','below-refused']);});
test('empty-output candidate cannot earn equality-only GREEN',()=>{const x=fixture('empty','module.exports=()=>({host:()=>undefined});');const r=T.runRaw({...caseInput,...x});assert.equal(L.assertions(r,expected).length,3);});
test('missing capability is a harness error, never a detected fault',()=>{const x=fixture('missing','module.exports=()=>({});');throws(()=>T.runRaw({...caseInput,...x}),'RAW-CHILD-HARNESS-ERROR');});
test('B forms, clock mutation, nondefault day and separate instances',()=>{const b=T.createTarget(good).legacy,c=b.clock('2026-10-02'),a=b.engine(c),d=b.engine(c);const before=a.sample();c.set('2026-10-03');assert.equal(a.sample()[0],'2026-10-03');assert.equal(b.engine('2026-09-07').sample()[0],'2026-09-07');assert.equal(b.engine().sample()[0],'2026-09-03');assert.equal(before[2],0);assert.notEqual(a.SEED,d.SEED);assert.equal(d.sample()[1],T.ids(c).fresh('x'));});
test('all old B adapter forms execute unchanged in fresh processes in both Date modes',()=>{
  const base=path.join(scratch,'legacy-shapes'),dir=path.join(base,'rebuild/conform/v4');fs.mkdirSync(dir,{recursive:true});
  fs.copyFileSync(path.join(root,'rebuild/conform/v4/helpers.cjs'),path.join(dir,'helpers.cjs'));
  const source='const run=B=>{const d=B.engine().sample(),s=B.engine("2026-10-02").sample(),c=B.clock("2026-10-03"),a=B.engine(c),b=B.engine(c),first=a.sample();c.set("2026-10-04");a.SEED.value=9;return {ok:d[0]==="2026-09-03"&&s[0]==="2026-10-02"&&first[0]==="2026-10-03"&&a.sample()[0]==="2026-10-04"&&b.SEED.value===0&&b.sample()[2]===0};};exports.laws=[{id:"synthetic-old-B",defect:"SYNTHETIC",run}];exports.INVENTORY=["synthetic-old-B"];';
  const file='rebuild/conform/v4/laws-shapes.cjs';fs.writeFileSync(path.join(base,file),source);
  const mod=require(path.join(base,file)),law={id:'synthetic-old-B',defect:'SYNTHETIC',file,fileSha256:T.sha(source),runSha256:T.sha(mod.laws[0].run.toString())};
  for(const mode of ['frozen','native'])assert.equal(T.runRaw({...good,baseline:base,law,mode,day:'2026-09-03'}).status,'GREEN');
});
test('new target options are not legacy day-string arguments',()=>throws(()=>T.createTarget(good).engine('2026-10-02'),'TARGET-OPTIONS'));
for(const [name,a,b]of [
  ['alias loss',(()=>{const a={x:1};return [a,a];})(),[{x:1},{x:1}]],
  ['key order',{a:1,b:2},{b:2,a:1}],
  ['undefined tag collision',undefined,{$undefined:true}],
  ['nonfinite tag collision',NaN,{$number:'NaN'}],
  ['extra field',{a:1},{a:1,b:2}],
  ['negative zero',0,-0]
])test('typed trace rejects '+name,()=>{assert.notDeepEqual(T.graphEncoder()(a),T.graphEncoder()(b));throws(()=>L.exactDelta(T.graphEncoder()(a),T.graphEncoder()(b),[]),'UNAPPROVED-DELTA');});
test('typed trace keeps cross-call identity and cycles',()=>{const encode=T.graphEncoder(),a={};a.self=a;const x=encode(a),y=encode({result:a});assert.equal(x[1],y[3][0][4][1]);assert.deepEqual(x[3][0][4],['ref',x[1]]);});
test('typed trace rejects an undeclared prototype',()=>assert.throws(()=>T.graphEncoder()(Object.create({a:1}))));
const green={status:'GREEN',assertions:expected.map(x=>({id:x.id,ok:true}))};
test('missing/skipped assertion refuses',()=>throws(()=>L.assertions({...green,assertions:green.assertions.slice(1)},expected),'ASSERTION-OCCURRENCE'));
test('duplicate assertion refuses',()=>throws(()=>L.assertions({...green,assertions:[...green.assertions,green.assertions[0]]},expected),'ASSERTION-OCCURRENCE'));
test('unknown assertion refuses',()=>throws(()=>L.assertions({...green,assertions:[...green.assertions,{id:'invented',ok:true}]},expected),'ASSERTION-UNKNOWN'));
test('inconsistent result.ok/observations refuses',()=>throws(()=>L.assertions({...green,status:'RED'},expected),'ASSERTION-VERDICT-INCONSISTENT'));
test('positive assertion inventory cannot be empty',()=>throws(()=>L.assertions(green,[]),'ASSERTION-INVENTORY'));
test('exact approved delta accounts both predicates',()=>assert.equal(L.exactDelta({value:1,keep:'bytes'},{value:2,keep:'bytes'},[{id:'synthetic-delta',path:['value'],before:1,after:2}]),true));
test('extra output drift refuses despite a matching delta',()=>throws(()=>L.exactDelta({value:1,keep:'bytes'},{value:2,keep:'changed'},[{id:'x',path:['value'],before:1,after:2}]),'UNAPPROVED-DELTA'));
test('overlapping deltas refuse',()=>throws(()=>L.exactDelta({a:{b:1}},{a:{b:2}},[{id:'x',path:['a'],before:{b:1},after:{b:2}},{id:'y',path:['a','b'],before:2,after:2}]),'DELTA-OVERLAP'));
test('unused delta refuses',()=>throws(()=>L.exactDelta({a:1},{a:1},[{id:'x',path:['a'],before:1,after:1}]),'DELTA-UNUSED-OR-PREDICATE'));
test('wildcard delta refuses',()=>throws(()=>L.exactDelta({a:1},{a:2},[{id:'x',path:['*'],before:1,after:2}]),'DELTA-PATH'));
test('actual on-disk faulty declaration executes and fails the intended assertion, then restores',()=>{const m=fault('synthetic-counts-only','return x>=0&&x<=10;','return x<=10;',['below-refused']);const r=L.faultRun({...good,scratch,mutant:m,caseInput,expected});assert.equal(r.status,'EFFECTIVE');assert.equal(r.restoredSha256,good.inventory['guard.cjs']);});
test('deny-all mutant is killed by a real positive control',()=>{const m=fault('synthetic-deny-all','return x>=0&&x<=10;','return false;',['inside-accepted']);assert.equal(L.faultRun({...good,scratch,mutant:m,caseInput,expected}).status,'EFFECTIVE');});
test('inert mutation earns no behavioral kill',()=>{const m=fault('synthetic-inert','return x>=0&&x<=10;','return x>=0&&x<=10; /* inert */',['inside-accepted']);throws(()=>L.faultRun({...good,scratch,mutant:m,caseInput,expected}),'MUTANT-INEFFECTIVE-OR-WRONG-FAILURE');});
test('invalid syntax mutant is a harness error',()=>{const m=fault('synthetic-syntax','return x>=0&&x<=10;','return ( ;',['inside-accepted']);throws(()=>L.faultRun({...good,scratch,mutant:m,caseInput,expected}),'RAW-CHILD-HARNESS-ERROR');});
test('unchanged mutation refuses before execution',()=>{const m=fault('synthetic-same','return x>=0&&x<=10;','return x>=0&&x<=10;',['inside-accepted']);throws(()=>L.faultRun({...good,scratch,mutant:m,caseInput,expected}),'MUTANT-PREIMAGE');});
test('unexecuted named declaration earns no kill',()=>{const m=fault('synthetic-wrong-site','return x>=0&&x<=10;','return false;',['inside-accepted'],'unreached');throws(()=>L.faultRun({...good,scratch,mutant:m,caseInput,expected}),'MUTANT-DECLARATION-NOT-EXECUTED');});
test('the real import guard cases remain declared PENDING, never control-patched',()=>{const mod=require('../laws/import-guards.cjs');assert.equal(mod.laws.length,3);for(const law of mod.laws){assert.equal(law.implementation,'PENDING');assert.ok(law.requiredCases.length);assert.ok(law.requiredMutants.length);assert.deepEqual(law.mutant,[]);throws(()=>law.run(),'THEME-CASES-PENDING');}});
