"use strict";

const modules = [
  require("./dates.cjs"),
  require("./constants.cjs"),
  require("./seed.cjs"),
  require("./plan.cjs"),
  require("./progression.cjs"),
  require("./sleep.cjs"),
  require("./energy.cjs"),
  require("./policy.cjs"),
  require("./today.cjs"),
  require("./volume.cjs"),
];

function createEngine({ clock, ids } = {}) {
  if (!clock || typeof clock.today !== "function") {
    throw new TypeError("createEngine requires an injected clock.today()");
  }
  // One table per engine keeps cyclic calls and mutable seed objects local.
  const E = {};
  const deps = { clock, ids };
  for (const createModule of modules) Object.assign(E, createModule(E, deps));
  return { ...E, __test: { ...E } };
}

module.exports = { createEngine };
