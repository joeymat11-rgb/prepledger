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

   P3-EN1-ROUTE-GRAPH. THE PAGE IS NOW TWO GRAPHS, AND A NAME IS NOT A WRITE.
   Once the Import screen lands, today-entry.mjs reaches the replay lane itself:
   the route's dynamic edge pulls rebuild/m4/import/** into the same bundler
   graph, so the FAMILIES that answer for a class became "modules of the page
   that name that class". They are readers. This cell therefore does two things
   the first round did not.

   (1) IT SPLITS THE GRAPH THE WAY build.mjs DOES. The Today BOOT graph is the
       walk from today-entry.mjs that refuses to cross the one dynamic edge into
       the Import route's entry module; the ROUTE chunk is everything else the
       page carries. Both are enumerated - a writer added to either reddens
       P3-EN1 - but they are named apart, because the boot graph is what paints
       Today and the route chunk is what the Import screen opens.

   (2) IT ASKS FOR BUILDER EVIDENCE, NOT FOR A NAME. A WRITER is a module that
       BUILDS an operation of a class: a `class` and a `kind` named together in
       one object literal, which is the envelope rebuild/client/ops.cjs build()
       takes, in either order. A module that only names the class - `OP_CLASS`
       compared against `op.class`, or a rule that quotes it - builds nothing,
       and P3-EN4 proves that of the replay lane by measurement rather than by
       saying so.

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
const ENTRY_REL = 'rebuild/m3/w7-preview/today/today-entry.mjs';
const ENTRY = path.join(REPO, ENTRY_REL);
/* The Import route's entry module, spelled as build.mjs spells it (IMPORT_ENTRY).
   It is the ONE dynamic edge the boot walk refuses to cross. On a tree that does
   not carry the Import screen it is simply absent from the graph, and the route
   chunk is empty - which P3-EN5 states either way rather than assuming one. */
const ROUTE = 'rebuild/m3/w7-preview/import/import-screen.mjs';
/* The replay lane: the families, the shared-class router and the register. */
const LANE = 'rebuild/m4/import';
/* What the BOOT graph may never carry, whatever the route does (build.mjs
   IMPORT_ROUTE_ONLY): the migration walk, the merge, and the import lane. */
const ROUTE_ONLY = Object.freeze([
  ['rebuild/engine/migrate.cjs', p => p === 'rebuild/engine/migrate.cjs'],
  ['rebuild/engine/merge.cjs', p => p === 'rebuild/engine/merge.cjs'],
  ['rebuild/m4/import/*', p => p.startsWith(LANE + '/')],
]);

/* A class NAMED: `class: "<C>"` in a literal, or `OP_CLASS = "<C>"` in a
   producer. A member READ off an operation (`op.class`, `source.class`) names
   nothing, so a dot in front disqualifies the match - which is what keeps
   rebuild/m4/workout/edit-history.cjs, a reader of the session class, out of
   this register. Naming is necessary for a writer and is not sufficient. */
const classRe = () => new RegExp('(?:^|[^\\w.])(?:class|OP_CLASS)\\s*[:=]\\s*["\']('
  + Ops.CLASSES.join('|') + ')["\']', 'g');
const OP_CLASS_RE = /(?:^|[^\w.])OP_CLASS\s*=\s*["']([a-z-]+)["']/;
const kindRe = () => /(?:^|[^\w.])(?:kind|OP_KIND)\s*[:=]\s*["']([a-z-]+)["']/g;
const profileRe = () => /["'](earned\/[a-z0-9/.-]+)["']/g;

/* AN OP-BUILDING SITE: a `class` and a `kind` named TOGETHER in one object
   literal. That pair is the envelope rebuild/client/ops.cjs build() takes, and
   it is what every producer on the page writes - `{ class: OP_CLASS, kind:
   OP_KIND, ... }` in the today and measure producers, `{class:'session',kind,
   ...}` in rebuild/m4/workout/commands.cjs (a shorthand property), and
   `{ ..., kind: "fact", class: "reading", ... }` the other way round in
   rebuild/client/index.cjs's own commit() calls. Both orders are read, the
   class may be quoted or the module's own OP_CLASS, and the kind may be a
   shorthand. THE REACH IS STATED TWICE OVER, and both edges are refused rather
   than assumed away. A writer that took its class from ANOTHER module's
   constant (`class: Model.X`) is invisible to the pairing, exactly as R1-6/R3-6
   records; so is one that puts the class and the kind at opposite ends of the
   same literal. P3-EN1 therefore refuses (a) a paired site whose class it
   cannot resolve in that module, and (b) a `class:` PROPERTY of any page module
   that it could not pair with a kind - either is a site this cell would have
   read as nothing, and the page must not contain one. */
const SITE = '(?:["\'](?:' + Ops.CLASSES.join('|') + ')["\']|OP_CLASS)';
const builderRes = () => [
  new RegExp('(?:^|[^\\w.])class\\s*:\\s*(' + SITE + ')\\s*,\\s*kind\\b', 'g'),
  new RegExp('(?:^|[^\\w.])kind\\s*(?::\\s*(?:["\'][a-z-]+["\']|OP_KIND))?\\s*,\\s*class\\s*:\\s*('
    + SITE + ')', 'g'),
];
/* A COMMIT CALL SITE: the builder itself, or the client transaction that seals
   what a producer prepared. A replay family calls neither. */
const commitRe = () => /(?:^|[^\w.])Ops\s*\.\s*build\s*\(|\.\s*(?:commit|commitBatch)\s*\(/g;
/* A `class` in an object-literal PROPERTY position, paired or not. */
const propertyRe = () => new RegExp('(?:^|[^\\w.])class\\s*:\\s*(' + SITE + ')', 'g');

/* The classes a module really builds, with `OP_CLASS` resolved against that
   module's OWN declaration. A site whose class cannot be resolved there is
   returned unresolved rather than dropped, and a `class:` property this cell
   could not pair with a kind is returned dangling, so an invisible writer is a
   red cell and not a silent pass. */
function buildsIn(src) {
  const own = (src.match(OP_CLASS_RE) || [])[1] || null;
  const resolve = raw => raw === 'OP_CLASS' ? own : raw.slice(1, -1);
  const classes = new Set(), unresolved = [];
  for (const re of builderRes()) for (const m of src.matchAll(re)) {
    const cls = resolve(m[1]);
    if (cls && Ops.CLASSES.includes(cls)) classes.add(cls); else unresolved.push(m[1]);
  }
  const dangling = [...new Set([...src.matchAll(propertyRe())].map(m => resolve(m[1]))
    .filter(cls => !cls || !classes.has(cls)).map(cls => cls || 'OP_CLASS'))];
  return { classes: [...classes].sort(), unresolved, dangling };
}

/* The page's own module graph, once per process, through the SAME browser build
   the phone host and A1 use. Nothing is installed and nothing is stubbed.
   buildBrowser writes esbuild's own metafile beside the bundle, which is how
   build.mjs reads the edges too, so the split below is the bundler's answer and
   not a re-implementation of module resolution. */
let page = null;
const ownModule = p => !/node_modules/.test(p) && /\.(cjs|mjs|js)$/.test(p);
async function pageGraph() {
  if (page) return page;
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'raf-enum-'));
  const built = await buildBrowser({ outfile: path.join(out, 'app.js'), entryPoints: [ENTRY] });
  const graph = JSON.parse(fs.readFileSync(built.outfile + '.meta.json', 'utf8')).metafile;
  const pinned = built.inventory.map(input => input.path).filter(ownModule);
  assert.ok(pinned.length > 100, 'the page graph came back empty, so this cell proves nothing');
  assert.ok(graph && graph.inputs && graph.inputs[ENTRY_REL],
    'esbuild returned no module graph for ' + ENTRY_REL);
  /* THE BOOT WALK, exactly build.mjs assertImportRouteIsolation(): every static
     and dynamic edge is followed except the one into the Import route's entry. */
  const reached = new Set(), stack = [ENTRY_REL];
  while (stack.length) {
    const at = stack.pop();
    if (reached.has(at) || at === ROUTE) continue;
    reached.add(at);
    for (const edge of (graph.inputs[at] && graph.inputs[at].imports) || []) {
      if (edge.path === ROUTE) continue;
      if (!reached.has(edge.path)) stack.push(edge.path);
    }
  }
  const boot = pinned.filter(p => reached.has(p));
  const route = pinned.filter(p => !reached.has(p));
  page = { pinned, boot, route, graph };
  return page;
}

/* Every module of a set, read once, with what it NAMES and what it BUILDS. */
function scan(modules) {
  return modules.map(rel => {
    const src = fs.readFileSync(path.join(REPO, rel), 'utf8');
    const names = [...new Set([...src.matchAll(classRe())].map(m => m[1]))].sort();
    const { classes, unresolved, dangling } = buildsIn(src);
    const kinds = [...new Set([...src.matchAll(kindRe())].map(m => m[1]))].sort();
    const profiles = [...new Set([...src.matchAll(profileRe())].map(m => m[1]))].sort();
    const commits = [...new Set([...src.matchAll(commitRe())].map(m => m[0].trim()))];
    return { module: rel, names, builds: classes, unresolved, dangling, kinds, profiles, commits };
  });
}
/* A WRITER ROW is one (module, class) a module really builds. */
const writerRows = scanned => scanned.flatMap(row =>
  row.builds.map(cls => ({ module: row.module, class: cls,
    kinds: row.kinds, profiles: row.profiles })));

test('P3-EN1 - EVERY writer the shipped page has is registered, and every registered writer is '
  + 'really in the page: the register and the page graph agree name for name, over the Today '
  + 'BOOT graph AND the Import route chunk together', async () => {
    const { boot, route } = await pageGraph();
    const bootScan = scan(boot), routeScan = scan(route);
    /* A site whose class cannot be resolved in its own module is an invisible
       writer, and is refused here rather than dropped (R1-6/R3-6's reach). */
    assert.deepEqual([...bootScan, ...routeScan].filter(r => r.unresolved.length)
      .map(r => r.module + ' <- ' + r.unresolved.join(', ')), [],
      'an op-building site names a class this cell cannot resolve in that module');
    /* And no page module writes `class:` in a literal this cell could not pair
       with a kind: that would be a writer the net reads as nothing. */
    assert.deepEqual([...bootScan, ...routeScan].filter(r => r.dangling.length)
      .map(r => r.module + ' <- class: ' + r.dangling.join(', ')), [],
      'a page module names a class in a building position with no kind beside it');
    const rows = [...writerRows(bootScan), ...writerRows(routeScan)];
    const found = rows.map(Registry.keyOf).sort();
    const declared = [...Registry.REGISTERED].sort();
    assert.deepEqual(new Set(found).size, found.length, 'the page names one writer twice');
    /* THE CELL THAT GOES RED WHEN A NEW WRITER APPEARS, wherever it appears:
       both directions, named. A writer with no entry is a screen that can refuse
       an import, and an entry with no writer is a rule about something that no
       longer ships. The route chunk is in this net too, so a writer reached only
       through the Import screen is caught by the same assertion. */
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
       register entry; it is asserted here so that it cannot quietly leave.
       S11 FC09 (PM ruling DECISIONS:878): F9, the native-load family, answers for
       the one plan writer a shipped screen reaches, the native-load Yes. */
    assert.deepEqual(Registry.FAMILIES, ['F1', 'F2', 'F3', 'F4', 'F5', 'F7', 'F8', 'F9']);
    assert.ok(admission.includes("family:'F6'"), 'F6 stopped answering');
    /* F9 is not a label either: admission imports the family and dispatches it
       BEFORE its unknown-plan catch (NATIVE-LOAD-SPEC R9.13 :176), so a plan
       operation reaches the catch only when F9 has declined it. */
    assert.ok(admission.includes("from '../../../m4/import/native-load-replay.cjs'"), 'admission does not import F9');
    const dispatch = admission.indexOf('nativeLoadFamily.owns(');
    const unknownPlan = admission.indexOf("op.class==='plan'?'LOCAL_SOURCE_EFFECT_UNMAPPED'");
    assert.ok(dispatch > 0 && unknownPlan > 0 && dispatch < unknownPlan,
      'F9 is not dispatched before the unknown-plan catch');
  });

/* P3-EN3, THE PLAN WRITERS, rewritten for S11 FC09 (PM ruling DECISIONS:878).
   Until NATIVE-LOAD this cell proved that NO page module calls a plan writer. The
   native-load Yes is now one, by design, and the register answers for it with
   F9; what must still be PROVED is that it is the ONLY one, and that it is
   reached only through the guarded native path:
     today-entry.mjs:245      h.respond({ handle, proposal_id, answer })  - the
                              native-load HOST's respond (today-bindings.mjs
                              createNativeLoadHost), which re-evaluates, issues a
                              one-time ticket and calls respondNativeLoad;
     local-client.mjs:412     bridge.execute("respond", args) - the one string
                              dispatch of a plan-writer name on the page;
     t2-stage.cjs:34          client.respond(owned.proposalId, "accept",
                              clone(owned.issuance)) - inside nativeRespond, after
                              the trusted capability validated the request.
   So the reach is computed, module by module, and PINNED: every `.name(` call of
   the five plan-writer names outside the client (comments included, so the count
   can only over-read, never under-read), every string dispatch of one through
   execute(), and the T2 stage's generic command set. A new caller of planEdit,
   decision, undoRequest or acceptInitialPlan, a new respond caller, a second
   respond site in either known module, a new string dispatch or a plan-writer
   name in the generic command set each turns this cell red.
   planWriterReach is a pure function of (module list, source reader) so that a
   scratch mutant can run it over a page with one injected call (FC09 report). */
const PLAN_WRITERS = ['planEdit', 'respond', 'decision', 'undoRequest', 'acceptInitialPlan'];
const KNOWN_CALLS = Object.freeze({
  'rebuild/m3/w6/t2-stage.cjs': { respond: 2 },
  'rebuild/m3/w7-preview/today/today-entry.mjs': { respond: 1 },
});
const GUARDED_SITES = Object.freeze([
  ['rebuild/m3/w6/t2-stage.cjs', 'return client.respond(owned.proposalId, "accept", clone(owned.issuance));'],
  ['rebuild/m3/w7-preview/today/today-entry.mjs',
    'const result = await h.respond({ handle: offer.handle, proposal_id: proposalId, answer: word });'],
]);
const KNOWN_DISPATCH = Object.freeze({ 'rebuild/m3/w6/local/local-client.mjs': { respond: 1 } });
function planWriterReach(inputs, read) {
  const CLIENT = 'rebuild/client/index.cjs';
  const call = new RegExp('\\.\\s*(' + PLAN_WRITERS.join('|') + ')\\s*\\(', 'g');
  const dispatch = new RegExp('execute\\s*\\(\\s*["\'](' + PLAN_WRITERS.join('|') + ')["\']', 'g');
  const calls = {}, dispatches = {}, sources = {};
  for (const rel of inputs) {
    if (rel === CLIENT) continue;
    const src = read(rel);
    sources[rel] = src;
    for (const m of src.matchAll(call)) ((calls[rel] = calls[rel] || {})[m[1]] = (calls[rel][m[1]] || 0) + 1);
    for (const m of src.matchAll(dispatch)) ((dispatches[rel] = dispatches[rel] || {})[m[1]] = (dispatches[rel][m[1]] || 0) + 1);
  }
  const stage = sources['rebuild/m3/w6/t2-stage.cjs'] || '';
  const commandSet = (stage.match(/const COMMANDS = new Set\(\[([^\]]*)\]\)/) || [])[1];
  const generic = commandSet === undefined ? null : [...commandSet.matchAll(/["']([^"']+)["']/g)].map(m => m[1]);
  const guarded = GUARDED_SITES.filter(([rel, site]) => !(sources[rel] || '').includes(site)).map(([rel]) => rel);
  return { calls, dispatches, generic, guarded, client: read(CLIENT) };
}

test('P3-EN3 - the plan writers are proved, not asserted: the ONLY plan-writer call the shipped page reaches is '
  + 'respond, at its two guarded native-load sites, and no module calls planEdit, decision, undoRequest or '
  + 'acceptInitialPlan', async () => {
    /* The WHOLE page, boot graph and route chunk alike: the Import screen is a
       shipped screen route too. */
    const inputs = (await pageGraph()).pinned;
    assert.ok(inputs.includes('rebuild/client/index.cjs'), 'the page stopped carrying the durable client');
    const reach = planWriterReach(inputs, rel => fs.readFileSync(path.join(REPO, rel), 'utf8'));
    assert.deepEqual(reach.calls, KNOWN_CALLS,
      'a shipped screen now reaches a plan writer other than the guarded native-load Yes, or the Yes gained a '
      + 'caller: a new writer needs a family in the register (and a line in the runbook), never a quiet pass');
    assert.deepEqual(reach.guarded, [], 'a known respond site is no longer the guarded native-load call');
    assert.deepEqual(reach.dispatches, KNOWN_DISPATCH,
      'a page module dispatches a plan-writer name by string other than respondNativeLoad');
    assert.ok(Array.isArray(reach.generic) && reach.generic.length > 0, 'the T2 stage command set was not found');
    assert.deepEqual(reach.generic.filter(name => PLAN_WRITERS.includes(name)), [],
      'the T2 stage dispatches a plan writer generically, bypassing the native-load capability');
    /* And the client really does still carry them, so this cell is not passing
       because the names were renamed under it. */
    for (const name of PLAN_WRITERS) assert.ok(new RegExp('(^|[^\\w.])' + name + '\\s*:').test(reach.client),
      'rebuild/client no longer exposes ' + name + ', so this cell stopped proving anything');
  });

test('P3-EN4 - the replay families and the register are READERS of the classes they name, by '
  + 'measurement: not one module of the lane builds an operation or calls a commit, and this '
  + 'cell reddens the day one of them gains a builder call', async () => {
    const lane = fs.readdirSync(path.join(REPO, LANE)).filter(n => /\.(cjs|mjs)$/.test(n))
      .map(n => LANE + '/' + n).sort();
    assert.ok(lane.length > 8, 'the replay lane came back empty, so this cell proves nothing');
    const scanned = scan(lane);
    /* THE CLASSIFICATION ITSELF. A lane module that named a class AND built one
       would be a family that writes what it is supposed to replay, which is the
       defect this cell exists to refuse; a lane module that commits is the same
       thing said one level lower. Both are named, module by module. */
    assert.deepEqual(scanned.filter(r => r.builds.length || r.unresolved.length)
      .map(r => r.module + ' builds ' + [...r.builds, ...r.unresolved].join(', ')), [],
      'a replay lane module BUILDS an operation: it is a writer, not a family');
    assert.deepEqual(scanned.filter(r => r.commits.length)
      .map(r => r.module + ' calls ' + r.commits.join(', ')), [],
      'a replay lane module calls the op builder or a client commit');
    /* The one lane module that writes `class:` at all is the REGISTER, whose
       rows are rules about a writer rather than an envelope for one. Any other
       lane module gaining a `class:` property is a family growing a shape. */
    assert.deepEqual(scanned.filter(r => r.dangling.length).map(r => r.module),
      [LANE + '/replay-registry.cjs'],
      'a replay lane module other than the register names a class in a building position');
    /* The scan is not blind: the modules that carry a class name really are the
       ones this ticket classifies, and every class they name is one the register
       already answers for - as a family, or as the declared not-in-generation. */
    const readers = scanned.filter(r => r.names.length).map(r => r.module);
    for (const named of ['body-composition-class.cjs', 'measure-replay.cjs',
      'replay-registry.cjs', 'sleep-replay.cjs'])
      assert.ok(readers.includes(LANE + '/' + named),
        LANE + '/' + named + ' stopped naming a class, so this cell stopped proving anything');
    const answered = new Set(Registry.ENTRIES.map(e => e.class));
    for (const row of scanned) for (const cls of row.names)
      assert.ok(answered.has(cls), row.module + ' names ' + cls + ', which the register omits');
    /* And whatever the Import route puts in the page: every module of the route
       chunk that names a class is one of these readers. A route module that
       named a class and was NOT of this lane would be a new writer, and P3-EN1
       is where it lands. */
    const { route } = await pageGraph();
    for (const row of scan(route).filter(r => r.names.length))
      assert.ok(readers.includes(row.module),
        row.module + ' names a class in the route chunk and is not a classified reader');
  });

test('P3-EN5 - the split is the bundler\'s own, not this cell\'s opinion: the Today BOOT graph '
  + 'starts at today-entry.mjs, carries no migrate, no merge and none of the replay lane, and '
  + 'the route chunk is reached through exactly one dynamic edge', async () => {
    const { pinned, boot, route, graph } = await pageGraph();
    assert.ok(boot.includes(ENTRY_REL) && boot.length > 100,
      'the boot walk did not reach the page entry');
    assert.deepEqual([...boot, ...route].sort(), [...pinned].sort(),
      'a pinned input is in neither the boot graph nor the route chunk');
    assert.equal(boot.filter(p => route.includes(p)).length, 0, 'the two sets overlap');
    /* THE LAW THE OLD OUTRIGHT BAN WAS BUYING, asserted here over the same walk
       build.mjs makes: whatever the Import route carries, the page the athlete
       boots into carries none of it. */
    for (const [label, match] of ROUTE_ONLY) assert.deepEqual(boot.filter(match), [],
      'the Today boot graph reaches ' + label);
    if (!pinned.includes(ROUTE)) {
      /* No Import screen on this tree: the page is one graph, and the outright
         ban still holds over the whole of it. */
      assert.deepEqual(route, [], 'there is a route chunk but no route entry module');
      for (const [label, match] of ROUTE_ONLY) assert.deepEqual(pinned.filter(match), [],
        'the page carries ' + label + ' with no Import route to reach it through');
      return;
    }
    /* The Import screen is here: the door is the one named, and it is dynamic. */
    const importers = Object.entries(graph.inputs)
      .filter(([, node]) => (node.imports || []).some(edge => edge.path === ROUTE));
    assert.equal(importers.length, 1, ROUTE + ' is reached from '
      + (importers.map(([p]) => p).join(', ') || 'nothing'));
    for (const [from, node] of importers) for (const edge of node.imports) {
      if (edge.path !== ROUTE) continue;
      assert.equal(edge.kind, 'dynamic-import',
        from + ' reaches ' + ROUTE + ' by ' + edge.kind + ', not a dynamic import');
    }
    assert.ok(route.some(p => p.startsWith(LANE + '/')),
      'the route chunk carries none of the replay lane, so the split moved nothing');
  });
