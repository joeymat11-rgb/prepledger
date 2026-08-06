/* VACUITY SCAN — find assertions that cannot fail.
 *
 * Absence of an assertion is easy to grep for. VACUITY is not, and it is the one that
 * survives review: the test is present, it is named, it passes, and it asserts nothing.
 *
 * Three instances of it are on the record, all found by hand, all within four days:
 *
 *   ok(hair.state !== "flat" || hair.pctClean == null, ...)
 *       pctClean is not a field, so the disjunct was always true.
 *   ok(rcOut.redlinePct === null || rcOut.redlinePct === BCB(s3).redlinePct, ...)
 *       on SEED the crossing does not fire, so redlinePct is null and the identity
 *       was never evaluated.
 *   ok(!sealedRun.proposals.some(redline), "sealed window mutes ...")
 *       the fixture's absolute date sat outside the frozen anchor, so the seal was
 *       never engaged and the assertion passed on an unrelated coincidence.
 *
 * All three share a shape: an ESCAPE HATCH in the condition, or a fixture that never
 * reaches the branch. This scan finds the first kind mechanically.
 *
 * TWO THINGS IT CANNOT DO, stated so nobody mistakes a clean run for proof:
 *   - it cannot tell a legitimate "either absent, or correct when present" from a hatch.
 *     Precision is poor by design; RECALL is the point.
 *   - it says nothing about assertions that reference real fields and still assert
 *     nothing, which is the second kind above.
 *
 * COMMENTS ARE STRIPPED LINE-PRESERVINGLY. Both of those matter and both were learned:
 * a raw-text scan flagged `pctClean` inside the comment DOCUMENTING the pctClean bug,
 * and removing comment lines outright shifted every line number after them, so the scan
 * reported a defect at a line that did not contain it. A tool with the defect class it
 * exists to find is worse than no tool.
 *
 * A THIRD LESSON, GENERAL TO ALL ABSENCE-CHECKS: any check asserting a token is ABSENT must
 * strip comments first, because the comment recording the removal necessarily contains the
 * token. This was hit twice, independently, one file apart, on the same day — by this scan
 * flagging pctClean inside the comment documenting the pctClean bug, and by the R4 assertion
 * banning bf.pct while the comments recording its deletion quote it. It is inherent to the
 * shape, not a coincidence, so any new absence-check starts from the stripped source.
 *
 *   node tools/vacuity-scan.mjs
 */
import { readFileSync } from "node:fs";

const FILE = process.argv[2] || "tools/engine-test.jsx";
const raw = readFileSync(FILE, "utf8");

/* line-preserving: comment bodies become spaces, newlines survive */
const stripped = raw
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
  .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + m.slice(p.length).replace(/./g, " "));

const HATCH = [
  /\|\|\s*[!(]?\s*[A-Za-z_$][\w$.]*\s*(==|===)\s*(null|undefined)/,
  /(==|===)\s*(null|undefined)\s*\|\|/,
];

const lines = stripped.split("\n");
const rawLines = raw.split("\n");
const hits = [];
for (let i = 0; i < lines.length; i++) {
  if (!/\bok\(/.test(lines[i])) continue;
  if (HATCH.some((re) => re.test(lines[i]))) hits.push(i + 1);
}

console.log(`vacuity scan — ${FILE}`);
console.log(`  ok() lines scanned : ${lines.filter((l) => /\bok\(/.test(l)).length}`);
console.log(`  escape-hatch shape : ${hits.length}`);
for (const n of hits) console.log(`    ${n}: ${rawLines[n - 1].trim().slice(0, 120)}`);
console.log(`
  Every hit needs a human answer to one question: CAN THIS ASSERTION FAIL?
  If the left side is unreachable in the fixture, the answer is no and the hatch is
  hiding it. If the null case is genuinely possible and genuinely acceptable, it is
  fine — but drive the non-null case somewhere too, or nothing tests it.`);
