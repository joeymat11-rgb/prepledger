'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),{randomBytes}=require('node:crypto');
const w6=path.resolve(process.argv[2]||'../m3-w6-browser-bridge');
const Model=require(process.env.EARNED_ADDED_SLOT_MODEL||'./added-slot-model.cjs');
const Ops=require(path.join(w6,'rebuild/client/ops.cjs')),Commands=require(path.join(w6,'rebuild/m4/workout/commands.cjs'));
async function main(){
 const {parseStrictJson}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs')));
 const pc=require(path.join(w6,'rebuild/m4/workout/capture.cjs')).createPrescriptionCapture({parseStrictJson});
 const model=Model.createAddedSlotModel({parseStrictJson,prescriptionCapture:pc}),key=randomBytes(32).toString('hex');
 const producer={app_build:'synthetic-added-slot-model',engine_build:'no-engine-executed',rule_profile:'synthetic-athlete-added-no-machine-target',source_schema:'synthetic-only'};
 const basis={plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:1};
 const cell=(state,display,source_json=null)=>({state,display,source_json});
 const session={instruction:cell('specified','Added by athlete','"Added by athlete"'),reason:cell('unknown','Not available'),confidence:cell('not_prescribed','No confidence claim')};
 const capture={profile:Model.PROFILE,producer,basis,session,slots:[1,2].map(extension_slot=>({extension_slot,lift_lineage_id:'synthetic-lift',label:'Synthetic lift',
  load:cell('not_prescribed','Choose the load you performed'),reps:cell('not_prescribed','Record your repetitions'),effort:cell('not_prescribed','No effort target'),
  setup:cell('specified','Synthetic setup','"Synthetic setup"'),reason:cell('unknown','Not available'),confidence:cell('not_prescribed','No confidence claim')}))};
 const expected={athleteId:'synthetic-athlete',sessionStartId:'synthetic-start',producer,basis};
 function spec(id='op-synthetic-A-1'){return {op_id:id,athlete_id:expected.athleteId,device_id:'synthetic-A',device_seq:1,predecessor:null,parents:[expected.sessionStartId],
  class:'session',kind:'session-extension',effective:{local_date:'2030-02-04',local_time:'12:00',utc_offset:'-05:00'},schema_version:2,lease_id:'synthetic-unissued-lease',payload:{extension_capture:structuredClone(capture)},extra:{session_start_op_id:expected.sessionStartId}};}
 // Construct proposed bytes using the actual commitment primitive, NOT the
 // installed builder/admission. The tests below prove that those still refuse.
 function operation(id){const s=spec(id),op={op_id:s.op_id,athlete_id:s.athlete_id,device_id:s.device_id,device_seq:s.device_seq,device_predecessor_op_id:null,causal_parents:s.parents,
  class:s.class,kind:s.kind,effective:s.effective,schema_version:s.schema_version,lease_id:s.lease_id,payload:s.payload,session_start_op_id:s.extra.session_start_op_id};
  op.canonical_content_commitment=Ops.commitmentOf(op,key);return op;}
 const raw=op=>JSON.stringify(op),definition=(op=operation())=>model.readDefinition(raw(op),expected),d=definition();
 const ref=slot=>({logical_set_slot:slot.logical_set_slot,slot_definition_op_id:slot.slot_definition_op_id});
 const context={sessionStartId:expected.sessionStartId,liftLineageId:'synthetic-lift'};
 let count=0;function check(name,fn){fn();count++;console.log('PASS '+name);}
 check('actual builder and actual workout command reject the proposed unregistered operation',()=>{
  const before=JSON.stringify(Ops.KINDS);assert(!Ops.KINDS.includes('session-extension'));
  assert.throws(()=>Ops.build(spec(),key),/kind outside the A3 model/);
  assert.throws(()=>Commands.createWorkoutCommands({prescriptionCapture:pc}).prepare({action:'extend',input:{session_start_op_id:expected.sessionStartId,extension_capture:capture}}),/WORKOUT_INPUT_INVALID/);
  assert.equal(JSON.stringify(Ops.KINDS),before);
 });
 check('preparation needs no future operation ID and captures immutable displayed cells',()=>{
  const prepared=model.prepareCapture(raw(capture),{producer,basis});
  assert.deepEqual(prepared,capture);assert(prepared.slots.every(s=>!Object.hasOwn(s,'logical_set_slot')),'PRE_ID_INDICES_ONLY');
  assert(Object.isFrozen(prepared.slots[0].load));assert.equal(prepared.slots[0].extension_slot,1);
 });
 check('literal original bytes and derived identities survive repeated decode',()=>{
  const op=operation(),bytes=' \n'+JSON.stringify(op,null,2)+'\n',first=model.readDefinition(bytes,expected),again=model.readDefinition(bytes,expected);
  assert.deepEqual(first,again);assert.equal(first.operationBytes,bytes,'LITERAL_EXTENSION_BYTES');
  assert.deepEqual(first.slots.map(s=>s.logical_set_slot),[1,2].map(i=>JSON.stringify([Model.SLOT_DOMAIN,op.op_id,i])),'DERIVED_EXTENSION_IDS');
  assert.equal(first.authenticated,false);assert.equal(first.activated,false);assert.equal(first.progressionEligible,false);
 });
 check('independent extension IDs never alias one another or original two-member slot tuples',()=>{
  const a=definition(operation('op-synthetic-A-1')),b=definition(operation('op-synthetic-B-1'));
  assert.notEqual(a.slots[0].logical_set_slot,b.slots[0].logical_set_slot,'EXTENSION_ID_SEPARATION');
  assert.notEqual(a.slots[0].logical_set_slot,JSON.stringify([a.op_id,1]),'ORIGINAL_SLOT_DOMAIN_SEPARATION');
  assert.deepEqual(a.capture,b.capture);
 });
 check('raw source spelling and shared canonical NFC equivalence remain distinct guarantees',()=>{
  const a=operation(),b=structuredClone(a);a.payload.extension_capture.slots[0].label='Cafe\u0301';b.payload.extension_capture.slots[0].label='Café';
  a.canonical_content_commitment=Ops.commitmentOf(a,key);b.canonical_content_commitment=Ops.commitmentOf(b,key);
  assert.equal(a.canonical_content_commitment,b.canonical_content_commitment);assert.notEqual(raw(a),raw(b));
  assert.equal(definition(a).capture.slots[0].label,'Cafe\u0301');assert.equal(definition(b).capture.slots[0].label,'Café');
 });
 check('extension indices must exactly match their original ordered positions',()=>{
  for(const mutate of [c=>{c.slots[0].extension_slot=0;},c=>{c.slots[0].extension_slot='1';},c=>{c.slots[1].extension_slot=1;},c=>{c.slots.reverse();},c=>{c.slots[0].logical_set_slot='forged';}]){
   const value=structuredClone(capture);mutate(value);assert.throws(()=>model.prepareCapture(raw(value),{producer,basis}),{code:'EXTENSION_SLOT_INDEX_INVALID'},'INDEX_IDENTITY_REQUIRED');
  }
 });
 check('exact producer and original basis remain required on reopen',()=>{
  assert.throws(()=>model.readDefinition(d.operationBytes,{...expected,basis:{...basis,source_revision:2}}),{code:'WORKOUT_CAPTURE_INVALID'});
  assert.throws(()=>model.readDefinition(d.operationBytes,{...expected,producer:{...producer,app_build:'different'}}),{code:'WORKOUT_CAPTURE_INVALID'});
  assert.deepEqual(model.readDefinition(d.operationBytes,expected),d);
 });
 check('unknown and not-prescribed stay distinct; a supplied load is not an observation',()=>{
  const c=structuredClone(capture);c.slots[0].load=cell('specified','BW',' {"kind":"configuration","configuration_key":"BW"} ');
  const p=model.prepareCapture(raw(c),{producer,basis});assert.equal(p.slots[0].load.source_json,c.slots[0].load.source_json);
  assert.equal(p.slots[0].reason.state,'unknown');assert.equal(p.slots[1].load.state,'not_prescribed');assert(!Object.hasOwn(p.slots[0],'performed'));
  c.slots[0].reason.source_json='null';assert.throws(()=>model.prepareCapture(raw(c),{producer,basis}),{code:'WORKOUT_CAPTURE_INVALID'});
 });
 check('strict source parser and exact capture shape reject ambiguity',()=>{
  const c=structuredClone(capture);c.slots[0].load=cell('specified','BW','{"kind":"configuration","kind":"other"}');
  assert.throws(()=>model.prepareCapture(raw(c),{producer,basis}),{code:'WORKOUT_CAPTURE_INVALID'});
  const extra=structuredClone(capture);extra.op_id='future-id';assert.throws(()=>model.prepareCapture(raw(extra),{producer,basis}),{code:'EXTENSION_CAPTURE_INVALID'});
  assert.throws(()=>model.prepareCapture(capture,{producer,basis}),{code:'ORIGINAL_BYTES_REQUIRED'});
 });
 check('references bind exact definition, actual slot, Start and lift',()=>{
  const r=ref(d.slots[0]);assert.equal(model.resolveAddedReference(raw(r),d,context).extension_slot,1);
  assert.throws(()=>model.resolveAddedReference(raw({...r,slot_definition_op_id:'other'}),d,context),{code:'EXTENSION_REFERENCE_INVALID'},'EXACT_DEFINITION_REFERENCE');
  assert.throws(()=>model.resolveAddedReference(raw({...r,logical_set_slot:'missing'}),d,context),{code:'EXTENSION_SLOT_MISSING'});
  assert.throws(()=>model.resolveAddedReference(raw(r),d,{...context,sessionStartId:'foreign-start'}),{code:'EXTENSION_SCOPE_INVALID'},'EXACT_START_SCOPE');
  assert.throws(()=>model.resolveAddedReference(raw(r),d,{...context,liftLineageId:'foreign-lift'}),{code:'EXTENSION_SCOPE_INVALID'},'EXACT_LIFT_SCOPE');
 });
 const original={profile:pc.profile,producer,basis,session,slots:capture.slots.map(s=>{const {extension_slot,...rest}=s;return {logical_set_slot:JSON.stringify([s.lift_lineage_id,extension_slot]),...rest};})};
 const originalCapture=pc.prepare(original,{producer,basis});
 check('lift-skip coverage remains fixed when another extension appears later',()=>{
  const coverage=[{logical_set_slot:original.slots[0].logical_set_slot},ref(d.slots[0])],options={...context,originalCapture,definitions:[d]};
  const before=model.resolveSkipCoverage(raw(coverage),options),later=definition(operation('op-synthetic-B-1'));
  const after=model.resolveSkipCoverage(raw(coverage),{...options,definitions:[d,later]});
  assert.deepEqual(after,before,'LATER_EXTENSION_NOT_SKIPPED');assert.equal(after.length,2);
  assert(!after.some(s=>s.logical_set_slot===later.slots[0].logical_set_slot));assert(!after.some(s=>s.logical_set_slot===d.slots[1].logical_set_slot));
 });
 check('coverage rejects duplicate, missing or misattributed definitions and original slots',()=>{
  const r=ref(d.slots[0]),options={...context,originalCapture,definitions:[d]};
  assert.throws(()=>model.resolveSkipCoverage(raw([r,r]),options),{code:'SKIP_COVERAGE_INVALID'},'DUPLICATE_COVERAGE_REFUSED');
  assert.throws(()=>model.resolveSkipCoverage(raw([r]),{...options,definitions:[]}),{code:'SKIP_DEFINITION_REQUIRED'});
  assert.throws(()=>model.resolveSkipCoverage(raw([r]),{...options,definitions:[d,d]}),{code:'SKIP_DEFINITION_REQUIRED'});
  assert.throws(()=>model.resolveSkipCoverage(raw([{logical_set_slot:r.logical_set_slot}]),options),{code:'SKIP_ORIGINAL_SLOT_REQUIRED'});
  assert.throws(()=>model.resolveSkipCoverage(raw([{logical_set_slot:original.slots[0].logical_set_slot,slot_definition_op_id:d.op_id}]),options),{code:'EXTENSION_SLOT_MISSING'});
  assert.throws(()=>model.resolveSkipCoverage('[]',options),{code:'SKIP_COVERAGE_REQUIRED'});
 });
 check('old definition and output ownership cannot be changed by later input or returned reference changes',()=>{
  const op=operation(),value=definition(op),before=raw(value);op.payload.extension_capture.slots[0].label='changed';assert.equal(raw(value),before);
  const r=model.resolveAddedReference(raw(ref(value.slots[0])),value,context);r.instruction.label='changed';assert.equal(raw(value),before);
 });
 check('new representation cannot reinterpret a legacy kind, version or foreign athlete',()=>{
  for(const mutate of [o=>{o.schema_version=1;},o=>{o.kind='session-set';},o=>{o.athlete_id='foreign';},o=>{o.session_start_op_id='foreign';},o=>{o.payload.extra=true;}]){
   const op=operation();mutate(op);assert.throws(()=>definition(op),{code:'EXTENSION_OPERATION_INVALID'});
  }
 });
 console.log('ADDED SLOT MODEL '+count+' PASS');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
