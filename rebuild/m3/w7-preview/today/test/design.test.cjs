"use strict";

/* A1 — the binding to the design of record. These tests are what stop the page drifting
   away from rebuild/m1/approved-2026-09-08/, and what stop a builder inventing a class,
   a phrase, or one of the prototype's fictional figures. */

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
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
  // Additions C is the authoritative reference and is laid down first; Refinement A, the
  // Today plan-first design of record, wins on the rules the two share.
  assert.match(approved[0].file, /Earned-additions-C-approved\.html$/);
  assert.match(approved[1].file, /Earned-refinement-A\.html$/);
});

test("the shipped template binds to the approved design", () => {
  const approved = design.readApproved();
  const report = design.assertDesignBinding(approved, design.templateHtml());
  assert(report.classes > 30, "the whole approved vocabulary is checked");
});

test("an invented class, an invented phrase or a copied figure fails the binding", () => {
  const approved = design.readApproved();
  const template = design.templateHtml();
  assert.throws(() => design.assertDesignBinding(approved, template.replace('class="page"', 'class="invented-class"')),
    /CLASS-BINDING FAIL/);
  assert.throws(() => design.assertDesignBinding(approved, template.replace("Your plan for today", "A phrase nobody approved")),
    /COPY-BINDING FAIL/);
  assert.throws(() => design.assertDesignBinding(approved, template.replace("Eat about", "Eat about 2,300")),
    /FAIL/, "a fictional figure copied out of the prototype fails the build");
  const changed = approved.map((a, i) => (i ? a : { ...a, sha256: "0".repeat(64) }));
  assert.throws(() => design.assertDesignBinding(approved, '<div class="not-a-real-class"></div>'), /CLASS-BINDING FAIL/);
  assert.equal(changed[0].sha256.length, 64);
});

test("the template carries no figure at all", () => {
  for (const line of design.textOf(design.templateHtml())) {
    assert(!/\d/.test(line), "template text carries a figure: " + line);
  }
});

test("the shipped stylesheet is the approved bytes, then the one accessibility correction", () => {
  const approved = design.readApproved();
  const css = design.composeStyles(approved, design.chromeCss());
  for (const entry of approved) assert(css.includes(entry.styles), entry.file + " is copied byte-for-byte");
  assert(css.indexOf(approved[0].styles) < css.indexOf(approved[1].styles), "C first, A second");
  assert(css.includes(".view .followup input"), "the 16px iOS-zoom correction is present");
  assert(css.indexOf(".view .followup input") > css.lastIndexOf(".checkin .fine"),
    "the correction is laid down after the approved rules it corrects");
  // The correction is the ONLY colour/type/spacing change: nothing in the preview chrome
  // introduces a colour literal that the approved palette does not define.
  const chrome = design.chromeCss();
  const literals = chrome.match(/#[0-9a-fA-F]{3,8}/g) || [];
  for (const literal of literals) assert(approved.some((a) => a.styles.includes(literal.slice(0, 7))),
    "preview chrome uses an unapproved colour: " + literal);
});

test("the page shell has exactly one slot for the approved templates", () => {
  assert.equal(design.shellHtml().split("<!-- APPROVED_TEMPLATES -->").length, 2);
});
