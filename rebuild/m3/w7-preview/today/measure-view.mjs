// measure-view.mjs - P-MEASURE v1, the one comparison view (plan section 4 (3)).
//
// Pure: no DOM, no store, no client, no network. It takes the weekly rows
// measure-model.mjs already computed and lays out baseline beside trial, same
// measures, same units, weekly rows, weeks 1-2 of the trial flagged run-in. No
// verdict and no coaching copy is composed anywhere in this file: every string
// below names a measure or a unit, never a judgement of the number.
//
// THE BASELINE WINDOW, BEFORE P3. local-source-basis.mjs is the only source the
// baseline window can come from (plan section 3), and it is empty until the real
// import (P3) lands. `buildComparisonView` never invents a baseline: an empty
// `baselineWeeks` renders the window's own definition and nothing else.

"use strict";

export const NO_BASELINE_YET =
  "No baseline yet. Baseline window: the last 8 to 12 complete weeks on the frozen app, "
  + "taken from the imported history after the import lands.";
export const RUN_IN_NOTE = "Weeks 1 and 2 are run in: recorded, shown, and not the weeks the comparison reads.";

export const MEASURES = Object.freeze([
  { key: "weightAvg", label: "Weight, 7 day average", unit: "lb" },
  { key: "waist", label: "Waist", unit: "in" },
  { key: "waistTrend4Week", label: "Waist, 4 week trend", unit: "in" },
  { key: "trainingAdherencePct", label: "Training adherence", unit: "%" },
  { key: "foodAdherencePct", label: "Food logging adherence", unit: "%" },
  { key: "energyAdherencePct", label: "Energy logging adherence", unit: "%" },
  { key: "sleepQualifyingNights", label: "Sleep nights qualifying", unit: "/7" },
]);

const fmt = (value, unit) => {
  if (value === null || value === undefined) return "Not enough data yet";
  return unit === "/7" ? value + unit : value + " " + unit;
};

/* One measure row per marker, added beside the fixed measures above so a screen
   with three markers and one with four render the same shape either side. */
function markerRows(markers) {
  return (Array.isArray(markers) ? markers : []).map((marker) => ({
    key: marker, label: marker + ", estimated 1RM", unit: "lb",
  }));
}

/* baselineWeeks and trialWeeks are arrays of measure-model.mjs computeWeek() rows.
   markers is the fixed list of 3 to 4 strength markers chosen once (plan section
   2), so both windows read the same marker rows even when one has no set for a
   given week (a marker row with no set that week reads "Not enough data yet",
   never a fabricated number). */
export function buildComparisonView({ baselineWeeks = [], trialWeeks = [], markers = [] } = {}) {
  const rows = [...MEASURES, ...markerRows(markers)];
  const trial = trialWeeks.map((w, i) => ({ ...w, runIn: i < 2 }));
  return {
    hasBaseline: baselineWeeks.length > 0,
    baselineNote: baselineWeeks.length ? null : NO_BASELINE_YET,
    baseline: baselineWeeks,
    trial,
    markers: [...markers],
    rows,
  };
}

function valueOf(week, rowKey) {
  if (rowKey in week) return week[rowKey];
  if (week.marker1RM && rowKey in week.marker1RM) return week.marker1RM[rowKey];
  return null;
}

/* THE EXPORT (plan section 4 (4)): a plain, copyable text table, device only. No
   download and no network - this returns a string; the caller decides where the
   athlete's own device puts it (a text box, a clipboard write, nothing this
   module reaches for itself). */
export function exportText(view) {
  const lines = [];
  lines.push("EARNED MEASUREMENT COMPARISON");
  lines.push("");
  if (!view.hasBaseline) {
    lines.push(view.baselineNote || NO_BASELINE_YET);
    lines.push("");
  }
  lines.push(RUN_IN_NOTE);
  lines.push("");
  const header = ["Week", ...view.rows.map((r) => r.label + " (" + r.unit + ")")];
  lines.push(header.join(" | "));
  if (view.hasBaseline) {
    lines.push("BASELINE");
    for (const week of view.baseline) {
      lines.push(["Week " + week.week, ...view.rows.map((r) => fmt(valueOf(week, r.key), r.unit))].join(" | "));
    }
  }
  lines.push("TRIAL");
  for (const week of view.trial) {
    const label = "Week " + week.week + (week.runIn ? " (run in)" : "");
    lines.push([label, ...view.rows.map((r) => fmt(valueOf(week, r.key), r.unit))].join(" | "));
  }
  return lines.join("\n");
}

export default { NO_BASELINE_YET, RUN_IN_NOTE, MEASURES, buildComparisonView, exportText };
