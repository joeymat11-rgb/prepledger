'use strict';
// Synthetic compatibility diagnosis, NOT an athlete projection or new training rule.
// The projector runs real unchanged code on declared synthetic rows, not signed HTTP.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const cp=require('node:child_process'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../../..'),base='075f37c0e0cbe51ade41f42a667469cc4684cd0e';
const NativeDate=Date,clone=structuredClone;
const files=['dates','constants','plan','progression','sleep','energy','policy','today','volume','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
files.push('rebuild/m3/w7-preview/browser-engine.cjs','rebuild/m3/w7-preview/fixtures.cjs');
for(const file of files){
 const source=fs.readFileSync(path.join(root,file));
 const old=cp.spawnSync('git',['show',base+':'+file],{cwd:root,windowsHide:true,maxBuffer:8e6});
 assert.equal(old.status,0,'Missing pinned source');assert(source.equals(old.stdout),'Changed source: '+file);
}
const sourceRoot=process.argv[2];assert(sourceRoot,'Pass the retained W6 worktree path (public source only)');
const projectionFile=path.resolve(sourceRoot,'rebuild/m4/workout/project-history.mjs');
const projectionBytes=fs.readFileSync(projectionFile);
const declared=cp.spawnSync('git',['show','f7e7e42f35a2128e753b0f6cef4d9f6b954a29b1:rebuild/m4/workout/project-history.mjs'],
 {cwd:root,windowsHide:true,maxBuffer:8e6});
assert.equal(declared.status,0);assert(projectionBytes.equals(declared.stdout),'Changed factual projector');
const schemaFile=path.resolve(sourceRoot,'rebuild/m4/workout/schema.cjs');
const schemaPin=cp.spawnSync('git',['show','f7e7e42f35a2128e753b0f6cef4d9f6b954a29b1:rebuild/m4/workout/schema.cjs'],{cwd:root,windowsHide:true,maxBuffer:8e6});
assert.equal(schemaPin.status,0);assert(fs.readFileSync(schemaFile).equals(schemaPin.stdout),'Changed shape validator');
const {validateWorkoutShape}=require(schemaFile);
const F=require('../../m3/w7-preview/fixtures.cjs');
const clock={today:()=>F.SYNTHETIC_DAY,nowMs:()=>NativeDate.UTC(2030,1,4,12),hour:()=>12,
 nowISO:()=>new NativeDate(NativeDate.UTC(2030,1,4,12)).toISOString(),dow:()=>1};
const E=require('../../m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock});
Object.assign(E,require('../../engine/writers.cjs')(E,{clock,ids:{next(){throw Error('Unexpected mint');}},drafts:{length:0,key:()=>null}}));
function initial(){const s=F.createSyntheticState();s.sessionLog={};s.exercises[0].sets=3;s.exercises[0].last=[8,8,8];return s;}
const payload=(w,reps,reserve)=>({load:{value:w,unit:'lb'},reps:{value:reps,unit:'rep'},reserve});
const exact=value=>({tag:'exact',value,unit:'rep'});
function workout(){
 const ops={start:{op_id:'start',kind:'session-start',causal_parents:[],payload:{}}};
 for(const [i,w]of [40,35,30].entries())ops['set'+i]={op_id:'set'+i,kind:'session-set',causal_parents:['start'],
  logical_set_slot:String(i),lift_lineage_id:'demo-press',payload:payload(w,8,i===1?{tag:'at_least',value:3,unit:'rep'}:exact(i===0?2:0))};
 return ops;
}
// This deliberately proposes extra fields to the legacy writer to witness that
// simply adding vectors/IDs to its input cannot preserve them. It is not a schema.
function legacyAttempt(facts){return {id:'demo-press',w:facts[0].current.load.value,
 reps:facts.map(f=>f.current.reps.value),rir:2,rirEnd:0,
 wSets:facts.map(f=>f.current.load.value),rirSets:facts.map(f=>clone(f.current.reserve)),
 source_op_ids:facts.map(f=>f.source_op_id)};}
(async()=>{
 const {projectWorkoutRecords}=await import(pathToFileURL(projectionFile));
 const project=inputs=>{
  const ids=Object.keys(inputs),ops=Object.fromEntries(ids.map((id,i)=>{
   const op=inputs[id],fields=op.kind==='session-start'?{planned_split_slot_id:'synthetic-U',plan_basis:'synthetic-plan'}:
    op.kind==='session-set'?{session_start_op_id:'start'}:{lift_lineage_id:'demo-press'};
   const full={athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:i+1,
    device_predecessor_op_id:i?ids[i-1]:null,class:'session',effective:{local_date:F.SYNTHETIC_DAY,local_time:'12:00',utc_offset:'-05:00'},
    schema_version:2,lease_id:'synthetic-lease',canonical_content_commitment:'synthetic-unverified',...fields,...clone(op)};
   assert.equal(validateWorkoutShape(full).valid,true,'Synthetic operation must have a valid shape');return [id,full];
  }));
  return projectWorkoutRecords({start:{status:'accepted-through-frontier'},records:Object.values(ops)
   .filter(op=>op.op_id!=='start').map(operation=>({operation,status:'accepted-through-frontier'}))},ops);
 };
 let count=0;const check=(name,fn)=>{fn();count++;console.log('COMPATIBILITY '+name+' CONFIRMED');};
 for(const mode of ['native','frozen']){
  if(mode==='frozen')globalThis.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[NativeDate.UTC(2027,0,1)]));}static now(){return NativeDate.UTC(2027,0,1);}};
  try{
   const ops=workout(),before=clone(ops),a=project(ops);assert.equal(a.progression_eligible,false);
   check(mode+' / rich facts survive unchanged projector',()=>{assert.deepEqual(ops,before);assert.deepEqual(a.facts.map(f=>f.current.load.value),[40,35,30]);assert.deepEqual(a.facts[1].current.reserve,{tag:'at_least',value:3,unit:'rep'});});
   const changed=clone(ops);changed.set1.payload.load.value=25;
   const b=project(changed),enA=legacyAttempt(a.facts),enB=legacyAttempt(b.facts);
   const first=E.completeSession(initial(),F.SYNTHETIC_DAY,[clone(enA)],{clean:true});
   const second=E.completeSession(initial(),F.SYNTHETIC_DAY,[clone(enB)],{clean:true});
   check(mode+' / distinct performed vectors collapse in real writer',()=>{assert.notDeepEqual(enA,enB);assert.deepEqual(first,second);assert.equal(Object.hasOwn(first.s.sessionLog[F.SYNTHETIC_DAY].entries[0],'wSets'),false);});
   check(mode+' / per-set effort and source identity omitted',()=>{const out=first.s.sessionLog[F.SYNTHETIC_DAY].entries[0];assert.deepEqual(out.rirSets,[2,null,0]);assert.equal(Object.hasOwn(out,'source_op_ids'),false);assert.notDeepEqual(out.rirSets,enA.rirSets);});
   check(mode+' / scalar score ignores performed-vector difference',()=>{assert.equal(E.sessionScore(enA),E.sessionScore(enB));assert.notEqual(a.facts.reduce((n,f)=>n+f.current.load.value*f.current.reps.value,0),b.facts.reduce((n,f)=>n+f.current.load.value*f.current.reps.value,0));});
   check(mode+' / tagged effort is not a drop-in legacy numeric value',()=>{
    const s=initial(),ex=s.exercises[0];
    ex.lastMeta={reps:[8,8,8],rirSets:[2,null,3]};const numeric=E.progressStep(ex,s);
    ex.lastMeta.rirSets[2]={tag:'at_least',value:3,unit:'rep'};const tagged=E.progressStep(ex,s);
    assert.equal(numeric.add,3);assert.equal(tagged.add,1);assert.notEqual(tagged.why,numeric.why);
    // This diagnoses a proposed adapter's invalid coercion, not a claim that
    // the accepted old app currently stores tagged objects or that +3 is qualified.
   });
   check(mode+' / repeated exercise entries do not preserve distinct loads',()=>{
    const entries=[{id:'demo-press',w:40,reps:[8],rir:2},{id:'demo-press',w:30,reps:[8],rir:0}];
    const out=E.completeSession(initial(),F.SYNTHETIC_DAY,clone(entries),{clean:true});
    const recorded=out.s.sessionLog[F.SYNTHETIC_DAY].entries;
    assert.equal(recorded.length,2);assert.equal(recorded[0].w,recorded[1].w);
    assert.notDeepEqual(recorded.map(e=>e.w),entries.map(e=>e.w));
   });
   const edits=clone(ops);edits.edit={op_id:'edit',kind:'correction',target_op_id:'set1',causal_parents:['set1'],payload:{replacement_fields:{load:{value:25,unit:'lb'},reserve:{tag:'unknown'}}}};
   const corrected=project(edits);
   check(mode+' / correction keeps original and bounded-to-unknown distinction',()=>{assert.deepEqual(corrected.facts[1].original,ops.set1.payload);assert.equal(corrected.facts[1].current.load.value,25);assert.deepEqual(corrected.facts[1].current.reserve,{tag:'unknown'});assert.deepEqual(corrected.facts[1].edit_op_ids,['edit']);assert.equal(corrected.progression_eligible,false);});
   edits.remove={op_id:'remove',kind:'tombstone',target_op_id:'set0',causal_parents:['set0'],payload:{reason:'Synthetic mistaken entry'}};
   const removed=project(edits);
   check(mode+' / removal retains original and later corrected facts',()=>{assert.equal(removed.facts[0].included,false);assert.deepEqual(removed.facts[0].original,ops.set0.payload);assert.deepEqual(removed.facts[1],corrected.facts[1]);assert.deepEqual(removed.facts[2],corrected.facts[2]);});
  }finally{globalThis.Date=NativeDate;}
 }
 console.log('PERFORMED ENGINE COMPATIBILITY: '+count+'/'+count+' diagnostics CONFIRMED; lossless writer/reader join NOT IMPLEMENTED; no eligibility or personal prescription granted');
 console.log('SOURCE projector SHA256 '+crypto.createHash('sha256').update(projectionBytes).digest('hex')+'; engine closure byte-identical to '+base);
})().catch(error=>{globalThis.Date=NativeDate;console.error(error);process.exitCode=1;});
