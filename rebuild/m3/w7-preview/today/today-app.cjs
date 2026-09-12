"use strict";

/* today-app.cjs — the view. It clones the approved-design templates and binds every
   slot from the model's view DTO. It contains NO number and NO target of its own: a slot
   with no engine value or no stored operation is filled with an explicit
   not-available sentence, never a placeholder figure.

   Today follows Additions C, the authoritative reference, structure for structure. That
   is what keeps the single primary action inside one 390x844 viewport (review F2);
   `browser-check.mjs` asserts it in a real browser, in both states.

   Screens beyond Today (gym card A2, recovery check-in A3, Dad's first run A4) are
   entry points only: they carry the approved visuals and a plain "not wired yet" state.
   They fabricate nothing. */

const { createTodayModel } = require("./today-model.cjs");
/* THE RENDER BOUNDARY for the owner's no-dashes rule (DECISIONS:114 (1)). Every string
   this file writes into the DOM goes through the normaliser on the way, because most of
   them are the engine's words and rebuild/engine is frozen for this brief. A dash it
   cannot rewrite is REFUSED: that one slot renders nothing and the refusal goes to the
   console, while the rest of the screen paints normally (P1 review, Finding 3). The
   character never reaches the athlete, and one unrewritable sentence never costs them
   the whole of Today. */
const { plainOrDrop } = require("./plain-copy.cjs");

const NUMBER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const ARROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const NOT_AVAILABLE = "Not available yet";

const amount = (v) => (Number.isFinite(v) ? NUMBER.format(v) : null);
const pounds = (v) => (Number.isFinite(v) ? v.toFixed(1) : null);
const localDate = (day) => { const [y, m, d] = day.split("-").map(Number); return new Date(y, m - 1, d, 12); };
const dayLabel = (day) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(localDate(day));

/* "Eat about N kcal" — N is the engine's own midpoint, shown to the nearest 100 exactly
   as the reviewed w7-preview presents it; the engine's actual band is printed underneath,
   so the rounding hides nothing. No tolerance or allowance is invented (Refinement A
   handoff, calorie-target presentation clarification). */
function calorieHeadline(calorieTarget) {
  if (!calorieTarget || calorieTarget.gated || !Number.isFinite(calorieTarget.mid)) return null;
  return amount(Math.round(calorieTarget.mid / 100) * 100);
}
function calorieBand(calorieTarget) {
  if (!calorieTarget || calorieTarget.gated) return "A calorie range is not available yet.";
  if (!Number.isFinite(calorieTarget.lo) || !Number.isFinite(calorieTarget.hi)) return NOT_AVAILABLE;
  return "Today's target " + amount(calorieTarget.lo) + " to " + amount(calorieTarget.hi) + " kcal";
}

/* The morning line. When the accepted writer attached a note to the reading — "spike —
   damped in trend", "inside your noise — not information" — that note is the engine's
   own reconciliation of a reading with the trend beside it, and it is SHOWN (review F1).
   The app never writes a note of its own and never suppresses one; it does take the
   engine's dash out of it on the way to the screen (DECISIONS:114 (1)), which is what
   plainOrDrop() at every slot below does. */
function morningLine(view) {
  if (!view.morningRead) return "This morning: not logged yet";
  const line = "This morning ✓ " + pounds(view.morningRead.lb) + " lb";
  const note = (view.morningRead.note || "").trim();
  return note ? line + " · " + note : line;
}
function trendLine(view) {
  const weight = view.nowModel && view.nowModel.headed ? view.nowModel.headed.weight : null;
  return "Weight trend " + (Number.isFinite(weight) ? pounds(weight) + " lb" : NOT_AVAILABLE) + " · Why this plan?";
}

/* The honesty rule (review D-2): an entry point this slice has not wired says so on
   Today's face, in the approved design's own secondary text, so the athlete never taps to
   discover it. The screen behind it repeats the same words in full. */
const NOT_WIRED = "Not wired yet";

/* A2 — what Today says about today's workout. The three states come from the
   DURABLE workout log (rebuild/m3/w7-preview/today/gym-model.mjs over the accepted
   W6 host), never from a flag this page sets: no session today, one in progress,
   or one closed. "Workout in progress" and "Resume " are the approved design's own
   words; the two that describe a finished workout are this preview's own, declared
   in design.cjs, because the approved prototype has no finished-workout state. */
const WORKOUT_IN_PROGRESS = "Workout in progress";
const WORKOUT_RECORDED_TODAY = "Workout recorded";
const REVIEW_WORKOUT = "Review today’s workout";
const WORKOUT_CANNOT_OPEN = "Today’s workout cannot open";
const WHY_WORKOUT_CANNOT_OPEN = "Why today’s workout cannot open";
const UNFINISHED_WORKOUT = "An earlier workout was never finished";
const CLOSE_UNFINISHED_WORKOUT = "Close the unfinished workout";
/* The ONE sentence that is about this device. It is used only when the page has no
   workout host at all — never for a refusal that came from the accepted layer. */
const NO_LOCAL_STORE = "Your workout could not be opened on this device, and nothing was recorded.";

/* A3 — what Today says about the recovery check-in. The check-in is WIRED now, so
   the "not wired yet" sentence is gone from that entry; what stands in its place is
   the DURABLE fact of whether today's check-in is recorded, read from the same
   client lane the screen writes to. Nothing is said when nothing is recorded: a
   blank check-in is blank, never "none" and never "normal". */
const CHECKIN_RECORDED_TODAY = "Recorded today";
const CHECKIN_NO_STORE_SHORT = "Not available on this device";
const CHECKIN_NO_STORE = "This device could not open its encrypted local store, so no check-in can be recorded here.";

/* A4 — Dad's first run. The route and the landing tile exist ONLY while this
   installation carries no first-run operation, and "carries no first-run
   operation" is read from the durable generation by the setup entry, never from
   a flag this page sets. A store that has been set up, a store that refused
   RESTORE_REQUIRED and a device with no store at all all give the same answer
   here: the setup screens are not offered (BUILD-BRIEF 2.3, S13/S14).
   This module is CommonJS and the setup screens are ESM, so the tile's one word
   is a literal here, declared in design.cjs beside the rest of the preview's own
   runtime copy; setup-app.mjs carries the same string in its own COPY and
   test/setup.test.mjs asserts the two agree. */
const SETUP_ENTRY = "Set up your week";
/* A4 / C1 (review round 1) - THE ONE SENTENCE THE LANDING TODAY OWES HIM.
   A man who has just typed his real week taps "Start using Earned" and arrives
   here. His answers ARE durably recorded; what he is looking at is not yet built
   from them, because the accepted engine cannot read a clean-init athlete
   (register item H3, rebuild/engine/energy.cjs:370 and :84). Showing him the
   preview's sample athlete in silence is S19's named silent failure verbatim,
   "a fake dashboard greets a brand-new athlete", so the page says which it is.
   Same string as setup-model.mjs COPY.notHisNumbersYet, which is where the six
   screens' words live and what design.cjs harvests; the suite asserts the two
   agree, and this module is a SETUP_SOURCE so the harvest sees it here. */
const SETUP_NOT_HIS_NUMBERS = "Your week is saved on this device. The numbers on this screen are still the preview’s sample athlete, not you. Nothing here was measured from anything you did.";

/* WHEN THE SENTENCE IS OWED, as a predicate rather than a flag, so that it clears
   ITSELF the day H3 closes and boot() paints his own state: the moment Today is
   standing on the athlete whose week the record holds, the two labels agree and
   this returns false with no edit anywhere. Exported so the suite can assert both
   directions without needing an engine that can paint a clean-init athlete. */
function setupNoteNeeded(enrolled, athleteLabel, state) {
  if (enrolled !== true) return false;
  if (!state || typeof state.athlete_label !== "string" || !athleteLabel) return true;
  return state.athlete_label !== athleteLabel;
}

/* THE HEADLINE FIT (review D-1). Four of the engine's own instruction titles run to three
   lines and push the primary action out of a 390x844 viewport. This steps the headline
   down from C's 47px, one pixel at a time, ONLY until the primary action is back inside
   the viewport, and never below the 33px floor. A two-line title never moves; engine text
   is never truncated. It is a no-op wherever there is no layout to measure (a jsdom test),
   which is why the browser check is what proves it. */
const HEADLINE_BASE = 47, HEADLINE_FLOOR = 33, HEADLINE_GUARD = 8;
function fitHeadline(view, root) {
  const headline = root.querySelector("h1");
  const primary = root.querySelector('[data-slot="primary"]');
  if (!headline || !primary || !view || !view.clientHeight) return null;
  root.style.removeProperty("--headline");
  const room = () => view.clientHeight - HEADLINE_GUARD
    - (primary.getBoundingClientRect().bottom - view.getBoundingClientRect().top);
  let size = HEADLINE_BASE;
  while (room() < 0 && size > HEADLINE_FLOOR) {
    size -= 1;
    root.style.setProperty("--headline", size + "px");
  }
  return size;
}

/* options.workout (A2) — the durable gym card, injected so this module keeps no
   import of the workout data layer:
     summary()                  -> { phase, sets } read from the durable log, or null
     open({ phone, doc, back })  -> mounts the gym card into the phone element
   With no workout host at all (a browser that will not give this page an encrypted
   local store, which is exactly what a jsdom test is), the entry point says so in
   the capture layer's own terms and records nothing. */
function mountToday(doc, model, options = {}) {
  const phone = doc.getElementById("phone");
  const status = doc.getElementById("today-status");
  const chrome = doc.getElementById("today-storage");
  if (!phone) throw new Error("Today preview: no #phone host element");
  const workout = options.workout || null;
  const session = () => (workout && typeof workout.summary === "function" ? workout.summary() : null) || null;
  /* A3 — the check-in entry, injected exactly as the workout entry is, so this
     module keeps no import of the check-in's data layer:
       summary()                  -> { recorded: boolean } read from the durable lane
       open({ phone, doc, back })  -> mounts the check-in into the phone element */
  const checkin = options.checkin || null;
  const checkinSummary = () => (checkin && typeof checkin.summary === "function" ? checkin.summary() : null) || null;
  /* A4 — the first-run entry, injected exactly as the other two are:
       firstRun()                  -> true only while the DURABLE record holds no
                                      first-run operation for this installation
       open({ doc, phone, back, done }) -> mounts the six screens into #phone */
  const setup = options.setup || null;
  const firstRun = () => !!(setup && typeof setup.firstRun === "function" && setup.firstRun() === true);

  let screen = "today";
  /* A3 review F7 — BACK RETURNS WHERE THE ATHLETE CAME FROM. The check-in is reachable
     from two places, and "back" from it must not silently move the athlete: entered
     from Today it returns to Today, entered mid-workout it returns to the workout,
     which is still in progress and comes back at the same set with what was typed into
     it still there. The origin is recorded when the route is taken and cleared the
     moment it is used, so a later entry from Today can never inherit it. */
  let checkinOrigin = null;

  /* The engine's own words are never reworded; only the first letter of the marching
     order's verb phrase is capitalised so it can head a button. */
  const capitalise = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  const template = (id) => {
    const node = doc.getElementById(id);
    if (!node) throw new Error("Today preview: missing approved template " + id);
    return node.content.firstElementChild.cloneNode(true);
  };
  const slots = (root) => {
    const map = new Map();
    for (const el of root.querySelectorAll("[data-slot]")) if (!map.has(el.dataset.slot)) map.set(el.dataset.slot, el);
    return map;
  };
  function put(map, name, text) {
    const el = map.get(name);
    if (!el) throw new Error("Today preview: template slot missing: " + name);
    el.textContent = plainOrDrop(text === null || text === undefined || text === "" ? NOT_AVAILABLE : String(text), name);
    return el;
  }
  function arrows(root) {
    for (const el of root.querySelectorAll("[data-arrow]")) el.innerHTML = ARROW;
  }
  function wire(root) {
    arrows(root);
    for (const el of root.querySelectorAll("[data-go]")) el.addEventListener("click", () => render(el.dataset.go, true));
  }
  function show(root, focus) {
    phone.replaceChildren(root);
    if (focus) {
      const target = root.querySelector("h1") || root;
      target.tabIndex = -1;
      target.focus();
    }
  }
  function tell(text) { if (status) status.textContent = plainOrDrop(text, "today-status"); }

  /* ---------------- Today ---------------- */
  function renderToday(focus) {
    const view = model.read();
    if (chrome) chrome.textContent = plainOrDrop(view.storageNote, "today-storage");
    const root = template("t-today");
    const map = slots(root);
    put(map, "date", dayLabel(view.today));

    if (view.blocked) {
      put(map, "instruction", "Earned cannot show today's plan.");
      put(map, "instruction-why", view.blockedCopy || "This device's local record could not be trusted, so nothing is shown.");
      for (const name of ["kcal", "kcal-unit", "protein", "protein-unit", "kcal-note",
        "workout-title", "workout-count", "morning", "trend", "primary-label"]) put(map, name, null);
      for (const name of ["nutrition-state", "coach-state"]) put(map, name, NOT_WIRED);
      put(map, "recovery-state", null);
      map.get("primary").disabled = true;
      wire(root);
      show(root, focus);
      return;
    }

    put(map, "instruction", view.nowModel.move.title);
    const owed = !view.hasReadToday;
    /* Before a weigh-in the sentence under the instruction is the engine's reason for
       asking; after it, the engine's reading of where the plan stands. Both are the
       engine's own strings. */
    put(map, "instruction-why", owed
      ? (view.marchingOrder.why || view.statusFace.cause)
      : (view.statusFace.cause || view.nowModel.move.body));

    const kcal = calorieHeadline(view.calorieTarget);
    put(map, "kcal", kcal);
    put(map, "kcal-unit", kcal === null ? "" : "kcal");
    put(map, "protein", Number.isFinite(view.proteinTarget.g) ? amount(view.proteinTarget.g) : null);
    put(map, "protein-unit", Number.isFinite(view.proteinTarget.g) ? "g protein" : "");
    put(map, "kcal-note", calorieBand(view.calorieTarget));

    put(map, "workout-title", view.workout.title);
    /* The workout line carries the durable state of today's session — in progress,
       recorded, or refused — beside the engine's own exercise count. A2.
       REVIEW B1: the state comes from a DRY PREPARATION through the accepted host
       (gym-model.read() prepares without storing anything), so Today never offers
       "ready" and "Start" for a workout the layer will refuse to prepare. A refusal
       is shown in plain words with the layer's own code, exactly once, and is never
       described as a fault of this device. */
    const today = session();
    const refused = today && today.phase === "blocked" ? (today.code || null) : null;
    /* A session abandoned on an EARLIER day blocks every later day in the accepted
       client. It is not a dead end: the layer's own `early` close retires it, so
       Today names it and offers that close rather than printing a code the athlete
       can do nothing about (review round 2, point 3). */
    const stranded = today && today.phase === "unfinished" ? today.unfinished : null;
    const sessionState = today && today.phase === "active" ? WORKOUT_IN_PROGRESS
      : today && today.phase === "finished" ? WORKOUT_RECORDED_TODAY
      : stranded ? UNFINISHED_WORKOUT + " · " + stranded.day
      : refused ? WORKOUT_CANNOT_OPEN + " · " + refused : null;
    put(map, "workout-count", view.workout.exerciseCount === null
      ? (view.workout.unavailableReason ? "Today's exercises are not available: " + view.workout.unavailableReason : "No session is scheduled today.")
      : view.workout.exerciseCount + (view.workout.exerciseCount === 1 ? " exercise" : " exercises")
        + " · " + (sessionState || "Your set targets are ready"));

    for (const name of ["nutrition-state", "coach-state"]) put(map, name, NOT_WIRED);
    /* Written straight, not through put(): when nothing is recorded this slot says
       NOTHING. An empty check-in is empty, and a placeholder sentence would be the
       page inventing a state the athlete never entered. */
    map.get("recovery-state").textContent = plainOrDrop(recoveryState(), "recovery-state");
    setupTile(map);
    setupNote(map);
    put(map, "morning", morningLine(view));
    put(map, "trend", trendLine(view));

    const primary = map.get("primary");
    /* The resume action the approved direction requires: while a workout is in
       progress the single primary action resumes it, in the approved design's own
       word. A recorded workout is reviewable, not restartable. */
    const resuming = !!(today && today.phase === "active");
    const action = resuming ? "Resume " + view.workout.title
      : stranded ? CLOSE_UNFINISHED_WORKOUT
      : owed ? capitalise(view.marchingOrder.thenText || "Log this morning's weight")
      : today && today.phase === "finished" ? REVIEW_WORKOUT
      : refused ? WHY_WORKOUT_CANNOT_OPEN
      : "Start " + view.workout.title;
    put(map, "primary-label", action);
    primary.addEventListener("click", async () => {
      if (stranded) {
        /* One durable write, through the same client as everything else, and the
           screen repaints from what the layer answers — never from optimism. */
        primary.disabled = true;
        try { await workout.recover(); } finally { primary.disabled = false; }
        render("today", false);
        return;
      }
      return owed && !resuming ? openWeighIn() : render("workout", true);
    });
    if (!owed && view.workout.exerciseCount === null) primary.disabled = true;

    wire(root);
    show(root, focus);
    fitHeadline(phone, root);
    /* A change to the headline's text re-runs the fit. No test hook: the page simply
       keeps itself correct, and the browser check exercises the engine's whole title
       vocabulary through exactly this path. */
    if (typeof doc.defaultView !== "undefined" && doc.defaultView && doc.defaultView.MutationObserver) {
      const headline = root.querySelector("h1");
      if (headline) new doc.defaultView.MutationObserver(() => fitHeadline(phone, root))
        .observe(headline, { characterData: true, childList: true, subtree: true });
    }
    if (view.message) tell(view.message.copy);
    else if (view.unadopted > 0) tell("This device holds " + view.unadopted + " stored reading(s) the plan did not use.");
  }

  /* ---------------- the weigh-in sheet ---------------- */
  function openWeighIn() {
    if (phone.querySelector('[role="dialog"]')) return;
    const returnFocus = doc.activeElement;
    const sheet = template("t-weigh");
    const map = slots(sheet);
    put(map, "weigh-submit", "Record this weight");
    arrows(sheet);
    const input = sheet.querySelector("#morning-weight");
    const error = sheet.querySelector("#weigh-error");
    const page = phone.firstElementChild;
    if (page) page.inert = true;
    phone.append(sheet);
    input.focus();

    function close() {
      sheet.remove();
      if (page) page.inert = false;
      if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    }
    for (const step of sheet.querySelectorAll("[data-step]")) {
      step.addEventListener("click", () => {
        const current = Number(input.value);
        const next = (Number.isFinite(current) ? current : 0) + Number(step.dataset.step);
        input.value = String(Math.max(0, Math.round(next * 10) / 10));
      });
    }
    sheet.querySelector('[data-action="cancel"]').addEventListener("click", close);
    sheet.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); }
    });
    const submit = sheet.querySelector('button[type="submit"]');
    sheet.addEventListener("submit", async (event) => {
      event.preventDefault();
      /* Hand the raw entry to the model. Everything that can refuse it — the form bound,
         then the client itself — answers in words, and those words are shown. An empty
         box becomes a non-number so the client's own "A weight is required." is what the
         athlete reads; nothing is ever refused silently (review F8).
         AWAITED since review B2: the reading is durable in the encrypted repository
         before this screen says anything, so the sheet cannot close on a save that did
         not happen. The button is disabled while the transaction is in flight. */
      if (submit.disabled) return;
      submit.disabled = true;
      const raw = input.value.trim();
      let result;
      try { result = await model.weighIn(raw === "" ? raw : Number(raw)); }
      catch (error_) { result = { ok: false, copy: "This weight could not be recorded, and nothing was recorded. " + (error_ && error_.message ? error_.message : "") }; }
      submit.disabled = false;
      if (!result.ok) {
        error.textContent = plainOrDrop(result.copy || "This weight could not be recorded, and nothing was recorded.", "weigh-error");
        input.focus();
        return;
      }
      close();
      render("today", true);
    });
  }

  /* ---------------- Why this plan ---------------- */
  function renderWhy(focus) {
    const view = model.read();
    const root = template("t-why");
    const map = slots(root);
    if (view.blocked) {
      put(map, "why-lead", view.blockedCopy || "Nothing can be explained while the local record is not trusted.");
    } else {
      put(map, "why-lead", view.nowModel.move.body);
      const host = map.get("why-sections");
      for (const section of view.why) {
        const block = doc.createElement("div");
        block.className = "macro-row";
        const head = doc.createElement("strong");
        head.textContent = plainOrDrop(section.heading, "why-heading");
        head.setAttribute("role", "heading");
        head.setAttribute("aria-level", "2");
        const body = doc.createElement("p");
        body.textContent = plainOrDrop(section.body, "why-body");
        block.append(head, body);
        host.append(block);
      }
    }
    wire(root);
    show(root, focus);
  }

  /* ---------------- entry points that are NOT wired ---------------- */
  function renderNutrition(focus) {
    const view = model.read();
    const root = template("t-nutrition");
    const map = slots(root);
    const host = map.get("macros");
    const rows = view.blocked ? [] : [
      ["Energy", calorieHeadline(view.calorieTarget), "kcal", calorieBand(view.calorieTarget)],
      ["Protein", Number.isFinite(view.proteinTarget.g) ? amount(view.proteinTarget.g) : null, "g",
        "Your daily protein target."],
      ["Carbohydrate", null, "g", "Not prescribed. The engine issues no carbohydrate target."],
      ["Fat", null, "g", "Not prescribed. The engine issues no fat target."],
    ];
    for (const [label, value, unit, copy] of rows) {
      const row = doc.createElement("div");
      row.className = "macro-row";
      const top = doc.createElement("div");
      top.className = "row";
      const name = doc.createElement("strong");
      name.textContent = plainOrDrop(label, "macro-label");
      const figure = doc.createElement("span");
      if (value === null) { figure.className = "unit"; figure.textContent = "Not prescribed"; }
      else {
        const big = doc.createElement("span");
        big.className = "number";
        big.textContent = plainOrDrop(value, "macro-value");
        const u = doc.createElement("span");
        u.className = "unit";
        u.textContent = " " + unit;
        figure.append(big, u);
      }
      top.append(name, figure);
      const note = doc.createElement("p");
      note.textContent = plainOrDrop(copy, "macro-note");
      row.append(top, note);
      host.append(row);
    }
    put(map, "stub-note", "The full nutrition screen is not wired yet. Energy and protein above are today's engine targets; nothing else on this screen is a value.");
    wire(root);
    show(root, focus);
  }

  function renderStub(id, focus, note, extra, noteSlot = "stub-note") {
    const root = template(id);
    const map = slots(root);
    if (map.has("workout-title")) {
      const view = model.read();
      put(map, "workout-title", view.blocked ? NOT_AVAILABLE : view.workout.title);
    }
    put(map, noteSlot, note);
    if (extra && map.has("workout-detail")) put(map, "workout-detail", extra);
    wire(root);
    show(root, focus);
    return root;
  }

  /* A4 — the landing tile. It is shown ONLY while this installation is fresh, so a
     device that has been set up never sees an invitation to be set up again, and a
     device whose store did not open is not invited to enrol into nothing. */
  function setupTile(map) {
    const tile = map.get("setup-entry");
    if (!tile) return null;
    const offer = firstRun();
    tile.hidden = !offer;
    if (offer) put(map, "setup-entry-label", SETUP_ENTRY);
    return offer;
  }

  /* A4 / C1 - the sentence, bound exactly as the tile is. `state` is the engine
     state Today is actually painting from, so the comparison is with what is on
     the screen and not with what the page hoped was on it. */
  function setupNote(map) {
    const note = map.get("setup-note");
    if (!note) return false;
    const summary = (setup && typeof setup.summary === "function" ? setup.summary() : null) || null;
    const label = setup && typeof setup.athleteLabel === "function" ? setup.athleteLabel() : null;
    let state = null;
    try { state = typeof model.stateFromOps === "function" ? model.stateFromOps() : null; }
    catch (_) { state = null; }
    const owed = setupNoteNeeded(!!summary && summary.enrolled === true, label, state);
    /* Through the render boundary like every other slot on this screen (P1,
       DECISIONS:121): fail-closed per slot, never a page that will not open. */
    note.textContent = owed ? plainOrDrop(SETUP_NOT_HIS_NUMBERS, "setup-note") : "";
    note.hidden = !owed;
    return owed;
  }

  /* A3 — Today's one-line report on the check-in. It reads the DURABLE lane, never a
     flag this page sets, and says nothing at all when nothing is recorded. */
  function recoveryState() {
    const summary = checkinSummary();
    if (!summary || summary.durable !== true) return CHECKIN_NO_STORE_SHORT;
    return summary.recorded ? CHECKIN_RECORDED_TODAY : "";
  }

  /* The check-in with no durable lane on this device. The approved questions are
     still shown — they are the design — but every control is inert and the screen
     says, in the capture layer's own terms, that nothing here can be recorded. It is
     NOT a "not wired yet" screen: the check-in is wired; this device has no store. */
  function renderCheckInWithoutStore(focus, origin = "today") {
    const root = renderStub("t-recovery", focus, CHECKIN_NO_STORE, null, "fine");
    for (const el of root.querySelectorAll("button.option, input, select, textarea, [data-slot='primary']")) el.disabled = true;
    for (const el of root.querySelectorAll("[data-follow], [data-slot='sleep-known'], [data-slot='recorded']")) el.hidden = true;
    /* Back still returns where the athlete came from, store or no store (review F7). */
    for (const el of root.querySelectorAll('[data-go="today"]')) {
      const back = el.cloneNode(true);
      el.replaceWith(back);
      back.addEventListener("click", (event) => { event.preventDefault(); render(origin, true); });
    }
  }

  function render(next, focus = false) {
    /* A4 — the first-run route. It is REFUSED, not merely hidden, once the record
       says this installation has been set up: an installation that is no longer
       fresh falls straight back to Today, so no URL, no stale link and no second
       tab can reach the setup screens a second time (S13). The same fallback
       covers RESTORE_REQUIRED and a device with no store, because in both cases
       the page was given no setup entry at all (S14). */
    if (next === "setup" && !firstRun()) next = "today";
    screen = next;
    if (next === "setup") {
      return setup.open({ doc, phone,
        back: () => render("today", true),
        done: () => render("today", true) });
    }
    if (next === "today") return renderToday(focus);
    if (next === "why") return renderWhy(focus);
    if (next === "nutrition") return renderNutrition(focus);
    if (next === "recovery") {
      const origin = checkinOrigin === "workout" && workout ? "workout" : "today";
      checkinOrigin = null;
      if (checkin && typeof checkin.open === "function") {
        return checkin.open({ doc, phone, back: () => render(origin, true) });
      }
      return renderCheckInWithoutStore(focus, origin);
    }
    if (next === "coach") return renderStub("t-coach", focus,
      "The coach is not wired yet. There is no conversation here, and nothing on this screen comes from your records.");
    if (next === "workout") {
      if (workout && typeof workout.open === "function") {
        /* A3 — the check-in is reachable from the workout flow too, in the approved
           design's own sentence. The gym card is handed the route, not the screen:
           it never learns what a check-in is. */
        return workout.open({ doc, phone, back: () => render("today", true),
          ...(checkin ? { checkIn: () => { checkinOrigin = "workout"; render("recovery", true); } } : {}) });
      }
      /* No encrypted local workout store on this device: say exactly that, show no
         prescription, and record nothing. This is not a "not wired yet" screen — the
         gym card is wired; this device cannot open its store. It is also NOT the
         sentence used for a refusal that came from the accepted layer (review B1):
         an engine refusal is never described as a fault of the device. */
      return renderStub("t-workout", focus, NO_LOCAL_STORE,
        "This browser did not give the page an encrypted local store to keep a workout in.");
    }
    return renderToday(focus);
  }

  phone.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !phone.querySelector('[role="dialog"]') && screen !== "today") render("today", true);
  });

  /* THE SCREEN THIS PAGE LOAD OPENS ON. Today, as it always has, with the
     first-run tile on it while this installation is fresh. `?screen=` names a
     screen for the checks and for the owner's look, and it can only reach a
     screen this page would otherwise offer: the setup route above refuses when
     the installation is not fresh, so ?screen=setup on a set-up device lands on
     Today rather than on a second enrolment.
     A4 does NOT make the setup screens the landing screen. It cannot honestly:
     Today's engine basis on this page is still the synthetic fixture
     (today-model.cjs createBasisState), so a fresh installation that has not run
     setup is exactly the A1 page that already ships, and making setup the landing
     screen would change what every merged suite and check boots into. Wiring the
     first-run op's clean-init state in as Today's basis is a today-model.cjs
     change, which A4 does not own; boot() does it for the enrolled case, which is
     the case the first run creates. Recorded in A4-REPORT.md as a residual. */
  function requestedScreen() {
    const view = doc.defaultView;
    const search = view && view.location && typeof view.location.search === "string" ? view.location.search : "";
    const found = /[?&]screen=([a-z-]+)/.exec(search);
    return found ? found[1] : null;
  }
  render(requestedScreen() || "today");
  return { render, read: () => model.read(), openWeighIn, screen: () => screen };
}

/* Mounting is the page entry's job (today-entry.mjs), so this module can be required by
   tests without touching a document. */
module.exports = { mountToday, createTodayModel, calorieHeadline, calorieBand, morningLine, trendLine, dayLabel,
  ARROW, NOT_AVAILABLE, NOT_WIRED, HEADLINE_BASE, HEADLINE_FLOOR, HEADLINE_GUARD,
  WORKOUT_IN_PROGRESS, WORKOUT_RECORDED_TODAY, REVIEW_WORKOUT,
  WORKOUT_CANNOT_OPEN, WHY_WORKOUT_CANNOT_OPEN, NO_LOCAL_STORE,
  UNFINISHED_WORKOUT, CLOSE_UNFINISHED_WORKOUT,
  CHECKIN_RECORDED_TODAY, CHECKIN_NO_STORE_SHORT, CHECKIN_NO_STORE,
  SETUP_ENTRY, SETUP_NOT_HIS_NUMBERS, setupNoteNeeded };
