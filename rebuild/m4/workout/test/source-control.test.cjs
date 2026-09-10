'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const Ops=require('../../../client/ops.cjs'),Schema=require('../schema.cjs');
const R1=path.resolve(__dirname,'../../../../../m3-w5-r1');
const Codec=require(path.join(R1,'rebuild/m3/w5/reconciliation/codec.cjs'));
const Source=require(path.join(R1,'rebuild/m3/w5/source/codec.cjs'));
const {createWorkoutProfile}=require(path.join(R1,'rebuild/m4/workout/authority-profile.cjs'));
const effective={local_date:'2026-09-10',local_time:'09:00',utc_offset:'-04:00'};
function control(rollback=false,options={}){
 const point=effective.local_date+'T'+effective.local_time+effective.utc_offset;
 return Ops.build({op_id:'synthetic-control',athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:1,
  parents:[],class:'event',kind:'fact',effective,schema_version:2,lease_id:'synthetic-unissued',
  payload:{type:rollback?'source-rollback-intent':'source-import-intent',interval:{start:point,end:point},
   source_id:'synthetic-source',material_digest:Codec.hash('synthetic','source-control'),
   ...(rollback?{target_activation_id:'original-activation'}:{})},...options},'public-synthetic-identity');
}
const validate=op=>Schema.validateSourceControlShape(op);
const rejected=op=>{const r=validate(op);assert.equal(r.valid,false);assert.deepEqual(r.references,[]);};
test('source shape extracts rollback target absent causal parents without granting the workout profile',()=>{
 const op=control(true),before=JSON.stringify(op);
 assert.deepEqual(op.causal_parents,[]);
 assert.deepEqual(validate(op),{valid:true,errors:[],references:['original-activation']});
 assert.deepEqual(validate(control()).references,[]);
 assert.deepEqual(validate(control(true,{parents:['original-activation']})).references,['original-activation']);
 assert.equal(Schema.validateContextShape(op).valid,false);
 assert.equal(createWorkoutProfile(Schema.validateWorkoutShape).validateShape(op),false);
 assert.equal(JSON.stringify(op),before);
 const result=validate(op);result.references.push('foreign');assert.deepEqual(validate(op).references,['original-activation']);
});
test('source shape refuses missing or extra envelope and payload fields and unsupported variants',()=>{
 for(const field of Object.keys(control())){const op=control();delete op[field];rejected(op);}
 for(const field of Object.keys(control(true).payload)){const op=control(true);delete op.payload[field];rejected(op);}
 for(const change of [o=>o.extra=true,o=>o.payload.extra=true,o=>o.payload.interval.extra=true,
  o=>o.schema_version=1,o=>o.schema_version=3,o=>o.class='sleep',o=>o.kind='correction',
  o=>o.payload.type='ordinary-event',o=>o.payload.target_activation_id='unexpected',
  o=>o.device_seq=0,o=>o.device_seq=1.5,o=>o.causal_parents=['x','x'],o=>o.causal_parents=[''],
  o=>o.op_id='not an identifier',o=>o.causal_parents=['not an identifier'],o=>o.device_predecessor_op_id='not an identifier',
  o=>o.device_predecessor_op_id='',o=>o.athlete_id=' ',o=>o.effective.local_date='2026-02-30']){
  const op=control();change(op);rejected(op);
 }
 const physiologic=control();physiologic.payload={type:'source-import-intent',interval:{start:'2026-09-10',end:'2026-09-10'}};
 assert.equal(Schema.validateContextShape(physiologic).valid,false);
});
test('source shape copies descriptors without executing getters or accepting non-JSON aliases',()=>{
 let reads=0;
 for(const make of [o=>Object.defineProperty(o,'payload',{enumerable:true,get(){reads++;throw Error('getter');}}),
  o=>Object.defineProperty(o.payload,'source_id',{enumerable:true,get(){reads++;throw Error('getter');}}),
  o=>Object.defineProperty(o.payload.interval,'start',{enumerable:true,get(){reads++;throw Error('getter');}}),
  o=>Object.defineProperty(o,'hidden',{value:1}),o=>{o[Symbol('x')]=true;},o=>{o.payload.loop=o;},
  o=>Object.setPrototypeOf(o.payload,{foreign:true}),o=>{o.causal_parents.length=1;},o=>{o.payload.material_digest=NaN;}]){
  const op=control();make(op);rejected(op);
 }assert.equal(reads,0);
});
test('source identifier and canonical digest domains agree with the retained R1 predicates',()=>{
 for(const field of ['source_id','target_activation_id'])for(const value of ['a','A_0.x:y-z','a'.repeat(128),'a'.repeat(129),'',' ','a b','-x','é','x\n',null,1]){
  const op=control(true);op.payload[field]=value;assert.equal(validate(op).valid,Codec.identifier(value),field+': '+String(value));
 }
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
 for(const tail of alphabet){const value='A'.repeat(42)+tail,op=control();op.payload.material_digest=value;
  assert.equal(validate(op).valid,Codec.digestValue(value),'digest tail '+tail);}
 for(const value of ['', 'A'.repeat(42),'A'.repeat(44),'A'.repeat(43)+'=','A'.repeat(43)+'\n','A'.repeat(43)+'\r\n',null,32,'+'.repeat(43)]){
  const op=control();op.payload.material_digest=value;assert.equal(validate(op).valid,Codec.digestValue(value));
 }
});
test('source declared point preserves exact accepted time spellings and refuses equivalent alternatives',()=>{
 for(const local_time of ['09:00','09:00:00','09:00:00.1','09:00:00.123'])for(const utc_offset of ['-04:00','+00:00','+23:59']){
  const op=control(true);op.effective={...effective,local_time,utc_offset};
  const point=op.effective.local_date+'T'+local_time+utc_offset;op.payload.interval={start:point,end:point};assert.equal(validate(op).valid,true);
  op.payload.interval.end=point+'0';rejected(op);
 }
 for(const interval of [{start:'2026-09-10',end:'2026-09-10'},
  {start:'2026-09-10T13:00+00:00',end:'2026-09-10T13:00+00:00'},
  {start:'2026-09-09T09:00-04:00',end:'2026-09-09T09:00-04:00'}]){const op=control(true);op.payload.interval=interval;rejected(op);}
});
test('schema1 source intent remains literal and current actual codec still refuses schema2',()=>{
 const payload={...control().payload,interval:{start:'2026-09-10',end:'2026-09-10'}};
 const original=control(false,{schema_version:1,payload});
 const bytes=JSON.stringify(original);
 Source.intent(original,'activate',original.payload.source_id,original.payload.material_digest);
 assert.equal(JSON.stringify(original),bytes);rejected(original);
 const current=control();assert.throws(()=>Source.intent(current,'activate',current.payload.source_id,current.payload.material_digest),{code:'SOURCE_INTENT'});
});
