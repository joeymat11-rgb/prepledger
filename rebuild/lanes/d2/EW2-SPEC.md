# EW2-SPEC: EDIT MY WEEK, SCREENS PART 2

Lane D2, SPEC ONLY. Author: cowork (Earned lane hand), Opus, 2026-09-19. Branch `rebuild/d2-ew2-spec`
cut from `0794771`. No product, test, tooling or workflow byte moves on this branch.

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

**Read before this file, v4:** section 0 of this file (the spike's fact table), then
`rebuild/lanes/d2/BRIEF-EDIT-MY-WEEK.md` (the brief of record, 101 lines), then
`rebuild/lanes/c/TODAY-SPLIT-SPEC.md` at `rebuild/c-today-split@906cb056`, whose **section E.3 is
the WRITER-FENCE's entry-point list and its MAY-IMPORT closed list**, and which section 2 and
section 3 of this file are now cut against line by line (R3 N4 and N7, `E-R12`).

Also read `rebuild/lanes/b/S9-RELEASE-SPEC.md` at `rebuild/b-s9-ui-pins@d859096a` (the release
list, which decides part of section 3). **v3 recorded TODAY-SPLIT at `14c87fa7` and said round 2
was not pushed. That is stale and R3 N4 is upheld: TODAY-SPLIT-SPEC v2 IS pushed, and the branch
is now at `906cb056`.** Its MAP `:79`, `:84`, `:113`, `:119` and `:120` this spec still uses; its
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
TODAY-SPLIT-SPEC v2's section E.3 (`rebuild/c-today-split@906cb056`) prints the fence's entry point
list BY MEMBER NAME IN CODE POSITION, including `.save`, `.reopen`, `.close`, `.latest` on a lane
identifier, and the constructors `createMachineSettingsHost` and `createPlanEditHost`'s neighbours.
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
`today-app.cjs` and `gym-app.mjs` before it ships). **The reply objects below are what `onWeek`'s
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
`onWeek.open()` serves E0 from ONE `host.read()`; `onWeek.review(kind, exercise_id, fields)` serves
E3, E4, E5 and E6; `onWeek.save(review_id)` serves S; `onWeek.cancel(review_id)` and
`onWeek.close()` serve the two exits; `onWeek.machineLatest(exercise_id)` and
`onWeek.machineSave(exercise_id, rows, cue)` serve M1 and M2. **The released file never holds a
host, a lane, a review handle that is anything but an opaque id, or an assembled edit object.**

| state | copy | call | refusals it must draw |
|---|---|---|---|
| E0 Entry | SOURCED title `Edit my week`; SOURCED intro `What would you like to change?`; SOURCED doors `Exercises` and `Machine settings` (two, not four); SOURCED, when a pending edit exists, `Changes already saved for {date}` | `host.read()` on open, once | `PLAN_EDIT_READ_REFUSED`, `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` (`plan-edit-model.cjs:240`), `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`, `PLAN_EDIT_HOST_INCOMPLETE`, `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`, `LOCAL_CLIENT_CLOSED`, **and `PLAN_EDIT_TAG_BASIS_UNPROVEN`, moved here from E4 and E6 in v3: `:217` and `:219` fire inside `createPlanEditProjector`'s own body, which `projectorFor` (`plan-edit-host.mjs:68`) runs on the FIRST read, so no review path can raise it. Same class of error as R2 B6, found by re-measuring the rows B6 made me re-read**, **and IN v4 `PLAN_EDIT_TAGS_INVALID` (`plan-edit-commands.cjs:66` from `plan-edit-model.cjs:203`), which SPIKE M1 rows 1, 5 and 7 measure as the FIRST code on EVERY installation when the F2 collaborators are absent: it is a DOOR THAT DOES NOT OPEN, not an action that refuses**, **and `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` (`plan-edit-model.cjs:101`) and `PLAN_EDIT_BASIS_HASH_INVALID` (`:104`), moved here in v4 (R3 N6): `:101` fires in the projector body before any generation is read and `:104` first fires from `basisAt` (`:302`) during the same first read, so E0 is the door they arrive at even though state X is the treatment they draw** |
| E1 Exercise list | SOURCED `Choose an exercise` and `Add exercise`; each row shows the lift's own current name, day and set count from `read().state` | none; pure render of the state E0 already read | none; a list that cannot render is E0's refusal, not its own |
| E2 Exercise actions | SOURCED `Edit exercise`, `Replace exercise`, `Remove from week` | none | none |
| E3 Edit exercise | SOURCED label helper `Changing the name keeps this exercise's records.`; the six editable fields of 2.1 with the existing setup field errors verbatim; **when `day` is one of the changes, on `PLAN_EDIT_DAY_UNCOVERED`, SOURCED from `BRIEF-EDIT-MY-WEEK.md:61`, `Choose a training day for each exercise before saving.`** | `host.review({kind:'update', ...})` on `Review change` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`plan-edit-model.cjs:321`), `PLAN_EDIT_NO_CHANGE` (`:329`, the update branch and nowhere else) and `PLAN_EDIT_DAY_UNCOVERED` (`:326` reached from `:330`) |
| E4 Replace | SOURCED `The new exercise starts without a recorded load. Your old sessions stay in your history.`; **plus E3's `PLAN_EDIT_DAY_UNCOVERED` sentence, same source, because `:345` calls `covered(row.day)` on this branch too** | `host.review({kind:'replace', ...})` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`:321`), `PLAN_EDIT_DAY_UNCOVERED` (`:326` from `:345`), `PLAN_EDIT_ID_REUSED` (`:389` in `preview()` and `:346` in `apply()`), `PLAN_EDIT_TAGS_INVALID` (`plan-edit-commands.cjs:66`), `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` (`:390`) and `PLAN_EDIT_NEW_TAG_PROJECTION_INVALID` (`:355`) |
| E5 Remove | SOURCED `This exercise will leave your week on {date}. Your old sessions stay in your history.` | `host.review({kind:'remove', exercise_id})` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`:321`) and `PLAN_EDIT_WEEK_EMPTY` (`:341`, 2.2.2). **It draws NEITHER `PLAN_EDIT_DAY_UNCOVERED` NOR `PLAN_EDIT_NO_CHANGE`: neither is reachable on this branch (v3, R2 B6)** |
| E6 Add | SOURCED `Add exercise`; **the muscle vocabulary comes from `exercise-catalogue.mjs` and NOT from `setup-model.mjs` (v4, R3 N7 answered against TODAY-SPLIT E.3): `exercise-catalogue.mjs` is ON E.3's closed MAY-IMPORT list and exports `GROUPS`, `GROUP_MG`, `REGIONS`, `REGION_MG`, `ENGINE_MG`, `CATALOGUE`, `searchByName` and `regionsOf`, which is the whole vocabulary this door needs; `setup-model.mjs` is NOT on that list and, measured by me at `ad8ced07`, `setup-model.mjs:14` imports `../../../m4/workout/athlete-state.cjs`, which E.3's module edges FAIL as `rebuild/m4/**`. So importing it would fail the fence 6.8 makes this spec's bar, and the field components are re-expressed in `edit-week-view.mjs` over the same catalogue**; **plus E3's `PLAN_EDIT_DAY_UNCOVERED` sentence, same source, `:345`** | `host.review({kind:'add', ...})` | E4's set MINUS `PLAN_EDIT_TARGET_UNAVAILABLE`: an `add` carries no `exercise_id`, so `:321`'s guard is not entered |
| E7 Unchanged draft | SOURCED `Nothing has changed yet.` | the refusal `PLAN_EDIT_NO_CHANGE` maps to this sentence; the page does not decide it locally | `PLAN_EDIT_NO_CHANGE` |
| R Review | SOURCED `Starts {date}`, `Current`, `After this change`; SOURCED actions `Save change`, `Keep editing`, `Cancel` | render of `review()`'s `current`, `before`, `after`, `starts_on` | none of its own |
| S Saving | no new copy; the existing in flight treatment. Save is disabled while in flight so one deliberate save is one operation | `host.save(review_id)` | n/a |
| V Saved, structural | SOURCED `Saved for {date}.` | shown ONLY on `{ ok:true, acknowledged:true }` | never shown on any other reply |
| V2 Saved, notes | SOURCED `Saved on this device.` | the Machine settings door's own save | as above |
| T Stale, the week really did change | SOURCED `Your week changed while this was open. Review the latest week before saving.` and the result drawn beside it from the refusal's own `current` and `starts_on` | THREE codes only: `PLAN_EDIT_REVIEW_STALE`, `PLAN_EDIT_STALE_BASIS`, `PLAN_EDIT_BASIS_INVALIDATED` (`plan-edit-model.cjs:300`, `:309`: a causal parent stopped being active, or the seen basis disagrees) | the draft survives; nothing is rebased for him |
| D Day turned | SOURCED FROM CODE, verbatim from `plan-edit-host.mjs:24`: `The day changed while this was open. Review the latest week before saving.` | `PLAN_EDIT_DAY_TURNED` (`plan-edit-host.mjs:23`) | the draft survives |
| X Durable refusal | the existing actionable refusal behaviour, unchanged; never the word Saved | `PLAN_EDIT_SAVE_OUTCOME_UNKNOWN`, `PLAN_EDIT_BATCH_MISMATCH`, `PLAN_EDIT_INTENT_CONFLICT`, `PLAN_EDIT_DUPLICATE_INTENT`, `PLAN_EDIT_REVIEW_REQUIRED`, `PLAN_EDIT_PROJECTION_REFUSED`, `PLAN_EDIT_HISTORY_UNPROVEN`, `PLAN_EDIT_ORIGIN_UNPROVEN`, `PLAN_EDIT_REJECTION_UNPROVEN`, `PLAN_EDIT_TOMBSTONE_UNPROVEN`, `PLAN_EDIT_DATE_ORDER_UNPROVEN`, `LOCAL_CLIENT_CLOSED`, and the three of 2.2.2 | the draft survives; lease, storage, integrity and closed era all land here |
| M1 Machine settings, read | SOURCED helper `Keep the settings you want to remember for this machine.` | **RE-CUT IN v4 (`E-R12`, R3 B1 (ii)): the RELEASED view calls `onWeek.machineLatest(exercise_id)`; the SEALED lane holds `createMachineSettingsHost` (`machine-settings-host.mjs:63`) and makes the `.latest` call, both of which are on TODAY-SPLIT E.3's entry point list, and returns the DRAFT. `machineSettingsView.draftFrom(latest)` (`machine-settings-view.mjs:28`) is a PURE view helper and `machine-settings-view.mjs` is on E.3's MAY-IMPORT list, so the released view keeps calling it** | the era and lease refusals the existing host already raises |
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
| `rebuild/m3/w7-preview/today/local-source-basis.mjs` | YES | SEALED BY NAME at `:536` (2) | NOT TOUCHED, zero bytes. **CHANGED IN v4 (`E-R17`, R3 B6, SPIKE M3 rows 14 and 17): the sealed lane calls the PURE half `admittedLocalSourceBasis(generation, {athleteLabel, namespace})` (`:32`, an export in its own right) over the generation THE ADOPTION GATE ALREADY LOADED, instead of `admittedLocalSourceState(setup)` (`:73-:82`), whose `:78 await repository.load()` is a second durable read. Same function, same two narrowing arguments, so `plan-edit-model.cjs:240`'s `equal(adopted, base)` still holds, which is what R3 verified and SPIKE M3 rows 8 and 9 confirm by execution** |
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
   **under 130 added sealed lines and ZERO removed**, split so a reviewer can check each part:

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
   | **total** | **about 130** |

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
5. `local-source-basis.mjs` takes NO hunk either. 3.4 exists to keep it that way.
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
4. `importAdmitted` keeps its present meaning, set from the RAW `admittedLocalSourceState` at
   `:2488` and not from anything this section adds, or the Import entry starts lying.
5. **NEW IN v4 (`E-R17`): the gate's OWN loaded generation is reachable inside it, so it can be
   passed to `openEditWeekHost` rather than re-loaded.** Measured, the gate already loads one:
   `admittedLocalSourceState` (`local-source-basis.mjs:78`) is `const loaded = await
   repository.load();`. This requirement asks TODAY-SPLIT to keep that value in a binding rather
   than to consume it inline, which is a smaller thing than it sounds and is the difference between
   two durable reads and four (SPIKE M3 (c)). **If TODAY-SPLIT cannot, STOP 9 is live again and
   the PM is asked to accept a count of 3.**

**THE HUNK, and v2's "four added lines and zero removed" is withdrawn (R2 B2 (i)).** `:2488` ends
with a semicolon, so v2's `.then` could not be appended without changing that line, and "zero
removed" was not achievable as printed. Under `:543` the point is moot in a better way: the whole
function is being MOVED by TODAY-SPLIT, so this item's hunk is not an append to a line it does not
own. It is, inside the sealed module's own adoption gate:

```
const loaded = await repository.load();            // the gate's OWN load, which already happens
const read = await (async () => {
  const host = await openEditWeekHost(loaded.generation);
  try { return await host.read(); } finally { host.close(); }
})().catch(() => null);
state = planEditedState(state, read);
```

Six added lines, one changed (the assignment), zero removed, and the `try/finally` is what makes
the `close()` unconditional. **The `catch(() => null)` belongs HERE, on the sealed side, not inside
the pure function**, because it is the durable call that can throw and the pure function is what
must be total.

**COST, RE-COUNTED BY EXECUTION AND BROUGHT BACK INSIDE THE SPEC'S OWN STOP (`E-R17`, R3 B6,
SPIKE M3 (c)).** v3 said "one extra durable reopen per adoption" and it was wrong by three. SPIKE
M3 rows 11 to 17 counted on an instrumented repository: `createPlanEditHost` 0, `host.read()` 1,
v3's `basisState` 1, v3's `setupOperation` 1, the gate's own pre-existing load 1, which is
**FOUR loads where there was ONE, and STOP 9 fires at design time.**

**THE REPAIR, which is the whole of `E-R17`: ONE DURABLE READ PER ADOPTION, and it is the one the
gate already made.** `openEditWeekHost(generation)` takes the loaded generation; `basisState` comes
from `admittedLocalSourceBasis(generation, ...)` (the pure half, 3.2's row); `setupOperation` is
dereferenced out of the SAME generation (3.6). **The count becomes 2: the gate's own load, which
existed before this item, plus the ONE `lane.reopen()` inside `readVerified`
(`plan-edit-host.mjs:148`) that no design can avoid, because the companion re-verifies its own
lane and that is the point of it.** So the extra durable act is exactly one reopen, which is what
STOP 9 permits, **and STOP 9 STANDS UNCHANGED**: the spec no longer disagrees with itself.
Adoption runs at boot (`today-app.cjs:2550`) and on `onAdmitted` (`:700`), not per frame, so this
is two reopens in a session and not a loop. EW-14 measures the count by name.

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
   EW-05, EW-08, EW-09, EW-11, EW-12, EW-13a, EW-13b, EW-13c, EW-13d, EW-14, EW-15, EW-17c, EW-18
   and EW-19**, which is every cell that opens the editor, plus EW-09 and the Machine settings
   door because 2.2's E0 serves ONE `host.read()` for BOTH doors and the athlete reaches Machine
   settings through it. **Not blocked: EW-16 (DOM and copy, over a fixed view model), EW-17a and
   EW-17b (they drive admission, not the editor, and SPIKE M4 rows 5, 6 and 7 ran them without
   any F2 wiring), and every RELEASED file of 3.3 line 1, which can be written and proved against
   frozen reply objects.** v3's sentence "EW-02, EW-03, EW-05 and the Machine settings door are
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
one of the two orderings; the remaining ordering (edit, train, re-admit) is still supported, and
`rebuild/lanes/d/import-retract/retract.test.mjs` proves retract-and-re-import exists. So this
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
athlete really did. **MEASURED: the window is real and its bound is 60 seconds** (SPIKE M7 rows 2
to 4; `intervalMs = 60000` at `today-entry.mjs:472`, re-measured by me at `ad8ced07`), **or the
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
   `kind === 'plan-mutation'` and `payload.value.profile === 'earned/plan-edit/v1'`
   (`plan-edit-commands.cjs:95-:99`), pushed as
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
   - `capture_lift` (`:613-:614`): **REWRITTEN IN v4 AS A REPLACEMENT, NOT A CONJUNCTION
     (`E-R16`, R3 B5 upheld).** v3 wrote "`state.exercises` keeps its role for the ADMITTED state,
     and the membership of the programme is asked of FOLDED", which reads as "keep `:614` AND add
     a FOLDED test", and R3 is right that the natural reading keeps the very refusal the ruling
     exists to remove. Said the way the other two rows are said:
     **`:613`'s CORRESPONDENCE RESOLUTION STAYS EXACTLY AS IT IS.** `target = liftAttach(slot.lift_lineage_id) ?? slot.lift_lineage_id`
     is how a capture's lineage id is resolved into a lift the athlete's world knows, it is what
     `state.exercises` is the resolution TARGET for, and P3-REAL-SHAPE's own comment at
     `:510-:524` is why it must not move.
     **`:614`'s MEMBERSHIP TEST IS REPLACED.** `state.exercises.filter(e => e.id === target).length !== 1`
     becomes the same one-of test asked of **FOLDED**'s exercises INSTEAD of `state.exercises`.
     Not both. A lift FOLDED does not carry on `originalDay` refuses, whether it was never in any
     programme or was retired by a `replace` before that date; a lift FOLDED does carry is
     admitted, which is precisely the `add` and `replace` case SPIKE M4 rows 8 and 9 measure
     refusing today.
     **WHY A CONJUNCTION WOULD HAVE BEEN THE WORST OUTCOME, in R3's own words and I could not
     improve on them:** it would leave EW-17c's MAIN assertion red while its CONTROL 1 passes,
     "green control, red subject, and a builder with two readings of one sentence to choose from".
   - `capture_membership` (`:695-:699`): the pool and order are compared against
     `sessionMembership(FOLDED, originalDay)` instead of
     `sessionMembership(documentProgramme.state, originalDay)`. Pool AND order, exactly and in order.

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
     other programme refusal (`:219`, `:246`, `:266`, `:321`, `:598`, `:665`, `:699`). A throw
     that carries no `PLAN_EDIT_*` code at all is NOT translated and is left to propagate, because
     translating an unknown throw would hide a defect that is not this one's.
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
selectable by its EW id. **NINETEEN cells in v4 (sixteen in v3):** the thirteen `:176` kept, plus
EW-17a, EW-17b, EW-17c, **and three the spike adds: EW-17d (4.2, the plan class replay family),
EW-18 (0.2, the day turned cell `E-R15` asks for) and EW-19 (4.2, the midnight window `E-R18`
asks for)**. **EW-13 is written as FOUR selectable parts (EW-13a, EW-13b, EW-13c and EW-13d), so
the suite carries TWENTY-TWO selectable ids over nineteen cells.**

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
| **EW-17d** | **NEW IN v4.** 4.2, one `n` only edit and NO session: admission ADMITS and raises no `LOCAL_SOURCE_EFFECT_UNMAPPED`. Controls: no edit is admitted (SPIKE M4 row 1); two edits raise it TWICE (row 4). **Red today, measured: SPIKE M4 row 2** | composed | **nothing.** It needs no capture and no F2 |
| EW-17a | 4.2, `update` that moves `sets`, asserting `capture_sets` by name, **with CONTROL 2: the PRE-edit count on a date at or after `starts_on` still refuses**. **Red today, measured: SPIKE M4 row 5, `capture_sets` on `calves`** | composed | nothing |
| EW-17b | 4.2, `remove` and `day`, asserting `capture_membership` by name, pool AND order, **with the order-only control, which SPIKE M4 row 4 measures as a REAL refusal today and not a hypothetical**. Red today: SPIKE M4 rows 6 and 7 | composed | nothing |
| EW-17c | 4.2, `add` and `replace`, asserting `capture_lift` by name, **re-written in v4 on `E-R16` as a REPLACEMENT: the main assertion is that admission ADMITS and raises no `capture_lift` issue**. Red today, measured: SPIKE M4 rows 8 and 9, naming `ew2-added-lift` and `ew2-replacement`. CONTROL 2 is marked UNMEASURED | composed | **3.5** (both kinds enter `tagsOf`) |
| EW-01 | an enrolled athlete opens BOTH doors without first run setup; read, open, cancel and no op leave operation and outbox counts unchanged; AND the 2.2.1 boundary in both directions | composed | **3.5** (SPIKE M1 rows 1, 5, 7: the door does not open without F2) |
| EW-02 | one lift's `sets` changed; every other id, field, established load and tag deep equal; existing non chip values render without coercion | composed | **3.5** (v3 said nothing; `E-R13`) |
| EW-03 | rename keeps id, load, era and notes and the historical name lookup; a new eligible session uses the new name | composed | **3.5** (v3 said nothing; `E-R13`) |
| EW-04 | replace with a duplicate label: distinct stable id survives retry and reopen; new load unknown; old sessions and records survive | composed | **3.5** |
| EW-05 | dated removal excludes the lift from future scheduling only; open and historical sessions unchanged; unrelated order survives; **asserts `PLAN_EDIT_WEEK_EMPTY` ONLY, because `covered()` is never called on the remove branch (v3, R2 B6). The day coverage assertion moves to EW-02's update-with-`day` case (state E3) and to EW-04's replace and add cases (states E4 and E6)** | composed | **3.5** (v3 said nothing; `E-R13`) |
| EW-08 | equipment values for the selected lift only; invalid, blank and out of order `steps` use the real validation; no zero, NaN or hidden default | composed | **3.5** |
| EW-09 | machine notes save through the existing coach command and appear on the same id's actual gym card; rename retains them; replacement does not inherit them; empty final note save refuses | composed | **3.5**, because the athlete reaches the Machine settings door through E0's ONE `host.read()` (3.5 consequence 3) |
| EW-11 | the actual producer, validator and projector prove identity, domain, effective date, seen basis, actor edit and causal linkage; malformed and stale basis refuse | composed | **3.5** |
| EW-12 | one deliberate save yields one durable edit intent and its complete outbox; injected pre commit failure changes neither; retry does not duplicate; lease, integrity and closed era never show Saved. **v4: the save is made by the SEALED lane through `onWeek.save`, never by a released file (`E-R12`)** | composed | **3.5** |
| EW-13a | reopen and replay reconstruct current and pending plans; preexisting history byte equivalent | composed | **3.5** |
| EW-13b | a rejected or tombstoned edit is not still applied by an editor local cache | composed | **3.5** |
| **EW-13c** | **REWRITTEN IN v4 on SPIKE M3 rows 9 and 10.** On an ADMITTED import installation, a SECOND open after one saved `update` reads and its state EQUALS the companion's own read. Control c1: the adopted value reads OK and proves nothing. Control c2: the ALREADY EDITED state refuses `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` at `:240`. **v3's version asserted `:240` against the adopted value, which is measured GREEN** | composed, THROUGH THE REAL ADOPTION CHAIN | **3.4's sealed lane AND 3.5** |
| **EW-13d** | **REWRITTEN IN v4 on SPIKE M3 rows 3 to 6.** On a FIRST RUN installation, **with `projectSetupTags` run over the basis**, a SECOND open after one saved `add` reads AND the added lift appears exactly ONCE. Controls d1 `PLAN_EDIT_TAG_BASIS_UNPROVEN` at `:217`, d2 `PLAN_EDIT_ORIGIN_UNPROVEN` at `:134`. **v3 named `PLAN_EDIT_ID_REUSED`, which is measured UNREACHABLE on this path** | composed, THROUGH THE REAL ADOPTION CHAIN | **3.4's sealed lane AND 3.5** |
| **EW-18** | **NEW IN v4 (`E-R15`, SPIKE M2 row 9).** `PLAN_EDIT_DAY_TURNED` stays raisable: a FROZEN PAGE whose `clock.today()` is YESTERDAY while the live day is D throughout refuses `PLAN_EDIT_DAY_TURNED` at `plan-edit-host.mjs:225-:226` and draws state D. Controls: (1) frozen day equals live day, nothing moves, SAVED (row 7); (2) authored on D and saved after the live day turns refuses `PLAN_EDIT_REVIEW_STALE` at `:214`, NOT DAY_TURNED (row 8), **which is the cell R3 B4 asked for and the spike measures differently**; (3) `clock.today()` wired to `liveDay` makes DAY_TURNED unreachable in every ordering (rows 10 and 11), so the cell fails if the factory ever wires them together | composed, THROUGH THE REAL HOST | **3.4's sealed lane AND 3.5** |
| **EW-19** | **NEW IN v4 (`E-R18`, R3 N9, SPIKE M7).** The midnight window, bounded: drive `watchDayRollover` (`today-entry.mjs:471`) with a fake `doc`. After local midnight and before any `check()` the standing day is YESTERDAY (row 2); a `visibilitychange` while HIDDEN does not move it (row 3); one while VISIBLE moves it and calls `reopen` once (row 4); `stop()` detaches (row 5) | model, no host | **nothing.** It drives one exported function |
| EW-14 | same page commit reaches real Today and the next eligible gym entry with the new operation basis; in progress workout and check in drafts survive; **and `planEditedState` returns a STATE on EVERY path, including `read === undefined`, `read.read === false` and a reply of an unexpected shape, so adoption can never silently stop (v3, R2 N3.2)** | composed, THROUGH THE REAL HOST | **3.4's sealed hunk AND 3.5** (v2 said 3.4 alone; R2 N3.1) |
| EW-15 | tagged lift, explicit secondary `[]`, rename, replacement and a changed catalogue prove the `:155` snapshots | model | **3.5** |
| EW-16 | DOM: both doors, the before, after and date copy, the invalid, saving, saved and refusal states, keyboard labels and focus, narrow viewport, no new shell; copy census forbids em and en dash, emoji and exclamation marks | view | C-UI-9 |

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

1. **The NINETEEN cells of section 5 under their TWENTY-TWO selectable ids** (v3 said sixteen and
   nineteen), individually selectable, green at the exact candidate head, with the red first run
   shown. A cell blocked by 3.4 or 3.5 is red with its reason named, never removed. **And in v4
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
   host, names a writer or spells a tag rule.** Three consequences the builder must be able to
   show on the fence's own printout:
   - **no `FENCE-VIEW-IMPORT`**: their import closure is `plain-copy.cjs`, `design.cjs`,
     `machine-settings-view.mjs`, `exercise-catalogue.mjs` and each other, all on E.3's closed
     MAY-IMPORT list, and NOT `setup-model.mjs` (R3 N7, 2.2's E6 row);
   - **no `FENCE-SECOND-SEALED-IMPORT`**: they import ZERO sealed modules, so the one-partner rule
     is never exercised (3.4.1);
   - **`edit-week-lane.cjs` is DECLARED PRODUCT with role `new` on the same child that lands it**,
     or under E.2 the fence treats it as free and fails it on its own contents (3.4.1). That is a
     sequencing requirement on S10, not a fence exemption.

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
- The whole suite skeleton with all NINETEEN cells written RED, against the merged companion,
  whose API is sealed and will not move under the builder.
- **EW-17d, EW-17a and EW-17b to their answer**, which SPIKE M4 rows 2, 5, 6 and 7 already
  measure as red, and section 4's fix authored by its own lane on that evidence.
- **EW-19 to green**, because it drives one exported function and needs nothing from this lane.

**`edit-week-basis.mjs` and `edit-week-tags.mjs` are NOT on this list any more, because they no
longer exist (`E-R12`, 3.4.1 and 3.5 consequence 2).** `planEditedState` is still a pure function
with pure cells, but it lives inside `edit-week-lane.cjs` and therefore waits on the sealed half
with everything else there.

None of this depends on a pixel. **It is still the real parallel work, and v4 is honest that it is
now less than half the build rather than roughly half: the two files that moved sealed were both
on v3's start-today list.**

**WHAT CANNOT GO GREEN, AND IT IS MOST OF THE SUITE (`E-R13`, R3 B2, SPIKE M1).** v1 said EW-04
and EW-15 could start; R1 B3 corrected it; v2 and v3 named THREE blocked cells. **Measured, it is
seventeen of the twenty-two ids**, because the companion refuses its FIRST READ without F2 on every
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
| **SEVENTEEN of the twenty-two ids: EW-01, EW-02, EW-03, EW-04, EW-05, EW-08, EW-09, EW-11, EW-12, EW-13a to EW-13d, EW-14, EW-15, EW-17c, EW-18** | **section 3.5's F2 package, FIRST on S10 (`E-R13`)** | **RE-SCOPED IN v4.** No `validateExerciseTags`, `projectSetupTags` or `projectNewExerciseTags` exists in product, and the FIRST READ needs the first of them on every installation (SPIKE M1 rows 1, 5, 7). v3 named four cells here; the measured answer is most of the suite |
| **The Machine settings door and EW-09** | the same | **NEW IN v4.** It needs no F2 function of its own; it is reached through E0's ONE `host.read()`, which does (3.5 consequence 3) |
| EW-14, EW-13c, EW-13d, EW-18, and the adoption compose's own cells | 3.4's SEALED LANE `edit-week-lane.cjs` plus the module TODAY-SPLIT creates | a route and a mount do not change what the gym card opens on; and under `E-R12` the compose is sealed, so its cells wait with it |
| **EW-17a, EW-17b, EW-17d** | **NOTHING. They can run the day this spec is accepted** | they drive admission over a synthetic bundle and never open the editor; SPIKE M4 rows 2, 5, 6 and 7 ran them with no F2 wiring |
| **EW-19** | **NOTHING** | it drives the exported `watchDayRollover` with a fake `doc` (SPIKE M7) |
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
   **WIDENED IN v4, now that TODAY-SPLIT v2 is readable at `906cb056` (R3 N4). FOUR specific
   things this item depends on and none of which it owns**, each a STOP if the split lands
   differently: (a) the adoption gate keeps its own LOADED GENERATION reachable (3.4.4 item 5),
   without which STOP 9 is live again; (b) E.3's re-export census after the split prints
   `createTodayModel` 2, `createTodayLanes` 2, `model` 2 and `options` 2 in `today-app.cjs`, and
   3.3 line 2a's route and mount must not disturb it; (c) the seal artifact records
   `edit-week-lane.cjs` as product with role `new`, or E.2 makes the fence treat it as free and
   fail it (3.4.1); (d) **E.3's closed MAY-IMPORT list covers `exercise-catalogue.mjs`, which it
   does today by name.** And ONE finding this item REPORTS to that lane rather than fixes:
   `setup-model.mjs` is FREE under E.2 and its own `:14` imports `rebuild/m4/**`, so it fails
   `FENCE-VIEW-IMPORT` on its own contents, independently of anything here (R3 N7, 3.2's row).
3. `plan-edit-host` as merged cannot satisfy EW-14 through the real host composition.
4. Any need to change a sealed byte, a package, a receipt, the ledger, the engine or the coach,
   beyond the hunks section 3.3 lines 2a, 2b and 7, 3.5 and 4.4 name under their own custody.
   **This now includes the WRITER-FENCE: a released file that has to call a writer is a STOP
   (6.8), never a fence exemption.**
5. Any EW-17 cell comes back in a third shape that is neither of section 4's two outcomes.
6. A taste fork on the look (`:539` (2)).
7. Any temptation to widen back to four doors. Days and Priorities are v1.1 and Days additionally
   waits on F1 and on owner question Q3.
8. ANY new copy sentence at all beyond 2.2.2.1's four, which are PROPOSED and not built until the
   PM rules (2.3 law 4).
9. **NEW in v2, AND IT STANDS UNCHANGED IN v4 (`E-R17`).** 3.4's adoption read costs more than one
   extra durable reopen per adoption, or `planEditedState` cannot return the unchanged state on
   every refusal path. Either means the composing module is doing more than composing.
   **v3 TRIPPED THIS STOP AT DESIGN TIME AND DID NOT KNOW: SPIKE M3 rows 11 to 17 count FOUR
   durable loads per adoption under v3's 3.4.2 and 3.6, where there was one.** 3.4.2, 3.4.4 and
   3.6 are re-cut so the gate's own loaded generation is passed down and the count is TWO, which
   is one extra reopen, which is what this STOP permits. **The STOP is not relaxed to fit the
   design; the design was changed to fit the STOP.** A builder measures the count (EW-14 asserts
   it) rather than assuming it.
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
    The cells are the only guard.
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
    20 lines, or `today-lanes.cjs`'s share of it exceeds about 20. The budget is what keeps this
    item out of TODAY-SPLIT's way in the week it is first written.

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
| the suite: NINETEEN cells under TWENTY-TWO ids, including the rewritten EW-13c and EW-13d, the four EW-17 with their controls, EW-18 and EW-19 | 12 to 15 | 10 to 13 | **YES, written RED.** EW-17d, EW-17a, EW-17b and EW-19 run to their answer at once; the other seventeen ids are red until F2 |
| SEALED half: `edit-week-lane.cjs` entire (`openEditWeekHost` and its ten arguments, the first run tag projection, `onWeek`, `weekFacade`, the adoption compose, `newIntentId`), `createEditWeekEntry`, and `today-lanes.cjs`'s ten lines, with their proof | 8 to 11 | 4 to 6 | NO: waits on F2, TODAY-SPLIT and S10 |
| RELEASED route and mount inside `today-app.cjs` (about six lines) | 0.5 to 1 | 0.5 to 1 | NO: waits on TODAY-SPLIT landing |
| one independent review round plus the fix round | 5 to 6 | 5 to 6 | follows the work |
| D2's separate implementation review (`:176` (2)), a SECOND obligation (`E-R8`) | 2 to 3 | 2 to 3 | follows the work |
| **EW2-BUILD total** | **33.5 to 44 hours of model time** | 30.5 to 41 | **about 18 to 23 of it can start on acceptance, and only about 3 to 4 of that can go GREEN** |

**What moved and why, so the PM is not asked to take a number on trust.** The sealed row roughly
doubled, which is `E-R12` paid in hours rather than in prose: `onWeek`, `weekFacade`, the tag
projector wiring and the adoption compose all moved there, and 3.3 line 3 prices them line by
line. The two released files that vanished did not vanish as WORK; they changed address. The suite
row grew for EW-18 and EW-19 and for the rewritten EW-13c and EW-13d controls.

**AND THE FOURTH COLUMN IS ANSWERED HONESTLY, WHICH IS WHAT `E-R13` ASKED FOR.** v3 said "about 19
to 25 of it can start on acceptance" and R3 is right that the number assumed green was reachable.
**Measured, about 18 to 23 hours of work can START, and only the four cells that need no editor
(EW-17d, EW-17a, EW-17b, EW-19, about 3 to 4 hours) can reach GREEN before F2 lands.** Everything
else in the released half is written against frozen objects and proved by its own cells; those
cells are green, but the CELLS THAT OPEN THE DOOR are red, by measurement, until F2. **The start
date does not move. What a reader may conclude from a green run on day one does.**

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
| **Q-J** | **NEW in v4 (`E-R14`).** 4.3 ruling 2a proposes THREE new `field` names for what admission reports when the fold refuses: `plan_edit_history`, `plan_edit_basis`, `plan_edit_context`. They are new vocabulary in a closed table the import screen draws. | **Seat the three, or reduce them to one (`plan_edit_fold`) and say so.** The recommendation is three, because the second and third are BUILD DEFECTS and the first is not; a reviewer reading an issue list should be able to tell them apart without reading the code. **This is the only new vocabulary v4 proposes, and it is not athlete-facing copy.** |
| **Q-K** | **NEW in v4 (`E-R13`).** The Machine settings door is blocked on F2 only because 2.2's E0 serves BOTH doors from one `host.read()`. Reaching it without that read would unblock EW-09 alone. | **Do NOT open that escape.** It makes the door chooser draw a state that is not true (one door open, one shut, from a read that refused) and it buys one cell out of seventeen. 3.5 consequence 3 records it as named and not taken. If the PM rules otherwise, 2.2's E0 row and 8.2 item 14 both change. |
| **Q-L** | **NEW in v4.** SPIKE M4 FACT 1 found a defect nobody had named: a saved plan edit refuses the whole import by itself, before any capture. 4.3 ruling 0 rules a replay family for it, priced at 2 to 3 hours in 4.4. | **This is the cheapest and most urgent of the four hunks and it is worth landing on its own, EARLY, even before the rest of section 4.** It is the only one whose absence breaks an athlete who never edits a set count. Its cell, EW-17d, needs no capture and no F2 and can run on acceptance. |

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
- **Heads.** The reading and the spike for this round were done in the PM's cloud farm mirror at
  **`ad8ced07`**, with `rebuild/d2-ew2-spec` at `99cfa911` and `rebuild/c-today-split` at
  `906cb056` synced beside it, and `rebuild/b-s9-ui-pins` read at `d859096a`. The writing, the
  commit and the push were done on the owner's PC.
- **No product, test, tooling or workflow byte moves on this branch.** This file and its reviews
  are the only things on it. Zero U+2013 and zero U+2014 in this file, and no sentence proposed by
  it carries a dash of any kind.

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

1. **EW-17c's CONTROL 2**: a capture naming the REPLACED (retired) lift on a date at or after
   `starts_on` still refuses `capture_lift`. The spike drove a capture on the MINTED lift, not on
   the retired one. Derived from `plan-edit-model.cjs:362` and `result()`'s `:376`.
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
   6.8 states what it must print; nothing has run it.

**Everything else in this file about what refuses, in what order, with which code, cites section 0
by row.**

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
