'use strict';
// Internal candidate calculation, not an authentication/current-plan boundary.
// The W6 caller must authenticate and bind this SAME source and generation.
// Always reproduce from immutable material; never trust a cached skip-ID list.
const {createHash}=require('node:crypto');
const {isDeepStrictEqual}=require('node:util');
const {createImportPreparation}=require('./prepare.cjs');
const {projectDaily,dailyPatch}=require('./daily-history.cjs');
const PROFILE='earned/source-reading-replay/v1',copy=structuredClone;
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
const hash=x=>createHash('sha256').update(x).digest('hex');
const json=x=>{const s=JSON.stringify(x);if(!isDeepStrictEqual(JSON.parse(s),x))fail('READING_REPLAY_LOSSY_JSON');return s;};
const date=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
function freezeOwned(value){const stack=[value];while(stack.length){const item=stack.pop();if(!item||typeof item!=='object'||Object.isFrozen(item))continue;
  for(const child of Object.values(item))stack.push(child);Object.freeze(item);}return value;}
function createReadingReplay({engineFor,projectReadings,parseStrictJson,producerIdentity,importBuild,deviceId,workoutHistoryReader,workoutProjector}={}){
  if([engineFor,projectReadings,parseStrictJson].some(f=>typeof f!=='function')||typeof producerIdentity!=='string'||!producerIdentity||typeof importBuild!=='string'||!importBuild)
    throw TypeError('Actual scoped engine factory, reading projector, parser and producer identity required');
  if((workoutHistoryReader!==undefined||workoutProjector!==undefined)&&
    (typeof workoutHistoryReader!=='function'||typeof workoutProjector?.projectAccepted!=='function'||typeof workoutProjector?.projectAcceptedWithSources!=='function'))
    throw TypeError('Actual stored workout reader and accepted factual projector required');
  // Private correspondence for the producer's actual consumed source image.
  // Retains the SAME immutable state reference; no second state or permission.
  const workoutSources=new WeakMap();
  function evaluate({sourceId,material,generation,asOf}={},internal=null,native=null){
    if(typeof sourceId!=='string'||!sourceId||!material||!generation?.collections||!date(asOf))fail('READING_REPLAY_INPUT');
    const input=copy(material),g=copy(generation),c=g.collections;
    if(Object.keys(input).length!==5||!['source_json','candidate_json','checkpoint_json','engine_context_json'].every(k=>typeof input[k]==='string')||
        !(input.local_json===null||typeof input.local_json==='string'))fail('READING_REPLAY_MATERIAL');
    let context,checkpoint;try{context=parseStrictJson(input.engine_context_json);checkpoint=parseStrictJson(input.checkpoint_json);}catch{fail('READING_REPLAY_CONTEXT');}
    const facts=projectReadings({operations:c.ops||{},dispositions:c.dispositions||{},receipts:c.receipts||{},frontier:c.sync?.frontier,outbox:c.outbox||{},rejected:c.rejected||{}});
    const daily=projectDaily(g,deviceId),allRecords=facts.records.concat(daily.records),isDaily=row=>['food-day','steps'].includes(row.original.class);
    const issues=[],issue=(code,op_id)=>issues.push({code,...(op_id?{op_id}:{})});
    if(!context||context.build!==importBuild||!date(context.clock))issue('SOURCE_PREPARATION_CONTEXT_UNPROVEN');
    // A different local engine image beside native operations may already
    // contain their effects. Reproducing merge alone cannot establish lineage.
    if(!internal&&input.local_json!==null&&input.local_json!==input.source_json&&Object.keys(checkpoint?.generation?.collections?.ops||{}).length)
      issue('SOURCE_LOCAL_ENGINE_COVERAGE_UNPROVEN');
    const accepted=Object.values(c.receipts||{}).filter(r=>r.seq<=facts.frontier).sort((a,b)=>a.seq-b.seq);
    const coverage={source_id:sourceId,material_sha256:hash(json(input)),producer:producerIdentity,frontier:facts.frontier,as_of:asOf,
      runtime:{node:process.versions.node,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone},
      // These are immutable source positions, never fabricated Earned op IDs.
      legacy_readings:[],accepted_originals:accepted.map(r=>({op_id:r.op_id,commitment:r.canonical_content_commitment,seq:r.seq})),steps:internal?copy(internal.steps):[],
      ...(internal?{original_limit:internal.originalLimit,source_lineage:copy(internal.lineage)}:{})};
    let state=null,calculation=null;
    if(!issues.length){
      try{
        const prep=createImportPreparation({engine:engineFor({day:context.clock,hour:12}),parseStrictJson}).prepare(Buffer.from(input.source_json),
          input.local_json===null?{}:{localBytes:Buffer.from(input.local_json)});
        if(prep.candidateBytes().toString()!==input.candidate_json)fail('SOURCE_PREPARATION_REPRODUCTION_MISMATCH');
        state=internal?copy(internal.state):prep.candidateState();
      }catch(error){if(error.code==='SOURCE_PREPARATION_REPRODUCTION_MISMATCH')throw error;fail('SOURCE_PREPARATION_REPRODUCTION_FAILED');}
      if(!Array.isArray(state.reads)||typeof state.trend!=='number'||!Number.isFinite(state.trend))issue('SOURCE_READING_BASIS_UNSUPPORTED');
    }
    let last=null;const seenDates=new Set(),inherited=new Set(internal?.inheritedIds||[]),inheritedDates=new Set(facts.records.filter(r=>inherited.has(r.op_id)).map(r=>r.date));
    if(state&&Array.isArray(state.reads))for(const [index,row]of state.reads.entries()){
      if(!inheritedDates.has(row.d))coverage.legacy_readings.push({source_id:sourceId,member:internal?'reconstructed_basis.reads':'candidate_json.reads',index,original:copy(row)});
      if(!date(row?.d)||typeof row.w!=='number'||!Number.isFinite(row.w)||row.w<=0||seenDates.has(row.d)||last&&row.d<=last)issue('SOURCE_READING_ORDER_UNSUPPORTED');
      seenDates.add(row.d);last=row.d;
    }
    for(const row of facts.records)if(row.status==='pending-local'&&seenDates.has(row.date)&&!inheritedDates.has(row.date))issue('PENDING_SOURCE_OVERLAP_UNRESOLVED',row.op_id);
    const byId=new Map(allRecords.map(r=>[r.op_id,r]));
    const nativeIds=new Set(native?.recognizedIds||[]);
    for(const receipt of accepted){
      const op=c.ops[receipt.op_id];
      if(op.class==='reading'){
        if(op.kind==='fact'){
          const row=byId.get(op.op_id);if(!row?.accepted||row.accepted.state==='unresolved')issue('ACCEPTED_READING_UNRESOLVED',op.op_id);
        }else if(!['correction','tombstone'].includes(op.kind)||!byId.get(op.target_op_id)?.accepted)issue('ACCEPTED_READING_EFFECT_UNMAPPED',op.op_id);
      }else if(['food-day','steps'].includes(op.class)){
        if(op.kind==='fact'){
          const row=byId.get(op.op_id);if(!row?.accepted||row.accepted.state==='unresolved')issue('ACCEPTED_DAILY_UNRESOLVED',op.op_id);
        }else if(!['correction','tombstone'].includes(op.kind)||!byId.get(op.target_op_id)?.accepted)issue('ACCEPTED_DAILY_EFFECT_UNMAPPED',op.op_id);
      }else if(nativeIds.has(op.op_id)){
        // Workout observations are rebuilt by the shared factual interpreter.
        // Their admission is not consent to invoke completeSession/plan effects.
      }else if(!(op.schema_version===1&&op.class==='event'&&op.kind==='fact'&&['source-import-intent','source-rollback-intent'].includes(op.payload?.type)))
        issue('ACCEPTED_ENGINE_CONTEXT_UNMAPPED',op.op_id);
    }
    if(native){
      coverage.native_workouts={original_limit:native.facts.original_through,source_members:copy(native.facts.source_members),
        source_order:copy(native.facts.source_order)};
      if([...native.facts.sessions,...native.facts.incomplete_sessions].some(session=>session.completion_state==='unresolved'||
          session.record.entries.some(entry=>entry.slots.some(slot=>slot.state==='unresolved'))))issue('ACCEPTED_WORKOUT_UNRESOLVED');
    }
    // Admission order is the retained execution order for this candidate. A
    // backdated insertion or same-date choice needs an explicit governing rule.
    const ordered=accepted.map(r=>byId.get(r.op_id)).filter(r=>r?.original.kind==='fact');
    const selected=ordered.filter(row=>!inherited.has(row.op_id)&&(!internal||c.dispositions[row.op_id].athlete_log_seq<=internal.originalLimit));
    const dailyKeys=row=>{try{
      const values={...dailyPatch(row.original.class,row.original.payload)};
      // Removed observations still own fields introduced by accepted edits.
      // Their identity must survive a later source merge or rollback.
      for(const effect of row.effects)if(effect.status==='accepted'&&effect.original.kind==='correction')
        Object.assign(values,dailyPatch(row.original.class,effect.original.payload.replacement_fields,{partial:true}));
      return Object.keys(values);
    }catch{return [];}};
    const inheritedDaily=new Set(daily.records.filter(r=>inherited.has(r.op_id)).flatMap(row=>dailyKeys(row).map(field=>JSON.stringify([row.date,field]))));
    const seenDaily=new Set();coverage.legacy_daily=[];
    if(state)for(const [day,values]of Object.entries(state.dailyLogs||{}))for(const [field,value]of Object.entries(values)){
      const key=JSON.stringify([day,field]);seenDaily.add(key);
      if(!inheritedDaily.has(key))coverage.legacy_daily.push({source_id:sourceId,member:internal?'reconstructed_basis.dailyLogs':'candidate_json.dailyLogs',date:day,field,original:copy(value)});
    }
    for(const row of daily.records)if(row.status==='pending-local')for(const field of dailyKeys(row)){
      const key=JSON.stringify([row.date,field]);if(seenDaily.has(key)&&!inheritedDaily.has(key))issue('PENDING_DAILY_SOURCE_OVERLAP_UNRESOLVED',row.op_id);
    }
    for(const row of selected){
      if(isDaily(row)){
        for(const field of dailyKeys(row)){const key=JSON.stringify([row.date,field]);if(seenDaily.has(key))issue('SOURCE_OR_DAILY_FIELD_OVERLAP',row.op_id);seenDaily.add(key);}
      }else{
        if(seenDates.has(row.date))issue('SOURCE_OR_DAILY_READING_OVERLAP',row.op_id);
        if(last&&row.date<=last)issue('READING_REPLAY_ORDER_UNRESOLVED',row.op_id);
        seenDates.add(row.date);last=row.date;
      }
      const eff=row.original.effective;
      if(!date(row.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(eff?.local_time||'')||!/^([+-])(0\d|1[0-4]):[0-5]\d$/.test(eff?.utc_offset||''))issue('READING_EFFECTIVE_CONTEXT_UNPROVEN',row.op_id);
      if(row.date>asOf)issue('READING_AFTER_CALCULATION_DAY',row.op_id);
      if(date(context?.clock)&&row.date<context.clock)issue('READING_BEFORE_SOURCE_CONTEXT_UNPROVEN',row.op_id);
      if(!isDaily(row)&&row.accepted?.state==='included'&&!(row.accepted.quantity.value>0))issue('READING_ENGINE_VALUE_UNSUPPORTED',row.op_id);
    }
    if(!issues.length){
      // Replay resolved ACCEPTED values, not current local corrections. Removing
      // an earlier record reconstructs every later effect from the same source.
      for(const row of selected){
        const before=hash(json(state)),effect=row.accepted;
        if(effect.state==='included'){
          const hour=Number(row.original.effective.local_time.slice(0,2));
          try{state=isDaily(row)?engineFor({day:row.date,hour}).writeDaily(state,row.date,effect.values):engineFor({day:row.date,hour}).applyRead(state,row.date,effect.quantity.value,{hour});}
          catch{fail('READING_ENGINE_EXECUTION_FAILED');}
          if(isDaily(row)){
            for(const [field,value]of Object.entries(effect.values))if(state.dailyLogs?.[row.date]?.[field]!==value)fail('DAILY_ENGINE_EFFECT_MISSING');
          }else{
            const applied=state.reads.filter(r=>r.d===row.date);
            if(applied.length!==1||applied[0].w!==effect.quantity.value)fail('READING_ENGINE_EFFECT_MISSING');
          }
        }
        coverage.steps.push({op_id:row.op_id,accepted_effect_ids:effect.effect_ids.slice(),state:effect.state,before_sha256:before,after_sha256:hash(json(state)),
          ...(isDaily(row)?{daily_fields:dailyKeys(row)}:{})});
      }
      try{calculation={trend:state.trend,rate:engineFor({day:asOf,hour:12}).currentRate(state)};json(calculation);}
      catch{fail('READING_ENGINE_CALCULATION_FAILED');}
      coverage.state_sha256=hash(json(state));coverage.calculation_sha256=hash(json(calculation));
    }else state=null;
    const result={profile:PROFILE,ready:!issues.length,qualified:false,activated:false,issues,coverage,
      accepted_state:state,accepted_calculation:calculation,reading_history:facts,daily_history:daily,
      ...(native?{workout_history:copy(native.facts)}:{})};
    // Callers can compare a saved candidate only by reproducing this function
    // over the original source and complete current accepted inputs again.
    return copy(result);
  }
  function project(input){return evaluate(input);}
  function reproduce(input,saved){const actual=project(input);if(!isDeepStrictEqual(actual,saved))fail('READING_REPLAY_CHECKPOINT_MISMATCH');return actual;}
  async function projectLineage({selectionId,generation,asOf,readSelectedSource,assertCurrent,sourceBasis,readSourceCuts,sourceRevision}={}){
    if(typeof readSelectedSource!=='function'||typeof assertCurrent!=='function'||typeof selectionId!=='string'||!generation?.collections||!date(asOf))fail('SOURCE_LINEAGE_INPUT');
    const original=copy(generation),W=original.collections.sync?.frontier?.W,nodes=new Map(),cache=new Map();
    const receiptIndex=new Map(Object.values(original.collections.receipts||{}).map(r=>[r.seq,r])),nativeCache=new Map();
    await assertCurrent();
    let sourceContext=null;
    if(sourceBasis!==undefined){
      const requested=copy(sourceBasis);
      if(typeof readSourceCuts!=='function'||requested?.W!==W||requested.selection_id!==selectionId)fail('SOURCE_WORKOUT_BASIS_UNPROVEN');
      const cuts=copy(await readSourceCuts([requested]));await assertCurrent();
      if(!Array.isArray(cuts)||cuts.length!==1||!isDeepStrictEqual(cuts[0]?.frontier,requested)||cuts[0]?.current?.intent_op_id!==selectionId)
        fail('SOURCE_WORKOUT_BASIS_UNPROVEN');
      sourceContext=cuts[0];
    }else if(readSourceCuts!==undefined)fail('SOURCE_WORKOUT_BASIS_UNPROVEN');
    async function nativeAt(g,limit){
      const through=g.collections.sync.frontier.W;
      if(!workoutProjector||!Object.values(g.collections.receipts||{}).some(r=>r.seq<=through&&g.collections.ops[r.op_id]?.class==='session'))return null;
      if(!sourceContext||!Number.isSafeInteger(sourceRevision)||sourceRevision<1)fail('SOURCE_WORKOUT_BASIS_UNPROVEN');
      let cached=nativeCache.get(through);
      if(!cached){
        await assertCurrent();const history=workoutHistoryReader(copy(g));await assertCurrent();
        const facts=await workoutProjector.projectAcceptedWithSources(history,g,{sourceRevision,readSourceCuts,assertCurrent});
        cached={history,facts};nativeCache.set(through,cached);
      }
      const facts=limit===through?copy(cached.facts):workoutProjector.projectAccepted(cached.history,g,{sourceRevision,originalThrough:limit});
      if(limit!==through){
        const sources=new Map([...cached.facts.sessions,...cached.facts.incomplete_sessions].map(row=>[row.start_op_id,row.original_source]));
        for(const row of [...facts.sessions,...facts.incomplete_sessions])row.original_source=copy(sources.get(row.start_op_id));
      }
      await assertCurrent();return {facts,recognizedIds:cached.facts.source_members.map(row=>row.op_id)};
    }
    async function node(id){
      if(nodes.has(id))return nodes.get(id);
      await assertCurrent();const value=copy(await readSelectedSource(id));await assertCurrent();
      const s=value?.selection,op=original.collections.ops?.[id],d=original.collections.dispositions?.[id];
      if(!s||s.intent_op_id!==id||!['activate','rollback'].includes(s.action)||!Number.isSafeInteger(s.seq)||s.seq<1||s.seq>W||
          !op||d?.status!=='ACCEPTED'||d.athlete_log_seq!==s.seq||op.canonical_content_commitment!==s.commitment||s.source_id!==op.payload?.source_id)
        fail('SOURCE_LINEAGE_SELECTION_UNPROVEN');
      nodes.set(id,value);return value;
    }
    const prefix=(g,cut)=>{const p=copy(g);p.collections.sync.frontier={W:cut,authorityW:cut};return p;};
    function checkpointAt(material,cut){
      const cp=parseStrictJson(material.checkpoint_json),c=cp?.generation?.collections;
      if(!c||c.sync?.frontier?.W!==cut||c.sync.frontier.authorityW!==cut)fail('SOURCE_LINEAGE_CHECKPOINT_FRONTIER');
      for(const [id,op]of Object.entries(c.ops||{}))if(!isDeepStrictEqual(op,original.collections.ops?.[id]))fail('SOURCE_LINEAGE_CHECKPOINT_ORIGINAL');
      const receipts=new Map();for(const [key,r]of Object.entries(c.receipts||{})){
        if(!r||key!==String(r.seq)||!Number.isSafeInteger(r.seq)||r.seq<1||r.seq>cut||receipts.has(r.seq))fail('SOURCE_LINEAGE_CHECKPOINT_PREFIX');receipts.set(r.seq,r);
      }
      if(receipts.size!==cut)fail('SOURCE_LINEAGE_CHECKPOINT_PREFIX');
      for(let seq=1;seq<=cut;seq++){
        const r=receipts.get(seq),current=receiptIndex.get(seq);
        if(!r||!current||!isDeepStrictEqual(r,current)||!isDeepStrictEqual(c.dispositions?.[r.op_id],original.collections.dispositions?.[r.op_id]))fail('SOURCE_LINEAGE_CHECKPOINT_PREFIX');
      }
      return cp;
    }
    async function calculate(id,g,limit,at,stack=[]){
      const key=JSON.stringify([id,g.collections.sync.frontier.W,limit,at]);if(cache.has(key))return copy(cache.get(key));
      if(stack.includes(id))fail('SOURCE_LINEAGE_CYCLE');const next=stack.concat(id),entry=await node(id);let activation=entry;
      if(entry.selection.action==='rollback'){
        activation=await node(entry.selection.target_activation_id);
        if(activation.selection.action!=='activate'||activation.selection.seq>=entry.selection.seq||activation.selection.source_id!==entry.selection.source_id||
            !isDeepStrictEqual(activation.material,entry.material))fail('SOURCE_LINEAGE_ROLLBACK_TARGET');
      }
      const s=activation.selection,m=activation.material,cut=s.before?.W,previous=s.before?.selection_id;
      if(!Number.isSafeInteger(cut)||cut<0||cut>=s.seq||cut>limit)fail('SOURCE_LINEAGE_ORDER');
      checkpointAt(m,cut);const context=parseStrictJson(m.engine_context_json),input={sourceId:s.source_id,material:m,generation:g,asOf:at};
      let result;
      if(previous===null){
        // Original roots retain the existing opaque-local-image refusal.
        if(limit===g.collections.sync.frontier.W)result=evaluate(input,null,await nativeAt(g,limit));
        else{
          const base=evaluate({...input,generation:prefix(g,0)});if(!base.ready)return base;
          result=evaluate(input,{state:base.accepted_state,inheritedIds:[],steps:[],lineage:[],originalLimit:limit},await nativeAt(g,limit));
        }
      }else{
        const prior=await node(previous);if(prior.selection.seq>cut||prior.selection.seq>=s.seq)fail('SOURCE_LINEAGE_ORDER');
        if(m.local_json===null||!date(context?.clock))fail('SOURCE_LINEAGE_LOCAL_IMAGE_REQUIRED');
        const baseline=await calculate(previous,prefix(g,cut),cut,context.clock,next);
        if(!baseline.ready)return baseline;
        if(json(baseline.accepted_state)!==m.local_json)fail('SOURCE_LINEAGE_LOCAL_IMAGE_MISMATCH');
        // The checkpoint is compared to authenticated current originals above;
        // calculation reproduces its accepted cut, never trusts its skip list.
        const inheritedView=await calculate(previous,g,cut,context.clock,next);if(!inheritedView.ready)return inheritedView;
        const inheritedIds=inheritedView.coverage.steps.map(x=>x.op_id),incoming=parseStrictJson(m.source_json);
        const nativeDates=new Set(inheritedIds.filter(id=>g.collections.ops[id].class==='reading').map(id=>g.collections.ops[id].effective.local_date));
        if((incoming.reads||[]).some(r=>nativeDates.has(r.d)))fail('SOURCE_NATIVE_IMPORT_OVERLAP_UNRESOLVED');
        for(const step of inheritedView.coverage.steps)for(const field of step.daily_fields||[]){
          const date=g.collections.ops[step.op_id].effective.local_date;
          if(Object.hasOwn(incoming.dailyLogs?.[date]||{},field))fail('SOURCE_NATIVE_DAILY_IMPORT_OVERLAP_UNRESOLVED');
        }
        let merged;try{merged=createImportPreparation({engine:engineFor({day:context.clock,hour:12}),parseStrictJson}).prepare(Buffer.from(m.source_json),
          {localBytes:Buffer.from(json(inheritedView.accepted_state))}).candidateState();}catch{fail('SOURCE_LINEAGE_RECONSTRUCTION_FAILED');}
        const lineage=(inheritedView.coverage.source_lineage||[]).concat([{selection_id:s.intent_op_id,previous_selection_id:previous,checkpoint_W:cut,
          local_image_sha256:hash(m.local_json),reproduced_local_sha256:hash(json(baseline.accepted_state)),
          reconstructed_local_sha256:hash(json(inheritedView.accepted_state)),reconstructed_merge_sha256:hash(json(merged)),
          ...(baseline.workout_history||inheritedView.workout_history?{native_membership:{original_through:cut,
            original:copy(baseline.coverage.native_workouts||null),reconstructed:copy(inheritedView.coverage.native_workouts||null),
            original_facts_sha256:hash(json(baseline.workout_history||null)),reconstructed_facts_sha256:hash(json(inheritedView.workout_history||null))}}:{})}]);
        result=evaluate(input,{state:merged,inheritedIds,steps:inheritedView.coverage.steps,lineage,originalLimit:limit},await nativeAt(g,limit));
      }
      if(result.ready){result.coverage.original_limit=limit;result.coverage.selected_intent_id=id;}
      cache.set(key,copy(result));return result;
    }
    const result=copy(await calculate(selectionId,original,W,asOf));
    result.workout_baseline=null;
    result.source_basis=null;
    if(result.ready){
      // The guarded selected-source lineage, not a bare imported DTO or a
      // workout label, supplies this binding. Rollback keeps its original
      // activation/checkpoint separate from the newer selection operation.
      const selected=await node(selectionId),activation=selected.selection.action==='rollback'?await node(selected.selection.target_activation_id):selected;
      if(sourceContext&&!isDeepStrictEqual(sourceContext.current,selected.selection))fail('SOURCE_WORKOUT_BASIS_UNPROVEN');
      const source=activation.selection,log=result.accepted_state?.sessionLog;
      if(!log||typeof log!=='object'||Array.isArray(log))fail('SOURCE_WORKOUT_HISTORY_UNSUPPORTED');
      result.workout_baseline={profile:'earned/imported-engine-history/v1',source_generation_id:source.source_id,
        activation_op_id:source.intent_op_id,session_log:log};
      if(result.workout_history){
        result.workout_history.legacy_baseline=result.workout_baseline;
        // Restore only the existing proved baseline-before-native relationship.
        // Pending records stay outside the SAME accepted-only projector; a
        // later selected source cannot be assumed to precede older Starts.
        const current=nativeCache.get(W);let ordered;
        if(!current)fail('SOURCE_WORKOUT_ORDER_UNPROVEN');
        try{
          ordered=workoutProjector.projectAccepted(current.history,original,{sourceRevision,
            importAnchor:{source_generation_id:source.source_id,activation_op_id:source.intent_op_id}}).order;
        }catch(error){if(error?.code!=='WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN')throw error;}
        if(ordered){
          if(!isDeepStrictEqual(ordered.start_ids,result.workout_history.order.start_ids))fail('SOURCE_WORKOUT_ORDER_DISAGREEMENT');
          result.workout_history.order=ordered;
        }
      }
      result.coverage.workout_source={source_id:source.source_id,activation_op_id:source.intent_op_id,selected_intent_id:selectionId,
        selected_action:selected.selection.action,original_checkpoint_W:source.before.W,material_sha256:result.coverage.material_sha256};
      if(sourceContext)result.source_basis=copy(sourceContext.frontier);
    }
    // The owned result keeps one shared sessionLog reference across the source
    // state and its baseline. Nothing is published after a changed context.
    await assertCurrent();
    if(result.ready&&result.source_basis){
      freezeOwned(result.accepted_state);freezeOwned(result.workout_baseline);freezeOwned(result.source_basis);freezeOwned(result.workout_history);
      workoutSources.set(result,{basis:copy(result.source_basis),state:result.accepted_state,baseline:result.workout_baseline,facts:result.workout_history});
      Object.freeze(result);
    }
    return result;
  }
  function workoutInput(projection,expectedBasis){
    const held=workoutSources.get(projection);
    const descriptors=Object.getOwnPropertyDescriptors(expectedBasis||{}),fields=['W','log_digest','selection_id'];
    if(!held||Reflect.ownKeys(descriptors).length!==3||fields.some(k=>!Object.hasOwn(descriptors[k]||{},'value')||!descriptors[k].enumerable)||
      fields.some(k=>descriptors[k].value!==held.basis[k]))fail('SOURCE_WORKOUT_INPUT_DISAGREEMENT');
    // The engine adapter takes its one owned copy. This is source correspondence,
    // not a new authentication, currentness or qualified-plan boundary.
    return {state:held.state,source_basis:copy(held.basis),workout_baseline:held.baseline,...(held.facts?{workoutFacts:held.facts}:{})};
  }
  return Object.freeze({project,reproduce,projectLineage,workoutInput});
}
module.exports={createReadingReplay,PROFILE};
