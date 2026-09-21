/* EW2C-only invented envelope helper.
   It does not invoke port.cjs or any oracle. The envelope uses the real crypto,
   parser, replay engine and preparation code, while its PASS/count metadata and
   producer evidence are explicitly synthetic test declarations. */
import { createCipheriv, createHash } from 'node:crypto';
import Seal from '../../../m3/setup/port/unseal.cjs';
import Provider from '../../../m4/import/engine-provider.cjs';
import Preparation from '../../../m4/import/prepare.cjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import {
  IDBFactory, SETUP, liveAt, eraFor, firstRun, carry, material, admit,
  producerRegistryFor, createSourcePlatform, parseStrictJson, Profile,
  shellWindow, slot, tap, pickBundle,
} from '../../../m3/w7-preview/import/test/support.mjs';

export {
  IDBFactory, SETUP, liveAt, eraFor, firstRun, carry, material, admit,
  producerRegistryFor, parseStrictJson, shellWindow, slot, tap, pickBundle,
};

const DEFAULT_SESSIONS = Object.freeze([
  Object.freeze(['2026-08-14', 'U']),
  Object.freeze(['2026-08-17', 'L']),
  Object.freeze(['2026-08-21', 'U']),
]);
const LOADS = Object.freeze({ 'db-bench': 45, 'lat-pulldown': 80, 'leg-press': 120 });
const REPS = Object.freeze({
  'db-bench': Object.freeze([7, 7, 6]),
  'lat-pulldown': Object.freeze([11, 10]),
  'leg-press': Object.freeze([10, 10, 9]),
});
const READS = Object.freeze([
  Object.freeze(['2026-08-14', 178.2]),
  Object.freeze(['2026-08-18', 177.6]),
  Object.freeze(['2026-08-24', 177.1]),
  Object.freeze(['2026-08-31', 176.4]),
]);

function inventedState(setup, sessions) {
  const state = structuredClone(createCleanInitState({ setup }));
  for (const ex of state.exercises) {
    ex.w = LOADS[ex.id];
    ex.last = REPS[ex.id].slice();
  }
  const session = type => ({ type, entries: state.exercises.filter(ex => ex.day === type)
    .map(ex => ({ id: ex.id, w: LOADS[ex.id], reps: REPS[ex.id].slice(), rir: 2, sets: ex.sets })) });
  state.sessionLog = Object.fromEntries(sessions.map(([day, type]) => [day, session(type)]));
  state.reads = READS.map(([d, w]) => ({ d, w, sealed: false, note: 'INVENTED' }));
  state.model = { anchorISO: '2026-08-14', lean: 132, drip: 0, src: 'EYE' };
  state.trend = 176.9;
  return state;
}

export function sealInventedBundle(setup = SETUP, { sessions = DEFAULT_SESSIONS, state = null } = {}) {
  const source = Buffer.from(JSON.stringify(state || inventedState(setup, sessions)));
  const platform = createSourcePlatform();
  const context = {
    engine: { sha256: Profile.SOURCE_PINS['rebuild/engine/oracle-shim.cjs'],
      schemaV: 60, path: 'rebuild/engine/oracle-shim.cjs' },
    oracle: { gate: { clock: '2026-09-03', tz: 'America/New_York' } },
  };
  const materialDigest = 'synthetic-ew2c-preparation';
  const registry = producerRegistryFor({ platform, context, materialDigest });
  const engineContext = registry.qualify({ context, materialDigest });
  const engine = Provider.createSourceReplayEngine({ engineContext });
  const prepared = Preparation.createImportPreparation({ engine, parseStrictJson }).prepare(source);
  const hash = value => createHash('sha256').update(value).digest('hex');
  const payload = {
    profile: Seal.PROFILE,
    createdAt: '2026-09-03T12:00:00.000Z',
    engine: context.engine,
    source: { sha256: hash(source), bytes: source.toString('base64') },
    migrated: { state: prepared.candidateState(), sha256: hash(prepared.candidateBytes()) },
    oracle: { verdict: 'PASS', gate: context.oracle.gate, evidence: 'SYNTHETIC_TEST_DECLARATION' },
    dataLoss: { safe: true, lost: 0, before: {}, after: {}, evidence: 'SYNTHETIC_COUNT_DECLARATION' },
  };
  const passphrase = 'SYNTHETIC-ONLY';
  const salt = Buffer.alloc(Seal.KDF.saltBytes, 7);
  const iv = Buffer.alloc(Seal.CIPHER.ivBytes, 9);
  const cipher = createCipheriv('aes-256-gcm', Seal.deriveKey(passphrase, salt), iv);
  cipher.setAAD(Seal.aadBytes(payload.source.sha256));
  const ciphertext = Buffer.concat([
    cipher.update(Buffer.from(JSON.stringify(payload))), cipher.final(), cipher.getAuthTag(),
  ]);
  const envelope = {
    profile: Seal.PROFILE,
    sealedAt: payload.createdAt,
    kdf: { ...Seal.KDF, salt: salt.toString('base64') },
    cipher: { ...Seal.CIPHER, iv: iv.toString('base64') },
    aad: [Seal.PROFILE, payload.source.sha256],
    ciphertext: ciphertext.toString('base64'),
  };
  return { bytes: Buffer.from(JSON.stringify(envelope)), passphrase,
    evidence: Object.freeze({ oracle: 'synthetic', counts: 'synthetic', producer: 'synthetic' }) };
}
