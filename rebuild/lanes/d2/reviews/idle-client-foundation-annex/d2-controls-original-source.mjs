// D2 PM318 independent controls. Run this exact file from <owned root>/.tmp/.
// Public synthetic fixtures only; no author test module or author outcomes loaded.
import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {IDBFactory} from 'fake-indexeddb';
import {createDurablePublicClient} from '../rebuild/m3/w6/public-client.mjs';
import {parseStrictJson} from '../rebuild/m3/w6/strict-json.mjs';
import {fixture,initial,config,O,createT2Stage,deferred} from '../rebuild/m3/w6/test/support.mjs';
import Capture from '../rebuild/m4/workout/capture.cjs';
import Commands from '../rebuild/m4/workout/commands.cjs';
import Sign from '../rebuild/m3/w5/crypto.cjs';
import Wire from '../rebuild/m3/w5/public-client.cjs';

const capture=Capture.createPrescriptionCapture({parseStrictJson});
const identity={app_build:'synthetic-app',engine_build:'synthetic-engine',rule_profile:'synthetic-rule',source_schema:'synthetic-source'};
const unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
const cell=(display,source_json)=>({state:'specified',display,source_json});
const prescription=context=>({profile:capture.profile,producer:context.producer,basis:context.basis,
  session:{instruction:cell('D2 synthetic workout','"instruction"'),reason:unknown(),confidence:unknown()},
  slots:[40,45,40].map((n,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same-lineage',label:'Synthetic lift',
    load:cell(n+' lb',JSON.stringify({value:n,unit:'lb'})),reps:cell('8 to 10','{"min":8,"max":10}'),
    effort:cell('At least 3','{"tag":"at_least","value":3,"unit":"rep"}'),setup:unknown(),reason:unknown(),confidence:unknown()}))});

// Observe native requests with listeners, never replace/redispatch onsuccess.
function observedDatabase(){
 const inner=new IDBFactory(),s={armed:false,events:[],transactions:[],writes:[],dispatches:0,withinRead:false,keep:false,
   beforeBegin:null,onHeadRead:null,afterReadMicrotask:null};
 const indexedDB={open(...a){const request=inner.open(...a);request.addEventListener('success',()=>{
  const db=request.result,nativeTransaction=db.transaction.bind(db);
  db.transaction=(...args)=>{
   const head=s.armed&&args[1]==='readonly';if(head){s.armed=false;s.events.push('head-created');s.beforeBegin?.();}
   const tx=nativeTransaction(...args);s.transactions.push({head,mode:args[1]});
   if(head){s.tx=tx;tx.addEventListener('complete',()=>s.events.push('head-complete'));tx.addEventListener('abort',()=>s.events.push('head-abort'));}
   const nativeStore=tx.objectStore.bind(tx);tx.objectStore=(name)=>{
    const store=nativeStore(name);
    for(const method of ['put','delete','clear']){const original=store[method].bind(store);store[method]=(...v)=>{s.writes.push({head,method});return original(...v);};}
    if(head){const nativeGet=store.get.bind(store);store.get=key=>{const r=nativeGet(key);r.addEventListener('success',()=>{
     s.dispatches++;s.withinRead=true;s.events.push('head-read');s.onHeadRead?.(tx);
     const keepAlive=()=>{if(s.keep){const hold=nativeGet('active');hold.addEventListener('success',keepAlive,{once:true});}};keepAlive();
     queueMicrotask(()=>{s.withinRead=false;s.events.push('read-microtask');s.afterReadMicrotask?.(tx);});
    },{once:true});return r;};}
    return store;
   };return tx;
  };
 });return request;}};
 return {inner,indexedDB,s};
}
async function connection(inner){return new Promise((resolve,reject)=>{const r=inner.open('w6-synthetic',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function records(db){return new Promise((resolve,reject)=>{const tx=db.transaction('generations','readonly'),store=tx.objectStore('generations');let keys,values;
 const k=store.getAllKeys(),v=store.getAll();k.onsuccess=()=>keys=k.result;v.onsuccess=()=>values=v.result;
 tx.oncomplete=()=>resolve(keys.map((key,i)=>[key,values[i]]));tx.onabort=()=>reject(tx.error);});}
function writer(db,record,events,{abort=false,hold=false}={}){
 const tx=db.transaction('generations','readwrite'),store=tx.objectStore('generations'),entered=deferred(),state={release:!hold};
 const done=new Promise((resolve,reject)=>{tx.oncomplete=()=>{events.push('writer-complete');resolve('complete');};tx.onabort=()=>{events.push('writer-abort');if(abort)resolve('abort');else reject(tx.error);};});
 const r=store.get('active');r.onsuccess=()=>{events.push('writer-read');if(record)store.put(record,'active');entered.resolve();
  if(abort){tx.abort();return;}const keepAlive=()=>{if(!state.release){const hold=store.get('active');hold.onsuccess=keepAlive;}};keepAlive();};
 return {done,entered:entered.promise,release(){state.release=true;}};
}
async function setup(){
 const db=observedDatabase(),f=await fixture({indexedDB:db.indexedDB}),key=Sign.generateSigningKey('d2-idle-control');
 const lease=Sign.signLease({...O.lease('dev-A'),schema_version:2,signature:undefined},key),generation=initial();generation.metadata.authorityLease=lease;
 await f.repo.initialize(generation,'synthetic-enrollment-only');
 const scope={session:1,observation:1},fault={lose:false},commands=Commands.createWorkoutCommands({prescriptionCapture:capture});
 const repo={...f.repo,withCurrentHead(expected,fn){db.s.armed=true;return f.repo.withCurrentHead(expected,fn);},
  async commit(...a){const result=await f.repo.commit(...a);if(fault.lose){fault.lose=false;throw Error('D2 lost durable reply');}return result;}};
 const args={repository:repo,stage:createT2Stage(config,{allowInbound:true,workoutCommands:commands}),namespace:f.setup.namespace,
  athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===scope.session,observationEpoch:()=>scope.observation,
  observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[Sign.publicKeyOf(key)],schemaVersion:2,crypto:webcrypto,
  prescriptionCapture:capture,workoutProducerIdentity:identity,resolveWorkoutBasis:()=>({plan_basis:'NO_ACCEPTED_PLAN',input_basis:'d2-synthetic-input',causal_parents:[]}),
  workoutProducer:(_generation,context)=>prescription(context)};
 return {...f,c:createDurablePublicClient(args),args,db,scope,fault,lease};
}
const prepare=f=>f.c.prepareWorkout({planned_split_slot_id:'d2-slot'});
const start=(f,p)=>f.c.startPreparedWorkout({preparedId:p.preparedId});
const close=(f,id)=>f.c.execute('workout',{action:'close',input:{session_start_op_id:id,completion_kind:'early',causal_parents:[id]}});
async function basis(f){const snap=await f.repo.load();return {namespace:f.setup.namespace,athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,observationEpoch:1,revision:snap.revision,token:snap.token};}
async function replace(f,publishReplacement,isReplacementCurrent=()=>true){return f.c.replaceIdleWorkoutHost(await basis(f),{isReplacementCurrent,publishReplacement});}
async function alteredRecord(f,raw,{sameRevision=false,sameIV=false}={}){
 const snap=await f.repo.load(),revision=raw.revision+(sameRevision?0:1),iv=sameIV?new Uint8Array(raw.iv):webcrypto.getRandomValues(new Uint8Array(12));
 const generation=structuredClone(snap.generation);generation.collections.futureCollection.unchanged.nested.push('D2 competing synthetic write');
 const aad=new TextEncoder().encode(JSON.stringify(['earned/local-generation/v1',1,f.setup.namespace,revision]));
 const ciphertext=await webcrypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},f.key,new TextEncoder().encode(JSON.stringify(generation)));
 return {format:1,namespace:f.setup.namespace,revision,iv,ciphertext};
}
const options={timeout:10000};

test('D2 I1 complete closed history preserves every stored byte and waits for real completion',options,async()=>{
 const f=await setup(),db=await connection(f.db.inner);let release;
 try{const a=await start(f,await prepare(f));assert.equal(a.acknowledged,true);assert.equal((await close(f,a.op_id)).acknowledged,true);const p=await prepare(f);assert.equal(p.prepared,true);
  const before=await records(db),snapshot=await f.repo.load();assert(before.some(([k])=>k==='previous'));assert.equal(before.some(([k])=>k==='recovery-adoption'),false);
  assert.equal(Object.keys(snapshot.generation.collections.ops).length,2);assert.equal(Object.keys(snapshot.generation.collections.outbox).length,2);
  const next=createDurablePublicClient(f.args),ready=deferred();let host=f.c,calls=0,settled=false;
  f.db.s.transactions=[];f.db.s.writes=[];f.db.s.keep=true;release=()=>{f.db.s.keep=false;};f.db.s.afterReadMicrotask=()=>ready.resolve();
  const promise=replace(f,()=>{calls++;assert.equal(f.db.s.withinRead,true);host=next;}).then(r=>{settled=true;return r;});
  await ready.promise;await new Promise(setImmediate);assert.equal(calls,1);assert.equal(host,next);assert.equal(settled,false,'replacement must wait for complete');
  assert.equal(f.db.s.events.includes('head-complete'),false);release();const result=await promise;
  assert.equal(result.replaced,true);assert.equal(result.stored,false);assert.equal(result.durable,false);assert.equal(f.db.s.dispatches,1);
  assert.equal((await start(f,p)).code,'SESSION_CHANGED');assert.deepEqual(await records(db),before);assert.deepEqual(await f.repo.load(),snapshot);
  assert(f.db.s.transactions.every(x=>x.mode==='readonly'));assert.deepEqual(f.db.s.writes,[]);
 }finally{release?.();db.close();f.repo.close();}
});

test('D2 I2 earlier ciphertext-only changed head defeats same revision namespace and IV claims',options,async()=>{
 const f=await setup(),db=await connection(f.db.inner);let w;
 try{const p=await prepare(f),before=await records(db),raw=before.find(([k])=>k==='active')[1],changed=await alteredRecord(f,raw,{sameRevision:true,sameIV:true});
  assert.equal(changed.revision,raw.revision);assert.deepEqual(changed.iv,raw.iv);assert.notDeepEqual(changed.ciphertext,raw.ciphertext);
  let calls=0;f.db.s.beforeBegin=()=>{w=writer(db,changed,f.db.s.events);};
  const result=await replace(f,()=>{calls++;});await w.done;
  assert.equal(result.replaced,false,'ciphertext-only competitor must refuse publication');assert.equal(result.code,'WORKOUT_REPLACEMENT_STALE');assert.equal(calls,0);assert.equal(f.db.s.dispatches,1);
  assert.equal(result.outcomeUnknown,undefined);assert.equal((await start(f,p)).code,'WORKOUT_PREPARATION_STALE');assert.equal((await prepare(f)).prepared,true);
  const after=await records(db);assert.deepEqual(after.find(([k])=>k==='active')[1],changed);assert.deepEqual(after.filter(([k])=>k!=='active'),before.filter(([k])=>k!=='active'));
 }finally{w?.release();db.close();f.repo.close();}
});

test('D2 I3 aborted earlier writer leaves the actual old head usable for publication',options,async()=>{
 const f=await setup(),db=await connection(f.db.inner);let w;
 try{const before=await records(db),changed=await alteredRecord(f,before.find(([k])=>k==='active')[1]);let calls=0;
  f.db.s.beforeBegin=()=>{w=writer(db,changed,f.db.s.events,{abort:true});};
  const result=await replace(f,()=>{calls++;});assert.equal(await w.done,'abort');assert.equal(result.replaced,true);assert.equal(calls,1);
  assert.deepEqual(await records(db),before);assert(f.db.s.events.indexOf('writer-abort')<f.db.s.events.indexOf('head-read'));assert.equal(f.db.s.dispatches,1);
 }finally{w?.release();db.close();f.repo.close();}
});

test('D2 I4 later independent writer waits and the next client still rejects its stale preparation',options,async()=>{
 const f=await setup(),db=await connection(f.db.inner);let w;
 try{const next=createDurablePublicClient(f.args),prepared=await next.prepareWorkout({planned_split_slot_id:'d2-next-slot'});assert.equal(prepared.prepared,true);
  const before=await records(db),changed=await alteredRecord(f,before.find(([k])=>k==='active')[1]);let calls=0,host=f.c;
  const result=await replace(f,()=>{calls++;assert.equal(f.db.s.events.includes('writer-read'),false);f.db.s.events.push('published');host=next;},()=>{w=writer(db,changed,f.db.s.events);return true;});
  assert.equal(result.replaced,true);assert.equal(host,next);assert.equal(calls,1);await w.done;assert.equal(f.db.s.dispatches,1);
  assert(f.db.s.events.indexOf('published')<f.db.s.events.indexOf('head-complete'));assert(f.db.s.events.indexOf('head-complete')<f.db.s.events.indexOf('writer-read'));
  assert.equal((await next.startPreparedWorkout({preparedId:prepared.preparedId})).code,'WORKOUT_PREPARATION_STALE');
  assert.equal((await next.prepareWorkout({planned_split_slot_id:'d2-next-slot'})).prepared,true);
 }finally{w?.release();db.close();f.repo.close();}
});

test('D2 I5 currentness reentrant Start is ordinary refusal and retains original command outcome',options,async()=>{
 const f=await setup();try{const p=await prepare(f);let pending,calls=0;
  const result=await replace(f,()=>{calls++;},()=>{pending=start(f,p);return true;});
  assert.equal(result.code,'WORKOUT_REPLACEMENT_BUSY','reentrant queue change must be caught before publication');assert.equal(result.outcomeUnknown,undefined);assert.equal(calls,0);
  assert.equal((await pending).acknowledged,true);assert.equal(Object.keys((await f.repo.load()).generation.collections.ops).length,1);
 }finally{f.repo.close();}
});

test('D2 I6 publisher reentrancy has explicit unknown effects while queued original commands survive',options,async()=>{
 const f=await setup();try{const p=await prepare(f),next=createDurablePublicClient(f.args);let pending,host=f.c,calls=0;
  const result=await replace(f,()=>{host=next;calls++;pending=start(f,p);});
  assert.equal(result.code,'WORKOUT_REPLACEMENT_PUBLICATION_UNKNOWN');assert.equal(result.outcomeUnknown,true);assert.equal(result.oldHandleRetired,false);assert.equal(host,next);
  const saved=await pending;assert.equal(saved.acknowledged,true);assert.equal((await close(f,saved.op_id)).acknowledged,true);
  const before=await f.repo.load();assert.equal((await replace(f,()=>{calls++;})).code,'WORKOUT_REPLACEMENT_PUBLICATION_UNRESOLVED');assert.equal(calls,1);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

test('D2 I7 lost general workout reply keeps replacement fenced through later acknowledged work',options,async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f));assert.equal(a.acknowledged,true);f.fault.lose=true;
  const lost=await close(f,a.op_id);assert.equal(lost.acknowledged,false);assert.equal(lost.code,'STAGING_FAILED');assert.equal(lost.outcomeUnknown,undefined,'original general-command shape preserved');
  assert.equal((await f.c.acceptResponse('lease',{wireVersion:Wire.WIRE_VERSION,body:{lease:f.lease}})).accepted,true);
  assert.equal((await f.c.readWorkoutHistory()).read,true);assert((await f.c.reopen()).view);
  const p=await prepare(f);assert.equal(p.prepared,true);const b=await start(f,p);assert.equal(b.acknowledged,true);assert.equal((await close(f,b.op_id)).acknowledged,true);
  const before=await f.repo.load();let calls=0;const result=await replace(f,()=>{calls++;});
  assert.equal(result.code,'WORKOUT_REPLACEMENT_WRITE_UNRESOLVED','later successful workout must not erase uncertainty');assert.equal(result.outcomeUnknown,true);assert.equal(calls,0);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

for(const fault of ['abort','close'])test(`D2 I8 ${fault} in the post-read microtask cannot revive a published old handle`,options,async()=>{
 const f=await setup(),reader=await f.fresh();try{const p=await prepare(f),before=await reader.repository.load(),next=createDurablePublicClient(f.args);let host=f.c,calls=0;
  f.db.s.afterReadMicrotask=tx=>{if(fault==='abort')tx.abort();else f.repo.close();};
  const result=await replace(f,()=>{calls++;assert.equal(f.db.s.withinRead,true);host=next;});
  assert.equal(result.code,'WORKOUT_REPLACEMENT_PUBLICATION_UNKNOWN');assert.equal(result.outcomeUnknown,true);assert.equal(result.publicationCompleted,true);assert.equal(result.oldHandleRetired,true,'failure after publication must never revive the retired client');
  assert.equal(result.failureCode,fault==='abort'?'CURRENT_HEAD_READ_ABORTED':'CURRENT_HEAD_CONNECTION_CLOSED');assert.equal(calls,1);assert.equal(host,next);assert.equal(f.db.s.dispatches,1);
  assert.equal((await start(f,p)).code,'SESSION_CHANGED');assert.deepEqual(await reader.repository.load(),before);assert.equal(f.db.s.writes.some(x=>x.head),false);
 }finally{reader.repository.close();f.repo.close();}
});
