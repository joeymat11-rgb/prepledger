/* A1 — the view: the owner-approved 2026-09-08 Today screen bound to the real adapter.
   These tests prove that every figure on screen came from the engine or a stored
   operation, that the engine's own reading note is shown rather than dropped (review F1),
   that the screens this slice does not build say so, and that every text input the page
   actually renders is at least 16px (the iOS zoom rule, review F4).

   A2 review B2: the weigh-in's store of record is now the accepted encrypted
   repository (reading-host.mjs), so this file drives the real durable lane over
   fake-indexeddb and awaits the transaction, exactly as the page does. It needs
   rebuild/m3/w6's own dependencies for that. */

import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { JSDOM } from "jsdom";
import { faultDatabase } from "../../../w6/test/support.mjs";
import { createReadingHost } from "../reading-host.mjs";
import { AUTHORITY_KID } from "../gym-host.mjs";
import Engine from "../../../../engine/index.cjs";
import app from "../today-app.cjs";
import TodayModel from "../today-model.cjs";
import design from "../design.cjs";

const { createEngine } = Engine;
const { mountToday, morningLine, trendLine, calorieBand, calorieHeadline } = app;
const { createTodayModel, createBasisState, engineClockFor, SYNTHETIC_DAY } = TodayModel;

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

async function deviceKeys() {
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  return { kid: AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true } };
}
function shell() {
  return design.shellHtml().replace("<!-- APPROVED_TEMPLATES -->", design.templateHtml());
}
async function lane(options = {}) {
  const fault = options.fault || faultDatabase();
  const keys = options.keys || await deviceKeys();
  const open = () => createReadingHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto, deviceKeys: keys });
  return { fault, keys, open, readings: await open() };
}
async function setup(options = {}) {
  const dom = new JSDOM(shell(), { url: "http://127.0.0.1:4178/" });
  const doc = dom.window.document;
  const store = options.lane || await lane();
  const model = options.model || createTodayModel({ today: DAY, readings: store.readings });
  const api = mountToday(doc, model, options.mount || {});
  return { dom, doc, model, api, lane: store, close: () => store.readings.close() };
}
const phoneText = (doc) => doc.getElementById("phone").textContent;
const slot = (doc, name) => doc.querySelector(`[data-slot="${name}"]`);

/* The sheet's submit handler awaits a real encrypted transaction, so the test has
   to wait for it too — the same wait a person makes. */
async function settle(doc) {
  for (let tick = 0; tick < 200; tick++) {
    await new Promise((resolve) => setTimeout(resolve, 2));
    const open = doc.querySelector('[role="dialog"]');
    if (!open) return;
    if (doc.getElementById("weigh-error").textContent.trim().length > 0) return;
  }
  throw new Error("the weigh-in never settled");
}
async function weighIn(dom, doc, value) {
  slot(doc, "primary").click();
  const sheet = doc.querySelector('[role="dialog"]');
  doc.getElementById("morning-weight").value = String(value);
  sheet.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  await settle(doc);
  return sheet;
}

test("Today paints the approved design from engine values only", async () => {
  const kit = await setup();
  const { doc, model } = kit;
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
  kit.close();
});

test("the primary action before a weigh-in is the engine's own marching order", async () => {
  const kit = await setup();
  const view = kit.model.read();
  assert.equal(slot(kit.doc, "primary-label").textContent.toLowerCase(), view.marchingOrder.thenText.toLowerCase());
  assert.equal(slot(kit.doc, "instruction-why").textContent, view.marchingOrder.why);
  kit.close();
});

test("a weigh-in through the sheet rebinds every engine-derived value on Today", async () => {
  const kit = await setup();
  const { dom, doc, model } = kit;
  await weighIn(dom, doc, 179.4);
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
  kit.close();
});

/* ---- review F1: the engine's reading note is shown, not dropped ---- */
test("a spike reading renders the ENGINE's own note beside it; a quiet reading renders none", async () => {
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const spikeState = reference.applyRead(createBasisState(DAY), DAY, 191.7, { hour: 8 });
  const spikeNote = spikeState.reads.at(-1).note;
  assert(spikeNote && spikeNote.length > 0, "the accepted writer really does attach a note to a spike");

  const spike = await setup();
  await weighIn(spike.dom, spike.doc, 191.7);
  const shown = slot(spike.doc, "morning").textContent;
  assert.equal(shown, "This morning ✓ 191.7 lb · " + spikeNote);
  assert.match(spike.doc.getElementById("phone").textContent,
    new RegExp(spikeNote.slice(0, 12).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  spike.close();

  const quietState = reference.applyRead(createBasisState(DAY), DAY, 179.4, { hour: 8 });
  assert.equal(quietState.reads.at(-1).note, "", "this reading carries no note");
  const quiet = await setup();
  await weighIn(quiet.dom, quiet.doc, 179.4);
  assert.equal(slot(quiet.doc, "morning").textContent, "This morning ✓ 179.4 lb");
  assert(!slot(quiet.doc, "morning").textContent.includes("·"), "no separator is printed with no note");
  quiet.close();
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
test("an impossible weight is refused with an honest message and records nothing", async () => {
  const kit = await setup();
  const { dom, doc, model } = kit;
  for (const value of ["10000", "0", "-5", "59.9", "400.1", "180.01"]) {
    const sheet = await weighIn(dom, doc, value);
    const message = doc.getElementById("weigh-error").textContent;
    assert(message.length > 0, "refused " + value + " in words");
    assert.match(message, /Nothing was recorded/);
    assert(doc.querySelector('[role="dialog"]'), "the sheet stays open on a refusal");
    doc.querySelector('[data-action="cancel"]').click();
    assert.equal(sheet.isConnected, false);
  }
  assert.equal(model.read().hasReadToday, false);
  const ops = (await kit.lane.readings.repository.load()).generation.collections.ops || {};
  assert.equal(Object.keys(ops).length, 0, "no impossible weight reached the log");
  // And the bound is a FORM bound, not a claim about the engine: a weight inside it works.
  await weighIn(dom, doc, "179.4");
  assert.equal(model.read().hasReadToday, true);
  kit.close();
});

test("an empty box is refused by the CLIENT, in the client's own words", async () => {
  const kit = await setup();
  await weighIn(kit.dom, kit.doc, "");
  const message = kit.doc.getElementById("weigh-error").textContent;
  assert.match(message, /A weight is required/);
  assert.doesNotMatch(message, /\d+\.\d/, "a refusal carries no weight");
  assert.equal(kit.model.read().hasReadToday, false);
  kit.close();
});

test("a refused weigh-in leaves Today exactly as it was", async () => {
  const kit = await setup();
  const before = phoneText(kit.doc);
  await weighIn(kit.dom, kit.doc, "10000");
  kit.doc.querySelector('[data-action="cancel"]').click();
  assert.equal(phoneText(kit.doc), before, "nothing on Today changed");
  assert.equal(kit.model.read().hasReadToday, false);
  kit.close();
});

test("a reload of the page restores the stored weigh-in on screen", async () => {
  const store = await lane();
  const first = await setup({ lane: store });
  await first.model.weighIn(177.6);
  first.api.render("today");
  const shown = slot(first.doc, "trend").textContent;
  store.readings.close();

  const reopened = await lane({ fault: store.fault, keys: store.keys });
  const second = await setup({ lane: reopened });
  assert.match(slot(second.doc, "morning").textContent, /^This morning ✓ 177\.6 lb/);
  assert.equal(slot(second.doc, "trend").textContent, shown);
  second.close();
});

test("Why this plan shows only the engine's own explanations", async () => {
  const kit = await setup();
  const { doc, model } = kit;
  doc.querySelector('[data-go="why"]').click();
  const view = model.read();
  const bodies = [...doc.querySelectorAll(".macro-row p")].map((p) => p.textContent);
  assert.equal(bodies.length, view.why.length);
  assert.equal(bodies[0], view.calorieTarget.why);
  assert.equal(bodies[1], view.proteinTarget.why);
  assert.equal(slot(doc, "why-lead").textContent, view.nowModel.move.body);
  doc.querySelector('[data-go="today"]').click();
  assert(slot(doc, "instruction"), "Back returns to Today");
  kit.close();
});

test("every screen this slice does not build says so and shows no invented value", async () => {
  const kit = await setup();
  const { doc } = kit;

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
  kit.close();
});

/* A2 made the workout entry point real. With NO workout host injected — which is
   exactly what a browser that will not give the page an encrypted local store
   looks like — the entry point must say that plainly, name what is missing, and
   show no prescription and no figure. It must NOT claim the feature is unbuilt, and
   it must not fabricate a session. The wired path is proved end to end, over the
   real durable store, in test/gym.test.mjs. */
test("with no encrypted local store, the workout entry point says so and shows no figure", async () => {
  const kit = await setup();
  const { dom, doc, model } = kit;
  await weighIn(dom, doc, 180.2);
  slot(doc, "primary").click();
  assert.match(phoneText(doc), /could not be opened on this device, and nothing was recorded/);
  assert.match(phoneText(doc), /encrypted local store/);
  assert.doesNotMatch(phoneText(doc), /not wired yet/, "the gym card is wired; this device has no store");
  assert.equal(slot(doc, "workout-title").textContent, model.read().workout.title);
  assert.doesNotMatch(phoneText(doc), /\d/, "not one figure appears when the workout cannot be opened");
  kit.close();
});

/* A2 — the injected workout host is what Today reads its workout state from. A
   Today with no host must never invent one, and the four states must come from
   that host and nowhere else. (The states themselves are read off the real durable
   log in test/gym.test.mjs; this checks Today cannot make one up.) */
test("Today's workout state comes from the injected host, never from the page", async () => {
  const plain = await setup();
  assert.match(slot(plain.doc, "workout-count").textContent, /Your set targets are ready$/);
  plain.close();

  for (const [phase, expected] of [["active", app.WORKOUT_IN_PROGRESS], ["finished", app.WORKOUT_RECORDED_TODAY]]) {
    let opened = 0;
    const kit = await setup({ mount: { workout: { summary: () => ({ phase, sets: 0 }), open: () => { opened += 1; } } } });
    const { doc, model, api } = kit;
    assert.match(slot(doc, "workout-count").textContent, new RegExp(expected + "$"), phase);
    // A finished workout does not displace the morning weigh-in from the single
    // primary action; an UNFINISHED one does, so it can never become unreachable.
    if (phase === "finished") {
      assert.equal(slot(doc, "primary-label").textContent, "Log the scale");
      await model.weighIn(178.3);
      api.render("today");
    }
    assert.equal(slot(doc, "primary-label").textContent,
      phase === "active" ? "Resume " + model.read().workout.title : app.REVIEW_WORKOUT, phase);
    slot(doc, "primary").click();
    assert.equal(opened, 1, phase + ": the primary action opens the injected gym card");
    kit.close();
  }
});

/* REVIEW B1 — Today must never offer "ready" and "Start" for a workout the accepted
   layer has already refused to prepare. The probe's refusal is shown in plain words
   with the layer's own code exactly once, and never as a fault of the device. */
test("a refused preparation is shown on Today, with the layer's code once and no device blame", async () => {
  let opened = 0;
  const kit = await setup({ mount: { workout: {
    summary: () => ({ phase: "blocked", sets: 0, code: "PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED" }),
    open: () => { opened += 1; } } } });
  const { doc, model, api } = kit;
  await model.weighIn(179.4);
  api.render("today");

  const line = slot(doc, "workout-count").textContent;
  assert(!line.includes("Your set targets are ready"), "a refused workout is never called ready: " + line);
  assert(line.includes(app.WORKOUT_CANNOT_OPEN), line);
  assert.equal(line.split("PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED").length, 2,
    "the code appears exactly once: " + line);
  assert(!phoneText(doc).includes(app.NO_LOCAL_STORE), "an engine refusal never blames the device");

  const label = slot(doc, "primary-label").textContent;
  assert.equal(label, app.WHY_WORKOUT_CANNOT_OPEN);
  assert(!label.startsWith("Start "), "Start is not offered for a workout that cannot be prepared");
  slot(doc, "primary").click();
  assert.equal(opened, 1, "the athlete can still read the whole refusal");
  kit.close();
});

test("an untrusted local record paints no number anywhere", async () => {
  const store = await lane();
  const seeded = createTodayModel({ today: DAY, readings: store.readings });
  await seeded.weighIn(181.9);
  // Corrupt the stored operation collection under the page.
  const snapshot = await store.readings.repository.load();
  const damaged = JSON.parse(JSON.stringify(snapshot.generation));
  damaged.collections.ops = {};
  await store.readings.repository.commit({ revision: snapshot.revision, token: snapshot.token }, damaged, () => null);
  store.readings.close();

  const reopened = await lane({ fault: store.fault, keys: store.keys });
  const kit = await setup({ lane: reopened });
  const { doc } = kit;
  assert.match(slot(doc, "instruction").textContent, /cannot show today's plan/);
  assert.equal(slot(doc, "kcal").textContent, "Not available yet");
  assert.equal(slot(doc, "trend").textContent, "Not available yet");
  assert.doesNotMatch(phoneText(doc), /\d+\.\d|\d,\d{3}/, "no figure survives an untrusted record");
  assert.equal(slot(doc, "primary").disabled, true);
  kit.close();
});

/* ---- the strong guard: every figure on Today is a bound engine value ---- */
test("every figure on Today equals the reference engine's own value, slot by slot", async () => {
  const kit = await setup();
  const { dom, doc } = kit;
  const reference = createEngine({ clock: engineClockFor(DAY) });
  for (const [state, label] of [[createBasisState(DAY), "before"],
    [reference.applyRead(createBasisState(DAY), DAY, 176.2, { hour: 8 }), "after"]]) {
    if (label === "after") await weighIn(dom, doc, 176.2);
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
  kit.close();
});

/* review D-2: the athlete must not have to tap to discover an entry point is unwired. */
test("every unwired entry point says so on Today's own face, in secondary text", async () => {
  const kit = await setup();
  const { doc } = kit;
  for (const name of ["nutrition-state", "recovery-state", "coach-state"]) {
    const el = slot(doc, name);
    assert(el, name + " is on Today");
    assert.equal(el.textContent, app.NOT_WIRED);
    assert.equal(el.closest("[data-go]") !== null, true, name + " sits inside its own entry point");
  }
  assert(slot(doc, "nutrition-state").classList.contains("muted"));
  assert(slot(doc, "recovery-state").classList.contains("muted"));
  assert(slot(doc, "coach-state").closest(".sub"), "the coach marker is in the .sub line");
  const face = phoneText(doc);
  for (const label of ["Your full nutrition plan", "How are you feeling today?", "Ask your coach"]) {
    const at = face.indexOf(label);
    assert(at >= 0, label);
    assert(face.slice(at, at + 120).includes(app.NOT_WIRED), label + " is not marked on Today's face");
  }
  for (const screen of ["nutrition", "recovery", "coach"]) {
    doc.querySelector(`[data-go="${screen}"]`).click();
    assert.match(phoneText(doc), /not wired yet/, screen);
    doc.querySelector('[data-go="today"]').click();
  }
  kit.close();
});

test("the wired action is NOT marked unwired", async () => {
  const kit = await setup();
  assert(!slot(kit.doc, "primary-label").textContent.includes("not wired"));
  assert(!slot(kit.doc, "morning").textContent.includes("not wired"));
  kit.close();
});

/* review D-1: the fitter is a no-op where there is no layout, and never truncates. */
test("the headline fitter cannot truncate engine text and stays off without layout", async () => {
  const kit = await setup();
  const { doc } = kit;
  const longest = design.headlineVocabulary()[0];
  const headline = slot(doc, "instruction");
  headline.textContent = longest;
  assert.equal(headline.textContent, longest, "engine text is never shortened");
  assert.doesNotMatch(headline.textContent, /…|\.\.\./, "no ellipsis is ever added");
  assert.equal(doc.querySelector(".page").style.getPropertyValue("--headline"), "");
  assert.equal(app.HEADLINE_BASE, 47);
  assert.equal(app.HEADLINE_FLOOR, 33);
  const approved = design.readApproved();
  assert(approved.some((a) => a.styles.includes("font-size:47px")), "47px is C's own headline size");
  assert(approved.some((a) => a.styles.includes("font-size:33px")), "33px is C's own smallest display size");
  kit.close();
});

test("not one digit appears on Today outside a bound slot", async () => {
  const kit = await setup();
  const clone = kit.doc.getElementById("phone").cloneNode(true);
  for (const bound of clone.querySelectorAll("[data-slot]")) bound.textContent = "";
  assert.doesNotMatch(clone.textContent, /\d/,
    "a figure survived in the template instead of being bound: " + clone.textContent.replace(/\s+/g, " ").trim());
  kit.close();
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
      assert.match(rule.selector, VENDOR, "unparseable selector in the shipped stylesheet: " + rule.selector);
    }
  }
  return size;
}

test("every text input the page actually renders is 16px or more", async () => {
  const rules = cascade(design.composeStyles(design.readApproved(), design.chromeCss(), []));
  const kit = await setup();
  const { doc } = kit;
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

  const inputs = seen.filter(([, name]) => name === "morning-weight");
  assert.equal(inputs.length, 1, "the weigh-in box is the one input Today renders: " + JSON.stringify(seen));
  assert(inputs[0][2] >= 16, "the weigh-in box is at least 16px");
  kit.close();
});

test("the 16px correction really would raise the approved sub-16px fields A3 will render", async () => {
  const rules = cascade(design.composeStyles(design.readApproved(), design.chromeCss(), []));
  const kit = await setup();
  const { doc } = kit;
  const view = doc.querySelector(".view");
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
  const approvedOnly = cascade(design.composeStyles(design.readApproved(), "", []));
  const host = doc.createElement("div");
  host.innerHTML = '<div class="followup"><input id="probe-f"></div>';
  view.append(host);
  assert(fontSizeOf(doc.getElementById("probe-f"), approvedOnly) < 16,
    "the approved reference really does set this field below 16px");
  host.remove();
  kit.close();
});
