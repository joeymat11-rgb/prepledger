// PUBLIC GRAPH PROOF ONLY: existing W6 browser builder, actual companion entry.
// No browser execution, enrollment, account, network, native or phone claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildBrowser } from '../../../m3/w6/build-browser.mjs';

const root = fileURLToPath(new URL('../../../..', import.meta.url));
const boundary = new URL('../../../m3/w6/build-browser.mjs', import.meta.url);
const entry = fileURLToPath(new URL('../../../m3/w6/host/plan-edit-host.mjs', import.meta.url));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
async function scratch() {
  await mkdir(join(root, '.tmp'), { recursive: true });
  return mkdtemp(join(root, '.tmp', 'plan-edit-browser-'));
}

test('PE-build actual plan-edit host builds with the unchanged browser crypto boundary', async () => {
  const before = digest(await readFile(boundary)), out = await scratch();
  const built = await buildBrowser({ entryPoints: [entry], outfile: join(out, 'plan-edit-host.js') });
  const inputs = new Set(built.inventory.map(x => x.path));
  for (const path of [
    'rebuild/m3/w6/host/plan-edit-host.mjs',
    'rebuild/m4/workout/plan-edit-commands.cjs',
    'rebuild/m4/workout/plan-edit-model.cjs',
    'rebuild/m3/w6/public-client.mjs',
    'rebuild/m3/w6/node-sha256-browser.mjs',
  ]) assert(inputs.has(path), 'actual runtime must be in browser graph: ' + path);
  assert(built.inventory.every(x => /^[a-f0-9]{64}$/.test(x.sha256)), 'builder pins actual input bytes');
  const { metafile } = JSON.parse(await readFile(built.outfile + '.meta.json', 'utf8'));
  const output = Object.values(metafile.outputs).find(x => resolve(root, x.entryPoint || '') === entry);
  assert(output, 'host is the actual browser entry');
  assert(output.exports.includes('createPlanEditHost'), 'host export survives the build');
  assert.equal(digest(await readFile(boundary)), before, 'proof must not widen browser import permissions');
});

test('PE-build a new Node crypto importer is refused by the same browser boundary', async () => {
  const before = digest(await readFile(boundary)), out = await scratch(), unsafeEntry = join(out, 'new-importer.mjs');
  await writeFile(unsafeEntry, "export { createHash } from 'node:crypto';\n");
  await assert.rejects(buildBrowser({ entryPoints: [unsafeEntry], outfile: join(out, 'refused.js') }),
    error => error.errors?.some(item => item.text === 'Unapproved browser Node import node:crypto'),
    'a passing host graph must not result from broadly enabling Node crypto');
  assert.equal(digest(await readFile(boundary)), before, 'negative control leaves the boundary unchanged');
});
