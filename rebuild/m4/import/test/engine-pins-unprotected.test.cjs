'use strict';
/* S10 (D-S10I-5, REVIEW-S10-INTEGRATION-l1): the producer-mapping engine pins, re-measured
   WITHOUT READING A PROTECTED ENGINE FILE. engine-provider.test.cjs:136-154
   (S3-PROVIDER-ENGINE-PINS) holds the same equality for three files, but merge.cjs is one
   of them, so that cell cannot run where the protected five may not be read. This cell
   holds the SAME two equalities for the two unprotected files of that list, today.cjs and
   engine-runtime.cjs, and reads nothing else under rebuild/engine/: SOURCE_PINS[f] equals
   the sha256 of the bytes on disk, and so does the portable source manifest. It REPLACES
   NOTHING: S3-PROVIDER-ENGINE-PINS stays the full cell, merge.cjs included, in CI.
   It is the red-first proof of S10's today.cjs re-pin (DECISIONS:792): against the S9 pin
   685f6e1e and the composed EPP engine it is red; at b4ebee3c it is green. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '../../../..');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const UNPROTECTED = ['rebuild/engine/today.cjs', 'rebuild/m4/workout/engine-runtime.cjs'];
const PROTECTED = /(^|\/)rebuild\/engine\/(seed|migrate|merge|index|oracle-shim)\.cjs$/;

test('S10 ENGINE-PINS-UNPROTECTED: today.cjs and engine-runtime.cjs are pinned at their bytes on disk, in SOURCE_PINS and in the portable manifest', () => {
  const { SOURCE_PINS } = require('../local-source-profile.cjs');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'rebuild/m4/import/test/s3/s3-portable-sources.json'), 'utf8'));
  const pinned = new Map(manifest.sources.map(e => [e.path, e.sha256]));
  for (const name of UNPROTECTED) {
    assert.equal(PROTECTED.test(name), false, 'this cell never reads a protected engine file: ' + name);
    const bytes = fs.readFileSync(path.join(root, name)), actual = sha(bytes);
    assert.equal(SOURCE_PINS[name], actual, 'Producer mapping pin is re-qualified at the bytes on disk: ' + name);
    assert.equal(pinned.get(name), actual, 'Portable source manifest agrees with the same bytes: ' + name);
    assert.notEqual(sha(Buffer.concat([bytes, Buffer.from('\n')])), actual, 'A mutated byte is a different source: ' + name);
  }
});
