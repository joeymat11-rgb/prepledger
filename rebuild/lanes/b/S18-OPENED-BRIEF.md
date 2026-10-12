# S18 OPENED - brief (M2-S18-OPENED)

Package: M2-S18-OPENED, an UNSEALED `--ci` child of the SEALED M2-S14-HOLD (artifact
rebuild/m4/spec/acceptance-s14-hold.json, receipt DECISIONS:932), the S12/S13/S15/S16/S17 shape. It carries
every byte M2-S17-POLISH declared and the one data change below. It moves no rebuild/engine byte, declares no
D-id and no gate supersession; no seal, receipt or VERDICT; the coach ENGINE_REVISION stays M2-S14-HOLD's.

## Why a new id
M2-S17-POLISH merged onto rebuild/t2-client-core (DECISIONS:952). A later diff no longer adds
packages/S17.json at status A, so the sealed-inventory fence would fence it as an ordinary branch (its F3
rule, row (8g)), exactly as at DECISIONS:943 and :947. S17 is retired by supersession in the same shape:
S17.json stays as the record with its claim withdrawn (decided false, chosen null, a note); 'S17' leaves
b-package.cjs IDS and NO_REGISTER_IDS and 'S18' enters both (F6 pins moved red first); CHILD_SPECS in the
five reading cells gain 'S18'; S18-REGEN and its test are the port of S17-REGEN's; rebuild.yml's standing
step runs `--package S18` and gains the S18-REGEN.test step. S17-REGEN is dead.

## The change: an opened, EMPTY workout gives way to a change that starts today
(PM ruling on capture 4 of db6a054: opening the set screen with nothing logged counted as "started" and
refused the owner's own request, switching today's Lower to Upper.)
- What begins a day. A workout of a day has begun once something of it is RECORDED that day: a set, a skip
  or a close (plan-edit-model.cjs begunOn, the one reader the saving host and the projector share; it
  replaces S17's startedOn). A Start alone does not begin the day. A skip or a close counts with a set
  because a session that holds one cannot be removed under the narrow shape below, so a day that has one
  must stay closed. The basis's own history of that day still closes it; a change still waiting for a
  later day still closes it (PLAN_EDIT_TODAY_AFTER_PENDING).
- The save. When a change that starts today is saved and today holds an opened, empty session (a Start with
  no set, skip or close in any status), routine-host.mjs first removes that Start with the writer's existing
  removal (action remove, a class session tombstone, written through a gym host standing on today:
  gym-model.mjs discardOpenedEmpty), then saves the change. The record keeps the Start bytes; the engine
  order skips a removed Start (engine-order.cjs, unchanged). The page then re-opens on today (S17), Today
  shows the new workout and Start opens a fresh session on the new basis. A session that recorded anything
  is refused by name (PLAN_EDIT_TODAY_STARTED) and nothing is written.
- Not atomic, ordered. The two writes are separate commits on this client (the plan-edit stage admits a
  batch of exactly its one plan operation), so they are ordered: removal first. A stop between them leaves
  today's workout ready to start again on the plan it had, which reads correctly, and the change can be
  saved again. The other order would leave the old workout open under the new plan.
- The client. public-client.mjs workoutHistoryFailure treats as resolved a session whose Start is removed
  (start record excluded, no interpretation issue) and which holds no set, skip or close in any status;
  the device-scope checks still apply to it. Anything else keeps WORKOUT_HISTORY_RECONCILIATION_REQUIRED,
  including a removed Start that holds a set, a skip or a close, and an open session nobody removed.
  public-client.mjs lies outside the S-chain product scope (S18-REGEN's SCOPE, as S12-S17's), so S18.json
  does not declare it; it is named here and reviewed with this brief.
- Today. gym-model.mjs sessionsToday and unfinishedBefore skip removed-Start sessions: neither today's
  workout nor one to recover.
- Replay. A same-day change recorded after a set, skip or close of its day (earlier in device order) is
  deferred to the next local date (S17, Fable l1 D1); after a bare Start it applies from its own day.
- The register. replay-registry.cjs names the session tombstone among the kinds the gym host writes
  (rebuild/m4/workout/commands.cjs, class session, F3), with the removed-Start rule; writer-order.test.mjs
  gains the writer (an empty Start, then Change my routine for today).
- New words (CL-S15-DELTA 43 -> 44, corpus re-measured): the recorded removal reason "Opened on this device
  with nothing recorded, and removed when the routine changed for today."
- Changed cells: model.test.cjs's startOn helper now records a Start and its first set (a begun day under
  the ruling), so the S17 deferral cells keep testing a begun day; openOn is the bare Start.
No rebuild/engine file and none of the protected five moves.

## Fable l1 (6bef7e79) debts, PM ruling
- D1 THE RACE. (a) gym-model.mjs skips only a removed-AND-empty session (sessionsToday and unfinishedBefore): a
  removed Start that holds a set, a skip or a close still surfaces on the recovery screen. (b) The removal is the
  layer's PREPARED edit: public-client.mjs prepareWorkoutEdit admits exactly one more target, an opened, empty Start
  (interpretable, included, no set, skip or close in any status), binds it to the snapshot it was judged on
  (revision + token, the existing editFailure WORKOUT_EDIT_STALE check) with causal parents naming the Start and
  every record of the session read there, and commitWorkoutEdit allows only `remove` on it, with no lift lineage.
  A set landing between the prepare and the commit makes the removal stale: nothing is removed. (c) The second
  tab: a set logged in another tab closes today, the change is refused by name and nothing is removed.
- D2, intended: routine-host.mjs opens a second gym host over the era (on basis.clean) only to remove the empty
  Start; it never prepares or prescribes, and it is closed at once. Hosts on one era serialise on its CAS.
- D3. Every suggestion's own lines say what is agreed to without its reason: an offer names the lift and what it
  sets (next weight, working weight, undo) with the weight for each set; the proposal card names the lift and its
  change, and where the pack has no words for the kind (a set count other than +1, a calorie or reset move, an
  agent volume move) the engine's own title is the change line on an open card (look-cui3 re-pinned: "" -> the
  title).

## The owner's iPhone (2026-10-12): a coach suggestion and the bands at the screen's edges
- "Why?" (the owner: "It should probably have the proposal, and a "why?" Button that you can tap to see that
  paragraph"). Every coach suggestion with a reason paragraph shows its lift, its one-line proposal and its
  own actions; the reason, byte for byte the engine's, is hidden behind a real button "Why?" (aria-expanded,
  aria-controls) until it is tapped, and a second tap hides it. The two such surfaces: Today's proposal card
  (today-app.cjs; one card for every proposal kind) and the next-weight offers (today-entry.mjs), whose Yes
  and Not now answer the offer whether or not Why? was opened. "Why?" is an existing locked piece that gains
  these two owners (CL-S18-REOWNED; corpus re-measured); preview.css S18 block: a hidden reason is never
  drawn, and Why? is a quiet control of the hit height.
- The edges of the installed app (a black bar under the screen, a dark band under the status bar: the stage's
  two paddings left bare by S17's item 7). On a phone the stage keeps no padding of its own and the phone is
  the whole screen, edge to edge (html > body[data-earned-app] .stage outranks preflight.css's stage rule,
  which is unchanged); the screens keep their own safe areas (header max(53px, inset + 6px), every chassis
  stack max(24px, inset)), and the page still never scrolls. With the phone the whole screen, Today's bottom
  fade moves inside the day's 34 px room (--fade-bot-inset 34 -> 14), so Change my routine is never drawn
  faded at the foot of the day (RT-14 re-pinned to the measured value; RT-18 re-pinned to the new rule).

## Evidence
Red first, on the S17 product (2746fb3): model.test.cjs's two S18 cells (a bare Start does not begin the
day, and the replay is deterministic in either operation order; a set, a skip or a close does begin it);
prepared-workout.test.mjs's two S18 cells (an opened, empty, removed Start is resolved and another Start
prepares, the removed Start kept byte for byte; a removed Start holding a set, a skip or a close still
refuses); routine.test.mjs RT-19 (opened, empty, then Start today: the removal then the change, Today shows
the new workout, Start opens a fresh session on it) and RT-20 (removal first: the state a stop between
leaves reads as a workout ready on the old plan; a session with a set is never removed). RT-17 (one set
logged: refused, tomorrow still saves) unchanged. RT-21 (the proposal card's Why?), RT-22 (an offer's Why?, and
Yes answering it unopened), RT-23 and the re-pinned RT-18 fail on the S17 today-app.cjs, today-entry.mjs and
preview.css and pass on these; a deployed-shell probe at 390x844, 393x852, 430x932 and 402x781 reads the
phone covering the viewport exactly (top 0, bottom the viewport) and Change my routine never drawn faded:
24 of 24 (20 of 24 on the S17 stylesheet); the layout invariants stay 76 of 76. D1: prepared-workout.test.mjs's
D1 cell (prepare, a second client logs a set, commit refused WORKOUT_EDIT_STALE, nothing removed; only remove;
the removal names the Start) fails on the S17 client; RT-24 (the recovery screen skips only removed-and-empty)
fails on the S17 card; RT-25 (the second tab) passes on both. D3: look-cui3's re-pinned cell fails on the S17
card. The plan-edit mutant witness gains two mutants (a bare
Start begins the day; only a set begins it): 22 of 22 killed.
At the PM seat (they load protected files): plan-edit-import.test.mjs PE-I4 (an opened-empty-then-switched
day, then the import: ADMITTED, F10 answers for the change, the removed Start and its removal kept byte for
byte) and writer-order.test.mjs's new writer in both orders (P3-WO1, P3-WO2).

## Acceptance
At the exact head: the fence's real row reports FENCE-RESEAL-CHILD S18 (skip); `node
rebuild/lanes/b/tooling/b-package.cjs --ci --package S18` reports PUBLIC CI EVIDENCE PASS; hosted rebuild
green on ubuntu and windows. No check, pattern, pin or fence is loosened; no test is skipped or deleted.
