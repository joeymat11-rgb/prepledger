'use strict';

// Local preparation only. The caller supplies the actual installed migration
// engine and W6 strict parser; this module never imports a seeded engine into a
// browser, writes a repository generation, or grants permission to activate.
const {createHash} = require('node:crypto');
const {isDeepStrictEqual} = require('node:util');
const PROFILE = 'earned/local-import-preparation/v1';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const copy = value => structuredClone(value);
function fail(code) { const error = new Error(code); error.code = code; throw error; }

function createImportPreparation({engine, parseStrictJson} = {}) {
  if (!engine || !Number.isSafeInteger(engine.SCHEMA_V) || engine.SCHEMA_V < 3 ||
      typeof engine.migrate !== 'function' || typeof engine.dataLossGuard !== 'function' ||
      typeof parseStrictJson !== 'function') fail('IMPORT_PREPARATION_DEPENDENCIES');

  function readSource(sourceBytes) {
    if (!(sourceBytes instanceof Uint8Array)) fail('IMPORT_SOURCE_BYTES_REQUIRED');
    // Keep the byte copy BEFORE parsing or handing anything to migration. Even
    // current-schema migrate calls _settleExit, which mutates its argument.
    const originalBytes = Buffer.from(sourceBytes);
    let original;
    try { original = parseStrictJson(Buffer.from(originalBytes)); }
    catch { fail('IMPORT_SOURCE_JSON_INVALID'); }
    if (!original || Array.isArray(original) || typeof original !== 'object' ||
        !Number.isSafeInteger(original.v)) fail('IMPORT_SOURCE_SCHEMA_REQUIRED');
    // v1/v2 use SEED as a migration template. Other malformed input can fall
    // back to it. Neither is an implicit athlete profile or an approved port.
    if (original.v < 3) fail('IMPORT_SOURCE_SEED_PROFILE_REQUIRED');
    if (original.v > engine.SCHEMA_V) fail('IMPORT_SOURCE_FUTURE_SCHEMA');

    return {bytes: originalBytes, state: original};
  }

  function prepare(sourceBytes, {localBytes} = {}) {
    // Snapshot BOTH independent inputs before any engine call. Migration and
    // merge are allowed to mutate their working copies, never either preimage.
    const source = readSource(sourceBytes);
    const local = localBytes === undefined ? undefined : readSource(localBytes);
    if (local && typeof engine.mergeState !== 'function') fail('IMPORT_PREPARATION_DEPENDENCIES');
    const original = source.state, originalBytes = source.bytes;
    let candidate;
    try {
      let migrated = engine.migrate(copy(original));
      if (local) migrated = engine.migrate(engine.mergeState(migrated, copy(local.state)));
      // Validate the result through the same strict JSON boundary. No object
      // alias from the migration factory survives in this preparation.
      const candidateJson = JSON.stringify(migrated);
      candidate = parseStrictJson(candidateJson);
      if (!isDeepStrictEqual(migrated, candidate)) fail('IMPORT_MIGRATION_NOT_LOSSLESS_JSON');
      if (!candidate || Array.isArray(candidate) || candidate.v !== engine.SCHEMA_V)
        fail('IMPORT_MIGRATION_SCHEMA_INVALID');
      for (const preimage of [original, ...(local ? [local.state] : [])]) {
        const guard = engine.dataLossGuard(copy(preimage), copy(candidate));
        if (guard?.safe !== true || !Array.isArray(guard.lost) || guard.lost.length !== 0)
          fail('IMPORT_MIGRATION_DATA_LOSS');
      }
    } catch (error) {
      // Engine/parser exception text may contain athlete facts. Expose only
      // these fixed preparation codes, with no cause or private diagnostics.
      if (['IMPORT_MIGRATION_SCHEMA_INVALID', 'IMPORT_MIGRATION_DATA_LOSS',
        'IMPORT_MIGRATION_NOT_LOSSLESS_JSON'].includes(error?.code))
        fail(error.code);
      fail('IMPORT_MIGRATION_FAILED');
    }
    const candidateBytes = Buffer.from(JSON.stringify(candidate), 'utf8');
    const summary = Object.freeze({profile: PROFILE, source_schema: original.v,
      candidate_schema: candidate.v, source_sha256: hash(originalBytes),
      candidate_sha256: hash(candidateBytes), source_byte_length: originalBytes.length,
      ...(local ? {local_schema: local.state.v, local_sha256: hash(local.bytes),
        local_byte_length: local.bytes.length} : {}),
      migration_guard: 'passed', activation: 'pending'});
    // Digests identify these LOCAL bytes. They are neither a signature nor an
    // accepted source-generation/frontier/consent/activation receipt. Imported
    // accepted[]/targets stay historical source facts, never fresh permission.
    return Object.freeze({
      summary,
      sourceBytes: () => Buffer.from(originalBytes),
      sourceState: () => copy(original),
      localBytes: () => local ? Buffer.from(local.bytes) : undefined,
      localState: () => local ? copy(local.state) : undefined,
      candidateBytes: () => Buffer.from(candidateBytes),
      candidateState: () => copy(candidate),
    });
  }
  return Object.freeze({prepare});
}

module.exports = {createImportPreparation, PROFILE};
