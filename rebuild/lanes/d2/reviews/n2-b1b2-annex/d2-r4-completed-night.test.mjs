import assert from 'node:assert/strict';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import { faultDatabase } from '../rebuild/m3/w6/test/support.mjs';
import { createSleepHost } from '../rebuild/m3/w7-preview/today/sleep-host.mjs';
import SleepModel from '../rebuild/m3/w7-preview/today/sleep-model.cjs';
const today = '2030-02-04';
for (const [label, date, expected] of [
  ['previous completed night', '2030-02-03', true],
  ['same-day night', '2030-02-04', false],
  ['future night', '2030-02-05', false],
]) test('R4-P1 completed-night producer: ' + label, async () => {
  const host = await createSleepHost({day:today,indexedDB:faultDatabase().indexedDB,crypto:webcrypto});
  try {
    const before=(await host.repository.load()).generation.collections;
    const ui=SleepModel.refusalFor({mode:'hours',date,hours:'2'},today);
    assert.equal(ui, expected ? null : 'NIGHT_DATE', 'normal UI enforces the same completed-night contract');
    const saved=await host.save({date,hours:2},{supersedes:null});
    const after=(await host.repository.load()).generation.collections;
    const result={ok:saved.ok,opsAdded:Object.keys(after.ops).length-Object.keys(before.ops).length,
      outboxAdded:Object.keys(after.outbox).length-Object.keys(before.outbox).length};
    assert.deepEqual(result,{ok:expected,opsAdded:expected?1:0,outboxAdded:expected?1:0},
      'real host must refuse incomplete/future nights without durable writes');
  } finally {host.close();}
});
