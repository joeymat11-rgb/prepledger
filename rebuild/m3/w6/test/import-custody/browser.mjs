import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {chromium} from 'playwright-core';
import {initial, config, createT2Stage} from '../support.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const executablePath = process.env.W6_BROWSER_BIN;
assert(executablePath && fs.existsSync(executablePath), 'Explicit installed Chrome required');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-import-custody-browser-'));
const allowed = new Set(['repository.mjs', 'import-custody.mjs', 'recovery-stage.mjs', 'strict-json.mjs']);
const server = http.createServer((req, res) => {
  const name = req.url.slice(1);
  if (allowed.has(name)) { res.writeHead(200, {'Content-Type': 'text/javascript', 'Cache-Control': 'no-store'}); res.end(fs.readFileSync(path.join(root, name))); }
  else if (req.url === '/') { res.writeHead(200, {'Content-Type': 'text/html', 'Cache-Control': 'no-store'}); res.end('<!doctype html><title>Synthetic import custody test</title>'); }
  else { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port, rawKey = Array.from(randomBytes(32));
const stage = createT2Stage(config), before = initial();
// Match the repository's existing JSON storage boundary, including plain maps.
const stored = value => JSON.parse(JSON.stringify(value));
const one = stored(stage(before, 'weighIn', {date: '2026-09-04', lb: 170}).generation);
const two = stored(stage(one, 'weighIn', {date: '2026-09-04', lb: 171}).generation);
const three = stored(stage(two, 'weighIn', {date: '2026-09-04', lb: 172}).generation);
const source = ' {"v":60,"note":"SYNTHETIC café e\u0301"}\r\n';
let context, checks = 0;
async function launch() {
  context = await chromium.launchPersistentContext(profile, {executablePath, headless: true});
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage(); await page.goto(origin);
  await page.evaluate(async ({rawKey, source}) => {
    const {openRepository} = await import('/repository.mjs'), {parseStrictJson} = await import('/strict-json.mjs');
    const key = await crypto.subtle.importKey('raw', new Uint8Array(rawKey), {name: 'AES-GCM'}, false, ['encrypt', 'decrypt']);
    window.repo = await openRepository({databaseName: 'synthetic-import', namespace: 'synthetic/athlete-A',
      keyProvider: () => key, authorizeEnrollment: () => true});
    window.custody = repo.importCustody({parseStrictJson, validateContext: () => null});
    window.input = {sourceBytes: new TextEncoder().encode(source), candidateBytes: new TextEncoder().encode('{"v":60}'),
      localBytes: null, engineContextJson: '{"build":"synthetic"}'};
  }, {rawKey, source});
  return page;
}
try {
  let page = await launch();
  await page.evaluate(async one => { await repo.initialize(one, {}); window.original = await repo.load(); }, one);
  const result = await page.evaluate(async () => custody.stage('synthetic-source', original, input));
  assert.equal(result.activation, 'pending'); checks++;
  const original = await page.evaluate(async () => (await custody.load('synthetic-source')).checkpoint);
  assert.deepEqual(original.generation, one); checks++;
  assert.deepEqual(await page.evaluate(async () => repo.load()), original); checks++;
  await page.evaluate(async ({two, three}) => {
    await repo.commit(await repo.load(), two, () => null);
    await repo.commit(await repo.load(), three, () => null);
  }, {two, three});
  assert.deepEqual(await page.evaluate(async () => (await custody.load('synthetic-source')).checkpoint), original); checks++;
  const later = await page.evaluate(async () => repo.load());
  assert.deepEqual(later.generation, three); checks++;
  await context.close(); context = null; page = await launch();
  const reopened = await page.evaluate(async () => {
    const out = await custody.load('synthetic-source');
    return {checkpoint: out.checkpoint, source: new TextDecoder().decode(out.sourceBytes), activation: out.activation};
  });
  assert.deepEqual(reopened.checkpoint, original); checks++;
  assert.equal(reopened.source, source); checks++;
  assert.equal(reopened.activation, 'pending'); checks++;
  assert.deepEqual(await page.evaluate(async () => repo.load()), later); checks++;
  assert.equal(Object.keys(later.generation.collections.outbox).length, 3); checks++;
  assert.equal(await page.evaluate(async original => {
    try { await custody.stage('synthetic-source', original, {...input, candidateBytes: new TextEncoder().encode('{}')}); return null; }
    catch (e) { return e.code; }
  }, original), 'IMPORT_CUSTODY_ID_CONFLICT'); checks++;
  const receipt = {checks, browser: context.browser().version(), source: 'synthetic-only',
    retainedAfterLaterCommits: true, retainedAfterRelaunch: true, activation: 'pending'};
  fs.writeFileSync(path.join(profile, 'evidence.json'), JSON.stringify(receipt, null, 2), {flag: 'wx'});
  console.log('IMPORT CUSTODY native Chrome: ' + checks + ' checks PASS; activation pending');
  console.log('Evidence: ' + path.join(profile, 'evidence.json'));
} finally {
  if (context) await context.close();
  await new Promise(resolve => server.close(resolve));
}
