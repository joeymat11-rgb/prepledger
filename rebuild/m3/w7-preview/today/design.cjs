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

   It deliberately depends on nothing but node:fs, node:crypto and this page's own
   ./plain-copy.cjs (which depends on nothing at all), so the tests that use it run under
   the repository's own lockfile with no browser-build dependency. */

const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { plainCopy } = require("./plain-copy.cjs");

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
  /* A3 — the two controls that CONFIRM an existing dated sleep record instead of
     asking for it twice. The approved handoff item 4 requires that reuse; the
     approved prototype stores nothing, so it can never have a record to reuse and
     has no words for confirming one. */
  "Yes, that’s right",
  /* P1 review, optional item 5, taken: a comma reads better here than a colon, and
     DECISIONS:114 allows "a colon, comma, full stop or a new sentence". */
  "No, answer it here",
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
  /* A3 — every word of the approved recovery screen (?screen=recovery), question by
     question, choice by choice, including the conditional detail the approved notes
     enumerate. Each is asserted to occur verbatim in the approved references AND in
     this page's template, so the screen can neither drift from the design nor lose a
     branch of it silently. */
  "A few details to help put today’s training in context. Answer what you can; leave the rest blank.",
  "Last night’s sleep", "hours asleep, approximately", "How was the quality?",
  "Poor", "Okay", "Good",
  "Which muscles?", "Does it affect your usual movement?",
  "Leave unanswered", "A little", "Quite a lot", "Not sure",
  "Anything else affecting today?", "Pain", "Feeling ill", "Time away",
  "Keep pain separate from ordinary muscle soreness.",
  "Where, and during which movement?", "Is this new or changed?",
  "New", "Worse than before", "Ongoing, unchanged", "Improving",
  "How does it affect movement?",
  "No noticeable effect", "I change how I move", "I cannot do the movement",
  "What symptoms, and when did they start?",
  "About how many days away from training?", "What was the reason?",
  "Add a note, if useful", "Anything the answers missed?",
  "Add today’s context", "Your answers belong alongside your training data.",
]);
/* Approved copy the VIEW composes at runtime rather than carrying in the template,
   because it sits beside a bound value ("Weight trend 180.1 lb"). Each string is checked
   against the approved HTML AND against today-app.cjs, so it is bound just as tightly as
   the template's. */
const RUNTIME_COPY = Object.freeze([
  "This morning", "Weight trend", "Why this plan?", "Your set targets are ready",
  /* A2 — the gym card composes these beside bound values, exactly as A1's four are
     composed. Each occurs verbatim in Refinement A, the reviewed workout/rest
     prototype, and each is checked against the view sources as well. */
  "Exercise ", " of ", "What you did · Set ", "Last time: ", "Log set ", " logged",
  " reps", "Aim to finish with ", " clean reps left", "Effort unknown",
  "Ready for set ", "Next · Set ", "Next · ", "Resume ", "Workout in progress", " complete",
  " recorded",
]);
/* A3 — the approved question wording the CHECK-IN composes at runtime, beside a
   stored answer, when it reads today's recorded check-in back. Same rule as A1's and
   A2's: verbatim in the approved references, and present in a view source. */
const CHECKIN_RUNTIME_COPY = Object.freeze([
  "Last night’s sleep", "How was the quality?", "Energy right now",
  "Muscle soreness right now", "Which muscles?", "Does it affect your usual movement?",
  "Stress right now", "Anything else affecting today?",
  "Where, and during which movement?", "Is this new or changed?", "How does it affect movement?",
  "What symptoms, and when did they start?", "About how many days away from training?",
  "What was the reason?", "Anything the answers missed?",
  "Pain", "Feeling ill", "Time away",
]);
/* Copy this PREVIEW owns at runtime, exactly as PREVIEW_COPY is owned in the
   template. Each entry says something the approved prototype cannot, and each is
   checked to be ABSENT from the approved references — so this list can never be
   used to smuggle in approved-looking words.
     * the rest length — the prototype counts down a fictional 2:30; the accepted
       engine prescribes no rest at all, so the screen says that instead;
     * the finished workout — the prototype never completes one, so it has no
       words for Today's "recorded" state, for reviewing it, or for the action
       that closes the session;
     * the unopenable store — the prototype saves nothing, so it can never fail
       to save. */
const PREVIEW_RUNTIME_COPY = Object.freeze([
  "Your plan does not set a rest length.",
  "Workout recorded",
  "Review today’s workout",
  "Finish this workout",
  "Your workout could not be opened on this device, and nothing was recorded.",
  "Today’s workout is recorded on this device.",
  /* Review B1: the layer can refuse to PREPARE a workout, which the prototype (which
     prepares nothing) has no words for. The lead is neutral — it never says the
     device is at fault — and the layer's own code follows it, once. */
  "Today’s workout cannot open",
  "Why today’s workout cannot open",
  "Earned could not prepare today’s workout, and nothing was recorded.",
  /* Review B2: the weigh-in's store of record is this device's encrypted local
     store, and a device that cannot open one records nothing. The prototype saves
     nothing, so it can never fail to save. */
  "This device could not open its encrypted local store, so nothing can be recorded here.",
  "Saved in this device's encrypted local store. It survives a reload, a restart, a reboot and a crash.",
  /* Review round 2: a session abandoned on an earlier day blocks every later day in
     the accepted client, and the layer's own `early` close retires it. The
     prototype has no unfinished session and so no words for either. */
  "An earlier workout was never finished",
  "Close the unfinished workout",
  /* A3 — the check-in. The approved prototype records nothing, reuses nothing and
     refuses nothing, so it has no words for: a recorded check-in and its provenance,
     an existing dated sleep record offered for confirmation, a blank sheet that has
     recorded nothing yet, a form bound, a device with no store, or the plain
     statement that these answers reach no training rule. Each is checked to be
     ABSENT from the approved references. */
  "Nothing is recorded yet. Every answer is blank, and blank means unknown: never none, never zero.",
  "Today’s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet.",
  "Answer at least one question, or leave the check-in for today. Nothing was recorded.",
  "This device could not open its encrypted local store, so no check-in can be recorded here.",
  "Your sleep record already has last night.",
  "From your sleep record for ",
  "Recorded today at ",
  "Your plan is unchanged: nothing in this check-in reaches a training rule yet.",
  "An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded.",
  "Days away from training is recorded as a whole number of days. Nothing was recorded.",
  "This check-in could not be recorded on this device, and no part of it was recorded.",
  "Recorded today",
  "Not available on this device",
]);
/* A4 — Dad's first run. The approved 2026-09-08 design has NO first-run screen at
   all, so every sentence the six screens show is preview-owned and named here,
   exactly as PREVIEW_RUNTIME_COPY is. Each entry is checked to be ABSENT from the
   approved references, so this list can never be used to smuggle in
   approved-looking words, and PRESENT in a view source, so a sentence cannot be
   declared and then quietly dropped. The words themselves are in ONE place,
   setup-model.mjs COPY, which is a view source; the list below is read out of
   that module at check time rather than retyped, so a copy edit there fails this
   check instead of drifting past it.
   THE OWNER'S RULE (DECISIONS:114 (1)) applies to every one of them: no U+2014
   and no U+2013. Since P1 merged (DECISIONS:121) that refusal is ./plain-copy.cjs's
   for the whole page, at build time over the shipped bytes and at render time per
   slot; A4 keeps the behaviour in its own suite and no longer restates the
   mechanism here (see assertSetupBinding). */
const SETUP_MODEL_SOURCE = "setup-model.mjs";

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

/* ---------------------------------------------------------------------------
   THE RECOVERY SCREEN, DERIVED FROM THE APPROVED BYTES (A3 review F1).
   ---------------------------------------------------------------------------
   A hand-maintained list of approved strings can only catch what somebody
   remembered to list, and the first build of this screen shipped six of the
   approved placeholders missing because a placeholder is an ATTRIBUTE and the
   copy binding only reads text NODES. So the recovery screen's vocabulary is not
   listed at all: it is HARVESTED out of the pinned approved reference at check
   time — every placeholder, every <option>, every <label>, every <legend> and
   every choice array the approved screen builds its buttons from — and the
   shipped template must carry every single one of them, verbatim.

   A word added to the approved design upstream, or one quietly dropped here,
   fails this without anyone updating a list. */
const RECOVERY_START = "recovery:()=>";
const RECOVERY_END = "coach:()=>";
function recoverySection(approved) {
  const reference = approved.find((a) => /additions-C-approved/i.test(a.file));
  assert(reference, "APPROVED-RECOVERY FAIL: the authoritative Additions C reference is not pinned");
  const start = reference.html.indexOf(RECOVERY_START);
  const end = reference.html.indexOf(RECOVERY_END, start);
  assert(start > 0 && end > start, "APPROVED-RECOVERY FAIL: the recovery screen could not be located");
  return reference.html.slice(start, end);
}
function recoveryVocabulary(approved) {
  const section = recoverySection(approved);
  const grab = (pattern) => [...section.matchAll(pattern)].map((m) => m[1].replace(/\s+/g, " ").trim()).filter(Boolean);
  const placeholders = grab(/placeholder="([^"]+)"/g);
  const options = grab(/<option[^>]*>([^<]+)<\/option>/g);
  const labels = grab(/<label[^>]*>([^<]+)<\/label>/g);
  const legends = grab(/<legend[^>]*>([^<]+)<\/legend>/g);
  // The approved screen builds its answer buttons from inline arrays:
  //   ${['Poor','Okay','Good'].map(x=>`<button …>${x}</button>`).join('')}
  const choices = [...section.matchAll(/\[((?:'[^']*',?)+)\]\.map\(/g)]
    .flatMap((m) => [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]))
    .filter(Boolean);
  const unique = (list) => [...new Set(list)];
  return { placeholders: unique(placeholders), options: unique(options), labels: unique(labels),
    legends: unique(legends), choices: unique(choices) };
}
/* Every harvested string must be in the shipped template. Placeholders are matched as
   the attribute they are, so a placeholder demoted to visible text would not satisfy
   this, and the rest as their own element's text.

   DASH-NORMALISED (DECISIONS:114 (1), the owner verbatim: "no ai dashes are allowed in
   the ui"): where the pinned approved reference itself spells a word with an em or en
   dash, the shipped screen may not, so the comparison is made after ./plain-copy.cjs has
   taken the dash out of BOTH sides. The owner's rule beats the pinned design where the
   two disagree, and only there: every other harvested word is still compared byte for
   byte, so this can never be used to let a different word through. The report lists each
   term the normalisation moved. */
const dashNormalisedTerms = (vocabulary) => {
  const moved = [];
  for (const [kind, list] of Object.entries(vocabulary)) {
    for (const value of list) {
      const plain = plainCopy(value);
      if (plain !== value) moved.push({ kind, approved: value, shipped: plain });
    }
  }
  return moved;
};
function assertRecoveryBinding(approved, templateHtml) {
  const vocabulary = recoveryVocabulary(approved);
  assert(vocabulary.placeholders.length >= 7,
    `APPROVED-RECOVERY FAIL: only ${vocabulary.placeholders.length} placeholders harvested`);
  assert(vocabulary.choices.length >= 9,
    `APPROVED-RECOVERY FAIL: only ${vocabulary.choices.length} answer choices harvested`);
  for (const value of vocabulary.placeholders) {
    assert(templateHtml.includes(`placeholder="${plainCopy(value)}"`),
      `APPROVED-RECOVERY FAIL: the approved placeholder "${value}" is missing from the shipped screen`);
  }
  for (const [kind, list] of [["option", vocabulary.options], ["label", vocabulary.labels],
    ["legend", vocabulary.legends], ["choice", vocabulary.choices]]) {
    for (const value of list) {
      assert(templateHtml.includes(">" + plainCopy(value) + "<"),
        `APPROVED-RECOVERY FAIL: the approved ${kind} "${value}" is missing from the shipped screen`);
    }
  }
  return { placeholders: vocabulary.placeholders.length, options: vocabulary.options.length,
    labels: vocabulary.labels.length, legends: vocabulary.legends.length, choices: vocabulary.choices.length,
    dashNormalised: dashNormalisedTerms(vocabulary) };
}

/* ---------------------------------------------------------------------------
   A4 — THE FIRST-RUN VOCABULARY, HARVESTED FROM THE MODULE THAT OWNS IT.
   ---------------------------------------------------------------------------
   Same lesson as the recovery harvest above, applied the other way round: the
   approved design has no first-run screen, so there is nothing upstream to
   harvest FROM. What there is instead is exactly one module that owns every
   word of these six screens (setup-model.mjs COPY / VALIDATION / MISSING), and
   the check harvests that, so a sentence added, edited or removed there is
   covered without anyone updating a list. */
function setupVocabulary(root = ROOT) {
  const text = fs.readFileSync(path.join(root, "rebuild/m3/w7-preview/today", SETUP_MODEL_SOURCE), "utf8");
  const block = (name) => {
    const start = text.indexOf("export const " + name + " = Object.freeze({");
    assert(start > 0, `SETUP-VOCABULARY FAIL: ${name} could not be located in ${SETUP_MODEL_SOURCE}`);
    const end = text.indexOf("\n});", start);
    assert(end > start, `SETUP-VOCABULARY FAIL: ${name} is not closed`);
    return text.slice(start, end);
  };
  const grab = (name) => [...block(name).matchAll(/:\s*'((?:[^'\\]|\\.)*)'/g)]
    .map((m) => m[1].replace(/\\(.)/g, "$1")).filter((s) => s.trim() !== "");
  const copy = grab("COPY");
  const validation = grab("VALIDATION");
  const refusals = grab("REFUSAL_SENTENCES");
  assert(copy.length >= 30, `SETUP-VOCABULARY FAIL: only ${copy.length} first-run sentences harvested`);
  assert(refusals.length >= 5, `SETUP-VOCABULARY FAIL: only ${refusals.length} refusal sentences harvested`);
  return { copy, validation, refusals, source: text };
}
/* Every module that can put a first-run word on the screen, joined. */
const setupSource = (root = ROOT) => SETUP_SOURCES
  .map((name) => fs.readFileSync(path.join(root, "rebuild/m3/w7-preview/today", name), "utf8")).join("\n");
/* Every harvested sentence must be PRESENT IN A VIEW SOURCE, so a sentence cannot be
   declared here and then quietly dropped from the screens, and the first-run screen
   must be in the shipped template at all.

   A4 NO LONGER SCANS FOR DASHES HERE. It did, before P1 merged: three loops over
   ./plain-copy.cjs's two characters, one on the harvested sentences, one on A4's own
   source files and one on the `t-setup` section. P1 (DECISIONS:121) now owns that
   refusal for the WHOLE page and owns it better: `assertNoAiDashesInAssets` scans the
   BUILT bytes - every byte of the HTML and CSS outside a comment, and every JS string
   literal whose esbuild banner attributes it to `rebuild/m3/w7-preview/today/`, which
   is exactly where A4's five setup modules live - and `build.mjs` refuses
   AI_DASH_IN_BUILD, plus AI_DASH_GUARD_BLIND if the banners it attributes by are
   missing. A second, narrower, source-level scan beside it would be a second
   mechanism to keep in step for no added coverage (PM to C 20:46: A4 verifies, it
   does not re-author). A4's own suite still asserts the BEHAVIOUR - no dash in its
   sentences, its sources or its rendered DOM, and the build refusing when one is put
   back - which is what proves P1's mechanism really covers these screens.

   There is deliberately NO "absent from the approved references" clause, which is the
   clause PREVIEW_RUNTIME_COPY carries. That clause exists to stop a builder smuggling
   approved-looking words into a preview-owned list. It has nothing to bite on here:
   the approved 2026-09-08 design has no first-run screen at all, so every one of
   these sentences is preview-owned by construction, and the words that do overlap
   with the approved design are the ones that SHOULD ("Earned", "Next", "Back"). */
function assertSetupBinding(approved, templateHtml, root = ROOT) {
  const vocabulary = setupVocabulary(root);
  const source = setupSource(root);
  for (const line of [...vocabulary.copy, ...vocabulary.validation, ...vocabulary.refusals]) {
    assert(source.includes(line), `SETUP-BINDING FAIL: declared first-run copy missing from the view: "${line}"`);
  }
  const start = templateHtml.indexOf('<template id="t-setup">');
  assert(start > 0, "SETUP-BINDING FAIL: the first-run screen is not in the shipped template");
  return { copy: vocabulary.copy.length, validation: vocabulary.validation.length,
    refusals: vocabulary.refusals.length };
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
    for (const line of [...RUNTIME_COPY, ...CHECKIN_RUNTIME_COPY]) {
      assert(approvedText.includes(line), `COPY-BINDING FAIL: declared runtime copy missing upstream: "${line}"`);
      assert(appSource.includes(line), `COPY-BINDING FAIL: declared runtime copy missing from the view: "${line}"`);
    }
    for (const line of PREVIEW_RUNTIME_COPY) {
      assert(!approvedText.includes(line),
        `COPY-BINDING FAIL: preview-owned runtime copy is in the approved references and must be declared approved: "${line}"`);
      assert(appSource.includes(line), `COPY-BINDING FAIL: declared preview runtime copy missing from the view: "${line}"`);
    }
  }
  // The design of record's numbers are fictional. None of them may be copied.
  for (const line of textOf(templateHtml)) {
    assert(!/\d/.test(line), `NO-NUMBERS FAIL: the template carries a literal figure: "${line}"`);
  }
  /* A3 review F1: the recovery screen's whole vocabulary, harvested from the approved
     bytes rather than listed — placeholders included, which the text-node checks above
     cannot see. */
  const recovery = assertRecoveryBinding(approved, templateHtml);
  /* A4 — the first-run screens' own vocabulary, harvested from the one module
     that owns it, and the owner's no-dash rule applied to every sentence of it. */
  const setup = assertSetupBinding(approved, templateHtml);
  return { classes: used.size, recovery, setup, copy: PREVIEW_COPY.length + APPROVED_COPY.length
    + (appSource === undefined ? 0 : RUNTIME_COPY.length + CHECKIN_RUNTIME_COPY.length + PREVIEW_RUNTIME_COPY.length) };
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
/* Every module that can put a word on the screen. A2 adds the gym card's view and
   its adapter, so the copy binding covers the gym screens exactly as it covers
   Today's. */
const VIEW_SOURCES = Object.freeze(["today-app.cjs", "gym-app.mjs", "gym-model.mjs", "today-model.cjs",
  /* A3 — the check-in's view and its answer model, so every word the check-in can put
     on screen is bound exactly as Today's and the gym card's are. */
  "checkin-app.mjs", "checkin-model.mjs"]);
/* A4 — Dad's first run: the six screens' view and the module that owns every word
   on them. They are their OWN list rather than two more VIEW_SOURCES entries
   because VIEW_SOURCES is pinned by name in test/design.test.cjs, which A4 does
   not own; assertSetupBinding reads these two itself and binds them just as
   tightly. today-app.cjs, which carries the landing tile's one word, is already
   a VIEW_SOURCE. */
const SETUP_SOURCES = Object.freeze(["setup-app.mjs", "setup-model.mjs", "today-app.cjs"]);
const templateHtml = () => fs.readFileSync(path.join(SOURCE, "screens.template.html"), "utf8");
const appSource = () => VIEW_SOURCES.map((name) => fs.readFileSync(path.join(SOURCE, name), "utf8")).join("\n");
const chromeCss = () => fs.readFileSync(path.join(SOURCE, "preview.css"), "utf8");
const shellHtml = () => fs.readFileSync(path.join(SOURCE, "index.shell.html"), "utf8");

module.exports = {
  ROOT, SOURCE, APPROVED, FONTS, FONT_DIR, PREVIEW_CLASSES, RUNTIME_CLASSES, PREVIEW_COPY, APPROVED_COPY, RUNTIME_COPY,
  CHECKIN_RUNTIME_COPY, PREVIEW_RUNTIME_COPY, VIEW_SOURCES,
  readApproved, readFonts, fontFaceCss, assertDesignBinding, composeStyles, textOf, classTokens, sha256,
  recoverySection, recoveryVocabulary, assertRecoveryBinding,
  setupVocabulary, assertSetupBinding, setupSource,
  SETUP_MODEL_SOURCE, SETUP_SOURCES,
  headlineVocabulary, ENGINE_DIR,
  templateHtml, appSource, chromeCss, shellHtml,
};
