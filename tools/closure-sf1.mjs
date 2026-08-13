/* THE SPLIT-PATCH FIX-ROUND-1 CLOSURE MATRIX — Sol's eight, adopted verbatim
   as the pin set (owner directive 2026-08-13). One implementation, two
   harnesses: tools/engine-test.jsx runs it as permanent pins; the fail-first
   runner executes the SAME assertions against the 9e40815 bundle and records
   each red (the mutation culture, formalized — a closure test that cannot fail
   on the unfixed tip proves nothing about the fix).

   Each test is wrapped: a THROW (missing surface on the old bundle) registers
   as a FAIL naming the throw — "cannot pass on 9e40815" is the requirement,
   and a throw satisfies it, recorded honestly as such. */
export function runClosureSF1(T, ok, readFileSync) {
  const cl = (x) => JSON.parse(JSON.stringify(x));
  const slp = { clean: true, last: { h: 8 }, mean3: 8 };
  /* a REAL v50 state: pronated present, split-born structures absent */
  const rawV50 = (mut) => {
    const s = cl(T.SEED); s.v = 50; delete s.insertions; delete s.retirements; s.planGen = undefined;
    s.exercises = s.exercises.filter((e) => e.id !== "fly" && e.id !== "hipthrust");
    s.exercises.push({ id: "pronated", mg: "forearms", n: "Pronated EZ curl", day: "U", w: 40, inc: 5, sets: 2, hi: 13, last: [12, 11], setup: "SET · EZ bar, pronated grip\ncue" });
    s.exOrder = { U: s.exercises.filter((e) => e.day === "U").map((e) => e.id), L: s.exercises.filter((e) => e.day === "L").map((e) => e.id) };
    if (mut) mut(s); return s;
  };
  const mig50 = (mut) => T.migrate(rawV50(mut));
  const t = (label, fn) => { try { fn(); } catch (e) { ok(false, label + " — THREW: " + String(e && e.message).slice(0, 120)); } };

  /* ---- CLOSURE 1 — the real debut flow, both new lifts ---- */
  t("CLOSURE 1", () => {
    const m = mig50();
    const sessU = T.genSession(m, "2026-08-20", slp);
    const fly = sessU.ex.find((x) => x.id === "fly");
    ok(!!(fly && fly.baselineAsk === true && fly.w == null && fly.tgt.every((x) => x === 0)),
      "CLOSURE 1a — the fly card is the DEBUT/BASELINE ASK: no chase targets fabricated from hi-2 (tgt [18,18] with no load path on 9e40815)");
    const src1 = readFileSync("src/app.jsx", "utf8");
    ok(src1.indexOf("LOAD USED (LB)") > -1 && src1.indexOf("first session: enter the load you used") > -1,
      "CLOSURE 1b — BOTH session modes render a load entry for null-w configs (TRAIN's input + Gym Mode's CAGE copy; neither existed on 9e40815)");
    const r1 = T.completeSession(m, "2026-08-20", [{ id: "fly", reps: [14, 12], rir: 2, rirEnd: 1, w: 90 }], slp, { pg: m.planGen });
    const flyEx = r1.s.exercises.find((x) => x.id === "fly");
    const flyEn = (r1.s.sessionLog["2026-08-20"].entries || []).find((e) => e.id === "fly");
    ok(!!(flyEx && flyEx.w === 90 && typeof flyEx.wAt === "string" && flyEn && flyEn.w === 90),
      "CLOSURE 1c — FINISH adopts the typed load through the REAL flow (stamped) and the persisted sessionLog carries it");
    const sess2 = T.genSession(r1.s, "2026-08-23", slp);
    const fly2 = sess2.ex.find((x) => x.id === "fly");
    ok(!!(fly2 && !fly2.baselineAsk && fly2.w === 90 && fly2.tgt.every((x) => typeof x === "number" && x > 0)),
      "CLOSURE 1d — the NEXT card prescribes from what the debut gave, at the adopted load");
    const rH = T.completeSession(m, "2026-08-21", [{ id: "hipthrust", reps: [10, 9, 9], rir: 2, rirEnd: 1, w: 140 }], slp, { pg: m.planGen });
    const htEx = rH.s.exercises.find((x) => x.id === "hipthrust");
    const ht2 = T.genSession(rH.s, "2026-08-24", slp).ex.find((x) => x.id === "hipthrust");
    ok(!!(htEx && htEx.w === 140 && typeof htEx.wAt === "string" && ht2 && !ht2.baselineAsk && ht2.w === 140),
      "CLOSURE 1e — the hip thrust runs the same full debut flow: ask -> typed load -> adoption -> next card at the adopted load");
  });

  /* ---- CLOSURE 2 — persisted wKey/og; the seam stays FIXED under og-51 sessions ---- */
  t("CLOSURE 2", () => {
    const m = mig50();
    const curlW = m.exercises.find((x) => x.id === "curl").w;
    const r = T.completeSession(m, "2026-08-20", [
      { id: "curl", reps: [11, 11, 10], rir: 2 },
      { id: "hanging", reps: [12, 11, 10], rir: 2 },
    ], slp, { pg: 51 });
    const enC = (r.s.sessionLog["2026-08-20"].entries || []).find((e) => e.id === "curl");
    const enHg = (r.s.sessionLog["2026-08-20"].entries || []).find((e) => e.id === "hanging");
    ok(!!(enC && enC.wKey === String(curlW) && enC.og === 51),
      "CLOSURE 2a — a REAL curl completion persists wKey (the non-numeric config) and og (both DISCARDED by the projection at ~1905 on 9e40815)");
    ok(!!(enHg && enHg.wKey === String(m.exercises.find((x) => x.id === "hanging").w) && enHg.og === 51),
      "CLOSURE 2b — hanging (BW) persists its config wKey the same way");
    const rHk = T.completeSession(m, "2026-08-21", [{ id: "hack", reps: [10, 9, 8], rir: 2 }], slp, { pg: 51 });
    const enHk = (rHk.s.sessionLog["2026-08-21"].entries || []).find((e) => e.id === "hack");
    ok(!!(enHk && enHk.wKey === String(m.exercises.find((x) => x.id === "hack").w) && enHk.og === 51),
      "CLOSURE 2c1 — hack (config 'hold' on the live seed — non-numeric) persists its wKey and og like the others");
    const rPr = T.completeSession(m, "2026-08-20", [{ id: "press", reps: [8, 8, 7, 6], rir: 2 }], slp, { pg: 51 });
    const enPr = (rPr.s.sessionLog["2026-08-20"].entries || []).find((e) => e.id === "press");
    ok(!!(enPr && enPr.wKey == null && enPr.og === 51 && typeof m.exercises.find((x) => x.id === "press").w === "number"),
      "CLOSURE 2c2 — a numeric-load press completion carries og and NO wKey (numeric configs anchor on w itself)");
    /* two new-order sessions, then the sweep: the seam may not move */
    const seamOf = (s9, id9) => (((s9.exercises.find((x) => x.id === id9) || {}).forks) || []).filter((f) => f && f.split).map((f) => f.from).join("|");
    const before = seamOf(r.s, "curl");
    const r2 = T.completeSession(r.s, "2026-08-23", [{ id: "curl", reps: [11, 11, 10], rir: 2 }], slp, { pg: 51 });
    const swept = T.runAdaptive(r2.s, "2026-08-24");
    ok(seamOf(swept, "curl") === before && before.length > 0,
      "CLOSURE 2d — two new-order (og 51) sessions leave the seam FIXED: re-dating consumes only old-order entries (og-less persistence dragged the seam past NEW sessions on 9e40815)");
  });

  /* ---- CLOSURE 3 — a persisted pg-50 draft across the migration ---- */
  t("CLOSURE 3", () => {
    const raw = rawV50();
    const draft = { pg: 50, ids: raw.exOrder.U.slice(), reps: { pronated: [12, 11] } };
    const m = T.migrate(cl(raw));
    const base = T.genSession(m, "2026-08-20", slp);
    const frozen = T.sessionFromDraft(m, "2026-08-20", slp, draft, base);
    ok(JSON.stringify(frozen.ex.map((x) => x.id)) === JSON.stringify(draft.ids),
      "CLOSURE 3a — resume mounts the DRAFT'S exact old ids and order across the migration (9e40815 regenerated the v51 template mid-session)");
    const pr = frozen.ex.find((x) => x.id === "pronated");
    ok(!!(pr && pr.n === "Pronated EZ curl" && pr.w === 40),
      "CLOSURE 3b — the captured pronated resolves from the PRESERVED record, never orphan-quarantine");
    const r = T.completeSession(m, "2026-08-20", [{ id: "pronated", reps: [12, 11], rir: 2, w: 40 }], slp, { pg: draft.pg });
    const en = (r.s.sessionLog["2026-08-20"].entries || []).find((e) => e.id === "pronated");
    ok(!!(en && en.og === 50),
      "CLOSURE 3c — the honest pronated completion carries the DRAFT'S generation (og 50): old-era provenance, so canonicalization dates seams past it");
  });

  /* ---- CLOSURE 4 — pg-less proposals: migration sweep + both acceptance lanes ---- */
  t("CLOSURE 4", () => {
    const m = mig50((s) => {
      s.agentProposals = [{ id: "vx0", kind: "volume", mg: "quads", exId: "hack", dir: 1, title: "VOLUME +1 — QUADS" }];
      s.proposals = [...(s.proposals || []), { rid: "volpush_quads_a", id: "vpa0", d: "2026-08-01", title: "QUADS — EARNED VOLUME", why: "w", apply: { kind: "sets", exId: "hack", delta: 1 } }];
    });
    ok(!(m.agentProposals || []).some((ap) => ap && ap.kind === "volume") && (m.feed || []).some((f) => f && f.op && String(f.op).indexOf("supersede:") === 0),
      "CLOSURE 4a — migration sweeps the pg-less order-derived pending set with honest op-keyed supersede receipts (all 8 live cards rode through untouched on 9e40815)");
    ok(((m.proposals || []).find((p) => p && p.id === "vpa0") || {}).resolved === true,
      "CLOSURE 4b — the s.proposals lane is swept too");
    const hackW = m.exercises.find((x) => x.id === "hack").sets;
    const acc = T.applyAgentProposal(cl({ ...m, agentProposals: [{ id: "vy0", kind: "volume", mg: "quads", exId: "hack", dir: 1, title: "V+1" }] }), { id: "vy0", kind: "volume", mg: "quads", exId: "hack", dir: 1, title: "V+1" }, "2026-08-20");
    ok((acc.exercises.find((x) => x.id === "hack") || {}).sets === hackW && (acc.feed || []).some((f) => f && f.t && f.t.indexOf("OFFER SUPERSEDED") === 0),
      "CLOSURE 4c — agent lane: a pg-ABSENT order-derived offer restored by a stale merge supersedes at the tap ('rejects only a non-null older generation' was the hole)");
    const s2 = cl(m); s2.proposals = [...(s2.proposals || []), { rid: "volpush_x9", id: "vpx99", d: "2026-08-19", title: "T", why: "w", apply: { kind: "sets", exId: "hack", delta: 1 } }];
    const acc2 = T.applyProposal(s2, "vpx99");
    ok((acc2.exercises.find((x) => x.id === "hack") || {}).sets === hackW && ((acc2.proposals || []).find((p) => p && p.id === "vpx99") || {}).superseded === true,
      "CLOSURE 4d — s.proposals lane: the same generation guard (this lane had NEITHER guard on 9e40815)");
    const s3 = cl(m); s3.proposals = [...(s3.proposals || []), { rid: "volpush_p9", id: "vpp99", d: "2026-08-19", pg: 51, title: "T", why: "w", apply: { kind: "sets", exId: "pronated", delta: 1 } }];
    const prSets = (s3.exercises.find((x) => x.id === "pronated") || {}).sets;
    const acc3 = T.applyProposal(s3, "vpp99");
    ok((acc3.exercises.find((x) => x.id === "pronated") || {}).sets === prSets && ((acc3.proposals || []).find((p) => p && p.id === "vpp99") || {}).superseded === true,
      "CLOSURE 4e — a retired target takes no proposal even at the current generation: exActive at the tap (9e40815 mutated tombstoned pronated)");
    const srcRA = readFileSync("src/app.jsx", "utf8");
    ok(srcRA.indexOf("normalizePlan(s);   /* FIX split-1 (P0-4) — THE SWEEP CALL SITE, moved to the head") > -1,
      "CLOSURE 4f — runAdaptive normalizes at its HEAD, before any order-derived producer (the sweep ran ~70 lines after the producers on 9e40815)");
  });

  /* ---- CLOSURE 5 — canonicalization at every boundary, both orders, planGen 52 ---- */
  t("CLOSURE 5", () => {
    const m = mig50();
    const seed = (s9, id9, fks) => { const e9 = s9.exercises.find((x) => x.id === id9); e9.forks = [...(e9.forks || []), ...fks]; };
    /* same-operation, different dates (two devices fired one insertion offline) */
    const A = cl(m), B = cl(m);
    seed(A, "curl", [{ from: "2026-08-20", why: "ghost inserted upstream", ops: ["ghost inserted upstream"], prevN: "x", split: true }]);
    seed(B, "curl", [{ from: "2026-08-22", why: "ghost inserted upstream", ops: ["ghost inserted upstream"], prevN: "x", split: true }]);
    const ab = T.mergeState(cl(A), cl(B)), ba = T.mergeState(cl(B), cl(A));
    ok(JSON.stringify(ab.exercises.find((x) => x.id === "curl").forks) === JSON.stringify(ba.exercises.find((x) => x.id === "curl").forks),
      "CLOSURE 5a — both merge orders land deeply equal fork sets");
    const gf = ab.exercises.find((x) => x.id === "curl").forks.filter((f) => f.ops && f.ops.indexOf("ghost inserted upstream") > -1);
    ok(gf.length === 1 && gf[0].from === "2026-08-20",
      "CLOSURE 5b — same-operation different-date seams collapse to ONE at the earliest sighting (from-keyed union kept both on 9e40815)");
    /* same-date composite metadata */
    const C = cl(m), D = cl(m);
    seed(C, "ham", [{ from: "2026-08-25", why: "opX inserted upstream", ops: ["opX inserted upstream"], prevN: "Ham", split: true }]);
    seed(D, "ham", [{ from: "2026-08-25", why: "opY inserted upstream", ops: ["opY inserted upstream"], prevN: "Ham", split: true }]);
    const cd = T.mergeState(cl(C), cl(D)), dc = T.mergeState(cl(D), cl(C));
    const hf = cd.exercises.find((x) => x.id === "ham").forks.find((f) => f.from === "2026-08-25");
    ok(JSON.stringify(cd.exercises.find((x) => x.id === "ham").forks) === JSON.stringify(dc.exercises.find((x) => x.id === "ham").forks)
      && !!hf && JSON.stringify((hf.ops || []).slice().sort()) === JSON.stringify(["opX inserted upstream", "opY inserted upstream"]),
      "CLOSURE 5c — same-date metadata UNIONS deterministically, both orders (the byFrom overwrite let the local side's metadata win on 9e40815)");
    /* planGen 52: order enforcement stands down; canonicalization does not */
    const g52 = cl(m); g52.planGen = 52;
    g52.exOrder = { U: cl(m.exOrder.U).reverse(), L: cl(m.exOrder.L) };
    seed(g52, "rows", [
      { from: "2026-08-20", why: "ghost2 inserted upstream", ops: ["ghost2 inserted upstream"], prevN: "x", split: true },
      { from: "2026-08-23", why: "ghost2 inserted upstream", ops: ["ghost2 inserted upstream"], prevN: "x", split: true },
    ]);
    const sw52 = T.normalizePlan(cl(g52));
    ok(JSON.stringify(sw52.exOrder.U) === JSON.stringify(g52.exOrder.U)
      && sw52.exercises.find((x) => x.id === "rows").forks.filter((f) => f.ops && f.ops.indexOf("ghost2 inserted upstream") > -1).length === 1,
      "CLOSURE 5d — at planGen 52 the custom order STANDS while seams still canonicalize (the whole pass stood down together on 9e40815)");
    const srcB = readFileSync("src/app.jsx", "utf8");
    ok(srcB.indexOf("return canonicalizePlan(out);") > -1,
      "CLOSURE 5e — mergeState returns through canonicalizePlan, so the sync upload body, the 409 re-merge and the cloud restore are canonical BY CONSTRUCTION (ghSync uploaded raw merge output on 9e40815)");
  });

  /* ---- CLOSURE 6 — migrated pronated through every generator/acceptor ---- */
  t("CLOSURE 6", () => {
    const m = mig50((s) => {
      const pr = s.exercises.find((x) => x.id === "pronated");
      pr.lastMeta = { d: "2026-08-05", w: 40, reps: [12, 11] };
      s.queue = [...(s.queue || []), { id: "q_pr9", kind: "debut", exId: "pronated", newW: 45, t: "PRONATED 45 DEBUT", state: "DEBUT", gate: "g", rule: "r", done: false }];
    });
    ok(!(T.coarseLifts(m) || []).some((c) => c.id === "pronated"),
      "CLOSURE 6a — coarseLifts: a retired lift's plates are nobody's problem (the migrated microload note named pronated on 9e40815)");
    const ps = T.pickStructural(m, "2026-08-20", slp);
    ok(!(ps.main && ps.main.exId === "pronated") && !(ps.riders || []).some((q) => q.exId === "pronated"),
      "CLOSURE 6b — pickStructural: a retired lift wins no structural slot");
    const mv = T.muscleVolume(m);
    ok(!mv.some((row) => (row.lifts || []).some((l) => l.id === "pronated")),
      "CLOSURE 6c — muscleVolume candidate reconstruction: retired ids may never re-enter future offers");
    const srcE = readFileSync("src/app.jsx", "utf8");
    ok(srcE.indexOf('if (!exActive(s, ex.id)) return;   /* FIX split-1 (P1-1): a retired lift takes no reset */') > -1
      && srcE.indexOf('if (!exActive(s, ex9.id)) return;   /* FIX split-1 (P1-1): a retired lift files no rollback */') > -1
      && srcE.indexOf('filter((e) => exActive(s, e.id) && (e.last || e.std)).slice(0, 12)') > -1,
      "CLOSURE 6d — stall/reset generation, rollback generation and the analyst next-session prompt all project through exActive (none did on 9e40815)");
  });

  /* ---- CLOSURE 7 — hostile ID, missing containers, patch rerun, equal-stamp ties ---- */
  t("CLOSURE 7", () => {
    const mBad = T.migrate(rawV50((s) => { s.exercises.push({ id: "fly", day: "U" }); }));
    ok((mBad.retirements || {}).fly === "invalid:2026-08-12" && mBad.exercises.some((e) => e && e.id === "fly"),
      "CLOSURE 7a — a malformed pre-existing {id:'fly',day:'U'} is preserved-but-INACTIVE via the shared validity predicate (the early return let it WALK on 9e40815)");
    const mNf = T.migrate(rawV50((s) => { delete s.feed; }));
    ok(Array.isArray(mNf.feed) && mNf.feed.length > 0,
      "CLOSURE 7b — migration heals a missing feed container before any receipt lands");
    const m1 = mig50();
    const rerun = T.migrate(cl({ ...m1, v: 50 }));
    ok(rerun.feed.length === m1.feed.length && JSON.stringify(rerun.exOrder) === JSON.stringify(m1.exOrder) && JSON.stringify(rerun.retirements) === JSON.stringify(m1.retirements),
      "CLOSURE 7c — a direct patch rerun adds ZERO receipts and moves nothing (the eleven FRESH BASELINE receipts re-minted on 9e40815)");
    const P = mig50(), Q = cl(P);
    const tie = "2026-08-20T12:00:00.000Z";
    P.exercises.find((x) => x.id === "press").hi = 7; P.exercises.find((x) => x.id === "press").hiAt = tie;
    Q.exercises.find((x) => x.id === "press").hi = 9; Q.exercises.find((x) => x.id === "press").hiAt = tie;
    const pq = T.mergeState(cl(P), cl(Q)).exercises.find((x) => x.id === "press").hi;
    const qp = T.mergeState(cl(Q), cl(P)).exercises.find((x) => x.id === "press").hi;
    ok(pq === 9 && qp === 9,
      "CLOSURE 7d — an equal-stamp conflict resolves IDENTICALLY from both merge directions, by value (local-wins ties flipped with direction on 9e40815; the 'both results are numbers' straw assertion is replaced by this value equality)");
  });

  /* ---- CLOSURE 8 — the words freeze green after the reader fix ---- */
  t("CLOSURE 8", () => {
    const FIX = JSON.parse(readFileSync("tools/debrief-words.json", "utf8"));
    let all = true, n = 0;
    for (const snap of Object.keys(FIX)) {
      const st = T.migrate(JSON.parse(readFileSync("tools/snapshots/" + snap + "-ledger.json", "utf8")));
      for (const iso of Object.keys(FIX[snap])) {
        n++;
        if (JSON.stringify(T.debriefWords(T.sessionDebrief(st, iso))) !== JSON.stringify(FIX[snap][iso])) all = false;
      }
    }
    ok(all && n >= 16,
      "CLOSURE 8 — the words freeze is green on the ORIGINAL 2f3c19c-lineage bytes for every count-driven leaf (the P1-9 slot fix), with exactly the TWO owner-ruled item-h curl leaves amended under a guard that aborts on anything else — " + n + " session debriefs byte-compared");
  });
}
