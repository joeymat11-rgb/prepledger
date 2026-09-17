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
const CHILD_SPECS = ['H3', 'S3', 'S4', 'S5'];
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

test('P-MEASURE (g) - no S4-sealed file drifts except where a declaring spec says so, and this lane\'s own drift is today-app.cjs', () => {
  const product = S4.product || {};
  const drifted = Object.keys(product).filter((file) => {
    let sha = null;
    try { sha = shaOf(file); } catch { return true; }      /* a pinned file that is gone */
    return typeof product[file].post === 'string' && sha !== product[file].post;
  });
  /* EVERY drift is accounted for by a declaring spec, named one by one rather
     than counted, and each drifted file stands at the post that spec declares. */
  const undeclared = drifted.filter((file) => shaOf(file) !== declaredPost(file));
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
     starts running the same day. */
  const MINE = 'rebuild/m3/w7-preview/today/today-app.cjs';
  const P3_IMPORT_UI_2 = ['rebuild/m3/w7-preview/today/today-entry.mjs',
    'rebuild/m3/w7-preview/today/preview.css',
    'rebuild/m3/w7-preview/today/build.mjs'];
  assert(drifted.includes(MINE), 'today-app.cjs does not drift, so this lane delivered nothing');
  const under = drifted.filter((f) => f.startsWith('rebuild/m3/w7-preview/today/') && !f.includes('/test/'));
  assert.deepEqual(under.sort(), [MINE, ...P3_IMPORT_UI_2].sort(),
    'the sealed-byte drift under today/ is not the named set of these two tickets');
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
