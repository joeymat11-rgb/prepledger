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
    T._stampCorr(rec);
    if (T._fileCorr) T._fileCorr(rec, "skip:" + d + ":" + e.id, "skip", e.id, rec.corr && rec.corr.at);
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
    T._stampCorr(rec);
    if (T._fileCorr) T._fileCorr(rec, "unskip:" + d + ":" + k.id, "unskip", k.id, rec.corr && rec.corr.at, en);
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
  /* the ladder: a rung joins, or the whole thing is cleared (a DELETION, which
     needs a strictly newer stamp to win — law 7's hard half). */
  ladder: (s, r, ctx) => {
    const ex = pick(r, s.exercises);
    if (r() < 0.5) { const rungs = T.loadRungs(ex) || []; ex.steps = [...new Set([...rungs, pick(r, [155, 165, 205, 215])])].sort((a, b) => a - b); ex.stepsAt = ctx.stamp; }
    else { delete ex.steps; ex.stepsAt = ctx.stamp; }
    return s;
  },
  /* a data-amendment patch: an entry's load is restated, with its provenance. */
  amend: (s, r, ctx) => {
    const d = ctx.date, rec = s.sessionLog[d];
    if (!rec || !(rec.entries || []).length) return s;
    const e = pick(r, rec.entries);
    if (typeof e.w !== "number") return s;
    e.w = e.w + pick(r, [5, 10, -10]);
    e.wCorrAt = ctx.stamp;
    T._stampCorr(rec);
    if (T._fileCorr) T._fileCorr(rec, "amend:" + d + ":" + e.id, "amend", e.id, rec.corr && rec.corr.at, [{ id: e.id, w: e.w }]);
    return s;
  },
  /* the transport is JSON: a law that only holds in memory is not a law. */
  roundtrip: (s) => JSON.parse(JSON.stringify(s)),
};
const OP_NAMES = Object.keys(OPS);

function reDerive(s, id) {
  const ex = (s.exercises || []).find((z) => z && z.id === id);
  if (!ex) return;
  const dm = T.deriveLastMeta(s, id);
  if (dm) { ex.lastMeta = dm; ex.last = dm.reps.slice(); }
  else { ex.lastMeta = { d: null, w: ex.w, reps: [], rir: null, rirSets: [], debt: false }; ex.last = null; }
}

function replicas(seed) {
  const r = rng(seed);
  const n = 2 + Math.floor(r() * 2);                       /* 2 or 3 replicas */
  const base = world();
  const out = [];
  const trace = [];
  const dids = [];
  for (let i = 0; i < n; i++) {
    let s = cl(base);
    const steps = 1 + Math.floor(r() * 8);
    const mine = [];
    const did = [];
    for (let k = 0; k < steps; k++) {
      const name = pick(r, OP_NAMES);
      const ctx = { date: pick(r, [D1, D2]), stamp: pick(r, STAMPS), did };
      try { s = OPS[name](s, r, ctx) || s; } catch (e) { mine.push(name + "!ERR:" + (e && e.message)); continue; }
      mine.push(name + "(" + ctx.date.slice(5) + "," + ctx.stamp.slice(5, 10) + ")");
    }
    out.push(s); trace.push(mine); dids.push(did);
  }
  return { reps: out, trace, dids };
}

/* ---------- THE LAWS ---------- */
const settle = (s) => T.migrate(T.migrate(cl(s)));           /* leg-7 doctrine: an ADOPTING boot is not idempotent by design; the state settles by the second */
const sessTotals = (s) => Object.fromEntries(Object.entries(s.sessionLog || {}).map(([d, r]) => [d, ((r.entries || []).length) + ((r.skipped || []).length)]));
const stores = (s) => ({
  reads: (s.reads || []).length, nights: ((s.sleep || {}).nights || []).length,
  dailyLogs: Object.keys(s.dailyLogs || {}).length, sessionLog: Object.keys(s.sessionLog || {}).length,
  queue: (s.queue || []).length, feed: new Set((s.feed || []).map((f) => J(f))).size,
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
    check: (A, B) => { const m = settle(T.mergeState(cl(A), cl(B)));
      for (const ex of m.exercises || []) {
        if (typeof ex.w !== "number") continue;
        const r9 = T.loadRungs(ex);
        if (r9 && r9.length && r9.indexOf(ex.w) < 0) return { got: ex.id + " w " + ex.w + " is not on " + J(r9) };
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
  { seed: 91337, why: "general convergence over the whole op set", redAt: "—" },
  { seed: 11021, why: "general convergence, second shape", redAt: "—" },
  { seed: 12408, why: "general convergence, third shape", redAt: "—" },
  { seed: 13579, why: "general convergence, fourth shape", redAt: "—" },
];

/* ---------- the run ---------- */
function runSeed(seed) {
  const { reps, trace, dids } = replicas(seed);
  const [A, B, C] = reps;
  const out = [];
  for (const law of LAWS) {
    let bad = null;
    try { bad = law.check(A, B, C, { dids, trace }); } catch (e) { bad = { got: "THREW: " + (e && e.message) }; }
    if (bad) out.push({ law: law.name, says: law.says, seed, trace, got: bad.got, paths: bad.paths });
  }
  return out;
}

const LIB = !!process.env.PL_LAWS_LIB;   /* imported as a library (probe / replay) rather than run as the gate row */
const seeds = EXPLORE
  ? Array.from({ length: 400 }, (_, i) => 100000 + i * 7919)
  : SEEDS.map((s) => s.seed);

let fails = [];
if (!LIB) for (const s of seeds) fails = fails.concat(runSeed(s));

/* ---------- the SHAPE guard: the composed ops still match the real writers ---------- */
const shapeMiss = (() => {
  const src = fs.readFileSync(at("src/app.jsx"), "utf8");
  const need = [
    ["the ✕ handler still stamps AND files its correction", /rec\.entries = rec\.entries\.filter\(\(x2\) => x2\.id !== e\.id\); _stampCorr\(rec\); _fileCorr\(rec, "skip:"/],
    ["the ↩ handler still stamps AND files, carrying the entry", /rec\.entries = \[\.\.\.\(rec\.entries \|\| \[\]\), en\]; _stampCorr\(rec\); _fileCorr\(rec, "unskip:"/],
    ["sessionLog still merges through the session law", /k === "sessionLog" \? _mergeSession : _richer/],
  ];
  return need.filter(([, re]) => !re.test(src)).map(([w]) => w);
})();

/* ---------- report ---------- */
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

const label = EXPLORE ? "explore" : "committed";
if (LIB) { /* the caller drives */ }
else if (fails.length || shapeMiss.length) {
  console.log("\nSYNC-LAWS: " + fails.length + " violation(s) across " + seeds.length + " " + label + " seeds" + (shapeMiss.length ? ", " + shapeMiss.length + " shape drift(s)" : ""));
  if (!EXPLORE) process.exit(1);
} else {
  console.log("SYNC-LAWS: " + LAWS.length + " laws hold across " + seeds.length + " " + label + " seeds — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity");
}
