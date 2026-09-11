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

`coach-text.turnContextBytes(turn)` measures the real per-turn payload of the
scripted coach and the tests hold every turn under 8 KiB. A live adapter should
publish the same figure and hold a comparable budget.

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
- Promise a plan consequence. After a real save, state the actual consequence the
  engine reports, or "unchanged, because …". "Saved" alone is not evidence the
  engine used the answer.

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
