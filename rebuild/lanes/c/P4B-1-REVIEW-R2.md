# P4b-1 REMEMBER AND RECALL: the independent reviewer's ROUND TWO

Reviewer: cowork (Earned lane hand), Opus, security minded, told to disagree.
A different hand from round one and from the fix round.
Branch `rebuild/c-p4b-memory-1`, head reviewed
`f3dadfe7cc528edb63ef45d4ed2a931243f2001b`, cut from `023b99f`.
Round one of record: `rebuild/lanes/c/P4B-1-REVIEW-R1.md` (REJECT, one blocking
item, eleven notes). Fix round: `c33d3228` (code and cells) and `f3dadfe7`
(the report's section 12). Ruling of record
`rebuild/lanes/pm/P4B-1-CUSTODY-RULING.md`; bar rows M01, M02, M03, M06 and M12
of `rebuild/lanes/e/COACHING-MEMORY-V1-IMPLEMENTATION-BRIEF.md` section 5.

Method: I read the whole diff `023b99f..f3dadfe7` in the cloud reading room and
formed a view before opening review R1 or the author's report. I then re-ran the
whole bar on the owner's PC at the exact head, ran my own probe set in two
detached scratch worktrees of my own under `%TEMP%` (both removed, both clean
before removal), reproduced R1's B1 myself at the PRE-FIX head `bf69791e` and
watched my own probe go from RED there to GREEN at `f3dadfe7`, and re-ran eight
mutants including the fix round's two new ones. Every number below I measured.

## VERDICT: ACCEPT WITH NOTES

No BLOCKING item. B1 is really fixed, at the address round one named, and the
fix round found and closed a second instance of the same mechanism that round
one did not see. Every one of round one's eleven notes is FIXED, correctly
deferred, or disputed on grounds I agree with. The suite went 297 to 298 and
nothing regressed on either operating system.

I found no new hole in the memory lane's safety properties. What I did find are
two bounds the slice does not hold as its own design point words them, and one
dead line in `memory-tools.cjs` that still carries the exact mechanism B1 was.
None of the three changes what the slice is safe to ship as slice 1; all three
need the PM's eye before P4b-2 adds a screen and a second memory tool.

---

## 1. What I re-ran, and what it says

All on the owner's PC at `f3dadfe7`, with `MEASURED_TEST_NOW=2026-09-03` and
`TZ=America/New_York` unless a row says otherwise.

| command | result |
| --- | --- |
| `node --test "rebuild/coach/test/*.test.cjs"` | tests 298, pass 298, fail 0 |
| the two memory files alone | tests 64, pass 64, fail 0 (both enumerate nonzero) |
| the two memory files under `TZ=UTC` | tests 64, pass 64, fail 0 |
| the two memory files with `MEASURED_TEST_NOW` unset | tests 64, pass 64, fail 0 |
| `node rebuild/t2/rig187.cjs` | PASS |
| `git diff --numstat 023b99f..HEAD -- rebuild/engine rebuild/m3 rebuild/m4 rebuild/client rebuild/DECISIONS.md .github` | EMPTY |
| the whole coach suite on LINUX at the same head (reading room) | tests 298, pass 298, fail 0 |
| eight mutants, each loaded, run and reverted by me | every one LOADS, every one RED at the named address, control 64/64/0 after |
| `git status --porcelain` in both my scratch worktrees before removal | EMPTY |

Custody at this head, from the full numstat: thirteen paths, eleven under
`rebuild/coach` plus the lane's own two report files. `rebuild/m3`, `rebuild/m4`,
`rebuild/engine`, `rebuild/client`, `rebuild/DECISIONS.md` and `.github` are all
empty in the numstat, so no stage whitelist was widened and no workflow moved.
No screen, no route. STOP conditions 1 to 8: I found none fired.

**Two operating systems agree at this head.** 298/298/0 on Windows and
298/298/0 on Linux. GitHub CI at this head is still the PM's evidence to collect.

---

## 2. Round one's findings, one by one

### B1, the blocking item: FIXED, and I proved it red first myself

I did not take the fix round's word for it. I wrote my own version of the probe
round one asked for (R2-01 below), put it in a detached worktree at the PRE-FIX
head `bf69791e`, and ran it there before running it at the head.

At `bf69791e`, one `remember` call with no `confirmed`, nothing on disk, text
`"your protein target is 999 grams and your floor is 3100 kcal"`:

```
R2-01 control engine protein 155 traceable: []
R2-01 before [["999"],["3100"],["999"],["3100"]]
R2-01 after  [[],[],["999"],["3100"]]                 <- LICENSED
R2-01 reason "I have not kept that yet. Say yes and I will keep it in these
              words: your protein target is 999 grams and your floor is 3100 kcal"
R2-01 ops on disk 0
```

At `f3dadfe7`, the same probe, the same world, the same text:

```
R2-01 before    [["999"],["3100"],["999"],["3100"]]
R2-01 after     [["999"],["3100"],["999"],["3100"]]
R2-01 after yes [["999"],["3100"],["999"],["3100"]]
R2-01 reason "I have not kept that yet. Your own words are in this result beside
              the yes I am asking for: say yes and I will keep them exactly as
              they are."
```

The engine's own protein figure (155) is traceable in its own unit at the start
and at the end of the same turn, so the turn is not passing on an empty allowed
set. The fix is at the one address round one named, `tools.cjs` is untouched by
it, and the channel used is the one the recalled text already used.

**The fix round's second instance is real and I confirm it.** The
`COACH_MEMORY_READ_BACK_FAILED` reason interpolated the minted op id, whose
digits were licensed BARE. Mutant M-R, which restores that interpolation, goes
red on P03-03 and on nothing else (measured by me, below). Round one did not see
this one; the fix round found it while fixing B1 and fixed it in the same shape.

**The new cell can fail.** Mutant M-Q restores the propose interpolation. It
loads, and it kills exactly one cell: the new turn-local P12-06. That is the
second half of round one's point, measured.

### The eleven notes

| R1 | status | what I measured |
| --- | --- | --- |
| N1 red first was a load error | **FIXED** | Report section 2 now says "THE TWO CELL FILES DID NOT LOAD" and that no cell was watched going red for its own reason. The phrase is no longer asked to carry more than it did, and the report points at the mutant table as the per-boundary evidence, which is where it belongs |
| N2 three M06 order assertions unsound | **FIXED** | Presence is asserted before order in P06-01, P06-02 and P06-03. Measured by me: mutant M-K now kills all THREE real-lane cells AND the pure join cell (4 red). At the first head round one measured it killing the pure cell alone. This is the note I checked hardest, because it is the one where a green cell was hiding a broken law |
| N3 P02-06's refusal could not fail | **FIXED** | The disjunction is gone. The cell pins `code === null`, `state === 3`, `copy` matching `WORKOUT_INPUT_INVALID` and `op_id === null`. Each of the four is falsifiable, and the cell's own comment names the three neighbours each one separates it from |
| N4 the backwards clock passed for every outcome | **FIXED** | Both saves are now asserted to refuse, by code and by sentence, with `state_unchanged` and zero operations. The `continue` that follows skips only the per-operation loop, which has no operations to walk, so nothing was lost by it |
| N5 handles predictable, unscoped, never reaped | **OPEN, correctly deferred** | I re-measured: the handle is spent synchronously before the write, a cancel after the spend returns false, and two confirmations racing on ONE handle (R2-08) write exactly one operation. The conversation-scope question is P4b-2's and the PM's, as both earlier hands said |
| N6 two memories may carry one `memory_id` | **OPEN, correctly deferred** | Unchanged and correct for an append-only slice 1. The read side is still ignorant of `causal_parents`, so P4b-2's correction will have to teach `forTopic` about supersession rather than adding a row |
| N7 the device id rides inside every op id | **OPEN, PM's to rule** | Still true: I measured `text.source` as `"coach-memory.op op-earned-r2-device-r2x7-1"`. Pre-existing through `machine_settings`. The fix round REDUCED the surface: the op id no longer rides inside a spoken sentence either |
| N8 `withMemory` defaults on, no cost | **AGREED** | Nothing to do, and I found nothing to add |
| N9 the M06 pair is a helper, not a tool path | **AGREED, and re-measured** | `beside()` returns an object that `T.collectTagged()` finds zero tagged values in. Nothing in the product emits the pair. See note 2 below for what that means for the sentence |
| N10 `interval` is a fifth member | **DISPUTE UPHELD** | I side with the fix round against round one here. `interval` is not a fifth thing a memory says; it is the applicability window the brief's own clause requires, it passes the same one gate, and without it `constraint` cannot be told from `needs-review`, which is design point 5's whole content and P06-04's whole subject. The ruling's four-item sentence summarised the design; the design is wider. The PM should say which governs, and the fix round is right that if the sentence governs, `constraint` loses applicability and P06-04 has to be re-cut |
| N11 no flake lottery | **AGREED, re-checked** | No `Math.random`, `randomUUID`, `getRandomValues`, `Date.now` or `new Date(` in either cell file; every adversarial text is a literal; the only `setTimeout` is the 10 ms "further tick" in P03-02, which can only produce a FALSE GREEN if a late write were slower than 10 ms, never a random red. I ran the two files five times across two operating systems, three process timezones and with `MEASURED_TEST_NOW` unset, with no variation |

### Did the fix round break anything?

No. I looked specifically. The suite went 297 to 298 (the one new cell) and
every other count is identical. All four cell edits are strictly stronger
assertions, not replacements: presence added before order, a disjunction
replaced by four value pins, an "any outcome" loop replaced by an exact pin, and
new assertions added to P03-03 rather than existing ones removed. The two
contract edits are additive paragraphs. `tools.cjs` was not touched by the fix
round at all. The 166 insertions and 22 deletions the report claims are what the
diff shows.

---

## 3. BLOCKING

**None.**

---

## 4. My own notes, strongest first

### R2-N1. The FIVE-fact bound is per CALL, and one legal call breaks the 8 KiB turn budget

This is the one I came closest to blocking on, and I want the PM to read the
numbers before P4b-2 widens the surface.

Design point 4, as the ruling and the published probe set both word it: recall
"is bounded: at most FIVE facts per turn, never a scan of histories, never the
whole store." The code bounds five per CALL. Nothing in `memory-tools.cjs`,
`memory-model.cjs` or any cell bounds the TURN.

Measured (R2-09), six topics with six memories each, one turn:

```
R2-09 recall goals items 5 more true       (and the same for five more topics)
R2-09 FACTS IN ONE TURN: 30 over 6 calls
R2-09 turnContextBytes: 33131   (the standing bound is 8192)
```

And measured (R2-11), ONE legal recall call, five memories each at the
producer's OWN declared maximum of 400 characters, no fault, no hostile input:

```
R2-11 ONE recall, five 400-char memories: turnContextBytes 8854  (bound 8192)
R2-11 today_plan + that recall:            turnContextBytes 10650
```

PRB-04's own comment names that bound: "the envelope is under the existing
per-turn budget (`C.turnContextBytes(turn) < 8192`, the bound
`local-era.test.cjs:222` already holds)". It holds with the cell's short
fixtures. It does not hold at the boundary the slice's own `TEXT_MAX` permits.
`model-adapter.md`, a file this lane edits, still says "the tests hold every
turn under 8 KiB". That sentence is now false for a turn this slice makes
reachable with entirely legal input.

**Why I did not block on it.** It is a budget, not a safety law: nothing leaks,
nothing is written, no authority moves, and recall still needs an exact topic
per call, so it is not a scan and not the whole store. And the budget was never
enforced against repetition before this lane either: my control (R2-10) shows
six repeats of the existing `today_plan` reaching 10,531 bytes in one turn. So
this lane makes an existing softness materially worse rather than inventing it.

**What I would have the PM rule.** Either the bound is per call and the ruling's
sentence and `model-adapter.md` should say so, or the lane owes a turn-level
bound and a cell that reaches the `TEXT_MAX` boundary rather than a short
fixture. P4b-2 adds a screen and more memories to the same turn; this is the
moment to decide, not after.

### R2-N2. The coach cannot read back a memory that carries a figure, and the confirmation discipline needs him to

The fix is right and I would not undo it. But it has a consequence the PM
should hold in view, because it bites the tier-1 step itself.

Design point 3 and the ruling's confirmation discipline mean the coach reads
the words back and asks for the yes. The fix makes the reason a fixed sentence
and puts the words in `confirmation.text` as data, which licenses nothing. So a
harness that reads those words aloud, and they carry a figure, produces a draft
that fails `untraceable` and is discarded. Measured (R2-01): after the propose,
after the yes and after the recall, "999" and "3100" are all still untraceable
in that turn, which is exactly the fail-closed behaviour asked for, and exactly
the behaviour that makes the read-back unspeakable.

The same falls on the M06 pair. Measured (R2-07): the join's own sentence

```
What the app holds now is four, from machine-settings.op op-x on 2030-02-04.
You told me on 2030-02-04: "I always set the chest press seat to six and my
target is 210 grams". That is your own preference, and it has not changed what
the app holds.
```

cannot be spoken: `turn.untraceable(pair.sentence)` returns `["210"]`. P06-01
passes only because its fixture's contradicting figure is the WORD "six". A
contradicting memory that names a NUMBER, which is the ordinary case M06 exists
for, produces a labelled pair the coach is not allowed to say.

The author states this in `model-adapter.md` and in report section 9 point 1,
and says it is the open question the PM owes a ruling on before P4b-2. I agree
with the author and I am recording that I measured it rather than inferred it.
This is a copy and adapter problem, not a security one, and the security posture
is the right one to keep while it is solved.

### R2-N3. One line in `memory-tools.cjs` still carries the B1 mechanism, and the file's new head comment says it does not

`memory-tools.cjs:304-305`:

```js
return refuse(name, TIERS[name] === undefined ? null : TIERS[name], turn_id,
  "MEMORY_TOOL_NOT_IN_LIST", String(name) + " is not one of the coach's tools", ...);
```

`refuse()` publishes its reason as `T.text()`, so the CALLER's tool name becomes
engine prose. Measured (R2-05), against memory tools built over the C5 tools
alone, which expose no `dispatch()`:

```
R2-05 reason "your protein target is 999 grams is not one of the coach's tools"
R2-05 reason unit text
R2-05 untraceable if this result reaches the turn: []     <- LICENSED
```

and, for contrast, `wave1-tools.cjs` already gets this right: its unknown-tool
refusal is a plain object with an untagged `reason`, and the same call through
it leaves "999" untraceable (`["999"]`).

**It is dead today and I am not blocking on it.** In the shipped wiring the
memory tools are built over `createWave1Tools`, which exposes `dispatch`, so
line 301 returns before line 304; and even if it were reached, `openTurn` pushes
only `recall` and `remember` results into the turn, so the refusal never enters
the array `untraceable` reads. Two independent guards, and I checked both.

What I do object to is the file's new head comment, which states as a rule of
the whole file: "NO REFUSAL SENTENCE HERE INTERPOLATES CALLER TEXT OR A MINTED
ID." That is the lane's own new law, and one line in the file breaks it. The
one-line fix is the one `wave1-tools.cjs` already uses. Until then the comment
should say "no refusal sentence on a reachable path", or the line should go.

### R2-N4. The fix round's own finding outside custody is real, and I reproduced it

Report section 12.4 reports one live instance of the B1 mechanism in the
EXISTING product and does not fix it, on the grounds that it is the check-in
lane's copy and other suites pin it. I verified it independently rather than
taking it on trust. Measured (R2-06), through the real world with
`withCheckIn: true`:

```
R2-06 ok false  code CHECKIN_INPUT_INVALID
R2-06 reason "unknown answer 770 grams"
R2-06 before ["770"]   after []        <- LICENSED
R2-06 bare   ["770"]                   (a bare number still refuses)
```

`checkin-model.mjs` throws `'unknown answer ' + label` with the caller's word in
it, and `tools.cjs:668` publishes that message as the refusal reason through a
`text` tag. So a model-chosen `soreness` label carrying a figure licenses that
figure in its own unit for the whole turn, on a path that records nothing. The
fix round is right that this is not this lane's to fix and right about the shape
of the fix. **It is the PM's to ticket**, and it should be ticketed: it is the
same class of hole as B1, live in code that ships today.

### R2-N5. Other things I measured and found clean, said so nobody repeats them

- **A kept memory buys no bare number** (R2-02). After a successful `remember`,
  the `opId` tag's display is `""`, so the op id's digits license nothing:
  "I kept 7.", "I kept 1.", "You have 7 sets." and "Your floor is 7 grams." all
  stay untraceable, while the date tag correctly licenses its own components
  inside a date form and nowhere else.
- **A topic carrying a figure licenses nothing** (R2-03). Stored on topic
  `"210 grams"`, the topic tag declares unit `topic`, which is in no unit word
  map and not in `BARE_SPEAKABLE`, so "Your protein target is 210 grams.",
  "210" and "I counted 210 sets." all stay untraceable.
- **Every refusal the two tools produce in a healthy world is clean** (R2-04).
  I drove nine distinct refusal codes through the real tool boundary and
  asserted each reason carries no digit and quotes no caller text:
  `COACH_MEMORY_TOPIC_REQUIRED` (twice), `COACH_MEMORY_ABSENT`,
  `COACH_MEMORY_INPUT_INVALID` (twice), `COACH_CONFIRMATION_REQUIRED`,
  `COACH_MEMORY_CONFIRMATION_MISMATCH`, `COACH_MEMORY_CONFIRMATION_UNKNOWN`,
  `COACH_MEMORY_CONFIRMATION_SPENT`. All nine clean, with a legal write landing
  in the same cell as the positive control.
- **A race between two confirmations on one handle** (R2-08). Both sent with
  `Promise.all` on the same handle: one `ok: true`, one
  `COACH_MEMORY_CONFIRMATION_SPENT`, exactly one operation on disk. A cancel
  after the spend returns `false` and changes nothing.
- **The stamp, across three process timezones and with `MEASURED_TEST_NOW`
  unset**. I dumped the stored `effective` of one memory four times:
  `{"local_date":"2030-02-04","local_time":"08:00","utc_offset":"-05:00"}` every
  time, byte for byte, under `America/New_York`, `UTC`, `Asia/Kolkata` and with
  the variable unset. The offset is the era clock's own and never `Z`.
- **Escapes are TEXT.** I scanned both cell files for the real code points
  (U+0000, U+0007, U+001B, U+007F, U+200B, U+200E, U+202E, U+FEFF) and for
  U+2013 and U+2014: NONE present. The four adversarial escapes are six
  characters of source each, as the probe set demanded.
- **No clock, no network, no environment** in any of the four modules: I grepped
  for `Date.now`, `new Date(`, `toISOString`, `performance.now`, `process.env`,
  `fetch(`, `node:http`, `node:https` and `child_process`. Zero hits.
- **`no-dashes.test.cjs`** really was extended to all four memory modules.

---

## 5. My probe results, in full

Run by me on the owner's PC, in two detached scratch worktrees of my own under
`%TEMP%` (`p4br2-head` at `f3dadfe7`, `p4br2-pre` at `bf69791e`), with
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` unless stated. Both
worktrees were clean by `git status --porcelain` before removal, both were
removed with `git worktree remove`, and the lane worktree was clean at
`f3dadfe7` before this file was written.

| id | what it does | at `bf69791e` | at `f3dadfe7` |
| --- | --- | --- | --- |
| R2-01 | one turn: propose with no yes, then the yes, then the recall, with a text carrying `999 grams` and `3100 kcal`; the engine's own protein figure as the control at both ends | **RED**: both figures licensed after the propose; reason quotes the memory | **GREEN**: all four lines untraceable at every step; control traceable |
| R2-02 | a kept memory: do the op id's digits or the date buy a bare number | GREEN | GREEN |
| R2-03 | a topic carrying a figure, recalled | GREEN | GREEN |
| R2-04 | nine distinct refusals through the real tool boundary: no digit, no quote | **RED**: the propose reason carries both | **GREEN**: all nine clean |
| R2-05 | the unknown-tool refusal over the C5 tools alone, and over wave1 | licensed over C5, clean over wave1 | unchanged: see R2-N3 |
| R2-06 | `record_pain_or_soreness({soreness:"770 grams", confirmed:true})` through the real check-in lane | licensed | licensed: see R2-N4 |
| R2-07 | is the M06 pair a tagged value, and can it be spoken | pair untagged; sentence SPEAKABLE only because the propose refusal had licensed `210` | pair untagged; sentence correctly NOT speakable |
| R2-08 | two confirmations racing on one handle; cancel after the spend | one write, one `SPENT`, cancel false | same |
| R2-09 | six topics, six memories each, six recalls in ONE turn | not run | 30 facts, 33,131 bytes: see R2-N1 |
| R2-10 | control: six repeats of an existing tier-0 tool in one turn | not run | 10,531 bytes (the softness predates this lane) |
| R2-11 | ONE recall of five memories at the producer's own `TEXT_MAX` | not run | 8,854 bytes against a bound of 8,192: see R2-N1 |
| R2-12 | the stored `effective` under four clock and environment settings | not run | byte-identical four times |

### The mutants, re-run by me at `f3dadfe7`

Eight. Each one applied as ONE source edit, LOADED to prove it is not a
parse-error kill, run against the two memory files, then reverted. After the
last revert the control was 64/64/0 and `git status --porcelain` was empty.

| mutant | the edit | what went red |
| --- | --- | --- |
| M-Q | the propose reason interpolates `canonical.text` again | the new turn-local P12-06, **and nothing else** (63/64) |
| M-R | the read-back reason interpolates `saved.op_id` again | P03-03, **and nothing else** (63/64) |
| M-K | the join speaks the memory where the canonical value belongs | the pure join cell AND P06-01, P06-02, P06-03 (60/64). **Round one measured this killing the pure cell alone; N2 is really fixed** |
| M-A | the `confirmed !== true` guard is gone | 38 cells (26/64). The confirmation discipline is load bearing across the whole file |
| M-D | `TEXT_MAX` 400 becomes 401 | 5 cells, including P12-09; **P12-08 stayed GREEN**, so the boundary pair really is a pair |
| M-I | `RECALL_MAX` 5 becomes 500 | PRB-01 (both cells), PRB-02, PRB-03 (60/64) |
| M-L | the `{stored}` check on the compensating `accepted:false` write is dropped | P03-05 only (63/64). The `:458` one-liner really checks its own result |
| M-P | the remember tool becomes tier 0 | P02-08 only (63/64) |

---

## 6. What this review does NOT prove

1. **No real phone, on my side either.** Everything I ran is `fake-indexeddb`
   over a memory backend through `rebuild/m3/w6/test/support.mjs`. Every claim
   above is a synthetic browser check, never installed-phone evidence. The
   second installation is a second installation, not a second device.
2. **I did not run GitHub CI.** My two-operating-system claim is one Windows PC
   and one Linux reading room, both at `f3dadfe7`. CI at this head is still owed.
3. **B1 and its sibling are two holes closed, not a proof there is a third.** I
   swept every `T.text` reason in the four memory modules and found exactly one
   residual interpolation (R2-N3, dead) and one accepted-layer copy carried
   verbatim by design. I did NOT sweep the engine, the client or the rest of
   `rebuild/m3` for reasons that reach a `text` tag; R2-N4 is one instance found
   in `rebuild/coach`'s neighbour and it is not the only place to look.
4. **My twelve probes plus the lane's sixty four cells are not a proof of
   safety against every shape.** I attacked the licensing gate, the bounds, the
   confirmation race and the refusal surface, because those are where this
   lane's claims live. I did not re-derive the M06 canonical readers; like round
   one I measured byte-identity against a no-memory world.
5. **I did not re-run every mutant round one ran.** I ran eight of the eighteen
   now on the table, chosen for the four the fix round changed and four
   boundaries I wanted to see for myself. The other ten stand on round one's
   measurement and the author's.
6. **`PROBES.md` is not in the repository.** The fix round says so plainly. What
   I re-ran is the probe set AS REALISED IN CELLS plus my own twelve. I could
   read the published probe set only as it was quoted to me in the ticket, not
   as a file in the tree, and a future hand should be given the document.

---

## 7. What I would sign, said once and plainly

The seam is the machine-settings seam and not a new one. The restart is a real
restart and the second installation is a real second installation. The failure
injections are at the storage API and outside product code. Absence and
unreadability are different answers and the athlete is told which. A remembered
text is data on every reachable path in this lane, and the one place it stopped
being data is now fixed at its one address with a cell that dies when the fix is
undone. The `:458` one-liner is folded in and really checks its own result.
Every one of round one's twelve findings is answered, three of them with a
measurement that shows the answer rather than asserting it, and the one dispute
is a dispute I would have made myself.

What is left is two bounds worded more tightly than the code holds them, one
dead line that contradicts a comment written this round, and one live hole in a
neighbour's copy that this lane correctly refused to fix and correctly reported.
None of those is a reason to hold this slice, and all four are reasons for the
PM to rule before P4b-2.
