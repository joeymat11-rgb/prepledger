
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const native = require(process.env.SLOT_LOADER).load();
const d = JSON.parse(process.env.SLOT_DESCRIPTOR);
test('independent declared contender', () => {
  fs.writeFileSync(process.env.SLOT_TRACE, JSON.stringify({ pid: process.pid, parentPid: process.ppid }) + '\n', { flag: 'wx' });
  const h = native.attach(d.name, d.nonce, d.ownerPid, d.version, d.bytes);
  for (const event of [1, 2, 3, 4]) assert.equal(native.advance(h, event), h);
});
