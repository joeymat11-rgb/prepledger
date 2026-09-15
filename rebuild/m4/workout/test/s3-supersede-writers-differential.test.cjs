'use strict';
/* =====================================================================
   M2-S3-COMPANION SUPERSEDES THE NATIVE-CARRIERS CARRIER `writers-differential`
   (gate writers-differential)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. That the adopted
   `rebuild/engine/writers.cjs` behaves identically to the frozen writer
   across THREE Date/trap modes - `NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap
   modes PASS;` - by running both over the same inputs with the clock frozen,
   the clock live, and `Date` trapped, and comparing outputs.

   WHY S3 CANNOT CARRY IT. The gate reaches writers.cjs through the same
   sha-pinned reconstruction the other four carriers use, and S3 moves two
   files that reconstruction covers (merge.cjs, today.cjs).

   WHAT S3 PUTS IN ITS PLACE, HERE, EXECUTED, AND IT IS THE SAME DIFFERENTIAL,
   POINTED AT THE FILE S3 ACTUALLY CHANGES. (1) writers.cjs itself is
   byte-identical to the parent's post, asserted, so the accepted gate's
   subject did not move at all. (2) The ACCEPTED merge factory - the bytes at
   `sourceBase`, compiled privately and never entering require.cache - and
   S3's are composed on the SAME engine table and driven over the SAME diverged
   public replicas in the SAME three modes; mergeState must agree BYTE FOR
   BYTE in every mode, and S3's own output must be identical across the three
   modes, so the seam introduces no clock dependence. (3) The `trap` mode is
   the one that matters for a calendar seam: `new Date()` with no argument and
   `Date.now()` throw, and the seam - which only ever constructs from a
   parsed number - must not trip it.

   RED-FIRST: cell 3 asserts that under an injected adapter the accepted merge
   is unreachable (no call recorded) while S3's records every routed site.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S3.json'), 'utf8'));
const PARENT = JSON.parse(fs.readFileSync(path.join(REPO, SPEC.parent.options[0].artifact), 'utf8'));
const BASE = SPEC.sourceBase;
const MERGE = 'rebuild/engine/merge.cjs';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const { createEngine } = require('../../../engine/index.cjs');
const { createSyntheticState, SYNTHETIC_DAY, dayOffset } = require('../../../m3/w7-preview/fixtures.cjs');

function privately(file, source) {
  const abs = path.join(REPO, file);
  const m = new Module(abs, module);
  m.filename = abs;
  m.paths = Module._nodeModulePaths(path.dirname(abs));
  const normal = m.require.bind(m);
  m.require = name => (name.startsWith('.') ? require(path.resolve(path.dirname(abs), name)) : normal(name));
  m._compile(source, abs);
  return m.exports;
}
const acceptedMerge = privately(MERGE, blob(MERGE));
const ourMerge = require('../../../engine/merge.cjs');
const DAY = SYNTHETIC_DAY;
const clockFor = () => ({ today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'), stamp: () => DAY + 'T13:00:00.000Z' });

/* THE REPLICAS: the public synthetic athlete, diverged three ways - a
   corrected session with an offset-free March stamp on one side, a late
   weigh-in and two adjustments (one with a malformed stamp, one with an
   explicit offset) on the other. Every stamp is raw, none is normalised. */
function replicas() {
  const local = createSyntheticState(), remote = createSyntheticState();
  const d = Object.keys(local.sessionLog).sort().at(-1);
  local.sessionLog[d] = { ...local.sessionLog[d], corr: { at: '2026-03-08T02:30:00', rev: 1 },
    corrLog: [{ op: 'skip:demo-row:1:2026-03-08T02:30:00', kind: 'skip', id: 'demo-row', at: '2026-03-08T02:30:00' }], skipped: ['demo-row'] };
  remote.reads.push({ d: dayOffset(DAY, -1), w: 175.2, sealed: false, note: 'SYNTHETIC late replica' });
  remote.adjustments = [{ id: 'adj_' + (1.7e12).toString(36) + 'aaaa', at: '2026-03-08T03:30:00-04:00', d: dayOffset(DAY, -2), kind: 'note' }];
  local.adjustments = [{ id: 'adj_' + (1.7e12).toString(36) + 'bbbb', at: 'bad-stamp', d: dayOffset(DAY, -3), kind: 'note' }];
  return { local, remote };
}
/* THE THREE MODES, exactly the gate's own three. */
const NativeDate = Date;
const MODES = {
  frozen: () => { globalThis.Date = class extends NativeDate { constructor(...a) { super(...(a.length ? a : [1788451200000])); } static now() { return 1788451200000; } static parse(v) { return NativeDate.parse(v); } }; },
  live: () => { globalThis.Date = NativeDate; },
  trap: () => {
    globalThis.Date = class extends NativeDate {
      constructor(...a) { if (!a.length) throw new Error('MERGE_READ_THE_WALL_CLOCK'); super(...a); }
      static now() { throw new Error('MERGE_READ_THE_WALL_CLOCK'); }
      static parse(v) { return NativeDate.parse(v); }
    };
  },
};
function inMode(mode, fn) { MODES[mode](); try { return fn(); } finally { globalThis.Date = NativeDate; } }
function run(factory, deps) {
  const E = createEngine({ clock: clockFor() });
  const M = factory(E, { clock: clockFor(), ...deps });
  const { local, remote } = replicas();
  return { lr: JSON.stringify(M.mergeState(structuredClone(local), structuredClone(remote))),
    rl: JSON.stringify(M.mergeState(structuredClone(remote), structuredClone(local))) };
}

test('S3/SUP-8 - writers-differential: the gate\'s own subject, writers.cjs, is byte-identical to the parent post', () => {
  const f = 'rebuild/engine/writers.cjs';
  const disk = fs.readFileSync(path.join(REPO, f));
  assert.equal(sha(disk), PARENT.product[f].post, 'writers.cjs stands at the parent\'s post');
  assert.equal(sha(disk), SPEC.product[f].pre, 'and this package declares it carried at that byte');
  assert.equal(SPEC.product[f].role, 'carried');
  assert.equal(disk.toString('utf8'), blob(f), 'and equal to sourceBase');
});

test('S3/SUP-9 - writers-differential: 3/3 Date/trap modes - the accepted merge and S3\'s agree BYTE FOR BYTE on diverged replicas', () => {
  const results = {};
  for (const mode of Object.keys(MODES)) {
    // Each mode composes fresh engines, so a class swapped at global scope is the one both sides see.
    const a = inMode(mode, () => run(acceptedMerge, {}));
    const b = inMode(mode, () => run(ourMerge, {}));
    assert.equal(b.lr, a.lr, mode + ': mergeState(local, remote) byte-identical');
    assert.equal(b.rl, a.rl, mode + ': mergeState(remote, local) byte-identical');
    results[mode] = b;
  }
  assert.equal(Object.keys(results).length, 3, '3/3 modes');
  // And the merge is order-free on these replicas on both sides, in every mode.
  for (const mode of Object.keys(results)) assert.equal(results[mode].lr, results[mode].rl, mode + ': order-free');
});

test('S3/SUP-10 - writers-differential: S3\'s own output is identical across the three modes, and RED-FIRST the seam is reached only on S3\'s side', () => {
  const outs = Object.keys(MODES).map(mode => inMode(mode, () => run(ourMerge, {})));
  for (const o of outs.slice(1)) assert.deepEqual(o, outs[0], 'the seam reads no clock: identical across modes');
  // RED-FIRST: an injected adapter under `trap` mode. The seam constructs only
  // from a parsed number, so the trap never fires; the accepted merge never
  // consults the adapter at all.
  const record = () => { const calls = []; function A(ms) { calls.push('construct'); return new NativeDate(ms); } A.parse = v => { calls.push('parse'); return NativeDate.parse(v); }; return { A, calls }; };
  const ra = record(), rb = record();
  const a = inMode('trap', () => run(acceptedMerge, { nativeDate: ra.A }));
  const b = inMode('trap', () => run(ourMerge, { nativeDate: rb.A }));
  assert.equal(b.lr, a.lr, 'same bytes through the adapter');
  assert.equal(ra.calls.length, 0, 'RED-FIRST: the accepted merge is unreachable through the seam');
  assert(rb.calls.includes('parse'), 'S3\'s merge parsed through the adapter: ' + rb.calls.length + ' call(s)');
});
