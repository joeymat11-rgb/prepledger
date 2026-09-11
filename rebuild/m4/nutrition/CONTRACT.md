# Native scale feedback, stage 1

`projectScaleFeedback({ generation, athleteId, deviceId, asOf, recoveryReceipts? })`
is exported from `scale-feedback.mjs`. `asOf` is an explicit effective tuple:
`{local_date, local_time, utc_offset}`. It must be valid; invalid input throws
`SCALE_AS_OF_INVALID`. The caller must privately authenticate and read one
complete, consistent generation, exactly as required by the existing reading
and stored-workout readers. Recovery receipts are the existing verifier's small
receipt tuples, not renderer claims. This function grants no authentication,
source selection, current permission, prescription, or accepted plan.

The function invokes the actual `createReadingProjector` and
`storedWorkoutHistory` producers. It reuses `normalizeWorkoutHistory` to retain
accepted closes even when a pending removal hides them in the local view. It
does not consume Today presentation rows, a fabricated sessionLog, caller
eligibility flags, model values, or a caller-provided blackout Boolean.

The immutable result includes original reading/workout histories, operation
commitments and receipt/status references in `sourceRevision`, the explicit
as-of instant, and separate `accepted` and `local` results. Each layer includes
eligible observations with original effective tuples and contributing edit IDs,
baseline, smoothed weight, scale rate, exclusions and requirements. Local means
accepted plus pending own-device facts under the existing interpreters. It is
factual feedback, not an authority-accepted machine receipt. `fatRate` is always
null; `machineProjection` and `prescriptionEligible` remain false.

## Reading and training mapping

* Original reading time/date/offset survives quantity correction. The existing
  reading interpreter governs causal correction chains, concurrent edits,
  tombstones, unsupported edits, unresolved records and rejections. A pending
  correction changes only the local result; rejected changes do not contribute.
* As-of is an effective observation cutoff, not a historical knowledge snapshot:
  current resolved edits apply to the original observation, including edits
  recorded later. A future effective reading is excluded before daily grouping.
  All original records remain visible. Offsets disambiguate instants, including
  repeated hours at the daylight-saving transition.
* One surviving observation on a date can contribute before local noon. At noon
  or later it is `AFTER_NOON`. Two present readings on the same date require
  `DAILY_READING_RESOLUTION_REQUIRED`; no first/last/average winner is invented.
  Removing one can leave the other eligible. The legacy writer's first-write
  duplicate behavior is preserved in that writer, not imposed on native facts.
* Legacy `readWindow` tests the presence of the date's `sessionLog` entry, which
  `logSession` writes on completion. The native equivalent here is one included,
  interpretable schema-2 normal/early `session-close` attached to an included
  interpretable Start on the reading's date. Start or open sets alone do not
  create that completed entry. This reproduces the completed-entry test; it
  does not claim the physiological instant that exercise began.
* That completion must already exist at the reading's effective instant and
  as-of cutoff. A later completion does not retroactively exclude an earlier
  reading. A prior completion plus a consistent retained causal or same-device
  predecessor chain produces `AFTER_COMPLETED_TRAINING`. Each device predecessor
  step must retain the same device and consecutive sequence numbers. This is
  recording-chronology evidence only: it never overrides the semantic edit fold.
  Equal timestamps can be ordered by that chain. Missing/unordered cross-device
  evidence or contradictory recording/effective order requires
  `SCALE_TRAINING_CHRONOLOGY_REQUIRED`. Unsupported/unresolved completion facts,
  missing Start association and ambiguous closes require
  `SCALE_TRAINING_INTERPRETATION_REQUIRED` for the affected reading.
* Current close corrections/removals are folded by the existing native schema.
  Reading time reclassification is **not** supported by the current reading
  interpreter: the actual reclassification vector retains
  `READING_EFFECT_UNSUPPORTED`, and this projection exposes
  `READING_RESOLUTION_REQUIRED`. This module adds no reclassification rule.

## Source and arithmetic scope

The calculable path is native history without imported source material or a
source activation/rollback intent. This is observed absence of imported water
context, not an invented blackout date. A retained source row or source intent
requires `SCALE_SOURCE_BLACKOUT_MAPPING_REQUIRED`. A3's authority `sealed`
metadata is not a physiological blackout. Mapping actual selected imported
blackout state through the private source projection remains separate wiring;
this candidate does not erase a seal or fake source qualification. Other context
facts do not acquire new physiological coefficients or scale gates here.

Eligible observations are folded by original local calendar date. The first
seeds the baseline and smoothed weight directly; there is no numeric prior.
Each subsequent value uses the existing `scaleUpdate` operation: clamp the
delta to ±1.5 lb, apply 0.3, round to one decimal. Removing the first reading
rebases on the earliest surviving eligible reading; removing all yields null.

The shared `scaleRate` contains the existing raw-reading regression unchanged:
last 28 eligible observations, at least 10, the same Newey–West bandwidth,
OLS floor, uncertainty/rounding and diagnostics. Positive scale rate denotes
loss in lb/week. Fewer observations produce a null native rate and
`SCALE_RATE_READING_THRESHOLD_REQUIRED`; no weekly snapshots are fabricated and
the legacy numeric prior is not exposed. Scale change does not establish fat
change. The legacy `currentRate` wrapper still adds its configured model drip,
including its unchanged missing-model failure; native scale calculation calls
the shared scale-only helper directly.

Regression preserves the existing engine's local-midnight day coordinates,
including its daylight-saving arithmetic. `calculationCalendar` records the
actual runtime zone and coordinates used. Effective offsets govern observation
eligibility and are retained; they do not invent a historical timezone ID or
replace the established regression axis. Moving the runtime to another timezone
can change that legacy coordinate axis. Cross-timezone calendar policy has not
been added by this extraction.

Projection writes nothing and caches nothing. Reopening or removing derived
cache data recomputes from current resolved originals. The tests include actual
encrypted C4 producer journeys and clearly synthetic receipt fixtures for
boundary controls; the latter are not authority authentication evidence. This
candidate needs distinct review, later host wiring and full engine qualification.
