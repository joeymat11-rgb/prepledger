'use strict';
/* PUBLIC SYNTHETIC. P6 (DECISIONS:456/:467) added recordIssuance({producer,
   revision}) and respond()'s issuance body/reason/revision/source/moment to
   rebuild/client, and reasonFor()'s notRecordedBefore cutover. This companion
   rides the SAME client and the SAME Ops.build, so these cells prove, at the
   tip, that (1) the plan-mutation an athlete's edit becomes is exactly the
   closed operation this companion's producer validates, unchanged by P6, and
   (2) the P6 proposal/issuance path is untouched by a plan edit standing beside
   it. No store, no host, no Today: this is the client seam alone. */
const test = require('node:test'), assert = require('node:assert/strict');
const Ops = require('../../../client/ops.cjs');
const Commands = require('../../../m4/workout/plan-edit-commands.cjs');
const validateTags = () => true;
const commands = Commands.createPlanEditCommands({ validateTags });
const DAY = '2026-09-14', NEXT = '2026-09-15';
const EDIT = { kind: 'update', exercise_id: 'press-old', changes: { sets: 3 } };

function built(overrides = {}) {
  const action = commands.prepare({ action: Commands.ACTION, input: { intent_id: 'intent-1',
    seen_plan_basis: 'earned/plan-edit-basis/v1:' + 'a'.repeat(64), starts_on: NEXT,
    edit: EDIT, causal_parents: ['op-origin'] } });
  return Ops.build({ ...action, op_id: 'op-edit-1', athlete_id: 'athlete', device_id: 'device',
    device_seq: 2, predecessor: 'op-origin', effective: { local_date: DAY, local_time: '12:00', utc_offset: '-04:00' },
    lease_id: 'lease', schema_version: 2, ...overrides }, 'synthetic-identity');
}

test('P6 the client still builds exactly the closed plan-mutation this producer validates', () => {
  const op = built();
  /* The producer's validate() asserts a CLOSED key list. If P6 (or any later
     package) adds a member to a plan-mutation, this goes red here rather than in
     a save the athlete is waiting on. */
  assert.equal(commands.validate(op), true);
  assert.deepEqual(Object.keys(op).sort(), ['athlete_id', 'canonical_content_commitment', 'causal_parents', 'class',
    'conflict_domain_id', 'conflict_domain_lineage_id', 'device_id', 'device_predecessor_op_id', 'device_seq',
    'effective', 'kind', 'lease_id', 'member_set_commitment', 'members', 'op_id', 'payload', 'requested_transaction_id',
    'schema_version', 'seen_plan_basis'].sort());
  // P6 vocabulary must not appear on an athlete's own local plan edit.
  for (const key of ['issuance', 'producer', 'revision', 'source', 'moment', 'group_provenance', 'accepted_at'])
    assert.equal(Object.hasOwn(op, key), false, key);
  assert.equal(op.members.length, 1);
  assert.equal(op.members[0].provenance, 'athlete_edited');
  assert.equal(op.conflict_domain_id, 'training');
  assert.equal(op.payload, null);
});

test('P6 an issuance-shaped member or payload cannot pass as a plan edit', () => {
  // A proposal response is class plan too. It is not this intent, and saying so
  // is the producer's job, not the store's.
  assert.equal(commands.validate({ ...built(), kind: 'proposal-response' }), false);
  const withIssuance = built();
  withIssuance.payload = { issuance: { reason: 'because', revision: 'M2-S5-TODAY-CHILD@0df73b01f3d2d935' } };
  assert.equal(commands.validate(withIssuance), false);
  const extraMember = built();
  extraMember.members = [...extraMember.members, { field: 'training.exercise-edit', value: {}, unit: 'record', provenance: 'consented' }];
  assert.equal(commands.validate(extraMember), false);
  const consented = built();
  consented.members = [{ ...consented.members[0], provenance: 'consented' }];
  assert.equal(commands.validate(consented), false);
});

test('P6 recordIssuance and respond are untouched by a plan edit beside them', () => {
  const { createClient } = require('../../../client/index.cjs');
  const client = createClient({ deviceId: 'device', athleteId: 'athlete',
    identityKey: 'synthetic-identity', authorityKey: 'synthetic-authority',
    clock: { now: () => DAY + 'T12:00:00.000Z', today: () => DAY, tz: '-04:00', monotonicMs: () => 0 } });
  assert.equal(typeof client.recordIssuance, 'function', 'the P6 seam is present at the tip');
  assert.equal(typeof client.respond, 'function');
  assert.equal(typeof client.reasonFor, 'function');
  // recordIssuance is a client-core write with no plan basis of its own; a plan
  // edit never touches it and it never touches a plan edit.
  const stored = client.recordIssuance({ id: 'proposal-1', accepted: true, instance: null,
    producer: 'synthetic-producer', revision: 'SYNTHETIC-PACKAGE@0000000000000000' });
  assert.equal(stored.stored, true);
  assert.equal(client.issuedInstance('proposal-1'), null);
  // And the scalar planEdit seam this companion does NOT use is still exactly
  // what rebuild/client/README documents: one scalar member, no dated intent.
  assert.equal(typeof client.planEdit, 'function');
});
