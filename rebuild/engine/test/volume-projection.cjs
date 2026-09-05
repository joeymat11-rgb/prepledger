"use strict";
// Full reader outputs, not rounded DTOs. Calls get independent JSON snapshots:
// neither a memo nor an accidental preceding mutation can create parity.
const NAMES = ["muscleVolume", "programmeVolume", "volumeImbalance", "structuralMovesThisWeek",
  "coarseLifts", "setOneRead", "volumeConversion", "_setsMovesSince", "mgLabel", "volBucket", "_blockSlope", "hypGain"];
function projection(T, dumped) {
  if (!NAMES.every(n => typeof T[n] === "function")) throw Error("volume surface missing");
  const state = JSON.parse(dumped), rows = {};
  const read = (name, ...args) => {
    try { return { value: T[name](...args) }; }
    catch (e) { return { THREW: { name: e.name, message: e.message } }; }
  };
  for (const n of ["muscleVolume", "programmeVolume", "volumeImbalance", "structuralMovesThisWeek", "coarseLifts"]) {
    rows[n] = read(n, JSON.parse(dumped));
  }
  rows.exercises = (state.exercises || []).map(ex => {
    const points = Object.keys(state.sessionLog || {}).sort().flatMap(d => {
      const en = (state.sessionLog[d].entries || []).find(e => e && e.id === ex.id);
      return en ? [{ d, k: (en.reps || []).length, en }] : [];
    });
    // Stable set-count blocks exercise the helper's actual volumeConversion use.
    const blocks = [];
    for (const p of points) {
      if (!blocks.length || blocks[blocks.length - 1][0].k !== p.k) blocks.push([]);
      blocks[blocks.length - 1].push(p);
    }
    return { id: ex.id, label: read("mgLabel", ex.head || ex.mg), bucket: read("volBucket", ex),
      setOneRead: read("setOneRead", JSON.parse(dumped), ex.id),
      volumeConversion: read("volumeConversion", JSON.parse(dumped), ex.id),
      blocks: blocks.map(b => read("_blockSlope", b)) };
  });
  // Manifest fixes today to 2026-09-03 (Thursday), hence Monday 2026-08-31.
  rows.moves = ["0000-01-01", "2026-08-31"].map(d => ({ since: d, result: read("_setsMovesSince", JSON.parse(dumped), d) }));
  rows.gains = (rows.programmeVolume.value || []).map(m => ({ mg: m.mg,
    result: read("hypGain", m.sets, m.sets + 2) }));
  rows.emptyHelpers = { bucket: read("volBucket", null), slope: read("_blockSlope", []), label: read("mgLabel", "synthetic-unmapped") };
  return rows;
}
module.exports = { projection, NAMES };
