import W5 from "../w5/public-client.cjs";
import { createBridge } from "./bridge.mjs";
import { StorageFailure } from "./repository.mjs";
import { createLocalRecoveryBasis } from "./recovery-local.mjs";
import { authenticateRecoveryArchives } from "./recovery-history.mjs";
import { createCandidateGrant } from "./candidate-grant.mjs";
import Canonical from "../../authority/canonical.cjs";
import { verifyHistoricalHead, sameRecordedValue } from "./history-proof.mjs";
import WorkoutSchema from "../../m4/workout/schema.cjs";
import {storedWorkoutHistory} from "../../m4/workout/stored-history.mjs";
import {workoutContinuation} from "../../m4/workout/continuation.mjs";
import WorkoutCommands from "../../m4/workout/commands.cjs";
const copy = value => structuredClone(value);
const refusal = (state, code, reason) => ({ stored: false, durable: false, state, code, reason });
const reasonFor = state => ({ 17: "This installation needs sign-in or enrollment recovery.", 18: "Stored truth needs recovery before it can be used.",
  19: "A rejected update needs durable recovery.", 20: "The write allowance needs a verified reconnect." }[state] || "The update was not durably stored.");

// No production observation/fence policy is supplied here. The owner must inject
// a reviewed guard covering verification through durable outcome; tests label theirs synthetic.
export function createDurablePublicClient({ repository, stage, namespace, athleteId, deviceId, sessionEpoch,
  isCurrentSession, observationEpoch, observationGuard, validateCommit, keys, subtle, crypto, monotonicMs,
  maxTimeRoundTripMs, schemaVersion = 1, permissionNowIso, workoutProducer, workoutProducerIdentity,
  resolveWorkoutBasis, prescriptionCapture, recovery, workoutResumePolicy } = {}) {
  if (!repository || typeof stage !== "function" || !namespace || !athleteId || !deviceId || sessionEpoch === undefined ||
      typeof isCurrentSession !== "function" || typeof observationEpoch !== "function" || typeof observationGuard?.run !== "function" || typeof validateCommit !== "function") throw new TypeError("Explicit durable client scope, staging, observation guard and validator required");
  const verifier = W5.createPublicVerifier({ keys, subtle });
  let tail = Promise.resolve(), activeProof = null, activeGrant = null, activeContext = null, visibleEpoch = null, lateRefusal = null, timeInFlight = false;
  let historyAttempt = null, activeHead = null;
  const captureEnabled = [workoutProducer, workoutProducerIdentity, resolveWorkoutBasis, prescriptionCapture].some(x => x !== undefined);
  if (captureEnabled && (typeof workoutProducer !== "function" || typeof resolveWorkoutBasis !== "function" ||
      typeof prescriptionCapture?.prepare !== "function" || !workoutProducerIdentity || schemaVersion !== 2))
    throw new TypeError("Complete static workout preparation configuration required");
  const producerIdentity = captureEnabled ? copy(workoutProducerIdentity) : null;
  if(workoutResumePolicy!==undefined&&(!captureEnabled||typeof workoutResumePolicy!=='function'))throw new TypeError('Static workout resume policy requires capture configuration');
  const resumptions=new Map();let activeResume=null;
  const workoutEdits=new Map();let activeEdit=null;
  const resumeCommands=WorkoutCommands.createWorkoutCommands();
  const preparations = new Map(); let activeWorkout = null, unresolvedWorkout = null, preparationEpoch = 0;
  const current = () => isCurrentSession(sessionEpoch) === true;
  const enqueue = action => { const task = tail.then(action); tail = task.catch(() => {}); return task; };
  function contextFailure(epoch) {
    try {
      if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
      if (epoch !== null && epoch !== observationEpoch()) return refusal(18, "OBSERVATION_CHANGED", reasonFor(18));
      return null;
    } catch { return refusal(18, "CONTEXT_UNPROVEN", reasonFor(18)); }
  }
  function completedOutcome(result) {
    const changed = contextFailure(activeContext?.observationEpoch ?? null);
    if (changed && result.durableRevision) {
      lateRefusal = { ...changed, stored: true, durable: true, confirmed: false, acknowledged: false, committed: true, committedRevision: result.durableRevision };
      return lateRefusal; // Disk committed; the changed context receives no Saved result or old truth.
    }
    if (result.durableRevision) visibleEpoch = activeContext?.observationEpoch ?? null;
    return result;
  }
  async function verifiedHistory(generation, signedOperationIds = null) {
    const epoch=observationEpoch();
    await authenticateRecoveryArchives({generation,repository,recovery,keys,publicVerifier:verifier,athleteId,deviceId,signedOperationIds,
      assertContext:()=>{const changed=contextFailure(epoch)||lateRefusal;if(changed)throw new StorageFailure(changed.code,changed.state);}});
    const families = generation.metadata.wireProofs || {};
    const methods = { disposition: "verifyDisposition", pull: "verifyPull", snapshot: "verifySnapshot", lease: "verifyLease", time: "verifyServerTime", currentHead: "verifyCurrentHead" };
    for (const [kind, records] of Object.entries(families)) {
      if (!Object.hasOwn(methods, kind)) return false;
      const method = methods[kind];
      if (!method || !records || typeof records !== "object" || Array.isArray(records)) return false;
      for (const record of Object.values(records)) {
        if (kind === "currentHead") {
          if (!await verifyHistoricalHead(verifier, record, athleteId, deviceId)) return false;
          if (signedOperationIds) for (const receipt of record.receipts) {
            const retained = generation.collections.ops?.[receipt.op_id];
            if (!retained || !sameRecordedValue(retained, receipt.op)) return false;
            signedOperationIds.add(receipt.op_id);
          }
          continue;
        }
        if (!await verifier[method](record)) return false;
        if (kind !== "disposition" && (record.athlete_id !== athleteId || record.device_id !== deviceId)) return false;
        if (kind === "disposition") {
          const op = generation.collections.ops?.[record.op_id];
          if (!op || op.athlete_id !== athleteId || op.device_id !== deviceId || record.device_id !== deviceId || record.device_seq !== op.device_seq || record.canonical_content_commitment !== op.canonical_content_commitment) return false;
        }
        if (kind === "pull" || kind === "snapshot") {
          const receipts = kind === "pull" ? record.receipts : record.entries;
          if (!Array.isArray(receipts)) return false;
          for (const receipt of receipts) {
            if (!await verifier.verifyReceipt(receipt) || receipt.op?.athlete_id !== athleteId) return false;
            // T2 persists an index (op_id/commitment), not receipt.op. Original
            // signed proof is retained separately; its acknowledged fact must
            // still exist exactly in the authenticated operation collection.
            const retained = generation.collections.ops?.[receipt.op_id];
            if (!retained || !sameRecordedValue(retained, receipt.op)) return false;
            signedOperationIds?.add(receipt.op_id);
          }
        }
      }
    }
    return true;
  }
  function headFailure(context) {
    if (context.command === "@currentHead") {
      const original = activeHead;
      if (!original || historyAttempt !== original || context.snapshotRevision !== original.clientRevision ||
          context.observationEpoch !== original.observationEpoch)
        return refusal(18, "CURRENT_HEAD_BASIS_CHANGED", reasonFor(18));
    }
    return null;
  }
  const workoutRefusal = code => ({ acknowledged: false, state: 3, code,
    ...(["WORKOUT_START_OUTCOME_UNRESOLVED", "WORKOUT_START_UNRESOLVED"].includes(code) ? { outcomeUnknown: true } : {}),
    copy: "Start not confirmed. Your input is retained; resolve the indicated condition before trying again." });
  const capturedStart = context => context.batch?.operations?.some(op => op.kind === "session-start" && Object.hasOwn(op, "prescription_capture")) === true;
  function workoutHistoryFailure(generation) {
    // Negative guard over authenticated retained facts, not a resume projection or
    // permission to ignore another device/legacy history. No instance-local flag
    // can substitute for this read after reload. The existing revision+token CAS
    // binds the preparation to this exact generation through durable Start.
    const ops = generation.collections.ops || {}, rejected = generation.collections.rejected || {};
    const needsHistory = () => ({ ...workoutRefusal("WORKOUT_HISTORY_RECONCILIATION_REQUIRED"),
      copy: "A saved workout needs to be recovered before starting another. No new workout was created." });
    const closedAfter = new Map();
    for (const op of Object.values(ops)) if (op.kind === "session-close" && op.athlete_id === athleteId &&
      op.device_id === deviceId && !rejected[op.op_id] && WorkoutSchema.validateWorkoutShape(op).valid)
      closedAfter.set(op.session_start_op_id, Math.max(closedAfter.get(op.session_start_op_id) || 0, op.device_seq));
    for (const receipt of Object.values(generation.collections.receipts || {})) {
      const op = receipt.op;
      if (op?.kind === "session-start" && (!ops[op.op_id] || !sameRecordedValue(ops[op.op_id], op))) return needsHistory();
    }
    for (const start of Object.values(ops)) {
      if (start.kind !== "session-start") continue;
      if (start.athlete_id !== athleteId) return { ...needsHistory(), state: 18 };
      if (rejected[start.op_id]) return { ...needsHistory(), state: 19 };
      // Legacy/other-device history needs the separately qualified projection;
      // missing legacy capture is not itself corrupt storage (state 18).
      if (start.device_id !== deviceId || start.schema_version !== 2) return needsHistory();
      if (!(closedAfter.get(start.op_id) > start.device_seq)) return needsHistory();
    }
    return null;
  }
  function workoutFailure(context) {
    if (!captureEnabled || context.command !== "workout" || context.args?.action !== "start")
      return capturedStart(context) ? workoutRefusal("WORKOUT_PREPARATION_REQUIRED") : null;
    const entry = activeWorkout;
    if (!entry || entry.retired || entry.phase !== "starting") return workoutRefusal("WORKOUT_PREPARATION_REQUIRED");
    if (context.snapshotRevision !== entry.revision || context.snapshotToken !== entry.token ||
        context.sessionEpoch !== entry.sessionEpoch || context.observationEpoch !== entry.observationEpoch)
      return workoutRefusal("WORKOUT_PREPARATION_STALE");
    const operations = context.batch?.operations, op = operations?.[0];
    if (operations?.length !== 1 || op.kind !== "session-start" || op.planned_split_slot_id !== entry.plannedSlot ||
        op.plan_basis !== entry.capture.basis.plan_basis ||
        JSON.stringify(op.prescription_capture) !== JSON.stringify(entry.capture) ||
        JSON.stringify(op.causal_parents) !== JSON.stringify(entry.parents))
      return workoutRefusal("WORKOUT_PREPARATION_MISMATCH");
    entry.operation = copy(op); // Known before the write; needed if the reply is lost.
    return null;
  }
  function resumeFailure(context){
    const entry=activeResume;if(!entry)return null;
    if(entry.retired||context.snapshotRevision!==entry.revision||context.snapshotToken!==entry.token||
      context.sessionEpoch!==entry.sessionEpoch||context.observationEpoch!==entry.observationEpoch)return workoutRefusal('WORKOUT_RESUME_STALE');
    const op=context.batch?.operations?.[0],kind={set:'session-set',skip:'session-skip',close:'session-close'}[entry.args.action];
    if(context.command!=='workout'||context.batch?.operations?.length!==1||!op||op.kind!==kind||
      op.session_start_op_id!==entry.startId||!sameRecordedValue(context.args,entry.args))return workoutRefusal('WORKOUT_RESUME_COMMAND_MISMATCH');
    if(entry.args.action!=='close'&&(op.logical_set_slot!==entry.args.input.logical_set_slot||op.lift_lineage_id!==entry.args.input.lift_lineage_id))return workoutRefusal('WORKOUT_RESUME_COMMAND_MISMATCH');
    const spec=entry.spec;
    if(op.class!==spec.class||!sameRecordedValue(op.payload,spec.payload)||Object.entries(spec.extra).some(([key,value])=>!sameRecordedValue(op[key],value))||
      spec.effective&&!sameRecordedValue(op.effective,spec.effective)||spec.parents&&!sameRecordedValue(op.causal_parents,spec.parents))return workoutRefusal('WORKOUT_RESUME_COMMAND_MISMATCH');
    return null;
  }
  function editFailure(context){
    const entry=activeEdit;if(!entry)return null;
    if(entry.retired||context.snapshotRevision!==entry.revision||context.snapshotToken!==entry.token||
      context.sessionEpoch!==entry.sessionEpoch||context.observationEpoch!==entry.observationEpoch)return workoutRefusal('WORKOUT_EDIT_STALE');
    const op=context.batch?.operations?.[0],spec=entry.spec;
    if(context.command!=='workout'||context.batch?.operations?.length!==1||!op||!sameRecordedValue(context.args,entry.args)||
      op.class!==spec.class||op.kind!==spec.kind||op.target_op_id!==entry.targetId||op.lift_lineage_id!==entry.lineage||
      !sameRecordedValue(op.payload,spec.payload)||!sameRecordedValue(op.causal_parents,entry.parents))return workoutRefusal('WORKOUT_EDIT_COMMAND_MISMATCH');
    entry.operation=copy(op);return null;
  }
  const bridge = createBridge({ repository, validateCommit(context) {
    const failure = contextFailure(context.observationEpoch) || headFailure(context); if (failure) return failure;
    const decision = validateCommit(context);
    // The downstream synchronous validator can itself learn adverse context.
    // Recheck the captured head immediately before returning permission to IDB.
    return decision || (activeEdit&&(contextFailure(context.observationEpoch)||editFailure(context))) || (activeResume&&(contextFailure(context.observationEpoch)||resumeFailure(context))) || (context.command === "@currentHead" && (contextFailure(context.observationEpoch) || headFailure(context))) ||
      ((capturedStart(context) || captureEnabled && context.command === "workout" && context.args?.action === "start") &&
        (contextFailure(context.observationEpoch) || workoutFailure(context))) || decision;
  }, stage: stageVerified });
  async function stageVerified(generation, command, args, { authenticateLocalHistory = false, requireCurrentProjection = false } = {}) {
    activeGrant?.retire(); activeGrant = null;
    if (!current()) throw new StorageFailure("SESSION_CHANGED", 17);
    const epoch = observationEpoch();
    const signedOperationIds = authenticateLocalHistory ? new Set() : null;
    if (!await verifiedHistory(generation, signedOperationIds)) throw new StorageFailure("HISTORICAL_PROOF_UNPROVEN", 18);
    // Authenticate history first; a restored historical snapshot cannot grant
    // a current prescription. A qualified projection/publish join is still
    // required. History reads and performed-fact corrections do not require
    // a current projection.
    if (requireCurrentProjection && generation.collections.sync?.snapshot?.recoveryPlan?.profile === "earned/recovered-plan-snapshot/v1")
      throw new StorageFailure("RECOVERY_PROJECTION_REQUIRED", 18);
    if (command === "@currentHead") {
      if (!activeHead || historyAttempt !== activeHead || epoch !== activeHead.observationEpoch)
        throw new StorageFailure("CURRENT_HEAD_BASIS_CHANGED", 18);
      for (const receipt of activeProof.record.receipts) {
        const retained = generation.collections.ops?.[receipt.op_id];
        if (retained && !sameRecordedValue(retained, receipt.op)) throw new StorageFailure("CURRENT_HEAD_RECORD_CONFLICT", 18);
      }
    }
    const lease = copy(command === "@lease" ? activeProof?.record : generation.metadata.authorityLease);
    if (!lease || !await verifier.verifyLease(lease) || lease.athlete_id !== athleteId || lease.device_id !== deviceId || lease.schema_version !== schemaVersion) throw new StorageFailure("LEASE_PROOF_UNPROVEN", 18);
    if (command === "@lease" && generation.metadata.authorityLease && Canonical.canonicalEncode(lease) !== Canonical.canonicalEncode(generation.metadata.authorityLease)) throw new StorageFailure("LEASE_RENEWAL_UNIMPLEMENTED", 18);
    let expectedOperation = null, disposition = null;
    if (command === "@disposition") {
      disposition = copy(activeProof.record); expectedOperation = copy(generation.collections.ops?.[disposition.op_id]);
      if (!expectedOperation || !await verifier.verifyDisposition(disposition)) throw new StorageFailure("DISPOSITION_PROOF_UNPROVEN", 18);
    }
    const scope = { namespace, athleteId, deviceId, sessionEpoch, observationEpoch: epoch };
    activeContext = scope;
    activeGrant = createCandidateGrant({ lease, disposition, expectedOperation, scope, isCurrent: () => current() && epoch === observationEpoch() });
    const grant = activeGrant;
    const config = { authorityKey: undefined, lease, authorityVerification: { verifyLease: grant.verifyLease, verifyDisposition: grant.verifyDisposition } };
    if (permissionNowIso !== undefined) {
      let sample;
      try { sample = permissionNowIso(); } catch { sample = undefined; }
      config.permissionNowIso = () => sample;
    }
    const candidate = copy(stage(generation, command, args, { config, record: activeProof?.record, proof: activeProof?.proof,
      ...(signedOperationIds ? { historyAuthentication: { signedOperationIds: [...signedOperationIds] } } : {}) }));
    // The configured/verifying schema is not evidence of the actual writer's schema.
    // Inspect the immutable candidate before any sealing, durable write or Saved.
    if (candidate.result?.acknowledged === true && candidate.commit?.kind === "local-operation" &&
        Array.isArray(candidate.commit.batch?.operations) &&
        candidate.commit.batch.operations.some(op => op.schema_version !== lease.schema_version)) {
      const failure = contextFailure(epoch);
      if (failure) throw new StorageFailure(failure.code, failure.state);
      throw new StorageFailure("OPERATION_SCHEMA_MISMATCH", 20);
    }
    return { ...candidate, context: { namespace, sessionEpoch, observationEpoch: epoch } };
  }
  function closedInput(value, required, optional = []) {
    if (!value || typeof value !== "object" || Array.isArray(value) ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new StorageFailure("WORKOUT_INPUT_INVALID", 3);
    const descriptors = Object.getOwnPropertyDescriptors(value), names = Reflect.ownKeys(value);
    if (names.some(k => typeof k !== "string" || ![...required, ...optional].includes(k) ||
        !Object.hasOwn(descriptors[k], "value") || !descriptors[k].enumerable) || required.some(k => !Object.hasOwn(descriptors, k)))
      throw new StorageFailure("WORKOUT_INPUT_INVALID", 3);
    return Object.fromEntries(names.map(k => [k, descriptors[k].value]));
  }
  async function prepareWorkoutContinuation(request,lifetime){
    try{
      for(const entry of resumptions.values())entry.retired=true;resumptions.clear();
      if(typeof workoutResumePolicy!=='function')return workoutRefusal('WORKOUT_RESUME_POLICY_UNAVAILABLE');
      if(lateRefusal)return {...lateRefusal,prepared:false};
      const failure=contextFailure(null);if(failure)return {...failure,prepared:false};
      if(lifetime!==preparationEpoch)return workoutRefusal('WORKOUT_PREPARATION_RETIRED');
      const input=closedInput(request,['session_start_op_id']);
      if(typeof input.session_start_op_id!=='string'||!input.session_start_op_id.trim())throw new StorageFailure('WORKOUT_INPUT_INVALID',3);
      const snapshot=await repository.load(),candidate=await stageVerified(copy(snapshot.generation),null,null,{authenticateLocalHistory:true,requireCurrentProjection:true});
      if(!candidate.view||candidate.result?.state)return {...candidate.result,prepared:false};
      const history=storedWorkoutHistory(snapshot.generation,{athleteId,deviceId,prescriptionCapture});
      const resumed=workoutContinuation(history,snapshot.generation,input.session_start_op_id);
      const resolved=closedInput(resolveWorkoutBasis(copy(snapshot.generation),{planned_split_slot_id:resumed.planned_split_slot_id}),['plan_basis','input_basis','causal_parents']);
      const basis={plan_basis:resolved.plan_basis,input_basis:resolved.input_basis,source_revision:snapshot.revision};
      // Trusted configured producer, never a renderer-supplied clearance flag.
      // Its science/input qualification remains an independent first-use gate.
      const decision=closedInput(workoutResumePolicy(copy(snapshot.generation),{...copy(resumed),producer:copy(producerIdentity),basis:copy(basis)}),['allowed_actions','reason','current_capture']);
      if(!Array.isArray(decision.allowed_actions)||new Set(decision.allowed_actions).size!==decision.allowed_actions.length||
        !decision.allowed_actions.every(a=>['set','skip','close'].includes(a))||typeof decision.reason!=='string'||!decision.reason.trim())throw new StorageFailure('WORKOUT_RESUME_POLICY_INVALID',3);
      const currentCapture=prescriptionCapture.prepare(decision.current_capture,{producer:producerIdentity,basis});
      if(currentCapture.slots.length!==resumed.slots.length||currentCapture.slots.some((s,i)=>s.logical_set_slot!==resumed.slots[i].logical_set_slot||s.lift_lineage_id!==resumed.slots[i].lift_lineage_id))throw new StorageFailure('WORKOUT_RESUME_SLOT_MAPPING_REQUIRED',3);
      const changed=contextFailure(candidate.context.observationEpoch);if(changed)return {...changed,prepared:false};
      const latest=await repository.load();if(latest.revision!==snapshot.revision||latest.token!==snapshot.token)return workoutRefusal('WORKOUT_RESUME_STALE');
      const last=contextFailure(candidate.context.observationEpoch);if(last)return {...last,prepared:false};
      if(lifetime!==preparationEpoch)return workoutRefusal('WORKOUT_PREPARATION_RETIRED');
      const id=Array.from((crypto||globalThis.crypto).getRandomValues(new Uint8Array(24)),b=>b.toString(16).padStart(2,'0')).join('');
      if(resumptions.has(id))throw new StorageFailure('WORKOUT_HANDLE_COLLISION',3);
      resumptions.set(id,{revision:snapshot.revision,token:snapshot.token,...copy(candidate.context),startId:input.session_start_op_id,
        resumed:copy(resumed),allowed:decision.allowed_actions.slice(),retired:false});
      return {prepared:true,resumeId:id,view:{...copy(resumed),current:copy(currentCapture),allowed_actions:decision.allowed_actions.slice(),current_reason:decision.reason}};
    }catch(error){const changed=contextFailure(null);if(changed)return {...changed,prepared:false};return {...workoutRefusal(error.code||'WORKOUT_RESUME_UNAVAILABLE'),state:error.state||3};}
    finally{activeGrant?.retire();activeGrant=null;}
  }
  async function prepareWorkoutEdit(request,lifetime){
    try{
      for(const entry of workoutEdits.values())entry.retired=true;workoutEdits.clear();
      if(!captureEnabled)return workoutRefusal('WORKOUT_PREPARATION_NOT_CONFIGURED');
      const failure=contextFailure(null)||lateRefusal;if(failure)return {...failure,prepared:false};
      if(lifetime!==preparationEpoch)return workoutRefusal('WORKOUT_PREPARATION_RETIRED');
      const input=closedInput(request,['target_op_id']);if(typeof input.target_op_id!=='string'||!input.target_op_id.trim())throw new StorageFailure('WORKOUT_INPUT_INVALID',3);
      const snapshot=await repository.load(),candidate=await stageVerified(copy(snapshot.generation),null,null,{authenticateLocalHistory:true});
      if(!candidate.view||candidate.result?.state)return {...candidate.result,prepared:false};
      const history=storedWorkoutHistory(snapshot.generation,{athleteId,deviceId,prescriptionCapture});
      if(snapshot.generation.collections.sync?.frontier?.authorityW!==history.frontier)throw new StorageFailure('WORKOUT_EDIT_PREFIX_INCOMPLETE',18);
      const session=history.sessions.find(s=>s.projection.facts.some(f=>f.source_op_id===input.target_op_id));
      const fact=session?.projection.facts.find(f=>f.source_op_id===input.target_op_id);
      if(!fact)throw new StorageFailure('WORKOUT_EDIT_TARGET_UNAVAILABLE',3);
      if(fact.source_status==='rejected')throw new StorageFailure('WORKOUT_EDIT_TARGET_REJECTED',19);
      // A known exact fact can be corrected/removed even when another fact uses
      // its slot. This does not resolve the slot or award workout eligibility.
      if(fact.included!==true||fact.issues.some(code=>code!=='SET_SLOT_RESOLUTION_REQUIRED')||!fact.current)throw new StorageFailure('WORKOUT_EDIT_INTERPRETATION_REQUIRED',3);
      const changed=contextFailure(candidate.context.observationEpoch);if(changed)return {...changed,prepared:false};
      const latest=await repository.load();if(latest.revision!==snapshot.revision||latest.token!==snapshot.token)return workoutRefusal('WORKOUT_EDIT_STALE');
      const finalFailure=contextFailure(candidate.context.observationEpoch);if(finalFailure)return {...finalFailure,prepared:false};
      if(lifetime!==preparationEpoch)return workoutRefusal('WORKOUT_PREPARATION_RETIRED');
      const id=Array.from((crypto||globalThis.crypto).getRandomValues(new Uint8Array(24)),b=>b.toString(16).padStart(2,'0')).join('');
      const parents=[input.target_op_id,...fact.edit_op_ids];
      workoutEdits.set(id,{revision:snapshot.revision,token:snapshot.token,...copy(candidate.context),targetId:input.target_op_id,
        lineage:fact.lift_lineage_id,parents,retired:false,operation:null});
      const slot=session.original?.slots.find(s=>s.logical_set_slot===fact.logical_set_slot&&s.lift_lineage_id===fact.lift_lineage_id);
      return {prepared:true,editId:id,view:{target_op_id:input.target_op_id,session_start_op_id:session.start.operation.op_id,
        logical_set_slot:fact.logical_set_slot,lift_lineage_id:fact.lift_lineage_id,label:slot?.label||'Recorded set',
        original:copy(fact.original),current:copy(fact.current),edit_op_ids:fact.edit_op_ids.slice()}};
    }catch(error){const failure=contextFailure(null);if(failure)return {...failure,prepared:false};return {...workoutRefusal(error.code||'WORKOUT_EDIT_UNAVAILABLE'),state:error.state||3};}
    finally{activeGrant?.retire();activeGrant=null;}
  }
  async function commitWorkoutEdit(request){
    let entry;
    try{
      const input=closedInput(request,['editId','action','change']);entry=workoutEdits.get(input.editId);
      if(!entry||entry.retired)return workoutRefusal('WORKOUT_EDIT_REQUIRED');entry.retired=true;workoutEdits.delete(input.editId);
      const failure=contextFailure(entry.observationEpoch)||lateRefusal;if(failure)return {...failure,acknowledged:false};
      if(!['correct','remove'].includes(input.action))return workoutRefusal('WORKOUT_INPUT_INVALID');
      const values={target_op_id:entry.targetId,lift_lineage_id:entry.lineage,causal_parents:entry.parents.slice(),
        ...(input.action==='correct'?{replacement_fields:input.change}:{reason:input.change})};
      entry.args={action:input.action,input:values};entry.spec=resumeCommands.prepare(entry.args);entry.retired=false;activeEdit=entry;
      let result=completedOutcome(await bridge.execute('workout',entry.args));
      if(result.acknowledged!==true&&entry.operation&&!['TRANSACTION_ABORTED','TRANSACTION_WRITE_FAILED'].includes(result.code))result={...result,outcomeUnknown:true};
      return result;
    }catch(error){return {...workoutRefusal(error.code||'WORKOUT_EDIT_UNAVAILABLE'),state:error.state||3,...(entry?.operation?{outcomeUnknown:true}:{})};}
    finally{if(entry)entry.retired=true;activeEdit=null;activeGrant?.retire();activeGrant=null;}
  }
  async function executeResumedWorkout(request){
    let entry;
    try{
      const input=closedInput(request,['resumeId','action','input']);entry=resumptions.get(input.resumeId);
      if(!entry||entry.retired)return workoutRefusal('WORKOUT_RESUME_REQUIRED');
      entry.retired=true;resumptions.delete(input.resumeId); // One command attempt per prepared context.
      const failure=contextFailure(entry.observationEpoch)||lateRefusal;if(failure)return {...failure,acknowledged:false};
      if(!entry.allowed.includes(input.action))return workoutRefusal('WORKOUT_CURRENT_SAFETY_REFUSES');
      const values=copy(input.input);if(!values||values.session_start_op_id!==entry.startId)return workoutRefusal('WORKOUT_RESUME_COMMAND_MISMATCH');
      if(input.action==='set'||input.action==='skip'){
        const slot=entry.resumed.slots.find(s=>s.logical_set_slot===values.logical_set_slot&&s.lift_lineage_id===values.lift_lineage_id);
        if(!slot||slot.completion||input.action==='skip'&&values.skip_scope!=='set')return workoutRefusal('WORKOUT_RESUME_SLOT_UNAVAILABLE');
      }else if(input.action==='close'){
        if(values.completion_kind==='normal'&&entry.resumed.slots.some(s=>!s.completion))return workoutRefusal('WORKOUT_RESUME_INCOMPLETE');
      }else return workoutRefusal('WORKOUT_RESUME_COMMAND_MISMATCH');
      entry.args={action:input.action,input:values};entry.spec=resumeCommands.prepare(entry.args);entry.retired=false;activeResume=entry;
      return completedOutcome(await bridge.execute('workout',entry.args));
    }catch(error){return {...workoutRefusal(error.code||'WORKOUT_RESUME_COMMAND_UNAVAILABLE'),state:error.state||3};}
    finally{if(entry)entry.retired=true;activeResume=null;activeGrant?.retire();activeGrant=null;}
  }
  async function prepareWorkout(request, lifetime) {
    try {
      if (!captureEnabled) return workoutRefusal("WORKOUT_PREPARATION_NOT_CONFIGURED");
      if (lateRefusal) return { ...lateRefusal, acknowledged: false };
      const failure = contextFailure(null); if (failure) return { ...failure, acknowledged: false };
      if (lifetime !== preparationEpoch) return workoutRefusal("WORKOUT_PREPARATION_RETIRED");
      if (unresolvedWorkout) return workoutRefusal("WORKOUT_START_OUTCOME_UNRESOLVED");
      const input = closedInput(request, ["planned_split_slot_id"]);
      if (typeof input.planned_split_slot_id !== "string" || !input.planned_split_slot_id.trim()) throw new StorageFailure("WORKOUT_INPUT_INVALID", 3);
      const snapshot = await repository.load(), candidate = await stageVerified(copy(snapshot.generation), null, null, { requireCurrentProjection: true });
      if (!candidate.view || candidate.result?.state) return { ...candidate.result, acknowledged: false };
      const historyFailure = workoutHistoryFailure(snapshot.generation);
      if (historyFailure) return historyFailure;
      const scope = copy(candidate.context);
      const resolved = closedInput(resolveWorkoutBasis(copy(snapshot.generation), copy(input)), ["plan_basis", "input_basis", "causal_parents"]);
      const parents = copy(resolved.causal_parents);
      if (!Array.isArray(parents) || Reflect.ownKeys(parents).length !== parents.length + 1 ||
          !parents.every(x => typeof x === "string" && x.trim()) || new Set(parents).size !== parents.length)
        throw new StorageFailure("WORKOUT_BASIS_INVALID", 3);
      const basis = { plan_basis: resolved.plan_basis, input_basis: resolved.input_basis, source_revision: snapshot.revision };
      const capture = prescriptionCapture.prepare(workoutProducer(copy(snapshot.generation),
        { ...copy(input), producer: copy(producerIdentity), basis: copy(basis) }), { producer: producerIdentity, basis });
      const changed = contextFailure(scope.observationEpoch); if (changed) return { ...changed, acknowledged: false };
      if (lifetime !== preparationEpoch) return workoutRefusal("WORKOUT_PREPARATION_RETIRED");
      const bytes = (crypto || globalThis.crypto).getRandomValues(new Uint8Array(24));
      const id = Array.from(bytes, x => x.toString(16).padStart(2, "0")).join("");
      if (preparations.has(id)) throw new StorageFailure("WORKOUT_HANDLE_COLLISION", 3);
      preparations.set(id, { id, phase: "ready", retired: false, capture, parents, plannedSlot: input.planned_split_slot_id,
        revision: snapshot.revision, token: snapshot.token, sessionEpoch: scope.sessionEpoch, observationEpoch: scope.observationEpoch });
      return { prepared: true, preparedId: id, view: copy(capture) };
    } catch (error) {
      const failure = contextFailure(null); if (failure) return { ...failure, acknowledged: false };
      return { ...workoutRefusal(error instanceof StorageFailure ? error.code : "WORKOUT_PREPARATION_INVALID"), state: error instanceof StorageFailure ? error.state : 3 };
    } finally { activeGrant?.retire(); activeGrant = null; }
  }
  async function startPreparedWorkout(request) {
    let entry;
    try {
      const failure = contextFailure(null); if (failure) return { ...failure, acknowledged: false };
      if (lateRefusal) return { ...lateRefusal, acknowledged: false };
      const input = closedInput(request, ["preparedId"], ["effective"]);
      entry = preparations.get(input.preparedId);
      if (!entry || entry.retired) return workoutRefusal("WORKOUT_PREPARATION_REQUIRED");
      const changed = contextFailure(entry.observationEpoch); if (changed) return { ...changed, acknowledged: false };
      if (entry.phase === "committed" || entry.phase === "uncertain") {
        const snapshot = await repository.load();
        if (!await verifiedHistory(snapshot.generation)) throw new StorageFailure("HISTORICAL_PROOF_UNPROVEN", 18);
        const after = contextFailure(entry.observationEpoch); if (after) return { ...after, acknowledged: false };
        if (entry.retired) return workoutRefusal("WORKOUT_PREPARATION_RETIRED");
        const op = snapshot.generation.collections.ops?.[entry.operation?.op_id];
        if (!op || JSON.stringify(op) !== JSON.stringify(entry.operation)) return workoutRefusal("WORKOUT_START_OUTCOME_UNRESOLVED");
        // A committed-but-unconfirmed attempt is resolved from authenticated disk,
        // never by rebuilding/re-sending Start. Existing rejected records are not Saved.
        if (snapshot.generation.collections.rejected?.[op.op_id]) return { ...workoutRefusal("WORKOUT_START_REJECTED"), state: 19 };
        entry.phase = "committed"; if (unresolvedWorkout === entry) unresolvedWorkout = null;
        return { acknowledged: true, op_id: op.op_id, op_ids: [op.op_id], durableRevision: snapshot.revision, recovered: true };
      }
      if (unresolvedWorkout) return workoutRefusal("WORKOUT_START_OUTCOME_UNRESOLVED");
      entry.phase = "starting"; entry.operation = null; activeWorkout = entry;
      const args = { action: "start", input: { planned_split_slot_id: entry.plannedSlot, plan_basis: entry.capture.basis.plan_basis,
        prescription_capture: entry.capture, causal_parents: entry.parents, ...(Object.hasOwn(input, "effective") ? { effective: input.effective } : {}) } };
      let result = completedOutcome(await bridge.execute("workout", args));
      if (entry.retired && result.durableRevision) result = { ...workoutRefusal("WORKOUT_PREPARATION_RETIRED"),
        committed: true, committedRevision: result.durableRevision, durableRevision: result.durableRevision };
      if (result.acknowledged === true && result.durableRevision) entry.phase = "committed";
      else if (entry.operation && !["TRANSACTION_ABORTED", "TRANSACTION_WRITE_FAILED"].includes(result.code)) {
        entry.phase = "uncertain"; unresolvedWorkout = entry;
        result = { ...result, outcomeUnknown: true, copy: "Start save not confirmed. Reconcile this same preparation before another Start." };
      } else { entry.phase = "ready"; if (unresolvedWorkout === entry) unresolvedWorkout = null; }
      return result;
    } catch (error) {
      if (entry?.operation) { entry.phase = "uncertain"; unresolvedWorkout = entry; }
      else if (entry) entry.phase = "ready";
      return { ...workoutRefusal(error instanceof StorageFailure ? error.code : "WORKOUT_START_UNRESOLVED"), state: error instanceof StorageFailure ? error.state : 3,
        ...(entry?.operation ? { outcomeUnknown: true, copy: "Start save not confirmed. Reconcile this same preparation before another Start." } : {}) };
    } finally { activeWorkout = null; activeGrant?.retire(); activeGrant = null; }
  }
  function submittedWorkout(request, start = false) {
    try {
      const value = closedInput(request, start ? ["preparedId"] : ["planned_split_slot_id"], start ? ["effective"] : []);
      const id = value[start ? "preparedId" : "planned_split_slot_id"];
      if (typeof id !== "string") throw new Error();
      if (Object.hasOwn(value, "effective")) {
        value.effective = closedInput(value.effective, ["local_date", "local_time", "utc_offset"]);
        if (!Object.values(value.effective).every(x => typeof x === "string")) throw new Error();
      }
      return value;
    } catch { return null; } // Typed refusal happens inside the scoped queue.
  }
  async function sink(command, record) {
    try {
      if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
      activeProof = { ...activeProof, record: copy(record) };
      const result = completedOutcome(await bridge.execute(command, null));
      if (result.committed) return { stored: true, durable: true, confirmed: false, committed: true, committedRevision: result.committedRevision,
        state: result.state, code: result.code, reason: result.reason };
      if (result.stored === true && result.durableRevision) return { stored: true, durable: true, revision: result.durableRevision, result: result.result };
      const state = [17, 18, 19, 20].includes(result.state) ? result.state : 3;
      return refusal(state, result.code || "DURABLE_SINK_REFUSED", reasonFor(state));
    } catch (error) {
      const state = [17, 18, 19, 20].includes(error.state) ? error.state : 3;
      return refusal(state, error instanceof StorageFailure ? error.code : "DURABLE_SINK_FAILED", reasonFor(state));
    }
  }
  const boundary = W5.createPublicBoundary({ keys, athleteId, deviceId, subtle, crypto, monotonicMs, maxTimeRoundTripMs, schemaVersion,
    client: Object.freeze({ deliverDisposition: record => sink("@disposition", record), deliverReceipts: records => sink("@pull", records),
      receiveCurrentHead: async ({ envelope, context }) => {
        if (!activeHead || context.clientRevision !== activeHead.clientRevision || context.issuanceAttempt !== activeHead.issuanceAttempt ||
            context.athleteId !== athleteId || context.deviceId !== deviceId)
          return refusal(18, "CURRENT_HEAD_CONTEXT_UNPROVEN", reasonFor(18));
        const result = await sink("@currentHead", envelope);
        if (result.durable === true && result.stored === true && result.revision && historyAttempt === activeHead &&
            !contextFailure(activeHead.observationEpoch))
          return { ...result, confirmed: true, observation: { after: envelope.after, head: envelope.head,
            clientRevision: activeHead.clientRevision, committedRevision: result.revision, issuanceAttempt: activeHead.issuanceAttempt } };
        if (result.durable === true && result.stored === true && result.revision) {
          lateRefusal = { ...refusal(18, "CURRENT_HEAD_CONTEXT_CHANGED", reasonFor(18)), stored: true, durable: true,
            confirmed: false, acknowledged: false, committed: true, committedRevision: result.revision };
          return lateRefusal;
        }
        return { ...result, confirmed: false };
      },
      receiveSnapshot: record => sink("@snapshot", record), receiveLease: record => sink("@lease", record), syncedServerTime: record => sink("@time", record) }) });
  const normalize = result => result?.accepted === false && (result.result?.stored === false || result.result?.confirmed === false) ? { ...result, state: result.result.state, reason: result.result.reason, code: result.result.code } : result;
  async function accept(kind, record, extra) {
    try {
      if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
      const input = copy(record); activeProof = { proof: input };
      return normalize(await observationGuard.run(kind, async () => {
        if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
        const method = { disposition: "acceptDisposition", pull: "acceptPull", snapshot: "acceptSnapshot", lease: "acceptLease", time: "acceptServerTime" }[kind];
        if (kind === "disposition") {
          const snapshot = await repository.load(); extra = copy(snapshot.generation.collections.ops?.[input.op_id]);
        }
        return boundary[method](input, extra);
      }));
    } catch (error) { const state = [17, 18, 19, 20].includes(error.state) ? error.state : 3; return refusal(state, "PUBLIC_CLIENT_FAILED", reasonFor(state)); }
    finally { activeGrant?.retire(); activeGrant = null; activeProof = null; }
  }
  return Object.freeze({
    prepareLocalRecovery() { return enqueue(async()=>{
      try {
        if(!recovery?.codec||!recovery?.protocol||!recovery?.scopeDigest)throw new StorageFailure("RECOVERY_CONFIGURATION_REQUIRED",18);
        if(lateRefusal)return {...lateRefusal,prepared:false};
        return await observationGuard.run("local-recovery-basis",async()=>{
          const failure=contextFailure(null);if(failure)return {...failure,prepared:false};
          const snapshot=await repository.load();
          const candidate=await stageVerified(copy(snapshot.generation),null,null,{authenticateLocalHistory:true});
          if(!candidate.view||candidate.result?.state)return {...candidate.result,prepared:false};
          const epoch=candidate.context.observationEpoch;
          const assertContext=()=>{const changed=contextFailure(epoch)||lateRefusal;if(changed)throw new StorageFailure(changed.code,changed.state);};
          const basis=createLocalRecoveryBasis({snapshot,repository,namespace,athleteId,deviceId,codec:recovery.codec,protocol:recovery.protocol,
            scopeDigest:recovery.scopeDigest,publicVerifier:verifier,assertContext});
          await basis.assertCurrent();return {prepared:true,basis};
        });
      }catch(error){const changed=contextFailure(null);if(changed)return {...changed,prepared:false};return {...refusal([17,18,19,20].includes(error.state)?error.state:18,error.code||"LOCAL_RECOVERY_UNPROVEN",reasonFor(error.state||18)),prepared:false};}
      finally{activeGrant?.retire();activeGrant=null;}
    }); },
    readWorkoutHistory() { return enqueue(async()=>{
      try {
        if (!captureEnabled) return workoutRefusal("WORKOUT_PREPARATION_NOT_CONFIGURED");
        if (lateRefusal) return {...lateRefusal,read:false};
        return await observationGuard.run("workout-history",async()=>{
          const failure=contextFailure(null);if(failure)return {...failure,read:false};
          const snapshot=await repository.load();
          // Validate/assemble privately before T2 consumes indexes. Nothing is
          // returned until the same snapshot passes signature/standing checks.
          const history=storedWorkoutHistory(snapshot.generation,{athleteId,deviceId,prescriptionCapture});
          const candidate=await stageVerified(copy(snapshot.generation),null,null,{authenticateLocalHistory:true});
          if(!candidate.view||candidate.result?.state)return {...candidate.result,read:false};
          const changed=contextFailure(candidate.context.observationEpoch);if(changed)return {...changed,read:false};
          const latest=await repository.load(),lastFailure=contextFailure(candidate.context.observationEpoch);
          if(lastFailure)return {...lastFailure,read:false};
          if(latest.revision!==snapshot.revision||latest.token!==snapshot.token)return {...workoutRefusal("WORKOUT_HISTORY_CHANGED"),read:false};
          return {read:true,source_revision:snapshot.revision,history:copy(history)};
        });
      }catch(error){const changed=contextFailure(null);if(changed)return {...changed,read:false};const state=[17,18,19,20].includes(error.state)?error.state:3;return {...refusal(state,error.code||"WORKOUT_HISTORY_UNAVAILABLE",reasonFor(state)),read:false};}
      finally{activeGrant?.retire();activeGrant=null;}
    }); },
    prepareWorkout(request) { const input = submittedWorkout(request), lifetime = preparationEpoch; return enqueue(() => prepareWorkout(input, lifetime)); },
    prepareWorkoutContinuation(request){let input;try{input=copy(closedInput(request,['session_start_op_id']));}catch{input=null;}const lifetime=preparationEpoch;return enqueue(()=>prepareWorkoutContinuation(input,lifetime));},
    executeResumedWorkout(request){let input;try{const raw=closedInput(request,['resumeId','action','input']);resumeCommands.prepare({action:raw.action,input:raw.input});input=copy(raw);}catch{input=null;}return enqueue(()=>executeResumedWorkout(input));},
    prepareWorkoutEdit(request){let input;try{const raw=closedInput(request,['target_op_id']);if(typeof raw.target_op_id!=='string')throw Error('Invalid target');input=copy(raw);}catch{input=null;}const lifetime=preparationEpoch;return enqueue(async()=>{try{return await observationGuard.run('workout-edit-history',()=>prepareWorkoutEdit(input,lifetime));}catch(error){return {...workoutRefusal(error.code||'WORKOUT_EDIT_GUARD_UNAVAILABLE'),state:[17,18,19,20].includes(error.state)?error.state:18};}});},
    commitWorkoutEdit(request){let input;try{const raw=closedInput(request,['editId','action','change']);resumeCommands.prepare({action:raw.action,input:raw.action==='correct'?{replacement_fields:raw.change}:{reason:raw.change}});input=copy(raw);}catch{input=null;}return enqueue(()=>commitWorkoutEdit(input));},
    startPreparedWorkout(request) { const input = submittedWorkout(request, true); return enqueue(() => startPreparedWorkout(input)); },
    retireWorkoutPreparations() {
      preparationEpoch++;
      for (const entry of preparations.values()) {
        entry.retired = true;
        if (entry.phase === "starting" || entry.phase === "uncertain") unresolvedWorkout = entry;
      }
      preparations.clear(); // In-flight entries remain privately held by their attempt/unresolved fence.
      for(const entry of resumptions.values())entry.retired=true;resumptions.clear();if(activeResume)activeResume.retired=true;
      for(const entry of workoutEdits.values())entry.retired=true;workoutEdits.clear();if(activeEdit)activeEdit.retired=true;
    },
    current() {
      const value = bridge.current(), failure = contextFailure(visibleEpoch) || lateRefusal;
      if (failure) return { view: null, retainedInput: failure.state === 17 ? null : value.retainedInput, refusal: copy(failure) };
      return [17, 18, 19].includes(value.refusal?.state) ? { ...value, view: null } : value;
    },
    execute(command, args) { const input = copy(args); return enqueue(async () => {
      try {
        if (lateRefusal) return { ...refusal(lateRefusal.state, "RECOVERY_REQUIRED", lateRefusal.reason), acknowledged: false, priorCommittedRevision: lateRefusal.committedRevision };
        return completedOutcome(await bridge.execute(command, input));
      } finally { activeGrant?.retire(); activeGrant = null; }
    }); },
    reopen() { return enqueue(async () => {
      try {
        if (lateRefusal) return { view: null, retainedInput: null, refusal: copy(lateRefusal) };
        const result = await bridge.reopen(), failure = contextFailure(activeContext?.observationEpoch ?? null);
        if (failure) return { view: null, retainedInput: null, refusal: failure };
        if (!result.refusal) visibleEpoch = activeContext?.observationEpoch ?? null;
        return result;
      } finally { activeGrant?.retire(); activeGrant = null; }
    }); },
    acceptResponse(kind, { wireVersion, body } = {}, expectedWatermark) {
      if (wireVersion !== W5.WIRE_VERSION || !["disposition", "pull", "snapshot", "lease"].includes(kind)) return Promise.resolve(refusal(12, "WIRE_VERSION_OR_KIND", "The response format is not supported."));
      const record = copy(kind === "disposition" ? body?.disposition : kind === "lease" ? body?.lease : body);
      return enqueue(() => accept(kind, record, expectedWatermark));
    },
    invalidateCurrentHead() {
      historyAttempt = null;
      boundary.invalidateHistoryChallenge?.();
    },
    async exchangeCurrentHead(request, { issuanceAttempt } = {}) {
      if (typeof boundary.beginHistoryChallenge !== "function" || typeof boundary.acceptCurrentHead !== "function")
        return { accepted: false, ...refusal(12, "CURRENT_HEAD_UNSUPPORTED", "The current-history protocol is not installed.") };
      if (typeof request !== "function" || typeof issuanceAttempt !== "string" || !issuanceAttempt || issuanceAttempt.length > 128)
        return { accepted: false, ...refusal(12, "CURRENT_HEAD_REQUEST_INVALID", "A bound history request is required.") };
      let captured;
      try {
        const outcome = await observationGuard.run("current-head-exchange", async () => {
          captured = await enqueue(async () => {
            if (lateRefusal) return { failure: lateRefusal };
            const epoch = observationEpoch(), before = contextFailure(epoch);
            if (before) return { failure: before };
            const snapshot = await repository.load();
            if (!await verifiedHistory(snapshot.generation)) throw new StorageFailure("HISTORICAL_PROOF_UNPROVEN", 18);
            const changed = contextFailure(epoch); if (changed) return { failure: changed };
            const after = snapshot.generation.collections.sync?.frontier?.W;
            if (!Number.isSafeInteger(after) || after < 0) throw new StorageFailure("HISTORY_FRONTIER_UNPROVEN", 18);
            const pending = Object.freeze({ clientRevision: snapshot.revision, observationEpoch: epoch, issuanceAttempt,
              request: boundary.beginHistoryChallenge({ after, clientRevision: snapshot.revision, issuanceAttempt }) });
            historyAttempt = pending;
            return pending;
          });
          if (captured.failure) return captured.failure;
          // Waiting for HTTP never owns the local-write queue.
          const response = await request(copy(captured.request));
          if (response?.wireVersion !== W5.WIRE_VERSION) return refusal(12, "WIRE_VERSION", "The response format is not supported.");
          const proof = copy(response.body);
          return enqueue(async () => {
            try {
              const failure = contextFailure(captured.observationEpoch); if (failure) return failure;
              if (historyAttempt !== captured) return refusal(12, "HISTORY_REQUEST_RETIRED", "The history request is no longer active.");
              activeHead = captured; activeProof = { proof };
              return await boundary.acceptCurrentHead(proof);
            } finally { activeGrant?.retire(); activeGrant = null; activeProof = null; activeHead = null; }
          });
        });
        return outcome?.accepted === true ? outcome : { accepted: false, ...outcome };
      } catch (error) {
        const state = [17, 18, 19, 20].includes(error.state) ? error.state : 3;
        return { accepted: false, ...refusal(state, error instanceof StorageFailure ? error.code : "CURRENT_HEAD_EXCHANGE_FAILED", reasonFor(state)) };
      } finally {
        if (captured && historyAttempt === captured) { historyAttempt = null; boundary.invalidateHistoryChallenge(); }
      }
    },
    async exchangeServerTime(request) {
      if (timeInFlight) return refusal(12, "TIME_EXCHANGE_PENDING", "A fresh-time exchange is already unresolved.");
      timeInFlight = true;
      try {
        return await observationGuard.run("time-exchange", async () => {
          if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
          const challenge = await enqueue(() => boundary.beginTimeChallenge());
          // Network waiting does not own the stage/sink queue: B11 local writes may proceed.
          const response = await request(challenge);
          if (response?.wireVersion !== W5.WIRE_VERSION) return refusal(12, "WIRE_VERSION", "The response format is not supported.");
          const proof = copy(response.body);
          return enqueue(async () => {
            try {
              if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
              activeProof = { proof };
              return normalize(await boundary.acceptServerTime(proof));
            } finally { activeGrant?.retire(); activeGrant = null; activeProof = null; }
          });
        });
      } catch (error) { const state = [17, 18, 19, 20].includes(error.state) ? error.state : 3; return refusal(state, "TIME_EXCHANGE_FAILED", reasonFor(state)); }
      finally { timeInFlight = false; }
    },
  });
}
