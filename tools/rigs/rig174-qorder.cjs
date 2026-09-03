const fs = require("node:fs"); const JP = JSON.stringify, clP = (x) => JSON.parse(JP(x));
const T = require("/tmp/rig174/engine-fix4b.cjs").__test;
const RAW = JSON.parse(fs.readFileSync("/tmp/rig174/live.json", "utf8"));
const m = T.migrate(clP(RAW)); delete m._dictionary;
const A = clP(m), B = clP(m);
A.queue.push({ id: "q_x_test", kind: "info", exId: "press", t: "X", done: false });
B.queue.push({ id: "q_y_test", kind: "info", exId: "curl", t: "Y", done: false });
const ab = T.mergeState(clP(A), clP(B)), ba = T.mergeState(clP(B), clP(A));
const ids = (s) => s.queue.map((q) => q.id);
const same = JP(ids(ab)) === JP(ids(ba)), sameSorted = JP(ids(ab).slice().sort()) === JP(ids(ba).slice().sort());
const bodySame = JP(ab.queue.slice().sort((p, q) => p.id < q.id ? -1 : 1)) === JP(ba.queue.slice().sort((p, q) => p.id < q.id ? -1 : 1));
console.log("queue length", ab.queue.length, ba.queue.length, "| order agrees:", same, "| same set:", sameSorted, "| sorted bodies byte-identical:", bodySame);
console.log("ab tail:", JP(ids(ab).slice(-3)), "ba tail:", JP(ids(ba).slice(-3)));
/* settles next sync: merge the two results with each other in both orders */
const s1 = T.mergeState(clP(ab), clP(ba)), s2 = T.mergeState(clP(ba), clP(ab));
console.log("after one more sync — order agrees:", JP(ids(s1)) === JP(ids(s2)), "| both equal ab:", JP(ids(s1)) === JP(ids(ab)), "| both equal ba:", JP(ids(s1)) === JP(ids(ba)));
