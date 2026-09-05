"use strict";
// Test-only extension of the frozen reference table, never the candidate table.
// These four helpers are absent from frozen __test. Evaluate exact declarations
// from the verified frozen git blob; sessionScore stays the frozen bundle's own.
const { execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const path = require("node:path");
module.exports = function volumeReference(G) {
  const root = path.resolve(__dirname, "../../..");
  const bytes = execFileSync("git", ["show", "fe516c1:src/app.jsx"], {
    cwd: root, maxBuffer: 8 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"], windowsHide: true
  });
  const sha = crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
  if (sha !== "f98671d823f0d8cd83e730cdd930afe5f5e7b628") throw Error("frozen source pin mismatch");
  const lines = bytes.toString("utf8").split("\n");
  const ranges = [
    [3159, 3160], // T_CRIT_95 and _tCrit
    [3169, 3169], [3171, 3171], // TREND_MIN_SESSIONS and TREND_SE_FLOOR
    [8627, 8627], // volBucket
    [8712, 8713], // HYP_SDES/HYP_B and hypGain
    [8862, 8879], // _blockSlope
    [9015, 9021], // _setsMovesSince
  ];
  const code = ranges.map(([a, b]) => lines.slice(a - 1, b).join("\n")).join("\n");
  const extras = new Function("sessionScore", code +
    "\nreturn {volBucket, hypGain, _blockSlope, _setsMovesSince};")(G.sessionScore);
  return { ...G, ...extras };
};
