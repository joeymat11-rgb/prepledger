import { BUILD, DB_NAME, runStore } from './store.mjs';

const $ = id => document.getElementById(id);
const standalone = () => navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
let receipt;

function fail(message = 'The original test store or its receipt could not be verified. No successful seed is confirmed. Verification never creates or repairs records. Contact the integrator; do not restart this run.') {
  $('status-panel').classList.add('error');
  $('status').textContent = 'STORE MISSING/CHANGED';
  $('explanation').textContent = message;
  $('result').hidden = true;
}

async function storageStatus() {
  const status = { persist: 'unsupported', persisted: 'unsupported', estimate: 'unsupported' };
  const storage = navigator.storage;
  if (!storage) return status;
  try { if (storage.persist) status.persist = await storage.persist(); } catch (_) { status.persist = 'request failed'; }
  try { if (storage.persisted) status.persisted = await storage.persisted(); } catch (_) { status.persisted = 'query failed'; }
  try {
    if (storage.estimate) {
      const estimate = await storage.estimate();
      status.estimate = { usage: estimate.usage ?? null, quota: estimate.quota ?? null };
    }
  } catch (_) { status.estimate = 'query failed'; }
  return status;
}

async function offlineShell({ allowInstall = false } = {}) {
  if (!isSecureContext || !('serviceWorker' in navigator)) throw new Error('Install requires HTTPS and service workers');
  // Do not re-register/update on every opening. A browser may independently check
  // the same pinned script for an update; the application cannot disable that.
  let registration = await navigator.serviceWorker.getRegistration('./');
  if (!registration?.active) {
    if (!allowInstall) throw new Error('Original offline shell missing');
    await navigator.serviceWorker.register('./service-worker.js', { scope: './' });
    let timeout;
    try {
      registration = await Promise.race([navigator.serviceWorker.ready,
        new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Offline install timed out')), 20000); })]);
    } finally { clearTimeout(timeout); }
  }
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => { channel.port1.close(); reject(new Error('Offline cache not confirmed')); }, 15000);
    channel.port1.onmessage = event => {
      clearTimeout(timeout); channel.port1.close();
      event.data?.ready && event.data.build === BUILD ? resolve(true) : reject(new Error('Offline cache incomplete'));
    };
    registration.active.postMessage('CACHE_STATUS', [channel.port2]);
  });
}

function paint(result, cacheReady, seeded = false) {
  if (!result.ok) { fail(); return; }
  const { seed, hash, rows } = result;
  $('status-panel').classList.remove('error');
  $('status').textContent = seeded ? 'Saved · seed verified' : 'Store intact · same seed';
  $('explanation').textContent = 'Three synthetic operations are locally acknowledged. Two entries remain unsynced. No authority or sync service is connected.';
  $('hash').textContent = hash.slice(0, 16);
  $('hash').title = hash;
  $('seed-time').textContent = seed.seededAt;
  $('device').textContent = seed.device + ' / ' + seed.os;
  $('observed').textContent = seed.userAgent + ' · platform: ' + seed.platform;
  $('persist').textContent = 'persist(): ' + String(seed.persistence.persist) + '; persisted(): ' + String(seed.persistence.persisted) + '. A result is not a survival guarantee.';
  $('estimate').textContent = typeof seed.persistence.estimate === 'object'
    ? 'Usage ' + seed.persistence.estimate.usage + ' bytes / quota ' + seed.persistence.estimate.quota + ' bytes (estimate, not free device space).'
    : String(seed.persistence.estimate);
  $('offline').textContent = cacheReady ? 'All pinned assets cached; physical offline launch still needs the separate preflight.' : 'Not confirmed';
  $('do-not-open').textContent = 'DO NOT OPEN AGAIN UNTIL ' + seed.verifyAfter + ' (or the later booked idle readback)';
  receipt = { format: 'earned-soak-receipt-v1', algorithm: 'SHA-256', hash, seed, rows,
    observedOpenUTC: new Date().toISOString(), observedUserAgent: navigator.userAgent,
    observedStandalone: standalone(), cacheReady, verdict: 'INTEGRITY MATCH; SOAK-30 PENDING' };
  $('receipt').value = JSON.stringify(receipt, null, 2);
  $('result').hidden = false;
}

$('download').addEventListener('click', () => {
  if (!receipt) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(receipt, null, 2) + '\n'], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'earned-soak-receipt.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// Separate from ordinary startup: an explicit witnessed first enrollment is
// necessary because empty origin storage cannot establish first use.
export async function beginWitnessedSeed() {
  $('setup').hidden = true;
  try {
    if (!standalone()) throw new Error('Open the installed icon first');
    const cacheReady = await offlineShell({ allowInstall: true });
    const persistence = await storageStatus();
    const metadata = { seededAt: new Date().toISOString(), device: 'iPhone 17 Pro', os: 'iOS 26.6.1',
      userAgent: navigator.userAgent, platform: navigator.platform, standalone: true, origin: location.origin, persistence };
    const result = await runStore({ factory: indexedDB, markers: localStorage, locks: navigator.locks, metadata });
    paint(result, cacheReady, true);
  } catch (_) { fail('Setup could not complete. No successful seed is claimed. Keep this run for the integrator to inspect.'); }
}

$('confirm-new').addEventListener('change', event => { $('begin').disabled = !event.target.checked; });
$('begin').addEventListener('click', () => {
  if (!$('confirm-new').checked) return;
  $('begin').disabled = true;
  beginWitnessedSeed();
});

async function main() {
  $('status-panel').classList.remove('error');
  $('status').textContent = 'Checking before showing a result…';
  $('explanation').textContent = 'No seed is rewritten during verification.';
  if (!standalone()) {
    $('installation').hidden = false;
    $('status').textContent = 'Install before starting';
    $('explanation').textContent = 'This browser tab does not seed the experiment.';
    try { await offlineShell({ allowInstall: true }); } catch (_) { $('explanation').textContent = 'Offline installation is not ready. Use the integrator’s HTTPS link.'; }
    return;
  }
  try {
    const result = await runStore({ factory: indexedDB, markers: localStorage });
    if (!result.ok) {
      fail();
      // This panel grants no automatic retry. Even total loss remains red until
      // a person deliberately declares a different, never-seeded experiment.
      $('setup').hidden = localStorage.getItem(DB_NAME + ':receipt') !== null;
      return;
    }
    const cacheReady = await offlineShell();
    paint(result, cacheReady);
  } catch (_) { fail('The store or offline shell could not be verified. Do not restart this experiment.'); }
}
main();
