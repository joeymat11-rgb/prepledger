import fs from "fs";
const p = "src/app.jsx";
let t = fs.readFileSync(p, "utf8");
const BT = String.fromCharCode(96), D = "$";

/* 1. the TRAIN set-count row: say what the numbers MEAN in a deficit, not just
      colour them against a growth band he is not currently buying */
const a1 = `          {matureV ? "THIS WEEK'S SETS · " : "SETS THIS WEEK — counting only, no verdicts until the ledger has 14 days of your logs · "}`;
const b1 = `          {matureV ? "THIS WEEK'S SETS · holding, not growing — see below · " : "SETS THIS WEEK — counting only, no verdicts until the ledger has 14 days of your logs · "}`;
if (t.includes(a1)) t = t.replace(a1, b1); else console.log("! chip label");

/* 2. the volume read, on TRAIN under the selection card */
const a2 = `      {sess.ex.map((ex) => (`;
const b2 = `      {/* What the set counts mean while he is cutting — see CUTTING_VOLUME_NOTE.
          Colouring a muscle red against a GROWTH band, in a deficit, tells a man
          to add work the one direct trial says buys him nothing. */}
      {(() => { const vi9 = volumeImbalance(s); if (!vi9) return null; return (
        <Card style={{ padding: 12 }} accent={vi9.cutting ? undefined : T.brass}>
          <Eyebrow c={vi9.cutting ? T.steel : T.brass}>{vi9.cutting ? "YOUR SET ALLOCATION — AND WHY IT IS FINE RIGHT NOW" : "YOUR SET ALLOCATION — WORTH ACTING ON NOW"}</Eyebrow>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.steel, marginTop: 6, lineHeight: 1.7 }}>
            {vi9.pv.map((m) => <span key={m.mg} style={{ marginRight: 9, color: m.indirectOnly ? T.dim : T.steel }}>{mgLabel(m.mg)} {m.sets}{m.indirectOnly ? "*" : ""}</span>)}
          </div>
          <div style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, marginTop: 8, lineHeight: 1.55 }}>{vi9.why}</div>
          <More c={vi9.cutting ? T.steel : T.brass}
            deep="Two different questions wear the same units. How many sets per muscle per week to GROW is Pelland 2025's dose-response — 67 studies, 2,058 participants — and it peaks in return between five and ten weekly sets, measured in people eating enough to build. How many to KEEP what you have in a deficit is a different question with its own direct evidence, and the answer is: fewer than you would guess, and not sensitive to volume. Roth 2023 ran trained men six weeks at a 30 kcal/kg deficit with protein at 2.8 g/kg fat-free mass and compared roughly twenty weekly sets against twelve — lean mass fell 0.51 kg and 0.92 kg respectively, not a significant difference, with no difference in muscle thickness either. Bickel 2011 is starker: after sixteen weeks of building, young adults held their thigh lean mass for thirty-two weeks on ONE-NINTH of the volume that built it, one session a week, and got stronger. Adding sets in a deficit costs recovery you have less of and session time you have to find, in exchange for an effect the direct evidence cannot detect. The allocation still matters — it is the first thing to fix when you start building — which is why it is on this card instead of thrown away."
            forYou={(() => { const out = []; const th = vi9.taker; if (th) out.push(vi9.cutting
              ? cap(mgLabel(th.mg)) + " at " + th.sets + " sets a week is the lowest allocation in your programme, and while you are cutting that is adequate — you are asking it to hold, and holding is cheap."
              : cap(mgLabel(th.mg)) + " at " + th.sets + " sets is the first thing to raise now that you are building." );
              out.push("Everything else sits in a range the evidence is comfortable with, and your deltoids read correctly for the first time — they were being counted as one 17-set muscle instead of three heads at 5 to 8 each, which is why the app used to flag them red.");
              out.push("* = credited from compound work only, with no direct lift of its own. The lever there is the press, not another isolation movement."); return out; })()} />
        </Card>
      ); })()}

      {sess.ex.map((ex) => (`;
if (!t.includes(a2)) { console.log("! vol card anchor"); process.exit(1); }
t = t.replace(a2, b2);

/* 3. the Analyst must not recommend volume increases during the cut either */
const a3 = "    + " + BT + "HIS MEASURED SET-TO-SET REP SPREAD";
const b3 = [
  "    + (() => { const vi8 = volumeImbalance(s); if (!vi8) return \"\";",
  "        return " + BT + "WEEKLY SET ALLOCATION (by head, deltoids counted separately because they are separately trained): " + D + "{vi8.pv.map((m) => mgLabel(m.mg) + \" \" + m.sets + (m.indirectOnly ? \" (indirect only)\" : \"\")).join(\", \")}. " + D + "{vi8.cutting ? \"He is in a DEFICIT, so do NOT recommend adding sets to a muscle that sits below the 6-12 growth band. That band is a growth dose-response measured in people eating enough to build. Roth 2023 (n=38, six weeks, 30 kcal/kg deficit, 2.8 g/kg protein) compared ~20 weekly sets against ~12 and found lean mass preserved identically, with no muscle-thickness difference; Bickel 2011 held young adults' thigh lean mass for 32 weeks on one-ninth of the volume that built it. Retention is cheap and is not volume-sensitive. If he asks about a muscle being low, say it is adequate for holding and is the first thing to raise when he starts building.\" : \"He is no longer in a deficit, so the growth band applies again and raising the lowest muscle is worth proposing.\"} " + BT + "; })()",
  "    + " + BT + "HIS MEASURED SET-TO-SET REP SPREAD",
].join("\n");
if (!t.includes(a3)) { console.log("! analyst anchor"); process.exit(1); }
t = t.replace(a3, b3);

/* 4. exercise selection into the analyst too */
const a4 = "    + " + BT + "WEEKLY SET ALLOCATION";
const b4 = [
  "    + (() => { const se8 = exerciseSelection(s); if (!se8.items.length) return \"\";",
  "        return " + BT + "EXERCISE SELECTION (audited, confirmed by him directly): " + D + "{se8.items.map((i8) => i8.n + \" \" + (i8.good ? \"CORRECT\" : \"could improve\")).join(\", \")}. " + D + "{se8.allGood ? \"Every biarticular lift in his programme is already in the lengthened position — standing calf raise with a stretch pause, seated ham curl, reclined leg extension. This is the largest effect in the training literature (standing vs seated calf raise d = 0.88-1.58) and he is on the right side of it. Tell him so if training comes up; do NOT go looking for exercise-selection upgrades that are not there. His triceps use a Prime 3-peg rather than an overhead position: he was shown the d = 0.54-0.61 case and chose to keep it, which is settled — the peg changes the resistance profile, not the shoulder angle, so it was never the same variable. Do not raise it again.\" : \"\"} " + BT + "; })()",
  "    + " + BT + "WEEKLY SET ALLOCATION",
].join("\n");
if (!t.includes(a4)) { console.log("! sel anchor"); process.exit(1); }
t = t.replace(a4, b4);

fs.writeFileSync(p, t);
console.log("volume read surfaced + analyst briefed");
