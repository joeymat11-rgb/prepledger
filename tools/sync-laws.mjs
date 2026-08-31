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
    if (T._fileCorr) T._fileCorr(rec, "skip:" + d + ":" + e.id + ":" + ((rec.corr && rec.corr.at) || ""), "skip", e.id, rec.corr && rec.corr.at, undefined, { live: true });   /* the PRODUCTION key shape (src/app.jsx) — testing a key the app no longer writes is testing nothing */
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
    if (T._fileCorr) T._fileCorr(rec, "unskip:" + d + ":" + k.id + ":" + ((rec.corr && rec.corr.at) || ""), "unskip", k.id, rec.corr && rec.corr.at, en, { live: true });
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
    if (T._fileCorr) T._fileCorr(rec, "amend:" + d + ":" + e.id + ":" + ((rec.corr && rec.corr.at) || ""), "amend", e.id, rec.corr && rec.corr.at, [{ id: e.id, w: e.w }], { live: true });
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
  /* SOL'S PASS-2 P0 — CORRECTION-FREE METADATA. Three uncorrected copies of one
     date whose BODIES differ but SCORE equal (same JSON length): case 1 of
     _richerSession picked the base by _mergeScore, so a tie went to the second
     argument (merge order) and, once an intermediate had accumulated two lifts,
     its size won the next base — the NOTE, the at, every non-body field rode
     the grouping. (A+B)+C carried B's note and A+(B+C) carried A's. The body was
     already per-lift and order-free; the record around it was not. */
  14429: { apply: (out) => {
      const mk = (s9, note9, e9) => { s9.sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, note: note9, entries: [e9], skipped: [] }; };
      mk(out[0], "A", { id: "rows", w: 180, reps: [9, 9], rirSets: [1, 0] });
      mk(out[1], "B", { id: "curl", w: 150, reps: [9, 9], rirSets: [1, 0] });      /* the SAME JSON length as rows — a _mergeScore tie */
      if (out[2]) mk(out[2], "A", { id: "rows", w: 180, reps: [9, 9], rirSets: [1, 0] });
      return ["note A · rows", "note B · curl (equal-length body)", "note A · rows"]; },
    assert: (out) => {
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const a = r9(out[0]), b = r9(out[1]), c = r9(out[2] || out[0]);
      return a.note === "A" && b.note === "B" && c.note === "A"
        && J((a.entries || []).map((e) => e.id)) === J(["rows"]) && J((b.entries || []).map((e) => e.id)) === J(["curl"]) && J((c.entries || []).map((e) => e.id)) === J(["rows"])
        && J(a.entries[0]).length === J(b.entries[0]).length                          /* the tie, stated on the INPUTS */
        && [a, b, c].every((r) => !r.corr && !r.corrLog); } },
  /* THE SAME BODY, A DIFFERENT NOTE — the identical-bodies short-circuit returns
     the BASE, and case 1 chose it by size: two equal-length notes resolved by
     merge order, so A<-B said one thing and B<-A the other. */
  14430: { apply: (out) => {
      const mk = (s9, note9) => { s9.sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, note: note9, entries: [{ id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }], skipped: [] }; };
      mk(out[0], "A"); mk(out[1], "B"); if (out[2]) mk(out[2], "A");
      return ["note A", "note B (same body)", "note A"]; },
    assert: (out) => {
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const a = r9(out[0]), b = r9(out[1]);
      return a.note === "A" && b.note === "B" && a.note.length === b.note.length && J(a.entries) === J(b.entries) && J(a.skipped) === J(b.skipped) && !a.corr && !b.corr && !a.corrLog && !b.corrLog; } },
  /* THE CARVE, FIRED ON PURPOSE AND DECLARED. A: a legacy record — corr, NO
     ops (his 8/10 class). B: a plain replica carrying an UNRELATED extra lift.
     The wholesale pick keeps A's body and drops curl; the law allows that here
     ONLY because this seed declares it, and only with the receipt on the record
     and in the feed. */
  14431: { expectsCarve: true, apply: (out) => {
      const rows9 = { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }, curl9 = { id: "curl", w: 50, reps: [12, 12, 9], rir: 2, rirSets: [2, null, null] };
      out[0].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [cl(rows9)], corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 } };
      out[1].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [cl(rows9), cl(curl9)] };
      /* C: a plain replica with a DIFFERENT unrelated extra — the three-way that showed a feed keyed on the ids was not associative (two lines one way, one the other) */
      if (out[2]) out[2].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [cl(rows9), { id: "hack", w: 200, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0] }] };
      return ["legacy corr, no ops · rows", "plain · rows + curl (unrelated extra)", "plain · rows + hack (another unrelated extra)"]; },
    assert: (out) => {
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const a = r9(out[0]), b = r9(out[1]);
      const c = r9(out[2] || out[1]);
      return !!(a.corr && a.corr.at) && !a.corrLog && !b.corr && !b.corrLog && !c.corr && !c.corrLog
        && J((a.entries || []).map((e) => e.id)) === J(["rows"]) && J((b.entries || []).map((e) => e.id)) === J(["rows", "curl"]) && (out[2] ? J((c.entries || []).map((e) => e.id)) === J(["rows", "hack"]) : true)
        && String(a.corr.at) > new Date(b.at).toISOString(); } },                    /* the plain body predates the correction, so the stamped side is the base */
  /* LEGACY vs MODERN. A: corr with no ops. B: a corrLog (an amend on curl) —
     so the union is NOT empty and the carve must NOT fire: both lifts survive.
     A law exemption wider than the production predicate hid a mutant that
     carved here. */
  /* SOL'S PASS-3 P0 — THE EXACT-AUTHORITY TIE. Three LEGACY corrected copies of
     one date (corr, NO ops) with the same corr.at, rev and non-body fields, and
     disjoint single-lift bodies. Nothing but the bodies can decide, and the
     carve keeps ONE whole record: the winner must be a function of the bodies
     — argument position kept rows one way and curl the other. */
  14433: { expectsCarve: true, apply: (out) => {
      const mk = (s9, e9) => { s9.sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [e9], corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 } }; };
      mk(out[0], { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] });
      mk(out[1], { id: "curl", w: 50, reps: [12, 12, 9], rir: 2, rirSets: [2, null, null] });
      if (out[2]) mk(out[2], { id: "hack", w: 200, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0] });
      return ["legacy corr@08-10 rev 1 · rows", "legacy corr@08-10 rev 1 · curl", "legacy corr@08-10 rev 1 · hack"]; },
    assert: (out) => {
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const rs = out.map(r9);
      const meta = (r) => J({ d: r.d, at: r.at, corr: r.corr });
      return rs.every((r) => r.corr && r.corr.at === "2026-08-10T08:00:00.000Z" && r.corr.rev === 1 && !r.corrLog && (r.entries || []).length === 1)
        && new Set(rs.map(meta)).size === 1
        && new Set(rs.map((r) => r.entries[0].id)).size === rs.length; } },
  /* RECEIPT TRUTH — THE LATER PLAIN COPY WINS. A: legacy corr@08-10 · rows.
     B and C: plain copies COMPLETED AFTER the correction (at 08-11), curl and
     hack. The rule that a completion after the correction is the newer word
     stands; the receipt must then say the LATER copy stood, not the corrected
     one (Sol, pass 3: it always said "corrected"). */
  14434: { expectsCarve: true, apply: (out) => {
      out[0].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [{ id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }], corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 } };
      out[1].sessionLog["2026-08-09"] = { d: "2026-08-09", at: Date.parse("2026-08-11T08:00:00.000Z"), entries: [{ id: "curl", w: 50, reps: [12, 12, 9], rir: 2, rirSets: [2, null, null] }] };
      if (out[2]) out[2].sessionLog["2026-08-09"] = { d: "2026-08-09", at: Date.parse("2026-08-11T08:00:00.000Z"), entries: [{ id: "hack", w: 200, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0] }] };
      return ["legacy corr@08-10 · rows", "plain, completed 08-11 (after the correction) · curl", "plain, completed 08-11 · hack"]; },
    assert: (out) => {
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const a = r9(out[0]), b = r9(out[1]);
      return !!(a.corr && a.corr.at) && !a.corrLog && !b.corr && !b.corrLog
        && new Date(b.at).toISOString() > String(a.corr.at)
        && J((a.entries || []).map((e) => e.id)) === J(["rows"]) && J((b.entries || []).map((e) => e.id)) === J(["curl"]); } },
  /* THE FEED'S FIXED POINT — a carve conflict beside a feed line NEWER than the
     session date. The receipt is dated at the session; the feed is newest-first
     by contract; a receipt prepended AFTER the canonical sort sat above the
     newer line and the next merge moved it — merge(m,m) ≠ m (Sol's hunt). */
  /* THE MERGE'S OWN LATE WRITER. reconcileEraTransitions runs at the END of
     mergeState and files the adoptshift line ("HACK — LOGGED AT 200 (plan said
     190)") dated at the lift's wAt — a PAST date — by unshift. With a newer
     line already in the feed the merged feed was not newest-first and the next
     merge moved it: the same fixed-point class as Sol's hunt and CC's v54
     finding, on a writer that predates both. The sort must be the LAST feed
     step of the merge. Found by cowork's probe while generalising the fix. */
  /* SOL'S PASS-4 P0 (A) — THE FULL RETURN. A replica carrying a carve state
     (body [curl], dropped [rows], one receipt naming rows) meets a modern
     replica whose correction RESTORES rows: the record's dropped set empties,
     so the receipt must go with it. The old writer skipped records with no
     dropped set and left the obsolete line standing — and it was false. */
  14437: { apply: (out) => {
      const D9 = "2026-08-09", curl9 = { id: "curl", w: 50, reps: [12, 12, 9], rir: 2, rirSets: [2, null, null] }, rows9 = { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] };
      const line9 = { op: "carve:" + D9, d: D9, ids: ["rows"], kept: "later", t: "MERGE KEPT ONE WHOLE SESSION — " + D9, how: "(the receipt a previous merge wrote)" };
      out[0].sessionLog[D9] = { d: D9, at: 1786311986964, entries: [cl(curl9)], dropped: ["rows"] }; out[0].feed = [cl(line9)];
      out[1].sessionLog[D9] = { d: D9, at: 1786311986964, entries: [cl(rows9), cl(curl9)], corr: { at: "2026-08-12T08:00:00.000Z", rev: 1 }, corrLog: [{ op: "amend:" + D9 + ":rows:2026-08-12T08:00:00.000Z", kind: "amend", id: "rows", at: "2026-08-12T08:00:00.000Z", to: [{ id: "rows", w: 180 }] }] }; out[1].feed = [cl(line9)];
      if (out[2]) { out[2].sessionLog[D9] = cl(out[0].sessionLog[D9]); out[2].feed = [cl(line9)]; }
      return ["carve state: curl · dropped [rows] · receipt [rows]", "modern replica: rows RESTORED by a correction (corrLog) · same stale receipt", "(as A)"]; },
    assert: (out) => { const a = out[0].sessionLog["2026-08-09"] || {}, b = out[1].sessionLog["2026-08-09"] || {};
      return J(a.dropped) === J(["rows"]) && !(a.entries || []).some((e) => e.id === "rows") && (out[0].feed || []).some((f) => f && f.op === "carve:2026-08-09" && J(f.ids) === J(["rows"]))
        && (b.entries || []).some((e) => e.id === "rows") && Array.isArray(b.corrLog) && b.corrLog.some((c) => c && c.id === "rows") && !b.dropped; } },
  /* SOL'S PASS-4 P0 (B) — PARTIAL RETURN + STALE REJOIN. STALE: body [curl],
     dropped [hack, rows], receipt [hack, rows]. CURRENT: body [rows, curl],
     dropped [hack], receipt [hack]. Both plain. The record converged (seen −
     present = [hack]) but the feed did not: the writer trusted the FIRST
     matching line and the op-dedup then kept the stale duplicate by its
     unrelated tie rule — direction-dependent, and merge(m,m) changed it. */
  14438: { apply: (out) => {
      const D9 = "2026-08-09", curl9 = { id: "curl", w: 50, reps: [12, 12, 9], rir: 2, rirSets: [2, null, null] }, rows9 = { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] };
      const mkLine = (ids9) => ({ op: "carve:" + D9, d: D9, ids: ids9, kept: "later", t: "MERGE KEPT ONE WHOLE SESSION — " + D9, how: "(the receipt a previous merge wrote)" });
      out[0].sessionLog[D9] = { d: D9, at: 1786311986964, entries: [cl(curl9)], dropped: ["hack", "rows"] }; out[0].feed = [mkLine(["hack", "rows"])];
      out[1].sessionLog[D9] = { d: D9, at: 1786311986964, entries: [cl(rows9), cl(curl9)], dropped: ["hack"] }; out[1].feed = [mkLine(["hack"])];
      if (out[2]) { out[2].sessionLog[D9] = cl(out[1].sessionLog[D9]); out[2].feed = [mkLine(["hack"])]; }
      return ["STALE: curl · dropped [hack,rows] · receipt [hack,rows]", "CURRENT: rows,curl · dropped [hack] · receipt [hack]", "(as CURRENT)"]; },
    assert: (out) => { const a = out[0].sessionLog["2026-08-09"] || {}, b = out[1].sessionLog["2026-08-09"] || {};
      return J(a.dropped) === J(["hack", "rows"]) && J(b.dropped) === J(["hack"]) && !a.corr && !b.corr && !a.corrLog && !b.corrLog
        && (b.entries || []).some((e) => e.id === "rows") && !(a.entries || []).some((e) => e.id === "rows")
        && J(((out[0].feed || [])[0] || {}).ids) === J(["hack", "rows"]) && J(((out[1].feed || [])[0] || {}).ids) === J(["hack"]); } },
  /* SOL'S PASS-4 HUNT — SAME-DAY LINES. Each replica wrote a DIFFERENT line
     on the same day. _feedSorted keeps arrival order within a day and the
     union put the remote side first, so [B, A] one way and [A, B] the other —
     ordinary concurrent lines, a whole-state convergence failure the suite
     could not form (world() starts with an empty feed; no seed gave two
     replicas distinct same-day lines). */
  /* SOL'S PASS-6 — KEY ORDER IS NOT IDENTITY. MERGE_MULTI keyed the max-multiset
     union on raw JSON.stringify, so a line canonically equal to another but
     carrying its keys in a different order counted as a SECOND identity: two
     copies on A against one canonically-equal copy on B emitted THREE, in the
     feed and in forecasts, and every later merge carried all three. Here A has
     two copies in one key order, B one copy in another, C one copy in a third. */
  14442: { apply: (out) => {
      const L1 = { d: "2026-08-18", t: "MARKER — KEY ORDER", how: "the same line, keys in one order" }, L2 = { how: "the same line, keys in one order", t: "MARKER — KEY ORDER", d: "2026-08-18" }, L3 = { t: "MARKER — KEY ORDER", d: "2026-08-18", how: "the same line, keys in one order" };
      const F1 = { d: "2026-08-17", trend: 163.2, rate: -0.4, pred7: 162.8, sealed: false }, F2 = { sealed: false, pred7: 162.8, rate: -0.4, trend: 163.2, d: "2026-08-17" }, F3 = { pred7: 162.8, d: "2026-08-17", sealed: false, trend: 163.2, rate: -0.4 };
      out[0].feed = [cl(L1), cl(L1)]; out[0].forecasts = [cl(F1), cl(F1)];
      out[1].feed = [cl(L2)]; out[1].forecasts = [cl(F2)];
      if (out[2]) { out[2].feed = [cl(L3)]; out[2].forecasts = [cl(F3)]; }
      return ["feed [L, L] · forecasts [F, F] (keys d,t,how)", "feed [L] · forecasts [F] — canonically equal, keys how,t,d", "feed [L] · forecasts [F] — keys t,d,how"]; },
    assert: (out) => { const c9 = (v) => J(canon(v)); const a = out[0], b = out[1];
      return a.feed.length === 2 && J(a.feed[0]) === J(a.feed[1]) && b.feed.length === 1 && c9(a.feed[0]) === c9(b.feed[0]) && J(a.feed[0]) !== J(b.feed[0]) && a.feed[0].op == null
        && a.forecasts.length === 2 && J(a.forecasts[0]) === J(a.forecasts[1]) && b.forecasts.length === 1 && c9(a.forecasts[0]) === c9(b.forecasts[0]) && J(a.forecasts[0]) !== J(b.forecasts[0])
        && (!out[2] || (out[2].feed.length === 1 && c9(out[2].feed[0]) === c9(a.feed[0]) && J(out[2].feed[0]) !== J(a.feed[0]) && J(out[2].feed[0]) !== J(b.feed[0]))); } },
  /* COWORK, WHILE GENERALISING SOL'S PASS-6 REPAIR — A DAY ONLY ONE SIDE CARRIES.
     _feedDayOrder's differ branch fired whenever the two sides' sequences were
     not equal, and a day the other side had NO lines for is not equal to
     anything: the most common sync there is (one device a day ahead; a second
     device's first sync; a restore after a wipe) put the athlete's own within-day
     chronology in canonical — alphabetical — order, and the rewrite was sticky.
     Executed on his ledger: the live copy against the branch's older copy moved
     every day only the live copy carried. main kept these days (its union
     emits a one-sided day in its own order); the tip regressed them. Three
     story lines, newest first as every writer leaves them; B and C silent. */
  14443: { apply: (out) => {
      const D9 = "2026-08-18";
      out[0].feed = [{ d: D9, t: "EARNED — hack squat +10", how: "the walk's own line" }, { d: D9, t: "HACK SQUAT — 200 × 7,7,8", how: "session line" }, { d: D9, t: "WEIGH-IN — 163.2", how: "morning reading" }];
      out[1].feed = []; if (out[2]) out[2].feed = [];
      return ["feed [EARNED, HACK SQUAT, WEIGH-IN] @08-18 — the day only this device carries", "no lines that day", "no lines that day"]; },
    assert: (out) => out[0].feed.length === 3 && out[0].feed.every((f) => f.d === "2026-08-18" && f.op == null) && new Set(out[0].feed.map((f) => f.t)).size === 3 && out.slice(1).every((s9) => Array.isArray(s9.feed) && s9.feed.length === 0) },
  /* AND THE EQUAL BRANCH'S OWN IDENTITY: it compared the two sides' day RAW, so
     one day carried by two devices with a line's keys in different orders was
     "different" — canonicalised, and the interleaved repeat both carried was
     regrouped. Same sequence [X, Y, X] on every replica, three key orders. */
  14444: { apply: (out) => {
      const D9 = "2026-08-18";
      const X1 = { d: D9, t: "X — REPEATED", how: "a keyless line that legitimately repeats" }, Y1 = { d: D9, t: "Y — OTHER", how: "another line the same day" };
      const X2 = { how: "a keyless line that legitimately repeats", d: D9, t: "X — REPEATED" }, Y2 = { t: "Y — OTHER", how: "another line the same day", d: D9 };
      const X3 = { t: "X — REPEATED", how: "a keyless line that legitimately repeats", d: D9 }, Y3 = { how: "another line the same day", d: D9, t: "Y — OTHER" };
      out[0].feed = [cl(X1), cl(Y1), cl(X1)]; out[1].feed = [cl(X2), cl(Y2), cl(X2)]; if (out[2]) out[2].feed = [cl(X3), cl(Y3), cl(X3)];
      return ["feed [X, Y, X] (keys d,t,how)", "feed [X, Y, X] (keys how,d,t / t,how,d)", "feed [X, Y, X] (keys t,how,d / how,d,t)"]; },
    assert: (out) => { const c9 = (v) => J(canon(v));
      return out.every((s9) => s9.feed.length === 3 && s9.feed.every((f) => f.d === "2026-08-18" && f.op == null) && c9(s9.feed[0]) === c9(s9.feed[2]) && c9(s9.feed[0]) !== c9(s9.feed[1]))
        && new Set(out.map((s9) => c9(s9.feed))).size === 1 && new Set(out.map((s9) => J(s9.feed))).size === out.length; } },
  /* THE OP-DEDUP'S TIE, ONCE THE UNION'S IDENTITY IS CANONICAL (cowork, leg 19,
     found by enumeration while closing Sol's pass-6 row): two devices fire the
     same op on the same day with DIFFERENT content and the d-tie breaks to the
     smaller entry. The spelling that reaches the tie is whichever the day rule
     and the union carried forward (the remote side's on an equal day, the
     local side's copies on a differing one), so a RAW comparison made the pick
     a function of grouping. A and B carry one telling of a standard's
     retirement in two key orders (A's spelling sorts first, B's last); C
     carries a different telling whose spelling sorts between them — under a
     raw tie (A+B)+C keeps C's telling and A+(B+C) keeps A's. Never red at a
     committed tip (the raw union kept both spellings and the raw tie was a
     min over the whole set); red under its mutation. */
  14445: { apply: (out) => {
      const D9 = "2026-08-18", tt = "HACK SQUAT — STANDARD RETIRED", how9 = "the standard was set under the previous setup; the first session under the new one sets the line";
      out[0].feed = [{ d: D9, op: "stdretire:hack", t: tt, how: how9 }];
      out[1].feed = [{ how: how9, op: "stdretire:hack", t: tt, d: D9 }];
      if (out[2]) out[2].feed = [{ how: "a different telling — the laptop retired it under its own setup note", op: "stdretire:hack", t: tt, d: D9 }];
      return ["feed [stdretire:hack — keys d,op,t,how]", "feed [the same line — keys how,op,t,d]", "feed [stdretire:hack, a different telling — keys how,op,t,d]"]; },
    assert: (out) => { const c9 = (v) => J(canon(v)); const a = out[0].feed, b = out[1].feed, c = out[2] && out[2].feed;
      return a.length === 1 && b.length === 1 && c9(a[0]) === c9(b[0]) && J(a[0]) !== J(b[0]) && Object.keys(a[0])[0] === "d" && Object.keys(b[0])[0] === "how" && a[0].op === "stdretire:hack"
        && !!c && c.length === 1 && c[0].op === a[0].op && c[0].d === a[0].d && c9(c[0]) !== c9(a[0]) && J(a[0]) < J(c[0]) && J(c[0]) < J(b[0]); } },
  /* THE MERGE'S OTHER RECEIPT IS NOT A PROJECTION (cowork, leg 19, by
     enumeration): the adoptshift line is filed by an intermediate merge on
     THAT merge's op-dedup pick, and a later merge can overturn the pick — the
     dedup is a min over every input's receipts. A adopted hack at 200 (its
     receipt sorts last), C at 190 (sorts first), B is silent; the working load
     is 190 everywhere. (A+B) keeps 200 ≠ 190 and files the line; +C overturns
     the pick to 190 — the line stays, describing a receipt that no longer
     stands. A+(B+C) never files it. Red at every tip since the writer. */
  14446: { apply: (out) => {
      const D9 = "2026-08-18";
      out[0].feed = [{ d: D9, op: "adopt:hack", t: "HACK SQUAT — LOAD ADOPTED AT 200", how: "z — the laptop's receipt (its canonical form sorts last)", w: 200 }];
      out[1].feed = [];
      if (out[2]) out[2].feed = [{ d: D9, op: "adopt:hack", t: "HACK SQUAT — LOAD ADOPTED AT 190", how: "a — the phone's receipt (its canonical form sorts first)", w: 190 }];
      return ["feed [adopt:hack @200]", "no lines", "feed [adopt:hack @190 — same op, same day; sorts first]"]; },
    assert: (out) => { const c9 = (v) => J(canon(v)); const a = out[0].feed, c = out[2] && out[2].feed;
      const h = (s9) => (s9.exercises || []).find((e) => e && e.id === "hack");
      return a.length === 1 && a[0].op === "adopt:hack" && a[0].w === 200 && out[1].feed.length === 0 && !!c && c.length === 1 && c[0].op === "adopt:hack" && c[0].w === 190 && c[0].d === a[0].d && c9(c[0]) < c9(a[0])
        && out.every((s9) => h(s9) && h(s9).w === 190); } },
  /* AND A REPLICA ALREADY CARRYING A STALE ONE — the two-replica face of the
     same defect: a merge on an older tip filed adoptshift:hack:190 when the
     kept receipt said 200; the receipt was later overturned to 190 (= the
     working load) and the line stayed. Every replica agrees; the line's
     warrant is gone; a projection drops it, history keeps it. */
  14447: { apply: (out) => {
      const D9 = "2026-08-18";
      for (const s9 of out) s9.feed = [{ d: D9, op: "adopt:hack", t: "HACK SQUAT — LOAD ADOPTED AT 190", how: "the kept receipt — it agrees with the working load", w: 190 }, { d: "2026-08-14", t: "HACK SQUAT — LOGGED AT 190 (plan said 200)", how: "Reality outranks the filed plan: two devices adopted different first loads offline; the newer stamp holds the working load, and the story reconciles here. Every session stays on the record at the load it was lifted.", op: "adoptshift:hack:190" }];
      return ["feed [adopt:hack @190, a STALE adoptshift:hack:190 from an older merge]", "(same)", "(same)"]; },
    assert: (out) => out.every((s9) => { const h = (s9.exercises || []).find((e) => e && e.id === "hack"); return !!h && h.w === 190 && s9.feed.length === 2 && s9.feed[0].op === "adopt:hack" && s9.feed[0].w === 190 && s9.feed[1].op === "adoptshift:hack:190"; }) },
  /* SOL'S PASS-7 HUNT — A STALE PROJECTION ON ONE REPLICA REORDERS THE
     PERMANENT STORY BEFORE IT IS REMOVED. Projections (carve, adoptshift)
     entered _feedDayOrder's day maps like any other line, so a stale one
     carried by ONE replica made two otherwise identical days "differ": the
     differ branch canonicalised the day, the writers then removed the stale
     line correctly, and the athlete's permanent lines stayed alphabetical. A:
     an unwarranted carve line AND an unwarranted adoptshift line (no record has
     anything dropped; no adopt receipt exists) followed by [EARNED, HACK,
     WEIGH-IN]; B and C: the same permanent sequence and nothing else. */
  14448: { apply: (out) => {
      const D9 = "2026-08-18";
      const perm9 = [{ d: D9, t: "EARNED — hack squat +10", how: "the walk's own line" }, { d: D9, t: "HACK SQUAT — 200 × 7,7,8", how: "session line" }, { d: D9, t: "WEIGH-IN — 163.2", how: "morning reading" }];
      out[0].feed = [{ op: "carve:" + D9, d: D9, ids: ["rows"], kept: "later", t: "MERGE KEPT ONE WHOLE SESSION — " + D9, how: "(a receipt an older merge wrote; the record has nothing dropped)" }, { d: D9, t: "HACK SQUAT — LOGGED AT 190 (plan said 200)", how: "Reality outranks the filed plan: two devices adopted different first loads offline; the newer stamp holds the working load, and the story reconciles here. Every session stays on the record at the load it was lifted.", op: "adoptshift:hack:190" }, ...cl(perm9)];
      out[1].feed = cl(perm9); if (out[2]) out[2].feed = cl(perm9);
      return ["feed [STALE carve:08-18, STALE adoptshift:hack:190, EARNED, HACK, WEIGH-IN]", "feed [EARNED, HACK, WEIGH-IN]", "feed [EARNED, HACK, WEIGH-IN]"]; },
    assert: (out) => { const proj9 = (f) => f && typeof f.op === "string" && (f.op.indexOf("carve:") === 0 || f.op.indexOf("adoptshift:") === 0); const a = out[0].feed, b = out[1].feed;
      return a.length === 5 && proj9(a[0]) && proj9(a[1]) && a[0].op !== a[1].op && J(a.slice(2)) === J(b) && b.length === 3 && b.every((f) => f.d === "2026-08-18" && f.op == null)
        && (!out[2] || J(out[2].feed) === J(b)) && out.every((s9) => !Object.values(s9.sessionLog || {}).some((r) => Array.isArray(r.dropped) && r.dropped.length) && !(s9.feed || []).some((f) => f && typeof f.op === "string" && f.op.indexOf("adopt:") === 0)); } },
  /* SCALE-2 (Sol's closure pass 1, rows 2 + H1) — MIXED-VERSION READ RECEIPTS AND THE
     DISPROVEN MISS. A: a v7.54.18 replica carrying an off-window read with the OLD
     op-less "EVENING READ — SET ASIDE" line AND a false "MORNING READ MISSED" line on a
     day it later read cleanly; B: a v7.55.x replica with the same off-window read
     carrying the NEW op-keyed line, and the clean read that disproves A's missed line;
     C: clean. The merged state must carry exactly ONE set-aside receipt for the
     off-window day and NO missed line on the clean-read day. */
  14450: { apply: (out) => {
      const DL = "2026-08-21", DC = "2026-08-22";
      out[0].reads = [...(out[0].reads || []), { d: DL, w: 163.0, sealed: false, pt: 163.5, note: "evening read — set aside", offWindow: true }];
      out[0].feed = [{ d: DL, t: "EVENING READ — SET ASIDE", how: "evening reads run 1–2 lb heavy against a morning-standardized trend — recorded, set aside; tomorrow morning is the instrument." }, { d: DC, t: "MORNING READ MISSED", how: "the trend carries. Today it cost 0.02 lb/wk of rate precision — priced by the engine." }, ...(out[0].feed || [])];
      out[1].reads = [...(out[1].reads || []), { d: DL, w: 163.0, sealed: false, pt: 163.5, note: "late read — set aside", offWindow: true }, { d: DC, w: 162.8, sealed: false, pt: 163.4, note: "" }];
      out[1].feed = [{ d: DL, op: "lateread:" + DL, t: "LATE READ — SET ASIDE", how: "a read after the morning window — local noon, or once today's session is logged — runs 1–2 lb heavy against a morning-standardized trend; recorded, set aside; tomorrow morning is the instrument." }, ...(out[1].feed || [])];
      return ["off-window read " + DL + " with the OLD op-less receipt + a false MISSED line on " + DC, "the same read with the NEW op-keyed receipt + the clean " + DC + " read", "(clean)"]; },
    assert: (out) => { const a = out[0], b = out[1];
      return (a.reads || []).some((r) => r.d === "2026-08-21" && r.offWindow) && (a.feed || []).some((f) => f.t === "EVENING READ — SET ASIDE" && !f.op) && (a.feed || []).some((f) => f.d === "2026-08-22" && f.t === "MORNING READ MISSED") && !(a.reads || []).some((r) => r.d === "2026-08-22")
        && (b.reads || []).some((r) => r.d === "2026-08-21" && r.offWindow) && (b.feed || []).some((f) => f.op === "lateread:2026-08-21") && (b.reads || []).some((r) => r.d === "2026-08-22" && !r.offWindow); } },
  /* SCALE-2 (Sol's closure pass 1, row 3a) — A PARTIAL REPLICA'S REPLAY MEETS THE FULL
     SET. A: all reads through a week with a weekly row; B: the same state missing ONE
     mid-chain read, its trend/pt/weekly honestly replayed without it. The read union
     carries the superset; the trend, the pt chain and the weekly row must follow the
     merged reads identically in both directions. */
  14451: { apply: (out) => {
      const RS = [["2026-08-11", 163.0], ["2026-08-12", 161.5], ["2026-08-13", 163.5], ["2026-08-18", 163.0]];
      const chain = (rows) => { let t9 = 164.0; const rr = []; for (const [d, w] of rows) { rr.push({ d, w, sealed: false, pt: t9, note: "" }); t9 = +(t9 + 0.3 * Math.max(-1.5, Math.min(1.5, w - t9))).toFixed(1); } return { rr, t9 }; };
      const A = chain(RS); out[0].reads = [...(out[0].reads || []), ...A.rr]; out[0].trend = A.t9; out[0].weekly = [...(out[0].weekly || []), { wk: "2026-08-10", trend: A.rr[0] ? +(164.0 + 0.3 * Math.max(-1.5, Math.min(1.5, RS[0][1] - 164.0))).toFixed(1) : 164.0 }, { wk: "2026-08-17", trend: A.t9 }];
      const B = chain(RS.filter(([d]) => d !== "2026-08-12"));
      out[1].reads = [...(out[1].reads || []), ...B.rr]; out[1].trend = B.t9; out[1].weekly = [...(out[1].weekly || []), { wk: "2026-08-10", trend: B.rr.length ? +(164.0 + 0.3 * Math.max(-1.5, Math.min(1.5, RS[0][1] - 164.0))).toFixed(1) : 164.0 }, { wk: "2026-08-17", trend: B.t9 }];
      if (out[2]) { out[2].reads = [...(out[2].reads || [])]; }
      return ["reads 8/11–8/18 + honest replay (trend " + A.t9 + ", wk rows)", "the same minus the 8/12 read (trend " + B.t9 + ")", "(clean)"]; },
    assert: (out) => { const a = out[0], b = out[1];
      return (a.reads || []).some((r) => r.d === "2026-08-12") && !(b.reads || []).some((r) => r.d === "2026-08-12") && a.trend !== b.trend
        && (a.weekly || []).some((w) => w.wk === "2026-08-17") && (b.weekly || []).some((w) => w.wk === "2026-08-17")
        && J((a.weekly || []).find((w) => w.wk === "2026-08-17")) !== J((b.weekly || []).find((w) => w.wk === "2026-08-17")); } },
  /* SCALE-2 (Sol's closure pass 1, row 4) — THE DECISION'S EFFECT RIDES THE MERGE. A:
     approved a protein suggestion (log row, targets.proteinG written, the adjustment);
     B: the stale pre-decision copy. And the same-card conflict: A dismissed the card on
     8/16 (kind provenance on the row), B approved it on 8/17 (proteinG 200). The
     decision AND its effect must converge whole-state in both directions. */
  /* PROGRESSION-1 (2026-08-19 rulings) — A RETIRED SEAM MUST NOT COME BACK. Eleven lifts
     carried an insertion fork stamped with the day the code ran, and each of them read it as
     a fresh baseline and repeated its own last line. The seams are retired by ruling — but a
     one-time deletion would not have survived: forks merge union-by-date and the feed is a
     max-multiset, so a replica that still carried one would hand it straight back on the next
     sync. The repair is that a context seam is DERIVED at every boundary from the plan
     marker, the ruled pair table and actual exposure. A: a stale replica still carrying the
     8/17 fly seam on rows and its feed line. B: the corrected state. C: clean. */
  /* PROGRESSION-1 FIX-2 (A6) — SOL'S R13 SPLIT-BRAIN, AS A SEED. Two devices each
     saw the SAME load top out, on different days, and each banked its own first
     sighting. Serially those are two sightings and the lift earns; merged, the
     counter rode inside whichever whole lift record won and the merged state
     claimed ONE — a number its own merged history could not produce. The seed
     exists so sighting-faithful has something to be false about: without it the
     law is green on every seed under every mutant, which is a law that checks
     nothing. MUTATIONS IT GUARDS: derive-not-at-merge. */
  14454: { apply: (out) => {
      const cfg9 = (st9, d9) => {
        const p9 = (st9.exercises || []).find((e) => e && e.id === "rows");
        if (!p9) return;
        p9.forks = []; p9.std = null; p9.own = false; p9.reclaim = null; p9.ladder = null;
        p9.sets = 2; p9.last = [p9.hi, p9.hi];               /* the lift keeps its OWN load and ceiling */
        p9.topAt = p9.w; p9.topRun = 1;                      /* each device banked ITS OWN first sighting */
        p9.lastMeta = { d: d9, w: p9.w, reps: [p9.hi, p9.hi] };
        /* press must appear on EXACTLY ONE day per replica, or each side is already
           carrying more than the one sighting it is meant to have banked */
        const sl9 = {};
        for (const k9 of Object.keys(st9.sessionLog || {})) {
          const row9 = st9.sessionLog[k9] || {};
          sl9[k9] = { ...row9, entries: ((row9.entries) || []).filter((e9) => !(e9 && e9.id === "rows")) };
        }
        sl9[d9] = { ...(sl9[d9] || { d: d9 }), d: d9, entries: [...(((sl9[d9] || {}).entries) || []), { id: "rows", w: p9.w, reps: [p9.hi, p9.hi] }] };
        st9.sessionLog = sl9;
      };
      cfg9(out[0], "2026-08-14");
      cfg9(out[1], "2026-08-16");
      if (out[2]) cfg9(out[2], "2026-08-14");
      return ["rows topped its load on 8/14 — one sighting banked", "rows topped the SAME load on 8/16 — its own first sighting banked", "(the 8/14 sighting again)"]; },
    assert: (out) => {
      const p9 = (st9) => (st9.exercises || []).find((e) => e && e.id === "rows") || {};
      const days9 = (st9) => Object.keys(st9.sessionLog || {}).filter((k9) => (((st9.sessionLog[k9] || {}).entries) || []).some((e9) => e9 && e9.id === "rows"));
      return p9(out[0]).topRun === 1 && p9(out[1]).topRun === 1
        && JSON.stringify(days9(out[0])) === JSON.stringify(["2026-08-14"])
        && JSON.stringify(days9(out[1])) === JSON.stringify(["2026-08-16"]); } },
  14453: { apply: (out) => {
      const D9 = "2026-08-17";
      const rowsOf = (s9) => (s9.exercises || []).find((e) => e && e.id === "rows");
      const r9 = rowsOf(out[0]);
      if (r9) r9.forks = [...(r9.forks || []), { from: D9, why: "fly inserted upstream", ops: ["fly inserted upstream"], prevN: r9.n, split: true, kind: "context" }];
      out[0].feed = [{ op: "seam:fly:rows", d: D9, t: "PRIME SEATED ROW (HOOKS) — FRESH BASELINE", how: "(the seam a previous version wrote on the day the code ran)" }, ...(out[0].feed || [])];
      out[0].insertions = { ...(out[0].insertions || {}), fly: D9 };
      return ["rows carries the retired 8/17 fly seam + its feed line, marker 8/17", "(corrected: no seam, marker 8/14)", "(clean)"]; },
    assert: (out) => { const r9 = (out[0].exercises || []).find((e) => e && e.id === "rows");
      return !!r9 && (r9.forks || []).some((f) => f && f.from === "2026-08-17" && f.split)
        && (out[0].feed || []).some((f) => f && f.op === "seam:fly:rows")
        && !((out[1].exercises || []).find((e) => e && e.id === "rows").forks || []).some((f) => f && f.split); } },
  14452: { apply: (out) => {
      out[0].suggestionLog = [...(out[0].suggestionLog || []), { sid: "sug_2026-08-20_p", decided: "approved", d: "2026-08-20", title: "protein to 200", apply: { kind: "protein", to: 200 }, predict: "" }, { sid: "sug_2026-08-16_x", decided: "dismissed", d: "2026-08-16", title: "sleep to 8", apply: { kind: "sleep" } }];
      out[0].targets = { ...(out[0].targets || {}), proteinG: 200 };
      out[0].adjustments = [...(out[0].adjustments || []), { rid: "sug_2026-08-20_p", id: "adjSEED14452", d: "2026-08-20", title: "protein to 200" }];
      out[1].suggestionLog = [...(out[1].suggestionLog || []), { sid: "sug_2026-08-16_x", decided: "approved", d: "2026-08-17", title: "sleep to 8", apply: { kind: "sleep", to: 8 } }];
      out[1].targets = { ...(out[1].targets || {}), sleepH: 8 };
      if (out[2]) out[2].suggestionLog = [...(out[2].suggestionLog || [])];
      return ["approved protein→200 (log+target+adjustment) + dismissed sleep card 8/16", "the same sleep card APPROVED 8/17 (target sleepH 8); no protein decision", "(clean)"]; },
    assert: (out) => { const a = out[0], b = out[1];
      return (a.suggestionLog || []).some((x) => x.sid === "sug_2026-08-20_p" && x.decided === "approved") && a.targets && a.targets.proteinG === 200
        && (a.suggestionLog || []).some((x) => x.sid === "sug_2026-08-16_x" && x.decided === "dismissed" && x.d === "2026-08-16")
        && (b.suggestionLog || []).some((x) => x.sid === "sug_2026-08-16_x" && x.decided === "approved" && x.d === "2026-08-17") && b.targets && b.targets.sleepH === 8
        && !(b.suggestionLog || []).some((x) => x.sid === "sug_2026-08-20_p") && (b.targets || {}).proteinG === undefined; } },
  /* SCALE-1 (cowork, 2026-08-19) — THE ANALYST-CARD DECISIONS RODE THE MERGE
     WHOLESALE. s.suggestionLog (approved / noted / dismissed per card) was in no
     MERGE_* table: {...remote, ...local} — local wins — so a decision tapped on
     one device was reverted on the ledger when a stale device synced after it,
     and the card came back there. A: decided X on 8/16 (noted) and Z on 8/17
     (noted); B: decided X on 8/17 (dismissed — the same card, a day later,
     offline), Y on 8/17, and Z on 8/17 (dismissed — same day, other word); C:
     nothing. Keyed by sid: never lost; X → the EARLIER day's word (noted); Z →
     same day, canonical body decides, the same whichever device is local. */
  14449: { apply: (out) => {
      out[0].suggestionLog = [{ sid: "sug_2026-08-16_x", decided: "noted", d: "2026-08-16", title: "x" }, { sid: "sug_2026-08-17_z", decided: "noted", d: "2026-08-17", title: "z" }];
      out[1].suggestionLog = [{ sid: "sug_2026-08-16_x", decided: "dismissed", d: "2026-08-17", title: "x" }, { sid: "sug_2026-08-17_y", decided: "noted", d: "2026-08-17", title: "y" }, { sid: "sug_2026-08-17_z", decided: "dismissed", d: "2026-08-17", title: "z" }];
      if (out[2]) out[2].suggestionLog = [];
      return ["suggestionLog [x noted 8/16, z noted 8/17]", "suggestionLog [x dismissed 8/17, y noted 8/17, z dismissed 8/17]", "suggestionLog []"]; },
    assert: (out) => { const a = out[0].suggestionLog, b = out[1].suggestionLog;
      return Array.isArray(a) && a.length === 2 && a[0].sid === "sug_2026-08-16_x" && a[0].decided === "noted" && a[0].d === "2026-08-16" && a[1].sid === "sug_2026-08-17_z" && a[1].d === "2026-08-17"
        && Array.isArray(b) && b.length === 3 && b[0].sid === "sug_2026-08-16_x" && b[0].decided === "dismissed" && b[0].d === "2026-08-17" && b[1].sid === "sug_2026-08-17_y" && b[2].sid === "sug_2026-08-17_z" && b[2].decided === "dismissed" && b[2].d === "2026-08-17"
        && (!out[2] || (Array.isArray(out[2].suggestionLog) && out[2].suggestionLog.length === 0)); } },
  /* SOL'S PASS-5 — INTERLEAVED REPEATS. The keyless feed allows an identical
     line to repeat; _unionMulti groups a day's lines by identity before it
     emits them, so [X, Y, X] came out of a merge with ITSELF as [X, X, Y]:
     the equal-sequence branch kept the union's grouped order instead of the
     sequence both sides carried. Every replica identical here — the promise is
     that merge(A,A) preserves the athlete's own within-day chronology byte for
     byte. */
  14440: { apply: (out) => {
      const X9 = { d: "2026-08-18", t: "X — REPEATED", how: "a keyless line that legitimately repeats" }, Y9 = { d: "2026-08-18", t: "Y — OTHER", how: "another line the same day" };
      for (const s9 of out) s9.feed = [cl(X9), cl(Y9), cl(X9)];
      return ["feed [X, Y, X]", "(same)", "(same)"]; },
    assert: (out) => out.every((s9) => Array.isArray(s9.feed) && s9.feed.length === 3 && J(s9.feed[0]) === J(s9.feed[2]) && J(s9.feed[0]) !== J(s9.feed[1]) && s9.feed.every((f) => f.d === "2026-08-18" && f.op == null)) },
  /* SOL'S PASS-5 ASSOCIATIVITY WITNESS: the same two Y lines and one X line on
     every replica, in different within-day orders — (A+B)+C settled [X,Y,Y]
     and A+(B+C) settled [Y,Y,X] because B+C were identical (kept, but from the
     grouped union) and A+B differed (canonical). */
  14441: { apply: (out) => {
      const X9 = { d: "2026-08-18", t: "X — REPEATED", how: "a keyless line that legitimately repeats" }, Y9 = { d: "2026-08-18", t: "Y — OTHER", how: "another line the same day" };
      out[0].feed = [cl(Y9), cl(Y9), cl(X9)]; out[1].feed = [cl(Y9), cl(X9), cl(Y9)]; if (out[2]) out[2].feed = [cl(Y9), cl(X9), cl(Y9)];
      return ["feed [Y, Y, X]", "feed [Y, X, Y]", "feed [Y, X, Y]"]; },
    assert: (out) => out.length === 3 && out.every((s9) => Array.isArray(s9.feed) && s9.feed.length === 3 && s9.feed.every((f) => f.d === "2026-08-18" && f.op == null)) && J(out[1].feed) === J(out[2].feed) && J(out[0].feed) !== J(out[1].feed) && J([...out[0].feed].map((f) => f.t).sort()) === J([...out[1].feed].map((f) => f.t).sort()) },
  14439: { apply: (out) => {
      out[0].feed = [{ d: "2026-08-18", t: "A — PHONE", how: "a line only the phone wrote" }];
      out[1].feed = [{ d: "2026-08-18", t: "B — CLOUD", how: "a line only the laptop wrote" }];
      if (out[2]) out[2].feed = [{ d: "2026-08-18", t: "C — TABLET", how: "a line only the tablet wrote" }];
      return ["feed [A — PHONE @08-18]", "feed [B — CLOUD @08-18]", "feed [C — TABLET @08-18]"]; },
    assert: (out) => out.every((s9) => Array.isArray(s9.feed) && s9.feed.length === 1 && s9.feed[0].d === "2026-08-18") && new Set(out.map((s9) => s9.feed[0].t)).size === out.length },
  14436: { apply: (out) => {
      for (const s9 of out) {
        const hack9 = (s9.exercises || []).find((e) => e && e.id === "hack");
        if (hack9) { hack9.w = 200; hack9.wAt = "2026-08-15T09:00:00.000Z"; }
        s9.feed = [{ d: "2026-08-18", t: "WEIGH-IN — 163.2", how: "a story line newer than the adoption's date" }, { d: "2026-08-14", t: "HACK SQUAT — LOAD ADOPTED AT 190", how: "the kept (earliest) adopt receipt names its load", op: "adopt:hack", w: 190 }];
      }
      return ["hack 200 @08-15 · feed [08-18 line, adopt:hack@190 08-14]", "(same)", "(same)"]; },
    assert: (out) => out.every((s9) => { const h = (s9.exercises || []).find((e) => e && e.id === "hack"); return !!h && h.w === 200 && String(h.wAt) > "2026-08-14" && Array.isArray(s9.feed) && s9.feed.length === 2 && String(s9.feed[0].d) > String(s9.feed[1].d) && s9.feed[1].op === "adopt:hack" && s9.feed[1].w === 190; }) },
  14435: { expectsCarve: true, apply: (out) => {
      const rows9 = { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }, curl9 = { id: "curl", w: 50, reps: [12, 12, 9], rir: 2, rirSets: [2, null, null] };
      const line9 = { d: "2026-08-18", t: "WEIGH-IN — 163.2", how: "a story line newer than the session the merge will carve" };
      out[0].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [cl(rows9)], corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 } };
      out[1].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [cl(rows9), cl(curl9)] };
      if (out[2]) out[2].sessionLog["2026-08-09"] = cl(out[0].sessionLog["2026-08-09"]);
      for (const s9 of out) s9.feed = [cl(line9)];
      return ["legacy corr, no ops · rows · feed has an 08-18 line", "plain · rows + curl · same feed", "legacy · same feed"]; },
    assert: (out) => {
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const a = r9(out[0]), b = r9(out[1]);
      return !!(a.corr && a.corr.at) && !a.corrLog && !b.corr && !b.corrLog
        && J((a.entries || []).map((e) => e.id)) === J(["rows"]) && J((b.entries || []).map((e) => e.id)) === J(["rows", "curl"])
        && out.every((s9) => Array.isArray(s9.feed) && s9.feed.length === 1 && String(s9.feed[0].d) > "2026-08-09" && s9.feed[0].op == null); } },
  14432: { apply: (out) => {
      out[0].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [{ id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }], corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 } };
      out[1].sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [{ id: "curl", w: 50, reps: [12, 12, 9], rir: 2, rirSets: [2, null, null] }], corr: { at: "2026-08-11T08:00:00.000Z", rev: 1 },
        corrLog: [{ op: "amend:2026-08-09:curl:2026-08-11T08:00:00.000Z", kind: "amend", id: "curl", at: "2026-08-11T08:00:00.000Z", to: [{ id: "curl", w: 50 }] }] };
      if (out[2]) out[2].sessionLog["2026-08-09"] = cl(out[0].sessionLog["2026-08-09"]);
      return ["legacy corr, no ops · rows", "modern corrLog · curl", "legacy corr, no ops · rows"]; },
    assert: (out) => {
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const a = r9(out[0]), b = r9(out[1]);
      return !!a.corr && !a.corrLog && !!b.corr && Array.isArray(b.corrLog) && b.corrLog.length === 1
        && J((a.entries || []).map((e) => e.id)) === J(["rows"]) && J((b.entries || []).map((e) => e.id)) === J(["curl"]); } },
  /* THE PATCH-BACKFILL SHAPE. patchV58 files the two 8/14 un-skip corrections
     the feed proves, and both carry that record's single corr.at — so if the
     monotone bump reached patch filings, a BOOT would space them a millisecond
     apart and move the athlete's own correction stamp. No other committed seed
     goes near the backfill (they all start from world(), which has none of his
     corrected dates), which is why the boot-restamps mutation had nothing to
     break until this seed existed. */
  14428: { apply: (out) => {
      for (const s9 of out) {
        s9.v = 57;                                                         /* so patchV58 runs on the boot */
        s9.sessionLog["2026-08-14"] = { d: "2026-08-14", at: 1786826000000,
          entries: [
            { id: "hack", w: 200, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0] },
            { id: "abs", w: 45, reps: [15, 15], rir: 0, rirSets: [null, 0] },
            { id: "hanging", w: "BW", reps: [12], rir: 0, rirSets: [0] },
          ],
          corr: { at: "2026-08-14T21:57:13.968Z", rev: 4 } };
      }
      return ["8/14 with abs+hanging logged and one corr stamp — the backfill files two ops at that instant", "(same)", "(same)"]; },
    assert: (out) => {
      const r9 = out[0].sessionLog["2026-08-14"] || {};
      return out[0].v === 57 && String((r9.corr || {}).at) === "2026-08-14T21:57:13.968Z"
        && (r9.entries || []).some((e) => e && e.id === "abs")
        && (r9.entries || []).some((e) => e && e.id === "hanging")
        && !((r9.corrLog || []).length); } },
  /* SOL'S R-1 PROBE. Equal (corr.at, rev, tieKey) with an identical unrelated
     amend on both sides, rows LOGGED on A and initially SKIPPED on B — nothing
     but the placement rule can decide, and a base-order fallback answers
     differently by direction. */
  14425: { apply: (out) => {
      const mk = (s9, withRows) => { s9.sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964,
        entries: [{ id: "hack", w: 200, reps: [7, 7], rir: 2, rirSets: [2, 0] }].concat(withRows ? [{ id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }] : []),
        corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 },
        corrLog: [{ op: "amend:2026-08-09:hack:2026-08-10T08:00:00.000Z", kind: "amend", id: "hack", at: "2026-08-10T08:00:00.000Z", to: [{ id: "hack", w: 200 }] }] };
        if (!withRows) s9.sessionLog["2026-08-09"].skipped = [{ id: "rows" }]; };
      mk(out[0], true); mk(out[1], false); if (out[2]) mk(out[2], true);
      return ["rows LOGGED", "rows initially SKIPPED", "rows LOGGED"]; },
    assert: (out) => { const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const a = r9(out[0]), b = r9(out[1]);
      return a.corr.at === b.corr.at && a.corr.rev === b.corr.rev
        && (a.entries || []).some((e) => e.id === "rows") && !((a.skipped || []).length)
        && (b.skipped || []).some((z) => z.id === "rows") && !(b.entries || []).some((e) => e.id === "rows")
        && !(a.corrLog || []).some((c) => c.kind === "skip" || c.kind === "unskip"); } },
  /* THE L5-b PROBE, THROUGH THE PRODUCTION WRITER. Three acts on one lift where
     the third's WALL stamp repeats the first's — a clock that went backwards —
     filed with live:true exactly as a handler would. */
  14426: { walls: ["2026-08-10T09:00:00.000Z", "2026-08-10T09:10:00.000Z", "2026-08-10T09:00:00.000Z"], requires: ["_fileCorr"], apply: (out) => {
      const rec = out[0].sessionLog["2026-08-09"];
      const W = AIM[14426].walls;
      rec.entries = (rec.entries || []).filter((e) => e.id !== "rows");
      rec.skipped = [{ id: "rows" }];
      rec.corr = { at: "2026-08-10T09:00:00.000Z", rev: 1 };
      const en = { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] };
      const fire = (kind, wall, to) => { if (T._fileCorr) T._fileCorr(rec, kind + ":2026-08-09:rows:" + wall, kind, "rows", wall, to, { live: true }); };
      fire("skip", W[0]);
      rec.skipped = []; rec.entries = rec.entries.concat([en]);
      fire("unskip", W[1], en);
      rec.entries = rec.entries.filter((e) => e.id !== "rows"); rec.skipped = [{ id: "rows" }];
      fire("skip", W[2]);
      return ["skip@09:00 then unskip@09:10 then skip@09:00 again (backward clock)", "(untouched)", "(untouched)"]; },
    /* THE INPUT SHAPE ONLY. Asserting the OUTPUT (three ops strictly
       increasing) meant breaking the writer made this "did not form" — a
       scenario failure, not a law — so the mutation it exists to catch could
       never be credited. A formation check answers "did the scenario happen",
       never "did the system behave"; that second question is self-consistent's. */
    assert: (out) => {
      const r9 = out[0].sessionLog["2026-08-09"] || {};
      const W = AIM[14426].walls;
      /* R-5 — THE REQUESTED WALLS ARE THE FIXTURE, and the RELATION between
         them is asserted STRICTLY: the third act repeats the first's wall and
         the second is later than both. Change one literal and this is false and
         the seed says so; break the writer and this is still true — the laws
         judge the writer. */
      return W.length === 3 && W[2] === W[0] && W[1] > W[0]
        && ((r9.corrLog || []).length >= 2) && (r9.skipped || []).some((z) => z.id === "rows"); } },
  /* THE ATHLETE'S LATER WORD: a lift whose own wAt post-dates the entry's
     wCorrAt. The correction is real, he has since said something newer, and the
     reconciler must leave it. */
  14427: { apply: (out) => {
      for (const s9 of out) {
        const rec = s9.sessionLog["2026-08-14"];
        const en = ((rec && rec.entries) || []).find((e) => e && e.id === "hack");
        if (en) { en.w = 200; en.wCorrAt = "2026-08-15T09:00:00.000Z"; }
        const ex = (s9.exercises || []).find((e) => e && e.id === "hack");
        if (ex) { ex.w = 190; ex.wAt = "2026-08-20T09:00:00.000Z"; }
      }
      return ["hack 190 stamped AFTER the entry's correction", "(same)", "(same)"]; },
    assert: (out) => {
      const en = ((((out[0].sessionLog || {})["2026-08-14"] || {}).entries) || []).find((e) => e && e.id === "hack");
      const ex = (out[0].exercises || []).find((e) => e && e.id === "hack");
      return !!en && !!ex && en.w === 200 && ex.w === 190 && String(ex.wAt) > String(en.wCorrAt); } },
  /* HUNT 1's SHAPE, committed. Two devices each logged a DIFFERENT session on
     one date and neither carries a correction — the class the generator can
     never reach on its own, because every replica descends from one body. The
     early return sent this to a record-level pick and one session was simply
     gone, in BOTH orders, against mergeState's own superset promise. */
  14424: { apply: (out) => {
      const mk = (s9, e9) => { s9.sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964, entries: [e9] }; };
      mk(out[0], { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] });
      mk(out[1], { id: "curl", w: 50, reps: [12, 12], rir: 2, rirSets: [2, 0] });
      if (out[2]) mk(out[2], { id: "hack", w: 200, reps: [7, 7, 8], rir: 2, rirSets: [2, null, 0] });
      return ["logged rows only", "logged curl only", "logged hack only"]; },
    assert: (out) => {
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const ids = out.map((s9) => (r9(s9).entries || []).map((e) => e.id).join());
      return new Set(ids).size === out.length && out.every((s9) => !(r9(s9).corr) && !(r9(s9).corrLog)); } },
  /* THE THREE-REPLICA TIE (cowork's construction, committed). Three corrected
     copies of one record, equal (corr.at, rev), each holding a different copy of
     the shared lift AND one lift the others lack. Two replicas can never show
     this: it takes a third for an intermediate record to grow past a single
     input and win the base by size. */
  14423: { apply: (out) => {
      const mk = (s9, curl9, extra9) => { s9.sessionLog["2026-08-09"] = { d: "2026-08-09", at: 1786311986964,
        entries: [{ id: "curl", w: 50, reps: curl9, rir: 2, rirSets: [2, null, null] }, extra9],
        corr: { at: "2026-08-10T08:00:00.000Z", rev: 1 },
        corrLog: [{ op: "amend:2026-08-09:curl:2026-08-10T08:00:00.000Z", kind: "amend", id: "curl", at: "2026-08-10T08:00:00.000Z", to: [{ id: "curl", w: 50 }] }] }; };
      mk(out[0], [12, 12, 9], { id: "press", w: 95, reps: [8, 8], rir: 1, rirSets: [1, 0] });
      mk(out[1], [12, 12, 8], { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] });
      if (out[2]) mk(out[2], [12, 12, 7], { id: "fly", w: 40, reps: [12, 12], rir: 2, rirSets: [2, 0] });
      return ["curl [12,12,9] + press", "curl [12,12,8] + rows", "curl [12,12,7] + fly"]; },
    assert: (out) => {
      if (out.length < 3) return false;
      const r9 = (s9) => s9.sessionLog["2026-08-09"] || {};
      const curls = out.map((s9) => J((r9(s9).entries || []).find((e) => e && e.id === "curl")));
      const ats = out.map((s9) => String((r9(s9).corr || {}).at) + "|" + String((r9(s9).corr || {}).rev));
      const uniq = out.map((s9) => (r9(s9).entries || []).map((e) => e.id).filter((i9) => i9 !== "curl").join());
      return new Set(ats).size === 1 && new Set(curls).size === 3 && new Set(uniq).size === 3; } },
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
  883544: { walls: ["2026-08-20T08:00:00.000Z", "2026-08-09T08:00:00.000Z"], requires: ["_fileCorr"], apply: (out) => {
      const W = AIM[883544].walls;
      const rec = out[0].sessionLog["2026-08-09"];
      rec.entries = [...(rec.entries || []).filter((e) => e.id !== "rows"), { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] }];
      rec.skipped = [];
      rec.corr = { at: "2026-08-20T08:00:00.000Z", rev: 2 };
      /* DRIVEN THROUGH THE PRODUCTION WRITER, not injected. Injecting the bad
         corrLog proved only that the timestamps it injected existed — reverting
         the writer fix could not affect it, so the seed guarded nothing. */
      const en0 = { id: "rows", w: 180, reps: [9, 9], rir: 1, rirSets: [1, 0] };
      if (T._fileCorr) {
        T._fileCorr(rec, "skip:2026-08-09:rows:" + W[0], "skip", "rows", W[0], undefined, { live: true });
        T._fileCorr(rec, "unskip:2026-08-09:rows:" + W[1], "unskip", "rows", W[1], en0, { live: true });
      }
      return ["rows: skip@08-20 then unskip@08-09 — a later act with an earlier stamp", "(untouched)", "(untouched)"]; },
    assert: (out) => {
      const l = ((out[0].sessionLog["2026-08-09"] || {}).corrLog) || [];
      const sk = l.find((c) => c.kind === "skip" && c.id === "rows"), un = l.find((c) => c.kind === "unskip" && c.id === "rows");
      /* THE INPUT SHAPE ONLY — both acts filed through the production writer,
         the second REQUESTED with an earlier wall stamp than the first. This
         asserted the RESULT (that the later act still lands later), which is
         exactly what self-consistent now judges, so breaking the writer made
         the scenario "not form" and four old engines reported aimed-scenario
         where the law should have spoken. The same R-5 residue that 14426 shed
         one leg ago, left standing here. */
      const W = AIM[883544].walls;
      return W.length === 2 && W[1] < W[0] && !!sk && !!un; } },   /* R-5 — the second act was REQUESTED with an earlier wall than the first, asserted on the fixture itself */
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
    /* THE ASSERT READS THE INPUTS, AND ONLY THE INPUTS — the third position it
       has held, and the reasoning is worth keeping because both earlier ones
       were wrong in opposite directions.
       It first hand-MODELLED the merge, and the model disagreed with production
       on an equal stamp, so it reported "formed" on a shape that had not.
       It was then anchored to T.mergeState — and that is worse in a way that is
       easy to miss: on the very engine this seed exists to catch, the one that
       still repairs at merge, the production sub-merge ALREADY CONTAINS the
       repaired ladder, so the assert read "no insertion wanted" and reported
       'did not form'. The associativity law then never ran there at all. An
       assert that calls the system under test cannot tell "the shape did not
       form" from "the system hides the shape."
       So every clause below is a fact about the three inputs. Strict, because
       an equal wAt is exactly the disarm this seed must refuse. */
    assert: (out) => {
      if (out.length < 3) return false;
      const g9 = (s9) => (s9.exercises || []).find((z) => z && z.id === "hack") || {};
      const a9 = g9(out[0]), b9 = g9(out[1]), c9 = g9(out[2]);
      const at = (x9) => String(x9 || "");
      return at(c9.wAt) > at(b9.wAt)                                   /* C's load wins B+C */
        && at(c9.stepsAt) > at(b9.stepsAt)                             /* C's ladder wins B+C */
        && (c9.steps || []).indexOf(c9.w) < 0                          /* so the sub-merge pair WANTS an insertion */
        && at(a9.wAt) > at(c9.wAt)                                     /* A's load wins the whole */
        && (c9.steps || []).indexOf(a9.w) > -1                         /* which the final pair does NOT want */
        && a9.stepsAt === undefined; } },
  /* THE RESTORE DRILL — cowork's witness, committed. A pre-correction backup of
     the 8/14 record rejoins today, and on it the athlete makes ONE legitimate
     new correction. Before FIX 2, his newer stamp correctly made the restored
     body the base and then everything the base happened to lack was gone: two
     lifts he had ✕'d came back as entries and two hand-added entries were
     deleted, 7 down to 5, in BOTH orders — so the convergence law reported
     green over the loss and dataLossGuard, counting dates, never looked in. */
  14420: { requires: ["_fileCorr"], apply: (out) => {
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
  14417: { requires: ["_fileCorr"], apply: (out) => {
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
    /* and the BODY reflects this replica's own last act — the skip at 08-12,
       which is later than the un-skip at 08-11. Handing in a corrLog whose
       replay disagrees with the body handed in beside it made the replica
       self-inconsistent by construction, and the self-consistent law caught it
       the moment that law existed. The seed tests replay ORDER; it never needed
       the replica to contradict itself to do that. */
    rec2.entries = (rec2.entries || []).filter((e) => e.id !== "rows");
    rec2.skipped = [...(rec2.skipped || []), { id: "rows" }];
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
  14418: { requires: ["_fileCorr"], apply: (out) => {
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
  14416: { requires: ["_fileCorr"], apply: (out, seed) => {
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
const sessTotals = (s) => Object.fromEntries(Object.entries(s.sessionLog || {}).map(([d, r]) => [d, ((r.entries || []).length) + ((r.skipped || []).length) + ((Array.isArray(r.dropped) ? r.dropped : []).length)]));   /* a lift the carve discarded is still ACCOUNTED FOR by name in dropped — the record does not shrink, it tells; a silent carve shrinks and fails here too */
/* the merge's PROJECTIONS — receipts re-derived from the merged state on every merge (the carve line since Sol's pass 4, the adoptshift line since leg 19): they go when their warrant goes and land at the front of their day, so every clause about "the lines a side already had" sets them aside */
const isProjection = (f) => !!(f && ((typeof f.op === "string" && (f.op.indexOf("carve:") === 0 || f.op.indexOf("adoptshift:") === 0 || f.op.indexOf("lateread:") === 0 || f.op.indexOf("sug:") === 0 || f.op.indexOf("seam:") === 0 || f.op === "patch59:scale")) || f.t === "EVENING READ — SET ASIDE" || f.t === "LATE READ — SET ASIDE" || f.t === "ANALYST SUGGESTION APPLIED" || f.t === "ANALYST SUGGESTION DISMISSED" || f.t === "ANALYST SUGGESTION NOTED" || f.t === "ANALYST SUGGESTION UNDONE" || (typeof f.t === "string" && (f.t.indexOf("MORNING READ MISSED") === 0 || f.t.indexOf("READ GAP") === 0))));   /* SCALE-2 — the read receipts join the projection class; SCALE-4 — the analyst-suggestion receipts and the patch59 receipt join it too (see _isFeedProjection) */
const stores = (s) => ({
  reads: (s.reads || []).length, nights: ((s.sleep || {}).nights || []).length,
  dailyLogs: Object.keys(s.dailyLogs || {}).length, sessionLog: Object.keys(s.sessionLog || {}).length,
  queue: (s.queue || []).length,
  /* the carve receipt is a PROJECTION of a session record, not an appended fact: it goes when the record's dropped set empties (Sol, pass 4), so it is not counted as history here */
  feed: new Set((s.feed || []).filter((f) => !isProjection(f)).map((f) => J(canon(f)))).size,   /* by CANONICAL identity (Sol, pass 6): key order is not information here any more than in DEQ; projections (carve, adoptshift) are derived state, not history */
  corrections: Object.values(s.sessionLog || {}).reduce((n, r) => n + ((r && Array.isArray(r.corrLog)) ? r.corrLog.length : 0), 0),   /* the correction ledger is append-only and was covered by no law here either — the same hole dataLossGuard had */
});
const corrOps = (s) => { const o = []; for (const r of Object.values(s.sessionLog || {})) for (const c of (r.corrLog || [])) o.push(c.op); return o.sort(); };

const CARVE_FIRINGS = [];   /* every time the superset exemption is taken, by seed and direction — printed with the verdict */
const LAWS = [
  /* PROGRESSION-1 FIX-2 (A6) — THE SIGHTING RECORD IS A PROJECTION, SO SAY SO AS A LAW.
     Before A6 the two-sightings counter was a STORED fact that only the walk that
     happened to be running could write, and the split-brain followed directly: two
     devices each banking one sighting merged to a state claiming one, because the
     merge picked a whole lift record and the counter rode along inside it. The fix
     was to stop storing an answer nobody could re-derive — topAt/topRun now come out
     of the sessionLog and the lift's own EARNED receipts, at every exit.
     That makes a property available that was not before, and it is the strongest one
     this round has: THE STORE EQUALS THE DERIVATION. A counter no walk could
     reproduce from the history on file is not a record, it is a claim — and the whole
     point of deriving is that there is no longer anywhere for such a claim to hide.
     Checked on each settled replica AND on the settled merge, because the merge is
     where the claim used to be minted. */
  { name: "sighting-faithful",
    says: "every lift's stored sighting record is exactly what the derivation reads out of that same state's own history — on each replica and on the merge",
    check: (A, B) => {
      const norm9 = (t, r, w) => (!(r > 0) || String(t) !== String(w)) ? "-/0" : (String(t) + "/" + r);
      const bad9 = [];
      const scan9 = (nm9, st9) => {
        if (!st9 || typeof T.deriveSighting !== "function") return;
        for (const ex9 of (st9.exercises || [])) {
          if (!ex9 || (typeof T.exActive === "function" && !T.exActive(st9, ex9.id))) continue;
          const d9 = T.deriveSighting(st9, ex9) || {};
          const got9 = norm9(ex9.topAt, ex9.topRun, ex9.w), want9 = norm9(d9.topAt, d9.topRun, ex9.w);
          if (got9 !== want9) bad9.push(nm9 + " " + ex9.id + ": stored " + got9 + ", history derives " + want9);
        }
      };
      scan9("A", settle(cl(A)));
      if (B) { scan9("B", settle(cl(B)));
        /* RAW, before any settling boot: a merged state is handed to the running app
           as-is, and merge-fixed-point already holds the merge to a settled output. */
        scan9("A<-B raw", T.mergeState(cl(A), cl(B)));
        scan9("B<-A raw", T.mergeState(cl(B), cl(A)));
        scan9("A<-B", settle(T.mergeState(cl(A), cl(B))));
        scan9("B<-A", settle(T.mergeState(cl(B), cl(A)))); }
      return bad9.length ? { got: bad9.join(" | ") } : null; } },
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
    check: (A, B) => { const once = settle(T.mergeState(cl(A), cl(A)));
      const twice = settle(T.mergeState(cl(once), cl(once)));
      if (!DEQ(once, twice)) return { got: "merge(A,A) is not a fixed point at " + firstDiff(once, twice), paths: deepPaths(once, twice) };
      if (!DEQ(T.migrate(cl(once)), once)) return { got: "a settled state is not a fixed point at " + firstDiff(T.migrate(cl(once)), once), paths: deepPaths(T.migrate(cl(once)), once) };
      /* AND THE RESULT OF A TWO-DEVICE MERGE (Sol, pass 3): merge(A,A) is the
         degenerate case; the state a real sync produces must itself be a fixed
         point, or the second sync rewrites what the first one wrote. */
      if (!B) return null;
      const ab = settle(T.mergeState(cl(A), cl(B))), abab = settle(T.mergeState(cl(ab), cl(ab)));
      return DEQ(ab, abab) ? null : { got: "merge(A,B) is not a fixed point at " + firstDiff(ab, abab), paths: deepPaths(ab, abab) }; } },

  { name: "merge-fixed-point",
    says: "the state a two-device merge produces is byte-stable under a second merge, its feed is newest-first, and its receipts (carve, adoptshift) are projections of it",
    /* SOL'S PASS-3 HUNT: the carve receipt was prepended AFTER the feed's
       canonical newest-first sort, so the first merge left an 8/09 line above
       an 8/18 one and merge(m,m) moved it — the serialized state changed on the
       second sync. idempotence looked only at merge(A,A) and settled states,
       and the carve seed had an empty feed. This is the byte-level promise the
       app's own header makes: sessionLog and feed byte-identical through
       merge(m,m), and the feed in the order every unshift assumes. */
    check: (A, B) => {
      const desc = (f) => (Array.isArray(f) ? f : []).every((x, i, a) => i === 0 || String((a[i - 1] || {}).d || "") >= String((x || {}).d || ""));
      for (const [nm9, x9, y9] of [["A<-B", A, B], ["B<-A", B, A]]) {
        const m = T.mergeState(cl(x9), cl(y9));
        if (!desc(m.feed)) return { got: nm9 + ": the merged feed is not newest-first: " + J((m.feed || []).map((f) => f && f.d)).slice(0, 160) };
        const mm = T.mergeState(cl(m), cl(m));
        if (J(mm.feed) !== J(m.feed)) return { got: nm9 + ": merge(m,m) rewrote the feed: " + J((m.feed || []).map((f) => f && (f.d + (f.op ? "(" + f.op + ")" : "")))).slice(0, 120) + " -> " + J((mm.feed || []).map((f) => f && (f.d + (f.op ? "(" + f.op + ")" : "")))).slice(0, 120) };
        if (J(mm.sessionLog) !== J(m.sessionLog)) return { got: nm9 + ": merge(m,m) rewrote sessionLog at " + firstDiff(m.sessionLog, mm.sessionLog) };
        /* THE RECEIPT IS A PROJECTION OF THE RECORD (Sol, pass 4): for every
           date, the feed carries exactly one carve line iff the record carries a
           dropped set, naming exactly that set and the copy that stood — and no
           carve line names a date whose record has nothing dropped. Checked here
           on the merged state, unconditionally, because session-superset only
           looks at a date that lost a lift, and a lift that CAME BACK is the case
           where the receipt must shrink or vanish. */
        const dates9 = new Set([...Object.keys(m.sessionLog || {}), ...(m.feed || []).filter((f9) => f9 && typeof f9.op === "string" && f9.op.indexOf("carve:") === 0).map((f9) => f9.op.slice(6))]);
        for (const d9 of dates9) {
          const r9 = (m.sessionLog || {})[d9], want9 = r9 && Array.isArray(r9.dropped) ? r9.dropped : [];
          const ls9 = (m.feed || []).filter((f9) => f9 && f9.op === "carve:" + d9);
          if (!want9.length && ls9.length) return { got: nm9 + ": " + d9 + " has no dropped lifts but " + ls9.length + " carve line(s) still name " + J(ls9.map((f9) => f9.ids)) + " — a receipt that outlived its record" };
          if (want9.length && (ls9.length !== 1 || J(ls9[0].ids || []) !== J(want9) || ls9[0].kept !== (r9.corr ? "corrected" : "later"))) return { got: nm9 + ": " + d9 + " dropped=" + J(want9) + " but the feed carries " + J(ls9.map((f9) => [f9.ids, f9.kept])) + " — the receipt is not the record's projection" };
        }
        /* AND THE MERGE'S OTHER RECEIPT (leg 19): for every lift, exactly one
           adoptshift line iff the KEPT adopt receipt names a load that is not
           the working load — naming that working load — unless a serial line
           already tells it (the writer's own title guard); none for a lift
           whose receipt agrees, none for a lift with no receipt. A line filed
           on an intermediate merge's pick must go when a later merge overturns
           the pick. */
        const adopts9 = new Map(); for (const f9 of (m.feed || [])) if (f9 && typeof f9.op === "string" && f9.op.indexOf("adopt:") === 0 && typeof f9.w === "number") adopts9.set(f9.op.slice(6), f9);
        const shifts9 = (m.feed || []).filter((f9) => f9 && typeof f9.op === "string" && f9.op.indexOf("adoptshift:") === 0);
        const lifts9 = new Set([...adopts9.keys(), ...shifts9.map((f9) => f9.op.split(":")[1])]);
        for (const id9 of lifts9) {
          const ex9 = (m.exercises || []).find((e9) => e9 && e9.id === id9), f9 = adopts9.get(id9);
          const mine9 = shifts9.filter((x9) => x9.op.split(":")[1] === id9);
          const warranted9 = !!(f9 && ex9 && typeof ex9.w === "number" && ex9.w !== f9.w);
          if (!warranted9 && mine9.length) return { got: nm9 + ": " + id9 + " carries " + mine9.length + " adoptshift line(s) " + J(mine9.map((x9) => x9.op)) + " but " + (f9 ? "its kept adopt receipt (" + f9.w + ") agrees with the working load (" + (ex9 && ex9.w) + ")" : "it has no adopt receipt") + " — a receipt that outlived its warrant" };
          if (warranted9) {
            const t9 = String(ex9.n || "").toUpperCase() + " — LOGGED AT " + ex9.w + " (plan said " + f9.w + ")";
            const serial9 = (m.feed || []).some((x9) => x9 && x9.t === t9 && !(typeof x9.op === "string" && x9.op.indexOf("adoptshift:") === 0));
            if (!serial9 && (mine9.length !== 1 || mine9[0].op !== "adoptshift:" + id9 + ":" + ex9.w)) return { got: nm9 + ": " + id9 + " — the kept adopt receipt says " + f9.w + " and the working load is " + ex9.w + ", so exactly one adoptshift:" + id9 + ":" + ex9.w + " line is due; the feed carries " + J(mine9.map((x9) => x9.op)) };
            if (serial9 && mine9.length) return { got: nm9 + ": " + id9 + " — a serial line already tells the transition, yet " + mine9.length + " adoptshift line(s) stand beside it" };
          }
        }
        /* AND THE READ RECEIPTS (SCALE-2, Sol's closure pass 1): for every date, exactly
           one set-aside line (op-keyed, the one spelling) iff reads[] carries an
           unsealed off-window read for that date — a v7.54.18 replica's op-less
           "EVENING READ — SET ASIDE" beside the op-keyed line survived as TWO receipts
           for one read; and NO missed/gap line may stand on a date whose reads[]
           carries a clean read — the read is the disproof of the priced miss. */
        const lateWant9 = new Set(); const cleanHave9 = new Set();
        for (const r9 of (m.reads || [])) { if (!r9 || !r9.d || r9.sealed) continue; if (r9.offWindow) lateWant9.add(r9.d); else cleanHave9.add(r9.d); }
        const aside9 = (m.feed || []).filter((f9) => f9 && (f9.t === "LATE READ — SET ASIDE" || f9.t === "EVENING READ — SET ASIDE" || (typeof f9.op === "string" && f9.op.indexOf("lateread:") === 0)));
        for (const f9 of aside9) { if (!lateWant9.has(f9.d)) return { got: nm9 + ": a set-aside receipt stands on " + f9.d + " (" + (f9.op || f9.t) + ") but reads[] has no off-window read that day" }; }
        for (const d9 of lateWant9) { const n9 = aside9.filter((f9) => f9.d === d9).length; if (n9 !== 1) return { got: nm9 + ": " + d9 + " has " + n9 + " set-aside receipts for its one off-window read" }; }
        const missed9 = (m.feed || []).filter((f9) => f9 && typeof f9.t === "string" && (f9.t.indexOf("MORNING READ MISSED") === 0 || f9.t.indexOf("READ GAP") === 0) && cleanHave9.has(f9.d));
        if (missed9.length) return { got: nm9 + ": " + missed9.length + " missed/gap line(s) stand on a date with a clean read (" + missed9[0].d + ") — the merge did not heal the disproven receipt" };
      }
      return null; } },

  { name: "keyless-max-multiset",
    says: "a keyless store (op-less feed lines, forecasts) merges as a max-multiset by CANONICAL identity — per line, the merged count is the larger side's count, and key order is not identity",
    /* SOL'S PASS-6 HUNT: MERGE_MULTI keyed the union on raw JSON.stringify, so a
       canonically-equal line in another key order was a second identity — two
       copies against one emitted three, in the feed and in forecasts, and the
       inflation was permanent. No law counted: non-shrink asks only that the
       result is not SMALLER, and DEQ, which ignores key order, saw the two
       directions agree. Judged on the raw merge (before settling), so what is
       counted is exactly what the union emitted; op-keyed lines are reconciled
       to one per op by the dedup and are not a multiset. */
    check: (A, B) => {
      const c9 = (v) => J(canon(v));
      const tally = (arr, keep) => { const m = new Map(); for (const x of (Array.isArray(arr) ? arr : [])) { if (!keep(x)) continue; const k = c9(x); m.set(k, (m.get(k) || 0) + 1); } return m; };
      const opless = (x) => !(x && x.op != null) && !isProjection(x), all = () => true;   /* SCALE-2 — a projection (incl. the op-less legacy set-aside spelling and missed/gap receipts) is derived state, not a multiset member: reconcileReadReceipts removes and re-derives it from the merged reads */
      for (const [nm9, x9, y9] of [["A<-B", A, B], ["B<-A", B, A]]) {
        const m = T.mergeState(cl(x9), cl(y9));
        for (const [store, keep] of [["feed", opless], ["forecasts", all]]) {
          const ta = tally(x9[store], keep), tb = tally(y9[store], keep), tm = tally(m[store], keep);
          for (const k of new Set([...ta.keys(), ...tb.keys(), ...tm.keys()])) {
            const want = Math.max(ta.get(k) || 0, tb.get(k) || 0), got = tm.get(k) || 0;
            if (got !== want) return { got: nm9 + ": " + store + " carries " + got + " of " + k.slice(0, 90) + " — the sides carry " + (ta.get(k) || 0) + " and " + (tb.get(k) || 0) + ", so the max-multiset union says " + want };
          }
        }
      }
      return null; } },

  { name: "day-order-kept",
    says: "a day's within-day sequence is kept when the sides do not disagree about it — both carry the same sequence, or only one carries the day — and is put in one canonical order only when they differ",
    /* COWORK, generalising Sol's pass-6 repair: _feedDayOrder's differ branch
       fired for a day the OTHER side had no lines for, so the most common sync
       (one device a day ahead; a second device's first sync; a restore) put the
       athlete's own within-day chronology in alphabetical order — sticky, and
       a regression against main, whose union emits a one-sided day as it is.
       And its equal branch compared the sides RAW, so a day two devices carried
       with a line's keys in different orders was "different" and canonicalised.
       The law: for every day where a side is silent or both carry canonically
       the same sequence, the merged day, read through the lines that side
       carried, is that side's sequence — merge-time receipts may be added and
       an op line may be reconciled away, so both are read through each other's
       multiset; carve and adoptshift lines are projections (merge-fixed-point)
       and set aside. */
    check: (A, B) => {
      const c9 = (v) => J(canon(v));
      const noCarve = (f) => (Array.isArray(f) ? f : []).filter((x) => !isProjection(x));
      const days = (f) => { const m = new Map(); for (const x of noCarve(f)) { const d = String((x && x.d) || ""); if (!m.has(d)) m.set(d, []); m.get(d).push(x); } return m; };
      const through = (seq, other) => { const have = new Map(); for (const x of other) { const k = c9(x); have.set(k, (have.get(k) || 0) + 1); } const out = []; for (const x of seq) { const k = c9(x), n = have.get(k) || 0; if (n > 0) { out.push(x); have.set(k, n - 1); } } return out; };
      for (const [nm9, x9, y9] of [["A<-B", A, B], ["B<-A", B, A]]) {
        const m = T.mergeState(cl(x9), cl(y9));
        const dx = days(x9.feed), dy = days(y9.feed), dm = days(m.feed);
        for (const d of new Set([...dx.keys(), ...dy.keys()])) {
          const a = dx.get(d) || [], b = dy.get(d) || [];
          if (!(c9(a) === c9(b) || !a.length || !b.length)) continue;   /* the sides disagree — canonical order is the rule there, and convergence judges it */
          const side = a.length ? a : b, got = dm.get(d) || [];
          const want9 = through(side, got), got9 = through(got, side);
          if (c9(want9) !== c9(got9)) return { got: nm9 + ": " + d + " — " + (a.length && b.length ? "both sides carry the same sequence" : "only one side carries the day") + " " + J(side.map((f) => f && String(f.t || f.op || "").slice(0, 14))).slice(0, 110) + " but the merge emitted " + J(got9.map((f) => f && String(f.t || f.op || "").slice(0, 14))).slice(0, 110) };
        }
      }
      return null; } },

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

  { name: "session-superset",
    says: "every lift either side had on a date is still on that date after the merge",
    /* mergeState's own header promises a SUPERSET of both sides and nothing
       checked it at session grain: non-shrink compares COUNTS against max(A,B),
       so {rows} vs {curl} landing on {curl} reads as 1 >= 1 and passes while a
       whole session is gone. Counts are not identities.
       THE ONE EXEMPTION, checked and counted rather than trusted: a record
       carrying a corr and NO corrLog wins wholesale, so the plain side's lifts
       can be dropped. That carve-out is deliberate (see _mergeSession) and the
       law asserts it is only ever taken in exactly that shape. */
    check: (A, B, C, ctx) => {
      for (const [nm9, m9] of [["A<-B", settle(T.mergeState(cl(A), cl(B)))], ["B<-A", settle(T.mergeState(cl(B), cl(A)))]]) {
        for (const d9 of new Set([...Object.keys(A.sessionLog || {}), ...Object.keys(B.sessionLog || {})])) {
          const ids = (r9) => new Set([...((r9 && r9.entries) || []), ...((r9 && r9.skipped) || [])].map((e) => e && e.id).filter(Boolean));
          const ra = (A.sessionLog || {})[d9], rb = (B.sessionLog || {})[d9], rm = (m9.sessionLog || {})[d9];
          const want = new Set([...ids(ra), ...ids(rb)]), got = ids(rm);
          const miss = [...want].filter((i9) => !got.has(i9));
          if (!miss.length) continue;
          /* THE EXEMPTION IS THE PRODUCTION PREDICATE, NOTHING WIDER: the two
             bodies differ, NEITHER side carries a corrLog (so the union is
             empty), and a side carries a corr. Sol's counterexample: a mutant
             that carved with the union non-empty stayed green because the old
             exemption asked only whether some side had a corr and no corrLog. */
          const validCorr = (v9) => !!(v9 && v9.corr && v9.corr.at && isFinite(Date.parse(v9.corr.at)));
          const hasLog = (v9) => !!(v9 && Array.isArray(v9.corrLog) && v9.corrLog.length);
          const canonBody = (v9) => J(canon({ e: (v9 && v9.entries) || [], s: (v9 && v9.skipped) || [] }));
          const predicate = canonBody(ra) !== canonBody(rb) && !hasLog(ra) && !hasLog(rb) && (validCorr(ra) || validCorr(rb));
          if (!predicate) return { got: nm9 + ": " + d9 + " lost " + J(miss) + " — mergeState promises a superset of both sides (and the carve predicate does not hold here)" };
          /* the miss must be exactly what a wholesale pick could discard: lifts of the side that lost */
          const fromA = miss.every((i9) => ids(rb).has(i9) && !ids(ra).has(i9)), fromB = miss.every((i9) => ids(ra).has(i9) && !ids(rb).has(i9));
          if (!(fromA || fromB)) return { got: nm9 + ": " + d9 + " lost " + J(miss) + " — not the shape of a wholesale pick (lifts missing from both sides' contributions)" };
          /* A CARVE MUST LEAVE ITS RECEIPT — on the record and in the feed */
          const dr9 = Array.isArray(rm && rm.dropped) ? rm.dropped : [];
          if (!miss.every((i9) => dr9.indexOf(i9) >= 0)) return { got: nm9 + ": " + d9 + " carved " + J(miss) + " and the record's dropped receipt says " + J(dr9) + " — a silent carve" };
          const fl9 = (m9.feed || []).filter((f9) => f9 && f9.op === "carve:" + d9);
          if (fl9.length !== 1 || J(fl9[0].ids || []) !== J(dr9)) return { got: nm9 + ": " + d9 + " carved " + J(miss) + " and the feed does not carry exactly one carve line naming " + J(dr9) + " (found " + fl9.length + ": " + J(fl9.map((f9) => f9.ids)) + ") — a silent or a doubled carve" };
          /* RECEIPT TRUTH (Sol, pass 3): the line says which copy stood. It must
             match the record it describes — a record that kept its corr was the
             corrected copy; a record without one was the copy completed after
             the correction. And the title claims nothing it cannot know. */
          const kept9 = rm && rm.corr ? "corrected" : "later";
          if (fl9[0].kept !== kept9) return { got: nm9 + ": " + d9 + " the receipt says kept=" + J(fl9[0].kept) + " but the record that stood is the " + kept9 + " copy — a false receipt" };
          if (fl9[0].t !== "MERGE KEPT ONE WHOLE SESSION — " + d9) return { got: nm9 + ": " + d9 + " the receipt's title claims more than the merge knows: " + J(fl9[0].t) };
          /* DECLARED AND COUNTED: an aimed seed says it expects the carve; any other firing is a finding */
          CARVE_FIRINGS.push((ctx && ctx.seed) + ":" + nm9 + ":" + d9);
          if (!(ctx && ctx.aim && ctx.aim.expectsCarve)) return { got: nm9 + ": " + d9 + " the carve fired (" + J(miss) + ") in a seed that does not declare it — an undeclared superset exception" };
        } }
      return null; } },

  { name: "session-fixed-point",
    says: "a merge with oneself touches no session record, and a boot changes nothing but the additive corrLog",
    /* THE LAW LEG 9's TWO REGRESSIONS NEEDED. Both were real, both were caught
       on his live ledger by hand, both were fixed at leg 10 — and the harness
       could not see either: idempotence compares settle(merge(A,A)) to
       settle(merge(once,once)), and a deterministic id-sort passes that
       happily while reordering five of his sessions on every sync. The round's
       doctrine is that every fixed defect gets a witness that goes red on the
       pre-fix engine, so here it is, stated as the two promises those fixes
       restored: a sync must not rewrite a record both sides already agree on,
       and a boot must not rewrite an athlete's stamp. */
    check: (A) => {
      const s9 = settle(A);
      const self9 = T.mergeState(cl(s9), cl(s9));
      /* AND THE FEED (Sol pass 3, CC leg 15, cowork's probe): a settled state's
         feed is newest-first, and a merge with oneself does not touch it — a
         boot that files a receipt at the head regardless of date, or a merge
         that files one after its sort, leaves a feed the next merge rewrites. */
      const desc9 = (f) => (Array.isArray(f) ? f : []).every((x, i, a) => i === 0 || String((a[i - 1] || {}).d || "") >= String((x || {}).d || ""));
      if (!desc9(s9.feed)) return { got: "a settled state's feed is not newest-first: " + J((s9.feed || []).map((f) => f && f.d)).slice(0, 160) };
      /* the FIRST self-merge may file a receipt a boot does not (the adoptshift
         line is a merge-time writer) — so the promise is the same one idempotence
         makes: newest-first, and a fixed point FROM the first merge. */
      if (!desc9(self9.feed)) return { got: "merge(A,A) left the feed out of newest-first order: " + J((self9.feed || []).map((f) => f && f.d)).slice(0, 160) };
      const again9 = T.mergeState(cl(self9), cl(self9));
      if (J(again9.feed) !== J(self9.feed)) return { got: "merge(A,A) is not a feed fixed point: " + J((self9.feed || []).map((f) => f && f.d)).slice(0, 100) + " -> " + J((again9.feed || []).map((f) => f && f.d)).slice(0, 100) };
      /* AND THE LINES A ALREADY HAD KEEP THEIR ORDER AND MULTIPLICITY (Sol, pass 5):
         a self-merge may ADD a merge-time receipt, but the lines A carried must
         come out in A's order — [X, Y, X] came out [X, X, Y] once the equal-day
         branch kept the union's grouped order. Carve and adoptshift lines are
         projections (judged by merge-fixed-point) and are set aside here. */
      const noCarve9 = (f) => (Array.isArray(f) ? f : []).filter((x) => !isProjection(x));   /* projections (carve, and since leg 19 adoptshift) are re-derived and re-placed by every merge */
      const had9 = new Map(); for (const f of noCarve9(s9.feed)) { const k = J(f); had9.set(k, (had9.get(k) || 0) + 1); }
      const kept9 = []; for (const f of noCarve9(self9.feed)) { const k = J(f), c = had9.get(k) || 0; if (c > 0) { kept9.push(f); had9.set(k, c - 1); } }
      if (J(kept9) !== J(noCarve9(s9.feed))) return { got: "merge(A,A) rewrote the order or multiplicity of the lines A already had: " + J(noCarve9(s9.feed).map((f) => f && (f.t || "").slice(0, 12))).slice(0, 120) + " -> " + J(kept9.map((f) => f && (f.t || "").slice(0, 12))).slice(0, 120) };
      const booted8 = T.migrate(cl(A));
      if (!desc9(booted8.feed)) return { got: "a boot left the feed out of newest-first order: " + J((booted8.feed || []).map((f) => f && f.d)).slice(0, 160) };
      for (const d9 of Object.keys(s9.sessionLog || {})) {
        if (J((self9.sessionLog || {})[d9]) !== J((s9.sessionLog || {})[d9])) {
          return { got: "merge(A,A) rewrote " + d9 + ": " + J((s9.sessionLog || {})[d9]).slice(0, 120) + " -> " + J((self9.sessionLog || {})[d9]).slice(0, 120) };
        } }
      const strip9 = (x9) => Object.fromEntries(Object.entries(x9.sessionLog || {}).map(([d9, r9]) => { const c9 = { ...r9 }; delete c9.corrLog; return [d9, c9]; }));
      /* the boot half is judged on the RAW replica, not the settled one: by the
         time a state is settled the patch backfill has already run, so a boot
         that rewrites stamps has already done it and comparing after is
         comparing a state to itself. "A boot must not rewrite what he has"
         is a claim about the FIRST boot. */
      const booted9 = T.migrate(cl(A));
      if (J(strip9(booted9)) !== J(strip9(A))) {
        for (const d9 of Object.keys(strip9(A))) if (J(strip9(booted9)[d9]) !== J(strip9(A)[d9])) return { got: "a boot rewrote " + d9 + " beyond the additive corrLog: " + J(strip9(A)[d9]).slice(0, 110) + " -> " + J(strip9(booted9)[d9]).slice(0, 110) };
      }
      return null; } },

  { name: "self-consistent",
    says: "a record agrees with its own history: replaying its corrLog over its own body changes no placement",
    /* THE INVARIANT L5-b BREAKS, stated as a law at last. It was only ever an
       aimed seed's ASSERT, so breaking the writer made the scenario fail to
       form — an aimed-scenario, which N-1 rightly refuses to credit as a law,
       and which reads as harness noise on an old engine rather than as the
       defect it is. Cheap and exact: if a device's own acts do not order
       themselves, its body and a replay of its own corrLog disagree, and every
       merge from then on carries the contradiction. */
    check: (A, B, C) => {
      const place9 = (r9) => J({ e: ((r9 && r9.entries) || []).map((e) => e && e.id).sort(), s: ((r9 && r9.skipped) || []).map((z) => z && z.id).sort() });
      for (const [nm9, s9] of [["A", A], ["B", B], ["C", C]]) {
        if (!s9) continue;
        for (const [d9, r9] of Object.entries(s9.sessionLog || {})) {
          if (!((r9 && r9.corrLog) || []).length) continue;
          if (typeof T._replayCorrections !== "function") continue;
          const after9 = T._replayCorrections(cl(r9));
          if (place9(r9) !== place9(after9)) return { got: nm9 + ": " + d9 + " — the body says " + place9(r9) + " and a replay of its OWN corrLog says " + place9(after9) };
        } }
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
  { seed: 14428, why: "the 8/14 patch-backfill shape: two un-skip corrections the feed proves, both carrying that record's single corr.at. MUTATION IT GUARDS: applying the monotone bump to PATCH filings, which spaces them a millisecond apart and moves the athlete's own correction stamp on every boot", redAt: "87ced89" },
  { seed: 14425, why: "Sol's R-1 probe: equal (corr.at, rev, tieKey), rows logged on one side and initially skipped on the other. MUTATION IT GUARDS: deciding placement from the base, whose last tie returns its first argument — merge order", redAt: "b9dd905" },
  { seed: 14426, why: "the L5-b probe THROUGH the production writer: three acts whose third wall stamp repeats the first. MUTATION IT GUARDS: the monotone rule not reaching the op KEY, so the third act collides with the first and is dropped", redAt: "b9dd905" },
  { seed: 14427, why: "a lift whose own wAt post-dates the entry's wCorrAt — the athlete's later word. MUTATION IT GUARDS: the reconciler adopting anyway, which is the leg-3 bleed pointed at his own edit", redAt: "—" },
  { seed: 14424, why: "two devices logging DIFFERENT sessions on one date with no corrections anywhere. MUTATION IT GUARDS: returning the record-level pick early whenever no side carries a correction — which loses one device's session outright, in both orders, and is not associative", redAt: "b9dd905" },
  { seed: 14423, why: "THREE corrected replicas tying on (corr.at, rev), each with a different copy of the shared lift and one lift the others lack. MUTATION IT GUARDS: letting the (at,rev) tie consult _mergeScore — once bodies accumulate, size is a function of the GROUPING, so the intermediate record wins the base and (A+B)+C disagrees with A+(B+C)", redAt: "4b5704a" },
  { seed: 14421, why: "two corrected records tying on corr.at, rev AND _mergeScore with different bodies. MUTATION: the base tie falling back to _richer, which ties to its second argument — merge order", redAt: "dd29e8a" },
  { seed: 14422, why: "rows skipped WITH an amend naming it on one side, logged with no placement op on the other. MUTATION: reading 'any correction naming this lift' as deciding placement, which leaves the lift in both arrays", redAt: "dd29e8a" },
  { seed: 883544, why: "a later act carrying an earlier stamp (a non-monotone device clock), so the replica's own body and the replay of its own corrLog disagree. Found by --explore; 17 of 17 remaining hits were this one class", redAt: "3a7edc4" },
  { seed: 1422036, why: "THE TRANSIENT-RUNG WITNESS, found by --explore and promoted: three replicas whose (w,steps) pairs each win a different sub-merge. MUTATION IT GUARDS: putting the ladder repair back at the binary merge, where it inserts a rung for a load no final state holds and makes the groupings disagree", redAt: "7cb83d2" },
  { seed: 14420, why: "THE RESTORE DRILL: a pre-correction backup rejoins carrying ONE legitimate new correction. MUTATION IT GUARDS: replaying the union over a body one side WON instead of over the accumulated body — which silently reverted two ✕s and deleted two entries, 7 to 5, identically in both orders, so convergence reported green over the loss", redAt: "4d41e2d" },
  { seed: 14419, why: "a lift whose only logged line is skipped away on both sides, so the boot cannot re-derive its caches, with the same load stamp on each so nothing rides. MUTATIONS: the unstamped-cache tie left to arrival order, and the caches not riding the load at all — both of which put lastMeta.rir/rirSets on the merge order", redAt: "87143ac" },
  { seed: 14418, why: "one device's corrections cancelling out, merged against a device that never heard of them. MUTATION: replay writing an empty skipped[] instead of deleting the key — an empty array and an absent one carry the same information but not the same shape, and the difference is visible by merge order", redAt: "87143ac" },
  { seed: 14417, why: "the corrLog ordering rule: the same correction filed at two instants with a third correction between them. MUTATIONS: earliest-wins flipped to latest, in _fileCorr or in the union. Not an equivalent mutant — it only looked like one while every correction shared the frozen suite clock", redAt: "87143ac" },
  { seed: 14429, why: "SOL'S PASS-2 P0: correction-free session METADATA — three uncorrected copies with equal-score bodies; the note (every non-body field) rode the base pick, which read the body's size, which is a function of the grouping. MUTATION IT GUARDS: meta-by-size (case 1 back to _richer)", redAt: "7ef2079" },
  { seed: 14430, why: "the same body with a different note: the identical-bodies short-circuit returned a base chosen by size, so equal-length notes resolved by merge order. MUTATION IT GUARDS: meta-by-size", redAt: "7ef2079" },
  { seed: 14431, why: "THE CARVE, DECLARED: a legacy corr-no-ops record against a plain replica with an unrelated extra lift — the wholesale pick keeps the corrected body, files dropped=[curl] on the record and ONE feed line keyed on the date naming the set; a third plain replica with another extra makes the three groupings agree on dropped=[curl,hack] and on that one line. MUTATION IT GUARDS: carve-silent (the receipt not written)", redAt: "7ef2079 (no receipt)" },
  { seed: 14433, why: "SOL'S PASS-3 P0: the exact-authority tie — three legacy corrected copies with equal (corr.at, rev, non-body fields) and disjoint bodies; the carve kept whichever record was the FIRST ARGUMENT. MUTATION IT GUARDS: tie-by-argument-order", redAt: "4de310e" },
  { seed: 14434, why: "RECEIPT TRUTH: a plain copy completed AFTER the correction wins (the standing rule) — the receipt must say the later copy stood, not the corrected one. MUTATION IT GUARDS: receipt-claims-corrected", redAt: "4de310e" },
  { seed: 14437, why: "SOL'S PASS-4 P0 (A): the FULL RETURN — a carve state (dropped [rows] + receipt) meets a correction that restores rows; the record's dropped set empties and the receipt must go with it. MUTATION IT GUARDS: receipt-not-cleared", redAt: "2c157a6" },
  { seed: 14438, why: "SOL'S PASS-4 P0 (B): PARTIAL RETURN + STALE REJOIN — stale [hack,rows] against current [hack]; the writer trusted the first matching line and the op-dedup kept the stale duplicate, so the receipt differed by direction and changed on self-merge. MUTATION IT GUARDS: receipt-keeps-others", redAt: "2c157a6" },
  { seed: 14442, why: "SOL'S PASS-6: two copies of a line against one canonically-equal copy in another key order emitted THREE, in the feed and in forecasts — MERGE_MULTI keyed the max-multiset union on raw JSON. MUTATION IT GUARDS: keyless-raw-json-identity", redAt: "0c0c11c" },
  { seed: 14443, why: "COWORK (leg 19): a day only ONE side carries took _feedDayOrder's differ branch and came out alphabetical — the one-device-ahead sync rewrote his within-day chronology, and main kept it. MUTATION IT GUARDS: one-sided-day-canonicalized", redAt: "0c0c11c" },
  { seed: 14444, why: "COWORK (leg 19): the equal branch compared the sides RAW, so one day carried in two key orders was canonicalised and its interleaved repeat regrouped. MUTATION IT GUARDS: equal-day-raw-identity", redAt: "0c0c11c" },
  { seed: 14445, why: "COWORK (leg 19): the op-dedup's d-tie compared RAW entries; with the union's identity canonical the spelling that reaches the tie is the local side's, so one receipt in two key orders against a different telling of the same op settled differently by grouping. MUTATION IT GUARDS: dedup-tie-raw", redAt: "— (opened by the identity repair; red under its mutation, never at a committed tip)" },
  { seed: 14448, why: "SOL'S PASS-7 HUNT: a stale projection (carve AND adoptshift) carried by ONE replica made two identical days differ; the day was canonicalised, the stale lines then removed correctly, and the permanent lines stayed alphabetical. MUTATION IT GUARDS: projections-enter-day-order", redAt: "3e544d0" },
  { seed: 14450, why: "SCALE-2 (Sol pass 1, rows 2+H1): a v7.54.18 replica's op-less EVENING line beside the op-keyed LATE line survived as two receipts for one read, and a false MORNING READ MISSED outlived the clean read that disproves it. MUTATIONS IT GUARDS: lateread-not-projected, missed-not-healed", redAt: "0d1719b" },
  { seed: 14451, why: "SCALE-2 (Sol pass 1, row 3a): a partial replica's honest replay met the full read set; the union carried the superset while trend/pt/weekly rode the richer copy — divergent by direction. MUTATION IT GUARDS: trend-chain-not-derived", redAt: "0d1719b" },
  { seed: 14454, why: "PROGRESSION-1 FIX-2 (A6): two devices each banked their own FIRST sighting of the same load on different days. Serially that is two sightings and the lift earns; the merge picked one whole lift record and the counter rode inside it, so the merged state claimed one — a number its own merged history cannot produce. The corpus had no seed where the stored record and the derivation could disagree, so sighting-faithful was green under every mutant and checked nothing. MUTATIONS IT GUARDS: derive-not-at-merge", redAt: "f3254f1 (feat/progression-1, before A6)" },
  { seed: 14453, why: "PROGRESSION-1: a stale replica carrying an insertion seam stamped by the day the code ran (the eleven that froze his lifts) meets the corrected state — the seam and its feed line must not come back from either direction, which is why a context seam is DERIVED at every boundary rather than deleted once. MUTATIONS IT GUARDS: seams-not-projected, seam-derivation-uses-marker-date", redAt: "7676140 (main at v7.55.9)" },
  { seed: 14452, why: "SCALE-2 (Sol pass 1, row 4): the decision converged while its EFFECT (targets.*) rode local-wins; and a same-card conflict left the losing approval's target standing. MUTATION IT GUARDS: effects-not-derived", redAt: "0d1719b" },
  { seed: 14449, why: "SCALE-1 (cowork, 2026-08-19, live): the analyst-card decisions (suggestionLog) rode {...remote, ...local} — a decision tapped on one device was reverted when a stale device synced after it, and the same card decided on two devices settled by merge direction. MUTATIONS IT GUARDS: decisions-wholesale, decision-tie-by-device (both → convergence)", redAt: "f72dbf7 (main at v7.54.18)" },
  { seed: 14447, why: "COWORK (leg 19): a replica already carrying a stale adoptshift line (its kept receipt agrees with the working load) — every merge kept it. MUTATION IT GUARDS: adoptshift-not-projected", redAt: "0c0c11c (and every tip since the writer)" },
  { seed: 14446, why: "COWORK (leg 19): the adoptshift receipt was filed on an intermediate merge's pick and outlived the pick when a later merge overturned it — (A+B)+C carried a line A+(B+C) never filed. MUTATION IT GUARDS: adoptshift-not-projected", redAt: "0c0c11c (and every tip since the writer)" },
  { seed: 14440, why: "SOL'S PASS-5: interleaved repeats — [X, Y, X] on every replica came out of merge(A,A) as [X, X, Y]: the equal-day branch kept the union's identity-grouped order instead of the sequence both sides carried. MUTATION IT GUARDS: equal-day-uses-grouped-union", redAt: "6081f7f" },
  { seed: 14441, why: "SOL'S PASS-5 ASSOCIATIVITY WITNESS: A [Y,Y,X] · B [Y,X,Y] · C [Y,X,Y] — (A+B)+C settled [X,Y,Y] and A+(B+C) [Y,Y,X]. MUTATION IT GUARDS: equal-day-uses-grouped-union", redAt: "6081f7f" },
  { seed: 14439, why: "SOL'S PASS-4 HUNT: two replicas each wrote a DIFFERENT line on the same day; the union put the remote side first and the within-day sort kept arrival order, so the feed reversed by direction. MUTATION IT GUARDS: same-day-by-arrival", redAt: "2c157a6" },
  { seed: 14436, why: "THE MERGE'S OWN LATE WRITER: reconcileEraTransitions files the adoptshift line (dated at the lift's wAt) at the END of mergeState by unshift — after the sort, the merged feed was not newest-first and the next merge moved it. MUTATION IT GUARDS: merge-sort-not-last", redAt: "489e892" },
  { seed: 14435, why: "THE FEED'S FIXED POINT: a carve beside a feed line newer than the session — the receipt was prepended after the newest-first sort, so merge(m,m) moved it. MUTATION IT GUARDS: feed-unsorted", redAt: "4de310e" },
  { seed: 14432, why: "legacy vs modern: a corr-no-ops record against a corrLog-carrying one — the union is non-empty, so the carve must NOT fire and both lifts survive. MUTATION IT GUARDS: carve-ignores-union", redAt: "—" },
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
/* N-1 — EACH LAW-OWNED ROW NAMES THE LAW IT GUARDS (6th field). It is credited
   ONLY when THAT law goes red; other laws that happen to break are printed as
   "also" and credit nothing, and the covered-law set is built from declared,
   matched expectations only. Sol's counterexample: a row saying athlete-word
   was credited by convergence, and every incidentally broken law was counted
   as "having a mutation". */
const MUTATIONS = [
  ["valOr-raw", "law", "the equal-stamp tie compares raw JSON.stringify again, so absent is unorderable and the base always wins", `_valOr(other[f9]) > _valOr(w2[f9])`, `JSON.stringify(other[f9]) > JSON.stringify(w2[f9])`, "convergence"],
  ["union-drops-remote", "law", "the corrLog union reads only one side — a correction one device filed is gone and the ledger shrinks", `for (const c9 of [...(Array.isArray(x && x.corrLog) ? x.corrLog : []), ...(Array.isArray(y && y.corrLog) ? y.corrLog : [])]) {`, `for (const c9 of [...(Array.isArray(y && y.corrLog) ? y.corrLog : [])]) {`, ["correction-survival", "non-shrink"]],
  ["replay-disabled", "pin", "the union is carried but never replayed", `  const out9 = _replayCorrections(merged);`, `  const out9 = merged;`],
  ["base-votes", "law", "the base stops accumulating — a lift only one side had is gone and the date's count shrinks", `  const ents9 = addMissing("entries"); if (ents9 !== undefined) merged.entries = ents9;`, `  const ents9 = undefined; if (ents9 !== undefined) merged.entries = ents9;`, "session-superset"],   /* non-shrink no longer sees this one: the receipt now accounts for a lift lost on ANY path by name, so the count holds — session-superset judges the predicate and is red regardless */
  ["idempotence-normalizes-forever", "law", "the plan normalizer re-stamps on every merge, so merge(A,A) never reaches a fixed point", `  out.plan = _unionPlan(remote.plan, local.plan);`, `  out.plan = { ..._unionPlan(remote.plan, local.plan), rev: ((local.plan || {}).rev || 0) + 1 };`, "idempotence"],
  ["athlete-word-ignored", "law", "the reconciler adopts even when the athlete's own stamp is newer than the correction's", `      if (!(at > String(ex.wAt || ""))) continue;`, `      if (false) continue;`, "athlete-word-priority"],
  ["receipt-names-the-old-load", "law", "the reconciliation receipt names the load being replaced instead of the one written", `" " + from + " → " + enC.w, how: "The corrected record says " + enC.w`, `" " + from + " → " + from, how: "The corrected record says " + from`, "receipt-truth"],
  ["merge-self-reorders", "law", "the identical-bodies short-circuit is dropped, so a merge with oneself replays and id-sorts a record both sides already agree on", `  if (sameBody9) return finish9(union.length`, `  if (false) return finish9(union.length`, "session-fixed-point"],
  ["boot-restamps", "law", "the monotone bump is applied to PATCH filings too, so a boot rewrites the athlete's own correction stamps", `    if ((opts && opts.live) && latest9 && String(at9) <= latest9) {`, `    if (latest9 && String(at9) <= latest9) {`, "session-fixed-point"],
  ["fileCorr-not-monotone", "law", "a live act filed with a backward wall stamp keeps it, so a record's own acts stop ordering themselves and its body contradicts a replay of its own corrLog", `    if ((opts && opts.live) && latest9 && String(at9) <= latest9) {`, `    if (false) {`, "self-consistent"],
  ["ladder-repair-at-merge", "law", "the ladder repair is put BACK at the binary merge, where it inserts a rung for a load only the transient pair holds", `      return w2;`, `      return ensureLoadOnLadder(w2);`, "associativity"],
  ["ladder-repair-off", "law", "the load/ladder invariant is dropped at the BOOT — its only site now that the merge is pure", `    for (let i9 = 0; i9 < exs9.length; i9++) exs9[i9] = ensureLoadOnLadder(exs9[i9]);`, `    for (let i9 = 0; i9 < exs9.length; i9++) exs9[i9] = exs9[i9];`, "load-on-ladder"],
  ["sameload-cache-claim", "law", "the same-load refill trusts the cache's own claim again", `      const dm0 = deriveLastMeta(s, ex.id);`, `      const dm0 = ex.lastMeta;`, "reseed-integrity"],
  ["reseed-overwrite", "law", "the heal overwrites a deliberate reseed", `      if (ex.last != null) { if (JSON.stringify(ex.last) !== JSON.stringify(dm.reps)) ex.last = dm.reps.slice(); }`, `      ex.last = dm.reps.slice();`, "reseed-integrity"],
  ["steps-unstamped", "law", "the ladder leaves the stamp discipline", `["w", "wAt"], ["steps", "stepsAt"]];`, `["w", "wAt"]];`, "convergence"],
  ["caches-do-not-ride", "law", "last and lastMeta stop riding the load", `  if (f9 === "w") for (const c9 of CACHE_RIDERS) { if (c9 in other) n2[c9] = other[c9]; else delete n2[c9]; }`, `  /* mutant */`, "stamp-value-coupling"],
  ["cache-tie-nondeterministic", "law", "the unstamped cache tie goes back to arrival order", `        for (const c9 of CACHE_RIDERS) if (_valOr(other[c9]) > _valOr(w2[c9])) w2 = { ...w2, [c9]: other[c9] };`, `        /* mutant */`, "convergence"],
  ["union-payload-by-arrival", "pin", "one key with two payloads resolves by arrival instead of by value", `      else if (_canonJ(c9.to) > _canonJ(p9.to)) p9.to = c9.to;`, `      else if (false) p9.to = c9.to;`],
  ["unskip-not-authoritative", "pin", "the un-skip payload stops restating an existing entry", `          else ents = ents.map((e9) => (e9 && e9.id === c9.id ? { ...e9, ...JSON.parse(JSON.stringify(c9.to)) } : e9));`, `          else ents = ents;`],
  /* backfill-partial is RETIRED: it mutated patchV57's general sweep over skipped[],
     and FIX 1 deleted that sweep — the row would be testing code the leg removed on
     purpose. A stale mutation is worse than none, because it reads as coverage. */
  ["mutual-exclusion-off", "pin", "a lift is allowed to sit in entries AND skipped at once", `      if (named9.has(id9)) continue;`, `      if (true) continue;`],
  /* base-tie-by-order is RETIRED and the reason matters: once the tie path
     resolves the body PER LIFT, the base pick no longer reaches entries at
     all, so reverting it to _richer is an equivalent mutant on every committed
     shape. tie-reads-record-size is the row that guards this property now. A
     row that cannot fail reads as coverage and is worse than no row. */
  ["fabricate-skip-provenance", "pin", "the backfill invents a correction for every id in skipped[] — P0#1, membership read as provenance", `  s.v = 57; return s;`, `  for (const d9 of Object.keys((s && s.sessionLog) || {})) { const r9 = s.sessionLog[d9]; const a9 = r9 && r9.corr && r9.corr.at; if (!a9) continue; for (const z9 of (r9.skipped || [])) if (z9 && z9.id) _fileCorr(r9, "skip:" + d9 + ":" + z9.id + ":" + a9, "skip", z9.id, a9); } s.v = 57; return s;`],
  ["tie-reads-record-size", "law", "the (at,rev) tie resolves the body per RECORD again instead of per lift — and a record-level pick stops being associative once the record it compares has grown", `    merged.entries = perLift("entries");`, `    merged.entries = (Array.isArray(base.entries) ? base.entries.slice() : []);`, "convergence"],
  ["one-placement-off", "law", "the exclusion step is skipped, so a lift may sit in entries and skipped at once", `      for (const id9 of dup9) {`, `      for (const id9 of []) {`, "one-placement"],
  ["meta-by-size", "law", "case 1 of _richerSession picks the base by _mergeScore again — the record's non-body fields ride the body's size, which is a function of the grouping", `  if (!cx && !cy) return _tieKey(x) >= _tieKey(y) ? x : y;`, `  if (!cx && !cy) return _richer(x, y);`, "associativity"],
  ["carve-silent", "law", "the wholesale pick keeps the corrected body but files no receipt for what it discarded", `    if (cx9 || cy9) return finish9(base);`, `    if (cx9 || cy9) return base;`, "session-superset"],
  ["tie-by-argument-order", "law", "the exact-authority tie is answered by argument position again — the carve keeps whichever record arrived first", `    return bx9 >= by9 ? x : y;`, `    return x;`, "convergence"],
  ["receipt-claims-corrected", "law", "the carve receipt always says the corrected copy stood, even when the later plain copy did", `kept8 = r8.corr ? "corrected" : "later";`, `kept8 = "corrected";`, "session-superset"],
  ["receipt-not-cleared", "law", "a record whose dropped set has emptied keeps its obsolete carve line — the receipt outlives what it described", `      if (!ids8.length) { next8 = rest8; continue; }`, `      if (!ids8.length) { continue; }`, "merge-fixed-point"],
  ["receipt-keeps-others", "law", "the writer inserts the projection but no longer removes the carve lines already there — a stale line from the other side (or an obsolete one) stands beside it or outlives its record", `      const rest8 = next8.filter((f8) => !(f8 && f8.op === op8));`, `      const rest8 = next8;`, "merge-fixed-point"],
  ["equal-day-uses-grouped-union", "law", "the equal-sequence branch keeps the union's identity-grouped order instead of the sequence both sides carried — an interleaved repeat is regrouped by a merge with oneself, and groupings disagree", `      if (_canonJ(rd) === _canonJ(ld)) { out.push(...rd); continue; }`, `      if (_canonJ(rd) === _canonJ(ld)) { out.push(...ls); continue; }`, ["session-fixed-point", "associativity"]],
  ["keyless-raw-json-identity", "law", "the keyless stores key their max-multiset union on raw JSON again, so a canonically-equal line in another key order is a second identity and two-against-one emits three", `const MERGE_MULTI = { feed: (f) => _canonJ(f), forecasts: (f) => _canonJ(f) };`, `const MERGE_MULTI = { feed: (f) => JSON.stringify(f), forecasts: (f) => JSON.stringify(f) };`, "keyless-max-multiset"],
  ["one-sided-day-canonicalized", "law", "a day only one side carries takes the differ branch again — nothing to reconcile, and the athlete's own within-day chronology comes out alphabetical", `      if (!rd.length || !ld.length) { out.push(...(rd.length ? rd : ld)); continue; }`, `      /* mutant: a one-sided day is a disagreement */`, "day-order-kept"],
  ["adoptshift-not-projected", "law", "the adoptshift line is no longer dropped and re-derived — a line filed on an intermediate merge's pick outlives the pick when a later merge overturns it, and groupings disagree", `    if (Array.isArray(s.feed)) s.feed = s.feed.filter((x9) => !(x9 && typeof x9.op === "string" && x9.op.indexOf("adoptshift:") === 0));`, `    /* mutant: the adoptshift line is history */`, ["associativity", "merge-fixed-point"]],
  ["projections-enter-day-order", "law", "projections take part in the day rule again — a stale carve or adoptshift line on one replica makes two identical days differ, and the athlete's permanent lines are canonicalised before the stale line is removed", `if (_isFeedProjection(f)) continue; `, ``, "day-order-kept"],
  ["lateread-not-projected", "law", "the read receipts stop re-deriving at merge — a legacy op-less set-aside line and the op-keyed line both survive as receipts for one read", `  reconcileReadReceipts(out);          /* SCALE-2 — the read receipts re-derive from the merged reads */`, `  /* mutant: receipts are history */`, "merge-fixed-point"],
  ["missed-not-healed", "law", "a disproven missed/gap line outlives the clean read that disproves it", `      if (!cleanD.has(f.d)) kept9.push(f);   /* warranted: no clean read disproves it */`, `      kept9.push(f);   /* mutant: the miss stands beside its disproof */`, "merge-fixed-point"],
  ["trend-chain-not-derived", "law", "the trend, the pt chain and the weekly rows stop following the merged reads — a partial replica's replay survives beside the superset, differently by direction", `function reconcileTrendChain(s) {\n  if (!Array.isArray(s.reads)) return s;`, `function reconcileTrendChain(s) {\n  if (s) return s;`, "convergence"],
  ["effects-not-derived", "law", "the suggestion effects stop deriving from the decision log — the decision converges while targets.* rides local-wins", `function reconcileSuggestionEffects(s) {`, `function reconcileSuggestionEffects(s) {\n  if (s) return s;`, "convergence"],
  ["decisions-wholesale", "law", "the analyst-card decisions ride {...remote, ...local} again — a decision one device tapped is reverted by a stale device's later sync, and which list survives depends on merge direction", `  suggestionLog: { keyOf: (x) => x && x.sid, scoreOf: _sugRank },`, `  /* mutant: the decisions ride wholesale, local-wins */`, "convergence"],
  ["decision-tie-by-device", "law", "two devices that decided the same card on the same day settle by which one is local — the canonical-body tiebreak is gone", `"|" + _canonJ(x); }`, `"|"; }`, "convergence"],
  ["dedup-tie-raw", "law", "the op-dedup's d-tie compares raw entries again — with the union's identity canonical, one op line in two key orders against a different one settles by grouping", `(String(f9.d || "") === String(cur.d || "") && _canonJ(f9) < _canonJ(cur))`, `(String(f9.d || "") === String(cur.d || "") && JSON.stringify(f9) < JSON.stringify(cur))`, "associativity"],
  ["equal-day-raw-identity", "law", "the equal branch compares the sides' day raw again, so one day carried in two key orders is canonicalised and its interleaved repeat regrouped", `      if (_canonJ(rd) === _canonJ(ld)) { out.push(...rd); continue; }`, `      if (JSON.stringify(rd) === JSON.stringify(ld)) { out.push(...rd); continue; }`, "day-order-kept"],
  ["same-day-by-arrival", "law", "a day's lines keep arrival order even when the two sides disagree, so concurrent same-day lines reverse with merge direction", `  if (Array.isArray(out.feed)) out.feed = _feedDayOrder(remote.feed, local.feed, out.feed);`, `  /* mutant: arrival order */`, "convergence"],
  ["merge-sort-not-last", "law", "the merge sorts its feed BEFORE reconcileEraTransitions files its past-dated lines, so the merged feed is not newest-first and the next merge moves them (re-anchored at PROGRESSION-1 FIX-2: A6 added the sighting derivation to the same exit list)", `  reconcileEraTransitions(normalizePlan(out));\n  reconcileSightings(out, { mint: true });   /* A6 — the sighting record derives at the MERGE exit, and the joint-sighting mint fires HERE ONLY (a boot over legacy data can never mint) */\n  reconcileReadReceipts(out);          /* SCALE-2 — the read receipts re-derive from the merged reads */\n  reconcileSuggestionEffects(out);     /* SCALE-2 — the suggestion effects re-derive from the merged log */\n  if (Array.isArray(out.feed)) out.feed = _feedSorted(out.feed);`, `  if (Array.isArray(out.feed)) out.feed = _feedSorted(out.feed);\n  reconcileEraTransitions(normalizePlan(out));\n  reconcileSightings(out, { mint: true });   /* A6 — the sighting record derives at the MERGE exit, and the joint-sighting mint fires HERE ONLY (a boot over legacy data can never mint) */\n  reconcileReadReceipts(out);          /* SCALE-2 — the read receipts re-derive from the merged reads */\n  reconcileSuggestionEffects(out);     /* SCALE-2 — the suggestion effects re-derive from the merged log */`, "merge-fixed-point"],
  ["feed-unsorted", "law", "the feed's canonical newest-first sort becomes the identity, so a receipt filed at the session's date sits above newer lines and the next merge moves it", `.sort((a, b) => String((b[0] || {}).d || "").localeCompare(String((a[0] || {}).d || "")) || a[1] - b[1])`, `.sort((a, b) => 0)`, "merge-fixed-point"],
  ["carve-ignores-union", "law", "the carve fires whenever a side carries a corr, even when the other side's corrLog says a correction exists — the union is ignored", `  if (!union.length) {`, `  if (true) {`, "session-superset"],
  ["guard-counts-receipts", "pin", "the guard counts derived receipts as history again — the app refuses its own migration and the scale fixes never reach his phone", `        if (!f9 || _isFeedDerived(f9, st)) continue;`, `        if (!f9) continue;   /* mutant: derived lines are history */`],
  ["settle-exit-skips", "pin", "the v1/v2 migrate exit skips the reconcilers again — a legacy boot is not a fixed point of its own first merge", `  return _settleExit(s2);`, `  if (Array.isArray(s2.feed)) s2.feed = _feedSorted(s2.feed); return s2;   /* mutant: the legacy exit settles by hand */`],
  ["read-authority-advisory", "pin", "the read tie's class rule becomes advisory — record length decides between clean and late again and the non-transitive cycle returns", `  if (ra !== rb) return ra > rb ? a : b;`, `  /* mutant: class is advisory */`],
  ["adjustments-arrival", "pin", "the adjustment ledger keeps arrival order — lastUndoable offers a different move by merge direction (re-anchored at SCALE-7: the sort moved inside the provenance-class block)", `    s.adjustments = s.adjustments.slice().sort((a, b) => {`, `    if (false) s.adjustments = s.adjustments.slice().sort((a, b) => {   /* mutant: arrival order */`],
  ["dismissal-one-way", "pin", "the derived dismissal can be set but never cleared — an intermediate merge's verdict is terminal and the groupings disagree", `    for (const a of rows9) { if (a === win9) delete a.dismissed; else a.dismissed = true; }`, `    for (const a of rows9) { if (a !== win9) a.dismissed = true; }   /* mutant: set, never clear */`],
  ["sug-receipts-history", "pin", "the analyst-suggestion receipts stop re-deriving — an APPLIED line outlives the dismissal that reversed its effect", `    s.feed = s.feed.filter((f) => !(f && ((typeof f.op === "string" && f.op.indexOf("sug:") === 0) || f.t === SUGT9.approved || f.t === SUGT9.dismissed || f.t === SUGT9.noted || f.t === SUGT9.undone)));`, `    /* mutant: the receipts are history */`],
  ["patch59-receipt-local", "pin", "the patch59 receipt stops deriving from the merged re-classed reads — a stale replica's body can win the canonical tie again", `  if (rc9.length) {`, `  if (false) {   /* mutant: the receipt is whatever was authored */`],
  ["missedday-unguarded", "pin", "the missed-day clause leaves the guard — a warranted summary can be deleted silently and nothing brings it back", "  for (const d9 of _missD9(prev)) if (!nextMiss9.has(d9) && !nextClean9.has(d9)) lost.push(`missedday ${d9}`);", `  /* mutant: a summary is disposable */`],
  ["feedop-unguarded", "pin", "the feedop clause leaves the guard — deleting a whole op-keyed record passes as long as the counts happen to hold", "  for (const op9 of prevOps9) if (!nextOps9.has(op9)) lost.push(`feedop ${op9}`);", `  /* mutant: ops are countless */`],
  ["missed-dedup-byte", "pin", "the one-line-per-missed-day rule keys on bytes again — two contradictory summaries for one day both survive every merge", `      const d9 = String(f.d); const cur9 = missBy9.get(d9);`, `      const d9 = String(f.d) + "|" + _canonJ(f); const cur9 = missBy9.get(d9);   /* mutant: byte identity */`],
  ["settle-log-unreduced", "pin", "the boot stops applying the merge's keyed reduction to the decision log — a duplicate-sid import boots wrong and flips at its first sync", `  if (Array.isArray(s.suggestionLog)) s.suggestionLog = _unionKeyed(s.suggestionLog, [], (x) => x && x.sid, _sugRank);`, `  /* mutant: the log is what arrived */`],
  ["settle-datefold-gone", "pin", "the boot stops folding duplicate-date reads — an import replays both bodies until its first merge rewrites it", `  { const byDF9 = new Map(); for (const r of s.reads) { if (!r || r.d == null) continue; const c9 = byDF9.get(r.d); byDF9.set(r.d, c9 ? _readPick(c9, r) : r); } s.reads = [...byDF9.values()]; }`, `  /* mutant: every body replays */`],
  ["store-skip-empty", "pin", "the attestation store normalizes only when reads exist again", `  if (!Array.isArray(s.reads)) return s;`, `  if (!Array.isArray(s.reads) || !s.reads.length) return s;   /* mutant: the old guard */`],
  ["reclass-facts-not-filed", "pin", "the migration stops filing the attestation FACT lines — the record an old client cannot unsay is never written", `      for (const k of hits) {   /* SCALE-6 — one op-keyed FACT line per attested date: permanent history the feedop clause guards and every old client's feed union preserves, so the attestation re-derives even through a braid that lost the store and the (d,w) body */`, `      for (const k of []) {   /* mutant: the word is a flag */`],
  ["reclass-facts-not-absorbed", "pin", "the settle stops reading the FACT lines — the braid that lost the store and the (d,w) body loses the attestation again", `  for (const f of (Array.isArray(s.feed) ? s.feed : [])) if (f && typeof f.op === "string" && f.op.indexOf("reclass:") === 0) rl9.add(f.op.slice(8));`, `  /* mutant: facts are decoration */`],
  ["reclass-table-lost", "pin", "the (d,w) table stops re-deriving the shipped attestations — the exact line a build once dropped by accident, now a declared trap", `  for (const k of SCALE1_RECLASS) { const r = s.reads.find((x) => x && x.d === k.d && x.w === k.w); if (r) rl9.add(k.d); }   /* the (d,w) pair IS the attested read — matched regardless of classification */`, `  /* mutant: the table is history */`],
  ["undone-belt-gone", "pin", "the adjustment's undone tap stops restoring the decision row — a braid that stripped the row flag resurrects the effect", `      if (r0 && r0.decided === "approved" && !r0.undone) r0.undone = true;`, `      /* mutant: the row remembers alone */`],
  ["at-order-sid", "pin", "same-day decisions fall back to alphabetical sid order — the athlete's later tap silently loses at boot (re-anchored at SCALE-7: the key gained the ord class)", `  const k9 = (x) => String((x && x.d) || "") + "|" + (x && x.at ? "1" + String(x.at) : "0" + String((x && x.ord) || "")) + "|" + String((x && x.sid) || "") + "|" + _canonJ(x);`, `  const k9 = (x) => String((x && x.d) || "") + "|" + String((x && x.sid) || "") + "|" + _canonJ(x);   /* mutant: spelling order */`],
  ["adj-at-order", "pin", "the undo door falls back to rid order within a day — 'Last move applied' offers the older move (re-anchored at SCALE-7: the key gained the provenance class)", `      const ka = String((a && a.d) || "") + "|" + c7(a) + "|" + String((a && a.rid) || "") + "|" + String((a && a.id) || "");`, `      const ka = String((a && a.d) || "") + "|" + String((a && a.rid) || "") + "|" + String((a && a.id) || "");   /* mutant: rid order */`],
  ["nopt-rekey-skipped", "pin", "the canonical re-key hides behind the pt-bearing chain again — a no-pt read keeps its operand key order forever", `  s.reads = s.reads.map((r) => (r && typeof r === "object" && !Array.isArray(r) ? JSON.parse(_canonJ(r)) : r));
  if (i0 >= 0) {
    const start9 = s.reads[i0].d;`, `  if (i0 >= 0) {
    s.reads = s.reads.map((r) => (r && typeof r === "object" && !Array.isArray(r) ? JSON.parse(_canonJ(r)) : r));
    const start9 = s.reads[i0].d;`],
  ["rows-not-canonical", "pin", "keyed-store rows keep their raw key order — one production row in two spellings, two byte identities", `.map((x) => (x && typeof x === "object" && !Array.isArray(x) ? JSON.parse(_canonJ(x)) : x));
}`, `;
}   /* mutant: the spelling is the row */`],
  ["seed-exit-raw", "pin", "the fresh-install exit returns the raw seed again — the first sync rewrites a state the boot just produced", `  if (!old || (old.v !== 1 && old.v !== 2)) return _settleExit(s);`, `  if (!old || (old.v !== 1 && old.v !== 2)) return s;   /* mutant: the seed is born settled, surely */`],
  ["fork-ops-unsorted", "pin", "the boot stops sorting imported fork ops — canonical only after the first merge", "      const ops9 = [...new Set(Array.isArray(f9.ops) && f9.ops.length ? f9.ops.map(String) : (f9.why ? [String(f9.why)] : []))].sort();", "      const ops9 = Array.isArray(f9.ops) && f9.ops.length ? f9.ops.map(String) : (f9.why ? [String(f9.why)] : []);   /* mutant: arrival order */"],
  ["read-not-rekeyed", "pin", "the merged read keeps its winning OPERAND's key order — one logical read, two byte identities, forever by direction", `  s.reads = s.reads.map((r) => (r && typeof r === "object" && !Array.isArray(r) ? JSON.parse(_canonJ(r)) : r));`, `  /* mutant: the operand is the record */`],
  ["undo-not-durable", "pin", "the one-tap undo goes back to hiding the control without reversing the effect (re-anchored at SCALE-7: the arm gained the FACT-line writer)", `  if (sugRow9 && sugRow9.decided === "approved") { sugRow9.undone = true;`, `  if (false) {   /* mutant: undone is a display state */`],
  ["orphan-not-absorbed", "pin", "the settle stops re-materializing an orphan undo — the braid the real f72dbf7 engine produced re-offers a decided card and lets a stale adjustment kill its re-approval", `      s.suggestionLog.push({ sid: sid7, decided: "approved", undone: true, orphan: true, d: a.d, ...(a.at ? { at: a.at } : {}), title: a.title || "" });`, `      /* mutant: an orphan is nobody's */`],
  ["sugundo-fact-not-filed", "pin", "the undo stops filing its op-keyed FACT line — the tap has no record that survives a braid erasing the decision row", `    if (!s.feed.some((f) => f && f.op === "sugundo:" + a.rid)) s.feed.unshift({ d: isoOf(todayStart()), op: "sugundo:" + a.rid, ti: String(a.title || ""), t: "SUGGESTION UNDO ATTESTED — " + String(a.title || a.rid).slice(0, 48), how: "You reversed this analyst move by one tap. This line is the record of that word — it travels with the data, so no older copy of the app can unsay it." });`, `    /* mutant: the tap trusts the row */`],
  ["fact-absorb-gone", "pin", "the settle stops reading the sugundo FACT alone — an undo whose adjustment AND row were both lost never re-materializes", `      if (sids7.has(sid7) || String(f7.op || "").indexOf("sugundo:") !== 0) continue;`, `      if (true) continue;   /* mutant: the word needs a witness */`],
  ["tombstone-outranks-row", "pin", "the union loses the non-orphan bit — the stand-in tombstone can beat the true decision row on a canonical tie and strip its apply body", `function _sugRank(x) { const d9 = String((x && x.d) || "").replace(/-/g, ""); return (/^\\d{8}$/.test(d9) ? String(99999999 - +d9).padStart(8, "0") : "00000000") + "|" + (x && x.undone ? "1" : "0") + "|" + (x && x.orphan ? "0" : "1") + "|" + _canonJ(x); }`, `function _sugRank(x) { const d9 = String((x && x.d) || "").replace(/-/g, ""); return (/^\\d{8}$/.test(d9) ? String(99999999 - +d9).padStart(8, "0") : "00000000") + "|" + (x && x.undone ? "1" : "0") + "|" + _canonJ(x); }   /* mutant: a stand-in is a peer */`],
  ["adj-id-order", "pin", "the undo door throws away the legacy writer's own embedded instant — same-day unstamped taps fall back to rid spelling and Undo reverses the wrong move (the rig123 wound; re-anchored at SCALE-8: one instant scale replaced the class ladder)", `    const c7 = (x) => { const d9 = String((x && x.d) || ""); const t7 = _adjInstant(x);
      return (mixed9.has(d9) || t7 == null) ? "0" + String((x && x.ord) || "") : "1" + String(t7).padStart(15, "0"); };`, `    const c7 = (x) => String((x && x.at) || "");   /* mutant: rid decides the day */`],
  ["adj-instant-not-derived", "pin", "the sort stops reading the legacy id's embedded instant — a stamped 9am tap beats a legacy 5pm tap again (Sol's pass-6 witness, executed at 2e92fd0)", `  const m7 = x && x.id ? /^adj_([0-9a-z]{8})/.exec(String(x.id)) : null;`, `  const m7 = null;   /* mutant: only the stamp speaks */`],
  ["mixed-day-ladder", "pin", "the instant-vs-ord class ladder returns — a mixed day compares epoch milliseconds against storage positions, so a no-instant row always sorts first and Undo reverses the earlier move (Sol's pass-7 witness, executed at 3ecf189)", `      return (mixed9.has(d9) || t7 == null) ? "0" + String((x && x.ord) || "") : "1" + String(t7).padStart(15, "0"); };`, `      return t7 != null ? "1" + String(t7).padStart(15, "0") : "0" + String((x && x.ord) || ""); };   /* mutant: class over sequence */`],
  ["ord-mint-noinstant-only", "pin", "the boot mints a storage rank only for no-instant rows again — the instant-bearing rows on a mixed day have nothing comparable to be ordered by", `!Array.isArray(a) && a.ord == null) a.ord = String(i).padStart(4, "0"); });   /* SCALE-9`, `!Array.isArray(a) && _adjInstant(a) == null && a.ord == null) a.ord = String(i).padStart(4, "0"); });   /* SCALE-9`],
  ["ord-unpadded", "pin", "the storage rank loses its zero padding — position 10 sorts between 1 and 2 and the tenth move of a day is never the last one", `a.ord = String(i).padStart(4, "0"); });   /* SCALE-9`, `a.ord = String(i); });   /* SCALE-9`],
  ["ordersure-finite-window", "pin", "a finite-window certainty assumption returns — two moves whose recorded separation exceeds the window are claimed as ordered although no clock bound is enforced (Sol's pass-8 witness: 25h01m apart, different days, both stamped)", `    const others10 = adj.filter((x) => x && x !== a && !x.undone && !x.dismissed && !structural(x.rid));`, `    const others10 = adj.filter((x) => x && x !== a && !x.undone && !x.dismissed && !structural(x.rid) && Math.abs((_adjInstant(x) || 0) - (_adjInstant(a) || 0)) <= 24 * 60 * 60 * 1000);   /* mutant: a window is proof */`],
  ["mode-over-all-rows", "pin", "the per-day mode is read from every row again — an undone fallback row keeps its day in recorded-sequence mode forever and permanently reverses the timed rows beside it", `    const act10 = s.adjustments.filter((x) => x && !x.undone && !x.dismissed);`, `    const act10 = s.adjustments.filter((x) => !!x);   /* mutant: retired rows still vote */`],
  ["ordersure-day-boxed", "pin", "certainty is judged by the day box again — two taps minutes apart across a skewed midnight each stand alone in their own day and 'Last move applied' is claimed over an unproven order (re-anchored at SCALE-10: the neighbourhood predicate was retired outright)", `    const others10 = adj.filter((x) => x && x !== a && !x.undone && !x.dismissed && !structural(x.rid));
    return { rid: a.rid, d: a.d, title: a.title, auto: !!a.auto, orderSure: others10.length === 0 };`, `    const others10 = adj.filter((x) => x && x !== a && !x.undone && !x.dismissed && !structural(x.rid) && String(x.d) === String(a.d));
    return { rid: a.rid, d: a.d, title: a.title, auto: !!a.auto, orderSure: others10.length === 0 };   /* mutant: the day is the neighbourhood */`],
  ["ordersure-selected-row", "pin", "orderSure becomes a property of the selected row again — a stamped winner claims 'Last move applied' over a skew-dependent or mixed-writer order (the executed A6 contradiction)", `    return { rid: a.rid, d: a.d, title: a.title, auto: !!a.auto, orderSure: others10.length === 0 };`, `    return { rid: a.rid, d: a.d, title: a.title, auto: !!a.auto, orderSure: !!a.at || others10.length === 0 };   /* mutant: the winner's own clock is proof */`],
  ["proposal-at-dropped", "pin", "applyProposal stops stamping its instant — its taps rank only by the id's embedded time and the row loses its first-class stamp", `  const row = { rid: p.rid, id: _freshId("adj_"), d: today, at: new Date().toISOString(), title: p.title, nudge: adj };   /* SCALE-8 — every writer stamps its instant (the id already embedded it; now it is first-class) */`, `  const row = { rid: p.rid, id: _freshId("adj_"), d: today, title: p.title, nudge: adj };   /* mutant: the id remembers alone */`],
  ["sug-ord-not-minted", "pin", "the boot stops recovering the legacy decision order from storage position — the production log's same-day rows fall back to sid spelling", `  st.suggestionLog.forEach((x, i) => { if (x && typeof x === "object" && !Array.isArray(x) && !x.at && x.ord == null) x.ord = String(i).padStart(4, "0"); });`, `  /* mutant: position is noise */`],
  ["adj-ord-not-minted", "pin", "the boot stops recovering storage order for adjustments without a derivable instant — their day falls back to rid spelling (re-anchored at SCALE-8: the mint mirrors _adjInstant)", `  if (Array.isArray(st.adjustments)) st.adjustments.forEach((a, i) => { if (a && typeof a === "object" && !Array.isArray(a) && a.ord == null) a.ord = String(i).padStart(4, "0"); });   /* SCALE-9 (Sol's pass 7) — EVERY row gets its storage rank, not just the no-instant ones: a mixed day must order all of its rows on ONE scale, so the rank has to exist on the instant-bearing rows too (SCALE-8 minted only where _adjInstant was null, which is what left the ladder). Padded, so position 10 never sorts before 9. */`, `  /* mutant: position is noise here too */`],
  ["ordersure-gone", "pin", "the undo door claims 'last' over an unproven same-day order again (re-anchored at SCALE-8: sureness is now set-derived)", `    return { rid: a.rid, d: a.d, title: a.title, auto: !!a.auto, orderSure: others10.length === 0 };`, `    return { rid: a.rid, d: a.d, title: a.title, auto: !!a.auto, orderSure: true };   /* mutant: every order is the athlete's */`],
  /* RETIRED (SCALE-6): sugrank-drops-undone — the B4 belt (adjustment.undone restores the
     decision row at every settle, and _adjRank keeps the undone adjustment terminal) makes
     the _sugRank undone bit redundant DEFENSE-IN-DEPTH: no reachable state distinguishes
     the mutant, because the adjustment always carries the same tap the rank bit protects.
     Doctrine: a mutation that cannot fail is retired, never left. The rank bit itself
     stays in code — determinism costs nothing; an unfalsifiable trap costs trust. */
  ["adjrank-local-tie", "pin", "undone and dismissed tie at equal rank again and local wins — the undo door differs by merge direction", `function _adjRank(a) { return ((a && a.undone) ? "2" : (a && a.dismissed) ? "1" : "0") + "|" + _canonJ(a); }`, `function _adjRank(a) { return (a && (a.undone || a.dismissed)) ? 1 : 0; }   /* mutant: the old rank */`],
  ["coupling-day-only", "pin", "the winner's adjustment is matched by day alone — a losing device's undo door stands under the winning decision", `    const tMatch9 = dMatch9.filter((a) => String(a.title || "") === String(row9.title || ""));`, `    const tMatch9 = dMatch9;   /* mutant: the day is the fingerprint */`],
  ["reclasslog-not-unioned", "pin", "the attestation store stops merging by set union — whichever side is local decides what was attested", `  { const rl = [...new Set([...(Array.isArray(remote.reclassLog) ? remote.reclassLog : []), ...(Array.isArray(local.reclassLog) ? local.reclassLog : [])].map(String))].sort(); if (rl.length) out.reclassLog = rl; }`, `  /* mutant: the spread already copied one side */`],
  ["reclass-not-enforced", "pin", "a resurrected offWindow body stays late — the owner's word reverses at a mixed-version merge", `    if (rl9.has(String(r.d)) && r.offWindow && !r.sealed) { delete r.offWindow; r.note = String(r.note || "").split(" · ").filter((x) => x && !/set aside/.test(x)).join(" · "); }`, `    /* mutant: the store remembers, the read does what it wants */`],
  ["sealed-not-clean", "pin", "a sealed morning read stops disproving a missed line — the record claims he did and did not weigh in", `  for (const r of s.reads) { if (!r || !r.d) continue; if (r.offWindow && !r.sealed) { if (lateD.indexOf(r.d) < 0) lateD.push(r.d); } else if (!r.offWindow) cleanD.add(r.d); }`, `  for (const r of s.reads) { if (!r || !r.d || r.sealed) continue; if (r.offWindow) { if (lateD.indexOf(r.d) < 0) lateD.push(r.d); } else cleanD.add(r.d); }   /* mutant: sealed is invisible */`],
  ["fork-ops-not-canonical", "pin", "the boot stops restating fork ops — a boot differs from its own self-merge in bytes no reconciler owns", `      const ops9 = [...new Set(Array.isArray(f9.ops) && f9.ops.length ? f9.ops.map(String) : (f9.why ? [String(f9.why)] : []))].sort();
      const why9 = ops9.length > 1 ? ops9.join(" + ") : (f9.why != null ? f9.why : ops9[0]);`, `      const ops9 = [];   /* mutant: no restatement */
      const why9 = f9.why;`],
  ["derive-counts-era-first", "pin", "the sighting derivation counts the FIRST session of a technique era again — FIX 3c says the era's opening session banks nothing, and counting it hands a lift a sighting it never earned under the new setup", `      if (eraFrom9 != null && firstInEra9) { firstInEra9 = false; continue; }   /* FIX 3c — the first era session banks nothing */`, `      /* mutant: the era's first session banks */`],
  ["derive-ignores-earn-receipt", "pin", "the derivation stops reading the walk's own EARNED receipts — the record is no longer spent by the earn that spent it, so a lift keeps banking past its own graduation", `      if (lastEarn9 != null && d9 === lastEarn9) { topAt9 = null; topRun9 = 0; continue; }   /* the earn day ends spent */`, `      /* mutant: the earn does not spend */`],
  ["mint-without-signature", "pin", "the joint-sighting mint fires on any run of two instead of on the signature of two walks that each saw a first sighting — legacy history mints retroactive earns", `    if (!lineOn9(dPrev9, prov9) || !lineOn9(dK9, prov9)) return false;          /* both walks saw a first sighting */`, `    /* mutant: a run of two is signature enough */`],
  ["derive-not-at-merge", "law", "the sighting record stops deriving at the MERGE exit — two devices that each banked one sighting merge to a state claiming one, and the earn the serial walk fires never fires (Sol's A6 witness)", `  reconcileSightings(out, { mint: true });`, `  /* mutant: the merge keeps the winner's stored counter */`, "sighting-faithful"],
  ["prefix-from-stale-tenure", "pin", "the progression prefix reaches back past a deload to the earliest sighting of the load — a lift that grew a set, dropped a load and came back is judged on a set count it no longer runs", `    let i0 = mine9.length;
    while (i0 > 0 && String(mine9[i0 - 1][1].w != null ? mine9[i0 - 1][1].w : mine9[i0 - 1][1].wKey) === key9) i0--;`, `    let i0 = 0;   /* mutant: the whole history is one tenure */`],
  ["prefix-from-partial-line", "pin", "a PARTIAL entry establishes the prefix — one set logged of four makes [9,1,1,1] read as a top of window", `      if (en9.reps.length >= ex.sets || grewAfter9(d9)) return Math.min(ex.sets, en9.reps.length);`, `      return Math.min(ex.sets, en9.reps.length);   /* mutant: any entry establishes */`],
  ["pad-zero-as-absence", "pin", "the pad reads a delivered 0 as absence again and pads from hi-2, so a line ending in a set he could not start is continued from nowhere", `function _padFrom9(arr, hi) {
  for (let i = arr.length - 1; i >= 0; i--) { const v = arr[i]; if (typeof v === "number" && v > 0) return v; }
  return hi - 2;
}`, `function _padFrom9(arr, hi) {
  return (arr[arr.length - 1] || hi - 2);   /* mutant: zero is absence */
}`],
  ["curl-restate-untied", "pin", "the curl restatement stops being tied to the current load — a lift already advanced to a new numeric weight is rolled back to the older recorded vector", `      if (vec9 && fits9 && tied9) { cu9.w = vec9[0]; cu9.wSets = vec9.slice(); }`, `      if (vec9) { cu9.w = vec9[0]; cu9.wSets = vec9.slice(); }   /* mutant: restate regardless */`],
  ["seam-retire-by-date-only", "pin", "the seam retirement keys on date and split alone — a fork that merely shares the date is swept with the eleven, without carrying the insertion identity", `        && [...(f.ops || (f.why ? [f.why] : []))].some((o) => / inserted upstream$/.test(String(o))));`, `        );   /* mutant: the date is the provenance */`],
  ["wsets-not-advanced", "pin", "the earn stops minting the advanced per-set vector — the lift graduates its load and leaves its per-set line a load behind", `...(Array.isArray(ex.wSets) && typeof ex.w === "number" && typeof upNext === "number" ? { newWSets: ex.wSets.map((x9) => x9 + (upNext - ex.w)) } : {})`, `...({})`],
  ["hot-copy-claims-opener", "pin", "the HOT line claims 'the opener at RIR 0' even when the arm fired because of the governor hold and no opener rating is on file — a claim the record does not support", `        const openKnown9 = openRir9 === 0 || (Array.isArray(en.rirSets) && en.rirSets[0] === 0);`, `        const openKnown9 = true;   /* mutant: always blame the opener */`],
  ["composite-eats-reset", "pin", "the same-date fork union stops partitioning by class — a technique fork sharing a date with a derived context seam is absorbed into a kind-less split composite, the next boot deletes it as an underived seam, and the athlete authored protocol history is destroyed silently", `        if (!isProj9(f)) { solo9.push(f); continue; }   /* a reset-bearing fork is never absorbed */`, `        /* mutant: every fork composites */`],
  ["seams-not-projected", "pin", "the insertion seams stop being derived at every boundary — a stale replica hands a retired seam straight back through the fork union and the feed's max-multiset, and the eleven lifts freeze again (the fork union is deterministic either way, so the LAWS cannot see this: the pins are the owner)", `  deriveInsertionSeams(s);`, `  /* mutant: a seam is a stored fact */`],
  ["seam-derivation-uses-marker-date", "pin", "the seam is dated at the plan marker again instead of at ACTUAL EXPOSURE — the day the plan changed is not the day the lift was first performed under it, which is the whole defect (eleven seams stamped 8/17 for lifts that trained under nothing that day)", `        for (const d of dates9) { if (d < marker9) continue; if (didOn9(d, newId) && didOn9(d, affId)) { seamD9 = d; break; } }`, `        seamD9 = marker9;   /* mutant: the plan's date is the seam's date */`],
  ["settle-fork-kind-dropped", "pin", "the boot exit's fork restatement rebuilds from a fixed key set again and silently drops the fork KIND — the first-class classifier vanishes and only the legacy split marker carries the reading", `...(f9.kind ? { kind: f9.kind } : {}), ...(f9.split ? { split: true } : {}) };`, `...(f9.split ? { split: true } : {}) };   /* mutant: kind is not a fork field */`],
  ["patch60-mints-marker", "pin", "patchV60 MINTS an insertion marker instead of only lowering an existing one — a quarantined, invalid fly birth is handed the registry entry the quarantine exists to withhold", `      if (seed9 && ins9[k9] != null && String(ins9[k9]) > String(seed9)) ins9[k9] = seed9;`, `      if (seed9 && (ins9[k9] == null || String(ins9[k9]) > String(seed9))) ins9[k9] = seed9;   /* mutant: mint it */`],
  ["sighting-resurrected", "pin", "the per-lift merge prefers the HIGHER sighting run instead of the newer record — re-aimed at FIX-2: A6 derives the counter, so the counter itself can no longer be revived this way, but the ordering still decides the WHOLE lift record, and a stale replica winning it reinstates the governor hold, the retired ladder and the ownership flag the newer device released (R13a-3's fence, one level up)", `  exercises: { keyOf: (e) => e && e.id, scoreOf: _exDate },`, `  exercises: { keyOf: (e) => e && e.id, scoreOf: (e) => String((e && e.topRun) || 0) },   /* mutant: the bigger run wins the lift */`],
  ["corrections-unguarded", "pin", "the correction ledger leaves recordCounts", `    corrections: Object.values((st.sessionLog && typeof st.sessionLog === "object") ? st.sessionLog : {}).reduce((n9, r9) => n9 + ((r9 && Array.isArray(r9.corrLog)) ? r9.corrLog.length : 0), 0),`, `    corrections: 0,`],
];
async function runMutations() {
  const { execFileSync } = await import("node:child_process");
  const { unlinkSync, existsSync } = await import("node:fs");
  const src0 = fs.readFileSync(at("src/app.jsx"), "utf8");
  const tmpSrc = at("src", "_mutant_sync.jsx");
  const rows = [];
  for (const [name, owner, says, from, to, expect] of MUTATIONS) {
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
    const bl = lawTxt.match(/^BROKEN-LAWS: (.*)$/m);
    const laws = (bl && bl[1] !== "none" ? bl[1].split(", ") : []).filter((l) => l && l !== "aimed-scenario");
    /* N-1 — A LAW OWNER IS CREDITED ONLY BY A NAMED LAW. This took the
       harness's EXIT CODE as proof, so a shape-only failure or an
       aimed-scenario break printed "caught-by: law (the shape guard)" with zero
       laws broken — the row read as covered while nothing had judged it. */
    let ownerRed = 0, by = "";
    if (owner === "law") {
      if (!expect) { rows.push([name, "UNDECLARED — a law-owned row must name the law it guards", says, false]); continue; }
      const want = Array.isArray(expect) ? expect : [expect];
      ownerRed = want.every((w) => laws.indexOf(w) >= 0) ? 1 : 0;
      const extra = laws.filter((l) => want.indexOf(l) < 0);
      by = ownerRed ? want.join(" + ") + (extra.length ? "; also " + extra.join(", ") : "") : (laws.length ? "expected " + want.join(" + ") + ", got " + laws.join(", ") : "");
    }
    if (owner === "suite") {
      /* a declared owner that cannot be dispatched is the N-1 hole again */
      let stxt = "";
      try { stxt = execFileSync(process.execPath, [at("scripts", "test.mjs")], { encoding: "utf8", env: { ...process.env, PL_ENGINE: out } }); }
      catch (e) { stxt = (e.stdout || "") + (e.stderr || ""); }
      ownerRed = /FAIL/.test(stxt) ? 1 : 0; by = "engine suite";
    }
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
    rows.push([name, ownerRed ? "caught-by: " + owner + " (" + by + ")" : "UNCOVERED — its declared owner (" + owner + (by ? ": " + by : "") + ") stayed green", says, !!ownerRed, owner === "law" && ownerRed ? (Array.isArray(expect) ? expect : [expect]) : null]);
  }
  const missed = rows.filter((r) => !r[3]);
  for (const [a9, b9, c9] of rows) console.log("  " + a9.padEnd(28) + String(b9).padEnd(54) + c9);
  const covered = new Set(rows.flatMap((r) => r[4] || []));   /* declared AND matched — an incidental red is not coverage */
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
    /* N-2 — PER AIM, never engine-global: an AIM declares what it needs
       (requires: [...members of __test]) and is skipped ONLY when the engine
       under test lacks one of those. A seed that needs nothing and fails to
       form is a disarmed seed on every engine, old or new. */
    const need9 = (AIM[seed] && Array.isArray(AIM[seed].requires)) ? AIM[seed].requires : [];
    const lack9 = need9.filter((f9) => typeof T[f9] !== "function");
    if (process.env.PL_ENGINE && lack9.length) return [{ skip: true, seed, law: "aimed-scenario", says: "scenario needs a capability this engine does not have", trace, got: "SKIPPED on this engine — it lacks " + lack9.join(", ") + " which seed " + seed + " declares it requires" }];
    return [{ law: "aimed-scenario", says: "an aimed seed must actually produce the shape it names", seed, trace, got: "aimed scenario " + seed + " did not form — " + (why || "unknown") }];
  }
  for (const law of LAWS) {
    let bad = null;
    try { bad = law.check(A, B, C, { dids, trace, seed, aim: AIM[seed] || null }); } catch (e) { bad = { got: "THREW: " + (e && e.message) }; }
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
  /* THE GUARD READS THE HARNESS TOO — and this time it is implemented rather
     than described. Sol found the claim standing with no code behind it: the
     leg that was meant to add it aborted before writing, the follow-up applied
     a subset that left it out, and the handoff reported it closed. Reverting
     all three generator writers to state-shaped keys left the guard empty, so
     the harness could drift from the app it tests and say nothing. Literal
     substrings — no regex escaping to get subtly wrong, which is how the first
     attempt would have failed even if it had landed. */
  const self = fs.readFileSync(at("tools", "sync-laws.mjs"), "utf8");
  const selfMiss = [];
  /* the needle is ASSEMBLED AT RUNTIME so it never appears verbatim in this
     file — the first version stored the literals in a list and then searched
     the file for them, so it found its own list and reported fine forever. A
     guard that reads the file it lives in has to be written not to see itself. */
  const Q = String.fromCharCode(34);
  for (const [k9, v9] of [["skip", "e"], ["unskip", "k"], ["amend", "e"]]) {
    const needle = "T._fileCorr(rec, " + Q + k9 + ":" + Q + " + d + " + Q + ":" + Q + " + " + v9 + ".id + " + Q + ":" + Q;
    const at9 = self.indexOf(needle);
    if (at9 < 0) { selfMiss.push("the harness's own " + k9 + " writer no longer uses the act-shaped key the app writes"); continue; }
    /* AND THE CALL, not just the key. The guard checked the key string only, so
       when the monotone bump became live-only at leg 10 the three generator
       writers kept calling _fileCorr WITHOUT opts — modelling a writer the app
       no longer has — and the guard said nothing. Twelve explore hits later,
       all of them that one drift. Sol's hunt (1) said this class recurs unless
       the guard reads the writers; it recurred one leg on. */
    const line9 = self.slice(at9, self.indexOf(String.fromCharCode(10), at9));
    if (line9.indexOf("live: true") < 0) selfMiss.push("the harness's own " + k9 + " writer no longer declares { live: true } — it is modelling a writer the app does not have");
  }
  const src = fs.readFileSync(at("src/app.jsx"), "utf8");
  const need = [
    ["the ✕ handler still stamps AND files its correction, keyed on the ACT", /_fileCorr\(rec, "skip:" \+ dateSel \+ ":" \+ e\.id \+ ":"/],
    ["the ↩ handler still stamps AND files, carrying the entry, keyed on the ACT", /_fileCorr\(rec, "unskip:" \+ dateSel \+ ":" \+ k\.id \+ ":"/],
    ["sessionLog still merges through the session law", /k === "sessionLog" \? _mergeSession : _richer/],
    ["the ladder editor still CLEARS with a stamp (the absent half of the tie)", /delete ex6\.steps; ex6\.stepsAt = new Date\(\)\.toISOString\(\)/],
    ["the ladder editor still SETS with a stamp (the present half)", /ex6\.steps = parsed; ex6\.stepsAt = new Date\(\)\.toISOString\(\)/],
    ["the equal-stamp tie still resolves through _valOr, not raw stringify", /_valOr\(other\[f9\]\) > _valOr\(w2\[f9\]\)/],
  ];
  return [...selfMiss, ...need.filter(([, re]) => !re.test(src)).map(([w]) => w)];
})();

/* ---------- report ---------- */
if (!LIB && skips.length) for (const s9 of skips) console.log("  SKIPPED (capability): seed " + s9.seed + " — " + s9.got);
if (!LIB && (VERBOSE || fails.length || shapeMiss.length)) {
  for (const f of fails.slice(0, 12)) {
    console.log("\n  LAW BROKEN: " + f.law + " — " + f.says);
    console.log("    seed:  " + f.seed + "   (replay: node tools/sync-laws.mjs --only " + f.seed + ")");
    console.log("    ops:   " + f.trace.map((t, i) => String.fromCharCode(65 + i) + " [" + t.join(" ") + "]").join("  |  "));
    console.log("    got:   " + f.got);
    if (f.paths) for (const p of f.paths.slice(0, 4)) console.log("    diff:  " + p.slice(0, 200));
  }
  for (const m of shapeMiss) console.log("\n  SHAPE DRIFT: " + m);
}

/* N-1 (found by execution): the mutation runner parsed "LAW BROKEN:" lines out of a report that prints at most 12 failures — a mutant that broke many seeds could have its declared law fall past the cap and read as UNCOVERED, or an incidental law read as the catch. One complete line, always printed, is what the runner reads. */
if (!LIB) console.log("BROKEN-LAWS: " + ([...new Set(fails.map((f) => f.law))].sort().join(", ") || "none"));
const label = EXPLORE ? "explore" : "committed";
if (LIB) { /* the caller drives */ }
else if (fails.length || shapeMiss.length) {
  console.log("\nSYNC-LAWS: " + fails.length + " violation(s)" + (skips.length ? ", " + skips.length + " skipped (capability)" : "") + " · superset exemption taken " + CARVE_FIRINGS.length + "×" + " across " + seeds.length + " " + label + " seed" + (seeds.length === 1 ? "" : "s") + (shapeMiss.length ? ", " + shapeMiss.length + " shape drift(s)" : ""));
  if (!EXPLORE) process.exit(1);
} else {
  console.log("SYNC-LAWS: " + LAWS.length + " laws hold across " + seeds.length + " " + label + " seeds" + (skips.length ? ", " + skips.length + " skipped (capability)" : "") + " · superset exemption taken " + CARVE_FIRINGS.length + "× (" + ([...new Set(CARVE_FIRINGS.map((c) => c.split(":")[0]))].join(", ") || "never") + ")" + " — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity");
}
