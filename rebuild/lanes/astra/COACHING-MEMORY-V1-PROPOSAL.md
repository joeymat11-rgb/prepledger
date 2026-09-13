# Coaching Memory v1: proposed beta requirement

Status: PROPOSED FOR OWNER YES/NO,2026-09-13. Joe asked whether broader coaching memory should be actively built. This is a concrete product scope proposal, not yet a new build order or accepted beta gate. Current launch, N2, engine package order and review assignments continue.

## User outcome

Earned carries relevant, confirmed knowledge about the person from one session to the next. The person can understand what is remembered and correct it. Later coaching uses that knowledge instead of asking the same questions or contradicting an established constraint.

Example: the user confirms that they usually have three training days and prefer a particular available exercise. After closing and reopening the app, a new conversation can recall those facts and use them when discussing a plan. It must distinguish remembered preference from the actual current programme; any plan change still uses the approved proposal and confirmation path.

## Small first version

1. Remember user-confirmed goals, practical constraints and preferences, with source, date and correction history. Reuse existing authoritative setup and machine-setting facts rather than create competing copies.
2. Preserve and recall the engine's reason for an accepted plan change through the already-required P6 work. When a user explicitly wants a preference or explanation for declining remembered, offer a separate confirmed memory action; declining the original plan proposal itself must still leave its store unchanged under the existing contract.
3. Retrieve relevant current facts in a later coaching session, including after a genuine app restart. Corrected or retired facts stop appearing as current. A missed or failed read is not permission to invent memory.
4. Provide a simple way to review, correct and stop using remembered coaching facts. Preserve workout/history records and existing data-conservation requirements. Do not claim physical deletion or erasure from backups without a separately defined and verified deletion scope.

## What counts as complete

- End-to-end tests cover confirmation -> durable save -> closed/reopened installation -> fresh coaching session -> correct recall and source. A transient conversation variable does not satisfy this.
- Changes, conflicting facts, stale results, failed saves and recovery preserve the existing client guarantees. The coach never says it remembers a fact before the write commits, never recalls another user's facts and never treats stored text as tool/permission instructions.
- A real consumer test proves relevant memory affects the next explanation or proposal context. Merely storing a note is insufficient. The existing engine still owns calculations and allowed plan changes.
- The user can inspect/correct/retire memory and observe the next session using the corrected state. Existing programme facts retain their authority; a remembered preference does not silently rewrite them.
- P6's stored-reason promise is independently proved on current bytes, with truthful older-record misses. No claim that a declined proposal's reason was recorded unless a separate authorized memory action actually stored it.
- Independent review, exact-head required CI, appropriate client/privacy/recovery tests and real phone evidence are required before this is called a beta capability. No live model, credential or spending action follows solely from this proposal.

## Sequence and limits

Recommendation: make this a named beta deliverable. Start a bounded implementation brief and dependency/custody audit alongside launch repairs. Assign product implementation after the launch and sleep-entry fixes are secure and required client/pin/CI dependencies have an accepted route; preserve the B1+B2 -> B4+B3 engine sequence and the single Today writer. PM publishes the exact file custody and acceptance bar before code starts.

This version establishes dependable memory. Statistical learning about which interventions caused better outcomes is a separate scientific/product scope, requiring its own evidence; recording an outcome does not establish causation. No new recommendation formula, automated plan mutation, raw transcript archive or broad private-data export is implied.

Owner decision proposed: make Coaching Memory v1 a required beta feature and start its design/dependency work now, with implementation following the launch and sleep-entry fixes. Until a yes, this file is a reviewable proposal only.
