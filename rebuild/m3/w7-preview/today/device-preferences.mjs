// N3-A: device-only Boolean preference. No athlete identity, operations or imports.
// No page imports this module until N3-B supplies the reviewed view and sealed wiring.
export const DATABASE = 'earned-device-preferences';
export const STORE = 'preferences';
export const TRACK_MACROS = 'trackMacros';

const failure = (code, cause) => Object.assign(new Error(code, { cause }), { code });

export async function openDevicePreferences({ indexedDB = globalThis.indexedDB } = {}) {
  const db = await new Promise((resolve, reject) => {
    let request, failed = false;
    const refuse = cause => { failed = true; reject(failure('DEVICE_PREFERENCES_OPEN_FAILED', cause)); };
    try {
      request = indexedDB.open(DATABASE, 1);
      request.onupgradeneeded = () => {
        try { request.result.createObjectStore(STORE); }
        catch (error) { request.transaction.abort(); refuse(error); }
      };
      request.onerror = () => refuse(request.error);
      request.onblocked = () => refuse(new Error('DEVICE_PREFERENCES_BLOCKED'));
      request.onsuccess = () => {
        if (failed) request.result.close();
        else resolve(request.result);
      };
    } catch (error) { refuse(error); }
  });
  let closed = false;
  const close = () => { closed = true; db.close(); };
  db.onversionchange = close;

  function access(write, value) {
    const code = write ? 'DEVICE_PREFERENCES_WRITE_FAILED' : 'DEVICE_PREFERENCES_READ_FAILED';
    return new Promise((resolve, reject) => {
      let tx, result, problem;
      const refuse = cause => reject(failure(code, cause));
      try {
        if (closed) throw new Error('DEVICE_PREFERENCES_CLOSED');
        if (write && typeof value !== 'boolean') throw new TypeError('DEVICE_PREFERENCES_BOOLEAN_REQUIRED');
        tx = db.transaction(STORE, write ? 'readwrite' : 'readonly');
        tx.onabort = () => refuse(problem || tx.error);
        tx.onerror = () => { problem = tx.error; };
        tx.oncomplete = () => {
          if (problem) return refuse(problem);
          if (!write && result !== undefined && typeof result !== 'boolean') {
            return refuse(new TypeError('DEVICE_PREFERENCES_BOOLEAN_REQUIRED'));
          }
          resolve(write ? value : result === true);
        };
        const store = tx.objectStore(STORE);
        const request = write ? store.put(value, TRACK_MACROS) : store.get(TRACK_MACROS);
        request.onsuccess = () => { result = request.result; };
        request.onerror = () => { problem = request.error; };
      } catch (error) {
        problem = error;
        if (tx) { try { tx.abort(); } catch (_) { /* Already inactive; still report failure. */ } }
        refuse(error);
      }
    });
  }

  return Object.freeze({
    readTrackMacros: () => access(false),
    writeTrackMacros: value => access(true, value),
    close,
  });
}
