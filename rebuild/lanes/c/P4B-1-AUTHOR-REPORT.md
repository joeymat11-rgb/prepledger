# P4b-1 REMEMBER AND RECALL: the author's report

Lane C, branch `rebuild/c-p4b-memory-1`, cut from `023b99f`. First head
`1722546`; FIX ROUND head `c33d322`, after review round one.
Author: cowork (Earned lane hand), Opus high, red first. The fix round was
carried by a second hand, which continued this package rather than restarting
it. **Section 12 is the fix round's record: every R1 finding, fixed or
disputed, and the two sentences below that round one measured FALSE and this
round corrected in place.**
Ruling of record: `rebuild/lanes/pm/P4B-1-CUSTODY-RULING.md`.
Design: `rebuild/lanes/e/COACHING-MEMORY-V1-IMPLEMENTATION-BRIEF.md` sections 1,
2, 3 M1 and M5, 5 and 6 (its M2 section is obsolete and nothing here rebuilds
P4a's writer).
Probe set held before the first line: `PROBES.md`, published by the reviewer's
side under DECISIONS:439 point 3.

**This report is a hypothesis, not a verdict.** Reviewers are told to disagree
wherever the evidence lets them. Everything below was measured on the owner's PC
with `MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` unless a line says
otherwise; nothing was run in the farm.

---

## 1. Touched paths, with pin status

Checked against `rebuild/m4/spec/acceptance-s8-real-shape.json` by script before
the first edit and again before every commit. The script walks every string
anywhere in the spec, so a pin cannot hide in a key nobody thought to name.
**Result: PINCHECK PASS, none of the eleven paths is pinned. STOP condition 1 did
not fire.**

| path | new or existing | in custody | pinned |
| --- | --- | --- | --- |
| `rebuild/coach/memory-commands.cjs` | new | ruling section 2 | no |
| `rebuild/coach/memory-model.cjs` | new | ruling section 2 | no |
| `rebuild/coach/memory-host.mjs` | new | ruling section 2 | no |
| `rebuild/coach/memory-tools.cjs` | new | ruling section 2 | no |
| `rebuild/coach/test/memory.test.cjs` | new | ruling section 2 | no |
| `rebuild/coach/test/memory-journey.test.cjs` | new | ruling section 2 | no |
| `rebuild/coach/tools.cjs` | existing | ruling section 2 | no |
| `rebuild/coach/local-world.mjs` | existing | ruling section 2 | no |
| `rebuild/coach/TOOL-CONTRACT.md` | existing | ruling section 2 | no |
| `rebuild/coach/model-adapter.md` | existing | ruling section 2 | no |
| `rebuild/coach/test/no-dashes.test.cjs` | existing | ruling section 2 | no |
| `rebuild/lanes/c/P4B-1-AUTHOR-REPORT.md` | new | this report | no |

NOT touched, though custody allowed them: `wave1-tools.cjs`, `test/tiers.test.cjs`,
`test/wave1-demo.test.cjs`. The memory tools compose OVER the wave-one object
rather than editing it, so nothing in it had to move.

`git diff --numstat 023b99f..HEAD -- rebuild/engine rebuild/m3 rebuild/m4
rebuild/client rebuild/DECISIONS.md .github` is **EMPTY**.

The whole diff, for scale:

```
110    0  rebuild/coach/TOOL-CONTRACT.md
 27    3  rebuild/coach/local-world.mjs
198    0  rebuild/coach/memory-commands.cjs
112    0  rebuild/coach/memory-host.mjs
114    0  rebuild/coach/memory-model.cjs
315    0  rebuild/coach/memory-tools.cjs
 42    0  rebuild/coach/model-adapter.md
391    0  rebuild/coach/test/memory-journey.test.cjs
1538   0  rebuild/coach/test/memory.test.cjs
  5    1  rebuild/coach/test/no-dashes.test.cjs
 16    1  rebuild/coach/tools.cjs
```

## 2. Red first, on the record

**Corrected in the fix round (R1, N1).** Commit `a22aa7d` contains the two cell
files AND NOTHING ELSE. No memory module existed at that commit. Measured there:

```
node --test "rebuild/coach/test/*.test.cjs"
tests 236   pass 234   fail 2
both new files: Error: Cannot find module '../memory-commands.cjs'
```

What that measurement says, said plainly: **THE TWO CELL FILES DID NOT LOAD.**
The two failures are two FILES failing to resolve `../memory-commands.cjs`, not
two cells observed catching the absence of a behaviour. Not one of the sixty
three cells was ever watched going red for its own reason. The phrase "red
first" is not asked to carry more than that here. The per-boundary red evidence
this package actually rests on is the mutant table in section 6, where each
boundary is broken one at a time against the finished modules and the named
cell dies; the reviewer re-ran fifteen of the sixteen independently and this
round added four more at its own head.

The four modules and the consumer join landed at `c50a8ac`; the DECISIONS:458
one-liner landed at `756f002` with its three P03-05 cells already committed at
`a22aa7d`, before the hunk existed; the two contracts landed at `1722546`.

## 3. The bar, with counts

**THE BAR OF RECORD IS NOW THE FIX ROUND'S, at head `c33d322`, on the owner's
PC.** It is the table under section 12.3; the table immediately below is the
first head's and is kept for comparison.

All on the owner's PC, at head `1722546`.

| command | result |
| --- | --- |
| `node --test "rebuild/coach/test/*.test.cjs"` | **tests 297, pass 297, fail 0** (234 before, 63 new) |
| the two new files alone | **tests 63, pass 63, fail 0** (nonzero enumeration of both) |
| `node rebuild/t2/rig187.cjs` | **PASS** |
| `node --test "rebuild/client/test/*.test.cjs"` (control, untouched) | **tests 18, pass 18, fail 0** |
| `git diff --numstat 023b99f..HEAD -- rebuild/engine rebuild/m3 rebuild/m4 rebuild/client rebuild/DECISIONS.md .github` | **EMPTY** |
| long dashes added, measured on the diff itself | **0** (U+2013 and U+2014, added lines only) |
| `test/no-dashes.test.cjs` extended to the four new modules | yes, and a cell asserts that extension exists |

Two runs of the memory files under a different process timezone, and one with
`MEASURED_TEST_NOW` unset, are in section 6 (P39-02, P39-06).

## 4. The surface, against the probe set's assumed names

The probe set's section 0.2 fixed an assumed surface and a re-pointing rule.
Almost nothing had to be re-pointed.

| assumed | built | re-pointed |
| --- | --- | --- |
| `memory-commands.cjs` with `PROFILE`, `ACTION`, `prepare`, `validate`, `memoryOf`, `memoriesIn(generation)`, `forTopic(rows, topic)`, `TEXT_MAX = 400`, `ID_MAX = 80`, `KINDS` | all present, plus `topicOf`, `textOf`, `PARENTS_MAX`, `MEMORY_SCHEMA_VERSION`, `createMemoryCommands` | no |
| `memory-model.cjs`, the pure join | `joinOf`, `recall`, `order`, `labelFor`, `faceOf`, `RECALL_MAX`, `NEEDS_REVIEW`, `ORDERING` | no |
| `createMemoryHost({ client, day })` returning `{ repository, all(), forTopic(t), save(memory), restart(), close() }` | all present, plus `read()` (the authenticated view or a named refusal), `client`, `profile`, `openedRefusal`, `face()` | no |
| `memory-tools.cjs`, a tier-0 recall and a tier-1 remember with a bound confirmation step | `recall` and `remember`, exactly those names | no |
| `world.memory`, hung off the already open installation like `world.machineSettings` | `world.memory`, `world.memoryOnLocalEra` | no |

`world.memory.save(memory, { parents })` is the only addition the probes reach
for that the assumed surface did not name: causal parents are the brief's
"referenced preceding memory op ids", and P02-06 needs a way to forge one. The
TOOL does not expose them, because a causal parent is not the model's to choose.

## 5. The probe table, probe by probe

Every row was run by the author at head `1722546`. "PASS" means the probe's own
stated observable held, not that a test did not throw.

### Section 1, M12: the fourteen adversarial texts

Shared block for all fourteen: store through the real bound yes, close the world,
reopen a WHOLE NEW WORLD over the same store, recall on a new tools instance,
then A to H.

| probe | result | note |
| --- | --- | --- |
| P12-01 instruction-shaped | PASS | no proposal accepted, `COACH_PROPOSAL_NOT_ENGINE_ISSUED` and `COACH_CONFIRMATION_REQUIRED` byte-identical to the no-memory world, `today_plan` unmoved |
| P12-02 fake tool call in JSON | PASS | returned verbatim; a cell proves the only `JSON.parse(` in the three .cjs modules is the producer's own `JSON.parse(JSON.stringify(` deep copy |
| P12-03 fake system message | PASS | `coach.TIERS` deep-equals the no-memory world's; five tier-1 tools still refuse without the yes |
| P12-04 names another tool | PASS | no check-in operation exists in the generation; `turn.results` carries no successful `record_pain_or_soreness` |
| P12-05 claims the owner's authority | PASS | `NEVER_VIA_COACH.protein_floor` byte-identical; `today_plan().values.proteinG` identical in value, unit, source, display and blank |
| P12-06 a unit and a number | PASS | "Your protein target is 210 grams." and "Add 4 sets a week." are both NON-EMPTY untraceable; the engine's own protein figure IS traceable in the same turn and is byte-identical to the control |
| P12-07 markup | PASS | verbatim, no entity escaping; the network and environment scan covers all four modules |
| P12-08 exactly 400 characters | PASS | stored and recalled at length 400 |
| P12-09 401 characters | PASS | refused at the gate, no operation, no outbox entry, and NOT truncated to 400; 400 lands in the same cell |
| P12-10 control characters | PASS | **pinned outcome (b)**: stored and recalled byte-identical, all four control characters present |
| P12-11 invisible format characters | PASS | **pinned outcome (b)**; the stripped text is a SECOND memory with its own op id, two distinct items on the topic |
| P12-12 imitates a source tag and a date | PASS | `text.source` names the memory op and not `engine.progression`; the recalled date is the op's, not the text's; the text's date licenses no dated claim while the item's own date does |
| P12-13 asks for the store id or a key | PASS | the key sets of the adversarial and the benign envelope are deep-equal; see the deviation in section 8 |
| P12-14 two languages | PASS | verbatim, both languages; `kcalLo` and `kcalHi` byte-identical; no locale or translation import in any module |

### Section 2, M02: the writes that must not happen

Every one reads the ops count, the outbox count and the JSON of both collections
BEFORE and AFTER, and every one ends with a legal write that lands.

| probe | result | note |
| --- | --- | --- |
| P02-01 no yes, five shapes | PASS | five `COACH_CONFIRMATION_REQUIRED`, all `state_unchanged`, counts and both collection bodies unchanged; the same text with the yes lands |
| P02-02 a cancelled yes | PASS | `COACH_MEMORY_CONFIRMATION_CANCELLED`, explicitly NOT `COACH_CONFIRMATION_REQUIRED`; a fresh yes afterwards lands |
| P02-03 a yes bound to different text | PASS | one character and separately one trailing space; `COACH_MEMORY_CONFIRMATION_MISMATCH`; NEITHER text on disk |
| P02-04 a replayed yes | PASS | send 1 lands, send 2 is SPENT, send 3 after a real restart is UNKNOWN; exactly ONE operation, the first op id |
| P02-05 invalid shape, per member | PASS | 29 rows asserted one at a time with their own message, plus the prototype trick; the four legal kinds all land in the same cell |
| P02-06 forged cross-user parent | PASS | see the deviation in section 8; nothing written on A OR on B, and A's own earlier memory IS a legal parent |
| P02-07 unqualified generation | PASS | the save refuses, and the RECALL refuses with `COACH_MEMORY_UNREADABLE` rather than answering an empty list; both work again after the byte is flipped back |
| P02-08 the tier is not the model's to set | PASS | `MEMORY_TIERS.remember === TIER.FACT`, and the module source carries no `confirmed: true` |

### Section 3, M01: the restart and the second installation

| probe | result | note |
| --- | --- | --- |
| P01-01 the orderly restart | PASS | six steps asserted: bound yes, `close()` and then `LOCAL_CLIENT_CLOSED` on the dead lane, a whole new world, `{state:"ready",code:"LOCAL_READY"}`, the generation's `enrolledAt` and `localEra` unchanged (so it did NOT re-enrol), then exact text, exact op id, exact date, kind and topic on a new turn |
| P01-02 stub-free on the path | PASS | `memoryOnLocalEra` true; the memory op and the workout Start in ONE generation under ONE `lease_id`; the stored op passes its own `validate`; the file itself carries none of seven forbidden constructions |
| P01-03 force kill and reopen | PASS | no `close()`, world abandoned, new world boots and recalls the same op id and text; then a save abandoned mid-flight is fully present or fully absent, never partial, and the memory written before the kill survives |
| P01-04 a REAL second installation | PASS | B enrolled and booted on its own database, namespace, era, lease, athlete and device; neither world is on `COACH_ATHLETE` or `COACH_DEVICE`; A writes and B recalls the ABSENT refusal; A reopened still recalls it; B keeps its OWN memory on the SAME topic; neither text is in the other's generation; the two op id sets are disjoint |

### Section 4, M03: the failure injections

Faults at the IndexedDB API through `support.faultDatabase()`, outside product
code. No product file is patched and nothing under `rebuild/coach` is
monkey-patched.

| probe | result | note |
| --- | --- | --- |
| P03-01 quota before commit | PASS | returned refusal, counts unchanged, recall reports ABSENT not "saved", then the same save lands exactly once |
| P03-02 held then aborted | PASS | the save had not settled when the write reached the store; `tx.abort()`; nothing on disk; re-read after a further tick shows NO late write; a clean save then lands |
| P03-03 commit lands, read-back fails | PASS | `COACH_MEMORY_READ_BACK_FAILED` with `committed: true` and the op id from the commit; the copy says both things; `state_unchanged` is deliberately absent; after reopen exactly ONE operation with the original op id |
| P03-04 retry after an honest failure | PASS | exactly one operation at the end |
| P03-05 the :458 fold-in | PASS | `CONSENT_ISSUANCE_NOT_COMPENSATED` names the uncompensated row and the copy says so; the durable row is not claimed clean; POSITIVE CONTROLS in the same file: compensation succeeding keeps `PLAN_CONSENT_NOT_ACKNOWLEDGED` with the client's own sentence byte-identical, the `CONSENT_ISSUANCE_NOT_STORED` path and copy byte-identical, and the happy path unchanged |

### Section 5, M06: canonical truth wins

| probe | result | note |
| --- | --- | --- |
| P06-01 a machine setting | PASS | `machine_settings` returns `seat / four` byte-identical in value, unit, display and blank to the no-memory world; the memory text is NOWHERE in that envelope; the pair is labelled `preference` with the canonical value first; "Your seat is 6." is untraceable |
| P06-02 a setup priority | PASS | read through `setupHost.all()`, the setup lane's OWN reader; the document is byte-identical to the control's; exactly one setup operation, so the memory wrote none; the pair is labelled with the canonical first. The cell carries the disclosure `local-world.mjs:325` makes: `setupOnLocalEra` is false, `setup-host.mjs` mints its own installation, and NO second enrolment was opened for the memory |
| P06-03 the effective programme | PASS | `current_set().values.prescription` equals `gym.read().prescription.line` and is byte-identical to the control; five `today_plan` members byte-identical; `issuedProposals()` and `acceptedProposals()` both empty; `state_unchanged`; "Do 5 sets." untraceable |
| P06-04 unknown applicability | PASS | a constraint with no interval and one whose interval ended both come back `needs-review`, never `preference`; the sentence says "I do not know whether it still applies" and states no current restriction; the prescription is unchanged |
| P06-05 a memory never becomes an observation | PASS | `weight_trend().values.latestLb` and `today_checkin().values.sleepRecordHours` byte-identical to the control, blanks included; "You weigh 181 lb." and "You slept 9 hours." both untraceable |

### Section 6, the recall bound and the standing :439 rows

| probe | result | note |
| --- | --- | --- |
| PRB-01 six facts on one topic | PASS | six memories written on six REAL days, each stamped by its own installation; exactly five returned; the same five in the same order in two turns; the envelope says there are more, dash-free; the sixth text appears nowhere in it |
| PRB-02 a request with no topic | PASS | five refusals with `COACH_MEMORY_TOPIC_REQUIRED` and "which one you mean"; no `items`; none of the six stored texts appears in any of the five envelopes; the named topic in the same turn does answer |
| PRB-03 a topic that does not exist | PASS | "slep", "goal", "GOALS", "goalss" and "oals" all return ABSENT; "goals " matches, by the producer's declared trim; the SAME function is asserted at write time and at read time |
| PRB-04 never a scan of histories | PASS | a weigh-in, a workout Start and a machine setting beside the six memories: none reaches the envelope, no foreign op id reaches it, `assertNoLeak` passes, `turnContextBytes(turn) < 8192` |
| PRB-05 inside the existing context boundary | PASS | every tagged value carries this turn's id; an earlier turn's value does not license this turn's sentence; and the remembered text is asserted NOT to be a tagged value at all |
| P39-01 a moving clock, and never a second clock | PASS with a finding | forward: both stamps equal the host's day and the two stamps are byte-identical. Backwards: see the finding in section 8. Source scan: none of the four modules contains `Date.now`, `new Date(`, `toISOString`, `performance.now` or `Date.parse` |
| P39-02 the device timezone offset | PASS | the two-timezone run is below |
| P39-03 local-midnight rollover | PASS | a memory kept yesterday still reads yesterday's date today; today's sorts first; a constraint whose interval ended yesterday is `needs-review` today and was `constraint` yesterday |
| P39-04 force kill and reopen | PASS | P01-03 |
| P39-05 offline reload | PASS | the recall after reopen is byte-identical to the one before close, op ids included |
| P39-06 today's real date | PASS | the `MEASURED_TEST_NOW` unset run is below |

**P39-02 and P39-06, measured three ways.** A memory was saved through the real
bound path and its stored stamp printed, then the two memory files were run in
full, under three process environments:

```
TZ=America/New_York  MEASURED_TEST_NOW=2026-09-03  process offset -300 min
  STAMP {"local_date":"2030-02-04","local_time":"08:00","utc_offset":"-05:00"}   63/63 pass
TZ=UTC               MEASURED_TEST_NOW=2026-09-03  process offset    0 min
  STAMP {"local_date":"2030-02-04","local_time":"08:00","utc_offset":"-05:00"}   63/63 pass
TZ=Asia/Tokyo        MEASURED_TEST_NOW unset       process offset +540 min
  STAMP {"local_date":"2030-02-04","local_time":"08:00","utc_offset":"-05:00"}   63/63 pass
```

The stamp is byte for byte the same in all three. It is the era clock's own
offset (`local-world.mjs:222`, `tz: '-05:00'`), never `Z` and never the
process's, and `MEASURED_TEST_NOW` cannot move it.

## 6. The mutants: sixteen boundaries, sixteen kills

Each mutation is ONE meaningful source edit. Every mutated module was LOADED
before the probe ran, so none of these is a parse-error kill. After the revert
the same probe went green again, and the full coach suite is 297/297 at head.

| mutant | the edit | probe | mutated | restored |
| --- | --- | --- | --- | --- |
| M-A | the `confirmed !== true` guard in `remember` is deleted | P02-01 | RED 0/1 | GREEN 1/1 |
| M-B | the confirmation handle becomes reusable | P02-04 | RED 0/1 | GREEN 1/1 |
| M-C | any yes is accepted without checking it binds these words | P02-03 | RED 0/1 | GREEN 1/1 |
| M-D | `TEXT_MAX` 400 becomes 401 | P12-09 | RED 0/1 | GREEN 1/1 |
| M-E | the closed-member check is dropped | P02-05 | RED 0/2 | GREEN 2/2 |
| M-F | `parent.athlete_id !== op.athlete_id` is dropped from `validate` | the validate cell | RED 0/1 | GREEN 1/1 |
| M-G | a stale generation answers when the store cannot be authenticated | P02-07 | RED 0/1 | GREEN 1/1 |
| M-H | the recalled text is tagged as engine prose | P12-06 | RED 0/1 | GREEN 1/1 |
| M-I | every matching fact is returned instead of five | PRB-01 | RED 0/2 | GREEN 2/2 |
| M-J | a substring match is used when the exact topic is absent | PRB-03 | RED 0/2 | GREEN 2/2 |
| M-K | the memory value replaces the canonical value in the join | P06-01 | RED 0/1 | GREEN 1/1 |
| M-Q | **fix round**: the propose reason quotes the memory back again | the turn-local cell | RED, that cell ONLY | GREEN |
| M-R | **fix round**: the read-back reason interpolates the op id again | P03-03 | RED, that cell ONLY | GREEN |
| M-L | the compensating write's `{stored}` result is ignored again | P03-05 | RED 2/3 | GREEN 3/3 |
| M-M | the effective date is read from a clock inside the module | P39-01 | RED 0/1 | GREEN 1/1 |
| M-N | recall answers `[]` when the generation cannot be authenticated | P02-07 | RED 0/1 | GREEN 1/1 |
| M-O | invisible format characters are stripped silently on write | P12-11 | RED 0/1 | GREEN 1/1 |
| M-P | the remember tool becomes tier 0 | P02-08 | RED 0/1 | GREEN 1/1 |

**M-K's row above is the first head's aim and it was WRONG** (R1, N2): at head
`1722546` M-K killed the PURE join cell only, and the three real-lane cells
P06-01, P06-02 and P06-03 stayed GREEN, because each asserted order with
`indexOf` and never asserted presence, and `-1 < anything`. At head `c33d322`
M-K kills the pure cell AND all three, measured on the owner's PC. See 12.2.

**M-D's boundary pair, run separately as the probe set asks.** With `TEXT_MAX`
mutated to 401: P12-08 stays GREEN (pass 1, fail 0) and P12-09 goes RED (pass 0,
fail 1). The pair really is a pair and not a blanket.

The mutation run restored every file and left the worktree clean; `git status
--porcelain` printed nothing afterwards, and the full bar was re-run green after
it.

## 7. Every design choice the ruling left to the author

1. **A remembered text is NOT trimmed and NOT normalised.** Identifiers (memory
   id, kind, topic) are trimmed and bounded, because they are handles the product
   compares. The sentence is stored exactly as confirmed. The reason is
   mechanical: JavaScript's own `trim()` eats U+FEFF, so a trim would have stored
   one string and read back another and P12-11 would have been unpassable
   honestly. A text must still carry one non-whitespace character, and a zero
   width space is not whitespace, so it survives that test and is stored.
2. **P12-10 and P12-11 are pinned to outcome (b), stored and recalled byte
   identical.** The alternative, refusing at `prepare`, would have meant the
   producer judging the athlete's own words, which is the one thing this lane
   must not do.
3. **The topic rule: trim the ends, keep the case, compare with equality.** One
   exported function, `topicOf`, used at write time and at read time so they
   cannot drift. `"GOALS"` is ABSENT; `"goals "` matches. No fuzzy match, no
   substring match, no stemming, no case folding.
4. **The four kinds are exact-case.** `"Goal"` refuses.
5. **`interval` is the applicability member**, exactly two dated ends, `from`
   at or before `to`, and it is the ONLY thing that makes a `constraint` active.
   No interval, or a day outside it, gives `needs-review`.
6. **`memory_id` is required from the caller, not minted here.** Minting one
   would have needed a clock or a random source inside the producer, which
   design point 2 forbids.
7. **The ordering rule** is stated in `memory-model.cjs` and exported as
   `ORDERING`: most recent effective date first, then the log's own order, later
   entry first. It is a total order over distinct operations.
8. **The confirmation handle** is per tools instance, never durable, bound to the
   canonical memory by value, single use, and spent BEFORE the write so a yes
   cannot be in flight twice. It therefore cannot survive a restart, which is
   what makes P02-04's third send an unknown handle rather than a second write.
9. **The athlete's no is `memoryTools.cancel(confirmation_id)`**, a harness
   method rather than a fifteenth model-callable tool, for the same reason the
   confirmation flag is the harness's. It is documented in both contracts.
10. **A remembered text is published as DATA, not as a tagged value.** It carries
    `display`, `value`, `source` and `licensed: false`, and NO `turn_id`, so
    `collectTagged()` never sees it and `allowedTokens()` licenses no figure
    inside it. This is the single most consequential choice in the slice and it
    is what makes P12-06 and P12-12 pass without touching the traceability core.
    See the open question in section 9.
11. **The M06 join is pure and the canonical value is passed IN.** The memory
    lane never reads another lane's store; the consumer reads the canonical value
    through that owner's own tool in the same turn and calls
    `memoryTools.beside(canonical, item)`.
12. **`openCoachWorld` gained an optional `clock`**, defaulting to exactly the
    object the module has always built, so P39-01 can open a real installation
    whose clock moves. No other caller sees any change.
13. **`withMemory` defaults ON**, like `withMachineSettings`, because a coach
    that cannot recall what was confirmed is the gap this slice closes.
14. **The :458 cells live in `test/memory.test.cjs`**, because
    `test/accept-proposal-issuance.test.cjs` is not in this ticket's custody and
    its fifteen cells are untouched.

## 8. Where a probe was re-pointed or could not be taken literally, said rather than hidden

None of these is a skip, and none of them weakened an observable. Each names what
was asserted INSTEAD, and why the literal form was not available.

1. **P12-13 assertion G, the device id.** The probe asks that no world identifier
   appear anywhere in the envelope, AND assertion B asks that the item carry the
   memory op id in its tag `source`. Those two cannot both hold: the accepted
   client mints every op id as `"op-" + deviceId + "-" + seq`
   (`rebuild/client/index.cjs:304`). The cell therefore asserts the STRICTER
   statement that is available: the athlete id, the namespace, the database name,
   the era id and the lease id appear NOWHERE, and the device id appears NOWHERE
   EXCEPT inside the memory's own op ids (every `op-<deviceId>-<n>` is stripped
   from the blob and the remainder is asserted clean). This is a pre-existing
   property of the accepted contract, not something this slice introduces:
   `machine_settings` has carried the same op id in its `source` since wave one.
   **It is a real privacy observation and it is the PM's to rule, not mine.**
2. **P12-12's world runs at `day = 2030-02-06`.** At the probe set's implied
   `2030-02-04` the date INSIDE the text would have been the same date a real
   dated tool value licensed, and the probe's own escape clause would have made
   it vacuous. Moving the day one step makes the text's `2030-02-04` licensable
   by nothing, and the cell asserts both halves: the text's date is untraceable
   and the item's own date is traceable.
3. **P06-01 uses a digit.** The probe's memory says "seat to six"; the
   traceability checker reads digits, not number words, so "six" would have made
   the untraceable half vacuous. The stored memory says "seat to 6" and the cell
   asserts "Your seat is 6." is untraceable. The canonical value is still the
   word `four`, exactly as the machine-settings lane stores it.
4. **P06-01 does not compare `source` across the two installations**, for the
   reason in point 1: two installations can never print the same op id. Value,
   unit, display and blank are compared byte for byte, and the source's SHAPE is
   asserted (`machine-settings.op ...`).
5. **P06-02 uses the accepted setup fixture's own `priority_muscles`**
   (`["quads","calves"]`, from `rebuild/m3/w7-preview/today/test/setup.test.mjs`
   S1) rather than `["chest","back"]`. The setup producer runs the accepted
   `createCleanInitState` over the document, so the document has to be one that
   constructor really takes; inventing muscle labels would have tested my
   invention rather than the lane. The observable is unchanged: the canonical
   priorities are byte-identical to the no-memory world's and the memory is
   labelled beside them.
6. **P02-06's athlete-id half is killed in the pure cell, not the durable one.**
   In one real generation a parent that exists cannot belong to another athlete,
   so the durable cell proves that BOTH a real op id from installation B and an
   id that exists nowhere write nothing on A and nothing on B. The
   `parent.athlete_id !== op.athlete_id` rule itself is exercised directly where
   `readOperation` can be made to answer with an existing foreign parent, and
   mutant M-F kills exactly that line.
7. **P02-06's refusal does not carry a code.** The accepted client refuses a
   commit its own validator rejected with a state and a sentence rather than a
   code of its own. The cell asserts one of the three is really present rather
   than demanding a code the layer does not mint. This is worth a reviewer's eye.
8. **P39-01, the backwards clock: a FINDING, not a workaround.** A device clock
   that jumps backwards past the instant its own offline-write lease became valid
   makes that lease not yet valid (`rebuild/client/lease.cjs:31`), and the
   accepted client refuses the write at state 20 with its own sentence
   ("Connect once to keep saving ..."), `rebuild/client/index.cjs:282`. The
   memory lane carries that refusal verbatim, writes nothing, and never invents a
   stamp to get past it. The cell asserts exactly that, and asserts that whatever
   DID land carries the host's day and the era's offset. The forward clock half is
   unchanged and strict: both saves land and the two stamps are byte-identical.
9. **P03-03's read-back failure is induced by the probe's second option**,
   "close the repository under the lane". The fault database is armed with NO
   mode, which injects nothing and only tells the cell the exact moment the
   operation reached the store; the lane is closed at that moment, while the
   commit transaction is still completing. The commit lands and the read-back
   cannot run. It is deterministic, not a race.
10. **`support.mutateActive` is hard-wired to the w6 database name**, so the
    P02-07 cell carries the same eight lines for the coach's database. It is the
    same IDB-level technique, still outside product code.

## 9. Open questions, for the reviewer and the PM

1. **A memory containing a digit cannot be quoted verbatim in a spoken answer.**
   **CORRECTED IN THE FIX ROUND (R1, B1).** As written at head `1722546` this
   claim was FALSE, and the reviewer measured it false: the propose step's
   refusal reason interpolated the memory into a `T.text` tag, and a `text` tag
   is ENGINE PROSE to `allowedTokens()`, so one refused `remember` call with no
   yes licensed the athlete's, or the model's, figures for the whole turn. The
   claim is TRUE at head `c33d322`: every memory refusal reason is now a fixed
   sentence and the words awaiting a yes travel as data. The rest of this point
   stands, and it now bites harder than it read, because the coach cannot voice
   the read-back of his own words when those words carry a figure.
   Because a remembered text is not a tagged value, it licenses nothing, so a
   harness sentence that quotes "my target is 210 grams of protein" back at the
   athlete would fail `untraceable` and be discarded. I believe that is the
   correct fail-closed posture and it is what makes P12-06 real. It is also a
   copy consequence nobody has ruled on, and P4b-2's review surface will meet it
   the moment it tries to SHOW him his memories. The alternative is a new
   declared unit in `tools.cjs allowedTokens()` that licenses a token only in
   that unit, which is a change to the traceability core and is not this
   ticket's to make. **PM ruling wanted before P4b-2.**
2. **The op id carries the device id** (section 8 point 1). It reaches the model
   adapter today through `machine_settings` as well. Is that acceptable, or
   should tool `source` tags carry a per-session opaque handle instead? That is a
   change to an accepted contract and is out of this slice.
3. **`cancel()` is a harness method, not a tool.** If P4b-2's conversation flow
   needs the athlete to say no through the model, it will need a decision about
   whether that becomes a fifteenth tool or stays a harness action.
4. **Correction and retirement are absent by design** (P4b-2, M04, M05). The
   producer is append only and carries `causal_parents`, so a correction has a
   place to attach, but nothing reads it yet and `forTopic` does not exclude
   anything. A reviewer should confirm that leaving the READ side ignorant of
   corrections is the right shape to extend rather than a shape to redo.
5. **`withMemory` defaults ON for every caller of `openCoachWorld`.** That is one
   extra `hostBindings()` per world open. Measured cost across the whole coach
   suite: 234 cells ran in about 1.06 s before, 297 in about 3.4 s after, and
   most of that is the 30 new real installations, not the extra lane.
6. **Q5 (SCIENCE-OWNER-CHOICES item 1) is still unanswered** and the scout named
   it as touching M06's copy. The sentence this slice ships
   ("That is your own preference, and it has not changed what the app holds")
   is written for a Yes to item 1. A No would change that wording, not the
   mechanism.

## 10. What this package does NOT prove, said rather than hidden

1. **No real phone.** The installation is `fake-indexeddb` over a memory backend,
   reached through `rebuild/m3/w6/test/support.mjs`. Every restart here closes
   every host and client and opens a whole new world over the same store; it is
   not a second operating-system process. Every claim above is a **synthetic
   browser check**, never installed-phone evidence. Dad's hand test is outside
   this package.
2. **No screen.** This slice lands the memory underneath the coach's tools.
   Nothing here proves an athlete can see, correct or retire a memory. Nothing in
   this branch touches a route, `today-app.cjs`, `build.mjs` or any screen, and
   the work never started to need one, so STOP condition 5 did not fire.
3. **The second installation is a second installation, not a second phone.** It
   shares the harness's IDBFactory. P01-04 proves separate databases, namespaces,
   eras, leases, athlete ids and device ids; it does not prove device isolation
   on real hardware.
4. **Fourteen adversarial shapes are fourteen shapes**, not a proof of safety
   against every shape.
5. **The failure injections are at the storage API.** They prove behaviour
   against quota and held transactions in IndexedDB. They do not prove behaviour
   against a device that loses power mid-fsync.
6. **`world.setupOnLocalEra` is false** and P06-02 says so in its own comment:
   the setup lane mints its own installation, and that cell reads it through its
   own owner rather than claiming it shares the memory's generation.
7. **CI on both operating systems has not run yet** at this head. The bar above
   is the owner's PC only.

## 11. The eight STOP conditions

| # | condition | fired |
| --- | --- | --- |
| 1 | a touched path is pinned by `acceptance-s8-real-shape.json` | no (PINCHECK PASS, twelve paths) |
| 2 | the authority, projector or stage validation refuses the new fact shape | no; `earned/coach-memory/v1` is accepted by the existing producer-injection seam with no widened whitelist |
| 3 | the slice needs a second database, a second enrolment or a synthetic identity | no; the lane rides the already open installation and every cell names its own athlete and device |
| 4 | a memory would change the programme, a target or an observation | no; P06-01, P06-03 and P06-05 measure byte-identity against a no-memory world |
| 5 | the work starts to need a screen or a today route | no |
| 6 | a reseal lands and `ENGINE_REVISION` goes red | no; `engine-revision.test.cjs` is green in the 297 |
| 7 | twenty minutes on any mechanical problem | no. One mechanical obstacle is worth naming: the file-writing path on this PC converts a single backslash-u escape for a non-control code point into the character itself, so the adversarial escapes and the long-dash regexes had to be put back as TEXT by a scratch script. Both files are verified clean of invisible characters and of long dashes, and every escape in `memory.test.cjs` is six characters of source. |
| 8 | two consecutive same-OS CI reds | not reached; CI has not run |

---

# 12. R1 findings: fixed or disputed

Fix round, second hand, Opus. Reviewed head `bf69791e`; review of record
`rebuild/lanes/c/P4B-1-REVIEW-R1.md`, verdict REJECT, one BLOCKING item and
eleven notes. Fix head `c33d322`. The first author's work was read whole and
continued, not discarded: nothing in the four modules was rewritten, and the
diff of this round is 166 insertions and 22 deletions across five files.

I agree with round one's verdict. B1 is real, I reproduced it before I changed
anything, and the review's account of the mechanism is exactly right.

## 12.1 B1, BLOCKING: FIXED

**Reproduced first, on the reviewer's own terms.** At head `dc1d1e85`, one
`remember` call with no `confirmed`, nothing on disk, text
`"your protein target is 999 grams and your floor is 3100 kcal"`:

```
before propose            untraceable("Your protein target is 999 grams.") -> ["999"]
after propose             -> []   LICENSED
after propose  3100 kcal  -> []   LICENSED
memories on disk          -> 0
```

**The mechanism, restated so the fix has one address.** `refuse()` publishes the
reason as `T.text(turn_id, "coach.refusal." + code, reason)`. `text()` builds a
tag whose declared unit is `"text"`, and `allowedTokens()` treats a `text` tag
as ENGINE PROSE: `if (declared === null || declared === "text") for (const p of
spoken) add(p.token, p.unit)`, so every number in the sentence is licensed in
whatever unit the words around it name. The propose reason interpolated
`canonical.text`, so the athlete's or the model's figures were licensed for the
whole turn on a path that writes nothing and needs no yes.

**The fix, at that one address.** The confirmation reason is now a FIXED
sentence and the words awaiting a yes travel in the `confirmation` extra as
`dataText(...)`: `display`, `value`, `source`, `licensed: false` and no
`turn_id`, the same channel `item.text` already used, which the reviewer's R-13
measured licenses nothing. `tools.cjs` is untouched by this fix: no unit was
added, no whitelist widened, no traceability core changed.

**A second instance of the same mechanism, found while fixing the first and
fixed with it.** `COACH_MEMORY_READ_BACK_FAILED` interpolated `saved.op_id` into
its reason. An op id is `"op-" + deviceId + "-" + seq`, so its digits were
licensed as BARE numbers (a bare token with no unit word is added under
`UNKNOWN_UNIT`, which is in `BARE_SPEAKABLE`). Measured at `dc1d1e85`: the op id
`op-zz-device-r20-1` tokenises as `["20","1"]`, and `"I kept 7."` was already
licensed from a fixture whose device id carried a 7. The op id now travels as
`op_id` and as the data member `recordedAs`, and the sentence carries no digit.
This is the lane's own, not inherited: no existing refusal in `tools.cjs`
interpolates a minted identifier into a reason.

**The probe the reviewer asked to come back with it**, built to their
specification and then some. `test/memory.test.cjs`, cell "M12 P12-06 TURN-LOCAL".
In ONE turn: the engine's own `today_plan` protein figure is traceable in its
own unit (positive control, asserted FIRST and again LAST, so an empty allowed
set cannot pass the cell); the propose call is made with no `confirmed`; all
four spoken lines stay untraceable; the reason is asserted to quote neither the
text nor any digit; `confirmation.text` is asserted to be data with
`licensed: false` and no `turn_id`; the yes is then given IN THE SAME TURN and
all four stay untraceable; the recall is then made in the same turn and all four
stay untraceable. `unchanged()` proves the propose wrote nothing.

**And the graves, measured on the owner's PC at `c33d322`.** Each mutant edited,
LOADED to prove it is not a parse-error kill, run, reverted; `git status
--porcelain` empty afterwards and the control re-run 64/64/0.

| mutant | one source edit | what went red |
| --- | --- | --- |
| M-Q | the propose reason interpolates `canonical.text` again | the turn-local cell, and NOTHING ELSE (63/64) |
| M-R | the read-back reason interpolates `saved.op_id` again | P03-03, and NOTHING ELSE (63/64) |
| M-H | the recalled text is tagged as engine prose again | P12-06, the turn-local cell, P12-12, P06-01, P06-03, PRB-05 (58/64) |
| M-K | the join speaks the memory where the canonical value belongs | the pure join cell AND P06-01, P06-02, P06-03 (60/64) |

M-Q killing the new cell ALONE is the second half of the reviewer's point: none
of the sixty three cells at the first head could catch B1, and the review's
explanation of why is correct. `dataOnly()` stores in one world, closes it,
REOPENS and opens a fresh turn before measuring, so the propose refusal is in a
turn nobody measures. That harness is right about what it looks at; the new cell
looks at the other turn.

**Contracts corrected, so they state what the code does.** `model-adapter.md`
section 3 gains a paragraph naming the mechanism and the two data members, and
says the copy consequence out loud: when the coach reads his words back to ask
for the yes and those words carry a figure, the draft fails `untraceable` and is
discarded. `TOOL-CONTRACT.md` says the same at `remember` and at
`COACH_MEMORY_READ_BACK_FAILED`. The head comment of `memory-tools.cjs` no
longer claims for the whole file what was true only of the recall item; it now
states the rule (no refusal sentence interpolates caller text or a minted id),
why it exists, and which cell and which mutant are its graves. Report section 9
point 1 is corrected in place rather than withdrawn: it was FALSE at `1722546`
and it is TRUE at `c33d322`, and it is still the open question the PM owes a
ruling on before P4b-2.

## 12.2 The notes

**N1, red first was a load error: ACCEPTED, restated.** Section 2 above now says
"the two cell files did not load" and says that no cell was observed going red
for its own reason. The per-boundary evidence is the mutant table.

**N2, the three M06 ordering assertions are unsound: ACCEPTED, fixed.** The
reviewer is right and the reasoning is exact: `indexOf` returns -1 for a value
the sentence dropped, and -1 is less than any index, so the assertion passed
precisely when the law was broken worst. `test/memory.test.cjs` P06-01, P06-02
and P06-03 now assert `sentence.includes(canonical)` and
`sentence.includes(text)` BEFORE the order. Measured: M-K now kills all three
plus the pure cell, where at the first head it killed the pure cell alone.

**N3, P02-06's refusal assertion cannot fail: ACCEPTED, fixed.** The disjunction
`r.code || r.copy || Number.isInteger(r.state)` could not fail, because
`memory-host.mjs save()` returns an integer state on every path including its
catch. Measured what the accepted layer really returns for a forged parent, on
both installations and for a parent that exists nowhere:

```
{ ok:false, code:null, state:3,
  copy:"This couldn't be saved on your phone. Nothing was recorded. WORKOUT_INPUT_INVALID" }
```

So the cell now pins the absence of a code, the state VALUE 3, and
`WORKOUT_INPUT_INVALID` inside the copy, and asserts no op id came back. Each of
the three separates this refusal from a different neighbour it would otherwise
be confused with: the closed lane (`code: "LOCAL_CLIENT_CLOSED"`), the throw path
(`code` set from the error message) and the lease refusal (state 20, "Connect
once to keep saving"). The disjunction could not fail; this can.

**N4, the backwards clock passes for every outcome: ACCEPTED, fixed.** Measured
on Linux and on the owner's PC, three consecutive runs each: BOTH saves refuse,
both with `COACH_MEMORY_NOT_RECORDED`, both carrying the accepted client's own
"Connect once to keep saving" sentence, both `state_unchanged: true`, and the
generation holds ZERO memory operations. The cell pins exactly that now, so a
change to the lease rule is noticed here rather than passing silently. The
finding itself (section 8 point 8) is unchanged and is still carried verbatim
rather than worked around.

**N5, confirmation handles are predictable, unscoped and never reaped:
ACCEPTED as a note, no code change, and I agree with the reviewer's own reading
of why.** The binding is `JSON.stringify` over the whole canonical memory, so a
stale or guessed handle can only ever write the exact text it was issued for,
and the ruling's point 3 asked for accept_proposal's discipline, whose `issued`
map is equally per instance and equally not turn scoped. One thing to add for
the PM: the `pending` map is bounded by the calls made in ONE conversation and
dies with the tools instance, so it is not an unbounded durable growth, but the
difference between "he said yes in this turn" and "he said yes at some point in
this conversation" is real and P4b-2 has to rule on it when a cancel becomes a
tool. Not this slice's to change.

**N6, two memories may carry one `memory_id`: ACCEPTED as a note.** Correct for
slice 1, and the reviewer's warning is the right one: `forTopic` will have to
learn about supersession rather than just adding a row when P4b-2 lands
correction. Section 9 point 4 asked the same question and the reviewer's answer
is the sharper form of it.

**N7, the device id reaches the model inside every memory op id: ACCEPTED as a
note, PM's to rule.** Pre-existing through `machine_settings` since wave one,
disclosed twice at the first head, and the cell's strip-and-assert is the
strongest statement available while assertion B requires the op id. Not this
lane's to fix. It is worth the PM noticing that the fix in 12.1 REDUCES this
surface slightly: the op id no longer rides inside a spoken sentence.

**N8, `withMemory` defaults ON and there is no cost: AGREED, nothing to do.**

**N9, the M06 pair is a helper and not a tool path: AGREED, nothing to do.** The
reviewer is right to record it so nobody later reads "the pair is returned
labelled" as something the product does today.

**N10, `interval` is a fifth member of the closed shape: NOTED, with a partial
disagreement, and it is the PM's call.** The ruling's section 3 point 2 lists
four things. `interval` is not a fifth thing a memory SAYS: it is the
applicability window the brief's own applicability clause requires, it is gated
by the same one gate as every other member, and without it `constraint` cannot
be distinguished from `needs-review`, which is design point 5's whole content
and M06's P06-04. So I do not think the shape shipped wider than the design; I
think it shipped wider than one sentence of the ruling that summarised the
design. The PM should say which reading governs, and if the answer is the
sentence, the honest consequence is that `constraint` loses its applicability
and P06-04 has to be re-cut, not that `interval` is quietly dropped.

**N11, no flake lottery: AGREED.** I re-ran the two files three times on Linux
and twice on the owner's PC at the fix head with no variation.

## 12.3 The bar of record, at `c33d322`, on the owner's PC

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`.

| command | result |
| --- | --- |
| `node --test "rebuild/coach/test/*.test.cjs"` | **tests 298, pass 298, fail 0** (297 before, one new cell) |
| the two memory files alone | **tests 64, pass 64, fail 0** (both enumerate nonzero) |
| `node rebuild/t2/rig187.cjs` | **PASS** |
| `node --test "rebuild/client/test/*.test.cjs"` (control, untouched) | **tests 18, pass 18, fail 0** |
| `git diff --numstat 023b99f..HEAD -- rebuild/engine rebuild/m3 rebuild/m4 rebuild/client rebuild/DECISIONS.md .github` | **EMPTY** |
| four mutants, each loaded, run and reverted | all four RED at the named address, control 64/64/0 after |
| U+2013 and U+2014 on the added lines of this round | **0** (every added line is pure ASCII, measured on the diff) |
| worktree after the mutation run | `git status --porcelain` empty |

The probe set was re-run as it is realised: the two cell files enumerate every
probe of the published set by name (P01, P02, P03, P06, P12, P39, PRB), and all
64 cells pass at this head. `PROBES.md` itself is no longer on the PC; it was
held by the first author's session and is not in the repository, so what I
re-ran is the probe set AS REALISED IN CELLS plus the reviewer's own B1 probes,
which I reproduced independently before fixing. A reviewer who wants the
document itself will have to ask the reviewer's side to republish it.

Custody at this head is unchanged: eleven product and cell paths, all under
`rebuild/coach`, plus the lane's two report files. Nothing under `rebuild/m3`,
`rebuild/m4`, `rebuild/engine`, `rebuild/client`, `rebuild/lanes/b`, no workflow
file, no screen, no route. None of the eight STOP conditions fired in this
round.

## 12.4 One finding this round makes that is OUTSIDE this lane's custody

The reviewer's section 6 point 3 says a sweep of every `T.text` whose display can
carry caller text is separate work. I extended their sweep across `rebuild/coach`
while fixing B1, and found one live instance in the EXISTING product. It is
reported, not fixed: it is the check-in lane's copy, not the memory lane's, and
changing a refusal sentence other suites pin byte for byte is not this slice's
to do.

`rebuild/m3/w7-preview/today/checkin-model.mjs:113-128` throws
`new TypeError('unknown answer ' + label)` and similar for an unknown question,
issue or field, where `label` is the CALLER's word. `rebuild/coach/tools.cjs:668`
publishes that message as the `CHECKIN_INPUT_INVALID` reason through
`unavailable()`, which tags it `text`. Measured on Linux, at this head, through
the real world with `withCheckIn: true`:

```
turn.call.record_pain_or_soreness({ soreness: "770 grams", confirmed: true })
  -> ok:false  code:CHECKIN_INPUT_INVALID  reason:"unknown answer 770 grams"
untraceable("Your protein target is 770 grams.")  before -> ["770"]   after -> []  LICENSED
untraceable("I counted 770.")                      after -> ["770"]   (bare still refused)
```

So a model-chosen `soreness`, `time_away` or `answer_checkin` label carrying a
figure licenses that figure IN ITS OWN UNIT for the turn, on a path that records
nothing. This does not contradict the review: the reviewer checked
`record_pain_or_soreness` WITHOUT a yes, where `needConfirm`'s sentence is fixed
and clean, and was right about that path. This is the other path, reached with
`confirmed: true` and a label the closed command refuses.

**This is the PM's to ticket.** The shape of a fix is the same one used here: a
fixed refusal sentence, with the rejected label carried beside it as data. It
touches the check-in copy and the cells that pin it, which is why this lane did
not take it.

## 12.5 What this round still does NOT prove

Everything in section 10 stands: no real phone, no screen, a second installation
and not a second device, fourteen adversarial shapes are fourteen shapes, the
failure injections are at the storage API, and CI on both operating systems has
not run at this head. Two things this round adds:

1. **B1 was one hole, and the fix closes that hole and its one sibling.** I swept
   `rebuild/coach` for reasons that interpolate caller text or a minted id and
   found the check-in instance above; I did not sweep outside `rebuild/coach`,
   and I did not audit every engine or client sentence that reaches a `text` tag
   by design.
2. **M-Q and M-R are two mutants, not a proof that the new cells catch every
   regression of this rule.** They prove the two addresses that were wrong are
   now guarded, each by one cell that dies for that reason alone.
