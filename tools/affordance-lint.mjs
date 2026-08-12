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

/* M2 — THE LINT SAW ONLY <Btn>. Two live violations sat outside its vision: a fixed
   RESUME BAR (a real <button>) whose label span was brass, and four gym set chips
   (plain DIVs) wearing 12px radius + a brass border. The grammar is about WHAT THE
   ELEMENT IS, not which component drew it — so the lint reads raw elements too.

   SCOPE, STATED HONESTLY (found by running the general rule against this codebase):
   a line-based reader cannot resolve JSX element boundaries. Reading colour over an
   opening-tag window flagged 23 sites that are STATE-COLOURED CHILDREN inside
   tappable cards — precisely the brass/jade state register Joe's M6 ruling blessed
   (the decisions count, the OWED label, the gym progress marker). Recolouring those
   would have been the gate forcing a wrong change. So the raw-element rules are
   scoped to what a line reader can judge TRUTHFULLY:
     · the COSTUME rule — a non-tappable element with a full brass border and a
       button radius — which is mechanical and needs no element graph, and
     · POSITIVE PINS on the two sites this round fixed, so neither can drift back.
   A JSX-aware affordance audit (parse, resolve each element's own handler and its
   own paint) is the general answer and is filed as future work — named, not silent. */
{
  const lines = src.split(String.fromCharCode(10));
  lines.forEach((ln, i) => {
    const win = lines.slice(Math.max(0, i - 3), i + 2).join(" ");
    const clickable = /onClick=|role="button"/.test(win);
    const borderVal = (ln.match(/[^A-Za-z]border: [^,]*/) || [""])[0];   /* the FULL border only — an accent RULE (borderLeft/Bottom) is the brass brand register, not a costume */
    const brassBorder = borderVal.indexOf("rgba(229,180,84") > -1 || borderVal.indexOf("T.brass") > -1 || borderVal.indexOf("DT.amber") > -1;
    const radius = /borderRadius: (8|9|1[0-8]|999)/.test(ln);
    if (!clickable && radius && brassBorder) fails.push(`line ${i + 1}: a NON-TAPPABLE element wearing a brass button costume (radius + brass border) — D3's named prohibition`);
  });
}
/* the two M2 sites, pinned in the shape they were fixed into */
need("data-chip=\"session-live\"", 1, "the resume bar exists");
ban("color: resting ? DT.jade : DT.amber", "the RESUME BAR is a control: its label was brass in one arm and jade in the other — never neutral, never gauge");
need("<span style={{ display: \"block\", background: DT.card2", 1, "the resume bar label survives");
ban("i9 === setN ? \"rgba(229,180,84,.5)\"", "the gym set chips wore a brass button border while being non-tappable divs");
if (fails.length) {
  console.log("AFFORDANCE LINT — the tap-color grammar drifted:");
  fails.forEach((f) => console.log("  FAIL  " + f));
  process.exit(1);
}
console.log("affordance lint: the tap-color grammar holds (gauge tappable, jade/orange state, brass never a control)");
