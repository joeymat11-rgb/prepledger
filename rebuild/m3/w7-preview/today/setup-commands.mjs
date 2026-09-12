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

/* A4b's THIRD payload member. `head` and `secondary` may not be added to a
   document exercise - closed() throws on a ninth key (athlete-state.cjs:65-71) -
   so they ride beside the document, keyed by the document's own exercise ids.
   The key set must MATCH those ids exactly: a tag for a lift that is not in the
   week describes nothing, and a lift with no tag would be silently untagged
   rather than deliberately so. `lend` is bounded to (0,1] because that is the
   range INDIRECT's own weights live in (constants.cjs:330); nothing reads these
   yet, which is engine item F2 (DECISIONS:127 (6)), and storing a value F2 could
   not use would be storing a promise this slice cannot keep.
   SEAM (open question: is `tags` the right home for these?). The whole of the
   answer lives in this function and in validate's call to it. */
export function tagsOf(input, document) {
  if (!isMap(input)) bad();
  const ids = document.exercises.map((e) => e.id);
  const keys = Object.keys(input);
  if (keys.length !== ids.length || ids.some((id) => !Object.hasOwn(input, id))) bad();
  const out = {};
  for (const id of ids) {
    const tag = input[id];
    if (!isMap(tag) || Object.keys(tag).length !== 2) bad();
    if (!Object.hasOwn(tag, 'head') || !Object.hasOwn(tag, 'secondary')) bad();
    if (tag.head !== null && !(typeof tag.head === 'string' && tag.head.trim())) bad();
    if (!Array.isArray(tag.secondary)) bad();
    const secondary = tag.secondary.map((s) => {
      if (!isMap(s) || Object.keys(s).length !== 2) bad();
      if (typeof s.mg !== 'string' || !s.mg.trim()) bad();
      if (typeof s.lend !== 'number' || !Number.isFinite(s.lend) || s.lend <= 0 || s.lend > 1) bad();
      return { mg: s.mg, lend: s.lend };
    });
    out[id] = { head: tag.head, secondary };
  }
  return out;
}

/* THE ENVELOPE, AND WHY IT EXISTS. The durable lane's `save()` takes ONE
   document argument, and that signature is not ours to widen: w6's
   today-bindings.mjs is pinned ON DISK by the merged B-NTC artifact
   (packages/B-NTC.json, checked by rebuild/conform/v4/postfix/legacy-gates.cjs
   :12-16), so a single byte of ours in it turns rebuild.yml's B-NTC step red.
   The six screens therefore hand the lane `{ setup, tags }` as that one
   argument, w6 forwards it unchanged into this producer's `input.setup`, and
   THIS function - lane C's own, unpinned - is where the two come apart again.
   A real setup document is REQUIRED_SETUP's four members and can never be
   exactly these two keys, so the two shapes cannot be confused. */
export function envelopeOf(input, tags) {
  const isEnvelope = isMap(input) && Object.keys(input).length === 2
    && Object.hasOwn(input, 'setup') && Object.hasOwn(input, 'tags');
  return isEnvelope ? { setup: input.setup, tags: input.tags } : { setup: input, tags };
}

export function prepare(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) {
    if (key !== 'setup' && key !== 'tags' && key !== 'effective') bad();
  }
  const carried = envelopeOf(input.setup, input.tags);
  const document = setupOf(carried.setup);
  const action = { class: 'event', kind: 'fact',
    payload: { profile: PROFILE, setup: document, tags: tagsOf(carried.tags, document) },
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
  if (Object.keys(op.payload).length !== 3) return false;
  try {
    const document = setupOf(JSON.parse(JSON.stringify(op.payload.setup)));
    tagsOf(JSON.parse(JSON.stringify(op.payload.tags)), document);
  } catch { return false; }
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

export default { createSetupCommands, prepare, validate, setupOf, tagsOf, PROFILE, ACTION,
  SETUP_SCHEMA_VERSION };
