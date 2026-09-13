'use strict';
// Preserved ten behavioral bites, relocated to the actual shared core.
const {runCases}=require('./s3/mutations.cjs');
const cases = [
  ['source-alias', 'const originalBytes = bytes(sourceBytes);', 'const originalBytes = sourceBytes;',
    'all exposed copies and caller buffers'],
  ['mutated-preimage', 'engine.migrate(copy(original))', 'engine.migrate(original)',
    'actual current-schema migration mutates input'],
  ['discard-migration-return', 'let migrated = engine.migrate(copy(original));',
    'let migrated = copy(original); engine.migrate(migrated);', 'a supported earlier schema'],
  ['omit-local-guard', '[original, ...(local ? [local.state] : [])]', '[original]',
    'actual guard refuses local-only loss'],
  ['omit-remote-guard', '[original, ...(local ? [local.state] : [])]', '[]',
    'actual guard refuses a reached remote loss'],
  ['count-only-guard', 'engine.dataLossGuard(copy(preimage), copy(candidate))',
    '({safe: JSON.stringify(engine.recordCounts(preimage)) === JSON.stringify(engine.recordCounts(candidate)), lost: []})',
    'actual D33 identity guard detects a replaced date'],
  ['duplicate-key-parser', 'original = parseStrictJson(bytes(originalBytes))',
    'original = JSON.parse(text(originalBytes))', 'strict source parser refuses duplicate keys'],
  ['future-fallthrough', "if (original.v > engine.SCHEMA_V) fail('IMPORT_SOURCE_FUTURE_SCHEMA');",
    'if (false) fail(\'IMPORT_SOURCE_FUTURE_SCHEMA\');', 'future schemas and seed-dependent inputs'],
  ['lossy-json', "if (!isDeepStrictEqual(migrated, candidate)) fail('IMPORT_MIGRATION_NOT_LOSSLESS_JSON');",
    "if (false) fail('IMPORT_MIGRATION_NOT_LOSSLESS_JSON');", 'migration result must retain current schema'],
  ['private-error-leak', "fail('IMPORT_MIGRATION_FAILED');", 'throw error;',
    'private engine error prose and guard details'],
];
runCases({label:'prepare',testFile:'rebuild/m4/import/test/prepare.test.cjs',cases:cases.map(([id,needle,replacement,test])=>({id,needle,replacement,test}))});
