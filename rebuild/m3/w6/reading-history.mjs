// Factual interpretation only. The caller must first authenticate this SAME
// complete generation. No signature, source coverage, daily trend choice,
// machine calculation, accepted plan or permission is produced here.
export function createReadingProjector({athleteId,deviceId}){
  if(typeof athleteId!=='string'||!athleteId||typeof deviceId!=='string'||!deviceId)throw TypeError('Scoped reading projector required');
  const copy=structuredClone,own=(x,k)=>Object.hasOwn(x||{},k),object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  const fail=code=>{const error=new Error(code);error.code=code;throw error;};
  const terminal=d=>['ACCEPTED','REJECTED','REJECTED_DEPENDENCY'].includes(d?.status);
  const quantity=q=>object(q)&&Object.keys(q).length===2&&own(q,'value')&&q.unit==='lb'&&typeof q.value==='number'&&Number.isFinite(q.value)&&!Object.is(q.value,-0);
  return function project({operations,dispositions={},receipts={},frontier,outbox={},rejected={}}){
    if(!object(operations)||![dispositions,receipts,outbox,rejected,frontier].every(object)||!Number.isSafeInteger(frontier.W)||frontier.W<0)fail('READING_PROJECTION_INPUT');
    const W=frontier.W,positions=new Map(),status=new Map();
    for(const receipt of Object.values(receipts)){
      if(!object(receipt)||!Number.isSafeInteger(receipt.seq)||receipt.seq<1)fail('READING_PROJECTION_RECEIPT');
      if(receipt.seq>W)continue;
      const op=operations[receipt.op_id];
      if(!op||op.athlete_id!==athleteId||receipt.canonical_content_commitment!==op.canonical_content_commitment||positions.has(receipt.seq))fail('READING_PROJECTION_RECEIPT');
      positions.set(receipt.seq,receipt.op_id);
    }
    if(positions.size!==W)fail('READING_PROJECTION_PREFIX');
    for(let seq=1;seq<=W;seq++){
      if(!positions.has(seq))fail('READING_PROJECTION_PREFIX');
      const d=dispositions[positions.get(seq)];
      if(d?.status!=='ACCEPTED'||d.athlete_log_seq!==seq)fail('READING_PROJECTION_RECEIPT');
    }
    for(const [id,op]of Object.entries(operations)){
      if(!object(op)||op.op_id!==id||op.athlete_id!==athleteId||!Array.isArray(op.causal_parents))fail('READING_PROJECTION_ORIGINAL');
      const d=dispositions[id],r=rejected[id];
      if(d&&(d.op_id!==id||d.canonical_content_commitment!==op.canonical_content_commitment))fail('READING_PROJECTION_DISPOSITION');
      if(r&&(!terminal(d)||d.status==='ACCEPTED'||r.op_id!==id||r.commitment!==op.canonical_content_commitment||r.status!==d.status))fail('READING_PROJECTION_REJECTION');
      if(d?.status==='ACCEPTED'&&Number.isSafeInteger(d.athlete_log_seq)&&d.athlete_log_seq>0&&d.athlete_log_seq<=W){
        if(positions.get(d.athlete_log_seq)!==id||r)fail('READING_PROJECTION_RECEIPT');status.set(id,'accepted');
      }else if(['REJECTED','REJECTED_DEPENDENCY'].includes(d?.status))status.set(id,'rejected');
      else if(op.device_id===deviceId&&own(outbox,id)&&outbox[id]?.op_id===id&&!r&&!terminal(d))status.set(id,'pending-local');
      else status.set(id,'unresolved');
    }
    const ancestry=new Map();
    function ancestors(id){
      if(ancestry.has(id))return ancestry.get(id);
      const seen=new Set(),colors=new Map(),stack=[[id,false]];
      while(stack.length){
        const [key,exit]=stack.pop();if(exit){colors.set(key,2);continue;}
        if(colors.get(key)===1)fail('READING_CAUSAL_CYCLE');if(colors.get(key)===2)continue;
        const op=operations[key];if(!op||op.athlete_id!==athleteId||!Array.isArray(op.causal_parents)||new Set(op.causal_parents).size!==op.causal_parents.length)fail('READING_CAUSAL_REFERENCE');
        colors.set(key,1);stack.push([key,true]);
        for(const parent of op.causal_parents){if(typeof parent!=='string')fail('READING_CAUSAL_REFERENCE');seen.add(parent);stack.push([parent,false]);}
      }
      seen.delete(id);ancestry.set(id,seen);return seen;
    }
    const targets=new Map();
    for(const op of Object.values(operations))if(typeof op.target_op_id==='string'){
      if(!targets.has(op.target_op_id))targets.set(op.target_op_id,[]);targets.get(op.target_op_id).push(op);
    }
    function fold(original,edits,layer){
      const issues=[],applied=[];let value=copy(original.payload?.lb),included=true;
      if(original.schema_version!==1||!quantity(value))issues.push('READING_VALUE_UNSUPPORTED');
      const relevant=edits.filter(op=>status.get(op.op_id)!=='rejected'&&(layer==='local'||status.get(op.op_id)==='accepted'));
      if(relevant.some(op=>status.get(op.op_id)==='unresolved'))issues.push('READING_STATUS_UNRESOLVED');
      try{
        for(const op of relevant){
          if(!ancestors(op.op_id).has(original.op_id))issues.push('READING_TARGET_CAUSAL_EDGE_REQUIRED');
          for(const other of relevant)if(op!==other&&!ancestors(op.op_id).has(other.op_id)&&!ancestors(other.op_id).has(op.op_id))issues.push('READING_CONCURRENT_EDITS');
        }
        relevant.sort((a,b)=>ancestors(b.op_id).has(a.op_id)?-1:ancestors(a.op_id).has(b.op_id)?1:0);
      }catch(error){issues.push(error.code||'READING_CAUSAL_REFERENCE');}
      for(const op of relevant){
        if(!included)issues.push('READING_EDIT_AFTER_REMOVAL');
        if(op.schema_version!==1||op.class!=='reading')issues.push('READING_EFFECT_UNSUPPORTED');
        if(op.kind==='correction'){
          const p=op.payload,r=p?.replacement_fields;
          if(!object(p)||Object.keys(p).length!==1||!object(r)||Object.keys(r).length!==1||!quantity(r.lb))issues.push('READING_REPLACEMENT_UNSUPPORTED');
          else value=copy(r.lb);
        }else if(op.kind==='tombstone'){
          if(!object(op.payload)||Object.keys(op.payload).length!==1||typeof op.payload.reason!=='string'||!op.payload.reason.trim())issues.push('READING_REMOVAL_UNSUPPORTED');
          else included=false;
        }else issues.push('READING_EFFECT_UNSUPPORTED');
        applied.push(op.op_id);
      }
      const unique=[...new Set(issues)];return {state:unique.length?'unresolved':included?'included':'removed',
        quantity:unique.length||!included?null:value,effect_ids:applied,issues:unique};
    }
    const records=[];
    for(const op of Object.values(operations))if(op.kind==='fact'&&op.class==='reading'){
      const state=status.get(op.op_id),edits=targets.get(op.op_id)||[],day=op.effective?.local_date;
      const validDate=typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day+'T00:00:00Z'))&&new Date(Date.parse(day+'T00:00:00Z')).toISOString().slice(0,10)===day;
      const unavailable={state:state==='rejected'?'rejected':'unresolved',quantity:null,effect_ids:[],issues:[state==='rejected'?'READING_REJECTED':'READING_STATUS_UNRESOLVED']};
      const accepted=state==='accepted'?fold(op,edits,'accepted'):null;
      const local=['accepted','pending-local'].includes(state)?fold(op,edits,'local'):copy(unavailable);
      if(!validDate)for(const view of [accepted,local].filter(Boolean)){view.state='unresolved';view.quantity=null;view.issues.push('READING_DATE_UNSUPPORTED');}
      records.push({op_id:op.op_id,date:day??null,status:state,original:copy(op),
        effects:edits.map(e=>({status:status.get(e.op_id),original:copy(e)})),accepted,local});
    }
    // Retain edits whose original is absent or is not a reading fact. These
    // cannot create observations, and must remain visible for resolution.
    for(const op of Object.values(operations))if(op.class==='reading'&&op.kind!=='fact'&&
        !(operations[op.target_op_id]?.kind==='fact'&&operations[op.target_op_id]?.class==='reading')){
      const state=status.get(op.op_id),unresolved={state:state==='rejected'?'rejected':'unresolved',quantity:null,effect_ids:[],issues:['READING_TARGET_UNAVAILABLE']};
      records.push({op_id:op.op_id,date:op.effective?.local_date??null,status:state,original:copy(op),effects:[],
        accepted:state==='accepted'?copy(unresolved):null,local:copy(unresolved)});
    }
    const reads=records.filter(r=>r.local.state==='included').map(r=>({date:r.date,lb:r.local.quantity.value,op_id:r.op_id,status:r.status,
      effect_ids:r.local.effect_ids.slice()}));
    const acceptedReads=records.filter(r=>r.accepted?.state==='included').map(r=>({date:r.date,lb:r.accepted.quantity.value,op_id:r.op_id,effect_ids:r.accepted.effect_ids.slice()}));
    const group=rows=>{const days=new Map();for(const row of rows){if(!days.has(row.date))days.set(row.date,[]);days.get(row.date).push(row.op_id);}
      return [...days].map(([date,op_ids])=>({date,op_ids,selection:null,interpretation:op_ids.length>1?'DAILY_READING_RESOLUTION_REQUIRED':'RECORDED_OBSERVATION_ONLY'}));};
    return {profile:'earned/reading-projection/v1',frontier:W,records,reads,acceptedReads,
      days:group(reads),acceptedDays:group(acceptedReads),machineProjection:false};
  };
}
