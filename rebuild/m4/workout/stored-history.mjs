import {sameRecordedValue} from '../../m3/w6/history-proof.mjs';
import {projectWorkoutRecords} from './project-history.mjs';
import EditHistory from './edit-history.cjs';

// Assembled privately from an authenticated generation. The public client must
// verify the same snapshot's historical signatures/standing before exposing it.
// This retains original facts and the shared accepted/local edit interpretation.
// It supplies no current authority head, full session partition or permission.
export function storedWorkoutHistory(generation,{athleteId,deviceId,prescriptionCapture,recoveryReceipts=[]}) {
  const fail=code=>{const e=new Error(code);e.state=18;e.code=code;throw e;};
  const c=generation.collections,ops=c.ops||{},indexes=c.receipts||{},proofs=new Map();
  // Private verifier result for this SAME authenticated generation. Never
  // read receipt claims from metadata, a renderer or an encrypted index alone.
  // Archive verification already compared each full original; only its small
  // position/identity tuple is carried here to avoid copying every op again.
  for(const receipt of recoveryReceipts){
    const op=ops[receipt?.op_id];
    if(!receipt||!Number.isSafeInteger(receipt.seq)||receipt.seq<1||!op||op.op_id!==receipt.op_id||
        op.athlete_id!==athleteId||op.canonical_content_commitment!==receipt.canonical_content_commitment||proofs.has(receipt.seq))fail('WORKOUT_RECOVERY_RECEIPT_INVALID');
    proofs.set(receipt.seq,{...receipt,op});
  }
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
    // Shape/domain contradictions are contained by the shared interpreter;
    // scope, typed identity and proof contradictions above remain global.
    const rejected=c.rejected?.[id],seq=accepted.get(id);
    if(rejected&&seq!==undefined)fail('WORKOUT_ACCEPTANCE_CONFLICT');
    const status=rejected?'rejected':seq!==undefined?'accepted-through-frontier':op.device_id===deviceId&&Object.hasOwn(c.outbox||{},id)?'stored-on-this-device':'stored-status-unresolved';
    // The input generation is already privately owned; normalization never
    // mutates it. Public exposure is copied after the outer context/token fence.
    rows.set(id,{operation:op,status,...(seq!==undefined?{receipt_sequence:seq}:{})});
  }
  const normalized=EditHistory.normalizeWorkoutHistory([...rows.values()],W),interpreted=new Map(normalized.records.map(r=>[r.id,r]));
  const sessions=[],byStart=new Map(),associated=new Set();
  for(const [id,row] of rows)if(row.operation.class==='session'&&row.operation.kind==='session-start'){
    const op=row.operation;let original=null;const captureIssues=[];
    if(op.schema_version===2&&Object.hasOwn(op,'prescription_capture'))try{
      original=typeof prescriptionCapture.read==='function'?prescriptionCapture.read(op.prescription_capture):
        prescriptionCapture.prepare(op.prescription_capture,{producer:op.prescription_capture.producer,basis:op.prescription_capture.basis});
    }catch{captureIssues.push('ORIGINAL_CAPTURE_UNINTERPRETABLE');}
    const session={start:row,original,records:[],capture_issues:captureIssues};sessions.push(session);byStart.set(id,session);associated.add(id);
  }
  for(const [id,row] of rows){
    if(associated.has(id)||!interpreted.has(id))continue;
    const root=rows.get(interpreted.get(id).root_id)?.operation;
    const startId=root?.kind==='session-start'?root.op_id:root?.schema_version===1?root.payload?.session_start_id:root?.session_start_op_id;
    const session=byStart.get(startId);
    if(session){session.records.push(row);associated.add(id);}
  }
  for(const session of sessions)session.projection=projectWorkoutRecords(session,ops,{normalized});
  // No timestamp/arrival sort pretends to resolve causality or competing edits.
  return {frontier:W,sessions,other_records:[...rows].filter(([id])=>!associated.has(id)&&interpreted.has(id)).map(([id,row])=>({
      ...row,...(interpreted.has(id)?{interpretation:structuredClone(interpreted.get(id))}:{})})),interpretation:'shared-typed-workout-edits',
    context_records:normalized.context_records.map(record=>({...rows.get(record.id),interpretation:structuredClone(record)})),
    continuation:{allowed:false,reason:'CURRENT_SAFETY_AND_COMPLETE_HISTORY_REQUIRED'}};
}
