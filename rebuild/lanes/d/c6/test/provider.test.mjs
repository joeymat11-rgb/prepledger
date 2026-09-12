import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import {
  createLiveSession, LiveProviderError, COMPANION_POLICY, WAVE1_TOOL_TIERS,
  LIVE_ENDPOINT, MAX_SDP_BYTES,
} from '../provider.mjs';

// Fictional, deliberately non-credential fixtures. Every invocation injects
// fetch. No process environment, real accounts, audio, or provider is used.
const local = { apiKey: 'synthetic-test-only', projectId: 'proj_synthetic',
  sdpOffer: 'v=0\r\ns=synthetic offer\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n' };
const good = () => ({ session: { id: 'live_synthetic' },
  transport: { type: 'webrtc', sdp: 'v=0\r\ns=synthetic answer\r\n' } });
const reply = (data = good(), init = {}) => new Response(JSON.stringify(data), {
  status: 201, headers: { 'content-type': 'application/json' }, ...init,
});
const errorIs = (creation = 'unknown') => error => {
  assert.ok(error instanceof LiveProviderError);
  assert.equal(error.code, 'COACH_PROVIDER_UNAVAILABLE');
  assert.equal(error.message, 'Coach provider unavailable.');
  assert.equal(error.creation, creation);
  assert.equal(Object.hasOwn(error, 'cause'), false);
  assert.equal(Object.hasOwn(error, 'status'), false);
  assert.equal(JSON.stringify(error).includes(local.apiKey), false);
  assert.equal(JSON.stringify(error).includes('private-upstream-detail'), false);
  return true;
};

test('actual emitted request is exact Live SDP with fixed project and server policy', async () => {
  const abort = new AbortController();
  let count = 0, captured;
  const result = await createLiveSession({ ...local, signal: abort.signal,
    fetchImpl: async (url, init) => {
      count++;
      captured = { url, init };
      return reply();
    },
  });
  const { url, init } = captured;
  assert.equal(url, 'https://api.openai.com/v1/live/sessions');
  assert.equal(init.method, 'POST');
  assert.equal(init.redirect, 'manual');
  assert.equal(init.cache, 'no-store');
  assert.equal(init.signal, abort.signal);
  assert.deepEqual(init.headers, { Authorization: 'Bearer synthetic-test-only',
    'OpenAI-Project': 'proj_synthetic', 'Content-Type': 'application/json' });
  const body = JSON.parse(init.body);
  assert.deepEqual(Object.keys(body).sort(), ['session', 'transport']);
  assert.deepEqual(body.transport, { type: 'webrtc', sdp: local.sdpOffer });
  assert.equal(body.session.model, 'gpt-live-1');
  assert.equal(body.session.store, false);
  assert.deepEqual(body.session.delegation, { type: 'client' });
  assert.equal(Object.hasOwn(body.session, 'tools'), false);
  assert.deepEqual(body.session, COMPANION_POLICY.session);
  assert.deepEqual(body.session.client.data_channel.allowed_client_events,
    ['session.commentary.append', 'session.close']);
  assert.deepEqual(body.session.client.data_channel.allowed_server_events, [
    { type: 'session.started' }, { type: 'session.input_transcript.delta' },
    { type: 'session.output_transcript.delta' }, { type: 'session.delegation.created' },
    { type: 'session.commentary.appended' }, { type: 'session.usage.updated' },
    { type: 'session.closed' }, { type: 'error' }, { type: 'info' },
  ]);
  assert.doesNotMatch(init.body, /synthetic-test-only|proj_synthetic|confirmed/);
  assert.equal(count, 1);
  assert.deepEqual(result, { sessionId: 'live_synthetic', sdpAnswer: good().transport.sdp });
  assert.ok(Object.isFrozen(result));
});

test('policy matches the actual nineteen served wave-one tools and tiers', () => {
  const require = createRequire(import.meta.url);
  const { createCoachTools } = require('../../../../coach/tools.cjs');
  const { createWave1Tools } = require('../../../../coach/wave1-tools.cjs');
  const world = { today: { read() { throw new Error('unused synthetic read'); } } };
  const served = createWave1Tools({ world, coach: createCoachTools(world) });
  assert.equal(served.tools().length, 19);
  assert.deepEqual(Object.keys(WAVE1_TOOL_TIERS).sort(), served.tools().sort());
  assert.deepEqual({ ...WAVE1_TOOL_TIERS }, served.TIERS);
});

test('companion policy is recursively immutable and stable for admission hashing', () => {
  const encoded = JSON.stringify(COMPANION_POLICY);
  const digest = createHash('sha256').update(encoded).digest('hex');
  assert.throws(() => { COMPANION_POLICY.session.model = 'another-model'; }, TypeError);
  assert.throws(() => COMPANION_POLICY.session.client.data_channel.allowed_client_events.push('session.update'), TypeError);
  assert.throws(() => { COMPANION_POLICY.toolTiers.log_set = 0; }, TypeError);
  assert.equal(createHash('sha256').update(JSON.stringify(COMPANION_POLICY)).digest('hex'), digest);
  assert.equal(COMPANION_POLICY.phoneSafeguards.maxToolCallsPerTurn, 6);
  assert.equal(COMPANION_POLICY.phoneSafeguards.maxDraftsPerTurn, 1);
  assert.equal(COMPANION_POLICY.phoneSafeguards.sessionMinuteCap, 10);
});

test('reject caller-provided provider configuration before any attempt', async () => {
  for (const key of ['model', 'tools', 'session', 'backend', 'url', 'client', 'confirmed']) {
    let count = 0;
    await assert.rejects(createLiveSession({ ...local, [key]: 'untrusted',
      fetchImpl: async () => { count++; return reply(); } }), errorIs('not_attempted'));
    assert.equal(count, 0);
  }
});

test('invalid local credentials, project, SDP, signal and missing options do not fetch', async () => {
  const broken = [
    { apiKey: '' }, { apiKey: 'line\r\nheader' }, { apiKey: ' spaced' },
    { projectId: '' }, { projectId: 'a\nb' }, { sdpOffer: '' },
    { sdpOffer: ' ' }, { sdpOffer: {} }, { sdpOffer: 'x'.repeat(MAX_SDP_BYTES + 1) },
    { sdpOffer: '😀'.repeat(MAX_SDP_BYTES / 4 + 1) }, { signal: {} },
  ];
  for (const change of broken) {
    let count = 0;
    await assert.rejects(createLiveSession({ ...local, ...change,
      fetchImpl: async () => { count++; return reply(); } }), errorIs('not_attempted'));
    assert.equal(count, 0);
  }
  await assert.rejects(createLiveSession(), errorIs('not_attempted'));
});

test('a pre-aborted request never reaches fetch', async () => {
  const abort = new AbortController();
  abort.abort('private-upstream-detail');
  let count = 0;
  await assert.rejects(createLiveSession({ ...local, signal: abort.signal,
    fetchImpl: async () => { count++; return reply(); } }), errorIs('not_attempted'));
  assert.equal(count, 0);
});

test('network and timeout errors are fixed and never retried or assigned no-creation', async () => {
  for (const failure of [new Error('private-upstream-detail ' + local.apiKey),
    new DOMException('private-upstream-detail', 'AbortError'), 'private-upstream-detail']) {
    let count = 0;
    await assert.rejects(createLiveSession({ ...local, fetchImpl: async () => {
      count++; throw failure;
    } }), errorIs());
    assert.equal(count, 1);
  }
});

test('every non-201 HTTP result is ambiguous and its body is never inspected', async () => {
  for (const status of [200, 204, 301, 400, 401, 403, 409, 429, 500, 503]) {
    let read = 0;
    await assert.rejects(createLiveSession({ ...local, fetchImpl: async () => ({
      status, headers: new Headers({ 'content-type': 'application/json' }),
      body: { async cancel() {}, getReader() { read++; throw new Error('private-upstream-detail'); } },
    }) }), errorIs());
    assert.equal(read, 0);
  }
});

test('redirects and substituted response URLs cannot deliver SDP', async () => {
  for (const props of [{ redirected: true }, { url: 'https://other.invalid/session' }]) {
    const response = reply();
    for (const [key, value] of Object.entries(props)) Object.defineProperty(response, key, { value });
    await assert.rejects(createLiveSession({ ...local, fetchImpl: async () => response }), errorIs());
  }
});

test('non-JSON successful responses are refused without surfacing their body', async () => {
  for (const type of ['text/html', 'text/plain', 'application/jsonp', '']) {
    await assert.rejects(createLiveSession({ ...local, fetchImpl: async () =>
      new Response('private-upstream-detail', { status: 201, headers: { 'content-type': type } }) }), errorIs());
  }
});

test('accept only the closed provider reply with valid id and bounded SDP', async () => {
  const cases = [null, [], {}, { ...good(), extra: true },
    { ...good(), session: { id: 'live_synthetic', key: 'private-upstream-detail' } },
    { ...good(), session: { id: '' } }, { ...good(), session: { id: 'a\nb' } },
    { ...good(), session: { id: {} } }, { ...good(), session: { id: 'x'.repeat(1025) } },
    { ...good(), transport: { type: 'websocket', sdp: 'answer' } },
    { ...good(), transport: { type: 'webrtc', sdp: '' } },
    { ...good(), transport: { type: 'webrtc', sdp: 'x\u0000y' } },
    { ...good(), transport: { type: 'webrtc', sdp: 'x'.repeat(MAX_SDP_BYTES + 1) } },
    { ...good(), transport: { type: 'webrtc', sdp: '😀'.repeat(MAX_SDP_BYTES / 4 + 1) } },
    { ...good(), transport: { type: 'webrtc', sdp: 'answer', config: {} } },
  ];
  for (const data of cases) await assert.rejects(createLiveSession({ ...local,
    fetchImpl: async () => reply(data) }), errorIs());
});

test('reject duplicate provider keys including escaped duplicate spellings', async () => {
  for (const raw of [
    '{"session":{"id":"first","id":"second"},"transport":{"type":"webrtc","sdp":"answer"}}',
    '{"session":{"id":"first","i\\u0064":"second"},"transport":{"type":"webrtc","sdp":"answer"}}',
    '{"session":{"id":"first"},"session":{"id":"second"},"transport":{"type":"webrtc","sdp":"answer"}}',
  ]) await assert.rejects(createLiveSession({ ...local, fetchImpl: async () =>
    new Response(raw, { status: 201, headers: { 'content-type': 'application/json' } }) }), errorIs());
});

test('SDP quotes and key-like text are data, and opaque id prefixes are preserved', async () => {
  const data = good();
  data.session.id = 'future_prefix_opaque';
  data.transport.sdp += 'a=x-test:"id":"quoted value"\r\n';
  const result = await createLiveSession({ ...local, fetchImpl: async () => reply(data) });
  assert.equal(result.sessionId, data.session.id);
  assert.equal(result.sdpAnswer, data.transport.sdp);
});

test('broken JSON and invalid UTF-8 are fixed ambiguous failures', async () => {
  for (const body of ['{"session":', new Uint8Array([0xff, 0xfe])]) {
    await assert.rejects(createLiveSession({ ...local, fetchImpl: async () =>
      new Response(body, { status: 201, headers: { 'content-type': 'application/json' } }) }), errorIs());
  }
});

test('an oversized upstream stream is cancelled before it can grow without bound', async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(262_145)); },
    cancel() { cancelled = true; },
  });
  await assert.rejects(createLiveSession({ ...local, fetchImpl: async () =>
    new Response(stream, { status: 201, headers: { 'content-type': 'application/json' } }) }), errorIs());
  assert.equal(cancelled, true);
});

test('a failing upstream read is not retried and leaks no upstream reason', async () => {
  const stream = new ReadableStream({ pull() { throw new Error('private-upstream-detail'); } });
  let count = 0;
  await assert.rejects(createLiveSession({ ...local, fetchImpl: async () => {
    count++;
    return new Response(stream, { status: 201, headers: { 'content-type': 'application/json' } });
  } }), errorIs());
  assert.equal(count, 1);
});

test('boundary SDP byte length is admitted and separate calls retain the policy', async () => {
  const before = JSON.stringify(COMPANION_POLICY);
  for (let iteration = 0; iteration < 2; iteration++) {
    const data = good();
    data.transport.sdp = 'x'.repeat(MAX_SDP_BYTES);
    const result = await createLiveSession({ ...local, sdpOffer: 'x'.repeat(MAX_SDP_BYTES),
      fetchImpl: async (url, init) => {
        assert.equal(url, LIVE_ENDPOINT);
        const body = JSON.parse(init.body);
        assert.equal(body.transport.sdp.length, MAX_SDP_BYTES);
        body.session.client.data_channel.allowed_client_events.push('session.update');
        return reply(data);
      } });
    assert.equal(result.sdpAnswer.length, MAX_SDP_BYTES);
  }
  assert.equal(JSON.stringify(COMPANION_POLICY), before);
});
