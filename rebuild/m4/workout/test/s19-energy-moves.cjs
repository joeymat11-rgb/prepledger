'use strict';
/* S19 (M2-S19-LIVE), UI-pass13 fix-forward: THE DECLARED ENERGY HUNKS of rebuild/engine/energy.cjs, the one rebuild/engine
   file this package moves, under the owner's ruling DECISIONS:982 (calorieTarget skips a calorie floor that is not a finite
   number; a finite floor binds exactly as before). Seven pairs: the atFloor helper, and the six call sites in calorieTarget
   that read Math.max(floor, x) at the parent and atFloor(x) here. Each pair is [before, after]: applied IN ORDER to the
   parent bytes (the S14 seal, read from Git at S19's sourceBase), each "before" has exactly one site at the moment it is
   applied, and the result is the byte on disk. s19-engine-files-differential.cjs reads this table. The pairs were derived
   from the parent and the tree by the builder's seat, each the one whole line that is its site, and are written out here as
   literals: nothing is computed at run time. Parent sha256 4dd7195e51d207bd4b8f4e09db066fd6b4fcb954a85efa4e097d4f06a587fffc, post sha256 049054478f1205d2b035b09459113bcd8898044c3340cc687104f3b3c95ab96a. */
const FILE = 'rebuild/engine/energy.cjs';
const PARENT_SHA256 = '4dd7195e51d207bd4b8f4e09db066fd6b4fcb954a85efa4e097d4f06a587fffc';
const POST_SHA256 = '049054478f1205d2b035b09459113bcd8898044c3340cc687104f3b3c95ab96a';
const HUNKS = Object.freeze([
  /* hunk 1: the atFloor helper, inserted after the floor is read */ Object.freeze(['  const floor = fl.floor;\n',
    '  const floor = fl.floor;\n  /* DECISIONS:982 (the owner\'s ruling): a floor that is not a number (no lean-mass estimate yet, so calorieFloor has\n     nothing to price it from) is SKIPPED rather than allowed to blank the band. Math.max(NaN, x) is NaN, which left a\n     just-enrolled athlete\'s labelled estimate with no lo and hi. A finite floor binds exactly as before. */\n  const atFloor = (x) => (Number.isFinite(floor) ? Math.max(floor, x) : x);\n']),
  /* hunk 2: call site hiG */ Object.freeze(['    const hiG = Math.max(floor, estG - kcalForG(band[0]));\n',
    '    const hiG = atFloor(estG - kcalForG(band[0]));\n']),
  /* hunk 3: call site loG */ Object.freeze(['    const loG = Math.max(floor, estG - kcalForG(band[1]));\n',
    '    const loG = atFloor(estG - kcalForG(band[1]));\n']),
  /* hunk 4: call site baseHi */ Object.freeze(['  const baseHi = Math.max(floor, tdEff - kcalFor(band[0]));\n',
    '  const baseHi = atFloor(tdEff - kcalFor(band[0]));\n']),
  /* hunk 5: call site baseLo */ Object.freeze(['  const baseLo = Math.max(floor, tdEff - kcalFor(band[1]));\n',
    '  const baseLo = atFloor(tdEff - kcalFor(band[1]));\n']),
  /* hunk 6: call site hi */ Object.freeze(['  const hi = Math.max(floor, baseHi + adjK);\n',
    '  const hi = atFloor(baseHi + adjK);\n']),
  /* hunk 7: call site lo */ Object.freeze(['  const lo = Math.max(floor, baseLo + adjK);\n',
    '  const lo = atFloor(baseLo + adjK);\n']),
]);
const ENERGY_MOVES = Object.freeze({ [FILE]: HUNKS });
module.exports = { FILE, PARENT_SHA256, POST_SHA256, HUNKS, ENERGY_MOVES };
