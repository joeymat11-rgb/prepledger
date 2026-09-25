// look-cui2.test.mjs - C-UI-2 static cells for the Today face's own preview.css block.
// Reads bytes only: preview.css (the C-UI-2 BEGIN/END block) and the pinned pack app.css.
// No DOM, no engine, no network. Fix round 2 (review REVIEW-LOOK-C-UI-2-l1 M1, N1).
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const TODAY = path.resolve(import.meta.dirname, "..");
const PREVIEW_CSS = path.join(TODAY, "preview.css");
const PACK_CSS = path.resolve(TODAY, "../../../m1/approved-2026-09-18/app/app.css");

function rules(css) {
  const out = [];
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of bare.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decls = {};
    for (const part of m[2].split(";")) {
      const i = part.indexOf(":");
      if (i > 0) decls[part.slice(0, i).trim()] = part.slice(i + 1).trim();
    }
    for (const sel of m[1].split(",")) out.push({ selector: sel.trim().replace(/\s+/g, " "), decls });
  }
  return out;
}

function cui2Block() {
  const css = fs.readFileSync(PREVIEW_CSS, "utf8");
  const begin = css.indexOf("/* C-UI-2 BEGIN");
  const end = css.indexOf("/* C-UI-2 END */");
  assert(begin >= 0 && end > begin, "preview.css carries one delimited C-UI-2 block");
  return rules(css.slice(css.indexOf("*/", begin) + 2, end));
}

const STACK_HOST = ".scene-frame > .view.ui:has(> .stack)";

test("C-UI-2 M1: the weigh-in sheet paints above the fixed stack inside the chassis host", () => {
  const pack = rules(fs.readFileSync(PACK_CSS, "utf8"));
  const stack = pack.filter((r) => r.selector === ".screen .ui > .stack" && r.decls["z-index"] !== undefined);
  assert.equal(stack.length, 1, "the pinned pack gives the fixed stack exactly one z-index");
  const stackZ = Number(stack[0].decls["z-index"]);
  const preview = rules(fs.readFileSync(PREVIEW_CSS, "utf8"));
  const panel = preview.filter((r) => r.selector === ".sheet-panel" && r.decls.position !== undefined);
  assert.equal(panel.length, 1, "preview.css draws the sheet once");
  assert.equal(panel[0].decls.position, "absolute", "the sheet is positioned, so its z-index applies");
  const lift = cui2Block().filter((r) => r.selector === STACK_HOST + " > .sheet-panel");
  assert.equal(lift.length, 1, "the C-UI-2 block lifts the sheet inside the stack host");
  const sheetZ = Number(lift[0].decls["z-index"]);
  assert(Number.isInteger(sheetZ) && sheetZ > stackZ,
    `the sheet's z-index (${lift[0].decls["z-index"]}) is above the stack's (${stackZ})`);
});

test("C-UI-2 N1: the Start border override leaves the pack's disabled edge standing", () => {
  const pack = rules(fs.readFileSync(PACK_CSS, "utf8"));
  const disabled = pack.filter((r) => r.selector === ".primary:disabled" && r.decls.border !== undefined);
  assert.equal(disabled.length, 1, "the pinned pack draws the disabled Start edge once");
  assert.equal(disabled[0].decls.border, "1px solid var(--line-soft)");
  const primary = cui2Block().filter((r) => /\.primary\b/.test(r.selector));
  assert(primary.length > 0, "the C-UI-2 block still restyles Start");
  for (const r of primary) {
    const touchesBorder = Object.keys(r.decls).some((k) => k === "border" || k.startsWith("border-"));
    if (touchesBorder) assert(r.selector.includes(":not(:disabled)"),
      "a C-UI-2 border rule on Start is scoped away from the disabled state: " + r.selector);
  }
  const weight = primary.filter((r) => r.decls["font-weight"] === "inherit");
  assert.equal(weight.length, 1, "Start still takes the pack's inherited weight");
});
