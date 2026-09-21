"use strict";

/* C-UI-1: the binding to the design of record. These tests stop the page drifting
   away from rebuild/m1/approved-2026-09-18/, and stop a builder inventing a class,
   a phrase, or one of the prototype's fictional figures. */

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const design = require("../design.cjs");

test("all four approved stylesheets are pinned by sha256 and read byte-for-byte", () => {
  const approved = design.readApproved();
  assert.deepEqual(approved.map((entry) => entry.file), [
    "rebuild/m1/approved-2026-09-18/app/app.css",
    "rebuild/m1/approved-2026-09-18/app/states.css",
    "rebuild/m1/approved-2026-09-18/app/states-workout.css",
    "rebuild/m1/approved-2026-09-18/app/states-coach.css",
  ]);
  assert.deepEqual(approved.map((entry) => entry.sha256), [
    "bf4924e74fc4edc5cebf7fba6519613d9eec7f44397db990396fe402c124edc2",
    "eae53de1838338a76a416052a381494602c5fc9545c330afce2438a19a2ca219",
    "5d6e4082c88e9129979f764dc992e4cbb0439c3a9b2e0d625535c524d47a4f0a",
    "d33f62e0c54004063b5fe40720f220350d9311213bf80f13d49d260061ca0686",
  ]);
  for (const entry of approved) {
    const bytes = fs.readFileSync(path.join(design.ROOT, entry.file));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, entry.file);
    assert(entry.styles.length > 1000, entry.file + " carries a stylesheet");
    assert.equal(entry.styles, bytes.toString("utf8"), entry.file + " is copied byte-for-byte");
  }
});

/* review F5: this replaces an assertion that could not fail. The pin is now pointed at a
   tampered copy of the real reference and must refuse it. */
test("a single changed byte in an approved reference fails the pin", () => {
  const room = fs.mkdtempSync(path.join(os.tmpdir(), "a1-design-pin-"));
  try {
    for (const entry of design.APPROVED) {
      fs.mkdirSync(path.join(room, path.dirname(entry.file)), { recursive: true });
      fs.copyFileSync(path.join(design.ROOT, entry.file), path.join(room, entry.file));
    }
    assert.doesNotThrow(() => design.readApproved(room), "an untouched copy still passes the pin");
    const victim = path.join(room, design.APPROVED[1].file);
    const bytes = fs.readFileSync(victim);
    const index = bytes.indexOf(Buffer.from(".panel"));
    assert(index > 0, "the tampering target is really in the file");
    bytes[index] = bytes[index] === 0x2e ? 0x23 : 0x2e;   // "." <-> "#": one byte
    fs.writeFileSync(victim, bytes);
    assert.throws(() => design.readApproved(room), /APPROVED-PIN FAIL/,
      "a one-byte change to the design of record fails the build");
  } finally {
    fs.rmSync(room, { recursive: true, force: true });
  }
});

test("both typefaces are pinned by sha256 and inlined, so the page fetches nothing", () => {
  const fonts = design.readFonts();
  const expected = [
    { family: "DM Sans", name: "earned-sans.woff2",
      sha256: "c04be0b43dc3911dd36a7cb7203c5ff6daa4f42522e2bc2e6fa3325a61c43d8b" },
    { family: "Liberation Serif", name: "earned-serif.woff2",
      sha256: "ff90213df9f50596c71ada04c34d2dee9327fe86526e713a9d49a7064b1db660" },
  ];
  assert.deepEqual(fonts.map(({ family, name, sha256 }) => ({ family, name, sha256 })), expected);
  for (const font of fonts) {
    const pin = expected.find((entry) => entry.name === font.name);
    assert.equal(createHash("sha256").update(font.bytes).digest("hex"), pin.sha256,
      font.name + " actual bytes match the approved pin");
    assert.equal(font.bytes.subarray(0, 4).toString("latin1"), "wOF2", font.name);
  }
  const room = fs.mkdtempSync(path.join(os.tmpdir(), "cui1-font-pin-"));
  try {
    for (const font of design.FONTS) {
      const from = path.join(design.ROOT, design.FONT_DIR, font.name);
      const to = path.join(room, design.FONT_DIR, font.name);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
    const victim = path.join(room, design.FONT_DIR, design.FONTS[0].name);
    const bytes = fs.readFileSync(victim);
    bytes[bytes.length - 1] ^= 1;
    fs.writeFileSync(victim, bytes);
    assert.throws(() => design.readFonts(room), /TYPOGRAPHY-(?:PIN|SIZE) FAIL/,
      "one changed font byte refuses instead of trusting metadata");
  } finally {
    fs.rmSync(room, { recursive: true, force: true });
  }
  const css = design.fontFaceCss(fonts);
  assert.equal((css.match(/@font-face/g) || []).length, 2);
  assert.match(css, /src:url\(data:font\/woff2;base64,/);
  assert.doesNotMatch(css, /https?:/, "no font is fetched over the network");
  assert.doesNotMatch(design.shellHtml(), /https?:\/\//, "the page shell references no remote origin");
  assert.doesNotMatch(design.composeStyles(design.readApproved(), design.chromeCss(), fonts), /@import|url\(http/,
    "the shipped stylesheet fetches nothing");
});

test("all four scene images are pinned by actual bytes and embedded offline", () => {
  const expected = [
    { file: "rebuild/m1/approved-2026-09-18/app/assets/plate-ink-tall.jpg",
      sha256: "e4a05e29f4e12cd763897428da63466aa7ddaa1ddf7d84264c3d6d3f04dda93e" },
    { file: "rebuild/m1/approved-2026-09-18/app/assets/plate-dawn-tall.jpg",
      sha256: "3192f9b2d7dea8d1efda6bd37ab4c438b939c510a6c2d496fa269e5a4479bfb4" },
    { file: "rebuild/m1/approved-2026-09-18/app/assets/mist.png",
      sha256: "72de840ebed8524916c8ff28bf246bbcee4ffac9ab8c0e8ec53cf40ef7325bbd" },
    { file: "rebuild/m1/approved-2026-09-18/app/assets/grain.png",
      sha256: "878b291b3454fca2ec07ac2d9e2bc22fb1d06604c8209a03f066e9f9a17fb57e" },
  ];
  const assets = design.readSceneAssets();
  assert.deepEqual(assets.map(({ file, sha256 }) => ({ file, sha256 })), expected);
  for (const asset of assets) {
    assert.equal(createHash("sha256").update(asset.bytes).digest("hex"), asset.sha256,
      asset.file + " actual bytes match the approved pin");
    assert.match(asset.url, /^data:image\/(?:jpeg|png);base64,/);
  }
  const css = design.sceneAssetCss(assets);
  for (const asset of assets) assert(css.includes(asset.url), asset.file + " is embedded in scene CSS");
  assert.doesNotMatch(css, /url\(["']?assets\//, "the built scene has no asset fetch");
});

test("the shipped template and view bind to the approved design", () => {
  const approved = design.readApproved();
  const report = design.assertDesignBinding(approved, design.templateHtml(), design.appSource());
  assert(report.classes > 25, "the whole approved vocabulary is checked");
  assert.equal(report.copy, design.PREVIEW_COPY.length + design.APPROVED_COPY.length
    + design.RUNTIME_COPY.length + design.CHECKIN_RUNTIME_COPY.length + design.PREVIEW_RUNTIME_COPY.length);
  // A2: the binding covers every module that can put a word on the screen, and it
  // really reads each of them — a module dropped from the list would take its copy
  // out of the binding with it. A3 adds the check-in's view and answer model.
  assert.deepEqual(design.VIEW_SOURCES,
    ["today-app.cjs", "gym-app.mjs", "gym-model.mjs", "today-model.cjs",
      "checkin-app.mjs", "checkin-model.mjs"]);
  const source = design.appSource();
  for (const name of design.VIEW_SOURCES) {
    const own = fs.readFileSync(path.join(design.SOURCE, name), "utf8");
    const marker = own.split("\n").find((line) => line.trim().length > 40);
    assert(source.includes(marker), name + " is not in the scanned view source");
  }
});

/* A2 — the preview-owned runtime copy cannot be used to smuggle approved-looking
   words in, and every entry really is said by a view module. */
test("preview-owned runtime copy is absent from the approved references", () => {
  const approvedText = design.readApproved().map((a) => a.html).join("\n");
  const view = design.appSource();
  assert(design.PREVIEW_RUNTIME_COPY.length >= 5);
  for (const line of design.PREVIEW_RUNTIME_COPY) {
    assert(!approvedText.includes(line), "claimed as preview-owned but approved: " + line);
    assert(view.includes(line), "declared but never said: " + line);
  }
  // A declared preview string that IS in the approved references fails the binding.
  assert.throws(() => design.assertDesignBinding(design.readApproved(), design.templateHtml(),
    view.replace("Your plan does not set a rest length.", "Take your rest.")), /COPY-BINDING FAIL/);
});

test("an invented class, an invented phrase or a copied figure fails the binding", () => {
  const approved = design.readApproved();
  const template = design.templateHtml();
  const view = design.appSource();
  assert.throws(() => design.assertDesignBinding(approved, template.replace('class="page"', 'class="invented-class"'), view),
    /CLASS-BINDING FAIL/);
  assert.throws(() => design.assertDesignBinding(approved, template.replace("Your plan for today", "A phrase nobody approved"), view),
    /COPY-BINDING FAIL/);
  assert.throws(() => design.assertDesignBinding(approved, template.replace("Eat about", "Eat about 2,300"), view),
    /FAIL/, "a fictional figure copied out of the prototype fails the build");
  assert.throws(() => design.assertDesignBinding(approved, template, view.replace(/Weight trend/g, "Scale trend")),
    /COPY-BINDING FAIL/, "copy the VIEW composes is bound just as tightly as the template's");
});

test("the template carries no figure at all", () => {
  for (const line of design.textOf(design.templateHtml())) {
    assert(!/\d/.test(line), "template text carries a figure: " + line);
  }
});

test("the shipped stylesheet is the approved bytes, then the named corrections", () => {
  const approved = design.readApproved();
  const css = design.composeStyles(approved, design.chromeCss(), design.readFonts());
  for (const entry of approved) assert(css.includes(entry.styles), entry.file + " is copied byte-for-byte");
  assert(css.indexOf(approved[0].styles) < css.indexOf(approved[1].styles), "A first, C second");
  for (const correction of [".view .followup input", ".view .intro h1", ".view .trend .sub"]) {
    assert(css.includes(correction), correction + " is present");
    assert(css.indexOf(correction) > css.indexOf(approved[1].styles),
      correction + " is laid down after the approved rules it corrects");
  }
  // The corrections are the ONLY colour/type change: nothing in the preview chrome
  // introduces a colour literal the approved palette does not define.
  const chrome = design.chromeCss();
  for (const literal of chrome.match(/#[0-9a-fA-F]{3,8}/g) || []) {
    assert(approved.some((a) => a.styles.includes(literal.slice(0, 7))),
      "preview chrome uses an unapproved colour: " + literal);
  }
  // And every font-size the chrome sets restates a value the approved references already
  // declare, rather than inventing a new step on the type scale.
  for (const size of chrome.match(/font-size:\s*(\d+)px/g) || []) {
    const value = size.match(/(\d+)px/)[1] + "px";
    assert(approved.some((a) => a.styles.includes(value)), "preview chrome invents a type size: " + value);
  }
});

/* review D-1: the headline vocabulary is READ FROM THE ENGINE, so a title added to the
   engine tomorrow is swept by the browser check without anyone listing it here. */
test("the headline vocabulary is read out of the engine source, not hand-listed", () => {
  const titles = design.headlineVocabulary();
  assert(titles.length >= 10, "the engine's title literals were found");
  for (const title of titles) assert.equal(title, title.toUpperCase(),
    "the engine renders move.title in upper case: " + title);
  // Each one really is a title literal in the engine, not something this file invented.
  const engine = fs.readdirSync(path.join(design.ROOT, design.ENGINE_DIR))
    .filter((name) => name.endsWith(".cjs"))
    .map((name) => fs.readFileSync(path.join(design.ROOT, design.ENGINE_DIR, name), "utf8"))
    .join("\n").toUpperCase();
  for (const title of titles) assert(engine.includes(title), "not an engine literal: " + title);
  // The four that pushed the primary action out of the viewport are covered.
  for (const known of ["LOW-ENERGY CHECK — ONE QUESTION THAT DISCRIMINATES",
    "AT A FLOOR — REVIEW THE RATE WITH YOUR COACH", "DIET BREAK — A WEEK AT MAINTENANCE",
    "NOW A SMALL CALORIE TRIM EARNS ITS PLACE", "CLOSE THE BOOKS FIRST", "NOTHING NEEDS YOU"]) {
    assert(titles.includes(known), "missing from the vocabulary: " + known);
  }
  // Sorted longest first, so the worst case is swept first.
  assert.deepEqual(titles, [...titles].sort((a, b) => b.length - a.length || (a < b ? -1 : 1)));
  assert.throws(() => design.headlineVocabulary(os.tmpdir()), /HEADLINE-VOCABULARY FAIL|ENOENT/);
});

test("the design binding cites C-UI-1 and the approved 2026-09-18 pack", () => {
  const source = fs.readFileSync(path.join(design.SOURCE, "design.cjs"), "utf8");
  assert.match(source, /C-UI-1/);
  assert.match(source, /approved-2026-09-18/);
  assert.doesNotMatch(source, /approved-2026-09-08/);
});

test("the page shell has exactly one slot for the approved templates", () => {
  assert.equal(design.shellHtml().split("<!-- APPROVED_TEMPLATES -->").length, 2);
});
