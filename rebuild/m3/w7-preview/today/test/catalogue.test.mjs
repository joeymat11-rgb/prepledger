/* A4b S28 to S31: the exercise catalogue and its two doors.
   Every provenance claim in exercise-catalogue.mjs's header is re-derived HERE
   from the engine files themselves, never copied into this test as a literal
   list. If the engine's labels move, this test moves with them and the
   catalogue goes red. The catalogue imports nothing from rebuild/engine (H1,
   DECISIONS:93 C3); the test may READ those files, which is not the same thing. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
