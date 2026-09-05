export const BUILD = 'clock-spike-v1';
export const DB_NAME = 'earned-clock-diagnostic-v1';
const STORE = 'diagnostic';
const KEY = 'run';
const markerKey = name => name + ':enrollment';

export function canonical(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
  throw new Error('Unsupported diagnostic value');
}
async function hash(value, crypto) {
  const bytes = new TextEncoder().encode(canonical(value));
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
}
function bodyOf(run) { const { digest, ...body } = run; return body; }
function validObservation(o) {
  return o && typeof o.documentId === 'string' && o.documentId.length > 0 && typeof o.label === 'string'
    && Number.isFinite(o.wallMs) && Number.isFinite(o.timeOriginMs) && Number.isFinite(o.performanceNowMs)
    && o.performanceNowMs >= 0 && o.projectedMs === o.timeOriginMs + o.performanceNowMs
    && typeof o.wallUTC === 'string' && new Date(o.wallMs).toISOString() === o.wallUTC
    && typeof o.zone === 'string' && Number.isFinite(o.offsetMinutes) && typeof o.userAgent === 'string'
    && typeof o.standalone === 'boolean' && typeof o.visibility === 'string';
}
export async function validateRun(run, crypto = globalThis.crypto) {
  if (!run || run.build !== BUILD || typeof run.runId !== 'string' || !run.runId
      || !Number.isSafeInteger(run.counter) || run.counter < 1 || !Array.isArray(run.observations)
      || run.counter !== run.observations.length || !run.target || typeof run.origin !== 'string') throw new Error('History missing or changed');
  let wall = -Infinity, projected = -Infinity;
  for (let i = 0; i < run.observations.length; i++) {
    const row = run.observations[i];
    if (!validObservation(row) || row.counter !== i + 1) throw new Error('History sequence invalid');
    wall = Math.max(wall, row.wallMs); projected = Math.max(projected, row.projectedMs);
  }
  if (wall !== run.wallHighWaterMs || projected !== run.projectedHighWaterMs
      || run.digest !== await hash(bodyOf(run), crypto)) throw new Error('History integrity mismatch');
  return run;
}
function openDatabase(factory, name, create = false) {
  return new Promise((resolve, reject) => {
    let failed = false;
    const request = factory.open(name, 1);
    const fail = () => { failed = true; clearTimeout(timer); reject(new Error('Diagnostic database unavailable')); };
    const timer = setTimeout(fail, 10000);
    request.onupgradeneeded = event => {
      if (!create || event.oldVersion > 0) { request.transaction.abort(); return; }
      request.result.createObjectStore(STORE);
    };
    request.onerror = fail;
    request.onblocked = fail;
    request.onsuccess = () => {
      clearTimeout(timer);
      const db = request.result;
      if (failed || db.objectStoreNames.length !== 1 || !db.objectStoreNames.contains(STORE)) { db.close(); fail(); return; }
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}
function transaction(db, mode, action) {
  return new Promise((resolve, reject) => {
    let tx;
    try { tx = db.transaction(STORE, mode, mode === 'readwrite' ? { durability: 'strict' } : undefined); }
    catch (error) { reject(error); return; }
    let result, failure;
    const timer = setTimeout(() => { try { tx.abort(); } catch (_) {} }, 10000);
    const abort = error => { failure = error; try { tx.abort(); } catch (_) {} };
    tx.oncomplete = () => { clearTimeout(timer); resolve(result); };
    tx.onabort = () => { clearTimeout(timer); reject(failure || tx.error || new Error('Diagnostic transaction aborted')); };
    tx.onerror = () => {}; // The transaction abort is the failure boundary.
    try { action(tx.objectStore(STORE), value => { result = value; }, abort); } catch (error) { abort(error); }
  });
}
function readSnapshot(db) {
  return transaction(db, 'readonly', (store, done, abort) => {
    const keys = store.getAllKeys(), values = store.getAll();
    let k, v;
    function finish() {
      if (!k || !v) return;
      if (k.length !== 1 || k[0] !== KEY || v.length !== 1) { abort(new Error('History missing or changed')); return; }
      done(v[0]);
    }
    keys.onsuccess = () => { k = keys.result; finish(); };
    values.onsuccess = () => { v = values.result; finish(); };
  });
}
async function checked(db, markers, name, crypto) {
  const run = await validateRun(await readSnapshot(db), crypto);
  if (markers.getItem(markerKey(name)) !== run.runId) throw new Error('Enrollment marker missing or changed');
  return run;
}
export async function readRun({ factory = globalThis.indexedDB, markers = globalThis.localStorage, crypto = globalThis.crypto, name = DB_NAME } = {}) {
  const db = await openDatabase(factory, name);
  try { return await checked(db, markers, name, crypto); } finally { db.close(); }
}
async function commit(db, expected, next) {
  return transaction(db, 'readwrite', (store, done, abort) => {
    const keys = store.getAllKeys(), values = store.getAll();
    let k, v;
    function write() {
      if (!k || !v) return;
      try {
        const matches = expected === null ? k.length === 0 && v.length === 0
          : k.length === 1 && k[0] === KEY && v.length === 1 && canonical(v[0]) === canonical(expected);
        if (!matches) { abort(new Error('History changed during capture; nothing overwritten')); return; }
        store.put(next, KEY); done(next);
      } catch (error) { abort(error); }
    }
    keys.onsuccess = () => { k = keys.result; write(); };
    values.onsuccess = () => { v = values.result; write(); };
  });
}
async function makeNext(previous, observation, crypto) {
  if (!validObservation(observation)) throw new Error('Clock observation unavailable');
  if (previous.counter >= Number.MAX_SAFE_INTEGER) throw new Error('Diagnostic counter exhausted');
  const next = { ...bodyOf(previous), counter: previous.counter + 1,
    wallHighWaterMs: Math.max(previous.wallHighWaterMs, observation.wallMs),
    projectedHighWaterMs: Math.max(previous.projectedHighWaterMs, observation.projectedMs),
    observations: [...previous.observations, { ...observation, counter: previous.counter + 1 }] };
  return { ...next, digest: await hash(next, crypto) };
}
export async function initializeRun({ observation, target, origin, factory = globalThis.indexedDB,
  markers = globalThis.localStorage, locks = globalThis.navigator?.locks, crypto = globalThis.crypto, name = DB_NAME } = {}) {
  if (!locks?.request) throw new Error('Exclusive setup lock unavailable');
  return locks.request(name + ':initialize', { mode: 'exclusive' }, async () => {
    if (markers.getItem(markerKey(name)) !== null) throw new Error('An enrollment or failed attempt already exists');
    if (!target || !target.model || !target.os || typeof origin !== 'string') throw new Error('Witnessed target missing');
    markers.setItem(markerKey(name), 'attempted');
    if (markers.getItem(markerKey(name)) !== 'attempted') throw new Error('Setup marker not retained');
    const db = await openDatabase(factory, name, true);
    try {
      const next = await makeNext({ build: BUILD, runId: crypto.randomUUID(), target, origin, counter: 0,
        wallHighWaterMs: -Infinity, projectedHighWaterMs: -Infinity, observations: [] }, observation, crypto);
      await commit(db, null, next);
      await validateRun(await readSnapshot(db), crypto);
      markers.setItem(markerKey(name), next.runId);
      return await checked(db, markers, name, crypto);
    } finally { db.close(); }
  });
}
export async function appendObservation({ observation, factory = globalThis.indexedDB,
  markers = globalThis.localStorage, crypto = globalThis.crypto, name = DB_NAME } = {}) {
  const db = await openDatabase(factory, name);
  try {
    const previous = await checked(db, markers, name, crypto);
    const next = await makeNext(previous, observation, crypto);
    await commit(db, previous, next);
    const readback = await checked(db, markers, name, crypto);
    if (readback.runId !== next.runId || canonical(readback.observations.slice(0, next.counter)) !== canonical(next.observations)) throw new Error('Committed observation could not be read back');
    return readback;
  } finally { db.close(); }
}
