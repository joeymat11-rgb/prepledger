# P4a / P6: reason on disk

Ticket P4a-P6, CRITICAL-PATH-2026-09-15.md 4, DECISIONS:117 (3), :139, :202. Lane: PM/client
(rebuild/client custody). Model Sonnet, effort medium. Size S/M. Author only; independent
reviewer + PM integrator follow, per DECISIONS:89 plumbing tier.
Base: origin/rebuild/t2-client-core @ d3d2a16. Branch rebuild/polish-p6.

## What landed

`respond(proposalId, answer, issuance)`: a new, optional third argument. `issuance =
{ body, reason, revision, source, moment }`, all five required and `answer` must be
`"accept"`; short of that the whole write refuses (state 3) before `store.transaction`
ever runs, so no partial record reaches disk. When valid, `issuance` is folded verbatim
into the SAME `proposal-response` operation's payload, in the SAME durable transaction as
the answer: literally the same write, so "all-or-nothing with the answer" needs no new
collection or second transaction. A plain two-argument `respond()` is byte-identical to
before. `reasonFor(proposalId)` reads it back: `{ recorded: true, reason, body, revision,
source, moment, opId }`, or `{ recorded: false, notRecordedBefore: "2026-09-15", copy }`
for an accepted record with no issuance slot (old shape).

## Files : hunks

- `rebuild/client/index.cjs`: `REASON_ON_DISK_SINCE`, `validIssuance()`, `respond()`
  extended, `reasonFor()` added (3 hunks).
- `rebuild/client/copy.cjs`: `REASON_NOT_RECORDED`, `ISSUANCE_INCOMPLETE` (1 hunk).
- `rebuild/client/README.md`: documents the new `respond()` argument and `reasonFor()`.
- `rebuild/client/test/reason-on-disk.test.cjs`: new, 10 cases, self-contained (no
  `rebuild/conform` reference, matching this module's own claim).
- `rebuild/slice/P6-REPORT.md`: this file.

No file outside `rebuild/client/**` changed. `rebuild/coach/**` untouched: `accept_proposal`
still calls the old two-argument path, so the coach's own "reason is NOT on disk" red test
(`tiers.test.cjs`) still passes unchanged. Flipping it to prove the reason IS on disk is
lane C's one-line follow-on once `tools.cjs` passes an `issuance`; leaving a REQUESTS line
for lane C is outside this ticket's custody and is not done here.

## Bar, cell by cell

1. All-or-nothing, byte-for-byte: `respond() with a full issuance...` PASS; dropping any
   one of body/reason/revision/source/moment refuses the whole write, store byte-identical.
2. Pre-P6 replay: `a pre-P6 op log replays to a byte-identical projection across a real
   restart` PASS (red-first: purely additive over `boot()`/`face()`/`answers()`).
3. Read API: `reasonFor()`, accepted-with-reason, accepted-without-reason ("not recorded
   before 2026-09-15"), and unknown-id (null) all PASS.
4. No-yes / no-answer byte-identical: `an issuance travels only with an accept...` PASS.
5. `node rebuild/t2/rig187.cjs` PASS (unaffected, durability path untouched).

## Verbatim tails

```
ℹ tests 10 / pass 10 / fail 0   (reason-on-disk.test.cjs)
rig187 ⇒ PASS
ℹ tests 218 / pass 218 / fail 0   (rebuild/coach/test)
ℹ tests 552 / pass 552 / fail 0   (rebuild/m3/w6/test/*.test.mjs)
ℹ tests 643 / pass 643 / fail 0   (rebuild/m3/w7-preview/today/test)
B PACKAGE S3 PRODUCT IMPLEMENTED; ... 0 unlisted drift ...
B PACKAGE S3 PUBLIC CI EVIDENCE PASS
```

A1/A5 onboarding acceptance groups run and pass inside the 218/218 coach total above.
Both-OS GitHub CI not run here (no push made, per instructions).

## Risks

- `reasonFor()` picks the latest matching accepted op by `device_seq`; correct for the
  single-device flow every test here exercises, unreviewed for a multi-device race.
- `revision`/`source` are opaque strings the client only checks are non-empty; the coach
  supplies their real content (not this builder's custody).
- No schema_version bump on `proposal-response` payload; purely additive field.
