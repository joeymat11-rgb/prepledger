'use strict';

// F2: constructor-independent projection of one accepted setup snapshot.
// C injects its canonical taxonomy once; this module imports no catalogue,
// constructor, engine, history provider or operation store. It authenticates no
// operation: C must select the accepted setup before supplying this boundary.
const PROFILE = 'earned/setup-volume-tags/v1';
const SETUP = ['athlete_label', 'split', 'exercises', 'priority_muscles'];
const EXERCISE = ['id', 'n', 'mg', 'day', 'sets', 'hi', 'inc', 'steps'];
const ARRAY_HISTORY = ['reads', 'queue', 'feed', 'weekly', 'events', 'proposals',
  'agentProposals', 'adjustments', 'forecasts', 'accepted'];
const MAP_HISTORY = ['dailyLogs', 'sessionLog', 'retirements'];
const own = (o, k) => Object.hasOwn(o, k);
const fail = () => { const e = new Error('SETUP_TAGS_INVALID'); e.code = e.message; throw e; };
const text = x => typeof x === 'string' && x.trim().length > 0;
const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x)
  && [Object.prototype, null].includes(Object.getPrototypeOf(x));
const closed = (x, keys) => plain(x) && Object.keys(x).length === keys.length && keys.every(k => own(x, k));
const day = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)
  && Number.isFinite(Date.parse(x + 'T00:00:00.000Z'))
  && new Date(x + 'T00:00:00.000Z').toISOString().slice(0, 10) === x;

// Check descriptors before reading values. JSON stringify/structuredClone can
// invoke getters; neither is the validation boundary. Reject holes, symbols,
// non-data members, custom prototypes, cycles and non-JSON scalar values.
function cloneData(value, active = new Set()) {
  if (value === null || ['string', 'boolean'].includes(typeof value)) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'object' || active.has(value)) fail();
  const array = Array.isArray(value);
  if (array ? Object.getPrototypeOf(value) !== Array.prototype : !plain(value)) fail();
  active.add(value);
  const out = array ? [] : Object.create(Object.getPrototypeOf(value));
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const keys = Reflect.ownKeys(descriptors);
  if (array && keys.length !== value.length + 1) fail();
  for (const key of keys) {
    if (array && key === 'length') continue;
    if (typeof key !== 'string') fail();
    const descriptor = descriptors[key];
    if (!own(descriptor, 'value') || !descriptor.enumerable) fail();
    if (array && (!/^(0|[1-9]\d*)$/.test(key) || Number(key) >= value.length)) fail();
    Object.defineProperty(out, key, { value: cloneData(descriptor.value, active),
      enumerable: true, writable: true, configurable: true });
  }
  active.delete(value);
  return out;
}
function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
function equal(a, b) {
  if (Object.is(a, b)) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object'
      || Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(k => own(b, k) && equal(a[k], b[k]));
}

function createSetupTagProjector(options) {
  const config = cloneData(options);
  if (!closed(config, ['taxonomy']) || !closed(config.taxonomy, ['muscles', 'regions'])) fail();
  const { muscles, regions } = config.taxonomy;
  if (!Array.isArray(muscles) || !muscles.length || !muscles.every(text)
      || new Set(muscles).size !== muscles.length || !plain(regions)) fail();
  if (!Object.entries(regions).every(([region, muscle]) => text(region) && muscles.includes(muscle))) fail();
  const regionsByMuscle = Object.fromEntries(muscles.map(muscle => [muscle,
    Object.keys(regions).filter(region => regions[region] === muscle && region !== muscle)])
    .filter(([, list]) => list.length));
  freeze(regionsByMuscle);
  const known = new Set([...muscles, ...Object.keys(regions)]);

  function check(setup, tags) {
    if (tags === null || tags === undefined) return null;
    const source = cloneData(setup), snapshot = cloneData(tags);
    if (!closed(source, SETUP) || !text(source.athlete_label) || !Array.isArray(source.exercises)
        || !source.exercises.length || !Array.isArray(source.priority_muscles)
        || !source.priority_muscles.every(text) || !plain(snapshot)) fail();
    if (!closed(source.split, ['from', 'map']) || !day(source.split.from)
        || !closed(source.split.map, ['0', '1', '2', '3', '4', '5', '6'])
        || !Object.values(source.split.map).every(k => ['U', 'L', 'F', 'REST'].includes(k))) fail();
    const ids = new Set();
    for (const e of source.exercises) {
      if (!closed(e, EXERCISE) || !text(e.id) || ids.has(e.id) || !text(e.n)
          || !muscles.includes(e.mg) || !['U', 'L'].includes(e.day)
          || !Number.isSafeInteger(e.sets) || e.sets <= 0 || !Number.isSafeInteger(e.hi) || e.hi <= 0
          || typeof e.inc !== 'number' || e.inc <= 0 || !Array.isArray(e.steps) || !e.steps.length
          || !e.steps.every((v, i) => typeof v === 'number' && v > 0 && (!i || v > e.steps[i - 1]))) fail();
      ids.add(e.id);
      if (!own(snapshot, e.id)) fail();
      const tag = snapshot[e.id];
      if (!closed(tag, ['head', 'secondary']) || !Array.isArray(tag.secondary)
          || !(tag.head === null || (typeof tag.head === 'string' && own(regions, tag.head) && regions[tag.head] === e.mg))) fail();
      const targets = new Set(), bucket = tag.head || e.mg;
      for (const helper of tag.secondary) {
        if (!closed(helper, ['mg', 'lend']) || !known.has(helper.mg)
            || typeof helper.lend !== 'number' || helper.lend <= 0 || helper.lend > 1
            || targets.has(helper.mg) || helper.mg === bucket
            || helper.mg === e.mg || (tag.head === null && regions[helper.mg] === e.mg)) fail();
        targets.add(helper.mg);
      }
    }
    if (Object.keys(snapshot).length !== ids.size) fail();
    return { source, snapshot, ids };
  }

  function validateSetupTags(setup, tags) { check(setup, tags); return true; }

  function projectSetupTags(state, context) {
    // Absence preserves identity and does not attempt to reinterpret legacy data.
    if (!plain(context)) fail();
    const descriptor = Object.getOwnPropertyDescriptor(context, 'tags');
    if (descriptor && (!own(descriptor, 'value') || !descriptor.enumerable)) fail();
    if (!descriptor || descriptor.value === null || descriptor.value === undefined) return state;
    const ctx = cloneData(context);
    if (!closed(ctx, ['setup', 'tags', 'op_id', 'date']) || !text(ctx.op_id) || !day(ctx.date)) fail();
    const { source, snapshot, ids } = check(ctx.setup, ctx.tags);
    const out = cloneData(state);
    if (!plain(out) || out.athlete_label !== source.athlete_label || !Array.isArray(out.exercises)
        || out.exercises.length !== ids.size) fail();
    const seen = new Set(); let tagged = 0;
    const marker = { profile: PROFILE, op_id: ctx.op_id, date: ctx.date, regionsByMuscle };
    for (const e of out.exercises) {
      if (!plain(e) || !ids.has(e.id) || seen.has(e.id)) fail();
      seen.add(e.id);
      const authored = source.exercises.find(x => x.id === e.id);
      if (e.mg !== authored.mg || e.day !== authored.day) fail();
      if (own(e, 'volumeTags')) {
        if (!equal(e.volumeTags, marker) || !own(e, 'head') || !own(e, 'secondary')
            || e.head !== snapshot[e.id].head || !equal(e.secondary, snapshot[e.id].secondary)) fail();
        tagged++;
      } else {
        if (own(e, 'head') || own(e, 'secondary') || EXERCISE.some(k => !equal(e[k], authored[k]))
            || e.w !== null || !Array.isArray(e.forks) || e.forks.length) fail();
      }
    }
    if (tagged && tagged !== ids.size) fail();
    for (const key of ARRAY_HISTORY) if (!Array.isArray(out[key]) || (!tagged && out[key].length)) fail();
    for (const key of MAP_HISTORY) if (!plain(out[key]) || (!tagged && Object.keys(out[key]).length)) fail();
    if (!plain(out.sleep) || !Array.isArray(out.sleep.nights) || (!tagged && out.sleep.nights.length)) fail();
    if (!tagged && (!equal(out.split, [source.split]) || !equal(out.priority_muscles, source.priority_muscles)
        || !equal(out.exOrder, Object.fromEntries(['U', 'L'].map(k => [k,
          source.exercises.filter(e => e.day === k).map(e => e.id)]))))) fail();
    // Re-project only the same immutable snapshot. Its already-tagged descendants
    // may carry later observations/edits; imported or pre-setup rows may not.
    const afterSetup = d => { if (!day(d) || d < ctx.date) fail(); };
    out.reads.forEach(row => { if (!plain(row)) fail(); afterSetup(row.d); });
    out.sleep.nights.forEach(row => { if (!plain(row)) fail(); afterSetup(row.d); });
    Object.keys(out.dailyLogs).forEach(afterSetup);
    for (const [date, record] of Object.entries(out.sessionLog)) {
      afterSetup(date);
      if (!plain(record) || !Array.isArray(record.entries) || record.entries.some(e => !plain(e) || !ids.has(e.id))) fail();
    }
    if (own(out, 'workoutFacts') && out.workoutFacts !== null) {
      const facts = out.workoutFacts;
      if (!plain(facts) || facts.profile !== 'earned/workout-facts/v1'
          || !Array.isArray(facts.sessions) || (!tagged && facts.sessions.length)) fail();
      for (const session of facts.sessions) {
        if (!plain(session) || !plain(session.effective)) fail();
        afterSetup(session.effective.local_date);
      }
    }
    for (const e of out.exercises) {
      e.head = snapshot[e.id].head;
      e.secondary = snapshot[e.id].secondary;
      e.volumeTags = cloneData(marker);
    }
    return freeze(out);
  }
  return Object.freeze({ validateSetupTags, projectSetupTags });
}

module.exports = { createSetupTagProjector, PROFILE };
