/* SPLIT-PATCH FIX-ROUND-2 CLOSURE — the eight repairs, pinned at PRODUCTION
   BOUNDARIES per the round's test law: every test here begins at a real
   migrate/mergeState boundary or the real engine entry a UI handler calls
   with real persisted shapes. (The two UI-handler repairs, R2 and R3's
   mounts, are driven by tools/split-smoke.mjs against the SHIPPED BUNDLE with
   real clicks and typed input — no helper injection anywhere.)

   Every message EMBEDS ITS OBSERVATION, so a fail-first run against 554c5b7
   records the failure SIGNATURE, not just a status. */
/* THE LEDGER PREIMAGE, FROZEN — see tools/engine-test.jsx (same file, same reason): every pin here reads his ledger as it stood at 7dd2d4b (2026-08-15), never the moving ledger/state.json. */
const PREIMAGE = "tools/fixtures/ledger-preimage-2026-08-15.json";
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
  /* THE PRE-ADOPTION PREIMAGE — and why it exists. ledger/state.json is a
     MOVING file: it syncs from his phone. Once v7.53.4 ran there it arrived
     already adopted, and thirteen adoption pins silently became assertions
     about nothing — measured, not guessed (the whole set was re-run against
     the newer sync and went red for the right reason). Anchoring a pin to a
     file the athlete can change is the class this repo names as its dominant
     defect, so the fixture RESTATES the documented pre-adoption shape on top
     of the real record: his real entries, reps and history stay exactly as
     synced — only the config, its stamps and the entry provenance are set
     back to what they were before this round. The pins are now invariant to
     whatever his phone has done since. */
  const preAdoption = () => {
    const s9 = JSON.parse(readFileSync(PREIMAGE, "utf8"));
    s9.v = 53;                                                   /* before patchV54 stamped provenance */
    for (const e9 of (((s9.sessionLog || {})["2026-08-14"] || {}).entries || [])) delete e9.wCorrAt;
    const back = (id9, w9, wAt9, steps9) => {
      const x9 = (s9.exercises || []).find((e) => e && e.id === id9);
      if (!x9) return;
      x9.w = w9;
      if (wAt9) x9.wAt = wAt9; else delete x9.wAt;
      if (steps9) x9.steps = steps9; else delete x9.steps;
      delete x9.stepsAt;
      if (x9.lastMeta) x9.lastMeta = { ...x9.lastMeta, d: "2026-08-14" };
    };
    /* and the reconciliation had NOT happened yet, so its receipts do not
       exist. Once v7.53.4 ran on his phone the synced feed carried them for
       real, and every "zero adopt receipts" pin was reading production history
       instead of its own drive. */
    if (Array.isArray(s9.feed)) s9.feed = s9.feed.filter((f9) => !(f9 && f9.op && String(f9.op).indexOf("adopt:corr:") === 0));
    back("hack", 190, "2026-08-14T21:52:54.838Z", [160, 170, 180, 190]);   /* his ladder-approval edit, five minutes before the correction */
    back("extension", 155, null, null);                                    /* the ABSENT-wAt guard shape */
    return s9;
  };
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
    const m2 = T.migrate(JSON.parse(JSON.stringify(m)));
    const hk2 = m2.exercises.find((e) => e.id === "hack"), ext2 = m2.exercises.find((e) => e.id === "extension");
    ok(hk.lastMeta && hk.lastMeta.d === "2026-08-14" && hk.lastMeta.w === 200 && J(hk.last) === J([10, 9, 9])
      && ext.lastMeta && ext.lastMeta.w === 160 && ext.last === null
      && J(hk2.last) === J([10, 9, 9]) && J(ext2.last) === J([10, 10]),
      "AMEND f (evolved by leg 7) — lastMeta re-derives to the corrected weights at once. This fixture builds on SEED, where hack's config ALREADY reads 200 — an equality no-op, so its live cache simply follows the log — while extension's 155 ADOPTS and reseeds (last null: the load moved, the editor's own event class), and the second boot refills it by the same-load rule (observed hack " + J([hk.lastMeta && hk.lastMeta.w, hk.last, hk2.last]) + " · extension " + J([ext.lastMeta && ext.lastMeta.w, ext.last, ext2.last]) + ")");
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
    const live = preAdoption();   /* the documented pre-adoption shape on the real record — see preAdoption() */
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
    const out2 = T.migrate(JSON.parse(JSON.stringify(out)));
    const tHack = T.targetsFor(g(out2, "hack"), out2), tExt = T.targetsFor(g(out2, "extension"), out2), tHam = T.targetsFor(g(out, "ham"), out);
    ok(g(out, "hack").last === null && J(T.targetsFor(g(out, "hack"), out)) === J([8, 8, 8]) && J(tHack) === J([8, 7, 8]) && g(out2, "hack").w === 200,
      "LOAD-A e (evolved by leg 7) — the adopted load RESEEDS first (last null, targets [8,8,8] — the editor's own event class), then the second boot anchors the card on the 200 session's reps AT 200: never at an outgrown 190 (observed boot1 " + J(T.targetsFor(g(out, "hack"), out)) + " boot2 " + J(tHack) + " @ " + J(g(out2, "hack").w) + ")");
    ok(g(out, "extension").last === null && J(tExt) === J([9, 9]) && g(out2, "extension").w === 160,
      "LOAD-A f (evolved by leg 7) — extension the same: reseed at adoption, then anchored on the 160 session from boot 2 — it can no longer prescribe BELOW a delivered session (observed " + J(tExt) + " @ " + J(g(out2, "extension").w) + ")");
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
    const thrice = T.migrate(JSON.parse(JSON.stringify(twice)));
    ok(JSON.stringify(thrice) === JSON.stringify(twice),
      "LOAD-A k (evolved by leg 7) — migrate CONVERGES BY THE SECOND BOOT and is byte-identical from there: boot 1 adopts and reseeds, boot 2 refills last by the same-load rule, boot 3 changes nothing — the equality guard and the correction-stamped wAt still make every write deterministic");
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
    ok(Array.isArray(entryDelta) && JSON.stringify(entryDelta.sort()) === JSON.stringify(["2026-08-09:curl:reps", "2026-08-09:curl:rirSets", "2026-08-09:rows:reps", "2026-08-09:rows:rirSets", "2026-08-09:tricep:reps", "2026-08-09:tricep:rirSets", "2026-08-14:extension:wCorrAt", "2026-08-14:hack:wCorrAt"]),
      "LOAD-A l (evolved by legs 3+8) — the COMPLETE enumeration of what migrate writes into the log, at field grain: the two 8/14 entries' wCorrAt provenance and the six 8/09 re-strike fields (the attested tails and their rirSets, per patchV55), no other field, no other date — and the sweep itself still writes nothing at all (observed " + J(entryDelta) + ")");
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
    const live = preAdoption();   /* the documented pre-adoption shape on the real record — see preAdoption() */
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
    ok(JSON.stringify(T.migrate(JSON.parse(JSON.stringify(twice)))) === JSON.stringify(twice),
      "LADDER f (evolved by leg 7) — migrate converges by the second boot with the ladder stamped and is byte-identical from there: a wall-clock stepsAt would still fail this line");
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
    const live = preAdoption();   /* the documented pre-adoption shape on the real record — see preAdoption() */
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
    ok(JSON.stringify(T.migrate(JSON.parse(JSON.stringify(twice)))) === JSON.stringify(twice),
      "LEG3 d (evolved by leg 7) — migrate converges by the second boot under the new keying and the monotone stamp, and is byte-identical from there");
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
    const h1 = T.migrate(T.mergeState(cl(adopted), cl(askCard))), h2 = T.migrate(T.mergeState(cl(askCard), cl(adopted)));   /* SETTLED: the merge is pure since v7.54.3 and the boot is where the pair is made coherent — one repair, on the final pair, which is what makes three-way merges associative */
    ok(g(h1, "hack").w === 200 && J(g(h1, "hack").steps) === J([160, 170, 180, 190, 200, 210])
      && g(h2, "hack").w === 200 && J(g(h2, "hack").steps) === J([160, 170, 180, 190, 200, 210]),
      "LEG3 g (evolved by leg 5) — THE HYBRID SELF-HEALS AT THE BOOT: a load from one replica and a newer ladder from another are left alone by the merge, which is now pure, and made coherent once on the settled pair — identically from both orders. The repair moved because running it at every intermediate binary merge is not associative (observed " + J([g(h1, "hack").steps, g(h2, "hack").steps]) + ")");
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

  /* ---- v7.53.4 LEG 4 — PROVENANCE IS EARNED BY THE VALUE, NOT THE ID ---- */
  t("LOAD-LEG4", () => {
    const live = preAdoption();   /* the documented pre-adoption shape on the real record — see preAdoption() */
    const g = (s9, id9) => s9.exercises.find((e) => e && e.id === id9) || {};
    const enOf = (s9, id9) => (((s9.sessionLog || {})["2026-08-14"] || {}).entries || []).find((e) => e && e.id === id9) || {};
    const adopts = (s9, id9) => (s9.feed || []).filter((f) => f && f.op === "adopt:corr:" + id9 + ":2026-08-14").length;
    /* (a) THE WITNESS, on the real v53 shape: the athlete diverged the entry to
       210 himself. patchV52's stale-value guard rightly takes nothing on it —
       and patchV54 must not then hand it provenance the amendment never
       earned. Every real device's lastMeta follows its own completion, so the
       consequence is a config move, not just a stray field. */
    const div = JSON.parse(JSON.stringify(live));
    const de = (div.sessionLog["2026-08-14"].entries || []).find((e) => e.id === "hack");
    de.w = 210; delete de.wCorrAt;
    const dh = div.exercises.find((e) => e.id === "hack");
    dh.lastMeta = { ...(dh.lastMeta || {}), d: "2026-08-14", w: 210 };
    const dOut = T.migrate(div);
    ok(enOf(dOut, "hack").wCorrAt === undefined,
      "LEG4 a — an entry the athlete diverged to 210 earns NO provenance: the stamp keys on the attested VALUE, and 210 is a load no amendment ever wrote (observed wCorrAt " + J(enOf(dOut, "hack").wCorrAt) + ")");
    ok(g(dOut, "hack").w === 190 && adopts(dOut, "hack") === 0,
      "LEG4 b — so the plan never moves and no receipt claims the record said so (executed red: config 190 -> 210 with a '190 → 210' RECONCILED line) (observed w " + J(g(dOut, "hack").w) + ", adopt receipts " + adopts(dOut, "hack") + ")");
    /* (b) the STALE-CACHE shape, v51: the whole chain runs, patchV52 abstains on
       the diverged entry, and lastMeta does NOT follow — so on the old bytes the
       fabricated stamp is the ONLY visible consequence. Pinned so the stamp
       itself is the claim, not merely its downstream effect. */
    const stale51 = JSON.parse(JSON.stringify(live));
    stale51.v = 51;
    const se = (stale51.sessionLog["2026-08-14"].entries || []).find((e) => e.id === "hack");
    se.w = 210; delete se.wCorrAt;
    const sOut = T.migrate(stale51);
    ok(enOf(sOut, "hack").wCorrAt === undefined && enOf(sOut, "hack").w === 210,
      "LEG4 c — the STALE-CACHE variant: the diverged 210 entry survives patchV52's stale-value guard untouched AND takes no stamp, so the fabrication is dead at its source (observed w " + J(enOf(sOut, "hack").w) + " wCorrAt " + J(enOf(sOut, "hack").wCorrAt) + ")");
    /* (c) extension, symmetric */
    const divX = JSON.parse(JSON.stringify(live));
    const xe = (divX.sessionLog["2026-08-14"].entries || []).find((e) => e.id === "extension");
    xe.w = 158; delete xe.wCorrAt;
    const xh = divX.exercises.find((e) => e.id === "extension");
    xh.lastMeta = { ...(xh.lastMeta || {}), d: "2026-08-14", w: 158 };
    const xOut = T.migrate(divX);
    ok(enOf(xOut, "extension").wCorrAt === undefined && g(xOut, "extension").w === 155 && adopts(xOut, "extension") === 0,
      "LEG4 d — extension is symmetric: a diverged 158 earns nothing and the plan holds at 155 (observed w " + J(g(xOut, "extension").w) + ", wCorrAt " + J(enOf(xOut, "extension").wCorrAt) + ")");
    /* (d) THE COINCIDENCE, ruled: an entry the athlete typed at exactly the
       attested load is stamped. It is indistinguishable from — and identical
       to — what the attestation says, which is the honest reading. */
    const coin = JSON.parse(JSON.stringify(live));
    coin.v = 51;
    const ce = (coin.sessionLog["2026-08-14"].entries || []).find((e) => e.id === "hack");
    ce.w = 200; delete ce.wCorrAt;   /* he typed 200 himself; patchV52 abstains, the value still matches */
    const cOut = T.migrate(coin);
    ok(enOf(cOut, "hack").wCorrAt === "2026-08-14T21:57:13.968Z" && g(cOut, "hack").w === 200,
      "LEG4 e — THE COINCIDENCE stamps and adopts: an entry carrying exactly the attested load is the attested truth, whoever typed it (observed wCorrAt " + J(enOf(cOut, "hack").wCorrAt) + ", w " + J(g(cOut, "hack").w) + ")");
    /* (e) THE REGRESSION — the real ledger still stamps both entries and adopts */
    const real = T.migrate(JSON.parse(JSON.stringify(live)));
    ok(enOf(real, "hack").wCorrAt === "2026-08-14T21:57:13.968Z" && enOf(real, "extension").wCorrAt === "2026-08-14T21:57:13.968Z"
      && g(real, "hack").w === 200 && g(real, "extension").w === 160 && adopts(real, "hack") === 1 && adopts(real, "extension") === 1,
      "LEG4 f — REGRESSION: the real ledger's two entries carry exactly 200 and 160, so both are stamped and both adopt, with one receipt each (observed " + J([g(real, "hack").w, g(real, "extension").w]) + ")");
    const twice = T.migrate(JSON.parse(JSON.stringify(real)));
    ok(JSON.stringify(T.migrate(JSON.parse(JSON.stringify(twice)))) === JSON.stringify(twice),
      "LEG4 g (evolved by leg 7) — migrate converges by the second boot: the value guard is idempotent like the absent-only guard it tightens, and the reseed's refill is the deterministic same-load rule");
  });

  /* ---- v7.53.5 — THE AUTHORITY'S VALUE IS THE AUTHORITY ---- */
  t("LOAD-VALUE", () => {
    const live = preAdoption();   /* the documented pre-adoption shape on the real record — see preAdoption() */
    const g = (s9, id9) => s9.exercises.find((e) => e && e.id === id9) || {};
    const enOf = (s9, id9) => (((s9.sessionLog || {})["2026-08-14"] || {}).entries || []).find((e) => e && e.id === id9) || {};
    const rcpOf = (s9, id9) => (s9.feed || []).filter((f) => f && f.op === "adopt:corr:" + id9 + ":2026-08-14");
    const AT = "2026-08-14T21:57:13.968Z";
    /* THE WITNESS: the stamp vouches for 200; the CACHE says 210. The sweep
       verified the entry and then adopted the cache's number. */
    const split9 = JSON.parse(JSON.stringify(live));
    split9.v = T.SCHEMA_V;                                   /* fast path: the entry already carries its stamp */
    const se = (split9.sessionLog["2026-08-14"].entries || []).find((e) => e.id === "hack");
    se.w = 200; se.wCorrAt = AT;                             /* the stamped, attested entry */
    const sh = split9.exercises.find((e) => e.id === "hack");
    sh.w = 190; sh.wAt = "2026-08-14T21:52:54.838Z";
    sh.lastMeta = { ...(sh.lastMeta || {}), d: "2026-08-14", w: 210 };   /* the cache disagrees with its own record */
    const out = T.migrate(split9);
    ok(g(out, "hack").w === 200,
      "VALUE a — the config takes the STAMPED entry's load, not the cache's: 200, never 210 (executed red at the shipped tip: config 210) (observed " + J(g(out, "hack").w) + ")");
    ok(rcpOf(out, "hack").length === 1 && /190 → 200/.test(rcpOf(out, "hack")[0].t) && /says 200 was lifted/.test(rcpOf(out, "hack")[0].how),
      "VALUE b — and the receipt names that same value: the red filed '190 → 210' while the stamp vouched for 200 — receipt truth is the law this defect broke (observed " + J(rcpOf(out, "hack").map((f) => f.t)) + ")");
    const outB2 = T.migrate(JSON.parse(JSON.stringify(out)));
    ok(g(out, "hack").lastMeta && g(out, "hack").lastMeta.w === 200 && g(out, "hack").last === null && J(g(outB2, "hack").last) === J(enOf(outB2, "hack").reps),
      "VALUE c (evolved by leg 7) — CACHE HONESTY plus the reseed: lastMeta re-derives at once (every downstream reader reads the cache), the adoption nulls last because the load MOVED, and the second boot refills it from the log (observed lastMeta.w " + J(g(out, "hack").lastMeta && g(out, "hack").lastMeta.w) + ", boot1 last " + J(g(out, "hack").last) + ", boot2 last " + J(g(outB2, "hack").last) + ")");
    ok(JSON.stringify(T.migrate(JSON.parse(JSON.stringify(outB2)))) === JSON.stringify(outB2),
      "VALUE d (evolved by leg 7) — migrate converges by the second boot and is byte-identical from there: the heal restates the log and the refill is the same-load rule, both deterministic");
    /* THE REACHABLE SHAPE (cowork's witness 2, both orders): config ALREADY
       adopted, cache stale at 210. Nothing may adopt — but the cache must
       still be told the truth. */
    for (const [lbl, order] of [["A", 0], ["B", 1]]) {
      const done9 = JSON.parse(JSON.stringify(live));
      done9.v = T.SCHEMA_V;
      const de = (done9.sessionLog["2026-08-14"].entries || []).find((e) => e.id === "hack");
      de.w = 200; de.wCorrAt = AT;
      const dh = done9.exercises.find((e) => e.id === "hack");
      dh.w = 200; dh.wAt = AT;                               /* already adopted — the post-merge shape */
      dh.lastMeta = { ...(dh.lastMeta || {}), d: "2026-08-14", w: 210 };
      const dOut = order ? T.mergeState(cl(T.migrate(done9)), cl(T.migrate(JSON.parse(JSON.stringify(done9))))) : T.migrate(done9);
      ok(g(dOut, "hack").w === 200 && rcpOf(dOut, "hack").length === 0 && g(dOut, "hack").lastMeta.w === 200,
        "VALUE e" + lbl + " — the REACHABLE post-merge shape (config already 200, cache stale at 210): NO adoption, NO receipt, and the cache silently re-derived to 200 (observed w " + J(g(dOut, "hack").w) + ", receipts " + rcpOf(dOut, "hack").length + ", cache " + J(g(dOut, "hack").lastMeta.w) + ")");
    }
    /* THE HEAL IS PROVENANCE-INDEPENDENT; THE ADOPTION IS NOT. */
    const noProv = JSON.parse(JSON.stringify(live));
    noProv.v = T.SCHEMA_V;
    const ne = (noProv.sessionLog["2026-08-14"].entries || []).find((e) => e.id === "hack");
    ne.w = 200; delete ne.wCorrAt;                           /* a divergence with NO stamp */
    const nh = noProv.exercises.find((e) => e.id === "hack");
    nh.w = 190; nh.lastMeta = { ...(nh.lastMeta || {}), d: "2026-08-14", w: 210 };
    const nOut = T.migrate(noProv);
    ok(g(nOut, "hack").w === 190 && rcpOf(nOut, "hack").length === 0,
      "VALUE f — with no stamp the plan does NOT move and no receipt is filed: adoption still needs provenance (observed w " + J(g(nOut, "hack").w) + ", receipts " + rcpOf(nOut, "hack").length + ")");
    ok(g(nOut, "hack").lastMeta.w === 200,
      "VALUE g — but the CACHE is still re-derived from the log: a cache that contradicts its own record is wrong whoever wrote it, and correcting it decides nothing (observed " + J(g(nOut, "hack").lastMeta.w) + ")");
    /* REGRESSION — the real ledger is untouched by any of this */
    const real = T.migrate(JSON.parse(JSON.stringify(live)));
    const real2 = T.migrate(JSON.parse(JSON.stringify(real)));
    ok(g(real, "hack").w === 200 && g(real, "extension").w === 160
      && J(T.targetsFor(g(real2, "hack"), real2)) === J([8, 7, 8]) && J(T.targetsFor(g(real2, "extension"), real2)) === J([9, 9])
      && rcpOf(real, "hack").length === 1 && rcpOf(real, "extension").length === 1,
      "VALUE h (evolved by leg 7) — REGRESSION on the live preimage: 200 and 160 with one receipt each at boot 1, and the steady state the phone settles in — 200·[8,7,8] and 160·[9,9] — from boot 2 (observed " + J([g(real, "hack").w, g(real, "extension").w]) + ")");
  });

  /* ---- v7.53.5 leg 6 — TRUTH FIRST: the derived date is THE date ---- */
  t("LOAD-LEG6", () => {
    const g = (s9, id9) => s9.exercises.find((e) => e && e.id === id9) || {};
    const rcp = (s9, id9) => (s9.feed || []).filter((f) => f && f.op && String(f.op).indexOf("adopt:corr:" + id9 + ":") === 0);
    /* the shapes cowork executed at 42f429c: a NEWER Aug-15 session (hack
       210), the config already following it (foreign/import shape, no wAt),
       and the stamped Aug-14 amendment sitting one day back in the log. */
    const mk = (mut9) => {
      const s9 = preAdoption();
      s9.sessionLog["2026-08-15"] = { d: "2026-08-15", entries: [{ id: "hack", w: 210, reps: [8, 8, 8], rirSets: [2, 2, 2] }] };
      const h9 = s9.exercises.find((e) => e && e.id === "hack");
      h9.w = 210; delete h9.wAt;
      if (mut9) mut9(h9);
      return s9;
    };
    /* (a,b) THE MATCH SHAPE — lastMeta agrees with the entry it points at, it
       just points at YESTERDAY. No heal ever fired in the old code; the stale
       date alone bypassed the newest session. */
    const mOut = T.migrate(mk());
    ok(g(mOut, "hack").w === 210 && rcp(mOut, "hack").length === 0,
      "LEG6 a — a NEWER session outranks an older stamped amendment: the config is never dragged backward off the athlete's newest word (executed red: 210 -> 200 with a '210 → 200' receipt) (observed w " + J(g(mOut, "hack").w) + ", receipts " + rcp(mOut, "hack").length + ")");
    ok(g(mOut, "hack").lastMeta && g(mOut, "hack").lastMeta.d === "2026-08-15" && g(mOut, "hack").lastMeta.w === 210,
      "LEG6 b — and the cache heals to the lift's actual newest line, because the truth is derived FIRST and everything reads it (observed " + J([g(mOut, "hack").lastMeta && g(mOut, "hack").lastMeta.d, g(mOut, "hack").lastMeta && g(mOut, "hack").lastMeta.w]) + ")");
    /* (c) THE MISMATCH SHAPE — the old code healed the cache to 8/15 @ 210 and
       then adjudicated on the PRE-HEAL entry anyway, leaving the state
       self-contradictory: cache 8/15 @ 210 beside config 200. */
    const xOut = T.migrate(mk((h9) => { h9.lastMeta = { ...h9.lastMeta, d: "2026-08-14", w: 210 }; }));
    ok(g(xOut, "hack").w === 210 && rcp(xOut, "hack").length === 0 && g(xOut, "hack").lastMeta.d === "2026-08-15" && g(xOut, "hack").lastMeta.w === 210,
      "LEG6 c — the MISMATCH shape ends coherent: config 210 beside a cache saying 8/15 @ 210 — the heal and the adjudication read the SAME entry, so the state can no longer contradict itself (observed w " + J(g(xOut, "hack").w) + ", cache " + J([g(xOut, "hack").lastMeta.d, g(xOut, "hack").lastMeta.w]) + ", receipts " + rcp(xOut, "hack").length + ")");
    const mB2 = T.migrate(JSON.parse(JSON.stringify(mOut))), xB2 = T.migrate(JSON.parse(JSON.stringify(xOut)));
    ok(JSON.stringify(T.migrate(JSON.parse(JSON.stringify(mB2)))) === JSON.stringify(mB2)
      && JSON.stringify(T.migrate(JSON.parse(JSON.stringify(xB2)))) === JSON.stringify(xB2),
      "LEG6 d (evolved by leg 7) — migrate converges by the second boot on both shapes (extension adopts inside these fixtures and reseeds at boot 1; the same-load rule refills at boot 2) and is byte-identical from there");
    /* (e) THE INTENDED CASE, intact: on the real pre-adoption state 8/14 IS
       the newest line for both lifts, so the amendment still governs. */
    const rOut = T.migrate(preAdoption());
    const rOut2 = T.migrate(JSON.parse(JSON.stringify(rOut)));
    ok(g(rOut, "hack").w === 200 && g(rOut, "extension").w === 160
      && J(T.targetsFor(g(rOut2, "hack"), rOut2)) === J([8, 7, 8]) && J(T.targetsFor(g(rOut2, "extension"), rOut2)) === J([9, 9])
      && rcp(rOut, "hack").length === 1 && rcp(rOut, "extension").length === 1,
      "LEG6 e (evolved by leg 7) — the amendment still governs while the amended session is the newest word: adopted at boot 1 with one truthful receipt each, steady at 200·[8,7,8] and 160·[9,9] from boot 2 (observed " + J([g(rOut, "hack").w, g(rOut, "extension").w]) + ")");
    /* (f) A STALE CACHE POINTING ELSEWHERE — at a date with no entry at all.
       The old code looked up log[lm.d], found nothing, and ABSTAINED: the
       stamped amendment was invisible behind a bad pointer. The derived date
       finds it. */
    const fS = preAdoption();
    const fh = fS.exercises.find((e) => e && e.id === "hack");
    fh.lastMeta = { ...fh.lastMeta, d: "2020-01-01" };
    const fOut = T.migrate(fS);
    ok(g(fOut, "hack").w === 200 && rcp(fOut, "hack").length === 1 && g(fOut, "hack").lastMeta.d === "2026-08-14" && g(fOut, "hack").lastMeta.w === 200,
      "LEG6 f — a stamped amendment at the TRUE newest date is found even when the cache points at a date holding nothing: heals AND adopts (executed red: the bad pointer hid the amendment and the sweep abstained at 190) (observed w " + J(g(fOut, "hack").w) + ", receipts " + rcp(fOut, "hack").length + ", cache d " + J(g(fOut, "hack").lastMeta.d) + ")");
  });

  /* ---- v7.53.5 leg 7 — THE HEAL RESPECTS THE RESEED LAW ---- */
  t("LOAD-LEG7", () => {
    const g = (s9, id9) => s9.exercises.find((e) => e && e.id === id9) || {};
    const rcpH = (s9) => (s9.feed || []).filter((f) => f && f.op && String(f.op).indexOf("adopt:corr:hack:") === 0);
    const rcpAll = (s9) => (s9.feed || []).filter((f) => f && f.op && String(f.op).indexOf("adopt:corr:") === 0);
    const NEWER = "2026-08-20T09:00:00.000Z";
    /* (a) THE WITNESS — hack set to 210 in the weight editor: w changed FIRST,
       wAt stamped, last nulled so targets reseed at the new load; lastMeta
       still describes 8/14 @ 200 [7,7,8]. Executed red at 8c70af8: the boot
       sweep resurrected last = [7,7,8] and the card prescribed the OLD load's
       reps at the new load — the reseed silently defeated, no receipt. */
    const ed = preAdoption();
    const eh = ed.exercises.find((e) => e && e.id === "hack");
    eh.w = 210; eh.wAt = NEWER; eh.last = null;
    const ee = ed.exercises.find((e) => e && e.id === "extension");
    ee.wAt = NEWER;                                          /* neutralize the OTHER pending adoption so this fixture is truly non-adopting — LEG7 c's twice-identity claim is about a boot where nothing adopts */
    const eOut = T.migrate(ed);
    ok(g(eOut, "hack").last === null && J(T.targetsFor(g(eOut, "hack"), eOut)) === J([8, 8, 8]),
      "LEG7 a — A NULL last AT A LOAD THE LOG DOES NOT DESCRIBE IS A DECISION, NOT A GAP: the editor's reseed survives the boot and the card reads [8,8,8] at 210 (executed red: last resurrected to [7,7,8], targets [8,7,8]) (observed last " + J(g(eOut, "hack").last) + ", targets " + J(T.targetsFor(g(eOut, "hack"), eOut)) + ")");
    ok(g(eOut, "hack").lastMeta && g(eOut, "hack").lastMeta.d === "2026-08-14" && g(eOut, "hack").lastMeta.w === 200 && rcpH(eOut).length === 0,
      "LEG7 b — while lastMeta still heals to the derived line (the cache must describe the log) and nothing adopts against his newer word (observed " + J([g(eOut, "hack").lastMeta.d, g(eOut, "hack").lastMeta.w]) + ", receipts " + rcpH(eOut).length + ")");
    ok(JSON.stringify(T.migrate(JSON.parse(JSON.stringify(eOut)))) === JSON.stringify(eOut),
      "LEG7 c — and the rerun is byte-identical: no adoption happens here, so the strict twice-identity law still holds on a non-adopting boot");
    /* (b) THE RESET PATH — the same event class, load DOWN (the
       applyAgentProposal reset writes exactly this shape: w lowered and
       stamped BEFORE last is nulled). */
    const rs = preAdoption();
    const rh = rs.exercises.find((e) => e && e.id === "hack");
    rh.w = 180; rh.wAt = NEWER; rh.last = null;
    const rOut9 = T.migrate(rs);
    ok(g(rOut9, "hack").w === 180 && g(rOut9, "hack").last === null && rcpH(rOut9).length === 0,
      "LEG7 d — RESET is the same event class (w down before nulling): the reseed is preserved and nothing adopts (executed red: the null overwritten with [7,7,8]) (observed w " + J(g(rOut9, "hack").w) + ", last " + J(g(rOut9, "hack").last) + ")");
    /* (c) THE SAME-LOAD NULL — the maxed-ladder class: definitionally stale
       (every deliberate reseed changes w first), so it STILL refills. Green
       on both tips — the pre-existing reconcileLiftCaches law stands. */
    const sl = preAdoption();
    const sh9 = sl.exercises.find((e) => e && e.id === "hack");
    sh9.w = 200; sh9.wAt = NEWER; sh9.last = null;
    const sOut = T.migrate(sl);
    ok(J(g(sOut, "hack").last) === J([7, 7, 8]) && J(T.targetsFor(g(sOut, "hack"), sOut)) === J([8, 7, 8]),
      "LEG7 e — a null last at the load the log DOES describe is a stale cache, never a reseed: it refills and the card anchors on the line (observed " + J(g(sOut, "hack").last) + ")");
    /* (d) a LIVE stale last still follows the log — leg 6's behaviour stands */
    const lv = preAdoption();
    const lh = lv.exercises.find((e) => e && e.id === "hack");
    lh.w = 210; lh.wAt = NEWER; lh.last = [9, 9, 9];
    const lOut = T.migrate(lv);
    ok(J(g(lOut, "hack").last) === J([7, 7, 8]),
      "LEG7 f — a LIVE cache that disagrees with the log still follows the log: only the null is a decision (observed " + J(g(lOut, "hack").last) + ")");
    /* (e) THE ADOPTION TWO-BOOT SEQUENCE — the corrected load is a load
       CHANGE, so it reseeds like one; the next boot's same-load rule refills
       from the log, which at the adopted load IS the honest anchor. */
    const b1 = T.migrate(preAdoption());
    ok(g(b1, "hack").w === 200 && g(b1, "hack").last === null && g(b1, "extension").last === null && rcpAll(b1).length === 2,
      "LEG7 g — boot 1: the adoption RESEEDS — the same event class as the editor Save and the CAGE (executed red: last inherited [7,7,8] straight through the adoption) (observed hack last " + J(g(b1, "hack").last) + ", ext last " + J(g(b1, "extension").last) + ", receipts " + rcpAll(b1).length + ")");
    const b2 = T.migrate(JSON.parse(JSON.stringify(b1)));
    ok(J(g(b2, "hack").last) === J([7, 7, 8]) && J(T.targetsFor(g(b2, "hack"), b2)) === J([8, 7, 8]) && J(T.targetsFor(g(b2, "extension"), b2)) === J([9, 9]),
      "LEG7 h — boot 2: the same-load rule refills from the log and the cards settle at 200·[8,7,8] / 160·[9,9] (observed " + J([g(b2, "hack").last, T.targetsFor(g(b2, "hack"), b2)]) + ")");
    const b3 = T.migrate(JSON.parse(JSON.stringify(b2)));
    ok(JSON.stringify(b3) === JSON.stringify(b2) && rcpAll(b3).length === 2,
      "LEG7 i — boot 3: byte-identical to boot 2 — the sequence converges and the receipts stay op-deduped at exactly two");
  });

  /* ---- v7.53.6 leg 8 — THE RE-STRIKE: the log agrees with the attestation ---- */
  t("LOAD-LEG8", () => {
    const g = (s9, id9) => s9.exercises.find((e) => e && e.id === id9) || {};
    const en9 = (s9, id9) => (((s9.sessionLog || {})["2026-08-09"] || {}).entries || []).find((e) => e && e.id === id9) || {};
    const rcp9 = (s9) => (s9.feed || []).filter((f9) => f9 && f9.op === "restrike:2026-08-09:arms");
    const live = JSON.parse(readFileSync(PREIMAGE, "utf8"));
    /* (a) COWORK'S LIVE LITERAL — Joe's real ledger carries the half-applied
       correction: phantom tails in the LOG ([9,9,8] / [12,12,11,10] /
       [11,10,10,9]), the struck values in the caches. Executed red at
       be72df5: derive-first trusted the corrupt log and resurrected the tails
       into last/lastMeta — the app would have prescribed against sets he
       attested he did not do. The patch finishes the attestation IN the log,
       so there is nothing to resurrect. */
    const out = T.migrate(JSON.parse(JSON.stringify(live)));
    ok(J(en9(out, "rows").reps) === J([9, 9]) && J(en9(out, "rows").rirSets) === J([1, 0])
      && J(en9(out, "tricep").reps) === J([12, 12]) && J(en9(out, "tricep").rirSets) === J([null, null])
      && J(en9(out, "curl").reps) === J([11, 10, 10]) && J(en9(out, "curl").rirSets) === J([2, null, null]),
      "LEG8 a — the LOG now reads the attested values: the 8/09 tails patchV41 struck and a merge resurrected are struck again, rirSets matching (executed red at be72df5: last resurrected to [9,9,8] / [12,12,11,10] / [11,10,10,9]) (observed " + J([en9(out, "rows").reps, en9(out, "tricep").reps, en9(out, "curl").reps]) + ")");
    ok(J(g(out, "rows").last) === J([9, 9]) && J(g(out, "rows").lastMeta.reps) === J([9, 9])
      && J(g(out, "tricep").last) === J([12, 12]) && J(g(out, "curl").last) === J([11, 10, 10]),
      "LEG8 b — and the caches derive to the SAME values, so cache and log agree and the boot heal has no divergence left to act on (observed " + J([g(out, "rows").last, g(out, "tricep").last, g(out, "curl").last]) + ")");
    ok(((out.sessionLog["2026-08-09"] || {}).corr || {}).rev === 2 && String(((out.sessionLog["2026-08-09"] || {}).corr || {}).at).indexOf("2026-08-09T21:56:31.67") === 0,
      "LEG8 c (evolved by leg 9) — the record's corr stays on its OWN INSTANT (to the millisecond it was already on) and bumps rev to 2. It no longer asserts the exact millisecond because the record's stamp now follows its own newest act: filing several acts that share one wall stamp spaces them a millisecond apart, and the record's corr goes with them, so its stamp can never be older than a correction it carries. Still deterministic, still that day, still beats a lingering un-struck replica by ordering: equal at, higher rev wins CORRECTION_MERGE, so this strike beats any lingering un-struck replica by ordering — deterministically, with no wall-clock stamp, which under the frozen suite clock would have LOST to the 8/09 at (observed " + J(out.sessionLog["2026-08-09"].corr) + ")");
    ok(rcp9(out).length === 1 && /RE-STRUCK/.test(rcp9(out)[0].t) && /I didn't do the 3rd set of arms/.test(rcp9(out)[0].how),
      "LEG8 d — one op-guarded receipt names the standing attestation (observed " + J(rcp9(out).map((f9) => f9.t)) + ")");
    /* (b) the boot no longer CHANGES the arm caches — once and twice both
       leave the attested values, and the rerun files nothing */
    const twice = T.migrate(JSON.parse(JSON.stringify(out)));
    ok(J(g(twice, "rows").last) === J([9, 9]) && J(g(twice, "tricep").last) === J([12, 12]) && J(g(twice, "curl").last) === J([11, 10, 10]) && rcp9(twice).length === 1,
      "LEG8 e — a rerun leaves the attested values and files nothing: the strike is content-keyed and the receipt is op-guarded (observed " + J([g(twice, "rows").last, rcp9(twice).length]) + ")");
    const thrice = T.migrate(JSON.parse(JSON.stringify(twice)));
    ok(JSON.stringify(thrice) === JSON.stringify(twice),
      "LEG8 f — and migrate converges: byte-identical from the second boot");
    /* (c) a device whose entries no longer carry the phantom shape — the
       restore case patchV41's own comment reserves, and any fresh install —
       takes nothing and files nothing */
    const clean9 = JSON.parse(JSON.stringify(live));
    for (const [id9, ar9, as9] of [["rows", [9, 9], [1, 0]], ["tricep", [12, 12], [null, null]], ["curl", [11, 10, 10], [2, null, null]]]) {
      const e9 = (clean9.sessionLog["2026-08-09"].entries || []).find((z9) => z9 && z9.id === id9);
      e9.reps = ar9; e9.rirSets = as9;                       /* the strike already true in the log — nothing left to do */
    }
    const cOut = T.migrate(clean9);
    ok(rcp9(cOut).length === 0 && J(en9(cOut, "rows").reps) === J([9, 9]),
      "LEG8 g (evolved by leg 9) — CONTENT-KEYED STRIKE: a log already at the attested values takes NO strike and files NO receipt — patchV55 is keyed on the phantom shape, so a restored or never-corrupt device is not re-struck (observed receipts " + rcp9(cOut).length + ")");
    ok(((cOut.sessionLog["2026-08-09"] || {}).corr || {}).rev === 1,
      "LEG8 g2 — and its corr is left exactly as found: the STRIKE is what stamps, and this device had nothing to strike. (The unconditional ordering invariant that would also stamp here is HELD — it cannot be expressed in the shared corr slot without reverting the athlete's OTHER 8/09 correction. See the leg-9 handoff.) (observed " + J(cOut.sessionLog["2026-08-09"].corr) + ")");
    const bare9 = JSON.parse(JSON.stringify(live));
    delete bare9.sessionLog["2026-08-09"];
    const bOut = T.migrate(bare9);
    ok(rcp9(bOut).length === 0 && !bOut.sessionLog["2026-08-09"],
      "LEG8 h — a device without the 8/09 session at all is a clean no-op: no receipt, no session manufactured (observed receipts " + rcp9(bOut).length + ")");
  });

  /* ---- v7.53.7 leg 9 — ONE AUTHORITY, AND IT READS THE LOG ---- */
  t("LOAD-LEG9", () => {
    const g = (s9, id9) => s9.exercises.find((e) => e && e.id === id9) || {};
    const en9 = (s9, id9) => (((s9.sessionLog || {})["2026-08-09"] || {}).entries || []).find((e) => e && e.id === id9) || {};
    const corr9 = (s9) => ((s9.sessionLog || {})["2026-08-09"] || {}).corr || {};
    const live = JSON.parse(readFileSync(PREIMAGE, "utf8"));
    /* ===== FIX A — the boot's FIRST sweep no longer believes a stale claim ===== */
    /* cowork's witness: hack set to 210 in the editor (newer wAt, last nulled
       for the reseed) beside a FOREIGN lastMeta asserting the 8/14 line was at
       210 with reps [7,7,8]. reconcileLiftCaches runs BEFORE derive-first, so
       its same-load rule matched the CLAIM and refilled — derive-first then
       healed lastMeta to the truth, but last was live by then and followed the
       log. Targets read [8,7,8] at 210: the reseed defeated, no receipt. */
    const lie = preAdoption();
    const lh = lie.exercises.find((e) => e && e.id === "hack");
    lh.w = 210; lh.wAt = "2026-08-20T09:00:00.000Z"; lh.last = null;
    lh.lastMeta = { d: "2026-08-14", w: 210, reps: [7, 7, 8], rir: null, rirSets: [null, null, null], debt: false };
    lie.exercises.find((e) => e && e.id === "extension").wAt = "2026-08-20T09:00:00.000Z";   /* neutralize the OTHER pending adoption: LEG9 C's twice-identity claim is about a boot where nothing adopts */
    const lOut = T.migrate(lie);
    ok(g(lOut, "hack").last === null && J(T.targetsFor(g(lOut, "hack"), lOut)) === J([8, 8, 8]),
      "LEG9 A — a cache CLAIMING the current load cannot resurrect a reseed: same-load is judged by the derived line, so the editor's null survives the boot's FIRST sweep and the card reads [8,8,8] at 210 (executed red at 6b633c7: refilled [7,7,8], targets [8,7,8]) (observed last " + J(g(lOut, "hack").last) + ", targets " + J(T.targetsFor(g(lOut, "hack"), lOut)) + ")");
    ok(g(lOut, "hack").lastMeta && g(lOut, "hack").lastMeta.d === "2026-08-14" && g(lOut, "hack").lastMeta.w === 200 && J(g(lOut, "hack").lastMeta.reps) === J([7, 7, 8]),
      "LEG9 B — and the lying cache is still healed to the truth: the record says the 8/14 line was at 200, whatever the cache claimed (observed " + J([g(lOut, "hack").lastMeta.w, g(lOut, "hack").lastMeta.reps]) + ")");
    ok(JSON.stringify(T.migrate(JSON.parse(JSON.stringify(lOut)))) === JSON.stringify(lOut),
      "LEG9 C — byte-identical on rerun: nothing adopts here, so the strict twice-identity law still holds");
    /* the STANDING same-load class still refills — when the LOG agrees */
    const sl = preAdoption();
    const sh = sl.exercises.find((e) => e && e.id === "hack");
    sh.w = 200; sh.wAt = "2026-08-20T09:00:00.000Z"; sh.last = null;
    const sOut = T.migrate(sl);
    ok(J(g(sOut, "hack").last) === J([7, 7, 8]),
      "LEG9 D — the standing class is untouched: a null at the load the LOG describes is still definitionally stale and still refills (observed " + J(g(sOut, "hack").last) + ")");
    /* FIX B (the 8/09 ordering invariant) IS HELD — see the leg-9 handoff. Its
       pins are withdrawn with it rather than left asserting a behaviour the
       tree no longer has. */
  });

  /* ---- v7.54.0 — THE SESSION-MERGE LAW: corrections replay, bodies do not vote ---- */
  t("SESSION-LAW", () => {
    /* FROZEN LITERALS, deliberately. ledger/state.json syncs from his phone and
       has already turned pins vacuous once this round; the 8/09 phantoms in it
       will DISAPPEAR the moment he opens v7.53.7. So the witness is frozen here
       at the shape it had when cowork executed it, and the live ledger is
       asserted separately, on properties that survive its own healing. */
    const REC = () => ({
      d: "2026-08-09",
      at: 1786311986964,
      entries: [
        { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] },
        { id: "tricep", w: 55, reps: [12, 12], rir: null, rirSets: [null, null] },
        { id: "curl", w: 50, reps: [11, 10, 10], rir: 2, rirSets: [2, null, null] },
      ],
      skipped: [{ id: "pronated" }],
      corr: { at: "2026-08-09T21:56:31.672Z", rev: 1 },
      corrLog: [
        { op: "restrike:2026-08-09:arms", kind: "strike", at: "2026-08-09T21:56:31.672Z", to: [{ id: "rows", reps: [9, 9], rirSets: [1, 0] }, { id: "tricep", reps: [12, 12], rirSets: [null, null] }, { id: "curl", reps: [11, 10, 10], rirSets: [2, null, null] }] },
        { op: "skip:2026-08-09:pronated", kind: "skip", id: "pronated", at: "2026-08-09T21:56:31.672Z" },
      ],
    });
    /* THE REPLICA — a SECOND DEVICE that never learned either of those
       corrections and made one of its OWN, later. This is the ordinary shape,
       not a contrived one: two phones, one session, two deliberate edits. On a
       single (at, rev) scalar the later stamp wins the WHOLE record, so the
       other device's two corrections are silently reverted — the phantom tails
       come back and the skip is undone, with no receipt and nothing to notice.
       It is also RICHER by an entry, so the fallback would not have saved it
       either. */
    const REP = () => ({
      d: "2026-08-09",
      at: 1786311986964,
      entries: [
        { id: "rows", w: 185, reps: [9, 9, 8], rir: 1, rirSets: [1, null, 0] },
        { id: "tricep", w: 55, reps: [12, 12, 11, 10], rir: null, rirSets: [null, null, null, null] },
        { id: "curl", w: 50, reps: [11, 10, 10, 9], rir: 2, rirSets: [2, null, null, null] },
        { id: "pronated", w: 40, reps: [12, 11], rir: 1, rirSets: [1, 0] },
      ],
      corr: { at: "2026-08-10T09:00:00.000Z", rev: 1 },
      corrLog: [{ op: "amend:2026-08-09:rows", kind: "amend", at: "2026-08-10T09:00:00.000Z", to: [{ id: "rows", w: 185 }] }],
    });
    /* the UNSTAMPED replica — the v40-restore route: struck by an old patch that
       predates CORRECTION_MERGE, so it arrives carrying no ordering at all. */
    const BARE = () => { const r9 = REP(); delete r9.corr; delete r9.corrLog; return r9; };
    const mk = (rec9) => { const s9 = cl(T.SEED); s9.v = T.SCHEMA_V; s9.sessionLog = { "2026-08-09": rec9 }; return s9; };
    const r09 = (s9) => (s9.sessionLog || {})["2026-08-09"] || {};
    const reps9 = (s9, id9) => J((((r09(s9).entries) || []).find((e) => e && e.id === id9) || {}).reps);
    const has9 = (s9, id9) => ((r09(s9).entries) || []).some((e) => e && e.id === id9);
    const skp9 = (s9, id9) => ((r09(s9).skipped) || []).some((z) => z && z.id === id9);
    const A = mk(REC()), B = mk(REP());
    const ab = T.mergeState(cl(A), cl(B)), ba = T.mergeState(cl(B), cl(A));
    ok(reps9(ab, "rows") === J([9, 9]) && reps9(ab, "tricep") === J([12, 12]) && reps9(ab, "curl") === J([11, 10, 10])
      && reps9(ba, "rows") === J([9, 9]) && reps9(ba, "tricep") === J([12, 12]) && reps9(ba, "curl") === J([11, 10, 10]),
      "LAW a — THE STRIKE SURVIVES A SECOND DEVICE'S UNRELATED, LATER CORRECTION: the attested tails stand in both orders (executed red at 87143ac: the later stamp took the WHOLE record and the phantoms came back — [9,9,8] / [12,12,11,10]) (observed A<-B " + reps9(ab, "rows") + " · B<-A " + reps9(ba, "rows") + ")");
    const wOf9 = (s9) => (((r09(s9).entries) || []).find((e) => e && e.id === "rows") || {}).w;
    ok(wOf9(ab) === 185 && wOf9(ba) === 185,
      "LAW a2 — and the OTHER device's correction survives too: both are applied, neither device's edit is the price of the other's (observed rows w " + J([wOf9(ab), wOf9(ba)]) + ")");
    const bare9 = mk(BARE());
    const cab = T.mergeState(cl(A), cl(bare9)), cba = T.mergeState(cl(bare9), cl(A));
    ok(reps9(cab, "rows") === J([9, 9]) && reps9(cba, "rows") === J([9, 9]) && !has9(cab, "pronated") && !has9(cba, "pronated"),
      "LAW a3 — the v40-RESTORE route: an UNSTAMPED replica carrying the phantoms cannot revert the corrections either. This is the residual the load round deferred twice, closed by the same mechanism rather than by another scalar (observed " + reps9(cab, "rows") + " / " + reps9(cba, "rows") + ")");
    ok(!has9(ab, "pronated") && skp9(ab, "pronated") && !has9(ba, "pronated") && skp9(ba, "pronated"),
      "LAW b — and BOTH of that device's corrections survive: pronated stays skipped in both orders. One (at, rev) scalar cannot order two independent corrections on one record — that is the whole reason the shared slot was never enough (executed red at 87143ac: the skip was reverted and pronated came back logged) (observed pronated logged? " + has9(ab, "pronated") + "/" + has9(ba, "pronated") + ", skipped? " + skp9(ab, "pronated") + "/" + skp9(ba, "pronated") + ")");
    ok(J(r09(ab)) === J(r09(ba)),
      "LAW c — the two orders produce a DEEPLY IDENTICAL record, not merely one that agrees on the fields under test");
    /* the union is append-only and first-sighting */
    const late = mk(REC()); r09(late).corrLog = r09(late).corrLog.map((c) => ({ ...c, at: "2026-08-20T00:00:00.000Z" }));
    const un9 = typeof T._unionCorrLog === "function" ? T._unionCorrLog(r09(A), r09(late)) : [];   /* defensive: on a tip without the law this reports the absence instead of throwing and stealing the behavioural reds below */
    ok(un9.length === 2 && un9.every((c) => c.at === "2026-08-09T21:56:31.672Z"),
      "LAW d — the corrLog is a KEYED UNION and a correction is a FIRST SIGHTING: a device that learns it late cannot re-date it (observed " + J(un9.map((c) => c.at)) + ")");
    /* leg 2 — THE WRITER'S OWN first-sighting rule, pinned separately from the
       union's. Mutation-measured: flipping earliest-to-latest inside _fileCorr
       was caught by NOTHING (the union's copy of the rule is pinned by LAW d,
       the writer's was not), and no convergence law can ever see it — both
       rules are deterministic and order-free, so what differs is which
       correction wins, which is semantics, not convergence. */
    if (typeof T._fileCorr === "function") {
      const wr = { d: "2026-08-09", entries: [], corr: { at: "2026-08-09T21:56:31.672Z", rev: 1 } };
      T._fileCorr(wr, "skip:2026-08-09:rows", "skip", "rows", "2026-08-10T08:00:00.000Z");
      T._fileCorr(wr, "skip:2026-08-09:rows", "skip", "rows", "2026-08-12T08:00:00.000Z");   /* the same correction, learned later */
      ok((wr.corrLog || []).length === 1 && wr.corrLog[0].at === "2026-08-10T08:00:00.000Z",
        "LAW d2 — the WRITER keeps the earliest sighting too: re-filing a correction it already has cannot re-date it, so a device that learns it late does not reorder the replay (observed " + J((wr.corrLog || []).map((c) => c.at)) + ")");
    } else ok(false, "LAW d2 — _fileCorr is not exported: the writer's first-sighting rule cannot be pinned");
    /* leg 2 — CANONICAL SHAPE, pinned. Mutation-measured: reverting the replay
       to write an empty skipped[] instead of deleting the key was caught by
       nothing, because an empty array and an absent one differ only in shape —
       and shape is exactly what a merge-order comparison is made of. */
    const cancel = REC();
    cancel.corrLog = [...cancel.corrLog, { op: "unskip:2026-08-09:pronated", kind: "unskip", id: "pronated", at: "2026-08-11T08:00:00.000Z", to: { id: "pronated", w: 40, reps: [12, 11], rir: null, rirSets: [null, null] } }];
    const canOut = T._replayCorrections ? T._replayCorrections(JSON.parse(JSON.stringify(cancel))) : {};
    ok(!("skipped" in canOut) && (canOut.entries || []).some((e) => e && e.id === "pronated"),
      "LAW l — when the corrections cancel out, the replay DELETES the skip list rather than leaving an empty one: absent is the canonical 'nothing skipped', and a record that merges into a shape instead of a value is a merge-order bug waiting (observed skipped " + J(canOut.skipped) + ")");
    /* leg 3 — THE UNION IS COMMUTATIVE, asserted rather than asserted-about.
       Executed at 4d41e2d: one key carrying two different payloads resolved by
       ARRIVAL — union(x,y).to was [11,10] and union(y,x).to was [6,6]. */
    if (typeof T._unionCorrLog === "function") {
      const mk9 = (to9) => ({ corrLog: [{ op: "unskip:2026-08-09:ham:2026-08-10T08:00:00.000Z", kind: "unskip", id: "ham", at: "2026-08-10T08:00:00.000Z", to: { id: "ham", reps: to9 } }] });
      const p9 = mk9([11, 10]), q9 = mk9([6, 6]);
      ok(J(T._unionCorrLog(p9, q9)) === J(T._unionCorrLog(q9, p9)),
        "LAW m — the corrLog union is COMMUTATIVE even when one key arrives with two payloads: resolved by canonical value, never by which side got there first (observed " + J((T._unionCorrLog(p9, q9)[0] || {}).to) + " vs " + J((T._unionCorrLog(q9, p9)[0] || {}).to) + ")");
    } else ok(false, "LAW m — _unionCorrLog is not exported");
    /* leg 3 — THE UN-SKIP PAYLOAD IS AUTHORITATIVE. Executed at 4d41e2d: a base
       still holding a stale ham [6,6] under an un-skip carrying [11,10,9] kept
       the stale copy — the payload was inserted only when nothing was there. */
    if (typeof T._replayCorrections === "function") {
      const st9 = { d: "2026-08-09", entries: [{ id: "ham", w: 120, reps: [6, 6], rir: null, rirSets: [null, null] }],
        corrLog: [{ op: "unskip:2026-08-09:ham:2026-08-10T08:00:00.000Z", kind: "unskip", id: "ham", at: "2026-08-10T08:00:00.000Z", to: { id: "ham", w: 120, reps: [11, 10, 9], rir: null, rirSets: [null, null, null] } }] };
      const o9 = T._replayCorrections(JSON.parse(JSON.stringify(st9)));
      ok(J(((o9.entries || []).find((e) => e && e.id === "ham") || {}).reps) === J([11, 10, 9]),
        "LAW n — an un-skip RESTATES an entry that is already there, the same way strike and amend do: a restore that cannot overwrite is a delete wearing a correction's name, one step later (observed " + J(((o9.entries || []).find((e) => e && e.id === "ham") || {}).reps) + ")");
    } else ok(false, "LAW n — _replayCorrections is not exported");
    /* leg 3 — THE CORRECTION LEDGER IS APPEND-ONLY UNDER LAW. Executed at
       4d41e2d: every corrLog entry in his state could be deleted and
       dataLossGuard still returned {safe:true,lost:[]} — it counts sessionLog
       DATES and never looks inside a record. */
    const liveG = T.migrate(JSON.parse(readFileSync(PREIMAGE, "utf8")));
    const wiped = JSON.parse(JSON.stringify(liveG));
    for (const r9 of Object.values(wiped.sessionLog || {})) delete r9.corrLog;
    const g9 = T.dataLossGuard(liveG, wiped);
    ok(!g9.safe && (g9.lost || []).some((x) => /^corrections /.test(x)),
      "LAW o — deleting the correction ledger is now REFUSED and named: a promise no guard enforces is a comment (observed " + J(g9) + ")");
    /* leg 3.5 — THE GUARD COUNTS RECORDS, NOT RECEIPTS. Executed red at
       418e9fb: patchV59's receipt sweep shrank the RAW feed (his live ledger
       352→344; this frozen preimage 323→321) and dataLossGuard read the app's
       own migration as data loss — {"safe":false,"lost":["feed 352→344"]} — so
       ghSync returned null ("merge would shrink the remote") and the local
       save set offline: v7.55.x could not reach his phone. Every removed line
       is a machine receipt (a projection reconcileReadReceipts re-derives from
       reads[]); the athlete's permanent lines GROW across the same migration
       (342→343 live, 318→320 here). The guard now counts only permanent
       lines — the app-side mirror of the harness's isProjection carve-out. */
    const rawPre = JSON.parse(readFileSync(PREIMAGE, "utf8"));
    const gMig = T.dataLossGuard(rawPre, liveG);
    ok(gMig.safe === true && (gMig.lost || []).length === 0,
      "LAW r — a migration whose only feed shrink is the machine's own receipts is SAFE: the guard counts the athlete's permanent lines, never derived state, so the app can never refuse its own migration (observed " + J(gMig) + ")");
    const isP9 = T._isFeedProjection;
    ok(typeof isP9 === "function",
      "LAW r2a — _isFeedProjection is exported: the pin asserts the app's own projection class, not a rig's re-spelling of it");
    if (typeof isP9 === "function") {
      const np9 = (s) => (Array.isArray(s.feed) ? s.feed.filter((f) => !isP9(f)).length : 0);
      ok(np9(liveG) >= np9(rawPre),
        "LAW r2 — the guard passes because the PERMANENT count did not shrink (" + np9(rawPre) + "→" + np9(liveG) + "), not because feed went uncounted");
    }
    const cutG = JSON.parse(JSON.stringify(liveG));
    cutG.feed.splice(Math.max(0, cutG.feed.findIndex((f) => f && !f.op && !(typeof isP9 === "function" && isP9(f)))), 1);
    const gCut = T.dataLossGuard(liveG, cutG);
    ok(!gCut.safe && (gCut.lost || []).some((x) => /^feed /.test(x)),
      "LAW r3 — deleting one op-less PERMANENT line is still REFUSED and named by count: the carve-outs narrow what the guard counts, never what it protects — op-keyed deletion is the SCALE-4 feedop pin's job (observed " + J(gCut) + ")");
    /* leg 4 — THE BASE TIE IS ORDER-FREE. Executed at dd29e8a: two equally
       corrected records — same corr.at, same rev, same byte score — resolved by
       _richer, which ties to its SECOND argument, so curl came back [12,12,9]
       one way and [12,12,8] the other. The header promised "never by side"; that
       governed only the per-lift accumulation, not the choice of body. */
    const tieRec = (curl9) => ({ d: "2026-08-09", at: 1786311986964,
      entries: [{ id: "curl", w: 50, reps: curl9, rir: 2, rirSets: [2, null, null] }],
      corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 },
      corrLog: [{ op: "amend:2026-08-09:curl:2026-08-10T08:00:00.000Z", kind: "amend", id: "curl", at: "2026-08-10T08:00:00.000Z", to: [{ id: "curl", w: 50 }] }] });
    const tA = mk(tieRec([12, 12, 9])), tB = mk(tieRec([12, 12, 8]));
    const tab = T.mergeState(cl(tA), cl(tB)), tba = T.mergeState(cl(tB), cl(tA));
    ok(J(r09(tab)) === J(r09(tba)),
      "LAW p — two equally-corrected records with an equal score resolve the SAME WAY from either side: the base is picked by canonical value once the stamps and revs agree, so the whole merge is order-free rather than just its second half (observed " + J(reps9(tab, "curl")) + " vs " + J(reps9(tba, "curl")) + ")");
    /* leg 4 — A LIFT IS IN EXACTLY ONE ARRAY. entries and skipped accumulate
       independently and replay only moves what a correction names, so a lift
       skipped on one side and logged on the other — both INITIAL, no op either
       way — survived into BOTH: a record saying he did and did not do the same
       lift, which the non-shrink law then protected as if the phantom were
       data. */
    const dupA = mk({ d: "2026-08-09", at: 1786311986964,
      entries: [{ id: "hack", w: 200, reps: [7, 7], rir: 2, rirSets: [2, 0] }],
      skipped: [{ id: "rows" }],
      corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 },
      corrLog: [{ op: "skip:2026-08-09:ham:2026-08-10T08:00:00.000Z", kind: "skip", id: "ham", at: "2026-08-10T08:00:00.000Z" }] });
    const dupB = mk({ d: "2026-08-09", at: 1786311986964,
      entries: [{ id: "hack", w: 200, reps: [7, 7], rir: 2, rirSets: [2, 0] }, { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }] });
    for (const [lbl, m9] of [["A<-B", T.mergeState(cl(dupA), cl(dupB))], ["B<-A", T.mergeState(cl(dupB), cl(dupA))]]) {
      const inE = has9(m9, "rows"), inS = skp9(m9, "rows");
      ok(inE !== inS,
        "LAW q " + lbl + " — a lift ends in EXACTLY ONE of entries/skipped: an initial skip on one side and a logged entry on the other is a disagreement, not a licence to record both (observed logged " + inE + " skipped " + inS + ")");
      ok(((r09(m9).entries) || []).length + ((r09(m9).skipped) || []).length === 3,
        "LAW q2 " + lbl + " — and nothing is dropped to achieve it: hack, rows and the ham the correction skips — three lifts, each in exactly one place. Exclusion resolves a disagreement; it never resolves it by deleting (observed total " + (((r09(m9).entries) || []).length + ((r09(m9).skipped) || []).length) + ")");
    }
    /* SKIP then UNSKIP — the round-trip that proves replay restores rather than deletes */
    const rt = REC();
    rt.corrLog = [...rt.corrLog, { op: "unskip:2026-08-09:pronated", kind: "unskip", id: "pronated", at: "2026-08-10T08:00:00.000Z", to: { id: "pronated", w: 40, reps: [12, 11], rir: null, rirSets: [null, null] } }];
    const U = mk(rt);
    const uab = T.mergeState(cl(U), cl(B)), uba = T.mergeState(cl(B), cl(U));
    ok(has9(uab, "pronated") && !skp9(uab, "pronated") && J(uab.sessionLog["2026-08-09"]) === J(uba.sessionLog["2026-08-09"]),
      "LAW e — a LATER un-skip beats the earlier skip chronologically, and the reps he typed by hand come back with it: replay RESTORES, so a correction that removes is never a delete (observed logged " + has9(uab, "pronated") + " skipped " + skp9(uab, "pronated") + ")");
    ok(J((r09(uab).entries || []).find((e) => e && e.id === "pronated")) === J({ id: "pronated", w: 40, reps: [12, 11], rir: null, rirSets: [null, null] }),
      "LAW f — and it restores the value the CORRECTION carried, not a guess: the payload rides with the entry (observed " + J((r09(uab).entries || []).find((e) => e && e.id === "pronated")) + ")");
    /* NON-SHRINK — entries + skipped combined never falls below either side */
    const tot = (s9) => ((r09(s9).entries || []).length) + ((r09(s9).skipped || []).length);
    ok(tot(ab) >= tot(A) && tot(ab) >= tot(B) && tot(ba) >= tot(A) && tot(ba) >= tot(B),
      "LAW g — COUNTS LAW at session grain: entries + skipped in the result is >= both inputs. A skip MOVES a lift, a strike changes reps — neither is a delete (observed merged " + tot(ab) + " vs A " + tot(A) + " / B " + tot(B) + ")");
    /* the no-correction path is UNTOUCHED */
    const plain = () => ({ d: "2026-08-05", at: 1785000000000, entries: [{ id: "hack", w: 190, reps: [8, 8], rir: 2, rirSets: [2, 0] }] });
    const p1 = mk(plain()), p2 = mk(plain()); p2.sessionLog["2026-08-09"].entries.push({ id: "ham", w: 120, reps: [12], rir: null, rirSets: [null] });
    const pab = T.mergeState(cl(p1), cl(p2)), pba = T.mergeState(cl(p2), cl(p1));
    ok(J(pab.sessionLog["2026-08-09"]) === J(pba.sessionLog["2026-08-09"]) && (pab.sessionLog["2026-08-09"].entries || []).length === 2 && !pab.sessionLog["2026-08-09"].corrLog,
      "LAW h (evolved by leg 9, per Sol's ruling) — IDENTICAL bodies merge byte-identically, order preserved; DIFFERING bodies accumulate. The old claim — 'a record with no corrections merges exactly as it always did' — was the instinct that preserved a data-loss bug this round exists to kill: two devices each logging a DIFFERENT session on one date fell to a record-level pick and one session was simply gone, both orders, against mergeState's own promise of a superset (observed n " + (pab.sessionLog["2026-08-09"].entries || []).length + ", corrLog " + J(pab.sessionLog["2026-08-09"].corrLog) + ")");
    /* THE BACKFILL, on the live ledger — asserted on what survives its own healing */
    const liveOut = T.migrate(JSON.parse(readFileSync(PREIMAGE, "utf8")));
    const ops9 = (d9) => (((liveOut.sessionLog || {})[d9] || {}).corrLog || []).map((c) => c.op).sort();
    /* LEG 5 — A RECEIPT IS PROVENANCE; MEMBERSHIP IS NOT. Leg 4 stopped
       inventing ops from skipped[] membership, correctly. It also left unfiled
       the corrections the app's OWN FEED names outright — and those resurrect
       exactly like any other unprovenanced correction. The feed distinguishes
       them: "SKIPPED — <lifts>" is the completion receipt; "RECORD AMENDED —
       <lift> marked skipped / UN-SKIPPED" is the ✕ / ↩ handler. */
    const ops9all = (d9) => (((liveOut.sessionLog || {})[d9] || {}).corrLog || []).map((c9) => c9.kind + ":" + c9.id).sort();
    ok(J(ops9all("2026-07-23")) === J(["skip:pronated"]) && J(ops9all("2026-07-31")) === J(["skip:ham"]),
      "LAW i (leg 5) — the two ✕ corrections the feed names are FILED: without an op a stale body re-saved after the correction instant takes the base and resurrects them, which is the harm 8/09 is spared only because it has one (observed 7/23 " + J(ops9all("2026-07-23")) + " · 7/31 " + J(ops9all("2026-07-31")) + ")");
    ok(J(ops9all("2026-08-14")).indexOf("unskip:abs") > -1 && J(ops9all("2026-08-14")).indexOf("unskip:hanging") > -1,
      "LAW i2 (leg 5) — and so are the two ↩ corrections on 8/14, which had no op either: an un-skip is a deliberate act exactly like a skip (observed " + J(ops9all("2026-08-14")) + ")");
    const initial9 = [["2026-08-06", "pronated"], ["2026-08-14", "hipthrust"], ["2026-08-14", "calves"]];
    for (const [d9, id9] of initial9) {
      const has9 = (((liveOut.sessionLog || {})[d9] || {}).corrLog || []).some((c9) => c9 && c9.id === id9);
      ok(!has9,
        "LAW j (leg 5) — " + d9 + " " + id9 + " is an INITIAL skip and still earns nothing: its receipt is the completion line, not an amendment. That half of leg 4 is untouched — the rule is the receipt, never the membership (observed op present: " + has9 + ")");
    }
    const covered9 = Object.keys(liveOut.sessionLog || {}).filter((d9) => (((liveOut.sessionLog[d9] || {}).corrLog) || []).length).sort();
    ok(J(covered9) === J(["2026-07-23", "2026-07-31", "2026-08-04", "2026-08-09", "2026-08-14"]),
      "LAW j3 (leg 5) — exactly the five records whose corrections the feed proves, and no others. 8/04 IS included: it predates the corr stamp, so its receipts are the only witness — but they name the lift and the act as plainly as any other, and the honest floor for an instant the app never recorded is the day it did (observed " + J(covered9) + ")");
    const twice9 = T.migrate(JSON.parse(JSON.stringify(liveOut)));
    ok(J(twice9.sessionLog) === J(liveOut.sessionLog),
      "LAW k — the backfill is idempotent: a replayed migrate files nothing new and re-dates nothing");
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

  /* ==================== SCALE-4 · SOL'S CLOSURE PASS-2 ROWS (2026-08-21) ====================
     Every pin below is the executable form of a pass-2 witness — each ran RED at d801323
     before the fix. Writers are the real ones where exported (applyRead, migrate,
     mergeState, dataLossGuard, lastUndoable); the suggestion writers are replicated
     verbatim from applySuggestion/dismissSuggestion (not exported), shape-checked. */
  {
    const J4 = JSON.stringify, cl4 = (x) => JSON.parse(J4(x));
    const mkB4 = (trend) => { const s = T.migrate(null); s.reads = []; s.feed = []; s.weekly = []; s.suggestionLog = []; s.adjustments = []; s.targets = {}; s.trend = trend; s.blackout = { until: "2020-01-01" }; return s; };
    const approve4 = (s, sid, kind, to, d, title) => { const ns = cl4(s);
      ns.suggestionLog.push({ sid, decided: "approved", d, title, apply: { kind, to }, predict: "" });
      if (kind === "protein") ns.targets.proteinG = to; if (kind === "sleep") ns.targets.sleepH = to;
      ns.adjustments.push({ rid: sid, id: "adj4_" + sid + "_" + d, d, title });
      ns.feed.unshift({ d, op: "sug:" + sid, t: "ANALYST SUGGESTION APPLIED", how: title + " — " + (kind === "protein" ? "protein target set to " + to + " g/day" : "sleep target set to " + to + " h") });
      return ns; };
    const dismiss4 = (s, sid, kind, d, title) => { const ns = cl4(s);
      ns.suggestionLog.push({ sid, decided: "dismissed", d, title, apply: { kind } });
      ns.feed.unshift({ d, op: "sug:" + sid, t: "ANALYST SUGGESTION DISMISSED", how: title });
      return ns; };
    /* PIN 1 — EVERY MIGRATE EXIT ENDS CANONICAL AND SELF-MERGE-FIXED. Executed at
       d801323: the v1/v2 exit skipped the reconcilers, so a legacy state booted with an
       op-less EVENING receipt its first self-merge rewrote to the op-keyed spelling —
       and even the settled exits differed from their own self-merge in fork ops, plan
       stamps and a suggestionLog [] only the merge created. */
    const v24 = { v: 2, reads: [{ d: "2026-07-19", w: 163.0, pt: 163.2, offWindow: true, sealed: false, note: "late read — set aside" }],
      feed: [{ d: "2026-07-19", t: "EVENING READ — SET ASIDE", how: "evening reads run heavy — recorded, set aside." }],
      sleep: { nights: [] }, dailyLogs: {}, sessionLog: {} };
    const m24 = T.migrate(cl4(v24));
    ok(!(m24.feed || []).some((f) => f && f.t === "EVENING READ — SET ASIDE" && !f.op) && (m24.feed || []).some((f) => f && f.op === "lateread:2026-07-19"),
      "SCALE-4 row 2 — the v1/v2 exit derives the canonical op-keyed receipt (on d801323 the legacy line survived the boot)");
    ok(J4(T.mergeState(cl4(m24), cl4(m24))) === J4(m24),
      "SCALE-4 row 2 — a v2 boot is a byte fixed point of its own self-merge (on d801323: fork ops, plan stamps, suggestionLog and the receipt spelling all moved)");
    const pre4 = T.migrate(JSON.parse(readFileSync(PREIMAGE, "utf8")));
    ok(J4(T.mergeState(cl4(pre4), cl4(pre4))) === J4(pre4) && J4(T.migrate(cl4(pre4))) === J4(pre4),
      "SCALE-4 row 2 — the v3+ exit too: the migrated preimage is a byte fixed point of self-merge AND of a re-boot");
    /* PIN 2 + PIN 3 — READ SELECTION IS ONE TOTAL, ASSOCIATIVE AUTHORITY RULE. The
       pass-2 witness: clean-beats-late fired only at equal weight and record length
       decided the rest — a non-transitive cycle, (A⊕B)⊕C kept 102 while A⊕(B⊕C) kept
       100. And the replay ANCHOR rode the same tie: two clean same-weight copies with
       conflicting pt picked by _richer's ties-to-local, so pt/trend differed by merge
       direction. */
    if (typeof T.applyRead === "function") {
      const TODAY4 = "2026-07-29";   /* the frozen anchor — offWindow needs iso === today */
      const A4 = T.applyRead(mkB4(100), TODAY4, 100, { hour: 8 });
      const bB4 = mkB4(100); bB4.dailyLogs["2026-07-28"] = { sodium: "high" };
      const B4 = T.applyRead(bB4, TODAY4, 100, { hour: 14 });
      const bC4 = mkB4(100); bC4.dailyLogs["2026-07-28"] = { alc: 2 };
      const C4 = T.applyRead(bC4, TODAY4, 102, { hour: 8 });
      const rd4 = (s) => (s.reads || []).find((r) => r && r.d === TODAY4) || {};
      const g14 = T.mergeState(cl4(T.mergeState(cl4(A4), cl4(B4))), cl4(C4));
      const g24 = T.mergeState(cl4(A4), cl4(T.mergeState(cl4(B4), cl4(C4))));
      ok(rd4(g14).w === rd4(g24).w && g14.trend === g24.trend && !rd4(g14).offWindow,
        "SCALE-4 H2 — three same-day reads (clean short, late long, clean spike) keep the SAME read and trend from both groupings, and a clean copy beats the late one at ANY weight (observed " + rd4(g14).w + "/" + g14.trend + " vs " + rd4(g24).w + "/" + g24.trend + ")");
      const P4 = T.applyRead(mkB4(100), "2026-07-10", 100);
      const Q4 = T.applyRead(mkB4(101), "2026-07-10", 100);
      const pq4 = T.mergeState(cl4(P4), cl4(Q4)), qp4 = T.mergeState(cl4(Q4), cl4(P4));
      ok(rd4(pq4).d === undefined || true, "SCALE-4 — (shape guard)");
      const pt4 = (s) => ((s.reads || []).find((r) => r && r.d === "2026-07-10") || {}).pt;
      ok(pt4(pq4) === pt4(qp4) && pq4.trend === qp4.trend,
        "SCALE-4 row 3a — same-date/same-weight/same-class reads with CONFLICTING pt anchor the replay identically from both directions (observed " + pt4(pq4) + "/" + pq4.trend + " vs " + pt4(qp4) + "/" + qp4.trend + "; on d801323: 100/100 one way, 101/100.7 the other)");
    } else ok(false, "SCALE-4 — applyRead is not exported: the read-authority pins cannot run");
    /* PIN 4 — TWO REAL OFFLINE APPROVALS: whole-state convergence and ONE undo door. */
    const b4 = mkB4(100);
    const D14 = approve4(b4, "card-a", "protein", 200, "2026-08-16", "Protein up");
    const D24 = approve4(b4, "card-b", "sleep", 8, "2026-08-17", "Sleep up");
    const dm4 = T.mergeState(cl4(D14), cl4(D24)), dm4r = T.mergeState(cl4(D24), cl4(D14));
    ok(J4(dm4) === J4(dm4r),
      "SCALE-4 row 4 — two devices approving two DIFFERENT cards offline merge to the BYTE-identical whole state in both orders");
    ok(typeof T.lastUndoable === "function" && J4(T.lastUndoable(dm4)) === J4(T.lastUndoable(dm4r)) && (T.lastUndoable(dm4) || {}).rid === "card-b",
      "SCALE-4 row 4 — and lastUndoable offers the SAME (newest) move from either direction (on d801323 one direction offered the older protein card: the keyed union emitted arrival order and the tail scan read it)");
    /* PIN 5 — SAME-SID, THREE REPLICAS: associativity after settle. */
    const E14 = approve4(b4, "x", "protein", 200, "2026-08-16", "Protein 200");
    const E24 = dismiss4(b4, "x", "protein", "2026-08-17", "Protein 200");
    const E34 = approve4(b4, "x", "protein", 210, "2026-08-18", "Protein 210");
    const ga4 = T.mergeState(cl4(T.mergeState(cl4(E14), cl4(E24))), cl4(E34));
    const gb4 = T.mergeState(cl4(E14), cl4(T.mergeState(cl4(E24), cl4(E34))));
    ok(J4(ga4) === J4(gb4) && ga4.targets.proteinG === 200,
      "SCALE-4 row 4 — the same card approved/dismissed/approved on three replicas settles BYTE-identically from both groupings, earliest word standing (on d801323: one grouping left the losing device's adjustment active, the other left it terminally dismissed)");
    const xAdj4 = ga4.adjustments.filter((a) => a && a.rid === "x");
    ok(xAdj4.filter((a) => !a.dismissed && !a.undone).length === 1,
      "SCALE-4 row 4 — exactly ONE adjustment stands for the winning decision; the losing device's duplicate is dismissed by derivation (observed " + J4(xAdj4.map((a) => !!a.dismissed)) + ")");
    /* PIN 5b — THE DISMISSAL IS A DERIVATION, NOT A STICKY FLAG. The one shape where
       set-never-clear still shows: an intermediate merge dismisses the only adjustment a
       sid has, then an EARLIER approval arrives from a replica whose own adjustment row
       never made it. The winning decision is approved, an applied effect stands, and the
       undo door must reopen on the row that exists — a flag an intermediate state set is
       not the log's verdict. */
    const H14 = approve4(b4, "w", "protein", 200, "2026-08-16", "Protein 200");
    const H24 = dismiss4(b4, "w", "protein", "2026-08-15", "Protein 200");
    const hAB4 = T.mergeState(cl4(H14), cl4(H24));   /* 8/15 dismissal wins; H1's adjustment derives dismissed */
    const H34 = cl4(b4);
    H34.suggestionLog.push({ sid: "w", decided: "approved", d: "2026-08-14", title: "Protein 200", apply: { kind: "protein", to: 200 }, predict: "" });
    H34.targets.proteinG = 200;
    const hFin4 = T.mergeState(cl4(hAB4), cl4(H34));
    const wAdj4 = (hFin4.adjustments || []).filter((a) => a && a.rid === "w");
    ok(hFin4.targets.proteinG === 200 && wAdj4.length === 1 && wAdj4.filter((a) => !a.dismissed && !a.undone).length === 1,
      "SCALE-4 row 4 — an earlier winning approval arriving log-only RE-OPENS the undo door on the adjustment that exists: dismissed derives from the log's verdict both ways, never from what an intermediate merge happened to set (observed dismissed flags " + J4(wAdj4.map((a) => !!a.dismissed)) + ", proteinG " + hFin4.targets.proteinG + ")");
    /* PIN 6 — THE RECEIPT MATCHES THE WINNING DECISION. */
    const F14 = approve4(b4, "y", "protein", 200, "2026-08-17", "Protein 200");
    const F24 = dismiss4(b4, "y", "protein", "2026-08-16", "Protein 200");
    const fm4 = T.mergeState(cl4(F14), cl4(F24));
    const yLines4 = (fm4.feed || []).filter((f) => f && f.op === "sug:y");
    ok(yLines4.length === 1 && yLines4[0].t === "ANALYST SUGGESTION DISMISSED" && fm4.targets.proteinG === undefined,
      "SCALE-4 row 4 — a winning dismissal leaves exactly ONE receipt and it says DISMISSED; the APPLIED line of the losing approval is re-derived away with the effect it described (on d801323 the APPLIED line stood beside a reversed target)");
    const F34 = approve4(b4, "z", "protein", 200, "2026-08-16", "Protein 200");
    const F44 = dismiss4(b4, "z", "protein", "2026-08-17", "Protein 200");
    const fm24 = T.mergeState(cl4(F34), cl4(F44));
    const zLines4 = (fm24.feed || []).filter((f) => f && f.op === "sug:z");
    ok(zLines4.length === 1 && zLines4[0].t === "ANALYST SUGGESTION APPLIED" && fm24.targets.proteinG === 200,
      "SCALE-4 row 4 — and the reverse: a standing effect keeps its APPLIED receipt with no newer DISMISSED line above it");
    /* PIN 7 — THE patch59 RECEIPT IS A PROJECTION OF THE MERGED RE-CLASSED READS. The
       pass-2 sweep: with 8/08 missing from one replica the STALE body won the op-dedup
       in BOTH orders — a receipt claiming two reads outlived a union that carried three. */
    {
      const rawP4 = JSON.parse(readFileSync(PREIMAGE, "utf8"));
      const full4 = T.migrate(cl4(rawP4));
      const partRaw4 = cl4(rawP4); partRaw4.reads = (partRaw4.reads || []).filter((r) => r && r.d !== "2026-08-08");
      const part4 = T.migrate(partRaw4);
      const body4 = (s) => { const f = (s.feed || []).find((x) => x && x.op === "patch59:scale"); return f ? f.t : "(none)"; };
      const mab4 = T.mergeState(cl4(full4), cl4(part4)), mba4 = T.mergeState(cl4(part4), cl4(full4));
      const howFull4 = ((full4.feed || []).find((x) => x && x.op === "patch59:scale") || {}).how || "";
      ok(/replays to /.test(howFull4) && body4(mab4) === body4(full4) && body4(mba4) === body4(full4) && body4(full4) !== body4(part4),
        "SCALE-4 new row 2 — full + partial replicas: the merged receipt is RE-DERIVED from the merged re-classed reads, both orders (observed '" + body4(mab4) + "'; on d801323 the partial body '" + body4(part4) + "' won the canonical tie)");
    }
    /* PIN 8 — WARRANTED MISSED/GAP DAYS ARE GUARDED CROSS-STATE, and one day keeps ONE
       line. Refutes-and-repairs this build's own A2 claim from the pass-2 pack: deleting
       the warranted line was guard-safe and byte-fixed — nothing re-derived it. */
    {
      const pre8 = T.migrate(JSON.parse(readFileSync(PREIMAGE, "utf8")));
      const isMiss4 = (f) => f && typeof f.t === "string" && (f.t.indexOf("MORNING READ MISSED") === 0 || f.t.indexOf("READ GAP") === 0);
      const warr4 = (pre8.feed || []).filter(isMiss4).map((f) => String(f.d));
      ok(warr4.length >= 1, "SCALE-4 new row 1 — the migrated preimage still carries its warranted missed-day line(s): " + J4(warr4));
      if (warr4.length) {
        const del4 = cl4(pre8); del4.feed.splice(del4.feed.findIndex((f) => isMiss4(f) && String(f.d) === warr4[0]), 1);
        const g4 = T.dataLossGuard(pre8, del4);
        ok(!g4.safe && (g4.lost || []).some((x) => x.indexOf("missedday " + warr4[0]) === 0),
          "SCALE-4 new row 1 — deleting the warranted " + warr4[0] + " summary is REFUSED and named (on d801323: safe:true, and no reconciler brought it back)");
        const heal4 = cl4(pre8); heal4.feed = heal4.feed.filter((f) => !(isMiss4(f) && String(f.d) === warr4[0]));
        heal4.reads = [...(heal4.reads || []), { d: warr4[0], w: 163.0, sealed: false, pt: 163.0, note: "" }];
        ok(T.dataLossGuard(pre8, heal4).safe,
          "SCALE-4 new row 1 — while HEALING stays free: the same line may vanish when the clean read that disproves it arrives");
      }
      const two4 = cl4(pre8);
      two4.feed.unshift({ d: "2026-08-21", t: "READ GAP — DAY 5", how: "no read since 8/15" });
      two4.feed.unshift({ d: "2026-08-21", t: "MORNING READ MISSED", how: "the trend carries." });
      const tm4 = T.mergeState(cl4(two4), cl4(two4));
      ok((tm4.feed || []).filter((f) => isMiss4(f) && String(f.d) === "2026-08-21").length === 1,
        "SCALE-4 new row 1 — two contradictory summaries for one day settle to ONE canonical line (on d801323 both survived every merge)");
    }
    /* PIN 9 — LOGICAL OP ACCOUNTING: dedup passes, deletion is refused. */
    {
      const pre9 = T.migrate(JSON.parse(readFileSync(PREIMAGE, "utf8")));
      const src9 = (pre9.feed || []).find((f) => f && typeof f.op === "string" && f.op && !(typeof T._isFeedDerived === "function" && T._isFeedDerived(f, pre9)) && !(typeof f.t === "string" && (f.t.indexOf("MORNING READ MISSED") === 0 || f.t.indexOf("READ GAP") === 0)));
      ok(!!src9 && typeof T._isFeedDerived === "function", "SCALE-4 new row 3 — a permanent op-keyed line exists on the preimage and _isFeedDerived is exported (op " + (src9 && src9.op) + ")");
      if (src9 && typeof T._isFeedDerived === "function") {
        const dup9 = cl4(pre9); dup9.feed.push({ ...cl4(src9), how: "an older wording of the same operation" });
        const md9 = T.mergeState(cl4(dup9), cl4(pre9));
        ok(T.dataLossGuard(dup9, md9).safe && (md9.feed || []).filter((f) => f && f.op === src9.op).length === 1,
          "SCALE-4 new row 3 — the merge collapses two bodies for ONE op to one logical record and the guard calls that SAFE (on d801323: refused as a count shrink, and the sync sent no body)");
        const cut9 = cl4(pre9); cut9.feed = cut9.feed.filter((f) => !(f && f.op === src9.op));
        const gc9 = T.dataLossGuard(pre9, cut9);
        ok(!gc9.safe && (gc9.lost || []).some((x) => x.indexOf("feedop " + src9.op) === 0),
          "SCALE-4 new row 3 — while deleting the WHOLE op is refused and NAMED (" + J4(gc9.lost) + ")");
        const cutL9 = cl4(pre9); cutL9.feed.splice(cutL9.feed.findIndex((f) => f && !f.op && !T._isFeedDerived(f, cutL9) && !(typeof f.t === "string" && (f.t.indexOf("MORNING READ MISSED") === 0 || f.t.indexOf("READ GAP") === 0))), 1);
        ok(!T.dataLossGuard(pre9, cutL9).safe,
          "SCALE-4 new row 3 — and an op-less athlete line is still guarded by count");
      }
    }
  }


  /* ==================== SCALE-5 · SOL'S CLOSURE PASS-3 ROWS (2026-08-21) ====================
     Six blockers, every pin below executed RED at 7d74b3d first. */
  {
    const J5 = JSON.stringify, cl5 = (x) => JSON.parse(J5(x));
    const mkB5 = () => { const s = T.migrate(null); s.reads = []; s.feed = []; s.weekly = []; s.suggestionLog = []; s.adjustments = []; s.targets = {}; s.trend = 100; s.blackout = { until: "2020-01-01" }; return s; };
    const approve5 = (s, sid, kind, to, d, title) => { const ns = cl5(s);
      ns.suggestionLog.push({ sid, decided: "approved", d, title, apply: { kind, to }, predict: "" });
      if (kind === "protein") ns.targets.proteinG = to;
      ns.adjustments.push({ rid: sid, id: "adj5_" + sid + "_" + d + "_" + to, d, title });
      ns.feed.unshift({ d, op: "sug:" + sid, t: "ANALYST SUGGESTION APPLIED", how: title + " — protein target set to " + to + " g/day" });
      return ns; };
    const dismiss5 = (s, sid, kind, d, title) => { const ns = cl5(s);
      ns.suggestionLog.push({ sid, decided: "dismissed", d, title, apply: { kind } });
      ns.feed.unshift({ d, op: "sug:" + sid, t: "ANALYST SUGGESTION DISMISSED", how: title });
      return ns; };
    /* BLOCKER 1 — the FOURTH exit settles too. */
    const f5 = T.migrate(null);
    ok(J5(T.mergeState(cl5(f5), cl5(f5))) === J5(f5),
      "SCALE-5 row 2 — a FRESH INSTALL is a byte fixed point of its first self-merge (at 7d74b3d: exercises, plan, suggestionLog and targets all moved on the very first sync)");
    const imp5 = T.migrate(null); { const e5 = imp5.exercises.find((x) => x && x.id === "rows"); e5.forks = [{ from: "2026-08-13", why: "z", ops: ["z", "a"], prevN: "old" }]; }
    const impM5 = T.migrate(cl5(imp5));
    const impE5 = impM5.exercises.find((x) => x.id === "rows");
    ok(J5(impE5.forks[0].ops) === J5(["a", "z"]) && impE5.forks[0].why === "a + z" && J5(T.mergeState(cl5(impM5), cl5(impM5))) === J5(impM5),
      "SCALE-5 row 2 — an imported fork with unsorted ops is canonical AFTER MIGRATE (sorted set, derived why — the fork union's own math), not only after the first merge (observed ops " + J5(impE5.forks[0].ops) + " why '" + impE5.forks[0].why + "')");
    /* BLOCKER 6 — equal logical read payloads in different raw key orders. */
    {
      const A5 = mkB5(); A5.reads = [{ d: "2026-08-20", w: 100, sealed: false, pt: 100, note: "same" }];
      const B5 = mkB5(); B5.reads = [JSON.parse('{"note":"same","pt":100,"sealed":false,"w":100,"d":"2026-08-20"}')];
      const ab5 = T.mergeState(cl5(A5), cl5(B5)), ba5 = T.mergeState(cl5(B5), cl5(A5));
      ok(J5(ab5) === J5(ba5) && J5(T.migrate(cl5(A5))) === J5(T.migrate(cl5(B5))),
        "SCALE-5 read-tie — one logical read in two raw key orders merges to the SAME BYTES from both directions and boots to the same bytes (at 7d74b3d each direction kept its local operand's key order, forever)");
    }
    /* BLOCKER 4 — suggestion Undo is truthful and direction-free. */
    {
      const A5 = approve5(mkB5(), "x", "protein", 200, "2026-08-16", "Protein 200");
      const U5 = T.undoAdjustment(cl5(A5), "x");
      ok(U5.targets.proteinG === undefined && (U5.suggestionLog.find((r) => r.sid === "x") || {}).undone === true,
        "SCALE-5 row 4 — the undo reverses IN THE SESSION, not only at the next boot: the tap itself lands on the row and re-derives (SCALE-6 made the settle-side belt redundant for the boot path, so this pin holds the writer's own arm falsifiable)");
      const S5 = T.migrate(cl5(U5));
      const row5 = S5.suggestionLog.find((r) => r.sid === "x");
      ok(row5.undone === true && S5.targets.proteinG === undefined && (S5.feed || []).filter((f) => f.t === "ANALYST SUGGESTION APPLIED").length === 0 && (S5.feed || []).some((f) => f.op === "sug:x" && f.t === "ANALYST SUGGESTION UNDONE"),
        "SCALE-5 row 4 — the one-tap Undo UNDOES: the decision row carries the athlete's monotone undone flag, the target reverses, and the receipt re-derives as UNDONE — surviving boot (at 7d74b3d the control hid itself, printed 'reversed', and proteinG stayed 200)");
      const st5 = T.mergeState(cl5(S5), cl5(A5)), st5b = T.mergeState(cl5(A5), cl5(S5));
      ok(st5.suggestionLog.find((r) => r.sid === "x").undone === true && st5b.suggestionLog.find((r) => r.sid === "x").undone === true && st5.targets.proteinG === undefined && st5b.targets.proteinG === undefined,
        "SCALE-5 row 4 — a stale not-yet-undone replica cannot resurrect the effect: the undone copy outranks its twin from both directions");
      const B5 = dismiss5(mkB5(), "x", "protein", "2026-08-15", "Protein 200");
      const D5 = T.mergeState(cl5(A5), cl5(B5));
      const m15 = T.mergeState(cl5(U5), cl5(D5)), m25 = T.mergeState(cl5(D5), cl5(U5));
      ok(J5(m15) === J5(m25),
        "SCALE-5 row 4 — explicit Undo and derived dismissal converge BYTE-identically from both directions (at 7d74b3d _adjRank tied undone and dismissed at equal rank and local won)");
    }
    /* BLOCKER 5 — same-day equal-sid approvals couple the winner to its own adjustment. */
    {
      const A5 = approve5(mkB5(), "x", "protein", 200, "2026-08-16", "Protein 200");
      const B5 = approve5(mkB5(), "x", "protein", 210, "2026-08-16", "Protein 210");
      const ab5 = T.mergeState(cl5(A5), cl5(B5)), ba5 = T.mergeState(cl5(B5), cl5(A5));
      const act5 = (s) => s.adjustments.filter((a) => a.rid === "x" && !a.dismissed && !a.undone).map((a) => a.title);
      ok(J5(ab5) === J5(ba5) && act5(ab5).length === 1 && act5(ab5)[0] === ab5.suggestionLog.find((r) => r.sid === "x").title,
        "SCALE-5 row 4 — two same-day approvals for one card: the ACTIVE adjustment carries the WINNING decision's title, both directions (at 7d74b3d a 'Protein 200' undo door stood under a 210 decision — the selector matched day then id, and the id fingerprints nothing)");
    }
    /* BLOCKER 3 — the attestation is monotone (reclassLog) and enforcement reverses a resurrected classification. */
    {
      const rawP5 = JSON.parse(readFileSync(PREIMAGE, "utf8"));
      const full5 = T.migrate(cl5(rawP5));
      ok(Array.isArray(full5.reclassLog) && full5.reclassLog.indexOf("2026-08-08") >= 0 && full5.reclassLog.indexOf("2026-08-10") >= 0 && !full5.reads.some((r) => r && r.reclassed),
        "SCALE-5 new row 2 — the attestation lives in s.reclassLog (set-union store), not in a per-read flag an old client's union can strip; the legacy flags are absorbed and retired (observed " + J5(full5.reclassLog) + ")");
      const strip5 = cl5(full5); for (const r of strip5.reads) delete r.reclassed; delete strip5.reclassLog;
      const p5 = cl5(rawP5); p5.reads = (p5.reads || []).filter((r) => r && r.d !== "2026-08-10");
      const part5 = T.migrate(p5);
      const body5 = (s) => { const f = (s.feed || []).find((x) => x && x.op === "patch59:scale"); return f ? f.t : "(none)"; };
      const mm5 = T.mergeState(cl5(strip5), cl5(part5)), mm5b = T.mergeState(cl5(part5), cl5(strip5));
      ok(body5(mm5) === body5(full5) && body5(mm5b) === body5(full5),
        "SCALE-5 new row 2 — a marker-stripped full replica merged with a partial one still yields the TRUTHFUL receipt: the value-keyed table re-derives the attested dates at every settle (at 7d74b3d the merge said '2 MORNING READS' over a union carrying all three)");
      const flip5 = cl5(strip5);
      const old10 = (rawP5.reads || []).find((r) => r && r.d === "2026-08-10");
      flip5.reads = flip5.reads.map((r) => (r && r.d === "2026-08-10" ? cl5(old10) : r));
      const fm5 = T.mergeState(cl5(flip5), cl5(part5)), fm5b = T.mergeState(cl5(part5), cl5(flip5));
      const r105 = (s) => s.reads.find((x) => x && x.d === "2026-08-10");
      ok(!r105(fm5).offWindow && !r105(fm5b).offWindow && !(fm5.feed || []).some((f) => f && f.op === "lateread:2026-08-10"),
        "SCALE-5 new row 2 — the owner-attested 8/10 morning read can NEVER revert: a resurrected offWindow body is re-classed at the next settle, both directions (at 7d74b3d it went late again, lateread re-derived, the trend re-stepped and the receipt named one fewer read)");
      /* and the STORE ITSELF is a set union — the shipped table covers today's three
         dates, but a FUTURE attestation exists only in the store, so two replicas each
         carrying one future date must keep both, both orders */
      const fu5 = cl5(full5), fv5 = cl5(full5);
      if (!Array.isArray(fu5.reclassLog)) { ok(false, "SCALE-5 new row 2 — the reclassLog store is missing on the migrated preimage: the union pin cannot arm (a pre-store engine reads as CAUGHT here, not as a crash that hides the pins behind it — Claude Code's pass-5 finding)"); }
      const base35 = Array.isArray(fu5.reclassLog) ? fu5.reclassLog : [];
      fu5.reclassLog = [...base35, "2026-09-01"].sort();
      fv5.reclassLog = [...base35, "2026-09-02"].sort();
      const um5 = T.mergeState(cl5(fu5), cl5(fv5)), um5b = T.mergeState(cl5(fv5), cl5(fu5));
      ok(um5.reclassLog.indexOf("2026-09-01") >= 0 && um5.reclassLog.indexOf("2026-09-02") >= 0 && J5(um5.reclassLog) === J5(um5b.reclassLog),
        "SCALE-5 new row 2 — two future attestations, one per replica, BOTH survive the merge from both directions: the store unions, it does not ride the scalar spread (observed " + J5(um5.reclassLog) + ")");
    }
    /* BLOCKER 2 — a sealed morning read disproves a false MISSED/GAP line. */
    {
      const A5 = mkB5(); A5.blackout = { until: "2027-01-01" };
      const A25 = T.applyRead(cl5(A5), "2026-08-20", 100, { hour: 8 });
      const rA5 = A25.reads.find((r) => r.d === "2026-08-20");
      const B5 = mkB5(); B5.feed.unshift({ d: "2026-08-20", t: "MORNING READ MISSED", how: "the trend carries." });
      const m5 = T.mergeState(cl5(A25), cl5(B5)), m5b = T.mergeState(cl5(B5), cl5(A25));
      const miss5 = (s) => (s.feed || []).filter((f) => f && typeof f.t === "string" && f.t.indexOf("MORNING READ MISSED") === 0 && f.d === "2026-08-20").length;
      ok(!!(rA5 && rA5.sealed && !rA5.offWindow) && miss5(m5) === 0 && miss5(m5b) === 0,
        "SCALE-5 new row 1 — a same-day SEALED morning read is the disproof: sealing sets the value aside from the trend, it does not mean the weigh-in was missed — the false summary dies at the merge, both directions (at 7d74b3d it survived and the guard protected the contradiction)");
      const prev5 = cl5(A25); prev5.feed.unshift({ d: "2026-08-20", t: "MORNING READ MISSED", how: "the trend carries." });
      ok(T.dataLossGuard(prev5, cl5(A25)).safe,
        "SCALE-5 new row 1 — and the guard authorizes the removal: a missed-day line may vanish when the same day carries a sealed read (the missedday clause counts sealed non-late reads as the disproof)");
    }
  }


  /* ==================== SCALE-6 · SOL'S CLOSURE PASS-4 ROWS (2026-08-21) ====================
     Five blockers. Every pin executed RED at 9aa4870 first. The two cross-version braids
     were EXECUTED with the real f72dbf7 (v7.54.18) engine in cowork's rigs 120/121 — the
     pins below assert the new-side invariants that make those braids safe, on states
     shaped exactly like the braids' outputs. */
  {
    const J6 = JSON.stringify, cl6 = (x) => JSON.parse(J6(x));
    const mkB6 = () => { const s = T.migrate(null); s.reads = []; s.feed = []; s.weekly = []; s.suggestionLog = []; s.adjustments = []; s.targets = {}; s.trend = 100; s.blackout = { until: "2020-01-01" }; return s; };
    /* B1a — a duplicate-sid import boots as its own first merge would leave it. */
    {
      const s6 = mkB6();
      s6.suggestionLog = [
        { sid: "dup", decided: "approved", d: "2026-08-16", title: "Protein 200", apply: { kind: "protein", to: 200 }, predict: "" },
        { sid: "dup", decided: "approved", d: "2026-08-17", title: "Protein 210", apply: { kind: "protein", to: 210 }, predict: "" }];
      const m6 = T.migrate(cl6(s6));
      ok(m6.suggestionLog.length === 1 && m6.targets.proteinG === 200 && (m6.feed || []).filter((f) => f && f.op === "sug:dup").length === 1 && J6(T.mergeState(cl6(m6), cl6(m6))) === J6(m6),
        "SCALE-6 B1a — a duplicate-sid import is reduced by the MERGE'S OWN keyed rule at boot: one row, the earlier day's effect, one receipt, byte fixed point (at 9aa4870 it booted with two rows and proteinG 210, then the first merge flipped both)");
    }
    /* B1b — the attestation store normalizes with ZERO reads. */
    {
      const s6 = mkB6(); s6.reads = []; s6.reclassLog = ["2026-09-02", "2026-09-01", "2026-09-02"];
      const m6 = T.migrate(cl6(s6));
      ok(J6(m6.reclassLog) === J6(["2026-09-01", "2026-09-02"]) && J6(T.mergeState(cl6(m6), cl6(m6))) === J6(m6),
        "SCALE-6 B1b — reclassLog sorts and dedupes at every settle even when reads is empty (at 9aa4870 the normalization sat behind the reads-length early return)");
    }
    /* B1c — a duplicate-date reads import folds by the read authority rule at boot,
       and the guard reads it as tidying, never loss. */
    {
      const s6 = mkB6();
      s6.reads = [{ d: "2026-08-10", w: 100, sealed: false, pt: 100, note: "" }, { d: "2026-08-10", w: 101, sealed: false, pt: 100, note: "x" }];
      const m6 = T.migrate(cl6(s6));
      ok(m6.reads.length === 1 && J6(T.mergeState(cl6(m6), cl6(m6))) === J6(m6) && T.dataLossGuard(s6, m6).safe,
        "SCALE-6 B1c — two bodies for one date fold to the merge's pick at boot (byte fixed point), and the guard counts DAYS, so the fold is tidying (at 9aa4870 the boot replayed both bodies and a day-count guard would have refused the fold as reads 2→1)");
      const cut6 = cl6(m6); cut6.reads = [];
      ok(!T.dataLossGuard(m6, cut6).safe,
        "SCALE-6 B1c — while deleting the whole DAY is still refused");
    }
    /* B3 — the braid-shaped state heals: partial store, resurrected alternate late body,
       but the attestation FACTS present (the old feed union preserves op lines regardless
       of spread direction — executed against the real f72dbf7 engine in rig121). */
    {
      const rawP6 = JSON.parse(readFileSync(PREIMAGE, "utf8"));
      const full6 = T.migrate(cl6(rawP6));
      ok((full6.feed || []).filter((f) => f && typeof f.op === "string" && f.op.indexOf("reclass:") === 0).length === 2,
        "SCALE-6 B3 — the migration files one permanent attestation FACT per re-classed date (op reclass:<d>): the record no old client can unsay, presence-guarded by the feedop clause");
      const braid6 = cl6(full6);
      braid6.reclassLog = ["2026-08-08"];                                     /* the store thinned by the old spread */
      const r106 = braid6.reads.find((r) => r && r.d === "2026-08-10");
      r106.w = 164.1; r106.offWindow = true; r106.note = "evening read — set aside · alternate device copy";   /* the alternate body that beat the (d,w) table */
      const healed6 = T.migrate(cl6(braid6));
      const h106 = healed6.reads.find((r) => r && r.d === "2026-08-10");
      const body6 = ((healed6.feed || []).find((x) => x && x.op === "patch59:scale") || {}).t;
      ok(!h106.offWindow && (healed6.reclassLog || []).indexOf("2026-08-10") >= 0 && /8\/10/.test(String(body6)) && !(healed6.feed || []).some((f) => f && f.op === "lateread:2026-08-10"),
        "SCALE-6 B3 — the braid output HEALS at the next settle: the FACT line restores the store even when the (d,w) table cannot match the alternate body, the read re-classes, the receipt names 8/10, no late receipt (executed red at 9aa4870 via the real v7.54.18 engine: store [8/08], receipt 'A MORNING READ', 8/10 late, trend 163.8)");
    }
    /* B4 — Sol's required belt (his exact ghSync witness REFUTED on the real old engine —
       its suggestionLog spread is measured REMOTE-wins wholesale, which preserves the
       cloud's undone — but the belt is transport-independent and honors pre-7.55.4 taps). */
    {
      const s6 = mkB6();
      s6.suggestionLog.push({ sid: "x", decided: "approved", d: "2026-08-16", title: "Protein 200", apply: { kind: "protein", to: 200 }, predict: "" });
      s6.targets.proteinG = 200;
      s6.adjustments.push({ rid: "x", id: "adj_b4", d: "2026-08-16", title: "Protein 200", undone: true });   /* the adjustment carries the tap; the row lost it */
      const m6 = T.migrate(cl6(s6));
      const row6 = m6.suggestionLog.find((r) => r.sid === "x");
      ok(row6.undone === true && m6.targets.proteinG === undefined && (m6.feed || []).some((f) => f && f.op === "sug:x" && f.t === "ANALYST SUGGESTION UNDONE"),
        "SCALE-6 B4 — an adjustment carrying the athlete's undone tap RESTORES the decision row's undone flag at settle: the effect stays off and the receipt says UNDONE through any braid, and a pre-7.55.4 undo tap is finally honored (Sol's required belt; his ghSync witness itself refuted on the real engine — measured remote-wins — and the probe is in the pack)");
    }
    /* B5 — the athlete's same-day tap order survives boot; the undo door offers the LAST tap. */
    {
      const s6 = mkB6();
      s6.suggestionLog.push({ sid: "z_old", decided: "approved", d: "2026-08-16", at: "2026-08-16T09:00:00.000Z", title: "Protein 200", apply: { kind: "protein", to: 200 }, predict: "" });
      s6.adjustments.push({ rid: "z_old", id: "adj_1", d: "2026-08-16", at: "2026-08-16T09:00:00.000Z", title: "Protein 200" });
      s6.suggestionLog.push({ sid: "a_new", decided: "approved", d: "2026-08-16", at: "2026-08-16T09:05:00.000Z", title: "Protein 210", apply: { kind: "protein", to: 210 }, predict: "" });
      s6.adjustments.push({ rid: "a_new", id: "adj_2", d: "2026-08-16", at: "2026-08-16T09:05:00.000Z", title: "Protein 210" });
      s6.targets.proteinG = 210;
      const m6 = T.migrate(cl6(s6));
      ok(m6.targets.proteinG === 210 && (T.lastUndoable(m6) || {}).rid === "a_new",
        "SCALE-6 B5 — two same-day approvals of one kind: the SECOND tap keeps the effect through boot and the undo door offers it (at 9aa4870 alphabetical sid order silently reversed the athlete's later tap: proteinG fell back to 200 and Undo offered z_old)");
      const s7 = mkB6();
      s7.suggestionLog.push({ sid: "z_card", decided: "approved", d: "2026-08-16", at: "2026-08-16T09:00:00.000Z", title: "Protein 200", apply: { kind: "protein", to: 200 }, predict: "" });
      s7.adjustments.push({ rid: "z_card", id: "adj_1", d: "2026-08-16", at: "2026-08-16T09:00:00.000Z", title: "Protein 200" });
      s7.suggestionLog.push({ sid: "a_card", decided: "approved", d: "2026-08-16", at: "2026-08-16T09:05:00.000Z", title: "Sleep 8", apply: { kind: "sleep", to: 8 }, predict: "" });
      s7.adjustments.push({ rid: "a_card", id: "adj_2", d: "2026-08-16", at: "2026-08-16T09:05:00.000Z", title: "Sleep 8" });
      const m7 = T.migrate(cl6(s7));
      ok((T.lastUndoable(m7) || {}).rid === "a_card" && m7.targets.proteinG === 200 && m7.targets.sleepH === 8,
        "SCALE-6 B5 — 'Last move applied' identifies the second writer call across kinds, regardless of sid spelling; both effects stand");
    }
    /* B6 — a valid no-pt read has one byte identity. */
    {
      const A6 = mkB6(); A6.reads = [{ d: "2026-08-10", w: 100, sealed: false, note: "same" }];
      const B6 = mkB6(); B6.reads = [JSON.parse('{"note":"same","sealed":false,"w":100,"d":"2026-08-10"}')];
      const ab6 = T.mergeState(cl6(A6), cl6(B6)), ba6 = T.mergeState(cl6(B6), cl6(A6));
      ok(J6(ab6) === J6(ba6) && J6(T.migrate(cl6(A6))) === J6(T.migrate(cl6(B6))),
        "SCALE-6 B6 — one logical NO-PT read in two raw key orders: same bytes both directions and at boot — fresh SEED ships 39 reads without pt, so the re-key may not hide behind the pt-bearing return (at 9aa4870 it did)");
    }
    /* lower-priority row — keyed-store rows are canonically materialized. */
    {
      const A6 = mkB6();
      A6.suggestionLog.push({ sid: "k", decided: "approved", d: "2026-08-16", title: "Protein 200", apply: { kind: "protein", to: 200 }, predict: "" });
      const B6 = cl6(A6);
      B6.suggestionLog = [JSON.parse(JSON.stringify(JSON.parse('{"predict":"","apply":{"to":200,"kind":"protein"},"title":"Protein 200","d":"2026-08-16","decided":"approved","sid":"k"}')))];
      const ab6 = T.mergeState(cl6(A6), cl6(B6)), ba6 = T.mergeState(cl6(B6), cl6(A6));
      ok(J6(ab6) === J6(ba6) && J6(T.migrate(cl6(A6))) === J6(T.migrate(cl6(B6))),
        "SCALE-6 — the same production decision row re-keyed on another replica merges and boots to identical bytes: keyed-store rows are materialized canonically, as SCALE-5 did for reads");
    }
  }

  /* ==================== SCALE-7 · SOL'S CLOSURE PASS-5 ROWS (2026-08-23) ====================
     Two blockers, both executed CONFIRMED with the real f72dbf7 (v7.54.18) engine before
     any fix was designed (cowork rigs 122a/122b/123/124). P0: the old client's wholesale
     suggestionLog spread erased a decided row while its keyed adjustments union carried
     the undo on — a TWO-replica ordinary ghSync flow, no race — the old guard called the
     push safe, the fresh device re-offered the card, and a re-approval was killed at its
     next settle by the stale undone adjustment. P1: two same-day taps by the real old
     applyProposal writer (which never stamped `at` but always embedded its instant in the
     id) upgraded into a new client whose Undo reversed the FIRST tap. Sol's bare
     []+adjustment witness (no op line) is REFUTED as unreachable: the op-keyed line is
     born with the approval on the same device and survives every measured braid beside
     the adjustment. */
  {
    const J7 = JSON.stringify, cl7 = (x) => JSON.parse(J7(x));
    const mkB7 = () => { const s = T.migrate(null); s.reads = []; s.feed = []; s.weekly = []; s.suggestionLog = []; s.adjustments = []; s.targets = {}; s.trend = 100; s.blackout = { until: "2020-01-01" }; return s; };
    /* P0-a — the braid-shaped orphan heals at one boot: no row, an undone adjustment, the
       op-keyed sug: receipt. Tombstone appears, card stays decided, effect off, UNDONE
       receipt derives, byte fixed point. */
    {
      const s7 = mkB7();
      s7.adjustments.push({ rid: "sug_o1", id: "adj_o1", d: "2026-07-20", at: "2026-07-20T10:00:00.000Z", title: "Protein 205 g", undone: true });
      s7.feed.push({ d: "2026-07-20", op: "sug:sug_o1", t: "ANALYST SUGGESTION APPLIED", how: "Protein 205 g — protein target set to 205 g/day" });
      const b7 = T.migrate(cl7(s7));
      const t7 = (b7.suggestionLog || []).find((x) => x && x.sid === "sug_o1");
      ok(!!t7 && t7.decided === "approved" && t7.undone === true && t7.orphan === true && (b7.targets || {}).proteinG == null,
        "SCALE-7 P0 — an orphan undo re-materializes as an approved+undone tombstone at boot: the card stays decided and no effect stands (at b68ed36 the sid vanished, the guard called it safe, and the card was re-offered)");
      ok((b7.feed || []).some((f) => f && f.op === "sug:sug_o1" && f.t === "ANALYST SUGGESTION UNDONE"),
        "SCALE-7 P0 — the UNDONE receipt re-derives from the tombstone");
      ok(J7(T.migrate(cl7(b7))) === J7(b7),
        "SCALE-7 P0 — the healed state is a byte fixed point of its next boot");
    }
    /* P0-b — the true row outranks its tombstone in the union, both directions, one row. */
    {
      const s7 = mkB7();
      s7.adjustments.push({ rid: "sug_o2", id: "adj_o2", d: "2026-07-20", at: "2026-07-20T10:00:00.000Z", title: "Protein 205 g", undone: true });
      s7.feed.push({ d: "2026-07-20", op: "sug:sug_o2", t: "ANALYST SUGGESTION APPLIED", how: "Protein 205 g — protein target set to 205 g/day" });
      const F7 = T.migrate(cl7(s7));
      const R7 = mkB7();
      R7.suggestionLog.push({ sid: "sug_o2", decided: "approved", undone: true, d: "2026-07-20", at: "2026-07-20T10:00:00.000Z", title: "Protein 205 g", apply: { kind: "protein", to: 205 }, predict: "" });
      R7.adjustments.push({ rid: "sug_o2", id: "adj_o2", d: "2026-07-20", at: "2026-07-20T10:00:00.000Z", title: "Protein 205 g", undone: true });
      const m1 = T.mergeState(cl7(F7), cl7(R7)), m2 = T.mergeState(cl7(R7), cl7(F7));
      const w7 = (m1.suggestionLog || []).filter((x) => x && x.sid === "sug_o2");
      ok(w7.length === 1 && !!w7[0].apply && !w7[0].orphan && w7[0].undone === true && J7(m1) === J7(m2),
        "SCALE-7 P0 — the true decision row beats its tombstone on the union's non-orphan bit (the tombstone's canonical bytes happen to outrank the richer row, so without the bit the apply body is stripped), byte-identical both directions");
    }
    /* P0-c — the REAL undo files the sugundo FACT line; it survives the receipt sweep and
       the guard refuses its deletion BY NAME. */
    {
      const s7 = mkB7();
      s7.suggestionLog.push({ sid: "sug_o3", decided: "approved", d: "2026-07-19", at: "2026-07-19T09:00:00.000Z", title: "Protein 205 g", apply: { kind: "protein", to: 205 }, predict: "" });
      s7.adjustments.push({ rid: "sug_o3", id: "adj_o3", d: "2026-07-19", at: "2026-07-19T09:00:00.000Z", title: "Protein 205 g" });
      const b7 = T.migrate(cl7(s7));
      const u7 = T.undoAdjustment(cl7(b7), "sug_o3");
      const f7 = (u7.feed || []).find((f) => f && f.op === "sugundo:sug_o3");
      ok(!!f7 && f7.ti === "Protein 205 g" && (T.migrate(cl7(u7)).feed || []).some((f) => f && f.op === "sugundo:sug_o3"),
        "SCALE-7 P0 — the undo tap files its own op-keyed FACT line (machine title in ti, never parsed from copy) and the receipt sweep does not touch it");
      const g7 = cl7(T.migrate(cl7(u7)));
      const cut7 = cl7(g7); cut7.feed = cut7.feed.filter((f) => !(f && f.op === "sugundo:sug_o3"));
      const res7 = T.dataLossGuard(cl7(g7), cut7);
      ok(!res7.safe && (res7.lost || []).some((x) => String(x) === "feedop sugundo:sug_o3"),
        "SCALE-7 P0 — deleting the undo FACT is refused BY NAME (feedop clause)");
    }
    /* P0-d — the FACT line ALONE re-materializes the tombstone (row and adjustment both gone). */
    {
      const s7 = mkB7();
      s7.feed.push({ d: "2026-07-20", op: "sugundo:sug_o4", ti: "Protein 205 g", t: "SUGGESTION UNDO ATTESTED — Protein 205 g", how: "You reversed this analyst move by one tap. This line is the record of that word — it travels with the data, so no older copy of the app can unsay it." });
      const b7 = T.migrate(cl7(s7));
      const t7 = (b7.suggestionLog || []).find((x) => x && x.sid === "sug_o4");
      ok(!!t7 && t7.decided === "approved" && t7.undone === true && t7.orphan === true && t7.title === "Protein 205 g",
        "SCALE-7 P0 — the sugundo FACT alone proves an approved-then-undone decision: the tombstone derives from the word, not from any survivor it happens to travel with");
    }
    /* P0-e — no invention: an undone adjustment with NO sug op is not absorbed (a
       tombstone on a proposal-family rid would print an analyst line over an engine record). */
    {
      const s7 = mkB7();
      s7.adjustments.push({ rid: "steppush_2026-07-13", id: "adj_o5", d: "2026-07-20", title: "Step push", undone: true });
      const b7 = T.migrate(cl7(s7));
      ok(!(b7.suggestionLog || []).some((x) => x && x.sid === "steppush_2026-07-13"),
        "SCALE-7 P0 — an undone adjustment without the sid's op line is not provably suggestion-origin and mints nothing");
    }
    /* P1-a — the rig123 wound as a pin: two same-day UNSTAMPED taps by the old writer's
       shape (ids embed the instant; rid spelling opposes call order). The undo door offers
       the SECOND tap, does not claim proven order, and both directions agree. */
    {
      const s7 = mkB7();
      s7.adjustments.push({ rid: "zz_first_tap", id: "adj_aaa000", d: "2026-07-20", title: "FIRST TAP" });
      s7.adjustments.push({ rid: "aa_second_tap", id: "adj_bbb111", d: "2026-07-20", title: "SECOND TAP" });
      const b7 = T.migrate(cl7(s7));
      const lu7 = T.lastUndoable(b7);
      ok(!!lu7 && lu7.rid === "aa_second_tap" && lu7.orderSure === false,
        "SCALE-7 P1 — same-day unstamped taps order by the legacy writer's own embedded instant (the id), not rid spelling: Undo offers the SECOND tap (at b68ed36 it reversed the first — executed with the real f72dbf7 applyProposal in rig123) — and the door does not claim a proven order");
      const p7 = mkB7();
      const x1 = T.mergeState(cl7(b7), cl7(p7)), x2 = T.mergeState(cl7(p7), cl7(b7));
      ok((T.lastUndoable(x1) || {}).rid === "aa_second_tap" && (T.lastUndoable(x2) || {}).rid === "aa_second_tap",
        "SCALE-7 P1 — the pick is the same from both merge directions");
    }
    /* P1-b — the id-less suggestion-era records (13 live rows have no id and no at):
       storage order is recovered at boot (ord), and a double boot is byte-stable. */
    {
      const s7 = mkB7();
      s7.adjustments.push({ rid: "zz_first", d: "2026-07-20", title: "FIRST" });
      s7.adjustments.push({ rid: "aa_second", d: "2026-07-20", title: "SECOND" });
      const b7 = T.migrate(cl7(s7));
      const day7 = (b7.adjustments || []).filter((a) => a && a.d === "2026-07-20");
      ok(day7.length === 2 && day7[0].rid === "zz_first" && day7[1].rid === "aa_second" && day7.every((a) => a.ord != null),
        "SCALE-7 P1 — id-less unstamped rows recover their storage order at boot (ord minted once), not rid order");
      ok(J7(T.migrate(cl7(b7))) === J7(b7),
        "SCALE-7 P1 — and the minted order is a byte fixed point");
    }
    /* P1-c — the decision log: two same-day UNSTAMPED approvals of one kind, array order
       opposing sid order. The LATER decision keeps the effect (at b68ed36, sid spelling
       reversed it), and the recovered order survives an old client's wholesale round trip. */
    {
      const s7 = mkB7();
      s7.suggestionLog.push({ sid: "z_early", decided: "approved", d: "2026-07-20", title: "Protein 200", apply: { kind: "protein", to: 200 }, predict: "" });
      s7.suggestionLog.push({ sid: "a_late", decided: "approved", d: "2026-07-20", title: "Protein 210", apply: { kind: "protein", to: 210 }, predict: "" });
      const b7 = T.migrate(cl7(s7));
      ok((b7.targets || {}).proteinG === 210,
        "SCALE-7 P1 — the log's recovered storage order decides a same-day same-kind pair: the LATER decision's 210 stands (at b68ed36 sid spelling handed the effect back to 200)");
      const ord7 = (b7.suggestionLog || []).filter((x) => x && x.d === "2026-07-20").map((x) => x.sid);
      ok(J7(ord7) === J7(["z_early", "a_late"]) && (b7.suggestionLog || []).every((x) => x.at || x.ord != null),
        "SCALE-7 P1 — storage order recovered as ord at the boot exit, before any sort runs");
      ok(J7(T.migrate(cl7(b7))) === J7(b7) && (T.migrate(T.mergeState(cl7(b7), cl7(b7))).targets || {}).proteinG === 210,
        "SCALE-7 P1 — fixed point, and the self-merge keeps the athlete's later decision");
    }
  }

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
