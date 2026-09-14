'use strict';
// PM402 independent controls: two writers, surviving child view/GC, scalar setup.
// These are invented-data controls for the unchanged standalone binding only.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { spawn } = require('node:child_process');
const { setImmediate: nextTurn } = require('node:timers/promises');
const { load, ROOT, SCRATCH } = require('../../tooling/native-slot-prototype/loader.cjs');
const { childEnv, sha256, write } = require('../../tooling/native-slot-prototype/build.cjs');
const RUN = process.env.EARNED_SLOT_RUN_ROOT;
const BUILD_PATH = process.env.EARNED_SLOT_BUILD_JSON;
for (const value of [RUN, BUILD_PATH]) {
  assert.equal(typeof value, 'string');
  const relative = path.relative(SCRATCH, value);
  assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
}
const build = JSON.parse(fs.readFileSync(BUILD_PATH));
assert.equal(sha256(build.binaries.candidate.path), build.binaries.candidate.sha256);
const native = load(build.binaries.candidate.path);
const LOADER = path.resolve(__dirname, '../../tooling/native-slot-prototype/loader.cjs');
const hex = () => randomBytes(16).toString('hex');
const descriptor = () => ({ name: `Local\\EarnedSlot-${hex()}`, nonce: hex(), ownerPid: process.pid, version: 1, bytes: 64 });
const attachArgs = d => [d.name, d.nonce, d.ownerPid, d.version, d.bytes];
const summaries = [];
function launch(label, source, d, nested) {
  const directory = path.join(RUN, label);
  fs.mkdirSync(directory);
  const file = path.join(directory, 'control-child.cjs');
  const trace = path.join(directory, 'trace.json');
  fs.writeFileSync(file, source, { flag: 'wx' });
  const args = nested ? ['--test', '--test-reporter=tap', file] : [file];
  const env = childEnv({ EARNED_SLOT_BINARY: build.binaries.candidate.path,
    SLOT_LOADER: LOADER, SLOT_DESCRIPTOR: JSON.stringify(d), SLOT_TRACE: trace });
  const start = new Date().toISOString();
  const child = spawn(process.execPath, args, { cwd: ROOT, env, windowsHide: true,
    stdio: nested ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe', 'ipc'] });
  const stdout = [], stderr = [], messages = [];
  let spawnError = null, timedOut = false;
  child.stdout.on('data', chunk => stdout.push(chunk));
  child.stderr.on('data', chunk => stderr.push(chunk));
  child.on('error', error => { spawnError = { code: error.code, message: error.message }; });
  child.on('message', value => messages.push(value));
  const timeout = setTimeout(() => { timedOut = true; child.kill(); }, 30000);
  const done = new Promise(resolve => child.once('close', (status, signal) => {
    clearTimeout(timeout);
    const out = Buffer.concat(stdout), err = Buffer.concat(stderr);
    fs.writeFileSync(path.join(directory, 'stdout.raw'), out, { flag: 'wx' });
    fs.writeFileSync(path.join(directory, 'stderr.raw'), err, { flag: 'wx' });
    const census = {};
    for (const match of out.toString('utf8').matchAll(/^# (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)$/gm)) census[match[1]] = Number(match[2]);
    const record = { label, start, end: new Date().toISOString(), executable: process.execPath,
      args, cwd: ROOT, environment: env, operatorPid: process.pid, childPid: child.pid,
      nested, status, signal, spawnError, timedOut, census, messages,
      trace: fs.existsSync(trace) ? JSON.parse(fs.readFileSync(trace)) : null,
      sourceSha256: sha256(file), stdoutSha256: sha256(path.join(directory, 'stdout.raw')),
      stderrSha256: sha256(path.join(directory, 'stderr.raw')) };
    write(path.join(directory, 'result.json'), record);
    summaries.push(record);
    resolve(record);
  }));
  return { child, done };
}
const nestedWriter = String.raw`
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
`;
test('two concurrently launched declared writers leave irreversible refusal', async () => {
  const d = descriptor(), owner = native.create(d.name, d.nonce);
  try {
    const a = launch('writer-a', nestedWriter, d, true);
    const b = launch('writer-b', nestedWriter, d, true);
    const results = await Promise.all([a.done, b.done]);
    for (const result of results) {
      assert.equal(result.status, 0); assert.equal(result.signal, null);
      assert.equal(result.spawnError, null); assert.equal(result.timedOut, false);
      assert.equal(result.census.tests, 1); assert.equal(result.census.pass, 1); assert.equal(result.census.fail, 0);
      assert.equal(result.trace.parentPid, result.childPid);
      assert.notEqual(result.trace.pid, result.childPid);
      assert.notEqual(result.trace.pid, process.pid);
    }
    assert.notEqual(results[0].trace.pid, results[1].trace.pid);
    const state = native.read(owner);
    write(path.join(RUN, 'two-writer-state.json'), { state, writersTerminated: true, completion: false });
    assert.equal(state, 5);
  } finally { native.close(owner); }
});
const retainedWriter = String.raw`
'use strict';
const native = require(process.env.SLOT_LOADER).load();
const d = JSON.parse(process.env.SLOT_DESCRIPTOR);
const h = native.attach(d.name, d.nonce, d.ownerPid, d.version, d.bytes);
process.on('message', message => {
  if (message !== 'finish') throw new Error('Unexpected control message');
  for (const event of [1, 2, 3, 4]) native.advance(h, event);
  native.close(h);
  process.send({ phase: 'closed', pid: process.pid }, () => process.disconnect());
});
process.send({ phase: 'attached', pid: process.pid, parentPid: process.ppid });
`;
test('a child view retains the region after owner close; closed external survives GC safely', async () => {
  const d = descriptor();
  let owner = native.create(d.name, d.nonce);
  const weak = new WeakRef(owner);
  const writer = launch('retained-child-view', retainedWriter, d, false);
  try {
    const attached = await new Promise((resolve, reject) => {
      writer.child.once('message', resolve);
      writer.done.then(result => reject(new Error(`Child ended before attachment: ${result.status}`)));
    });
    assert.equal(attached.phase, 'attached');
    assert.equal(attached.pid, writer.child.pid); assert.equal(attached.parentPid, process.pid);
    assert.equal(native.close(owner), true);
    assert.throws(() => native.read(owner), { code: 'SLOT_CLOSED_HANDLE' });
    assert.throws(() => native.create(d.name, hex()), { code: 'SLOT_NAME_EXISTS' });
    owner = null;
    await nextTurn(); global.gc(); await nextTurn(); global.gc();
    const collected = weak.deref() === undefined;
    write(path.join(RUN, 'closed-external-gc.json'), { collected, childStillAttached: true });
    assert.equal(collected, true, 'closed external no longer held by the native strong root');
    writer.child.send('finish');
    const result = await writer.done;
    assert.equal(result.status, 0); assert.equal(result.signal, null);
    assert.equal(result.spawnError, null); assert.equal(result.timedOut, false);
    assert.ok(result.messages.some(message => message.phase === 'closed'));
    const fresh = native.create(d.name, hex());
    try { assert.equal(native.read(fresh), 0); } finally { native.close(fresh); }
  } finally {
    if (owner) native.close(owner);
    if (writer.child.exitCode === null && writer.child.signalCode === null) writer.child.kill();
    await writer.done;
  }
});
test('setup rejects boxed identities and nonnumeric or nonintegral owner IDs without coercion', () => {
  let coercions = 0;
  const boxed = { toString() { coercions++; throw new Error('unexpected coercion'); },
    valueOf() { coercions++; throw new Error('unexpected coercion'); } };
  const d = descriptor(), owner = native.create(d.name, d.nonce);
  try {
    assert.throws(() => native.create(boxed, d.nonce), { code: 'SLOT_IDENTITY_ARGUMENTS' });
    assert.throws(() => native.create(d.name, '\0' + d.nonce.slice(1)), { code: 'SLOT_IDENTITY_ARGUMENTS' });
    for (const value of [boxed, Symbol('owner'), 1.5, 4294967296]) {
      assert.throws(() => native.attach(d.name, d.nonce, value, 1, 64), { code: 'SLOT_ATTACH_ARGUMENTS' });
    }
    assert.equal(coercions, 0); assert.equal(native.read(owner), 0);
    write(path.join(RUN, 'scalar-setup.json'), { refusedCalls: 6, coercions, parentState: 0 });
  } finally { native.close(owner); }
});
test('preserve the independent declared process graph', () => {
  write(path.join(RUN, 'process-census.json'), { cases: summaries.length,
    nestedOuterProcesses: summaries.filter(x => x.nested).length,
    nestedTestFileProcesses: summaries.filter(x => x.nested && x.trace).length,
    directWriterProcesses: summaries.filter(x => !x.nested).length,
    records: summaries.map(x => ({ label: x.label, operatorPid: x.operatorPid, childPid: x.childPid,
      nested: x.nested, filePid: x.trace?.pid ?? null, status: x.status, census: x.census })) });
});
