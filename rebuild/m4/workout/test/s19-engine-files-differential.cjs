'use strict';
/* =====================================================================
   THE NAMED-FILES ENGINE DIFFERENTIAL, FOR M2-S19-LIVE (E1 and E2b; the owner's rulings DECISIONS:982 and :999)
   Child 35 of S19, replacing s14-engine-files-differential.cjs there exactly as S14 replaced its parent's (VERDICT-S14):
   that child reads S14.json and names native-load.cjs as the ONLY engine byte that moves, so it cannot stand once this
   package moves rebuild/engine/energy.cjs under the owner's rulings DECISIONS:982 and :999 (constants.cjs stays unmoved,
   the PM's ruling on E2b). Ported from E1's own child (b99c5e6). Templated on it, same shape, and at
   least as strict:

     every tracked file under rebuild/engine/ other than energy.cjs stands BYTE-IDENTICAL to the PARENT'S OWN POST (S14;
     named carried, or outside this package's product, against the S14 seal's sourceBase blob); energy.cjs is the S14
     post plus exactly its seventeen declared hunks (s19-energy-moves.cjs: E1's atFloor helper and six calorieTarget call
     sites, and E2b's lean-mass stand-in and its three readers); and native-load.cjs, carried here at the S14 post, is still the S11 post plus exactly S14's six declared
     hunks (s14-native-load-moves.cjs), the proof S14's own child made, replayed here so nothing it held is dropped.

   So the verdict line names exactly the two engine files that have moved since the S11 seal, each with its hunk count
   and its base, and no engine file is added.

   PLANTS (RED, in this script, after the real run): the same check is run again over three planted views of the tree,
   built in memory (nothing on disk is written): (P1) a third, named carried engine file moves; (P2) a third engine file
   outside the product moves; (P3) energy.cjs carries one undeclared line beside its declared hunks. Each must be refused
   with the assertion that names it, or this script fails.

   Every path and every sha below is read at run time from Git and from disk. Nothing is hard-coded but the two roots,
   the spec files' names, the two hunk tables and the planted text. It reads every tracked engine file's bytes, the
   protected engine files among them, so it runs at the PM seat.
   ===================================================================== */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const ENGINE_ROOT = 'rebuild/engine/';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const git = args => cp.execFileSync('git', args, { cwd: REPO, maxBuffer: 9e7 });
const blobSha = (rev, f) => sha(git(['show', rev + ':' + f]));
const { ENERGY_MOVES } = require('./s19-energy-moves.cjs');
const { NL_MOVES } = require('./s14-native-load-moves.cjs');

const readJson = f => JSON.parse(fs.readFileSync(path.join(REPO, f), 'utf8'));
const SPEC = readJson('rebuild/lanes/b/tooling/packages/S19.json');
const S14_SPEC = readJson('rebuild/lanes/b/tooling/packages/S14.json');
const OPTION = SPEC.parent.options.find(o => o.id === SPEC.parent.chosen);
const PARENT_RAW = fs.readFileSync(path.join(REPO, OPTION.artifact));
assert.equal(sha(PARENT_RAW), OPTION.sha256, 'the accepted parent artifact is the bytes this spec pins: ' + OPTION.artifact);
const PARENT = JSON.parse(PARENT_RAW);
assert.equal(PARENT.packageId, 'M2-S14-HOLD', 'the bound parent is S14');
const BASE = PARENT.sourceBase;
assert(/^[a-f0-9]{40}$/.test(BASE), 'the parent artifact names its own sourceBase');
assert(/^[a-f0-9]{40}$/.test(SPEC.sourceBase), 'this spec names its own sourceBase (the S14 seal tip)');
assert(/^[a-f0-9]{40}$/.test(S14_SPEC.sourceBase), 'S14\'s spec names its own sourceBase (the S11 seal tip)');

/* The declared moves: this package's own (against the S14 post, from Git at this spec's sourceBase), and S14's,
   replayed (against the S11 post, from Git at S14's sourceBase). */
const MOVES = Object.freeze([
  Object.freeze({ file: Object.keys(ENERGY_MOVES)[0], hunks: Object.values(ENERGY_MOVES)[0], rev: SPEC.sourceBase, own: true,
    base: 'the S14 post', note: 'DECISIONS:982 and :999' }),
  Object.freeze({ file: Object.keys(NL_MOVES)[0], hunks: Object.values(NL_MOVES)[0], rev: S14_SPEC.sourceBase, own: false,
    base: 'the S11 post', note: 'S14\'s, carried here at the S14 post' }),
]);
assert.equal(Object.keys(ENERGY_MOVES).length, 1, 'one energy table');
assert.equal(Object.keys(NL_MOVES).length, 1, 'one native-load table');
const MOVE_FILES = MOVES.map(m => m.file);

const tracked = git(['ls-files', '-z', ENGINE_ROOT.slice(0, -1)]).toString('utf8')
  .split('\0').filter(f => f.startsWith(ENGINE_ROOT));
assert(tracked.length >= 40, 'the real tracked inventory under ' + ENGINE_ROOT + ': ' + tracked.length);
const named = tracked.filter(f => Object.hasOwn(SPEC.product, f));
const outside = tracked.filter(f => !Object.hasOwn(SPEC.product, f));
assert(named.length && outside.length, 'the brief names some engine files and leaves others');
for (const f of MOVE_FILES) assert(named.includes(f), 'a declared move is a named, tracked engine file: ' + f);

function want(f) {
  const pin = PARENT.product[f];
  const declared = pin && pin.post !== null && pin.post !== undefined;
  return { want: declared ? pin.post : blobSha(BASE, f), against: declared ? 'parent post' : 'parent sourceBase ' + BASE.slice(0, 7) };
}
const WANT = new Map(tracked.map(f => [f, want(f)]));
const PARENT_TEXT = new Map(MOVES.map(m => [m.file, git(['show', m.rev + ':' + m.file]).toString('utf8')]));

/* The check, over a view of the tree ({ diskSha(f), diskText(f) }). Throws on the first broken sentence. */
function check(view) {
  const rows = [], moved = [], carried = [], added = [];
  for (const f of outside) {
    const w = WANT.get(f), got = view.diskSha(f);
    rows.push({ f, against: w.against, got });
    assert.equal(got, w.want, 'engine file outside the brief moved: ' + f +
      ' (disk ' + got.slice(0, 12) + ', parent ' + w.want.slice(0, 12) + ')');
  }
  for (const f of named) {
    const p = SPEC.product[f], got = view.diskSha(f);
    if (p.pre === null) { added.push(f); continue; }
    const w = WANT.get(f);
    const m = MOVES.find(x => x.file === f);
    if (m) {
      const parentBytes = PARENT_TEXT.get(f);
      let body = parentBytes;
      m.hunks.forEach(([before, after], i) => {
        assert.equal(body.split(before).length, 2, 'declared hunk ' + (i + 1) + ' has exactly one site, applied in order: ' + f);
        body = body.replace(before, () => after);
      });
      assert.equal(view.diskText(f), body, 'the tree is the parent plus exactly its declared hunks: ' + f);
      assert.equal(got, sha(Buffer.from(body, 'utf8')), 'and that is the byte on disk: ' + f);
      if (m.own) {
        assert.equal(sha(Buffer.from(parentBytes, 'utf8')), w.want, 'the parent bytes at this sourceBase are the parent\'s ' + w.against + ': ' + f);
        assert.equal(p.role, 'edited', 'declared edited: ' + f);
        assert.equal(p.pre, w.want, 'pre is the parent post: ' + f);
        assert.equal(p.post, got, 'post is the byte on disk: ' + f);
      } else {
        const s14 = S14_SPEC.product[f];
        assert(s14 && s14.role === 'edited', 'S14 declared it edited: ' + f);
        assert.equal(sha(Buffer.from(parentBytes, 'utf8')), s14.pre, 'the bytes at S14\'s sourceBase are S14\'s declared pre: ' + f);
        assert.equal(s14.post, w.want, 'S14\'s declared post is the S14 artifact\'s post: ' + f);
        assert.equal(p.role, 'carried', 'declared carried here: ' + f);
        assert.equal(p.pre, p.post, 'its declared pre-image is its declared post-image: ' + f);
        assert.equal(got, p.post, 'and that is the byte on disk: ' + f);
        assert.equal(got, w.want, 'which is the parent\'s own ' + w.against + ': ' + f);
      }
      moved.push({ f, m, pre: sha(Buffer.from(parentBytes, 'utf8')), post: got });
      continue;
    }
    assert.equal(p.role, 'carried', 'a named engine file is declared carried: ' + f);
    assert.equal(p.pre, p.post, 'its declared pre-image is its declared post-image: ' + f);
    assert.equal(got, p.post, 'and that is the byte on disk: ' + f);
    assert.equal(got, w.want, 'which is the parent\'s own ' + w.against + ': ' + f);
    carried.push({ f, got, against: w.against });
  }
  assert.deepEqual(moved.map(x => x.f).sort(), MOVE_FILES.slice().sort(), 'exactly the two declared files are the engine bytes that move');
  assert.deepEqual(added, [], 'and no engine file is added');
  assert.equal(rows.length + named.length, tracked.length, 'the split is exhaustive');
  return { rows, moved, carried, added };
}

function realView() {
  const cache = new Map();
  const bytes = f => { if (!cache.has(f)) cache.set(f, fs.readFileSync(path.join(REPO, f))); return cache.get(f); };
  return { diskSha: f => sha(bytes(f)), diskText: f => bytes(f).toString('utf8') };
}

/* The plants: in-memory views over the real one. */
const UNDECLARED = '  const undeclaredByThisPackage = 0;\n';
function plants(real) {
  const thirdNamed = named.find(f => f.endsWith('.cjs') && !MOVE_FILES.includes(f) && SPEC.product[f].pre !== null);
  const thirdOutside = outside[0];
  const flip = (f) => ({ diskSha: g => (g === f ? sha(Buffer.from('planted move of ' + g, 'utf8')) : real.diskSha(g)), diskText: real.diskText });
  const energy = MOVES[0].file;
  const text = real.diskText(energy);
  const anchor = MOVES[0].hunks[0][1];
  assert.equal(text.split(anchor).length, 2, 'the plant\'s anchor (hunk 1\'s after) has one site');
  const plantedText = text.replace(anchor, () => anchor + UNDECLARED);
  const inside = { diskSha: g => (g === energy ? sha(Buffer.from(plantedText, 'utf8')) : real.diskSha(g)), diskText: g => (g === energy ? plantedText : real.diskText(g)) };
  return [
    { id: 'P1', what: 'a third, named carried engine file moves: ' + thirdNamed, view: flip(thirdNamed), expect: 'and that is the byte on disk: ' + thirdNamed },
    { id: 'P2', what: 'a third engine file outside the product moves: ' + thirdOutside, view: flip(thirdOutside), expect: 'engine file outside the brief moved: ' + thirdOutside },
    { id: 'P3', what: 'an undeclared line inside ' + energy, view: inside, expect: 'the tree is the parent plus exactly its declared hunks: ' + energy },
  ];
}

function main(view) {
  const r = check(view);
  for (const x of r.rows) console.log('  SAME ' + x.f + ' ' + x.got.slice(0, 12) + ' against the ' + x.against);
  for (const x of r.carried) console.log('  CARRIED ' + x.f + ' ' + x.got.slice(0, 12) + ' against the ' + x.against + ' (declared, pre === post)');
  for (const x of r.moved) console.log('  MOVED ' + x.f + ' ' + x.pre.slice(0, 12) + ' -> ' + x.post.slice(0, 12) + ' against ' + x.m.base + ' (' + x.m.hunks.length + ' declared hunk(s), ' + x.m.note + ')');
  const ps = plants(view);
  for (const p of ps) {
    assert.throws(() => check(p.view), (e) => e instanceof assert.AssertionError && e.message.startsWith(p.expect), 'PLANT ' + p.id + ' must be refused: ' + p.what);
    console.log('  PLANT ' + p.id + ' RED: ' + p.what);
  }
  const mv = MOVES.map(m => m.file + ' (' + m.hunks.length + ' hunks against ' + m.base + ')').join(' and ');
  console.log('ENGINE FILES DIFFERENTIAL: ' + r.rows.length + ' tracked rebuild/engine file(s) outside this package\'s declared product, all byte-identical to the parent; '
    + r.moved.length + ' named files move since the S11 seal, each by its declared hunks only: ' + mv + '; '
    + r.carried.length + ' named file(s) carried byte-identical to the parent; ' + r.added.length + ' added; ' + ps.length + ' plants RED');
}

if (require.main === module) main(realView());
module.exports = { check, realView, plants, main, MOVES, named, outside, tracked, WANT };
