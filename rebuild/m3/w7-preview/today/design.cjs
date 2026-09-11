"use strict";

/* design.cjs — the binding to the owner-approved 2026-09-08 design of record.

   Three things live here and nowhere else:
     THE PINS      — the sha256 of each approved reference, and the byte-for-byte copy of
                     its stylesheet into the page.
     THE BINDING   — every class the page can render must be a selector in those
                     stylesheets, and every static sentence it shows must occur verbatim
                     in that approved HTML, except short, named preview-owned lists.
     THE TYPEFACES — the two pinned local Instrument fonts, inlined, so the page needs no
                     network at all (review F9: a phone build must launch offline).
   A design change upstream, or a builder quietly inventing a class or a phrase or
   copying one of the prototype's fictional figures, fails this file.

   It deliberately depends on nothing but node:fs and node:crypto, so the tests that use
   it run under the repository's own lockfile with no browser-build dependency. */

const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../../../..");

/* ORDER MATTERS. Refinement A is laid down FIRST and Additions C SECOND, so the
   authoritative reference wins every rule the two share — its page, food, training and
   bottom proportions included. That ordering is what keeps Today's single primary action
   inside one 390x844 viewport (review F2). Refinement A still supplies the direct-entry
   control the weigh-in sheet uses, which C has no screen for.

   The authority for that ordering is:
     rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md LINE 9 — "Local
       authoritative implementation reference is `dist/index.html` in this directory,
       SHA256 caf9c2dc…" (the bytes pinned second below), and
     rebuild/m1/MOCK.md LINE 20 — a builder must not "improve" the design, and where an
       approved layout conflicts with an accepted requirement the concrete issue is
       resolved while preserving the visual intent.
   NOT MOCK.md line 14: that line is about the B-stage PNGs losing to the C HTML, which
   says nothing about Refinement A (review D-3). */
const APPROVED = Object.freeze([
  { file: "rebuild/m1/approved-2026-09-08/Earned-refinement-A.html",
    sha256: "fddfe0542c4a578653a11941d96fbf6727dc2d9f83c500449c694339e89ab031" },
  { file: "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html",
    sha256: "caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45" },
]);

/* The two typefaces the approved design names, already pinned by sha256 for the phone
   host in rebuild/m4/workout/fonts/SOURCES.json. They are inlined into the stylesheet so
   the page fetches nothing. */
const FONT_DIR = "rebuild/m4/workout/fonts";
const FONTS = Object.freeze([
  { family: "Instrument Sans", name: "InstrumentSans-Variable.woff2", weight: "400 600", style: "normal" },
  { family: "Instrument Serif", name: "InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
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
  "How are you feeling today?",
  "Ask your coach", "Your plan, progress and the reasons behind it.", "Weight (lb)",
  "Back to my plan", "Today", "Your food plan.",
  "Your agreed daily targets, together in one place.",
  "Targets guide your day. Any suggested change comes with a reason and your choice to accept it.",
  "A quick check-in.", "Energy right now", "Muscle soreness right now", "Stress right now",
  "Low", "Moderate", "High", "None", "Mild", "Significant",
  "Ask your coach.", "Make sense of your plan and the progress behind it.",
]);
/* Approved copy the VIEW composes at runtime rather than carrying in the template,
   because it sits beside a bound value ("Weight trend 180.1 lb"). Each string is checked
   against the approved HTML AND against today-app.cjs, so it is bound just as tightly as
   the template's. */
const RUNTIME_COPY = Object.freeze([
  "This morning", "Weight trend", "Why this plan?", "Your set targets are ready",
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

/* `root` is a parameter ONLY so a test can point the same pin check at a tampered copy
   and watch it refuse. Production callers pass nothing. */
function readApproved(root = ROOT) {
  return APPROVED.map((pin) => {
    const bytes = fs.readFileSync(path.join(root, pin.file));
    assert.equal(sha256(bytes), pin.sha256, `APPROVED-PIN FAIL: ${pin.file}`);
    const html = bytes.toString("utf8");
    const style = html.match(/<style>([\s\S]*?)<\/style>/);
    assert(style, `APPROVED-STYLES FAIL: ${pin.file}`);
    return { ...pin, html, styles: style[1] };
  });
}

/* The pinned local typefaces, as @font-face rules with the font bytes inlined. Same
   files, same hashes the phone host's build already enforces. */
function readFonts(root = ROOT) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, FONT_DIR, "SOURCES.json"), "utf8"));
  assert.equal(manifest.schema, "earned/local-typography/v1", "TYPOGRAPHY-MANIFEST FAIL");
  return FONTS.map((font) => {
    const pin = manifest.files.filter((f) => f.name === font.name);
    assert.equal(pin.length, 1, `TYPOGRAPHY-PIN FAIL: ${font.name}`);
    const bytes = fs.readFileSync(path.join(root, FONT_DIR, font.name));
    assert.equal(bytes.length, pin[0].size, `TYPOGRAPHY-SIZE FAIL: ${font.name}`);
    assert.equal(sha256(bytes), pin[0].sha256, `TYPOGRAPHY-PIN FAIL: ${font.name}`);
    assert.equal(bytes.subarray(0, 4).toString("latin1"), "wOF2", `TYPOGRAPHY-FORMAT FAIL: ${font.name}`);
    return { ...font, sha256: pin[0].sha256, bytes };
  });
}
function fontFaceCss(fonts) {
  return fonts.map((font) =>
    `@font-face{font-family:'${font.family}';font-style:${font.style};font-weight:${font.weight};`
    + `font-display:swap;src:url(data:font/woff2;base64,${font.bytes.toString("base64")}) format('woff2')}`
  ).join("\n");
}

function assertDesignBinding(approved, templateHtml, appSource) {
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
  if (appSource !== undefined) {
    for (const line of RUNTIME_COPY) {
      assert(approvedText.includes(line), `COPY-BINDING FAIL: declared runtime copy missing upstream: "${line}"`);
      assert(appSource.includes(line), `COPY-BINDING FAIL: declared runtime copy missing from the view: "${line}"`);
    }
  }
  // The design of record's numbers are fictional. None of them may be copied.
  for (const line of textOf(templateHtml)) {
    assert(!/\d/.test(line), `NO-NUMBERS FAIL: the template carries a literal figure: "${line}"`);
  }
  return { classes: used.size, copy: PREVIEW_COPY.length + APPROVED_COPY.length + (appSource === undefined ? 0 : RUNTIME_COPY.length) };
}

// The shipped stylesheet: the inlined pinned typefaces, then the approved bytes in order,
// then the preview's own chrome.
function composeStyles(approved, chrome, fonts) {
  return fontFaceCss(fonts) + "\n" + approved.map((a) => a.styles).join("\n") + "\n" + chrome;
}

/* THE HEADLINE VOCABULARY. Today's headline slot is driven by the engine's own
   nowModel().move.title, which the engine renders in upper case. Every one of those
   strings is a `title:` literal in rebuild/engine/*.cjs, so they are read straight out of
   the engine source at test time and the layout is measured against ALL of them — a title
   added to the engine tomorrow is covered without anyone remembering to list it here.

   This is deliberately a SUPERSET: it collects every `title:` literal in the engine, not
   only the ones theOneFix and policy.cjs can put on this slot. Testing the layout against
   more strings than the slot can show is safe; missing one is not. */
const ENGINE_DIR = "rebuild/engine";
function headlineVocabulary(root = ROOT) {
  const dir = path.join(root, ENGINE_DIR);
  const out = new Set();
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".cjs")) continue;
    const text = fs.readFileSync(path.join(dir, name), "utf8");
    for (const pattern of [/(?:^|[\s,{(])title\s*:\s*"((?:[^"\\\n]|\\.){3,140})"/g,
      /(?:^|[\s,{(])title\s*:\s*'((?:[^'\\\n]|\\.){3,140})'/g]) {
      for (const match of text.matchAll(pattern)) out.add(match[1].replace(/\\(.)/g, "$1").toUpperCase());
    }
  }
  assert(out.size >= 10, "HEADLINE-VOCABULARY FAIL: the engine's title literals could not be read");
  return [...out].sort((a, b) => b.length - a.length || (a < b ? -1 : 1));
}

const SOURCE = __dirname;
const templateHtml = () => fs.readFileSync(path.join(SOURCE, "screens.template.html"), "utf8");
const appSource = () => fs.readFileSync(path.join(SOURCE, "today-app.cjs"), "utf8");
const chromeCss = () => fs.readFileSync(path.join(SOURCE, "preview.css"), "utf8");
const shellHtml = () => fs.readFileSync(path.join(SOURCE, "index.shell.html"), "utf8");

module.exports = {
  ROOT, SOURCE, APPROVED, FONTS, FONT_DIR, PREVIEW_CLASSES, RUNTIME_CLASSES, PREVIEW_COPY, APPROVED_COPY, RUNTIME_COPY,
  readApproved, readFonts, fontFaceCss, assertDesignBinding, composeStyles, textOf, classTokens, sha256,
  headlineVocabulary, ENGINE_DIR,
  templateHtml, appSource, chromeCss, shellHtml,
};
