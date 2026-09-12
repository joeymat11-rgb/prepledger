'use strict';
// PUBLIC SYNTHETIC F2 inputs. Every identity, date, exercise and number here is
// invented for proof; no seed, migration, recorded athlete or private fixture.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const Module = require('node:module');

const ROOT = path.resolve(__dirname, '../../../..');
const BASE = '2d50e88';
const DAY = '2026-09-14'; // Monday; the explicit synthetic calendar owns this day.
const MODULES = Object.freeze(['dates', 'constants', 'plan', 'performed', 'progression',
  'sleep', 'energy', 'policy', 'today', 'volume', 'earn', 'writers']);
const ATHLETE = 'rebuild/m4/workout/athlete-state.cjs';
const HOST = 'rebuild/m3/w6/host/engine-runtime-host.cjs';
const ALLOWED = new Set([...MODULES.map(n => 'rebuild/engine/' + n + '.cjs'),
  'rebuild/engine/entered-load.cjs', ATHLETE, HOST]);

// Load only these source blobs. The baseline is compiled in memory from Git,
// so concurrent builders cannot contaminate RED-first evidence. The custom
// require refuses any dependency outside the explicit public runtime closure.
function loadProduct(ref = process.env.F2_SOURCE_REF || null) {
  if (ref !== null && ref !== BASE) throw new Error('F2_BASE_REF_NOT_ALLOWLISTED');
  const cache = new Map();
  function load(rel) {
    if (!ALLOWED.has(rel)) throw new Error('F2_SOURCE_NOT_ALLOWLISTED');
    if (cache.has(rel)) return cache.get(rel).exports;
    const filename = path.join(ROOT, rel);
    let source = ref === null ? fs.readFileSync(filename, 'utf8') :
      execFileSync('git', ['show', ref + ':' + rel], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    if (ref === null && process.env.F2_MUTANT)
      source = require('./mutants.cjs').mutate(process.env.F2_MUTANT, rel, source);
    const mod = new Module(filename);
    mod.filename = filename;
    cache.set(rel, mod);
    mod.require = request => {
      const target = path.relative(ROOT, path.resolve(path.dirname(filename), request)).replaceAll('\\', '/');
      return load(target);
    };
    mod._compile(source, filename);
    return mod.exports;
  }
  const clockFor = day => ({ today: () => day, nowISO: () => day + 'T12:00:00.000Z',
    nowMs: () => Date.parse(day + 'T12:00:00.000Z'), hour: () => 12,
    dow: () => new Date(day + 'T00:00:00Z').getUTCDay() });
  const fail = () => { throw new Error('F2_UNAVAILABLE_PROVIDER_REACHED'); };
  const absent = () => new Proxy({}, { get: fail });
  function engine(day = DAY) {
    const E = { HISTORY: absent(), ROLLUPS: absent(),
      exById: (s, id) => s.exercises.find(e => e.id === id) };
    const deps = { clock: clockFor(day), ids: { next: fail, fresh: fail }, drafts: { length: 0, key: () => null } };
    for (const name of MODULES) Object.assign(E, load('rebuild/engine/' + name + '.cjs')(E,
      name === 'performed' ? { nativeTrendContext: fail } : deps));
    return E;
  }
  return { ref, engine, createCleanInitState: load(ATHLETE).createCleanInitState,
    host: day => load(HOST).createEngineRuntime({ clock: clockFor(day), nativeTrendContext: fail }) };
}

const map = training => Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i, training[i] || 'REST']));
const exercise = (id, day, sets, mg) => ({ id, n: 'Synthetic ' + id, day, sets, mg,
  hi: 10, inc: 5, steps: [15, 20, 25, 30, 35] });
function setup(training = { 1: 'U', 4: 'L' }, exercises) {
  return { athlete_label: 'synthetic-f2-public-proof',
    split: { from: '2026-09-07', map: map(training) },
    exercises: exercises || [exercise('f2-upper', 'U', 3, 'chest'), exercise('f2-lower', 'L', 2, 'quads')],
    priority_muscles: ['chest', 'quads'] };
}
function state(product, training = { 1: 'F', 4: 'F' }, exercises) {
  // Constructor coverage has its own cell. A U/L constructor plus an explicit
  // split fixture isolates later product readers on baseline F state; this is
  // test construction, never an alternate product setup/write route.
  const s = structuredClone(product.createCleanInitState({ setup: setup({ 1: 'U', 4: 'L' }, exercises) }));
  s.split = [setup(training).split];
  return s;
}
function orderedState(product) {
  const s = state(product, { 1: 'F', 3: 'U', 4: 'F', 6: 'L' }, [
    exercise('f2-u-a', 'U', 3, 'chest'), exercise('f2-l-a', 'L', 2, 'quads'),
    exercise('f2-u-b', 'U', 2, 'back'), exercise('f2-l-b', 'L', 4, 'hams'),
    exercise('f2-u-tail', 'U', 1, 'delts'),
  ]);
  s.exOrder = { U: ['f2-u-b', 'f2-u-a'], L: ['f2-l-b', 'f2-l-a'] };
  return s;
}

module.exports = { BASE, ROOT, DAY, MODULES, loadProduct, map, exercise, setup, state, orderedState };
