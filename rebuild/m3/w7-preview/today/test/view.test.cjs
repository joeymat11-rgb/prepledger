"use strict";

/* A1 — the view: the owner-approved 2026-09-08 Today screen bound to the real adapter.
   These tests prove that every figure on screen came from the engine or a stored
   operation, that the engine's own reading note is shown rather than dropped (review F1),
   that the screens this slice does not build say so, and that every text input the page
   actually renders is at least 16px (the iOS zoom rule, review F4). */

const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const { createEngine } = require("../../../../engine/index.cjs");
const app = require("../today-app.cjs");
const { mountToday, morningLine, trendLine, calorieBand, calorieHeadline } = app;
const { createTodayModel, createBasisState, engineClockFor, SYNTHETIC_DAY } = require("../today-model.cjs");
const { createWebStorageBackend, createMemoryStorage } = require("../web-storage-backend.cjs");
const design = require("../design.cjs");

const DAY = SYNTHETIC_DAY;
const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/* The approved prototypes' numbers are fictional (rebuild/m1/MOCK.md). These particular
   figures cannot be a value this synthetic athlete's engine produces, so seeing one means
   template text survived instead of being bound. Substring checks, not word-boundary
   regexes: "2,300 kcal" has no word boundary after the 0 in some renderings, and a \b
   test there silently passes whatever is on screen.

   The REAL guard is stronger and lives in two places: every figure on Today is asserted
   equal to the reference engine's own value slot by slot, and no digit at all may appear
   outside a bound slot. A number the engine also happens to produce (the rounded calorie
   headline really is 2,300 for this fixture) is therefore allowed to appear, because the
   slot test proves where it came from. */
const FICTIONAL = ["2,252", "2,344", "235 g", "180.9 lb", "181.3 lb", "135 lb",
  "About 60 min", "9 exercises", "9 reps", "1.1 lb/week"];

function shell() {
  return design.shellHtml().replace("<!-- APPROVED_TEMPLATES -->", design.templateHtml());
}
function setup(options = {}) {
  const dom = new JSDOM(shell(), { url: "http://127.0.0.1:4178/" });
  const doc = dom.window.document;
  const model = options.model || createTodayModel({ storage: options.storage || createMemoryStorage() });
  const api = mountToday(doc, model);
  return { dom, doc, model, api };
}
const phoneText = (doc) => doc.getElementById("phone").textContent;
const slot = (doc, name) => doc.querySelector(`[data-slot="${name}"]`);
function weighIn(dom, doc, value) {
  slot(doc, "primary").click();
  const sheet = doc.querySelector('[role="dialog"]');
  doc.getElementById("morning-weight").value = String(value);
  sheet.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  return sheet;
}

test("Today paints the approved design from engine values only", () => {
  const { doc, model } = setup();
  const view = model.read();
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = createBasisState(DAY);

  assert.equal(doc.querySelector(".brand").textContent, "Earned");
  assert.equal(doc.querySelector(".label").textContent, "Your plan for today");
  assert.equal(slot(doc, "instruction").textContent, reference.nowModel(state).move.title);
  assert.equal(slot(doc, "instruction-why").textContent, reference.marchingOrder(state).why);
  assert.equal(slot(doc, "workout-title").textContent, reference.nowModel(state).workout.title);
  assert.equal(slot(doc, "workout-count").textContent,
    reference.genSession(state, DAY, null).ex.length + " exercises · Your set targets are ready");
  assert.equal(slot(doc, "kcal-note").textContent, calorieBand(reference.calorieTarget(state)));
  assert.equal(slot(doc, "protein").textContent, money.format(reference.proteinTarget(state).g));
  assert.equal(slot(doc, "morning").textContent, "This morning — not logged yet");
  assert.equal(view.hasReadToday, false);
  for (const figure of FICTIONAL) assert(!phoneText(doc).includes(figure), "prototype figure on screen: " + figure);
});

test("the primary action before a weigh-in is the engine's own marching order", () => {
  const { doc, model } = setup();
  const view = model.read();
  assert.equal(slot(doc, "primary-label").textContent.toLowerCase(), view.marchingOrder.thenText.toLowerCase());
  assert.equal(slot(doc, "instruction-why").textContent, view.marchingOrder.why);
});

test("a weigh-in through the sheet rebinds every engine-derived value on Today", () => {
  const { dom, doc, model } = setup();
  weighIn(dom, doc, 179.4);
  assert.equal(doc.querySelector('[role="dialog"]'), null, "the sheet closed");
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = reference.applyRead(createBasisState(DAY), DAY, 179.4, { hour: 8 });
  assert.match(slot(doc, "morning").textContent, /^This morning ✓ 179\.4 lb/);
  assert.equal(slot(doc, "trend").textContent,
    "Weight trend " + reference.nowModel(state).headed.weight.toFixed(1) + " lb · Why this plan?");
  assert.equal(slot(doc, "instruction").textContent, reference.nowModel(state).move.title);
  assert.match(slot(doc, "primary-label").textContent, /^Start /);
  assert.equal(model.read().hasReadToday, true);
  for (const figure of FICTIONAL) assert(!phoneText(doc).includes(figure), "prototype figure on screen: " + figure);
});

/* ---- review F1: the engine's reading note is shown, not dropped ---- */
test("a spike reading renders the ENGINE's own note beside it; a quiet reading renders none", () => {
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const spikeState = reference.applyRead(createBasisState(DAY), DAY, 191.7, { hour: 8 });
  const spikeNote = spikeState.reads.at(-1).note;
  assert(spikeNote && spikeNote.length > 0, "the accepted writer really does attach a note to a spike");

  const spike = setup();
  weighIn(spike.dom, spike.doc, 191.7);
  const shown = slot(spike.doc, "morning").textContent;
  assert.equal(shown, "This morning ✓ 191.7 lb · " + spikeNote);
  assert(shown.includes(spikeNote), "the note is the engine's own string, verbatim");
  // The reading and the trend no longer sit side by side unreconciled.
  assert.match(spike.doc.getElementById("phone").textContent, new RegExp(spikeNote.slice(0, 12).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  const quietState = reference.applyRead(createBasisState(DAY), DAY, 179.4, { hour: 8 });
  assert.equal(quietState.reads.at(-1).note, "", "this reading carries no note");
  const quiet = setup();
  weighIn(quiet.dom, quiet.doc, 179.4);
  assert.equal(slot(quiet.doc, "morning").textContent, "This morning ✓ 179.4 lb");
  assert(!slot(quiet.doc, "morning").textContent.includes("·"), "no separator is printed with no note");
});

test("morningLine and trendLine carry no words of their own beyond the approved labels", () => {
  const note = "spike — damped in trend";
  assert.equal(morningLine({ morningRead: { lb: 190, note } }), "This morning ✓ 190.0 lb · " + note);
  assert.equal(morningLine({ morningRead: { lb: 190, note: "" } }), "This morning ✓ 190.0 lb");
  assert.equal(morningLine({ morningRead: null }), "This morning — not logged yet");
  assert.equal(trendLine({ nowModel: { headed: { weight: 180.1 } } }), "Weight trend 180.1 lb · Why this plan?");
  assert.match(trendLine({ nowModel: { headed: { weight: null } } }), /Not available yet/);
});

/* ---- review F8: an impossible weight is refused in words, never silently ---- */
test("an impossible weight is refused with an honest message and records nothing", () => {
  const storage = createMemoryStorage();
  const { dom, doc, model } = setup({ storage });
  for (const value of ["10000", "0", "-5", "59.9", "400.1", "180.01"]) {
    const sheet = weighIn(dom, doc, value);
    const message = doc.getElementById("weigh-error").textContent;
    assert(message.length > 0, "refused " + value + " in words");
    assert.match(message, /Nothing was recorded/);
    assert(doc.querySelector('[role="dialog"]'), "the sheet stays open on a refusal");
    doc.querySelector('[data-action="cancel"]').click();
    assert.equal(sheet.isConnected, false);
  }
  assert.equal(model.read().hasReadToday, false);
  assert.equal(createWebStorageBackend(storage).keys("ops").length, 0, "no impossible weight reached the log");
  // And the bound is a FORM bound, not a claim about the engine: a weight inside it works.
  weighIn(dom, doc, "179.4");
  assert.equal(model.read().hasReadToday, true);
});

test("an empty box is refused by the CLIENT, in the client's own words", () => {
  const { dom, doc, model } = setup();
  weighIn(dom, doc, "");
  const message = doc.getElementById("weigh-error").textContent;
  assert.match(message, /A weight is required/);
  assert.doesNotMatch(message, /\d+\.\d/, "a refusal carries no weight");
  assert.equal(model.read().hasReadToday, false);
});

test("a refused weigh-in leaves Today exactly as it was", () => {
  const { dom, doc, model } = setup();
  const before = phoneText(doc);
  weighIn(dom, doc, "10000");
  doc.querySelector('[data-action="cancel"]').click();
  assert.equal(phoneText(doc), before, "nothing on Today changed");
  assert.equal(model.read().hasReadToday, false);
});

test("a reload of the page restores the stored weigh-in on screen", () => {
  const storage = createMemoryStorage();
  const first = setup({ storage });
  first.model.weighIn(177.6);
  first.api.render("today");
  const shown = slot(first.doc, "trend").textContent;

  const second = setup({ storage });
  assert.match(slot(second.doc, "morning").textContent, /^This morning ✓ 177\.6 lb/);
  assert.equal(slot(second.doc, "trend").textContent, shown);
});

test("Why this plan shows only the engine's own explanations", () => {
  const { doc, model } = setup();
  doc.querySelector('[data-go="why"]').click();
  const view = model.read();
  const bodies = [...doc.querySelectorAll(".macro-row p")].map((p) => p.textContent);
  assert.equal(bodies.length, view.why.length);
  assert.equal(bodies[0], view.calorieTarget.why);
  assert.equal(bodies[1], view.proteinTarget.why);
  assert.equal(slot(doc, "why-lead").textContent, view.nowModel.move.body);
  doc.querySelector('[data-go="today"]').click();
  assert(slot(doc, "instruction"), "Back returns to Today");
});

test("every screen this slice does not build says so and shows no invented value", () => {
  const { doc } = setup();

  doc.querySelector('[data-go="nutrition"]').click();
  assert.match(phoneText(doc), /not wired yet/);
  const rows = [...doc.querySelectorAll(".macro-row")].map((r) => r.textContent);
  assert.equal(rows.length, 4);
  assert.match(rows[2], /Carbohydrate/);
  assert.match(rows[2], /Not prescribed/);
  assert.match(rows[3], /Fat/);
  assert.doesNotMatch(rows[2] + rows[3], /\d/, "no carbohydrate or fat figure is invented");

  doc.querySelector('[data-go="today"]').click();
  doc.querySelector('[data-go="recovery"]').click();
  assert.match(phoneText(doc), /not wired yet/);
  const options = [...doc.querySelectorAll(".option")];
  assert(options.length >= 9);
  for (const option of options) {
    assert.equal(option.getAttribute("aria-pressed"), "false", "every answer starts blank");
    assert.equal(option.disabled, true, "nothing here can be recorded");
  }

  doc.querySelector('[data-go="today"]').click();
  doc.querySelector('[data-go="coach"]').click();
  assert.match(phoneText(doc), /not wired yet/);
  assert.doesNotMatch(phoneText(doc), /135|chest press/i, "no scripted coach answer is shown");
});

test("the workout entry point carries the engine's session name and nothing more", () => {
  const { dom, doc, model } = setup();
  weighIn(dom, doc, 180.2);
  slot(doc, "primary").click();
  assert.match(phoneText(doc), /Workout logging is not wired yet/);
  assert.equal(slot(doc, "workout-title").textContent, model.read().workout.title);
  assert.doesNotMatch(phoneText(doc), /\d/, "not one figure appears on an unwired screen");
});

test("an untrusted local record paints no number anywhere", () => {
  const storage = createMemoryStorage();
  const seeded = createTodayModel({ storage });
  seeded.weighIn(181.9);
  createWebStorageBackend(storage).clear("ops");
  const { doc } = setup({ storage });
  assert.match(slot(doc, "instruction").textContent, /cannot show today's plan/);
  assert.equal(slot(doc, "kcal").textContent, "Not available yet");
  assert.equal(slot(doc, "trend").textContent, "Not available yet");
  assert.doesNotMatch(phoneText(doc), /\d+\.\d|\d,\d{3}/, "no figure survives an untrusted record");
  assert.equal(slot(doc, "primary").disabled, true);
});

/* ---- the strong guard: every figure on Today is a bound engine value ---- */
test("every figure on Today equals the reference engine's own value, slot by slot", () => {
  const { dom, doc } = setup();
  const reference = createEngine({ clock: engineClockFor(DAY) });
  for (const [state, label] of [[createBasisState(DAY), "before"],
    [reference.applyRead(createBasisState(DAY), DAY, 176.2, { hour: 8 }), "after"]]) {
    if (label === "after") weighIn(dom, doc, 176.2);
    const calories = reference.calorieTarget(state);
    const protein = reference.proteinTarget(state);
    assert.equal(slot(doc, "kcal").textContent, calorieHeadline(calories), label);
    assert.equal(slot(doc, "kcal-note").textContent, calorieBand(calories), label);
    assert.equal(slot(doc, "protein").textContent, money.format(protein.g), label);
    assert.equal(slot(doc, "trend").textContent,
      "Weight trend " + reference.nowModel(state).headed.weight.toFixed(1) + " lb · Why this plan?", label);
    assert.equal(slot(doc, "instruction").textContent, reference.nowModel(state).move.title, label);
    assert.equal(slot(doc, "workout-count").textContent,
      reference.genSession(state, DAY, null).ex.length + " exercises · Your set targets are ready", label);
  }
  assert.match(slot(doc, "morning").textContent, /^This morning ✓ 176\.2 lb/);
});

/* review D-2: the athlete must not have to tap to discover an entry point is unwired. */
test("every unwired entry point says so on Today's own face, in secondary text", () => {
  const { doc } = setup();
  for (const name of ["nutrition-state", "recovery-state", "coach-state"]) {
    const el = slot(doc, name);
    assert(el, name + " is on Today");
    assert.equal(el.textContent, app.NOT_WIRED);
    assert.equal(el.closest("[data-go]") !== null, true, name + " sits inside its own entry point");
  }
  // The two inline markers use the approved design's own secondary text colour; the
  // coach marker sits inside the entry's existing .sub line, which already is that.
  assert(slot(doc, "nutrition-state").classList.contains("muted"));
  assert(slot(doc, "recovery-state").classList.contains("muted"));
  assert(slot(doc, "coach-state").closest(".sub"), "the coach marker is in the .sub line");
  // Each entry point carries the marker beside its own approved label.
  const face = phoneText(doc);
  for (const label of ["Your full nutrition plan", "How are you feeling today?", "Ask your coach"]) {
    const at = face.indexOf(label);
    assert(at >= 0, label);
    assert(face.slice(at, at + 120).includes(app.NOT_WIRED), label + " is not marked on Today's face");
  }
  // And the screen behind each one repeats it in full.
  for (const screen of ["nutrition", "recovery", "coach"]) {
    doc.querySelector(`[data-go="${screen}"]`).click();
    assert.match(phoneText(doc), /not wired yet/, screen);
    doc.querySelector('[data-go="today"]').click();
  }
});

test("the wired action is NOT marked unwired", () => {
  const { doc } = setup();
  assert(!slot(doc, "primary-label").textContent.includes("not wired"));
  assert(!slot(doc, "morning").textContent.includes("not wired"));
});

/* review D-1: the fitter is a no-op where there is no layout, and never truncates. */
test("the headline fitter cannot truncate engine text and stays off without layout", () => {
  const { doc } = setup();
  const longest = design.headlineVocabulary()[0];
  const headline = slot(doc, "instruction");
  headline.textContent = longest;
  assert.equal(headline.textContent, longest, "engine text is never shortened");
  assert.doesNotMatch(headline.textContent, /…|\.\.\./, "no ellipsis is ever added");
  // jsdom reports no layout, so the fitter must leave the headline at the approved size.
  assert.equal(doc.querySelector(".page").style.getPropertyValue("--headline"), "");
  assert.equal(app.HEADLINE_BASE, 47);
  assert.equal(app.HEADLINE_FLOOR, 33);
  const approved = design.readApproved();
  assert(approved.some((a) => a.styles.includes("font-size:47px")), "47px is C's own headline size");
  assert(approved.some((a) => a.styles.includes("font-size:33px")), "33px is C's own smallest display size");
});

test("not one digit appears on Today outside a bound slot", () => {
  const { doc } = setup();
  const clone = doc.getElementById("phone").cloneNode(true);
  for (const bound of clone.querySelectorAll("[data-slot]")) bound.textContent = "";
  assert.doesNotMatch(clone.textContent, /\d/,
    "a figure survived in the template instead of being bound: " + clone.textContent.replace(/\s+/g, " ").trim());
});

/* ---- review F4: the iOS zoom rule, on the inputs the page ACTUALLY renders ---- */
function cascade(css) {
  // Comments MUST go first. Without that, the comment before a rule is swallowed into its
  // selector, el.matches() throws on the nonsense, the rule is silently skipped and the
  // test measures the approved 14px instead of the 16px correction — which is how the
  // first version of this test passed while proving nothing.
  const flat = css.replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/@font-face\{[^{}]*\}/g, " ")
    .replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, " ");
  const rules = [];
  for (const match of flat.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const body = match[2];
    const explicit = body.match(/(?:^|;)\s*font-size\s*:\s*(\d+(?:\.\d+)?)px/);
    const shorthand = body.match(/(?:^|;)\s*font\s*:\s*(?:[^;]*?\s)?(\d+(?:\.\d+)?)px/);
    const size = explicit ? Number(explicit[1]) : shorthand ? Number(shorthand[1]) : null;
    if (size === null) continue;
    for (const selector of match[1].split(",")) rules.push({ selector: selector.trim(), size });
  }
  return rules;
}
const VENDOR = /::-webkit-|::-moz-|::backdrop|:focus-visible/;
function fontSizeOf(el, rules) {
  let size = 16;
  for (const rule of rules) {
    try { if (el.matches(rule.selector)) size = rule.size; }
    catch (error) {
      // A selector this DOM cannot evaluate must be a known vendor/pseudo form, never a
      // rule that was silently dropped because the parser mangled it.
      assert.match(rule.selector, VENDOR, "unparseable selector in the shipped stylesheet: " + rule.selector);
    }
  }
  return size;
}

test("every text input the page actually renders is 16px or more", () => {
  const rules = cascade(design.composeStyles(design.readApproved(), design.chromeCss(), []));
  const { doc } = setup();
  const seen = [];
  const sweep = (where) => {
    for (const el of doc.querySelectorAll("input, select, textarea")) {
      const size = fontSizeOf(el, rules);
      seen.push([where, el.id || el.tagName, size]);
      assert(size >= 16, `${where}: ${el.id || el.tagName} renders at ${size}px`);
    }
  };
  for (const screen of ["nutrition", "recovery", "coach", "why"]) {
    doc.querySelector(`[data-go="${screen}"]`).click();
    sweep(screen);
    doc.querySelector('[data-go="today"]').click();
  }
  sweep("today");
  slot(doc, "primary").click();
  sweep("weigh-in");

  // The only input this slice renders is the weigh-in box; say so rather than implying
  // a sweep that covered more (review F4).
  const inputs = seen.filter(([, name]) => name === "morning-weight");
  assert.equal(inputs.length, 1, "the weigh-in box is the one input A1 renders: " + JSON.stringify(seen));
  assert(inputs[0][2] >= 16, "the weigh-in box is at least 16px");
});

test("the 16px correction really would raise the approved sub-16px fields A3 will render", () => {
  const rules = cascade(design.composeStyles(design.readApproved(), design.chromeCss(), []));
  const { doc } = setup();
  const view = doc.querySelector(".view");
  // Construct the approved check-in and coach fields the recovery/coach screens will use
  // once A3 wires them, and confirm the correction applies to each.
  const cases = [
    ['<div class="followup"><input id="probe-a"></div>', "probe-a"],
    ['<div class="followup"><select id="probe-b"></select></div>', "probe-b"],
    ['<form class="composer"><input id="probe-c"></form>', "probe-c"],
    ['<input class="hours" id="probe-d">', "probe-d"],
    ['<textarea id="probe-e"></textarea>', "probe-e"],
  ];
  for (const [html, id] of cases) {
    const host = doc.createElement("div");
    host.innerHTML = html;
    view.append(host);
    const el = doc.getElementById(id);
    assert(fontSizeOf(el, rules) >= 16, id + " would render below 16px");
    host.remove();
  }
  // And the correction is load-bearing: without preview.css those same fields are < 16px.
  const approvedOnly = cascade(design.composeStyles(design.readApproved(), "", []));
  const host = doc.createElement("div");
  host.innerHTML = '<div class="followup"><input id="probe-f"></div>';
  view.append(host);
  assert(fontSizeOf(doc.getElementById("probe-f"), approvedOnly) < 16,
    "the approved reference really does set this field below 16px");
  host.remove();
});
