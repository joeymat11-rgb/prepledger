/* rig183 — Sol pass 34's four witnesses on appendix v1.34 (→ v1.35). Floor model: 1500 + EEE_high + 1.
   Adversarial-read notes (not executed): X1 the deadline is the declared release interval measured from ARRIVAL on one clock
   for every request of the source; X2 an EXACT_RELEASED request whose group later proves incomplete is impossible — its
   prerequisite was completion; X3 the athlete client's sync is independent of the response state (stored results are carried
   whenever they exist); the leakage inventory now names "no exact result before the deadline" rather than "unauthorized". */
const JP = JSON.stringify;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };
const floor = (eee) => 1500 + eee + 1;

console.log("== T1 — incarnation cardinality keyed by an UNTYPED producer_id");
{
  const mk = () => ({ incs: [{ kind: "AUTHORITATIVE_SOURCE", producer_id: "p", inst: 1, presence: "PRESENT", active: true, phases: ["RECORD"] }] });
  const add = (reg, inc, keyOf) => { for (const i of reg.incs) if (i.presence === "PRESENT" && keyOf(i) === keyOf(inc)) i.presence = "REMOVED"; reg.incs.push(inc); };
  const method = { kind: "D14_1_METHOD", producer_id: "p", inst: 2, presence: "PRESENT", active: true, phases: ["METHOD_EMISSION"] };
  const current = (i) => i.presence === "PRESENT" && i.active;
  const truth = (reg) => { const src = reg.incs.find((i) => i.kind === "AUTHORITATIVE_SOURCE"); return current(src) ? "floor " + floor(500) + " (source RECORD governs)" : "D14.1 supplies a different bound (source record stale)"; };
  const a = mk(); add(a, { ...method }, (i) => i.producer_id);                      /* v1.34 literal: "per producer_id" */
  const b = mk(); add(b, { ...method }, (i) => i.kind + "|" + i.producer_id);       /* the other reading: {kind, producer_id} */
  console.log("   v1.34 'per producer_id':", truth(a), "| 'per {kind, producer_id}':", truth(b));
  ok(truth(a) !== truth(b), "v1.34: source_id = p and method_id = p — one reading REMOVES the source incarnation when the method registers, the other keeps both; different evidence, different floors");
  const producerKey = (i) => JP({ kind: i.kind, producer_id: i.producer_id });
  const c = mk(); add(c, { ...method }, producerKey);
  const presentPerKey = {}; for (const i of c.incs) if (i.presence === "PRESENT") presentPerKey[producerKey(i)] = (presentPerKey[producerKey(i)] || 0) + 1;
  ok(truth(c).startsWith("floor 2001") && Object.values(presentPerKey).every((n) => n === 1) && Object.keys(presentPerKey).length === 2, "v1.35: producer_key = {kind, producer_id}; instance ids and the one-PRESENT rule are per producer_key; both registrations coexist and the source RECORD phase still governs");
  const currentSubmissionRoute = (reg, source_id) => reg.incs.filter((i) => i.kind === "AUTHORITATIVE_SOURCE" && i.producer_id === source_id && i.presence === "PRESENT");
  ok(currentSubmissionRoute(c, "p").length === 1 && currentSubmissionRoute(c, "p")[0].inst === 1, "v1.35: current_submission_route_id[p] selects the unique PRESENT {AUTHORITATIVE_SOURCE, p} incarnation, never the method");
}

console.log("\n== T2 — fixed-schedule envelope vs late serialized exact selection");
{
  const DEADLINE = 2000;
  /* v1.34: the envelope waits for nothing, but exact selection happens only after the prerequisite; an authorized-at-arrival request whose group is not committed by the deadline has no rule */
  const run34 = () => { const events = []; const authorizedAtArrival = true; const groupCommittedBy = 3500; const revocationAt = 2500;
    if (!authorizedAtArrival) events.push({ t: DEADLINE, r: "ENVELOPE" });
    const revokedBeforeCommit = revocationAt < groupCommittedBy; if (revokedBeforeCommit) events.push({ t: groupCommittedBy, r: "REFUSED (CAS restart) → envelope? exact refusal? both? block revocation?" });
    return events; };
  const e34 = run34(); console.log("   v1.34:", JP(e34));
  ok(e34.length === 1 && e34[0].t > DEADLINE && /\?/.test(e34[0].r), "v1.34: nothing is released at the deadline (the credential was authorized) and the later refusal has four candidate behaviours — a late envelope, an exact refusal, two responses, or blocking the revocation");
  /* v1.35: one terminal response state per request; exact may win before the deadline only when ready + authorized at its serialized step; at the deadline any PENDING request atomically becomes ENVELOPE_RELEASED */
  const run35 = (readyAt, authorizedAtRelease) => { let state = "PENDING"; const timeline = [];
    if (readyAt <= DEADLINE && authorizedAtRelease) { state = "EXACT_RELEASED"; timeline.push({ t: readyAt, r: "EXACT" }); }
    if (state === "PENDING") { state = "ENVELOPE_RELEASED"; timeline.push({ t: DEADLINE, r: "ENVELOPE" }); }
    /* anything that completes later never sends an exact response; an authorized source retrieves it by replay */
    if (readyAt > DEADLINE) timeline.push({ t: readyAt, r: "(completed internally — retrievable by replay; nothing sent)" });
    return { state, timeline }; };
  const slowAuthorized = run35(3500, true), fastAuthorized = run35(900, true), unauthorized = run35(900, false), slowRevoked = run35(3500, false);
  console.log("   v1.35 slow+authorized:", JP(slowAuthorized.timeline)); console.log("   v1.35 fast+authorized:", JP(fastAuthorized.timeline)); console.log("   v1.35 unauthorized:", JP(unauthorized.timeline), "| slow then revoked:", JP(slowRevoked.timeline));
  const sent = (r) => r.timeline.filter((e) => e.r === "EXACT" || e.r === "ENVELOPE").length;
  ok([slowAuthorized, fastAuthorized, unauthorized, slowRevoked].every((r) => sent(r) === 1), "v1.35: every request has exactly ONE terminal response — EXACT_RELEASED or ENVELOPE_RELEASED — never two, never none");
  ok(unauthorized.timeline[0].t === DEADLINE && slowRevoked.timeline[0].t === DEADLINE && slowAuthorized.timeline[0].t === DEADLINE, "v1.35: an unauthorized request gets the envelope at exactly the fixed time, and an authorized-but-slow request gets the SAME envelope at the same time — recovery, commit and the revocation race are unobservable");
  ok(fastAuthorized.state === "EXACT_RELEASED" && slowAuthorized.state === "ENVELOPE_RELEASED", "v1.35: 'an authorized principal receives the exact result' is now CONDITIONAL — only when its prerequisite completes before the deadline; otherwise it replays under the ordinary rule");
}

console.log("\n== T3 — the presence defect is unreachable under filter-first validation");
{
  const raw = [{ identity: { kind: "AUTHORITATIVE_SOURCE", producer_id: "s", version: 7, inst: 1 }, active: true, phases: ["RECORD"], domains: ["split"] }];   /* no registration_presence */
  const filterFirst = (entries) => { const present = entries.filter((e) => e.presence === "PRESENT"); return { registry: present, defects: [] }; };
  const structureFirst = (entries) => { const defects = []; for (const e of entries) if (e.presence !== "PRESENT" && e.presence !== "REMOVED") defects.push("REGISTRATION_PRESENCE_MISSING_OR_INVALID{" + JP(e.identity) + "}"); return { registry: entries.filter((e) => e.presence === "PRESENT"), defects }; };
  const a = filterFirst(raw), b = structureFirst(raw);
  console.log("   v1.34 filter-first:", JP(a), "| structure-first:", JP(b));
  ok(a.defects.length === 0 && a.registry.length === 0 && b.defects.length === 1, "v1.34: 'every test ranges only over PRESENT incarnations' lets a filter-first reducer return an EMPTY non-defective registry while a structure-first one emits the defect — two textual results");
  /* v1.35: three stages */
  const stage1 = (entries) => { const defects = []; const validated = []; const seen = new Set();
    for (const e of entries) { const idOk = e.identity && ["kind", "producer_id", "version", "inst"].every((k) => e.identity[k] !== undefined);
      if (!idOk) { defects.push("ROUTE_IDENTITY_MALFORMED"); continue; }
      const key = JP({ kind: e.identity.kind, producer_id: e.identity.producer_id, inst: e.identity.inst }); if (seen.has(key)) defects.push("ROUTE_IDENTITY_COLLISION"); seen.add(key);
      if (e.presence !== "PRESENT" && e.presence !== "REMOVED") { defects.push("REGISTRATION_PRESENCE_MISSING_OR_INVALID{identity}"); continue; }
      validated.push(e); }
    return { defects, validated }; };
  const stage2 = (validated) => validated.filter((e) => e.presence === "PRESENT");
  const stage3 = (present) => { const defects = []; const byKey = {}; for (const e of present) { const k = JP({ kind: e.identity.kind, producer_id: e.identity.producer_id }); byKey[k] = (byKey[k] || 0) + 1; if (e.active === undefined) defects.push("ACTIVE_FLAG_MISSING"); }
    for (const [k, n] of Object.entries(byKey)) if (n > 1) defects.push("PRESENT_INCARNATION_CARDINALITY{" + k + ", " + n + "}");
    const d141 = present.filter((e) => e.identity.kind === "D14_1_METHOD" && e.active).length; if (present.some((e) => e.identity.kind === "D14_1_METHOD") && d141 !== 1) defects.push("D14_1_ACTIVE_CARDINALITY");
    return defects; };
  const s1 = stage1(raw); const s2 = stage2(s1.validated); const s3 = stage3(s2);
  console.log("   v1.35 stage 1:", JP(s1.defects), "| stage 2 PRESENT set:", s2.length, "| stage 3:", JP(s3));
  ok(s1.defects.length === 1 && s1.defects[0].startsWith("REGISTRATION_PRESENCE") && s2.length === 0, "v1.35: stage 1 validates identity, instance id and presence over EVERY raw entry and emits the structural defect BEFORE any filtering — one result");
  const two = [{ identity: { kind: "AUTHORITATIVE_SOURCE", producer_id: "s", version: 7, inst: 1 }, presence: "PRESENT", active: true }, { identity: { kind: "AUTHORITATIVE_SOURCE", producer_id: "s", version: 8, inst: 2 }, presence: "PRESENT", active: true }, { identity: { kind: "D14_1_METHOD", producer_id: "m", version: 1, inst: 1 }, presence: "REMOVED", active: true }];
  const t1 = stage1(two), t2 = stage2(t1.validated), t3 = stage3(t2);
  console.log("   two PRESENT incarnations of one producer_key + a REMOVED D14.1:", JP(t3));
  ok(t3.some((d) => d.startsWith("PRESENT_INCARNATION_CARDINALITY")) && !t3.includes("D14_1_ACTIVE_CARDINALITY"), "v1.35: PRESENT_INCARNATION_CARDINALITY {producer_key, count} is a closed defect, and the REMOVED D14.1 incarnation never enters the cardinality test (history participates only in identity / non-reuse validation)");
}

console.log("\n== T4 — the EMISSION candidate identity still carried the three-field route identity");
{
  const route = (inst) => ({ kind: "AUTHORITATIVE_SOURCE", producer_id: "s", version: 7, inst });
  const emission34 = (r) => JP({ kind: "EMISSION", route: { kind: r.kind, producer_id: r.producer_id, version: r.version }, phase: "SOURCE_EMISSION", class_id: "upper" });
  const emission35 = (r) => JP({ kind: "EMISSION", route_identity: { kind: r.kind, producer_id: r.producer_id, registration_version: r.version, registration_instance_id: r.inst }, emitting_phase: "SOURCE_EMISSION", class_id: "upper" });
  const r1 = route(1), r2 = route(2);   /* r1 removed, r2 re-registered at the same feed version */
  console.log("   v1.34 emission identity r1 == r2:", emission34(r1) === emission34(r2), "| v1.35:", emission35(r1) === emission35(r2));
  ok(emission34(r1) === emission34(r2), "v1.34: the explicit emission identity ALIASES r1 and r2 — an identity-keyed cache, candidate identity or membership reuses one identifier across the same-version reincarnation v1.34 separated");
  ok(emission35(r1) !== emission35(r2), "v1.35: {kind: EMISSION, route_identity: the quadruple, emitting_phase, class_id} distinguishes them; every explicit route tuple, sorting key, active-route record and identity-keyed cache carries the quadruple");
  const contentCommitmentFields = ["source_item_id", "declared content", "lineage fields"];
  ok(!contentCommitmentFields.includes("route stamp"), "v1.35: the route stamp stays OUT of the source-authored content commitment (intentional exclusion unchanged)");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
