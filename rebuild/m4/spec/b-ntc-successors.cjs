'use strict';
// Candidate two-stage proof, never a receipt or acceptance. The archived parent
// preflight reads only two superseded execution pins from their reviewed Git
// origin. Actual-child source verification and every gate execute against disk.
// No global loader/fs patch, cache replacement or candidate-code substitution.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const assert=require('node:assert/strict'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
const L=require('../../conform/v4/postfix/legacy-gates.cjs');
const {sha}=require('../../conform/v4/postfix/target.cjs');
const ARTIFACT='rebuild/m4/spec/acceptance-native-carriers.json';
const PARENT_SHA='e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a';
const ORIGIN='b95ccca879e371b5ba225ad12cae612ec89469ba';
const RUNTIME='rebuild/m4/workout/engine-runtime.cjs';
const OVERLAY=Object.freeze([RUNTIME,'.github/workflows/rebuild.yml']);
const NAMES=Object.freeze(['traces','direct','legacy','witnesses','cases','source-carriers',
  'inherited-carriers','defect-witnesses','writers-differential','second-gate']);
const rel=file=>path.join(root,file);
function manifest(){
  const raw=fs.readFileSync(rel(ARTIFACT));assert.equal(sha(raw),PARENT_SHA,'Immutable accepted parent');
  return JSON.parse(raw);
}
function original(file,a){
  const bytes=fs.readFileSync(rel(file));
  assert.equal(sha(bytes),a.executionPins[file],'Immutable original executable '+file);
  assert(bytes.equals(L.object(root,ORIGIN,file)),'Original executable origin '+file);
  return bytes.toString('utf8');
}
// Private per-module require closure. Compiled originals never enter require.cache.
function compile(file,source,resolve){
  const m=new Module(rel(file),module);m.filename=rel(file);m.paths=Module._nodeModulePaths(path.dirname(m.filename));
  const normal=m.require.bind(m);m.require=name=>resolve(name,normal);
  m._compile(source,m.filename);return m.exports;
}
function actualChild(a){
  const spec=JSON.parse(fs.readFileSync(rel('rebuild/lanes/b/tooling/packages/B-NTC.json')));
  for(const [file,hash]of Object.entries({...a.product,...a.executionPins})){
    const disk=sha(fs.readFileSync(rel(file)));
    if(OVERLAY.includes(file)){
      const pin=spec.product[file];assert(pin,'Declared child supersession '+file);
      assert.equal(pin.role,'superseded-by-child');assert.equal(pin.pre,hash);
      assert.equal(sha(L.object(root,ORIGIN,file)),hash,'Parent bytes at actual reviewed origin');
      assert.equal(disk,pin.post,'Exact actual child supersession '+file);
    }else assert.equal(disk,hash,'Unlisted parent pin drift '+file);
  }
  for(const [file,pin]of Object.entries(spec.product))
    assert.equal(sha(fs.readFileSync(rel(file))),pin.post,'Exact declared child bytes '+file);
  return spec;
}
function sourceModule(a,{archived=false,spec}={}){
  const file='rebuild/m4/spec/native-carriers-source.cjs';let src=original(file,a);
  if(!archived){
    const old="'"+RUNTIME+"':'"+a.executionPins[RUNTIME]+"'";
    assert.equal(src.split(old).length,2,'One exact runtime SUPPORT pin');
    src=src.replace(old,"'"+RUNTIME+"':'"+spec.product[RUNTIME].post+"'");
  }
  return compile(file,src,(name,normal)=>name==='node:fs'&&archived?archivedFs(a):normal(name));
}
function archivedFs(a){
  return Object.freeze({...fs,readFileSync(file,options){
    const f=typeof file==='string'?path.relative(root,path.resolve(file)).split(path.sep).join('/'):'';
    if(!OVERLAY.includes(f))return fs.readFileSync(file,options);
    const bytes=L.object(root,ORIGIN,f);assert.equal(sha(bytes),a.executionPins[f],'Archived overlay origin '+f);
    const encoding=typeof options==='string'?options:options?.encoding;
    return encoding?bytes.toString(encoding):bytes;
  }});
}
function preflight(){
  const a=manifest(),spec=actualChild(a);
  // All original profile assertions run, including exact artifact, receipt,
  // authorization, source inventory, public pins and real-chain ancestry.
  const archivedSource=sourceModule(a,{archived:true});
  const file='rebuild/m4/spec/native-carriers-profile.cjs';
  const profile=compile(file,original(file,a),(name,normal)=>
    name==='node:fs'?archivedFs(a):name==='./native-carriers-source.cjs'?archivedSource:normal(name));
  const parent=profile.verify();assert.equal(parent.accepted,true,'Archived parent independently accepted');
  const source=sourceModule(a,{spec});source.verify(root);
  console.log('B-NTC ARCHIVED PARENT VERIFIED; two exact execution pins read at '+ORIGIN+'; this is not child acceptance');
  console.log('B-NTC ACTUAL CHILD VERIFIED; original source construction and all assertions, one exact runtime SUPPORT pin superseded; candidate code reads disk');
  return {a,spec,source,parent};
}
function run(name){
  assert(NAMES.includes(name),'Closed successor name');
  const {a,source,parent}=preflight();
  const Reference=require('./native-carriers-reference.cjs');
  const made=Reference.create(root);
  process.env.EARNED_NATIVE_PACKET_ROOT=made.packet;
  const bridgeFile='rebuild/m4/spec/native-carriers-parent-source.cjs';
  const bridge=compile(bridgeFile,original(bridgeFile,a),(n,normal)=>n==='./native-carriers-source.cjs'?source:normal(n));
  const file='rebuild/m4/spec/native-carriers-'+name+'.cjs';
  let entry=original(file,a);
  if(name==='witnesses'){
    const before="assert.deepEqual(COMPOSITION.exposed.slice().sort(),['genSession','rirPlan'],'Exposed reader surface');";
    assert.equal(entry.split(before).length,2,'One original exact exposed-surface assertion');
    entry=entry.replace(before,"assert.deepEqual(COMPOSITION.exposed.slice().sort(),['cleanAtDate','dayWeather','genSession','rirPlan'],'Exposed reader surface');");
  }
  if(name==='cases'){
    const before="path.join(root,'rebuild/m4/workout/test/native-next-targets.test.cjs')";
    assert.equal(entry.split(before).length,2,'One original focused mutant detector');
    entry=entry.replace(before,"path.join(root,'rebuild/m4/spec/b-ntc-native-next-targets.test.cjs')");
  }
  // _compile makes a private module, so its CLI guard would be false. Invoke
  // that same guarded entry body explicitly; no test/body assertion is edited.
  if(entry.includes('if(require.main===module)')){
    assert.equal(entry.split('if(require.main===module)').length,2,'Single original CLI entry');
    entry=entry.replace('if(require.main===module)','if(true)');
  }
  compile(file,entry,(n,normal)=>
    n==='./native-carriers-source.cjs'?source:
    n==='./native-carriers-parent-source.cjs'?bridge:
    n==='./native-carriers-profile.cjs'?Object.freeze({verify(){
      // An original gate asks for cumulative preflight. It already ran above,
      // and is rechecked here. Do not inherit the parent's acceptance boolean.
      actualChild(a);source.verify(root);return {...parent,accepted:false,root};
    }}):normal(n));
  Reference.removeImportEngine();
}
module.exports={run,preflight,NAMES};
