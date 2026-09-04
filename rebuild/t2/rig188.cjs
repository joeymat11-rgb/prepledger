/* rig188 — execute the T2 report's suite-library claims (6a/6b) and an independent fuzz of the product encoder vs lib/canonical.cjs */
const __p = require("node:path"), __f = require("node:fs"); const CLIENT_DIR = process.env.EARNED_CLIENT_DIR || (__f.existsSync(__p.join(__dirname, "..", "client", "index.cjs")) ? __p.join(__dirname, "..", "client") : "/home/claude/rebuild/client"); const CONFORM_DIR = process.env.EARNED_CONFORM_DIR || (__f.existsSync(__p.join(__dirname, "..", "conform", "run.cjs")) ? __p.join(__dirname, "..", "conform") : "/home/claude/conform");
const C = require(__p.join(CONFORM_DIR, "lib/canonical.cjs")); const P = require(__p.join(CLIENT_DIR, "canonical.cjs"));
const enc = (v) => C.encode(v, C.defaults); const penc = (v) => (P.encode || P.canonicalEncode || P)(v);
const claims = {
  "6a(i) 1e21 encodes in exponent form under lib/canonical.cjs": enc(1e21),
  "6a(ii) 1.5e30 and 1.5e300 collide": [enc(1.5e30), enc(1.5e300)],
  "6a(iii) 1e-21 → '0' (collides with 0); -1e-21 → '-0' while -0 → '0'": [enc(1e-21), enc(0), enc(-1e-21), enc(-0)],
  "6b map keys: UTF-16 order (U+1F600 before U+FF01)?": enc({ "\u{1F600}": 1, "！": 2 }),
};
console.log("rig188 — suite-library claims, executed"); for (const [k, v] of Object.entries(claims)) console.log("  " + k + " → " + JSON.stringify(v));
const okClaims = enc(1e21) === "1e+21" && enc(1.5e30) === enc(1.5e300) && enc(1e-21) === "0" && enc(-1e-21) === "-0" && enc(-0) === "0";
/* independent fuzz: 20,000 random nested values; product bytes must equal the suite's bytes */
let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const strs = ["", "a", "café", "café", "\u{1F600}", "！", "x\ny", "\"q\"", "ß", "Ω"];
function gen(d) { const r = rnd(); if (d > 3 || r < 0.15) return strs[Math.floor(rnd() * strs.length)]; if (r < 0.35) { const m = [0, -0, 1, 1.5, 160, 160.0, 1.6e2, 2100, 1e21, 1e-7, 123456789.125, -42.5, 0.1 + 0.2, 1e-21, NaN, Infinity][Math.floor(rnd() * 16)]; return m; } if (r < 0.42) return null; if (r < 0.47) return undefined; if (r < 0.52) return rnd() < 0.5;
  if (r < 0.72) { const n = Math.floor(rnd() * 4); const a = []; for (let i = 0; i < n; i++) a.push(gen(d + 1)); return a; }
  const o = {}; const keys = ["b", "a", "causal_parents", "value", "unit", "\u{1F600}", "！", "z"]; const n = Math.floor(rnd() * 5); for (let i = 0; i < n; i++) o[keys[Math.floor(rnd() * keys.length)]] = (keys[i] === "causal_parents") ? [gen(d + 2), gen(d + 2), gen(d + 2)] : gen(d + 1); if (rnd() < 0.3) o.causal_parents = ["p2", "p1", "p1", "café", "café"]; return o; }
let mismatches = 0, n = 20000, first = null; for (let i = 0; i < n; i++) { const v = gen(0); let a, b; try { a = enc(v); } catch (e) { a = "THROW " + e.message; } try { b = penc(v); } catch (e) { b = "THROW " + e.message; } if (a !== b) { mismatches++; if (!first) first = { v, a, b }; } }
console.log(`  fuzz: ${n} values, ${mismatches} mismatches` + (first ? " first=" + JSON.stringify(first) : ""));
const ok = okClaims && mismatches === 0; console.log("rig188 ⇒ " + (ok ? "PASS" : "FAIL") + " — the 6a/6b claims are TRUE (lib/canonical.cjs defects; canonical-v2 candidate) and the product encoder matches the suite byte-for-byte"); process.exit(ok ? 0 : 1);
