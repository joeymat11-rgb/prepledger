import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('..', import.meta.url));
const tmp = path.join(here, '.tmp');
fs.mkdirSync(tmp, { recursive: true });
process.env.TMP = tmp; process.env.TEMP = tmp;
const { Miniflare, createFetchMock, Log, LogLevel } = await import('miniflare');

async function providerRuntime(mock) {
  const run = fs.mkdtempSync(path.join(tmp, 'provider-runtime-'));
  const scriptPath = path.join(run, 'worker.mjs');
  fs.writeFileSync(scriptPath, `
    import { createLiveSession } from '../../provider.mjs';
    export default {
      async fetch() {
        try {
          const value = await createLiveSession({
            apiKey: 'synthetic-test-only', projectId: 'synthetic-project',
            sdpOffer: 'v=0\\r\\ns=SYNTHETIC OFFER\\r\\n',
            signal: AbortSignal.timeout(20000)
          });
          return Response.json(value);
        } catch (error) {
          return Response.json({code:error.code, message:error.message, creation:error.creation}, {status:503});
        }
      }
    };
  `);
  return new Miniflare({ modules: true, scriptPath, rootPath: here,
    defaultPersistRoot: path.join(run, 'state'),
    compatibilityDate: '2026-07-30', port: 0, fetchMock: mock,
    log: new Log(LogLevel.NONE) });
}

test('actual Workerd default provider fetch reaches mocked Live endpoint', { timeout: 30000 }, async () => {
  const mock = createFetchMock(); mock.disableNetConnect();
  mock.get('https://api.openai.com').intercept({ path: '/v1/live/sessions', method: 'POST' })
  .reply(201, JSON.stringify({ session: { id: 'live_runtime_synthetic' },
    transport: { type: 'webrtc', sdp: 'v=0\r\ns=SYNTHETIC ANSWER\r\n' } }),
  { headers: { 'Content-Type': 'application/json' } });
  const mf = await providerRuntime(mock);
  try {
    const response = await mf.dispatchFetch('https://provider-probe.invalid/');
    assert.equal(response.status, 200, JSON.stringify({
      pending: mock.pendingInterceptors().length,
      response: await response.clone().json(),
    }));
    assert.deepEqual(await response.json(), { sessionId: 'live_runtime_synthetic',
      sdpAnswer: 'v=0\r\ns=SYNTHETIC ANSWER\r\n' });
    mock.assertNoPendingInterceptors();
  } finally { await mf.dispose(); await mock.close(); }
});

test('Workerd provider refuses 302 without following or sending its key onward', { timeout: 30000 }, async () => {
  const mock = createFetchMock(); mock.disableNetConnect();
  mock.get('https://api.openai.com').intercept({ path: '/v1/live/sessions', method: 'POST' })
    .reply(302, 'private-upstream-detail', { headers: { Location: 'https://redirect.invalid/steal' } });
  // If a follow occurs, this sentinel interceptor is consumed even if later
  // response validation hides the mistake. No real destination is reachable.
  mock.get('https://redirect.invalid').intercept({ path: '/steal' })
    .reply(201, '{}', { headers: { 'Content-Type': 'application/json' } });
  const mf = await providerRuntime(mock);
  try {
    const response = await mf.dispatchFetch('https://provider-probe.invalid/');
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { code: 'COACH_PROVIDER_UNAVAILABLE',
      message: 'Coach provider unavailable.', creation: 'unknown' });
    const pending = mock.pendingInterceptors();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].origin, 'https://redirect.invalid');
  } finally { await mf.dispose(); await mock.close(); }
});
