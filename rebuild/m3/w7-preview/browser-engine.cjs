"use strict";

// Preview-only composition of the accepted engine's unmodified read factories.
// Deliberately exclude seed/migrate/merge/writers: seed.cjs embeds personal history.
// The synthetic fixture supplies every athlete fact; no seed fallback is a fact.
const modules = [
  require("../../engine/dates.cjs"),
  require("../../engine/constants.cjs"),
  require("../../engine/plan.cjs"),
  require("../../engine/progression.cjs"),
  require("../../engine/sleep.cjs"),
  require("../../engine/energy.cjs"),
  require("../../engine/policy.cjs"),
  require("../../engine/today.cjs"),
  require("../../engine/volume.cjs"),
];

function createBrowserEngine({ clock } = {}) {
  if (!clock || typeof clock.today !== "function") throw new TypeError("An injected clock is required");
  const E = { HISTORY: [], ROLLUPS: [], SEED: {},
    // Same read function as seed.cjs; no seed data is loaded.
    exById: (s, id) => s.exercises.find((e) => e.id === id) };
  const deps = { clock, ids: { next: () => { throw new Error("Preview readers cannot mint IDs"); } } };
  for (const create of modules) Object.assign(E, create(E, deps));
  return E;
}

module.exports = { createBrowserEngine };
