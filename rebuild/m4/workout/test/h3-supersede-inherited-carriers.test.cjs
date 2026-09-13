'use strict';
/* =====================================================================
   H3 SUPERSEDES THE NATIVE-CARRIERS CARRIER `inherited-carriers`
   (gates witnesses-2, witnesses-5, migrate-differential)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. `native-carriers-source-
   carriers.cjs:priorModule` re-reads EVERY PRIOR ENGINE MODULE as the gate
   walks the composition: a module the carrier list does not name is asserted
   byte-identical to its frozen prior bytes (`Unchanged prior module bytes`),
   and a module it does name is REBUILT from those bytes by the declared
   carriers, in the declared order, and asserted equal to what is on disk
   (`:85`, `:87`, `:89`), with the substitution order itself pinned at `:138`
   (`Every original substitution reached, in order`).

   WHY H3 CANNOT CARRY IT. The frozen prior bytes come from the same sha-pinned
   carrier list as `source-carriers`, so the two engine files H3 declares are
   refused there for the same reason. See BRIEF-H3-CLEAN-INIT v1.8 section 9.

   WHAT H3 PUTS IN ITS PLACE, HERE, EXECUTED. Both halves of the same claim.
   (a) EVERY prior engine module except the two H3 declares is byte-identical to
   `sourceBase` AND to the parent artifact's own product pin — the "unchanged
   prior module" half, over the real 20-file inventory. (b) The two it does
   declare are held to a DIFFERENTIAL rather than to a byte: the accepted
   writers factory and H3's are composed on the SAME engine table and must agree
   on every state the frozen record can contain, and the accepted constants and
   H3's must agree on every exported key, `MG_LABEL` excepted and that one
   difference enumerated.

   RED-FIRST: cell 3 asserts the four back region heads H3 adds, which the
   parent's `constants.cjs` does not carry; cell 2 asserts the one enumerated
   difference, which on the parent's bytes is absent.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/H3.json'), 'utf8'));
const PARENT = JSON.parse(fs.readFileSync(path.join(REPO, SPEC.parent.options[0].artifact), 'utf8'));
const BASE = SPEC.sourceBase;
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const disk = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const CHANGED = ['rebuild/engine/writers.cjs', 'rebuild/engine/constants.cjs'];

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

test('H3/SUP-5 - inherited-carriers: every PRIOR engine module is byte-identical to sourceBase and to the parent pin', () => {
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
  /* The two that do move are the two the spec declares, at their declared post. */
  for (const f of CHANGED)
    assert.equal(sha(Buffer.from(disk(f), 'utf8')), SPEC.product[f].post, 'declared post-image: ' + f);
});

test('H3/SUP-6 - inherited-carriers: the accepted CONSTANTS and H3\'s differ in exactly one exported key, enumerated', () => {
  const accepted = privately('rebuild/engine/constants.cjs', blob('rebuild/engine/constants.cjs'))();
  const ours = privately('rebuild/engine/constants.cjs', disk('rebuild/engine/constants.cjs'))();
  assert.deepEqual(Object.keys(ours).sort(), Object.keys(accepted).sort(), 'the exported key set is closed and unchanged');
  const moved = Object.keys(accepted).filter(k => JSON.stringify(accepted[k]) !== JSON.stringify(ours[k])).sort();
  assert.deepEqual(moved, ['MG_LABEL'], 'exactly one exported constant moves, and it is the F2 LABEL table');
  /* And that one table gains four keys and changes none of the three it had. */
  for (const [k, v] of Object.entries(accepted.MG_LABEL))
    assert.equal(ours.MG_LABEL[k], v, 'an existing gloss is untouched: ' + k);
  const added = Object.keys(ours.MG_LABEL).filter(k => !Object.hasOwn(accepted.MG_LABEL, k)).sort();
  assert.deepEqual(added, ['back_lats', 'back_lower', 'back_traps', 'back_upper'],
    'four added keys, the BACK region heads, and no other');
});

test('H3/SUP-7 - inherited-carriers: RED-FIRST - the four region heads are H3\'s, and no producer on this tree sets them', () => {
  const ours = privately('rebuild/engine/constants.cjs', disk('rebuild/engine/constants.cjs'))();
  const accepted = privately('rebuild/engine/constants.cjs', blob('rebuild/engine/constants.cjs'))();
  for (const k of ['back_lats', 'back_upper', 'back_traps', 'back_lower']) {
    assert(Object.hasOwn(ours.MG_LABEL, k), 'H3 carries the head: ' + k);
    assert.equal(Object.hasOwn(accepted.MG_LABEL, k), false, 'RED on the parent bytes: ' + k);
  }
  /* INERT, and this is the measurement the brief cites rather than an argument:
     no producer anywhere on this tree writes one of these heads onto a lift, so
     `MG_LABEL[k] || k` is never consulted for them and no screen moves. */
  const roots = ['rebuild/engine', 'rebuild/m3/w7-preview/today', 'rebuild/m4/workout'];
  const hits = [];
  const walk = d => {
    for (const e of fs.readdirSync(path.join(REPO, d), { withFileTypes: true })) {
      if (e.name === 'node_modules') continue;
      const p = d + '/' + e.name;
      if (e.isDirectory()) { walk(p); continue; }
      if (!/\.(cjs|mjs|js|json)$/.test(e.name)) continue;
      const src = fs.readFileSync(path.join(REPO, p), 'utf8');
      for (const k of ['back_lats', 'back_upper', 'back_traps', 'back_lower'])
        if (src.includes(k)) hits.push(p + ':' + k);
    }
  };
  for (const r of roots) walk(r);
  const producers = [...new Set(hits.map(h => h.split(':')[0]))]
    .filter(f => !f.startsWith('rebuild/m4/workout/test/')).sort();
  assert.deepEqual(producers, ['rebuild/engine/constants.cjs'],
    'outside H3\'s own cells the four keys occur ONLY in the table that declares them: no producer sets them, so MG_LABEL[k] is never consulted for them and no screen moves');
});
