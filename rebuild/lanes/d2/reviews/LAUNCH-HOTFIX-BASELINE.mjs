// Independent reviewer witness. Build the exact pre-fix baseline immediately before this probe.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const require = createRequire(path.join(root, 'rebuild/m3/w6/package.json'));
const { chromium } = require('playwright-core');
const { startServer } = await import(pathToFileURL(path.join(root, 'rebuild/m3/w7-preview/today/serve.mjs')));
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const bytes = await readFile(path.join(root, '.tmp/w7-today-dist/app.js'));
const digest = createHash('sha256').update(bytes).digest('hex');
const server = await startServer({ port: 0 });
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.W7_BROWSER_BIN, headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const errorPromise = page.waitForEvent('pageerror', { timeout: 10000 });
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'load' });
  await errorPromise;
  assert(errors.some(message => message === '__dirname is not defined'), 'Fresh browser must reproduce the reported unguarded global failure');
  const globals = await page.evaluate(() => ({ dirname: typeof __dirname, require: typeof require, process: typeof process }));
  assert.deepEqual(globals, { dirname: 'undefined', require: 'undefined', process: 'undefined' });
  console.log(JSON.stringify({ case: 'HOTFIX-BASELINE', result: 'REPRODUCED', head, bundleSha256: digest, pageErrors: errors, globals }));
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
