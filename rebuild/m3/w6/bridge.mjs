import { StorageFailure } from "./repository.mjs";
const clone = value => structuredClone(value);

export function createBridge({ repository, stage, validateCommit, maxAttempts = 4 }) {
  if (!repository || typeof stage !== "function" || typeof validateCommit !== "function" || !Number.isInteger(maxAttempts) || maxAttempts < 1) throw new Error("Explicit bridge configuration and commit validator required");
  let published = null, retainedInput = null, refusal = null, tail = Promise.resolve();
  const current = () => clone({ view: published, retainedInput, refusal });
  function enqueue(action) {
    const task = tail.then(action);
    tail = task.catch(() => {});
    return task;
  }
  async function perform(command, args) {
    retainedInput = clone({ command, args });
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const snapshot = await repository.load();
        const candidate = clone(await stage(clone(snapshot.generation), command, clone(args)));
        if (!candidate || !candidate.result || !candidate.generation) throw new StorageFailure("INVALID_STAGE_RESULT", 3);
        if (!candidate.result.acknowledged) {
          refusal = clone(candidate.result);
          if (refusal.state === 18) published = null;
          return clone(candidate.result);
        }
        if (!candidate.view) throw new StorageFailure("INVALID_STAGE_VIEW", 3);
        const nextView = clone(candidate.view), nextResult = clone(candidate.result);
        const commit = await repository.commit(snapshot, candidate.generation, () => validateCommit({ command, args: clone(args), snapshotRevision: snapshot.revision }));
        // Only the completed durable transaction releases the candidate and its Saved result.
        published = nextView;
        retainedInput = null; refusal = null;
        return clone({ ...nextResult, durableRevision: commit.revision, durability: commit.durability });
      } catch (error) {
        if (error instanceof StorageFailure && error.retryable && attempt + 1 < maxAttempts) continue;
        refusal = { acknowledged: false, state: error instanceof StorageFailure ? error.state : 3,
          code: error instanceof StorageFailure ? error.code : "STAGING_FAILED", copy: "Entry not saved. Your input is retained." };
        if (refusal.state === 18) published = null;
        return clone(refusal);
      }
    }
  }
  return {
    current,
    execute(command, args) {
      const submitted = clone(args);
      return enqueue(() => perform(command, submitted));
    },
    reopen() { return enqueue(async () => {
      try {
        const snapshot = await repository.load();
        const candidate = clone(await stage(clone(snapshot.generation), null, null));
        if (candidate.result?.state === 18) {
          published = null; refusal = candidate.result;
          return current();
        }
        if (!candidate.view) throw new StorageFailure("RESTORE_UNPROVEN", 18);
        published = clone(candidate.view); refusal = null;
        return current();
      } catch (error) {
        published = null;
        refusal = { acknowledged: false, state: 18, code: error instanceof StorageFailure ? error.code : "RESTORE_UNPROVEN" };
        return current();
      }
    }); },
  };
}
