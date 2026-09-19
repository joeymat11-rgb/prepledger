# GYM-SETTINGS-WRITER-SEAL specification: independent review, round 1 of 3
Reviewer: Claude (independent lane hand, told to disagree), under DECISIONS:613's reviewer-author loop
Subject: rebuild/lanes/c/GYM-SETTINGS-WRITER-SEAL-SPEC.md at bf6bc062 of rebuild/c-gym-settings-writer-seal-spec
Code read at: e08bc11cec423e5d5878110e78d16ccc5f3f8a29 of rebuild/c-today-split-build
Lane tip cross-checked at: 2df2f32d (the split's live fix round)

## VERDICT: REJECT

Not on accuracy. The paper's reading of the code is the most accurate I have audited on this
lane: 138 file-and-line read claims opened, 134 TRUE, 3 IMPRECISE, 1 FALSE, and all five of its
MEASURED claims reproduce here. It also gets three hard things right that the upstream documents
get wrong, and it says so out loud (F1, F2, F3 below are credits, not defects).

It is rejected on the PM's fourth ground: it is materially larger than THE INVARIANT needs, and
the smaller design is written down in W1 below as a table the author can adopt. The two loads
that do not earn their place are (a) three kinds of sealed token where one holds the invariant,
and (b) event.isTrusted as the admission rule, which is MEASURED here to make every positive
gym-write row unprovable in the node cells while buying exactly one counterexample that a free
static fence row already closes.

Round 2 should be short. Nothing in sections A, C, E, F or H needs rewriting. The changes are
confined to B's entry-point table, B's gesture paragraph, D's row list, and G's third ruling.

BAR: claims checked 138; TRUE 134; IMPRECISE 3; FALSE 1. Probes reproduced 5 of 5 (one partially:
2 of its 4 diff numbers are independently reproducible). Four further probes run by this review.

## 0. What I did

Synced origin/rebuild/c-gym-settings-writer-seal-spec, origin/rebuild/c-today-split-build and
origin/rebuild/c-after-the-cut-tickets into the farm and read there. farm-verify printed PASS on
every sync. Probes ran in a farm scratch worktree of e08bc11c (prefix gss-), one node process at
a time, synthetic inputs only, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York. No store, no
host, no athlete input, no real measurement. Nothing was sealed, no receipt or artifact was
written, no byte under rebuild/engine was touched, nothing on the never-read list was opened.

READ means I opened the cited lines at e08bc11c. MEASURED means I executed it here and the output
is quoted. Everything below that is neither is marked as an opinion.

## 1. Read-claim audit

138 distinct file-and-line citations opened. The four that are not TRUE:

| Claim | Grade | What is actually there |
|---|---|---|
| H, final: "MEASURED pre-transcription check: 216 lines" | FALSE | The file is 226 lines (`wc -l`). ASCII-only, LF-only and final-LF are all TRUE. A self-measurement in the same sentence as three true ones is worth correcting because it is the one number a reader cannot check without the file. |
| F:552-584 "RELEASED_FILES" | IMPRECISE | RELEASED_FILES opens at 552 and the gym-app entry closes at 585, not 584; the array itself continues past 586 with today-app.cjs. Everything the row needs (the three `lane` windows at 574-578, the `settings` holder windows at 571-573) is inside the cited span, so a builder is not misled about content, only about where to stop editing. |
| UI test:455-582 "parity/late editor" | IMPRECISE | 582 is the opening line of the S8 section comment, one past the end of the S7 block being named. |
| F:995-1020 "paint exception" | IMPRECISE | The positive row is 995-1008 and its RED counterpart closes at 1021, so the cited span clips the counterpart's final line. |

Spot-checks worth recording because they are the ones a builder will lean on hardest, and all are
exact to the line: view helpers at 39-57; the helper-plus-comment move span at 36-58 is exactly 23
physical lines (MEASURED, `sed -n '36,58p' | wc -l` = 23); recordSettings plus its adjacent comment
and trailing blank at 254-290 is exactly 37 lines (MEASURED = 37); Producer caps at 33-36; machineOf
at 49-85 (cited 49-84, the body through `return out`); model start 472-493, logSet 502-516, undo
526-533, forget 536, finish 538-546, closeUnfinished 557-575, rebase 160-175, holdForAdoption 140,
every one exact; bridge 8-49 and 61-63, public-client 365/387/458/597-600, repository 239-259 and
300-307, all exact; Split:687-695 is exactly the seven-writer paragraph; Split:1335 and :2047 exact;
the gym card's 19 direct listener sites (MEASURED: `grep -c addEventListener gym-app.mjs` = 19).

S8 key membership (MEASURED by reading acceptance-s8-real-shape.json with node): gym-app.mjs is in
product and not in executionPins; machine-settings-host.mjs in product; gym.test.mjs and
machine-settings-ui.test.mjs in both; machine-settings-view.mjs, gym-model.mjs, gym-settings-lane.mjs
and writer-fence.test.mjs in neither. Every custody claim in section C is TRUE.

## 2. Measured-claim reproduction

| Spec claim | Reproduced? | My output |
|---|---|---|
| entryFor returns the same unfrozen object; changing state and a nested value changes later facade reads; zero save calls | YES | same object true; `Object.isFrozen(entry)` false; stateFor 'known' then 'failed' after `entry.state='failed'`; nested value reads back 'injected'; save calls 0 |
| Producer copies each machine but freezes only the wrapper | YES | row frozen true; `row.machine` frozen false; `row.machine.settings` frozen false |
| The exact forget body makes zero client calls | YES | `createGymModel({gymHost})` with a Proxy client that records every member call: `forget()` returns undefined, client/engine calls made by it = 0 |
| The shipped guard fragment admits a nested repaint and refuses an awaited continuation | YES | lifted today-lanes.cjs:63-76 verbatim into a Function: bare call refused; nested repaint under a shimmed listener ADMITTED; call after `await` inside a shimmed listener refused; (my addition) call from a timer started in a shimmed listener refused |
| Helper probes: blank -> null/refused; half-pair and trimmed duplicate refused; cues-only, ordered nonblank rows and case-distinct names accepted | YES, all 8 | blank and whitespace-only -> `null`; name-without-value, value-without-name, ' Seat '/'Seat' duplicate -> refused by producer; 'Seat'/'seat' -> accepted; cues-only -> `{exercise_id, cues:'Remember'}`; ' B '/' four ' then blank row then 'A'/'5' -> ordered B/four, A/5, blank dropped, cues omitted. Caps confirmed: 12 rows accepted, 13 refused, 41-char value refused, empty exercise id refused |
| Scratch diff counts | PARTLY | The two spans are exact and independently reproducible: helper span 23, card removal 37. The skeleton numbers (view +3/-24, lane +26/-0) depend on a skeleton that is not in the paper, so I cannot reproduce them; they are arithmetically consistent with deleting the 23-line span plus rewriting the default-export line and adding an import plus a re-export. Not a defect, but they should be labelled as skeleton-dependent. |

Every MEASURED claim in the paper survives independent reproduction. That is unusual and it is
the main reason this review is a reject on sizing and not a rewrite.

## 3. W1, SIZE: entry point by entry point, row by row

THE INVARIANT has five clauses. I number them: (I1) a released settings view passes RAW ANSWERS
and a sealed editor token to a SEALED writer; (I2) it cannot change cached reads; (I3) it cannot
acquire the settings host for drawing or admission, the pinned public first.settings.lane excepted;
(I4) it cannot start a second same-writer operation while the first is pending; (I5) nothing the
athlete sees changes.

### 3.1 The entry points

| Entry point | Clause it holds | Counterexample if cut | Keep? |
|---|---|---|---|
| createGymSettingsLane(doc, phone, model, settings, painter) | constructor | n/a | KEEP. `phone` earns its place: admission needs a containment test, see 4.3 |
| hooks.readView() | I1 | If cut, exercise_id for the op comes from the drawing-held `view` (card:267 today does exactly that), and D's own GSS-RAW-PARITY plant "substitute a view exercise_id" becomes admissible. The seal has no other source of a lift id it did not receive from drawing. | KEEP. Load-bearing, and the strongest single entry point in the paper |
| hooks.present(root, cardToken) | I1 | None that survives. MEASURED (gss-admission.mjs): with no present() at all, a binder held over a replaced root, a detached node and a disposed binding are all refused by two cheaper rules the design already has: the bindings map keyed by control, and `phone.contains(control)`. The one job present() does alone is mass-revoking a whole root's bindings, which `hooks.leave()` already does for navigation and which bind-replaces-same-action already does for a repaint. | CUT |
| hooks.settingsEditOpened(cardToken) | I1, I2 | Without it there is no editor token and no detached latest: the invariant's own words fail. | KEEP |
| hooks.settingsEditClosed(editorToken) | I1 | A stale Cancel closes its replacement. | KEEP (3 lines) |
| hooks.leave() | I4 | Bindings and a pending editor outlive navigation. Also replaces the released `owns=false` at card:109. | KEEP |
| hooks.bindSettingsSave(root, editorToken, readRaw, onOutcome) | I1, I4 | The whole ticket. | KEEP, drop `root` (see present()) |
| hooks.bindGymAction(root, cardToken, action, readRaw, onOutcome) | I1, I4 | The whole ticket for the four workout controls. | KEEP, drop `root` and `cardToken` (see tokens) |
| hooks.open(), hooks.startRead(liftId) | existing | n/a | KEEP unchanged except G4's return-value ruling |
| hooks.listen / hooks.unlisten | conditional | Under the paper's isTrusted rule: NOTHING. isTrusted does not care what else is on the stack, so routing 19 ordinary card listeners through the seal buys the invariant nothing and costs 19 R-class rewrites in a released file the PM reads line by line. Under the smaller admission rule in 4.3 it is load-bearing, because the seal must know when one of its own ordinary listeners is running in order to refuse "an ordinary listener programmatically clicks Save" (MEASURED refused under the smaller rule, row 2 of the matrix). | CONDITIONAL on G3. Do not pay for both isTrusted and this |
| facade.available() | I3 | This is the point of the ticket: it is what lets facade lose lane(). | KEEP |
| facade.entryFor / stateFor / hasRead | I2 | Existing; entryFor's detachment is the S-R29 fix. | KEEP |
| facade.settingsBusy() | I4 | A repaint during a pending save cannot know to paint Save disabled. | KEEP (1 line) |
| facade.effortChoices() | none | MEASURED: `model.effortChoices()` already returns a fresh array of fresh objects on every call (`c1 !== c2`, `c1[0] !== c2[0]`), so there is nothing to detach. And the raw model stays in the card's closure for the Start call at :517, which the paper itself concedes. This is fence bookkeeping wearing an invariant's clothes. | CUT |
| api.pending / ready / lane / read / stateFor | I3's exception | Existing public surface. | KEEP |

MEASURED and worth the PM's attention: `first.settings.lane` and `first.settings.ready` have ZERO
readers anywhere in rebuild/ (`grep -rn "settings\.lane\|settings\.ready" --include=*.mjs --include=*.cjs rebuild/`
returns nothing). The pinned public passthrough the invariant carves an exception for is read by
nobody today. I am not recommending its removal, because the PM's own invariant names it and a
browser check may want it; I am recording that its cost is being paid for a consumer that does not
yet exist.

### 3.2 The tokens: three kinds, one job

The paper mints cardToken, editorToken and a single-use permit. MEASURED (gss-admission.mjs): a
sealed binder with NO permit and NO cardToken refuses every negative row in the matrix at 4.3,
using only (i) a bindings map keyed by control, (ii) a WeakSet of consumed event objects, (iii)
`currentTarget` identity, (iv) `isConnected`/contains, (v) the enabled check, (vi) the event type,
(vii) the pending slot taken synchronously.

- The permit's stated job is single use. The pending slot, taken synchronously before readRaw, is
  already single use, and the paper says so itself in B ("The binder takes the slot before invoking
  readRaw; command entry uses that reservation, not a second busy check against itself"). A permit
  that guards what the reservation already guards is a second lock on one door. Commands are
  private and are never returned from the factory, so no caller outside a binder can reach one.
- cardToken's remaining job after present() is cut is the staleness check inside settingsEditOpened,
  which the seal can make against the lift it holds from its own readView. It does not need a token
  handed back to it to know what it last read.

Keep editorToken. It is the one the invariant names, it is compared by identity, and D's
GSS-TOKEN-IDENTITY row is exactly right about it.

### 3.3 The rows: 20 down to 16

| Row | Disposition |
|---|---|
| GSS-GESTURE-ASYNC | MERGE. Under this design a released callback holds no command, so there IS no awaited continuation to reject; the paper says this itself in B. Its positive ("admitted Save with an awaited host refusal paints exact existing text") is GSS-OUTCOME-PARITY's job; its negative ("a released delayed submit has no command/permit") is GSS-GESTURE-NESTED's. |
| GSS-NO-HOST-LEAK and GSS-API-PARITY | MERGE. Both are "no host is reachable except through the exactly pinned api.lane". One row, two halves. |
| GSS-TOKEN-IDENTITY | KEEP, shrunk to editorToken once cardToken and permit are cut. |
| GSS-CUSTODY | CONDITIONAL on G1. If the PM refuses the helper move there is no move to prove byte-identical. |
| every other row | KEEP as written. They are well chosen and each names a plant that changes real bytes. |

20 rows minus 2 merges minus 1 conditional = 16 or 17, inside the 12-to-16 band the source paper
priced, and the file count returns to five when the helper move is refused. The remaining overage
is not in the row list; it is in the gesture apparatus, which is W2.

### 3.4 THE SMALLER DESIGN, as a table the author can adopt

| Piece | Paper | Smaller | Why |
|---|---|---|---|
| Sealed entry points | 14 | 10 (cut present, effortChoices; listen/unlisten conditional on G3) | 3.1 |
| Token kinds | 3 | 1 (editorToken) | 3.2 |
| Binder signatures | bindSettingsSave(root, editorToken, readRaw, onOutcome); bindGymAction(root, cardToken, action, readRaw, onOutcome) | bindSettingsSave(editorToken, readRaw, onOutcome); bindGymAction(action, readRaw, onOutcome) | the seal selects inside its own `phone` and checks containment; drawing supplies no root and no context token |
| Admission | isTrusted + control + currentTarget + permit + WeakSet | depth-zero + control + currentTarget + live binding + contained in phone + enabled + type 'click' + consumed-event WeakSet + pending slot | 4.3, measured |
| Paint cannot write | implied by isTrusted | the same depth counter: paint runs inside it, so any permit request at nonzero depth is refused | MEASURED row 1 |
| Programmatic click from outside all seal code | isTrusted | one static fence row: zero `.click(` and zero `dispatchEvent` spellings in the released gym files (MEASURED: today both counts are 0 in gym-app.mjs, machine-settings-view.mjs, gym-settings-lane.mjs, today-app.cjs and today-lanes.cjs, so the row is free and its RED plant is one inserted line) | 4.3 |
| SettingsOutcome kinds | 5 | 4: fold 'in-flight' into `{kind:'ignored', reason:'stale'\|'gesture'\|'unavailable'\|'in-flight'}` because E's own table gives both identical view behaviour ("No text, clear or paint") | E rows 1 and 2 |
| Rows | 20 | 16 | 3.3 |
| Test harness | rewrite the UI harness away from real events; require a native browser positive | keep jsdom; no new browser gate | 4.2 |

## 4. W2, event.isTrusted: what it breaks and the smaller rule

### 4.1 Every existing drive that dispatches an untrusted event at a gym control

| File and line | Control | In the bar? |
|---|---|---|
| test/machine-settings-ui.test.mjs:96 | the harness `click(selector)`, used for settings-open, settings-save, settings-cancel, settings-add, settings-remove | YES, named by exact path at .github/workflows/rebuild.yml:232 |
| test/machine-settings-ui.test.mjs:985 | `[data-slot="log"]` | YES |
| test/machine-settings-ui.test.mjs:981, 1123, 1148, 1172 | effort choice, back, checkin, back | YES, but none becomes a sealed binder |
| test/machine-settings-ui.test.mjs:119, 127 | `input` on the two boxes | YES, ordinary |
| test/gym.test.mjs:499, 506 | `[data-slot="log"]` via `.click()` | YES |
| test/gym.test.mjs:505 | `.choice` via `.click()` | YES, ordinary |
| rebuild/lanes/d2/reviews/... 13 cells plus 2 support modules | `p.click('[data-slot="settings-save"]')` then `await p.mounted.settings.pending()` | NO. MEASURED: the today step names every file by exact path and none of these is in it, so they have no CI home. They are review annexes that would silently stop proving anything. |
| rebuild/lanes/c/LAUNCH-ADOPTION-PROBES.mjs | settings controls | NO |

The paper names only UI test:96 and scopes the harness rewrite to :81-120. That is the right
place, but the cost statement is understated: gym.test.mjs's three `.click()` drives are not
named (its C row says only "add controlled pending/dispatch/forget fixtures"), and the 15 lane-D2
cells are not named at all. The design lane gates the PM asked about do not exist: MEASURED,
`rebuild/m1/approved-2026-09-18/` is absent at e08bc11c and at the tip 2df2f32d; only
`approved-2026-09-08` is there, and nothing under it taps a gym control.

### 4.2 The measurement the paper does not have

MEASURED under jsdom (gss-trust.mjs, gss-trust2.mjs):

- `element.click()` produces a PointerEvent with `isTrusted === false`. So does
  `dispatchEvent(new Event('click'))` and `dispatchEvent(new MouseEvent('click'))`.
- `Object.defineProperty(ev, 'isTrusted', {value: true})` THROWS: "Cannot redefine property: isTrusted".
- A subclass with an overriding `get isTrusted() { return true; }` still reports FALSE inside the
  listener: dispatch installs `isTrusted` as an own non-configurable property that shadows the
  prototype getter.
- A Proxy whose `get` trap returns true for `isTrusted` is unwrapped by dispatch; the listener
  receives the target event and reads FALSE.
- jsdom synthesises ZERO click events from `keydown{key:'Enter'}` or `keyup{key:' '}` on a button.

There is therefore NO route by which a node cell can deliver a trusted event to the real DOM the
card is built on. "Model trusted input in a test-only injected document/event fixture" means
abandoning jsdom for every cell that proves a durable gym write, and replacing it with a
hand-written fake document: exactly the cells where `querySelector`, `replaceChildren`, `hidden`,
`disabled` and `focus` are the thing under test. The keyboard positive the paper requires cannot
be written in node at all.

The native proof has no home either. MEASURED: browser-check.mjs is the only real-browser driver
in the tree (playwright-core, `page.click`), it never routes to the workout or gym card (its routes
are why/nutrition and a weigh-in sheet; it imports gym-host.mjs only for a database name), and its
header plus line 48 say it exits 0 with "NOT RUN" when W7_BROWSER_BIN is unset. A required native
positive is therefore either a gate the default bar cannot run, or a silent skip that certifies
nothing. That is a worse position than the one S-R26 warns about, because a green skip reads like
a proof.

### 4.3 The smallest admission rule, measured against the same counterexamples

I built both rules over a real jsdom DOM and drove the same eight rows (gss-admission.mjs).
Rule A is the paper's: isTrusted plus control identity plus consumed-event WeakSet plus live
binding. Rule B is: the seal keeps one depth counter incremented by every one of its own wrappers
AND by paint, and a permit is issued only when the depth outside this wrapper was ZERO; plus the
same control identity, currentTarget, live-binding, containment, enabled, type and consumed-event
checks. Writes counted:

| Counterexample | A isTrusted | B depth-zero |
|---|---|---|
| 1 paint programmatically clicks Save | 0 refused | 0 refused |
| 2 an ordinary sealed listener clicks Save | 0 refused | 0 refused |
| 3 a timer clicks Save, no listener on the stack | 0 refused | 1 ADMITTED |
| 4 a click at a different control | 0 refused | 0 refused |
| 5 the same event object replayed at Save | 0 refused | 1 then refused (correct: one write, replay refused) |
| 6 a retained wrapper from a disposed binding | 0 refused | 0 refused |
| 7 THE INTENDED CLICK AT SAVE (positive) | 0 CANNOT PASS | 1 admitted |
| 8 a click on a child icon inside Save (positive) | 0 CANNOT PASS | 1 admitted |

Read the two columns against what the PM actually asked for, which is that PAINT CANNOT WRITE and
only the intended control's own listener can. Rule B holds both clauses exactly: row 1 and row 2
are refused. The single behaviour isTrusted buys over B is row 3, a deliberate programmatic click
at the exact intended, enabled, live control from outside all seal code. That is not an honest
look ticket making a mistake; it is someone writing `saveControl.click()` on purpose. And it is
closed statically for free: MEASURED, every released Today and gym file contains zero `.click(`
and zero `dispatchEvent` spellings today, so a fence row asserting that count is green on arrival
and its RED plant is one inserted line, in the same scanner that already counts addEventListener
at F:1761.

What dropping isTrusted gives up, stated plainly: a page whose released drawing code is rewritten
to click its own Save button from a timer or a microtask would be admitted at runtime and caught
only by the static row. Under S-R26 that is precisely the bargain the fence is: a tripwire, at the
place a reviewer reads, instead of a runtime check that costs the ability to test the happy path.

Rule B is also strictly better than the shipped ambient counter on both axes MEASURED in section 2:
the counter ADMITS a nested repaint (row 1's shape) and REFUSES an awaited continuation; B refuses
the nested repaint and never sees an await, because admission is synchronous inside the wrapper and
nothing crosses to drawing. The paper's conclusion that the counter must not be copied is correct;
its replacement is simply larger than the conclusion requires.

RECOMMENDATION for G3: NO to isTrusted as the admission rule. Take rule B plus the one static row.
If the PM later wants row 3 closed at runtime too, add isTrusted as a browser-only hardening once a
real browser gate reaches the gym card, and never let a node row's positive depend on it.

## 5. W3: does anything here collide with the split's live fix round?

No, at the file level, measured.

MEASURED `git diff --stat e08bc11c 2df2f32d -- rebuild/ .github/`: 8 files changed. They are
today-split-spike/{cut.cjs, gen-interface.cjs, gen-witness.cjs, regions.json, resolve.cjs,
test/instruments.test.cjs}, today-split/PART2-CUT-REPORT.json, and
rebuild/m3/w7-preview/today/today-lanes.cjs. The spec's proposed set is gym-app.mjs,
gym-settings-lane.mjs, machine-settings-view.mjs, test/machine-settings-ui.test.mjs,
test/gym.test.mjs and writer-fence.test.mjs. The intersection is EMPTY.

Two things to record rather than a collision:

- The gesture guard itself has NOT moved. MEASURED, the only change to today-lanes.cjs across the
  fix round is the banner and the bootFoodDays initializer (blind F2); lines 63-76 are byte
  identical at e08bc11c and 2df2f32d. The spec's claim about today-lanes.cjs:63-75 holds at both.
- writer-fence.test.mjs is untouched so far but it is the split round's own standing law and the
  round is live. Both tickets write rows into that one file. Section D should say that its line
  anchors are re-measured at the head the builder actually starts from, not at e08bc11c; three of
  its citations are already region edges (section 1), and a live round upstream will move more.
- F's E.6 rows at :1817-1907 assert only over today-lanes.cjs (the `gesture(` count of 2 and the
  two named entries). Adding gym rows in the gym lane cannot disturb them. The spec's instruction
  not to wrap gym commands in the tested ambient counter is right and is collision-free.

## 6. Parity: is section E complete?

E's table is the strongest part of the paper. Five inputs are missing, and each is a thing a
builder could get wrong while the table stayed green.

1. **host.save REJECTS rather than returning ok:false.** card:276-277 is `try { result = await
   facade.lane().save(machine); } finally { save.disabled = false; }` with NO catch, so a rejection
   propagates out of recordSettings into the promise handed to hooks.saving, and no refusal
   sentence is painted. The real host catches its own throws at host:98-100, so the shipped page
   cannot reach it, but an injected or closed host can and the d2 fault cells do. B says the
   rejection is preserved; E has no row asserting it. Name the row: no operation, no text, the
   pending promise rejects, flags released in finally.
2. **ENTER_PERFORMED and CHOOSE_EFFORT are not named.** E names the four SETTINGS_* sentences
   verbatim but leaves logSet's two form refusals (model:503-507) as "including blank". A parity
   table that compares painted text must name the text.
3. **undo's refusal lands in the rest-note slot.** card:478 is `put(map, 'rest-note',
   refusalText(result))`, which REPLACES NO_REST_PRESCRIBED in place. E's last row says only
   "refusalText/refusalScreen output".
4. **finish's refusal replaces the whole screen.** card:417 calls refusalScreen, which calls stub,
   which calls show, which moves focus to the new h1 (card:174-176). logSet's and undo's refusals
   are in-place text. E does not distinguish them, and item 7 below turns this into an
   athlete-visible difference a builder must not lose.
5. **A non-string draft row.** machineFromDraft coerces with `String(row.name || '')`, so a row
   whose name is a number, false or null becomes '' and the row is dropped. Draft rows are strings
   today from both sources (input.value and draftFrom's copy of stored pairs), so this is
   unreachable through the UI, but the new readRaw() is TYPED `{rows: Array<{name: string, value:
   string}>}`. If the sealed boundary type-checks instead of coercing, that is a silent behaviour
   change at the exact place the ticket exists to protect. E should pin the coercion.

## 7. What the athlete sees

Nothing in the design changes a sentence, a disabled state, a focus move or a tap count, with three
things to hold the builder to:

- The only new visible behaviour is the one F already promises: a second tap on Save while a save
  is in flight makes no second note. Today the DOM `disabled` at card:274 does that for a Save node
  that survives the repaint; the design makes it true for a replacement node too. This is a
  correction, not a change to a sentence.
- The forget branch. card:467-471 guards the primary with `if (busy) return;` but the forget branch
  NEVER SETS busy (busy is set only by logSet, finish and undo), so today a second tap during the
  advance calls forget again (idempotent, `saved = null`) and paints again. Under B's rule the
  second tap is quiet. Visually identical, because both paths end on the same next-set screen. But
  the builder must hold the slot only "through its resulting paint settlement", as the paper says,
  and not one microtask longer: extending it across a settings read would give the athlete a
  primary button that does nothing while a read he never asked for finishes.
- finish's refusal must stay a whole-screen replacement with the focus move at card:174-176. A
  typed outcome that turns it into in-place text would change a focus move, which is exactly the
  class F promises not to touch.

I found nothing else. The copy constants stay in gym-app (:59-81 unchanged), the view keeps
renderBlock/renderEditor/draftFrom, and the editor's row-add and row-remove listeners at view:142-161
stay ordinary.

## 8. The four PM rulings of section G, measured

**G1, the helper disposition.** RECOMMEND the relocation, changed-then-pinned. Measured basis: the
span is exactly 23 contiguous lines including its comments, so the move is checkable by independent
extraction; Split:1337 states S-R11's own purpose, that machineFromDraft "stops being editable by a
look ticket", and moving it into a sealed writer serves that purpose strictly better than pinning it
inside a view file six look tickets edit; and the alternative saves no fence work, because MEASURED
F:968 asserts the gym lane has NO STATIC IMPORT AT ALL and both options break that line. The only
other reader of the two helpers is UI test:495-498, which asserts on `acceptable` through the view's
default export; the paper's re-export keeps that call site working. Cost of the relocation, stated:
machine-settings-view.mjs stops being byte-identical, so S10's pin hash for it changes. That is a
pin line, not a re-review.

**G2, the pending/dispatch bundle.** RECOMMEND yes, with one correction the paper has already
earned. forget is MEASURED to make zero client calls, so it is a serialization subject and not a
durable writer. F's E.6 comment at :1799 says "five are the gym card's"; after this ticket the
honest denominator is four durable plus one transient, and the fence's new rows must say so rather
than carrying five forward. The paper's instruction not to report an aggregate "guarded writers"
denominator including forget is exactly right.

**G3, trusted dispatch and its native-browser proof.** RECOMMEND NO, on the measurements in 4.2 and
4.3. Take the depth-zero rule plus one static fence row.

**G4, sanitizing the opening promise's resolved value.** RECOMMEND yes, boolean availability, and it
is cheaper than the paper thinks. MEASURED: `first.settings.ready` and `first.settings.lane` have
ZERO readers anywhere in rebuild/. In the bar, the only public-surface readers are
machine-settings-ui.test.mjs:92 (`mounted.settings.read()`) and :112 (`mounted.settings.pending()`),
neither of which touches ready or lane. So the value change breaks no call site that exists. The
paper is right that leaving a drawing-reachable host behind `ready` would make the stated invariant
false; it should add that the change costs nothing today, and that api.lane's exception is
currently unexercised.

## 9. Buildability: could a builder who reads only this spec and the code build it?

Not without asking. Seven gaps, none fatal, all one line to close.

1. The gym lane's return grows a third table, `api`. F:882-889 asserts `Object.freeze(` occurs
   exactly THREE times in gym-settings-lane.mjs and names the three. The spec says to replace the
   count assertion, but does not say the positive must gain an `api: Object.freeze({` arm.
2. F's S-R29 cell at :1409 calls `createGymSettingsLane({}, {}, {latest}, {repaint})` with four
   arguments. The new signature takes five. The spec says the row's expectation inverts; it does
   not say the call arity changes with it.
3. F:968's `assert.equal(/^\s*import\s/m.test(lane), false)` must become an exact allowlist of one
   static import, not be deleted. Deleting it makes any drawing static import invisible, which is
   the opposite of the row's purpose. The spec's "extra drawing import remains red" implies this
   but does not say which form.
4. The new number for LISTENERS_OUTSIDE_SHIM[gym-app.mjs] depends on G3. If hooks.listen is built
   it is 0; if only the writer controls are bound it is 19 minus the five writer controls
   (settings-save, log, primary in renderComplete, primary in renderSaved, undo) = 14. The spec
   asserts 0 unconditionally.
5. Section B says results must not carry "a pending promise from drawing" and also that
   `api.pending()` returns the last admitted operation promise. A builder needs to be told that
   these are different objects: the outcome carries no promise, the api holds one.
6. Section D says "Run the existing focused cells serially, not the whole Today step" but names no
   command. The today step at .github/workflows/rebuild.yml:232 names eighteen files by exact path;
   the focused set for this ticket is gym.test.mjs, machine-settings-ui.test.mjs and
   writer-fence.test.mjs. Say so.
7. The ordering rule "consume before raw capture" and "take the pending slot before any await"
   appear in three places in B with slightly different words. One numbered sequence, once, would
   remove the only place in the paper where I had to read three paragraphs to know what happens
   first.

## 10. The fence rows section D says must change: does each replacement keep the old counterexample?

Every cited line was opened. All twelve replacements keep their old counterexample. Four carry a
mechanical gap, already listed in section 9.

| Cited row | Old counterexample | Kept? |
|---|---|---|
| F:19, :192-210, :789-801 six declared seams | R1 BLOCKING-2's seventh write site that reuses a declared NAME, caught by the site count | KEPT and strengthened: the released card drops to one site (model.start), so any second site is red by count and by name set. The plant must be retargeted from `facade.lane().save` to `api.lane().save`, which the spec's own api window allows only inside the first.settings mapping. |
| F:552-584, :1110, :1388-1400, :1504, :1568, :1590-1606 lane acquisition | the BLIND_GYM_TABLE's 'direct lane save' RED, 'o.of lane', the regex-after-`if (ok)` row, and the seven F2 settings-holder binding plants | KEPT. With no `lane` on facade the allowed window list is empty, so every old spelling of `facade . lane (` falls outside it and stays red. f2Mount is untouched (mountGym's signature does not change); only the holder window `createGymSettingsLane ( doc , model , settings ,` must gain `phone`, which the spec names. |
| F:882-889 count, :897 unfrozen mutant | `hooks: ({` planted unfrozen | KEPT: the spec preserves "an unfrozen table remains red" and legalises extra Object.freeze calls, which deep freezing forces. Gap 1 above. |
| F:891-895 one-entry painter | the byte-exact painter regex | KEPT UNCHANGED: the design keeps `Object.freeze({ repaint: () => paint() })` verbatim. |
| F:958-989 import edges | a require of a view module in today-readings (untouched, still red) and a SECOND dynamic edge in the gym lane | KEPT: the allowed dynamic edge list stays exactly `["./machine-settings-host.mjs"]`, so a second dynamic edge is still red. Gap 3 above. |
| F:1404-1422 S-R29 laxity | the live-cache mutation, asserted GREEN today | KEPT as an inverted witness, which is the right treatment. Gap 2 above. |
| F:1444-1475 recorded residue | eleven green residue shapes, three of which the gym holder pin turns red | KEPT. The `recordSettings(map, view, submittedDraft)` anchor at :1450 does disappear with the released body; the spec names the retarget to the raw-answer callback. The R10 plant through `entry.host` stays statically green and must be shown dynamically harmless, which the spec says. |
| F:1751-1785 listener exemption, 19 | the plain addEventListener planted in today-app.cjs | KEPT (that plant is in a file this ticket does not open). Gap 4 above. |
| F:1817-1907 E.6 counter | the `gesture(` count of 2 and the two named entries in today-lanes.cjs | KEPT UNTOUCHED, measured: those assertions read only today-lanes.cjs. |
| F:995-1020 paint exception | a second durable write planted inside paint() | KEPT. Nothing the design adds to paint() carries a PUT member name; `hooks.startRead` is `startRead`, not `start`. |
| F:1669 copy-free seal | prose literals in the sealed module | KEPT and extended. The relocated helper comments travel with the move and are comments, not literals, so `literalsOf` is unaffected. |
| F:773 word lists 15/17/7 | the three list lengths | KEPT: nothing is removed, and forget's misclassification is corrected in new rows rather than by deleting a word. |

## 11. Credits, because a reviewer told to disagree should say where the paper is right

F1. Split:687-695's seven are not seven gym writers, and the paper says so and reassigns two.
F2. forget reaches no durable put; MEASURED here at zero client calls. The upstream REACH.md row
    that lists `forget:498` beside logSet, finish and undo is the error, and this paper corrects it
    without deleting a word from the PUT list.
F3. The producer freezes only the wrapper (Producer:133-151), so a frozen-looking entry hands out a
    mutable machine. Reproduced. That is the actual mechanism behind S-R29 and nobody had named it.
F4. Every one of the twenty D rows names a plant that changes real bytes, and section D's rule that
    "a row passing only with its own rewritten expectation is not evidence" is the right law.
F5. H's limits are honest, including the ones that hurt: no durable reopen, no browser drive, no
    performance number, proposed plants not run.

## 12. Findings, in the order the author should take them

| # | Grade | Finding |
|---|---|---|
| R1-B1 | BLOCKING | isTrusted as the admission rule. MEASURED: jsdom cannot deliver a trusted event by any of three routes, so rows 7 and 8 of the matrix, the positives, cannot pass in any node cell; jsdom synthesises no click from Enter or Space, so the keyboard positive cannot be written; browser-check.mjs never reaches the gym card and exits 0 by default, so the native positive has no home. Adopt the depth-zero rule of 4.3 plus one static zero-programmatic-dispatch fence row, which is green on arrival today. |
| R1-B2 | BLOCKING | Three token kinds where one holds the invariant. Cut the permit (the pending slot is the single use) and cardToken (the seal knows its own last read). Keep editorToken. |
| R1-B3 | BLOCKING | hooks.present earns nothing the bindings map plus a containment check does not already give, MEASURED rows 1, 2, 4 and 6. Cut it; keep hooks.leave. |
| R1-B4 | BLOCKING | Size: 14 entry points to 10, 20 rows to 16, as in 3.4. hooks.listen's 19 released rewrites are paid for ONLY if G3 goes to the depth-zero rule; under isTrusted they buy the invariant nothing. |
| R1-N1 | NOTE | facade.effortChoices detaches nothing. MEASURED: model.effortChoices already returns fresh objects each call. Cut it. |
| R1-N2 | NOTE | W2's cost is understated: gym.test.mjs:499/505/506 and 15 lane-D2 cells drive gym controls untrusted. The d2 cells have no CI home (measured), so they do not break the bar, but the paper should name them. |
| R1-N3 | NOTE | Section E is missing five inputs: host.save rejecting; ENTER_PERFORMED and CHOOSE_EFFORT by name; undo's refusal in the rest-note slot; finish's refusal as a whole-screen replacement with a focus move; the non-string draft row coercion. Section 6. |
| R1-N4 | NOTE | Seven buildability gaps, section 9. Each is one line. |
| R1-N5 | NOTE | Three region citations clip a closing line and the self-count says 216 where the file is 226. Section 1. |
| R1-N6 | NOTE | Section D should re-measure F's anchors at the head the builder starts from, not at e08bc11c: the split's fix round is live in the same file's neighbourhood. Section 5. |
| R1-N7 | NOTE | Record for the PM that first.settings.lane and first.settings.ready have zero readers repo-wide, so G4 breaks nothing and the pinned passthrough is currently unexercised. |

## 13. Evidence

Probes, all in a farm scratch worktree of e08bc11c, node one process at a time, synthetic only:
gss-probe.mjs (live cache, producer freeze depth, guard fragment, eight helper shapes),
gss-forget.mjs (actual createGymModel with a recording Proxy client), gss-trust.mjs and
gss-trust2.mjs (four routes to a trusted jsdom event, keyboard synthesis), gss-admission.mjs (the
two-rule matrix over eight counterexamples). Static censuses by grep over the synced worktree.
S8 key membership read with node, never printed whole. Nothing was written to any worktree of the
chain, nothing was pushed anywhere but this review file, and farm-verify printed PASS after every
sync.
