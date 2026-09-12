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
`rebuild/lanes/c/C3-HAND-PROOF.md` (hand-test style) · `rebuild/lanes/d/CHARTER.md` · **`rebuild/lanes/d/BRIEF-C6-RELAY.md` and `SOURCE-C6-{OPENAI,CONTRACT}.md` @ `rebuild/lane-d-c6` `f3eea83`**.

## 1. CUSTODY, AND WHAT C6 IS NOT

**Part A ADDS**, under `rebuild/coach/` (lane C exclusive, `LANES.md`): `onboarding-tools.cjs` (the closed
tool list and its dispatcher), `onboarding-text.cjs` (the scripted driver that stands in for the model),
`scripts/onboarding-script.json` (the transcripts), `test/onboarding-tools.test.cjs`,
`test/onboarding-parity.test.cjs`, `test/onboarding-closed-list.test.cjs`. It **EDITS** `local-world.mjs`
(one factory that opens a setup host beside the gym and check-in hosts it already opens).

**Part C ADDS**, later and on its own branch, under `rebuild/m3/w7-preview/today/`: `voice-session.mjs`,
`voice-app.mjs`, `test/voice.test.mjs`, plus the four shared page files under the standing licence
(`DECISIONS:135 (1)`: `today-app.cjs`, `screens.template.html`, `design.cjs`, `build.mjs`).

**OUT, always**: `rebuild/engine/**`, `rebuild/client/**`, `rebuild/m4/**`, `rebuild/conform/**`, `.github/**`
and the relay itself (lane D). C6 writes no model prompt into the repo as product code and no provider key.

**C6 IS NOT** a second way to build a week: it is a second way to ANSWER THE SAME SIX QUESTIONS; the screens
stay the fallback, the review step and the record, and the op is the same op.

## 2. PART A - THE TEXT REHEARSAL (build starts now)

The C5 prototype proves the shape: a fixed script routed to a fixed intent, tools returning tagged values,
templates with no digits (`coach-text.cjs:9-15`), and a mechanical traceability check (`tools.cjs:253`).
Part A does the same for onboarding with **no model**: a scripted driver reads a transcript and calls tools.
There is no network and nothing is sent anywhere.

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

- **Known, cited**: the app is an installed PWA, `display: standalone`, service worker for offline launch of
  the exact built assets (`A5-REPORT.md:297`, `:617`); the CSP and zero-off-origin rule are A1's and A5's.
- **UNKNOWN, and stated as unknown**: no real iPhone has run this build at all (`A5-REPORT.md:524-528`).
  So **whether `getUserMedia` prompts, persists and survives relaunch inside an iOS Home Screen app is
  UNKNOWN to this repository**, and a hand-test row exists to decide it. The build must not assert it
  either: the screen says what it has confirmed and offers the tap path when the microphone is unavailable,
  naming the browser's own refusal.
- **Design consequence**: permission is requested when the athlete chooses "talking", never on load, and a
  denial is a named, dash-free sentence plus the tap path, never a dead end.

### 3.3 Consent, cap, recording

Opt-in is **per user**, its proof shape already exists (`tools.cjs:985` `OPT_IN_REQUIRED`, refused with
`COACH_OPT_IN_REQUIRED` `:986`, named users `:984`), and the wording must NAME that audio and text leave the
phone (`:89`, `:134`); the sentence is the builder's to write and the reviewer's to check, and it is a
separate local record (`:156 (3)`). No server-side recording. **The minute cap is the PHONE's at 10 minutes
and the budget the relay's at $15** (`:158`); see 3.6. The owner's $50 project cap is verified before any
live call by `verifyCostCap` (`tools.cjs:938`, fields `:927`) and gated by `startLiveSession` (`:1019`).

### 3.4 The Part C acceptance bar

| id | check |
|---|---|
| V1 | **Wave one**: voice is optional; declined, refused or unavailable, the gym card behaves exactly as it does today and every write still goes through its own dispatcher. (The onboarding parity form of this row returns when onboarding's wave comes) |
| V2 | "I'll tap instead" on every screen loses nothing: switch mid-question, finish by tap, assert the answers object is unchanged apart from the answer in flight |
| V3 | Any spoken answer is correctable by tap, and the tap wins; correcting after the read-back re-runs the read-back |
| V4 | **Wave one permits confirmed spoken writes** through the existing dispatcher (a set, a machine setting), each with the tier-1 spoken confirm naming its values; an unconfirmed utterance writes nothing. The old "submit is a tap, no spoken write" row belongs to onboarding and returns with it |
| V5 | The model receives ONLY the closed tool list, and the PHONE does not carry it: the request body has no tool, model, instruction or session-config field at all (3.6), and the declared surface is the relay's, checked against `TIERS` by the agreed artifact |
| V6 | Every spoken number traces to a tool result in the same turn (`tools.cjs:253`), over the recorded transcripts of the hand test |
| V7 | The phone never holds a long-lived provider key: a source and built-asset scan finds no provider key shape; the only credentials are the per-phone relay credential (`:156 (3)`) and the SDP answer, and neither the provider key, account id nor any billing figure ever arrives |
| V8 | Mic denial and mic absence are named, dash-free, and offer the tap path; the browser's own error is quoted, not invented |
| V9 | Off-origin is exactly: one relay origin and the provider's documented transport origins, each named and pinned, no wildcard (3.6). Asserted at build time and at run time |
| V10 | No recording: nothing writes audio or a transcript to the store, and the only durable writes are the ops wave one's own tools make through the accepted paths |
| V11 | 390x844 and 320px with the transcript filling; inputs >= 16px; tap targets >= 44px; the primary action reachable in every state |
| V12 | The owner's iPhone hand test PASSES, and it is the **five-step gym demo** of `COACH-EXPERIENCE-BRIEF.md` (`:156 (5)`), not 3.5's onboarding rows. Not substitutable by a unit test: audio is untestable in the pane |

### 3.5 The hand test, owner's iPhone (C3-HAND-PROOF style)
**SUPERSEDED by 3.6.** These rows are an ONBOARDING script; `:156 (5)` and `:140` make the wave-one hand
test `COACH-EXPERIENCE-BRIEF.md`'s five-step gym demo. Kept as the onboarding hand test, re-pinned later.

### 3.6 Part C v0.3: the SDP /session hand-off (lane D f3eea83 + wire pins d66f76c)

Lane C's review of lane D's relay brief, now RULED by `DECISIONS:156` and `:158` and amended by lane D's
four asks in `C6-WIRE-PINS-v0.1.md` (`d66f76c`), all four applied below. `POST /session` with the
GPT-Live-1 SDP exchange replaces the token mint; ":134's token wording is read as admission" (`:156 (1)`).

**Every C6 boundary, checked:**

| boundary | verdict |
|---|---|
| the phone never receives a long-lived key, account id or billing figure | **HELD, and strengthened** (D section 2: "No credential, cap receipt, account id, charge or usage amount appears in the reply"; no SDP on error) |
| named error codes, never provider text | **HELD** (D section 2 envelope `{ok:false,code,nonce}`, nine fixed codes). Lane C owns the copy: one dash-free sentence per code with the tap path beside it, delivered in the phone build and pinned by the reviewer |
| opt-in per named user, wording that names audio and text leaving the phone | **HELD, and strengthened** (D section 3 binds it to the authenticated principal and requires that screen version's actual transfer wording; the consent record stays local to the phone) |
| one CSP host | **AMENDED, correctly**: WebRTC needs the provider's media path, so it is one relay origin PLUS the provider's documented transport origins, each named and pinned, no wildcard. Lane C accepts and V9 is re-aimed |
| the relay stores nothing | **AMENDED, openly** (D section 4). Lane C ACCEPTS the minimal control state (authenticated user, nonce digest, opaque session id, deadline, admission state, reservations) on two conditions: it carries **no athlete content, no SDP, no audio, no transcript, no tool result and no opt-in text**, and it has a stated retention bound. D says this needs a PM line rather than reading it into C's "counters only"; lane C agrees it does |
| the per-session minute cap is enforced relay-side | **NOT PROVED, and D was right to say so.** The Live create schema exposes no session duration; the REST hangup page documents SIP and WebRTC applicability is unverified; Live sideband would put audio through the relay, which C6 forbids. D's resolution stands: prove WebRTC termination first, else `/session` refuses with `COACH_ENFORCEMENT_UNAVAILABLE` before any provider call |

**The cutoff, RULED.** `DECISIONS:158`: the owner said yes to going live without server-side hang-up, on two
conditions the PM enforces. The wave-one **session cap on the phone is 10 minutes**; at the cap the phone
stops its microphone tracks and closes its `RTCPeerConnection`, and **the screen says the app ended the
call**. The relay's **monthly budget starts at $15** of minutes across both users (not `:156 (4) (b)`'s
70 %), with the owner's $50 project cap the hard ceiling. **C6-05 reads "phone termination + provider cap +
idle timeout"** until lane D proves server-side termination on a synthetic session, at which point it goes
in without a further ruling.

**The copy describes the phone's action and nothing else** (lane D ask 4; `:158`). The phone's timer is not
the spend guarantee and no string may imply it is: the sentence names what this phone did, never provider
finalization or billing. Lane D's suggested caption `Audio stopped on this phone.` is a fair factual shape;
lane C owns the final wording and the reviewer pins it. **There is no owner-watched demo exception**
(`:156 (5)`, lane D ask 1): `/session` refuses before provider creation until its prerequisites hold, and
a separately authorized synthetic verification is not an enabled product demo.

**What Part C must do differently from section 3.1 to 3.5:**

1. **WebRTC, not a bearer token.** The phone creates an `RTCPeerConnection`, gathers an SDP offer, POSTs
   `{user, opt_in, nonce, sdp_offer}` with its admission credential, and sets the returned `sdp_answer` as
   the remote description. Mic permission is requested before the offer, so a denial costs no session.
2. **A per-phone admission credential, RULED** (`:156 (3)`): one relay credential per enrolled phone, minted
   by the owner at enrolment with the PM in the pane, **stored on the phone**, mapped server-side to `joe`
   or `dad`, revoked by removal, and **never the ledger authority key**. Consent stays a **separate local
   record** and no athlete history reaches the relay. Its cryptographic profile, expiry and refresh remain
   the open C/D companion contract; a header's presence never authenticates a caller.
3. **The closed tool list is the SERVER's session config, not the phone's and not per turn, and for wave one
   it is `wave1-tools.cjs`, NOT the onboarding tools** (lane D ask 2; `:156 (5)`). D section 2 rejects
   client-supplied tools, model, instructions and session configuration, so the phone sends none: V5 is "the
   request body has no tool or config field at all", and the reviewer checks the relay's declared surface
   against the served wave-one tier artifact (`rebuild/coach/wave1-tools.cjs`), through an agreed artifact.
4. **Wave one is the gym demo, not onboarding.** Agreed (D section 1, `DECISIONS:140`): the first live bar
   is `COACH-EXPERIENCE-BRIEF.md`'s five-step script, so the phone session ships for the gym conversation
   and onboarding rides the same transport in its own wave. Section 3.5's rows are the onboarding hand test
   and are marked superseded for wave one.

## 4. THE TOKEN HAND-OFF CONTRACT - SUPERSEDED
The `POST /session-token` proposal is **replaced** by lane D's SDP `POST /session`
(`rebuild/lanes/d/BRIEF-C6-RELAY.md` @ `rebuild/lane-d-c6` `f3eea83`); lane C's review, the boundary
verdicts and the Part C deltas are **3.6**. The old text is in this file's git history.

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
| `ONBOARDING_TOOL_NOT_IN_LIST`, subtest floors (30/18/10), the six parity fixtures | nothing upstream states them | **INVENTED**, declared here |
| the wire vocabulary of `POST /session` | lane D `f3eea83` section 2, which marks it INVENTED | **INVENTED by lane D**, adopted here |
| the opt-in sentence, the first-launch question, every Part C screen string | not written yet | **TO BE WRITTEN** by the builder, pinned by the reviewer before the hand test |

## 6. OUT OF SCOPE, HANDED ON

- **The relay** (Part B): lane D (`:138`, `:139`); no deploy without the owner's word (`:134`).
  **P6 reason-on-disk**: PM's brief; **not a prerequisite** (`:134`: tier 2 only, onboarding is tier 1).
- **The full tier-2 voice coach** (daily use): `:139`. **The coach CI step**: rides the B-NTC re-seal.
- **The provider key and its $50/month cap**: the owner's action in the pane (`:139`). No live call before it.
- **F1 FULL-BODY, F2, H3**: engine tier, lanes B and D. C6 reads whatever the split rule produces.

## 7. OPEN QUESTIONS (REQUESTS-ready one-liners)

1. `C -> PM · C6 Part A is buildable now under :139 (a) and touches only rebuild/coach/** (lane C exclusive). Confirm no separate licence line is needed, and that Part C's four shared page files ride the :135 (1) standing licence under one-Today-build-at-a-time behind A4b.`
2. `C -> PM · A4B-BRIEF.md is NOT on the tip (it is rebuild/lane-c-a4b @ c2bfcff). C6 Part A's parity fixtures need A4b's catalogue and the three-member {profile, setup, tags} payload. Confirm Part A builds against the A4b branch and rebases at its merge, or that it ships against the two-member payload and gains tags later.`
3. `C -> PM · The opt-in sentence that names audio and text leaving the phone is owner-facing copy. Does the owner want to write it, or does the builder draft it and the owner approve it at the hand test?`
4. `C -> D · C6 WIRE PINS v0.1 (d66f76c), lane C REVIEW. BOUNDS ACCEPTED AS WRITTEN: lower-case UUIDv4 nonce retained across a logical retry, canonical UTC YYYY-MM-DDTHH:mm:ss.sssZ with valid calendar values, SDP nonempty and at most 65536 UTF-8 bytes both ways, request FOUR members, success SEVEN, error THREE, unique JSON keys, application/json, Cache-Control no-store, no body logged, error nonce null when unparseable, and an ambiguous failure after POST is NOT permission to mint a new nonce. BEARER CARRIAGE: YES, acceptable. Reason: the credential is relay-scoped and per phone (DECISIONS:156 (3)), it is minted by the owner at enrolment, mapped server-side to joe or dad and revoked by removal, it is never the OpenAI key and never the ledger authority key, and a header keeps it out of the JSON body, the SDP, the query string and the logs. Lane C adds two conditions: the phone stores it in the app origin's own storage and never in a URL or a log, and lane C will NOT implement admission as a string-presence check, as your pin already says. STILL OPEN and blocking Part C: the credential's cryptographic profile, expiry, refresh and revocation signal to the phone; the relay origin plus the recorded browser transport inventory (pin 1); and pin 3's cutoff notification, which lane C now treats as NO EVENT by default per DECISIONS:158, with the 10-minute phone cap and the phone-only caption. FOLDED: :156 and :158 are in BRIEF-C6-VOICE-ONBOARDING.md 3.6 v0.3, your four asks all applied, the demo exception removed, server tools pointed at wave1-tools.cjs, the V criteria re-pinned to wave one.`
5. `C -> PM/D · iOS microphone permission inside an installed Home Screen app is UNKNOWN to this repository (A5-REPORT.md:524-528: no real iPhone has run this build). Row 2 of the hand test decides it. If it fails, is C6 voice deferred to Safari-tab-only, or dropped for Dad's first day with the screens path standing?`
