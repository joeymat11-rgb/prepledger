'use strict';
const {createLegacyWorkoutView}=require('./legacy-workout-view.cjs');
// Supported historical observation fold, not workout eligibility or a training
// reducer. Links a trusted reader so an input verified:true flag is never enough.
function createLegacyWorkoutProjection(reader){
  if(!reader||typeof reader.read!=='function')throw TypeError('Authenticated reader required');
  const copy=structuredClone, object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  const closed=(x,keys)=>object(x)&&Object.keys(x).every(k=>keys.includes(k));
  const q=(x,u)=>closed(x,['value','unit'])&&Object.keys(x).length===2&&Number.isFinite(x.value)&&x.unit===u;
  return Object.freeze({async read(input){
    const result=await reader.read(input);
    if(!result.verified)return {verified:false,code:result.code,projection:null,recorded:null,decisionReady:false};
    const history=result.history;
    // Private composition over the just-verified captured result; no caller can
    // replace the retained history between verification and this interpretation.
    const recorded=(await createLegacyWorkoutView({read:async()=>result}).read()).view;
    const byId=new Map(history.facts.map(f=>[f.operation.op_id,f]));
    const parentsById=new Map(),effectsByTarget=new Map();
    for(const f of history.facts){
      const parents=new Set();
      if(!Array.isArray(f.operation.causal_parents))return {
        verified:true,code:'HISTORY_CAUSAL_GRAPH_UNSUPPORTED',projection:null,recorded,decisionReady:false};
      for(const id of f.operation.causal_parents){
        const prior=byId.get(id);
        if(!prior||prior.position>=f.position||!parentsById.has(id))return {
          verified:true,code:'HISTORY_CAUSAL_GRAPH_UNSUPPORTED',projection:null,recorded,decisionReady:false};
        parents.add(id);
      }
      parentsById.set(f.operation.op_id,parents);
      const target=f.operation.target_op_id;
      if(target!==undefined){if(!effectsByTarget.has(target))effectsByTarget.set(target,[]);effectsByTarget.get(target).push(f);}
    }
    // Visit only the edit ancestry actually queried; do not materialize the
    // transitive closure of every operation in a long athlete history.
    const descends=(from,wanted)=>{const todo=[...(parentsById.get(from)||[])],seen=new Set();
      while(todo.length){const id=todo.pop();if(id===wanted)return true;if(seen.has(id))continue;
        seen.add(id);for(const p of parentsById.get(id)||[])todo.push(p);}return false;};
    const sets=[];
    for(const event of recorded.events.filter(e=>e.kind==='session-set')){
      const original=copy(event.operation.payload),applied=[],failures=[];
      let observations=event.interpretation==='RECORDED_SET'?copy(event.observations):null,included=true;
      const effects=effectsByTarget.get(event.id)||[];
      if(!observations)failures.push('UNSUPPORTED_ORIGINAL_SET');
      if(event.readerIssues.some(i=>['UNSUPPORTED_OPERATION_SHAPE','UNSUPPORTED_SCHEMA_VERSION'].includes(i.code)))failures.push('UNSUPPORTED_ORIGINAL_SET');
      for(const f of effects){
        const o=f.operation;
        if(o.schema_version!==1||!['session','reading'].includes(o.class)||!['correction','tombstone'].includes(o.kind)){
          failures.push('UNSUPPORTED_TARGET_EFFECT');continue;
        }
        if(!o.causal_parents.includes(event.id))failures.push('MISSING_EXPLICIT_TARGET_CAUSAL_EDGE');
        // Receipt order is not semantic descent. This supported profile refuses
        // concurrent edits rather than inventing a broader field/removal policy.
        if(!applied.every(id=>descends(o.op_id,id)))failures.push('CONCURRENT_TARGET_EDITS');
        if(!included)failures.push('EDIT_AFTER_REMOVAL_UNSUPPORTED');
        if(o.kind==='correction'){
          const replacement=o.payload?.replacement_fields;
          if(!closed(o.payload,['replacement_fields'])||!closed(replacement,['load','reps'])||!Object.keys(replacement).length||
            (Object.hasOwn(replacement,'load')&&!q(replacement.load,'lb'))||
            (Object.hasOwn(replacement,'reps')&&!q(replacement.reps,'rep')))failures.push('UNSUPPORTED_REPLACEMENT');
          else if(observations)observations={...observations,...copy(replacement)};
        }else{
          if(!closed(o.payload,['reason'])||typeof o.payload.reason!=='string'||!o.payload.reason.trim())failures.push('UNSUPPORTED_REMOVAL');
          else included=false;
        }
        applied.push(o.op_id);
      }
      const unresolved=[...new Set(failures)];
      sets.push({id:event.id,sessionStartId:event.sessionStartId??null,logicalSlot:copy(event.logicalSlot??null),
        lift:copy(event.lift??null),planBasis:null,reserve:copy(event.reserve??{tag:'unknown'}),original,
        state:unresolved.length?'UNRESOLVED':included?'INCLUDED':'REMOVED',
        // Never let a partially applied chain masquerade as current observations.
        observations:unresolved.length||!included?null:observations,
        source:copy(event.source),effects:effects.map(f=>({id:f.operation.op_id,position:f.position,
          operation:copy(f.operation),source:copy(f.source)})),unresolved});
    }
    return {verified:true,decisionReady:false,recorded,projection:{
      mode:'SUPPORTED_LEGACY_OBSERVATIONS_AT_CAPTURED_PREFIX',through:history.through,currency:history.currency,sets,
      unresolved:sets.filter(s=>s.state==='UNRESOLVED').map(s=>({id:s.id,reasons:s.unresolved}))}};
  }});
}
module.exports={createLegacyWorkoutProjection};
