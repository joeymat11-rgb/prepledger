# P3-LAYOUT-V2 INDEPENDENT REVIEW R1

## VERDICT: ACCEPT, with one deviation the PM must gate the seal on.

The change does what the ticket asked and no more. I re-ran the red first, the
six cells, the flipped cells and the whole bar myself, diffed the v1 and v2
branches of the law side by side, and drove five scratch probes the cells do
not drive. Every count the author reported reproduced exactly. No check is
missing on v2, none is relaxed on v1, no cell was weakened, no engine, coach or
DECISIONS byte moved. The owner's LOWER day opens: I measured it on the page's
own card, not only through the author's helper.

NO BLOCKING FINDINGS.

THE ONE DEVIATION, and it is not the author's to fix: five `today` byte-pin
cells go red because `today-bindings.mjs` moved and no package on this branch
declares it. The author left them red rather than minting his own licence.
That is the right call and I verified the reasoning; see NOTE 1. It is a gate
on the SEAL, not on this change.

## 1. WHAT I RAN, AND WHAT IT SAID

Worktree `%TEMP%\earned-realshape`, branch `rebuild/d-p3-real-shape`, HEAD
`0b5dbec`, tree clean before and after (my probes are untracked scratch under
`rebuild/lanes/d/_review-probes/` and are NOT part of this commit).

`git log --oneline`: `6074c4f` -> `2d0fe12` (cells) -> `848512c` (the change)
-> `0b5dbec` (author report). Three product files moved:
`rebuild/m4/workout/engine-history.cjs` (+12/-1),
`rebuild/m3/w6/local/today-bindings.mjs` (+11/-1),
`rebuild/m3/w6/host/workout-host.mjs` (+38/-1).

### 1.1 RED FIRST, REPRODUCED BY ME

I checked the three product files back out at `2d0fe12` (cells present, product
unchanged) and ran the six cells: `tests 6 / pass 1 / fail 5`
(`%TEMP%\R-red.log`). The five reds and their refusals:

- D-L2-a `{phase:'blocked', code:'WORKOUT_PREPARATION_INVALID'}` where the cell
  wants `{phase:'ready', total:27}`.
- D-L2-b, D-L2-e, D-L2-f `Error: the session never completed: blocked`.
- D-L2-c `ENGINE_CAPTURE_LOAD_UNPROVEN`, `'blocked' !== 'ready'`.
- D-L2-d GREEN, the v1 tamper control that had to stay green.

I then restored the three files to HEAD and ran the lane: `tests 62 / pass 62 /
fail 0` (`%TEMP%\R-lane.log`), which is the 56 real-shape cells plus the 6 new
ones. The author's claim is exact.

### 1.2 THE BAR, RE-RUN FROM SCRATCH

Every row run by me at HEAD (`%TEMP%\R-*.log`):

| row | pass | fail |
|---|---|---|
| `lanes/d/p3-real-shape/*.test.mjs` | 56 | 0 |
| `lanes/d/p3-layout-v2/*.test.mjs` | 6 | 0 |
| `lanes/d/p3-port-fix/*.test.mjs` | 35 | 0 |
| `m3/w7-preview/import/test/*.test.mjs` | 35 | 0 |
| `m3/w6/test/*` | 587 | 0 |
| `lanes/d/plan-edit/*` | 90 | 0 |
| `lanes/d/import-retract/*.test.mjs` | 13 | 0 |
| `m4/import/test/*` | 90 | 0 |
| `m3/w7-preview/today/test/*` | 656 | **5** |
| `coach/test/*` | 234 | 0 |
| `m4/workout/test/*.test.cjs` | 214 | **11** |
| TOTAL | **2016** | **16** |

Identical to the author's report, row for row.

A/B ON THE SIXTEEN, run by me (`%TEMP%\R-m4w-pre.log`, `%TEMP%\R-today-pre.log`):
with the three product files at `6074c4f`, `m4/workout` is `214 / 11` with the
BYTE-IDENTICAL failing set (eight module-load failures, one
`stored reader exposes SAME contextual fold ...` cell, and the two engine byte
pins `H3/SUP-5` and `H3/SUP-3`). Those eleven are PRE-EXISTING and this change
does not touch them. `today` at `6074c4f` is `661 / 0`, so the five ARE new and
the author is right to call them the deviation rather than a pre-existing red.

I also confirmed the author's bounding claim: with ONLY `workout-host.mjs`
reverted to `6074c4f` and `today-bindings.mjs` at HEAD, `today` is still
`656 / 5` (`%TEMP%\R-today-tb.log`). `today-bindings.mjs` alone causes all five;
moving `workout-host.mjs` adds no additional failing cell.

Extra, outside the bar: `m3/w6/host/test/*.test.mjs` 48 / 0, confirmed.

### 1.3 NOTHING STOPPED

`git diff --numstat 6074c4f..HEAD -- rebuild/engine rebuild/coach
rebuild/DECISIONS.md` is EMPTY. Confirmed by me.

## 2. IS THE LAW CHANGE EXACTLY "ADMIT v2 BESIDE v1 WITH IDENTICAL CHECKS"?

YES. `engine-history.cjs` changes ONE expression:

    -   if(!layout||layout.profile!=='earned/captured-lift-layout/v1'||...
    +   if(!layout||!LAYOUT_PROFILES.includes(layout.profile)||...

`LAYOUT_PROFILES` is a two-element frozen-by-convention literal, so the law is
still CLOSED: I probed a third profile string and it refuses (section 4).
Everything else on that line and every line after it is byte-identical:
`same(layout.producer,capture.producer)`, `same(layout.basis,capture.basis)`,
`text(layout.correspondence_profile)`, `Array.isArray(layout.slots)`,
`layout.slots.length!==capture.slots.length`, and then per slot the key, the
lift, the position integer, the per-lift position run with no gaps, and the
effort target parsed strictly and compared with `same`. I read the whole block
against `6074c4f` and there is no v2 branch anywhere: there is one branch and
it now accepts two profile strings. The v2 slot's `prescribed_load` is read by
NOTHING in this file, which I confirmed by reading every use of `mapped`.

`engine-capture.cjs` is UNCHANGED (not in the diff). The v1/v2 producers, their
layout profiles, `readLoad`, `readLayout`'s whole-producer equality at :118-119
and the `:66 ENGINE_CAPTURE_LOAD_UNPROVEN` refusal are all the accepted bytes.

`today-bindings.mjs` moves ONE member of `PRODUCER`: `rule_profile` from
`Adapter.PROFILE` to `Adapter.CONFIGURATION_PROFILE`. `app_build`,
`engine_build` and `source_schema` are unchanged, which is the premise the host
dispatch stands on.

`workout-host.mjs` adds `readerFor`. I read it as an attacker would. The
predicate requires the capture's producer to be a plain object, with EXACTLY
the page identity's key count, EXACTLY its key names, and `JSON.stringify`
equality on every field but `rule_profile`, which need only be a string. The
sibling adapter is then minted from THIS installation's identity spread over
that one string, never from the capture's object, and the factory itself
refuses any `rule_profile` outside the two it knows (the `catch` falls back to
the page's own adapter, which then refuses). `readLayout` still runs its whole
producer equality on every capture. A getter on `producer` cannot buy anything:
the two reads are cross-checked by that equality, so a disagreeing getter can
only produce a refusal, never an admission.

One dead-end I checked and cleared: `start.prescription_capture?.producer` on a
capture-less start yields `undefined`, `isSibling` is false, the page adapter
is used, and `readLayout`'s `basis` descriptor check refuses exactly as before.

## 3. THE FLIPPED CELLS: INVERSIONS, NOT RELAXATIONS

I diffed every test file that moved. D-RS-q1b goes from
`{phase:'blocked', code:'WORKOUT_PREPARATION_INVALID'}` to a `deepEqual` against
the v1 read; q1c from "cannot record a whole workout" to `recorded === 21` plus
`{phase:'ready', total:27}`; D-RS-h and D-RS-BAR-b from asserting `blocked` /
`ENGINE_CAPTURE_LOAD_UNPROVEN` to asserting `ready` AND the file's own L total
with `assert.notEqual(fileL, phoneL)` guarding against a vacuous pass; q1d from
`PRODUCER.rule_profile === Adapter.PROFILE` to `=== CONFIGURATION_PROFILE` with
`assert.notEqual(Adapter.PROFILE, Adapter.CONFIGURATION_PROFILE)` kept. q1a
names V1 explicitly because the default moved, which is required, not a dodge.
Every flip states in its own comment what it used to measure. No assertion was
deleted without a stronger one taking its place. No `skip`, `only` or `todo`
appears anywhere in the diff, and no U+2013 or U+2014 appears on any added line
(both checked mechanically over the whole diff).

## 4. MY OWN PROBES

Scratch, uncommitted, at `rebuild/lanes/d/_review-probes/probe.test.mjs`.
Nothing stubbed: the page's own era, the page's own gym card, the page's own
host and the host's OWN `historyProjector` (the one carrying the sibling
dispatch, which the author's parity cells do not drive). `4 / 0`
(`%TEMP%\R-probe.log`).

**PROBE A/B - a v2 layout whose slot count differs, and a v2 layout whose
producer identity is v1's.** All three tampers (one extra slot, one missing
slot, `producer` replaced by the V1 identity) refuse
`WORKOUT_CAPTURE_LAYOUT_UNPROVEN`. The untampered control projects. PASS.

**PROBE C - a v1 capture recorded BEFORE the change, read AFTER it.** V1 here
IS the pre-change shipped page, byte for byte. The WHOLE projection object
(not just the card) under the v2 page is `deepEqual` to the projection under
the v1 page; slot count equals the recorded total; the performed entry's
`correspondence_profile` still says v1, so the stored capture still answers for
its own producer and is not silently re-badged. PASS, and this is the owner's
own case.

**PROBE D - a mixed history.** One device: a v1 session on the L day, then a v2
session on the U day, read under the v2 page. Both sessions project, in day
order, `correspondence_profile` is `[v1, v2]` in that order, the two slot
counts are each session's own, and every slot of both sessions is `performed`.
PASS. Reconciliation is not asked for.

**PROBE E/F/G - the dispatch is not a door.** I restated the stored capture's
producer in BOTH the history operation and the authenticated generation's `ops`
collection, because otherwise `engine-order.cjs:80-81` refuses first and the
dispatch is never reached. Results:

| forged producer | refusal |
|---|---|
| foreign `app_build`, `rule_profile` v2 | `ENGINE_CAPTURE_PROFILE_INVALID` |
| third `rule_profile` (`.../v3`) | `ENGINE_CAPTURE_PROFILE_INVALID` |
| extra producer field | `WORKOUT_CAPTURE_INVALID` |
| producer missing `source_schema` | `WORKOUT_CAPTURE_INVALID` |
| a v2 capture RE-LABELLED v1 | **ADMITTED** (see NOTE 2) |

**PROBE (the deciding cell), driven by me at HEAD.** D-L2-c, D-RS-h and
D-RS-BAR-b all green in my own run. D-RS-BAR-b passes on BOTH days: the U card
ready with the file's U total, the L card ready with the file's L total, each
guarded by `assert.notEqual(file, phone)`. D-L2-c proves every slot of the L day
and that the `BW` raise and the `hold` hack each prescribe
`{kind:'configuration', configuration_key:<key>}` with the key as the display.

## 5. NOTES

**NOTE 1 (the deviation, and the seal gate).** The five `today` reds are
`food.test.mjs` N1.18, `machine-settings-ui.test.mjs` S10, `problem.test.mjs`
N2-08 and the two `setup.test.mjs` re-pin cells. I read the guard itself
(`setup.test.mjs:2336-2405`): a moved B-NTC pin is exempt only while it stands
at the post-image that some package in `CHILD_SPECS` (`H3, S3, S4, S5, S6, S7`)
DECLARES for it. Both `today-bindings.mjs` and `workout-host.mjs` are B-NTC
product pins (`packages/B-NTC.json`); `engine-history.cjs` is not, which is why
it costs nothing. `packages/S8.json` does not exist on this branch. The author
is right that minting it and appending `'S8'` here would be issuing his own
licence for his own move, and the S4/S5/S6/S7 comments in that same cell show
the repo's own precedent is that the RESEAL package declares, not the product
lane. PM ACTION: S8 must declare both files at their new posts and append `'S8'`
to `CHILD_SPECS`. Do not seal until it does. Nothing here is a product defect.

**NOTE 2 (the one thing my probes found that the cells do not cover).** The
sibling dispatch picks the reading adapter from the capture's OWN stored
`rule_profile`, and NOTHING cross-checks that claim against the capture's body.
A capture written by the v2 producer whose stored producer is restated as v1 is
read by the v1 sibling, which never calls `readLoad`, so its typed loads go
unexamined and the performed entry's `correspondence_profile` reads v1.
BOUNDED, and why I did not make it blocking: (a) it is not reachable through any
product path, because the producer is pinned by the authenticated generation and
every other producer tamper I tried refuses; (b) I measured the consequence and
the PERFORMED SLOTS ARE IDENTICAL either way, since the shipped law reads no
`prescribed_load` at all, so the only thing that moves is a label; (c) the
candidate already names the missing tie:
`m4/spec/configured-history-candidate/construct.cjs` inserts
`if(typedLoad&&(layout.correspondence_profile!=='earned/engine-workout-capture/v2'
||capture.producer.rule_profile!==layout.correspondence_profile))fail(...)`.
PM ACTION: whoever carries a typed load onto the performed side MUST carry that
tie with it. Until then this is a label, not a fact.

**NOTE 3 (same root).** `engine-history.cjs` checks
`text(layout.correspondence_profile)` and nothing more, and the layout's
`profile` is not compared to the producer's `rule_profile`. In product the
adapter derives both from one identity so they cannot disagree; the looseness is
only reachable from a hand-built layout. Worth one line in the S8 brief.

**NOTE 4 (a real product consequence of the default move, not a defect).** Under
v2 the producer accepts ANY non-empty trimmed string as a working load, not only
a finite non-negative number. That is the whole point for `BW` and `hold`, and
`engine-capture.cjs` is accepted code. But it means a corrupt string load now
opens a card displaying that string instead of refusing
`ENGINE_CAPTURE_LOAD_UNPROVEN`. The load-mapping guards are intact. The PM
should know the trade was made on purpose.

**NOTE 5 (a cell edit worth naming).** In `848512c` the author rewrote D-L2-c's
all-slots probe: where `2d0fe12` used the page's own
`next.booted.workout.gymHost.host`, HEAD composes a host over
`admittedLocalSourceBasis(...)`. I accept the stated reason (the page's gym
model rebases onto the adopted basis) and the edit is a net STRENGTHENING: it
adds `prepared.view.slots.length === fileL` and finds the two lifts by their
own load rather than by hardcoded ids. The deciding assertion of the cell, the
PAGE's own card being `ready` with the file's L total, is unchanged and is what
carries the product claim. Naming it because a red-first run at `2d0fe12` and
the green run at HEAD are not driving byte-identical cells.

**NOTE 6 (confirmed, author-declared).**
`m4/spec/configured-history-candidate/construct.cjs:6` patches the exact
v1-only law string that no longer exists, so it will now throw
`Unique projector edit`. I read the file and confirm it. Env-gated, in no bar
row, deliberately untouched. It must be re-pointed before that candidate runs
again.

**NOTE 7 (pre-existing, out of scope, flagged).**
`source-admission.mjs:597-600` composes its own projector and mints its reading
adapter from the capture's OWN producer object, gated only on `rule_profile`
being one of the two. That is MORE permissive than the host's sibling rule,
which pins every other field to this installation. It predates this ticket and
the author correctly did not touch it, but the two paths now differ in strength
and someone should decide whether that is intended.

**NOTE 8.** `entry.load` is null for a configuration lift and a typed load is
still not carried onto the performed side. Author-declared, lane C design, card
opens and prescribes regardless. Confirmed, not blocking here.

## 6. COULD NOT VERIFY

1. **DECISIONS:521 and :522 are not on this branch.** `rebuild/DECISIONS.md` at
   `6074c4f` and at HEAD is 520 lines and its last entry is the P3-REAL-SHAPE
   DISPATCH. Every `DECISIONS:522` citation in the three product comments and in
   the cells, and the quoted ruling language the parity cells rest on
   ("byte-for-byte the same checks v1 gets"), is therefore UNCHECKED from here.
   The lane is forbidden to touch that file, so this is not the author's fault,
   but the PM should confirm the two lines say what this build says they say
   before sealing.

2. The author's extra runs I did not repeat: `m4/workout` with
   `PERFORMED_W6_DIR` set (claimed 223 / 11 with a byte-identical failing set)
   and `configuration-capture.test.cjs` executing 8 of 9 green. I did confirm
   that file is one of the module-load failures in the plain `m4/workout` row,
   before and after, unchanged.

3. Anything requiring the private census, the ledger, the owner's port
   directory or a real device. Not read, not looked for, per the handoff.

## 7. RECOMMENDATION

ACCEPT `0b5dbec` and hand the byte-pin deviation to S8. The owner's LOWER day
opens: his existing v1 sessions still project unchanged (PROBE C), his new v2
sessions project (PROBE D), and after the real-shape import his L card is ready
with the file's own set count and his bodyweight raise and held hack each
prescribe their own key (D-L2-c, D-RS-h, D-RS-BAR-b, all green in my run). Do
not seal until `packages/S8.json` declares `today-bindings.mjs` and
`workout-host.mjs` and `CHILD_SPECS` names it; until then the `today` row is
656 / 5 and that is a declaration gap, not a broken product.
