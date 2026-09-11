'use strict';
// Isolated public component fixtures only: no real authority or receipt is made.
// Change only the fixed policy digest in a privately compiled actual runner so
// each synthetic policy can be checked by its unmodified validation functions.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),Module=require('node:module'),cp=require('node:child_process'),crypto=require('node:crypto');
const sourceRoot=path.resolve(__dirname,'../../..'),runnerFile='rebuild/lanes/b/tooling/b-package.cjs',policyFile='rebuild/lanes/b/tooling/b-ntc-successors.json';
const runner=fs.readFileSync(path.join(sourceRoot,runnerFile),'utf8'),marker='// ------------------------------------------------------------------ 8. main sequence';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),json=x=>JSON.stringify(x,null,2)+'\n';
const E='rebuild/control/existing.cjs',I='rebuild/control/implementation.cjs',P='rebuild/control/parent.cjs',X='rebuild/control/parent-executable.cjs',A='rebuild/control/acceptance.json';
function fixture(t,change=()=>{},policyChange=()=>{}){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'earned-existing-dependency-'));
  const write=(f,b)=>{fs.mkdirSync(path.dirname(path.join(root,f)),{recursive:true});fs.writeFileSync(path.join(root,f),b);};
  const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();
  const commit=()=>{git('add','rebuild');git('commit','--quiet','-m','Synthetic component fixture');return git('rev-parse','HEAD');};
  git('init','--quiet');git('config','user.name','Public component control');git('config','user.email','public-control@example.invalid');
  write(E,'existing old\n');write(I,'before\n');write(P,'parent\n');write(X,'parent executable\n');
  const wrongBase=commit();write(E,'existing\n');const base=commit();
  const acceptance={product:{[P]:hash('parent\n')},executionPins:{[X]:hash('parent executable\n')}};
  write(A,json(acceptance));write(I,'after\n');
  const option={id:'PUBLIC-CONTROL',artifact:A,sha256:hash(json(acceptance))};
  const s={lanePackage:'B-NTC',packageId:'M2-B-NTC-NATIVE-TREND-CONTEXT',sourceBase:base,coverage:{inherited:{},moves:{}},children:[],product:{
    [E]:{pre:hash('existing\n'),post:hash('existing\n'),role:'new'},
    [I]:{pre:hash('before\n'),post:hash('after\n'),role:'new'},
    [P]:{pre:hash('parent\n'),post:hash('parent\n'),role:'carried'}}};
  change(s,{acceptance,wrongBase,base});
  const sourceCommit=commit(),sourcePins=Object.fromEntries([E,I,P,X,A].map(f=>[f,hash(fs.readFileSync(path.join(root,f)))]));
  const policy=JSON.parse(JSON.stringify({version:1,lanePackage:s.lanePackage,packageId:s.packageId,sourceCommit,parent:option,coverage:s.coverage,children:s.children,product:s.product,sourcePins}));
  policyChange(policy);write(policyFile,json(policy));commit();
  function api(source=runner,id='B-NTC'){
    const shaPattern=/const SUCCESSOR_POLICY_SHA = '[a-f0-9]{64}';/g;assert.equal([...source.matchAll(shaPattern)].length,1);
    source=source.replace(shaPattern,"const SUCCESSOR_POLICY_SHA = '"+hash(json(policy))+"';");
    assert.equal(source.split(marker).length,2);
    const file=path.join(root,runnerFile),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(path.join(sourceRoot,runnerFile)));
    const normal=m.require.bind(m);m.require=f=>normal(path.isAbsolute(f)&&f.startsWith(root+path.sep)?path.join(sourceRoot,path.relative(root,f)):f);
    write('rebuild/conform/v4/postfix/run.cjs',fs.readFileSync(path.join(sourceRoot,'rebuild/conform/v4/postfix/run.cjs')));
    const argv=process.argv;process.argv=[process.execPath,file,'--ci','--package',id];
    try{m._compile(source.split(marker)[0]+'\nmodule.exports={product};',file);}finally{process.argv=argv;}
    return m.exports;
  }
  t.after(()=>{const resolved=fs.realpathSync(root);assert.equal(path.dirname(resolved),fs.realpathSync(os.tmpdir()));assert(path.basename(resolved).startsWith('earned-existing-dependency-'));fs.rmSync(resolved,{recursive:true,force:true});});
  return {root,s,bound:{option,acceptance},api,write};
}
test('existing dependency red before / green after: actual old and corrected product functions',t=>{
  const f=fixture(t),old=cp.execFileSync('git',['show','85f7d56:'+runnerFile],{cwd:sourceRoot,encoding:'utf8',windowsHide:true});
  assert.equal(f.api(old).product(f.s,f.bound),'PARTIAL');
  assert.equal(f.api().product(f.s,f.bound),'IMPLEMENTED');
});
test('existing dependency missing or changed on real disk refuses',t=>{
  const f=fixture(t),before=fs.readFileSync(path.join(f.root,E));
  fs.unlinkSync(path.join(f.root,E));assert.throws(()=>f.api().product(f.s,f.bound));
  f.write(E,'changed\n');assert.throws(()=>f.api().product(f.s,f.bound),/UNLISTED-PRODUCT-DRIFT/);f.write(E,before);
});
test('existing dependency false sourceBase preimage refuses despite exact policy source',t=>{
  const f=fixture(t,(s,{wrongBase})=>{s.sourceBase=wrongBase;});
  assert.throws(()=>f.api().product(f.s,f.bound),/EXISTING-DEPENDENCY-SOURCEBASE/);
});
test('existing dependency absent/wrong policy or changed declaration refuses',t=>{
  const f=fixture(t),p=path.join(f.root,policyFile),before=fs.readFileSync(p);
  fs.unlinkSync(p);assert.throws(()=>f.api().product(f.s,f.bound));
  f.write(policyFile,Buffer.concat([before,Buffer.from(' ')]));assert.throws(()=>f.api().product(f.s,f.bound),/SUCCESSOR-POLICY-BYTES/);f.write(policyFile,before);
  f.s.children.push({name:'fake',argv:['rebuild/control/helper.cjs'],needle:'# pass 1'});
  assert.throws(()=>f.api().product(f.s,f.bound),/SUCCESSOR-CHILD-DECLARATIONS/);
});
test('existing dependency path cannot mislabel parent PRODUCT or EXECUTION pins',t=>{
  const f=fixture(t,s=>{s.product[P].role='new';});assert.throws(()=>f.api().product(f.s,f.bound),/PARENT-PRODUCT-PIN-NOT-DECLARED/);
  const g=fixture(t,(s,{acceptance})=>{s.product[X]={pre:acceptance.executionPins[X],post:acceptance.executionPins[X],role:'new'};});
  assert.throws(()=>g.api().product(g.s,g.bound),/PARENT-EXECUTION-PIN-NOT-DECLARED/);
});
test('existing dependency correction leaves unchanged edited/superseded parent code PARTIAL',t=>{
  const f=fixture(t,s=>{s.product[P].role='edited';});assert.equal(f.api().product(f.s,f.bound),'PARTIAL');
  const g=fixture(t,(s,{acceptance})=>{s.product[X]={pre:acceptance.executionPins[X],post:acceptance.executionPins[X],role:'superseded-by-child'};});
  assert.equal(g.api().product(g.s,g.bound),'PARTIAL');
});
test('existing dependency correction leaves genuinely absent new implementation PARTIAL',t=>{
  const f=fixture(t,s=>{s.product['rebuild/control/not-built.cjs']={pre:hash(''),post:null,role:'new'};});
  assert.equal(f.api().product(f.s,f.bound),'PARTIAL');
});
test('existing dependency correction does not change other package accounting',t=>{
  const f=fixture(t);assert.equal(f.api(runner,'B1').product(f.s,f.bound),'PARTIAL');
});

test('existing dependency needs its own immutable policy source pin',t=>{
  const f=fixture(t,()=>{},p=>{delete p.sourcePins[E];});
  assert.throws(()=>f.api().product(f.s,f.bound),/EXISTING-DEPENDENCY-POLICY-SOURCE/);
});
test('existing dependencies alone cannot stand in for changed implementation',t=>{
  const f=fixture(t,s=>{delete s.product[I];});
  assert.equal(f.api().product(f.s,f.bound),'NOT-IMPLEMENTED');
});
