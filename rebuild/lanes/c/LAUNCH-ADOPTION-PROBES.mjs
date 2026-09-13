// DECISIONS:199 evidence annex. Run with Node from any working directory.
// This is a jsdom/public-client held-read diagnostic, not browser kill proof.
// It uses only synthetic data in the existing test's encrypted fake-indexeddb.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const sourcePath = path.join(root, 'rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs');
const raw = fs.readFileSync(sourcePath, 'utf8');
const boundary = raw.indexOf('\ntest(');
assert(boundary > 0, 'the existing public test helpers must be identifiable');
const resolver = createRequire(sourcePath);
const prefix = raw.slice(0, boundary)
  .replace(/from (['"])([^'"]+)\1/g, (_, quote, value) => {
    const resolved = value.startsWith('node:') ? value : pathToFileURL(
      value.startsWith('.') ? path.resolve(path.dirname(sourcePath), value) : resolver.resolve(value)).href;
    return 'from ' + JSON.stringify(resolved);
  })
  .replaceAll('fileURLToPath(import.meta.url)', JSON.stringify(sourcePath));
const scratch = path.join(root, '.tmp');
fs.mkdirSync(scratch, { recursive: true });
const helper = path.join(scratch, `launch-adoption-public-helpers-${process.pid}.mjs`);
fs.writeFileSync(helper, prefix + '\nexport {device,waitFor,settingsOps,JSDOM,shell,mountGym};\n', { flag: 'wx' });

try {
  const H = await import(pathToFileURL(helper).href);
  const kit = await H.device();
  const view = await kit.model.read();
  assert.equal((await kit.settings.save({ exercise_id: view.lift.id,
    settings: [{ name: 'Seat', value: 'five' }] })).ok, true);
  const fault = kit.fault;
  kit.settings.close(); kit.gymHost.close();
  const reopened = await H.device({ fault });
  const before = (await H.settingsOps(reopened.settings.repository)).length;
  let release, entered = false;
  const held = new Promise(resolve => { release = resolve; });
  const settings = { ...reopened.settings, async latest(liftId) {
    const record = await reopened.settings.latest(liftId);
    entered = true; await held; return record;
  } };
  const dom = new H.JSDOM(H.shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const pairs = () => [...doc.querySelectorAll('#phone [data-slot="settings-list"] .row')]
    .map(row => [row.querySelector('strong').textContent, row.querySelector('span').textContent]);
  const ready = () => {
    const open = doc.querySelector('#phone [data-action="settings-open"]');
    return Boolean(open && !open.disabled);
  };
  try {
    await reopened.model.start();
    const mounted = H.mountGym(doc, doc.getElementById('phone'), {
      model: reopened.model, settings, onBack() {},
    });
    await mounted;
    await H.waitFor(() => entered, 'the actual saved-record read to be held');
    const visible = Boolean(doc.querySelector('#phone [data-slot="settings-block"]:not([hidden])'));
    assert.equal(visible, true, 'the original openCard visibility predicate is satisfied');
    assert.equal(ready(), false, 'the completion predicate remains false');
    assert.deepEqual(pairs(), []);
    assert.throws(() => assert.deepEqual(pairs(), [['Seat', 'five']], 'the narrow relaunch lost the record'),
      { code: 'ERR_ASSERTION' }, 'the original data assertion fails before the held real read returns');
    assert.equal(doc.querySelector('#phone [data-slot="log"]').disabled, false);
    console.log(JSON.stringify({ phase: 'actual reopened read held', originalPredicate: visible,
      completionPredicate: ready(), displayedPairs: pairs(), dataAssertion: 'fails', logEnabled: true }));
    release();
    await mounted.settings.read();
    assert.equal(ready(), true);
    assert.deepEqual(pairs(), [['Seat', 'five']], 'the unchanged assertion succeeds after the actual read completes');
    const after = (await H.settingsOps(reopened.settings.repository)).length;
    assert.equal(before, 1); assert.equal(after, before);
    console.log(JSON.stringify({ phase: 'actual reopened read released', completionPredicate: ready(),
      displayedPairs: pairs(), dataAssertion: 'passes', settingsOpsBefore: before, settingsOpsAfter: after }));
  } finally {
    release(); dom.window.close(); reopened.settings.close(); reopened.gymHost.close();
  }
} finally {
  fs.unlinkSync(helper);
}
