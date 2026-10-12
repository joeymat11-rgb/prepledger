# S17 POLISH - brief (M2-S17-POLISH)

Package: M2-S17-POLISH, an UNSEALED `--ci` child of the SEALED M2-S14-HOLD (artifact
rebuild/m4/spec/acceptance-s14-hold.json, receipt DECISIONS:932), the S12/S13/S15/S16 shape. It carries
every byte M2-S16-POLISH declared, the S17 polish and the same-day routine change below. It moves no rebuild/engine byte, declares no
D-id and no gate supersession; no seal, receipt or VERDICT; the coach ENGINE_REVISION stays M2-S14-HOLD's.

## Why a new id
M2-S16-POLISH merged onto rebuild/t2-client-core (DECISIONS:944). A later diff no longer adds
packages/S16.json at status A, so the sealed-inventory fence would fence it as an ordinary branch (its F3
rule, row (8g)), exactly as at DECISIONS:943. S16 is retired by supersession in the same shape: S16.json
stays as the record with its claim withdrawn (decided false, chosen null, a note); 'S16' leaves
b-package.cjs IDS and NO_REGISTER_IDS and 'S17' enters both (F6 pins moved red first); CHILD_SPECS in
the five reading cells gain 'S17'; S17-REGEN and its test are the port of S16-REGEN's; rebuild.yml's
standing step runs `--package S17` and gains the S17-REGEN.test step. S16-REGEN is dead.

## Product A: polish (the owner's iPhone captures of 2026-10-12, Hack squat set 1; preview.css only)
1. The set screen's effort row, Log and the clean-rep help are one bottom bar on the scene's surface with
   a hairline above, in the column under the scrolling body and never over it, keeping the bottom safe
   area. The body ends at the bar and keeps 20 px of room under its last card, so at any height the last
   card scrolls fully clear and nothing is drawn behind the bar. While a set is open, the next-weight
   panel holding only its Check button steps aside (the check belongs to the recorded workout, where it
   stays; an offer, a status or a notice still shows).
2. The engine's reason (the instruction under the lift name) is shown whole, wrapping; the round 6 clamp
   is removed (RT-13's clamp cell now asserts its absence).
3. "Setup" is W-14's link to the engine's setup sentence: it now sits straight under the machine row with
   even room above and below, instead of floating above the check-in row.
4. The workout header's "example" pill (the design board's static marker, drawn whatever the data) leaves
   the athlete's screen and stays in the document; Today's bound example-pill slot is left alone.
5. The recorded workout's Back to Today is the same kind of bar, so an offer passing under it reads as
   scrolling; at the end of the scroll every offer stands above it.
6. Today: the weigh-in dot sits on the centre of its row; the day keeps 34 px above Start at the end of
   its scroll.
Product A moves no JavaScript and adds no words.

## Product B: a routine change may start today (PM ruling on the owner's "I wanna hit upper on Mondays now")
- When today's workout has not begun on this device (no session-start of today on the record, no session of
  today in the basis's history) and no saved change still waits for a later day, the editor offers "Start
  today" (the default) or "Start tomorrow" before every save, with the date shown. Otherwise it offers
  tomorrow only and says why in one plain line.
- A change saved for today is adopted at once: the page re-opens on today the way the midnight rollover
  re-opens it (today-entry.mjs boot: teardown, then boot; PAGE_PINS re-pinned by measurement), and Today
  shows the new workout (Tuesday becomes Upper and the gym card prepares Upper).
- Data rules. plan-edit-commands.cjs validate() admits starts_on equal to effective.local_date or the next
  local date and nothing else (every op recorded before S17 is next-day and validates and replays as it did;
  F10 admission, which judges with this validate(), admits both). plan-edit-host.mjs dates a same-day review
  only on request and only while today is open, re-judges it at Save and in the stage over the generation it
  commits on, and refuses PLAN_EDIT_TODAY_STARTED or PLAN_EDIT_TODAY_AFTER_PENDING, writing nothing.
  plan-edit-model.cjs holds the begun-day rule on every replay through one shared reader, startedOn(): a
  same-day change recorded after a session-start of its day (or over a basis session of that day) is
  DEFERRED and applies from the next local date, exactly as a next-day change would (PM ruling on Fable l1
  D1). The read never refuses for it, the change is never dropped, nothing new is recorded and the begun day
  keeps its basis. Start dates stay in order, judged on the date each change applies from
  (PLAN_EDIT_DATE_ORDER_UNPROVEN); two same-day saves compose; history is never rewritten.
- New words (CL-S15-DELTA 38 -> 43, corpus re-measured): Start today; Start tomorrow; Changes start today,
  DATE.; Today's workout has started, so this starts tomorrow.; A change already starts tomorrow, so this
  starts tomorrow too.
- Changed cells: RT-05 now chooses Start tomorrow before its tomorrow path (today is the default). The
  plan-edit mutant witness gains four mutants (same day refused; deferral removed; deferral refused; order
  judged on the recorded date) and names lift-correspondence.cjs in its closed list (missing since
  P3-REAL-SHAPE, which left every model mutant unloadable); future-applies-today keeps its mutation on the
  moved line (`from <= date`): 20 of 20 killed.
No rebuild/engine file and none of the protected five moves.

## Review debts (Fable l1, d6580065)
- D1, resolved by the PM ruling above: a hand-built record with a same-day change after its day's session
  start no longer loses every routine change; it replays as next-day.
- D2, recorded, no change: a same-day save re-opens the page, so an unsaved gym draft (not yet a started
  session) is dropped.
- D3, recorded, no change: routine-host.mjs falls back to today_code PLAN_EDIT_READ_REFUSED when the host
  cannot judge today; the editor words only TODAY_STARTED and TODAY_AFTER_PENDING, so that case offers
  tomorrow only with no reason line.

## Evidence
Red first: RT-14 (new) and RT-13's clamp cell fail on the S16 stylesheet and pass on this one; RT-15, RT-16,
RT-17, RT-05's tomorrow step and five model cells fail on the S16 product and pass on this one (PE-I3, the real
admission of a same-day change, runs at the PM seat); the two D1 cells (the deferral, and Today keeping every
other change) fail on the refusing rule and pass on the deferral. Builder-seat
layout probe at 390x844, 393x852, 430x932 and 402x781 (a 402x874 phone less its safe areas): 76 of 76
invariants pass (23 of 76 on the S16 stylesheet). No :is() selector list carries a font size (the 16px
law's parser).

## Acceptance
At the exact head: the fence's real row reports FENCE-RESEAL-CHILD S17 (skip); `node
rebuild/lanes/b/tooling/b-package.cjs --ci --package S17` reports PUBLIC CI EVIDENCE PASS; hosted rebuild
green on ubuntu and windows. No check, pattern, pin or fence is loosened; no test is skipped or deleted.
