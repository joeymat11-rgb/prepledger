
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { load } = require(process.env.SLOT_LOADER);
const d = JSON.parse(process.env.SLOT_DESCRIPTOR);
const config = JSON.parse(process.env.SLOT_CONFIG);
const native = load();
test('invented native-slot writer', () => {
  fs.writeFileSync(process.env.SLOT_TRACE, JSON.stringify({ pid: process.pid, parentPid: process.ppid,
    ownerPid: d.ownerPid, mode: config.mode }) + '\n', { flag: 'wx' });
  const args = [d.name, d.nonce, d.ownerPid, d.version, d.bytes];
  if (config.mode === 'attach-fails') {
    assert.throws(() => native.attach(...args), { code: config.error });
    return;
  }
  if (config.mode === 'local-control') {
    const local = new Int32Array(new ArrayBuffer(4));
    for (const event of [1, 2, 3, 4]) local[0] = event;
    assert.equal(local[0], 4);
    fs.writeFileSync(process.env.SLOT_DIAGNOSTIC, 'complete\n');
    return;
  }
  if (config.mode === 'owned-teardown') {
    native.create(d.name, d.nonce); // Intentionally retained only by the native root until teardown.
    return;
  }
  const h = native.attach(...args);
  if (config.mode === 'forged-closed') {
    const proxy = new Proxy({}, { get() { throw new Error('must not inspect fake-handle properties'); } });
    for (const fake of [undefined, null, 1, {}, [], Object.create(null), proxy]) {
      assert.throws(() => native.read(fake), { code: 'SLOT_INVALID_HANDLE' });
      assert.throws(() => native.advance(fake, 1), { code: 'SLOT_INVALID_HANDLE' });
      assert.throws(() => native.close(fake), { code: 'SLOT_INVALID_HANDLE' });
    }
    assert.throws(() => native.read(h), { code: 'SLOT_OWNER_REQUIRED' });
    assert.equal(native.close(h), true);
    assert.equal(native.close(h), false);
    assert.throws(() => native.read(h), { code: 'SLOT_CLOSED_HANDLE' });
    assert.throws(() => native.advance(h, 1), { code: 'SLOT_CLOSED_HANDLE' });
    return;
  }
  if (config.mode === 'invalid') {
    let coercions = 0;
    const values = { nan: NaN, infinity: Infinity, fractional: 1.5, huge: 4294967297,
      negative: -1, string: '1', null: null,
      object: { valueOf() { coercions++; throw new Error('no coercion'); } } };
    if (config.invalid === 'missing') native.advance(h);
    else if (config.invalid === 'extra-argument') native.advance(h, 1, 99);
    else native.advance(h, values[config.invalid]);
    assert.equal(coercions, 0);
    for (const event of [1, 2, 3, 4]) assert.equal(native.advance(h, event), h);
    return;
  }
  for (const event of config.events || [1, 2, 3, 4]) assert.equal(native.advance(h, event), h);
  if (config.mode === 'late-io') {
    const fd = fs.openSync(process.env.SLOT_DIAGNOSTIC, 'wx');
    fs.writeSync(fd, 'complete\n');
    fs.closeSync(fd);
    process.once('exit', () => queueMicrotask(() => {
      assert.equal(native.advance(h, 1), h); // Real late third progress after the earlier complete file.
      assert.throws(() => fs.writeSync(fd, 'refused\n'), { code: 'EBADF' });
    }));
  }
  if (config.mode === 'nonzero') process.exitCode = 7;
  // No explicit close: parent retains its own mapping across actual environment teardown.
});
