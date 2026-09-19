# P4b-1 REMEMBER AND RECALL: the independent reviewer's round one

Reviewer: cowork (Earned lane hand), Opus, security minded, told to disagree.
Branch `rebuild/c-p4b-memory-1`, head reviewed `bf69791ebd4d167cbb036eb7e85296e11a0af22d`,
cut from `023b99f`. Ruling of record `rebuild/lanes/pm/P4B-1-CUSTODY-RULING.md`;
bar rows M01, M02, M03, M06, M12 of
`rebuild/lanes/e/COACHING-MEMORY-V1-IMPLEMENTATION-BRIEF.md` section 5; the
published probe set the author built against.

Method: the diff was read in the farm and a view formed BEFORE the author's
report was opened. Every number below was measured by me. The bar of record was
re-run on the owner's PC at the exact head; the mutants and my own probes were
re-run there too, in two detached scratch worktrees of my own under `%TEMP%`,
both removed afterwards. The author's report is treated as a hypothesis
throughout, and section 2 records one of its central claims as false.

## VERDICT: REJECT

One BLOCKING item. It is one line of copy and one substitution; everything else
in this package is strong, and nothing else I found rises above a note. The
package should come back with B1 fixed, the probe that catches it added, and the
two contract paragraphs that state the false guarantee corrected.

---

## 1. What I re-ran, and what it says

| command, on the owner's PC at `bf69791e` | result |
| --- | --- |
| `node --test "rebuild/coach/test/*.test.cjs"` | tests 297, pass 297, fail 0 |
| the two new files alone | tests 63, pass 63, fail 0 (both files enumerate nonzero) |
| the two new files under `TZ=UTC` | tests 63, pass 63, fail 0 |
| the two new files with `MEASURED_TEST_NOW` unset | tests 63, pass 63, fail 0 |
| `node rebuild/t2/rig187.cjs` | PASS |
| `git diff --numstat 023b99f..HEAD -- rebuild/engine rebuild/m3 rebuild/m4 rebuild/client rebuild/DECISIONS.md .github` | EMPTY |
| fifteen of the sixteen mutants, each re-applied and reverted by me | every one LOADS, every one goes RED, no parse-error kill |

I also ran the whole coach suite and all sixteen mutants in the cloud reading
room on Linux (303 counted there, same zero failures) before touching the PC.
Both operating systems agree; GitHub CI at this head is still the PM's evidence
to collect.

Custody: twelve paths, eleven of them under `rebuild/coach` plus the lane's own
report. `rebuild/m3/w6/t2-stage.cjs` and `rebuild/m3/w6/local/local-client.mjs`
are untouched, so no stage whitelist was widened. No screen, no route, no
workflow file. STOP conditions 1 to 8: I found none fired.

---

## 2. BLOCKING

### B1. The propose step launders an invented figure past the traceability gate

**What it is.** `memory-tools.cjs` `remember()` answers a call with no yes by
returning a refusal whose reason sentence QUOTES the memory text back:

```
memory-tools.cjs:206-207
  return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.CONFIRMATION_REQUIRED,
    "I have not kept that yet. Say yes and I will keep it in these words: " + canonical.text,
```

`refuse()` at `memory-tools.cjs:67` publishes that sentence as
`T.text(turn_id, "coach.refusal." + code, reason)`. A `T.text` tag declares unit
`"text"`, and `tools.cjs allowedTokens()` treats a `text` tag as ENGINE PROSE:
it parses the display and licenses every numeric token in it, in whatever unit
the words around it name. So from that moment the turn's allowed set contains
the athlete's, or the MODEL's, numbers.

**Measured, on the PC at `bf69791e`** (probe R-11, one `remember` call, no
`confirmed`, nothing on disk):

```
R-11 before propose          : ["999"]            (correctly refused)
R-11 after propose   999 g   : []      LICENSED
R-11 after propose  3100 kcal: []      LICENSED
R-11 memories on disk        : 0
```

The text supplied was `"your protein target is 999 grams and your floor is 3100
kcal"`. After that single refused call the coach may say "Your protein target is
999 grams." and "Your floor is 3100 kcal." and `untraceable` returns the empty
array, which is the only passing answer. No yes was given, no operation was
written, no memory exists. The model chose the number itself.

R-12: the same on the LEGAL happy path (propose then confirm in one turn,
`ok: true`): "Your protein target is 210 grams." comes back licensed while the
engine's own figure for that fixture is 155.

R-13 isolates the culprit so the fix has one address. Against a results array
holding ONLY the `confirmation` extra, "210" stays untraceable. Against one
holding ONLY the reason tag, it is licensed. R-14 clears the rest of the lane:
a turn holding only the successful write, and a turn holding only a recall, both
leave "210" untraceable. `dataText` does its job. The hole is the reason
sentence and nothing else.

**Why it blocks.** `untraceable` is the coach's one fail-closed defence against
an invented quantity. This opens it for a whole turn, to any number, in any
unit, on a path the model reaches alone. It is design point 6 ("REMEMBERED TEXT
IS DATA: it is never a tool instruction or an authority grant, whatever it
says") read as the ruling means it: a remembered text must buy nothing, and here
it buys the one thing that matters. Probe P12-06's wording is unconditional,
"the number buys nothing", and this is a turn in which it does.

**Three things the package asserts that this contradicts.**

1. The author's report, section 9 point 1: "Because a remembered text is not a
   tagged value, it licenses nothing, so a harness sentence that quotes 'my
   target is 210 grams of protein' back at the athlete would fail `untraceable`
   and be discarded." Measured false in the propose turn. The quote is not
   discarded; it is licensed BY the quoting.
2. `model-adapter.md`, the new paragraph in section 3: "A memory that reads 'my
   target is 210 grams' leaves '210' untraceable; if the coach says it, the
   draft is discarded like any other invented figure." That is a published
   guarantee the code does not give.
3. `memory-tools.cjs`'s own head comment: "tools.cjs collectTagged() therefore
   never sees it and allowedTokens() never licenses a number inside it. ... That
   is design point 6 with teeth." True of the recall item. Not true of the
   confirmation sentence in the same file.

**Why P12-06 did not catch it.** The `dataOnly()` harness at
`test/memory.test.cjs:920` stores in one world, closes it, REOPENS, and opens a
fresh turn before measuring. The propose refusal is in the first turn's results,
never the measured one. The cell is correct about what it looks at; it looks at
the wrong turn.

**The existing product does not do this.** Probe R-13 on the PC:
`record_pain_or_soreness` called without a yes returns the fixed sentence "A
fact is recorded only after you say yes. Nothing was recorded." (`tools.cjs`
`needConfirm`, :628). An athlete-supplied `soreness_location` of "770 grams"
leaves "770" untraceable. So this is a posture this lane introduces, not one it
inherits.

**Shape of a fix** (the author's to choose, not mine to specify): the
confirmation copy must not interpolate the text into a `T.text` tag. The module
already owns the right channel. `dataText(source, value)` carries no `turn_id`,
`collectTagged` skips it, and R-13 measured that the untagged `confirmation`
extra licenses nothing. Publishing the words to confirm through that channel and
leaving the reason a fixed sentence closes it without touching `tools.cjs`.

**The probe that must come back with the fix.** In ONE turn: call `remember`
with no `confirmed` and a text carrying a digit in a real unit; assert
`T.untraceable("<that figure in that unit>", turn.results, turn_id)` is
NON-EMPTY. Then confirm in the same turn and assert it is STILL non-empty. A
positive control in the same turn: the engine's own `today_plan` figure IS
traceable in its own unit. Without both halves the cell proves nothing.

---

## 3. NOTES, not blocking

### N1. Red first was a load error, not a behavioural red

At `a22aa7d0` I ran the two cell files in a detached worktree of my own. BOTH
files die on `Error: Cannot find module '../memory-commands.cjs'` before a
single cell executes. The author's "tests 236, pass 234, fail 2" is two FILES
failing to load, not two cells going red. Not one of the sixty three cells was
ever observed catching the absence of the behaviour it claims to pin.

I do not call this blocking, because the fifteen mutants I re-ran at the final
head give per-boundary red evidence over the same ground, and that is the
stronger proof. But the report should say "the cell files did not load" rather
than let "red first" carry a meaning it did not earn here.

### N2. The three real-lane M06 ordering assertions are unsound

`test/memory.test.cjs:1257`, `:1311` and `:1345` each assert

```js
assert.ok(pair.sentence.indexOf(<canonical>) < pair.sentence.indexOf(<text>), pair.sentence);
```

with no assertion that the canonical value is in the sentence at all. When it is
absent `indexOf` returns -1 and -1 is less than any index, so the assertion
passes precisely when the law is broken worst.

Measured: mutant M-K (`memory-model.cjs` joinOf speaks the memory text where the
canonical value belongs) leaves ALL THREE green. Only the pure cell at `:359`
kills it, because that one asserts `canonicalAt >= 0 && memoryAt >= 0` first.
The probe set's section 8 names P06-01, P06-02 and P06-03 as M-K's graves and
they are not. The fix is one line in each: assert presence before order.

### N3. P02-06's refusal assertion cannot fail

```
test/memory.test.cjs:610
  assert.ok(r.code || r.copy || Number.isInteger(r.state), ...)
```

`memory-host.mjs save()` returns `state: 3` on its catch path and
`result.state` otherwise, so `Number.isInteger(r.state)` is true on every
refusal this cell can produce. The disjunction is unfalsifiable. The probe set's
rule 0.4 is explicit: a refusal probe names the code. The author discloses this
in report section 8 point 7 and says it is worth a reviewer's eye, which it is;
the honest form is to assert the state VALUE and the copy, or to say in the cell
that the accepted layer mints no code here and pin the state number.

### N4. The backwards-clock half of P39-01 now passes for every outcome

`test/memory-journey.test.cjs:305` was loosened after the red-first commit so
that the backwards clock may store two memories, one, or none. The accepted
client's lease refusal is real and the author is right to carry it verbatim
rather than work around it; the disclosure in report section 8 point 8 is
honest. But the cell as it stands pins only "a refused save left no operation
behind", so the backwards clock is no longer a probe of anything about stamps.
Either say that in the cell, or pin the refusal exactly (both saves refuse, code
and state named, zero ops) so a future change to the lease rule is noticed.

### N5. Confirmation handles are predictable, unscoped and never reaped

Measured on the PC (R-15): the first handle is `memconf-1`, the counter is a
plain increment; a handle proposed in turn 1 confirms successfully in turn 3;
six unconfirmed proposals leave six live entries in the `pending` Map and
nothing ever removes them.

None of this is exploitable on its own, because the binding is
`JSON.stringify(canonical)` over all four members, so a stale or guessed handle
only ever writes the exact text it was issued for, and R-15's cross-turn confirm
wrote that same text. It also matches `accept_proposal`, whose `issued` map is
equally per-instance and equally not turn-scoped, which is what ruling point 3
asked for. Flagged because the difference between "he said yes in this turn" and
"he said yes at some point in this conversation" is a real one, and P4b-2 will
have to rule on it when a cancel becomes a tool.

### N6. Two memories may carry one `memory_id`

Measured in the reading room: storing twice on one topic with the same
`memory_id` and different text leaves two live rows and recalls both. The ruling
calls it "a stable memory id"; nothing enforces stability. Correct for slice 1,
where the log is append-only and correction is P4b-2, but the READ side is
ignorant of `causal_parents` today, so a P4b-2 correction will need `forTopic`
to learn about supersession rather than just adding a row. The author raises the
same question in report section 9 point 4 and is right to.

### N7. The device id reaches the model inside every memory op id

`text.source` is `"coach-memory.op op-<deviceId>-<n>"`. Assertion G of P12-13
asked for no world identifier anywhere; the cell strips the op ids and asserts
the remainder is clean, which is the strongest statement available while
assertion B requires the op id. Pre-existing through `machine_settings` since
wave one, disclosed twice by the author. PM's to rule, not this lane's to fix.

### N8. `withMemory` defaults ON, and I could not find a cost to it

Measured in the reading room: a world opened with `withMemory: true` and one
opened with `withMemory: false`, side by side, report 0 ops and 0 ops, 0 outbox
and 0 outbox, `era.revision` 1 and 1. Opening the lane writes nothing and moves
no revision, and the whole coach suite is green with it on. No cross-lane
regression found.

### N9. The M06 pair is a helper, not a tool path

`memoryTools.beside()` is exposed and the cells call it directly; nothing in the
product emits the labelled pair. That is consistent with a slice that lands the
memory underneath the tools and has no screen, and the ruling says so. Recorded
so nobody later reads "the pair is returned labelled" as a thing the product
does today.

### N10. `interval` is a fifth member of the closed shape

Ruling section 3 point 2 lists four things a memory carries. `memoryOf` admits a
fifth, `interval`, gated by the same one gate and justified by the brief's
applicability clause; P06-04 and P39-03 both depend on it. I think it is right
and I raise it only so the PM sees that the closed shape shipped one member
wider than the ruling's sentence.

### N11. I looked for the flake lottery and did not find one

No `Math.random`, `randomUUID`, `getRandomValues` or `Date.now` anywhere in
either new cell file. Every adversarial text is a literal. The two new files ran
identically for me five times across two operating systems, two process
timezones and with `MEASURED_TEST_NOW` unset. I found no cell that can fail at
random.

---

## 4. The attacks I ran that found nothing, said so nobody repeats them

- **A write without a bound yes.** P02-01 to P02-07 hold, and I re-derived them:
  `remember` runs from `pending.get()` to `entry.state = "spent"` with no
  `await` between, so two confirmations racing on one handle cannot both pass;
  the handle is spent BEFORE the write, so a failed save does not hand the yes
  back; `pending` is per instance, so a replay across a restart is an unknown
  handle rather than a second write. `confirmed: "true"`, `1` and `false` all
  take the propose branch.
- **A yes bound to other text.** The binding is `JSON.stringify` over the
  canonical object, whose key order is fixed by `memoryOf`. One character or one
  trailing space differs and the binding differs. Mutant M-C proves the cell
  catches it.

- **Remembered text acting as an instruction downstream.** Nothing dispatches on
  it, nothing parses it (`JSON.parse` count equals deep-copy count in all three
  CommonJS modules, a better assertion than the probe set asked for), no tier
  moves, `coach.TIERS` is deep-equal to the no-memory world's, and the
  `accept_proposal` and `record_pain_or_soreness` refusal copy is byte-identical
  with a hostile memory on disk. I re-ran P12-01 to P12-14 and probed the recall
  envelope myself: R-02 stored a memory on the topic `"210 grams"`, and the
  topic tag's unit is `"topic"`, which is not in `BARE_SPEAKABLE` and matches no
  English unit word, so it licenses nothing. R-14 confirms the success envelope
  and the recall envelope both license nothing. The one leak is B1, and it is
  not in the recall path at all.
- **A memory changing the programme, a target, an observation or a machine
  setting.** P06-01, P06-03 and P06-05 compare against a `withMemory: false`
  world member by member and hold. Mutant M-K aims wrong (N2) but the law itself
  is not broken.
- **Recall leaking more than five, another user's facts, a store id, a key or a
  transcript.** PRB-01 to PRB-05 hold; M-I and M-J both die. `assertNoLeak` runs
  on the recall envelope. The sixth text is absent from the blob. I found no
  transcript member and no new field between a hostile memory's envelope and a
  benign one's.
- **The second-user cell being theatre.** It is not. P01-04 opens two real
  installations over one IDBFactory with different database names, namespaces,
  athlete ids and device ids, asserts B really enrolled and booted, asserts both
  ids differ from the `COACH_ATHLETE` and `COACH_DEVICE` defaults that
  `local-world.mjs:195` and `:265` forbid, and carries both positive controls
  (A still recalls its own, B recalls its own and only its own).
- **M01's restart not being real.** `close()` is called, every handle is dead
  (`LOCAL_CLIENT_CLOSED` on a save afterwards), a WHOLE NEW `openCoachWorld` is
  built over the same store, the second open is asserted not to be a first run,
  and the cell greps its own source for `mock`, `stub`, `fake(`, a hand-made
  repository and a substitute `createDurablePublicClient`. P01-03 also abandons
  a world with no close and reopens.
- **M03.** P03-01 to P03-04 hold through `support.faultDatabase()` at the
  IndexedDB API, outside product code, with positive controls restored in every
  cell. P03-03 is the one I pushed hardest on: the tool reports committed AND
  unreadable, names the op id it holds from the commit, and after the read path
  is restored exactly one operation exists with the original id. No retry, no
  second write.
- **A widened whitelist or an edit outside `rebuild/coach`.** None.
- **The :458 one-liner.** It really checks `{stored}`. `rebuild/client/index.cjs:439`
  returns `{ stored: r.ok }`, so the happy path is unaffected; both positive
  controls assert the existing code and copy byte for byte; mutant M-L dies on
  the named cell and the two controls stay green.

---

## 5. My probe results, in full

Run by me on the owner's PC at `bf69791e`, in a detached scratch worktree, with
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` unless stated. The
probe file was deleted and both scratch worktrees removed; `git status` in the
lane worktree was clean before this review file was written.

| id | what it does | result |
| --- | --- | --- |
| R-11 | one `remember` with no `confirmed`, text carrying `999 grams` and `3100 kcal`, nothing on disk | FAIL. Both figures LICENSED afterwards; both refused before. See B1 |
| R-12 | propose then confirm in ONE turn, `ok: true` | FAIL. `210 grams` LICENSED; the engine's own figure is 155 |
| R-13 | the confirmation extra alone, then the reason tag alone | the extra licenses nothing; the reason tag licenses. Isolates B1 to `memory-tools.cjs:206` via `:67` |
| R-14 | a turn holding only the successful write; a turn holding only the recall | PASS. Both leave `210` untraceable. `dataText` works |
| R-15 | handle shape, cross-turn confirm, pending growth | `memconf-1`; cross-turn confirm succeeds; six handles after six proposals. See N5 |
| R-01 | the same laundering, measured first in the reading room | reproduces on Linux |
| R-02 | a topic carrying a digit, recalled | PASS. Unit `topic` licenses nothing, bare or in any unit word |
| R-03 | cross-turn handle, reading room | same as R-15 |
| R-06 | `withMemory` on versus off, ops, outbox and revision | PASS. 0/0, 0/0, 1/1. See N8 |
| R-07 | fifty unconfirmed proposals | fifty live handles. See N5 |
| R-08 | two memories, one `memory_id` | both live, both recalled. See N6 |
| RF-01 | the two cell files at `a22aa7d0` | both fail to LOAD. See N1 |
| TZ-01 | the two cell files under `TZ=UTC` | 63 pass, 0 fail |
| TZ-02 | the two cell files with `MEASURED_TEST_NOW` unset | 63 pass, 0 fail |

### The mutants, re-run by me

Fifteen of the sixteen. Each one edited, LOADED to prove it is not a parse-error
kill, run, then reverted; the worktree was clean at the end.

| mutant | the probe the set named | what actually went red | verdict |
| --- | --- | --- | --- |
| M-A | P02-01 | P02-01 and 36 others | killed |
| M-B | P02-04 | P02-04 only | killed |
| M-C | P02-03 | P02-03 only | killed |
| M-D | P12-09 red, P12-08 green | P12-09 red, P12-08 green | killed, boundary pair holds |
| M-E | P02-05 | both P02-05 cells | killed |
| M-F | P02-06 | the PURE validate cell only; P02-06 stays GREEN | killed, but not by the named probe. Disclosed by the author (report 8.6) and correct: two installations cannot share a parent, so the durable cell can only reach the `!parent` half |
| M-H | P12-06, P12-12 | both, plus P06-01, P06-03, PRB-05 | killed |
| M-I | PRB-01 | PRB-01 twice, plus PRB-02 and PRB-03 | killed |
| M-J | PRB-03 | both PRB-03 cells | killed |
| M-L | P03-05 | P03-05, both controls green | killed |
| M-M | P39-01 | P39-01 | killed |
| M-N | P02-07 | P02-07 | killed |
| M-O | P12-11 | P12-11 and the exact-text cell | killed |
| M-P | P02-08 | P02-08 | killed |
| M-K | P06-01, P06-02, P06-03 | the PURE join cell only; all three real-lane cells stay GREEN | killed, but not by the named probes, and NOT disclosed. See N2 |
| M-G | P02-07 | not run | I could not express "read the generation directly instead of through the authenticated view" as one faithful source edit; M-N covers the same observable and dies |

---

## 6. What this review does NOT prove

1. **No real phone, on my side either.** Everything I ran is the same
   `fake-indexeddb` over a memory backend the author used. Every claim above is
   a synthetic browser check, never installed-phone evidence.
2. **I did not run GitHub CI.** Both my runs are one PC and one Linux reading
   room. Two-operating-system CI at this head is still owed.
3. **B1 is one hole I found, not a proof there is only one.** I attacked the
   licensing gate because the lane's whole claim rests on it. The same
   `T.text` mechanism reaches any refusal reason in the coach that interpolates
   caller-supplied words, and I checked only the memory lane and
   `record_pain_or_soreness`. A sweep of every `T.text` whose display can carry
   caller text is a separate piece of work and is not this ticket's.
4. **Fourteen adversarial shapes plus my five are nineteen shapes.** Not a proof
   of safety against every shape.
5. **I did not re-derive the M06 canonical readers.** I measured byte-identity
   against a no-memory world, which is what the bar asks, and did not audit the
   setup, machine-settings or engine readers themselves.

---

## 7. What I would accept on the re-check

1. B1 fixed at its one address, with the turn-local probe from section 2 added
   to `test/memory.test.cjs`, and a mutant that restores the interpolation
   killing it.
2. The two contract paragraphs (`model-adapter.md` section 3 and the head of
   `memory-tools.cjs`) corrected so they state what the code does, and report
   section 9 point 1 withdrawn or rewritten.
3. N2 fixed: presence asserted before order in all three real-lane M06 cells,
   and M-K shown red on them.
4. N3 and N4 either tightened or stated plainly in the cell as what they now
   pin.
5. N1 restated in the report as "the cell files did not load", so the phrase
   "red first" is not asked to carry more than it did.
6. N5, N6, N7 and N10 need no code change from this lane. They are the PM's to
   rule on, before or alongside P4b-2.

Everything else in this package I would sign. The seam is the machine-settings
seam and not a new one, the failure injections are at the storage API and
outside product code, the second installation is a real second installation, the
restart is a real restart, the refusals name their codes and their sources, the
disclosures in report section 8 are the kind a reviewer can work with, and the
`:458` one-liner is folded in with both its positive controls intact. The one
thing that is wrong is wrong in a sentence the coach speaks, and it is the one
sentence in this lane that hands the athlete's words back to the machinery that
decides what the coach is allowed to say.
