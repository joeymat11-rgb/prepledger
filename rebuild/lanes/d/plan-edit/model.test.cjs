'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const Commands = require('../../../m4/workout/plan-edit-commands.cjs');
const { createPlanEditProjector, planEditCollections, P2_ROW } = require('../../../m4/workout/plan-edit-model.cjs');
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
const Ops = require('../../../client/ops.cjs');
const { createHash } = require('node:crypto');
const hashBasis = text => createHash('sha256').update(text,'utf8').digest('hex');
const nameAt = require('../../../engine/plan.cjs')({}, {}).nameAt;
const copy = structuredClone, today = '2026-09-12', tomorrow = '2026-09-13';
const emptyTags = { head:null, secondary:[] };
let validateTags, projectNewTags, admittedLocalSourceBasis, sealedCollections;
test.before(async()=>{
  // F2's setup-tags.cjs is NOT on rebuild/t2-client-core: it belongs to lane D's
  // unmerged F2 package. validateTags / projectNewExerciseTags are INJECTED
  // collaborators (brief section 3), so this lane keeps a byte-identical copy of
  // the public F2 source at f3e9561 beside its cells and proves that identity in
  // f2-adapter-identity below. PLAN_EDIT_F2_MODULE points at the real module once
  // F2 lands; no plan-edit runtime file imports either one.
  const modulePath=process.env.PLAN_EDIT_F2_MODULE || './f2-tag-adapter.cjs';
  const {createSetupTagProjector}=require(modulePath);
  const {ENGINE_MG,REGION_MG}=await import('../../../m3/w7-preview/today/exercise-catalogue.mjs');
  const api=createSetupTagProjector({taxonomy:{muscles:ENGINE_MG,regions:REGION_MG}});
  validateTags=api.validateExerciseTags;projectNewTags=api.projectNewExerciseTags;
  // The REAL P2 join Today adopts through, and the REAL sealed collection list.
  ({admittedLocalSourceBasis}=await import('../../../m3/w7-preview/today/local-source-basis.mjs'));
  ({COLLECTIONS:sealedCollections}=await import('../../../m3/w6/local/local-client.mjs'));
});
function build(action, seq, predecessor, day=today) {
  return Ops.build({ ...action, op_id:'op-synthetic-'+seq, athlete_id:'synthetic-athlete', device_id:'synthetic-device',
    device_seq:seq, predecessor, effective:{local_date:day,local_time:'12:00',utc_offset:'+00:00'},
    lease_id:'synthetic-lease', schema_version:2 }, 'synthetic-test-identity');
}
function fixture({ tags=false, projectNewExerciseTags=projectNewTags }={}) {
  const setup = { athlete_label:'Synthetic',split:{from:'2026-09-01',map:{0:'REST',1:'U',2:'L',3:'REST',4:'U',5:'L',6:'REST'}},
    exercises:[{id:'press',n:'Press',mg:'chest',day:'U',sets:2,hi:8,inc:5,steps:[5,10,15]},
      {id:'other',n:'Other press',mg:'chest',day:'U',sets:2,hi:8,inc:5,steps:[5,10,15]},
      {id:'legs',n:'Legs',mg:'quads',day:'L',sets:2,hi:8,inc:5,steps:[5,10,15]}],priority_muscles:[] };
  const payload={profile:'earned/first-run-setup/v1',setup};
  if(tags)payload.tags=Object.fromEntries(setup.exercises.map(ex=>[ex.id,copy(emptyTags)]));
  const origin=build({kind:'fact',class:'event',payload},1,null,'2026-09-01');
  const state=copy(createCleanInitState({setup}));
  state.exercises[0].w=40; state.exercises[0].forks=[{from:'2026-09-02',kind:'technique',why:'Synthetic cue'}];
  state.reads=[{d:'2026-09-02',w:100}]; state.sessionLog={'2026-09-02':{entries:[{id:'press',reps:[8],w:40}]}};
  if(tags) for(const ex of state.exercises)Object.assign(ex,emptyTags,{volumeTags:{profile:'earned/setup-volume-tags/v1',op_id:origin.op_id,date:'2026-09-01',regionsByMuscle:{}}});
  const generation={collections:{ops:{[origin.op_id]:copy(origin)},rejected:{},outbox:{},sync:{snapshot:{plan:{}}}},metadata:{}};
  const make=()=>createPlanEditProjector({basisState:state,setupOperation:origin,validateTags,projectNewExerciseTags,hashBasis});
  const model=make(),commands=Commands.createPlanEditCommands({validateTags});
  const input=(edit,id='intent-1',day=today)=>{const r=model.read(generation,day);return {intent_id:id,seen_plan_basis:r.plan_basis,
    starts_on:Commands.nextLocalDate(day),edit,causal_parents:r.causal_parents};};
  function append(edit,id='intent-1',day=today) {
    const value=input(edit,id,day), rows=Object.values(generation.collections.ops), last=rows.sort((a,b)=>a.device_seq-b.device_seq).at(-1);
    const op=build(commands.prepare({action:Commands.ACTION,input:value}),last.device_seq+1,last.op_id,day);
    assert.equal(commands.validate(op,id=>generation.collections.ops[id]),true);
    generation.collections.ops[op.op_id]=op; return op;
  }
  return {setup,state,origin,generation,model,make,commands,input,append};
}
const change=(id,changes)=>({kind:'update',exercise_id:id,changes});
const fresh=id=>({id,n:'Press',mg:'chest',day:'U',sets:2,hi:8,inc:5,steps:[5,10,15]});

test('producer builds one real athlete-edited plan member and requires real parents',()=>{
  const f=fixture(),op=f.append(change('press',{sets:3}));
  assert.equal(op.members.length,1);assert.equal(op.members[0].provenance,'athlete_edited');
  assert.equal(op.group_provenance,undefined);assert.equal(op.kind,'plan-mutation');assert.equal(op.payload,null);
  assert.equal(f.commands.validate(op),true);assert.equal(f.commands.validate(op,()=>undefined),false);
});
test('basis hashing requires an explicit binding returning canonical lowercase SHA256 hex',()=>{
  const f=fixture(),options={basisState:f.state,setupOperation:f.origin,validateTags,projectNewExerciseTags:projectNewTags};
  assert.throws(()=>createPlanEditProjector(options),{code:'PLAN_EDIT_BASIS_HASH_UNAVAILABLE'});
  for(const digest of ['', 'a'.repeat(63), 'A'.repeat(64), 1, null, {then(){}}]){
    const model=createPlanEditProjector({...options,hashBasis:()=>digest});
    assert.throws(()=>model.read(f.generation,today),{code:'PLAN_EDIT_BASIS_HASH_INVALID'});
  }
  let encoded=null;const model=createPlanEditProjector({...options,hashBasis:text=>{encoded=text;return hashBasis(text);}});
  assert.equal(model.read(f.generation,today).plan_basis,f.model.read(f.generation,today).plan_basis);
  assert.equal(typeof encoded,'string');assert.ok(encoded.length>0);
});
test('private-safe request descriptor checks never execute getters',()=>{
  const f=fixture();let touched=0;const edit=change('press',{sets:3});
  Object.defineProperty(edit.changes,'n',{enumerable:true,get(){touched++;return 'surprise';}});
  assert.throws(()=>f.commands.prepare({action:Commands.ACTION,input:f.input(edit)}));assert.equal(touched,0);
  const state=copy(f.state);Object.defineProperty(state,'surprise',{enumerable:true,get(){touched++;return 1;}});
  assert.throws(()=>createPlanEditProjector({basisState:state,setupOperation:f.origin,validateTags,hashBasis}));assert.equal(touched,0);
});
test('bad prototypes, hidden or symbol fields, sparse arrays and cycles refuse',()=>{
  const f=fixture();
  for(const mutate of [x=>Object.setPrototypeOf(x.edit,{kind:'update'}),x=>Object.defineProperty(x,'hidden',{value:1}),
    x=>x[Symbol('hidden')]=1,x=>x.causal_parents=[,f.origin.op_id],x=>x.edit.changes.steps=x]){
    const input=f.input(change('press',{sets:3}));mutate(input);assert.throws(()=>Commands.validateInput(input,{validateTags}));
  }
});
test('closed changed members and exact real equipment values',()=>{
  const f=fixture();
  for(const changes of [{},{sets:1.5},{sets:0},{hi:Infinity},{inc:NaN},{steps:[5,5]},{steps:[5,,15]},{w:99},{day:'F'}])
    assert.throws(()=>Commands.validateInput(f.input(change('press',changes)),{validateTags}));
  f.append(change('press',{sets:7,hi:11,inc:2.25,steps:[3.25,8.5,19.75]}));
  const ex=f.model.read(f.generation,tomorrow).state.exercises[0];
  assert.deepEqual([ex.sets,ex.hi,ex.inc,ex.steps],[7,11,2.25,[3.25,8.5,19.75]]);assert.equal(ex.w,40);
});
test('calendar arithmetic covers leap, month, year and rejects normalized dates',()=>{
  assert.equal(Commands.nextLocalDate('2024-02-28'),'2024-02-29');assert.equal(Commands.nextLocalDate('2024-02-29'),'2024-03-01');
  assert.equal(Commands.nextLocalDate('2026-12-31'),'2027-01-01');assert.equal(Commands.nextLocalDate('0099-12-31'),'0100-01-01');
  for(const d of ['2026-02-29','2026-04-31','2026-13-01','9999-12-31','2026-09-12Z'])assert.throws(()=>Commands.nextLocalDate(d));
});
test('the built operation must start on the next authored local date',()=>{
  const f=fixture(),op=f.append(change('press',{sets:3}));
  op.members[0].value.starts_on='2026-09-14';assert.equal(f.commands.validate(op),false);
});
test('producer accepts the unchanged client HH:MM envelope and refuses malformed local time',()=>{
  const f=fixture(),op=f.append(change('press',{sets:3}));
  op.effective.local_time=new Date('2026-09-12T12:34:56.000Z').toISOString().slice(11,16);
  assert.equal(op.effective.local_time,'12:34');assert.equal(f.commands.validate(op),true);
  for(const value of ['12:34:56','24:00','12:60','1:34']){
    op.effective.local_time=value;assert.equal(f.commands.validate(op),false);
  }
});
test('data-only source remains byte-identical and every returned nested value is frozen',()=>{
  const f=fixture(),before=JSON.stringify([f.state,f.generation]);
  const a=f.model.read(f.generation,today),b=f.model.read(f.generation,tomorrow);
  assert.equal(a.plan_basis,b.plan_basis);assert.deepEqual(a.state,f.state);assert.notEqual(a.state,f.state);
  assert.equal(Object.isFrozen(a.state.exercises[0].forks[0]),true);
  assert.throws(()=>a.state.exercises[0].sets=999);assert.equal(JSON.stringify([f.state,f.generation]),before);
});
test('two pending saves compose globally while current state and history remain exact',()=>{
  const f=fixture(),history=copy(f.state.sessionLog),before=f.model.read(f.generation,today);
  f.append(change('press',{sets:3}),'first');const middle=f.model.read(f.generation,today);
  f.append(change('other',{inc:7}),'second');const current=f.model.read(f.generation,today),future=f.model.read(f.generation,tomorrow);
  assert.notEqual(before.plan_basis,middle.plan_basis);assert.notEqual(middle.plan_basis,current.plan_basis);
  assert.deepEqual(current.state,f.state);assert.equal(future.state.exercises[0].sets,3);assert.equal(future.state.exercises[1].inc,7);
  assert.deepEqual(future.state.sessionLog,history);assert.deepEqual(future.pending_dates,[]);assert.deepEqual(current.pending_dates,[tomorrow]);
});
test('rename and repeated same-date rename use names seams without technique forks',()=>{
  const f=fixture();f.append(change('press',{n:'Press renamed'}),'one');f.append(change('press',{n:'Final name'}),'two');
  const s=f.model.read(f.generation,tomorrow).state,e=s.exercises[0];
  assert.equal(nameAt(s,'press',today),'Press');assert.equal(nameAt(s,'press',tomorrow),'Final name');
  assert.deepEqual(e.forks,f.state.exercises[0].forks);assert.equal(e.w,40);assert.equal(e.id,'press');
});
test('dated remove retains old record and historical projection while excluding future order',()=>{
  const f=fixture();f.append({kind:'remove',exercise_id:'press'});
  assert.deepEqual(f.model.read(f.generation,today).state,f.state);
  const future=f.model.read(f.generation,tomorrow).state;assert.equal(future.exercises.length,3);
  assert.deepEqual(future.exercises[0],f.state.exercises[0]);assert.deepEqual(future.exOrder.U,['other']);assert.ok(future.retirements.press);
});
test('preview requires a change and has no operation or generation side effects',()=>{
  const f=fixture(),before=JSON.stringify(f.generation);
  assert.throws(()=>f.model.preview(f.generation,tomorrow,f.input(change('press',{sets:2}))),{code:'PLAN_EDIT_NO_CHANGE'});
  const p=f.model.preview(f.generation,tomorrow,f.input(change('press',{sets:3})));
  assert.equal(p.state.exercises[0].sets,3);assert.deepEqual(p.applied_ids,[]);assert.equal(JSON.stringify(f.generation),before);
});
test('actual F2 adapter proves replacement ID, unknown load, order and no borrowed history',()=>{
  const f=fixture();const op=f.append({kind:'replace',exercise_id:'press',exercise:fresh('new-press'),tags:emptyTags});
  const s=f.model.read(f.generation,tomorrow).state,ex=s.exercises.at(-1);
  assert.equal(ex.n,f.state.exercises[0].n);assert.equal(ex.w,null);assert.deepEqual(ex.forks,[]);assert.equal(ex.setup,undefined);
  assert.equal(ex.volumeTags.op_id,op.op_id);assert.deepEqual(s.exOrder.U,['new-press','other']);assert.deepEqual(s.sessionLog,f.state.sessionLog);
});
test('new ID uniqueness spans retained and pending records and stable supplied IDs survive replay',()=>{
  const f=fixture();for(const id of ['press','other'])assert.throws(()=>f.model.preview(f.generation,tomorrow,f.input({kind:'add',exercise:fresh(id),tags:emptyTags})));
  f.append({kind:'add',exercise:fresh('new-press'),tags:emptyTags});
  assert.equal(f.make().read(f.generation,tomorrow).state.exercises.at(-1).id,'new-press');
  assert.throws(()=>f.model.preview(f.generation,tomorrow,f.input({kind:'add',exercise:fresh('new-press'),tags:emptyTags},'two')));
});
test('preview has explicit tags and no fake committed tag provenance',()=>{
  const f=fixture();const p=f.model.preview(f.generation,tomorrow,f.input({kind:'add',exercise:fresh('new'),tags:emptyTags}));
  assert.deepEqual(p.state.exercises.at(-1).secondary,[]);assert.equal(p.state.exercises.at(-1).volumeTags,undefined);
  const missing=fixture({projectNewExerciseTags:null});
  assert.throws(()=>missing.model.preview(missing.generation,tomorrow,missing.input({kind:'add',exercise:fresh('new'),tags:emptyTags})),{code:'PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE'});
});
test('explicit empty original tag snapshots require exact provenance and survive rename',()=>{
  const f=fixture({tags:true});f.append(change('press',{n:'Name'}));
  assert.deepEqual(f.model.read(f.generation,tomorrow).state.exercises[0].secondary,[]);
  const state=copy(f.state);delete state.exercises[0].volumeTags;
  assert.throws(()=>createPlanEditProjector({basisState:state,setupOperation:f.origin,validateTags,hashBasis}));
  const untagged=copy(f.state);for(const k of ['head','secondary','volumeTags'])delete untagged.exercises[0][k];
  assert.throws(()=>createPlanEditProjector({basisState:untagged,setupOperation:f.origin,validateTags,hashBasis}),{code:'PLAN_EDIT_TAG_BASIS_UNPROVEN'});
});
test('malformed or borrowed new-row enrichment is refused before it can form a projection',()=>{
  for(const adapter of [(row,tags,p)=>({...projectNewTags(row,tags,p),w:40}),
    (row,tags,p)=>({...projectNewTags(row,tags,p),setup:'Borrowed note'}),
    (row,tags,p)=>projectNewTags(row,tags,{...p,op_id:'another-op'})]){
    const f=fixture({projectNewExerciseTags:adapter});f.append({kind:'add',exercise:fresh('new'),tags:emptyTags});
    assert.throws(()=>f.model.read(f.generation,today));
  }
});
test('global seen basis detects another exercise change and rejects stale preview',()=>{
  const f=fixture(),stale=f.input(change('press',{sets:3}),'stale');f.append(change('other',{sets:4}),'elsewhere');
  assert.throws(()=>f.model.preview(f.generation,tomorrow,stale),{code:'PLAN_EDIT_STALE_BASIS'});
});
test('review requires both the complete basis and exact causal parents',()=>{
  const f=fixture();f.append(change('press',{sets:3}),'first');
  const second=f.input(change('other',{sets:4}),'second');
  assert.throws(()=>f.model.preview(f.generation,tomorrow,{...second,seen_plan_basis:'forged-basis'}),{code:'PLAN_EDIT_STALE_BASIS'});
  assert.throws(()=>f.model.preview(f.generation,tomorrow,{...second,causal_parents:[f.origin.op_id]}),{code:'PLAN_EDIT_STALE_BASIS'});
});
test('qualified tombstone removes its intent and changes complete basis',()=>{
  const f=fixture(),op=f.append(change('press',{sets:3})),before=f.model.read(f.generation,today).plan_basis;
  const t=build({kind:'tombstone',class:'plan',target:op.op_id,parents:[op.op_id],payload:{reason:'Synthetic correction'}},3,op.op_id);
  f.generation.collections.ops[t.op_id]=t;const after=f.model.read(f.generation,tomorrow);
  assert.deepEqual(after.state,f.state);assert.equal(after.intents[0].status,'tombstoned');assert.notEqual(after.plan_basis,before);
});
/* R1 FINDING 2. A rejection is this companion's business only when the op it
   names is a PLAN op: the setup descriptor, a plan-mutation, or a tombstone over
   one. Another lane's rejected record is read straight through - refusing over
   it would dark-screen Edit my week for a food entry. */
function unrelated(f,day=today){
  const rows=Object.values(f.generation.collections.ops).sort((a,b)=>a.device_seq-b.device_seq),last=rows.at(-1);
  const op=build({kind:'fact',class:'event',payload:{profile:'earned/synthetic-weigh-in/v1',lb:181.5}},last.device_seq+1,last.op_id,day);
  f.generation.collections.ops[op.op_id]=op;return op;
}
test('a rejection of an operation this companion does not own reads normally',()=>{
  const f=fixture(),edit=f.append(change('press',{sets:3}),'first');
  const clean=f.model.read(f.generation,tomorrow),other=unrelated(f);
  // A refusal here is the defect under test, so it is REPORTED as one rather
  // than thrown out of the cell.
  const readOrRefusal=(model,generation,day)=>{try{return model.read(generation,day);}catch(e){return {refused:e.code||String(e)};}};
  for(const record of [{op_id:other.op_id,reason:'Synthetic rejection'},'opaque to this companion',null,['x']]){
    f.generation.collections.rejected[other.op_id]=record;
    const read=readOrRefusal(f.model,f.generation,tomorrow);
    assert.equal(read.refused,undefined,'an unrelated rejection must not refuse the plan read');
    assert.deepEqual(read.state,clean.state);assert.equal(read.plan_basis,clean.plan_basis);
    assert.deepEqual(read.causal_parents,clean.causal_parents);
    assert.equal(read.intents.length,1);assert.equal(read.intents[0].op_id,edit.op_id);
    assert.equal(read.intents[0].status,'active');
  }
  // ...and the editor over it still composes onto that plan.
  assert.equal(f.model.preview(f.generation,tomorrow,f.input(change('other',{sets:4}),'second')).state.exercises[1].sets,4);
});
/* NOTHING PROVES A PLAN REJECTION HERE, so no shape of record buys one: a
   local installation admits no authority disposition, and an index entry that
   names its own op exactly is still only an index entry. This is the model half
   of PE09-rejection in durable-host.test.mjs. */
test('a PLAN rejection refuses whatever shape it has and never excludes an edit',()=>{
  const f0=fixture(),edit0=f0.append(change('press',{sets:3}),'first');
  for(const record of [{op_id:edit0.op_id},{op_id:edit0.op_id,kind:'plan-mutation'},
    {op_id:'op-synthetic-99'},{reason:'no op named'},'rejected',null,[],42]){
    const f=fixture(),first=f.append(change('press',{sets:3}),'first');
    f.generation.collections.rejected[first.op_id]=record;
    assert.throws(()=>f.model.read(f.generation,tomorrow),{code:'PLAN_EDIT_REJECTION_UNPROVEN'});
    assert.deepEqual(f.generation.collections.rejected[first.op_id],record,'the record is kept intact');
  }
  // A descendant of the rejected edit changes nothing: the read still refuses in
  // the same words rather than rebasing the athlete's later edit.
  const g=fixture(),parent=g.append(change('press',{sets:3}),'first');g.append(change('other',{sets:4}),'second');
  g.generation.collections.rejected[parent.op_id]={op_id:parent.op_id};
  assert.throws(()=>g.model.read(g.generation,tomorrow),{code:'PLAN_EDIT_REJECTION_UNPROVEN'});
});
test('a rejection naming no operation of this generation cannot be shown unrelated and refuses',()=>{
  const f=fixture();f.append(change('press',{sets:3}),'first');
  f.generation.collections.rejected['op-synthetic-absent']={op_id:'op-synthetic-absent'};
  assert.throws(()=>f.model.read(f.generation,tomorrow),{code:'PLAN_EDIT_REJECTION_UNPROVEN'});
  // A tombstone whose target chain never reaches a plan op (here, itself) is
  // equally unclassifiable, so it is plan-class and refuses like one.
  const g=fixture(),rows=Object.values(g.generation.collections.ops);
  const loop=build({kind:'tombstone',class:'plan',target:'op-synthetic-9',parents:[],payload:{reason:'Synthetic'}},9,rows[0].op_id);
  g.generation.collections.ops[loop.op_id]=loop;assert.equal(loop.target_op_id,loop.op_id);
  g.generation.collections.rejected[loop.op_id]={op_id:loop.op_id};
  assert.throws(()=>g.model.read(g.generation,tomorrow),{code:'PLAN_EDIT_REJECTION_UNPROVEN'});
});
/* The setup descriptor and a tombstone over a plan edit are plan-class through
   their own routes: identity, and one hop down the target chain. Both refuse
   before the branch that used to read the record downstream, which is why that
   branch is retired rather than left behind. */
test('a rejected setup descriptor and a rejected plan tombstone are plan-class and refuse',()=>{
  const f=fixture();f.append(change('press',{sets:3}),'first');
  f.generation.collections.rejected[f.origin.op_id]={op_id:f.origin.op_id};
  assert.throws(()=>f.model.read(f.generation,tomorrow),{code:'PLAN_EDIT_REJECTION_UNPROVEN'});
  const g=fixture(),op=g.append(change('press',{sets:3}));
  const t=build({kind:'tombstone',class:'plan',target:op.op_id,parents:[op.op_id],payload:{reason:'Synthetic correction'}},3,op.op_id);
  g.generation.collections.ops[t.op_id]=t;
  assert.equal(g.model.read(g.generation,tomorrow).intents[0].status,'tombstoned','the tombstone alone is honoured');
  g.generation.collections.rejected[t.op_id]={op_id:t.op_id};
  assert.throws(()=>g.model.read(g.generation,tomorrow),{code:'PLAN_EDIT_REJECTION_UNPROVEN'});
});
test('missing, cyclical or incomparable causal history refuses instead of sequence-wins',()=>{
  for(const mutate of [(op)=>op.causal_parents=['missing'],op=>op.causal_parents=[op.op_id],op=>op.causal_parents=[]]){
    const f=fixture(),op=f.append(change('press',{sets:3}));mutate(op);assert.throws(()=>f.model.read(f.generation,tomorrow));
  }
  const f=fixture();f.append(change('press',{sets:3}),'one');const second=f.append(change('other',{sets:4}),'two');second.causal_parents=[f.origin.op_id];
  assert.throws(()=>f.model.read(f.generation,tomorrow),{code:'PLAN_EDIT_BASIS_INVALIDATED'});
});
test('source identity, foreign-device, imported frontier and unknown training members refuse',()=>{
  for(const mutate of [f=>f.generation.collections.sourceImports={x:{}},f=>f.generation.collections.sync.frontier={W:1},
    f=>f.generation.collections.ops[f.origin.op_id].device_id='foreign',f=>f.state.exercises[0].sets=8]){
    const f=fixture();mutate(f);assert.throws(()=>f.make().read(f.generation,today));
  }
  const f=fixture(),op=f.append(change('press',{sets:3}));op.members[0].field='unknown';assert.throws(()=>f.model.read(f.generation,today));
});
test('another athlete label or unsupported plan context cannot masquerade as the whole programme',()=>{
  const f=fixture();f.state.athlete_label='Other';assert.throws(()=>f.make(),{code:'PLAN_EDIT_ORIGIN_UNPROVEN'});
  for(const collection of ['plan','planTransactions']){const g=fixture();g.generation.collections[collection]={accepted:{members:[]}};
    assert.throws(()=>g.model.read(g.generation,today),{code:'PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT'});}
  const g=fixture(),op=g.append(change('press',{sets:3}));op.conflict_domain_id='other-domain';
  assert.throws(()=>g.model.read(g.generation,today),{code:'PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT'});
});
test('full-body calendar covers both lift families while uncovered days refuse',()=>{
  const f=fixture();f.setup.split.map={0:'REST',1:'F',2:'REST',3:'F',4:'REST',5:'F',6:'REST'};
  f.state.split=[copy(f.setup.split)];f.origin.payload.setup=copy(f.setup);
  f.origin.canonical_content_commitment=Ops.commitmentOf(f.origin,'synthetic-test-identity');f.generation.collections.ops[f.origin.op_id]=copy(f.origin);
  const model=f.make(),r=model.read(f.generation,today),input={intent_id:'F',seen_plan_basis:r.plan_basis,starts_on:tomorrow,causal_parents:r.causal_parents,edit:change('press',{day:'L'})};
  assert.equal(model.preview(f.generation,tomorrow,input).state.exercises[0].day,'L');
  const g=fixture();g.state.split[0].map={0:'REST',1:'U',2:'REST',3:'REST',4:'U',5:'REST',6:'REST'};
  g.origin.payload.setup.split=copy(g.state.split[0]);g.origin.canonical_content_commitment=Ops.commitmentOf(g.origin,'synthetic-test-identity');g.generation.collections.ops[g.origin.op_id]=copy(g.origin);
  const gm=g.make(),gr=gm.read(g.generation,today);
  assert.throws(()=>gm.preview(g.generation,tomorrow,{...input,seen_plan_basis:gr.plan_basis,causal_parents:gr.causal_parents}),{code:'PLAN_EDIT_DAY_UNCOVERED'});
});

/* ===== PE16 / P0-B + P2. WHOSE STATE THE PROJECTOR EDITS =====
   today-app.cjs adoptAthleteState adopts admittedLocalSourceState(setup) when
   this generation carries an admitted import and setup.athleteState() (the
   clean-init constructor over the stored setup document) when it does not. The
   companion edits the SAME state and proves which one it was handed against the
   generation itself, through the SAME local-source-basis.mjs join. */
const SELECTION='local-source:synthetic-plan-edit';
const NS='synthetic-plan-edit/device-A';
function importedFixture({ label='Synthetic', namespace=NS, mutate=null, varyBasis=null }={}) {
  const f=fixture({tags:true});
  // His own file: his own name for one lift, its rename history, and readings
  // from before this installation existed. None of it is in the setup document.
  const imported=copy(f.state);
  imported.exercises[0].n='Flat bench';
  imported.exercises[0].renames=[{from:'2026-08-20',prevN:'Bench press'}];
  imported.reads=[{d:'2026-08-01',w:181.2},{d:'2026-09-02',w:100}];
  /* P3-PORT-FIX cell (k). The FILE's own programme, varied ONE thing at a time,
     BEFORE the committed view is built from it, so the admitted-basis join still
     sees one record and the cell is measuring the predicate and nothing else. */
  if(varyBasis)varyBasis(imported,f);
  const basis={profile:'earned/local-source-basis/v1',installation_id:namespace,local_selection_id:SELECTION};
  const view={ready:true,pending:false,issues:[],basis:copy(basis),state:copy(imported)};
  f.generation.metadata.localSources={selections:{[SELECTION]:{id:SELECTION}},active:SELECTION};
  f.generation.metadata.localSourceApplication={selection_id:SELECTION,core_complete:true,basis:copy(basis)};
  f.generation.collections.derived={localSource:{basis:copy(basis),view}};
  if(mutate)mutate({generation:f.generation,view,marker:f.generation.metadata.localSourceApplication});
  const make=(state=imported,basisSource='local-source')=>createPlanEditProjector({basisState:state,
    setupOperation:f.origin,validateTags,projectNewExerciseTags:projectNewTags,hashBasis,basisSource,
    admittedBasisOf:g=>admittedLocalSourceBasis(g,{athleteLabel:label,namespace})});
  return {...f,imported,view,make};
}
test('PE16 an admitted import is the basis and must be the state handed over',()=>{
  const f=importedFixture(),read=f.make().read(f.generation,today);
  assert.equal(read.state.exercises[0].n,'Flat bench','his own name, not the setup document');
  assert.deepEqual(read.state.exercises[0].renames,[{from:'2026-08-20',prevN:'Bench press'}]);
  assert.deepEqual(read.state.reads,[{d:'2026-08-01',w:181.2},{d:'2026-09-02',w:100}],'imported history survives');
  // A rename composes with the imported rename seam; neither is lost.
  const input={intent_id:'imported-rename',seen_plan_basis:read.plan_basis,starts_on:tomorrow,
    causal_parents:read.causal_parents,edit:change('press',{n:'Incline bench'})};
  const after=f.make().preview(f.generation,tomorrow,input).state.exercises[0];
  assert.equal(after.n,'Incline bench');
  assert.deepEqual(after.renames,[{from:'2026-08-20',prevN:'Bench press'},{from:tomorrow,prevN:'Flat bench'}]);
  const projected={exercises:[after]};
  assert.equal(nameAt(projected,'press','2026-08-19'),'Bench press','the imported pre-rename name survives');
  assert.equal(nameAt(projected,'press',today),'Flat bench','today still reads his imported name');
  assert.equal(nameAt(projected,'press',tomorrow),'Incline bench','and the edit starts tomorrow');
  // The clean-init state is NOT this generation's basis, and saying so refuses.
  assert.throws(()=>f.make(f.state).read(f.generation,today),{code:'PLAN_EDIT_IMPORTED_BASIS_MISMATCH'});
});
test('PE16 an unadmitted import refuses and never falls back to the clean-init basis',()=>{
  const faults=[
    ['not ready',({view})=>{view.ready=false;}],
    ['still pending',({view})=>{view.pending=true;}],
    ['an unresolved issue',({view})=>{view.issues=[{code:'LOCAL_SOURCE_READING_UNRESOLVED'}];}],
    ['core not complete',({marker})=>{marker.core_complete=false;}],
    ['a superseded selection',({generation})=>{generation.metadata.localSources.active='local-source:other';}],
    ['a disagreeing basis copy',({view})=>{view.basis.installation_id='another-installation';}],
    ['no admitted marker at all',({generation})=>{delete generation.metadata.localSourceApplication;}]];
  for(const [why,mutate] of faults){
    const f=importedFixture({mutate});
    assert.throws(()=>f.make().read(f.generation,today),{code:'PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE'},why);
  }
  // Another athlete's numbers, and another installation's admitted import: both
  // are records this device may hold and neither is a plan this device may edit.
  const elsewhere=({view,generation})=>{ for(const b of [view.basis,generation.collections.derived.localSource.basis,
    generation.metadata.localSourceApplication.basis]) b.installation_id='another-installation/device-B'; };
  for(const wrong of [{label:'Someone else'},{mutate:elsewhere}]){
    const f=importedFixture(wrong);
    assert.throws(()=>f.make().read(f.generation,today),{code:'PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE'});
  }
  // THE FALLBACK IS THE DEFECT. A projector that was handed the clean-init state
  // cannot project over a generation that carries an import, admitted or not.
  const g=importedFixture();
  assert.throws(()=>g.make(g.state,'first-run').read(g.generation,today),{code:'PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE'});
  const clean=fixture({tags:true});
  assert.throws(()=>createPlanEditProjector({basisState:clean.state,setupOperation:clean.origin,validateTags,
    projectNewExerciseTags:projectNewTags,hashBasis,basisSource:'local-source',
    admittedBasisOf:()=>null}).read(clean.generation,today),{code:'PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE'});
  assert.throws(()=>createPlanEditProjector({basisState:clean.state,setupOperation:clean.origin,validateTags,
    hashBasis,basisSource:'invented'}),{code:'PLAN_EDIT_BASIS_SOURCE_UNKNOWN'});
});
/* ===== P3-PORT-FIX cell (k). THE COMPANION'S NEW LOCAL-SOURCE PREDICATE =====
   P3-PORT-FIX-SPEC 1.6. The companion's own comment derives its predicate from
   source-admission.mjs programme(): "its correspondence predicate is not ours to
   invent". When programme() narrows, the companion narrows BY ITS OWN STATED
   LAW, or it refuses to edit the plan the athlete was just told he would train
   on. Every cell below is RED against the pre-fix plan-edit-model.cjs. */
const varied=(mutate)=>importedFixture({varyBasis:mutate});
for(const [why,mutate] of [
  ['the file\'s week began 60 days before the document\'s',b=>{b.split[0].from='2026-07-03';}],
  ['the file carries two periods of the same week',b=>{b.split=[{from:'2026-07-03',map:copy(b.split[0].map)},copy(b.split[0])];}],
  ['the file states its own priority muscles',b=>{b.priority_muscles=['chest','quads'];}],
  ['one lift carries the file\'s own set count',b=>{b.exercises[0].sets=5;}],
  ['one lift carries the file\'s own rep target',b=>{b.exercises[0].hi=12;}],
  ['one lift carries the file\'s own increment',b=>{b.exercises[0].inc=2.5;}],
  ['one lift carries the file\'s own ladder',b=>{b.exercises[0].steps=[20,25,30,35];}],
  ['one lift carries the file\'s own volume tags',b=>{b.exercises[0].head='chest-upper';b.exercises[0].secondary=[{mg:'triceps',lend:0.5}];}],
]){
  test('PE17 (k) an admitted import is EDITABLE when '+why,()=>{
    const f=varied(mutate);
    const read=f.make().read(f.generation,today);
    assert.equal(read.state.exercises[0].id,'press');
    assert.deepEqual(read.state.exercises[0].sets,f.imported.exercises[0].sets,
      'the plan the companion reads carries the FILE\'s numbers');
    assert.deepEqual(read.state.exercises[0].hi,f.imported.exercises[0].hi);
  });
}
for(const [why,mutate,code] of [
  ['a period map differs in one day letter',b=>{b.split[0].map[1]='L';},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['the split is not an array',b=>{b.split={from:'2026-09-01',map:{}};},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['the split is empty',b=>{b.split=[];},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['a period carries a third member',b=>{b.split[0].label='SYNTHETIC';},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['a lift the document lists is not in the basis',b=>{b.exercises[0].id='press-other';},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['the basis holds a lift twice',b=>{b.exercises[1].id='press';},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['one lift sits on another training day',b=>{b.exercises[0].day='L';},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['one lift is filed under another muscle group',b=>{b.exercises[0].mg='triceps';},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['a lift carries no name of its own',b=>{delete b.exercises[0].n;},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['a lift name is blank',b=>{b.exercises[0].n='   ';},'PLAN_EDIT_ORIGIN_UNPROVEN'],
  ['the label is not this installation\'s',b=>{b.athlete_label='Someone else';},'PLAN_EDIT_ORIGIN_UNPROVEN'],
]){
  test('PE17 (k) the narrowed predicate STILL REFUSES when '+why,()=>{
    const f=varied(mutate);
    assert.throws(()=>f.make(),{code});
  });
}
test('PE17 (k) a document tag map whose key set is not the basis id set still refuses',()=>{
  const f=importedFixture();
  f.origin.payload.tags['ghost']=copy(emptyTags);
  assert.throws(()=>f.make(),{code:'PLAN_EDIT_TAG_BASIS_UNPROVEN'});
});
test('PE17 (k) THE FIRST-RUN BRANCH IS UNTOUCHED: a clean-init basis whose set '
  +'count has moved is still not a clean-init state',()=>{
  const f=fixture({tags:true});
  f.state.exercises[0].sets=5;
  assert.throws(()=>createPlanEditProjector({basisState:f.state,setupOperation:f.origin,
    validateTags,projectNewExerciseTags:projectNewTags,hashBasis}),{code:'PLAN_EDIT_ORIGIN_UNPROVEN'});
  const g=fixture({tags:true});
  g.state.split[0].from='2026-07-03';
  assert.throws(()=>createPlanEditProjector({basisState:g.state,setupOperation:g.origin,
    validateTags,projectNewExerciseTags:projectNewTags,hashBasis}),{code:'PLAN_EDIT_ORIGIN_UNPROVEN'});
});
test('PE16 the mapped collection set is exactly the collections this installation seals',()=>{
  // A trip-wire in the :456 shape: if local-client.mjs ever seals another
  // collection, this goes red here instead of an unmapped effect being projected.
  assert.deepEqual(planEditCollections(),[...sealedCollections,'derived']);
  /* CHANGED by P3-PORT-FIX (spec review R2, BINDING CORRECTION B-1). This is the
     ONE mechanism in the tree that ties the companion's local-source field list
     to source-admission.mjs programme(), and it is retargeted at the LIVE list
     rather than left green over a reason the rule change made false. P2_ROW is
     narrowed in place rather than kept beside a new name, so no constant
     survives whose only remaining reader is the assertion about it.
     BEFORE: ['id','day','mg','sets','hi','inc','steps'].
     AFTER:  ['id','day','mg'].
     NARROWED AGAIN by P3-REAL-SHAPE (DECISIONS:520 option A, accepted :521).
     `id` GOES, and it goes because the two sides no longer share an id at all:
     the basis is the FILE's, whose ids are the old app's short handles, and the
     document is the phone's, whose ids slugOf minted. The row is bound to its
     basis lift by its own id FIRST and then by normalised NAME, out of the
     shared helper, and what is still COMPARED is where the lift sits in the
     week. AFTER: ['day','mg']. */
  assert.deepEqual(P2_ROW,['day','mg'],
    'source-admission.mjs programme() proves exactly these, and not the id and '
    + 'not the name: after option A the file\'s lifts ARE the athlete\'s lifts, '
    + 'and set counts, rep targets, increments and ladders are RETAINED from the '
    + 'file (P3-PORT-FIX-SPEC 1.4, 1.6; P3-REAL-SHAPE-SPEC 2.3, 2.6)');
});
test('PE16 f2-adapter-identity the injected tag collaborator is the published F2 source',()=>{
  // The lane copy is byte-identical to the public blob the independent reviewer
  // ran against. It is a stand-in for an INJECTED collaborator, not a stub of a
  // plan-edit runtime path, and no runtime file imports it.
  const { execFileSync } = require('node:child_process');
  const { readFileSync } = require('node:fs');
  const published=execFileSync('git',['show','f3e9561:rebuild/m4/workout/setup-tags.cjs'],
    {encoding:'utf8',cwd:require('node:path').resolve(__dirname,'../../../..')});
  const lane=readFileSync(require('node:path').join(__dirname,'f2-tag-adapter.cjs'),'utf8');
  assert.equal(createHash('sha256').update(lane).digest('hex'),
    createHash('sha256').update(published).digest('hex'),'lane F2 copy is the published F2 blob');
  for(const file of ['plan-edit-commands.cjs','plan-edit-model.cjs'])
    assert.equal(/f2-tag-adapter|setup-tags/.test(
      readFileSync(require('node:path').resolve(__dirname,'../../../m4/workout',file),'utf8')),false,file);
});
