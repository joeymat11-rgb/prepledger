"use strict";
// TEST ONLY: exact frozen legacy compatibility functions. Not product exports.
// Network/storage delegates reach the guarded, synthetic harness globals only.
module.exports = function createCarrier(E) {
  const mergeState = (...args) => E.mergeState(...args);
  const migrate = (...args) => E.migrate(...args);
  const normalizePlan = (...args) => E.normalizePlan(...args);
  const dataLossGuard = (...args) => E.dataLossGuard(...args);
  const isoOf = (...args) => E.isoOf(...args);
  const todayStart = (...args) => E.todayStart(...args);
  const dayWeather = (...args) => E.dayWeather(...args);
  const dossierText = (...args) => E.dossierText(...args);
  const currentRate = (...args) => E.currentRate(...args);
  const stepTarget = (...args) => E.stepTarget(...args);
  const energyBalanceTarget = (...args) => E.energyBalanceTarget(...args);
  const observedTDEE = (...args) => E.observedTDEE(...args);
  const energyDensity = (...args) => E.energyDensity(...args);
  const cutRateBand = (...args) => E.cutRateBand(...args);
  const fetch = (...args) => globalThis.fetch(...args);
  const localStorage = new Proxy({}, { get(_, key) { const store = globalThis.localStorage; const v = store[key]; return typeof v === "function" ? v.bind(store) : v; } });
// BEGIN frozen src/app.jsx:12341-12342
const TOKEN_KEY = "prep-ledger-ghtoken";
const LEDGER_DICT = "FIELD DICTIONARY (authoritative — never guess a meaning): NIGHTS: h = hours asleep · bed/wake = clock times as logged (they vary; that is expected) · sol = drift-off, minutes to fall asleep · tags: woke = woke mid-night, caff = late caffeine. DAYS: cal/pro/steps as logged · dayCtx est = athlete-declared estimate day (rough numbers, lower evidentiary weight) · ⌁flags = day weather (event window / seal water / post-refeed / estimate). SESSIONS: entries = performed lifts only, w = load, reps per set, rir = reps in reserve on the opener · skipped = lifts deliberately not done (structured truth, zero phantom reps) · note = athlete prose, read it · niggles = flagged aches · dips = incidental dip count. READS: raw morning scale, sealed = quarantined event water, judge only via damped trend. PULSE bpm / TEMP °F = 60s wrist count and oral reading at wake. MEDSLOG: prescription taken/none with clock time — pure adherence bookkeeping; the system's biggest confound (appetite, pulse, effort, drift-off all move with it) now has a clock. ENERGY: morning 1–5 (1 fumes · 5 caged animal). SORENESS: muscles tapped sore at wake (empty list = nothing sore, logged). GRIP: best squeeze per hand in lb, same posture daily — a CNS-readiness number. DAILY sodium low/med/high and alcohol units ride the day numbers — units are a COUNT ONLY, a covariate for sleep/pulse/scale attribution; their calories live inside the athlete's logged cal and are never added by the app; on estimate days the unit count is a bracket midpoint like everything else. CAFFLOG: actual daily caffeine — mg and clock time as logged (mg 0 = a deliberate none-day); tail math runs on these, never an assumed noon. FEED: the app's event log — amendments and corrections here OVERRIDE older raw rows. RECORDS: a rep line becomes his when it clears his own measured set-to-set spread and then repeats — the spread is typicalError, a SINGLE-OBSERVATION typical error: paired same-load, same-set-count differences ÷ √2 (31 pairs when defined; the live n grows with the log) — sleep is NOT a condition on it and never mention pending-on-sleep, that rule is retired. LAWS: a single terminal failure set per exercise, every session, including after a short night.";
// END frozen src/app.jsx:12341-12342
// BEGIN frozen src/app.jsx:12344-12390
async function ghSync(state) {
  let tok = null;
  try { tok = localStorage.getItem(TOKEN_KEY); } catch (e) {}
  if (!tok) return { ok: false, msg: "no token saved" };
  const url = "https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/state.json";
  const hdr = { Authorization: "Bearer " + tok, Accept: "application/vnd.github+json" };
  // v6.1 durability (see mergeState): the old path PUT the whole local state over the remote —
  // last writer wins, no merge. That is what clobbered the 7/27–7/28 sessions. Now we fetch the
  // remote CONTENT, UNION-merge, and REFUSE TO SHRINK it; on a 409/422 we RE-MERGE with whatever
  // landed instead of re-forcing our copy. If the remote can't be read we DEFER rather than
  // blind-overwrite. Concurrent multi-device writes converge to the superset (self-healing).
  const fetchRemote = async () => {
    try {
      const g = await fetch(url + "?t=" + Date.now(), { cache: "no-store", headers: hdr });
      if (!g.ok) return { sha: null, state: g.status === 404 ? null : undefined };   // 404 = no remote yet (fine); undefined = unknown -> don't clobber
      const j = await g.json();
      let rs; try { rs = JSON.parse(decodeURIComponent(escape(atob(String(j.content || "").replace(/\s/g, ""))))); } catch (e) { rs = undefined; }
      return { sha: j.sha || null, state: rs };
    } catch (e) { return { sha: null, state: undefined }; }
  };
  const buildBody = (rState, rSha) => {
    const merged = rState && typeof rState === "object" ? mergeState(state, migrate(rState)) : normalizePlan(JSON.parse(JSON.stringify(state)));   /* SPLIT item k (bootstrap law) — CONFIRMED defect, fixed: this site merged the RAW remote; a v50 replica met v51 structures un-migrated. R5 fix-4: the NO-REMOTE branch (a reachable 404 — first-ever sync) used to PUT raw local, so a poisoned order reached the wire; it normalizes on a copy, leaving the caller's state untouched. */
    if (rState && typeof rState === "object" && !dataLossGuard(rState, merged).safe) return null;   // never write a state smaller than the remote
    return { message: "ledger auto-sync " + isoOf(todayStart()) + " [skip ci]", content: btoa(unescape(encodeURIComponent(JSON.stringify({ ...merged, _dictionary: LEDGER_DICT })))), ...(rSha ? { sha: rSha } : {}) };
  };
  const r0 = await fetchRemote();
  if (r0.state === undefined) { try { localStorage.setItem("plSyncErr", JSON.stringify({ at: new Date().toISOString(), status: 0, msg: "remote unreadable — sync deferred (no clobber)" })); } catch (e) {} return { ok: false, msg: "remote unreadable — sync deferred to avoid clobber" }; }
  let body = buildBody(r0.state, r0.sha);
  if (!body) return { ok: false, msg: "refused: merge would shrink the remote" };
  try {
    let put = await fetch(url, { method: "PUT", headers: { ...hdr, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const tr9 = [put.status];
    for (let rt = 0; !put.ok && (put.status === 409 || put.status === 422) && rt < 4; rt++) {
      await new Promise((r9) => setTimeout(r9, 500 + rt * 300));
      const rr = await fetchRemote();
      if (rr.state === undefined) break;
      const b2 = buildBody(rr.state, rr.sha);
      if (!b2) { tr9.push("refuse-shrink"); break; }
      body = b2;
      put = await fetch(url, { method: "PUT", headers: { ...hdr, "Content-Type": "application/json" }, body: JSON.stringify(body) });
      tr9.push(put.status);
    }
    if (put.ok) { try { snapshotMaybe(state, tok); localStorage.setItem("pl-lastsync", String(Date.now())); localStorage.removeItem("plSyncErr"); } catch (e) {} }
    if (!put.ok) { let et9 = ""; try { et9 = (await put.text()).slice(0, 140); } catch (e) {} try { localStorage.setItem("plSyncErr", JSON.stringify({ at: new Date().toISOString(), status: put.status, msg: et9, tr: tr9 })); } catch (e) {} }
    return put.ok ? { ok: true } : { ok: false, msg: "HTTP " + put.status + (put.status === 401 ? " — token expired?" : "") };
  } catch (e) { try { localStorage.setItem("plSyncErr", JSON.stringify({ at: new Date().toISOString(), status: 0, msg: "network" })); } catch (e2) {} return { ok: false, msg: "network" }; }
}
// END frozen src/app.jsx:12344-12390
// BEGIN frozen src/app.jsx:12589-12649
function agentToolExec(s, name, input, staged) {
  try {
    if (name === "get_range") {
      const inR = (d) => d >= input.from && d <= input.to;
      if (input.kind === "days") return Object.entries(s.dailyLogs).filter(([d]) => inR(d)).map(([d, v]) => { const w3 = dayWeather(s, d); return `${d}: cal ${v.cal ?? "—"} pro ${v.pro ?? "—"} steps ${v.steps ?? "—"}${w3.flags.length ? "  ⌁[" + w3.flags.map((f) => f.k).join(",") + "]" : ""}`; }).join("\n") || "no rows";
      if (input.kind === "nights") return s.sleep.nights.filter((n) => inR(n.d)).map((n) => `${n.d}: ${n.h}h · bed ${n.bed || "—"} → wake ${n.wake || "—"} · drift-off ${n.sol ?? "?"}m${(n.tags || []).length ? " · " + n.tags.join("/") : ""}`).join("\n") || "no rows";
      if (input.kind === "sessions") return Object.keys(s.sessionLog).filter(inR).map((d) => { const sl2 = s.sessionLog[d]; const parts = [(sl2.entries || []).map((e) => `${e.id} ${e.w}×${(e.reps || []).join(",")}${e.rir != null ? ` RIR${e.rir}` : ""}`).join(" · ") || "no lifts"]; if ((sl2.skipped || []).length) parts.push("SKIPPED: " + sl2.skipped.map((k) => k.id).join(", ")); if (sl2.dips) parts.push(`dips ${sl2.dips}`); if ((sl2.niggles || []).length) parts.push("niggles: " + sl2.niggles.join(", ")); if (sl2.note) parts.push(`note: "${sl2.note.slice(0, 140)}"`); return `${d}: ` + parts.join(" · "); }).join("\n") || "no rows";
      if (input.kind === "pulse") return (s.pulse || []).filter((x) => inR(x.d)).map((x) => `${x.d}: ${x.bpm}`).join("\n") || "no rows";
      if (input.kind === "temp") return (s.temp || []).filter((x) => inR(x.d)).map((x) => `${x.d}: ${x.f}°F`).join("\n") || "no rows";
      if (input.kind === "reads") return s.reads.filter((r) => inR(r.d)).map((r) => { const w4 = dayWeather(s, r.d); return `${r.d}: ${r.w}${r.sealed ? " (sealed — event water, trend only)" : ""}${w4.flags.length ? "  ⌁[" + w4.flags.map((f) => f.k).join(",") + "]" : ""}`; }).join("\n") || "no rows";
      if (input.kind === "feed") return (s.feed || []).slice(0, 25).map((f) => `${f.d}: ${f.t}${f.how ? " — " + f.how.slice(0, 100) : ""}`).join("\n") || "no rows";
      if (input.kind === "crash") { try { return localStorage.getItem("prep-ledger-crash") || "no crash on file"; } catch (e) { return "no crash on file"; } }
      return "unknown kind";
    }
    if (name === "read_instruments") return dossierText(s);
    if (name === "run_whatif") {
      const cur = currentRate(s);
      const base = cur.measured ? cur.scale : 1.2;
      /* Every reference point here was authored: 16,500 steps, 1,760 kcal and
         3,500 kcal/lb, none of which the engine still uses. The tool the analyst
         reaches for to model a lever was modelling a different athlete. It now
         starts from his measured step average, his measured calorie target and
         the same kcal-per-pound the rest of the engine uses. */
      const stW = stepTarget(s), ctW = energyBalanceTarget(s);
      const stepRef = stW.gated ? null : stW.avg;
      /* Anchor to what he ACTUALLY eats, not to what he is told to eat. Using
         the prescription meant modelling his current intake returned a rate
         0.23 lb/wk off the rate his ledger already measured at that intake. */
      const tdW = observedTDEE(s);
      const calRef = tdW ? tdW.avg : (ctW.gated ? null : ctW.mid);
      const perStepKcal = stW.gated ? 0.35 : stW.kcalPer1k / 1000;
      const edWhatIf = energyDensity(s).perLb;   // v7.3.0 Slice 4 — the what-if prices rate↔kcal off the ONE energy-density owner (== 3800 until a DEXA)
      const dSteps = input.steps != null && stepRef != null ? ((input.steps - stepRef) * perStepKcal * 7) / edWhatIf : 0;
      const dCal = input.cal != null && calRef != null ? ((calRef - input.cal) * 7) / edWhatIf : 0;
      const rate = +(base + dSteps + dCal).toFixed(2);
      const rb = cutRateBand(s).band;   // v6.2.1 — the what-if warns against the selected mode's band
      const notes = [];
      if (input.steps != null && stepRef == null) notes.push("step effect not modelled — not enough logged step days to know his baseline");
      if (input.cal != null && calRef == null) notes.push("calorie effect not modelled — maintenance is not measured yet");
      /* The sleep warning used to say the streak never completes and nothing
         becomes official. That gate is retired. What a short night actually
         costs is on the body-composition side, so that is what it warns about. */
      if (input.sleep != null && input.sleep < s.sleep.cleanH) notes.push(`at ${input.sleep} h the session is unaffected, but at a matched deficit short sleep sends about 60% more of the loss onto lean mass — this model shows scale pounds and cannot show what they are made of`);
      if (rate > rb[1]) notes.push(`past his ${rb[1]} lb/wk band top — deficit magnitude is the variable most tightly linked to lean-mass loss`);
      if (input.refeed != null) notes.push("refeeds are retired — a higher day against a fixed weekly total is just a deeper day somewhere else");
      return `modeled rate: ${rate} lb/wk (base ${base}${notes.length ? " · " + notes.join(" · ") : ""})`;
    }
    if (name === "stage_proposal") {
      let custom = null;
      if (input.custom) {
        const c = input.custom;
        if (!Array.isArray(c.arms) || c.arms.length !== 2) return "rejected: custom trials need exactly 2 arms";
        if (!["session_reps", "sleep_h", "trend_delta"].includes(c.metric)) return "rejected: metric must be one the engines can measure";
        custom = { t: String(c.t).slice(0, 60), q: String(c.q).slice(0, 140), arms: [String(c.arms[0]).slice(0, 40), String(c.arms[1]).slice(0, 40)], blockDays: Math.min(7, Math.max(3, Math.round(c.blockDays))), cycles: Math.min(6, Math.max(3, Math.round(c.cycles))), metric: c.metric };
      }
      staged.push({ id: "ap" + Date.now() + Math.floor(Math.random() * 999), kind: input.kind, title: input.title, body: input.body, tplId: input.tplId || null, custom, at: isoOf(todayStart()) });
      return "staged for the athlete's consent — do not assume it will be accepted";
    }
  } catch (e) { return "tool error: " + e.message; }
  return "unknown tool";
}
// END frozen src/app.jsx:12589-12649
// BEGIN frozen src/app.jsx:12746-12760
async function snapshotMaybe(state, tok) {
  const last = +(localStorage.getItem("prep-ledger-lastsnap") || 0);
  if (Date.now() - last < 6 * 86400 * 1000) return;
  localStorage.setItem("prep-ledger-lastsnap", String(Date.now()));
  const d = isoOf(todayStart());
  const url2 = `https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/snapshots/state-${d}.json`;
  const hdr2 = { Authorization: "Bearer " + tok, Accept: "application/vnd.github+json", "Content-Type": "application/json" };
  /* R5 fix-4 (the THIRD upload boundary, found by this round's own pin — the
     drive captured the LAST PUT and it was this one): the vault must not
     archive an un-canonical order, or a restore reads the poison back. Same
     remedy as buildBody's no-remote arm — normalized on a copy, so the
     caller's state is untouched by an archival write. */
  const snapBody = normalizePlan(JSON.parse(JSON.stringify(state)));
  try { await fetch(url2, { method: "PUT", headers: hdr2, body: JSON.stringify({ message: `weekly snapshot ${d} [skip ci]`, content: btoa(unescape(encodeURIComponent(JSON.stringify(snapBody)))) }) }); } catch (e) {}
}
// END frozen src/app.jsx:12746-12760
// BEGIN frozen src/app.jsx:13259-13261
const RESTORE_OFFER_KEY = "pl-restore-offer";
function restoreOfferStands() { try { return localStorage.getItem(RESTORE_OFFER_KEY) === "1"; } catch (e) { return false; } }
function clearRestoreOffer() { try { localStorage.removeItem(RESTORE_OFFER_KEY); } catch (e) {} }
// END frozen src/app.jsx:13259-13261
return { ghSync, agentToolExec, restoreOfferStands, clearRestoreOffer };
};
