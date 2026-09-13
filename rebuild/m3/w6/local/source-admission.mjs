import {parseStrictJson} from '../strict-json.mjs';
import {readLocalEra} from './local-era.mjs';
import Ops from '../../../client/ops.cjs';
import {createReadingProjector} from '../reading-history.mjs';
import Food from '../../w7-preview/today/food-commands.cjs';
import FoodModel from '../../w7-preview/today/food-model.cjs';
import CheckIn from '../../w7-preview/today/checkin-commands.cjs';
import Setup from '../../w7-preview/today/setup-commands.mjs';
import {createCleanInitState} from '../../w7-preview/today/setup-model.mjs';
import Settings from '../../../coach/machine-settings-commands.cjs';
import {storedWorkoutHistory} from '../../../m4/workout/stored-history.mjs';
import {projectWorkoutRecords} from '../../../m4/workout/project-history.mjs';
import Capture from '../../../m4/workout/capture.cjs';
import EngineCapture from '../../../m4/workout/engine-capture.cjs';
import History from '../../../m4/workout/engine-history.cjs';
import Runtime from '../../../m4/workout/engine-runtime.cjs';
import Profile from '../../../m4/import/local-source-profile.cjs';
import Order from '../../../m4/import/local-source-order.cjs';
import {createBrowserReplay,createSourceReplayEngine} from '../../../m4/import/browser-replay.mjs';
import {createSourcePlatform} from './source-platform.mjs';

const qualifications=new WeakMap(),reviews=new WeakMap();
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
const {encode,digest,freeze,validDay,sourceEngineContext,engineContextAt}=Profile;
const copy=structuredClone;
const COLLECTIONS=new Set(['ops','outbox','dispositions','rejected','receipts','planTxns','plan','planTransactions','planHistory','suspensions','issuances','sessionStarts','sessionResolutions','drafts','sync','meta','derived']);
export function assertLocalSourceQualification(handle){if(!qualifications.has(handle))fail('LOCAL_SOURCE_QUALIFICATION_UNOWNED');return true;}
// Only narrow closures cross into the commit coordinator. No raw generation,
// enrollment key, or caller-chosen transaction body leaves controller custody.
export function localSourceCommitCapability(handle){assertLocalSourceQualification(handle);return qualifications.get(handle).commitCapability;}
export function createLocalSourceController({repository,namespace,athleteId,deviceId,producerRegistry,asOf,getSemanticEpoch=()=>0,isAlive=()=>true,platform=createSourcePlatform()}={}){
 if(!repository?.load||!repository?.commit||!repository?.importCustody||!namespace||!athleteId||!deviceId||typeof producerRegistry?.qualify!=='function')throw TypeError('Actual repository, enrollment scope and producer registry required');
 let epoch=0,closed=false;
 const currentDay=()=>typeof asOf==='function'?asOf():asOf;
 const stamp=()=>encode({epoch,semantic:getSemanticEpoch(),asOf:currentDay()});
 const syncGuard=expected=>closed||!isAlive()||stamp()!==expected?{code:'LOCAL_SOURCE_STALE',state:3}:null;
 const custody=repository.importCustody({parseStrictJson,validateContext:()=>closed||!isAlive()?{code:'LOCAL_SOURCE_CLOSED',state:3}:null});
 const core=createBrowserReplay({platform}),order=Order.createLocalSourceOrder(platform),reading=createReadingProjector({athleteId,deviceId});
 async function checked(held,action){if(syncGuard(held.stamp))fail('LOCAL_SOURCE_STALE');const value=await action();if(syncGuard(held.stamp))fail('LOCAL_SOURCE_STALE');return value;}
 async function current(held){const loaded=await checked(held,()=>repository.load());if(loaded.revision!==held.expected.revision||loaded.token!==held.expected.token)fail('LOCAL_SOURCE_STALE');return true;}
 function validateGeneration(g){
  const era=readLocalEra(g.metadata),c=g.collections,ops=c.ops||{};
  if(g.metadata.namespace!==namespace||era.lease.athlete_id!==athleteId||era.lease.device_id!==deviceId)fail('LOCAL_SOURCE_SCOPE');
  if(Object.keys(c).some(k=>!COLLECTIONS.has(k)))fail('LOCAL_SOURCE_EFFECT_UNMAPPED');
  if(c.sync?.frontier?.W!==0||(c.sync?.frontier?.authorityW??0)!==0||['receipts','rejected','dispositions'].some(k=>Object.keys(c[k]||{}).length)||Object.keys(g.metadata.wireProofs||{}).length)fail('LOCAL_SOURCE_AUTHORITY_CONTEXT');
  const sequences=new Set(),colors=new Map();
  function visit(id){if(colors.get(id)===1)fail('LOCAL_SOURCE_CAUSAL_CYCLE');if(colors.get(id)===2)return;const op=ops[id];if(!op||!Array.isArray(op.causal_parents)||new Set(op.causal_parents).size!==op.causal_parents.length)fail('LOCAL_SOURCE_ORIGINAL_INVALID');colors.set(id,1);for(const p of op.causal_parents)visit(p);colors.set(id,2);}
  for(const [id,op]of Object.entries(ops)){
   if(op.op_id!==id||op.athlete_id!==athleteId||op.device_id!==deviceId||op.lease_id!==era.lease.lease_id||!Number.isSafeInteger(op.device_seq)||op.device_seq<1||sequences.has(op.device_seq)||![1,2].includes(op.schema_version)||!Ops.KINDS.includes(op.kind)||!Ops.CLASSES.includes(op.class)||Ops.commitmentOf(op,era.identityKey)!==op.canonical_content_commitment||c.outbox?.[id]?.op_id!==id)fail('LOCAL_SOURCE_ORIGINAL_INVALID');
   if(['authority_signature','athlete_log_seq','accepted_at','decided_at','sealing_transitions','sealed'].some(k=>Object.hasOwn(op,k)))fail('LOCAL_SOURCE_AUTHORITY_CONTEXT');
   if(Ops.TARGET_REQUIRED.has(op.kind)?typeof op.target_op_id!=='string'||!op.target_op_id:Object.hasOwn(op,'target_op_id'))fail('LOCAL_SOURCE_ORIGINAL_INVALID');
   sequences.add(op.device_seq);visit(id);
   if(op.target_op_id&&(!ops[op.target_op_id]||!op.causal_parents.length))fail('LOCAL_SOURCE_ORIGINAL_INVALID');
  }
  if(Object.keys(c.outbox||{}).length!==Object.keys(ops).length||Object.keys(c.outbox||{}).some(id=>!Object.hasOwn(ops,id)))fail('LOCAL_SOURCE_ORIGINAL_INVALID');
  const ordered=Object.values(ops).sort((a,b)=>a.device_seq-b.device_seq);
  for(let i=0;i<ordered.length;i++)if(ordered[i].device_seq!==i+1||ordered[i].device_predecessor_op_id!==(i?ordered[i-1].op_id:null))fail('LOCAL_SOURCE_ORIGINAL_INVALID');
  if(['plan','planTxns','planTransactions','planHistory','suspensions','issuances'].some(k=>Object.keys(c[k]||{}).length))fail('LOCAL_SOURCE_EFFECT_UNMAPPED');
  return era;
 }
 function rawMaterial(m){return {source_json:platform.text(m.sourceBytes),candidate_json:platform.text(m.candidateBytes),local_json:m.localBytes===null?null:platform.text(m.localBytes),engine_context_json:m.engineContextJson};}
 async function reviewSource(name){
  const held={stamp:stamp()},loaded=await checked(held,()=>repository.load());held.expected={revision:loaded.revision,token:loaded.token};held.generation=copy(loaded.generation);
  const era=validateGeneration(held.generation),entries=held.generation.metadata.imports?.filter(e=>e.name===name)||[];
  if(entries.length!==1)fail(entries.length?'LOCAL_SOURCE_IMPORT_AMBIGUOUS':'LOCAL_SOURCE_IMPORT_REQUIRED');const entry=entries[0];
  const material=await checked(held,()=>custody.load(name));await current(held);
  const currentOps=held.generation.collections.ops,originalSets=[material.checkpoint.generation.collections.ops||{}];
  for(const [id,selection]of Object.entries(held.generation.metadata.localSources?.selections||{})){
   if(selection?.id!==id||!selection.order_input?.operations)fail('LOCAL_SOURCE_SELECTION_UNPROVEN');originalSets.push(selection.order_input.operations);
  }
  for(const originals of originalSets)for(const [id,original]of Object.entries(originals))if(!Object.hasOwn(currentOps,id)||encode(currentOps[id])!==encode(original))fail('LOCAL_SOURCE_ORIGINAL_CHANGED');
  const raw=rawMaterial(material),context=parseStrictJson(raw.engine_context_json);
  if(entry.sourceSha256!==platform.hash(material.sourceBytes)||entry.migratedSha256!==platform.hash(material.candidateBytes)||(entry.localSha256??null)!==(material.localBytes===null?null:platform.hash(material.localBytes))||entry.engineSha256!==context.engine?.sha256||entry.schemaV!==context.engine?.schemaV)fail('LOCAL_SOURCE_MATERIAL_MISMATCH');
  const materialDigest=digest(platform.hash,'earned/local-source-material/v1',raw),engineContext=producerRegistry.qualify({context,materialDigest});
  if(!validDay(currentDay()))fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
  Object.assign(held,{name,entry,eraId:era.eraId,material,raw,materialDigest,engineContext,sourceDigest:platform.hash(material.sourceBytes),checkpointDigest:digest(platform.hash,'earned/local-source-checkpoint/v1',material.checkpoint)});
  const candidate=parseStrictJson(raw.candidate_json),legacy=Object.keys(candidate.sessionLog||{}),native=Object.values(currentOps).filter(op=>op.class==='session'&&op.kind==='session-start');
  const membership=order.review({installation_id:namespace,era_id:era.eraId,athlete_id:athleteId,source_digest:held.sourceDigest,checkpoint_digest:held.checkpointDigest,legacyLog:candidate.sessionLog||{},operations:currentOps,rootInterpretation:{}});
  const review=freeze({profile:'earned/local-source-review/v1',installation_id:namespace,era_id:era.eraId,athlete_id:athleteId,device_id:deviceId,source_digest:held.sourceDigest,source_bytes:material.sourceBytes.length,material_digest:materialDigest,as_of:currentDay(),legacy_members:legacy,native_root_id:membership.native_root_id,native_members:native.map(op=>({op_id:op.op_id,effective:copy(op.effective)})),prefix_required:legacy.length>0&&native.length>0,
   prefix_question:'Did every workout in this file happen before this first Earned workout, with none already recorded in Earned?'});
  reviews.set(review,held);return review;
 }
 function programme(source,ops){
  const setups=Object.values(ops).filter(o=>o.payload?.profile===Setup.PROFILE);
  if(setups.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');const op=setups[0];
  if(op.schema_version!==2||!Setup.validate(op,id=>ops[id]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
  const scratch=createCleanInitState({setup:op.payload.setup});
  const fields=['id','day','mg','sets','hi','inc','steps'];
  if(encode(source.split)!==encode(scratch.split)||source.exercises?.length!==scratch.exercises.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
  for(const ex of scratch.exercises){const matches=source.exercises.filter(x=>x.id===ex.id);if(matches.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');for(const key of fields)if(encode(matches[0][key])!==encode(ex[key]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
   const tag=op.payload.tags[ex.id];for(const k of ['head','secondary'])if(encode(matches[0][k]??(k==='head'?null:[]))!==encode(tag[k]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');}
  if(encode(source.priority_muscles??[])!==encode(op.payload.setup.priority_muscles))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
  return {op_id:op.op_id,split:source.split,exercises:source.exercises.map(ex=>Object.fromEntries([...fields,'head','secondary'].filter(k=>Object.hasOwn(ex,k)).map(k=>[k,ex[k]]))),priority_muscles:op.payload.setup.priority_muscles};
 }
 function replay(held){
  const g=held.generation,c=g.collections,ops=c.ops,rows=Object.values(ops).sort((a,b)=>a.device_seq-b.device_seq),issues=[],families=[];
  const issue=(code,id)=>{issues.push({code,...(id?{op_id:id}:{})});};
  if(held.raw.local_json!==null&&held.raw.local_json!==held.raw.source_json&&Object.keys(held.material.checkpoint.generation.collections.ops||{}).length)fail('LOCAL_SOURCE_COVERAGE_UNKNOWN');
  const engineFor=(day,hour)=>createSourceReplayEngine({engineContext:engineContextAt(held.engineContext,day,hour)});
  const preparationEngine=createSourceReplayEngine({engineContext:held.engineContext});let prep;
  try{prep=core.createImportPreparation({engine:preparationEngine,parseStrictJson}).prepare(held.material.sourceBytes,held.material.localBytes===null?{}:{localBytes:held.material.localBytes});}
  catch(error){try{preparationEngine.dataLossGuard({},{});}catch(dependency){if(['SOURCE_ENGINE_DEPENDENCY_REQUIRED','SOURCE_ENGINE_CONTEXT_UNPROVEN'].includes(dependency.code))throw dependency;}throw error;}
  if(platform.text(prep.candidateBytes())!==held.raw.candidate_json)fail('SOURCE_PREPARATION_REPRODUCTION_MISMATCH');
  let state=prep.candidateState(),programmeBasis;
  for(const op of rows){const eff=op.effective,match=/^([+-])(0\d|1[0-4]):([0-5]\d)$/.exec(eff?.utc_offset||'');try{
   if(!validDay(eff?.local_date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(eff?.local_time||'')||!match)throw Error();
   const clock=sourceEngineContext(engineContextAt(held.engineContext,eff.local_date,Number(eff.local_time.slice(0,2)))).clock;
   const supplied=(match[1]==='+'?-1:1)*(Number(match[2])*60+Number(match[3]));
   if(new Date(clock.nowMs()).getTimezoneOffset()!==supplied)throw Error();
  }catch{issue('LOCAL_SOURCE_CONTEXT_UNRESOLVED',op.op_id);}}
  try{programmeBasis=programme(state,ops);}catch(e){issue(e.code);}
  const facts=reading({operations:ops,dispositions:c.dispositions||{},receipts:c.receipts||{},frontier:c.sync.frontier,outbox:c.outbox,rejected:c.rejected||{}});
  const days=new Set((state.reads||[]).map(r=>r.d)),nativeReads=facts.records.filter(r=>r.original.kind==='fact').sort((a,b)=>a.original.device_seq-b.original.device_seq);
  let last=(state.reads||[]).map(r=>r.d).sort().at(-1)||null;
  for(const row of nativeReads){
   const eff=row.original.effective,hour=Number(eff?.local_time?.slice(0,2));
   if(row.local.state==='unresolved'||!validDay(row.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(eff?.local_time||'')||!/^([+-])(0\d|1[0-4]):[0-5]\d$/.test(eff?.utc_offset||'')||days.has(row.date)||last&&row.date<=last||row.date>currentDay()||row.date<sourceEngineContext(held.engineContext).mapping.gate.clock){issue('LOCAL_SOURCE_READING_UNRESOLVED',row.op_id);continue;}
   days.add(row.date);last=row.date;
   if(row.local.state==='included')try{state=engineFor(row.date,hour).applyRead(state,row.date,row.local.quantity.value,{hour});if(state.reads.filter(r=>r.d===row.date&&r.w===row.local.quantity.value).length!==1)throw Error();}catch{issue('LOCAL_SOURCE_READING_UNRESOLVED',row.op_id);}
   families.push({family:'F1',state:row.local.state==='removed'?'retained':'projected',op_id:row.op_id,effect_ids:row.local.effect_ids});
  }
  for(const row of facts.records)if(row.original.kind!=='fact'&&row.local.state==='unresolved')issue('LOCAL_SOURCE_READING_UNRESOLVED',row.op_id);
  const food=[];const checkDates=new Set();
  for(const op of rows){
   if(op.class==='reading'||op.class==='session')continue;
   const p=op.payload,day=op.effective?.local_date;
   if(!validDay(day)||day>currentDay()){issue('LOCAL_SOURCE_CONTEXT_UNRESOLVED',op.op_id);continue;}
   if(op.class==='food-day'&&op.schema_version===2&&Food.validate(op,id=>ops[id])){food.push({op_id:op.op_id,date:day,day:copy(p.day)});continue;}
   if(p?.profile===Setup.PROFILE){families.push({family:'F4',state:programmeBasis?'retained':'unresolved',op_id:op.op_id});continue;}
   if(op.schema_version===2&&p?.profile===Settings.PROFILE&&Settings.validate(op,id=>ops[id])&&state.exercises.some(e=>e.id===p.machine.exercise_id)){families.push({family:'F4',state:'retained',op_id:op.op_id});continue;}
   if(op.schema_version===2&&p?.profile===CheckIn.PROFILE&&CheckIn.validate(op,id=>ops[id])&&!checkDates.has(day)){checkDates.add(day);families.push({family:'F5',state:'retained',op_id:op.op_id});continue;}
   issue(op.class==='food-day'||op.class==='steps'?'LOCAL_SOURCE_DAILY_UNRESOLVED':op.class==='plan'?'LOCAL_SOURCE_EFFECT_UNMAPPED':'LOCAL_SOURCE_CONTEXT_UNRESOLVED',op.op_id);
  }
  const winners=FoodModel.winningRows(food);
  for(const row of winners){if(Object.keys(state.dailyLogs?.[row.date]||{}).some(k=>['cal','pro'].includes(k))){issue('LOCAL_SOURCE_DAILY_UNRESOLVED',row.op_id);continue;}
   const projected=FoodModel.foodProjection(state,[row],engineFor(row.date,12));if(projected.unavailable.length)issue('LOCAL_SOURCE_DAILY_UNRESOLVED',row.op_id);else state=projected.state;
   families.push({family:'F2',state:projected.unavailable.length?'retained':'projected',op_id:row.op_id});}
  for(const row of food)if(!winners.includes(row))families.push({family:'F2',state:'retained',op_id:row.op_id});
  const captures=Capture.createPrescriptionCapture({parseStrictJson});let workoutFacts=null;
  if(rows.some(op=>op.class==='session'))try{
   const history=storedWorkoutHistory(g,{athleteId,deviceId,prescriptionCapture:captures}),runtime=Runtime.createEngineRuntime({clock:sourceEngineContext(held.engineContext).clock});
   const projector=History.createEngineHistoryProjector({athleteId,deviceId,projectWorkoutRecords,parseStrictJson,prescriptionCapture:captures,resolveCapturedLayout:({start})=>{
    const producer=start.prescription_capture.producer;if(![EngineCapture.PROFILE,EngineCapture.CONFIGURATION_PROFILE].includes(producer.rule_profile))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    const adapter=EngineCapture.createEngineWorkoutCapture({engine:runtime,prescriptionCapture:captures,producerIdentity:producer});
    const layout=adapter.readLayout(start.prescription_capture),counts=new Map();for(const slot of layout.slots){if(state.exercises.filter(e=>e.id===slot.lift_lineage_id).length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');counts.set(slot.lift_lineage_id,(counts.get(slot.lift_lineage_id)||0)+1);}
    for(const [id,count]of counts)if(state.exercises.find(e=>e.id===id).sets!==count)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    // Compare complete programme membership at the ORIGINAL Start day. The
    // existing reader owns day selection and active-lift order. Historical
    // prescription loads/reps and performed/skip facts remain untouched.
    const originalDay=start.effective.local_date,originalClock=sourceEngineContext(engineContextAt(held.engineContext,originalDay,12)).clock;
    const expected=Runtime.createEngineRuntime({clock:originalClock}).genSession(state,originalDay);
    if(!expected||encode([...counts.keys()])!==encode(expected.ex.map(card=>card.id)))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    return layout;}});
   workoutFacts=projector.project(history,g,{sourceRevision:held.expected.revision});
   if([...workoutFacts.sessions,...workoutFacts.incomplete_sessions].some(s=>s.completion_state==='unresolved'||s.record.entries.some(e=>e.slots.some(x=>x.state==='unresolved'))))issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');
   families.push({family:'F3',state:'projected',start_ids:workoutFacts.order.start_ids});
  }catch(e){issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');}
  // Historical decisions remain original state, without turning into new consent.
  families.push({family:'F6',state:'retained',source_fields:['accepted','decisions','feed'].filter(k=>Object.hasOwn(state,k))});
  let calculation=null;try{calculation={trend:state.trend,rate:engineFor(currentDay(),12).currentRate(state)};}catch{issue('LOCAL_SOURCE_CALCULATION_UNRESOLVED');}
  return {state,calculation,facts,workoutFacts,families,issues,programmeBasis,retained:rows.filter(op=>families.some(f=>f.state==='retained'&&f.op_id===op.op_id)).map(op=>copy(op))};
 }
 async function prepareSource(review,{identityConfirmed=false,prefixAnswer}={},internal=null){
  const existingSelection=internal?.selection;
  const held=reviews.get(review);if(!held)fail('LOCAL_SOURCE_REVIEW_UNOWNED');await current(held);
  if(identityConfirmed!==true&&!existingSelection)fail('LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED');
  const replayed=replay(held);if(replayed.issues.length)return freeze({ready:false,pending:true,issues:replayed.issues,families:replayed.families});
  const operations=held.generation.collections.ops,rootInterpretation=Object.fromEntries((replayed.workoutFacts?.sessions||[]).concat(replayed.workoutFacts?.incomplete_sessions||[]).map(s=>[s.start_op_id,{capture:s.capture,record:s.record,completion:s.completion_state}]));
  const orderInput={installation_id:namespace,era_id:held.eraId,athlete_id:athleteId,source_digest:held.sourceDigest,checkpoint_digest:held.checkpointDigest,legacyLog:replayed.state.sessionLog||{},operations,rootInterpretation,display_review:review};
  let M=null;
  const mixed=Object.keys(orderInput.legacyLog).length>0&&Object.values(operations).some(op=>op.class==='session'&&op.kind==='session-start');
  if(mixed){if(existingSelection?.order_map){M=order.restore(existingSelection.order_map,existingSelection.order_input);order.validate(M,orderInput);}else M=order.confirm(order.review(orderInput),{answer:prefixAnswer});}
  const selectionId=internal?.action==='reopen'?existingSelection.id:'local-source:'+digest(platform.hash,'earned/local-source-selection/v1',{name:held.name,material:held.materialDigest,revision:held.expected.revision,token:held.expected.token,order:M,action:internal?.action||'select'});
  const interpretedWorkouts=copy(replayed.workoutFacts);if(interpretedWorkouts)delete interpretedWorkouts.source_revision;
  const interpretation={families:replayed.families,reading:replayed.facts,workout:interpretedWorkouts,collections:Object.fromEntries(Object.entries(held.generation.collections).filter(([k])=>k!=='derived'))};
  const Q=freeze({profile:'earned/local-source-basis/v1',installation_id:namespace,era_id:held.eraId,athlete_id:athleteId,device_id:deviceId,source_digest:held.sourceDigest,material_digest:held.materialDigest,checkpoint_digest:held.checkpointDigest,local_selection_id:selectionId,
   operation_digest:digest(platform.hash,'earned/local-source-operations/v1',operations),interpretation_digest:digest(platform.hash,'earned/local-source-interpretation/v1',interpretation),programme_digest:digest(platform.hash,'earned/local-source-programme/v1',replayed.programmeBasis),order_map_digest:digest(platform.hash,'earned/local-source-order-map/v1',M),engine_digest:sourceEngineContext(held.engineContext).digest,replay_profile:'earned/local-source-replay/v1',as_of:currentDay()});
  await current(held);
  const handle=Object.freeze({profile:'earned/local-source-qualification/v1'}),view=freeze({ready:true,basis:Q,order_map:M,state:replayed.state,calculation:replayed.calculation,workout_baseline:{profile:'earned/imported-engine-history/local-v1',local_source_basis:Q,session_log:replayed.state.sessionLog},workout_facts:replayed.workoutFacts,families:replayed.families,retained:replayed.retained,integration_pending:['local-capture-start-resume','today-gym-consumers']});
  const selection=internal?.action==='reopen'?copy(existingSelection):{id:selectionId,name:held.name,basis:Q,order_map:M,order_input:existingSelection?.order_input||orderInput,identity_review:existingSelection?.identity_review||review,previous:held.generation.metadata.localSources?.active??null,action:internal?.action||'select'};
  const next=copy(held.generation);next.metadata.localSources=next.metadata.localSources||{selections:{},active:null};
  if(next.metadata.localSources.selections[selectionId]&&encode(next.metadata.localSources.selections[selectionId])!==encode(selection))fail('LOCAL_SOURCE_SELECTION_CONFLICT');
  next.metadata.localSources.selections[selectionId]=copy(selection);next.metadata.localSources.active=selectionId;
  next.metadata.imports=next.metadata.imports.map(e=>e.name===held.name?{...e,rebaseRequired:false,localSourceSelectionId:selectionId}:e);
  next.collections.derived=next.collections.derived||{};next.collections.derived.localSource={basis:copy(Q),view:copy(view)};
  next.metadata.localSourceApplication={selection_id:selectionId,source_digest:Q.source_digest,input_revision:held.expected.revision,input_token:held.expected.token,committed_revision:held.expected.revision+1,basis:copy(Q),core_complete:true,s3_complete:false};
  const capability=Object.freeze({guard:()=>syncGuard(held.stamp),assertCurrent:()=>current(held),publish:()=>repository.commit(held.expected,next,()=>syncGuard(held.stamp)),reconcile:async()=>{
   const loaded=await checked(held,()=>repository.load()),marker=loaded.generation.metadata.localSourceApplication;
   if(marker?.selection_id!==selectionId||marker.committed_revision!==loaded.revision||encode(marker.basis)!==encode(Q))fail('LOCAL_SOURCE_COMMIT_UNPROVEN');
   return reopen(held.name);
  }});
  qualifications.set(handle,{controller:api,held,view,commitCapability:capability});return handle;
 }
 async function reopen(name){const review=await reviewSource(name),held=reviews.get(review),id=held.generation.metadata.localSources?.active,selection=held.generation.metadata.localSources?.selections?.[id];if(!selection||selection.name!==name||selection.identity_review.material_digest!==review.material_digest)fail('LOCAL_SOURCE_REOPEN_UNPROVEN');return prepareSource(review,{}, {selection,action:'reopen'});}
 async function rollback(selectionId){const at={stamp:stamp()},state=await checked(at,()=>repository.load()),selected=state.generation.metadata.localSources?.selections?.[selectionId];if(!selected)fail('LOCAL_SOURCE_ROLLBACK_UNPROVEN');const review=await checked(at,()=>reviewSource(selected.name)),held=reviews.get(review);if(held.expected.revision!==state.revision||held.expected.token!==state.token)fail('LOCAL_SOURCE_STALE');return prepareSource(review,{}, {selection:selected,action:'rollback'});}
 const api=Object.freeze({reviewSource,prepareSource:(review,answers)=>prepareSource(review,answers),reopen,rollback,assertCurrent:handle=>{assertLocalSourceQualification(handle);const q=qualifications.get(handle);if(q.controller!==api)fail('LOCAL_SOURCE_QUALIFICATION_UNOWNED');return current(q.held);},view:async handle=>{assertLocalSourceQualification(handle);const q=qualifications.get(handle);if(q.controller!==api)fail('LOCAL_SOURCE_QUALIFICATION_UNOWNED');await current(q.held);return q.view;},invalidate(){epoch++;},close(){closed=true;epoch++;}});
 return api;
}
