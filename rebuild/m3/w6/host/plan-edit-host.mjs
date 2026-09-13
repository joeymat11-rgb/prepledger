// Plan-edit companion over the installation's existing authenticated durable lane.
// No repository, clock, lease, identity or authority is created here.
import { createDurablePublicClient } from '../public-client.mjs';
import Commands from '../../../m4/workout/plan-edit-commands.cjs';
import Model from '../../../m4/workout/plan-edit-model.cjs';
import Canonical from '../../../client/canonical.cjs';
import { createHash } from '../node-sha256-browser.mjs';

const copy = value => structuredClone(value);
const same = (a,b) => Canonical.encode(a) === Canonical.encode(b);
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const refusal = code => ({ ok:false, acknowledged:false, state:3, code });
const stale = () => refusal('PLAN_EDIT_REVIEW_STALE');

export async function createPlanEditHost({ client, clock, basisState, setupOperation,
  validateTags, projectNewExerciseTags, newIntentId } = {}) {
  if (typeof client?.hostBindings !== 'function' || typeof clock?.today !== 'function' ||
      typeof newIntentId !== 'function') throw new TypeError('Existing installation, clock and intent ID provider required');
  const commands = Commands.createPlanEditCommands({ validateTags });
  const projector = Model.createPlanEditProjector({ basisState, setupOperation, validateTags, projectNewExerciseTags,
    hashBasis:text => createHash('sha256').update(text,'utf8').digest('hex') });
  const bindings = await client.hostBindings({ workoutCommands:commands, clock });
  if (typeof bindings?.stage !== 'function' || typeof bindings?.validateCommit !== 'function')
    throw new TypeError('Existing stage and final validator required');
  let alive = true, active = null, lastGeneration = null, tail = Promise.resolve();
  const reviews = new Map();
  function enqueue(action) { const task = tail.then(action); tail = task.catch(() => {}); return task; }
  function matches(entry, view) {
    return reviews.get(entry.args.input.intent_id) === entry &&
      view.plan_basis === entry.args.input.seen_plan_basis &&
      same(view.causal_parents, entry.args.input.causal_parents) &&
      clock.today() === entry.authoredDay &&
      Commands.nextLocalDate(clock.today()) === entry.args.input.starts_on;
  }
  function exactBatch(context, entry) {
    const op = context.batch?.operations?.[0], action = entry.prepared;
    return context.command === 'workout' && same(context.args,entry.args) &&
      context.batch?.count === 1 && context.batch.operations.length === 1 &&
      op?.class === 'plan' && op.kind === 'plan-mutation' && op.payload === null &&
      op.conflict_domain_id === action.plan.domain &&
      same(op.members,action.plan.members) && same(op.causal_parents,action.parents) &&
      op.seen_plan_basis === action.plan.seen_plan_basis &&
      op.effective?.local_date === entry.authoredDay && commands.validate(op) === true;
  }
  const lane = createDurablePublicClient({ ...bindings, schemaVersion:2,
    stage(generation, command, args, integration) {
      if (!alive) return { generation, result:refusal('LOCAL_CLIENT_CLOSED'),view:null };
      if (command !== null) {
        if (!active || command !== 'workout' || !same(args,active.args))
          return { generation,result:refusal('PLAN_EDIT_REVIEW_REQUIRED'),view:null };
      }
      // Plain reopen/execute otherwise omit this optional T2 authentication
      // handoff. This local-only companion trusts no unsigned historical op:
      // an empty signed-id set makes T2 verify every op with the current key.
      const candidate = bindings.stage(generation,command,args,{ ...integration,
        historyAuthentication:integration?.historyAuthentication || { signedOperationIds:[] } });
      if (!candidate?.view || candidate.result?.state === 18) return candidate;
      if (command !== null) {
        let view;
        try { view = projector.read(generation,clock.today()); }
        catch (error) { return { generation,result:refusal(error.code || 'PLAN_EDIT_READ_REFUSED'),view:null }; }
        if (!matches(active,view)) return { generation,result:stale(),view:null };
        if (candidate.result?.acknowledged === true) {
          try { projector.read(candidate.generation,clock.today()); }
          catch (error) { return { generation,result:refusal(error.code || 'PLAN_EDIT_PROJECTION_REFUSED'),view:null }; }
        }
      }
      lastGeneration = copy(generation);
      return candidate;
    },
    validateCommit(context) {
      const original = bindings.validateCommit(context);
      if (original) return original;
      if (!alive) return refusal('LOCAL_CLIENT_CLOSED');
      if (!active || reviews.get(active.args.input.intent_id) !== active || !exactBatch(context,active))
        return refusal('PLAN_EDIT_BATCH_MISMATCH');
      if (clock.today() !== active.authoredDay ||
          Commands.nextLocalDate(clock.today()) !== active.args.input.starts_on) return stale();
      // The upstream guard may discover a revoked era during its own validation.
      const final = bindings.validateCommit(context);
      if (final) return final;
      if (!alive || reviews.get(active.args.input.intent_id) !== active) return refusal('LOCAL_CLIENT_CLOSED');
      return clock.today() !== active.authoredDay ? stale() : null;
    }
  });
  async function readVerified(date) {
    if (!alive) return { read:false,...refusal('LOCAL_CLIENT_CLOSED') };
    lastGeneration = null;
    const opened = await lane.reopen();
    if (opened?.refusal || !lastGeneration)
      return { read:false,...(opened?.refusal || refusal('PLAN_EDIT_READ_REFUSED')) };
    try { return { read:true,...projector.read(lastGeneration,date || clock.today()) }; }
    catch (error) { return { read:false,...refusal(error.code || 'PLAN_EDIT_READ_REFUSED') }; }
  }
  function outcome(entry, intent, revision) {
    if (intent.status !== 'active' || !same(intent.edit,entry.args.input.edit) ||
        intent.starts_on !== entry.args.input.starts_on) return refusal('PLAN_EDIT_INTENT_CONFLICT');
    return { ok:true,acknowledged:true,op_id:intent.op_id,intent_id:intent.intent_id,
      starts_on:intent.starts_on,edit:copy(intent.edit),recovered:true,
      ...(revision !== undefined ? { durableRevision:revision } : {}) };
  }
  const handle = Object.freeze({
    async read(date) { return enqueue(() => readVerified(date)); },
    async review(edit) { return enqueue(async () => {
      const current = await readVerified();
      if (!current.read) return { reviewed:false,...current };
      try {
        const authoredDay = clock.today(), starts_on = Commands.nextLocalDate(authoredDay);
        const future = projector.read(lastGeneration,starts_on);
        const intent_id = newIntentId();
        if (reviews.has(intent_id) || future.intents.some(x => x.intent_id === intent_id))
          return { reviewed:false,...refusal('PLAN_EDIT_INTENT_CONFLICT') };
        const prepared = commands.prepare({ action:Commands.ACTION,input:{
          intent_id,seen_plan_basis:future.plan_basis,starts_on,edit,causal_parents:future.causal_parents
        }});
        const value = prepared.plan.members[0].value;
        const args = freeze({ action:Commands.ACTION,input:{
          intent_id:value.intent_id,seen_plan_basis:prepared.plan.seen_plan_basis,
          starts_on:value.starts_on,edit:copy(value.edit),causal_parents:copy(prepared.parents)
        }});
        // Preview is the same pure replay implementation over a synthetic intent,
        // never an operation passed to the real store or represented as committed.
        const after = projector.preview(lastGeneration,starts_on,args.input);
        reviews.set(intent_id,{ args,prepared:freeze(copy(prepared)),authoredDay,result:null });
        return freeze({ reviewed:true,review_id:intent_id,intent_id,starts_on,
          current:current.state,before:future.state,after:after.state,
          plan_basis:future.plan_basis,edit:copy(value.edit) });
      } catch (error) { return { reviewed:false,...refusal(error.code || 'PLAN_EDIT_INPUT_INVALID') }; }
    }); },
    async save(review_id) { return enqueue(async () => {
      if (!alive) return refusal('LOCAL_CLIENT_CLOSED');
      const entry = reviews.get(review_id);
      if (!entry) return refusal('PLAN_EDIT_REVIEW_REQUIRED');
      if (entry.result) return copy(entry.result);
      const current = await readVerified();
      if (!current.read) return { ...current,ok:false,acknowledged:false };
      const prior = current.intents.find(x => x.intent_id === entry.args.input.intent_id);
      if (prior) { const result = outcome(entry,prior); if (result.ok) entry.result = copy(result); return result; }
      if (!matches(entry,current)) return stale();
      active = entry;
      let result;
      try { result = await lane.execute('workout',entry.args); }
      catch { result = refusal('PLAN_EDIT_SAVE_OUTCOME_UNKNOWN'); }
      finally { active = null; }
      if (result.acknowledged === true) {
        entry.result = { ...result,ok:true,intent_id:entry.args.input.intent_id,
          starts_on:entry.args.input.starts_on,edit:copy(entry.args.input.edit) };
        return copy(entry.result);
      }
      // An uncertain reply is resolved by this intent on authenticated disk.
      // A different historical value never establishes that this save committed.
      const after = await readVerified();
      const recorded = after.read && after.intents.find(x => x.intent_id === entry.args.input.intent_id);
      if (recorded) {
        const reconciled = outcome(entry,recorded);
        if (reconciled.ok) entry.result = copy(reconciled);
        return reconciled;
      }
      return { ...result,ok:false,acknowledged:false };
    }); },
    cancel(review_id) { reviews.delete(review_id); },
    close() { alive = false; reviews.clear(); }
  });
  return handle;
}
