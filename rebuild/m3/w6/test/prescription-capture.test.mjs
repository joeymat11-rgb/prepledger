import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {parseStrictJson} from '../strict-json.mjs';
import Capture from '../../../m4/workout/capture.cjs';
import Ops from '../../../client/ops.cjs';
import Authority from '../../../authority/crypto.cjs';
const {createPrescriptionCapture}=Capture;
const boundary=createPrescriptionCapture({parseStrictJson});
const cell=(display,source)=>({state:'specified',display,source_json:source});
const unknown=()=>({state:'unknown',display:'Unknown in synthetic source',source_json:null});
function fixture(){return {profile:'earned/workout-prescription/v1',producer:{app_build:'synthetic-app',engine_build:'synthetic-engine',rule_profile:'synthetic-rule',source_schema:'synthetic-source'},basis:{plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic-input',source_revision:7},
 session:{instruction:cell('Synthetic instruction','"example"'),reason:unknown(),confidence:unknown()},
 slots:[40,45,40].map((n,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'repeat-lineage',label:'Synthetic lift',load:cell(n+' lb',' {"value":'+n+'.00,"unit":"lb"} '),reps:cell('8–10','{"min":8,"max":10}'),effort:i===1?cell('At least 3','{"tag":"at_least","value":3,"unit":"rep"}'):unknown(),setup:cell('Synthetic setup','{"position":"example"}'),reason:unknown(),confidence:unknown()}))};}
const expected=()=>{const f=fixture();return {producer:f.producer,basis:f.basis};};
const prepare=(f=fixture(),e=expected())=>boundary.prepare(f,e);
const rejects=(value,e=expected())=>assert.throws(()=>prepare(value,e),{code:'WORKOUT_CAPTURE_INVALID',message:'WORKOUT_CAPTURE_INVALID'});
test('private frozen copy preserves exact JSON, order, aliases and Unicode without changing caller',()=>{
 const f=fixture();f.slots[0].label='Cafe\u0301';f.slots[0].reason=f.session.reason;
 const raw=JSON.stringify(f),out=prepare(f);assert.equal(JSON.stringify(out),raw);assert.notEqual(out,f);assert.notEqual(out.slots,f.slots);assert.equal(out.slots[0].reason,out.session.reason);
 const todo=[out],seen=new Set();while(todo.length){const v=todo.pop();if(!v||typeof v!=='object'||seen.has(v))continue;seen.add(v);assert(Object.isFrozen(v));todo.push(...Object.values(v));}
 assert(!Object.isFrozen(f));f.slots[0].load.display='changed';assert.equal(out.slots[0].load.display,'40 lb');assert.throws(()=>{out.slots[0].label='mutate';},TypeError);
});
test('preserves repeated lineage, per-set loads, bounded effort and state distinctions',()=>{
 const f=fixture();f.slots[2].effort={state:'not_prescribed',display:'Not prescribed',source_json:null};const out=prepare(f);
 assert.deepEqual(out.slots.map(x=>JSON.parse(x.load.source_json).value),[40,45,40]);assert.equal(new Set(out.slots.map(x=>x.lift_lineage_id)).size,1);
 assert.equal(JSON.parse(out.slots[1].effort.source_json).tag,'at_least');assert.deepEqual(out.slots.map(x=>x.effort.state),['unknown','specified','not_prescribed']);
});
for(const [name,edit]of Object.entries({wrongProfile:f=>f.profile='foreign',emptySlots:f=>f.slots=[],duplicateSlot:f=>f.slots[1].logical_set_slot=f.slots[0].logical_set_slot,emptyLabel:f=>f.slots[0].label='',badRevision:f=>f.basis.source_revision=0,negativeZero:f=>f.basis.source_revision=-0,fractionalRevision:f=>f.basis.source_revision=1.5,unsafeRevision:f=>f.basis.source_revision=2**53,unknownWithSource:f=>f.session.reason.source_json='null',specifiedWithoutSource:f=>f.slots[0].load.source_json=null,invalidCellState:f=>f.slots[0].load.state='resolved',emptyDisplay:f=>f.slots[0].load.display=''}))test('closed capture rejects '+name,()=>{const f=fixture();edit(f);rejects(f);});
for(const [name,select]of Object.entries({root:f=>f,producer:f=>f.producer,basis:f=>f.basis,session:f=>f.session,slot:f=>f.slots[0],cell:f=>f.slots[0].load}))test('exact keys at '+name,()=>{
 const f=fixture(),target=select(f);target.unexpected=true;rejects(f);delete target.unexpected;
 for(const k of Object.keys(target)){const old=target[k];delete target[k];rejects(f);target[k]=old;}
});
for(const k of ['app_build','engine_build','rule_profile','source_schema'])test('trusted producer mismatch '+k,()=>{const e=expected();e.producer[k]='untrusted';rejects(fixture(),e);});
for(const k of ['plan_basis','input_basis','source_revision'])test('trusted basis mismatch '+k,()=>{const e=expected();e.basis[k]=k==='source_revision'?8:'different';rejects(fixture(),e);});
test('expected context is closed descriptor-safe data, not caller authority',()=>{rejects(fixture(),{...expected(),verified:true});let calls=0;const e=expected();Object.defineProperty(e.basis,'source_revision',{enumerable:true,get(){calls++;return 7;}});rejects(fixture(),e);assert.equal(calls,0);});
for(const [name,edit]of Object.entries({getter:f=>Object.defineProperty(f.slots[0].load,'display',{enumerable:true,get(){throw Error('GETTER MUST NOT RUN');}}),symbol:f=>f[Symbol('extra')]=1,hidden:f=>Object.defineProperty(f,'hidden',{value:1}),customPrototype:f=>Object.setPrototypeOf(f.slots[0],{extra:1}),sparse:f=>delete f.slots[1],extendedArray:f=>f.slots.extra=1,cycle:f=>f.slots[0].load=f,undefined:f=>f.slots[0].label=undefined,infinity:f=>f.slots[0].label=Infinity,nan:f=>f.slots[0].label=NaN,bigint:f=>f.slots[0].label=1n,function:f=>f.slots[0].label=()=>{},unpairedLiteral:f=>f.slots[0].label='\ud800'}))test('descriptor ingress rejects '+name,()=>{const f=fixture();edit(f);rejects(f);});
test('hostile getters are never invoked',()=>{let calls=0;const f=fixture();Object.defineProperty(f.slots[0].load,'display',{enumerable:true,get(){calls++;return 'hostile';}});rejects(f);assert.equal(calls,0);});
for(const source of ['{"a":1,"\\u0061":2}','[1,]','01','1e999','\ufeff{}','"\\ud800"','{"\\udc00":1}','{"a":["\\ud800"]}','undefined',''])test('strict source JSON rejects '+JSON.stringify(source),()=>{const f=fixture();f.slots[0].load.source_json=source;rejects(f);});
for(const source of [' {"b":4.00,"a":-0} ','null','"\\ud83d\\ude00"','[true,false,null]','{"__proto__":{"safe":true}}'])test('strict original source bytes preserved '+source,()=>{const f=fixture();f.slots[0].load.source_json=source;assert.equal(prepare(f).slots[0].load.source_json,source);});
test('actual builder receives isolated frozen capture, preserving core identity and commitment',()=>{
 const f=fixture(),capture=prepare(f),key=randomBytes(32).toString('hex');
 const op=Ops.build({op_id:'synthetic-start',athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:1,predecessor:null,parents:[],class:'session',kind:'session-start',effective:{local_date:'2026-09-09',local_time:'08:00',utc_offset:'-04:00'},schema_version:2,lease_id:'synthetic-unissued',payload:{},extra:{planned_split_slot_id:'AD_HOC',plan_basis:capture.basis.plan_basis,prescription_capture:capture}},key);
 const bytes=JSON.stringify(op),commit=op.canonical_content_commitment;f.slots[0].load.display='caller mutation';assert.equal(JSON.stringify(op),bytes);assert.equal(Authority.commitmentOf(op,key),commit);assert.deepEqual(op.payload,{});
});
test('actual canonical commitment retains NFC equivalence while original captured strings remain distinct',()=>{
 const a=fixture(),b=fixture();a.slots[0].label='Cafe\u0301';b.slots[0].label='Caf\u00e9';const ca=prepare(a),cb=prepare(b),key=randomBytes(32).toString('hex');
 assert.notEqual(JSON.stringify(ca),JSON.stringify(cb));assert.equal(Authority.commitmentOf({prescription_capture:ca},key),Authority.commitmentOf({prescription_capture:cb},key));
});
test('parser is a required static integration dependency and invalid output refuses',()=>{assert.throws(()=>createPrescriptionCapture(),TypeError);assert.throws(()=>createPrescriptionCapture({parseStrictJson:()=>Promise.resolve({})}).prepare(fixture(),expected()),{code:'WORKOUT_CAPTURE_INVALID'});});
test('deep valid source JSON has no recursive-call depth limit or byte rewriting',()=>{const f=fixture(),text='['.repeat(12000)+'0'+']'.repeat(12000);f.slots[0].load.source_json=text;assert.equal(prepare(f).slots[0].load.source_json,text);});
