// today-bindings.mjs — ONE STORE for Today: the drop-in replacement for the
// w7-preview page's TWO synthetic hosts (gym-host.mjs + reading-host.mjs).
//
// WHAT A2 HAD TO DO, AND WHY. reading-host.mjs says it: "one generation carries
// ONE authority lease with ONE schema_version, and rebuild/client stamps a
// reading `schema_version: 1` and a workout `schema_version: 2`". So A2 gave the
// weigh-in its own encrypted generation beside the workout's — two stores, two
// leases, two checkpoints, on one device.
//
// THE CRUX, EXECUTED (rebuild/m3/w6/test/local-schema-probe.mjs, and again as
// assertions in test/local-today-journey.test.mjs). Over lane C's local era —
// ONE generation whose single self-issued lease is schema_version 2
// (local-era.mjs LOCAL_ERA_SCHEMA_VERSION):
//
//   * the PUBLIC client configured at schemaVersion 2 REFUSES a weigh-in:
//     public-client.mjs:262-265 compares every operation in the sealed batch
//     against the verified lease and throws OPERATION_SCHEMA_MISMATCH / 20,
//     because ops.cjs:59 stamps a reading schema_version 1 (index.cjs:226 sets
//     `schema_version: workout ? 2 : undefined`).
//   * the PUBLIC client configured at schemaVersion 1 cannot even open it:
//     public-client.mjs:238 refuses LEASE_PROOF_UNPROVEN / 18 because the
//     era's lease is schema 2.
//   * rebuild/client itself has no such rule for a reading. index.cjs:206 gates
//     ONLY a workout on the lease schema (`if (workout && cfg.lease.schema_version
//     !== 2)`), so a reading rides the schema-2 lease through C1's own bridge and
//     lands in the SAME generation — acknowledged, one lease_id, one checkpoint.
//
// So the honest design is not "one client for both". It is ONE INSTALLATION,
// ONE REPOSITORY, ONE GENERATION, TWO WRITE PATHS:
//
//   weigh-in  ->  local-client.execute("weighIn")   (C1's bridge; rebuild/client)
//   workout   ->  composeWorkoutHost over client.hostBindings()  (public client)
//
// Both paths commit through the SAME repository handle, so they serialise on the
// repository's own compare-and-swap (repository.mjs:239 STALE_REVISION, retried
// by the bridge; :240 HEAD_CHANGED_WITHOUT_REVISION). Neither can overwrite the
// other's operations: a candidate staged against revision N is refused if N moved.
// The journey test proves that with an interleaved write.
//
// WHAT THE HOST MUST CALL, PRECISELY:
//   const era = await openTodayOverLocalEra({ ...device, athleteId, deviceId, clock });
//   const readings = await era.createReadingHost({ day });                 // today-model.cjs `readings`
//   const gymHost  = await era.createGymHost({ day, engineState, plannedSplitSlotId });
// era.createReadingHost / era.createGymHost return EXACTLY the shapes
// reading-host.mjs and gym-host.mjs return today, so today-model.cjs,
// today-entry.mjs, gym-model.mjs and gym-app.mjs bind to them unchanged.
//
// WHAT IS GONE, relative to the two synthetic hosts it replaces: the constant
// IDENTITY_KEY, the static ENROLMENT_EVIDENCE (any partial erasure silently
// re-enrolled over it), the page-minted AES/P-256 device keys, the fixed-window
// lease, and the second generation. The era's identity key, authority key and
// lease are the installation's own (local-era.mjs), sealed inside the generation
// they authorize; key custody is local-keys.mjs; first run is evidenced by an
// observation, and partial erasure is restore-required, never a re-enrolment.
import { openLocalDurableClient } from "./local-client.mjs";
import { openLocalDeviceIdentity } from "./local-keys.mjs";
import { LOCAL_ERA_SCHEMA_VERSION } from "./local-era.mjs";
import Client from "../../../client/index.cjs";
import { StorageFailure } from "../repository.mjs";
import { createDurablePublicClient } from "../public-client.mjs";
import { parseStrictJson } from "../strict-json.mjs";
import { projectWorkoutRecords } from "../../../m4/workout/project-history.mjs";
import { composeWorkoutHost } from "../host/workout-host.mjs";
// CommonJS collaborators taken as DEFAULT imports, the way the accepted host
// entry and the page's own gym-host.mjs take them.
import Source from "../../w5/source/codec.cjs";
import Capture from "../../../m4/workout/capture.cjs";
import Commands from "../../../m4/workout/commands.cjs";
import Adapter from "../../../m4/workout/engine-capture.cjs";
import History from "../../../m4/workout/engine-history.cjs";
import SourceProjection from "../../../m4/workout/source-projection.cjs";
import WorkoutBasis from "../../../m4/workout/workout-basis.cjs";
import ResumePolicy from "../../../m4/workout/resume-policy.cjs";
import HostRuntime from "../host/engine-runtime-host.cjs";
import NativeTrend from "../../../m4/workout/native-trend-context.cjs";
import LegacyOrder from "../../../m4/workout/legacy-order-mapping.cjs";
import NativeLoadEffects from "../../../m4/workout/native-load-effects.cjs";

const { createNullLaneWorkoutBasis } = WorkoutBasis;
const { createWorkoutResumePolicy } = ResumePolicy;

export const TODAY_DATABASE = "earned-today-local";
export const TODAY_NAMESPACE = "earned-today/device-A";

/* The product values A2's gym-host.mjs exports, restated here as DEFAULTS so this
   module imports nothing from the page it replaces (w6 must not depend on
   w7-preview, and after the swap gym-host.mjs is gone). They are OPTIONS, so a
   real host can pass its own. test/local-today-journey.test.mjs pins every one of
   them against the page's own exports, so a change there turns this file red. */
export const PLAN_BASIS = "NO_ACCEPTED_PLAN";
export const INPUT_BASIS = "native-only/zero-import";
export const RESUME_REASON =
  "Recomputed on this device from the same stored plan; the instructions you started with are unchanged.";
/* P3-LAYOUT-V2 (DECISIONS:522). THE PAGE PRODUCES v2 FOR NEW CAPTURES AND GOES
   ON READING v1 FOR EVERY CAPTURE ALREADY RECORDED. The old app's working load
   is not always a number - his bodyweight raise is `BW` and his hack squat is
   `hold` - and the v1 producer refuses to prescribe one at all
   (engine-capture.cjs:66 ENGINE_CAPTURE_LOAD_UNPROVEN), which left his whole
   LOWER day without a card after a successful import. Only `rule_profile`
   moves: every other field of this identity is unchanged, which is what lets
   workout-host.mjs mint the v1 SIBLING reader for the captures already on the
   device. This is the option an era takes by default and a caller may name its
   own (openTodayOverLocalEra `producerIdentity`). */
export const PRODUCER = Object.freeze({ app_build: "earned-today-preview",
  engine_build: "accepted-native-carriers", rule_profile: Adapter.CONFIGURATION_PROFILE,
  source_schema: "w7-preview-synthetic" });

/* ---------------------------------------------------------------------------
   THE CAUSAL FRONTIER. A2's two pure functions. They live here ONCE — gym-host.mjs
   re-exports them, so `GymHost.causalTips === causalTips` is an identity rather
   than a source comparison. Provenance:
   rebuild/m3/w7-preview/today/gym-host.mjs causalTips / startOrderRefusalOf,
   written under A2 review round 2; made class-scoped by C4c (A3 review F2).
   --------------------------------------------------------------------------- */
/* C4c — A3 REVIEW F2. THE WORKOUT ORDER IS class "session", AND THIS IS AN
   ALLOWLIST, NOT A DENYLIST.

   A2 wrote this filter when the workout owned a generation by itself, so "every
   op with causal_parents" and "every op of the workout order" were the same set.
   They are not any more. ONE STORE put the morning reading (class "reading") in
   this generation, and C4c puts the recovery check-in (class "event", A3's
   earned/recovery-checkin/v1 fact) in it too. Left kind-blind, a check-in fact
   would be taken as a causal TIP and the next Start would descend from it —
   ordering a workout behind a wellness answer, which is exactly what A3's F2
   said whoever unified the lanes must prevent. It was already happening to the
   weigh-in: before this change, day 1's first Start descended from that
   morning's reading.

   The workout order is therefore named positively: `class === "session"`. That
   is session-start, session-set, session-skip, session-close, and the workout
   EDITS — an Undo's tombstone is written class "session" too (measured, not
   assumed; a reading's tombstone is class "reading" and is correctly excluded).
   An allowlist because C1b review F1 already learned this lesson once: a
   denylist of "not reading, not event" would silently admit any class a future
   package adds. A class this set does not name does not order a workout. */
export const WORKOUT_ORDER_CLASS = 'session';
const graphOps = generation => Object.values(generation?.collections?.ops || {})
  .filter(op => op && typeof op.op_id === 'string' && Array.isArray(op.causal_parents)
    && op.class === WORKOUT_ORDER_CLASS);

export function causalTips(generation) {
  const rows = graphOps(generation);
  const claimed = new Set();
  for (const op of rows) for (const parent of op.causal_parents) claimed.add(parent);
  return rows.filter(op => !claimed.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map(op => op.op_id);
}

function reachedFrom(generation, parents) {
  const ops = generation?.collections?.ops || {};
  const seen = new Set(), stack = Array.isArray(parents) ? parents.slice() : [];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    const op = ops[id];
    if (op && Array.isArray(op.causal_parents)) stack.push(...op.causal_parents);
  }
  return seen;
}

export function startOrderRefusalOf(generation, resolvedParents) {
  const starts = graphOps(generation).filter(op => op.kind === 'session-start');
  if (!starts.length) return null;              // nothing on disk to descend from
  const reached = reachedFrom(generation, resolvedParents);
  const orphans = starts.filter(op => !reached.has(op.op_id));
  if (!orphans.length) return null;
  return Object.freeze({ code: 'WORKOUT_START_ORDER_UNPROVEN',
    reason: 'this session would not descend from ' + orphans.length
      + ' session(s) already recorded on this device, and the accepted order resolver cannot order it' });
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/* S4 REAL DAY — the two facts a device knows about itself, taken from ITS OWN
   zone (DECISIONS:432). `localDayOf` is the calendar date the athlete is
   standing on, formatted YYYY-MM-DD; `localOffsetOf` is the civil offset in
   force AT THAT INSTANT, so a summer instant reads -04:00 and a winter one
   -05:00 on the same machine. Both are plain Date arithmetic over the host's
   zone — the same arithmetic wallClock() below has always used — so no zone
   name is invented and no table is carried. */
export function localDayOf(at) {
  return new Date(at.getTime() - at.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
export function localOffsetOf(at) {
  const pad = value => String(Math.floor(Math.abs(value))).padStart(2, "0");
  const minutes = -at.getTimezoneOffset();
  return (minutes < 0 ? "-" : "+") + pad(minutes / 60) + ":" + pad(Math.abs(minutes) % 60);
}

/* The page's own clocks, restated: the client wants ISO strings, the engine
   readers want a Date.

   WITHOUT `live` these are byte-for-byte the clocks this module has always
   built: one pinned instant on the host's own day (13:00Z, -05:00, hour 8,
   monotonicMs 0), as gym-host.mjs and today-model.cjs pin them. Every caller
   that declares its day — every fixture, every check script, every suite —
   still gets exactly that, so no recorded figure moves.

   WITH `live` (a function returning the instant NOW) they are the REAL device
   clock: the ISO stamp is this instant, the offset is the offset in force at
   this instant, the hour is the local hour, and monotonicMs is performance.now.
   `tz` is a GETTER because rebuild/client reads it once when it binds
   (index.cjs:46) and an eager string would freeze the offset at module load
   rather than at bind. The day is still the HOST'S day argument and never the
   clock's: which day a host stands on is decided by its caller (C4b-D1), and
   this only answers "when is now" for the operations that host writes. */
export const clientClockFor = (day, live) => (live
  ? { today: () => day, now: () => live().toISOString(),
      get tz() { return localOffsetOf(live()); },
      monotonicMs: () => (typeof performance !== "undefined" && typeof performance.now === "function"
        ? performance.now() : Date.now()) }
  : { today: () => day, now: () => day + "T13:00:00.000Z",
      tz: "-05:00", monotonicMs: () => 0 });
const engineClockFor = (day, live) => (live
  ? { today: () => day, hour: () => live().getHours(),
      now: () => live(), stamp: () => live().toISOString() }
  : { today: () => day, hour: () => 8,
      now: () => new Date(day + "T13:00:00.000Z"), stamp: () => day + "T13:00:00.000Z" });

/* The INSTALLATION clock a caller gets when it brings a live instant provider
   and no clock of its own. Its day is live too — a direct caller has no
   `state.day` to adopt through, so the honest answer to "what day is this
   installation stamping with" is "whatever day it is on the device now". A
   caller that hands over an explicit `clock` still wins, as it always did. */
const liveEraClock = live => ({ today: () => localDayOf(live()), now: () => live().toISOString(),
  get tz() { return localOffsetOf(live()); },
  monotonicMs: () => (typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now() : Date.now()) });

/* ONE installation. Opened once per page load, handed to both hosts.
   `enroll` is the only thing that may create an era, and it runs only when C1
   observed all three first-run signals absent. Anything else — a missing key
   database, a missing enrollment marker, an unreadable generation — arrives here
   as a THROWN StorageFailure carrying C1's own code, so a partially erased device
   says restore-required instead of quietly starting a second life. */
export async function openTodayOverLocalEra({
  indexedDB = globalThis.indexedDB, crypto = globalThis.crypto,
  databaseName = TODAY_DATABASE, namespace = TODAY_NAMESPACE,
  athleteId, deviceId, clock, liveDay, live = null,
  enroll = true, cleanInit,
  producerIdentity = PRODUCER, planBasis = PLAN_BASIS, inputBasis = INPUT_BASIS,
  resumeReason = RESUME_REASON, nativeTrendContext,
} = {}) {
  const prescriptionCapture = Capture.createPrescriptionCapture({ parseStrictJson,
    profile: Capture.SOURCE_PROFILE, sourceCodec: Source });
  const workoutCommands = Commands.createWorkoutCommands({ prescriptionCapture });
  const eraClock = clock || (live ? liveEraClock(live) : clock);
  /* NATIVE-LOAD FC08 (NATIVE-LOAD-SPEC R7; DECISIONS:784-785). The trusted native-load
     capability is installed HERE, at construction, and nowhere else: its ticket registry
     is private to this installation, so a caller can hand the durable client nothing but
     an opaque ticket this module issued for an issuance it holds. */
  const nativeTickets = createNativeLoadTickets(crypto);
  const client = await openLocalDurableClient({ indexedDB, crypto, databaseName, namespace,
    athleteId, deviceId, clock: eraClock, workoutCommands, nativeLoad: nativeTickets.capability });

  try {
    const opening = client.status();
    if (opening.state === "first-run") {
      if (!enroll) throw new StorageFailure("LOCAL_FIRST_RUN", 18);
      const enrolled = await client.enroll(cleanInit);
      if (enrolled.enrolled !== true) throw new StorageFailure(enrolled.code || "LOCAL_ENROLLMENT_FAILED", enrolled.state ?? 3);
    }
    const booted = await client.boot();
    // NEVER a re-enrolment. C1's own verdict is the answer, code and state intact.
    if (booted.ready !== true) throw new StorageFailure(booted.code || "LOCAL_HOST_BINDINGS_BOOT_REQUIRED", booted.state ?? 18);
    return buildEra({ client, prescriptionCapture, workoutCommands, booted, indexedDB, crypto,
      databaseName, namespace, athleteId, deviceId, clock: eraClock, liveDay, live, producerIdentity, planBasis, inputBasis,
      resumeReason, nativeTrendContext, nativeTickets });
  } catch (error) { client.close(); throw error; }
}

/* FC08: the capability's ticket registry. validate() runs inside the T2 stage against
   the generation actually staged: an unknown ticket refuses CAPABILITY_REQUIRED and a
   generation whose operations differ from the one the host re-evaluated refuses
   STALE_OFFER, so a raced write can never carry an old yes to disk. */
function createNativeLoadTickets(crypto) {
  const tickets = new Map();
  const keyOf = generation => JSON.stringify(Object.values(generation?.collections?.ops || {})
    .map(op => [op && op.op_id, op && op.canonical_content_commitment]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)));
  const fresh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, "0")).join("");
  return Object.freeze({
    keyOf,
    issue(entry) { const id = fresh(); tickets.set(id, structuredClone(entry)); return id; },
    retire(id) { tickets.delete(id); },
    capability: Object.freeze({ validate(generation, args) {
      const held = args && typeof args.ticket === "string" ? tickets.get(args.ticket) : undefined;
      if (!held) return { refusal: { code: "NATIVE_LOAD_CAPABILITY_REQUIRED" } };
      if (keyOf(generation) !== held.key) return { refusal: { code: "NATIVE_LOAD_STALE_OFFER" } };
      return { proposalId: held.proposalId, issuance: structuredClone(held.issuance) };
    } }),
  });
}

function buildEra({ client, prescriptionCapture, workoutCommands, booted, indexedDB, crypto,
  databaseName, namespace, athleteId, deviceId, clock, liveDay, live = null, producerIdentity, planBasis, inputBasis,
  resumeReason, nativeTrendContext, nativeTickets }) {
  let open = true;
  const ignored = [];
  const assertOpen = () => { if (!open) throw new StorageFailure("LOCAL_CLIENT_CLOSED", 3); };
  /* The device options the two page hosts take today. This installation already
     holds all three, so they are not re-taken: a second IndexedDB factory or a
     second key custody on one page is exactly the split this module removes. A
     MISMATCH is refused by name; a caller-minted `deviceKeys` is ignored and
     RECORDED, never quietly honoured. */
  function reconcile(where, options) {
    if (options.indexedDB !== undefined && options.indexedDB !== indexedDB)
      throw new StorageFailure("LOCAL_ERA_STORE_MISMATCH", 3);
    if (options.crypto !== undefined && options.crypto !== crypto)
      throw new StorageFailure("LOCAL_ERA_CRYPTO_MISMATCH", 3);
    if (options.databaseName !== undefined && options.databaseName !== databaseName)
      throw new StorageFailure("LOCAL_ERA_DATABASE_MISMATCH", 3);
    if (options.namespace !== undefined && options.namespace !== namespace)
      throw new StorageFailure("LOCAL_ERA_NAMESPACE_MISMATCH", 3);
    /* C4b-D1. A caller that hands a HOST its own clock is asking for the one
       thing this module may not infer: which day the operations it writes are
       stamped with. A host's day comes from its `day` argument and from nowhere
       else, so a second, possibly disagreeing clock is refused BY NAME rather
       than quietly dropped — the silent drop is what stranded a Start. */
    if (options.clock !== undefined) throw new StorageFailure("LOCAL_ERA_CLOCK_MISMATCH", 3);
    if (options.deviceKeys !== undefined) ignored.push(where + ": deviceKeys (the local era holds its own non-extractable key custody — local-keys.mjs)");
  }

  /* ------------------------------------------------------------------ readings
     The reading-host.mjs shape, member for member, over C1's execute() path.
     Every value here is the CLIENT'S own published face — the same bridge that
     wrote it republishes it — so a read can never disagree with a write. */
  async function createReadingHost(options = {}) {
    assertOpen();
    reconcile("createReadingHost", options);
    const { day } = options;
    if (typeof day !== "string" || !DAY_RE.test(day)) throw new TypeError("createReadingHost requires day");
    let alive = true;
    const face = () => { const current = client.current(); return current && current.view ? current.view : null; };
    function reads() {
      const view = face();
      const rows = view && view.layer1 && Array.isArray(view.layer1.reads) ? view.layer1.reads : [];
      return rows
        .filter(row => row && typeof row.date === "string" && typeof row.lb === "number" && Number.isFinite(row.lb))
        .slice()
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    }
    // The reading host's own day, for the same reason the gym host has one.
    const sealed = (await client.hostBindings({ workoutCommands, clock: clientClockFor(day, live) })).repository;
    const lease = (await sealed.load()).generation.metadata.authorityLease;
    return Object.freeze({
      repository: sealed, client, day, namespace, databaseName,
      // No page-minted key record exists here, and none is invented: key custody
      // is the installation's (local-keys.mjs), non-extractable and unexported.
      device: null, deviceKeyCustody: "local-keys.mjs",
      // The era's own P-256 lease as sealed in the generation. Public half only —
      // the era's identityKey and authorityKey are never exposed by this module.
      lease,
      openedRefusal: null,
      face, reads,
      paint: () => { const view = face(); return view ? view.paint : null; },
      label: () => { const view = face(); return (view && view.layer1 && view.layer1.label) || ""; },
      blockedCopy: () => {
        const view = face();
        if (!view) return null;
        return (view.layer2 && view.layer2.copy) || (view.layer1 && view.layer1.label) || null;
      },
      /* ONE durable transaction into the SHARED generation. rebuild/client stamps
         it schema_version 1 and index.cjs:206 does not gate a reading on the
         lease schema, so the era's schema-2 lease admits it — the crux, executed
         in test/local-schema-probe.mjs. */
      async weighIn({ date, lb } = {}) {
        if (!alive) return { ok: false, state: 3, copy: null, code: "LOCAL_CLIENT_CLOSED", op_id: null };
        const result = await client.execute("weighIn", { date, lb });
        return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      async restart() { return client.boot(); },
      outboxRetained() {
        const view = face();
        return view && view.layer1 && Number.isSafeInteger(view.layer1.outbox) ? view.layer1.outbox : null;
      },
      /* Detaches THIS handle. It must not close the installation: the gym card is
         standing on the same repository. era.close() is what ends the page. */
      close() { alive = false; },
    });
  }

  /* --------------------------------------------------------------- the workout
     The gym-host.mjs shape, member for member, over composeWorkoutHost — the
     SAME accepted host A2 composes, with every durable-client member coming from
     client.hostBindings() instead of a page-minted synthetic one.

     Each handle takes its OWN hostBindings(): a fresh T2 stage closure and a
     fresh commit validator, over the SAME repository. Two live handles (today's
     card and the hostForDay used to retire an abandoned session) therefore
     cannot share staging state, and they serialise on the repository's CAS. */
  async function createGymHost(options = {}) {
    assertOpen();
    reconcile("createGymHost", options);
    const { day, engineState, plannedSplitSlotId } = options;
    if (typeof day !== "string" || !DAY_RE.test(day)) throw new TypeError("createGymHost requires day");
    if (!engineState || !Array.isArray(engineState.exercises)) throw new TypeError("createGymHost requires engineState");
    if (typeof plannedSplitSlotId !== "string" || !plannedSplitSlotId.trim()) throw new TypeError("createGymHost requires plannedSplitSlotId");

    /* C4b-D1 — THE HOST'S OWN CLOCK, all the way down. These bindings carry the
       T2 stage that STAMPS every operation this host writes; composeWorkoutHost
       below is handed `{ today: () => day }` and the engine runtime
       `engineClockFor(day)`. All three are the SAME day, so an operation's
       recorded day always equals the day the host that wrote it stands on — the
       invariant the accepted resume policy and engine-order.cjs read. Before
       this, the stage came from the installation (the first caller's day) while
       the host stood on its own: a Start written on day 2 was stamped day 1 and
       the next read refused it WORKOUT_HISTORY_RECONCILIATION_REQUIRED forever. */
    const bindings = await client.hostBindings({ workoutCommands, clock: clientClockFor(day, live) });
    let alive = true;
    // B-NTC's qualified default lives at C4's actual shared-store composition.
    // An explicitly injected resolver remains the caller's; storage, clocks,
    // causal parents and commit validation still come from the local era.
    let dayReader = null;
    const trendBinding = NativeTrend.createNativeTrendContextBinding({ dayFacts: iso => {
      if (!dayReader) throw new Error("GYM_NATIVE_TREND_DAY_READER_UNCOMPOSED");
      return dayReader.dayFacts(iso);
    } });
    const runtime = HostRuntime.createEngineRuntime({ clock: engineClockFor(day, live),
      nativeTrendContext: nativeTrendContext || trendBinding.resolve });
    dayReader = NativeTrend.createDayFactsReader({ state: engineState, engine: runtime });
    // readPrevious runs after the producer returns. Scope each engine read to
    // its own facts, restoring a surrounding window after nested reads.
    const scoped = (facts, run) => facts ? trendBinding.withFacts(facts, run) : run();

    /* B-LOM. THE LEGACY ORDER MAPPING, supplied HERE and nowhere else.

       rebuild/engine/performed.cjs:176-183 wants two things on the state it is
       handed: workoutFacts.legacy_baseline, whose `session_log` must be the SAME
       OBJECT as `s.sessionLog`, and workoutFacts.order.import_anchor carrying
       the same two ids. The reference is the whole difficulty. The state and the
       facts reach the engine from two different clones - the null registrar
       clones each separately (m4/workout/source-projection.cjs), and the gym
       card's previous-performance read clones each separately again
       (w7-preview/today/gym-model.mjs:213-215) - so a baseline attached before
       either clone arrives naming a DIFFERENT log object and is refused. This
       seam is the last place the two meet: every engine read on this
       installation, the producer's prescription and the card's own previous-
       performance read alike, passes through these two functions, and the state
       they build joins the log and the facts in one object. gym-model.mjs is
       therefore NOT edited; the identity holds without it.

       `attach` returns a new facts object and mutates neither argument, and the
       spread below keeps `sessionLog` the very object the caller passed, so the
       baseline names the log the engine is reading. An installation that has
       admitted no import gets `mapping === null` and is handed its own state
       unchanged, byte for byte, exactly as before this existed.

       B-NTC's bind window (G8 / r2 R11) is UNTOUCHED and keeps its own rule:
       both forwarders still open it on `s.workoutFacts`, the caller's own facts,
       per read and restoring. What `attach` adds is `legacy_baseline` and
       `order.import_anchor` and nothing else - `sessions`, `source_revision` and
       every Start are the same members, carried by reference through the spread
       - so the revision, unique-Start and effective-tuple correspondence that
       window exists to check reads exactly what it read before. */
    /* CONTAINED HERE, round 2 (review R3 MAJOR 2). A refusal is a CARD refusal,
       never a boot failure. today-entry.mjs awaits createGymHost uncaught, so a
       provider refusal thrown from this line used to take the whole page down
       and the athlete got no screen at all - where the base, on the identical
       corrupt record, left Today standing and the card blocked by name. So the
       refusal is CAUGHT here and carried, and it is re-thrown at the one place
       it belongs: inside the engine read, on a state that actually carries an
       imported log, where the card's own refusal path turns it into a blocked
       card with this code on it, exactly as it turned the engine's
       PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED into one before B-LOM existed.
       Every other lane of Today - the plan, the weigh-in, food, sleep, the
       reading host - boots and reads as it always did. Only this module's own
       refusal is caught: anything else thrown here is a defect and still
       propagates. */
    let mapping = null, mappingRefusal = null;
    try {
      const localSelection = LegacyOrder.activeLocalSelection(
        (await bindings.repository.load()).generation);
      if (localSelection)
        mapping = LegacyOrder.createLegacyOrderMapping({ selection: localSelection });
    } catch (error) {
      if (!error || error.code !== LegacyOrder.REFUSAL) throw error;
      mappingRefusal = error.code;
    }
    const composed = s => {
      const imported = !!(s && s.workoutFacts && s.sessionLog && Object.keys(s.sessionLog).length);
      if (mappingRefusal && imported) {
        const error = new Error(mappingRefusal); error.code = mappingRefusal; throw error;
      }
      return mapping && imported ? { ...s, workoutFacts: mapping.attach(s.workoutFacts, s) } : s;
    };
    const engine = Object.freeze({
      genSession: (s, iso, slp) => scoped(s && s.workoutFacts, () => runtime.genSession(composed(s), iso, slp)),
      rirPlan: (s, ex, slp) => scoped(s && s.workoutFacts, () => runtime.rirPlan(composed(s), ex, slp)) });

    /* The ORDER the engine reads has to be a PROVEN one, not one this module
       asserts. composeWorkoutHost's projectWorkoutHistory calls project() with
       no import anchor, so order.import_anchor is simply absent and attaching it
       afterwards would claim an order law nobody ran. Forwarding this mapping's
       anchor makes rebuild/m4/workout/engine-order.cjs run its import rules over
       the recorded selection: a native Start the recorded order map does not
       cover still refuses WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN, and the anchor
       that comes back on `order` is the one that law derived. The host file is
       pinned and unedited; only the collaborator it is handed is wrapped. */
    const createEngineHistoryProjector = config => {
      const base = History.createEngineHistoryProjector(config);
      return Object.freeze({ ...base, project: (history, generation, options = {}) =>
        base.project(history, generation,
          mapping ? { ...options, importAnchor: mapping.anchor } : options) });
    };

    /* NATIVE-LOAD FC08 (NATIVE-LOAD-SPEC R7, "Guarded durable command"): the existing
       null registrar, DECORATED. register() runs the one source fold first, from the
       immutable supplied state, the authenticated generation and the registered facts,
       and hands the reconstructed programme to the REAL registrar; workoutInput stays
       the real registrar's identity-gated reader. New captures and the card therefore
       read the accepted native effects and their landings, and a refused fold refuses
       the new prescription by name. No captured Start is touched. */
    const nativeEngine = Object.freeze({ revision: NativeLoadEffects.PRODUCER_REVISION,
      at: d => HostRuntime.createEngineRuntime({ clock: engineClockFor(d, live),
        nativeTrendContext: nativeTrendContext || trendBinding.resolve }) });
    const nativeLoadRegistrar = config => {
      const real = SourceProjection.createNullSelectionRegistrar(config);
      return Object.freeze({ ...real, register(args = {}) {
        const fold = NativeLoadEffects.foldNativeLoad({ base: args.state, generation: args.generation,
          workoutFacts: args.workoutFacts, engine: nativeEngine, athleteId });
        if (fold.status !== "ready") {
          const issue = fold.issues.find(x => NativeLoadEffects.BLOCKING_CODES.includes(x.code)) || { code: "NATIVE_LOAD_RECORD_INVALID" };
          const error = new Error(issue.code); error.code = issue.code; throw error;
        }
        /* Spec :156-157: a lift on this day's card whose accepted basis is disputed
           (BASIS_REPAIR_REQUIRED) or whose native record is refused by name makes the
           new prescription unavailable, by that code; the card never offers the old
           accepted load as current advice. Other days and every fact save stand. */
        const member = runtime.sessionMembership(fold.state, day);
        const onCard = new Set(member ? member.exercise_ids : []);
        const held = fold.issues.find(x => onCard.has(x.lift) && (x.code === "NATIVE_LOAD_BASIS_REPAIR_REQUIRED" || NativeLoadEffects.BLOCKING_CODES.includes(x.code)));
        if (held) {
          const error = new Error(held.code); error.code = held.code;
          if (held.code === "NATIVE_LOAD_BASIS_REPAIR_REQUIRED")
            error.reason = "Disputed: a workout behind your agreed next weight was corrected after you agreed, so that weight is not current advice.";
          throw error;
        }
        const state = { ...fold.state }; delete state.workoutFacts;
        return real.register({ ...args, state });
      } });
    };

    /* THE CAUSAL FRONTIER, DERIVED FROM THE DURABLE LOG ON EVERY RESOLUTION —
       A2 review round 2's finding, kept exactly: nothing is remembered across
       page loads, and the parents the guard checks are the parents the resolver
       actually produced for THIS generation. */
    let lastResolved = [];
    const nullLaneBasis = createNullLaneWorkoutBasis({ sourceCodec: Source,
      planBasis, inputBasis, causalParents: () => lastResolved.slice() });
    function resolveWorkoutBasis(generation, ...rest) {
      lastResolved = causalTips(generation);
      return nullLaneBasis(generation, ...rest);
    }

    const host = composeWorkoutHost({
      ...bindings,
      /* A detached handle is no longer the current session, so a write that
         outlives it is refused by the public client rather than reaching a live
         repository. The installation's own answer still has to agree. */
      isCurrentSession: epoch => alive === true && bindings.isCurrentSession(epoch),
      createDurablePublicClient,
      createNullSelectionRegistrar: nativeLoadRegistrar,
      createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
      createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
      createEngineHistoryProjector,
      createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
      prescriptionCapture, sourceCodec: Source, engine, engineState,
      clock: { today: () => day },
      workoutProducerIdentity: producerIdentity, resolveWorkoutBasis,
      resumeReason, plannedSplitSlotId });

    async function startOrderRefusal() {
      return startOrderRefusalOf((await bindings.repository.load()).generation, lastResolved.slice());
    }

    return Object.freeze({ host, repository: bindings.repository, engine, day, plannedSplitSlotId,
      device: null, deviceKeyCustody: "local-keys.mjs", bindings,
      trendBinding, trendDayReader: () => Object.freeze({
        enginePredicates: dayReader.enginePredicates,
        enginePredicatesAvailable: dayReader.enginePredicatesAvailable }),
      causalParents: () => lastResolved.slice(),
      causalTipsNow: async () => causalTips((await bindings.repository.load()).generation),
      startOrderRefusal,
      // Detaches THIS handle only — see createReadingHost().close().
      close() { alive = false; } });
  }

  /* ------------------------------------------------------- native load (FC08)
     NATIVE-LOAD-SPEC R7 createNativeLoadHost(scope) -> {project, check, respond, close}.
     The trusted installation binding: it loads and authenticates through the SAME
     host bindings the workout uses (its own gym handle over this repository), builds
     the fold and the evaluation from that one generation, and keeps every issuance
     behind an opaque handle. The page receives display values and a handle, never an
     editable issuance. A yes re-evaluates against a freshly loaded generation and
     commits through the installation's trusted capability (FC06/FC07); a decline or a
     cancel writes nothing. Imported (string-lane) generations are refused
     SOURCE_FRONTIER_UNPROVEN here: their admission family (FC09/FC10) is not built. */
  async function createNativeLoadHost(options = {}) {
    assertOpen();
    reconcile("createNativeLoadHost", options);
    const { day, engineState } = options;
    if (typeof day !== "string" || !DAY_RE.test(day)) throw new TypeError("createNativeLoadHost requires day");
    if (!engineState || !Array.isArray(engineState.exercises)) throw new TypeError("createNativeLoadHost requires engineState");
    const gym = await createGymHost({ day, engineState, plannedSplitSlotId: "native-load/" + day });
    let alive = true;
    const handles = new WeakMap();
    const nullSource = Source.basis({ W: 0, log_digest: Source.createPrefixHasher().digest(), selection_id: null });
    const engine = Object.freeze({ revision: NativeLoadEffects.PRODUCER_REVISION,
      at: d => HostRuntime.createEngineRuntime({ clock: engineClockFor(d, live),
        nativeTrendContext: nativeTrendContext || gym.trendBinding.resolve }) });
    const refused = (code, extra = {}) => ({ acknowledged: false, state: 3, code, copy: null, ...extra });
    // `base` lets the page fold from ITS immutable basis (spec B: the fold always reloads
    // its immutable source base, never a state already handed to adoptBasis).
    async function project(base = engineState) {
      if (!alive) return { ok: false, code: "NATIVE_LOAD_CAPABILITY_REQUIRED" };
      if (!base || !Array.isArray(base.exercises)) return { ok: false, code: "NATIVE_LOAD_RECORD_INVALID" };
      const snap = await gym.repository.load();
      const imported = snap.generation.collections?.[Source.COLLECTION];
      if (imported && typeof imported === "object" && Object.keys(imported).length) return { ok: false, code: "NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN" };
      const read = await gym.host.client.readWorkoutHistory();
      if (!read || read.read !== true) return { ok: false, code: (read && read.code) || "NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN" };
      if (read.source_revision !== snap.revision) return { ok: false, code: "NATIVE_LOAD_STALE_OFFER" };
      const workoutFacts = gym.host.historyProjector.project(read.history, snap.generation, { sourceRevision: read.source_revision });
      const args = { base, generation: snap.generation, workoutFacts, engine, source: nullSource, athleteId,
        plan: { plan_basis: planBasis, input_basis: inputBasis } };
      const fold = gym.trendBinding.withFacts(workoutFacts, () => NativeLoadEffects.foldNativeLoad(args));
      const newest = new Map();
      for (const id of (workoutFacts && workoutFacts.order ? workoutFacts.order.start_ids : [])) {
        const session = workoutFacts.sessions.find(s => s.start_op_id === id);
        for (const e of (session ? session.record.entries : [])) if (e && e.completion) newest.set(e.lift_lineage_id, { lift_lineage_id: e.lift_lineage_id,
          completion_op_id: e.completion.op_id, normal: e.completion.kind === "normal", date: session.effective.local_date });
      }
      return { ok: true, snap, workoutFacts, args, fold, lifts: [...newest.values()] };
    }
    const evaluate = (p, request) => gym.trendBinding.withFacts(p.workoutFacts, () => NativeLoadEffects.checkNativeLoad({ ...p.args, request })).evaluation;
    async function savedResponse(held) {
      const p = await project();
      const ops = Object.values((p.ok ? p.snap.generation : (await gym.repository.load()).generation).collections?.ops || {});
      const rejected = (p.ok ? p.snap.generation : { collections: {} }).collections?.rejected || {};
      const op = ops.find(o => o && o.class === "plan" && o.kind === "proposal-response" && !rejected[o.op_id] && o.payload &&
        o.payload.proposal_id === held.proposal_id && JSON.stringify(o.payload.issuance) === JSON.stringify(held.issuance));
      if (!op || !p.ok || !p.fold || !p.fold.spent.some(x => x.spend_id === held.issuance.body.spend_id)) return null;
      return op;
    }
    return Object.freeze({
      day,
      async project({ base } = {}) {
        const p = await project(base === undefined ? engineState : base);
        if (!p.ok) return { ok: false, code: p.code };
        return { ok: true, status: p.fold.status, state: p.fold.state ? structuredClone(p.fold.state) : null,
          effects: structuredClone(p.fold.effects), issues: structuredClone(p.fold.issues), lifts: structuredClone(p.lifts),
          revision: p.snap.revision };
      },
      async check(request = {}) {
        const p = await project();
        if (!p.ok) return { status: "refused", offers: [], refusal: { code: p.code, refs: [], field: null } };
        const evaluation = evaluate(p, { lift_lineage_id: request.lift_lineage_id, completion_op_id: request.completion_op_id,
          intent: request.intent === undefined ? "check" : request.intent });
        const moment = clock.now();
        const offers = evaluation.status !== "offer" ? [] : evaluation.offers.map(offer => {
          const { proposal_id, issuance } = NativeLoadEffects.issuanceFor(offer, { revision: engine.revision, source: JSON.stringify(nullSource), moment });
          const handle = Object.freeze({ profile: "earned/native-load-handle/v1" });
          handles.set(handle, { proposal_id, issuance, request: structuredClone({ lift_lineage_id: request.lift_lineage_id,
            completion_op_id: request.completion_op_id, intent: request.intent === undefined ? "check" : request.intent }) });
          const body = offer.body;
          return Object.freeze({ handle, proposalId: proposal_id, lift: body.lift_lineage_id, kind: body.kind,
            state: body.candidate ? body.candidate.state : null, unit: "lb",
            loads: body.target_load.vector.map(v => v.value), current: body.base_load.vector.map(v => (v ? v.value : null)),
            reason: offer.reason });
        });
        return { status: evaluation.status, offers, refusal: evaluation.refusal ? structuredClone(evaluation.refusal) : null };
      },
      async respond({ handle, proposal_id, answer } = {}) {
        if (answer === "decline" || answer === "cancel") return { acknowledged: false, dismissed: true };
        if (answer !== "accept") return refused("NATIVE_LOAD_RECORD_INVALID");
        const held = alive && handle && typeof handle === "object" ? handles.get(handle) : undefined;
        if (!held) return refused("NATIVE_LOAD_CAPABILITY_REQUIRED");
        if (proposal_id !== held.proposal_id) return refused("NATIVE_LOAD_SCOPE_MISMATCH");
        const already = await savedResponse(held);
        if (already) return { acknowledged: true, alreadySaved: true, op_id: already.op_id };
        const p = await project();
        if (!p.ok) return refused(p.code);
        const evaluation = evaluate(p, held.request);
        const fresh = evaluation.status === "offer" && evaluation.offers.some(offer =>
          NativeLoadEffects.proposalDigest(NativeLoadEffects.PRODUCER, offer.body, offer.reason) === held.proposal_id);
        if (!fresh) return refused("NATIVE_LOAD_STALE_OFFER", { refusal: evaluation.refusal ? structuredClone(evaluation.refusal) : null });
        const ticket = nativeTickets.issue({ proposalId: held.proposal_id, issuance: held.issuance, key: nativeTickets.keyOf(p.snap.generation) });
        let result;
        try { result = await client.respondNativeLoad({ ticket }); }
        catch (error) { result = refused(error && error.code ? error.code : "STAGING_FAILED"); }
        finally { nativeTickets.retire(ticket); }
        if (result && result.acknowledged === true) return { acknowledged: true, op_id: result.op_id, durableRevision: result.durableRevision };
        // Lost acknowledgement: report already-saved only when the exact response is on disk AND folded.
        const late = await savedResponse(held);
        if (late) return { acknowledged: true, alreadySaved: true, op_id: late.op_id };
        return refused((result && result.code) || "NATIVE_LOAD_NOT_SAVED", { state: result && Number.isSafeInteger(result.state) ? result.state : 3 });
      },
      close() { alive = false; gym.close(); },
    });
  }

  /* ----------------------------------------------------------- the check-in
     C4c — A3's THIRD lane, folded into the SAME generation.

     A3 composed `checkin-host.mjs` exactly as `reading-host.mjs` composed the
     second lane: its own repository, its own lease, its own generation. Its
     header says why — "the check-in's operations are written through the
     client's producer-injected command, which the client stamps schema_version
     2 … so this lane's lease is schema 2 and it cannot live in the reading lane
     (schema 1)". That is true of the READING lane and it is the argument for a
     third generation only if the era's own lease is schema 1. It is schema 2
     (LOCAL_ERA_SCHEMA_VERSION), so a schema-2 producer command rides it exactly
     as a workout set does, and the check-in belongs in this generation.

     THE ONE THING THIS LANE SUPPLIES that the other two do not is its command
     producer. It is an ARGUMENT here, never an import: w6 does not depend on
     w7-preview, so the page passes its own `commands` (checkin-commands.cjs)
     and the `profile` its facts carry. Everything else — the repository, the
     T2 stage, the durable public client, the clock, the lease — is the
     installation's, shared with the weigh-in and the workout.

     Each handle takes its OWN hostBindings(), like the gym card: a fresh stage
     closure over the same repository, so the three lanes serialise on the
     repository's compare-and-swap and never share staging state. */
  async function createCheckInHost(options = {}) {
    assertOpen();
    reconcile("createCheckInHost", options);
    const { day, commands, profile } = options;
    if (typeof day !== "string" || !DAY_RE.test(day)) throw new TypeError("createCheckInHost requires day");
    if (!commands || typeof commands !== "object") throw new TypeError("createCheckInHost requires commands");
    if (typeof profile !== "string" || !profile) throw new TypeError("createCheckInHost requires profile");

    const bindings = await client.hostBindings({ workoutCommands: commands, clock: clientClockFor(day, live) });
    const lease = (await bindings.repository.load()).generation.metadata.authorityLease;
    const checkInClient = createDurablePublicClient({ ...bindings,
      schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
    const opened = await checkInClient.reopen();
    let alive = true;

    /* A3's read-back, carried and narrowed by ONE clause. The accepted client
       publishes no face for a check-in (A3 seam S1), so the rows are read out of
       the durable generation the repository just authenticated, as a FILTER and
       never an interpretation. The added clause is the profile match already
       being an exact-equality test doing the isolating work: in ONE generation
       it is what keeps a weigh-in (class "reading") and a workout set (class
       "session") out of this list, and it is why folding the lane in cannot make
       a check-in read anything that is not one. */
    function checkInsIn(generation) {
      const collections = generation?.collections || {};
      const rejected = collections.rejected || {};
      const dead = new Set(Object.values(collections.ops || {})
        .filter(op => op && op.kind === "tombstone" && typeof op.target_op_id === "string")
        .map(op => op.target_op_id));
      return Object.values(collections.ops || {})
        .filter(op => op && op.kind === "fact" && op.class === "event"
          && op.payload && op.payload.profile === profile
          && op.effective && typeof op.effective.local_date === "string"
          && !rejected[op.op_id] && !dead.has(op.op_id))
        .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
        .map(op => Object.freeze({
          op_id: op.op_id,
          date: op.effective.local_date,
          time: op.effective.local_time || null,
          offset: op.effective.utc_offset || null,
          answers: JSON.parse(JSON.stringify(op.payload.answers)),
        }));
    }

    const handle = {
      repository: bindings.repository, client: checkInClient, day, namespace, databaseName, lease,
      device: null, deviceKeyCustody: "local-keys.mjs",
      openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
      async all() { return checkInsIn((await bindings.repository.load()).generation); },
      async forDate(date) {
        if (typeof date !== "string" || !DAY_RE.test(date)) throw new TypeError("forDate requires a date");
        return (await handle.all()).filter(row => row.date === date);
      },
      async save(answers) {
        if (!alive) return { ok: false, state: 3, copy: null, code: "LOCAL_CLIENT_CLOSED", op_id: null };
        const result = await checkInClient.execute("workout", { action: "checkin", input: { answers } });
        return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      async restart() { return checkInClient.reopen(); },
      face() { const current = checkInClient.current(); return current && current.view ? current.view : null; },
      paint() { const view = handle.face(); return view ? view.paint : null; },
      blockedCopy() {
        const view = handle.face();
        if (!view) return null;
        return (view.layer2 && view.layer2.copy) || (view.layer1 && view.layer1.label) || null;
      },
      outboxRetained() {
        const view = handle.face();
        return view && view.layer1 && Number.isSafeInteger(view.layer1.outbox) ? view.layer1.outbox : null;
      },
      // Detaches THIS handle only — see createReadingHost().close().
      close() { alive = false; },
    };
    return Object.freeze(handle);
  }

  /* -------------------------------------------------------- the first run
     A4 (DECISIONS:117 (1)). Dad's first run writes ONE operation into THIS
     generation, through the same producer hook the check-in uses: the page
     hands its own `commands` (setup-commands.mjs) and the profile its fact
     carries, because w6 must not import w7-preview.

     ONE OP, ONCE. The question "has this device been set up?" is answered by
     the DURABLE record read back out of this generation by profile equality,
     never by a flag and never by localStorage. So a second tap, a second tab
     and a reinstall over the same store all find the op that is already there
     and write nothing: `save()` refuses before it reaches the client, and the
     client's own compare-and-swap over the generation is what makes that
     refusal a fact rather than an optimism. */
  async function createSetupHost(options = {}) {
    assertOpen();
    reconcile("createSetupHost", options);
    const { day, commands, profile } = options;
    if (typeof day !== "string" || !DAY_RE.test(day)) throw new TypeError("createSetupHost requires day");
    if (!commands || typeof commands !== "object") throw new TypeError("createSetupHost requires commands");
    if (typeof profile !== "string" || !profile) throw new TypeError("createSetupHost requires profile");

    const bindings = await client.hostBindings({ workoutCommands: commands, clock: clientClockFor(day, live) });
    const lease = (await bindings.repository.load()).generation.metadata.authorityLease;
    const setupClient = createDurablePublicClient({ ...bindings,
      schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
    const opened = await setupClient.reopen();
    let alive = true;

    /* The read-back, narrowed by profile equality exactly as checkInsIn is. In
       ONE generation that equality is what keeps a weigh-in (class "reading"),
       a workout set (class "session") and a recovery check-in (a different
       profile) out of this list. */
    function setupsIn(generation) {
      const collections = generation?.collections || {};
      const rejected = collections.rejected || {};
      const dead = new Set(Object.values(collections.ops || {})
        .filter(op => op && op.kind === "tombstone" && typeof op.target_op_id === "string")
        .map(op => op.target_op_id));
      return Object.values(collections.ops || {})
        .filter(op => op && op.kind === "fact" && op.class === "event"
          && op.payload && op.payload.profile === profile
          && op.payload.setup && typeof op.payload.setup === "object"
          && !rejected[op.op_id] && !dead.has(op.op_id))
        .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
        .map(op => Object.freeze({
          op_id: op.op_id,
          date: op.effective && op.effective.local_date ? op.effective.local_date : null,
          time: op.effective && op.effective.local_time ? op.effective.local_time : null,
          setup: JSON.parse(JSON.stringify(op.payload.setup)),
        }));
    }

    const handle = {
      repository: bindings.repository, client: setupClient, day, namespace, databaseName, lease,
      device: null, deviceKeyCustody: "local-keys.mjs",
      openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
      async all() { return setupsIn((await bindings.repository.load()).generation); },
      /* THE FIRST-RUN QUESTION, answered by the record. */
      async enrolled() { return (await handle.all()).length > 0; },
      async save(setup) {
        if (!alive) return { ok: false, state: 3, copy: null, code: "LOCAL_CLIENT_CLOSED", op_id: null };
        /* First run happens ONCE (BUILD-BRIEF 2.3, S13). Re-read the generation
           immediately before the write: a second tap or a second tab that got
           this far finds the op already there and writes nothing. */
        if (await handle.enrolled()) {
          return { ok: false, state: 0, copy: null, code: "SETUP_ALREADY_RECORDED", op_id: null };
        }
        const result = await setupClient.execute("workout", { action: "first-run-setup", input: { setup } });
        return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      async restart() { return setupClient.reopen(); },
      face() { const current = setupClient.current(); return current && current.view ? current.view : null; },
      blockedCopy() {
        const view = handle.face();
        if (!view) return null;
        return (view.layer2 && view.layer2.copy) || (view.layer1 && view.layer1.label) || null;
      },
      // Detaches THIS handle only — see createReadingHost().close().
      close() { alive = false; },
    };
    return Object.freeze(handle);
  }

  return Object.freeze({
    client, databaseName, namespace, athleteId, deviceId,
    // What C1's boot() reported about this installation: the era window, the
    // sidecar's freshness, any import still to be rebased. Never key material.
    installation: Object.freeze({ eraId: booted.eraId, leaseId: booted.leaseId,
      notBefore: booted.notBefore, notAfter: booted.notAfter, revision: booted.revision,
      ops: booted.ops, derivedStale: booted.derivedStale, derivedCode: booted.derivedCode,
      importRebaseRequired: booted.importRebaseRequired === true,
      leaseRenewedUntil: booted.leaseRenewedUntil || null }),
    createReadingHost, createGymHost, createCheckInHost, createSetupHost, createNativeLoadHost,
    /* C4b-D1. The day this installation's OWN writes (the weigh-in path, the
       lease window, the enrolment stamp) are stamped with, right now. Every host
       stamps its own `day` instead; see createGymHost. */
    liveDay: () => (typeof liveDay === "function" ? liveDay()
      : (typeof clock?.today === "function" ? clock.today() : null)),
    clockAdoptions: () => [],
    // Options a host handed over that this installation did not honour. Empty is
    // the expected answer once the page stops minting its own device material.
    ignored: () => ignored.slice(),
    generation: async () => (await client.hostBindings({ workoutCommands })).repository.load(),
    close() { if (!open) return; open = false; client.close(); },
  });
}

/* ---------------------------------------------------------------- C4b
   ONE INSTALLATION PER PAGE, and the page's own identity.

   After the swap, today/{reading-host,gym-host}.mjs are thin wrappers over this
   module and today-entry.mjs boots over it BY DEFAULT — so three call sites can
   ask for "this device's Today store" in one page load, and all three must get
   the SAME handle. Opening it twice would open two clients over one repository:
   two bridges, two published faces, and a write one of them cannot see.

   So the installation is memoized per (indexedDB, databaseName, namespace) and
   REFERENCE-COUNTED: each caller gets a facade whose close() detaches only that
   caller, and the last one out closes the client and drops the memo — which is
   what makes the next open a real relaunch, re-read from disk.

   THE ATHLETE is "owner": one athlete on one phone, until Dad's A4 first-run
   setup exists to name a second. THE DEVICE is minted once at random and kept
   in the key database (local-keys.mjs openLocalDeviceIdentity) — it has to be
   stable across launches because localEraConfig refuses an era whose sealed
   lease names another device. Neither is a credential.
   -------------------------------------------------------------------------- */
export const TODAY_ATHLETE = "owner";

/* THE CLIENT'S OWN WORDS for a state-18 refusal. A page that cannot open this
   device's installation must say what rebuild/client says — it must not invent a
   sentence, and it must never re-enrol over the record it could not read. */
export const RESTORE_REQUIRED = Client.copy.RESTORE_REQUIRED;

/* The page's real clock, for the era's lease window and the client's stamps.
   The SCREEN's day is a separate argument (`day`) on every host, exactly as it
   was: this one answers "when is now", not "which day is being shown". */
export function wallClock() {
  const pad = value => String(Math.floor(Math.abs(value))).padStart(2, "0");
  const offset = -new Date().getTimezoneOffset();
  return {
    now: () => new Date().toISOString(),
    today: () => { const at = new Date(); return new Date(at.getTime() - at.getTimezoneOffset() * 60000).toISOString().slice(0, 10); },
    tz: (offset < 0 ? "-" : "+") + pad(offset / 60) + ":" + pad(offset % 60),
    monotonicMs: () => (typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now()),
  };
}

const installations = new WeakMap();

/* C4b-D1 — THE LIVE CLOCK PROVIDER.
   One installation serves a whole page load, and a page load can be asked for a
   different day than the one it opened on: `today-entry.mjs` auto-boots at
   module load on the page's own day and never releases its holder, and A2's own
   gym-check.mjs conducts day 2 by calling boot({ today }) again in that same
   load. The C4b memo returned the existing era and DROPPED the later caller's
   clock in silence, so the installation's client kept stamping day one while the
   host stood on day two. That is a stranded Start, and it is the defect A2's own
   REJECT round named.

   So the installation's clock is now LIVE: one provider, read by the local
   client, by hostBindings, by the lease window check and by the enrolment stamp,
   whose day is a single mutable value. A later caller that declares a different
   day ADOPTS it — a page load that has moved to another day must stamp what it
   writes now on that day — and the adoption is RECORDED by name on
   `clockAdoptions()`, never silently honoured. ADOPT rather than REFUSE because
   the shipped page cannot release its holder, so refusing would strand day two
   rather than order it.

   The HOST half is independent and does not go through here: every host binds
   its own stage, host clock and engine clock to its own `day`
   (`createGymHost` / `createReadingHost` above), so two hosts on two days in one
   page load each stamp their own day correctly.

   S4 REAL DAY adds the second half of the same idea. The DAY half is unchanged
   — it is still `state.day`, still moved only by a recorded adoption — but the
   INSTANT half now follows the device when the page opened live: with `live`
   the era's lease window, the enrolment stamp and the client's own stamps read
   the real now and the real offset instead of the pinned 13:00Z / -05:00. With
   no `live` every value is byte-for-byte what it was. */
function liveClockOver(state, live) {
  return Object.freeze(live
    ? { today: () => state.day, now: () => live().toISOString(),
        get tz() { return localOffsetOf(live()); },
        monotonicMs: () => (typeof performance !== "undefined" && typeof performance.now === "function"
          ? performance.now() : Date.now()) }
    : { today: () => state.day, now: () => state.day + "T13:00:00.000Z",
        tz: "-05:00", monotonicMs: () => 0 });
}

export async function openTodayInstallation({
  indexedDB = globalThis.indexedDB, crypto = globalThis.crypto,
  databaseName = TODAY_DATABASE, namespace = TODAY_NAMESPACE,
  athleteId = TODAY_ATHLETE, deviceId, day, clock, live = null, ...rest } = {}) {
  if (!indexedDB || !crypto?.subtle) throw new StorageFailure("LOCAL_ERA_STORE_UNAVAILABLE", 18);
  if (day !== undefined && (typeof day !== "string" || !DAY_RE.test(day)))
    throw new StorageFailure("LOCAL_ERA_DAY_INVALID", 18);
  let byKey = installations.get(indexedDB);
  if (!byKey) { byKey = new Map(); installations.set(indexedDB, byKey); }
  const key = JSON.stringify([databaseName, namespace]);
  let entry = byKey.get(key);
  if (!entry) {
    // The one mutable value the live clock reads. `clock` (an explicit provider)
    // wins over `day`; with neither, the wall clock's own day seeds it.
    const state = { day: day || (live ? localDayOf(live()) : wallClock().today()) };
    const provider = clock || liveClockOver(state, live);
    /* THE DAY THIS INSTALLATION IS ACTUALLY STAMPING WITH — asked of the clock
       it is really using, never of the seed it was opened with (review round 2,
       nit 2). With no declared provider the two are the same value by
       construction (`liveClockOver` reads `state.day`); with one, `state.day` is
       only a seed the provider never agreed to, so reporting it would have
       `liveDay()` name a day nothing is stamped on. */
    const dayNow = () => (typeof provider.today === "function" ? provider.today() : state.day);
    entry = { handles: 0, state, live: provider, dayNow, adoptions: [], declaredClock: clock !== undefined };
    entry.opening = (async () => {
      const device = deviceId || (await openLocalDeviceIdentity({ indexedDB, crypto, databaseName })).deviceId;
      return openTodayOverLocalEra({ indexedDB, crypto, databaseName, namespace,
        athleteId, deviceId: device, clock: provider, liveDay: dayNow, live, ...rest });
    })();
    byKey.set(key, entry);
    // A failed open must not be remembered: the next page load has to try again.
    entry.opening.catch(() => { if (byKey.get(key) === entry) byKey.delete(key); });
  } else {
    /* A SECOND CALLER'S OWN CLOCK PROVIDER, recorded exactly as a second
       caller's own `deviceKeys` is (review round 2, nit 1). This installation
       already stands on one clock; it cannot take a second, and until now the
       second was dropped in silence — the same silence D1 was. Refusing here
       would strand the caller, so it is IGNORED and NAMED. */
    if (clock !== undefined && clock !== entry.live)
      entry.adoptions.push({ from: entry.dayNow(), to: null, adopted: false,
        why: "a second caller handed over its own clock provider; this installation already has one" });
    if (day !== undefined && day !== entry.dayNow()) {
      // THE ADOPTION, by name and on the record.
      if (entry.declaredClock) {
        entry.adoptions.push({ from: entry.dayNow(), to: day, adopted: false,
          why: "the installation was opened with an explicit clock provider, which this module may not move" });
      } else {
        entry.adoptions.push({ from: entry.dayNow(), to: day, adopted: true });
        entry.state.day = day;
      }
    }
  }
  const era = await entry.opening;
  entry.handles += 1;
  let released = false;
  return Object.freeze({ ...era,
    // What day this installation's own writes are stamped with, right now, and
    // every time a later caller moved it.
    liveDay: () => entry.dayNow(),
    clockAdoptions: () => entry.adoptions.map(entry => ({ ...entry })),
    close() {
      if (released) return;
      released = true;
      entry.handles -= 1;
      if (entry.handles > 0) return;
      if (byKey.get(key) === entry) byKey.delete(key);
      era.close();
    } });
}

export default { openTodayOverLocalEra, openTodayInstallation, wallClock,
  localDayOf, localOffsetOf, clientClockFor,
  causalTips, startOrderRefusalOf,
  TODAY_DATABASE, TODAY_NAMESPACE, TODAY_ATHLETE, PLAN_BASIS, INPUT_BASIS, RESUME_REASON, PRODUCER };
