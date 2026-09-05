// Minimal asynchronous equivalent of T2's atomic ops/outbox/checkpoint boundary.
// Deliberately NOT passed to T2 Store: that synchronous caller would acknowledge early.
export const BUILD = 'soak-stub-v1';
export const DB_NAME = 'earned-soak-stub-v1';
export const COLLECTIONS = ['meta', 'ops', 'outbox'];
const DAY = 86400000;

export function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
  const text = JSON.stringify(value);
  if (text === undefined) throw new TypeError('Absent value');
  return text;
}

function ordered(rows) {
  return [...rows].sort((a, b) => {
    const x = a.collection + '/' + a.key, y = b.collection + '/' + b.key;
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

export async function digestRows(rows, crypto = globalThis.crypto) {
  // Hash logical stored bytes (UTF-8 strings + collection/key framing), not IDB's
  // inaccessible physical file layout. Checkpoint is excluded to avoid self-hashing.
  const bytes = new TextEncoder().encode(canonical(ordered(rows)));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
}

export function makeSeed(metadata) {
  const instant = Date.parse(metadata.seededAt);
  if (!Number.isFinite(instant) || new Date(instant).toISOString() !== metadata.seededAt) throw new TypeError('Invalid UTC seed time');
  const seed = { ...metadata, build: BUILD, version: 1,
    verifyAfter: new Date(instant + 30 * DAY).toISOString() };
  const rows = [{ collection: 'meta', key: 'seed', value: canonical(seed) }];
  for (let n = 1; n <= 3; n++) {
    const op_id = 'synthetic-operation-' + n;
    rows.push({ collection: 'ops', key: op_id, value: canonical({ op_id,
      device_id: 'synthetic-device', device_seq: n, created_at: seed.seededAt,
      payload: { kind: 'soak_probe', ordinal: n, note: 'Invented storage-test data only' } }) });
    // All three operations are acknowledged LOCALLY after commit. Two are queued;
    // the third is a stored control. No authority acceptance is fabricated.
    if (n <= 2) rows.push({ collection: 'outbox', key: op_id,
      value: canonical({ op_id, attempts: 0, status: 'unsynced' }) });
  }
  return ordered(rows);
}

export function openStore(factory, name = DB_NAME, { create = false } = {}) {
  return new Promise((resolve, reject) => {
    const request = factory.open(name, 1);
    let absent = false, blocked = false;
    request.onupgradeneeded = event => {
      if (!create || event.oldVersion !== 0) {
        absent = true;
        request.transaction.abort(); // Do not materialize an empty replacement DB.
        return;
      }
      for (const collection of COLLECTIONS) request.result.createObjectStore(collection);
    };
    request.onerror = () => reject(new Error(absent ? 'STORE MISSING/CHANGED' : 'Storage unavailable'));
    request.onblocked = () => { blocked = true; reject(new Error('Storage blocked by another open copy')); };
    request.onsuccess = () => {
      const db = request.result;
      if (blocked || canonical([...db.objectStoreNames]) !== canonical(COLLECTIONS)) {
        db.close(); reject(new Error('STORE MISSING/CHANGED')); return;
      }
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

export function readRows(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COLLECTIONS, 'readonly');
    const rows = [];
    tx.oncomplete = () => resolve(ordered(rows));
    tx.onabort = () => reject(new Error('Storage read failed'));
    tx.onerror = () => {}; // Request error aborts the whole transaction.
    for (const collection of COLLECTIONS) {
      const request = tx.objectStore(collection).openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        rows.push({ collection, key: cursor.key, value: cursor.value });
        cursor.continue();
      };
    }
  });
}

export async function inspectStore(db, crypto = globalThis.crypto) {
  try {
    const all = await readRows(db);
    const checkpointRows = all.filter(r => r.collection === 'meta' && r.key === 'checkpoint');
    if (checkpointRows.length !== 1) throw new Error('Checkpoint absent');
    const rows = all.filter(r => !(r.collection === 'meta' && r.key === 'checkpoint'));
    if (rows.some(r => typeof r.key !== 'string' || typeof r.value !== 'string')) throw new Error('Stored byte format changed');
    const hash = await digestRows(rows, crypto);
    if (checkpointRows[0].value !== canonical({ version: 1, algorithm: 'SHA-256', hash })) throw new Error('Checksum changed');
    const seed = JSON.parse(rows.find(r => r.collection === 'meta' && r.key === 'seed')?.value);
    if (seed.version !== 1 || seed.build !== BUILD || canonical(rows) !== canonical(makeSeed(seed))) throw new Error('Seed shape changed');
    return { ok: true, hash, seed, rows };
  } catch (_) {
    return { ok: false, state: 18, reason: 'STORE MISSING/CHANGED' };
  }
}

export async function seedStore(db, rows, crypto = globalThis.crypto) {
  const hash = await digestRows(rows, crypto); // No await/crypto inside active IDB tx.
  const checkpoint = canonical({ version: 1, algorithm: 'SHA-256', hash });
  await new Promise((resolve, reject) => {
    let tx;
    try { tx = db.transaction(COLLECTIONS, 'readwrite', { durability: 'strict' }); }
    catch (_) { reject(new Error('Strict storage transaction unavailable')); return; }
    let remaining = COLLECTIONS.length, occupied = false;
    tx.oncomplete = resolve; // The ONLY successful acknowledgement boundary.
    tx.onabort = () => reject(new Error(occupied ? 'Seed already exists; refusing replacement' : 'Seed transaction aborted'));
    tx.onerror = () => {};
    for (const collection of COLLECTIONS) {
      const request = tx.objectStore(collection).count();
      request.onsuccess = () => {
        occupied ||= request.result !== 0;
        if (--remaining) return;
        if (occupied) { tx.abort(); return; }
        try {
          for (const row of rows) tx.objectStore(row.collection).add(row.value, row.key);
          tx.objectStore('meta').add(checkpoint, 'checkpoint');
        } catch (_) { tx.abort(); }
      };
    }
  });
  const receipt = await inspectStore(db, crypto);
  if (!receipt.ok || receipt.hash !== hash) throw new Error('Seed readback failed');
  return receipt;
}

// First-use permission is EXPLICIT and belongs to the witnessed setup ceremony.
// Loss of every origin-local marker is indistinguishable from a virgin origin;
// the default path ALWAYS verifies, and therefore never silently seeds on loss.
export async function runStore(options) {
  if (options.metadata) {
    if (!options.locks?.request) return { ok: false, state: 18, reason: 'STORE MISSING/CHANGED' };
    // Serialize the origin-local marker AND IDB commit, not just the IDB writes.
    // A second initializer must never overwrite the winner's receipt anchor.
    try {
      return await options.locks.request((options.name || DB_NAME) + ':enrollment',
        { mode: 'exclusive' }, () => runUnlocked(options));
    } catch (_) { return { ok: false, state: 18, reason: 'STORE MISSING/CHANGED' }; }
  }
  return runUnlocked(options);
}

async function runUnlocked({ factory, markers, metadata = null, name = DB_NAME, crypto = globalThis.crypto }) {
  const markerKey = name + ':receipt';
  let db;
  try {
    const marker = markers.getItem(markerKey);
    if (metadata) {
      if (marker !== null) throw new Error('Seed attempt already recorded');
      markers.setItem(markerKey, 'seed-attempted'); // Fail closed even on a killed/aborted first write.
      if (markers.getItem(markerKey) !== 'seed-attempted') throw new Error('Seed marker not retained');
      db = await openStore(factory, name, { create: true });
      const receipt = await seedStore(db, makeSeed(metadata), crypto);
      const anchor = canonical({ hash: receipt.hash, seededAt: receipt.seed.seededAt });
      markers.setItem(markerKey, anchor);
      if (markers.getItem(markerKey) !== anchor) throw new Error('Receipt not retained');
      return receipt;
    }
    // Read IDB even if the marker is absent, but never write or infer first use.
    db = await openStore(factory, name);
    const receipt = await inspectStore(db, crypto);
    if (!receipt.ok || marker !== canonical({ hash: receipt.hash, seededAt: receipt.seed.seededAt })) throw new Error('Receipt missing or changed');
    return receipt;
  } catch (_) {
    return { ok: false, state: 18, reason: 'STORE MISSING/CHANGED' };
  } finally { db?.close(); }
}
