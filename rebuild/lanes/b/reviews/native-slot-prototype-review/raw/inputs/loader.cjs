'use strict';
const path = require('node:path');
const fs = require('node:fs');
const ROOT = path.resolve(__dirname, '../../../../..');
const SCRATCH = path.join(ROOT, '.tmp', 'native-slot');
function load(binary = process.env.EARNED_SLOT_BINARY) {
  if (process.platform !== 'win32' || process.arch !== 'x64')
    throw Object.assign(new Error('Windows x64 prototype only'), { code: 'NATIVE_SLOT_PLATFORM' });
  if (typeof binary !== 'string' || !path.isAbsolute(binary))
    throw Object.assign(new Error('An explicit owned binary is required'), { code: 'NATIVE_SLOT_BINARY_REQUIRED' });
  const relative = path.relative(SCRATCH, path.resolve(binary));
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || path.extname(binary) !== '.node')
    throw Object.assign(new Error('Binary must be inside this prototype scratch root'), { code: 'NATIVE_SLOT_BINARY_SCOPE' });
  try {
    if (!fs.statSync(binary).isFile()) throw new Error('Not a regular binary file');
    const binding = require(binary);
    for (const name of ['create', 'attach', 'advance', 'read', 'close'])
      if (typeof binding[name] !== 'function') throw new Error(`Missing native method ${name}`);
    return Object.freeze(binding);
  } catch (cause) {
    throw Object.assign(new Error('Native slot setup failed; no fallback', { cause }), { code: 'NATIVE_SLOT_LOAD_FAILED' });
  }
}
module.exports = Object.freeze({ load, ROOT, SCRATCH });
