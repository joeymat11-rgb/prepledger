/* THE COPY LOCK'S RE-MEASURE TOOL. Not a test and never run by CI.
 *
 *   node rebuild/m3/w7-preview/today/test/copy-lock-measure.mjs            prints the summary
 *   node rebuild/m3/w7-preview/today/test/copy-lock-measure.mjs --write    rewrites the corpus
 *
 * The corpus it writes is SEALED product. Writing it is the price of a legitimate copy
 * change (answer 5): the new corpus bytes, the corpus sha256 literal in copy-lock.test.mjs,
 * a reseal child that declares both, and an independent review of the entry diff. A run of
 * this tool is therefore never evidence that the lock holds; copy-lock.test.mjs is. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { driveGymStates, STATE_IDS } from './copy-lock-states.mjs';

const require = createRequire(import.meta.url);
const lock = require('./copy-lock.cjs');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const CORPUS = path.join(HERE, 'copy-lock.corpus.json');

// Harnesses and build tools under the scan roots: their words never reach a screen, so they
// are not measured (a sentence moved INTO one still leaves its owner short and is refused).
// Exact paths, never a pattern: a new file of any name is scanned.
const TOOLS = Object.freeze([
  'rebuild/m3/w7-preview/today/browser-check.mjs',
  'rebuild/m3/w7-preview/today/build.mjs',
  'rebuild/m3/w7-preview/today/checkin-check.mjs',
  'rebuild/m3/w7-preview/today/dash-check.mjs',
  'rebuild/m3/w7-preview/today/food-check.mjs',
  'rebuild/m3/w7-preview/today/gym-check.mjs',
  'rebuild/m3/w7-preview/today/machine-settings-check.mjs',
  'rebuild/m3/w7-preview/today/serve.mjs',
  'rebuild/m3/w7-preview/today/setup-check.mjs',
  'rebuild/m3/w7-preview/today/sleep-check.mjs',
  'rebuild/slice/pwa/browser-offline-check.mjs',
  'rebuild/slice/pwa/build-pwa.mjs',
  'rebuild/slice/pwa/serve-pwa.mjs',
]);

const measured = lock.measure(ROOT, { tools: TOOLS });
const driven = await driveGymStates();
if (driven.opsAdded !== 1) throw new Error('COPY-LOCK-MEASURE N2 durable write count ' + driven.opsAdded);
const states = {};
for (const id of STATE_IDS) {
  const s = driven.states[id];
  if (!s) throw new Error('COPY-LOCK-MEASURE state not reached ' + id);
  states[id] = { error: s.error, texts: [...s.texts].sort() };
}
const pieces = measured.entries.map((e) => e.text);
const { FIXTURE_VALUES } = await import('./copy-lock-states.mjs');
for (const [id, s] of Object.entries(states)) {
  for (const t of s.texts) {
    const rest = lock.uncovered(t, pieces, FIXTURE_VALUES);
    if (rest) throw new Error('COPY-LOCK-MEASURE ' + id + ' shows unlocked words: ' + JSON.stringify(t) + ' at ' + JSON.stringify(rest));
  }
}
const corpus = {
  schema: lock.SCHEMA,
  note: 'S10 copy lock corpus. Sealed. Rewritten only by copy-lock-measure.mjs --write inside a reseal child; see rebuild/lanes/c/COPY-LOCK.md.',
  scanRoots: lock.SCAN_ROOTS,
  tools: TOOLS,
  scanned: measured.files,
  states,
  entries: measured.entries,
};
// ASCII-escape the two dashes a few measured diagnostics carry, so the corpus file itself
// holds no U+2013 / U+2014 (DECISIONS:114 (1)); JSON.parse returns the same strings.
const DASHES = new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']', 'g');
const bytes = JSON.stringify(corpus, null, 1).replace(DASHES, (c) => '\\u' + c.charCodeAt(0).toString(16)) + '\n';
console.log('COPY-LOCK-MEASURE scanned ' + measured.files.length + ' files, ' + measured.entries.length + ' locked pieces, '
  + measured.entries.filter((e) => e.lists.length).length + ' declared in design.cjs lists, ' + STATE_IDS.length + ' mounted states');
console.log('COPY-LOCK-MEASURE N2 error ' + JSON.stringify(states['GYM-SETTINGS-N2'].error) + ' ops added ' + driven.opsAdded);
console.log('COPY-LOCK-MEASURE corpus sha256 ' + lock.sha256(Buffer.from(bytes, 'utf8')));
if (process.argv.includes('--write')) { fs.writeFileSync(CORPUS, bytes); console.log('COPY-LOCK-MEASURE WROTE ' + path.relative(ROOT, CORPUS).split(path.sep).join('/')); }
