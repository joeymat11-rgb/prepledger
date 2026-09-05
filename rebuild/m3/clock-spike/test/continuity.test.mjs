import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { createRequire } from 'node:module';
import { createContinuityModel, timeBytes } from '../continuity-model.mjs';
const require = createRequire(import.meta.url);
const { Store, memoryBackend } = require('../../../client/index.cjs');
const { signLease } = require('../../../authority/crypto.cjs');
const { createAuthority } = require('../../../authority/index.cjs');

const DAY = 86400000, T0 = Date.parse('2026-09-01T00:00:00Z'), END = T0 + 30 * DAY;
const authorityKey = 'W3-SYNTHETIC-ONLY-authority', identityKey = 'W3-SYNTHETIC-ONLY-identity';
const keys = generateKeyPairSync('ec', { namedCurve: 'prime256v1' }); // Ephemeral; never exported.
const signedTime = (request, server_ms = T0, changes = {}) => {
  const body = { ...request, server_ms, ...changes };
  return { ...body, signature: sign('sha256', timeBytes(body), keys.privateKey).toString('base64') };
};
function fixture({ backend, range = [1, 3], hook, qualified = true, end = END } = {}) {
  const lease = signLease({ lease_id: 'lease-W3', schema_version: 1, device_id: 'phone-A', athlete_id: 'synthetic-A',
    range, not_before: new Date(T0 - 1000).toISOString(), not_after: new Date(end).toISOString() }, authorityKey);
  const fresh = !backend;
  backend ||= memoryBackend();
  if (fresh) {
    // An explicitly enrolled synthetic fixture. The spike never infers enrollment
    // from an empty browser database, and this boot record grants no clock proof.
    assert.equal(new Store(backend).transaction(tx => {
      tx.put('meta', 'clock-continuity', { version: 1, device: 'phone-A', highWater: T0, lease });
      tx.put('meta', 'device', { deviceId: 'phone-A', seq: 0 });
    }).ok, true);
  }
  const clock = { tick: 0, wall: T0, zone: 'UTC', drift: 0, boundAvailable: qualified,
    read() { return this.tick; },
    // Perfect simulated elapsed source, or a supplied conservative drift factor.
    // NO claim that performance.now() on iOS provides this bound.
    upperElapsed(a, b) { return this.boundAvailable ? (b - a) * (1 + this.drift) : NaN; } };
  const model = createContinuityModel({ backend, lease, authorityKey, identityKey, verifyKey: keys.publicKey,
    elapsedClock: clock, beforeDurableCommit: () => hook?.(clock, model) });
  function anchor(server = T0, { rtt = 0, reconcile = true } = {}) {
    const request = model.challenge();
    if (reconcile) model.historyReconciled({ authenticated: true, localHeadCompatible: true });
    clock.tick += rtt;
    return model.receiveTime(signedTime(request, server));
  }
  return { model, clock, backend, lease, anchor };
}
function snapshot(b) { return Object.fromEntries(b.collections().filter(c => b.keys(c).length).map(c => [c, Object.fromEntries(b.keys(c).map(k => [k, b.get(c, k)]))])); }
function refusedUnchanged(f, state) {
  const before = snapshot(f.backend), value = { date: '2026-09-01', lb: 170.25 };
  const result = f.model.weighIn(value);
  assert.equal(result.acknowledged, false); assert.equal(result.state, state);
  assert.deepEqual(f.model.retainedValue(), value);
  assert.deepEqual(snapshot(f.backend), before); return result;
}
function accepted(f) {
  const result = f.model.weighIn({ date: '2026-09-01', lb: 170.25 });
  assert.equal(result.acknowledged, true); assert.equal(result.state, 1);
  const op = f.model.client.envelope(result.op_id);
  assert.ok(op); assert.ok(f.backend.get('outbox', result.op_id));
  assert.equal(f.backend.get('meta', 'clock-continuity').sequence, op.device_seq);
  assert.deepEqual(f.backend.get('meta', 'clock-continuity').lease, f.lease);
  assert.equal(f.backend.get('meta', 'device').seq, op.device_seq);
  return op;
}

test('C11 time: last valid cutoff is inclusive; first invalid millisecond is state20', () => {
  const f = fixture(); assert.equal(f.anchor(), true); f.clock.tick = END - T0;
  accepted(f); assert.equal(f.backend.get('meta', 'clock-continuity').highWater, END);
  f.clock.tick++; refusedUnchanged(f, 20);
});
test('C11 sequence: last valid slot saved; first invalid slot and exhaustion are state20', () => {
  const f = fixture({ range: [1, 2] }); f.anchor();
  assert.equal(accepted(f).device_seq, 1); assert.equal(accepted(f).device_seq, 2);
  refusedUnchanged(f, 20); assert.equal(f.model.state(), 20);
});
test('C11 sequence: below authorized start is also refused state20', () => {
  const f = fixture({ range: [2, 3] }); f.anchor(); refusedUnchanged(f, 20);
});
for (const [name, offset, zone] of [
  ['minus24h skew', -DAY, 'UTC'], ['plus24h skew', DAY, 'UTC'],
  ['wall rollback', -10 * DAY, 'UTC'], ['wall roll-forward', 90 * DAY, 'UTC'],
  ['DST forward', 3600000, 'America/New_York'], ['DST backward', -3600000, 'America/New_York'],
  ['timezone change', 9 * 3600000, 'Asia/Tokyo'],
]) test(`C11 ${name}: wall observations cannot alter valid permission or reopen expiry`, () => {
  const f = fixture(); f.anchor(); f.clock.tick = 5; f.clock.wall += offset; f.clock.zone = zone;
  accepted(f); assert.equal(f.backend.get('meta', 'clock-continuity').highWater, T0 + 5);
  f.clock.tick = END - T0 + 1; refusedUnchanged(f, 20);
  f.clock.wall = T0 - 100 * DAY; refusedUnchanged(f, 20);
});
for (const name of ['process kill', 'reboot', 'restored old local state'])
  test(`C11 ${name}: durable outbox survives but a new execution has no proof, state20`, () => {
    const f = fixture(); f.anchor(); accepted(f);
    const saved = snapshot(f.backend); f.clock.tick = 50; accepted(f);
    const b = name === 'restored old local state' ? memoryBackend(saved) : f.backend;
    const g = fixture({ backend: b });
    assert.ok(g.model.client.outbox().length > 0);
    refusedUnchanged(g, 20);
    // A fresh authentic time alone cannot authorize sequence reuse after restore.
    assert.equal(g.anchor(T0 + 100, { reconcile: false }), false);
    refusedUnchanged(g, 20);
  });
test('C1-C11-RESTART RED WITNESS: identical local observations cannot distinguish pre/post expiry', () => {
  const f = fixture(); f.anchor(); accepted(f); const persisted = snapshot(f.backend);
  // History A closed for 1 second. History B closed for 31 days, then its wall
  // clock/origin estimate was reset. Both expose these same post-restart inputs.
  const observations = { wall: T0 + 1000, timeOrigin: T0 + 500, now: 500 };
  const verdicts = [1000, 31 * DAY].map(realElapsed => {
    assert.ok(realElapsed > 0); // Hidden reality is deliberately NOT a model input.
    const g = fixture({ backend: memoryBackend(persisted) });
    g.clock.wall = observations.wall; g.clock.tick = observations.now;
    return refusedUnchanged(g, 20).state;
  });
  assert.deepEqual(verdicts, [20, 20]); // C11 safety; C1 cold-start writes remain UNSATISFIED.
});
test('C11 suspension / unqualified elapsed source: even authentic time cannot establish an upper bound', () => {
  const f = fixture({ qualified: false }); assert.equal(f.anchor(), false); refusedUnchanged(f, 20);
  const g = fixture(); g.anchor(); g.clock.boundAvailable = false; refusedUnchanged(g, 20);
});
test('C11 monotonic rollback and explicit lifecycle invalidation refuse state20', () => {
  const f = fixture(); f.anchor(); f.clock.tick = 20; accepted(f);
  f.clock.tick = 10; refusedUnchanged(f, 20);
  const g = fixture(); g.anchor(); g.model.invalidate('page suspended: elapsed bound unavailable'); refusedUnchanged(g, 20);
});
test('Freshness: signed nonce replay, forged signature and mismatched bindings never reanchor', () => {
  for (const changes of [{ nonce: 'replayed' }, { device_id: 'phone-B' }, { athlete_id: 'synthetic-B' },
    { lease_id: 'old-lease' }, { schema_version: 2 }]) {
    const f = fixture(); const request = f.model.challenge();
    f.model.historyReconciled({ authenticated: true, localHeadCompatible: true });
    assert.equal(f.model.receiveTime(signedTime(request, T0, changes)), false); refusedUnchanged(f, 20);
  }
  const f = fixture(), request = f.model.challenge();
  f.model.historyReconciled({ authenticated: true, localHeadCompatible: true });
  const record = signedTime(request); record.server_ms++;
  assert.equal(f.model.receiveTime(record), false); refusedUnchanged(f, 20);
  assert.equal(f.anchor(), true); f.model.invalidate('restart');
  assert.equal(f.model.receiveTime(signedTime(request)), false); refusedUnchanged(f, 20);
});
test('Freshness: bounded reply delay is charged conservatively; oversized delay is refused', () => {
  const f = fixture(); assert.equal(f.anchor(END, { rtt: 1 }), true); refusedUnchanged(f, 20);
  const g = fixture(); assert.equal(g.anchor(T0, { rtt: 1001 }), false); refusedUnchanged(g, 20);
  const h = fixture(); h.clock.drift = 0.1; h.anchor(); h.clock.tick = (END - T0) / 1.1 + 1;
  refusedUnchanged(h, 20);
});
test('Fresh anchor never decreases a surviving persisted high-water mark', () => {
  const f = fixture(); f.anchor(); f.clock.tick = 500; accepted(f);
  const g = fixture({ backend: f.backend }); assert.equal(g.anchor(T0 + 100), true);
  assert.equal(g.model.bound().upper, T0 + 500); accepted(g);
});
test('State11 session expiry pauses sync but a valid lease still saves; state17 outranks20', () => {
  const f = fixture(); f.anchor(); f.model.client.signInRequired();
  assert.equal(f.model.state(), 11); accepted(f);
  assert.equal(f.model.state(), 11); assert.equal(f.model.client.syncStatus().paused, true);
  f.model.setStanding('signed-out'); f.model.invalidate('no continuity'); refusedUnchanged(f, 17);
  const g = fixture({ backend: f.backend }); refusedUnchanged(g, 17);
});
for (const standing of ['device-revoked', 'account-closed', 'decryption-unavailable', 'recovery-unavailable'])
  test(`State17 ${standing}: refuses new writes and retains entered value`, () => {
    const f = fixture(); f.anchor(); accepted(f); f.model.setStanding(standing); refusedUnchanged(f, 17);
  });
test('State18 partial loss and whole-store erasure block before first-use/clock decisions', () => {
  const f = fixture(); f.anchor(); accepted(f); f.backend.clear('ops');
  const g = fixture({ backend: f.backend }); refusedUnchanged(g, 18);
  const h = fixture({ backend: memoryBackend() }); refusedUnchanged(h, 18);
});
test('Commit cut: expiry or lost continuity during staging rolls back operation/outbox/sequence/high-water', () => {
  for (const hook of [(clock) => { clock.tick = END - T0 + 1; },
    (_, model) => model.invalidate('killed before commit')]) {
    const f = fixture({ hook }); f.anchor(); refusedUnchanged(f, 20);
  }
});
test('Commit cut: ordinary storage failure is state3 and rolls back high-water too', () => {
  const f = fixture({ hook: () => { throw Error('synthetic quota failure'); } }); f.anchor();
  const before = snapshot(f.backend), result = f.model.weighIn({ lb: 170 });
  assert.equal(result.acknowledged, false); assert.equal(result.state, 3);
  assert.deepEqual(snapshot(f.backend), before);
});
test('Commit cut: failure after clock record is staged also rolls back every durable record', () => {
  const base = fixture(), before = snapshot(base.backend);
  const failing = { ...base.backend, commit() { throw Error('synthetic final commit failure'); } };
  const f = fixture({ backend: failing }); f.anchor();
  const result = f.model.weighIn({ date: '2026-09-01', lb: 170 });
  assert.equal(result.acknowledged, false); assert.equal(result.state, 3);
  assert.deepEqual(snapshot(f.backend), before);
});
test('State18 loss of the clock checkpoint after anchoring refuses before acknowledgement', () => {
  const f = fixture(); f.anchor();
  new Store(f.backend).transaction(tx => tx.del('meta', 'clock-continuity'));
  refusedUnchanged(f, 18);
});
test('Commit cut: caller mutation cannot extend the originally signed lease during staging', () => {
  const f = fixture({ hook: clock => {
    clock.tick = END - T0 + 1;
    f.lease.not_after = new Date(END + DAY).toISOString(); // Deliberately NOT re-signed.
  } });
  f.anchor(); refusedUnchanged(f, 20);
});
test('C11 late reconnect: actual T3 accepts original valid outbox after cutoff, including replay', () => {
  const f = fixture(); f.anchor(); const op = accepted(f); f.clock.tick = 31 * DAY;
  refusedUnchanged(f, 20);
  const authority = createAuthority({ authorityKey, identityKeys: { 'synthetic-A': identityKey },
    clock: () => new Date(T0 + 31 * DAY).toISOString(),
    athletes: { 'synthetic-A': { devices: { 'phone-A': { lease: f.lease } }, plan: {} } } });
  const result = authority.admit('synthetic-A', op);
  assert.equal(result.status, 'ACCEPTED'); assert.deepEqual(authority.admit('synthetic-A', op), result);
  f.model.client.deliverDisposition(result); assert.equal(f.model.client.outbox().length, 0);
  // Fresh signed time confirms expiry; it cannot extend the same signed lease.
  f.anchor(T0 + 31 * DAY); refusedUnchanged(f, 20);
});
test('C11 declared revocation: state17 for known loss; authority barrier preserves accepted prefix', () => {
  const f = fixture(); f.anchor(); const op1 = accepted(f), op2 = accepted(f);
  const authority = createAuthority({ authorityKey, identityKeys: { 'synthetic-A': identityKey },
    clock: () => new Date(T0 + 31 * DAY).toISOString(),
    athletes: { 'synthetic-A': { devices: { 'phone-A': { lease: f.lease } }, plan: {} } } });
  const accepted1 = authority.admit('synthetic-A', op1); assert.equal(accepted1.status, 'ACCEPTED');
  const barrier = authority.revokeDevice('synthetic-A', 'phone-A');
  assert.equal(barrier.barrier, 1); assert.equal(barrier.declared_loss, true);
  assert.deepEqual(authority.admit('synthetic-A', op1), accepted1);
  assert.equal(authority.admit('synthetic-A', op2).status, 'REJECTED');
  f.model.client.revoke(); refusedUnchanged(f, 17);
  assert.equal(f.model.client.outbox().length, 2); // No deletion masquerading as sync.
});
