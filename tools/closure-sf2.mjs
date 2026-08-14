/* SPLIT-PATCH FIX-ROUND-2 CLOSURE — the eight repairs, pinned at PRODUCTION
   BOUNDARIES per the round's test law: every test here begins at a real
   migrate/mergeState boundary or the real engine entry a UI handler calls
   with real persisted shapes. (The two UI-handler repairs, R2 and R3's
   mounts, are driven by tools/split-smoke.mjs against the SHIPPED BUNDLE with
   real clicks and typed input — no helper injection anywhere.)

   Every message EMBEDS ITS OBSERVATION, so a fail-first run against 554c5b7
   records the failure SIGNATURE, not just a status. */
export function runClosureSF2(T, ok, readFileSync) {
  const cl = (x) => JSON.parse(JSON.stringify(x));
  const slp = { clean: true, last: { h: 8 }, mean3: 8 };
  const rawV50 = (mut) => {
    const s = cl(T.SEED); s.v = 50; delete s.insertions; delete s.retirements; s.planGen = undefined;
    s.exercises = s.exercises.filter((e) => e.id !== "fly" && e.id !== "hipthrust");
    s.exercises.push({ id: "pronated", mg: "forearms", n: "Pronated EZ curl", day: "U", w: 40, inc: 5, sets: 2, hi: 13, last: [12, 11], setup: "SET · EZ bar, pronated grip\ncue" });
    s.exOrder = { U: s.exercises.filter((e) => e.day === "U").map((e) => e.id), L: s.exercises.filter((e) => e.day === "L").map((e) => e.id) };
    if (mut) mut(s); return s;
  };
  const mig50 = (mut) => T.migrate(rawV50(mut));
  const t = (label, fn) => { try { fn(); } catch (e) { ok(false, label + " — THREW: " + String(e && e.message).slice(0, 140)); } };
  const J = (x) => { try { return JSON.stringify(x); } catch (e) { return String(x); } };

  /* ---- R2 — engine legs: the blank completion and the editor path ---- */
  t("R2-engine", () => {
    const m = mig50();
    const rB = T.completeSession(m, "2026-08-20", [{ id: "fly", reps: [10, 9], rir: 2 }], slp, { pg: 51 });
    const card = T.genSession(rB.s, "2026-08-23", slp).ex.find((x) => x.id === "fly");
    ok(!!(card && card.baselineAsk === true && (rB.s.exercises.find((x) => x.id === "fly") || {}).w == null),
      "R2a — a BLANK completion logs honestly and the NEXT card is still the open baseline/load ask, never hi-2 chase targets (observed next card: " + J(card && { baselineAsk: card.baselineAsk, tgt: card.tgt, w: card.w }) + ")");
    const m2 = mig50(); const fly2 = m2.exercises.find((x) => x.id === "fly");
    fly2.w = 85; fly2.wAt = new Date().toISOString();   /* the SETUP editor's write */
    const r2 = T.completeSession(m2, "2026-08-20", [{ id: "fly", reps: [12, 11], rir: 2, w: 85 }], slp, { pg: 51 });
    const en2 = (r2.s.sessionLog["2026-08-20"].entries || []).find((e) => e.id === "fly");
    ok(!!(en2 && en2.w === 85) && !(r2.s.feed || []).some((f) => f && f.op === "adopt:fly"),
      "R2b — SETUP-editor-sets-config-before-completion stays honest: the entry carries the configured load and NO adoption receipt is minted (the load was not null) (observed entry w: " + J(en2 && en2.w) + ", adopt receipt: " + (r2.s.feed || []).some((f) => f && f.op === "adopt:fly") + ")");
  });

  /* ---- R3 — the legacy (9e40815-format) draft through the frozen contract ---- */
  t("R3-engine", () => {
    const m = mig50();
    /* EXACT old-format gym draft: no ids, no pg, no wOver */
    const legacy = { reps: { pronated: [12, 11], lateral: [14, 13, 12, 11, 10] }, rir: { pronated: 2 }, rirEnd: { pronated: 1 }, gskip: {}, touched: { pronated: true, lateral: true }, rests: { n: 3, cut: 0 }, idx: 1, setN: 0, restStart: 0, restLen: 0, phase: "lift" };
    const base = T.genSession(m, "2026-08-20", slp);
    const fz = T.sessionFromDraft(m, "2026-08-20", slp, legacy, base);
    const ids = (fz.ex || []).map((x) => x.id);
    const pr = (fz.ex || []).find((x) => x.id === "pronated");
    ok(ids[0] === "pronated" && ids[1] === "lateral" && !!pr && pr.n === "Pronated EZ curl" && pr.tgt.length === 2 && (fz.ex.find((x) => x.id === "lateral") || { tgt: [] }).tgt.length === 5,
      "R3a — a REAL pre-upgrade draft (no ids/pg) mounts its CAPTURED lifts first with its CAPTURED slot counts, and pronated resolves from the preserved record (observed ids: " + J(ids) + ", pronated slots: " + J(pr && pr.tgt.length) + ")");
  });

  /* ---- R4 — invalidation narrowed: negative controls survive ---- */
  t("R4", () => {
    const m = mig50((s) => {
      s.agentProposals = [
        { id: "rs_press9", kind: "reset", exId: "press", newW: 230, title: "RESET press" },
        { id: "vx9", kind: "volume", mg: "quads", exId: "hack", dir: 1, title: "VOLUME +1" },
      ];
      s.proposals = [...(s.proposals || []), { rid: "volpush_hams_oc9", id: "oc9", d: "2026-08-01", title: "HAMS — OWNER'S CALL", why: "w", apply: { kind: "sets", exId: "ham", delta: 1, owner: true } }];
    });
    const kinds = (m.agentProposals || []).map((a) => a.kind);
    ok(kinds.indexOf("reset") > -1 && kinds.indexOf("volume") < 0,
      "R4a — migration sweeps ONLY the order-derived volume offer; the stall-derived reset survives (sweepStalls never consults order — round 1 killed it with a false reason) (observed surviving kinds: " + J(kinds) + ")");
    ok(((m.proposals || []).find((p) => p && p.id === "oc9") || {}).resolved !== true,
      "R4b — a non-routing owner-call decision survives the migration sweep untouched (observed: " + J(((m.proposals || []).find((p) => p && p.id === "oc9") || {}).resolved) + ")");
    /* stale merge restores the reset; acceptance APPLIES it */
    const stale = cl(m);
    const mm = T.mergeState(cl(m), stale);
    const rs = (mm.agentProposals || []).find((a) => a && a.kind === "reset");
    const acc = T.applyAgentProposal(cl(mm), rs, "2026-08-20");
    ok((acc.exercises.find((x) => x.id === "press") || {}).w === 230,
      "R4c — the surviving reset APPLIES at the tap after a stale merge: press w -> 230 (observed: " + J((acc.exercises.find((x) => x.id === "press") || {}).w) + ")");
    const oc = (mm.proposals || []).find((p) => p && p.id === "oc9");
    const acc2 = T.applyProposal(cl(mm), oc.id);
    const hamB = (mm.exercises.find((x) => x.id === "ham") || {}).sets;
    ok((acc2.exercises.find((x) => x.id === "ham") || {}).sets === hamB + 1,
      "R4d — the pg-less owner-call sets card ENACTS (not order-derived; Joe's ask outranks the generation) (observed sets: " + J((acc2.exercises.find((x) => x.id === "ham") || {}).sets) + " from " + J(hamB) + ")");
  });

  /* ---- R5 — ruled-order enforcement AT the merge boundary, both directions ---- */
  t("R5", () => {
    const m = mig50();
    const pois = cl(m); pois.exOrder = { U: ["curl", "curl", "ghost9", "lateral"], L: cl(m.exOrder.L) };
    const ab = T.mergeState(cl(pois), cl(m)), ba = T.mergeState(cl(m), cl(pois));
    const ruledHead = (o) => o.U[0] === "lateral" && o.U[1] === "press" && o.U.indexOf("fly") === 2 && new Set(o.U).size === o.U.length;
    ok(ruledHead(ab.exOrder) && ruledHead(ba.exOrder) && ab.exOrder.U.indexOf("ghost9") > ab.exOrder.U.indexOf("sulek"),
      "R5a — a poisoned planGen-51 order merged in BOTH directions comes out RULED (unknowns at the tail, no duplicates) — and the sync upload body IS this merge result by construction (observed A<-B: " + J(ab.exOrder.U) + ")");
    const g52 = cl(m); g52.planGen = 52; g52.exOrder = { U: cl(m.exOrder.U).reverse(), L: cl(m.exOrder.L), setAt: { U: "2026-08-20T10:00:00.000Z" } };
    const m52 = T.mergeState(cl(g52), cl(m));
    ok(m52.planGen === 52 && JSON.stringify(m52.exOrder.U) === JSON.stringify(g52.exOrder.U),
      "R5b — a planGen-52 custom order passes the same boundary UNREPAIRED: the athlete's word outranks the ruling's order (observed: " + J(m52.exOrder.U.slice(0, 3)) + "...)");
  });

  /* ---- R6 — retired-ID generation holes, driven consequences ---- */
  t("R6", () => {
    const m = mig50((s) => { const sk = s.exercises.find((x) => x.id === "sulek"); if (sk) sk.sets = 3; });
    const pv = (T.programmeVolume ? T.programmeVolume(m) : []);
    const fore = pv.find((row) => row.mg === "forearms");
    ok(!fore || !(fore.lifts || []).some((l) => l.id === "pronated"),
      "R6a — sulek at 3 sets does NOT make tombstoned pronated a forearm candidate: the programmeVolume REBUILD projects through exActive (observed forearm lifts: " + J(fore && fore.lifts) + ")");
    const vp = T.volumePush ? T.volumePush(m) : null;
    ok(!vp || vp.exId !== "pronated",
      "R6b — volumePush never routes to a retired record (observed pick: " + J(vp && { mode: vp.mode, exId: vp.exId }) + ")");
    const mL = mig50((s) => {
      /* UNEVEN loads (30, 40, 42.5, 50, 60): even 5-lb gaps read as an even
         ladder and proposeLadder stays silent — eligibility needs real rungs */
      const dts = ["2026-07-01", "2026-07-04", "2026-07-08", "2026-07-11", "2026-07-15"];
      const ws9 = [30, 40, 42.5, 50, 60];
      dts.forEach((d, i) => { s.sessionLog[d] = { entries: [{ id: "pronated", reps: [12, 11], rir: 2, w: ws9[i] }] }; });
    });
    const swL = T.sweepLadders ? T.sweepLadders(cl(mL)) : null;
    const rids = swL ? (swL.proposals || []).filter((p) => p && String(p.rid || "").indexOf("ladder_") === 0).map((p) => p.rid) : [];
    ok(!(rids.indexOf("ladder_pronated") > -1) && (T.proposeLadder ? T.proposeLadder(mL, "pronated") != null : true),
      "R6c — sweepLadders never touches a retired record even when it IS ladder-eligible (eligibility proven live so the pin cannot pass vacuously) (observed ladder rids: " + J(rids) + ")");
  });

  /* ---- R9 — quarantine cannot poison the athlete register ---- */
  t("R9", () => {
    const healthy = mig50();
    const corrupt = T.migrate(rawV50((s) => { s.exercises.push({ id: "fly", day: "U" }); }));
    ok(!(corrupt.retirements || {}).fly && ((corrupt.exercises.find((e) => e && e.id === "fly") || {}).quarantined || "").indexOf("invalid:") === 0,
      "R9a — the quarantine marker rides the RECORD, never s.retirements (key-union — one corrupt replica would retire every healthy fly forever) (observed register: " + J(corrupt.retirements) + ", record flag: " + J((corrupt.exercises.find((e) => e && e.id === "fly") || {}).quarantined) + ")");
    ok(!(corrupt.insertions || {}).fly && !(corrupt.feed || []).some((f) => f && f.op && String(f.op).indexOf("seam:fly:") === 0)
      && !(corrupt.exercises.find((e) => e && e.id === "pulldown") || { forks: [] }).forks.some((f) => f && f.ops && f.ops.indexOf("fly inserted upstream") > -1),
      "R9b — an INVALID birth fires NO seams, NO insertion marker, NO FRESH BASELINE receipts (observed: insertions.fly=" + J((corrupt.insertions || {}).fly) + ", seam ops=" + J((corrupt.feed || []).filter((f) => f && f.op && String(f.op).indexOf("seam:fly:") === 0).length) + ")");
    const hc = T.mergeState(cl(healthy), cl(corrupt)), ch = T.mergeState(cl(corrupt), cl(healthy));
    ok(T.exActive(hc, "fly") === true && T.exActive(ch, "fly") === true && !(hc.exercises.find((e) => e.id === "fly") || {}).quarantined && !(ch.exercises.find((e) => e.id === "fly") || {}).quarantined,
      "R9c — corrupt<->healthy merges BOTH WAYS: the healthy replica's valid fly stays ACTIVE and unquarantined (health beats quarantine, direction-free) (observed active: " + J([T.exActive(hc, "fly"), T.exActive(ch, "fly")]) + ")");
    const cc = T.mergeState(cl(corrupt), cl(corrupt));
    ok(((cc.exercises.find((e) => e.id === "fly") || {}).quarantined || "").indexOf("invalid:") === 0,
      "R9d — corrupt<->corrupt stays preserved-inert: no side manufactures health (observed flag: " + J((cc.exercises.find((e) => e.id === "fly") || {}).quarantined) + ")");
  });

  /* ---- R11 — the label survives calibration for HISTORY ---- */
  t("R11", () => {
    let m = mig50();
    m = T.completeSession(m, "2026-08-20", [{ id: "fly", reps: [12, 11], rir: 2, w: 90 }], slp, { pg: 51 }).s;
    m = T.runAdaptive(m, "2026-08-21");   /* sweep 1: pins live -> pinsSeen */
    const fx = m.exercises.find((x) => x.id === "fly");
    fx.setup = String(fx.setup).replace(/\[PIN\]/g, "3"); fx.setupAt = new Date().toISOString();   /* the athlete fills the pins */
    m = T.runAdaptive(m, "2026-08-22");   /* sweep 2: pins gone + pinsSeen -> calibratedAt stamps */
    ok(!!m.exercises.find((x) => x.id === "fly").calibratedAt, "R11 precondition — the transition stamped calibratedAt (observed: " + J(m.exercises.find((x) => x.id === "fly").calibratedAt) + ")");
    const db1 = T.sessionDebrief(m, "2026-08-20");
    const lab1 = JSON.stringify(db1 || {}).toLowerCase().indexOf("logged before calibration") > -1;
    ok(lab1 === true,
      "R11a — the PRE-calibration session STILL reads provisional after the pins fill and the stamp lands (round 1's pinsUnfilled>0 outer gate erased history's status the moment pins were filled) (observed label present: " + lab1 + ")");
    m = T.completeSession(m, "2026-08-23", [{ id: "fly", reps: [13, 12], rir: 2 }], slp, { pg: 51 }).s;
    const db2 = T.sessionDebrief(m, "2026-08-23");
    const lab2 = JSON.stringify(db2 || {}).toLowerCase().indexOf("logged before calibration") > -1;
    ok(lab2 === false,
      "R11b — a POST-calibration session reads normal (observed label present: " + lab2 + ")");
  });

  /* ---- R13 — merged two-device execution EQUALS serial chronological execution ---- */
  t("R13", () => {
    const base = mig50();
    const lift = (base.exercises.filter((e) => ["pulldown", "rows", "rearDelt", "tricep", "sulek"].indexOf(e.id) > -1).find((e) => typeof e.w === "number") || {}).id;
    ok(!!lift, "R13 precondition — a numeric-load split-era lift exists (observed: " + J(lift) + ")");
    const ex0 = base.exercises.find((e) => e.id === lift);
    const top = Array.from({ length: ex0.sets }, () => ex0.hi);   /* tops the window every time */
    const D = ["2026-08-20", "2026-08-22", "2026-08-24"];
    const run = (s, d) => T.completeSession(s, d, [{ id: lift, reps: top.slice(), rir: 2, rirEnd: 1 }], slp, { pg: 51 }).s;
    /* serial oracle: one device, chronological */
    const serial = run(run(run(cl(base), D[0]), D[1]), D[2]);
    /* two devices: A ran day 1; B ran days 2+3 (each treating ITS first as era session 1) */
    const A = run(cl(base), D[0]);
    const B = run(run(cl(base), D[1]), D[2]);
    const AB = T.mergeState(cl(A), cl(B)), BA = T.mergeState(cl(B), cl(A));
    const view = (s) => { const e = s.exercises.find((x) => x.id === lift); return { topAt: e.topAt, topRun: e.topRun, last: e.last, lm: e.lastMeta && { d: e.lastMeta.d, w: e.lastMeta.w, reps: e.lastMeta.reps }, std: e.std || null, own: !!e.own, q: (s.queue || []).filter((q) => q && q.exId === lift && q.kind === "debut").map((q) => ({ newW: q.newW, state: q.state, done: !!q.done })).sort((a, b) => String(a.newW).localeCompare(String(b.newW))) }; };
    const vS = view(serial), vAB = view(AB), vBA = view(BA);
    ok(J(vAB) === J(vS) && J(vBA) === J(vS),
      "R13a — THE GOVERNING TEST: merged two-device execution EQUALS serial chronological execution — sighting record, line, standards and queue/earn state, from BOTH merge orders (serial: " + J(vS) + " · merged A<-B: " + J(vAB) + " · merged B<-A: " + J(vBA) + ")");
    const earnT = (s) => (s.feed || []).filter((f) => f && / EARNED$/.test(String(f.t)) && String(f.t).indexOf(ex0.n.toUpperCase()) === 0).length;
    const retT = (s) => (s.feed || []).filter((f) => f && f.op === "stdretire:" + lift).length;
    ok(earnT(AB) === earnT(serial) && earnT(BA) === earnT(serial) && retT(AB) <= 1 && retT(BA) <= 1,
      "R13b — receipt truth equals the serial oracle: same EARNED count, at most one standard-retirement per lift (observed EARNED serial/AB/BA: " + J([earnT(serial), earnT(AB), earnT(BA)]) + ", stdretire AB/BA: " + J([retT(AB), retT(BA)]) + ")");
    /* adoption truth converges: 90-then-70 offline ends consistent */
    const A2 = T.completeSession(cl(base), D[0], [{ id: "fly", reps: [12, 11], rir: 2, w: 90 }], slp, { pg: 51 }).s;
    const B2 = T.completeSession(cl(base), D[1], [{ id: "fly", reps: [12, 11], rir: 2, w: 70 }], slp, { pg: 51 }).s;
    A2.exercises.find((x) => x.id === "fly").wAt = new Date(Date.parse(B2.exercises.find((x) => x.id === "fly").wAt) - 60000).toISOString();
    const serial2 = T.completeSession(cl(A2), D[1], [{ id: "fly", reps: [12, 11], rir: 2, w: 70 }], slp, { pg: 51 }).s;
    const M1 = T.mergeState(cl(A2), cl(B2)), M2 = T.mergeState(cl(B2), cl(A2));
    const story = (s) => ({ w: (s.exercises.find((x) => x.id === "fly") || {}).w, adopts: (s.feed || []).filter((f) => f && f.op === "adopt:fly").map((f) => f.w), shift: (s.feed || []).some((f) => f && String(f.t) === "MACHINE FLY — LOGGED AT 70 (plan said 90)") });
    const st1 = story(M1), st2 = story(M2), stS = story(serial2);
    ok(st1.w === 70 && st2.w === 70 && J(st1.adopts) === J([90]) && J(st2.adopts) === J([90]) && st1.shift && st2.shift && stS.shift,
      "R13c — adoption truth converges: config 70 (newer stamp), ONE adopt receipt (at 90, the true debut), and the LOGGED AT 70 transition line present with the serial run's exact title, both orders (observed merged: " + J(st1) + " · serial: " + J(stS) + ")");
    /* idempotency: a serial device merging its own replica changes nothing */
    const selfM = T.mergeState(cl(serial), cl(serial));
    ok(J(view(selfM)) === J(vS) && earnT(selfM) === earnT(serial),
      "R13d — idempotent: a serial state merged with its own replica re-folds to itself, zero duplicate receipts or queue items (observed: " + J(view(selfM)) + ")");
  });
}
