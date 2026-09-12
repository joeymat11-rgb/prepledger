# BRIEF-C6 - VOICE ONBOARDING (the coach conducts Dad's first run)

Tier **screens** (`DECISIONS:88`): ONE independent Opus reviewer (author != reviewer, told to disagree) + CI
green both OS. C6 adds no engine code and changes no engine byte.

Authority: `DECISIONS:89` (voice = mouth, engine = brain), `:133 (3)` (accepted as the coach's first voice
use-case), `:134` (the plan of record), `:135` (standing licences, preflight), `:138` (Dad in days; lane D =
Astra owns the relay), `:139` (the three pieces run in parallel; the split below).

Base `32408277be136ff5c41f7585c5f073e96e6c1252` (`origin/rebuild/t2-client-core`). Branch
`rebuild/lane-c-c6`. Docs only; nothing is built by this commit.

**THE SPLIT** (`DECISIONS:139`). **PART A, the text rehearsal, is buildable the moment this brief is
committed** (lane C, 1 day, no model, no network). **PART C, the phone voice session, is brief and bar only
here**; its build starts after A4b merges, under one-Today-build-at-a-time (`:116 (5)`). **PART B, the
relay, is lane D's** (`:138`); this brief proposes the token hand-off contract (section 4) and neither lane
builds against it until lane D answers by REQUESTS.

EFFORT (`DECISIONS:119 (5)`): Part A **builder MEDIUM**, Part C **builder HIGH** (a live provider session on
a phone), **reviewer HIGH** both parts, **integrator LOW**. This brief: HIGH.

Every vocabulary and number below carries a `file:line` source or is marked **INVENTED** (`:115` lesson).

## 0. READ-LIST (`DECISIONS:119 (6)`)

`DECISIONS.md` 89, 133 (3), 134, 135, 138, 139 · `rebuild/coach/VOICE-COACH-BRIEF.md`,
`TOOL-CONTRACT.md`, `tools.cjs`, `coach-text.cjs`, `local-world.mjs`, `model-adapter.md`,
`cap.schema.json`, `test/*.test.cjs`, `scripts/questions.json` · `rebuild/m3/w7-preview/today/setup-model.mjs`
and `setup-commands.mjs` · `rebuild/m3/w6/local/today-bindings.mjs:481-560` (`createSetupHost`) ·
`rebuild/lanes/c/dad-first-run/A4B-BRIEF.md` (**not on this tip**: it is on `rebuild/lane-c-a4b @ c2bfcff`;
the catalogue, the starter week, the day-kind rule and the `tags` payload member all come from there) ·
`rebuild/slice/pwa/**` and `rebuild/slice/A5-REPORT.md` (installed-app and iOS constraints) ·
`rebuild/lanes/c/C3-HAND-PROOF.md` (hand-test style) · `rebuild/lanes/d/CHARTER.md`.

## 1. CUSTODY, AND WHAT C6 IS NOT

**Part A ADDS**, under `rebuild/coach/` (lane C exclusive, `LANES.md`): `onboarding-tools.cjs` (the closed
tool list and its dispatcher), `onboarding-text.cjs` (the scripted driver that stands in for the model),
`scripts/onboarding-script.json` (the transcripts), `test/onboarding-tools.test.cjs`,
`test/onboarding-parity.test.cjs`, `test/onboarding-closed-list.test.cjs`. It **EDITS** `local-world.mjs`
(one factory that opens a setup host beside the gym and check-in hosts it already opens).

**Part C ADDS**, later and on its own branch, under `rebuild/m3/w7-preview/today/`: `voice-session.mjs`,
`voice-app.mjs`, `test/voice.test.mjs`, plus the four shared page files under the standing licence
(`DECISIONS:135 (1)`: `today-app.cjs`, `screens.template.html`, `design.cjs`, `build.mjs`).

**OUT, always**: `rebuild/engine/**`, `rebuild/client/**`, `rebuild/m4/**`, `rebuild/conform/**`,
`.github/**`, and the relay itself (lane D). C6 writes **no** model prompt into the repo as product code and
**no** provider key anywhere, ever.

**C6 IS NOT** a second way to build a week. It is a second way to ANSWER THE SAME SIX QUESTIONS. The screens
stay the fallback, the review step and the record; the produced op is the same op.

## 2. PART A - THE TEXT REHEARSAL (build starts now)

The C5 prototype already proves the shape for the daily coach: a fixed script routed to a fixed intent,
tools that return tagged values, templates that contain no digits (`coach-text.cjs:9-15`), and a mechanical
traceability check (`tools.cjs:253` `untraceable`). Part A does the same for onboarding, with **no model**: a
scripted driver reads a transcript file and calls tools. There is no network and nothing is sent anywhere.

### 2.1 The closed tool list

Seven tools, exactly the seven `DECISIONS:134` names, plus the tier-3 refusal that the C5 contract already
has (`tools.cjs:871-880` `cannot_change_via_coach`). Every one is **tier 1 (FACT)** except `review`, which
is tier 0, and the refusal, which is tier 3. `TIER` is `tools.cjs:28`.

| tool | tier | what it sets | the screens' own setter | lands in |
|---|---|---|---|---|
| `set_name` | 1 | the athlete's name | `setup-model.mjs:257` `setName` | `setup.athlete_label` |
| `set_days` | 1 | which weekdays he trains | `:261` `toggleDay` | `setup.split.map` |
| `add_exercise_from_catalogue` | 1 | one lift, by catalogue id | `:286` `addExercise`, `:298` `setExerciseField`, `:308` `chooseMg` | `setup.exercises[]` and the `tags` payload member |
| `set_machine_settings` | 1 | lightest setting, jump, rungs | `:298` `setExerciseField` | `exercises[].steps`, `.inc` |
| `set_priorities` | 1 | priority muscles | `:332` `togglePriority` | `setup.priority_muscles` |
| `review` | 0 | reads the whole document back | `:410` `document()` | nothing |
| `submit` | 1 | writes the one op | `setup-commands.mjs` `prepare`/`validate` | the `earned/first-run-setup/v1` op |
| `cannot_set_via_coach` | 3 | refuses a tier-3 topic by name | `tools.cjs:871-880` | nothing |

**What no tool can do, and this is the safety argument.** There is no tool that sets `sets`, `hi`, or a
day's session kind. Those are Earned's: the standard start (3 sets, aim for 10 reps) and the day-kind
alternation rule live in `setup-model.mjs` and in A4b's `split-kinds.mjs`, and `review` READS THEM BACK. A
model that wants to change them has no tool to call, so it cannot, and `cannot_set_via_coach` is what it
gets. This is the `DECISIONS:89` "the model never authors plan numbers" made structural rather than
promised.

### 2.2 How the list is CLOSED

`onboarding-tools.cjs` exports a frozen `TIERS` map, exactly as `tools.cjs:891-897` does for the fifteen
daily tools, and a `dispatch(name, args, turn_id)` that is the ONLY entry point. A name that is not a key of
`TIERS` returns, and never throws past the caller:

```
{ ok: false, tool: <the name as given>, code: "ONBOARDING_TOOL_NOT_IN_LIST",
  reason: "<name> is not one of the seven onboarding tools", allowed: [...the seven] }
```

The refusal **names the tool that was attempted**, so a transcript that tried one is diagnosable without a
debugger. The test enumerates `Object.keys(TIERS)` at test time and asserts it is exactly the eight names in
2.1: a tool added to the module without a brief amendment fails the suite.

### 2.3 The parity acceptance, which is the whole point

> A scripted transcript and the equivalent taps produce **the same op bytes**.

Concretely, in `test/onboarding-parity.test.cjs`, for each of at least six answer fixtures (a 2-day week, a
4-day week, an unnamed exercise, a free-text muscle, an uneven rung list, a skipped priority):

1. Drive `setup-model.mjs` by the screens' own setters for the fixture; call `document()`; call
   `setup-commands.mjs` `prepare({action, input:{setup, effective}})`. Call this `opTap`.
2. Drive `onboarding-tools.cjs` `dispatch` from the transcript for the SAME answers; `submit` calls the same
   `prepare`. Call this `opVoice`.
3. Assert `JSON.stringify(opVoice.payload) === JSON.stringify(opTap.payload)` (byte equality, not deep
   equality: key order is part of the claim), and that `validate()` is true for both.
4. On a REAL local-era world (`local-world.mjs`, which already opens the accepted client over sealed
   IndexedDB generations, `:1-22`), write each through `createSetupHost`
   (`today-bindings.mjs:481`) into two separate installations and assert the stored op's payload bytes are
   identical.

Step 4 is what makes this a rehearsal rather than a unit test: the same durable path, the same lease, the
same one-op rule.

### 2.4 The Part A acceptance bar (numbered, executable)

New tests, with floors the reviewer counts: `onboarding-tools.test.cjs` **>= 30 subtests**,
`onboarding-parity.test.cjs` **>= 18** (six fixtures x three assertions), `onboarding-closed-list.test.cjs`
**>= 10**.

| id | check |
|---|---|
| A1 | Byte parity, section 2.3 steps 1 to 3, all six fixtures |
| A2 | Durable parity, section 2.3 step 4, on the real local-era world |
| A3 | The tool list is closed: `Object.keys(TIERS)` is exactly the eight names; an unknown name returns `ONBOARDING_TOOL_NOT_IN_LIST` naming it and listing the allowed seven; the dispatcher never throws past the caller |
| A4 | No tool sets `sets`, `hi` or a day kind. Asserted by source: no onboarding tool's implementation references those fields as a write, and a transcript that asks for them gets `cannot_set_via_coach` |
| A5 | `review` reads Earned's standard back verbatim: the strings come from `setup-model.mjs` (`standardStartLine`, `standardStepLine`) and are not re-authored in the coach module |
| A6 | Tier-1 spoken confirm per fact: every tier-1 tool refuses with `CONFIRMATION_REQUIRED` (the C5 code, `tools.cjs:621`) unless the turn carries an explicit confirmation, and the confirm names the value it is confirming |
| A7 | Unknown stays blank: an "I don't know" answer on any question sets nothing, and the missing-answer list (`setup-model.mjs:342` `missing()`) names it. No tool writes a default |
| A8 | Tier 3 refuses: every topic in `NEVER_VIA_COACH` (`tools.cjs:306`) is refused by name, with no value set |
| A9 | No untraceable numbers: every digit in every transcript line passes `tools.cjs:253` `untraceable` against that turn's tool results. The templates themselves contain no digits, proved by scanning their own source as `coach-text.cjs:9-15` already does |
| A10 | No dashes: zero U+2013 and U+2014 in any coach string an athlete reads, by the existing `rebuild/coach/test/no-dashes.test.cjs` extended to the new modules |
| A11 | No network and no model: the new modules import nothing that opens a socket, and the driver is a file reader. Asserted by source scan |
| A12 | ONE op: a complete transcript writes exactly one operation; a transcript abandoned before `submit` writes zero, leaving no partial athlete |
| A13 | First-run-only is unchanged: with a first-run op already present, `submit` refuses with the same code the screens get, and no second athlete is constructed |
| A14 | Zero regressions, exact counts on the base: coach **64** (`rebuild/coach/test/*.test.cjs`), today **64**, copy **36**, gym **64**, checkin **28**, setup **104**, W6 **552**, journey **51**, A0 host **31**, w7-preview **19**, `native-carriers-package.cjs --ci` **PASS**, `build.mjs` **PASS**. Part A may only ADD |

**Mutants**, each must turn a check RED: C1 make `submit` build its own payload instead of calling
`prepare` (A1) · C2 reorder one key in the coach's document (A1, byte equality) · C3 add a
`set_rep_target` tool (A3 enumeration, A4) · C4 let `dispatch` fall through to a default handler for an
unknown name (A3) · C5 have `review` re-author the standard start string (A5) · C6 accept a tier-1 tool
without confirmation (A6) · C7 write `sets: 3` when the athlete says "I don't know" (A7) · C8 print a
number the turn's tools did not return (A9) · C9 write one op per answered question (A12) · C10 let a
second transcript overwrite an existing first-run op (A13).

**CI residual, to be carried on Part A's ledger line:** the coach tests are NOT in `rebuild.yml`'s
enumerated steps; `.github` is editable only inside an engine package that re-pins it (`DECISIONS:112`,
`:117 (4)`), and `:117 (4)` already routes the coach step to the B-NTC re-seal. Until it lands, the "CI both
OS" half is a RESIDUAL for the coach suites and the lane runs them locally at the exact head sha
(`:135 (3)` preflight).

## 3. PART C - THE PHONE VOICE SESSION (brief and bar only; build after A4b)

### 3.1 The experience (`DECISIONS:134`)

First launch offers **"Set up by talking, or by tapping?"**. Voice is OPTIONAL and never a gate
(`:139`: "voice stays optional and never gates Dad"). Choosing to talk opens the SAME six screens: they are
the live transcript. As the athlete answers, the answers fill in on the screen he is looking at; any answer
is correctable by tap at any moment; **"I'll tap instead" is available on every screen and loses nothing**,
because both paths drive the same `setup-model.mjs` answers object. At the end the coach reads back the week
(the `review` tool) and **the athlete taps Start**: the submit is a tap, not a spoken word.

### 3.2 Mic permission in the installed app: what is known and what is not

- **Known, cited**: the app is an installed PWA with `display: standalone` and a service worker whose only
  job is offline launch of the exact built assets (`rebuild/slice/A5-REPORT.md:297`, `:617`). Everything is
  same-origin; the CSP and the "zero off-origin requests" rule are A1's and A5's.
- **UNKNOWN, and stated as unknown**: no real iPhone has run this build at all
  (`A5-REPORT.md:524-528`: "No real iPhone was touched"; the iOS guidance on the page is guidance about
  where the Share control is, not a confirmed result). So **whether `getUserMedia` prompts, persists and
  survives relaunch inside an iOS Home Screen app is UNKNOWN to this repository**, and the first row of the
  hand test exists to decide it. The brief does not assert it either way and the build must not either: the
  screen says what it has confirmed and offers the tap path when the microphone is unavailable, with the
  browser's own refusal named.
- **Design consequence**: permission is requested at the moment the athlete chooses "talking", never on
  load; a denial is a named, dash-free sentence plus the tap path, never a dead end.

### 3.3 Consent, cap, recording

Opt-in is **per user** and its proof shape already exists: `tools.cjs:985` `OPT_IN_REQUIRED` is
`["user","accepted","accepted_at","screen_version","wording"]`, refused with `COACH_OPT_IN_REQUIRED`
(`:986`), and the named users are `["joe","dad"]` (`:984`). The wording must NAME that audio and text leave
the phone (`:89`, `:134`); the exact sentence is **the builder's to write and the reviewer's to check**, and
it is stored with the opt-in so a later reader can see what was agreed. No server-side recording
(`:134`). The per-session minute cap is enforced **by the relay**, not by the phone, because a phone-side
cap is advisory. The provider spending cap is the owner's, verified before any live call by the existing
`verifyCostCap` (`tools.cjs:938`, required fields `:927`) and gated by `startLiveSession` (`:1019`).

### 3.4 The Part C acceptance bar

| id | check |
|---|---|
| V1 | Voice is optional: with voice declined, refused or unavailable, the six screens behave exactly as they do today, byte-identical op for the same answers (Part A's parity test, re-run through the page) |
| V2 | "I'll tap instead" on every screen loses nothing: switch mid-question, finish by tap, assert the answers object is unchanged apart from the answer in flight |
| V3 | Any spoken answer is correctable by tap, and the tap wins; correcting after the read-back re-runs the read-back |
| V4 | Submit is a tap. No spoken utterance can write the op; asserted by driving a transcript that says "submit" and finding zero operations |
| V5 | The model receives ONLY the closed tool list: the session's tool declaration is built from `onboarding-tools.cjs`'s `TIERS` at run time, and a declaration carrying any other name fails the check |
| V6 | Every spoken number traces to a tool result in the same turn (`tools.cjs:253`), over the recorded transcripts of the hand test |
| V7 | The phone never holds a long-lived key: a source and built-asset scan finds no provider key shape; the only credential in memory is the short-lived token from section 4, and it is never persisted |
| V8 | Mic denial and mic absence are named, dash-free, and offer the tap path; the browser's own error is quoted, not invented |
| V9 | No off-origin request except the provider audio stream and the single relay token call; asserted at build time and at run time |
| V10 | No recording: nothing writes audio or a transcript to the store; the only durable write of the whole session is the one setup op |
| V11 | 390x844 and 320px with the transcript filling; inputs >= 16px; tap targets >= 44px; the primary action reachable in every state |
| V12 | The owner's iPhone hand test (3.5) PASSES, and it is not substitutable by a unit test: audio is untestable in the pane (`DECISIONS:134`) |

### 3.5 The hand test, owner's iPhone (C3-HAND-PROOF style)

Each row: what to do, what you should see, and PASS / FAIL / SEE (write what you saw). Expected strings are
pinned by `file:line` where they already exist; a row whose string does not exist yet says **(string to be
written by the builder; the reviewer pins it here before the run)**.

| row | do | expect | verdict |
|---|---|---|---|
| 0 | Launch Earned from the Home Screen, not Safari | The first-run choice: "Set up by talking, or by tapping?" (string to be written) | PASS / FAIL / SEE |
| 1 | Tap "by talking" | An opt-in screen naming that audio and text leave the phone, with a decline that is not a dead end (string to be written) | PASS / FAIL / SEE |
| 2 | Accept, then allow the microphone | iOS prompts once; the coach speaks first. **If iOS does not prompt, or the app cannot hear you, STOP and write SEE: this is the unknown in 3.2 and the answer is the point of the row** | PASS / FAIL / SEE |
| 3 | Say your name | Screen 1 fills in with what you said, and the coach confirms it aloud before moving on | PASS / FAIL / SEE |
| 4 | Say which days you train | Screen 2 fills in; Earned proposes each day's kind and SAYS the rule; you did not choose upper or lower | PASS / FAIL / SEE |
| 5 | Say "no, make Tuesday lower" | The day changes by tap or by voice, and nothing else moves | PASS / FAIL / SEE |
| 6 | Ask for something tier 3 ("change my calorie floor") | A refusal that names the topic and sets nothing (`tools.cjs:306` `NEVER_VIA_COACH`) | PASS / FAIL / SEE |
| 7 | Say "I don't know" to the lightest setting | It stays blank and is named in the summary. No number is invented | PASS / FAIL / SEE |
| 8 | Tap "I'll tap instead" mid-question | Everything already answered is still there | PASS / FAIL / SEE |
| 9 | Let the coach read the week back, then tap Start | Today opens, and the week is what you said | PASS / FAIL / SEE |
| 10 | Force-quit, relaunch | Today, not setup. Setup never runs twice (A4's rule) | PASS / FAIL / SEE |
| 11 | Turn on airplane mode and tap "by talking" | A named, dash-free sentence and the tap path. Never a spinner | PASS / FAIL / SEE |
| 12 | Send back | Every SEE verbatim, the elapsed time, and whether you would hand this to Dad | PASS / FAIL / SEE |

## 4. THE TOKEN HAND-OFF CONTRACT (a PROPOSAL to lane D)

Neither lane builds against this until lane D answers by REQUESTS (`DECISIONS:139`: "coordinate the token
hand-off contract with lane D by REQUESTS before either builds").

**Endpoint** `POST /session-token` on the relay Worker. Same-origin from the phone is impossible (the relay
is a different host), so the relay answers CORS for the app's origin only, and the app's CSP gains that one
host and nothing else.

**Request** `{ user, opt_in, nonce }`. `user` is `"joe"` or `"dad"` (`tools.cjs:984` `NAMED_USERS`);
`opt_in` is the five members of `tools.cjs:985` `OPT_IN_REQUIRED`; `nonce` is a client-generated id echoed
back, so a replayed response is detectable. **INVENTED**: the endpoint path and `nonce`.

**Response 200** `{ token, expires_at, session_minute_cap, session_id, provider, model }`. `expires_at` is
ISO and **at most 60 seconds** after mint (INVENTED; lane D may shorten it, and shorter is better);
`session_minute_cap` is an integer of minutes the relay will allow before it stops minting for this session.

**Errors**, each a named code and never the provider's error text: `403 COACH_OPT_IN_REQUIRED` (the C5 code,
`tools.cjs:986`) · `403 COACH_USER_NOT_NAMED` · `429 COACH_SESSION_CAP_REACHED` · `503
COACH_CAP_NOT_VERIFIED` (the $50/month provider cap is not confirmed) · `503 COACH_RELAY_UNAVAILABLE`. The
phone renders each as its own dash-free sentence with the tap path beside it.

**The phone must NEVER receive**: the long-lived provider key, the provider account id, any billing or usage
figure, or any other user's anything. **The relay must NEVER store**: audio, transcript, tokens after
minting, or athlete data. Counters only (a session count and minutes, keyed by user id, carrying no
content), which is what "stateless" in `DECISIONS:134` has to mean to be checkable.

**REQUESTS-ready one-liner for lane D:**

`C -> D · C6 TOKEN HAND-OFF (proposal, BRIEF-C6-VOICE-ONBOARDING.md section 4; neither lane builds against it until you answer): POST /session-token, request {user: "joe"|"dad" per tools.cjs:984, opt_in = the five members of tools.cjs:985, nonce}, response 200 {token, expires_at (ISO, <= 60s after mint), session_minute_cap (integer minutes, enforced by the relay not the phone), session_id, provider, model}; errors 403 COACH_OPT_IN_REQUIRED (tools.cjs:986), 403 COACH_USER_NOT_NAMED, 429 COACH_SESSION_CAP_REACHED, 503 COACH_CAP_NOT_VERIFIED, 503 COACH_RELAY_UNAVAILABLE, each a named code and never the provider's error text; the phone NEVER receives the long-lived provider key, the account id or any billing figure; the relay NEVER stores audio, transcript, tokens after mint or athlete data (counters keyed by user id only). Confirm, amend or replace, and name the relay's origin so lane C can add exactly one CSP host.`

## 5. PROVENANCE

| what | source | verdict |
|---|---|---|
| the seven tool names | `DECISIONS:134` verbatim | **SOURCED** |
| tiers 0 to 3 and their meaning | `tools.cjs:28` `TIER`, `DECISIONS:89` | **SOURCED** |
| `cannot_set_via_coach` | modelled on `tools.cjs:871-880` `cannot_change_via_coach` | **SOURCED** (the C6 name is new) |
| tier-3 topic list | `tools.cjs:306` `NEVER_VIA_COACH` | **SOURCED** |
| `CONFIRMATION_REQUIRED` | `tools.cjs:621` | **SOURCED** |
| opt-in proof shape and named users | `tools.cjs:984`, `:985`, `:986` | **SOURCED** |
| cost-cap fields and the live-session gate | `tools.cjs:927`, `:938`, `:1019`; `cap.schema.json` | **SOURCED** |
| the traceability rule | `tools.cjs:253` `untraceable`; `coach-text.cjs:9-15` | **SOURCED** |
| the setup op and its validator | `setup-commands.mjs` `prepare`/`validate`; `today-bindings.mjs:481` | **SOURCED** |
| standard start (3 sets, 10 reps), day-kind rule, catalogue | A4/A4b, already marked INVENTED there; C6 only READS them back | **SOURCED to A4b** |
| $50/month cap, "week of 09-21", the two named users | `DECISIONS:134`, `:139` (owner) | **SOURCED** |
| `ONBOARDING_TOOL_NOT_IN_LIST`, endpoint path, `nonce`, the 60-second expiry, subtest floors (30/18/10), the six parity fixtures | nothing upstream states them | **INVENTED**, declared here |
| the opt-in sentence, the first-launch question, every Part C screen string | not written yet | **TO BE WRITTEN** by the builder, pinned by the reviewer before the hand test |

## 6. OUT OF SCOPE, HANDED ON

- **The relay** (Part B): lane D (`:138`, `:139`). No deploy without the owner's word (`:134`).
- **P6 reason-on-disk**: PM, `rebuild/slice/P6-REASON-ON-DISK-BRIEF.md`. **Not a prerequisite for C6**
  (`:134`: tier 2 only; onboarding is tier 1).
- **The full tier-2 voice coach** (daily use): `:139`, target ~09-21-23. C6 is onboarding only.
- **The coach CI step**: rides the B-NTC re-seal (`:117 (4)`).
- **The provider key and its $50/month cap**: the owner's action in the pane (`:139`). No live call before it.
- **F1 FULL-BODY, F2, H3**: engine tier, lanes B and D. C6 reads whatever the split rule produces.

## 7. OPEN QUESTIONS (REQUESTS-ready one-liners)

1. `C -> PM · C6 Part A is buildable now under :139 (a) and touches only rebuild/coach/** (lane C exclusive). Confirm no separate licence line is needed, and that Part C's four shared page files ride the :135 (1) standing licence under one-Today-build-at-a-time behind A4b.`
2. `C -> PM · A4B-BRIEF.md is NOT on the tip (it is rebuild/lane-c-a4b @ c2bfcff). C6 Part A's parity fixtures need A4b's catalogue and the three-member {profile, setup, tags} payload. Confirm Part A builds against the A4b branch and rebases at its merge, or that it ships against the two-member payload and gains tags later.`
3. `C -> PM · The opt-in sentence that names audio and text leaving the phone is owner-facing copy. Does the owner want to write it, or does the builder draft it and the owner approve it at the hand test?`
4. `C -> D · The token hand-off contract above. Confirm, amend or replace, and name the relay origin so lane C adds exactly one CSP host.`
5. `C -> PM/D · iOS microphone permission inside an installed Home Screen app is UNKNOWN to this repository (A5-REPORT.md:524-528: no real iPhone has run this build). Row 2 of the hand test decides it. If it fails, is C6 voice deferred to Safari-tab-only, or dropped for Dad's first day with the screens path standing?`
