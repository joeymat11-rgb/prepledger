// A4 (design round) — THE AFFORDANCE LINT. One tap-color grammar, enforced:
// gauge = tappable · jade/orange/redline = state only · brass = brand + earned
// moments, never a control. Static banned-pattern counts on src/app.jsx so the
// grammar cannot drift back. Runs in scripts/check.mjs beside the contrast audit.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const src = readFileSync(join(ROOT, "src", "app.jsx"), "utf8");
const count = (p) => src.split(p).length - 1;
const fails = [];
const ban = (p, why) => { const c = count(p); if (c !== 0) fails.push(`${c}x ${JSON.stringify(p)} — ${why}`); };
const need = (p, n, why) => { const c = count(p); if (c < n) fails.push(`only ${c}x ${JSON.stringify(p)} (need >= ${n}) — ${why}`); };

ban('tone="jade"', "jade is state, never a control tone");
ban('tone="brass"', "brass is brand/earned, never a control tone");
ban('tone="orange"', "caution never colors a routine control (an allowlist joins here if a genuine one appears)");
ban('? "jade" : "ghost"', "conditional jade tones are still control jade");
ban("background: DT.amber, color", "a brass-filled control is the brand working as a button");
ban('color: "#141008"', "the hardcoded dark-on-brass control ink died with the fills");
need("background: T.gauge", 4, "the FAB and the gym CTAs carry the one tappable hue");
need('tone="gauge"', 40, "controls live on the gauge tone");

if (fails.length) {
  console.log("AFFORDANCE LINT — the tap-color grammar drifted:");
  fails.forEach((f) => console.log("  FAIL  " + f));
  process.exit(1);
}
console.log("affordance lint: the tap-color grammar holds (gauge tappable, jade/orange state, brass never a control)");
