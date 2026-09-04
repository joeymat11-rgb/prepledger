/* rig185 — ENGINE-TRACK witnesses executed on the OLD engine (fix4b @ 66bc7c3): Sol's PACK 3 counterexamples.
   These are NOT suite laws; the suite stays consistent while the old engine fails them. Their result feeds FIX-4c.
   Synthetic state: a one-lift ledger grafted on the public preimage's shape. Needs ENGINE_FIX4B. */
const fs = require("node:fs"), path = require("node:path");
const ENGINE = process.env.ENGINE_FIX4B || "/tmp/rig174/engine-fix4b.cjs"; const out = [];
const log = (s) => { out.push(s); console.log(s); };
if (!fs.existsSync(ENGINE)) { log("rig185: ENGINE_FIX4B absent — SKIPPED (engine-track only)"); process.exit(0); }
const T = require(ENGINE).__test; const src = fs.readFileSync(ENGINE, "utf8");
const i = src.indexOf("function _setsAtTime"); const setsAtTime = new Function("return " + src.slice(i, src.indexOf("\n}\n", i) + 2))();
const d = "2026-09-01"; const plus = setsAtTime(4, [[d, 1]], d), minus = setsAtTime(3, [[d, -1]], d), balanced = setsAtTime(4, [[d, 1], [d, -1]], d);
log(`W1 same-day set-count maximum on fix4b: +1 current 4 → ${plus} (required 4) · −1 current 3 → ${minus} (required 4) · balanced +1/−1 current 4 → ${balanced} (required 5) ⇒ ${plus === 4 && minus === 4 ? "PASS" : "FAIL — end-of-day + same-day INCREASES double-counts the push; the maximum is end-of-day + same-day DECREASES"}`);
const base = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/preimage-2026-08-15.json"), "utf8"));
function mk(day1Name) { const s = JSON.parse(JSON.stringify(base)); s.exercises = [{ id: "press", n: "PRESS", w: 250, sets: 3, hi: 10, lo: 6, inc: 5, renames: [{ prevN: "CHEST PRESS", at: "2026-08-20" }], last: { d: "2026-08-25", w: 250, reps: [10, 10, 10] } }]; s.exOrder = {}; s.queue = []; s.sessionLog = { "2026-08-18": { entries: [{ id: "press", w: 250, reps: [10, 10, 10], rir: 2 }] }, "2026-08-25": { entries: [{ id: "press", w: 250, reps: [10, 10, 10], rir: 2 }] } }; s.retirements = {}; s.feed = [{ d: "2026-08-25", t: "PRESS 250 × 10·10·10 — TOP OF WINDOW, PROVISIONAL", op: "x2" }, { d: "2026-08-18", t: day1Name + " 250 × 10·10·10 — TOP OF WINDOW, PROVISIONAL", op: "x1" }]; return s; }
const res = {}; for (const [k, name] of [["former", "CHEST PRESS"], ["current", "PRESS"]]) { const s = T.migrate(mk(name)); const m = T.mergeState(JSON.parse(JSON.stringify(s)), JSON.parse(JSON.stringify(s))); res[k] = { earned: (m.feed || []).filter((f) => / EARNED$/.test(f.t)).length, debuts: (m.queue || []).filter((q) => q.kind === "debut").length, topRun: m.exercises[0].topRun }; }
log(`W2 former-name joint mint on fix4b: day-1 PROVISIONAL under the FORMER name → EARNED ${res.former.earned}, debuts ${res.former.debuts} (topRun ${res.former.topRun}); under the CURRENT name → EARNED ${res.current.earned}, debuts ${res.current.debuts} ⇒ ${res.former.earned === res.current.earned ? "PASS" : "FAIL — _mintJointEarn's lineOn9 matches feed lines by the CURRENT name only (nm9); the sighting derivation already sees both tops"}`);
log(`W3 PACK 3 §6 claim "settles at the next sync": the pack's own transcript reads "after one more sync — order agrees: false" ⇒ the claim is FALSE; queue order stays a REBUILD item (P5 law)`);
fs.writeFileSync(path.join(__dirname, "rig185.log"), out.join("\n") + "\n");
process.exit(0);
