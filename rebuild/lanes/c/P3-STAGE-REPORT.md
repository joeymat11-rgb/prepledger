# P3-STAGE — author report

Ticket P3-STAGE (DECISIONS:431 point 15 and (c); GATE-AUDIT-SPEC-P2.md answer
7). Lane C, rehearsal + runbook. Size S. Model/effort: Sonnet, medium. Author
only; nothing pushed. Branch `rebuild/c-p3-stage` over tip `7b7400a4` in a
fresh detached worktree, TZ=America/New_York, Node 24.19.0. **Invented bundles
only** (public fixture shape, `preimage-2026-08-15.json`); private
`rebuild/conform/private/live.json` was never read, opened or referenced.

## 1. Bundles built

- **(a) happy** — 365 days of reads/logs/sleep, two lift groups progressing
  steadily, one graduated debut, ordinary feed.
- **(b) adversarial** — three read clusters (2022/2024/2026, two multi-year
  gaps), a session with a filed `corrLog` strike + receipted feed line (the
  only legitimate way sets decrease, per port-oracle's A3 rule), and a
  three-step correction chain on one day's food log.
- **(c) malformed** — a missing `exercises` class and a broken date stamp
  (`"2026-13-40"`) alongside otherwise-normal reads.

## 2. Timings (all on this PC, this worktree)

| step | result | time |
|---|---|---|
| build all 3 bundles | 3 files written | <1s |
| seal (a) via CLI, README command | PASS, ORACLE 7/7×2 PUBLIC | <1s |
| seal (b) via CLI | PASS, ORACLE 7/7×2 PUBLIC | <1s |
| seal (c) via CLI | **PASS** (see finding 1) | <1s |
| unseal (a) via real `unseal.cjs` | PASS, round-trip verified | 66ms |
| `--out` inside repo | refused, exit 1 | <1s |
| `--out` inside a folder literally named `OneDrive` | **not refused** (finding 2) | <1s |
| `port/test/*.test.cjs` (21 cases incl. junction/short-name bypass) | 21/21 PASS | 2.6s |
| `w6/test/local-source-consumer.test.mjs` (P2's jsdom witness) | 6/6 PASS | 2.0s |

Total: well under 30 seconds of computation. The real day adds human steps
(passphrase, moving one file, the phone), but nothing here suggests the run
is other than minutes, matching the CRITICAL-PATH size-S estimate.

## 3. Refusals observed (exact codes)

- `--out` inside the repo: `--out is inside this repository (<path>)`, exit 1,
  nothing written.
- Wrong passphrase on unseal: `BUNDLE_AUTH_FAILED`.
- One flipped ciphertext byte on unseal: `BUNDLE_AUTH_FAILED` (same code, by
  design — see unseal.cjs).
- Existing suites re-run, confirmed still GREEN: junction and 8.3-short-name
  `--out` bypass, corrupted/duplicate-key JSON, an emptied queue/exercises
  list caught by the counts check, an unrelated `--local` file, a
  lineage-only `--local` mismatch, an engine that is not GREEN — all refuse
  with no bundle written, matching the README.
- P2-W6 (existing witness, re-run): a summer-stamped installation refuses
  import review with `LOCAL_SOURCE_CONTEXT_UNRESOLVED` — see finding 3.

## 4. Gaps found (would affect the real day)

1. **Malformed input is not caught at seal time.** Bundle (c) — missing
   `exercises`, an impossible calendar date — sealed with exit 0. The counts
   check only detects a class *shrinking*; a class absent from both source
   and migrated state (0→0) is invisible to it, and nothing before the gate
   validates date strings. Validation appears deferred to C2b admission
   (`validDay`, `source-admission.mjs`) — not exercised here (residual).
2. **`--out` does not special-case a synced folder.** `outRefusal` checks only
   "inside this repo", "inside any git working tree", "a segment named
   `rebuild`". A folder named `OneDrive` outside those three is accepted. The
   bundle is encrypted, so exposure is smaller than the repo-leak this guard
   was built for, but it is real and currently unguarded.
3. **`clientClockFor`'s frozen-day branch hardcodes `tz: "-05:00"`**
   (`today-bindings.mjs:197`) year-round. Its live-clock branch is DST-correct
   (`localOffsetOf`), so a real phone should be unaffected — not observed
   directly, and P2-W6 proves the frozen branch, on a real EDT day (now), still
   produces `LOCAL_SOURCE_CONTEXT_UNRESOLVED`. Runbook pre-check 6 confirms
   this on-device before Q1.

## 5. Residual (not closed here)

C2b admission and Today/gym-card/kill-reopen were proven via the **existing**
P2 witness suite and the real `unseal.cjs`, not by wiring bundles (a)/(b)/(c)
into the full local-era/custody harness — that setup is its own ticket.
Recommend running bundle (c) through admission next, to see whether
`validDay` catches what seal-time did not.
