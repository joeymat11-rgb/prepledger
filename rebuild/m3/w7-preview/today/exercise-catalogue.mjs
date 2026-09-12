// exercise-catalogue.mjs - A4b. The public exercise vocabulary screen 3 offers
// (DECISIONS:127 (2)), so a beginner never has to know what a machine targets and
// an enthusiast can still edit every tag.
//
// AN ES MODULE, NOT JSON, ON PURPOSE: the page fetches nothing (A4's S17,
// DECISIONS:99 zero off-origin), build.mjs pins it by name in REQUIRED_INPUTS, and
// a module can carry the provenance below where a JSON file cannot.
//
// PROVENANCE, BY CLASS (A4B-BRIEF section 3.2; DECISIONS:115 standing lesson). The
// catalogue is INVENTED AS A WHOLE: lane C authors it and this repository holds no
// public dataset to cite. What is sourced is sourced by class, so the reviewer
// checks classes rather than trusting the file:
//
//   every `mg` value      SOURCED. The eleven distinct labels in rebuild/engine/
//                         seed.cjs:14-60 - delts :16, back :20, biceps :31,
//                         chest :33, forearms :39, triceps :41, calves :46,
//                         abs :48, quads :52, glutes :54, hams :58. Nothing else
//                         is ever stored as mg by a catalogue entry.
//   delt regions (head)   SOURCED. rebuild/engine/constants.cjs:333 MG_LABEL keys:
//                         delts_front, delts_side, delts_rear.
//   other regions (head)  INVENTED. The list DECISIONS:127 (2) names: lats,
//                         upper_back, traps, lower_back, quads, hams, glutes,
//                         calves, biceps, triceps, forearms, abs. Engine item F2
//                         (:127 (6)) adds them to MG_LABEL.
//   lend fraction 0.5     SOURCED. constants.cjs:330 INDIRECT uses exactly 0.5 for
//                         press to triceps and delts, rows and pulldown to biceps,
//                         and curl to forearms.
//   any other lend        INVENTED. Only 0.25 is used, and only where the lift
//                         pays a muscle plainly less than a press pays triceps.
//   names and aliases     INVENTED (common gym vocabulary).
//   which muscle a lift   INVENTED (anatomy the reviewer can check by reading).
//     works
//
// NOTHING HERE NAMES AN ATHLETE, and nothing here carries a load, a set count or a
// rep target: screen 4 still never asks for a weight and the first session is the
// probe (today.cjs:80-90).

/* The six groups the custom picker opens on (DECISIONS:127 (3)). SCREEN-ONLY:
   `group` is never stored on an exercise and never reaches the document. */
export const GROUPS = Object.freeze(['chest', 'back', 'shoulders', 'arms', 'legs', 'core']);

/* The regions each group opens into, and the engine label a lift in that group
   stores as `mg`. Stopping at the GROUP is complete: the entry takes the group's
   own mg and `head: null` (DECISIONS:127 (3)). */
export const GROUP_MG = Object.freeze({
  chest: 'chest', back: 'back', shoulders: 'delts', core: 'abs',
  /* arms and legs have no single engine label: the region IS the label there,
     which is why the picker must reach a region before it can store one. */
  arms: null, legs: null,
});
export const REGIONS = Object.freeze({
  chest: Object.freeze([]),
  back: Object.freeze(['lats', 'upper_back', 'traps', 'lower_back']),
  shoulders: Object.freeze(['delts_front', 'delts_side', 'delts_rear']),
  arms: Object.freeze(['biceps', 'triceps', 'forearms']),
  legs: Object.freeze(['quads', 'hams', 'glutes', 'calves']),
  core: Object.freeze(['abs']),
});
/* The engine label a REGION stores as mg. For back and shoulders the regions are
   sub-parts of one engine label; for arms, legs and core the region is the label. */
export const REGION_MG = Object.freeze({
  lats: 'back', upper_back: 'back', traps: 'back', lower_back: 'back',
  delts_front: 'delts', delts_side: 'delts', delts_rear: 'delts',
  biceps: 'biceps', triceps: 'triceps', forearms: 'forearms',
  quads: 'quads', hams: 'hams', glutes: 'glutes', calves: 'calves',
  abs: 'abs',
});
/* The eleven engine labels, restated so this module can check itself without
   importing rebuild/engine (H1, A4's S24). test/catalogue.test.mjs re-derives them
   from seed.cjs at TEST time and asserts the two agree. */
export const ENGINE_MG = Object.freeze(['abs', 'back', 'biceps', 'calves', 'chest', 'delts',
  'forearms', 'glutes', 'hams', 'quads', 'triceps']);

/* One entry. `id` is the CATALOGUE's id and never the athlete's: his is still
   slugged from the name he keeps (setup-model.mjs slugOf), so a rename works.
   `secondary` is what the lift also pays; NOTHING READS IT YET (engine item F2,
   DECISIONS:127 (6)) and no screen promises anything about it. */
const e = (id, n, aliases, group, mg, head, secondary, kinds) =>
  Object.freeze({ id, n, aliases: Object.freeze(aliases), group, mg, head,
    secondary: Object.freeze(secondary.map((s) => Object.freeze(s))), kinds: Object.freeze(kinds) });

const U = ['U'], L = ['L'];
/* 0.5 is constants.cjs:330's own fraction for a compound paying a helper muscle.
   0.25 is INVENTED, and used only where the lift pays plainly less than that. */
const TRI = { mg: 'triceps', lend: 0.5 }, FRONT = { mg: 'delts', lend: 0.5 };
const BI = { mg: 'biceps', lend: 0.5 }, FORE = { mg: 'forearms', lend: 0.5 };
const BACK_H = { mg: 'back', lend: 0.25 }, GLUTE_H = { mg: 'glutes', lend: 0.5 };
const HAM_H = { mg: 'hams', lend: 0.5 }, QUAD_H = { mg: 'quads', lend: 0.5 };
const ABS_H = { mg: 'abs', lend: 0.25 }, CHEST_H = { mg: 'chest', lend: 0.25 };
const CALF_H = { mg: 'calves', lend: 0.25 }, DELT_H = { mg: 'delts', lend: 0.25 };

export const CATALOGUE = Object.freeze([
  /* ---------------------------------------------------------------- chest
     No region: DECISIONS:127 (2) names regions for back, shoulders, legs, arms
     and core, and none for chest, so every chest lift buckets on mg (volume.cjs:74). */
  e('chest_press_machine', 'Chest press machine', ['chest press', 'machine chest press', 'seated chest press'], 'chest', 'chest', null, [TRI, FRONT], U),
  e('incline_chest_press_machine', 'Incline chest press machine', ['incline press machine', 'incline chest press'], 'chest', 'chest', null, [TRI, FRONT], U),
  e('barbell_bench_press', 'Barbell bench press', ['bench press', 'flat bench', 'bench'], 'chest', 'chest', null, [TRI, FRONT], U),
  e('incline_barbell_bench_press', 'Incline barbell bench press', ['incline bench press', 'incline bench'], 'chest', 'chest', null, [TRI, FRONT], U),
  e('dumbbell_bench_press', 'Dumbbell bench press', ['db bench press', 'dumbbell press', 'flat dumbbell press'], 'chest', 'chest', null, [TRI, FRONT], U),
  e('incline_dumbbell_press', 'Incline dumbbell press', ['incline db press', 'incline dumbbell bench'], 'chest', 'chest', null, [TRI, FRONT], U),
  e('machine_fly', 'Machine fly', ['pec deck', 'chest fly machine', 'pec fly'], 'chest', 'chest', null, [FRONT], U),
  e('cable_fly', 'Cable fly', ['cable crossover', 'cable chest fly'], 'chest', 'chest', null, [FRONT], U),
  e('dumbbell_fly', 'Dumbbell fly', ['db fly', 'dumbbell chest fly'], 'chest', 'chest', null, [FRONT], U),
  e('push_up', 'Push-up', ['pushup', 'press-up', 'floor press-up'], 'chest', 'chest', null, [TRI, FRONT], U),
  e('dip_chest', 'Chest dip', ['dips', 'parallel bar dip', 'chest dips'], 'chest', 'chest', null, [TRI, FRONT], U),

  /* ------------------------------------------------------------------ back
     mg is the engine's 'back' for every region; the REGION is what the volume
     screen buckets on (volume.cjs:74 e.head || e.mg). */
  e('lat_pulldown', 'Lat pulldown', ['pulldown', 'lat pull down', 'cable pulldown'], 'back', 'back', 'lats', [BI, FORE], U),
  e('wide_grip_pulldown', 'Wide-grip pulldown', ['wide grip lat pulldown', 'wide pulldown'], 'back', 'back', 'lats', [BI], U),
  e('neutral_grip_pulldown', 'Neutral-grip pulldown', ['close grip pulldown', 'v bar pulldown'], 'back', 'back', 'lats', [BI, FORE], U),
  e('pull_up', 'Pull-up', ['pullup', 'chin up', 'chinup'], 'back', 'back', 'lats', [BI, FORE], U),
  e('assisted_pull_up', 'Assisted pull-up machine', ['assisted pullup', 'pull up machine'], 'back', 'back', 'lats', [BI], U),
  e('straight_arm_pulldown', 'Straight-arm pulldown', ['straight arm pushdown', 'lat prayer'], 'back', 'back', 'lats', [], U),
  e('seated_cable_row', 'Seated cable row', ['cable row', 'low row', 'seated row'], 'back', 'back', 'upper_back', [BI, FORE], U),
  e('chest_supported_row', 'Chest-supported row machine', ['seated row machine', 'chest supported row', 'machine row'], 'back', 'back', 'upper_back', [BI], U),
  e('barbell_row', 'Barbell row', ['bent over row', 'bb row', 'pendlay row'], 'back', 'back', 'upper_back', [BI, FORE, HAM_H], U),
  e('dumbbell_row', 'Dumbbell row', ['db row', 'one arm row', 'single arm row'], 'back', 'back', 'upper_back', [BI, FORE], U),
  e('t_bar_row', 'T-bar row', ['tbar row', 'landmine row'], 'back', 'back', 'upper_back', [BI, FORE], U),
  e('inverted_row', 'Inverted row', ['body row', 'ring row', 'australian pull up'], 'back', 'back', 'upper_back', [BI], U),
  e('shrug', 'Shrug', ['barbell shrug', 'dumbbell shrug', 'trap shrug'], 'back', 'back', 'traps', [FORE], U),
  e('machine_shrug', 'Shrug machine', ['machine shrug', 'smith shrug'], 'back', 'back', 'traps', [FORE], U),
  e('upright_row', 'Upright row', ['cable upright row', 'barbell upright row'], 'back', 'back', 'traps', [DELT_H, BI], U),
  e('face_pull', 'Face pull', ['cable face pull', 'rope face pull'], 'back', 'back', 'traps', [{ mg: 'delts', lend: 0.5 }], U),
  e('back_extension', 'Back extension', ['hyperextension', 'roman chair', '45 degree back extension'], 'back', 'back', 'lower_back', [GLUTE_H, HAM_H], L),
  e('good_morning', 'Good morning', ['barbell good morning'], 'back', 'back', 'lower_back', [HAM_H, GLUTE_H], L),
  e('rack_pull', 'Rack pull', ['partial deadlift', 'block pull'], 'back', 'back', 'lower_back', [{ mg: 'hams', lend: 0.5 }, { mg: 'glutes', lend: 0.5 }, FORE], L),

  /* ------------------------------------------------------------- shoulders
     The three delt regions are the engine's own separate buckets
     (constants.cjs:333, and volume.cjs:66-73 explains why they are not pooled). */
  e('shoulder_press_machine', 'Shoulder press machine', ['overhead press machine', 'seated shoulder press'], 'shoulders', 'delts', 'delts_front', [TRI], U),
  e('overhead_press', 'Overhead press', ['military press', 'standing press', 'ohp'], 'shoulders', 'delts', 'delts_front', [TRI, ABS_H], U),
  e('dumbbell_shoulder_press', 'Dumbbell shoulder press', ['db shoulder press', 'seated dumbbell press'], 'shoulders', 'delts', 'delts_front', [TRI], U),
  e('front_raise', 'Front raise', ['dumbbell front raise', 'plate front raise'], 'shoulders', 'delts', 'delts_front', [], U),
  e('lateral_raise', 'Lateral raise', ['side raise', 'db lateral raise', 'side lateral'], 'shoulders', 'delts', 'delts_side', [], U),
  e('lateral_raise_machine', 'Lateral raise machine', ['machine lateral raise', 'side delt machine'], 'shoulders', 'delts', 'delts_side', [], U),
  e('cable_lateral_raise', 'Cable lateral raise', ['cable side raise'], 'shoulders', 'delts', 'delts_side', [], U),
  e('rear_delt_fly', 'Rear-delt fly', ['reverse fly', 'rear delt raise', 'bent over fly'], 'shoulders', 'delts', 'delts_rear', [BACK_H], U),
  e('rear_delt_machine', 'Rear-delt machine', ['reverse pec deck', 'rear delt pec deck'], 'shoulders', 'delts', 'delts_rear', [BACK_H], U),
  e('cable_rear_delt_fly', 'Cable rear-delt fly', ['cable reverse fly', 'rope rear delt'], 'shoulders', 'delts', 'delts_rear', [BACK_H], U),

  /* ------------------------------------------------------------------ arms
     For arms the REGION is the engine label (biceps, triceps, forearms), so mg
     and head agree and the bucket is the same either way. */
  e('barbell_curl', 'Barbell curl', ['bb curl', 'straight bar curl'], 'arms', 'biceps', 'biceps', [FORE], U),
  e('dumbbell_curl', 'Dumbbell curl', ['db curl', 'alternating curl'], 'arms', 'biceps', 'biceps', [FORE], U),
  e('preacher_curl', 'Preacher curl', ['preacher', 'ez bar preacher curl', 'machine preacher curl'], 'arms', 'biceps', 'biceps', [FORE], U),
  e('incline_dumbbell_curl', 'Incline dumbbell curl', ['incline curl'], 'arms', 'biceps', 'biceps', [FORE], U),
  e('cable_curl', 'Cable curl', ['rope curl', 'cable bicep curl'], 'arms', 'biceps', 'biceps', [FORE], U),
  e('hammer_curl', 'Hammer curl', ['neutral grip curl', 'db hammer curl'], 'arms', 'biceps', 'biceps', [{ mg: 'forearms', lend: 0.5 }], U),
  e('tricep_pushdown', 'Tricep pushdown', ['cable pushdown', 'rope pushdown', 'tricep extension cable'], 'arms', 'triceps', 'triceps', [], U),
  e('overhead_tricep_extension', 'Overhead tricep extension', ['french press', 'skull crusher', 'overhead extension'], 'arms', 'triceps', 'triceps', [], U),
  e('tricep_machine', 'Tricep extension machine', ['machine tricep extension', 'seated tricep press'], 'arms', 'triceps', 'triceps', [], U),
  e('close_grip_bench_press', 'Close-grip bench press', ['cgbp', 'close grip bench'], 'arms', 'triceps', 'triceps', [CHEST_H, FRONT], U),
  e('tricep_dip', 'Tricep dip', ['bench dip', 'parallel dip triceps'], 'arms', 'triceps', 'triceps', [CHEST_H], U),
  e('wrist_curl', 'Wrist curl', ['forearm curl', 'seated wrist curl', 'barbell wrist curl'], 'arms', 'forearms', 'forearms', [], U),
  e('reverse_wrist_curl', 'Reverse wrist curl', ['extensor curl', 'reverse forearm curl'], 'arms', 'forearms', 'forearms', [], U),
  e('farmers_carry', "Farmer's carry", ['farmers walk', 'loaded carry'], 'arms', 'forearms', 'forearms', [{ mg: 'back', lend: 0.25 }, ABS_H], U),

  /* ------------------------------------------------------------------ legs
     quads / hams / glutes / calves are all engine labels in their own right
     (seed.cjs), so here too mg and head agree. */
  e('back_squat', 'Back squat', ['squat', 'barbell squat', 'high bar squat'], 'legs', 'quads', 'quads', [GLUTE_H, { mg: 'hams', lend: 0.25 }, ABS_H], L),
  e('front_squat', 'Front squat', ['barbell front squat'], 'legs', 'quads', 'quads', [GLUTE_H, ABS_H], L),
  e('hack_squat', 'Hack squat', ['machine hack squat'], 'legs', 'quads', 'quads', [GLUTE_H], L),
  e('leg_press', 'Leg press', ['machine leg press', '45 degree leg press'], 'legs', 'quads', 'quads', [GLUTE_H, { mg: 'hams', lend: 0.25 }], L),
  e('leg_extension', 'Leg extension', ['knee extension', 'quad extension'], 'legs', 'quads', 'quads', [], L),
  e('goblet_squat', 'Goblet squat', ['dumbbell squat', 'kettlebell squat'], 'legs', 'quads', 'quads', [GLUTE_H, ABS_H], L),
  e('lunge', 'Lunge', ['walking lunge', 'reverse lunge', 'dumbbell lunge'], 'legs', 'quads', 'quads', [{ mg: 'glutes', lend: 0.5 }], L),
  e('bulgarian_split_squat', 'Bulgarian split squat', ['split squat', 'rear foot elevated split squat', 'rfess'], 'legs', 'quads', 'quads', [{ mg: 'glutes', lend: 0.5 }], L),
  e('romanian_deadlift', 'Romanian deadlift', ['rdl', 'stiff leg deadlift'], 'legs', 'hams', 'hams', [{ mg: 'glutes', lend: 0.5 }, { mg: 'back', lend: 0.5 }, FORE], L),
  e('deadlift', 'Deadlift', ['conventional deadlift', 'barbell deadlift'], 'legs', 'hams', 'hams', [{ mg: 'glutes', lend: 0.5 }, { mg: 'back', lend: 0.5 }, { mg: 'quads', lend: 0.25 }, FORE], L),
  e('lying_leg_curl', 'Lying leg curl', ['leg curl', 'hamstring curl'], 'legs', 'hams', 'hams', [{ mg: 'calves', lend: 0.25 }], L),
  e('seated_leg_curl', 'Seated leg curl', ['seated hamstring curl'], 'legs', 'hams', 'hams', [], L),
  e('nordic_curl', 'Nordic curl', ['nordic hamstring curl', 'glute ham raise'], 'legs', 'hams', 'hams', [GLUTE_H], L),
  e('hip_thrust', 'Hip thrust', ['barbell hip thrust', 'glute bridge'], 'legs', 'glutes', 'glutes', [HAM_H], L),
  e('glute_kickback', 'Glute kickback', ['cable kickback', 'machine glute kickback'], 'legs', 'glutes', 'glutes', [HAM_H], L),
  e('hip_abduction', 'Hip abduction', ['abductor machine', 'seated abduction'], 'legs', 'glutes', 'glutes', [], L),
  e('step_up', 'Step-up', ['box step up', 'dumbbell step up'], 'legs', 'glutes', 'glutes', [QUAD_H], L),
  e('standing_calf_raise', 'Standing calf raise', ['calf raise', 'machine calf raise'], 'legs', 'calves', 'calves', [], L),
  e('seated_calf_raise', 'Seated calf raise', ['seated calf'], 'legs', 'calves', 'calves', [], L),
  e('leg_press_calf_raise', 'Leg press calf raise', ['calf press', 'sled calf raise'], 'legs', 'calves', 'calves', [], L),

  /* ------------------------------------------------------------------ core */
  e('plank', 'Plank', ['front plank', 'forearm plank'], 'core', 'abs', 'abs', [], L),
  e('hanging_leg_raise', 'Hanging leg raise', ['leg raise', 'hanging knee raise'], 'core', 'abs', 'abs', [FORE], L),
  e('cable_crunch', 'Cable crunch', ['rope crunch', 'kneeling cable crunch'], 'core', 'abs', 'abs', [], L),
  e('crunch', 'Crunch', ['sit up', 'floor crunch'], 'core', 'abs', 'abs', [], L),
  e('ab_wheel', 'Ab wheel rollout', ['rollout', 'ab roller'], 'core', 'abs', 'abs', [{ mg: 'back', lend: 0.25 }], L),
  e('machine_crunch', 'Ab crunch machine', ['machine crunch', 'seated ab machine'], 'core', 'abs', 'abs', [], L),
  e('pallof_press', 'Pallof press', ['anti rotation press', 'cable pallof'], 'core', 'abs', 'abs', [], L),
  e('side_plank', 'Side plank', ['lateral plank'], 'core', 'abs', 'abs', [], L),
  e('dead_bug', 'Dead bug', ['deadbug'], 'core', 'abs', 'abs', [], L),
]);

/* --------------------------------------------------------------- accessors
   bucketOf mirrors rebuild/engine/volume.cjs:74 (`bucket = (e) => e.head || e.mg`)
   deliberately: the catalogue never re-implements the engine's choice, it
   copies it, so an entry with head null lands in its mg bucket exactly as the
   engine would land it. SOURCED. */
export const bucketOf = (entry) => (entry && (entry.head || entry.mg)) || null;

const BY_ID = new Map(CATALOGUE.map((x) => [x.id, x]));
export const byId = (id) => BY_ID.get(id) || null;

/* Every entry indexed once, id + name + aliases, lowercased and stripped of
   non-alphanumerics so "t-bar", "tbar" and "T Bar" all reach the same row. */
const fold = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const HAY = new Map(CATALOGUE.map((x) => [x.id, [x.id, x.n, ...x.aliases].map(fold)]));

export function searchByName(query, opts) {
  const q = fold(query);
  if (!q) return [];
  const limit = (opts && Number.isSafeInteger(opts.limit) && opts.limit > 0) ? opts.limit : 12;
  const scored = [];
  for (const entry of CATALOGUE) {
    let best = -1;
    for (const h of HAY.get(entry.id)) {
      if (h === q) { best = Math.max(best, 3); continue; }
      if (h.startsWith(q)) { best = Math.max(best, 2); continue; }
      if (h.includes(q) || h.split(' ').some((w) => w.startsWith(q))) best = Math.max(best, 1);
    }
    if (best > 0) scored.push({ entry, best });
  }
  scored.sort((a, b) => (b.best - a.best) || a.entry.n.localeCompare(b.entry.n));
  return scored.slice(0, limit).map((s) => s.entry);
}

/* Layer 1 of the picker: the six groups. Layer 2: this group's regions, or the
   group itself when it has none (chest) so the door is never a dead end. */
export function regionsOf(group) {
  const list = REGIONS[group];
  return Object.freeze(Array.isArray(list) ? [...list] : []);
}

export function entriesFor(group, region) {
  return CATALOGUE.filter((x) => (
    (group == null || x.group === group)
    && (region == null || x.head === region || (x.head === null && x.mg === region))
  ));
}

/* A group can be a terminus only when the six-group vocabulary maps it onto a
   single engine label. "arms" and "legs" do not: the engine has biceps /
   triceps / forearms and quads / hams / glutes / calves, and no bucket called
   either. So for those two the second layer is not optional, and the screen
   must not offer a "just arms" door it cannot honour. */
export const canStopAtGroup = (group) => GROUP_MG[group] != null;

const slug = (s) => fold(s).replace(/ /g, '_').slice(0, 48);

/* Kinds are read off the neighbours rather than re-decided here, so the one
   place that decides U vs L for a region stays the catalogue data. */
function kindsFor(group, region) {
  const near = entriesFor(group, region);
  const pool = near.length ? near : entriesFor(group, null);
  const lower = pool.filter((x) => x.kinds.includes('L')).length;
  return Object.freeze(lower * 2 > pool.length ? ['L'] : ['U']);
}

/* The picker's product. Returns the entry, or { error } - never a half-entry:
   an athlete's week may not carry a row the engine cannot bucket. */
export function customEntry(spec) {
  const s = spec || {};
  const name = typeof s.name === 'string' ? s.name.trim() : '';
  if (!name) return { error: 'CUSTOM_NAME_REQUIRED' };

  let mg = null;
  let head = null;
  if (typeof s.mg === 'string' && s.mg) {
    /* free text: the athlete named the bucket outright */
    if (!ENGINE_MG.includes(s.mg)) return { error: 'CUSTOM_MG_UNKNOWN' };
    mg = s.mg;
    head = null;
  } else if (typeof s.region === 'string' && s.region) {
    if (!REGION_MG[s.region]) return { error: 'CUSTOM_REGION_UNKNOWN' };
    if (s.group != null && !regionsOf(s.group).includes(s.region)) return { error: 'CUSTOM_REGION_UNKNOWN' };
    head = s.region;
    mg = REGION_MG[s.region];
  } else {
    if (!GROUPS.includes(s.group)) return { error: 'CUSTOM_GROUP_UNKNOWN' };
    if (!canStopAtGroup(s.group)) return { error: 'CUSTOM_REGION_REQUIRED' };
    mg = GROUP_MG[s.group];
    head = null;
  }

  const group = GROUPS.includes(s.group) ? s.group : null;
  const id = typeof s.id === 'string' && s.id ? s.id : `custom_${slug(name)}`;
  return {
    id, n: name, aliases: Object.freeze([]), group, mg, head,
    secondary: Object.freeze([]),
    kinds: Array.isArray(s.kinds) && s.kinds.length ? Object.freeze([...s.kinds]) : kindsFor(group, head),
  };
}

/* Composition (brief 4.2) keys off the bucket, not the group. */
export function entriesInBucket(bucket, kind) {
  return CATALOGUE.filter((x) => (
    bucketOf(x) === bucket && (kind == null || x.kinds.includes(kind))
  ));
}
