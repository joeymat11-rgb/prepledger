import Schema from './schema.cjs';
import {sameRecordedValue} from '../../m3/w6/history-proof.mjs';

// Assembled privately from an authenticated generation. The public client must
// verify the same snapshot's historical signatures/standing before exposing it.
// This recovers original facts, NOT a correction/liveness fold,
// current authority head, active-workout selection or permission to continue.
export function storedWorkoutHistory(generation,{athleteId,deviceId,prescriptionCapture}) {
  const fail=code=>{const e=new Error(code);e.state=18;e.code=code;throw e;};
  const c=generation.collections,ops=c.ops||{},indexes=c.receipts||{},proofs=new Map();
  for(const kind of ['pull','snapshot','currentHead'])for(const bundle of Object.values(generation.metadata.wireProofs?.[kind]||{})){
    for(const receipt of kind==='snapshot'?bundle.entries:bundle.receipts){
      const previous=proofs.get(receipt.seq);
      if(previous&&(previous.op_id!==receipt.op_id||!sameRecordedValue(previous.op,receipt.op)))fail('WORKOUT_RECEIPT_CONFLICT');
      proofs.set(receipt.seq,receipt);
    }
  }
  const W=c.sync?.frontier?.W??0,accepted=new Map();
  if(!Number.isSafeInteger(W)||W<0)fail('WORKOUT_FRONTIER_INVALID');
  const indexRows=Object.values(indexes);
  if(indexRows.some(r=>!r||!Number.isSafeInteger(r.seq)||r.seq<1))fail('WORKOUT_RECEIPT_INDEX_INVALID');
  const positions=indexRows.filter(r=>r.seq<=W).sort((a,b)=>a.seq-b.seq);
  if(positions.length!==W)fail('WORKOUT_PREFIX_INCOMPLETE');
  positions.forEach((r,index)=>{
    const signed=proofs.get(index+1),op=ops[r.op_id];
    if(r.seq!==index+1||!signed||signed.op_id!==r.op_id||r.canonical_content_commitment!==signed.canonical_content_commitment||
      !op||!sameRecordedValue(op,signed.op)||accepted.has(r.op_id))fail('WORKOUT_PREFIX_UNPROVEN');
    accepted.set(r.op_id,r.seq);
  });
  const rows=new Map();
  for(const [id,op] of Object.entries(ops)){
    if(!op||typeof op!=='object'||op.athlete_id!==athleteId||id!==op.op_id)fail('WORKOUT_RECORD_SCOPE_INVALID');
    if(op.class!=='session')continue;
    // Legacy absence is a mapping requirement, not corrupt storage or first use.
    if(op.schema_version!==2){const e=new Error('WORKOUT_LEGACY_MAPPING_REQUIRED');e.state=3;e.code=e.message;throw e;}
    const captured=op.kind==='session-start'&&Object.hasOwn(op,'prescription_capture');
    if(!Schema.validateWorkoutShape(op,captured?{prescriptionCapture}:{}).valid)fail('WORKOUT_RECORD_INVALID');
    const rejected=c.rejected?.[id],seq=accepted.get(id);
    if(rejected&&seq!==undefined)fail('WORKOUT_ACCEPTANCE_CONFLICT');
    const status=rejected?'rejected':seq!==undefined?'accepted-through-frontier':op.device_id===deviceId&&Object.hasOwn(c.outbox||{},id)?'stored-on-this-device':'stored-status-unresolved';
    rows.set(id,{operation:structuredClone(op),status,...(seq!==undefined?{receipt_sequence:seq}:{})});
  }
  const sessions=[],byStart=new Map();
  for(const [id,row] of rows)if(row.operation.kind==='session-start'){
    const op=row.operation,original=Object.hasOwn(op,'prescription_capture')?
      prescriptionCapture.prepare(op.prescription_capture,{producer:op.prescription_capture.producer,basis:op.prescription_capture.basis}):null;
    const session={start:row,original,records:[]};sessions.push(session);byStart.set(id,session);
  }
  for(const [id,row] of rows){
    const op=row.operation;if(op.kind==='session-start')continue;
    const edit=op.kind==='correction'||op.kind==='tombstone';
    const target=edit?rows.get(op.target_op_id)?.operation:null;
    if(edit&&(!target||target.kind!=='session-set'||target.lift_lineage_id!==op.lift_lineage_id))fail('WORKOUT_EDIT_TARGET_UNPROVEN');
    const session=byStart.get(edit?target.session_start_op_id:op.session_start_op_id);
    if(!session)fail('WORKOUT_START_REFERENCE_UNPROVEN');
    session.records.push(row);
  }
  // No timestamp/arrival sort pretends to resolve causality or competing edits.
  return {frontier:W,sessions,interpretation:'original-facts-and-edits-unfolded',
    continuation:{allowed:false,reason:'CURRENT_SAFETY_AND_COMPLETE_HISTORY_REQUIRED'}};
}
