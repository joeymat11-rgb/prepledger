'use strict';
// NATIVE-NEXT-TARGETS joined author evidence. Real encrypted client, T2 stage,
// capture validator, typed projector, reading-replay lineage and the candidate
// prescription runtime; a TEST-ONLY importer assembly executes the actual
// migrate/dataLossGuard/mergeState/createImportPreparation/projectLineage on
// disclosed synthetic data. Author tests are not independent acceptance.
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const X=require('../../spec/native-next-target-candidate/fixture.cjs');
const {createImportEngine}=require('../../spec/native-next-target-candidate/import-engine-assembly.cjs');
const {createReadingReplay}=X.mod('rebuild/m4/import/reading-replay.cjs'),{createImportPreparation}=X.mod('rebuild/m4/import/prepare.cjs');
const Source=X.mod('rebuild/m3/w5/source/codec.cjs'),Runtime=X.mod('rebuild/m4/workout/engine-runtime.cjs');
const PACKET=process.env.EARNED_NATIVE_PACKET_ROOT;if(!PACKET)throw new Error('Provide the immutable packet root explicitly (EARNED_NATIVE_PACKET_ROOT)');
const D=X.Delta,ACCEPTED=X.acceptedSources(PACKET),CANDIDATE=X.candidateSources(),F=X.F,DAY=X.DAY;
const {pounds,configuration,exact,bound,assumed}=X;
const throwsCode=(fn,code)=>assert.throws(fn,e=>e?.code===code||(()=>{throw new Error('expected '+code+' got '+(e?.code||e?.message));})());
const rejectsCode=(p,code)=>assert.rejects(p,e=>e?.code===code||(()=>{throw new Error('expected '+code+' got '+(e?.code||e?.message));})());
const oldEngine=(clock,resolver)=>X.composeFrom(ACCEPTED,{clock,nativeTrendContext:resolver});
const newEngine=(clock,resolver,seed)=>X.composeFrom(CANDIDATE,{clock,nativeTrendContext:resolver,seed});
const legacySlp={};
const target=(view,lift)=>view.slots.filter(s=>s.lift_lineage_id===lift).map(s=>JSON.parse(s.reps.source_json).value);
const effort=(view,lift)=>view.slots.filter(s=>s.lift_lineage_id===lift).map(s=>JSON.parse(s.effort.source_json).target);
const reason=(view,lift)=>view.slots.find(s=>s.lift_lineage_id===lift).reason.display;
// Legacy oracle: the SAME numeric line entered as an old sessionLog row, read by
// the accepted engine's own rules. Typed effort maps to its legacy number where
// the registered truth table makes them decidable identically.
function legacyEquivalent(base,lift,rows,{w=40}={}){
 const s=structuredClone(base);s.sessionLog={};
 for(const [i,row]of rows.entries()){const d=F.dayOffset(DAY,-(rows.length-i)*2);
  const rirSets=row.rir.map(r=>r===undefined?null:r);
  s.sessionLog[d]={type:'L',entries:[{id:lift,w,reps:row.reps.slice(),rir:rirSets[0],rirEnd:rirSets.length>1?rirSets[rirSets.length-1]:undefined,rirSets,sets:row.reps.length}]};}
 const ex=s.exercises.find(e=>e.id===lift);const last=rows.length?s.sessionLog[Object.keys(s.sessionLog).sort().at(-1)].entries[0]:null;
 ex.last=last?last.reps.slice():null;ex.lastMeta=last?{d:Object.keys(s.sessionLog).sort().at(-1),w,reps:last.reps.slice(),rir:last.rir??null,rirSets:last.rirSets.slice(),debt:false}:null;return s;
}

test('carrier: candidate bytes equal construct(accepted); expected changes published; runtime composes only the two readers without seed/migrate/merge',()=>{
 const out=D.construct(Object.fromEntries(D.OWNED.map(f=>[f,ACCEPTED[f]])));
 for(const f of D.OWNED){assert.equal(X.sha(CANDIDATE[f]),out.pins[f].after,'candidate on disk is exactly the carrier output: '+f);assert.equal(out.pins[f].before,D.ACCEPTED[f]);}
 assert.equal(out.changes.length,34);assert.equal(D.EXPECTED.length,10);
 const loaded=Object.keys(require.cache).filter(p=>/rebuild[\\/]engine[\\/](seed|migrate|merge)\.cjs$/.test(p));
 assert.deepEqual(loaded,[],'no seed/migrate/merge module is loaded by the runtime or the candidate engine');
 assert.deepEqual(Runtime.COMPOSITION.modules,['dates','constants','plan','performed','progression','sleep','energy','policy','today','volume','earn','writers']);
 const R=Runtime.createEngineRuntime({clock:X.clockFor(DAY)});
 assert.deepEqual(Object.keys(R),['genSession','rirPlan']);assert.equal(Object.isFrozen(R),true);
 assert.throws(()=>Runtime.createEngineRuntime({}),/clock\.today/);assert.throws(()=>Runtime.createEngineRuntime({clock:X.clockFor(DAY),nativeTrendContext:1}),/synchronous function/);
 const src=fs.readFileSync(path.join(X.ROOT,'rebuild/m4/workout/engine-runtime.cjs'),'utf8');
 assert(!/seed\.cjs|migrate\.cjs|merge\.cjs/.test(src.replace(/\/\/.*$/gm,'').replace(/forbiddenImports:[^\n]*/,'')),'runtime source requires no forbidden module');
 assert(!/new Function|eval\(|vm\./.test(src),'no dynamic compiler');
});

test('legacy-only inputs: candidate and accepted engines produce identical cards, effort plans, anchors, era and alarm outputs',()=>{
 const clock=X.clockFor(DAY),Old=oldEngine(clock),New=newEngine(clock),R=Runtime.createEngineRuntime({clock});
 const variants={
  base:s=>s,
  hold:s=>{s.exercises[2].holdFlag=true;},
  std:s=>{s.exercises[2].std=[11,9];s.exercises[2].own=true;s.exercises[2].ownNote='synthetic';},
  reclaim:s=>{s.exercises[3].reclaim=[9,9];},
  ladder:s=>{s.exercises[2].ladder={set:1,top:12};},
  wSets:s=>{s.exercises[2].wSets=[40,35];},
  debut:s=>{s.queue.push({id:'synthetic-debut',kind:'debut',state:'DEBUT',done:false,exId:'demo-leg',newW:45,newWSets:[45,45],t:'Synthetic debut'});},
  reset:s=>{s.exercises[2].last=null;s.feed.unshift({d:F.dayOffset(DAY,-1),t:'RESET APPLIED — Leg press 45 → 40',how:'synthetic'});},
  era:s=>{s.exercises[2].forks=[{from:F.dayOffset(DAY,-4),kind:'reset',why:'synthetic'}];},
  maxed:s=>{s.exercises[2].rungs=[40];s.exercises[2].last=[12,12];},
  short:s=>{s.exercises[2].sets=3;},
  emptyLast:s=>{s.exercises[2].last=null;s.exercises[2].lastMeta=null;},
 };
 for(const [name,mutate]of Object.entries(variants)){
  const s=F.createSyntheticState(DAY);mutate(s);const before=JSON.stringify(s);
  const a=Old.genSession(s,DAY,legacySlp),b=New.genSession(s,DAY,legacySlp),c=R.genSession(structuredClone(s),DAY,legacySlp);
  assert.deepEqual(b,a,'genSession '+name);assert.deepEqual(c,a,'runtime genSession '+name);
  for(const card of a.ex){const ex=s.exercises.find(e=>e.id===card.id);
   assert.deepEqual(New.rirPlan(s,{...card,holdFlag:ex.holdFlag},legacySlp),Old.rirPlan(s,{...card,holdFlag:ex.holdFlag},legacySlp),'rirPlan '+name);
   assert.deepEqual(New.targetsFor(ex,s),Old.targetsFor(ex,s));assert.deepEqual(New.progressStep(ex,s),Old.progressStep(ex,s));
   assert.deepEqual(New.progressAnchor(ex,s),Old.progressAnchor(ex,s));assert.equal(New.progressionSetCount(ex,s),Old.progressionSetCount(ex,s));
   assert.equal(New.eraFresh(s,ex.id),Old.eraFresh(s,ex.id));assert.deepEqual(New._loadTenure(ex,s,null,null).tenure.map(x=>[x[0],x[1]]),Old._loadTenure(ex,s,null,null).tenure);
   assert.deepEqual(New.governingLast(ex,s),ex.last);assert.deepEqual(New.governingMeta(ex,s),ex.lastMeta);
   assert.deepEqual(New.liftCall(s,ex.id),Old.liftCall(s,ex.id));
  }
  assert.equal(JSON.stringify(s),before,'readers never mutate the input');
 }
});

// Pulse fixtures reaching each detection branch of the original bodyAlarm.
function pulses(spec){const out=[];for(let i=0;i<14;i++){const d=F.dayOffset(DAY,i-13);out.push({d,bpm:60});}
 const by=Object.fromEntries(out.map(p=>[p.d,p]));for(const [offset,bpm]of Object.entries(spec))by[F.dayOffset(DAY,Number(offset))].bpm=bpm;return out;}
const ALARM_BRANCHES={
 none:s=>{s.pulse=pulses({});},
 red:s=>{s.pulse=pulses({0:71});},
 redSecond:s=>{s.pulse=pulses({'-1':68,0:68});},
 amber:s=>{s.pulse=pulses({0:68});},
 recovering:s=>{s.pulse=pulses({'-1':68,0:65});},
 patternOnly:s=>{s.pulse=[];s.sleep.nights.at(-1).h=1;s.dailyLogs[DAY]={cal:2300,pro:170,steps:60000};s.reads.push({d:DAY,w:190,sealed:false});},
};
test('shared body-alarm signal: every detection branch equals the original full bodyAlarm tier; presentation, liftCall and rirPlan consequences are unchanged',()=>{
 const clock=X.clockFor(DAY),Old=oldEngine(clock),New=newEngine(clock);const tiers={};
 for(const [name,mutate]of Object.entries(ALARM_BRANCHES)){
  const s=F.createSyntheticState(DAY);mutate(s);
  const full=Old.bodyAlarm(s),signal=New.bodyAlarmSignal(s),now=New.bodyAlarm(s);
  assert.deepEqual(now,full,'full presentation identical: '+name);
  assert.equal(signal===null,full===null,'signal presence equals original: '+name);
  if(full){assert.equal(signal.tier,full.tier);assert.equal(signal.red,full.tier==='RED');assert.deepEqual(Object.keys(signal).sort(),['lastNight','partial','patParts','patternHot','pr5','prevSpike','pulseTrig','red','tI','tier','todaySpike','yISO']);}
  tiers[name]=full?full.tier:null;
  const card={id:'demo-leg',sets:2,tgt:[10,10]};
  assert.deepEqual(New.rirPlan(s,card,legacySlp),Old.rirPlan(s,card,legacySlp),'rirPlan consequence: '+name);
  assert.deepEqual(New.liftCall(s,'demo-leg'),Old.liftCall(s,'demo-leg'),'liftCall default alarm path: '+name);
  assert.deepEqual(New.liftCall(s,'demo-leg',{alarm:{tier:'RED'}}),Old.liftCall(s,'demo-leg',{alarm:{tier:'RED'}}),'explicit opts.alarm unchanged');
  assert.deepEqual(New.liftCall(s,'demo-leg',{alarm:null}),Old.liftCall(s,'demo-leg',{alarm:null}));
 }
 assert.deepEqual(tiers,{none:null,red:'RED',redSecond:'RED',amber:'AMBER',recovering:'AMBER',patternOnly:'AMBER'});
 // Changed incidental exception behavior, inventoried: a presentation failure
 // after a real signal no longer becomes an all-clear plan.
 const s=F.createSyntheticState(DAY);ALARM_BRANCHES.red(s);const card={id:'demo-leg',sets:2,tgt:[10,10]};
 const breakPresentation=E=>{E.proteinTarget=()=>{throw new Error('synthetic presentation failure');};};
 const oldBroken=oldEngine(clock),newBroken=newEngine(clock);breakPresentation(oldBroken);breakPresentation(newBroken);
 assert.deepEqual(oldBroken.rirPlan(s,card,legacySlp).plan,[2,0],'ORIGINAL: presentation failure silently dropped the alarm floor');
 assert.deepEqual(newBroken.rirPlan(s,card,legacySlp).plan,[2,1],'CANDIDATE: the floor survives a presentation failure');
 assert.throws(()=>newBroken.bodyAlarm(s),/synthetic presentation failure/,'the full presentation reader itself still surfaces its own failure');
});

test('composition guards: the two readers reach neither HISTORY nor ROLLUPS on alarm-negative and alarm-positive paths, and cannot execute completion/adaptive writers',async()=>{
 const clock=X.clockFor(DAY);const touched=[];
 const recorder=name=>new Proxy([],{get(t,k){if(typeof k==='string'&&k!=='then')touched.push(name+'.'+k);return Reflect.get(t,k);}});
 const E=newEngine(clock,assumed,{HISTORY:recorder('HISTORY'),ROLLUPS:recorder('ROLLUPS')});
 const writerNames=Object.keys(X.loadSources(CANDIDATE)('rebuild/engine/writers.cjs')(Object.assign({},E),{clock,ids:{},drafts:{length:0,key:()=>null}}));
 const executed=[];for(const name of writerNames)if(name!=='rirPlan')E[name]=(...a)=>{executed.push(name);throw new Error('writer executed: '+name);};
 const f=await X.durable();try{
  await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},{reps:7,reserve:exact(0)}]});
  const facts=await f.facts();
  for(const [name,mutate]of Object.entries(ALARM_BRANCHES))for(const native of [false,true]){
   const s=native?f.engineState(facts,mutate):(()=>{const s=F.createSyntheticState(DAY);mutate(s);return s;})();
   const session=E.genSession(s,DAY,legacySlp);assert(session&&session.ex.length,name);
   for(const card of session.ex){const plan=E.rirPlan(s,{...card,holdFlag:false},legacySlp);
    if(name!=='none')assert(plan.plan.every(r=>r>=1)&&plan.why.some(w=>/alarm day/.test(w)),'alarm effect reached: '+name+' native='+native);
    else assert(plan.plan.includes(0)&&!plan.why.some(w=>/alarm day/.test(w)),'no alarm: '+name);
   }
  }
  assert.deepEqual(touched,[],'HISTORY/ROLLUPS untouched by genSession/rirPlan on every branch');assert.deepEqual(executed,[]);
  // The ORIGINAL alarm branch did reach HISTORY through the lab closure.
  const oldTouched=[];const Old=oldEngine(clock);Old.HISTORY=null;
  const OldRec=X.composeFrom(ACCEPTED,{clock,seed:{HISTORY:new Proxy([],{get(t,k){if(typeof k==='string')oldTouched.push('HISTORY.'+k);return Reflect.get(t,k);}})}});
  const red=F.createSyntheticState(DAY);ALARM_BRANCHES.red(red);OldRec.rirPlan(red,{id:'demo-leg',sets:2,tgt:[10,10]},legacySlp);
  assert(oldTouched.some(x=>x==='HISTORY.filter'||x==='HISTORY.map'),'accepted engine reached HISTORY on the alarm branch: '+oldTouched.slice(0,3));
  // Absent providers are loud, never an empty history: reaching them fails.
  const A=newEngine(clock,assumed,{HISTORY:Runtime.absentProvider('HISTORY'),ROLLUPS:Runtime.absentProvider('ROLLUPS')});
  throwsCode(()=>A.labAnalytics(red),'ENGINE_RUNTIME_HISTORY_PROVIDER_REQUIRED');throwsCode(()=>A.stepEfficacy(red),'ENGINE_RUNTIME_ROLLUPS_PROVIDER_REQUIRED');
  assert.deepEqual(A.rirPlan(red,{id:'demo-leg',sets:2,tgt:[10,10]},legacySlp).plan,[2,1],'runtime-style composition floors the alarm without any provider');
  // Repeated preparation and independent instances: stable results, unchanged input.
  const s=f.engineState(facts),before=JSON.stringify(s),R1=Runtime.createEngineRuntime({clock,nativeTrendContext:assumed}),R2=Runtime.createEngineRuntime({clock,nativeTrendContext:assumed});
  const one=R1.genSession(s,DAY,legacySlp),two=R1.genSession(s,DAY,legacySlp),three=R2.genSession(s,DAY,legacySlp);
  assert.deepEqual(two,one);assert.deepEqual(three,one);assert.equal(JSON.stringify(s),before);
 }finally{f.close();}
});

test('item 1: stored correction → reopen → registered projection → genSession/rirPlan → changed next targets and why, with an empty last and a contradictory stale cache',async()=>{
 const state=X.nativeOnlyState(DAY,s=>{const leg=s.exercises.find(e=>e.id==='demo-leg'),curl=s.exercises.find(e=>e.id==='demo-curl');
  leg.last=[10,10];leg.lastMeta={d:F.dayOffset(DAY,-3),w:40,reps:[10,10],rir:2,rirSets:[2,null],debt:false};curl.last=null;curl.lastMeta=null;delete curl.first;});
 const f=await X.durable({state});try{
  const first=await f.prepared();
  const Old0=oldEngine(f.clock),legacyOnly=structuredClone(f.input.state);
  assert.deepEqual(target(first.view,'demo-leg'),Old0.targetsFor(legacyOnly.exercises.find(e=>e.id==='demo-leg'),legacyOnly),'no rows: the imported cache is the undisputed baseline (accepted rule)');
  assert.deepEqual(target(first.view,'demo-leg'),[11,10]);
  assert.deepEqual(target(first.view,'demo-curl'),[10,10],'empty last with no rows: hi-2 fill (existing rule)');
  assert.equal(Object.hasOwn(first.engineInput.state,'workoutFacts'),true,'registered view present even with zero native sessions');
  await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},{reps:7,reserve:exact(1)}]});
  await f.workout({lift:'demo-curl',sets:[{reps:6,reserve:exact(2)},{reps:6,reserve:exact(0)}]});
  const p=await f.prepared();
  const oracle=lift=>{const o=oldEngine(f.clock),leg=legacyEquivalent(f.input.state,lift,lift==='demo-leg'?[{reps:[8,7],rir:[3,1]}]:[{reps:[6,6],rir:[2,0]}]);
   return {tgt:o.targetsFor(leg.exercises.find(e=>e.id===lift),leg),step:o.progressStep(leg.exercises.find(e=>e.id===lift),leg)};};
  assert.deepEqual(target(p.view,'demo-leg'),oracle('demo-leg').tgt,'stale [10,10] cache never governs; the native line does');
  assert.deepEqual(target(p.view,'demo-leg'),[9,8]);assert.match(reason(p.view,'demo-leg'),/final set reported 1 reps left/);
  assert.deepEqual(target(p.view,'demo-curl'),oracle('demo-curl').tgt);assert.deepEqual(target(p.view,'demo-curl'),[7,6]);
  assert.match(reason(p.view,'demo-curl'),/final set reported 0 reps left/);
  assert.deepEqual(p.engineInput.state.exercises.find(e=>e.id==='demo-leg').last,[10,10],'the cache is read-only input; nothing pre-populates a derived cache');
  const session=f.runtime.genSession(p.engineInput.state,DAY,legacySlp),legCard=session.ex.find(c=>c.id==='demo-leg');
  assert.equal(legCard.prev.profile,'earned/performed-lift/v1');assert.equal(legCard.prev.slots[1].fact.current.reps.value,7,'prev is the governing typed entry');
  // Correction after reopen: terminal effort and reps change the next answer.
  const facts0=await f.facts(),setB=facts0.sessions[0].record.entries[0].slots[1].fact.source_op_id;
  await f.reopen();await f.edit(setB,'correct',{reps:{value:9,unit:'rep'},reserve:bound});
  const after=await f.prepared();
  assert.deepEqual(target(after.view,'demo-leg'),oldEngine(f.clock).targetsFor(legacyEquivalent(f.input.state,'demo-leg',[{reps:[8,9],rir:[3,3]}]).exercises[2],legacyEquivalent(f.input.state,'demo-leg',[{reps:[8,9],rir:[3,3]}])));
  assert.deepEqual(target(after.view,'demo-leg'),[10,10]);assert.match(reason(after.view,'demo-leg'),/final set reported at least 3 reps left/);
  assert.equal(after.facts.sessions[0].record.entries[0].slots[1].fact.current.reps.value,9);assert.equal(after.facts.sessions[0].record.entries[0].slots[1].fact.original.reps.value,7);
  assert.deepEqual(after.facts.sessions[0].capture,facts0.sessions[0].capture,'prior capture bytes preserved');
  // Save the resulting next capture through the actual client and reopen it.
  const started=await f.client.startPreparedWorkout({preparedId:after.preparedId});assert(started.acknowledged,started.code);
  await f.reopen();const src=await f.source(),saved=src.history.sessions.find(s=>s.start.operation.op_id===started.op_id);
  assert.deepEqual(saved.original,after.view);assert.equal(saved.original.producer.engine_build,'native-next-targets-candidate');
  assert.deepEqual(src.history.sessions[0].original,first.view,'first original capture unchanged');
 }finally{f.close();}
});

test('item 2: reps/load/terminal-effort corrections, removal and restore recompute the applicable consumer; full line, prefix, skipped terminal, interior removal, exact zero, at_least 3 and unknown stay distinct',async()=>{
 const state=X.nativeOnlyState(DAY,s=>{const leg=s.exercises.find(e=>e.id==='demo-leg');leg.sets=3;leg.last=null;leg.lastMeta=null;delete leg.first;});
 const f=await X.durable({state});try{
  const Old=oldEngine(f.clock);
  const check=async(name,sets,expectRows,{reason:why,prefix}={})=>{
   const w=await f.workout({lift:'demo-leg',sets,completion:sets.includes('skipped')||sets.includes('unlogged')?'early':'normal'});
   const p=await f.prepared(),leg=legacyEquivalent(f.input.state,'demo-leg',[expectRows]),ex=leg.exercises.find(e=>e.id==='demo-leg');
   assert.deepEqual(target(p.view,'demo-leg'),Old.targetsFor(ex,leg),name+': targets follow the existing rule over the typed line');
   if(why)assert.match(reason(p.view,'demo-leg'),why,name);
   const card=f.runtime.genSession(p.engineInput.state,DAY,legacySlp).ex.find(c=>c.id==='demo-leg');
   if(prefix)assert.deepEqual(card.prev.slots.map(s=>s.state),prefix,name+': original positions and states retained on prev');
   return {w,p,card};
  };
  await check('full line, terminal exact 0',[{reps:8,reserve:bound},{reps:7,reserve:exact(1)},{reps:6,reserve:exact(0)}],{reps:[8,7,6],rir:[3,1,0]},{reason:/final set reported 0 reps left/});
  await check('terminal at least 3',[{reps:8,reserve:bound},{reps:7,reserve:exact(1)},{reps:6,reserve:bound}],{reps:[8,7,6],rir:[3,1,3]},{reason:/at least 3 reps left/});
  await check('terminal unknown falls to the opener rule',[{reps:8,reserve:bound},{reps:7},{reps:6,reserve:{tag:'unknown'}}],{reps:[8,7,6],rir:[3,undefined,undefined]},{reason:/opener reported at least 3 reps left/});
  const skipped=await check('skipped terminal: A/B prefix, no terminal rating',[{reps:8,reserve:exact(2)},{reps:7,reserve:exact(0)},'skipped'],{reps:[8,7],rir:[2,0]},{reason:/opener reported 2 reps left/,prefix:['performed','performed','skipped']});
  assert.equal(skipped.card.prev.slots[2].state,'skipped');assert.deepEqual(f.runtime.genSession(skipped.p.engineInput.state,DAY,legacySlp).ex.find(c=>c.id==='demo-leg').tgt.length,3,'three targets still prescribed');
  await check('exact zero reps stays a performed zero, never a hole',[{reps:8,reserve:bound},{reps:0,reserve:exact(0)},{reps:6,reserve:exact(0)}],{reps:[8,0,6],rir:[3,0,0]});
  // Interior removal: B removed → prefix [A]; C stays a fact after the hole.
  const full=await f.workout({lift:'demo-leg',sets:[{reps:9,reserve:bound},{reps:8,reserve:exact(1)},{reps:7,reserve:exact(0)}]});
  const facts=await f.facts(),entry=facts.sessions.at(-1).record.entries[0];
  const removed=await f.edit(entry.slots[1].fact.source_op_id,'remove','Mistaken entry');
  let p=await f.prepared();
  // Interior hole: the anchor is the performed prefix [A] padded by the existing
  // rule ([9,8,7]); the final set keeps its OWN rating (exact 0 → one-rep step),
  // so [9,9,7]; nothing is compacted, promoted or filled with zero, and the why
  // names the unavailable evidence.
  assert.deepEqual(target(p.view,'demo-leg'),[9,9,7],'interior removal: only the performed prefix [A] anchors; B is neither compacted nor promoted');
  let card=f.runtime.genSession(p.engineInput.state,DAY,legacySlp).ex.find(c=>c.id==='demo-leg');
  assert.deepEqual(card.prev.slots.map(s=>s.state),['performed','removed','performed'],'positions never compact; the removed fact and the later fact remain');
  assert.match(reason(p.view,'demo-leg'),/final set reported 0 reps left.*A removed original position sits before the final set/,'the why names the hole');
  let leg;
  // Restore by removing the removal through the raw command path (the prepared
  // edit API refuses an edit as a target: WORKOUT_EDIT_TARGET_UNAVAILABLE).
  const refused=await f.client.prepareWorkoutEdit({target_op_id:removed.op_id});assert.notEqual(refused.prepared,true);assert.equal(refused.code,'WORKOUT_EDIT_TARGET_UNAVAILABLE');
  const restored=await f.client.execute('workout',{action:'remove',input:{target_op_id:removed.op_id,lift_lineage_id:'demo-leg',reason:'Restore',causal_parents:[removed.op_id]}});assert(restored.acknowledged,restored.code);
  p=await f.prepared();leg=legacyEquivalent(f.input.state,'demo-leg',[{reps:[9,8,7],rir:[3,1,0]}]);
  assert.deepEqual(target(p.view,'demo-leg'),Old.targetsFor(leg.exercises[2],leg),'restore recomputes the full line');
  // Load correction moves the row off the current load: it no longer anchors,
  // the latest line still governs targetsFor's baseline.
  await f.edit(entry.slots[0].fact.source_op_id,'correct',{load:pounds(45)});p=await f.prepared();
  const s=p.engineInput.state,ex=s.exercises.find(e=>e.id==='demo-leg'),E=newEngine(f.clock,assumed);
  assert.deepEqual(E.governingLast(ex,s),[9,8,7]);assert.deepEqual(E.progressAnchor(ex,s),[8,0,6],'anchor: the latest row at the CURRENT load (previous workout), not the changed-load row');
  // Removing the latest contributor entirely recomputes from the remaining rows.
  for(const slot of entry.slots)await f.edit(slot.fact.source_op_id,'remove','Mistaken workout');
  p=await f.prepared();leg=legacyEquivalent(f.input.state,'demo-leg',[{reps:[8,0,6],rir:[3,0,0]}]);
  assert.deepEqual(target(p.view,'demo-leg'),Old.targetsFor(leg.exercises[2],leg),'removed latest contributor: previous workout governs, no revived cache');
 }finally{f.close();}
});

async function replayFixture(f,{imported,ready=true}={}){
 const src=await f.source(),g=X.acceptedClone(src.generation);
 const {parseStrictJson}=f,{createReadingProjector}=await X.load('rebuild/m3/w6/reading-history.mjs');
 const build='synthetic-test-only-importer',engineFor=({day,hour})=>createImportEngine({day,hour});
 const sourceBytes=Buffer.from(JSON.stringify(imported)),prep=createImportPreparation({engine:engineFor({day:DAY,hour:12}),parseStrictJson}).prepare(sourceBytes,{localBytes:sourceBytes});
 const materialFor=(checkpoint,clock=DAY)=>({source_json:sourceBytes.toString(),candidate_json:prep.candidateBytes().toString(),local_json:sourceBytes.toString(),checkpoint_json:JSON.stringify({revision:1,token:'synthetic',generation:checkpoint}),engine_context_json:JSON.stringify({build,clock})});
 const A=g.collections.ops['source-A'],nodes=new Map([[A.op_id,{selection:X.selectionFor(A,1,{W:0,selection_id:null}),material:materialFor(X.emptyGeneration())}]]);
 const reader=g2=>f.storedWorkoutHistory(g2,{athleteId:'ath-1',deviceId:'dev-A',prescriptionCapture:f.capture,recoveryReceipts:Object.values(g2.collections.receipts)});
 const replay=createReadingReplay({engineFor,projectReadings:createReadingProjector({athleteId:'ath-1',deviceId:'dev-A'}),parseStrictJson,producerIdentity:'synthetic-test-only-factories',importBuild:build,deviceId:'dev-A',workoutHistoryReader:reader,workoutProjector:f.mapper});
 const basisFor=(gen,selectionId)=>({W:gen.collections.sync.frontier.W,log_digest:Buffer.alloc(32,7).toString('base64url'),selection_id:selectionId});
 async function project(gen=g,selectionId=A.op_id,overrides={}){const basis=basisFor(gen,selectionId);
  const projection=await replay.projectLineage({selectionId,generation:gen,asOf:DAY,assertCurrent:async()=>{},readSourceSelection:async id=>structuredClone(nodes.get(id)?.selection),readSelectedSource:async id=>structuredClone(nodes.get(id)),
   sourceBasis:basis,readSourceCuts:async bases=>bases.map(frontier=>({frontier,current:structuredClone(nodes.get(frontier.selection_id).selection)})),sourceRevision:src.sourceRevision,...overrides});
  if(ready)assert.equal(projection.ready,true,JSON.stringify(projection.issues));return {projection,basis};}
 const v2=X.Capture.createPrescriptionCapture({parseStrictJson,profile:X.Capture.SOURCE_PROFILE,sourceCodec:Source});
 const adapterFor=(engine=f.runtime,producer=f.producer)=>X.Adapter.createEngineWorkoutCapture({engine,prescriptionCapture:v2,producerIdentity:producer,sourceProjectionReader:replay});
 const prepare=(projection,basis,adapter=adapterFor())=>adapter.prepare({sourceProjection:projection,source_basis:basis,day:DAY,basis:{plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:src.sourceRevision}});
 return {src,g,A,nodes,replay,materialFor,project,prepare,adapterFor,basisFor,prep,sourceBytes,engineFor,build};
}
const importedBaseline=()=>{const s=F.createSyntheticState(DAY);s.sessionLog={};
 for(const [i,d]of [-9,-6,-3].entries())s.sessionLog[F.dayOffset(DAY,d)]={type:'L',entries:[{id:'demo-leg',w:40,reps:[9+i,8+i],rir:2,sets:2}]};
 return s;};

test('item 3: imported baseline then proved post-activation native sessions govern; two same-date Starts order causally, not lexically; a later non-descended source refuses and rollback restores, through the actual replay code',async()=>{
 const f=await X.durable({seedOps:[spec=>X.sourceControlOp({...spec,id:'source-A',source_id:'synthetic-source-A'})]});try{
  const lines=[[8,7],[9,8],[10,9]],workouts=[];
  for(const line of lines)workouts.push(await f.workout({lift:'demo-leg',sets:[{reps:line[0],reserve:bound},{reps:line[1],reserve:exact(0)}]}));
  assert(workouts[2].start.localeCompare(workouts[0].start)<0,'third Start sorts lexically BEFORE the first: '+workouts[2].start+' < '+workouts[0].start);
  const R=await replayFixture(f,{imported:importedBaseline()});
  const {projection,basis}=await R.project();
  assert.deepEqual(projection.workout_history.order.start_ids,workouts.map(w=>w.start),'causal order, all on one date');
  assert.deepEqual(projection.workout_history.order.import_anchor,{source_generation_id:'synthetic-source-A',activation_op_id:'source-A'});
  assert.strictEqual(projection.workout_baseline.session_log,projection.accepted_state.sessionLog,'ONE shared imported log identity');
  assert.equal(Object.keys(projection.accepted_state.sessionLog).length,3,'imported legacy rows preserved by the actual importer');
  const out=R.prepare(projection,basis);
  const Old=oldEngine(f.clock),leg=structuredClone(projection.accepted_state);leg.workoutFacts=undefined;delete leg.workoutFacts;
  const ex=leg.exercises.find(e=>e.id==='demo-leg');
  // Oracle: the imported rows plus the three native lines as one legacy log.
  const oracle=legacyEquivalent(leg,'demo-leg',[{reps:[9,8],rir:[2,undefined]},{reps:[10,9],rir:[2,undefined]},{reps:[11,10],rir:[2,undefined]},{reps:[8,7],rir:[3,0]},{reps:[9,8],rir:[3,0]},{reps:[10,9],rir:[3,0]}]);
  assert.deepEqual(target(out.capture,'demo-leg'),Old.targetsFor(oracle.exercises.find(e=>e.id==='demo-leg'),oracle),'native lines after the imported baseline govern');
  assert.deepEqual(target(out.capture,'demo-leg'),[10,10]);
  assert.notDeepEqual(target(out.capture,'demo-leg'),Old.targetsFor(ex,leg),'the imported cache/log alone would have answered differently');
  // Later source: root activation accepted after every Start; Starts do not descend from it.
  const later=X.sourceControlOp({seq:Object.keys(R.g.collections.ops).length+1,predecessor:null,lease:f.lease.lease_id,id:'source-B',source_id:'synthetic-source-B'});
  later.canonical_content_commitment=X.Ops.commitmentOf(later,f.O.K_IDENTITY);
  const gB=X.acceptedClone(R.src.generation,[later]);
  const cut=gB.collections.sync.frontier.W-1;
  R.nodes.set('source-B',{selection:X.selectionFor(later,cut+1,{W:cut,selection_id:null}),material:R.materialFor(X.prefixOf(gB,cut))});
  const B=await R.project(gB,'source-B');
  assert.equal(B.projection.workout_history.sessions.length,3,'factual membership preserved');assert.equal(B.projection.workout_history.order.import_anchor,undefined,'no proved anchor for a non-descended later source');
  throwsCode(()=>R.prepare(B.projection,B.basis),'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED');
  // Rollback to A restores the proved original relationship.
  const rollback=X.sourceControlOp({seq:cut+2,predecessor:null,lease:f.lease.lease_id,id:'source-rollback',type:'source-rollback-intent',source_id:'synthetic-source-A',target:'source-A'});
  rollback.canonical_content_commitment=X.Ops.commitmentOf(rollback,f.O.K_IDENTITY);
  const gR=X.acceptedClone(R.src.generation,[later,rollback]);
  R.nodes.set('source-rollback',{selection:X.selectionFor(rollback,cut+2,{W:cut+1,selection_id:'source-B'},'rollback','source-A'),material:R.nodes.get('source-A').material});
  const RB=await R.project(gR,'source-rollback');
  assert.deepEqual(RB.projection.workout_history.order.import_anchor,{source_generation_id:'synthetic-source-A',activation_op_id:'source-A'});
  assert.deepEqual(target(R.prepare(RB.projection,RB.basis).capture,'demo-leg'),[10,10],'rollback restores the governing native read');
  // Actual importer refusals executed: material mismatch and data-loss guard.
  const tampered=structuredClone(R.nodes.get('source-A'));const wrong=JSON.parse(tampered.material.candidate_json);wrong.trend=999;tampered.material.candidate_json=JSON.stringify(wrong);
  R.nodes.set('source-A',tampered);await rejectsCode(R.project(),'SOURCE_PREPARATION_REPRODUCTION_MISMATCH');R.nodes.set('source-A',structuredClone(R.nodes.get('source-A')));
  const engine=R.engineFor({day:DAY,hour:12}),shrunk=structuredClone(importedBaseline());delete shrunk.sessionLog[Object.keys(shrunk.sessionLog)[0]];
  assert.equal(engine.dataLossGuard(importedBaseline(),engine.migrate(shrunk)).safe,false,'actual dataLossGuard refuses a shrunk migration');
  assert.equal(engine.migrate(structuredClone(importedBaseline())).v,engine.SCHEMA_V);
 }finally{f.close();}
});

test('item 4: authored std/reclaim precedence, load-vector correspondence, technique era, explicit reset and debut paths over real native facts',async()=>{
 const f=await X.durable();try{
  await f.workout({lift:'demo-leg',sets:[{reps:9,reserve:bound,load:pounds(40)},{reps:8,reserve:exact(0),load:pounds(35)}]});
  f.setDay(F.dayOffset(DAY,4));
  await f.workout({lift:'demo-leg',sets:[{reps:11,reserve:bound,load:pounds(40)},{reps:10,reserve:exact(0),load:pounds(40)}]});
  const facts=await f.facts(),E=newEngine(f.clock,assumed),Old=oldEngine(f.clock),today=f.today();
  const state=mutate=>f.engineState(facts,mutate),leg=s=>s.exercises.find(e=>e.id==='demo-leg');
  // Authored std/reclaim keep precedence and the fit-to-set-count rule.
  let s=state(x=>{leg(x).std=[11,9,8];leg(x).own=true;leg(x).ownNote='synthetic';});assert.deepEqual(E.targetsFor(leg(s),s),[11,9]);
  s=state(x=>{leg(x).reclaim=[9];});assert.deepEqual(E.targetsFor(leg(s),s),[9,8]);
  // Load vector: the older row [40,35] matches wSets [40,35]; the newer [40,40] does not.
  s=state(x=>{leg(x).wSets=[40,35];});assert.deepEqual(E.governingLast(leg(s),s),[11,10]);assert.deepEqual(E.progressAnchor(leg(s),s),[9,8],'anchor is the row whose performed loads equal the current vector at every position');
  s=state();assert.deepEqual(E.progressAnchor(leg(s),s),[11,10],'scalar 40 at both positions matches the newer row');
  s=state(x=>{leg(x).w=45;});assert.deepEqual(E.progressAnchor(leg(s),s),[11,10],'changed load: no row matches, the governing last line is the baseline');
  assert.equal(E.progressionSetCount(leg(s),s),2,'no tenure at the new load: every set progression-bearing');
  s=state(x=>{leg(x).w='BW';});assert.deepEqual(E.progressAnchor(leg(s),s),[11,10],'configuration vs numeric: no match, never a magnitude');
  // Technique era: an era starting after both rows makes the lift fresh and unanchored.
  s=state(x=>{leg(x).forks=[{from:F.dayOffset(today,1),kind:'reset',why:'synthetic'}];});
  f.setDay(F.dayOffset(today,3));
  assert.equal(E.eraFresh(s,'demo-leg'),true);assert.deepEqual(E.progressStep(leg(s),s),{add:0,why:'new baseline — the setup changed, so the first session under it sets the line; steps resume from what it says'});
  assert.deepEqual(E.targetsFor(leg(s),s),[11,10],'old-era line prescribes as the baseline plan with a zero step');
  s=state(x=>{leg(x).forks=[{from:F.dayOffset(today,-1),kind:'reset',why:'synthetic'}];});assert.equal(E.eraFresh(s,'demo-leg'),false,'a native session inside the new era ends freshness');
  f.setDay(today);
  // Explicit reset: last null plus a dated RESET APPLIED line.
  s=state(x=>{leg(x).last=null;leg(x).w=35;x.feed.unshift({d:F.dayOffset(today,1),t:'RESET APPLIED — Leg press 40 → 35',how:'synthetic'});});
  assert.equal(E.governingLast(leg(s),s),null,'rows before the reset never undo the consented reset');assert.deepEqual(E.targetsFor(leg(s),s),[10,10]);
  s=state(x=>{leg(x).last=null;leg(x).w=35;x.feed.unshift({d:today,t:'RESET APPLIED — Leg press 40 → 35',how:'synthetic'});});
  throwsCode(()=>E.governingLast(leg(s),s),'PROGRESSION_RESET_MAPPING_REQUIRED');throwsCode(()=>f.runtime.genSession(s,today,legacySlp),'PROGRESSION_RESET_MAPPING_REQUIRED');
  s=state(x=>{leg(x).last=null;leg(x).w=40;x.feed.unshift({d:F.dayOffset(DAY,1),t:'RESET APPLIED — Leg press 45 → 40',how:'synthetic'});});
  assert.deepEqual(E.governingLast(leg(s),s),[11,10],'a row after the reset sets the line again');
  // Debut: the queued load change debits the governing native line.
  s=state(x=>{x.queue.push({id:'synthetic-debut',kind:'debut',state:'DEBUT',done:false,exId:'demo-leg',newW:45,t:'Synthetic debut'});});
  let card=f.runtime.genSession(s,today,legacySlp).ex.find(c=>c.id==='demo-leg');
  const leg2=legacyEquivalent(f.input.state,'demo-leg',[{reps:[11,10],rir:[3,0]}]);leg2.queue.push(structuredClone(s.queue.at(-1)));
  assert.deepEqual(card.tgt,Old.genSession(leg2,today,legacySlp).ex.find(c=>c.id==='demo-leg').tgt,'debut debit over the native line equals the existing rule');
  assert.equal(card.w,45);assert.match(card.note,/DEBUT at 45/);
  // Qualified debut with no line at all: the existing first/hi-2 path.
  s=state(x=>{leg(x).last=null;x.queue.push({id:'synthetic-debut',kind:'debut',state:'DEBUT',done:false,exId:'demo-curl',newW:45,t:'Synthetic debut'});const curl=x.exercises.find(e=>e.id==='demo-curl');curl.last=null;delete curl.first;});
  card=f.runtime.genSession(s,today,legacySlp).ex.find(c=>c.id==='demo-curl');assert.deepEqual(card.tgt,[10,10]);assert.match(card.note,/DEBUT at 45/);
  // Plan/queue/input state untouched by the reads.
  const before=JSON.stringify(s);f.runtime.genSession(s,today,legacySlp);assert.equal(JSON.stringify(s),before);
 }finally{f.close();}
});

test('item 6: injected workoutFacts cannot replace the registered view; mismatched basis, changed source, invalid chronology and resolver failures keep explicit refusals; old and new producer builds stay distinct',async()=>{
 const f=await X.durable({seedOps:[spec=>X.sourceControlOp({...spec,id:'source-A',source_id:'synthetic-source-A'})]});try{
  await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},{reps:7,reserve:exact(0)}]});
  const imported=importedBaseline();imported.workoutFacts={profile:'synthetic-injected-view',sessions:[{start_op_id:'forged'}]};
  const R=await replayFixture(f,{imported});const {projection,basis}=await R.project();
  let reached;const spy={genSession:(...a)=>{reached=a[0];return f.runtime.genSession(...a);},rirPlan:(...a)=>f.runtime.rirPlan(...a)};
  R.prepare(projection,basis,R.adapterFor(spy));
  assert.equal(reached.workoutFacts.profile,'earned/workout-facts/v1','the registered view, never the imported object');
  assert.deepEqual(projection.accepted_state.workoutFacts,imported.workoutFacts,'the import keeps the unknown field as data');
  throwsCode(()=>R.adapterFor().prepare({sourceProjection:projection,source_basis:{...basis,W:basis.W+1},day:DAY,basis:{plan_basis:'p',input_basis:'i',source_revision:1}}),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  throwsCode(()=>R.adapterFor().prepare({sourceProjection:structuredClone(projection),source_basis:basis,day:DAY,basis:{plan_basis:'p',input_basis:'i',source_revision:1}}),'SOURCE_WORKOUT_INPUT_DISAGREEMENT','a detached copy is not the registered projection');
  throwsCode(()=>R.adapterFor().prepare({sourceProjection:projection,source_basis:basis,state:{...projection.accepted_state},day:DAY,basis:{plan_basis:'p',input_basis:'i',source_revision:1}}),'ENGINE_CAPTURE_SOURCE_INPUT_DISAGREEMENT');
  // Resolver absent/mismatched: explicit refusal, no default flag.
  const missing=Runtime.createEngineRuntime({clock:f.clock});throwsCode(()=>R.prepare(projection,basis,R.adapterFor(missing)),'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
  const stale=Runtime.createEngineRuntime({clock:f.clock,nativeTrendContext:q=>({...assumed(q),source_revision:q.source_revision+1})});throwsCode(()=>R.prepare(projection,basis,R.adapterFor(stale)),'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
  // Invalid chronology on a detached facts copy refuses at the performed reader.
  const s=f.engineState(await f.facts());s.workoutFacts.order.start_ids=[];throwsCode(()=>f.runtime.genSession(s,DAY,legacySlp),'PERFORMED_HISTORY_ORDER_UNRESOLVED');
  // Producer builds: the old build reconstructs its original capture exactly; the new build is distinct.
  const src=await f.source(),start=src.history.sessions[0].start.operation;
  const oldProducer={...f.producer,engine_build:'accepted-preimage-build'},oldRuntime=(()=>{const E=oldEngine(f.clock);return {genSession:E.genSession,rirPlan:E.rirPlan};})();
  const oldAdapter=X.Adapter.createEngineWorkoutCapture({engine:oldRuntime,prescriptionCapture:f.capture,producerIdentity:oldProducer});
  const oldInput={state:X.nativeOnlyState(DAY),day:DAY,basis:{plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:1}};
  const originalCapture=oldAdapter.prepare(oldInput).capture;
  assert.deepEqual(oldAdapter.resolveLayout({start:{prescription_capture:originalCapture},originalInput:oldInput}),oldAdapter.readLayout(originalCapture));
  throwsCode(()=>f.adapter.resolveLayout({start:{prescription_capture:originalCapture},originalInput:oldInput}),'ENGINE_CAPTURE_ORIGINAL_INPUT_REQUIRED','a different engine_build never reconstructs another build\'s capture');
  assert.equal(start.prescription_capture.producer.engine_build,'native-next-targets-candidate');assert.notEqual(originalCapture.producer.engine_build,start.prescription_capture.producer.engine_build);
 }finally{f.close();}
});

test('item 7: focused effective regressions detect ignoring a correction, a stale cache, a compacted skipped slot and bypassed source/reset checks; candidate bytes restored',async()=>{
 const f=await X.durable({seedOps:[spec=>X.sourceControlOp({...spec,id:'source-A',source_id:'synthetic-source-A'})]});try{
  const state=X.nativeOnlyState(DAY,s=>{const leg=s.exercises.find(e=>e.id==='demo-leg');leg.sets=3;leg.last=[12,12,12];});
  Object.assign(f.input.state,state);
  await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},'skipped',{reps:7,reserve:exact(0)}],completion:'early'});
  const facts=await f.facts(),entry=facts.sessions[0].record.entries[0];
  await f.edit(entry.slots[0].fact.source_op_id,'correct',{reps:{value:10,unit:'rep'}});
  const corrected=await f.facts(),s=f.engineState(corrected),ex=s.exercises.find(e=>e.id==='demo-leg');
  const good=newEngine(f.clock,assumed),expected=good.targetsFor(ex,s);
  const mutants={
   'ignores the correction':src=>src.replace('reps.push(slot.fact.current.reps.value);continue;','reps.push(slot.fact.original.reps.value);continue;'),
   'uses the stale cache':src=>src.replace('  if (rows === null) return ex.last;\n  return rows.length ? _lineOf(rows[rows.length - 1]) : null;','  return ex.last;').replace('  if (_nativeView(s)) {\n    const rows = _governingRows(ex, s) || [];','  if (false) {\n    const rows = [];'),
   'compacts the skipped slot':src=>src.replace("    stop=slot.state;\n   }","    if(slot.state!=='skipped')stop=slot.state;else continue;\n   }"),
   'bypasses the reset check':src=>src.replace('  const at = _resetAfter(ex, s);\n  if (at == null) return rows;','  return rows;'),
   'bypasses the source chronology check':src=>src.replace('  for (const row of E.performedHistoryRows(s)) {\n    const native = row.source === "performed";\n    const en = ((row.rec || {}).entries || []).find','  for (const row of E.performedHistoryMembers(s)) {\n    const native = row.source === "performed";\n    const en = ((row.rec || {}).entries || []).find'),
  };
  const files={'ignores the correction':'rebuild/engine/performed.cjs','uses the stale cache':'rebuild/engine/progression.cjs','compacts the skipped slot':'rebuild/engine/performed.cjs','bypasses the reset check':'rebuild/engine/progression.cjs','bypasses the source chronology check':'rebuild/engine/progression.cjs'};
  for(const [name,mutate]of Object.entries(mutants)){
   const sources={...CANDIDATE};const before=sources[files[name]];sources[files[name]]=mutate(before);assert.notEqual(sources[files[name]],before,'mutation applied: '+name);
   const bad=X.composeFrom(sources,{clock:f.clock,nativeTrendContext:assumed});let detected=false;
   try{
    if(name==='bypasses the reset check'){const r=structuredClone(s);const leg=r.exercises.find(e=>e.id==='demo-leg');leg.last=null;r.feed.unshift({d:DAY,t:'RESET APPLIED — Leg press 45 → 40',how:'synthetic'});
     let threw=false;try{bad.governingLast(leg,r);}catch(e){threw=e.code==='PROGRESSION_RESET_MAPPING_REQUIRED';}detected=!threw;}
    else if(name==='bypasses the source chronology check'){const R=await replayFixture(f,{imported:importedBaseline()});const {projection,basis}=await R.project();
     const mixed={...projection.accepted_state,workoutFacts:projection.workout_history};delete mixed.workoutFacts.order.import_anchor;
     let threw=false;try{bad.targetsFor(mixed.exercises.find(e=>e.id==='demo-leg'),mixed);}catch(e){threw=e.code==='PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED';}
     let goodThrew=false;try{good.targetsFor(mixed.exercises.find(e=>e.id==='demo-leg'),mixed);}catch(e){goodThrew=e.code==='PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED';}
     assert.equal(goodThrew,true);detected=!threw;}
    else{const got=bad.targetsFor(ex,s);detected=JSON.stringify(got)!==JSON.stringify(expected);}
   }catch(e){detected=true;}
   assert.equal(detected,true,'regression detected by a reached assertion: '+name);
  }
  for(const file of D.OWNED)assert.equal(X.sha(fs.readFileSync(path.join(X.ROOT,file),'utf8')),X.sha(CANDIDATE[file]),'candidate bytes untouched: '+file);
 }finally{f.close();}
});
