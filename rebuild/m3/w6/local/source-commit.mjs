import {localSourceCommitCapability} from './source-admission.mjs';
export async function commitLocalSource(handle){
 const capability=localSourceCommitCapability(handle);
 await capability.assertCurrent();
 if(capability.guard()){const e=new Error('LOCAL_SOURCE_STALE');e.code=e.message;throw e;}
 try{await capability.publish();}
 catch(error){
  // A completed transaction can lose its acknowledgment. Reconciliation only
  // accepts the exact durable selection/marker; an aborted CAS cannot match it.
  try{return await capability.reconcile();}catch{throw error;}
 }
 return capability.reconcile();
}
