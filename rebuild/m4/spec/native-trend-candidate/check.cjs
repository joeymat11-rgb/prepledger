'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),Module=require('node:module'),assert=require('node:assert/strict');
const S=require('../performed-proposal/source.cjs'),typed=require('../typed-performed-candidate/construct.cjs'),build=require('./construct.cjs');
const root=process.env.EARNED_CONFIGURED_HISTORY;assert(root,'Existing pinned configured-history composition required');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'configured-history-sources.json')));
const verify=()=>{for(const [file,pin]of Object.entries(manifest.candidatePins))assert.equal(S.sha(fs.readFileSync(path.join(root,file))),pin,file);};verify();
const baseline=S.baseline(),previous=S.construct(baseline),original=fs.readFileSync(path.resolve(__dirname,'../performed-proposal/factory.cjs'),'utf8');
assert.equal(S.sha(original),'0a03c9e541e22d2617993fb4f5bb43f4ed0126c51defddf391da36e491511b75');
const typedSource=typed(original,previous.sources['rebuild/engine/progression.cjs']);
assert.equal(S.sha(typedSource.factory),'4eaa6f14100103847294b7f4a5298280137ce4ca43b22e20dac340c4eca05a20');
assert.equal(S.sha(typedSource.progression),'5697780f3a68897626ea31c7b72f2aaad16c90227fb32f8743dc895529577cb2');
const next=build(typedSource.factory,typedSource.progression),entered=fs.readFileSync(path.resolve(__dirname,'../configured-load-candidate/entered-load.cjs'),'utf8');
const sources={...previous.sources,'rebuild/engine/performed.cjs':next.factory,'rebuild/engine/progression.cjs':next.progression,'rebuild/engine/entered-load.cjs':entered};
const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-native-trend-'));
for(const [file,text]of Object.entries(sources)){const dest=path.join(output,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,text);}
// Reuse the real history fixture and all its guards. Only export its existing
// repository/client constructor so this test can continue actual stored sessions.
const fixtureFile=path.resolve(__dirname,'../configured-history-candidate/test.cjs'),fixtureText=fs.readFileSync(fixtureFile,'utf8');
const end=fixtureText.indexOf("test('actual encrypted reopen");assert(end>0);
const anchor='return {client,args,ids,start,source,map,dependencies,close:()=>reopened.repository.close()};';
let prefix=fixtureText.slice(0,end);assert.equal(prefix.split(anchor).length,2);
prefix=prefix.replace(anchor,'return {client,args,ids,start,source,map,dependencies,repository:reopened.repository,createDurablePublicClient,fresh:f.fresh,close:()=>reopened.repository.close()};');
const m=new Module(fixtureFile,module);m.filename=fixtureFile;m.paths=Module._nodeModulePaths(path.dirname(fixtureFile));m._compile(prefix+'\nmodule.exports={fixture,Adapter};',fixtureFile);
const {fixture}=m.exports,F=require('../../../m3/w7-preview/fixtures.cjs');
const clock={today:()=>F.SYNTHETIC_DAY,nowMs:()=>Date.parse(F.SYNTHETIC_DAY+'T12:00:00Z'),nowISO:()=>F.SYNTHETIC_DAY+'T12:00:00.000Z',hour:()=>12,dow:()=>1};
const load=S.load(sources);
function engine(resolver){const E=load('rebuild/m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock});
 // Explicit nonshipping dependency injection; no new browser option.
 if(resolver)Object.assign(E,load('rebuild/engine/performed.cjs')(E,{nativeTrendContext:resolver}));return E;}
const Old=S.load(previous.sources)('rebuild/m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock});
const pounds=value=>({value,unit:'lb'}),configuration=configuration_key=>({kind:'configuration',configuration_key});
// Declared assumed context for formula tests only, NOT athlete/source qualification.
const assumed=request=>({...request,hard:false,rushed:false,debt:false});
const E=engine(assumed),results=[];
const state=facts=>({...F.createSyntheticState(),sessionLog:{},workoutFacts:facts});
async function check(name,fn){await fn();results.push(name);console.log('PASS '+name);}
async function addWorkout(f,reps,lineages=['synthetic-lift']){
 const facts=await f.map(),last=facts.sessions.at(-1),parent=last.record.entries[0].completion.op_id;
 const client=f.createDurablePublicClient({...f.args,repository:f.repository,
  workoutProducer:(g,context)=>{const capture=f.args.workoutProducer(g,context);return {...capture,
   slots:lineages.flatMap(id=>capture.slots.map((slot,i)=>({...slot,lift_lineage_id:id,logical_set_slot:JSON.stringify([id,i+1])})))};},
  resolveWorkoutBasis:()=>({plan_basis:'synthetic-original-plan',input_basis:'synthetic-original-input',causal_parents:[parent]})});
 const p=await client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert(p.prepared,p.code);
 const start=await client.startPreparedWorkout({preparedId:p.preparedId});assert(start.acknowledged,start.code);const ids=[];
 for(const lineage of lineages)for(let i=0;i<3;i++){
  const skip=i>=reps.length,r=await client.execute('workout',{action:skip?'skip':'set',input:{session_start_op_id:start.op_id,
   logical_set_slot:JSON.stringify([lineage,i+1]),lift_lineage_id:lineage,
   ...(skip?{skip_scope:'set',reason:'Time'}:{load:pounds(40),reps:{value:reps[i],unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'}})}});
  assert(r.acknowledged,r.code);ids.push(r.op_id);
 }
 const close=await client.execute('workout',{action:'close',input:{session_start_op_id:start.op_id,completion_kind:reps.length<3?'early':'normal',causal_parents:[start.op_id,...ids]}});assert(close.acknowledged,close.code);
 return {start:start.op_id,ids,client};
}
async function edit(client,id,action,change){const p=await client.prepareWorkoutEdit({target_op_id:id});assert(p.prepared,p.code);
 const r=await client.commitWorkoutEdit({editId:p.editId,action,change});assert(r.acknowledged,r.code);return r;}
const numericFixture=()=>fixture({targets:[pounds(40),pounds(40),pounds(40)],values:[pounds(40),pounds(40),pounds(40)]});
async function main(){
 await check('legacy-only complete outputs stay identical; original statistical and downside formulas remain literal',async()=>{
  for(const factor of [1,-1,0]){const s=F.createSyntheticState();for(const [i,record]of Object.values(s.sessionLog).entries())for(const en of record.entries)en.reps=[15+factor*i,14+factor*i];
   assert.deepEqual(E.progressionTrend(s),Old.progressionTrend(s));
   for(const ex of s.exercises)for(const opts of [undefined,{cleanOnly:true,minN:2},{window:4},{asOf:F.dayOffset(F.SYNTHETIC_DAY,-10)}])assert.deepEqual(E.liftTrend(s,ex.id,opts),Old.liftTrend(s,ex.id,opts));
  }
  const suffix='  const lastK = pts.length ? pts[pts.length - 1].k : 0;';
  const section=s=>s.slice(s.indexOf(suffix),s.indexOf('function progressionTrend(s) {'));
  assert.equal(section(next.progression).replace(', ...(cutAt>0&&series[0].start_op_id?{reset_start_op_id:series[0].start_op_id}:{})',''),section(typedSource.progression));
  const pooling='  if (trends.length < TREND_MIN_LIFTS)';
  assert.equal(next.progression.slice(next.progression.indexOf(pooling)),typedSource.progression.slice(typedSource.progression.indexOf(pooling)));
 });
 await check('actual same-day stored sessions remain separate and a real set-count change resets the trend',async()=>{
  const f=await numericFixture();try{
   const expected=[f.start.op_id];for(let i=0;i<3;i++)expected.push((await addWorkout(f,[9+i,8+i,7+i])).start);
   let facts=await f.map();assert.equal(new Set(facts.sessions.map(x=>x.effective.local_date)).size,1);
   const t=E.liftTrend(state(facts),'synthetic-lift');assert(t);assert.equal(t.n,4);assert.equal(t.k,3);assert.deepEqual(t.pts.map(p=>p.start_op_id),expected);
   assert.deepEqual(t.pts.map(p=>p.y),[840,960,1080,1200]);
   assert.equal(E.progressionTrend(state(facts)).lifts[0].n,4);
   const first=await addWorkout(f,[12,11]);assert.equal(E.liftTrend(state(await f.map()),'synthetic-lift'),null);
   for(let i=0;i<3;i++)await addWorkout(f,[13+i,12+i]);
   facts=await f.map();const nextTrend=E.liftTrend(state(facts),'synthetic-lift');assert.equal(nextTrend.k,2);assert.equal(nextTrend.n,4);assert.equal(nextTrend.reset_start_op_id,first.start);
   assert.equal(facts.sessions.at(-1).record.entries[0].slots[2].state,'skipped');
   const comparison=F.createSyntheticState();comparison.sessionLog={};
   for(const [i,point]of nextTrend.pts.entries())comparison.sessionLog[F.dayOffset(F.SYNTHETIC_DAY,-8+i)]={entries:[{id:'synthetic-lift',w:40,reps:[point.y/40,0]}]};
   const old=Old.liftTrend(comparison,'synthetic-lift');for(const key of ['n','k','pct','se','lo','hi'])assert.equal(nextTrend[key],old[key],key);
  }finally{f.close();}
 });
 await check('reopened prepared correction changes the actual trend and retains original capture and provenance',async()=>{
  const f=await numericFixture();try{
   for(let i=0;i<3;i++)await addWorkout(f,[8,7,6]);const before=await f.map(),capture=structuredClone(before.sessions[0].capture);
   f.close();const reopened=await f.fresh();try{const client=f.createDurablePublicClient({...f.args,repository:reopened.repository});
    const change=await edit(client,f.ids[0],'correct',{reps:{value:10,unit:'rep'}}),facts=await f.map(),slot=facts.sessions[0].record.entries[0].slots[0];
    assert.deepEqual(facts.sessions[0].capture,capture);assert.equal(slot.fact.original.reps.value,8);assert.equal(slot.fact.current.reps.value,10);assert(slot.fact.edit_op_ids.includes(change.op_id));
    const trend=E.liftTrend(state(facts),'synthetic-lift');assert.equal(trend.pts[0].y,920);assert.equal(trend.pts[0].start_op_id,f.start.op_id);
   }finally{reopened.repository.close();}
  }finally{f.close();}
 });
 await check('native hard, rushed and debt flags preserve set-aside identities and clean-session filtering',async()=>{
  const f=await numericFixture();try{
   for(let i=0;i<5;i++)await addWorkout(f,[9+i,8+i,7+i]);const facts=await f.map(),ids=facts.order.start_ids;
   const flags=q=>({...assumed(q),hard:q.start_op_id===ids[0],rushed:q.start_op_id===ids[1],debt:q.start_op_id===ids[2]}),X=engine(flags),s=state(facts);
   const all=X.liftTrend(s,'synthetic-lift'),clean=X.liftTrend(s,'synthetic-lift',{cleanOnly:true,minN:3});
   assert.equal(all.n,5);assert.equal(all.nSoft,2);assert.deepEqual(all.pts.map(x=>x.start_op_id),ids.slice(1));
   assert.equal(clean.n,3);assert.equal(clean.nSoft,0);assert.deepEqual(clean.pts.map(x=>x.start_op_id),ids.slice(3));
   assert.deepEqual(X.progressionTrend(s).setAsideWorkouts,[{d:facts.sessions[0].effective.local_date,start_op_id:ids[0]}]);
  }finally{f.close();}
 });
 await check('actual four-lift native pooling reaches rising and falling paths with explicit debt protection',async()=>{
  const lineages=['native-a','native-b','native-c','native-d'];
  for(const direction of [1,-1]){const f=await numericFixture();try{
   for(let i=0;i<4;i++)await addWorkout(f,[12+direction*i,11+direction*i,10+direction*i],lineages);
   const facts=await f.map(),s=state(facts),result=E.progressionTrend(s);
   assert.equal(result.nLifts,4);assert.equal(result.state,direction===1?'rising':'falling');assert(result.lifts.every(t=>t.n===4&&t.k===3));
   const comparison=F.createSyntheticState();comparison.sessionLog={};
   for(let i=0;i<4;i++)comparison.sessionLog[F.dayOffset(F.SYNTHETIC_DAY,-4+i)]={entries:lineages.map(id=>({id,w:40,reps:[12+direction*i,11+direction*i,10+direction*i]}))};
   const old=Old.progressionTrend(comparison);for(const key of ['nLifts','state','pct','se','lo','hi','nSoft'])assert.equal(result[key],old[key],key);
   if(direction<0){const protectedResult=engine(q=>({...assumed(q),debt:true})).progressionTrend(s);
    assert.equal(protectedResult.state,'falling');assert.equal(protectedResult.confidence,'low');assert.equal(protectedResult.nSoft,16);assert.match(protectedResult.protectedBy,/no lift has/);}
  }finally{f.close();}}
 });
 await check('native context must match Start, revision and exact effective tuple with explicit flags',async()=>{
  const f=await numericFixture();try{const facts=await f.map(),s=state(facts);
   const bad=[undefined,()=>{throw Error('Unavailable');},q=>({...assumed(q),source_revision:q.source_revision+1}),q=>({...assumed(q),start_op_id:'wrong'}),
    q=>({...assumed(q),effective:{...q.effective,local_time:'00:01'}}),q=>({...assumed(q),debt:undefined}),q=>({...assumed(q),rushed:0}),async q=>assumed(q)];
   for(const resolver of bad)for(const read of ['liftTrend','progressionTrend'])assert.throws(()=>engine(resolver)[read](s,'synthetic-lift'),{code:'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'});
   const stale=assumed({start_op_id:f.start.op_id,source_revision:facts.source_revision,effective:facts.sessions[0].effective});
   await edit(f.client,f.ids[0],'correct',{reps:{value:9,unit:'rep'}});
   const changed=state(await f.map());assert.throws(()=>engine(()=>stale).liftTrend(changed,'synthetic-lift'),{code:'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'});
  }finally{f.close();}
 });
 await check('configured, zero-work, removed and unresolved facts have distinct explicit unavailable outcomes',async()=>{
  const f=await numericFixture();try{
   await edit(f.client,f.ids[0],'correct',{load:configuration('BW')});
   let s=state(await f.map());assert.throws(()=>E.liftTrend(s,'synthetic-lift'),{code:'PERFORMED_NUMERIC_LOAD_UNAVAILABLE'});
   await edit(f.client,f.ids[0],'correct',{load:pounds(40)});
   for(const id of f.ids)await edit(f.client,id,'correct',{reps:{value:0,unit:'rep'}});
   s=state(await f.map());assert.throws(()=>E.liftTrend(s,'synthetic-lift'),e=>e.reason==='zero_work_rule_unqualified');
   for(const id of f.ids)await edit(f.client,id,'remove','Mistaken');
   s=state(await f.map());assert.deepEqual(E.performedTypedSlots(s.workoutFacts.sessions[0].record.entries[0]).map(x=>x.state),['removed','removed','removed']);
   assert.throws(()=>E.liftTrend(s,'synthetic-lift'),e=>e.reason==='no_performed_observations');
   // Explicit reader-boundary probe; not fabricated accepted storage evidence.
   const probe=structuredClone(s);probe.workoutFacts.sessions[0].record.entries[0].slots[0]={position:1,logical_set_slot:JSON.stringify(['synthetic-lift',1]),state:'unresolved',issues:['probe-conflict'],prescribed_load:{state:'specified',source:pounds(40)}};
   assert.throws(()=>E.liftTrend(probe,'synthetic-lift'),e=>e.reason==='unresolved_slots');
  }finally{f.close();}
 });
}
main().then(()=>{verify();assert.deepEqual(S.baseline(),baseline);assert.equal(fs.readFileSync(fixtureFile,'utf8'),fixtureText);
 const evidence={runtime:process.version,historyManifest:S.sha(fs.readFileSync(path.join(root,'configured-history-sources.json'))),results,
  sources:Object.fromEntries(Object.entries(sources).map(([f,s])=>[f,S.sha(s)])),limits:['nonshipping source assembly, no installed engine change','actual client/AES-GCM with fake-indexeddb and existing unissued lease','context resolver is an explicit test assumption, not physiological/source/currentness clearance','unresolved probe is reader-boundary only','complete schema/issuer/browser/private/science/integrator qualification remains']};
 fs.writeFileSync(path.join(output,'EVIDENCE.json'),JSON.stringify(evidence,null,2)+'\n');console.log('NATIVE TREND EVIDENCE '+output);
}).catch(error=>{console.error(error);console.log('NATIVE TREND FAILED SCRATCH '+output);process.exitCode=1;});
