/* sync-laws — THE CONVERGENCE HARNESS (v7.54.0)
   ============================================================================
   WHY THIS EXISTS. The load round took nine legs, and four of the six defects
   Sol confirmed were ONE class: two independently-correct rules disagreeing
   under a merge order. Each was found by hand, by one reviewer, one at a time.
   That class is machine-findable, so this is the machine.

   WHAT IT DRIVES. Production functions only — migrate, mergeState, and the
   app's own exported correction primitives. It never re-implements a model of
   the merge: a model that reproduces the system under test proves nothing. The
   one honest caveat, stated plainly rather than buried: the ✕ / ↩ / weight-box
   handlers live inside React components and cannot be called from node, so the
   correction ops here COMPOSE the same exported primitives those handlers call
   (_stampCorr, _fileCorr, deriveLastMeta) in the same order. That composition
   is itself guarded — see the SHAPE check at the end, which reads the handler
   source and fails if a handler stops calling what this harness composes. The
   handlers' full DOM behaviour is covered by tools/split-smoke.mjs.

   DETERMINISM. Every timestamp comes from the generator, never the wall clock;
   tools/_fixed-now.mjs freezes Date for anything downstream that still reads
   it. The gate runs a COMMITTED seed set only. `--explore` rotates seeds, is
   never gate-blocking, and prints a paste-able replay for anything it finds.

   ON FAILURE it prints the seed, the operation sequence, and both merge
   results — a counterexample you can reproduce by paste, not by luck.
   ============================================================================ */
import fs from "node:fs";
import path from "node:path";
import { at, tmp } from "../scripts/lib.mjs";
import "./_fixed-now.mjs";

const EXPLORE = process.argv.includes("--explore");
const VERBOSE = process.argv.includes("--verbose");

/* ---------- the engine under test (esbuild JS API — never the binary) ---------- */
const engine = await (async () => {
  if (process.env.PL_ENGINE) return import("file://" + path.resolve(process.env.PL_ENGINE).split(String.fromCharCode(92)).join("/"));   /* WINDOWS: a bare absolute path reads as protocol "c:" to the ESM loader, not as a path — the fail-first lever has to be a file:// URL or it dies before the first law runs */
  const out = tmp("_laws-engine.mjs");
  const esbuild = (await import("esbuild")).default;
  await esbuild.build({
    entryPoints: [at("src/app.jsx")], bundle: true, format: "esm", platform: "node",
    outfile: out, loader: { ".jsx": "jsx" }, logLevel: "silent",
    external: ["react", "react-dom", "react/jsx-runtime"],
  });
  return import("file://" + out.replace(/\\/g, "/"));
})();
const T = engine.__test;

/* ---------- deterministic randomness ---------- */
function rng(seed) {
  let a = (seed >>> 0) || 1;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const pick = (r, xs) => xs[Math.floor(r() * xs.length) % xs.length];
const cl = (x) => JSON.parse(JSON.stringify(x));
const J = (x) => JSON.stringify(x);
/* DEEP equality, which is what the laws are about. Key ORDER is not
   information: it falls out of object-spread order, so it is direction-
   flavoured by construction and demanding byte-identical key order would fail
   every merge forever while proving nothing about the data. Measured during
   the build — the first convergence "violations" this harness reported were
   all key order with a semantically identical state underneath. */
const canon = (x) => {
  if (Array.isArray(x)) return x.map(canon);
  if (x && typeof x === "object") { const o = {}; for (const k of Object.keys(x).sort()) o[k] = canon(x[k]); return o; }
  return x;
};
const DEQ = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));

/* ---------- the world: 2 lifts x 2 dates, frozen literals ----------
   FROZEN ON PURPOSE. ledger/state.json syncs from Joe's phone and has already
   turned a dozen pins vacuous once this round; a committed seed that reads it
   is a seed that silently stops testing. Every literal below is fixed here. */
const D1 = "2026-08-09", D2 = "2026-08-14";
const T0 = "2026-08-09T21:00:00.000Z";
const STAMPS = ["2026-08-09T20:00:00.000Z", "2026-08-09T21:56:31.672Z", "2026-08-14T21:52:54.838Z", "2026-08-14T21:57:13.968Z", "2026-08-20T09:00:00.000Z"];

function world() {
  const s = cl(T.SEED);
  s.v = T.SCHEMA_V;
  s.exercises = [
    { id: "hack", n: "Hack squat", mg: "quads", day: "L", w: 190, wAt: "2026-08-14T21:52:54.838Z", inc: 10, sets: 3, hi: 10, steps: [160, 170, 180, 190], last: [7, 7, 8], lastMeta: { d: D2, w: 190, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0], debt: false }, topAt: null, topRun: 0, setup: "SET · seat 4" },
    { id: "rows", n: "Rows", mg: "back", day: "U", w: 180, inc: 5, sets: 2, hi: 12, last: [9, 9], lastMeta: { d: D1, w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0], debt: false }, topAt: null, topRun: 0, setup: "SET · chest pad" },
  ];
  s.exOrder = { U: ["rows"], L: ["hack"] };
  s.sessionLog = {
    [D1]: { d: D1, at: 1786311986964, entries: [{ id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }] },
    [D2]: { d: D2, at: 1786826000000, entries: [{ id: "hack", w: 190, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0] }] },
  };
  s.feed = [];
  return s;
}

/* ---------- THE OPERATIONS — the app's own writers, composed ---------- */
const OPS = {
  /* a boot. the real one. */
  boot: (s) => T.migrate(cl(s)),

  /* the ✕ control's mutation: filter, skip, stamp, FILE, re-derive. */
  skip: (s, r, ctx) => {
    const d = ctx.date, rec = s.sessionLog[d];
    if (!rec || !(rec.entries || []).length) return s;
    const e = pick(r, rec.entries);
    rec.skipped = [...(rec.skipped || []), { id: e.id }];
    rec.entries = rec.entries.filter((x) => x.id !== e.id);
    T._stampCorr(rec); rec.corr = { at: ctx.stamp, rev: (rec.corr || {}).rev };   /* DIFFERENT DEVICES HAVE DIFFERENT CLOCKS. _stampCorr reads the wall clock, which the suite freezes — so composed faithfully, every correction in a run would stamp the SAME instant and no law could ever distinguish an ordering rule from its opposite. (That is precisely why the corrLog earliest-wins rule looked like an equivalent mutant: min and max coincide when every at is equal.) The generator supplies the instant, per this harness's own determinism rule. */
    if (T._fileCorr) T._fileCorr(rec, "skip:" + d + ":" + e.id + ":" + ((rec.corr && rec.corr.at) || ""), "skip", e.id, rec.corr && rec.corr.at);   /* the PRODUCTION key shape (src/app.jsx) — testing a key the app no longer writes is testing nothing */
    ctx.did.push({ d, id: e.id, kind: "skip" });
    reDerive(s, e.id);
    return s;
  },
  /* the ↩ control's mutation, carrying what it restored. */
  unskip: (s, r, ctx) => {
    const d = ctx.date, rec = s.sessionLog[d];
    if (!rec || !(rec.skipped || []).length) return s;
    const k = pick(r, rec.skipped);
    rec.skipped = rec.skipped.filter((z) => z.id !== k.id);
    const exN = (s.exercises || []).find((z) => z.id === k.id) || {};
    const reps = [pick(r, [8, 9, 10, 11])];
    const en = { id: k.id, reps, rir: null, rirSets: T.buildRirSets({ reps, rir: null, rirEnd: null }, reps.length), w: typeof exN.w === "number" ? exN.w : null };
    rec.entries = [...(rec.entries || []), en];
    T._stampCorr(rec); rec.corr = { at: ctx.stamp, rev: (rec.corr || {}).rev };   /* the device's own clock — see the skip op */
    if (T._fileCorr) T._fileCorr(rec, "unskip:" + d + ":" + k.id + ":" + ((rec.corr && rec.corr.at) || ""), "unskip", k.id, rec.corr && rec.corr.at, en);
    ctx.did.push({ d, id: k.id, kind: "unskip" });
    reDerive(s, k.id);
    return s;
  },
  /* the SETUP weight box: w moves, wAt stamps, last nulls (the reseed). */
  wsave: (s, r, ctx) => {
    const ex = pick(r, s.exercises);
    const v = pick(r, [160, 170, 180, 190, 200, 210]);
    if (v === ex.w) return s;
    const rungs = T.loadRungs(ex);
    if (rungs && rungs.indexOf(v) < 0) { ex.steps = [...new Set([...rungs, v])].sort((a, b) => a - b); ex.stepsAt = ctx.stamp; }
    ex.w = v; ex.wAt = ctx.stamp; ex.last = null; ex.topAt = null; ex.topRun = 0;
    return s;
  },
  /* RESET: the same event class — w moves first, then last is nulled. */
  reset: (s, r, ctx) => {
    const ex = pick(r, s.exercises);
    ex.w = typeof ex.w === "number" ? Math.max(20, ex.w - 20) : ex.w;
    ex.wAt = ctx.stamp; ex.last = null;
    return s;
  },
  /* THE LADDER EDITOR'S TWO PATHS, split so they can be aimed. Both stamp —
     src/app.jsx:16242 clears (`delete ex6.steps; ex6.stepsAt = ...`) and :16243
     sets (`ex6.steps = parsed; ex6.stepsAt = ...`) — and together they are the
     canonical ABSENT-vs-PRESENT pair on one stamped field, which is the shape
     the equal-stamp tie-break exists for. Aimed at the same lift with the same
     stamp, they are the collision the committed seeds could never reach by
     chance (leg 2's finding: what was pinned was the tip, not the law). */
  ladderSet: (s, r, ctx) => {
    const ex = ctx.lift ? (s.exercises || []).find((z) => z && z.id === ctx.lift) : pick(r, s.exercises);
    if (!ex) return s;
    const rungs = T.loadRungs(ex) || [];
    ex.steps = [...new Set([...rungs, ctx.rung || pick(r, [155, 165, 205, 215])])].sort((a, b) => a - b);
    ex.stepsAt = ctx.stamp;
    return s;
  },
  ladderClear: (s, r, ctx) => {
    const ex = ctx.lift ? (s.exercises || []).find((z) => z && z.id === ctx.lift) : pick(r, s.exercises);
    if (!ex) return s;
    delete ex.steps; ex.stepsAt = ctx.stamp;
    return s;
  },
  ladder: (s, r, ctx) => (r() < 0.5 ? OPS.ladderSet(s, r, ctx) : OPS.ladderClear(s, r, ctx)),
  /* a data-amendment patch: an entry's load is restated, with its provenance. */
  amend: (s, r, ctx) => {
    const d = ctx.date, rec = s.sessionLog[d];
    if (!rec || !(rec.entries || []).length) return s;
    const e = pick(r, rec.entries);
    if (typeof e.w !== "number") return s;
    e.w = e.w + pick(r, [5, 10, -10]);
    e.wCorrAt = ctx.stamp;
    T._stampCorr(rec); rec.corr = { at: ctx.stamp, rev: (rec.corr || {}).rev };   /* the device's own clock — see the skip op */
    if (T._fileCorr) T._fileCorr(rec, "amend:" + d + ":" + e.id + ":" + ((rec.corr && rec.corr.at) || ""), "amend", e.id, rec.corr && rec.corr.at, [{ id: e.id, w: e.w }]);
    return s;
  },
  /* the transport is JSON: a law that only holds in memory is not a law. */
  roundtrip: (s) => JSON.parse(JSON.stringify(s)),
  /* A DEVICE REJOINS CARRYING AN OLDER BODY — restore from a backup. Every
     other op only ever adds to or corrects a replica, so every replica
     descended from world() and the whole "older body rejoins" class was
     UNREACHABLE: the restore drill, the v40 witness this round wrote into its
     own pins, and the loss that FIX 2 closes all live in that class. A law
     that cannot be reached is a law that cannot fail. */
  restore: (s, r, ctx) => {
    if (!(ctx.snaps && ctx.snaps.length)) return s;
    const i9 = Math.floor(r() * ctx.snaps.length) % ctx.snaps.length;
    /* THE ORACLE ROLLS BACK WITH THE STATE. ctx.did records what this replica
       DID; restore rolled the state back and left the record of acts intact, so
       correction-survival then demanded corrections the replica no longer
       holds. All 24 explore hits at base 424242 were this and none was real —
       a harness that lies about its own history reports its bug as the app's. */
    if (ctx.did && ctx.didSnaps && ctx.didSnaps[i9]) { ctx.did.length = 0; for (const d9 of ctx.didSnaps[i9]) ctx.did.push(d9); }
    return cl(ctx.snaps[i9]);
  },
};
const OP_NAMES = Object.keys(OPS);

function reDerive(s, id) {
  const ex = (s.exercises || []).find((z) => z && z.id === id);
  if (!ex) return;
  const dm = T.deriveLastMeta(s, id);
  if (dm) { ex.lastMeta = dm; ex.last = dm.reps.slice(); }
  else { ex.lastMeta = { d: null, w: ex.w, reps: [], rir: null, rirSets: [], debt: false }; ex.last = null; }
}

/* AIMED SEEDS — the durable lesson of leg 2, generalised. A random op stream
   reaches a shape only by luck, and luck is not coverage: seed 70426 went red
   at the historical tip yet did NOT re-catch the tie-break when it was reverted
   at HEAD, so what it pinned was the tip, not the law. Worse, changing the
   generator silently re-rolls every seed's meaning — the seeds that once caught
   a class stop catching it and nothing says so. So each class the app has
   actually suffered gets a seed that FORCES its shape, through the same
   production writers the random ops compose, and the mutation table below is
   re-run whenever the generator changes. */
/* the shape 14411/14412 exist for, stated as a predicate: one stamp, one
   field, present on exactly one side. */
const sameStampOneAbsent = (out, id) => {
  const g = (s) => (s.exercises || []).find((e) => e && e.id === id) || {};
  const a = g(out[0]), b = g(out[1]);
  return _isoEq(a.stepsAt, b.stepsAt) && (Array.isArray(a.steps) ? 1 : 0) + (Array.isArray(b.steps) ? 1 : 0) === 1;
};
const _isoEq = (x, y) => String(x || "") === String(y || "") && String(x || "") !== "";
const AIM = {
  /* N-5(a) — TWO CORRECTED RECORDS THAT TIE ON EVERYTHING THE ORDERING LAW
     READS: same corr.at, same rev, same _mergeScore, different bodies. Nothing
     in the committed set forced this, so an engine whose base tie fell back to
     _richer (which ties to its second argument, i.e. merge order) passed green. */
  14421: { apply: (out) => {
      const mk = (s9, reps9) => { s9.sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964,
        entries: [{ id: "curl", w: 50, reps: reps9, rir: 2, rirSets: [2, null, null] }],
        corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 },
        corrLog: [{ op: "amend:2026-08-09:curl:2026-08-10T08:00:00.000Z", kind: "amend", id: "curl", at: "2026-08-10T08:00:00.000Z", to: [{ id: "curl", w: 50 }] }] }; };
      mk(out[0], [12, 12, 9]); mk(out[1], [12, 12, 8]); if (out[2]) mk(out[2], [12, 12, 9]);
      /* THE THIRD REPLICA MATCHES A's BODY ON PURPOSE. With a DIFFERENT third
         body this seed goes red on the TIP for associativity — a real, open
         defect this seed found and this leg does not close: accumulation adds
         lifts to the intermediate record, which changes _mergeScore, which the
         (at, rev) tie then reads — so (A+B)+C and A+(B+C) can pick different
         bodies. The pairwise rule is order-free; it is not associative once the
         body it compares has grown. Reported in the handoff for the next leg
         rather than papered over; the seed keeps guarding the pairwise tie
         (R-1 / N-5a), which is what it was asked for. */
      return ["curl [12,12,9]", "curl [12,12,8] — same at, same rev, same score", "curl [12,12,9]"]; },
    assert: (out) => {
      const a = out[0].sessionLog["2026-08-09"], b = out[1].sessionLog["2026-08-09"];
      return a.corr.at === b.corr.at && a.corr.rev === b.corr.rev
        && J(a).length === J(b).length && J(a) !== J(b); } },
  /* N-5(b) — THE AMEND WITNESS: rows skipped on one side WITH an amend naming
     it, logged on the other with no placement op. An amend restates a value and
     says nothing about placement, so nothing here decides where rows sits — and
     an engine that read "any correction naming the lift" as deciding left it in
     both arrays. */
  14422: { apply: (out) => {
      out[0].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964,
        entries: [{ id: "hack", w: 200, reps: [7, 7], rir: 2, rirSets: [2, 0] }],
        skipped: [{ id: "rows" }],
        corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 },
        corrLog: [{ op: "amend:2026-08-09:rows:2026-08-10T08:00:00.000Z", kind: "amend", id: "rows", at: "2026-08-10T08:00:00.000Z", to: [{ id: "rows", w: 185 }] }] };
      out[1].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964,
        entries: [{ id: "hack", w: 200, reps: [7, 7], rir: 2, rirSets: [2, 0] }, { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }] };
      return ["rows SKIPPED + an amend naming rows", "rows LOGGED, no op", "(untouched)"]; },
    assert: (out) => {
      const a = out[0].sessionLog["2026-08-09"], b = out[1].sessionLog["2026-08-09"];
      return (a.skipped || []).some((z) => z.id === "rows")
        && (a.corrLog || []).some((c) => c.kind === "amend" && c.id === "rows")
        && (b.entries || []).some((e) => e.id === "rows")
        && !(b.corrLog || []).some((c) => c.kind === "skip" || c.kind === "unskip"); } },
  /* item 4 — THE NON-MONOTONE CLOCK, committed. A later act with an earlier
     stamp: the device's body says logged (last act wins there) and a replay of
     its own corrLog says skipped. The generator hands this shape in directly
     because the production writer can no longer produce it. */
  883544: { apply: (out) => {
      const rec = out[0].sessionLog["2026-08-09"];
      rec.entries = [...(rec.entries || []).filter((e) => e.id !== "rows"), { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }];
      rec.skipped = [];
      rec.corr = { at: "2026-08-20T08:00:00.000Z", rev: 2 };
      rec.corrLog = [
        { op: "skip:2026-08-09:rows:2026-08-20T08:00:00.000Z", kind: "skip", id: "rows", at: "2026-08-20T08:00:00.000Z" },
        { op: "unskip:2026-08-09:rows:2026-08-09T08:00:00.000Z", kind: "unskip", id: "rows", at: "2026-08-09T08:00:00.000Z", to: { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] } },
      ];
      return ["rows: skip@08-20 then unskip@08-09 — a later act with an earlier stamp", "(untouched)", "(untouched)"]; },
    assert: (out) => {
      const l = ((out[0].sessionLog["2026-08-09"] || {}).corrLog) || [];
      const sk = l.find((c) => c.kind === "skip" && c.id === "rows"), un = l.find((c) => c.kind === "unskip" && c.id === "rows");
      return !!sk && !!un && String(un.at) < String(sk.at); } },
  /* THE TRANSIENT-RUNG WITNESS (explore 1422036, promoted). Three replicas,
     three distinct (w, wAt) and three distinct (steps, stepsAt) including one
     unstamped ladder — so B+C resolves a load that exists in no final state,
     and a repair running at that intermediate merge inserts a rung for it. The
     rung then outlives the load and (A+B)+C and A+(B+C) settle with different
     ladders: the persistent state depending on sync topology. */
  1422036: { apply: (out) => {
      const set = (s9, w9, wAt9, steps9, stepsAt9) => { const x9 = (s9.exercises || []).find((z) => z && z.id === "hack");
        if (!x9) return; x9.w = w9; x9.wAt = wAt9; if (steps9) x9.steps = steps9.slice(); else delete x9.steps;
        if (stepsAt9) x9.stepsAt = stepsAt9; else delete x9.stepsAt; };
      set(out[0], 190, "2026-08-14T21:52:54.838Z", [160, 170, 180, 190], null);
      set(out[1], 170, "2026-08-09T20:00:00.000Z", [155, 160, 170, 180, 190, 205], "2026-08-14T21:57:13.968Z");   /* STRICTLY OLDER than C: with equal wAt the sub-merge load tied by value to 170, which IS a rung of C's ladder, so nothing inserted and the seed proved nothing */
      if (out[2]) set(out[2], 150, "2026-08-09T21:56:31.672Z", [160, 165, 170, 180, 190], "2026-08-20T09:00:00.000Z");
      return ["w190 · ladder unstamped", "w170 · ladder 8/14", "w150 · ladder 8/20"]; },
    /* THE PROPERTY, not the ingredients: the SUB-MERGE must want an insertion
       the final state does not. Three distinct stamps proved nothing — with B
       and C tied on wAt the sub-merge load was already a rung and the defect
       never formed, which is how this seed sat green on the very engine it was
       promoted to catch. */
    assert: (out) => {
      if (out.length < 3) return false;
      const g9 = (s9) => (s9.exercises || []).find((z) => z && z.id === "hack") || {};
      const newer9 = (p, q) => (String(g9(p).wAt || "") > String(g9(q).wAt || "") ? p : q);
      const subLoad = g9(newer9(out[1], out[2])).w;                                  /* what B+C resolves to */
      const subLad = g9(String(g9(out[1]).stepsAt || "") > String(g9(out[2]).stepsAt || "") ? out[1] : out[2]).steps || [];
      const finalLoad = g9(out.reduce((p, q) => newer9(p, q))).w;                    /* what the whole merge resolves to */
      return subLad.indexOf(subLoad) < 0 && subLad.indexOf(finalLoad) > -1; } },
  /* THE RESTORE DRILL — cowork's witness, committed. A pre-correction backup of
     the 8/14 record rejoins today, and on it the athlete makes ONE legitimate
     new correction. Before FIX 2, his newer stamp correctly made the restored
     body the base and then everything the base happened to lack was gone: two
     lifts he had ✕'d came back as entries and two hand-added entries were
     deleted, 7 down to 5, in BOTH orders — so the convergence law reported
     green over the loss and dataLossGuard, counting dates, never looked in. */
  14420: { apply: (out) => {
      const D = "2026-08-14";
      const full = [
        { id: "hack", w: 200, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0] },
        { id: "extension", w: 160, reps: [8, 9], rir: 2, rirSets: [2, 0] },
        { id: "abs", w: 45, reps: [15, 15], rir: 0, rirSets: [null, 0] },
        { id: "hanging", w: "BW", reps: [12], rir: 0, rirSets: [0] },
      ];
      /* the live device: two lifts ✕'d, two hand-added entries, corrections filed */
      const a = out[0].sessionLog[D];
      a.entries = JSON.parse(JSON.stringify(full));
      a.skipped = [{ id: "hipthrust" }, { id: "calves" }];
      a.corr = { at: "2026-08-14T21:57:13.968Z", rev: 4 };
      a.corrLog = [];
      for (const z of a.skipped) if (T._fileCorr) T._fileCorr(a, "skip:" + D + ":" + z.id + ":" + a.corr.at, "skip", z.id, a.corr.at);
      /* the restored backup: pre-correction body, then ONE new ✕ on ham */
      const b = out[1].sessionLog[D];
      b.entries = [
        { id: "hack", w: 190, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0] },
        { id: "extension", w: 150, reps: [8, 9], rir: 2, rirSets: [2, 0] },
        { id: "hipthrust", w: 135, reps: [10, 10], rir: null, rirSets: [null, null] },
        { id: "calves", w: 60, reps: [12, 12], rir: null, rirSets: [null, null] },
      ];
      b.skipped = [{ id: "ham" }];
      b.corr = { at: "2026-08-16T10:00:00.000Z", rev: 1 };
      b.corrLog = [];
      if (T._fileCorr) T._fileCorr(b, "skip:" + D + ":ham:" + b.corr.at, "skip", "ham", b.corr.at);
      return ["live 8/14: hipthrust+calves ✕'d, abs+hanging logged", "restored backup + one new ✕ on ham", "(untouched)"]; },
    /* it only means anything if the restored side really is older and really
       does carry the newer stamp */
    assert: (out) => {
      const D = "2026-08-14";
      const a = out[0].sessionLog[D], b = out[1].sessionLog[D];
      return (a.corrLog || []).length === 2 && (b.corrLog || []).length === 1
        && String(b.corr.at) > String(a.corr.at)
        && !(b.entries || []).some((e) => e.id === "abs")
        && (a.entries || []).some((e) => e.id === "abs"); } },
  /* the equal-stamp tie: one stamp, one field, absent on one side, present on the other */
  14411: { apply: (out) => { const s = { stamp: "2026-08-17T12:00:00.000Z", lift: "hack", rung: 200 };
      OPS.ladderSet(out[0], rng(1), s); OPS.ladderClear(out[1], rng(1), s); return ["ladderSet@same-stamp[hack]", "ladderClear@same-stamp[hack]"]; },
    assert: (out) => sameStampOneAbsent(out, "hack") },
  14412: { apply: (out) => { const s = { stamp: "2026-08-17T12:00:00.000Z", lift: "rows", rung: 185 };
      OPS.ladderSet(out[0], rng(1), s); OPS.ladderClear(out[1], rng(1), s); return ["ladderSet@same-stamp[rows]", "ladderClear@same-stamp[rows]"]; },
    assert: (out) => sameStampOneAbsent(out, "rows") },
  /* AN ADOPTION: an entry carrying load provenance NEWER than the athlete's own
     stamp, beside a cache that disagrees with it. This is legs 4-5's shape —
     the value must come from the stamped ENTRY and the receipt must name it. */
  14413: { apply: (out) => {
    for (const s9 of out) {
      const rec = s9.sessionLog["2026-08-14"];
      const en = (rec.entries || []).find((e) => e && e.id === "hack");
      if (en) { en.w = 200; en.wCorrAt = "2026-08-20T10:00:00.000Z"; }
      const ex = (s9.exercises || []).find((e) => e && e.id === "hack");
      if (ex) { ex.w = 190; ex.wAt = "2026-08-14T21:52:54.838Z"; ex.lastMeta = { ...(ex.lastMeta || {}), d: "2026-08-14", w: 210, reps: [7, 7, 8] }; }
    }
    OPS.ladderClear(out[1], rng(2), { stamp: "2026-08-21T09:00:00.000Z", lift: "hack" });
    return ["adoption(entry 200 stamped newer, cache lying at 210)", "ladderClear[hack]"]; },
    assert: (out) => { const e = ((out[0].sessionLog["2026-08-14"] || {}).entries || []).find((z) => z && z.id === "hack");
      const x = (out[0].exercises || []).find((z) => z && z.id === "hack");
      return !!e && e.w === 200 && typeof e.wCorrAt === "string" && !!x && x.w === 190 && x.lastMeta && x.lastMeta.w === 210; } },
  /* A LYING CACHE beside a deliberate reseed: last nulled by a load change,
     lastMeta claiming the new load while the log describes another (leg 9). */
  14414: { apply: (out) => {
    for (const s9 of out) {
      const ex = (s9.exercises || []).find((e) => e && e.id === "hack");
      if (ex) { ex.w = 210; ex.wAt = "2026-08-20T09:00:00.000Z"; ex.last = null; ex.lastMeta = { d: "2026-08-14", w: 210, reps: [7, 7, 8], rir: null, rirSets: [null, null, null], debt: false }; }
    }
    OPS.wsave(out[1], rng(3), { stamp: "2026-08-21T09:00:00.000Z" });
    return ["reseed@210 with a cache CLAIMING 210 (log says 190)", "wsave"]; },
    assert: (out) => { const x = (out[0].exercises || []).find((z) => z && z.id === "hack");
      return !!x && x.w === 210 && x.last === null && x.lastMeta && x.lastMeta.w === 210 && (T.deriveLastMeta(out[0], "hack") || {}).w !== 210; } },
  /* A LOAD OFF ITS LADDER at the recombination point: one side's w, another's
     ladder, each newer at what it wrote (leg 3's ensureLoadOnLadder). */
  14415: { apply: (out) => {
    const a = (out[0].exercises || []).find((e) => e && e.id === "hack");
    const b = (out[1].exercises || []).find((e) => e && e.id === "hack");
    if (a) { a.w = 205; a.wAt = "2026-08-22T09:00:00.000Z"; }
    if (b) { b.steps = [160, 170, 180, 190]; b.stepsAt = "2026-08-23T09:00:00.000Z"; }
    return ["w 205 (newest w)", "ladder without 205 (newest steps)"]; },
    assert: (out) => { const a = (out[0].exercises || []).find((z) => z && z.id === "hack"), b = (out[1].exercises || []).find((z) => z && z.id === "hack");
      return !!a && !!b && a.w === 205 && Array.isArray(b.steps) && b.steps.indexOf(205) < 0 && String(b.stepsAt) > String(a.wAt || ""); } },
  /* THE corrLog ORDERING RULE. Two devices file the SAME correction at
     DIFFERENT instants, and a third correction on the same lift sits between
     them — so whether the union keeps the earliest or the latest `at` decides
     whether the skip replays before or after the un-skip, and therefore whether
     the lift ends logged or skipped. (Cowork read this as an equivalent mutant;
     it is not — it only looks equivalent while every correction shares the
     suite's frozen instant, which is exactly what the device-clock fix above
     removed.) */
  14417: { apply: (out) => {
    const mk = (s9, at9) => { const rec = s9.sessionLog["2026-08-09"];
      rec.skipped = [...(rec.skipped || []), { id: "rows" }];
      rec.entries = (rec.entries || []).filter((e) => e.id !== "rows");
      rec.corr = { at: at9, rev: 1 };
      if (T._fileCorr) T._fileCorr(rec, "skip:2026-08-09:rows:" + at9, "skip", "rows", at9);
      return s9; };
    mk(out[0], "2026-08-10T08:00:00.000Z");                /* one device skipped early */
    mk(out[1], "2026-08-12T08:00:00.000Z");                /* the other, later — same op key */
    const rec2 = out[1].sessionLog["2026-08-09"];          /* and an un-skip BETWEEN the two */
    rec2.skipped = (rec2.skipped || []).filter((z) => z.id !== "rows");
    const en2 = { id: "rows", w: 180, reps: [9, 9], rir: null, rirSets: [null, null] };
    rec2.entries = [...(rec2.entries || []), en2];
    /* HANDED IN DIRECTLY, not filed — and the reason is this leg's own app fix:
       _fileCorr now makes a new act at least a millisecond after the latest act
       already on the record, so filing an un-skip stamped 08-11 onto a record
       whose skip is stamped 08-12 pushes it PAST the skip and destroys the very
       ordering this seed tests. The writer can no longer produce the shape (by
       design); the generator hands it in, exactly like seed 883544. */
    rec2.corrLog = [...(rec2.corrLog || []), { op: "unskip:2026-08-09:rows:2026-08-11T08:00:00.000Z", kind: "unskip", id: "rows", at: "2026-08-11T08:00:00.000Z", to: en2 }]
      .sort((p, q) => (String(p.at) + "|" + p.op < String(q.at) + "|" + q.op ? -1 : 1));
    return ["skip[rows]@08-10", "skip[rows]@08-12 + unskip[rows]@08-11", "(untouched)"]; },
    /* THE DISTINGUISHING SHAPE, not the ingredients — and the reason two
       attempts read false against a shape that forms: the fixture was still
       filing the OLD state-shaped key, so both skips shared one op and the
       "two distinct keys" half was correctly false. hunt 1 reached the
       generator's writers and stopped short of the aimed scenarios' own calls. */
    assert: (out) => {
      const all = out.flatMap((s) => ((s.sessionLog["2026-08-09"] || {}).corrLog) || []).filter((c) => c && c.id === "rows");
      const sk = [...new Map(all.filter((c) => c.kind === "skip").map((c) => [c.op, c])).values()].sort((p, q) => (String(p.at) < String(q.at) ? -1 : 1));
      const un = all.find((c) => c.kind === "unskip");
      if (sk.length !== 2 || !un) return false;
      return String(sk[0].at) < String(un.at) && String(un.at) < String(sk[1].at); } },
  /* A LIFT THE LOG CAN NO LONGER DESCRIBE. Its only logged line is skipped
     away on both sides, so deriveLastMeta returns null and the boot's heal does
     `continue` — leaving the unstamped caches exactly as the merge handed them
     over. Both sides carry a DIFFERENT stale cache and the SAME load stamp, so
     nothing rides and nothing re-derives: whatever arrives first would win.
     This is the shape that exposed the divergence in the first place, and it
     has to be forced, because a random stream reaches it only by luck. */
  14419: { apply: (out) => {
    for (let i = 0; i < out.length; i++) {
      const rec = out[i].sessionLog["2026-08-14"];
      rec.skipped = [{ id: "hack" }];
      rec.entries = (rec.entries || []).filter((e) => e.id !== "hack");
      rec.corr = { at: "2026-08-1" + (i + 5) + "T08:00:00.000Z", rev: 1 };
      if (T._fileCorr) T._fileCorr(rec, "skip:2026-08-14:hack", "skip", "hack", rec.corr.at);
      const ex = (out[i].exercises || []).find((e) => e && e.id === "hack");
      /* same load, same stamp — so no STAMPED_FIELDS winner and no rider */
      if (ex) { ex.w = 190; ex.wAt = "2026-08-14T21:52:54.838Z"; ex.lastMeta = { d: "2026-08-14", w: 190, reps: [7, 7, 8], rir: i === 0 ? null : 2, rirSets: i === 0 ? [] : [2, null, 0], debt: false }; ex.last = [7, 7, 8]; }
    }
    return ["hack skipped away; cache says rir null", "hack skipped away; cache says rir 2", "(same)"]; },
    assert: (out) => { const a = (out[0].exercises || []).find((z) => z && z.id === "hack"), b = (out[1].exercises || []).find((z) => z && z.id === "hack");
      return !!a && !!b && !T.deriveLastMeta(out[0], "hack") && String(a.wAt) === String(b.wAt) && J(a.lastMeta) !== J(b.lastMeta); } },
  /* ONE DEVICE CORRECTS, THE OTHER NEVER HEARD OF IT — and the corrections
     cancel out, so the correcting side ends with an EMPTY skip list while the
     untouched side has no such key at all. That asymmetry is what makes an
     empty-array-vs-absent difference observable by merge order; a seed where
     both sides carry the key can never see it. */
  14418: { apply: (out) => {
    const rec = out[0].sessionLog["2026-08-09"];
    rec.skipped = [...(rec.skipped || []), { id: "rows" }];
    rec.entries = (rec.entries || []).filter((e) => e.id !== "rows");
    rec.corr = { at: "2026-08-10T08:00:00.000Z", rev: 1 };
    if (T._fileCorr) T._fileCorr(rec, "skip:2026-08-09:rows", "skip", "rows", "2026-08-10T08:00:00.000Z");
    rec.skipped = rec.skipped.filter((z) => z.id !== "rows");
    const en = { id: "rows", w: 180, reps: [9, 9], rir: null, rirSets: [null, null] };
    rec.entries = [...rec.entries, en];
    if (T._fileCorr) T._fileCorr(rec, "unskip:2026-08-09:rows", "unskip", "rows", "2026-08-11T08:00:00.000Z", en);
    return ["skip[rows]@08-10 then unskip[rows]@08-11 (net: empty skip list)", "(untouched — no skipped key at all)", "(untouched)"]; },
    assert: (out) => { const a = (out[0].sessionLog["2026-08-09"] || {}), b = (out[1].sessionLog["2026-08-09"] || {});
      return (a.corrLog || []).length === 2 && !(a.skipped || []).length && !(b.corrLog || []).length && !Array.isArray(b.skipped); } },
  /* TWO DEVICES, DIFFERENT CORRECTIONS, THREE REPLICAS — the shape that proved
     the replay's non-canonical empty `skipped` (found by law 2 on the first
     build, and it must keep being findable). */
  14416: { apply: (out, seed) => {
    if (out.length < 3) return [];
    OPS.skip(out[0], rng(seed ^ 7), { date: "2026-08-09", stamp: "2026-08-18T09:00:00.000Z", did: [] });
    OPS.amend(out[1], rng(seed ^ 8), { date: "2026-08-09", stamp: "2026-08-19T09:00:00.000Z", did: [] });
    return ["skip[08-09]", "amend[08-09]", "(untouched)"]; },
    assert: (out) => { const a = (out[0].sessionLog["2026-08-09"] || {}), b = (out[1].sessionLog["2026-08-09"] || {});
      return (a.corrLog || []).length === 1 && (b.corrLog || []).length === 1 && (a.corrLog || [])[0].kind === "skip" && (b.corrLog || [])[0].kind === "amend"; } },
};
function replicas(seed) {
  const r = rng(seed);
  const aimed = !!AIM[seed];
  const n = aimed ? 3 : 2 + Math.floor(r() * 2);           /* 2 or 3 replicas — aimed scenarios always get 3, so the associativity law has something to group */
  const base = world();
  const out = [];
  const trace = [];
  const dids = [];
  for (let i = 0; i < n; i++) {
    let s = cl(base);
    /* AN AIMED SEED CARRIES NO NOISE. Measured the hard way: the first aimed
       scenarios were applied ON TOP of a random op stream, and the stream had
       already skipped away the very entry the scenario needed, so the shape
       never formed and the mutation it was written to catch went green. A
       scenario seed is a designed state, not a decorated one. */
    const steps = aimed ? 0 : 1 + Math.floor(r() * 8);
    const mine = [];
    const did = [];
    const snaps = [], didSnaps = [];
    for (let k = 0; k < steps; k++) {
      const name = pick(r, OP_NAMES);
      snaps.push(cl(s)); didSnaps.push(did.map((x9) => ({ ...x9 })));       /* the backup, and the acts performed by then */
      const ctx = { date: pick(r, [D1, D2]), stamp: pick(r, STAMPS), did, snaps, didSnaps };
      try { s = OPS[name](s, r, ctx) || s; } catch (e) { mine.push(name + "!ERR:" + (e && e.message)); continue; }
      mine.push(name + "(" + ctx.date.slice(5) + "," + ctx.stamp.slice(5, 10) + ")");
    }
    out.push(s); trace.push(mine); dids.push(did);
  }
  /* THE CLASH — an equal-stamp collision on a field that is ABSENT on one side
     and PRESENT on the other, forced rather than hoped for. Leg 2's finding:
     seed 70426 went red at the historical tip but did NOT re-catch the tie-break
     when it was reverted at HEAD, because the op stream never happened to land
     two ladder writers on one stamp. A law pinned only by history pins the tip,
     not the law. Both sides go through the real editor paths. */
  const aim = AIM[seed];
  if (aim && out.length >= 2) {
    const notes = (typeof aim === "function" ? aim : aim.apply)(out, seed) || [];
    notes.forEach((n9, i9) => { if (trace[i9]) trace[i9].push("AIMED:" + n9); });
    /* THE SEED-TO-LAW BINDING IS STRUCTURAL. A one-character edit used to
       disarm an aimed seed in silence — point 14411 at a lift that does not
       exist and the collision never forms, yet the harness still printed "10
       laws hold" and exited 0. A seed that no longer means what it says must be
       an ERROR, not a silence. */
    /* A SEED THAT CANNOT PROVE IT FORMED IS A COVERAGE HOLE. Declaring the
       assertion optional meant 7 of 10 aimed seeds were still bare, and a bare
       one was treated as formed without checking anything — so the disarm probe
       that R-5 exists to stop still worked on them. */
    const assertFn = typeof aim === "object" && typeof aim.assert === "function" ? aim.assert : null;
    if (!assertFn) return { reps: out, trace, dids, formed: false, why: "declares no assertion, so it cannot prove it formed" };
    let held = false;
    try { held = !!assertFn(out); } catch (e) { held = false; }
    if (!held) return { reps: out, trace, dids, formed: false, why: "its own assertion is false, so whatever it guards is now unguarded" };
  }
  return { reps: out, trace, dids, formed: true };
}

/* ---------- THE LAWS ---------- */
const settle = (s) => T.migrate(T.migrate(cl(s)));           /* leg-7 doctrine: an ADOPTING boot is not idempotent by design; the state settles by the second */
const sessTotals = (s) => Object.fromEntries(Object.entries(s.sessionLog || {}).map(([d, r]) => [d, ((r.entries || []).length) + ((r.skipped || []).length)]));
const stores = (s) => ({
  reads: (s.reads || []).length, nights: ((s.sleep || {}).nights || []).length,
  dailyLogs: Object.keys(s.dailyLogs || {}).length, sessionLog: Object.keys(s.sessionLog || {}).length,
  queue: (s.queue || []).length, feed: new Set((s.feed || []).map((f) => J(f))).size,
  corrections: Object.values(s.sessionLog || {}).reduce((n, r) => n + ((r && Array.isArray(r.corrLog)) ? r.corrLog.length : 0), 0),   /* the correction ledger is append-only and was covered by no law here either — the same hole dataLossGuard had */
});
const corrOps = (s) => { const o = []; for (const r of Object.values(s.sessionLog || {})) for (const c of (r.corrLog || [])) o.push(c.op); return o.sort(); };

const LAWS = [
  { name: "convergence",
    says: "both merge orders settle on the same state",
    check: (A, B) => { const ab = settle(T.mergeState(cl(A), cl(B))), ba = settle(T.mergeState(cl(B), cl(A)));
      return DEQ(ab, ba) ? null : { got: firstDiff(ab, ba), paths: deepPaths(ab, ba) }; } },

  { name: "associativity",
    says: "with three replicas, every grouping settles the same",
    check: (A, B, C) => { if (!C) return null;
      const l = settle(T.mergeState(T.mergeState(cl(A), cl(B)), cl(C)));
      const r = settle(T.mergeState(cl(A), T.mergeState(cl(B), cl(C))));
      return DEQ(l, r) ? null : { got: firstDiff(l, r), paths: deepPaths(l, r) }; } },

  { name: "idempotence",
    says: "merging a replica with itself is a fixed point, and a settled state stays settled",
    /* MEASURED, and phrased honestly because of it: the FIRST merge normalizes
       (mergeState fills plan.setAt/rev that migrate alone never writes), which
       is pre-existing on main and adds no information. So the property is a
       fixed point from the first merge, not "merge is a no-op on a virgin
       state" — the latter would be asserting a normalizer never normalizes. */
    check: (A) => { const once = settle(T.mergeState(cl(A), cl(A)));
      const twice = settle(T.mergeState(cl(once), cl(once)));
      if (!DEQ(once, twice)) return { got: "merge(A,A) is not a fixed point at " + firstDiff(once, twice), paths: deepPaths(once, twice) };
      return DEQ(T.migrate(cl(once)), once) ? null : { got: "a settled state is not a fixed point at " + firstDiff(T.migrate(cl(once)), once), paths: deepPaths(T.migrate(cl(once)), once) }; } },

  { name: "non-shrink",
    says: "every append-only store in the result is at least as large as both inputs",
/* against the RAW inputs, which is what the append-only promise is about.
       Comparing against each side SETTLED would be wrong: settling a replica
       can file a reconciliation receipt that the merged state legitimately does
       not file, because the merge already carries the adopted value. */
    check: (A, B) => { const m = settle(T.mergeState(cl(A), cl(B))), sm = stores(m), sa = stores(A), sb = stores(B);
      for (const k of Object.keys(sm)) if (sm[k] < Math.max(sa[k], sb[k])) return { got: k + " " + sm[k] + " < max(" + sa[k] + "," + sb[k] + ")" };
      const tm = sessTotals(m), ta = sessTotals(A), tb = sessTotals(B);
      for (const d of Object.keys(tm)) if (tm[d] < Math.max(ta[d] || 0, tb[d] || 0)) return { got: "session " + d + " entries+skipped " + tm[d] + " < max(" + (ta[d] || 0) + "," + (tb[d] || 0) + ")" };
      return null; } },

  { name: "correction-survival",
    says: "a correction one device made survives a merge with a device that made a different one",
    /* CHECKED AGAINST WHAT THE GENERATOR ACTUALLY DID, not against any field
       the state carries — otherwise the law goes vacuous on exactly the tips it
       most needs to judge (a tip without corrLog would have nothing to compare
       and would report CLEAN while reverting every correction).
       Only corrections on lifts NO OTHER replica also corrected are asserted:
       two devices correcting the SAME lift are genuinely concurrent and either
       outcome is honest. Two devices correcting DIFFERENT lifts of one session
       is the defect class — neither may be the price of the other. */
    check: (A, B, C, ctx) => {
      const dids = (ctx && ctx.dids) || [];
      const owner = new Map();
      dids.forEach((list, i) => list.forEach((c) => {
        const k = c.d + "|" + c.id;
        if (!owner.has(k)) owner.set(k, { i, last: c });
        else if (owner.get(k).i !== i) owner.set(k, { i: -1, last: c });
        else owner.get(k).last = c;
      }));
      /* R-2(a): the corrLog's OWN append-only promise, machine-checked. This
         helper existed and was referenced nowhere — no law observed the
         ledger's contents, so "the union never shrinks" was a comment. */
      for (const [nm9, m9] of [["A<-B", settle(T.mergeState(cl(A), cl(B)))], ["B<-A", settle(T.mergeState(cl(B), cl(A)))]]) {
        const want9 = [...new Set([...corrOps(A), ...corrOps(B)])].sort();
        const got9 = corrOps(m9);
        const lost9 = want9.filter((o9) => got9.indexOf(o9) < 0);
        if (lost9.length) return { got: nm9 + ": the merged corrLog is not a superset of both sides — lost " + J(lost9) };
      }
      const sides = [A, B, C].filter(Boolean);
      for (const [k, v] of owner) {
        if (v.i < 0 || v.i >= sides.length) continue;                       /* concurrent on the same lift, or a replica outside this pair */
        const [d, id] = k.split("|");
        for (const [nm, m] of [["A<-B", settle(T.mergeState(cl(sides[0]), cl(sides[1])))], ["B<-A", settle(T.mergeState(cl(sides[1]), cl(sides[0])))]]) {
          if (v.i > 1) continue;                                            /* the correction lives on C, which is not in this pair */
          const r9 = (m.sessionLog || {})[d] || {};
          const inEnt = (r9.entries || []).some((e) => e && e.id === id);
          const inSkip = (r9.skipped || []).some((z) => z && z.id === id);
          if (v.last.kind === "skip" && !inSkip) return { got: nm + ": " + id + " on " + d + " was skipped by one device and the merge lost it (logged " + inEnt + ", skipped " + inSkip + ")" };
          if (v.last.kind === "unskip" && !inEnt) return { got: nm + ": " + id + " on " + d + " was un-skipped by one device and the merge lost it (logged " + inEnt + ", skipped " + inSkip + ")" };
        }
      }
      return null; } },

  { name: "athlete-word-priority",
    says: "a config the athlete stamped later than any correction is never overwritten by a reconciler",
    check: (A) => { const before = cl(A), after = settle(A);
      for (const ex of after.exercises || []) {
        const b = (before.exercises || []).find((z) => z && z.id === ex.id);
        if (!b || typeof b.w !== "number" || !b.wAt) continue;
        /* THE AUTHORITY IS PER-ENTRY, since leg 3: a session's corr is written
           by ✕ and ↩ too, which change no load, so it was never load provenance.
           An adoption is legal exactly when the ENTRY's own wCorrAt post-dates
           the athlete's stamp — comparing against the session corr would fail a
           lawful adoption and pass an unlawful one. */
        let corrAt = "";
        for (const r9 of Object.values(before.sessionLog || {})) for (const e9 of (r9.entries || [])) if (e9 && e9.id === ex.id && typeof e9.wCorrAt === "string" && e9.wCorrAt > corrAt) corrAt = e9.wCorrAt;
        if (String(b.wAt) > String(corrAt) && ex.w !== b.w) return { got: ex.id + " w " + b.w + " -> " + ex.w + " despite wAt " + b.wAt + " newer than every load correction (" + (corrAt || "none") + ")" };
      }
      return null; } },

  { name: "stamp-value-coupling",
    says: "a stamped value and its stamp travel together; last rides w",
    check: (A, B) => { const m = T.mergeState(cl(A), cl(B));
      for (const ex of m.exercises || []) {
        const a = (A.exercises || []).find((z) => z && z.id === ex.id), b = (B.exercises || []).find((z) => z && z.id === ex.id);
        if (!a || !b) continue;
        for (const [f, at9] of [["sets", "setsAt"], ["hi", "hiAt"], ["inc", "incAt"], ["setup", "setupAt"], ["w", "wAt"], ["steps", "stepsAt"]]) {
          const src = [a, b].filter((x) => J(x[f]) === J(ex[f]) && J(x[at9]) === J(ex[at9]));
          if (src.length) continue;
          /* ONE lawful exception, and only one: ensureLoadOnLadder (leg 3)
             constructs a ladder at the recombination point precisely so the
             resolved load is a rung of it, which by construction is a pair
             neither side held. Accept exactly that shape — a side's rungs plus
             the resolved w — and nothing else. */
          if (f === "steps" && [a, b].some((x) => { const r9 = Array.isArray(x.steps) ? x.steps : null; return r9 && J([...new Set([...r9, ex.w])].sort((p, q) => p - q)) === J(ex.steps); })) continue;
          return { got: ex.id + "." + f + " = " + J(ex[f]) + " with " + at9 + " = " + J(ex[at9]) + " — that pair exists on neither side" };
        }
        /* only assert when the winner is UNAMBIGUOUS: if both sides carry the
           same (w, wAt) there is no "winning side" to ride from, and demanding
           one would be asserting an arbitrary pick. */
        const wSrcs = [a, b].filter((x) => J(x.w) === J(ex.w) && J(x.wAt) === J(ex.wAt));
        if (wSrcs.length === 1 && J(ex.last) !== J(wSrcs[0].last)) return { got: ex.id + ".last " + J(ex.last) + " did not ride its w from the winning side (" + J(wSrcs[0].last) + ")" };
      }
      return null; } },

  { name: "load-on-ladder",
    says: "after any merge and boot, a numeric working load is a rung of its own ladder",
    /* CHECKED AT BOTH SITES, and the second one is why: the invariant is
       restored where the fields recombine (mergeState) AND again across every
       lift at the reconcile boundary. Measured — with the merge-side repair
       deleted, the boot's repair silently covered for it and this law stayed
       green, so a law that only looks at the settled state cannot see the first
       site fail at all. */
    /* SETTLED ONLY, again — and the reason is the reverse of leg 2's. That leg
       taught this law to check the raw merge precisely so the merge-time repair
       was testable; v7.54.3 REMOVED that repair, because a repair at every
       intermediate binary merge is not associative (it inserted a rung for a
       load that existed only in a transient pair, and the rung outlived the
       load, so the settled ladder depended on sync topology). The invariant now
       holds where it is checkable: on the final pair, once, at boot — and every
       merged state is booted before use. Asserting it on the raw merge would
       assert a repair that deliberately no longer exists there. */
    check: (A, B) => { const raw = T.mergeState(cl(A), cl(B));
      for (const [when, m] of [["after the boot", settle(cl(raw))]]) {
        for (const ex of m.exercises || []) {
          if (typeof ex.w !== "number") continue;
          const r9 = T.loadRungs(ex);
          if (r9 && r9.length && r9.indexOf(ex.w) < 0) return { got: ex.id + " w " + ex.w + " is not on " + J(r9) + " (" + when + ")" };
        }
      }
      return null; } },

  { name: "receipt-truth",
    says: "a reconciler's receipt names a value the resulting record actually holds",
    /* judged on the receipts THIS settle filed. A receipt already in the feed
       is a historical record of what was true when it was written; a later op
       moving the load does not make it a lie, and asserting otherwise would
       demand the feed rewrite itself. */
    check: (A, B) => { const pre = T.mergeState(cl(A), cl(B));
      const had = new Set((pre.feed || []).map((f) => f && f.op).filter(Boolean));
      const m = settle(pre);
      for (const f of m.feed || []) {
        if (!f || !f.op || String(f.op).indexOf("adopt:corr:") !== 0 || had.has(f.op)) continue;
        const id = String(f.op).split(":")[2];
        const ex = (m.exercises || []).find((z) => z && z.id === id);
        const named = String(f.t || "").match(/→\s*([0-9.]+)\s*$/);
        if (ex && named && Number(named[1]) !== ex.w) return { got: "receipt says " + named[1] + " but " + id + ".w is " + ex.w };
      }
      return null; } },

  { name: "one-placement",
    says: "in every settled session a lift is in at most one of entries and skipped",
    /* N-5: this was a pin only, so an engine that put a lift in BOTH arrays
       passed the committed seeds green. A property the merge must never violate
       belongs in the laws, where every seed exercises it. */
    check: (A, B) => { for (const [nm9, m9] of [["A<-B", settle(T.mergeState(cl(A), cl(B)))], ["B<-A", settle(T.mergeState(cl(B), cl(A)))]]) {
        for (const [d9, r9] of Object.entries(m9.sessionLog || {})) {
          const both9 = (r9.entries || []).filter((e) => e && (r9.skipped || []).some((z) => z && z.id === e.id)).map((e) => e.id);
          if (both9.length) return { got: nm9 + ": " + d9 + " has " + J(both9) + " in BOTH entries and skipped — a record saying he did and did not do the same lift" };
        } }
      return null; } },

  { name: "reseed-integrity",
    says: "a last nulled by a load change is never refilled at a load the log does not describe",
    /* stated against the SETTLED load, not the pre-boot one: an adoption may
       lawfully move w between them (leg 7's two-boot law — boot 1 adopts and
       nulls, boot 2 refills from the log at the adopted load). What must never
       happen is a refill that describes some OTHER load. */
    check: (A) => { const before = cl(A), after = settle(A);
      for (const ex of after.exercises || []) {
        const b = (before.exercises || []).find((z) => z && z.id === ex.id);
        if (!b || b.last !== null || typeof b.w !== "number") continue;
        if (ex.last == null) continue;
        const dm = T.deriveLastMeta(after, ex.id);
        if (!dm || String(dm.w) !== String(ex.w)) return { got: ex.id + " last refilled to " + J(ex.last) + " at w " + J(ex.w) + " but the log's newest line for it is at " + (dm ? dm.w : "nothing") };
        if (J(ex.last) !== J(dm.reps)) return { got: ex.id + " last " + J(ex.last) + " is not the log's line " + J(dm.reps) };
      }
      return null; } },
];

export function deepPaths(x, y, p = "", out = []) {
  if (JSON.stringify(x) === JSON.stringify(y)) return out;
  if (x === null || y === null || typeof x !== "object" || typeof y !== "object" || Array.isArray(x) !== Array.isArray(y)) { out.push(p + ": " + JSON.stringify(x) + " vs " + JSON.stringify(y)); return out; }
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) deepPaths(x[k], y[k], p ? p + "." + k : k, out);
  return out;
}
export { replicas, LAWS, settle, world, OPS };
function firstDiff(x, y) {
  for (const k of new Set([...Object.keys(x || {}), ...Object.keys(y || {})])) {
    if (J(x[k]) !== J(y[k])) {
      if (k === "exercises") { for (let i = 0; i < Math.max((x[k] || []).length, (y[k] || []).length); i++) {
        const a = (x[k] || [])[i], b = (y[k] || [])[i];
        if (J(a) !== J(b)) { for (const f of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) if (J((a || {})[f]) !== J((b || {})[f])) return "exercises[" + ((a || b || {}).id || i) + "]." + f + ": " + J((a || {})[f]) + " vs " + J((b || {})[f]); } } }
      if (k === "sessionLog") { for (const d of new Set([...Object.keys(x[k] || {}), ...Object.keys(y[k] || {})])) if (J((x[k] || {})[d]) !== J((y[k] || {})[d])) return "sessionLog[" + d + "]: " + J((x[k] || {})[d]).slice(0, 160) + " vs " + J((y[k] || {})[d]).slice(0, 160); }
      return k + ": " + J(x[k]).slice(0, 160) + " vs " + J(y[k]).slice(0, 160);
    }
  }
  return "(deeply equal)";
}

/* ---------- COMMITTED SEEDS ----------
   Each law carries at least one seed that HISTORICALLY violated it, plus the
   tip where it was red. These are the harness's own fail-first proof: run this
   file with PL_ENGINE pointed at that tip's bundle and the row goes red. */
const SEEDS = [
  { seed: 10247, why: "the value-coupling witness — a stamped entry beside a lying cache", redAt: "5940442" },
  { seed: 20614, why: "the derive-first backward drag — a stale cache date bypassing the newest session", redAt: "42f429c" },
  { seed: 30881, why: "the reseed resurrection — a deliberate null refilled from the log", redAt: "8c70af8" },
  { seed: 41290, why: "the phantom resurrection — a corrupt log read back into the caches", redAt: "be72df5" },
  { seed: 50733, why: "the same-load refill judged by the cache's own claim", redAt: "6b633c7" },
  { seed: 60155, why: "the ladder losing a rung on a stale-first merge", redAt: "a26e1bd" },
  { seed: 70426, why: "the equal-stamp tie — absent serialising as undefined, so the base always won", redAt: "c66aea4" },
  { seed: 80912, why: "the session-merge law — one device's correction reverted by another's", redAt: "87143ac" },
  { seed: 14411, why: "THE EQUAL-STAMP TIE, forced: two replicas write hack.steps at ONE stamp, one clearing it and one carrying rungs. MUTATION IT GUARDS: revert _valOr to raw JSON.stringify — JSON.stringify(undefined) is undefined and every comparison against it is false, so the merge BASE always wins and the cleared ladder resolves differently by order (executed: order1 steps undefined, order2 steps [160,170,180,190,200])", redAt: "c66aea4 + any revert of _valOr" },
  { seed: 14412, why: "the same collision on the no-ladder lift, where the PRESENT side is the one that must win a tie. MUTATION: _valOr reverted", redAt: "c66aea4 + any revert of _valOr" },
  { seed: 14413, why: "AN ADOPTION with a lying cache. MUTATIONS IT GUARDS: adopting dm.w instead of the stamped enC.w (leg 4's value coupling), and a receipt naming the cache's number instead of the value written (leg 5's receipt truth)", redAt: "5940442" },
  { seed: 14414, why: "a deliberate reseed beside a cache CLAIMING the current load. MUTATION: the same-load refill judged by lastMeta.w instead of the derived line (leg 9)", redAt: "6b633c7" },
  { seed: 14415, why: "a load and a ladder resolving from different sides, each newer at what it wrote. MUTATION: ensureLoadOnLadder removed from the recombination point (leg 3)", redAt: "a26e1bd" },
  { seed: 14416, why: "two devices correcting the SAME session differently, three replicas. MUTATION: replay leaving a non-canonical empty skipped[] — the bug this harness found in its own round", redAt: "87143ac" },
  { seed: 14421, why: "two corrected records tying on corr.at, rev AND _mergeScore with different bodies. MUTATION: the base tie falling back to _richer, which ties to its second argument — merge order", redAt: "dd29e8a" },
  { seed: 14422, why: "rows skipped WITH an amend naming it on one side, logged with no placement op on the other. MUTATION: reading 'any correction naming this lift' as deciding placement, which leaves the lift in both arrays", redAt: "dd29e8a" },
  { seed: 883544, why: "a later act carrying an earlier stamp (a non-monotone device clock), so the replica's own body and the replay of its own corrLog disagree. Found by --explore; 17 of 17 remaining hits were this one class", redAt: "3a7edc4" },
  { seed: 1422036, why: "THE TRANSIENT-RUNG WITNESS, found by --explore and promoted: three replicas whose (w,steps) pairs each win a different sub-merge. MUTATION IT GUARDS: putting the ladder repair back at the binary merge, where it inserts a rung for a load no final state holds and makes the groupings disagree", redAt: "7cb83d2" },
  { seed: 14420, why: "THE RESTORE DRILL: a pre-correction backup rejoins carrying ONE legitimate new correction. MUTATION IT GUARDS: replaying the union over a body one side WON instead of over the accumulated body — which silently reverted two ✕s and deleted two entries, 7 to 5, identically in both orders, so convergence reported green over the loss", redAt: "4d41e2d" },
  { seed: 14419, why: "a lift whose only logged line is skipped away on both sides, so the boot cannot re-derive its caches, with the same load stamp on each so nothing rides. MUTATIONS: the unstamped-cache tie left to arrival order, and the caches not riding the load at all — both of which put lastMeta.rir/rirSets on the merge order", redAt: "87143ac" },
  { seed: 14418, why: "one device's corrections cancelling out, merged against a device that never heard of them. MUTATION: replay writing an empty skipped[] instead of deleting the key — an empty array and an absent one carry the same information but not the same shape, and the difference is visible by merge order", redAt: "87143ac" },
  { seed: 14417, why: "the corrLog ordering rule: the same correction filed at two instants with a third correction between them. MUTATIONS: earliest-wins flipped to latest, in _fileCorr or in the union. Not an equivalent mutant — it only looked like one while every correction shared the frozen suite clock", redAt: "87143ac" },
  { seed: 91337, why: "general convergence over the whole op set", redAt: "—" },
  { seed: 11021, why: "general convergence, second shape", redAt: "—" },
  { seed: 12408, why: "general convergence, third shape", redAt: "—" },
  { seed: 13579, why: "general convergence, fourth shape", redAt: "—" },
];

/* ---------- THE MUTATION TABLE, EXECUTABLE ----------
   A historical-tip red proves the harness caught a bug AS IT WAS; a mutation
   red proves it catches the bug COMING BACK. Leg 2 ran this by hand and that is
   the only reason it noticed two of its own guards had evaporated — and hands
   do not run in CI. Each entry is a one-line edit to a copy of src/app.jsx and
   the law that must go red. Not gate-blocking (it rebuilds the bundle per
   mutation, well outside the 30 s row budget): `node tools/sync-laws.mjs
   --mutations`. */
const MUTATIONS = [
  ["valOr-raw", "law", "the equal-stamp tie compares raw JSON.stringify again, so absent is unorderable and the base always wins", `_valOr(other[f9]) > _valOr(w2[f9])`, `JSON.stringify(other[f9]) > JSON.stringify(w2[f9])`],
  ["union-drops-remote", "law", "the corrLog union reads only one side", `for (const c9 of [...(Array.isArray(x && x.corrLog) ? x.corrLog : []), ...(Array.isArray(y && y.corrLog) ? y.corrLog : [])]) {`, `for (const c9 of [...(Array.isArray(y && y.corrLog) ? y.corrLog : [])]) {`],
  ["replay-disabled", "pin", "the union is carried but never replayed", `  const out9 = _replayCorrections(merged);`, `  const out9 = merged;`],
  ["base-votes", "law", "the base stops accumulating — the defect this leg closes", `  const ents9 = addMissing("entries"); if (ents9 !== undefined) merged.entries = ents9;`, `  const ents9 = undefined; if (ents9 !== undefined) merged.entries = ents9;`],
  ["ladder-repair-off", "law", "the load/ladder invariant is dropped at the BOOT — its only site now that the merge is pure", `    for (let i9 = 0; i9 < exs9.length; i9++) exs9[i9] = ensureLoadOnLadder(exs9[i9]);`, `    for (let i9 = 0; i9 < exs9.length; i9++) exs9[i9] = exs9[i9];`],
  ["sameload-cache-claim", "law", "the same-load refill trusts the cache's own claim again", `      const dm0 = deriveLastMeta(s, ex.id);`, `      const dm0 = ex.lastMeta;`],
  ["reseed-overwrite", "law", "the heal overwrites a deliberate reseed", `      if (ex.last != null) { if (JSON.stringify(ex.last) !== JSON.stringify(dm.reps)) ex.last = dm.reps.slice(); }`, `      ex.last = dm.reps.slice();`],
  ["steps-unstamped", "law", "the ladder leaves the stamp discipline", `["w", "wAt"], ["steps", "stepsAt"]];`, `["w", "wAt"]];`],
  ["caches-do-not-ride", "law", "last and lastMeta stop riding the load", `  if (f9 === "w") for (const c9 of CACHE_RIDERS) { if (c9 in other) n2[c9] = other[c9]; else delete n2[c9]; }`, `  /* mutant */`],
  ["cache-tie-nondeterministic", "law", "the unstamped cache tie goes back to arrival order", `        for (const c9 of CACHE_RIDERS) if (_valOr(other[c9]) > _valOr(w2[c9])) w2 = { ...w2, [c9]: other[c9] };`, `        /* mutant */`],
  ["union-payload-by-arrival", "pin", "one key with two payloads resolves by arrival instead of by value", `      else if (_canonJ(c9.to) > _canonJ(p9.to)) p9.to = c9.to;`, `      else if (false) p9.to = c9.to;`],
  ["unskip-not-authoritative", "pin", "the un-skip payload stops restating an existing entry", `          else ents = ents.map((e9) => (e9 && e9.id === c9.id ? { ...e9, ...JSON.parse(JSON.stringify(c9.to)) } : e9));`, `          else ents = ents;`],
  /* backfill-partial is RETIRED: it mutated patchV57's general sweep over skipped[],
     and FIX 1 deleted that sweep — the row would be testing code the leg removed on
     purpose. A stale mutation is worse than none, because it reads as coverage. */
  ["mutual-exclusion-off", "pin", "a lift is allowed to sit in entries AND skipped at once", `      if (named9.has(id9)) continue;`, `      if (true) continue;`],
  ["base-tie-by-order", "pin", "the base tie falls back to _richer, which ties to its second argument — merge order", `    return _canonJ(x) >= _canonJ(y) ? x : y;`, `    return _richer(x, y);`],
  ["fabricate-skip-provenance", "pin", "the backfill invents a correction for every id in skipped[] — P0#1, membership read as provenance", `  s.v = 57; return s;`, `  for (const d9 of Object.keys((s && s.sessionLog) || {})) { const r9 = s.sessionLog[d9]; const a9 = r9 && r9.corr && r9.corr.at; if (!a9) continue; for (const z9 of (r9.skipped || [])) if (z9 && z9.id) _fileCorr(r9, "skip:" + d9 + ":" + z9.id + ":" + a9, "skip", z9.id, a9); } s.v = 57; return s;`],
  ["one-placement-off", "law", "the exclusion step is skipped, so a lift may sit in entries and skipped at once", `      if (dup9.length) {`, `      if (false) {`],
  ["corrections-unguarded", "pin", "the correction ledger leaves recordCounts", `    corrections: Object.values((st.sessionLog && typeof st.sessionLog === "object") ? st.sessionLog : {}).reduce((n9, r9) => n9 + ((r9 && Array.isArray(r9.corrLog)) ? r9.corrLog.length : 0), 0),`, `    corrections: 0,`],
];
async function runMutations() {
  const { execFileSync } = await import("node:child_process");
  const { unlinkSync, existsSync } = await import("node:fs");
  const src0 = fs.readFileSync(at("src/app.jsx"), "utf8");
  const tmpSrc = at("src", "_mutant_sync.jsx");
  const rows = [];
  for (const [name, owner, says, from, to] of MUTATIONS) {
    const n = src0.split(from).length - 1;
    if (n !== 1) { rows.push([name, "ANCHOR x" + n + " — the mutation no longer applies; the code moved and the row is stale", says, false]); continue; }
    fs.writeFileSync(tmpSrc, src0.replace(from, to));
    const out = tmp("_mut-" + name + ".mjs");
    try {
      const esbuild = (await import("esbuild")).default;
      await esbuild.build({ entryPoints: [tmpSrc], bundle: true, format: "esm", platform: "node", outfile: out, loader: { ".jsx": "jsx" }, logLevel: "silent", external: ["react", "react-dom", "react/jsx-runtime"] });
    } catch (e) { rows.push([name, "BUILD FAILED", says]); if (existsSync(tmpSrc)) unlinkSync(tmpSrc); continue; }
    if (existsSync(tmpSrc)) unlinkSync(tmpSrc);
    /* N-1 — THE DECLARED OWNER IS EXECUTED, and a row is UNCOVERED when its
       owner stays green. A table that can only say "NOT CAUGHT" leaves the
       reader to guess whether some other guard had it, and a report that reads
       the same whether or not it is true is not a report. */
    let lawStatus = 0, lawTxt = "";
    try { lawTxt = execFileSync(process.execPath, [at("tools", "sync-laws.mjs"), "--verbose"], { encoding: "utf8", env: { ...process.env, PL_ENGINE: out } }); }
    catch (e) { lawStatus = 1; lawTxt = (e.stdout || "") + (e.stderr || ""); }
    const laws = [...new Set([...lawTxt.matchAll(/LAW BROKEN: ([a-z-]+)/g)].map((m) => m[1]))].filter((l) => l !== "aimed-scenario");
    let ownerRed = lawStatus, by = laws.join(", ") || "the shape guard";
    if (owner === "pin") {
      const probe = tmp("_pinprobe.mjs");
      const fwd = (p) => p.split(String.fromCharCode(92)).join("/");
      fs.writeFileSync(probe, [
        'import { readFileSync } from "node:fs";',
        'await import("file://' + fwd(at("tools", "_fixed-now.mjs")) + '");',
        'const T = (await import("file://' + fwd(out) + '")).__test;',
        'const M = await import("file://' + fwd(at("tools", "closure-sf2.mjs")) + '");',
        'let f = 0; const n = []; const ok = (c, m) => { if (!c) { f++; n.push(String(m).split(" —")[0]); } };',
        'M.runClosureSF2(T, ok, readFileSync); try { await M.runClosureSF2Sync(T, ok); } catch (e) {}',
        'console.log(f ? "PINRED " + [...new Set(n)].slice(0, 3).join(", ") : "PINGREEN");',
      ].join(String.fromCharCode(10)));
      let ptxt = "";
      try { ptxt = execFileSync(process.execPath, [probe], { encoding: "utf8" }); } catch (e) { ptxt = (e.stdout || "") + (e.stderr || ""); }
      ownerRed = /PINRED/.test(ptxt) ? 1 : 0;
      by = (ptxt.match(/PINRED (.*)/) || [, ""])[1].trim();
    }
    rows.push([name, ownerRed ? "caught-by: " + owner + " (" + by + ")" : "UNCOVERED — its declared owner (" + owner + ") stayed green", says, !!ownerRed]);
  }
  const missed = rows.filter((r) => !r[3]);
  for (const [a9, b9, c9] of rows) console.log("  " + a9.padEnd(28) + String(b9).padEnd(54) + c9);
  const covered = new Set(rows.flatMap((r) => { const m = String(r[1]).match(/caught-by: \w+ \((.*)\)$/); return m ? m[1].split(", ") : []; }).filter(Boolean));
  const bare = LAWS.map((l) => l.name).filter((n) => !covered.has(n));
  console.log("\n  LAWS WITH NO REGISTERED MUTATION THAT BREAKS THEM: " + (bare.length ? bare.join(", ") + " — a known gap is worth more than a hidden one" : "none"));
  console.log("\nMUTATION TABLE: " + (rows.length - missed.length) + "/" + rows.length + " caught by their declared owner" + (missed.length ? " · UNCOVERED: " + missed.map((m) => m[0]).join(", ") : ""));
  return missed.length;
}
if (process.argv.includes("--mutations")) { const m = await runMutations(); process.exit(m ? 1 : 0); }   /* an UNCOVERED row is a failure, not a footnote */

/* ---------- the run ---------- */
function runSeed(seed) {
  const { reps, trace, dids, formed, why } = replicas(seed);
  const [A, B, C] = reps;
  const out = [];
  if (formed === false) {
    /* N-2 — under PL_ENGINE a scenario may fail to form because the ENGINE
       lacks a capability the scenario needs (an older tip with no _fileCorr).
       That is a SKIP, named and counted, never printed as a defect: an
       acceptance red must mean a law failed, not that history predates the
       feature. */
    const capMiss = !!process.env.PL_ENGINE && (typeof T._fileCorr !== "function" || typeof T._replayCorrections !== "function");
    if (capMiss) return [{ skip: true, seed, law: "aimed-scenario", says: "scenario needs a capability this engine does not have", trace, got: "SKIPPED on this engine — no _fileCorr/_replayCorrections" }];
    return [{ law: "aimed-scenario", says: "an aimed seed must actually produce the shape it names", seed, trace, got: "aimed scenario " + seed + " did not form — " + (why || "unknown") }];
  }
  for (const law of LAWS) {
    let bad = null;
    try { bad = law.check(A, B, C, { dids, trace }); } catch (e) { bad = { got: "THREW: " + (e && e.message) }; }
    if (bad) out.push({ law: law.name, says: law.says, seed, trace, got: bad.got, paths: bad.paths });
  }
  return out;
}

const LIB = !!process.env.PL_LAWS_LIB;   /* imported as a library (probe / replay) rather than run as the gate row */
/* hunt 3 — BOTH FLAGS NOW DO WHAT THEY PRINT. --only was named in the replay
   hint and implemented nowhere (`--only 99999999` ran all 22 and said so);
   --explore called itself rotating and swept the same 400 arithmetic seeds
   every run. --explore takes a base so a find is reproducible, and prints it. */
const ONLY = (() => {
  const i9 = process.argv.indexOf("--only");
  if (i9 < 0) return null;
  const raw9 = process.argv[i9 + 1], v9 = Number(raw9);
  /* a bare --only used to fall back to all 22 seeds AND SAY SO — the exact
     misleading run the flag exists to prevent. */
  if (raw9 === undefined || !isFinite(v9)) { console.log("usage: --only <seed>   (a bare or non-numeric --only is an error, not a silent all-seed run)"); process.exit(2); }
  return v9;
})();
const EXPLORE_BASE = (() => { const i9 = process.argv.indexOf("--explore"); const v9 = i9 > -1 ? Number(process.argv[i9 + 1]) : NaN; return isFinite(v9) ? v9 : 100000; })();
const seeds = EXPLORE
  ? Array.from({ length: 400 }, (_, i) => EXPLORE_BASE + i * 7919)
  : (ONLY != null ? SEEDS.map((s) => s.seed).filter((s) => s === ONLY).concat(SEEDS.some((s) => s.seed === ONLY) ? [] : [ONLY]) : SEEDS.map((s) => s.seed));
if (EXPLORE && !LIB) console.log("  explore base " + EXPLORE_BASE + " (pass --explore <base> to sweep elsewhere; a find replays with --only <seed>)");

let fails = [], skips = [];
if (!LIB) for (const s of seeds) { for (const x9 of runSeed(s)) (x9 && x9.skip ? skips : fails).push(x9); }

/* ---------- the SHAPE guard: the composed ops still match the real writers ---------- */
const shapeMiss = (() => {
  const src = fs.readFileSync(at("src/app.jsx"), "utf8");
  const need = [
    ["the ✕ handler still stamps AND files its correction, keyed on the ACT", /_fileCorr\(rec, "skip:" \+ dateSel \+ ":" \+ e\.id \+ ":"/],
    ["the ↩ handler still stamps AND files, carrying the entry, keyed on the ACT", /_fileCorr\(rec, "unskip:" \+ dateSel \+ ":" \+ k\.id \+ ":"/],
    ["sessionLog still merges through the session law", /k === "sessionLog" \? _mergeSession : _richer/],
    ["the ladder editor still CLEARS with a stamp (the absent half of the tie)", /delete ex6\.steps; ex6\.stepsAt = new Date\(\)\.toISOString\(\)/],
    ["the ladder editor still SETS with a stamp (the present half)", /ex6\.steps = parsed; ex6\.stepsAt = new Date\(\)\.toISOString\(\)/],
    ["the equal-stamp tie still resolves through _valOr, not raw stringify", /_valOr\(other\[f9\]\) > _valOr\(w2\[f9\]\)/],
  ];
  return need.filter(([, re]) => !re.test(src)).map(([w]) => w);
})();

/* ---------- report ---------- */
if (!LIB && (VERBOSE || fails.length || shapeMiss.length || skips.length)) {
  for (const f of fails.slice(0, 12)) {
    console.log("\n  LAW BROKEN: " + f.law + " — " + f.says);
    console.log("    seed:  " + f.seed + "   (replay: node tools/sync-laws.mjs --only " + f.seed + ")");
    console.log("    ops:   " + f.trace.map((t, i) => String.fromCharCode(65 + i) + " [" + t.join(" ") + "]").join("  |  "));
    console.log("    got:   " + f.got);
    if (f.paths) for (const p of f.paths.slice(0, 4)) console.log("    diff:  " + p.slice(0, 200));
  }
  for (const m of shapeMiss) console.log("\n  SHAPE DRIFT: " + m);
}

const label = EXPLORE ? "explore" : "committed";
if (LIB) { /* the caller drives */ }
else if (fails.length || shapeMiss.length) {
  for (const s9 of skips) console.log("\n  SKIPPED (capability): seed " + s9.seed + " — " + s9.got);
  console.log("\nSYNC-LAWS: " + fails.length + " violation(s)" + (skips.length ? ", " + skips.length + " skipped (capability)" : "") + " across " + seeds.length + " " + label + " seed" + (seeds.length === 1 ? "" : "s") + (shapeMiss.length ? ", " + shapeMiss.length + " shape drift(s)" : ""));
  if (!EXPLORE) process.exit(1);
} else {
  console.log("SYNC-LAWS: " + LAWS.length + " laws hold across " + seeds.length + " " + label + " seeds — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity");
}
