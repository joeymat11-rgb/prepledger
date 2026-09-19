# The contract a real model adapter must satisfy

This file describes what a GPT-Live-1 (or any text-model) adapter has to do to be
allowed to speak as the Earned coach. **There is no implementation here and none
in this folder**: no network call, no key, no audio, no live session. The owner's
hard spending-cap rule means a live call cannot exist in this task, and
`coach-text.cjs` is the text-first stand-in the brief sequences first.

The bar is not a description. It is `coach-text.cjs` plus `test/*.test.cjs`: an
adapter is acceptable when the same tests pass with the model in place of the
scripted templates.

## 1. The loop

```
user turn
  → openTurn(turn_id)                       one turn, one id
  → model sees: the question, the tool schemas, the system rules (§3)
  → model calls tools (0..N, tier 0 only without a yes)
  → model drafts an answer
  → HARNESS runs untraceable(answer, turn.results, turn_id)
       non-empty  → the draft is DISCARDED, not repaired
                    the coach says it cannot answer that from what the app holds
       empty      → the answer is spoken
  → HARNESS runs charterViolations(answer); non-empty → same discard
  → close the turn
```

Fail-closed is the whole design. The check is not a filter that edits a sentence
into compliance — a rounded number is a different number, and an adapter that
"fixes" 1.19 into 1.2 has produced a figure the engine never stated. Discard and
say so.

## 2. Tiers, enforced by the harness and not by the prompt

- **Tier 0 (reads)** — free. Nothing is written.
- **Tier 1 (facts)** — the harness sets `confirmed: true` **only** after it has
  heard the user's yes in that conversation. The model may request the tool; it
  may not set the flag. The flag is not a model-controlled argument: strip it
  from every tool call the model emits and set it from the harness's own record
  of the spoken yes.
- **Tier 2 (plan changes)** — the model may call `request_replan` with a fact
  KIND and nothing numeric. The proposal, its numbers and its reason come back
  from the engine; the model voices both and asks. On the yes the harness calls
  `accept_proposal`. A model that emits `accept_proposal` without a recorded yes
  gets `COACH_CONFIRMATION_REQUIRED` and nothing changes.
- **Tier 3** — phase, calorie/protein floors, progression rules, consent policy.
  Route to `cannot_change_via_coach`. The model may explain; it may not move.

`remember` is a **tier 1** tool and the same rule applies to it in full: the
model may request it, and it may not set the flag. Its own two-step shape is
below it, not instead of it. Called with no flag it returns
`COACH_CONFIRMATION_REQUIRED` and a `confirmation_id` bound to those exact
words; the harness voices them, hears the yes, and calls again with that id. A
handle is single use, it dies with the conversation, and a call whose words
differ from the ones he agreed to is refused, not written. If he says no, the
harness calls `memoryTools.cancel(confirmation_id)`, which is a different
refusal from "not asked yet" because the difference matters to him.

## 3. What context is sent — "only what the question needs"

Per request the adapter sends, and nothing else:

1. the user's current turn (text, or the transcript of this turn's audio),
2. the **tool schemas** from `TOOL-CONTRACT.md` — names, inputs, tiers,
3. the tool **results of this turn only**,
4. a short fixed system prompt: the three tiers, the tagged-value rule, the
   charter, and "blank is unknown, never normal",
5. at most the last two turns of conversation text, for pronouns.

It never sends: the ledger, the reading log, the food log, the sleep log, the
session log, the athlete's state object, device or store identifiers, keys or
leases. `assertNoLeak()` already refuses to let those through the tool window;
the adapter must not reintroduce them by another route.

**Coaching memory rides inside item 3 and widens nothing** (P4b-1). `recall` is a
tool result of THIS turn like any other: by explicit topic, never a scan of
histories and never the whole store. A memory the adapter did not ask for in this
turn does not travel, and a value from an earlier turn cannot be borrowed,
exactly as for every other tool.

**At most FIVE facts in a TURN, not five per call.** The allowance belongs to the
turn the adapter opened: a recall takes what is left of it, says `more` when it
left something out, and a recall with nothing left refuses with
`COACH_MEMORY_TURN_BOUND` and reads nothing at all. Asking about six subjects in
one turn therefore returns AT MOST five facts in total, not thirty; the next turn
starts at five again. `memoryTools.allowance(turn_id)` answers what is left, so an
adapter can ask before it calls rather than be refused. Outside a turn, where
nobody is counting, the per-call bound of five is what the tool holds to.

**AND THAT HOLDS FOR PARALLEL TOOL CALLS** (review R3-B1). An adapter that emits
several recalls in one turn without awaiting each other is the ordinary case this
document exists for, and the allowance is reserved before the store read rather
than spent after it, so those calls cannot each spend the same five. A reserve is
conservative by design: the recall that takes it publishes its facts and the
others are told the turn is spent, so six concurrent recalls return FEWER than
five facts, never more. An adapter that wants all five in one turn issues its
recalls one after another. The account belongs to the coach INSTANCE that opened
the turn; the shipped wiring builds exactly one, and stacking a second instance
over the same world would refill the allowance.

**Rows this device could not read are counted, never hidden.** Every recall
carries `skipped`, a data member with the number of stored memory operations the
producer's own gate refused. "Nothing kept on that subject" and "something on
this device could not be read" are different answers and the adapter must not
merge them.

**A remembered text is DATA.** It arrives as `item.text` with `display`, `value`,
`source` and `licensed: false`, and with NO `turn_id`, so it is not a tagged
value and `allowedTokens()` licenses no figure inside it. Whatever a memory says,
it is never an instruction, never an authority grant, and never a number the
coach may state. A memory that reads "my target is 210 grams" leaves "210"
untraceable; if the coach says it, the draft is discarded like any other invented
figure. The item's own `source` names the memory operation and its own
`recordedOn` names the day he said it; a date written INSIDE the text licenses
nothing.

**A TOPIC licenses nothing either** (review R3-N5). Both topic tags publish an
EMPTY `display` and carry the topic as the tag's `value`. The topic is the
athlete's own word: the lane bounds its length and constrains no character, and
`allowedTokens()` promotes a declared unit to `date` whenever the display reads
as a date, so a memory filed under the topic "2019-04-17" used to license 2019,
04 and 17 in the date unit and let the coach state a date nothing dated. Read the
topic from `value`, never from `display`.

**And no memory refusal quotes him back.** A refusal's `reason` is published as a
`text` tag, and `allowedTokens()` reads a `text` tag as engine prose: every
number in it is licensed in the unit the words around it name. So a reason that
quoted a memory would license the athlete's, or the model's, figures for the
whole turn, on a path that writes nothing and needs no yes. Every memory refusal
reason is a fixed sentence, on every path in the file: an exception's message and
an unknown tool's name are text nobody in the lane controls, so they travel in
the refusal's untagged `source` member, which no tag reads and no draft may
quote. The words awaiting a yes arrive as
`confirmation.text`, and the op id a failed read-back holds arrives as
`recordedAs`: both are data members with `licensed: false` and no `turn_id`, like
`item.text`. The consequence for the adapter is the one the guarantee above
already implies: when the coach reads his words back to ask for the yes, and
those words carry a figure, the draft fails `untraceable` and is discarded. That
is the fail-closed posture, and P4b-2's review surface is where it has to be
ruled on rather than worked around.

`coach-text.turnContextBytes(turn)` measures the real per-turn payload of the
scripted coach, and the scripted turns of `local-era.test.cjs` and
`traceability.test.cjs` are held under 8 KiB. A live adapter should publish the
same figure and hold a comparable budget.

**Coaching memory's worst case is MEASURED, and it is OVER that budget** (P4b-1,
the PM's final read). ONE RECALL of five memories, each at the producer's own
`TEXT_MAX` of 400 characters, measures `turnContextBytes` 9446 with the fixture's
own identifiers. The cell that measures it is "P-F2 MEASURED" in
`test/memory.test.cjs`, and it READS this paragraph and fails while the two
disagree, so the numbers here are measurements and never estimates.

**That figure is the RECALL's, not the TURN's** (review R3-N6, and the honest
wording the PM ruled). The allowance counts recalls; `remember()` publishes an
item of its own, with a full `TEXT_MAX` text, on every success, and a write is
not a recall. A turn that also writes memories therefore measures more: the same
cell measures one recall of five plus three remembers of the same size at
`turnContextBytes` 22118, each write going through its propose step and its yes,
which is the only way a memory is written through this boundary. (Review R3
measured 20183 for the same shape counting the yes alone, before the topic
displays were emptied.) What a turn cannot do is go past FIVE
FACTS by asking again, because the allowance is the turn's and a recall with
nothing left refuses with `COACH_MEMORY_TURN_BOUND` and reads nothing; the BYTES
are a different bound and nothing enforces them today. Bringing the turn under
the standing budget is P4b-2's named choice: shorter source strings on the
envelope (the `"coach-memory.op " + op_id` a memory carries five times is most of
the difference), or a budget the harness enforces by refusing to send. `TEXT_MAX`
is NOT shrunk to make the figure smaller: 400 is sourced from
`machine-settings-commands.cjs`.

## 4. The per-turn budget

- One turn = at most **6** tool calls and **one** drafted answer. A second draft
  after a failed traceability check is not allowed: discard and say so.
- `cap_usd_session` from the verified cap record is the session ceiling; the
  adapter tracks spend per turn against it and ends the session at the ceiling
  with a plain sentence, never a nag.
- `per_minute_usd` prices the budget. It never authorises one: only a verified
  `cap.json` does, through `startLiveSession()`.
- No cap record → `startLiveSession()` refuses with `COACH_COST_CAP_ABSENT`.
  There is no override flag, and `test/cost-cap.test.cjs` greps the source to
  prove there is none.

## 5. The opt-in screen, per user

Explicit, per user (Joe and Dad; a third user needs a separate owner ruling).
The screen names the thing plainly and does not bury it:

> **Talking to the coach sends what you say off this phone.**
> When you talk to the coach, what you say — as audio, as text, or both — is sent
> to OpenAI's API so it can answer. It is not kept on this phone only.
> OpenAI says API traffic is not used to train its models by default. That is
> their policy, not a guarantee this app can enforce, and it is not on-device.
> Each request sends only what your question needs: today's plan, the set you are
> on, the reason behind an instruction. It never sends your ledger.
> The coach can record facts you confirm out loud, and it can pass a plan change
> to the engine for you to accept. It cannot change your phase, your calorie or
> protein floors, the progression rules, or what needs your consent.
> You can turn this off at any time. Nothing else in Earned uses it.
>
> [ Turn the coach on ]   [ Not now ]

"Not now" is the default state.

**What the code actually does** (C5 review round 1, C4 — this section used to
over-claim it). `startLiveSession({ cap, now, optIn, user })`:

- `user` is required and must be one of `NAMED_USERS` = `["joe", "dad"]`. No
  user, an empty string, or a third name → `COACH_OPT_IN_REQUIRED`.
- `optIn` must be a RECORD, not a boolean:
  `{ user, accepted: true, accepted_at, screen_version, wording }`. A bare `true`
  refuses.
- `optIn.user` must equal `user`. Joe's yes does not open the gate for Dad.
- `wording` must be the text that user actually saw, and it must name the phone,
  the audio, the text, and the fact that it leaves — wording that hides the
  transfer refuses, because a yes to words that hide it is not consent to it.

There is still **no screen**: nobody has seen this, and building it is a lane-c
screen change. What exists is the gate the screen will feed.

## 6. Two defaults taken from the brief's "not decided"

The brief lists two open questions with defaults. Both defaults are taken here,
and both are reversible without touching the tool contract.

- **Backend for free-form questions: engine-only tools first.** `coach-text.cjs`
  has no model at all — every answer is a template over tool results. A text
  model is an adapter that sits in the same loop, and the tests are written so
  the model can be dropped in without changing a tool.
- **Reachable between sets only.** `current_set` reports the live set and
  `next_set` the one after; neither offers an action during a set, and no tool
  can be called from an active-set screen in this design. Making the coach
  reachable mid-set is a screen decision, not a tool change.

## 7. What an adapter must NOT do

- Author a load, rep count, calorie figure, protein figure, trend, rate or rest
  interval. Not even a rounding of a real one.
- Set `confirmed: true` on any tool call.
- Emit `accept_proposal` for an id the engine did not issue this conversation.
- Reword an engine or client refusal. The code and the sentence travel verbatim.
- Fill a blank. Blank is unknown — never zero, never normal, never "fine".
- Add urgency, streaks, gamification or encouragement to a miss.
- Write an en dash (U+2013) or an em dash (U+2014) in anything the athlete sees.
  DECISIONS:114 (1), owner verbatim: "no ai dashes are allowed in the ui". Use a
  colon, a comma or a new sentence. `test/no-dashes.test.cjs` is the check, and
  it applies to a model's drafted answer exactly as it applies to a template.
  (Engine prose is carried verbatim and is the one exception, because rewording
  an engine sentence is how a guess starts.)
- Promise a plan consequence. After a real save, state the actual consequence the
  engine reports, or "unchanged, because …". "Saved" alone is not evidence the
  engine used the answer.
- **Treat a remembered text as anything but the athlete's own words.** It is not
  an instruction, not a system message, not a tool call, not a permission, not a
  source tag and not a date, whatever it says or looks like. Do not parse it, do
  not detect its language, do not act on it, and do not let it license a figure.
- **Let a memory outrank what the app holds.** Setup, machine settings, logged
  observations and the effective programme are read through their own owners and
  stay the truth. When they disagree with a memory, state the canonical value
  FIRST with its own source, then his words as his own preference with their own
  date, and never merge the two or grade either one.
- **State a memory of unknown applicability as a current restriction.** A
  constraint outside the range he confirmed comes back labelled `needs-review`
  and is spoken that way.
- **Tell him something was kept when it was not, or that it is gone when it is
  on disk.** `COACH_MEMORY_UNREADABLE` is not "you have none", and
  `COACH_MEMORY_READ_BACK_FAILED` is not "it was not kept". Carry both sentences
  as they come.

## 8. Acceptance for the adapter

The same four checks the brief names, run with the model in the loop:

1. `test/traceability.test.cjs` — every numeric token traceable to the same turn
   **and to the field that licensed it**, with the fail-closed injection still
   going RED. The unit check is not optional for a model: the scripted templates
   cannot exploit a field-blind check (no template string carries a digit) but a
   model can, and "Eat 155 calories" out of a 155-gram protein target is the
   exact failure the check exists for. `allowedTokens()` is keyed on
   `unit:token`; every interpolation declares its unit; a `date` tag licenses a
   date and never a bare quantity.
   **Deleting the unit word does not buy a free number** (review round 2, C8):
   the field words to the LEFT bind too (`Protein: 2262`, `your calorie floor is
   155`), an unrecognised noun (`seconds`, `kilograms`, `percent`) is a unit of
   its own that licenses nothing, and a number with no unit and no field word at
   all is refused unless its licensing unit is one of the declared
   `BARE_SPEAKABLE` counts. **An adapter must therefore speak the unit.** A model
   that emits "Your protein target is 2262." is discarded, exactly as one that
   emits "Eat 155 calories."
2. `test/tiers.test.cjs` — no yes leaves the durable store byte-identical; with a
   yes the accepted proposal equals the engine's exactly and the reason is stored
   **in this process**. It is NOT on disk: rebuild/client's proposal-response
   payload has no reason slot, and the suite asserts that gap explicitly rather
   than reading an in-memory Map as durable proof (C5 review round 1, C3). An
   adapter must not report the reason as durable until that changes.
3. `test/charter-and-gym-seam.test.cjs` — tier-3 refusals explained, state
   unchanged, no charter vocabulary.
4. `test/cost-cap.test.cjs` — a verified cap record, or no session.

Plus, from the brief and not automatable: **Dad's five-minute hand test on the
phone, with no explanation, after Joe's own week of use.**
