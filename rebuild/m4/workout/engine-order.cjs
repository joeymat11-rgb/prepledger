'use strict';

// Internal producer step, not an authentication or workout-partition boundary.
// Call only with storedWorkoutHistory and its SAME authenticated generation.
// Runtime sheet B15: causal_parents; accepted athlete-log position breaks ties.
// Date, device sequence, object insertion order and Start spelling never do.
function orderWorkoutStarts(history, generation, {importAnchor} = {}) {
  const fail = code => { const error = new Error(code); error.code = code; throw error; };
  // A valid unsynced/empty repository has no persisted receipt collection yet.
  const ops = generation?.collections?.ops === undefined ? {} : generation.collections.ops;
  const receipts = generation?.collections?.receipts === undefined ? {} : generation.collections.receipts;
  const W = generation?.collections?.sync?.frontier?.W;
  if (!ops || !receipts || !Number.isSafeInteger(W) || W < 0 || history?.frontier !== W ||
      !Array.isArray(history.sessions)) fail('WORKOUT_ORDER_BASIS_INVALID');
  const starts = new Map(), sequence = new Map();
  for (const row of Object.values(receipts)) {
    if (!row || !Number.isSafeInteger(row.seq) || row.seq < 1) fail('WORKOUT_ORDER_RECEIPT_INVALID');
    if (row.seq > W) continue;
    if (!ops[row.op_id] || sequence.has(row.op_id)) fail('WORKOUT_ORDER_RECEIPT_INVALID');
    sequence.set(row.op_id, row.seq);
  }
  const positions = [...sequence.values()].sort((a, b) => a - b);
  if (positions.length !== W || positions.some((n, i) => n !== i + 1)) fail('WORKOUT_ORDER_PREFIX_INCOMPLETE');
  // The import controller supplies the activation bound to its immutable source
  // generation. This checks the graph relationship, not that controller's
  // provenance/authorization or a hypothetical new authority operation kind.
  if (importAnchor !== undefined && (!importAnchor ||
      typeof importAnchor.source_generation_id !== 'string' || !importAnchor.source_generation_id ||
      typeof importAnchor.activation_op_id !== 'string' || !sequence.has(importAnchor.activation_op_id)))
    fail('WORKOUT_ORDER_IMPORT_ANCHOR_UNPROVEN');
  let athlete;
  for (const session of history.sessions) {
    const row = session?.start, op = row?.operation;
    if (!op || typeof op.op_id !== 'string' || op.kind !== 'session-start' || starts.has(op.op_id) ||
        !ops[op.op_id] || JSON.stringify(ops[op.op_id]) !== JSON.stringify(op)) fail('WORKOUT_ORDER_START_INVALID');
    if (row.status === 'rejected') continue; // Original stays visible in factual history.
    if (!['accepted-through-frontier', 'stored-on-this-device'].includes(row.status)) fail('WORKOUT_ORDER_STATUS_UNRESOLVED');
    if (athlete === undefined) athlete = op.athlete_id;
    if (!athlete || op.athlete_id !== athlete) fail('WORKOUT_ORDER_SCOPE_INVALID');
    if (row.status === 'accepted-through-frontier' ? !sequence.has(op.op_id) || sequence.get(op.op_id) !== row.receipt_sequence : sequence.has(op.op_id))
      fail('WORKOUT_ORDER_RECEIPT_INVALID');
    starts.set(op.op_id, row);
  }
  // Validate the reached causal graph without recursion or trusting transport
  // predecessors. A missing parent or cycle cannot become an arbitrary order.
  const colors = new Map();
  for (const id of starts.keys()) {
    const stack = [[id, false]];
    while (stack.length) {
      const [key, exit] = stack.pop();
      if (exit) { colors.set(key, 2); continue; }
      if (colors.get(key) === 2) continue;
      if (colors.get(key) === 1) fail('WORKOUT_ORDER_CAUSAL_CYCLE');
      const op = ops[key];
      if (!op || op.op_id !== key || op.athlete_id !== athlete || !Array.isArray(op.causal_parents) ||
          op.causal_parents.some(p => typeof p !== 'string') || new Set(op.causal_parents).size !== op.causal_parents.length)
        fail('WORKOUT_ORDER_CAUSAL_INPUT_UNPROVEN');
      colors.set(key, 1); stack.push([key, true]);
      for (const parent of op.causal_parents) stack.push([parent, false]);
    }
  }
  // Stop at the next Start ancestor; its own predecessors carry transitivity.
  const dependencies = new Map();
  for (const id of starts.keys()) {
    const need = new Set(), seen = new Set(), stack = ops[id].causal_parents.slice();
    let followsImport = false;
    while (stack.length) {
      const parent = stack.pop(); if (seen.has(parent)) continue; seen.add(parent);
      if (importAnchor && parent === importAnchor.activation_op_id) followsImport = true;
      if (starts.has(parent)) need.add(parent);
      else stack.push(...ops[parent].causal_parents);
    }
    dependencies.set(id, {need, followsImport});
  }
  const ordered = [], remaining = new Set(starts.keys());
  while (remaining.size) {
    const ready = [...remaining].filter(id => [...dependencies.get(id).need].every(parent => !remaining.has(parent)));
    if (!ready.length) fail('WORKOUT_ORDER_CAUSAL_CYCLE');
    if (ready.length > 1) {
      if (ready.some(id => !sequence.has(id))) fail('WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED');
      ready.sort((a, b) => sequence.get(a) - sequence.get(b));
    }
    const next = ready[0], dependency = dependencies.get(next);
    // A direct Start ancestor has already proved its own import descent.
    if (importAnchor && !dependency.followsImport && !dependency.need.size)
      fail('WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN');
    ordered.push(next); remaining.delete(next);
  }
  return {profile: 'earned/workout-order/v1', frontier: W, start_ids: ordered,
    ...(importAnchor ? {import_anchor: {source_generation_id: importAnchor.source_generation_id,
      activation_op_id: importAnchor.activation_op_id}} : {})};
}

module.exports = {orderWorkoutStarts};
