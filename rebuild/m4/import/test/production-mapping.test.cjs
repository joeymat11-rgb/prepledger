'use strict';

/* P3-PRODUCER-MAPPING (DECISIONS:475 (3)). THE PINS AND THE TRIP-WIRES.
 *
 * Every literal in production-mapping.cjs is recomputed here from the real
 * files, so a moved engine byte, a reseal, or a new producer profile turns this
 * suite red before it can reach Joe's phone. Same pattern as
 * rebuild/coach/test/engine-revision.test.cjs; no second revision scheme.
 *
 * Run with MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York (the oracle shim
 * refuses to load without the first; P3-M0 below refuses without the second). */

process.env.MEASURED_TEST_NOW = process.env.MEASURED_TEST_NOW || '2026-09-03';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const Mapping = require('../production-mapping.cjs');
const Profile = require('../local-source-profile.cjs');
const EngineCapture = require('../../workout/engine-capture.cjs');

const REBUILD_ROOT = path.join(__dirname, '..', '..', '..');
const REPO_ROOT = path.join(REBUILD_ROOT, '..');
const MODULE_FILE = path.join(__dirname, '..', 'production-mapping.cjs');
const ENGINE_FILE = path.join(REBUILD_ROOT, 'engine', 'oracle-shim.cjs');
const Port = require(path.join(REBUILD_ROOT, 'm3', 'setup', 'port', 'port.cjs'));

test('P3-M0 - the suite really is standing in America/New_York', () => {
  assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, 'America/New_York',
    'set TZ=America/New_York: the calendar below is this zone\'s own');
});

/* THE ENGINE IDENTITY, recomputed by the very function port.cjs uses to write
   the block the mapping must match (port.cjs:714). A moved engine byte moves
   sha256 or treeSha256 and this goes red. */
test('P3-M1 - the pinned engine identity is port.cjs engineDigest() of the real '
  + 'oracle shim, and its four fields are exactly the bundle\'s', () => {
  const digest = Port.engineDigest(ENGINE_FILE);
  assert.equal(Mapping.ENGINE.sha256, digest.sha256);
  assert.equal(Mapping.ENGINE.treeSha256, digest.treeSha256);
  assert.equal(Mapping.ENGINE.path, 'rebuild/engine/oracle-shim.cjs');
  const module_ = require(ENGINE_FILE);
  assert.equal(Mapping.ENGINE.schemaV, (module_.__test || module_).SCHEMA_V);
  assert.deepEqual(Object.keys(Mapping.ENGINE).sort(),
    ['path', 'schemaV', 'sha256', 'treeSha256']);
});

test('P3-M2 - the pinned engine sha is the same byte SOURCE_PINS pins, and the '
  + 'gate is port.cjs GATE', () => {
  assert.equal(Mapping.ENGINE.sha256, Profile.SOURCE_PINS['rebuild/engine/oracle-shim.cjs']);
  assert.equal(Mapping.GATE.clock, Port.GATE.clock);
  assert.equal(Mapping.GATE.tz, Port.GATE.tz);
});

/* THE TRIP-WIRE, the coach's own: recompute the sealed receipt's sha and the
   standing package rebuild.yml names. A reseal that moves either goes red here
   until this ticket's successor updates rebuild/coach/engine-revision.cjs. */
function standingPackageShortId() {
  const yml = fs.readFileSync(path.join(REPO_ROOT, '.github', 'workflows', 'rebuild.yml'), 'utf8');
  const m = /b-package\.cjs\s+--ci\s+--package\s+(\S+)/.exec(yml);
  assert.ok(m, 'no standing `b-package.cjs --ci --package <id>` step found in rebuild.yml');
  return m[1];
}

test('P3-M3 - the mapping\'s engine revision recomputes from the standing '
  + 'package\'s sealed receipt on disk', () => {
  const m = /^([^@]+)@([0-9a-f]{16})$/.exec(Mapping.ENGINE_REVISION);
  assert.ok(m, 'ENGINE_REVISION is not <package-id>@<16 hex>: ' + Mapping.ENGINE_REVISION);
  const [, packageId, prefix] = m;
  const shortId = standingPackageShortId();
  const receiptPath = path.join(REBUILD_ROOT, 'lanes', 'b', 'tooling', 'receipts',
    shortId + '.json');
  const bytes = fs.readFileSync(receiptPath);
  assert.equal(prefix, crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16),
    'revision prefix does not match sha256(receipts/' + shortId + '.json)');
  const receipt = JSON.parse(bytes.toString('utf8'));
  assert.equal(packageId, receipt.packageId || receipt.lanePackage,
    'revision package id does not match the receipt');
});

test('P3-M4 - the mapping is NAMED by that sealed package identity, and carries '
  + 'it in the row admission qualifies', () => {
  assert.equal(Mapping.MAPPING_ID,
    'earned/import/production-producer-mapping/' + Mapping.ENGINE_REVISION);
  const mapping = Mapping.productionMapping({ materialDigest: 'a'.repeat(64) });
  assert.equal(mapping.id, Mapping.MAPPING_ID);
  assert.equal(mapping.engine_revision, Mapping.ENGINE_REVISION);
  assert.equal(require('../../../coach/engine-revision.cjs').ENGINE_REVISION,
    Mapping.ENGINE_REVISION, 'a second revision scheme was invented');
});

test('P3-M5 - the producer ids are exactly the ones the shipped page has', () => {
  assert.deepEqual([...Mapping.PRODUCERS].sort(),
    [EngineCapture.PROFILE, EngineCapture.CONFIGURATION_PROFILE].sort());
});

/* THE CALENDAR ZONE IS THE DEVICE'S, NOT A LITERAL. clockAt (local-source-
   profile.cjs:36) refuses unless the calendar zone equals the device's resolved
   timezone, so a literal would be a claim about a phone this code cannot see. */
test('P3-M6 - the execution calendar declares the DEVICE\'s resolved timezone, '
  + 'and no literal zone is written into it', () => {
  const source = fs.readFileSync(MODULE_FILE, 'utf8');
  assert.match(source, /zone:\s*resolvedZone\(\)/, 'the calendar zone is not device-derived');
  assert.equal(/zone:\s*['"]/.test(source), false, 'a literal zone is written into a calendar');
  assert.equal(Mapping.resolvedZone(), Intl.DateTimeFormat().resolvedOptions().timeZone);
  assert.equal(Mapping.executionCalendar().zone, Intl.DateTimeFormat().resolvedOptions().timeZone);
  /* and in the zone the gate is pinned to, the two rules meet */
  assert.equal(Mapping.executionCalendar().zone, Mapping.GATE.tz);
});

test('P3-M7 - every dated row is this device\'s own civil noon and offset, and '
  + 'both sides of every US DST change from 2016 to 2032 are named', () => {
  for (const row of Mapping.CALENDAR_DATES) {
    const [y, m, d] = row.day.split('-').map(Number), noon = new Date(y, m - 1, d, 12);
    assert.equal(noon.toISOString(), row.noonISO, row.day);
    assert.equal(noon.getTimezoneOffset(), row.offsetMinutes, row.day);
    assert.ok(row.day >= Mapping.CALENDAR_RANGE.from && row.day <= Mapping.CALENDAR_RANGE.to);
  }
  assert.equal(Mapping.CALENDAR_DATES.length, 68, '17 years x 2 changes x 2 sides');
  const offsets = new Set(Mapping.CALENDAR_DATES.map(r => r.offsetMinutes));
  assert.deepEqual([...offsets].sort((a, b) => a - b), [240, 300], 'EDT and EST both witnessed');
  const years = new Set(Mapping.CALENDAR_DATES.map(r => Number(r.day.slice(0, 4))));
  assert.equal(years.size, 17);
  assert.equal(Math.min(...years), 2016);
  assert.equal(Math.max(...years), 2032);
});

test('P3-M8 - the reviewed native-Date evidence is this device\'s own behaviour', () => {
  for (const v of Mapping.NATIVE_DATE.parse_vectors) {
    const actual = Date.parse(v.input);
    if (v.epoch === null) assert.ok(Number.isNaN(actual), v.input);
    else assert.equal(actual, v.epoch, v.input);
  }
  for (const v of Mapping.NATIVE_DATE.constructor_vectors) {
    let iso = null; try { iso = new Date(v.epoch).toISOString(); } catch { iso = null; }
    assert.equal(iso, v.iso, String(v.epoch));
  }
});

/* THE PAGE BOUNDARY. This module ships inside the browser bundle, so it may not
   reach for Node. Its whole require graph is three files; all three are checked
   by text, which is a complete proof because none of them requires anything
   else. Same cell shape as coach/test/engine-revision.test.cjs. */
const GRAPH = Object.freeze({ 'production-mapping.cjs': MODULE_FILE,
  'local-source-profile.cjs': path.join(__dirname, '..', 'local-source-profile.cjs'),
  'coach/engine-revision.cjs': path.join(REBUILD_ROOT, 'coach', 'engine-revision.cjs') });

test('P3-M9 - production-mapping.cjs requires only those two modules, and no '
  + 'file in its graph imports fs, path or crypto', () => {
  const source = fs.readFileSync(MODULE_FILE, 'utf8');
  const required = [...source.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m => m[1]);
  assert.deepEqual(required.sort(), ['../../coach/engine-revision.cjs', './local-source-profile.cjs']);
  for (const [label, file] of Object.entries(GRAPH)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const name of ['fs', 'path', 'crypto', 'node:fs', 'node:path', 'node:crypto'])
      assert.equal(new RegExp('require\\(\\s*["\']' + name + '["\']\\s*\\)').test(text), false,
        label + ' requires ' + name);
    assert.equal(/import\s[^;\n]*from\s*["'](node:)?(fs|path|crypto)["']/.test(text), false,
      label + ' ES-imports a Node builtin');
  }
});

/* QUALIFY, CLAUSE BY CLAUSE, against the real local-source-profile.cjs. The
   end-to-end proof over a port.cjs seal and the real stores is in
   ./production-admission.test.mjs; these are the refusals in isolation. */
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const DIGEST = 'b'.repeat(64);
const contextFor = (over = {}) => ({ engine: { ...Mapping.ENGINE, ...(over.engine || {}) },
  oracle: { gate: { ...Mapping.GATE, ...(over.gate || {}) } } });
const registry = () => Mapping.createProductionProducerRegistry({ hash, materialDigest: DIGEST });
const refuses = (fn, why) => assert.throws(fn, e =>
  e.code === 'SOURCE_ENGINE_CONTEXT_UNPROVEN' || assert.fail(why + ': ' + e.code), why);

test('P3-M10 - the PRODUCTION mapping qualifies a bundle that declares the '
  + 'pinned engine and the pinned gate', () => {
  const handle = registry().qualify({ context: contextFor(), materialDigest: DIGEST });
  const resolved = Profile.sourceEngineContext(handle);
  assert.equal(resolved.mapping.id, Mapping.MAPPING_ID);
  assert.equal(resolved.mapping.engine_revision, Mapping.ENGINE_REVISION);
  assert.equal(resolved.execution.id, Mapping.EXECUTION_ID_PREFIX + DIGEST);
  assert.equal(resolved.clock.today(), Mapping.GATE.clock);
  assert.ok(resolved.native, 'the native-Date capability was proved, not skipped');
});

test('P3-M11 - a bundle sealed from a DIFFERENT engine identity refuses', () => {
  for (const over of [{ engine: { sha256: 'c'.repeat(64) } },
    { engine: { treeSha256: 'c'.repeat(64) } }, { engine: { schemaV: 59 } },
    { engine: { path: 'rebuild/engine/index.cjs' } }])
    refuses(() => registry().qualify({ context: contextFor(over), materialDigest: DIGEST }),
      'engine ' + JSON.stringify(over));
});

test('P3-M12 - a bundle sealed on a different oracle gate refuses', () => {
  for (const over of [{ gate: { clock: '2026-09-04' } }, { gate: { tz: 'UTC' } }])
    refuses(() => registry().qualify({ context: contextFor(over), materialDigest: DIGEST }),
      'gate ' + JSON.stringify(over));
});

/* THE REVIEWED ROW (the brief's section 5, and R1's MAJOR 2). A registry built
   WITH a material digest is PINNED to that bundle: this is the shape the day
   port.cjs writes Joe's file and its digest has been read by hand. */
test('P3-M13 - a registry pinned to a REVIEWED material digest refuses any other '
  + 'material, and a registry with no hash is still refused outright', () => {
  refuses(() => registry().qualify({ context: contextFor(), materialDigest: 'd'.repeat(64) }),
    'foreign material');
  assert.throws(() => Mapping.createProductionProducerRegistry({ materialDigest: DIGEST }),
    TypeError, 'the platform hash function is still required');
  assert.throws(() => Mapping.createProductionProducerRegistry({ hash, materialDigest: '' }),
    TypeError, 'an empty string is not a reviewed pin');
  assert.throws(() => Mapping.createProductionProducerRegistry({ hash, materialDigest: 7 }),
    TypeError, 'a reviewed pin is a digest string');
});

/* THE PRODUCTION WIRING (both mapping reviews' MAJOR 2). The controller takes
   its registry at ITS construction and derives the material digest privately at
   qualify time, so the page must be able to build this registry knowing no
   digest at all. Built that way the row is bound from the digest PRESENTED -
   and every other clause still bites. */
test('P3-M16 - built with no material digest, the registry binds the execution '
  + 'row at QUALIFY time from the digest presented, and refuses when none is', () => {
  const wired = Mapping.createProductionProducerRegistry({ hash });
  const resolved = Profile.sourceEngineContext(
    wired.qualify({ context: contextFor(), materialDigest: DIGEST }));
  assert.equal(resolved.execution.material_digest, DIGEST);
  assert.equal(resolved.execution.id, Mapping.EXECUTION_ID_PREFIX + DIGEST);
  assert.equal(resolved.mapping.id, Mapping.MAPPING_ID);
  /* IT IS THE SAME ROW A REVIEWED PIN PRODUCES. The basis digest is the profile's
     own hash over {mapping, execution}, so equality here is equality of the whole
     qualified row, not of a label. */
  assert.equal(resolved.digest, Profile.sourceEngineContext(
    registry().qualify({ context: contextFor(), materialDigest: DIGEST })).digest);
  const other = 'e'.repeat(64);
  assert.equal(Profile.sourceEngineContext(
    wired.qualify({ context: contextFor(), materialDigest: other })).execution.material_digest,
    other, 'the row follows the material presented, one admission at a time');
  refuses(() => wired.qualify({ context: contextFor({ engine: { sha256: 'c'.repeat(64) } }),
    materialDigest: DIGEST }), 'another engine identity');
  refuses(() => wired.qualify({ context: contextFor({ gate: { tz: 'UTC' } }),
    materialDigest: DIGEST }), 'another oracle gate');
  for (const bad of [undefined, null, '', 7, {}])
    refuses(() => wired.qualify({ context: contextFor(), materialDigest: bad }),
      'no material digest: ' + JSON.stringify(bad));
  refuses(() => wired.qualify(), 'no request at all');
});

test('P3-M14 - the calendar clocks a day inside the range and refuses one '
  + 'outside it, naming no zone of its own', () => {
  const handle = registry().qualify({ context: contextFor(), materialDigest: DIGEST });
  assert.ok(Profile.engineContextAt(handle, Mapping.CALENDAR_RANGE.from, 12));
  assert.ok(Profile.engineContextAt(handle, Mapping.CALENDAR_RANGE.to, 12));
  refuses(() => Profile.engineContextAt(handle, '2015-12-31', 12), 'before the range');
  refuses(() => Profile.engineContextAt(handle, '2033-01-01', 12), 'after the range');
});

/* THE PHONE IN ANOTHER ZONE. The device's resolved timezone is the only thing
   that moves here; the mapping refuses rather than clocking his history in a
   zone the gate was never run in. This is the cell the ticket's clockAt
   constraint is about, and it is why the zone is read and never written. */
test('P3-M15 - on a device that resolves to another timezone the mapping '
  + 'refuses SOURCE_ENGINE_CONTEXT_UNPROVEN', () => {
  const real = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function (...args) {
    const made = new real(...args);
    return { ...made, resolvedOptions: () => ({ ...made.resolvedOptions(),
      timeZone: 'America/Los_Angeles' }) };
  };
  try {
    assert.equal(Mapping.resolvedZone(), 'America/Los_Angeles');
    refuses(() => registry().qualify({ context: contextFor(), materialDigest: DIGEST }),
      'a phone outside the gate\'s zone');
  } finally { Intl.DateTimeFormat = real; }
  assert.equal(Mapping.resolvedZone(), 'America/New_York', 'the stub was restored');
});
