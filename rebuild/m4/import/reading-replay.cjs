'use strict';
// Internal candidate calculation, not an authentication/current-plan boundary.
// The W6 caller must authenticate and bind this SAME source and generation.
// Always reproduce from immutable material; never trust a cached skip-ID list.
const {createHash}=require('node:crypto');
const {isDeepStrictEqual}=require('node:util');
const {createImportPreparation}=require('./prepare.cjs');
const PROFILE='earned/source-reading-replay/v1',copy=structuredClone;
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
const hash=x=>createHash('sha256').update(x).digest('hex');
const json=x=>{const s=JSON.stringify(x);if(!isDeepStrictEqual(JSON.parse(s),x))fail('READING_REPLAY_LOSSY_JSON');return s;};
const date=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
function createReadingReplay({engineFor,projectReadings,parseStrictJson,producerIdentity,importBuild}={}){
  if([engineFor,projectReadings,parseStrictJson].some(f=>typeof f!=='function')||typeof producerIdentity!=='string'||!producerIdentity||typeof importBuild!=='string'||!importBuild)
    throw TypeError('Actual scoped engine factory, reading projector, parser and producer identity required');
  function project({sourceId,material,generation,asOf}={}){
    if(typeof sourceId!=='string'||!sourceId||!material||!generation?.collections||!date(asOf))fail('READING_REPLAY_INPUT');
    const input=copy(material),g=copy(generation),c=g.collections;
    if(Object.keys(input).length!==5||!['source_json','candidate_json','checkpoint_json','engine_context_json'].every(k=>typeof input[k]==='string')||
        !(input.local_json===null||typeof input.local_json==='string'))fail('READING_REPLAY_MATERIAL');
    let context,checkpoint;try{context=parseStrictJson(input.engine_context_json);checkpoint=parseStrictJson(input.checkpoint_json);}catch{fail('READING_REPLAY_CONTEXT');}
    const facts=projectReadings({operations:c.ops||{},dispositions:c.dispositions||{},receipts:c.receipts||{},frontier:c.sync?.frontier,outbox:c.outbox||{},rejected:c.rejected||{}});
    const issues=[],issue=(code,op_id)=>issues.push({code,...(op_id?{op_id}:{})});
    if(!context||context.build!==importBuild||!date(context.clock))issue('SOURCE_PREPARATION_CONTEXT_UNPROVEN');
    // A different local engine image beside native operations may already
    // contain their effects. Reproducing merge alone cannot establish lineage.
    if(input.local_json!==null&&input.local_json!==input.source_json&&Object.keys(checkpoint?.generation?.collections?.ops||{}).length)
      issue('SOURCE_LOCAL_ENGINE_COVERAGE_UNPROVEN');
    const accepted=Object.values(c.receipts||{}).filter(r=>r.seq<=facts.frontier).sort((a,b)=>a.seq-b.seq);
    const coverage={source_id:sourceId,material_sha256:hash(json(input)),producer:producerIdentity,frontier:facts.frontier,as_of:asOf,
      runtime:{node:process.versions.node,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone},
      // These are immutable source positions, never fabricated Earned op IDs.
      legacy_readings:[],accepted_originals:accepted.map(r=>({op_id:r.op_id,commitment:r.canonical_content_commitment,seq:r.seq})),steps:[]};
    let state=null,calculation=null;
    if(!issues.length){
      try{
        const prep=createImportPreparation({engine:engineFor({day:context.clock,hour:12}),parseStrictJson}).prepare(Buffer.from(input.source_json),
          input.local_json===null?{}:{localBytes:Buffer.from(input.local_json)});
        if(prep.candidateBytes().toString()!==input.candidate_json)fail('SOURCE_PREPARATION_REPRODUCTION_MISMATCH');
        state=prep.candidateState();
      }catch(error){if(error.code==='SOURCE_PREPARATION_REPRODUCTION_MISMATCH')throw error;fail('SOURCE_PREPARATION_REPRODUCTION_FAILED');}
      if(!Array.isArray(state.reads)||typeof state.trend!=='number'||!Number.isFinite(state.trend))issue('SOURCE_READING_BASIS_UNSUPPORTED');
    }
    let last=null;const seenDates=new Set();
    if(state&&Array.isArray(state.reads))for(const [index,row]of state.reads.entries()){
      coverage.legacy_readings.push({source_id:sourceId,member:'candidate_json.reads',index,original:copy(row)});
      if(!date(row?.d)||typeof row.w!=='number'||!Number.isFinite(row.w)||row.w<=0||seenDates.has(row.d)||last&&row.d<=last)issue('SOURCE_READING_ORDER_UNSUPPORTED');
      seenDates.add(row.d);last=row.d;
    }
    for(const row of facts.records)if(row.status==='pending-local'&&seenDates.has(row.date))issue('PENDING_SOURCE_OVERLAP_UNRESOLVED',row.op_id);
    const byId=new Map(facts.records.map(r=>[r.op_id,r]));
    for(const receipt of accepted){
      const op=c.ops[receipt.op_id];
      if(op.class==='reading'){
        if(op.kind==='fact'){
          const row=byId.get(op.op_id);if(!row?.accepted||row.accepted.state==='unresolved')issue('ACCEPTED_READING_UNRESOLVED',op.op_id);
        }else if(!['correction','tombstone'].includes(op.kind)||!byId.get(op.target_op_id)?.accepted)issue('ACCEPTED_READING_EFFECT_UNMAPPED',op.op_id);
      }else if(!(op.schema_version===1&&op.class==='event'&&op.kind==='fact'&&['source-import-intent','source-rollback-intent'].includes(op.payload?.type)))
        issue('ACCEPTED_ENGINE_CONTEXT_UNMAPPED',op.op_id);
    }
    // Admission order is the retained execution order for this candidate. A
    // backdated insertion or same-date choice needs an explicit governing rule.
    const ordered=accepted.map(r=>byId.get(r.op_id)).filter(r=>r?.original.kind==='fact');
    for(const row of ordered){
      if(seenDates.has(row.date))issue('SOURCE_OR_DAILY_READING_OVERLAP',row.op_id);
      if(last&&row.date<=last)issue('READING_REPLAY_ORDER_UNRESOLVED',row.op_id);
      seenDates.add(row.date);last=row.date;
      const eff=row.original.effective;
      if(!date(row.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(eff?.local_time||'')||!/^([+-])(0\d|1[0-4]):[0-5]\d$/.test(eff?.utc_offset||''))issue('READING_EFFECTIVE_CONTEXT_UNPROVEN',row.op_id);
      if(row.date>asOf)issue('READING_AFTER_CALCULATION_DAY',row.op_id);
      if(date(context?.clock)&&row.date<context.clock)issue('READING_BEFORE_SOURCE_CONTEXT_UNPROVEN',row.op_id);
      if(row.accepted?.state==='included'&&!(row.accepted.quantity.value>0))issue('READING_ENGINE_VALUE_UNSUPPORTED',row.op_id);
    }
    if(!issues.length){
      // Replay resolved ACCEPTED values, not current local corrections. Removing
      // an earlier record reconstructs every later effect from the same source.
      for(const row of ordered){
        const before=hash(json(state)),effect=row.accepted;
        if(effect.state==='included'){
          const hour=Number(row.original.effective.local_time.slice(0,2));
          try{state=engineFor({day:row.date,hour}).applyRead(state,row.date,effect.quantity.value,{hour});}
          catch{fail('READING_ENGINE_EXECUTION_FAILED');}
          const applied=state.reads.filter(r=>r.d===row.date);
          if(applied.length!==1||applied[0].w!==effect.quantity.value)fail('READING_ENGINE_EFFECT_MISSING');
        }
        coverage.steps.push({op_id:row.op_id,accepted_effect_ids:effect.effect_ids.slice(),state:effect.state,before_sha256:before,after_sha256:hash(json(state))});
      }
      try{calculation={trend:state.trend,rate:engineFor({day:asOf,hour:12}).currentRate(state)};json(calculation);}
      catch{fail('READING_ENGINE_CALCULATION_FAILED');}
      coverage.state_sha256=hash(json(state));coverage.calculation_sha256=hash(json(calculation));
    }else state=null;
    const result={profile:PROFILE,ready:!issues.length,qualified:false,activated:false,issues,coverage,
      accepted_state:state,accepted_calculation:calculation,reading_history:facts};
    // Callers can compare a saved candidate only by reproducing this function
    // over the original source and complete current accepted inputs again.
    return copy(result);
  }
  function reproduce(input,saved){const actual=project(input);if(!isDeepStrictEqual(actual,saved))fail('READING_REPLAY_CHECKPOINT_MISMATCH');return actual;}
  return Object.freeze({project,reproduce});
}
module.exports={createReadingReplay,PROFILE};
