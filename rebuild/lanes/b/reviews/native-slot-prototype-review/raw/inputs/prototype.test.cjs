'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { setImmediate: nextTurn } = require('node:timers/promises');
const { load, ROOT, SCRATCH } = require('../loader.cjs');
const { childEnv, sha256, write } = require('../build.cjs');
const RUN = process.env.EARNED_SLOT_RUN_ROOT;
const BUILD_PATH = process.env.EARNED_SLOT_BUILD_JSON;
for (const value of [RUN, BUILD_PATH]) {
  assert.equal(typeof value, 'string');
  const relative = path.relative(SCRATCH, value);
  assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'own scratch only');
}
const build = JSON.parse(fs.readFileSync(BUILD_PATH));
for (const entry of Object.values(build.binaries)) assert.equal(sha256(entry.path), entry.sha256);
const native = load(build.binaries.candidate.path);
const cases = path.join(RUN, 'cases');
fs.mkdirSync(cases); // A repeated run must receive a fresh evidence directory.
const records = [];
const hex = () => randomBytes(16).toString('hex');
function descriptor() {
  return { name: `Local\\EarnedSlot-${hex()}`, nonce: hex(), ownerPid: process.pid, version: 1, bytes: 64 };
}
function attachArgs(d) { return [d.name, d.nonce, d.ownerPid, d.version, d.bytes]; }
const writerSource = String.raw`
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
`;
function runGraph(label, d, config, expectedStatus = 0) {
  assert.match(label, /^[a-z0-9-]+$/);
  const directory = path.join(cases, label);
  fs.mkdirSync(directory);
  const file = path.join(directory, 'writer.test.cjs');
  const trace = path.join(directory, 'trace.json');
  const diagnostic = path.join(directory, 'diagnostic.txt');
  fs.writeFileSync(file, writerSource, { flag: 'wx' });
  const env = childEnv({ EARNED_SLOT_BINARY: build.binaries.candidate.path,
    SLOT_LOADER: path.resolve(__dirname, '../loader.cjs'), SLOT_DESCRIPTOR: JSON.stringify(d),
    SLOT_CONFIG: JSON.stringify(config), SLOT_TRACE: trace, SLOT_DIAGNOSTIC: diagnostic });
  const args = ['--test', '--test-reporter=tap', file];
  const start = new Date().toISOString();
  const child = spawnSync(process.execPath, args, { cwd: ROOT, env, windowsHide: true,
    timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
  const stdout = child.stdout || Buffer.alloc(0), stderr = child.stderr || Buffer.alloc(0);
  fs.writeFileSync(path.join(directory, 'stdout.raw'), stdout, { flag: 'wx' });
  fs.writeFileSync(path.join(directory, 'stderr.raw'), stderr, { flag: 'wx' });
  const census = {};
  for (const match of stdout.toString('utf8').matchAll(/^# (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)$/gm))
    census[match[1]] = Number(match[2]);
  const record = { label, start, end: new Date().toISOString(), operatorPid: process.pid,
    executable: process.execPath, args, cwd: ROOT, environment: env, outerPid: child.pid ?? null,
    status: child.status, signal: child.signal,
    error: child.error ? { code: child.error.code, message: child.error.message } : null,
    census, firstFailure: stdout.toString('utf8').split(/\r?\n/).find(line => /^not ok /.test(line)) || null,
    writerSourceSha256: sha256(file), stdoutSha256: sha256(path.join(directory, 'stdout.raw')),
    stderrSha256: sha256(path.join(directory, 'stderr.raw')),
    trace: fs.existsSync(trace) ? JSON.parse(fs.readFileSync(trace)) : null,
    diagnostic: fs.existsSync(diagnostic) ? fs.readFileSync(diagnostic, 'utf8') : null };
  write(path.join(directory, 'result.json'), record);
  records.push(record);
  // Raw evidence is persisted before any assertion can fail.
  assert.equal(child.error, undefined, label);
  assert.equal(child.signal, null, label);
  assert.equal(child.status, expectedStatus, `${label}; raw outputs retained at ${directory}`);
  assert.ok(record.trace, 'actual test-file process reported its identity');
  assert.notEqual(child.pid, process.pid);
  assert.notEqual(record.trace.pid, child.pid);
  assert.notEqual(record.trace.pid, process.pid);
  assert.equal(record.trace.parentPid, child.pid, 'actual parent -> outer runner -> test-file graph');
  return record;
}
function withOwner(fn, binding = native, d = descriptor()) {
  const handle = binding.create(d.name, d.nonce);
  try { return fn(handle, d, binding); }
  finally { binding.close(handle); }
}
function afterExitState(label, config, expected) {
  withOwner((handle, d) => {
    const record = runGraph(label, d, config);
    const state = native.read(handle);
    write(path.join(cases, label, 'owner-observation.json'), { outerTerminated: true,
      outerStatus: record.status, state, completion: record.status === 0 && state === 4 });
    assert.equal(state, expected);
  });
}

test('actual nested OS processes share exact two-record progress after exit', () => {
  afterExitState('two-records', { mode: 'progress' }, 4);
});
for (const [name, events, expected] of [
  ['none', [], 0], ['first-pending', [1], 1], ['first-complete', [1, 2], 2],
  ['second-pending', [1, 2, 3], 3], ['extra', [1, 2, 3, 4, 1, 2, 3, 4], 5],
  ['out-of-order', [3, 1, 2, 3, 4], 5], ['duplicate', [1, 1, 2, 3, 4], 5]
]) test(`${name} progress cannot become a false completion`, () => afterExitState(name, { mode: 'progress', events }, expected));
for (const invalid of ['nan', 'infinity', 'fractional', 'huge', 'negative', 'string', 'null', 'object', 'missing', 'extra-argument'])
  test(`invalid ${invalid} progress refuses without reset or coercion`, () =>
    afterExitState(`invalid-${invalid}`, { mode: 'invalid', invalid }, 5));
test('late third progress survives loss of the later diagnostic write', () => {
  withOwner((handle, d) => {
    const result = runGraph('late-io', d, { mode: 'late-io' });
    assert.equal(result.diagnostic, 'complete\n');
    assert.equal(native.read(handle), 5);
  });
});
test('negative control: a local buffer and complete file cannot complete the parent', () => {
  withOwner((handle, d) => {
    const result = runGraph('local-control', d, { mode: 'local-control' });
    assert.equal(result.diagnostic, 'complete\n');
    assert.equal(native.read(handle), 0);
  });
});
test('negative control: completed state does not erase a failed child outcome', () => {
  withOwner((handle, d) => {
    const result = runGraph('nonzero', d, { mode: 'nonzero' }, 1);
    const state = native.read(handle);
    assert.equal(state, 4);
    assert.equal(result.status === 0 && state === 4, false);
    assert.ok(result.firstFailure);
  });
});
test('native root survives GC, child teardown and repeatable explicit cleanup', async () => {
  assert.equal(typeof global.gc, 'function', 'run the standalone driver with --expose-gc');
  const d = descriptor();
  let handle = native.create(d.name, d.nonce);
  const weak = new WeakRef(handle);
  handle = null;
  await nextTurn(); global.gc(); await nextTurn(); global.gc();
  handle = weak.deref();
  assert.ok(handle, 'native strong reference retained the opaque handle');
  try {
    runGraph('retained-root', d, { mode: 'progress' });
    assert.equal(native.read(handle), 4);
    assert.equal(native.close(handle), true);
    assert.equal(native.close(handle), false);
    assert.throws(() => native.read(handle), { code: 'SLOT_CLOSED_HANDLE' });
    assert.throws(() => native.attach(...attachArgs(d)), { code: 'SLOT_OPEN_FAILED' });
    const fresh = { ...d, nonce: hex() };
    const second = native.create(fresh.name, fresh.nonce);
    try {
      assert.equal(native.read(second), 0);
      runGraph('stale-generation', d, { mode: 'attach-fails', error: 'SLOT_HEADER_MISMATCH' });
      assert.equal(native.read(second), 0);
    } finally { native.close(second); }
  } finally { native.close(handle); }
});
test('missing binary has no successful fallback', () => {
  assert.throws(() => load(path.join(SCRATCH, 'missing-native.node')), { code: 'NATIVE_SLOT_LOAD_FAILED' });
});
test('missing region refuses in the actual test-file process', () => {
  runGraph('missing-region', descriptor(), { mode: 'attach-fails', error: 'SLOT_OPEN_FAILED' });
});
for (const mismatch of ['nonce', 'owner', 'version', 'size']) test(`${mismatch} descriptor mismatch refuses`, () => {
  withOwner((handle, d) => {
    const wrong = { ...d };
    if (mismatch === 'nonce') wrong.nonce = hex();
    if (mismatch === 'owner') wrong.ownerPid += 1;
    if (mismatch === 'version') wrong.version = 2;
    if (mismatch === 'size') wrong.bytes = 128;
    runGraph(`descriptor-${mismatch}`, wrong, { mode: 'attach-fails',
      error: ['nonce', 'owner'].includes(mismatch) ? 'SLOT_HEADER_MISMATCH' : 'SLOT_PROTOCOL_ARGUMENTS' });
    assert.equal(native.read(handle), 0);
  });
});
for (const fixture of ['version-mismatch', 'size-mismatch']) test(`actual ${fixture} region header refuses`, () => {
  const incompatible = load(build.binaries[fixture].path);
  withOwner((handle, d) => {
    runGraph(`header-${fixture}`, d, { mode: 'attach-fails', error: 'SLOT_HEADER_MISMATCH' });
    assert.equal(incompatible.read(handle), 0);
  }, incompatible);
});
test('duplicate ownership cannot replace the existing region', () => {
  withOwner((handle, d) => {
    assert.throws(() => native.create(d.name, hex()), { code: 'SLOT_NAME_EXISTS' });
    assert.equal(native.read(handle), 0);
    runGraph('duplicate-owner-intact', d, { mode: 'progress' });
    assert.equal(native.read(handle), 4);
  });
});
test('forged, non-owner and closed handles fail safely in a separate process', () => {
  afterExitState('forged-closed', { mode: 'forged-closed' }, 0);
});
test('unclosed child-owned native resources end with the process', () => {
  const d = descriptor();
  const result = runGraph('owned-teardown', d, { mode: 'owned-teardown' });
  assert.throws(() => native.attach(d.name, d.nonce, result.trace.pid, 1, 64), { code: 'SLOT_OPEN_FAILED' });
});
test('write the complete observed synthetic process census', () => {
  write(path.join(RUN, 'process-census.json'), { sourceHead: build.sourceHead,
    cases: records.length, outerProcesses: records.length,
    distinctOuterPids: new Set(records.map(x => x.outerPid)).size,
    distinctTestFilePids: new Set(records.map(x => x.trace?.pid).filter(Boolean)).size,
    records: records.map(x => ({ label: x.label, operatorPid: x.operatorPid, outerPid: x.outerPid,
      filePid: x.trace?.pid ?? null, status: x.status, census: x.census })) });
});
