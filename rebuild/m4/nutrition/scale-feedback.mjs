import { createReadingProjector } from '../../m3/w6/reading-history.mjs';
import { storedWorkoutHistory } from '../workout/stored-history.mjs';
import { parseStrictJson } from '../../m3/w6/strict-json.mjs';
import Capture from '../workout/capture.cjs';
import Source from '../../m3/w5/source/codec.cjs';
import Values from '../workout/edit-values.cjs';
import EditHistory from '../workout/edit-history.cjs';
import Dates from '../../engine/dates.cjs';
import Scale from '../../engine/scale.cjs';

const capture = Capture.createPrescriptionCapture({ parseStrictJson, profile: Capture.SOURCE_PROFILE, sourceCodec: Source });
const copy = structuredClone;
function instant(effective) {
  if (!Values.effective(effective)) return null;
  const value = Date.parse(`${effective.local_date}T${effective.local_time}${effective.utc_offset}`);
  return Number.isFinite(value) ? value : null;
}
function freeze(value) {
  if (value && typeof value === 'object') { for (const item of Object.values(value)) freeze(item); Object.freeze(value); }
  return value;
}

// The caller owns authentication and a consistent generation read, as for the
// stored-history reader itself. Neither this projection nor its result grants
// source selection, continuation, freshness, or permission to prescribe.
export function projectScaleFeedback({ generation, athleteId, deviceId, asOf, recoveryReceipts = [] }) {
  const cutoff = instant(asOf);
  if (cutoff === null) throw new TypeError('SCALE_AS_OF_INVALID');
  const c = generation.collections, ops = c.ops || {};
  const readingHistory = createReadingProjector({ athleteId, deviceId })({
    operations: ops, dispositions: c.dispositions || {}, receipts: c.receipts || {},
    frontier: c.sync?.frontier || { W: 0 }, outbox: c.outbox || {}, rejected: c.rejected || {},
  });
  const workoutHistory = storedWorkoutHistory(generation, { athleteId, deviceId, prescriptionCapture: capture, recoveryReceipts });
  const positions = new Map(Object.values(c.receipts || {}).filter(row => row.seq <= workoutHistory.frontier).map(row => [row.op_id, row.seq]));
  const typed = EditHistory.normalizeWorkoutHistory(Object.values(ops).map(operation => {
    const seq = positions.get(operation.op_id);
    return { operation, status: c.rejected?.[operation.op_id] ? 'rejected' : seq !== undefined ? 'accepted-through-frontier' :
      operation.device_id === deviceId && Object.hasOwn(c.outbox || {}, operation.op_id) ? 'stored-on-this-device' : 'stored-status-unresolved',
      ...(seq !== undefined ? { receipt_sequence: seq } : {}) };
  }), workoutHistory.frontier);
  const byWorkout = new Map(typed.records.map(row => [row.id, row]));
  const dateMath = Dates({}, { clock: { today: () => asOf.local_date } });
  const byReading = new Map(readingHistory.records.map(row => [row.op_id, row]));
  const sourceContextRequired = Object.keys(c[Source.COLLECTION] || {}).length > 0 || Object.values(ops).some(op =>
    op.class === 'event' && ['source-import-intent', 'source-rollback-intent'].includes(op.payload?.type));

  // Transport order is evidence of recording chronology only. The existing
  // interpreters, never this chain, resolve corrections and semantic conflicts.
  function precedes(before, after) {
    const seen = new Set(), stack = [after.op_id];
    while (stack.length) {
      const id = stack.pop(); if (seen.has(id)) continue; seen.add(id);
      const op = ops[id]; if (!op) continue;
      for (const parent of op.causal_parents || []) { if (parent === before.op_id) return true; stack.push(parent); }
      const previous = ops[op.device_predecessor_op_id];
      if (previous && previous.device_id === op.device_id && previous.device_seq + 1 === op.device_seq) {
        if (previous.op_id === before.op_id) return true; stack.push(previous.op_id);
      }
    }
    return false;
  }
  function trainingReason(reading, layer) {
    const at = instant(reading.effective), day = reading.effective.local_date;
    for (const session of workoutHistory.sessions) {
      const start = byWorkout.get(session.start.operation.op_id)?.[layer];
      if (start?.active === false || layer === 'accepted' && !start) continue;
      const startDay = start?.current?.effective?.local_date ?? session.start.operation.effective?.local_date;
      if (startDay !== day) continue;
      // A later completion does not mean logSession was present at the reading.
      const closes = session.records.filter(row => row.operation.kind === 'session-close').map(row => {
        const view = byWorkout.get(row.operation.op_id)?.[layer];
        return { operation: row.operation, view };
      }).filter(row => row.view?.active !== false && !(layer === 'accepted' && !row.view));
      if (closes.some(({ operation, view }) => {
        const time = instant(view?.current?.effective ?? operation.effective);
        return time !== null && time > at && time <= cutoff && precedes(operation, reading);
      })) return 'SCALE_TRAINING_CHRONOLOGY_REQUIRED';
      const relevant = closes.filter(({ operation, view }) => {
        const time = instant(view?.current?.effective ?? operation.effective);
        if (time === at && precedes(reading, operation) && !precedes(operation, reading)) return false;
        return time === null || time <= Math.min(at, cutoff);
      });
      if (!relevant.length) continue;
      if (start?.active !== true || start.issues?.length || session.capture_issues.length || relevant.length !== 1)
        return 'SCALE_TRAINING_INTERPRETATION_REQUIRED';
      const { operation: close, view } = relevant[0];
      if (view?.active !== true || view.issues?.length || !['normal', 'early'].includes(view.current?.completion_kind))
        return 'SCALE_TRAINING_INTERPRETATION_REQUIRED';
      const closedAt = instant(view.current.effective);
      if (closedAt === null || precedes(reading, close) || !precedes(close, reading))
        return 'SCALE_TRAINING_CHRONOLOGY_REQUIRED';
      return 'AFTER_COMPLETED_TRAINING';
    }
    for (const row of workoutHistory.other_records) {
      const op = row.operation;
      if (op.kind === 'session-close' && op.effective?.local_date === day && row.status !== 'rejected' &&
          (layer === 'local' || row.status === 'accepted-through-frontier') &&
          (instant(op.effective) === null || instant(op.effective) <= Math.min(at, cutoff)))
        return 'SCALE_TRAINING_INTERPRETATION_REQUIRED';
    }
    return null;
  }
  function projectLayer(layer) {
    const days = layer === 'accepted' ? readingHistory.acceptedDays : readingHistory.days;
    const reads = new Map((layer === 'accepted' ? readingHistory.acceptedReads : readingHistory.reads).map(row => [row.op_id, row]));
    const exclusions = [], observations = [], requirements = new Set();
    const exclude = (id, reason) => { exclusions.push({ sourceOpId: id, reason }); if (reason.endsWith('_REQUIRED') || reason.includes('UNSUPPORTED')) requirements.add(reason); };
    for (const row of readingHistory.records) {
      const view = row[layer];
      if (!view || view.state !== 'included') {
        exclude(row.op_id, view?.state === 'removed' ? 'READING_REMOVED' : row.status === 'rejected' ? 'READING_REJECTED' : layer === 'accepted' && !view ? 'READING_NOT_ACCEPTED' : 'READING_RESOLUTION_REQUIRED');
      }
    }
    for (const day of days) {
      const present = day.op_ids.filter(id => {
        const at = instant(byReading.get(id).original.effective);
        if (at === null) { exclude(id, 'SCALE_EFFECTIVE_CONTEXT_REQUIRED'); return false; }
        if (at > cutoff) { exclude(id, 'READING_AFTER_AS_OF'); return false; }
        return true;
      });
      if (present.length > 1) {
        for (const id of present) exclude(id, 'DAILY_READING_RESOLUTION_REQUIRED');
        continue;
      }
      for (const id of present) {
        const row = reads.get(id);
        const record = byReading.get(row.op_id), original = record.original, effective = original.effective;
        let reason = null;
        if (sourceContextRequired) reason = 'SCALE_SOURCE_BLACKOUT_MAPPING_REQUIRED';
        else if (Number(effective.local_time.slice(0, 2)) >= 12) reason = 'AFTER_NOON';
        else reason = trainingReason(original, layer);
        if (reason) { exclude(row.op_id, reason); continue; }
        observations.push({ sourceOpId: row.op_id, effective: copy(effective), value: row.lb, unit: 'lb', effectIds: row.effect_ids.slice() });
      }
    }
    observations.sort((a, b) => a.effective.local_date.localeCompare(b.effective.local_date));
    let baseline = null, smoothedWeight = null;
    for (const row of observations) {
      if (!baseline) { baseline = { value: row.value, unit: 'lb', sourceOpId: row.sourceOpId, effectiveDate: row.effective.local_date }; smoothedWeight = row.value; }
      else smoothedWeight = Scale.scaleUpdate(smoothedWeight, row.value).next;
    }
    const rate = Scale.scaleRate({ reads: observations.map(row => ({ d: row.effective.local_date, w: row.value })) }, {
      weeksBetween: dateMath.weeksBetween, timeOf: row => dateMath.mk(row.d).getTime(), DAY: dateMath.DAY,
    });
    if (!baseline) requirements.add('ELIGIBLE_SCALE_READING_REQUIRED');
    if (!rate.measured) requirements.add('SCALE_RATE_READING_THRESHOLD_REQUIRED');
    return { observations, baseline, smoothedWeight: smoothedWeight === null ? null : { value: smoothedWeight, unit: 'lb' },
      scaleRate: rate.measured ? { ...rate, unit: 'lb/week', direction: 'positive-is-loss' } : null,
      calculationCalendar: { profile: 'existing-engine-local-midnight', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        coordinates: observations.map(row => ({ date: row.effective.local_date, midnightMs: dateMath.mk(row.effective.local_date).getTime() })) },
      fatRate: null, exclusions, requirements: [...requirements] };
  }
  const sourceRevision = { frontier: readingHistory.frontier, operations: Object.values(ops).sort((a, b) => a.op_id.localeCompare(b.op_id)).map(op => ({
    opId: op.op_id, commitment: op.canonical_content_commitment,
    status: c.rejected?.[op.op_id] ? 'rejected' : positions.has(op.op_id) ? 'accepted' :
      op.device_id === deviceId && Object.hasOwn(c.outbox || {}, op.op_id) ? 'pending-local' : 'unresolved',
    receiptSequence: positions.get(op.op_id) ?? null,
  })) };
  return freeze({ profile: 'earned/native-scale-feedback/v1', asOf: copy(asOf), frontier: readingHistory.frontier, sourceRevision,
    sourceContext: sourceContextRequired ? 'SOURCE_BLACKOUT_MAPPING_REQUIRED' : 'NATIVE_NO_SOURCE_IMPORT',
    readingHistory, workoutHistory, accepted: projectLayer('accepted'), local: projectLayer('local'),
    machineProjection: false, prescriptionEligible: false });
}
