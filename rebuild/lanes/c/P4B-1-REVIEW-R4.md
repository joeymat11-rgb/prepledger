# P4b-1 REMEMBER AND RECALL: review R4 (independent re-check, round 4)

Independent re-check, one pass, security minded, told to disagree. The author is
gone; every claim in `P4B-1-AUTHOR-REPORT.md` section 14 was treated as a
hypothesis and measured again with probes of my own.

Head reviewed: `44006afa43543b2f99c6f075ae93f1292808b3ad`, which is what the
author reported. Base: `a40952f1` (the head R3 rejected, plus R3's own file).
The product diff of this round is ONE commit, `df7745d6`; the three commits after
it are paper (`b216ac10`, `7604e404`, `44006afa`) and one chain-tip merge
(`dc5f51df`, which brought five `rebuild/DECISIONS.md` lines and nothing else).

I edited no product file and no test file in the lane worktree. This review
changes nothing but itself.

## VERDICT: ACCEPT WITH NOTES

R3-B1 is fixed, and it is fixed in the right place with the right discipline. I
reproduced the finding at the base (twelve facts, and sixty with twenty callers),
watched it go green at the head, then attacked the reserve seven ways and could
not get a turn past five facts or the account outside `[0,5]`. Three mutants, one
each on the reserve, the success refund and the refusal-path refund, each die at
a named address. The three rulings that were code (the topic display, the true
note, R3-N3, R3-N2) hold when run. The sentences are in the two contracts and
they say what the PM ruled.

The one thing this head does NOT have is both-operating-system CI evidence, and
that is not this lane's doing: see section 6. The notes below are all paper or
future work; none of them is a reason to hold the code.

## 1. The bar of record, re-run on the owner's PC at the reviewed head

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, win32, in
`%TEMP%\earned-p4b` at `44006afa`, working tree clean.

| command | result |
| --- | --- |
| `node --test "rebuild/coach/test/*.test.cjs"` | **tests 311, pass 311, fail 0**, EXIT 0 |
| `node rebuild/t2/rig187.cjs` | **PASS**, exit 0 |
| `node --test "rebuild/client/test/*.test.cjs"` (control) | **tests 18, pass 18, fail 0**, EXIT 0 |
| `git diff --numstat c9c34aef..HEAD -- rebuild/engine rebuild/m3 rebuild/m4 rebuild/client .github` | **EMPTY** |
| U+2013 / U+2014 on added lines, `a40952f1..HEAD -- rebuild/coach rebuild/lanes` | **0** |
| U+2013 / U+2014 on added lines over the WHOLE range | 5 lines, **all five inside the `rebuild/DECISIONS.md` lines the chain-tip merge brought in**; this lane authored none of them |

The author's figures reproduce exactly. Custody reproduces too: the only product
paths this round moved are `memory-tools.cjs`, `memory-host.mjs`,
`TOOL-CONTRACT.md`, `model-adapter.md` and `test/memory.test.cjs`, every one of
them named by the ruling's section 2, plus this lane's own two paper files.
No file this lane touched appears in `rebuild/m4/spec/acceptance-s8-real-shape.json`.

## 2. R3-B1: measured RED at the base and GREEN at the head

My own probe set, nine cells, reviewer written and never committed, run in a
throwaway detached worktree with the three `node_modules` junctions (root,
`rebuild/m3/w5`, `rebuild/m3/w6`), which was removed afterwards with the links
unlinked first. Four cells run over a REAL installation opened through
`local-world.mjs`; the rest drive a lane I control so that calls can be held in
flight together on purpose.

| probe | what it does |
| --- | --- |
| R4-A | six concurrent recalls in one turn, REAL installation, `Promise.all` |
| R4-B | TWENTY concurrent recalls in one turn, all held at the store read and released together |
| R4-C | a `remember` racing two recalls in the same turn, REAL installation |
| R4-D | a lane whose `forTopic` never resolves |
| R4-E | a recall that throws at a LATER tick than the author's cell drives |
| R4-F | two turns interleaved over one instance |
| R4-G | a sweep: 24 seeds mixing rows, empty, unreadable and throwing reads, seven recalls a turn |
| R4-H | a topic that reads as a date, on a date this lane never used |
| R4-I | a measurement of what a recall after `close()` is given (section 7, N1) |

**At `a40952f1`, the base: 1 pass, 7 fail.** The printed measurements:

```
R4-A facts=12 shape=[2,2,2,2,2,2] left=0
R4-B entered=20 facts=60 left=0
R4-C wrote=true facts=6 left=0
R4-F a=6 b=6 leftA=0 leftB=0
```

R4-A reproduces R3's twelve exactly. R4-B is new and is the size of the hole R3
found: twenty recalls issued together in ONE turn published **sixty** facts, all
twenty reaching the store, with the account reading zero afterwards. R4-E was the
one cell that passed at the base, and it is a fair control: with no reserve there
was nothing for a throw to leak.

**At `44006afa`, the head: 9 pass, 0 fail.** The same measurements:

```
R4-A facts=2 shape=[2,BOUND,BOUND,BOUND,BOUND,BOUND] left=3
R4-B entered=1 facts=3 left=2
R4-C wrote=true facts=3 left=2
R4-F a=3 b=3 leftA=2 leftB=2
```

`entered=1` in R4-B is the reserve doing its work: nineteen of the twenty callers
are refused BEFORE the store is touched, so they read nothing at all rather than
reading and discarding. That is the property the ruling's design point 4 exists
for, and it now holds for a caller that does not serialise itself.

## 3. Attacking the reserve

Every attack the PM named, and what it measured at the head.

- **Recalls racing a `remember` in the same turn** (R4-C, real installation): the
  write lands, the two recalls publish 3 facts between them, the account reads
  `5 - 3`. A write neither spends nor refunds the recall allowance. At the base
  the same shape published 6.
- **A recall that throws after the reserve** (R4-E): the whole reserve comes back
  and the next recall in the SAME turn still gets its facts. I drove the throw a
  tick later than the author's cell does, to be sure the `finally` and not the
  ordering was doing it.

- **A lane whose `forTopic` never resolves** (R4-D): the reserve is pinned, and
  it is pinned to THAT turn only. The hung turn's later recall is refused
  `COACH_MEMORY_TURN_BOUND`; the NEXT turn opens at five and gets its facts. The
  allowance is not lost to the next turn, which is what the ticket asked me to
  check, and it is not leaked to it either.
- **Twenty concurrent recalls** (R4-B): 3 facts in the turn, account `5 - 3`.
- **An interleaving that would push the account below zero or above five**
  (R4-G): 24 seeded interleavings, each seven recalls in one turn over a lane
  that returns rows, empty, unreadable and throwing in rotation with staggered
  delays. In every one of the 168 calls the account stayed inside `[0,5]` and
  ended at exactly `5 - facts_published`. The arithmetic cannot drift: the
  reserve is `RECALL_MAX - used` clamped at zero, so `used` tops out at five, and
  `Model.recall` clamps `shown` to the `max` it was handed, so the refund is
  never negative.
- **Two turns interleaved** (R4-F): two accounts, each bounded on its own, and
  neither can spend the other's five.

I could not construct an interleaving that publishes more than five facts in one
turn, and I could not construct one that leaks allowance out of a turn.

## 4. The mutants

Applied one at a time to `memory-tools.cjs` in the throwaway worktree at the
reviewed head, the whole coach suite plus my nine probes run each time, then
reverted. Baseline and control after the last revert: **319 pass, 0 fail**
(311 of the lane's plus my 9; `git status --porcelain` carried only the untracked
probe file, and the worktree was clean of every mutant before it was removed).

| mutant | the one edit | tests that died |
| --- | --- | --- |
| MU-1 THE RESERVE | `account.used += allowance` becomes `+= 0`, so nothing is held before the await | 13 die, among them "R3-B1 six CONCURRENT recalls" (its own address), "P-F2 six topics in ONE turn", PRB-03, and all eight of my allowance probes |
| MU-2 THE SUCCESS REFUND | `refund = allowance - bounded.shown` becomes `refund = allowance`, so a call gives back what it spent as well | 12 die, among them "P-F2 six topics in ONE turn" (its own address), "R3-B1 six CONCURRENT recalls", R4-A, R4-C, R4-F, R4-G |
| MU-3 THE REFUSAL PATH REFUND | `let refund = allowance` becomes `let refund = 0`, so a refusal or a throw keeps the reserve | 4 die: "R3-B1 a recall that THROWS, is UNREADABLE or is ABSENT" (its own address), PRB-03, R4-E, R4-G |

No mutant survived, so no address in the three-line mechanism is unguarded. Each
mutant loads and runs, so none of these is a parse-error kill. MU-3's second
grave is the one worth the PM's eye, and it is the author's observation, which I
confirm: PRB-03 was written rounds ago, asks five absent topics and then a real
one, and it is the cell that would have caught a reserve that is never given
back. The author's own refund cell and mine are corroboration, not the proof.

I did NOT re-derive the author's M-R3 through M-R6 (the topic display, the note,
the eviction, the host code): those four boundaries are proved live by my own
probes going red at the base rather than by me repeating his mutants. R4-H fails
at `a40952f1` and passes at the head, which is the same evidence for the topic
display; the note, the eviction and the host code I checked by running, below.

## 5. The PM's other rulings, checked by RUNNING them

- **The third site, R3-N5/H1.** R4-H, over a real installation, files a memory
  under the topic `2031-12-25`, a date this lane's own cells never use. Both
  topic tags publish `display: ""`, the topic still travels as the tag's `value`,
  `faceOf()` still reads it, and `turn.untraceable("I saw you on 2031-12-25.")`
  answers `["2031","12","25"]`, so the date is licensed by nothing. The cell
  fails at the base. I also grepped every consumer under `rebuild/coach` and
  `rebuild/m3/w7-preview/today`: **no reader anywhere takes a topic from
  `display`**, so nothing is lost by emptying it.
- **The recall note.** The shipped clipped sentence is "I am showing the most
  recent ones I can show in this turn. There are more kept on this subject." It
  contains no digit and no number word, so no allowance can make it false, and
  the unclipped sentence is unchanged. Both are still PROPOSED. Confirmed both by
  the lane's cell and by my R4-H, which asserts the note carries no digit.
- **R3-N3.** `memory-host.mjs` `save()` answers the fixed
  `COACH_MEMORY_WRITE_REFUSED` on a throw, `copy: null`, and the message travels
  as an untagged `detail` into the refusal's untagged `source`. The lane's cell
  drives it with a message carrying "777 grams" and proves the figure reaches no
  tagged display and licenses nothing. `COACH_MEMORY_WRITE_REFUSED` is now in
  TOOL-CONTRACT.md's code table, so the table is a closed set in fact.
- **R3-N2.** The turns map is bounded at `TURNS_MAX = 64`, oldest evicted, and a
  closed turn drops its account at once when the coach's turn object has a close.
  The lane's cell walks the boundary at the cap and one past it. I confirmed the
  bound is exported and is a real integer, and I measured the close path myself
  (N1 below).

## 6. The sentences, checked by READING

All four are there and all four say what the PM ruled.

1. **The allowance is per coach instance, and the shipped wiring builds one.**
   TOOL-CONTRACT.md now says so and adds the honest consequence: two instances
   over one world and one turn id keep two accounts and publish five facts each.
   model-adapter.md carries the same sentence. See N3 for the one wording I would
   change.
2. **`faceOf`'s dead interval line** carries its comment, and the comment is
   correct: `itemFor()` publishes no `interval` member, so the line is always
   null for an item this tool published, and the line stays because `faceOf` also
   takes a face built by hand from a row.
3. **The standing condition on the accepted layer.** TOOL-CONTRACT.md states it
   plainly, including that nothing enforces it and no cell would notice if it
   changed. I did not take R3's reading on trust: I read every `copy:` site in
   `rebuild/m3/w6/public-client.mjs` and `rebuild/m3/w6/local/local-client.mjs`
   at this head. There are six, every one of them a fixed string or a fixed
   constant (`LEASE_EXPIRED_COPY`, `Client.copy.RESTORE_REQUIRED`,
   `Client.copy.SAVE_FAILED`), and no template literal or concatenation appears
   in any of them. The condition holds today.
4. **The byte paragraph.** model-adapter.md now separates the recall envelope's
   figure (9446) from a turn that also writes (22118), records R3's 20183 and why
   it differs, says in as many words that nothing enforces the bytes today, and
   names the choice as P4b-2's. The cell reads the file and fails while they
   disagree, and the two figures printed by the run of record on this PC are
   9446 and 22118.

## 7. CI on both operating systems: RED at step 13, and NOT this lane's doing

Read over the public Actions API with the PM's own scripts, no token.

```
44006afa | pipeline          | completed | success | 2026-09-19T12:25:23Z | run 35442810177
44006afa | shared-preflight  | completed | success | 2026-09-19T12:25:23Z | run 35442810189
44006afa | rebuild           | completed | FAILURE | 2026-09-19T12:25:23Z | run 35442810241
7604e404 | rebuild           | completed | FAILURE | 2026-09-19T12:24:36Z | run 35442772415
```

```
run 35442810241
  rebuild-public (windows-latest) | completed | failure | step 13 failure
  rebuild-public (ubuntu-latest)  | completed | failure | step 13 failure
```

Step 13 of `.github/workflows/rebuild.yml` is
`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8`, whose first tip
rule asserts `SEAL-BASE-IS-NOT-THE-CHAIN-TIP` unless the chain tip is an ancestor
of HEAD. **The chain tip moved after the author's merge.** The author merged
`4e832c2a` (DECISIONS:560, committed 08:10:31 ET). The tip is now `4d2112c9`
(DECISIONS:563), and `git merge-base --is-ancestor 4d2112c9 44006afa` fails, so
the seal base is not the tip. The timings say the rest: `ee8f226c` (:561) landed
at 08:24:00 and `467638af` (:562) at 08:25:50, while the lane pushed at 08:24 to
08:25 and the run started at 08:25:23.

I did NOT merge the tip myself, as the ticket instructs.

This is not a hypothesis. DECISIONS:563 records this exact run id, names the
refusal, and corrects the rule that caused it: "THE MERGE-FORWARD FOR BOTH-OS
EVIDENCE IS THE INTEGRATOR'S ACT, AT ACCEPTANCE, NEVER THE LANE'S."

**But one consequence has to be said plainly, because it is the one bar row this
head does not satisfy.** The coach suite's CI home is step 22 of the same job
(`node --test "rebuild/coach/test/*.test.cjs"`, the "C5" step). Step 13 failed,
so every later step was skipped: **the coach suite did not run on ubuntu or on
windows at this head**, and R3's green both-OS evidence is at `93d8a551`, which
does not contain round 4's code. The both-OS evidence for the fix is therefore
OUTSTANDING. Per :563 it is the integrator's merge-forward run that must produce
it, and no ledger line should be appended until that run is green on both
runners. I report this as a gap in the evidence, not as a defect in the lane.

The one same-OS red I can read is on both runners at once, at the same step, for
a cause outside this lane's diff, so STOP condition 8 (two consecutive same-OS CI
reds) is not what happened here.

## 8. Notes

**N1. A recall AFTER `close()` gets a fresh per-call five. Measured.**
`openTurn()` now returns a `close` that deletes the account, when the coach's own
turn object has one. My R4-I measures what happens if a consumer then keeps
calling on the same turn object: the account is gone, so the call is treated as a
turn nobody opened, `allowance(turn_id)` reads 5 again, and the recall publishes
a fresh three facts. Repeated, that is unbounded facts inside what the consumer
still calls one turn.

This is UNREACHABLE today and I am not asking for code: the shipped C5 and
wave-one turns carry no `close`, so `closing` is null and no shipped turn grows
one, and the lane's own cell pins that. It is also arguably not a bypass at all,
since calling a tool on a closed turn is incoherent. But it is the kind of thing
a later consumer discovers by accident, and TOOL-CONTRACT.md already spends a
paragraph on eviction. One clause in the same paragraph ("a call made after
`close()` is a call on a turn nobody opened") would close it on paper. P4b-2 or
C-UI-6 can decide whether `close()` should make the turn refuse instead.

**N2. Eviction and the reserve can, in principle, meet.** If a turn's account is
evicted (65 turns opened) while one of its recalls is still in flight, the
in-flight call refunds into a detached object and the same turn id, calling
again, is a turn nobody opened with a fresh five. The precondition is 64 further
`openTurn()` calls inside one turn, which no consumer does and which the model
cannot cause: `openTurn` is the harness's, never a tool. Named so it is written
down, not because I think it can happen.

**N3. "The shipped wiring builds exactly ONE instance" is generous.** At this
head NO product file calls `createMemoryTools` at all. `local-world.mjs` builds
the memory HOST (the lane, `world.memory`); the only constructors of the tools
are the two coach test files. That is exactly right for this slice, because the
coach surface is a stub until C-UI-6, but a reader of TOOL-CONTRACT.md could take
"the shipped wiring builds exactly one" as a statement about a consumer that
exists. Truer, and a better warning for C-UI-6: "nothing ships a consumer yet;
the one that does must build exactly one instance per world." A wording change,
not a defect, and not worth a round of its own.

**N4. The copy list's row 6 still shows the superseded sentence.**
`P4B-1-AUTHOR-REPORT.md:919` still carries "I am showing the five most recent..."
in the sentence column, with `memory-tools.cjs:230` as its address. It is
flagged in the same cell ("CHANGED IN ROUND 4") and section 14.3 has the new
sentence, so nothing is hidden. But the copy list is the table the owner will
rule at C-UI-6, and the sentence column should carry the sentence that ships.
One table cell.

**N5. A reserve is conservative, and the cost is measured.** Six concurrent
recalls over six topics now publish 2 facts where a serial caller gets 5, and
twenty publish 3. The author says this in 14.10 and both contracts say it, so
nothing is hidden, and the direction is the safe one: the bound exists to limit
what leaves the phone, and fewer is never a violation. It does mean a parallel
adapter gets materially less than a serial one, which is a product question for
P4b-2 rather than a defect here. If the PM ever wants the full five under
parallel calls, the answer is a queue at the tool boundary, not a smaller
reserve: a smaller reserve is the bug that was just fixed.

**N6. The probe set file is honest about what it is not.**
`rebuild/lanes/c/P4B-1-PROBES.md` says in its first section that the reviewer's
own text was never committed and that the file is the probe set as the author's
report records it, ids and names and observables, not the reviewer's wording, and
it names the three things about the original that are not recoverable. That is
what the PM asked for, and I found nothing invented in it. It is not evidence of
what the first reviewer wrote and it does not claim to be.

## 9. What this review does not prove

- **That the fix is green on both operating systems.** It is green on the owner's
  PC, 311 of 311. Section 7 is the whole story on CI.
- **That `memory-host.mjs`'s save catch is reachable.** The author measured that
  it is not, through four injected faults, and reports it. I did not re-derive
  that measurement; the fix is a source-level closure of a code table and the
  cell that guards it is a source scan plus a tool-level behaviour cell.
- **That no future consumer stacks a second instance, or calls after `close()`.**
  Nothing enforces either. They are sentences now, which is better than only R3
  and I knowing them.
- **Anything about a screen.** The coach surface is a stub until C-UI-6 and no
  sentence in the copy list ships before the owner rules it.

I read nothing under `rebuild/conform/private`, no `ledger/` directory, no
`src/history.js`, no `EarnedPort`, no `port-real.log`, no protected soak, on
either machine, and I created no junction to `rebuild\conform\private`. I never
ran `b-package.cjs --full`. I weakened, skipped and deleted no law, guard, pin or
test. The throwaway worktree and its three junctions are gone, links unlinked
first, and the shared `node_modules` folders they pointed at are intact. The only
file I commit is this one.
