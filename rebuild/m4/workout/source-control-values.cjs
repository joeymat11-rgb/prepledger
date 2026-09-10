'use strict';
// Internal values for the complete future profile, not a registered dispatcher.
// These predicates preserve the actual R1 source identifier/digest domains.
const V=require('./edit-values.cjs');
const identifier=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(x);
// Canonical unpadded base64url of exactly32 bytes; the final2 unused bits are0.
const digest=x=>typeof x==='string'&&x.length===43&&/^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/.test(x);
function validate(op){
 // Caller supplies the descriptor-safe closed common-envelope copy.
 if(!identifier(op.op_id)||!op.causal_parents.every(identifier)||
  !(op.device_predecessor_op_id===null||identifier(op.device_predecessor_op_id)))return false;
 const p=op.payload,rollback=p?.type==='source-rollback-intent';
 if(!V.exact(p,['type','interval','source_id','material_digest',...(rollback?['target_activation_id']:[])])||
  !['source-import-intent','source-rollback-intent'].includes(p.type)||!identifier(p.source_id)||!digest(p.material_digest)||
  rollback&&!identifier(p.target_activation_id))return false;
 // Accepted U-1 declared spelling, with the unchanged shared effective domain.
 if(!V.effective(op.effective))return false;
 const point=op.effective.local_date+'T'+op.effective.local_time+op.effective.utc_offset;
 return V.exact(p.interval,['start','end'])&&p.interval.start===point&&p.interval.end===point;
}
module.exports={validate};
