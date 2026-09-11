"use strict";

/* today-engine.cjs — the ONE engine composition this screen uses.

   It is NOT a second composition. It takes the w7-preview browser composition
   (rebuild/m3/w7-preview/browser-engine.cjs — the accepted engine's unmodified read
   factories, pinned by that preview's own tests) and registers ONE further accepted
   module on the same table: rebuild/engine/writers.cjs, registered LAST, exactly the
   position it holds in rebuild/engine/index.cjs and in the A0 host's
   rebuild/m3/w6/host/engine-runtime-host.cjs.

   Why writers is needed here and not in the read-only preview: this screen replays the
   athlete's DURABLE reading operations through the engine's own applyRead, instead of
   recomputing a trend in adapter code. The trend, the read note and every downstream
   number are then the accepted writer's, not the adapter's.

   seed.cjs / migrate.cjs / merge.cjs / index.cjs stay out, for the same reason
   browser-engine.cjs states: seed.cjs embeds one athlete's personal history and must
   never enter a browser bundle. IDs are never minted by this screen; a request to mint
   one is a contained failure, never a fabricated id. */

const { createBrowserEngine } = require("../browser-engine.cjs");
const createWriters = require("../../../engine/writers.cjs");

function createRefusingIds() {
  const refuse = () => { const e = new Error("TODAY_SCREEN_IDS_UNAVAILABLE"); e.code = e.message; throw e; };
  return Object.freeze({ next: refuse, fresh: refuse });
}

function createTodayEngine({ clock } = {}) {
  if (!clock || typeof clock.today !== "function") throw new TypeError("An injected clock is required");
  const ids = createRefusingIds();
  const E = createBrowserEngine({ clock });
  Object.assign(E, createWriters(E, { clock, ids }));
  if (typeof E.applyRead !== "function") throw new TypeError("Accepted engine did not compose applyRead");
  return E;
}

module.exports = { createTodayEngine, createRefusingIds };
