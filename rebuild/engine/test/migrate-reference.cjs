'use strict';
// Test-only source oracle. No candidate import or candidate helper supplies expectations.
// Each listed declaration is read verbatim from the pinned frozen git blob.
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const path = require('node:path');
const SOURCE_BLOB = 'f98671d823f0d8cd83e730cdd930afe5f5e7b628';
const RANGES = [
  [305, 305], // DAY
  [306, 306], // mk
  [307, 307], // isoOf
  [308, 308], // todayStart
  [311, 311], // weeksBetween
  [633, 633], // exById
  [1034, 1046], // _loadTenure
  [1818, 1830], // nameAt
  [1858, 1858], // _bornValid
  [2021, 2021], // INSERTION_PAIRS
  [2220, 2262], // _deriveSightingFull
  [2277, 2318], // _mintJointEarn
  [2321, 2335], // reconcileSightings
  [2362, 2380], // reconcileDebutQueue
  [2381, 2453], // reconcileEraTransitions
  [2466, 2558], // earnWalk
  [10287, 10287], // LATE_READ_HOW
  [10298, 10353], // reconcileReadReceipts
  [10370, 10426], // reconcileTrendChain
  [10439, 10654], // reconcileSuggestionEffects
  [10657, 10672], // anchorDexa
  [10675, 10680], // patchV4
  [10681, 10691], // patchV5
  [10692, 10699], // patchV6
  [10700, 10704], // patchV7
  [10705, 10718], // patchV8
  [10719, 10724], // patchV9
  [10725, 10730], // patchV10
  [10731, 10745], // patchV31
  [10746, 10764], // patchV32
  [10765, 10792], // patchV33
  [10804, 10884], // patchV34
  [10885, 10888], // patchV30
  [10889, 10892], // patchV29
  [10893, 10896], // patchV28
  [10897, 10902], // patchV27
  [10903, 10913], // patchV26
  [10914, 10927], // patchV25
  [10928, 10948], // patchV24
  [10949, 10949], // patchV23
  [10950, 10950], // patchV22
  [10951, 10951], // patchV21
  [10952, 10952], // patchV20
  [10953, 10953], // patchV19
  [10954, 10964], // patchV18
  [10965, 10969], // patchV17
  [10970, 10978], // patchV16
  [10979, 10983], // patchV15
  [10984, 10984], // patchV14
  [10985, 10985], // patchV13
  [10986, 10986], // patchV12
  [10987, 10993], // patchV11
  [10997, 11008], // patchV35
  [11014, 11018], // _hashId
  [11019, 11036], // patchV36
  [11037, 11049], // patchV37
  [11052, 11052], // patchV39
  [11053, 11071], // patchV40
  [11072, 11099], // patchV41
  [11100, 11124], // patchV42
  [11125, 11143], // patchV43
  [11144, 11171], // patchV44
  [11172, 11189], // patchV45
  [11201, 11218], // KNOWN_CORR
  [11219, 11238], // _fileKnownCorr
  [11258, 11258], // SCALE1_RECLASS
  [11259, 11309], // patchV59
  [11322, 11403], // patchV60
  [11404, 11416], // patchV58
  [11417, 11450], // patchV57
  [11451, 11493], // patchV56
  [11494, 11542], // patchV55
  [11543, 11579], // patchV54
  [11580, 11637], // patchV53
  [11638, 11702], // patchV52
  [11703, 11832], // patchV51
  [11833, 11853], // patchV50
  [11854, 11866], // patchV49
  [11867, 11900], // patchV48
  [11901, 11927], // patchV47
  [11928, 11957], // patchV46
  [11958, 11971], // patchV38
  [11983, 11983], // PATCHES
  [12001, 12044], // reconcileLiftCaches
  [12057, 12068], // ensureLoadOnLadder
  [12099, 12214], // reconcileCorrectedLoads
  [12222, 12262], // _settleExit
  [12263, 12311], // migrate
  [13233, 13241], // isPristineSeed
  [13289, 13327], // recordCounts
  [13328, 13361], // dataLossGuard
  [13378, 13378], // _readRank9
  [13379, 13385], // _readPick
  [13590, 13593], // _canonJ
  [13913, 13913], // _adjRank
  [13920, 13925], // _adjInstant
  [13926, 13926], // _sugRank
  [13927, 13942], // _unionKeyed
  [13960, 13960], // PLAN_POLICY_SCALARS
  [14180, 14183], // _feedSorted
  [14189, 14211], // _sugSorted
];
const EXTERNAL = ["AUTONOMY_LEVELS","SCHEMA_V","SEED","_fileCorr","_formerNames","_isFeedDerived","_setsAtTime","_stampCorr","_volDeltas","applyInsertionSeams","atTopOfWindow","beatsNoise","bfEst","deriveLastMeta","deriveSighting","eraIdx","exActive","loadRungs","nextLoad","normalizePlan","pinsUnfilled","resetForksOf","sameEra","typicalError"];
const EXPORTED = ["DAY","mk","isoOf","todayStart","weeksBetween","exById","_loadTenure","nameAt","_bornValid","INSERTION_PAIRS","_deriveSightingFull","_mintJointEarn","reconcileSightings","reconcileDebutQueue","reconcileEraTransitions","earnWalk","LATE_READ_HOW","reconcileReadReceipts","reconcileTrendChain","reconcileSuggestionEffects","anchorDexa","patchV4","patchV5","patchV6","patchV7","patchV8","patchV9","patchV10","patchV31","patchV32","patchV33","patchV34","patchV30","patchV29","patchV28","patchV27","patchV26","patchV25","patchV24","patchV23","patchV22","patchV21","patchV20","patchV19","patchV18","patchV17","patchV16","patchV15","patchV14","patchV13","patchV12","patchV11","patchV35","_hashId","patchV36","patchV37","patchV39","patchV40","patchV41","patchV42","patchV43","patchV44","patchV45","KNOWN_CORR","_fileKnownCorr","SCALE1_RECLASS","patchV59","patchV60","patchV58","patchV57","patchV56","patchV55","patchV54","patchV53","patchV52","patchV51","patchV50","patchV49","patchV48","patchV47","patchV46","patchV38","PATCHES","reconcileLiftCaches","ensureLoadOnLadder","reconcileCorrectedLoads","_settleExit","migrate","isPristineSeed","recordCounts","dataLossGuard","_readRank9","_readPick","_canonJ","_adjRank","_adjInstant","_sugRank","_unionKeyed","PLAN_POLICY_SCALARS","_feedSorted","_sugSorted"];

let pinnedCode;
function sourceCode() {
  if (pinnedCode) return pinnedCode;
  const bytes = execFileSync('git', ['show', 'fe516c1:src/app.jsx'], {
    cwd: path.resolve(__dirname, '../../..'), maxBuffer: 8 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true
  });
  const blob = crypto.createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
  if (blob !== SOURCE_BLOB) throw Error('Frozen migration source pin mismatch');
  const lines = bytes.toString('utf8').split('\n');
  return pinnedCode = RANGES.map(([a,b]) => lines.slice(a - 1, b).join('\n')).join('\n');
}
function deterministicIds() {
  let sequence = 0;
  return { fresh(prefix = '') { return prefix + 'm5_' + sequence++; } };
}
function createMigrationReference(G, { clock, drafts = { length: 0, key() { return null; } },
  ids = deterministicIds(), Date: RealDate = globalThis.Date } = {}) {
  if (!clock || typeof clock.nowMs !== 'function') throw Error('Reference requires an explicit clock');
  class ReferenceDate extends RealDate {
    constructor(...args) { super(...(args.length ? args : [clock.nowMs()])); }
    static now() { return clock.nowMs(); }
  }
  const values = EXTERNAL.map(name => {
    if (!(name in G)) throw Error('Frozen reference dependency absent: ' + name);
    const value = G[name];
    return value && typeof value === 'object' ? structuredClone(value) : value;
  });
  // Authorized boundary seam only: frozen callers retain their exact bodies;
  // _freshId is supplied as the same deterministic provider contract as candidate.
  const build = new Function('Date', 'localStorage', '_freshId', ...EXTERNAL,
    sourceCode() + '\nreturn {' + EXPORTED.join(',') + '};');
  const declarations = build(ReferenceDate, drafts, prefix => ids.fresh(prefix || ''), ...values);
  const table = { ...G, ...Object.fromEntries(EXTERNAL.map((n,i) => [n, values[i]])), ...declarations };
  // Existing frozen-bundle dependencies may read ambient Date. Freeze only while
  // executing reference code; restore before every candidate call. No global storage.
  for (const [name, value] of Object.entries(table)) if (typeof value === 'function') {
    table[name] = (...args) => {
      const before = globalThis.Date; globalThis.Date = ReferenceDate;
      try { return value(...args); } finally { globalThis.Date = before; }
    };
  }
  return table;
}
module.exports = { createMigrationReference, deterministicIds, RANGES, SOURCE_BLOB };
