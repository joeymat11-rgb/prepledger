'use strict';
// Carry the accepted import/D12 witness and migration programs unchanged onto
// the closed current product. The new source guard replaces no behavior check.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix'),NativeDate=Date;
const A=require(path.join(P,'acceptance.cjs')),Parent=require(path.join(P,'legacy-carriers.cjs')),Step=require(path.join(P,'legacy-step-efficacy-carriers.cjs')),S=require('./load-write-source.cjs');
const {acceptance:a,envelope:e,bytes}=A.load(root,path.join(P,'manifest-step-efficacy.json'));assert(A.verifyReceipts(root,a,e,bytes));
for(const [file,hash]of Object.entries(a.executionPins))assert.equal(S.sha(fs.readFileSync(path.join(root,file))),hash,'Unchanged accepted carrier input');S.verify(root);
const bundles=require('./load-write-reference.cjs').create(root);process.env.ENGINE_MAIN=bundles.main;process.env.ENGINE_OLD=bundles.old;
process.env.TZ='America/New_York';process.env.MEASURED_TEST_NOW='2026-09-03';
function run(id,mode){
 const file=path.join(root,'rebuild/engine/test/'+id+'.cjs'),bytes=fs.readFileSync(file),step=id==='defect-witnesses-2';
 assert.equal(S.sha(bytes),step?Step.WITNESS_PIN:Parent.ORIGINAL_PINS[id]);
 assert.equal(S.sha(fs.readFileSync(path.join(root,'rebuild/engine/test/migrate-reference.cjs'))),Parent.ORIGINAL_PINS['migrate-reference']);
 const prepared=(step?Step:Parent).prepareCarrier(id,bytes),cases=[],output=[];
 const context={
  differential(label,expected){cases.push(label);if(Object.hasOwn(Parent.DIFFERENTIAL_DELTAS,label))Parent.adjustDifferential(label,expected);},
  witness(label,expected){const code=label.slice(0,3);cases.push(code);Parent.adjustWitness(code,expected);},
  capture:(...args)=>output.push(args.map(String).join(' '))
 };
 const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled.context=context;
 const oldArgv=process.argv;process.argv=[process.execPath,file,'--worker',mode];
 try{
  if(id!=='migrate-differential'&&mode==='frozen')globalThis.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[1788451200000]));}static now(){return 1788451200000;}};
  compiled._compile('const __carrier=module.context; const console={log:(...args)=>__carrier.capture(...args)};\n'+prepared.source,file);
  if(step){assert.deepEqual(output.filter(line=>line.startsWith('REPRODUCED ')).map(line=>/^REPRODUCED (D\d+) /.exec(line)?.[1]),Array.from({length:11},(_,i)=>'D'+(11+i)));assert(output.at(-1).startsWith('DEFECT WITNESSES 2: 11/11'));}
  else assert.deepEqual(cases,Parent.caseInventory(id).map(row=>row.label),'Every original and accepted added case in order');
  console.log('LOAD INHERITED '+id+' '+mode+': PASS; '+(step?11:cases.length)+' original/accepted cases; exact existing expectation substitutions');
 }finally{globalThis.Date=NativeDate;process.argv=oldArgv;}
}
let phase='preparation';
try{for(const id of ['migrate-differential','defect-witnesses-5','defect-witnesses-2'])for(const mode of ['frozen','native']){phase=id+'/'+mode;run(id,mode);}console.log('LOAD INHERITED CARRIERS: 6/6 PASS; import/D12 original scope retained; PACKAGE receipt PENDING');}
catch(_){console.error('LOAD INHERITED CARRIERS FAIL at '+phase+'; protected context withheld');process.exitCode=1;}
