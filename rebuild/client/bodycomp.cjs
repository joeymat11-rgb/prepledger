"use strict";
/* bodycomp.cjs — LEAN MASS from a body-fat FRACTION interval (sheet 494–500, D13 lean_anchor).
     lean_low = W × (1 − b_high) · lean_high = W × (1 − b_low) · lean_point = W × (1 − b_point)
   With a weight interval [W_low, W_high]: lean_low = W_low × (1 − b_high), lean_high = W_high × (1 − b_low).
   A missing central estimate is NOT invented: the point is absent and the anchor is labelled "midpoint". */
function leanFromEstimate({ weightLb, weightLow, weightHigh, bfLow, bfHigh, bfPoint }) {
  const wLow = weightLow == null ? weightLb : weightLow, wHigh = weightHigh == null ? weightLb : weightHigh;
  if (typeof wLow !== "number" || typeof wHigh !== "number") throw new Error("leanFromEstimate: a body weight (or interval) is required");
  if (typeof bfLow !== "number" || typeof bfHigh !== "number" || bfLow < 0 || bfHigh > 1 || bfLow > bfHigh) throw new Error("leanFromEstimate: body-fat fraction interval [bfLow, bfHigh] within [0, 1] is required");
  const out = { low: wLow * (1 - bfHigh), high: wHigh * (1 - bfLow), source: "your estimate", unit: "lb" };
  if (bfPoint != null) { out.point = weightLb * (1 - bfPoint); out.label = "point"; } else out.label = "midpoint";
  return out;
}
module.exports = { leanFromEstimate };
