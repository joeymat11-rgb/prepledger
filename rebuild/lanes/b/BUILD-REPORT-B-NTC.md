# BUILD REPORT — B-NTC — qualified `nativeTrendContext` provider

---

## 0. POST-r1 FIX PASS — what this pass did, and every number it measured

`rebuild/lanes/b/reviews/B-NTC-REVIEW-r1.md` returned **ACCEPT WITH CHANGES**. This section
is the fixer's report; §§1–6 below are the original builder's, corrected in place where the
review found a wrong figure (each correction is marked).

**Environment:** same worktree
`…\work\lane-b\ntc`, branch `rebuild/lane-b-ntc`, reset to `origin/rebuild/lane-b-ntc`
@ `afb3bf4` (the review commit) before any edit. Node
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
**v24.19.0**. `node_modules` at root, `rebuild/m3/w6` and `rebuild/m3/w5` were already
installed from the builder's pass; **nothing was re-installed and `package-lock.json` was
never touched**. The frozen bundles in the gitignored `rebuild/conform/engines/` were already
present (`engine-main.cjs` 813 696 B, `engine-old.cjs` 792 806 B) — `build-engines.mjs` is
still Windows-broken (review F10, open item O8) and was not run.

### 0.1 C1–C5 (required) and C6–C9 (recommended)

| item | what was done | evidence |
|---|---|---|
| **C1** identity | the claim is **withdrawn** in all six places; the module now enforces and states **a content digest of the bound facts + `source_revision` + a unique `start_op_id`**, re-checked per request inside a scoped window. New refusal `bound_facts_digest_mismatch`. Two cells record that identity is NOT enforced and that the digest catches a moved object | brief §4.4, §1.4, §3, §4.1, §8 M10, §13 O3; module header; `workout-host.mjs` H3c comment |
| **C2** §9.1 + §0 headline | rewritten to the measurement: the product's own athlete carries **28 recorded sleep nights**, G1/G2/G3 marked **NOT OBSERVED**, G5 conditional on the Q1 ruling, §0 qualified | brief §0, §9.1, §12 Q1 |
| **C3** bind window | **fixed**, not just disclosed: `withFacts(facts, run)` (bind … finally RESTORE, re-entrant) added to the module, used by H3c, and put on the engine handle by the H6 patch so `gym-model.readPrevious()` runs inside a window. Measured both ways | brief §4.1, §9.1 G6; patch header |
| **C4** journey figure | corrected to **23/23 at head** (22/22 is the base figure). §3.4b below corrected | brief §7.3; §3.4b |
| **C5** O2 / §7.4 | corrected to "green inside `native-carriers-package.cjs --ci` (child `focused`, `# pass 15`); not runnable by a bare `node --test`" | brief §7.4, §13 O2 |
| **C6** `rushedOf` | reads **both** holders; a disagreement refuses `session_pace_disagreement`; cell added | brief §4.3 |
| **C7** `bind(null)` | now **throws**; clearing is `unbind()`; `bound()`'s live-object behaviour documented | brief §4.1; module header |
| **C8** spec slips | the contradicting note fixed; the artifact/review paths kept **with the reason** (`b-package.cjs:300-303` derives them); §2 byte count corrected **7 846 → 7 862** | `packages/B-NTC.json`; §2 |
| **C9** CI home | **not done — it is a PM item.** B-NTC touches no `.github` file by design | brief §13 O7 |

### 0.2 The S2 path (PM ruling pending; option A implemented and OFF)

`createDayFactsReader({ state, engine, mapRecordedDaysWithEnginePredicates })` — **default
`false`** — chooses between `createEmptyHistoryDayFacts` (today's proof over an empty
history) and `createEnginePredicateDayFacts` (the **engine's own** `dayWeather` /
`cleanAtDate`). The engine reader is used **only** when the option is on **and**
`enginePredicatesAvailable(engine)` is true at runtime; otherwise the existing
`recorded_sleep_unmapped` refusal stands unchanged. Nothing on the accepted tree exposes
those two predicates, so the committed behaviour is identical to before.

**The scratch proof.** A copy of this branch at
`C:\Users\joeym\AppData\Local\Temp\ntc-fix\scratch` (robocopy, `node_modules` junctioned,
`ledger/` and `rebuild/conform/private` deleted from the copy and never opened) with (i) the
H6 patch applied and (ii) an **env-gated widening of `EXPOSED`** in the scratch
`engine-runtime-host.cjs` only. Four arms, all driven through the product path
(`createGymHost` + `createGymModel`, encrypted `fake-indexeddb` store) on the athlete
`createTodayModel({}).stateFromOps()` with `sessionLog = {}` — **28 recorded nights,
0 events**:

```
ARM 1  option OFF, predicates ABSENT   (the shipped default)
  dayReader {"enginePredicates":false,"enginePredicatesAvailable":false,"optionRequested":false}
  day1 ready/closed 0->6 · day2 ready/closed 6->12
  day4 {"phase":"blocked","code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED","copy":"resolver_failed","ops":12}

ARM 2  option ON,  predicates ABSENT   (no re-seal yet)
  dayReader {"enginePredicates":false,"enginePredicatesAvailable":false,"optionRequested":true}
  day4 {"phase":"blocked","code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED","copy":"resolver_failed","ops":12}
        -- byte-for-byte the same refusal as ARM 1: never a silent downgrade

ARM 3  option ON,  predicates PRESENT  (scratch EXPOSED re-seal)
  dayReader {"enginePredicates":true,"enginePredicatesAvailable":true,"optionRequested":true}
  day4 {"phase":"ready","code":null,"copy":null,"ops":12}
  readPreviousSeam {"genSession":"ANSWERED","cards":2,"cardsWithPrev":2,"nativeSessionsInInput":2}
  day4Conducted {"probe":"ready","closed":true,"settled":"finished","before":12,"after":18}
        -- THE GYM CARD OPENS: Started, every set logged, closed. ops 12 -> 18

ARM 4  ARM 3 but with the ORIGINAL narrow bind window   (the F3 control)
  day4 {"phase":"ready", ...}   -- the day still opens
  readPreviousSeam {"genSession":"THREW","code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED",
                    "reason":"resolver_failed"}
  model.previous().size === 0   -- swallowed at gym-model.mjs:136; the card shows nothing
```

The scratch widening and the two scratch test files are **NOT committed** and are not
proposed as a diff: widening `EXPOSED` re-seals an accepted artifact and that is the PM's
decision (brief §12 Q1).

### 0.3 H6 as a patch file

`rebuild/lanes/b/ntc/gym-host.wiring.patch` (14 626 B, sha256
`91cf70bd75ec0b29d62f78e9b3a455835465909a14b2b2ca0b5828d30979a386`) — a prose header (custody,
the three corrections, the **measured** §9.1 table) followed by a unified diff against
`rebuild/m3/w7-preview/today/gym-host.mjs` at this branch tip.

```
$ git apply --check rebuild/lanes/b/ntc/gym-host.wiring.patch     -> exit 0
$ git apply        rebuild/lanes/b/ntc/gym-host.wiring.patch      -> exit 0
  applied file sha256 == scratch file sha256  -> True
$ git checkout -- rebuild/m3/w7-preview/today/gym-host.mjs        -> status for that path: []
```

**`gym-host.mjs` is NOT committed and is byte-identical to the tip on this branch.**
*(SUPERSEDED by §0.7 — the PM lifted lane C's licence for this one hunk in `DECISIONS:108`
(b), and the second fix pass applied it. The sentence above is true of the r1 fix pass only.)*

With the patch applied in the scratch copy:

| run | result |
|---|---|
| `node --test` over the five today test files **+ `ntc-h6-delta.test.mjs`** | **tests 129 · pass 129 · fail 0** (123 unchanged + 6 corrected A2 delta cells) |
| `node --test ntc-h6-reseal.test.mjs` (scratch-widened `EXPOSED` only) | **tests 4 · pass 4 · fail 0** — D5 day 4 opens and conducts 12→18; D6 previous performance present; D6-control previous EMPTY with the narrow window |
| `node rebuild/m3/w7-preview/today/build.mjs` | **`A1 TODAY BUILD PASS`: 3 assets; 84 pinned inputs (13 engine, 12 client); 2 pinned typefaces inlined; 3/3 assets free of any network reference** — so esbuild resolves the DEFAULT CJS import in the browser bundle |

### 0.4 Every gate re-run on the COMMITTED tree

| # | command | outcome |
|---|---|---|
| 0.4a | `node --test rebuild/m4/workout/test/native-trend-context.test.cjs` | **tests 36 · pass 36 · fail 0**, exit 0 (22 → 36; 14 new cells for C1/C3/C6/C7 and the S2 path) |
| 0.4b | `node --test …/journey.test.mjs …/engine-equivalence.test.cjs` | **tests 23 · pass 23 · fail 0**, exit 0 — unmoved by the H3c rewrite, step 17 still green, same diagnostic line |
| 0.4c | `node --test` over the five `rebuild/m3/w7-preview/today/test/*` files | **tests 123 · pass 123 · fail 0** — unchanged on the committed tree, as designed |
| 0.4d | `node rebuild/conform/v4/run-defect-laws.cjs` | `TOTAL 45 laws · **45 RED-frozen** · **39 RED-candidate** · 89 GREEN repair controls · 97/104 mutant executions DETECTED · **0 HARNESS_ERROR** · AUDIT RED-FIRST FAIL` — **45/39 unmoved** |
| 0.4e | `node rebuild/conform/run.cjs` on the candidate, then with all three modified tracked files stashed, then popped | both logs 84 lines, **sha256 `7EA1E04BBB2847738BCDC7793DA8365E3EAF59F849FC8BC54A355487EC58A37C` on BOTH**, `Compare-Object` → **0 differing rows**. Terminal line on both: `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`. `git status` identical before and after |
| 0.4f | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | `POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0…`, **13 children each `OBSERVED; exit 0 and exact declared verdict`**, terminal `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, **exit 0** (90.4 s) |

### 0.5 `b-package.cjs --ci --package B-NTC` — the honest lines (v1.1)

The runner was fetched from `origin/rebuild/lane-b-tooling` **@ `477b025`** with
`git archive` into `C:\Users\joeym\AppData\Local\Temp\ntc-fix\tooling`
(`b-package.cjs` 65 367 B, sha256
`6f69aa8ee6667f27b92166dd981ba9c15078f7e77fc2692130950a2ab8be2c3b`), copied into this
worktree, run, and **deleted again**. `git status --porcelain` afterwards lists no
`rebuild/lanes/b/tooling/b-package.cjs`.

That commit's usage line is `--ci|--full --package <B-NTC|B-LOM|B1|B2|B3|B4>`, so unlike
v1's measurement at `572a8c2` the id is **accepted by the guard**. What it then says:

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld
exit 1

$ node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld
exit 1

$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B1     (control, same tree)
B PACKAGE B1 FAIL; required evidence missing or failed; local diagnostics withheld
exit 1
```

> **CORRECTED at the r2 fix head (B-NTC-REVIEW-r2 R7 / change 7; `DECISIONS:113 (6)`).**
> The sentence that used to stand here — *"It is also not B-NTC-specific: the control
> package `B1` fails identically on the same tree"* — **is wrong twice over, and r2 was
> right to say so.** B1 does **not** fail identically, and its failure is **caused by
> B-NTC**. The two refusals are different assertions, and at the r2 fix head the runner
> names them on stderr (`TOOLING-REVIEW-r5` Z6):
>
> | package | named refusal | why |
> |---|---|---|
> | **B1**, **B2** | `PARENT-PIN-BROKEN rebuild/m4/workout/engine-runtime.cjs` | **because of B-NTC.** This child re-pins `engine-runtime.cjs` under `DECISIONS:109` PATH A; B1 and B2 still carry the parent's pre-image, so the pin they re-assert at run time no longer holds on this tree. |
> | **B3**, **B4**, **B-LOM** | `UNLISTED-SOURCE-CHANGE` naming the `b-ntc-*` sources | **because of B-NTC.** Their fidelity scan sees new files under `rebuild/m4/spec/` that their own product inventories do not list. |
> | **B-NTC** | its own open obligations — see the re-measured terminal below | not this failure at all. |
>
> **The cost is real and this package owns it.** B-NTC has made all five sibling lane-B
> packages unsealable until each re-pins. `DECISIONS:113 (6)` rules the remedy: each of B1,
> B2, B3, B4 and B-LOM re-takes `engine-runtime.cjs` (and any other child-superseded pin)
> and lists the `b-ntc-*` sources in its own spec **at its own rebase onto the B-NTC
> accepted head, recorded in its own brief**; no separate ledger line is needed.
> `DECISIONS:103 (1)` puts B1 next, so B1 pays this first. The obligation is stated in
> `BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` §v1.3 S.
>
> The `--ci`/`--full` terminals quoted above are also **superseded**: they were measured
> under the tooling as it stood before `TOOLING-REVIEW-r5`, when the successor mechanism was
> refused outright. See §0.5-r2 below for the terminals at this head.

**No PASS word is claimed, and the FAIL is reported as it happened.** The runner
requires an ACCEPTED envelope and a receipt chain that a **PROPOSED** package cannot have —
`brief.acceptedLedgerLine` is `null`, `tooling.runnerSha256` is `null`, every authorization
is `null`, and no `rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json` exists because
the PM writes it at acceptance. Diagnostics are withheld by the runner's own design, so no
finer statement is available to a builder. **`--full` reaches the same refusal**, which means
open item O4 (the standing `DECISIONS:97` BLOCKED-private line) is still not producible for
this package id; the parent gate's line (0.4f) remains the closest true statement.

Also found and recorded: `477b025` carries its **own** `rebuild/lanes/b/tooling/packages/B-NTC.json`
(21 159 B) beside the one this package committed (7 862 B). Two specs, one id — PM question
Q2, brief O9.

### 0.6 Boundaries honoured in this pass

* **Never opened:** `ledger/`, `rebuild/conform/private/` (both also removed from the scratch
  copy before anything ran in it).
* **Never edited:** `rebuild/engine/**`, `rebuild/conform/**`, `rebuild/m4/spec/**`,
  `.github/**`, `src/**`, `package.json`, `package-lock.json`, frozen laws/witnesses/tools/
  goldens, and **`rebuild/m3/w7-preview/today/gym-host.mjs`** (patched only in scratch, and
  once in this worktree to verify `git apply`, then restored — `git status` proves it).
* **Never touched:** any other worktree. No worktree was created, moved or removed; the
  tooling runner came from `git archive`, not from the sibling `…/work/lane-b/tooling`
  checkout.
* Files committed by this pass: `native-trend-context.cjs`, its test, `workout-host.mjs`,
  the brief, `packages/B-NTC.json`, and the new `rebuild/lanes/b/ntc/gym-host.wiring.patch`.

---

## 0.7 SECOND FIX PASS — THE WIRING APPLIED UNDER `DECISIONS:108` (b)

`DECISIONS:108` (b) **lifts lane C's licence for the ONE `gym-host.mjs` hunk**: "lane B
applies it on `rebuild/lane-b-ntc` with A2's 59 gym tests green; whichever of B-NTC / lane
C's one-store adapter merges second rebases onto the first". This section is that pass. It
is the ONLY part of this report written after the tip was merged in.

> **`DECISIONS:109` LANDED MID-PASS, AND THIS SECTION IS WRITTEN AGAINST IT.** The pass was
> dispatched under `:108` with the instruction "keep the option OFF by default (Q1 not yet
> ruled)". While it ran, the PM published **LANE B RULINGS 3**: Q1 = **PATH A**, implemented
> **inside** the M2-B-NTC child package (the child re-pins `engine-runtime.cjs` / the
> `EXPOSED` set and `rebuild.yml`; no separate NATIVE-CARRIERS re-seal), with the mapping as
> **shipped behaviour and no OFF option**, fail-closed per night; B-NTC must prove **both**
> (i) the fresh zero-night athlete opening day+3 of the same lift group and (ii) the 28-night
> product state with the mapping on; the `rebuild.yml` enumeration and the `# pass 19`
> retirement ride in the same seal; and **G7/O10 is routed to lane C's C4**, not to A2.
>
> What that means for this commit, stated plainly so nothing is assumed:
> * **Obligation (i) is DISCHARGED AND COMMITTED here**, in exactly the words `:109` uses —
>   delta cell **G5**: day+3 `READY`, started, every set logged, closed (§0.7c).
> * **Obligation (ii), removing the option, the `EXPOSED` / `engine-runtime.cjs` re-pin, the
>   `rebuild.yml` enumeration and the `# pass 19` retirement are NOT in this commit.** They
>   are the next B-NTC pass. This pass held `:108`'s boundary and touched no
>   `rebuild/m4/spec`, `.github` or `rebuild/engine` byte, which is what its licence allowed.
>   The option therefore remains `false` here; `:109` makes removing it the next pass's job,
>   not a reason to flip it inside a licence that did not cover the re-pin.
> * **G7/O10 is re-addressed to lane C**, and the unapplied hunk (§0.7e) already does what
>   `:109` asks of C4.

### 0.7a The merge (done FIRST, so the hunk lands on the current `gym-host.mjs`)

```
$ git fetch origin && git reset --hard origin/rebuild/lane-b-ntc   -> a701ac5
$ git merge origin/rebuild/t2-client-core                          -> 9f68d0a
  Merge made by the 'ort' strategy. 61 files changed, 15899 insertions(+), 78 deletions(-)
  NO CONFLICT — nothing to resolve, conservatively or otherwise.
  merge commit 93b23edb5c09073b4723a97368aa17c367ce6873
```

**The tip moved again while the gates ran**, so there are TWO merges, both clean:

```
$ git fetch origin  (the remote-tracking ref had already moved under a shared .git)
$ git merge origin/rebuild/t2-client-core                          -> e6b812e
  3 files changed, 4 insertions(+)   — DECISIONS.md line 109, STATUS.md, REQUESTS.md
  merge commit 6d61deb…
  ONE CONFLICT, in rebuild/lanes/REQUESTS.md ONLY, and only because both sides
  appended a line at end-of-file. RESOLVED CONSERVATIVELY: both the PM's two new
  lines and lane B's are kept, in that order; nothing was rewritten or dropped.
  No code file conflicted in either merge.
```

What came in: the CI re-seal (`DECISIONS:105`), lane C C1/C2/C2b/C3 (`:106`), slice A3
recovery check-in (`:107`), the `LANE B RULINGS 2` docs line (`:108`) and, in the second
merge, `LANE B RULINGS 3` (`:109`, the block above).
`git diff HEAD origin/rebuild/t2-client-core -- rebuild/m3/w7-preview/today/gym-host.mjs`
was **empty before the merge**: lane C's C1–C3 left `gym-host.mjs` byte-untouched exactly as
`DECISIONS:107` records, so the patch's context lines were still current and no hand-application
was needed.

### 0.7b The apply

```
$ git apply --check rebuild/lanes/b/ntc/gym-host.wiring.patch   -> exit 0
$ git apply        rebuild/lanes/b/ntc/gym-host.wiring.patch    -> exit 0
$ git diff --stat   -> rebuild/m3/w7-preview/today/gym-host.mjs | 64 ++++++---
                       1 file changed, 59 insertions(+), 5 deletions(-)
```

**The option stays OFF.** `mapRecordedDaysWithEnginePredicates` defaults to `false` and the
shipped page (`today-entry.mjs`) passes nothing, so PM question **Q1 is still open and is not
pre-empted by this pass**. `trendDayReader()` on every host built in this tree reports
`{enginePredicates:false, enginePredicatesAvailable:false, optionRequested:false}` — measured,
not assumed (delta cell G3).

### 0.7c The delta cells, now COMMITTED

`rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs` (**NEW**) — six cells, the six of the
patch's own §9.1 table, each measured on the merged tip with the option OFF:

| cell | claim | measured |
|---|---|---|
| **G1** | the product athlete's day+3 wall is UNCHANGED (`gym.test.mjs:621`) | `blocked` / `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed`, Start refused, ops stay 12. The athlete carries **28 recorded nights**, asserted in the cell |
| **G2** | every day after the wall is UNCHANGED (`gym.test.mjs:639`) | day+4,5,6,7,10,14 → the measured code sequence, history still reads, 2 sessions, ops 12 throughout |
| **G3** | `lastProducerRefusal()` UNCHANGED, and the composed reader says why (`gym.test.mjs:657`) | same code + reason; `trendDayReader()` all-false; `trendBinding.resolve` outside a window → `no_bound_source_facts` |
| **G5** | **A2's spike: day+3 on the SAME lift group no longer refuses** — the fresh-athlete path, option OFF | day+0 `ready`→closed ops 0→7; day+1 ops 7→12; day+2 `ENGINE_CAPTURE_NO_WORKOUT` (a rest day); **day+3 `ready`**, `lastProducerRefusal()` `null`, lift group `db-bench` ×2 = day+0's own; conducted end to end, **ops 12→19**, 3 durable sessions, none stranded |
| **G6** | previous performance survives the bind window (review r1 F3/C3) | `model.previous().size === 2`; each `prev` is the engine's own `earned/performed-lift/v1` record and its performed slots equal, value for value, the sets day+0 actually logged. Control: the same resolver outside a window refuses `no_bound_source_facts` |
| **G7/O10** | the printed "Last time" line is STILL absent — **A2 custody** | data present (`slots[0].fact.current.load.value` is a number, unit `lb`); `typeof prev.w === 'undefined'`; `view.previous === null`. See §0.7e |

**RED-FIRST, executed.** With `gym-host.mjs` reverted to the merge commit and the cell file
unchanged: **6 tests · 2 pass · 4 fail** — G3, G5, G6 and G7 are red without the wiring, and
G1/G2 stay green on both sides because "unchanged" is exactly what they claim. `gym-host.mjs`
was restored byte-for-byte afterwards (sha256 re-checked, `git status` verified).

### 0.7d Every gate, re-run on THIS tree (merge + wiring + cells)

| # | command | outcome |
|---|---|---|
| 0.7d-1 | `node --test …/today/test/gym.test.mjs` | **tests 59 · pass 59 · fail 0**, exit 0 — the condition `DECISIONS:108` (b) attaches to the licence |
| 0.7d-2 | `node --test` over the five today files **+ `ntc-h6-delta.test.mjs`** | **tests 129 · pass 129 · fail 0** — the PM's figure, reproduced on the merged tip |
| 0.7d-3 | the same **plus A3's `checkin.test.mjs`** (the merged tree's real today suite) | **tests 157 · pass 157 · fail 0** (151 = `DECISIONS:107`'s figure, + the 6 cells) |
| 0.7d-4 | `node --test …/journey.test.mjs …/engine-equivalence.test.cjs` | **tests 23 · pass 23 · fail 0**, exit 0 — unmoved |
| 0.7d-5 | `node --test rebuild/m4/workout/test/native-trend-context.test.cjs` | **tests 36 · pass 36 · fail 0**, exit 0 — unmoved |
| 0.7d-6 | `node rebuild/m3/w7-preview/today/build.mjs` | **`A1 TODAY BUILD PASS`**: 3 assets; **88** pinned inputs (13 engine, 12 client); 68 bound classes; 2 typefaces inlined; 3/3 assets free of any network reference. *(84 → 88 is A3's check-in modules arriving in the merge, not this hunk.)* esbuild resolves the DEFAULT CJS import in the browser bundle |
| 0.7d-7 | `node rebuild/conform/v4/run-defect-laws.cjs` | `TOTAL 45 laws · **45 RED-frozen** · **39 RED-candidate** · 89 GREEN repair controls · 97/104 mutant executions DETECTED · **0 HARNESS_ERROR** · AUDIT RED-FIRST FAIL` — **45/39 unmoved**, exit 1 as before |
| 0.7d-8 | `node rebuild/conform/run.cjs`, then again with the three paths held out of the tree, then restored | both runs **85 lines**, `Compare-Object` → **0 differing rows**; terminal line on both `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`. **Census identical**; `git status` identical before and after |
| 0.7d-9 | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | `POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=`**`e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a`** (the re-sealed artifact `DECISIONS:105` names), **13/13 children `OBSERVED; exit 0 and exact declared verdict`**, terminal `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, **exit 0** (89.2 s) |

### 0.7e G7 / O10 — written out, NOT applied

`DECISIONS:108` (b) lifts the licence for the `gym-host.mjs` hunk and names **no other file**.
`gym-model.mjs` is A2's, so this pass did **not** edit it. The fix is
`rebuild/lanes/b/ntc/gym-model.previousLine.patch` (`git apply --check` → **exit 0**), with the
measurement both ways taken in a temporary edit that was reverted before commit:

```
WITHOUT it   view.previous = null   for every set, on the day the provider opens
WITH it      db-bench set 1/2/3 -> "Last time: 35 lb x 8"
             lat-pulldown set 1 -> "Last time: 60 lb x 10"
             today suite + cells: 157 tests, 156 pass, 1 fail — the failure is delta cell G7
             itself, which locks the current absence on purpose; its positive replacement is
             written in the patch file
```

`git status` after the measurement lists `gym-model.mjs` as unmodified. The patch file carries
the REQUESTS line text verbatim for the PM to route.

### 0.7f Boundaries honoured in this pass

* **Never opened:** `ledger/`, `rebuild/conform/private/`.
* **Never edited:** `rebuild/engine/**`, `rebuild/conform/**`, `rebuild/m4/spec/**`,
  `.github/**` (including `rebuild.yml` — see the residual below), `src/**`, `package.json`,
  `package-lock.json`, frozen laws/witnesses/tools/goldens, **`gym-model.mjs`** and every other
  A2/A3/lane-C file. No other worktree was created, moved, removed or written to.
* **Files this pass commits (7, plus the two merges):**
  `rebuild/m3/w7-preview/today/gym-host.mjs`
  (the licensed hunk, 59 insertions / 5 deletions; 21 808 B,
  `e08481a29fba03da376930bd04334208b4dcc9b1819fe041a5ced14fb71254ab`);
  `rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs` (**NEW**, 19 697 B,
  `e423184f976c5c66ae629925b5020bec5cdfd10f25ffd259894fb6b161ef9106`);
  `rebuild/lanes/b/ntc/gym-model.previousLine.patch` (**NEW**, 9 480 B,
  `4b35c142e8fd6f20be6c4249c68962c78ab75f7a2dfdbd43db239f5238feeb7e`);
  `rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` (the §6 H6 STATUS block, the §7.5 and
  §9.1 notes, the O10 update — nothing withdrawn; 93 188 B,
  `60838907f0d205b1259ea9b0e1e4b76d48db5339409e314413280ed1140a8dd6`);
  `rebuild/lanes/b/tooling/packages/B-NTC.json` (**`brief.sha256` re-pinned to that hash**, and
  the parent pin RE-TAKEN at the merge as its own note said it would be: `295762f0…`/receipt 96
  → **`e940359b…`/receipt 104**, the value `DECISIONS:108` (e) CONFIRMS, verified against the
  artifact on disk in the merged tree. `product` stays byte-for-byte all-carried —
  `git diff 12cfdb9 origin/rebuild/t2-client-core -- rebuild/engine rebuild/conform
  rebuild/m4/workout rebuild/m3/w6/host` is EMPTY — and standing rule **X1** holds:
  `coverage.moves` is still `{}`); `rebuild/lanes/REQUESTS.md` (one appended line, the G7/O10
  ask). And this report.
* **`rebuild/lanes/b/ntc/gym-host.wiring.patch` is NOT edited** — it stays at 14 626 B /
  `91cf70bd…`, so the patch the PM read is the patch that landed, byte for byte.
* **RESIDUAL, unchanged and now larger:** `ntc-h6-delta.test.mjs` has **no CI home**. The
  A1/A2 step in `.github/workflows/rebuild.yml:89` enumerates five files by name and that file
  is pinned by the accepted `M2-NATIVE-CARRIERS` artifact, so adding a sixth is a re-seal, not
  a lane-B edit. It joins A3's `checkin.test.mjs` (`DECISIONS:107` SEAMS) and review r1's **C9**
  in the next batched re-seal — **which `DECISIONS:109` has now placed inside B-NTC's own seal**
  ("enumerate `rebuild/m3/w7-preview/today/test/checkin.test.mjs` (and any today/gym test files
  not yet listed) in `rebuild.yml`, and retire the old memory-only w7-preview child (`# pass
  19`)"). `ntc-h6-delta.test.mjs` is precisely one of the "not yet listed" files, so the next
  pass must enumerate it.
* **RESIDUAL:** `DECISIONS:108` (b) says whichever of B-NTC / lane C's one-store adapter merges
  second rebases onto the first. This branch now carries the hunk; if lane C's adapter merges
  first, it rebases — the hunk is local and does not touch the causal-frontier block lane C
  will move (patch header, "Apply").
* **RESIDUAL, and now RULED:** PM question **Q1**. The option is OFF in this commit, so B-NTC
  still does not open the **product's own** 28-night athlete. What §0.7c G5 proves is narrower
  and exactly what `DECISIONS:108` (a) asked to be proven: the **fresh** athlete's day+3 no
  longer refuses, without any `EXPOSED` widening, because a fresh athlete has no recorded
  night to map. **`DECISIONS:109` then ruled Q1 = PATH A**: the mapping becomes shipped
  behaviour with **no option at all**, the child package re-pins `engine-runtime.cjs` /
  `EXPOSED`, and the 28-night state must be proven too. That is the next pass's work and is
  named as such here so no reader mistakes this commit for it. `:109`'s obligation (i) is the
  one this commit discharges.
* **RESIDUAL, unowned (review r1 O1):** nothing in the product writes `w` back for a native
  athlete, so the G5 fixture sets one working load per lift from each lift's own declared
  `steps` and says so in the file. Until that is routed, which REAL days reach this seam is
  still unknown.

---

Lane B builder (Opus), lane B. **Speculative until reviewed.** Every command below was run on
the owner's PC (Windows, PowerShell / cmd) in the worktree
`C:\Users\joeym\Documents\Codex\2026-09-04\read-rebuild-t3-brief-md-and\work\lane-b\ntc`,
branch `rebuild/lane-b-ntc`, with
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
(**Node v24.19.0**). Outcomes are recorded as they happened, failures included.

**Base:** `origin/rebuild/t2-client-core` @ `12cfdb9d58fbcab10faacdaff8ef886ca79ab9c2`
(the tip `DECISIONS:103` names). **Brief:**
`rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md`.

---

## 1. Setup

| # | command | outcome |
|---|---|---|
| 1.1 | `git -C <design-pin> fetch origin` + `git rev-parse origin/rebuild/t2-client-core` | `12cfdb9d58fbcab10faacdaff8ef886ca79ab9c2` — matches the ruled tip |
| 1.2 | `git -C <design-pin> worktree add …/work/lane-b/ntc -b rebuild/lane-b-ntc origin/rebuild/t2-client-core` | OK — `HEAD is now at 12cfdb9` |
| 1.3 | `npm ci --include=dev` (root) | OK — 44 packages. **`package.json` / `package-lock.json` never committed** |
| 1.4 | `npm i --no-save --no-package-lock fake-indexeddb` | **wrong turn, recorded:** it removed 41 packages (re-resolved from `package.json` alone). Undone by re-running `npm ci --include=dev`; `git status package.json package-lock.json` clean afterwards |
| 1.5 | `cd rebuild/m3/w6 && set NODE_ENV= && npx pnpm@9 install --frozen-lockfile` | `+ @noble/ciphers 2.4.0`, `+ @noble/hashes 2.2.0`, `+ esbuild 0.28.1`, `+ fake-indexeddb 6.2.5`, `+ playwright-core 1.62.1`. **First attempt without clearing `NODE_ENV` printed `devDependencies: skipped because NODE_ENV is set to production`** — the exact F-G2 finding in `DECISIONS:105` |
| 1.6 | `cd rebuild/m3/w5 && set NODE_ENV= && npx pnpm@9 install --frozen-lockfile --ignore-scripts --ignore-workspace` | `+ esbuild 0.28.1`, `+ wrangler 4.129.0` |
| 1.7 | `node rebuild/conform/engines/build-engines.mjs <root>` | **FAILED** on Windows: `ERR_UNSUPPORTED_ESM_URL_SCHEME` — the script `import()`s `path.join(root,"node_modules/esbuild/lib/main.js")` as a bare Windows path. Pre-existing tool limitation, not touched |
| 1.8 | workaround: copied the already-built frozen bundles from the sibling lane-B worktree (read-only) | `engine-main.cjs` 813 696 B sha256 `0810d9b43e1ed3f286521ae6d8ffd306f55860056daf9836d1c42dc6221a3d69`; `engine-old.cjs` 792 806 B sha256 `9060d7dc36ede09e390217968a393c776034528ee1836ee9780f3ee46848b261`. `rebuild/conform/engines/` is gitignored; nothing committed. The `$TMPDIR/earned-engine-wt/{main,old}` worktrees already stood at `fe516c1` / `a0009c3`; **no worktree was created, moved or removed by this build** |

---

## 2. What was written

| file | change | bytes | sha256 |
|---|---|---|---|
| `rebuild/m4/workout/native-trend-context.cjs` | **NEW** — the provider | 12 375 | `cf8b50955ad0dca5ff91e528ae0abc48611cebeadc586e2759ec0ec587c22356` |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` | **NEW** — 22 cells | 13 164 | `f0879ca2b6d2fd65cb125d2d013e64efd89f236a4893dcec7245bf460dc52559` |
| `rebuild/m3/w6/host/workout-host.mjs` | 3 additive hunks (optional `nativeTrendBinding`) | 12 000 → 13 409 | `4029a5404cd34aac56da0af89c4ae6e0e2868353ab758d0f778c9d9f29190a8b` → `2d160c1c79fd7957febe964db523bc53dbb9a32fa571895f30e1a279a77fc480` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | 1 import + new step 17; steps 1–16 unmodified | 27 838 → 37 419 | `57566afd36ea913da4b9eaeed8f7a358479381606a9b6f92fc5e562d85d58cda` (the sha `DECISIONS:98` pins) → `d4c68645474eb8f6b4acbd252b35b9f0ca31225f6269fea53416a8c8a712af96` |
| `rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` | **NEW** | 56 010 | `0ba59cca3bd70383330fa59a4ae86a971108a64594933d5c6388bca6c45e16b8` |
| `rebuild/lanes/b/tooling/packages/B-NTC.json` | **NEW** (allowed by `DECISIONS:103` (4)); its `brief.sha256` is the brief hash on the row above | **7 862** *(review r1 C8/F8: this row said 7 846; the sha256 matched, so the byte count was the slip — corrected)* | `b0aec30912f67de1d88e174ab3be86c62ee68833d117d883cfb025ecf14601b4` |
| `rebuild/lanes/b/BUILD-REPORT-B-NTC.md` | **NEW** — this file | — | — |

**AFTER THE r1 FIX PASS (§0), the same files on disk:**

| file | bytes | sha256 |
|---|---|---|
| `rebuild/m4/workout/native-trend-context.cjs` | 25 319 | `7f34754fcada67a0403315c22bf66724cdcbdca5052e8e8f16f789fdb012054a` |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` (**36 cells**) | 29 437 | `443448d0643b32416a92b63af91d1ad8d75bd5e3571ca33086bc94851748e14d` |
| `rebuild/m3/w6/host/workout-host.mjs` | 14 536 | `262d7d5f65e736bb2592da6cd2f4bf883f30842d4dbbec97653b610e5f79d6fe` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | 37 419 | `d4c68645474eb8f6b4acbd252b35b9f0ca31225f6269fea53416a8c8a712af96` — **unchanged by the fix pass** |
| `rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` (**v1.1**) | 88 089 | `3e8fa02ba58fafea3cb12c40f46c2bed3ff91500e4436330b660cb947828df3c` |
| `rebuild/lanes/b/ntc/gym-host.wiring.patch` (**NEW**) | 14 626 | `91cf70bd75ec0b29d62f78e9b3a455835465909a14b2b2ca0b5828d30979a386` |
| `rebuild/lanes/b/tooling/packages/B-NTC.json` (re-pinned to the v1.1 brief hash; `product` / `coverage` / `parent` unchanged) | 9 225 | `e9b1603c9545cabfa01a9af4d28c339bce60a730f79881c5a166645994455b86` |

Unchanged pins re-verified on disk after the fix pass: `rebuild/engine/performed.cjs`
`2372e66b…` (19 479 B) and `rebuild/m4/workout/engine-runtime.cjs` `9be21897…` (3 947 B).

**Not touched, verified:** anything under `rebuild/engine`, `rebuild/conform`,
`rebuild/m4/spec`, `.github`, `src`, `ledger`, `rebuild/conform/private`,
`rebuild/m3/w7-preview/today`. `git status --short` before commit listed exactly the seven
paths above plus the gitignored `.tmp-ntc/` scratch.

**Unchanged pins re-verified on disk at the package head:**
`rebuild/engine/performed.cjs` `2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a` ·
`rebuild/m4/workout/engine-runtime.cjs` `9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23` ·
`rebuild/m4/spec/acceptance-native-carriers.json` `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` ·
`rebuild/m4/spec/NATIVE-CARRIERS-THEME.md` `9de320a80acf5bb11da59f552bd885b2e162b7c0a842bdc6c569198caef39173` ·
**all 20 files the parent artifact pins in its `product` map: 20/20 byte-identical on disk**
(printed by the spec generator).

---

## 3. Evidence — every gate run, and its outcome

### 3.1 v4 register laws — 45 RED-frozen / 39 RED-candidate, no law moves

```
$ node rebuild/conform/v4/run-defect-laws.cjs
TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

**Expected 45 / 39 — measured 45 / 39, 0 HARNESS_ERROR. No row moves.**
(A first run before §1.8 returned `0 RED-frozen · 39 RED-candidate · 142 HARNESS_ERROR`
because the frozen bundle was absent; that is the harness, not the laws, and it is recorded
here rather than dropped.)

### 3.2 Public conformance census — byte-identical to base

```
$ node rebuild/conform/run.cjs                                  # candidate
… SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
$ git stash push -- rebuild/m3/w6/host/workout-host.mjs         # restore base
$ node rebuild/conform/run.cjs                                  # base
$ git stash pop
```

| log | sha256 |
|---|---|
| candidate | `CAAB2293006821770F0F6E27909A16D474066CCEB0FEF2C022478F0817C5604E` |
| base | `CAAB2293006821770F0F6E27909A16D474066CCEB0FEF2C022478F0817C5604E` |

`Compare-Object base candidate` → **no differences. IDENTICAL.** The 99/141/70 figures match
`DECISIONS:93`. The `BAD 7` (privacy, 0 private lines), `BAD 8` (gate artifacts) and
`BAD 8` (coverage) rows stand identically on both trees — they are the known
private-fixture rows on a builder machine.

### 3.3 The parent package gate — PASS, second gate included

```
$ node rebuild/m4/spec/native-carriers-package.cjs --ci
POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1
… 13 children, each "OBSERVED; exit 0 and exact declared verdict", including second-gate
NATIVE CARRIERS PUBLIC CI EVIDENCE PASS; the inherited full gate matrix, the private oracle, all FULL gates and independent acceptance remain separate
exit 0   (86.98 s)
```

A first attempt returned `NATIVE CARRIERS PACKAGE BLOCKED BASELINE-ESBUILD-MISSING`, caused
by the §1.4 wrong turn having removed root `esbuild`; re-running `npm ci --include=dev`
fixed it. Recorded because a BLOCKED line must never be quietly re-rolled.

### 3.4 Test suites

| # | command | outcome |
|---|---|---|
| 3.4a | `node --test rebuild/m4/workout/test/native-trend-context.test.cjs` | **22 tests, 22 pass, 0 fail** |
| 3.4b | `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | **CORRECTED (review r1 C4/F4): 23 tests, 23 pass, 0 fail** at the package head — 17 journey steps + 5 equivalence + the suite node, which `node --test` counts. This row originally said 22/22; **22/22 is the BASE figure** (`DECISIONS:102`, 16 `await t.test(` calls at `12cfdb9`). Both are stated so no later reader concludes a test vanished. Re-measured after the r1 fix pass: still 23/23. Step 17 diagnostic: `day two: asked=1 prepared=undefined code=WORKOUT_PREPARATION_INVALID producer={"code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED","reason":"resolver_failed",…}` |
| 3.4c | `node --test rebuild/m3/w7-preview/today/test/{adapter,view,design,package,gym}` | **123 tests, 123 pass, 0 fail** — A1/A2 unchanged, as designed (the gym card is not wired by this package) |
| 3.4d | `node --test rebuild/m4/workout/test/{schema,engine-capture,engine-history,engine-order,context-history,source-control,configuration-capture,history-panel,native-trend-context}` | **62 tests, 56 pass, 6 fail.** All six live in the three files that `throw Error('Explicit retained PERFORMED_W6_DIR required')` at require time — `engine-history.test.cjs`, `history-panel.test.cjs`, `source-control.test.cjs`. Environmental, pre-existing, and B-NTC touches nothing they read |
| 3.4e | `node --test rebuild/m4/workout/test/native-next-targets{,-assembly,-correction}.test.cjs` | **BLOCKED by a bare `node --test`.** `Error: Cannot find module '../../../../test-support/import-engine/rebuild/m3/w7-preview/fixtures.cjs'` — they need `EARNED_NATIVE_PACKET_ROOT` + a `test-support/import-engine/` tree that does not exist in this repository. **CORRECTED (review r1 C5/F5): they DO run and DO pass inside `native-carriers-package.cjs --ci`** — the gate's `focused` child is exactly those three files asserting `# pass 15` (`native-carriers-package.cjs:61-64`) and it reported `OBSERVED; exit 0 and exact declared verdict` in §3.3, in the reviewer's re-run and in §0.4f. The original "could not be run / claims nothing about them" was overstated |

### 3.5 The journey step that had to be built three times — recorded in full

Step 17 is the only end-to-end proof that the wall is real and that this provider removes it,
and it took three shapes before it was true. All three are recorded because the first two are
findings, not noise:

1. **over the journey's own repository** → `WORKOUT_HISTORY_RECONCILIATION_REQUIRED`: step 12
   leaves an open, unclosed session. Fixed by giving step 17 its own `scaffold()`.
2. **one conducted day, one lift, clean-init state** → `asked=0`, the day **prepared**. The
   resolver was never called.
3. **two conducted days, every slot, clean-init state** → `asked=0` again.

The cause is a real property of A0's fixture, not of this package: `createCleanInitState`
writes `w: null` on every exercise, `rebuild/engine/today.cjs` `genSession` reads that as a
permanent DEBUT, and a DEBUT never reaches `liftTrend`. That is why A0-REPORT could only say
the containment path was *"not exercised end to end"*. Step 17 therefore states one fact
explicitly in the test and in a comment — **one lift carries a working load from its own
declared `steps`** (`db-bench.w = 35`) — and then `asked=1` and the wall appears. A2 does not
hit this because it uses `today.stateFromOps()`, a seeded Joe-shaped state. **Open item O1.**

### 3.6 `b-package.cjs --ci --package B-NTC` — the honest lines (v1 pass; **v1.1's run is §0.5**)

The accepted runner is on `rebuild/lane-b-tooling` @ `572a8c2`, not on this branch. It was
copied into the worktree, run, then **deleted without ever being committed** (`git status`
after the run showed no `rebuild/lanes/b/tooling/b-package.cjs`):

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4
exit 1

$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B1          # control, same tree
B PACKAGE B1 FAIL; required evidence missing or failed; local diagnostics withheld
exit 1
```

**Exit 1, one line, no PASS word.** That is the runner behaving exactly as its README
specifies (*"Two modes, no third. Anything else refuses in one line with exit 1"*), and
B-NTC does not work around it: widening the package list is a change to the runner, whose
bytes are pinned by each spec's `tooling.runnerSha256` and re-verified in Git. **PM question
Q2 in the brief.**

`--full` refuses at the same usage guard, **before** the private-fixture check, so the
standing `DECISIONS:97` rule (every builder runs `--full` without the private fixture and
reports `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`) **could not be satisfied for the
package id `B-NTC`**. Recorded as open item O4 rather than substituted with a different
run's line. `rebuild/conform/private` was never opened, and no private value, count, hash or
prose appears anywhere in this package.

---

## 4. Scope discipline

* **Never opened:** `ledger/`, `rebuild/conform/private/`.
* **Never edited:** frozen laws, witnesses, tools, goldens, the oracle, `rebuild/engine/**`,
  `rebuild/conform/**`, `rebuild/m4/spec/**`, `.github/**`, `src/**`, `package-lock.json`.
* **Never touched:** any other worktree. The two `earned-engine-wt` worktrees already existed
  at the commits the builder needs; the frozen bundles were **read** from a sibling lane-B
  worktree and copied into this one's gitignored `rebuild/conform/engines/`.
* **Deliberately NOT edited, with a reason:** `rebuild/m3/w7-preview/today/gym-host.mjs` and
  `gym.test.mjs` — `DECISIONS:106` (b) gives lane C an explicit licence to edit the former,
  and the latter is A2 custody. The exact one-line wiring and the three delta cells are
  written out in the brief §6 H6 and §9.1 instead. **Consequence, stated plainly: the gym
  card still hits the wall on this branch. B-NTC delivers and proves the provider; one line
  in A-lane/lane-C custody turns it on.**

## 5. Upstream drift during the pass

`origin/rebuild/t2-client-core` advanced 34 commits to `da63053` (ledger 104–106) while this
was being built.

```
$ git diff --name-only 12cfdb9 da63053 -- rebuild/engine rebuild/conform
(nothing)
$ git diff --name-only 12cfdb9 da63053 -- rebuild/m4/workout rebuild/m3/w6/host rebuild/m3/w7-preview/today
(nothing)
$ git diff --name-only 12cfdb9 da63053 -- rebuild/m4/spec
rebuild/m4/spec/NATIVE-CARRIERS-BUILD-REPORT.md
rebuild/m4/spec/NATIVE-CARRIERS-THEME.md
rebuild/m4/spec/acceptance-native-carriers.json
rebuild/m4/spec/review-native-carriers.json
```

Parent artifact: `295762f0…` at `12cfdb9` → `e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a`
at `da63053` (the CI re-seal, receipt `DECISIONS:104`, product/coverage/gates/authorizations
byte-identical). **Every hunk applies unchanged at the new tip**; the rebase and the parent
re-pin are real work before merge. Also: the batched `rebuild.yml` re-seal item ruling (5)
told the first package to carry is **already closed** by `DECISIONS:105`, so B-NTC carries no
`rebuild.yml` change — a deliberate scope reduction, not an omission.

## 6. Verdict

**v1 (the builder's):** Evidence complete for a **PROPOSED** package: 45/39 laws unmoved,
census byte-identical, parent gate PASS with the second gate, 22/22 provider cells, 22/22 A0
journey including the new end-to-end proof, 123/123 screens. *(The journey figure is
corrected to 23/23 at head — §3.4b.)*

**v1.1 (after review r1 — §0):** C1–C5 applied, C6–C8 applied, C9 left as the PM item it is.
The measured state of the tree now:

* **36/36** provider cells · **23/23** A0 journey + equivalence · **123/123** today/gym,
  unchanged on the committed tree
* **45 RED-frozen / 39 RED-candidate**, 0 HARNESS_ERROR — unmoved
* census **byte-identical** to base (same sha256 on both runs, 0 differing rows)
* `native-carriers-package.cjs --ci` → **PASS, exit 0**, 13/13 children OBSERVED
* `b-package.cjs --ci --package B-NTC` @ tooling `477b025` → **`B PACKAGE B-NTC FAIL;
  required evidence missing or failed; local diagnostics withheld`, exit 1** — the same line
  the control package `B1` gets on the same tree, because a PROPOSED package has no accepted
  envelope. **No PASS word is claimed for B-NTC.**
* H6 as a patch: `git apply --check` **exit 0**; applied in scratch → **129/129** today suite
  (123 + 6 delta cells), `A1 TODAY BUILD PASS`; `gym-host.mjs` **not committed**
* the S2 path: **implemented, OFF by default, inert on this tree**, and proven in scratch to
  open the 28-night athlete's day 4 (ops 12 → 18) only with the option on *and* a widened
  `EXPOSED` — which is the PM's ruling to make (brief §12 Q1)

Open items O1–O10 and PM questions Q1–Q4 are in the brief. **Still speculative; still
PROPOSED; nothing merged.**

---

# POST-:109 PASS — PATH A APPLIED: THE OPTION IS GONE AND THE 28-NIGHT ATHLETE OPENS

*Builder: lane-b-builder2 (not the B-NTC author, not its reviewer). Everything in this
section was MEASURED on this branch. Where a gate refuses, the refusal is quoted verbatim
and attributed, never summarised into a verdict it does not carry.*

## P.0 What DECISIONS:109 asked for, and what this pass did with each clause

| :109 clause | state |
|---|---|
| map recorded sleep through the engine's OWN predicates, never a re-implementation | **DONE** — `engine.dayWeather` / `engine.cleanAtDate` are the only executable uses of either name in the provider (P.2) |
| implemented INSIDE the M2-B-NTC package; the child re-pins `engine-runtime.cjs` / `EXPOSED`; no separate parent re-seal | **DONE** — P.1; the parent's own profile now refuses, quoted at P.5 |
| prove (i) the FRESH zero-night athlete opens day+3 | **HOLDS** — already discharged at `d78aff4`; re-measured here through the SAME reader (P.3) |
| prove (ii) the 28-night product state opens the day | **DONE** — P.3, the whole day conducted, ops 12 → 18 |
| remove the option as an option | **DONE** — P.2 |
| `rebuild.yml` enumerates `checkin.test.mjs` + any unlisted today/gym test files | **DONE** — P.4 |
| retire the old memory-only w7-preview child (`# pass 19`) + its CI step, successor named | **WRITTEN, NOT APPLIED** — a real verified diff at `rebuild/lanes/b/ntc/pass19-retirement.patch`; reasons in that file's header and at P.7 |
| Y1 (TOOLING-REVIEW-r4): a no-register-id package must REQUIRE its own children | **PARTLY** — six children declared, one of them executing this package's own `role:"new"` file; the journey and gym/today suites CANNOT be declared against the runner as it stands (P.6, a STOP) |

## P.1 How `EXPOSED` was widened, and how it was re-pinned

| file:line | before | after |
|---|---|---|
| `rebuild/m4/workout/engine-runtime.cjs:30` | `Object.freeze(['genSession','rirPlan'])` | `Object.freeze(['genSession','rirPlan','dayWeather','cleanAtDate'])` |
| `rebuild/m4/workout/engine-runtime.cjs:57-58` | returns `{genSession, rirPlan}` | returns those two **plus** `dayWeather:(s,iso)=>E.dayWeather(s,iso)` and `cleanAtDate:(s,iso)=>E.cleanAtDate(s,iso)` |
| `rebuild/m3/w6/host/engine-runtime-host.cjs:45` | the same two names (the bundleable mirror) | the same four names |
| `rebuild/m3/w6/host/engine-runtime-host.cjs:107-108` | returns `{genSession, rirPlan}` | the same four forwarders |

The list alone would have changed nothing: both runtimes return an explicit frozen object
rather than `E`, so the forwarders are what actually widen the surface. `E` itself still
never leaves either function, and `COMPOSITION.absent`, `COMPOSITION.forbiddenImports` and
the `absentProvider` traps are untouched.

**No `rebuild/engine/*` byte moved.** Both predicates are readers the engine already
composes (`sleep.cjs:1872`, `sleep.cjs:1017`, both returned by the sleep factory at
`sleep.cjs:1957`) and both are already reached from inside `genSession`'s own closed graph.

**The re-pin, as a child supersession.** `engine-runtime.cjs` is pinned by the accepted
M2-NATIVE-CARRIERS artifact in its `executionPins` (`9be21897…`). The parent profile is
left byte-for-byte intact and therefore refuses; the child carries the new bytes. Three
places record the new pin:

* `rebuild/m3/w6/host/test/journey.test.mjs:54` and `:367` — the two sha256 byte pins,
  re-pinned once, with the reason in the step-14 comment. A new assertion on
  `COMPOSITION.exposed` was added so the surface is stated, not only its bytes.
* `rebuild/lanes/b/tooling/packages/B-NTC.json` — `product[]` now declares
  `rebuild/m4/workout/engine-runtime.cjs` and `.github/workflows/rebuild.yml` with
  `role: "edited"`, `pre` = the parent pin, `post` = the new bytes. That declaration is
  what `b-package.cjs:419 held()` reads as "superseded" (P.6).
* `protectedSurfaces[]` in the same spec, in words.

## P.2 The option is removed as an option — and there is no re-implementation

* `createDayFactsReader({state, engine})` takes **no flag**; it returns
  `createEnginePredicateDayFacts(...)` or **throws**. `createGymHost` no longer accepts
  `mapRecordedDaysWithEnginePredicates`, and the handle no longer reports
  `optionRequested` (a reader that says "the option was off" is still a tree with an
  option in it).
* **Fail-closed at composition:** a runtime without both predicates is refused by name,
  never downgraded to the empty-history reader. A silent downgrade is indistinguishable
  from the shipped behaviour for a fresh athlete, so it could hide a narrow `EXPOSED`.
* **Fail-closed per day:** a predicate that throws, is unreadable, or answers with a
  non-boolean refuses THAT DAY by name. A caught exception is never read as false —
  deliberately stricter than `progression.cjs:702,704`.

**The grep, run on this tree.** The only executable occurrences of either predicate name
in `rebuild/m4/workout/native-trend-context.cjs` are:

```
native-trend-context.cjs:321      try { weather = engine.dayWeather(state, iso); }
native-trend-context.cjs:326      try { clean = engine.cleanAtDate(state, iso); }
```

Every other occurrence in that file is a comment citing the engine's own line numbers. No
`hardSession` computation, no `nightsBefore`, no halo arithmetic anywhere under
`rebuild/m4/workout`, `rebuild/m3/w7-preview` or `rebuild/m3/w6/host`.

## P.3 Both obligations, measured

### (ii) — the 28-night product athlete, `createTodayModel({}).stateFromOps()`

28 recorded sleep nights, 0 events: the state `today-entry.mjs:26` and `gym.test.mjs` both
hand to `createGymHost`.

| | at `d78aff4` | now |
|---|---|---|
| day+3 probe | `blocked` · `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` · `resolver_failed` | **`ready`**, no code, `lastProducerRefusal() === null`, lift group `demo-press` (2 lifts) = day+0's own |
| day+3 conducted | not reachable | **Started · all 4 sets logged · closed · `settled: finished`** |
| ops | 12 (a refused day wrote nothing) | **12 → 18** |
| durable sessions | 2 | **3**, none stranded; `previous()` carries both of day+3's lifts |
| days +4 / +7 / +10 / +14 | `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` ×4 | **`ready`** ×4 |
| days +5 / +6 | `ENGINE_CAPTURE_NO_WORKOUT` | `ENGINE_CAPTURE_NO_WORKOUT` (unchanged — the split gives no workout) |
| `trendDayReader()` | `{enginePredicates:false, enginePredicatesAvailable:false, optionRequested:false}` | `{enginePredicates:true, enginePredicatesAvailable:true}` |

Cells: `ntc-h6-delta.test.mjs` **G1** (the wall is gone), **G2** (the days after it — and an
explicit assertion that not one of the six refuses for want of a trend context), **G3**
(the composed reader, and that `optionRequested` is absent rather than false), **G4** (the
whole day conducted, 12 → 18). Provider-level: "OBLIGATION (ii), at the provider" and
"the ENGINE accepts the mapped answer for an athlete with 28 recorded nights".

### (i) — the fresh zero-night athlete, `createCleanInitState`

**Unchanged in outcome, and that is the point.** At `d78aff4` cell G5 was discharged by the
empty-history reader; here it is discharged by the **same engine predicates the 28-night
athlete gets**, because `cleanAtDate` returns `true` on its own first line for an empty
nights list and `dayWeather` produces no `k:"event"` flag for an empty events list. Day+3
on day+0's own lift group: `ready` → Started → every set logged → closed, **ops 12 → 19**,
three durable sessions, previous performance intact (G6). One reader, both athletes — so
the fresh case is not proven by a mechanism that differs from the one that ships. The
provider cell "OBLIGATION (i) rides the SAME code path" asserts the same equality directly
against `ENGINE.dayWeather` / `ENGINE.cleanAtDate`.

## P.4 Gates on the committed tree

| gate | result |
|---|---|
| `node --test` over the five today files + `ntc-h6-delta.test.mjs` | **tests 130 · pass 130 · fail 0** (129 → 130: cell G4 is new) |
| the same **plus** A3's `checkin.test.mjs` | **tests 158 · pass 158 · fail 0** (157 → 158) |
| `node --test .../today/test/gym.test.mjs` | **tests 59 · pass 59 · fail 0** — unmoved |
| `node --test journey.test.mjs engine-equivalence.test.cjs` | **tests 23 · pass 23 · fail 0** |
| `node --test .../m4/workout/test/native-trend-context.test.cjs` | **tests 39 · pass 39 · fail 0** (36 → 39) |
| `node rebuild/m3/w7-preview/today/build.mjs` | **`A1 TODAY BUILD PASS`**: 3 assets; 88 pinned inputs (13 engine, 12 client); 68 bound classes; 2 typefaces inlined; 3/3 assets free of any network reference |
| `node rebuild/conform/v4/run-defect-laws.cjs` | `TOTAL 45 laws · **45 RED-frozen** · **39 RED-candidate** · 89 GREEN repair controls · 97/104 mutant executions DETECTED · **0 HARNESS_ERROR** · AUDIT RED-FIRST FAIL` — **45/39 unmoved**, exit 1 as before |
| `node rebuild/conform/run.cjs` | 81 lines, sha256 `68A07DDB77930E1FD6C83C8B54FF33ABF12F584B265E7EEFE133C0D5B47EC2BC` — **byte-identical to the pre-change run on the same tree**; terminal line `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families` |
| `.github/workflows/rebuild.yml` | the A1/A2 step becomes A1/A2/A3 and enumerates **seven** files: `adapter`, `checkin`, `design`, `gym`, `ntc-h6-delta`, `package`, `view`. Both additions had **no CI home at all** before. Structure re-checked: 17 steps, 0 tabs, indentation unchanged |

**Baselines were taken BEFORE any edit, on the same tree**, so "unmoved" and
"byte-identical" are comparisons, not recollections: v4 read 45/39/0 and the census read
the same 81 lines and the same sha256 before the first file was touched.

## P.5 `native-carriers --ci` — THE PARENT REFUSES, AND THAT IS THE DESIGN

```
$ node rebuild/m4/spec/native-carriers-package.cjs --ci
NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld
exit 1
```

The wrapper withholds diagnostics by design. The named assertion behind that line, obtained
by calling `Profile.verify()` directly on this tree:

```
Adopted support bytes: rebuild/m4/workout/engine-runtime.cjs
+ actual - expected

+ 'c03732e896a9596a06edd304bb8f23f2340c29b5e036043a4205f225916be936'
- '9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23'
```

(`rebuild/m4/spec/native-carriers-source.cjs:106`, reached from
`native-carriers-profile.cjs`.) **This is the expected result, not a regression.**
DECISIONS:109: *"a child package supersedes its parent's execution pins … no separate
parent re-seal is needed or wanted."* The parent's profile is left byte-for-byte intact —
this pass changed **no** byte under `rebuild/m4/spec` — so it refuses on the child's bytes,
and that refusal is the child's to supersede. It is reported here rather than repaired.

## P.6 `b-package.cjs --ci --package B-NTC` — reported exactly as it ran

Run in a scratch git worktree carrying this branch's tree plus the
`rebuild/lanes/b/tooling` folder from `rebuild/lane-b-tooling @ 636aeaa`, committed there
so the runner's `git`-at-`HEAD` pins resolve; `node_modules` junctioned from this worktree
so the reference bundles build. The scratch worktree was removed afterwards.

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
exit 1 · 7 lines
```

Six `say` lines, then the FAIL line. The six that **passed**:

```
B PACKAGE B-NTC SPEC OBSERVED packages/B-NTC.json 552fec58…; runner 6f69aa8e… byte-identical
  on disk and in Git at HEAD; status=PROPOSED; 0 D-ids; 25 declared product files;
  6 declared child(ren) …; 0 declared move(s)
B PACKAGE B-NTC PARENT OPTION NATIVE-CARRIERS … e940359b… ACCEPTED at b95ccca8… (DECISIONS:104);
  artifact byte-identical on disk, in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core
B PACKAGE B-NTC PARENT BOUND NATIVE-CARRIERS …; single-parent chain holds
B PACKAGE B-NTC POSTFIX M2-B-NTC-NATIVE-TREND-CONTEXT REVIEW-PENDING mode=--ci
B PACKAGE B-NTC ENVELOPE ABSENT; …acceptance-b-ntc-native-trend-context.json is not sealed yet
B PACKAGE B-NTC PARENT PINS RE-ASSERTED at run time; 29 pin(s) …, 23 un-successeded grandparent
  pin(s) …, 22 superseded pin(s) preserved in Git at sourceBase 5dc9254
```

then

```
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld
```

**The named assertion** (obtained from a throwaway copy of the runner inside the scratch,
with only the catch clause printing `error.message`; the copy was discarded with the
scratch and the exit/lines above are the UNMODIFIED runner's):

```
UNLISTED-PRODUCT-DRIFT rebuild/m4/workout/engine-runtime.cjs is not parent-pinned and is not declared new
  at product (rebuild/lanes/b/tooling/b-package.cjs:451)
```

### P.6.1 THE FIRST STOP — the runner cannot express a child superseding a parent EXECUTION pin

The two functions disagree about what "parent-pinned" means:

* `held()` (`b-package.cjs:419`) resolves supersession against
  `{...acceptance.product, ...acceptance.executionPins}` — and it treats a file as
  superseded **exactly when the spec declares it in `product[]`**. That is the runner's own
  equivalent of `native-carriers-profile.cjs`'s `SUPERSEDED` set, and it **worked**: the run
  printed *"22 superseded pin(s) preserved in Git at sourceBase 5dc9254"*.
* `product()` (`b-package.cjs:451`) resolves the same question against
  `acceptance.product` **only**. `engine-runtime.cjs` lives in the parent's
  `executionPins`, so `product()` sees it as not-parent-pinned and demands
  `role: "new"`.

So a child doing exactly what DECISIONS:109 instructs must declare the file in `product[]`
to satisfy `held()`, and is then refused by `product()` unless it calls an **edited** file
`"new"`. **Lane B will not mislabel an edited file to get a green line**, so the spec
declares `role: "edited"` and the run refuses. This is a TOOLING change on
`rebuild/lane-b-tooling`, not something a spec may do (W7: `CHILD_ROOTS`, `NO_REGISTER_IDS`
and `role` are all fixed in the runner).

**The fix, and it is one line.** Give `product()` the same map `held()` uses for the
membership test, while leaving the completeness loop over `acceptance.product`:

```js
const ppin = bound && { ...bound.acceptance.product, ...bound.acceptance.executionPins };
if (ppin && Object.hasOwn(ppin, file)) assert.equal(pin.pre, ppin[file], 'UNLISTED-PRODUCT-DRIFT pre-image is not the parent pin: ' + file);
else assert(pin.role === 'new' || !ppin, 'UNLISTED-PRODUCT-DRIFT ' + file + ' is not parent-pinned and is not declared new');
```

**Measured with that one line applied to a scratch copy of the runner**, the run gets nine
further gates and then stops on P.6.2:

```
PRODUCT IMPLEMENTED; 5 at the declared post-image / 0 at the pinned pre-image /
  20 carried byte-identical from the parent / 0 unlisted drift;
  the inventory covers all 20 parent-pinned product files
FIDELITY OBSERVED; sourceBase 5dc9254 ancestor of HEAD; 9 engine/conform/m4-spec/lane-b-tooling
  file(s) changed since sourceBase, all in the fixed inventory; 18 PIN_PATHS byte-identical Git vs disk
AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as exact ledger line
  bytes at b045e61 under their own roles; contract inherited byte-equal from the parent;
  theme NULL …; brief acceptance NULL — the obligation stays open
LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · … · 0 HARNESS_ERROR
LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase IMPLEMENTED
CARRIERS NONE DECLARED; 0 witness flip(s) declared
```

### P.6.2 THE SECOND STOP — the parent's own carrier children refuse the child's bytes

With P.6.1 patched, the first declared child refuses:

```
Required child source-carriers
  → AssertionError: Adopted support bytes: rebuild/m4/workout/engine-runtime.cjs
      + 'c03732e8…'  - '9be21897…'
    at native-carriers-source.cjs:106
    at native-carriers-parent-source.cjs:43
    at native-carriers-source-carriers.cjs:13
```

This is the SAME refusal as P.5, surfacing a second time and for the same correct reason:
the five children that carry the parent's nine inherited gates **are the parent's own
carrier modules**, and each re-verifies the parent's source pins. A child that supersedes a
parent file has to carry **successor** children for those gates — which is precisely what
`carrierSuccessor` and `coverage.moves` exist for, and `coverage.moves` is refused outright
by X1 (`MOVES_RULING === null`, `b-package.cjs:60`) until a PM ruling exists.

**So B-NTC cannot be sealed by `b-package.cjs @ 636aeaa`, and neither cause is inside lane
B's reach within this package.** Both are named above with their file:line and their fix.

### P.6.3 Y1 — done as far as the runner allows, and the residue is a STOP too

`children[]` was empty, which was itself a latent defect: `coverage.inherited` names five
children and `b-package.cjs:268` asserts every one of them is a DECLARED child, so the old
spec could not have run at all. Six children are now declared:

| child | argv | needle |
|---|---|---|
| `source-carriers` | `rebuild/m4/spec/native-carriers-source-carriers.cjs` | `NATIVE SOURCE CARRIERS: 6/6 PASS;` |
| `inherited-carriers` | `…native-carriers-inherited-carriers.cjs` | `NATIVE INHERITED CARRIERS: 6/6 PASS;` |
| `defect-witnesses` | `…native-carriers-defect-witnesses.cjs` | `NATIVE DEFECT WITNESSES: 10/10 complete comparisons PASS;` |
| `writers-differential` | `…native-carriers-writers-differential.cjs` | `NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;` |
| `second-gate` | `…native-carriers-second-gate.cjs` | `NATIVE SECOND GATE:` |
| **`ntc-provider-cells`** | `--test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs` | `# pass 39` |

The last one is what satisfies Y1: it executes
`rebuild/m4/workout/test/native-trend-context.test.cjs`, which `product[]` declares with
`role: "new"` — this package's own authored cell file.

**The residue, and it is the third STOP.** The dispatch asked for the journey and the
gym/today suites to be declared children too. They **cannot** be, against this runner:
`CHILD_ROOTS` (`b-package.cjs:73`) is the closed list

```
['rebuild/m4/spec/', 'rebuild/conform/v4/postfix/', 'rebuild/engine/test/',
 'rebuild/m4/workout/test/', 'rebuild/m3/w7-preview/test/']
```

which contains **neither** `rebuild/m3/w6/host/test/` (the A0 journey, 23/23) **nor**
`rebuild/m3/w7-preview/today/test/` (A2 gym 59/59, today 130/130, 158/158 with A3) — note
`…/w7-preview/test/` is present but `…/w7-preview/today/test/` is not, so the rebound page's
whole suite is out of reach. `CHILD_ROOTS` is fixed in the runner by design (W7: *"a spec
can never nominate its own exempt path"*), so widening it is a reviewed TOOLING change.
Until it lands those three suites are evidence in this report and in
`.github/workflows/rebuild.yml`, and are **not** declared children.

## P.7 What else moved, and the one thing that did not

| file | what | licence |
|---|---|---|
| `rebuild/m3/w6/host/test/journey.test.mjs` | step 14's two byte pins re-pinned; one new `COMPOSITION.exposed` assertion | the mechanical consequence of the re-pin DECISIONS:109 instructs |
| `rebuild/m3/w7-preview/today/test/gym.test.mjs` | three subtests re-authored; **59/59 unchanged** | DECISIONS:109's own words: *"A2's spike table becomes delta cells"* |
| `.github/workflows/rebuild.yml` | the enumeration | DECISIONS:109 names `rebuild.yml` as re-pinned by this child and puts the enumeration in this seal. **Note for the PM:** `LANES.md`'s ownership table assigns `.github` to **no** lane, so the basis for this edit is the ledger line, not LANES.md. If that is wrong, revert this one file — nothing else depends on it. |

**A behaviour change found while re-authoring, and it is NOT papered over.** A2's
"a SECOND session on the same day is refused" subtest passed because `prepareWorkout`
refused with `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`. With the wall gone the preparation
**succeeds** — so that cell was resting on a provider gap, not on a same-day guard. It is
re-authored to assert the guard that has to hold, and the guard holds, measured:
`model.start()` → `ok:false`, `code: 'WORKOUT_NOT_READY'`, op count unchanged (12 → 12), and
the log still carries exactly the two sessions.

**The `# pass 19` retirement is written and NOT applied.** `rebuild/lanes/b/ntc/pass19-retirement.patch`
is a real `git diff` taken with the enumeration already in place, so it applies on top of
this branch; `git apply --check` exits **0** and an apply/revert round-trip was executed.
Three reasons are in its header: it was outside this pass's dispatch, it deletes executed
evidence that nothing this package owns covers, and *"successor evidence named"* is a
judgment recorded in the PM's own wrapper file. One command lands it.

## P.8 Files this pass touched

| file | bytes | sha256 |
|---|---|---|
| `rebuild/m4/workout/engine-runtime.cjs` | 5 596 | `c03732e896a9596a06edd304bb8f23f2340c29b5e036043a4205f225916be936` |
| `rebuild/m3/w6/host/engine-runtime-host.cjs` | 7 305 | `e210bfa04ce61ef64cc1cc3244d4af4545ca99a0a8610608bae2dccf821b1b4d` |
| `rebuild/m4/workout/native-trend-context.cjs` | 26 812 | `f300f3f2855f98781eadfbabf526d64ed32706f7e52f597b65d0fa6fcb50904a` |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` (**39 cells**) | 34 331 | `8c28ccd082ae134ae4d1918d2c84098696ae3cd3b2a56b36471403918f5d4d4a` |
| `rebuild/m3/w7-preview/today/gym-host.mjs` | 21 609 | `305973d936d6cc80d89c7639b42984c17c2e75d98818cdc759b08f1a1e5a3dd8` |
| `rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs` (**7 cells**) | 23 847 | `8cf038efb19e1c6758233b2bb8974610c3d55b046df3870a2661ad51e7c9c600` |
| `rebuild/m3/w7-preview/today/test/gym.test.mjs` | 52 594 | `a7ca2ef083c2db7c8cbaa809135f18d52008b249d7efa402ee6731f384ab4045` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | 38 329 | `228c076dbc0b1fde64d0ccf235486ef92f6c3434489d6e1ade0967d824935cc3` |
| `.github/workflows/rebuild.yml` | 6 178 | `3a8d46ce64d5c55b37f4c4f384a140e1962dc19dff96ff9c3ca0343102704ca7` |

Plus the documents: `BRIEF-…md` (v1.2), this report,
`rebuild/lanes/b/tooling/packages/B-NTC.json`, and the new
`rebuild/lanes/b/ntc/pass19-retirement.patch`.

**Untouched, and checked:** every byte under `rebuild/engine`, `rebuild/conform` and
`rebuild/m4/spec`; `gym-model.mjs` (G7/O10 is lane C's C4 — the hunk still sits unapplied at
`rebuild/lanes/b/ntc/gym-model.previousLine.patch`); every frozen law, witness, tool and
golden; `package-lock.json`.

## P.9 What a reviewer should attack first

1. **Is exposing `dayWeather` + `cleanAtDate` really additive?** The claim is that both are
   pure readers already reached from inside `genSession`'s closed graph, so the widening
   grants no new capability. Check `sleep.cjs:1957`'s return and the `absentProvider` traps.
2. **Is the fresh athlete still proven?** G5 is unchanged in outcome; the risk is that it is
   now green for a different reason. The provider cell "OBLIGATION (i) rides the SAME code
   path" is the control — it asserts equality against `ENGINE.dayWeather`/`ENGINE.cleanAtDate`
   directly.
3. **The re-authored A2 cells.** Three subtests changed meaning. Read them against
   DECISIONS:109's "A2's spike table becomes delta cells" and decide whether the same-day
   cell's new assertion is the right guard.
4. **The `.github` licence.** P.7 states the basis is the ledger line, not LANES.md.
5. **RED-first, MEASURED — do not take P.2's fail-closed claim on trust, it was executed.**
   With `rebuild/m3/w6/host/engine-runtime-host.cjs` reverted to its narrow two-name
   `EXPOSED` (the host mirror is the runtime the gym card actually composes) and nothing
   else changed:
   ```
   node --test .../today/test/ntc-h6-delta.test.mjs   -> tests 7 · pass 0 · fail 7
   node --test .../w6/host/test/engine-equivalence.test.cjs -> tests 5 · pass 3 · fail 2
   ```
   **All seven** delta cells go red, G5 included — `createDayFactsReader` refuses to
   compose rather than quietly returning the empty-history reader, so even the fresh
   athlete's cell fails loudly instead of passing for the old reason. That is the
   fail-closed direction of P.2, demonstrated rather than asserted; a silent downgrade
   would have left G5 green and hidden the narrow surface. Equivalence catches the
   mirror/accepted drift in the same run. The tree was restored byte-for-byte afterwards
   (`engine-runtime-host.cjs` back at `e210bfa0…`).
