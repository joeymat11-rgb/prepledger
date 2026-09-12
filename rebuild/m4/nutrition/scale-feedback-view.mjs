import { projectScaleFeedback } from './scale-feedback.mjs';

// Trusted caller only. Retain the complete provenance privately with the view;
// presentation gets quantities, dates and explanations, never source records.
const evidence = new WeakMap();
const reasons = {
  AFTER_NOON: 'Readings recorded at noon or later do not contribute.',
  AFTER_COMPLETED_TRAINING: 'Readings after a completed workout do not contribute.',
  DAILY_READING_RESOLUTION_REQUIRED: 'Multiple readings on one date need resolution.',
  READING_RESOLUTION_REQUIRED: 'An unresolved or unsupported reading edit needs resolution.',
  SCALE_TRAINING_CHRONOLOGY_REQUIRED: 'The order of a reading and workout completion is uncertain.',
  SCALE_TRAINING_INTERPRETATION_REQUIRED: 'A workout completion needs interpretation before its reading can contribute.',
  SCALE_SOURCE_BLACKOUT_MAPPING_REQUIRED: 'Imported source context is not yet connected to scale eligibility.',
  SCALE_EFFECTIVE_CONTEXT_REQUIRED: 'A reading has an unproven observation date or time.',
  READING_AFTER_AS_OF: 'A reading is later than this view’s observation cutoff.',
  READING_REMOVED: 'Removed readings do not contribute.',
  READING_REJECTED: 'Rejected readings do not contribute.',
};
export function scaleFeedbackView(input) {
  const projection = projectScaleFeedback(input);
  const layer = projection.local;
  const view = {
    profile: 'earned/native-scale-view/v1', asOf: projection.asOf,
    standing: projection.sourceRevision.operations.some(op => op.status === 'pending-local')
      ? 'Includes readings or context stored on this device; not server-accepted.'
      : layer.observations.length ? 'From accepted recorded history.' : 'No eligible recorded history yet.',
    baseline: layer.baseline ? { value: layer.baseline.value, unit: 'lb', date: layer.baseline.effectiveDate } : null,
    smoothedWeight: layer.smoothedWeight, scaleRate: layer.scaleRate,
    count: layer.observations.length,
    from: layer.observations[0]?.effective.local_date ?? null,
    to: layer.observations.at(-1)?.effective.local_date ?? null,
    exclusions: [...new Set(layer.exclusions.map(row => row.reason))],
    exclusionDetails: [...new Set(layer.exclusions.map(row => reasons[row.reason] || 'Some recorded evidence requires resolution.'))],
    requirements: layer.requirements,
    calendar: layer.calculationCalendar.timeZone,
  };
  evidence.set(view, projection);
  return view;
}
