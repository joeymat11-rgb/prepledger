'use strict';
// Nonshipping boundary candidate. Actual pinned R1 modules are linked by the
// test/production composition, never selected by response fields. No storage,
// currentness permission, training reducer or synthetic receipt is constructed.
function linkR1HistoryReader({codec:C, createR1Verifier, validShape}) {
  if(!C || typeof createR1Verifier!=='function' || typeof validShape!=='function') throw TypeError('Pinned R1 and shape modules required');
  return function createHistoryReader({keys, subtle, athleteId, actorDeviceId}) {
    if(!C.nonempty(athleteId)||!C.nonempty(actorDeviceId))throw TypeError('Authenticated local scope required');
    const verifier=createR1Verifier({keys,subtle});
    const refusal=code=>({verified:false,code,history:null,decisionReady:false});
    return Object.freeze({read:async function read({manifest,pages,request,expected}={}) {
      // Capture all caller-owned values before the first asynchronous signature.
      let mr,pp,rr,ee;
      try {
        mr=new Uint8Array(C.bytes(manifest)); rr=new Uint8Array(C.bytes(request));
        if(!Array.isArray(pages))return refusal('PAGE_INVENTORY');
        pp=pages.map(p=>new Uint8Array(C.bytes(p))); ee=structuredClone(expected);
        if(ee?.athleteId!==athleteId||ee?.actorDeviceId!==actorDeviceId)return refusal('LOCAL_SCOPE_MISMATCH');
      } catch(_) {return refusal('MALFORMED_HISTORY_INPUT');}
      const proof=await verifier.assemble(mr,pp,rr,ee);
      if(!proof.verified)return refusal(proof.code);
      try {
        const p=proof.value.payload;
        if(p.scope.athlete_id!==athleteId||p.scope.actor_device_id!==actorDeviceId)return refusal('LOCAL_SCOPE_MISMATCH');
        const rowValue=row=>C.parse(C.decode64(row.value_b64));
        const byKey=new Map(p.retained_rows.map(row=>[JSON.stringify([row.collection,row.row_id]),row]));
        const get=(table,id)=>byKey.get(JSON.stringify([table,String(id)]));
        const facts=[],starts=[],issues=[];
        for(const logRow of p.accepted.rows){
          const log=rowValue(logRow),opRow=get('operations',log.op.op_id),stored=rowValue(opRow),op=stored.op;
          const dispositionRow=get('history',JSON.stringify([op.op_id,stored.historyCount]));
          // These are original retained row bytes, NOT an invented signReceipt DTO.
          facts.push({position:log.seq,operation:structuredClone(op),
            source:{logRow:structuredClone(logRow),operationRow:structuredClone(opRow),dispositionRow:structuredClone(dispositionRow)}});
          const issue=code=>issues.push({code,opId:op.op_id});
          if(!validShape(op)){issue('UNSUPPORTED_OPERATION_SHAPE');continue;}
          if(op.schema_version!==1){issue('UNSUPPORTED_SCHEMA_VERSION');continue;}
          if(op.class==='reading'&&op.kind==='fact')continue;
          if(op.class!=='session'||op.kind!=='session-start'){issue('HISTORY_EFFECT_UNIMPLEMENTED');continue;}
          const fields=['op_id','athlete_id','device_id','device_seq','device_predecessor_op_id','causal_parents','class','kind','effective','schema_version','lease_id','payload','canonical_content_commitment'];
          if(Object.keys(op).some(k=>!fields.includes(k))||!C.object(op.payload)||Object.keys(op.payload).some(k=>k!=='slot'))issue('UNSUPPORTED_START_FIELDS');
          const hasSlot=C.object(op.payload)&&Object.hasOwn(op.payload,'slot');
          if(!hasSlot||!C.nonempty(op.payload.slot))issue('MISSING_LEGACY_SLOT');
          const e=op.effective,day=Date.parse(e.local_date+'T00:00:00Z');
          if(!/^\d{4}-\d{2}-\d{2}$/.test(e.local_date)||!Number.isFinite(day)||new Date(day).toISOString().slice(0,10)!==e.local_date||!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.local_time))issue('UNSUPPORTED_EFFECTIVE_FORMAT');
          issue('MISSING_LEGACY_PLAN_BASIS'); issue('ELIGIBILITY_REDUCER_UNIMPLEMENTED');
          starts.push({id:op.op_id,slot:hasSlot?structuredClone(op.payload.slot):null,
            slotSourcePath:hasSlot?'payload.slot':null,effective:structuredClone(e),
            planBasis:null,eligibility:null,liveness:'NOT_FOLDED'});
        }
        return {verified:true,decisionReady:false,history:{through:p.accepted.W,
          currency:'CAPTURED_PREFIX_ONLY',facts,starts,issues,
          source:{manifestBytes:mr,requestBytes:rr,payloadBytes:new Uint8Array(proof.value.payloadBytes)}}};
      } catch(_) {return refusal('HISTORY_INTERPRETATION_UNSUPPORTED');}
    }});
  };
}
module.exports={linkR1HistoryReader};
