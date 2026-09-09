import {StorageFailure} from './repository.mjs';
import {validateRecoveryProfile} from './recovery-profile.mjs';
import T2 from './t2-stage.cjs';

// Internal consumer of a snapshot authenticated by public-client. This handle
// compares evidence and assembles an inactive candidate only; it cannot publish,
// drain the active queue, re-sign or activate anything.
export function createLocalRecoveryBasis({snapshot,repository,namespace,athleteId,deviceId,codec:C,protocol:P,scopeDigest,publicVerifier,assertContext}) {
  const saved=structuredClone(snapshot), collections=saved.generation.collections;
  const fail=code=>{throw new StorageFailure(code,18);};
  if(!C.digestValue(scopeDigest)||typeof assertContext!=='function')fail('LOCAL_RECOVERY_CONTEXT');
  const basisDigest=C.hash('earned/local-recovery-basis/v1',C.encode([namespace,athleteId,deviceId,saved.revision,saved.token]));
  const own=(object,key)=>Object.hasOwn(object||{},key), ops=collections.ops||{}, outbox=collections.outbox||{};
  const claims=[], leases=[], leaseIds=new Set();let minimumRequestBytes=0;
  for(const id of Object.keys(outbox)) {
    const entry=outbox[id], op=ops[id];
    if(!op||entry?.op_id!==id||op.op_id!==id||op.athlete_id!==athleteId||op.device_id!==deviceId||own(collections.rejected,id))fail('LOCAL_OUTBOX_INTEGRITY');
    const envelope=C.encode(op);
    if(envelope.length>C.LIMITS.request)fail('LOCAL_RECOVERY_REQUEST_LIMIT');
    const claim={claim_id:'local-'+claims.length,envelope_b64:C.encode64(envelope)};
    minimumRequestBytes+=C.encode(claim).length;
    if(minimumRequestBytes>C.LIMITS.request)fail('LOCAL_RECOVERY_REQUEST_LIMIT');
    claims.push(claim);
    if(!leaseIds.has(op.lease_id)){leaseIds.add(op.lease_id);leases.push({source_device_id:deviceId,lease_id:op.lease_id});}
  }
  async function assertCurrent(){
    assertContext();
    const current=await repository.load();assertContext();
    if(current.revision!==saved.revision||current.token!==saved.token)fail('LOCAL_RECOVERY_CHANGED');
  }
  const request=({nonce,contextId})=>{
    assertContext();
    const value={version:C.REQUEST_VERSION,mode:'CURRENT_DEVICE',nonce,context_id:contextId,claims:structuredClone(claims),requested_lease_ids:structuredClone(leases)};
    const bytes=C.encode(value);if(bytes.length>C.LIMITS.request)fail('LOCAL_RECOVERY_REQUEST_LIMIT');
    C.decodeRequest(bytes);return value;
  };
  function expected(req){
    assertContext();
    C.validateRequest(req);
    if(req.mode!=='CURRENT_DEVICE'||!C.fullEqual(req.claims,claims)||!C.fullEqual(req.requested_lease_ids,leases))fail('LOCAL_RECOVERY_CLAIMS_CHANGED');
    return {athleteId,actorDeviceId:deviceId,scopeDigest,basisDigest,nonce:req.nonce,contextId:req.context_id,requestDigest:C.hash('request',C.encode(req)),claimSetDigest:P.hash('claims',req.claims),mode:req.mode};
  }
  async function reconcile({inventory,requestBytes,signal}){
    requestBytes=C.bytes(requestBytes); // Own the exact verified request before any await.
    await assertCurrent();const req=C.decodeRequest(requestBytes), context=expected(req);
    const profile=await validateRecoveryProfile({inventory,codec:C,protocol:P,publicVerifier,requestBytes,expected:context,signal});
    const check=async()=>{await profile.assertCurrent();await assertCurrent();await profile.assertCurrent();};
    const raw=async id=>{const row=await inventory.readRow('operations',id);return row?C.parse(row.value,P.LIMITS.row):null;};
    // Every locally retained original must be accounted for, not just outbox
    // counts. Nonqueued originals cannot silently disappear from restored truth.
    for(const id of Object.keys(ops)) {
      const op=ops[id];if(op?.op_id!==id||op.athlete_id!==athleteId)fail('LOCAL_ORIGINAL_SCOPE');
      if(own(outbox,id))continue;
      const remote=await raw(id);
      if(!remote||!C.fullEqual(remote.op,op))fail('LOCAL_RETAINED_ORIGINAL_UNPROVEN');
      const disposition=collections.dispositions?.[id], rejected=collections.rejected?.[id];
      if(disposition&&['ACCEPTED','REJECTED','REJECTED_DEPENDENCY'].includes(disposition.status)&&!C.fullEqual(disposition,remote.disposition))fail('LOCAL_TERMINAL_DISAGREEMENT');
      if(rejected&&!['REJECTED','REJECTED_DEPENDENCY'].includes(remote.disposition.status))fail('LOCAL_REJECTION_DISAGREEMENT');
    }
    await profile.claims(async claim=>{
      const op=ops[claim.op_id];
      if(!own(outbox,claim.op_id)||!op||claim.requested_envelope_digest!==C.hash('operation',C.encode(op)))fail('LOCAL_RECOVERY_CLAIM_BINDING');
    });
    await profile.leases(async item=>{if(!item.issued_row)fail('LOCAL_PENDING_LEASE_UNPROVEN');});
    await check();
    async function archiveProof(){
      await check();const reference=await inventory.archiveReference();await check();
      return {profile:'earned/local-recovery-proof/v1',reference,request_bytes_b64:C.encode64(requestBytes),
        expected:{athleteId,actorDeviceId:deviceId,scopeDigest,basisDigest}};
    }
    return Object.freeze({profileVerified:true,localCompared:true,complete:false,activated:false,checkpoint:false,sourceRevision:saved.revision,
      assertCurrent:check,
      archiveProof,
      async assemble(){
        await check();
        await profile.claims(claim=>{
          assertContext();
          if(claim.outcome==='ENVELOPE_MISMATCH')fail('RECOVERY_EXPLICIT_RESTORE_REQUIRED');
          if(claim.outcome==='IDENTITY_CONFLICT')fail('RECOVERY_IDENTITY_CONFLICT');
        });
        const proof=await archiveProof(),summary=await profile.summary();
        const candidate=await T2.prepareRecoveryProjection(saved.generation,{equal:C.fullEqual,fail,assertContext,
          operations:profile.operations,accepted:profile.accepted,W:summary.W,athleteId,archiveProof:proof});
        await check();
        return Object.freeze({assembled:true,projectionPending:true,complete:false,activated:false,checkpoint:false,
          sourceRevision:saved.revision,assertCurrent:check,
          async inspect(visitor){
            if(typeof visitor!=='function')throw TypeError('An inactive candidate consumer is required');
            await check();await visitor(structuredClone(candidate));await check();
          }});
      },
      async pending(visitor){
        if(typeof visitor!=='function')throw TypeError('A staged comparison consumer is required');await check();
        await profile.claims(async(claim,history)=>{
          await check();const remote=claim.stored_operation_row?C.parse(claim.stored_operation_row.value,P.LIMITS.row):null;
          // Terminal eligibility is not a drain. Mismatch requires the existing
          // explicit restore/review path; identity conflicts choose no winner.
          const action=claim.outcome==='KNOWN_TERMINAL'?'TERMINAL_EVIDENCE':claim.outcome==='KNOWN_WAITING'?'RETAIN_WAITING':claim.outcome==='UNKNOWN_AT_SNAPSHOT'?'RETAIN_UNACKNOWLEDGED':claim.outcome==='ENVELOPE_MISMATCH'?'EXPLICIT_RESTORE_REQUIRED':'IDENTITY_CONFLICT';
          const checkedHistory=async visit=>{await check();await history(visit);await check();};
          await visitor({op_id:claim.op_id,action,outcome:claim.outcome,original:structuredClone(ops[claim.op_id]),outboxEntry:structuredClone(outbox[claim.op_id]),authorityOperation:remote?structuredClone(remote.op):null,disposition:remote?structuredClone(remote.disposition):null},checkedHistory);
          await check();
        });await check();
      }
    });
  }
  return Object.freeze({sourceRevision:saved.revision,basisDigest,request,expected,assertCurrent,reconcile});
}
