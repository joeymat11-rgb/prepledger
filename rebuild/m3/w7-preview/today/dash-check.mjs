// dash-check.mjs — the owner's no-dashes rule (DECISIONS:114 (1)) asserted against a
// REAL browser's rendered DOM, so the three existing checks can each apply it at every
// screen state they already walk (P1 brief, acceptance bar item 1).
//
// It is not part of the page: nothing imports it from the bundle, and browser-check.mjs,
// gym-check.mjs and checkin-check.mjs are the only callers. The jsdom half of the same
// rule is test/copy.test.mjs.
import assert from "node:assert/strict";

// Everything a person can actually read: the text nodes, the attributes a browser paints,
// and the tab title.
const ATTRIBUTES = ["placeholder", "title", "aria-label", "alt", "value", "aria-description"];

export async function dashesOnScreen(page, attributes = ATTRIBUTES) {
  return page.evaluate((names) => {
    const dash = /[–—]/;
    const found = [];
    const root = document.body;
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walk.nextNode(); node; node = walk.nextNode()) {
      const value = node.nodeValue || "";
      if (value.trim() && dash.test(value)) found.push("text: " + value.trim().slice(0, 120));
    }
    for (const element of root.querySelectorAll("*")) {
      for (const name of names) {
        const value = element.getAttribute(name);
        if (value && dash.test(value)) found.push(name + ': "' + value.slice(0, 120) + '"');
      }
    }
    if (dash.test(document.title)) found.push("document.title: " + document.title);
    return found;
  }, attributes);
}

/* Called after every state the check reaches. `where` names the state so a failure says
   which screen carried the character. */
export async function assertNoDashOnScreen(page, where) {
  const found = await dashesOnScreen(page);
  assert.equal(found.length, 0,
    "AI DASH ON SCREEN (" + where + "), DECISIONS:114: " + found.slice(0, 3).join(" | "));
  return where;
}
