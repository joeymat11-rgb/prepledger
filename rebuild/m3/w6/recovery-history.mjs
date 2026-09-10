import {StorageFailure} from './repository.mjs';
import {validateArchivedRecoveryProfile} from './recovery-profile.mjs';
import Snapshot from './recovery-snapshot.cjs';

// Historical authentication only. These records cannot establish current
// standing, renewal, permission, a recovery activation or a completed import.
export async function authenticateRecoveryArchives({generation,repository,recovery,keys,publicVerifier,athleteId,deviceId,signedOperationIds,assertContext,collectReceipts=false}){
 const proofs=generation.metadata.recoveryArchives;
 const fail=code=>{throw new StorageFailure(code,18);};
 const snapshot=generation.collections.sync?.snapshot,binding=snapshot?.recoveryPlan;
 if(proofs===undefined){if(binding!==undefined)fail('RECOVERY_SNAPSHOT_PROOF_MISSING');return [];}
 if(!Array.isArray(proofs)||!recovery?.codec||!recovery?.protocol||!recovery?.scopeDigest||typeof assertContext!=='function')fail('RECOVERY_ARCHIVE_CONFIGURATION');
 if(!proofs.length||!binding)fail('RECOVERY_SNAPSHOT_PROOF_MISSING');
 const C=recovery.codec,seen=new Set(),ops=generation.collections.ops||{};
 const receipts=collectReceipts?new Map():null;
 const protocols=recovery.protocols||[recovery.protocol];
 if(!Array.isArray(protocols)||!protocols.length||new Set(protocols.map(p=>p?.DOMAINS?.manifest)).size!==protocols.length)fail('RECOVERY_ARCHIVE_CONFIGURATION');
 for(const proof of proofs){
  assertContext();
  const current=proof.profile==='earned/local-recovery-proof/v2';
  C.exact(proof,['profile',...(current?['inventory_profile']:[]),'reference','request_bytes_b64','expected']);
  if(!current&&proof.profile!=='earned/local-recovery-proof/v1')fail('RECOVERY_ARCHIVE_PROFILE');
  const inventoryProfile=current?proof.inventory_profile:'earned/r1/rows-v3/manifest';
  if(current&&inventoryProfile!=='earned/r1/rows-v4/manifest')fail('RECOVERY_ARCHIVE_PROFILE');
  const P=protocols.find(p=>p?.DOMAINS?.manifest===inventoryProfile);
  if(!P)fail('RECOVERY_ARCHIVE_PROTOCOL_UNAVAILABLE');
  const archiveStore=repository.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:recovery.keyRange||globalThis.IDBKeyRange,
    validateContext:()=>{assertContext();return null;}});
  C.exact(proof.expected,['athleteId','actorDeviceId','scopeDigest','basisDigest']);
  const expected=proof.expected;
  if(expected.athleteId!==athleteId||expected.actorDeviceId!==deviceId||expected.scopeDigest!==recovery.scopeDigest||!C.digestValue(expected.basisDigest))fail('RECOVERY_ARCHIVE_SCOPE');
  const requestBytes=C.decode64(proof.request_bytes_b64,C.LIMITS.request),request=C.decodeRequest(requestBytes);
  if(request.mode!=='CURRENT_DEVICE')fail('RECOVERY_ARCHIVE_MODE');
  const archive=await archiveStore.openArchive(proof.reference);assertContext();
  const id=proof.reference.attempt;if(seen.has(id))fail('RECOVERY_ARCHIVE_DUPLICATE');seen.add(id);
  const profile=await validateArchivedRecoveryProfile({inventory:archive,codec:C,protocol:P,publicVerifier,requestBytes,expected,sourceCodec:recovery.sourceCodec});
  if(profile.historicalOnly!==true)fail('RECOVERY_ARCHIVE_PROFILE');assertContext();
  await profile.operations(async(op,disposition)=>{
   assertContext();const retained=ops[op.op_id];
   // Every accepted original must still be retained. Nonaccepted originals
   // remain in the archive; if represented locally, they must agree exactly.
   if(!retained&&disposition.status==='ACCEPTED')fail('RECOVERY_ARCHIVE_ORIGINAL_MISSING');
   if(retained){if(!C.fullEqual(retained,op)||op.athlete_id!==athleteId)fail('RECOVERY_ARCHIVE_ORIGINAL_CHANGED');signedOperationIds?.add(op.op_id);}
  });
  if(receipts)await profile.accepted(async row=>{
   assertContext();
   // The full original was just compared with this same generation. Carry
   // its authenticated position/identity, not another copy of the whole op.
   const receipt={seq:row.seq,op_id:row.op.op_id,canonical_content_commitment:row.op.canonical_content_commitment};
   const previous=receipts.get(row.seq);
   if(previous&&!C.fullEqual(previous,receipt))fail('RECOVERY_ARCHIVE_RECEIPT_CONFLICT');
   receipts.set(row.seq,receipt);
  });
  if(proof===proofs[proofs.length-1]){
   // Recompute through the same pinned authority reader after verifying the
   // retained signed pages. Locally encrypted derived fields are not proof.
   const sourcePlan=await profile.sourcePlan();assertContext();
   const expectedFields=Snapshot.recoveredSnapshotFields(sourcePlan,proof.reference);
   if(!C.fullEqual(snapshot,expectedFields))fail('RECOVERY_SNAPSHOT_DISAGREEMENT');
   if(!Number.isSafeInteger(generation.collections.sync.frontier?.W)||generation.collections.sync.frontier.W<sourcePlan.W)fail('RECOVERY_SNAPSHOT_DISAGREEMENT');
  }
  await profile.assertProofUnchanged();assertContext();
 }
 // No receipt is returned until every archive and the historical snapshot
 // have passed their final unchanged/current-context checks.
 return receipts?[...receipts.values()]:[];
}
