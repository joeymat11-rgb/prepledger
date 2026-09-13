import assert from 'node:assert/strict';import test from 'node:test';import {webcrypto} from 'node:crypto';
import {faultDatabase} from '../../../m3/w6/test/support.mjs';
import {createSleepHost} from '../../../m3/w7-preview/today/sleep-host.mjs';
const day='2030-02-04',past='2030-02-03';
const snapshot=async host=>{const c=(await host.repository.load()).generation.collections;return{ops:c.ops,outbox:c.outbox};};
const options=()=>({day,indexedDB:faultDatabase().indexedDB,crypto:webcrypto});
const stamp={local_date:day,local_time:'08:00',utc_offset:'-05:00'};
for(const[label,effective]of[['matching complete stamp',stamp],['time-only override',{...stamp,local_time:'01:23'}],['offset-only override',{...stamp,utc_offset:'+12:00'}],['null',null],['present undefined',undefined],['partial stamp',{local_date:day}]]){
 test('R6-OVERRIDE refuses '+label+' with valid clock-time night and preserves collections',async()=>{
  const host=await createSleepHost(options());
  try{
   const saved=await host.save({date:'2030-02-01',hours:0},{supersedes:null});assert.equal(saved.ok,true);
   const before=await snapshot(host);
   const result=await host.client.execute('workout',{action:'sleep-night',input:{night:{date:past,bed:'23:15',wake:'06:15'},supersedes:null,effective}});
   assert.equal(result.acknowledged,false);
   assert.deepEqual(await snapshot(host),before,'refusal preserves exact prior operation and outbox bytes');
   assert.equal((await host.forDate('2030-02-01')).at(-1).night.hours,0);
   assert.equal(host.today(),day);
  }finally{host.close();}
 });
}
test('R6-OUTER an extra request-level effective cannot supply a stamp either',async()=>{
 const host=await createSleepHost(options());try{
  const before=await snapshot(host);
  const result=await host.client.execute('workout',{action:'sleep-night',effective:stamp,input:{night:{date:past,hours:2},supersedes:null}});
  assert.equal(result.acknowledged,false);assert.deepEqual(await snapshot(host),before);
 }finally{host.close();}
});
test('R6-CORRECTION refused stamp leaves the prior revision usable for an ordinary correction',async()=>{
 const host=await createSleepHost(options());try{
  assert.equal((await host.save({date:past,hours:0},{supersedes:null})).ok,true);
  const first=(await host.forDate(past)).at(-1),before=await snapshot(host);
  const raw=(night,extra={})=>host.client.execute('workout',{action:'sleep-night',input:{night,supersedes:first.op_id,...extra}});
  assert.equal((await raw({date:past,hours:2},{effective:stamp})).acknowledged,false);
  assert.deepEqual(await snapshot(host),before);
  assert.equal((await raw({date:past,bed:'23:00',wake:'06:30',awake_min:10})).acknowledged,true);
  const after=await snapshot(host),rows=await host.forDate(past);
  assert.equal(Object.keys(after.ops).length,Object.keys(before.ops).length+1);
  assert.equal(Object.keys(after.outbox).length,Object.keys(before.outbox).length+1);
  for(const[id,value]of Object.entries(before.ops))assert.deepEqual(after.ops[id],value);
  for(const[id,value]of Object.entries(before.outbox))assert.deepEqual(after.outbox[id],value);
  assert.equal(rows.length,2);assert.equal(rows[0].op_id,first.op_id);
  assert.equal(rows[1].supersedes,first.op_id);assert.equal(rows[1].savedDate,day);
 }finally{host.close();}
});
