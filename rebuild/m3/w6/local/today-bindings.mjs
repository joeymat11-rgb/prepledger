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
import Client from "../../../client/index.cjs";
import { StorageFailure } from "../repository.mjs";
import { createDurablePublicClient } from "../public-client.mjs";
import { parseStrictJson } from "../strict-json.mjs";
import { projectWorkoutRecords } from "../../../m4/workout/project-history.mjs";
import { composeWorkoutHost, createUnavailableNativeTrendContext } from "../host/workout-host.mjs";
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
export const PRODUCER = Object.freeze({ app_build: "earned-today-preview",
  engine_build: "accepted-native-carriers", rule_profile: Adapter.PROFILE,
  source_schema: "w7-preview-synthetic" });

/* ---------------------------------------------------------------------------
   THE CAUSAL FRONTIER. A2's two pure functions, carried here verbatim and pinned
   BY SOURCE in the journey test (String(mine) === String(theirs)), because the
   drop-in must refuse exactly the Starts the page refuses today — no more, no
   fewer. Provenance: rebuild/m3/w7-preview/today/gym-host.mjs causalTips /
   startOrderRefusalOf, written under A2 review round 2.
   --------------------------------------------------------------------------- */
const graphOps = generation => Object.values(generation?.collections?.ops || {})
  .filter(op => op && typeof op.op_id === 'string' && Array.isArray(op.causal_parents));

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
/* The page's own clocks, restated: the client wants ISO strings, the engine
   readers want a Date. Both are pinned to one instant on the host's own day, as
   gym-host.mjs and today-model.cjs already pin them. */
export const clientClockFor = day => ({ today: () => day, now: () => day + "T13:00:00.000Z",
  tz: "-05:00", monotonicMs: () => 0 });
const engineClockFor = day => ({ today: () => day, hour: () => 8,
  now: () => new Date(day + "T13:00:00.000Z"), stamp: () => day + "T13:00:00.000Z" });

/* ONE installation. Opened once per page load, handed to both hosts.
   `enroll` is the only thing that may create an era, and it runs only when C1
   observed all three first-run signals absent. Anything else — a missing key
   database, a missing enrollment marker, an unreadable generation — arrives here
   as a THROWN StorageFailure carrying C1's own code, so a partially erased device
   says restore-required instead of quietly starting a second life. */
export async function openTodayOverLocalEra({
  indexedDB = globalThis.indexedDB, crypto = globalThis.crypto,
  databaseName = TODAY_DATABASE, namespace = TODAY_NAMESPACE,
  athleteId, deviceId, clock, liveDay,
  enroll = true, cleanInit,
  producerIdentity = PRODUCER, planBasis = PLAN_BASIS, inputBasis = INPUT_BASIS,
  resumeReason = RESUME_REASON, nativeTrendContext,
} = {}) {
  const prescriptionCapture = Capture.createPrescriptionCapture({ parseStrictJson,
    profile: Capture.SOURCE_PROFILE, sourceCodec: Source });
  const workoutCommands = Commands.createWorkoutCommands({ prescriptionCapture });
  const client = await openLocalDurableClient({ indexedDB, crypto, databaseName, namespace,
    athleteId, deviceId, clock, workoutCommands });

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
      databaseName, namespace, athleteId, deviceId, clock, liveDay, producerIdentity, planBasis, inputBasis,
      resumeReason, nativeTrendContext });
  } catch (error) { client.close(); throw error; }
}

function buildEra({ client, prescriptionCapture, workoutCommands, booted, indexedDB, crypto,
  databaseName, namespace, athleteId, deviceId, clock, liveDay, producerIdentity, planBasis, inputBasis,
  resumeReason, nativeTrendContext }) {
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
    const sealed = (await client.hostBindings({ workoutCommands, clock: clientClockFor(day) })).repository;
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
    const bindings = await client.hostBindings({ workoutCommands, clock: clientClockFor(day) });
    let alive = true;
    const engine = HostRuntime.createEngineRuntime({ clock: engineClockFor(day),
      nativeTrendContext: nativeTrendContext || createUnavailableNativeTrendContext() });

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
      createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
      createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
      createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
      createEngineHistoryProjector: History.createEngineHistoryProjector,
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
      causalParents: () => lastResolved.slice(),
      causalTipsNow: async () => causalTips((await bindings.repository.load()).generation),
      startOrderRefusal,
      // Detaches THIS handle only — see createReadingHost().close().
      close() { alive = false; } });
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
    createReadingHost, createGymHost,
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
   page load each stamp their own day correctly. */
function liveClockOver(state) {
  return Object.freeze({
    today: () => state.day,
    now: () => state.day + "T13:00:00.000Z",
    tz: "-05:00",
    monotonicMs: () => 0,
  });
}

export async function openTodayInstallation({
  indexedDB = globalThis.indexedDB, crypto = globalThis.crypto,
  databaseName = TODAY_DATABASE, namespace = TODAY_NAMESPACE,
  athleteId = TODAY_ATHLETE, deviceId, day, clock, ...rest } = {}) {
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
    const state = { day: day || wallClock().today() };
    const live = clock || liveClockOver(state);
    entry = { handles: 0, state, live, adoptions: [], declaredClock: clock !== undefined };
    entry.opening = (async () => {
      const device = deviceId || (await openLocalDeviceIdentity({ indexedDB, crypto, databaseName })).deviceId;
      return openTodayOverLocalEra({ indexedDB, crypto, databaseName, namespace,
        athleteId, deviceId: device, clock: live, liveDay: () => state.day, ...rest });
    })();
    byKey.set(key, entry);
    // A failed open must not be remembered: the next page load has to try again.
    entry.opening.catch(() => { if (byKey.get(key) === entry) byKey.delete(key); });
  } else if (day !== undefined && day !== entry.state.day) {
    // THE ADOPTION, by name and on the record.
    if (entry.declaredClock) {
      entry.adoptions.push({ from: entry.state.day, to: day, adopted: false,
        why: "the installation was opened with an explicit clock provider, which this module may not move" });
    } else {
      entry.adoptions.push({ from: entry.state.day, to: day, adopted: true });
      entry.state.day = day;
    }
  }
  const era = await entry.opening;
  entry.handles += 1;
  let released = false;
  return Object.freeze({ ...era,
    // What day this installation's own writes are stamped with, right now, and
    // every time a later caller moved it.
    liveDay: () => entry.state.day,
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
  causalTips, startOrderRefusalOf,
  TODAY_DATABASE, TODAY_NAMESPACE, TODAY_ATHLETE, PLAN_BASIS, INPUT_BASIS, RESUME_REASON, PRODUCER };
