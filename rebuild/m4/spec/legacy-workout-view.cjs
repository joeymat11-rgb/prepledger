'use strict';
// Preparation: links a trusted authenticated reader, never a caller's verified flag.
// Historical observations only. No prescription, currentness, inferred consent,
// progression, durable state or session resolution is produced here.
function createLegacyWorkoutView(reader) {
  if (!reader || typeof reader.read !== 'function') throw TypeError('Authenticated reader required');
  const copy=structuredClone, text=x=>typeof x==='string'&&x.trim().length>0;
  const quantity=(x,unit)=>x&&typeof x==='object'&&!Array.isArray(x)&&
    Object.keys(x).length===2&&Object.hasOwn(x,'value')&&Object.hasOwn(x,'unit')&&Number.isFinite(x.value)&&x.unit===unit;
  return Object.freeze({async read(input){
    const result=await reader.read(input);
    if(!result.verified)return {verified:false,code:result.code,view:null,decisionReady:false};
    const history=result.history, events=[], byId=new Map(history.facts.map(f=>[f.operation.op_id,f]));
    const issues=[];
    for(const fact of history.facts){
      const o=fact.operation;
      // Legacy correction commands use class reading even when their target is
      // a session fact. Keep those effects visible rather than silently dropping
      // them and presenting an unqualified current workout.
      if(o.class!=='session'&&byId.get(o.target_op_id)?.operation.class!=='session')continue;
      const event={id:o.op_id,position:fact.position,kind:o.kind,deviceId:o.device_id,
        effective:copy(o.effective),source:copy(fact.source),operation:copy(o),
        readerIssues:copy(history.issues.filter(i=>i.opId===o.op_id)),interpretation:'UNINTERPRETED'};
      const issue=code=>{issues.push({opId:o.op_id,code});};
      if(o.schema_version!==1){issue('UNSUPPORTED_SCHEMA_VERSION');events.push(event);continue;}
      if(!o.payload||typeof o.payload!=='object'||Array.isArray(o.payload)){
        issue('UNSUPPORTED_SESSION_PAYLOAD');events.push(event);continue;
      }
      if(o.kind==='session-start'){
        event.interpretation='RECORDED_START';event.planBasis=null;
        event.slot=Object.hasOwn(o.payload,'slot')?copy(o.payload.slot):null;
        issue('MISSING_LEGACY_PLAN_BASIS');
      }else if(o.kind==='session-set'){
        const p=o.payload;
        if(!quantity(p?.load,'lb')||!quantity(p?.reps,'rep')){
          issue('UNSUPPORTED_SET_OBSERVATIONS');events.push(event);continue;
        }
        // Preserve the original values including unusual signed values. Numeric
        // interpretation here is not training-domain validation or endorsement.
        event.interpretation='RECORDED_SET';event.observations={load:copy(p.load),reps:copy(p.reps)};
        event.lift=Object.hasOwn(p,'lift')?copy(p.lift):null;
        event.logicalSlot=Object.hasOwn(p,'slot')?copy(p.slot):null;
        event.reserve={tag:'unknown',reason:'NOT_RECORDED_BY_SCHEMA1_WRITER'};
        const id=p.session_start_id, parent=byId.get(id)?.operation;
        event.sessionStartId=text(id)?id:null;
        event.association=parent?.class==='session'&&parent.kind==='session-start'&&parent.schema_version===1?
          'RECORDED_REFERENCE':'UNRESOLVED';
        if(event.association==='UNRESOLVED')issue('MISSING_OR_UNSUPPORTED_START_REFERENCE');
        // Legacy references do not carry the future schema's explicit causal
        // contract; never infer one from same day/device/receipt position.
        if(Object.keys(p).some(k=>!['load','reps','lift','slot','session_start_id'].includes(k)))issue('UNINTERPRETED_SET_FIELDS');
      }else if(o.kind==='session-close'){
        event.interpretation='RECORDED_CLOSE';event.sessionStartId=text(o.payload?.session_start_id)?o.payload.session_start_id:null;
      }else issue('HISTORY_EFFECT_REQUIRES_QUALIFIED_FOLD');
      events.push(event);
    }
    return {verified:true,decisionReady:false,view:{currency:history.currency,through:history.through,
      mode:'ORIGINAL_RECORDED_EVENTS',events,issues,source:copy(history.source)}};
  }});
}
module.exports={createLegacyWorkoutView};
