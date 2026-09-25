/* coach.test.mjs - C-UI-6, the Coach screen (rebuild/lanes/c/ui-port/C-UI-6.md).

   What these cells hold, each against the PINNED pack (rebuild/m1/approved-2026-09-18),
   never against a list typed here:
     C6-1  the shipped t-coach template is the pack's #screen-coach .ui, element for
           element, class for class and word for word (less the three named omissions);
     C6-2  the gate's two coach font identities (gate.py KNOWN_FACE coach) are real,
           rendered, bound elements of the live screen: h1.coach-title, p.coach-line;
     C6-3  every coach state the pack draws is registered, in INDEX.json's own order;
     C6-4  each of the 65 states, put on THIS view through the review hook, shows exactly
           the visible text the pack's committed record for it holds;
     C6-5  the live screen, with no live coach in this build: every way of asking is
           answered by the pack's C-61 refusal, the pill goes dark once a card is on
           screen, the orb settles, and nothing opens the microphone or the network;
     C6-6  text mode and tap mode are the drawn C-06 and C-07, both ways;
     C6-7  the level ring follows a level source when one is handed in, holds still at
           its listening weight when none is, and nothing on the screen animates;
     C6-8  leaving the screen takes back every attribute it put on the frame;
     C6-9  the coach binding refuses a word the design does not have;
     C6-10 today-app routes Coach to this view and no longer carries the stub. */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JSDOM } from "jsdom";
import design from "../design.cjs";
import { openCoach, installCoachStates, COACH_STATES, COACH_COPY, levelFromSamples, smoothLevel }
  from "../coach-app.mjs";

const PACK = path.join(design.ROOT, "rebuild/m1/approved-2026-09-18");
const read = (rel) => fs.readFileSync(path.join(PACK, rel), "utf8");
const norm = (s) => s.replace(/\s+/g, " ").trim();

function page(url = "http://127.0.0.1:4178/") {
  const html = design.shellHtml().replace("<!-- APPROVED_TEMPLATES -->", design.templateHtml());
  const dom = new JSDOM(html, { url });
  return { dom, win: dom.window, doc: dom.window.document, phone: dom.window.document.getElementById("phone") };
}
function manualTimers() {
  const due = [];
  return { due, setTimeout: (fn, ms) => { due.push({ fn, ms }); return due.length; },
    clearTimeout: (id) => { if (due[id - 1]) due[id - 1].fn = null; },
    run: () => { for (const entry of due.splice(0)) if (entry.fn) entry.fn(); } };
}
/* What the pack's record calls visible: own text of every element that is not hidden,
   in document order. The pack CSS that hides a whole element on this screen is
   emulated, and only that: [hidden], .screen-coach .wordmark, text mode's mic and
   links, tap mode's mic, and the mic disc where voice cannot work. */
function visibleText(phone, frame) {
  const mode = frame.getAttribute("data-mode"), micOff = frame.getAttribute("data-mic") === "off";
  const gone = (el) => el.hidden || el.classList.contains("wordmark")
    || (mode === "text" && (el.classList.contains("mic-wrap") || el.classList.contains("coach-links")))
    || (mode === "tap" && el.classList.contains("mic-wrap"))
    || (micOff && el.classList.contains("mic-button"));
  const out = [];
  const walk = (el) => {
    if (gone(el)) return;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ");
    if (own.trim()) out.push(norm(own));
    for (const child of el.children) walk(child);
  };
  for (const child of phone.children) walk(child);
  return norm(out.join(" "));
}
/* An element signature for the structural comparison: tag, sorted classes, own words. */
function signature(root, skip) {
  const out = [];
  const walk = (el) => {
    if (skip(el)) return;
    const own = norm([...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" "));
    out.push(el.tagName.toLowerCase() + "." + [...el.classList].sort().join(".") + (el.id ? "#" + el.id : "") + "|" + own);
    for (const child of el.children) walk(child);
  };
  walk(root);
  return out;
}

test("C6-1 the shipped t-coach is the pack's #screen-coach .ui, element for element", () => {
  const pack = new JSDOM(read("app/app.html")).window.document;
  const ui = pack.querySelector("#screen-coach .ui");
  assert(ui, "the pack draws #screen-coach .ui");
  const { doc } = page();
  const content = doc.getElementById("t-coach").content;
  const skip = (el) => el.classList.contains("coach-sub") || el.classList.contains("coach-sub2");
  for (const part of ["body", "stack"]) {
    const want = signature(ui.querySelector(":scope > ." + part), skip);
    const got = signature(content.querySelector("." + part), skip);
    assert.deepEqual(got, want, "the " + part + " is the pack's, element for element");
  }
  /* the three named omissions, and nothing else: no scripted-answer keys, no jump away */
  assert.equal(content.querySelectorAll("[data-answer]").length, 0);
  assert.equal(content.querySelector("#coach-tap").getAttribute("data-go"), null);
  assert.equal(content.querySelectorAll(".coach-sub, .coach-sub2").length, 0);
});

test("C6-2 the gate's coach font identities are real, rendered, bound elements", () => {
  const gate = read("quality/gate.py");
  assert.match(gate, /'coach': \('\.coach-title', '\.coach-line'\),/, "gate.py KNOWN_FACE coach is what this cell holds");
  assert.match(gate, /'coach': \['\.coach-title'\],/, "gate.py SERIF_SELECTORS coach is what this cell holds");
  const { doc, phone } = page();
  const view = openCoach({ doc, phone, state: null });
  const title = phone.querySelectorAll(".coach-title"), line = phone.querySelectorAll(".coach-line");
  assert.equal(title.length, 1); assert.equal(line.length, 1);
  assert.equal(title[0].tagName, "H1"); assert.equal(line[0].tagName, "P");
  assert.equal(title[0].textContent, "Coach.");
  assert.equal(line[0].textContent, "Talk through today’s plan.");
  assert(!title[0].hidden && !line[0].hidden && !title[0].closest("[hidden]"), "both are on the live screen");
  assert.equal(title[0].parentElement, view.body, "in the scrolling body, as the pack draws them");
  /* and the pinned stylesheet gives each its face: serif for the name, sans for the line */
  const css = design.readApproved().map((a) => a.styles).join("\n");
  const last = (sel) => [...css.matchAll(new RegExp("^\\" + sel + " \\{[^}]*font-family: var\\(--(serif|sans)\\)", "gm"))].pop();
  assert.equal(last(".coach-title")[1], "serif");
  assert.equal(last(".coach-line")[1], "sans");
  /* the gate's other coach anchors are there too */
  assert.equal(phone.querySelectorAll("#prompts > .prompt").length, 3);
  assert.equal(phone.querySelectorAll("#prompts > .prompt .icon-square").length, 3);
  assert.equal(view.stack.querySelectorAll(".mic-button").length, 1, "the mic is the stack's primary");
  assert.deepEqual([...phone.children].map((c) => c.classList[0]), ["body", "stack"], "the chassis: body then stack");
});

test("C6-3 every coach state the pack draws is registered, in the pack's order", () => {
  const index = JSON.parse(read("quality/baseline/states/INDEX.json"));
  const want = index.states.filter((s) => s.screen === "coach").map((s) => s.id);
  assert.equal(want.length, 65);
  assert.deepEqual(COACH_STATES.map((s) => s.id), want);
  const { win } = page();
  const registry = installCoachStates(win, () => null);
  assert.equal(win.earnedStates, registry);
  const listed = registry.list();
  assert.deepEqual(listed.map((s) => s.id), want);
  for (const entry of listed) {
    assert.equal(entry.screen, "coach");
    assert(entry.title && entry.status && entry.component, entry.id + " carries the pack's metadata");
  }
  /* a registry another screen installed first is joined, never replaced */
  const other = page().win;
  const seen = [];
  other.earnedStates = { register: (id) => seen.push(id), list: () => seen.map((id) => ({ id })) };
  const joined = installCoachStates(other, () => null);
  assert.equal(joined, other.earnedStates);
  assert.deepEqual(seen, want);
});

test("C6-4 each coach state, on this view, shows exactly the text the pack's record holds", () => {
  const problems = [];
  for (const state of COACH_STATES) {
    const { doc, phone } = page("http://127.0.0.1:4178/?screen=coach&state=" + state.id);
    const view = openCoach({ doc, phone });   /* the URL's state, read once, as the pack reads it */
    assert.equal(doc.documentElement.getAttribute("data-state"), state.id, state.id + " applied");
    const record = JSON.parse(read("quality/baseline/states/" + state.id + "-ink.json"));
    const got = visibleText(phone, view.frame());
    if (got !== record.text) problems.push(state.id + "\n  want: " + record.text + "\n  got:  " + got);
  }
  assert.equal(problems.length, 0, problems.join("\n"));
});

test("C6-5 the live screen: every ask meets the pack's C-61 refusal; nothing listens or sends", () => {
  const { win, doc, phone } = page();
  let mic = 0, net = 0;
  win.navigator.mediaDevices = { getUserMedia: () => { mic += 1; return Promise.reject(new Error("no")); } };
  win.fetch = () => { net += 1; return Promise.reject(new Error("no")); };
  const timers = manualTimers();
  const view = openCoach({ doc, phone, timers, state: null });
  const frame = view.frame();
  assert.equal(frame.getAttribute("data-state"), null, "the board as drawn before anything is said (C-03)");
  assert.equal(phone.querySelector("#coach-state").hidden, true, "idle shows no pill");
  const asks = [() => phone.querySelector("#prompts .prompt").click(), () => phone.querySelector("#mic").click(),
    () => { view.textMode(true); phone.querySelector("#coach-text button").click(); }];
  for (const ask of asks) {
    ask();
    const card = phone.querySelector("#coach-answer");
    assert.equal(card.hidden, false);
    assert(card.classList.contains("is-refusal"));
    const said = phone.querySelector("#coach-answer-text");
    assert.equal(said.firstChild.textContent, COACH_COPY.noLiveCoach);
    assert.equal(said.querySelector(".tail").textContent, COACH_COPY.nothingChanged, "the tail, spaced by the pack's ::before");
    assert.equal(card.querySelector(".from").hidden, true, "a refusal carries no provenance line");
    assert.equal(phone.querySelector("#prompts").hidden, true, "the answer replaces the prompts");
    assert.equal(phone.querySelector("#coach-state").hidden, true, "the pill goes dark once a card is on screen");
    assert.equal(frame.getAttribute("data-state"), "answering", "the orb answers warm");
    timers.run();
    assert.equal(frame.getAttribute("data-state"), "idle", "then settles");
    assert.equal(phone.querySelector("#mic-label").textContent, COACH_COPY.speak);
  }
  assert.equal(mic, 0, "the microphone was never asked for");
  assert.equal(net, 0, "nothing was fetched");
  const source = fs.readFileSync(path.join(design.SOURCE, "coach-app.mjs"), "utf8");
  for (const word of ["getUserMedia", "fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon", "indexedDB", "localStorage"]) {
    assert(!source.includes(word), "coach-app.mjs reaches for " + word);
  }
});

test("C6-6 text mode and tap mode are the drawn C-06 and C-07, both ways", () => {
  const { doc, phone } = page();
  const view = openCoach({ doc, phone, state: null });
  const frame = view.frame();
  phone.querySelector("#coach-text-mode").click();
  assert.equal(frame.getAttribute("data-mode"), "text");
  assert.equal(phone.querySelector("#coach-text").hidden, false);
  const back = phone.querySelector(".coach-back-links .link");
  assert.equal(back.textContent, COACH_COPY.voice);
  assert.equal(back.parentElement.previousElementSibling, phone.querySelector("#coach-text"), "under the input, in the stack");
  back.click();
  assert.equal(frame.getAttribute("data-mode"), null);
  assert.equal(phone.querySelector("#coach-text").hidden, true);
  assert.equal(phone.querySelector(".coach-back-links"), null);
  phone.querySelector("#coach-tap").click();
  assert.equal(frame.getAttribute("data-mode"), "tap");
  assert.equal(phone.querySelector(".coach-line").nextElementSibling.textContent, COACH_COPY.tapNote);
  assert.equal(phone.querySelector("#coach-tap").textContent, COACH_COPY.voice);
  phone.querySelector("#coach-tap").click();
  assert.equal(frame.getAttribute("data-mode"), null);
  assert.equal(phone.querySelectorAll(".note-block").length, 0);
  assert.equal(phone.querySelector("#coach-tap").textContent, COACH_COPY.tapInstead);
});

test("C6-7 the level ring follows a source when handed one, holds still with none, never pulses", () => {
  assert.equal(levelFromSamples(new Uint8Array(512).fill(128)), 0, "silence is no level");
  assert.equal(levelFromSamples(Uint8Array.from({ length: 512 }, (_, i) => (i % 2 ? 255 : 0))), 1, "a loud signal is full");
  assert.equal(smoothLevel(0, 1), 0.5, "quick up");
  assert(Math.abs(smoothLevel(1, 0) - 0.88) < 1e-9, "slow down");
  let feed = null, stopped = 0;
  const { doc, phone } = page();
  const view = openCoach({ doc, phone, state: null, level: { start: (fn) => { feed = fn; }, stop: () => { stopped += 1; } } });
  const frame = view.frame();
  view.listen();
  assert.equal(frame.getAttribute("data-state"), "listening");
  assert.equal(frame.getAttribute("data-level"), "live");
  assert.equal(phone.querySelector("#mic-label").textContent, COACH_COPY.stop);
  assert.equal(phone.querySelector(".listening .go").textContent, COACH_COPY.goAhead);
  feed(1);
  assert.equal(frame.style.getPropertyValue("--level"), "0.500");
  view.stopLevel();
  assert.equal(stopped, 1);
  assert.equal(frame.getAttribute("data-level"), null);
  /* with no source: the listening look, and the ring at its listening weight */
  const bare = page();
  const still = openCoach({ doc: bare.doc, phone: bare.phone, state: null });
  still.listen();
  assert.equal(still.frame().getAttribute("data-level"), null);
  assert.equal(still.frame().style.getPropertyValue("--level"), "");
  /* nothing on this screen animates: no loop in the view, no animation in the pinned coach rules */
  const source = fs.readFileSync(path.join(design.SOURCE, "coach-app.mjs"), "utf8");
  for (const word of ["setInterval", "requestAnimationFrame", ".animate("]) assert(!source.includes(word), word);
  const css = design.readApproved().map((a) => a.styles).join("\n");
  for (const rule of css.match(/[^{}]*(?:\.orb|\.mic-button|\.orb-level|\.orb-ring)[^{}]*\{[^}]*\}/g) || []) {
    assert(!/animation\s*:/.test(rule), "an orb or mic rule animates: " + rule.slice(0, 80));
  }
});

test("C6-8 leaving the screen takes back every attribute it put on the frame", () => {
  const { doc, phone } = page("http://127.0.0.1:4178/?screen=coach&state=C-08");
  const view = openCoach({ doc, phone });
  const frame = view.frame();
  assert.equal(frame.getAttribute("data-mic"), "off");
  assert.equal(doc.documentElement.getAttribute("data-state"), "C-08");
  view.close();
  for (const name of ["data-state", "data-mode", "data-mic", "data-level"]) assert.equal(frame.getAttribute(name), null, name);
  assert.equal(doc.documentElement.getAttribute("data-state"), null);
  /* the URL's state is read once per page: a second visit is the live screen */
  const again = openCoach({ doc, phone });
  assert.equal(again.frame().getAttribute("data-mic"), null);
  /* and a panel state stows the board and gives it back */
  const panel = openCoach({ doc, phone, state: "C-63" });
  assert.equal(panel.stack.hidden, true);
  assert(panel.frame().classList.contains("has-panel"));
  panel.close();
  assert(!panel.frame().classList.contains("has-panel"));
  assert.equal(panel.stack.hidden, false);
});

test("C6-9 the coach binding holds every coach word to the pinned pack", () => {
  const approved = design.readApproved();
  const report = design.assertCoachBinding(approved, design.templateHtml());
  assert(report.copy >= 150, "the whole coach vocabulary is harvested: " + report.copy);
  assert(report.classes >= 20);
  assert.deepEqual(design.assertDesignBinding(approved, design.templateHtml(), design.appSource()).coach, report);
  const room = fs.mkdtempSync(path.join(os.tmpdir(), "cui6-coach-binding-"));
  try {
    for (const file of [...design.COPY_SOURCES, ...design.COACH_EXTRA_REFERENCES].map((p) => p.file)) {
      fs.mkdirSync(path.dirname(path.join(room, file)), { recursive: true });
      fs.copyFileSync(path.join(design.ROOT, file), path.join(room, file));
    }
    const rel = "rebuild/m3/w7-preview/today/coach-app.mjs";
    fs.mkdirSync(path.dirname(path.join(room, rel)), { recursive: true });
    const source = fs.readFileSync(path.join(design.ROOT, rel), "utf8");
    fs.writeFileSync(path.join(room, rel), source.replace("'There is no live coach in this build.'", "'A phrase nobody approved.'"));
    assert.throws(() => design.assertCoachBinding(approved, design.templateHtml(), room), /COACH-BINDING FAIL/);
    fs.writeFileSync(path.join(room, rel), source.replace("'Go ahead.'", "'Go ahead " + String.fromCharCode(0x2014) + " now.'"));
    assert.throws(() => design.assertCoachBinding(approved, design.templateHtml(), room), /COACH-BINDING FAIL/);
    fs.writeFileSync(path.join(room, rel), source.replace('"coach-marker",', '"coach-invented",'));
    assert.throws(() => design.assertCoachBinding(approved, design.templateHtml(), room), /COACH-BINDING FAIL/);
  } finally {
    fs.rmSync(room, { recursive: true, force: true });
  }
  assert.throws(() => design.assertCoachBinding(approved, design.templateHtml().replace('<h1 class="coach-title">', '<h1 class="panel-title">')),
    /COACH-BINDING FAIL/, "the serif identity cannot be renamed away");
});

test("C6-10 today-app routes Coach to this view and carries the stub no more", () => {
  const source = fs.readFileSync(path.join(design.SOURCE, "today-app.cjs"), "utf8");
  assert.match(source, /if \(next === "coach"\) return renderCoach\(focus\);/);
  assert(!source.includes('renderStub("t-coach"'), "the stub route is gone");
  assert(!source.includes("There is no conversation here"), "the stub sentence moved to the drawn state C-02");
  assert.match(source, /require\("\.\/coach-app\.mjs"\)/);
  const scene = fs.readFileSync(path.join(design.SOURCE, "scene.mjs"), "utf8");
  assert.match(scene, /host\.querySelector\("\.coach-title"\)\) return "coach";/);
});

/* C6-11 (review l1 F3) THE PAGE ORDER, EXECUTED. In the shipped page scene.mjs installs
   synchronously at the end of app.js and boot() awaits before mountToday, so the scene
   frame already wraps #phone when Today mounts; the coach writes its state attributes on
   phone.closest(".screen"). This cell runs that order on the real modules (the scene
   module itself with its pinned asset shape, then today-app over the shipped template),
   asserts the order at each step, routes to the coach through today-app, and asserts the
   attributes land on .scene-frame.screen-coach, never on the host, and leave with it. */
test("C6-11 scene first, then Today, then Coach: the coach's attributes land on .scene-frame.screen-coach", async () => {
  const { win, doc, phone } = page();
  win.__earnedSceneAssets = { mist: "data:image/png;base64,AA", grain: "data:image/png;base64,AA",
    plateInk: "data:image/jpeg;base64,AA", plateDawn: "data:image/jpeg;base64,AA" };
  win.matchMedia = () => ({ matches: true });   /* reduced motion: one still, nothing scheduled */
  win.HTMLCanvasElement.prototype.getContext = () => ({});
  const PreviousImage = globalThis.Image;
  globalThis.Image = class { set src(value) { this.url = value; } };
  const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
  try {
    const sceneSource = fs.readFileSync(path.join(design.SOURCE, "scene.mjs"), "utf8") + "\nexport { installScene };\n";
    const { installScene } = await import("data:text/javascript;base64," + Buffer.from(sceneSource).toString("base64"));
    const { default: TodayApp } = await import("../today-app.cjs");
    const { default: TodayModel } = await import("../today-model.cjs");

    /* 1. the scene: it wraps the live host before anything mounts */
    assert.equal(phone.closest(".screen"), null, "before the scene there is no screen frame");
    assert(installScene(win, doc), "the scene installs");
    const frames = doc.querySelectorAll(".scene-frame");
    assert.equal(frames.length, 1);
    const frame = frames[0];
    assert.equal(phone.parentElement, frame, "the live host is the frame's .ui");
    assert.equal(phone.closest(".screen"), frame, "order: the frame wraps #phone before Today mounts");

    /* 2. Today mounts into the wrapped host */
    const api = TodayApp.mountToday(doc, TodayModel.createTodayModel({ today: TodayModel.SYNTHETIC_DAY }), {});
    await tick();
    assert(frame.classList.contains("screen-today"), "Today paints as the today screen");
    assert.equal(phone.closest(".screen"), frame, "the mount keeps the host inside the frame");

    /* 3. Coach, through today-app's own route */
    api.render("coach");
    await tick();
    assert.equal(doc.querySelectorAll(".scene-frame.screen-coach").length, 1, "the frame turned to the coach screen");
    assert(!frame.classList.contains("screen-today"), "and left the today screen");
    assert.equal(phone.querySelectorAll(".coach-title").length, 1, "the coach screen is on the host");
    phone.querySelector("#prompts .prompt").click();
    assert.equal(doc.querySelector('.scene-frame.screen-coach[data-state="answering"]'), frame, "data-state on the frame");
    phone.querySelector("#coach-text-mode").click();
    assert.equal(doc.querySelector('.scene-frame.screen-coach[data-mode="text"]'), frame, "data-mode on the frame");
    for (const name of ["data-state", "data-mode", "data-mic", "data-level"]) {
      assert.equal(phone.getAttribute(name), null, "the host carries no " + name);
    }

    /* 4. leaving takes them back, and the frame turns back to today */
    api.render("today");
    await tick();
    assert(frame.classList.contains("screen-today") && !frame.classList.contains("screen-coach"));
    for (const name of ["data-state", "data-mode", "data-mic", "data-level"]) {
      assert.equal(frame.getAttribute(name), null, "the frame keeps no " + name);
    }
    api.dispose();
  } finally {
    globalThis.Image = PreviousImage;
  }
});
