/* P-MEASURE v1, ROUND 3 - BAR ITEMS (f) AND (g), EXECUTED.
   (f) nothing in this lane reaches the network or a store outside the device's
       own, scanned over the files that ACTUALLY touch the store; and
   (g) the sealed-byte drift of this ticket is today-app.cjs and nothing else,
       proved against package S4's own declared hashes rather than asserted. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT, readRepo } from './support.mjs';

const DIR = 'rebuild/m3/w7-preview/measure/';
const shaOf = (rel) => createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');
const codeOf = (text) => text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
const MODULES = fs.readdirSync(path.join(ROOT, DIR)).filter((n) => /\.(mjs|cjs)$/.test(n));
/* The three that genuinely reach the store or the client, named so the scan
   below cannot be satisfied by grepping files that touch nothing. */
const STORE_TOUCHING = ['measure-host.mjs', 'measure-commands.cjs', 'measure-baseline.mjs',
  'measure-screen.mjs'];
const S4 = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/S4.json'));

test('P-MEASURE (f) - this lane names no network and opens no store of its own', () => {
  assert(MODULES.length >= 7, 'the scan found almost nothing to scan');
  for (const name of STORE_TOUCHING) assert(MODULES.includes(name), name + ' is missing');
  for (const name of MODULES) {
    const code = codeOf(readRepo(DIR + name));
    assert.equal(/fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource/.test(code), false,
      name + ': a network call');
    assert.equal(/https?:\/\//.test(code), false, name + ': a network reference');
    assert.equal(/localStorage|sessionStorage|document\.cookie/.test(code), false,
      name + ': browser storage outside the device store');
    assert.equal(/indexedDB\.open\s*\(|new\s+Worker|importScripts/.test(code), false,
      name + ': a second store or a second runtime');
    assert.equal(/\bnode:fs\b|readFileSync|writeFileSync/.test(code), false, name + ': the filesystem');
  }
});

test('P-MEASURE (f) - the lane binds through the accepted client, and holds no repository of its own', () => {
  const host = codeOf(readRepo(DIR + 'measure-host.mjs'));
  assert.match(host, /era\.client\.hostBindings\(\{\s*workoutCommands/,
    'the lane must open through the accepted extension point');
  assert.equal(/era\.create(Reading|Gym|CheckIn|Setup|MachineSettings)Host/.test(host), false,
    'the lane reaches for a w6 factory of its own');
  assert.equal(/createRepository|new\s+Repository/.test(host), false,
    'the lane opens a repository of its own');
  /* And every read of the athlete's own history goes through ONE generation:
     the one the accepted repository hands back. */
  const reads = host.match(/bindings\.repository\.load\(\)/g) || [];
  assert(reads.length >= 6, 'the readers do not all stand on the same generation');
});

test('P-MEASURE (g) - package S4 pins none of this lane\'s new files', () => {
  const product = S4.product || {};
  const pinned = Object.keys(product);
  assert(pinned.length > 50, 'S4 was not read, so this cell would prove nothing');
  for (const name of [...MODULES, 'measure-fixture.json']) {
    assert.equal(Object.hasOwn(product, DIR + name), false,
      DIR + name + ' is pinned by S4: this ticket\'s new home is the wrong one');
  }
  for (const name of fs.readdirSync(path.join(ROOT, DIR, 'test'))) {
    assert.equal(Object.hasOwn(product, DIR + 'test/' + name), false,
      DIR + 'test/' + name + ' is pinned by S4');
  }
  /* And S4 really does pin the today directory, so the exclusion above is a
     fact about WHERE these files live, not about S4 pinning nothing. */
  assert(pinned.some((p) => p.startsWith('rebuild/m3/w7-preview/today/')),
    'S4 pins nothing under today/, so this comparison is vacuous');
});

/* M2-S5-TODAY-CHILD AMENDED THIS CELL, and it is still the same guard.
   The question it asks is "does THIS LANE drift a sealed byte it has not
   declared", and on a branch carrying the RESEAL CHILD that pins this lane's
   work (DECISIONS:455, :457) some S4 pins are moved BY THAT PACKAGE, on purpose
   and declared: rebuild.yml, b-package.cjs, the lane B tooling suite, the three
   B-NTC guard cells and two package specs. So the cell now reads the DECLARING
   SPEC, exactly as setup / food / machine-settings-ui already do for the B-NTC
   pins, and a file is exempt only while it stands at the post-image THAT SPEC
   DECLARES. An undeclared drift, a declared move that has not landed, and a
   file that has gone missing are all still red; and with no such spec on the
   branch the exemption set is empty and the cell is the original cell, which
   is the state lane C's own branch was reviewed in. */
/* M2-S6-TODAY-CHILD ADDS 'S6', and the cell is unchanged in every other way.
   S6 is the reseal that closes the DECISIONS:473 custody hole: it re-asserts S5's 114
   pins over the post-merge bytes of c-s6-small, b-s6-child-tail and c-p3-import-ui-2 and
   declares 89 merged-but-undeclared files as its own product. Several files this guard
   watches are moved BY THAT PACKAGE, declared and on purpose, so the declaring-spec
   chain has to know about it or every one of those moves reads here as an undeclared
   drift. Youngest first is what the loop below already does, so 'S6' goes last in the
   array and is therefore consulted first. Nothing else moves: the question the cell asks
   is still "does THIS LANE drift a sealed byte it has not declared", and the red side is
   still red - a file that drifts with no declaring spec, a declared move that has not
   landed, and a missing file all still fail. */
/* M2-S7-PORT-ADMISSION ADDS 'S7', and the cell is unchanged in every other way.
   S7 is the reseal that carries the accepted P3-PORT-FIX and P3-PORT-FIX-2 change
   onto the tip (DECISIONS:509, :510): the four product files of the owner's import
   path, seven sibling test files, .github/workflows/rebuild.yml and the lane B
   runner are all moved BY THAT PACKAGE, declared and on purpose, so the
   declaring-spec chain has to know about it or every one of those moves reads here
   as an undeclared drift. Youngest first is what the loop below already does, so
   'S7' goes last in the array and is therefore consulted first. Nothing else
   moves: the question the cell asks is still "does THIS LANE drift a sealed byte
   it has not declared", and the red side is still red. */
/* M2-S8-REAL-SHAPE ADDS 'S8', and the cell is unchanged in every other way.
   S8 is the reseal that carries the accepted P3-REAL-SHAPE and P3-LAYOUT-V2 change
   onto the tip (DECISIONS:522, :523): the product files of the owner's import and
   adoption path - today-bindings.mjs and workout-host.mjs among them - the moved
   and new sibling test files, the rebuild/lanes/d/p3-real-shape cells,
   .github/workflows/rebuild.yml and the lane B runner are all moved BY THAT
   PACKAGE, declared and on purpose, so the declaring-spec chain has to know about
   it or every one of those moves reads here as an undeclared drift. Youngest
   first is what the loop below already does, so 'S8' goes last in the array and
   is therefore consulted first. Nothing else moves: the question the cell asks is
   still "does THIS LANE drift a sealed byte it has not declared", and the red
   side is still red. */
/* M2-S9-UI-PINS ADDS 'S9', and the cell is unchanged in every other way.
   S9 is the reseal that RELEASES preview.css and build.mjs from the sealed inventory
   (DECISIONS:536 (2)) and carries the accepted S9-TODAY-CARRY and PASSPHRASE-NORMALIZE
   change onto the tip (DECISIONS:542 (D), :543 (B)): today-app.cjs, two of the today
   suite's own cells, the import lane's bundle, screen and page-bundle cell,
   .github/workflows/rebuild.yml, today/test/package.test.cjs, THIS FILE and the lane B
   runner are all moved BY THAT PACKAGE, declared and on purpose, so the declaring-spec
   chain has to know about it or every one of those moves reads here as an undeclared
   drift. Youngest first is what the loop below already does, so 'S9' goes last in the
   array and is therefore consulted first. Nothing else moves: the question the cell asks
   is still "does THIS LANE drift a sealed byte it has not declared".

   AND THE CONSEQUENCE FOR THIS FILE'S OWN LOOP, which is what R4 N7 is about and the
   only place a reader of declaredPost will look for it (R1 N11). S9 declares
   today/today-app.cjs role "edited" WITH A REAL POST, and 'S9' is now the youngest entry
   of the array below, so from this commit declaredPost('rebuild/m3/w7-preview/today/
   today-app.cjs') returns S9's post and no longer S8's dc9a826e. The walk is unchanged
   and this is the walk working: youngest declaring spec wins. It matters because
   F.1 R18 reads the same red as arriving "two packages downstream", when in fact it
   arrives ONE package sooner - at S10, the moment a package declares that path with
   post: null, the loop skips a non-string post, falls through the older specs and lands
   on nothing. A.2.1.1 owns that fix and A.2.1.2 is where S9's obligation to leave the
   rule stated lives; nothing in S9 changes because of it. The fall-through itself is
   safe: declaredPost already try/catches an absent or unparseable spec, measured. */
/* S10 ADDS 'S10', and the cell is unchanged in every other way. S10 is the reseal child
   that composes the accepted Today split (b35a48e3), the accepted gym-settings writer
   (66d32530) and the EPP engine repair with D-EPP-2 onto the S9 parent
   (S10-WORKING-BRIEF.md c58b892; DECISIONS:780, :785, :791): the files it moves are moved
   BY THAT PACKAGE, declared in packages/S10.json, so the declaring-spec chain has to know
   about it. S10 releases today-app.cjs and gym-app.mjs with post: null, which the loop
   below already skips. Youngest first, so 'S10' goes last and is consulted first; the
   red side is still red. */
const CHILD_SPECS = ['H3', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];
const declaredPost = (file) => {
  for (let i = CHILD_SPECS.length - 1; i >= 0; i -= 1) {
    let product = null;
    try { product = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/' + CHILD_SPECS[i] + '.json')).product; }
    catch { product = null; }
    if (product && Object.hasOwn(product, file) && typeof product[file].post === 'string')
      return product[file].post;
  }
  return null;
};

/* S10 RE-HOMES THE HISTORICAL INVARIANT UNDER THE AUTHORIZED RELEASE (Astra
   S10-INTEGRATION-REVIEW-L1 B4; S10-WORKING-BRIEF.md section 9 item 6; the fall-through
   S9's note above predicted "at S10"). S10 releases today-app.cjs (an S4-sealed path) with
   post: null, so declaredPost skips S10 and returns S9's post, and the view's real bytes read
   as undeclared drift. The fix is NOT to restore a post pin on the released view. A drifted
   sealed file is instead ACCOUNTED FOR BY A RELEASE only when every clause below holds, each
   read from the declaring specs themselves:
     (1) the YOUNGEST spec that declares the path declares it role "released" (an older
         release under a younger real pin is not a release);
     (2) its post is null - no post-image is ever pinned on a released view;
     (3) its pre is exactly the post the next-older declaring spec sealed, so the release
         hands out the byte the seal stood at and no other;
     (4) the releasing spec carries a release block (its RELEASE-FROM-SEAL citation, which
         the runner's releaseRuling() binds to the ledger line; this cell checks its presence
         and shape, the runner checks the line);
     (5) no declared child of the releasing spec names the path in its argv (no
         execution-route collision, brief section 9 item 6).
   Anything else - a drift with no declaring spec, a release from the wrong byte, a released
   path with a post, a release that is not the youngest declaration - is still red. The
   loader is a parameter only so the negative-control rows below can hand it synthetic
   chains; the real cell uses the real specs. */
const loadChildSpec = (id) => {
  try { return JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/' + id + '.json')); } catch { return null; }
};
function releaseAccounts(file, ids = CHILD_SPECS, load = loadChildSpec) {
  const specs = ids.map((id) => ({ id, spec: load(id) }));
  const declaring = specs.filter(({ spec }) => spec && spec.product && Object.hasOwn(spec.product, file));
  if (!declaring.length) return { ok: false, why: 'no declaring spec' };
  const youngest = declaring[declaring.length - 1], pin = youngest.spec.product[file];
  if (pin.role !== 'released') return { ok: false, why: youngest.id + ' declares it ' + pin.role + ', not released' };
  if (pin.post !== null) return { ok: false, why: youngest.id + ' releases it WITH a post' };
  const older = declaring.slice(0, -1).reverse().find(({ spec }) => typeof spec.product[file].post === 'string');
  if (!older || pin.pre !== older.spec.product[file].post)
    return { ok: false, why: youngest.id + ' releases it from ' + String(pin.pre).slice(0, 12) + ', not from the sealed post ' + String(older && older.spec.product[file].post).slice(0, 12) };
  const rel = youngest.spec.release;
  if (!rel || typeof rel !== 'object' || !Object.hasOwn(rel, 'rulingLineSha256')
    || !(rel.rulingLineSha256 === null || /^[a-f0-9]{64}$/.test(rel.rulingLineSha256)))
    return { ok: false, why: youngest.id + ' carries no release block' };
  const collision = (youngest.spec.children || []).find((c) => (c.argv || []).includes(file));
  if (collision) return { ok: false, why: youngest.id + ' child ' + collision.name + ' executes the released path' };
  return { ok: true, by: youngest.id, pre: pin.pre };
}

test('P-MEASURE (g) - no S4-sealed file drifts except where a declaring spec says so, and this lane\'s own drift is today-app.cjs', () => {
  const product = S4.product || {};
  const drifted = Object.keys(product).filter((file) => {
    let sha = null;
    try { sha = shaOf(file); } catch { return true; }      /* a pinned file that is gone */
    return typeof product[file].post === 'string' && sha !== product[file].post;
  });
  /* EVERY drift is accounted for by a declaring spec, named one by one rather
     than counted, and each drifted file stands at the post that spec declares. */
  const undeclared = drifted.filter((file) => shaOf(file) !== declaredPost(file) && !releaseAccounts(file).ok);
  assert.deepEqual(undeclared, [],
    'an S4-sealed file drifts and no package on this branch declares the bytes it stands at');
  /* AND THE DRIFT UNDER today/ IS A NAMED SET, not a count.

     THE OLD REASON, kept: bar item (g) is about P-MEASURE, and the ONLY sealed
     file P-MEASURE moves is today-app.cjs - the route, the tile and the
     accessors, with everything the athlete sees under measure/.

     THE NEW REASON (P3-IMPORT-UI-2, DECISIONS:475 (1) and (4)): a second lane C
     ticket now lands on the same branch and it cannot be held to P-MEASURE's
     one file, because the Import route needs a screen case, a lazy loader and
     two entry links in today-app.cjs, the installation forwarded through
     today-entry.mjs, the route's own 16 px / 48 px / 44 px rule in preview.css,
     and the re-reasoned input law in build.mjs. Each is named here, so the
     guard is exactly as tight as it was - a FIFTH file under today/ is still
     red - and nothing is exempted by being counted rather than named.
     today-app.cjs must still be in the set, because without it neither ticket
     delivered anything. setup-app.mjs is NOT in it: round 2 took the entry link
     off the setup screens (review r1 finding 1, P3-U5) and the file is
     byte-identical to the shipped one again.

     UNPROVEN ON THIS BRANCH, and said so rather than left to be discovered:
     the assertion at the top of this cell is red here, because S5 declares no
     post for the four sealed files these two tickets move, so execution never
     reaches the named set below. S6 declares those bytes and this widening
     starts running the same day.

     AND WHEN IT RAN, THE NAMED SET WAS WRONG - S6 CORRECTION. The list above
     named FOUR files as "the sealed-byte drift under today/", but only TWO of
     them are sealed: S4 pins today-app.cjs and today-entry.mjs, and it pins
     neither preview.css nor build.mjs (both are among the seven files under
     today/ that S4 left unpinned and that S6 declares for the first time). A
     file S4 does not pin cannot appear in a drift-from-S4 set at any time, so
     the old list could not have passed on any tree; it was written on a branch
     where, by its own note above, execution never reached it. The guard is kept
     exactly as tight rather than loosened: the sealed set is asserted exactly,
     so a THIRD sealed file under today/ is still red, and the two unsealed
     movers are asserted separately to be genuinely unsealed AND to stand at
     bytes some declaring spec names - so neither can drift unnoticed either. */
  const MINE = 'rebuild/m3/w7-preview/today/today-app.cjs';
  const P3_IMPORT_UI_2_SEALED = ['rebuild/m3/w7-preview/today/today-entry.mjs'];
  const P3_IMPORT_UI_2_UNSEALED = ['rebuild/m3/w7-preview/today/preview.css',
    'rebuild/m3/w7-preview/today/build.mjs'];
  assert(drifted.includes(MINE), 'today-app.cjs does not drift, so this lane delivered nothing');
  const under = drifted.filter((f) => f.startsWith('rebuild/m3/w7-preview/today/') && !f.includes('/test/'));
  assert.deepEqual(under.sort(), [MINE, ...P3_IMPORT_UI_2_SEALED].sort(),
    'the sealed-byte drift under today/ is not the named set of these two tickets');
  for (const f of P3_IMPORT_UI_2_UNSEALED) {
    assert.equal(Object.hasOwn(product, f), false,
      f + ' IS pinned by S4 after all, so it belongs in the sealed set above, not here');
    /* M2-S9-UI-PINS RELEASES BOTH OF THESE PATHS from the sealed inventory -
       rebuild/m3/w7-preview/today/preview.css and rebuild/m3/w7-preview/today/build.mjs -
       under DECISIONS:536 (2) through the RELEASE-FROM-SEAL token line S9 names, so the
       byte pin that stood here (shaOf(f) === declaredPost(f)) is deleted and nothing
       replaces it: declaredPost only takes a spec whose post is a string, S9 declares
       post: null for a released path, and the assert would go red the first time lane C
       edited either file. THE REST OF THE LOOP STAYS AND :186-:187 GETS STRONGER, not
       weaker: after the release it is this cell's own statement that a RELEASED path did
       not creep back into an older seal's inventory. What these two files owe is asserted
       where it always was, inside the seal - today/test/copy.test.mjs for the no-dash and
       node-only laws, today/test/package.test.cjs for the bundle laws, whose H18 cell
       holds the 26 today/ entries of build.mjs's REQUIRED_INPUTS by literal (spec A.4,
       C.2, PM-R7; R2 N9, which is why the loop was not deleted whole). */
  }
  /* And the restore is real: the test file round 2 edited carries no byte of
     this lane's (review R2 finding 4). It is no longer held to S4's post alone,
     because S5 moves it by one literal (the declaring-spec chain), so it is
     held to the post the youngest declaring spec names - and to the fact that
     no spec of LANE C's names it at all, which is what "restored" means here. */
  const restored = 'rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs';
  assert.equal(shaOf(restored), declaredPost(restored),
    'machine-settings-ui.test.mjs stands at no post any declaring spec names');
  assert.equal(readRepo(restored).includes(DIR), false,
    'machine-settings-ui.test.mjs names this lane\'s directory: round 2\'s edit is back');
});

/* S10's negative controls for the release rule above, on synthetic declaring chains (no file
   is read): the real release is accounted for, and every ungranted variant is refused BY
   NAME. VIEW is only a name here; nothing below hashes or pins it. */
test('S10 RELEASE-ACCOUNTING - a release accounts for a drifted sealed view only under all five clauses', () => {
  const VIEW = 'rebuild/m3/w7-preview/today/today-app.cjs', SEALED = 'a'.repeat(64);
  const chain = (young, extra = {}) => {
    const specs = { S8: { product: { [VIEW]: { pre: 'b'.repeat(64), post: SEALED, role: 'edited' } } },
      S9: { product: { [VIEW]: { pre: SEALED, post: SEALED, role: 'carried' } } },
      S10: { product: { [VIEW]: young }, release: { rulingLineSha256: null }, children: [], ...extra } };
    return [['S8', 'S9', 'S10'], (id) => specs[id] || null];
  };
  const released = { pre: SEALED, post: null, role: 'released' };
  assert.equal(releaseAccounts(VIEW, ...chain(released)).ok, true, 'the control: the authorized release accounts for the drift');
  const refused = (label, [ids, load], why) => {
    const r = releaseAccounts(VIEW, ids, load);
    assert.equal(r.ok, false, label + ' was accepted');
    assert.match(r.why, why, label + ' refused for the wrong reason: ' + r.why);
  };
  refused('ungranted drift: the youngest spec pins a post', chain({ pre: SEALED, post: 'c'.repeat(64), role: 'edited' }), /not released/);
  refused('a released view WITH a post', chain({ pre: SEALED, post: 'c'.repeat(64), role: 'released' }), /WITH a post/);
  refused('a release from the wrong byte', chain({ pre: 'd'.repeat(64), post: null, role: 'released' }), /not from the sealed post/);
  refused('a release with no release block', chain(released, { release: undefined }), /no release block/);
  refused('a release whose child executes the view', chain(released, { children: [{ name: 'today-17', argv: ['--test', VIEW] }] }), /executes the released path/);
  const [ids, load] = chain(released);
  refused('an older release under a younger real pin', [[...ids, 'S11'], (id) => id === 'S11'
    ? { product: { [VIEW]: { pre: SEALED, post: 'e'.repeat(64), role: 'edited' } } } : load(id)], /not released/);
  refused('a drift no spec declares', [ids, () => null], /no declaring spec/);
});

test('P-MEASURE (g) - these cells are registered with the shared preflight that runs them', () => {
  const HERMETIC = ['test/model.test.mjs', 'test/adherence.test.mjs'];
  const workflow = readRepo('.github/workflows/shared-preflight.yml');
  for (const suite of HERMETIC) {
    assert(workflow.includes(DIR + suite), 'the workflow does not materialize ' + suite);
    assert(workflow.split(DIR + suite).length === 3,
      DIR + suite + ' is not both materialized and run by the workflow');
  }
  /* And the registration regression knows the same two, so dropping either
     from the workflow turns that suite red rather than passing silently. */
  const registration = readRepo('rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs');
  assert(registration.includes(DIR), 'the registration test does not know this directory');
  for (const suite of HERMETIC) {
    assert(registration.includes(suite.replace('test/', 'test/')),
      'the registration test does not name ' + suite);
  }
  /* The hermetic pair really is hermetic: nothing they import reaches beyond
     this directory, which is what lets the closed public checkout run them. */
  for (const suite of HERMETIC) {
    const code = codeOf(readRepo(DIR + suite));
    for (const match of code.matchAll(/from\s+'([^']+)'/g)) {
      const target = match[1];
      assert(target.startsWith('node:') || target.startsWith('../measure-'),
        DIR + suite + ' imports ' + target + ', which the public checkout never materializes');
    }
  }
});

/* The two characters the owner's rule forbids, built from their code points so
   that this file does not itself carry one (DECISIONS:114 (1)). */
const AI_DASH = new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']');

test('P-MEASURE - no en or em dash in any string this lane can render', () => {
  for (const name of MODULES) {
    const text = readRepo(DIR + name);
    for (const match of text.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)) {
      const literal = match[1] === undefined ? match[2] : match[1];
      assert.equal(AI_DASH.test(literal), false, name + ' string literal: ' + literal);
    }
    assert.equal(text.includes('\r'), false, name + ' carries a CRLF');
  }
});
