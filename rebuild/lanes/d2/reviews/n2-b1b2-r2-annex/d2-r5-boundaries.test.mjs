import assert from 'node:assert/strict';
import test from 'node:test';
import {webcrypto} from 'node:crypto';
import {faultDatabase} from '../rebuild/m3/w6/test/support.mjs';
import {openTodayInstallation} from '../rebuild/m3/w6/local/today-bindings.mjs';
import {createSleepHost} from '../rebuild/m3/w7-preview/today/sleep-host.mjs';
import Commands from '../rebuild/m3/w7-preview/today/sleep-commands.cjs';
const snapshot=async host=>{const c=(await host.repository.load()).generation.collections;return{ops:c.ops,outbox:c.outbox};};
const counts=state=>({ops:Object.keys(state.ops).length,outbox:Object.keys(state.outbox).length});
for(const [today,night] of [['2030-03-01','2030-02-28'],['2032-03-01','2032-02-29'],['2031-01-01','2030-12-31']]){
  test('R5-DATE completed calendar boundary '+today,async()=>{
    const host=await createSleepHost({day:today,indexedDB:faultDatabase().indexedDB,crypto:webcrypto});
    try{
      const before=await snapshot(host);
      const result=await host.save({date:night,bed:'23:30',wake:'06:15',awake_min:0},{supersedes:null});
      assert.equal(result.ok,true);
      const after=await snapshot(host);
      assert.deepEqual(counts(after),{ops:counts(before).ops+1,outbox:counts(before).outbox+1});
      const row=(await host.forDate(night)).at(-1);
      assert.equal(row.night.date,night);assert.equal(row.savedDate,today);
      assert.equal(row.night.awake_min,0);
    }finally{host.close();}
  });
}
for(const mode of ['hours','times']) test('R5-DATE refuses current/future '+mode+' while preserving existing rows',async()=>{
  const host=await createSleepHost({day:'2030-02-04',indexedDB:faultDatabase().indexedDB,crypto:webcrypto});
  try{
    assert.equal((await host.save({date:'2030-02-03',hours:0},{supersedes:null})).ok,true);
    const before=await snapshot(host);
    for(const date of ['2030-02-04','2030-02-05']){
      const night=mode==='hours'?{date,hours:2}:{date,bed:'22:30',wake:'06:30'};
      assert.equal((await host.save(night,{supersedes:null})).ok,false);
      assert.deepEqual(await snapshot(host),before,'refusal keeps exact old operations and outbox entries');
    }
    assert.equal((await host.forDate('2030-02-03')).at(-1).night.hours,0);
  }finally{host.close();}
});
test('R5-CLOCK current night becomes completed on the same host after actual local clock advance',async()=>{
  const openingDay='2030-02-04';let liveDay=openingDay;
  const clock={today:()=>liveDay,now:()=>liveDay+'T13:00:00.000Z',tz:'-05:00',monotonicMs:()=>0};
  const era=await openTodayInstallation({day:openingDay,clock,indexedDB:faultDatabase().indexedDB,crypto:webcrypto});
  const host=await createSleepHost({day:openingDay,era});
  try{
    assert.equal((await host.save({date:'2030-02-01',hours:4},{supersedes:null})).ok,true);
    const held=await snapshot(host);
    assert.equal((await host.save({date:openingDay,hours:3},{supersedes:null})).ok,false);
    assert.deepEqual(await snapshot(host),held);
    liveDay='2030-02-05';
    assert.equal(host.day,openingDay);assert.equal(host.today(),liveDay);
    assert.equal((await host.save({date:openingDay,hours:3},{supersedes:null})).ok,true);
    const after=await snapshot(host);
    assert.deepEqual(counts(after),{ops:counts(held).ops+1,outbox:counts(held).outbox+1});
    for(const [id,value] of Object.entries(held.ops))assert.deepEqual(after.ops[id],value);
    for(const [id,value] of Object.entries(held.outbox))assert.deepEqual(after.outbox[id],value);
    assert.equal((await host.forDate(openingDay)).at(-1).savedDate,liveDay);
    for(const date of [liveDay,'2030-02-06']){
      assert.equal((await host.save({date,hours:3},{supersedes:null})).ok,false);
      assert.deepEqual(await snapshot(host),after);
    }
  }finally{host.close();era.close();}
});
test('R5-ENVELOPE validator rejects invalid save calendars without throwing',()=>{
  const op={kind:Commands.OP_KIND,class:Commands.OP_CLASS,payload:{profile:Commands.PROFILE,night:{date:'2030-02-03',hours:2}},causal_parents:[]};
  for(const local_date of ['2030-02-30','2030-13-01',null,20300204,{},'2030-2-04']){
    assert.equal(Commands.validate({...op,effective:{local_date}},()=>null),false);
  }
  assert.equal(Commands.validate({...op,effective:{local_date:'2030-02-04'}},()=>null),true);
});
