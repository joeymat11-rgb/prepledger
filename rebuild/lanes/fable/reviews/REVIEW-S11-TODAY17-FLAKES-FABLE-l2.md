# REVIEW-S11-TODAY17-FLAKES-FABLE-l2: today-17 flakes round 2 (support.mjs v2, gym/setup/problem)

Tree C:\Users\joeym\AppData\Local\Temp\earned-s11int, HEAD d7b4cc2, git status = the five M rows, no stray files.
Reviewed by `git diff` against HEAD: measure/test/support.mjs (+91/-? net, disk 3eaf32d5), today/test/gym.test.mjs
(464d6fb9), setup.test.mjs (ad1574f9), problem.test.mjs (ccce9127). All four: CR count 0, non-ASCII byte count equal
to HEAD (support 0/0, gym 204/204, setup 32/32, problem 47/47). rebuild.yml ignored as instructed. Nothing edited.

## (1) Each hunk: real event awaited, no hang, no vacuous pass
- gym A2 (log): mounts with onChanged and waits `changes > before`. gym-app.mjs logOutcome:438-449 is the only
  onChanged on this path and runs AFTER `await paint()` (readView -> renderSaved -> show), so `saved-facts` is on
  #phone when it fires. `before` is captured just before the click, so an earlier fire (the 'ready' path, undo)
  cannot satisfy it; `kit.model.start()` is awaited before mount so the first paint is 'active'. Bounded 30 s,
  GYM-CARD-NEVER-ANSWERED. Not vacuous.
- gym A2 (refusal): waits for #gym-error text. The effort click before it clears the text (:415) and renderActive
  writes it only from view.message, so a non-empty text is this click's; assert.match still checks the words. The
  busy flag: deliver -> logOutcome (sync write) -> execute resolves -> .finally(workoutBusy=false) is one microtask
  drain (underRefusal is synchronous, :66), and the poll is a 1 ms macrotask, so the next click is never swallowed.
- typeWaist: laneAnswer on a NEW record of this click (index = length before click), then table present. The
  record's .then is registered inside observed() before saveWaist's `await lane.save` (measure-screen.mjs:89), so on
  the macrotask turn where answered is seen, saveWaist has already repaint()ed a fresh table-less section; a table
  seen after that comes from reads begun after the ack. No save record (screen-side refusal) = 30 s
  MEASURE-SETTLE-DEADLINE. Only journey.test.mjs imports typeWaist/pickMarkersOnScreen; no caller expects a refusal.
- pickMarkersOnScreen: laneAnswer on markerSaves then `!pick('measure-marker-pick')`; pickMarkers awaits
  lane.saveMarkers then repaint (:101-103), same shape. Callers' own named waits follow. D1 quiet(phone) gone.
- laneAnswer: rejection -> MEASURE-LANE-REJECTED, non-ok -> MEASURE-LANE-REFUSED; host.save/saveMarkers return
  {ok:true,...} (measure-host.mjs:192, :222). D2 closed. The rejection handler on the record does not swallow the
  screen's own rejection (pending is returned untouched).
- setup A4, problem P0C.1/S6C.3/S6C.4: wait `api.screen()==='today'`. today-entry.mjs onDone:139-142 awaits
  host.save, then refresh, then done(); today-app.cjs done():1743-1755 arms the gate, settleAdoption, then
  render('today') sets `screen` synchronously (:1715). Screen is 'setup' before each click (api.render('setup')),
  so the wait cannot be met early; a refused save never lands -> SETUP-NEVER-LANDED at 30 s.

## (2) Assertions, expected values, tolerances, deadlines
None weakened or removed. Every assert after the old sleeps is byte-identical; gym's refusal cell GAINS
`changes === 0`; the week-by-week deepEquals, waitForTrialTable, tableOf, header/row counts in journey are
untouched; MEASURE_SETTLE_DEADLINE 30 s unchanged; the new loops add 30 s ceilings where there was no ceiling.
The old typeWaist "table text changed" pre-condition is replaced by a stronger one (lane answered ok).

## (3) Test vs product (gym): TEST defect, confirmed on the product path
After an ok logSet the card keeps the active screen (workoutBusy true until execute's finally, which is after the
saved paint) and renderSaved always `put`s saved-facts. jsdom has no indexedDB, so no settings-lane repaint can
race readSequence here. The old cell read `kit.model.read()` queued behind the write and saw 'saved' before the
card's own second read painted. One product observation, NOT this flake: deliver() returns silently when the
Log control is detached and continuedLogBinding finds no handoff (gym-settings-lane.mjs:224-232); then the set is
stored but no saved screen is painted until the next repaint. Pre-existing design, outside this ticket.

## (4) Sweep list: honest. Spot-checked SAFE
- problem tap() :77: the click handler awaits only the injected `async writeText` stub (today-app.cjs:1650-1651),
  microtasks; one setTimeout(0) covers it. SAFE.
- problem P0B.9 (:893-:897): no sleep at all; `workout.gym.start()` is called synchronously after mountToday,
  inside the 300 ms delayed adoption. SAFE.
- support.mjs go(): all three callers (journey :37, :52, :80) pass `until`; the quiet fallback is dead. SAFE.
- gss-annex-remount: the lines listed SAFE (:127/:154/:218/:325) are settle() after within(pending) whose promise
  resolves only after execute's finally; the open/cancel/add clicks (:56/:96/:172/:226/:283/:297/:306) are correctly
  in the RISKY list. The copy.test.mjs :577 gym twin and checkin's 50x2 ms settle are named, not hidden.

## (5) Pins and seal checks: mechanism verified
Both red cells read the DECLARING-SPEC CHAIN, not a hash list: setup.test.mjs:2387-2437 (declaredPost over
packages/{H3..S11}.json, youngest first, against B-NTC.json product) and boundary.test.mjs:155-222 (same chain
against S4.json product; its named set at :261-:267 excludes /test/ paths). My runs: setup 156/157, the one red is
re-pin :2400 naming rebuild.yml + gym.test.mjs; boundary 6/7, red is (g) naming rebuild.yml + gym + setup +
problem; gym 65/65; problem 134/134; journey (a)(d)(e) 3/3 (49-51 s each, cold).
S11.json already carries a row for all five: rebuild.yml edited post 0c861be9, support.mjs carried f72c6176,
gym.test.mjs carried 79aa531e, setup edited post c0562fd5, problem edited post 598ef752 (acceptance-s11 agrees).
S11-REGEN.cjs --write rewrites ONLY packages/S11.json: product post = sha at git HEAD (:308), role carried->edited
when pre != post (:314), the PRODUCT MAP note and runnerSha256. It REFUSES while disk differs from HEAD
("disk differs from HEAD (commit first)", :327) and needs --parent and --receipt-line. So the order is: commit the
five files; `S11-REGEN.cjs --parent <S10 seal> --receipt-line N --write`; commit S11.json. That alone turns both
cells green (they read S11.json). Files that must change: (a) the five edited files, committed; (b)
rebuild/lanes/b/tooling/packages/S11.json (five product rows, PRODUCT MAP note); (c) at seal, by the runner, not by
hand: rebuild/m4/spec/acceptance-s11-native-load.json (product rows and executionPins :2236-:2241 for
gym/problem/setup), review-s11-native-load.json, receipts/S11.json. No test holds a hand-maintained sha list for
these files (b-ntc-journeys.cjs pins gym against B-NTC.json but is a carried file, not an S11 child argv).
Debt: S11.json notes[APPLIED] :2174 says "These are the final product bytes"; REGEN's STALE regex will not flag it,
so the PM re-authors that sentence by hand at the REGEN commit.

VERDICT: ACCEPT WITH NAMED DEBTS (the RISKY list in the builder's report (D) unchanged; the :2174 note sentence;
the deliver() no-handoff observation in (3) as a product note for a later ticket, not this one)
