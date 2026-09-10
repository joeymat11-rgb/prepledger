'use strict';
// Execute every assertion of the three original source programs through their
// accepted import/D12 preparation, plus the closed load-write source additions.
// Original test files and all runtime factory loading remain unchanged.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const A=require(path.join(P,'acceptance.cjs')),Parent=require(path.join(P,'legacy-carriers.cjs')),Step=require(path.join(P,'legacy-step-efficacy-carriers.cjs'));
const LegacySource=require(path.join(P,'source-proof.cjs')),S=require('./native-carriers-parent-source.cjs'),NativeDate=Date;
const loaded=A.load(root,path.join(P,'manifest-step-efficacy.json'));
assert(A.verifyReceipts(root,loaded.acceptance,loaded.envelope,loaded.bytes),'Accepted parent receipt');
const before=S.baseline(root),expected=S.construct(before);
for(const [file,hash]of Object.entries(loaded.acceptance.candidateEngine))assert.equal(S.sha(before['rebuild/engine/'+file]),hash,'Accepted parent source: '+file);
S.verify(root);
const ids=['migrate-source','merge-source','writers-source'];
function declaration(bytes,name){
 const marks=[...bytes.matchAll(/\/\/ Copied from frozen src\/app[.]jsx @ fe516c1:\d+-\d+[.]\n/g)];
 for(let i=0;i<marks.length;i++){
  const begin=marks[i].index+marks[i][0].length,end=i+1<marks.length?marks[i+1].index:bytes.lastIndexOf('\nreturn {')+1;
  const body=bytes.slice(begin,end);if(new RegExp('^(?:function|const|let) '+name+'\\b').test(body))return body;
 }
 throw Error('Missing named source declaration');
}
function prepare(id,bytes){
 const prepared=Step.prepareCarrier(id,bytes);let source=prepared.source;
 if(id==='writers-source')source=S.replace(source,
  'assert.equal(candidate.slice(marker.index+marker[0].length,to),expected+"\\n\\n","exact declaration "+names.join(","));',
  '__carrier.writerDeclaration(names,candidate.slice(marker.index+marker[0].length,to),expected+"\\n\\n");','three writer declaration literals');
 if(id==='merge-source')source=S.replace(source,
  'oldIndex.replace(\'  require("./migrate.cjs"),\', \'  require("./migrate.cjs"),\\n  require("./merge.cjs"),\\n  require("./writers.cjs"),\'));',
  'oldIndex.replace(\'  require("./migrate.cjs"),\', \'  require("./migrate.cjs"),\\n  require("./earn.cjs"),\\n  require("./merge.cjs"),\\n  require("./writers.cjs"),\'));','merge composition canonical earn');
 if(id==='writers-source')source=S.replace(source,
  'git([\'show\',BASE+\':rebuild/engine/index.cjs\']).replace(\'  require("./merge.cjs"),\',\'  require("./merge.cjs"),\\n  require("./writers.cjs"),\'));',
  'git([\'show\',BASE+\':rebuild/engine/index.cjs\']).replace(\'  require("./migrate.cjs"),\',\'  require("./migrate.cjs"),\\n  require("./earn.cjs"),\').replace(\'  require("./merge.cjs"),\',\'  require("./merge.cjs"),\\n  require("./writers.cjs"),\'));','writer composition canonical earn');
 // B0 successor. Each original program also re-reads every EARLIER engine module
 // and demands it be byte-identical to the frozen prior commit. Five of those
 // modules are exactly the ones this package carries, so that comparison is
 // routed — not dropped — through priorModule(), which requires the frozen bytes
 // to be the declared preimage and the tree bytes to be the declared postimage of
 // the carriers in native-carriers-changes.json, and nothing else.
 for(const [id_,before,after]of PRIOR_MODULE_REWRITES)if(id===id_)source=S.replace(source,before,after,'prior-module carrier hook');
 // The same programs also rebuild the expected engine composition from the frozen
 // index. B0's index carrier registers the two native files after seed.cjs, so the
 // expected composition gains exactly those two lines — the declared carrier, no
 // more: native-carriers-changes.json's index carrier is asserted to be exactly
 // this insertion by the profile's own construction.
 for(const [id_,before,after]of NATIVE_COMPOSITION_REWRITES)if(id===id_)source=S.replace(source,before,after,'native composition');
 for(const [id_,before,after]of HEADER_REWRITES)if(id===id_)source=S.replace(source,before,after,'writer header carrier hook');
 return source;
}
const SEED_INSERT='.replace(\'  require("./seed.cjs"),\', \'  require("./seed.cjs"),\\n  require("./entered-load.cjs"),\\n  require("./performed.cjs"),\')';
const NATIVE_COMPOSITION_REWRITES=[
 ['merge-source','oldIndex.replace(\'  require("./migrate.cjs"),\'','oldIndex'+SEED_INSERT+'.replace(\'  require("./migrate.cjs"),\''],
 ['writers-source','git([\'show\',BASE+\':rebuild/engine/index.cjs\']).replace(\'  require("./migrate.cjs"),\'','git([\'show\',BASE+\':rebuild/engine/index.cjs\'])'+SEED_INSERT+'.replace(\'  require("./migrate.cjs"),\''],
];
// The writers program also rebuilds the module HEADER (its delegate bindings)
// from the frozen source. B0's writers carrier adds exactly one delegate binding,
// so the header comparison is routed through the same declared-carrier rule.
const HEADER_REWRITES=[
 ['writers-source','assert.equal(candidate.slice(0,marks[0].index),header);','__carrier.writerHeader(candidate.slice(0,marks[0].index),header);'],
];
const PRIOR_MODULE_REWRITES=[
 ['migrate-source',
  'else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative]), "prior module bytes " + file);',
  'else __carrier.priorModule(file, fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative]));'],
 ['merge-source',
  'else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]), "prior bytes " + file);',
  'else __carrier.priorModule(file, fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]));'],
 ['writers-source',
  "else assert.equal(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p]),'prior module '+name);",
  'else __carrier.priorModule(name, fs.readFileSync(path.join(ROOT,p),\'utf8\'), git([\'show\',BASE+\':\'+p]));'],
];
// The declared carriers, per engine module, in their declared order.
const CARRIED_BY_MODULE=new Map();
for(const c of S.B.changes()){
 const name=path.basename(c.file,'.cjs');
 if(!c.file.startsWith('rebuild/engine/'))continue;
 if(!CARRIED_BY_MODULE.has(name))CARRIED_BY_MODULE.set(name,[]);
 CARRIED_BY_MODULE.get(name).push(c);
}
function priorModule(name,actual,original,reached){
 const file='rebuild/engine/'+name+'.cjs';
 if(!Object.hasOwn(S.B.CARRIED,file)){assert.equal(actual,original,'Unchanged prior module bytes: '+name);return;}
 const pin=S.B.CARRIED[file],declared=CARRIED_BY_MODULE.get(name)||[];
 assert(declared.length,'A carried module has declared carriers: '+name);
 assert.equal(S.sha(original),pin.before,'Frozen prior module is the declared carrier preimage: '+name);
 let body=original;
 for(const c of declared)body=S.replace(body,c.before,c.after,c.id);
 assert.equal(S.sha(body),pin.after,'Declared carrier postimage: '+name);
 assert.equal(actual,body,'Prior module is exactly the declared carriers over the frozen bytes: '+name);
 reached.push(name+'('+declared.length+')');
}
// Declared expectations, pinned so a missed or extra substitution fails loudly.
const VISITED={
 'migrate-source':['migrate','isPristineSeed','dataLossGuard','energy.cjs'],
 'merge-source':['energy.cjs','migrate.cjs'],
 // The parent's three D41/D43 repairs are still reached and still exact; the three
 // B0 writers carriers are interleaved where they actually apply (writers-2/-3 in
 // the rirPlan declaration, writers-1 in the module header).
 'writers-source':['D41-debut','D43-entry','writers-2','writers-3','D41-reset','writers-1','energy.cjs','migrate.cjs'],
};
// Carried modules each original program re-reads, with their declared carrier
// counts, in the program's own module order.
const CARRIED_VISITS={
 'migrate-source':['plan(1)','progression(28)','sleep(4)','today(9)'],
 'merge-source':['plan(1)','progression(28)','sleep(4)','today(9)'],
 'writers-source':['plan(1)','progression(28)','sleep(4)','today(9)'],
};
function run(id,mode){
 const file=path.join(root,'rebuild/engine/test/'+id+'.cjs'),bytes=fs.readFileSync(file);
 assert.equal(S.sha(bytes),Parent.ORIGINAL_PINS[id],'Original source test pin');
 const source=prepare(id,bytes),visited=[],out=[],carried=[];
 const context={capture:(...args)=>out.push(args.map(String).join(' ')),
  priorModule:(name,actual,original)=>priorModule(name,actual,original,carried),
  writerHeader(actual,original){
   let body=original;
   for(const c of CARRIED_BY_MODULE.get('writers')||[])if(body.includes(c.before)){body=S.replace(body,c.before,c.after,c.id);visited.push(c.id);}
   assert.equal(actual,body,'Writers header is exactly the declared carriers over the frozen bindings');
  },
  sourceDeclaration(name,actual,original){
   if(['migrate','isPristineSeed','dataLossGuard'].includes(name)){assert.equal(actual,declaration(before['rebuild/engine/migrate.cjs'],name));visited.push(name);}
   else assert.equal(actual,original,'Unchanged declaration: '+name);
  },
  priorMigrate(actual){assert.equal(actual,expected['rebuild/engine/migrate.cjs']);visited.push('migrate.cjs');},
  priorEnergy(actual,original){assert.equal(actual,LegacySource.applyStepEfficacyChange(original,loaded.acceptance.sourceChanges[5]));visited.push('energy.cjs');},
  writerDeclaration(names,actual,original){
   let body=original;
   for(const [id,a,b]of S.CHANGES)if(body.includes(a)){body=S.replace(body,a,b,id);visited.push(id);}
   assert.equal(actual,body,'Exact writer declaration '+names.join(','));
  }
 };
 const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));
 compiled.context=context;
 // Pass the context directly into the program wrapper; no product/source IO hook.
 const wrapper=compiled._compile;compiled._compile=function(code,filename){return wrapper.call(this,'const __carrier=module.context; const console={log:(...args)=>__carrier.capture(...args)};\n'+code,filename);};
 try{
  if(mode==='frozen')globalThis.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[1788451200000]));}static now(){return 1788451200000;}};
  compiled._compile(source,file);
  assert.deepEqual(visited,VISITED[id],'Every original substitution reached, in order');
  assert.deepEqual(carried,CARRIED_VISITS[id],'Every carried prior module reached, in declared carrier order');
  assert.equal(out.length,2,'Both original success lines reached');
  assert.equal(S.sha(declaration(expected[S.EARN],'earnWalk')),'888af1dc693a4a0929b6883a7ce5393f908890cb633059e193fe92fd1bb212c3','Verbatim moved earn declaration');
  console.log('NATIVE SOURCE '+id+' '+mode+': PASS; all original assertions reached; '+carried.length+' declared carriers proved over the frozen prior bytes');
 }finally{globalThis.Date=NativeDate;}
}
let phase='preparation';
try{for(const mode of ['frozen','native'])for(const id of ids){phase=id+'/'+mode;run(id,mode);}console.log('NATIVE SOURCE CARRIERS: 6/6 PASS; unchanged source tests; accepted parent + three writer literals + verbatim earn move; PACKAGE receipt PENDING');}
catch(_){if(process.env.B0_DEBUG)console.error(_);console.error('NATIVE SOURCE CARRIERS FAIL at '+phase+'; protected assertion context withheld');process.exitCode=1;}
