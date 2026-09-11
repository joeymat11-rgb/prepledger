# P2 · the two host/ requests from lane C's C1-REPORT (plumbing, PM custody)

Authority: rebuild/lanes/c/C1-REPORT.md "REQUEST TO PM" (two items, non-blocking), carried in DECISIONS:112 (5) as a
PM queue item. Tier: plumbing (one independent Opus reviewer, author ≠ reviewer, + CI green both OS; mechanical
integration on ACCEPT). Custody: rebuild/m3/w6/host/** (+ its test/) and rebuild/slice/P2-REPORT.md. Nothing else.
Base: origin/rebuild/t2-client-core when the builder starts (sha in the report). Branch: rebuild/polish-p2.

## The two items (read the report section for the exact wording and the lane's reasoning)
1. `composeWorkoutHost` passes `subtle` through to `createDurablePublicClient`: add it to the destructured
   parameters and forward it, so a host on a platform whose WebCrypto lives somewhere other than globalThis.crypto.subtle
   can supply it. Default behaviour byte-identical when not supplied.
2. `host-entry.mjs` re-exports the local factory (the `openLocalDurableClient` / `hostBindings` surface of
   rebuild/m3/w6/local) so a phone bundle built from host-entry has one import for the real durable store.
   Check with the C4 tree (today-bindings.mjs, :111) that this does not create a second path to the store: it is
   a re-export, not a new factory.

## Acceptance bar (written before the build; the reviewer executes every line)
1. rebuild/m3/w6/host/test/journey.test.mjs and engine-equivalence.test.cjs pass with the base counts (22/22 at :98,
   or the current count on the base); one new test per item (subtle forwarded = a fake subtle is observed by the
   client; the re-export is the same object identity as the local module's export).
2. Lane C's suites that ride on the host stay green with the base counts: rebuild/m3/w6/test/local-host-journey.test.mjs,
   the W6 node suite in place, and run-current-head.cjs --all (record counts).
3. native-carriers --ci PASS on the branch; the A2 gym tests (today/test/gym.test.mjs) unchanged and green.
4. workout-host.mjs changes are additive (no line removed or reordered besides the new parameter); the report shows
   the exact hunks; engine-runtime-host.cjs untouched (it is pinned by the accepted engine artifact).
5. No file outside custody changed (git diff --stat proves it).
6. Reviewer file rebuild/slice/P2-REVIEW.md with FINAL VERDICT and own re-runs.

## Report
rebuild/slice/P2-REPORT.md per rebuild/t2/REPORT.txt: factual, short, every claim executed.
