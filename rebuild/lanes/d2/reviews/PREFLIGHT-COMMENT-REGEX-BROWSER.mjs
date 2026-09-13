import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.resolve('rebuild/m3/w6/package.json'));
const { chromium } = require('playwright-core');
const cases = [
  ['script-closing-attribute', '<script>/* comment </script data-x><p>—</p> */</script>'],
  ['style-closing-attribute', '<style>/* comment </style data-x><p>—</p> */</style>'],
  ['style-closing-solidus', '<style>/* comment </style/><p>—</p> */</style>'],
];
const browser = await chromium.launch({ executablePath: process.env.W7_BROWSER_BIN, headless: true });
const results = [];
try {
  for (const [name, html] of cases) {
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.name));
    await page.setContent(html, { waitUntil: 'load' });
    assert.equal(await page.locator('p').innerText(), '—');
    assert.equal(await page.locator('p').isVisible(), true);
    results.push({ name, renderedDashVisible: true, pageErrors: errors });
    await page.close();
  }
  console.log(JSON.stringify({ case: 'D2-PREFLIGHT-HTML-BROWSER', observations: results.length, results }));
} finally { await browser.close(); }
