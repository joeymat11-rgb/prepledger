'use strict';
// Feasibility only; no product validator, admission, durable store or phone model.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {randomBytes,webcrypto}=require('node:crypto');
const PINS={r1:'60e073bb4c77d87c7179971d8f77e20655f5805b',w6:'17fa69f09a19e0b6a72566c9504fddebdd599a0b'};
function roots(argv){const r={};for(let i=0;i<argv.length;i+=2){if(!['--r1-root','--w6-root'].includes(argv[i])||!argv[i+1])throw Error('Explicit pinned public worktrees required');r[argv[i].slice(2,4)]=path.resolve(argv[i+1]);}
 for(const key of ['r1','w6']){assert(r[key]);assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:r[key],encoding:'utf8'}).trim(),PINS[key]);}return r;}
async function main(argv=process.argv.slice(2)){
 const r=roots(argv);
 const sources={r1:['rebuild/authority/crypto.cjs','rebuild/authority/canonical.cjs','rebuild/m3/w5/storage/row-codec.cjs','rebuild/m3/w5/reconciliation/codec.cjs','rebuild/m3/w5/reconciliation/project.cjs'],
  w6:['rebuild/client/ops.cjs','rebuild/client/canonical.cjs','rebuild/m4/workout/schema.cjs','rebuild/m4/workout/commands.cjs']};
 for(const [owner,files]of Object.entries(sources))for(const file of files){
  const committed=execFileSync('git',['show',PINS[owner]+':'+file],{cwd:r[owner],encoding:'utf8'});
  assert.equal(fs.readFileSync(path.join(r[owner],file),'utf8').replace(/\r\n/g,'\n'),committed.replace(/\r\n/g,'\n'),'pinned public source: '+file);
 }
 const Ops=require(path.join(r.w6,'rebuild/client/ops.cjs'));
 const Authority=require(path.join(r.r1,'rebuild/authority/crypto.cjs'));
 const {validateWorkoutShape}=require(path.join(r.w6,'rebuild/m4/workout/schema.cjs'));
 const {createWorkoutCommands}=require(path.join(r.w6,'rebuild/m4/workout/commands.cjs'));
 const {createAuthorityRowCodec}=require(path.join(r.r1,'rebuild/m3/w5/storage/row-codec.cjs'));
 const R1=require(path.join(r.r1,'rebuild/m3/w5/reconciliation/codec.cjs'));
 const {COLLECTIONS}=require(path.join(r.r1,'rebuild/m3/w5/reconciliation/project.cjs'));
 let checks=0,gaps=0;const check=(name,fn)=>{fn();checks++;console.log('PASS '+name);};
 const cell=(display,raw)=>({state:'specified',display,source_json:JSON.stringify(raw)});
 const unknown=()=>({state:'unknown',display:'Unknown in this synthetic source',source_json:null});
 const capture={profile:'earned/workout-prescription/v1',producer:{app_build:'synthetic-app',engine_build:'synthetic-engine',rule_profile:'synthetic-rule',source_schema:'synthetic-source'},
  basis:{plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic-not-qualified',source_revision:7},
  session:{instruction:cell('Synthetic training instruction','SYNTHETIC_CAPTURE_CANARY'),reason:cell('Synthetic reason','reason'),confidence:unknown()},
  slots:[40,45,40].map((load,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same-lineage',label:'Synthetic lift',
   load:cell(load+' lb',{value:load,unit:'lb'}),reps:cell('8–10',{minimum:8,maximum:10,unit:'rep'}),
   effort:i===1?cell('At least 3 reps left',{tag:'at_least',value:3,unit:'rep'}):unknown(),
   setup:cell('Synthetic setup',{position:'synthetic'}),reason:cell('Synthetic per-set reason','reason'),confidence:unknown()}))};
 const key=randomBytes(32).toString('hex');
 const spec={op_id:'synthetic-start',athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:1,predecessor:null,parents:[],
  class:'session',kind:'session-start',effective:{local_date:'2026-09-08',local_time:'08:00',utc_offset:'-04:00'},schema_version:2,lease_id:'synthetic-unissued',payload:{},
  extra:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',prescription_capture:capture}};
 const op=Ops.build(spec,key),original=JSON.stringify(op);
 check('one actual builder retains empty Start payload',()=>assert.deepEqual(op.payload,{}));
 check('actual client and authority commitment agree',()=>assert.equal(op.canonical_content_commitment,Authority.commitmentOf(op,key)));
 const nfd=structuredClone(spec),nfc=structuredClone(spec);
 nfd.extra.prescription_capture.slots[0].label='Cafe\u0301';nfc.extra.prescription_capture.slots[0].label='Caf\u00e9';
 nfd.extra.prescription_capture.slots[0].load.source_json='"Cafe\u0301"';nfc.extra.prescription_capture.slots[0].load.source_json='"Caf\u00e9"';
 const nfdOp=Ops.build(nfd,key),nfcOp=Ops.build(nfc,key);
 check('NFD/NFC originals differ in bytes',()=>assert.notEqual(JSON.stringify(nfdOp),JSON.stringify(nfcOp)));
 check('unchanged operation commitment binds NFC equivalence, not original Unicode bytes',()=>{assert.equal(nfdOp.canonical_content_commitment,nfcOp.canonical_content_commitment);assert.equal(Authority.commitmentOf(nfdOp,key),Authority.commitmentOf(nfcOp,key));});
 check('capture is included in existing commitment domain',()=>{const copy=structuredClone(op);delete copy.prescription_capture;assert.notEqual(Authority.commitmentOf(copy,key),op.canonical_content_commitment);});
 for(const field of ['label','load','reps','effort','setup','reason','confidence'])check('capture '+field+' tamper changes commitment',()=>{
  const copy=structuredClone(op);if(field==='label')copy.prescription_capture.slots[0][field]='different';else copy.prescription_capture.slots[0][field].display+=' altered';assert.notEqual(Authority.commitmentOf(copy,key),op.canonical_content_commitment);});
 check('slot order is committed',()=>{const copy=structuredClone(op);copy.prescription_capture.slots.reverse();assert.notEqual(Authority.commitmentOf(copy,key),op.canonical_content_commitment);});
 check('repeated lineage preserves distinct slots and per-set loads',()=>{assert.equal(new Set(capture.slots.map(x=>x.lift_lineage_id)).size,1);assert.equal(new Set(capture.slots.map(x=>x.logical_set_slot)).size,3);assert.deepEqual(capture.slots.map(x=>JSON.parse(x.load.source_json).value),[40,45,40]);});
 check('bounded effort remains bounded and missing remains unknown',()=>{assert.equal(JSON.parse(capture.slots[1].effort.source_json).tag,'at_least');assert.equal(capture.slots[0].effort.source_json,null);});
 check('current basic shape refuses unregistered capture field',()=>{const result=validateWorkoutShape(op);assert.equal(result.valid,false);assert.deepEqual(result.errors,['INVALID_FIELDS']);gaps++;});
 check('current command refuses unregistered capture input',()=>{assert.throws(()=>createWorkoutCommands().prepare({action:'start',input:spec.extra}),/WORKOUT_INPUT_INVALID/);gaps++;});
 const kek=await webcrypto.subtle.importKey('raw',randomBytes(32),'AES-KW',false,['wrapKey','unwrapKey']);
 const options={namespace:'synthetic-capture-probe',crypto:webcrypto,getWrappingKey:async({namespace,epoch,purpose})=>{
  assert.equal(namespace,'synthetic-capture-probe');assert.equal(epoch,'synthetic-epoch');assert(['read','write'].includes(purpose));return kek;}};
 const unicodeRaw={athlete:nfdOp.athlete_id,collection:'operations',row_id:nfdOp.op_id,value:JSON.stringify({op:nfdOp})};
 const unicodePhysical=await createAuthorityRowCodec(options).seal(unicodeRaw,{revision:6,writeEpoch:'synthetic-epoch'});
 const unicodeReopened=await createAuthorityRowCodec(options).open(unicodePhysical,{revision:7});
 check('P1 keeps original NFD bytes despite NFC-equivalent commitment',()=>{assert.equal(unicodeReopened.value,unicodeRaw.value);assert.notEqual(unicodeReopened.value,JSON.stringify({op:nfcOp}));});
 for(const collection of ['operations','log']){
  assert(COLLECTIONS.includes(collection));
  // Structurally valid raw row for the storage codec, not an admitted authority record.
  const raw={athlete:op.athlete_id,collection,row_id:collection==='log'?'1':op.op_id,value:JSON.stringify({op},null,2)+'\n'};
  const physical=await createAuthorityRowCodec(options).seal(raw,{revision:6,writeEpoch:'synthetic-epoch'});
  check(collection+' physical row hides synthetic capture canary',()=>assert(!JSON.stringify(physical).includes('SYNTHETIC_CAPTURE_CANARY')));
  const reopened=await createAuthorityRowCodec(options).open(physical,{revision:7});
  check(collection+' new codec instance returns exact original bytes',()=>assert.deepEqual(reopened,raw));
  check(collection+' recovered Start retains original commitment and capture',()=>{const stored=JSON.parse(reopened.value).op;assert.equal(JSON.stringify(stored),original);assert.equal(Authority.commitmentOf(stored,key),op.canonical_content_commitment);});
  await assert.rejects(createAuthorityRowCodec(options).open({...physical,athlete:'foreign'},{revision:7}),{code:'RETAINED_INTEGRITY'});checks++;console.log('PASS '+collection+' foreign context refuses');
 }
 const size=Buffer.byteLength(JSON.stringify({device_id:op.device_id,operation:op}));
 check('synthetic inline request fits existing byte bound',()=>assert(size<=262144));
 const tooBig=structuredClone(op);tooBig.prescription_capture.session.reason.display='x'.repeat(262144);
 check('oversized capture must not be truncated to fit',()=>assert(Buffer.byteLength(JSON.stringify({device_id:op.device_id,operation:tooBig}))>262144));
 check('strict source JSON retains decimal spelling and duplicate-key refusal',()=>{const text=' {"value":4.00,"unit":"lb"} ';assert.equal(R1.parse(text).value,4);assert.throws(()=>R1.parse('{"a":1,"\\u0061":2}'));const copy=structuredClone(op);copy.prescription_capture.slots[0].load.source_json=text;assert.equal(JSON.parse(JSON.stringify(copy)).prescription_capture.slots[0].load.source_json,text);});
 console.log('CAPTURE-START FEASIBILITY PASS '+checks+' checks; '+gaps+' current implementation gaps witnessed; synthetic request '+size+' bytes');
 console.log('NOT EXECUTED: qualified producer/basis, amended schema admission, actual D1/HTTP recovery, same-generation IndexedDB commit, browser/phone, private port.');
}
module.exports={main};if(require.main===module)main().catch(e=>{console.error('CAPTURE-START FEASIBILITY FAIL '+e.name+': '+e.message);process.exitCode=1;});
