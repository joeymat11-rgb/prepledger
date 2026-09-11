// Synthetic setup only. Real local-era/client/gym/check-in paths over fake-indexeddb.
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { openLocalDurableClient } from '../local/local-client.mjs';
import { openTodayOverLocalEra, openTodayInstallation } from '../local/today-bindings.mjs';
import { openLocalKeys } from '../local/local-keys.mjs';
import { openRepository } from '../repository.mjs';
import { faultDatabase } from './support.mjs';
import Athlete from '../../../m4/workout/athlete-state.cjs';
import { createGymModel, EFFORT_CHOICES } from '../../w7-preview/today/gym-model.mjs';
import CheckIn from '../../w7-preview/today/checkin-commands.cjs';
import { PROFILE as CHECKIN_PROFILE } from '../../w7-preview/today/checkin-host.mjs';

const DAY = '2026-09-11';
const setup = () => ({ athlete_label: 'Synthetic explicit programme',
  split: { from: DAY, map: { 0:'REST', 1:'U', 2:'REST', 3:'REST', 4:'REST', 5:'U', 6:'REST' } },
  exercises: [{ id:'synthetic-press', n:'Synthetic press', mg:'chest', day:'U', sets:1, hi:10, inc:2.5, steps:[20,22.5,25,30,40] }],
  priority_muscles: [] });
const config = indexedDB => ({ indexedDB, crypto:webcrypto, databaseName:'synthetic-initial-setup',
  namespace:'synthetic/setup', athleteId:'synthetic-athlete', deviceId:'synthetic-device',
  clock:{ today:()=>DAY, now:()=>DAY+'T13:00:00.000Z', tz:'-04:00', monotonicMs:()=>0 } });
async function clientFor(indexedDB, value=setup()) {
  const client = await openLocalDurableClient(config(indexedDB));
  assert.equal((await client.enrollSetup({setup:value})).enrolled,true);
  assert.equal((await client.boot()).ready,true);
  return client;
}
async function raw(indexedDB) {
  const c=config(indexedDB), keys=await openLocalKeys(c);
  const repository=await openRepository({...c,keyProvider:keys.keyProvider,authorizeEnrollment:()=>false});
  return {repository,close(){repository.close();keys.close();}};
}
async function change(indexedDB, edit) {
  const r=await raw(indexedDB);
  try {const s=await r.repository.load(), g=structuredClone(s.generation);edit(g);await r.repository.commit(s,g,null);}
  finally {r.close();}
}

test('explicit setup roundtrip is authoritative, exact and detached from input/output mutation',async()=>{
  const idb=new IDBFactory(), original=setup(), expected=structuredClone(original);
  let c=await clientFor(idb,original);
  original.exercises[0].inc=999;
  let result=await c.initialSetup();
  assert.equal(result.configured,true);assert.deepEqual(result.setup,expected);
  assert.equal(result.profile,'earned/local-initial-setup/v1');
  assert.equal(result.constructorProfile,Athlete.PROFILE);
  assert.equal(result.athleteId,config(idb).athleteId);assert.equal(result.createdAt,config(idb).clock.now());
  assert.deepEqual(result.basisState,Athlete.createCleanInitState({setup:expected}));
  result.setup.exercises[0].n='changed caller copy';c.close();
  c=await openLocalDurableClient(config(idb));
  const boot=await c.boot();assert.equal(boot.ready,true);
  assert.deepEqual(boot.initialSetup.setup,expected);assert.deepEqual((await c.initialSetup()).setup,expected);
  c.close();assert.equal((await c.initialSetup()).configured,false);
});

for(const [label,edit] of [
  ['absent',g=>{delete g.collections.derived;}],
  ['malformed',g=>{g.collections.derived={bad:true};}],
  ['basis stale',g=>{g.collections.derived={basis:{opCount:0,lastOpId:null},value:{fake:'must not become setup'}};}],
]) test('reconstructs after derived '+label,async()=>{
  const idb=new IDBFactory();let c=await clientFor(idb);
  assert.equal((await c.execute('weighIn',{date:DAY,lb:170.5})).acknowledged,true);c.close();
  await change(idb,edit);c=await openLocalDurableClient(config(idb));const boot=await c.boot();
  assert.equal(boot.ready,true);assert.equal(boot.derivedStale,true);assert.equal(boot.ops,1);
  assert.deepEqual(boot.initialSetup.basisState,Athlete.createCleanInitState({setup:setup()}));c.close();
});

test('no-setup enrollment stays unconfigured despite an apparently valid cleanInit cache',async()=>{
  const idb=new IDBFactory();const c=await openLocalDurableClient(config(idb));
  assert.equal((await c.enroll(Athlete.createCleanInitState({setup:setup()}))).enrolled,true);
  assert.equal((await c.boot()).initialSetup.code,'LOCAL_INITIAL_SETUP_REQUIRED');
  assert.equal((await c.initialSetup()).configured,false);
  assert.equal((await c.enrollSetup({setup:setup()})).code,'LOCAL_INITIAL_SETUP_ALREADY_ENROLLED');
  assert.equal((await c.execute('weighIn',{date:DAY,lb:170})).acknowledged,true);c.close();
});

for(const [label,edit,code] of [
  ['missing collection',g=>{delete g.collections.initialSetup;},'LOCAL_INITIAL_SETUP_AUTHORITY_MISSING'],
  ['missing marker',g=>{delete g.metadata.initialSetup;},'LOCAL_INITIAL_SETUP_AUTHORITY_MISSING'],
  ['wrong profile',g=>{g.collections.initialSetup.initial.profile='foreign';},'LOCAL_INITIAL_SETUP_PROFILE_INVALID'],
  ['wrong constructor',g=>{g.collections.initialSetup.initial.constructor_profile='foreign';},'LOCAL_INITIAL_SETUP_PROFILE_INVALID'],
  ['wrong athlete',g=>{g.collections.initialSetup.initial.athlete_id='foreign';},'LOCAL_INITIAL_SETUP_IDENTITY_MISMATCH'],
  ['wrong device',g=>{g.collections.initialSetup.initial.device_id='foreign';},'LOCAL_INITIAL_SETUP_IDENTITY_MISMATCH'],
  ['malformed setup',g=>{delete g.collections.initialSetup.initial.setup.split;},'LOCAL_INITIAL_SETUP_INVALID'],
  ['wrong enrollment time',g=>{g.collections.initialSetup.initial.created_at='2020-01-01T00:00:00Z';},'LOCAL_INITIAL_SETUP_INVALID'],
]) test('refuses '+label+' on reopened authoritative setup',async()=>{
  const idb=new IDBFactory();let c=await clientFor(idb);c.close();await change(idb,edit);
  c=await openLocalDurableClient(config(idb));const boot=await c.boot();
  assert.equal(boot.ready,false);assert.equal(boot.code,code);assert.equal(boot.state,18);
  assert.equal((await c.enrollSetup({setup:setup()})).enrolled,false);
  assert.equal((await c.initialSetup()).configured,false);c.close();
});

test('invalid input creates no authority and a valid retry can enroll',async()=>{
  const idb=new IDBFactory(),c=await openLocalDurableClient(config(idb)),bad=setup();bad.exercises[0].w=40;
  assert.equal((await c.enrollSetup({setup:bad})).enrolled,false);
  assert.equal((await c.boot()).firstRun,true);
  assert.equal((await c.enrollSetup({setup:setup()})).enrolled,true);
  assert.equal((await c.boot()).initialSetup.basisState.exercises[0].w,null);c.close();
});

test('failed enrollment never reports setup success or persists a partial authority',async()=>{
  const fault=faultDatabase(),c=await openLocalDurableClient(config(fault.indexedDB));
  fault.state.armed=true;fault.state.mode='quota';
  const result=await c.enrollSetup({setup:setup()});assert.equal(result.enrolled,false);
  fault.state.armed=false;assert.equal((await c.boot()).firstRun,true);
  assert.equal((await c.initialSetup()).configured,false);c.close();
  const again=await openLocalDurableClient(config(fault.indexedDB));
  assert.equal(again.status().state,'first-run');assert.equal((await again.enrollSetup({setup:setup()})).enrolled,true);
  assert.equal((await again.boot()).initialSetup.configured,true);again.close();
});

test('JSON-lossy setup input is refused before enrollment',async()=>{
  for (const mutate of [
    s=>{s.exercises[0].steps=[20,,30];},
    s=>{s.priority_muscles.note='cannot silently disappear';},
    s=>{Object.defineProperty(s,'athlete_label',{value:'hidden',enumerable:false});},
  ]) {
    const idb=new IDBFactory(),c=await openLocalDurableClient(config(idb)),input=setup();mutate(input);
    assert.equal((await c.enrollSetup({setup:input})).code,'LOCAL_INITIAL_SETUP_INPUT_INVALID');
    assert.equal((await c.boot()).firstRun,true);c.close();
  }
});

test('two independent factories racing enrollment leave exactly one readable authority',async()=>{
  const idb=new IDBFactory(),a=await openLocalDurableClient(config(idb)),b=await openLocalDurableClient(config(idb));
  const other=setup();other.athlete_label='Synthetic second proposal';
  const results=await Promise.all([a.enrollSetup({setup:setup()}),b.enrollSetup({setup:other})]);
  assert.equal(results.filter(r=>r.enrolled).length,1);a.close();b.close();
  const reopened=await openLocalDurableClient(config(idb));const boot=await reopened.boot();
  assert.equal(boot.ready,true);assert.deepEqual(boot.initialSetup.setup,results[0].enrolled?setup():other);reopened.close();
});

test('double submission and independent enrollment cannot replace setup',async()=>{
  const idb=new IDBFactory(),a=await openLocalDurableClient(config(idb)),b=await openLocalDurableClient(config(idb));
  const other=setup();other.athlete_label='Synthetic replacement';
  const results=await Promise.all([a.enrollSetup({setup:setup()}),a.enrollSetup({setup:other})]);
  assert.equal(results.filter(x=>x.enrolled).length,1);assert.equal(results[1].code,'LOCAL_ENROLLMENT_IN_PROGRESS');
  assert.equal((await b.enrollSetup({setup:other})).enrolled,false);
  assert.equal((await a.boot()).initialSetup.setup.athlete_label,setup().athlete_label);
  assert.equal((await a.enrollSetup({setup:other})).code,'LOCAL_INITIAL_SETUP_ALREADY_ENROLLED');a.close();b.close();
});

test('setup survives actual C4 reading, native workout and check-in, then independent synthetic generation copy/reopen',async()=>{
  const idb=new IDBFactory();let era=await openTodayOverLocalEra({...config(idb),initialSetup:setup()});
  const authority=await era.initialSetup(), original=(await era.generation()).generation.collections.initialSetup;
  const reading=await era.createReadingHost({day:DAY});assert.equal((await reading.weighIn({date:DAY,lb:170.5})).ok,true);
  const gymHost=await era.createGymHost({day:DAY,engineState:authority.basisState,plannedSplitSlotId:'synthetic/setup-day'});
  const model=createGymModel({gymHost,sessionTitle:'Synthetic'});assert.equal((await model.read()).entry.load,null);
  assert.equal((await model.start()).ok,true);let view=await model.read();
  assert.equal((await model.logSet({startId:view.startId,slot:view.set.slot,lift:view.set.lift,load:'40',reps:'10',
    effort:EFFORT_CHOICES.find(x=>x.label==='2').reserve})).ok,true);
  assert.equal((await model.finish({startId:view.startId})).ok,true);
  const checkin=await era.createCheckInHost({day:DAY,commands:CheckIn.createCheckInCommands(),profile:CHECKIN_PROFILE});
  assert.equal((await checkin.save({energy:'Moderate'})).ok,true);
  const source=(await era.generation()).generation;
  assert.deepEqual(source.collections.initialSetup,original);
  assert.equal(Object.keys(source.collections.ops).length,5);
  const savedKinds=Object.values(source.collections.ops).map(op=>op.kind);
  assert.ok(savedKinds.includes('session-set'));assert.ok(savedKinds.includes('fact'));
  reading.close();gymHost.close();checkin.close();era.close();
  // Test the serialization/copy boundary only: a separate synthetic installation
  // seals a structured-cloned generation under its own local repository key.
  // This is not a product restore API or a complete backup/key-recovery drill.
  const copied=new IDBFactory();const target=await openLocalDurableClient(config(copied));await target.enroll();target.close();
  await change(copied,g=>{for(const k of Object.keys(g))delete g[k];Object.assign(g,structuredClone(source));delete g.collections.derived;});
  era=await openTodayOverLocalEra(config(copied));
  assert.deepEqual((await era.initialSetup()).setup,setup());
  assert.deepEqual((await era.initialSetup()).basisState,authority.basisState);
  assert.deepEqual((await era.generation()).generation.collections.ops,source.collections.ops);era.close();
});

test('memoized Today setup submission cannot be silently discarded or replace the first',async()=>{
  const idb=new IDBFactory(),options={...config(idb),day:DAY};
  const era=await openTodayInstallation({...options,initialSetup:setup()});
  await assert.rejects(openTodayInstallation({...options,initialSetup:setup()}),{code:'LOCAL_INITIAL_SETUP_ALREADY_ENROLLED'});
  const again=await openTodayInstallation(options);assert.deepEqual((await again.initialSetup()).setup,setup());again.close();era.close();
  await assert.rejects(openTodayOverLocalEra({...config(idb),initialSetup:setup()}),{code:'LOCAL_INITIAL_SETUP_ALREADY_ENROLLED'});
});


// F1: fault only the final key/marker transaction; generations stay real.
function enrollmentTailFault(suffix, mode='throw') {
  const inner=new IDBFactory();let reached;const arrived=new Promise(resolve=>{reached=resolve;});
  const state={armed:true,release:false,arrived};
  const indexedDB={open(...args){
    const request=inner.open(...args);
    request.addEventListener('success',()=>{
      const db=request.result,transaction=db.transaction.bind(db);
      db.transaction=(...txArgs)=>{
        const tx=transaction(...txArgs);
        if(!state.armed||args[0]!==config(inner).databaseName+suffix||txArgs[1]!=='readwrite')return tx;
        const name=suffix==='-keys'?'keys':'markers',store=tx.objectStore(name),put=store.put.bind(store);
        store.put=(...putArgs)=>{
          state.armed=false;reached();
          if(mode==='throw')throw new DOMException('Synthetic enrollment tail fault','QuotaExceededError');
          const result=put(...putArgs);
          const hold=()=>{if(!state.release){const read=store.get(putArgs[1]);read.onsuccess=hold;}};hold();
          return result;
        };
        return tx;
      };
    });return request;
  }};
  return {indexedDB,inner,state};
}
function sealedRecord(indexedDB) {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(config(indexedDB).databaseName);
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{const db=request.result,tx=db.transaction('generations','readonly'),get=tx.objectStore('generations').get('active');
      tx.oncomplete=()=>{db.close();resolve(get.result);};tx.onabort=()=>{db.close();reject(tx.error);};};
  });
}
for(const [suffix,code,reopenCode] of [
  ['-keys','KEY_WRITE_FAILED','KEY_MISSING'],
  ['-local','LOCAL_MARKER_WRITE_FAILED','ENROLLMENT_MARKER_MISSING'],
]) test('post-commit '+suffix+' failure retires first-run and never reenrolls',async()=>{
  const fault=enrollmentTailFault(suffix),c=await openLocalDurableClient(config(fault.indexedDB));
  const result=await c.enrollSetup({setup:setup()});assert.equal(result.enrolled,false);assert.equal(result.code,code);assert.equal(result.state,18);
  const sealed=await sealedRecord(fault.inner);assert.equal(sealed.revision,1,'generation really committed before tail failure');
  assert.deepEqual(c.status(),{state:'restore-required',code});
  const boot=await c.boot();assert.equal(boot.ready,false);assert.notEqual(boot.firstRun,true);assert.equal(boot.code,code);assert.equal(boot.state,18);
  assert.equal((await c.initialSetup()).configured,false);await assert.rejects(c.hostBindings());
  const replacement=setup();replacement.athlete_label='Synthetic forbidden replacement';
  assert.equal((await c.enrollSetup({setup:replacement})).enrolled,false);
  assert.deepEqual(await sealedRecord(fault.inner),sealed);c.close();
  const next=await openLocalDurableClient(config(fault.indexedDB));
  assert.deepEqual(next.status(),{state:'restore-required',code:reopenCode});assert.equal((await next.boot()).ready,false);
  assert.equal((await next.enrollSetup({setup:replacement})).enrolled,false);assert.deepEqual(await sealedRecord(fault.inner),sealed);next.close();
});

test('post-commit delayed marker publishes neither success nor first-run until completion',async()=>{
  const fault=enrollmentTailFault('-local','delay'),c=await openLocalDurableClient(config(fault.indexedDB));
  let settled=false;const saving=c.enrollSetup({setup:setup()}).then(result=>{settled=true;return result;});
  await fault.state.arrived;
  try {
    assert.equal((await sealedRecord(fault.inner)).revision,1);
    assert.equal(settled,false);assert.equal(c.status().state,'restore-required');
    assert.equal(c.status().code,'LOCAL_ENROLLMENT_INCOMPLETE');
    const boot=await c.boot();assert.equal(boot.ready,false);assert.notEqual(boot.firstRun,true);
    assert.equal((await c.initialSetup()).configured,false);await assert.rejects(c.hostBindings());
    assert.equal((await c.enrollSetup({setup:setup()})).code,'LOCAL_ENROLLMENT_IN_PROGRESS');
  } finally {fault.state.release=true;}
  assert.equal((await saving).enrolled,true);assert.equal((await c.boot()).initialSetup.configured,true);c.close();
});
