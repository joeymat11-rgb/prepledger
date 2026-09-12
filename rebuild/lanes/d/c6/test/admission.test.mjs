import test from 'node:test';
import assert from 'node:assert/strict';
import { AdmissionService, digest } from '../admission.mjs';
import worker from '../worker.mjs';
import { environment, START, policySha, request, body, tokens, MemoryStorage } from './support.mjs';

async function fixture(options = {}) {
  const env = await environment(options.now || START), storage = new MemoryStorage();
  let time = options.now || START, calls = 0;
  const createSession = async args => { calls++; return options.provider ? options.provider(args, storage) : { sessionId: 'synthetic-id', sdpAnswer: 'v=0\r\ns=SYNTHETIC ANSWER\r\n' }; };
  const make = () => new AdmissionService({ storage, env, createSession, companionPolicySha: policySha, now: () => time });
  return { env, storage, make, service: make(), calls: () => calls, advance: n => { time += n; }, setTime: n => { time = n; } };
}
async function refusal(f, req, code) {
  const before = f.calls(), res = await f.service.handle(req), data = await res.json();
  assert.equal(data.code, code); assert.equal(data.ok, false);
  assert.deepEqual(Object.keys(data).sort(), ['code','nonce','ok']);
  assert.equal(f.calls(), before); return res;
}
test('C6-01 valid enrolled principal, reviewed consent and exact success shape', async () => {
  const f = await fixture(), res = await f.service.handle(request());
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(Object.keys(data), ['nonce','session_id','sdp_answer','session_minute_cap','deadline_at','provider','model']);
  assert.equal(data.session_minute_cap, 10); assert.equal(Date.parse(data.deadline_at) - START, 600000);
  assert.equal(data.model, 'gpt-live-1'); assert.equal(f.calls(), 1);
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://phone.example');
});
test('C6-01 forged, cross-user and revoked phone credentials refuse before creation', async () => {
  const f = await fixture();
  await refusal(f, request(body(), { headers: { Authorization: 'Bearer ' + 'x'.repeat(43) } }), 'COACH_AUTH_REQUIRED');
  await refusal(f, request(body('dad'), { headers: { Authorization: 'Bearer ' + tokens.joe } }), 'COACH_USER_NOT_NAMED');
  f.env.PHONE_CREDENTIALS_JSON = '[]';
  await refusal(f, request(), 'COACH_AUTH_REQUIRED');
});
test('C6-01 invalid credential mapping fails closed rather than selecting first duplicate', async () => {
  const f = await fixture(), d = await digest(tokens.joe);
  f.env.PHONE_CREDENTIALS_JSON = JSON.stringify([{ user: 'joe', digest: d }, { user: 'dad', digest: d }]);
  await refusal(f, request(), 'COACH_AUTH_REQUIRED');
});
test('C6-01 mismatched, unknown and future consent is not admission', async () => {
  for (const edit of [b => { b.opt_in.user = 'dad'; }, b => { b.opt_in.screen_version = 'unknown'; },
    b => { b.opt_in.wording += ' changed'; }, b => { b.opt_in.accepted_at = '2031-02-04T13:00:00.000Z'; }]) {
    const f = await fixture(), b = body(); edit(b);
    await refusal(f, request(b), 'COACH_OPT_IN_REQUIRED');
  }
});
test('C6-06 missing, disabled, stale, wrong-project/rate/amount cap fails before provider', async () => {
  const variants = [null, { enabled: false }, { project_id: 'other-project' }, { month_limit_usd: 51 },
    { minute_price_usd: 0.06 }, { verified_at: '2029-01-01T00:00:00.000Z' }, { verified_at: '2031-01-01T00:00:00.000Z' }];
  for (const change of variants) {
    const f = await fixture(), original = JSON.parse(f.env.CAP_VERIFICATION_JSON);
    f.env.CAP_VERIFICATION_JSON = JSON.stringify(change === null ? null : { ...original, ...change });
    await refusal(f, request(), 'COACH_CAP_NOT_VERIFIED');
    assert.equal(f.storage.rows.size, 0);
  }
});
test('C6-09 missing review or different server policy blocks live transport', async () => {
  for (const review of [null, { artifact_sha: 'a'.repeat(40), policy_sha: 'wrong', reviewed: true }]) {
    const f = await fixture(); f.env.COMPANION_REVIEW_JSON = JSON.stringify(review);
    await refusal(f, request(), 'COACH_ENFORCEMENT_UNAVAILABLE');
  }
});
test('C6-04 atomic same-nonce concurrency, new-nonce active window and restart cannot duplicate', async () => {
  const f = await fixture();
  const results = await Promise.all(Array.from({ length: 12 }, () => f.service.handle(request())));
  assert.equal(results.filter(r => r.status === 200).length, 1);
  for (const r of results.filter(r => r.status !== 200)) assert.equal((await r.json()).code, 'COACH_SESSION_REQUEST_REPLAYED');
  assert.equal(f.calls(), 1);
  await refusal(f, request(body('joe', 2)), 'COACH_SESSION_CAP_REACHED');
  f.service = f.make(); await refusal(f, request(), 'COACH_SESSION_REQUEST_REPLAYED');
});
test('C6-06 concurrent per-user starts cannot overspend final allowance; both users total 300', async () => {
  const f = await fixture();
  await f.storage.put('month:2030-02', { joe: 140, dad: 140 });
  const results = await Promise.all(['joe','dad'].flatMap((user, i) => [1,2,3].map(n => f.service.handle(request(body(user, n + i * 10))))));
  assert.equal(results.filter(r => r.status === 200).length, 2); assert.equal(f.calls(), 2);
  assert.deepEqual(await f.storage.get('month:2030-02'), { joe: 150, dad: 150 });
  f.advance(600001);
  await refusal(f, request(body('joe', 99)), 'COACH_SESSION_CAP_REACHED');
  await refusal(f, request(body('dad', 99)), 'COACH_SESSION_CAP_REACHED');
});
test('C6-04 pre-provider transaction failure spends no money and saves no partial reservation', async () => {
  const f = await fixture(); f.storage.failCommit = true;
  await refusal(f, request(), 'COACH_RELAY_UNAVAILABLE'); assert.equal(f.storage.rows.size, 0);
});
test('C6-04 uncertain creation and malformed answers consume reservation and cannot replay', async () => {
  for (const provider of [async () => { throw Error('synthetic upstream private text'); }, async () => ({ sessionId: '', sdpAnswer: 'bad' })]) {
    const f = await fixture({ provider });
    const response = await f.service.handle(request());
    assert.equal((await response.json()).code, 'COACH_RELAY_UNAVAILABLE');
    assert.deepEqual(await f.storage.get('month:2030-02'), { joe: 10, dad: 0 });
    await refusal(f, request(), 'COACH_SESSION_REQUEST_REPLAYED');
    assert.equal(f.calls(), 1);
  }
});
test('C6-04 storage failure after provider success leaves original durable reservation', async () => {
  const f = await fixture({ provider: async (_args, storage) => { storage.failCommit = true; return { sessionId: 'synthetic', sdpAnswer: 'v=0\r\n' }; } });
  assert.equal((await f.service.handle(request())).status, 503);
  f.storage.failCommit = false; f.service = f.make();
  await refusal(f, request(), 'COACH_SESSION_REQUEST_REPLAYED'); assert.equal(f.calls(), 1);
});
test('C6-07 stored fields contain control state only, never credential, SDP, transcript or consent', async () => {
  const f = await fixture(); await f.service.handle(request());
  const entries = [...f.storage.rows.entries()], session = entries.find(([k]) => k.startsWith('session:'))[1];
  assert.deepEqual(Object.keys(session).sort(), ['deadline','nonceDigest','reservation','sessionId','state','user']);
  assert.deepEqual(Object.keys(entries.find(([k]) => k.startsWith('month:'))[1]).sort(), ['dad','joe']);
  const stored = JSON.stringify(entries);
  for (const value of [tokens.joe, f.env.OPENAI_API_KEY, body().nonce, body().sdp_offer, body().opt_in.wording]) assert.equal(stored.includes(value), false);
});
test('C6-07 session cleanup at deadline+24h; counters persist through month+7d, then expire', async () => {
  const f = await fixture(); await f.service.handle(request());
  f.setTime(START + 600000 + 86400000 - 1); await f.service.cleanup(); assert.equal(f.storage.rows.size, 2);
  f.advance(1); await f.service.cleanup(); assert.equal(f.storage.rows.size, 1);
  assert.equal(f.storage.alarm, Date.parse('2030-03-08T00:00:00.000Z'));
  f.setTime(f.storage.alarm); await f.service.cleanup(); assert.equal(f.storage.rows.size, 0); assert.equal(f.storage.alarm, null);
});
test('C6-06 month crossing reserves full ten in both calendars; no assumed billing split', async () => {
  const now = Date.parse('2030-02-28T23:55:00.000Z'), f = await fixture({ now });
  assert.equal((await f.service.handle(request())).status, 200);
  for (const month of ['2030-02','2030-03']) assert.deepEqual(await f.storage.get('month:' + month), { joe: 10, dad: 0 });
});
test('C6-08 exact CORS preflight and refusal routes have no alternate media/control endpoint', async () => {
  const f = await fixture();
  const preflight = new Request('https://relay.example/session', { method: 'OPTIONS', headers: { Origin: f.env.APP_ORIGIN, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization, content-type' } });
  assert.equal((await f.service.handle(preflight)).status, 204);
  await refusal(f, request(body(), { headers: { Origin: 'https://wrong.example' } }), 'COACH_AUTH_REQUIRED');
  await refusal(f, new Request('https://relay.example/audio', { method: 'POST', headers: { Origin: f.env.APP_ORIGIN } }), 'COACH_REQUEST_INVALID');
  await refusal(f, request(body(), { headers: { Upgrade: 'websocket' } }), 'COACH_REQUEST_INVALID');
  await refusal(f, request(body(), { headers: { 'Content-Type': 'audio/pcm' } }), 'COACH_REQUEST_INVALID');
});
test('C6-02 oversized stream and invalid UTF8 refuse without provider calls', async () => {
  const f = await fixture();
  for (const data of ['x'.repeat(98305), new Uint8Array([0xff])]) await refusal(f, request(body(), { body: data }), 'COACH_REQUEST_INVALID');
});
test('C6-06 duplicate operator configuration keys cannot override a disabled cap', async () => {
  const f = await fixture();
  f.env.CAP_VERIFICATION_JSON = f.env.CAP_VERIFICATION_JSON.replace('"enabled":true', '"enabled":false,"enabled":true');
  await refusal(f, request(), 'COACH_CAP_NOT_VERIFIED');
});
test('C6-04 corrupted control rows fail closed before any new provider call', async () => {
  for (const [key, row] of [['session:' + 'a'.repeat(64), { deadline: START + 600000 }], ['month:2030-02', { joe: -10, dad: 0 }]]) {
    const f = await fixture(); await f.storage.put(key, row);
    await refusal(f, request(), 'COACH_RELAY_UNAVAILABLE');
  }
});
test('C6-07 provider completion after retention cannot resurrect a deleted session', async () => {
  let release;
  const f = await fixture({ provider: () => new Promise(resolve => { release = resolve; }) });
  const pending = f.service.handle(request());
  while (!release) await new Promise(resolve => setImmediate(resolve));
  f.setTime(START + 600000 + 86400000); await f.service.cleanup();
  release({ sessionId: 'late-synthetic', sdpAnswer: 'v=0\r\n' });
  assert.equal((await pending).status, 503);
  assert.equal([...f.storage.rows.keys()].some(k => k.startsWith('session:')), false);
});
test('C6-08 Durable Object infrastructure failure retains exact-origin fixed-error CORS', async () => {
  const env = await environment();
  env.COACH_ADMISSION = { idFromName() { throw Error('synthetic infrastructure detail'); } };
  const res = await worker.fetch(request(), env);
  assert.equal(res.status, 503); assert.equal(res.headers.get('Access-Control-Allow-Origin'), env.APP_ORIGIN);
  assert.deepEqual(await res.json(), { ok: false, code: 'COACH_RELAY_UNAVAILABLE', nonce: null });
});
