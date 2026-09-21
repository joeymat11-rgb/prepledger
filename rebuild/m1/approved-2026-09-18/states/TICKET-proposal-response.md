# Engine ticket: store the athlete's answer to a proposal

**Lane:** engine / staged commands. **Raised by:** the UI state pass, 2026-09-17. **Blocks:** the proposal card's "applied" state (T-40c, C-50b).

## What is missing

The coach and Today can show the engine's proposal and take the athlete's yes or no, but the answer has nowhere to go. On the tip, a tier 2 acceptance is acknowledged and not durable: `respond` is outside the staged command set, so on the local era `execute('respond', ...)` refuses with `LOCAL_COMMAND_UNSUPPORTED` (`COACH_CONSENT_SURFACE_ABSENT`, TOOL-CONTRACT.md:352-360; inventory C-50, C-51). The producer's own text says so: "This response does not confirm that the plan was applied or the reason durably saved."

The UI therefore stops at **recorded** ("You said yes. It applies when your plan is next built.") and never shows **applied**. That is honest, but it means the athlete's answer is lost when the process ends.

## What is asked

1. Add a staged command `proposal-response` with the fields: the proposal id the producer issued, the answer (`yes` or `no`), the device stamp, and the producer's reason carried unchanged. The command is refused if the proposal id was not issued by the producer (the same rule as `COACH_PROPOSAL_NOT_ENGINE_ISSUED`), if the answer is anything but the two words, or if the proposal has already been consumed by a plan build.
2. Store the answer on the device's record so that it survives a relaunch and is read by the next plan build. One answer per proposal id; a later `proposal-response` for the same id replaces the earlier one until a plan build consumes it (this is the UI's "Change my answer").
3. When a plan build consumes the answer, mark the proposal `applied` (yes) or `closed` (no) with the build stamp, and stop accepting further responses for that id.
4. Expose to the UI, per proposal: `state` in {`open`, `recorded`, `applied`, `closed`, `withdrawn`}, the stored answer, the stamp, and the build stamp when applied. The UI shows "Applied" only when `state` is `applied`; a stored answer alone renders as recorded.
5. No timed expiry. A proposal is `open` or `recorded` until a plan build consumes it, or the producer withdraws it (`withdrawn`, which the UI shows as T-40e).

## Acceptance

- `execute('proposal-response', {...})` on the local era is acknowledged and the answer is readable after a relaunch.
- A second response for the same id before a build replaces the first; after a build it is refused.
- The plan build reads a recorded `yes` and the built plan carries the change; a recorded `no` leaves the plan unchanged and the proposal `closed`.
- The state exposed to the UI moves open, recorded, applied (or closed) in that order and never skips recorded.
- The existing test gate (`tools.untraceable()`) stays green: no number in the response is constructed by the model.

## Out of scope

Undo after a build (there is an `undoAdjustment` writer, `writers.cjs:2928`, with no caller on the rebuild); a proposal expiry window; any change to what the producer proposes.
