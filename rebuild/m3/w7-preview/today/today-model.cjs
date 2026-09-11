"use strict";

/* today-model.cjs — the REAL adapter: the durable local operation log of
   rebuild/client under the accepted engine.

   The memory-only preview adapter (rebuild/m3/w7-preview/model.cjs) is replaced here by:

     athlete action  ->  client.weighIn()          one durable local transaction
                                                   (operation + outbox entry, or nothing)
     durable op log  ->  client.face().layer1.reads   the client's OWN projection of its
                                                   reading operations (corrections and
                                                   tombstones included)
     op log          ->  E.applyRead(...) replay  the ACCEPTED writer computes the trend
                                                   and the read note; the adapter computes
                                                   no number of its own
     engine          ->  view                     every value on screen is an engine
                                                   result or a stored operation

   WHAT IS SYNTHETIC AND SAID SO. The athlete BASIS — exercises, split, sleep, food log,
   and the reads before the first day this device owns — is
   rebuild/m3/w7-preview/fixtures.cjs, the invented synthetic athlete. The identity key,
   the authority key and the offline-write lease are synthetic literals minted here; they
   authorize nothing, reach no server, and are not credentials. There is no transport, so
   the client is created offline and never claims a sync.

   WHAT IS REAL. The operation envelope and its commitment, the all-or-nothing durable
   transaction, the integrity checkpoint, the outbox accounting, the face's governing
   state, and every engine number. A refusal (invalid value, storage failure, expired
   lease, evicted store) is reported with the CLIENT'S OWN copy and changes nothing on
   screen. No number is ever invented to fill a gap. */

const { createClient } = require("../../../client/index.cjs");
const { signatureOver } = require("../../../client/ops.cjs");
const { createTodayEngine } = require("./today-engine.cjs");
const { createWebStorageBackend, createMemoryStorage } = require("./web-storage-backend.cjs");
const { SYNTHETIC_DAY, dayOffset, createSyntheticState } = require("../fixtures.cjs");

const LEASE_DOMAIN = "earned/lease/v1";

/* Synthetic, public, non-secret preview constants. They stand in for an enrolment this
   preview does not have. Naming them in source is deliberate: there is no real key here
   to leak, and a reader must be able to see that. */
const SYNTHETIC_DEVICE_ID = "earned-today-preview-device";
const SYNTHETIC_ATHLETE_ID = "earned-today-preview-athlete";
const SYNTHETIC_IDENTITY_KEY = "synthetic-preview-identity-not-a-credential";
const SYNTHETIC_AUTHORITY_KEY = "synthetic-preview-authority-not-a-credential";

const clone = (v) => JSON.parse(JSON.stringify(v));

/* The preview runs on ONE fixed synthetic day so that a stored weigh-in is still today's
   weigh-in after a reload, a browser restart or a machine reboot. A real athlete day
   comes from the device clock; this screen is explicit that it does not. */
function previewClock(day) {
  const [y, m, d] = day.split("-").map(Number);
  return {
    today: () => day,
    hour: () => 8,
    now: () => day + "T13:00:00.000Z",
    stamp: () => day + "T13:00:00.000Z",
    tz: "-05:00",
    monotonicMs: () => 0,
    /* Engine readers want a Date for Intl work; the client wants ISO strings. Both are
       pinned to the same synthetic instant. */
    date: () => new Date(y, m - 1, d, 8),
  };
}

/* An engine clock (today/hour/now->Date/stamp) over the same synthetic instant. */
function engineClockFor(day) {
  const base = previewClock(day);
  return { today: base.today, hour: base.hour, now: base.date, stamp: base.stamp };
}

function mintSyntheticLease(day) {
  const lease = {
    lease_id: "lease-today-preview",
    device_id: SYNTHETIC_DEVICE_ID,
    athlete_id: SYNTHETIC_ATHLETE_ID,
    not_before: dayOffset(day, -1) + "T00:00:00.000Z",
    not_after: dayOffset(day, 1) + "T00:00:00.000Z",
    range: [1, 100000],
    schema_version: 2,
  };
  lease.signature = signatureOver(SYNTHETIC_AUTHORITY_KEY, LEASE_DOMAIN, lease, "signature");
  return lease;
}

/* The basis the durable operations are replayed ONTO: the synthetic athlete with every
   read from the day this device starts owning removed, so a stored operation is the only
   source of a reading on or after that day. */
function createBasisState(day) {
  const state = createSyntheticState(day);
  state.reads = state.reads.filter((r) => r.d < day);
  return state;
}

function projectionOf(E, state) {
  return {
    nowModel: E.nowModel(state),
    statusFace: E.statusFace(state),
    currentRate: E.currentRate(state),
    calorieTarget: E.calorieTarget(state),
    proteinTarget: E.proteinTarget(state),
    marchingOrder: E.marchingOrder(state),
    readRecency: E.readRecency(state),
  };
}

function createTodayModel(options = {}) {
  const day = options.today || SYNTHETIC_DAY;
  const engineFactory = options.engineFactory || createTodayEngine;
  const clock = previewClock(day);
  const lease = options.lease === undefined ? mintSyntheticLease(day) : options.lease;
  const basis = options.basisState ? clone(options.basisState) : createBasisState(day);

  let storage = options.storage;
  let durable = true;
  let storageNote = "Saved on this device. It survives a reload, a restart and a reboot.";
  if (!storage) {
    try {
      if (typeof globalThis !== "undefined" && globalThis.localStorage) {
        globalThis.localStorage.setItem("earned.today.v1:probe", "1");
        globalThis.localStorage.removeItem("earned.today.v1:probe");
        storage = globalThis.localStorage;
      }
    } catch (_) { storage = undefined; }
  }
  if (!storage) {
    storage = createMemoryStorage();
    durable = false;
    storageNote = "This browser is not allowing local storage. Nothing here will survive a reload.";
  }

  const backend = options.backend
    ? options.backend(createWebStorageBackend(storage, { prefix: options.prefix }))
    : createWebStorageBackend(storage, { prefix: options.prefix });

  const E = engineFactory({ clock: engineClockFor(day) });

  const client = createClient({
    deviceId: SYNTHETIC_DEVICE_ID,
    athleteId: SYNTHETIC_ATHLETE_ID,
    identityKey: SYNTHETIC_IDENTITY_KEY,
    authorityKey: SYNTHETIC_AUTHORITY_KEY,
    backend,
    clock,
    lease,
    online: false,
  });
  client.boot();

  let lastMessage = null;

  /* The durable reading operations, as the CLIENT projects them. The adapter does not
     parse the operation log itself; it asks the client. */
  function storedReads() {
    const face = client.face();
    const reads = (face.layer1 && Array.isArray(face.layer1.reads)) ? face.layer1.reads : [];
    return reads
      .filter((r) => r && typeof r.date === "string" && typeof r.lb === "number" && Number.isFinite(r.lb))
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }

  /* op log -> engine state, through the ACCEPTED writer. */
  function stateFromOps() {
    let state = clone(basis);
    for (const r of storedReads()) state = E.applyRead(state, r.date, r.lb, { hour: 8 });
    return state;
  }

  function sessionFor(state) {
    try {
      const session = E.genSession(state, day, null);
      if (!session || !Array.isArray(session.ex)) return { available: false, reason: null, count: null, name: null };
      return { available: true, reason: null, count: session.ex.length, name: session.name || null };
    } catch (error) {
      return { available: false, reason: error && error.code ? error.code : "WORKOUT_PREPARATION_UNAVAILABLE", count: null, name: null };
    }
  }

  /* The reading the ENGINE adopted for a day, not merely the newest operation. The
     accepted writer keeps the FIRST reading it is given for a date and ignores a later
     one; showing the later one beside a trend computed from the earlier one would be a
     lie. weighIn() below refuses rather than writing an operation the engine would
     ignore, so the two can never disagree — and if they ever did, `unadopted` says so. */
  function adoptedRead(state, date) {
    const hit = (state.reads || []).filter((r) => r && r.d === date);
    return hit.length ? { date: hit[0].d, lb: hit[0].w, note: hit[0].note || "" } : null;
  }

  function whySections(view) {
    const rate = view.currentRate;
    const latest = view.latestRead;
    const out = [
      { heading: "Your calories", body: view.calorieTarget.why || view.nowModel.eat.sub || null },
      { heading: "Your protein", body: view.proteinTarget.why || null },
      { heading: "What supports “" + view.statusFace.word.toLowerCase() + "”",
        body: [view.statusFace.cause, view.nowModel.move.body].filter(Boolean).join(" ") || null },
      { heading: "The readings behind it",
        body: latest
          ? "Newest reading: " + latest.date + "." + (rate.measured
            ? " " + rate.n + " readings support the rate, " + rate.from + " to " + rate.to + "."
            : " The rate is not measured yet.")
          : "No reading is stored on this device yet." },
      { heading: "The rate itself",
        body: rate.measured && Number.isFinite(rate.lo) && Number.isFinite(rate.hi)
          ? "The estimated loss rate is " + rate.scale.toFixed(2) + " lb/week; its range is "
            + rate.lo.toFixed(2) + "–" + rate.hi.toFixed(2) + " lb/week."
          : "The stored history does not establish a measured weekly rate yet." },
    ];
    return out.map((s) => ({ heading: s.heading, body: s.body || "No supporting estimate is available." }));
  }

  function read() {
    const face = client.face();
    const reads = storedReads();
    /* A face that is not TRUTHFUL means the client itself will not stand behind what it
       holds. Paint no number in that case. */
    if (face.paint !== "TRUTHFUL") {
      return {
        today: day, paint: face.paint, faceState: face.state, blocked: true,
        blockedCopy: (face.layer2 && face.layer2.copy) || (face.layer1 && face.layer1.label) || null,
        restore: client.restoreFlow(), durable, storageNote, message: lastMessage,
        hasReadToday: false, latestRead: null, morningRead: null, storedReadCount: reads.length, unadopted: 0,
      };
    }
    const state = stateFromOps();
    const morningRead = adoptedRead(state, day);
    const adoptedDates = new Set((state.reads || []).map((r) => r && r.d));
    const unadopted = reads.filter((r) => !adoptedDates.has(r.date)).length;
    const adopted = (state.reads || []).filter((r) => r && typeof r.w === "number");
    const latestRead = adopted.length ? { date: adopted[adopted.length - 1].d, lb: adopted[adopted.length - 1].w } : null;
    const projection = projectionOf(E, state);
    const session = sessionFor(state);
    const view = {
      today: day, paint: face.paint, faceState: face.state, blocked: false, blockedCopy: null,
      durable, storageNote, message: lastMessage,
      hasReadToday: !!morningRead, latestRead, morningRead, storedReadCount: reads.length, unadopted,
      saveLabel: (face.layer1 && face.layer1.label) || "",
      outbox: client.outboxRetained(),
      workout: { title: projection.nowModel.workout.title, sub: projection.nowModel.workout.sub,
        today: projection.nowModel.workout.today, exerciseCount: session.count,
        available: session.available, unavailableReason: session.reason },
      ...projection,
    };
    view.why = whySections(view);
    return clone(view);
  }

  /* The one wired athlete action. The value is handed to the client unchanged; the
     client decides whether it is recorded, and its answer is reported verbatim. */
  const ALREADY_RECORDED = "Today's weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet.";
  function weighIn(lb) {
    /* Refuse rather than write an operation the accepted writer would ignore. The engine
       keeps the FIRST reading for a date; a second stored operation would leave the log
       and the screen disagreeing. The correction path is named, not faked. */
    if (adoptedRead(stateFromOps(), day)) {
      lastMessage = { ok: false, state: null, copy: ALREADY_RECORDED };
      return { ok: false, state: null, copy: ALREADY_RECORDED, op_id: null };
    }
    const result = client.weighIn({ date: day, lb });
    lastMessage = { ok: !!result.acknowledged, state: result.state, copy: result.copy };
    return { ok: !!result.acknowledged, state: result.state, copy: result.copy, op_id: result.op_id || null };
  }

  /* Re-boot this adapter's client from the same storage: the page-reload path, without a
     page reload. Used by the reload proof. */
  function reopen() { lastMessage = null; client.restart(); return read(); }

  return {
    read, weighIn, reopen,
    today: day,
    engine: E,
    client,
    storage,
    basisState: () => clone(basis),
    stateFromOps,
    storedReads,
    adoptedRead: (date) => adoptedRead(stateFromOps(), date || day),
    ALREADY_RECORDED,
  };
}

module.exports = {
  createTodayModel, createBasisState, previewClock, engineClockFor, mintSyntheticLease, projectionOf,
  SYNTHETIC_DEVICE_ID, SYNTHETIC_ATHLETE_ID, SYNTHETIC_IDENTITY_KEY, SYNTHETIC_AUTHORITY_KEY, SYNTHETIC_DAY,
};
