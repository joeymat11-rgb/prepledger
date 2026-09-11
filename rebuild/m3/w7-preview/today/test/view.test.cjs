"use strict";

/* A1 — the view: the owner-approved 2026-09-08 Today screen bound to the real adapter.
   These tests prove that every figure on screen came from the engine or a stored
   operation, that the approved prototype's fictional numbers are gone, that the screens
   this slice does not build say so, and that every text input the athlete can focus is
   at least 16px (the iOS zoom rule). */

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const { createEngine } = require("../../../../engine/index.cjs");
const { mountToday } = require("../today-app.cjs");
const { createTodayModel, createBasisState, engineClockFor, SYNTHETIC_DAY } = require("../today-model.cjs");
const { createMemoryStorage } = require("../web-storage-backend.cjs");
const design = require("../design.cjs");

const SOURCE = path.resolve(__dirname, "..");
const ROOT = path.resolve(__dirname, "../../../../..");
const DAY = SYNTHETIC_DAY;

/* The approved prototypes' numbers are fictional (rebuild/m1/MOCK.md). These particular
   figures cannot be a value this synthetic athlete's engine produces, so seeing one means
   template text survived instead of being bound. Substring checks, not word-boundary
   regexes: "2,300kcal" has no word boundary after the 0, and a \\b test there silently
   passes whatever is on screen.

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

test("Today paints the approved design from engine values only", () => {
  const { doc, model } = setup();
  const view = model.read();
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = createBasisState(DAY);

  assert.equal(doc.querySelector(".brand").textContent, "Earned");
  assert.equal(doc.querySelector(".day-label").textContent, "Your plan for today");
  assert.equal(slot(doc, "instruction").textContent, reference.nowModel(state).move.title);
  assert.equal(slot(doc, "instruction-why").textContent, reference.statusFace(state).cause);
  assert.equal(slot(doc, "workout-title").textContent, reference.nowModel(state).workout.title);
  assert.equal(slot(doc, "workout-count").textContent,
    reference.genSession(state, DAY, null).ex.length + " exercises");
  assert.equal(slot(doc, "trend").textContent, reference.nowModel(state).headed.weight.toFixed(1) + " lb");
  assert.match(slot(doc, "kcal-note").textContent, new RegExp(String(reference.calorieTarget(state).lo).slice(0, 1)));
  assert.match(slot(doc, "protein").textContent, new RegExp(String(reference.proteinTarget(state).g)));
  assert.equal(slot(doc, "morning").textContent, "Not logged yet");
  assert.equal(view.hasReadToday, false);
  for (const figure of FICTIONAL) assert(!phoneText(doc).includes(figure), "prototype figure on screen: " + figure);
});

test("the primary action before a weigh-in is the engine's own marching order", () => {
  const { doc, model } = setup();
  const view = model.read();
  assert.equal(slot(doc, "primary-note").textContent, view.marchingOrder.why);
  assert.equal(slot(doc, "primary-label").textContent.toLowerCase(), view.marchingOrder.thenText.toLowerCase());
});

test("a weigh-in through the sheet rebinds every engine-derived value on Today", () => {
  const { dom, doc, model } = setup();
  slot(doc, "primary").click();
  const sheet = doc.querySelector('[role="dialog"]');
  assert(sheet, "the weigh-in sheet opened");
  assert.equal(doc.activeElement.id, "morning-weight");
  const input = doc.getElementById("morning-weight");
  input.value = "179.4";
  sheet.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));

  assert.equal(doc.querySelector('[role="dialog"]'), null, "the sheet closed");
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = reference.applyRead(createBasisState(DAY), DAY, 179.4, { hour: 8 });
  assert.equal(slot(doc, "morning").textContent, "179.4 lb");
  assert.equal(slot(doc, "trend").textContent, reference.nowModel(state).headed.weight.toFixed(1) + " lb");
  assert.equal(slot(doc, "instruction").textContent, reference.nowModel(state).move.title);
  assert.equal(slot(doc, "morning-label").textContent, "This morning ✓");
  assert.match(slot(doc, "primary-label").textContent, /^Start /);
  assert.equal(model.read().hasReadToday, true);
  for (const figure of FICTIONAL) assert(!phoneText(doc).includes(figure), "prototype figure on screen: " + figure);
});

test("a refused weigh-in shows the client's own refusal and paints no number", () => {
  const { dom, doc, model } = setup();
  const before = phoneText(doc);
  slot(doc, "primary").click();
  const sheet = doc.querySelector('[role="dialog"]');
  const input = doc.getElementById("morning-weight");
  input.value = "";
  sheet.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  const error = doc.getElementById("weigh-error").textContent;
  assert(error.length > 0, "a refusal is shown");
  assert.doesNotMatch(error, /\d+\.\d/, "a refusal carries no weight");
  assert(doc.querySelector('[role="dialog"]'), "the sheet stays open on a refusal");
  assert.equal(model.read().hasReadToday, false);
  doc.querySelector('[data-action="cancel"]').click();
  assert.equal(phoneText(doc), before, "nothing on Today changed");
});

test("a reload of the page restores the stored weigh-in on screen", () => {
  const storage = createMemoryStorage();
  const first = setup({ storage });
  first.model.weighIn(177.6);
  first.api.render("today");
  const shown = slot(first.doc, "trend").textContent;

  const second = setup({ storage });
  assert.equal(slot(second.doc, "morning").textContent, "177.6 lb");
  assert.equal(slot(second.doc, "trend").textContent, shown);
  assert.equal(slot(second.doc, "morning-label").textContent, "This morning ✓");
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
  assert.match(rows[3], /Not prescribed/);
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

  doc.querySelector('[data-go="today"]').click();
  slot(doc, "primary").click();
  doc.querySelector('[data-action="cancel"]').click();
});

test("the workout entry point carries the engine's session name and nothing more", () => {
  const storage = createMemoryStorage();
  const { doc, model } = setup({ storage });
  model.weighIn(180.2);
  doc.querySelector('[data-go="why"]').click();
  doc.querySelector('[data-go="today"]').click();
  slot(doc, "primary").click();
  assert.match(phoneText(doc), /Workout logging is not wired yet/);
  assert.equal(slot(doc, "workout-title").textContent, model.read().workout.title);
  assert.doesNotMatch(phoneText(doc), /\d/, "not one figure appears on an unwired screen");
});

test("an untrusted local record paints no number anywhere", () => {
  const storage = createMemoryStorage();
  const seeded = createTodayModel({ storage });
  seeded.weighIn(181.9);
  require("../web-storage-backend.cjs").createWebStorageBackend(storage).clear("ops");
  const { doc } = setup({ storage });
  assert.match(slot(doc, "instruction").textContent, /cannot show today's plan/);
  assert.equal(slot(doc, "kcal").textContent, "Not available yet");
  assert.equal(slot(doc, "trend").textContent, "Not available yet");
  assert.doesNotMatch(phoneText(doc), /\d+\.\d|\d,\d{3}/, "no figure survives an untrusted record");
  assert.equal(slot(doc, "primary").disabled, true);
});

/* ---- the iOS zoom rule, checked against the ACTUAL cascade the page ships ---- */
function cascade(css) {
  const flat = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, " ");
  const rules = [];
  for (const match of flat.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const body = match[2];
    let size = null;
    const explicit = body.match(/(?:^|;)\s*font-size\s*:\s*(\d+(?:\.\d+)?)px/);
    const shorthand = body.match(/(?:^|;)\s*font\s*:\s*(?:[^;]*?\s)?(\d+(?:\.\d+)?)px/);
    if (explicit) size = Number(explicit[1]);
    else if (shorthand) size = Number(shorthand[1]);
    if (size === null) continue;
    for (const selector of match[1].split(",")) rules.push({ selector: selector.trim(), size });
  }
  return rules;
}
function fontSizeOf(el, rules) {
  let size = 16;
  for (const rule of rules) {
    try { if (el.matches(rule.selector)) size = rule.size; } catch (_) { /* engine-specific selector */ }
  }
  return size;
}

test("every text input the athlete can focus renders at 16px or more", () => {
  const rules = cascade(design.composeStyles(design.readApproved(), design.chromeCss()));
  const { doc } = setup();
  const seen = [];
  for (const screen of ["today", "nutrition", "recovery", "coach", "why"]) {
    const go = doc.querySelector(`[data-go="${screen}"]`);
    if (go) go.click(); else doc.querySelector('[data-go="today"]');
    for (const el of doc.querySelectorAll("input, select, textarea")) {
      const size = fontSizeOf(el, rules);
      seen.push([screen, el.id || el.tagName, size]);
      assert(size >= 16, `${screen}: ${el.id || el.tagName} renders at ${size}px`);
    }
    const back = doc.querySelector('[data-go="today"]');
    if (back) back.click();
  }
  slot(doc, "primary").click();
  for (const el of doc.querySelectorAll('[role="dialog"] input')) {
    const size = fontSizeOf(el, rules);
    seen.push(["weigh-in", el.id, size]);
    assert(size >= 16, `weigh-in: ${el.id} renders at ${size}px`);
  }
  assert(seen.length > 0, "at least one input was checked");
});

/* ---- the strong guard: every figure on Today is a bound engine value ---- */
test("every figure on Today equals the reference engine's own value, slot by slot", () => {
  const storage = createMemoryStorage();
  const { doc } = setup({ storage });
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const app = require("../today-app.cjs");
  const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  for (const [state, label] of [[createBasisState(DAY), "before"],
    [reference.applyRead(createBasisState(DAY), DAY, 176.2, { hour: 8 }), "after"]]) {
    if (label === "after") {
      slot(doc, "primary").click();
      const sheet = doc.querySelector('[role="dialog"]');
      doc.getElementById("morning-weight").value = "176.2";
      sheet.dispatchEvent(new (doc.defaultView.Event)("submit", { bubbles: true, cancelable: true }));
    }
    const calories = reference.calorieTarget(state);
    const protein = reference.proteinTarget(state);
    const rate = reference.currentRate(state);
    assert.equal(slot(doc, "kcal").textContent, money.format(Math.round(calories.mid / 100) * 100) + "kcal", label);
    assert.equal(slot(doc, "kcal-note").textContent, app.calorieBand(calories), label);
    assert.equal(slot(doc, "protein").textContent, money.format(protein.g) + "g protein", label);
    assert.equal(slot(doc, "trend").textContent, reference.nowModel(state).headed.weight.toFixed(1) + " lb", label);
    assert.equal(slot(doc, "rate").textContent, app.rateSentence(rate), label);
    assert.equal(slot(doc, "instruction").textContent, reference.nowModel(state).move.title, label);
    assert.equal(slot(doc, "workout-count").textContent,
      reference.genSession(state, DAY, null).ex.length + " exercises", label);
  }
  assert.equal(slot(doc, "morning").textContent, "176.2 lb");
});

test("not one digit appears on Today outside a bound slot", () => {
  const { doc } = setup();
  const phone = doc.getElementById("phone");
  const clone = phone.cloneNode(true);
  for (const bound of clone.querySelectorAll("[data-slot]")) bound.textContent = "";
  assert.doesNotMatch(clone.textContent, /\d/,
    "a figure survived in the template instead of being bound: " + clone.textContent.replace(/\s+/g, " ").trim());
});
