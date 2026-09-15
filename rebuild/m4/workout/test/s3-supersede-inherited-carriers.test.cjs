'use strict';
/* =====================================================================
   M2-S3-COMPANION SUPERSEDES THE NATIVE-CARRIERS CARRIER `inherited-carriers`
   (gates witnesses-2, witnesses-5, migrate-differential)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. `native-carriers-source-
   carriers.cjs:priorModule` re-reads EVERY PRIOR ENGINE MODULE as the gate
   walks the composition: a module the carrier list does not name is asserted
   byte-identical to its frozen prior bytes, and a module it does name is
   REBUILT from those bytes by the declared carriers, in the declared order,
   and asserted equal to what is on disk, with the substitution order itself
   pinned.

   WHY S3 CANNOT CARRY IT. The frozen prior bytes come from the same
   sha-pinned carrier list as `source-carriers`, so the two engine files S3
   declares (merge.cjs, today.cjs) are refused there for the same reason.

   WHAT S3 PUTS IN ITS PLACE, HERE, EXECUTED. Both halves of the same claim.
   (a) EVERY prior engine module except the two S3 declares is byte-identical
   to `sourceBase` AND to the parent artifact's own product pin, over the real
   engine inventory. (b) The two it does declare are held to a DIFFERENTIAL
   rather than to a byte: the accepted merge factory and S3's, composed on the
   SAME engine table, must return the same member set and agree byte for byte
   on mergeState over diverged public replicas; the accepted today factory and
   S3's must differ in EXACTLY one returned member, `sessionMembership`, and
   agree on genSession over the public fixtures (the full differential is
   s3-companion-gensession-differential.test.cjs).

   RED-FIRST: cell 3 asserts the one enumerated difference, absent on the
   parent's bytes.
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
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const disk = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const CHANGED = ['rebuild/engine/merge.cjs', 'rebuild/engine/today.cjs'];
const { createEngine } = require('../../../engine/index.cjs');
const { createSyntheticState, SYNTHETIC_DAY, dayOffset } = require('../../../m3/w7-preview/fixtures.cjs');

/* A privately compiled engine module: the accepted bytes at `sourceBase`, never
   on disk, never in require.cache, with its own relative specifiers resolved
   against the real directory so the modules it reaches are the real ones. */
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
const DAY = SYNTHETIC_DAY;
const clock = { today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'), stamp: () => DAY + 'T13:00:00.000Z' };

test('S3/SUP-5 - inherited-carriers: every PRIOR engine module is byte-identical to sourceBase and to the parent pin', () => {
  const dir = 'rebuild/engine';
  const files = fs.readdirSync(path.join(REPO, dir)).filter(n => n.endsWith('.cjs')).sort().map(n => dir + '/' + n);
  assert(files.length >= 18, 'the real engine inventory, not a sample: ' + files.length);
  const unchanged = files.filter(f => !CHANGED.includes(f));
  assert.equal(unchanged.length, files.length - 2, 'exactly two files are excused, by name');
  for (const f of unchanged) {
    assert.equal(disk(f), blob(f), 'unchanged prior module bytes: ' + f);
    if (Object.hasOwn(PARENT.product, f)) {
      const pin = PARENT.product[f];
      assert.equal(sha(Buffer.from(disk(f), 'utf8')), typeof pin === 'string' ? pin : (pin.post || pin.pre),
        'and it is the parent artifact\'s own product pin: ' + f);
    }
  }
  /* The two that do move are the two the spec declares, at their declared post,
     and each stood at the parent's own pin before. */
  for (const f of CHANGED) {
    assert.equal(sha(Buffer.from(disk(f), 'utf8')), SPEC.product[f].post, 'declared post-image: ' + f);
    assert.equal(sha(Buffer.from(blob(f), 'utf8')), SPEC.product[f].pre, 'declared pre-image: ' + f);
    assert.equal(SPEC.product[f].pre, PARENT.product[f].post, 'the pre-image is the parent\'s post: ' + f);
  }
});

test('S3/SUP-6 - inherited-carriers: the accepted MERGE and S3\'s return the same members and merge diverged replicas byte for byte', () => {
  const E = createEngine({ clock });
  const accepted = privately('rebuild/engine/merge.cjs', blob('rebuild/engine/merge.cjs'))(E, { clock });
  const ours = privately('rebuild/engine/merge.cjs', disk('rebuild/engine/merge.cjs'))(E, { clock });
  assert.deepEqual(Object.keys(ours).sort(), Object.keys(accepted).sort(), 'the returned member set is closed and unchanged');
  const local = createSyntheticState(), remote = createSyntheticState();
  const d = Object.keys(local.sessionLog).sort().at(-1);
  local.sessionLog[d] = { ...local.sessionLog[d], corr: { at: '2026-03-08T02:30:00', rev: 1 },
    corrLog: [{ op: 'skip:demo-row:1:2026-03-08T02:30:00', kind: 'skip', id: 'demo-row', at: '2026-03-08T02:30:00' }], skipped: ['demo-row'] };
  remote.reads.push({ d: dayOffset(DAY, -1), w: 175.2, sealed: false, note: 'SYNTHETIC late replica' });
  remote.adjustments = [{ id: 'adj_' + (1.7e12).toString(36) + 'aaaa', at: '2026-03-08T03:30:00-04:00', d: dayOffset(DAY, -2), kind: 'note' }];
  for (const [x, y] of [[local, remote], [remote, local]]) {
    assert.equal(JSON.stringify(ours.mergeState(structuredClone(x), structuredClone(y))),
      JSON.stringify(accepted.mergeState(structuredClone(x), structuredClone(y))), 'mergeState byte-identical');
  }
  /* The one thing that differs is the seam itself, and only when a caller asks for it. */
  assert.equal(accepted.length, ours.length, 'same arity, the seam is a defaulted destructured member');
});

test('S3/SUP-7 - inherited-carriers: RED-FIRST - the accepted TODAY and S3\'s differ in exactly one returned member, enumerated', () => {
  const E = createEngine({ clock });
  const accepted = privately('rebuild/engine/today.cjs', blob('rebuild/engine/today.cjs'))(E, { clock });
  const ours = privately('rebuild/engine/today.cjs', disk('rebuild/engine/today.cjs'))(E, { clock });
  const added = Object.keys(ours).filter(k => !Object.hasOwn(accepted, k)).sort();
  const removed = Object.keys(accepted).filter(k => !Object.hasOwn(ours, k)).sort();
  assert.deepEqual(added, ['sessionMembership'], 'exactly one member is added, the reader');
  assert.deepEqual(removed, [], 'and none is removed');
  assert.equal(Object.hasOwn(ours, '_sessionPool'), false, 'the pool helper is private');
  assert.equal(Object.hasOwn(accepted, 'sessionMembership'), false, 'RED on the parent bytes');
  /* And on the public fixture the shared members answer identically. */
  const s = createSyntheticState();
  for (const day of [DAY, dayOffset(DAY, 1), dayOffset(DAY, 2)]) {
    assert.equal(JSON.stringify(ours.genSession(structuredClone(s), day, E.sleepInfo(s))),
      JSON.stringify(accepted.genSession(structuredClone(s), day, E.sleepInfo(s))), 'genSession ' + day);
    assert.equal(JSON.stringify(ours.pickStructural(structuredClone(s), day, E.sleepInfo(s))),
      JSON.stringify(accepted.pickStructural(structuredClone(s), day, E.sleepInfo(s))), 'pickStructural ' + day);
  }
});
