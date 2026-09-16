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
  /* ROUND 2, FINDING 9 - run in is the week's own NUMBER (week 1, week 2 of the
     trial), never the array position it happens to render at: a caller handing
     weeks 3-12 must never see weeks 3 and 4 flagged run in. */
  const trial = trialWeeks.map((w) => ({ ...w, runIn: w && w.week <= 2 }));
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

/* ---------------------------------------------------------------------------
   ROUND 2, CLOSING FINDING 2 - "nothing renders": a real mount, real DOM,
   data-slot marked, reachable from today-app.cjs's own route table.
   Pure DOM construction, no template clone: this screen is new and carries no
   approved-design reference yet, so every element below names itself with
   data-slot the way an approved template's own slots do, for a caller (and a
   test) to find without guessing at structure.
   --------------------------------------------------------------------------- */
function weekRow(doc, week, rows) {
  const tr = doc.createElement("tr");
  tr.dataset.slot = "measure-week-row";
  const th = doc.createElement("th");
  th.scope = "row";
  th.textContent = "Week " + week.week + (week.runIn ? " (run in)" : "");
  tr.append(th);
  for (const r of rows) {
    const td = doc.createElement("td");
    td.textContent = fmt(valueOf(week, r.key), r.unit);
    tr.append(td);
  }
  return tr;
}

/* `view` is buildComparisonView()'s own return shape. `container` is the
   element this screen owns (today-app.cjs hands it #phone's own child, never
   #phone itself, exactly as checkin-app.mjs's mountCheckIn does). */
export function mountMeasureComparison(doc, container, view) {
  if (!container) throw new Error("Measure: no host element");
  const root = doc.createElement("section");
  root.dataset.slot = "measure-comparison";

  const heading = doc.createElement("h2");
  heading.textContent = "Comparison";
  root.append(heading);

  const note = doc.createElement("p");
  note.dataset.slot = "measure-baseline-note";
  note.textContent = view.hasBaseline ? "" : (view.baselineNote || NO_BASELINE_YET);
  note.hidden = view.hasBaseline;
  root.append(note);

  const runInNote = doc.createElement("p");
  runInNote.dataset.slot = "measure-run-in-note";
  runInNote.textContent = RUN_IN_NOTE;
  root.append(runInNote);

  const table = doc.createElement("table");
  table.dataset.slot = "measure-table";
  const thead = doc.createElement("thead");
  const headRow = doc.createElement("tr");
  const weekTh = doc.createElement("th");
  weekTh.scope = "col"; weekTh.textContent = "Week";
  headRow.append(weekTh);
  for (const r of view.rows) {
    const th = doc.createElement("th");
    th.scope = "col";
    th.textContent = r.label + " (" + r.unit + ")";
    headRow.append(th);
  }
  thead.append(headRow);
  table.append(thead);

  const tbody = doc.createElement("tbody");
  if (view.hasBaseline) {
    for (const week of view.baseline) tbody.append(weekRow(doc, week, view.rows));
  }
  for (const week of view.trial) tbody.append(weekRow(doc, week, view.rows));
  table.append(tbody);
  root.append(table);

  container.replaceChildren(root);
  return root;
}

/* THE WAIST ENTRY BOX. `onSave(entry)` is the caller's own write path (today-app.cjs
   wires it to the measure host's save() - measure-view.mjs never writes anything
   itself). `today` is the day box refuses a future date against, in the SAME words
   measure-model.mjs's waistRefusalFor uses. */
export function mountWaistEntry(doc, container, { today, onSave, error = null } = {}) {
  if (!container) throw new Error("Measure: no host element");
  const root = doc.createElement("form");
  root.dataset.slot = "measure-waist-entry";

  const dateLabel = doc.createElement("label");
  dateLabel.textContent = "Date";
  const dateInput = doc.createElement("input");
  dateInput.type = "date";
  dateInput.dataset.slot = "measure-waist-date";
  if (today) dateInput.max = today;
  dateLabel.append(dateInput);

  const valueLabel = doc.createElement("label");
  valueLabel.textContent = "Waist (in)";
  const valueInput = doc.createElement("input");
  valueInput.type = "text";
  valueInput.dataset.slot = "measure-waist-value";
  valueLabel.append(valueInput);

  const errorEl = doc.createElement("p");
  errorEl.dataset.slot = "measure-waist-error";
  errorEl.textContent = error || "";
  errorEl.hidden = !error;

  const button = doc.createElement("button");
  button.type = "submit";
  button.dataset.slot = "measure-waist-save";
  button.textContent = "Record waist";
  root.addEventListener("submit", (event) => {
    event.preventDefault();
    if (typeof onSave === "function") onSave({ date: dateInput.value, in: valueInput.value });
  });

  root.append(dateLabel, valueLabel, errorEl, button);
  container.replaceChildren(root);
  return root;
}

export default { NO_BASELINE_YET, RUN_IN_NOTE, MEASURES, buildComparisonView, exportText,
  mountMeasureComparison, mountWaistEntry };
