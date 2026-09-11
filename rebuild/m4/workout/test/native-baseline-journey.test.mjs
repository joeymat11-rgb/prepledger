import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {webcrypto} from 'node:crypto';
import {openTodayInstallation} from '../../../m3/w6/local/today-bindings.mjs';
import {createGymModel, EFFORT_CHOICES} from '../../../m3/w7-preview/today/gym-model.mjs';
import Athlete from '../athlete-state.cjs';
const require=createRequire(import.meta.url);
const {IDBFactory}=require('fake-indexeddb');
const setup={athlete_label:'synthetic-native-baseline',split:{from:'2026-09-11',map:{0:'REST',1:'U',2:'REST',3:'REST',4:'REST',5:'U',6:'REST'}},exercises:[{id:'synthetic-press',n:'Synthetic press',mg:'chest',day:'U',sets:1,hi:10,inc:5,steps:[20,25,30,35,40,45,50]}],priority_muscles:[]};
const effort=EFFORT_CHOICES.find(x=>x.label==='2').reserve;
async function journey({dropCache=false}={}) {
 const state=Athlete.createCleanInitState({setup}); const original=JSON.stringify(state), indexedDB=new IDBFactory();
 assert.equal(state.exercises[0].w,null);
 const open=async day=>{const era=await openTodayInstallation({indexedDB,crypto:webcrypto,day,cleanInit:state});const h=await era.createGymHost({day,engineState:state,plannedSplitSlotId:'synthetic/'+day});return {era,h,m:createGymModel({gymHost:h,sessionTitle:'Synthetic'})};};
 const close=a=>{a.h.close();a.era.close();};
 const record=async(a,load,reps)=>{assert.equal((await a.m.start()).ok,true);let v=await a.m.read();assert.equal((await a.m.logSet({startId:v.startId,slot:v.set.slot,lift:v.set.lift,load:String(load),reps:String(reps),effort})).ok,true);v=await a.m.read();assert.equal((await a.m.finish({startId:v.startId})).ok,true);};
 let a=await open('2026-09-11'); let v=await a.m.read();assert.match(v.prescription.line,/Find a working load/);
 await record(a,40,10);
 if(dropCache){const before=await a.h.repository.load();const generation=structuredClone(before.generation);delete generation.collections.derived;await a.h.repository.commit(before,generation,null);assert.equal((await a.h.repository.load()).generation.collections.derived,undefined);}
 close(a);
 a=await open('2026-09-14');v=await a.m.read();assert.equal(v.phase,'ready',v.code);
 assert.doesNotMatch(v.prescription.line,/Find a working load/,'native join must leave debut');
 assert.equal(a.h.host.lastProjection().accepted_state.exercises[0].w,40);
 const second=structuredClone(v.prescription);
 await record(a,45,9);close(a);
 a=await open('2026-09-18');v=await a.m.read();assert.equal(v.phase,'ready',v.code);
 assert.equal(a.h.host.lastProjection().accepted_state.exercises[0].w,45);
 assert.doesNotMatch(v.prescription.line,/Find a working load/);
 const third=structuredClone(v.prescription), projection=a.h.host.lastProjection();
 assert.equal(projection.native_baseline.decisions.length,2);
 assert.equal(Object.keys(projection.accepted_state.sessionLog).length,0);
 assert.equal(JSON.stringify(state),original);close(a);
 return {second,third};
}
test('C4 actual local store + default B-NTC: null → 40x10 → reopen → 45x9 → third prescription; cache absence is equivalent',async()=>{
 const normal=await journey(), noCache=await journey({dropCache:true});
 assert.deepEqual(noCache,normal);
 assert.equal(normal.second.line,'40 lb \u00d7 10 reps');assert.equal(normal.third.line,'45 lb \u00d7 10 reps');
 assert.match(normal.third.reason.join(' '),/one-rep step proposal/);
 console.log('NATIVE BASELINE JOURNEY',JSON.stringify(normal));
});

async function firstWorkout(loads) {
 const document=structuredClone(setup);document.exercises[0].sets=loads.length;
 const state=Athlete.createCleanInitState({setup:document}),indexedDB=new IDBFactory();
 const open=async day=>{const era=await openTodayInstallation({indexedDB,crypto:webcrypto,day,cleanInit:state});const h=await era.createGymHost({day,engineState:state,plannedSplitSlotId:'synthetic/'+day});return {era,h,m:createGymModel({gymHost:h,sessionTitle:'Synthetic'})};};
 const a=await open('2026-09-11');await a.m.read();assert.equal((await a.m.start()).ok,true);
 const ids=[];let startId;
 for(const load of loads){a.m.forget();const v=await a.m.read();startId=v.startId;
  const saved=await a.m.logSet({startId,slot:v.set.slot,lift:v.set.lift,load:String(load),reps:'10',effort});assert.equal(saved.ok,true);ids.push(saved.opId);}
 assert.equal((await a.m.finish({startId})).ok,true);a.h.close();a.era.close();
 return {a:await open('2026-09-14'),ids,startId,open};
}
test('actual correction then undo of the contributing closed Set rebuilds baseline and keeps original operations',async()=>{
 let {a,ids,startId,open}=await firstWorkout([40]);let v=await a.m.read();assert.match(v.prescription.line,/40 lb/);
 const prepared=await a.h.host.client.prepareWorkoutEdit({target_op_id:ids[0]});assert.equal(prepared.prepared,true);
 const changed=await a.h.host.client.commitWorkoutEdit({editId:prepared.editId,action:'correct',change:{load:{value:35,unit:'lb'}}});assert.equal(changed.acknowledged,true);
 a.h.close();a.era.close();a=await open('2026-09-14');v=await a.m.read();assert.match(v.prescription.line,/35 lb/);
 assert.deepEqual(a.h.host.lastProjection().native_baseline.decisions[0].original_slots[0].edit_op_ids,[changed.op_id]);
 assert.equal((await a.m.undo({startId,opId:ids[0]})).ok,true);
 a.h.close();a.era.close();a=await open('2026-09-14');v=await a.m.read();assert.match(v.prescription.line,/Find a working load/);
 const current=await a.h.repository.load();assert.equal(current.generation.collections.ops[ids[0]].payload.load.value,40);
 assert.equal(current.generation.collections.ops[changed.op_id].payload.replacement_fields.load.value,35);
 a.h.close();a.era.close();
});
test('actual unequal first original slots close durably and return structured mapping requirement on reopen',async()=>{
 const {a,ids}=await firstWorkout([40,35]);const v=await a.m.read();assert.equal(v.phase,'blocked');
 const refusal=a.h.host.lastProducerRefusal();assert.equal(refusal.code,'NATIVE_BASELINE_MAPPING_REQUIRED');
 assert.equal(refusal.reason,'scalar_and_slot_working_load_mapping');
 assert.deepEqual(refusal.baseline_requirement.original_slots.map(slot=>slot.load.value),[40,35]);
 assert.deepEqual(refusal.baseline_requirement.original_slots.map(slot=>slot.source_op_id),ids);
 assert.match(refusal.baseline_requirement.required_confirmation,/scalar.*vector/);
 const current=await a.h.repository.load();assert.deepEqual(ids.map(id=>current.generation.collections.ops[id].payload.load.value),[40,35]);
 a.h.close();a.era.close();
});

