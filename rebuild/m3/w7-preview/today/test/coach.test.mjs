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
     C6-10 today-app routes Coach to this view and no longer carries the stub;
     C6-12 the live route says the board's words: C-03 at rest, C-61 on every ask, and
           each board line the pack keeps off its screen is a recorded departure. */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JSDOM } from "jsdom";
import design from "../design.cjs";
import { openCoach, installCoachStates, COACH_STATES, COACH_COPY, COACH_LIVE_COPY, levelFromSamples, smoothLevel }
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
  assert.equal(line[0].textContent, "Talk through today\u2019s plan.");
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

/* C6-12 (look round 3; DECISIONS:820 (2) and (3)) THE LIVE ROUTE SAYS THE BOARD'S WORDS.
   At rest the live screen (no review state in the URL) shows exactly the pack's reference
   state C-03, word for word, with the example pill. Where the boards draw more than the
   pack does (the Idle pill, the wordmark and the two sub lines), each is the pack's own
   element kept off its screen, stays off the live screen, and is a departure the pack's
   comparison page records; the template's note says so and cites it. Every ask (a
   prompt, the mic, Send) answers with C-61's words and nothing else, and no stub (C-02)
   or not wired text reaches the live route in any mode. */
test("C6-12 the live route says the board's words: C-03 at rest, C-61 on every ask, board-only lines are recorded departures", () => {
  const record = (id) => JSON.parse(read("quality/baseline/states/" + id + "-ink.json")).text;
  const timers = manualTimers();
  const { doc, phone } = page("http://127.0.0.1:4178/?screen=coach");
  const view = openCoach({ doc, phone, timers });   /* the live route: the URL names no state */
  const frame = view.frame();
  assert.equal(doc.documentElement.getAttribute("data-state"), null, "no review state is applied on the live route");
  const rest = visibleText(phone, frame);
  assert.equal(rest, record("C-03"), "at rest the live screen is the pack's reference state C-03");
  assert.equal(phone.querySelector('.header .pill[title="Example numbers, not your data"]').textContent, "example");

  /* the board-only lines: the pack's own elements, kept off the pack's screen and the live one, each recorded */
  const pack = new JSDOM(read("app/app.html")).window.document;
  const compare = read("app/compare.html");
  const css = design.readApproved().map((a) => a.styles).join("\n");
  const twoLines = /Coach header, two lines \(your ruling, 2026-09-17\)[^<]*The scope line and the "what you can ask" line are gone/;
  const boardOnly = [
    ["#coach-state-text", pack.querySelector("#coach-state").hasAttribute("hidden"),
      /the Coach state pill appears only while listening or answering, never "Idle"/],
    [".wordmark", /\.screen-coach \.wordmark \{ display: none; \}/.test(css),
      /the wordmark stays on Today and inner screens carry the back arrow and their own title/],
    [".coach-sub", pack.querySelector("#screen-coach .coach-sub").hasAttribute("hidden"), twoLines],
    [".coach-sub2", pack.querySelector("#screen-coach .coach-sub2").hasAttribute("hidden"), twoLines],
  ];
  for (const [selector, packHides, ruling] of boardOnly) {
    const words = norm(pack.querySelector("#screen-coach " + selector).textContent);
    assert(words, selector + " carries words in the pack");
    assert(packHides, "the pack keeps " + selector + " off its coach screen at rest");
    assert(!(" " + rest + " ").includes(" " + words + " "), selector + " is not on the live screen: " + words);
    assert.match(compare, ruling, selector + " is a departure the pack's comparison page records");
  }
  const template = design.templateHtml();
  const at = template.indexOf('<template id="t-coach">');
  const note = norm(template.slice(template.lastIndexOf("<!--", at), at));
  assert(!/the boards dropped/.test(note), "the template note does not say the boards dropped the sub lines (they draw them)");
  assert.match(note, /app\/compare\.html records the owner ruling of 2026-09-17/, "the template note cites the recorded ruling");

  /* the stub's own words, taken from the drawn C-02 on a review page, never typed here */
  const drawn = page("http://127.0.0.1:4178/?screen=coach&state=C-02");
  openCoach({ doc: drawn.doc, phone: drawn.phone });
  const stubWords = [...drawn.phone.querySelectorAll(".panel .note-block, .panel .panel-lead")].map((node) => norm(node.textContent));
  assert.equal(stubWords.length, 2, "the drawn stub carries its lead and its note");
  const clean = (when) => {
    const text = visibleText(phone, frame);
    assert(!/not wired/i.test(text), when + ": no not wired text on the live route");
    for (const words of stubWords) assert(!text.includes(words), when + ": the stub C-02 does not show");
    assert.equal(phone.querySelector(".panel"), null, when + ": no panel on the live route");
    return text;
  };
  clean("at rest");

  /* every ask: C-61's words, and nothing else on the card */
  const card = phone.querySelector("#coach-answer");
  const asks = [["a prompt", () => phone.querySelector("#prompts .prompt").click()],
    ["the mic", () => phone.querySelector("#mic").click()],
    ["Send", () => { phone.querySelector("#coach-text-mode").click(); phone.querySelector("#coach-text button").click(); }]];
  for (const [how, ask] of asks) {
    ask();
    assert.equal(visibleText({ children: [card] }, frame), COACH_COPY.noLiveCoach + " " + COACH_COPY.nothingChanged, how + " is answered with C-61's words only");
    clean(how);
    timers.run();
    clean(how + ", settled");
  }
  phone.querySelector(".coach-back-links .link").click();
  clean("back to voice");
  phone.querySelector("#coach-tap").click();
  clean("tap mode");
  view.close();
});

/* ==== COACH V1 (owner ruling 2026-10-12, "No-AI coach first"; brief S19-LIVE-BRIEF.md, Coach v1) ====
   The Coach screen answers from this device's records. The cells below run the real page (today-app.cjs over the
   shipped template and a Today model) with no store opened, so the Today model's own reads are the tools' world and
   the gym card and the check-in are absent, as on a device whose lanes did not open. */
const tickUntil = async (check, label) => {
  for (let at = 0; at < 200; at += 1) { const got = check(); if (got) return got; await new Promise((r) => setTimeout(r, 5)); }
  throw new Error("timed out waiting for " + label);
};
async function liveCoach() {
  const { win, doc, phone } = page();
  const { default: TodayApp } = await import("../today-app.cjs");
  const { default: TodayModel } = await import("../today-model.cjs");
  const model = TodayModel.createTodayModel({ today: TodayModel.SYNTHETIC_DAY });
  const api = TodayApp.mountToday(doc, model, {});
  await new Promise((r) => setTimeout(r, 0));
  return { win, doc, phone, api, model };
}
async function tap(phone, intent) {
  const before = phone.querySelector("#coach-answer .said") ? phone.querySelector("#coach-answer .said").textContent : null;
  phone.querySelector('#prompts .prompt[data-intent="' + intent + '"]').click();
  const want = COACH_COPY.youAsked;
  await tickUntil(() => {
    const said = phone.querySelector("#coach-answer .said");
    return said && said.textContent.startsWith(want) && (said.textContent !== before || intent === "today_plan") && !phone.querySelector("#coach-answer").hidden;
  }, intent);
  await new Promise((r) => setTimeout(r, 5));
  return phone.querySelector("#coach-answer");
}

test("CV1-1 the Coach entry is a compact row in Today's feed above Start, and it opens the live coach's questions", async () => {
  const { COACH_QUESTIONS } = await import("../coach-app.mjs");
  const Intents = (await import("../../../../coach/coach-intents.cjs")).default;
  const { doc, phone, api } = await liveCoach();
  const entry = doc.querySelector('[data-go="coach"]');
  assert(entry, "Today carries a route to the Coach screen");
  /* Polish batch (shot 02: the link sat below Start, off the first screen): one line, "Ask Coach", in the food card's
     row look (tcard nav, dot, chevron), inside the feed, so it comes before Start and nothing sits under Start. */
  assert.equal(norm(entry.textContent), "Ask Coach", "one plain line");
  assert.equal(entry.id, "card-coach");
  assert(entry.classList.contains("tcard") && entry.classList.contains("nav"), "a row of the feed, in the food card's look");
  assert(entry.querySelector(".tdot") && entry.querySelector(".chev"), "with the feed's dot and a chevron");
  assert.equal(entry.parentElement && entry.parentElement.classList.contains("timeline"), true, "inside the feed");
  const start = doc.getElementById("start");
  assert(start, "Start is on Today");
  /* P9 (PM, the Today repeats; call 1; supersession pending): was "the entry comes before Start" and "nothing of the
     coach sits in Start's stack", from when Start was pinned in a stack under the feed. Start is now the workout card's
     own primary, at the head of the feed, so the entry comes after it in the same feed, nothing is pinned under the
     day, and nothing of the coach sits in the card that holds Start. */
  assert.equal(start.closest("#card-train") !== null, true, "Start is the workout card's own");
  assert.equal(Boolean(start.compareDocumentPosition(entry) & 4), true, "the entry follows Start in the feed");
  assert.equal(phone.querySelector(".stack"), null, "nothing is pinned under the day");
  assert.equal(start.closest("#card-train").querySelector('[data-go="coach"]'), null, "nothing of the coach sits in Start's card");
  entry.click();
  await new Promise((r) => setTimeout(r, 0));
  const chips = [...phone.querySelectorAll("#prompts .prompt")];
  assert.deepEqual(chips.map((c) => c.getAttribute("data-intent")), COACH_QUESTIONS.map((q) => q.intent), "the questions, in order");
  assert.deepEqual(chips.map((c) => norm(c.textContent)), COACH_QUESTIONS.map((q) => q.label), "each with its words");
  /* every page intent, machine_seat included since the seat read (PM ruling option A): the gym card's machine settings
     live in its own sealed lane, and the page reads them through that lane's one declared read, never a second open */
  assert.deepEqual(COACH_QUESTIONS.map((q) => q.intent), [...Intents.PAGE_INTENT_IDS.filter((id) => id !== "machine_seat"), "machine_seat"],
    "every question is one of the coach's page intents, the seat question last");
  assert.equal(norm(chips[chips.length - 1].textContent), "Where's my seat set?");
  /* Polish batch (shot 04: six calendars): each is the pack's own prompt button with its chevron and no icon. */
  for (const chip of chips) {
    assert(chip.classList.contains("prompt") && chip.querySelector(".chev"), "each is the pack's own prompt button");
    assert.equal(chip.querySelector(".icon-square, svg.icon"), null, "with no icon");
  }
  assert.equal(phone.querySelector('.header .pill[title]').hidden, true, "the example pill is off: these answers are the device's own");
  api.dispose();
});

test("CV1-2 a tapped question is answered from this device's records, and every number in it is a tool result of that turn", async () => {
  const Intents = (await import("../../../../coach/coach-intents.cjs")).default;
  const ReadTools = (await import("../../../../coach/read-tools.cjs")).default;
  const Wave1 = (await import("../../../../coach/wave1-tools.cjs")).default;
  const { doc, phone, api, model } = await liveCoach();
  doc.querySelector('[data-go="coach"]').click();
  await new Promise((r) => setTimeout(r, 0));
  /* polish 5 (item 9): jsdom lays nothing out, so the scroll is recorded where the page asks for it */
  const scrolled = [];
  doc.defaultView.HTMLElement.prototype.scrollIntoView = function (options) { scrolled.push([this.id, options && options.block]); };
  for (const intent of ["today_plan", "weight_trend"]) {
    scrolled.length = 0;
    const card = await tap(phone, intent);
    assert.deepEqual(scrolled, [["coach-answer", "nearest"]], intent + ": the answer is brought into view");
    assert.equal(card.classList.contains("is-refusal"), false, intent + " is answered");
    const shown = phone.querySelector("#coach-answer-text").textContent;
    assert(/\d/.test(shown), intent + " carries the device's own figures: " + shown);
    assert.equal(card.querySelector(".from").textContent, COACH_LIVE_COPY.fromYourData, "and says where they came from");
    /* polish 5 (items 9, 10): in plain words, and the answer takes focus (so it is the next thing read) */
    assert.equal(card.querySelector(".from").textContent, "From your data on this phone.");
    assert.equal(doc.activeElement, card, intent + ": the answer has focus");
    assert.equal(card.tabIndex, -1, "focusable by script only");
    /* the same question asked of the same tools over the same model, outside the page: the same sentence, and a
       clean traceability verdict for the turn that produced it */
    const world = { today: model };
    /* the page's own composition, the read tools (since the polish batch today's plan also reads today_session) */
    const tools = Wave1.createWave1Tools({ world, coach: ReadTools.createReadTools(world) });
    const again = await Intents.ask(tools, intent, { turnId: "cv1-2-" + intent });
    assert.equal(again.shipped, true, intent + " ships");
    assert.deepEqual(again.untraceable, [], intent + ": every number is a tool result of the turn");
    assert.equal(shown, again.answer, intent + ": the page shows exactly the coach's sentence");
  }
  api.dispose();
});

test("CV1-3 a question no lane on this device can answer says why in plain words, as a refusal; why this weight needs no lane", async () => {
  const Intents = (await import("../../../../coach/coach-intents.cjs")).default;
  const { doc, phone, api, model } = await liveCoach();
  doc.querySelector('[data-go="coach"]').click();
  await new Promise((r) => setTimeout(r, 0));
  /* Polish batch: a refusal is the question's own plain sentence, never a tool's or the engine's words. */
  for (const intent of ["last_time", "my_checkin"]) {
    const card = await tap(phone, intent);
    assert.equal(card.classList.contains("is-refusal"), true, intent + " is a refusal with no lane open");
    assert.equal(card.querySelector(".from").hidden, true, "a refusal carries no provenance line");
    assert.equal(/\d/.test(phone.querySelector("#coach-answer-text").textContent), false, intent + " invents no figure");
    assert.equal(phone.querySelector("#coach-answer-text").textContent, Intents.PLAIN_REFUSALS[intent], intent + " in plain words");
  }
  /* "Why this weight?" reads today's session from the Today model: one plain line per exercise, with the source line. */
  const card = await tap(phone, "why_weight");
  assert.equal(card.classList.contains("is-refusal"), false, "why this weight is answered");
  assert.equal(card.querySelector(".from").textContent, COACH_LIVE_COPY.fromYourData);
  const lines = phone.querySelector("#coach-answer-text").textContent.split("\n");
  /* batch 2 (item 2): lifts that share a reason share a line, so every exercise is named once, in order */
  assert.deepEqual(lines.flatMap((line) => line.split(":")[0].split(", ")), model.sessionPlan().exercises.map((ex) => ex.name), "every exercise, named once");
  assert.equal(new Set(lines.map((line) => line.slice(line.indexOf(":")))).size, lines.length, "no two lines give the same reason");
  api.dispose();
});

test("CV1-4 an answer carrying a number no tool returned is discarded, never shown", async () => {
  const Intents = (await import("../../../../coach/coach-intents.cjs")).default;
  const Tools = (await import("../../../../coach/tools.cjs")).default;
  const Wave1 = (await import("../../../../coach/wave1-tools.cjs")).default;
  const { default: TodayModel } = await import("../today-model.cjs");
  const model = TodayModel.createTodayModel({ today: TodayModel.SYNTHETIC_DAY });
  const world = { today: model };
  const real = Wave1.createWave1Tools({ world, coach: Tools.createCoachTools(world) });
  /* the plant: a turn that answers with the real values but forgets what it read, so nothing it says is licensed */
  const forgetful = { openTurn(turn_id) {
    const turn = real.openTurn(turn_id);
    return { turn_id, results: [], call: turn.call, untraceable: (answer) => Tools.untraceable(answer, [], turn_id) };
  } };
  const got = await Intents.ask(forgetful, "weight_trend", { turnId: "cv1-4" });
  assert.equal(got.shipped, false, "the draft is not shipped");
  assert(got.untraceable.length > 0, "its numbers are untraceable in that turn");
  assert(/\d/.test(got.draft), "the draft did carry figures");
  assert.equal(/\d/.test(got.answer), false, "the answer said instead carries none");
  assert.equal(got.answered, false);
  /* and on the screen it is a refusal */
  const { doc, phone } = page();
  const view = openCoach({ doc, phone, state: null, coach: { ask: async () => ({ answer: got.answer, refused: !got.answered }) } });
  const card = await tap(phone, "weight_trend");
  assert.equal(card.classList.contains("is-refusal"), true);
  assert.equal(phone.querySelector("#coach-answer-text").textContent, got.answer);
  view.close();
});

test("CV1-5 tap to ask only: the text mode, the tap link and the mic are hidden; nothing listens and nothing is sent", async () => {
  const { win, doc, phone, api } = await liveCoach();
  let mic = 0, net = 0;
  win.navigator.mediaDevices = { getUserMedia: () => { mic += 1; return Promise.reject(new Error("no")); } };
  win.fetch = () => { net += 1; return Promise.reject(new Error("no")); };
  const { COACH_LIVE_COPY } = await import("../coach-app.mjs");
  doc.querySelector('[data-go="coach"]').click();
  await new Promise((r) => setTimeout(r, 0));
  /* Polish batch (shot 04): until a model coach exists the stack under the questions is hidden, so the six questions and
     the answer have the screen; "Use text mode", "I'll tap instead" and "Tap to speak" are not drawn. */
  const stack = phone.querySelector(".stack");
  assert.equal(stack.hidden, true, "the stack is hidden on the live screen");
  for (const id of ["#mic", "#mic-label", "#coach-text-mode", "#coach-tap", "#coach-text"]) {
    assert.equal(stack.contains(phone.querySelector(id)), true, id + " is inside the hidden stack");
  }
  assert.equal(phone.querySelector("#prompts").hidden, false, "the questions are on the screen");
  /* and were they reached anyway, they still only say that those come later */
  for (const ask of [() => phone.querySelector("#mic").click(),
    () => { phone.querySelector("#coach-text-mode").click(); phone.querySelector("#coach-text button").click(); }]) {
    ask();
    const said = phone.querySelector("#coach-answer-text");
    assert.equal(said.firstChild.textContent, COACH_LIVE_COPY.typedLater);
    assert.equal(said.querySelector(".tail").textContent, COACH_COPY.nothingChanged);
    assert.equal(phone.querySelector("#prompts").hidden, false, "the questions stay to hand");
  }
  assert.equal(mic, 0, "the microphone was never asked for");
  assert.equal(net, 0, "nothing was fetched");
  for (const file of ["page-coach.cjs", "read-tools.cjs", "tool-kernel.cjs", "coach-intents.cjs", "wave1-tools.cjs", "tools.cjs", "sha256.cjs"]) {
    const src = fs.readFileSync(path.join(design.ROOT, "rebuild/coach", file), "utf8");
    for (const word of ["fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon", "getUserMedia", "api.openai.com"]) {
      assert(!src.includes(word), file + " reaches for " + word);
    }
  }
  api.dispose();
});

test("CV1-6 a review state still puts the pack's own board on the screen, never the live coach", async () => {
  const { win, phone, api } = await liveCoach();
  assert(win.earnedStates && typeof win.earnedStates.apply === "function", "the review hook is installed");
  assert.equal(win.earnedStates.apply("C-05"), true);
  const prompts = [...phone.querySelectorAll("#prompts .prompt")];
  assert.equal(prompts.some((p) => p.hasAttribute("data-intent")), false, "no live question on a review state");
  assert.equal(phone.querySelector('.header .pill[title]').hidden, false, "the example pill stays on the pack's board");
  api.dispose();
});

test("CV1-7 the live words are exactly the approved list, and the binding refuses one added without approval", () => {
  assert.deepEqual(design.assertCoachLiveBinding(), { copy: design.COACH_LIVE_APPROVED.length });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "coach-live-"));
  const target = path.join(dir, "rebuild/m3/w7-preview/today");
  fs.mkdirSync(target, { recursive: true });
  const source = fs.readFileSync(path.join(design.SOURCE, "coach-app.mjs"), "utf8");
  fs.writeFileSync(path.join(target, "coach-app.mjs"), source.replace("  typedLater: '", "  extra: 'Ask me anything.',\n  typedLater: '"));
  assert.throws(() => design.assertCoachLiveBinding(dir), /COACH-LIVE-BINDING FAIL/, "an unapproved word refuses");
  fs.writeFileSync(path.join(target, "coach-app.mjs"), source.replace("  whyWeight: 'Why this weight?',\n", ""));
  assert.throws(() => design.assertCoachLiveBinding(dir), /COACH-LIVE-BINDING FAIL/, "an approved word dropped refuses");
  fs.rmSync(dir, { recursive: true, force: true });
});

/* CV1-8 (Coach v1 piece 2, PM ruling option A). On the first day of a training week Today shows the review of the week
   just ended, in the proposal card's look, the engine's own reason behind Why?; on any other day, or with no workout
   record to read, Today is unchanged. The workout lane here is the gym.test.mjs fake (summary only) with the two reads
   the review uses. SYNTHETIC_DAY (2030-02-04) is a Monday. */
async function weekToday(day, lane) {
  const { doc, phone } = page();
  const { default: TodayApp } = await import("../today-app.cjs");
  const { default: TodayModel } = await import("../today-model.cjs");
  const model = TodayModel.createTodayModel({ today: day });
  const api = TodayApp.mountToday(doc, model, { workout: { summary: () => ({ phase: "ready", sets: 0, code: null, copy: null, unfinished: null }), ...lane } });
  return { doc, phone, api, model };
}
const WEEK_LANE = Object.freeze({
  gym: { read: async () => ({ phase: "ready" }), lastRead: () => ({ phase: "ready" }), weekSessions: async () => ({ ok: true, done: 2, dates: [] }) },
  nativeLoad: { weekLifts: async () => ({ ok: true, lifts: [
    { lift: "demo-press", name: "Chest press", status: "offer", kind: "earn", date: "2030-01-30", loads: [105, 105], current: [100, 100],
      reason: "Chest press: every set at 100 lb reached the top of the range." },
    { lift: "demo-row", name: "Row", status: "refused", code: "NATIVE_LOAD_PROVISIONAL" }] }) },
});
test("CV1-8 the first day of a week shows last week's review on Today, collapsed, its reasons behind Why?, and no other day does", async () => {
  const Intents = (await import("../../../../coach/coach-intents.cjs")).default;
  const { default: TodayModel } = await import("../today-model.cjs");
  const { doc, api, model } = await weekToday(TodayModel.SYNTHETIC_DAY, WEEK_LANE);
  /* POLISH 5 (item 5): the card's place is held on the first paint, by a quiet placeholder of the collapsed card's
     shape (its heading, two lines, the toggle's row), and the review lands in that same card, so nothing below moves */
  const held = doc.querySelector('[data-slot="week-review"]');
  assert(held, "the first paint already holds the card's place");
  assert.equal(held.getAttribute("aria-busy"), "true");
  assert.equal(norm(held.querySelector(".head > .kind").textContent), "Last week");
  assert.equal(held.querySelector('[data-slot="week-review-pending"]').getAttribute("aria-hidden"), "true");
  assert.equal(held.querySelector('[data-slot="week-review-room"]').getAttribute("aria-hidden"), "true");
  assert.equal(held.querySelector("button"), null, "no control before the review is read");
  assert.equal(held.previousElementSibling, doc.getElementById("card-train"), "in the card's own place");
  const landed = (d) => { const c = d.querySelector('[data-slot="week-review"]'); return c && c.querySelector('[data-slot="week-review-summary"]') ? c : null; };
  const card = await tickUntil(() => landed(doc), "the weekly review card");
  assert.equal(card, held, "the review lands in the same card, in place");
  assert.equal(card.hasAttribute("aria-busy"), false);
  assert.equal(card.querySelector('[data-slot="week-review-pending"]'), null, "and the placeholder is gone");
  /* Polish batch (shots 01, 03): its own card in the feed, directly after the workout card and never inside it, in the
     proposal card's look (tcard proposal, the feed's dot, the head's kind as the heading "Last week"). */
  const train = doc.getElementById("card-train");
  assert.equal(train.contains(card), false, "not drawn inside the workout card");
  assert.equal(card.parentElement, train.parentElement, "a card of the feed, beside the workout card");
  assert.equal(card.previousElementSibling, train, "directly after the workout card");
  assert(card.classList.contains("proposal"), "in the coach proposal card's look");
  assert.equal(card.firstElementChild.classList.contains("tdot"), true, "with the feed's dot");
  assert.equal(norm(card.querySelector(".head > .kind").textContent), "Last week", "headed Last week");
  /* POLISH 4 (PM, the owner's 7-lift week): collapsed on open. The heading, one summary line and "See details" on a row
     of its own, a real button that says it is closed and what it opens; nothing else is shown. */
  const summary = card.querySelector('[data-slot="week-review-summary"]');
  assert.match(norm(summary.textContent), /^Workouts done: 2 of \d+\. 1 lift ready for a new weight\.$/);
  const toggle = card.querySelector('[data-slot="week-review-toggle"]');
  const details = doc.getElementById(toggle.getAttribute("aria-controls"));
  assert.equal(toggle.tagName, "BUTTON");
  assert.equal(toggle.type, "button");
  assert.equal(toggle.textContent, "See details");
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(toggle.previousElementSibling, summary, "See details sits right under the summary");
  assert.equal(details.parentElement, card);
  assert.equal(details.hidden, true, "the details wait behind See details");
  assert.deepEqual([...card.children].filter((el) => !el.hidden).map((el) => el.getAttribute("data-slot") || el.className),
    ["tdot", "head", "week-review-summary", "week-review-toggle"], "collapsed, the card is the heading, the summary and the toggle");
  toggle.click();
  assert.equal(details.hidden, false);
  assert.equal(toggle.textContent, "Hide details");
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  const rows = [...details.querySelectorAll(".change")].map((el) => norm(el.textContent));
  assert.equal(rows[0], "Chest press: " + Intents.WEEK_WORDS.up, "the ready lift first");
  assert.equal(rows[1], "Holding steady: Row.", "a lift not raised is named on the one steady line");
  assert.equal(rows.some((row) => /no new weight|not raised/.test(row)), false, "no per-lift not-raised line");
  if (model.read().proposal) assert.ok(rows.includes("1 suggestion waiting on Today."), "the open suggestion, counted");
  const why = details.querySelector('[data-slot="week-review-why"]');
  const reason = doc.getElementById(why.getAttribute("aria-controls"));
  assert.equal(norm(why.previousElementSibling.textContent), "Chest press: " + Intents.WEEK_WORDS.up, "Why? follows its line");
  assert.equal(why.nextElementSibling, reason, "and opens its reason inline, right under it");
  assert.ok(rows.some((row) => /^Trend weight: \d+(\.\d+)? lb\.$/.test(row)), "the bodyweight line is one short line");
  assert.equal(why.textContent, "Why?");
  assert.equal(reason.hidden, true, "the reason waits behind Why?");
  why.click();
  assert.equal(reason.hidden, false);
  /* batch 2 (item 4): the offer in plain words, never the engine's reason */
  assert.equal(reason.textContent, "You reached the top of your rep range at 100 lb on Jan 30. Make 105 lb your working weight? Nothing changes unless you say yes; it then applies on a later workout.");
  assert.equal(why.getAttribute("aria-expanded"), "true");
  toggle.click();
  assert.equal(details.hidden, true, "Hide details closes them again");
  assert.equal(toggle.textContent, "See details");
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(card.classList.contains("tcard"), true, "the proposal card's own look");
  api.dispose();
  /* polish 4: nothing is remembered; the next open is collapsed again */
  const again = await weekToday(TodayModel.SYNTHETIC_DAY, WEEK_LANE);
  const next = await tickUntil(() => landed(again.doc), "the weekly review card again");
  assert.equal(next.querySelector('[data-slot="week-review-details"]').hidden, true, "collapsed on every open");
  assert.equal(next.querySelector('[data-slot="week-review-toggle"]').getAttribute("aria-expanded"), "false");
  again.api.dispose();
  /* not the first day of a week: nothing */
  const later = await weekToday("2030-02-06", WEEK_LANE);
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(later.doc.querySelector('[data-slot="week-review"]'), null, "midweek Today carries no review card");
  later.api.dispose();
  /* a lane with no workout record to read: nothing */
  const bare = await weekToday(TodayModel.SYNTHETIC_DAY, {});
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(bare.doc.querySelector('[data-slot="week-review"]'), null, "no workout record, no card");
  bare.api.dispose();
});

/* CV1-10 (polish 4, the owner's shape): ten lifts last week, none ready. Collapsed the card says all held steady; open,
   ONE steady line names the first four and "and 6 more", a real button that shows every name on that line and reads
   "Show fewer" until it puts the short line back; the review stores nothing (no storage is touched).
   POLISH 5 (item 6): "and 6 more" continues its own line, inline, with no comma left hanging; a device whose history
   before the week holds fewer than two workouts says no lift is ready YET. */
const OWNER_LIFTS = ["Lateral machine", "Press", "Machine fly", "Pulldown", "Leg press", "Leg curl", "Calf raise", "Hip thrust",
  "Leg extension", "Row"];
const ownerLane = (done) => ({ gym: { read: async () => ({ phase: "ready" }), lastRead: () => ({ phase: "ready" }), weekSessions: async () => ({ ok: true, done, dates: [] }) },
  nativeLoad: { weekLifts: async () => ({ ok: true, lifts: OWNER_LIFTS.map((name, i) => ({
    lift: "owner-" + i, name, status: "refused", code: i % 3 ? "NATIVE_LOAD_WINDOW_NOT_TOP" : "NATIVE_LOAD_SOMETHING_UNMAPPED" })) }) } });
const landedIn = (d) => { const c = d.querySelector('[data-slot="week-review"]'); return c && c.querySelector('[data-slot="week-review-summary"]') ? c : null; };
test("CV1-10 the owner's ten lifts: one steady line on the card, its rest behind and 6 more, nothing stored", async () => {
  const { default: TodayModel } = await import("../today-model.cjs");
  const { doc, api } = await weekToday(TodayModel.SYNTHETIC_DAY, ownerLane(2));
  const win = doc.defaultView;
  const touched = [];
  for (const store of ["localStorage", "sessionStorage"]) {
    try { const s = win[store]; for (const m of ["setItem", "getItem", "removeItem"]) { const f = s[m].bind(s); s[m] = (...a) => { touched.push(store + "." + m); return f(...a); }; } } catch (_) { /* no storage in this window */ }
  }
  const card = await tickUntil(() => landedIn(doc), "the weekly review card");
  assert.match(norm(card.querySelector('[data-slot="week-review-summary"]').textContent), /^Workouts done: 2 of \d+\. All lifts held steady\.$/);
  card.querySelector('[data-slot="week-review-toggle"]').click();
  const details = card.querySelector('[data-slot="week-review-details"]');
  const steady = details.querySelector('[data-slot="week-review-steady"]');
  const names = steady.querySelector('[data-slot="week-review-names"]');
  assert.equal(norm(steady.textContent), "Holding steady: Lateral machine, Press, Machine fly, Pulldown and 6 more",
    "one line, no comma left hanging before and 6 more, and the control ends it (no full stop after its chevron)");
  assert.equal(details.querySelectorAll(".change").length - (details.textContent.includes("suggestion waiting") ? 1 : 0)
    - (/Trend weight/.test(details.textContent) ? 1 : 0), 1, "one line for all ten lifts");
  const more = details.querySelector('[data-slot="week-review-more"]');
  assert.equal(more.tagName, "BUTTON");
  assert.equal(more.type, "button");
  assert.equal(more.parentElement, steady, "and 6 more continues its own line, inline");
  assert.equal(more.previousElementSibling, names, "right after the names");
  assert.equal(more.textContent, "and 6 more");
  assert.equal(more.getAttribute("aria-expanded"), "false");
  assert.equal(more.getAttribute("aria-controls"), steady.id);
  more.click();
  assert.equal(norm(names.textContent), "Holding steady: " + OWNER_LIFTS.slice(0, -1).join(", ") + " and Row.");
  assert.equal(norm(steady.textContent), norm(names.textContent) + " Show fewer");
  assert.equal(more.textContent, "Show fewer");
  assert.equal(more.getAttribute("aria-expanded"), "true");
  more.click();
  assert.equal(norm(steady.textContent), "Holding steady: Lateral machine, Press, Machine fly, Pulldown and 6 more");
  assert.equal(more.textContent, "and 6 more");
  assert.equal(more.getAttribute("aria-expanded"), "false");
  assert.equal([...card.querySelectorAll(".change")].some((row) => OWNER_LIFTS.some((name) => norm(row.textContent).startsWith(name + ": "))), false,
    "no per-lift line");
  assert.deepEqual(touched, [], "the review keeps no state of its own");
  api.dispose();
  /* polish 5 (item 6): the first weeks, fewer than two workouts before the week reviewed: no lift is ready YET */
  const early = await weekToday(TodayModel.SYNTHETIC_DAY, ownerLane(1));
  const first = await tickUntil(() => landedIn(early.doc), "the first-week card");
  assert.match(norm(first.querySelector('[data-slot="week-review-summary"]').textContent), /^Workouts done: 1 of \d+\. No lift ready for a new weight yet\.$/);
  early.api.dispose();
});

/* CV1-11 (polish 5, item 5: the card arrived about 9 s late, because every boot repaint dropped the review in flight and
   began its reads again). A repaint of Today that changes neither the day nor the workout summary reuses the read the
   first paint began, and once it has landed a repaint draws the card at once, with no placeholder and no new read. */
test("CV1-11 the review is read once per workout summary: repaints reuse it, and a landed review repaints in place", async () => {
  const { default: TodayModel } = await import("../today-model.cjs");
  let reads = 0;
  const summary = Object.freeze({ phase: "ready", sets: 0, code: null, copy: null, unfinished: null });
  const lane = { summary: () => summary, gym: WEEK_LANE.gym,
    nativeLoad: { weekLifts: async (...a) => { reads += 1; return WEEK_LANE.nativeLoad.weekLifts(...a); } } };
  const { doc, api } = await weekToday(TodayModel.SYNTHETIC_DAY, lane);
  api.render("today", false);
  api.render("today", false);
  await tickUntil(() => landedIn(doc), "the weekly review card");
  assert.equal(reads, 1, "three paints, one read");
  api.render("today", false);
  const again = doc.querySelector('[data-slot="week-review"]');
  assert(again && again.querySelector('[data-slot="week-review-summary"]'), "a repaint draws the landed review at once");
  assert.equal(again.hasAttribute("aria-busy"), false, "with no placeholder");
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(reads, 1, "and reads nothing again");
  api.dispose();
});

/* CV1-9 (Coach v1 seat read, PM ruling option A). "Where's my seat set?" on the page: the Today app hands the coach the
   workout lane's one seat read (today-entry.mjs seatSettings) over the page's own window, the store the gym lane itself
   opens, and the answer is one line per lift of today's workout. With no workout lane there is nothing to read, and the
   question says so plainly. */
test("CV1-9 where's my seat set reads the saved settings through the workout lane's one read, one line per lift", async () => {
  const Intents = (await import("../../../../coach/coach-intents.cjs")).default;
  const { default: TodayModel } = await import("../today-model.cjs");
  const seen = [];
  const lane = { gym: { read: async () => ({ phase: "ready" }), lastRead: () => ({ phase: "ready" }) },
    seatSettings: async (view, ids) => { seen.push({ view, ids }); return { ok: true, rows: ids.map((lift, i) => ({ lift,
      latest: i === 0 ? { op_id: "op-1", machine: { exercise_id: lift, settings: [{ name: "seat", value: "4" }, { name: "back pad", value: "2" }] } } : null })) }; } };
  const { doc, phone, api, model } = await weekToday(TodayModel.SYNTHETIC_DAY, lane);
  doc.querySelector('[data-go="coach"]').click();
  await new Promise((r) => setTimeout(r, 0));
  const card = await tap(phone, "machine_seat");
  assert.equal(card.classList.contains("is-refusal"), false, "answered");
  assert.equal(card.querySelector(".from").textContent, COACH_LIVE_COPY.fromYourData);
  const names = model.sessionPlan().exercises.map((ex) => ex.name);
  assert.deepEqual(phone.querySelector("#coach-answer-text").textContent.split("\n"),
    [names[0] + ": seat 4; back pad 2.", ...names.slice(1).map((name) => "No machine settings saved for " + name + " yet.")]);
  assert.equal(seen.length, 1, "one read");
  assert.equal(seen[0].view, doc.defaultView, "over the page's own window, the store the gym lane opens");
  assert.deepEqual(seen[0].ids, model.sessionPlan().exercises.map((ex) => ex.id), "for today's lifts");
  api.dispose();
  const bare = await liveCoach();
  bare.doc.querySelector('[data-go="coach"]').click();
  await new Promise((r) => setTimeout(r, 0));
  const refused = await tap(bare.phone, "machine_seat");
  assert.equal(refused.classList.contains("is-refusal"), true, "no workout lane: nothing to read");
  assert.equal(bare.phone.querySelector("#coach-answer-text").textContent, Intents.PLAIN_REFUSALS.machine_seat);
  bare.api.dispose();
});
