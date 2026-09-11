import { openTodayInstallation } from '../../../w6/local/today-bindings.mjs';

// Keep identity, key custody and the commit boundary in the accepted installation API.
// A failed attempt is retryable only after that API proves it is still a first run.
export function createEnrollment({ indexedDB, crypto, calendar, onSaved,
  openInstallation = openTodayInstallation }) {
  let state = 'editing', failure = null;
  const options = { indexedDB, crypto, calendar };
  return {
    status: () => ({ state, failure }),
    async save(setup) {
      if (state === 'saving' || state === 'saved' || state === 'restore') return { state, failure };
      state = 'saving'; failure = null;
      try {
        const era = await openInstallation({ ...options, enroll: true, initialSetup: structuredClone(setup) });
        era.close();
        state = 'saved';
      } catch (error) {
        failure = error.code || error.message;
        try {
          const existing = await openInstallation({ ...options, enroll: false });
          existing.close(); state = 'restore';
        } catch (probe) {
          state = probe.code === 'LOCAL_FIRST_RUN' ? 'retry' : 'restore';
        }
        return { state, failure };
      }
      // Nothing from the submitted object becomes Today's authority. Reopen the store.
      try { await onSaved(); }
      catch (error) { failure = error.code || error.message; state = 'restore'; }
      return { state, failure };
    },
  };
}
