// Plan-edit companion over the installation's existing authenticated durable lane.
// No repository, clock, lease, identity or authority is created here.
import { createDurablePublicClient } from '../public-client.mjs';
import Commands from '../../../m4/workout/plan-edit-commands.cjs';
import Model from '../../../m4/workout/plan-edit-model.cjs';
import Canonical from '../../../client/canonical.cjs';
import { createHash } from '../node-sha256-browser.mjs';
/* P2 S3 IMPORT JOIN, the SAME module Today adopts through
   (today-app.cjs athleteBasisState -> admittedLocalSourceState). It is a pure
   reader of one generation - no imports of its own, no store, no clock - so the
   companion proves the adopted basis against the generation it is replaying
   from instead of trusting the state it was handed. */
import { admittedLocalSourceBasis } from '../../w7-preview/today/local-source-basis.mjs';

const copy = value => structuredClone(value);
const same = (a,b) => Canonical.encode(a) === Canonical.encode(b);
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const refusal = code => ({ ok:false, acknowledged:false, state:3, code });
const stale = () => refusal('PLAN_EDIT_REVIEW_STALE');
/* The one refusal this companion must SAY, not just make. Everything else here
   is a code lane C words; this one happens between a review and its Save, so
   the honest sentence travels with the code rather than being reconstructed. */
const dayTurned = () => ({ ...refusal('PLAN_EDIT_DAY_TURNED'),
  message:'The day changed while this was open. Review the latest week before saving.' });

/* S4 REAL DAY (DECISIONS:437/:451/:467). TOMORROW is a date on the ATHLETE'S
   LOCAL CALENDAR, and the only honest source for it is the same live clock
   Today stands on: rebuild/m3/w6/local/today-bindings.mjs openTodayInstallation
   exposes it as `liveDay()`, and every host's own `clock.today()` is that
   host's FROZEN `day` argument (clientClockFor(day, live) - the DAY half never
   moves, only the instant half does). Reading tomorrow off `clock.today()` is
   therefore the :437 frozen-date defect with an extra day added to it, and
   Date.now() is refused outright. So `liveDay` is REQUIRED and separate from
   `clock`: `clock` stays exactly what it was, the client's stamp clock handed
   to the existing hostBindings, and nothing here mints either one.

   The two can disagree - the page opened yesterday and has not adopted today
   yet. That disagreement is never silently resolved: `exactBatch` requires the
   operation's OWN effective.local_date (stamped by `clock`) to equal the live
   day this review was authored on, so a frozen page refuses at the final
   validator instead of dating an edit off a day nothing is stamped with. */
export async function createPlanEditHost({ client, clock, liveDay, basisState, setupOperation,
  validateTags, projectNewExerciseTags, newIntentId, athleteLabel, namespace } = {}) {
  if (typeof client?.hostBindings !== 'function' || typeof clock?.today !== 'function' ||
      typeof newIntentId !== 'function') throw new TypeError('Existing installation, clock and intent ID provider required');
  /* WHOSE NUMBERS, AND WHICH INSTALLATION. admittedLocalSourceBasis narrows the
     admitted import to this athlete's label in this namespace; defaulted away,
     the P2 predicate degrades to "any admitted import" and a caller that simply
     forgot them would silently loosen it. The real host always has both (the
     page passes them beside admittedLocalSourceState), so absence is an
     incomplete host, not a permissive one. */
  for (const value of [athleteLabel, namespace])
    if (typeof value !== 'string' || !value.trim()) Commands.fail('PLAN_EDIT_HOST_INCOMPLETE');
  const liveDayOf = typeof liveDay === 'function' ? liveDay
    : (typeof client.liveDay === 'function' ? () => client.liveDay() : null);
  if (!liveDayOf) throw new TypeError('The installation live athlete-local day (today-bindings liveDay) is required');
  // One reader, so no path can fall back to the host clock's frozen day.
  const localDay = () => { const day = liveDayOf(); Commands.dateOf(day); return day; };
  const commands = Commands.createPlanEditCommands({ validateTags });
  /* WHICH BASIS THIS INSTALLATION IS ON is a fact about the durable generation,
     not a caller's claim, and there is no generation to read at construction:
     the first authenticated read produces it. So the projector is built on that
     first read, from the generation itself, and is then FIXED: a later read
     whose import presence disagrees refuses rather than rebuilding, because a
     basis that changed under an open editor is exactly the stale review the
     athlete must be shown before anything is saved. */
  let projector = null, boundSource = null;
  function projectorFor(generation) {
    const source = Model.importPresentIn(generation) ? 'local-source' : 'first-run';
    if (boundSource === null) {
      projector = Model.createPlanEditProjector({ basisState, setupOperation, validateTags, projectNewExerciseTags,
        basisSource:source,
        hashBasis:text => createHash('sha256').update(text,'utf8').digest('hex'),
        // Same arguments today-app.cjs passes: WHOSE numbers, and this installation.
        admittedBasisOf:g => admittedLocalSourceBasis(g,{ athleteLabel, namespace }) });
      boundSource = source;
    } else if (boundSource !== source) Commands.fail('PLAN_EDIT_BASIS_SOURCE_CHANGED');
    return projector;
  }
  const read = (generation, date) => projectorFor(generation).read(generation, date);
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
      localDay() === entry.authoredDay &&
      Commands.nextLocalDate(localDay()) === entry.args.input.starts_on;
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
        try { view = read(generation,localDay()); }
        catch (error) { return { generation,result:refusal(error.code || 'PLAN_EDIT_READ_REFUSED'),view:null }; }
        if (!matches(active,view)) return { generation,result:stale(),view:null };
        if (candidate.result?.acknowledged === true) {
          try { read(candidate.generation,localDay()); }
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
      if (localDay() !== active.authoredDay ||
          Commands.nextLocalDate(localDay()) !== active.args.input.starts_on) return stale();
      // The upstream guard may discover a revoked era during its own validation.
      const final = bindings.validateCommit(context);
      if (final) return final;
      if (!alive || reviews.get(active.args.input.intent_id) !== active) return refusal('LOCAL_CLIENT_CLOSED');
      return localDay() !== active.authoredDay ? stale() : null;
    }
  });
  async function readVerified(date) {
    if (!alive) return { read:false,...refusal('LOCAL_CLIENT_CLOSED') };
    lastGeneration = null;
    const opened = await lane.reopen();
    if (opened?.refusal || !lastGeneration)
      return { read:false,...(opened?.refusal || refusal('PLAN_EDIT_READ_REFUSED')) };
    try { return { read:true,...read(lastGeneration,date || localDay()) }; }
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
        // THE date the athlete is shown before Save, on his own calendar.
        const authoredDay = localDay(), starts_on = Commands.nextLocalDate(authoredDay);
        const future = read(lastGeneration,starts_on);
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
        const after = projectorFor(lastGeneration).preview(lastGeneration,starts_on,args.input);
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
      const current = await readVerified();
      if (!current.read) return { ...current,ok:false,acknowledged:false };
      if (!alive) return refusal('LOCAL_CLIENT_CLOSED');
      if (reviews.get(review_id) !== entry) return refusal('PLAN_EDIT_REVIEW_REQUIRED');
      const prior = current.intents.find(x => x.intent_id === entry.args.input.intent_id);
      if (prior) {
        const result = outcome(entry,prior);
        if (!result.ok) return result;
        if (entry.result && entry.result.op_id !== prior.op_id) return refusal('PLAN_EDIT_INTENT_CONFLICT');
        // Cached metadata describes the historical commit. It can be returned
        // only after this read proves the context and exact intent still active.
        if (!entry.result) entry.result = copy(result);
        return copy(entry.result);
      }
      if (entry.result) return refusal('PLAN_EDIT_INTENT_CONFLICT');
      /* A STALE REVIEW SHOWS THE NEW RESULT BEFORE IT REFUSES (EW-12). The
         athlete's edit is never silently rebased onto a plan he has not seen,
         and he is never told only "no": `current` is the authenticated read
         this Save just did, so the refusal carries the plan that is actually
         there now and the start date a fresh review would offer. */
      if (!matches(entry,current)) return { ...stale(), current:copy(current.state),
        plan_basis:current.plan_basis, pending_dates:copy(current.pending_dates),
        starts_on:Commands.nextLocalDate(localDay()) };
      /* THE STAMP CLOCK AND THE LIVE DAY MUST AGREE BEFORE ANYTHING IS BUILT.
         In the page they do by construction (clientClockFor takes the host's own
         day). When they do not, the operation this Save would build carries an
         effective.local_date the review was never authored on, and the client's
         own closed validator refuses it - correctly, and nothing is written, but
         in its own generic words ("Nothing was recorded"), which tells the
         athlete a save failed when what actually happened is that his day
         turned. Name it here, before the client is asked to build anything. */
      const stamped = clock.today(); Commands.dateOf(stamped);
      if (stamped !== entry.authoredDay) return dayTurned();
      active = entry;
      let result;
      try { result = await lane.execute('workout',entry.args); }
      catch { result = refusal('PLAN_EDIT_SAVE_OUTCOME_UNKNOWN'); }
      finally { active = null; }
      if (!alive) return refusal('LOCAL_CLIENT_CLOSED');
      if (reviews.get(review_id) !== entry) return refusal('PLAN_EDIT_REVIEW_REQUIRED');
      if (result.acknowledged === true) {
        entry.result = { ...result,ok:true,intent_id:entry.args.input.intent_id,
          starts_on:entry.args.input.starts_on,edit:copy(entry.args.input.edit) };
        return copy(entry.result);
      }
      // An uncertain reply is resolved by this intent on authenticated disk.
      // A different historical value never establishes that this save committed.
      const after = await readVerified();
      if (!alive) return refusal('LOCAL_CLIENT_CLOSED');
      if (reviews.get(review_id) !== entry) return refusal('PLAN_EDIT_REVIEW_REQUIRED');
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
