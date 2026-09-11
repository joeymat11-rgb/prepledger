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
  return "Today's target " + amount(calorieTarget.lo) + "–" + amount(calorieTarget.hi) + " kcal";
}

/* The morning line. When the accepted writer attached a note to the reading — "spike —
   damped in trend", "inside your noise — not information" — that note is the engine's
   own reconciliation of a reading with the trend beside it, and it is SHOWN (review F1).
   The app never writes a note of its own and never suppresses one. */
function morningLine(view) {
  if (!view.morningRead) return "This morning — not logged yet";
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
const NOT_WIRED = "— not wired yet";

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

function mountToday(doc, model) {
  const phone = doc.getElementById("phone");
  const status = doc.getElementById("today-status");
  const chrome = doc.getElementById("today-storage");
  if (!phone) throw new Error("Today preview: no #phone host element");

  let screen = "today";

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
    if (!el) throw new Error("Today preview: template slot missing — " + name);
    el.textContent = text === null || text === undefined || text === "" ? NOT_AVAILABLE : String(text);
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
  function tell(text) { if (status) status.textContent = text; }

  /* ---------------- Today ---------------- */
  function renderToday(focus) {
    const view = model.read();
    if (chrome) chrome.textContent = view.storageNote;
    const root = template("t-today");
    const map = slots(root);
    put(map, "date", dayLabel(view.today));

    if (view.blocked) {
      put(map, "instruction", "Earned cannot show today's plan.");
      put(map, "instruction-why", view.blockedCopy || "This device's local record could not be trusted, so nothing is shown.");
      for (const name of ["kcal", "kcal-unit", "protein", "protein-unit", "kcal-note",
        "workout-title", "workout-count", "morning", "trend", "primary-label"]) put(map, name, null);
      for (const name of ["nutrition-state", "recovery-state", "coach-state"]) put(map, name, NOT_WIRED);
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
    put(map, "workout-count", view.workout.exerciseCount === null
      ? (view.workout.unavailableReason ? "Today's exercises are not available: " + view.workout.unavailableReason : "No session is scheduled today.")
      : view.workout.exerciseCount + (view.workout.exerciseCount === 1 ? " exercise" : " exercises") + " · Your set targets are ready");

    for (const name of ["nutrition-state", "recovery-state", "coach-state"]) put(map, name, NOT_WIRED);
    put(map, "morning", morningLine(view));
    put(map, "trend", trendLine(view));

    const primary = map.get("primary");
    put(map, "primary-label", owed
      ? capitalise(view.marchingOrder.thenText || "Log this morning's weight")
      : "Start " + view.workout.title);
    primary.addEventListener("click", () => (owed ? openWeighIn() : render("workout", true)));
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
    sheet.addEventListener("submit", (event) => {
      event.preventDefault();
      /* Hand the raw entry to the model. Everything that can refuse it — the form bound,
         then the client itself — answers in words, and those words are shown. An empty
         box becomes a non-number so the client's own "A weight is required." is what the
         athlete reads; nothing is ever refused silently (review F8). */
      const raw = input.value.trim();
      const result = model.weighIn(raw === "" ? raw : Number(raw));
      if (!result.ok) {
        error.textContent = result.copy || "This weight could not be recorded, and nothing was recorded.";
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
        head.textContent = section.heading;
        head.setAttribute("role", "heading");
        head.setAttribute("aria-level", "2");
        const body = doc.createElement("p");
        body.textContent = section.body;
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
      name.textContent = label;
      const figure = doc.createElement("span");
      if (value === null) { figure.className = "unit"; figure.textContent = "Not prescribed"; }
      else {
        const big = doc.createElement("span");
        big.className = "number";
        big.textContent = value;
        const u = doc.createElement("span");
        u.className = "unit";
        u.textContent = " " + unit;
        figure.append(big, u);
      }
      top.append(name, figure);
      const note = doc.createElement("p");
      note.textContent = copy;
      row.append(top, note);
      host.append(row);
    }
    put(map, "stub-note", "The full nutrition screen is not wired yet. Energy and protein above are today's engine targets; nothing else on this screen is a value.");
    wire(root);
    show(root, focus);
  }

  function renderStub(id, focus, note, extra) {
    const root = template(id);
    const map = slots(root);
    if (map.has("workout-title")) {
      const view = model.read();
      put(map, "workout-title", view.blocked ? NOT_AVAILABLE : view.workout.title);
    }
    put(map, "stub-note", note);
    if (extra && map.has("workout-detail")) put(map, "workout-detail", extra);
    wire(root);
    show(root, focus);
  }

  function render(next, focus = false) {
    screen = next;
    if (next === "today") return renderToday(focus);
    if (next === "why") return renderWhy(focus);
    if (next === "nutrition") return renderNutrition(focus);
    if (next === "recovery") return renderStub("t-recovery", focus,
      "The recovery check-in is not wired yet. Nothing on this screen is recorded, and no answer here reaches your plan.");
    if (next === "coach") return renderStub("t-coach", focus,
      "The coach is not wired yet. There is no conversation here, and nothing on this screen comes from your records.");
    if (next === "workout") return renderStub("t-workout", focus,
      "Workout logging is not wired yet. No workout has been started and nothing is recorded.",
      "The session name above is the engine's own. Every prescription for it belongs to the workout screen, which comes next.");
    return renderToday(focus);
  }

  phone.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !phone.querySelector('[role="dialog"]') && screen !== "today") render("today", true);
  });

  render("today");
  return { render, read: () => model.read(), openWeighIn, screen: () => screen };
}

/* Mounting is the page entry's job (today-entry.mjs), so this module can be required by
   tests without touching a document. */
module.exports = { mountToday, createTodayModel, calorieHeadline, calorieBand, morningLine, trendLine, dayLabel,
  ARROW, NOT_AVAILABLE, NOT_WIRED, HEADLINE_BASE, HEADLINE_FLOOR, HEADLINE_GUARD };
