import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {fixture} from '../support.mjs';
import {parseStrictJson} from '../../strict-json.mjs';
const id = 'synthetic-source-A', encode = value => new TextEncoder().encode(value);
const custody = repo => repo.importCustody({parseStrictJson, validateContext: () => null});
test('actual M4 preparation persists exact preimages and its separate candidate through W6 custody', async () => {
  assert(process.env.IMPORT_M4_DIR, 'Provide retained IMPORT_M4_DIR');
  const require = createRequire(import.meta.url), root = process.env.IMPORT_M4_DIR;
  const {createImportPreparation} = require(resolve(root, 'rebuild/m4/import/prepare.cjs'));
  const {createEngine} = require(resolve(root, 'rebuild/engine/index.cjs'));
  const F = require(resolve(root, 'rebuild/m3/w7-preview/fixtures.cjs'));
  const sourceBytes = encode(JSON.stringify(F.createSyntheticState(), null, 2) + '\r\n');
  const engine = createEngine({clock: {today: () => F.SYNTHETIC_DAY, nowISO: () => F.SYNTHETIC_DAY + 'T12:00:00.000Z', hour: () => 12},
    ids: {fresh: p => p + 'synthetic'}});
  const prepared = createImportPreparation({engine, parseStrictJson}).prepare(sourceBytes, {localBytes: sourceBytes});
  const f = await fixture(); await f.seed(); const before = await f.repo.load(), c = custody(f.repo);
  await c.stage(id, before, {sourceBytes: prepared.sourceBytes(), candidateBytes: prepared.candidateBytes(),
    localBytes: prepared.localBytes(), engineContextJson: JSON.stringify({build: 'synthetic-installed-engine', clock: F.SYNTHETIC_DAY})});
  f.repo.close(); const fresh = await f.fresh(), out = await custody(fresh.repository).load(id);
  assert.deepEqual(out.sourceBytes, new Uint8Array(prepared.sourceBytes()));
  assert.deepEqual(out.localBytes, new Uint8Array(prepared.localBytes()));
  assert.deepEqual(out.candidateBytes, new Uint8Array(prepared.candidateBytes()));
  assert.deepEqual(out.checkpoint, before); assert.equal(out.activation, 'pending');
  fresh.repository.close();
});
