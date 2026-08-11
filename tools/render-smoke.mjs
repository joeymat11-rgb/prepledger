// STATE-MATRIX RENDER SMOKE — mounts the real app, walks every tab in three
// states, fails on empty screens or silent-fallback fingerprints.
// The lesson, as machinery.
//
// Portability note: this used to shell out to `npx esbuild` and read
// /tmp/smoke-bundle.js. On Windows, Node resolves "/tmp" to C:\tmp, so the
// read threw ENOENT and this smoke could not run at all on the dev machine.
// It now builds through scripts/build.mjs and writes to the repo's own .tmp.

import fs from "node:fs";
import { JSDOM } from "jsdom";
import { buildForTests } from "../scripts/build.mjs";

const BANNED = ["RIR —", "undefined", "NaN", "[object Object]"];
/* The rail is NOW / TRAIN / LEDGER (R15a), and the four rooms he rarely opens live one
   predictable tap behind LEDGER — static demotion, never adaptive, because an
   interface that rearranges itself measured ~8% SLOWER than one that does not
   (Findlater & McGrenere, CHI 2004). This smoke must still walk every room in
   every state: demoting a screen must never mean it stops being exercised.
   PRIMARY are reachable from the bar; BEHIND_MORE need LEDGER clicked first. */
const PRIMARY = ["NOW", "TRAIN"];
const BEHIND_MORE = ["QUEUE", "BODY", "SLEEP", "LAB", "THE BRIEFING ROOM"];   /* R15b — the classic NOW, moved not stranded */
const TABS = [...PRIMARY, ...BEHIND_MORE];
const MIN = { NOW: 300, TRAIN: 150, QUEUE: 200, BODY: 250, SLEEP: 250, LAB: 200, "THE BRIEFING ROOM": 300 };

const bundle = fs.readFileSync(await buildForTests(), "utf8");

async function mount(mutateState) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    runScripts: "outside-only", pretendToBeVisual: true, url: "https://smoke.local/",
  });
  const { window } = dom;
  window.scrollTo = () => {};
  window.matchMedia = window.matchMedia ||
    (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }));
  if (mutateState) {
    const seedProbe = new JSDOM(`<!doctype html><body><div id="root"></div>`, {
      runScripts: "outside-only", url: "https://smoke.local/",
    }).window;
    seedProbe.scrollTo = () => {};
    seedProbe.matchMedia = window.matchMedia;
    seedProbe.eval(bundle);
    await new Promise((r) => setTimeout(r, 60));
    const raw = seedProbe.localStorage.getItem("prep-ledger-v1");
    if (!raw) throw new Error("seed probe produced no state");
    const st = JSON.parse(raw);
    mutateState(st);
    window.localStorage.setItem("prep-ledger-v1", JSON.stringify(st));
  }
  window.eval(bundle);
  await new Promise((r) => setTimeout(r, 80));
  return window;
}

async function findClickable(window, label, pred) {
  let el = null;
  for (let tries = 0; tries < 40 && !el; tries++) {
    const cands = [...window.document.querySelectorAll("button, [role=button], div")];
    el = cands.find((b) => (pred ? pred(b) : b.textContent.trim().startsWith(label)));
    if (!el) await new Promise((r) => setTimeout(r, 50));
  }
  return el;
}

/* declared ⊆ registered, for ONE tab's worth of doors. `prefix` selects which door keys
   this tab is responsible for; a Group registers only while its tab is mounted, so the
   whole declared set can never be satisfied from a single screen. */
function checkDoors(window, prefix, whereLabel) {
  const declared = window.__plDoors || null;
  if (!declared) return [`window.__plDoors is missing — the door invariant cannot run (${whereLabel})`];
  const live = window.__plGroups || {};
  const mine = Object.values(declared).filter((k) => String(k).startsWith(prefix));
  if (!mine.length) return [`no declared door keys match ${prefix} — the invariant is checking nothing (${whereLabel})`];
  const missing = mine.filter((k) => !(k in live));
  return missing.length ? [`declared door key(s) never registered by a Group on ${whereLabel}: ${missing.join(", ")} — a deep link to one of these would no-op`] : [];
}

async function tabText(window, label) {
  /* Rooms behind LEDGER need two taps, exactly as he would make them. If LEDGER
     itself is missing, that is a real failure and must not be swallowed. */
  if (BEHIND_MORE.includes(label)) {
    const more = await findClickable(window, "LEDGER", (b) => b.tagName === "BUTTON" && b.textContent.trim().startsWith("LEDGER"));
    if (!more) throw new Error("LEDGER tab button missing — the demoted rooms are unreachable");
    more.click();
    await new Promise((r) => setTimeout(r, 60));
  }
  let btn = null;
  for (let tries = 0; tries < 40 && !btn; tries++) {
    btn = [...window.document.querySelectorAll("button, div")]
      .find((b) => b.textContent.trim().startsWith(label) && b.textContent.trim().length < 400);
    if (!btn) await new Promise((r) => setTimeout(r, 50));
  }
  if (!btn) throw new Error("tab entry missing after wait: " + label);
  btn.click();
  return new Promise((r) =>
    setTimeout(() => r(window.document.getElementById("root").textContent || ""), 60));
}

/* R15b — walk to the classic NOW (LEDGER -> THE BRIEFING ROOM), where NOW_DOORS' Groups
   and the approval inbox now mount. Two taps, exactly as he would make them. */
async function openBriefing(window) {
  const led = await findClickable(window, "LEDGER", (b) => b.tagName === "BUTTON" && b.textContent.trim().startsWith("LEDGER"));
  if (!led) throw new Error("LEDGER tab button missing");
  led.click();
  await new Promise((r) => setTimeout(r, 80));
  /* role-scoped: an ancestor card's textContent also startsWith the row title — the same
     trap tabText's length cap guards; role=button pins the actual tappable row. */
  const room = await findClickable(window, "THE BRIEFING ROOM", (b) => b.getAttribute && b.getAttribute("role") === "button" && b.textContent.trim().startsWith("THE BRIEFING ROOM"));
  if (!room) throw new Error("THE BRIEFING ROOM row missing — the classic NOW is stranded");
  room.click();
  await new Promise((r) => setTimeout(r, 250));
}

const todayISO = (() => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
         String(d.getDate()).padStart(2, "0");
})();

const states = [
  ["fresh", null],
  ["logged-today", (st) => {
    st.sessionLog[todayISO] = {
      entries: [{ id: "press", reps: [8, 8, 7], rir: 1, w: 245 }],
      at: Date.now(), note: "", niggles: [], dips: 0,
    };
  }],
  ["mid-history", (st) => { st.sleep.nights.push({ d: todayISO, h: 8, tags: [] }); }],
];

let failed = 0;
/* R15b — the simplicity budget in the LIVE DOM: exactly five data-now blocks on NOW. */
{
  const w5 = await mount();
  await new Promise((r) => setTimeout(r, 250));
  const nBlocks = w5.document.querySelectorAll("[data-now]").length;
  if (nBlocks !== 5) { console.error("RENDER-SMOKE: NOW renders " + nBlocks + " blocks, the budget is FIVE — accretion is the disease the redesign cures"); failed++; }
  const plus = [...w5.document.querySelectorAll("button")].some((b) => (b.getAttribute("aria-label") || "") === "Quick log");
  if (!plus) { console.error("RENDER-SMOKE: the + capture affordance is missing from NOW"); failed++; }
  w5.close();
}
for (const [name, mut] of states) {
  const w = await mount(mut);
  for (const t of TABS) {
    const txt = await tabText(w, t);
    const hits = BANNED.filter((b) => txt.includes(b));
    if (hits.length) {
      console.error(`RENDER-SMOKE FAIL [${name}/${t}] banned: ${hits.join(", ")}`);
      hits.forEach((b) => {
        let i = txt.indexOf(b);
        while (i > -1) {
          console.error("   ctx: …" + txt.slice(Math.max(0, i - 90), i + 25).replace(/\s+/g, " ") + "…");
          i = txt.indexOf(b, i + 1);
        }
      });
      failed++;
    }
    if (txt.length < MIN[t]) {
      console.error(`RENDER-SMOKE FAIL [${name}/${t}] suspiciously empty (${txt.length} chars)`);
      failed++;
    }
  }
  w.close();
}

/* DOOR-KEY INVARIANT — every door key the app DECLARES must be registered by a mounted
   Group. The deep-link maps name NOW_DOORS / TRAIN_DOORS keys and openGroup looks them up
   in the registry registerGroup populates; if a persistKey drifts, openGroup silently
   no-ops, the door's children never mount, scrollToId finds nothing and the tap dies.
   Asserting the constant against itself cannot catch that; this asserts it against what
   actually mounted, per tab. */
{
  const w = await mount();
  await new Promise((r) => setTimeout(r, 250));
  await openBriefing(w);
  for (const m of checkDoors(w, "now.", "THE BRIEFING ROOM")) { console.error("RENDER-SMOKE: " + m); failed++; }
  // TRAIN's Groups register only while TRAIN is mounted
  try {
    const t = await findClickable(w, "TRAIN", (b) => b.tagName === "BUTTON" && b.textContent.trim().startsWith("TRAIN"));
    if (!t) { console.error("RENDER-SMOKE: TRAIN tab button missing — its doors cannot be checked"); failed++; }
    else {
      t.click();
      await new Promise((r) => setTimeout(r, 300));
      for (const m of checkDoors(w, "train.", "TRAIN")) { console.error("RENDER-SMOKE: " + m); failed++; }
    }
  } catch (e) {
    console.error("RENDER-SMOKE: TRAIN door check threw — " + e.message); failed++;
  }
}

/* and again with the approval inbox mounted, so its door key — statusTarget's
   highest-precedence branch — is covered by the same live check. */
{
  const w = await mount((st) => {
    st.proposals = [{ rid: 'ap_smoke', id: 'ap_smoke_1', d: todayISO, title: 'AUTO-PILOT · EASE THE TARGET', why: 'smoke', apply: { kind: 'cal', delta: 100, dir: 'ease', calDelta: 100, stepsDelta: 0 }, resolved: false }];
  });
  await new Promise((r) => setTimeout(r, 250));
  await openBriefing(w);
  if (!(w.document.body.textContent || '').includes('FOR YOU TO OK')) {
    console.error('RENDER-SMOKE: seeded a proposal but the approval inbox did not mount in the briefing room — its door key cannot be checked');
    failed++;
  } else {
    for (const m of checkDoors(w, "now.", "the briefing room with the inbox mounted")) { console.error("RENDER-SMOKE: " + m); failed++; }
  }
}

/* AUDIT (steppush surface), item 5(4) — PIN THE PRIMARY LABEL for a prefer:"steps" card at
   the render layer. The defect was invisible to every engine test because it lived in the
   items builder's closure: the primary button ran the food cut while the copy promised the
   walk, and the label read "Ease the band" off undefined < 0. Mount the real app with the
   real producer's card shape and read the actual buttons. */
{
  const w = await mount((st) => {
    st.proposals = [{ rid: "steppush_2026-08-03", id: "sp_smoke_1", d: todayISO, title: "UNDER THE CORRIDOR — STEPS FIRST", why: "smoke", apply: { kind: "cal", calDelta: -23, delta: -23, stepsDelta: 1000, prefer: "steps" }, resolved: false }];
  });
  await new Promise((r) => setTimeout(r, 250));
  await openBriefing(w);
  const txt = w.document.body.textContent || "";
  if (!txt.includes("Add the steps — +1,000/day")) {
    console.error("RENDER-SMOKE: prefer:steps card's PRIMARY button is not the walk — expected 'Add the steps — +1,000/day' in the mounted inbox");
    failed++;
  }
  if (!txt.includes("Cut it from food instead (-23 kcal)")) {
    console.error("RENDER-SMOKE: prefer:steps card's ALT button is not the honest food route — expected 'Cut it from food instead (-23 kcal)'");
    failed++;
  }
  if (txt.includes("Ease the band")) {
    console.error("RENDER-SMOKE: 'Ease the band' rendered on a tightening steppush card — the undefined < 0 label defect is back");
    failed++;
  }
}

/* THE LONG-BELT FIXTURE (v7.43.0, the audit word) — the all-done suspects belt at 17+
   rows, reached DETERMINISTICALLY: a draft parked at all-done with every lift touched
   (banked) and no set ever adjusted or asked about, so EVERY set is a suspect. The
   jsdom-honest asserts: every suspect row is IN the DOM (nothing clipped out), the
   finish control is present-and-disabled until ruled, and the all-done column carries
   the one sanctioned overflowY (the S1-evolved law). Pixel reachability stays the rig. */
{
  const w = await mount((st) => {
    st.split = [{ from: "1970-01-01", map: { 0: "U", 1: "U", 2: "U", 3: "U", 4: "U", 5: "U", 6: "U" }, why: "smoke — every day trains" }];
  });
  await new Promise((r) => setTimeout(r, 250));
  const click = (el) => el && el.dispatchEvent(new w.window.MouseEvent("click", { bubbles: true }));
  /* every session lift touched (banked as tapped-through), nothing attested */
  const iso9 = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0") + "-" + String(new Date().getDate()).padStart(2, "0");
  const st9 = JSON.parse(w.localStorage.getItem("prep-ledger-v1"));
  const ids9 = (st9.exercises || []).filter((e) => e.day).map((e) => e.id);
  const touched9 = {}; ids9.forEach((id) => { touched9[id] = true; });
  w.localStorage.setItem("prep-ledger-gymdraft-" + iso9, JSON.stringify({ iso: iso9, idx: 0, setN: 0, phase: "all-done", reps: {}, rir: {}, rirEnd: {}, gskip: {}, touched: touched9, rests: { n: 0, cut: 0 }, restStart: 0, restLen: 0 }));
  click([...w.document.querySelectorAll("button")].find((b) => (b.textContent || "").trim().startsWith("TRAIN")));
  await new Promise((r) => setTimeout(r, 150));
  click([...w.document.querySelectorAll("button")].find((b) => (b.textContent || "").includes("RESUME SESSION")));
  await new Promise((r) => setTimeout(r, 250));
  const rows9 = [...w.document.querySelectorAll("button")].filter((b) => (b.textContent || "").trim() === "I did this").length;
  if (rows9 < 10) { console.error("RENDER-SMOKE long-belt: expected a 10+-row suspects belt, found " + rows9); failed++; }
  const fin9 = [...w.document.querySelectorAll("button")].find((b) => b.disabled && (b.textContent || "").length);
  if (rows9 >= 10 && !fin9) { console.error("RENDER-SMOKE long-belt: no present-and-disabled finish above an unruled belt"); failed++; }
  const belt9 = [...w.document.querySelectorAll("div")].find((d) => d.style && d.style.overflowY === "auto" && (d.textContent || "").includes("NOBODY CONFIRMED THE REPS"));
  if (rows9 >= 10 && !belt9) { console.error("RENDER-SMOKE long-belt: the all-done column lacks its sanctioned overflowY:auto"); failed++; }
  if (rows9 >= 10 && fin9 && belt9) console.log("RENDER-SMOKE long-belt: " + rows9 + "-row belt renders in a scrolling column with finish present-and-disabled");
}
/* THE OWED LEDGER FIXTURE — 2 dark nights + 1 open day (the mandated shape): the FIVE's
   sleep row must say DARK instead of reading clean, and the + sheet must list the debt
   with answerable rows. */
{
  const dAgo = (k) => { const d = new Date(Date.now() - k * 864e5); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const w = await mount((st) => {
    st.sleep.nights = (st.sleep.nights || []).filter((n) => n && n.d !== dAgo(1) && n.d !== dAgo(2));
    for (let k = 3; k <= 5; k++) if (!st.sleep.nights.some((n) => n.d === dAgo(k))) st.sleep.nights.push({ d: dAgo(k), h: 7.5, bed: "23:30", wake: "07:00", tags: [], sol: 10 });
    st.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
    const dl = { ...(st.dailyLogs || {}) };
    delete dl[dAgo(1)];
    st.dailyLogs = dl;
  });
  await new Promise((r) => setTimeout(r, 250));
  const click = (el) => el && el.dispatchEvent(new w.window.MouseEvent("click", { bubbles: true }));
  await openBriefing(w);   /* THE FIVE lives in the briefing room */
  const t1 = w.document.body.textContent || "";
  if (!/night(s)? dark — can't read/.test(t1)) { console.error("RENDER-SMOKE owed: THE FIVE does not say dark over 2 dark nights — absence is reading as clean again"); failed++; }
  click(w.document.querySelector('[aria-label="Quick log"]'));
  await new Promise((r) => setTimeout(r, 200));
  const t2 = w.document.body.textContent || "";
  if (!/OWED — \d+ ITEM/.test(t2)) { console.error("RENDER-SMOKE owed: the + sheet does not lead with the OWED list"); failed++; }
  if (!t2.includes("THE NIGHT OF") || !t2.includes("CLOSE ")) { console.error("RENDER-SMOKE owed: the debt rows (night + day) are not rendered"); failed++; }
  const saves = [...w.document.querySelectorAll("button")].filter((b) => (b.textContent || "").trim() === "Save").length;
  if (saves < 2) { console.error("RENDER-SMOKE owed: expected inline Save controls on the debt rows, found " + saves); failed++; }
  if (/night(s)? dark/.test(t1) && /OWED — /.test(t2) && saves >= 2) console.log("RENDER-SMOKE owed: the FIVE says dark and the + answers " + (t2.match(/OWED — (\d+)/) || [])[1] + " owed items inline");
}
if (failed) {
  console.error(`RENDER-SMOKE: ${failed} failures`);
  process.exit(1);
}
console.log("RENDER-SMOKE: all tabs alive in all states — no silent fallbacks");
process.exit(0);
