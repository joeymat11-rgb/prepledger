# C3 REVIEW — independent, by execution and by mutation

## VERDICT: ACCEPT WITH CONDITIONS

The harness is real. It reproduces exactly (17 proved / 0 failed / 6 not
provable, exit 0, twice), it touches no product code, and **15 of its 17 proved
rows go RED when the store is broken in the way the row claims to cover** — I
broke each one and watched. That is more than most "proof" harnesses survive.

Two rows do not bite, and one of them is the row the whole lane is named after.

| condition | why | done when |
|---|---|---|
| **C1. Fix or downgrade `W-KILL-AFTER-ACK`.** It cannot tell "publish after the IDB transaction completes" from "publish before it". I made `bridge.mjs` resolve `execute()` *before* awaiting `repository.commit` and the row still printed PASS, twice. The kill lands ≥ ~450 ms after the ack (measured), so the transaction always finishes first. | The report calls this row "the durability claim itself" and "kill within milliseconds of the resolved promise". Neither is true as executed. | Either (a) hoist `pidsFor(dir)` to *before* `execute()` so the kill is one `taskkill` spawn (~97 ms) after the ack, and add a negative control that runs the row against an ack-early build and requires FAIL; or (b) delete the durability-ordering claim from C3-REPORT/BRIEF and cite `local-bite.cjs`'s durability-gate bite as the only thing that proves it. |
| **C2. Make `W-CONTINUITY-FLAG` assert.** It asserts nothing at all — it prints `Object.keys(booted)` and a fixed sentence. I added `continuityFlag` and `wallHighWater` to `boot()`'s payload; the row printed `[continuityFlag … wallHighWater]` and, in the same line, "no continuity flag, boot identity or wall high-water exists". PASS, exit 0. | The BRIEF claims "Desktop proves: yes, structurally". It does not. The node case (`local-witnesses.test.mjs:168`) *does* catch it. | Copy that same key-filter assertion into the browser row, or relabel the row's BRIEF entry "proved by the node case only". |
| **C3. Wire the hand proof's page check to a stop condition.** §1 tells Joe to use the local-era page and, if unsure, "ask before you start". That is an instruction, not a check. | Every one of the eight phone rows is worthless against `localStorage` Today, and C3 knows it. | Row 1 already asks for the **era id**, which is exactly the discriminator (Today has none). Add: "If there is no era id anywhere on this page, STOP and say so — it is the wrong page and nothing below would mean anything." |

None of these blocks the branch. C1 and C2 are one-line-ish edits inside C3's own
files; C3 is a sentence in C3-HAND-PROOF.md.

## WHAT I EXECUTED

Worktree `work/lane-c/review-c3`, detached at `732fb95`, base `84ea2a2`. Node
v24.19.0, Edge 152.0.4191.66, Windows. Nothing was installed, nothing committed,
no candidate file edited — `git status --porcelain` is empty after every run.

| # | command | result |
|---|---|---|
| 1 | `git diff --stat 84ea2a2 HEAD` | exactly the 5 new files, all `A`, 1714 insertions. `git diff --stat 84ea2a2 HEAD -- rebuild/m3/w6/local rebuild/m3/w6/host rebuild/client rebuild/engine rebuild/m3/w6/bridge.mjs rebuild/m3/w6/repository.mjs` → **empty**. |
| 2 | `node rebuild/m3/w6/test/local-witnesses.mjs` (Edge) ×2 | `17 proved, 0 failed, 6 not provable`, exit 0, **both runs**. Every row's verdict, op_id, revision and evidence line identical between runs except the ntp.msn.com chrome request (0 in run 1, 1 in run 2 — correctly bucketed as chrome both times). |
| 3 | `node --test rebuild/m3/w6/test/local-witnesses.test.mjs` | `tests 6 · pass 6 · fail 0`, exit 0. |
| 4 | `node --test rebuild/m3/w6/test/*.test.mjs` | `tests 479 · pass 479 · fail 0`, exit 0. Claim confirmed. |
| 5 | sha256 of all five files | the four declared hashes match **exactly**; all five are LF-only (`crlf=0`). |
| 6 | 9 mutations in a disposable copy of the whole `rebuild/` tree under `%TEMP%` | below. Sandbox green before and after; pristine restored. |
| 7 | kill-latency measurement (`Get-CimInstance` + `taskkill` spawn) | `processTable()` round trip **355 ms**; one `taskkill` spawn **97 ms**; 8–9 pids killed serially per profile. |
| 8 | A1 dependency | `today-model.cjs:35,121–124,135–136` is `createWebStorageBackend` over `globalThis.localStorage`; `openLocalDurableClient` appears in **0 of 30** files under `rebuild/m3/w7-preview/`. C3's finding 3 is exactly right. |
| 9 | C1 cross-citations | `local-client.test.mjs` case 6 = "kill mid-transaction…" (fault-injecting IDBFactory, asserts `deepEqual(load(), before)` — genuinely byte-exact), case 7 = quota abort, case 21 = lapse-while-open. All three citations are accurate. |
| 10 | `SCORECARD-W3.md:6–8`, `DECISIONS.md:24` | the BRIEF's restatement of the five witnesses and of the "bounded" ruling is faithful. |

Probes ran under their own `%TEMP%` profile dirs; no process outside a
`w6-witness-*` scratch tree was killed.

## MUTATION RESULTS — does the row bite?

Nine mutations, each applied to a disposable copy of `rebuild/` under `%TEMP%`
(never the candidate), then the harness re-run whole.

| mutation | what it breaks | rows that went RED |
|---|---|---|
| `ackEarly` — `bridge.mjs` resolves `execute()` before awaiting `repository.commit` | the durability ordering itself | `W-TWO-TABS`, `W-QUOTA` only. **`W-KILL-AFTER-ACK` and `W-KILL-INFLIGHT` stayed PASS, 2/2 runs.** |
| `partialFresh` — `nothing = !store \|\| !keys \|\| !marker` | partial erasure reads as first-run | `W-ERASE-PARTIAL`, **precisely and only** |
| `noRenew` — `boot()` never renews the lease | day-201 self-renewal | `W-RENEW-200`, `W-PAST-CLIFF` |
| `noLapse` — `leaseExpired()` always false | the day-401 refusal | `W-LAPSE-400`, `W-CLOCK-ROLLBACK`, `W-FACE-DISAGREES` (one act, shared profile) |
| `noRetry` — `bridge.mjs` drops the `STALE_REVISION` retry | the second tab loses its write | `W-TWO-TABS`, **precisely and only** (`[false,true] !== [true,true]`) |
| `quotaLies` — a state-3 result is rewritten `acknowledged:true` | quota abort still publishes "Saved" | `W-QUOTA`, **precisely and only** |
| `continuityFlag` — `boot()` gains `continuityFlag` + `wallHighWater` | witness 2's whole claim | **nothing. exit 0.** The node subset caught it (`actual ['continuityFlag','wallHighWater'] !== expected []`). |
| `restoreDetected` — a revision high-water in the markers DB refuses an old restore | witness 4 "fixed" | nothing — **and that is the right answer**: the whole-profile copy takes the markers DB with it, so any local high-water is restored too. This is a live demonstration that W4 is unfixable offline, not a gap in the row. |
| `seqShift` — lease range starts at 2 | every sequence identity | 16 rows, incl. `W-OLD-RESTORE` (`actual undefined !== expected "op-dev-phone-A-1"`) |

**Row-by-row.** Bites: `W-KILL-IDLE` y · `W-REBOOT-PROCESS` y · `W-KILL-INFLIGHT`
partial (atomicity/gap assertions bite; the ack-ordering defect does not) ·
`W-DAY-GAP` y · `W-RENEW-200` y · `W-PAST-CLIFF` y · `W-LAPSE-400` y ·
`W-CLOCK-ROLLBACK` y · `W-FACE-DISAGREES` y · `W-TWO-TABS` y · `W-ERASE-ALL` y
(deepEqual against both a wiped and a virgin profile; falsified via `seqShift`) ·
`W-ERASE-PARTIAL` y · `W-OLD-RESTORE` y — **a two-way witness**: it pins
`ready:true`, `revision 2`, `ops 1`, `acknowledged:true` and the exact re-issued
`op-dev-phone-A-2`, so it fires whether the exposure grows *or* is silently
"fixed" · `W-QUOTA` y · `W-NO-NETWORK` y.

Does not bite: **`W-KILL-AFTER-ACK`** (for the defect it names) and
**`W-CONTINUITY-FLAG`** (for anything at all).

## DEFECTS

**D1 — `W-KILL-AFTER-ACK` proves less than it says (major).**
*Repro.* In a copy of the tree, replace in `bridge.mjs`:
`const commit = await repository.commit(snapshot, candidate.generation, () => validateCommit(context));`
with a non-awaited `repository.commit(...)` plus a synthesised
`{ revision: snapshot.revision + 1, durability: {requested:"strict",actual:"strict"} }`.
Run the harness: `W-KILL-AFTER-ACK` prints PASS both times
(`%TEMP%/rev-c3/mut-ackEarly.txt`). *Mechanism.* `hardKill()` calls `pidsFor()`
first, which spawns PowerShell + `Get-CimInstance` — measured **355 ms** — then
one `taskkill` per pid at ~97 ms. So the earliest kill is ~450 ms after the
resolved promise and the last is ~1.2 s after. Chromium has long since completed
the transaction. The report's "kill within milliseconds of the resolved promise"
and "This is the durability claim itself" (BRIEF, W-KILL-AFTER-ACK) are not
supported by what runs. What the row *does* prove is weaker and still worth
having: an operation whose `execute()` resolved is on disk half a second later
across a `taskkill /F`.

**D2 — `W-CONTINUITY-FLAG` contains no assertion (major).**
*Repro.* Add `payload.continuityFlag = "trusted"; payload.wallHighWater = nowIso;`
immediately before `status = { state: "ready", code: "LOCAL_READY" };` in
`local-client.mjs` `boot()`. Harness → `17 proved, 0 failed`, exit 0, with the
evidence line reading
`boot() reports [continuityFlag derived … wallHighWater]: no continuity flag,
boot identity or wall high-water exists`
(`%TEMP%/rev-c3/mut-continuityFlag.txt:3`). A row that prints its own refutation
and still says PASS is the exact false-green shape C3 set out to avoid. The node
case does catch it, so the *coverage* exists — only the browser row is
decorative, and the BRIEF's "Desktop proves: yes, structurally" is wrong.

**D3 — `W-KILL-INFLIGHT` has never landed on the "absent" side (minor).**
COMMITTED in 4/4 observed runs (C3's recorded run + my three). Residual 11 calls
it "a race"; as executed it is not 50/50, it is one-sided, and the half it
exercises is the same half `W-KILL-AFTER-ACK` exercises. The atomic-or-absent
*assertion* is sound and bites (`seqShift` breaks `next.op_id`), but the row
should say "the absent side has not been observed on this platform", not "the
race is real".

**D4 — `W-QUOTA` asserts less than the BRIEF claims (minor).** The BRIEF says the
local era must "leave the previous generation **byte-exact**". The row asserts
`revision`, `ops` and the layer-1 reads — not bytes. (C1's case 6 does the real
byte comparison, `deepEqual(await raw.repository.load(), before)`; the browser
row cannot reach the raw record.) `refused.code` is printed but never asserted,
so a change from `TRANSACTION_ABORTED` to anything else would pass silently.
Also: the fill ladder sets `floor` to the *last size that hit quota*, so if the
256-byte stage completes all 400 iterations without failing, `floor` stays 2048
while another ~100 KiB went in after the 2 KiB failure — the printed "full to
within N bytes" can overstate. That one is benign (it would make the row go RED,
not green) but the evidence line should say what it measured.

**D5 — the hand proof's page guard is advice, not a check (minor, but it decides
whether the phone run means anything).** See condition C3. C3 correctly
identified that Today is `localStorage` and correctly refused to fix it (Track
A's file). It then relies on Joe self-certifying which page he has. Row 1 already
collects the discriminator; it just isn't wired to a stop.

## WHERE I DISAGREE

1. **`W-SEQ-EXHAUSTION` is mislabelled.** The matrix files it as
   NOT-PROVABLE-HERE, "unreachable by construction". But `DECISIONS.md:24` rules
   the bound as "**a wall-clock + sequence budget**". This build implements the
   wall-clock half and no budget at all (`range: [1, 2**31-1]`). The honest label
   is not "nothing to prove" — it is "**the second half of the ruled-for bound is
   absent in the local era**", i.e. a residual against the owner's own ruling.
   The BRIEF's reasoning (there is no authority to reconcile against, so there is
   nothing to budget *toward*) is a good argument and may well be right; it is an
   argument the PM should get to read as a residual, not a row that quietly says
   "no browser can decide this". The node case pins it correctly — that part I
   have no quarrel with.
2. **"No browser can decide `W-IOS-SAFARI`" over-reaches.** Playwright-core
   1.62.1 can drive a WebKit build. That is not iOS and not Safari, but it is a
   different IndexedDB implementation and it would have been real evidence. It
   was neither taken nor mentioned. (No install was permitted here either, so
   this is a request, not a blocker.)
3. **Hand-proof row 3 is weaker than presented.** Swiping the Safari card is
   offered as the phone analogue of `taskkill /F`. On iOS, Safari's storage runs
   in a separate WebKit process; swiping the card does not reliably terminate it.
   Row 4 (reboot) is the one that actually carries that weight. Say so, so nobody
   later reads row 3 as the iOS kill-after-ack proof.

## WHAT I CHECKED AND FOUND SOUND

- **The kill is a real kill.** `pidsFor()` reads `Win32_Process`, matches the
  profile directory in the command line (case- and slash-normalised), then
  `taskkill /F /T` — `TerminateProcess`, no `beforeunload`, no unload handler, no
  orderly IndexedDB shutdown. `settle()` then polls until the pids are gone, so
  no row can race a zombie holding the profile. The distinction drawn against
  `local-browser.mjs`'s `context.close()` is correct and material.
- **The quota cap is applied before the origin's first IndexedDB use.**
  `page.goto(origin)` loads a script-free index; the CDP
  `Storage.overrideQuotaForOrigin` + `navigator.storage.estimate()` run in
  `afterGoto`, and only the *next* `page.evaluate` imports `/local.js`. C3's
  finding 1 is correct, the fix is in the right place, and the
  `QuotaExceededError` at 11.97 MiB against a 12 MiB cap is the browser's own.
  State 3 and the held generation reproduce.
- **The network attribution is right in both directions.** Run 2 caught an
  `ntp.msn.com` request from Edge's own new-tab frame and bucketed it as chrome,
  not against the app; my injected `fetch("https://example.com/telemetry")` from
  the bundle was counted (20 requests, "from http://127.0.0.1…") and failed the
  row. Frame attribution, not a host list, is the correct design and it works.
- **`W-OLD-RESTORE` copies the whole profile**, which is strictly stronger than
  the node case's record-level restore, and my attempt to "fix" it with a local
  high-water was defeated by the restore itself — which is the residual's proof,
  not its gap.
- **No product seam was added.** The REQUEST for a `__commitBarrier` is filed and
  recommended *against*. I agree: the right place for the forced version is where
  C1 already has it, at the IDB API.
- **Report honesty is high.** Four declared sha256 match to the byte; the run
  reproduces number-for-number; `NOT-PROVABLE-HERE` is printed, never skipped,
  and does not touch the exit code; residuals 10–13 are stated against C3's own
  work. The two overclaims in D1/D2 are the exceptions, and both are in prose
  about rows whose code is visible in the same file.

## RESIDUALS CONFIRMED

C3's own list (BRIEF 1–9, REPORT 10–13) stands, executed rather than argued. I
confirm each and add four.

1–3. Coherent old restore undetectable offline; rolled-back clock reopens expiry;
whole erasure is first run — **all three reproduced in a real browser**, and I
independently falsified each (`seqShift`, `noLapse`, `partialFresh`/`seqShift`).
4. No elapsed time is ever proved — correct; every day-N is an injected clock.
5. The 400-day cliff survives; 200 days of failing renewals would lapse an era
   and nothing simulates that — correct, and `noRenew` shows the renewal path is
   load-bearing (day 402 dies without it).
6. Power loss untested — correct. `durability {requested:"strict",
   actual:"strict"}` is printed, not asserted. Right call.
7. iOS eviction unforceable — correct.
8. Real DST and a real old-phone restore NOT RUN — correct.
9. Witness 5's exhaustion half unreachable — see disagreement 1: it is a
   residual against DECISIONS:24, not an unprovability.
10. **The phone rows are NOT RUN.** Unchanged. All three runners keep saying so.
11. `W-KILL-INFLIGHT` is a race — see D3: one-sided in 4/4 runs.
12. The quota row can go quiet if a browser drops the CDP override — confirmed by
    reading the degradation path; the printed verdict is indeed the only warning.
13. Chromium only — confirmed; Edge 152.0.4191.66 is the sole engine.

**New (mine):**
14. `W-KILL-AFTER-ACK` does not discriminate ack-before-commit (D1). Until C1 is
    applied, the durability *ordering* is proved only by `local-bite.cjs`.
15. `W-CONTINUITY-FLAG`'s browser row is decorative (D2); witness 2 is carried by
    the node case alone.
16. `W-QUOTA` proves "the previous generation is at the same revision with the
    same ops", not "byte-exact" (D4).
17. The phone run's validity rests on an unverified page identity (D5/C3).

## FILES REVIEWED (sha256, verified on disk, all LF-only)

| file | sha256 | bytes |
|---|---|---|
| `rebuild/m3/w6/test/local-witnesses.mjs` | `2235bc13d3f2f93c40a446a47bcb649b35b53e5bc92c1cd2bf804bc6c7c8b659` | 34,208 |
| `rebuild/m3/w6/test/local-witnesses.test.mjs` | `0f61ff6709bce1152f91d910bd81cc2cf4ecef17e678aa46967d824a9a7243b5` | 14,217 |
| `rebuild/lanes/c/C3-BRIEF.md` | `199726252e0c3255c0dd768da9ec0caab5b21673ce15c2bfaa6da513a07b5d59` | 24,591 |
| `rebuild/lanes/c/C3-HAND-PROOF.md` | `10bd11f8fa9c7ba17784d1dc2213597357879a243965dd9f142c29ec9dbe8679` | 9,115 |
| `rebuild/lanes/c/C3-REPORT.md` | `2b4f95e2484c6a4848c4ad87fe7ef3c1c05d28b475c8657a8d5ce6b498dfc4f3` | 20,698 |

Read for context, unmodified: `rebuild/m3/w6/local/local-client.mjs`,
`local/local-era.mjs`, `local/build.mjs`, `bridge.mjs`,
`test/local-client.test.mjs` (cases 6/7/21), `rebuild/m3/SCORECARD-W3.md`,
`rebuild/DECISIONS.md:13,24`, `rebuild/m3/w7-preview/today/today-model.cjs`.

*Reviewed by execution and mutation on the owner's Windows PC, 2026-09-11.
Nine mutations, all in a disposable `%TEMP%` copy; the candidate was never
edited and `git status --porcelain` is empty.*

---

# ROUND 2 — re-review at `15da0ea`

## FINAL VERDICT: ACCEPT at 15da0ea

All five conditions are met, and I verified each by execution rather than by
reading the response. The two rows that did not bite in round 1 were fixed in
opposite ways, and **the honest one is the one that was not fixed**: D1 could not
be fixed, the builder measured that, said so, and downgraded the row instead of
dressing it up. That is the right answer and it is the reason this is an ACCEPT.

No defects. Three observations are recorded below as notes for the PM, none
blocking.

## WHAT I EXECUTED (round 2)

| # | command | result |
|---|---|---|
| 1 | `git diff --stat 84ea2a2 15da0ea` | still exactly the five C3 files (2217 insertions). `git diff --stat 84ea2a2 HEAD -- rebuild/m3/w6/local rebuild/m3/w6/host rebuild/client rebuild/engine rebuild/m3/w6/bridge.mjs rebuild/m3/w6/repository.mjs rebuild/m3/w7-preview` → **empty**. |
| 2 | harness ×2 on the shipped bytes | `17 proved, 0 failed, 6 not provable`, exit 0, **both**. ack→kill gap now **2 ms** and **1 ms** (was ~450). |
| 3 | `--bite` ×3 (15 attempts, mine) | run 1 **0/5**, run 2 **1/5**, run 3 **1/5** — **2 reds in 15, ~13 %**. The builder's 3-in-20 (~15 %) reproduces. A RED attempt reads `relaunch rev 1 ops 0`: the ack-early build genuinely lost a save it had called Saved. |
| 4 | bite hygiene, **independently measured by me, not read from its output** | `bridge.mjs` sha256 `52371ccb…0a00` before **and** after every bite run, and `git status --porcelain rebuild/m3/w6/bridge.mjs` empty. The mutation really is bundle-only. |
| 5 | anchor-count block | refactored the anchor in a sandbox copy (`const gate = () => validateCommit(context);` then pass `gate`). Result: `FAIL BITE-KILL-AFTER-ACK — bite BLOCKED — the ack-ordering anchor appears 0 times in the built bundle, not once`, **exit 1**. It blocks; it does not silently pass. |
| 6 | D2 re-mutation (`continuityFlag` + `wallHighWater` on `boot()`) | **RED.** `actual [...,"continuityFlag",...,"wallHighWater"] !== expected [...]`, exit 1. Round 1's false green is closed. |
| 7 | D4 code assertion | mutated the refusal code → `FAIL W-QUOTA actual "SOMETHING_ELSE" !== expected "TRANSACTION_ABORTED"`. Bites. |
| 8 | `local-bite.cjs` | `LOCAL BITE DETECTED — durability-gate removed; "kill mid-transaction" fails as designed` … `RESTORED PASS`, source `a055c623…14ea9` unchanged, exit 0. The new load-bearing citation is real and deterministic. |
| 9 | `node --test …/local-witnesses.test.mjs` / `…/*.test.mjs` | `6/6` and `479/479`, exit 0. |
| 10 | sha256 of all five files + `bridge.mjs` | every revision-2 hash in the report's table matches on disk; all LF-only. |
| 11 | wording sweep | "within milliseconds", "the durability claim itself", "Desktop proves: yes, structurally", "unreachable here by construction" appear **only** inside the sentences that retract them (`C3-REPORT.md:301,337`, `C3-BRIEF.md:104`). No live claim survives. |
| 12 | `git status --porcelain` | only `?? rebuild/lanes/c/C3-REVIEW.md`. |

## CONDITIONS — closed, one by one

**C1 — `W-KILL-AFTER-ACK`: CLOSED, and closed honestly.** Two things happened.
The kill path was rebuilt (`process.kill` over a pid list resolved *before* the
save; `taskkill /F /T` demoted to a sweep) and the measured gap fell from ~450 ms
to **1–2 ms**. Then `--bite` was built to find out whether that was enough — and
the answer was **no**. My own 15 attempts give 13 %; the builder's 20 give 15 %.
**Is the WITNESS-ONLY label honest? Yes, and it is the strongest available
claim.** A control that fires one attempt in seven cannot gate anything, and the
alternative — quoting a 13 % discriminator as proof of ordering — is exactly what
round 1 rejected. The fallback citation is sound: I ran `local-bite.cjs` and its
durability-gate bite removes the completion gate and turns C1's own
"kill mid-transaction" case red, deterministically, every run. The label appears
in the runner's evidence line, in C3-BRIEF.md (§W-KILL-AFTER-ACK and residual 10)
and in C3-REPORT.md; the two retracted phrases are gone from both.

I also confirm the builder's floor argument, which is the part that makes the
downgrade final rather than provisional: the ack→kill gap is bounded below by a
CDP round trip out of the page, and an IndexedDB commit of a few-KB record is
faster than that. **No browser row can close this** without a product seam, and
the lane already refused to add one. I agree with refusing it.

**C2 — `W-CONTINUITY-FLAG`: CLOSED.** My exact round-1 mutation now goes RED
(item 6 above). Two key sets are pinned: `Object.keys(boot())` and the raw sealed
record's envelope (`ciphertext format iv namespace revision`). The third set —
inside the ciphertext — stays with the node case, and the row's evidence line now
says that rather than implying it checked. Both fixes are real assertions, not
prose. I re-ran the round-1 `partialFresh`, `noRetry` and `quotaLies` mutations
against `15da0ea` as spot checks and they still bite precisely and only their own
rows.

**C3 — hand proof STOP: CLOSED.** Row 1 ends in a boxed STOP CONDITION — *is
there an era id, yes or no?* — "no" meaning stop, do not do rows 2–8, send the
photo and the words "no era id". The preamble states the reason in one sentence
(a green result on the wrong page is worse than no result, because it gets filed
as evidence) and explains why the era id is a discriminator Today cannot fake.
The reasoning is sound: the era id is produced by `createLocalEra` inside the
sealed generation and by nothing else, and `openLocalDurableClient` appears in 0
of 30 files under `w7-preview/`, which I re-checked at this head. My round-1
disagreement about row 3 (iOS swipe-kill does not reliably end the storage
process) was also taken up, verbatim and in Joe's language, without being asked.

**D3 and D4 — CLOSED.** D4 now asserts the sealed record's bytes (digest before
and after the refusal), the refusal `code`, and a *confirmed* headroom via a final
256-byte probe that must also fail. D3's rewording is in every run, and something
the round-1 review could not have seen turned up: with the 1–2 ms kill the
in-flight row landed **ABSENT** in both my runs, where the ~450 ms kill had it
COMMITTED in 4 of 4. Both sides of atomic-or-absent have now been observed.

## THE DECISIONS:24 RESIDUAL — asked and answered

The residual is now recorded **verbatim and identically in three places**: the
runner's `W-SEQ-EXHAUSTION` evidence line, `C3-BRIEF.md:288` and
`C3-REPORT.md:97,105`. I read all three; they say the same thing.

**Do I agree the lane lead's rationale is a coherent position for the PM to rule
on? Yes — and I still do not accept it, which is the correct state for a
residual.** The position is coherent because it is falsifiable and self-consistent
on this build's own facts: DECISIONS:24 bounds offline writes "relative to a
reconciled authority"; the local era has no authority (`localEraConfig` sets
`online: false` and never a transport, and every inbound kind is refused before
verification); so a slot budget would count down with nothing able to refill it
and would eventually refuse Joe's own saves on a phone that has done nothing
wrong. That is a real cost, it is stated, and the alternative reading — that the
owner meant the budget to apply even with no authority in existence — is equally
available to the PM from the same sentence. Both readings are live; that is what
makes it a ruling rather than a bug.

What I will not do is treat "the rationale is coherent" as "the ruling is
satisfied". It is not: **half of a two-part bound is absent from the shipped
build**, and until the PM rules, the correct status of DECISIONS:24 in this lane
is PARTIALLY IMPLEMENTED, not implemented. The node case pins the absence exactly
(`range [1, 2**31−1]`, a checkpoint holding counts and never a budget, `sync`
empty), so a budget arriving later cannot land unnoticed. Filing it where it is
now filed — a residual against the owner's ruling, not a browser limit — is what
round 1 asked for and it is what shipped.

## NOTES FOR THE PM (not defects, nothing blocking)

1. **`--bite` cannot fail on the thing it measures.** 0-of-5 records
   NOT-PROVABLE-HERE and exits 0. That is the right call — a control firing at
   13 % would be a flaky gate, and a flaky gate is worse than the defect — but it
   means the bite can go quiet (a slower machine, a future Chromium) with no
   signal. The standing consequence is carried by the row's own WITNESS-ONLY text
   instead, which is durable in a way an exit code is not. Accepted as designed.
2. **The `3 reds in 20` figure excludes a fifth run known to have gone red.** The
   report says so in parentheses rather than rounding it in. The effect is that
   the published rate is *conservative*, which is the right direction to be wrong
   in. The summary line's "N controls as designed" also varies between 1 and 2
   depending on whether a red fired in that run; worth one clarifying clause.
3. **D4's byte-equality assertion is present and non-vacuous but I could not
   falsify it by mutation** — the origin is deliberately full at that moment, so
   no product-code path can write to the record during the window, which is
   itself why the assertion is safe. What I could verify: the digest is computed
   over live bytes (it differs run to run, `99388af2…` / `55a8f07b…` / `809f9edc…`,
   because `iv` and `ciphertext` are fresh per enrolment), and it is a real
   `assert.equal`, not a print. The `code` half I did falsify (item 7).
4. **The desktop-WebKit REQUEST still stands**, now recorded in the BRIEF's
   `W-IOS-SAFARI` row with the reason it was not taken (no install permitted).
   It remains the one cheap step between Chromium and the phone.
5. **The phone rows are still NOT RUN.** Unchanged, correctly, and every runner
   still says so.

## FILES REVIEWED AT `15da0ea` (sha256, verified on disk, all LF-only)

| file | sha256 | bytes |
|---|---|---|
| `rebuild/m3/w6/test/local-witnesses.mjs` | `f05b328121129fd683ae6303f96b37c782a3c5da195e3665a6679abdd595d400` | 47,040 |
| `rebuild/m3/w6/test/local-witnesses.test.mjs` | `0f61ff6709bce1152f91d910bd81cc2cf4ecef17e678aa46967d824a9a7243b5` (unchanged) | 14,217 |
| `rebuild/lanes/c/C3-BRIEF.md` | `b315b1a9c73e154f42fde54ec11a0633944fdabeeeba5a23844c1372da3e3af5` | 30,990 |
| `rebuild/lanes/c/C3-HAND-PROOF.md` | `91d423124fed20cba4dc927d3baf5c590c8884224e62259b85d879e5382d0312` | 10,393 |
| `rebuild/lanes/c/C3-REPORT.md` | `ec31c58708dfaf2f7abc569b2df3e6e02ae5198816d2194c20ea51517db8b79f` | 34,416 |
| `rebuild/m3/w6/bridge.mjs` (untouched, hashed before/after every bite) | `52371ccb6e8bd16b67ab87b0cc177af07bd40ae9c0632be9cbbbfb19c17e0a00` | 5,062 |

*Round 2 reviewed by execution and mutation on the owner's Windows PC,
2026-09-11: harness ×2, `--bite` ×3 (15 attempts), anchor-block test, four
re-mutations in a `%TEMP%` copy, `local-bite.cjs`, node subset and full suite.
The candidate was never edited; `git status --porcelain` shows only this file.*

**FINAL VERDICT: ACCEPT at 15da0ea**
