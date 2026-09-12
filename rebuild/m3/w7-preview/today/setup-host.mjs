// setup-host.mjs - A4's durable lane, which is the SAME lane the weigh-in, the
// workout and the recovery check-in are in (C4c, DECISIONS:106 b / :111).
//
// This module binds and does not invent. There is no repository here, no lease
// minted here, no enrolment asserted here and no device key taken here: it opens
// this device's installation (or takes an injected one) and asks it for a setup
// host. The ONE thing this lane genuinely supplies is its command producer
// (./setup-commands.mjs) and the profile its fact carries, both passed as
// arguments so that w6 never depends on this page.
//
// RESTORE-REQUIRED NEVER RE-ENROLS (BUILD-BRIEF 2.3, S14). Opening the era is what
// refuses a damaged installation, with C1's own state 18 and code; this module adds
// nothing to that and offers no second path. First run is the other side of the
// same call: C1 enrols only when it observed all three signals absent.
//
// A4b: THE THIRD PAYLOAD MEMBER RIDES FROM HERE, NOT FROM today-bindings.mjs.
// The op carries {profile, setup, tags} (A4B-BRIEF 5, DECISIONS:129 (2)). A4b's
// first shape added the `tags` argument to w6's own createSetupHost. That file is
// PINNED ON DISK by the merged B-NTC artifact (packages/B-NTC.json, checked by
// rebuild/conform/v4/postfix/legacy-gates.cjs:12-16, which hashes the WORKING
// COPY as well as the git object), so any byte A4b changed there turned the
// rebuild.yml gate red no matter how well licensed the change was. The tags
// handling therefore lives HERE, in lane C's own file, and today-bindings.mjs,
// today-entry.mjs and local-today-journey.test.mjs are byte-identical to the tip.
//
// w6's createSetupHost IS STILL USED, and used for everything it already did:
// the era, the authority lease, the client clock, the producer-hook durable
// client bound to ./setup-commands.mjs, reopen(), the refusal face and close().
// A4b overrides exactly TWO of its methods, `save` and `all`, because those are
// the two that name the op's payload - and it overrides them through the handle's
// own `client` and `repository`, the same two objects w6 uses itself. No second
// store, no second lease, no second clock, no second generation.
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import { createSetupCommands, envelopeOf, PROFILE, SETUP_SCHEMA_VERSION } from './setup-commands.mjs';

export { PROFILE, SETUP_SCHEMA_VERSION };

/* The op shape this lane reads back, narrowed by profile equality exactly as
   w6's own setupsIn is: in ONE generation that equality is what keeps a weigh-in
   (class "reading"), a workout set (class "session") and a recovery check-in (a
   different profile) out of this list. The one thing it adds is `tags`, read back
   beside the document it describes; an op written before A4b carries none, and
   null says so rather than inventing an empty map that would read as
   "deliberately untagged". */
export function setupsIn(generation, profile = PROFILE) {
  const collections = (generation && generation.collections) || {};
  const rejected = collections.rejected || {};
  const dead = new Set(Object.values(collections.ops || {})
    .filter((op) => op && op.kind === 'tombstone' && typeof op.target_op_id === 'string')
    .map((op) => op.target_op_id));
  return Object.values(collections.ops || {})
    .filter((op) => op && op.kind === 'fact' && op.class === 'event'
      && op.payload && op.payload.profile === profile
      && op.payload.setup && typeof op.payload.setup === 'object'
      && !rejected[op.op_id] && !dead.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map((op) => Object.freeze({
      op_id: op.op_id,
      date: op.effective && op.effective.local_date ? op.effective.local_date : null,
      time: op.effective && op.effective.local_time ? op.effective.local_time : null,
      setup: JSON.parse(JSON.stringify(op.payload.setup)),
      tags: op.payload.tags ? JSON.parse(JSON.stringify(op.payload.tags)) : null,
    }));
}

/* The envelope is the PRODUCER's, not this file's, and there is exactly one
   definition of it (./setup-commands.mjs). It has to live there, because the
   host this page actually gets is not always this module's: boot() hands
   today-entry.mjs its already-open era, and today-entry then asks W6's OWN
   createSetupHost for the lane - passing OUR commands, but keeping w6's
   one-argument `save(setup)`. The envelope therefore has to come apart inside
   the command, which is the one part of that path lane C owns outright. */
export { envelopeOf };

export async function createSetupHost({ day, indexedDB, crypto, deviceKeys,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  const era = await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    const handle = await era.createSetupHost({ day,
      commands: createSetupCommands(), profile: PROFILE,
      ...(deviceKeys !== undefined ? { deviceKeys } : {}) });

    /* The generation this device actually holds, loaded through the handle's OWN
       repository - the one w6 bound to the one era under the one lease. */
    const all = async () => setupsIn((await handle.repository.load()).generation, PROFILE);
    const enrolled = async () => (await all()).length > 0;
    let alive = true;

    const wrapped = {
      ...handle,
      athleteId: era.athleteId,
      deviceId: era.deviceId,
      all,
      /* THE FIRST-RUN QUESTION, answered by the record. */
      enrolled,
      /* ONE op, written once (BUILD-BRIEF 2.2). The generation is re-read
         IMMEDIATELY before the write, so a second tap or a second tab that got
         this far finds the op already there and writes nothing; the client's own
         compare-and-swap over the generation is what makes that refusal a fact
         rather than an optimism. Everything below this line is w6's: the same
         durable client, the same producer hook, the same validated command. */
      async save(input, maybeTags) {
        /* The same refusal w6's own save gives a detached handle, in the same
           shape and with the same code: closing a lane is not an error. */
        if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
        const { setup, tags } = envelopeOf(input, maybeTags);
        if (await enrolled()) {
          return { ok: false, state: 0, copy: null, code: 'SETUP_ALREADY_RECORDED', op_id: null };
        }
        let result;
        try {
          result = await handle.client.execute('workout',
            { action: 'first-run-setup', input: { setup, tags } });
        } catch (error) {
          /* w6 answers a closed client with a refusal rather than a throw, and
             so does this: the screen reports what the durable layer said. */
          const code = (error && error.message) || 'SETUP_WRITE_REFUSED';
          return { ok: false, state: 3, copy: null, code, op_id: null };
        }
        return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      /* Detaches this host and releases its share of the installation. The other
         three lanes, if they are holding one too, keep the store open. */
      close() { alive = false; handle.close(); era.close(); },
    };
    return Object.freeze(wrapped);
  } catch (error) { era.close(); throw error; }
}

export default { createSetupHost, setupsIn, envelopeOf, PROFILE, SETUP_SCHEMA_VERSION };
