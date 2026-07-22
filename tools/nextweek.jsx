import { __test } from "../src/app.jsx";
const { genSession, completeSession, SEED } = __test;
const clone = (o) => JSON.parse(JSON.stringify(o));
const clean = { clean: true, run: 3, need: 3, last: { h: 8 } };

// Simulate this week actually happening: Thursday...
const thu = genSession(clone(SEED), "2026-07-23", clean);
const eThu = thu.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow }));
eThu.find(e => e.id === "press").reps = [8, 8, 7];
let { s: s1 } = completeSession(clone(SEED), "2026-07-23", eThu, clean);
// ...then Friday (hack 3rd set, calves reclaimed, extension owned)
const fri = genSession(s1, "2026-07-24", clean);
const eFri = fri.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow }));
eFri.find(e => e.id === "calves").reps = [13, 12, 11, 10];
eFri.find(e => e.id === "extension").reps = [9, 9];
let { s: s2 } = completeSession(s1, "2026-07-24", eFri, clean);

// Now ask the app for NEXT WEEK — nothing pushed, nothing stored, just computed:
const mon = genSession(s2, "2026-07-27", clean);
const tue = genSession(s2, "2026-07-28", clean);
console.log("MON 7/27:", mon.name, "| structural:", mon.structural);
console.log("  rows now:", JSON.stringify(mon.ex.find(e => e.id === "rows")));
console.log("TUE 7/28:", tue.name, "| structural:", tue.structural);
console.log("  calves next:", s2.queue.filter(q => !q.done && q.exId === "calves").map(q => q.t).join(", ") || "—");
console.log("MON 8/3 also exists:", genSession(s2, "2026-08-03", clean).name);
