import assert from 'node:assert/strict';
import test from 'node:test';
import {webcrypto} from 'node:crypto';
import {faultDatabase} from '../../../m3/w6/test/support.mjs';
import {createSleepHost} from '../../../m3/w7-preview/today/sleep-host.mjs';
const today='2030-02-04';
const snapshot=async host=>{const c=(await host.repository.load()).generation.collections;return{ops:c.ops,outbox:c.outbox};};
for(const [label,nightDate,effective,expected]of[
 ['normal previous-night raw producer','2030-02-03',null,true],
 ['forged future save stamp admits current night','2030-02-04',{local_date:'2030-02-05',local_time:'08:00',utc_offset:'+00:00'},false],
 ['forged future save stamp admits future night','2030-02-05',{local_date:'2030-02-06',local_time:'08:00',utc_offset:'+00:00'},false]
])test('R5-EFFECTIVE '+label,async()=>{
 const host=await createSleepHost({day:today,indexedDB:faultDatabase().indexedDB,crypto:webcrypto});
 try{
  assert.equal(host.today(),today);
  const before=await snapshot(host);
  const input={night:{date:nightDate,hours:2},supersedes:null,...(effective?{effective}:{})};
  const result=await host.client.execute('workout',{action:'sleep-night',input});
  const after=await snapshot(host),row=(await host.forDate(nightDate)).at(-1);
  const observed={acknowledged:result.acknowledged===true,opsAdded:Object.keys(after.ops).length-Object.keys(before.ops).length,outboxAdded:Object.keys(after.outbox).length-Object.keys(before.outbox).length,installationDay:host.today(),recordedSaveDate:row?.savedDate??null};
  assert.deepEqual(observed,{acknowledged:expected,opsAdded:expected?1:0,outboxAdded:expected?1:0,installationDay:today,recordedSaveDate:expected?today:null},'only the actual client clock may supply the save-time envelope');
  if(!expected)assert.deepEqual(after,before);
 }finally{host.close();}
});
