/* PORT ORACLE v2 — laws + manifest + redaction. Usage:
     node oracle/port-oracle.cjs golden  <engine.cjs> <label> <engineCommit>   cut goldens for every fixture blob (public → golden/, private → private/) and (re)write oracle/manifest.json
     node oracle/port-oracle.cjs check   <engine.cjs> <label> [goldenLabel]    candidate vs golden under the MANIFEST: fail closed unless clock, zone, fixture hash, golden hash, golden stamp all match
     node oracle/port-oracle.cjs sensitivity <engine.cjs> <label>             per-LEAF perturbation sensitivity + the real-change probe (which required paths differ from golden main)
   PRIVACY (Sol suite-pass-1 port objection 3): the PRIVATE blob (private/live.json — the athlete's own ledger, NOT synthetic)
   is reported by PATH NAMES AND COUNTS ONLY; no value of a private census ever reaches stdout or run.log — enforced in
   code here, and re-checked by run.cjs's privacy test against the private golden. Public fixture: the repo's frozen
   preimage (public, but the same rule is applied: values withheld from the shipped log). */
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const { census, required, leafPaths } = require("./census.cjs");
const { canon, diffPaths, runLaws, JP } = require("../lib/harness.cjs");
const ROOT = path.join(__dirname, ".."); const MANIFEST = path.join(ROOT, "oracle", "manifest.json");
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const BLOBS = [{ name: "preimage-2026-08-15", file: path.join(ROOT, "fixtures/preimage-2026-08-15.json"), privacy: "PUBLIC (repo tools/fixtures/ledger-preimage-2026-08-15.json)", goldenDir: path.join(ROOT, "golden"), private: false }, { name: "synthetic-pending-debut", file: path.join(ROOT, "fixtures/synthetic-pending-debut.json"), privacy: "SYNTHETIC (oracle/make-synthetic.cjs; pending debuts with newWSets, a former name, a volume receipt)", goldenDir: path.join(ROOT, "golden"), private: false }, { name: "live", file: path.join(ROOT, "private/live.json"), privacy: "PRIVATE — the athlete's live ledger, never shipped; verdict lines only", goldenDir: path.join(ROOT, "private"), private: true }].filter((b) => fs.existsSync(b.file));
/* PRIVATE blobs: every law detail is replaced by this constant — no count, path, value or error text from the private fixture reaches stdout or the log */
const WITHHELD = "[private fixture: detail withheld in code]";
const priv = (b, detail) => (b.private ? WITHHELD : detail);
const [mode, enginePath, label, arg4] = process.argv.slice(2);
const clock = process.env.MEASURED_TEST_NOW, tz = process.env.TZ;
if (!clock || !tz) { console.log("FAIL CLOSED: MEASURED_TEST_NOW and TZ must be set exactly"); process.exit(2); }
const T = require(path.resolve(enginePath)).__test; const engineSha = sha(path.resolve(enginePath));
const stamp = { engine: label, engineSha256: engineSha, engineCommit: arg4 || null, clock, tz, censusVersion: require("./census.cjs").CENSUS_VERSION };
if (mode === "golden") {
  const man = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : { manifestVersion: 1, goldens: {} };
  man.censusVersion = stamp.censusVersion; man.clock = clock; man.tz = tz; man.status = "PROVISIONAL — the FINAL golden is cut from the frozen old engine after the PROGRESSION-1 decision (owner); this golden is from " + label + " " + (arg4 || "") ;
  for (const b of BLOBS) { const raw = JSON.parse(fs.readFileSync(b.file, "utf8")); const c = census(T, raw); const gPath = path.join(b.goldenDir, `${b.name}.${label}.json`); fs.writeFileSync(gPath, JSON.stringify({ stamp, blobSha256: sha(b.file), census: c }, null, 1)); man.goldens[`${b.name}.${label}`] = { blob: b.name, blobSha256: sha(b.file), goldenSha256: sha(gPath), privacy: b.privacy, engine: label, engineSha256: engineSha, engineCommit: arg4 || null, clock, tz, censusVersion: stamp.censusVersion, path: path.relative(ROOT, gPath) }; console.log("golden written:", b.name, label, b.private ? WITHHELD : ("lifts " + Object.keys(c.required.lifts).length + " counts " + JP(c.required.counts))); }
  fs.writeFileSync(MANIFEST, JSON.stringify(man, null, 1)); console.log("manifest written:", MANIFEST);
} else if (mode === "check" || mode === "sensitivity") {
  const man = JSON.parse(fs.readFileSync(MANIFEST, "utf8")); const goldenLabel = mode === "check" ? (arg4 || "main") : "main";
  const laws = [];
  laws.push({ id: "PORT-manifest-clock-zone-and-census-version-match-the-run", cite: "Sol suite-pass-1 port objection 4 (fail closed)", expect: "GREEN", run: () => ({ ok: man.clock === clock && man.tz === tz && man.censusVersion === stamp.censusVersion, detail: JP({ manifest: [man.clock, man.tz, man.censusVersion], run: [clock, tz, stamp.censusVersion] }) }) });
  for (const b of BLOBS) {
    const key = `${b.name}.${goldenLabel}`; const m = man.goldens[key]; const gPath = m && path.join(ROOT, m.path);
    laws.push({ id: `PORT-${b.name}-manifest-pins-fixture-golden-engine-and-stamp`, cite: "manifest.json (immutable pins: fixture hash, golden hash, engine hash/commit, clock, zone, census version)", expect: "GREEN",
      run: () => { if (!m || !fs.existsSync(gPath)) return { ok: false, detail: "no manifest entry / golden file for " + key }; const g = JSON.parse(fs.readFileSync(gPath, "utf8")); const checks = { fixture: sha(b.file) === m.blobSha256, golden: sha(gPath) === m.goldenSha256, goldenBlob: g.blobSha256 === m.blobSha256, stampEngine: g.stamp.engineSha256 === m.engineSha256, stampClock: g.stamp.clock === m.clock && g.stamp.tz === m.tz, stampCensus: g.stamp.censusVersion === m.censusVersion }; return { ok: Object.values(checks).every(Boolean), detail: priv(b, JP(checks) + " engine " + (m.engineCommit || "?")) + " · " + b.privacy }; } });
    if (mode === "check") {
      laws.push({ id: `PORT-${b.name}-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction`, cite: "sheet §A counts law / PRESENCE LAW + A3 kind correction (a strike is a NEW filed correction with a feed receipt, never a silent edit)", expect: "GREEN",
        run: () => { const raw = JSON.parse(fs.readFileSync(b.file, "utf8")); const c = census(T, raw).required; const s = T.migrate(JSON.parse(JSON.stringify(raw))); const k = ["reads", "nights", "dailyLogs", "sessionLog", "exercises", "queue", "earned", "debuts", "events", "waist"]; const bad = k.filter((x) => c.counts[x] !== c.rawCounts[x]);
          /* sets may only DECREASE by a filed strike: corrLog kind "strike" on that session + a feed receipt with the same op */
          let declared = 0, undeclared = 0; for (const [d, rec] of Object.entries(s.sessionLog || {})) { const rawRec = (raw.sessionLog || {})[d]; const rs = ((rawRec && rawRec.entries) || []).reduce((n, e) => n + ((e && e.reps) || []).length, 0), ms = ((rec && rec.entries) || []).reduce((n, e) => n + ((e && e.reps) || []).length, 0); if (ms < rs) { const strikes = ((rec && rec.corrLog) || []).filter((x) => x && x.kind === "strike"); const receipted = strikes.every((x) => (s.feed || []).some((f) => f && f.op === x.op)); if (strikes.length && receipted) declared += rs - ms; else undeclared += rs - ms; } if (ms > rs) undeclared += ms - rs; }
          return { ok: bad.length === 0 && undeclared === 0 && c.rawCounts.sets - c.counts.sets === declared, detail: priv(b, bad.length ? "changed by migrate: " + JP(bad) : "counts held on " + k.length + " classes; sets " + c.rawCounts.sets + " → " + c.counts.sets + " (" + declared + " struck by filed attested corrections with feed receipts, " + undeclared + " undeclared)") }; } });
      laws.push({ id: `PORT-${b.name}-census-v2-required-identical-to-golden`, cite: "owner ruling 2026-09-03: the port is proven by IDENTICAL reads (records DTO + lifts + energy + progression + today)", expect: "GREEN",
        run: () => { const g = JSON.parse(fs.readFileSync(gPath, "utf8")); const c = census(T, JSON.parse(fs.readFileSync(b.file, "utf8"))); const d = diffPaths(required(g.census), required(c)); return { ok: d.length === 0, detail: priv(b, d.length ? d.length + " differing paths — " + d.slice(0, 8).map((x) => x.path).join(" ") + (d.length > 8 ? " …" : "") + " (values withheld in code)" : "byte-identical required census (" + leafPaths(required(c)).length + " leaves, " + Object.keys(c.required.lifts).length + " active lifts)") }; } });
    } else {
      laws.push({ id: `PORT-${b.name}-every-required-leaf-is-compared-perturbation-detected`, cite: "Sol suite-pass-1 port objection 6 (sensitivity of each census field)", expect: "GREEN",
        run: () => { const c = required(census(T, JSON.parse(fs.readFileSync(b.file, "utf8")))); const leaves = leafPaths(c); const perturb = (v) => (typeof v === "number" ? v + 1 : typeof v === "string" ? v + "x" : typeof v === "boolean" ? !v : v === null ? 0 : Array.isArray(v) ? v.concat([1]) : { x: 1 });
          /* every leaf perturbed in ONE copy: the comparator must surface every one of them (or its container) — O(n), same proof as one-at-a-time */
          const copy = JSON.parse(JSON.stringify(c)); for (const p of leaves) { const segs = p.split("/").filter(Boolean); let o = copy; for (let i = 0; i < segs.length - 1; i++) o = o[segs[i]]; const k = segs[segs.length - 1]; o[k] = perturb(o[k]); } const d = diffPaths(c, copy); const seen = new Set(d.map((x) => x.path)); const missed = leaves.filter((p) => !seen.has(p) && !d.some((x) => x.path && p.startsWith(x.path + "/"))).length;
          /* and ONE leaf at a time on a sample of 40 spread across the tree, to show the single-leaf case too */
          let missedSingle = 0; for (let i = 0; i < leaves.length; i += Math.max(1, Math.floor(leaves.length / 40))) { const one = JSON.parse(JSON.stringify(c)); const segs = leaves[i].split("/").filter(Boolean); let o = one; for (let j = 0; j < segs.length - 1; j++) o = o[segs[j]]; const k = segs[segs.length - 1]; o[k] = perturb(o[k]); if (diffPaths(c, one).length === 0) missedSingle++; }
          return { ok: missed === 0 && missedSingle === 0 && leaves.length > 50, detail: priv(b, leaves.length + " leaves perturbed (all at once: " + missed + " undetected; 40 single-leaf samples: " + missedSingle + " undetected)") }; } });
      /* SEMANTIC MUTANTS BEFORE CENSUS GENERATION (Sol suite-pass-2 port objection 7): engine and INPUT mutations must change the required census */
      laws.push({ id: `PORT-${b.name}-semantic-engine-and-input-mutants-change-the-required-census`, cite: "Sol suite-pass-2 port objection 7: wrong target for one lift · dropped former name · missing volume receipt · stale sighting record · missing proposed-debut vector · altered Today copy — each must be DETECTED", expect: "GREEN",
        run: () => { const raw = JSON.parse(fs.readFileSync(b.file, "utf8")); const base = required(census(T, raw)); const firstLift = Object.keys(base.lifts)[0];
          const muts = [
            ["wrong-target-for-one-lift", () => ({ T: { ...T, targetsFor: (ex, st) => { const t = T.targetsFor(ex, st); return ex.id === firstLift && Array.isArray(t) ? t.map((x, i) => (i === 0 ? x + 1 : x)) : t; } }, raw })],
            ["dropped-former-name", () => { const r = JSON.parse(JSON.stringify(raw)); const ex = (r.exercises || []).find((e) => e && ((e.renames || []).length || (e.forks || []).length)); if (!ex) return null; ex.renames = []; ex.forks = (ex.forks || []).map((f) => ({ ...f, prevN: undefined })); return { T, raw: r }; }],
            ["missing-volume-receipt", () => { const r = JSON.parse(JSON.stringify(raw)); const i = (r.feed || []).findIndex((f) => f && /^VOLUME [+\-\u2212]\d+ — /.test(String(f.t))); if (i < 0) return null; r.feed.splice(i, 1); return { T, raw: r }; }],
            ["stale-sighting-record", () => ({ T: { ...T, migrate: (x) => { const st = T.migrate(x); const ex = (st.exercises || []).find((e) => e && e.topAt != null); if (ex) { ex.topAt = ex.topAt + 5; ex.topRun = (ex.topRun || 0) + 1; } else if (st.exercises && st.exercises[0]) { st.exercises[0].topAt = 999; st.exercises[0].topRun = 9; } return st; } }, raw })],
            ["missing-proposed-debut-vector", () => { const r = JSON.parse(JSON.stringify(raw)); const q = (r.queue || []).find((x) => x && x.kind === "debut" && Array.isArray(x.newWSets)); if (!q) return null; delete q.newWSets; return { T, raw: r }; }],
            ["altered-Today-copy", () => ({ T: { ...T, statusFace: (st) => { const f = T.statusFace(st); return f ? { ...f, cause: String(f.cause) + " (altered)" } : { word: "X", cause: "altered" }; } }, raw })],
          ];
          const results = muts.map(([name, mk]) => { const m = mk(); if (!m) return { name, status: "NOT_APPLICABLE (fixture lacks the feature)" }; const c = required(census(m.T, m.raw)); const d = diffPaths(base, c); return { name, status: d.length ? "DETECTED" : "MISSED", paths: d.length }; });
          const applicable = results.filter((r) => r.status !== "NOT_APPLICABLE (fixture lacks the feature)"); const missed = applicable.filter((r) => r.status === "MISSED");
          return { ok: missed.length === 0 && applicable.length >= 4, detail: priv(b, results.map((r) => r.name + ":" + r.status.split(" ")[0] + (r.paths ? "(" + r.paths + ")" : "")).join(" · ")) }; } });
      laws.push({ id: `PORT-${b.name}-real-change-probe-${label}-vs-golden-main-differs`, cite: "a changed engine must be DETECTED by the required census (the old engine is the last pre-PROGRESSION-1 main a0009c3; real change)", expect: "GREEN",
        run: () => { const g = JSON.parse(fs.readFileSync(gPath, "utf8")); const c = census(T, JSON.parse(fs.readFileSync(b.file, "utf8"))); const d = diffPaths(required(g.census), required(c)); const groups = {}; for (const x of d) { const grp = x.path.split("/")[1]; groups[grp] = (groups[grp] || 0) + 1; } return { ok: d.length > 0, detail: priv(b, d.length + " differing paths by group " + JP(groups) + " (values withheld in code)") }; } });
    }
  }
  const r = runLaws(`PORT ORACLE v2 — ${mode} '${label}' vs golden '${goldenLabel}' (clock ${clock} ${tz}; manifest ${man.status})`, laws, { logPath: path.join(ROOT, "run.log") });
  process.exit(r.fail || r.defects || r.errors ? 1 : 0);
} else { console.log("usage: golden | check | sensitivity"); process.exit(2); }
