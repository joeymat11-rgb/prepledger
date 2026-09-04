/* reference/authority.cjs — THE REFERENCE AUTHORITY v3 (in-memory, Node; NOT the product). Every §A law is GREEN
   against it; each law's targeted mutant is a one-hook delta (hooks below); the §C soak drives it; the product's
   authority (adapters/authority.cjs, tranche T3) must pass the same laws. Sheet v1.7.38 A1–A6, states 4, 5, 8,
   15, 16, 17, 19, 20. v3 (Sol suite-pass-2): per-athlete operation ownership; the real conflict-selection kind with
   compare-and-append on seen_conflict_basis and numeric lineage-key ordering; undo requests; issuance / instance
   identity / coverage / apply results; local lease validation (signature, device + athlete binding, lease id,
   schema, range, not_before/not_after, signed server time, monotonic high-water, continuity); export snapshots. */
const O = require("../lib/ops.cjs");
const { canonicalEncode, hmac, leaseValid, AUTH_KEY, KINDS, CLASSES, TARGET_REQUIRED } = O;
const CODES = ["CROSS_ATHLETE_REFERENCE", "IDENTITY_COLLISION", "INSTANCE_COLLISION", "MALFORMED", "LEASE_FORGED", "LEASE_UNKNOWN", "LEASE_REVOKED_BEYOND_BARRIER", "DEVICE_SEQ_OUT_OF_RANGE", "DEVICE_SEQ_REUSE", "LINEAGE_MISMATCH"];
const isNum = (x) => typeof x === "number" && Number.isFinite(x);
const isQty = (q) => q && typeof q === "object" && isNum(q.value) && typeof q.unit === "string" && q.unit.length > 0;
const PAYLOAD_REQUIRED = { reading: ["lb"], "food-day": [], steps: ["count"], sleep: ["hours"], event: ["type", "interval"], illness: ["interval"], "pain-attestation": ["scope"], "setup-note": ["text"], "body-composition-source": ["kind", "quantity", "low", "high", "provenance", "effective_date"] };
const COMPATIBLE_RECLASS = { reading: ["reading"], "food-day": ["food-day"] };   /* declared payload-compatible classes: a reading's morning/late class only */
const cmpKey = (a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const x = a[i], y = b[i]; if (x === undefined) return -1; if (y === undefined) return 1; if (x !== y) return x < y ? -1 : 1; } return 0; };   /* lexicographic over NUMERIC vectors */
function create(cfg = {}, hooks = {}) {
  const H = Object.assign({
    signDisposition: (d) => hmac(AUTH_KEY, "earned/disposition/v1" + canonicalEncode({ ...d, authority_signature: undefined })), receiptCommitment: (op) => op.canonical_content_commitment,
    replayIsSame: (stored, op) => stored.commitment === op.canonical_content_commitment, nextSeq: (st) => ++st.seq, validateLease: true, checkRange: true, checkRevocation: true, validateShape: true,
    waitOnUnknownParent: true, rejectKnownCross: true, dependencyReject: true, atomicPlan: true, planApply: (plan, op) => { for (const m of op.members) plan[m.field] = m.value; }, barrierOf: (st, dev) => st.lastAccepted[dev] || 0,
    declaredLoss: true, dedupSlot: true, lateArrivalCutoff: null, replayApplies: false, casCheck: true, ownershipPerAthlete: true, lineageOrder: "numeric", lineageCheck: true, chosenMustBeMaximum: true, atomicSelection: true,
    undoEligibility: true, undoOnce: true, coverageCheck: true, uniquenessPerInstance: true, instanceFromContent: true, applyIdempotent: true, exportLabelQualified: true, semanticOrderByParents: true, payloadCompleteness: true, reclassCompat: true,
  }, hooks);
  const athletes = {}; const owners = new Map();   /* op_id → Set(athlete_id): ownership is PER ATHLETE, never overwritten */
  for (const [id, a] of Object.entries(cfg.athletes || {})) athletes[id] = { devices: a.devices || {}, seq: 0, log: [], byOp: new Map(), slots: new Map(), waiting: [], plan: Object.assign({ protein_g: 150, steps: 8000 }, a.plan || {}), txns: [], revoked: {}, lastAccepted: {}, domains: {}, issuances: new Map(), instances: new Map(), responses: [], applies: new Map(), undos: new Map(), suspended: new Set() };
  let crash = null;
  const sign = (d) => ({ ...d, authority_signature: H.signDisposition(d) });
  const store = (st, op, d, keyOverride) => { const key = keyOverride || (op.device_id + ":" + op.device_seq); const hist = st.slots.get(key) || []; hist.push(d); st.slots.set(key, hist); st.byOp.set(op.op_id, { op, commitment: op.canonical_content_commitment, key }); if (!owners.has(op.op_id)) owners.set(op.op_id, new Set()); owners.get(op.op_id).add(op.athlete_id); return d; };
  const reject = (st, op, code, keyOverride) => { const slotKey = op.device_id + ":" + op.device_seq; const occupied = st.slots.has(slotKey) && st.slots.get(slotKey).some((d) => d.op_id !== op.op_id); return store(st, op, sign({ op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, device_id: op.device_id, device_seq: op.device_seq, status: "REJECTED", rejection_code: code, decided_at: "2026-09-03T00:00:00Z" }), keyOverride || (occupied ? "op:" + op.op_id : undefined)); };
  const digestOf = (plan) => hmac("effect", canonicalEncode(plan));
  const basisOf = (domId, maxima) => hmac("basis", canonicalEncode({ d: domId, maxima: maxima.slice().sort() }));
  function shapeDefect(op) {
    for (const k of ["op_id", "athlete_id", "device_id", "device_seq", "class", "kind", "effective", "schema_version", "lease_id", "payload", "causal_parents"]) if (op[k] === undefined) return "missing " + k;
    if (KINDS.indexOf(op.kind) < 0) return "kind outside model"; if (CLASSES.indexOf(op.class) < 0) return "class outside model";
    if (!op.effective || !op.effective.local_date || !op.effective.local_time || !/^[+-]\d\d:\d\d$/.test(op.effective.utc_offset || "")) return "effective local date/time/offset";
    if (TARGET_REQUIRED.has(op.kind) ? !op.target_op_id : op.target_op_id !== undefined) return "target_op_id " + (TARGET_REQUIRED.has(op.kind) ? "required" : "forbidden");
    if (!Number.isInteger(op.device_seq) || op.device_seq < 1) return "device_seq";
    const walk = (v) => { if (v === null) return null; if (typeof v === "number") return Number.isFinite(v) ? "bare number" : "non-finite"; if (Array.isArray(v)) { for (const x of v) { const r = walk(x); if (r) return r; } return null; } if (v && typeof v === "object") { if (isQty(v)) return null; if ("value" in v && "unit" in v) return "quantity"; for (const x of Object.values(v)) { const r = walk(x); if (r) return r; } } return null; };
    if (!["plan-mutation", "conflict-selection", "undo-request"].includes(op.kind)) { const r = walk(op.payload); if (r) return "payload " + r; }
    if (op.kind === "fact" && H.payloadCompleteness) { const req = PAYLOAD_REQUIRED[op.class]; if (req) for (const f of req) if (!op.payload || op.payload[f] === undefined) return "payload incomplete: " + op.class + " needs " + f; if (op.class === "setup-note" && !(op.payload && typeof op.payload.text === "string" && op.payload.text.trim())) return "setup-note text empty"; if (op.class === "body-composition-source" && op.payload.point && !(op.payload.low.value <= op.payload.point.value && op.payload.point.value <= op.payload.high.value)) return "central estimate outside endpoints"; }
    if (op.kind === "plan-mutation") { for (const k of ["conflict_domain_id", "conflict_domain_lineage_id", "requested_transaction_id", "members", "seen_plan_basis", "member_set_commitment"]) if (op[k] === undefined) return "plan-mutation missing " + k; if (!Array.isArray(op.members) || !op.members.length || op.members.some((m) => !m.field || !isNum(m.value) || !["athlete_edited", "inherited"].includes(m.provenance))) return "plan-mutation members"; }
    if (op.kind === "conflict-selection") { for (const k of ["conflict_domain_id", "conflict_domain_lineage_id", "requested_transaction_id", "seen_conflict_basis", "chosen_alternative_commitment"]) if (op[k] === undefined || op[k] === null) return "conflict-selection missing " + k; }
    if (op.kind === "undo-request") { for (const k of ["target_plan_transaction_id", "seen_plan_basis", "target_effect_digest", "compensating_group_commitment"]) if (op[k] === undefined || op[k] === null) return "undo-request missing " + k; }
    if (op.kind === "correction" && !(op.payload && op.payload.replacement_fields && Object.keys(op.payload.replacement_fields).length)) return "correction replacement_fields";
    if (op.kind === "tombstone" && !(op.payload && typeof op.payload.reason === "string" && op.payload.reason)) return "tombstone reason";
    if (op.kind === "reclassification" && !(op.payload && op.payload.replacement_class)) return "reclassification replacement_class";
    return null;
  }
  function admit(athlete_id, op, meta = {}) {
    const st = athletes[athlete_id]; if (!st) throw new Error("unknown athlete " + athlete_id);
    if (!op || typeof op !== "object") throw new Error("op");
    const known = st.byOp.get(op.op_id);
    if (known) { const hist = st.slots.get(known.key); if (H.replayIsSame(known, op)) { if (H.replayApplies && known.op.kind === "plan-mutation") { st.txns.push({ txn_id: op.requested_transaction_id + "-dup", op_id: op.op_id }); H.planApply(st.plan, op); } return hist[hist.length - 1]; }
      return sign({ op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, device_id: op.device_id, device_seq: op.device_seq, status: "REJECTED", rejection_code: "IDENTITY_COLLISION", decided_at: "2026-09-03T00:00:00Z" }); }
    if (op.athlete_id !== athlete_id) return reject(st, op, "MALFORMED");
    if (H.validateShape) { const d = shapeDefect(op); if (d) return reject(st, op, "MALFORMED"); }
    const dev = st.devices[op.device_id]; const lease = dev && dev.lease;
    if (H.validateLease) { if (!lease || lease.lease_id !== op.lease_id) return reject(st, op, "LEASE_UNKNOWN"); if (!leaseValid(lease) || lease.device_id !== op.device_id) return reject(st, op, "LEASE_FORGED"); }
    if (H.checkRevocation && st.revoked[op.device_id] != null && op.device_seq > st.revoked[op.device_id]) return reject(st, op, "LEASE_REVOKED_BEYOND_BARRIER");
    if (H.checkRange && lease && (op.device_seq < lease.range[0] || op.device_seq > lease.range[1])) return reject(st, op, "DEVICE_SEQ_OUT_OF_RANGE");
    if (H.lateArrivalCutoff && meta.received_at && lease && meta.received_at > lease.not_after) return reject(st, op, "LEASE_UNKNOWN");
    const key = op.device_id + ":" + op.device_seq;
    if (H.dedupSlot && st.slots.has(key) && st.slots.get(key).some((d) => d.op_id !== op.op_id)) return reject(st, op, "DEVICE_SEQ_REUSE", "op:" + op.op_id);
    const refs = (op.causal_parents || []).concat(op.target_op_id ? [op.target_op_id] : []);
    for (const r of refs) {
      const own = owners.get(r); const mine = own && own.has(athlete_id); const foreign = own && !mine && own.size > 0;
      if (H.ownershipPerAthlete ? (foreign && !mine) : (own && [...own].pop() !== athlete_id)) { if (H.rejectKnownCross) return reject(st, op, "CROSS_ATHLETE_REFERENCE"); }
      const k = st.byOp.get(r); const hist = k && st.slots.get(k.key); const cur = hist && hist[hist.length - 1];
      if (cur && (cur.status === "REJECTED" || cur.status === "REJECTED_DEPENDENCY")) { if (H.dependencyReject) return store(st, op, sign({ op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, device_id: op.device_id, device_seq: op.device_seq, status: "REJECTED_DEPENDENCY", rejection_code: "REJECTED_DEPENDENCY", decided_at: "2026-09-03T00:00:00Z" })); }
      if (!cur || cur.status === "WAITING") { if (H.waitOnUnknownParent) { const w = store(st, op, sign({ op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, device_id: op.device_id, device_seq: op.device_seq, status: "WAITING", decided_at: "2026-09-03T00:00:00Z" })); st.waiting.push(op); return w; } }
    }
    if (op.kind === "reclassification" && H.reclassCompat) { const t = st.byOp.get(op.target_op_id); const from = t && t.op.class; const to = op.payload.replacement_class; const compatible = (COMPATIBLE_RECLASS[from] || []).includes(to); if (!compatible && !(op.payload.destination_payload && !walkQty(op.payload.destination_payload) && op.payload.destination_effective)) return reject(st, op, "MALFORMED"); }
    return accept(st, op);
  }
  const walkQty = (v) => { if (v === null) return null; if (typeof v === "number") return "bare"; if (v && typeof v === "object") { if (isQty(v)) return null; for (const x of Object.values(v)) { const r = walkQty(x); if (r) return r; } } return null; };
  function lineageKey(dom, txn) { const parents = dom.txns.filter((t) => txn.parents.includes(t.op_id)); if (!parents.length) return [txn.seq]; const keys = parents.map((p) => p.lineage_key); keys.sort(H.lineageOrder === "numeric" ? cmpKey : (a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1)); return keys[0].concat([txn.seq]); }
  function accept(st, op) {
    if (crash === "between-admission-and-plan-transaction" && op.kind === "plan-mutation" && H.atomicPlan) return { status: "UNAVAILABLE", retry: true, op_id: op.op_id };
    if (crash === "between-admission-and-selection-commit" && op.kind === "conflict-selection" && H.atomicSelection) return { status: "UNAVAILABLE", retry: true, op_id: op.op_id };
    const seqNo = H.nextSeq(st);
    let extraDisp = {};
    if (op.kind === "plan-mutation") {
      const dom = st.domains[op.conflict_domain_id] || (st.domains[op.conflict_domain_id] = { lineage: op.conflict_domain_lineage_id, maxima: [], txns: [] });
      if (H.lineageCheck && dom.lineage !== op.conflict_domain_lineage_id) { st.seq--; return reject(st, op, "LINEAGE_MISMATCH"); }
      const parents = (op.causal_parents || []).filter((p) => dom.txns.some((t) => t.op_id === p));
      const txn = { txn_id: op.requested_transaction_id, op_id: op.op_id, seq: seqNo, members: op.members.map((m) => ({ ...m })), member_set_commitment: op.member_set_commitment, parents, before: { ...st.plan }, kind: "plan-mutation", provenance: op.members.every((m) => m.provenance === "athlete_edited") ? "authored" : "inherited" };
      txn.lineage_key = lineageKey(dom, txn); dom.txns.push(txn); dom.maxima = dom.maxima.filter((m) => !txn.parents.includes(m)).concat([op.op_id]);
      if (!(crash === "between-admission-and-plan-transaction" && !H.atomicPlan)) { st.txns.push(txn); recomputeEffective(st, op.conflict_domain_id); txn.after_digest = digestOf(planOfDomain(st, op.conflict_domain_id)); }
    }
    if (op.kind === "conflict-selection") {
      const dom = st.domains[op.conflict_domain_id]; if (!dom) { st.seq--; return reject(st, op, "MALFORMED"); }
      if (H.lineageCheck && dom.lineage !== op.conflict_domain_lineage_id) { st.seq--; return reject(st, op, "LINEAGE_MISMATCH"); }
      const chosen = dom.txns.find((t) => t.member_set_commitment === op.chosen_alternative_commitment);
      if (H.chosenMustBeMaximum && !(chosen && dom.maxima.includes(chosen.op_id))) { st.seq--; return reject(st, op, "MALFORMED"); }
      const basisNow = basisOf(op.conflict_domain_id, dom.maxima);
      if (H.casCheck && op.seen_conflict_basis !== basisNow) { extraDisp = { applied: false, reason_code: "BASIS_STALE", copy: `Earned found ${dom.maxima.length} current versions of this plan. It is using ${JSON.stringify(dom.txns.find((t) => t.op_id === dom.effective).members.map((m) => m.value))} for now.` }; }
      else { const txn = { txn_id: op.requested_transaction_id, op_id: op.op_id, seq: seqNo, members: chosen.members.map((m) => ({ ...m })), member_set_commitment: chosen.member_set_commitment, parents: dom.maxima.slice(), before: { ...st.plan }, kind: "conflict-selection", provenance: "resolved" }; txn.lineage_key = lineageKey(dom, txn); dom.txns.push(txn); dom.maxima = [op.op_id]; st.txns.push(txn); recomputeEffective(st, op.conflict_domain_id); txn.after_digest = digestOf(planOfDomain(st, op.conflict_domain_id)); extraDisp = { applied: true, plan_transaction_id: txn.txn_id }; }
    }
    if (op.kind === "undo-request") extraDisp = undo(st, op, seqNo);
    if (op.kind === "proposal-response") extraDisp = respond(st, op);
    const d = store(st, op, sign({ op_id: op.op_id, canonical_content_commitment: H.receiptCommitment(op), device_id: op.device_id, device_seq: op.device_seq, status: "ACCEPTED", athlete_log_seq: seqNo, decided_at: "2026-09-03T00:00:00Z", ...extraDisp }));
    st.log.push(op); st.lastAccepted[op.device_id] = Math.max(st.lastAccepted[op.device_id] || 0, op.device_seq);
    for (const w of st.waiting.slice()) { if (st.waiting.indexOf(w) < 0) continue; const refs = (w.causal_parents || []).concat(w.target_op_id ? [w.target_op_id] : []); const ready = refs.every((r) => { const k = st.byOp.get(r); const h = k && st.slots.get(k.key); return h && h[h.length - 1].status !== "WAITING"; }); if (ready) { st.waiting.splice(st.waiting.indexOf(w), 1); const anyRejected = refs.some((r) => { const k = st.byOp.get(r); const h = st.slots.get(k.key); const s = h[h.length - 1].status; return s === "REJECTED" || s === "REJECTED_DEPENDENCY"; }); if (anyRejected) store(st, w, sign({ op_id: w.op_id, canonical_content_commitment: w.canonical_content_commitment, device_id: w.device_id, device_seq: w.device_seq, status: "REJECTED_DEPENDENCY", rejection_code: "REJECTED_DEPENDENCY", decided_at: "2026-09-03T00:00:00Z" })); else accept(st, w); } }
    return d;
  }
  const planOfDomain = (st, domId) => { const dom = st.domains[domId]; const t = dom && dom.txns.find((x) => x.op_id === dom.effective); const p = {}; if (t) for (const m of t.members) p[m.field] = m.value; return p; };
  function recomputeEffective(st, domId) { const dom = st.domains[domId]; const maxima = dom.txns.filter((t) => dom.maxima.includes(t.op_id) && !st.suspended.has(t.txn_id)); maxima.sort((a, b) => (H.lineageOrder === "numeric" ? cmpKey(a.lineage_key, b.lineage_key) : (JSON.stringify(a.lineage_key) < JSON.stringify(b.lineage_key) ? -1 : 1))); const win = maxima[0]; if (win) H.planApply(st.plan, { members: win.members }); dom.effective = win ? win.op_id : null; }
  function undo(st, op, seqNo) {
    if (H.undoOnce && st.undos.has(op.op_id)) return st.undos.get(op.op_id);
    const target = st.txns.find((t) => t.txn_id === op.target_plan_transaction_id); if (!target) return { applied: false, reason_code: "TARGET_UNKNOWN" };
    const domId = Object.keys(st.domains).find((d) => st.domains[d].txns.some((t) => t.txn_id === target.txn_id)); const dom = st.domains[domId];
    const eligible = !H.undoEligibility || (dom.maxima.length === 1 && dom.maxima[0] === target.op_id && !st.suspended.has(target.txn_id) && target.after_digest === digestOf(planOfDomain(st, domId)) && op.target_effect_digest === target.after_digest && op.compensating_group_commitment === hmac("group", canonicalEncode(target.before)));
    let res; if (!eligible) { const eff = planOfDomain(st, domId); res = { applied: false, reason_code: "PLAN_CHANGED_FIRST", copy: "Undo couldn't be applied — the plan changed first: " + Object.entries(eff).map(([k, v]) => v + " " + k).join(", ") + " is in effect." }; }
    else { const comp = { txn_id: "comp-" + op.op_id, op_id: op.op_id, seq: seqNo, members: Object.entries(target.before).filter(([k]) => target.members.some((m) => m.field === k)).map(([field, value]) => ({ field, value, provenance: "inherited" })), member_set_commitment: hmac("group", canonicalEncode(target.before)), parents: [target.op_id], before: { ...st.plan }, kind: "compensation", references: { request: op.op_id, target: target.txn_id }, provenance: "authored" }; comp.lineage_key = lineageKey(dom, comp); dom.txns.push(comp); dom.maxima = [op.op_id]; st.txns.push(comp); recomputeEffective(st, domId); comp.after_digest = digestOf(planOfDomain(st, domId)); res = { applied: true, plan_transaction_id: comp.txn_id, compensation_of: target.txn_id }; }
    st.undos.set(op.op_id, res); return res;
  }
  /* ---- state 8: issuance, instance identity, responses, coverage, apply ---- */
  function issue(athlete_id, iss) { const st = athletes[athlete_id]; const instance = H.instanceFromContent ? "inst-" + hmac("instance", canonicalEncode({ f: iss.proposal_family_id, g: iss.evidence_generation, o: iss.offer_digest })).slice(0, 12) : "inst-" + (st.issuances.size + 1); const rec = { ...iss, instance, accepted_at_seq: st.seq }; st.issuances.set(iss.issuance_id, rec); if (!st.instances.has(instance)) st.instances.set(instance, { issuances: [], responses: [], effect: null, apply: null, basisConfirmedThrough: iss.computed_through_watermark }); st.instances.get(instance).issuances.push(iss.issuance_id); return { instance, accepted: true }; }
  function respond(st, op) { const iss = st.issuances.get(op.payload.issuance_id.value === undefined ? op.payload.issuance_id : op.payload.issuance_id.value); if (!iss) return { applied: false, reason_code: "UNKNOWN_ISSUANCE" }; const inst = st.instances.get(iss.instance); inst.responses.push({ op_id: op.op_id, outcome: op.payload.chosen_outcome_id.value === undefined ? op.payload.chosen_outcome_id : op.payload.chosen_outcome_id.value, consent_digest: op.payload.consent_digest.value === undefined ? op.payload.consent_digest : op.payload.consent_digest.value, seq: st.seq }); return { instance: iss.instance }; }
  function apply(athlete_id, req) {
    const st = athletes[athlete_id]; if (H.applyIdempotent && st.applies.has(req.apply_request_id)) return st.applies.get(req.apply_request_id);
    const resp = st.log.find((o) => o.op_id === req.response_op_id); const issId = resp && (resp.payload.issuance_id.value === undefined ? resp.payload.issuance_id : resp.payload.issuance_id.value); const iss = issId && st.issuances.get(issId); if (!iss) return { status: "non_applied", reason_code: "UNKNOWN_RESPONSE", evaluated_through_W: st.log.length };
    const inst = st.instances.get(iss.instance); const decisionOps = new Set(inst.responses.map((r) => r.op_id));
    /* COVERAGE (A6): any OTHER client op accepted after computed_through_watermark pauses application */
    const others = st.log.filter((o, i) => i >= inst.basisConfirmedThrough && !decisionOps.has(o.op_id) && o.kind !== "proposal-response");
    let result;
    if (H.coverageCheck && others.length) result = { status: "non_applied", reason_code: "PAUSED_COVERAGE", paused: true, evaluated_through_W: st.log.length, copy: "Your answer from earlier couldn't be applied yet — new entries arrived first. Here is the current picture." };
    else { const answers = inst.responses; const outcomes = new Set(answers.map((r) => r.outcome));
      if (outcomes.size > 1) { if (inst.effect) st.suspended.add(inst.effect); result = { status: "conflict_suspended", reason_code: "CONTRADICTORY_RESPONSES", evaluated_through_W: st.log.length }; if (inst.effect) recomputeEffective(st, "protein"); }
      else if (inst.effect && H.uniquenessPerInstance) result = { status: "effective", reason_code: "EXISTING_TRANSACTION", plan_transaction_id: inst.effect, evaluated_through_W: st.log.length };
      else { const outcome = [...outcomes][0]; if (outcome === "KEEP" || outcome === "NO") result = { status: "decision_settled_no_effect", reason_code: "KEEP_OR_NO", evaluated_through_W: st.log.length }; else { const dom = st.domains["protein"] || (st.domains["protein"] = { lineage: "lin-protein-1", maxima: [], txns: [] }); const txn = { txn_id: "txn-apply-" + iss.instance, op_id: req.response_op_id, seq: ++st.seq, members: (iss.apply_members || [{ field: "protein_g", value: 160, provenance: "inherited" }]).map((m) => ({ ...m })), member_set_commitment: hmac("m", canonicalEncode(iss.apply_members || [])), parents: dom.maxima.slice(), before: { ...st.plan }, kind: "consented", provenance: "consented", instance: iss.instance }; txn.lineage_key = lineageKey(dom, txn); dom.txns.push(txn); dom.maxima = [req.response_op_id]; st.txns.push(txn); recomputeEffective(st, "protein"); txn.after_digest = digestOf(planOfDomain(st, "protein")); inst.effect = txn.txn_id; result = { status: "effective", reason_code: "APPLIED", plan_transaction_id: txn.txn_id, evaluated_through_W: st.log.length }; } } }
    st.applies.set(req.apply_request_id, result); return result;
  }
  function confirmBasis(athlete_id, instance, recomputedUnchanged) { const st = athletes[athlete_id]; const inst = st.instances.get(instance); if (!inst) return null; if (recomputedUnchanged) { inst.basisConfirmedThrough = st.log.length; return { confirmed: true, through: st.log.length }; } inst.superseded = true; return { confirmed: false, reissue: true, oldAnswerNonApplied: true }; }
  return {
    admit, log: (a) => athletes[a].log.slice(), frontier: (a) => athletes[a].log.length,
    disposition: (a, dev, seq) => { const h = athletes[a].slots.get(dev + ":" + seq); return h ? h[h.length - 1] : null; }, dispositionHistory: (a, dev, seq) => (athletes[a].slots.get(dev + ":" + seq) || []).slice(),
    verifyDisposition: (d) => !!d && d.authority_signature === hmac(AUTH_KEY, "earned/disposition/v1" + canonicalEncode({ ...d, authority_signature: undefined })),
    injectCrash: (p) => { crash = p; }, clearCrash: () => { crash = null; },
    plan: (a) => ({ ...athletes[a].plan }), planTransactions: (a) => athletes[a].txns.slice(), planOfDomain: (a, d) => planOfDomain(athletes[a], d),
    planState: (a, domId) => { const st = athletes[a]; const dom = st.domains[domId] || { maxima: [], txns: [], effective: null }; return { effective: dom.effective, maxima: dom.maxima.slice().sort(), basis: basisOf(domId, dom.maxima), alternatives: dom.maxima.filter((m) => m !== dom.effective).sort(), lineageKeys: Object.fromEntries(dom.txns.filter((t) => dom.maxima.includes(t.op_id)).map((t) => [t.op_id, t.lineage_key])), effectDigest: digestOf(planOfDomain(st, domId)), memberSetCommitments: Object.fromEntries(dom.txns.map((t) => [t.op_id, t.member_set_commitment])), copy: dom.maxima.length > 1 ? `Earned found ${dom.maxima.length} current versions of this plan. It is using ${JSON.stringify((dom.txns.find((t) => t.op_id === dom.effective) || { members: [] }).members.map((m) => m.value))} for now. ${dom.maxima.length - 1} alternative${dom.maxima.length - 1 === 1 ? " is" : "s are"} in History.` : null }; },
    txnDigests: (a, txnId) => { const t = athletes[a].txns.find((x) => x.txn_id === txnId); return t ? { after: t.after_digest, beforeGroupCommitment: hmac("group", canonicalEncode(t.before)) } : null; },
    revokeDevice: (a, dev) => { const st = athletes[a]; const barrier = H.barrierOf(st, dev); st.revoked[dev] = barrier; return { barrier, declared_loss: !!H.declaredLoss, copy: H.declaredLoss ? "This phone was removed from your account — unsynced entries on this phone will be lost." : "" }; },
    issue, apply, confirmBasis, instanceOf: (a, issuance_id) => (athletes[a].issuances.get(issuance_id) || {}).instance, instanceState: (a, inst) => athletes[a].instances.get(inst),
    exportSnapshot: (a, o = {}) => { const st = athletes[a]; const W = st.log.length; const partial = (o.outboxPending || 0) > 0; return { W, label: H.exportLabelQualified ? (partial ? `Partial export — this device's watermark ${W}, ${o.outboxPending} entr${o.outboxPending === 1 ? "y" : "ies"} still pending` : `Complete through W${W} for all synced records`) : "Complete", partial, pending: o.outboxPending || 0, rejectedAppendix: (o.rejected || []).slice(), otherDeviceNote: "Entries still saved only on another device are not included. Sync that device first to include them.", records: st.log.length }; },
    /* LOCAL COMMIT under the lease — full local validation (Sol suite-pass-2 finding 6) */
    localCommitter: (lease, clock = {}) => { const c = { mono: clock.mono || "2026-09-03T00:00:00Z", highWater: clock.highWater || clock.mono || "2026-09-03T00:00:00Z", serverTime: clock.serverTime || null, continuityProven: clock.continuityProven !== false, timeCheck: hooks.timeCheck !== false, rangeCheck: hooks.rangeCheck !== false, continuityCheck: hooks.continuityCheck !== false, useHighWater: hooks.useHighWater !== false, signatureCheck: hooks.signatureCheck !== false, bindingCheck: hooks.bindingCheck !== false, schemaCheck: hooks.schemaCheck !== false, notBeforeCheck: hooks.notBeforeCheck !== false, device: clock.device_id || (lease && lease.device_id), athlete: clock.athlete_id || (lease && lease.athlete_id), schema: clock.schema_version == null ? 1 : clock.schema_version }; const saved = [];
      return { advance: (t) => { c.mono = t; if (t > c.highWater) c.highWater = t; }, rollback: (t) => { c.mono = t; }, restore: (o) => { c.continuityProven = !!(o && o.proven); }, syncedServerTime: (t) => { c.serverTime = t; if (t > c.highWater) c.highWater = t; c.continuityProven = true; },
        commitLocal: (op) => { const now = c.useHighWater ? c.highWater : c.mono;
          if (c.signatureCheck && !leaseValid(lease)) return { saved: false, state: 20, reason: "no valid lease (signature)" };
          if (c.bindingCheck && (lease.device_id !== c.device || lease.device_id !== op.device_id || lease.athlete_id !== c.athlete || lease.athlete_id !== op.athlete_id || lease.lease_id !== op.lease_id)) return { saved: false, state: 20, reason: "lease not bound to this device/athlete/op" };
          if (c.schemaCheck && lease.schema_version !== c.schema) return { saved: false, state: 20, reason: "schema lease mismatch — update Earned" };
          if (c.continuityCheck && !c.continuityProven) return { saved: false, state: 20, reason: "clock continuity unproven" };
          if (c.notBeforeCheck && now < lease.not_before) return { saved: false, state: 20, reason: "before not_before" };
          if (c.timeCheck && now > lease.not_after) return { saved: false, state: 20, reason: "expired" };
          if (c.rangeCheck && (op.device_seq < lease.range[0] || op.device_seq > lease.range[1])) return { saved: false, state: 20, reason: "range exhausted" };
          saved.push(op.op_id); return { saved: true }; }, saved: () => saved.slice() }; },
    CODES, _cmpKey: cmpKey,
  };
}
module.exports = { create, CODES, cmpKey };
