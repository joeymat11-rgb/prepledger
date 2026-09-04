/* reference/policy.cjs — REFERENCE MODEL of appendix D13 (public protein, MINIMUM by phase) and D14 (public floor,
   30 kcal/kg lean_HIGH + training energy): gates, currency, governing-source reducer, branches, typed formulas,
   quantization, the action_constraint contract, the 3T/3P application rule and the producer precondition.
   NOT the product. The product's binding (adapters/policy.cjs, tranche T4) must reproduce this on the fixture
   matrix. Sheet v1.7.38 appendix v1.37 lines 2156–2330, 2604–2611, 3623–3630. Synthetic. */
const LB_KG = 0.45359237;
const ceil_g = (x, g) => g * Math.ceil(x / g);
const roundHalfAway = (x) => Math.sign(x) * Math.floor(Math.abs(x) + 0.5);
const operativeFloor = (raw, g = 1) => g * (Math.floor(raw / g) + 1);   /* EXCLUSIVE boundary: EA ≤ 30 forbidden */
const daysBetween = (a, b) => Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86400000);
const toKg = (q) => q.unit === "kg" ? q.value : q.unit === "lb" ? q.value * LB_KG : (() => { throw new Error("unit " + q.unit); })();
function create(cfg = {}, hooks = {}) {
  const H = Object.assign({ currency: { measurement: 180, estimate: 90 }, leanFrom: "one-minus-bf", exclusiveBoundary: true, intermediateRounding: false, measurementOverEstimate: true, tieToConflict: true, requirePhase: true, requireRT: true, p2D7: 7, floorOnLeanHigh: true, k: 30, c1: 2.3, c2: 1.6, applyNeeds3T3P: true, zeroNeedsNoProducer: true, fullContract: true, firstLocusOnly: false }, hooks);
  const eval_date = cfg.evaluation_date || "2026-09-04";
  /* ---- lean-source reducer (shared by D13 P1 and D14 gate 2) ---- */
  function currentSources() {
    const out = []; for (const s of cfg.sources || []) { const age = daysBetween(s.effective_date, eval_date); const win = s.kind === "measurement" ? H.currency.measurement : H.currency.estimate; const status = age < 0 ? "LEAN_SOURCE_FUTURE_EFFECTIVE" : age >= win ? "LEAN_SOURCE_STALE" : "CURRENT"; out.push({ ...s, age, status }); } return out;
  }
  function leanInterval(s) {
    if (s.quantity === "lean_mass") return { low: toKg(s.low), high: toKg(s.high), point: s.point ? toKg(s.point) : undefined };
    const w = s.linked_weight ? toKg(s.linked_weight) : s.attested_total_mass ? toKg(s.attested_total_mass) : null; if (w == null) return null;
    const r = H.intermediateRounding ? (x) => Math.round(x * 1000) / 1000 : (x) => x;
    return H.leanFrom === "one-minus-bf" ? { low: r(w * (1 - s.bf_high)), high: r(w * (1 - s.bf_low)), point: s.bf_point == null ? undefined : r(w * (1 - s.bf_point)) } : { low: w * s.bf_low, high: w * s.bf_high, point: s.bf_point == null ? undefined : w * s.bf_point };
  }
  const equivKey = (s) => JSON.stringify([s.quantity, s.low, s.high, s.point || null, s.bf_low, s.bf_high, s.bf_point == null ? null : s.bf_point, s.provenance, s.linked_weight_op_id || null, s.attested_total_mass || null]);
  function governingSource() {
    const cur = currentSources(); if (!cur.length) return { code: "LEAN_SOURCE_NONE" };
    const current = cur.filter((s) => s.status === "CURRENT"); if (!current.length) { const c = cur.some((s) => s.status === "LEAN_SOURCE_FUTURE_EFFECTIVE") ? "LEAN_SOURCE_FUTURE_EFFECTIVE" : "LEAN_SOURCE_STALE"; return { code: c, copy: c === "LEAN_SOURCE_STALE" ? "Refresh your body-composition source" : "This entry is dated in the future — correct its date" }; }
    const unpaired = current.filter((s) => s.quantity !== "lean_mass" && !s.linked_weight && !s.attested_total_mass); const paired = current.filter((s) => !unpaired.includes(s)); if (!paired.length) return { code: "LEAN_SOURCE_UNPAIRED" };
    const top = H.measurementOverEstimate ? (paired.some((s) => s.kind === "measurement") ? paired.filter((s) => s.kind === "measurement") : paired) : paired;
    const latest = top.reduce((m, s) => (s.effective_date > m ? s.effective_date : m), "0000-00-00"); const tied = top.filter((s) => s.effective_date === latest);
    const classes = new Map(); for (const s of tied) { const k = equivKey(s); classes.set(k, (classes.get(k) || []).concat([s])); }
    if (classes.size > 1) { if (H.tieToConflict) return { code: "BODY_COMPOSITION_SOURCE_CONFLICT", N: classes.size, copy: `Your body-composition entries for ${latest} disagree (${classes.size} versions) — correct or remove entries until one version remains` }; }
    const cls = [...classes.values()][0]; const rep = cls.slice().sort((a, b) => a.seq !== b.seq ? a.seq - b.seq : (a.op_id < b.op_id ? -1 : 1))[0];
    const li = leanInterval(rep); return { code: "LEAN_BOUND", representative: rep.op_id, membership: cls.map((s) => s.op_id).sort(), lean: li, anchor: li.point != null ? { kg: li.point, label: "point" } : { kg: (li.low + li.high) / 2, label: "midpoint" }, source: rep };
  }
  /* ---- D13 ---- */
  function protein() {
    const a = cfg.athlete || {}; const prov = { policy: "earned.protein.public", version: 1 };
    if (!(a.age >= 18) || a.d11 === "FAIL") return { branch: "P3", abstain: "INELIGIBLE_D11", ...prov };
    if (H.requireRT && !(a.rt_plan && a.rt_plan.effective && !a.rt_plan.suspended)) return { branch: "P3", abstain: "NO_EFFECTIVE_RT_PLAN", ...prov };
    if (H.requirePhase && !["deficit", "maintenance", "surplus"].includes(a.phase)) return { branch: "P3", abstain: "PHASE_UNRESOLVED", ...prov };
    const scopeMatched = a.age >= 18 && a.d11 === "HEALTHY";
    if (a.phase === "deficit") {
      const g = governingSource(); if (g.code !== "LEAN_BOUND") return { branch: "P1", abstain: g.code, copy: g.copy, N: g.N, ...prov };
      const c1 = H.c1; const raw = c1 * g.lean.high; const point = c1 * g.anchor.kg; const range = [c1 * g.lean.low, c1 * g.lean.high];
      const matched = scopeMatched && a.rt_months > 6 && (a.sex === "F" ? g.source.bf_high <= 0.35 : g.source.bf_high <= 0.23) && g.source.bf_high != null;
      return { branch: "P1", ...prov, raw_minimum_g: raw, operative_g: ceil_g(raw, 1), display_point_g: roundHalfAway(point), anchor_label: g.anchor.label, evidence_range_g: [Math.floor(range[0]), Math.ceil(range[1])], evidence_scope: matched ? "MATCHED_BY_DECLARATION" : "EXTRAPOLATED", source: g.representative, membership: g.membership,
        action_constraint: H.fullContract ? { kind: "MINIMUM", value: ceil_g(raw, 1), unit: "g/day", policy: "earned.protein.public v1", constraint_grain: { value: 1, unit: "g/day", origin: 0 }, uncertainty_rule: "P1 on the high lean endpoint; P2 a point weigh-in with no interval; the quantized minimum governs and is shown" } : { value: ceil_g(raw, 1) } };
    }
    const w = a.weigh_in; if (!w) return { branch: "P2", abstain: "NO_CURRENT_WEIGH_IN", ...prov };
    if (daysBetween(w.effective_date, eval_date) < 0) return { branch: "P2", abstain: "WEIGH_IN_FUTURE_EFFECTIVE", copy: "This weigh-in is dated in the future — correct its date", ...prov };
    if ((a.missing_dates || 0) >= H.p2D7) return { branch: "P2", abstain: "WEIGH_IN_STALE", copy: "weigh in to refresh your protein minimum", ...prov };
    const raw2 = H.c2 * toKg(w.weight); return { branch: "P2", ...prov, raw_minimum_g: raw2, operative_g: ceil_g(raw2, 1), display_point_g: roundHalfAway(raw2), evidence_range_g: null, evidence_range_reason: "POINT_SOURCE_NO_INTERVAL", evidence_scope: scopeMatched ? "MATCHED_BY_DECLARATION" : "EXTRAPOLATED",
      action_constraint: H.fullContract ? { kind: "MINIMUM", value: ceil_g(raw2, 1), unit: "g/day", policy: "earned.protein.public v1", constraint_grain: { value: 1, unit: "g/day", origin: 0 }, uncertainty_rule: "P1 on the high lean endpoint; P2 a point weigh-in with no interval; the quantized minimum governs and is shown" } : { value: ceil_g(raw2, 1) } };
  }
  /* ---- D14 ---- */
  function floor() {
    const a = cfg.athlete || {}; const prov = { policy: "earned.floor.public", version: 1 };
    if (!(a.age >= 18) || a.d11 === "FAIL") return { shared: "INELIGIBLE_D11", ...prov };
    const g = governingSource(); if (g.code !== "LEAN_BOUND") return { shared: g.code, N: g.N, ...prov };
    const k = H.k; const leanFor = H.floorOnLeanHigh ? g.lean.high : g.anchor.kg;
    const today = cfg.today || {}; const plan = cfg.plan || {};
    const dayResult = (() => { const O = today.occurrences || []; if (!O.length && today.zeroProof === "NO_EXERCISE_ATTESTATION") return H.zeroNeedsNoProducer ? { headline: "ZERO_ATTESTED", selected_eee: 0 } : (today.producers && today.producers.length ? { headline: "ZERO_ATTESTED", selected_eee: 0 } : { headline: "MISSING_EEE_ESTIMATE" }); if (O.length && !(today.producers && today.producers.length)) return { headline: "MISSING_EEE_ESTIMATE" }; if (O.length) return { headline: "ONE_BOUND", selected_eee: today.producers[0].eee_kcal }; return { headline: "UNKNOWN" }; })();
    const T = dayResult.headline === "ZERO_ATTESTED" || dayResult.headline === "ONE_BOUND" ? (() => { const raw = k * leanFor + dayResult.selected_eee; return { status: "FIGURE_OK", raw, operative: H.exclusiveBoundary ? operativeFloor(raw) : Math.ceil(raw), point: roundHalfAway(k * g.anchor.kg + dayResult.selected_eee), range: [Math.floor(k * g.lean.low + dayResult.selected_eee), Math.ceil(k * g.lean.high + dayResult.selected_eee)], selected_eee: dayResult.selected_eee, headline: dayResult.headline, displayed: true }; })() : { status: dayResult.headline, displayed: false };
    const P = plan.classes ? (() => { const missing = plan.classes.filter((c) => c.bound_kcal == null).map((c) => "CLASS_BOUND_MISSING:" + c.id).sort(); if (missing.length) return { status: "BLOCKED", failures: missing, displayed: false }; const per = plan.classes.map((c) => ({ id: c.id, raw: k * leanFor + c.bound_kcal, operative: H.exclusiveBoundary ? operativeFloor(k * leanFor + c.bound_kcal) : Math.ceil(k * leanFor + c.bound_kcal) })); const max = Math.max(...per.map((x) => x.operative)); return { status: "FIGURE_OK", classes: per, operative: max, co_maximal: per.filter((x) => x.operative === max).map((x) => x.id).sort(), displayed: true }; })() : { status: "NO_PLAN", displayed: false };
    const check = (() => { const prop = cfg.proposal; if (!prop) return null; const locus = []; if (T.status !== "FIGURE_OK") locus.push({ locus: "TODAY", result: T.status }); if (P.status !== "FIGURE_OK") locus.push({ locus: "PLAN_HORIZON", result: P.status }); if (!H.applyNeeds3T3P) locus.length = 0; if (locus.length) return { headline: "BLOCKED_BY", results: (H.firstLocusOnly ? locus.slice(0, 1) : locus).sort((x, y) => x.locus < y.locus ? -1 : 1) }; const req = Math.max(T.operative, P.operative); const gov = [T.operative === req ? "TODAY" : null, P.operative === req ? "PLAN_HORIZON" : null].filter(Boolean).sort(); return prop.band[0] < req ? { headline: "INTAKE_BELOW_FLOOR", band_low: prop.band[0], required_minimum: req, governing_scopes: gov } : { headline: "PASSES", required_minimum: req, governing_scopes: gov }; })();
    return { ...prov, lean: g.lean, anchor: g.anchor, source: g.representative, TODAY: T, PLAN_HORIZON: P, D14_POLICY_CHECK_RESULT: check, application: check ? (check.headline === "PASSES" ? "ALLOWED" : "BLOCKED") : null, grid: (o) => ceil_g(o, plan.grid || 1) };
  }
  return { protein, floor, governingSource, leanInterval, consts: { LB_KG, ceil_g, roundHalfAway, operativeFloor } };
}
module.exports = { create, LB_KG, ceil_g, roundHalfAway, operativeFloor };
