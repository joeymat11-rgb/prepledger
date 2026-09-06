"use strict";
// Regenerate private inputs locally; emit verdicts only, never fixture contents.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../..'), conform = path.join(root, 'rebuild/conform');
const manifestPath = path.join(conform, 'oracle/manifest.json');
const committed = fs.readFileSync(manifestPath), manifest = JSON.parse(committed);
const publicPins = new Map(Object.values(manifest.goldens).filter(x => !x.path.startsWith('private/')).map(x => {
  const file = path.join(conform, x.path); return [file, fs.readFileSync(file)];
}));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
fs.mkdirSync(path.join(conform, 'private'), { recursive: true });
fs.writeFileSync(path.join(conform, 'private/live.json'), cp.execFileSync('git', ['show', 'fe516c1:ledger/state.json'], { cwd: root, maxBuffer: 16 * 1024 * 1024 }));
try {
  cp.execFileSync(process.execPath, [path.join(conform, 'oracle/port-oracle.cjs'), 'golden', path.join(conform, 'engines/engine-main.cjs'), 'main', 'fe516c1 (v7.56.0, frozen main)'],
    { cwd: root, env: { ...process.env, MEASURED_TEST_NOW: '2026-09-03', TZ: 'America/New_York' }, stdio: 'pipe' });
  for (const [file, expected] of publicPins) {
    const actual = JSON.parse(fs.readFileSync(file)), original = JSON.parse(expected);
    actual.stamp.engineSha256 = original.stamp.engineSha256;
    if (JSON.stringify(actual, null, 1) !== expected.toString()) throw new Error('Public golden differs beyond engine stamp');
  }
  const entry = manifest.goldens['live.main'], file = path.join(conform, entry.path);
  const privateGolden = JSON.parse(fs.readFileSync(file));
  privateGolden.stamp.engineSha256 = entry.engineSha256;
  const normalized = JSON.stringify(privateGolden, null, 1);
  if (sha(normalized) !== entry.goldenSha256) throw new Error('Private golden mismatch');
  fs.writeFileSync(file, normalized);
  const generated = JSON.parse(fs.readFileSync(manifestPath));
  for (const [id, value] of Object.entries(generated.goldens)) {
    value.engineSha256 = manifest.goldens[id].engineSha256;
    value.goldenSha256 = manifest.goldens[id].goldenSha256;
    value.path = value.path.replaceAll('\\', '/');
  }
  if (JSON.stringify(generated, null, 1) !== committed.toString()) throw new Error('Manifest differs beyond generated hashes/path separator');
  console.log('GOLDEN PREPARATION PASS public byte-identical after engine stamp normalization; private committed hash matches; manifest pins restored');
} finally {
  fs.writeFileSync(manifestPath, committed);
  for (const [file, bytes] of publicPins) fs.writeFileSync(file, bytes);
}
