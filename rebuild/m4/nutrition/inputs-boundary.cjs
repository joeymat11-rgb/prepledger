'use strict';
const Wire = require('./inputs-wire.cjs');
const History = require('./inputs-history.cjs');
const Ops = require('../../client/ops.cjs');
const Client = require('../../client/index.cjs');
const copy = structuredClone;
const failure = (code, state = 3) => ({ acknowledged: false, prepared: false, read: false, state, code });

// One local-era composition. The existing bridge owns sealing, retries and
// commit-before-success. The repository's revision/token binds the review.
function createInputsBoundary({ repository, executeReviewed, currentFailure, scope, localConfig }) {
  let serial = 0, preparation = null, active = null, tail = Promise.resolve();
  const enqueue = task => { const next = tail.then(task); tail = next.catch(() => {}); return next; };
  async function readCurrent() {
    const before = currentFailure(); if (before) return before;
    const snapshot = await repository.load(), config = localConfig(snapshot.generation.metadata);
    if (!new Client.Store(Client.memoryBackend(snapshot.generation.collections)).integrity().intact) return failure('T2_INTEGRITY_UNPROVEN', 18);
    if (config.athleteId !== scope.athleteId || config.deviceId !== scope.deviceId ||
        config.lease?.athlete_id !== scope.athleteId || config.lease?.device_id !== scope.deviceId) return failure('NUTRITION_INPUT_SCOPE', 18);
    // C1 local records are HMAC-authenticated under this actual local era. Hosted
    // adoption/key-history must use its own existing qualified recovery path.
    for (const [id, op] of Object.entries(snapshot.generation.collections.ops || {})) {
      if (!op || id !== op.op_id || op.athlete_id !== scope.athleteId || op.device_id !== scope.deviceId || Ops.commitmentOf(op, config.identityKey) !== op.canonical_content_commitment)
        return failure('LOCAL_HISTORY_IDENTITY_UNPROVEN', 18);
    }
    const view = History.project({ collections: snapshot.generation.collections, ...scope });
    const latest = await repository.load(), after = currentFailure(); if (after) return after;
    if (latest.revision !== snapshot.revision || latest.token !== snapshot.token) return failure('NUTRITION_INPUT_STALE');
    return { read: true, revision: snapshot.revision, token: snapshot.token, view };
  }
  async function safely(task) {
    try { return await task(); } catch (error) { return failure(error.code || 'NUTRITION_INPUT_UNAVAILABLE', error.state || 3); }
  }
  return {
    read: () => enqueue(() => safely(async () => { const result = await readCurrent(); if (!result.read) return result; const { token, ...publicResult } = result; return History.freeze(publicResult); })),
    prepare: input => {
      let submitted;
      try { Wire.keys(input, ['expectedRevision', 'proposal']); if (!Number.isSafeInteger(input.expectedRevision)) throw Error(); Wire.prepare(input.proposal); submitted = copy(input); }
      catch { return Promise.resolve(failure('NUTRITION_INPUT_INVALID')); }
      return enqueue(() => safely(async () => {
        const result = await readCurrent(); if (!result.read) return result;
        if (result.revision !== submitted.expectedRevision) return failure('NUTRITION_INPUT_STALE');
        if (result.view.local.requirements.length) return failure('NUTRITION_INPUT_RESOLUTION_REQUIRED');
        if (submitted.proposal.supersedes !== (result.view.local.current?.sourceOpId ?? null)) return failure('NUTRITION_INPUT_STALE');
        const id = `nutrition-review:${scope.sessionEpoch}:${++serial}`;
        preparation = { id, revision: result.revision, token: result.token, proposal: submitted.proposal, operation: null, committed: false };
        return History.freeze({ prepared: true, preparedId: id, revision: result.revision, view: copy(submitted.proposal) });
      }));
    },
    commit: input => {
      let id; try { Wire.keys(input, ['preparedId']); id = input.preparedId; if (typeof id !== 'string') throw Error(); }
      catch { return Promise.resolve(failure('NUTRITION_INPUT_INVALID')); }
      return enqueue(() => safely(async () => {
        const changed = currentFailure(); if (changed) return changed;
        if (!preparation || preparation.id !== id) return failure('NUTRITION_INPUT_PREPARATION_REQUIRED');
        if (preparation.committed) return { acknowledged: true, committed: true, op_id: preparation.operation.op_id, durableRevision: preparation.committed };
        if (preparation.operation) {
          const recovered = await readCurrent(); if (!recovered.read) return recovered;
          const stored = recovered.view.records.find(row => row.op_id === preparation.operation.op_id);
          if (stored) {
            if (JSON.stringify(stored.original) !== JSON.stringify(preparation.operation)) return failure('NUTRITION_INPUT_REVIEW_MISMATCH', 18);
            preparation.committed = recovered.revision;
            return { acknowledged: true, committed: true, op_id: stored.op_id, durableRevision: recovered.revision };
          }
        }
        active = preparation;
        let result;
        // Only this serialized reviewed attempt can enter the private nutrition
        // route. Public raw commands never reach its bridge or borrow active.
        try { result = await executeReviewed(copy(active.proposal)); }
        finally { active = null; }
        if (result.durableRevision) preparation.committed = result.durableRevision;
        const after = currentFailure();
        if (after && result.durableRevision) return { ...after, committed: true, durableRevision: result.durableRevision, op_id: preparation.operation?.op_id };
        return result;
      }));
    },
    validateCommit(context) {
      if (context.command !== 'nutritionInputs') return null;
      const changed = currentFailure(); if (changed) return changed;
      if (!active || active.revision !== context.snapshotRevision || active.token !== context.snapshotToken || scope.sessionEpoch !== context.sessionEpoch) return failure('NUTRITION_INPUT_STALE');
      const op = context.batch?.operations?.[0], action = Wire.prepare(active.proposal);
      if (context.batch?.operations?.length !== 1 || op?.athlete_id !== scope.athleteId || op?.device_id !== scope.deviceId ||
          op.schema_version !== 1 || op.kind !== 'fact' || op.class !== 'setup-note' || JSON.stringify(op.payload) !== JSON.stringify(action.payload) ||
          JSON.stringify(op.effective) !== JSON.stringify(action.effective) || JSON.stringify(op.causal_parents) !== JSON.stringify(action.parents)) return failure('NUTRITION_INPUT_REVIEW_MISMATCH');
      active.operation = copy(op);
      return null;
    },
  };
}
module.exports = { createInputsBoundary };
