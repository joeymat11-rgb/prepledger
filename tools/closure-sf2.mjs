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

  /* ---- R5b (round 4) — the NO-MERGE boundaries: import + the no-remote PUT ---- */
  t("R5-round4", () => {
    const m = mig50();
    const POISON = ["press", "lateral", "pulldown", "curl"];
    const backup = cl(m); backup.exOrder = { U: POISON.slice(), L: cl(m.exOrder.L) };
    /* (i) THE REAL IMPORT PATH: doImport is exactly migrate(parse) -> save, so
       the same-schema entry boundary IS the import boundary. Run it on the
       serialized bytes a backup file actually carries. */
    const imported = T.migrate(JSON.parse(JSON.stringify(backup)));
    const ruled9 = (o) => o.U[0] === "lateral" && o.U[1] === "press" && o.U[2] === "fly" && new Set(o.U).size === o.U.length;
    ok(ruled9(imported.exOrder) && imported.planGen === 51,
      "R5-r4a — a poisoned planGen-51 BACKUP through the real import path (migrate same-schema fast path) renders and persists the RULED order (observed: " + J(imported.exOrder.U) + ")");
    const again = T.migrate(JSON.parse(JSON.stringify(imported)));
    ok(JSON.stringify(again.exOrder) === JSON.stringify(imported.exOrder),
      "R5-r4b — and it is IDEMPOTENT: importing the repaired backup a second time moves nothing (observed: " + J(again.exOrder.U) + ")");
    /* (ii) lives in runClosureSF2Sync below — driven through the REAL ghSync
       against a mocked reachable 404, capturing the actual serialized wire
       body. Calling normalizePlan here instead would be the source-assert
       straw class again (and it passed on fd3f1a7, which is how it was
       caught). */
    /* (iii) planGen-52 negative control through BOTH paths */
    const c52 = cl(m); c52.planGen = 52; c52.exOrder = { U: cl(m.exOrder.U).reverse(), L: cl(m.exOrder.L) };
    const imp52 = T.migrate(JSON.parse(JSON.stringify(c52)));
    const wire52 = T.normalizePlan(JSON.parse(JSON.stringify(c52)));
    ok(JSON.stringify(imp52.exOrder.U) === JSON.stringify(c52.exOrder.U) && JSON.stringify(wire52.exOrder.U) === JSON.stringify(c52.exOrder.U),
      "R5-r4d — a planGen-52 custom order passes BOTH new boundaries unrepaired: the athlete's word outranks the ruling's order everywhere (observed import: " + J(imp52.exOrder.U.slice(0, 3)) + "... wire: " + J(wire52.exOrder.U.slice(0, 3)) + "...)");
  });

  /* ---- R4b (round 4) — the kind classification gates the pg check itself ---- */
  t("R4-round4", () => {
    const base = mig50();
    /* PRODUCER-SHAPED: exactly what sweepStalls stamps (kind reset + pg) */
    const mkReset = (pg9) => ({ id: "rs_press_r4", kind: "reset", pg: pg9, exId: "press", newW: 200, title: "RESET Chest press — 250 → 200", body: "b", at: "2026-08-20" });
    const at52 = cl(base); at52.planGen = 52;
    const pressW = (s9) => (s9.exercises.find((x) => x.id === "press") || {}).w;
    at52.exercises.find((x) => x.id === "press").w = 250;
    const r52 = T.applyAgentProposal(cl(at52), mkReset(51), "2026-08-20");
    ok(pressW(r52) === 200 && (r52.feed || []).some((f) => f && String(f.t).indexOf("RESET APPLIED") === 0),
      "R4-r4a — a producer-shaped pg-51 RESET at planGen 52 APPLIES (a reset is stall-derived; sweepStalls never consults the order, so no plan generation can invalidate it) (observed press w: " + J(pressW(r52)) + ", RESET APPLIED line: " + (r52.feed || []).some((f) => f && String(f.t).indexOf("RESET APPLIED") === 0) + ")");
    const at51 = cl(base); at51.exercises.find((x) => x.id === "press").w = 250;
    const r51 = T.applyAgentProposal(cl(at51), mkReset(51), "2026-08-20");
    ok(pressW(r51) === 200,
      "R4-r4b — control: the same reset at planGen 51 still applies (observed press w: " + J(pressW(r51)) + ")");
    /* negative controls — the round-1/2 laws stand */
    const volAt52 = T.applyAgentProposal(cl(at52), { id: "v_r4", kind: "volume", pg: 51, mg: "quads", exId: "hack", dir: 1, title: "VOLUME +1" }, "2026-08-20");
    const hackSets = (s9) => (s9.exercises.find((x) => x.id === "hack") || {}).sets;
    ok(hackSets(volAt52) === hackSets(at52) && (volAt52.feed || []).some((f) => f && String(f.t).indexOf("OFFER SUPERSEDED") === 0),
      "R4-r4c — negative control: a pg-51 VOLUME offer at planGen 52 is STILL superseded (order-derived, stale generation) (observed hack sets: " + J([hackSets(at52), hackSets(volAt52)]) + ")");
    const volAbsent = T.applyAgentProposal(cl(base), { id: "v_r4b", kind: "volume", mg: "quads", exId: "hack", dir: 1, title: "VOLUME +1" }, "2026-08-20");
    ok(hackSets(volAbsent) === hackSets(base) && (volAbsent.feed || []).some((f) => f && String(f.t).indexOf("OFFER SUPERSEDED") === 0),
      "R4-r4d — negative control: a pg-ABSENT order-derived offer still classifies pre-51 (the round-1 law) (observed hack sets: " + J([hackSets(base), hackSets(volAbsent)]) + ")");
    const retired = T.applyAgentProposal(cl(base), { id: "v_r4c", kind: "reset", pg: 51, exId: "pronated", newW: 35, title: "RESET pronated" }, "2026-08-20");
    ok((retired.exercises.find((x) => x.id === "pronated") || {}).w === 40 && (retired.feed || []).some((f) => f && String(f.t).indexOf("OFFER SUPERSEDED") === 0),
      "R4-r4e — negative control: the RETIRED-lift guard is untouched — a reset targeting a tombstoned lift still supersedes (observed pronated w: " + J((retired.exercises.find((x) => x.id === "pronated") || {}).w) + ")");
  });

  /* ---- R11c (round 4) — the pin birthday is IMMUTABLE (engine leg) ---- */
  t("R11-round4", () => {
    const m = mig50();
    const fly = m.exercises.find((x) => x.id === "fly");
    ok(fly && fly.pinsBornAt === "2026-08-12T00:00:00.000Z",
      "R11-r4a — the newborns carry an authored pin birthday at RULING_EPOCH (observed: " + J(fly && fly.pinsBornAt) + ")");
    const pinned = m.exercises.filter((e) => T.pinsUnfilled(e) > 0);
    ok(pinned.length > 0 && pinned.every((e) => !!e.pinsBornAt),
      "R11-r4b — every [PIN]-carrying record is backfilled fill-if-absent (observed " + pinned.length + " pinned records, all with a birthday: " + pinned.every((e) => !!e.pinsBornAt) + ")");
    /* the LAWFUL fill write advances setupAt; the birthday may not move */
    /* SOL'S EXACT CHRONOLOGY — and the rig error cowork owned in round 2, not
       repeated: the FIRST sweep must ARM pinsSeen while the pins are still
       live, or calibratedAt can never stamp and the test proves nothing.
       8/20 sweep (arms) -> 8/20 session -> 8/21 lawful fill -> 8/22 sweep. */
    const armed = T.runAdaptive(cl(m), "2026-08-20");
    const f2 = armed.exercises.find((x) => x.id === "fly");
    const born0 = f2.pinsBornAt;
    ok(f2.pinsSeen === true, "R11-r4c precondition — the first sweep ARMS pinsSeen while the pins are live (observed: " + J(f2.pinsSeen) + ")");
    const logged = T.completeSession(armed, "2026-08-20", [{ id: "fly", reps: [12, 11], rir: 2, w: 90 }], slp, { pg: 51 }).s;
    const filled = cl(logged); const f2b = filled.exercises.find((x) => x.id === "fly");
    f2b.setup = String(f2b.setup).replace(/\[PIN\]/g, "3"); f2b.setupAt = "2026-08-21T10:00:00.000Z";
    const swept = T.runAdaptive(filled, "2026-08-22");
    const f3 = swept.exercises.find((x) => x.id === "fly");
    const lab3 = JSON.stringify(T.sessionDebrief(swept, "2026-08-20") || {}).toLowerCase().indexOf("logged before calibration") > -1;
    ok(f3.pinsBornAt === born0 && born0 != null && lab3 === true,
      "R11-r4c — SOL'S CHRONOLOGY at the engine boundary: after the LAWFUL fill write (tokens replaced, setupAt advanced per the stamp discipline) and the stamping sweep, the pin birthday has NOT moved AND the pre-fill session still reads provisional — asserting the consequence, not just the field, so a tip with no birthday at all cannot pass vacuously (observed birthday: " + J(f3.pinsBornAt) + " vs authored " + J(born0) + " · label present: " + lab3 + ")");
    /* merge: earliest-wins, both orders */
    const A = cl(m), B = cl(m);
    A.exercises.find((x) => x.id === "fly").pinsBornAt = "2026-08-12T00:00:00.000Z";
    B.exercises.find((x) => x.id === "fly").pinsBornAt = "2026-08-25T00:00:00.000Z";
    const ab = T.mergeState(cl(A), cl(B)), ba = T.mergeState(cl(B), cl(A));
    ok((ab.exercises.find((x) => x.id === "fly") || {}).pinsBornAt === "2026-08-12T00:00:00.000Z" && (ba.exercises.find((x) => x.id === "fly") || {}).pinsBornAt === "2026-08-12T00:00:00.000Z",
      "R11-r4d — the birthday merges EARLIEST-WINS, direction-free (observed: " + J([(ab.exercises.find((x) => x.id === "fly") || {}).pinsBornAt, (ba.exercises.find((x) => x.id === "fly") || {}).pinsBornAt]) + ")");
  });

  /* ---- R11-A (round 6) — the birthday is guaranteed at the canonical boundary ---- */
  t("R11-A", () => {
    const m = mig50();
    /* a v51 BACKUP from the interim tips: same schema, birthdays stripped —
       exactly what migrate's fast path used to hand straight back */
    const backup = cl(m);
    for (const e of backup.exercises) delete e.pinsBornAt;
    const imported = T.migrate(JSON.parse(JSON.stringify(backup)));   /* THE REAL IMPORT BOUNDARY: doImport is migrate(parse) -> save */
    const qual = imported.exercises.filter((e) => T.pinsUnfilled(e) > 0 || e.pinsSeen || e.calibratedAt);
    const bornOK = qual.every((e) => e.pinsBornAt === e.setupAt);
    ok(qual.length > 0 && bornOK,
      "R11-A a — a no-birthday v51 backup through the REAL import boundary exits with every qualifying record carrying pinsBornAt := its own setupAt (observed " + qual.length + " qualifying records, all matching: " + bornOK + ")");
    const calves = imported.exercises.find((e) => e.id === "calves");
    const flyI = imported.exercises.find((e) => e.id === "fly");
    ok(!!(calves && calves.pinsBornAt === "2026-08-13T12:00:00.000Z") && !!(flyI && flyI.pinsBornAt === "2026-08-12T00:00:00.000Z"),
      "R11-A b — the values are the ruled ones: calves at the cue-adoption stamp, the newborns at RULING_EPOCH (observed calves " + J(calves && calves.pinsBornAt) + " · fly " + J(flyI && flyI.pinsBornAt) + ")");
    const twice = T.migrate(JSON.parse(JSON.stringify(imported)));
    ok(JSON.stringify(twice.exercises.map((e) => [e.id, e.pinsBornAt])) === JSON.stringify(imported.exercises.map((e) => [e.id, e.pinsBornAt])),
      "R11-A c — IDEMPOTENT: importing the healed backup again moves no birthday");
    /* a birthday-carrying replica merges EARLIEST-WINS from both orders */
    const older = cl(imported); older.exercises.find((e) => e.id === "fly").pinsBornAt = "2026-08-01T00:00:00.000Z";
    const ab = T.mergeState(cl(imported), cl(older)), ba = T.mergeState(cl(older), cl(imported));
    ok((ab.exercises.find((e) => e.id === "fly") || {}).pinsBornAt === "2026-08-01T00:00:00.000Z" && (ba.exercises.find((e) => e.id === "fly") || {}).pinsBornAt === "2026-08-01T00:00:00.000Z",
      "R11-A d — a subsequent merge with a birthday-carrying replica stays EARLIEST-WINS, both orders (observed " + J([(ab.exercises.find((e) => e.id === "fly") || {}).pinsBornAt, (ba.exercises.find((e) => e.id === "fly") || {}).pinsBornAt]) + ")");
    const c52 = cl(backup); c52.planGen = 52; c52.exOrder = { U: cl(m.exOrder.U).reverse(), L: cl(m.exOrder.L) };
    const i52 = T.migrate(JSON.parse(JSON.stringify(c52)));
    ok(JSON.stringify(i52.exOrder.U) === JSON.stringify(c52.exOrder.U) && (i52.exercises.find((e) => e.id === "fly") || {}).pinsBornAt === "2026-08-12T00:00:00.000Z",
      "R11-A e — a planGen-52 state takes the birthday heal with its CUSTOM ORDER untouched (observed order head " + J(i52.exOrder.U.slice(0, 2)) + " · fly birthday " + J((i52.exercises.find((e) => e.id === "fly") || {}).pinsBornAt) + ")");
    /* the DISSOLUTION, as a negative control: post-heal, pre-cue history on a
       forked pinned lift still carries NO label — the fork shield and the
       birthday agree (Sol's own example, driven) */
    const lab = JSON.stringify(T.sessionDebrief(imported, "2026-08-06") || {}).toLowerCase().indexOf("logged before calibration") > -1;
    ok(lab === false,
      "R11-A f — the dissolution holds post-heal: rearDelt's 2026-08-06 session still shows NO label (observed label present: " + lab + ")");
  });

  /* ---- R11-C (round 6) — the label leaves the LIVE pin count ---- */
  t("R11-C", () => {
    const m = mig50();
    /* Sol's chronology, with the arming sweep first (the rig error cowork
       owned in round 2, not repeated) */
    const armed = T.runAdaptive(cl(m), "2026-08-20");
    const born = (armed.exercises.find((x) => x.id === "fly") || {}).pinsBornAt;
    const logged = T.completeSession(armed, "2026-08-20", [{ id: "fly", reps: [12, 11], rir: 2, w: 90 }], slp, { pg: 51 }).s;
    const lab = (st, iso) => JSON.stringify(T.sessionDebrief(st, iso) || {}).toLowerCase().indexOf("logged before calibration") > -1;
    ok(lab(logged, "2026-08-20") === true,
      "R11-C a — PRE-FILL: the session reads provisional while the pins are live (observed: " + lab(logged, "2026-08-20") + ")");
    /* THE FLIP — pins filled, NO sweep yet: the stampless interim */
    const filled = cl(logged); const f9 = filled.exercises.find((x) => x.id === "fly");
    f9.setup = String(f9.setup).replace(/\[PIN\]/g, "3"); f9.setupAt = "2026-08-21T10:00:00.000Z";
    ok(lab(filled, "2026-08-20") === true,
      "R11-C b — THE FLIP: filled-but-UNSWEPT, the session STILL reads provisional — the live pin count has left the condition (red on d115b3d: the label vanished for the whole stretch between the last Pin-it tap and the next open) (observed: " + lab(filled, "2026-08-20") + ")");
    const swept = T.runAdaptive(filled, "2026-08-22");
    const cal = (swept.exercises.find((x) => x.id === "fly") || {}).calibratedAt;
    ok(!!cal && lab(swept, "2026-08-20") === true,
      "R11-C c — POST-STAMP: sessions predating calibratedAt still read provisional (observed stamp " + J(cal) + " · label " + lab(swept, "2026-08-20") + ")");
    const after = T.completeSession(swept, "2026-08-23", [{ id: "fly", reps: [13, 12], rir: 2 }], slp, { pg: 51 }).s;
    ok(lab(after, "2026-08-23") === false,
      "R11-C d — POST-CALIBRATION sessions read normal (observed: " + lab(after, "2026-08-23") + ")");
    ok(lab(swept, "2026-08-06") === false,
      "R11-C e — PRE-BIRTHDAY sessions are NEVER labeled (observed: " + lab(swept, "2026-08-06") + ")");
    /* the retired escape hatch: a record with no birthday never labels */
    const noBorn = cl(logged); const nb = noBorn.exercises.find((x) => x.id === "fly");
    delete nb.pinsBornAt; delete nb.calibratedAt;
    ok(lab(noBorn, "2026-08-20") === false && born != null,
      "R11-C f — the !pinBorn-or escape hatch is RETIRED: a birthday-less record simply never labels (observed: " + lab(noBorn, "2026-08-20") + ")");
  });

  /* ---- R11-C fork lane (round 7) — the flicker fix reaches the FORKED lifts ---- */
  t("R11-C-fork", () => {
    const m = mig50();
    const cv = m.exercises.find((x) => x.id === "calves");
    ok(!!(cv && T.pinsUnfilled(cv) > 0 && (cv.forks || []).length > 0),
      "R11-C-fork precondition — calves is the right witness: FORKED and PINNED (observed forks " + J((cv.forks || []).map((f) => f.from)) + " · unfilled pins " + J(T.pinsUnfilled(cv)) + ")");
    const fk = T.forkFrom(m, "calves");
    const lab = (st, iso) => JSON.stringify(T.sessionDebrief(st, iso) || {}).toLowerCase().indexOf("logged before calibration") > -1;
    /* the arming sweep first (the rig error cowork owned in round 2, not repeated) */
    const armed = T.runAdaptive(cl(m), "2026-08-20");
    const logged = T.completeSession(armed, "2026-08-20", [{ id: "calves", reps: [15, 14, 13], rir: 2 }], slp, { pg: 51 }).s;
    ok(lab(logged, "2026-08-20") === true,
      "R11-C-fork a — PRE-FILL: the post-fork session reads provisional while the pin is live (observed: " + lab(logged, "2026-08-20") + ")");
    const filled = cl(logged); const c9 = filled.exercises.find((x) => x.id === "calves");
    c9.setup = String(c9.setup).replace(/\[PIN\]/g, "3"); c9.setupAt = "2026-08-21T10:00:00.000Z";
    ok(lab(filled, "2026-08-20") === true,
      "R11-C-fork b — THE FLIP, FORKED LANE: filled-but-UNSWEPT still reads provisional (the ad09f61 signature was true/false/true — eight of the ten pinned lifts are forked, so this was the athlete's whole legacy set) (observed: " + lab(filled, "2026-08-20") + ")");
    const swept = T.runAdaptive(filled, "2026-08-22");
    const cal = (swept.exercises.find((x) => x.id === "calves") || {}).calibratedAt;
    ok(!!cal && lab(swept, "2026-08-20") === true,
      "R11-C-fork c — POST-STAMP: the pre-stamp session still reads provisional (observed stamp " + J(cal) + " · label " + lab(swept, "2026-08-20") + ")");
    const after = T.completeSession(swept, "2026-08-24", [{ id: "calves", reps: [16, 15, 14], rir: 2 }], slp, { pg: 51 }).s;
    ok(lab(after, "2026-08-24") === false,
      "R11-C-fork d — a POST-CALIBRATION calves session reads normal (observed: " + lab(after, "2026-08-24") + ")");
    /* the seed carries no calves session before the fork, so the pre-fork case
       is PLANTED rather than hunted — a real one from the athlete's own log is
       what the words freeze already covers. */
    const preIso = (() => { const d = new Date(fk + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() - 7); return d.toISOString().slice(0, 10); })();
    const withPre = cl(swept);
    withPre.sessionLog[preIso] = { entries: [{ id: "calves", reps: [15, 14, 13], rir: 2, w: (withPre.exercises.find((x) => x.id === "calves") || {}).w ?? null }], at: 0, note: "", niggles: [], dips: 0, skipped: [], pace: null };
    ok(preIso < fk && lab(withPre, preIso) === false,
      "R11-C-fork e — a PRE-FORK calves session is never labeled: the iso >= fkL gate is untouched (observed date " + J(preIso) + " vs fork " + J(fk) + " · label " + lab(withPre, preIso) + ")");
  });

  /* ---- v7.53.2 — THE 2026-08-14 DATA AMENDMENT (owner attestation) ---- */
  t("AMEND-0814", () => {
    /* The synced ledger in this repo ends 2026-08-10 — his phone had not yet
       carried the 8/14 session up when this shipped — so the session is
       PLANTED here in the shape the app writes, and stated as planted. The
       patch's own guard is the stale value, so the planted record is the
       honest way to drive it. */
    const withSess = (mut) => {
      const raw = rawV50();
      raw.sessionLog["2026-08-14"] = {
        entries: [
          { id: "hack", reps: [10, 9, 9], rir: 2, rirSets: [2, null, 0], w: 190 },
          { id: "extension", reps: [10, 10], rir: null, rirSets: [null, null], w: 155 },
          { id: "ham", reps: [12, 12, 11], rir: null, rirSets: [null, null, null], w: 120 },
        ],
        at: 0, note: "", niggles: [], dips: 0, skipped: [{ id: "abs" }, { id: "hanging" }], pace: null,
      };
      if (mut) mut(raw);
      return T.migrate(raw);
    };
    const m = withSess();
    const rec = m.sessionLog["2026-08-14"];
    const en = (id) => (rec.entries || []).find((e) => e && e.id === id);
    ok(en("hack").w === 200 && en("extension").w === 160,
      "AMEND a — the two attested weights are amended to the exact literals (observed hack " + J(en("hack").w) + " · extension " + J(en("extension").w) + ")");
    ok(J(en("hack").reps) === J([10, 9, 9]) && en("hack").rir === 2 && J(en("hack").rirSets) === J([2, null, 0])
      && J(en("extension").reps) === J([10, 10]) && en("extension").rir === null,
      "AMEND b — reps, rir and rirSets are BYTE-IDENTICAL: the attestation was about the weight, and nothing else moved (observed " + J([en("hack").reps, en("hack").rir, en("extension").reps, en("extension").rir]) + ")");
    ok(J(en("ham")) === J({ id: "ham", reps: [12, 12, 11], rir: null, rirSets: [null, null, null], w: 120 }),
      "AMEND c — the third entry on the same session is untouched (observed " + J(en("ham")) + ")");
    ok(J(rec.skipped) === J([{ id: "abs" }, { id: "hanging" }]),
      "AMEND d — skipped[] is NOT touched by this patch: Joe is un-skipping those two in-app, and a patch racing his own correction is how a record gets a value nobody chose (observed " + J(rec.skipped) + ")");
    ok(!!(rec.corr && rec.corr.at && rec.corr.rev >= 1),
      "AMEND e — the record carries the CORRECTION_MERGE stamp, so a replica holding the old copy cannot revert it (observed " + J(rec.corr) + ")");
    /* THE CACHE DISCIPLINE — the class the earlier ledger repairs missed */
    const hk = m.exercises.find((e) => e.id === "hack"), ext = m.exercises.find((e) => e.id === "extension");
    ok(hk.lastMeta && hk.lastMeta.d === "2026-08-14" && hk.lastMeta.w === 200 && J(hk.last) === J([10, 9, 9])
      && ext.lastMeta && ext.lastMeta.w === 160 && J(ext.last) === J([10, 10]),
      "AMEND f — lastMeta and ex.last are RE-DERIVED to the corrected weights, so no stale 190/155 keeps driving a target (observed hack " + J(hk.lastMeta && [hk.lastMeta.d, hk.lastMeta.w]) + " · extension " + J(ext.lastMeta && ext.lastMeta.w) + ")");
    /* THE PATCH does not move the config — and v7.53.4 REFINES rather than
       reverses that: an amendment patch still never decides progression. What
       v7.53.4 added is a separate standing reconciler (reconcileCorrectedLoads)
       with its own gate — the plan follows a corrected record only when the
       athlete's own last word on that load is OLDER than the correction. The
       distinction is load-bearing and is asserted here in both directions:
       the PATCH leaves the config alone; the RECONCILER, running in the same
       migrate call, is what makes the plan stop contradicting the record. */
    const raw0 = rawV50();
    const cfgAfterPatchOnly = (() => {
      const st = cl(withSess());
      /* strip the correction stamp: with no corr, the reconciler abstains and
         what remains is the PATCH's own effect on the config — nothing. */
      delete st.sessionLog["2026-08-14"].corr;
      return T.migrate(JSON.parse(JSON.stringify({ ...st, v: 51 })));
    })();
    ok((cfgAfterPatchOnly.exercises.find((e) => e.id === "hack") || {}).w === (raw0.exercises.find((e) => e.id === "hack") || {}).w,
      "AMEND g (refined by v7.53.4) — THE PATCH still never moves the CONFIG w: with the correction stamp absent the reconciler abstains and the config is exactly where the athlete left it. A correction patch does not decide progression (observed " + J((cfgAfterPatchOnly.exercises.find((e) => e.id === "hack") || {}).w) + ")");
    /* receipts: one per lift, once */
    const rcp = (m.feed || []).filter((f) => f && f.op && String(f.op).indexOf("amend:2026-08-14:") === 0);
    ok(rcp.length === 2 && rcp.some((f) => /190 → 200/.test(f.t)) && rcp.some((f) => /155 → 160/.test(f.t)),
      "AMEND h — two receipts, one per lift, naming the before and after (observed " + J(rcp.map((f) => f.t)) + ")");
    /* IDEMPOTENT: a rerun over the amended state amends nothing, files nothing */
    const again = T.migrate(JSON.parse(JSON.stringify({ ...cl(m), v: 51 })));
    const rcp2 = (again.feed || []).filter((f) => f && f.op && String(f.op).indexOf("amend:2026-08-14:") === 0);
    const rev2 = ((again.sessionLog["2026-08-14"] || {}).corr || {}).rev, rev1 = (rec.corr || {}).rev;
    ok(rcp2.length === 2 && (again.sessionLog["2026-08-14"].entries.find((e) => e.id === "hack") || {}).w === 200 && rev2 != null && rev2 === rev1,
      "AMEND i — IDEMPOTENT: a rerun finds the corrected values, amends nothing, files no second receipt and does not re-stamp (observed receipts " + rcp2.length + " · rev " + J(rev2) + " vs " + J(rev1) + ")");
    /* every OTHER date byte-identical through the amendment */
    const noSess = T.migrate(rawV50());
    const others = (st) => JSON.stringify(Object.keys(st.sessionLog).filter((d) => d !== "2026-08-14").sort().map((d) => [d, st.sessionLog[d]]));
    ok(others(m) === others(noSess),
      "AMEND j — sessionLog for every OTHER date is byte-identical through the patch");
    /* a session that never carried the stale values is left entirely alone */
    const already = withSess((raw) => { raw.sessionLog["2026-08-14"].entries.find((e) => e.id === "hack").w = 200; raw.sessionLog["2026-08-14"].entries.find((e) => e.id === "extension").w = 160; });
    const rcp3 = (already.feed || []).filter((f) => f && f.op && String(f.op).indexOf("amend:2026-08-14:") === 0);
    ok(rcp3.length === 0 && !already.sessionLog["2026-08-14"].corr,
      "AMEND k — a state that already holds the attested weights takes NO amendment, NO stamp and NO receipt: the guard is the stale value itself (observed receipts " + rcp3.length + ")");
    /* THE MERGE: corrected <-> stale-uncorrected replica, both orders */
    const stale = T.migrate(rawV50((r) => { r.sessionLog["2026-08-14"] = JSON.parse(JSON.stringify(withSess().sessionLog["2026-08-14"])); r.sessionLog["2026-08-14"].entries.find((e) => e.id === "hack").w = 190; r.sessionLog["2026-08-14"].entries.find((e) => e.id === "extension").w = 155; delete r.sessionLog["2026-08-14"].corr; r.v = 51; }));
    const wOf = (st, id) => ((st.sessionLog["2026-08-14"] || {}).entries || []).find((e) => e && e.id === id);
    const ab = T.mergeState(cl(m), cl(stale)), ba = T.mergeState(cl(stale), cl(m));
    ok(wOf(ab, "hack").w === 200 && wOf(ab, "extension").w === 160 && wOf(ba, "hack").w === 200 && wOf(ba, "extension").w === 160,
      "AMEND l — corrected vs stale-uncorrected replica, BOTH merge orders: the correction wins on its stamp (observed A<-B " + J([wOf(ab, "hack").w, wOf(ab, "extension").w]) + " · B<-A " + J([wOf(ba, "hack").w, wOf(ba, "extension").w]) + ")");
    /* the counts law across the amendment */
    const cnt = (st) => [(st.reads || []).length, ((st.sleep || {}).nights || []).length, Object.keys(st.dailyLogs || {}).length, Object.keys(st.sessionLog || {}).length, (st.queue || []).length];
    const before = cnt(withSess()), after = cnt(m);
    ok(after.every((v, i) => v >= before[i]),
      "AMEND m — the counts law holds across the amendment (observed " + J(before) + " -> " + J(after) + ")");
  });

  /* ---- v7.53.3 — THE 2026-08-14 TERMINAL-SET ATTESTATION ---- */
  t("AMEND-0814-RIR", () => {
    /* the 8/14 record in the SHAPE HIS LEDGER ACTUALLY CARRIES IT (he
       un-skipped abs and hanging in-app, which writes rir null and an all-null
       rirSets; hack/extension still hold the pre-v52 weights, so a v51 device
       runs BOTH patches — that is the real chain and it is what this drives). */
    const withSess = (mut) => {
      const raw = rawV50();
      raw.sessionLog["2026-08-14"] = {
        entries: [
          { id: "hack", reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0], w: 190, og: 50 },
          { id: "extension", reps: [8, 9], rir: 2, rirSets: [2, 0], w: 155, og: 50 },
          { id: "ham", reps: [11, 9, 9], rir: 1, rirSets: [1, null, 0], w: 125, og: 50 },
          { id: "abs", reps: [14, 14, 14], rir: null, rirSets: [null, null, null], w: 100 },
          { id: "hanging", reps: [7, 6], rir: null, rirSets: [null, null], w: null },
        ],
        at: 0, note: "", niggles: [], dips: 0, skipped: [{ id: "hipthrust" }, { id: "calves" }], pace: null,
        corr: { at: "2026-07-28T10:00:00.000Z", rev: 2 },   /* his own ↩ correction, dated before the suite's frozen clock so the patch stamps AFTER it — see the note above this block */
      };
      if (mut) mut(raw);
      return T.migrate(raw);
    };
    const m = withSess();
    const rec = m.sessionLog["2026-08-14"];
    const en = (id) => (rec.entries || []).find((e) => e && e.id === id);
    ok(T.terminalRir(en("abs")) === 0 && T.terminalRir(en("hanging")) === 0,
      "RIR a — the terminal set reads 0 for BOTH lifts through terminalRir (observed abs " + J(T.terminalRir(en("abs"))) + " · hanging " + J(T.terminalRir(en("hanging"))) + ")");
    ok(J(en("abs").rirSets) === J([null, null, 0]) && J(en("hanging").rirSets) === J([null, 0]),
      "RIR b — every OTHER slot stays null: the attestation was about the last set only (observed " + J([en("abs").rirSets, en("hanging").rirSets]) + ")");
    ok(en("abs").rir === null && en("hanging").rir === null && T.openerRir(en("abs")) === null,
      "RIR c — en.rir stays NULL: that field is the OPENER's rating and openerRir === 0 is the hot-opener load-freeze signal — writing it would manufacture a grind reading he never attested (observed " + J([en("abs").rir, en("hanging").rir, T.openerRir(en("abs"))]) + ")");
    ok(J(en("abs").reps) === J([14, 14, 14]) && en("abs").w === 100 && en("abs").og === undefined
      && J(en("hanging").reps) === J([7, 6]) && en("hanging").w === null,
      "RIR d — reps, w and og byte-identical on both amended entries (observed abs " + J([en("abs").reps, en("abs").w, en("abs").og]) + " · hanging " + J([en("hanging").reps, en("hanging").w]) + ")");
    ok(J(en("ham")) === J({ id: "ham", reps: [11, 9, 9], rir: 1, rirSets: [1, null, 0], w: 125, og: 50 }),
      "RIR e — the un-amended entries on the same session are untouched (observed ham " + J(en("ham")) + ")");
    ok(J(rec.skipped) === J([{ id: "hipthrust" }, { id: "calves" }]),
      "RIR f — skipped[] untouched (observed " + J(rec.skipped) + ")");
    ok(!!(rec.corr && rec.corr.rev > 2 && rec.corr.at > "2026-07-28T10:00:00.000Z"),
      "RIR g — the correction stamp is REFRESHED and orders AFTER the athlete's own on both fields the merge reads, at then rev (his rev 2 at 07-28 -> observed rev " + J(rec.corr && rec.corr.rev) + " at " + J(rec.corr && rec.corr.at) + ")");
    /* the cache discipline */
    const ab = m.exercises.find((e) => e.id === "abs"), hg = m.exercises.find((e) => e.id === "hanging");
    ok(ab.lastMeta && ab.lastMeta.d === "2026-08-14" && J(T.rirSetsOf(ab.lastMeta)) === J([null, null, 0])
      && hg.lastMeta && J(T.rirSetsOf(hg.lastMeta)) === J([null, 0]),
      "RIR h — lastMeta re-derived so the CACHES carry the terminal 0 (progressStep and the debrief read these, not the log) (observed abs " + J(ab.lastMeta && T.rirSetsOf(ab.lastMeta)) + " · hanging " + J(hg.lastMeta && T.rirSetsOf(hg.lastMeta)) + ")");
    /* receipts — filtered BY OP, never by title: his real feed already carries
       prior RECORD AMENDED rows, which is the trap the first data rig fell into */
    const rcp = (m.feed || []).filter((f) => f && f.op && /^amend:2026-08-14:(abs|hanging):rir$/.test(f.op));
    ok(rcp.length === 2,
      "RIR i — exactly two op-guarded receipts (matched on the op, not the title — the feed carries earlier RECORD AMENDED rows) (observed " + rcp.length + ": " + J(rcp.map((f) => f.op)) + ")");
    /* THE DEBRIEF CONSEQUENCE — the line that asked the question */
    const db = T.sessionDebrief(m, "2026-08-14");
    const flat = JSON.stringify(db || {});
    const taper = (db.lifts || []).filter((l) => (l.lines || []).some((x) => /went to failure/.test(x.t || x)));
    ok(flat.indexOf("no last-set rating") < 0,
      "RIR j — the debrief's 'N lifts have no last-set rating' summary line is GONE (observed present: " + (flat.indexOf("no last-set rating") > -1) + ")");
    const named = (db.lifts || []).filter((l) => /crunch|leg raise/i.test(l.n || "")).every((l) => (l.lines || []).some((x) => /went to failure/.test(x.t || x)));
    ok(named && taper.length >= 2,
      "RIR k — both amended lifts now print the taper line ('went to failure ... the set that buys the next weight') (observed taper lines on " + taper.length + " lifts)");
    /* progressStep: the BRANCH changes, the NUMBER does not */
    const stAb = T.progressStep(ab, m), stHg = T.progressStep(hg, m);
    ok(stAb.add === 1 && stHg.add === 1,
      "RIR l — the step SIZE is unchanged at add:1 — identical to the unrated default; the attestation sharpens the REASON, it does not move what he lifts (observed " + J([stAb.add, stHg.add]) + ")");
    ok(/took the last set to failure/.test(stAb.why) && /took the last set to failure/.test(stHg.why),
      "RIR m — and the WHY is now the term===0 branch, not the 'nothing rated last time' default (observed " + J(stAb.why.slice(0, 52)) + ")");
    /* IDEMPOTENT + the v52-device path (only this patch runs) */
    const again = T.migrate(JSON.parse(JSON.stringify({ ...cl(m), v: 52 })));
    const rcp2 = (again.feed || []).filter((f) => f && f.op && /^amend:2026-08-14:(abs|hanging):rir$/.test(f.op));
    ok(rcp2.length === 2 && J((again.sessionLog["2026-08-14"].entries.find((e) => e.id === "abs") || {}).rirSets) === J([null, null, 0])
      && again.sessionLog["2026-08-14"].corr.rev === rec.corr.rev,
      "RIR n — IDEMPOTENT: a rerun (and a v52 device, which runs ONLY this patch) finds the rated slot, writes nothing, files no second receipt and does not re-stamp (observed receipts " + rcp2.length + " · rev " + J(again.sessionLog["2026-08-14"].corr.rev) + ")");
    /* every other date, and a FRESH DEVICE */
    const noSess = T.migrate(rawV50());
    const others = (st) => JSON.stringify(Object.keys(st.sessionLog).filter((d) => d !== "2026-08-14").sort().map((d) => [d, st.sessionLog[d]]));
    ok(others(m) === others(noSess),
      "RIR o — sessionLog for every OTHER date byte-identical through the patch");
    const fresh = T.migrate(cl(T.SEED));
    const rcpF = (fresh.feed || []).filter((f) => f && f.op && /^amend:2026-08-14:/.test(f.op));
    ok(!fresh.sessionLog["2026-08-14"] && rcpF.length === 0,
      "RIR p — a FRESH INSTALL whose ledger never held the 8/14 session takes nothing and files nothing (observed receipts " + rcpF.length + ")");
    /* THE MERGE: rated <-> a replica still carrying null slots, both orders */
    const stale = withSess();
    stale.sessionLog["2026-08-14"].entries.find((e) => e.id === "abs").rirSets = [null, null, null];
    stale.sessionLog["2026-08-14"].entries.find((e) => e.id === "hanging").rirSets = [null, null];
    stale.sessionLog["2026-08-14"].corr = { at: "2026-07-28T10:00:00.000Z", rev: 2 };
    const tOf = (st, id) => T.terminalRir(((st.sessionLog["2026-08-14"] || {}).entries || []).find((e) => e && e.id === id));
    const ab2 = T.mergeState(cl(m), cl(stale)), ba2 = T.mergeState(cl(stale), cl(m));
    ok(tOf(ab2, "abs") === 0 && tOf(ab2, "hanging") === 0 && tOf(ba2, "abs") === 0 && tOf(ba2, "hanging") === 0,
      "RIR q — rated vs a replica still carrying null slots, BOTH merge orders: the correction wins on its stamp (observed A<-B " + J([tOf(ab2, "abs"), tOf(ab2, "hanging")]) + " · B<-A " + J([tOf(ba2, "abs"), tOf(ba2, "hanging")]) + ")");
    /* counts law */
    const cnt = (st) => [(st.reads || []).length, ((st.sleep || {}).nights || []).length, Object.keys(st.dailyLogs || {}).length, Object.keys(st.sessionLog || {}).length, (st.queue || []).length];
    const before = cnt(withSess()), after = cnt(m);
    ok(after.every((v, i) => v >= before[i]),
      "RIR r — the counts law holds across the amendment (observed " + J(before) + " -> " + J(after) + ")");
  });

  /* ---- v7.53.4 PART A — THE PLAN FOLLOWS THE CORRECTED RECORD ---- */
  t("LOAD-RECONCILE", () => {
    /* driven on the LIVE PREIMAGE — the athlete's own synced state, which
       carries BOTH guard shapes: hack has a wAt five minutes OLDER than the
       correction (a real ladder-approval edit), extension has NO wAt at all. */
    const live = JSON.parse(readFileSync("ledger/state.json", "utf8"));
    const before = JSON.parse(JSON.stringify(live));
    const out = T.migrate(JSON.parse(JSON.stringify(live)));
    const g = (s9, id9) => s9.exercises.find((e) => e && e.id === id9) || {};
    const corrAt = ((before.sessionLog["2026-08-14"] || {}).corr || {}).at;
    ok(g(before, "hack").wAt && g(before, "hack").wAt < corrAt && g(before, "extension").wAt == null,
      "LOAD-A precondition — the preimage carries BOTH guard shapes: hack's wAt " + J(g(before, "hack").wAt) + " is older than the correction " + J(corrAt) + ", and extension has NO wAt");
    ok(g(out, "hack").w === 200 && J(g(out, "hack").steps) === J([160, 170, 180, 190, 200]),
      "LOAD-A a — hack adopts the corrected 200 and the lifted load JOINS the ladder, never erasing a rung (observed w " + J(g(out, "hack").w) + " steps " + J(g(out, "hack").steps) + ")");
    ok(g(out, "hack").wAt === corrAt && g(out, "hack").wAt > g(before, "hack").wAt,
      "LOAD-A b — the stamp is the CORRECTION'S OWN at, not wall-clock: deterministic under a replayed migrate, and later than the athlete's pre-correction edit by the gate's own construction (observed " + J(g(out, "hack").wAt) + ")");
    ok(g(out, "hack").topAt === null && g(out, "hack").topRun === 0,
      "LOAD-A c — CAGE parity: a new load starts its own sighting record (observed topAt " + J(g(out, "hack").topAt) + " topRun " + J(g(out, "hack").topRun) + ")");
    ok(g(out, "extension").w === 160 && g(out, "extension").wAt === corrAt && g(out, "extension").steps == null,
      "LOAD-A d — the ABSENT-wAt shape adopts too, and a lift with no ladder gains no phantom one (observed w " + J(g(out, "extension").w) + " wAt " + J(g(out, "extension").wAt) + " steps " + J(g(out, "extension").steps) + ")");
    /* THE CARDS — the defect Joe reported, in the numbers he would see */
    const tHack = T.targetsFor(g(out, "hack"), out), tExt = T.targetsFor(g(out, "extension"), out), tHam = T.targetsFor(g(out, "ham"), out);
    ok(J(tHack) === J([8, 7, 8]) && g(out, "hack").w === 200,
      "LOAD-A e — the hack card now prescribes the 200 session's reps AT 200, not at an outgrown 190 (observed " + J(tHack) + " @ " + J(g(out, "hack").w) + ")");
    ok(J(tExt) === J([9, 9]) && g(out, "extension").w === 160,
      "LOAD-A f — the extension card anchors on the 160 session instead of the older 155 line: it can no longer prescribe BELOW a delivered session (observed " + J(tExt) + " @ " + J(g(out, "extension").w) + ")");
    ok(g(out, "ham").w === 125 && J(tHam) === J([11, 10, 9]) && J(g(out, "ham")) === J(g(before, "ham")),
      "LOAD-A g — ham is BYTE-IDENTICAL: its record and its config already agree, so the equality guard abstains (observed " + J(tHam) + " @ " + J(g(out, "ham").w) + ")");
    ok(J(g(out, "abs")) === J(g(before, "abs")),
      "LOAD-A h — abs is an equality no-op and keeps its banked sighting: the sweep must not churn topAt/topRun on every schema bump (observed " + J([g(out, "abs").topAt, g(out, "abs").topRun]) + ")");
    ok(g(out, "hanging").w === "BW" && J(g(out, "hanging")) === J(g(before, "hanging")),
      "LOAD-A i — a non-numeric config ('BW') is skipped entirely (observed " + J(g(out, "hanging").w) + ")");
    const rcp = (out.feed || []).filter((f) => f && f.op && String(f.op).indexOf("adopt:corr:") === 0);
    ok(rcp.length === 2 && rcp.some((f) => /HACK SQUAT 190 → 200/.test(f.t)) && rcp.some((f) => /155 → 160/.test(f.t)) && rcp.some((f) => /The rung joined the ladder/.test(f.how)) && !rcp.filter((f) => /155 → 160/.test(f.t))[0].how.match(/rung joined/),
      "LOAD-A j — one op-keyed receipt per adoption, and the ladder sentence appears ONLY where a ladder exists (observed " + J(rcp.map((f) => f.t)) + ")");
    /* IDEMPOTENCE — the equality guard plus the deterministic stamp */
    const twice = T.migrate(JSON.parse(JSON.stringify(out)));
    ok(JSON.stringify(twice) === JSON.stringify(out),
      "LOAD-A k — a replayed migrate is BYTE-IDENTICAL: the equality guard stops the adoption and the correction-stamped wAt makes the write deterministic (a wall-clock stamp would fail this line)");
    /* LEG 3 — the SWEEP still never touches an entry, but patchV54 now writes
       per-entry load provenance, so the claim is asserted at field grain
       instead of by whole-object identity. */
    const entryDelta = (() => {
      const b9 = before.sessionLog, a9 = out.sessionLog;
      if (JSON.stringify(Object.keys(b9).sort()) !== JSON.stringify(Object.keys(a9).sort())) return "date set changed";
      const diffs = [];
      for (const d9 of Object.keys(b9)) {
        const eb = (b9[d9].entries || []), ea = (a9[d9].entries || []);
        if (eb.length !== ea.length) return "entry count changed on " + d9;
        for (let i9 = 0; i9 < eb.length; i9++) {
          const kb = Object.keys(eb[i9]), ka = Object.keys(ea[i9]);
          for (const k9 of new Set([...kb, ...ka])) if (JSON.stringify(eb[i9][k9]) !== JSON.stringify(ea[i9][k9])) diffs.push(d9 + ":" + ea[i9].id + ":" + k9);
        }
      }
      return diffs;
    })();
    ok(Array.isArray(entryDelta) && JSON.stringify(entryDelta.sort()) === JSON.stringify(["2026-08-14:extension:wCorrAt", "2026-08-14:hack:wCorrAt"]),
      "LOAD-A l (evolved by leg 3) — the ONLY field any of this writes into the log is the two amended entries' wCorrAt provenance: no rep, no weight, no rirSets, no other date, and the sweep itself still writes nothing at all (observed " + J(entryDelta) + ")");
    /* NEGATIVE CONTROLS */
    const newer = JSON.parse(JSON.stringify(live));
    newer.exercises.find((e) => e.id === "hack").wAt = "2026-08-15T09:00:00.000Z";   /* the athlete set a load AFTER the correction */
    const nOut = T.migrate(newer);
    ok(g(nOut, "hack").w === 190 && !(nOut.feed || []).some((f) => f && f.op === "adopt:corr:hack:2026-08-14"),
      "LOAD-A m — NEGATIVE: a wAt NEWER than the correction abstains — the athlete's own later word outranks the record (observed w " + J(g(nOut, "hack").w) + ")");
    /* LEG 3 — the gate is PER-ENTRY provenance now, so the negative control is
       an entry that carries none. (Deleting the session corr no longer matters,
       which is the whole point of the doctrine change.) v54 takes the fast
       path, so no patch stamps it. */
    const noProv = JSON.parse(JSON.stringify(live));
    noProv.v = T.SCHEMA_V;
    for (const e9 of (noProv.sessionLog["2026-08-14"].entries || [])) delete e9.wCorrAt;
    const ncOut = T.migrate(noProv);
    ok(g(ncOut, "hack").w === 190 && g(ncOut, "extension").w === 155,
      "LOAD-A n (evolved by leg 3) — NEGATIVE: a divergent lastMeta whose ENTRY carries no load-correction provenance abstains. Ordinary history and deloads are shielded by that gate, never by a direction test (observed " + J([g(ncOut, "hack").w, g(ncOut, "extension").w]) + ")");
    const lighter = JSON.parse(JSON.stringify(live));
    lighter.exercises.find((e) => e.id === "hack").w = 210;
    const lOut = T.migrate(lighter);
    ok(g(lOut, "hack").w === 200,
      "LOAD-A o — DIRECTION-AGNOSTIC: a corrected LIGHTER load adopts too (210 -> 200). The gate is the correction, never the direction (observed " + J(g(lOut, "hack").w) + ")");
    /* THE MERGE — assert the existing STAMPED_FIELDS discipline carries it */
    const un = JSON.parse(JSON.stringify(live));
    const ab = T.mergeState(cl(out), cl(un)), ba = T.mergeState(cl(un), cl(out));
    ok(g(ab, "hack").w === 200 && g(ba, "hack").w === 200 && g(ab, "extension").w === 160 && g(ba, "extension").w === 160,
      "LOAD-A p — adopted vs un-adopted replica, BOTH merge orders: the adoption wins on its stamp through the existing STAMPED_FIELDS rule (observed A<-B " + J([g(ab, "hack").w, g(ab, "extension").w]) + " · B<-A " + J([g(ba, "hack").w, g(ba, "extension").w]) + ")");
    /* THE FREEZE FIXTURES — measured, not assumed */
    for (const snap of ["2026-08-06", "2026-08-07"]) {
      const st = T.migrate(JSON.parse(readFileSync("tools/snapshots/" + snap + "-ledger.json", "utf8")));
      const adopts = (st.feed || []).filter((f) => f && f.op && String(f.op).indexOf("adopt:corr:") === 0);
      ok(adopts.length === 0,
        "LOAD-A q — the " + snap + " words/baseline fixture takes NO adoption: it carries corr-stamped records, but on days that are not any lift's LATEST session, so the lastMeta rule abstains. (A broader all-records sweep DOES fire here and moves two frozen debriefs — measured during the build, and why the rule reads lastMeta only.) (observed " + adopts.length + ")");
    }
  });

  /* ---- v7.53.4 LEG 2 — THE LADDER TRAVELS WITH THE LOAD ---- */
  t("LADDER-STAMP", () => {
    const live = JSON.parse(readFileSync("ledger/state.json", "utf8"));
    const stale = JSON.parse(JSON.stringify(live));      /* the un-adopted replica: his repo-synced copy */
    const adopted = T.migrate(JSON.parse(JSON.stringify(live)));
    const hk = (s9) => s9.exercises.find((e) => e && e.id === "hack") || {};
    const ex9 = (s9) => s9.exercises.find((e) => e && e.id === "extension") || {};
    const corrAt = ((live.sessionLog["2026-08-14"] || {}).corr || {}).at;
    /* THE FINDING, both orders. Stale-FIRST is the one that was broken: the load
       moved on its stamp while the ladder stayed with the merge base, returning a
       working load that is not on its own ladder. */
    const sa = T.mergeState(cl(stale), cl(adopted));     /* un-adopted replica as BASE — the red */
    const as = T.mergeState(cl(adopted), cl(stale));
    ok(hk(sa).w === 200 && J(hk(sa).steps) === J([160, 170, 180, 190, 200]),
      "LADDER a — STALE-FIRST merge: the adopted load brings its rung WITH it (the red on a26e1bd was w 200 beside steps [160,170,180,190] — a working load the machine does not make, and snapLoad would read it as 190) (observed w " + J(hk(sa).w) + " steps " + J(hk(sa).steps) + ")");
    ok(hk(as).w === 200 && J(hk(as).steps) === J([160, 170, 180, 190, 200]),
      "LADDER b — ADOPTED-FIRST merge agrees: both orders land the same ladder (observed " + J(hk(as).steps) + ")");
    ok(hk(sa).wAt === corrAt && hk(sa).stepsAt === corrAt && hk(as).stepsAt === corrAt,
      "LADDER c — the ladder carries the CORRECTION'S OWN stamp, exactly like the load: deterministic, and it wins the merge for the same reason the load does (observed " + J([hk(sa).stepsAt, hk(as).stepsAt]) + ")");
    ok(ex9(sa).w === 160 && ex9(as).w === 160 && ex9(sa).steps == null,
      "LADDER d — the no-ladder lift is unchanged by any of this: extension adopts 160 in both orders and gains no phantom rungs (observed " + J([ex9(sa).w, ex9(as).w, ex9(sa).steps]) + ")");
    ok(J(hk(sa)) === J(hk(as)) && J(ex9(sa)) === J(ex9(as)),
      "LADDER e — the two merge orders are DEEPLY equal on both lifts, not merely agreeing on the fields under test");
    /* DETERMINISM — the reason the adopted stamp is corr.at and not wall-clock */
    const twice = T.migrate(JSON.parse(JSON.stringify(adopted)));
    ok(JSON.stringify(twice) === JSON.stringify(adopted),
      "LADDER f — migrate-twice stays BYTE-IDENTICAL with the ladder stamped: a wall-clock stepsAt here would have broken the determinism doctrine");
    /* THE ANTI-UNION PIN — the case a keyed union cannot express */
    const cleared = JSON.parse(JSON.stringify(adopted));
    const ch = cleared.exercises.find((e) => e.id === "hack");
    delete ch.steps; ch.stepsAt = "2026-08-20T10:00:00.000Z";   /* a deliberate LADDER CLEARED, newer than the adoption */
    const rung = JSON.parse(JSON.stringify(adopted));           /* a replica still carrying the rungs, older stamp */
    const cr = T.mergeState(cl(cleared), cl(rung)), rc = T.mergeState(cl(rung), cl(cleared));
    ok(!(hk(cr).steps && hk(cr).steps.length) && !(hk(rc).steps && hk(rc).steps.length),
      "LADDER g — ANTI-UNION: a ladder CLEARED with a newer stamp beats an old rung-carrying replica in BOTH orders. This is why the field merges whole rather than by keyed union — a union cannot express a deliberate deletion, and the cleared ladder would resurrect on every merge (observed " + J([hk(cr).steps, hk(rc).steps]) + ")");
    ok(hk(cr).inc === hk(rung).inc && hk(rc).inc === hk(rung).inc,
      "LADDER h — and with the ladder gone the even increment rules, as the clear intends (observed inc " + J(hk(cr).inc) + ")");
    /* THE LEGACY PAIR — two states that predate the stamp merge exactly as before */
    const l1 = JSON.parse(JSON.stringify(live)), l2 = JSON.parse(JSON.stringify(live));
    for (const s9 of [l1, l2]) for (const e of s9.exercises) delete e.stepsAt;
    l2.exercises.find((e) => e.id === "hack").steps = [160, 170, 180, 190, 999];
    const legacyAB = T.mergeState(cl(l1), cl(l2)), legacyBA = T.mergeState(cl(l2), cl(l1));
    ok(J(hk(legacyAB).steps) === J(l1.exercises.find((e) => e.id === "hack").steps)
      && J(hk(legacyBA).steps) === J(l2.exercises.find((e) => e.id === "hack").steps),
      "LADDER i — a LEGACY pair (neither side stamped) keeps the pre-existing local-wins-the-base semantics exactly: an absent stamp behaves as it always did, so no state that predates this round changes shape (observed " + J([hk(legacyAB).steps, hk(legacyBA).steps]) + ")");
    /* THE RUNTIME WRITERS STAMP — CAGE and the editor, driven not asserted by source */
    const base = mig50();
    const bh = base.exercises.find((e) => e.id === "hack");
    bh.w = 160; bh.steps = [160, 170]; delete bh.stepsAt;
    const done = T.completeSession(base, "2026-08-21", [{ id: "hack", reps: [10, 9, 9], rir: 2, w: 180 }], slp, { pg: 51 }).s;
    const dh = done.exercises.find((e) => e.id === "hack");
    ok(J(dh.steps) === J([160, 170, 180]) && typeof dh.stepsAt === "string",
      "LADDER j — the CAGE rung-merge STAMPS: logging 180 against a 160/170 ladder joins the rung and dates the ladder, so the join survives a merge with the device that never saw it (observed " + J(dh.steps) + " at " + J(dh.stepsAt) + ")");
    const src = readFileSync("src/app.jsx", "utf8");
    ok(src.indexOf("[\"steps\", \"stepsAt\"]") > -1 && (src.match(/stepsAt = /g) || []).length >= 7,
      "LADDER k — the field is in STAMPED_FIELDS and EVERY writer stamps: eight sites, one of them (the TRAIN next-load ask card) not on the directive's list of six and found by enumerating the writers instead of trusting the list. The scan at FIX 2a item 6 now covers .steps, and it was mutation-tested red before this shipped (observed " + (src.match(/stepsAt = /g) || []).length + " stamp writes)");
  });

  /* ---- v7.53.4 LEG 3 — Sol's five, every one cowork-confirmed by execution ---- */
  t("LOAD-LEG3", () => {
    const live = JSON.parse(readFileSync("ledger/state.json", "utf8"));
    const g = (s9, id9) => s9.exercises.find((e) => e && e.id === id9) || {};
    const AT = "2026-08-14T21:57:13.968Z";
    /* FIX 1 — THE BLEED. A deliberate editor set, then an UNRELATED skip
       correction on the same record. Under session-scoped keying the sweep
       re-adopted 200 over his own word, with a receipt claiming the record
       said so. */
    const bleed = JSON.parse(JSON.stringify(live));
    bleed.exercises.find((e) => e.id === "hack").w = 190;
    bleed.exercises.find((e) => e.id === "hack").wAt = "2026-08-15T09:00:00.000Z";   /* his deliberate set, 09:00 */
    bleed.sessionLog["2026-08-14"].corr = { at: "2026-08-15T10:00:00.000Z", rev: 9 };   /* an UNRELATED un-skip, 10:00 — changes no load */
    const bOut = T.migrate(bleed);
    ok(g(bOut, "hack").w === 190 && !(bOut.feed || []).some((f) => f && f.op === "adopt:corr:hack:2026-08-14"),
      "LEG3 a — THE BLEED IS CLOSED: a skip correction newer than his deliberate load set does NOT re-adopt. The session stamp orders the RECORD; only an entry's own wCorrAt can move the PLAN (observed w " + J(g(bOut, "hack").w) + ", adopt receipts " + (bOut.feed || []).filter((f) => f && f.op === "adopt:corr:hack:2026-08-14").length + ")");
    ok(g(bOut, "hack").wAt === "2026-08-15T09:00:00.000Z",
      "LEG3 b — and his own stamp is left exactly where he put it (observed " + J(g(bOut, "hack").wAt) + ")");
    /* the REAL amendment still adopts through the full chain */
    const real = T.migrate(JSON.parse(JSON.stringify(live)));
    ok(g(real, "hack").w === 200 && g(real, "extension").w === 160 && g(real, "hack").wAt === AT
      && (real.feed || []).filter((f) => f && f.op && String(f.op).indexOf("adopt:corr:") === 0).length === 2,
      "LEG3 c — the REAL 8/14 amendment still adopts end to end: patchV54 stamps the two entries, the sweep keys on them, 200 and 160 with wAt at the correction instant and two receipts (observed " + J([g(real, "hack").w, g(real, "extension").w, g(real, "hack").wAt]) + ")");
    const twice = T.migrate(JSON.parse(JSON.stringify(real)));
    ok(JSON.stringify(twice) === JSON.stringify(real),
      "LEG3 d — migrate-twice stays BYTE-IDENTICAL under the new keying and the monotone stamp");
    /* FIX 2 — THE STAMP NEVER MOVES BACKWARD */
    const ladder = JSON.parse(JSON.stringify(live));
    const lh = ladder.exercises.find((e) => e.id === "hack");
    lh.steps = [160, 170, 180, 190, 205]; lh.stepsAt = "2026-08-15T15:00:00.000Z";   /* his own ladder, the day after */
    const lOut = T.migrate(ladder);
    ok(g(lOut, "hack").stepsAt === "2026-08-15T15:00:00.000Z" && J(g(lOut, "hack").steps) === J([160, 170, 180, 190, 200, 205]),
      "LEG3 e — the sweep merges its rung WITHOUT moving the ladder's stamp backward: his 15:00 decision keeps its date and gains the 200 (executed red: restamped to 21:57 the previous day) (observed " + J(g(lOut, "hack").stepsAt) + " " + J(g(lOut, "hack").steps) + ")");
    const older = JSON.parse(JSON.stringify(lOut));
    const oh = older.exercises.find((e) => e.id === "hack");
    oh.steps = [160, 170, 180, 190, 220]; oh.stepsAt = "2026-08-15T00:00:00.000Z";   /* an OLDER replica */
    const m1 = T.mergeState(cl(lOut), cl(older)), m2 = T.mergeState(cl(older), cl(lOut));
    ok(J(g(m1, "hack").steps) === J([160, 170, 180, 190, 200, 205]) && J(g(m2, "hack").steps) === J([160, 170, 180, 190, 200, 205]),
      "LEG3 f — and his newer ladder beats the older 220-rung replica in BOTH orders, which the backward restamp had reversed (observed " + J([g(m1, "hack").steps, g(m2, "hack").steps]) + ")");
    /* FIX 3 — THE HYBRID. Adopted load from one replica, ask-card ladder from another. */
    const adopted = T.migrate(JSON.parse(JSON.stringify(live)));
    const askCard = JSON.parse(JSON.stringify(live));
    askCard.v = T.SCHEMA_V;   /* fast path: this replica never adopted */
    const ah = askCard.exercises.find((e) => e.id === "hack");
    ah.steps = [160, 170, 180, 190, 210]; ah.stepsAt = "2026-08-16T12:00:00.000Z";   /* he answered the next-load ask; w still 190 here */
    const h1 = T.mergeState(cl(adopted), cl(askCard)), h2 = T.mergeState(cl(askCard), cl(adopted));
    ok(g(h1, "hack").w === 200 && J(g(h1, "hack").steps) === J([160, 170, 180, 190, 200, 210])
      && g(h2, "hack").w === 200 && J(g(h2, "hack").steps) === J([160, 170, 180, 190, 200, 210]),
      "LEG3 g — THE HYBRID SELF-HEALS: a load from one replica and a newer ladder from another recombine into a load that IS on its ladder, identically from both orders (executed red: steps [160,170,180,190,210] beside w 200) (observed " + J([g(h1, "hack").steps, g(h2, "hack").steps]) + ")");
    ok(J(g(h1, "hack")) === J(g(h2, "hack")),
      "LEG3 h — and the two orders are DEEPLY equal on the repaired lift: the repair is a pure function of the resolved pair, not a race");
    /* FIX 4 — the canonical missing-value rule on EQUAL stamps */
    const same = "2026-08-17T08:00:00.000Z";
    const withR = JSON.parse(JSON.stringify(live)); const wr = withR.exercises.find((e) => e.id === "hack");
    wr.w = 190; wr.steps = [160, 170, 180, 190]; wr.stepsAt = same;
    const cleared = JSON.parse(JSON.stringify(withR)); const cr = cleared.exercises.find((e) => e.id === "hack");
    delete cr.steps; cr.stepsAt = same;
    const t1 = T.mergeState(cl(withR), cl(cleared)), t2 = T.mergeState(cl(cleared), cl(withR));
    ok(J(g(t1, "hack").steps) === J([160, 170, 180, 190]) && J(g(t2, "hack").steps) === J([160, 170, 180, 190]),
      "LEG3 i — EQUAL stamps: the PRESENT value wins in both orders. JSON.stringify(undefined) is unorderable, so every comparison against it was false and the merge BASE always won — the cleared ladder kept whichever side it started from (observed " + J([g(t1, "hack").steps, g(t2, "hack").steps]) + ")");
    const newClear = JSON.parse(JSON.stringify(withR)); const nc = newClear.exercises.find((e) => e.id === "hack");
    delete nc.steps; nc.stepsAt = "2026-08-18T08:00:00.000Z";
    const c1 = T.mergeState(cl(withR), cl(newClear)), c2 = T.mergeState(cl(newClear), cl(withR));
    ok(!(g(c1, "hack").steps && g(c1, "hack").steps.length) && !(g(c2, "hack").steps && g(c2, "hack").steps.length),
      "LEG3 j — and the DOCTRINE holds: a deletion still wins with a STRICTLY newer stamp, both orders. A clear is a decision; a tie is not (observed " + J([g(c1, "hack").steps, g(c2, "hack").steps]) + ")");
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

  /* ---- F1 (round 3) — the legacy healer judges before it restates ---- */
  t("F1", () => {
    const healthy = mig50();
    /* a replica that ran round-1 bytes: the register marker present while the
       fly RECORD itself is fully VALID (cowork's executed F1) */
    const legacy = mig50();
    legacy.retirements = { ...(legacy.retirements || {}), fly: "invalid:2026-08-12" };
    const hl = T.mergeState(cl(healthy), cl(legacy)), lh = T.mergeState(cl(legacy), cl(healthy));
    const flag = (s9) => (s9.exercises.find((e) => e && e.id === "fly") || {}).quarantined;
    ok(T.exActive(hl, "fly") === true && T.exActive(lh, "fly") === true && !flag(hl) && !flag(lh)
      && hl.exOrder.U.indexOf("fly") > -1 && lh.exOrder.U.indexOf("fly") > -1
      && !(hl.retirements || {}).fly && !(lh.retirements || {}).fly
      && (T.genSession(hl, "2026-08-20", slp).ex || []).some((x) => x.id === "fly"),
      "F1 — a stale round-1 register marker over a fully VALID fly record cannot retire a healthy replica's fly: the healer JUDGES with the shared predicate before restating — BOTH orders active, in exOrder.U and the generated card, register clean, no record flag (observed active: " + J([T.exActive(hl, "fly"), T.exActive(lh, "fly")]) + ", flags: " + J([flag(hl), flag(lh)]) + ", exOrder has fly: " + J([hl.exOrder.U.indexOf("fly") > -1, lh.exOrder.U.indexOf("fly") > -1]) + ")");
    const bad = T.migrate(rawV50((s) => { s.exercises.push({ id: "fly", day: "U" }); }));
    const badM = T.mergeState(cl(bad), cl(bad));
    ok(((flag(bad) || "").indexOf("invalid:") === 0) && T.exActive(bad, "fly") === false && ((flag(badM) || "").indexOf("invalid:") === 0),
      "F1 negative control — a genuinely malformed {id:'fly',day:'U'} still quarantines through the same path and STAYS quarantined across a merge boundary: preserved as brought, inert, no walk (observed flag: " + J(flag(bad)) + ", post-merge: " + J(flag(badM)) + ")");
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

/* THE NO-REMOTE PUT BODY, driven through the REAL ghSync (async — the caller
   awaits it). A reachable 404 is the first-ever sync: buildBody's no-remote
   arm used to upload raw local, so a poisoned order reached the wire. This
   captures the ACTUAL PUT body the function serializes. */
export async function runClosureSF2Sync(T, ok) {
  const cl = (x) => JSON.parse(JSON.stringify(x));
  const J = (x) => { try { return JSON.stringify(x); } catch (e) { return String(x); } };
  const g = globalThis;
  const POISON = ["press", "lateral", "pulldown", "curl"];
  const mk = () => {
    const s = cl(T.SEED); s.v = 50; delete s.insertions; delete s.retirements; s.planGen = undefined;
    s.exercises = s.exercises.filter((e) => e.id !== "fly" && e.id !== "hipthrust");
    s.exercises.push({ id: "pronated", mg: "forearms", n: "Pronated EZ curl", day: "U", w: 40, inc: 5, sets: 2, hi: 13, last: [12, 11], setup: "SET\ncue" });
    s.exOrder = { U: s.exercises.filter((e) => e.day === "U").map((e) => e.id), L: s.exercises.filter((e) => e.day === "L").map((e) => e.id) };
    return T.migrate(s);
  };
  /* both upload boundaries are captured BY URL: the ledger PUT and the dated
     snapshot vault (the drive's first cut captured only the LAST PUT, which is
     how the vault's raw-state write was found). */
  const drive = async (state) => {
    const caught = { ledger: null, snap: null };
    const save = { fetch: g.fetch, localStorage: g.localStorage, btoa: g.btoa, atob: g.atob };
    const store = {};
    g.localStorage = { getItem: (k) => (k === "prep-ledger-ghtoken" ? "smoke-token" : (k in store ? store[k] : null)), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } };
    g.btoa = save.btoa || ((x) => Buffer.from(x, "binary").toString("base64"));
    g.atob = save.atob || ((x) => Buffer.from(x, "base64").toString("binary"));
    g.fetch = async (u, o) => {
      if (!o || o.method !== "PUT") return { ok: false, status: 404, json: async () => ({}) };   /* REACHABLE 404 — no remote yet */
      const body = JSON.parse(o.body);
      if (String(u).indexOf("/snapshots/") > -1) caught.snap = body; else caught.ledger = body;
      return { ok: true, status: 201, json: async () => ({ content: { sha: "x" } }) };
    };
    try { await T.ghSync(state); } catch (e) { /* the assertions read the captured bodies */ }
    await new Promise((r) => setTimeout(r, 30));   /* snapshotMaybe is fired, not awaited, by the sync */
    g.fetch = save.fetch; g.localStorage = save.localStorage; g.btoa = save.btoa; g.atob = save.atob;
    const dec = (b) => { try { return b ? JSON.parse(Buffer.from(b.content, "base64").toString("utf8")) : null; } catch (e) { return null; } };
    return { ledger: dec(caught.ledger), snap: dec(caught.snap) };
  };
  if (typeof T.ghSync !== "function") {
    ok(false, "R5-r4c — THE REAL ghSync leg cannot execute here: this engine does not export ghSync (a harness limitation of the tip under test, NOT evidence about its wire bytes — the substantive old-tip evidence is cowork's own execution plus R5-r4a's verbatim poisoned import signature)");
    return;
  }
  const base = mk();
  const poisoned = cl(base); poisoned.exOrder = { U: POISON.slice(), L: cl(base.exOrder.L) };
  const wire = await drive(poisoned);
  const ruled = (o) => o && o.U && o.U[0] === "lateral" && o.U[1] === "press" && o.U[2] === "fly" && new Set(o.U).size === o.U.length;
  ok(!!(wire && wire.ledger) && ruled(wire.ledger.exOrder) && J(poisoned.exOrder.U) === J(POISON),
    "R5-r4c — THE REAL ghSync on a reachable 404 (first-ever sync) PUTs the RULED order to the ledger, and the caller's own state object is untouched by the normalization copy (observed ledger body order: " + J(wire && wire.ledger && wire.ledger.exOrder && wire.ledger.exOrder.U) + " · caller after: " + J(poisoned.exOrder.U) + ")");
  ok(!!(wire && wire.snap) && ruled(wire.snap.exOrder),
    "R5-r4c2 — and the DATED SNAPSHOT VAULT carries the ruled order too: the third upload boundary, found by this drive when it captured the last PUT and saw raw state going into the archive a restore would read back (observed vault order: " + J(wire && wire.snap && wire.snap.exOrder && wire.snap.exOrder.U) + ")");
  const c52 = cl(base); c52.planGen = 52; c52.exOrder = { U: cl(base.exOrder.U).reverse(), L: cl(base.exOrder.L) };
  const wire52 = await drive(c52);
  ok(!!(wire52 && wire52.ledger) && J(wire52.ledger.exOrder.U) === J(c52.exOrder.U),
    "R5-r4e — and a planGen-52 custom order rides the same wire UNREPAIRED (observed: " + J(wire52 && wire52.ledger && wire52.ledger.exOrder && wire52.ledger.exOrder.U.slice(0, 3)) + "...)");
}
