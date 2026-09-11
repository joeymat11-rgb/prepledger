// setup-commands.mjs - A4's CLOSED producer command. It turns a finished first run
// into ONE operation of the accepted client's own envelope: kind "fact", class
// "event", both already members of rebuild/client/ops.cjs KINDS and CLASSES. It is
// the A3 shape (checkin-commands.cjs) applied once, and it is the ONLY way a dated
// non-workout fact can be written without editing rebuild/client or
// rebuild/m3/w6/t2-stage.cjs, neither of which this slice owns (A3 seam S1).
//
// ONE OP, NOT SIX (BUILD-BRIEF 2.2). The six screens hold their answers in memory;
// the single write happens on "Start using Earned". A per-screen write would leave a
// half-built athlete that no reader can name, so this module has exactly one action
// and refuses everything else.
//
// NOTHING HERE INVENTS A VALUE. The payload is the setup document the reducer built,
// which is exactly the object rebuild/m4/workout/athlete-state.cjs createCleanInitState
// accepts. The validator below is that constructor, run on the envelope that is about
// to be written: if the stored bytes could not rebuild the athlete, nothing is stored.
import { createCleanInitState, REQUIRED_SETUP } from './setup-model.mjs';

export const PROFILE = 'earned/first-run-setup/v1';
export const ACTION = 'first-run-setup';
/* The accepted client stamps every producer-injected command schema_version 2 and
   refuses a lease of any other schema. It is the era's own lease schema
   (rebuild/m3/w6/local/local-era.mjs LOCAL_ERA_SCHEMA_VERSION), which is why this
   op rides the one local-era generation exactly as a workout set does. */
export const SETUP_SCHEMA_VERSION = 2;

const isMap = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const bad = () => { throw new TypeError('SETUP_INPUT_INVALID'); };

/* The one gate, used on the request AND on the envelope, so the two can never
   drift: the document must be exactly REQUIRED_SETUP's four members, and the
   accepted constructor must be able to build a whole athlete out of it. The
   constructor throws a named CLEAN_INIT_* code on anything it will not take. */
export function setupOf(input) {
  if (!isMap(input)) bad();
  const keys = Object.keys(input);
  if (keys.length !== REQUIRED_SETUP.length || REQUIRED_SETUP.some((k) => !keys.includes(k))) bad();
  const document = JSON.parse(JSON.stringify(input));
  createCleanInitState({ setup: document });   // throws CLEAN_INIT_* on anything unusable
  return document;
}

export function prepare(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) if (key !== 'setup' && key !== 'effective') bad();
  const action = { class: 'event', kind: 'fact',
    payload: { profile: PROFILE, setup: setupOf(input.setup) },
    parents: [] };
  if (Object.hasOwn(input, 'effective')) {
    const e = input.effective;
    if (!isMap(e) || Object.keys(e).length !== 3
      || !['local_date', 'local_time', 'utc_offset'].every((k) => typeof e[k] === 'string')) bad();
    action.effective = { local_date: e.local_date, local_time: e.local_time, utc_offset: e.utc_offset };
  }
  return action;
}

/* The shape the client re-checks on the envelope it actually built, after its own
   Ops.build. It ACCEPTS ITS OWN ENVELOPE and refuses anything else: a workout set,
   a weigh-in, a recovery check-in, a payload with an extra member, a setup document
   the constructor would not take, or a causal parent the log does not hold. */
export function validate(op, readOperation) {
  if (!op || op.kind !== 'fact' || op.class !== 'event') return false;
  if (!op.effective || !/^\d{4}-\d{2}-\d{2}$/.test(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== PROFILE || !isMap(op.payload.setup)) return false;
  if (Object.keys(op.payload).length !== 2) return false;
  try { setupOf(JSON.parse(JSON.stringify(op.payload.setup))); } catch { return false; }
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

export function createSetupCommands() {
  return Object.freeze({ schemaVersion: SETUP_SCHEMA_VERSION, prepare, validate });
}

export default { createSetupCommands, prepare, validate, setupOf, PROFILE, ACTION,
  SETUP_SCHEMA_VERSION };
