/* THE STARTER WEEK (A4B-BRIEF 4.2 to 4.4).

   PROVENANCE. Three things here are SOURCED and one is INVENTED, and they are
   kept apart on purpose.

   SOURCED - rebuild/engine/volume.cjs:62-85. Weekly sets for a bucket are
   `sets x lifts in that bucket x days of that kind per week`, the bucket is
   `head || mg` (:74), and the zone ladder is `< floor UNDER, < lo LOW,
   <= hi IN-BAND, <= ceil HIGH, else OVER` (:83) over VOL_BANDS
   (constants.cjs:327). This module RE-STATES that arithmetic; it does not
   import the engine (H1, DECISIONS:93 C3), and its test re-derives both from
   volume.cjs rather than from here.

   SOURCED - A4's own standards: STANDARD_SETS and STANDARD_HI, from
   setup-model.mjs, themselves INVENTED at A4 and declared there
   (DECISIONS:114 (2), :117 (5)). Nothing new is invented about sets or reps.

   INVENTED, declared here and named on screen - which buckets count as MAJOR
   per kind, and the composition rule `lifts(major, D) = 2 if D <= 2 else 1`
   with minors placed only at D >= 3. This is the whole of A4b's programming
   opinion and it is deliberately small: it exists to land the majors inside
   the engine's own band at every day count, and it promises nothing else.

   NOT INVENTED - a load. The proposer fills in no weight, no first rung and no
   increment: screen 4 is unchanged and the first session is still the probe
   (DECISIONS:125 (3), today.cjs:80-90). Rows come out with those three blank.

   SEAM (open question: the alternation and composition rules are INVENTED and
   awaiting a ruling). Everything a different ruling would move lives in
   UPPER_MAJORS / LOWER_MAJORS / MINORS and liftsPerMajor / minorsPlaced below.
   Changing the rule is changing those five things and nothing else. */

import { STANDARD_SETS, STANDARD_HI } from './setup-model.mjs';
import { CATALOGUE, bucketOf, entriesInBucket } from './exercise-catalogue.mjs';

/* VOL_BANDS re-stated from constants.cjs:327. */
export const VOL_BANDS = Object.freeze({ floor: 6, lo: 8, hi: 14, ceil: 22 });

/* volume.cjs:83, verbatim as a ladder. */
export function zoneOf(sets) {
  if (!Number.isFinite(sets)) return null;
  if (sets < VOL_BANDS.floor) return 'UNDER';
  if (sets < VOL_BANDS.lo) return 'LOW';
  if (sets <= VOL_BANDS.hi) return 'IN-BAND';
  if (sets <= VOL_BANDS.ceil) return 'HIGH';
  return 'OVER';
}

/* --- THE INVENTED PART, all five pieces of it ------------------------- */
export const UPPER_MAJORS = Object.freeze(['chest', 'lats', 'upper_back', 'delts_side']);
export const LOWER_MAJORS = Object.freeze(['quads', 'hams', 'glutes', 'calves']);
export const MINORS = Object.freeze(['delts_front', 'delts_rear', 'biceps', 'triceps', 'abs']);
export const liftsPerMajor = (D) => (D <= 2 ? 2 : 1);
export const minorsPlaced = (D) => D >= 3;
/* --------------------------------------------------------------------- */

/* forearms, traps and lower_back are never placed directly: they are
   indirect-credit buckets (constants.cjs:330). A lift may still SIT in one of
   them through its head - rack_pull is a lower_back lift - which is why this
   list is a placement rule, not a filter on the catalogue. */
export const INDIRECT_ONLY = Object.freeze(['forearms', 'traps', 'lower_back']);

const MAJORS = Object.freeze({ U: UPPER_MAJORS, L: LOWER_MAJORS });

/* A minor belongs to the kind its catalogue entries are written for. Reading it
   off the data keeps the one place that decides U vs L in the catalogue. */
const minorKind = (bucket) => (entriesInBucket(bucket, 'U').length ? 'U'
  : entriesInBucket(bucket, 'L').length ? 'L' : null);

export function planBuckets(kinds) {
  const perWeek = { U: 0, L: 0 };
  for (const k of Object.values(kinds || {})) if (k === 'U' || k === 'L') perWeek[k] += 1;
  const plan = { U: {}, L: {} };
  for (const kind of ['U', 'L']) {
    const D = perWeek[kind];
    if (!D) continue;
    for (const bucket of MAJORS[kind]) plan[kind][bucket] = liftsPerMajor(D);
    if (!minorsPlaced(D)) continue;
    for (const bucket of MINORS) if (minorKind(bucket) === kind) plan[kind][bucket] = 1;
  }
  return plan;
}

/* volume.cjs:62-82's arithmetic, over rows the athlete can still edit. The
   screen shows these numbers and their zones; nothing else computes them. */
export function weeklySets(rows, kinds, tags) {
  const perWeek = { U: 0, L: 0 };
  for (const k of Object.values(kinds || {})) if (k === 'U' || k === 'L') perWeek[k] += 1;
  const by = {};
  for (const row of rows || []) {
    const days = perWeek[row.day] || 0;
    const sets = Number(row.sets);
    if (!days || !Number.isFinite(sets) || sets <= 0) continue;
    const tag = (tags && tags[row.id]) || {};
    const bucket = tag.head || row.mg;
    if (!bucket) continue;
    by[bucket] = (by[bucket] || 0) + sets * days;
  }
  return by;
}

export function zonesOf(rows, kinds, tags) {
  const by = weeklySets(rows, kinds, tags);
  return Object.fromEntries(Object.entries(by).map(([b, n]) => [b, { sets: n, zone: zoneOf(n) }]));
}

/* Deterministic pick: catalogue order, which is the order the file is written
   in, so the same answers always produce the same week. */
function pick(bucket, kind, count, taken) {
  const out = [];
  for (const entry of CATALOGUE) {
    if (out.length >= count) break;
    if (taken.has(entry.id)) continue;
    if (bucketOf(entry) !== bucket) continue;
    if (!entry.kinds.includes(kind)) continue;
    taken.add(entry.id);
    out.push(entry);
  }
  return out;
}

/* The proposal. Rows are A4's own editable answer shape (setup-model.mjs
   newExercise) so BOTH doors land on the same week and every entry stays
   renameable and removable: first, inc and rungs come out blank, exactly as
   they do when he adds a lift by hand. `tags` rides beside them and is what
   the third payload member is built from (brief 5). */
export function proposeWeek(spec) {
  const kinds = (spec && spec.kinds) || {};
  const sets = (spec && Number.isSafeInteger(spec.sets) && spec.sets > 0) ? spec.sets : STANDARD_SETS;
  const hi = (spec && Number.isSafeInteger(spec.hi) && spec.hi > 0) ? spec.hi : STANDARD_HI;
  const plan = planBuckets(kinds);
  const taken = new Set();
  const rows = [];
  const tags = {};
  for (const kind of ['U', 'L']) {
    for (const [bucket, count] of Object.entries(plan[kind])) {
      for (const entry of pick(bucket, kind, count, taken)) {
        rows.push({
          key: entry.id, id: entry.id, n: entry.n, mg: entry.mg,
          mgSource: 'catalogue', day: kind, sets, hi,
          first: '', inc: '', rungs: '',
        });
        tags[entry.id] = {
          head: entry.head,
          secondary: entry.secondary.map((s) => ({ mg: s.mg, lend: s.lend })),
        };
      }
    }
  }
  return { rows, tags };
}

export default {
  VOL_BANDS, zoneOf, zonesOf, weeklySets, planBuckets, proposeWeek,
  UPPER_MAJORS, LOWER_MAJORS, MINORS, INDIRECT_ONLY, liftsPerMajor, minorsPlaced,
};
