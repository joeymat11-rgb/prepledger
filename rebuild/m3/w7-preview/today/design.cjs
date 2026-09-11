"use strict";

/* design.cjs — the binding to the owner-approved 2026-09-08 design of record.

   Two things live here and nowhere else:
     THE PINS     — the sha256 of each approved reference, and the byte-for-byte copy of
                    its stylesheet into the page.
     THE BINDING  — every class the page can render must be a selector in those
                    stylesheets, and every static sentence it shows must occur verbatim
                    in that approved HTML, except short, named preview-owned lists.
   A design change upstream, or a builder quietly inventing a class or a phrase or
   copying one of the prototype's fictional figures, fails this file.

   It deliberately depends on nothing but node:fs and node:crypto, so the tests that use
   it run under the repository's own lockfile with no browser-build dependency. */

const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../../../..");

const APPROVED = Object.freeze([
  // Additions C is the authoritative reference (ADDITIONS-C-APPROVED-HANDOFF.md); its
  // stylesheet is laid down FIRST so Refinement A, the Today plan-first design of record,
  // wins on the rules the two share.
  { file: "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html",
    sha256: "caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45" },
  { file: "rebuild/m1/approved-2026-09-08/Earned-refinement-A.html",
    sha256: "fddfe0542c4a578653a11941d96fbf6727dc2d9f83c500449c694339e89ab031" },
]);

// Classes the preview owns because the approved design covers no screen for them.
const PREVIEW_CLASSES = Object.freeze(["sheet-panel"]);
// Classes the view creates at runtime; they are not in the template file.
const RUNTIME_CLASSES = Object.freeze(["macro-row", "row", "number", "unit", "arrow"]);
// Sentences the preview owns. Each says something the approved prototype cannot, because
// the approved prototype saves nothing and refuses nothing.
const PREVIEW_COPY = Object.freeze([
  "Not now",
  "Every answer is blank, and blank means unknown. Nothing here is recorded.",
]);
// Static copy that MUST come from the approved references.
const APPROVED_COPY = Object.freeze([
  "Earned", "Your plan for today", "Eat about", "Your full nutrition plan",
  "How are you feeling today?", "This morning", "Weight trend", "Why this plan?",
  "Ask your coach", "Your plan, progress and the reasons behind it.", "Weight (lb)",
  "Back to my plan", "Today", "Your food plan.",
  "Your agreed daily targets, together in one place.",
  "Targets guide your day. Any suggested change comes with a reason and your choice to accept it.",
  "A quick check-in.", "Energy right now", "Muscle soreness right now", "Stress right now",
  "Low", "Moderate", "High", "None", "Mild", "Significant",
  "Ask your coach.", "Make sense of your plan and the progress behind it.",
]);

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const classTokens = (html) =>
  [...html.matchAll(/\sclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
// The text NODES of the markup: tags and comments become separators, so every entry is a
// complete visible string, never a fragment of one.
const MARK = String.fromCharCode(0);
const textOf = (html) =>
  html.replace(/<!--[\s\S]*?-->/g, MARK).replace(/<[^>]*>/g, MARK).split(MARK)
    .map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);

function readApproved() {
  return APPROVED.map((pin) => {
    const bytes = fs.readFileSync(path.join(ROOT, pin.file));
    assert.equal(sha256(bytes), pin.sha256, `APPROVED-PIN FAIL: ${pin.file}`);
    const html = bytes.toString("utf8");
    const style = html.match(/<style>([\s\S]*?)<\/style>/);
    assert(style, `APPROVED-STYLES FAIL: ${pin.file}`);
    return { ...pin, html, styles: style[1] };
  });
}

function assertDesignBinding(approved, templateHtml) {
  const css = approved.map((a) => a.styles).join("\n");
  const allowed = new Set(PREVIEW_CLASSES);
  const used = new Set([...classTokens(templateHtml), ...RUNTIME_CLASSES]);
  for (const token of used) {
    if (allowed.has(token)) continue;
    const selector = new RegExp("\\." + token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\w-])");
    assert(selector.test(css), `CLASS-BINDING FAIL: .${token} is not in the approved stylesheets`);
  }
  const approvedText = approved.map((a) => a.html).join("\n");
  const preview = new Set(PREVIEW_COPY);
  for (const line of textOf(templateHtml)) {
    if (preview.has(line)) continue;
    assert(approvedText.includes(line), `COPY-BINDING FAIL: "${line}" is not in the approved references`);
  }
  for (const line of APPROVED_COPY) {
    assert(approvedText.includes(line), `COPY-BINDING FAIL: declared approved copy missing upstream: "${line}"`);
    assert(templateHtml.includes(line), `COPY-BINDING FAIL: declared approved copy missing from the template: "${line}"`);
  }
  // The design of record's numbers are fictional. None of them may be copied.
  for (const line of textOf(templateHtml)) {
    assert(!/\d/.test(line), `NO-NUMBERS FAIL: the template carries a literal figure: "${line}"`);
  }
  return { classes: used.size, copy: PREVIEW_COPY.length + APPROVED_COPY.length };
}

// The shipped stylesheet: the approved bytes, in order, then the preview's own chrome.
function composeStyles(approved, chrome) {
  return approved.map((a) => a.styles).join("\n") + "\n" + chrome;
}

const SOURCE = __dirname;
const templateHtml = () => fs.readFileSync(path.join(SOURCE, "screens.template.html"), "utf8");
const chromeCss = () => fs.readFileSync(path.join(SOURCE, "preview.css"), "utf8");
const shellHtml = () => fs.readFileSync(path.join(SOURCE, "index.shell.html"), "utf8");

module.exports = {
  ROOT, SOURCE, APPROVED, PREVIEW_CLASSES, RUNTIME_CLASSES, PREVIEW_COPY, APPROVED_COPY,
  readApproved, assertDesignBinding, composeStyles, textOf, classTokens,
  templateHtml, chromeCss, shellHtml,
};
