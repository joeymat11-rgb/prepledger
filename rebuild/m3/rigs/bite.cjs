"use strict";
// Required bridge-only bite. Never edits a law or the accepted authority core.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), crypto = require('node:crypto');
const directory = path.resolve(__dirname, '../w5'), filename = path.join(directory, 'crypto.cjs');
const { buildCore } = require('../w5/build.cjs');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function run() {
  const original = fs.readFileSync(filename), before = sha(original);
  const anchor = 'function verifyRecord(record, key, domain, field = "authority_signature") {';
  if (original.toString().split(anchor).length !== 2) throw new Error('Bite anchor must match exactly once');
  let red;
  try {
    fs.writeFileSync(filename, original.toString().replace(anchor, anchor + '\n  return true; // disposable W5 verification bite'));
    await buildCore();
    const result = cp.spawnSync(process.execPath, [path.join(__dirname, 'run.cjs'), '--env', 'local'],
      { cwd: path.resolve(directory, '../../..'), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    fs.writeFileSync(path.join(directory, 'bite-red.log'), result.stdout || '');
    red = (result.stdout || '').split(/\r?\n/).filter(line => /^(AUTH-D1 FAIL|HTTP-190 FAIL|run.cjs SUMMARY)/.test(line));
    if (result.status !== 1 || !red.some(line => line.startsWith('AUTH-D1 FAIL')) || !red.some(line => line.startsWith('HTTP-190 FAIL')))
      throw new Error('Both AUTH-D1 and HTTP-190 must go RED under the verification bite');
    red.forEach(line => console.log(line));
  } finally {
    fs.writeFileSync(filename, original);
    await buildCore();
    if (sha(fs.readFileSync(filename)) !== before) throw new Error('Bite restoration mismatch');
    console.log('BITE RESTORED sha256=' + before);
  }
  return { ok: true, red, restored: before };
}
module.exports = { run };
if (require.main === module) run().catch(error => { console.error('BITE FAIL ' + error.message); process.exitCode = 1; });
