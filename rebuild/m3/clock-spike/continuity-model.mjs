// W3 executable specification, NOT a browser adapter or a qualified iOS clock.
// Synthetic elapsed-time bounds are supplied explicitly. No wall-clock fallback.
import { randomBytes, verify } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createClient, Store } = require('../../client/index.cjs');

export const TIME_DOMAIN = 'earned/w3-model-time/v1\n';
export function timeBytes(record) {
  const { signature, ...body } = record;
  return Buffer.from(TIME_DOMAIN + JSON.stringify(body));
}
const finite = Number.isFinite;
const iso = n => new Date(n).toISOString();
const refusal = (state, reason, value) => ({ acknowledged: false, state, reason,
  copy: state === 18 ? 'Restore required.' : state === 17 ? 'Recover account/device standing before saving.' : 'Connect to establish clock continuity or renew the lease.',
  retainedValue: value });

export function createContinuityModel({ backend, lease: suppliedLease, authorityKey, identityKey,
  verifyKey, elapsedClock, maxRoundTripMs = 1000, serverErrorMs = 0,
  beforeDurableCommit = () => {} }) {
  if (!elapsedClock || typeof elapsedClock.read !== 'function') throw Error('explicit model clock required');
  const lease = structuredClone(suppliedLease);
  if (Array.isArray(lease.range)) Object.freeze(lease.range);
  Object.freeze(lease); // A caller cannot change a verified capability during staging.
  const device = lease.device_id, athlete = lease.athlete_id;
  const saved = backend.get('meta', 'clock-continuity');
  const integrity = new Store(backend).integrity();
  let damaged = !integrity.intact || !backend.get('meta', 'checkpoint') || !backend.get('meta', 'device') || !saved || saved.version !== 1 ||
    saved.device !== device || !finite(saved.highWater) || !saved.lease;
  let highWater = damaged ? NaN : saved.highWater;
  // Neither this anchor nor its pending challenge is deserialized from storage.
  let anchor = null, pending = null, reconciled = false, generation = 0;
  let reason = 'new execution: elapsed interval is unproven';
  let attempt = null, cutRefusal = null, entered;
  let standing = backend.get('meta', 'clock-standing') || 'enrolled';
  let lastReading = null;

  function invalidate(why) {
    anchor = null; pending = null; reconciled = false; generation++;
    reason = why;
  }
  function elapsed(from, to) {
    if (!finite(from) || !finite(to) || to < from ||
      typeof elapsedClock.upperElapsed !== 'function') return NaN;
    const bound = elapsedClock.upperElapsed(from, to);
    return finite(bound) && bound >= 0 ? bound : NaN;
  }
  function bounds() {
    if (!anchor) return null;
    const now = elapsedClock.read();
    if (lastReading != null && now < lastReading) { invalidate('monotonic source rolled back'); return null; }
    lastReading = now;
    const delta = elapsed(anchor.at, now);
    if (!finite(delta)) { invalidate('no qualified elapsed upper bound'); return null; }
    highWater = Math.max(highWater, anchor.upper + delta);
    return { upper: highWater, lower: anchor.lower }; // Lower need not advance to enforce not_before safely.
  }
  function permission(sequence, insideCommit = false) {
    const persisted = backend.get('meta', 'clock-continuity');
    if (damaged || !backend.get('meta', 'checkpoint') || !backend.get('meta', 'device') || !persisted || !finite(persisted.highWater) || !persisted.lease ||
      (!insideCommit && !new Store(backend).integrity().intact)) return { state: 18, reason: 'missing or damaged store' };
    if (standing !== 'enrolled' || backend.get('meta', 'standing')?.standing === 'revoked')
      return { state: 17, reason: 'known ' + standing + '/revocation' };
    const b = bounds();
    if (!b || !reconciled) return { state: 20, reason };
    if (lease.schema_version !== 1) return { state: 20, reason: 'schema lease mismatch: update required' };
    if (!finite(Date.parse(lease.not_before)) || !finite(Date.parse(lease.not_after)) ||
      b.lower < Date.parse(lease.not_before) || b.upper > Date.parse(lease.not_after))
      return { state: 20, reason: 'outside conservatively proven lease window' };
    if (sequence != null && (!Array.isArray(lease.range) || lease.range.length !== 2 ||
      !lease.range.every(Number.isSafeInteger) || !Number.isSafeInteger(sequence) ||
      sequence < lease.range[0] || sequence > lease.range[1]))
      return { state: 20, reason: 'authorized sequence range exhausted' };
    return null;
  }
  // The existing T2 committer is synchronous. The wrapper writes its clock record
  // in THAT transaction, and rolls it all back if permission is lost at its cut.
  // This does not implement the future asynchronous IndexedDB bridge.
  const wrapped = { ...backend, commit(handle) {
    if (attempt) {
      beforeDurableCommit();
      const stagedSequence = backend.get('meta', 'device')?.seq;
      cutRefusal = permission(stagedSequence, true);
      if (cutRefusal) throw Error('W3 permission lost before durable commit');
      backend.write(handle, 'meta', 'clock-continuity', {
        version: 1, device, highWater, lease: { ...lease }, sequence: stagedSequence,
      });
    }
    backend.commit(handle);
  } };
  // T2 also uses now() for athlete effective time. That coupling is a W6 seam;
  // these are synthetic entries, not a production timestamp implementation.
  const client = createClient({ backend: wrapped, deviceId: device, athleteId: athlete,
    authorityKey, identityKey, lease, online: false,
    clock: { now: () => iso(bounds()?.upper ?? (finite(highWater) ? highWater : Date.parse(lease.not_before))),
      today: () => '2026-09-01', monotonicMs: () => elapsedClock.read(), tz: '+00:00' } });
  client.boot();
  const api = {
    client, backend,
    challenge() {
      invalidate('awaiting fresh bound server time and history reconciliation');
      const nonce = randomBytes(24).toString('hex');
      pending = { nonce, at: elapsedClock.read(), generation };
      return { nonce, device_id: device, athlete_id: athlete, lease_id: lease.lease_id, schema_version: 1 };
    },
    // This is an explicit test prerequisite, NOT an implemented recovery method.
    // W5/W6 must authenticate current standing, slots and accepted history first.
    historyReconciled({ authenticated, localHeadCompatible }) {
      reconciled = authenticated === true && localHeadCompatible === true;
      return reconciled;
    },
    receiveTime(record) {
      if (!pending) return false;
      const request = pending; pending = null; // Single-use, including failed responses.
      const at = elapsedClock.read(), roundTrip = elapsed(request.at, at);
      let authentic = false;
      try { authentic = verify('sha256', timeBytes(record), verifyKey, Buffer.from(record.signature, 'base64')); } catch {}
      if (!authentic || request.generation !== generation || record.nonce !== request.nonce ||
        record.device_id !== device || record.athlete_id !== athlete || record.lease_id !== lease.lease_id ||
        record.schema_version !== 1 || !finite(record.server_ms) || !finite(roundTrip) ||
        roundTrip > maxRoundTripMs || !finite(serverErrorMs) || serverErrorMs < 0 ||
        !reconciled || damaged || standing !== 'enrolled') {
        anchor = null; reason = 'freshness, binding, elapsed bound or recovery prerequisite failed'; return false;
      }
      // S is assumed issued between send and receive. Add the entire bounded
      // round trip, server error, then future elapsed upper bounds: never Date.now.
      anchor = { at, upper: Math.max(highWater, record.server_ms + serverErrorMs + roundTrip),
        lower: record.server_ms - serverErrorMs };
      highWater = anchor.upper; lastReading = at;
      reason = 'lease renewal required'; return true;
    },
    invalidate,
    setStanding(value) {
      standing = value;
      const result = new Store(backend).transaction(tx => tx.put('meta', 'clock-standing', value));
      if (!result.ok) invalidate('standing persistence failed; recovery required');
      return result;
    },
    state() {
      const next = (backend.get('meta', 'device')?.seq || 0) + 1;
      return permission(next)?.state ?? client.stateOf();
    },
    weighIn(value) {
      entered = value;
      const next = (backend.get('meta', 'device')?.seq || 0) + 1;
      const blocked = permission(next);
      if (blocked) return refusal(blocked.state, blocked.reason, entered);
      attempt = { next }; cutRefusal = null;
      try {
        const result = client.weighIn(value);
        // T2 correctly rolls back a thrown commit. Its generic storage result is
        // state3; the MODEL knows this explicit permission fault must be state20/17.
        return cutRefusal ? refusal(cutRefusal.state, cutRefusal.reason, entered) : result;
      } finally { attempt = null; }
    },
    retainedValue: () => entered,
    bound: () => bounds(),
  };
  return api;
}
