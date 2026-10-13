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

import { ONE_RM_FORMULA_TEXT, WAIST_MIN, WAIST_MAX } from './measure-model.mjs';

/* THE FORMULA, NAMED ON THE SCREEN (ticket BUILD (2), "Epley, named in the
   UI"). The words come from measure-model.mjs so the screen can never name one
   formula while the arithmetic runs another. */
export const ONE_RM_NOTE = "Estimated 1RM uses the Epley formula: " + ONE_RM_FORMULA_TEXT + ".";
export const EXPORT_LABEL = "Export as text";
export const EXPORT_HIDE = "Hide the text table";
export const EXPORT_NOTE = "This table is on this device only. Select it and copy it.";
export const MARKERS_HEAD = "Strength markers";
export const MARKERS_LEAD = "Choose 3 or 4 lifts to follow for the whole trial. This is chosen once and is not changed afterwards.";
export const MARKERS_SAVE = "Use these markers";
export const MARKERS_NONE = "This device has no lifts to choose markers from yet.";
export const WAIST_RANGE_NOTE = "Waist in inches, between " + WAIST_MIN + " and " + WAIST_MAX + ".";

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

/* ONE window's table: the same header and the same measure rows either side, so
   the two columns of the comparison are read against each other line by line. */
function windowTable(doc, { slot, title, weeks, rows }) {
  const section = doc.createElement("section");
  section.dataset.slot = slot;
  const heading = doc.createElement("h3");
  heading.textContent = title;
  section.append(heading);
  const table = doc.createElement("table");
  table.dataset.slot = slot + "-table";
  const thead = doc.createElement("thead");
  const headRow = doc.createElement("tr");
  const weekTh = doc.createElement("th");
  weekTh.scope = "col"; weekTh.textContent = "Week";
  headRow.append(weekTh);
  for (const r of rows) {
    const th = doc.createElement("th");
    th.scope = "col";
    th.textContent = r.label + " (" + r.unit + ")";
    headRow.append(th);
  }
  thead.append(headRow);
  table.append(thead);
  const tbody = doc.createElement("tbody");
  for (const week of weeks) tbody.append(weekRow(doc, week, rows));
  table.append(tbody);
  section.append(table);
  return section;
}

/* `view` is buildComparisonView()'s own return shape. `container` is the
   element this screen owns (today-app.cjs hands it #phone's own child, never
   #phone itself, exactly as checkin-app.mjs's mountCheckIn does). */
export function mountMeasureComparison(doc, container, view, options = {}) {
  if (!container) throw new Error("Measure: no host element");
  const { exportOpen = false, onExport = null } = options;
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

  const formulaNote = doc.createElement("p");
  formulaNote.dataset.slot = "measure-formula-note";
  formulaNote.textContent = ONE_RM_NOTE;
  root.append(formulaNote);

  /* BASELINE LEFT, TRIAL RIGHT (plan section 4 (3)). Two tables, same measures,
     same units, weekly rows - never one table whose rows cannot be told apart. */
  const windows = doc.createElement("div");
  windows.dataset.slot = "measure-windows";
  if (view.hasBaseline) {
    windows.append(windowTable(doc, { slot: "measure-baseline", title: "Baseline",
      weeks: view.baseline, rows: view.rows }));
  }
  windows.append(windowTable(doc, { slot: "measure-trial", title: "Trial",
    weeks: view.trial, rows: view.rows }));
  root.append(windows);

  /* THE EXPORT CONTROL (ticket BUILD (4)). One button, one copyable block, and
     nothing else: no download, no clipboard reach, no network. The text is
     exportText(view) itself, so the block and the table cannot disagree. */
  const exportButton = doc.createElement("button");
  exportButton.type = "button";
  exportButton.dataset.slot = "measure-export";
  exportButton.textContent = exportOpen ? EXPORT_HIDE : EXPORT_LABEL;
  if (typeof onExport === "function") exportButton.addEventListener("click", () => onExport());
  root.append(exportButton);

  if (exportOpen) {
    const exportNote = doc.createElement("p");
    exportNote.dataset.slot = "measure-export-note";
    exportNote.textContent = EXPORT_NOTE;
    const block = doc.createElement("textarea");
    block.dataset.slot = "measure-export-text";
    block.readOnly = true;
    block.rows = 20;
    block.value = exportText(view);
    block.textContent = block.value;
    root.append(exportNote, block);
  }

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

  const rangeNote = doc.createElement("p");
  rangeNote.dataset.slot = "measure-waist-range";
  rangeNote.textContent = WAIST_RANGE_NOTE;

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

/* THE MARKERS PICK SCREEN (ticket BUILD (2), "chosen ONCE from a screen and
   stored write-once on device"; review R2 finding 7: storable but not
   pickable). `candidates` is { id, name } for the lifts THIS device's own
   enrolled week carries - this module invents no lift and offers none. */
export function mountMarkerPick(doc, container,
  { candidates = [], chosen = [], min = 3, max = 4, error = null, onPick = null } = {}) {
  if (!container) throw new Error("Measure: no host element");
  const root = doc.createElement("form");
  root.dataset.slot = "measure-marker-pick";

  const heading = doc.createElement("h2");
  heading.textContent = MARKERS_HEAD;
  const lead = doc.createElement("p");
  lead.textContent = MARKERS_LEAD;
  root.append(heading, lead);

  const picked = new Set(chosen);
  if (!candidates.length) {
    const none = doc.createElement("p");
    none.dataset.slot = "measure-marker-none";
    none.textContent = MARKERS_NONE;
    root.append(none);
  }
  for (const candidate of candidates) {
    const label = doc.createElement("label");
    const box = doc.createElement("input");
    box.type = "checkbox";
    box.dataset.slot = "measure-marker-option";
    box.value = candidate.name;
    box.checked = picked.has(candidate.name);
    box.addEventListener("change", () => {
      if (box.checked) picked.add(candidate.name); else picked.delete(candidate.name);
    });
    label.append(box, doc.createTextNode(candidate.name));
    root.append(label);
  }

  const errorEl = doc.createElement("p");
  errorEl.dataset.slot = "measure-marker-error";
  errorEl.textContent = error || "";
  errorEl.hidden = !error;

  const save = doc.createElement("button");
  save.type = "submit";
  save.dataset.slot = "measure-marker-save";
  save.textContent = MARKERS_SAVE;
  root.addEventListener("submit", (event) => {
    event.preventDefault();
    if (typeof onPick === "function") onPick([...picked]);
  });
  root.append(errorEl, save);
  root.dataset.min = String(min);
  root.dataset.max = String(max);

  container.replaceChildren(root);
  return root;
}

/* ---------------------------------------------------------------------------
   E2a (PM, the E2 scope): "ABOUT YOU" - the body-fat band, height and sex.
   Optional and asked gently: an unanswered question is asked on Measure and
   nowhere else; an answer is said back with a Change control, and saving again
   writes a new record, the latest winning (the PM's ruling on E2a, as steps).
   "I don't know" and "Not now" are answers, so neither question nags, and both
   stay changeable. The engine reads none of this yet (E2b). The band table is the producer's own (measure-commands.cjs
   BANDS), so a band offered here is always one the store accepts. No picture
   guide yet: each band has one plain line.
   --------------------------------------------------------------------------- */
export const ABOUT_HEAD = "About you";
export const ABOUT_LEAD = "Optional. Skip anything you like, and change it later.";
export const BAND_HEAD = "Body fat";
export const BAND_LEAD = "Pick the range that looks most like you, or say you don't know.";
export const BAND_MEN = "Bands for men";
export const BAND_WOMEN = "Bands for women";
export const BAND_UNKNOWN = "I don't know";
export const SAVE = "Save";
export const BAND_SAVE = "Save body fat";
export const BAND_SAID = "Body fat: ";
export const BAND_ESTIMATE_TAIL = " (your estimate)";
export const BAND_UNKNOWN_SAID = "Body fat: not known";
export const BAND_OPEN_TAIL = "% or more";
export const BAND_NONE_CHOSEN = "Choose a range, or I don't know.";
/* One plain line per band, in the table's own order (measure-commands.cjs BANDS). */
export const BAND_LINES = Object.freeze({
  male: Object.freeze([
    "Abs and the veins on your arms clearly show.",
    "The outline of your abs shows, with little fat at the waist.",
    "Abs do not show, and muscle shape is still clear.",
    "Soft at the waist and hips, with little muscle shape showing.",
    "Fat around the waist, hips and chest, and no muscle shape showing.",
  ]),
  female: Object.freeze([
    "Abs show, with little fat on the hips and thighs.",
    "Some outline of the abs, with slight curves at the hips and thighs.",
    "Soft at the stomach, with more fat on the hips and thighs.",
    "Soft at the stomach, hips and thighs, with little muscle shape showing.",
    "Fat around the stomach, hips, thighs and arms, and no muscle shape showing.",
  ]),
});
export const BODY_HEAD = "Height and sex";
export const SEX_LABEL = "Sex";
export const SEX_WORDS = Object.freeze({ male: "Male", female: "Female", "prefer-not-to-say": "Prefer not to say" });
export const HEIGHT_LABEL = "Height";
export const HEIGHT_FEET = "Feet";
export const HEIGHT_INCHES = "Inches";
export const HEIGHT_FT_UNIT = "ft";
export const HEIGHT_IN_UNIT = "in";
export const BODY_SAVE = "Save height and sex";
export const BODY_SKIP = "Not now";
export const BODY_NOT_GIVEN = "Height and sex: not given";
export const HEIGHT_SAID = "Height: ";
export const SEX_SAID = "Sex: ";
export const CHANGE = "Change";
export const CHANGE_BAND = "Change body fat";
export const CHANGE_BODY = "Change height and sex";
export const SAID_JOIN = "\u00b7";
export const SAVE_FAILED = "That was not saved on this device. Try again.";
export const HEIGHT_REFUSED = "Height in feet and inches, from 3 ft to 8 ft.";
export const BODY_NONE_CHOSEN = "Choose an answer, or Not now.";

/* "12-15%", or "26% or more" for the open top band. */
export function bandLabel(low, high) {
  return high === null || high === undefined ? low + BAND_OPEN_TAIL : low + "-" + high + "%";
}
/* What Measure says back for a recorded band. */
export function bandSaid(band) {
  if (!band) return null;
  if (band.source === "unknown") return BAND_UNKNOWN_SAID;
  return BAND_SAID + bandLabel(band.low, band.high) + BAND_ESTIMATE_TAIL;
}
/* "5 ft 10 in", or "178 cm" for a height recorded in centimetres. */
export function heightWords(height) {
  if (!height) return null;
  if (height.unit === "cm") return height.value + " cm";
  const feet = Math.floor(height.value / 12);
  const inches = Math.round((height.value - feet * 12) * 10) / 10;
  return feet + " ft " + inches + " in";
}
/* The lines Measure says back for a recorded body profile: one per answer given, or, for "Not now", that neither was
   given (so the answer can still be changed: "Not now" never blocks the question, it only stops it being asked). */
export function bodySaid(body) {
  if (!body) return [];
  const lines = [];
  if (body.height) lines.push(HEIGHT_SAID + heightWords(body.height));
  if (body.sex) lines.push(SEX_SAID + SEX_WORDS[body.sex]);
  return lines.length ? lines : [BODY_NOT_GIVEN];
}

/* One said-back line: the answer, the sheet's middle dot and a Change control (the "8,432 steps . Change" line of the
   Log today sheet, POLISH 8). */
function saidLine(doc, text, changeLabel, onChange) {
  const p = doc.createElement("p");
  p.className = "small muted";
  p.dataset.slot = "measure-about-line";
  const said = doc.createElement("span");
  said.dataset.slot = "measure-about-said";
  said.textContent = text;
  const sep = doc.createElement("span");
  sep.dataset.slot = "measure-about-sep";
  sep.setAttribute("aria-hidden", "true");
  sep.textContent = SAID_JOIN;
  const change = doc.createElement("button");
  change.type = "button";
  change.className = "text-link";
  change.dataset.slot = "measure-about-change";
  change.setAttribute("aria-label", changeLabel);
  change.textContent = CHANGE;
  change.addEventListener("click", () => { if (typeof onChange === "function") onChange(); });
  p.append(said, sep, change);
  return p;
}

function errorLine(doc, slot, text) {
  const p = doc.createElement("p");
  p.className = "error";
  p.setAttribute("role", "alert");
  p.dataset.slot = slot;
  p.textContent = text || "";
  p.hidden = !text;
  return p;
}

function savePill(doc, slot, label) {
  const save = doc.createElement("button");
  save.type = "submit";
  save.className = "save";
  save.dataset.slot = slot;
  save.setAttribute("aria-label", label);
  save.textContent = SAVE;
  return save;
}

/* `bands` is { male, female } from measure-commands.cjs BANDS; `sex` is the recorded one, if any. A recorded male or
   female sex is offered that sex's table; otherwise both tables, each under its own heading. Each band is a full-width
   row (the pack's card), its range and its one plain line; `chosen` is the band held now, checked when changing it. */
/* The table each set of bands is saved as (measure-commands.cjs BAND_TABLES; Fable on E2a, D1). A radio's value is
   the table, the low and the high, so the answer says which table it came from. */
const TABLE_OF = Object.freeze({ male: "men", female: "women" });
const bandValue = (table, low, high) => table + ":" + low + ":" + (high === null ? "" : high);
function bandChoices(doc, form, bands, sex, chosen) {
  const sets = sex === "male" || sex === "female" ? [sex] : ["male", "female"];
  const held = chosen ? (chosen.source === "unknown" ? "unknown" : bandValue(chosen.table, chosen.low, chosen.high)) : null;
  const option = (value, slot) => {
    const label = doc.createElement("label");
    label.className = "tcard";
    label.dataset.slot = slot;
    const radio = doc.createElement("input");
    radio.type = "radio";
    radio.name = "measure-band";
    radio.value = value;
    radio.checked = value === held;
    label.append(radio);
    return label;
  };
  for (const set of sets) {
    const group = doc.createElement("fieldset");
    group.dataset.slot = "measure-band-set";
    group.dataset.set = set;
    if (sets.length > 1) {
      const legend = doc.createElement("legend");
      legend.className = "section-label";
      legend.textContent = set === "male" ? BAND_MEN : BAND_WOMEN;
      group.append(legend);
    }
    bands[set].forEach(([low, high], index) => {
      const label = option(bandValue(TABLE_OF[set], low, high), "measure-band-option");
      const title = doc.createElement("strong");
      title.className = "title";
      title.textContent = bandLabel(low, high);
      const line = doc.createElement("span");
      line.className = "sub";
      line.dataset.slot = "measure-band-line";
      line.textContent = BAND_LINES[set][index];
      label.append(title, line);
      group.append(label);
    });
    form.append(group);
  }
  const unknown = option("unknown", "measure-band-unknown");
  const words = doc.createElement("strong");
  words.className = "title";
  words.textContent = BAND_UNKNOWN;
  unknown.append(words);
  form.append(unknown);
}

/* THE ABOUT YOU SECTION. `band` and `body` are what this device holds now (the latest answer, null when none);
   `editBand` and `editBody` are true while the athlete is changing one. An unanswered question is asked; an answered
   one is said back with its Change control, which opens the same question with the answer held filled in. `onBand(choice)`
   gets { low, high, source, table }, `onBody(entry)` gets { sex, feet, inches } or { skip: true }, and `onChangeBand` /
   `onChangeBody` open a question again; all are the screen's own paths. Errors are said in plain words. */
export function mountAboutYou(doc, container, { band = null, body = null, bands, editBand = false, editBody = false,
  bandError = null, bodyError = null, onBand = null, onBody = null, onChangeBand = null, onChangeBody = null } = {}) {
  if (!container) throw new Error("Measure: no host element");
  const root = doc.createElement("section");
  root.dataset.slot = "measure-about";
  const heading = doc.createElement("h2");
  heading.textContent = ABOUT_HEAD;
  root.append(heading);
  const lead = doc.createElement("p");
  lead.className = "small muted";
  lead.dataset.slot = "measure-about-lead";
  lead.textContent = ABOUT_LEAD;
  root.append(lead);

  /* HEIGHT AND SEX first: the band table offered depends on the sex recorded. */
  const bodyBlock = doc.createElement("section");
  bodyBlock.className = "field";
  bodyBlock.dataset.slot = "measure-about-body";
  if (body && !editBody) {
    for (const text of bodySaid(body)) bodyBlock.append(saidLine(doc, text, CHANGE_BODY, onChangeBody));
  } else {
    const form = doc.createElement("form");
    form.dataset.slot = "measure-body-entry";
    form.noValidate = true;
    const head = doc.createElement("h3");
    head.className = "section-label";
    head.textContent = BODY_HEAD;
    const sexes = doc.createElement("fieldset");
    sexes.dataset.slot = "measure-sex-set";
    const legend = doc.createElement("legend");
    legend.textContent = SEX_LABEL;
    sexes.append(legend);
    for (const sex of Object.keys(SEX_WORDS)) {
      const label = doc.createElement("label");
      label.className = "choice";
      label.dataset.slot = "measure-sex-choice";
      const radio = doc.createElement("input");
      radio.type = "radio";
      radio.name = "measure-sex";
      radio.value = sex;
      radio.dataset.slot = "measure-sex-option";
      radio.checked = !!(body && body.sex === sex);
      label.append(radio, doc.createTextNode(SEX_WORDS[sex]));
      sexes.append(label);
    }
    const height = doc.createElement("fieldset");
    height.dataset.slot = "measure-height-set";
    const heightLegend = doc.createElement("legend");
    heightLegend.textContent = HEIGHT_LABEL;
    const row = doc.createElement("div");
    row.className = "weigh-row";
    row.dataset.slot = "measure-height-row";
    const box = (slot, mode, label, unit, value) => {
      const field = doc.createElement("div");
      field.className = "field";
      const input = doc.createElement("input");
      input.type = "text";
      input.inputMode = mode;
      input.autocomplete = "off";
      input.dataset.slot = slot;
      input.setAttribute("aria-label", label);
      input.value = value;
      field.append(input);
      const unitEl = doc.createElement("span");
      unitEl.className = "unit";
      unitEl.setAttribute("aria-hidden", "true");
      unitEl.textContent = unit;
      row.append(field, unitEl);
      return input;
    };
    const held = body && body.height && body.height.unit === "in" ? body.height.value : null;
    const heldFeet = held === null ? "" : String(Math.floor(held / 12));
    const heldInches = held === null ? "" : String(Math.round((held - Math.floor(held / 12) * 12) * 10) / 10);
    const feet = box("measure-height-feet", "numeric", HEIGHT_FEET, HEIGHT_FT_UNIT, heldFeet);
    const inches = box("measure-height-inches", "decimal", HEIGHT_INCHES, HEIGHT_IN_UNIT, heldInches);
    height.append(heightLegend, row);
    const actions = doc.createElement("div");
    actions.dataset.slot = "measure-body-actions";
    actions.append(savePill(doc, "measure-body-save", BODY_SAVE));
    /* "Not now" while the question has never been answered; changing an answer is done with Save. */
    if (!body) {
      const skip = doc.createElement("button");
      skip.type = "button";
      skip.className = "text-link";
      skip.dataset.slot = "measure-body-skip";
      skip.textContent = BODY_SKIP;
      skip.addEventListener("click", () => { if (typeof onBody === "function") onBody({ skip: true }); });
      actions.append(skip);
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const chosen = form.querySelector('input[name="measure-sex"]:checked');
      if (typeof onBody === "function") onBody({ sex: chosen ? chosen.value : null, feet: feet.value, inches: inches.value });
    });
    form.append(head, sexes, height, errorLine(doc, "measure-body-error", bodyError), actions);
    bodyBlock.append(form);
  }
  root.append(bodyBlock);

  const bandBlock = doc.createElement("section");
  bandBlock.className = "field";
  bandBlock.dataset.slot = "measure-about-band";
  if (band && !editBand) {
    bandBlock.append(saidLine(doc, bandSaid(band), CHANGE_BAND, onChangeBand));
  } else {
    const form = doc.createElement("form");
    form.dataset.slot = "measure-band-pick";
    form.noValidate = true;
    const head = doc.createElement("h3");
    head.className = "section-label";
    head.textContent = BAND_HEAD;
    const bandLead = doc.createElement("p");
    bandLead.className = "small muted";
    bandLead.textContent = BAND_LEAD;
    form.append(head, bandLead);
    bandChoices(doc, form, bands, body && body.sex, band);
    const actions = doc.createElement("div");
    actions.dataset.slot = "measure-band-actions";
    actions.append(savePill(doc, "measure-band-save", BAND_SAVE));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const chosen = form.querySelector('input[name="measure-band"]:checked');
      let choice = null;
      if (chosen && chosen.value === "unknown") choice = { low: null, high: null, source: "unknown", table: null };
      else if (chosen) {
        const [table, low, high] = chosen.value.split(":");
        choice = { low: Number(low), high: high === "" ? null : Number(high), source: "self-estimate", table };
      }
      if (typeof onBand === "function") onBand(choice);
    });
    form.append(errorLine(doc, "measure-band-error", bandError), actions);
    bandBlock.append(form);
  }
  root.append(bandBlock);

  container.replaceChildren(root);
  return root;
}

export default { NO_BASELINE_YET, RUN_IN_NOTE, MEASURES, buildComparisonView, exportText,
  mountMeasureComparison, mountWaistEntry, mountMarkerPick,
  mountAboutYou, bandLabel, bandSaid, heightWords, bodySaid,
  ABOUT_HEAD, ABOUT_LEAD, BAND_HEAD, BAND_LEAD, BAND_MEN, BAND_WOMEN, BAND_UNKNOWN, BAND_SAVE,
  BAND_SAID, BAND_ESTIMATE_TAIL, BAND_UNKNOWN_SAID, BAND_OPEN_TAIL, BAND_NONE_CHOSEN, BAND_LINES,
  BODY_HEAD, SEX_LABEL, SEX_WORDS, HEIGHT_LABEL, HEIGHT_FEET, HEIGHT_INCHES, BODY_SAVE, BODY_SKIP,
  HEIGHT_SAID, SEX_SAID, SAVE_FAILED, HEIGHT_REFUSED, BODY_NONE_CHOSEN,
  SAVE, HEIGHT_FT_UNIT, HEIGHT_IN_UNIT, BODY_NOT_GIVEN, CHANGE, CHANGE_BAND, CHANGE_BODY, SAID_JOIN,
  ONE_RM_NOTE, EXPORT_LABEL, EXPORT_HIDE, EXPORT_NOTE, WAIST_RANGE_NOTE,
  MARKERS_HEAD, MARKERS_LEAD, MARKERS_SAVE, MARKERS_NONE };
