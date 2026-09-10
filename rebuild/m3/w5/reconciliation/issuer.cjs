'use strict';
// Pure staged issuer: all persistence is owned by the bridge's revision-guarded
// batch. No local time, request-selected identity or storage enters this module.
const { randomBytes } = require('node:crypto');
const { rowKey } = require('../../../authority/store.cjs');
const crypto = require('../crypto.cjs');
const C = require('./codec.cjs');
const PROFILE = 'earned/r1/v1', CAPACITY = 1048576, TERM = 30 * 24 * 60 * 60 * 1000;
const MAX = Number.MAX_SAFE_INTEGER;
const error = (code, status = 500, retryable = false) => { throw new C.R1Error(code, status, retryable); };
const positive = x => Number.isSafeInteger(x) && x > 0;
const get = (backend, athlete, collection, id) => backend.get(rowKey(athlete, collection, id));
const utc = value => typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(Date.parse(value)).toISOString() === value;
function validLease(lease, authorityKey) {
  return C.object(lease) && lease.schema_version === 1 && Array.isArray(lease.range) && lease.range.length === 2 &&
    lease.range[0] === 1 && positive(lease.range[1]) && utc(lease.not_before) && utc(lease.not_after) &&
    utc(lease.issued_server_time) && lease.issued_server_time === lease.not_before &&
    Date.parse(lease.not_after) - Date.parse(lease.not_before) >= TERM && crypto.verifyLease(lease,authorityKey);
}
function transaction(backend, fn) {
  backend.begin();
  try { const value = fn(); backend.commit(); return value; }
  catch (cause) { backend.rollback(); throw cause; }
}
function put(backend, athlete, collection, id, value, immutable = false) {
  const key = rowKey(athlete, collection, id);
  if (immutable && backend.get(key) !== undefined) error('RETAINED_INTEGRITY');
  backend.put(key, value);
}
function registry(backend, athlete) {
  const row = get(backend, athlete, 'accountRegistry', 'state');
  if (!C.object(row) || Object.keys(row).length !== 4 || row.profile !== PROFILE || !positive(row.account_epoch) ||
      !['ACTIVE','CLOSED'].includes(row.state) ||
      !['PROFILE_GENESIS','VERIFIED_IMPORT','OBSERVED_CURRENT'].includes(row.history_origin)) error('UNAVAILABLE', 503, true);
  if (row.state === 'CLOSED') error('SCOPE_FORBIDDEN', 403);
  return row;
}
function device(backend, athlete, deviceId, authorityKey, { allowRevoked = false } = {}) {
  registry(backend, athlete);
  const state = get(backend, athlete, 'metadata', 'state');
  const current = get(backend, athlete, 'deviceIssuance', deviceId);
  if (!state || !C.object(state.devices)) error('UNAVAILABLE',503,true);
  if (!Object.hasOwn(state.devices, deviceId)) error('SCOPE_FORBIDDEN', 403);
  if (!C.object(current) || Object.keys(current).length !== 4 || current.device_id !== deviceId || !positive(current.creation_epoch) || !positive(current.issue_ordinal) ||
      current.creation_epoch !== current.issue_ordinal ||
      typeof current.current_lease_id !== 'string') error('UNAVAILABLE', 503, true);
  const issued = issuedLease(backend, athlete, deviceId, current.current_lease_id, authorityKey);
  if (!issued || issued.creation_epoch !== current.creation_epoch || issued.issue_ordinal !== current.issue_ordinal ||
      !C.fullEqual(state.devices[deviceId].lease, issued.lease)) error('UNAVAILABLE', 503, true);
  if (!allowRevoked && get(backend, athlete, 'revocations', deviceId)) error('SCOPE_FORBIDDEN', 403);
  return current;
}
function issuedLease(backend, athlete, deviceId, leaseId, authorityKey) {
  const issued = get(backend, athlete, 'issuedLeases', JSON.stringify([deviceId, leaseId]));
  if (issued === undefined) return undefined;
  let decoded;
  try { decoded = C.parse(C.decode64(issued.lease_bytes_b64)); } catch (_) { error('RETAINED_INTEGRITY'); }
  if (!C.object(issued) || Object.keys(issued).length !== 7 || !issued.lease || !C.fullEqual(decoded, issued.lease) || issued.issuer_profile !== PROFILE ||
      issued.lease.athlete_id !== athlete || issued.lease.device_id !== deviceId || issued.lease.lease_id !== leaseId ||
      !positive(issued.issue_ordinal) || !positive(issued.account_epoch) || !positive(issued.creation_epoch) || issued.issue_ordinal !== issued.creation_epoch ||
      !C.digestValue(issued.issuance_intent_digest) ||
      !validLease(issued.lease, authorityKey)) error('RETAINED_INTEGRITY');
  return issued;
}
function standing(backend, athlete, deviceId) {
  const account = get(backend, athlete, 'accountRegistry', 'state');
  const current = get(backend, athlete, 'deviceIssuance', deviceId);
  if (!account || !current) error('RETAINED_INTEGRITY');
  return { account_epoch: account.account_epoch, account_state: account.state, actor_device_id: deviceId,
    actor_revoked: !!get(backend, athlete, 'revocations', deviceId), creation_epoch: current.creation_epoch,
    current_lease_id: current.current_lease_id };
}
function identifier(config, kind, exists) {
  const make = config.ids || (() => kind + '-' + randomBytes(24).toString('base64url'));
  for (let i = 0; i < 16; i++) {
    const id = make(kind);
    if (!C.identifier(id)) error('UNAVAILABLE', 503, true);
    if (!exists(id)) return id;
  }
  error('UNAVAILABLE', 503, true);
}
function event(backend, athlete, kind, deviceId, evidence, config) {
  const account = get(backend, athlete, 'accountRegistry', 'state');
  const current = deviceId === null ? null : get(backend, athlete, 'deviceIssuance', deviceId);
  const id = identifier(config, 'event', id => get(backend, athlete, 'standingEvents', id) !== undefined);
  put(backend, athlete, 'standingEvents', id, { kind, athlete_id: athlete, device_id: deviceId,
    account_epoch: account.account_epoch, creation_epoch: current ? current.creation_epoch : null, evidence }, true);
}
function times(clock, prior) {
  let value, sample;
  try {
    value = typeof clock === 'function' ? clock() : clock.now();
    // The injected interface may supply an ISO string, milliseconds or Date.
    sample = typeof value === 'number' ? value : value instanceof Date ? value.getTime() : typeof value === 'string' ? Date.parse(value) : NaN;
  } catch (_) { error('CLOCK_UNAVAILABLE', 500, true); }
  const previous = prior ? Date.parse(prior.not_after) : 0;
  if (!Number.isFinite(sample) || !Number.isInteger(sample) || Math.abs(sample) > 8640000000000000 ||
      !Number.isFinite(previous) || sample > 8640000000000000 - TERM) error('CLOCK_UNAVAILABLE', 500, true);
  const end = Math.max(sample + TERM, previous);
  try {
    const start = new Date(sample).toISOString(), stop = new Date(end).toISOString();
    // W5's existing verifier accepts this canonical four-digit UTC format.
    if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(start) ||
        !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(stop)) error('CLOCK_UNAVAILABLE', 500, true);
    return { not_before: start, not_after: stop, issued_server_time: start };
  } catch (_) { error('CLOCK_UNAVAILABLE', 500, true); }
}
function makeIssuance({ backend, athlete, deviceId, current, intentDigest, config, authorityKey, clock }) {
  const account = registry(backend, athlete);
  const previous = current && issuedLease(backend, athlete, deviceId, current.current_lease_id, authorityKey);
  const hi = previous ? previous.lease.range[1] : 0;
  if (current && (current.creation_epoch === MAX || current.issue_ordinal === MAX || hi === MAX)) error('ISSUANCE_EXHAUSTED', 409);
  if (!Number.isSafeInteger(hi) || hi < 0 || hi > MAX) error('RETAINED_INTEGRITY');
  const leaseId = identifier(config, 'lease', id => get(backend, athlete, 'issuedLeases', JSON.stringify([deviceId, id])) !== undefined);
  const lease = crypto.signLease({ lease_id: leaseId, athlete_id: athlete, device_id: deviceId, schema_version: 1,
    range: [1, hi + Math.min(CAPACITY, MAX - hi)], ...times(clock, previous && previous.lease) }, authorityKey);
  return { lease, lease_bytes_b64: C.encode64(C.encode(lease)), issuer_profile: PROFILE,
    issue_ordinal: current ? current.issue_ordinal + 1 : 1, issuance_intent_digest: intentDigest,
    account_epoch: account.account_epoch, creation_epoch: current ? current.creation_epoch + 1 : 1 };
}
function persistIssuance(backend, athlete, deviceId, issued) {
  put(backend, athlete, 'issuedLeases', JSON.stringify([deviceId, issued.lease.lease_id]), issued, true);
  put(backend, athlete, 'deviceIssuance', deviceId, { device_id: deviceId, creation_epoch: issued.creation_epoch,
    current_lease_id: issued.lease.lease_id, issue_ordinal: issued.issue_ordinal });
  const metadata = get(backend, athlete, 'metadata', 'state');
  put(backend, athlete, 'metadata', 'state', { ...metadata, devices: { ...metadata.devices, [deviceId]: { lease: issued.lease } } });
}
function enroll(ctx, request) {
  C.validateRouteRequest('/enrol/create', request);
  const { backend, athlete, authorityKey, config } = ctx;
  registry(backend, athlete);
  const digest = C.intentDigest('/enrol/create', request), existing = get(backend, athlete, 'enrollmentIntents', request.intent_id);
  if (existing) {
    if (existing.stable_request_digest !== digest) error('INTENT_CONFLICT', 409);
    device(backend, athlete, existing.device_id, authorityKey);
    const issuance = issuedLease(backend, athlete, existing.device_id, existing.lease_id, authorityKey);
    if (!issuance || issuance.issuance_intent_digest !== digest) error('RETAINED_INTEGRITY');
    return { issuance, deviceId: existing.device_id, intentDigest: digest };
  }
  const metadata = get(backend, athlete, 'metadata', 'state');
  if (!metadata || !metadata.devices) error('UNAVAILABLE', 503, true);
  const deviceId = identifier(config, 'device', id => Object.hasOwn(metadata.devices, id) || get(backend, athlete, 'deviceIssuance', id) !== undefined);
  const issuance = makeIssuance({ ...ctx, deviceId, current: null, intentDigest: digest });
  transaction(backend, () => {
    persistIssuance(backend, athlete, deviceId, issuance);
    put(backend, athlete, 'enrollmentIntents', request.intent_id, { stable_request_digest: digest, device_id: deviceId, lease_id: issuance.lease.lease_id }, true);
    event(backend, athlete, 'DEVICE_ENROLLED', deviceId, { lease_id: issuance.lease.lease_id }, config);
  });
  return { issuance, deviceId, intentDigest: digest };
}
function renew(ctx, deviceId, request) {
  C.validateRouteRequest('/lease/renew', request);
  const { backend, athlete, authorityKey, config } = ctx;
  if (request.device_id !== deviceId) error('SCOPE_FORBIDDEN', 403);
  const current = device(backend, athlete, deviceId, authorityKey);
  const digest = C.intentDigest('/lease/renew', request), key = JSON.stringify([deviceId, request.intent_id]);
  const existing = get(backend, athlete, 'issuanceIntents', key);
  if (existing) {
    if (existing.stable_request_digest !== digest) error('INTENT_CONFLICT', 409);
    const issuance = issuedLease(backend, athlete, deviceId, existing.lease_id, authorityKey);
    if (!issuance || issuance.creation_epoch !== existing.result_creation_epoch || issuance.issuance_intent_digest !== digest) error('RETAINED_INTEGRITY');
    return { issuance, deviceId, intentDigest: digest };
  }
  if (request.expected_creation_epoch !== current.creation_epoch || request.expected_lease_id !== current.current_lease_id) error('STALE_CREATION', 409);
  const issuance = makeIssuance({ ...ctx, deviceId, current, intentDigest: digest });
  transaction(backend, () => {
    persistIssuance(backend, athlete, deviceId, issuance);
    put(backend, athlete, 'issuanceIntents', key, { stable_request_digest: digest, lease_id: issuance.lease.lease_id,
      result_creation_epoch: issuance.creation_epoch }, true);
    event(backend, athlete, 'LEASE_RENEWED', deviceId, { lease_id: issuance.lease.lease_id }, config);
  });
  return { issuance, deviceId, intentDigest: digest };
}
function genesis({ backend, athlete, config, authorityKey }, existed) {
  if (existed) error('HISTORY_INCOMPLETE', 409);
  const metadata = get(backend, athlete, 'metadata', 'state');
  if (!metadata || metadata.seq !== 0) error('HISTORY_INCOMPLETE', 409);
  transaction(backend, () => {
    put(backend, athlete, 'accountRegistry', 'state', { profile: PROFILE, account_epoch: 1, state: 'ACTIVE', history_origin: 'PROFILE_GENESIS' });
    event(backend, athlete, 'PROFILE_GENESIS', null, { history_origin: 'PROFILE_GENESIS' }, config);
    for (const [deviceId, setup] of Object.entries(metadata.devices)) {
      const lease = setup && setup.lease;
      if (!lease || lease.athlete_id !== athlete || lease.device_id !== deviceId || !validLease(lease,authorityKey) ||
          lease.range[1] !== CAPACITY) error('RETAINED_INTEGRITY');
      const digest = C.hash('intent', C.encode({ genesis: true, athlete_id: athlete, device_id: deviceId, lease_id: lease.lease_id }));
      const issuance = { lease, lease_bytes_b64: C.encode64(C.encode(lease)), issuer_profile: PROFILE, issue_ordinal: 1,
        issuance_intent_digest: digest, account_epoch: 1, creation_epoch: 1 };
      persistIssuance(backend, athlete, deviceId, issuance);
      const genesisIntent = identifier(config, 'genesis-intent', id => get(backend, athlete, 'enrollmentIntents', id) !== undefined);
      put(backend, athlete, 'enrollmentIntents', genesisIntent, {stable_request_digest:digest,device_id:deviceId,lease_id:lease.lease_id}, true);
      event(backend, athlete, 'DEVICE_ENROLLED', deviceId, { lease_id: lease.lease_id }, config);
    }
  });
}
module.exports = { PROFILE, CAPACITY, TERM, error, registry, device, issuedLease, standing, transaction, put, event, enroll, renew, genesis };
