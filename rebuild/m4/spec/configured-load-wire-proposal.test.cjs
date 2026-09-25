'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {readLoad}=require('./configured-load-wire-proposal.cjs'),Ops=require('../../client/ops.cjs');
const Shape=require('../workout/schema.cjs'),Edit=require('../workout/edit-values.cjs');
const w6=path.resolve(__dirname,'../../../../m3-w6-browser-bridge');
const strict=import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs')).href);
const configuration=key=>({kind:'configuration',configuration_key:key});
const numeric={value:55,unit:'lb'};
function set(load){return Ops.build({op_id:'synthetic-set',athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:1,
 parents:['synthetic-start'],class:'session',kind:'session-set',schema_version:2,lease_id:'synthetic-unissued',
 effective:{local_date:'2026-09-10',local_time:'09:00',utc_offset:'-04:00'},payload:{load,reps:{value:8,unit:'rep'}},
 extra:{session_start_op_id:'synthetic-start',logical_set_slot:'synthetic-slot',lift_lineage_id:'synthetic-lift'}},'public-synthetic-key');}
test('proposed load values preserve the exact opaque configuration and existing numeric form',async()=>{
 const {parseStrictJson}=await strict;
 for(const value of [numeric,configuration('BW'),configuration('hold'),configuration('55·55·50'),configuration(' BW '),configuration('cafe\u0301')]){
  const raw=JSON.stringify(value);assert.deepEqual(readLoad(raw,parseStrictJson),value);assert.equal(JSON.stringify(value),raw);
 }
});
test('mixed, blank, absent, clear and malformed loads refuse without numeric inference',async()=>{
 const {parseStrictJson}=await strict;
 for(const value of [null,'BW','55',0,{},[],{clear:true},configuration(''),configuration('  '),configuration(55),
  {...configuration('BW'),value:0},{...numeric,kind:'configuration'},{value:0,unit:'lb'},{value:-1,unit:'lb'},{value:55,unit:'kg'}])
  assert.throws(()=>readLoad(JSON.stringify(value),parseStrictJson));
 assert.throws(()=>readLoad('{"kind":"configuration","configuration_key":"BW","configuration_key":"hold"}',parseStrictJson));
});
test('actual builder preserves configured entry but current shape and edit domain refuse it',async()=>{
 const {parseStrictJson}=await strict,load=readLoad(JSON.stringify(configuration('BW')),parseStrictJson),op=set(load);
 assert.deepEqual(op.payload.load,load);
 assert.equal(Shape.validateWorkoutShape(op).valid,false,'Current real schema gap, not admission of the proposal');
 assert.equal(Edit.validValue('load',load,2),false);
 assert.equal(Shape.validateWorkoutShape(set(numeric)).valid,true);
 assert.equal(Edit.validValue('load',numeric,2),true);
 assert.equal(Edit.validValue('load',{value:0,unit:'lb'},1),true,'Historical numeric domain stays original');
});
test('replacement uses the whole union; changed performance does not mutate recorded prescription',async()=>{
 const {parseStrictJson}=await strict,prescription=configuration('BW'),before=JSON.stringify(prescription);
 const actual=readLoad(JSON.stringify(numeric),parseStrictJson),corrected=readLoad(JSON.stringify(configuration('BW+band')),parseStrictJson);
 assert.deepEqual(actual,numeric);assert.equal(corrected.configuration_key,'BW+band');assert.equal(JSON.stringify(prescription),before);
 assert.throws(()=>readLoad(JSON.stringify({...actual,...corrected}),parseStrictJson));
 // This is value representation only; the actual nested-edit fold has not adopted it.
 assert.equal(Edit.unionPatch({load:corrected}),false);
});
test('original configuration spellings survive actual builder despite canonical NFC commitment equivalence',async()=>{
 const {parseStrictJson}=await strict;
 const a=set(readLoad(JSON.stringify(configuration('café')),parseStrictJson));
 const b=set(readLoad(JSON.stringify(configuration('cafe\u0301')),parseStrictJson));
 assert.notEqual(JSON.stringify(a),JSON.stringify(b));
 assert.notEqual(a.payload.load.configuration_key,b.payload.load.configuration_key);
 assert.equal(a.canonical_content_commitment,b.canonical_content_commitment);
});
