#!/usr/bin/env node
'use strict';
/* SEAL-AUTOMATION / new-child.cjs
   Generates the MECHANICAL half of a reseal child package (S6 -> S7 -> S8 -> S9 -> ...)
   into a scratch --out folder. It never writes into the tree; --write does not exist in
   this round on purpose (DECISIONS: the PM adds it when the generated diff has been
   reviewed once).

   WHAT IT DOES NOT DO, and says so in TODO.md every run: the brief, the theme sentence,
   the three token line texts, the receipt line, the review json, and every judgment about
   WHAT a package means. Those are the PM's, and the generator leaves each one a blank it
   names.

   usage:
     node rebuild/lanes/b/tooling/gen/new-child.cjs \
       --id S9 --name M2-S9-UI-PINS --parent S8 --head <commit> \
       --child-root rebuild/lanes/c/ui-pins/ [--child-root ...] \
       --dispatch-line 539 --out %TEMP%\s9-gen [--stage hunks|package|all] [--plan]
*/
const fs = require('fs');
const path = require('path');
const M = require('./lib/measure.cjs');
const { subsFor, mirrorText, prosePlaces } = require('./lib/mirror.cjs');
const F = require('./lib/family.cjs');

const RUNNER_PATH = 'rebuild/lanes/b/tooling/b-package.cjs';
const SPEC_DIR = 'rebuild/lanes/b/tooling/packages';
const CELL_DIR = 'rebuild/m4/workout/test';
const TOOLING_CELL = 'rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs';
const WORKFLOW = '.github/workflows/rebuild.yml';
const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..');

function parseArgv(argv) {
  const o = { childRoots: [], stage: 'all', plan: false, root: REPO };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i], next = () => argv[++i];
    if (a === '--id') o.id = next();
    else if (a === '--name') o.name = next();
    else if (a === '--parent') o.parent = next();
    else if (a === '--head') o.head = next();
    else if (a === '--child-root') o.childRoots.push(next());
    else if (a === '--out') o.out = next();
    else if (a === '--stage') o.stage = next();
    else if (a === '--dispatch-line') o.dispatchLine = Number(next());
    else if (a === '--repo') o.root = path.resolve(next());
    else if (a === '--post-head') o.postHead = next();
    else if (a === '--base') o.base = next();
    else if (a === '--parent-seal') o.parentSeal = next();
    else if (a === '--tip-ref') o.tipRef = next();
    else if (a === '--exclude') (o.exclude = o.exclude || []).push(next());
    /* --needle-repeat N (1..3, default 1): run each child N times and record its needle
       only if every run printed it at a line start. A child that disagrees with itself is
       a flake, and a package must not pin one (R1 B1). */
    else if (a === '--needle-repeat') o.needleRepeat = Number(next());
    /* --released <path>, repeatable: a path a RELEASE-FROM-SEAL ruling has granted
       (rebuild/lanes/b/S9-RELEASE-SPEC.md). The generator never proposes this role. */
    else if (a === '--released') (o.released = o.released || []).push(next());
    /* --subst "OLD=NEW", repeatable: one more token pair for the mirror, for the facts
       only this round knows - the accepted lane rounds this package carries and their
       ledger citations. Without them every mirrored comment still tells the PARENT's
       product story, which is true prose about the wrong package, and TODO.md says so. */
    else if (a === '--subst') (o.subst = o.subst || []).push(next());
    else if (a === '--plan') o.plan = true;
    else if (a === '--quiet') o.quiet = true;
    else throw new Error('GEN-ARGV-UNKNOWN ' + a);
  }
  return o;
}
const STAGES = [
  ['a', 'runner hunks: IDS + the new id behind the parent, NO_REGISTER_IDS, CHILD_ROOTS, each with the parent round\'s reason comment mirrored'],
  ['b', 'the s<N>-supersede-* cells and the engine-files differential, mirrored name for name from the parent family'],
  ['c', 'F6/F7 in the lane B tooling cell (the IDS list, its length, the NO_REGISTER set, the CHILD_ROOTS list and its length)'],
  ['d', 'the CHILD_SPECS additions in every product cell that declares one'],
  ['e', 'packages/<ID>.json: parent by artifact sha256, every declared path pre/post from GIT BLOBS, roles from the diff, the standing CI step named inside the package'],
  ['f', 'the runner sha256 re-pinned in every ancestor spec that pins it, computed AFTER the runner hunks apply'],
  ['g', 'the child needles, measured by running each child the way children() runs it (--ci side only)'],
  ['h', 'the rebuild.yml standing step edit'],
  ['i', 'final-lines.txt: THEME / BRIEF-BY-SHA / GATE-SUPERSESSION with the sha256 over the line bytes, prose left blank'],
  ['j', 'TODO.md: everything it could not decide, each with the reason'],
];

const slugOf = name => String(name).replace(/^M2-/, '').toLowerCase();       // M2-S8-REAL-SHAPE -> s8-real-shape
const idSlug = id => String(id).toLowerCase();                              // S8 -> s8
const specPath = id => SPEC_DIR + '/' + id + '.json';

function readSpec(root, rev, id) {
  const b = M.blobBytes(root, rev, specPath(id));
  if (!b) throw new Error('GEN-PARENT-SPEC-ABSENT ' + specPath(id) + ' at ' + rev);
  return JSON.parse(b.toString('utf8'));
}
/* An ancestor's GATE-SUPERSESSION ledger line is located the way the runner locates it:
   by the sha256 the spec records, never by number (b-package.cjs rulingText()). */
function gateLineOf(decisions, spec) {
  const want = spec.coverage && spec.coverage.superseded && spec.coverage.superseded.rulingLineSha256;
  if (!want) return null;
  for (let i = 0; i < decisions.length; i += 1) if (M.sha256Text(decisions[i]) === want) return i + 1;
  return null;
}
/* [ ..., greatGrandparent, grandparent, parent, child ] - each generation read from the
   spec it names as its parent, so the chain is the tree's, not an argument's. */
function buildChain(root, rev, parentId, child, decisions) {
  const chain = [];
  let id = parentId;
  /* THREE generations back and no further, which is as deep as the family's own prose
     goes: the GATE-SUPERSESSION line names the child, the grandchild and the
     great-grandchild and then stops counting by name. A fourth hop was measured against
     the real S8 round and made things WORSE - it shifted an id in a sentence that was an
     enumeration being extended, not a token being swapped. */
  for (let hop = 0; id && hop < 3; hop += 1) {
    const s = readSpec(root, rev, id);
    chain.unshift({ id, name: s.packageId, slug: idSlug(id), artifactSlug: slugOf(s.packageId), gateLine: gateLineOf(decisions, s), spec: s });
    id = s.parent && s.parent.chosen;
  }
  chain.push(child);
  return chain;
}

/* (a) THE RUNNER HUNKS. Three statements move; three mirrored comment blocks arrive with
   them. Nothing else in b-package.cjs is touched, which is what made the S8 round's
   runner diff readable in one sitting (DECISIONS:524: "exactly three hunks"). */
function editRunner(src, ctx) {
  const R = F.parseRunner(src);
  const L = R.L.slice();
  const P = ctx.parent, C = ctx.child;
  const blocks = {};
  const take = (at, key) => {
    const b = F.parentBlockAbove(L, at, P.name, '//');
    if (!b) throw new Error('GEN-PARENT-BLOCK-NOT-FOUND ' + key + ' (expected a comment opening with ' + P.name + ')');
    blocks[key] = L.slice(b.start, b.end);
    return b;
  };
  const bIds = take(R.idsAt, 'IDS');
  const bNri = take(R.nriAt, 'NO_REGISTER_IDS');
  const bCr = take(R.childRootsEndAt, 'CHILD_ROOTS');
  /* Two citations the parent's own block carries that must be RE-MEASURED rather than
     mirrored: the dispatch line (an argument, because it is this round's ledger line) and
     the argv gate's line number (measured in the runner this hunk is being applied to). */
  ctx.parentDispatchLine = (blocks.IDS.join('\n').match(/DECISIONS:(\d+) dispatches this one/) || [])[1];
  const parentArgv = F.parentArgvCitation(blocks.IDS);
  const subs = ctx.subs = subsFor({ chain: ctx.chain, dispatchLine: ctx.dispatchLine, parentDispatchLine: ctx.parentDispatchLine });
  /* Two more pure identifier shifts, both measured out of the tree: the parent's own
     child root becomes this one's (the prose names the root by path in six places), and
     the parent's own Y1 child name becomes this one's. Neither is prose - both are names
     the runner reads - so both are safe where an ordinal is not. */
  if (R.childRootsLast && ctx.childRoots.length) subs.map.set(R.childRootsLast, ctx.childRoots[0]);
  const pOwn = (ctx.parentSpec.children || []).find(c => c.argv.some(a => R.childRootsLast && a.startsWith(R.childRootsLast)));
  if (pOwn && ctx.ownChildName) subs.map.set(pOwn.name, ctx.ownChildName);
  for (const s of ctx.subst) { const k = s.indexOf('='); if (k > 0) subs.map.set(s.slice(0, k), s.slice(k + 1)); }
  if (parentArgv && R.argvGateAt) subs.map.set(':' + parentArgv, ':' + R.argvGateAt);
  rebuild(subs);
  /* Every ORDINAL inside a mirrored block is one generation stale by construction ("the
     NINETEENTH root", "a fourth time", "the FIFTH GENERATION"). The generator does NOT
     shift them: "the first of the nineteen gates refusing" is an ordinal too and shifting
     it would be a lie. Each one is listed in TODO.md by file and line instead. */
  for (const [k, b] of Object.entries(blocks)) prosePlaces(b.map(mirrorTextWith(subs)).join('\n'), RUNNER_PATH + ' (' + k + ' block)').forEach(p => ctx.prose.push(p));
  const mir = t => mirrorText(t, subs);
  const newIds = R.idsList.slice(); newIds.splice(newIds.indexOf(P.id) + 1, 0, C.id);
  const newNri = R.nriList.concat([C.id]);
  const idsLine = L[R.idsAt].replace(/\[[^\]]*\]/, '[' + newIds.map(q).join(', ') + ']');
  const nriLine = L[R.nriAt].replace(/\[[^\]]*\]/, '[' + newNri.map(q).join(', ') + ']');
  const crLast = L[R.childRootsEndAt];
  const indent = (crLast.match(/^\s*/) || [''])[0];
  const roots = ctx.childRoots.map(r => indent + q(r));
  const out = [];
  L.forEach((line, i) => {
    if (i === R.idsAt) { out.push(...blocks.IDS.map(mir), idsLine); return; }
    if (i === R.nriAt) { out.push(...blocks.NO_REGISTER_IDS.map(mir), nriLine); return; }
    if (i === R.childRootsEndAt) {
      out.push(crLast.replace(/\];\s*$/, ','), ...blocks.CHILD_ROOTS.map(mir));
      roots.forEach((r, k) => out.push(k === roots.length - 1 ? r + '];' : r + ','));
      return;
    }
    out.push(line);
  });
  return { text: out.join('\n'), parsed: R, blocks, newIds, newNri };
}
const q = s => "'" + s + "'";
const mirrorTextWith = subs => t => mirrorText(t, subs);
function rebuild(subs) {
  const keys = [...subs.map.keys()].sort((a, b) => b.length - a.length);
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const body = keys.map(k => (/^[A-Za-z]/.test(k) ? '\\b' : '') + esc(k) + (/[A-Za-z0-9]$/.test(k) ? '\\b' : '')).join('|');
  subs.re = new RegExp('(' + body + ')', 'g');
}

/* (b) THE SUPERSEDE CELLS AND THE ENGINE-FILES DIFFERENTIAL, name for name. */
function mirrorCells(root, rev, ctx) {
  const names = M.gitText(root, ['ls-tree', '--name-only', rev, CELL_DIR + '/'])
    .split('\n').map(s => s.trim()).filter(f => new RegExp('/' + ctx.parent.slug + '-').test(f));
  if (!names.length) throw new Error('GEN-PARENT-CELLS-ABSENT under ' + CELL_DIR + ' for ' + ctx.parent.slug);
  return names.map(f => {
    const text = M.blobBytes(root, rev, f).toString('utf8');
    const to = f.replace(new RegExp('/' + ctx.parent.slug + '-'), '/' + ctx.child.slug + '-');
    return { from: f, path: to, text: mirrorText(text, ctx.subs), prose: prosePlaces(text, to) };
  });
}
/* (c) F6/F7. The cell reads the runner's own exported constants, so the facts it asserts
   are the three lists the hunks above just moved plus their two lengths. Every assertion
   is rebuilt from the MEASURED post-hunk constants; the surrounding narrative is the
   parent's, mirrored. */
function editToolingCell(src, ctx, post) {
  const oldIds = '[' + ctx.parentIds.map(q).join(', ') + ']';
  const newIds = '[' + post.newIds.map(q).join(', ') + ']';
  const oldNri = '[' + ctx.parentNri.slice().sort().map(q).join(', ') + ']';
  const newNri = '[' + post.newNri.slice().sort().map(q).join(', ') + ']';
  const L = src.split('\n'); const out = [];
  const nIds = post.newIds.length, nRoots = ctx.childRootsAll.length;
  /* The four statements that carry a fact, each with the parent round's own reason block
     mirrored in behind the parent's. A block that is not there is reported by the caller
     rather than invented. */
  const anchor = l => /assert\.deepEqual\(api\.IDS\.slice\(/.test(l) || /assert\.deepEqual\(\[\.\.\.api\.NO_REGISTER_IDS\]/.test(l)
    || /^test\('F7\b/.test(l) || /assert\.equal\(api\.CHILD_ROOTS\.length,/.test(l);
  const blocks = [];
  L.forEach((l, i) => { if (anchor(l)) { const b = mirroredBlockAt(L, i, ctx.parent.name, ctx.subs); if (b) blocks.push([i, b]); else ctx.noBlock.push('pinned-unchanged cell line ' + (i + 1)); } });
  const at = new Map(blocks);
  L.forEach((line, i) => {
    let l = line;
    if (l.includes(oldIds)) l = l.split(oldIds).join(newIds);
    if (l.includes(oldNri)) l = l.split(oldNri).join(newNri);
    l = l.replace(/api\.IDS\.slice\(0,\s*\d+\)/g, 'api.IDS.slice(0, ' + nIds + ')')
         .replace(/(assert\.equal\(api\.IDS\.length,\s*)\d+/g, '$1' + nIds)
         .replace(/(assert\.equal\(api\.CHILD_ROOTS\.length,\s*)\d+/g, '$1' + nRoots);
    if (at.has(i)) out.push(...at.get(i));
    out.push(l);
  });
  return insertRoots(out.join('\n'), ctx);
}
/* The CHILD_ROOTS array literal is spelled out twice in F7 (whole, and .slice(8)). The new
   root joins both, directly behind the parent's, at the same indent. */
function insertRoots(text, ctx) {
  const last = ctx.parentLastRoot;
  return text.split('\n').map(l => {
    const m = l.match(new RegExp("^(\\s*)'" + last.replace(/[/]/g, '\\/') + "',\\s*$"));
    if (!m) return l;
    return [l].concat(ctx.childRoots.map(r => m[1] + q(r) + ',')).join('\n');
  }).join('\n');
}

/* Every one of these four edits carries the SAME narrative move: the parent round wrote a
   comment block naming itself directly above the statement it changed, and the child adds
   a mirror of that block behind it. This finds the parent's block above a given line -
   either a run of `//` lines or one whole `/* ... *​/` comment - and returns the mirrored
   copy to insert. A file where no such block stands is reported, never guessed at. */
function mirroredBlockAt(L, stmtIdx, parentName, subs, prefix) {
  const px = prefix || '//';
  const run = new RegExp('^\\s*' + px.replace(/[/*#]/g, '\\$&'));
  const opens = new RegExp('^\\s*(?:' + px.replace(/[/*#]/g, '\\$&') + '|\\/\\*)?\\s*' + parentName.replace(/-/g, '\\-') + '\\b');
  if (run.test(L[stmtIdx - 1] || '')) {
    let top = stmtIdx; while (top > 0 && run.test(L[top - 1])) top -= 1;
    for (let i = top; i < stmtIdx; i += 1) if (opens.test(L[i])) return L.slice(i, stmtIdx).map(t => mirrorText(t, subs));
    return null;
  }
  if (/\*\/\s*$/.test(L[stmtIdx - 1] || '')) {
    let top = stmtIdx - 1; while (top > 0 && !/^\s*\/\*/.test(L[top])) top -= 1;
    if (opens.test(L[top])) return L.slice(top, stmtIdx).map(t => mirrorText(t, subs));
    return null;
  }
  return null;
}
/* (d) CHILD_SPECS. Every product cell that polices sealed bytes carries its own
   `const CHILD_SPECS = [...]`, youngest last, and the new id joins each of them. The
   files are FOUND, not listed: a list in this generator would go stale the first time a
   lane adds a cell, and a missed one reads as undeclared drift at the next seal. */
function childSpecsFiles(root, rev) {
  const r = M.git(root, ['grep', '-l', '--fixed-strings', '-e', 'const CHILD_SPECS = [', rev], { encoding: 'utf8' });
  if (r.status !== 0) return [];
  return r.stdout.split('\n').map(s => s.trim()).filter(Boolean).map(s => s.slice(s.indexOf(':') + 1));
}
function editChildSpecs(src, ctx) {
  const L = src.split('\n'); const at = L.findIndex(l => /^const CHILD_SPECS = \[/.test(l));
  if (at < 0) return null;
  const list = F.listOf(L[at], '[', ']').map(s => s.replace(/'/g, ''));
  if (list.includes(ctx.child.id)) return { text: src, already: true };
  const block = mirroredBlockAt(L, at, ctx.parent.name, ctx.subs);
  const line = L[at].replace(/\[[^\]]*\]/, '[' + list.concat([ctx.child.id]).map(q).join(', ') + ']');
  const out = L.slice(0, at).concat(block || [], [line], L.slice(at + 1));
  return { text: out.join('\n'), block: !!block, list: list.concat([ctx.child.id]) };
}

/* (h) THE STANDING CI STEP. VERDICT-S6.md rule (a): the flip lives INSIDE the package's
   own post, never at the fast-forward. The step NAME is mechanical too - the child's own
   words go in front of the parent's whole list, which is exactly what S6->S7 and S7->S8
   did - and the comment above it is the parent's block, mirrored. */
const words = name => { const p = String(name).replace(/^M2-/, '').split('-'); return [p[0]].concat(p.slice(1).map(s => s.toLowerCase())).join(' '); };
function editWorkflow(src, ctx) {
  const L = src.split('\n');
  const runAt = L.findIndex(l => l.includes('b-package.cjs --ci --package ' + ctx.parent.id));
  if (runAt < 0) throw new Error('GEN-STANDING-STEP-NOT-FOUND for --package ' + ctx.parent.id);
  let nameAt = runAt; while (nameAt > 0 && !/^\s*- name:/.test(L[nameAt])) nameAt -= 1;
  const block = mirroredBlockAt(L, nameAt, ctx.parent.name, ctx.subs, '#');
  const oldName = L[nameAt].replace(/^\s*- name:\s*/, '');
  const newName = oldName.startsWith('Cumulative ')
    ? 'Cumulative ' + words(ctx.child.name) + ', ' + oldName.slice('Cumulative '.length)
    : null;
  const out = L.slice();
  out[runAt] = L[runAt].replace('--package ' + ctx.parent.id, '--package ' + ctx.child.id);
  if (newName) out[nameAt] = L[nameAt].replace(oldName, newName);
  let text = out.slice(0, nameAt).concat(block || [], out.slice(nameAt)).join('\n');
  /* THE LANE-CELL STEP. DECISIONS:117 (4) and :186 (3): a suite the phone's path depends
     on and no workflow names is a suite nobody runs. The run line is mechanical - the
     cells under the child roots, by exact path, never globbed, in the order ls-tree gives
     them - and the step NAME is a sentence about what those cells prove, which is left a
     blank ON PURPOSE: the file will not parse as a workflow until a human has written it,
     so it cannot be committed unread. */
  let step = null;
  if (ctx.childRoots.length && ctx.laneCells && ctx.laneCells.length) {
    const K = text.split('\n');
    const prevRun = K.findIndex(l => ctx.parentRootHint && l.includes(ctx.parentRootHint));
    const anchor = prevRun >= 0 ? prevRun : K.findIndex(l => l.includes('--package ' + ctx.child.id));
    let nAt = anchor; while (nAt > 0 && !/^\s*- name:/.test(K[nAt])) nAt -= 1;
    const ind = (K[nAt].match(/^\s*/) || [''])[0];
    const blk = mirroredBlockAt(K, nAt, ctx.parent.name, ctx.subs, '#') || [];
    step = blk.concat([ind + '- name: ' + TODO_BLANK, ind + '  run: node --test ' + ctx.laneCells.join(' ')]);
    text = K.slice(0, anchor + 1).concat(step, K.slice(anchor + 1)).join('\n');
  }
  return { text, nameChanged: !!newName, hadBlock: !!block, oldName, newName, laneStep: !!step };
}
/* The lane cells the child roots hold, named by exact path and never globbed - the rule
   the rebuild.yml comment states for S7's three and S8's eight. */
function laneCellsUnder(root, rev, roots) {
  const out = [];
  for (const r of roots) {
    const t = M.git(root, ['ls-tree', '--name-only', rev, r], { encoding: 'utf8' });
    if (t.status !== 0) continue;
    for (const f of t.stdout.split('\n').map(s => s.trim()).filter(Boolean)) if (/\.test\.(mjs|cjs)$/.test(f)) out.push(f);
  }
  return out;
}

const TODO_BLANK = '<<<PM: this is a judgment or a hand-written line; the generator leaves it blank>>>';
/* (e) THE PACKAGE. Every sha256 below comes from a GIT BLOB; nothing is read off disk and
   nothing is carried from the parent's file without being re-measured against it. */
function buildPackage(root, ctx, todo) {
  const P = ctx.parentSpec, sb = ctx.sourceBase, ph = ctx.postHead;
  const parentPins = P.product;
  const changed = M.diffNames(root, ctx.parentSeal, ph);
  const candidates = new Set(Object.keys(parentPins));
  candidates.add(specPath(ctx.parent.id));
  for (const f of changed) candidates.add(f);
  const product = {}, mismatches = [], undecided = [], droppedMd = [];
  for (const f of [...candidates].sort()) {
    if (f === specPath(ctx.child.id)) continue;                        // a package never pins itself
    /* briefs, reports, reviews and the ledger are not product - but the drop is RECORDED
       (R1 N5), because it is the one skip in this loop that used to say nothing and
       DECISIONS:519's slice-deploy trigger is exactly a new .md
       (rebuild/slice/pwa/DEPLOYS.md). One TODO line names them all rather than one line
       each: a round moves a dozen .md files and a wall of them would bury the rest. */
    if (/\.md$/i.test(f) && !(f in parentPins)) { droppedMd.push(f); continue; }
    const pre = M.blobSha256(root, sb, f), post = M.blobSha256(root, ph, f);
    if (post === null) { undecided.push({ f, why: 'present in the diff but absent at the post head; deleted paths are a PM ruling (DECISIONS:487 stop 2 shape), not a generated one' }); continue; }
    const pinned = Object.prototype.hasOwnProperty.call(parentPins, f);
    if (pinned && pre !== parentPins[f].post) mismatches.push({ f, parentPost: parentPins[f].post, measuredPre: pre });
    let role;
    /* THE RELEASED ROLE (rebuild/lanes/b/S9-RELEASE-SPEC.md, sections B.2 and B.4). It is
       the sixth member of PRODUCT_ROLES and it is NOT a measurement: a path is released
       only by a RELEASE-FROM-SEAL token line the PM rules, and the runner asserts the
       released set equals that ruling's granted set in both directions. So the generator
       will never propose it - it only obeys --released, and then it obeys the shape the
       spec fixes: the path stays DECLARED (the completeness walk still finds it), `pre`
       is the parent's own post, and `post` is null because a released file has no
       post-image in this package. The ruling line itself goes to TODO.md. */
    if (ctx.released.includes(f)) {
      if (!pinned) { undecided.push({ f, why: 'given as --released but the parent does not pin it; only a path the parent sealed can be released from the seal' }); continue; }
      todo.push({ what: 'the RELEASE-FROM-SEAL token line for ' + f, why: 'the runner requires the released set to equal the granted set of a PM ruling line, in both directions. The generator declares the role and nothing else; the line, and the artifact released block proposed() builds from it, are the PM\'s.' });
      product[f] = { pre, post: null, role: 'released' };
      continue;
    }
    if (f === specPath(ctx.parent.id)) role = 'superseded-by-child';
    else if (!pinned) role = 'new';
    else role = (pre === post) ? 'carried' : 'edited';
    if (ctx.exclude.includes(f)) { undecided.push({ f, why: 'EXCLUDED by --exclude: a PM ruling keeps it undeclared (the DECISIONS:524 N1 shape). It is still in the lane diff, so it must be given a CI home by exact path.' }); continue; }
    /* R1 N8. The runner requires pre === null OR pre !== post for role `new`, so a path
       that fails that test cannot be declared at all: it is REFUSED here, not written
       into the JSON with a TODO line contradicting it. */
    if (role === 'new' && pre !== null && pre === post) {
      undecided.push({ f, why: 'role:new but pre === post; the runner requires pre === null OR pre !== post, so this path cannot be declared new and is NOT declared. Either it belongs to an earlier package, or the PM declares it with another role by hand.' });
      continue;
    }
    /* R1 N4. A `new` path that NO DECLARED CHILD executes is the exact shape DECISIONS:524
       N1 ruled on: the PM kept the two p3-layout-v2 cells UNDECLARED and gave them a CI
       home by exact path instead. That path gets that reason by name; a new path under a
       declared child root gets the ordinary one. The wording is the difference between a
       list the PM reads and a list the PM skims. */
    if (role === 'new') {
      const underRoot = (ctx.childRoots || []).some(r => f.startsWith(r));
      undecided.push({
        f,
        why: underRoot
          ? 'role:new and the parent does not pin it - confirm the PM means to declare it (DECISIONS:487 stop 7 makes a lanes/d file product only when a DECLARED CHILD executes it).'
          : 'role:new, the parent does not pin it, and it stands under NO declared child root (' + ((ctx.childRoots || []).join(', ') || 'none given') + '), so no declared child executes it. This is the DECISIONS:524 N1 shape: there the PM ruled such a path UNDECLARED and gave it a CI home by exact path instead. Answer with --exclude to keep it undeclared, or add a child root that executes it.',
      });
    }
    product[f] = { pre, post, role };
  }
  if (droppedMd.length) todo.push({
    what: 'the ' + droppedMd.length + ' new .md path(s) this package does NOT declare',
    why: 'a .md the parent does not already pin is dropped as prose (brief, report, review, ledger). Confirm none of them is product: DECISIONS:519\'s slice-deploy trigger is a new .md (rebuild/slice/pwa/DEPLOYS.md) and it is a real obligation of the seal. Dropped: ' +
      droppedMd.slice(0, 12).join(', ') + (droppedMd.length > 12 ? ' and ' + (droppedMd.length - 12) + ' more' : ''),
  });
  return { product, mismatches, undecided, changed, droppedMd };
}

/* (g) THE NEEDLES. Measured by RUNNING each declared child the way children() runs it.
   A needle that does not stand at the head of a line of the child's own stdout is not
   recorded at all - it is reported, because that is the refusal the runner would raise. */
function measureChildren(root, ctx, todo) {
  const out = [];
  /* R1 B1. The env FIRST, and if it is not children()'s env then nothing is measured at
     all. This is the one fact in the package with no second witness in Git, so it is the
     one place where "close enough" is worth less than a named blank. */
  const ce = M.childEnv(root);
  if (!ce.exact) {
    todo.push({
      what: 'EVERY CHILD NEEDLE (' + ctx.childDecls.length + ' children) - NOT MEASURED',
      why: 'children() runs each child under the env laws() builds at b-package.cjs:2085, and here that env cannot be reproduced: ' + ce.why +
        '. A needle measured under a different env is a `# pass N` the runner will not reproduce, so none was recorded. Run the generator from a worktree where the pinned reference build works (node_modules must really be present, esbuild 0.28.1), or take each needle from the --ci run that proves the child green.',
    });
    return ctx.childDecls.map(c => ({
      name: c.name, argv: c.argv, needle: TODO_BLANK, measured: false,
      how: 'NOT MEASURED: ' + ce.why, was: c.needle || null, status: null,
    }));
  }
  const repeat = Math.max(1, Math.min(3, ctx.needleRepeat || 1));
  for (const c of ctx.childDecls) {
    const runs = [];
    for (let k = 0; k < repeat; k += 1) runs.push(M.runChild(root, c.argv, ce.env));
    const r = runs[0];
    const tap = M.tapPassNeedle(r.out);
    const carried = c.needle;
    let needle = null, how = '';
    if (r.status !== 0) { how = 'CHILD EXIT ' + r.status + ' - not green on this head; the needle is NOT recorded'; }
    else if (/--test/.test(c.argv[0] || '') || c.argv.includes('--test')) { needle = tap; how = 'measured (node --test tap `# pass N`)'; }
    else if (carried && M.needleStandsAtLineStart(r.out, carried)) { needle = carried; how = 'the parent\'s needle re-measured on this head and still a terminal line'; }
    else { how = 'a non---test child whose parent needle no longer stands at a line start; the verdict text must be re-read by hand'; }
    if (needle && !M.needleStandsAtLineStart(r.out, needle)) { needle = null; how = 'CHILD-NEEDLE-NOT-A-TERMINAL-LINE; not recorded'; }
    /* --needle-repeat: a needle only stands if every run of the child produced it. One
       run is the default because 25 children cost minutes; two is what a PM should pass
       before a seal, and a child that disagrees with itself is a flake the package must
       not pin. */
    if (needle && repeat > 1) {
      const disagree = runs.findIndex(x => x.status !== 0 || !M.needleStandsAtLineStart(x.out, needle));
      if (disagree >= 0) { how = 'NOT REPRODUCED: run ' + (disagree + 1) + ' of ' + repeat + ' did not print this needle at a line start (exit ' + runs[disagree].status + '); not recorded'; needle = null; }
      else how += ', reproduced over ' + repeat + ' runs';
    }
    if (!needle) todo.push({ what: 'needle for child `' + c.name + '`', why: how });
    out.push({ name: c.name, argv: c.argv, needle: needle || TODO_BLANK, measured: !!needle, how, was: carried || null, status: r.status });
  }
  return out;
}
/* The parent's declared children, mirrored: the supersede cells and the differential take
   the child's own slug, everything else is carried by name and re-measured. */
function childDeclsFor(ctx, newOwnChild) {
  const list = ctx.parentSpec.children.map(c => ({
    name: c.name.replace(new RegExp('^' + ctx.parent.slug + '-'), ctx.child.slug + '-'),
    argv: c.argv.map(a => a.replace(new RegExp('/' + ctx.parent.slug + '-', 'g'), '/' + ctx.child.slug + '-')),
    needle: c.needle,
  }));
  if (newOwnChild) list.push(newOwnChild);
  return list;
}

/* (i) THE THREE TOKEN LINES. claim() and supersessionRuling() both match a ledger line by
   sha256(Buffer.from(line)) - the line's own bytes, leading dash included, the newline
   EXCLUDED, and the line NUMBER is never checked. So the sha can only be taken once the
   words are final, which is why this file is emitted with the prose blank and hashed by
   gen/hash-lines.cjs after the PM has written it. */
function finalLines(ctx, brief, todo) {
  const D = '<<<PM: the date this line is appended, YYYY-MM-DD>>>';
  const dated = s => s.replace(/^- \d{4}-\d{2}-\d{2} /, '- ' + D + ' ');
  /* THEME: the parent's line, mirrored, with the one sentence that says what this package
     MEANS taken out. That sentence is the whole point of the line and no tool writes it. */
  const pTheme = ctx.parentSpec.authorizations.theme.line;
  const head = pTheme.indexOf(' - ') >= 0 ? pTheme.slice(0, pTheme.indexOf(' - ') + 3) : pTheme;
  const theme = dated(mirrorText(head, ctx.subs)) + TODO_BLANK + ' · RULED';
  /* BRIEF-BY-SHA: mechanical end to end once the brief file exists, and this is the one
     of the three the generator can write in full. */
  const pBrief = ctx.parentSpec.brief.acceptedLedgerLine.line;
  const briefLine = brief
    ? dated(mirrorText(pBrief, ctx.subs)).replace(/sha256 [a-f0-9]{64}/, 'sha256 ' + brief.sha256).replace(/\(\d+ bytes\)/, '(' + brief.bytes + ' bytes)')
    : dated(mirrorText(pBrief, ctx.subs)) + "   <<<PM: the brief file is not at the head yet; sha256 and byte count are the PARENT'S and are WRONG>>>";
  if (!brief) todo.push({ what: 'BRIEF-BY-SHA line', why: 'the brief ' + ctx.briefFile + ' is not present at the post head, so its sha256 and size cannot be measured' });
  /* GATE-SUPERSESSION: the parent's own ruling line, read out of DECISIONS.md by the
     sha256 the parent spec records (never by number), mirrored one generation younger. */
  const gate = ctx.parentGateLineText
    ? dated(mirrorText(ctx.parentGateLineText, ctx.subs))
    : "<<<PM: the parent's GATE-SUPERSESSION line was not found by its recorded sha256; nothing to mirror>>>";
  return { theme, brief: briefLine, gate };
}

/* The spec object, key for key in the parent's own order so the diff between two
   generations is readable. Everything a human must decide is TODO_BLANK and is named in
   TODO.md; nothing is quietly carried from the parent. */
function assembleSpec(ctx, pins, kids, brief, todo) {
  const P = ctx.parentSpec, C = ctx.child;
  const mir = o => JSON.parse(mirrorText(JSON.stringify(o), ctx.subs));
  const parentArtifactSha = M.blobSha256(ctx.root, ctx.postHead, P.artifact.file);
  const parentReviewSha = M.blobSha256(ctx.root, ctx.postHead, P.artifact.review);
  if (!parentArtifactSha) todo.push({ what: 'parent artifact sha256', why: P.artifact.file + ' is not at the post head' });
  const s = {
    version: P.version,
    lanePackage: C.id,
    packageId: C.name,
    status: P.status,
    brief: {
      file: ctx.briefFile,
      sha256: brief ? brief.sha256 : TODO_BLANK,
      acceptedLedgerLine: { ledgerLine: 0, role: 'cowork', line: TODO_BLANK, lineSha256: TODO_BLANK },
    },
    sourceBase: ctx.sourceBase,
    dIds: P.dIds, laws: P.laws, carriedAcceptedIds: P.carriedAcceptedIds, privateLiveTriggered: P.privateLiveTriggered,
    parent: {
      decided: true, chosen: ctx.parent.id,
      options: [{
        id: ctx.parent.id, artifact: P.artifact.file, sha256: parentArtifactSha || TODO_BLANK,
        review: P.artifact.review, reviewSha256: parentReviewSha || TODO_BLANK,
        receiptLedgerLine: ctx.parentReceiptLine || 0,
        note: mirrorText(String((P.parent.options[0] || {}).note || ''), ctx.subs) + '  ' + TODO_BLANK,
      }],
    },
    tooling: { runner: P.tooling.runner, runnerSha256: ctx.runnerSha256 || TODO_BLANK },
    product: pins.product,
    coverage: Object.assign(mir(P.coverage), { superseded: Object.assign(mir(P.coverage.superseded), { rulingLineSha256: TODO_BLANK }) }),
    carrierSuccessor: mir(P.carrierSuccessor), witnessFlips: P.witnessFlips, protectedSurfaces: P.protectedSurfaces,
    authorizations: {
      owner: P.authorizations.owner, contract: P.authorizations.contract,
      theme: { ledgerLine: 0, role: 'cowork', line: TODO_BLANK, lineSha256: TODO_BLANK },
      review: { role: 'cowork', prefix: 'POSTFIX-ACCEPTANCE ' + C.name, terminal: 'ACCEPTED' },
    },
    artifact: { file: 'rebuild/m4/spec/acceptance-' + C.artifactSlug + '.json', review: 'rebuild/m4/spec/review-' + C.artifactSlug + '.json' },
    children: kids.map(k => ({ name: k.name, argv: k.argv, needle: k.needle })),
    notes: P.notes.map(n => mirrorText(n, ctx.subs) + '  ' + TODO_BLANK),
  };
  return s;
}

function writeOut(outDir, rel, text) {
  const p = path.join(outDir, rel.split('/').join(path.sep));
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text);
  return p;
}
function main(argv) {
  const o = parseArgv(argv);
  if (o.plan) { console.log('SEAL-AUTOMATION new-child.cjs --plan'); STAGES.forEach(([k, d]) => console.log('  (' + k + ') ' + d)); console.log('  nothing was measured: --plan reads no blob and runs no child.'); return 0; }
  for (const k of ['id', 'name', 'parent', 'head', 'out']) if (!o[k]) throw new Error('GEN-ARGV-MISSING --' + k);
  const root = o.root;
  const todo = [];
  const sourceBase = M.revParse(root, o.head);
  const base = M.revParse(root, o.base || o.head);
  const postHead = M.revParse(root, o.postHead || 'HEAD');
  const decisions = M.blobBytes(root, postHead, 'rebuild/DECISIONS.md').toString('utf8').split('\n');
  const child = { id: o.id, name: o.name, slug: idSlug(o.id), artifactSlug: slugOf(o.name), gateLine: null };
  const chain = buildChain(root, base, o.parent, child, decisions);
  const parent = chain[chain.length - 2], parentSpec = parent.spec;
  const parentSeal = o.parentSeal || M.gitText(root, ['merge-base', sourceBase, o.tipRef || 'origin/rebuild/t2-client-core']).trim();
  const ctx = {
    root, sourceBase, base, postHead, parentSeal, chain, parent, child, parentSpec,
    childRoots: o.childRoots, exclude: o.exclude || [], released: o.released || [], dispatchLine: o.dispatchLine, needleRepeat: o.needleRepeat,
    subst: o.subst || [], noBlock: [], prose: [], laneCells: laneCellsUnder(root, postHead, o.childRoots), parentRootHint: null,
    ownChildName: o.childRoots.length ? 'd-' + slugOf(o.name).replace(/^s\d+-/, '') : null,
    briefFile: 'rebuild/lanes/b/' + o.name.replace(/^M2-/, '') + '-BRIEF.md',
    parentIds: null, parentNri: null, parentLastRoot: null, childRootsAll: null,
    parentGateLineText: (function () { const w = parentSpec.coverage.superseded.rulingLineSha256; for (const l of decisions) if (M.sha256Text(l) === w) return l; return null; }()),
    parentReceiptLine: (function () { const re = new RegExp('POSTFIX-ACCEPTANCE ' + parent.name + ' [a-f0-9]{40} \\S+ [a-f0-9]{64} ACCEPTED$'); for (let i = 0; i < decisions.length; i += 1) if (re.test(decisions[i])) return i + 1; return null; }()),
  };
  /* R1 N9. --post-head defaults to HEAD, and every `post` sha, the candidate set and the
     lane cell list are read there. A post head that is not a descendant of --head is
     measuring this package against an unrelated tip, so it is said FIRST, before any
     other TODO line, and it is said whether or not the runner sha happens to agree. */
  const descends = M.isAncestor(root, sourceBase, postHead);
  if (descends !== true) todo.unshift({
    what: 'THE POST HEAD ' + postHead.slice(0, 8) + ' IS NOT A DESCENDANT OF --head ' + sourceBase.slice(0, 8),
    why: (descends === false
      ? 'git merge-base --is-ancestor says it is not in this head\'s history'
      : 'git merge-base --is-ancestor could not answer for these two revs') +
      '. Every `post` sha256 in this package, the candidate set (diff parentSeal..postHead) and the lane cell list were measured THERE. Pass --post-head explicitly, or re-run from the lane worktree once the round\'s own commits are on it.',
  });
  if (!ctx.parentGateLineText) todo.push({ what: 'the parent GATE-SUPERSESSION line', why: 'no line in rebuild/DECISIONS.md at ' + postHead.slice(0, 8) + ' hashes to ' + parentSpec.coverage.superseded.rulingLineSha256.slice(0, 12) + '; the mirror of the child line cannot be drafted' });
  if (!ctx.parentReceiptLine) todo.push({ what: 'parent.receiptLedgerLine', why: 'no POSTFIX-ACCEPTANCE line for ' + parent.name + ' was found in the ledger at the post head' });
  if (!o.dispatchLine) todo.push({ what: '--dispatch-line', why: 'the ledger line that dispatches this round is cited in the IDS comment; without it the mirrored comment still cites the PARENT round' });
  return run(ctx, o, todo);
}

function run(ctx, o, todo) {
  const root = ctx.root, out = path.resolve(o.out), say = m => { if (!o.quiet) console.log(m); };
  const parentRev = ctx.base;                           // the tree as it stands BEFORE these hunks
  const wrote = [];
  /* (a) the runner. Read from the blob so a dirty worktree cannot leak in. */
  const runnerSrc = M.blobBytes(root, parentRev, RUNNER_PATH).toString('utf8');
  const runner = editRunner(runnerSrc, ctx);
  ctx.parentIds = runner.parsed.idsList; ctx.parentNri = runner.parsed.nriList;
  ctx.parentLastRoot = runner.parsed.childRootsLast; ctx.parentRootHint = runner.parsed.childRootsLast;
  /* The list as it stands AFTER the hunk, read from the generated file - and read with
     the comment lines dropped first, because the reasons inside that array are full of
     apostrophes ("this package's own lane cells") and a bare /'[^']+'/ over the whole
     region counts three roots that are not there. Measured against the real S8 round:
     23 with the comments in, 20 with them out, and 20 is the answer F7 asserts. */
  ctx.childRootsAll = (function () {
    const L = runner.text.split('\n');
    const from = L.findIndex(l => /^const CHILD_ROOTS = \[/.test(l));
    const roots = [];
    for (let i = from; i < L.length; i += 1) {
      if (!/^\s*\/\//.test(L[i])) for (const m of (L[i].match(/'[^']*\/'/g) || [])) roots.push(m.replace(/'/g, ''));
      if (/\];\s*$/.test(L[i])) break;
    }
    return roots;
  }());
  wrote.push(['tree/' + RUNNER_PATH, runner.text]);
  ctx.runnerSha256 = M.sha256(Buffer.from(runner.text, 'utf8'));
  /* (b) the cells. */
  const cells = mirrorCells(root, parentRev, ctx);
  for (const c of cells) { wrote.push(['tree/' + c.path, c.text]); c.prose.forEach(p => todo.push({ what: 'prose in ' + c.path + ':' + p.line, why: 'an ordinal or counted enumeration the mirror cannot extend: ' + p.text })); }
  /* (c) F6/F7. */
  const tcSrc = M.blobBytes(root, parentRev, TOOLING_CELL).toString('utf8');
  const tc = editToolingCell(tcSrc, ctx, runner);
  wrote.push(['tree/' + TOOLING_CELL, tc]);
  /* (d) CHILD_SPECS. */
  const csFiles = childSpecsFiles(root, parentRev).filter(f => f !== TOOLING_CELL);
  const csDone = [];
  for (const f of csFiles) {
    const r = editChildSpecs(M.blobBytes(root, parentRev, f).toString('utf8'), ctx);
    if (!r) continue;
    if (r.already) { todo.push({ what: 'CHILD_SPECS in ' + f, why: 'already names ' + ctx.child.id + ' at the post head; left alone' }); continue; }
    if (!r.block) todo.push({ what: 'the reason comment above CHILD_SPECS in ' + f, why: 'no block naming ' + ctx.parent.name + ' stands above it, so there was nothing to mirror; write the reason by hand' });
    wrote.push(['tree/' + f, r.text]); csDone.push(f);
  }
  /* (h) the standing CI step. */
  const wfSrc = M.blobBytes(root, parentRev, WORKFLOW).toString('utf8');
  const wf = editWorkflow(wfSrc, ctx);
  wrote.push(['tree/' + WORKFLOW, wf.text]);
  if (!wf.hadBlock) todo.push({ what: 'the comment above the standing CI step', why: 'no block naming ' + ctx.parent.name + ' stands above it' });
  if (!wf.newName) todo.push({ what: 'the standing CI step NAME', why: 'the parent step is not named "Cumulative ...", so the child words could not be put in front of it' });
  if (wf.laneStep) todo.push({ what: 'the rebuild.yml lane-cell step NAME', why: 'the run line is generated by exact path; the NAME is a sentence about what those cells prove and is left as a blank, so the workflow does not parse until it is written' });
  else if (ctx.childRoots.length) todo.push({ what: 'the rebuild.yml lane-cell step', why: 'no .test file stands under ' + ctx.childRoots.join(', ') + ' at the post head, so no step was written' });
  for (const p of ctx.noBlock) todo.push({ what: 'the reason comment at ' + p, why: 'no block naming ' + ctx.parent.name + ' stands above that assertion, so there was nothing to mirror' });
  for (const p of ctx.prose) todo.push({ what: 'ordinal prose in ' + p.file + ' line ' + p.line, why: 'a mirrored block is one generation later than the words in it; the generator will not shift an ordinal because "the first of the nineteen gates" is one too. Read: ' + p.text });
  const ownName2 = ctx.ownChildName;
  const prevOwn = (ctx.parentSpec.children || []).find(c => ctx.parentLastRoot && c.argv.some(a => a.startsWith(ctx.parentLastRoot)));
  if (ownName2 && prevOwn) todo.push({ what: 'the Y1 own-child name `' + ownName2 + '`', why: 'derived from the package name the way `' + prevOwn.name + '` was derived from ' + ctx.parent.name + '; confirm it reads as a name for what those cells prove' });
  if (!ctx.subst.length) todo.push({ what: 'the product story in every mirrored comment', why: 'no --subst pair was given, so each mirrored block still names the PARENT round (' + ctx.parent.name + ') and its ledger citations. Pass --subst "P3-OLD=P3-NEW" for each accepted round this package carries, and re-read every block.' });
  return finish(ctx, o, todo, wrote, runner, cells, csDone, out, say);
}

function finish(ctx, o, todo, wrote, runner, cells, csDone, out, say) {
  const root = ctx.root;
  /* (f) THE ANCESTOR RE-PINS. Moving the runner moves runnerSha256, so every spec that
     pins it is edited. The sha is taken over the GENERATED runner text, and cross-checked
     against the blob at the post head when the hunks have already landed there. */
  const repinned = [], frozenPins = [];
  const atPost = M.blobSha256(root, ctx.postHead, RUNNER_PATH);
  /* WHICH specs get re-pinned, and it is not "every spec that names the runner".
     Measured on the S8 round (R1 N6 put the SET under test and this is what it found):
     H3, S3, S4, S5, S6 and S7 all pin the sha of the runner AS IT STANDS AT THE BASE, and
     the round moved all six. B-NTC, B1, B2, B3 and B4 pin 4482bb8a - an older runner,
     frozen where their own seal left it - and the round did not touch one of them. A spec
     that is already pinned to some other runner is not stale, it is HISTORY, and rewriting
     it would put five files into the diff that no reviewer asked for and quietly restate
     what those packages were sealed against. So the rule is: re-pin a spec only when it
     pins the runner this hunk is moving, and name the ones left alone. */
  const runnerAtBase = M.blobSha256(root, ctx.base, RUNNER_PATH);
  for (const id of ctx.parentIds) {
    const b = M.blobBytes(root, ctx.base, specPath(id));
    if (!b) continue;
    const s = JSON.parse(b.toString('utf8'));
    if (!s.tooling || s.tooling.runner !== RUNNER_PATH) continue;
    if (s.tooling.runnerSha256 !== runnerAtBase) { frozenPins.push(id + ' (' + String(s.tooling.runnerSha256).slice(0, 12) + ')'); continue; }
    s.tooling.runnerSha256 = ctx.runnerSha256;
    repinned.push(id);
    wrote.push(['tree/' + specPath(id), JSON.stringify(s, null, 2) + '\n']);
  }
  if (frozenPins.length) todo.push({
    what: 'the ' + frozenPins.length + ' spec(s) pinned to an OLDER runner and left alone',
    why: 'these pin a runner sha256 that is not the one at the base (' + String(runnerAtBase).slice(0, 12) + '), so they are frozen where their own seal left them and this round does not rewrite them. The S8 round did the same with B-NTC and B1..B4. If one of them must move, that is a PM ruling and a separate hunk. Left alone: ' + frozenPins.join(', '),
  });
  /* (e) + (g) THE PACKAGE AND THE NEEDLES. */
  const pins = buildPackage(root, ctx, todo);
  for (const m of pins.mismatches) todo.push({ what: 'PARENT PIN MISMATCH ' + m.f, why: 'the parent records post ' + m.parentPost.slice(0, 12) + ' and the blob at the source base is ' + String(m.measuredPre).slice(0, 12) + '; this is the check DECISIONS:511 calls "re-hashed from Git, 0 mismatches" and it did NOT pass' });
  for (const u of pins.undecided) todo.push({ what: 'declared path ' + u.f, why: u.why });
  const ownName = ctx.ownChildName;
  const laneCells = ctx.laneCells;
  const ownChild = ownName && laneCells.length ? { name: ownName, argv: ['--test', '--test-reporter=tap'].concat(laneCells), needle: null } : null;
  if (ctx.childRoots.length && !ownChild) todo.push({ what: 'the Y1 own-child', why: 'no .test file stands under ' + ctx.childRoots.join(', ') + ' at the post head, so MIN_OWN_CHILDREN = 1 cannot be met' });
  const decls = childDeclsFor(ctx, ownChild);
  ctx.childDecls = decls;
  /* S9-RELEASE-SPEC B.6: a released path must NOT be a child argv target, because
     proposed() puts every child argv target into executionPins and a released path that
     re-entered there would be silently re-pinned for a generation (risk R2). Measured
     here rather than trusted. */
  for (const f of ctx.released) for (const c of decls) if (c.argv.includes(f)) {
    todo.push({ what: 'RELEASED PATH IS A CHILD ARGV TARGET: ' + f + ' in child `' + c.name + '`', why: 'S9-RELEASE-SPEC B.6 / risk R2: proposed() puts every child argv target into executionPins, so the release would last one generation and then quietly undo itself. Re-home the cell or do not release the path.' });
  }
  const kids = o.stage === 'hunks' ? decls.map(d => Object.assign({}, d, { needle: d.needle || TODO_BLANK, measured: false, how: 'not run: --stage hunks' })) : measureChildren(root, ctx, todo);
  const briefBytes = M.blobBytes(root, ctx.postHead, ctx.briefFile);
  const brief = briefBytes ? { file: ctx.briefFile, sha256: M.sha256(briefBytes), bytes: briefBytes.length } : null;
  const spec = assembleSpec(ctx, pins, kids, brief, todo);
  wrote.push(['packages/' + ctx.child.id + '.json', JSON.stringify(spec, null, 2) + '\n']);
  wrote.push(['needles.json', JSON.stringify(kids, null, 2) + '\n']);
  /* (i) + (j). */
  const fl = finalLines(ctx, brief, todo);
  wrote.push(['final-lines.txt', finalLinesText(ctx, fl)]);
  wrote.push(['TODO.md', todoText(ctx, todo)]);
  wrote.push(['REPORT.json', JSON.stringify({
    id: ctx.child.id, name: ctx.child.name, parent: ctx.parent.id, sourceBase: ctx.sourceBase, base: ctx.base, postHead: ctx.postHead,
    parentSeal: ctx.parentSeal, runnerSha256: ctx.runnerSha256, runnerAtPostHead: atPost, runnerAgrees: atPost === ctx.runnerSha256,
    ids: runner.newIds, noRegisterIds: runner.newNri, childRoots: ctx.childRootsAll, childSpecsFiles: csDone,
    cells: cells.map(c => c.path), repinnedSpecs: repinned,
    declared: Object.keys(pins.product).length,
    roles: Object.values(pins.product).reduce((a, v) => (a[v.role] = (a[v.role] || 0) + 1, a), {}),
    parentPinsReHashed: Object.keys(ctx.parentSpec.product).length, parentPinMismatches: pins.mismatches.length,
    children: kids.length, needlesMeasured: kids.filter(k => k.measured).length, todo: todo.length,
  }, null, 2) + '\n']);
  for (const [rel, text] of wrote) writeOut(out, rel, text);
  say('SEAL-AUTOMATION ' + ctx.child.name + ' generated into ' + out);
  say('  declared ' + Object.keys(pins.product).length + ' paths ' + JSON.stringify(Object.values(pins.product).reduce((a, v) => (a[v.role] = (a[v.role] || 0) + 1, a), {})));
  say('  parent pins re-hashed ' + Object.keys(ctx.parentSpec.product).length + ', mismatches ' + pins.mismatches.length);
  say('  runner sha256 ' + ctx.runnerSha256.slice(0, 16) + (atPost === ctx.runnerSha256 ? ' (agrees with the blob at the post head)' : ' (the post head carries ' + String(atPost).slice(0, 16) + ')'));
  say('  children ' + kids.length + ', needles measured ' + kids.filter(k => k.measured).length + ', TODO ' + todo.length);
  return 0;
}

function finalLinesText(ctx, fl) {
  return ['SEAL-AUTOMATION final-lines.txt for ' + ctx.child.name,
    '',
    'THE RULE THE RUNNER APPLIES: claim() at b-package.cjs and supersessionRuling() both',
    'match a ledger line by sha256 over THE LINE BYTES - the leading "- " included, the',
    'newline EXCLUDED, UTF-8. The line NUMBER is never checked, so a renumber moves nothing.',
    'Fill the blanks, keep each line on ONE physical line, then run:',
    '  node rebuild/lanes/b/tooling/gen/hash-lines.cjs <this file>',
    'which prints the sha256 of each line as it then stands. Append the lines to the ledger',
    'BYTE-EXACT (the S7 chain did this with a script that re-checked each sha before',
    'writing, DECISIONS:515) and put the shas in the package.',
    '',
    '--- THEME (authorizations.theme) ---', fl.theme, '',
    '--- BRIEF-BY-SHA (brief.acceptedLedgerLine) ---', fl.brief, '',
    '--- GATE-SUPERSESSION (coverage.superseded.rulingLineSha256) ---', fl.gate, '',
    'sha256 of each line exactly as it stands above (they will change when you fill it in):',
    '  theme            ' + M.sha256Text(fl.theme),
    '  brief-by-sha     ' + M.sha256Text(fl.brief),
    '  gate-supersession ' + M.sha256Text(fl.gate), ''].join('\n');
}
function todoText(ctx, todo) {
  const L = ['# SEAL-AUTOMATION TODO - ' + ctx.child.name, '',
    'Everything below is something the generator could NOT decide, with the reason. It is',
    'not a list of nice-to-haves: until each line is answered by a human the package is',
    'incomplete, and the runner will say so.', ''];
  todo.forEach((t, i) => L.push((i + 1) + '. **' + t.what + '**', '   - ' + t.why, ''));
  if (!todo.length) L.push('(nothing - which has never happened yet; read the report before believing it)');
  return L.join('\n');
}
if (require.main === module) {
  try { process.exit(main(process.argv.slice(2))); }
  catch (e) { console.error('GEN FAILED: ' + e.message); process.exit(1); }
}
module.exports = { main, parseArgv, editRunner, editToolingCell, editChildSpecs, editWorkflow, mirrorCells, buildPackage, childDeclsFor, measureChildren, assembleSpec, finalLines, buildChain, slugOf, idSlug, words, STAGES, TODO_BLANK, specPath, RUNNER_PATH, TOOLING_CELL, WORKFLOW, CELL_DIR, childSpecsFiles, laneCellsUnder, mirroredBlockAt };
