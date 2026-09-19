# P4b-1 REMEMBER AND RECALL: the author's report

Lane C, branch `rebuild/c-p4b-memory-1`, cut from `023b99f`, head `1722546`.
Author: cowork (Earned lane hand), Opus high, red first.
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

Commit `a22aa7d` contains the two cell files AND NOTHING ELSE. No memory module
existed at that commit. Measured there:

```
node --test "rebuild/coach/test/*.test.cjs"
tests 236   pass 234   fail 2
both new files: Error: Cannot find module '../memory-commands.cjs'
```

The four modules and the consumer join landed at `c50a8ac`; the DECISIONS:458
one-liner landed at `756f002` with its three P03-05 cells already committed at
`a22aa7d`, before the hunk existed; the two contracts landed at `1722546`.

## 3. The bar, with counts

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
| M-L | the compensating write's `{stored}` result is ignored again | P03-05 | RED 2/3 | GREEN 3/3 |
| M-M | the effective date is read from a clock inside the module | P39-01 | RED 0/1 | GREEN 1/1 |
| M-N | recall answers `[]` when the generation cannot be authenticated | P02-07 | RED 0/1 | GREEN 1/1 |
| M-O | invisible format characters are stripped silently on write | P12-11 | RED 0/1 | GREEN 1/1 |
| M-P | the remember tool becomes tier 0 | P02-08 | RED 0/1 | GREEN 1/1 |

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
