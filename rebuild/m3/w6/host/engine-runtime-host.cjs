'use strict';
// HOST-OWNED prescription runtime: the same composition as
// rebuild/m4/workout/engine-runtime.cjs, expressed so that the browser build
// can bundle it.
//
// WHY THIS FILE EXISTS AT ALL. engine-runtime.cjs composes its twelve engine
// factories through ONE non-literal require:
//
//     const factories = MODULES.map(name => require('../../engine/' + name + '.cjs'));
//
// That is correct, byte-pinned product code in Node. It is not bundleable.
// esbuild cannot resolve a require whose argument is an expression, so it
// treats the path as a glob and pulls in EVERY file under rebuild/engine —
// including seed.cjs, migrate.cjs, merge.cjs and index.cjs (which carry, or
// reach, one athlete's personal history and must never enter the phone
// bundle) and all twenty Node-only rebuild/engine/test/* harnesses.
//
// Measured, not assumed, with the real build (rebuild/m3/w6/build-browser.mjs,
// esbuild, platform browser, format esm) — reproduce with
// `node rebuild/m3/w6/host/esbuild-probe.mjs`:
//
//     rebuild/m4/workout/engine-runtime.cjs   62 esbuild errors across 21 files,
//                                             20 of them rebuild/engine/test/*
//     this file                               builds; only the twelve named
//                                             modules and their own imports
//                                             enter the graph
//
// engine-runtime.cjs's bytes are pinned by the accepted M2-NATIVE-CARRIERS
// artifact (rebuild/m4/spec/acceptance-native-carriers.json), so the fix
// cannot live there without re-sealing that package. It lives here instead,
// owned by the host.
//
// THIS FILE DELIBERATELY IMPORTS NOTHING FROM engine-runtime.cjs. Taking
// MODULES from it at runtime would pull its glob require back into the bundle
// graph and undo the whole point. The lists below are therefore restated, and
// rebuild/m3/w6/host/test/engine-equivalence.test.cjs proves the restatement
// is exact: same MODULES list and order, same EXPOSED names, same absent
// providers, and identical genSession / rirPlan output on the journey fixture.
// Drift between the two files fails that test.
//
// This file is a BINDING, not a reimplementation. It adds no rule, no default,
// no athlete data and no provider; every line below the require list is a
// structural mirror of the accepted runtime.
const MODULES = Object.freeze(['dates', 'constants', 'plan', 'performed', 'progression', 'sleep', 'energy', 'policy', 'today', 'volume', 'earn', 'writers']);
// WIDENED WITH THE ACCEPTED RUNTIME BY M2-B-NTC (DECISIONS:109, PATH A). This
// list is a MIRROR and never leads: engine-runtime.cjs:30 is where the surface
// is decided, and engine-equivalence.test.cjs:26 fails on any drift between the
// two. The two added names are the engine's own day predicates, `dayWeather`
// (sleep.cjs:1872) and `cleanAtDate` (sleep.cjs:1017), which the B-NTC
// nativeTrendContext provider asks instead of restating.
const EXPOSED = Object.freeze(['genSession', 'rirPlan', 'dayWeather', 'cleanAtDate']);
// Literal requires: the same twelve modules MODULES names, in that order.
const FACTORIES = Object.freeze({
 dates: require('../../../engine/dates.cjs'),
 constants: require('../../../engine/constants.cjs'),
 plan: require('../../../engine/plan.cjs'),
 performed: require('../../../engine/performed.cjs'),
 progression: require('../../../engine/progression.cjs'),
 sleep: require('../../../engine/sleep.cjs'),
 energy: require('../../../engine/energy.cjs'),
 policy: require('../../../engine/policy.cjs'),
 today: require('../../../engine/today.cjs'),
 volume: require('../../../engine/volume.cjs'),
 earn: require('../../../engine/earn.cjs'),
 writers: require('../../../engine/writers.cjs'),
});
// The literal require list and the module list must agree, in order, or this
// file would compose a different engine than the one it claims to mirror.
if (Object.keys(FACTORIES).length !== MODULES.length ||
    Object.keys(FACTORIES).some((name, index) => name !== MODULES[index]))
 throw new TypeError('Host runtime require list diverged from MODULES');
const factories = MODULES.map(name => {
 const create = FACTORIES[name];
 if (typeof create !== 'function') throw new TypeError('Accepted engine module missing: ' + name);
 return create;
});

// Source-owned exact lookup (the same read the seeded engine performs); it
// embeds no athlete data. It is a reached dependency of today.pickStructural.
const exById = (s, id) => s.exercises.find(e => e.id === id);

// Seed-owned history providers are NOT supplied. The two exposed readers'
// closed graph reaches neither HISTORY nor ROLLUPS; any reach surfaces as this
// explicit failure, never an empty history.
function absentProvider(name) {
 const fail = () => { const e = new Error('ENGINE_RUNTIME_' + name + '_PROVIDER_REQUIRED'); e.code = e.message; throw e; };
 const trap = {};
 for (const k of ['filter', 'map', 'forEach', 'slice', 'find', 'some', 'every', 'reduce', 'flatMap', 'concat', 'entries', 'values', 'keys', 'at', 'includes']) trap[k] = fail;
 Object.defineProperty(trap, Symbol.iterator, { value: fail });
 Object.defineProperty(trap, 'length', { get: fail });
 return Object.freeze(trap);
}

function createEngineRuntime({ clock, ids, drafts, nativeTrendContext } = {}) {
 if (!clock || typeof clock.today !== 'function') throw new TypeError('createEngineRuntime requires an injected clock.today()');
 if (nativeTrendContext !== undefined && typeof nativeTrendContext !== 'function') throw new TypeError('nativeTrendContext must be a synchronous function when supplied');
 // IDs are never minted by the two readers; a request to mint is a contained failure.
 const mint = () => { const e = new Error('ENGINE_RUNTIME_IDS_UNAVAILABLE'); e.code = e.message; throw e; };
 const deps = { clock, ids: ids === undefined ? Object.freeze({ next: mint, fresh: mint }) : ids,
  drafts: drafts === undefined ? Object.freeze({ length: 0, key: () => null }) : drafts };
 const E = { HISTORY: absentProvider('HISTORY'), ROLLUPS: absentProvider('ROLLUPS'), exById };
 for (const [i, create] of factories.entries()) {
  const created = MODULES[i] === 'performed' ? create(E, { nativeTrendContext }) : create(E, deps);
  Object.assign(E, created);
 }
 for (const name of EXPOSED) if (typeof E[name] !== 'function') throw new TypeError('Accepted engine did not compose ' + name);
 // The same four thin forwarders the accepted runtime returns, in the same
 // order and with the same arities; E itself never leaves this function.
 return Object.freeze({ genSession: (s, iso, slp) => E.genSession(s, iso, slp), rirPlan: (s, ex, slp) => E.rirPlan(s, ex, slp),
  dayWeather: (s, iso) => E.dayWeather(s, iso), cleanAtDate: (s, iso) => E.cleanAtDate(s, iso) });
}

const COMPOSITION = Object.freeze({ profile: 'earned/engine-runtime-host/v1',
 mirrorOf: 'rebuild/m4/workout/engine-runtime.cjs',
 why: 'literal requires so the browser build cannot glob-expand rebuild/engine',
 modules: MODULES, exposed: EXPOSED,
 seeded: Object.freeze({ exById: 'source-owned exact lookup, no athlete data' }),
 forbiddenImports: Object.freeze(['seed.cjs', 'migrate.cjs', 'merge.cjs', 'index.cjs']) });

module.exports = { createEngineRuntime, COMPOSITION, MODULES, EXPOSED, absentProvider };
