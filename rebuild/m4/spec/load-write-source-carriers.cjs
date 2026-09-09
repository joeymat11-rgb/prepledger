'use strict';
// Execute every assertion of the three original source programs through their
// accepted import/D12 preparation, plus the closed load-write source additions.
// Original test files and all runtime factory loading remain unchanged.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const A=require(path.join(P,'acceptance.cjs')),Parent=require(path.join(P,'legacy-carriers.cjs')),Step=require(path.join(P,'legacy-step-efficacy-carriers.cjs'));
const LegacySource=require(path.join(P,'source-proof.cjs')),S=require('./load-write-source.cjs'),NativeDate=Date;
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
 return source;
}
function run(id,mode){
 const file=path.join(root,'rebuild/engine/test/'+id+'.cjs'),bytes=fs.readFileSync(file);
 assert.equal(S.sha(bytes),Parent.ORIGINAL_PINS[id],'Original source test pin');
 const source=prepare(id,bytes),visited=[],out=[];
 const context={capture:(...args)=>out.push(args.map(String).join(' ')),
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
  assert.deepEqual(visited,id==='migrate-source'?['migrate','isPristineSeed','dataLossGuard','energy.cjs']:id==='merge-source'?['energy.cjs','migrate.cjs']:['D41-debut','D43-entry','D41-reset','energy.cjs','migrate.cjs']);
  assert.equal(out.length,2,'Both original success lines reached');
  assert.equal(S.sha(declaration(expected[S.EARN],'earnWalk')),'888af1dc693a4a0929b6883a7ce5393f908890cb633059e193fe92fd1bb212c3','Verbatim moved earn declaration');
  console.log('LOAD SOURCE '+id+' '+mode+': PASS; all original assertions reached with exact declared source successors');
 }finally{globalThis.Date=NativeDate;}
}
let phase='preparation';
try{for(const mode of ['frozen','native'])for(const id of ids){phase=id+'/'+mode;run(id,mode);}console.log('LOAD SOURCE CARRIERS: 6/6 PASS; unchanged source tests; accepted parent + three writer literals + verbatim earn move; PACKAGE receipt PENDING');}
catch(_){console.error('LOAD SOURCE CARRIERS FAIL at '+phase+'; protected assertion context withheld');process.exitCode=1;}
