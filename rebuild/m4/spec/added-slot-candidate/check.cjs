'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {pathToFileURL}=require('node:url'),construct=require('./construct.cjs');
const w6=process.env.EARNED_EXTENSION_W6,r1=process.env.EARNED_SOURCE_R1_ROOT;assert(w6&&r1,'Explicit retained W6/R1 dependencies required');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const originalFile=path.join(w6,'rebuild/m4/workout/capture.cjs'),original=fs.readFileSync(originalFile,'utf8');
assert.equal(sha(original),'c20fb021034b7c110d58cd14cb8e5fb547ce23d0436086894dce67e23a4674ea');
const candidate=construct(original),out=fs.mkdtempSync(path.join(os.tmpdir(),'earned-extension-capture-')),candidateFile=path.join(out,'capture.cjs');fs.writeFileSync(candidateFile,candidate);
const C=require(candidateFile),results=[];
const json=x=>JSON.stringify(x),check=(name,fn)=>{fn();results.push(name);console.log('PASS '+name);};
async function main(){
 const {parseStrictJson}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs'))),E=C.createExtensionCapture({parseStrictJson});
 const unknown=()=>({state:'not_prescribed',display:'No machine target',source_json:null});
 const fixture=()=>({profile:C.EXTENSION_PROFILE,producer:{app_build:'synthetic',engine_build:'unqualified',rule_profile:'extension-example',source_schema:'2'},basis:{plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:5},session:{instruction:unknown(),reason:unknown(),confidence:unknown()},slots:[1,2].map(extension_slot=>({extension_slot,lift_lineage_id:'same-lift',label:'Additional set',load:{state:'specified',display:' cafe\u0301 ',source_json:' {"kind":"configuration","configuration_key":" cafe\\u0301 "} '},reps:unknown(),effort:unknown(),setup:unknown(),reason:unknown(),confidence:unknown()}))});
 const expected=f=>({producer:structuredClone(f.producer),basis:structuredClone(f.basis)}),prepare=f=>E.prepare(f,expected(f));
 const rejects=(f,e)=>assert.throws(()=>E.prepare(f,e||expected(f)),{code:'WORKOUT_EXTENSION_CAPTURE_INVALID'});
 check('actual shared capture validates common fields and preserves exact indexed extension bytes',()=>{
  const f=fixture(),before=json(f),saved=prepare(f);assert.equal(json(saved),before);assert.equal(json(E.read(saved)),before);
  assert.equal(saved.slots[0].load.source_json,f.slots[0].load.source_json);assert.equal(saved.slots[0].load.display,' cafe\u0301 ');
  assert(!json(saved).includes('extension-local-index'));assert(saved.slots.every(s=>!Object.hasOwn(s,'logical_set_slot')&&!Object.hasOwn(s,'op_id')));
  const walk=x=>{if(x&&typeof x==='object'){assert(Object.isFrozen(x));Object.values(x).forEach(walk);}};walk(saved);
  f.slots[0].label='mutation';f.basis.source_revision=100;assert.equal(json(saved),before);
 });
 check('slot index shape refuses collisions, reordered indices and fabricated durable identities',()=>{
  for(const change of [f=>f.slots[0].extension_slot=0,f=>f.slots[0].extension_slot=-0,f=>f.slots[0].extension_slot='1',f=>f.slots[0].extension_slot=1.5,
   f=>f.slots[1].extension_slot=1,f=>f.slots.reverse(),f=>f.slots[0].logical_set_slot='invented',f=>f.slots[0].op_id='invented',f=>f.slots=[]]){const f=fixture();change(f);rejects(f);}
 });
 check('descriptor ingress never invokes getters and freezes an independent complete copy',()=>{
  for(const location of ['root','slot','cell']){const f=fixture(),context=expected(f);let calls=0;
   const target=location==='root'?f:location==='slot'?f.slots[0]:f.slots[0].load,key=location==='root'?'profile':location==='slot'?'extension_slot':'display';
   Object.defineProperty(target,key,{enumerable:true,get(){calls++;throw Error('getter');}});rejects(f,context);assert.throws(()=>E.read(f),{code:'WORKOUT_EXTENSION_CAPTURE_INVALID'});assert.equal(calls,0);
  }
  for(const change of [f=>f[Symbol('extra')]=true,f=>Object.setPrototypeOf(f.slots[0],{inherited:true}),f=>delete f.slots[0],f=>f.slots.extra=true,f=>f.slots[0].load=f]){const f=fixture(),context=expected(f);change(f);rejects(f,context);}
 });
 check('trusted producer/basis correspondence and original strict cell parser remain mandatory',()=>{
  for(const field of ['plan_basis','input_basis','source_revision']){const f=fixture(),context=expected(f);context.basis[field]=field==='source_revision'?6:'different';rejects(f,context);}
  const f=fixture(),context=expected(f);context.producer.rule_profile='different';rejects(f,context);
  for(const source of ['{"a":1,"\\u0061":2}','1e999','"\\ud800"']){const bad=fixture();bad.slots[0].load.source_json=source;rejects(bad);}
  let calls=0;const unsafe=expected(f);Object.defineProperty(unsafe.basis,'source_revision',{enumerable:true,get(){calls++;return 5;}});rejects(f,unsafe);assert.equal(calls,0);
 });
 check('extension representation cannot masquerade as an original/source capture or source proof',()=>{
  const f=fixture();assert.throws(()=>C.createPrescriptionCapture({parseStrictJson}).read(f),{code:'WORKOUT_CAPTURE_INVALID'});
  for(const profile of [C.PROFILE,C.SOURCE_PROFILE]){const bad=fixture();bad.profile=profile;rejects(bad);}
  const bad=fixture();bad.source_basis={W:0,log_digest:'not-proof',selection_id:null};rejects(bad);
  assert(!Object.hasOwn(prepare(f),'source_basis'));
  assert.equal(candidate.slice(0,candidate.indexOf("const EXTENSION_PROFILE=")),original.slice(0,original.indexOf('module.exports=')),'Original capture functions remain literal');
 });
 // Existing assertion bodies stay unchanged. Redirect only module imports to
 // their original absolute locations and Capture to the new candidate module.
 const oldTest=path.join(w6,'rebuild/m3/w6/test/prescription-capture.test.mjs'),test=fs.readFileSync(oldTest,'utf8');
 assert.equal(sha(test),'a23c72f744d3bffe7756916f715a2001fb8d1b4c00e40a305c0c9c1b30c75059');
 let imports=0;const redirected=test.replace(/from '(\.[^']+)'/g,(whole,relative)=>{imports++;return "from '"+pathToFileURL(relative==='../../../m4/workout/capture.cjs'?candidateFile:path.resolve(path.dirname(oldTest),relative)).href+"'";});
 assert.equal(imports,6,'Only the six relative static imports');
 const runner=path.join(out,'prescription-capture.test.mjs');fs.writeFileSync(runner,redirected);
 const r=cp.spawnSync(process.execPath,['--test',runner],{env:{...process.env,EARNED_SOURCE_R1_ROOT:r1},windowsHide:true,encoding:'utf8',maxBuffer:2e6});
 fs.writeFileSync(path.join(out,'original-capture-controls.log'),r.stdout+r.stderr);assert.equal(r.status,0,r.stderr+'\n'+r.stdout);console.log(r.stdout.split(/\r?\n/).filter(l=>/tests |pass |fail /.test(l)).join('\n'));
 assert.equal(fs.readFileSync(originalFile,'utf8'),original);assert.equal(fs.readFileSync(oldTest,'utf8'),test);
 const evidence={runtime:process.version,original:sha(original),candidate:sha(candidate),originalTests:sha(test),results,originalControlsLog:sha(r.stdout+r.stderr),
  limits:['candidate source component only; no registered extension kind or actual stored extension','source-aware extension/current Start binding remains required','shared shape/references/fixed Skip/edit/partition/history closure not yet implemented','strict parser and existing capture controls reused, no private fixture']};
 fs.writeFileSync(path.join(out,'EVIDENCE.json'),json(evidence)+'\n');console.log('EXTENSION CAPTURE EVIDENCE '+out);
}
main().catch(error=>{console.error(error);console.log('EXTENSION CAPTURE FAILED SCRATCH '+out);process.exitCode=1;});
