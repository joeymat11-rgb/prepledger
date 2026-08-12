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
import esbuild from "esbuild";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/* "/*" joins the banned list after the design round: a JSX annotation written as a
   BARE block comment inside JSX children renders as literal text — it shipped on the
   app's front door (EAT TODAY carried its own source comment in serif). One string
   here closes the whole class. */
/* "THIS TAB HIT AN ERROR" joins the list after round 6 stage 2: a room that renders
   its OWN ERROR BOUNDARY still has text, still has tappables, and still passed this
   walk as "alive" — the EVIDENCE room was dead on the live ledger while the gate
   reported green. The boundary headline is the tell; one string closes the class. */
const BANNED = ["RIR —", "undefined", "NaN", "[object Object]", "/*", "THIS TAB HIT AN ERROR"];
/* The rail is NOW / TRAIN / LEDGER (R15a), and the four rooms he rarely opens live one
   predictable tap behind LEDGER — static demotion, never adaptive, because an
   interface that rearranges itself measured ~8% SLOWER than one that does not
   (Findlater & McGrenere, CHI 2004). This smoke must still walk every room in
   every state: demoting a screen must never mean it stops being exercised.
   PRIMARY are reachable from the bar; BEHIND_MORE need LEDGER clicked first. */
const PRIMARY = ["NOW", "TRAIN"];
const BEHIND_MORE = ["WHAT'S NEXT", "BODY", "SLEEP", "EVIDENCE", "HISTORY", "SETTINGS & DATA"]   /* R6 — DECISIONS left the door list: it is the hub CARD, walked by openBriefing */;   /* R15b — the classic NOW, moved not stranded */
const TABS = [...PRIMARY, ...BEHIND_MORE];
const MIN = { NOW: 300, TRAIN: 150, "WHAT'S NEXT": 200, BODY: 250, SLEEP: 250, EVIDENCE: 200, HISTORY: 120, "SETTINGS & DATA": 120 }   /* R6 — renamed WITH the walk: an unknown key silently disables the floor */;

const bundle = fs.readFileSync(await buildForTests(), "utf8");

/* THE CENSUS PROBE — the same engine the room renders from, reachable from node so the
   FINDINGS assertion can be an EQUIVALENCE (census === DOM) instead of a hand-written
   count. Same pattern the contrast auditor uses for the palettes. */
const R6ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const R6OUT = join(R6ROOT, ".tmp", "lab-probe.cjs");
await esbuild.build({
  entryPoints: [join(R6ROOT, "tools", "_lab-probe.jsx")],
  bundle: true, platform: "node", jsx: "automatic", loader: { ".jsx": "jsx" },
  outfile: R6OUT, absWorkingDir: R6ROOT, logLevel: "silent",
});
const r6req = createRequire(import.meta.url);
delete r6req.cache[R6OUT];
const { labStatusList: censusOf } = r6req(R6OUT);

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
    const more = await findClickable(window, "LEDGER", (b) => b.tagName === "BUTTON" && b.textContent.trim().startsWith("PROGRESS"));
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

/* R15b — walk to the classic NOW (LEDGER -> DECISIONS), where NOW_DOORS' Groups
   and the approval inbox now mount. Two taps, exactly as he would make them. */
async function openBriefing(window) {
  const led = await findClickable(window, "LEDGER", (b) => b.tagName === "BUTTON" && b.textContent.trim().startsWith("PROGRESS"));
  if (!led) throw new Error("LEDGER tab button missing");
  led.click();
  await new Promise((r) => setTimeout(r, 80));
  /* role-scoped: an ancestor card's textContent also startsWith the row title — the same
     trap tabText's length cap guards; role=button pins the actual tappable row. */
  /* R6 — the decisions surface is reached from the hub CARD now, not a door row: the
     card carries the intent in its accessible label, which is a stabler handle than
     matching card text that changes with the first pending proposal. */
  const room = await findClickable(window, "the decisions card", (b) => b.getAttribute && b.getAttribute("aria-label") === "Open decisions");
  if (!room) throw new Error("DECISIONS row missing — the classic NOW is stranded");
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
  for (const m of checkDoors(w, "now.", "DECISIONS")) { console.error("RENDER-SMOKE: " + m); failed++; }
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
  if (!(w.document.body.textContent || '').includes('DECISIONS')) {
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
  /* M5b — every owed action names its own date ("Save Tue 8/11"), night row and day row
     alike: a context-free verb over three unlabelled numbers was the defect. The pin
     counts by PREFIX so it proves the symmetry instead of the old bare word. */
  const saves = [...w.document.querySelectorAll("button")].filter((b) => /^Save /.test((b.textContent || "").trim())).length;
  if (saves < 2) { console.error("RENDER-SMOKE owed: expected inline Save controls on the debt rows, found " + saves); failed++; }
  if (/night(s)? dark/.test(t1) && /OWED — /.test(t2) && saves >= 2) console.log("RENDER-SMOKE owed: the FIVE says dark and the + answers " + (t2.match(/OWED — (\d+)/) || [])[1] + " owed items inline");
}
if (failed) {
  console.error(`RENDER-SMOKE: ${failed} failures`);
  process.exit(1);
}
/* M3 — THE FIXED-CHROME CLEARANCE, enforced as arithmetic. jsdom has no layout engine
   (every getBoundingClientRect is zero), so a true pixel-intersection test belongs to a
   browser rig — stated plainly rather than faked here. What CAN be enforced, and is what
   actually guarantees the clearance: one constant owns the fixed zone, the resume bar
   sits inside it, and every scroll surface reserves exactly it. If any of those three
   drift apart, cards scroll under fixed UI again — and this fails. */
{
  const src = fs.readFileSync(new URL("../src/app.jsx", import.meta.url), "utf8");
  const need = (p, why) => { if (src.indexOf(p) === -1) { console.error("RENDER-SMOKE FAIL [chrome] " + why); process.exit(1); } };
  need("const FIXED_CHROME_H = TAB_BAR_H + CHROME_BAND_H;", "the fixed-chrome zone must be ONE named constant");
  need("14px calc(${FIXED_CHROME_H}px + env(safe-area-inset-bottom))", "the scroll content must reserve exactly the fixed-chrome zone");
  need("bottom: `calc(${TAB_BAR_H}px + env(safe-area-inset-bottom))`", "the resume bar must sit inside the reserved zone, measured from the same constant");
  const band = +(src.match(/const CHROME_BAND_H = (\d+)/) || [])[1];
  const tabH = +(src.match(/const TAB_BAR_H = (\d+)/) || [])[1];
  if (!(band >= 40 && tabH >= 60)) { console.error("RENDER-SMOKE FAIL [chrome] the zone is smaller than the chrome it must cover (band " + band + ", tab " + tabH + ")"); process.exit(1); }
  console.log("RENDER-SMOKE chrome: one reserved fixed zone (" + (tabH + band) + "px), the resume bar inside it, every scroll surface reserving it");
}

/* ROUND 6 — THE HUB BUDGET, enforced in the live DOM. The old hub carried six jobs at
   once (585 words, 23 tappables, 3.3 screens). These are Sol's budgets, adopted as
   TESTS so the surface cannot silently re-bloat: the DOM-countable half runs here; the
   pixel half (<=1.05 viewports) is the browser rig's, because jsdom has no layout. */
{
  const w = await mount();
  const btn = [...w.document.querySelectorAll("button")].find((b) => b.textContent.trim().startsWith("PROGRESS"));
  if (!btn) { console.error("RENDER-SMOKE FAIL [hub] the PROGRESS tab is missing"); process.exit(1); }
  btn.click();
  await new Promise((r2) => setTimeout(r2, 200));
  const root = w.document.querySelector("[data-led='ok']") ? w.document.querySelector("[data-led='ok']").parentElement : w.document.body;
  const txt = (root.textContent || "").trim();
  const words = txt.split(/s+/).filter(Boolean).length;
  const taps = root.querySelectorAll("button, [role=button], input, select, textarea").length;
  const heads = root.querySelectorAll("h1,h2,h3,h4").length;
  const fails = [];
  if (words > 120) fails.push("words " + words + " > 120");
  if (taps > 11) fails.push("content tappables " + taps + " > 11");
  if (heads > 7) fails.push("headings " + heads + " > 7");
  if (root.querySelectorAll("[data-led]").length !== 3) fails.push("expected exactly 3 hub blocks (decisions, latest result, doors)");
  for (const banned of ["THEME", "Light reads better", "EXPERT", "every figure on every screen"]) {
    if (txt.indexOf(banned) > -1) fails.push("the hub must not carry: " + banned);
  }
  if (fails.length) { console.error("RENDER-SMOKE FAIL [hub budget] " + fails.join(" · ")); process.exit(1); }
  console.log("RENDER-SMOKE hub: " + words + " words · " + taps + " tappables · " + heads + " headings · 3 blocks — the answer screen holds its budget");
}
/* ROUND 6 — THE ROOM-LANDING BUDGETS, in the live DOM. The hub budget guarded only the
   hub, so the EVIDENCE landing shipped its whole 29-instrument inventory below the six
   doors and both the gate and my report called it clean — a single scroll disproved it.
   Same M3 split as the hub: DOM counts here, viewport pixels on the browser rig. */
{
  const walk = async (label) => {
    const w = await mount();
    const tabBtn = [...w.document.querySelectorAll("button")].find((b) => b.textContent.trim().startsWith("PROGRESS"));
    if (!tabBtn) { console.error("RENDER-SMOKE FAIL [landing] the PROGRESS tab is missing"); process.exit(1); }
    tabBtn.click();
    await new Promise((r2) => setTimeout(r2, 150));
    const door = [...w.document.querySelectorAll("button, [role=button]")].find((b) => b.textContent.trim().startsWith(label));
    if (!door) { console.error("RENDER-SMOKE FAIL [landing] no door for " + label); process.exit(1); }
    door.click();
    await new Promise((r2) => setTimeout(r2, 250));
    return w;
  };
  {
    const w = await walk("EVIDENCE");
    const txt = (w.document.body.textContent || "").trim();
    const words = txt.split(/\s+/).filter(Boolean).length;
    const fails = [];
    for (const banned of ["SPEAKING NOW", "GATHERING", "THE LAB"]) {
      if (txt.indexOf(banned) > -1) fails.push("the landing still renders the label " + banned);
    }
    /* the >3-instrument test: count the room's own instrument rows, which carry the
       status words the inventory prints beside every name */
    const inst = (txt.match(/measured · n=|provisional · |\d+\/\d+ ▸/g) || []).length;
    if (inst > 3) fails.push("the landing lists " + inst + " instruments (max 3)");
    /* THE REAL BUDGET now that the ruling landed: one newest finding + seven doors.
       130 is the spec; the allowance covers the shell chrome the walk also captures (the
       back link, the tab rail, the room title) — named, not hidden. */
    if (words > 175) fails.push("landing words " + words + " > 175 (spec 130 + the shell chrome the walk captures)");
    if (fails.length) { console.error("RENDER-SMOKE FAIL [evidence landing] " + fails.join(" · ")); process.exit(1); }
    /* THE CENSUS EQUIVALENCE — machine-checked, not a hand-written count. Open every
       door that carries census sections and assert that what labStatusList knows is
       exactly what renders. This is the permanent answer to "did the inventory really
       move, or did it just disappear?" — and it earned its keep on its first run: the
       first cut of the section gate dropped four of six sections (47 of 58 instruments)
       and every other test in the suite stayed green. */
    const liveState = JSON.parse(w.localStorage.getItem("prep-ledger-v1") || "{}");
    const census = censusOf(liveState) || [];
    if (census.length < 20) { console.error("RENDER-SMOKE FAIL [findings] the census probe returned " + census.length + " instruments — it is not reading the state the room renders"); process.exit(1); }
    const tap = async (pred, what) => {
      const el = [...w.document.querySelectorAll("button, [role=button], div[tabindex]")].find(pred);
      if (!el) { if (what) { console.error("RENDER-SMOKE FAIL [census] no " + what + " on the landing"); process.exit(1); } return false; }
      el.click();
      await new Promise((r2) => setTimeout(r2, 200));
      return true;
    };
    /* FINDINGS covers speaking + on-file; STILL LEARNING covers provisional + gathering
       + later. GATHERING caps at the closest five behind its own toggle, so the walk
       keeps tapping until no "more" remains — reachability is the claim. DATA QUALITY
       is taken LAST and checked separately: it expands the prophet card, and an expanded
       card replaces its own row, which would read as a missing instrument. */
    await tap((b) => b.textContent.trim().startsWith("FINDINGS"), "FINDINGS door");
    await tap((b) => b.textContent.trim().startsWith("STILL LEARNING"), "STILL LEARNING door");
    for (let k9 = 0; k9 < 4; k9++) { if (!(await tap((b) => /more gathering/.test(b.textContent || "")))) break; }
    /* THE EQUIVALENCE, counted. Every census entry renders as exactly one row (or one
       expanded card) — data-lab-row / data-lab-card exist for this and nothing else,
       because the R15i row law prints only the head of a name, so a title match reads
       eleven live instruments as missing. MODEL sits behind DATA QUALITY, taken next. */
    const seen = new Set([...w.document.querySelectorAll("[data-lab-row],[data-lab-card]")].map((el) => el.getAttribute("data-lab-row") || el.getAttribute("data-lab-card")));
    const missing = census.filter((c) => c.status !== "MODEL" && !seen.has(c.id)).map((c) => c.status + " · " + c.t);
    if (missing.length) { console.error("RENDER-SMOKE FAIL [census] " + missing.length + " of " + census.length + " instruments the census knows have NO row behind any door — they left the app: " + missing.slice(0, 8).join(" | ")); process.exit(1); }
    const orphan = [...seen].filter((id) => id && !census.some((c) => c.id === id));
    if (orphan.length) { console.error("RENDER-SMOKE FAIL [census] " + orphan.length + " rows render that the census does not know: " + orphan.slice(0, 5).join(" | ")); process.exit(1); }
        await tap((b) => b.textContent.trim().startsWith("DATA QUALITY"), "DATA QUALITY door");
    const seen2 = new Set([...w.document.querySelectorAll("[data-lab-row],[data-lab-card]")].map((el) => el.getAttribute("data-lab-row") || el.getAttribute("data-lab-card")));
    const mMiss = census.filter((c) => c.status === "MODEL" && !seen2.has(c.id)).map((c) => c.t);
    if (mMiss.length) { console.error("RENDER-SMOKE FAIL [census] the sandbox models do not render behind DATA QUALITY: " + mMiss.join(" | ")); process.exit(1); }
        console.log("RENDER-SMOKE census: ROW COUNT === labStatusList — all " + census.length + " instruments render behind the three census doors, none dropped, none invented");
        console.log("RENDER-SMOKE evidence: " + words + " words · " + inst + " instruments on the landing · the inventory labels stay behind their doors");
  }
  {
    const w = await walk("SETTINGS & DATA");
    const txt = (w.document.body.textContent || "").trim();
    if (txt.indexOf("THIS TAB HIT AN ERROR") > -1) { console.error("RENDER-SMOKE FAIL [settings] the room renders its error boundary"); process.exit(1); }
    if (txt.indexOf("THEME") === -1) { console.error("RENDER-SMOKE FAIL [settings] the theme control did not travel with the room"); process.exit(1); }
    console.log("RENDER-SMOKE settings: alive, and the theme control works from its new home");
  }
}

console.log("RENDER-SMOKE: all tabs alive in all states — no silent fallbacks");
process.exit(0);

