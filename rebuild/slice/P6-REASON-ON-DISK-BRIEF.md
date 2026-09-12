# P6 · the engine's reason and the proposal body ON DISK with the consent (rebuild/client, PM custody)

Authority: DECISIONS:89 (tier 2: plan changes only as engine-issued proposals WITH A REASON, accepted on the user's yes
through the existing proposal/consent path), :117 (3) (ruling: "recorded with the reason" means ON DISK), :139 (the coach
acceleration). Tier: plumbing (one independent blind reviewer + CI green both OS; mechanical integration on ACCEPT).
Custody: rebuild/client/** (+ its tests) and rebuild/slice/P6-REPORT.md. Nothing under rebuild/engine, rebuild/conform,
rebuild/m4/spec, .github. Base: origin/rebuild/t2-client-core when the builder starts (sha in the report). Branch: rebuild/polish-p6.
Effort: builder HIGH (this changes what a phone stores), reviewer HIGH.

## The gap (reviewer C3 of C5, REQUESTS 17:55)
The proposal-response op stores {proposal_id, answer} and the issuance {id, accepted, instance}; the engine's reason and
the proposal body live in memory and are gone after a reload. An athlete can never read WHY a plan changed.

## What lands
1. The consent record carries, all-or-nothing with the answer: the proposal body as the engine issued it (the proposed
   values, before and after), the engine's reason text, the issuing engine revision, the turn/source that carried it
   (screen or coach), and the moment; nothing the model authored: the body and reason are the ENGINE's tool result, copied
   byte-for-byte from the issuance the client already holds in memory.
2. Records already on a phone (schema without the reason) stay readable: a migration or a tolerant reader that marks the
   reason as "not recorded before <date>"; replay of the op log reproduces the same state as before (byte-identical
   projection for pre-existing ops: a red-first cell).
3. A read API the screens and the coach can use: "why did this change?" returns the stored reason for a given
   proposal id, or the honest "not recorded" for old ones.
4. Nothing is written when the answer is no (store byte-identical: the C5 test pattern).

## Acceptance bar (written before the build; the reviewer executes every line)
1. New client tests: consent-with-reason stored and read back after a real reload of the repository; all-or-nothing
   (mutate the client to skip the reason: the write refuses, nothing partial on disk); old-shape record read as
   "not recorded"; no-answer leaves the store byte-identical; replay parity for a pre-existing op log.
2. Every existing client suite green with base counts (name them: rig187, the T2 rigs the repo enumerates, W6 suites
   that consume rebuild/client, the today/gym/checkin/setup suites, run-current-head --all); native-carriers --ci PASS.
3. Coach: rebuild/coach tests 64/64 unchanged; C5's tier-2 test now proves the reason is ON DISK (one added assertion,
   lane C notified by a REQUESTS line rather than edited by this builder if the file is lane C custody: then the
   assertion is C's one-line follow-on).
4. No em/en dash in any user-facing string; report ≤ 60 lines; preflight PASS line pasted; CI green both OS at the head.
5. Reviewer file rebuild/slice/P6-REVIEW.md with FINAL VERDICT and own re-runs; at least 6 mutants killed.
