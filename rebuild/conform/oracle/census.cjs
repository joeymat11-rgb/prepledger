/* PORT ORACLE — the DERIVED-TRUTH CENSUS, version 2 (a VERSIONED SEMANTIC DTO; Sol suite-pass-1 port objections 1–5).
   census(T, raw) → { censusVersion: 2, required: {...}, optional: {...} }.
   REQUIRED (compared byte-identical after normalization; nothing internal):
     source        { schemaAccepted }                       — the SOURCE schema the candidate accepted (59/60 …); the candidate's
                                                              INTERNAL schema is NOT censused (objection 2)
     records       semantic projections of every athlete record class after migrate — reads, food-days, sleep nights,
                   sessions (every set, every rir), lifts INCLUDING inactive ones, queue items, plan provenance
                   (planGen, exOrder), events, waist — as canonical lists, so a candidate that rewrote a reading,
                   a set or a retired lift while preserving counts is caught (objection 5)
     counts        record counts before/after migrate (nothing lost)
     lifts         per ACTIVE lift: name, load, sets, gym-card targets (rep integers)
     energy        calorieTarget / cutRateBand / calorieFloor / proteinTarget / observedTDEE / currentRate / regime,
                   numbers normalized to the precision the face shows (kcal integer, lb/wk 0.01, g integer, %BW 0.01)
     progression   progressionTrend summary (per-lift n, pct 0.001, lo/hi 0.001) — called, not merely advertised (objection 1)
     today         trend (0.1 lb), phase (string), statusFace {word, cause}, statusTarget {key, id, label} (objection 3)
   OPTIONAL (reported, never compared): internal schema, deriveSighting tops, _volDeltas, adapter-private helpers.
   LEGACY MAPPING: the deployed engine exposes raw state; oracle/legacy-records.cjs projects it into the records DTO.
   A candidate exposes records(state) → the same DTO (its internal representation is its own). */
const JP = JSON.stringify, clP = (x) => JSON.parse(JP(x));
const CENSUS_VERSION = 3;
const r1 = (x) => (typeof x === "number" && isFinite(x) ? Math.round(x * 10) / 10 : x), r2 = (x) => (typeof x === "number" && isFinite(x) ? Math.round(x * 100) / 100 : x), r3 = (x) => (typeof x === "number" && isFinite(x) ? Math.round(x * 1000) / 1000 : x), ri = (x) => (typeof x === "number" && isFinite(x) ? Math.round(x) : x);
const mapVals = (o, f) => { if (Array.isArray(o)) return o.map((v) => mapVals(v, f)); if (o && typeof o === "object") { const r = {}; for (const k of Object.keys(o).sort()) r[k] = mapVals(o[k], f); return r; } return f(o); };
const pick = (o, keys) => { const r = {}; for (const k of keys) if (o && o[k] !== undefined) r[k] = o[k]; return r; };
const tryCall = (f, ...a) => { try { return f(...a); } catch (e) { return { THREW: String(e && e.message || e).slice(0, 120) }; } };
function counts(s) {
  return { reads: (s.reads || []).length, nights: Object.keys((s.sleep && s.sleep.nights) || {}).length, dailyLogs: Object.keys(s.dailyLogs || {}).length, sessionLog: Object.keys(s.sessionLog || {}).length, sets: Object.values(s.sessionLog || {}).reduce((n, d) => n + ((d && d.entries) || []).reduce((m, e) => m + ((e && e.reps) || []).length, 0), 0),
    exercises: (s.exercises || []).length, queue: (s.queue || []).length, feed: (s.feed || []).length, earned: (s.feed || []).filter((f) => f && / EARNED$/.test(String(f.t || ""))).length, debuts: (s.queue || []).filter((q) => q && q.kind === "debut").length, pendingDebuts: (s.queue || []).filter((q) => q && q.kind === "debut" && !q.done).length, volume: (s.feed || []).filter((f) => f && String(f.t || "").indexOf("VOLUME ") === 0).length, events: (s.events || []).length, waist: (s.waist || []).length };
}
const legacyRecords = require("./legacy-records.cjs").records;
function census(T, raw) {
  const s = T.migrate(clP(raw));
  const rec = typeof T.records === "function" ? T.records(s) : legacyRecords(s); const rawRec = legacyRecords(raw);
  /* MIGRATION BINDING: the source schema is bound to what migration actually DID to each record class (a count of differing DTO entries) */
  const changed = {}; for (const k of Object.keys(rec)) { const a = JP(rawRec[k]), b = JP(rec[k]); changed[k] = a === b ? 0 : (Array.isArray(rec[k]) ? Math.abs(rec[k].length - (rawRec[k] || []).length) + rec[k].filter((x, i) => JP(x) !== JP((rawRec[k] || [])[i])).length : 1); }
  const req = { censusVersion: CENSUS_VERSION, migration: { sourceSchema: raw.v, recordsChangedByMigrate: changed }, records: rec, rawCounts: counts(raw), counts: counts(s), lifts: {}, energy: {}, progression: {}, today: {} };
  const opt = { internalSchema: s.v, records: {}, volDeltas: {}, absent: [] };
  for (const ex of (s.exercises || [])) {
    if (!T.exActive(s, ex.id)) continue;
    req.lifts[ex.id] = { name: String(ex.n || ""), load: ex.w == null ? null : r2(Number(ex.w)), sets: ex.sets, targets: mapVals(tryCall(T.targetsFor, ex, s), ri) };
    if (typeof T.deriveSighting === "function") { const d = tryCall(T.deriveSighting, s, ex); opt.records[ex.id] = d && d.THREW ? d : pick(d || {}, ["topAt", "topRun", "top", "at"]); }
    if (typeof T._volDeltas === "function") opt.volDeltas[ex.id] = tryCall(T._volDeltas, ex, s);
  }
  const ct = tryCall(T.calorieTarget, s);
  req.energy.calorieTarget = mapVals(pick(ct, ["gated", "from", "lo", "hi", "mid", "tdee", "floor", "floorSoft", "wkAvg", "wkN", "phaseLo", "phaseHi", "floorHit", "floorBinds"]), ri); req.energy.calorieTarget.band = mapVals(ct && ct.band, r2);
  req.energy.cutRateBand = mapVals(pick(tryCall(T.cutRateBand, s), ["mode", "pct", "band", "floor", "redline"]), r2);
  req.energy.calorieFloor = mapVals(pick(tryCall(T.calorieFloor, s), ["floor", "soft", "eee"]), ri); req.energy.calorieFloor.ffmKg = r1(tryCall(T.calorieFloor, s).ffmKg);
  const pt = tryCall(T.proteinTarget, s); req.energy.proteinTarget = { ...mapVals(pick(pt, ["g", "lo", "hi", "floor"]), ri), perKg: r2(pt.perKg), ffmKg: r1(pt.ffmKg), bf: r3(pt.bf) };
  const ot = tryCall(T.observedTDEE, s); req.energy.observedTDEE = { ...mapVals(pick(ot, ["tdee", "days", "avg", "lo", "hi", "from", "to"]), ri), method: ot.method, rate: r2(ot.rate), rateCi: mapVals(ot.rateCi, r2), perLb: r1(ot.perLb) };
  req.energy.currentRate = mapVals(tryCall(T.currentRate, s), r2); req.energy.regime = tryCall(T.regime, s);
  const pr = tryCall(T.progressionTrend, s); req.progression = pr && pr.THREW ? pr : { nLifts: pr.nLifts, excludedIds: (pr.excludedIds || []).slice().sort(), setAsideDays: (pr.setAsideDays || []).slice().sort(), lifts: (pr.lifts || []).map((l) => ({ id: l.id, n: l.n, nSoft: l.nSoft, pct: r3(l.pct), lo: r3(l.lo), hi: r3(l.hi) })).sort((a, b) => (a.id < b.id ? -1 : 1)) };
  const sf = tryCall(T.statusFace, s), st = tryCall(T.statusTarget, s);
  req.today = { trend: r1(s.trend), phase: String(s.phase), statusFace: sf && sf.THREW ? sf : (sf ? { word: String(sf.word), cause: String(sf.cause) } : null), statusTarget: st && st.THREW ? st : (st ? { key: String(st.key), id: String(st.id), label: String(st.label) } : null) };
  opt.absent = ["deriveSighting", "_volDeltas", "records"].filter((k) => typeof T[k] !== "function");
  return { censusVersion: CENSUS_VERSION, required: req, optional: opt };
}
function required(c) { return c.required; }
/* every leaf path of the required part — the runner proves the comparison covers each one (perturbation sensitivity) */
function leafPaths(o, p = "", out = []) { if (o && typeof o === "object") { for (const k of Object.keys(o)) leafPaths(o[k], p + "/" + k, out); if (!Object.keys(o).length) out.push(p); } else out.push(p); return out; }
module.exports = { census, counts, required, leafPaths, CENSUS_VERSION };
