'use strict';
// NATIVE-NEXT-TARGETS correction-01 (rev173 N1/N2) joined author evidence.
// N1: the client's actual source-aware capture profile v2 with selection_id
//     null — prepare → Start/save → sets → close → stored correction → fresh
//     encrypted reopen → registered projection → genSession/rirPlan → next
//     capture saved and reopened byte for byte. The null-selection projection
//     reader is TEST-ONLY (fixture.cjs) because reading-replay registers a
//     workoutInput only for a string selectionId; a non-null activation stays
//     an explicit boundary and is refused here rather than manufactured.
// N2: added positions (accepted added-slot correction 3965eaa5, composed in a
//     SEPARATE test root beside this candidate engine) remain factual on the
//     history and never size the original progression, its opener/terminal
//     effort or its why. In the native root (no extension capture) the N2 test
//     is skipped with its reason printed; it runs in the composition root.
// Author tests are not independent acceptance.
const test=require('node:test'),assert=require('node:assert/strict');
const X=require('../../spec/native-next-target-candidate/fixture.cjs');
const PACKET=process.env.EARNED_NATIVE_PACKET_ROOT;if(!PACKET)throw new Error('Provide the immutable packet root explicitly (EARNED_NATIVE_PACKET_ROOT)');
const D=X.Delta,ACCEPTED=X.acceptedSources(PACKET),CANDIDATE=X.candidateSources(),F=X.F,DAY=X.DAY;
const {pounds,exact,bound,assumed}=X;
const throwsCode=(fn,code)=>assert.throws(fn,e=>e?.code===code||(()=>{throw new Error('expected '+code+' got '+(e?.code||e?.message));})());
const oldEngine=(clock,resolver=assumed)=>X.composeFrom(ACCEPTED,{clock,nativeTrendContext:resolver});
const newEngine=(clock,resolver=assumed,sources=CANDIDATE)=>X.composeFrom(sources,{clock,nativeTrendContext:resolver});
const legacySlp={};
const target=(view,lift)=>view.slots.filter(s=>s.lift_lineage_id===lift).map(s=>JSON.parse(s.reps.source_json).value);
const effort=(view,lift)=>view.slots.filter(s=>s.lift_lineage_id===lift).map(s=>JSON.parse(s.effort.source_json).target);
const reason=(view,lift)=>view.slots.find(s=>s.lift_lineage_id===lift).reason.display;
const tagOf=values=>values.map(v=>v&&typeof v==='object'?[v.tag,v.value??null]:v);
// Legacy oracle, identical to the candidate-01 joined test's: the SAME numeric
// line entered as an old sessionLog row, read by the accepted engine's rules.
function legacyEquivalent(base,lift,rows,{w=40}={}){
 const s=structuredClone(base);s.sessionLog={};
 for(const [i,row]of rows.entries()){const d=F.dayOffset(DAY,-(rows.length-i)*2);
  const rirSets=row.rir.map(r=>r===undefined?null:r);
  s.sessionLog[d]={type:'L',entries:[{id:lift,w,reps:row.reps.slice(),rir:rirSets[0],rirEnd:rirSets.length>1?rirSets[rirSets.length-1]:undefined,rirSets,sets:row.reps.length}]};}
 const ex=s.exercises.find(e=>e.id===lift);const last=rows.length?s.sessionLog[Object.keys(s.sessionLog).sort().at(-1)].entries[0]:null;
 ex.last=last?last.reps.slice():null;ex.lastMeta=last?{d:Object.keys(s.sessionLog).sort().at(-1),w,reps:last.reps.slice(),rir:last.rir??null,rirSets:last.rirSets.slice(),debt:false}:null;return s;
}
const opsOf=async f=>(await f.repository.load()).generation.collections.ops;

test('correction carrier: the N2 change is a published expected change and the candidate on disk is exactly construct(accepted) with performedOriginalRirSets wired to progressStep and the hot-opener count',()=>{
 const out=D.construct(Object.fromEntries(D.OWNED.map(f=>[f,ACCEPTED[f]])));
 assert.equal(out.changes.length,34);assert.equal(D.EXPECTED.length,10);
 assert.match(D.EXPECTED[9],/rev173 N2/);assert.match(D.EXPECTED[0],/added positions never enter it and never end it/);
 for(const f of D.OWNED)assert.equal(X.sha(CANDIDATE[f]),out.pins[f].after,f);
 const P=CANDIDATE['rebuild/engine/performed.cjs'],G=CANDIDATE['rebuild/engine/progression.cjs'],W=CANDIDATE['rebuild/engine/writers.cjs'],L=CANDIDATE['rebuild/engine/plan.cjs'];
 assert.equal(P.split('function performedOriginalRirSets(').length,2);assert.equal(P.split("slot.origin!=='added'").length,2);
 assert.equal(G.split('E.performedOriginalRirSets(rich)').length,2);assert.equal(G.split('!line9.originals').length,2);
 assert.equal(W.split('E.performedOriginalRirSets(rich)[0]').length,2);assert.equal(W.split('E.performedRirSets(rich)[0]').length,1);
 assert.equal(L.split('(E.performedLine(e) || {}).originals').length,2);
 // Unit truth table over hand-shaped typed entries: added positions never enter
 // the line, the original vector or the count; an original hole still ends it.
 const E=newEngine(X.clockFor(DAY));
 const slot=(i,state,reserve,extra={})=>({position:i,logical_set_slot:JSON.stringify(['lift-x',i]),prescribed_effort:{state:'specified',target:1},state,
  ...(state==='performed'?{fact:{included:true,source_op_id:'src-'+i,logical_set_slot:JSON.stringify(['lift-x',i]),lift_lineage_id:'lift-x',source_status:'stored-on-this-device',current_status:'stored-on-this-device',edit_op_ids:[],issues:[],
   current:{load:{value:40,unit:'lb'},reps:{value:10-i,unit:'rep'},reserve}}}:state==='skipped'?{skip_op_id:'skip-'+i}:{}),...extra});
 const entry=slots=>({profile:'earned/performed-lift/v1',start_op_id:'start-1',lift_lineage_id:'lift-x',correspondence_profile:'earned/engine-workout-capture/v1',completion:{op_id:'close-1',kind:'normal',status:'stored-on-this-device'},slots});
 const added=(i,reserve)=>slot(i,'performed',reserve,{origin:'added',slot_definition_op_id:'ext-1',extension_slot:1,definition_state:'active'});
 const full=entry([slot(1,'performed',bound),slot(2,'performed',exact(1)),slot(3,'performed',exact(0)),added(4,bound)]);
 assert.deepEqual(E.performedLine(full),{reps:[9,8,7],positions:3,originals:3,stop:null,beyond:false,added:1});
 assert.deepEqual(tagOf(E.performedOriginalRirSets(full)),[['at_least',3],['exact',1],['exact',0]]);
 assert.deepEqual(tagOf(E.performedRirSets(full)),[['at_least',3],['exact',1],['exact',0],['at_least',3]],'history/receipt mapping keeps the added slot');
 assert.equal(E.performedStepWhy(full,'terminal-zero'),'final set reported 0 reps left; its recorded effort target was 1 reps left. The current rule selects a one-rep step proposal from this rating. 1 added set was recorded after the original positions; it does not size this step.');
 const skippedTerminal=entry([slot(1,'performed',exact(2)),slot(2,'performed',exact(0)),slot(3,'skipped'),added(4,bound)]);
 assert.deepEqual(E.performedLine(skippedTerminal),{reps:[9,8],positions:2,originals:3,stop:'skipped',beyond:false,added:1});
 assert.deepEqual(tagOf(E.performedOriginalRirSets(skippedTerminal)),[['exact',2],['exact',0],['skipped',null]],'the skipped original terminal stays the terminal; the added set is not promoted');
 assert.match(E.performedStepWhy(skippedTerminal,'opener-eq2'),/^opener reported 2 reps left\. The captured final set has no usable effort rating for this rule\. This produces a one-rep step proposal\. 1 added set was recorded after the original positions; it does not size this step\.$/);
 const hole=entry([slot(1,'performed',bound),slot(2,'removed',undefined,{removed_facts:[{included:false,source_op_id:'src-2',logical_set_slot:JSON.stringify(['lift-x',2]),lift_lineage_id:'lift-x',source_status:'stored-on-this-device',current_status:'stored-on-this-device',edit_op_ids:['rm-2'],issues:[],current:{load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve:exact(1)}}]}),slot(3,'performed',exact(0)),added(4,exact(0)),added(5,exact(0))]);
 const holeLine=E.performedLine(hole);assert.deepEqual([holeLine.reps,holeLine.stop,holeLine.beyond,holeLine.added],[[9],'removed',true,2]);
 assert.match(E.performedStepWhy(hole,'terminal-zero'),/ A removed original position sits before the final set; only the performed positions before it anchor the line, and the hole supplies no value\. 2 added sets were recorded after the original positions; they do not size this step\.$/);
 const addedOnly=entry([added(1,exact(0))]);
 assert.deepEqual(E.performedLine(addedOnly),{reps:[],positions:0,originals:0,stop:null,beyond:false,added:1});
 assert.deepEqual(E.performedOriginalRirSets(addedOnly),[]);assert.deepEqual(tagOf(E.performedRirSets(addedOnly)),[['exact',0]]);
 assert.equal(E.performedStepWhy(addedOnly,'no-rating'),'No original prescribed position was captured for this lift in that session, so no opener or final-set rating sizes this step; the current rule uses its default step proposal. 1 added set was recorded after the original positions; it does not size this step.');
 assert.doesNotMatch(E.performedStepWhy(addedOnly,'no-rating'),/removed|unresolved/);
 assert.equal(E.performedLoadMatches(full,[40,40,40]),true);assert.equal(E.performedLoadMatches(full,[40,40,45]),false);
});

test('N1: source-aware capture profile v2 with selection_id null through the actual durable client — prepare, Start/save, sets, close, stored correction, fresh encrypted reopen, registered projection → genSession/rirPlan, next capture saved and reopened; mismatched basis, non-null selection, injected state and unregistered projection refuse',async()=>{
 const state=X.nativeOnlyState(DAY,s=>{const leg=s.exercises.find(e=>e.id==='demo-leg');leg.last=[10,10];leg.lastMeta={d:F.dayOffset(DAY,-3),w:40,reps:[10,10],rir:2,rirSets:[2,null],debt:false};});
 const f=await X.durable({state,sourceProfile:true});try{
  assert.equal(f.capture.profile,'earned/workout-prescription/v2');
  const basis=f.sourceBasis();assert.deepEqual(basis,{W:0,log_digest:X.Source.createPrefixHasher().digest(),selection_id:null});
  const first=await f.prepared();
  assert.equal(first.view.profile,'earned/workout-prescription/v2');assert.deepEqual(first.view.source_basis,basis);
  assert.equal(Object.isFrozen(first.projection),true);assert.equal(first.projection.source_basis.selection_id,null);
  assert.equal(Object.hasOwn(first.engineInput.state,'workoutFacts'),true,'registered view present with zero native sessions');
  const Old0=oldEngine(f.clock),legacyOnly=structuredClone(f.input.state);
  assert.deepEqual(target(first.view,'demo-leg'),Old0.targetsFor(legacyOnly.exercises.find(e=>e.id==='demo-leg'),legacyOnly),'no rows: the imported cache is the baseline (accepted rule) on the v2 path too');
  assert.deepEqual(target(first.view,'demo-leg'),[11,10]);
  // Start/save through the actual client: the stored Start carries the v2 capture and its null-selection basis.
  const w=await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},{reps:7,reserve:exact(1)}]});
  const startOp=(await opsOf(f))[w.start];
  assert.equal(startOp.kind,'session-start');assert.equal(startOp.prescription_capture.profile,'earned/workout-prescription/v2');assert.deepEqual(startOp.prescription_capture.source_basis,basis);
  const p=await f.prepared();
  const oracle=rows=>{const o=oldEngine(f.clock),leg=legacyEquivalent(f.input.state,'demo-leg',rows),ex=leg.exercises.find(e=>e.id==='demo-leg');return {tgt:o.targetsFor(ex,leg),step:o.progressStep(ex,leg)};};
  assert.deepEqual(target(p.view,'demo-leg'),oracle([{reps:[8,7],rir:[3,1]}]).tgt);assert.deepEqual(target(p.view,'demo-leg'),[9,8]);
  assert.match(reason(p.view,'demo-leg'),/final set reported 1 reps left/);assert.deepEqual(p.view.source_basis,basis);
  assert.equal(p.engineInput.state.workoutFacts.sessions.length,1,'the registered projection carries the saved session');
  // Stored correction after a fresh encrypted reopen changes the next answer.
  const facts0=await f.facts(),setB=facts0.sessions[0].record.entries[0].slots[1].fact.source_op_id;
  await f.reopen();await f.edit(setB,'correct',{reps:{value:9,unit:'rep'},reserve:bound});
  const after=await f.prepared();
  assert.deepEqual(target(after.view,'demo-leg'),oracle([{reps:[8,9],rir:[3,3]}]).tgt);assert.deepEqual(target(after.view,'demo-leg'),[10,10]);
  assert.match(reason(after.view,'demo-leg'),/final set reported at least 3 reps left/);
  assert.equal(after.facts.sessions[0].record.entries[0].slots[1].fact.current.reps.value,9);assert.equal(after.facts.sessions[0].record.entries[0].slots[1].fact.original.reps.value,7);
  assert.deepEqual(after.projection.workout_history,after.facts,'the adapter consumed the registered projection carrying the stored correction');
  assert.deepEqual(after.engineInput.source_basis,basis);
  // The two runtime readers on the SAME registered input reproduce the capture.
  const s=after.engineInput.state,card=f.runtime.genSession(s,DAY,legacySlp).ex.find(c=>c.id==='demo-leg');
  assert.deepEqual(card.tgt,[10,10]);assert.equal(card.prev.slots[1].fact.current.reps.value,9);
  const plan=f.runtime.rirPlan(s,{...card,holdFlag:s.exercises.find(e=>e.id==='demo-leg').holdFlag},legacySlp);
  assert.deepEqual(plan.plan,effort(after.view,'demo-leg'));
  // Save the next capture through the actual client and reopen it: bytes preserved, basis preserved.
  const started=await f.client.startPreparedWorkout({preparedId:after.preparedId});assert(started.acknowledged,started.code);
  await f.reopen();const src=await f.source(),saved=src.history.sessions.find(x=>x.start.operation.op_id===started.op_id);
  assert.deepEqual(saved.original,after.view);assert.deepEqual(saved.original.source_basis,basis);assert.equal(saved.original.producer.engine_build,'native-next-targets-candidate');
  assert.deepEqual(src.history.sessions[0].original,first.view,'first original capture unchanged');
  assert.equal(JSON.stringify((await f.source()).history),JSON.stringify(src.history),'a second fresh reopen reads identical history bytes');
  // The saved-but-open session blocks any new preparation on the real client
  // (WORKOUT_HISTORY_RECONCILIATION_REQUIRED) until it is closed through it.
  const blocked=await f.client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert.equal(blocked.prepared,undefined);assert.equal(blocked.code,'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');
  const closed=await f.client.execute('workout',{action:'close',input:{session_start_op_id:started.op_id,completion_kind:'early',causal_parents:[started.op_id]}});assert(closed.acknowledged,closed.code);f.setParents([closed.op_id]);
  // Regressions: every refusal stores nothing and the genuine path still prepares.
  const before=Object.keys(await opsOf(f)).length;
  f.setSourceBasis({W:1,log_digest:basis.log_digest,selection_id:null});
  const refusedBasis=await f.client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert.notEqual(refusedBasis.prepared,true,'a resolver claiming a frontier the registered projection does not hold is refused');
  throwsCode(()=>f.reader.workoutInput(after.projection,{W:1,log_digest:basis.log_digest,selection_id:null}),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  f.setSourceBasis({W:0,log_digest:basis.log_digest,selection_id:'op-not-an-activation'});
  const refusedSelection=await f.client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert.notEqual(refusedSelection.prepared,true);assert.equal(refusedSelection.code,'WORKOUT_BASIS_INVALID','a non-null selection must be a causal parent (public-client): the genuine activation boundary is not crossed here');
  throwsCode(()=>f.reader.workoutInput(after.projection,{W:0,log_digest:basis.log_digest,selection_id:'op-not-an-activation'}),'SOURCE_PROJECTION_LANE_UNAVAILABLE');
  throwsCode(()=>f.registrar.workoutInput(after.projection,{W:0,log_digest:basis.log_digest,selection_id:'op-not-an-activation'}),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  assert.equal(first.projection.profile,'earned/null-selection-projection/v1','the product registrar, not the test-only reader, registered the projection');
  f.setSourceBasis(basis);
  f.setInjectedState(structuredClone(f.input.state));
  const refusedState=await f.client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert.notEqual(refusedState.prepared,true,'a producer-supplied state disagreeing with the registered projection is refused');
  throwsCode(()=>f.adapter.prepare({day:DAY,basis:after.engineInput.basis,sourceProjection:after.projection,source_basis:basis,state:structuredClone(f.input.state)}),'ENGINE_CAPTURE_SOURCE_INPUT_DISAGREEMENT');
  f.setInjectedState(undefined);
  throwsCode(()=>f.reader.workoutInput({...after.projection},basis),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  throwsCode(()=>f.reader.workoutInput(after.projection,{W:0,log_digest:basis.log_digest,selection_id:null,extra:1}),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  assert.equal(Object.keys(await opsOf(f)).length,before,'refusals stored nothing');
  const ok=await f.prepared();assert.deepEqual(target(ok.view,'demo-leg'),[10,10]);assert.deepEqual(ok.view.source_basis,basis);
 }finally{f.close();}
});

const ADDED=typeof X.Capture.createExtensionCapture==='function';
const joined=ADDED?test:(name,fn)=>test.skip(name+' — SKIPPED in this root: no static extension capture (accepted added-slot correction not composed here)',fn);
joined('N2 joined: added positions (accepted added-slot correction, separate composition) stay on the history and never size the original progression — full, prefix, hole, skipped original terminal, new-lift added-only; different added efforts leave the original target/why unchanged; hot-opener reads original openers only',async()=>{
 const state=X.nativeOnlyState(DAY,s=>{const leg=s.exercises.find(e=>e.id==='demo-leg');leg.sets=3;leg.last=null;leg.lastMeta=null;delete leg.first;});
 const f=await X.durable({state});try{
  const Old=oldEngine(f.clock),E=newEngine(f.clock),ext=f.extensionCapture,AddedSlot=X.mod('rebuild/m4/workout/added-slot.cjs');
  assert.equal(ext.profile,'earned/workout-extension/v1');
  const cell=(display,source_json)=>({state:'specified',display,source_json}),unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
  const lb=n=>cell(n+' lb',`{"value":${n},"unit":"lb"}`);
  const slotCells=()=>({reps:cell('8','{"min":8,"max":8}'),effort:cell('8 reps','{"target":8,"unit":"rep"}'),setup:unknown(),reason:unknown(),confidence:unknown()});
  const extensionOf=(startOp,slots)=>{const c=startOp.prescription_capture;return ext.prepare({profile:ext.profile,producer:structuredClone(c.producer),basis:structuredClone(c.basis),
   session:{instruction:cell('Additional work','"extension"'),reason:unknown(),confidence:unknown()},
   slots:slots.map((s,i)=>({extension_slot:i+1,lift_lineage_id:s.lift,label:'Additional set',load:lb(40),...slotCells()}))},{producer:c.producer,basis:c.basis});};
  // Seed one extension and one performed set per added slot before the close,
  // through the fixture's stored-on-this-device seam (the client's builder
  // refuses the kind — the accepted added-slot boundary, unchanged here).
  const seedAdded=added=>async({start})=>f.seedRows(({next,ops})=>{
   const e=next({kind:'session-extension',parents:[start],payload:{extension_capture:extensionOf(ops[start],added)},extra:{session_start_op_id:start}});
   return [e,...added.map((a,i)=>next({kind:'session-set',parents:[e.op_id],payload:{load:pounds(40),reps:{value:a.reps,unit:'rep'},...(a.reserve===undefined?{}:{reserve:a.reserve})},
    extra:{session_start_op_id:start,logical_set_slot:AddedSlot.derivedSlot(e.op_id,i+1),lift_lineage_id:a.lift,slot_definition_op_id:e.op_id}}))];});
  const legOracle=rows=>{const leg=legacyEquivalent(f.input.state,'demo-leg',rows),ex=leg.exercises.find(e=>e.id==='demo-leg');return Old.targetsFor(ex,leg);};
  const legEntry=facts=>facts.sessions.at(-1).record.entries.find(e=>e.lift_lineage_id==='demo-leg');
  // 1. Full original line + one added set whose effort would change the step if promoted (at_least 3 → +3 vs exact 0 → +1).
  const w1=await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},{reps:7,reserve:exact(1)},{reps:6,reserve:exact(0)}],beforeClose:seedAdded([{lift:'demo-leg',reps:5,reserve:bound}])});
  assert.equal(w1.seeded.length,2);
  const p1=await f.prepared(),e1=legEntry(p1.facts);
  assert.deepEqual(e1.slots.map(x=>[x.position,x.state,x.origin??'original',x.definition_state??null]),[[1,'performed','original',null],[2,'performed','original',null],[3,'performed','original',null],[4,'performed','added','active']],'the added-slot projector emits the added position after the originals');
  assert.deepEqual(target(p1.view,'demo-leg'),legOracle([{reps:[8,7,6],rir:[3,1,0]}]),'full line: the original terminal (exact 0) sizes the step, not the added at_least 3');
  const why1=reason(p1.view,'demo-leg');
  assert.match(why1,/final set reported 0 reps left; .*one-rep step proposal from this rating\. 1 added set was recorded after the original positions; it does not size this step\.$/);
  assert.doesNotMatch(why1,/removed|unresolved/);
  const s1=p1.engineInput.state,ex1=s1.exercises.find(e=>e.id==='demo-leg'),meta1=E.governingMeta(ex1,s1);
  assert.deepEqual(E.governingLast(ex1,s1),[8,7,6]);assert.equal(E.progressStep(ex1,s1).add,1);
  assert.deepEqual(tagOf(E.performedOriginalRirSets(meta1)),[['at_least',3],['exact',1],['exact',0]]);
  assert.deepEqual(tagOf(E.rirSetsOf(meta1)),[['at_least',3],['exact',1],['exact',0],['at_least',3]],'history/RIR display keeps the added fact');
  assert.equal(typeof E.rirReceipt(meta1),'string');
  const card1=f.runtime.genSession(s1,DAY,legacySlp).ex.find(c=>c.id==='demo-leg');
  assert.deepEqual(card1.prev.slots.map(x=>[x.state,x.origin??'original']),[['performed','original'],['performed','original'],['performed','original'],['performed','added']],'prev shows the added fact; nothing is hidden');
  // Different added effort/reps (stored correction of the added fact through the actual client): original target, effort and why identical.
  const addedSet=w1.seeded[1].op_id;await f.edit(addedSet,'correct',{reps:{value:9,unit:'rep'},reserve:exact(0)});
  const p1b=await f.prepared(),e1b=legEntry(p1b.facts);
  assert.equal(e1b.slots[3].fact.current.reps.value,9);assert.deepEqual(tagOf([e1b.slots[3].fact.current.reserve]),[['exact',0]]);
  assert.deepEqual([target(p1b.view,'demo-leg'),effort(p1b.view,'demo-leg'),reason(p1b.view,'demo-leg')],[target(p1.view,'demo-leg'),effort(p1.view,'demo-leg'),why1],'a different added effort changes nothing about the original progression');
  // 2. Prefix (third ORIGINAL position unlogged) + added exact 0: the line is the original prefix [8,7]; the terminal is the unlogged third original (no rating), so the opener rule (at_least 3 → +2) sizes the step — never the added exact 0 (+1 if promoted). The legacy oracle over [8,7]/[3,1] lands on the same +2.
  await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},{reps:7,reserve:exact(1)},'unlogged'],completion:'early',beforeClose:seedAdded([{lift:'demo-leg',reps:6,reserve:exact(0)}])});
  const p2=await f.prepared(),s2=p2.engineInput.state,ex2=s2.exercises.find(e=>e.id==='demo-leg');
  assert.deepEqual(target(p2.view,'demo-leg'),legOracle([{reps:[8,7],rir:[3,1]}]));assert.deepEqual(E.governingLast(ex2,s2),[8,7]);assert.equal(E.progressStep(ex2,s2).add,2);
  assert.deepEqual(tagOf(E.performedOriginalRirSets(E.governingMeta(ex2,s2))),[['at_least',3],['exact',1],['absent',null]],'the unlogged third original stays the terminal position');
  assert.match(reason(p2.view,'demo-leg'),/opener reported at least 3 reps left\. The captured final set has no usable effort rating for this rule\. This produces a two-rep step proposal\. 1 added set was recorded after the original positions; it does not size this step\.$/);
  assert.deepEqual(legEntry(p2.facts).slots.map(x=>[x.state,x.origin??'original']),[['performed','original'],['performed','original'],['unlogged','original'],['performed','added']]);
  // 3. Interior original hole (B removed after the fact) + two added sets: [A] anchors, the why names the removed ORIGINAL position and the added sets.
  const w3=await f.workout({lift:'demo-leg',sets:[{reps:9,reserve:bound},{reps:8,reserve:exact(1)},{reps:7,reserve:exact(0)}],beforeClose:seedAdded([{lift:'demo-leg',reps:6,reserve:exact(0)},{lift:'demo-leg',reps:5,reserve:bound}])});
  const e3=legEntry(await f.facts());await f.edit(e3.slots[1].fact.source_op_id,'remove','Mistaken entry');
  const p3=await f.prepared();
  assert.deepEqual(target(p3.view,'demo-leg'),[9,9,7],'interior removal: only the performed prefix [A] anchors, padded by the existing rule; the final ORIGINAL set keeps its own rating');
  assert.match(reason(p3.view,'demo-leg'),/final set reported 0 reps left; .* A removed original position sits before the final set; only the performed positions before it anchor the line, and the hole supplies no value\. 2 added sets were recorded after the original positions; they do not size this step\.$/);
  assert.deepEqual(legEntry(p3.facts).slots.map(x=>[x.state,x.origin??'original']),[['performed','original'],['removed','original'],['performed','original'],['performed','added'],['performed','added']],'positions never compact');
  // 4. Skipped ORIGINAL terminal + added at_least 3: the skipped original stays the terminal; the opener rule (exact 2 → +1) sizes the step, never the added effort (+3 if promoted).
  await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:exact(2)},{reps:7,reserve:exact(0)},'skipped'],completion:'early',beforeClose:seedAdded([{lift:'demo-leg',reps:7,reserve:bound}])});
  const p4=await f.prepared(),s4=p4.engineInput.state,ex4=s4.exercises.find(e=>e.id==='demo-leg'),meta4=E.governingMeta(ex4,s4);
  assert.deepEqual(target(p4.view,'demo-leg'),legOracle([{reps:[8,7],rir:[2,0]}]));assert.equal(E.progressStep(ex4,s4).add,1);
  assert.deepEqual(tagOf(E.performedOriginalRirSets(meta4)),[['exact',2],['exact',0],['skipped',null]]);
  assert.match(reason(p4.view,'demo-leg'),/opener reported 2 reps left\. The captured final set has no usable effort rating for this rule\. This produces a one-rep step proposal\. 1 added set was recorded after the original positions; it does not size this step\.$/);
  assert.deepEqual(legEntry(p4.facts).slots.map(x=>[x.state,x.origin??'original']),[['performed','original'],['performed','original'],['skipped','original'],['performed','added']]);
  assert.equal(f.runtime.genSession(s4,DAY,legacySlp).ex.find(c=>c.id==='demo-leg').tgt.length,3,'three original targets still prescribed');
  // 5. New-lift added-only facts (demo-press is not in this session's prescription): factual on the history, non-eligible for its own progression; three hot added openers never trip the hot-opener rule.
  const pressBefore=structuredClone(f.input.state.exercises.find(e=>e.id==='demo-press'));
  for(let i=0;i<3;i++)await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},{reps:7,reserve:exact(1)},{reps:6,reserve:exact(0)}],beforeClose:seedAdded([{lift:'demo-press',reps:12,reserve:exact(0)}])});
  const p5=await f.prepared(),s5=p5.engineInput.state,press=s5.exercises.find(e=>e.id==='demo-press');
  const pressEntries=p5.facts.sessions.slice(-3).map(x=>x.record.entries.find(e=>e.lift_lineage_id==='demo-press'));
  assert.equal(pressEntries.length,3);for(const en of pressEntries){assert.deepEqual(en.slots.map(x=>[x.position,x.state,x.origin]),[[1,'performed','added']]);
   assert.deepEqual(E.performedLine(en),{reps:[],positions:0,originals:0,stop:null,beyond:false,added:1});assert.deepEqual(E.performedOriginalRirSets(en),[]);assert.deepEqual(tagOf(E.performedRirSets(en)),[['exact',0]]);}
  assert.deepEqual(E.governingLast(press,s5),pressBefore.last,'an added-only session is not a row of the lift: the imported cache stands');
  assert.deepEqual(E.governingMeta(press,s5),pressBefore.lastMeta);
  const legacyPress=structuredClone(f.input.state);
  assert.deepEqual(E.targetsFor(press,s5),Old.targetsFor(legacyPress.exercises.find(e=>e.id==='demo-press'),legacyPress));
  assert.deepEqual(E.progressStep(press,s5),Old.progressStep(legacyPress.exercises.find(e=>e.id==='demo-press'),legacyPress));
  const pressDay='2026-09-10';f.setDay(pressDay);
  const p6=await f.prepared();assert.deepEqual(target(p6.view,'demo-press'),Old.targetsFor(legacyPress.exercises.find(e=>e.id==='demo-press'),legacyPress),'press day through the client: cache baseline, added-only facts do not govern');
  assert.doesNotMatch(reason(p6.view,'demo-press'),/added set|removed|unresolved/,'no session of the press has an original position, so its why is the cache rule');
  const s6=p6.engineInput.state,pressCard=f.runtime.genSession(s6,pressDay,legacySlp).ex.find(c=>c.id==='demo-press');
  const plan6=f.runtime.rirPlan(s6,{...pressCard,holdFlag:s6.exercises.find(e=>e.id==='demo-press').holdFlag},legacySlp);
  assert.equal(plan6.why.some(t=>/openers run hot/.test(t)),false,'three hot ADDED-only sets are not three hot original openers');
  // Effective regression: the candidate-01 opener read (performedRirSets[0]) would count the added-only efforts as hot openers.
  const mutated={...CANDIDATE,'rebuild/engine/writers.cjs':CANDIDATE['rebuild/engine/writers.cjs'].replace('const opener = E.performedOriginalRirSets(rich)[0];','const opener = E.performedRirSets(rich)[0];')};
  assert.notEqual(mutated['rebuild/engine/writers.cjs'],CANDIDATE['rebuild/engine/writers.cjs']);
  const bad=newEngine(X.clockFor(pressDay),assumed,mutated);
  assert.equal(bad.rirPlan(s6,{...pressCard,holdFlag:s6.exercises.find(e=>e.id==='demo-press').holdFlag},legacySlp).why.some(t=>/openers run hot/.test(t)),true,'the mutant is detected');
  // Effective regression: a performedLine that lets an added position end the prefix (candidate-01) changes the added-only row into a row of the lift and revokes the cache.
  const mutatedLine={...CANDIDATE,'rebuild/engine/performed.cjs':CANDIDATE['rebuild/engine/performed.cjs'].replace("   if(!original(slot)){added++;continue;}\n   originals++;","   if(!original(slot)){added++;originals++;if(stop===null)stop='added';continue;}\n   originals++;")};
  assert.notEqual(mutatedLine['rebuild/engine/performed.cjs'],CANDIDATE['rebuild/engine/performed.cjs']);
  assert.equal(newEngine(X.clockFor(pressDay),assumed,mutatedLine).governingLast(press,s6),null,'the mutant is detected: the cache would be revoked by an added-only row');
  assert.deepEqual(E.governingLast(press,s6),pressBefore.last);
 }finally{f.close();}
});
