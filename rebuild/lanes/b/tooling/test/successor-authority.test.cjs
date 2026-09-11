'use strict';
// Public component controls only. No package acceptance artifact/envelope is made.
// Real runner functions and Node children; no source-body substitutions.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),Module=require('node:module'),cp=require('node:child_process'),crypto=require('node:crypto');
const sourceRoot=path.resolve(__dirname,'../../../../..');
const runnerRel='rebuild/lanes/b/tooling/b-package.cjs';
const policyRel='rebuild/lanes/b/tooling/b-ntc-successors.json';
const text=fs.readFileSync(path.join(sourceRoot,runnerRel),'utf8');
const delimiter='// ------------------------------------------------------------------ 8. main sequence';
assert.equal(text.split(delimiter).length,2);
const policy=JSON.parse(fs.readFileSync(path.join(sourceRoot,policyRel)));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const clone=o=>JSON.parse(JSON.stringify(o));
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'earned-successor-controls-'));
function write(root,f,bytes){const full=path.join(root,f);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,bytes);}
function git(root,...args){return cp.execFileSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();}
function init(root){fs.mkdirSync(root,{recursive:true});git(root,'init','--quiet');git(root,'config','user.name','Public control');git(root,'config','user.email','public-control@example.invalid');}
function commit(root){git(root,'add','rebuild/DECISIONS.md');git(root,'commit','--quiet','-m','Public authority fixture');return git(root,'rev-parse','HEAD');}
function api(root,source=text,exports="authority,childLedger,loadSuccessorPolicy,validateSuccessorDefinition,successorAuthorization,successorSupport,inheritedExecutable,children,coverage,acceptedOriginalChildren,MOVES_RULING",id="B-NTC"){
 const file=path.join(root,runnerRel),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(path.join(sourceRoot,runnerRel)));
 const normal=m.require.bind(m);m.require=f=>normal(path.isAbsolute(f)&&f.startsWith(root+path.sep)?path.join(sourceRoot,path.relative(root,f)):f);
 write(root,'rebuild/conform/v4/postfix/run.cjs',fs.readFileSync(path.join(sourceRoot,'rebuild/conform/v4/postfix/run.cjs')));
 const argv=process.argv;process.argv=[process.execPath,file,'--ci','--package',id];
 try{m._compile(source.slice(0,source.indexOf(delimiter))+'\nmodule.exports={'+exports+',init(){logDir='+JSON.stringify(scratch)+';}};',file);}finally{process.argv=argv;}
 m.exports.init();return m.exports;
}
const chain='refs/remotes/origin/rebuild/t2-client-core';
const ledgerRoot=path.join(scratch,'ledger-control');init(ledgerRoot);const fixtureBranch=git(ledgerRoot,'symbolic-ref','HEAD');
const citation=(line,role,commit)=>({ledgerLine:1,role,line,lineSha256:sha(line),...(commit?{commit}:{})});
const owner=citation('- public control · owner · M2-RULE fixture','owner');
const contract=citation('- public control · cowork · POSTFIX-GATE BRIEF fixture','cowork');
const initial=owner.line+'\n'+contract.line+'\n';write(ledgerRoot,'rebuild/DECISIONS.md',initial);const parentCommit=commit(ledgerRoot);
const themeLine='- public control · cowork · M2-B-NTC-NATIVE-TREND-CONTEXT B-NTC-SUCCESSORS '+sha(fs.readFileSync(path.join(sourceRoot,policyRel)))+' fixture';
const briefLine='- public control · cowork · M2-B-NTC-NATIVE-TREND-CONTEXT rebuild/control/BRIEF.md ACCEPTED';
write(ledgerRoot,'rebuild/DECISIONS.md',initial+themeLine+'\n'+briefLine+'\n');const childCommit=commit(ledgerRoot);git(ledgerRoot,'update-ref',chain,childCommit);
const bound={receiptBase:parentCommit,acceptance:{authorizations:{contract}}};
const spec={packageId:'M2-B-NTC-NATIVE-TREND-CONTEXT',authorizations:{owner,contract,theme:citation(themeLine,'cowork',childCommit)},brief:{file:'rebuild/control/BRIEF.md',acceptedLedgerLine:citation(briefLine,'cowork',childCommit)}};
const auth=api(ledgerRoot);
const baseline=api(ledgerRoot,cp.execFileSync('git',['show','c7b7133:'+runnerRel],{cwd:sourceRoot,encoding:'utf8',windowsHide:true}),'authority');
test('later child citations pass on fixed accepted chain; inherited owner/contract keep old anchor',()=>{
 assert.notEqual(parentCommit,childCommit);assert.throws(()=>baseline.authority(spec,bound),/RECEIPT-EXACT-LINE-MISSING/);assert.doesNotThrow(()=>auth.authority(spec,bound));assert.equal(auth.successorAuthorization(spec,bound),childCommit);
 const old=clone(spec);delete old.authorizations.theme.commit;assert.throws(()=>auth.authority(old,bound),/RECEIPT-EXACT-LINE-MISSING/);
 const legacy=clone(spec);legacy.authorizations.theme=null;legacy.brief.acceptedLedgerLine=null;assert.doesNotThrow(()=>auth.authority(legacy,bound));
});
test('wrong role/hash, absent line, arbitrary path and mutable anchor refuse',()=>{
 for(const mutate of [s=>s.authorizations.theme.role='owner',s=>s.authorizations.theme.lineSha256='0'.repeat(64),s=>{s.authorizations.theme.line+=' absent';s.authorizations.theme.lineSha256=sha(s.authorizations.theme.line);},s=>s.authorizations.theme.path='elsewhere.md',s=>s.authorizations.theme.commit='HEAD']){
  const s=clone(spec);mutate(s);assert.throws(()=>auth.authority(s,bound));
 }
 const mutated=clone(spec);mutated.authorizations.contract.line+=' changed';mutated.authorizations.contract.lineSha256=sha(mutated.authorizations.contract.line);assert.throws(()=>auth.authority(mutated,bound),/RECEIPT-EXACT-LINE-MISSING/);
});
test('local-only, unrelated and absent commits refuse; fixed remote chain is mandatory',()=>{
 write(ledgerRoot,'rebuild/DECISIONS.md',initial+themeLine+'\n'+briefLine+'\nlocal tail\n');const local=commit(ledgerRoot);
 const s=clone(spec);s.authorizations.theme.commit=local;assert.throws(()=>auth.authority(s,bound));
 const tree=git(ledgerRoot,'rev-parse',childCommit+'^{tree}');const unrelated=cp.execFileSync('git',['commit-tree',tree,'-m','Unrelated public fixture'],{cwd:ledgerRoot,encoding:'utf8',windowsHide:true}).trim();
 s.authorizations.theme.commit=unrelated;assert.throws(()=>auth.authority(s,bound));s.authorizations.theme.commit='f'.repeat(40);assert.throws(()=>auth.authority(s,bound));
 git(ledgerRoot,'update-ref',chain,parentCommit);assert.throws(()=>auth.authority(spec,bound));git(ledgerRoot,'update-ref',chain,childCommit);
 assert.doesNotThrow(()=>auth.authority(spec,bound));
});
test('unissued or wrong exact successor disposition refuses',()=>{
 const s=clone(spec);s.authorizations.theme=null;assert.throws(()=>auth.successorAuthorization(s,bound),/SUCCESSOR-PM-AUTHORITY-UNISSUED/);
 s.authorizations.theme=clone(spec.authorizations.theme);s.authorizations.theme.line=s.authorizations.theme.line.replace(/B-NTC-SUCCESSORS [a-f0-9]{64}/,'unissued candidate');s.authorizations.theme.lineSha256=sha(s.authorizations.theme.line);assert.throws(()=>auth.successorAuthorization(s,bound),/RECEIPT-EXACT-LINE-MISSING/);
 assert.equal(auth.MOVES_RULING,null);
});
test('policy bytes must match both fixed hash and committed Git bytes',()=>{
 const bytes=fs.readFileSync(path.join(sourceRoot,policyRel));write(ledgerRoot,policyRel,bytes);git(ledgerRoot,'add',policyRel);git(ledgerRoot,'commit','--quiet','-m','Public policy fixture');
 assert.deepEqual(auth.loadSuccessorPolicy(),policy);
 try{fs.appendFileSync(path.join(ledgerRoot,policyRel),' ');assert.throws(()=>auth.loadSuccessorPolicy(),/SUCCESSOR-POLICY-BYTES/);}finally{fs.writeFileSync(path.join(ledgerRoot,policyRel),bytes);}
 git(ledgerRoot,'update-ref','refs/heads/unpinned',childCommit);git(ledgerRoot,'symbolic-ref','HEAD','refs/heads/unpinned');
 assert.throws(()=>auth.loadSuccessorPolicy());git(ledgerRoot,'symbolic-ref','HEAD',fixtureBranch);
});
// Isolated source checkout containing public files ONLY. Reuse the local object store
// read-only to verify original commit pins; no ledger/private material is checked out.
const actual=path.join(scratch,'source-control');init(actual);
const common=git(sourceRoot,'rev-parse','--path-format=absolute','--git-common-dir');
write(actual,'.git/objects/info/alternates',path.join(common,'objects').replaceAll('\\','/')+'\n');
git(actual,'update-ref','refs/heads/control',policy.sourceCommit);git(actual,'symbolic-ref','HEAD','refs/heads/control');
git(actual,'update-ref',chain,git(sourceRoot,'rev-parse',chain));
const files=git(sourceRoot,'ls-tree','-r','--name-only',policy.sourceCommit,'--','rebuild','tools','src','scripts','app.js','index.html','manifest.webmanifest','package-lock.json','sw.js','package.json','.github/workflows/rebuild.yml').split('\n').filter(Boolean);
for(const file of files)assert(!file.startsWith('ledger/')&&!file.startsWith('rebuild/conform/private/'));
const archive=path.join(scratch,'public-source.tar');
fs.writeFileSync(archive,cp.execFileSync('git',['archive',policy.sourceCommit,'rebuild','tools','src','scripts','app.js','index.html','manifest.webmanifest','package-lock.json','sw.js','package.json','.github/workflows/rebuild.yml'],{cwd:sourceRoot,windowsHide:true,maxBuffer:64*1024*1024}));
cp.execFileSync('tar',['-xf',archive,'-C',actual],{windowsHide:true});
// Existing dependencies only, shared by a read-only directory junction. No install.
const known=process.env.B_NTC_SOURCE_ROOT||path.resolve(sourceRoot,'../astra-b-ntc');
for(const dep of ['node_modules','rebuild/m3/w6/node_modules','rebuild/m3/w5/node_modules']){
 const target=path.join(known,dep);if(fs.existsSync(target)){fs.mkdirSync(path.dirname(path.join(actual,dep)),{recursive:true});fs.symlinkSync(fs.realpathSync(target),path.join(actual,dep),'junction');}
}
const candidate=JSON.parse(fs.readFileSync(path.join(actual,'rebuild/lanes/b/tooling/packages/B-NTC.json')));
const option=candidate.parent.options.find(o=>o.id===candidate.parent.chosen);
const accepted=JSON.parse(fs.readFileSync(path.join(actual,option.artifact)));
const review=JSON.parse(fs.readFileSync(path.join(actual,option.review)));
const reviewedCommit=/POSTFIX-ACCEPTANCE \S+ ([a-f0-9]{40}) /.exec(review.receipt.line)[1];
const parentBound={option,acceptance:accepted,reviewedCommit,receiptBase:review.receipt.commit};
// Add only the exact public policy to the fixture's inherited tree; no receipt.
write(actual,policyRel,fs.readFileSync(path.join(sourceRoot,policyRel)));git(actual,'read-tree','HEAD');git(actual,'add',policyRel);git(actual,'commit','--quiet','-m','Public source-policy fixture');
const runner=api(actual);
test('exact candidate definition and complete original/child source closure verify',()=>{
 assert.equal(runner.validateSuccessorDefinition(candidate,parentBound,policy),policy);
 assert.equal(Object.keys(policy.coverage.inherited).length,9);assert.equal(policy.children.length,15);
 assert.throws(()=>runner.successorAuthorization(candidate,parentBound),/SUCCESSOR-PM-AUTHORITY-UNISSUED/);
});
test('map, package, parent, child target, original/source drift and altered policy refuse',()=>{
 for(const mutate of [s=>s.coverage.inherited['migrate-source']='second-gate',s=>s.coverage.moves.extra={child:'source-carriers'},s=>s.lanePackage='B1',s=>s.children[0].argv=['rebuild/m4/spec/b-ntc-witnesses.cjs'],s=>s.product['rebuild/m4/spec/b-ntc-successors.cjs'].post='0'.repeat(64)]){const s=clone(candidate);mutate(s);assert.throws(()=>runner.validateSuccessorDefinition(s,parentBound,policy));}
 const b=clone(parentBound);b.option.sha256='0'.repeat(64);assert.throws(()=>runner.validateSuccessorDefinition(candidate,b,policy));
 const p=clone(policy);p.sourceCommit='f'.repeat(40);assert.throws(()=>runner.validateSuccessorDefinition(candidate,parentBound,p),/SUCCESSOR-POLICY-DEFINITION/);
 for(const file of ['rebuild/m4/spec/native-carriers-profile.test.cjs','rebuild/m4/spec/b-ntc-successors.cjs','rebuild/m4/workout/engine-runtime.cjs']){const full=path.join(actual,file),bytes=fs.readFileSync(full);try{fs.appendFileSync(full,'\n// public control drift\n');assert.throws(()=>runner.validateSuccessorDefinition(candidate,parentBound,policy),/WORKTREE-SOURCE-PIN/);}finally{fs.writeFileSync(full,bytes);assert.equal(sha(fs.readFileSync(full)),sha(bytes));}}
});
test('real exact successor executes; missing execution, wrong target and needle-only wrapper cannot cover',()=>{
 const c=candidate.children.find(c=>c.name==='source-carriers');const s={...candidate,children:[c]};
 const env={...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03'};delete env.NODE_TEST_CONTEXT;
 let ran;try{ran=runner.children(s,env);}catch(e){throw new Error(e.message+'\n'+fs.readFileSync(path.join(scratch,c.name+'.log'),'utf8'));}assert(ran.get(c.name).ok);
 for(const gate of ['migrate-source','merge-source','writers-source'])assert.doesNotThrow(()=>runner.inheritedExecutable(candidate,parentBound,gate,c.name,ran.get(c.name),policy));
 assert.throws(()=>runner.inheritedExecutable(candidate,parentBound,'migrate-source',c.name,undefined,policy),/COVERAGE-CHILD-NOT-EXECUTED/);
 assert.throws(()=>runner.inheritedExecutable(candidate,parentBound,'migrate-source',c.name,ran.get(c.name),null),/SUCCESSOR-POLICY-REQUIRED/);
 const bad={...ran.get(c.name),targets:['rebuild/m4/spec/native-carriers-source-carriers.cjs']};assert.throws(()=>runner.inheritedExecutable(candidate,parentBound,'migrate-source',c.name,bad,policy),/INHERITED-EXECUTION-TARGETS/);
 const file=path.join(actual,c.argv[0]),bytes=fs.readFileSync(file);try{
  fs.writeFileSync(file,'console.log('+JSON.stringify(c.needle+' '+ 'x'.repeat(250))+');');
  const fake=runner.children(s,env);assert(fake.get(c.name).ok,'printing a needle by itself is insufficient');
  assert.throws(()=>runner.validateSuccessorDefinition(candidate,parentBound,policy),/WORKTREE-SOURCE-PIN/);
 }finally{fs.writeFileSync(file,bytes);}
 assert.doesNotThrow(()=>runner.validateSuccessorDefinition(candidate,parentBound,policy));
});
test('five real pinned helpers with all fifteen declarations bypass the old runner and refuse now',()=>{
 const malicious=clone(candidate),names=new Set(Object.values(malicious.coverage.inherited));
 for(const c of malicious.children)if(names.has(c.name)){c.argv=['--test','--test-reporter=tap','rebuild/m4/spec/native-carriers-source.cjs'];c.needle='# pass 1';}
 assert.equal(malicious.children.length,15);assert.equal(names.size,5);assert.equal(malicious.authorizations.theme,null);
 assert.equal(sha(fs.readFileSync(path.join(actual,'rebuild/m4/spec/native-carriers-source.cjs'))),accepted.executionPins['rebuild/m4/spec/native-carriers-source.cjs']);
 const old=api(actual,cp.execFileSync('git',['show','7cd7a5b:'+runnerRel],{cwd:sourceRoot,encoding:'utf8',windowsHide:true}),'successorSupport,children,coverage');
 assert.equal(old.successorSupport(malicious,parentBound),null);
 const env={...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:''};delete env.NODE_TEST_CONTEXT;
 const ran=runner.children({...malicious,children:malicious.children.filter(c=>names.has(c.name))},env);
 assert.equal(ran.size,5);for(const value of ran.values())assert.equal(value.needle,'# pass 1');
 assert.equal(old.coverage(malicious,parentBound,ran).size,9,'baseline FALSE coverage, not package acceptance');
 assert.throws(()=>runner.successorSupport(malicious,parentBound),/SUCCESSOR-CHILD-DECLARATIONS/,'before campaign');
 assert.throws(()=>runner.coverage(malicious,parentBound,ran),/SUCCESSOR-CHILD-DECLARATIONS/,'before counting');
 const generic=api(actual,text,'inheritedExecutable,acceptedOriginalChildren','B1');
 for(const [gate,name]of Object.entries(malicious.coverage.inherited))assert.throws(()=>generic.inheritedExecutable(malicious,parentBound,gate,name,ran.get(name),null),/INHERITED-ACCEPTED-ARGV-VERDICT/);
});
test('exact legacy parent schedule is source-bound and its genuine original child executes',()=>{
 const generic=api(actual,text,'inheritedExecutable,acceptedOriginalChildren,children','B1');
 const scheduled=generic.acceptedOriginalChildren(parentBound);assert.equal(scheduled.length,5);
 const c=scheduled.find(c=>c.name==='source-carriers'),s={...candidate,children:scheduled};
 const restored=['rebuild/m4/workout/engine-runtime.cjs','.github/workflows/rebuild.yml'].map(file=>[file,fs.readFileSync(path.join(actual,file))]);
 try{
  for(const [file]of restored)write(actual,file,cp.execFileSync('git',['show',reviewedCommit+':'+file],{cwd:sourceRoot,windowsHide:true}));
  const env={...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03'};delete env.NODE_TEST_CONTEXT;
  let ran;try{ran=generic.children({...s,children:[c]},env);}catch(e){throw new Error(e.message+'\n'+fs.readFileSync(path.join(scratch,c.name+'.log'),'utf8'));}
  for(const gate of ['migrate-source','merge-source','writers-source'])assert.doesNotThrow(()=>generic.inheritedExecutable(s,parentBound,gate,c.name,ran.get(c.name),null));
  const forged=clone(s);forged.children.find(x=>x.name===c.name).needle='# pass 1';assert.throws(()=>generic.inheritedExecutable(forged,parentBound,'migrate-source',c.name,ran.get(c.name),null),/INHERITED-ACCEPTED-ARGV-VERDICT/);
  const file='rebuild/m4/spec/native-carriers-package.cjs',bytes=fs.readFileSync(path.join(actual,file));try{fs.appendFileSync(path.join(actual,file),'\n// control drift');assert.throws(()=>generic.acceptedOriginalChildren(parentBound),/WORKTREE-SOURCE-PIN/);}finally{write(actual,file,bytes);}
 }finally{for(const [file,bytes]of restored)write(actual,file,bytes);}
 assert.doesNotThrow(()=>runner.validateSuccessorDefinition(candidate,parentBound,policy));
});
test.after(()=>{
 const resolved=fs.realpathSync(scratch);assert.equal(path.dirname(resolved),fs.realpathSync(os.tmpdir()));assert(path.basename(resolved).startsWith('earned-successor-controls-'));
 // Remove only our junction objects before removing the isolated generated fixture.
 for(const dep of ['node_modules','rebuild/m3/w6/node_modules','rebuild/m3/w5/node_modules']){const f=path.join(actual,dep);if(fs.existsSync(f)&&fs.lstatSync(f).isSymbolicLink())fs.unlinkSync(f);}
 fs.rmSync(resolved,{recursive:true,force:true});
});
