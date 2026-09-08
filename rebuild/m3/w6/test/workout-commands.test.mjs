import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDurablePublicClient} from '../public-client.mjs';
import {config,initial,fixture,createT2Stage,O,Client,faultDatabase,mutateActive,deferred} from './support.mjs';
const require=createRequire(import.meta.url),Sign=require('../../w5/crypto.cjs');
const {createWorkoutCommands}=require('../../../m4/workout/commands.cjs');
const copy=structuredClone;
const {openRepository}=await import('../repository.mjs');
async function setup(options={}){
  const key=Sign.generateSigningKey('workout-client-synthetic'),publicKey=Sign.publicKeyOf(key);
  const lease=Sign.signLease({...O.lease('dev-A'),schema_version:options.version??2,signature:undefined},key);
  const f=await fixture(options.repository||{}),generation=initial();generation.metadata.authorityLease=lease; options.seed?.(generation);
  await f.repo.initialize(generation,'synthetic-enrollment-only');
  const provider=()=>({...config(),workoutCommands:options.profile??createWorkoutCommands(),...options.config});
  const baseStage=createT2Stage(provider,{allowInbound:true}),stage=options.wrapStage?options.wrapStage(baseStage):baseStage;
  const args={repository:f.repo,stage,namespace:f.setup.namespace,athleteId:'ath-1',deviceId:'dev-A',
    sessionEpoch:1,isCurrentSession:x=>x===1,observationEpoch:()=>1,
    observationGuard:{run:async(_kind,action)=>action()}, // Synthetic; not the missing K1 fence.
    validateCommit:()=>null,keys:[publicKey],schemaVersion:options.version??2};
  const c=createDurablePublicClient(args);return {...f,c,key,lease,provider,stage,args};
}
const start={action:'start',input:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN'}};
const set=(startId,slot='slot-A',extra={})=>({action:'set',input:{session_start_op_id:startId,
  logical_set_slot:slot,lift_lineage_id:'lift-A',load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},...extra}});
async function state(f){return (await f.repo.load()).generation;}
async function saved(f,request){const r=await f.c.execute('workout',request);assert.equal(r.acknowledged,true);return r;}
test('actual workout start and two different-load sets persist exact selected version',async()=>{
 const f=await setup();try{
  const s=await saved(f,start);const a=await saved(f,set(s.op_id));
  const b=await saved(f,set(s.op_id,'slot-B',{load:{value:35,unit:'lb'},reserve:{tag:'at_least',value:3,unit:'rep'}}));
  const g=await state(f);assert.equal(Object.keys(g.collections.ops).length,3);assert.equal(Object.keys(g.collections.outbox).length,3);
  assert.deepEqual(g.collections.ops[s.op_id].payload,{});assert.equal(g.collections.ops[a.op_id].payload.load.value,40);
  assert.equal(g.collections.ops[b.op_id].payload.load.value,35);
  for(const op of Object.values(g.collections.ops)){assert.equal(op.schema_version,2);assert.equal(op.lease_id,f.lease.lease_id);}
 }finally{f.repo.close();}
});
test('legacy schema1 command keeps its actual bytes and schema',async()=>{
 const f=await setup({version:1});try{const r=await f.c.execute('weighIn',{lb:170});assert.equal(r.acknowledged,true);
 const op=(await state(f)).collections.ops[r.op_id];assert.equal(op.schema_version,1);assert.deepEqual(op.payload,{lb:{value:170,unit:'lb'},source:'athlete'});
 }finally{f.repo.close();}
});
test('existing outer writer-schema mismatch still refuses20 without a write',async()=>{
 const f=await setup();try{const before=await f.repo.load(),r=await f.c.execute('weighIn',{lb:170});
 assert.equal(r.acknowledged,false);assert.equal(r.state,20);assert.equal(r.code,'OPERATION_SCHEMA_MISMATCH');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('known standing17 takes precedence over malformed workout input',async()=>{
 const f=await setup({config:{standing:'revoked'}});try{const before=await f.repo.load(),r=await f.c.execute('workout',{action:'bad',input:null});
 assert.equal(r.acknowledged,false);assert.equal(r.state,17);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('unknown common-field override cannot commit a workout',async()=>{
 const f=await setup();try{const request=copy(start);request.input.athlete_id='foreign';const before=await f.repo.load();
 const r=await f.c.execute('workout',request);assert.equal(r.acknowledged,false);assert.equal(r.state,3);
 assert.deepEqual(await f.repo.load(),before);assert.deepEqual(f.c.current().retainedInput,{command:'workout',args:request});
 }finally{f.repo.close();}
});
test('new workout under old lease refuses20 before validation',async()=>{
 const f=await setup({version:1});try{const before=await f.repo.load(),r=await f.c.execute('workout',{action:'bad',input:null});
 assert.equal(r.acknowledged,false);assert.equal(r.state,20);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});


test('all six commands preserve draft/active metadata and immutable history across real encrypted reopen',async()=>{
 const draft={kind:'set',lift:'unknown-legacy',set:4},active={session_id:'other-session',prescription:'unknown'};
 const f=await setup({seed:g=>{g.collections.drafts={active:draft};g.collections.meta.activeSession=active;}});
 try{
  const s=await saved(f,start),a=await saved(f,set(s.op_id)),original=copy((await state(f)).collections.ops[a.op_id]);
  await saved(f,set(s.op_id,'slot-B',{load:{value:35,unit:'lb'},reps:{value:0,unit:'rep'},reserve:{tag:'exact',value:0,unit:'rep'}}));
  await saved(f,{action:'correct',input:{target_op_id:a.op_id,lift_lineage_id:'lift-A',replacement_fields:{reserve:{tag:'at_least',value:3,unit:'rep'}}}});
  await saved(f,{action:'skip',input:{session_start_op_id:s.op_id,logical_set_slot:'slot-C',lift_lineage_id:'lift-A',skip_scope:'set',reason:'synthetic'}});
  await saved(f,{action:'close',input:{session_start_op_id:s.op_id,completion_kind:'early'}});
  await saved(f,{action:'remove',input:{target_op_id:a.op_id,lift_lineage_id:'lift-A',reason:'incorrect entry'}});
  const before=await f.repo.load();assert.deepEqual(before.generation.collections.ops[a.op_id],original);
  assert.deepEqual(before.generation.collections.drafts,{active:draft});assert.deepEqual(before.generation.collections.meta.activeSession,active);
  assert.equal(Object.keys(before.generation.collections.ops).length,7);assert.equal(Object.keys(before.generation.collections.outbox).length,7);
  f.repo.close();const fresh=await openRepository(f.setup);try{assert.deepEqual(await fresh.load(),before);}finally{fresh.close();}
 }finally{f.repo.close();}
});

for(const [label,change]of [
 ['absent reps',i=>delete i.reps],['null reps',i=>i.reps=null],['string reps',i=>i.reps={value:'8',unit:'rep'}],
 ['negative reps',i=>i.reps={value:-1,unit:'rep'}],['fractional reps',i=>i.reps={value:1.5,unit:'rep'}],
 ['null reserve',i=>i.reserve=null],['invalid lower bound',i=>i.reserve={tag:'at_least',value:2,unit:'rep'}],
 ['unknown observation with value',i=>i.reserve={tag:'unknown',value:0,unit:'rep'}],
 ['zero load',i=>i.load={value:0,unit:'lb'}],['wrong load unit',i=>i.load={value:40,unit:'kg'}],
 ['explicit null effective',i=>i.effective=null],['incomplete effective',i=>i.effective={local_date:'2026-09-04'}],
 ['forbidden schema override',i=>i.schema_version=1],['forbidden sequence override',i=>i.device_seq=99],
 ['forbidden op identity',i=>i.op_id='caller-op'],['forbidden extra',i=>i.extra={schema_version:1}],
 ['unknown field',i=>i.unexplained=true]
])test(`closed actual command refuses ${label} before durable commit`,async()=>{
 const f=await setup();try{const s=await saved(f,start),r=set(s.op_id);change(r.input);const before=await f.repo.load();
 const result=await f.c.execute('workout',r);assert.equal(result.acknowledged,false);assert.equal(result.state,3);
 assert.deepEqual(await f.repo.load(),before);assert.deepEqual(f.c.current().retainedInput,{command:'workout',args:r});
 }finally{f.repo.close();}
});

test('exact zero, absence, unknown and lower bound stay distinct stored observations',async()=>{
 const f=await setup();try{const s=await saved(f,start);
 for(const reserve of [undefined,{tag:'unknown'},{tag:'skipped'},{tag:'not_asked'},{tag:'exact',value:0,unit:'rep'},{tag:'at_least',value:3,unit:'rep'}]){
  const r=set(s.op_id,'distinct-'+Object.keys((await state(f)).collections.ops).length);if(reserve!==undefined)r.input.reserve=reserve;
  const a=await saved(f,r),p=(await state(f)).collections.ops[a.op_id].payload;
  assert.equal(Object.hasOwn(p,'reserve'),reserve!==undefined);assert.deepEqual(p.reserve,reserve);
 }
 }finally{f.repo.close();}
});

function direct(options={}){
 const lease=O.lease('dev-A');lease.schema_version=2;
 // Actual synchronous T2 committer; only the already verified lease boundary is a synthetic grant.
 const backend=Client.memoryBackend(options.collections||initial().collections);
 const c=Client.createClient({...config(),lease,backend,workoutCommands:createWorkoutCommands(),
  authorityVerification:{verifyLease:()=>true,verifyDisposition:()=>true},...options.config});c.boot();return {c,backend};
}
function seedReference(c,op,{rejected=false}={}){
 c.model.ops.set(op.op_id,copy(op));if(rejected)c.model.rejected.set(op.op_id,{op_id:op.op_id});
}
function reference(id,kind='session-start',athlete='ath-1',device='dev-B'){
 return {op_id:id,kind,class:'session',athlete_id:athlete,device_id:device,device_seq:1,lift_lineage_id:'lift-A'};
}
for(const variant of ['unknown','foreign','rejected','known-pending'])test(`explicit causal parent ${variant} checked through actual committer`,()=>{
 const {c}=direct(),id='parent';if(variant!=='unknown')seedReference(c,reference(id,'fact',variant==='foreign'?'foreign':'ath-1'),{rejected:variant==='rejected'});
 const before=copy([...c.model.ops]),r=c.workout({action:'start',input:{...start.input,causal_parents:[id]}});
 assert.equal(r.acknowledged,variant==='known-pending');
 if(variant==='known-pending')assert.deepEqual(c.envelope(r.op_id).causal_parents,[id]);
 else{assert.equal(r.state,3);assert.deepEqual([...c.model.ops],before);assert.equal(c.outbox().length,0);assert.equal(c.model.ownSeq,0);}
});
for(const variant of ['unknown','foreign','rejected','wrong-kind','lineage-mismatch'])test(`typed ${variant} target never locally Saved`,()=>{
 const {c}=direct(),id='target';if(variant!=='unknown')seedReference(c,{...reference(id,variant==='wrong-kind'?'session-start':'session-set',variant==='foreign'?'foreign':'ath-1'),lift_lineage_id:variant==='lineage-mismatch'?'lift-B':'lift-A'},{rejected:variant==='rejected'});
 const before=copy([...c.model.ops]),r=c.workout({action:'correct',input:{target_op_id:id,lift_lineage_id:'lift-A',replacement_fields:{reps:{value:6,unit:'rep'}}}});
 assert.equal(r.acknowledged,false);assert.equal(r.state,3);assert.deepEqual([...c.model.ops],before);assert.equal(c.outbox().length,0);
});
test('local known same-athlete second-device typed reference works, unknown does not',()=>{
 const {c}=direct(),request=set('remote-start');assert.equal(c.workout(request).acknowledged,false);
 // Direct model setup proves local relation only; authenticated HTTP delivery is covered separately.
 seedReference(c,reference('remote-start'));const r=c.workout(request);assert.equal(r.acknowledged,true);
 assert.equal(c.envelope(r.op_id).session_start_op_id,'remote-start');assert.deepEqual(c.envelope(r.op_id).causal_parents,[]);
});

test('provider cannot replace pinned static workout validation in actual W6 stage',async()=>{
 let called=0;const f=await setup({profile:{schemaVersion:2,prepare(){called++;return {kind:'fact',class:'reading',payload:{lb:170}};},validate(){called++;return true;}}});
 try{const before=await f.repo.load();const r=await f.c.execute('workout',{action:'unknown',input:{}});assert.equal(r.acknowledged,false);
 assert.equal(called,0);assert.deepEqual(await f.repo.load(),before);await saved(f,start);assert.equal(called,0);
 }finally{f.repo.close();}
});

for(const variant of ['missing','throw','promise','rejected-promise','nonboolean','prepare-promise','prepare-rejected','prepare-identity-override','prepare-property-throw'])test(`broken ${variant} profile has no effects or unhandled rejection`,async()=>{
 const original=createWorkoutCommands();let profile={...original};
 if(variant==='missing')profile=undefined;
 else if(variant==='throw')profile.validate=()=>{throw new Error('secret-bearing callback error');};
 else if(variant==='promise')profile.validate=()=>Promise.resolve(true);
 else if(variant==='rejected-promise')profile.validate=()=>Promise.reject(new Error('secret-bearing callback error'));
 else if(variant==='nonboolean')profile.validate=()=>({valid:true});
 else if(variant==='prepare-promise')profile.prepare=()=>Promise.resolve({});
 else if(variant==='prepare-rejected')profile.prepare=()=>Promise.reject(new Error('secret-bearing callback error'));
 else if(variant==='prepare-property-throw')profile.prepare=r=>{const a=original.prepare(r);Object.defineProperty(a,'payload',{get(){throw Error('secret-bearing callback error');}});return a;};
 else profile.prepare=r=>({...original.prepare(r),extra:{op_id:'caller-overwrite'}});
 const {c}=direct({config:{workoutCommands:profile}});const r=c.workout(copy(start));
 assert.equal(r.acknowledged,false);assert.equal(r.state,3);assert.equal(c.outbox().length,0);assert.equal(c.model.ops.size,0);
 assert.equal(c.model.ownSeq,0);assert.deepEqual(c.fieldValue('workout'),start);assert.ok(!JSON.stringify(r).includes('secret-bearing'));
 await new Promise(resolve=>setImmediate(resolve));
});

test('actual store integrity18 precedes malformed command3',async()=>{
 const f=await setup();try{await mutateActive(f.indexedDB,()=>undefined);const r=await f.c.execute('workout',{action:'bad',input:null});
 assert.equal(r.acknowledged,false);assert.equal(r.state,18);
 }finally{f.repo.close();}
});
test('valid leased command can save through expiry-only sign-in11',async()=>{
 const f=await setup({config:{signInRequired:true}});try{await saved(f,start);assert.equal(Object.keys((await state(f)).collections.outbox).length,1);}finally{f.repo.close();}
});
for(const mode of ['quota','abort','delay'])test(`actual workout IDB ${mode} preserves atomic save cut`,async()=>{
 const fault=faultDatabase(),f=await setup({repository:{indexedDB:fault.indexedDB}});
 try{const s=await saved(f,start),request=set(s.op_id,'unchanged-slot'),before=await f.repo.load();await f.c.reopen();const oldView=copy(f.c.current().view);
 fault.state.armed=true;fault.state.mode=mode==='quota'?'quota':'delay';let done=false;
 const pending=f.c.execute('workout',request).then(r=>{done=true;return r;});await fault.state.write.promise;
 if(mode!=='quota'){assert.equal(done,false);assert.deepEqual(f.c.current().view,oldView);fault.state.release=true;if(mode==='abort')fault.state.tx.abort();}
 const r=await pending;assert.equal(r.acknowledged,mode==='delay');
 if(mode==='delay'){const g=await state(f);assert.equal(g.collections.ops[r.op_id].logical_set_slot,'unchanged-slot');assert.equal(Object.keys(g.collections.outbox).length,2);}
 else{assert.equal(r.state,3);assert.deepEqual(await f.repo.load(),before);assert.deepEqual(f.c.current().retainedInput,{command:'workout',args:request});}
 }finally{fault.state.release=true;f.repo.close();}
});


test('actual independent workout clients retry one stale IDB revision without losing declared slots',async()=>{
 const staged=deferred();let count=0,retries=0;
 const f=await setup();
 const wrap=repo=>({...repo,async commit(...args){count++;if(count===2)staged.resolve();if(count<=2)await staged.promise;else retries++;return repo.commit(...args);}});
 let second;try{const s=await saved(f,start);second=await openRepository(f.setup);
 const a=createDurablePublicClient({...f.args,repository:wrap(f.repo)}),b=createDurablePublicClient({...f.args,repository:wrap(second)});
 const results=await Promise.all([a.execute('workout',set(s.op_id,'slot-A')),b.execute('workout',set(s.op_id,'slot-B',{load:{value:35,unit:'lb'}}))]);
 assert.ok(results.every(x=>x.acknowledged));assert.equal(retries,1);
 const g=(await f.repo.load()).generation,ops=Object.values(g.collections.ops);assert.equal(ops.length,3);assert.equal(Object.keys(g.collections.outbox).length,3);
 assert.deepEqual(ops.filter(o=>o.kind==='session-set').map(o=>o.logical_set_slot).sort(),['slot-A','slot-B']);
 assert.deepEqual(ops.map(o=>o.device_seq).sort(),[1,2,3]);assert.equal(g.collections.meta.device.seq,3);
 }finally{f.repo.close();second?.close();}
});

test('mapper rejects getters, malformed wrappers and caller extras without invoking accessors',()=>{
 let called=0;const mapper=createWorkoutCommands(),input={...start.input};Object.defineProperty(input,'extra',{enumerable:true,get(){called++;return {};}});
 assert.throws(()=>mapper.prepare({action:'start',input}));assert.equal(called,0);
 for(const value of [{action:'start',input:start.input,extra:{}},{action:[],input:{}},{action:'constructor',input:{}},{action:'start'},null])assert.throws(()=>mapper.prepare(value));
});

test('readOperation gives copies; a validator cannot alter a known operation',()=>{
 const profile=createWorkoutCommands(),{c}=direct({config:{workoutCommands:{...profile,validate(op,read){const parent=read('parent');parent.kind='changed';return false;}}}});
 const original=reference('parent');seedReference(c,original);assert.equal(c.workout(start).acknowledged,false);assert.deepEqual(c.envelope('parent'),original);
});


test('copied descriptor helper stays identical to accepted shared shape code',()=>{
 const fs=require('node:fs');
 const source=name=>fs.readFileSync(new URL('../../../m4/workout/'+name,import.meta.url),'utf8').replaceAll('\r\n','\n');
 const helper=text=>{const found=/function jsonData\(input\) \{[\s\S]*?\n\}/.exec(text);assert.ok(found);return found[0];};
 assert.equal(helper(source('commands.cjs')),helper(source('schema.cjs')));
});
