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
