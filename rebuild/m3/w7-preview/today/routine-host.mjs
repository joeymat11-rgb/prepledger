// routine-host.mjs - S15 "Change my routine": the page's composition of the
// reviewed plan-edit companion (rebuild/m3/w6/host/plan-edit-host.mjs) over
// THIS installation. No repository, clock, lease or identity is created here:
// the client, the live day and the namespace are the installation's own, the
// stamp clock is today-bindings.mjs clientClockFor (the same one every other
// host on this page stamps with), and the tag rules are setup's (F2
// setup-tags.cjs over the catalogue's own taxonomy).
//
// Two jobs, and only two:
//   session() - the editor's lane: read the routine that starts tomorrow, and
//               save ONE change through review + save (dated next local day, or,
//               S17, today itself when the athlete chose today and today's
//               workout has not begun).
//   adopt(s)  - the adoption chain's hook: hand Today the routine IN FORCE TODAY
//               (basis plus every saved change whose start date has come), and
//               the basis unchanged whenever anything at all is in doubt.
import { createPlanEditHost } from '../../w6/host/plan-edit-host.mjs';
import { clientClockFor } from '../../w6/local/today-bindings.mjs';
import Commands from '../../../m4/workout/plan-edit-commands.cjs';
import Model from '../../../m4/workout/plan-edit-model.cjs';
import SetupTags from '../../../m4/workout/setup-tags.cjs';
import { ENGINE_MG, REGION_MG } from './exercise-catalogue.mjs';
import { createCleanInitState } from './setup-model.mjs';
import { admittedLocalSourceBasis } from './local-source-basis.mjs';
import { PROFILE as SETUP_PROFILE } from './setup-commands.mjs';

const tagRules = SetupTags.createSetupTagProjector({ taxonomy: { muscles: [...ENGINE_MG], regions: { ...REGION_MG } } });
const detached = value => JSON.parse(JSON.stringify(value));
/* Key-order-independent identity, the same rule local-source-basis.mjs uses. */
function identity(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return '[' + value.map(identity).join(',') + ']';
  if (!value || typeof value !== 'object') return 'null';
  return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + identity(value[k])).join(',') + '}';
}

/* WHICH BASIS this installation's routine is edited over, read from ONE
   generation. The companion proves the same thing again on every read; this
   only picks the state to hand it. FIRST-RUN: the setup document through the
   accepted constructor, with its tag snapshot projected exactly as the
   companion checks it. LOCAL-SOURCE: the admitted import, through the very join
   Today adopts with. `clean` is what Today itself adopts on the first-run path
   (setup.athleteState()), kept so adopt() can prove it is editing THAT state. */
export function routineBasis(generation, { namespace = null } = {}) {
  const ops = generation && generation.collections && generation.collections.ops;
  const setups = Object.values(ops || {}).filter(op => op && op.payload && op.payload.profile === SETUP_PROFILE);
  if (setups.length !== 1) return { code: 'ROUTINE_SETUP_UNAVAILABLE' };
  const origin = setups[0], setup = origin.payload.setup, label = setup && setup.athlete_label;
  if (Model.importPresentIn(generation)) {
    const state = admittedLocalSourceBasis(generation, { athleteLabel: label, namespace });
    return state ? { origin, state, clean: state, source: 'local-source', label } : { code: 'ROUTINE_IMPORT_NOT_ADMITTED' };
  }
  const clean = createCleanInitState({ setup });
  const state = origin.payload.tags === undefined ? clean : tagRules.projectSetupTags(clean,
    { setup, tags: origin.payload.tags, op_id: origin.op_id, date: origin.effective.local_date });
  return { origin, state, clean, source: 'first-run', label };
}

/* Fable l1 B1, PM ruling (b). On the first-run branch the companion edits the TAG-PROJECTED setup state (it
   proves the setup tag snapshot), while Today stands on the clean state with no tag members. Handing Today the
   projection as it is would give every KEPT lift head, secondary and volumeTags it never had, and the engine
   buckets volume by `head || mg`: a calculation change nobody asked for. So every lift that is in the basis
   Today stands on keeps exactly that basis's own value for the three tag members (present or absent), and
   only the fields an edit changed differ; an added or replacing lift keeps the tag snapshot it was saved with.
   On the imported branch `clean` IS the projected basis, so this changes nothing there. */
const TAG_MEMBERS = ['head', 'secondary', 'volumeTags'];
export function keptAsBasis(projected, clean) {
  const before = new Map(((clean && clean.exercises) || []).map(e => [e.id, e]));
  return { ...projected, exercises: projected.exercises.map((e) => {
    const was = before.get(e.id);
    if (!was) return e;
    const kept = { ...e };
    for (const k of TAG_MEMBERS) {
      if (Object.hasOwn(was, k)) kept[k] = detached(was[k]); else delete kept[k];
    }
    return kept;
  }) };
}

function intentIds(crypto) {
  return () => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return 'routine-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  };
}

export function createRoutineEntry({ installation, day, live = null, crypto = globalThis.crypto, onTodayChanged = null } = {}) {
  if (!installation || !installation.client || typeof installation.generation !== 'function'
    || typeof installation.liveDay !== 'function' || typeof day !== 'string') return null;
  if (!crypto || typeof crypto.getRandomValues !== 'function') return null;
  const newIntentId = intentIds(crypto);
  async function open({ editedOnly = false } = {}) {
    const loaded = await installation.generation();
    const generation = loaded && loaded.generation;
    /* An installation that has never saved a routine change has nothing to
       project: adoption stops here, before any host is composed. */
    if (editedOnly && !Object.values((generation && generation.collections && generation.collections.ops) || {})
      .some(op => op && op.kind === 'plan-mutation')) return { ok: false, code: 'ROUTINE_UNEDITED' };
    const basis = routineBasis(generation, { namespace: installation.namespace || null });
    if (!basis.state) return { ok: false, code: basis.code };
    const host = await createPlanEditHost({ client: installation.client, clock: clientClockFor(day, live),
      liveDay: () => installation.liveDay(), basisState: basis.state, setupOperation: basis.origin,
      validateTags: tagRules.validateExerciseTags, projectNewExerciseTags: tagRules.projectNewExerciseTags,
      newIntentId, athleteLabel: basis.label, namespace: installation.namespace });
    return { ok: true, host, basis };
  }

  /* THE EDITOR'S LANE. view() reads the routine as it will stand on the next
     local day (every saved change composed), which is what the editor shows and
     what the next change is made against. save() reviews then saves ONE edit;
     the date the athlete was shown is checked against the date the review
     dated, so a save never lands on a day he was not shown. */
  async function session() {
    let opened;
    try { opened = await open(); }
    catch (error) { return { ok: false, code: (error && error.code) || 'ROUTINE_OPEN_REFUSED' }; }
    if (!opened.ok) return opened;
    const { host, basis } = opened;
    let alive = true;
    return Object.freeze({ ok: true, source: basis.source,
      async view() {
        if (!alive) return { ok: false, code: 'LOCAL_CLIENT_CLOSED' };
        let today, startsOn;
        try { today = installation.liveDay(); startsOn = Commands.nextLocalDate(today); }
        catch (error) { return { ok: false, code: (error && error.code) || 'PLAN_EDIT_DATE_INVALID' }; }
        const read = await host.read(startsOn);
        if (!read.read) return { ok: false, code: read.code || 'PLAN_EDIT_READ_REFUSED' };
        /* S17: may a change start today? The editor offers the choice only when it may, and says why when not. */
        const open = await host.todayOpen();
        const taken = new Set(read.state.exercises.map(e => e.id));
        for (const row of basis.origin.payload.setup.exercises || []) taken.add(row.id);
        for (const intent of read.intents || []) if (intent.edit && intent.edit.exercise) taken.add(intent.edit.exercise.id);
        return { ok: true, today, starts_on: startsOn, state: detached(read.state),
          pending_dates: [...read.pending_dates], taken: [...taken],
          today_allowed: open.ok === true && open.open === true, today_code: open.ok ? open.code : (open.code || 'PLAN_EDIT_READ_REFUSED') };
      },
      async save(edit, shownStartsOn) {
        if (!alive) return { ok: false, code: 'LOCAL_CLIENT_CLOSED' };
        /* S17: the date he was shown says which he chose: today's date asks for today, any other for the next day. The
           companion judges today again on its own read and refuses it by name when today's workout has begun. */
        let liveToday = null;
        try { liveToday = installation.liveDay(); } catch (_) { liveToday = null; }
        const review = await host.review(edit, { startsToday: shownStartsOn !== undefined && shownStartsOn === liveToday });
        if (!review.reviewed) return { ok: false, code: review.code || 'PLAN_EDIT_INPUT_INVALID', message: review.message || null };
        if (shownStartsOn !== undefined && review.starts_on !== shownStartsOn) {
          host.cancel(review.review_id);
          return { ok: false, code: 'PLAN_EDIT_DAY_TURNED', message: null };
        }
        const saved = await host.save(review.review_id);
        if (!saved.ok) {
          host.cancel(review.review_id);
          return { ok: false, code: saved.code || 'PLAN_EDIT_SAVE_REFUSED', message: saved.message || null };
        }
        return { ok: true, starts_on: saved.starts_on, op_id: saved.op_id, today: saved.starts_on === liveToday };
      },
      close() { alive = false; host.close(); } });
  }

  /* THE ADOPTION HOOK. `state` is the basis Today's adoption chain was about to
     adopt (setup.athleteState() or the admitted import). It is replaced ONLY when
     this installation's routine has a saved change already in force today and
     that change was made over this very basis; on anything else, including any
     refusal or throw, Today keeps `state` exactly as it was handed over. */
  async function adopt(state) {
    let opened = null;
    try {
      if (!state || typeof state !== 'object') return state;
      opened = await open({ editedOnly: true });
      if (!opened.ok || identity(opened.basis.clean) !== identity(state)) return state;
      const read = await opened.host.read(day);
      if (!read.read || !Array.isArray(read.applied_ids) || !read.applied_ids.length) return state;
      return keptAsBasis(detached(read.state), opened.basis.clean);
    } catch (_) {
      return state;
    } finally {
      if (opened && opened.host) { try { opened.host.close(); } catch (_) { /* nothing held */ } }
    }
  }
  /* THE EDITOR'S SCREENS, lazy-loaded here so Today's own view gains no module
     edge and the boot path carries none of the editor until it is opened. */
  async function mount(doc, root, { onBack } = {}) {
    const Screen = await import('./routine-app.mjs');
    /* S17: a change that starts today is adopted now - the page re-opens on today (the rollover's own re-boot), so
       Today shows the new workout at once instead of on the next boot. */
    return Screen.mountRoutine(doc, root, { routine: entry, onBack,
      ...(typeof onTodayChanged === 'function' ? { onTodayChanged } : {}) });
  }
  const entry = Object.freeze({ session, adopt, mount });
  return entry;
}

export default { createRoutineEntry, routineBasis };
