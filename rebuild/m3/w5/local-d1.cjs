"use strict";
// Local harness only. No account, credential, remote endpoint or network fetch.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const { createRequire } = require('node:module');
const wrangler = createRequire(require.resolve('wrangler/package.json'));
if (wrangler('./package.json').version !== '4.129.0') throw new Error('Wrangler 4.129.0 required');
const { Miniflare, Log, LogLevel, convertV4MiniflareOptions } = wrangler('miniflare');
async function createLocalD1(options = {}) {
  const directory = options.directory || fs.mkdtempSync(path.join(os.tmpdir(), 'earned-w5-d1-'));
  const mf = new Miniflare(await convertV4MiniflareOptions({ modules: true, script: 'export default {fetch(){return new Response("local D1");}}',
    compatibilityDate: '2026-09-03', d1Databases: { DB: 'earned-w5-local' },
    resourcePersistencePath: directory, log: new Log(LogLevel.ERROR), telemetry: { enabled: false }, cf: false }));
  const db = await mf.getD1Database('DB');
  const sql = fs.readFileSync(path.join(__dirname, 'migrations/0001_authority.sql'), 'utf8').replace(/--[^\n]*/g, '');
  const statements = sql.split(';').map(s => s.trim()).filter(Boolean).map(s => db.prepare(s));
  await db.batch(statements);
  let closed = false;
  const close = () => { if (closed) return Promise.resolve(); closed = true; return mf.dispose(); };
  return { db, directory, close, dispose: close };
}
module.exports = { createLocalD1 };
