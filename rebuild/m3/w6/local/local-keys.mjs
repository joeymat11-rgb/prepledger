// local-keys.mjs — DEVICE-LOCAL KEY CUSTODY for the sealed generations (LOCAL ERA).
//
// repository.mjs format 1 stays byte-untouched: the key never enters the
// generations database. It is a NON-EXTRACTABLE AES-GCM-256 CryptoKey object
// held in a SEPARATE IndexedDB database `<databaseName>-keys` (store `keys`,
// record `active`). Nothing here exports, prints or logs key material, and no
// path re-keys or reseeds: a missing key beside an existing generation is
// state 18 (RESTORE_REQUIRED), full stop.
//
// RESIDUAL, stated plainly: this is LOCAL-ERA custody, not P1 production key
// custody/recovery — P1 stays BLOCKED for the hosted half. A browser that
// evicts or wipes site data destroys this key and with it every sealed
// generation; the recovery path is then the PC port (C2), with the frozen app
// as the standing fallback. Nothing in this module can recover an evicted key.
import { StorageFailure } from "../repository.mjs";

const STORE = "keys";
const ACTIVE = "active";
/* C4b. THE DEVICE IDENTITY, kept beside the key it belongs to.
   `localEraConfig` refuses an era whose sealed lease names another device
   (LOCAL_ERA_SCOPE_MISMATCH), so the id a page opens with has to be the SAME id
   on every launch — it cannot be minted per page load and it cannot be a
   constant shared by every installation. It is therefore minted once, at random,
   and persisted HERE: erasing it is already an erasure of key custody, which is
   already restore-required, so there is no new way for an installation to lose
   half of itself. It is an identifier, never a credential: it authorizes
   nothing, and the keys in this store stay non-extractable and unexported. */
const DEVICE = "device";
const DEVICE_PREFIX = "device-";
const VERSION = 1;
export const keysDatabaseName = databaseName => `${databaseName}-keys`;

// Presence probe that must not CREATE what it asks about. `databases()` answers
// without opening anything; where it is unavailable the fallback opens and
// aborts the versionchange transaction, so a database that did not exist still
// does not exist afterwards. A database present but missing the expected store
// reads as absent — also the safe answer for a half-made one.
export async function probeRecord({ indexedDB, name, store, key }) {
  if (typeof indexedDB.databases === "function") {
    let listed;
    try { listed = (await indexedDB.databases()).some(entry => entry?.name === name); }
    catch { listed = null; }
    if (listed === false) return false;
  }
  const db = await new Promise((resolve, reject) => {
    let created = false;
    const request = indexedDB.open(name, VERSION);
    request.onupgradeneeded = event => { created = true; try { event.target.transaction.abort(); } catch {} };
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
    request.onerror = () => created ? resolve(null) : reject(new StorageFailure("LOCAL_PROBE_FAILED", 18));
    request.onblocked = () => reject(new StorageFailure("LOCAL_PROBE_BLOCKED", 18));
  });
  if (db === null) return false;
  try {
    if (!db.objectStoreNames.contains(store)) return false;
    return await new Promise((resolve, reject) => {
      let tx, value;
      try { tx = db.transaction(store, "readonly"); const request = tx.objectStore(store).get(key); request.onsuccess = () => { value = request.result; }; }
      catch { reject(new StorageFailure("LOCAL_PROBE_FAILED", 18)); return; }
      tx.oncomplete = () => resolve(value !== undefined);
      tx.onabort = () => reject(new StorageFailure("LOCAL_PROBE_FAILED", 18));
      tx.onerror = () => {};
    });
  } finally { try { db.close(); } catch {} }
}

export function keysPresent({ indexedDB, databaseName }) {
  return probeRecord({ indexedDB, name: keysDatabaseName(databaseName), store: STORE, key: ACTIVE });
}

const usable = value => !!value && value.algorithm?.name === "AES-GCM" &&
  value.algorithm?.length === 256 && value.extractable === false;

export async function openLocalKeys({ indexedDB = globalThis.indexedDB, crypto = globalThis.crypto, databaseName } = {}) {
  if (!indexedDB || !crypto?.subtle || !databaseName) throw new StorageFailure("KEY_CONFIGURATION_REQUIRED", 18);
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(keysDatabaseName(databaseName), VERSION);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
    request.onerror = () => reject(new StorageFailure("KEY_DATABASE_OPEN_FAILED", 18));
    request.onblocked = () => reject(new StorageFailure("KEY_DATABASE_UPGRADE_BLOCKED", 18));
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
  });
  // The CryptoKey handle, never bytes. Held so that the generation sealed during
  // enrollment and the key record are written from ONE key, and so a persist
  // failure after initialize leaves state 18 rather than a second key.
  let held = null;
  function stored() {
    return new Promise((resolve, reject) => {
      let tx, value;
      try { tx = db.transaction(STORE, "readonly"); const request = tx.objectStore(STORE).get(ACTIVE); request.onsuccess = () => { value = request.result; }; }
      catch { reject(new StorageFailure("KEY_READ_FAILED", 18)); return; }
      tx.oncomplete = () => resolve(value);
      tx.onabort = () => reject(new StorageFailure("KEY_READ_FAILED", 18));
      tx.onerror = () => {};
    });
  }
  return {
    // Generated non-extractable and NOT written: enroll() persists it only after
    // repository.initialize() has sealed revision 1, so a failed first
    // enrollment leaves no key beside no generation (still first-run).
    async generate() {
      const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
      if (!usable(key)) throw new StorageFailure("KEY_GENERATION_UNUSABLE", 18);
      held = key; return key;
    },
    persist(key) {
      return new Promise((resolve, reject) => {
        let tx;
        try { tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).put(key, ACTIVE); }
        catch { reject(new StorageFailure("KEY_WRITE_FAILED", 18)); return; }
        tx.oncomplete = () => resolve(true);
        tx.onabort = () => reject(new StorageFailure("KEY_WRITE_FAILED", 18));
        tx.onerror = () => {};
      });
    },
    async present() { return usable(await stored()); },
    // openRepository's shape. It masks every throw as DECRYPTION_UNAVAILABLE/18;
    // the distinct codes are what the factory's own probe reports in status().
    keyProvider: async () => {
      if (held) return held;
      const value = await stored();
      if (value === undefined) throw new StorageFailure("KEY_MISSING", 18);
      if (!usable(value)) throw new StorageFailure("KEY_UNUSABLE", 18);
      held = value; return value;
    },
    close() { held = null; try { db.close(); } catch {} },
  };
}

/* THE DEVICE IDENTITY (C4b). Read it, or mint it once and persist it, in the
   key database this installation already owns. Returns the SAME id on every
   later call for the same database, which is what `localEraConfig` requires.
   `minted` says which happened, so a caller can report a genuinely new install
   without guessing. Nothing here reads, writes or touches the key record. */
export async function openLocalDeviceIdentity({ indexedDB = globalThis.indexedDB,
  crypto = globalThis.crypto, databaseName } = {}) {
  if (!indexedDB || typeof crypto?.getRandomValues !== "function" || !databaseName)
    throw new StorageFailure("KEY_CONFIGURATION_REQUIRED", 18);
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(keysDatabaseName(databaseName), VERSION);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
    request.onerror = () => reject(new StorageFailure("KEY_DATABASE_OPEN_FAILED", 18));
    request.onblocked = () => reject(new StorageFailure("KEY_DATABASE_UPGRADE_BLOCKED", 18));
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
  });
  try {
    const existing = await new Promise((resolve, reject) => {
      let tx, value;
      try { tx = db.transaction(STORE, "readonly"); const request = tx.objectStore(STORE).get(DEVICE); request.onsuccess = () => { value = request.result; }; }
      catch { reject(new StorageFailure("KEY_READ_FAILED", 18)); return; }
      tx.oncomplete = () => resolve(value);
      tx.onabort = () => reject(new StorageFailure("KEY_READ_FAILED", 18));
      tx.onerror = () => {};
    });
    if (typeof existing?.deviceId === "string" && existing.deviceId.startsWith(DEVICE_PREFIX))
      return { deviceId: existing.deviceId, minted: false };
    if (existing !== undefined) throw new StorageFailure("LOCAL_DEVICE_IDENTITY_UNUSABLE", 18);
    const deviceId = DEVICE_PREFIX + Array.from(crypto.getRandomValues(new Uint8Array(16)),
      byte => byte.toString(16).padStart(2, "0")).join("");
    await new Promise((resolve, reject) => {
      let tx;
      try { tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).put({ deviceId }, DEVICE); }
      catch { reject(new StorageFailure("KEY_WRITE_FAILED", 18)); return; }
      tx.oncomplete = () => resolve(true);
      tx.onabort = () => reject(new StorageFailure("KEY_WRITE_FAILED", 18));
      tx.onerror = () => {};
    });
    return { deviceId, minted: true };
  } finally { try { db.close(); } catch {} }
}
