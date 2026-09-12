import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { environment, request, body } from './support.mjs';
const here = fileURLToPath(new URL('..', import.meta.url));
const tmp = path.resolve(here, '../../../../.tmp');
fs.mkdirSync(tmp, { recursive: true });
// Keep the emulator's transient files inside the lane's own worktree too.
process.env.TMP = tmp; process.env.TEMP = tmp;
const { Miniflare, createFetchMock, Log, LogLevel } = await import('miniflare');

test('C6 local Workerd + SQLite executes actual Worker/provider, durable concurrent replay and restart', { timeout: 60000 }, async () => {
  const run = fs.mkdtempSync(path.join(tmp, 'c6-runtime-'));
  const mock = createFetchMock(); mock.disableNetConnect();
  mock.get('https://api.openai.com').intercept({ path: '/v1/live/sessions', method: 'POST' })
    .reply(201, JSON.stringify({ session: { id: 'live_synthetic' }, transport: { type: 'webrtc', sdp: 'v=0\r\ns=SYNTHETIC ANSWER\r\n' } }), { headers: { 'Content-Type': 'application/json' } });
  const env = await environment(Date.now());
  const options = { modules: true, scriptPath: path.join(here, 'worker.mjs'), rootPath: here,
    compatibilityDate: '2026-07-30', port: 0, bindings: env, fetchMock: mock,
    durableObjects: { COACH_ADMISSION: { className: 'CoachAdmission', useSQLite: true } },
    durableObjectsPersist: path.join(run, 'state'), log: new Log(LogLevel.NONE) };
  let mf = new Miniflare(options);
  const input = body(); input.opt_in.accepted_at = new Date(Date.now() - 1000).toISOString();
  const invoke = async () => {
    const r = request(input);
    return mf.dispatchFetch(r.url, { method: r.method, headers: Object.fromEntries(r.headers), body: await r.text() });
  };
  try {
    const results = await Promise.all(Array.from({ length: 6 }, invoke));
    assert.equal(results.filter(r => r.status === 200).length, 1,
      JSON.stringify({ pending: mock.pendingInterceptors().length, responses: await Promise.all(results.map(async r => ({ status: r.status, code: (await r.clone().json()).code }))) }));
    for (const r of results.filter(r => r.status !== 200)) assert.equal((await r.json()).code, 'COACH_SESSION_REQUEST_REPLAYED');
    const accepted = await results.find(r => r.status === 200).json();
    assert.equal(accepted.session_minute_cap, 10); assert.equal(accepted.session_id, 'live_synthetic');
    mock.assertNoPendingInterceptors();
    await mf.dispose(); mf = new Miniflare(options);
    const replay = await invoke(); assert.equal(replay.status, 409);
    assert.equal((await replay.json()).code, 'COACH_SESSION_REQUEST_REPLAYED');
  } finally { await mf.dispose(); await mock.close(); }
});

test('C6 checked-in configuration has no origin, cap, companion receipt or public route', async () => {
  const config = JSON.parse(fs.readFileSync(path.join(here, 'wrangler.jsonc'), 'utf8'));
  assert.equal(config.workers_dev, false); assert.equal(config.preview_urls, false);
  assert.equal(config.observability.enabled, false); assert.equal(config.vars.APP_ORIGIN, '');
  assert.equal(JSON.parse(config.vars.CAP_VERIFICATION_JSON), null);
  assert.equal(JSON.parse(config.vars.COMPANION_REVIEW_JSON), null);
  assert.equal(Object.hasOwn(config.vars, 'OPENAI_API_KEY'), false);
  assert.equal(Object.hasOwn(config.vars, 'PHONE_CREDENTIALS_JSON'), false);
});
