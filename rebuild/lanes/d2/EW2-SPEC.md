# EW2-SPEC: EDIT MY WEEK, SCREENS PART 2

Lane D2, SPEC ONLY. Author: cowork (Earned lane hand), Opus, 2026-09-19. Branch `rebuild/d2-ew2-spec`
cut from `0794771`. No product, test, tooling or workflow byte moves on this branch.

**v7, THE LOOP'S NARROW FIX ROUND (`DECISIONS:613`, round 1 of 3, no PM inside the loop). Astra
re-checked round 6 NARROWLY and returned DO NOT BUILD YET on ONE executed journey, B1, plus TEN
NAMED DEBTS. Section 14 is v7's whole landing: B1 reproduced RED, the correction, both of her
required controls, the honest budget consequence, her `D9` labels corrected in place, and D1 to D10
carried VERBATIM for the build brief at 14.6. `D-EW2-FINAL` still binds and there is no new general
author round. Sections 0 to 13 are v6's, amended only where a v7 correction says so in place.**

**v6, FIX ROUND 6, THE LAST GENERAL AUTHOR ROUND (`D-EW2-FINAL`). NO EW2 BUILD STARTS FROM v5.**
ASTRA, the independent Codex reviewer, read v5 BLIND at highest effort and returned **DO NOT BUILD
YET**: thirteen findings, three BLOCKING, most with EXECUTED witnesses
(`rebuild/lanes/astra/reviews/EW2-SPEC-BLIND-REVIEW.md` at `origin/rebuild/r-astra-ew2-spec`,
`adc9347d`, 251 lines). The PM upholds the verdict and rules `E-R30` to `E-R38`. **Her finding is
R4's B1 one level up: R4 found an id-space defect by running the product where the two lift id
spaces DIFFER; she found that v5's own answer still does not survive the moment the spaces CHANGE,
the first import after first-run edits. Five Claude rounds read those sections and none of them ran
that journey.** Section 13 is this round's landing: every ruling, the cell of MY OWN writing that
reproduces or refutes her witness, the three new acceptance journeys J1, J2 and J3, the re-priced
sealed budget, and her superseded register with every sentence corrected or dated. **This round
measured before it wrote and it did NOT take her findings unmeasured: every executed witness was
reproduced in a farm scratch worktree with cells written from scratch, and where my measurement
disagrees with her reading, section 13.10 says so by name.**

**v5, FIX ROUND 5, THE SHORT ROUND, AND THE LAST DOCUMENT ROUND. THE BUILD STARTS FROM THIS FILE.**
Independent review R4 (`EW2-SPEC-REVIEW-R4.md` at `84e09193`) returned REJECT at `f9b1c8db` with
four BLOCKING findings and five notes, and it is **the first round that ran the product against the
SPEC rather than against the spec's own fixture**. Its author wrote a cell to break the design and
it broke: `E-R16` put a FILE lift id against a DOCUMENT-id set, and measured, the ruling as worded
refused twelve of the sixteen lifts on a real old app file. **The PM has re-taken two rulings
(`E-R16 PRIME` and `E-R17 PRIME`) and issued four more (`E-R21` to `E-R24`); nothing of R4's is
disputed here and all five of its notes are adopted. Section 12.6 answers every one of them with
the cell that proves it.**

**THIS ROUND MEASURED BEFORE IT WROTE, AND ITS CELLS ARE COMMITTED BESIDE THIS FILE.** Six new
throwaway cells plus R4's own, all synthetic, all under three seconds, none sealing anything, live
in `rebuild/lanes/d2/spike/` with a README giving each one's sha256 against its farm original and
the directory it must be copied to in order to run. **Every table in this version marked MEASURED
names the cell that produced it.** What they could NOT measure is listed in 12.4, and the largest
item there is the same one v4 had: nothing has yet walked a sealed bundle through
`source-admission.mjs` with a plan edit on the record, because that needs the real port.

**v4, FIX ROUND 4, AND THE METHOD CHANGED: THE FACTS ARE MEASURED BY RUNNING THE CODE.** Three
review rounds each found six new blocking facts by READING an integration nobody had ever run
(`DECISIONS:544`: no page constructs the companion). `DECISIONS:548` ruled that a fourth round of
reading would find six more, dispatched an EXECUTABLE SPIKE first, and dispatched this round under
rulings `E-R12` to `E-R20`. **Section 0 carries the spike's measured fact table. Every claim below
about what refuses, in what order and with which code, cites a row of it or is marked UNMEASURED
(`E-R19`). Where the spike contradicts review R3 or an earlier version of this spec, THE SPIKE
WINS and this file says so, by name, in section 12.** Four of R3's six blocking findings are
confirmed by execution; two are confirmed in verdict and wrong in mechanism; and the spike found
one fact larger than any of them (SPIKE M4 FACT 1, section 4.1.1).

**v3's record, kept.** The first two authors are gone. Independent review R1
(`EW2-SPEC-REVIEW-R1.md` at `0695493`) returned REJECT with six BLOCKING findings and ten notes;
all sixteen are answered in section 10. Independent review R2 (`EW2-SPEC-REVIEW-R2.md` at
`1a73d8f`) returned REJECT at `63710d2` with six BLOCKING findings and nine notes, none of them a
repeat of R1. **Section 11 answers every one of R2's, in the order R2's own last note gives (B6,
B5, B3, B4, B2, B1), under the PM's rulings E-R1 to E-R11.** Nothing of v1 or v2 was discarded
unread: what neither review could break is kept word for word.

Independent review R3 (`EW2-SPEC-REVIEW-R3.md` at `99cfa911`) returned REJECT at `90441ae3` with
six BLOCKING findings (B1 to B6), nine notes (N1 to N9) and two PM notes. **Section 12 answers
every one of them, against the spike rather than against another reading.** The PM agrees with R3
on all six and on both PM notes (`:548`); where the spike then contradicts R3's own MECHANISM, the
spike wins and section 12 prints both.

**THE RE-MEASUREMENT CLAIM, narrowed again and kept narrow.** Every cite this round TOUCHES was
re-counted by me at the chain tip **`ad8ced07`**; the rows carried from v3 untouched were counted
at `00e7a0d0` and section 11.7 lists the five R2 corrected. `git diff 00e7a0d0..ad8ced07` over the
tree is `rebuild/DECISIONS.md`, `rebuild/lanes/STATUS.md` and PM ruling files only, so no product
cite is excused by drift. **Two cites in the spike's own table are one file and six lines off and
I correct them rather than pass them on: `host-bindings.mjs` is at `rebuild/m3/w6/local/`, not
`m3/w6/host/`, and its clock shape guard is `:242-:243`, not `:236-:237` (measured at
`ad8ced07`; the entry point `localHostBindings` is `:335`, which the spike has right).**

This is a hypothesis for the PM to judge and for an independent reviewer to disagree with.

Authority: `DECISIONS:176` (the brief accepted by name with three rulings), `:473` and `:474` (part 1
merged), `:510` and `:519` (the carried provenance defect, whose reachability `:510` itself left
OPEN), `:532` (the owner has imported; it says nothing about reachability), `:536` (screen files
released from the seal), `:540` (the first dispatch), `:541` (the cloud farm and this pilot),
**`:542` (the S9 two-path closed list PM-ACCEPTED, `:536` not re-opened, TODAY-SPLIT ruled) and
`:543` (THE SPLIT'S DIRECTION REVERSED: the WRITERS leave `today-app.cjs`, `today-app.cjs` itself
is RELEASED, and a sealed WRITER-FENCE cell fails when any file outside the sealed inventory calls
a writer, opens IndexedDB or imports a host).** `:543` landed after v2's base and it is what
section 3 is re-cut against. **ADDED IN v4: `:544` (the round 3 rulings `E-R1` to `E-R11`) and
`:548` (round 3 judged at REJECT, THE SPIKE RULED, and rulings `E-R12` to `E-R20`, which this
version carries out and cites by name at every landing).**

**Read before this file, v5:** section 0 of this file (the spike's fact table) and
`rebuild/lanes/d2/spike/README.md` (this round's cells and what each one proves), then
`rebuild/lanes/d2/BRIEF-EDIT-MY-WEEK.md` (the brief of record, 101 lines), then
`rebuild/lanes/c/TODAY-SPLIT-SPEC.md` at **`rebuild/c-today-split@60d6ad97`, WHICH IS ITS OWN
REVIEW R2, A REJECT WITH EIGHT BLOCKING FINDINGS (R4 N5)**, whose **section E.3 is
the WRITER-FENCE's entry-point list and its MAY-IMPORT closed list**, and which section 2 and
section 3 of this file are now cut against line by line (R3 N4 and N7, `E-R12`, `E-R22`).
**That document is in a fix round, so STOP 2's four dependencies and 6.8's fourth bullet are
dependencies on text that may move, and both say so.**

Also read `rebuild/lanes/b/S9-RELEASE-SPEC.md` at `rebuild/b-s9-ui-pins@d859096a` (the release
list, which decides part of section 3). **v3 recorded TODAY-SPLIT at `14c87fa7` and said round 2
was not pushed. That is stale and R3 N4 is upheld: TODAY-SPLIT-SPEC v2 IS pushed, and the branch
was at `906cb056`.** **CORRECTED AGAIN IN v5 (R4 N5): it is at `60d6ad97`, its own review R2, and
its spike has since landed at `24b35244`; `git diff 60d6ad97..24b35244` over that spec file is
EMPTY, so E.3 and E.4 are the same text at both.** Its MAP `:79`, `:84`, `:113`, `:119` and `:120` this spec still uses; its
CUT is the one `DECISIONS:543` ruled, so it no longer reverses anything. S9's two-path closed list is now PM-ACCEPTED (`:542` (B)),
so section 3's arithmetic is confirmed rather than provisional; S9's own document is still at
REJECT R2 for two findings that do not move the list.

---

## 0. THE SPIKE'S MEASURED FACTS (NEW IN v4, `DECISIONS:548`, `E-R19`)

`:548` ruled that the facts three review rounds had argued from source would be MEASURED BY
EXECUTION before another line of spec was written. The spike ran real modules: the real
`openLocalDurableClient`, a real encrypted W6 repository, the real T2 producer stage, the real
`createSetupCommands` first run, the real plan edit companion over `era.client`, the real gym card,
and for M4 a real bundle sealed by `port.cjs` through the real custody handle and the real
`createLocalSourceController`. **FIXTURES SYNTHETIC ONLY. Nothing was shipped, nothing pushed, no
owner measurement entered it.** The report of record is the spike's own fact table (381 lines);
the rows this spec leans on are reproduced below so that every cite resolves inside this file.

**Where the cells are, so a reviewer can re-run them rather than take this table on trust.** Farm
scratch worktree `ew2-spike` at `e0e2ac75` (made with `farm-scratch.sh` from
`origin/rebuild/t2-client-core`), holding `ew2-spike-support.mjs` (a copy of
`durable-host.test.mjs`'s own scaffold with four knobs: a collaborator can be WITHHELD by
`Object.assign` and never by a destructuring default, the basis can be left UNPROJECTED, the clock
can be the real `clientClockFor`, and every `repository.load()` is counted) and
`ew2-spike-m1.mjs`, `-m2`, `-m3`, `-m5`, `-m7`, `-m4`. M4's seal needed the PC, measured and not
assumed: in the farm `sealed(7)` returns `port.cjs did not seal the invented bundle (status 2)`,
because the oracle files are outside the farm's include list. **Nothing in a scratch worktree is
ever pushed; what must ship is rebuilt on the PC.**

**HOW TO READ A CITE.** `SPIKE M1 row 4` means row 4 of the M1 table below. A claim in this spec
about what refuses, in what order, or with which code, carries such a cite or the word
**UNMEASURED**, and UNMEASURED is not a defect: it is the honest label for a claim the spike did
not drive, and every one of them is listed in 12.4.

### 0.1 SPIKE M1: THE FIRST READ, and what the F2 collaborators really gate

Real `createPlanEditHost` over the real durable client. "imported" is PE16's own admitted-import
generation (`admitState` plus `importedOf`, `durable-host.test.mjs:593-:606`), which needs no port
and which the farm builds.

| # | installation | basis handed over | tag collaborators | `host.read()` | raised at |
|---|---|---|---|---|---|
| 1 | first-run | raw (`today-entry.mjs:130`) | none | `PLAN_EDIT_TAGS_INVALID` | `plan-edit-commands.cjs:66` from `plan-edit-model.cjs:203` |
| 2 | first-run | raw | F2 injected | `PLAN_EDIT_TAG_BASIS_UNPROVEN` | `plan-edit-model.cjs:217` |
| 3 | first-run | tagged (`projectSetupTags`) | none | `PLAN_EDIT_TAGS_INVALID` | `plan-edit-commands.cjs:66` from `:203` |
| 4 | first-run | tagged | F2 injected | **READ OK** | |
| 5 | imported | raw | none | `PLAN_EDIT_TAGS_INVALID` | `plan-edit-commands.cjs:66` from `:203` |
| 6 | imported | raw | F2 injected | **READ OK** | |
| 7 | imported | tagged | none | `PLAN_EDIT_TAGS_INVALID` | `plan-edit-commands.cjs:66` from `:203` |
| 8 | imported | tagged | F2 injected | **READ OK** | |

Withholding one F2 piece at a time from the green composition:

| # | withheld | `host.read()` | `host.review(add)` |
|---|---|---|---|
| 9 | nothing (control) | READ OK | review OK |
| 10 | `validateExerciseTags` | `PLAN_EDIT_TAGS_INVALID` | not reached |
| 11 | `projectNewExerciseTags` | READ OK | `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` (`plan-edit-model.cjs:349`; `:390` on the preview path) |
| 12 | `projectSetupTags` over the basis | `PLAN_EDIT_TAG_BASIS_UNPROVEN` | not reached |

**WHAT M1 SETTLES.** R3 B2 (ii) and (iii) are CONFIRMED and stronger than R3 stated:
`PLAN_EDIT_TAGS_INVALID` is the first code on EVERY installation, imported included, at projector
construction inside the row loop. THREE corrections to R3, each measured:

1. R3 says 3.5 needs a FOURTH function. **Measured, THREE of F2's four exports are required and
   the fourth has no caller anywhere**: `validateExerciseTags` (via `C.tagsOf` at
   `plan-edit-model.cjs:203` and `plan-edit-commands.cjs:78`), `projectNewExerciseTags` (`:350`),
   `projectSetupTags` (the basis step), plus the factory `createSetupTagProjector`.
   **`validateSetupTags` is called by nothing**: `setup-commands.mjs:124` builds `payload.tags`
   with its OWN `tagsOf` (`setup-commands.mjs:61`), not F2's.
2. The `projectSetupTags` requirement is **FIRST RUN ONLY** (rows 5 and 6). An imported
   installation fed the raw untagged clean-init state reads OK, because `plan-edit-model.cjs:208`
   RETAINS rather than proves the tags on the local-source branch.
3. `validateExerciseTags` is required on **BOTH** branches (rows 1, 3, 5, 7): `C.tagsOf` at `:203`
   sits outside the `firstRun` test.

### 0.2 SPIKE M2: THE CLOCK, and what DAY_TURNED really is

| # | clock handed over | construction | raised at | `host.read()` |
|---|---|---|---|---|
| 1 | v3 3.4.2's `{ today: () => era.liveDay() }` | `LOCAL_HOST_CLOCK_INVALID` | `host-bindings.mjs:243` (guard `:242-:243`), from `:335` | not reached |
| 2 | `{ today, now }` | `LOCAL_HOST_CLOCK_INVALID` | same | not reached |
| 3 | `{ today, now, monotonicMs }` | built | | READ OK |
| 4 | `clientClockFor(day, live)` (`today-bindings.mjs:208`) | built | | READ OK |
| 5 | `clientClockFor(day)` with no live provider | built | | READ OK |
| 6 | `{}` | throws `Existing installation, clock and intent ID provider required` | `plan-edit-host.mjs:45` | not reached |

**THE REAL SHAPE, measured.** `host-bindings.mjs:242-:243` requires `now`, `today` and
`monotonicMs` to be functions and does **not** require `tz`. `clientClockFor('2026-09-13', live)`
returns exactly `["today","now","tz","monotonicMs"]`, with `today()` `'2026-09-13'` (FROZEN),
`now()` `'2026-09-14T23:59:00.000Z'` (LIVE) and `tz` `'-04:00'`.

**R3 B4 (i) is CONFIRMED IN VERDICT and WRONG IN MECHANISM, and the spike wins (`E-R19`).** R3
says the proposed `{today}` reaches `clock.now()` at `host-bindings.mjs:170` or `:223` and throws
there. Measured, it never reaches either: it is refused by the SHAPE guard at `:242-:243`,
`LOCAL_HOST_CLOCK_INVALID`, state 18, before `const clock = hostClock || scope.clock` at `:244`.
The verdict is the same and the cell that proves it is a different cell.

| # | case | `clock.today()` | liveDay at review | liveDay at save | save |
|---|---|---|---|---|---|
| 7 | frozen day equals live day, nothing moves | 2026-09-14 | 2026-09-14 | 2026-09-14 | **SAVED** |
| 8 | **R3 B4's PROPOSED CELL**: authored on D, live day turns before Save | 2026-09-14 | 2026-09-14 | 2026-09-15 | `PLAN_EDIT_REVIEW_STALE` |
| 9 | FROZEN PAGE: `clock.today()` is YESTERDAY, live day D throughout | 2026-09-13 | 2026-09-14 | 2026-09-14 | **`PLAN_EDIT_DAY_TURNED`** |
| 10 | `clock.today()` wired to `liveDay`, live day turns before Save | 2026-09-15 | 2026-09-14 | 2026-09-15 | `PLAN_EDIT_REVIEW_STALE` |
| 11 | `clock.today()` wired to `liveDay`, nothing moves | 2026-09-14 | 2026-09-14 | 2026-09-14 | SAVED |

**THE SPIKE CONTRADICTS R3 B4's REQUIRED CELL and the spike wins.** R3 REQUIRED "a review authored
on day D, saved after the live day has turned, refuses `PLAN_EDIT_DAY_TURNED`". Measured (row 8),
that case refuses **`PLAN_EDIT_REVIEW_STALE`** at `plan-edit-host.mjs:214`, because `matches()`
(`:87-:93`) compares `localDay()` with `entry.authoredDay` and fails BEFORE `:225-:226` is reached.
**`PLAN_EDIT_DAY_TURNED` is the STAMP-CLOCK DISAGREEMENT and nothing else** (row 9). The merged
lane cells already say so (`durable-host.test.mjs:513` STALE, `:529` DAY_TURNED), so **a round 4
cell written to R3's wording would be RED on arrival.** Section 5's new EW-18 is written to row 9.
**R3 B4 (ii) is CONFIRMED IN SUBSTANCE** (rows 10 and 11): wired to `liveDay`, DAY_TURNED is
unreachable in every ordering, so state D would be dead code.

### 0.3 SPIKE M3: ADOPTION, `planEditedState` and the durable read count

`mountToday` needs a DOM and a booted era, and `adoptBasis` (`today-model.cjs:412`) is
`basis = clone(state)`, so the spike drove the two branches of `athleteBasisState`
(`today-app.cjs:2482-:2488`) directly and unmodified, `admittedLocalSourceBasis` and
`createCleanInitState({setup})`, and quoted `adoptBasis`. The saves are real operations on the real
encrypted store.

**(a) TWELVE ROWS, one saved edit of each kind on each installation, all identical in the column
that matters.**

| # | installation | edit kinds | branch Today takes | edit visible in what Today adopts | visible in the companion read at `starts_on` |
|---|---|---|---|---|---|
| 1 | first-run | sets, name, day, add, replace, remove | `setup.athleteState()` | **NO** (all six) | YES (all six) |
| 2 | imported | sets, name, day, add, replace, remove | `admittedLocalSourceBasis` | **NO** (all six) | YES (all six) |

Confirms `DECISIONS:544`: **nothing in the adoption chain applies a plan edit, for any kind, on
either installation.**

**(b) THE `planEditedState` PROTOTYPE, 42 rows.** Pure:
`createPlanEditProjector({basisState: FED, ...}).read(generation, date).state`, the model's own
`inspect()` plus `result()` pair, `basisSource` matching the installation.

| # | installation | fed | result | raised at |
|---|---|---|---|---|
| 3 | first-run | the RAW basis the projector was built with | **OK, equals the companion read** | |
| 4 | first-run | `athleteBasisState()`'s own result | `PLAN_EDIT_TAG_BASIS_UNPROVEN` | `plan-edit-model.cjs:217` |
| 5 | first-run | the companion's OWN read at `starts_on`, update / remove | `PLAN_EDIT_ORIGIN_UNPROVEN` | `plan-edit-model.cjs:216` |
| 6 | first-run | the companion's OWN read at `starts_on`, add / replace | `PLAN_EDIT_ORIGIN_UNPROVEN` | `plan-edit-model.cjs:134` |
| 7 | first-run | the untagged clean-init state | `PLAN_EDIT_TAG_BASIS_UNPROVEN` | `plan-edit-model.cjs:217` |
| 8 | imported | the RAW basis | **OK, equals the companion read** | |
| 9 | imported | `athleteBasisState()`'s own result | **OK, equals the companion read** | |
| 10 | imported | the companion's OWN read at `starts_on`, all six kinds | `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` | `plan-edit-model.cjs:240` |

**THE SPIKE CONTRADICTS TWO OF R3's THREE PREDICTIONS and the spike wins (`E-R19`).**

1. An IMPORTED installation fed `athleteBasisState`'s own result **SUCCEEDS** (row 9); it does NOT
   refuse `PLAN_EDIT_IMPORTED_BASIS_MISMATCH`, because that value is exactly what
   `plan-edit-model.cjs:237` re-reads, so `:240`'s `equal(adopted, base)` holds. `:240` DOES fire,
   on a different feed: the ALREADY EDITED state (row 10). **A cell that asserts `:240` must name
   the COMPOSED state as its input, never the adopted one.** v3's EW-13c named the wrong input and
   is rewritten in section 5.
2. First run double-apply: **NEITHER `PLAN_EDIT_ID_REUSED` (`:346`) NOR
   `PLAN_EDIT_TARGET_UNAVAILABLE` (`:321`) is reachable on this path.** Fed `athleteBasisState`'s
   result it refuses `:217` (row 4); fed the already edited state it refuses `:216` (update,
   remove) or `:134` (add, replace, where the lift COUNT no longer matches the setup document).
   **The origin proof at construction always refuses before `apply()` is entered**, so no double
   application can occur and v3's EW-13d named a code it can never see.
3. Both installations fed the RAW basis work and equal the companion's own read (rows 3 and 8).
   **CONFIRMED**, and this is what keeps 3.4.3's pinning right.

**(c) DURABLE READS PER ADOPTION, counted on an instrumented repository.**

| # | act | `repository.load()` calls |
|---|---|---|
| 11 | `createPlanEditHost(...)` | 0 |
| 12 | `host.read()` (via `readVerified` and `lane.reopen()`) | 1 |
| 13 | `host.review()` | 1 |
| 14 | v3 3.4.2 `basisState = admittedLocalSourceState(setup)` | 1 |
| 15 | v3 3.6 `setupOperation = setupsIn((await repository.load()).generation, PROFILE)` | 1 |
| 16 | `today-app.cjs:2482` gate, before any of it | 1 |
| 17 | **TOTAL for one adoption as v3 specified it** | **4 where there was 1** |

**CONFIRMS R3 B6 EXACTLY**, and STOP 9 fires at design time. R3's repair, which `E-R17` rules and
3.4.2 now carries, brings it to **2**: the gate's own load, plus the one `lane.reopen()`.

### 0.4 SPIKE M4: REACHABILITY, which `DECISIONS:510` left OPEN, ANSWERED BY EXECUTION

All product: real era, real setup lane (the shipped reducer's document), real plan edit companion
over `era.client` so a real `plan-mutation` op lands on the encrypted store, real gym card
(`createGymHost` and `createGymModel`, start, every `logSet`, finish), then a **real bundle sealed
by `port.cjs`** (`sealed(7)`, `legacy-fixture.cjs`) through the real custody handle and the real
`createLocalSourceController`. First run 2026-09-16; review authored 2026-09-17 so `starts_on` is
2026-09-18 (Friday, L on both weeks); session 2026-09-18 unless stated; import `asOf` 2026-09-19.
This is the one module that needed the PC; the worktree was removed and nothing was committed.

| # | case | edit | session day | slots | admitted | issues, IN ORDER |
|---|---|---|---|---|---|---|
| 1 | c0 CONTROL, no edit | | 2026-09-18 | 21 | **YES** | none |
| 2 | c1 CONTROL, name only | update `n` | 2026-09-18 | 21 | **NO** | `LOCAL_SOURCE_EFFECT_UNMAPPED` |
| 3 | c2 CONTROL, session BEFORE `starts_on` | update `sets` | 2026-09-17 | 27 | **NO** | `LOCAL_SOURCE_EFFECT_UNMAPPED` |
| 4 | c3 CONTROL, order only (day U then back to L) | two updates | 2026-09-18 | 21 | **NO** | `LOCAL_SOURCE_EFFECT_UNMAPPED` twice, then `LOCAL_SOURCE_PROGRAMME_UNRESOLVED / capture_membership` |
| 5 | s1 sets | update `sets` 3 to 5 | 2026-09-18 | 23 | NO | `LOCAL_SOURCE_EFFECT_UNMAPPED`, then `... / capture_sets / calves` |
| 6 | s2 day change | update `day` U to L | 2026-09-18 | 24 | NO | `LOCAL_SOURCE_EFFECT_UNMAPPED`, then `... / capture_membership` |
| 7 | s3 remove | remove | 2026-09-18 | 18 | NO | `LOCAL_SOURCE_EFFECT_UNMAPPED`, then `... / capture_membership` |
| 8 | s4 add | add | 2026-09-18 | 24 | NO | `LOCAL_SOURCE_EFFECT_UNMAPPED`, then `... / capture_lift / ew2-added-lift` |
| 9 | s5 replace | replace | 2026-09-18 | 21 | NO | `LOCAL_SOURCE_EFFECT_UNMAPPED`, then `... / capture_lift / ew2-replacement` |
| 10 | s6 CONTROL, hi only | update `hi` 10 to 15 | 2026-09-18 | 21 | **NO** | `LOCAL_SOURCE_EFFECT_UNMAPPED` |

**FACT 1, AND IT IS THE BIGGEST THING THE SPIKE FOUND. A SAVED PLAN EDIT BLOCKS THE IMPORT BY
ITSELF, BEFORE ANY CAPTURE IS LOOKED AT, ON EVERY KIND, INCLUDING A NAME ONLY CHANGE AND INCLUDING
A PHONE THAT RECORDED NO SESSION AFTER THE EDIT** (rows 2, 3 and 10, all three of which the ticket
expected to pass). `source-admission.mjs:526` is
`issue(op.class==='food-day'||op.class==='steps' ? 'LOCAL_SOURCE_DAILY_UNRESOLVED' : op.class==='plan' ? 'LOCAL_SOURCE_EFFECT_UNMAPPED' : 'LOCAL_SOURCE_CONTEXT_UNRESOLVED', op.op_id)`,
reached because the replay's family loop claims F1 to F7 and **nothing claims a `plan` or
`plan-mutation` operation**. One issue per saved edit (row 4, with two edits, raises two). **This
is a FIFTH refusal site**: the ticket, `DECISIONS:544` and reviews R1, R2 and R3 all name three
capture checks and none names this one, and nothing in v3's section 4 touches it. Section 4.1.1
carries it and 4.3 rules it. (`validateGeneration:170`, the other `EFFECT_UNMAPPED` site, does not
fire: the edit writes into `collections.ops` and `outbox`, not `collections.plan`.)

**FACT 2, the three capture checks, each REACHED and ATTRIBUTED.** `capture_sets` (`:665`) fires
for a set count change only, naming the edited lift (row 5). `capture_membership` (`:695-:699`)
fires for a day change, for a remove, **and for an ORDER ONLY change that alters neither the pool
nor any count** (row 4), which is in nobody's list and is real because `:699` compares
`encode([...counts.keys()])` with `encode([...produced.exercise_ids])` and that is order sensitive.
`capture_lift` (`:614`) fires for add and for replace, naming the MINTED lift id (rows 8 and 9),
**exactly as R3 B5 predicted**. `capture_producer` (`:598`) **never fired in any of the ten
cases**, which is the one thing v3's 4.1.1 had right about it.

**FACT 3, for the fold's `basisSource` question and answerable only here.**
`Model.importPresentIn(generation)` during the real walk: **false** after first run; **TRUE after
`carry` (custody), before `reviewSource`**; TRUE after `reviewSource`; **TRUE after
`prepareSource`, which is when `programme()` runs**; TRUE after publish and reconcile.

### 0.5 SPIKE M5: THE FOLD

`foldPlanEditsAt` prototyped as the model's own `inspect()` plus `result()` pair in admission's own
context: `documentState = createCleanInitState({setup: op.payload.setup})`
(`source-admission.mjs:221`), `setupOperation = op` (`:220`), over a real generation carrying two
proven edits. That generation measures: collections exactly the seventeen `COLLECTIONS` names,
`sync.frontier.W` 0, `plan` and `planTransactions` empty.

| # | construction | outcome | raised at |
|---|---|---|---|
| 1 | AS v3's 4.3 ruling 2 SPECIFIES IT (`basisSource` defaulted) | `PLAN_EDIT_TAG_BASIS_UNPROVEN` | `plan-edit-model.cjs:217` |
| 2 | R3 B3 way out (a): `basisSource:'local-source'` | `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` | `plan-edit-model.cjs:235` |
| 3 | R3 B3 way out (b): `projectSetupTags` over `documentState` first | **FOLDED** (applied 2, sets 5, 4 lifts) | |
| 4 | way out (b), `validateTags` withheld | `PLAN_EDIT_TAGS_INVALID` | `plan-edit-commands.cjs:66` from `:203` |
| 5 | way out (b), `projectNewExerciseTags` withheld, generation carries an `add` | `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` | `plan-edit-model.cjs:349` |
| 6 | guard `:225-:227`, unknown collection key | `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` | `plan-edit-model.cjs:227` |
| 7 | guard `:225-:227`, `sync.frontier.W` non zero | `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` | `plan-edit-model.cjs:227` |
| 8 | guard `:225-:227`, a sync snapshot plan | `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` | `plan-edit-model.cjs:227` |
| 9 | guard `:235`, import present while `basisSource` first run | `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` | `plan-edit-model.cjs:235` |
| 10 | guard `:242-:243`, non empty `collections.plan` | `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT` | `plan-edit-model.cjs:243` |
| 11 | guard `:242-:243`, non empty `collections.planTransactions` | `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT` | `plan-edit-model.cjs:243` |
| 12 | a RETRACTED (tombstoned) edit | **FOLDED, applied 1, the tombstoned `add` EXCLUDED** (3 lifts, not 4) | |
| 13 | an UNPROVEN edit (member value mangled) | `PLAN_EDIT_HISTORY_UNPROVEN` | `plan-edit-model.cjs:285` |
| 14 | an edit whose causal parent was tombstoned | `PLAN_EDIT_BASIS_INVALIDATED` | `plan-edit-model.cjs:300` |

**R3 B3 is CONFIRMED and both of its ways out are MEASURED. Way out (a) is dead twice over**: with
`basisSource:'local-source'` the fold refuses at `:235` on a generation with no import (row 2), and
on a REAL import (M4 fact 3) the generation DOES read as imported by then, but `admittedBasisOf`
cannot return an adopted basis, because the marker and `collections.derived.localSource` are only
written at publish and reconcile, AFTER `programme()`, so `:238` refuses
`PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` instead. **NEITHER value of `basisSource` works during
admission.** Way out (b) is the only one that folds, and 4.3 ruling 2 now takes it.

**THE SMALLEST FACTORING IS NONE IN THE MODEL.** `createPlanEditProjector(...).read(generation,
date)` already folds a proven non retracted edit and already refuses a retracted or unproven one,
and row 12 PROVES the exclusion rather than asserting it. What the fold needs is three things
OUTSIDE the model: a tag projected `documentState`; a way past `:235` (M4 fact 3 measures that the
real generation reads as imported at fold time); and BOTH F2 collaborators, because a generation
carrying an `add` refuses at `:349` without `projectNewExerciseTags` (row 5).

**THE PROGRAMME DIGEST INPUT DOES NOT CHANGE, by the code's own construction.**
`source-admission.mjs:221-:236` hands `documentSets` and `documentProgramme.state` out through OUT
PARAMETERS, and the comments at `:222-:228` and `:230-:236` state they are "NOT a member of the
returned basis and therefore not a digest input"; the digest input at `:779` is the RETURNED basis
over `PROJECTED_FIELDS` from the FILE. R3 section 5's second answer is confirmed by execution.

**WHAT ADMISSION REPORTS WHEN THE FOLD REFUSES WAS UNRULED AND IS NOW URGENT.** Every refusal above
is a `TypeError` carrying a `PLAN_EDIT_*` code (`plan-edit-commands.cjs:5`), and
`KNOWN_REPLAY_CODES` (`source-admission.mjs:96-:98`) is a CLOSED allowlist of `LOCAL_SOURCE_*`
codes. A `PLAN_EDIT_*` throw would surface as `LOCAL_SOURCE_WORKOUT_UNRESOLVED` if raised inside
the `:270` try, or escape UNCAUGHT if not. `E-R14` rules it and 4.3 ruling 2a carries the ruling.

### 0.6 SPIKE M6: THE F2 PACKAGE, its identity, its review history and what landing it needs

- **BYTE IDENTICAL: YES.** `diff` empty. `rebuild/m4/workout/setup-tags.cjs` at `f3e9561b` and the
  pinned `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` are both sha256
  `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d`, 198 lines.
- **WHAT REVIEWED OR ACCEPTED IT: THE BRIEF ONLY.** `DECISIONS:155` (the F2 brief judged) and
  `:174` (`BRIEF-F2-TAG-PROJECTION-v1.0.md` accepted BY NAME, package M2-F2-TAG-PROJECTION,
  reviewer "the PM's Claude MAX reviewer at PR-READY", seal order `:136` with F2 after F1).
  **The CODE has no acceptance line**: a grep for `setup-tags` across `rebuild/DECISIONS.md`
  returns only `:544`'s statement that it is unmerged and sha identical. There is **no F2 review
  file on the branch**: `rebuild/lanes/d/f2/` holds cells and a fixture; the three reports are
  author side. **F2 was never judged as code and never sealed.**
- **WHY IT IS UNMERGED.** `rebuild/lane-d-f2-b1b2` forks from `ff6b6b57` (2026-09-12) and was never
  rebased, so its diff against the tip shows unrelated deletions. `:473` records the decision that
  carried the consequence: the plan edit companion v2 "skipped the F1/F2 commits because F2 is on
  the tip in no form", keeping a byte identical copy "pinned by a cell and imported by no runtime
  file".
- **ITS OWN CELLS STILL PASS: 79 pass, 0 fail, 1.6 seconds** in the farm at `f3e9561b`
  (`node --test rebuild/lanes/d/f2/projector.test.mjs composition.test.mjs heads.test.mjs engine.test.cjs`).
  A bare `node --test rebuild/lanes/d/f2/` fails because it also runs `mutants.cjs` and
  `product-fixture.cjs`, which are not cells.
- **WHAT LANDING NEEDS.** FILES: `rebuild/m4/workout/setup-tags.cjs` (new, 198 lines, **no imports
  at all**) is ALL the EW2 door needs, because all three required functions are in it. The volume
  half, if it rides along: `rebuild/engine/volume.cjs`, `rebuild/engine/writers.cjs`,
  `rebuild/m4/workout/athlete-state.cjs`. CELLS: the four files above (79 cells) plus `mutants.cjs`
  and `product-fixture.cjs`. CI: those four added to `rebuild.yml` as disclosed hunks, the way
  `:474` added `lanes/d/plan-edit`. SEAL: `setup-tags.cjs` is a NEW UNDECLARED RUNTIME FILE, so
  `b-package --ci` reports drift exactly as `:474` records for the plan edit runtime, and it needs
  a seal child declaring it product with role `new`. The live seal children are **S8** (`:522`) and
  **S9** (`:543`), and round 4 must say which carries it (3.5 does). ALSO: once it is on the tip,
  `durable-host.test.mjs:27-:35` `tagSource()`, the `PE_F2_PUBLIC_REF` allowlist,
  `f2-tag-adapter.cjs` and the PE16 f2-adapter-identity cell should be RETIRED in the same change.
  **A rebase of the F2 branch is not the route**: cherry pick `e86018c8`, `410a7b70` and
  `f3e9561b` onto the tip, as `:473` did for plan edit.

### 0.7 SPIKE M7: THE MIDNIGHT WINDOW (R3 N9), MEASURED rather than left open

`watchDayRollover` is exported (`today-entry.mjs:471`) and takes its own `now`, so it is drivable.
Page standing on 2026-09-14, a fake `doc` with a real listener list, TZ America/New_York.

| # | step | `now` | `rollover.day()` | reopen calls |
|---|---|---|---|---|
| 1 | standing on 2026-09-14, before local midnight | 2026-09-15T03:59:30Z | 2026-09-14 | 0 |
| 2 | LOCAL MIDNIGHT PASSED, nothing has called `check()` | 2026-09-15T04:00:05Z | **2026-09-14** | 0 |
| 3 | `visibilitychange` while the document is HIDDEN | 2026-09-15T04:00:05Z | **2026-09-14** | 0 |
| 4 | `visibilitychange` while VISIBLE | 2026-09-15T04:00:05Z | 2026-09-15 | 1 |
| 5 | after `stop()` | 2026-09-15T04:00:05Z | 2026-09-15 | 1 (listener detached) |

**THE WINDOW IS REAL AND ITS BOUND IS MEASURED: UP TO 60 SECONDS**, the `intervalMs` default at
`today-entry.mjs:472` (re-measured by me at `ad8ced07`: `intervalMs = 60000` on that line), or the
next `visibilitychange`, whichever comes first. Between local midnight and the next `check()` the
page keeps standing on YESTERDAY, so the gym card prescribes from yesterday's fold while anything
it writes is stamped with today's `local_date`. **A `visibilitychange` while the document is HIDDEN
does NOT close it** (row 3: `onVisible` tests `doc.visibilityState !== "hidden"`), so a phone that
wakes straight into another app can hold it open for the full minute. **R3 N9 is CONFIRMED, with a
number**, and 4.2 carries the rule and the cell `E-R18` asks for.

### 0.8 WHAT THE SPIKE DID NOT MEASURE, so nothing below claims it did

`today-app.cjs mountToday` itself and the gym rebase inside `adoptAthleteState` (`:2490` onward):
the spike drove the two `athleteBasisState` branches and quoted `adoptBasis`. No browser cell, no
`b-package.cjs`, no seal on either machine beyond M4's one real `sealed(7)`. The `:236-:240` guard
on the local source branch INSIDE a real `programme()` call: M4 fact 3 establishes why it would
refuse, but the fold was not driven from inside admission. Every spec claim that rests on one of
these is marked UNMEASURED and listed in 12.4.

## 1. SCOPE AND NON-SCOPE

### 1.1 What `DECISIONS:176` accepted, restated in this spec's own words

The brief describes FOUR doors and sixteen cells. It is not that any more. `:176` ruling (c) narrowed
v1 to TWO doors and thirteen cells, "because a beginner's first real need is 'this machine is taken,
swap the exercise', not a new week". A builder handed the brief alone will build Days and Priorities.
The narrowing is restated here so no reader has to follow a reference to find it.

IN SCOPE for part 2, v1:

| door | what the athlete does |
|---|---|
| Exercises | choose a lift in the current week, then edit its own fields, replace it, remove it from the week, or add a lift |
| Machine settings | keep the seat, pin and position values and the cues remembered for one lift's machine |

Cells in scope: EW-01, EW-02, EW-03, EW-04, EW-05, EW-08, EW-09, EW-11, EW-12, EW-13, EW-14, EW-15,
EW-16. Thirteen. This spec adds THREE more in section 4, EW-17a, EW-17b and EW-17c. Sixteen cells.

NOT IN SCOPE, and it is v1.1, briefed by D2 when v1 merges (`:176` (c)):

| out | why |
|---|---|
| the Days door | v1.1. It also depends on F1 full body and on owner question Q3 (Dad's training days), neither of which is settled. |
| the Priorities door | v1.1. |
| cells EW-06, EW-07, EW-10 | they test Days, midnight composition of structural edits, and priorities. |
| clearing the last machine note | `:176` ruling (b), DEFERRED, accepted. The screen refuses it with the brief's own sentence. |
| any change to the plan-edit companion | it is merged (`:474`) and sealed. Part 2 CALLS it and changes not one byte of it, with ONE exception ruled in 4.4: an ADDED export from `plan-edit-model.cjs` over its OWN `inspect()` and `result()` pair, which is lane D or lane B work on the reseal child and is NOT in EW2-BUILD's diff. |
| any engine, coach, admission, import or store byte | except the admission hunk section 4 rules, same custody as above. |

### 1.2 The three rulings of `:176`, and where each one lands in this spec

- (a) Structural changes take effect TOMORROW in the athlete-local calendar, shown as `Starts {date}`
  before save. LANDS: section 2 state R (review) and state V (saved structural); the date comes from
  `plan-edit-commands.cjs:41 nextLocalDate(day)` over the host's own `liveDay`, never from a page clock.
- (b) Clearing the last machine note is deferred. LANDS: section 2 state M3, with the brief's verbatim
  error and no new contract invented.
- (c) Two doors, thirteen cells. LANDS: section 1.1 above and the cell plan in section 5.

**THE CUSTODY LINE, said here because section 1 is what a builder reads first (v3, R2 N3.9).**
`:176` (2) reads "lane C builds the editor after N2 under one Today build at a time; D2 reviews
lane C's editor". The PM restates it at `E-R8`: **lane C builds, D2 reviews the implementation as a
SECOND obligation on top of the screens tier's own blind reviewer, and the clause "after N2" is
DROPPED because the queue it was written against no longer exists.** So EW2-BUILD is reviewed
twice, and 6.6 is not a substitute for the tier's own reviewer.

### 1.3 What part 2 IS, in one line

The screens for two doors over the already merged and already proven companion
(`rebuild/m3/w6/host/plan-edit-host.mjs`, `rebuild/m4/workout/plan-edit-commands.cjs`,
`plan-edit-model.cjs`), plus their DOM and copy cells, plus THE ADOPTION HUNK THAT MAKES THE EDIT
REACH TODAY (3.4, new in v2), plus the suite and its CI registration. Nothing else exists for this
item anywhere in the tree: `edit-week*` matches no file at the tip, the brief's own proposed suite
path `rebuild/m3/w7-preview/today/test/edit-week.test.mjs` does not exist, and no page, host, entry
or app module constructs the companion (measured: `grep -rn 'createPlanEditHost' rebuild` returns
the export at `plan-edit-host.mjs:42`, two Astra review annexes and four lane D cells, and nothing
else).

---

## 2. THE SCREEN STATES AND THE VERBATIM COPY

### 2.1 THE COMPANION SURFACE, AND WHO IS ALLOWED TO TOUCH IT (RE-CUT IN v4, `E-R12`, R3 B1)

**THE RULE, in the PM's own words at `E-R12`: NOTHING that holds a host, a lane or a writer, and
NOTHING that SHAPES adopted state or a durable operation's projection, lives in a released file.**

**v3's section 2.1 said "the page gets exactly five methods and nothing else" and that is now
WRONG, and R3 B1 is upheld.** `host.save` (`plan-edit-host.mjs:190`) is a durable write;
`host.read` (`:162`) enqueues `readVerified` (`:145`) which calls `lane.reopen()` (`:148`).
`DECISIONS:543` rules, verbatim, "no released file calls, imports or holds a writer", and
TODAY-SPLIT-SPEC v2's section E.3 (**re-read in v5 at `rebuild/c-today-split@60d6ad97`, R4 N5, and
verified byte-identical at `24b35244`**) prints the fence's entry point
list BY MEMBER NAME IN CODE POSITION, including `.save`, `.reopen`, `.close`, `.latest` on a lane
identifier, and the constructors `createMachineSettingsHost` and `createPlanEditHost`'s neighbours.
**Measured in v5, that list carries 28 member names, and `E-R22` makes this item's own callback
table pass it: 6.8's fourth bullet is the census and `spike/r5-fence-names.mjs` is the cell.**
A released state machine holding a host handle fails that fence, and 6.8 makes a green fence this
spec's own bar. So the surface is re-cut.

**THE CUT, and every one of the five methods moves to the SEALED side:**

| who | what it holds | where it lives |
|---|---|---|
| **THE SEALED EDIT WEEK LANE** | host construction, `read`, `review`, `save`, `cancel`, `close`; the Machine settings door's `createMachineSettingsHost`, `.latest` and `.save`; the adoption compose (`planEditedState`); the F2 tag collaborators and the basis projection step; `newIntentId` | `rebuild/m3/w7-preview/today/edit-week-lane.cjs`, NEW and SEALED (3.4.1) |
| **THE RELEASED EDITOR** | a FROZEN READ ONLY VIEW MODEL and a FROZEN CALLBACK TABLE taking RAW FIELD VALUES, exactly the two things `:543` and TODAY-SPLIT B.3 describe; the draft, the state machine, the DOM and the copy | `edit-week-model.mjs`, `edit-week-view.mjs`, `edit-week-check.mjs`, all RELEASED, and none of them imports anything sealed (3.3 line 1) |

**WHAT THE RELEASED HALF RECEIVES, named so a builder cannot widen it.** One frozen object
`weekFacade` whose entries are values or pure functions of values and not one of which is, returns
or closes over a writer; and one frozen object `onWeek` whose entries take RAW FIELD VALUES as the
athlete typed or chose them and return a RESULT OBJECT to paint. The names are chosen against
TODAY-SPLIT B.3's own census rule (`lanes`, `facade`, `on`, `painter` are already taken by the
split, so this item uses `weekFacade` and `onWeek` and asserts zero code occurrences of either in
`today-app.cjs` and `gym-app.mjs` before it ships). **WIDENED IN v5 (`E-R22`, R4 B3): the census is
run on the seven MEMBER names too, not only on the two object names, because E.3's word list is a
list of MEMBER names in code position and that is where the fence actually looks. The seven are
`openWeek`, `review`, `saveChange`, `cancel`, `closeEditor`, `machineLatest`, `machineSave`, and
2.2's `HOW TO READ` paragraph says which two were renamed and why. 6.8's fourth bullet is the bar
that proves it.** **The reply objects below are what `onWeek`'s
entries RETURN; they are not a handle the released file holds.**

The five methods are therefore listed here as **the SEALED lane's surface**, measured at `ad8ced07`
in `rebuild/m3/w6/host/plan-edit-host.mjs` (R1 N1 was right that v1's table read the RETURNED
HANDLE rather than the method definitions; these are the definitions, counted line by line):

| call | line | returns on success | returns on refusal |
|---|---|---|---|
| `host.read(date?)` | `:162` (`async read(date)`) | `{ read:true, state, plan_basis, pending_dates, intents }` | `{ read:false, ...refusal(code) }` |
| `host.review(edit)` | `:163` (`async review(edit)`) | `{ reviewed:true, review_id, intent_id, starts_on, current, before, after, plan_basis, edit }` | `{ reviewed:false, ...refusal(code) }` |
| `host.save(review_id)` | `:190` (`async save`) | `{ ok:true, acknowledged:true, op_id, intent_id, starts_on, edit }` | refusal; the STALE refusal also carries `current`, `plan_basis`, `pending_dates`, `starts_on` (**`:214-:216`**, corrected in v3, R2 N1) |
| `host.cancel(review_id)` | `:252` | drops the review, writes nothing | n/a |
| `host.close()` | `:253` | every later call refuses `LOCAL_CLIENT_CLOSED` | n/a |

`read()`'s `state` is the PROJECTED state for the date asked: `readVerified` (**`:145-:153`**,
corrected in v3, R2 N1) reopens the lane (`:148 await lane.reopen()`) and returns
`read(lastGeneration, date || localDay())`, the projector's own read. That matters in 3.4, because it
is the only place in the tree that knows what the athlete's week is after an edit, **and because
`lane.reopen()` is the act `DECISIONS:543`'s WRITER-FENCE forbids to any released file.**

The host is constructed at `plan-edit-host.mjs:42` and REQUIRES `client, clock, liveDay, basisState,
setupOperation, validateTags, projectNewExerciseTags, newIntentId, athleteLabel, namespace`. Missing
`athleteLabel` or `namespace` is `PLAN_EDIT_HOST_INCOMPLETE` (`:53`), deliberately, because defaulting
them would silently widen `admittedLocalSourceBasis` from "this athlete's admitted import" to "any
admitted import" (the comment at `:46-:51`). **The page does not pass them: under `:543` nothing on
the released side constructs this host at all. The SEALED factory of 3.4 passes them, beside the raw
`admittedLocalSourceState`.**

**THREE of those ten arguments have NO production provider, not two (v3, and it is one more than
R1 B3 and v2 both said). MEASURED IN v4, THE TAG PAIR IS A TAG TRIO AND IT GATES THE FIRST READ
(SPIKE M1 rows 1, 5, 7, 10 and 12).** Without `validateTags` the FIRST `host.read()` refuses
`PLAN_EDIT_TAGS_INVALID` on EVERY installation, imported included, at projector construction
(`plan-edit-model.cjs:203` into `plan-edit-commands.cjs:66`), which is a door that does not open
rather than an action that refuses; and on a FIRST RUN installation the basis itself must be
projected by F2's `projectSetupTags` or the read refuses `PLAN_EDIT_TAG_BASIS_UNPROVEN`
(`plan-edit-model.cjs:217`, SPIKE M1 rows 2 and 12). `validateTags` and `projectNewExerciseTags` are ruled in 3.5.
`newIntentId` is the third: measured at `00e7a0d0`,
`grep -rn 'newIntentId' rebuild --include=*.mjs --include=*.cjs` returns the parameter at
`plan-edit-host.mjs:43`, its hard `TypeError` at `:45`, its one call site at `:170`, and THREE test
or lane suppliers (`durable-host.test.mjs:131` and the two Astra review annexes at `:65`). Nothing
in product mints one. It is cheap, unlike the tag pair, and 3.4 names where it comes from.

**The edit shapes, from `plan-edit-commands.cjs:69 editOf` (re-counted at the tip; v1's rows were
off by one in the same direction, R1 N1). RE-FILED IN v4: the RELEASED editor does NOT build these
objects. It hands `onWeek` the RAW FIELD VALUES (a kind, an exercise id, and whichever of the six
fields the athlete changed) and the SEALED lane assembles the edit, because assembling it is
shaping what a durable operation carries and `E-R12` puts that on the sealed side.** The shapes are
printed here because the released editor must know which FIELDS each kind needs, and for no other
reason:

| kind | shape | line |
|---|---|---|
| update | `{ kind, exercise_id, changes }`, changes a non empty subset of `n, day, sets, hi, inc, steps` | `:71-:74` |
| remove | `{ kind, exercise_id }` | `:75` |
| add | `{ kind, exercise, tags }` | `:76-:79` |
| replace | `{ kind, exercise_id, exercise, tags }`, and `exercise_id !== exercise.id` or it refuses | `:76-:79` |

Field law, `plan-edit-commands.cjs:47 fieldOf`: `id`, `n`, `mg` are non empty text; `day` is `'U'` or
`'L'` and nothing else; `sets` and `hi` are safe integers of at least 1; `inc` is finite and positive;
`steps` is a non empty, strictly ascending array of positive numbers. The editor uses THESE, not
setup's starter chips, because an established athlete's values may sit outside the chips (brief,
Exercises paragraph) and coercing them is EW-02's failure.

### 2.2 The states, the copy, the call and the refusals

Copy marked SOURCED is verbatim from the accepted brief's "Exact copy" table and may not be reworded.
Copy marked SOURCED FROM CODE is verbatim from the companion and may not be reworded either.
**This spec proposes no new sentence except the four the PM ASKED for at `E-R9`, which are marked
PROPOSED FOR THE PM in 2.2.2 and which the PM rules on at acceptance (v3).** `{date}` and `{name}`
are actual values, never left in the UI. No copy in this file or proposed by it contains a dash
character of any kind.

**THE COMMON SET, named once so no row has to say "the E3 set" and inherit a code it cannot raise
(v3, R2 B6).** Every `review()` of every kind can return `PLAN_EDIT_INPUT_INVALID`
(`plan-edit-commands.cjs:5`, the default of `fail`), `PLAN_EDIT_DATE_INVALID` (`:35` and `:38`) and
`PLAN_EDIT_STALE_BASIS` (`plan-edit-model.cjs:386-:387`) and `PLAN_EDIT_DUPLICATE_INTENT` (`:388`),
plus the host's own `PLAN_EDIT_INTENT_CONFLICT` (`plan-edit-host.mjs:171-:172`).
Everything beyond that belongs to ONE branch of `apply()` and is named per row.

**HOW TO READ THE `call` COLUMN AFTER `E-R12`.** Every `host.*` and `machineSettings.*` name in it
is a call the SEALED edit week lane makes. The RELEASED editor calls the matching entry of the
frozen callback table `onWeek` with raw field values and paints the result object it gets back:
`onWeek.openWeek()` serves E0 from ONE `host.read()`; `onWeek.review(kind, exercise_id, fields)`
serves E3, E4, E5 and E6; `onWeek.saveChange(review_id)` serves S; `onWeek.cancel(review_id)` and
`onWeek.closeEditor()` serve the two exits; `onWeek.machineLatest(exercise_id)` and
`onWeek.machineSave(exercise_id, rows, cue)` serve M1 and M2. **The released file never holds a
host, a lane, a review handle that is anything but an opaque id, or an assembled edit object.**

**TWO OF THOSE SEVEN NAMES CHANGED IN v5 (`E-R22`, R4 B3 UPHELD), AND THE REASON IS THE FENCE THIS
SPEC MAKES ITS OWN BAR.** v4 called them `onWeek.save(review_id)` and `onWeek.close()`. **`.save`
and `.close` are BOTH on TODAY-SPLIT E.3's durable-writer word list, as MEMBER NAMES in code
position**, and E.4 scans the call side with a TOKEN scan over identifiers and member names, which
cannot tell `onWeek.save(...)` from `host.save(...)` and is not meant to. The census 2.1 ran was of
the two OBJECT names (`weekFacade`, `onWeek`); the fence looks at their MEMBERS. **Measured,
`spike/r5-fence-names.mjs` against E.3 at `rebuild/c-today-split@24b35244` (E.3 byte-identical to
`60d6ad97`): the list carries 28 member names; v4's seven members hit TWO of them, `save`
unqualified and `close` qualified "on a host identifier" in a way a token scan cannot honour; v5's
seven hit ZERO.** The renames follow TODAY-SPLIT's own B.3 pattern, which renamed `on.recover` to
`on.recoverWorkout` for the same reason: `save` becomes `saveChange`, `close` becomes `closeEditor`,
and `open` becomes `openWeek` because a one-word verb next to a fenced list is a name waiting to
collide. `review`, `cancel`, `machineLatest` and `machineSave` were already clear and do not move.
**The SEALED lane's own calls are unchanged: it still calls `host.save`, `host.close` and
`machineSettings.latest`, which is what a sealed file is for.**

| state | copy | call | refusals it must draw |
|---|---|---|---|
| E0 Entry | SOURCED title `Edit my week`; SOURCED intro `What would you like to change?`; SOURCED doors `Exercises` and `Machine settings` (two, not four); SOURCED, when a pending edit exists, `Changes already saved for {date}` | `host.read()` on open, once | `PLAN_EDIT_READ_REFUSED`, `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` (`plan-edit-model.cjs:240`), `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`, `PLAN_EDIT_HOST_INCOMPLETE`, `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`, `LOCAL_CLIENT_CLOSED`, **and `PLAN_EDIT_TAG_BASIS_UNPROVEN`, moved here from E4 and E6 in v3: `:217` and `:219` fire inside `createPlanEditProjector`'s own body, which `projectorFor` (`plan-edit-host.mjs:68`) runs on the FIRST read, so no review path can raise it. Same class of error as R2 B6, found by re-measuring the rows B6 made me re-read**, **and IN v4 `PLAN_EDIT_TAGS_INVALID` (`plan-edit-commands.cjs:66` from `plan-edit-model.cjs:203`), which SPIKE M1 rows 1, 5 and 7 measure as the FIRST code on EVERY installation when the F2 collaborators are absent: it is a DOOR THAT DOES NOT OPEN, not an action that refuses**, **and `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` (`plan-edit-model.cjs:101`) and `PLAN_EDIT_BASIS_HASH_INVALID` (`:104`), moved here in v4 (R3 N6): `:101` fires in the projector body before any generation is read and `:104` first fires from `basisAt` (`:302`) during the same first read, so E0 is the door they arrive at even though state X is the treatment they draw** |
| E1 Exercise list | SOURCED `Choose an exercise` and `Add exercise`; each row shows the lift's own current name, day and set count. **CORRECTED IN v6 (`E-R35`, Astra F6, MEASURED): from the PENDING view, `read(starts_on).state`, NOT from `read().state`.** `read().state` is TODAY's plan, and measured (`spike/ew2r6-w4-pending-view.mjs`) a saved add is NOT in it while a saved removal STILL is, so the athlete cannot select the lift he just added and can select the one he just removed. **`onWeek.openWeek()` returns BOTH views from its ONE `host.read()`, each explicitly dated; the list and every field default in E3 come from `pending`, and `current` is what the card shows. Today's workout is IMMUTABLE and is never edited from this screen** | none; pure render of the two dated views E0 already read | none; a list that cannot render is E0's refusal, not its own |
| E2 Exercise actions | SOURCED `Edit exercise`, `Replace exercise`, `Remove from week` | none | none |
| E3 Edit exercise | SOURCED label helper `Changing the name keeps this exercise's records.`; the six editable fields of 2.1 with the existing setup field errors verbatim; **when `day` is one of the changes, on `PLAN_EDIT_DAY_UNCOVERED`, SOURCED from `BRIEF-EDIT-MY-WEEK.md:61`, `Choose a training day for each exercise before saving.`** | `host.review({kind:'update', ...})` on `Review change` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`plan-edit-model.cjs:321`), `PLAN_EDIT_NO_CHANGE` (`:329`, the update branch and nowhere else) and `PLAN_EDIT_DAY_UNCOVERED` (`:326` reached from `:330`) |
| E4 Replace | SOURCED `The new exercise starts without a recorded load. Your old sessions stay in your history.`; **plus E3's `PLAN_EDIT_DAY_UNCOVERED` sentence, same source, because `:345` calls `covered(row.day)` on this branch too** | `host.review({kind:'replace', ...})` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`:321`), `PLAN_EDIT_DAY_UNCOVERED` (`:326` from `:345`), `PLAN_EDIT_ID_REUSED` (`:389` in `preview()` and `:346` in `apply()`), `PLAN_EDIT_TAGS_INVALID` (`plan-edit-commands.cjs:66`), `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` (`:390`) and `PLAN_EDIT_NEW_TAG_PROJECTION_INVALID` (`:355`) |
| E5 Remove | SOURCED `This exercise will leave your week on {date}. Your old sessions stay in your history.` | `host.review({kind:'remove', exercise_id})` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`:321`) and `PLAN_EDIT_WEEK_EMPTY` (`:341`, 2.2.2). **It draws NEITHER `PLAN_EDIT_DAY_UNCOVERED` NOR `PLAN_EDIT_NO_CHANGE`: neither is reachable on this branch (v3, R2 B6)** |
| E6 Add | SOURCED `Add exercise`; **the muscle vocabulary comes from `exercise-catalogue.mjs` and NOT from `setup-model.mjs` (v4, R3 N7 answered against TODAY-SPLIT E.3): `exercise-catalogue.mjs` is ON E.3's closed MAY-IMPORT list and exports `GROUPS`, `GROUP_MG`, `REGIONS`, `REGION_MG`, `ENGINE_MG`, `CATALOGUE`, `searchByName` and `regionsOf`, which is the whole vocabulary this door needs; `setup-model.mjs` is NOT on that list and, measured by me at `ad8ced07`, `setup-model.mjs:14` imports `../../../m4/workout/athlete-state.cjs`, which E.3's module edges FAIL as `rebuild/m4/**`. So importing it would fail the fence 6.8 makes this spec's bar, and the field components are re-expressed in `edit-week-view.mjs` over the same catalogue**; **plus E3's `PLAN_EDIT_DAY_UNCOVERED` sentence, same source, `:345`** | `host.review({kind:'add', ...})` | E4's set MINUS `PLAN_EDIT_TARGET_UNAVAILABLE`: an `add` carries no `exercise_id`, so `:321`'s guard is not entered |
| E7 Unchanged draft | SOURCED `Nothing has changed yet.` | the refusal `PLAN_EDIT_NO_CHANGE` maps to this sentence; the page does not decide it locally | `PLAN_EDIT_NO_CHANGE` |
| R Review | SOURCED `Starts {date}`, `Current`, `After this change`; SOURCED actions `Save change`, `Keep editing`, `Cancel` | render of `review()`'s `current`, `before`, `after`, `starts_on` | none of its own |
| S Saving | no new copy; the existing in flight treatment. Save is disabled while in flight so one deliberate save is one operation. **ADDED IN v6 (`E-R36`, Astra F7, MEASURED): CANCEL, BACK AND CLOSE ARE DISABLED TOO, for exactly as long, and the editor's exits WAIT for the outcome.** Measured (`spike/ew2r6-w5-inflight.mjs`), a `close()` or a `cancel()` fired the instant the real durable commit returns leaves ONE committed operation on disk and hands the athlete `LOCAL_CLIENT_CLOSED` or `PLAN_EDIT_REVIEW_REQUIRED`. **AND IF THE PAGE OR THE HOST DIES ANYWAY, the next open reconciles by the stable review intent BEFORE any new review or exercise id is minted, and shows a committed edit as SAVED. CANCEL IS NEVER AN UNDO: after a save has committed it closes the screen and changes nothing, and no control on this screen may be labelled or placed so that the athlete could read it as undoing his change** | `host.save(review_id)` | n/a |
| V Saved, structural | SOURCED `Saved for {date}.` | shown ONLY on `{ ok:true, acknowledged:true }` | never shown on any other reply |
| V2 Saved, notes | SOURCED `Saved on this device.` | the Machine settings door's own save. **CORRECTED IN v6 (`E-R38` F9, Astra F9): the note save's success shape is NOT the edit save's.** `machine-settings-host.mjs:102-103` returns `{ ok, state, copy, code, op_id }` where `ok` is `result.acknowledged === true`; it has no `acknowledged` member of its own. **So V2 is shown ONLY on `ok === true`, and V's `{ok:true, acknowledged:true}` rule does NOT extend to this row unaltered. The two words are named here so a builder does not read one reply with the other's rule.** The VALIDATION OWNER is the SEALED side: `machineOf` in the producer is the one gate, `acceptable()` only asks it, and no assembled machine is validated in the page after `E-R12` moved assembly sealed | never shown on any other reply |
| T Stale, the week really did change | SOURCED `Your week changed while this was open. Review the latest week before saving.` and the result drawn beside it from the refusal's own `current` and `starts_on` | THREE codes only: `PLAN_EDIT_REVIEW_STALE`, `PLAN_EDIT_STALE_BASIS`, `PLAN_EDIT_BASIS_INVALIDATED` (`plan-edit-model.cjs:300`, `:309`: a causal parent stopped being active, or the seen basis disagrees) | the draft survives; nothing is rebased for him |
| D Day turned | SOURCED FROM CODE, verbatim from `plan-edit-host.mjs:24`: `The day changed while this was open. Review the latest week before saving.` | `PLAN_EDIT_DAY_TURNED` (`plan-edit-host.mjs:23`) | the draft survives |
| X Durable refusal | the existing actionable refusal behaviour, unchanged; never the word Saved | `PLAN_EDIT_SAVE_OUTCOME_UNKNOWN`, `PLAN_EDIT_BATCH_MISMATCH`, `PLAN_EDIT_INTENT_CONFLICT`, `PLAN_EDIT_DUPLICATE_INTENT`, `PLAN_EDIT_REVIEW_REQUIRED`, `PLAN_EDIT_PROJECTION_REFUSED`, `PLAN_EDIT_HISTORY_UNPROVEN`, `PLAN_EDIT_ORIGIN_UNPROVEN`, `PLAN_EDIT_REJECTION_UNPROVEN`, `PLAN_EDIT_TOMBSTONE_UNPROVEN`, `PLAN_EDIT_DATE_ORDER_UNPROVEN`, `LOCAL_CLIENT_CLOSED`, and the three of 2.2.2 | the draft survives; lease, storage, integrity and closed era all land here |
| M1 Machine settings, read | SOURCED helper `Keep the settings you want to remember for this machine.` | **RE-CUT IN v4 (`E-R12`, R3 B1 (ii)): the RELEASED view calls `onWeek.machineLatest(exercise_id)`; the SEALED lane holds `createMachineSettingsHost` (`machine-settings-host.mjs:63`) and makes the `.latest` call, both of which are on TODAY-SPLIT E.3's entry point list, and returns **CORRECTED IN v6 (`E-R38` F9, Astra F9, MEASURED): the LATEST RECORD, once, and NOT a draft.** v5 said the lane returns the DRAFT and the view then runs `draftFrom(latest)` over it. Measured (`spike/ew2r6-w7-machine-note.mjs`), `draftFrom(draftFrom(record))` is `{"rows":[{"name":"","value":""}],"cues":""}` and `machineFromDraft` of that is `null`: **the second conversion erases the athlete's stored settings and his cue from the screen he opened to correct them.** So the conversion happens EXACTLY ONCE, and the spec names where: the SEALED lane returns the record `machine-settings-host.mjs:89 latest()` gives it, and the RELEASED view calls `machineSettingsView.draftFrom` on it, which is a PURE view helper on E.3's MAY-IMPORT list. **AND A NOTE WRITTEN UNDER A DOCUMENT ID IS READ THROUGH `E-R30`'s ONE BOUNDARY AND THROUGH NO OTHER: `:89` is an exact id lookup, so after an import the read key is the TRANSLATED id; `source-admission.mjs:524` retaining the note is not by itself a read path** | the era and lease refusals the existing host already raises |
| M2 Machine settings, edit | the existing editor rows and cue field, `renderEditor` (`machine-settings-view.mjs:115`), `MAX_ROWS` (`:23`) unchanged | **RE-CUT IN v4: the released view calls `onWeek.machineSave(exercise_id, rows, cue)` with RAW VALUES; the SEALED lane calls `machineFromDraft` and `machineSettings.save(...)` (`machine-settings-host.mjs:93`), because assembling the machine record and writing it are both what `E-R12` seals.** `machineFromDraft` moves with the write, since it shapes what the durable operation carries | `MACHINE_SETTINGS_INPUT_INVALID` is a THROWN `TypeError` (`rebuild/coach/machine-settings-commands.cjs:39`), not a refusal reply: **the SEALED lane catches it and returns a refusal result object; the released view paints it** (R1 N8, re-filed in v4) |
| M3 Last note empty | SOURCED `Keep a setting or a cue. Clearing the last note is not available here yet.` | the page refuses BEFORE calling save, using `acceptable(machine)` (`machine-settings-view.mjs:53`); it never claims a blank save erased a note | ruling (b) of `:176` |

### 2.2.1 The boundary the editor refuses outright, stated in words (v2, R1 N7)

As merged, the companion does not open at all for some installations, and no state above says so. A
builder discovers it at the first fixture with a sync frontier. Measured in `plan-edit-model.cjs`
`inspect()`:

- `:226` `(collections.sync?.frontier?.W ?? 0) !== 0` and `:227` a recovery plan or a non empty
  snapshot plan both refuse `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`.
- `:235` an import present without a first run, or the reverse, and `:237-:238` an import present but
  not admitted, refuse the same code.
- `:242-:243` a non empty `collections.plan` or `collections.planTransactions` refuses
  `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`.

**RULE: Edit My Week v1 is a PRE-SYNC, LOCAL-ONLY editor.** State E0 already lists both codes. EW-01
asserts the boundary in both directions: a clean local installation opens both doors, and an
installation with a sync frontier of anything but zero refuses at E0 and never shows a door. The
screen draws E0's refusal treatment and no door, and it does not pretend the athlete can edit.

### 2.2.2 The four in-scope refusal codes with NO true sentence anywhere (v2, R1 N5, N6)

Four codes, in three rows below, reach the athlete in the narrowest door and have no true sentence in
the brief, in the code, or in the inventory. This spec does NOT invent one for them, because law 4 forbids it and
because a guessed sentence about storage is the defect R1 B5 caught in v1.

| code | where it fires | why no sourced sentence fits | interim |
|---|---|---|---|
| `PLAN_EDIT_WEEK_EMPTY` | `plan-edit-model.cjs:341`, removing the last non retired lift | the brief has no row for it | state X's actionable refusal treatment. The screen MAY also decline to offer `Remove from week` when `read().state` shows one remaining non retired lift, as an affordance, but it never claims the refusal did not happen |
| `PLAN_EDIT_BASIS_SOURCE_CHANGED` | `plan-edit-host.mjs:77`, an import became present or absent under the open editor | the week did NOT change; the BASIS SOURCE did. The brief's stale sentence is false here | state X, and the editor re-reads from E0 rather than offering Save |
| `PLAN_EDIT_BASIS_HASH_INVALID` and `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` | `plan-edit-model.cjs:104` and `:101`; a digest that is not 64 hex, and a host built without `hashBasis` | both are construction or integrity facts about storage, not facts about his week | state X |

These four codes (three rows) are COPY INVENTORY ITEMS the PM must seat before EW-05 ships. They are
question Q-F in 9.4 and item 12 in the design lane's list at 8.2.

#### 2.2.2.1 FOUR SENTENCES PROPOSED FOR THE PM (v3, `E-R9`)

The PM ASKED for these at `E-R9` and rules on them at acceptance. Until he does, the interim above
stands and none of them is built. Each is one sentence pair, true for its own field, saying what
happened and what the athlete can do. **No dash of any kind, no readiness word, no exclamation
mark, no emoji, and `Report a problem` is quoted from the approved control's own label
(`today-app.cjs:223 PROBLEM_ENTRY`, `design.cjs:193`), not invented.** A builder ships NONE of them
until the PM rules; law 4 still forbids any sentence the PM has not seated.

| code | PROPOSED FOR THE PM | why it is true for that field |
|---|---|---|
| `PLAN_EDIT_WEEK_EMPTY` (`plan-edit-model.cjs:341`) | `Your week needs at least one exercise. Replace this one instead of removing it.` | `:340-:341` refuses only when every OTHER lift is already retired. Replace is the action that is still open to him in the same door, and it is the narrowed v1 need in the owner's own words |
| `PLAN_EDIT_BASIS_SOURCE_CHANGED` (`plan-edit-host.mjs:77`) | **RE-PROPOSED IN v4 so it is TRUE IN BOTH DIRECTIONS (`E-R18`, R3 N5 upheld):** `The history stored on this device changed while this was open. Open Edit my week again to see your current week.` **v3 proposed `Your imported history changed on this device ...` and R3 is right that it is false in one of its two directions: `plan-edit-host.mjs:69` is `const source = Model.importPresentIn(generation) ? 'local-source' : 'first-run';` and `:77` refuses whenever `boundSource !== source`, which fires when an import APPEARS as well as when one DISAPPEARS. On the appearing direction the athlete had no imported history a moment ago, so "your imported history changed" describes something that did not exist. The new first sentence names the FACT both directions share, which is that what this device stores for him is not what the editor opened on, and it names neither direction. v3's proposal is WITHDRAWN.** | `:68-:77` refuses on either direction of `boundSource`. His WEEK did not change, so the brief's stale sentence would be false. The remedy half is measured: re-opening constructs a new host, `boundSource` returns to `null` at `plan-edit-host.mjs:67`, and the read succeeds, which is 2.2.2's own interim |
| `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` (`plan-edit-model.cjs:101`) | `Edit my week could not start on this device. Nothing in your week changed. Open it again, and use Report a problem if it keeps happening.` | `:101` fires when the projector is built with no `hashBasis` at all, before any generation is read, so nothing was written and "nothing in your week changed" is exactly true |
| `PLAN_EDIT_BASIS_HASH_INVALID` (`plan-edit-model.cjs:104`) | `Edit my week could not check your week on this device. Nothing in your week changed. Open it again, and use Report a problem if it keeps happening.` | `:102-:104` fires when the digest is not 64 hex: the hash ran and its answer failed the shape law, which is a CHECK that failed rather than a start that failed. Nothing was written |

**Stated plainly, because a reviewer should not have to find it:** the last two sentences are close
to each other on purpose. To the athlete the two facts are one fact (the editor cannot verify its
own basis on this device) and the honest difference is only whether the check ran. If the PM
prefers ONE sentence for both codes, that is a smaller inventory and this spec does not object; it
proposes two because `E-R9` asked for one per code.

### 2.3 Copy laws that bind every string above

1. No U+2013 and no U+2014 anywhere, in the file or on screen. The render boundary is
   `rebuild/m3/w7-preview/today/plain-copy.cjs` (`plainCopy`, `plainOrDrop`), which `today-entry.mjs:30`
   already imports for exactly this rule (`DECISIONS:114` (1)). The editor renders through it.
2. No emoji and no exclamation mark (brief, EW-16).
3. No readiness word. The headline vocabulary check lives in `browser-check.mjs`
   (`headlineVocabulary`, `assertNoDashOnScreen`). **RESTATED AS A STANDING RULE in v3 (R2 N3.8.3).**
   v2 said EW2-BUILD may not treat a green run of it as evidence "until S9 gives it one". `:542` (B)
   rules that **`browser-check.mjs` stays outside, gets NO CI home, is run on the PC before each
   seal and is recorded in the verdict.** So the wait v2 described never ends, and the rule is now
   unconditional: **a green `browser-check.mjs` run is never this suite's evidence, in any round.**
   The suite asserts the copy census itself, in its own cells, and that is the only proof the bar
   counts.
4. **ZERO new sentences are proposed by this spec, with ONE named exception the PM asked for
   (v3).** Every string in 2.2 is SOURCED from the accepted brief or SOURCED FROM CODE. The four
   sentences of 2.2.2.1 are PROPOSED FOR THE PM under `E-R9` and are not copy until he rules: a
   builder ships none of them before that. A builder that finds it needs ANY OTHER new sentence
   files it in the copy inventory and stops for the PM.

---

## 3. THE SPLIT: WHICH HALF SHIPS AS LANE C, WHICH HALF RIDES A CHILD

### 3.0 THE SPLIT'S DIRECTION CHANGED UNDER THIS SPEC, AND SECTION 3 IS RE-CUT (v3, `E-R1`)

v2's section 3 was written for a world in which `today-app.cjs` stays SEALED and part 2's route and
mount therefore ride a reseal child. **`DECISIONS:543` reverses that**, and it landed after v2's
base:

- the WRITES regions leave `today-app.cjs` for ONE new SEALED module, working name
  `today-lanes.cjs`, and `today-app.cjs` itself is **RELEASED**, keeping its name, `mountToday`,
  **the router** and every drawing and read only binding region;
- one sealed factory owns **every lane opener, host, IndexedDB handle, the adoption gate, rebase and
  every durable write**, and hands the released view two frozen things: a READ ONLY facade and a
  CALLBACK TABLE taking RAW field values;
- **THE STRICT CALL SITE RULE: no released file calls, imports or holds a writer**, enforced by a
  sealed **WRITER-FENCE** cell that fails when any file outside the sealed inventory calls a writer,
  opens IndexedDB or imports a host (`:542` (C) dispatched it, `:543` kept it);
- `gym-app.mjs` is the second extraction and rides the same lane; no other sealed file is opened.

**WHAT RIDES S10 AND WHAT SHIPS AS LANE C, said in one place because it is the answer to the
ticket's own question:**

**RE-CUT IN v4 UNDER `E-R12`. Three things moved from the left column to the right: the adoption
compose (`planEditedState`), the tag shim, and the Machine settings door's two calls. What is left
on the left is VIEW ONLY, in the PM's own words.**

| ships as LANE C, released, VIEW ONLY | rides S10, sealed |
|---|---|
| **FOUR** new released files of 3.3 line 1 and the suite (v3 said six; `edit-week-basis.mjs` and `edit-week-tags.mjs` are GONE from this column, into the sealed lane) | **`edit-week-lane.cjs`, NEW and SEALED:** host construction, `read`, `review`, `save`, `cancel`, `close`, the Machine settings door's host and its two calls, the adoption compose, the F2 collaborators and the basis projection step, `newIntentId` (3.4.1) |
| the `t-edit-week` block in `screens.template.html` | `today-entry.mjs`'s `createEditWeekEntry` (that file is SEALED at `:141 await host.save(document_)` and `:543` does not release it) |
| | `today-lanes.cjs` gains ONE import of `edit-week-lane.cjs` and the editor's entries on `facade` and `on` (about ten lines), which is the whole of this item's footprint in the file TODAY-SPLIT byte-proves |
| **THE ROUTE in the `[data-go]` router and THE MOUNT CALL**, because `today-app.cjs` is released and the router goes with it (`TODAY-SPLIT-SPEC.md:84`: `:826` is the `[data-go]` router binding; `:113`: `render` is `:2272-:2376`, a DRAWS region) | section 3.5's F2 package at `rebuild/m4/workout/setup-tags.cjs` |
| `preview.css` once S9 seals | section 4.4's admission work, now **THREE** sealed files, because SPIKE M4 FACT 1 adds a replay family for the `plan` class |
| | the `.github/workflows/rebuild.yml` registration (3.3 line 7), the PM's |

**THE ONE THING A BUILDER MUST NOT READ INTO THIS.** The route and the mount being lane C does NOT
mean the wiring half shrank to nothing. It moved: the expensive part was never the route, it was
the adoption chain, and `:543` puts the whole of it on the sealed side by name ("the adoption
gate, rebase"). Q-A said as much in v2 and it is now the ledger's own words.

**TIMING, stated so nobody builds against a file that does not exist.** TODAY-SPLIT is at SPEC
stage: `:543` dispatched spec round 2 with review, fix round and R2, and "the build starts only on
the PM's acceptance of the spec" (`:542` (C)). **v3 said round 2 was NOT pushed. STALE, and R3 N4
is upheld: TODAY-SPLIT-SPEC v2 IS pushed and the branch is at `906cb056`. I synced it and read it,
and it is GOOD NEWS for section 3, not bad.** v2 names the sealed module
`rebuild/m3/w7-preview/today/today-lanes.cjs`, exactly as 3.2's row guessed; it classifies
`athleteBasisState` `:2482-:2489` and `adoptAthleteState` `:2490-:2546` as WRITES moving "YES,
whole", so 3.4.4's four requirements are met by the design as it stands; it keeps the router
released; and its B.3 gives the interface `E-R12` asks this item to use. **THREE things section 3
picks up from it and nothing else does:** (1) it creates a SECOND sealed module,
`gym-settings-lane.mjs` (the `gym-app.mjs` extraction), added to 3.2's table; (2) its E.3 prints an
EXACT expected re-export census after the split (`createTodayModel` 2, `createTodayLanes` 2,
`model` 2, `options` 2 in `today-app.cjs`), which 3.3 line 2a's route and mount hunk MUST NOT
disturb, and does not, because it names `weekFacade` and `onWeek` and neither `model` nor
`options`; (3) its E.2 defines FREE as "present in the directory listing of
`rebuild/m3/w7-preview/today/`, source files only, `test/` excluded, AND absent from the
inventory's `product` and `executionPins` OR present in its `released` block", which has a
consequence 3.4.1 pays for by name. So
`today-lanes.cjs` does not exist yet and section 3.4's sealed entry lands in whichever module the
split creates. **STOP condition 2 is rewritten in 9.1 to cover that: if TODAY-SPLIT is accepted
with a different interface, section 3 is re-judged before a byte moves.**

### 3.1 The release list, and what it still decides

`DECISIONS:536` released presentation only files from the seal in the owner's words and left the
closed list to S9. S9's spec exists: `rebuild/lanes/b/S9-RELEASE-SPEC.md` on `rebuild/b-s9-ui-pins`,
read at `d859096a` (v2 of the spec at `c0bb04e`, plus its own review R2). Its section A.6 THE CLOSED
LIST is TWO paths, not eight:

```
rebuild/m3/w7-preview/today/preview.css
rebuild/m3/w7-preview/today/build.mjs
```

and the second is CONDITIONAL on hunk H18 landing in the same package (`S9-RELEASE-SPEC.md:218-:223`):
without H18 the closed list is ONE path. **`:542` (B) PM-ACCEPTS that two path list and does NOT
re-open `:536`**, so this is settled rather than provisional, which is better news than v2 had.

`today-app.cjs` is judged SEALED in S9 A.2 **as it stands today**, and it is the file `:543` splits
so that it can be released. **v2 relayed S9's sentence about it without re-measuring, and one member
of its list of five is wrong (v3, R2 N3.4).** Re-measured by me at `00e7a0d0`, line by line:

| what v2 relayed | measured |
|---|---|
| five IndexedDB lane openers, `:513`, `:596`, `:637`, `:2052`, `:1416` | **FOUR.** `:513`, `:596`, `:637` and `:2052` each read `(view && view.indexedDB) \|\| globalThis.indexedDB`. `:1416` is `const pending = Promise.resolve().then(() => checkin.host.forDate(day))`, which opens nothing. R2 is right |
| three durable writers from three click handlers | the PM's own list at `:542` (A) names SIX, and I verified all six: `host.save :493`, `host.save :581`, `model.weighIn :1072`, `foodLane.save :1293`, `sleepLane.save :1843`, `workout.gym.rebase :2501` |

The lesson is the one R2 drew and it is worth a line: **a relayed measurement is re-measured or
marked as relayed.** Everything in 3.2's table below was queried by my own script, not relayed.

`today-entry.mjs` is SEALED at `:141 await host.save(document_)`, verified. `gym-app.mjs` SEALED at
`:161-:166`. `machine-settings-host.mjs` SEALED at `:63-:85`.

**S9's own document is still at REJECT R2** (`d859096a`, two BLOCKING, both document edits, neither
moving the closed list). Its LIST is accepted; its SPEC is in round 3. Nothing in section 3 depends
on the difference.

### 3.2 Every path, checked against the seal by machine

Method, so a reviewer can repeat it, and it is CORRECTED in v2 (R1 N2, partly disputed in 10.2).
**RE-RUN IN FULL FOR v3 at `00e7a0d0` by my own script, not relayed from v2:** the three counts
below and every YES and NO in the table came back identical, which is the third independent run of
this query (v2's, R2's and mine) with the same answer. A small script parsed
`rebuild/m4/spec/acceptance-s8-real-shape.json` and asked it about each path below by exact string,
against THREE named key sets, reported separately because they have different consequences:

- `product`, **224 keys**: the pin list a reseal child exists to move. THIS is the column below.
- `executionPins`, **71 keys**: test and spec pins. No path below is in it.
- `protectedSurfaces`, **2 keys**. No path below is in it.

Union of the three: **229**. (Union of `product` and `executionPins` alone: 227.) The artifact's
contents were not printed and are not reproduced here; only counts and per-path YES/NO. Exact path,
never directory: the prefix `rebuild/m3/w7-preview/today/test/` occurs many times in that artifact,
so a NEW file under it proves nothing by its neighbours.

| path | in `product`? | S9 verdict | half |
|---|---|---|---|
| `rebuild/m3/w7-preview/today/edit-week-model.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/edit-week-view.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/edit-week-check.mjs` | NO (new file) | n/a | VIEW |
| ~~`rebuild/m3/w7-preview/today/edit-week-tags.mjs`~~ | **DELETED IN v4.** The tag shim was a RELEASED file that `createRequire`d `rebuild/m4/workout/setup-tags.cjs`, which TODAY-SPLIT E.3's module edges FAIL, and whose projection shapes what a durable operation carries. `E-R12` puts it in the sealed lane (R3 B1 (iii)) | n/a | **GONE** |
| ~~`rebuild/m3/w7-preview/today/edit-week-basis.mjs`~~ | **DELETED IN v4.** `planEditedState` DECIDES WHAT TODAY ADOPTS, which `E-R12` and PM NOTE b put on the sealed side however pure it is, and SPIKE M3 rows 3 to 10 measure that feeding it the wrong value is the difference between a working editor and a refusal. See 3.4.1 | n/a | **GONE** |
| **`rebuild/m3/w7-preview/today/edit-week-lane.cjs`** | **NO (new file, v4)**, and landing it ADDS a `product` entry with role `new`, exactly the act SPIKE M6 measures for the F2 package | n/a | **SEALED, S10. The whole of this item's durable half (3.4.1)** |
| `rebuild/m3/w7-preview/today/today-lanes.cjs` | **does not exist yet**; created by TODAY-SPLIT, named by that name in its v2 at `906cb056` (R3 N4), at spec stage | n/a | **SEALED. It imports `edit-week-lane.cjs` and carries the editor's `facade` and `on` entries, about ten lines** |
| `rebuild/m3/w7-preview/today/gym-settings-lane.mjs` | **does not exist yet**; the SECOND sealed module TODAY-SPLIT v2 creates for the `gym-app.mjs` extraction. **ADDED IN v4, R3 N4** | n/a | SEALED, and this item takes ZERO bytes in it |
| `rebuild/m3/w7-preview/today/test/edit-week.test.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/screens.template.html` | NO | already unsealed; editable today | VIEW |
| `rebuild/m3/w7-preview/today/machine-settings-view.mjs` | NO | already unsealed; C-UI-5 owns it | VIEW, coordinated |
| `rebuild/m3/w7-preview/today/setup-model.mjs` | NO | **NOT USED BY THIS ITEM AFTER v4 (R3 N7).** It is not on TODAY-SPLIT E.3's closed MAY-IMPORT list, and measured by me at `ad8ced07` its own `:14` imports `../../../m4/workout/athlete-state.cjs`, which E.3's module edges FAIL as `rebuild/m4/**`. Under E.2 it is FREE (absent from `product` and `executionPins`), so the fence scans it, so it is a `FENCE-VIEW-IMPORT` of TODAY-SPLIT's own making and not this item's to fix | **NOT TOUCHED, NOT IMPORTED.** 2.2's E6 takes the vocabulary from `exercise-catalogue.mjs` instead. Reported to TODAY-SPLIT as a finding; STOP 2 carries it |
| `rebuild/m3/w7-preview/today/exercise-catalogue.mjs` | NO | on E.3's MAY-IMPORT list by name. **ADDED IN v4** | VIEW, no edit: E6's vocabulary source |
| `rebuild/m3/w7-preview/today/setup-host.mjs` | NO | not in the seal at all. **v2 called `setupsIn(generation, profile)` at `:45` the `setupOperation` source and that is WRONG: 3.6 corrects it** | CALLED ONLY, zero bytes |
| `rebuild/m3/w7-preview/today/preview.css` | YES | RELEASED by S9 | VIEW, after S9 |
| `rebuild/m3/w7-preview/today/build.mjs` | YES | RELEASED by S9 only if H18 lands | VIEW after S9 with H18, otherwise WIRING |
| `rebuild/m3/w7-preview/build.mjs` | YES | the OTHER pinned `build.mjs` (R1 N3). NOT this item's: a new bundle input for the preview page is added in the `today/` one. Named here so a builder who greps finds two and knows which | zero bytes |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | YES | SEALED (`:141`), and `:543` does not release it | **SEALED SIDE: `createEditWeekEntry` (3.3 line 2)** |
| `rebuild/m3/w7-preview/today/today-app.cjs` | YES | SEALED **today**; `:543` RELEASES it once TODAY-SPLIT lands, writers and all removed | **RELEASED SIDE, LANE C: the route and the mount only (3.3 line 2a). Zero writer lines** |
| `rebuild/m3/w7-preview/today/local-source-basis.mjs` | YES | SEALED BY NAME at `:536` (2) | **ONE ADDED EXPORT IN v5 (`E-R17 PRIME`, R4 B2 UPHELD), and v4's "NOT TOUCHED, zero bytes" is WITHDRAWN.** The file gains ONE export, working name `admittedLocalSourceRead(setup)`, which is the read half of `:73-:82` with the SAME `try` in the SAME place, returning `{generation, basis}` instead of the basis alone. **The EXISTING export `admittedLocalSourceState` stays BYTE-IDENTICAL and is NOT re-expressed through the new one**, and the reason is measured rather than preferred: its never-throws contract (`:70-:73`) has exactly two callers in the tree that are cells, `import/test/refusal-route.test.mjs:60` and `measure/measure-baseline.mjs:42`, and both drive it only through a real booted setup entry, so NEITHER drives a throwing, rejecting or absent repository. Re-expressing it would move a contract no existing cell proves. `spike/r5-adoption.mjs` row E drives the never-throws path of BOTH spellings, nine drives, none throwing. The added export is about 12 sealed lines and 3.3 line 3 pays for them. **The v4 row's other half still stands: CHANGED IN v4 (`E-R17`, R3 B6, SPIKE M3 rows 14 and 17): the sealed lane calls the PURE half `admittedLocalSourceBasis(generation, {athleteLabel, namespace})` (`:32`, an export in its own right) over the generation THE ADOPTION GATE ALREADY LOADED, instead of `admittedLocalSourceState(setup)` (`:73-:82`), whose `:78 await repository.load()` is a second durable read. Same function, same two narrowing arguments, so `plan-edit-model.cjs:240`'s `equal(adopted, base)` still holds, which is what R3 verified and SPIKE M3 rows 8 and 9 confirm by execution** |
| `rebuild/m3/w7-preview/today/machine-settings-host.mjs` | YES | SEALED (`:63-:85`) | WIRING, and the aim is a zero byte hunk |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | YES | SEALED (`:161-:166`) | WIRING, and the aim is a zero byte hunk |
| `rebuild/m3/w6/host/plan-edit-host.mjs` | YES | SEALED | CALLED ONLY, zero bytes |
| `rebuild/m4/workout/plan-edit-commands.cjs` | YES | SEALED | CALLED ONLY, zero bytes |
| `rebuild/m4/workout/plan-edit-model.cjs` | YES | SEALED | ONE ADDED EXPORT over its own `inspect()` and `result()` pair for section 4's fix, another lane's hunk, NOT in EW2-BUILD's diff (4.3 ruling 2, `E-R4`) |
| `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` | YES | the ONLY `projectNewExerciseTags` implementation in the tree, and it is in a LANE directory (3.5) | see 3.5 |
| `rebuild/m4/workout/setup-tags.cjs` | **NO, and it is not in `executionPins` either: it does not exist on the tip** | n/a; 3.5's package lands it | SEALED, S10. **Landing it ADDS a product entry; it does not MOVE the lane copy's pin, which is why `PE-f2-identity` keeps passing untouched (R2 N3.5)** |
| `rebuild/m3/w6/local/today-bindings.mjs`, `rebuild/m3/w6/host/workout-host.mjs` | YES | SEALED by name at `:536` (2) | CALLED ONLY, zero bytes (3.6) |
| `rebuild/coach/machine-settings-commands.cjs` | NO | but `rebuild/coach/**` is SEALED by name at `:536` (2) | CALLED ONLY, zero bytes |
| `rebuild/m3/w6/local/source-admission.mjs` | YES | SEALED by name at `:536` (2) | section 4's hunks only, another lane's. **TWO hunks in v4, not one: the three re-pointed capture checks, AND a replay family for the `plan` class, which SPIKE M4 FACT 1 makes mandatory (4.1.1, 4.3 ruling 0)** |
| `rebuild/m3/w6/local/host-bindings.mjs` | YES | SEALED | CALLED ONLY, zero bytes. **NEW ROW IN v4:** it is what refuses the v3 clock shape, `LOCAL_HOST_CLOCK_INVALID` at `:243`, guard `:242-:243` (SPIKE M2 rows 1 and 2, cite corrected by me at `ad8ced07`) |
| `.github/workflows/rebuild.yml` | YES | pinned; registering the new suite is a hunk in it (R1 N4) | WIRING, on the same child, PM custody (3.3 line 7) |

### 3.3 THE SPLIT IN NINE LINES (seven in v2, eight in v3, and line 2 gains a THIRD part in v4 when `E-R12` seals the edit week lane)

1. **RE-CUT IN v4 (`E-R12`).** RELEASED half, lane C, no reseal, VIEW ONLY: **FOUR** new files
   (`edit-week-model.mjs`, `edit-week-view.mjs`, `edit-week-check.mjs`,
   `test/edit-week.test.mjs`) plus a `t-edit-week` block in the already unsealed
   `screens.template.html`, plus `preview.css` once S9 seals. **`edit-week-tags.mjs` and
   `edit-week-basis.mjs` are GONE from this line and into line 2c's sealed lane**: the first
   because it required `rebuild/m4/**`, the second because deciding what Today adopts is what
   `E-R12` and PM NOTE b seal. **Not one of the four imports anything sealed**, so the fence's
   one-sealed-partner rule is never exercised by this item and `FENCE-SECOND-SEALED-IMPORT` cannot
   arise. Their import closure is `plain-copy.cjs`, `design.cjs`, `machine-settings-view.mjs`,
   `exercise-catalogue.mjs` and each other, every one of which is on TODAY-SPLIT E.3's closed
   MAY-IMPORT list.
2. **LINE 2 OF v2 IS TWO LINES IN v3, because `:543` put its two halves on opposite sides of the
   seal. They are called LINE 2a and LINE 2b throughout this spec.**

   **LINE 2a. RELEASED half, lane C, but INSIDE `today-app.cjs` (`E-R1`):** ONE
   route in the `[data-go]` router (`:826`, the binding; `render` is `:2272-:2376`) and ONE mount
   call. Under `:543` that file is released, so these are NOT a reseal hunk and they are NOT on
   S10. **They may not be written until TODAY-SPLIT lands**, because until then the file is sealed
   and every hand that touches it needs a child; 7.2 carries the wait.

   **LINE 2b. SEALED half, rides S10:** `today-entry.mjs` gains a `createEditWeekEntry` factory beside
   `createWorkoutEntry` (`:150`) and `createSetupEntry` (`:93`), with one call site in `boot()`
   (`:226`); and `today-lanes.cjs` gains ONE import of line 2c's module, ONE call, and the
   editor's entries on `facade` and `on`. **Nothing on the released side constructs a host, opens a
   lane or calls a writer, so the WRITER-FENCE of `:542` (C) passes by construction rather than by
   inspection.**

   **LINE 2c, NEW IN v4 (`E-R12`). THE SEALED EDIT WEEK LANE, `edit-week-lane.cjs`**, which 3.4.1
   sites and justifies: host construction and its ten arguments, the one `read()`, `review`,
   `save`, `cancel`, `close`, the Machine settings host and its two calls, the F2 collaborators and
   the first run basis projection, `newIntentId`, the adoption compose, and the two frozen objects
   `weekFacade` and `onWeek` it hands out.
3. **THE SEALED LINES, PAID RATHER THAN WISHED FOR (`E-R12` says "pay the sealed lines"; v1 said
   40, v2 said 55, v3 said under 70, and all three were counting a smaller thing).** The target is
   **under 142 added sealed lines in v5 (v4 said under 130) and ZERO removed except the two changed
   lines of 3.4.4's gate hunk**, split so a reviewer can check each part:

   | sealed part | added lines, target |
   |---|---|
   | `openEditWeekHost()` and its ten arguments (3.4.2) | about 30 |
   | the F2 projector wiring and the first run `projectSetupTags` basis step (3.5) | about 12 |
   | `onWeek`, the callback table, seven entries incl. the two Machine settings ones | about 30 |
   | `weekFacade`, the frozen read only view model | about 20 |
   | the adoption compose, `planEditedState` plus the try and finally read (3.4.4) | about 12 |
   | `newIntentId` | 1 |
   | `createEditWeekEntry` in `today-entry.mjs` | about 15 |
   | `today-lanes.cjs`: one import, one call, the two entry groups | about 10 |
   | **`local-source-basis.mjs`: the ONE added export of `E-R17 PRIME`, NEW IN v5 (3.2's row, 3.4.4). Zero existing lines change** | **about 12** |
   | **total** | **about 142** (v4 said about 130) |

   **RE-PRICED IN v5 BY `E-R17 PRIME` (iv), WHICH IS THE PART THAT DISSOLVES THE CONFLICT R4 B2
   NAMED.** R4 is right that TODAY-SPLIT D.1 byte-proves the two moved writer regions, and that a
   rewrite of `athleteBasisState`'s BODY in the week the split is first written would rewrite one
   of them. **That is not what this item does, and the SEQUENCING says why: EW2's sealed hunks land
   as COMMITS ON TOP OF TODAY-SPLIT's, inside the same S10 chain.** D.1's verbatim proof is a
   property of the SPLIT's OWN commits, the codemod's output against its source, not of the S10
   head, so a later declared edit to the gate inside `today-lanes.cjs` does not touch it. The gate
   this item edits is the one the split has already moved, and it edits it by ADDING six lines and
   changing two, under this spec's own budget and its own review.

   That is roughly double v3's figure and the doubling is the whole content of `E-R12`: the lines
   did not appear, they MOVED, out of released files where a lane C edit could have changed what
   the app adopts. Three hands want the `today-app.cjs` neighbourhood this week (`:539` (2)
   S9-TODAY-CARRY, C-UI-1, C-UI-2), which is why all but ten of these lines are in a NEW file that
   collides with nobody. **The released route and mount are additionally about 6 lines and are
   counted separately, in lane C's own diff.**
4. `machine-settings-host.mjs` and `gym-app.mjs` take NO hunk: the Machine settings door calls the
   existing exported `createMachineSettingsHost` (`:63`) from the new entry and renders through the
   existing exported `renderEditor` (`machine-settings-view.mjs:115`). If a builder finds it cannot,
   that is a STOP, not a licence to edit a sealed file.
5. **AMENDED IN v5 BY `E-R17 PRIME`, AND v4's LINE 5 IS WITHDRAWN.** v4 said "`local-source-basis.mjs`
   takes NO hunk either. 3.4 exists to keep it that way." R4 B2 measured that the design that
   sentence protects costs THREE durable loads per adoption and not the two the spec asserted, for
   a reason the sentence itself causes: the gate's load lives inside that file and its only export
   throws the generation away. **The PM has taken the hunk.** The file gains **ONE ADDED EXPORT**,
   `admittedLocalSourceRead(setup)`, about 12 sealed lines, with the existing export byte-identical
   (3.2's row, 3.4.4). **It is still a NARROW licence and not an opening**: no existing line in that
   file changes, no existing export changes behaviour, the `try` of `:70-:73` is not re-created by
   eye anywhere, and anything beyond the one added export is STOP 4. 3.4 still exists to keep the
   adoption chain honest; what it no longer does is forbid the one export that makes the count two.
6. The child is S10, shared with N3-MACROS-ENTRY and P4b coaching memory exactly as `:540` (2)
   intends, and it also carries section 4's admission hunk, its `plan-edit-model.cjs` export and
   3.5's F2 package. One seal chain. **`:543` says S10 USES the released role S9 builds and that
   the today-carry lane lands first**, so the ORDER on the child is: S9's role, S9-TODAY-CARRY,
   TODAY-SPLIT, then this item's sealed half. **RE-ORDERED IN v4 (`E-R13`, and R3's 3.1 (a) put
   the same thing to the PM): THE F2 PACKAGE IS FIRST ON THE CHILD, before all of them.** SPIKE M1
   rows 1, 5 and 7 measure that WITHOUT IT THE DOOR DOES NOT OPEN AT ALL, on any installation, so
   it is not a leaf beside the other three hunks; it is the thing everything else waits on. The
   order is: **F2, then S9's role, S9-TODAY-CARRY, TODAY-SPLIT, then this item's sealed half and
   section 4's.** `:548` records that the PM dispatches F2's landing AS ITS OWN LANE from the
   spike's M6, so the ordering above is a constraint on S10 and not a task this lane owns.
7. **The CI registration is a hunk in `.github/workflows/rebuild.yml`, which is PINNED (R1 N4).** It
   rides the SAME S10 child, authored by the PM, not by any lane: this spec grants no `.github`
   custody to a lane and never asks a builder to touch it. S10's budget carries it. It is the reason
   6.7's "no diff outside" clause is scoped to the lane's own diff, not to the child's.

### 3.4 THE ADOPTION CHAIN: what makes EW-14 true, and it was missing from v1 (R1 B2, upheld)

EW-14 is "same page commit reaches real Today and the next eligible gym entry with the new operation
basis". A route and a mount call put the editor on the screen. They do NOT change what the gym card
next opens on. The chain that decides that, measured at the tip:

- `today-app.cjs:2482` `function athleteBasisState()` imports `./local-source-basis.mjs` and returns
  `module.admittedLocalSourceState(setup)`, then `.catch(() => null)`, then
  `.then((imported) => { importAdmitted = !!imported; return imported || setup.athleteState(); })`.
- `today-app.cjs:2490` `function adoptAthleteState()` calls it, then `model.adoptBasis(state)`
  (`today-model.cjs:412`, which assigns `basis` and clears `pendingAdoption`), then
  `workout.gym.rebase()` and `workout.refresh()`.
- `today-model.cjs:219` `stateFromOps()` returns `foodProjectionOf().state`, which begins
  `let state = clone(basis)`. Everything the gym card reads hangs off `basis`.
- `gym-model.mjs`: `hostForDay` rereads `model.stateFromOps()` at CALL time, so a rebase after
  `adoptBasis` picks up whatever was adopted. **v2 cited `:104` for this and `:104` is the COMMENT
  that says it, not the code that does it (v3, R2 N3.6).** The code is `rebase()`, which calls
  `await hostForDay(day)` at `:163` after its own `:161` guard; `hostForDay` itself is the injected
  option declared at `:96`. The claim was true and the cite pointed at prose.

**NOTHING IN THAT CHAIN APPLIES A PLAN EDIT, and nothing in the product consumes the operation.**
Measured: `grep -rn 'exercise-edit' rebuild --include=*.mjs --include=*.cjs` returns the field
constant `plan-edit-commands.cjs:4` and two lane D cells. `stateFromOps()` replays sleep, food and
readings and has no branch for it. So an edit saved today changes the editor's own `read()` and
nothing else on the phone.

**THE RULING: option (b) still, but it is re-cut for `:543` and re-specified so it can be written
and cannot loop (v3, `E-R1` and `E-R2`; R2 B1 and B2).** The three options and why the other two
lose:

| option | what it means | verdict |
|---|---|---|
| (a) change `local-source-basis.mjs` | it is in `product` (verified by my own query) AND SEALED BY NAME at `:536` (2). The most expensive file in the tree to touch, and the edit is not a basis-admission concern | REJECTED |
| (b) the SEALED factory opens the companion once inside the adoption gate it already owns, and a PURE released function decides what to adopt from the two values | under `:543` the adoption gate, every lane opener and every host are sealed by ruling, so the open costs no NEW sealed surface; the decision, which is the part that goes wrong, stays free and cell-covered | **CHOSEN** |
| (c) make the companion's `read()` the adoption source outright | it changes the meaning of "admitted basis" and would make `importAdmitted` a lie. `plan-edit-model.cjs:240` already asserts `equal(adopted, base)`, so the companion itself insists the basis handed to it is the admitted one | REJECTED |

#### 3.4.1 WHERE THE SEALED EDIT WEEK LANE LIVES, AND WHY (RE-DECIDED IN v4, `E-R12`, PM NOTE b, R3 B1 and R3 3.1 (b))

**v3's ANSWER IS WITHDRAWN.** v3 reduced `edit-week-basis.mjs` to a pure function in a RELEASED
file and justified it: "a rule that has already been got wrong three times belongs where a cell can
be written against it without a reseal child", at a stated cost of about ten sealed lines. R3's
3.1 (b) put the OTHER side of that trade to the PM and the PM took it at `E-R12` and PM NOTE b:
under v3's answer **the function that decides WHAT TODAY ADOPTS sat in an unpinned released file,
and the tag rule that decides what a durable plan operation PROJECTS (`plan-edit-model.cjs:350-:356`)
sat in another one**, both consumed by the sealed side. That inverts what the seal binds: a lane C
edit could change the basis the whole app stands on without a reseal child and without the
WRITER-FENCE noticing, because neither file calls a writer. **The ten lines are paid.**

**AND THE SPIKE MAKES THE PM's RULING MORE THAN A PURITY CALL.** SPIKE M3 rows 3 to 10 measure
that `planEditedState`'s correctness is entirely a question of WHICH VALUE IT IS FED: fed the raw
basis both installations work (rows 3 and 8); fed `athleteBasisState`'s own result an imported
installation silently works (row 9) while a first run one refuses `PLAN_EDIT_TAG_BASIS_UNPROVEN`
(row 4); fed the already edited state an imported installation refuses
`PLAN_EDIT_IMPORTED_BASIS_MISMATCH` (row 10). **A rule whose failure mode is that HALF the
installations keep working is exactly the rule that must not be editable without a seal.**

**THE RULING: the sealed half is its OWN MODULE, `rebuild/m3/w7-preview/today/edit-week-lane.cjs`,
imported by `today-lanes.cjs` and by nothing else.** `E-R12` offered two sites and asked for a
justification. Three reasons, in order of weight:

1. **COLLISION.** `today-lanes.cjs` is the file TODAY-SPLIT creates and BYTE-PROVES (its D.1:
   every moved writer region byte identical modulo a wrapper defined exactly), and `:539` (2) has
   three hands in that neighbourhood this week. Putting about 120 new lines into it would make it
   the busiest new file in the tree in the same week it is first written. Its own module costs
   `today-lanes.cjs` about ten lines instead.
2. **CUSTODY AND REVIEW.** The sealed half then has its own diff, its own reviewer and its own
   row in 6.7's "no diff outside" clause, which is checkable rather than argued.
3. **IT IS THE DESIGN'S OWN PATTERN, not an exception to it.** TODAY-SPLIT v2 already creates a
   SECOND sealed lane module, `gym-settings-lane.mjs`, for the `gym-app.mjs` extraction (R3 N4).
   A third sealed lane module is the same move a third time.

**THE TWO COSTS, NAMED RATHER THAN DISCOVERED, both of which are requirements on OTHER lanes and
both of which are in STOP 2:**

- **A NEW `product` ENTRY WITH ROLE `new`.** Under TODAY-SPLIT E.2, FREE is "present in the
  directory listing of `rebuild/m3/w7-preview/today/`, source files only, `test/` excluded, AND
  absent from the inventory's `product` and `executionPins` OR present in its `released` block".
  **So until the seal child declares `edit-week-lane.cjs` as product, the fence treats it as a
  RELEASED file and fails it on its own contents.** It must be declared product with role `new` on
  the SAME child that lands it, which is exactly the act SPIKE M6 measures for `setup-tags.cjs`.
  A builder who lands the file without the declaration gets a red fence and has found a
  sequencing error, not a fence bug.
- **NO NEW PAIRING IS NEEDED, and that is the reason this shape was chosen over the obvious one.**
  E.3 permits a released file to import "the ONE sealed lane module named as its partner in the
  artifact" and fails a second one `FENCE-SECOND-SEALED-IMPORT`. If the RELEASED editor imported
  `edit-week-lane.cjs` directly, the artifact would need a THIRD pairing. It does not: the sealed
  lane is imported by `today-lanes.cjs` (sealed importing sealed, which the fence does not police),
  and the released editor receives `weekFacade` and `onWeek` as plain frozen values through the
  route and mount of line 2a. **The released editor imports nothing sealed at all.**

**WHAT THE ADOPTION COMPOSE IS, now that it is sealed.** It keeps v3's shape and v3's totality
argument, which R2 N3.2 earned and R3 verified; only its address changes. Inside
`edit-week-lane.cjs`:

```
planEditedState(rawBasis, read)   // read is the REPLY object, already obtained
```

It returns `read.state` when `read && read.read === true && read.state`, and `rawBasis` otherwise,
on every other path including `read === undefined`, `read.read === false`, and a reply of any other
shape. **It never returns `undefined` and it has no `catch` to fall through, because it never
calls anything (v3, R2 N3.2, which is why the `&&`/`||` hunk of v2 could silently stop adoption).**
It re-derives nothing: it never applies an edit, never reads `training.exercise-edit`, never
touches a projector. `plan-edit-model.cjs:61-63` binds it: a second spelling of the rule is a
second rule.

**THE ONE THING v3's ANSWER BOUGHT, AND HOW v4 KEEPS IT.** v3's argument for a released file was
that a rule got wrong three times needs a cell that can be written without a reseal child. That is
still true and it is still paid for: `planEditedState` is a PURE function of two values, so its
cells feed it reply objects and need no host, fake or real, and they run in the lane suite exactly
as v3 planned. **What changes is only that the file they exercise is inside the seal, so a lane C
hand cannot move the rule without a child.** The cells do not get harder; the rule gets harder to
change, which is the whole of `E-R12`.

**AND THE CELLS ARE NOT OPTIONAL.** EW-14's row in section 5 asserts that `planEditedState` returns
a STATE on every path including `read === undefined`, `read.read === false` and a reply of an
unexpected shape, and EW-13c and EW-13d assert what it does with the two real feeds. SPIKE M3 rows
3 to 10 are the table those cells are written from.

#### 3.4.2 THE FACTORY, ALL TEN ARGUMENTS, AND WHERE EACH ONE COMES FROM (R2 B2, `E-R2`)

The factory is **`openEditWeekHost(generation)`**, a function in the SEALED lane
`edit-week-lane.cjs` (3.3 line 2c, inside line 3's budget). It is not in v2's table, in either half
or in either budget, which is exactly R2 B2 (ii). It is `async`, it returns the host handle, and its
caller closes it. **CHANGED IN v4 (`E-R17`, R3 B6, SPIKE M3 rows 14 to 17): IT TAKES THE
GENERATION THE ADOPTION GATE HAS ALREADY LOADED and loads nothing of its own.** It calls
`createPlanEditHost` (`plan-edit-host.mjs:42`) with these ten and nothing else. **Every row names
the line that CONSUMES the value, and a reviewer opens that line: R3's closing note asks for
exactly that rule, and three of v3's ten rows were wrong because nobody did.**

| argument | where it comes from | measured, at the line that CONSUMES it |
|---|---|---|
| `client` | **the era's own client, `era.client`. REWORDED IN v4 (R3 N8): v3 said "the SAME object `machine-settings-host.mjs:72` hands to `hostBindings`", and `:72` is `const bindings = await era.client.hostBindings({ workoutCommands: createMachineSettingsCommands() });`. What is HANDED to `hostBindings` is the OPTIONS object. What this row means, and what the host needs, is the thing that HAS `hostBindings`, which is `era.client`** | `plan-edit-host.mjs:44` requires `client.hostBindings`; `:81` calls it |
| `clock` | **REWRITTEN IN v4 (`E-R15`, R3 B4 (i), SPIKE M2 rows 1 to 5). `clientClockFor(day, live)` (`today-bindings.mjs:208`), built for the host's OWN day exactly as `today-bindings.mjs:317`, `:383` and `:557` already build it. It is the era's REAL client clock: `today()` returns the FROZEN `day`, `now()` returns the LIVE instant, and it also carries `tz` and `monotonicMs`. v3's `{ today: () => era.liveDay() }` is WITHDRAWN: it is not a clock** | `plan-edit-host.mjs:81` hands it straight to `client.hostBindings({workoutCommands, clock})`; `host-bindings.mjs:229` takes it as `hostClock` and **`:242-:243` throws `LOCAL_HOST_CLOCK_INVALID` (state 18) unless `now`, `today` AND `monotonicMs` are all functions** (SPIKE M2 rows 1 and 2; `tz` is NOT required). Downstream `:170 const nowIso = clock.now()` and `:223 leaseExpired(era.lease, clock.now())` |
| `liveDay` | `today-bindings.mjs:723`'s exported `liveDay`, zero sealed bytes (3.6). **SEPARATE FROM `clock`, and `E-R15` says so in as many words: `clock.today()` is the FROZEN day and `liveDay` is the live reader** | `plan-edit-host.mjs:54-:56` accepts it, or falls back to `client.liveDay`; `localDay()` (`:54-:60`) is `liveDayOf()` and is what `entry.authoredDay` and `matches()` (`:87-:93`) compare |
| **`basisState`** | **THE RAW VALUE AND NEVER THE COMPOSED ONE, and IN v4 derived from the gate's OWN generation: `admittedLocalSourceBasis(generation, {athleteLabel, namespace})` (`local-source-basis.mjs:32`) when it is non null, else `setup.athleteState()`. 3.4.3 is the whole reason this row is in bold. ON A FIRST RUN INSTALLATION IT IS THEN TAG PROJECTED, see the two rows below** | `plan-edit-model.cjs:107` `const base = clone(basisState)`, and `:237-:240` `equal(adopted, base)`, which SPIKE M3 rows 8 and 9 confirm holds for this value |
| `setupOperation` | the RAW setup operation, NOT a `setupsIn()` row, **read out of the SAME generation** (3.6, re-cut in v4 so it loads nothing) | `plan-edit-model.cjs:108-:110` demands `kind`, `class`, `payload.profile`, `payload.setup` and a 64 hex `canonical_content_commitment`; `:112` reads `op_id`, `athlete_id`, `device_id` and `effective.local_date` |
| `validateTags` | 3.5's projector, `createSetupTagProjector(...).validateExerciseTags`, constructed INSIDE the sealed lane | **`plan-edit-commands.cjs:66`, reached from `plan-edit-model.cjs:203` at PROJECTOR CONSTRUCTION, which is the FIRST `read()` and not a review** (SPIKE M1 rows 1, 5, 7 and 10) |
| `projectNewExerciseTags` | the same projector's `projectNewExerciseTags` | `plan-edit-model.cjs:349` (save path) and `:390` (preview path); SPIKE M1 row 11 measures that withholding it leaves `read()` GREEN and refuses the first `add` review |
| `newIntentId` | **a new one line provider on the sealed side** over the installation's own `crypto.randomUUID()`, the same `crypto` `openTodayHosts` is already handed. Nothing in product mints one (2.1) | `plan-edit-host.mjs:45` throws without it; `:170` calls it; `:171-:172` already guards a collision |
| `athleteLabel` | `setup.athleteLabel()`, the same read `local-source-basis.mjs:79` makes | `plan-edit-host.mjs:52-:53` |
| `namespace` | the era's `namespace`, the value `machine-settings-host.mjs:79` puts on its own handle and `local-source-basis.mjs:80` reads as `host.namespace` | `plan-edit-host.mjs:52-:53`. **ADDED IN v4 (R3 N8): `local-source-basis.mjs:66` then narrows the admitted basis by `state.athlete_label`, so `athleteLabel` and `namespace` MUST be the same pair the raw `basisState` was read with, or `plan-edit-model.cjs:240`'s equality fails for a reason that LOOKS like 3.4.3's loop and is not** |

**AND ONE STEP THAT IS NOT AN ARGUMENT AND IS EASY TO MISS (NEW IN v4, `E-R13`, SPIKE M1 rows 2
and 12).** On a FIRST RUN installation the factory must run F2's `projectSetupTags` over the basis
BEFORE handing it to `createPlanEditHost`, or `host.read()` refuses `PLAN_EDIT_TAG_BASIS_UNPROVEN`
at `plan-edit-model.cjs:217`. Measured, the projector's signature is
`projectSetupTags(state, context)` where `context` is closed over exactly
`['setup','tags','op_id','date']` (`f2-tag-adapter.cjs:141`), all four of which the factory already
has in hand from `setupOperation`, and it writes `e.head`, `e.secondary` and `e.volumeTags` onto
every row (`:189-:193`), which are the three members `plan-edit-model.cjs:209` asks for.
**On an IMPORTED installation this step is NOT needed** (SPIKE M1 rows 5 and 6): `:208` retains
rather than proves the tags on the local source branch. The factory therefore runs it on the first
run branch only, which is the same branch test it already makes for `basisState`.

#### 3.4.3 `basisState` IS THE RAW BASIS. THE LOOP, NAMED SO NOBODY WRITES IT (R2 B2 (iii), `E-R2`)

**RULE, in one sentence: `basisState` is the RAW admitted or first run state, and it is NEVER
`athleteBasisState()`'s result after this section lands.** A builder handed only "the page passes
them beside `admittedLocalSourceState`" will pass the composed value, because it is the only
athlete state the page has a name for. What that costs, measured:

**v3 ARGUED THIS FROM SOURCE AND GOT THE CODES WRONG IN BOTH DIRECTIONS. THE SPIKE DROVE IT AND
THE SPIKE WINS (`E-R19`, SPIKE M3 (b), rows 3 to 10). The RULE IS UNCHANGED AND STRONGER; the
REASONS are replaced.**

- **Imported installation, fed `athleteBasisState()`'s own result. MEASURED: IT SUCCEEDS**
  (SPIKE M3 row 9). v3 said it refuses `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` at `:240`. It does not,
  and the reason is exact: `athleteBasisState` returns `admittedLocalSourceBasis(generation)`,
  which is precisely what `:237` re-reads, so `:240`'s `equal(adopted, base)` HOLDS. **This is
  worse news than v3's story, not better: on the installation the owner is actually on, wiring
  `basisState` to the composed value FAILS SILENTLY on the FIRST adoption, and only starts
  refusing later.**
- **Imported installation, fed the ALREADY EDITED state. MEASURED: `PLAN_EDIT_IMPORTED_BASIS_MISMATCH`
  at `plan-edit-model.cjs:240`** (SPIKE M3 row 10), on all six kinds. **That is the feed a cell
  asserting `:240` must name**, and v3's EW-13c named the other one.
- **First run installation, fed `athleteBasisState()`'s own result. MEASURED:
  `PLAN_EDIT_TAG_BASIS_UNPROVEN` at `plan-edit-model.cjs:217`** (SPIKE M3 row 4), not
  `PLAN_EDIT_ID_REUSED`.
- **First run installation, fed the ALREADY EDITED state. MEASURED: `PLAN_EDIT_ORIGIN_UNPROVEN` at
  `:216` for update and remove, and at `:134` for add and replace, where the lift COUNT no longer
  matches the setup document** (SPIKE M3 rows 5 and 6).
- **THE DOUBLE APPLICATION v3 PREDICTED IS NOT REACHABLE AT ALL.** Neither
  `PLAN_EDIT_ID_REUSED` (`:346`) nor `PLAN_EDIT_TARGET_UNAVAILABLE` (`:321`) can be raised on this
  path, because the ORIGIN PROOF AT CONSTRUCTION always refuses before `apply()` is entered. v3's
  sentence "the edits apply TWICE" is WITHDRAWN: they never get as far as applying once.
- **If the factory reads the composed value lazily**, the loop is still literal and this part of
  v3 stands:
  `athleteBasisState -> planEditedState -> openEditWeekHost -> athleteBasisState`.

**WHAT THE MEASUREMENT CHANGES ABOUT THE RULE: NOTHING, AND THAT IS THE POINT.** Both
installations fed the RAW basis produce a read that EQUALS the companion's own read (SPIKE M3 rows
3 and 8), which is the strongest form of the pinning R3 tried and failed to break. What changes is
the two cells, because both of v3's named their codes from an argument rather than a run.

**THE CELL THAT CATCHES IT, and `E-R2` asks for it by name.** EW-13 gains a third and fourth part,
and they are written RED first like everything else:

> **EW-13c, IMPORTED. REWRITTEN IN v4 on SPIKE M3 rows 9 and 10.** On a synthetic installation
> with an ADMITTED import: save one `update` through the real host, run the real adoption chain
> once, then open the editor a SECOND time. ASSERT `read:true`. **It carries TWO negative
> controls, and the first is the one v3 did not know it needed:** (c1) a projector built with
> `basisState` wired to `athleteBasisState()`'s own result READS OK and therefore proves nothing,
> so the cell asserts the read's STATE EQUALS the companion's own read at `starts_on` rather than
> asserting a code; (c2) a projector built with `basisState` wired to the ALREADY EDITED state
> refuses `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` at `plan-edit-model.cjs:240`, and the cell names
> that code and that input. **v3's version asserted `:240` against the adopted value, which SPIKE
> M3 row 9 measures as GREEN, so v3's cell would have passed for the wrong reason.**
>
> **EW-13d, FIRST RUN. REWRITTEN IN v4 on SPIKE M3 rows 3, 4, 5 and 6.** On a synthetic first run
> installation, **with F2's `projectSetupTags` run over the basis as 3.4.2's extra step requires,
> or the cell is red for a reason that has nothing to do with what it tests**: save one `add`, run
> the adoption chain once, open a SECOND time, ASSERT `read:true` AND that the added lift appears
> exactly ONCE in `read().state.exercises`. Controls: (d1) `basisState` wired to
> `athleteBasisState()`'s own result refuses **`PLAN_EDIT_TAG_BASIS_UNPROVEN` at `:217`**;
> (d2) `basisState` wired to the already edited state refuses **`PLAN_EDIT_ORIGIN_UNPROVEN` at
> `:134`** for an `add`. **v3 named `PLAN_EDIT_ID_REUSED` and SPIKE M3 measures that it is not
> reachable on this path at all**, because the origin proof at construction refuses before
> `apply()` is entered. A cell written to v3's wording would be red on arrival.

#### 3.4.4 WHAT THE SEALED SIDE DOES, AND WHAT THE SPLIT MUST LEAVE IN PLACE FOR IT

The adoption chain as it stands is `athleteBasisState` at `today-app.cjs:2482-:2489` and
`adoptAthleteState` at `:2490-:2546`. `TODAY-SPLIT-SPEC.md:119` and `:120` classify BOTH as
**WRITES** regions, so under `:543` both move into the sealed module unchanged, and this item adds
to them there. **What the split must leave in place, stated as a requirement on TODAY-SPLIT rather
than as an assumption:**

1. the adoption gate stays ONE function, so there is ONE place a plan edit can be composed in and
   no second adoption path to keep in step;
2. `setup` (the setup entry) stays reachable from it, because `admittedLocalSourceState(setup)`,
   `setup.athleteState()` and `setup.athleteLabel()` are all read off it;
3. the era (its `client`, `namespace` and `crypto`) stays reachable from it, for 3.4.2's rows;
4. `importAdmitted` keeps its present meaning, set from the RAW admitted basis and not from
   anything this section adds, or the Import entry starts lying. **UNCHANGED IN v5 AND MEASURED
   TO BE UNCHANGED (R4 B2 way out (b) is NOT taken).** `E-R17 PRIME`'s added export returns, as
   its `basis` member, the value of `admittedLocalSourceBasis(generation, {athleteLabel,
   namespace})` over the SAME generation with the SAME two narrowing arguments, which is exactly
   what `admittedLocalSourceState` returns today (`local-source-basis.mjs:73-:82`). So
   `importAdmitted = !!read.basis` is the same boolean `:2488` sets, and no hand re-creates the
   `try` of `:70-:73` by eye. `spike/r5-adoption.mjs` row E drives both spellings against a
   throwing, a rejecting, an absent and a non-callable repository: all nine drives return, none
   throws.
5. **RE-TAKEN IN v5 (`E-R17 PRIME`, R4 B2 UPHELD). v4's item 5 IS WITHDRAWN: it asked TODAY-SPLIT
   to keep a binding that does not exist.** v4 said "the gate already loads one" and cited
   `local-source-basis.mjs:78`. The cite is right and the conclusion was wrong: `:78` is one frame
   deeper and in ANOTHER FILE, inside `admittedLocalSourceState`, which returns the BASIS and
   discards the generation. `today-app.cjs:2482-:2488` has no `loaded` to keep. **Measured
   (`spike/r5-adoption.mjs` row A, on an instrumented repository): under v4's text an adoption
   costs THREE `repository.load()` calls, not two.**
   **WHAT THIS ITEM ASKS INSTEAD, and it asks TODAY-SPLIT for nothing at all:** the gate calls ONE
   ADDED EXPORT of `local-source-basis.mjs` which returns the basis AND the generation its own
   `repository.load()` at `:78` already produced (3.2's row, and the sealed budget pays for it).
   The only requirement on TODAY-SPLIT is the one item 1 already states: the adoption gate stays
   ONE function. **Measured, the count is then TWO (`spike/r5-adoption.mjs` row B).**

**THE HUNK, and v2's "four added lines and zero removed" is withdrawn (R2 B2 (i)).** `:2488` ends
with a semicolon, so v2's `.then` could not be appended without changing that line, and "zero
removed" was not achievable as printed. Under `:543` the point is moot in a better way: the whole
function is being MOVED by TODAY-SPLIT, so this item's hunk is not an append to a line it does not
own. It is, inside the sealed module's own adoption gate:

**RE-CUT IN v5 (`E-R17 PRIME`). The gate's first line is the ONE ADDED EXPORT, and the generation
it returns is what the editor host is opened over:**

```
const admitted = await admittedLocalSourceRead(setup);   // the ONE added export (3.2's row)
importAdmitted = !!admitted.basis;                       // item 4: the same boolean :2488 sets
let state = admitted.basis || setup.athleteState();
const read = await (async () => {
  const host = await openEditWeekHost(admitted.generation);
  try { return await host.read(EDIT_WEEK_ADOPTION_DAY); } finally { host.close(); }
})().catch(() => null);
state = planEditedState(state, read);
```

Six added lines, two changed (the first line of `athleteBasisState`'s chain and the assignment),
zero removed, and the `try/finally` is what makes the `close()` unconditional. **The
`catch(() => null)` belongs HERE, on the sealed side, not inside the pure function**, because it is
the durable call that can throw and the pure function is what must be total. `admittedLocalSourceRead`
is a working name for the added export; the naming is the admission lane's, and 3.2's row is the
contract.

**WHICH DAY THE ADOPTION READ IS TAKEN ON, NAMED RATHER THAN DEFAULTED (NEW IN v5, R4 N1 ADOPTED).**
`host.read()` with no argument lets `readVerified` (`plan-edit-host.mjs:145`) default to
`localDay()`, and an edit reviewed on day D has `starts_on` D+1 (`result()`'s `:376` is
`if (value.starts_on <= date)`). **Measured (`spike/r5-readday.mjs`), on a real saved `add` and a
real saved `update sets 2 to 5` through the real host, adoption day `2026-09-14`, `starts_on`
`2026-09-15`:**

| the date the adoption read is taken on | `read` | the added lift appears | `press-old` sets |
|---|---|---|---|
| NONE, so `localDay()` = `2026-09-14`, which is what v4's hunk wrote | true | **0 times** | **2, the pre-edit value** |
| `2026-09-14` named explicitly | true | 0 times | 2 |
| `2026-09-15`, which IS `starts_on` | true | **exactly once** | **5** |
| `2026-09-20`, after it | true | exactly once | 5 |

**That is CORRECT behaviour and not a defect in the design: an edit that starts tomorrow must not
change today's week.** It is a defect in a hunk that reads with no date and in two cells that name
none. `EDIT_WEEK_ADOPTION_DAY` above is the era's own `liveDay()`, the same value 3.4.2's row
passes to the factory, stated as an argument so that a builder reads the day off the hunk instead
of chasing it into the host. **A cell that asserts an edit is VISIBLE reads at or after
`starts_on`: EW-13d and EW-14 both name a date, and 5's table says which.**

**COST, RE-COUNTED BY EXECUTION AND BROUGHT BACK INSIDE THE SPEC'S OWN STOP (`E-R17`, R3 B6,
SPIKE M3 (c)).** v3 said "one extra durable reopen per adoption" and it was wrong by three. SPIKE
M3 rows 11 to 17 counted on an instrumented repository: `createPlanEditHost` 0, `host.read()` 1,
v3's `basisState` 1, v3's `setupOperation` 1, the gate's own pre-existing load 1, which is
**FOUR loads where there was ONE, and STOP 9 fires at design time.**

**THE REPAIR, RE-TAKEN IN v5 (`E-R17 PRIME`) AFTER R4 B2 MEASURED v4's VERSION AT THREE. ONE
DURABLE READ PER ADOPTION, AND IT IS THE ONE THE GATE ALREADY MAKES, REACHED THROUGH ONE ADDED
EXPORT.** `admittedLocalSourceRead(setup)` performs the `:78` load the gate performs today and
returns the basis AND the generation; `openEditWeekHost(generation)` takes that generation;
`basisState` comes from `admittedLocalSourceBasis(generation, ...)` (the pure half, 3.2's row);
`setupOperation` is dereferenced out of the SAME generation (3.6). **The count is 2: the gate's own
load, which existed before this item, plus the ONE `lane.reopen()` inside `readVerified`
(`plan-edit-host.mjs:148`) that no design can avoid, because the companion re-verifies its own lane
and that is the point of it.**

**AND THIS TIME THE 2 IS MEASURED AND NOT ASSERTED (`spike/r5-adoption.mjs`, the instrument R4
used, on the spike's real encrypted store):**

| the design | gate-side `repository.load()` | host-side `repository.load()` | TOTAL |
|---|---|---|---|
| **C.** the gate as it stands today, `today-app.cjs:2482-:2488`, no editor: the FLOOR | 1 | 0 | **1** |
| **A.** v4's 3.4.4 as printed, which is what R4 B2 measured | 2 | 1 | **3** |
| **B.** `E-R17 PRIME`: the gate calls the ONE added export | **1** | **1** | **2** |
| **D.** where B's host-side load is: `openEditWeekHost(generation)` alone | 1 | **0** | 1 |
| **D.** and after ONE `host.read()` | 1 | **1** | 2 |

So the extra durable act is exactly one reopen, which is what STOP 9 permits, **and STOP 9 STANDS
UNCHANGED**: the spec no longer disagrees with itself, and row D says WHERE the one act is, so a
builder who measures 3 knows which frame to look in. Adoption runs at boot (`today-app.cjs:2550`)
and on `onAdmitted` (`:700`), not per frame, so this is two reopens in a session and not a loop.
EW-14 measures the count by name, on an instrumented repository, the way row B was measured.

**EW-14 IS BLOCKED ON 3.4 AND ON 3.5, and v3 STILL UNDERSTATED THE SCOPE (R2 N3.1 upheld, R3 B2
(v) upheld, SPIKE M1 rows 1, 5 and 7).** v3 said the adoption read refuses without F2 "on a
generation that carries one `add`", by this route: `host.read()` runs `inspect()`, which runs
`commands.validate(op, id => ops[id])` for every plan mutation op (`plan-edit-model.cjs:285`),
which runs `validateInput` and therefore `editOf` (`plan-edit-commands.cjs:69`) and therefore, for
an `add` or a `replace`, `tagsOf` (`:78`) and `validateTags` (`:66`). That route is real and it is
the SECOND one. **Measured, the adoption read refuses without F2 on EVERY generation, including an
empty one, because `plan-edit-model.cjs:202-:203` calls `C.tagsOf` for every BASIS ROW inside
`createPlanEditProjector`'s own body, before any operation is looked at**, and
`setup-commands.mjs:124` guarantees `origin.payload.tags` is always present so `:202` is always
entered. **So the adoption read is not blocked on generations carrying an `add`; it is blocked,
full stop, until F2 lands.**

**ONE SENTENCE THAT RETIRES A BUG THAT IS NOT THERE (NEW IN v5, R4 N3 ADOPTED).**
`openEditWeekHost(generation)` decides `firstRun` and `basisState` from the generation the gate
handed it, while `host.read()` reopens the lane and `projectorFor` (`plan-edit-host.mjs:68-:69`)
computes `basisSource` from the REOPENED one. If an import is admitted BETWEEN the two, the host
CONSTRUCTS, `host.read()` refuses `PLAN_EDIT_IMPORTED_BASIS_MISMATCH`, and adoption is SAFE because
`planEditedState` returns the unchanged state on a refused read (3.4.3). **That code at E0 is a
RACE between the gate's load and the lane's reopen before it is a wiring defect, and this spec says
so here so that the first builder who meets it does not hunt STOP 13's defect where STOP 13's
defect is not.** STOP 13 and EW-13c control c2 still attach the same code to the WIRING defect,
which is the one that matters; the two are told apart by whether `basisState` is the raw value, and
EW-13c asserts that it is.

### 3.5 THE F2 TAG PACKAGE GATES THE WHOLE DOOR, MEASURED (RE-WRITTEN IN v4, `E-R13`, PM NOTE a, R3 B2)

**THE HEADLINE, in one sentence the PM asked for in as many words: WITHOUT THE F2 PACKAGE THE
COMPANION REFUSES ITS FIRST READ ON EVERY INSTALLATION, so EW-02, EW-03, EW-05 and the Machine
settings door are BLOCKED until it lands, along with everything else that opens the editor.** v3
said F2 blocked THREE cells (EW-04, EW-15, EW-17c) and that "EW-02, EW-03, EW-05 and the Machine
settings door are NOT blocked: `update` and `remove` never enter `tagsOf`". **That is false and
`E-R13` rules it false. SPIKE M1 rows 1, 5 and 7 measure `PLAN_EDIT_TAGS_INVALID` on a BARE OPEN,
on first run and on imported alike.**

#### 3.5.1 EVERY F2 FUNCTION THE COMPANION NEEDS, NAMED (`E-R13`)

| F2 export | needed? | who calls it | what its absence costs, measured |
|---|---|---|---|
| `createSetupTagProjector` (`f2-tag-adapter.cjs:64`, `setup-tags.cjs` at `f3e9561b`) | **YES**, the factory | the sealed lane, once per host | there is no projector at all |
| `validateExerciseTags` (`:102`) | **YES, ON BOTH BRANCHES** | `C.tagsOf` at `plan-edit-model.cjs:203` (basis rows, at construction) and `plan-edit-commands.cjs:78` (`add` and `replace` edits) | `PLAN_EDIT_TAGS_INVALID` on the FIRST `read()`, every installation (SPIKE M1 rows 1, 5, 7, 10) |
| `projectSetupTags` (`:134`) | **YES, FIRST RUN ONLY** | the sealed lane, over the basis, before `createPlanEditHost` (3.4.2) | `PLAN_EDIT_TAG_BASIS_UNPROVEN` at `plan-edit-model.cjs:217` on a first run installation (SPIKE M1 rows 2 and 12). An IMPORTED installation does not need it: `:208` retains rather than proves (rows 5 and 6) |
| `projectNewExerciseTags` (`:105`) | **YES, for `add` and `replace` only** | `plan-edit-model.cjs:349` (save) and `:390` (preview) | `read()` stays GREEN; the first `add` or `replace` REVIEW refuses `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` (SPIKE M1 row 11) |
| `validateSetupTags` (`:132`) | **NO. IT HAS NO CALLER ANYWHERE** | nothing | nothing. **R3 B2 (2) asked for a "fourth function" and the measured answer is that THREE are needed, not four:** `setup-commands.mjs:124` builds `payload.tags` with its OWN `tagsOf` (`setup-commands.mjs:61`), not F2's |

**So the count is THREE functions plus the factory, and the fourth export is dead weight this door
never touches.** That is a correction to R3 in the author's favour and it is the spike's, not mine.

#### 3.5.2 THE DEPENDENCY RESTATED

`createPlanEditHost` requires `validateTags` and `projectNewExerciseTags` as arguments, and
`projectSetupTags` is required BEFORE it, on the basis. All three are hard and undefaulted:

- `plan-edit-commands.cjs:66`
  `if (typeof validateTags !== 'function' || validateTags(plain(exercise), plain(tags)) !== true) fail('PLAN_EDIT_TAGS_INVALID');`
  inside `tagsOf`, which `editOf` calls for EVERY `add` and EVERY `replace` (`:76-:79`). Unconditional.
- `plan-edit-model.cjs:349`
  `if (typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');`
  and `:350-:355` hold the projection to an exact shape. That particular line sits behind `if (op)`
  at `:348`, so it is the SAVE path's copy of the rule.

**WHERE THE REFUSAL REALLY FIRES, and v2 got this wrong (v3, R2 B5, upheld, and `E-R5` rules it).**
v2 said a builder "can reach a green REVIEW for `add` and `replace` and then refuse at Save, which
is the worst order to discover it in". Measured at `00e7a0d0`, that is false and the true order is
the opposite. With no provider, `review()` refuses IMMEDIATELY, twice over, before `apply()` is
reached at all:

1. `preview()` (`plan-edit-model.cjs:384`) opens with `C.validateInput(value, { validateTags })` at
   **`:385`**, which reaches `editOf` (`plan-edit-commands.cjs:69`), which for `add` and `replace`
   calls `tagsOf` (`:78`), which fails **`PLAN_EDIT_TAGS_INVALID` at `plan-edit-commands.cjs:66`**
   the moment `validateTags` is not a function. This is the one that actually fires first.
2. Had it passed, `preview()` would still fail **`PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` at
   `plan-edit-model.cjs:390`**, on the REVIEW path, before `apply()` at `:392`.

v3 concluded from that: "the first `Review change` on an `add` or a `replace` refuses
`PLAN_EDIT_TAGS_INVALID`, and no Save is ever offered". **v3's conclusion is TRUE and is still not
the first refusal, and the spike settles it (R3 B2 (ii) upheld, SPIKE M1 rows 1, 5, 7 and 10).
THE FIRST REFUSAL IS NOT A REVIEW AT ALL.** `plan-edit-model.cjs:202` is
`if (origin.payload.tags !== undefined) {` and `:203` is
`const tags = origin.payload.tags[row.id]; C.tagsOf(row, tags, validateTags);`, inside the BASIS
ROW LOOP in `createPlanEditProjector`'s own body, which `projectorFor` (`plan-edit-host.mjs:68`)
runs on the FIRST read. And `origin.payload.tags` is never absent: `setup-commands.mjs:124` builds
`payload: { profile, setup, tags: tagsOf(carried.tags, document) }` and its own `tagsOf` (`:61`)
refuses a non map outright, `validate` (`:139`) requires exactly three payload keys (`:143`) and
re-runs `tagsOf` over `op.payload.tags` at `:146`, and `source-admission.mjs:220` requires that
same `Setup.validate`. **So with no provider the athlete opens Edit my week and meets
`PLAN_EDIT_TAGS_INVALID` at E0, with no door, on a bare open, for an `update`, for a `remove`, and
on the adoption read, on every installation.** Both v2's and v3's discovery orders are withdrawn.

**The provider is not missing, it is UNMERGED, and v2 found where it lives.** Measured:

- `grep -rln projectNewExerciseTags rebuild` gives exactly ONE implementation in the tree:
  `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs`, whose `createSetupTagProjector` (`:64`) returns
  `{ validateSetupTags, projectSetupTags, validateExerciseTags, projectNewExerciseTags }` (`:195`).
  It is in a LANE directory and it is in `product` (verified by query), so moving it is a pin change.
- `rebuild/lanes/d/plan-edit/model.test.cjs:511-:515` (cell PE-f2-identity) proves that lane file is
  **sha256 equal to `rebuild/m4/workout/setup-tags.cjs` at commit `f3e9561`**, and `durable-host.test.mjs:24-:32`
  says the same in words: "lane keeps a byte-identical copy of the public F2 source at f3e9561".
- `PLAN-EDIT-V2-AUTHOR-REPORT.md:8` names the reason it is not on the tip: lane D's **separate,
  unmerged F2 package** (`m4/workout/setup-tags.cjs`, `lanes/d/f2/**`), deliberately skipped so part 1
  did not ship another package's product. "Nothing of F2 is on the tip in any form."

**THE RULING: land `rebuild/m4/workout/setup-tags.cjs` as product, on the S10 child, BEFORE EW-04 and
EW-15 can go green. ACCEPTED BY THE PM AS PROPOSED at `E-R6`: lane D lands it, with its own review,
and EW-04, EW-15 and EW-17c wait on it and say so.** Not a new page-side provider: a second
implementation of the tag taxonomy is a second spelling of the rule, the defect class the codebase
names at `plan-edit-model.cjs:61-63`, and the one that would be silent. `rebuild/m4/**` is SEALED by
name at `:536` (2), so this is a reseal hunk with its own custody, exactly like section 4's.

**AND IT IS NEEDED BY MORE THAN THE THREE CELLS v2 NAMED.** Under 4.3 ruling 2 as `E-R4` re-cuts
it, the admission fold runs `inspect()`, which runs `commands.validate` (`plan-edit-model.cjs:285`)
with `validateTags`, so **section 4's fix cannot be built without this package either.** Under
3.4.4's last paragraph the ADOPTION READ needs it too. So 3.5 is not a leaf dependency of two
cells; it is a prerequisite of 3.4, 4.3 and 4.4 alike, and that is a reason to land it FIRST on
S10 rather than beside them.

Consequences a builder must plan around:

1. `model.test.cjs:516-:518` currently ASSERTS that neither `plan-edit-commands.cjs` nor
   `plan-edit-model.cjs` mentions `f2-tag-adapter` or `setup-tags`. That stays true (the sealed
   factory injects; the runtime still imports nothing). **v2 then said PE-f2-identity's
   `git show f3e9561:` read "must be re-pointed at the merged path when it lands", and that is
   WRONG and v3 drops it (R2 N3.5).** `model.test.cjs:511-:512` reads
   `git show f3e9561:rebuild/m4/workout/setup-tags.cjs`, a blob AT A HISTORICAL COMMIT. Landing the
   same file on a later commit does not change what `f3e9561` holds, so the cell keeps passing
   untouched and no lane owes it a hunk. R2 is right and the correction is free.
2. **v3's released `edit-week-tags.mjs` shim is DELETED (`E-R12`, R3 B1 (iii)).** It was a
   RELEASED file that `createRequire`d `rebuild/m4/workout/setup-tags.cjs`, which TODAY-SPLIT
   E.3's module edges fail outright (`FENCE-VIEW-IMPORT`, `rebuild/m4/**`), and it bound the tag
   rule that decides what `plan-edit-model.cjs:350-:356` writes into a durable operation, which
   PM NOTE b seals whatever its purity. **The `createRequire`, the single
   `createSetupTagProjector(...)` call and the three bound functions all live in
   `edit-week-lane.cjs` now** (3.3 line 2c, about 12 of its lines). Nothing released names a tag
   rule at all. If a builder finds itself writing a taxonomy anywhere, released or sealed, that is
   a STOP: a second spelling is a second rule (`plan-edit-model.cjs:61-63`).
3. **UNTIL IT LANDS, THE DOOR DOES NOT OPEN, AND THE BLOCKED LIST IS MOST OF THE SUITE
   (`E-R13`, R3 B2 (1), SPIKE M1 rows 1, 5 and 7).** Blocked: **EW-01, EW-02, EW-03, EW-04,
   EW-05, EW-08, EW-09, EW-11, EW-12, EW-13a, EW-13b, EW-13c, EW-13d, EW-14, EW-15, EW-17c and
   EW-18**, which is every cell that opens the editor, plus EW-09 and the Machine settings
   door because 2.2's E0 serves ONE `host.read()` for BOTH doors and the athlete reaches Machine
   settings through it. **EW-19 IS STRUCK FROM THIS LIST IN v5 (R4 N2 ADOPTED).** v4's copy of it
   carried eighteen ids while section 5, 7.1, 7.2 and 9.3 all carried seventeen; EW-19 opens no
   editor, it drives the exported `watchDayRollover` with a fake `doc`, and every other statement
   of the list was right. **Not blocked: EW-16 (DOM and copy, over a fixed view model), EW-17a,
   EW-17b and EW-17d (they drive admission, not the editor, and SPIKE M4 rows 5, 6 and 7 ran them
   without any F2 wiring), EW-19, EW-20 (it drives the import screen's own exported `refusalLines`
   and needs nothing), and every RELEASED file of 3.3 line 1, which can be written and proved
   against frozen reply objects.** v3's sentence "EW-02, EW-03, EW-05 and the Machine settings door are
   NOT blocked" is WITHDRAWN. 5, 7.1, 7.2 and 9.3 all carry the corrected list.
   **THE ONE CHEAP ESCAPE, named and NOT taken:** the Machine settings door could be reached
   without E0's read, which would unblock EW-09 alone. That is a design change to 2.2's entry
   state, it makes the door chooser lie about which doors are open, and it buys one cell. The PM
   may rule otherwise; this spec does not propose it.
4. **v3 could not verify the blob and v4 CAN, because the spike checked out the branch in a farm
   scratch worktree (SPIKE M6).** `rebuild/m4/workout/setup-tags.cjs` at `f3e9561b` and the pinned
   `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` are BYTE IDENTICAL, both sha256
   `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d`, 198 lines, `diff` empty.
   The file has **no imports at all**, so landing it adds one product entry and no closure.
5. **WHAT LANDING IT NEEDS, and WHO DOES IT (`E-R13`, SPIKE M6).** Files: the one file above is all
   this door needs. Cells: `rebuild/lanes/d/f2/projector.test.mjs`, `composition.test.mjs`,
   `heads.test.mjs` and `engine.test.cjs`, **79 pass, 0 fail, 1.6 seconds, measured in the farm at
   `f3e9561b`** (a bare `node --test rebuild/lanes/d/f2/` fails, because it also picks up
   `mutants.cjs` and `product-fixture.cjs`, which are not cells: whoever lands it names the four
   files). CI: those four added to `rebuild.yml` as disclosed hunks, exactly as `:474` added
   `lanes/d/plan-edit`. SEAL: a new undeclared runtime file makes `b-package --ci` report drift, so
   it needs a seal child declaring it product with role `new`; the live children are S8 (`:522`)
   and S9 (`:543`), and **this spec asks for S10 with F2 FIRST on it** (3.3 line 6). ROUTE:
   **not a rebase of `rebuild/lane-d-f2-b1b2`**, which forks from `ff6b6b57` and would show
   unrelated deletions; cherry pick `e86018c8`, `410a7b70` and `f3e9561b` onto the tip, as `:473`
   did for plan edit. RETIREMENTS in the same change: `durable-host.test.mjs:27-:35 tagSource()`,
   the `PE_F2_PUBLIC_REF` allowlist, `f2-tag-adapter.cjs` and the PE16 f2-adapter-identity cell.
   **`:548` records that the PM dispatches this as ITS OWN LANE from the spike's M6, so none of it
   is EW2-BUILD's work and none of it is in this lane's estimate.**
6. **ONE THING THE PM SHOULD KNOW BEFORE IT LANDS, because nothing else in the chain says it
   (SPIKE M6).** F2's CODE has never been reviewed or accepted. `DECISIONS:155` judged the BRIEF
   and `:174` accepted `BRIEF-F2-TAG-PROJECTION-v1.0.md` BY NAME; a grep for `setup-tags` across
   `rebuild/DECISIONS.md` returns only `:544`'s statement that it is unmerged and sha identical;
   and `rebuild/lanes/d/f2/` holds cells and a fixture but **no review file**, the three reports
   being author side. So the lane that lands it is landing 198 lines of product that a brief
   accepted and no reviewer ever read, and it needs its own independent review for that reason
   and not merely for form.

### 3.6 Two reductions this plan depends on, stated so the next hand can check them (R1 N10)

Both keep the S10 hunk small, and neither was claimed in v1:

- **`liveDay` costs zero sealed bytes.** `today-bindings.mjs:723` already exposes
  `liveDay: () => (typeof liveDay === "function" ? liveDay() ...)`, so the S4 real-day requirement
  (`:437`/`:451`/`:467`) is satisfied by an existing export and `today-bindings.mjs` keeps its
  CALLED ONLY, zero byte row.
- **`setupOperation` costs zero pinned bytes, but v2's route to it does not work and v3 corrects
  it.** `rebuild/m3/w7-preview/today/setup-host.mjs:45` exports
  `setupsIn(generation, profile = PROFILE)` (and `:131` its default export), and that file is **not
  in the seal at all** (re-verified by my own query: absent from `product` AND from
  `executionPins`). **But `setupsIn` does not return the operation.** Measured at `:57-:63`, it
  `.map`s each surviving op to a FROZEN PROJECTION ROW,
  `{ op_id, date, time, setup, tags }` and nothing else. `createPlanEditProjector` needs the raw
  operation: `plan-edit-model.cjs:108-:110` demands `kind === 'fact'`, `class === 'event'`,
  `payload.profile === 'earned/first-run-setup/v1'`, `payload.setup`, and a 64 hex
  `canonical_content_commitment`, then `:112` reads `op_id`, `athlete_id`, `device_id` and
  `effective.local_date`. A projection row carries three of those nine fields. **Handing a row
  straight in refuses `PLAN_EDIT_ORIGIN_UNPROVEN` at `:110`.**

  **THE CORRECTION, and it still costs zero pinned bytes and adds no second rule. AMENDED IN v4
  (`E-R17`, R3 B6, SPIKE M3 row 15): IT DOES NOT LOAD.** v3 wrote
  `setupsIn((await repository.load()).generation, PROFILE)`, and the spike counted that
  `repository.load()` as one of the four per adoption. The sealed lane instead calls
  `setupsIn(generation, PROFILE)` over **the generation `openEditWeekHost` was handed** (3.4.2),
  exactly the shape `setup-host.mjs:85` already uses minus the load, takes the ONE surviving row's
  `op_id`, and reads the raw operation out of **that same generation's** `collections.ops` by that
  id. `setupsIn` keeps
  ownership of WHICH op counts (its tombstone and `rejected` filters at `:47-:55` and its
  `device_seq` ordering at `:56`); the factory only dereferences an id it was given. Re-spelling
  that filter in the factory would be the second-spelling defect
  `plan-edit-model.cjs:61-63` names, and this avoids it. If the row count is not exactly one, the
  factory does not construct the host and the editor draws E0's refusal.

---

## 4. THE CARRIED PROVENANCE DEFECT, AND THIS SPEC'S RULING

Carried at `:510` ("Edit My Week amends state and writes no second setup op, so a capture recorded
AFTER an edit that moved a set count would refuse capture_sets; **reachability open**; noted for Edit
My Week part 2") and again at `:519` ("Edit My Week part 2 must restate capture provenance for edits
that move a set count").

### 4.0 REACHABILITY, MEASURED, not asserted (v2, R1 B6, upheld)

v1 said `:532` made the defect reachable because the owner has imported. **That is false and v2
withdraws it.** `:532` records the import and its follow-ups and says NOTHING about reachability;
`:510`'s own words leave it open. And the owner cannot make such an edit today: no page, host, entry
or app module constructs the companion (`grep -rn 'createPlanEditHost' rebuild` returns the export at
`plan-edit-host.mjs:42`, two Astra review annexes and four lane D cells, and nothing else), and
`today-entry.mjs` exports `createCheckInEntry` (`:49`), `createSetupEntry` (`:93`),
`createWorkoutEntry` (`:150`), `boot` (`:226`), `watchDayRollover` (`:471`), `mountToday` and
`createTodayModel` (`:533`), and nothing plan-edit shaped. Section 1.3 said as much in v1 and the
authority line contradicted it.

**THE MEASURED STATEMENT, and it is stronger for the PM, not weaker: the refusal is UNREACHABLE
today because nothing constructs the companion. It becomes reachable ON THE DAY PART 2'S WIRING HALF
SHIPS, for any athlete who edits and then admits an import.** The owner's completed import removes
one of the two orderings. **CORRECTED IN v6 (`E-R38` F12, Astra F12, UPHELD).** v5 said "the
remaining ordering (edit, train, re-admit) is still supported, and
`rebuild/lanes/d/import-retract/retract.test.mjs` proves retract-and-re-import exists". **The cited
cell proves the OPPOSITE for an ADMITTED import: `retract.test.mjs:138-148` is the row
"P3D-3 - retract of an ADMITTED import is REFUSED", asserting `retracted === false` and
`LOCAL_IMPORT_RETRACT_REFUSED_ADMITTED`, and `local-client.mjs:407-411`'s own comment says an
admitted import "leaves by another path". Its successful re-import, P3D-6 at `:189`, is of an
UNADMITTED retracted selection. THE REACHABILITY CLAIM IS THEREFORE NARROWED TO WHAT IS
DEMONSTRATED: first-run edit then FIRST admission is the reachable journey, and it is the one J1
drives; admitted edit, retract, re-admit is NOT presently supported and no sentence in this spec
may rest on it.** So this
section ships WITH part 2 or part 2 ships the interim of 4.3 ruling 4. The schedule is unchanged from
v1; only the stated reason is corrected, because a false reason is what gets re-litigated when S10 is
being trimmed.

**AND IN v4 REACHABILITY IS NO LONGER A STATEMENT ABOUT SCHEDULING. IT WAS DRIVEN, END TO END, ON
A REAL SEALED BUNDLE (`E-R19`, SPIKE M4).** `:510` called reachability OPEN. The spike closed it:
real era, real setup lane, real plan edit companion over `era.client`, real gym card, a real
bundle sealed by `port.cjs` through the real custody handle and the real
`createLocalSourceController`, ten cases. **Nine of the ten refuse the import. The one that
succeeds is the one with no edit.** The three checks v3 predicted all fire, each on the kinds v3
named; and a FOURTH thing fires before any of them, on every kind, which nobody had seen. 4.1.1
carries both results and 4.3 rules on them. **The defect is not merely reachable. As the code
stands, ONE SAVED EDIT OF ANY KIND ENDS THE ATHLETE'S ABILITY TO IMPORT HIS OWN HISTORY.**

### 4.1 (a) WHICH BASIS SUCH A CAPTURE IS PROVED AGAINST, with the code path

Read at `724ef3fc` in `rebuild/m3/w6/local/source-admission.mjs`:

- `programme(source, ops, { today, documentSets, documentProgramme })` at `:217` builds a scratch
  state from the phone's own FIRST RUN SETUP DOCUMENT (`:221 createCleanInitState`) and fills two OUT
  PARAMETERS: `:228` `documentSets.set(ex.id, ex.sets)` and `:237` `documentProgramme.state = scratch`.
- the caller mints both at `:431-:432` and hands them in at `:438`. The callback also closes over
  `state` (the ADMITTED, file-derived state) and `liftAttach` (`:437`).
- the four inner checks live in ONE `resolveCapturedLayout` callback that runs for every stored
  workout start (`:596` onward).

**THE ANSWER TO (a), as a rule and not as an implementation detail: a recorded capture is proved
against the SETUP DOCUMENT that this phone ran when the capture was written, and against nothing
else.** An Edit My Week update does not write a second setup document. It writes one plan mutation
member, `{ field:'training.exercise-edit', unit:'record', provenance:'athlete_edited',
value:{ profile:'earned/plan-edit/v1', intent_id, starts_on, edit } }`
(`plan-edit-commands.cjs:95-:99`), and NOTHING in admission reads that field.

### 4.1.1 A FIFTH SITE BREAKS FIRST, AND THEN THREE OF THE FOUR CHECKS (RE-WRITTEN IN v4 ON SPIKE M4; v2 and v3's three-of-four is kept and is no longer the whole story)

#### 4.1.1.0 THE FIFTH SITE: A SAVED PLAN EDIT REFUSES THE IMPORT BY ITSELF (NEW IN v4, SPIKE M4 FACT 1)

**Nobody has named this before: not the ticket, not `DECISIONS:510`, not `:544`, not R1, R2 or R3,
and not v1, v2 or v3 of this spec. It was found by running an import, not by reading one.**

SPIKE M4 rows 2, 3 and 10 are the three CONTROLS the ticket expected to be admitted: a name only
change, a session recorded BEFORE `starts_on`, and a `hi` only change. **All three refuse
`LOCAL_SOURCE_EFFECT_UNMAPPED`.** Only row 1, the case with no edit at all, is admitted. Measured,
`source-admission.mjs:526` is the replay loop's catch all:

```
issue(op.class==='food-day'||op.class==='steps' ? 'LOCAL_SOURCE_DAILY_UNRESOLVED'
    : op.class==='plan' ? 'LOCAL_SOURCE_EFFECT_UNMAPPED'
    : 'LOCAL_SOURCE_CONTEXT_UNRESOLVED', op.op_id);
```

It is reached because the family loop above it claims F1 to F7 by profile and class and **nothing
claims a `plan` class or `plan-mutation` kind operation**, which is exactly what Edit My Week
writes (`plan-edit-commands.cjs:95`: `{kind:'plan-mutation', class:'plan', payload:null}`). One
issue per saved edit; SPIKE M4 row 4, with two edits, raises two. `validateGeneration:170`, the
other `EFFECT_UNMAPPED` site, does NOT fire, because the edit writes into `collections.ops` and
`outbox` and not into `collections.plan`.

**WHAT THAT MEANS, said plainly for the PM: until admission gains a replay family for the plan
class, an athlete who has EVER used Edit My Week cannot import his old history at all, whatever
the three capture checks do.** It does not matter which kind he used, whether he trained
afterwards, or whether any capture is involved. Section 4's whole re-pointing exercise is
downstream of a door that is shut.

**AND THE CODEBASE ALREADY KNOWS THE ANSWER, in its own comments at `source-admission.mjs:9-:27`:
a class with no family "fell to the catch-all and refused", and the remedy it has used twice is a
NEW FAMILY** (F7, the measure family, `:528-:542`; F8, the sleep family). 4.3 ruling 0 rules it
the same way and 4.4 prices it.

#### 4.1.1.1 THEN THE FOUR CHECKS (v2, R1 B1, upheld; every row now MEASURED rather than predicted)

v1 ruled on `capture_sets` alone. Measured at the tip, all four checks, in the order they run.
**SPIKE M4 FACT 2 drove every one of them and the predictions hold, with one addition v3 did not
have: `capture_membership` also fires for an ORDER ONLY change** (SPIKE M4 row 4, two updates that
move a lift to U and back to L, altering neither the pool nor any count), because `:699` compares
`encode([...counts.keys()])` with `encode([...produced.exercise_ids])` and that is order sensitive.
**`capture_producer` never fired in any of the ten cases**, which confirms the one NO in the table.

| check | line | what its right-hand side is | does an in-scope edit break it? |
|---|---|---|---|
| `capture_producer` | `:598` | the engine's two rule profiles | **NO.** A plan edit does not change the rule profile. The only one of the four that survives untouched |
| `capture_lift` | `:614` | `state.exercises` (the ADMITTED state) through `liftAttach` (declared `:437`, applied `:613`) | **YES.** A lift minted by `add` or by `replace` exists only in the projected plan: `plan-edit-model.cjs:345` clones the row, `:349-:355` tags it, **`:358` pushes it into `state.exercises` and `:359-:365` maintain `exOrder`** (v2 cited `:344-:356` for the mint and stopped one line short of the push, v3, R2 N3.6). It is in neither the document nor the file, `liftAttach` returns null, `target` stays the new id, the filter finds zero, and a session recorded on that new lift refuses ONE CHECK EARLIER than `capture_sets`. EW-04 is in scope. The comment at **`:601-:611`** (v2 said `:604-:612`) calls this check "total" at **`:610`** because an uncorresponded SETUP lift is appended as retired; a plan-edit-added lift gets no such appending |
| `capture_sets` | `:665` | `documentSets`, the document's own count per lift | **YES.** After an edit that moves `sets`, the document holds the OLD count, the gym card prescribes the NEW count, the capture records the NEW count, and `:665` compares NEW against OLD and refuses, naming the athlete's own lift as the problem |
| `capture_membership` | `:695-:699` | `sessionMembership(documentProgramme.state, originalDay)`, the whole day's pool compared IN ORDER | **YES.** A `remove` (EW-05), a `replace` (EW-04) and a `day` change (`day` is in `CHANGES` at `plan-edit-commands.cjs:46`, and EW-08 edits that door) all move the pool or its order, and `plan-edit-model.cjs:315` maintains `state.exOrder` explicitly, so the order really does move |

**THE SPIKE ROW FOR EACH, so no row of that table is a prediction any more (`E-R19`):**
`capture_producer` never fires (all ten rows). `capture_lift` fires for `add` (SPIKE M4 row 8,
field `capture_lift`, exercise id `ew2-added-lift`) and for `replace` (row 9, `ew2-replacement`),
**naming the MINTED lift, exactly as R3 B5 predicted**. `capture_sets` fires for a set count
change and for nothing else (row 5, field `capture_sets`, exercise id `calves`).
`capture_membership` fires for a `day` change (row 6), a `remove` (row 7) **and an order only
change (row 4)**. Every one of those nine rows raises `LOCAL_SOURCE_EFFECT_UNMAPPED` FIRST, from
4.1.1.0.

`:510` is not a limit here: it named the ONE case it had measured and left reachability open. A
ruling that covers `capture_sets` alone ships EW-04 and EW-05 with a refusal nobody ruled on.

One dependency stated plainly, because it is what makes `capture_lift` and `capture_membership` real:
they break only once the edit REACHES the gym card, which is exactly what 3.4 builds. Before 3.4 the
capture never names a new lift, because the card never prescribes one. **3.4 and 4.3 are the same
change seen from two ends, and they belong on the same child.**

### 4.2 (b) THE MISSING CELLS: FOUR in v4, three in v2 and v3, one in v1 (R1 B1, and SPIKE M4 FACT 1 adds the fourth)

No cell anywhere in the tree walks that order. ONE cell does not settle a family of refusals, so
EW-17 is **EW-17a, EW-17b, EW-17c and, new in v4, EW-17d**, and they are the FIRST things
EW2-BUILD writes, red, before any screen. **EW-17a and EW-17b are also the two that can run to
their answer the day this spec is accepted, because SPIKE M4 rows 5, 6 and 7 ran them with no F2
wiring at all (3.5 consequence 3).**

Every one of them has the same three steps and differs only in the edit and the assertion:
(1) save one Edit My Week edit through the REAL host; (2) record a gym session on or after
`starts_on`, through the REAL gym path, so the capture carries the edited shape; (3) run admission
over a SYNTHETIC history file for the same athlete.

**THE CONTROLS ARE RE-CUT IN v3 (`E-R3`, R2 B3).** Under NO DISJUNCT each cell gains a control that
was impossible to write against v2's ruling, because v2 admitted both sides: a capture carrying the
PRE-edit shape on a date at or after `starts_on` must REFUSE.

> **EW-17a** (`update` that moves `sets`). ASSERT the outcome 4.3 chose for `capture_sets`, by that
> field name.
> CONTROL 1: the same three steps with an edit that changes only `n` must NOT refuse.
> **CONTROL 2, NEW: a capture carrying the PRE-edit count, recorded on a date AT OR AFTER
> `starts_on`, must still refuse `capture_sets`.** That is the disjunct's victim and it is what
> proves the widening is gone.
>
> **EW-17b** (`remove`, and a second run with a `day` change). ASSERT the outcome 4.3 chose for
> `capture_membership`, for BOTH pool and order.
> CONTROL 1: an edit whose `starts_on` is AFTER the capture's own local date must leave the check
> exactly as it is today.
> CONTROL 2: a capture whose pool matches the folded day but whose ORDER does not must still refuse,
> so the cell cannot pass by comparing sets instead of sequences.
>
> **EW-17c, MAIN ASSERTION AND BOTH CONTROLS REWRITTEN IN v4 (`E-R16`, R3 B5, SPIKE M4 rows 8
> and 9).** Two runs, `add` and `replace`.
> **MAIN:** with the edit saved and the session recorded on `starts_on` or later, admission
> **ADMITS**, and the cell asserts that the issue list contains NO issue whose `field` is
> `capture_lift`. Today, MEASURED, that same walk refuses
> `LOCAL_SOURCE_PROGRAMME_UNRESOLVED` with `field:'capture_lift'` and `exercise_id` the MINTED
> lift (`ew2-added-lift` for the `add`, `ew2-replacement` for the `replace`), which is the red
> this cell starts from and which the cell quotes in its failure message.
> **CONTROL 1 (kept, and it is the one that must NOT change):** a capture naming a lift that NO
> programme in the story ever carried, edited or not, still refuses `capture_lift`, because that
> is the corruption the check exists for.
> **CONTROL 2, REWRITTEN:** after a `replace`, a capture naming the REPLACED lift on a date AT OR
> AFTER `starts_on` must still refuse `capture_lift`. `plan-edit-model.cjs:362` writes that
> retirement, `put(state.retirements || (state.retirements = {}), target.id, op?.op_id || 'preview')`
> (**`:361` is `const index = (order[oldDay] || []).indexOf(target.id);` and v3 cited `:361` three
> times: R3 N1 is right, the claim is true, the line was one off, and v4 says `:362`**), so the
> folded state does not carry the old lift on that date. **MARKED UNMEASURED (`E-R19`): the spike
> drove a capture on the MINTED lift, not one on the RETIRED lift, so this control's outcome is
> derived from `:362` and `result()`'s `:376 if (value.starts_on <= date)` and not from a run.**
>
> **EW-17d, NEW IN v4 (SPIKE M4 FACT 1, 4.3 ruling 0).** The fifth site, and it is the cheapest
> cell in the set because it needs no capture at all. Save ONE `update` that changes only `n`,
> record NO session after it, and run admission. ASSERT admitted, with no issue whose code is
> `LOCAL_SOURCE_EFFECT_UNMAPPED`. **MEASURED TODAY (SPIKE M4 row 2): it refuses
> `LOCAL_SOURCE_EFFECT_UNMAPPED`, and so do rows 3 and 10, the other two controls the ticket
> expected to pass.**
> CONTROL 1: with NO edit at all the same walk is ADMITTED (SPIKE M4 row 1), so the cell cannot
> pass by breaking the fixture.
> CONTROL 2: with TWO saved edits the issue appears TWICE before the fix (SPIKE M4 row 4), which
> pins the refusal to the OPERATION and not to the import.

**v3 SAID THESE CELLS WOULD SETTLE REACHABILITY, AND THAT SENTENCE IS NOW SPENT.** v3 wrote: "if
all three come back GREEN at the tip, the defect is not reachable through this path, the fix below
is not built". **The spike ran that experiment (SPIKE M4) and the answer is that NINE OF TEN CASES
REFUSE.** So the branch where the fix is not built is closed: the four cells are no longer an
investigation, they are the RED-FIRST proof of a fix that is now known to be needed. They stay in
the suite afterwards as the regression that keeps it shut.

EW-17c has a known ordering trap: `capture_lift` runs BEFORE `capture_sets`, so a cell that asserts
`capture_sets` on an `add` will pass for the wrong reason. **And in v4 there is a trap one level
above that one: `LOCAL_SOURCE_EFFECT_UNMAPPED` (4.1.1.0) fires before ANY of the three, on all
nine refusing rows, so a cell that merely asserts "not admitted" passes today for the wrong reason
on every kind.** Each cell asserts its own FIELD by name, and EW-17d asserts the CODE by name.

**THE MIDNIGHT WINDOW: A WRITTEN RULE AND A CELL, not an open question (`E-R18`, R3 N9, SPIKE M7).**
Adoption runs at boot (`today-app.cjs:2550`) and on `onAdmitted` (`:700`); across midnight it runs
again only through `watchDayRollover` (`today-entry.mjs:458-:459`, `:471`). R3 asked whether there
is a window in which the gym card prescribes YESTERDAY's fold while a session started in it is
stamped TODAY, which is the one way section 4's re-pointed checks could refuse a workout the
athlete really did. **MEASURED, AND RE-STATED IN v6 (`E-R38` F11, Astra F11, UPHELD): the window is
real and the 60 seconds is a POLLING PERIOD, not an upper bound.** `intervalMs = 60000` at
`today-entry.mjs:472` is the argument to `setInterval(check, intervalMs)` at `:482`. The real
scheduling assumption, stated: **the check is SCHEDULED at most 60 seconds after the day turns on a
document the browser is not throttling, and the reopen it starts completes at an unbounded later
time; a suspended or backgrounded page, a throttled timer or a slow reopen all widen the window,
and `watchDayRollover` drives visibility callbacks, not elapsed time and not Start.** A hard bound
needs a fresh-day READINESS CHECK at Start, which 13.7 specifies and EW-19 cannot today fail for.
The 60 second figure stays as what it is: the scheduling period (SPIKE M7 rows 2
to 4, re-measured by me at `ad8ced07`), **or the
next `visibilitychange` while the document is VISIBLE, whichever comes first. A
`visibilitychange` while the document is HIDDEN does NOT close it** (row 3, because `onVisible`
tests `doc.visibilityState !== "hidden"`), so a phone that wakes straight into another app can
hold it open for the full minute.

> **THE RULE.** Edit My Week adds nothing to that window and narrows nothing in it. The window is
> `watchDayRollover`'s, it predates this item, and section 4's fold answers for the capture's OWN
> `local_date`, which is the stamp the session carries. So a session STARTED inside the window and
> stamped TODAY is proved against TODAY's fold, which is the correct programme for its stamp, and
> the only inconsistency is that the card may have PRESCRIBED from yesterday's for up to 60
> seconds. **A builder may not widen the fold to "yesterday or today" to paper over it: that is
> the disjunct `E-R3` removed, re-introduced by the back door.**
>
> **EW-19, NEW IN v4.** Drive `watchDayRollover` directly, as SPIKE M7 does, with a fake `doc`
> carrying a real listener list: assert that after local midnight and before any `check()` the
> standing day is still YESTERDAY (row 2), that a `visibilitychange` while HIDDEN does not move it
> (row 3), that one while VISIBLE moves it and calls `reopen` exactly once (row 4), and that
> `stop()` detaches the listener (row 5). It is a cheap cell over an exported function and it
> retires the question rather than leaving it for the first real capture.

**AND ONE BINDING DETAIL THE FOLD'S AUTHOR MUST NOT TRIP OVER (R3 N2, upheld).** 4.3 ruling 1 says
the fold is written ONCE PER CAPTURE keyed on the capture's own local date. Measured,
`capture_sets` is `source-admission.mjs:665` and `const originalDay = start.effective.local_date`
is **`:674`, NINE LINES LATER**, so a builder who puts the fold "at the head of the capture
callback" and names `originalDay` writes a `ReferenceError`. **The material is in hand as
`start.effective.local_date`; the BINDING is not.** Either the fold names
`start.effective.local_date` directly, or `:674`'s declaration moves to the head of the callback,
and whoever writes the hunk says which in the diff.

### 4.3 (c) THE RULING, in SIX lines in v4 (five in v3; SPIKE M4 FACT 1 adds ruling 0, and it comes FIRST because it fires first)

0. **THE `plan` CLASS GETS A REPLAY FAMILY, AND UNTIL IT DOES NOTHING ELSE IN THIS SECTION CAN BE
   OBSERVED (NEW IN v4, SPIKE M4 FACT 1).** `source-admission.mjs:526` refuses every
   `plan-mutation` operation `LOCAL_SOURCE_EFFECT_UNMAPPED` because no family claims it. The
   remedy is the one the file has already used twice and explains in its own comments at `:9-:27`:
   **a new family, RETAINED and never projected, exactly as F7 the measure family
   (`:528-:542`) and F6 (`:745`) already are**, claiming `op.class === 'plan'` with
   `kind === 'plan-mutation'`. **CORRECTED IN v6 (`E-R33`, Astra F4, MEASURED): v5 said
   `payload.value.profile === 'earned/plan-edit/v1'` and that field DOES NOT EXIST. The stored
   operation's `payload` is `null` by construction (`plan-edit-commands.cjs:95`, `:109` refuses any
   other value) and the profile lives at `members[0].value.profile`, so the v5 discriminator either
   throws on `null.value` or, written defensively, claims NO real edit at all
   (`spike/ew2r6-w4-pending-view.mjs`: `stored op.payload = null`,
   `members[0].value.profile = "earned/plan-edit/v1"`). The family is identified BY CLASS AND KIND
   and then VALIDATED: `op.class === 'plan' && op.kind === 'plan-mutation'`, then
   `Commands.validate(op, id => ops[id])`, which reads the profile from the member where it is.**
   Pushed as
   `families.push({family:'F9', state:'retained', op_id:op.op_id})` with `F9` a working name the
   admission lane owns. A plan operation of that class that FAILS its own
   `Commands.validate` is refused **in the class's name**, not by the catch-all, which is the rule
   `:78-:81` states for the shared class.
   - **RETAINED, NOT PROJECTED, and that is the whole safety argument.** The edits are athlete
     local records that admission does not replay into the imported state; what USES them is the
     fold of ruling 2, per capture, from the same generation. A family that PROJECTED them would
     be a second spelling of edit semantics inside admission, which is the defect
     `plan-edit-model.cjs:61-63` names.
   - **IT DOES NOT WIDEN WHAT IS ADMITTED.** Before the family, one saved edit refuses the whole
     import (SPIKE M4 rows 2, 3, 10). After it, the same walk is admitted or refused on the
     evidence of the three capture checks of ruling 1 and nothing else. EW-17d is its cell and
     EW-17d's CONTROL 1 (no edit, admitted, SPIKE M4 row 1) is what keeps the fixture honest.
   - **CUSTODY:** the admission lane's, on S10, in the same file and the same review as ruling 1's
     re-pointing, and 4.4 prices it.

1. **EXTEND PROVENANCE TO THE COMPANION'S PLAN BASIS. Do not refuse at the edit. NO DISJUNCT
   (v3, `E-R3`, R2 B3 upheld; v2's first two rows are WITHDRAWN).** The right-hand side of all
   three broken checks BECOMES the setup document as it stood ON THE CAPTURE'S OWN LOCAL DATE after
   the athlete's own proved plan edits, and nothing else is admitted:

   Write `FOLDED = foldPlanEditsAt(..., originalDay)` (ruling 2) once per capture, where
   `originalDay` is `source-admission.mjs:674 start.effective.local_date`, which the callback
   already has in hand. Then:
   - `capture_sets` (`:665`): `documentSets` is replaced by the per lift count **FOLDED**
     prescribes on `originalDay`. One value, not two. A count that does not equal it refuses,
     exactly as `:665` refuses today (D-PF-f5).
   - `capture_lift` (`:613-:614`): **RE-TAKEN IN v5 UNDER `E-R16 PRIME`. v4's version, which
     carried out `E-R16` exactly as it was worded, IS WITHDRAWN, and R4 B1 is UPHELD IN FULL: the
     PM's ruling put a FILE id against a DOCUMENT-id set.** v4 wrote "`:613`'s correspondence
     resolution stays exactly as it is" and "`:614`'s membership test is replaced by the same
     one-of test asked of FOLDED's exercises". Both sentences are about the right thing and they
     are about two DIFFERENT id spaces. `:613` resolves through `lift_correspondence`, whose own
     module says it returns "for each DOCUMENT lift id, the ONE FILE lift id it answers for", and
     FOLDED is `foldPlanEditsAt` over `createCleanInitState({setup: op.payload.setup})`, which is
     DOCUMENT ids start to finish. **Measured on the old app's own shape, twice, by two hands:
     R4's own cell (`spike/r4b-capture-lift.mjs`) and this round's
     (`spike/r5-idspace.mjs`), and the two agree value for value.**

     **THE RULING, IN THREE PARTS, AND EACH ONE NAMES ITS ID SPACE.**

     **(a) THE MEMBERSHIP QUESTION IS ASKED IN DOCUMENT SPACE.** "Was this lift in the athlete's
     week on the day of this session" is asked of the capture's OWN document lift id,
     `slot.lift_lineage_id`, against FOLDED at `start.effective.local_date`. That id IS the
     document's, which is not an assumption: `:615-:617`'s own comment says so in as many words,
     "COUNTED UNDER THE DOCUMENT'S OWN ID, before the re-key: capture_sets and capture_membership
     below both ask the DOCUMENT, and the document knows this capture only by the id it prescribed
     under." So `:614` becomes the one-of test over FOLDED asked of `slot.lift_lineage_id`, and
     `capture_lift` joins `capture_sets` (`:665`) and `capture_membership` (`:695-:699`) in the ONE
     id space all three of them already needed. **It is reachable as worded and no third comparison
     is invented.**

     **(a2) AND THE SET IS FOLDED'S *ACTIVE* ROWS, NOT `FOLDED.exercises`. THIS IS THE ONE PLACE
     THE RULING HAD TO BE MADE SHARPER THAN IT WAS WORDED, AND THE MEASUREMENT IS WHY.** A `remove`
     or a `replace` records a RETIREMENT (`plan-edit-model.cjs:361-:362` puts into
     `state.retirements`); it does not delete the row from `exercises`. **Measured
     (`spike/r5-idspace.mjs` section 5), on a real saved `remove machine-fly` with `starts_on`
     `2026-09-17`:** a one-of over `FOLDED.exercises` is TRUE on `2026-09-16` AND TRUE on
     `2026-09-17`, so `(d)` would not hold at all; a one-of over FOLDED's ACTIVE rows (its
     `exercises` minus its `retirements`) is TRUE on `2026-09-16` and FALSE on `2026-09-17`, which
     is `(d)` exactly. **The ACTIVE spelling is also the one that agrees with `capture_membership`,
     which already reads the engine's `sessionMembership` over the folded state and therefore
     already honours retirements.** The DATE comparison is done by the FOLD, not by `exActive`,
     which is what makes this safe: `:690`'s own warning that "`exActive` honours `retirements`
     with NO date comparison" is about the ADMITTED state, and FOLDED is taken per capture date.

     **(b) THE ATTACHMENT QUESTION STAYS AT `:613`, IN FILE SPACE, BYTE-UNCHANGED.** "Which lift's
     history does this capture join" is `target = liftAttach(slot.lift_lineage_id) ?? slot.lift_lineage_id`,
     and **not one character of `:613` moves**. It is what the re-key at `:731-:734` applies, it is
     what P3-REAL-SHAPE's comment at `:510-:524` exists to protect, and **measured, all twelve of
     the twelve corresponded lifts on `variant(0)` keep exactly the target they have today**
     (`spike/r5-idspace.mjs`, row "(b) the twelve, printed"). This is not a disjunct and it is not
     a conjunction: they are two different questions about two different id spaces, and this row
     says which is which, which is R4's own way out (b) and the PM's ruling.

     **THE MEASUREMENT, printed, on both fixtures and at both sides of `starts_on`. Seventeen slot
     ids: the document's sixteen lifts plus one lift a plan edit added.**

     | the FILE | capture date | `:613` targets that DIFFER from the slot id | PASS today (`:614` over the ADMITTED state) | PASS under `E-R16` as worded | PASS under `E-R16 PRIME` (a) + (a2) |
     |---|---|---|---|---|---|
     | `variant(0)`, the old app's own shape | on/after `starts_on` | **12 of 16** | 16 of 17 | **5 of 17** | **16 of 17** |
     | `variant(0)` | before `starts_on` | 12 of 16 | 16 of 17 | **4 of 17** | 16 of 17 |
     | `variant(7)`, the shape SPIKE M4 sealed | on/after `starts_on` | 0 of 16 | 16 of 17 | 17 of 17 | 16 of 17 |
     | `variant(7)` | before `starts_on` | 0 of 16 | 16 of 17 | 16 of 17 | 16 of 17 |

     **Under `E-R16 PRIME` the answer no longer depends on the fixture's bracket level, which is
     the whole point.** The ONE row that differs from today is the right one in each direction, and
     the cell prints both by name: on/after `starts_on` the lift the `remove` retired
     (`machine-fly`) REFUSES where it passes today, which is `(d)`; before `starts_on` the lift the
     `add` minted (`ew2-added-lift`) refuses, because it was not in his week yet, and on/after it
     PASSES where it refuses today, which is the `add` and `replace` case SPIKE M4 rows 8 and 9
     measure refusing. **Nothing that passes today refuses under this ruling for any other reason:
     the cell's "refused by `E-R16 PRIME` (a) that pass today" list is EMPTY on both fixtures.**

     **(c) A LIFT A PLAN EDIT ADDED HAS NO FILE LIFT, AND WHAT THE ADMITTED STATE CARRIES FOR IT IS
     MEASURED RATHER THAN ASSUMED (`E-R16 PRIME` (c)).** Measured
     (`spike/r5-idspace.mjs` section 4), on `variant(0)` and on `variant(7)` alike:

     | question about a lift a plan edit ADDED | measured |
     |---|---|
     | the setup document (`createCleanInitState`) carries it | **NO** |
     | FOLDED at or after `starts_on` carries it | **YES** |
     | `lift_correspondence` has an entry for it | **NO, null on both fixtures** |
     | so `:613`'s `target` for a capture naming it | **its OWN document id, unchanged** |
     | the ADMITTED state carries a row under that id | **NO, on both fixtures** |

     **Under which id its captures attach: its own document id, and the ADMITTED state has no row
     there.** The reason is exact and it is in a block this spec never opened: `:477-:484` appends
     every document lift the file does not answer for, but it iterates
     `documentProgramme.state.exercises`, which is the SETUP document, and the setup document never
     carried a lift a plan edit minted afterwards.
     **THE CONSEQUENCE, STATED AND NOT PAPERED OVER.** `:731-:734`'s own comment says the re-key
     moves a projected entry "to the lift the admitted state actually carries - which capture_lift
     has already proved, one slot at a time, over this very id". Under (a) `capture_lift` no longer
     proves that, and for a plan-added lift it is measured FALSE. For every other slot it stays
     true by construction rather than by the check (a corresponded lift's target is a FILE lift and
     the file's lifts are the admitted state; an uncorresponded SETUP lift is appended by
     `:477-:484` under its own id), so the gap is exactly one case and it is the case ruling 1
     exists for. **This spec does NOT invent the fix, because `E-R16 PRIME` tells it not to.** The
     two shapes are named, neither is built, and STOP 18 and 9.4 Q-M carry the choice to the PM:
     either `:477-:484` also appends the lifts FOLDED carries that the setup document does not, or
     the re-key leaves a plan-added lift's entries under an id the admitted state has no row for.
     **EW-17c's ROW 4 is the cell that makes it visible either way**, and 12.4 lists what is still
     unmeasured about it: nobody has yet driven a REAL sealed bundle whose capture names a lift a
     plan edit added, because that needs the port.

     **(d) A LIFT A PLAN EDIT RETIRED, BOTH DIRECTIONS, MEASURED** (`spike/r5-idspace.mjs` section
     5, a real saved `remove` through the real host, `starts_on` `2026-09-17`):

     | the capture's own date | FOLDED records the retirement | the lift is ACTIVE in FOLDED | `capture_lift` under (a) + (a2) |
     |---|---|---|---|
     | `2026-09-16`, BEFORE `starts_on` | no | **yes** | **PASSES** |
     | `2026-09-17`, ON `starts_on` | yes | **no** | **REFUSES** |

     That is the behaviour the ruling asks for, and it is the same answer `capture_membership`
     already gives for the same day, which is why the two can no longer disagree.

     **WHY A CONJUNCTION WOULD HAVE BEEN THE WORST OUTCOME, in R3's own words and I could not
     improve on them:** it would leave EW-17c's MAIN assertion red while its CONTROL 1 passes,
     "green control, red subject, and a builder with two readings of one sentence to choose from".
     **AND WHY THE REPLACEMENT AS `E-R16` WORDED IT WOULD HAVE BEEN WORSE STILL:** measured, it
     refuses twelve of sixteen lifts on the old app's own shape, which is the exact defect
     `:600-:611` records P3-REAL-SHAPE fixing, re-introduced by the fix for a different defect, on
     the population this ticket exists for. R4 found it by running a fixture whose file ids are NOT
     the phone's slugs, which is why `E-R21` now makes the bracket level part of every cell.
   - `capture_membership` (`:695-:699`): the pool and order are compared against
     `sessionMembership(FOLDED, originalDay)` instead of
     `sessionMembership(documentProgramme.state, originalDay)`. Pool AND order, exactly and in order.
     **Both sides are DOCUMENT ids already: the left side is `[...counts.keys()]`, which `:618`
     fills from `slot.lift_lineage_id`, and the right side is the engine's membership reader over a
     document-id state. This row did not have R4 B1's defect and does not move.**

   **THE ID SPACE TABLE, NEW IN v5 (`E-R16 PRIME` (e)). EVERY ID AND EVERY SET THIS SECTION
   COMPARES, WITH THE SPACE IT LIVES IN, SO THAT NO ROW EVER AGAIN PUTS A FILE ID AGAINST A
   DOCUMENT-ID SET OR THE REVERSE.** DOCUMENT space is `slugOf`'s slugs, which the phone's own
   first-run setup minted. FILE space is the old app's short handles. `lift-correspondence.cjs`'s
   own header is the authority: "after option A the two id spaces are independent ... an id is no
   longer an answer", and the answer is the NAME.

   | the id or the set | where it comes from | id space | what it is compared against, and in which space |
   |---|---|---|---|
   | `slot.lift_lineage_id` | the stored capture's layout, `:613`, `:618` | **DOCUMENT** (`:615-:617`'s own comment) | under (a): FOLDED's ACTIVE rows, **DOCUMENT**. MATCHED |
   | `target` = `liftAttach(slot.lift_lineage_id) ?? slot.lift_lineage_id` | `:613` | **FILE** where a correspondence exists, **DOCUMENT** where it does not | nothing, under this ruling. It is the ATTACHMENT answer that `:731-:734`'s re-key applies, and (b) leaves it exactly as it is |
   | `state.exercises` (the ADMITTED state) | `:477-:484` over the file's lifts plus uncorresponded document lifts | **MIXED BY CONSTRUCTION: FILE ids, plus DOCUMENT ids for the lifts the file does not answer for** | nothing, under this ruling. v4 compared `target` against it and that was the one row that worked; (a) moves the QUESTION, not this set |
   | `FOLDED.exercises` | `foldPlanEditsAt` over `createCleanInitState({setup})` | **DOCUMENT** | `slot.lift_lineage_id`, **DOCUMENT**, but see (a2): the ACTIVE rows, not this set |
   | FOLDED's ACTIVE rows (`exercises` minus `retirements`) | the same fold, per capture date | **DOCUMENT** | `slot.lift_lineage_id`, **DOCUMENT**. This is `capture_lift`'s right-hand side |
   | `counts` keys | `:618`, `counts.set(slot.lift_lineage_id, ...)` | **DOCUMENT** | `documentSets`, replaced by FOLDED's per-lift count, **DOCUMENT**. MATCHED, and it always was |
   | `produced.exercise_ids` | `sessionMembership(FOLDED, originalDay)` | **DOCUMENT** | `[...counts.keys()]`, **DOCUMENT**. MATCHED, and it always was |
   | `lift_correspondence` | `correspondence(source.exercises, scratch.exercises)`, `:398` | a map **DOCUMENT id -> FILE id** | it is the only bridge between the two spaces in this file, and `:613` is its only reader in this block |
   | the re-key's `e.lift_lineage_id` | `:733`, the PROJECTED session's entries | **DOCUMENT** going in, **FILE** coming out | the ADMITTED state, **MIXED**. See (c): measured, a plan-added lift has no row there, and STOP 18 carries it |
   | `logical_set_slot` | the capture's own slot key | **DOCUMENT**, deliberately, and it is NOT re-keyed (`:722-:731`, D-RS-R1-n5) | nothing here. Named so no hand assumes it agrees with the entry beside it |

   **A reviewer of the admission hunk reads this table first and refuses any line that crosses a
   row of it.** It is also what `E-R21` asks every cell to name: a fixture whose bracket has
   already remapped the file's ids to the phone's slugs makes the FILE and DOCUMENT columns
   identical and hides every defect in this table, which is exactly how `E-R16` reached the PM.

   **WHY THE DISJUNCT WAS WRONG AND THE MEMBERSHIP ROW WAS RIGHT, in the words R2 used and I could
   not improve on.** The whole point of a dated fold is that for a given capture date there is
   exactly ONE count and ONE pool the programme prescribed. The second disjunct IS that value. The
   first disjunct is the UNFOLDED document, which on any date at or after `starts_on` prescribed
   something the programme no longer prescribed, so v2's ruling admitted a capture carrying the old
   count on a day the programme had moved on from. That is precisely the class of corrupt capture
   `:665` exists to refuse. The same holds for `capture_lift` after a `replace`: `:361` retires the
   old lift on `starts_on`, and the disjunct kept admitting captures that named it afterwards.
   **v2's own safety sentence, "a count matching NEITHER still refuses", was the admission that the
   guard had become two of two rather than one of one.** Nothing is widened by v3.

2. **ONE DERIVATION, EXPORTED FROM THE FILE THAT OWNS THE RULE. This is where v1 priced a line it had
   no way to write (R1 B4, upheld).** `plan_basis` is a companion value. `programme()` and the capture
   callback are handed `ops` (`:438`) and nothing else, so the material exists but the derivation does
   not, and re-deriving edit semantics inside `source-admission.mjs` is precisely the bug
   `plan-edit-model.cjs:61-63` names about `normaliseName`:

   > "It must not be restated here: a second spelling of the rule is a second rule, and the bug would
   > be silent."

   **v2's SHAPE IS WITHDRAWN. `E-R4` rules, with R2 B4, that a fold over `apply()` and the raw
   `ops` map is not the fold, and I re-derived the reason rather than accepting it.** v2 named
   `foldPlanEdits(documentState, ops, onLocalDate)` "which reuses that file's own `apply()`
   (`:319`)" and said it "authenticates nothing itself: the caller passes the ops admission has
   already proved". Measured at `00e7a0d0`, both halves fail:

   - **Admission has proved nothing about those ops.** `source-admission.mjs:218-:220` filters
     `ops` for `payload?.profile === Setup.PROFILE`, requires exactly one, and runs
     `Setup.validate` on THAT op. Nothing else in `programme()` inspects the operation map. A plan
     mutation op is `{kind:'plan-mutation', class:'plan', payload:null}`
     (`plan-edit-commands.cjs:95`), so `:218`'s filter cannot see it by construction, and it is
     equally unproved when a fold reaches for it.
   - **`apply()` is not where the proving lives.** Everything that decides WHICH edits count is in
     `inspect()`: per op command validation `:285`, origin uniqueness `:282`, tombstones
     `:287-:293`, the status map `:294` and `:306`'s `active` filter, duplicate intent `:298`, id
     reuse `:299`, causal invalidation `:300`, the seen basis chain and parent set `:307-:309`, and
     date ordering `:310`. A fold over `apply()` and a raw map therefore applies an edit the
     athlete RETRACTED and an edit whose basis chain never proved, which widens admission through
     the back door: a tombstoned set count change would make the old count admissible again.

   **THE SHAPE, as `E-R4` rules it: the model's own `inspect()` plus `result()` pair, exported.**
   Measured, that pair already exists and is already composed: `result(info, date)` is
   `:369-:382`, and `read(generation, date)` at **`:383`** is literally
   `result(inspect(generation), date)`. `createPlanEditProjector` is already exported at `:397`.
   So the derivation the fix needs is NOT new logic; it is an entry point.

   **AND HERE IS THE PART THAT DECIDES THE PRICE, which I could not find stated anywhere and
   which the admission hunk's author must not discover at the first fixture.** The projector's
   PUBLIC `read()` cannot be called from `source-admission.mjs` as it stands, because `inspect()`
   opens with FOUR guards that ask "may this installation open the EDITOR right now", not "what
   did the plan say on date D":
   - `:226-:227` a non zero sync frontier, a recovery plan or a non empty snapshot plan refuse
     `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`;
   - `:235` `importPresentIn(generation) !== !firstRun` refuses the same code. Admission runs on a
     generation whose `metadata.imports` may already carry an entry (`:176` reads exactly that
     list), so a fold built with `basisSource:'first-run'` refuses there;
   - `:236-:240` the other branch requires `admittedBasisOf(generation)` to equal `basisState`,
     and admission's `basisState` must be the DOCUMENT (`createCleanInitState` at `:221`), not the
     admitted import, so that branch cannot be used either;
   - `:242-:243` a non empty `collections.plan` or `planTransactions` refuses
     `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`.

   **THE EXPORT, REWRITTEN IN v4 ON THE SPIKE (`E-R14`, R3 B3 upheld, SPIKE M5 rows 1, 2, 3, 9
   and M4 FACT 3). ITS SIGNATURE NOW CARRIES `basisSource`, AND ITS `documentState` IS TAG
   PROJECTED, because measured, v3's signature refuses before it folds anything:**

   ```
   foldPlanEditsAt({ documentState, setupOperation, generation, onLocalDate,
                     basisSource, hashBasis, validateTags, projectNewExerciseTags })
   ```

   added to `plan-edit-model.cjs`'s exports at `:397`, which runs `inspect()`'s PROOF half in full
   and `result()` (`:369-:382`) unchanged, and SKIPS the four editability guards above. It is
   implemented by factoring `inspect()` into `guards` and `proofs` so there is still exactly ONE
   spelling of every proof; nothing existing changes behaviour. It returns `state` only, never the
   basis object (ruling 3). It reads no storage and constructs no host.

   **`basisSource` IS `'first-run'`, EXPLICITLY, AND THE IMPORT PRESENCE GUARD IS ONE OF THE FOUR
   THAT IS SKIPPED. THE MEASUREMENT THAT FORCES IT:** R3 offered two ways out and SPIKE M5 killed
   the first twice over. With `basisSource:'local-source'` the fold refuses
   `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` at `:235` on a generation with no import (SPIKE M5 row
   2); and on a REAL import, SPIKE M4 FACT 3 measures `Model.importPresentIn(generation)` as
   **TRUE from `carry` onward, which is BEFORE `programme()` runs inside `prepareSource`**, while
   `admittedBasisOf` still cannot return an adopted basis, because the marker and
   `collections.derived.localSource` are written only at publish and reconcile. So `:238` refuses
   the same code instead. **NEITHER VALUE OF `basisSource` SURVIVES THE GUARDS DURING ADMISSION,
   which is why they are skipped rather than satisfied.** The value is nevertheless
   `'first-run'` and not a default, because it selects the PROOF half's behaviour and not only the
   guards: `:194`'s row binding is `base.exercises[i]` on the first run branch and
   `byId.get(row.id) || matchByName(...)` on the other, and `:200`'s row comparison changes with
   it. The document IS a first run setup document (`createCleanInitState` at
   `source-admission.mjs:221`), so `'first-run'` is the true answer and the only one whose proofs
   mean what this fold needs. **A default is not acceptable here: v3 took the default and SPIKE M5
   row 1 measures it refusing `PLAN_EDIT_TAG_BASIS_UNPROVEN`.**

   **`documentState` IS TAG PROJECTED BY F2 BEFORE IT IS HANDED IN, which is R3's way out (b) and
   the only one that folds (SPIKE M5 row 3: FOLDED, applied 2, sets 5, 4 lifts).**
   `projectSetupTags(createCleanInitState({setup: op.payload.setup}), {setup, tags, op_id, date})`
   over the same `op`, whose four context members are exactly what
   `f2-tag-adapter.cjs:141`'s `closed(ctx, ['setup','tags','op_id','date'])` demands, all four of
   which admission already holds at `:220-:221`. **This makes section 4 depend on the F2 package
   in a SECOND and heavier way than v3 said**, and 4.4 re-prices it. Without it, first run row
   proof `:209` finds none of `head`, `secondary` or `volumeTags`, `:213` sets `tagsOk = false`,
   and `:217` refuses.

   **FIVE COLLABORATORS AND ONE ARGUMENT THE ADMISSION SIDE MUST SUPPLY, each measured. v3 said
   FOUR and its own signature took six (R3 N3, upheld: `generation` is the one `inspect()` walks
   and was not on the list):**
   - `documentState`: `createCleanInitState({setup: op.payload.setup})`, `source-admission.mjs:221`,
     the scratch the document already builds, **then run through `projectSetupTags` as above**;
   - `setupOperation`: `op` at `:220`, the one Setup operation admission has already validated;
   - **`generation`: `g`, in scope at the capture callback (`source-admission.mjs:596`). It is the
     thing `inspect()` actually walks and v3's list of "four collaborators, each measured" left it
     out while the signature took it (R3 N3);**
   - **`basisSource`: the literal `'first-run'`, for the reason above;**
   - **`onLocalDate`: `start.effective.local_date`, NOT the identifier `originalDay`, which is
     declared nine lines later at `:674` (R3 N2, 4.2's closing paragraph);**
   - `hashBasis`: a 64 hex sha256 over a string. `platform` is in scope at the capture callback
     (declared `:143`, used at `:185` and `:779`), so `platform.hash` is the material;
     `plan-edit-model.cjs:101-:105` is the shape law it must satisfy and **whoever writes the hunk
     measures that adaptation rather than assuming it**;
   - `validateTags` and `projectNewExerciseTags`: **section 3.5's F2 package**, because `:285`
     runs `commands.validate`, which runs `editOf`, which for an `add` or a `replace` runs
     `tagsOf`. This is a dependency v2 did not have and it is why 3.5 lands FIRST on S10.

   Admission calls the fold ONCE per capture with `start.effective.local_date` and derives all
   three right-hand sides from the one result. **Each of the four skipped guards was driven
   (SPIKE M5 rows 6 to 11), and one drafting note the spike found: the four conditions v3 and R3
   both call "`:225-:227`" are ONE `fail()` at `:227` with three tests in front of it, so the
   factoring produces four GUARD BRANCHES and three `fail()` sites, not four.**

2a. **WHAT ADMISSION REPORTS WHEN THE FOLD REFUSES. RULED IN v4 (`E-R14`, R3 B3's last paragraph,
   SPIKE M5). NOTHING WITH A `PLAN_EDIT_*` CODE EVER ESCAPES ADMISSION.**

   Measured: every refusal inside `inspect()` and `result()` is a `TypeError` carrying a
   `PLAN_EDIT_*` code (`plan-edit-commands.cjs:5`), and SPIKE M5 rows 1, 2, 4, 5, 13 and 14 raised
   six different ones. Measured on the other side: `KNOWN_REPLAY_CODES`
   (`source-admission.mjs:96-:98`) is a CLOSED ALLOWLIST of `LOCAL_SOURCE_*` codes, and the file's
   own comment at `:90-:95` says why, in as many words: the recorded workout `try` at `:270`
   "may therefore only surface a code that is on this list; anything else keeps
   `LOCAL_SOURCE_WORKOUT_UNRESOLVED`". **So a `PLAN_EDIT_*` throw would either surface to the
   athlete as `LOCAL_SOURCE_WORKOUT_UNRESOLVED`, which is a lie about which part refused, or
   escape uncaught if the fold is called outside that try. Neither is acceptable and neither was
   ruled before this version.**

   **THE RULING, in three parts:**
   - **(i) THE ALLOWLIST IS NOT WIDENED.** No `PLAN_EDIT_*` code is added to `KNOWN_REPLAY_CODES`.
     That set is the mechanism R3 correctly identified and the answer is to keep it closed.
   - **(ii) THE FOLD CALL IS WRAPPED WHERE IT IS MADE, and the refusal is TRANSLATED**, by an
     explicit `try` around `foldPlanEditsAt` that re-raises as
     `fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED', { field: <one of the three below> })`, which is
     already on the allowlist and is already the vocabulary the import screen draws for every
     other programme refusal (`:219`, `:246`, `:266`, `:321`, `:598`, `:665`, `:699`).
     **STRUCK IN v6 (`E-R37`, Astra F8, `E-R27` means what it says).** v5 said here: "A throw that
     carries no `PLAN_EDIT_*` code at all is NOT translated and is left to propagate, because
     translating an unknown throw would hide a defect that is not this one's." **That sentence
     contradicts `E-R27` (`:568`), which rules that ANY throw from the F2 boundary is a refusal,
     and it is superseded. ANY throw at the F2 boundary, in the editor AND in admission, is
     contained and mapped to a named refusal with a DEFINED DEFAULT; a throw whose code this spec
     does not list maps to the default and is RECORDED, never propagated and never silent.** The
     exhaustive field table and the default are 13.6.
   - **(iii) THE FIELD NAMES, PROPOSED FOR THE PM as `E-R14` asks (three, not one per code, because
     the athlete cannot act on the difference between `:216` and `:285`):**

   | proposed `field` | the `PLAN_EDIT_*` codes it covers, each measured | what it tells the reader |
   |---|---|---|
   | `plan_edit_history` | `PLAN_EDIT_HISTORY_UNPROVEN` (`:285`, SPIKE M5 row 13), `PLAN_EDIT_BASIS_INVALIDATED` (`:300`, `:309`, row 14), `PLAN_EDIT_ORIGIN_UNPROVEN`, `PLAN_EDIT_DUPLICATE_INTENT`, `PLAN_EDIT_ID_REUSED`, `PLAN_EDIT_DATE_ORDER_UNPROVEN` | the athlete's SAVED EDITS on this phone do not prove out. This is the only one of the three that can be caused by real data rather than by a build defect |
   | `plan_edit_basis` | `PLAN_EDIT_TAG_BASIS_UNPROVEN` (`:217`, SPIKE M5 row 1), `PLAN_EDIT_TAGS_INVALID` (row 4), `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` (`:349`, row 5), `PLAN_EDIT_BASIS_HASH_UNAVAILABLE`, `PLAN_EDIT_BASIS_HASH_INVALID` | the fold's COLLABORATORS are wrong. Every one of these means the hunk was built or wired incorrectly, not that anything is wrong with his history |
   | `plan_edit_context` | `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` (`:227`, `:235`, SPIKE M5 rows 2 and 6 to 9), `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT` (`:243`, rows 10 and 11) | a guard the export is supposed to SKIP has fired, so the export is not the export this ruling describes. It should be unreachable and it is named so that it is not silent |

   **These three field names are NEW VOCABULARY and the PM seats them, exactly as he seats the
   four sentences of 2.2.2.1.** They are not copy: `field` values are drawn by the import screen
   through whatever treatment it already gives `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`, and no new
   athlete-facing sentence is proposed by this spec for any of them. If the PM prefers ONE field,
   `plan_edit_fold`, that is a smaller vocabulary and this spec does not object; it proposes three
   because the second and third are BUILD DEFECTS and the first is not, and a reviewer reading an
   issue list should be able to tell those apart without reading the code. **STOP 14 covers a
   fourth class appearing.**

3. **THE CONSTRAINT THE FIX MUST NOT BREAK, which v1 quoted and then did not carry forward.**
   `documentSets` (`:222-:228`) and `documentProgramme` (`:229-:237`) are OUT PARAMETERS kept
   deliberately OUT of the returned basis, in those files' own words, "because that object is the
   programme digest's input at `:325`, and a new member would change a digest that binds what was
   admitted".

   **THE QUOTATION IS EXACT AND THE NUMBER INSIDE IT IS STALE, and v3 says so rather than passing
   it on (R2 N3.3).** At `00e7a0d0`, `source-admission.mjs:325` is inside the exercise id loop.
   **The programme digest is computed at `:779`:**
   `programme_digest:digest(platform.hash,'earned/local-source-programme/v1',replayed.programmeBasis)`.
   The CONSTRAINT is real and unchanged; only the inherited line number was wrong, and since STOP 11
   refuses to ship a fix that breaks this constraint, its reviewer would have followed that number.
   **Read `:779`.**

   The folded state is PER CAPTURE DATE and must therefore stay a local value inside the callback or
   a third out parameter. **A dated basis that quietly becomes a basis member changes what was
   admitted, and that is a worse defect than the one being fixed.** Any reviewer of the admission
   hunk checks this first.

   **AND IN v4 THE CONSTRAINT IS CONFIRMED BY EXECUTION, not only by reading (SPIKE M5).** The
   spike's fold ran in admission's own context and the digest input did not move, by the code's own
   construction: `:221-:236` hands `documentSets` and `documentProgramme.state` out through OUT
   PARAMETERS, the comments at `:222-:228` and `:230-:236` say they are "NOT a member of the
   returned basis and therefore not a digest input", and `:779`'s input is the RETURNED basis over
   `PROJECTED_FIELDS` from the FILE. R3's section 5 reached the same answer from the other side.
   STOP 11 (a) stays anyway, because a future hand could still attach the folded state to the
   basis and nothing but the STOP would stop it.

   **AND ITS TWIN, which `E-R4` and R2 B4 both ask for: a fold that admits a TOMBSTONED edit is not
   shipped either. MEASURED IN v4 AND IT ALREADY HOLDS (SPIKE M5 row 12): a generation carrying a
   retracted `add` FOLDS with the tombstoned edit EXCLUDED, three lifts and not four.** That row
   PROVES the exclusion rather than asserting it, which is what `E-R4` and STOP 11 (b) demanded.
   STOP 11 in 9.1 carries both halves. The proof is the fold running `inspect()`'s status map
   (`:294`) and `active` filter (`:306`), and the round 4 cell is the spike's row 12 written as a
   cell: save an edit, retract it, and show the pre-edit count refusing afterwards.

4. **Refusing at the edit is the wrong trade and this spec rejects it by name.** The narrowed v1 need
   is "this machine is taken, swap the exercise". Refusing a set count change to protect a future
   import would break the one thing v1 exists for, for every athlete, to guard a path that only an
   importing athlete ever walks. There is also no sentence that is both true for that field and
   actionable by him at the edit: the true sentence describes something that may happen to a file he
   has not chosen yet.

5. **It is never silent, and the non silence is already built.** With the extension, the false
   refusal disappears and the true one keeps `:510`'s sentence, which names the field and the lift.
   **THE INTERIM OF v1, v2 AND v3 IS DEAD, AND SPIKE M4 FACT 1 KILLED IT.** All three said: until
   the fix lands, ship the Exercises door with some fields editable and the dangerous ones
   disabled (v1 disabled `sets`; v3 widened that to `sets`, `add`, `replace` and `remove`, leaving
   `n`, `day`, `hi`, `inc` and `steps` editable). **Measured, a `n` only change and a `hi` only
   change each refuse the whole import (SPIKE M4 rows 2 and 10), and so does an edit made by a
   phone that recorded no session afterwards (row 3).** There is no subset of the six fields that
   is safe, because the refusal is raised by the EXISTENCE of the operation and not by anything a
   capture carries. **So a partial door is not an interim; it is the same defect with fewer
   switches.**

   **WHAT REPLACES IT: THERE IS NO PARTIAL SHIP. Section 4's ruling 0 and ruling 1 ride the same
   child as the door, or the door does not ship.** That is a harder constraint than v3's and it is
   the honest one. Its cost is named: if S10 cannot carry both, Edit My Week waits, rather than
   shipping a door that quietly ends an athlete's ability to import his own history. 9.4 Q-B and
   STOP 15 carry it, and it is the strongest reason in this document for keeping the four hunks on
   one child.

   **THE ONE NARROWER THING THAT WOULD WORK, named so the PM has a choice and NOT proposed:**
   ruling 0 alone (the replay family, the cheapest of the four hunks) restores the pre-edit
   behaviour for every kind that does not move a capture, which measured is `n` only and `hi` only
   (SPIKE M4 rows 2 and 10 become row 1's outcome). It does NOT fix `sets`, `day`, `add`,
   `replace`, `remove` or an order only change, which still refuse on their capture check. A door
   shipped on ruling 0 alone would therefore be `n`, `hi`, `inc` and `steps` editable and nothing
   else, which does not serve the narrowed v1 need ("this machine is taken, swap the exercise") at
   all. **This spec does not propose it. It is recorded because it is the only honest partial
   ship, and because ruling 0 is worth landing early on its own merits.**

### 4.4 Custody of the fix, and the honest cost (re-priced a FOURTH time in v4)

`source-admission.mjs` is in `product` and SEALED BY NAME at `:536` (2). `plan-edit-model.cjs` is in
`product` and `rebuild/m4/**` is SEALED by name at the same place. The hunk is therefore NOT lane C's
and NOT in EW2-BUILD's diff. **It is TWO sealed files and THREE hunks in v4 (v3 said two files and
two hunks; SPIKE M4 FACT 1 adds the third):**

| file | hunk | why it is there |
|---|---|---|
| `rebuild/m4/workout/plan-edit-model.cjs` | ONE added export, `foldPlanEditsAt`, over the existing `inspect()` and `result()` (`:369-:382`) pair, plus the internal factoring of `inspect()` into its four editability guards and its proofs so that ONE spelling serves both callers. Nothing existing changes behaviour, and `read()` at `:383` and `preview()` at `:384` keep every guard they have today | the rule lives where it is spelled once, and the PROOFS are the point (`E-R4`) |
| `rebuild/m3/w6/local/source-admission.mjs`, HUNK A | one call keyed on `start.effective.local_date` (NOT `originalDay`, R3 N2), the SIX collaborators of 4.3 ruling 2 assembled around it (including `basisSource:'first-run'`, the `projectSetupTags` step over `documentState`, the `hashBasis` adaptation and the F2 projector), the `try` and the three field translations of ruling 2a, and **the membership test of `:614` REPLACED** plus `:665` and `:695-:699` re-pointed at its result | the checks live here |
| `rebuild/m3/w6/local/source-admission.mjs`, HUNK B, **NEW IN v4** | **the `plan` class replay family of 4.3 ruling 0**, in the family loop beside F7 and F5, RETAINED and never projected | SPIKE M4 FACT 1: without it every case with a saved edit refuses before a capture is looked at |

Authored by lane D or lane B with its own independent review, riding the SAME S10 child as section
3's sealed half and section 3.5's F2 package, **and AFTER 3.5, which it now depends on.**

**RE-PRICED A FOURTH TIME IN v4 (v1: 2 to 3; v2: 4 to 6; v3: 7 to 10; v4: 10 to 14 plus its own
review round).** Two things moved it and both are the spike's, not a re-estimate of the same work.

| what | hours | v3 |
|---|---|---|
| factoring `inspect()` into guards and proofs without changing what `read()` or `preview()` refuse, and proving it by the companion's existing twenty cells staying green | 2 to 3 | 2 to 3 |
| the exported `foldPlanEditsAt` and its own cells, **including `basisSource` as an argument and the tombstoned-edit twin, which SPIKE M5 row 12 already measures as holding** | 2 to 3 | 2 to 3 |
| the admission side HUNK A: **six** collaborators, the `projectSetupTags` step, the measured `hashBasis` adaptation, `:614` replaced and `:665` and `:695-:699` re-pointed, the digest invariance proof against `:779`, **and ruling 2a's `try` and three field translations** | 4 to 5 | 3 to 4 |
| **the admission side HUNK B, NEW: the `plan` class replay family, with EW-17d and its two controls** | **2 to 3** | not costed |
| **total** | **10 to 14 hours plus its own review round** | 7 to 10 |

v1 priced one line in one file for one check. v2 priced two files for three checks. v3 priced two
files for three checks where one must be re-factored without moving a refusal. **v4 prices the same
two files for FOUR refusal sites, where the fold cannot be built at all until 3.5 lands, where its
collaborators are six and one of them is a second F2 dependency, and where a refusal vocabulary had
to be ruled.** If the PM splits them across two children, **4.3 ruling 5 measures that there is no
partial ship to fall back on**, and 9.4 Q-B says why that makes splitting them worse than it was in
v3. **`E-R7` accepts the ruling in its corrected form and keeps them on S10 together.**

One warning for whoever writes it, measured: `plan-edit-model.cjs:173` has already been wrong once in
exactly this family. `:522` records B2, "still compared day/mg the admission no longer proves, so a
corresponded lift on another day admitted, adopted, then Edit My Week refused forever", fixed inside
the S8 round. The part 1 author report and both review files describe a file that no longer exists in
that form. Read `plan-edit-model.cjs` at the tip, never the report.

---

## 5. THE CELL PLAN, RED FIRST

Suite: `rebuild/m3/w7-preview/today/test/edit-week.test.mjs`, run by
`node --test rebuild/m3/w7-preview/today/test/edit-week.test.mjs`. Every cell individually
selectable by its EW id. **TWENTY cells in v5 (nineteen in v4, sixteen in v3):** the thirteen
`:176` kept, plus EW-17a, EW-17b, EW-17c, three the spike added in v4 (EW-17d, the plan class
replay family; EW-18, the day turned cell `E-R15` asks for; EW-19, the midnight window `E-R18`
asks for), **and ONE this round adds: EW-20, what the import screen draws for a `field` name it has
never seen (`E-R24` / Q-J, R4 N4)**. **EW-13 is written as FOUR selectable parts (EW-13a, EW-13b,
EW-13c and EW-13d), so the suite carries TWENTY-THREE selectable ids over twenty cells.**

**`E-R21`, NEW IN v5, AND IT BINDS EVERY CELL IN THE TABLE BELOW.** Round 3 found defects by
reading; round 4's spike found them by running the product; round 4's REVIEW found one by running
the product against a DIFFERENT FIXTURE, and that is the class this rule guards.
**EVERY CELL THAT ASSERTS WHAT IS ADMITTED NAMES THE BRACKET LEVEL OF THE FIXTURE IT SEALS**, so a
reviewer can ask what that level hides. `real-shape-support.mjs`'s bracket remaps the FILE's lift
ids to the phone's slugs at **level 2 and every level above it**, so at `sealed(7)` the
correspondence is the identity and the two id spaces of 4.3's id space table COINCIDE. A cell that
only ever seals level 7 cannot see a defect that lives in the difference, which is exactly what
happened to `E-R16`. **And at least one admitted-side row of EW-17c runs where the two spaces
DIFFER: `variant(0)`, the old app's own shape, which `r1-fixes.test.mjs:55-:70` already proves
admits through the real port.** R4's own cell, `spike/r4b-capture-lift.mjs`, becomes EW-17c's
named CONTROL 1.

Order of writing, and it is not negotiable: **EW-17d first of all, because SPIKE M4 FACT 1 makes
it the refusal that fires before every other one and it needs no capture and no F2**; then EW-17a
and EW-17b, which can also run to their answer at once (SPIKE M4 rows 5, 6 and 7 drove them with
no F2 wiring); then EW-17c, which waits on 3.5; then EW-11 and EW-12, because they decide whether
the host composition can carry the screens at all; then EW-13c and EW-13d, because they are what
catch 3.4.3's loop and they cost almost nothing once EW-13a exists; then EW-18 and EW-14; then the
rest. A screen written before EW-11 is green is a screen built on an assumption.

**AND THE COLUMN THAT MOVED MOST IN v4 IS `blocked on`.** SPIKE M1 measures that the companion
refuses its first read on EVERY installation without F2, so almost every cell that OPENS the
editor is blocked on 3.5 (3.5 consequence 3). That does not stop them being WRITTEN, red, on the
day this spec is accepted; it stops them going green. 5.2 and 9.3 say the same thing twice on
purpose.

| cell | what it proves | half | blocked on |
|---|---|---|---|
| **EW-17d** | **NEW IN v4.** 4.2, one `n` only edit and NO session: admission ADMITS and raises no `LOCAL_SOURCE_EFFECT_UNMAPPED`. Controls: no edit is admitted (SPIKE M4 row 1); two edits raise it TWICE (row 4). **`E-R21`: it seals `sealed(7)`, and it says so; the bracket level cannot hide this refusal because no capture and no lift id is involved in it.** **Red today, measured: SPIKE M4 row 2** | composed | **4.3 ruling 0's hunk for GREEN, NOTHING for the RED run.** It needs no capture, no F2 and no editor (`E-R23`) |
| EW-17a | 4.2, `update` that moves `sets`, asserting `capture_sets` by name, **with CONTROL 2: the PRE-edit count on a date at or after `starts_on` still refuses**. **`E-R21`: it seals `sealed(7)` and names it, and both sides of its comparison are DOCUMENT ids (4.3's id space table), so the bracket level does not decide its answer.** **Red today, measured: SPIKE M4 row 5, `capture_sets` on `calves`** | composed | **3.5 and 4.3 ruling 1's hunk for GREEN, nothing for the RED run** (`E-R23`) |
| EW-17b | 4.2, `remove` and `day`, asserting `capture_membership` by name, pool AND order, **with the order-only control, which SPIKE M4 row 4 measures as a REAL refusal today and not a hypothetical**. **`E-R21`: it seals `sealed(7)` and names it, and both sides are DOCUMENT ids.** Red today: SPIKE M4 rows 6 and 7 | composed | **3.5 and 4.3 ruling 1's hunk for GREEN, nothing for the RED run** (`E-R23`) |
| EW-17c | 4.2, `add` and `replace`, asserting `capture_lift` by name. **RE-WRITTEN AGAIN IN v5 ON `E-R16 PRIME` AND `E-R21`, AND IT IS NOW FOUR ROWS AND THREE CONTROLS, EACH NAMING THE BRACKET LEVEL OF THE FIXTURE IT SEALS.** MAIN, at **`sealed(0)`, the old app's own shape, where the two lift id spaces DIFFER**: an `add` and a `replace`, a capture dated at or after `starts_on`, admission ADMITS and raises no `capture_lift` issue. ROW 2, the same at `sealed(7)`, the shape SPIKE M4 sealed, where the two spaces coincide: same answer, and if the two rows ever disagree the fixture is hiding something. ROW 3, `E-R16 PRIME` (d): a `remove`, a capture dated BEFORE `starts_on` admits, one dated ON it raises `capture_lift`. ROW 4, `E-R16 PRIME` (c): a capture naming the lift the `add` minted, asserting BY NAME which id the projected entry carries after the re-key and whether the admitted state holds a row for it, whichever way STOP 18 is ruled. CONTROL 1, the named control `E-R21` asks for, which is R4's own cell `spike/r4b-capture-lift.mjs` reduced to four assertions and needing no seal: `correspondence(variant(0).exercises, PHONE.setup.exercises)['lateral-machine'] === 'lateral'`, the document carries no lift `lateral`, the same correspondence at `variant(7)` is the identity, and `PHONE_ID.lateral === 'lateral-machine'`. **Without CONTROL 1 the MAIN row is green on a fixture that cannot fail, which is how `E-R16` reached the PM.** CONTROL 2 (no edit, `sealed(0)`, admits) and CONTROL 3 (the twelve corresponded lifts keep their `:613` target, printed). Red today, measured: SPIKE M4 rows 8 and 9, naming `ew2-added-lift` and `ew2-replacement` | composed | **3.5** (both kinds enter `tagsOf`) for GREEN; **nothing for the RED run and nothing for CONTROL 1**, which needs no seal and no port (`spike/r5-idspace.mjs` runs it in under three seconds) |
| **EW-20** | **NEW IN v5 (`E-R24` / Q-J, R4 N4).** What the import screen draws for a `field` name its closed map has never seen. Drives the screen's own exported `refusalLines(code, detail, leadField)` and its frozen `REFUSAL_FIELD_SENTENCE` (`import/import-screen.mjs:152-:160`, `:170-:198`) with each of 4.3 ruling 2a's three names. ASSERTS: the map does NOT name them (its five keys are `capture_sets`, `setup_document`, `athlete_label`, `capture_lift`, `exercise_n`); the code line carries the new field name verbatim; the sentence beneath it is `REFUSAL_SENTENCE[code]`, the same sentence every other programme refusal draws, on BOTH the `leadField` path and the detail-string path; and a control on `capture_lift`, which the map DOES name, draws its own sentence instead. **Measured before it was specified (`spike/r5-field-vocab.mjs`), which is what turns R4 N4 from UNMEASURED into a row** | model, no host | **nothing.** It drives one exported pure function and needs no editor, no F2 and no seal. It imports `../import/import-screen.mjs`, which is a module edge E.3 fences, but E.2's FREE definition excludes `test/`, so the suite is not a fenced file |
| EW-01 | an enrolled athlete opens BOTH doors without first run setup; read, open, cancel and no op leave operation and outbox counts unchanged; AND the 2.2.1 boundary in both directions | composed | **3.5** (SPIKE M1 rows 1, 5, 7: the door does not open without F2) |
| EW-02 | one lift's `sets` changed; every other id, field, established load and tag deep equal; existing non chip values render without coercion | composed | **3.5** (v3 said nothing; `E-R13`) |
| EW-03 | rename keeps id, load, era and notes and the historical name lookup; a new eligible session uses the new name | composed | **3.5** (v3 said nothing; `E-R13`) |
| EW-04 | replace with a duplicate label: distinct stable id survives retry and reopen; new load unknown; old sessions and records survive | composed | **3.5** |
| EW-05 | dated removal excludes the lift from future scheduling only; open and historical sessions unchanged; unrelated order survives; **asserts `PLAN_EDIT_WEEK_EMPTY` ONLY, because `covered()` is never called on the remove branch (v3, R2 B6). The day coverage assertion moves to EW-02's update-with-`day` case (state E3) and to EW-04's replace and add cases (states E4 and E6)** | composed | **3.5** (v3 said nothing; `E-R13`) |
| EW-08 | equipment values for the selected lift only; invalid, blank and out of order `steps` use the real validation; no zero, NaN or hidden default | composed | **3.5** |
| EW-09 | machine notes save through the existing coach command and appear on the same id's actual gym card; rename retains them; replacement does not inherit them; empty final note save refuses | composed | **3.5**, because the athlete reaches the Machine settings door through E0's ONE `host.read()` (3.5 consequence 3) |
| EW-11 | the actual producer, validator and projector prove identity, domain, effective date, seen basis, actor edit and causal linkage; malformed and stale basis refuse | composed | **3.5** |
| EW-12 | one deliberate save yields one durable edit intent and its complete outbox; injected pre commit failure changes neither; retry does not duplicate; lease, integrity and closed era never show Saved. **v4: the save is made by the SEALED lane through `onWeek.saveChange` (renamed from `onWeek.save` in v5, `E-R22`), never by a released file (`E-R12`)**. **A CONTROL ADDED IN v5: the three released files contain ZERO of E.3's fenced member names in code position, which is 6.8's fourth bullet asserted from inside the suite as well as from the fence** | composed | **3.5** |
| EW-13a | reopen and replay reconstruct current and pending plans; preexisting history byte equivalent | composed | **3.5** |
| EW-13b | a rejected or tombstoned edit is not still applied by an editor local cache | composed | **3.5** |
| **EW-13c** | **REWRITTEN IN v4 on SPIKE M3 rows 9 and 10.** On an ADMITTED import installation, a SECOND open after one saved `update` reads and its state EQUALS the companion's own read. Control c1: the adopted value reads OK and proves nothing. Control c2: the ALREADY EDITED state refuses `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` at `:240`. **v3's version asserted `:240` against the adopted value, which is measured GREEN** | composed, THROUGH THE REAL ADOPTION CHAIN | **3.4's sealed lane AND 3.5** |
| **EW-13d** | **REWRITTEN IN v4 on SPIKE M3 rows 3 to 6.** On a FIRST RUN installation, **with `projectSetupTags` run over the basis**, a SECOND open after one saved `add` reads **AT A DATE ON OR AFTER THE EDIT'S OWN `starts_on`, NAMED IN THE CELL (NEW IN v5, R4 N1)**, AND the added lift appears exactly ONCE. **CONTROL d0, NEW IN v5: the same read taken on the ADOPTION'S OWN DAY, which is strictly before `starts_on`, shows the added lift ZERO times, and that is CORRECT and not a failure.** Measured, `spike/r5-readday.mjs`: no date given, the lift appears 0 times and the pre-edit `sets` stands; at `starts_on` and after, exactly once and the edited `sets`. Controls d1 `PLAN_EDIT_TAG_BASIS_UNPROVEN` at `:217`, d2 `PLAN_EDIT_ORIGIN_UNPROVEN` at `:134`. **v3 named `PLAN_EDIT_ID_REUSED`, which is measured UNREACHABLE on this path** | composed, THROUGH THE REAL ADOPTION CHAIN | **3.4's sealed lane AND 3.5** |
| **EW-18** | **NEW IN v4 (`E-R15`, SPIKE M2 row 9).** `PLAN_EDIT_DAY_TURNED` stays raisable: a FROZEN PAGE whose `clock.today()` is YESTERDAY while the live day is D throughout refuses `PLAN_EDIT_DAY_TURNED` at `plan-edit-host.mjs:225-:226` and draws state D. Controls: (1) frozen day equals live day, nothing moves, SAVED (row 7); (2) authored on D and saved after the live day turns refuses `PLAN_EDIT_REVIEW_STALE` at `:214`, NOT DAY_TURNED (row 8), **which is the cell R3 B4 asked for and the spike measures differently**; (3) `clock.today()` wired to `liveDay` makes DAY_TURNED unreachable in every ordering (rows 10 and 11), so the cell fails if the factory ever wires them together | composed, THROUGH THE REAL HOST | **3.4's sealed lane AND 3.5** |
| **EW-19** | **NEW IN v4 (`E-R18`, R3 N9, SPIKE M7).** The midnight window, bounded: drive `watchDayRollover` (`today-entry.mjs:471`) with a fake `doc`. After local midnight and before any `check()` the standing day is YESTERDAY (row 2); a `visibilitychange` while HIDDEN does not move it (row 3); one while VISIBLE moves it and calls `reopen` once (row 4); `stop()` detaches (row 5) | model, no host | **nothing.** It drives one exported function |
| EW-14 | same page commit reaches real Today and the next eligible gym entry with the new operation basis, **ON A DAY NAMED IN THE CELL THAT IS ON OR AFTER THE EDIT'S `starts_on` (NEW IN v5, R4 N1: the adoption's own day shows nothing, measured, `spike/r5-readday.mjs`)**; in progress workout and check in drafts survive; **and `planEditedState` returns a STATE on EVERY path, including `read === undefined`, `read.read === false` and a reply of an unexpected shape, so adoption can never silently stop (v3, R2 N3.2)**; **CHANGED IN v6 (`E-R34`, Astra F5): totality is NOT the whole assertion any more, because v5's version is green while the athlete is shown a stale plan and told nothing. The cell now asserts, on a refused read, ALL FOUR of 13.6's clauses: the card carries the PROVEN plan, `E-R34`'s sentence is present, `Start` is available, and the STORED `Start.plan_basis`, causal parents and prescription capture assert that PROVEN basis and not a plan-edited one. A control asserts that nothing on disk was tombstoned, superseded or rewritten by the refusal.** **AND THE STORED FIELDS ARE NAMED (`E-R38` F10): a changed CARD does not satisfy this row. `workout-basis.cjs:49-61` carries `plan_basis` as the constructor label, default `NO_ACCEPTED_PLAN`, so the row asserts the label by value; `causalTips` are refreshed per generation at `today-bindings.mjs:488` and are asserted separately. THE TWO-LOAD METRIC IS SCOPED to `athleteBasisState`'s basis composition, the operation `spike/r5-adoption.mjs` row B measured, and NOT to the whole adopt, rebase and refresh chain, whose gym creation loads again at `today-bindings.mjs:447`**; **and THE DURABLE LOAD COUNT PER ADOPTION IS TWO, asserted by name on an INSTRUMENTED repository that counts `repository.load()`, exactly the instrument `spike/r5-adoption.mjs` used (`E-R17 PRIME` (iii)). A control asserts the FLOOR of one with no editor composed at all, so a regression says which side it is on** | composed, THROUGH THE REAL HOST | **3.4's sealed hunk AND 3.5** (v2 said 3.4 alone; R2 N3.1) |
| EW-15 | tagged lift, explicit secondary `[]`, rename, replacement and a changed catalogue prove the `:155` snapshots | model | **3.5** |
| EW-16 | DOM: both doors, the before, after and date copy, the invalid, saving, saved and refusal states, keyboard labels and focus, narrow viewport, no new shell; copy census forbids em and en dash, emoji and exclamation marks | view | C-UI-9 |
| **EW-21 (J1)** | **NEW IN v6 (`E-R30`, Astra F1). THE JOURNEY FIVE ROUNDS DID NOT RUN.** First-run edit (`update sets=5` on a DOCUMENT id), import with DIFFERENT ids, RELOAD, read, **Start**. The read succeeds; **the SAVED sets figure is what the card carries AND what the stored Start's prescription capture asserts.** NEGATIVE CONTROL: correspondence absent for that id refuses `PLAN_EDIT_TARGET_UNTRANSLATED`, `E-R34`'s sentence C2 is shown, Start stays available and the stored Start carries the UNFOLDED basis truthfully. CONTROL: the stored `edit.exercise_id` is byte-unchanged after every read. **RED at v5's composition, measured: `PLAN_EDIT_TARGET_UNAVAILABLE` and a card prescribing `sets=2` (`spike/ew2r6-w1-import-identity.mjs`); GREEN under 13.2 (`spike/ew2r6-p1b-j1-noHostBytes.mjs`)** | composed | **3.5**, and section 4's hunks H2 and D |
| **EW-22 (J2)** | **NEW IN v6 (`E-R31`, Astra F2).** Save an `add`, import, reopen the editor, read, **add again with a new label.** The read succeeds, the replay created the row, the roster records it, the second add reviews and saves. **NEGATIVE CONTROLS, asserted by name so the row cannot go green by suppression: the same id refuses `PLAN_EDIT_ID_REUSED`, and so does a setup id.** **RED under `E-R25` (ii) as worded, measured: `PLAN_EDIT_ID_REUSED` on the reopen, retired or not (`spike/ew2r6-w2-creation-owner.mjs`); GREEN under 13.3 (`spike/ew2r6-p2-j2-prototype.mjs`)** | composed | **3.5**, and section 4's hunks C and H3 |
| **EW-23 (J3)** | **NEW IN v6 (`E-R32`, Astra F3). BOTH DIRECTIONS IN ONE ROW, because a guard that refuses everything passes the first half alone.** A NEW identity whose normalised label EQUALS an occupied FILE handle refuses BY NAME (`PLAN_EDIT_FILE_HANDLE_OCCUPIED` at admission, `PLAN_EDIT_ID_REUSED` at the editor), and minted against the reserved union it does not collide at all; an ESTABLISHED identity folded-renamed **PASSES**. **RED at v5, measured: `idCollisions` returns `[]` for the equal label and `["press"]` for the valid rename (`spike/ew2r6-w3-collision.mjs`); GREEN under 13.4 (`spike/ew2r6-p3-j3-prototype.mjs`)** | composed | **3.5**, and section 4's hunk C |
| **EW-24** | **NEW IN v6 (`E-R36`, Astra's third unkilled journey).** The editor is CLOSED after the durable commit has returned, then reopened: the reopen **reconciles by the stable review intent and shows the edit as SAVED**, and **no second add is offered until it has.** **RED today, measured: `close()` at that instant replies `LOCAL_CLIENT_CLOSED ok=false` over a committed operation, and the next open offers a second review under a fresh intent id with nothing reconciled (`spike/ew2r6-w5-inflight.mjs`)** | composed | **3.5** |

### 5.1 The composed cell, named exactly

EW-14, EW-13c, EW-13d, EW-18 and the FOUR EW-17 cells run through the REAL host composition and the
REAL durable client, not a projector helper and not a redraw. **EW-19 is the one exception and is
marked `model, no host` in the table: it drives the exported `watchDayRollover` with a fake `doc`,
exactly as SPIKE M7 did.** Concretely: the new `createEditWeekEntry` from
`today-entry.mjs` over `createPlanEditHost` (`plan-edit-host.mjs:42`) over the W6 durable public
client, with `fake-indexeddb` and `@peculiar/webcrypto` as the environment and an injected athlete
clock, exactly the composition the part 1 reviewer's own twenty cells used (`:473`). FIXTURES ARE
SYNTHETIC: a generated enrolled athlete, a generated setup document, a generated history file. No
private fixture, no real measurement, no owner data, ever, in any cell or any log line.

### 5.2 What a red cell means here

The suite must be red before the screens exist, and the report must show the red run. `:176`'s custody
line stands: D2 independently executes the accepted bar BEFORE reading the builder's report. A green
run that does not contain the EW ids is not this bar. A cell listed as blocked in the table above is
written RED and left red with its reason named in the report; it is never deleted to make a run green.

---

## 6. THE BAR

1. **The TWENTY cells of section 5 under their TWENTY-THREE selectable ids** (v4 said nineteen and
   twenty-two; v3 said sixteen and nineteen), individually selectable, green at the exact candidate
   head, with the red first run shown. **And under `E-R21`, every cell that asserts what is
   ADMITTED names in its own title or its first assertion the BRACKET LEVEL of the fixture it
   seals, and EW-17c's main row seals `sealed(0)`.** A cell blocked by 3.4 or 3.5 is red with its reason named, never removed. **And in v4
   the red first run is not a formality: SPIKE M4 measures EW-17a, EW-17b, EW-17c and EW-17d as
   red at the tip today, on a real sealed bundle, and the report quotes the spike's rows beside
   the lane's own run.**
2. The inherited suites green at that same head, named by real path with their cell counts: the Today
   suite, check in, sleep, workout, the machine note suite, the plan edit lane suites, W6, coach and
   client. A builder that cannot name a path does not get to claim its count.
3. Both OS CI green (`rebuild-public`, ubuntu and windows), with the CI ids that actually cover the
   new suite. Registering the suite is a hunk in the PINNED `.github/workflows/rebuild.yml` (3.3 line
   7), authored by the PM on the S10 child; this spec grants no `.github` custody to any lane.
4. The two design gates green for the states covered, `python3 quality/gate.py` and
   `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build.
5. Zero U+2013 and zero U+2014 in every file the build authors, proved by a count, not by a claim.
6. D2's independent implementation review at an exact branch and head (`:176` (2)). It is a SECOND
   obligation on top of the screens tier's own blind reviewer, not a substitute for it.
7. **RE-SCOPED AGAIN IN v4 for `E-R12`.** For the RELEASED half: no diff outside the **FOUR** new
   files (`edit-week-model.mjs`, `edit-week-view.mjs`, `edit-week-check.mjs`, the suite), the
   `t-edit-week` block, `preview.css`, and the route and mount inside the released `today-app.cjs`
   (3.3 line 2a). For the SEALED half: no diff outside `today-entry.mjs`, `today-lanes.cjs` (about
   ten lines) and the NEW `edit-week-lane.cjs` (3.3 lines 2b and 2c). The runner's
   `UNLISTED-PRODUCT-DRIFT` check is the proof, not a reading of the diff. This clause binds the
   LANE's diff. The S10 child additionally carries the `.github` hunk (3.3 line 7), section 3.5's
   F2 package and section 4.4's **three** sealed hunks across two files, each under its own
   custody and its own review.
8. **RE-WRITTEN IN v4 (`E-R12`).** The sealed WRITER-FENCE cell of `:542` (C) and `:543` is GREEN
   with this item's files in the tree, and the claim it proves is now much narrower and much
   easier to keep. **`edit-week-model.mjs`, `edit-week-view.mjs` and `edit-week-check.mjs` are the
   only three released files this item adds; not one of them imports anything sealed, holds a
   host, names a writer or spells a tag rule.** **FOUR** consequences the builder must be able to
   show on the fence's own printout (three in v4; `E-R22` adds the fourth, which is the only one
   on the fence's CALL side):
   - **no `FENCE-VIEW-IMPORT`**: their import closure is `plain-copy.cjs`, `design.cjs`,
     `machine-settings-view.mjs`, `exercise-catalogue.mjs` and each other, all on E.3's closed
     MAY-IMPORT list, and NOT `setup-model.mjs` (R3 N7, 2.2's E6 row);
   - **no `FENCE-SECOND-SEALED-IMPORT`**: they import ZERO sealed modules, so the one-partner rule
     is never exercised (3.4.1);
   - **`edit-week-lane.cjs` is DECLARED PRODUCT with role `new` on the same child that lands it**,
     or under E.2 the fence treats it as free and fails it on its own contents (3.4.1). That is a
     sequencing requirement on S10, not a fence exemption;
   - **A FOURTH BULLET, NEW IN v5 (`E-R22`, R4 B3 UPHELD): THE THREE RELEASED FILES CONTAIN ZERO OF
     E.3's FENCED MEMBER NAMES IN CODE POSITION, CENSUSED THE WAY 2.1 CENSUSED THE TWO OBJECT
     NAMES, WITH THE CENSUS PRINTED IN THE REPORT.** The first three bullets are all on the IMPORT
     side; the fence's other half is a TOKEN scan of the CALL side (E.4), over identifiers and
     member names, which cannot tell `onWeek.save(...)` from `host.save(...)`. v4's callback table
     was named `onWeek.save` and `onWeek.close` and would have gone red on a fence this spec makes
     its own bar. **Measured, `spike/r5-fence-names.mjs`, against E.3 at
     `rebuild/c-today-split@24b35244`:**

     | the seven MEMBERS of `onWeek` | v4's name | on E.3's durable-writer list? | v5's name | on the list? |
     |---|---|---|---|---|
     | open the door, ONE `host.read()` | `open` | no | `openWeek` | no |
     | review a change | `review` | no | `review` | no |
     | save the reviewed change | **`save`** | **YES, and unqualified** | `saveChange` | **no** |
     | cancel a review | `cancel` | no | `cancel` | no |
     | leave the editor | **`close`** | **YES, qualified "on a host identifier", which a TOKEN scan cannot honour** | `closeEditor` | **no** |
     | read the machine draft | `machineLatest` | no (it is one token, not `.latest`) | `machineLatest` | no |
     | save the machine record | `machineSave` | no (it is one token, not `.save`) | `machineSave` | no |
     | **the two OBJECT names** | `weekFacade`, `onWeek` | no, neither | unchanged | no |
     | **REDS** | **2 of 7** | | **0 of 7** | |

     The list carried 28 member names on the day this was censused. **The bar is the census, not
     the table: the builder re-runs it against whatever E.3 says on the day the fence runs**, since
     STOP 2 records that TODAY-SPLIT is in a fix round and the PM's `:550` is splitting that word
     list into names that PUT and names that only read.

   **A builder that has to make the fence skip any of these has found a STOP, not a workaround
   (STOP 4).**

---

## 7. WHAT WAITS, AND WHAT CAN BE BUILT NOW

### 7.1 Can start today, in parallel with the look, with no collision

- `edit-week-model.mjs`: the pure state machine over the FROZEN REPLY OBJECTS of section 2.1. It
  holds the draft, maps every refusal code of section 2.2 to a state, emits RAW FIELD VALUES to
  `onWeek`, and touches no DOM, no store and no host. **In v4 it is strictly smaller than v3's,
  because it no longer holds the five methods (`E-R12`).** It is testable without a browser and
  without the look.
- `edit-week-view.mjs` and `edit-week-check.mjs` in the existing `*-check.mjs` pattern, over the
  same frozen objects.
- The whole suite skeleton with all TWENTY cells written RED, against the merged companion,
  whose API is sealed and will not move under the builder.
- **EW-17d, EW-17a and EW-17b to their measured RED answer**, which SPIKE M4 rows 2, 5, 6 and 7
  already measure, and section 4's fix authored by its own lane on that evidence. **They do NOT
  reach green on acceptance: each one's green needs a SEALED hunk of section 4 that is another
  lane's and is on nobody's desk that day (`E-R23`, R4 B4).**
- **EW-19 to green**, because it drives one exported function and needs nothing from this lane.
- **EW-20 to green**, for the same reason: it drives the import screen's own exported
  `refusalLines` (NEW IN v5).
- **EW-17c's CONTROL 1 to green**, which needs no seal and no port: it is R4's own cell reduced to
  four assertions about `lift-correspondence.cjs` and the phone's document (`E-R21`).

**`edit-week-basis.mjs` and `edit-week-tags.mjs` are NOT on this list any more, because they no
longer exist (`E-R12`, 3.4.1 and 3.5 consequence 2).** `planEditedState` is still a pure function
with pure cells, but it lives inside `edit-week-lane.cjs` and therefore waits on the sealed half
with everything else there.

None of this depends on a pixel. **It is still the real parallel work, and v4 is honest that it is
now less than half the build rather than roughly half: the two files that moved sealed were both
on v3's start-today list.**

**WHAT CANNOT GO GREEN, AND IT IS MOST OF THE SUITE (`E-R13`, R3 B2, SPIKE M1).** v1 said EW-04
and EW-15 could start; R1 B3 corrected it; v2 and v3 named THREE blocked cells. **Measured, it is
seventeen of the twenty-three ids**, because the companion refuses its FIRST READ without F2 on every
installation: EW-01, EW-02, EW-03, EW-04, EW-05, EW-08, EW-09, EW-11, EW-12, EW-13a, EW-13b,
EW-13c, EW-13d, EW-14, EW-15, EW-17c and EW-18. A builder that follows an older plan opens the
editor on a bare fixture and watches it refuse **`PLAN_EDIT_TAGS_INVALID` at
`plan-edit-commands.cjs:66` from `plan-edit-model.cjs:203`, at projector construction, NOT at the
first `Review change` as v3 said and NOT at Save as v2 said**, and has nowhere to go. **Write them
red, with 3.5 named as the reason, and move on. Red is still worth writing: the cells are the
specification of what F2's landing must make true.**

**AND WHAT CANNOT START THAT v2 THOUGHT COULD (v3, `E-R1`).** 3.3 line 2a's route and mount inside
`today-app.cjs` cannot be written until TODAY-SPLIT lands, because until then the file is sealed and
this item has no child of its own for it. They are lane C work with a wait in front of them, not
work that is blocked forever, and they are about six lines.

**`E-R8` SETTLES Q-C AND Q-D: EW2-BUILD starts on the VIEW half as soon as this spec is accepted,
before C-UI-9 exists.** Everything in 7.1 is that work.

### 7.2 Waits, and on exactly what

| what | waits on | why |
|---|---|---|
| the editor's look, every state | a design ticket that does not exist: C-UI-9 (section 8) | building to the 2026-09-12 brief's numbers buys a second port of the whole editor |
| `preview.css`, any style hunk | S9 sealing, because it is released only then | `:536` (1): the release happens INSIDE S9, never by editing a sealed artifact |
| `build.mjs`, if a new bundle input is needed | S9 sealing WITH hunk H18 | S9 A.6: without H18 the closed list is one path and `build.mjs` stays sealed |
| the Machine settings door's rendering | C-UI-5, **AND whichever reseal child carries C-UI-5's own sealed files** | C-UI-5's MAY CHANGE list (`C-UI-5.md:8-9`) is `machine-settings-view.mjs`, `machine-settings-host.mjs` and "the gym stubs in `gym-app.mjs`". The last two are in `product` and S9 does not release them (its closed list is two paths), so C-UI-5 is itself a reseal-child ticket. S9's own A.3 says the same. Part 2 still takes ZERO bytes there; the WAIT is longer than v1's row said (R1 N9) |
| **SEVENTEEN of the twenty-three ids: EW-01, EW-02, EW-03, EW-04, EW-05, EW-08, EW-09, EW-11, EW-12, EW-13a to EW-13d, EW-14, EW-15, EW-17c, EW-18** | **section 3.5's F2 package, FIRST on S10 (`E-R13`)** | **RE-SCOPED IN v4.** No `validateExerciseTags`, `projectSetupTags` or `projectNewExerciseTags` exists in product, and the FIRST READ needs the first of them on every installation (SPIKE M1 rows 1, 5, 7). v3 named four cells here; the measured answer is most of the suite |
| **The Machine settings door and EW-09** | the same | **NEW IN v4.** It needs no F2 function of its own; it is reached through E0's ONE `host.read()`, which does (3.5 consequence 3) |
| EW-14, EW-13c, EW-13d, EW-18, and the adoption compose's own cells | 3.4's SEALED LANE `edit-week-lane.cjs` plus the module TODAY-SPLIT creates | a route and a mount do not change what the gym card opens on; and under `E-R12` the compose is sealed, so its cells wait with it |
| **EW-17a, EW-17b, EW-17d, to their measured RED answer** | **NOTHING. They can RUN the day this spec is accepted** | they drive admission over a synthetic bundle and never open the editor; SPIKE M4 rows 2, 5, 6 and 7 ran them with no F2 wiring |
| **EW-17a, EW-17b, EW-17d, to GREEN** | **SPLIT OUT IN v5 (`E-R23`, R4 B4 UPHELD). EW-17d waits on 4.3 ruling 0's SEALED hunk; EW-17a and EW-17b wait on 4.3 ruling 1's re-pointing AND on 3.5, because both right-hand sides are FOLDED and the fold cannot be built without F2 (3.5's own sentence, SPIKE M5 row 4)** | v4's row said these three wait on NOTHING, which conflated "can run" with "can go green". A cell whose green depends on a sealed hunk another lane has not written cannot go green on acceptance day. The RED run is still worth having and is what SPIKE M4 bought |
| **EW-19** | **NOTHING, for the RUN and for the GREEN** | it drives the exported `watchDayRollover` with a fake `doc` (SPIKE M7). **It is the ONE id of the twenty-three that reaches GREEN on acceptance (`E-R23`)** |
| **EW-20** | **NOTHING, for the RUN and for the GREEN** | **NEW IN v5.** It drives the import screen's own exported `refusalLines` over a frozen map and needs no editor, no F2 and no seal (`spike/r5-field-vocab.mjs` measured it before it was written) |
| **EW-17c's CONTROL 1** | **NOTHING** | **NEW IN v5 (`E-R21`).** Four assertions about `lift-correspondence.cjs` and the phone's own document. It is R4's own cell and it needs no seal and no port. EW-17c's other rows wait with the rest |
| **the route and the mount (3.3 line 2a)** | **TODAY-SPLIT being accepted and landing** | until then `today-app.cjs` is sealed, and this item has no child for it. `:543` releases it, `:542` (C) says the build starts only on acceptance of the spec, and the spec is in round 2 |
| the entry point binding | C-UI-2 and S9-TODAY-CARRY finishing their `today-app.cjs` hunks | `:539` (2); three hands want that neighbourhood this week and part 2 goes last |
| the sealed half landing | the S10 child, after S9's role, S9-TODAY-CARRY and TODAY-SPLIT | `today-entry.mjs` is sealed and `:543` does not release it; the module 3.4 lands in does not exist yet |

---

## 8. THE DESIGN LANE'S LIST, AND THE ONE OWNER QUESTION

### 8.1 The finding, verified independently and re-verified in v2

The design of record `rebuild/m1/approved-2026-09-18/` contains ZERO references to Edit My Week: a
case insensitive search over the whole directory for "edit my week", "edit week" and "my week"
returns no file. The eight UI port tickets `rebuild/lanes/c/ui-port/C-UI-0.md` to `C-UI-8.md` also
return zero. C-UI-5's machine settings editor is the WORKOUT panel (its own title line: "Workout
panels: the stubs and the machine settings editor (W-01..W-04, W-30, W-31, W-33..W-41, W-44)"), not
this door. C-UI-2 is LOCKED at its line 11: "the weigh-in stays inline (ruling 5); the stack is
Start, Recovery, Talk and nothing else."

So the entry point is an OPEN SLOT that belongs to the design lane and, for where it lives, to the
owner. This spec therefore specifies behaviour, states, copy and cells, and invents no look. R1
probed this section hardest and could not break it; it is unchanged in v2 except for item 12.

### 8.2 What C-UI-9 must draw, the complete list

1. The entry affordance, wherever the owner puts it (8.3), in its normal and its "a change is already
   saved for {date}" form.
2. The editor chassis: is Edit my week a panel over the parent at the 716 thumb edge, like every
   C-UI-5 panel, or a full screen route? The answer sets the back and cancel behaviour.
3. The door chooser, two doors, with the intro `What would you like to change?`.
4. The exercise list row: name, day and set count, plus the selected state.
5. The exercise action group: `Edit exercise`, `Replace exercise`, `Remove from week`, plus
   `Add exercise` at list level.
6. The field editor for `n`, `day`, `sets`, `hi`, `inc`, `steps`, with the existing setup field error
   treatment, and the DISABLED form of whichever fields and actions the interim of 4.3 ruling 5
   withholds if 3.4 and the admission fix do not ride one child.
7. The destructive confirm for `Remove from week`, carrying `This exercise will leave your week on
   {date}. Your old sessions stay in your history.`
8. The review face: `Current` beside `After this change`, with `Starts {date}` above them, and the
   action group `Save change`, `Keep editing`, `Cancel`.
9. The saving, saved (`Saved for {date}.` and `Saved on this device.`), stale, day turned and durable
   refusal states, all with the draft visibly retained.
10. The Machine settings door, which should REUSE C-UI-5's editor rather than draw a second one; if
    the design lane decides otherwise, that is a new file and this spec's section 3 changes.
11. The narrow viewport form of all of the above, and the keyboard focus order.
12. **The E0 refusal face for the 2.2.1 boundary**, where the athlete has synced or has a plan and
    the editor will not open at all, and **the state X face for the four unsentenced codes of 2.2.2**,
    whose sentences the PM rules on at acceptance (2.2.2.1, `E-R9`, Q-F).
13. **NEW in v3.** The `PLAN_EDIT_DAY_UNCOVERED` face, which is NOT the remove confirm (R2 B6): it
    belongs to the field editor of item 6 (state E3, when `day` is edited) and to the add and
    replace forms of items 5 and 6 (states E4 and E6).
14. **NEW in v4.** Item 3's door chooser must be drawable in a form where **NEITHER door opens**,
    because E0 serves both from one `host.read()` and SPIKE M1 measures that read refusing
    outright on an installation without the F2 package and on an installation with a sync
    frontier (2.2.1). That is item 12's E0 refusal face seen from the chooser's side, and it is
    named separately because a design that draws two doors and then disables them individually is
    drawing a state that does not exist.
15. **NEW in v4.** Item 6's field editor takes its muscle vocabulary from `exercise-catalogue.mjs`
    (`GROUPS`, `GROUP_MG`, `REGIONS`, `REGION_MG`, `CATALOGUE`, `searchByName`, `regionsOf`) and
    NOT from `setup-model.mjs` (2.2's E6 row, R3 N7). If the design lane wants setup's exact
    components rather than the same vocabulary re-expressed, that is a request on TODAY-SPLIT's
    MAY-IMPORT list and it is a STOP for this lane, not a thing to import quietly.

### 8.3 THE OWNER QUESTION, in plain words

> When you want to swap an exercise or change a machine setting, where should the button live: on
> your main screen, or inside the workout?

**Recommendation: inside the workout.** The reason is the owner's own reason for narrowing the scope
at `:176`: "a beginner's first real need is 'this machine is taken, swap the exercise'". That happens
in the gym, standing at the machine, inside a session, not on the morning Today face. Putting it
inside the workout also costs nothing that is already decided: it does not touch C-UI-2's locked
line, it puts the door next to C-UI-5's machine settings editor which it reuses, and it leaves the
Today face free for a second way in later if he wants one. The cost of the other answer is a LOCKED
line reopened and a design round to reopen it.

Route: the PM takes this to the design chat as C-UI-9 first, and only to the owner if the design
chat cannot seat the editor without changing a locked line. Ledger shows no answer because it has
never been asked. **`E-R10` ACCEPTS the question as worded and accepts that route**, so this is
settled and neither the wording nor the routing is re-opened by round 3.

---

## 9. STOP CONDITIONS, RISKS, ESTIMATE

### 9.1 STOP conditions. Any one of them stops the lane and comes to the PM the same hour.

1. The editor cannot be seated without changing a C-UI LOCKED line.
2. **REWRITTEN IN v3.** S9's two path closed list is now PM-ACCEPTED (`:542` (B)), so that half of
   this STOP is DISCHARGED. What replaces it: **TODAY-SPLIT is accepted with an interface that
   differs from `:543`'s** (one sealed factory owning every lane opener, host, adoption gate and
   rebase; a released `today-app.cjs` keeping the router; a callback table taking raw values), or
   TODAY-SPLIT is not accepted at all. Section 3 is re-judged before a byte moves. `:543`'s own
   ESCAPE HATCH is live: its reviewer "may find for v1", and if it does, `today-app.cjs` stays
   sealed and 3.3 line 2a goes back onto S10.
   **WIDENED IN v4, now that TODAY-SPLIT v2 is readable (R3 N4), AND RE-STATED IN v5 (R4 N5).
   THE HEAD IS `60d6ad97`, NOT `906cb056`: the split's own independent review R2 is pushed on top
   of the fix round, it is a REJECT with eight blocking findings, and the branch has since gained
   its spike (`24b35244`). SO ALL FOUR DEPENDENCIES BELOW ARE DEPENDENCIES ON A DOCUMENT THAT IS
   ITSELF IN A FIX ROUND, and the PM should read them that way.** I re-read E.3 and E.4 at
   `24b35244` and `git diff 60d6ad97..24b35244 -- rebuild/lanes/c/TODAY-SPLIT-SPEC.md` is EMPTY,
   so nothing in section 3, in 6.8 or in this STOP is excused by the drift; what may still move is
   the WORD LIST itself, which the PM's `:550` puts in a fix round of its own (names that PUT
   against names that only read). **6.8's fourth bullet is re-run against whatever E.3 says on the
   day the fence runs, not against the copy printed here.** FOUR specific things this item depends
   on and none of which it owns, each a STOP if the split lands differently:
   (a) **RE-CUT IN v5 (`E-R17 PRIME`): the adoption gate stays ONE function (3.4.4 item 1).** v4's
   version of this row asked for the gate's own LOADED GENERATION to be reachable, and R4 B2
   measured that there is no such binding to keep; the requirement is withdrawn and replaced by the
   added export of 3.2's `local-source-basis.mjs` row, which this item owns and pays for. What is
   still a dependency is only that the gate is not split into two adoption paths.
   (b) E.3's re-export census after the split prints
   `createTodayModel` 2, `createTodayLanes` 2, `model` 2 and `options` 2 in `today-app.cjs`, and
   3.3 line 2a's route and mount must not disturb it; (c) the seal artifact records
   `edit-week-lane.cjs` as product with role `new`, or E.2 makes the fence treat it as free and
   fail it (3.4.1); (d) **E.3's closed MAY-IMPORT list covers `exercise-catalogue.mjs`, which it
   does today by name.** And ONE finding this item REPORTS to that lane rather than fixes:
   `setup-model.mjs` is FREE under E.2 and its own `:14` imports `rebuild/m4/**`, so it fails
   `FENCE-VIEW-IMPORT` on its own contents, independently of anything here (R3 N7, 3.2's row).
3. `plan-edit-host` as merged cannot satisfy EW-14 through the real host composition.
4. Any need to change a sealed byte, a package, a receipt, the ledger, the engine or the coach,
   beyond the hunks section 3.3 lines 2a, 2b, 5 and 7, 3.5 and 4.4 name under their own custody.
   **WIDENED IN v5: line 5's ONE added export in `local-source-basis.mjs` is now a named hunk
   (`E-R17 PRIME`), and it is a licence for THAT ONE EXPORT and nothing else. Any existing line of
   that file changing, or its existing export changing behaviour, is this STOP.**
   **This now includes the WRITER-FENCE: a released file that has to call a writer is a STOP
   (6.8), never a fence exemption.**
5. Any EW-17 cell comes back in a third shape that is neither of section 4's two outcomes.
6. A taste fork on the look (`:539` (2)).
7. Any temptation to widen back to four doors. Days and Priorities are v1.1 and Days additionally
   waits on F1 and on owner question Q3.
8. ANY new copy sentence at all beyond 2.2.2.1's four **and 13.6's four (`E-R34` C1 to C4, NEW IN
   v6), which are EIGHT PROPOSED sentences in total** and not built until the PM rules
   (2.3 law 4). **This round did not reach past the four it was ordered to propose: `E-R34` names
   a state the athlete can otherwise not be told about, the PM's ruling says the sentence is the
   product default recorded for the owner to overrule, and STOP 8 is what keeps it a proposal
   rather than a decision. Every one of the eight obeys 2.3's copy laws and the census of EW-16
   counts them.**
9. **NEW in v2, AND CHANGED IN v6 (`E-R34`, Astra F5; `E-R17 PRIME` (v) stands for the read count).**
   3.4's adoption read costs more than one
   extra durable reopen per adoption, or `planEditedState` cannot return the unchanged state on
   every refusal path. Either means the composing module is doing more than composing.
   **AND THE SECOND HALF OF THIS STOP IS NOW NARROWER THAN v5's, ON PURPOSE. "Returns the unchanged
   state" is still required and is no longer SUFFICIENT: this lane STOPS if an adoption that
   returns the unchanged state on a REFUSED read reaches the athlete with nothing said, or with a
   stored `Start` whose `plan_basis` or prescription capture asserts a plan-edited basis that was
   never applied.** Totality is what keeps Today painting; `E-R34`'s four clauses are what keep it
   honest, and v5 had the first without the second. **EW-14 and this STOP change together and a
   builder may not satisfy one by weakening the other.**
   **v3 TRIPPED THIS STOP AT DESIGN TIME AND DID NOT KNOW: SPIKE M3 rows 11 to 17 count FOUR
   durable loads per adoption under v3's 3.4.2 and 3.6, where there was one. AND SO DID v4, AT
   THREE, WHICH R4 B2 MEASURED AND THIS VERSION ACCEPTS IN FULL.** v4 re-cut 3.4.2, 3.4.4 and 3.6
   around a binding in the adoption gate that does not exist: the gate's load is
   `local-source-basis.mjs:78`, one frame deeper and in another file, and that function discards
   the generation. v4 then printed the number 2 in bold, which is worse than v3's silence because
   it told a builder the count had been fixed.
   **WHAT v5 DOES, under `E-R17 PRIME`, and the STOP still is not relaxed.** The PM has taken the
   ONE hunk that makes the number true: `local-source-basis.mjs` gains ONE added export returning
   the generation beside the basis (3.2's row, 3.3 line 5 amended, 3.4.4, about 12 sealed lines).
   **Measured on an instrumented repository, `spike/r5-adoption.mjs`: v4's text costs 3, this costs
   2, the floor with no editor at all is 1, and the one extra act is `lane.reopen()` inside
   `readVerified` (`plan-edit-host.mjs:148`), which row D isolates.** That is one extra reopen,
   which is what this STOP permits. **The STOP is not relaxed to fit the design; the design was
   paid for to fit the STOP, twice, and the second time the number was measured before it was
   printed.** A builder measures the count (EW-14 asserts it, on an instrumented repository, the
   way row B was measured) rather than assuming it. **If the added export cannot land, this STOP is
   live again and the PM is asked to accept a count of 3; nothing else in this spec moves.**
10. **NEW in v2, WIDENED IN v4 (`E-R13`).** Section 3.5's F2 package cannot land on S10, or lands
    at a path other than `rebuild/m4/workout/setup-tags.cjs`, **or does not land FIRST on the
    child.** v2 and v3 said "three cells and one door's two actions depend on it"; measured, the
    WHOLE DOOR depends on it and seventeen of twenty-two ids wait behind it (SPIKE M1 rows 1, 5,
    7). **If F2 cannot land, this item does not ship and there is no partial door to fall back
    on.**
11. **NEW in v2, WITH ITS TWIN ADDED IN v3 (`E-R4`, R2 B4).** (a) The admission fix's folded state
    cannot be kept out of the returned basis (4.3 ruling 3, digest at `:779`). (b) **The fold
    admits a TOMBSTONED edit, or an edit whose basis chain never proved.** Either is not
    negotiable and a fix that breaks either is not shipped.
12. **NEW in v3.** `inspect()` cannot be factored into its editability guards and its proofs
    without moving what `read()` or `preview()` refuse. That is the whole premise of 4.4's first
    row; if it fails, the fold needs a different home and section 4 is re-judged.
13. **NEW in v3, SHARPENED IN v4.** `basisState` is found wired to anything but the raw admitted or
    first run state (3.4.3), or EW-13c and EW-13d cannot be written. **SPIKE M3 row 9 measures
    that on an IMPORTED installation the wrong wiring READS OK**, so this defect does not announce
    itself on the installation the owner is on; it only announces itself on first run, and later.
    The cells are the only guard. **NEW IN v5 (R4 N3): the same code, `PLAN_EDIT_IMPORTED_BASIS_MISMATCH`,
    is ALSO raised by a race that is not this defect, when an import is admitted between the gate's
    load and the lane's reopen. 3.4.4's closing paragraph retires that one as SAFE. A builder who
    meets this code checks `basisState` first; if it is the raw value, this STOP is not what he has
    found.**
14. **NEW in v4 (`E-R14`).** A `PLAN_EDIT_*` code reaches an athlete, an issue list or a log line
    from inside admission, or a class of fold refusal appears that 4.3 ruling 2a's three field
    names do not cover. Either means the translation was not written or was written incompletely,
    and `KNOWN_REPLAY_CODES` (`source-admission.mjs:96-:98`) is a CLOSED allowlist that must not
    be widened to make it go away.
15. **NEW in v4 (SPIKE M4 FACT 1, 4.3 rulings 0 and 5).** Section 4's hunks and this item's door
    are split across two children, or ruling 0's replay family is dropped as an optimisation.
    **There is no partial ship: measured, a name only edit and a `hi` only edit each end the
    athlete's ability to import his own history.** Shipping the door without section 4 is not a
    reduced feature, it is a data defect with a UI on top of it.
16. **NEW in v4 (`E-R12`).** Anything that holds a host, a lane or a writer, or that SHAPES adopted
    state or a durable operation's projection, is found in a released file at review time:
    `planEditedState`, the tag projector, `machineFromDraft`, the assembly of an edit object, or a
    host handle on `edit-week-model.mjs`. The fence catches three of those five; the other two are
    a reviewer's job, and 6.8 names them.
17. **NEW in v4.** The sealed `edit-week-lane.cjs` exceeds 3.3 line 3's budget by more than about
    20 lines, or `today-lanes.cjs`'s share of it exceeds about 20, **or `local-source-basis.mjs`'s
    added export exceeds about 20 (v5)**. The budget is what keeps this
    item out of TODAY-SPLIT's way in the week it is first written.
18. **NEW in v5 (`E-R16 PRIME` (c), measured in 4.3 ruling 1).** The re-key at
    `source-admission.mjs:731-:734` moves a projected entry to `liftAttach(e.lift_lineage_id) ?? e.lift_lineage_id`,
    and its own comment says the admitted state carries that id "which capture_lift has already
    proved, one slot at a time, over this very id". **Under `E-R16 PRIME` (a) `capture_lift` no
    longer proves it, and MEASURED, for a lift a plan edit ADDED the admitted state carries no row
    under that id at all** (`spike/r5-idspace.mjs` section 4, on both fixtures). For every other
    slot the property still holds by construction, so the gap is exactly one case.
    **THIS IS A STOP AND NOT A SILENT ALLOWANCE: the admission hunk is not shipped until the PM
    rules Q-M and the chosen answer is measured.** The two shapes are named in 4.3 ruling 1 (c) and
    neither is built here: either `:477-:484` also appends the lifts FOLDED carries that the setup
    document does not, which is one hunk in a block this spec never opened and needs a DATE chosen
    for the fold it would take, or the re-key deliberately leaves a plan-added lift's entries under
    an id the admitted state has no row for, and that is written down as intended rather than
    discovered. EW-17c ROW 4 is the cell either way.

### 9.2 Risks

| # | risk | the guard in this spec |
|---|---|---|
| 1 | the missing design; building to the old preview numbers buys a second port | section 8; the VIEW half's model and cells carry no look |
| 2 | S9 does not release what the plan assumed; six of seven UI tickets already face this | section 3.1 and STOP 2 |
| 3 | stale line cites from the 2026-09-12 brief and from the part 1 report | every cite this round touches re-measured at `00e7a0d0`; `:522` named in 4.4; R1 N1 and R2 N1, N3.3, N3.4 and N3.6 all applied and listed in 11.7 |
| 4 | the four door trap | section 1.1 restates the narrowing in its own words |
| 5 | the provenance defect fixed in the wrong file, or in one check of three, or not at all | section 4.1.1, 4.3 ruling 2, and three red cells first |
| 6 | lane collision on `today-app.cjs`, live right now, and it is about to be rewritten by TODAY-SPLIT on top of that | section 3.3 line 3: under 130 added sealed lines and zero removed in v4 (v3 said under 70), **of which all but about ten are in a NEW file that collides with nobody** (3.4.1 reason 1); part 2 goes last, and 3.3 line 6 gives the order on the child |
| 7 | `browser-check.mjs` treated as evidence while it is stale red with no CI home | section 2.3 law 3, now a STANDING rule rather than a wait |
| 8 | the estimate read as elapsed time | 9.3 |
| 9 | **NEW in v2.** the screens ship and the edit reaches nothing, because the route and the mount looked like the whole wiring half | section 3.4, and EW-14 blocked on its hunk rather than quietly passing on a redraw. `:543` makes this worse, not better: the route is now the CHEAP half and a builder could ship it alone |
| 10 | **NEW in v2.** a second spelling of the tag taxonomy, or of edit semantics, written page-side or admission-side because the real one was unmerged or awkward to reach | 3.5 consequence 2, 4.3 ruling 2, and `plan-edit-model.cjs:61-63` quoted in both |
| 11 | **NEW in v3.** a spec written against a split that has not landed. Section 3 depends on `:543`'s interface, and `:543`'s own escape hatch lets its reviewer find for v1 | STOP 2 rewritten, 3.0's TIMING paragraph, and 7.2's new row. The RELEASED work of 7.1 is identical under both outcomes, which is why the estimate's first rows do not move |
| 12 | **NEW in v3.** the fold is built over `apply()` because it is the obvious function, and a retracted edit quietly widens admission | 4.3 ruling 2's two measured bullets, STOP 11 (b), and a cell that retracts an edit and shows the pre-edit count refusing. **SPIKE M5 row 12 now measures the exclusion holding, so this risk is closed by evidence rather than by a rule** |
| 13 | **NEW in v4.** A cell is written to a REVIEW's wording rather than to a spike row, and is red or green on arrival for a reason the builder cannot find. Three of v3's cells had this defect (EW-13c, EW-13d, and R3 B4's proposed day turned cell) | section 0 carries the rows; 12.2 names the three contradictions; every cell in section 5 that asserts a code names its spike row, and 12.4 lists what is UNMEASURED |
| 14 | **NEW in v4.** The door is shipped without section 4 because the door is the visible half and the admission hunks are not, and an athlete who ever uses it silently loses the ability to import his own history | SPIKE M4 FACT 1, 4.3 ruling 5 (the interim is dead), STOP 15, and Q-B. **This is the largest risk in the document and it is the one a schedule squeeze will reach for first** |
| 15 | **NEW in v4.** The seal inversion returns by a different door: a future hand puts a "pure" rule back in a released file because it calls no writer and the fence stays green | `E-R12` and PM NOTE b are quoted at 2.1's head as a RULE and not as a decision about two files; STOP 16 names the five shapes; 6.8 says the fence catches three of the five and a reviewer owns the other two |

### 9.3 Estimate, in hours, and no elapsed time promise

**RESTATED IN v3 FOR THE BUILD UNDER `E-R1` TO `E-R4` (`E-R11`).** The `can start` column is the
answer to "what can start the day this spec is accepted", and it is the reason the total moving
does not move the START date.

**RE-ANSWERED IN v4 (`E-R13` asks for an honest restatement of what can start).** The fourth column
is where this round changes most, and it changes in two opposite directions: LESS can go GREEN on
acceptance (F2 gates the door), and MORE is worth starting RED, because SPIKE M4 has already told
the builder what four of the cells will say.

| work | hours | v3 | can start the day this spec is accepted? |
|---|---|---|---|
| RELEASED half: `edit-week-model.mjs`, `edit-week-view.mjs`, `edit-week-check.mjs`, the `t-edit-week` block | 6 to 8 | 7 to 9 | **YES**, and slightly cheaper than v3 because the model no longer holds the five host methods (`E-R12`) |
| ~~RELEASED: `edit-week-basis.mjs` and `edit-week-tags.mjs`~~ | **0** | 2 to 3 | **GONE.** Both moved into the sealed lane; their work is in the sealed row |
| the suite: TWENTY cells under TWENTY-THREE ids, including the rewritten EW-13c and EW-13d, the four EW-17 with their controls (EW-17c is now four rows and three controls, `E-R16 PRIME` and `E-R21`), EW-18, EW-19 and the new EW-20 | 13 to 16 | 10 to 13 | **YES, written RED.** EW-17d, EW-17a and EW-17b RUN to their measured red answer at once; EW-19, EW-20 and EW-17c's CONTROL 1 reach GREEN; the rest are red until F2 and section 4's hunks |
| SEALED half: `edit-week-lane.cjs` entire (`openEditWeekHost` and its ten arguments, the first run tag projection, `onWeek`, `weekFacade`, the adoption compose, `newIntentId`), `createEditWeekEntry`, `today-lanes.cjs`'s ten lines, **and `local-source-basis.mjs`'s ONE added export with its own cells (`E-R17 PRIME`, NEW IN v5)**, with their proof | 9 to 12 | 4 to 6 | NO: waits on F2, TODAY-SPLIT and S10 |
| RELEASED route and mount inside `today-app.cjs` (about six lines) | 0.5 to 1 | 0.5 to 1 | NO: waits on TODAY-SPLIT landing |
| one independent review round plus the fix round | 5 to 6 | 5 to 6 | follows the work |
| D2's separate implementation review (`:176` (2)), a SECOND obligation (`E-R8`) | 2 to 3 | 2 to 3 | follows the work |
| **EW2-BUILD total** | **35.5 to 46 hours of model time** | 30.5 to 41 | **about 19 to 24 of it can START on acceptance, and only about 1 to 1.5 of that can go GREEN (`E-R23`)** |

**What moved and why, so the PM is not asked to take a number on trust.** The sealed row roughly
doubled, which is `E-R12` paid in hours rather than in prose: `onWeek`, `weekFacade`, the tag
projector wiring and the adoption compose all moved there, and 3.3 line 3 prices them line by
line. The two released files that vanished did not vanish as WORK; they changed address. The suite
row grew for EW-18 and EW-19 and for the rewritten EW-13c and EW-13d controls.

**AND THE FOURTH COLUMN IS ANSWERED HONESTLY, AND IT TOOK THREE ATTEMPTS.** v3 said "about 19 to 25
of it can start on acceptance" and R3 was right that the number assumed green was reachable. v4
said "only the four cells that need no editor (EW-17d, EW-17a, EW-17b, EW-19) can reach GREEN", and
**R4 B4 is UPHELD: three of those four cannot.** `E-R23` rules the column, and this is the honest
version.

| id | can it RUN on acceptance? | can it reach GREEN on acceptance? | why, and every row carries a spike row or the UNMEASURED mark |
|---|---|---|---|
| **EW-19** | yes | **YES, and it is the ONLY one** | it drives the exported `watchDayRollover` with a fake `doc` and needs nothing (SPIKE M7 rows 1 to 5) |
| **EW-20** | yes | **YES** | **NEW IN v5.** It drives the import screen's exported `refusalLines` over a frozen map (`spike/r5-field-vocab.mjs`) |
| **EW-17c's CONTROL 1** | yes | **YES** | **NEW IN v5.** Four assertions about `lift-correspondence.cjs` and the phone's document (`spike/r4b-capture-lift.mjs`, `spike/r5-idspace.mjs` section 6) |
| **EW-17d** | yes, to RED | **NO** | its green needs 4.3 ruling 0's SEALED replay family, which is the admission lane's and is on nobody's desk on acceptance day. Its RED is measured: SPIKE M4 row 2 |
| **EW-17a** | yes, to RED | **NO** | its green needs 4.3 ruling 1's re-pointing AND 3.5: its right-hand side is FOLDED, and SPIKE M5 row 4 measures the fold refusing `PLAN_EDIT_TAGS_INVALID` with `validateTags` withheld. Its RED is measured: SPIKE M4 row 5 |
| **EW-17b** | yes, to RED | **NO** | the same, both halves. Its RED is measured: SPIKE M4 rows 6 and 7 |
| **EW-17c**, its other three rows | no | **NO** | it needs 3.5 for the fold and 4.3 ruling 1 for the re-pointing, and its `sealed(0)` row additionally needs the real port, which is why 12.4 lists it |
| **the other sixteen ids** | written RED | **NO** | the companion refuses its FIRST READ without F2 on every installation (SPIKE M1 rows 1, 5, 7) |

**So: about 19 to 24 hours of work can START, and about 1 to 1.5 hours of it can reach GREEN.**
Everything else in the released half is written against frozen objects and proved by its own cells;
those cells are green, but they are the RELEASED half's own cells and not the twenty-three ids of
section 5. **The start date does not move. The number of hours does not move. What a reader may
conclude from a green run on day one does, and that was the whole of `E-R13` and now of `E-R23`.**

Not counted above, because they are shared or not this lane's:

- **section 4.4's admission work, TWO sealed files and THREE hunks, 10 to 14 hours plus its own
  review round** (v1: 2 to 3; v2: 4 to 6; v3: 7 to 10). 4.4 prices the four parts;
- section 3.5's F2 package landing at `rebuild/m4/workout/setup-tags.cjs`, another lane's, **which
  `:548` says the PM dispatches from the spike's M6 as its own lane**, with its own review, which
  it has never had for the CODE (3.5 consequence 6). **No PE-f2-identity re-point: v2 asked for
  one and it is not needed (R2 N3.5);**
- section 3.3 line 7's `.github` registration, the PM's;
- **TODAY-SPLIT itself, which is neither this lane's nor this estimate's.** `:543` reports v1's own
  figure as 29 to 42 hours plus 8 to 12 of review for the opposite cut, and says the reversed move
  is "about a third the size". This item does not re-estimate another lane's ticket;
- the S10 chain, which S8 measured at about 2.5 hours of preparation plus about 35 minutes for chain
  A and about 1 hour for chain B, shared across the items on it.

The brief's own "about two builder days after dependencies" was written for BOTH parts, before three
seals, a real import, a full UI port and a narrowing. Part 1 alone merged as 20 files and +3168 lines.
Treat two builder days as the floor for part 2, not the ceiling.

### 9.4 Open questions for the PM, each with a recommendation

**SEVEN OF THE NINE ARE NOW ANSWERED, and v3 records the answers rather than re-asking them.**

| # | question | status after `E-R1` to `E-R11` |
|---|---|---|
| Q-A | v2 asked whether to wait for S9's OWNER-1 on splitting `today-app.cjs`. | **CLOSED, and its framing was wrong.** `:542` (C) rules TODAY-SPLIT as "the PM's decision and not an owner question", and `:543` rules its DIRECTION. Q-A's recommendation survives (do not wait to start); its framing does not, and 3.0 replaces it. R2 N3.8.1 caught this and is upheld. |
| Q-B | Does the PM accept 4.3's ruling, and do the hunks ride S10 together? | **ANSWERED: `E-R7` accepts the ruling IN ITS CORRECTED FORM (`E-R3` no disjunct, `E-R4` the inspect/result fold), and the admission hunk, the adoption hunk, the F2 package and the wiring ride S10 TOGETHER.** |
| Q-C | Does EW2-BUILD start before C-UI-9 exists? | **ANSWERED YES by `E-R8`:** on the VIEW half, as soon as this spec is accepted. 9.3's fourth column says how much that is. |
| Q-D | Does `:176` (2)'s "after N2" still bind? | **ANSWERED by `E-R8`: the clause is DROPPED, that queue no longer exists.** Lane C builds; D2 reviews the implementation as a SECOND obligation on top of the screens tier's own blind reviewer. 1.2 carries it. |
| Q-E | `design.cjs` and `today-model.cjs` are named as release candidates at `:536` but are NOT in the S8 `product` map at all (re-verified by my own 3.2 query). | **ANSWERED AND CLOSED by `E-R20`, said once by the PM at `:548`: `DECISIONS:536`'s candidate list is NOT a pin list, and FIVE of its eight names were never sealed (`:542` (A)).** So the absence of `design.cjs` and `today-model.cjs` from the S8 `product` map is not a discrepancy to chase: it is what `:542` (A) already measured. This spec records the answer and does not re-ask it. |
| Q-F | Four refusal codes reach the athlete with no true sentence: `PLAN_EDIT_WEEK_EMPTY`, `PLAN_EDIT_BASIS_SOURCE_CHANGED`, `PLAN_EDIT_BASIS_HASH_INVALID`, `PLAN_EDIT_BASIS_HASH_UNAVAILABLE`. | **ANSWERED IN PART: `E-R9` asks this spec to PROPOSE one sentence for each, and 2.2.2.1 does, marked PROPOSED FOR THE PM.** The PM rules at acceptance. Until then the interim is state X's existing actionable refusal treatment. **This spec proposes no other copy.** |
| Q-G | Who lands the F2 package, and on which child? | **ANSWERED: `E-R6` ACCEPTS the proposal as written.** `rebuild/m4/workout/setup-tags.cjs` lands on S10 by lane D with its own review; EW-04, EW-15 and EW-17c wait on it and say so, and 3.5 adds that 3.4's adoption read and 4.3's fold wait on it too. |
| **Q-H** | **NEW in v3.** 4.3 ruling 2 needs `inspect()` factored into its editability guards and its proofs so one spelling serves both the editor and admission. That is a hunk in a SEALED file whose twenty merged cells must stay green, and it is the premise of 4.4's price. Does the PM want it in `plan-edit-model.cjs`, or does he want admission to construct the projector and accept the guards as they are? | **In `plan-edit-model.cjs`, as `E-R4` rules.** Accepting the guards as they are does not work: 4.3 ruling 2 measures four of them refusing in admission's own context. STOP 12 covers the case where the factoring turns out to move a refusal. |
| **Q-I** | **NEW in v3.** `newIntentId` is a THIRD host argument with no product provider (2.1), and this spec names a one line minter over the installation's own `crypto.randomUUID()`. It is trivial next to the tag pair, but it IS a new provider in a sealed file. | **Accept the one liner.** The alternative is a second id scheme, and `plan-edit-host.mjs:171-:172` already guards a collision. Flagged only because v2 said TWO arguments were missing and a builder counting on that number would be one short. |
| **Q-J** | **NEW in v4 (`E-R14`).** 4.3 ruling 2a proposes THREE new `field` names for what admission reports when the fold refuses: `plan_edit_history`, `plan_edit_basis`, `plan_edit_context`. | **ANSWERED AND CLOSED by `E-R24`: THE PM SEATS THE THREE.** They are the vocabulary, and this spec records the answer rather than re-asking it. **R4 N4 is carried and is now MEASURED rather than marked (`spike/r5-field-vocab.mjs`, EW-20):** the import screen's `REFUSAL_FIELD_SENTENCE` is a CLOSED map of five keys (`capture_sets`, `setup_document`, `athlete_label`, `capture_lift`, `exercise_n`), the three new names are not among them, and what the screen draws for one is `REFUSAL_SENTENCE['LOCAL_SOURCE_PROGRAMME_UNRESOLVED']`, the same sentence every other programme refusal draws, with the field name printed verbatim on the code line above it. **One honest consequence, recorded and NOT fixed here:** that sentence is "This file was written by a different training week than the one you set up on this phone", which is true enough of `plan_edit_history` and is not true of `plan_edit_basis` or `plan_edit_context`, both of which are build defects. **This spec proposes NO new sentence for them (law 4, STOP 8);** the PM may later rule one, and 12.4 lists the gap. |
| **Q-K** | **NEW in v4 (`E-R13`).** The Machine settings door is blocked on F2 only because 2.2's E0 serves BOTH doors from one `host.read()`. Reaching it without that read would unblock EW-09 alone. | **ANSWERED AND CLOSED by `E-R24`: NO. THE ESCAPE STAYS SHUT.** This spec's recommendation was not to open it and the PM has ruled the same. It makes the door chooser draw a state that is not true (one door open, one shut, from a read that refused) and it buys one cell out of seventeen. 3.5 consequence 3 records it as named, not taken, and now closed. |
| **Q-L** | **NEW in v4.** SPIKE M4 FACT 1 found a defect nobody had named: a saved plan edit refuses the whole import by itself, before any capture. 4.3 ruling 0 rules a replay family for it, priced at 2 to 3 hours in 4.4. | **ANSWERED by `E-R24`: YES, WITH A LIMIT, and both halves matter.** The plan-class replay family is the **FIRST of the four admission hunks inside S10** and it has its own cell, EW-17d. **It does NOT get a reseal child of its own.** The reason the PM gives is a fact rather than a preference: **no phone can hold a plan op before this item ships, so nothing is broken in the field today**, and the urgency is about what breaks the day the door opens, not about what is breaking now. STOP 15 is unchanged: the four hunks still ride S10 together (Q-B), and ruling 0 being first on that child is an ORDER, not a separate ship. |
| **Q-M** | **NEW in v5, and it is the one row this round could not close by measurement alone (`E-R16 PRIME` (c), STOP 18).** Under the re-taken `capture_lift` ruling, a capture naming a lift a PLAN EDIT ADDED is admitted by the membership test, its `:613` target is its own document id, and **measured, the ADMITTED state carries no row under that id** (`spike/r5-idspace.mjs` section 4). The re-key at `:731-:734` would then move that entry to an address the admitted state does not hold. Which way does the PM want it? | **The recommendation is (a): extend `:477-:484` to append the lifts FOLDED carries that the setup document does not, under their own ids, exactly as it already appends an uncorresponded setup lift.** It is one hunk in a block this spec never opened, it keeps `:613` and the re-key byte-unchanged, and it makes the re-key's own stated property true again. **What this spec does NOT do is choose the DATE that fold would be taken at**, because `:477-:484` runs ONCE per import with `currentDay()` while FOLDED is per capture date, and `E-R16 PRIME` forbids inventing a third comparison. The alternative (b) is to write down, as intended, that a plan-added lift's projected entries stay under the document's id with no admitted row, and to price what reads them. **Either way EW-17c ROW 4 asserts the answer by name, and STOP 18 stops the admission hunk until this is ruled.** |

### 9.5 What this spec did NOT do

**THIS PARAGRAPH IS DIFFERENT IN v4, BECAUSE THE METHOD CHANGED (`:548`).** v1, v2 and v3 could
each say "it ran no test". **v4 cannot and does not: the spike of section 0 RAN CODE, on both
machines, and that is the point of the round.** What is true, stated precisely:

- **What ran:** throwaway cells in a farm SCRATCH worktree (`farm-scratch.sh ew2-spike` at
  `e0e2ac75`) and, for M4 alone, one removed scratch worktree on the owner's PC whose branch was
  deleted afterwards. **Nothing was committed from either, nothing was pushed, no node_modules was
  touched, nothing was installed, and no browser was launched.** The PC worktree's three
  `node_modules` junctions were detached with plain `rmdir` before its tree was deleted, and
  `prepledger-dev\node_modules` was verified intact.
- **What did NOT run:** `b-package.cjs` in any form, the protected soak, any browser cell, any bar
  suite on either machine.
- **What was NOT read, unchanged from v3:** `rebuild/conform/private`, any `ledger/` directory,
  `src/history.js`, the protected soak, `C:\Users\joeym\EarnedPort`, or any of the owner's
  measurements, on either machine. **Every fixture in the spike is synthetic**: a generated
  enrolled athlete, a generated setup document, a generated history file, and for M4 the public
  `rebuild/lanes/d/p3-real-shape/legacy-fixture.cjs`.
- **What the spike DID obtain that v3 could not:** `f3e9561`, by checking the branch out in a farm
  scratch worktree. v3 wrote "`f3e9561` was not fetched" and that is no longer true; it is an
  include-list path in the farm's own mirror and no rule was worked around to read it.
- The seal artifact was queried by a script that printed counts and per-path YES/NO only; its
  contents were never printed. No credential appears in this file.
- **Heads.** The reading and the spike for v4 were done in the PM's cloud farm mirror at
  **`ad8ced07`**, with `rebuild/d2-ew2-spec` at `99cfa911` and `rebuild/c-today-split` at
  `906cb056` synced beside it, and `rebuild/b-s9-ui-pins` read at `d859096a`. The writing, the
  commit and the push were done on the owner's PC.
- **HEADS FOR v5, and R4 N5's correction applied (`E-R24` / N5).** This round's cells were written
  and run in a farm scratch worktree at product head **`70113da5`**, which is the head review R4
  measured at, over `rebuild/d2-ew2-spec` at **`84e09193`** (R4 itself). **`rebuild/c-today-split`
  is read at `60d6ad97`, NOT `906cb056`: that is its own independent review R2, a REJECT with
  eight blocking findings, so SECTION 3, 6.8 AND STOP 2 ALL DEPEND ON A DOCUMENT THAT IS IN A FIX
  ROUND, and they say so.** Its spike has since landed at `24b35244`, and
  `git diff 60d6ad97..24b35244 -- rebuild/lanes/c/TODAY-SPLIT-SPEC.md` is EMPTY, so E.3 and E.4 are
  the same text at both, which is what 6.8's census was run against. **The PM's `:550` puts that
  word list itself in a fix round, so 6.8's fourth bullet is a CENSUS to re-run and not a table to
  copy.** The writing, the commit and the push for v5 were done on the owner's PC.
- **WHAT RAN IN v5, and the cells are committed rather than described.** Six throwaway cells in a
  farm scratch worktree, all under three seconds each, all synthetic, none sealing anything and
  none needing the port: they are `rebuild/lanes/d2/spike/`, with a README giving the sha256 of
  each against its farm original and the directory each must be copied to in order to run. **The
  seventh file there is review R4's own cell, unaltered, because this round builds on it rather
  than replacing it.** Nothing was installed, no browser was launched, no `b-package.cjs` ran, no
  seal was attempted, and nothing was pushed from any scratch worktree.
- **No product, test, tooling or workflow byte moves on this branch.** This file, its reviews and
  v5's `spike/` folder are the only things on it, and nothing in `spike/` is imported by any
  product file, registered in CI or run by the bar. Zero U+2013 and zero U+2014 in this file and in
  every file of `spike/`, counted rather than claimed, and no sentence proposed by it carries a
  dash of any kind.

---

## 10. R1 FINDINGS: FIXED OR DISPUTED

**This section is v2's record, kept WORD FOR WORD. R2 re-derived every row of it and confirmed all
sixteen (its section 2, and its N2 row upholds the dispute in the author's favour), so round 3 does
not re-litigate it and does not re-measure it. The one row R2 left half open, N5, is closed by
11.1.** Its measurements were taken at `724ef3fc`; where a number in it has since been corrected,
section 11.7 says so and 11.7's number is the live one.

Review under answer: `rebuild/lanes/d2/EW2-SPEC-REVIEW-R1.md` at `0695493`, VERDICT REJECT, six
BLOCKING and ten notes. **Fifteen FIXED, one FIXED IN SUBSTANCE WITH ITS STATED METHOD DISPUTED.**

I re-derived every finding from the tree at `724ef3fc` rather than accepting the review's account of
it, and I could not break any of the six blocking ones. R1 is a good review: four of its six findings
are holes the author could not see from inside the document, and B3 in particular turned out to be
LARGER than R1 said, not smaller (10.1, B3).

### 10.1 The six BLOCKING

| # | verdict | what changed, and what I verified before changing it |
|---|---|---|
| B1 provenance ruling covers one of three checks | **FIXED** | Verified all four checks in the one `resolveCapturedLayout` callback at the tip: `capture_producer` `:598` (safe), `capture_lift` `:614` (reads the ADMITTED `state` through `liftAttach`), `capture_sets` `:665` (reads `documentSets`), `capture_membership` `:695-:699` (compares pool and order against `sessionMembership(documentProgramme.state, originalDay)`). New section **4.1.1** rules on all four by name in a table. **4.3 ruling 1** extends all three broken ones through one fold. EW-17 became **EW-17a, EW-17b and EW-17c** (4.2), each asserting its own field by name, each with its own control, and 4.2 names the ordering trap that `capture_lift` runs first. The suite is sixteen cells. ADDED beyond R1: the three breaks are CONTINGENT on 3.4 shipping, because before 3.4 the gym card never prescribes an edited shape, so 4.1.1 states that dependency and 9.4 Q-B keeps them on one child. |
| B2 EW-14 cannot be met by the wiring half described | **FIXED** | Verified the whole chain: `today-app.cjs:2482` `athleteBasisState`, `:2490` `adoptAthleteState`, `today-model.cjs:412` `adoptBasis` (assigns `basis`), `:219` `stateFromOps` (`clone(basis)`), `gym-model.mjs:104` (`hostForDay` rereads at call time). Also verified that NOTHING in product consumes the operation: `grep -rn 'exercise-edit'` returns the field constant at `plan-edit-commands.cjs:4` and two lane D cells. New section **3.4** names the chain, prints the three options, **chooses (b)**, gives the exact four-line `.then`, names the new module `edit-week-basis.mjs` and its one function, forbids it from re-deriving anything, and states its cost. `local-source-basis.mjs` is now a row in the 3.2 table (in `product`, SEALED by name at `:536` (2)) with "NOT TOUCHED" as its half. 3.3 line 3 re-priced 40 to 55 added lines; 9.3 re-priced; EW-14 is marked blocked on that hunk in the section 5 table. |
| B3 EW-04 and EW-15 have no tag provider | **FIXED, and the finding was larger than stated** | Verified both dependencies: `plan-edit-commands.cjs:66` (`validateTags`, unconditional for `add` and `replace`) and `plan-edit-model.cjs:349` (`projectNewExerciseTags`, SAVE path only, `:357` takes the review path, which is a worse discovery order and is now written down). Verified the single implementation `f2-tag-adapter.cjs:64/:195` and its `product` pin. **NEW EVIDENCE R1 did not have:** `model.test.cjs:511-:515` proves that lane file sha256-equal to `rebuild/m4/workout/setup-tags.cjs` at `f3e9561`, `durable-host.test.mjs:24-:32` says so in words, and `PLAN-EDIT-V2-AUTHOR-REPORT.md:8` names lane D's separate UNMERGED F2 package as the reason it is not on the tip. So the ruling is neither of R1's two options: **land the existing package at its intended product path** (3.5), because a new page-side provider would be a second spelling of the taxonomy. 3.5 also adds EW-17c to the blocked list, which R1 did not have because EW-17 was one cell. 7.1 says what cannot start. |
| B4 the fix priced at one line with no derivation | **FIXED** | Verified that the callback is handed `ops` at `:438` and nothing else, that `plan-edit-model.cjs` exports only `createPlanEditProjector`, `importPresentIn`, `planEditCollections` and `P2_ROW` (`:397-:398`), so no folding function exists to call, and that `apply()` is at `:319` with `exOrder` maintained at `:315`. Verified the out-parameter comments verbatim at `:222-:228` and `:229-:237`, including "that object is the programme digest's input at `:325`". **4.3 ruling 2** names the exported function `foldPlanEdits(documentState, ops, onLocalDate)` and quotes `plan-edit-model.cjs:61-63` as the reason it must not be re-spelled in admission. **4.3 ruling 3** makes digest invariance a constraint the fix must satisfy and the first thing its reviewer checks. **4.4** re-prices at two sealed files, 4 to 6 hours plus review, and STOP 11 refuses a fix that breaks the constraint. |
| B5 state D invents a sentence already in the code | **FIXED** | Verified `plan-edit-host.mjs:23-:24` and the comment at `:20-:22` ("the honest sentence travels with the code rather than being reconstructed"). State D now carries `The day changed while this was open. Review the latest week before saving.` verbatim, marked **SOURCED FROM CODE**. Law 4 now reads **ZERO new sentences**, and 2.2.2 lists the four codes that have none rather than inventing any. STOP 8 was widened to any new sentence at all. |
| B6 reachability asserted as fact | **FIXED** | Verified `grep -rn 'createPlanEditHost' rebuild`: the export at `plan-edit-host.mjs:42`, two Astra annexes, four lane D cells, nothing else. Verified `today-entry.mjs`'s exports one by one (`:42`, `:49`, `:93`, `:150`, `:226`, `:471`, `:505`, `:533`): nothing plan-edit shaped. Verified `:510`'s "reachability open" and that `:532` says nothing about it. The authority line and new section **4.0** now state the measured position: unreachable today, reachable the day the wiring half ships. **The schedule did not move**, exactly as R1 asked. |

### 10.2 The ten NOTES

| # | verdict | what changed |
|---|---|---|
| N1 cite drift in two tables | **FIXED** | Re-counted at the tip: `read` `:162`, `review` `:163`, `cancel` `:252`, `close` `:253`; `editOf` `:69`, `update` `:71-:74`, `remove` `:75`, `add` and `replace` `:76-:79`. R1's diagnosis was right: v1 read the returned handle, not the definitions. 2.1 says so in words so the next hand does not repeat it. |
| N2 the seal query counts the wrong set | **FIXED IN SUBSTANCE; THE STATED METHOD IS DISPUTED.** See 10.3 |
| N3 the second pinned `build.mjs` | **FIXED** | Both verified in `product`. `rebuild/m3/w7-preview/build.mjs` is now a row in 3.2 saying which one this item touches (`today/build.mjs`, for a preview bundle input) and why the other is named at all. |
| N4 the CI registration belongs to no half | **FIXED** | `.github/workflows/rebuild.yml` verified in `product`. It is now a row in 3.2 and **3.3 line 7**: it rides S10, authored by the PM, and 6.7's "no diff outside" is explicitly scoped to the LANE's diff so the clause no longer forbids the child's own hunks. |
| N5 two in-scope refusals have no sentence | **FIXED** | `BRIEF-EDIT-MY-WEEK.md:61` verified: `Choose a training day for each exercise before saving.` is now in E5, marked SOURCED, against `PLAN_EDIT_DAY_UNCOVERED`. `PLAN_EDIT_WEEK_EMPTY` (`plan-edit-model.cjs:341`) has no sentence anywhere and v2 does NOT invent one: 2.2.2 rules it to state X, offers the affordance that avoids it, and files it as Q-F. |
| N6 state T merges six codes under one sentence | **FIXED** | Verified each: `BASIS_SOURCE_CHANGED` `plan-edit-host.mjs:77` (the basis SOURCE changed, the week did not), `BASIS_HASH_UNAVAILABLE` `plan-edit-model.cjs:101`, `BASIS_HASH_INVALID` `:104` (construction and integrity facts), `BASIS_INVALIDATED` `:300` and `:309` (a causal parent stopped being active, or the seen basis disagrees, which IS a week that changed). State T now draws **three** codes with the brief's sentence; the other three go to state X and into 2.2.2. |
| N7 the pre-sync boundary is never stated | **FIXED** | Verified `plan-edit-model.cjs:226`, `:227`, `:235`, `:237-:238`, `:242-:243`. New section **2.2.1** states the rule in words ("v1 is a PRE-SYNC, LOCAL-ONLY editor"), and EW-01 now asserts it in both directions. |
| N8 `MACHINE_SETTINGS_INPUT_INVALID` is a throw | **FIXED** | Verified `rebuild/coach/machine-settings-commands.cjs:39`, `const bad = () => { throw new TypeError(...) }`. M2's row now says the screen CATCHES it. |
| N9 the Machine settings door waits longer | **FIXED** | Verified `C-UI-5.md:8-9`'s MAY CHANGE list and that two of its three files are in `product` while S9's closed list is two other paths. 7.2's row now says the door waits on C-UI-5 AND on whichever child carries C-UI-5's own sealed files. Part 2 still takes zero bytes there. |
| N10 two reductions earned but not claimed | **FIXED** | Verified `today-bindings.mjs:723` `liveDay()` and `setup-host.mjs:45` `setupsIn(generation, profile)` plus its default export at `:131`; verified `rebuild/m3/w7-preview/today/setup-host.mjs` is in NEITHER `product` NOR `executionPins`. New section **3.6** claims both, with the correct full path (R1 gave the file name without its directory, and there is no `setup-host.mjs` under `rebuild/m3/w6/host/`). |

### 10.3 The one DISPUTE, with its measurement

**N2's recommendation is adopted in full. Its stated diagnosis of v1's method is wrong, and I can
show it.** R1 says v1's "229" was "every `rebuild/`-shaped string ANYWHERE in the artifact", and that
the real union of the pin sets is 227.

Measured at `724ef3fc`, by script, without printing the artifact:

```
product 224 | executionPins 71 | protectedSurfaces 2
union(product, executionPins)                    = 227
union(product, executionPins, protectedSurfaces) = 229
distinct rebuild/-shaped strings ANYWHERE        = 242
```

So v1's 229 is exactly the union of the THREE pin key sets, which is a defensible set to build and
not a careless regex sweep; and R1's own 227 is the union of two of the three, having dropped
`protectedSurfaces`, whose two members ARE `rebuild/`-shaped. Neither number is the 242 R1 attributes
to v1.

**Why I adopt the recommendation anyway, and it is the part that matters:** R1 is right that a single
merged set is the wrong thing to report, because `product` is the pin list a reseal child exists to
move while `executionPins` are test and spec pins with different consequences, and a future hand
reading "229" cannot tell which column answered its question. Section 3.2 now names all three sets
with their counts and answers every row against `product` alone. I also re-ran every row of the 3.2
table against `product`: R1's own re-run was correct, **every YES and NO in v1's table was right**,
and the four rows v2 adds were queried the same way.

R1's other credits stand unchanged and are not re-litigated here: sections 8.1, 3.1 and the SOURCED
half of the copy table were probed hard and held, and its ten "could not break" items are recorded in
the review file for whoever runs R2.

### 10.4 What v2 did not change

Sections 1, 5.1, 5.2, 6 (except clause 1's count, clause 3's CI custody and clause 7's scoping), 8.1,
8.3 and 9.1 items 1 to 8 are v1's, because R1 could not break them and neither could I. The
recommendation to the owner in 8.3, the choice of S10 as the child, and the refusal to invent a look
are unchanged.

---

## 11. R2 FINDINGS: FIXED OR DISPUTED

Review under answer: `rebuild/lanes/d2/EW2-SPEC-REVIEW-R2.md` at `1a73d8f`, VERDICT REJECT at
`63710d2`, six BLOCKING and nine notes. **All fifteen are FIXED. NOTHING IS DISPUTED.**

I re-derived every finding from the tree at `00e7a0d0` rather than accepting the review's account of
it, and I could not break one of them. R2 is the better of the two reviews: B1 and B2 are two ends
of the same new section and both would have reached a builder, B3 caught a widening the author had
argued himself into, B4 caught a fold that would have re-opened admission through the back door,
and B5 and B6 are the fix round's own new prose being wrong about where code refuses. Its section 5,
the ten things it tried to break and could not, is taken as read and round 3 spent no time there.

**The order below is R2's own, from its section 6: B6, B5, B3, B4, B2, B1.**

### 11.1 B6, the sentence filed under the state that cannot raise it. FIXED

Verified `covered()` by hand: it is DECLARED at `plan-edit-model.cjs:323-:327` (its refusal
`PLAN_EDIT_DAY_UNCOVERED` at `:326`) and CALLED at exactly two places, `:330` inside the `update`
branch and `:345` inside the add and replace branch. The `remove` branch is `:339-:343` and calls it
nowhere. R2 is right on every line.

Also verified R2's two riders: `PLAN_EDIT_NO_CHANGE` is `:329`, inside `update` only; and
`PLAN_EDIT_WEEK_EMPTY` at `:341` really is E5's own.

FIXED: 2.2's E5 row no longer lists `PLAN_EDIT_DAY_UNCOVERED` or `PLAN_EDIT_NO_CHANGE` and no longer
carries the sentence; E3, E4 and E6 carry both the code and the SOURCED sentence from
`BRIEF-EDIT-MY-WEEK.md:61`; the rows no longer say "the E3 set" at all, because that phrase is what
let a code travel to a state that cannot raise it, and 2.2 now names a COMMON set once and lists
every other code per branch with its line. EW-05's row in section 5 asserts `PLAN_EDIT_WEEK_EMPTY`
only, and the day coverage assertion moves to EW-02 and EW-04. 8.2 gains item 13 so the design lane
draws the face in the right place.

**ONE MORE OF THE SAME FAMILY, found by re-reading the rows B6 made me re-read and reported here
rather than waiting for R3 to find it:** `PLAN_EDIT_TAG_BASIS_UNPROVEN` was in E4's and E6's lists.
It fires at `plan-edit-model.cjs:217` and `:219`, inside `createPlanEditProjector`'s own body, which
`projectorFor` (`plan-edit-host.mjs:68`) runs on the FIRST read. No review path can raise it. It is
now E0's.

### 11.2 B5, where the tag refusal fires. FIXED

Verified the whole order at `00e7a0d0`. `preview()` is `plan-edit-model.cjs:384`. Its FIRST
statement, `:385`, is `C.validateInput(value, { validateTags })`, which reaches `editOf`
(`plan-edit-commands.cjs:69`), which for `add` and `replace` calls `tagsOf` (`:78`), which refuses
`PLAN_EDIT_TAGS_INVALID` at `:66` the moment `validateTags` is not a function. And `:390` refuses
`PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` on the review path, before `apply()` at `:392`. So a
builder cannot reach a green review, and v2's "green REVIEW then refuse at Save" was false.

FIXED: 3.5's second bullet is rewritten, the withdrawn sentence is named as withdrawn, and 7.1 tells
a builder to expect `PLAN_EDIT_TAGS_INVALID` at the first `Review change`. **R2's own account of
which line fires first is right and I confirmed the ordering by reading `preview()` top to bottom:
`:385` runs before `:390`.**

### 11.3 B3, the disjunct. FIXED

R2's argument is correct and I could not weaken it. The point of a dated fold is that for one capture
date there is exactly ONE value the programme prescribed; the second disjunct IS that value, and the
first is the unfolded document, which after `starts_on` prescribed something the programme had moved
on from. v2's own safety sentence, "a count matching NEITHER still refuses", was the admission that
the guard had become two of two. Verified the retirement that makes the `capture_lift` half concrete:
`plan-edit-model.cjs:361` writes `state.retirements[target.id]` on a `replace`.

FIXED under `E-R3`: 4.3 ruling 1 is rewritten with NO DISJUNCT. All three right-hand sides BECOME the
folded value for `originalDay` (`source-admission.mjs:674`). 4.2 gives EW-17a and EW-17c the control
that was impossible to write against v2's ruling (the PRE-edit count, and the REPLACED lift, on a
date at or after `starts_on`, must still refuse) and gives EW-17b an order-only control as well.
Section 5's rows carry the controls.

**R2 was also right that the membership row was already honest.** It is kept word for word.

### 11.4 B4, a fold over `apply()` folds retracted and unproven edits. FIXED

Verified both halves. (a) `source-admission.mjs:218-:220` filters `ops` for
`payload?.profile === Setup.PROFILE`, requires exactly one and validates THAT op; nothing else in
`programme()` inspects the map, and a plan mutation op is `{kind:'plan-mutation', class:'plan',
payload:null}` (`plan-edit-commands.cjs:95`), invisible to that filter by construction. (b) every
proof lives in `inspect()`: `:282` origin uniqueness, `:285` per op command validation, `:287-:293`
tombstones, `:294` the status map, `:298` duplicate intent, `:299` id reuse, `:300` and `:307-:309`
causal invalidation and the basis chain, `:306` the `active` filter, `:310` date order. `apply()`
(`:319`) knows none of it.

FIXED under `E-R4`: 4.3 ruling 2 withdraws `foldPlanEdits` over `apply()` and specifies the export
over the model's own `inspect()` plus `result()` pair. STOP 11 gains its twin: a fold that admits a
tombstoned edit is not shipped.

**THREE THINGS I MEASURED THAT NEITHER DOCUMENT HAD, and they are what makes the ruling writable
rather than merely correct:**

1. **The pair is already composed and already exported.** `result(info, date)` is `:369-:382` and
   `read(generation, date)` at `:383` is literally `result(inspect(generation), date)`;
   `createPlanEditProjector` is exported at `:397`. So no new logic is needed, only an entry point.
2. **But the public `read()` cannot be called from admission**, because `inspect()` opens with four
   EDITABILITY guards (`:226-:227`, `:235`, `:236-:240`, `:242-:243`) that ask whether this
   installation may open the editor, not what the plan said on a date. 4.3 ruling 2 lists each with
   its measured reason. This is why the export is a narrower entry and why `inspect()` must be
   factored, which is new sealed work and is why 4.4 re-prices to 7 to 10 hours.
3. **The fold needs the F2 tag projector**, because `:285` runs `commands.validate`, which runs
   `editOf`, which for an `add` or a `replace` runs `tagsOf`. Section 4 therefore depends on section
   3.5, which no earlier round said.

### 11.5 B2, the hunk that cannot be written and the basis that loops. FIXED

Verified all three parts. (i) `today-app.cjs:2488` ends with a semicolon, so v2's `.then` was not
appendable and "zero removed" was not achievable. (ii) `openPlanEditHost` exists nowhere:
`grep -rn 'openPlanEditHost' rebuild` returns nothing, and it was in neither half, neither budget
nor the 3.2 table. (iii) the loop: `plan-edit-model.cjs:237` computes
`adopted = admittedBasisOf(generation)` and `:240` fails `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` unless
`equal(adopted, base)` where `base = clone(basisState)` at `:107`; on a first run installation `:236`
skips that guard and `result()` (`:369-:382`) replays every active edit over `clone(base)`, so an
`add` hits `PLAN_EDIT_ID_REUSED` at `:346` and a `remove` hits `PLAN_EDIT_TARGET_UNAVAILABLE` at
`:321`. Every cite R2 gave holds.

FIXED under `E-R2`: 3.4.2 names the factory `openEditWeekHost`, says it lives in the SEALED module
(3.3 line 2b) inside line 3's budget, and gives all ten arguments with the measured source of each.
3.4.3 pins `basisState` to the RAW admitted or first run state in one sentence, prints the three
measured failures, and adds EW-13c and EW-13d, which are exactly the two cells `E-R2` asks for. 3.4.4
gives the hunk in the sealed module, withdraws "zero removed" by name, and lists the four things
TODAY-SPLIT must leave in place for it. STOP 13 is new.

**One finding of R2's that grew while I checked it.** 2.1's "two of those ten arguments have no
production provider" is THREE: `newIntentId` has none either. Measured:
`grep -rn 'newIntentId' rebuild --include=*.mjs --include=*.cjs` returns the parameter
(`plan-edit-host.mjs:43`), its `TypeError` (`:45`), its call site (`:170`) and three test or lane
suppliers. It is cheap, and 3.4.2 and Q-I say where it comes from, but a builder counting on v2's
"two" would have been one short.

### 11.6 B1, a wiring act filed in the view half. FIXED

Verified the chain: `host.read()` is `plan-edit-host.mjs:162`, which enqueues `readVerified`
(`:145`), which calls `lane.reopen()` (`:148`); the host's own construction requires
`client.hostBindings` (`:44`) and calls it (`:81`). So the file v2 filed in the VIEW half opens a
durable lane and builds a host. Verified `DECISIONS:542` (C) and `:543`: the WRITER-FENCE cell fails
when any file outside the sealed inventory calls a writer, opens IndexedDB or imports a host. R2 is
right, and R2 was also right to say plainly that the ledger moved under the author.

FIXED under `E-R1`, and the PM's ruling goes further than B1 did. Section 3 is re-cut for `:543`'s
reversed direction: 3.0 is new and says what rides S10 and what ships as lane C; the ROUTE and the
MOUNT become lane C because `today-app.cjs` is released; everything that constructs the host, opens
a lane, adopts a basis or rebases is sealed. 3.4.1 takes the PM's second option and reduces
`edit-week-basis.mjs` to a pure function fed by the sealed side, **with the justification `E-R1` asks
for: the sealed module must open the host either way, so moving the whole function there buys no
sealed surface and only adds the decision to the sealed budget, and the decision is the part that has
already been got wrong three times (B2 twice, N3.2 once).** 3.2 gains the rows, 3.3 splits line 2
into 2a and 2b and re-prices line 3, 6.7 is re-scoped and 6.8 makes the fence part of the bar, 9.3
splits the estimate accordingly.

### 11.7 The nine NOTES, and the five carried cites

| # | verdict | what I measured and changed |
|---|---|---|
| N3.1 the adoption module needs the tag providers too | **FIXED** | Verified `plan-edit-model.cjs:285` `commands.validate(op, id => ops[id])`, `plan-edit-commands.cjs:69` `editOf`, `:78` `tagsOf`, `:66` the refusal. On a generation carrying an `add`, the ADOPTION READ itself refuses without F2. 3.4.4, section 5's EW-14 and EW-13d rows, 7.1 and 7.2 all say EW-14 is blocked on 3.4 AND 3.5. |
| N3.2 the `&&`/`\|\|` shape silently skips adoption | **FIXED, and the shape is gone** | Verified `today-app.cjs:2493 if (!state) return;`, so a chain resolving to `undefined` adopts nothing: no `adoptBasis`, no `gym.rebase`, no `refresh`. 3.4.1 makes `planEditedState` total by construction (it calls nothing, so it cannot fall through a `catch`), 3.4.4 puts the `catch` on the sealed side where the durable call is, and EW-14's row asserts a returned state on every path including an unexpected reply shape. |
| N3.3 `:325` is stale inside the source's own comment | **FIXED** | Verified: `source-admission.mjs:325` is inside the exercise id loop; the programme digest is `:779`. 4.3 ruling 3 quotes the comment exactly, says the number inside it is the source's and is stale, and tells the reviewer to read `:779`. |
| N3.4 the S9 relay has one wrong member of five | **FIXED** | Re-measured all five: `:513`, `:596`, `:637` and `:2052` read `(view && view.indexedDB) \|\| globalThis.indexedDB`; `:1416` is `Promise.resolve().then(() => checkin.host.forDate(day))` and opens nothing. Also verified the PM's six writers at `:542` (A): `:493`, `:581`, `:1072`, `:1293`, `:1843`, `:2501`. 3.1 now prints both and states the rule R2 drew: a relayed measurement is re-measured or marked as relayed. |
| N3.5 PE-f2-identity does not need re-pointing | **FIXED** | Verified `model.test.cjs:511-:512` reads `git show f3e9561:rebuild/m4/workout/setup-tags.cjs`, a blob at a historical commit, which landing the file later cannot change. 3.5 consequence 1 drops the re-point and 9.3 drops it from the uncounted list. |
| N3.6 three cites close but not exact | **FIXED, all three** | `capture_lift`'s comment is `:601-:611` with "total" at `:610` (v2: `:604-:612`). The add and replace mint pushes at `:358` and maintains order at `:359-:365` (v2 stopped at `:356`). `gym-model.mjs:104` is the COMMENT; the code is `rebase()` calling `hostForDay(day)` at `:163`, with `hostForDay` declared as an option at `:96`. |
| N3.7 the re-measurement claim is wider than what was re-measured | **FIXED** | The header no longer claims every cite was re-measured at one head. It says what is true: every cite this round TOUCHES was re-counted at `00e7a0d0`, and this table names the ones that moved. |
| N3.8 `DECISIONS:542` has moved three things | **FIXED, all three** | (1) Q-A is CLOSED with its framing corrected: TODAY-SPLIT is the PM's decision, not an owner question. (2) STOP 2's first clause is DISCHARGED, the two path list being PM-ACCEPTED, and STOP 2 is rewritten around TODAY-SPLIT's interface instead. (3) 2.3 law 3 is restated as a STANDING rule: `browser-check.mjs` gets no CI home ever, so a green run of it is never this suite's evidence. |
| N3.9 section 1 does not carry the custody line | **FIXED** | 1.2 now carries it, with `E-R8`'s restatement: lane C builds, D2 reviews as a SECOND obligation, and "after N2" is dropped. |
| **N1's two residual drifts** (counted under R2's N1) | **FIXED** | `readVerified` is `:145-:153`, not `:143-:152`. The STALE refusal's extra fields are `:214-:216`, not `:215-:217`. Both corrected in 2.1. |

**THE FIVE CARRIED CITES R2 COUNTED, in one place:** `readVerified` `:145-:153`; the STALE extras
`:214-:216`; the `capture_lift` comment `:601-:611` with "total" at `:610`; the mint's push `:358`
and order `:359-:365`; and the digest `:779` inside the quoted comment. All five are corrected above
and in place.

### 11.8 What R2 could not break, and what v3 did not touch

R2's section 5 lists ten things it attacked and could not move: the refusal to invent a look, the
copy census, the pin and seal tables, the shape of the widening, the cells being written in outcomes,
the scope, the S9 relay's substance, the estimate's arithmetic, and the owner question. **v3 changed
none of them except where a PM ruling required it**, and each such change is named: 9.3's arithmetic
moves under `E-R11`, 9.4's questions are answered rather than re-asked, and the seal query was
re-run rather than relayed and came back identical for the third time.

Sections 1.1, 4.0, 4.1, 5.1, 5.2, 8.1, 8.3 and 10 are v2's, word for word, because neither review
could break them and neither could I.

### 11.9 What I did NOT dispute, and why that is worth a line

Round 3 disputes nothing. That is not deference: I opened every file R2 cited and re-derived every
finding, and on three of them (B3's argument, B5's ordering, N3.5's reasoning about a historical
blob) I went looking for the counter-argument and there is none. Where I could add, I added:
11.1's fourth misfiled code, 11.4's three measurements about the fold, 11.5's third missing provider,
and 3.6's `setupsIn` correction, which no review found and which would have refused
`PLAN_EDIT_ORIGIN_UNPROVEN` at the first fixture.

---

## 12. R3 FINDINGS AND THE PM'S ROUND 4 RULINGS: WHERE EACH ONE LANDED

**Round 4 disputes NOTHING of R3's verdicts. It corrects three of R3's MECHANISMS, and in each
case the correction comes from a run and not from a better reading (`E-R19`).** R3's own closing
note asked for a rule: every argument row names the line that CONSUMES it and the reviewer opens
that line. 3.4.2 now does that for all ten, and section 0 is the reason nobody has to take it on
trust.

### 12.1 The six BLOCKING

| # | landed where | verdict |
|---|---|---|
| **B1** the no-writer rule was applied to one released file | 2.1 re-cut entire; 2.2's E0, M1 and M2 rows; 3.0's two column table; 3.2's rows; 3.3 lines 1, 2b, 2c and 3; 3.4.1 re-decided; 3.5 consequence 2; 6.7 and 6.8; 7.1; 9.3; STOP 16 | **UPHELD IN FULL, and the PM's `E-R12` goes further than R3 asked.** R3 offered "the whole editor model may go sealed instead"; `E-R12` and PM NOTE b rule that nothing shaping adopted state or a durable projection may be released either, which takes `planEditedState` and the tag shim with it. The released half is now three files that import nothing sealed |
| **B2** the companion refuses the first read on every installation without F2 | 2.1's third-argument paragraph; 2.2's E0 row; 3.4.4's last paragraph; 3.5 entire, with 3.5.1's function table; 5's `blocked on` column; 7.1; 7.2; 9.3's fourth column; STOP 10 | **UPHELD AND MEASURED (SPIKE M1 rows 1, 5, 7, 10, 12).** R3 reasoned it from `setup-commands.mjs:124` and `plan-edit-model.cjs:202`; the spike ran it on both installations. **One correction in the AUTHOR's favour: R3 asked for a FOURTH F2 function and measured it is THREE plus the factory, because `validateSetupTags` has no caller anywhere.** One in R3's: `projectSetupTags` is needed on FIRST RUN only |
| **B3** the fold refuses before it folds | 4.3 ruling 2's export rewritten with `basisSource`; the tag projected `documentState`; 4.3 ruling 2a NEW; 4.4's re-priced HUNK A; SPIKE M5 | **UPHELD, and both of R3's ways out MEASURED.** Way out (a) is dead twice over (SPIKE M5 row 2 and M4 FACT 3). Way out (b) is taken. R3's last paragraph asked for a ruling on what admission reports; `E-R14` rules it and 4.3 ruling 2a is that ruling, with the allowlist kept closed |
| **B4** the clock row is wrong twice | 3.4.2's `clock` and `liveDay` rows; SPIKE M2; EW-18 in section 5 | **UPHELD IN VERDICT, CORRECTED IN MECHANISM, and the spike wins.** See 12.2 (a) |
| **B5** `capture_lift` names no replacement | 4.3 ruling 1's `capture_lift` row rewritten as a replacement; EW-17c's main assertion and both controls rewritten; N1's `:362` | **UPHELD IN FULL, and `E-R16` rules exactly as R3 predicted the answer would be: `:613` stays, `:614`'s membership test is replaced.** SPIKE M4 rows 8 and 9 measure the refusal R3 predicted, naming the minted lift |
| **B6** the adoption hunk costs three durable reads | 3.4.2's `openEditWeekHost(generation)`; 3.4.4 item 5 and its cost paragraph; 3.6's correction; STOP 9 unchanged; SPIKE M3 (c) | **UPHELD AND UNDERSTATED BY ONE.** R3 counted three extra and the instrumented count is FOUR TOTAL where there was one. R3's own repair is what `E-R17` rules and what 3.4.2 now carries; the count is two |

### 12.2 THE THREE PLACES THE SPIKE CONTRADICTS R3, AND THE SPIKE WINS (`E-R19`)

Recorded plainly, because a reviewer who trusts R3 over section 0 will write red cells.

**(a) R3 B4's REQUIRED CELL asks for a refusal the code does not raise.** R3 REQUIRED: "a review
authored on day D, saved after the live day has turned, refuses `PLAN_EDIT_DAY_TURNED` and draws
state D. Without that cell this defect ships silently." **MEASURED (SPIKE M2 row 8), that case
refuses `PLAN_EDIT_REVIEW_STALE` at `plan-edit-host.mjs:214`**, because `matches()` (`:87-:93`)
compares `localDay()` with `entry.authoredDay` and fails before `:225-:226` is reached.
`PLAN_EDIT_DAY_TURNED` is the STAMP-CLOCK DISAGREEMENT and nothing else (row 9), and the merged
lane's own cells already say so (`durable-host.test.mjs:513` STALE, `:529` DAY_TURNED). **A round 4
cell written to R3's wording would be RED ON ARRIVAL.** EW-18 is written to row 9 and carries row
8 as a control, so both facts are pinned. R3's VERDICT is untouched: the clock row was wrong, state
D would have been dead code, and B4 (ii) is confirmed by rows 10 and 11.

**(b) R3 B4 (i)'s MECHANISM is wrong by one guard.** R3 says the proposed `{today: () => liveDay()}`
reaches `clock.now()` at `host-bindings.mjs:170` or `:223` and throws there. **MEASURED (SPIKE M2
rows 1 and 2), it never reaches either: the SHAPE guard refuses it first**, `LOCAL_HOST_CLOCK_INVALID`,
state 18, at `:243`. **And the guard's own cite in the spike is six lines off and I correct it
here: it is `:242-:243`, not `:236-:237`, in `rebuild/m3/w6/local/host-bindings.mjs` and not
`m3/w6/host/`** (re-measured by me at `ad8ced07`). Same verdict, different cell.

**(c) R3's THREE PREDICTIONS about the adoption composition are two-thirds wrong.** R3 (and v3)
predicted that an IMPORTED installation fed `athleteBasisState`'s own result refuses
`PLAN_EDIT_IMPORTED_BASIS_MISMATCH`, and that a FIRST RUN one double-applies into
`PLAN_EDIT_ID_REUSED` or `PLAN_EDIT_TARGET_UNAVAILABLE`. **MEASURED (SPIKE M3 rows 4, 9 and 10):
the imported case SUCCEEDS, and the first run case refuses `PLAN_EDIT_TAG_BASIS_UNPROVEN` at
`:217`; neither `:346` nor `:321` is reachable on this path at all, because the origin proof at
construction refuses before `apply()` is entered.** `:240` does fire, on the ALREADY EDITED state
(row 10), which is the input a cell must name. **THE RULE R3 UPHELD IS UNTOUCHED AND IS STRONGER**:
both installations fed the RAW basis produce a read equal to the companion's own (rows 3 and 8).
EW-13c and EW-13d are rewritten accordingly, and v3's versions would both have been red or green
for the wrong reason.

**AND ONE PLACE THE SPIKE CONTRADICTS EVERY ROUND OF THIS SPEC, INCLUDING THIS ONE'S OWN PLAN.**
SPIKE M4 FACT 1: a saved plan edit refuses the whole import by itself, before any capture, on every
kind including a name only change and including a phone that recorded no session afterwards. The
ticket, `:510`, `:544`, R1, R2, R3 and v1 to v3 all name three capture checks and none names this.
4.1.1.0 carries it, 4.3 ruling 0 rules it, EW-17d proves it, 4.4 prices it, and 4.3 ruling 5's
interim died of it.

### 12.3 The nine NOTES

| # | landed where | note |
|---|---|---|
| **N1** the retirement is `:362`, not `:361` | 4.2's EW-17c CONTROL 2 | **UPHELD and corrected in all three places v3 cited `:361`.** `:361` is `const index = (order[oldDay] \|\| []).indexOf(target.id);` and `:362` is the `put(state.retirements ...)` |
| **N2** `originalDay` is declared after `capture_sets` | 4.2's closing paragraph; 4.3 ruling 2's `onLocalDate` row; 4.4's HUNK A | **UPHELD.** The fold names `start.effective.local_date`, or `:674`'s declaration moves to the head, and the diff says which |
| **N3** `generation` was not among the "four collaborators" | 4.3 ruling 2's list, now five plus one argument | **UPHELD.** It is `g` at `source-admission.mjs:596` |
| **N4** TODAY-SPLIT round 2 IS pushed | the header's read-before list; 3.0's TIMING paragraph rewritten; 3.2 gains `gym-settings-lane.mjs`; STOP 2 widened with four dependencies and one reported finding; 9.5's heads | **UPHELD, and it is good news.** v2 names `today-lanes.cjs` as 3.2 guessed, classifies both adoption functions as WRITES moving "YES, whole", and its B.3 gives the interface `E-R12` asks for |
| **N5** one proposed sentence is not true in one direction | 2.2.2.1's `PLAN_EDIT_BASIS_SOURCE_CHANGED` row | **UPHELD and re-proposed for BOTH directions (`E-R18`):** `The history stored on this device changed while this was open. Open Edit my week again to see your current week.` v3's is withdrawn |
| **N6** the two hash codes fire at E0 | 2.2's E0 row | **UPHELD.** Both are added to E0's refusal list; state X remains their TREATMENT and E0 is their DOOR, and the row says so |
| **N7** `setup-model.mjs` is not on the fence's import list | 2.2's E6 row; 3.2's two rows; 8.2 item 15; STOP 2's reported finding | **UPHELD, and answered against E.3 rather than argued.** `setup-model.mjs` is FREE under E.2 and its own `:14` imports `rebuild/m4/**`, so it fails the fence on its own contents. **This item does not import it at all: E6's vocabulary comes from `exercise-catalogue.mjs`, which IS on the MAY-IMPORT list** |
| **N8** two wording repairs in 3.4.2 | 3.4.2's `client` and `namespace` rows | **UPHELD, both.** The `client` row now says `era.client` and names why the options object is the wrong reading; the `namespace` row carries `local-source-basis.mjs:66`'s narrowing by `state.athlete_label` and why the pair must match |
| **N9** the adoption window across midnight has no cell | 4.2's midnight rule and EW-19; SPIKE M7 | **UPHELD, MEASURED, and given both a rule and a cell (`E-R18`).** The bound is 60 seconds (`today-entry.mjs:472`) or the next VISIBLE `visibilitychange`; a HIDDEN one does not close it |

### 12.4 EVERY CLAIM IN THIS SPEC THAT IS UNMEASURED (`E-R19`)

`E-R19` requires that every claim about what refuses, in what order, with which code, cites a spike
row or is marked UNMEASURED. These are the marked ones, in full, so a reviewer can attack the list
rather than hunt for it:

1. ~~**EW-17c's CONTROL 2**: a capture naming the REPLACED (retired) lift on a date at or after
   `starts_on` still refuses `capture_lift`.~~ **MEASURED IN v5 AND STRUCK FROM THIS LIST
   (`E-R16 PRIME` (d), `spike/r5-idspace.mjs` section 5), on a real saved `remove` through the real
   host: over FOLDED's ACTIVE rows it PASSES on a date before `starts_on` and REFUSES on
   `starts_on` itself, and over `FOLDED.exercises` it passes on BOTH, which is why 4.3 ruling 1
   (a2) names the ACTIVE set.** What is STILL unmeasured about it is narrower and is listed as
   item 7 below: the same case driven through a REAL SEALED bundle, which needs the port.
2. **The `hashBasis` adaptation** (4.3 ruling 2): that `platform.hash` can be made to satisfy
   `plan-edit-model.cjs:101-:105`'s 64 hex shape law. The spike supplied its own hash. 4.3 already
   says whoever writes the hunk MEASURES this rather than assuming it.
3. **The fold driven from INSIDE a real `programme()` call.** SPIKE M4 FACT 3 establishes why the
   import presence guard would refuse there, and SPIKE M5 folded in admission's own CONTEXT, but
   the two were not composed. This is the single largest thing round 4 hands to the build.
4. **`today-app.cjs mountToday` and the gym rebase inside `adoptAthleteState` (`:2490` onward).**
   The spike drove the two `athleteBasisState` branches and quoted `adoptBasis`
   (`today-model.cjs:412`, `basis = clone(state)`). EW-14 is the cell that closes it, on the real
   DOM path, and a reviewer wanting it earlier can drive `Entry.boot` through
   `import/test/support.mjs shellWindow` on the PC as the p3 lanes do.
5. **Every line count and hour in 3.3 line 3, 4.4 and 9.3.** They are estimates, not measurements,
   and they are marked as targets with a STOP (17) attached to the sealed budget.
6. **The WRITER-FENCE's behaviour on this item's files**, because the fence does not exist yet.
   6.8 states what it must print and its fourth bullet's census is MEASURED against E.3's text
   (`spike/r5-fence-names.mjs`); what is unmeasured is the FENCE ITSELF, which nothing has run.
7. **NEW IN v5. Every `capture_lift` row of 4.3 ruling 1 driven through a REAL SEALED BUNDLE.**
   `spike/r5-idspace.mjs` measures the two id spaces, the correspondence, the fold, the admitted
   state's append rule and all four of `E-R16 PRIME`'s questions, on both bracket levels, against
   the REAL `lift-correspondence.cjs`, the REAL `createCleanInitState` and a REAL saved plan edit
   through the REAL host. **What it does NOT do is seal a bundle and walk it through
   `source-admission.mjs`: that needs `port.cjs`, which the farm cannot run.** So the table in 4.3
   is a measurement of the PARTS and of the arithmetic between them, not of the whole walk. EW-17c
   is the cell that closes it, on the PC, and its `sealed(0)` row is the one that has never been
   run by anybody.
8. **NEW IN v5. What a plan-added lift's projected entries do downstream of the re-key.** 4.3
   ruling 1 (c) measures that the ADMITTED state carries no row under that id. What READS such an
   entry afterwards, and what it does, is not measured here at all. STOP 18 and Q-M carry it.
9. **NEW IN v5. The sentence the import screen draws for `plan_edit_basis` and
   `plan_edit_context`.** EW-20 and `spike/r5-field-vocab.mjs` measure WHICH sentence is drawn
   (the code's own, since the map does not name the field). Whether that sentence is ACCEPTABLE for
   a build defect is a copy question this spec does not answer and does not propose a sentence for
   (law 4, STOP 8, Q-J).

**Everything else in this file about what refuses, in what order, with which code, cites section 0
by row, or a row of a `spike/` cell committed beside this file.**

### 12.5 WHAT R3 COULD NOT BREAK, AND WHAT ROUND 4 DID NOT TOUCH

R3's section 6 listed ten things it attacked and could not move: the copy census, the absence of an
invented look, the B6 misfiling family, 3.6's `setupsIn` correction, the S9 relay and seal table,
the estimate's internal arithmetic, the scope, the owner question, law 4 and STOP 8, and section 10.
**Round 4 re-opened exactly two of them, and only because the spike forced it:** the estimate's
arithmetic (9.3, because `E-R12` moved work between halves) and the copy census (2.2.2.1's one
re-proposed sentence, under `E-R18`). The other eight are untouched, and sections 1.1, 4.1, 5.2,
8.1, 8.3, 10 and 11 are kept word for word.

**Two things R3 said that this round wants on the record.** First, its pattern note: "each is a
place where the spec names a real product value as an argument and does not run the guard the
receiving code puts on that argument". That is exactly right, it is why `:548` ruled the spike, and
3.4.2's third column is the rule it asked for. Second, its judgement that "section 3.4 and section
4.3 are the most carefully derived pages of design I have read in this repo". Round 4 rewrote large
parts of both, not because they were badly derived, but because derivation is not measurement. That
is the lesson of the round and it belongs in the ledger more than any single finding here does.

---

## 12.6 R4 FINDINGS: FIXED OR DISPUTED, WITH THE CELL THAT PROVES EACH (NEW IN v5)

Independent review R4 (`EW2-SPEC-REVIEW-R4.md` at `84e09193`) returned REJECT at `f9b1c8db` with
four BLOCKING findings and five notes. **It is the first round that RAN THE PRODUCT AGAINST THE
SPEC, and the finding that matters came out of a cell its author wrote to break the design, not out
of a reading.** The PM's judgement is that the method worked. **NOTHING OF R4's IS
DISPUTED BY THIS VERSION. All four blocking findings are upheld; two were PM choices and the PM has
re-taken them (`E-R16 PRIME`, `E-R17 PRIME`); two were document corrections and are made. All five
notes are adopted.**

| R4 | verdict | where it landed, and the cell that proves it |
|---|---|---|
| **B1** `E-R16` puts a FILE id against a DOCUMENT-id set, and measured it refuses twelve of sixteen lifts on a real old app file | **UPHELD IN FULL, AND THE PM HAS RE-TAKEN THE RULING (`E-R16 PRIME`)** | 4.3 ruling 1's `capture_lift` row is rewritten in three parts with the id space named in each, and 4.3 gains an **ID SPACE TABLE** covering every id and every set it compares. **PROOF: `spike/r4b-capture-lift.mjs`, which is R4's own cell kept unaltered, and `spike/r5-idspace.mjs`, which extends it to all four of `E-R16 PRIME`'s questions on `variant(0)` and `variant(7)` at both sides of `starts_on`.** The two agree value for value. R4's own numbers reproduce exactly: 12 of 16 targets differ, 16 of 17 pass today, 5 of 17 under `E-R16` as worded. Under `E-R16 PRIME` it is 16 of 17 on both fixtures, and the "refuses where it passes today" list is EMPTY |
| **B1, second half:** EW-17c cannot catch it because the fixture's bracket hides the defect | **UPHELD** | `E-R21` is adopted: every cell that asserts what is ADMITTED names its bracket level, EW-17c's MAIN row now seals **`sealed(0)`**, and **R4's own cell becomes EW-17c's named CONTROL 1**. Section 5's preamble states the rule and says why level 2 and above hide it |
| **B2** `E-R17` is not carried out: the adoption still costs THREE durable loads, and 3.4.4 item 5 asks TODAY-SPLIT for a binding that does not exist | **UPHELD IN FULL, AND THE PM HAS TAKEN THE HUNK (`E-R17 PRIME`)** | Item 5 is WITHDRAWN. `local-source-basis.mjs` gains ONE added export (3.2's row, 3.3 line 5 amended, about 12 sealed lines), the existing export stays byte-identical, 3.4.4's hunk is re-cut, 3.3 line 3's budget goes to about 142 and 9.3's sealed row to 9 to 12 hours. **PROOF: `spike/r5-adoption.mjs`, the same instrument R4 used: v4's text measures 3, the new design measures 2, the floor with no editor is 1, and row D isolates the one extra act as `lane.reopen()` inside `readVerified`.** Row E drives the never-throws contract of both spellings, nine drives, none throwing, which is why the existing export is left alone |
| **B2, the three ways out R4 said were each forbidden** | **ANSWERED, and the PM took (a) with a fourth thing R4 could not have known** | (a) is taken, with the `try` staying exactly where it is. (b) is NOT taken, so `importAdmitted` keeps its meaning (3.4.4 item 4, measured). (c) is NOT taken: STOP 9 stands. **And `E-R17 PRIME` (iv) dissolves R4's D.1 objection by SEQUENCING: EW2's sealed hunks land as commits ON TOP OF TODAY-SPLIT's, so the split's verbatim proof, which is a property of its own commits, is untouched** |
| **B3** the released callback table is named `onWeek.save` and `onWeek.close`, both on E.3's word list, and 6.8 checks only the import side | **UPHELD** | `E-R22`. The table is renamed: `save` to `saveChange`, `close` to `closeEditor`, `open` to `openWeek`, following TODAY-SPLIT's own B.3 pattern. 2.1's census paragraph and 2.2's `HOW TO READ` paragraph both move with it, and EW-12 gains a control. **6.8 gains a FOURTH bullet with the MEMBER-name census printed, all seven members. PROOF: `spike/r5-fence-names.mjs` against E.3 at `24b35244`: 28 member names on the list, v4 hits 2 of them, v5 hits 0.** STOP 2 records that the list may move under `:550` |
| **B4** exactly one of the ids can reach green on acceptance, not four, and 9.3 is the sentence the PM approves | **UPHELD** | `E-R23`. Section 5's `blocked on` column splits RUN from GREEN for EW-17a, EW-17b and EW-17d; 7.2's row splits the same way; **9.3's fourth column is replaced by a per-id table in which EW-19 is the only id of the twenty-three that reaches GREEN on acceptance**, with EW-20 and EW-17c's CONTROL 1 added in v5 as the only other green things, and every row carries a spike row or the UNMEASURED mark. The hours do not move; the sentence does |
| **N1** the adoption read takes no date, so two cells are red on arrival | **ADOPTED** | 3.4.4 says which day the adoption read is taken on and prints the measured table; EW-13d gains a named date and a CONTROL d0; EW-14 names a date. **PROOF: `spike/r5-readday.mjs`, which reproduces R4's table exactly: no date, the added lift appears 0 times and the pre-edit `sets` stands; at `starts_on` and after, exactly once and `sets` 5** |
| **N2** 3.5 consequence 3's blocked list has eighteen ids and every other statement has seventeen | **ADOPTED** | EW-19 is struck from that list. It opens no editor |
| **N3** the factory and `projectorFor` derive `basisSource` from different generations | **ADOPTED** | One paragraph at the end of 3.4.4 retires it as a RACE that is SAFE and not a wiring defect, and STOP 13 points at it so the first builder to meet the code does not hunt a bug that is not there |
| **N4** ruling 2a's field vocabulary claim is not measured and is not on 12.4's list | **ADOPTED, AND TURNED FROM UNMEASURED INTO MEASURED** | `E-R24` seats the three names and **adds the cell R4 asked for: EW-20**. **PROOF: `spike/r5-field-vocab.mjs`**: the import screen's `REFUSAL_FIELD_SENTENCE` is a closed map of five keys, none of them the new three, and the screen falls through to the code's own sentence with the field printed verbatim above it. 12.4 item 9 carries what is still open, which is whether that sentence is acceptable for a build defect |
| **N5** TODAY-SPLIT is at `60d6ad97` and is at REJECT R2 with eight blocking | **ADOPTED** | STOP 2 and 9.5's heads both say the head is `60d6ad97`, both name the REJECT, and both say all four dependencies are on a document in a fix round. E.3 and E.4 are verified byte-identical between `60d6ad97` and `24b35244`, so nothing is excused by drift |

**WHAT R4 SAID IT COULD NOT BREAK, AND WHAT THIS ROUND DID NOT RE-OPEN.** R4's section 7 lists
eight: 3.4.1's siting argument, 3.6's dereference, 3.4.3's pinning, the fold's exclusion of a
retracted edit, the copy census and law 4, section 4's digest constraint, the estimate's
arithmetic, and EW-18's three controls. **Seven are untouched.** The eighth, the estimate's
arithmetic, moves only where `E-R17 PRIME` and `E-R23` move it, and R4 predicted exactly that:
"B4 moves the fourth column, not the sum."

**AND THE PATTERN R4 PUT TO THE PM RATHER THAN FILING AS A FINDING IS NOW A RULE.** R4 wrote that
round 3 found defects by reading, round 4's spike found them by running the product, and round 4's
review found one by running the product against a DIFFERENT FIXTURE, so "every cell that asserts
what is ADMITTED names the bracket level of the file it seals, and a reviewer asks what that level
hides". That is `E-R21`, it is in section 5's preamble and in 6.1, and it is the cheapest guard in
this document.

**THE ONE THING THIS ROUND HANDS FORWARD RATHER THAN CLOSES.** `E-R16 PRIME` (c) asked for a
measurement and it produced one that opens a question nobody had asked: the admitted state carries
no row for a lift a plan edit added, and the re-key's own comment relies on `capture_lift` having
proved that it does. **That is Q-M and STOP 18. It is a smaller thing than B1 and it is the same
kind of thing, found the same way, and it is named here rather than discovered at the first
fixture.**

---

## 13. ASTRA BLIND REVIEW: FIXED OR DISPUTED, AND THE PM'S ROUND 6 RULINGS (NEW IN v6)

Astra (Codex) read v5 BLIND at highest effort and returned **DO NOT BUILD YET**
(`rebuild/lanes/astra/reviews/EW2-SPEC-BLIND-REVIEW.md`, `origin/rebuild/r-astra-ew2-spec`
`adc9347d`, 251 lines). The PM upheld the verdict, upheld all thirteen findings and ruled `E-R30`
to `E-R38`. `E-R1` to `E-R29` stand except where a ruling below changes them.

**THE METHOD OF THIS ROUND, AND IT IS THE ORDER THE PM GAVE.** Her witnesses ran on the owner's PC
in her own scratch. **None of them is evidence here.** Every executed witness below was reproduced
by ME, in a farm scratch worktree cut from this branch's head, with cells of MY OWN writing, one
Node process at a time, `MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York`, and each row says
REPRODUCED, NOT REPRODUCED or REPRODUCED BUT MISREAD. The cells are committed beside this file in
`spike/` with their sha256. **Where my measurement disagrees with her reading, 13.10 says so by
name, and two of her thirteen are narrowed by it.**

**THE BASELINE THIS ROUND MEASURED ON.** In the scratch worktree at this branch's head,
`rebuild/lanes/d/plan-edit/model.test.cjs` plus `durable-host.test.mjs` run in ONE Node process in
1.6 seconds: **85 tests, 85 pass, 0 fail.** (The PM's dispatch expected 84 pass and one
environmental red at PE16 `f2-adapter-identity`; in this worktree that row is GREEN, so the farm's
copy of the tag adapter is the one the cell expects.) **`git status` over the worktree, excluding
untracked files, is EMPTY after every cell in this section ran: no product file was edited, and
the two prototype modules are scratch COPIES.**

### 13.1 THE THIRTEEN FINDINGS, AND THE CELL THAT PROVES EACH

| finding | severity | verdict | my cell | what my own run printed |
|---|---|---|---|---|
| **F1** the same saved edit cannot cross the import boundary | BLOCKING | **REPRODUCED, UPHELD (`E-R30`)** | `spike/ew2r6-w1-import-identity.mjs` | first run saves `sets=5` against DOCUMENT id `press-old`; import with FILE ids; **second open `read=false`, `PLAN_EDIT_TARGET_UNAVAILABLE`**; the raw imported `file-press` prescribes `sets=2`; the imported state has no row under `press-old` |
| **F2** E-R25's append creates a row the retained add creates again | BLOCKING | **REPRODUCED, UPHELD (`E-R31`)** | `spike/ew2r6-w2-creation-owner.mjs` | save an `add`, append its folded row to the admitted base as `E-R25` (ii) words it, reopen: **`PLAN_EDIT_ID_REUSED`, whether the appended row is retired or not**. CONTROL, no append: `read=true` and a second add is offered |
| **F3** the selected collision guard is weaker than its outcome | BLOCKING | **REPRODUCED, both halves, UPHELD (`E-R32`)** | `spike/ew2r6-w3-collision.mjs` | `slugOf('Lateral', setupIds)` is `lateral`; a FILE row `{lateral, Lateral, back}` exists; **augmented `idCollisions` returns `[]` and `held.has('lateral')` is `true`**, so a NEW identity answers for the file row. Converse: the folded rename `Renamed press` of the established `press` returns **`["press"]`**, a false collision |
| **F4** the retained family's discriminator names a field that is always null | HIGH | **REPRODUCED (`E-R33`)** | `spike/ew2r6-w4-pending-view.mjs` | `stored op.payload` is `null`; `members[0].value.profile` is `"earned/plan-edit/v1"`; `op.class/op.kind` are `plan / plan-mutation` |
| **F5** total fallback is not safe adoption | HIGH | **UPHELD, composed from F1 (`E-R34`)** | `spike/ew2r6-w1-import-identity.mjs` plus 3.4.4's own hunk | `planEditedState` returns `rawBasis` on `read.read === false` by its own specified totality; F1's reply IS that object, so the card would prescribe `sets=2` where `sets=5` is on disk, with nothing said |
| **F6** the prescribed list cannot edit the pending plan | HIGH | **REPRODUCED (`E-R35`)** | `spike/ew2r6-w4-pending-view.mjs` | after a saved add, `host.read()` active ids are the three setup lifts and `host.read(starts_on)` adds `brand-new`; after a saved remove, `row-old` is STILL in today's list and gone from the pending one; a second same-day `update` composes to `sets=7` on `starts_on` while today still reads `sets=2` |
| **F7** closing or cancelling during Save has no recovery contract | HIGH | **REPRODUCED and EXTENDED (`E-R36`)** | `spike/ew2r6-w5-inflight.mjs` | `close()` fired the instant the real durable commit returns: reply `ok=false acknowledged=false LOCAL_CLIENT_CLOSED`, **one plan-mutation operation on disk**. `cancel()` at the same instant: `PLAN_EDIT_REVIEW_REQUIRED`, **also committed**. The next open sees the intent `active` and applied, **and still offers a second review under a FRESH intent id with nothing reconciled** |
| **F8** F2 failures escape the refusal vocabulary | HIGH | **REPRODUCED IN PART, NARROWED (`E-R37`, see 13.10)** | `spike/ew2r6-w6-f2-boundary.mjs`, `spike/ew2r6-w6b-projector-latency.mjs` | a real host `review` with an invalid head returns **`SETUP_TAGS_INVALID`**, not a `PLAN_EDIT_*` code; a bare `RangeError` from the validator surfaces as `PLAN_EDIT_READ_REFUSED`; **and a throwing `projectNewExerciseTags` is CONTAINED at `save` as `PLAN_EDIT_PROJECTION_REFUSED` with nothing committed** |
| **F9** two machine-note contracts conflict and can erase the draft | MEDIUM | **REPRODUCED (`E-R38` F9)** | `spike/ew2r6-w7-machine-note.mjs` | `draftFrom(draftFrom({machine:{settings:[Seat=4],cues:Pause}}))` is `{"rows":[{"name":"","value":""}],"cues":""}`, and `machineFromDraft` of that is `null` |
| **F10** "new operation basis" has no stored-field handoff | MEDIUM | **CONFIRMED BY READING (`E-R38` F10)** | source read, `workout-basis.cjs:49-61`, `today-bindings.mjs:89`, `:487` | `plan_basis` is the constructor label carried verbatim, default `PLAN_BASIS = "NO_ACCEPTED_PLAN"`; `causalTips` ARE refreshed per generation at `:488`. Adopting a plan-edited state changes NEITHER |
| **F11** the 60 second maximum and the session stamp | MEDIUM | **CONFIRMED BY READING (`E-R38` F11)** | source read, `today-entry.mjs:472`, `:482`, `today-bindings.mjs:208-214` | `setInterval(check, 60000)` is a period; `clientClockFor(day, live).today()` returns the HOST `day` argument, never the live day |
| **F12** the admitted-phone re-import journey is false | MEDIUM | **REPRODUCED BY READING THE CITED CELL (`E-R38` F12)** | `retract.test.mjs:138-148`, `local-client.mjs:407-411` | the cited row asserts `retracted === false` and `LOCAL_IMPORT_RETRACT_REFUSED_ADMITTED` |
| **F13** contradictory implementation instructions | LOW | **UPHELD, every item (`E-R38` F13)** | 13.9's register | each sentence corrected or dated as history |

### 13.2 `E-R30`: STORED EDITS AND CAPTURES ARE IMMUTABLE AND KEEP THE ID SPACE THEY WERE SAVED IN

**THE PRINCIPLE, as the PM worded it.** Nothing rewrites a stored operation at import. This spec
names, for every saved edit, WHICH BASE it applies to before and after an admission, and the ONE
named boundary at which a DOCUMENT id is translated through the admitted lift correspondence, the
same correspondence source admission already uses. No second map. Where the correspondence is null
the fold refuses BY NAME for that edit and never falls back to the raw plan in silence (`E-R34`).

**"DOCUMENT" STOPS BEING CALLED AN INVARIANT OF ALL SAVED EDITS. SAY WHAT IT IS AN INVARIANT OF.**
It is an invariant of **the id a stored edit was MINTED under**, and of nothing else. Written out:

| the thing | the space it is an invariant of | for how long |
|---|---|---|
| `members[0].value.edit.exercise_id` in a stored operation | **DOCUMENT**, the space of the installation THAT SAVED IT | forever. The operation is content committed and is never rewritten |
| `members[0].value.edit.exercise.id` (an `add` or a `replace`'s new lift) | **DOCUMENT**, minted by the editor's id provider (`E-R32`) | forever, and no FILE lift ever answers for it |
| the BASE an edit applies to, BEFORE an admission | the first-run `createCleanInitState({setup})`, **DOCUMENT** | until the first admission |
| the BASE an edit applies to, AFTER an admission | the ADMITTED state, **MIXED** by construction (`source-admission.mjs:477-484`: FILE ids plus DOCUMENT ids for the lifts the file does not answer for) | from the first admission onwards |
| a CAPTURE's `slot.lift_lineage_id` | **DOCUMENT** for a capture taken before the admission (`:615-:617`'s own comment); the imported engine's own space for one taken after | per capture, decided by when it was taken |

**THE ONE BOUNDARY, AND IT IS ONE LINE OF THE FOLD.** It is the TARGET LOOKUP inside
`plan-edit-model.cjs apply()`, and nothing else in the file moves. Today `apply()` resolves
`edit.exercise_id` against `state.exercises` by EXACT id, which is why F1 refuses. Under `E-R30`:

```
targetIdOf(state, id):
  id undefined, or the first-run branch   -> id, unchanged
  the admitted correspondence has an entry -> that FILE id
  the base carries a row under the raw id  -> the raw id
                                              (a plan-created lift, or an uncorresponded
                                               document lift admission appended)
  otherwise                                -> fail('PLAN_EDIT_TARGET_UNTRANSLATED')
```

`PLAN_EDIT_TARGET_UNTRANSLATED` is a NEW code and it is deliberately NOT
`PLAN_EDIT_TARGET_UNAVAILABLE`: the latter means the lift is gone or retired, which is an answer
about the athlete's plan; the former means the two id spaces cannot be joined for this edit, which
is an answer about the import. They reach different recovery states under `E-R34`.

**WHERE THE MAP COMES FROM, AND THE HOST KEEPS ITS ZERO-BYTE ROW.** Two shapes were prototyped and
the smaller one is specified. The map is read INSIDE the fold from
`collections.derived.localSource.view.lift_correspondence`, the same authenticated derived record
`admittedBasisOf` has already proved (three copies of the basis compared for identity,
`local-source-basis.mjs`), so **`plan-edit-host.mjs` passes nothing new and 3.2's
"CALLED ONLY, zero bytes" row for it STANDS.** Admission records the map it already computed at
`source-admission.mjs:398` as ONE added member on the `view` object at `:781`. **That does not move
a digest: `:779` hashes `replayed.programmeBasis`, the operations, the interpretation, the order
map and the engine context, and never the `view`; and `admittedLocalSourceBasis`'s three-copy
identity test compares `derived.basis`, `marker.basis` and `view.basis`, which is `Q`, not the
whole view. S2144-2164's unchanged-digest requirement is preserved, explicitly.**

**WHY IT IS RECORDED AND NOT RE-DERIVED, honestly.** I MEASURED the alternative: re-deriving
`correspondence(admittedState.exercises, documentLifts)` at read time, on a fixture with two
ambiguous FILE lifts of one name plus admission's own appended row, returns the SAME map as
admission recorded (`{"row-old":"fr"}` both ways). **So re-derivation is NOT measured to drift, and
I do not claim it does.** It is still not what this spec chooses, for one reason a builder can
check: the inputs differ. Admission derives over `source.exercises` against `scratch.exercises`;
a reader at fold time has only the MIXED admitted list, and `plan-edit-model.cjs:184-190` records
that the appended retired rows deliberately share names with the file lifts that made them
ambiguous. Recording costs one member; re-deriving costs an argument nobody can close.

**JOURNEY J1, RED AT v5's COMPOSITION AND GREEN UNDER THIS ONE, AND I WATCHED IT WORK.** The
mechanism above is not proposed from reading. **`spike/ew2r6-proto-r30.cjs` carries the hunk as two
textual replacements, reads `plan-edit-model.cjs` AT RUN TIME, applies them and compiles the result
under the product's own filename. It keeps NO copy of a sealed module in the repository and it
REFUSES to run if either anchor has moved**, which is what makes it safe to commit beside this
file. `spike/ew2r6-p1b-j1-noHostBytes.mjs` drives it over a generation built by the REAL host
through the REAL durable client. **CORRECTED IN v7 (`D9`): that programme executes NO patched host,
NO Start and NO adoption, it supplies its OWN `admittedBasisOf`, and its printed `ready=true` is
the fixture's own flag and NOT a three-copy basis identity proof. `EW-21` therefore requires the
real admission, a new-host reload and a stored Start, and no round 6 programme is green for that
whole row (14.7).**

| J1 step | v5's composition (the product as it stands) | under `E-R30` |
|---|---|---|
| first-run edit, `update sets=5` on `press-old`, saved | `ok=true acknowledged=true` | same |
| import with DIFFERENT ids (`file-press`, `file-row`, `file-squat`), correspondence recorded | n/a | n/a |
| reload, read | **`read=false PLAN_EDIT_TARGET_UNAVAILABLE`** | **`read OK, file-press sets=5`** |
| the card and the stored Start would carry | the RAW imported `sets=2` | the saved `sets=5` |
| NEGATIVE CONTROL, correspondence absent for that id | n/a | **`PLAN_EDIT_TARGET_UNTRANSLATED`**, never the raw plan |
| NEGATIVE CONTROL, no map recorded at all | n/a | **`PLAN_EDIT_TARGET_UNTRANSLATED`** |
| the STORED `edit.exercise_id` after every one of those reads | `"press-old"` | **`"press-old"`. Nothing was rewritten** |
| CONTROL, the first-run branch | `press-old sets=5` | **`press-old sets=5`, identical** |

**THE SEALED COST OF THIS HUNK, COUNTED RATHER THAN ESTIMATED**, by `diff -u` of the product file
against the prototype, excluding the three import lines a scratch copy must relocate:
**24 added lines (9 of them comment), 2 removed, 0 changed elsewhere, all in
`rebuild/m4/workout/plan-edit-model.cjs`, a NET of 22 lines, which the loader cell EXPORTS as
`HUNK_NET_LINES` and it is 22 (CORRECTED IN v7, `D9`: the loader EXPORTS that number; it neither
prints it nor asserts it, and 14.7 counts both facts)**; plus **1 changed line in
`rebuild/m3/w6/local/source-admission.mjs:781`** for the recorded member. `plan-edit-host.mjs`,
`local-source-basis.mjs`, `today-bindings.mjs` and `rebuild/coach/**`: **zero bytes.**

### 13.3 `E-R31`: ONE OWNER OF CREATION, AND THE FOLD HORIZON IS RULED

**THE PRINCIPLE.** `E-R25` shape (a) stands as the **HISTORY ROSTER**, which is what old sessions
attach to. The **PRISTINE REPLAY BASE** never contains a row that a retained add will create.
`PLAN_EDIT_ID_REUSED` is never suppressed and never special-cased.

**THE FOLD HORIZON, WHICH `E-R25` LEFT OPEN, IS RULED: THE ROSTER IS THE UNION OVER EVERY RETAINED
EDIT, PAST, CURRENT AND PENDING**, because the roster exists to ATTRIBUTE HISTORY and the
PRESCRIPTION is the replay's job. A pending edit's row is in the roster on the day it is admitted,
not on the day it becomes effective, and it is never active in any prescription before its own
`starts_on`. S2798's fold-DATE omission is answered by this paragraph and is no longer open.

**THE MECHANISM, SMALLEST FIRST, AND IT IS HER SUGGESTION WITH ONE THING MADE EXACT: SEPARATE THE
TWO BY FIELD, NOT BY FILE.** Admission writes the roster rows to **their own member of the admitted
state**, `state.planRoster`, keyed by the plan-created DOCUMENT id, each entry carrying the row, the
`op_id` that created it and its `effective_from`. It does NOT write them into `state.exercises`.
Then:

- the REPLAY BASE (`state.exercises`) carries no row a retained add will create, so `apply()`'s
  `state.exercises.some(e => e.id === row.id)` guard is untouched and ID_REUSED keeps its meaning;
- the RE-KEY at `source-admission.mjs:731-734` and every reader that needs to know which lift a
  plan-created id names reads the ROSTER, which is the single authenticated place that answers;
- `capture_lift` under `E-R16 PRIME` (a) does NOT need the roster at all: its right-hand side is
  FOLDED's ACTIVE rows, which the replay produces from the retained edits themselves.

**SINGLE OWNER, STATED IN ONE SENTENCE FOR THE BUILDER: the REPLAY creates the row; the ROSTER
records that the replay will.** A reviewer of the admission hunk refuses any line that appends a
plan-created row to `state.exercises`.

**JOURNEY J2, MEASURED ON BOTH COMPOSITIONS** (`spike/ew2r6-p2-j2-prototype.mjs`, and
`spike/ew2r6-w2-creation-owner.mjs` is the red half on its own):

| J2 step | `E-R25` (ii) as worded | under `E-R31` |
|---|---|---|
| save an `add` (`added-past`), `starts_on` tomorrow | `ok=true` | same |
| import; the folded row goes to | `state.exercises`, retired | `state.planRoster` |
| reopen the editor, read | **`read=false PLAN_EDIT_ID_REUSED`** | **`read=true`** |
| the same, with the appended row NOT retired | **`read=false PLAN_EDIT_ID_REUSED`** (existence is the guard, retirement does not help) | n/a |
| the replay created the row, one owner | n/a | **true** |
| the roster still carries it for old sessions | n/a | **true** |
| add again with a NEW label | never reached | **reviewed and saved** |
| the SAME id again | never reached | **refuses `PLAN_EDIT_ID_REUSED`** |
| a SETUP id again | never reached | **refuses `PLAN_EDIT_ID_REUSED`** |
| the union the roster must carry after both adds | n/a | `["added-past","added-second"]`, the second still PENDING at the authored day. **CORRECTED IN v7 (`D9`): that is the REQUIREMENT, computed by the cell from the FOLDED state at the second add's `starts_on`. The prototype's persisted `planRoster` is written once from its single entry and holds only `added-past`. No cell has persisted the union (14.7)** |

**THE CONTROL THAT KEEPS THIS HONEST, and it is the reason F2 is a finding about `E-R25` and not
about the product:** with NO append at all, which is what the tip does today, the second open reads
`true` and a second add is offered. **The defect is introduced by the append, and separating the
roster removes it without removing what the append was for.**

**THE SEALED COST.** The roster append is new work in `source-admission.mjs` that replaces the
`E-R25` (ii) append nobody has written yet, so it is not a re-cost of a written line: about **6 to
10 added lines** beside the existing `:476-:484` block, plus the collision guard of `E-R32`.
`plan-edit-model.cjs` needs **zero bytes for `E-R31`**, which is the point of choosing a field.

### 13.4 `E-R32`: WHO MAY TAKE A FILE HANDLE, AND WHO KEEPS ONE

**THE PRINCIPLE.** A **NEW** identity refuses ANY occupied file handle, **an equal normalised label
included**. An **ESTABLISHED** identity keeps its mapping across its own renames, so a folded rename
of the same identity is **NOT** a collision.

**THE TWO HALVES, MEASURED ON THE PRODUCT'S OWN FUNCTIONS** (`spike/ew2r6-w3-collision.mjs`):

| the case | `idCollisions` as `E-R25` (i) words it | what must happen |
|---|---|---|
| FILE `{lateral, "Lateral", back}`; the athlete adds `{lateral, "Lateral", chest}` | **`[]`**, and `held.has('lateral')` is `true`, so the new identity silently answers for the file row | **refuse by name** |
| FILE `{lateral, "Lateral", back}`; the athlete adds `{lateral, "Lateral raise", chest}` | `["lateral"]` (the already-known R5 B1 class) | refuse by name, unchanged |
| FILE `{press, "Press", chest}`; the established `press` is folded-renamed to `"Renamed press"` | **`["press"]`, a FALSE collision on a legitimate rename** | **pass** |
| FILE `{press, "Press", chest}`; the established `press`, not renamed | `[]` | pass |

**WHY THE NAME CANNOT BE THE TEST.** `idCollisions` answers "is this id shared by two lifts that do
NOT answer for each other by name". That is the right question at ADMISSION, between two documents
neither of which has a history yet. It is the wrong question at FOLD time, because by then the
answer is already recorded: the correspondence says which document ids the file answers for, and a
rename changes the NAME on purpose. **So the test is asked of IDENTITIES, not of current names.**

**THE MECHANISM** (`spike/ew2r6-p3-j3-prototype.mjs`, pure functions over the product's own
`slugOf` and `normaliseName`; no product file edited):

```
established = keys(admitted lift_correspondence) UNION keys(state.planRoster)
planIdCollisions(fileLifts, foldedRows):
  for each folded row whose id is NOT established:
     the FILE holds that handle -> PLAN_EDIT_FILE_HANDLE_OCCUPIED, whatever the labels
```

**AND THE PREVENTION, WHICH IS BETTER THAN THE REFUSAL: THE EXERCISE-ID PROVIDER IS NAMED.**
S1124 supplies only intent ids and never an exercise id; `slugOf(name, taken)` reserves ONLY the set
it is handed, and `setup-model.mjs:252-254`'s own comment says uniqueness is the caller's rule.
**THE PROVIDER, ITS SET AND ITS LIFETIME:**

| what | this spec's answer |
|---|---|
| WHO mints a plan-created exercise id | the EDITOR, at review time, by calling `slugOf(name, reserved)` with the union below. It is the released half's call and it is not `setup-model.mjs`'s screen path |
| WHAT IT RESERVES, the union, all five | the SETUP document's ids; **the FILE's handles** (`state.exercises` of the admitted base); plan-created ids already active; **RETIRED** creations (a `remove` or the retired half of a `replace`); **TOMBSTONED** creations (an edit a tombstone killed); and the roster's ids |
| WHERE the union comes from | ONE added field on the authenticated read's return, `reserved_ids`, computed inside `plan-edit-model.cjs result()` from `inspect()`'s existing `added` set plus the base's ids plus `state.planRoster`. The editor never assembles it itself, so review, retry and reload cannot disagree |
| ITS LIFETIME across review, retry and reload | it is REBUILT from the authenticated read on every mint and carried nowhere. A retry of the same review reuses the id already in the stable review intent (`E-R36`); a reload re-reads and gets the same union, because every member of the union is on disk |
| a same-label re-add after a remove | gets a FRESH id. **Measured: with `lateral-2` retired and `lateral-3` tombstoned, `slugOf('Lateral', union)` mints `lateral-4`.** There is never an implicit resurrection |

**JOURNEY J3, both of her witnesses, under the mechanism** (`spike/ew2r6-p3-j3-prototype.mjs`):

| J3 row | measured |
|---|---|
| a new identity, EQUAL label, onto the occupied handle `lateral` | **`[{"id":"lateral","why":"PLAN_EDIT_FILE_HANDLE_OCCUPIED","label_equal":true}]`**. Refuses by name |
| the same add, minted against the RESERVED UNION instead | `slugOf('Lateral', setup ids UNION file handles)` is **`lateral-2`**, and its collisions are **`[]`**. Nothing to refuse |
| `Press` renamed, the established identity folded | **`[]`**. Passes |
| a roster identity later renamed | **`[]`**. Passes: it is established too |

**WHERE THE GUARD LIVES.** `planIdCollisions` runs in `source-admission.mjs`, **BEFORE** the roster
is written and before any capture is walked, beside the existing `idCollisions` call at `:389`; it
does not replace that call, which is still the right question about the two documents. A plan-added
id it names gets **exactly the treatment a setup-document collision gets today** (`E-R25` (i)):
`fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED', {field:'exercise_id', exercise_id})`, never a silent
attach. The editor-side refusal (`E-R25` (iii)) extends `PLAN_EDIT_ID_REUSED`'s subject to the file
handles, which the `reserved_ids` field above makes reachable without a second read.

**`E-R21` IS WIDENED AGAIN, by this round's own measurement:** a cell that mints a lift id says
whether the FILE could carry that id AND whether the label is equal or unequal, because the equal
label is the case five reviews walked past.

### 13.5 `E-R33`: THE RETAINED FAMILY IS IDENTIFIED, VALIDATED, AND PROVED EVEN WITH ZERO CAPTURES

The discriminator is corrected at 4.3 ruling 0 (class and kind, then `Commands.validate`, profile
read from the MEMBER). Two further rulings land here.

**THE PROOF AND STATUS TREATMENT IS NOT OPTIONAL AND IS NOT SHAPE VALIDATION.** S1797-1799 said the
three capture checks were "the only remaining evidence". `plan-edit-commands.cjs:100-127` is SHAPE
validation of one operation; `plan-edit-model.cjs:288-310` is what proves TOMBSTONES, the seen
basis and causal ORDER across the whole set, and S2090 called that proof "per capture", which is
where the gap opened. **RULED: a retained plan operation receives the model's tombstone, basis and
causal-order treatment at admission time, and it receives it EVEN WHEN THERE ARE ZERO CAPTURES.**

**WHY ZERO CAPTURES IS THE DANGEROUS CASE AND NOT THE EASY ONE.** With no session to walk, the
three capture checks never run at all, so under v5's wording a set of edits could be RETAINED with
nothing whatever proved about it, and the editor would then open on a history it cannot replay:
the first read after the import would refuse, and under v5's fallback the athlete would be shown the
raw plan and told nothing (`E-R34`). **A no-session import must not retain a history the editor
cannot replay.** The admission hunk therefore runs the model's proofs over the retained set once,
independently of the capture walk, and an import whose retained edits do not prove is refused by
name at admission, where the athlete is standing in front of a screen that can say so.

### 13.6 `E-R34`: NEVER SILENT. R4's N3 AND R5 ARE OVERRULED ON THIS POINT

**THE PRINCIPLE.** "No edits exist" and "edits exist and could not be authenticated or replayed"
are DIFFERENT STATES, and the second is never presented as the first. v5 presented them as the
same: `planEditedState` returns `rawBasis` on `read.read === false` by its own specified totality,
the gym rebases onto it, and nothing on any screen says a word. **F1 makes that concrete and I
measured both halves: `sets=5` is on disk and `sets=2` is what the card would prescribe.**

**THE PM'S PRODUCT DEFAULT, RECORDED FOR THE OWNER TO OVERRULE.** The athlete is NOT blocked from
training. Specifically, and every clause is normative:

1. the card shows **the plan the phone can PROVE** (the admitted or first-run base, unfolded), and
   never a half-folded state;
2. it says, in ONE plain sentence, that his saved changes could not be applied;
3. **Start stays available**;
4. the **stored Start carries that proven basis truthfully**: the `plan_basis` and the prescription
   capture assert the base that was actually prescribed from, never a plan-edited one
   (`E-R38` F10 makes that field explicit);
5. **nothing on disk is dropped**: no operation is tombstoned, superseded, rewritten or hidden;
6. the editor opens to a **named recovery state** and **never to Saved**.

**THE FOUR STATES, AND WHICH SENTENCE EACH ONE GETS.** `EW-14`'s fallback assertion and `STOP 9`
change together, and this table is what they now assert.

| state | how it is reached | the card | the editor opens to |
|---|---|---|---|
| **NO EDITS** | `read=true`, `intents` empty | the proven plan, no extra sentence | the normal list |
| **EDITS APPLIED** | `read=true`, `applied_ids` non-empty | the folded plan | the normal list, `Saved` where it is true |
| **NOT AUTHENTICATED** | `read=false` with a `plan_edit_history` or `plan_edit_context` code | the proven plan **plus sentence C1** | **`Your saved changes need attention`**, showing the stored edits and what refused |
| **NOT TRANSLATED** | `read=false` with `PLAN_EDIT_TARGET_UNTRANSLATED` (`E-R30`) | the proven plan **plus sentence C2** | the same recovery state, naming the lift by the NAME the athlete typed |

**THE SENTENCES, PROPOSED COPY FOR THE OWNER. Plain words, and each is a hypothesis he may
overrule.** They obey 2.3's copy laws: no jargon, no code, no blame, and nothing that asks him to
understand an id space.

- **C1, PROPOSED:** `We could not apply your saved changes to this plan, so this is the plan your
  phone can prove. Nothing you saved has been deleted.`
- **C2, PROPOSED:** `Your saved changes were made to a different copy of this exercise, so we have
  not applied them. This is the plan your phone can prove, and nothing you saved has been deleted.`
- **C3, PROPOSED, the editor's recovery heading:** `Your saved changes need attention`
- **C4, PROPOSED, the editor's one line under it:** `These changes are still on your phone. They
  are not part of the plan you see on Today.`

**WHAT THIS SPEC WILL NOT DO, AND SAYS SO.** It does not offer an automatic repair, and it does not
offer a "discard my changes" button in this round. Both are real answers and both need a proof of
custody nobody has written. The recovery state SHOWS and EXPLAINS; whether it can ACT is the S10
brief's question and is recorded as a named debt at 13.11.

**I DISAGREE WITH R4 N3 AND R5 ON THIS POINT AND SO DOES ASTRA, and the disagreement is measured,
not stylistic.** Their argument was that the raw fallback is safe because it never shows a wrong
number. It shows a STALE number and calls it current, which is the same class of defect
`:600-:611` records P3-REAL-SHAPE fixing: the failure MOVED rather than removed.

### 13.7 `E-R35` AND `E-R36`: WHICH DATED VIEW THE EDITOR EDITS, AND WHAT A SAVE OWES

**`E-R35`, THE DATED VIEWS. ONE authenticated generation returns TWO explicitly dated views.**
S617 and S641-642 said today's read supplies the editable list. Measured
(`spike/ew2r6-w4-pending-view.mjs`), it does not:

| what the athlete did | `host.read()` (today) | `host.read(starts_on)` (pending) |
|---|---|---|
| saved an `add` of `brand-new` | `press-old,row-old,squat-old`. **`brand-new` is not selectable** | `press-old,row-old,squat-old,brand-new` |
| saved a `remove` of `row-old` | `press-old,row-old,squat-old`. **the removed lift is still listed** | `press-old,squat-old,brand-new` |
| a second same-day `update` to `sets=7` | field default seeded from today is **`2`** | the value the review applies against is **`7`** |

**RULED, and it is one call, not two reads.** The editor takes ONE authenticated read and derives
both views from it, each **explicitly dated in the returned object**: `current` for the day being
shown and `pending` for `starts_on`. **List membership and every field default in the editor come
from the PENDING view**, because that is the plan the athlete's edit will land on and the value he
is about to change. **Today's workout is IMMUTABLE and is never edited from this screen**: the
current view is what the card shows and what the athlete reads, and the editor never offers a
control over it.

**SEVERAL EDITS FOR ONE EFFECTIVE DAY COMPOSE IN SAVED ORDER, MEASURED as already true**: the
second same-day `update` reached `sets=7` over the first, in `device_seq` order, with
`PLAN_EDIT_DATE_ORDER_UNPROVEN` guarding the ordering (`plan-edit-model.cjs:310`). **What is NOT
true today and is ruled here: the editor REFRESHES after each save**, so the next field default is
the composed value and not the one the screen was opened with.

**THE READ BUDGET, RESTATED PER SAVE AND MEASURED.** `E-R17 PRIME` priced the ADOPTION at two
durable loads. A SAVE is a different operation and its budget is stated separately:
`plan-edit-host.mjs save()` performs `readVerified()` before the commit, the commit itself, and on
an unacknowledged reply a second `readVerified()`; each `readVerified` is one `lane.reopen()`.
**The refresh `E-R35` adds is the read the host already does, reused, not a new one: `save()`'s
reply already carries the committed intent, and the editor re-derives both dated views from the
generation that reply was proved against.** A cell measures the per-save load count by name and the
number it fixes is the number the build must not exceed.

**`E-R36`, THE IN-FLIGHT SAVE. MEASURED, BOTH WAYS** (`spike/ew2r6-w5-inflight.mjs`), with the hook
fired the instant the REAL durable commit returned:

| what happened at that instant | the reply the athlete's page got | what is on disk | what the next open did |
|---|---|---|---|
| `close()` | `ok=false acknowledged=false LOCAL_CLIENT_CLOSED` | **1 plan-mutation operation, committed** | read `true`, intent `active` and applied, **and it offered a second review under a fresh intent id** |
| `cancel(review_id)` | `ok=false acknowledged=false PLAN_EDIT_REVIEW_REQUIRED` | **1 plan-mutation operation, committed** | the same |

**This is not a partial transaction. It is a committed write whose reply lost its identity.** Three
rulings:

1. **WHILE A SAVE IS IN FLIGHT THE EDITOR'S EXITS WAIT FOR THE OUTCOME.** Close, back and cancel
   are DISABLED from the moment `save()` is called until its reply is in hand. The host already
   serialises through `enqueue`; what is missing is that the SCREEN lets a person jump the queue,
   and `plan-edit-host.mjs:252`'s synchronous `cancel` lets it. The editor owns this: no sealed
   byte is needed for the disable.
2. **IF THE PAGE OR THE HOST DIES MID-SAVE, THE NEXT OPEN RECONCILES BY THE STABLE REVIEW INTENT
   BEFORE ANY NEW REVIEW OR ID IS MINTED.** The intent is durable enough to do it: it is
   `members[0].value.intent_id` and the read already returns it in `intents`. The editor holds the
   review intent it last attempted in its own transient state; on open, if that intent is present
   and `active`, **the edit is shown as SAVED** and no new review or exercise id is minted until it
   has been. `plan-edit-host.mjs review()` mints `newIntentId()` before any such lookup, which is
   exactly the order this ruling reverses, and it reverses it in the EDITOR, not in the host.
3. **CANCEL IS NEVER AN UNDO, and the spec says so where the athlete could think otherwise.**
   After a save has committed, Cancel closes the screen and changes nothing. The editor's Cancel
   control is labelled and placed so that it cannot be read as "undo my change", and the recovery
   copy of `E-R34` never uses the word.

### 13.8 `E-R37`: THE F2 BOUNDARY IS CONTAINED, AND SECTION 12'S SIX HOST DUTIES EACH GET A ROW

The sentence at S2118-2119 that propagated non-`PLAN_EDIT` throws is STRUCK at its own line.
**ANY throw at the F2 boundary, projection, validation or raw, in the EDITOR and in ADMISSION, is
contained and mapped to a named refusal with a DEFINED DEFAULT.**

**THE FIELD TABLE BECOMES EXHAUSTIVE.** The three `field` names of 4.3 ruling 3 (iii) stand and
gain the codes S2097-2127 omitted, plus the default:

| `field` | codes added in v6 | why here |
|---|---|---|
| `plan_edit_history` | `PLAN_EDIT_TARGET_UNAVAILABLE`, `PLAN_EDIT_WEEK_EMPTY`, `PLAN_EDIT_NO_CHANGE`, `PLAN_EDIT_DAY_UNCOVERED`, `PLAN_EDIT_REJECTION_UNPROVEN`, `PLAN_EDIT_TOMBSTONE_UNPROVEN` | all of them are answers about the athlete's own saved history or his own week |
| `plan_edit_basis` | `PLAN_EDIT_NEW_TAG_PROJECTION_INVALID`, `PLAN_EDIT_PROJECTION_REFUSED` | both mean the fold's collaborators are wrong |
| `plan_edit_identity`, **NEW** | `PLAN_EDIT_TARGET_UNTRANSLATED` (`E-R30`), `PLAN_EDIT_FILE_HANDLE_OCCUPIED` (`E-R32`), `PLAN_EDIT_ID_REUSED` where its subject is a FILE handle | these are answers about the JOIN between two id spaces, not about his history, and `E-R34` gives them their own sentence C2 |
| **THE DEFAULT** | **any other throw, including one with no `code` at all** | maps to `plan_edit_basis` and is RECORDED with the raw message in the issue, because an unknown throw at this boundary is a build defect and must be visible. It is never propagated and never silent |

**MEASURED, so the builder knows what the boundary does today** (`spike/ew2r6-w6-f2-boundary.mjs`,
`spike/ew2r6-w6b-projector-latency.mjs`):

| drive | today |
|---|---|
| real host `review` with `head` outside the taxonomy | **`SETUP_TAGS_INVALID`** reaches the editor. The vocabulary leaks |
| real host `review` with a `secondary.mg` that is not a region | **`SETUP_TAGS_INVALID`** |
| `lend` above 1 | `PLAN_EDIT_INPUT_INVALID` (`plan-edit-commands.cjs:63` refuses before the provider is called) |
| a validator that throws a bare `RangeError` | **`PLAN_EDIT_READ_REFUSED`**: it fires inside the setup loop at READ, before the edit is looked at |
| a `projectNewExerciseTags` that throws | **`PLAN_EDIT_PROJECTION_REFUSED` at `save`, nothing committed** |

**THE SIX HOST DUTIES OF F2's REPORT SECTION 12, ONE ROW EACH, DISCHARGED BY A LINE OR DECIDED
HERE** (the module is unchanged at `origin/rebuild/d-f2-land` `24bef9b9`; injecting three functions
does not discharge a duty):

| duty | discharged by, or decided here |
|---|---|
| **1** ANY throw refuses | **DISCHARGED BY THIS SECTION**: S2118-2119 struck, the field table exhaustive, the default defined |
| **2** reject a duplicate id BEFORE `projectNewExerciseTags` | **DISCHARGED BY EXISTING LINES**: `plan-edit-model.cjs:346` precedes `:350`, and `:389` guards `preview`. `E-R32` extends the reserved set to the FILE handles through `reserved_ids`, and it does NOT rely on F2 to do it: measured, F2 alone projects an existing id happily |
| **3** ONE catalogue encoding of the primary head | **DECIDED HERE.** The catalogue's encoding of the primary head is **PRESERVED AS CHOSEN**: whatever `exercise-catalogue.mjs` hands `projectNewExerciseTags` for a catalogue pick is written unaltered. **A CUSTOM pick states its identity muscle EXPLICITLY.** Measured (`spike/ew2r6-w7-machine-note.mjs`), the taxonomy has THREE cases and not two: eight IDENTITY muscles (`abs`, `biceps`, `calves`, `forearms`, `glutes`, `hams`, `quads`, `triceps`) where `head: null` and `head: <muscle>` both validate and are not the same downstream; two muscles with sub-regions (`back`, `delts`) where the head must be `null` or one of their regions; and **`chest`, which has NO region at all, where the only head that validates is `null`**. `E-R29` is right as worded and it does not cover `chest`: the picker must not offer a head there |
| **4** absent tags return the state by identity, no context validation; a null validator returns `true` | **DISCHARGED BY A GUARD AND A ROW, not by the normal path.** S1403-1407's mandatory setup tag map means the normal EW2 flow never reaches it, so tagless success is NOT evidence. Measured: `validateSetupTags(null, null)` and `validateSetupTags(anything, null)` both return `true`. `EW-15` gains a row that drives the host boundary with the tags absent and asserts the identity projection, so the day that path becomes reachable the row speaks |
| **5** no total-helper-credit ceiling | **DECIDED HERE: the host offers CATALOGUE SNAPSHOTS ONLY in EW2. No free helper tuples.** The athlete picks from the catalogue and the snapshot is written as given; he cannot compose an arbitrary valid helper tuple in this item. No total cap is invented, and none is needed, because no EW2 control can produce one. S594 is equipment validation and never said anything about helper totals |
| **6** `priority_muscles` accepts arbitrary non-empty text | **DECIDED HERE: priorities are NOT edited in EW2 (S2609) and the SETUP's value is PRESERVED unchanged through every plan edit.** Recorded, because no sentence in this spec said it: **F2 is not an engine-vocabulary validator**, and nothing in this item may be built on a belief that it is |

### 13.9 `E-R38`: THE DOCUMENT CORRECTIONS, F9 TO F13, AND THE SUPERSEDED REGISTER

**F9, THE MACHINE NOTE CALLBACK.** S656 returns a DRAFT and the view then runs `draftFrom(latest)`
over it. **Measured** (`spike/ew2r6-w7-machine-note.mjs`):
`draftFrom(draftFrom({machine:{settings:[Seat=4],cues:Pause}}))` is
`{"rows":[{"name":"","value":""}],"cues":""}` and `machineFromDraft` of that is `null`.
**RULED: the callback returns the latest RECORD, once, and the view converts it once.** The success
shape is named: `{ ok, state, copy, code, op_id }`, which is what
`machine-settings-host.mjs:102-103` actually returns, and `ok` is `result.acknowledged === true`.
**S652's `Saved` rule is therefore stated over `ok`, not over `acknowledged`**, and the two are not
the same word. **The validation owner is the SEALED side**: `machineOf` in the producer is the one
gate, `acceptable()` in the view only asks it, and S658's in-page validation of an assembled
machine after S657 moved assembly sealed is withdrawn. **A note written under a DOCUMENT id is read
through `E-R30`'s ONE boundary and through no other:** `machine-settings-host.mjs:89` does an exact
id lookup, and `source-admission.mjs:524` retaining the note is not by itself a read path.
**CORRECTED IN v7, ASTRA'S RE-CHECK B1: the sentence that stood here, "after an import the read key
is the translated id", is WITHDRAWN.** An immutable note keeps the key it was SAVED under, so
translating the QUERY leaves that index unchanged and the editor opens BLANK over a saved note
(measured, RED: `spike/ew2r7-b1-note-read.mjs`, exit 1). **14.2 replaces it: the STORED key is
translated forward through the same recorded correspondence, and the query never is.**

**F10, THE STORED START.** `EW-14` names three things and a changed card satisfies none of them:
the stored **`Start.plan_basis`**, the **causal parents**, and the **prescription capture**.
Measured by reading: `workout-basis.cjs:49-61` carries `plan_basis` as the constructor LABEL,
verbatim, default `PLAN_BASIS = "NO_ACCEPTED_PLAN"` (`today-bindings.mjs:89`), and `causalTips` ARE
refreshed per generation (`:488`). **So adopting a plan-edited state changes NEITHER unless a label
is supplied, and `EW-14` must assert which.** THE CHOICE, PROPOSED TO THE PM: the stored
`plan_basis` carries the fold's own `plan_basis` value, which `plan-edit-model.cjs` already mints
as `earned/plan-edit-basis/v1:<sha256>`, supplied by the SEALED adoption gate where the read is
taken; if the read refused, it carries the unchanged label, truthfully (`E-R34` clause 4).
**The two-load metric is scoped: `r5-adoption.mjs` row B measures `athleteBasisState`'s basis
composition and NOT the whole adopt, rebase and refresh chain, whose gym creation loads again at
`today-bindings.mjs:447`. `EW-14` asserts the two over the operation the spike measured, by name.**

**F11 is corrected at its own line** (the 60 seconds is a polling period). Two more clauses land
here. **The stored Start at the day boundary is MEASURED, not argued**: a cell drives a Start
inside the window and asserts the `effective.local_date` the operation carries. **And the host-day
stamp is stated as it is**: `clientClockFor(day, live).today()` returns the host `day` argument
(`today-bindings.mjs:208-214`), so S1756-1758's "automatically stamped the live TODAY" is FALSE and
is corrected to "stamped the day its host stands on, which the caller chooses (C4b-D1)".

**F12 is corrected at its own line.**

**F13, THE CONTRADICTORY INSTRUCTIONS, each one corrected here.**

| sentence | correction |
|---|---|
| S1018 chooses a RELEASED adoption decision | **SUPERSEDED.** S1075 and `E-R12` put `planEditedState` on the sealed side. S1018 is dated history of v3's shape and is not an implementation option |
| S769 says THREE admission files, S2214 says two | **TWO** was right at v5 (`source-admission.mjs` and `plan-edit-model.cjs`). **In v6 it is THREE, for a reason: `E-R30` adds one changed line at `source-admission.mjs:781` and `E-R32` adds the guard, both in a file already counted; the THIRD is nothing new. 13.12 is the authoritative count and S769 and S2214 both defer to it** |
| S2362-2367 omits the `local-source-basis.mjs` added export | **CORRECTED: the permitted sealed diff includes the ONE added export `E-R17 PRIME` licenses at S873 and S936.** It remains ONE export and v6 adds no second one |
| S2513-2515 and S1565 offer an interim S2193 kills | **SUPERSEDED.** The interim is withdrawn; S2193 stands |
| S2478 and S2746 call `EW-19` the only green id, S2747 says `EW-20` is green | **CORRECTED: TWO ids can reach green on acceptance, `EW-19` and `EW-20`** (R5 N2, adopted at `:557`). Every sentence that says "the only id" is dated to v4 |
| S3285's "only id" sentence | same correction |
| S2753's "other sixteen" | **CORRECTED: `EW-16` is a DESIGN GATE and is counted separately from the cell ids** |
| S1851's `sessionMembership` warning cite | **CORRECTED to `source-admission.mjs:685`** (R5 N3); `:690` is a different comment |
| S2297's import screen cites | **CORRECTED to `import-screen.mjs` map `:153-:161`, function `:172-:198`** (R5 N3) |
| the spike's BEFORE exercise-count label | **CORRECTED: `r5-idspace.mjs:86` prints `foldedOn`, not `foldedBefore`** (R5 N4). The cell is unaltered; the label is described truthfully here |

**HER REGISTER OF SUPERSEDED SENTENCES, EVERY ONE CORRECTED OR DATED AS HISTORY.** A historical
measurement stays TRUE of the head it was taken at; what it may not do is stand as an instruction
for the new base. That is the distinction each row draws.

| sentence | what v6 does with it |
|---|---|
| S1797-1799 "the three capture checks ... and nothing else" | **CORRECTED** (`E-R33`): it must also include the folded-row collision check of `E-R32` and the proof/status treatment, and it is not the only evidence |
| S1906-1909 "does NOT invent the fix", "two shapes ... choice to the PM" | **DATED to v5.** `E-R25` settled the shape and `E-R31` now settles the OWNER and the HORIZON. S1910's "either way" and S2296 ROW4's "whichever way STOP18 is ruled" **now REQUIRE the roster shape of 13.3** |
| S1950-1951's comparison column "nothing" | **CORRECTED:** both namespaces and both rosters participate in collision prevention (`E-R25` (i), `E-R32`). S1957's "no row ... STOP18" is **baseline evidence of the tip, not allowed final behaviour** |
| S2678-2687 and S2798's orphan-row alternative and pending Q-M ruling request | **REMOVED as live options.** The append shape is settled and the FOLD DATE that S2798 left open is **ANSWERED at 13.3: the union over past, current and pending.** S2798 may no longer be cited as "resolved by the ruling"; it is resolved by this section |
| S3238 and S3309-3311 routing the admitted-row question to Q-M and STOP 18 | **RE-POINTED** to 13.3's adopted roster plus its red-first tests J2 and EW-17c ROW 4 |
| S2267-2275 `E-R21` | **WIDENED:** it gains the mintable-file-id collision row AND the equal-label row (13.4) |
| S1251-1257's displayed hunk | **CORRECTED: the dynamic import and its `.catch(() => null)` are restored around BOTH the load and the call** (`E-R26`, R5 B2). S1261's six-added and two-changed count is **RE-MEASURED in 13.12 and is not carried forward unre-counted.** S1263's requirement that the catches stay on the sealed side stands and covers BOTH failure boundaries |
| S364-368 and S2099-2107's universal `PLAN_EDIT` TypeError characterization | **FALSE at the F2 boundary and CORRECTED** (13.8's measured table: `SETUP_TAGS_INVALID` reaches the editor today). S2126's "every listed tag failure is a wiring defect" is **NARROWED: a supplied tag VALUE can fail, and the athlete's own custom pick is a supplied value** |
| `E-R28` and `E-R29` | **These are missing HOST OBLIGATIONS, not a licence to infer a convention from the vocabulary list.** Both are discharged as rows of 13.8's duties table |
| S375-381, S1411-1422, S1495-1502 "never reviewed", "no review file", "one implementation", "nothing on the tip" | **DATED AS HISTORY of the pre-`:568` heads.** F2-LAND was accepted at `:577`; **S880 is corrected: `setup-tags.cjs` exists at the accepted F2 build base `origin/rebuild/d-f2-land` `24bef9b9` and the EW2 build is cut from that branch** |
| S391-401 and S1480-1492's four old cell files, CI instruction, cherry-pick route and same-change retirement | **SUPERSEDED by `:568` and `:577`: tag-only landing, and a DEFERRED two-step retirement routed to the S10 brief.** Keep the lane copy and the landed copy EQUAL until S10 re-points ALL importers |
| S1424-1436, S1457-1470, S2473, S2634-2639 "F2 landing is a future blocking task" | **DATED.** For a build cut from the accepted F2 branch this is INTEGRATION AND SEAL CUSTODY, not missing code. Injecting the three functions is still necessary and **the tests do not become green by itself** |
| S629-632's 28-name census (`:577` S-R27 (e)) | **STILL A TRUE MEASUREMENT of its stated old head, and it may NOT stand in for the later full token and use-rule fence.** 6.8's fourth bullet runs the accepted fence. No historical sentence needs falsifying |
| S2144-2164's unchanged digest requirement | **PRESERVED EXPLICITLY and it is NOT contradicted by 13.3's roster or 13.2's recorded map:** `source-admission.mjs:779` hashes `programmeBasis`, the operations, the interpretation, the order map and the engine context, and never the returned runtime state or the `view`. 13.2 states the separation and the admission hunk's reviewer checks it |

### 13.10 WHERE I DISAGREE WITH HER, MEASURED

The PM told me to disagree wherever my measurement lets me. Two places, and both NARROW a finding
rather than overturn it.

1. **F8 IS NOT AN ESCAPING EXCEPTION AT THE FOLD BOUNDARY, AND I MEASURED THE CASE SHE DID NOT
   DRIVE.** Her F8 asks for the "entire F2 boundary, including raw exceptions" to be contained.
   Measured (`spike/ew2r6-w6b-projector-latency.mjs`), **`projectNewExerciseTags` is never called at
   `review` at all**, because `preview()` applies with `op = null` and the `if (op)` branch is
   skipped; and when it throws at SAVE, the host's own `stage` hook contains it and returns
   **`PLAN_EDIT_PROJECTION_REFUSED` with nothing committed.** So the fold boundary is ALREADY
   contained by a named refusal. **What is really defective is the VOCABULARY and the TABLE**, not
   containment: `SETUP_TAGS_INVALID` reaches the editor, a code-less throw lands on
   `PLAN_EDIT_READ_REFUSED` rather than on a stated default, and the field table is incomplete.
   `E-R37` is carried out on that narrower ground, which is a smaller and more honest hunk.
2. **HER DUTY 3 ROW IS TRUE AND INCOMPLETE.** She reports "both null and biceps validate". Measured
   over the whole shipped taxonomy (13.8), there are THREE cases, and the third one bites: **`chest`
   has no region at all, so `head: 'chest'` REFUSES `SETUP_TAGS_INVALID` and the only head a chest
   lift can carry is `null`.** A picker built from a two-case reading would offer the athlete a
   head that cannot be saved, on the commonest muscle in the file.

**AND ONE PLACE I EXPECTED TO DISAGREE AND COULD NOT.** I tried to show that re-deriving the lift
correspondence at fold time drifts from the one admission recorded, which would have made 13.2's
recorded member unavoidable. On a fixture with two ambiguous FILE lifts of one name plus
admission's own appended row, **the two maps AGREE**. The recorded member is still what this spec
chooses, for the reason 13.2 gives, but it is a cost-and-argument choice and NOT a measured defect,
and I will not present it as one.

### 13.11 THE NEW ACCEPTANCE ROWS, RED FIRST IN THE BUILD

**CORRECTED IN v7 (`D9`): FOUR rows were added here, `EW-21` to `EW-24`, counted from the table
below by `spike/ew2r7-d9-labels.mjs`. The PM's ruling named three journeys and `EW-24` was added
for `E-R36` without re-counting the heading. With 14.5's `EW-25` the spec adds five.**

Section 5's table gains four journeys. Each is **RED at v5's composition and GREEN under section
13's**, and for J1, J2 and J3 that is not a prediction: 13.2, 13.3 and 13.4 print both columns from
cells that ran. They join the twenty-three existing ids and are counted in `E-R23`'s honest green
column as RED until their hunks land.

| id | the journey, end to end | what it asserts, and the assertion that can FAIL for the defect |
|---|---|---|
| **`EW-21` (J1)** | first-run edit (`update sets=5` on a DOCUMENT id), import with DIFFERENT ids, reload, read, **Start** | the read succeeds; **the SAVED sets figure is what the card carries AND what the stored Start's prescription capture asserts**, not the raw imported one. NEGATIVE CONTROL: with the correspondence absent for that id, the read refuses `PLAN_EDIT_TARGET_UNTRANSLATED`, `E-R34`'s sentence C2 is on the card, Start is available, and the stored Start truthfully carries the UNFOLDED basis. CONTROL: the stored `edit.exercise_id` is byte-unchanged after every read |
| **`EW-22` (J2)** | save an `add`, import, reopen the editor, read, **add again with a new label** | the read succeeds; the replay created the row and the roster records it; the second add reviews and saves; **`PLAN_EDIT_ID_REUSED` still fires for the same id and for a setup id**, asserted by name as a negative control so the row cannot go green by suppression. It fails for the defect because the whole editor closes on the reopen when creation has two owners |
| **`EW-23` (J3)** | a NEW identity whose normalised label EQUALS an occupied file handle; and, in the same cell, an ESTABLISHED identity folded-renamed | the equal-label add **refuses BY NAME** (`PLAN_EDIT_FILE_HANDLE_OCCUPIED` at admission, `PLAN_EDIT_ID_REUSED` at the editor), and the minted id under the reserved union does not collide at all; the folded rename **PASSES**. Both directions in one row, because a guard that refuses everything passes the first half alone |
| **`EW-24` (her third journey)** | the editor is CLOSED after the durable commit returns, reopened | the reopen **reconciles by the stable review intent and shows the edit as SAVED**, and **no second add is offered until it has**. It fails for the defect because today the reopen mints a fresh intent id before any lookup |

`EW-13c` and `EW-17c` are narrowed rather than duplicated: `EW-13c` keeps the already-admitted
second-open loop and hands the first-run-edits-crossing-admission case to `EW-21`; `EW-17c` ROW 4
keeps the admitted-row question and hands the equal-label and valid-rename cases to `EW-23`.

### 13.12 THE SEALED BUDGET, RESTATED, AND WHICH SEALED HUNK OWNS EACH CORRECTION

**Her last bullet is upheld and is written into this table: the three-file restriction cannot
license a change anywhere else by implication.** Every file that moves is named, and every file
this round CONSIDERED and left at zero bytes is named too, so that a builder who finds himself
editing one of them knows he has left the spec.

| file | hunk | owner ruling | measured size |
|---|---|---|---|
| `rebuild/m4/workout/plan-edit-model.cjs` | **H1** the added export `foldPlanEditsAt` over the existing `inspect()`/`result()` pair plus the factoring of `inspect()` | 4.3 ruling 2, `E-R4` | unchanged from v4 |
| `rebuild/m4/workout/plan-edit-model.cjs` | **H2, NEW: the ONE named translation boundary** | **`E-R30`** | **24 added (9 comment), 2 removed, net 22, 0 changed elsewhere. COUNTED by `diff -u` against the prototype and EXPORTED by the loader cell as `HUNK_NET_LINES`, not estimated. CORRECTED IN v7 (`D9`): the loader neither prints nor asserts it** |
| `rebuild/m4/workout/plan-edit-model.cjs` | **H3, NEW: the `reserved_ids` member on `result()`'s return** | **`E-R32`** | about 4 added lines, 1 changed (the `freeze({...})` list) |
| `rebuild/m3/w6/local/source-admission.mjs` | **A** the per-capture fold call and the three re-pointed capture checks | 4.3 ruling 1, `E-R16 PRIME` | unchanged from v5 |
| `rebuild/m3/w6/local/source-admission.mjs` | **B** the `plan` class replay family, **plus `E-R33`'s proof and status treatment over the retained set, including the ZERO-capture case** | 4.3 ruling 0, **`E-R33`** | v4's estimate plus the zero-capture proof |
| `rebuild/m3/w6/local/source-admission.mjs` | **C, NEW: the HISTORY ROSTER written to `state.planRoster`, and `planIdCollisions` beside `:389`** | **`E-R31`, `E-R32`** | about 6 to 10 added for the roster, 8 to 12 for the guard, beside `:476-:484` |
| `rebuild/m3/w6/local/source-admission.mjs` | **D, NEW: one added member on the `view` object at `:781`, the recorded `lift_correspondence`** | **`E-R30`** | **1 changed line. It moves no digest: `:779` never hashes the view** |
| `rebuild/m3/w7-preview/today/local-source-basis.mjs` | the ONE added export `E-R17 PRIME` licenses | `E-R17 PRIME` | unchanged, and **v6 adds NO second export** |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | `createEditWeekEntry` | 3.3 line 2 | unchanged |
| `rebuild/m3/w7-preview/today/edit-week-lane.cjs` (new file) | the adoption compose, `E-R34`'s four states, `E-R36`'s reconciliation seam | `E-R12`, **`E-R34`, `E-R36`** | new file; `E-R34` and `E-R36` add to it and to nothing sealed elsewhere |
| `.github/workflows/rebuild.yml` | the new suite registration | R1 N4 | unchanged |

**FILES THIS ROUND CONSIDERED AND LEFT AT ZERO BYTES, BY NAME.** `plan-edit-host.mjs` (13.2 chose
the shape that keeps its zero-byte row); `plan-edit-commands.cjs`; `today-bindings.mjs`;
`workout-host.mjs`; `host-bindings.mjs`; `rebuild/coach/**` including
`machine-settings-commands.cjs`; `machine-settings-host.mjs`; **`gym-app.mjs` (CORRECTED IN v7: it
LEAVES this list under 14.4, by a NAMED hunk of 2 added and 1 removed lines at `:147` and its
import, counted and pending the PM's word; nothing else on this list moves)**;
`exercise-catalogue.mjs`; `setup-model.mjs`; `setup-host.mjs`. **`E-R38` F9's machine-note ruling
is carried by the VIEW and by `edit-week-lane.cjs`: `machine-settings-view.mjs` is already
unsealed and C-UI-5 owns it. CORRECTED IN v7: "entirely" was wrong. The corrected READ has to reach
the card, the card builds its own lane, and hunk E at 14.4 is the two-line consequence.
`machine-settings-host.mjs` and `rebuild/coach/**` stay at zero bytes, measured.**

**THE PRICE, RE-PRICED A FIFTH TIME (v1: 2 to 3; v2: 4 to 6; v3: 7 to 10; v4: 10 to 14; v6: 16 to
22 plus its own review round).** v4's 10 to 14 stands for H1, A and B. Added:

| what | hours |
|---|---|
| **H2**, the translation boundary, with J1 and its two negative controls and the first-run control | 1 to 2 |
| **H3 plus C**, the roster, the reserved union and `planIdCollisions`, with J2, J3 and the ID_REUSED negative controls | 3 to 4 |
| **D**, the recorded member plus the digest-invariance proof against `:779` | 1 |
| **`E-R33`'s zero-capture proof treatment**, with its own cell | 1 to 2 |
| **total** | **16 to 22 hours plus its own review round** |

`E-R34`, `E-R35`, `E-R36` and `E-R37` are the EDITOR's and the new lane file's work and are priced
in section 9.3's build estimate, not here: **none of them adds a sealed byte outside
`edit-week-lane.cjs`, which is a new file.**

### 13.13 WHAT THIS ROUND COULD NOT MEASURE, AND THE NAMED DEBTS

**UNMEASURED, and no sentence above claims otherwise (`E-R19`).**

- **Nothing here walked a REAL SEALED BUNDLE through `source-admission.mjs`.** The farm cannot:
  the oracle files a sealed port needs are outside its include list. Every import in every cell of
  this round installs the PE16-style admitted-state fixture directly. **So J1, J2 and the roster
  are measured over the SHAPE admission commits and not over an admission EXECUTION**, and the
  build's own cells must drive the real port before any of the three is called proved.
- **No end-to-end prescription-history count after a sealed import.** `engine-history.cjs:74-80`
  requires the original captured layout identities and the projected re-key deliberately differs;
  a performed-set read after rename, replacement, removal and same-label re-add, on BOTH id-space
  fixtures, asserting exact attribution and COUNT, is required by `E-R21` and is not yet written.
  **F3 is an alias RISK. Nobody has executed a sealed import that double-counted a set.**
- **No browser, no phone, no Windows suspension, no second-device sync, no full Today suite, no
  rig187, no conformance or private fixture, no protected soak.** The design gates and the DOM
  states of `EW-16` are unmeasured here as they were in v5.
- **`E-R36`'s reconciliation is specified but not prototyped.** I measured the DEFECT end to end;
  I did not build the editor state that fixes it, because it lives in a file that does not exist.
- **`E-R34`'s copy is PROPOSED and unmeasured.** No cell drives a screen that renders C1 to C4.
- **The per-save read budget of `E-R35` is STATED and not yet counted.** `r5-adoption.mjs` counted
  ADOPTION loads; the save-path count is a cell the build writes first.

**NAMED DEBTS FOR THE EW2 BUILD BRIEF, which is where `D-EW2-FINAL` sends whatever survives.**

1. **RECOVERY CANNOT YET ACT.** `E-R34` gives the athlete a named recovery state that SHOWS and
   EXPLAINS. Whether it may repair, or discard, a stored edit that cannot be replayed is not
   decided here and needs a custody proof.
2. **THE HOST-DAY STAMP.** `E-R38` F11 states the stamp as it is; whether Start should refuse on a
   turned day, or restamp, is the S10 brief's question, and `EW-19` cannot fail for it today.
3. **THE FOLD HORIZON'S SECOND ORDER.** 13.3 rules the roster is the union over pending edits. What
   the roster must do with an edit a TOMBSTONE later kills after the import is stated only as
   "the row stays, attribution is unchanged, the replay does not create it"; no cell drives it.
4. **F2's GUARD COVERAGE** carries its own named debt from `:577` (4), and EW2 inherits it: a
   future edit of `setup-tags.cjs` is reviewed term by term and never trusted to its cell alone.
5. **THE TWO COPIES OF THE TAG MODULE** may not drift until S10 re-points ALL importers.

### 13.14 WHAT ASTRA'S NARROW RE-CHECK IS FOR, AND WHAT IT IS NOT

`D-EW2-FINAL` makes this the LAST general author round. Her re-check is **NARROW BY ORDER**: this
section's rulings and journeys only, no new hunt. Concretely, the four things worth her effort:

1. **RE-RUN MY EIGHT WITNESS CELLS AND MY THREE PROTOTYPES** (CORRECTED IN v7, `D9`: EIGHT, not
   seven; eleven executable cells in all, the three prototypes included) and say whether each prints what
   13.1 says it prints. They are committed in `spike/` with their sha256 and the directory each
   must be copied to.
2. **ATTACK THE PROTOTYPES, NOT THE PROSE.** `E-R30`'s boundary, `E-R31`'s roster and `E-R32`'s
   reserved union are three mechanisms I watched work on three journeys. Find the fourth journey
   they do not survive.
3. **CHECK MY TWO DISAGREEMENTS AT 13.10.** If the fold boundary is not in fact contained, or if
   the taxonomy has a fourth case, the narrowing is wrong and `E-R37` is under-specified.
4. **CHECK THE SEALED BUDGET LINE BY LINE AGAINST 13.12's ZERO-BYTE LIST.** A correction that needs
   a byte in a file on that list is a finding, and it is the finding her last bullet predicts.

**This document is a hypothesis. It is written to be disagreed with, and the reviewer commits one
file: the review.**

## 14. ASTRA'S NARROW RE-CHECK OF ROUND 6: THE ONE BLOCKING JOURNEY, FIXED (NEW IN v7)

Astra (Codex) re-checked round 6 NARROWLY at highest effort and returned **DO NOT BUILD YET**
(`rebuild/lanes/astra/reviews/EW2-SPEC-RECHECK-R6.md`, `rebuild/r-astra-ew2-spec-r6` `2cac2a3d`,
141 lines). She upholds one BLOCKING journey, **B1**, and words everything else she still holds as
**TEN NAMED DEBTS, D1 to D10**, for the build brief.

**WHAT THIS ROUND IS, AND WHAT IT IS NOT.** `D-EW2-FINAL` stands: round 6 was the last general
author round and there is no new one. Under the owner's ruling at `DECISIONS:613` this loop turns
WITHOUT the PM, so her undisputed findings are this round's orders and nobody waits for a ruling
inside the loop. Accordingly round 7 does exactly three things: it fixes **B1** narrowly, it
corrects the **D9** evidence labels in place, and it carries **D1 to D10 VERBATIM** into 14.6 for
the build brief. **It solves no debt in prose.** A debt answered on paper without a cell is how
five Claude rounds missed her findings in the first place, and 14.6 says under each one only where
this spec touches it.

**NOTHING WAS TAKEN FROM HER SCRATCH AS EVIDENCE.** Her programme was read as a guide. Every number
in this section came out of a cell of MY OWN, written before the spec text, run one Node process at
a time under `MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York`, on BOTH machines, and committed in
`spike/` with its sha256 and its exit code (14.7).

### 14.1 B1 REPRODUCED, RED FIRST, AT THE HEAD SHE CHECKED

`spike/ew2r7-b1-note-read.mjs` drives the REAL `machine-settings-host.mjs` over the REAL durable
client and the coach's own producer, saves the note she saved, installs the same admitted state,
and then follows **13.9 exactly**: it queries `latest` with the TRANSLATED key. **It exits 1 at
`f6fd29ac`**, and its three closing assertions are what the corrected rule owes. Its stdout, as
measured:

```
save({exercise_id:press-old, Seat=4, cues:Pause}).ok       true
the key the immutable note was SAVED under                 "press-old"
BEFORE the import, draftFrom(latest("press-old"))          {"rows":[{"name":"Seat","value":"4"}],"cues":"Pause"}
recorded lift_correspondence                               {"press-old":"file-press","row-old":"row-old","squat-old":"squat-old"}
13.9/M1 read: latest("file-press")                         null
AFTER the import, draftFrom(that)                          {"rows":[{"name":"","value":""}],"cues":""}
CONTROL latest("press-old") still finds the note           true
CONTROL the stored operation is byte-unchanged             true
rows the host holds in this generation                     1
RED, as written: B1: latest(translated id) is null, so the editor opens blank over a saved note
```

**HER READING IS UPHELD IN FULL AND I DISPUTE NOTHING IN B1.** The note is not deleted: it is lost
to the only read the athlete has. The cause is exactly as she states it. `latestFor` compares
`row.machine.exercise_id` to the requested id (`rebuild/coach/machine-settings-commands.cjs:161`)
and the note carries the id it was MINTED under, forever, by the same immutability `E-R30` rules
for stored edits. **Translating the QUERY cannot change that index**, and
`plan-edit-model.cjs`'s `targetIdOf` is private to the fold: neither
`machine-settings-host.latest()` nor the coach's `latestFor()` ever calls it. 13.9's sentence
"after an import the read key is the translated id" is **WITHDRAWN** and corrected in place.

### 14.2 `E-R38` F9 AMENDED: THE NOTE'S OWN IDENTITY IS TRANSLATED, AND THE QUERY NEVER IS

**THE RULE.** A stored machine note is IMMUTABLE and keeps the id space it was saved in, exactly as
`E-R30` rules for stored edits and captures. Admission never rewrites one, and neither does this
correction (measured: the stored operation is byte-identical before and after, 14.1 and 14.3).
The join therefore happens on the STORED side of the comparison, at read time, and in one place.

**THE ONE NAMED BOUNDARY.** `noteIdentityOf(context, storedId)`, in the note resolver of the new
lane (`edit-week-lane.cjs`'s file, section 3.2's release list decides the exact path). It reads the
SAME recorded correspondence `E-R30`'s fold reads, on the SAME authenticated derived record:
`collections.derived.localSource.view.lift_correspondence`, the ONE member admission records at
`source-admission.mjs:781` (hunk D). **There is no second map and no second derivation.** Its four
branches are `targetIdOf`'s four branches, applied to the stored key in the
DOCUMENT-to-current direction:

| the stored key | the branch | the lift it answers for | the space it is reported in |
|---|---|---|---|
| any, with no admitted view on the generation | first run | the key, unchanged | `first-run` |
| the correspondence has an entry for it | translated | that FILE id | `document` |
| the admitted base carries a row under it | untranslated and unnecessary | the key, unchanged | `native` |
| none of the above | no join exists | **no lift at all** | `untranslated` |

**THE SELECTION, AND WHY IT IS NOT A SECOND LATEST-WINS RULE.** The resolver relabels a COPY of
each stored row into the identity it answers for, carrying `saved_as` and `saved_in` beside it, and
then calls the coach's OWN `latestFor` on those copies. **The date rule and the store's own order
are the coach's, unchanged and not re-implemented**, so a document note and a native note compete
on their dates exactly as two native notes do. Measured, both ways round, in 14.3.

**WRITES ARE NEVER TRANSLATED.** The editor saves under the id the card is showing, which is always
the CURRENT space (`gym-app.mjs:305` with `machineFromDraft(draft, liftId)`), so a correction made
after an import is a NATIVE note and needs no map to be read back. **The boundary is a READ
boundary only. Nothing is migrated, nothing is re-keyed and nothing is deleted.**

**THE REFUSAL BY NAME, WHERE THE CORRESPONDENCE IS NULL.** A null from this read is allowed to open
a blank draft ONLY when it is a CONFIRMED absence: no stored note answers for the lift AND no
stored note is untranslatable. If any stored note falls to the fourth branch, the read **REFUSES BY
NAME with `MACHINE_NOTE_TARGET_UNTRANSLATED`** and names the keys it could not join. It is
deliberately NOT `PLAN_EDIT_TARGET_UNTRANSLATED`: a note is not a plan edit, it is refused in the
gym card's own vocabulary and it reaches a different surface. It is deliberately not
`PLAN_EDIT_TARGET_UNAVAILABLE` either, for the reason 13.2 gives: unavailable is an answer about
the athlete's plan, untranslated is an answer about the import.

**AND THE ATHLETE IS NEVER TOLD "NOTHING SAVED" OVER A NOTE THAT EXISTS.** This is `E-R34`'s
never-silent rule applied to the note lane, and the card already carries it: `gym-app.mjs:149-152`
records a rejected read as `state:'failed'` under the comment A REFUSAL IS NOT AN ABSENCE, and
`machine-settings-view.mjs:71-79` paints that state with `copy.unread` instead of the empty state.
**Zero further bytes are needed to show the refusal**, which is why the resolver rejects rather
than returning a null: measured at 14.3.

**WHAT DOES NOT CLOSE B1, stated because she says so and I agree.** A second draft conversion does
not; an empty-state message does not; retaining the note at admission (`source-admission.mjs:524`)
does not, because retention is not a read path. `E-R38` F9's record/`ok`/single-conversion
corrections stand as written and are not sufficient on their own.

### 14.3 THE PROTOTYPE, AND BOTH CONTROLS SHE REQUIRES

`spike/ew2r7-proto-note.mjs` is the whole correction: a pure resolver plus the one call the card
makes. **ZERO PRODUCT BYTES.** It keeps no copy of a sealed module, declares no second validator
and no second latest-wins rule, and the only product code it calls is the real host's own `all()`
and `repository`, and the coach's `latestFor`. `spike/ew2r7-p4-note-identity.mjs` drives it through
the same real host and durable client the red cell uses. **It exits 0.** Its stdout, as measured:

```
BEFORE the import, draftFrom(latest("press-old"))          {"rows":[{"name":"Seat","value":"4"}],"cues":"Pause"}
noteIdentityOf(stored "press-old")                         {"id":"file-press","space":"document"}
latestNoteFor("file-press").ok                             true
  its record was saved as / saved in                       press-old / document
AFTER the import, the draft the editor opens               {"rows":[{"name":"Seat","value":"4"}],"cues":"Pause"}
latestNoteOn(host,"file-press") saved as / in              press-old / document
no correspondence recorded: ok / code                      false / MACHINE_NOTE_TARGET_UNTRANSLATED
  the notes it could not join                              ["press-old"]
  and through the lane call it REJECTS with                MACHINE_NOTE_TARGET_UNTRANSLATED
with both notes, the winner was saved as / in              file-press / native
  the draft it opens                                       {"rows":[{"name":"Seat","value":"5"}],"cues":"Squeeze"}
  both notes are still on disk, rows =                     2
document 09-14 versus file 09-15, winner                   file-press (2026-09-15)
document 09-16 versus file 09-15, winner                   press-old (2026-09-16)
re-add: latestNoteFor("lateral-2") ok / record             true / null
re-add: latestNoteFor("lateral") saved as / in             lateral / native
first-run (no admission), saved as / in                    lateral / first-run
product bytes this prototype required                      0
ALL ASSERTIONS HELD
```

| what she asked for | the line that answers it | asserted |
|---|---|---|
| **CONTROL 1, a pre-import DOCUMENT note** | the draft after the import is byte-identical to the draft before it, `saved_in=document` | yes, `deepEqual` against the pre-import draft |
| **CONTROL 2, a native FILE note** | saved through the real host under `file-press` after the import, `saved_in=native`, never translated | yes, and its draft is asserted whole |
| **date and order preserved** | the two spaces permuted: `09-14` document versus `09-15` file wins file; `09-16` document versus `09-15` file wins document | yes, both directions |
| **same-label re-add** | a note on the retired `lateral` answers for `lateral` and NOT for the minted `lateral-2`, which opens as a CONFIRMED absence and not as a refusal | yes, `record === null` and `untranslated === []` |
| **the refusal where the correspondence is null** | the named code, the keys it could not join, and a REJECTION through the lane call | yes, all three |
| **nothing rewritten** | the stored operation is byte-identical after every read, and both notes are still on disk | yes |
| **the first-run control** | before any admission nothing is translated at all | yes |

**WHAT THE PROTOTYPE DOES NOT PROVE, said before anyone asks.** No sealed bundle went through the
real port; the admitted state is the PE16-style fixture every cell of rounds 6 and 7 installs
directly. No browser and no DOM: `gym-app.mjs` itself was not executed, and 14.4 says so again.
The retired `lateral` row and the minted `lateral-2` are a synthetic admitted base in the shape
13.2's fourth table row describes, not a sealed admission's output.

### 14.4 THE SEALED BUDGET, RESTATED HONESTLY: `gym-app.mjs` LEAVES THE ZERO-BYTE LIST

**This is the finding her last bullet predicted, and I am not going to move a zero-byte file by
implication.** The resolver is new lane code and costs no sealed byte. The problem is reaching it:
**the shipped card builds its own lane** at `gym-app.mjs:165-167` and takes the note read at
`:147`, and its `settings` option is for tests only (`:122-123`, "Tests inject `settings`
directly"). So the corrected read cannot be installed by injection on the shipped path.

**THE HUNK, COUNTED RATHER THAN ESTIMATED** (`spike/ew2r7-p5-card-hunk.mjs`, exit 0): it reads
`gym-app.mjs`, proves both anchors occur EXACTLY ONCE so the count is real, patches in memory,
counts by line diff, and proves the result still parses.

```
anchor 1, the view import, occurrences                     1
anchor 2, the note read, occurrences                       1
added lines                                                2
removed lines                                              1
HUNK_NET_LINES                                             1
the patched card parses as an ES module                    yes
the view already imports the coach producer                true
gym-app.mjs on disk is byte-unchanged                      true
```

| file | hunk | owner ruling | measured size |
|---|---|---|---|
| `rebuild/m3/w7-preview/today/gym-app.mjs` | **E, NEW: one import of the note resolver, and `:147`'s `settingsLane.latest(liftId)` becomes the resolver's `latestNoteOn(settingsLane, liftId)`** | **`E-R38` F9 as amended by 14.2** | **2 added, 1 removed, net 1. Both anchors unique; the patched file parses. NOT YET EXECUTED: no DOM was driven** |

**THIS NEEDS THE PM'S WORD BEFORE THE BUILD WRITES IT.** 13.12 names `gym-app.mjs` on the
ZERO-BYTE list and this spec does not take it off that list by itself. The sentence at 13.12 is
corrected in place to point here. **If the PM refuses hunk E, B1 does not close on the card**, and
that is the honest consequence: the only other routes measured are worse.

**THE TWO ALTERNATIVES, AND WHY EACH IS WORSE.**

1. **Change `machine-settings-host.latest()`.** Refused. That host is the coach's read for every
   caller, her re-check warns against silently editing it by name, and it would make a note lane
   depend on a derived admission record that most of its callers have no business reading.
   Sharing the resolver with `apply()` has the same problem in the other direction: her sentence
   "needs a stated contract, not the nonexistent call claimed by 13.9" is upheld, and 14.2 states
   the contract instead of claiming the call.
2. **Re-point the lane from `today-entry.mjs` boot.** Refused. `today-entry.mjs` is sha-pinned by
   `local-today-journey.test.mjs` PAGE_PINS and cannot gain a fifth lane
   (`gym-app.mjs:113-122` says why the card opens this one itself).

**EVERYTHING ELSE IN THE NOTE LANE STAYS AT ZERO BYTES, and that is measured, not hoped:**
`machine-settings-host.mjs` (the resolver uses its existing `all()` and `repository`),
`rebuild/coach/machine-settings-commands.cjs` (its `latestFor` is CALLED), and
`machine-settings-view.mjs` (the `state:'failed'` branch that paints the refusal already exists;
and it is unsealed anyway, C-UI-5 owns it). The resolver adds NOTHING to the page's import graph:
its one product import is the coach's producer, which `machine-settings-view.mjs` already pulls in.

### 14.5 THE FIFTH ACCEPTANCE ROW, RED FIRST IN THE BUILD

13.11 carries four rows; this is the fifth. It is RED at `f6fd29ac`, and `ew2r7-b1-note-read.mjs`
is that red, executed, in this branch's history.

| id | the journey, end to end | what it asserts, and the assertion that can FAIL for the defect |
|---|---|---|
| **`EW-25` (J4)** | save a machine note on a lift in the DOCUMENT space, import with DIFFERENT ids, reopen the card, read the note; then save a NATIVE note after the import and read again | the pre-import note is still the draft the editor opens, `saved_in=document`; the later native note wins on its date; **a same-label re-add opens BLANK and never inherits the retired lift's note**; and with NO correspondence recorded the read refuses `MACHINE_NOTE_TARGET_UNTRANSLATED` and the card paints the refusal, never the empty state. CONTROL: the stored note operation is byte-unchanged after every read. It fails for the defect because today the translated read returns null and the editor opens blank over a saved note |

### 14.6 NAMED DEBTS FOR THE BUILD BRIEF (Astra, carried verbatim)

**Every one of the ten is reproduced EXACTLY as she wrote it** (her lines 43 to 52, copied by
machine, not retyped). Under each one is ONE line saying where this spec touches it, and nothing
else. **Round 7 solves none of them**, in prose or otherwise: `D-EW2-FINAL` sends what survives her
re-check to the build brief, and the PM judges ONCE at the end of this loop whether the brief may
carry them or a ruling is owed first.

> D1 - Define immutable per-edit id-space/basis provenance across first admission, native file-id edits, second selection and rollback; prove admission either resolves each saved target to the same lift or refuses before publishing, and make the document-state capture fold handle mixed histories without rewriting operations.

**Where this spec touches it:** 13.2's `targetIdOf` and 14.2's `noteIdentityOf` both read the ONE recorded correspondence and nothing else. NEITHER defines provenance across a SECOND admission, no cell of rounds 6 or 7 executed one, and her wrong-lift second-map result is answered nowhere in this spec.

> D2 - Implement cold-page recovery without depending on the attempted intent surviving in transient memory; reconcile authenticated stored intents before enabling any fresh review/id, and test a destroyed page/client context plus committed and uncommitted outcomes.

**Where this spec touches it:** `E-R36` and 13.7 state the reconciliation gate; 13.13's fourth bullet already records that it is specified and NOT prototyped. Round 7 adds nothing to it.

> D3 - Name and authorize the authenticated-generation handoff for current/pending views and post-save refresh; one host.read() exposes neither both views nor its generation, and a successful save reply exposes no committed generation; do not satisfy E-R35 by two uncoordinated reads or a second replay implementation.

**Where this spec touches it:** `E-R35` and 13.7 state the dated views. 13.12 prices no host hunk for the generation handoff and round 7 adds none.

> D4 - Name and authorize the per-adoption Start.plan_basis handoff through the shared gym installation; createGymHost ignores a per-call planBasis option, so the current zero-byte today-bindings contract cannot carry the proposed changing fold label by the stated route.

**Where this spec touches it:** 13.9's F10 paragraph PROPOSES the stored label to the PM and names no handoff; `today-bindings.mjs` stays at zero bytes. Round 7 adds nothing to it.

> D5 - Wire and test every required planRoster history consumer with exact lift attribution and counts, including past/current/pending creations, tombstoned creation, removal and same-label re-add; a roster key existing in a fixture is not a history read.

**Where this spec touches it:** 13.3 rules the roster and its fold horizon; 14.7 corrects P2's union LABEL. No history consumer is wired, attributed or counted anywhere in this spec.

> D6 - Specify the admission refusal envelope/reason for occupied file handles consistently with EW-23, and place slugOf/reserved-id minting on a permitted import boundary; E6 forbids the released setup-model import that 13.4's direct provider call assumes.

**Where this spec touches it:** 13.4 and `E-R32` state the guard and the provider. Round 7 changes neither; 14.4 sets the precedent she asks for, that a byte in a zero-byte file is NAMED and COUNTED rather than implied.

> D7 - Wrap setup-tag projection, validation and detached fold execution at admission as well as the editor; assert the defined default for raw throws and retain diagnostic detail internally, since the host's save-stage catch does not surround admission.

**Where this spec touches it:** 13.8 and `E-R37`, as narrowed by 13.10. Round 7 adds nothing to admission containment.

> D8 - Complete E-R34's state table for pending-only edits, plan_edit_basis/default failures and failed authentication; show retention/cause claims only when proved, and replace C2's unsupported assertion that a missing correspondence means a different exercise copy.

**Where this spec touches it:** 13.6's copy and its state table. 14.2 adds ONE state to the note lane's half of it (the named refusal over a confirmed absence) and does NOT complete the table she asks for; C2's sentence is not repaired here.

> D9 - Correct evidence/count labels: 11 executable cells include the 3 prototypes; the loader neither prints nor asserts its net count; J1 does not execute patched host/Start or prove three-copy identity; P2 prints a desired union rather than persisting it; four acceptance rows were added, not three.

**Where this spec touches it:** 14.7 corrects every label she lists, each one measured by `spike/ew2r7-d9-labels.mjs`, and the corrections are made IN PLACE in section 13.

> D10 - Carry the host-day Start/readiness choice into the build/S10 brief and execute a stored Start across midnight; a 60-second interval is not a deadline, 13.7 contains no promised Start readiness check, and EW-19's visibility callbacks cannot prove either claim.

**Where this spec touches it:** 13.9's F11 paragraph and 13.13's second named debt already route this to the S10 brief. Round 7 executes no stored Start.


### 14.7 `D9`: THE EVIDENCE LABELS, CORRECTED IN PLACE AND COUNTED

**A label is not corrected by agreeing with her in prose.** `spike/ew2r7-d9-labels.mjs` (exit 0)
counts every one of them: it censuses the committed cells, runs the loader alone and captures its
stdout, counts the acceptance rows out of 13.11's own table, and reads the two prototype lines she
names. Its stdout, as measured:

```
ew2r6 files committed in spike/                            13
  witness programs                                         8 ["w1-import-identity","w2-creation-owner","w3-collision","w4-pending-view","w5-inflight","w6-f2-boundary","w6b-projector-latency","w7-machine-note"]
  journey prototypes                                       3 ["p1b-j1-noHostBytes","p2-j2-prototype","p3-j3-prototype"]
  support (never run alone) / loader                       1 / 1
  EXECUTABLE cells, prototypes included                    11
running the loader alone printed bytes                     0
  occurrences of "assert" in the loader                    0
  occurrences of "console." in the loader                  0
  the value it EXPORTS as HUNK_NET_LINES                   22
acceptance rows the 13.11 table carries                    4 ["EW-21","EW-22","EW-23","EW-24"]
p1b reads "ready" off the fixture flag, not a join         true
p1b supplies its own admittedBasisOf                       true
p1b Start / adoption tokens                                []
p2 computes the union from the FOLDED state                true
p2 writes planRoster once, from its entries list           true
```

| the label, where it stands | what it is corrected to, measured |
|---|---|
| 13.14 item 1, "MY SEVEN WITNESS CELLS AND MY THREE PROTOTYPES" | **EIGHT witness cells and three prototypes: ELEVEN executable cells.** The thirteen `ew2r6` files are 8 witnesses, 3 prototypes, the support module (never run alone) and the loader |
| 13.2, "which the loader cell asserts at run time (`ew2r6-proto-r30.cjs` prints `HUNK_NET_LINES` and it is 22)" | **The loader EXPORTS `HUNK_NET_LINES` and its value is 22. It neither prints it nor asserts it**: zero occurrences of `console.` and of `assert` in the file, and running it alone prints zero bytes. No round 6 cell reads the export. **The NUMBER stands** and her independent diff agrees with it (24 added, 2 removed, net 22); the words "prints" and "asserts" do not |
| 13.12's H2 row, "asserted at run time by the loader cell, not estimated" | same correction: **counted and exported, not asserted** |
| 13.2's J1 table and 13.11's `EW-21` row, on what `p1b` proves | **`p1b` executes no patched host, no Start and no adoption** (zero Start or adoption tokens in the file; the only Start-shaped token is `starts_on`, the edit's own effective day). It prints `ready=true` off the fixture's own flag and it supplies its OWN `admittedBasisOf`, so **it does not prove three-copy basis identity**. The three-copy identity sentence describes what `local-source-basis.mjs` does, which `p1b` does not execute. `EW-21` therefore REQUIRES the real admission, a new-host reload and a stored Start, and no round 6 programme may be marked green for that whole row |
| 13.3's last table row, "the union the roster must carry after both adds" | **It is a REQUIREMENT the cell computes from the FOLDED state** at the second add's `starts_on`, not a persisted roster. The prototype writes `planRoster` ONCE from its single entry, so the roster it actually holds is `["added-past"]` and the second add is still pending on the authored day. **No cell has persisted the union** |
| 13.11's heading, "THE THREE NEW ACCEPTANCE ROWS", and its first sentence "gains three journeys" | **FOUR rows were added, `EW-21` to `EW-24`, counted from the table itself.** The PM's ruling named three journeys; round 6 added `EW-24` for `E-R36` and did not re-count. **With 14.5's `EW-25` it is five** |
| 13.9's F9, "after an import the read key is the translated id" | **WITHDRAWN.** 14.2 replaces it: the STORED key is translated, never the query |
| 13.12's zero-byte list, `gym-app.mjs` | **It leaves that list under 14.4, by name, counted, and pending the PM's word** |
| `ew2r6-w2-creation-owner.mjs`'s printed line "the replay created the row itself: false" | **The cell is unaltered; the LABEL is misleading and is corrected here.** That control reads the AUTHORED day (`:56`, `h3.read()` with no day) while the add is effective at `starts_on`; the same cell prints "folded row exists on starts_on: true" at `:29`. The `false` means NOT YET EFFECTIVE on the day read, and it is not evidence that the replay fails to create the row |

**Two further corrections that are hers and are not label errors, recorded so nothing is lost.**
13.1's F8 row and 13.10 keep their narrowing: her re-check upholds BOTH of round 6's disagreements
by re-measurement, and 13.10 is left exactly as written. Her F13 row still reports 13.9's
admission-file count as contradicting itself; that contradiction is `D6`'s, is carried verbatim at
14.6, and is NOT resolved here.

### 14.8 THE CELLS OF ROUND 7, AND EVERY EXIT CODE ON BOTH MACHINES

**They do not run from `spike/`.** Copy them to `rebuild/lanes/d/plan-edit/` and run each from the
repository root, one Node process at a time, under `MEASURED_TEST_NOW=2026-09-03
TZ=America/New_York`. `ew2r7-support.mjs` and `ew2r7-proto-note.mjs` are imported by the others and
are never run alone. `ew2r7-support.mjs` is `ew2r6-support.mjs`'s scaffold with ONE knob added: it
RETURNS the era's durable client, which is what opening the real machine-settings host on the same
era needs.

| file | what it proves | sha256 | farm | PC |
|---|---|---|---|---|
| `ew2r7-support.mjs` | support only, never run alone | `2095e1e9d01321b8912aea86042009c428f9adf79d681f0136b7188200e13d80` | n/a | n/a |
| `ew2r7-proto-note.mjs` | **the correction itself**, and it is imported, never run alone: the ONE boundary, the selection over the coach's own `latestFor`, and the named refusal | `7524d1dd13305aaddaba19461d55ea6813d9b1f0ebd47984303bc2117d10a6c8` | n/a | n/a |
| `ew2r7-b1-note-read.mjs` | **B1, RED FIRST**: the saved note disappears from the editor after the first admission under 13.9's rule | `2e5cc92347e68826797c5ae5661ea9a15e5c1d35d5821a982a085a94b292620c` | **exit 1** | **exit 1** |
| `ew2r7-p4-note-identity.mjs` | **B1 GREEN** under 14.2, with both her controls, the date permutation, the same-label re-add, the first-run control and the named refusal | `6ca1c6854c4cebdf684bd9e34ee48842ff94b03d8b619201d4b64fb014d2ee57` | exit 0 | exit 0 |
| `ew2r7-p5-card-hunk.mjs` | **the price of reaching the card**: two unique anchors, 2 added and 1 removed, the patched card parses, `gym-app.mjs` byte-unchanged on disk | `c7f7a42c9ce6f4b3caa942e435bd37ab431af32ea975c834940eeeecc93e46a1` | exit 0 | exit 0 |
| `ew2r7-d9-labels.mjs` | **`D9` counted**: the cell census, the loader's silence, the acceptance-row count, and what `p1b` and `p2` actually do | `5c462839c8afa0399baa00dacc7825a9d920da45a6f5ed5b694c91dd009db856` | exit 0 | exit 0 |

**THE ROUND 6 CELLS WERE RE-RUN AT THIS HEAD ON BOTH MACHINES AND NONE OF THEM MOVED.** All eleven
executable cells and the loader: **exit 0 in the farm scratch and exit 0 on the PC**, one process
at a time, in the order 13.1 lists them. The farm baseline in the same worktree is unchanged:
`rebuild/lanes/d/plan-edit/model.test.cjs` plus `durable-host.test.mjs` in ONE process, **85 tests,
85 pass, 0 fail, 1.59 seconds.**

**ONE MEASURED WARNING FOR THE NEXT HAND, and it cost this round twenty minutes.** The PC worktree
`%TEMP%\earned-ew2` has NO `node_modules` junctions, so every cell that opens a durable client
fails there with `Cannot find package '@noble/hashes'` and exits 1. That is the WORKTREE, not the
cell: in a worktree made by `pm4-mk-lane.cmd ... yes`, which wires the live junctions, the same
eleven cells all exit 0. **An exit code from a worktree without junctions is not evidence about a
cell.** Round 7's PC runs were taken in such a junctioned worktree, at this branch's head, and the
worktree was removed afterwards.

**WHAT WAS WRITTEN AND WHERE.** `git status --porcelain` in the run worktree names only the
untracked copies of the cells themselves; no tracked file was modified by any run, and both
`gym-app.mjs` and the stored note operation are asserted byte-unchanged by the cells that touch
them.

### 14.9 WHAT ROUND 7 DID NOT DO, AND WHAT IT DISPUTES

**IT DISPUTES NOTHING.** A finding is disputed only with a measurement that shows the reviewer
wrong. I found none: B1 reproduced exactly as she stated it, on the first run, and every one of
her ten debts is either true of this spec or outside what a cell of mine touched. So B1 is fixed
and D1 to D10 are carried.

**IT DID NOT** touch any product file (`git status` over the worktree names only
`rebuild/lanes/d2/EW2-SPEC.md` and files under `rebuild/lanes/d2/spike/`); run the bar; seal a
bundle, write a receipt or an artifact; move a byte under `rebuild/engine`; write `DECISIONS.md` or
`STATUS.md`; merge into or push at `rebuild/t2-client-core` or `main`; install anything; or edit a
single byte of her scratch, which was read and never run as evidence.

**IT DID NOT MEASURE**, and no sentence above claims it did: a real sealed bundle through the real
port (the farm cannot, and the PC runs here were the same synthetic fixtures); any DOM, browser or
phone, so hunk E at 14.4 is counted and parsed but NOT executed; a second admission of any kind,
which is `D1`; a sealed admission's own appended retired row, which 14.3 models synthetically; the
full Today suite, rig187, the conformance or private fixtures, the protected soak, CI or
deployment.

**AND ONE THING IT DELIBERATELY LEFT ALONE.** `machine-settings-host.mjs` and
`rebuild/coach/machine-settings-commands.cjs` are untouched, by her instruction and by the rule
that a note is never rewritten. The resolver reads what they already return.
