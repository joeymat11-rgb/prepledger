'use strict';
// Internal factual producer, not a prescription/eligibility or authentication
// boundary. Install only with the actual projector and a trusted resolver of
// the ORIGINAL captured plan inputs. The host owns source token/context checks.
const {orderWorkoutStarts}=require('./engine-order.cjs');
const {normalizeWorkoutHistory}=require('./edit-history.cjs');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const known=row=>['accepted-through-frontier','stored-on-this-device'].includes(row?.status);
const text=x=>typeof x==='string'&&x.length>0;
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
function createEngineHistoryProjector({athleteId,deviceId,projectWorkoutRecords,resolveCapturedLayout,parseStrictJson,prescriptionCapture}={}){
 if(!text(athleteId)||!text(deviceId)||[projectWorkoutRecords,resolveCapturedLayout,parseStrictJson].some(f=>typeof f!=='function'))throw new TypeError('Scoped trusted history projector, captured-plan resolver and strict parser required');
 function project(history,generation,{sourceRevision,importAnchor,originalThrough}={}){
  if(!Number.isSafeInteger(sourceRevision)||sourceRevision<1)fail('WORKOUT_ENGINE_SOURCE_REVISION_REQUIRED');
  const allOrder=orderWorkoutStarts(history,generation,{importAnchor}),ops=generation.collections.ops||{};
  const accepted=new Map(Object.values(generation.collections.receipts||{}).filter(r=>r.seq<=history.frontier).map(r=>[r.op_id,r.seq]));
  if(originalThrough!==undefined&&(!Number.isSafeInteger(originalThrough)||originalThrough<0||originalThrough>history.frontier))fail('WORKOUT_ACCEPTED_CUT_INVALID');
  const originalIncluded=id=>originalThrough===undefined||accepted.has(id)&&accepted.get(id)<=originalThrough;
  const order=originalThrough===undefined?allOrder:{...allOrder,start_ids:allOrder.start_ids.filter(originalIncluded)};
  const rows=Object.values(ops).map(op=>{
   const seq=accepted.get(op.op_id),rejected=generation.collections.rejected?.[op.op_id];
   if(rejected&&seq!==undefined)fail('WORKOUT_ENGINE_STATUS_DISAGREEMENT');
   const status=rejected?'rejected':seq!==undefined?'accepted-through-frontier':op.device_id===deviceId&&Object.hasOwn(generation.collections.outbox||{},op.op_id)?'stored-on-this-device':'stored-status-unresolved';
   return {operation:op,status,...(seq!==undefined?{receipt_sequence:seq}:{})};
  });
  const normalized=normalizeWorkoutHistory(rows,history.frontier),interpreted=new Map(normalized.records.map(r=>[r.id,r])),rowById=new Map(rows.map(r=>[r.operation.op_id,r]));
  const all=new Set(),byStart=new Map();
  // Reject a detached/edited or incomplete view rather than accepting renderer
  // values. Signature and complete-generation authentication remain upstream.
  for(const session of history.sessions){
   for(const row of [session.start,...session.records]){
    const op=row?.operation;if(!op||all.has(op.op_id)||!same(op,ops[op.op_id]))fail('WORKOUT_ENGINE_HISTORY_DISAGREEMENT');
    if(op.athlete_id!==athleteId)fail('WORKOUT_ENGINE_SCOPE_DISAGREEMENT');
    const seq=accepted.get(op.op_id),rejected=generation.collections.rejected?.[op.op_id];
    if(rejected&&seq!==undefined)fail('WORKOUT_ENGINE_STATUS_DISAGREEMENT');
    const status=rejected?'rejected':seq!==undefined?'accepted-through-frontier':op.device_id===deviceId&&Object.hasOwn(generation.collections.outbox||{},op.op_id)?'stored-on-this-device':'stored-status-unresolved';
    if(row.status!==status||(seq!==undefined?row.receipt_sequence!==seq:Object.hasOwn(row,'receipt_sequence')))fail('WORKOUT_ENGINE_STATUS_DISAGREEMENT');
    if(row!==session.start){const target=ops[interpreted.get(op.op_id)?.root_id];
     if((target?.kind==='session-start'?target.op_id:target?.session_start_op_id)!==session.start.operation.op_id)fail('WORKOUT_ENGINE_SESSION_DISAGREEMENT');}
    all.add(op.op_id);
   }
   if(!same(session.projection,projectWorkoutRecords(session,ops,{normalized})))fail('WORKOUT_ENGINE_PROJECTION_DISAGREEMENT');
   byStart.set(session.start.operation.op_id,session);
  }
  for(const row of history.other_records||[]){
   const op=row.operation,expected=rowById.get(op?.op_id);
   if(!expected||all.has(op.op_id)||!same(row.operation,expected.operation)||row.status!==expected.status||row.receipt_sequence!==expected.receipt_sequence)fail('WORKOUT_ENGINE_HISTORY_DISAGREEMENT');
   if(interpreted.has(op.op_id))fail('WORKOUT_ENGINE_LEGACY_OR_UNASSOCIATED_MAPPING_REQUIRED');
   all.add(op.op_id);
  }
  for(const id of interpreted.keys())if(!all.has(id))fail('WORKOUT_ENGINE_HISTORY_INCOMPLETE');
  const sessions=[],incomplete=[];
  for(const id of order.start_ids){
   const sourceSession=byStart.get(id),session=originalThrough===undefined?sourceSession:{...sourceSession,
    records:sourceSession.records.filter(row=>originalIncluded(interpreted.get(row.operation.op_id)?.root_id))};
   if(originalThrough!==undefined)session.projection=projectWorkoutRecords(session,ops,{normalized});
   const start=session.start.operation,capture=session.original;
   if(!capture||!same(capture,start.prescription_capture))fail('WORKOUT_ENGINE_CAPTURE_REQUIRED');
   if(session.records.some(row=>row.status!=='rejected'&&!known(row)))fail('WORKOUT_ENGINE_RECORD_STATUS_UNRESOLVED');
   const completion=session.projection.close_records;
   const completed=completion.length===1&&completion[0].included===true&&!completion[0].issues.length&&known(completion[0])&&['normal','early'].includes(completion[0].kind);
   const layout=resolveCapturedLayout({start:structuredClone(start),sourceRevision});
   if(!layout||layout.profile!=='earned/captured-lift-layout/v1'||!same(layout.producer,capture.producer)||!same(layout.basis,capture.basis)||
     !text(layout.correspondence_profile)||!Array.isArray(layout.slots)||layout.slots.length!==capture.slots.length)fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');
   const positions=new Map(),slots=new Map(),entries=new Map();
   for(const [i,planned]of capture.slots.entries()){
    const mapped=layout.slots[i],lift=planned.lift_lineage_id;
    if(!mapped||mapped.logical_set_slot!==planned.logical_set_slot||mapped.lift_lineage_id!==lift||
       !Number.isSafeInteger(mapped.position)||mapped.position<1||slots.has(planned.logical_set_slot))fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');
    if(!positions.has(lift))positions.set(lift,new Set());const seen=positions.get(lift);if(seen.has(mapped.position))fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');seen.add(mapped.position);
    let target={state:planned.effort.state};
    if(planned.effort.state==='specified'){
     const source=parseStrictJson(planned.effort.source_json);
     if(!source||Object.keys(source).length!==2||source.unit!=='rep'||!Number.isSafeInteger(source.target)||source.target<0||Object.is(source.target,-0))fail('WORKOUT_EFFORT_TARGET_MAPPING_REQUIRED');
     target={state:'specified',target:source.target};
    }
    if(!same(target,mapped.prescribed_effort))fail('WORKOUT_CAPTURE_TARGET_DISAGREEMENT');
    const slot={position:mapped.position,logical_set_slot:planned.logical_set_slot,prescribed_effort:target,state:'unlogged'};
    slots.set(planned.logical_set_slot,{lift,slot});
    if(!entries.has(lift))entries.set(lift,{profile:'earned/performed-lift/v1',start_op_id:id,lift_lineage_id:lift,correspondence_profile:layout.correspondence_profile,completion:completed?structuredClone(completion[0]):null,slots:[]});
    entries.get(lift).slots.push(slot);
   }
   for(const [lift,seen]of positions)for(let n=1;n<=seen.size;n++)if(!seen.has(n))fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');
   const facts=new Map(),skips=new Map();
   for(const fact of session.projection.facts){
    const slot=slots.get(fact.logical_set_slot);if(!slot||slot.lift!==fact.lift_lineage_id)fail('WORKOUT_EXTRA_SLOT_MAPPING_REQUIRED');
    if(!facts.has(fact.logical_set_slot))facts.set(fact.logical_set_slot,[]);facts.get(fact.logical_set_slot).push(fact);
   }
   for(const row of session.projection.skip_records){
    if(row.included===false)continue;
    if(row.included!==true||row.issues.length)fail('WORKOUT_SKIP_INTERPRETATION_REQUIRED');
    const op=row.current;
    const matching=[...slots.values()].filter(s=>s.lift===row.lift_lineage_id&&(op.skip_scope==='lift'||s.slot.logical_set_slot===op.logical_set_slot));
    if(!matching.length)fail('WORKOUT_EXTRA_SLOT_MAPPING_REQUIRED');
    for(const {slot}of matching){if(!skips.has(slot.logical_set_slot))skips.set(slot.logical_set_slot,[]);skips.get(slot.logical_set_slot).push(row.source_op_id);}
   }
   for(const {slot}of slots.values()){
    const rows=facts.get(slot.logical_set_slot)||[],live=rows.filter(f=>f.included===true),removed=rows.filter(f=>f.included===false&&f.source_status!=='rejected'&&!f.issues.length);
    const omitted=rows.filter(f=>f.source_status==='rejected').map(f=>f.source_op_id),skip=skips.get(slot.logical_set_slot)||[];
    const issues=[...new Set(rows.filter(f=>f.source_status!=='rejected').flatMap(f=>f.issues))];
    if(rows.some(f=>f.included===null)&&!issues.length)issues.push('SET_INTERPRETATION_REQUIRED');
    if(live.length>1||live.length&&skip.length||skip.length>1)issues.push('SET_SLOT_RESOLUTION_REQUIRED');
    if(removed.length)slot.removed_facts=structuredClone(removed);
    if(omitted.length)slot.rejected_source_ids=omitted;
    if(issues.length){slot.state='unresolved';slot.issues=[...new Set(issues)];slot.unresolved_fact_ids=rows.map(f=>f.source_op_id);slot.skip_op_ids=skip.slice();}
    else if(live.length){slot.state='performed';slot.fact=structuredClone(live[0]);}
    else if(skip.length){slot.state='skipped';slot.skip_op_id=skip[0];}
    else if(removed.length)slot.state='removed';
   }
   for(const entry of entries.values())entry.slots.sort((a,b)=>a.position-b.position);
   const record={start_op_id:id,effective:structuredClone(session.projection.start_record.current.effective),plan_basis:start.plan_basis,capture:structuredClone(capture),
    completion_state:completed?'completed':completion.length?'unresolved':'open',completion_records:structuredClone(completion),
    source_record_ids:session.records.map(row=>row.operation.op_id),record:{entries:[...entries.values()]}};
   (completed?sessions:incomplete).push(record);
  }
  // Completed-reader order is a subsequence of the full causal source order.
  // Open/ambiguous completion evidence stays explicit for each caller; it
  // neither becomes a completed workout nor erases earlier completed facts.
  return {profile:'earned/workout-facts/v1',source_revision:sourceRevision,source_order:order,
   ...(originalThrough!==undefined?{original_through:originalThrough,
    source_members:[...interpreted].filter(([,record])=>originalIncluded(record.root_id)).map(([op_id,record])=>({op_id,root_id:record.root_id}))}:{}),
   order:{...order,start_ids:sessions.map(s=>s.start_op_id)},sessions,incomplete_sessions:incomplete,
   excluded_start_ids:history.sessions.filter(s=>originalIncluded(s.start.operation.op_id)&&(s.start.status==='rejected'||s.projection.start_record.included===false)).map(s=>s.start.operation.op_id),
   interpretation:'captured-positions-and-factual-edits',progression_eligible:false};
 }
 function acceptedSnapshot(history,generation,through){
  const source=structuredClone({history,generation}),c=source.generation?.collections,W=c?.sync?.frontier?.W;
  if(!Number.isSafeInteger(W)||W<0||source.history?.frontier!==W||!Array.isArray(source.history.sessions))fail('WORKOUT_ACCEPTED_SOURCE_INVALID');
  const cut=through===undefined?W:through;
  if(!Number.isSafeInteger(cut)||cut<0||cut>W)fail('WORKOUT_ACCEPTED_CUT_INVALID');
  const all=Object.values(c.receipts||{});
  if(all.some(r=>!r||!Number.isSafeInteger(r.seq)||r.seq<1))fail('WORKOUT_ORDER_RECEIPT_INVALID');
  const prefix=all.filter(r=>r.seq<=W).sort((a,b)=>a.seq-b.seq),ids=new Set();
  if(prefix.length!==W)fail('WORKOUT_ORDER_PREFIX_INCOMPLETE');
  for(const [i,r]of prefix.entries()){
   if(r.seq!==i+1||!c.ops?.[r.op_id]||ids.has(r.op_id))fail('WORKOUT_ORDER_PREFIX_INCOMPLETE');
   ids.add(r.op_id);
  }
  const kept=new Set(prefix.filter(r=>r.seq<=cut).map(r=>r.op_id));
  // This is an owned read view of the accepted prefix, never a replacement
  // repository or evidence that pending operations were rejected/applied.
  c.ops=Object.fromEntries(Object.entries(c.ops||{}).filter(([id])=>kept.has(id)));
  c.receipts=Object.fromEntries(Object.entries(c.receipts||{}).filter(([,r])=>r.seq<=cut));
  c.outbox={};c.rejected=Object.fromEntries(Object.entries(c.rejected||{}).filter(([id])=>kept.has(id)));
  c.sync.frontier={...c.sync.frontier,W:cut};
  const sequence=new Map(prefix.filter(r=>r.seq<=cut).map(r=>[r.op_id,r.seq]));
  const rows=Object.values(c.ops).map(operation=>({operation,status:'accepted-through-frontier',receipt_sequence:sequence.get(operation.op_id)}));
  const normalized=normalizeWorkoutHistory(rows,cut);
  source.history.frontier=cut;
  source.history.sessions=source.history.sessions.filter(s=>kept.has(s.start?.operation?.op_id)).map(s=>{
   s.records=s.records.filter(r=>kept.has(r.operation?.op_id));
   // Reexecute the same fold without pending/later inputs. Never transplant a
   // local current value or rewrite its status to pretend it was accepted.
   s.projection=projectWorkoutRecords(s,c.ops,{normalized});return s;
  });
  source.history.other_records=(source.history.other_records||[]).filter(r=>kept.has(r.operation?.op_id));
  return source;
 }
 function projectAccepted(history,generation,{sourceRevision,through,originalThrough}={}){
  const source=acceptedSnapshot(history,generation,through);
  return project(source.history,source.generation,{sourceRevision,originalThrough:originalThrough??source.history.frontier});
 }
 async function projectAcceptedWithSources(history,generation,{through,...options}={}){
  const source=acceptedSnapshot(history,generation,through);
  return projectWithSources(source.history,source.generation,{...options,originalThrough:options.originalThrough??source.history.frontier});
 }
 async function projectWithSources(history,generation,{sourceRevision,readSourceCuts,assertCurrent,originalThrough}={}){
  if(typeof readSourceCuts!=='function'||typeof assertCurrent!=='function'||typeof prescriptionCapture?.read!=='function')
   fail('WORKOUT_CAPTURE_SOURCE_READER_REQUIRED');
  // Own one factual snapshot before yielding. The caller authenticates this
  // generation and supplies its guarded indexed source reader; neither a DTO
  // nor this calculation grants current permission or import replay membership.
  const snapshot=structuredClone({history,generation});
  await assertCurrent();
  const facts=project(snapshot.history,snapshot.generation,{sourceRevision,originalThrough});
  const ops=snapshot.generation.collections.ops||{},W=facts.source_order.frontier;
  const accepted=new Map(Object.values(snapshot.generation.collections.receipts||{}).filter(r=>r.seq<=W).map(r=>[r.op_id,r.seq]));
  const pending=[],bases=[];
  for(const record of [...facts.sessions,...facts.incomplete_sessions]){
   const capture=prescriptionCapture.read(record.capture);
   record.original_source=null; // v1 has unknown original source, never a null-selection proof.
   if(capture.profile==='earned/workout-prescription/v1')continue;
   if(capture.profile!=='earned/workout-prescription/v2')fail('WORKOUT_CAPTURE_SOURCE_UNPROVEN');
   const basis=capture.source_basis,seq=accepted.get(record.start_op_id);
   if(basis.W>W||seq!==undefined&&basis.W>=seq)fail('WORKOUT_CAPTURE_SOURCE_POSITION_UNPROVEN');
   pending.push(record);bases.push(structuredClone(basis));
  }
  await assertCurrent();
  // One call batches all original cuts, including duplicates, through the same
  // authenticated inventory. Do not reauthenticate/copy the prefix per Start.
  const cuts=bases.length?structuredClone(await readSourceCuts(structuredClone(bases))):[];
  await assertCurrent();
  if(!Array.isArray(cuts)||cuts.length!==bases.length)fail('WORKOUT_CAPTURE_SOURCE_UNPROVEN');
  for(const [i,record]of pending.entries()){
   const basis=bases[i],cut=cuts[i],selection=cut?.current;
   if(!cut?.frontier||!['W','log_digest','selection_id'].every(k=>cut.frontier[k]===basis[k]))fail('WORKOUT_CAPTURE_SOURCE_UNPROVEN');
   if(basis.selection_id===null){if(selection!==null)fail('WORKOUT_CAPTURE_SOURCE_UNPROVEN');}
   else{
    const op=ops[basis.selection_id],seq=accepted.get(basis.selection_id);
    if(!selection||selection.intent_op_id!==basis.selection_id||seq===undefined||seq>basis.W||selection.seq!==seq||
       !op||op.athlete_id!==athleteId||selection.commitment!==op.canonical_content_commitment||selection.source_id!==op.payload?.source_id||
       !['activate','rollback'].includes(selection.action)||op.schema_version!==1||op.class!=='event'||op.kind!=='fact'||
       op.payload.type!==(selection.action==='activate'?'source-import-intent':'source-rollback-intent'))fail('WORKOUT_CAPTURE_SOURCE_SCOPE_UNPROVEN');
   }
   record.original_source={basis:structuredClone(basis),selection:structuredClone(selection)};
  }
  // Causal native order remains independent of today's selected baseline.
  // No import_anchor is manufactured: the mixed reader still needs its actual
  // replay/chronology join before it can consume legacy plus native records.
  await assertCurrent();
  return facts;
 }
 return Object.freeze({project,projectWithSources,projectAccepted,projectAcceptedWithSources});
}
module.exports={createEngineHistoryProjector};
