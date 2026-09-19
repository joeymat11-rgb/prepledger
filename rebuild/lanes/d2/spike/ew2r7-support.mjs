/* EW2 ROUND 7 SUPPORT - throwaway. `ew2r6-support.mjs`'s scaffold with the ONE knob
   B1 needs and round 6 did not have: the era's durable CLIENT is RETURNED, so a cell
   can open the REAL machine-settings host on the SAME era
   (`createMachineSettingsHost({ era })`) and then install an admitted state under it.
   Everything else - the synthetic setup document, the tag projection, the two bases -
   is ew2r6-support's, imported rather than copied. Nothing here is product code,
   nothing here ships, and no product file is read except through its own module. */
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { openLocalDurableClient } from '../../../m3/w6/local/local-client.mjs';
import { createDurablePublicClient } from '../../../m3/w6/public-client.mjs';
import { createSetupCommands } from '../../../m3/w7-preview/today/setup-commands.mjs';
import { IDBFactory, createCleanInitState, tagProjector, DAY, DB, setup } from './ew2r6-support.mjs';

export { admitState } from './ew2r6-support.mjs';
export { DAY, setup };

export async function noteScaffold({ tag = 'r7', day = DAY } = {}) {
  const indexedDB = new IDBFactory();
  const time = { iso: day + 'T12:00:00.000Z' };
  const clock = { now: () => time.iso, today: () => time.iso.slice(0, 10), tz: '+00:00', monotonicMs: () => 0 };
  const options = { indexedDB, crypto: webcrypto, databaseName: DB + '-' + tag,
    namespace: 'synthetic-plan-edit/device-A', athleteId: 'synthetic-plan-edit-athlete',
    deviceId: 'synthetic-plan-edit-device', clock };
  const client = await openLocalDurableClient(options);
  assert.equal((await client.enroll()).enrolled, true);
  assert.equal((await client.boot()).ready, true);
  const bindings = await client.hostBindings({ workoutCommands: createSetupCommands(), clock });
  const repository = bindings.repository;
  const setupClient = createDurablePublicClient({ ...bindings, schemaVersion: 2 });
  assert.equal((await setupClient.reopen()).refusal, null);
  const document = setup();
  const tags = Object.fromEntries(document.exercises.map(ex => [ex.id, { head: null, secondary: [] }]));
  const first = await setupClient.execute('workout', { action: 'first-run-setup', input: { setup: document, tags } });
  assert.equal(first.acknowledged, true, first.code);
  const setupOperation = (await repository.load()).generation.collections.ops[first.op_id];
  const basisState = tagProjector.projectSetupTags(createCleanInitState({ setup: document }),
    { setup: document, tags, op_id: setupOperation.op_id, date: day });
  /* The era object `createMachineSettingsHost` accepts in place of opening its own
     (`machine-settings-host.mjs:66`): the client, the athlete and the device. */
  const era = { client, athleteId: options.athleteId, deviceId: options.deviceId, close() {} };
  return { client, era, options, clock, time, document, tags, setupOperation, basisState, repository, day,
    async generation() { return (await repository.load()).generation; },
    async tamper(mutator) {
      const before = await repository.load(), next = structuredClone(before.generation);
      mutator(next); await repository.commit(before, next, () => null);
    },
    close() { client.close(); } };
}

/* The admitted state B1 is measured on: the SAME named lift, carrying the FILE id
   `file-press`, beside two lifts the file did not re-identify. */
export function importedWithFilePress(basisState) {
  const state = structuredClone(basisState);
  state.exercises[0].id = 'file-press';
  state.exOrder.U[0] = 'file-press';
  return state;
}
export const MAP = { 'press-old': 'file-press', 'row-old': 'row-old', 'squat-old': 'squat-old' };
