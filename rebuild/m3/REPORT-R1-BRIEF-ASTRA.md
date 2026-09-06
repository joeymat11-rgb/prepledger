# R1 brief publication — ASTRA

## What and status
Documentation only: publishes `BRIEF-W5-R1.md` v1 for independent review of one combined reconciliation/lease-history/device-recovery implementation.
Branch: `rebuild/m3-r1-brief`; verified publication base: `947369caeb9fea2d6bcb04b0447857de35ba887b`.
The brief is PROPOSED, not accepted; no implementation, owner ruling, deployment or readiness result is claimed.
Only the brief and this report are added. Code, queue, ledger, dependencies, original laws, frozen app and seeded soak are unchanged.

## Source checks at that base
Accepted W5 `9dd8dae3e0955dee079e91a2d0f426cdaac95a9a`, its integration `cb5580a3c3b778e614127026a3769d383f07611b`, and W6 v1.1 integration `df09f438a93cb9548ef3f66b28b39deecc7fb347` are ancestors of the publication base.
`authority/admit.cjs:42–49,88–108` confirms one current lease, shared WAITING drain and no arrival-expiry check; the optional issued-lease resolver needs review.
`authority/admit.cjs:30–33,104–105` confirms known terminal replay precedes full-envelope validation; R1's new recovery route must check full parsed values without changing ordinary `/op` semantics.
`authority/index.cjs:41–49` confirms slot-history lookup follows only the incumbent; complete reconciliation must also inspect retained rejected contenders.
`w5/bridge.cjs:24–43,44–60,74–82` confirms one complete staged snapshot, subject/device scope, lookup-only enrollment/lease and guarded durable publication.
`w5/worker.cjs:7–10,63–83,95–124` confirms existing route names, 262144-byte cap, same-device `/op`, current lease lookup and single-key epoch use.
`w5/crypto.cjs:35–86` and `w5/WIRE.md` confirm canonical/domain bytes, low-S P1363 and single signing-key verification; the proposed keyring keeps old defaults.
Runtime A2:114–149, B17–19 and `BRIEF-W6.md:22,31–37,72–79` support immutable pending work, the minimum lease term, distinct standing/integrity states and unresolved reconciliation/time/fence requirements.
The scoped D2 search was repeated across the ledger, plan, roadmap, backend packet, client/authority READMEs, GOALS and NEXT; no accepted sign-out retention/erasure matrix was found. No private source was read.

## Corrections made while publishing
Replaced scratch/future-branch language and stale search base with this actual docs branch/base; deferred review/merge until after the current M2 receipt sequence.
Added409 ISSUANCE_EXHAUSTED for new counter/range issuance beyond capacity, with safe arithmetic, immutable retry and no silent reset.
Added500 CLOCK_UNAVAILABLE for nonfinite/unrepresentable issuer times or computed time overflow, without issuance effects, state20 or a freshness claim.
Closed an internal contradiction: historical enrollment-intent replay can coexist with a later current lease/creation epoch; repeated identities must agree, but historical and current pointers must not be forced equal. T03 now exercises that case.
Retained the earlier reviewed corrections: exact `reconcile-manifest/page` domains, recovery-only full-value mismatch check, first-enrollment verification using pinned keys, and active-signer epoch selection.
Same-family recheck found one retry ambiguity: the unchanged randomized P-256 signer can produce different valid signature bytes for identical page content. Defined duplicate identity by independently verified content and the exact original manifest, permitting valid signature/pinned-epoch variation; T06 now tests re-signing, key rotation and freshly signed changed-content refusal. A synthetic signer probe confirmed the differing-byte case; no R1 implementation test or independent acceptance is claimed.

## Verification and limits
Executed repository/source inspection, ancestor checks, two-file scope inspection and whitespace checking. Scope runner: FROZEN-PATHS PASS; OLD-PACKAGE PASS (18 allowlisted files, actual ZIP bytes); full SCOPE-FREEZE remains PENDING. No product tests or proposed R1 gates were run for this docs PR.
All T01–T08, mutation, R1-COMPLETE, local D1/HTTP, remote and phone outcomes in the brief remain NOT RUN/BLOCKED/PENDING as specified; none is reported as passing.
Issuer counters/ranges and transport caps remain engineering proposals. K1, T1, P1, client checkpoint C/CLOCK, production recovery/erasure and private use remain separate obligations.
Estimate: 23–37 engineering hours for the future combined implementation, including review; not elapsed work or a calendar promise.

## NEXT
The coordinator opens one docs PR. Cowork reviews this exact combined contract and narrow core amendment after the M2 receipt sequence; no merge by Astra.
After acceptance, the coordinator records a fresh implementation base/claim and supplies W6 the published API; this publication starts no implementation or additional branch.
