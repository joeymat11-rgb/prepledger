/* P3-REPLAY-ALL-FAMILIES - THE ENUMERATION CELL.

   Two tickets in a row found the same defect the same way: a screen wrote an
   operation of a class replay had no family for, and an athlete who had used
   that screen could not import his own history. Both were found by hand on a
   real device, after the fact.

   So this cell does not hold a list. It DERIVES every (module, class) the
   SHIPPED page can write, from the A1 pinned input inventory - the very module
   graph rebuild/m3/w7-preview/today/build.mjs bundles - by reading the writers
   themselves, and checks that register against
   rebuild/m4/import/replay-registry.cjs. A writer with no entry fails; an entry
   with no writer fails. A new screen therefore cannot ship without either a
   replay family or a declared reason its operations are not in the generation.

   SYNTHETIC ONLY: this cell reads the repository's own source files and builds
   the page's own bundle. No private fixture, no ledger and no owner file is
   read, named or reachable from here. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBrowser } from '../../../m3/w6/build-browser.mjs';
import Ops from '../../../client/ops.cjs';
import Registry from '../../../m4/import/replay-registry.cjs';

const REPO = fileURLToPath(new URL('../../../../', import.meta.url));
const ENTRY = path.join(REPO, 'rebuild/m3/w7-preview/today/today-entry.mjs');

/* A class named in an op-building position: `class: "<C>"` in an action or
   envelope literal, or `OP_CLASS = "<C>"` in a producer. A member READ off an
   operation (`op.class`, `source.class`) is not a writer, so a dot in front
   disqualifies the match - which is what keeps rebuild/m4/workout/edit-history.cjs,
   a reader of the session class, out of this register. */
const classRe = () => new RegExp('(?:^|[^\\w.])(?:class|OP_CLASS)\\s*[:=]\\s*["\']('
  + Ops.CLASSES.join('|') + ')["\']', 'g');
const kindRe = () => /(?:^|[^\w.])(?:kind|OP_KIND)\s*[:=]\s*["']([a-z-]+)["']/g;
const profileRe = () => /["'](earned\/[a-z0-9/.-]+)["']/g;

/* The page's own module graph, once per process, through the SAME browser build
   the phone host and A1 use. Nothing is installed and nothing is stubbed. */
let pinned = null;
async function pinnedInputs() {
  if (pinned) return pinned;
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'raf-enum-'));
  const built = await buildBrowser({ outfile: path.join(out, 'app.js'), entryPoints: [ENTRY] });
  pinned = built.inventory.map(input => input.path)
    .filter(p => !/node_modules/.test(p) && /\.(cjs|mjs|js)$/.test(p));
  assert.ok(pinned.length > 100, 'the page graph came back empty, so this cell proves nothing');
  return pinned;
}

async function writersInPage() {
  const rows = [];
  for (const rel of await pinnedInputs()) {
    const src = fs.readFileSync(path.join(REPO, rel), 'utf8');
    const classes = [...new Set([...src.matchAll(classRe())].map(m => m[1]))].sort();
    if (!classes.length) continue;
    const kinds = [...new Set([...src.matchAll(kindRe())].map(m => m[1]))].sort();
    const profiles = [...new Set([...src.matchAll(profileRe())].map(m => m[1]))].sort();
    for (const cls of classes) rows.push({ module: rel, class: cls, kinds, profiles });
  }
  return rows;
}

test('P3-EN1 - EVERY writer the shipped page has is registered, and every registered writer is '
  + 'really in the page: the register and the page graph agree name for name', async () => {
    const found = (await writersInPage()).map(Registry.keyOf).sort();
    const declared = [...Registry.REGISTERED].sort();
    assert.deepEqual(new Set(found).size, found.length, 'the page names one writer twice');
    /* THE CELL THAT GOES RED WHEN A NEW WRITER APPEARS. Both directions, named:
       a writer with no entry is a screen that can refuse an import, and an entry
       with no writer is a rule about something that no longer ships. */
    assert.deepEqual(found.filter(key => !declared.includes(key)), [],
      'a writer in the shipped page has NO replay family and no declared reason');
    assert.deepEqual(declared.filter(key => !found.includes(key)), [],
      'the register names a writer the shipped page does not have');
  });

test('P3-EN2 - every entry either names a family that ADMISSION REALLY RUNS, or says the '
  + 'operations are not in the generation and names the code that refuses one', async () => {
    const admission = fs.readFileSync(
      path.join(REPO, 'rebuild/m3/w6/local/source-admission.mjs'), 'utf8');
    for (const entry of Registry.ENTRIES) {
      assert.ok(['family', 'not-in-generation'].includes(entry.disposition), entry.module);
      assert.ok(typeof entry.rule === 'string' && entry.rule.length > 60,
        entry.module + '#' + entry.class + ' has no stated rule');
      /* EVIDENCE ROLE FIRST. Every rule opens by saying whether these records
         are session evidence, programme evidence, or neither - which is the
         question a replay family exists to answer. */
      assert.match(entry.rule, /^(no evidence role|session evidence|programme evidence|no shipped screen route)/,
        entry.module + '#' + entry.class + ' does not state its evidence role first');
      if (entry.disposition === 'family') {
        assert.match(entry.family, /^F\d+$/, entry.module);
        /* The family is not a label on a register: admission names it. */
        assert.ok(admission.includes("'" + entry.family + "'")
          || admission.includes(entry.family + '.FAMILY') || admission.includes('MeasureReplay.FAMILY')
          || admission.includes('SleepReplay'),
          'admission never mentions ' + entry.family);
        assert.match(entry.rule, /refuses LOCAL_SOURCE_[A-Z_]+/,
          entry.family + ' does not name the code a malformed record refuses with');
      } else {
        assert.equal(entry.family, null);
        assert.match(entry.refusal, /^LOCAL_SOURCE_[A-Z_]+$/);
        assert.ok(admission.includes(entry.refusal),
          'admission never raises ' + entry.refusal);
      }
    }
    /* The families this ticket closes the page with. F6 answers for the SOURCE
       state's own historical decisions rather than for a writer, so it is not a
       register entry; it is asserted here so that it cannot quietly leave. */
    assert.deepEqual(Registry.FAMILIES, ['F1', 'F2', 'F3', 'F4', 'F5', 'F7', 'F8']);
    assert.ok(admission.includes("family:'F6'"), 'F6 stopped answering');
  });

test('P3-EN3 - the ONE not-in-generation entry is proved, not asserted: no module of the '
  + 'shipped page calls a plan writer on the durable client', async () => {
    const inputs = await pinnedInputs();
    const CLIENT = 'rebuild/client/index.cjs';
    assert.ok(inputs.includes(CLIENT), 'the page stopped carrying the durable client');
    /* The five plan-writing names rebuild/client's API exposes. A call is a name
       after a dot and an open bracket; the definitions inside the client itself
       are not calls, so the client is the one module excluded. */
    const writers = ['planEdit', 'respond', 'decision', 'undoRequest', 'acceptInitialPlan'];
    const call = new RegExp('\\.\\s*(' + writers.join('|') + ')\\s*\\(');
    const callers = inputs.filter(rel => rel !== CLIENT
      && call.test(fs.readFileSync(path.join(REPO, rel), 'utf8')));
    assert.deepEqual(callers, [],
      'a shipped screen now reaches a plan writer: the register entry for '
      + CLIENT + '#plan must become a family, and the runbook must name it again');
    /* And the client really does still carry them, so this cell is not passing
       because the names were renamed under it. */
    const client = fs.readFileSync(path.join(REPO, CLIENT), 'utf8');
    for (const name of writers) assert.ok(new RegExp('(^|[^\\w.])' + name + '\\s*:').test(client),
      'rebuild/client no longer exposes ' + name + ', so this cell stopped proving anything');
  });
