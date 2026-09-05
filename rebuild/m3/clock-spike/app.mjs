import { BUILD, DB_NAME, readRun, initializeRun, appendObservation } from './store.mjs';
const $ = id => document.getElementById(id);
const standalone = () => navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
let documentId, receipt, busy = false;
function failure(message) {
  receipt = null;
  $('receipt').value = '';
  $('status').textContent = 'STATE 18 · History unavailable';
  $('explanation').textContent = message;
  $('result').hidden = true;
}
export function observe(label) {
  const wallMs = Date.now(), timeOriginMs = performance.timeOrigin, performanceNowMs = performance.now();
  return { documentId, label, wallMs, wallUTC: new Date(wallMs).toISOString(), timeOriginMs, performanceNowMs,
    projectedMs: timeOriginMs + performanceNowMs, zone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    offsetMinutes: new Date(wallMs).getTimezoneOffset(), userAgent: navigator.userAgent,
    standalone: standalone(), visibility: document.visibilityState };
}
async function cacheReady(allowInstall = false) {
  if (!isSecureContext || !navigator.serviceWorker) throw new Error('HTTPS and service workers are required');
  let timer, channel;
  try {
    return await Promise.race([(async () => {
      let registration = await navigator.serviceWorker.getRegistration('./');
      if (!registration?.active) {
        if (!allowInstall) throw new Error('Original cached shell unavailable');
        await navigator.serviceWorker.register('./service-worker.js', { scope: './' });
        registration = await navigator.serviceWorker.ready;
      }
      return new Promise((resolve, reject) => {
        channel = new MessageChannel();
        channel.port1.onmessage = event => {
          channel.port1.close();
          event.data?.ready && event.data.build === BUILD ? resolve(true) : reject(new Error('Diagnostic cache incomplete'));
        };
        registration.active.postMessage('CLOCK_CACHE_STATUS', [channel.port2]);
      });
    })(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Offline preparation timed out')), 20000); })]);
  } finally { clearTimeout(timer); channel?.port1.close(); }
}
function paint(run) {
  const last = run.observations.at(-1), previous = run.observations.at(-2);
  const same = !!previous && previous.documentId === last.documentId;
  $('status').textContent = 'Diagnostic observation stored · STATE 20';
  $('explanation').textContent = 'Local history verified after transaction completion. Clock continuity and lease permission remain unproved.';
  $('counter').textContent = String(run.counter);
  $('run-id').textContent = run.runId;
  $('wall').textContent = last.wallUTC + ' · Date.now(): ' + last.wallMs;
  $('origin').textContent = String(last.timeOriginMs);
  $('performance').textContent = String(last.performanceNowMs);
  $('same-document').textContent = previous ? (same ? 'Yes · this does not establish lease permission' : 'No · cross-document continuity not established') : 'No previous observation';
  $('elapsed').textContent = same && last.performanceNowMs >= previous.performanceNowMs ? String(last.performanceNowMs - previous.performanceNowMs) : 'Not established';
  $('wall-high').textContent = String(run.wallHighWaterMs);
  $('projected-high').textContent = String(run.projectedHighWaterMs);
  $('zone').textContent = last.zone + ' · getTimezoneOffset(): ' + last.offsetMinutes + ' minutes';
  $('digest').textContent = run.digest;
  receipt = { format: 'earned-clock-receipt-v1', build: BUILD, run, diagnosticState: 20,
    freshServerProof: false, leasePermission: false, integrity: 'verified locally',
    limitation: 'A consistent persisted history may be an old restored copy. No time-continuity or lease proof is supplied.' };
  $('receipt').value = JSON.stringify(receipt, null, 2);
  $('setup').hidden = true; $('result').hidden = false;
}
async function action(initialize) {
  if (busy) return;
  busy = true; $('capture').disabled = true; $('initialize').disabled = true;
  $('capture-status').textContent = 'Recording; no completed observation claimed yet.';
  try {
    if (!standalone()) throw new Error('Open the installed Clock probe icon first');
    await cacheReady(initialize);
    const observation = observe(initialize ? 'Witnessed baseline' : $('label').value);
    const run = initialize ? await initializeRun({ observation, origin: location.origin,
      target: { model: 'iPhone 17 Pro', os: 'iOS 26.6.1', basis: 'Integrator declaration, not browser detection' } })
      : await appendObservation({ observation });
    paint(run); $('capture-status').textContent = 'Observation ' + run.counter + ' committed and read back. No lease authority claimed.';
  } catch (error) {
    failure(initialize ? 'Initialization did not complete. Preserve the attempt; never clear data or claim a new run to bypass failure.'
      : 'The observation could not be verified. Prior history and its receipt are hidden until the integrator checks integrity. Nothing has been reset.');
    $('capture-status').textContent = 'Observation not acknowledged. ' + error.message + '. Your selected label is retained.';
  } finally { busy = false; $('capture').disabled = false; $('initialize').disabled = !$('confirm').checked; }
}
$('confirm').addEventListener('change', event => { $('initialize').disabled = !event.target.checked || busy; });
$('initialize').addEventListener('click', () => { if ($('confirm').checked) action(true); });
$('capture').addEventListener('click', () => action(false));
$('download').addEventListener('click', () => {
  if (!receipt) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(receipt, null, 2) + '\n'], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url;
  a.download = 'clock-' + receipt.run.runId + '-' + receipt.run.counter + '.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
async function start() {
  if (!isSecureContext || !crypto?.subtle || !crypto?.randomUUID) { failure('A secure context and cryptographic integrity APIs are required.'); return; }
  documentId = crypto.randomUUID();
  if (!standalone()) {
    $('installation').hidden = false;
    $('status').textContent = 'Install the separate Clock probe first';
    $('explanation').textContent = 'This browser tab does not initialize or record a run.';
    try { await cacheReady(true); } catch (_) { $('explanation').textContent = 'Offline installation is not ready. Use the integrator’s reviewed HTTPS address.'; }
    return;
  }
  try {
    await readRun();
    await cacheReady();
    paint(await appendObservation({ observation: observe('Document opened') }));
  } catch (_) {
    failure('The original diagnostic history or shell is missing, changed or unavailable. Check the independent receipt; nothing has been initialized or reset.');
    try { $('setup').hidden = localStorage.getItem(DB_NAME + ':enrollment') !== null; } catch (_) { $('setup').hidden = true; }
  }
}
start();
