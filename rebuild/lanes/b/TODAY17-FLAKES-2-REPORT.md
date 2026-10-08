# today-17 flakes, round 2: gym A2, the two support.mjs debts, and the sweep

Tree earned-s11int (rebuild/b-s11-integration, HEAD d7b4cc2). Nothing committed; rebuild.yml edit untouched.
Scratch: %TEMP%\s11-p17 (mk-gym.mjs, mk-file.mjs, p17-gym-slow.mjs, p17-slow-crypto.mjs, delay-host.mjs).

## Touched files (for REGEN; all LF, non-ASCII byte counts unchanged from HEAD)
- rebuild/m3/w7-preview/measure/test/support.mjs   sha256 3eaf32d5803f9038eb4e83495b4a7f63090d755c351e0fb2f4fe69b7c93301c8
- rebuild/m3/w7-preview/today/test/gym.test.mjs     sha256 464d6fb956c274f3c7b281ac09ffd9657803e8cba2bb98b6cab7dfdece4325a7
- rebuild/m3/w7-preview/today/test/setup.test.mjs   sha256 ad1574f9d0874ff985ae2188345659da7cb8440c4d7b35ac508275f14eb464f3
- rebuild/m3/w7-preview/today/test/problem.test.mjs sha256 ccce91272afbb74364b9e864db77b9488d8bc0c9d66d01ab0b7d842bf07d8d0c
REGEN MUST DECLARE gym/setup/problem: they are S4-sealed, and gym is also B-NTC-pinned. Until then
boundary `not ok 4 - P-MEASURE (g) - no S4-sealed file drifts...` names rebuild.yml + those three, and
setup `not ok 151 - re-pin - every file the B-NTC package pins...` names rebuild.yml + gym.test.mjs.
Those are the seal cells reporting the edits, not regressions. support.mjs is not S4-sealed.

## (A) gym.test.mjs "A2 - the gym screens render..." > "choosing an effort, then logging..."
Mechanism: the log click runs dispatch -> model.logSet (durable) -> deliver -> logOutcome ->
`await paint()` (a second durable read, hooks.readView) -> renderSaved -> onChanged (gym-app.mjs
:438-449, :554-596). The cell slept 60 ms, then did its own `kit.model.read()`. That read is queued
behind the write, so it answered phase 'saved' while the card's repaint read was still in flight.
`saved-facts` was null, giving "Cannot read properties of null (reading 'textContent')". The 20 ms
refusal cell next to it has the same shape.
Verdict: TEST defect. The user keeps seeing the active set (with workoutBusy blocking a second log)
until the saved screen paints, and the card always ends on it. readSequence lets only the newest read
install, and no settings lane opens here (jsdom has no indexedDB). No screen without the element is left.
Fix (test-only): mount with `onChanged` (the card's own "saved screen painted" signal; renderActive
calls it after `await paint()`); the log cell waits for it, the refusal cell waits for #gym-error to
carry text and also asserts onChanged did not fire. Both waits fail at 30 s with
GYM-CARD-NEVER-ANSWERED. Every original assertion is kept.
Red-first (only the model the card is mounted with is slowed; the cell's own reads are real speed):
- HEAD, card reads +100 ms, x3: `not ok 3 - choosing an effort, then logging...`, error
  "Cannot read properties of null (reading 'textContent')" (the hunter's exact error), 3/3.
- HEAD, card logSet +40 ms: not ok 2 (refusal regex did not match) and not ok 3.
- HEAD, no delay: ok. Fixed file, no delay / +100 ms read x3 / +40 ms log: all `ok 1..5`.

## (B) D1 pickMarkersOnScreen: quiet(phone) removed
measure-screen.mjs pickMarkers awaits lane.saveMarkers and then repaints, the same way saveWaist
does. page() now records saveMarkers too, and pickMarkersOnScreen waits for that answer
(laneAnswer), then for the pick screen to be gone. The next screen is waited for by the caller's own
named condition (typeWaist's boxes, or waitForTrialTable).
## (C) D2 rejection is never "answered"
A record holds answered/result/rejected. laneAnswer(log, i, what) waits on settle's deadline, then
throws MEASURE-LANE-REJECTED on a rejection and MEASURE-LANE-REFUSED on a non-ok answer, so typeWaist
and pickMarkersOnScreen stop at once.
Evidence (11th waist save rejected): the old wrapper read the table with the save counted as answered;
the new one stopped first. Both also red via the screen's unhandledRejection 'P17-INJECTED-REJECTION'.
Journey 15/150 stress with final support.mjs: 5/5 `ok 1 - P-MEASURE (a)`, answered=11.

## (D) Sweep of the 23 today-17 files (sleep or counted/stillness wait, then a hard assert)
FIXED, red-first then green (slowed subtle.encrypt +80 ms, which makes the durable write slow):
- setup.test.mjs:1472 (A4) and problem.test.mjs P0C.1 (:989), S6C.3 (:3251), S6C.4 (:3280): a 50 ms
  sleep, then a durable read or `api.ready`. HEAD +80 ms: all four red ("the record holds the first
  run", "the transition armed a NEW adoption chain", "...transition, unchanged", "the first load ended
  on Today"). Fixed: wait for api.screen()==='today'. onDone runs save -> refresh -> done(), and done()
  arms the chain and renders Today synchronously. 4/4 ok at +80 ms and at 0.
- gym.test.mjs:500, :507 (A above).
SAFE:
- problem tap() :77 (only awaits the injected clipboard stub, settled in microtasks). P0B.9 :876 (the
  start refusal is a synchronous gate check). P0C.2 :1026/:1046/:1058 (openWeighIn and render are
  synchronous).
- problem :2077/:2246/:2615/:2626/:2643 (await render('recovery')'s own promise), :2382/:2419/:2774
  (await sleepPending), :3047 (sleepCheckInReady), :3630 (forDate runs on a microtask of the mount),
  :3688 (bootFoodDays is synchronous).
- food :88/:1050/:1150/:1170/:1209 (await foodPending/foodReady first).
- gss within()/painted() waits on promises or conditions. settle(8) after `within(settings.pending())`
  (timing :184/:315, remount :127/:154/:218/:325, g6-g8 :218/:318/:394, log-timing :202/:258) is safe:
  the pending promise covers the outcome, which sets refusal text synchronously or awaits paint().
- Back clicks + settle (leaveCard is synchronous). identity-reentrancy tick(5) follows bounded(pending)
  or a negative assert. msui :1166/:1190/:1213 are negative asserts.
- support.mjs page() quiet after api.ready + measure-tile (the next go() waits on a named state).
  go()'s quiet fallback is unused (every call passes `until`). close()'s quiet is best effort, and
  every cell now ends on its terminal state.
- adapter, catalogue, design.cjs, package.cjs, ntc-h6-delta, native-load-panel, lane, baseline,
  boundary: no sleep or tick waits (package.cjs's shared-.tmp race is hunt 3.1, separate).
RISKY, NAMED DEBTS (not fixed: no single verified signal, or the fix is not small):
- checkin.test.mjs settle() = fixed 50 x 2 ms, 12 sites (:440-:580), then durable/screen asserts.
- copy.test.mjs settle() = fixed 60 x 2 ms (:534 weigh-in refusal, :577 the gym refusal twin of A,
  :606/:614/:625 gym loop, :686-:722 check-in).
- gss settle(8) after a settings-open/cancel/add click, whose paint() does a durable read:
  remount :56 (openEditor), :96/:172/:226/:306, :283/:297; msui :1548/:1553 (types into the editor)
  and :1597 settle(2).
- Counted ceilings on correct conditions (red only as a loud timeout): msui waitFor 400 x 1 ms,
  :1024 600 reads; gss until() 400 x 1 ms; view.test settle 200 x 2 ms. Making these wall-clock is a
  deadline change, so it is left for the PM.

## Normal runs of touched files (tree)
journey tests 3 pass 3; baseline 4/4; gym 65/65; problem 134/134; setup 156/157 (fail = re-pin
cell 151 above); boundary 6/7 (fail = seal cell 4 above).
