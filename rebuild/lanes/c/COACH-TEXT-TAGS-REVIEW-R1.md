# COACH-TEXT-TAG-SWEEP, REVIEW R1 (independent Claude review of an Astra build)

Author head reviewed: d88faee8 on rebuild/c-coach-text-tags, cut from the chain tip 6268e7f.
Author report read as a HYPOTHESIS (DECISIONS:571). Reviewer told to disagree where the
evidence lets him. This file is the only file this review commits.

## VERDICT: REJECT

The leak the ticket names IS closed at all six product sites, re-proved independently and
with a hostile probe of my own. I reject on four findings, all measured, three of them
introduced by this change and one left live at a site :571 named by name.

| # | Finding | Introduced here? |
|---|---|---|
| B1 | Both dispatch catches now THROW past the caller where the base RETURNED a refusal | YES |
| B2 | New sentence A, "Nothing was recorded.", is FALSE on a reachable path, measured end to end | YES |
| B3 | New sentence C, as the two modules that print it actually print it, DOES claim nothing was recorded | YES |
| B4 | tools.cjs writeCheckIn still publishes an exception message, with digits and a dash, in athlete-facing copy | NO, missed |

## 1. RED FIRST, RE-PROVED BY THIS REVIEWER

Farm scratch worktrees, Linux, node --test, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York.

At the BASE 6268e7f, with ONLY rebuild/coach/test/text-tags.test.cjs copied in from the head
and no product byte changed (git diff --stat against HEAD over the three product files: empty):

```text
not ok 1 - TT1   ok 2 - TT2   not ok 3 - TT3a  not ok 4 - TT3b
not ok 5 - TT4   not ok 6 - TT4b  not ok 7 - TT5a  not ok 8 - TT5b
# tests 8  # pass 1  # fail 7
```

At the HEAD d88faee8, the same file: 8 of 8 pass, 0 fail.

Astra's red-first claim is CONFIRMED, including that TT2 is green at the base because the
machine-settings catch already carried its message in source. Base coach suite in the same
scratch: tests 311, pass 311, fail 0, which confirms the 311 the report states.

## 2. THE BAR OF RECORD, ON THE OWNER'S PC, AT THE HEAD

Worktree %TEMP%\earned-astra-2, git rev-parse HEAD = d88faee8a3843b009fcac00086d3a44c3ef2bc22,
git status --porcelain EMPTY before and after. One .cmd, env on its own lines, log tailed.

| command | result |
|---|---|
| node --test "rebuild/coach/test/*.test.cjs" | tests 319, pass 319, fail 0, cancelled 0, skipped 0, todo 0, exit 0 |
| node rebuild/t2/rig187.cjs | rig187 PASS, exit 0 |
| node --test "rebuild/client/test/*.test.cjs" (control) | tests 18, pass 18, fail 0, exit 0 |
| git diff --numstat 6268e7f..HEAD -- rebuild/engine rebuild/m3 rebuild/m4 rebuild/client .github | EMPTY |

319 = 311 + the 8 new cells, which matches the report. Custody holds: the seven changed paths
are all under rebuild/coach or rebuild/lanes/c. Off the sealed path, re-measured: no key of
rebuild/m4/spec/acceptance-s8-real-shape.json begins rebuild/coach.
The diff adds no U+2013 and no U+2014 on any added line (measured over the whole diff).

## 3. EVERY PRODUCT HUNK, ATTACKED

### (a) assertNoLeak on all three refusal helpers: can a refusal that RETURNED now THROW?

YES, and this is the first blocking finding.

FORBIDDEN_KEYS (17 of them) are matched on KEY NAMES only, and the refusal envelope's key set
is closed literal (tool, tier, turn_id, ok, unavailable{code,reason,source}, values{code,reason},
state_unchanged, plus code/reason/allowed on the two unknown-tool envelopes). I drove all 17
forbidden key names through a dispatch catch AS THE EXCEPTION MESSAGE: 17 of 17 returned a
refusal, none threw. So assertNoLeak itself is not the hazard.

The hazard is the STRING CONCATENATION the same hunks introduced to build `source`:

```js
"wave1-tools.cjs dispatch: " + ((error && error.message) || "the tool refused")
```

Measured at BOTH refs, same probe file, three hostile `.message` shapes:

| thrown .message | BASE 6268e7f | HEAD d88faee8 |
|---|---|---|
| a Symbol | RETURNED WAVE1_TOOL_THREW / ONBOARDING_TOOL_THREW | **THREW** TypeError: Cannot convert a Symbol value to a string |
| an Object.create(null) | RETURNED (both) | **THREW** TypeError: Cannot convert object to primitive value |
| an object whose toString throws | RETURNED (both) | **THREW** Error: nope |

The throw escapes `dispatch` entirely, past `openTurn().call`, out of the tool window. It is
raised INSIDE the catch block whose own comment reads "A refusal, never a stack past the
caller." The base was total on these inputs; the head is partial. That is the ticket's own
stop condition: a refusal that throws inside a catch is worse than the leak it replaced.

Two related measurements, so the fix is scoped correctly and no blame is misplaced:

- the same `String(name)` hazard on the two unknown-tool envelopes is PRE-EXISTING: a name
  whose toString throws, or a null-prototype name, threw at the BASE too (measured), and a
  Symbol name returns at both. This hunk did not make it worse.
- the onboarding SUBMIT catch does NOT throw on any of the three shapes, because it passes
  the raw message as `source` rather than concatenating. It does divert on one input:
  `.message = {lease: 1}` makes assertNoLeak throw inside submit's catch, the throw escapes
  submit, and the OUTER dispatch catch converts it to ONBOARDING_TOOL_THREW. The athlete then
  gets the generic "something went wrong" instead of the setup refusal and its saveRefused
  sentence. Contained, but it is a refusal turning into a different refusal.

MINIMAL FIX, one helper used at all four places, which also closes the pre-existing hole:

```js
const provenance = (v) => { try { return typeof v === "string" ? v : String(v); } catch { return "(unprintable)"; } };
```

B1 is BLOCKING. A cell should drive all three shapes at both dispatch catches and both
unknown-tool envelopes and assert a RETURN.

### (b) onboarding submit: which declared codes now collapse?

NONE. This part of the hunk is correct and I could not break it.

`commands.prepare` can throw exactly three families:
1. `TypeError('SETUP_INPUT_INVALID')` from `bad()`, at 20 sites in setup-commands.mjs;
2. the `CLEAN_INIT_*` codes `createCleanInitState` raises through `setupOf`;
3. raw JS errors from `JSON.parse(JSON.stringify(...))` and key coercion (circular input,
   a throwing toJSON, an exotic key), which carry engine-internal text.

Family 2 is exactly the five own keys of `setup-model.mjs` REFUSAL_SENTENCES, and that is not
an assumption: `rebuild/m3/w7-preview/today/test/setup.test.mjs` S3 enumerates the codes out
of `rebuild/m4/workout/athlete-state.cjs` AT TEST TIME and asserts the table names exactly
them, no more and no fewer. So the whitelist cannot silently fall behind the engine.
Family 1's message is the string SETUP_INPUT_INVALID, and the fallback constant is the same
string, so that code is byte-identical before and after.

Before and after, for every family:

| thrown message | code BEFORE | code AFTER | reason BEFORE | reason AFTER | onboarding-text says |
|---|---|---|---|---|---|
| a CLEAN_INIT_* code | that code | that code, unchanged | model.COPY.saveRefused | same | same line |
| SETUP_INPUT_INVALID | SETUP_INPUT_INVALID | SETUP_INPUT_INVALID | model.COPY.saveRefused | same | same line |
| any raw engine message | the raw message | SETUP_INPUT_INVALID | model.COPY.saveRefused | same | same line |
| no message at all | SETUP_INPUT_INVALID | SETUP_INPUT_INVALID | model.COPY.saveRefused | same | same line |

The reason is `model.COPY.saveRefused` on every branch, before and after, so NO legitimate
refusal changed its sentence. `hasOwnProperty.call` is the right test and I confirmed it:
"constructor" and "toString" select SETUP_INPUT_INVALID, and so does "CLEAN_INIT_" + hostile
text, so neither an inherited key nor a prefix match gets through. Not blocking.

ONE REGRESSION IN DIAGNOSABILITY, worth a line and not a round: `source` changed from the
fixed "setup-commands.mjs prepare()" to `message || "setup-commands.mjs prepare()"`. For a
declared CLEAN_INIT code the source is now just that code again and no longer names the file,
while the two sibling sites correctly keep both ("wave1-tools.cjs dispatch: " + message).
TOOL-CONTRACT.md says source names the file:line that proves it. Prefer
`"setup-commands.mjs prepare(): " + provenance(message)` for consistency with the pattern.

### (c) the unknown-tool sentence: every consumer, every cell

CONFIRMED and it is a strengthening. Grepping the BASE tree for the two old sentences finds
exactly four files: the two product modules, the one cell
`rebuild/coach/test/onboarding-closed-list.test.cjs`, and one brief. Nothing else in the tree,
no text module, no script fixture and no other suite read those strings.

The two changed assertions are both strengthenings: `assert.match(r.reason, /^...$/)` becomes
`assert.equal` on the full fixed sentence, `assert.match(r.unavailable.reason, /set_sets/)`
becomes an exact equality, and two NEW assertions pin `unavailable.source` exactly. No cell
was removed, skipped or weakened. The wave-one dispatch had no cell reading its sentence at
the base, which is why only one file changed.

Two loose ends, neither blocking:
- `rebuild/coach/BRIEF-C6-VOICE-ONBOARDING.md:93` still documents the old envelope,
  `reason: "<name> is not one of the seven onboarding tools"`. The governing brief now
  contradicts the code and was not updated. Follow-up F3.
- the surviving cell is still titled "an unknown name is refused by CODE, and the refusal
  NAMES the tool that was tried". After this change the reason does not name it; `tool` and
  `source` do. The title should be corrected so a future reader is not misled. Follow-up F8.

### (d) WHAT REACHES THE MODEL, AND WHAT REACHES THE ATHLETE

This is the question the whole fix rests on, and the answer is YES for all three modules,
for the same reason it was accepted for memory-tools.cjs at :565.

DOES `source` TRAVEL TO THE LANGUAGE MODEL? Yes. model-adapter.md section 3 lists what the
adapter sends per request, and item 3 is "the tool results of this turn only", which is the
whole envelope, source member included. Nothing redacts it.

IS `source` RENDERED TO THE ATHLETE ANYWHERE? No, in none of the three modules. Each has
exactly one refusal template and each reads `u.reason` alone:

```js
unavailable: (u) => { const said = typeof u.reason === "string" && u.reason ? u.reason : "..."; ... }
```

coach-text.cjs:138, wave1-text.cjs:87, onboarding-text.cjs:78. The only other appearance of a
source anywhere in the three is `coach-text.cjs:39`, inside the message of a COACH_UNIT_MISMATCH
exception thrown at a developer, never spoken. I executed all three templates against the real
envelopes (section 3e) and confirmed it.

WHY THAT IS SUFFICIENT, stated so the owner can rule on it rather than trust it.
model-adapter.md:126-140 is explicit: the danger of caller text is not that the model sees it,
it is that a `text` TAG is read by `allowedTokens()` as engine prose, so every number in a
tagged reason is licensed for the whole turn. `source` is untagged: no turn_id, not a tag, no
tag reads it, and no draft may quote it, because a draft that did would fail `untraceable`.
That is precisely the argument :565 accepted for memory-tools.cjs, and it holds identically
for tools.cjs, wave1-tools.cjs and onboarding-tools.cjs, which share tools.cjs's own tag
vocabulary. The fix is therefore sound in kind.

I verified the consequence rather than assuming it. Against the FIXED envelopes,
`untraceable("Your protein target is 987654 grams.", [r], TURN)` returns ["987654"], meaning
the hostile digits are NOT licensed. Against the one leak still live (finding B4),
`untraceable("It was 777333.", [r], "t")` returns [], meaning the leaked digits ARE licensed
for unqualified prose. The mechanism is real in both directions.

### (e) MY OWN HOSTILE DRIVE OF ALL SIX SITES

Marker: a marker string, an em dash and digits, written in my probe source as the ESCAPE
`"ZQPROBE" + the JS escape for U+2014 + "777333"` so no dash entered any file I authored. Used as the exception message
at every catch AND as the tool name at both unknown-tool envelopes. "Face" below means the
whole envelope serialised with `source` alone removed, so every other member is inspected,
including the tagged `values`.

| site | code | marker in face | em dash in face | marker in source |
|---|---|---|---|---|
| tools.cjs writeCheckIn, real check-in model, hostile choice | CHECKIN_INPUT_INVALID | NO | NO | yes |
| wave1-tools.cjs unknown tool, hostile NAME | WAVE1_TOOL_NOT_IN_LIST | NO | NO | yes |
| wave1-tools.cjs dispatch catch, hostile MESSAGE | WAVE1_TOOL_THREW | NO | NO | yes |
| onboarding-tools.cjs unknown tool, hostile NAME | ONBOARDING_TOOL_NOT_IN_LIST | NO | NO | yes |
| onboarding-tools.cjs dispatch catch, hostile MESSAGE | ONBOARDING_TOOL_THREW | NO | NO | yes |
| onboarding-tools.cjs submit catch, hostile MESSAGE | SETUP_INPUT_INVALID | NO | NO | yes |

Six of six: the marker, its digits and the dash reach `unavailable.source` and NOTHING else.
Durable writes during the check-in drive: 0. This is the ticket's central claim and it holds.

## 4. THE THREE NEW SENTENCES, CHECKED FOR TRUTH IN EVERY PATH THAT PRINTS THEM

I did not read the sentences, I RAN the renderer that prints each one on the real envelope.
This is where two of the four blocking findings are.

| ID | sentence in the report's copy table | what the athlete actually hears |
|---|---|---|
| A | I could not record that check-in answer. Nothing was recorded. | "I could not record that check-in answer. Nothing was recorded. Nothing changed." (coach-text.cjs) |
| B | That is not one of the coach's tools, so I did nothing. | "That is not one of the coach's tools, so I did nothing. Nothing was recorded." (both) |
| C | Something went wrong inside that tool on this device. I could not complete the request. | "Something went wrong inside that tool on this device. I could not complete the request. **Nothing was recorded.**" (both) |

All three renderers APPEND a closing clause unless their own regex already finds one in the
reason. The copy table the owner is asked to rule shows the sentence BEFORE that append, so
the owner would be ruling on copy that never reaches a screen. Plain words: yes on all three.
No U+2013 and no U+2014 in any of them: confirmed.

### B3 (BLOCKING). Sentence C, once printed, makes exactly the claim the report says it avoids.

The report states, line 75: "C avoids claiming that a failed request proves no earlier write
happened." Measured, `wave1-text.cjs:87` appends " Nothing was recorded." because C matches
none of `/nothing (is|was) recorded|unchanged|I have not recorded|I have kept nothing/i`, and
`onboarding-text.cjs:78` appends the same. So the sentence as heard asserts that nothing was
recorded, on a path that catches an arbitrary throw from inside a tool and cannot know that.
The envelope agrees with the append and not with the sentence: `unavailable()` also stamps
`state_unchanged: true` on every dispatch-catch refusal (pre-existing, and the report says at
line 123 that it was not redesigned), so the one member that could have carried the doubt says
there is none.

The ticket's words were "the dispatch-catch sentence must not claim nothing was written".
Measured, it does. Either C is worded so the regex recognises it as already careful, or the
regex learns C, or the copy table shows the rendered line. Whichever the owner prefers, the
table he rules must show what he would hear.

### B2 (BLOCKING). Sentence A, "Nothing was recorded.", is false on a reachable path.

`writeCheckIn` takes the model's LIVE draft (`checkin-model.mjs:322` returns the held draft,
not a copy) and runs a multi-statement `apply` over it. `answer_checkin` walks four groups in
order, so a valid answer can be applied and a later one throw. Measured, one turn, one call:

```text
turn 1  answer_checkin({confirmed:true, sleep_quality:"Good", energy:"NOT_A_LABEL"})
        refused with "I could not record that check-in answer. Nothing was recorded."
        host writes 0
        draft choices AFTER the refusal: {"sleep_quality":"Good","energy":null,...}
turn 2  answer_checkin({confirmed:true, stress:"Low"})  ok true
        WHAT THE HOST ACTUALLY WROTE: {"sleep_quality":"Good","stress":"Low"}
```

The answer the refusal disowned was recorded by the next call, against a different turn_id,
without ever being confirmed in the turn that wrote it. The partial mutation itself is
pre-existing model behaviour, identical at the base; what is NEW is a sentence that denies it.
At the base the reason was the raw TypeError message, which claimed nothing.

This also touches the tier 1 law: a fact is recorded only after the athlete says yes, and the
yes in turn 2 was a yes to "Low", not to "Good".

Two honest fixes, either of which I would accept: snapshot and roll the draft back in
`writeCheckIn`'s catch before refusing, which makes the sentence true; or soften A to claim
only what the code knows, for example "I could not record that check-in answer." with no
second clause, and let the renderer add its own. The first is better and is small.

### B4 (BLOCKING). tools.cjs writeCheckIn still leaks an exception message into athlete copy.

:571 named `tools.cjs writeCheckIn` as a site. The hunk closed its `apply` catch and left its
`save` route open, ten lines below. `checkin-model.mjs:286` catches anything the host throws
and sets `code: error.message`, then joins it into `copy`; `tools.cjs:675` publishes
`saved.copy` as the refusal's reason, which `unavailable()` publishes as a `text` TAG.

Measured with the real check-in model and a host whose `save()` throws my marker:

```text
code    : CHECKIN_NOT_RECORDED
reason  : "This check-in could not be recorded on this device, and no part of it was recorded. . ZQPROBE<em dash>777333"
marker in athlete-facing members : TRUE
em dash in athlete-facing members: TRUE
rendered (coach-text): the same line, plus " Nothing changed."
untraceable("It was 777333.", [r], "t") = []      <-- the leaked digits ARE licensed
```

(the dash in that quoted line is the real character the code produced; it is written here as
`<em dash>` so this file authors none.)

Three separate breaches in one line: caller-origin text in an athlete-facing sentence, a
U+2014 in athlete copy against DECISIONS:114 (1), and an unconfirmed figure licensed for the
turn's prose, which is DECISIONS:554's P-F1 defect exactly. The route is live, not a test
seam: `local-world.mjs:292-337` wires the real `checkin-host.mjs`, and the catch at :286
exists precisely because that host can throw.

The report's justification for leaving accepted-layer pass-throughs alone is "safety depends
on upstream fixed refusal vocabulary". At this pass-through the upstream vocabulary is NOT
fixed, so the carve-out does not cover it. The fix is the same pattern already used four
lines up: a fixed sentence plus a code from a closed table, with `saved.copy` and `saved.code`
carried in `source`.

## 5. THE SWEEP: EVERYTHING ASTRA LISTED AND DID NOT FIX

| item | inside the defect class? | verdict |
|---|---|---|
| wave1 `log_set` confirmation interpolating caller load and reps | INSIDE, and it is the worst of them | NAMED FOLLOW-UP F1, high |
| `verifyCostCap` annotation keys in its reason | OUTSIDE | no follow-up owed, I disagree with flagging it |
| `verifyOptIn` optIn.user in its mismatch reason | OUTSIDE | no follow-up owed |
| topic echoes in cannot_change_via_coach / cannot_set_via_coach | OUTSIDE | deliberate read-back, no follow-up |
| accepted-layer code/copy pass-throughs | INSIDE at one of them | that one is B4; the rest need the same check, F6 |
| memory-host read()/save() dynamic copy | OUTSIDE at the tool boundary | agreed with the report |
| gym phase and model missing-copy interpolation | OUTSIDE | closed vocabulary, agreed |
| coach-text CLI writing error.stack to stderr | OUTSIDE | developer surface, agreed |

### F1, the one I would put at the top of the next round. MEASURED.

`wave1-tools.cjs:236-238` publishes, as a `text` tag:
`"Say yes and I will log " + load + " lb for " + reps + " reps. Nothing is recorded yet."`
where `load` and `reps` are whatever the CALLER, which is the language model, supplied.

```text
log_set({load: 987654, reps: 3210}) on an active session
reason  : "Say yes and I will log 987654 lb for 3210 reps. Nothing is recorded yet."
untraceable("You lifted 987654 lb.", [r], "t")        = []
untraceable("That is 3210 reps.", [r], "t")           = []
untraceable("Your one rep max is 987654 lb.", [r], "t") = []
control, a figure not in the confirmation, 555        = ["555"]
```

A figure the model invented is licensed, in its own unit, for the whole turn, with nothing
written and no yes given. That is word for word the defect DECISIONS:554 P-F1 describes and
the one that made P4b-1 REJECT at review R1. The same call also carries arbitrary caller TEXT
into athlete copy: `load: "9876<em dash>HOSTILE"` renders verbatim, dash included.

I therefore disagree with the report's classification of this item as "adjacent arbitrary-text
exposure, not an exception/tool-name path". The exception-or-tool-name framing is narrower than
the class :554 and :571 actually describe, which is text the code did not write reaching an
athlete-facing member of an envelope that leaves the phone.

It is NOT blocking THIS ticket: it is pre-existing, it is outside the five sites :571 named,
W8/D6 requires the confirmation to name both numbers so the fix is a design choice and not a
deletion, and the precedent for that choice already exists. :565 accepted, for memory, that
"the words awaiting a yes arrive as `confirmation.text` ... with `licensed: false` and no
`turn_id`, like `item.text`". `log_set` should carry load and reps the same way, or as `tagged`
values whose source is the caller and which license nothing.

### F5, where I disagree with the report in the other direction

`verifyCostCap` and `verifyOptIn` return bare `{ok, code, reason}` objects. They are not tool
envelopes, they never pass through `unavailable()`, they are never tagged, and no text module
renders them; `startLiveSession` is an operator gate, not a registered tool. Their reasons
interpolate the owner's own cap file keys and a closed required-key list, not caller text.
They are outside the class and I would spend no round on them.

## 6. THE REST OF THE NAMED FOLLOW-UPS

- **F2, sentence B over-claims, measured.** "That is not one of the coach's tools" is false
  whenever the name IS a coach tool from a sibling list, which is the mistake a model is most
  likely to make. Measured: `onboarding.dispatch("today_plan")`, `("current_set")` and
  `("remember")` all answer "That is not one of the coach's tools, so I did nothing", and so do
  `wave1.dispatch("submit")` and `("set_name")`. All five ARE the coach's tools. The old
  sentences were precise about which list. The wording is verbatim from `memory-tools.cjs:436`
  and was accepted at :565, so I do not treat spreading it as blocking, but memory serves three
  tools while these two dispatchers sit beside fifteen and seven, so the falsity multiplies.
  The owner should rule a list-specific wording, for example "That is not one of the tools I
  can use here, so I did nothing."
- **F3**, `BRIEF-C6-VOICE-ONBOARDING.md:93` still documents the old unknown-tool reason.
- **F4**, the doubled tails the renderers produce: A becomes "Nothing was recorded. Nothing
  changed.", and onboarding submit's pre-existing saveRefused becomes "...no part of it was
  recorded. Nothing was recorded." Pre-existing for the second, new for the first. The copy
  rows the owner rules should carry the rendered line.
- **F6**, re-check each accepted-layer pass-through against its actual upstream, the way B4
  shows the assumption can fail, rather than treating the carve-out as blanket.
- **F7**, the pre-existing `String(name)` throw on both unknown-tool envelopes, which the one
  helper proposed in section 3a closes at the same time as B1.
- **F8**, the stale cell title in `onboarding-closed-list.test.cjs`.

## 7. WHAT I CONFIRMED IN THE REPORT, WITHOUT DISPUTE

Red-first counts, both directions. The base 311 and the head 319. rig187 PASS and the client
control 18 of 18. Empty numstat over rebuild/engine, rebuild/m3, rebuild/m4, rebuild/client
and .github. Exactly one existing cell read the changed strings, and both of its edits are
strengthenings. TT2 green at the base for the reason given. The hasOwnProperty test on
REFUSAL_SENTENCES, including the inherited-key and prefix cases. That `source` travels to the
model but is rendered to no athlete in any of the three text modules. That the six sites no
longer publish caller text in any athlete-facing member, which I re-proved with my own marker.

## 8. WHAT I DID NOT VERIFY

No live model, no phone, no browser, no owner data, no conformance or private gate, no seal,
receipt or artifact, no `b-package.cjs --full`, no seal generator. I did not read
`rebuild/conform/private`, `src/history.js`, any `ledger/`, EarnedPort, `port-real.log` or the
soak. I ran the bar on the owner's PC once, at the head only, and did not re-run the base bar
there; the base counts in this file were measured in a Linux farm scratch. I did not run
GitHub CI, and under DECISIONS:554's standing rule this branch's CI proves nothing about its
own suites until the chain tip is merged forward. I did not fuzz proxies or getters beyond the
shapes listed in section 3a. I did not review the memory modules, which :565 already accepted.
I changed no product byte and committed only this file.

## 9. THE ROUND I WOULD ASK FOR

Small, and three of the four are one-line edits. Fix B1 with the `provenance` helper at four
call sites and pin it with a cell. Fix B2 by rolling the draft back in `writeCheckIn`'s catch,
or by dropping A's second clause. Fix B3 by making the printed line match the sentence the
owner rules. Fix B4 with the same fixed-sentence pattern four lines up. Then re-run the bar,
and put F1 at the head of the next ticket, because it is the same class and it is live.
