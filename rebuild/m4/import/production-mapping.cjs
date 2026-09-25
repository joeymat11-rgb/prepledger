'use strict';

/* P3-PRODUCER-MAPPING (DECISIONS:475 (3); the second blocker of :472).
 *
 * THE ONE PRODUCTION execution calendar and producer mapping that
 * rebuild/m3/w6/local/source-admission.mjs qualifies a sealed bundle against.
 * Every other createProducerRegistry caller in the tree is a TEST-ONLY harness
 * (m3/w6/test, m3/w7-preview/import/test, m4/import/test, lanes/astra/reviews);
 * this is the one the phone is meant to use, and until it does, admission of a
 * real bundle refuses SOURCE_ENGINE_CONTEXT_UNPROVEN.
 *
 * WHY THIS FILE LIVES HERE. local-source-profile.cjs, whose qualify() reads
 * every field below, is rebuild/m4/import/local-source-profile.cjs, and this
 * module is meaningless without it: its PUBLIC_FACTORY_DIGEST and SOURCE_PINS
 * are pinned into the mapping by identity, not by copy. m3/w6/host holds
 * page-safe MIRRORS of m4 modules (engine-runtime-host.cjs); this is not a
 * mirror of anything, so it belongs beside the law it satisfies.
 *
 * NO fs, path or crypto import: this ships inside the browser bundle, and the
 * page's input law refuses any Node-only import. Everything that could only be
 * measured on a PC (the engine digests, the sealed package identity, the
 * calendar's noon ISO strings and offsets) is a LITERAL here, recomputed from
 * the tree by production-mapping.test.cjs, exactly as rebuild/coach/
 * engine-revision.cjs and its trip-wire test do. That is the same revision
 * scheme, reused; there is no second one.
 *
 * WHAT IS PROVED AND WHAT IS NOT. qualify() matches an execution row by
 * material_digest, and the material digest of Joe's bundle cannot exist before
 * the bundle does, so the execution row is BOUND to the material presented at
 * admission (P3-ADMIT-DECISION-BRIEF.md section 5 says the same). That match is
 * therefore not a guard in production and is not claimed as one. The guards
 * this mapping does carry are the engine identity, the oracle gate and the
 * execution calendar: a bundle sealed by any other engine, or on any other
 * gate, cannot qualify, and a device whose own Date disagrees with one named
 * calendar day refuses instead of admitting quietly. The material itself is
 * proved elsewhere - by the bundle seal, and by source-admission.mjs:73, which
 * compares the custody entry's four hashes against the material it just read.
 */

const Profile = require('./local-source-profile.cjs');
const { ENGINE_REVISION } = require('../../coach/engine-revision.cjs');

/* THE SEALED ENGINE IDENTITY, byte for byte. sha256 is the same byte
 * local-source-profile.cjs pins as SOURCE_PINS['rebuild/engine/oracle-shim.cjs']
 * and qualify() re-checks it against that map; treeSha256 is port.cjs
 * engineDigest()'s sha over the 18 engine modules and has no other pin in the
 * tree, so production-mapping.test.cjs recomputes BOTH from the real files.
 * qualify() compares this object to the bundle's own engine block by encoded
 * identity, so the field set must match port.cjs:714 exactly - four fields, no
 * more. ENGINE_REVISION is carried beside it as the sealed PACKAGE identity the
 * running bytes were accepted under; it is not read by qualify(), it enters the
 * basis through the engine digest, and its trip-wire is the coach's. */
const ENGINE = Object.freeze({
  sha256: 'dd653bc170d3c5ae3b8cfa5c2ca8166b1de385a0903e056eab7ea062c125052d',
  /* S10 re-pin: S10 edited engine today.cjs and writers.cjs; value measured by the PM from port.cjs engineDigest() at 92be4e3. */
  treeSha256: '9c13505441a479cb98a6cc9a25358cec9d983bac0f08b342b0109e3d93f6709a',
  schemaV: 60,
  path: 'rebuild/engine/oracle-shim.cjs' });

/* THE ORACLE GATE the bundle must have been sealed on: port.cjs GATE, and the
 * two fields qualify() compares against the bundle's oracle.gate. Both are also
 * hard-required by local-source-profile.cjs:79, so these are not a choice. */
const GATE = Object.freeze({ clock: '2026-09-03', tz: 'America/New_York' });

/* THE PRODUCER IDS THE SHIPPED PAGE ACTUALLY HAS. These are the only two
 * prescription-capture rule profiles source-admission.mjs will accept when it
 * reproduces a workout (`producer.rule_profile`, replay's resolveCapturedLayout),
 * and they are rebuild/m4/workout/engine-capture.cjs PROFILE and
 * CONFIGURATION_PROFILE. Named as literals because engine-capture.cjs is not
 * otherwise in this module's graph; the test asserts the set is exactly the
 * one that file exports, so a third producer goes red here before it can be
 * admitted unannounced. */
const PRODUCERS = Object.freeze(['earned/engine-workout-capture/v1',
  'earned/engine-workout-capture/v2']);

/* THE EXECUTION CALENDAR.
 *
 * THE ZONE IS NEVER A LITERAL. local-source-profile.cjs clockAt() (:36) refuses
 * unless calendar.zone === Intl.DateTimeFormat().resolvedOptions().timeZone, so
 * the zone this mapping declares must be the DEVICE's own resolved timezone or
 * nothing on this calendar can be clocked at all. qualify() separately requires
 * calendar.zone === mapping.gate.tz, and the gate's tz is pinned to
 * 'America/New_York' by law. Writing the literal would therefore mean the
 * mapping silently claims a zone the device may not be in; reading it from the
 * device means the two rules meet, and on a phone that resolves to anything
 * else the mapping refuses SOURCE_ENGINE_CONTEXT_UNPROVEN instead of clocking
 * his history in the wrong zone. That refusal is the intended behaviour, and
 * the cells drive it from both sides.
 *
 * THE DATED LIST IS STILL NEW YORK FACT. The days below and their noon ISO and
 * offset are the America/New_York calendar's own, computed once on the PC and
 * pasted here; qualify() re-derives every one of them on the device before it
 * will hand out a context. So the vectors are real evidence, not a tautology:
 * a device with stale tz data, or in another zone that happens to answer the
 * zone check, disagrees on one of them and refuses.
 *
 * COVERAGE. Both sides of EVERY US DST transition from 2016 to 2032 - the
 * Saturday before and the Sunday of each March and November change. The range
 * is the span an old-app history can plausibly reach back to and the horizon
 * the page will run over; a day outside it refuses at the reached operation,
 * naming that day, and is widened by a reviewed edit here, never at runtime. */
const CALENDAR_ID = 'earned/native-date-compatibility/america-new-york/2016-2032';
const CALENDAR_RANGE = Object.freeze({ from: '2016-01-01', to: '2032-12-31' });
const CALENDAR_DATES = Object.freeze([
 {day:'2016-03-12',noonISO:'2016-03-12T17:00:00.000Z',offsetMinutes:300},
 {day:'2016-03-13',noonISO:'2016-03-13T16:00:00.000Z',offsetMinutes:240},
 {day:'2016-11-05',noonISO:'2016-11-05T16:00:00.000Z',offsetMinutes:240},
 {day:'2016-11-06',noonISO:'2016-11-06T17:00:00.000Z',offsetMinutes:300},
 {day:'2017-03-11',noonISO:'2017-03-11T17:00:00.000Z',offsetMinutes:300},
 {day:'2017-03-12',noonISO:'2017-03-12T16:00:00.000Z',offsetMinutes:240},
 {day:'2017-11-04',noonISO:'2017-11-04T16:00:00.000Z',offsetMinutes:240},
 {day:'2017-11-05',noonISO:'2017-11-05T17:00:00.000Z',offsetMinutes:300},
 {day:'2018-03-10',noonISO:'2018-03-10T17:00:00.000Z',offsetMinutes:300},
 {day:'2018-03-11',noonISO:'2018-03-11T16:00:00.000Z',offsetMinutes:240},
 {day:'2018-11-03',noonISO:'2018-11-03T16:00:00.000Z',offsetMinutes:240},
 {day:'2018-11-04',noonISO:'2018-11-04T17:00:00.000Z',offsetMinutes:300},
 {day:'2019-03-09',noonISO:'2019-03-09T17:00:00.000Z',offsetMinutes:300},
 {day:'2019-03-10',noonISO:'2019-03-10T16:00:00.000Z',offsetMinutes:240},
 {day:'2019-11-02',noonISO:'2019-11-02T16:00:00.000Z',offsetMinutes:240},
 {day:'2019-11-03',noonISO:'2019-11-03T17:00:00.000Z',offsetMinutes:300},
 {day:'2020-03-07',noonISO:'2020-03-07T17:00:00.000Z',offsetMinutes:300},
 {day:'2020-03-08',noonISO:'2020-03-08T16:00:00.000Z',offsetMinutes:240},
 {day:'2020-10-31',noonISO:'2020-10-31T16:00:00.000Z',offsetMinutes:240},
 {day:'2020-11-01',noonISO:'2020-11-01T17:00:00.000Z',offsetMinutes:300},
 {day:'2021-03-13',noonISO:'2021-03-13T17:00:00.000Z',offsetMinutes:300},
 {day:'2021-03-14',noonISO:'2021-03-14T16:00:00.000Z',offsetMinutes:240},
 {day:'2021-11-06',noonISO:'2021-11-06T16:00:00.000Z',offsetMinutes:240},
 {day:'2021-11-07',noonISO:'2021-11-07T17:00:00.000Z',offsetMinutes:300},
 {day:'2022-03-12',noonISO:'2022-03-12T17:00:00.000Z',offsetMinutes:300},
 {day:'2022-03-13',noonISO:'2022-03-13T16:00:00.000Z',offsetMinutes:240},
 {day:'2022-11-05',noonISO:'2022-11-05T16:00:00.000Z',offsetMinutes:240},
 {day:'2022-11-06',noonISO:'2022-11-06T17:00:00.000Z',offsetMinutes:300},
 {day:'2023-03-11',noonISO:'2023-03-11T17:00:00.000Z',offsetMinutes:300},
 {day:'2023-03-12',noonISO:'2023-03-12T16:00:00.000Z',offsetMinutes:240},
 {day:'2023-11-04',noonISO:'2023-11-04T16:00:00.000Z',offsetMinutes:240},
 {day:'2023-11-05',noonISO:'2023-11-05T17:00:00.000Z',offsetMinutes:300},
 {day:'2024-03-09',noonISO:'2024-03-09T17:00:00.000Z',offsetMinutes:300},
 {day:'2024-03-10',noonISO:'2024-03-10T16:00:00.000Z',offsetMinutes:240},
 {day:'2024-11-02',noonISO:'2024-11-02T16:00:00.000Z',offsetMinutes:240},
 {day:'2024-11-03',noonISO:'2024-11-03T17:00:00.000Z',offsetMinutes:300},
 {day:'2025-03-08',noonISO:'2025-03-08T17:00:00.000Z',offsetMinutes:300},
 {day:'2025-03-09',noonISO:'2025-03-09T16:00:00.000Z',offsetMinutes:240},
 {day:'2025-11-01',noonISO:'2025-11-01T16:00:00.000Z',offsetMinutes:240},
 {day:'2025-11-02',noonISO:'2025-11-02T17:00:00.000Z',offsetMinutes:300},
 {day:'2026-03-07',noonISO:'2026-03-07T17:00:00.000Z',offsetMinutes:300},
 {day:'2026-03-08',noonISO:'2026-03-08T16:00:00.000Z',offsetMinutes:240},
 {day:'2026-10-31',noonISO:'2026-10-31T16:00:00.000Z',offsetMinutes:240},
 {day:'2026-11-01',noonISO:'2026-11-01T17:00:00.000Z',offsetMinutes:300},
 {day:'2027-03-13',noonISO:'2027-03-13T17:00:00.000Z',offsetMinutes:300},
 {day:'2027-03-14',noonISO:'2027-03-14T16:00:00.000Z',offsetMinutes:240},
 {day:'2027-11-06',noonISO:'2027-11-06T16:00:00.000Z',offsetMinutes:240},
 {day:'2027-11-07',noonISO:'2027-11-07T17:00:00.000Z',offsetMinutes:300},
 {day:'2028-03-11',noonISO:'2028-03-11T17:00:00.000Z',offsetMinutes:300},
 {day:'2028-03-12',noonISO:'2028-03-12T16:00:00.000Z',offsetMinutes:240},
 {day:'2028-11-04',noonISO:'2028-11-04T16:00:00.000Z',offsetMinutes:240},
 {day:'2028-11-05',noonISO:'2028-11-05T17:00:00.000Z',offsetMinutes:300},
 {day:'2029-03-10',noonISO:'2029-03-10T17:00:00.000Z',offsetMinutes:300},
 {day:'2029-03-11',noonISO:'2029-03-11T16:00:00.000Z',offsetMinutes:240},
 {day:'2029-11-03',noonISO:'2029-11-03T16:00:00.000Z',offsetMinutes:240},
 {day:'2029-11-04',noonISO:'2029-11-04T17:00:00.000Z',offsetMinutes:300},
 {day:'2030-03-09',noonISO:'2030-03-09T17:00:00.000Z',offsetMinutes:300},
 {day:'2030-03-10',noonISO:'2030-03-10T16:00:00.000Z',offsetMinutes:240},
 {day:'2030-11-02',noonISO:'2030-11-02T16:00:00.000Z',offsetMinutes:240},
 {day:'2030-11-03',noonISO:'2030-11-03T17:00:00.000Z',offsetMinutes:300},
 {day:'2031-03-08',noonISO:'2031-03-08T17:00:00.000Z',offsetMinutes:300},
 {day:'2031-03-09',noonISO:'2031-03-09T16:00:00.000Z',offsetMinutes:240},
 {day:'2031-11-01',noonISO:'2031-11-01T16:00:00.000Z',offsetMinutes:240},
 {day:'2031-11-02',noonISO:'2031-11-02T17:00:00.000Z',offsetMinutes:300},
 {day:'2032-03-13',noonISO:'2032-03-13T17:00:00.000Z',offsetMinutes:300},
 {day:'2032-03-14',noonISO:'2032-03-14T16:00:00.000Z',offsetMinutes:240},
 {day:'2032-11-06',noonISO:'2032-11-06T16:00:00.000Z',offsetMinutes:240},
 {day:'2032-11-07',noonISO:'2032-11-07T17:00:00.000Z',offsetMinutes:300}].map(Object.freeze));

/* THE REVIEWED NATIVE-DATE EVIDENCE. Without it, nativeDateCapability() returns
 * null and the reproduction walk refuses at merge.cjs's nativeDate seam, so the
 * mapping cannot omit it. Each raw input is bound to the exact epoch the native
 * implementation must produce, malformed input to NaN, each epoch to its exact
 * native ISO or to the invalid outcome at the +1 boundary; all of it is
 * re-executed on the device at qualify time. The days chosen are the gate day
 * and one DST day from each end of the range. */
const NATIVE_DATE = Object.freeze({
  profile: 'earned/native-date-capability/v1',
  parse_vectors: Object.freeze([
    Object.freeze({ input: '2026-09-03T12:00:00.000Z', epoch: 1788436800000 }),
    Object.freeze({ input: '2020-03-08T12:00:00.000Z', epoch: 1583668800000 }),
    Object.freeze({ input: '2032-11-07T12:00:00.000Z', epoch: 1983441600000 }),
    Object.freeze({ input: 'not-a-timestamp', epoch: null })]),
  constructor_vectors: Object.freeze([
    Object.freeze({ epoch: 1788436800001, iso: '2026-09-03T12:00:00.001Z' }),
    Object.freeze({ epoch: 1583668800000, iso: '2020-03-08T12:00:00.000Z' }),
    Object.freeze({ epoch: 8640000000000001, iso: null })]) });

/* The reproduction walk's ONE declared input beyond the material itself:
 * engine-provider.cjs reads mapping.dependencies.drafts and hands the walk an
 * empty draft set when it says so, and poisons the provider when it does not.
 * A PC seal has no drafts, so 'default-empty' is the honest declaration; every
 * other provider root (SEED, HISTORY, ROLLUPS, ids) stays unavailable. */
const DEPENDENCIES = Object.freeze({ drafts: 'default-empty' });

const MAPPING_ID = 'earned/import/production-producer-mapping/' + ENGINE_REVISION;
const EXECUTION_ID_PREFIX = 'earned/import/execution/';
const resolvedZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

function executionCalendar() {
  return { profile: 'earned/native-date-compatibility/v1', compatibility_id: CALENDAR_ID,
    zone: resolvedZone(), range: { from: CALENDAR_RANGE.from, to: CALENDAR_RANGE.to },
    dates: CALENDAR_DATES.map(row => ({ day: row.day, noonISO: row.noonISO,
      offsetMinutes: row.offsetMinutes })),
    native_date: { profile: NATIVE_DATE.profile,
      parse_vectors: NATIVE_DATE.parse_vectors.map(v => ({ input: v.input, epoch: v.epoch })),
      constructor_vectors: NATIVE_DATE.constructor_vectors.map(v => ({ epoch: v.epoch, iso: v.iso })) } };
}

/* The mapping for ONE admission. materialDigest is the digest source-admission
 * .mjs:74 computed from the custody material it is holding; the execution id is
 * derived from it so the row names exactly the material it is about and nothing
 * is invented per run. A reviewed execution row may be supplied instead once a
 * bundle exists and has been reviewed by hand (the brief's path); the shape is
 * identical either way. */
function productionMapping({ materialDigest, executionId } = {}) {
  if (typeof materialDigest !== 'string' || !materialDigest)
    throw new TypeError('The material digest of the bundle being admitted is required');
  return { profile: 'earned/source-producer-mapping/v1', id: MAPPING_ID,
    construction: 'oracle-shim-default/v1',
    engine: { sha256: ENGINE.sha256, treeSha256: ENGINE.treeSha256, schemaV: ENGINE.schemaV,
      path: ENGINE.path },
    engine_revision: ENGINE_REVISION,
    gate: { clock: GATE.clock, tz: GATE.tz },
    public_factory_digest: Profile.PUBLIC_FACTORY_DIGEST, source_pins: Profile.SOURCE_PINS,
    producers: PRODUCERS.slice(), dependencies: { drafts: DEPENDENCIES.drafts },
    executions: [{ id: executionId || (EXECUTION_ID_PREFIX + materialDigest),
      material_digest: materialDigest, calendar: executionCalendar() }] };
}

/* THE ONE PRODUCTION REGISTRY. This is what createLocalSourceController's
 * producerRegistry must be on the phone. It carries exactly one mapping: the
 * registry qualifies only when exactly one entry matches, so a second mapping
 * here would be a way to make admission ambiguous, and there is none.
 *
 * TWO WAYS TO BUILD IT, AND THE DIFFERENCE IS THE WHOLE POINT (P3-D-FOLLOWONS,
 * both mapping reviews' MAJOR 2).
 *
 * WITHOUT materialDigest - THE PRODUCTION WIRING. The controller takes its
 * producerRegistry at ITS construction (source-admission.mjs:31-32) and derives
 * the material digest only later, privately, at qualify time (:74, over the
 * four custody strings it is holding). A registry that needed that digest up
 * front could only be built by DUPLICATING that private derivation in the page:
 * a sixth copy of a harness line, which fails closed if it drifts but is the
 * wrong shape. So the row is BOUND AT QUALIFY TIME from the digest the
 * controller presents. This claims nothing it did not claim before: the header
 * above already says the material_digest clause is not a guard in production
 * (the material is proved by the seal and by source-admission.mjs:73), and the
 * engine identity, the oracle gate and the execution calendar all still bite on
 * every qualify.
 *
 * WITH materialDigest - THE REVIEWED ROW (the brief's section 5 path). Once
 * Joe's bundle exists and its digest has been read by hand, the registry is
 * PINNED to it and any other material refuses SOURCE_ENGINE_CONTEXT_UNPROVEN.
 * That is the brief's "one short reviewed addition made the day port.cjs writes
 * the file", and it is now reachable through the shipped constructor. */
function createProductionProducerRegistry({ hash, materialDigest = null, executionId } = {}) {
  if (typeof hash !== 'function')
    throw new TypeError('The platform hash function is required');
  if (materialDigest !== null && (typeof materialDigest !== 'string' || !materialDigest))
    throw new TypeError('A reviewed material digest must be a non-empty string');
  const bound = digest => Profile.createProducerRegistry(
    [productionMapping({ materialDigest: digest, executionId })], { hash });
  if (materialDigest) return bound(materialDigest);
  return Object.freeze({ qualify(request = {}) {
    const presented = request && request.materialDigest;
    if (typeof presented !== 'string' || !presented) {
      const error = new Error('SOURCE_ENGINE_CONTEXT_UNPROVEN');
      error.code = 'SOURCE_ENGINE_CONTEXT_UNPROVEN';
      throw error;
    }
    return bound(presented).qualify(request);
  } });
}

module.exports = { createProductionProducerRegistry, productionMapping, executionCalendar,
  resolvedZone, ENGINE, GATE, PRODUCERS, CALENDAR_ID, CALENDAR_RANGE, CALENDAR_DATES,
  NATIVE_DATE, DEPENDENCIES, MAPPING_ID, EXECUTION_ID_PREFIX, ENGINE_REVISION };
