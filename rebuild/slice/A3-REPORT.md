# A3 — THE RECOVERY CHECK-IN (builder report)

Branch `rebuild/slice-a3`, based on `rebuild/t2-client-core` @ `da63053` (A0 host, A1 Today,
A2 gym card, A5 shell, lane C local era, CI re-seal).
Tier: screens (DECISIONS:88). Acceptance = ONE independent Opus reviewer ACCEPT + CI green
both OS. Author never self-accepts.

Design of record: `rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html`
(sha256 `caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45`), its
`ADDITIONS-C-APPROVED-HANDOFF.md` item 3/4 and `RECOVERY-CHECKIN-C-NOTES.md`.
Owner approval: "Phenomenal, I love it now. Let's do it" (2026-09-08 ET).

---

## 1. WHAT WAS BUILT

Today's recovery entry — the one A1 shipped labelled "— not wired yet" — is now the
approved recovery check-in, over the same real durable stack A1's weigh-in and A2's gym
card use. It is also reachable from inside the workout flow, in the approved design's own
sentence ("How are you feeling today?").

> **REVIEW ROUND 1 (dafcd01) — ACCEPT-WITH-FIXES, one blocking.** F1 found that six of
> the approved screen's seven placeholder strings were missing from the shipped screen
> ("For example, quads and glutes", "Location and movement", "What you have noticed",
> "Days", "Optional", "What else should your coach know?" — only "—" survived), and that
> the design binding could not have caught it, because a placeholder is an ATTRIBUTE and
> the copy binding only reads text NODES. **The claim "word for word" below was therefore
> false at dafcd01 and is corrected here: it was true of every visible sentence and every
> choice, and false of six placeholders.** All six are now on the screen, and the recovery
> screen's whole vocabulary is no longer a hand-maintained list at all — it is harvested
> from the pinned approved bytes at check time (§2.1). F4, F5 and F7 are addressed below;
> F2/F3 are recorded in §3.5 and §9.

The screen is ADDITIONS C's recovery screen structure for structure and word for word:
last night's sleep (approximate hours and quality as **separate** signals), energy now,
muscle soreness now, stress now, "Anything else affecting today?" (Pain · Feeling ill ·
Time away), each with the conditional detail the approved notes enumerate, an optional
collapsed note, one primary action ("Add today's context") and the approved caption.

Behaviour, as the approved notes require:

* every answer starts unselected — no option is `aria-pressed="true"`, no `<select>` is
  off its "Leave unanswered" row, no field is prefilled;
* tapping a selected answer again clears it (including the sleep confirmation);
* **blank stays blank** — an unanswered question is ABSENT from the stored operation,
  never `null`, never `""`, never "None" and never zero. Not pressing "Pain" is silence,
  not a denial. "None" is stored only when the athlete taps None;
* a cleared issue's hidden detail is dropped, not merely hidden, and the command that
  builds the operation refuses it again at the door;
* no numerical pain score, no body diagram, no mandatory note, no readiness score, no
  penalty and no interpretation on screen. The only computed things are dates and
  provenance, both from the page's engine clock;
* an existing dated sleep night is shown with its provenance and offered for
  CONFIRMATION instead of being asked for a second time;
* yesterday's check-in is never shown as today's, and a denial recorded yesterday is
  never carried into today;
* **back returns where the athlete came from** (review F7): entered from Today it goes
  back to Today; entered from the active set it goes back to that set, with the workout
  still in progress and what was typed into it still there.

Answers are stored as ONE dated operation per day through the accepted `rebuild/client`
path — its own encrypted IndexedDB repository under the accepted durable public client,
all-or-nothing with its outbox entry in one repository transaction, durable across a
reload, a new page and a real `taskkill /F /T`.

---

## 2. FILES

### Added (all under `rebuild/m3/w7-preview/today/`)

| sha256 | file |
| --- | --- |
| `2ec701faa7edc77276e8154789507a03c423f1493bdc069f078bd8a797fec984` | `checkin-commands.cjs` |
| `fb1d9799b918ca5a29fa01e61e0534d2123c78ab9622d8a578239889251328d2` | `checkin-host.mjs` |
| `6334594edde87236959cf4a51989c5fc6c15345f47ac1ebd246af87cc9dc6270` | `checkin-model.mjs` |
| `cfb2b12f6aabf0360f500b8a008867d5c3dd809f2d7a1ca1ed5ede9926b46612` | `checkin-app.mjs` |
| `2b5f8a99181544576a357855a1a9e4e1766d15737c61fd5cd720ded2357e4a91` | `checkin-check.mjs` |
| `aa101d3643f78db33090443056ea872ea04c32a1f16465eb1dce88f0b65537c2` | `test/checkin.test.mjs` |

### Changed

| sha256 | file | what |
| --- | --- | --- |
| `d62981e369373e4971bc126a2f8d20ef4d037f68e7562dfa0784854bd9c6f0d2` | `screens.template.html` | `t-recovery` is the approved recovery screen, its seven approved placeholders included; `t-gym` gains the hidden check-in route |
| `daea4dddf3b5ebd6c8f22108bebb5e37eb065afbb167259a412cae31b13d2116` | `today-app.cjs` | the `checkin` entry injection; recovery routing; the back-to-origin rule; Today's recovery marker |
| `7a7f4b54bd486cc56480142e66f6815edc60c066ad6997c652e910e01a732ea3` | `today-entry.mjs` | `createCheckInEntry`, booted as a third lane; the gym card's route and its held draft |
| `2886130654e20001628379118fd74a3c739a48b977c6b3ae453f0b7f9e0e084c` | `gym-app.mjs` | `onCheckIn` and `newGymDraft()` (additive); the route is hidden unless supplied |
| `b4398841d5cee04565e9401232e30c3316f10a86f9458de1d0a015189d55a9b9` | `design.cjs` | the recovery vocabulary harvested from the approved bytes; the check-in runtime copy; the preview-owned copy; two new view sources |
| `96bf93e652b13a47742b3e06266437606fe12f3c566e5da32b1b3ab0811af279` | `build.mjs` | the four check-in modules become REQUIRED bundle inputs |
| `9b3ba5cd4ac95cb838b71fcbcb27121882facab96a94cda1afe70ce391727b40` | `preview.css` | `.view .error:empty { display: none }` (one rule) |
| `0db62ca9bdecb81f4c5b538c0f25054ba6347fdb194d9c5978ad1226ab03697d` | `test/design.test.cjs` | the binding count and the view-source list grow |
| `67997c6c3c4dc3d0f92453465b772f03d50db1f87ed6955aa4aacf247370edf6` | `test/view.test.mjs` | recovery is no longer "not wired yet"; the new assertions are stricter |
| `e88c02a3294ba052ddb971e6bf1fe0747e9a42245df7115b8d79d0d70af3c044` | `browser-check.mjs` | same, in the real browser |

Custody: **nothing** outside `rebuild/m3/w7-preview/today/**` and this report. Nothing under
`rebuild/engine`, `rebuild/conform`, `rebuild/client`, `rebuild/m4/**`, `rebuild/m3/w6/**`,
`.github/**`, `src/`, `ledger/`. `reading-host.mjs` and `gym-host.mjs` (lane C's under
DECISIONS:106) are **byte-untouched** — the check-in reaches the host layer through a NEW
file, `checkin-host.mjs`, and imports the shared device enrolment from `gym-host.mjs`
read-only, as `reading-host.mjs` already does.

All files: UTF-8, no BOM, LF only, no mojibake (verified byte by byte).

### 2.1 THE DERIVED RECOVERY BINDING (review F1)

A hand-maintained list of approved strings can only catch what somebody remembered to
list. So the recovery screen's vocabulary is no longer listed: `design.cjs` locates the
approved screen inside the pinned reference (between `recovery:()=>` and `coach:()=>`)
and **harvests** it at check time —

| harvested | n | examples |
| --- | --- | --- |
| `placeholder=` attributes | 7 | `—`, `For example, quads and glutes`, `Days`, `Optional` |
| `<option>` texts | 12 | `Leave unanswered`, `Quite a lot`, `Ongoing, unchanged` |
| `<label>` texts | 10 | `hours asleep, approximately`, `Which muscles?` |
| `<legend>` texts | 5 | `Last night's sleep`, `Anything else affecting today?` |
| choice arrays the approved screen maps over | 12 | `Poor/Okay/Good`, `Pain/Feeling ill/Time away` |

— and every one of them must be in the shipped template, placeholders matched **as the
attribute they are** (so a placeholder demoted to visible text would not satisfy it).
`assertRecoveryBinding()` runs inside `assertDesignBinding()`, so the BUILD fails too, not
only the test. A word added to the approved design upstream, or one quietly dropped here,
now fails without anyone updating a list.

The test is RED-first: it removes each of the 45 harvested strings from a copy of the
template, one at a time, and asserts each removal fails (`replaceAll`, because several
approved words appear on more than one question). It then asserts the seven placeholders
are really RENDERED on the mounted screen, not merely present in the template file.

---

## 3. HOW THE ANSWERS ARE STORED — AND THE SEAM IN THE ACCEPTED CLIENT

### 3.1 What the accepted client actually offers (executed, not assumed)

`rebuild/client/ops.cjs` already models a check-in's SHAPE: `KINDS` contains `"fact"` and
`CLASSES` contains `"event"`, `"sleep"`, `"illness"`, `"pain-attestation"` and
`"setup-note"`. So **no law change and no schema change is needed** to record a dated
check-in fact.

What the accepted client does NOT have is a **command** for one. Its named actions
(`index.cjs`) are `weighIn` (class reading), `logSet`/`logSession`/`finishSession` (class
session), the plan verbs, `correction`/`tombstone` (class reading) and `workout`. The
accepted stage's command set is exactly

```
rebuild/m3/w6/t2-stage.cjs:9
const COMMANDS = new Set(["weighIn", "logSet", "logSession", "finishSession", "workout"]);
```

There is no verb that writes a `fact` of class `event`, `sleep`, `illness` or
`pain-attestation` — the client cannot even write a food day, though `dayFacts()` reads
one. This is exactly the gap the approved handoff's own assessment names: *"missing
non-workout command/projection contracts"* and *"Required connections include versioned
dated non-workout facts"* (ADDITIONS-C-APPROVED-HANDOFF.md, "Integration order").

### 3.2 SEAM S1 — the producer-injected command, disclosed

Of those five commands, exactly one is **producer-injected**: the client does not author
`workout`'s class, kind or payload — a `workoutCommands` provider does
(`index.cjs`: `cfg.workoutCommands.prepare(...)` then `cfg.workoutCommands.validate(op, …)`),
and `createT2Stage(configProvider, { workoutCommands })` takes that provider **as an
argument**, from outside, with no edit to any pinned file.

So the check-in lane injects its own closed provider, `checkin-commands.cjs`, into that
seam. What that costs, stated plainly rather than hidden:

* the verb the accepted client and the accepted stage spell is still `workout`. The
  check-in lane has its own database, its own namespace, its own generation and its own
  lease, so **no workout is touched and no workout can touch a check-in** (mutant 5);
* the operation carries `schema_version: 2`, because the client stamps every
  producer-injected command with 2 and refuses a lease of any other schema. That is the
  client's requirement, not a claim that a check-in is a workout.

**The right fix is a non-workout fact command in `rebuild/client` (plus a projector for
it), which is engine/client-tier work outside this slice's custody.** When it lands,
`checkin-host.mjs` keeps its shape and loses that one indirection; `checkin-commands.cjs`
becomes the command's own body. Recorded for lane B / the M4 queue.

Nothing was invented to get around this: the kind and the class are the accepted
client's own, the envelope is built by `Ops.build`, the commitment is the client's own
HMAC, and the durability rule is the client's own single transaction.

### 3.3 The stored shape

One operation per check-in per day:

```
kind    "fact"
class   "event"
effective { local_date: <the day>, local_time, utc_offset }   (the page's engine clock)
payload { profile: "earned/recovery-checkin/v1", answers: { …only what was answered… } }
```

`answers` keys, all optional, none ever written blank:
`sleep_hours` {value, unit "h"} · `sleep_hours_source` ("entered" | "existing-record") ·
`sleep_hours_record_date` · `sleep_quality` · `energy` · `soreness` · `soreness_location` ·
`soreness_impact` · `stress` · `issues` (["pain"|"illness"|"away"], never `[]`) ·
`pain_location` · `pain_change` · `pain_impact` · `illness_note` · `away_days`
{value, unit "day"} · `away_reason` · `note`.

Choice values are the approved design's own words ("Poor", "Mild", "Worse than
before", …), which is what "stable wording over time" means when the record has to
survive: a stored answer is the sentence the athlete read.

`causal_parents` is `[]`. A dated check-in is standalone — there is no ordering law for
it, and inventing one would be inventing a rule. (The workout lane's causal frontier is
untouched; it lives in its own generation.)

### 3.4 The read-back

The accepted client publishes a face for the facts it projects, and a check-in is not one
of them (same seam — no command, no projector). So `checkin-host.mjs` reads the
operations back out of the **durable generation the repository just authenticated** —
the same place `gym-host.mjs` reads its causal frontier from — and it is a FILTER, never
an interpretation: this producer's operations, minus anything the log itself marks
rejected or tombstoned, ordered by the device's own sequence.

`forDate(date)` is the date law: it returns only operations effective for the date asked
for. That, and nothing else, is why yesterday can never be painted as today.

### 3.5 TWO THINGS THAT RIDE ON LANE SEPARATION (review F2 / F3) — queue items under S1

Both are **unreachable today** and both become reachable the moment a future package
unifies the lanes. They belong with S1 and are recorded here so that package's author
finds them.

**F2 — `causalTips()` is kind-blind.** `gym-host.mjs`'s `causalTips(generation)` treats
EVERY op in a generation as a node of the causal graph, regardless of `kind` or `class`.
That is correct today only because a check-in lives in its own generation and the workout
lane's generation contains nothing but session ops. If one schema and one generation ever
carry both, a check-in `fact` would be taken as a causal tip and a later Start would
descend from it — ordering a workout behind a wellness answer. **Whoever unifies the lanes
must make `causalTips()` kind-aware (or class-scoped) in the same change.** This slice
did not touch `gym-host.mjs` at all, so nothing here can be the cause; the note exists
because merging lanes would make it one.

**F3 — the reconnect copy.** `rebuild/client/index.cjs:205` answers a producer-injected
command whose lease is not `schema_version: 2` with *"Reconnect before saving this
workout."* — a sentence about workouts that a check-in would surface verbatim through
`result.copy`. It is unreachable in this build: `checkin-host.mjs` mints its own schema-2
lease for its own generation, so the branch cannot be entered, and no test can make it
fire without editing the pinned client. If a future change ever gives the check-in lane a
lease it did not mint, this sentence is what the athlete would read. Recorded, not
papered over with a `copy` override — rewriting the accepted client's words in the
renderer is exactly what A1 and A2 refused to do.

---

## 4. SEAM S2 — SLEEP, AND WHAT IS NEVER FABRICATED

`rebuild/engine/sleep.cjs` is the authority for what a sleep night is. Every reader there
is `s.sleep.nights` and every field used is `{ d, h, bed, wake, sol, awakeMin, tags }`
(e.g. `sleep.cjs:83`, `:242`, `:578`, `:998`). **There is no quality field anywhere in
that shape.**

`rebuild/engine/writers.cjs` exports no writer that can add a night: `applyRead` (a
weight), `completeSession`, `sessionFromDraft`, the proposal/adjustment verbs — and
nothing that takes `{d, h}`. There is no accepted path from a check-in to an engine
sleep night.

So:

* a sleep-hours answer is stored as **check-in data**, and the engine's `sleep.nights` is
  left exactly as it was. The test asserts the whole array is byte-identical after a
  check-in that answered sleep;
* **sleep quality is check-in data by construction** — the engine has no field to read it
  into, so writing one would be fabricating an engine read;
* the REUSE the approved handoff requires is done the honest way round: when the engine
  already holds a night dated the day before this check-in, the screen SHOWS it with its
  provenance ("Your sleep record already has last night." / "From your sleep record for
  2030-02-03 · 8 h") and asks for confirmation. Confirming stores
  `sleep_hours_source: "existing-record"` **with the record's own date**, so the stored
  fact says where it came from. An unconfirmed record is never stored, and tapping the
  confirmation again clears it.

When an accepted non-workout fact writer and a sleep-night producer exist, the
confirmation is the point where a night could be written. Recorded; not done here.

---

## 5. DECISIONS WHERE THE APPROVED DESIGN WAS AMBIGUOUS

Every one resolves to the approved reference; none "improves" it.

**D1 — the confirmation controls are preview-owned.** The approved prototype stores
nothing, so it can never have a record to reuse and has no words for confirming one — yet
handoff item 4 requires the reuse with visible provenance. Two buttons ("Yes, that's
right" / "No — answer it here") are declared in `design.cjs` PREVIEW_COPY, in the
approved design's own `.option` control. They are the smallest thing that satisfies item
4. The hours box is not merely disabled while the record stands — it is not shown, because
there is nothing to type.

**D2 — a second check-in on the same day is refused, not merged.** This is A1's weigh-in
precedent applied unchanged: the screen shows today's stored answers with their
provenance and says that changing a recorded answer needs the correction path, which is
not wired. The alternative — a second operation for the same day — would leave the log and
the screen disagreeing about which one is today's. The approved notes' "corrections" 
requirement is therefore NAMED and deferred, not faked.

**D3 — option labels stay at the approved 14px; inputs are raised to 16px.** The approved
C stylesheet sets `.checkin .option{font-size:14px}` deliberately for this dense screen,
and a 14px BUTTON has no accessibility defect (iOS zooms on focusing a small *input*, not
on tapping a button). The browser check measures both: every input/select/textarea ≥ 16px
(the rule A1 already added to `preview.css` for exactly the check-in follow-ups) and every
visible tap target ≥ 44px high — the approved design's own `button{min-height:44px}`.
This is the same bar A1 and A2 were accepted against.

**D4 — the screen scrolls, because the approved reference scrolls.** Measured in
Chromium from the pinned approved bytes at 390×844: the approved recovery screen's own
content is **933px in an 842px viewport**. Forcing the primary action above the fold would
mean shrinking or hiding part of the approved design. So the check asserts instead that
(a) the primary action is fully visible once scrolled to, in EVERY branch state, (b) the
page never scrolls sideways, and (c) this page is within a bounded, named allowance of the
approved reference's own height. Measured: blank **1039px** vs the reference's 933px
(+106px), bound 250px. The +106px is the confirmation block the reference cannot have,
plus the 16px input floor. Recorded so a reviewer can overrule it in one line of CSS.

**D5 — the plan consequence is stated.** The approved handoff: *"A mere 'saved' screen
does not establish that the engine used the answers."* So the recorded block ends with
"Your plan is unchanged: nothing in this check-in reaches a training rule yet." — which is
the literal truth (seam S1/S2: no engine rule reads a check-in), not a reassurance.

**D6 — Today's recovery marker says NOTHING when nothing is recorded.** "— recorded
today" when today's check-in is on the device; "— not available on this device" when this
device has no check-in lane; an **empty string** otherwise. A placeholder sentence there
would be the page inventing a state the athlete never entered. This is the only slot on
Today written straight rather than through `put()`, which substitutes "Not available yet"
for an empty value — commented at the call site.

**D7 — the workout-flow entry.** The approved prototype puts the recovery link in Today's
training section only. Handoff item 3 says "reachable from Today/workout", so the gym
card's secondary row gains the same approved sentence, hidden unless the page supplies
the route. The gym card is handed a callback; it never learns what a check-in is
(`gym-app.mjs` +5 lines, A2's 59 gym tests and the A2 browser check unchanged and green).

---

## 6. MUTANTS — LISTED AND KILLED

Each is a defect this screen exists to refuse. Each is a test in
`today/test/checkin.test.mjs` that fails if the defect is reintroduced.

| # | the mutant | what kills it |
| --- | --- | --- |
| M1 | infer zero/none from a blank answer (`answers.soreness ??= "None"`) | the sheet emits only answered keys; no value is ever `null` or `""`; an untouched question and an untouched issue row are both absent — asserted key by key |
| M2 | carry yesterday forward (fall back to the newest row when today has none) | `forDate()` filters strictly on `effective.local_date`; the day-two test shows the newest row exists and is NOT returned, and the sheet is blank |
| M3 | derive a score/index/readiness from the choices | the closed command refuses `readiness`, `score`, `recovery_index` and every other unlisted field; the shipped view source is scanned for score-shaped identifiers; the stored payload is asserted to contain no number but the two the athlete entered |
| M4 | skip the outbox entry | the operation and its outbox entry are asserted equal in count and id; the accepted bridge re-checks the same thing (`PREPARED_BATCH_MISMATCH`) before it commits; the fault test proves the other half — neither, not one |
| M5 | let a check-in into the workout or weigh-in lane | **a property of the running lanes** (review F4): three real stores opened on ONE device, each written through its own product path, ops read back from disk — the check-in store holds only `fact/event/earned/recovery-checkin/v1`, the weigh-in store only `fact/reading`, the workout store none of either; and the command cannot cross in either direction — the workout lane's ACCEPTED producer refuses `action: "checkin"` and this lane's producer refuses `action: "start"`, both storing nothing |
| M6 | a producer that accepts anything | `prepare`/`validate` refused for a wrong action, an extra input key, an unknown choice, a wrong class, a wrong profile and an unknown causal parent |

Two more defects were **found and fixed during the build**, both by tests written before
the fix:

* the command's `validate()` re-ran the request validator on the already-built payload,
  so every check-in carrying a quantity (`sleep_hours`, `away_days`) was refused
  `WORKOUT_INPUT_INVALID`. Fixed with `unquantify()`, so ONE validator judges both the
  request and the envelope and the two cannot drift apart;
* the sleep-confirmation buttons stayed enabled while their block was hidden — a control
  reachable by keyboard or script that could answer something the athlete could not see.
  They are now inert whenever the block is not offered.

### Round-1 review fixes

| fix | what changed |
| --- | --- |
| **F1** (blocking) | the six missing approved placeholders are on the screen, and the recovery vocabulary is harvested from the approved bytes rather than listed (§2.1). Report §1 corrected. |
| **F4** | M5 is now the real property test over three running lanes, not three string constants. |
| **F5** | the dead `await model.save.call(model)` and its misleading comment are gone from the no-carry-forward test. |
| **F7** | back returns to the origin; `gym-app.mjs` gains `newGymDraft()` so the half-entered set survives the trip (transient only — a logged set clears it, and a caller that passes nothing gets a fresh one, which is what every A2 test does). Tested both directions, including that the workout origin is not inherited by a later entry from Today. |
| **F2/F3** | recorded in §3.5 as queue items under S1. |

---

## 7. VERIFICATION — COMMANDS AND TAILS

All on `C:\Users\joeym\AppData\Local\Temp\earned-a3`, node v24.19.0 at
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`,
`NODE_ENV` cleared first (this PC sets it to `production` ambiently, which makes pnpm skip
devDependencies — F-G2 of the CI re-seal review).

```
node rebuild/m4/spec/native-carriers-package.cjs --ci
  NATIVE CARRIERS PUBLIC CI EVIDENCE PASS; the inherited full gate matrix, the private
  oracle, all FULL gates and independent acceptance remain separate

node --test rebuild/m3/w7-preview/test/*.test.cjs                 -> pass 19   fail 0
node --test rebuild/m3/w6/host/test/*.test.mjs .../*.test.cjs     -> pass 22   fail 0
node --test rebuild/m3/w7-preview/today/test/*.test.mjs .../*.test.cjs
                                                                  -> pass 151  fail 0
        (A1 64 + A2 59 = 123, never fewer and never weakened, + 28 A3 tests)
node --test rebuild/m3/w6/test/*.test.mjs                         -> pass 501  fail 0
node --test rebuild/slice/pwa/test/*.test.cjs                     -> pass 53   fail 0

node rebuild/m3/w7-preview/today/build.mjs
  A1 TODAY BUILD PASS: 3 assets; 87 pinned inputs (13 engine, 12 client); approved design
  pinned; 68 bound classes; 2 pinned typefaces inlined; no literal figure in the template;
  3/3 assets scanned and free of any network reference

node rebuild/slice/pwa/build-pwa.mjs
  A5 PWA BUILD PASS: 13 files ...; cache name earned-slice-ff07c0d148da5a74eeb03a51210d1867
  derived from those bytes ...; no network reference in any shipped byte
```

(Every figure above is from the run at the round-1-fix head, not from the first build.)

Real Chromium (`W7_BROWSER_BIN=C:\Users\joeym\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe`):

```
node rebuild/m3/w7-preview/today/checkin-check.mjs
  A3 CHECK-IN BROWSER CHECK PASS — blank sheet -> tap and clear -> conditional branches ->
  sleep record confirmed with provenance -> recorded -> read back -> reload -> new page ->
  3 REAL PROCESS KILLS (taskkill /F /T, each verified dead) -> a new day starts blank;
  no off-origin request, no horizontal overflow, every input >= 16px, every tap target
  >= 44px, the primary action reachable in every branch state.
    blank sheet: 17 options, none pressed
    blank sheet content 1039px in a 842px viewport
    soreness detail open content 1238px in a 842px viewport
    every branch open content 1544px in a 842px viewport
    recorded content 1364px in a 842px viewport
    survived a real taskkill /F /T
    blank screen 1039px vs the approved reference 933px, recorded 1364px (viewport 842px):
      the approved design is itself a scrolling form
    day two starts blank over the same device storage

node rebuild/m3/w7-preview/today/browser-check.mjs
  A1 TODAY BROWSER CHECK PASS — ... 15 engine headline titles swept in both states — worst
  headroom 11px before / 10px after; 4 title(s) fitted down to 42/45px (33px floor never
  reached); unwired entry points labelled on Today's face

node rebuild/m3/w7-preview/today/gym-check.mjs
  A2 GYM BROWSER CHECK PASS — TWO TRAINING DAYS across three REAL process kills. ...
  (14 ops, exactly one Start descending from nothing) ... every input >= 16px; no
  horizontal overflow.

node rebuild/slice/pwa/browser-offline-check.mjs
  A5 OFFLINE LAUNCH CHECK PASS — installed one worker over the host's own headers; cache
  earned-slice-1340d92f1d06a05c9c63f6a2a96496ff holds all 11 files; ... with the network
  OFF Today rendered from the engine, a weigh-in was recorded and survived a reload and a
  new page; ... no page error and no offsite request.
```

Not run (and why): the FULL engine gate and the private oracle — engine tier, not this
slice's (DECISIONS:88); the iPhone — no device in this session.

---

## 8. CI

`.github/workflows/rebuild.yml` is **pinned** by the accepted M2-NATIVE-CARRIERS artifact
(one changed byte turns `native-carriers-package.cjs --ci` RED), so it is untouched.

Its today-suite step **enumerates** its files rather than globbing:

```
.github/workflows/rebuild.yml:89
run: node --test rebuild/m3/w7-preview/today/test/adapter.test.mjs
     rebuild/m3/w7-preview/today/test/design.test.cjs
     rebuild/m3/w7-preview/today/test/gym.test.mjs
     rebuild/m3/w7-preview/today/test/package.test.cjs
     rebuild/m3/w7-preview/today/test/view.test.mjs
```

So CI on this branch runs the 123 existing today tests **including this slice's changes to
`view.test.mjs` and `design.test.cjs`**, but NOT the 28 new tests in
`today/test/checkin.test.mjs`. Naming the file differently cannot change that — the step
has no glob.

One consolation, and it is the reason F1's fix went into `design.cjs` rather than only
into a test: `assertRecoveryBinding()` runs inside `assertDesignBinding()`, which
`design.test.cjs` (a step CI DOES run, on both OS) calls — so the derived recovery
binding is under CI today even though `checkin.test.mjs` is not.

**Re-seal item for the next engine package (carry with the batched item lines 99/101/102
already record):** add `rebuild/m3/w7-preview/today/test/checkin.test.mjs` to the step at
`rebuild.yml:89`, and re-pin. Until then the 28 A3 tests are proved on the PC only, and
this report says so rather than implying CI covers them.

---

## 9. LIMITS, RECORDED HONESTLY

1. **S1 — no check-in command in `rebuild/client`.** The answers ride the client's
   producer-injected `workout` command in their own lane (§3.2). Right fix: a non-workout
   fact command + projector in `rebuild/client`. Engine/client tier.
2. **S2 — no sleep-night writer.** Nothing in `rebuild/engine/writers.cjs` can write a
   night, and the night shape has no quality field, so the check-in writes none (§4).
3. **Corrections are not wired.** A second check-in on the same day is refused in words
   and the correction path is named (D2). The approved notes require corrections to be
   preserved by "a later real producer"; this is that producer's job, not this screen's.
4. **The check-in reaches no rule.** By design at this tier, and said on screen (D5).
   Qualifying which signal may affect what is RECOVERY-NUTRITION-01's bounded sequence,
   not a renderer's choice.
5. **No safety workflow.** The approved notes: *"A selected issue needs its own qualified
   safety workflow before production."* Selecting Pain or Feeling ill records the facts
   and gives no clearance, no advice and no escalation. Named, not built.
6. **The 28 A3 tests have no CI home yet** (§8).
7. **The device enrolment is synthetic** and labelled so in `gym-host.mjs`, unchanged from
   A2: keys minted on the device, non-extractable, authorizing nothing anywhere.
8. **One check-in per day per device.** Two devices are out of scope until hosted sync
   (deferred, DECISIONS:88).

---

## 10. OPENING IT ON THE PC

```
cd C:\Users\joeym\AppData\Local\Temp\earned-a3
set NODE_ENV=
set NODE=C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
%NODE% rebuild\m3\w7-preview\today\build.mjs
%NODE% rebuild\m3\w7-preview\today\serve.mjs
    then open http://127.0.0.1:4178/ and tap "How are you feeling today?"
```

The tests and the browser check:

```
%NODE% --test rebuild\m3\w7-preview\today\test\checkin.test.mjs
set W7_BROWSER_BIN=C:\Users\joeym\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe
%NODE% rebuild\m3\w7-preview\today\checkin-check.mjs
```
