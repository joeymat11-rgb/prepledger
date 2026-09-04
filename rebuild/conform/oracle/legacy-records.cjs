/* oracle/legacy-records.cjs — projects the DEPLOYED engine's migrated state into the RECORDS DTO (census v2).
   The DTO is semantic: what the athlete recorded, per class, canonically ordered — never internal fields.
   A candidate engine implements records(state) → this exact DTO from its own representation. */
const num = (x) => (x == null || x === "" ? null : (typeof x === "number" ? x : Number(x)));
const sortBy = (arr, f) => arr.slice().sort((a, b) => (f(a) < f(b) ? -1 : f(a) > f(b) ? 1 : 0));
function records(s) {
  const reads = sortBy((s.reads || []).map((r) => ({ date: String(r.d), lb: num(r.w), note: String(r.note || ""), sealed: !!r.sealed, morning: r.morning == null ? null : !!r.morning, attested: r.attested == null ? null : !!r.attested })), (r) => r.date + "|" + r.lb);
  const foodDays = sortBy(Object.entries(s.dailyLogs || {}).map(([d, v]) => ({ date: String(d), kcal: num(v && v.cal), protein_g: num(v && v.pro), steps: num(v && v.steps) })), (x) => x.date);
  const nights = sortBy(Object.values((s.sleep && s.sleep.nights) || {}).map((n) => ({ date: String(n.d), hours: num(n.h), quality: n.q == null ? null : num(n.q) })), (x) => x.date);
  const sessions = sortBy(Object.entries(s.sessionLog || {}).map(([d, v]) => ({ date: String(d), entries: sortBy(((v && v.entries) || []).map((e) => ({ id: String(e.id), load: num(e.w), reps: (e.reps || []).map(num), rir: e.rir == null ? null : num(e.rir), rirSets: (e.rirSets || []).map((x) => (x == null ? null : num(x))) })), (e) => e.id) })), (x) => x.date);
  const lifts = sortBy((s.exercises || []).map((e) => ({ id: String(e.id), name: String(e.n || ""), muscle: String(e.mg || ""), day: String(e.day || ""), load: num(e.w), inc: num(e.inc), sets: num(e.sets), hi: num(e.hi), lo: num(e.lo), retired: !!(s.retirements && s.retirements[e.id]), renames: (e.renames || []).map((r) => ({ prevN: String(r.prevN || ""), at: String(r.at || "") })), forks: (e.forks || []).map((f) => ({ prevN: String(f.prevN || ""), from: String(f.from || ""), kind: String(f.kind || "") })), last: e.last ? { date: String(e.last.d || ""), load: num(e.last.w), reps: (e.last.reps || []).map(num) } : null })), (x) => x.id);
  const queue = sortBy((s.queue || []).map((q) => ({ id: String(q.id || ""), kind: String(q.kind || ""), exId: String(q.exId || ""), newW: num(q.newW), newWSets: Array.isArray(q.newWSets) ? q.newWSets.map(num) : null, done: !!q.done, state: String(q.state || ""), gate: String(q.gate || ""), rule: String(q.rule || ""), text: String(q.t || "") })), (x) => x.kind + "|" + x.id);
  const feed = sortBy((s.feed || []).map((f) => ({ date: String(f.d || ""), text: String(f.t || ""), how: String(f.how || ""), op: String(f.op || "") })), (x) => x.date + "|" + x.text + "|" + x.op);
  /* VOLUME RECEIPTS parsed from the feed — engine-independent, so volume-delta EFFECTS are censused without a private helper */
  const volumeReceipts = sortBy((s.feed || []).filter((f) => f && typeof f.t === "string" && f.t.indexOf("VOLUME ") === 0).map((f) => { const m = /^VOLUME ([+\-\u2212])(\d+) — (.*?) via (.*?) \(now (\d+) sets\)$/.exec(f.t) || []; return { date: String(f.d || ""), sign: m[1] === "+" ? 1 : m[1] ? -1 : 0, magnitude: num(m[2]), muscle: String(m[3] || ""), via: String(m[4] || ""), nowSets: num(m[5]), raw: String(f.t) }; }), (x) => x.date + "|" + x.raw);
  const sightings = sortBy((s.exercises || []).map((e) => ({ id: String(e.id), topAt: num(e.topAt), topRun: num(e.topRun) })), (x) => x.id);
  const events = sortBy((s.events || []).map((e) => ({ date: String(e.d || e.date || ""), type: String(e.type || e.kind || ""), label: String(e.label || e.t || "") })), (x) => x.date + "|" + x.type);
  const waist = sortBy((s.waist || []).map((w) => ({ date: String(w.d || ""), cm: num(w.cm), inches: num(w.in) })), (x) => x.date);
  const plan = { planGen: num(s.planGen), exOrder: Object.fromEntries(Object.entries(s.exOrder || {}).sort().map(([k, v]) => [k, (v || []).map(String)])), split: s.split == null ? null : JSON.parse(JSON.stringify(s.split)), retirements: Object.keys(s.retirements || {}).sort() };
  return { reads, foodDays, nights, sessions, lifts, queue, feed, volumeReceipts, sightings, events, waist, plan };
}
module.exports = { records };
