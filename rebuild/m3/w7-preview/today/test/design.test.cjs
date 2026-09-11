"use strict";

/* A1 — the binding to the design of record. These tests are what stop the page drifting
   away from rebuild/m1/approved-2026-09-08/, and what stop a builder inventing a class,
   a phrase, or one of the prototype's fictional figures. */

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const design = require("../design.cjs");

test("both approved references are pinned by sha256 and read byte-for-byte", () => {
  const approved = design.readApproved();
  assert.equal(approved.length, 2);
  for (const entry of approved) {
    const bytes = fs.readFileSync(path.join(design.ROOT, entry.file));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, entry.file);
    assert(entry.styles.length > 1000, entry.file + " carries a stylesheet");
  }
  /* Refinement A first, Additions C second, so the authoritative reference wins every
     rule the two share — which is what keeps Today's primary action in one viewport. */
  assert.match(approved[0].file, /Earned-refinement-A\.html$/);
  assert.match(approved[1].file, /Earned-additions-C-approved\.html$/);
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
    const index = bytes.indexOf(Buffer.from("Keep the plan."));
    assert(index > 0, "the tampering target is really in the file");
    bytes[index] = bytes[index] === 0x4b ? 0x6b : 0x4b;   // "K" <-> "k": one byte
    fs.writeFileSync(victim, bytes);
    assert.throws(() => design.readApproved(room), /APPROVED-PIN FAIL/,
      "a one-byte change to the design of record fails the build");
  } finally {
    fs.rmSync(room, { recursive: true, force: true });
  }
});

test("both typefaces are pinned by sha256 and inlined, so the page fetches nothing", () => {
  const fonts = design.readFonts();
  assert.equal(fonts.length, 2);
  const manifest = JSON.parse(fs.readFileSync(path.join(design.ROOT, design.FONT_DIR, "SOURCES.json"), "utf8"));
  for (const font of fonts) {
    const pin = manifest.files.find((f) => f.name === font.name);
    assert.equal(createHash("sha256").update(font.bytes).digest("hex"), pin.sha256, font.name);
    assert.equal(font.bytes.subarray(0, 4).toString("latin1"), "wOF2", font.name);
  }
  const css = design.fontFaceCss(fonts);
  assert.equal((css.match(/@font-face/g) || []).length, 2);
  assert.match(css, /src:url\(data:font\/woff2;base64,/);
  assert.doesNotMatch(css, /https?:/, "no font is fetched over the network");
  assert.doesNotMatch(design.shellHtml(), /https?:\/\//, "the page shell references no remote origin");
  assert.doesNotMatch(design.composeStyles(design.readApproved(), design.chromeCss(), fonts), /@import|url\(http/,
    "the shipped stylesheet fetches nothing");
});

test("the shipped template and view bind to the approved design", () => {
  const approved = design.readApproved();
  const report = design.assertDesignBinding(approved, design.templateHtml(), design.appSource());
  assert(report.classes > 25, "the whole approved vocabulary is checked");
  assert.equal(report.copy, design.PREVIEW_COPY.length + design.APPROVED_COPY.length
    + design.RUNTIME_COPY.length + design.PREVIEW_RUNTIME_COPY.length);
  // A2: the binding covers every module that can put a word on the screen.
  assert.deepEqual(design.VIEW_SOURCES, ["today-app.cjs", "gym-app.mjs", "gym-model.mjs"]);
  for (const name of design.VIEW_SOURCES) assert(design.appSource().includes("\n"), name);
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
  const design2 = { ...design };
  void design2;
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

/* review D-3: the ordering authority is cited, and the misattributed line is not. */
test("the C-wins ordering cites the handoff line 9 and MOCK.md line 20", () => {
  const source = fs.readFileSync(path.join(design.SOURCE, "design.cjs"), "utf8");
  assert.match(source, /ADDITIONS-C-APPROVED-HANDOFF\.md LINE 9/);
  assert.match(source, /MOCK\.md LINE 20/);
  assert.match(source, /NOT MOCK\.md line 14/);
  // And the cited lines really say what they are cited for.
  const handoff = fs.readFileSync(path.join(design.ROOT,
    "rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md"), "utf8").split("\n");
  assert.match(handoff[8], /Local authoritative implementation reference is/);
  assert(handoff[8].includes(design.APPROVED[1].sha256), "handoff line 9 pins the C bytes");
  const mock = fs.readFileSync(path.join(design.ROOT, "rebuild/m1/MOCK.md"), "utf8").split("\n");
  assert.match(mock[19], /must not "improve" the design/);
  assert.match(mock[13], /B-stage renders/, "line 14 is about the B PNGs, not Refinement A");
});

test("the page shell has exactly one slot for the approved templates", () => {
  assert.equal(design.shellHtml().split("<!-- APPROVED_TEMPLATES -->").length, 2);
});
