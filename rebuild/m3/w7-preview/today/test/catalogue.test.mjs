/* A4b S28 to S31: the exercise catalogue and its two doors.
   Every provenance claim in exercise-catalogue.mjs's header is re-derived HERE
   from the engine files themselves, never copied into this test as a literal
   list. If the engine's labels move, this test moves with them and the
   catalogue goes red. The catalogue imports nothing from rebuild/engine (H1,
   DECISIONS:93 C3); the test may READ those files, which is not the same thing. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  CATALOGUE, GROUPS, GROUP_MG, REGIONS, REGION_MG, ENGINE_MG,
  bucketOf, byId, searchByName, regionsOf, entriesFor, entriesInBucket,
  canStopAtGroup, customEntry,
} from '../exercise-catalogue.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENGINE = join(HERE, '..', '..', '..', '..', 'engine');
const CAT_SRC = readFileSync(join(HERE, '..', 'exercise-catalogue.mjs'), 'utf8');
const SEED_SRC = readFileSync(join(ENGINE, 'seed.cjs'), 'utf8');
const CONST_SRC = readFileSync(join(ENGINE, 'constants.cjs'), 'utf8');

/* The eleven labels, re-derived: every `mg: "..."` in seed.cjs's EXERCISES. */
const SEED_MG = (() => {
  const block = SEED_SRC.slice(SEED_SRC.indexOf('const EXERCISES = ['), SEED_SRC.indexOf('const SEED = {'));
  return [...new Set([...block.matchAll(/\bmg:\s*"([a-z_]+)"/g)].map((m) => m[1]))].sort();
})();

/* The three delt heads, re-derived from constants.cjs's MG_LABEL line. */
const DELT_HEADS = (() => {
  const line = CONST_SRC.split(/\r?\n/).find((l) => l.includes('const MG_LABEL'));
  assert.ok(line, 'MG_LABEL not found in constants.cjs');
  return [...line.matchAll(/([a-z_]+):\s*"/g)].map((m) => m[1]).sort();
})();

/* The engine's own bucket choice, re-derived from volume.cjs. */
const VOL_SRC = readFileSync(join(ENGINE, 'volume.cjs'), 'utf8');

const ALL_REGIONS = Object.values(REGIONS).flat();

/* ------------------------------------------------------------ shape (S29) */

test('S29 catalogue size is 60 to 100', () => {
  assert.ok(CATALOGUE.length >= 60 && CATALOGUE.length <= 100, `size ${CATALOGUE.length}`);
});

test('S29 ids are unique', () => {
  assert.equal(new Set(CATALOGUE.map((x) => x.id)).size, CATALOGUE.length);
});

test('S29 every entry carries at least one alias', () => {
  for (const x of CATALOGUE) {
    assert.ok(Array.isArray(x.aliases) && x.aliases.length >= 1, x.id);
    for (const a of x.aliases) assert.ok(typeof a === 'string' && a.trim() !== '', x.id);
  }
});

test('S29 kinds is non-empty and a subset of U,L', () => {
  for (const x of CATALOGUE) {
    assert.ok(Array.isArray(x.kinds) && x.kinds.length >= 1, x.id);
    for (const k of x.kinds) assert.ok(k === 'U' || k === 'L', `${x.id} ${k}`);
    assert.equal(new Set(x.kinds).size, x.kinds.length, x.id);
  }
});

test('S29 every lend is a finite number in (0,1]', () => {
  for (const x of CATALOGUE) {
    for (const s of x.secondary) {
      assert.equal(typeof s.lend, 'number', x.id);
      assert.ok(Number.isFinite(s.lend), x.id);
      assert.ok(s.lend > 0 && s.lend <= 1, `${x.id} ${s.lend}`);
    }
  }
});

test('S29 nothing in the file names an athlete', () => {
  const banned = /\b(joe|joey|joeym|dad|sulek|my dad|the owner's)\b/i;
  const hit = CAT_SRC.split(/\r?\n/)
    .map((l, i) => [i + 1, l])
    .filter(([, l]) => banned.test(l) && !/DECISIONS|OWNER'S ids/.test(l));
  assert.deepEqual(hit, [], `athlete named at ${JSON.stringify(hit)}`);
});

test('S29 entries and the catalogue are frozen', () => {
  assert.ok(Object.isFrozen(CATALOGUE));
  for (const x of CATALOGUE) {
    assert.ok(Object.isFrozen(x), x.id);
    assert.ok(Object.isFrozen(x.aliases) && Object.isFrozen(x.kinds), x.id);
    for (const s of x.secondary) assert.ok(Object.isFrozen(s), x.id);
  }
});

/* ------------------------------------------------- provenance class (S28) */

test('S28 SOURCED: the eleven labels re-derived from seed.cjs match ENGINE_MG', () => {
  assert.equal(SEED_MG.length, 11, SEED_MG.join(','));
  assert.deepEqual([...ENGINE_MG].sort(), SEED_MG);
});

test('S28 SOURCED: every catalogue mg is one of those eleven', () => {
  for (const x of CATALOGUE) assert.ok(SEED_MG.includes(x.mg), `${x.id} mg=${x.mg}`);
});

test('S28 SOURCED: every delt head is a constants.cjs MG_LABEL key', () => {
  assert.deepEqual(DELT_HEADS, ['delts_front', 'delts_rear', 'delts_side']);
  for (const x of CATALOGUE) {
    if (x.mg !== 'delts') continue;
    assert.ok(DELT_HEADS.includes(x.head), `${x.id} head=${x.head}`);
  }
  assert.deepEqual([...REGIONS.shoulders].sort(), DELT_HEADS);
});

test('S28 SOURCED: lend 0.5 is the INDIRECT weight constants.cjs carries', () => {
  const line = CONST_SRC.split(/\r?\n/).find((l) => l.includes('const INDIRECT'));
  assert.ok(line, 'INDIRECT not found');
  const weights = [...new Set([...line.matchAll(/:\s*(0?\.\d+)\b/g)].map((m) => Number(m[1])))];
  assert.deepEqual(weights, [0.5]);
  assert.ok(CATALOGUE.some((x) => x.secondary.some((s) => s.lend === 0.5)));
});

test('S28 INVENTED: 0.25 is the only lend the engine does not carry', () => {
  const used = [...new Set(CATALOGUE.flatMap((x) => x.secondary.map((s) => s.lend)))].sort();
  assert.deepEqual(used, [0.25, 0.5]);
});

test('S28 INVENTED: every non-delt head is on the declared region list', () => {
  for (const x of CATALOGUE) {
    if (x.head === null) continue;
    assert.ok(ALL_REGIONS.includes(x.head), `${x.id} head=${x.head}`);
  }
});

test('S28 every declared region maps to an engine label', () => {
  for (const r of ALL_REGIONS) {
    assert.ok(SEED_MG.includes(REGION_MG[r]), `${r} -> ${REGION_MG[r]}`);
  }
});

test('S28 a head always agrees with its entry mg through REGION_MG', () => {
  for (const x of CATALOGUE) {
    if (x.head === null) continue;
    assert.equal(REGION_MG[x.head], x.mg, `${x.id} ${x.head}/${x.mg}`);
  }
});

test('S28 every secondary mg is an engine label and never the entry own bucket', () => {
  for (const x of CATALOGUE) {
    for (const s of x.secondary) {
      assert.ok(SEED_MG.includes(s.mg), `${x.id} secondary ${s.mg}`);
      assert.notEqual(s.mg, x.mg, `${x.id} lends to itself`);
    }
    const mgs = x.secondary.map((s) => s.mg);
    assert.equal(new Set(mgs).size, mgs.length, `${x.id} duplicate secondary`);
  }
});

test('S28 the header declares all four provenance classes', () => {
  const head = CAT_SRC.slice(0, CAT_SRC.indexOf('export const GROUPS'));
  for (const claim of ['SOURCED', 'INVENTED', 'seed.cjs', 'constants.cjs:333', 'constants.cjs:330']) {
    assert.ok(head.includes(claim), `header missing ${claim}`);
  }
});

/* ------------------------------------------------------- one per group */

test('S28 there are exactly six groups and every entry is in one', () => {
  assert.equal(GROUPS.length, 6);
  assert.deepEqual([...GROUPS], ['chest', 'back', 'shoulders', 'arms', 'legs', 'core']);
  for (const x of CATALOGUE) assert.ok(GROUPS.includes(x.group), `${x.id} group=${x.group}`);
});

for (const group of ['chest', 'back', 'shoulders', 'arms', 'legs', 'core']) {
  test(`S30 group ${group} is populated and internally consistent`, () => {
    const rows = entriesFor(group);
    assert.ok(rows.length >= 6, `${group} has ${rows.length}`);
    for (const x of rows) {
      assert.equal(x.group, group);
      if (REGIONS[group].length === 0) assert.equal(x.head, null, x.id);
      else assert.ok(REGIONS[group].includes(x.head), `${x.id} head=${x.head}`);
      if (GROUP_MG[group] !== null) assert.equal(x.mg, GROUP_MG[group], x.id);
    }
    /* every region of the group has at least one entry behind it */
    for (const r of REGIONS[group]) {
      assert.ok(rows.some((x) => x.head === r), `${group}/${r} is an empty door`);
    }
  });
}

test('S28 bucketOf copies the engine rule head || mg', () => {
  assert.ok(/bucket\s*=\s*\(e\)\s*=>\s*e\.head\s*\|\|\s*e\.mg/.test(VOL_SRC), 'volume.cjs rule moved');
  for (const x of CATALOGUE) assert.equal(bucketOf(x), x.head || x.mg, x.id);
});

/* --------------------------------------------------------- search (S30) */

test('S30 search matches the display name, case-insensitively', () => {
  for (const x of CATALOGUE) {
    const hits = searchByName(x.n.toUpperCase(), { limit: 100 });
    assert.ok(hits.some((h) => h.id === x.id), `name miss: ${x.n}`);
  }
});

test('S30 search matches every alias of every entry', () => {
  for (const x of CATALOGUE) {
    for (const a of x.aliases) {
      const hits = searchByName(a, { limit: 100 });
      assert.ok(hits.some((h) => h.id === x.id), `alias miss: ${x.id} / ${a}`);
    }
  }
});

test('S30 search matches the id and tolerates punctuation', () => {
  assert.ok(searchByName('t_bar_row').some((h) => h.id === 't_bar_row'));
  assert.ok(searchByName('T-Bar Row').some((h) => h.id === 't_bar_row'));
  assert.ok(searchByName('tbar').some((h) => h.id === 't_bar_row'));
});

test('S30 search returns nothing for empty and unknown queries', () => {
  for (const q of ['', '   ', null, undefined, '!!!']) assert.deepEqual(searchByName(q), []);
  assert.deepEqual(searchByName('zzzznotalift'), []);
});

test('S30 search honours its limit and prefers exact then prefix', () => {
  assert.ok(searchByName('curl', { limit: 3 }).length <= 3);
  assert.equal(searchByName('Crunch')[0].id, 'crunch');
  assert.equal(searchByName('Plank')[0].id, 'plank');
});

test('S30 search and the pickers are pure over the catalogue', () => {
  const before = JSON.stringify(CATALOGUE);
  searchByName('row', { limit: 100 });
  entriesFor('back', 'lats');
  regionsOf('legs');
  entriesInBucket('chest', 'U');
  assert.equal(JSON.stringify(CATALOGUE), before);
});

test('S30 byId round-trips and refuses an unknown id', () => {
  for (const x of CATALOGUE) assert.equal(byId(x.id), x);
  assert.equal(byId('not_a_lift'), null);
  assert.equal(byId(undefined), null);
});

/* --------------------------------------------------------- picker (S31) */

test('S31 layer 1 offers the six groups and nothing else', () => {
  assert.deepEqual(Object.keys(REGIONS).sort(), [...GROUPS].sort());
  assert.deepEqual(Object.keys(GROUP_MG).sort(), [...GROUPS].sort());
});

test('S31 layer 2 offers that group regions, and none for chest', () => {
  assert.deepEqual(regionsOf('chest'), []);
  assert.deepEqual(regionsOf('shoulders'), ['delts_front', 'delts_side', 'delts_rear']);
  assert.deepEqual(regionsOf('legs'), ['quads', 'hams', 'glutes', 'calves']);
  assert.deepEqual(regionsOf('nonsense'), []);
  for (const g of GROUPS) assert.ok(Object.isFrozen(regionsOf(g)));
});

test('S30 group then region returns exactly the entries carrying that tag', () => {
  for (const g of GROUPS) {
    for (const r of REGIONS[g]) {
      const rows = entriesFor(g, r);
      assert.ok(rows.length >= 1, `${g}/${r}`);
      for (const x of rows) assert.equal(x.head, r);
      const expected = CATALOGUE.filter((x) => x.group === g && x.head === r);
      assert.deepEqual(rows.map((x) => x.id), expected.map((x) => x.id));
    }
  }
  assert.deepEqual(entriesFor('chest', 'chest').map((x) => x.id), entriesFor('chest').map((x) => x.id));
});

test('S31 stopping at the group yields a complete entry, mg valid, head null', () => {
  for (const g of GROUPS) {
    const made = customEntry({ group: g, name: `My ${g} lift` });
    if (!canStopAtGroup(g)) {
      assert.equal(made.error, 'CUSTOM_REGION_REQUIRED', g);
      continue;
    }
    assert.equal(made.error, undefined, `${g}: ${made.error}`);
    assert.equal(made.head, null, g);
    assert.ok(ENGINE_MG.includes(made.mg), `${g} mg=${made.mg}`);
    assert.equal(made.mg, GROUP_MG[g]);
    assert.equal(bucketOf(made), made.mg);
    assert.ok(made.kinds.length >= 1 && made.kinds.every((k) => k === 'U' || k === 'L'), g);
    assert.equal(made.n, `My ${g} lift`);
    assert.deepEqual(made.secondary, []);
  }
});

test('S31 opening the region sets head and the matching mg', () => {
  for (const g of GROUPS) {
    for (const r of REGIONS[g]) {
      const made = customEntry({ group: g, region: r, name: `My ${r} lift` });
      assert.equal(made.error, undefined, `${g}/${r}: ${made.error}`);
      assert.equal(made.head, r);
      assert.equal(made.mg, REGION_MG[r]);
      assert.ok(ENGINE_MG.includes(made.mg));
      assert.equal(bucketOf(made), r);
    }
  }
});

test('S31 a custom free-text mg still works and overrides the doors', () => {
  for (const mg of ENGINE_MG) {
    const made = customEntry({ name: 'Thing I do', mg });
    assert.equal(made.error, undefined, mg);
    assert.equal(made.mg, mg);
    assert.equal(made.head, null);
  }
  assert.equal(customEntry({ name: 'x', mg: 'shoulders' }).error, 'CUSTOM_MG_UNKNOWN');
  assert.equal(customEntry({ name: 'x', mg: 'delts_side' }).error, 'CUSTOM_MG_UNKNOWN');
});

test('S31 the picker refuses rather than returning a half-entry', () => {
  assert.equal(customEntry({ group: 'chest' }).error, 'CUSTOM_NAME_REQUIRED');
  assert.equal(customEntry({ group: 'chest', name: '   ' }).error, 'CUSTOM_NAME_REQUIRED');
  assert.equal(customEntry({ name: 'x', group: 'torso' }).error, 'CUSTOM_GROUP_UNKNOWN');
  assert.equal(customEntry({ name: 'x', region: 'delts_lateral' }).error, 'CUSTOM_REGION_UNKNOWN');
  assert.equal(customEntry({ name: 'x', group: 'legs', region: 'lats' }).error, 'CUSTOM_REGION_UNKNOWN');
  assert.equal(customEntry().error, 'CUSTOM_NAME_REQUIRED');
});

test('S31 a custom entry gets a stable id derived from its name', () => {
  const a = customEntry({ group: 'chest', name: 'Wall Press!' });
  const b = customEntry({ group: 'chest', name: 'wall press' });
  assert.equal(a.id, b.id);
  assert.equal(a.id, 'custom_wall_press');
  assert.equal(customEntry({ group: 'chest', name: 'x', id: 'mine' }).id, 'mine');
});

/* ------------------------------------------- composition feasibility (S32) */

const UPPER_MAJORS = ['chest', 'lats', 'upper_back', 'delts_side'];
const LOWER_MAJORS = ['quads', 'hams', 'glutes', 'calves'];
const MINORS = ['delts_front', 'delts_rear', 'biceps', 'triceps', 'abs'];

test('S32 every major and minor bucket the brief names has stock to draw on', () => {
  for (const b of UPPER_MAJORS) {
    assert.ok(entriesInBucket(b, 'U').length >= 2, `upper major ${b}`);
  }
  for (const b of LOWER_MAJORS) {
    assert.ok(entriesInBucket(b, 'L').length >= 2, `lower major ${b}`);
  }
  for (const b of MINORS) {
    assert.ok(entriesInBucket(b).length >= 1, `minor ${b}`);
  }
});

test('S32 no bucket is named both a major and a minor', () => {
  const all = [...UPPER_MAJORS, ...LOWER_MAJORS, ...MINORS];
  assert.equal(new Set(all).size, all.length);
});

test('S32 entriesInBucket filters by kind and is exhaustive over the catalogue', () => {
  const seen = new Set();
  for (const b of new Set(CATALOGUE.map(bucketOf))) {
    for (const x of entriesInBucket(b)) seen.add(x.id);
    for (const x of entriesInBucket(b, 'U')) assert.ok(x.kinds.includes('U'), x.id);
    for (const x of entriesInBucket(b, 'L')) assert.ok(x.kinds.includes('L'), x.id);
  }
  assert.equal(seen.size, CATALOGUE.length);
});

/* =========================================================================
   CATALOGUE HEADS (DECISIONS:154 (8)) - the region named on every secondary
   credit that is anatomically unambiguous, and on none that is not.

   DECISIONS:155 (3) leaves a coarse `back` or `delts` helper qualified:false
   and region-unspecified. :154 (8) shrinks that set AT THE SOURCE. Only `back`
   and `delts` have sub-regions at all (REGIONS), so only their secondaries can
   be unresolved: this section names the sixteen the brief resolves and the five
   it deliberately does not, entry by entry, so neither set can move quietly.
   ========================================================================= */

/* The legal head set, re-derived rather than listed: the three MG_LABEL keys
   from constants.cjs and the DECISIONS:127 (2) region labels from REGIONS. */
const LEGAL_HEADS = [...new Set([...DELT_HEADS, ...ALL_REGIONS])].sort();

/* The sixteen, named entry by entry and credit by credit (brief, table rows
   1 to 4). A seventeenth resolved credit fails H3 until the brief is amended. */
const RESOLVED = Object.freeze([
  ['chest_press_machine', 'delts', 'delts_front'],
  ['incline_chest_press_machine', 'delts', 'delts_front'],
  ['barbell_bench_press', 'delts', 'delts_front'],
  ['incline_barbell_bench_press', 'delts', 'delts_front'],
  ['dumbbell_bench_press', 'delts', 'delts_front'],
  ['incline_dumbbell_press', 'delts', 'delts_front'],
  ['machine_fly', 'delts', 'delts_front'],
  ['cable_fly', 'delts', 'delts_front'],
  ['dumbbell_fly', 'delts', 'delts_front'],
  ['push_up', 'delts', 'delts_front'],
  ['dip_chest', 'delts', 'delts_front'],
  ['close_grip_bench_press', 'delts', 'delts_front'],
  ['face_pull', 'delts', 'delts_rear'],
  ['upright_row', 'delts', 'delts_side'],
  ['romanian_deadlift', 'back', 'lower_back'],
  ['deadlift', 'back', 'lower_back'],
]);

/* The five the ruling leaves alone: each names a credit that straddles two
   regions, so resolving it would be a guess (brief, "The five left UNRESOLVED"). */
const UNRESOLVED = Object.freeze([
  ['rear_delt_fly', 'back'], ['rear_delt_machine', 'back'], ['cable_rear_delt_fly', 'back'],
  ['farmers_carry', 'back'], ['ab_wheel', 'back'],
]);

const creditsOf = (id) => byId(id).secondary;
const creditFor = (id, mg) => creditsOf(id).find((s) => s.mg === mg);

test('H1 every head named anywhere is a constants.cjs MG_LABEL key or a REGIONS label', () => {
  /* The set itself is derived, never typed: 3 delt heads + 15 region labels. */
  assert.deepEqual(LEGAL_HEADS, [...new Set([...DELT_HEADS, ...ALL_REGIONS])].sort());
  assert.ok(LEGAL_HEADS.includes('delts_front') && LEGAL_HEADS.includes('lower_back'));
  for (const x of CATALOGUE) {
    if (x.head !== null) assert.ok(LEGAL_HEADS.includes(x.head), `${x.id} primary head=${x.head}`);
    for (const s of x.secondary) {
      if (!Object.hasOwn(s, 'head')) continue;
      assert.ok(LEGAL_HEADS.includes(s.head), `${x.id} secondary head=${s.head}`);
    }
  }
});

test('H2 a head agrees with its own mg, on primaries and on secondaries alike', () => {
  for (const x of CATALOGUE) {
    if (x.head !== null && Object.hasOwn(REGION_MG, x.head)) {
      assert.equal(REGION_MG[x.head], x.mg, `${x.id} primary ${x.head} is not a ${x.mg} region`);
    }
    for (const s of x.secondary) {
      if (!Object.hasOwn(s, 'head')) continue;
      assert.ok(Object.hasOwn(REGION_MG, s.head), `${x.id} ${s.head} is not a region at all`);
      assert.equal(REGION_MG[s.head], s.mg, `${x.id} secondary ${s.head} is not a ${s.mg} region`);
    }
  }
});

test('H3 the sixteen resolved credits carry their head, named one by one', () => {
  for (const [id, mg, head] of RESOLVED) {
    const credit = creditFor(id, mg);
    assert.ok(credit, `${id} has no ${mg} credit at all`);
    assert.equal(credit.head, head, `${id} ${mg} credit`);
  }
});

test('H3 and NO seventeenth credit is resolved: the set is exactly those sixteen', () => {
  const found = CATALOGUE.flatMap((x) => x.secondary
    .filter((s) => Object.hasOwn(s, 'head'))
    .map((s) => [x.id, s.mg, s.head]));
  assert.equal(found.length, 16, 'resolved credits: ' + JSON.stringify(found));
  assert.deepEqual([...found].sort(), [...RESOLVED].sort(),
    'the resolved set moved without this brief being amended');
});

test('H4 the five ambiguous credits carry NO head, asserted by name', () => {
  for (const [id, mg] of UNRESOLVED) {
    const credit = creditFor(id, mg);
    assert.ok(credit, `${id} has no ${mg} credit at all`);
    assert.equal(Object.hasOwn(credit, 'head'), false,
      `${id}'s ${mg} credit was resolved; DECISIONS:155 (3) leaves it unspecified`);
    assert.deepEqual(Object.keys(credit).sort(), ['lend', 'mg']);
  }
});

test('H4 the coarse back credit is paid by exactly those five entries, and no sixth', () => {
  /* Derived, not listed twice: every credit in the catalogue that is a back
     helper at 0.25 IS one of the five. A sixth would be a new unresolved credit
     nobody ruled on, and it fails here rather than shipping region-unspecified. */
  const coarse = CATALOGUE
    .filter((x) => x.secondary.some((s) => s.mg === 'back' && s.lend === 0.25))
    .map((x) => x.id).sort();
  assert.deepEqual(coarse, UNRESOLVED.map(([id]) => id).sort());
});

test('H5 no lend value moved: the (mg, lend) multiset is the base\'s, byte for byte', () => {
  /* Pinned from the catalogue at base 8a42509, before this edit. A head is a NAME
     for a credit already paid; changing what it pays is a different decision and
     this brief does not make one. */
  const credits = CATALOGUE.flatMap((x) => x.secondary.map((s) => s.mg + ':' + s.lend)).sort();
  assert.equal(credits.length, 94, 'the number of secondary credits moved');
  const tally = {};
  for (const c of credits) tally[c] = (tally[c] || 0) + 1;
  assert.deepEqual(tally, {
    'abs:0.25': 5, 'back:0.25': 5, 'back:0.5': 2, 'biceps:0.5': 12, 'calves:0.25': 1,
    'chest:0.25': 2, 'delts:0.25': 1, 'delts:0.5': 13, 'forearms:0.5': 19, 'glutes:0.5': 13,
    'hams:0.25': 2, 'hams:0.5': 6, 'quads:0.25': 1, 'quads:0.5': 1, 'triceps:0.5': 11,
  }, 'a lend value or a credit moved');
  assert.equal(createHash('sha256').update(credits.join(',')).digest('hex'),
    'abe940b54f74718ed9725fb52abedba569c066a9531bd9ece6132675f2ce91a4');
});

test('H6 every entry\'s id, name, aliases, group, kinds and PRIMARY mg/head are unchanged', () => {
  /* The skeleton of the catalogue, pinned at base 8a42509: everything this brief
     is not allowed to touch, in one digest. Only the secondary credits moved. */
  assert.equal(CATALOGUE.length, 83);
  const skeleton = CATALOGUE
    .map((x) => JSON.stringify([x.id, x.n, x.aliases, x.group, x.mg, x.head, x.kinds]))
    .join('\n');
  assert.equal(createHash('sha256').update(skeleton).digest('hex'),
    '82cbac4ad5b1e94311ad16852997adc2a216947ddf3add8efff0fcbc457d9ecf',
    'this brief may not move an id, a name, an alias, a group, a kind or a primary head');
});

test('H6 the shared credit constants are named for what they mean', () => {
  /* The constant called FRONT always meant the front delt; the data says so now.
     DELT_H is gone because its one use is SIDE_H, and a constant no longer used
     is a constant that can be wired back in by accident. */
  assert.match(CAT_SRC, /FRONT = \{ mg: 'delts', head: 'delts_front', lend: 0\.5 \}/);
  assert.match(CAT_SRC, /REAR = \{ mg: 'delts', head: 'delts_rear', lend: 0\.5 \}/);
  assert.match(CAT_SRC, /SIDE_H = \{ mg: 'delts', head: 'delts_side', lend: 0\.25 \}/);
  assert.match(CAT_SRC, /ERECTOR = \{ mg: 'back', head: 'lower_back', lend: 0\.5 \}/);
  assert.equal(/\bDELT_H\b/.test(CAT_SRC), false, 'DELT_H is unused and must be deleted');
  /* BACK_H stays exactly as it was: it is the five unresolved credits. */
  assert.match(CAT_SRC, /BACK_H = \{ mg: 'back', lend: 0\.25 \}/);
});

test('H6 every added head is marked INVENTED-and-declared in the source', () => {
  /* DECISIONS:115: a value that is not sourced says so where it is written. */
  const block = CAT_SRC.slice(CAT_SRC.indexOf("const U = ['U']"), CAT_SRC.indexOf('export const CATALOGUE'));
  assert.match(block, /INVENTED/, 'the shared credits block does not declare the heads');
  assert.match(block, /DECISIONS:154 \(8\)/, 'the ruling that added them is not cited');
});

/* ---- H7: THE RESOLVED HEAD REACHES THE STORED OP'S TAGS, EXECUTED -------
   These two cells used to hold a boundary: the head reached the athlete's row and
   stopped there, because setup-model.mjs document() narrowed every credit to
   {mg, lend} and setup-commands.mjs tagsOf refused a secondary with any third
   key. That boundary is CLOSED now (lane decision under DECISIONS:135 (1),
   disclosed to lane D/F2 as additive), so they assert the reach instead - end to
   end, through the real reducer and the real producer, and through validate as
   well, because an op the client would refuse is not a stored op. */
test('H7 the resolved head reaches the setup model\'s own exercise row', async () => {
  const { createSetupModel } = await import('../setup-model.mjs');
  const model = createSetupModel({ today: '2030-02-04' });
  model.setName('Dad');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const row = model.addFromCatalogue('U', byId('barbell_bench_press'));
  const delts = row.secondary.find((s) => s.mg === 'delts');
  assert.ok(delts, 'the catalogue entry pays the delts');
  assert.equal(delts.head, 'delts_front',
    'addFromCatalogue clones the credit whole, so the head is on the athlete\'s row');
});

test('H7 and the op the client would store carries it, all the way through', async () => {
  const { createSetupModel } = await import('../setup-model.mjs');
  const { prepare, validate } = await import('../setup-commands.mjs');
  const model = createSetupModel({ today: '2030-02-04' });
  model.setName('Dad');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const row = model.addFromCatalogue('U', byId('barbell_bench_press'));
  model.setExerciseField(row.key, 'first', '20');
  model.togglePriority('chest');
  const built = model.document();
  assert.equal(built.ok, true, JSON.stringify(built.missing));
  const id = Object.keys(built.tags)[0];

  /* (1) document() keeps the head ON the credit. */
  const credit = built.tags[id].secondary.find((s) => s.mg === 'delts');
  assert.deepEqual(Object.keys(credit).sort(), ['head', 'lend', 'mg']);
  assert.equal(credit.head, 'delts_front');

  /* (2) the producer carries it into the op, and the payload stays three members
     and the document stays exactly what the clean-init constructor takes. */
  const action = prepare({ action: 'first-run-setup', input: { setup: built.setup, tags: built.tags } });
  assert.deepEqual(Object.keys(action.payload).sort(), ['profile', 'setup', 'tags']);
  assert.deepEqual(action.payload.setup, built.setup, 'the document is untouched by any of this');
  const stored = action.payload.tags[id].secondary.find((s) => s.mg === 'delts');
  assert.deepEqual(stored, { mg: 'delts', lend: 0.5, head: 'delts_front' });
  /* The triceps credit is unresolved and stays two members: absent is unchanged. */
  assert.deepEqual(action.payload.tags[id].secondary.find((s) => s.mg === 'triceps'),
    { mg: 'triceps', lend: 0.5 });

  /* (3) and the client would ACCEPT that op: validate re-checks the same tags. */
  const op = { kind: 'fact', class: 'event', athlete_id: 'owner', causal_parents: [],
    effective: { local_date: '2030-02-04', local_time: '08:00', utc_offset: '-05:00' },
    payload: action.payload };
  assert.equal(validate(op, () => null), true, 'the widened credit passes the envelope check too');
});

test('H7 an illegal secondary head is refused, by the producer and by validate', async () => {
  const { createSetupModel } = await import('../setup-model.mjs');
  const { prepare, validate } = await import('../setup-commands.mjs');
  const model = createSetupModel({ today: '2030-02-04' });
  model.setName('Dad');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const row = model.addFromCatalogue('U', byId('barbell_bench_press'));
  model.setExerciseField(row.key, 'first', '20');
  model.togglePriority('chest');
  const built = model.document();
  const id = Object.keys(built.tags)[0];
  const good = prepare({ action: 'first-run-setup', input: { setup: built.setup, tags: built.tags } });

  /* A name that is not a region label at all, and a name that belongs to another
     engine label: neither is a legal head, and the producer says so in its own code. */
  for (const bad of ['delts_lateral', 'shoulders', '', null, 7]) {
    const tags = JSON.parse(JSON.stringify(built.tags));
    tags[id].secondary.find((s) => s.mg === 'delts').head = bad;
    assert.throws(() => prepare({ action: 'first-run-setup', input: { setup: built.setup, tags } }),
      /SETUP_INPUT_INVALID/, 'head=' + JSON.stringify(bad) + ' was accepted');
  }
  /* A fourth key is still refused: this widened ONE optional member, not the shape. */
  const four = JSON.parse(JSON.stringify(built.tags));
  four[id].secondary.find((s) => s.mg === 'delts').note = 'x';
  assert.throws(() => prepare({ action: 'first-run-setup', input: { setup: built.setup, tags: four } }),
    /SETUP_INPUT_INVALID/);

  /* And an envelope carrying an illegal head is refused on the way in, too. */
  const opBad = { kind: 'fact', class: 'event', athlete_id: 'owner', causal_parents: [],
    effective: { local_date: '2030-02-04', local_time: '08:00', utc_offset: '-05:00' },
    payload: JSON.parse(JSON.stringify(good.payload)) };
  opBad.payload.tags[id].secondary.find((s) => s.mg === 'delts').head = 'delts_lateral';
  assert.equal(validate(opBad, () => null), false);
});
