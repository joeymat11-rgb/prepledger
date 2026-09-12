# N2 - SLEEP ENTRY (the sleep-night writer, seam S2 closed at the product level)

Tier **screens** (`DECISIONS:88`): ONE independent Opus reviewer (author != reviewer, told to disagree) + CI
green both OS. **No engine byte changes.** Authority `DECISIONS:143` (lane C queue: N1 then N2, target
09-15 to 09-16), `:107` (seam S2: "no sleep-night writer exists"), `:135` (standing licence, lane decides
shapes and discloses), `:116 (5)` (**N2 builds after N1**).

Base `743847a569f71dfc1678890826e2dc1820aa22b3`. EFFORT (`:119 (5)`): **builder HIGH**, **reviewer HIGH**,
**integrator LOW**. This brief HIGH. Every number carries a `file:line` source or is marked **INVENTED**.

## 0. READ-LIST

`DECISIONS.md` 143, 107 (S2), 106 (c) (the make-synthetic `sleep.nights` quirk, a conform item for lane B,
not N2's), 135, 116 (5), 124/142 (H3), 114 (1) · `rebuild/design/CLAUDE-DESIGN-BRIEF.md` §3 and §4.6 ·
`rebuild/engine/sleep.cjs` (the authority on the night shape: `:240`, `:576`, `:585-586` read `n.h`;
`:239`, `:1053`, `:1903` read `s.sleep.needed`) · `rebuild/engine/writers.cjs:490-495` (`sleepSpanH`),
`:2896` (the export line) · `rebuild/m4/workout/athlete-state.cjs:157` (`sleep: { nights: [] }`) ·
`rebuild/m3/w7-preview/today/checkin-model.mjs:85-96` (the night shape stated in code, `sleepNightFor`),
`:132-167` (the reuse and its provenance), `:233` · `rebuild/m3/w7-preview/today/checkin-commands.cjs:57-62`
and `:98-107` (`SLEEP_SOURCES`, and a value with no source refused) · `rebuild/client/ops.cjs:19-20` ·
`rebuild/lanes/c/N1-NUTRITION-BRIEF.md` (the lane, host and projector pattern N2 copies) ·
`rebuild/m3/w6/local/local-client.mjs:395`.

## 1. THE ENGINE FACTS (executed on this base)

**1.1 The night shape.** `state.sleep.nights` is an ARRAY of rows; the engine reads `n.d` as the date of the
night and `n.h` as hours (`sleep.cjs:240` `nights.slice(-5).map(n => n.h)`, `:576` `n.h < 6.5`, `:585-586`
`n.h >= 8.5`). `checkin-model.mjs:85-86` states it in the product's own words: the shape is
`{ d, h, bed, wake, ... }` and "rebuild/engine/sleep.cjs is the authority".

**1.2 No sleep-night writer exists. Confirmed, and it is in the code.** There is no engine function that
appends a night, and `checkin-model.mjs:89` says so where the check-in reads one: a check-in writes its own
op "and never a sleep night (seam S2)". Unlike N1 - where `writers.cjs:2789 writeDaily` already exists -
**N2's projector must construct the night row itself.** That is the whole of seam S2, closed at the product
level and disclosed here rather than smuggled in.

**1.3 The ONE number the screen must not compute.** `writers.cjs:490-495`
`sleepSpanH(bed, wake, awakeMin = 0)` takes two `"HH:MM"` strings, wraps past midnight (`span <= 0` adds
1440), subtracts awake minutes and returns hours to two decimals. It is exported (`:2896`) and it is on the
screen's composition (`today-engine.cjs:34` registers `writers.cjs` last). **So bed and wake become hours
through the engine's own function, never through arithmetic in the screen.**

**1.4 The class exists.** `rebuild/client/ops.cjs:20` `CLASSES` already contains **`"sleep"`**, and `KINDS`
(`:19`) contains `"fact"`. No edit to `rebuild/client`. The producer hook and the no-payload-allowlist gate
are `client/index.cjs:205-232`, as for N1.

**1.5 A FINDING N2 makes reachable, and must report rather than paper over.**
`createCleanInitState` writes `sleep: { nights: [] }` (`athlete-state.cjs:157`) and **no `needed` member**,
while the engine reads `s.sleep.needed` at `sleep.cjs:239`, `:1053`, `:1903` and `today.cjs:266`. With no
nights those readers are unreachable or trivially false; **the moment N2 writes the first night they become
reachable on a clean-init athlete**, where `s.sleep.needed` is `undefined`: `run >= undefined` is false
forever, and the strings interpolate `undefined` and `NaN` ("`${sl.run}/${s.sleep.needed} clean`",
"`${s.sleep.needed - slp.run} more night`"). This is the same class of defect as H3's `blackout` and
`model` (`DECISIONS:124`), it is an `m4/workout` constructor change and therefore **engine tier, not N2's**.
Question 2 routes it. Until it is closed, N2's acceptance asserts the honest rendering (N2.12) rather than
shipping a screen that can print `NaN`.

## 2. CUSTODY

**ADDS** under `rebuild/m3/w7-preview/today/`: `sleep-commands.cjs`, `sleep-host.mjs`, `sleep-model.cjs`,
`sleep-app.mjs`, `sleep-check.mjs`, `test/sleep.test.mjs`. **EDITS** under the `:135 (1)` standing licence:
`today-app.cjs` (the `?screen=sleep` route and the Today entry), `screens.template.html`, `design.cjs`,
`build.mjs`; plus `today-model.cjs` (the projector) and `today-entry.mjs` (`createSleepEntry`).

**OUT**: `rebuild/engine/**`, `rebuild/client/**`, `rebuild/m4/**`, `.github/**`. **`today-bindings.mjs` is
PINNED ON DISK by B-NTC (`DECISIONS:144`) and is NOT edited**: the page opens its own lane with
`client.hostBindings({ workoutCommands })` (`local-client.mjs:395`), as `setup-host.mjs` does.

**A3 is NOT edited.** The check-in already stops asking twice the moment a night exists: `sleepNightFor`
(`checkin-model.mjs:90-96`) finds the night dated the day before the check-in and the screen offers it for
confirmation with its date (`:132-167`, `:233`). Today that path is dead because no night is ever written.
**N2 is what brings it to life, and it does so without touching A3** - which is the cleanest available proof
that the shape is right.

## 3. THE OP DESIGN (decided under `:135 (1)`, disclosed)

**Profile `earned/sleep-night/v1`. Class `sleep`, kind `fact`** (both accepted, 1.4).
`prepare({action: "sleep-night", input: {night, effective}})` builds `payload = { profile, night }` - the
two-key shape both precedents use. `night` is:

| member | rule |
|---|---|
| `date` | required, `YYYY-MM-DD`, **the date of the NIGHT**, which for a morning entry is the day before (`checkin-model.mjs:87`) |
| `bed` | optional, `"HH:MM"` 24-hour, `00:00` to `23:59` |
| `wake` | optional, `"HH:MM"`, same rule |
| `awake_min` | optional, integer `0 <= n <= 600`, minutes awake in the night |
| `hours` | optional, finite number `0 < h <= 24`, at most two decimals |

**Exactly one of two forms, and the command refuses anything else**: either `bed` AND `wake` together
(with `awake_min` optional), or `hours` alone. Both forms together, one of `bed`/`wake` alone,
`awake_min` without `bed`/`wake`, or neither form, all refuse before anything is written - the check-in's
own "a value with no source is not traceable" rule generalised (`checkin-commands.cjs:98-107`).

**Provenance, carried the way A3 already spells it.** The op records which form was used, reusing the
check-in's own vocabulary rather than inventing a second one: `checkin-commands.cjs:57-62` `SLEEP_SOURCES`
is `["entered", "existing-record"]`. N2 adds no third word; the `bed`/`wake` form and the `hours` form are
distinguished by which members are present, and the screen says which one it is showing back.

**ONE op per night date; a correction is a NEW op; the projector takes the LATEST for that date.**
Append-only, no update, no delete - the same rule N1 uses, disclosed for the same reason.

**The projector** (`today-model.cjs`, after the reading replay at `:134` and N1's food replay): for each
night date with a winning op, build `{ d: date, h, bed, wake }` and place it in `state.sleep.nights`,
**sorted ascending by `d`**, replacing any row with the same `d`. `h` is
`E.sleepSpanH(bed, wake, awake_min)` for the first form (1.3) and the athlete's own `hours` for the second.
`bed` and `wake` are omitted when the second form was used. **The screen computes nothing**, and the array
is sorted because `sleep.cjs:240` takes `nights.slice(-5)` and `:585-586` pairs a night with the next day's
session, both of which assume date order.

## 4. THE SCREEN

`?screen=sleep`, reachable from Today. Approved vocabulary harvested at check time (`design.cjs`), dash-free
through `plain-copy.cjs`.

1. **Ask**: "When did you go to bed?" and "When did you wake up?", two time inputs, both blank; an optional
   "awake in the night" minutes field behind a closed disclosure; and an alternative "I just know roughly
   how long" hours input. Nothing preselected. Copy pinned by the reviewer from the harvest before the run.
2. **Derived, shown honestly**: with bed and wake given, the screen shows the hours the ENGINE derived,
   labelled as derived from the two times, not as something he said.
3. **Already recorded**: last night's stored row read back with its date and "Recorded at ...", and a
   correction that writes a NEW op.
4. **Refusals**: each rule of section 3 in the page's own words, recording nothing.
5. **No store / restore-required**: what the client says, recording nothing.
6. **Nothing yet**: an honest empty state. No average, no streak, no "0 h".

## 5. ACCEPTANCE BAR

`test/sleep.test.mjs` **>= 40 subtests**, plus a browser row in `sleep-check.mjs` on msedge with a real
`taskkill`. Every cell RED first.

| id | check |
|---|---|
| N2.1 | The producer builds ONE `sleep` / `fact` op with the two-key payload and refuses everything else; `class` and `kind` are read out of `rebuild/client/ops.cjs` at test time |
| N2.2 | Exactly one of the two forms: both together, a lone `bed`, a lone `wake`, `awake_min` without the pair, and neither form all refuse and write nothing |
| N2.3 | Every bound refuses in words: a malformed `"HH:MM"`, `24:00`, a negative or non-integer `awake_min`, `hours` of 0, 24.5 or three decimals |
| N2.4 | **`h` is the ENGINE's**: for a table of bed/wake/awake fixtures including a span past midnight, the projected `h` deep-equals `writers.cjs:490` `sleepSpanH` called directly. The screen contains no arithmetic on times, asserted by source scan |
| N2.5 | The `hours` form stores his number unchanged, and `bed`/`wake` are absent from the projected row |
| N2.6 | The night date is the NIGHT's date, not the entry's: a morning entry dates the night to the day before, and the check-in's `sleepNightFor` (`checkin-model.mjs:90-96`) finds it |
| N2.7 | **A3 stops asking twice, with A3 BYTE-UNCHANGED**: write a night through N2, open the recovery check-in for the next day, and the sleep question is offered as a confirmation carrying that date. `checkin-*.{mjs,cjs}` sha-identical before and after, proved in the report |
| N2.8 | Confirming the reused night still stores `sleep_hours_source: "existing-record"` and the record date, exactly as A3 does today (`checkin-commands.cjs:98-107`) |
| N2.9 | ONE op per save, one transaction with its outbox entry, a storage fault records no part of it |
| N2.10 | A correction writes a NEW op; the projector takes the latest per date; `nights` holds one row per date, sorted ascending by `d` |
| N2.11 | Durability: reload, a new host over the same store, and a real process kill |
| N2.12 | **The `s.sleep.needed` finding (1.5) is rendered honestly, not printed**: with a night on file and a clean-init athlete, no screen this lane owns prints `undefined` or `NaN`, and the cell NAMES the engine readers so it flips when the constructor gains the member |
| N2.13 | Empty state: with no night, `sleep.nights` is `[]`, no average and no zero appears anywhere |
| N2.14 | Design fidelity: classes are approved selectors, sentences harvested, the build REFUSES an omission |
| N2.15 | No dashes: zero U+2013/U+2014 in source, template and rendered DOM; the build refuses a planted one |
| N2.16 | 390x844 and 320px; inputs >= 16px; tap targets >= 44px; one primary action |
| N2.17 | No network; the CSP is unchanged |
| N2.18 | `today-bindings.mjs` BYTE-UNCHANGED (`DECISIONS:144`), sha in the report; the host is opened through `client.hostBindings` |
| N2.19 | First-run and restore-required unchanged; the route is not offered before enrolment and never re-enrols |
| N2.20 | Zero regressions, counts executed on this base: today **64**, copy **36**, gym **64**, checkin **28**, setup **104**, ntc-h6-delta **8**, coach **64**, W6 **552**, A0 host **31**, `--ci` **PASS**, `build.mjs` **PASS**, plus N1's own suite unmoved |

**Mutants**: Q1 compute the span in the screen instead of calling `sleepSpanH` (N2.4) · Q2 get the
midnight wrap wrong by hand (N2.4) · Q3 accept both forms at once (N2.2) · Q4 date the night to the entry
day (N2.6) · Q5 leave `nights` unsorted (N2.10) · Q6 edit `checkin-model.mjs` to make N2.7 pass (N2.7,
the sha check) · Q7 update the existing op instead of appending (N2.10) · Q8 render `0 h` for a night with
no entry (N2.13) · Q9 print `${s.sleep.needed}` straight through (N2.12) · Q10 edit `today-bindings.mjs`
(N2.18) · Q11 an em dash in a new sentence (N2.15) · Q12 skip the outbox entry (N2.9).

**Reviewer**: ONE Opus, effort HIGH, blind, told to disagree; runs N2.1 to N2.20, re-derives the `sleepSpanH`
table from `writers.cjs` rather than from this brief, drives N2 then the check-in in a real browser with a
verified kill, and tries Q1 to Q12. Verdict `rebuild/lanes/c/N2-REVIEW.md`.

**CI residual**: `test/sleep.test.mjs` and `sleep-check.mjs` are not in `rebuild.yml`'s enumerated today
step; `.github` is editable only inside a re-pinning engine package (`DECISIONS:112`), so they ride the next
re-seal. The ledger line must say so.

## 6. PROVENANCE

| what | source | verdict |
|---|---|---|
| night row `{d, h, bed, wake}`, `h` in hours | `sleep.cjs:240`, `:576`, `:585-586`; `checkin-model.mjs:85-86` | **SOURCED** |
| no sleep-night writer exists | `DECISIONS:107` S2; `checkin-model.mjs:89` in code | **SOURCED (an absence)** |
| bed/wake to hours, with the midnight wrap | `writers.cjs:490-495` `sleepSpanH` | **SOURCED** |
| `sleep` class, `fact` kind | `rebuild/client/ops.cjs:19-20` | **SOURCED** |
| the night is the day before a morning check-in | `checkin-model.mjs:87` | **SOURCED** |
| `["entered", "existing-record"]` | `checkin-commands.cjs:57-62` | **SOURCED** |
| clean-init writes no `sleep.needed` while four readers read it | `athlete-state.cjs:157`; `sleep.cjs:239`, `:1053`, `:1903`; `today.cjs:266` | **SOURCED (a defect)** |
| profile `earned/sleep-night/v1` | the `earned/<thing>/v1` convention | **INVENTED**, declared |
| `awake_min` 0 to 600; `hours` 0 to 24 at two decimals | nothing upstream bounds them; two decimals matches `sleepSpanH`'s own `toFixed(2)` | **INVENTED**, declared, refused in words |
| one op per night, latest wins | the lane's decision under `:135 (1)` | **INVENTED**, declared |
| subtest floor 40, the six screen states | this brief | **INVENTED** |

## 7. OUT OF SCOPE, HANDED ON

- **`s.sleep.needed` on a clean-init athlete** (1.5): engine tier, `m4/workout`, beside H3. Question 2.
- **Sleep QUALITY**: already collected by A3's check-in as a choice (`checkin-commands.cjs` `sleep_quality`).
  N2 collects duration only and must not ask quality twice.
- **The `make-synthetic.cjs` `sleep.nights` quirk** (`DECISIONS:106 (c)`): a conform-suite item for lane B.
- **Caffeine, `sleep.caffMg`, the debt ledger and any sleep-derived restriction**: engine readers, untouched.
- **N1**: its own brief; N2 builds after it (`:116 (5)`).

## 8. OPEN QUESTIONS (REQUESTS-ready one-liners)

1. `C -> PM · DISCLOSURE, not permission (:135 (1)): N2 writes class "sleep" kind "fact" (already in rebuild/client/ops.cjs:20, no client edit), profile earned/sleep-night/v1, payload {profile, night} with night = {date (the NIGHT's date), and EITHER bed+wake ("HH:MM", awake_min 0-600 optional) OR hours (0 < h <= 24, 2 dp)}; one op per night, a correction is a NEW op, latest wins; the projector builds the row itself (seam S2: no engine writer exists) and derives h ONLY through writers.cjs:490 sleepSpanH. Object if you want a different shape; otherwise decided.`
2. `C -> B/PM · ENGINE FINDING, H3-class, found writing N2: createCleanInitState writes sleep: { nights: [] } (athlete-state.cjs:157) and NO "needed" member, while the engine reads s.sleep.needed at sleep.cjs:239, :1053, :1903 and today.cjs:266. With no nights those readers are unreachable; the first night N2 writes makes them reachable on a clean-init athlete, where needed is undefined and the strings interpolate undefined and NaN. Same class as H3's blackout/model (:124), same file, m4/workout, engine tier. Bundle it into H3 or its successor, or rule that N2 must not ship before it.`
3. `C -> PM · N2 proves A3 stops asking twice WITHOUT editing A3 (checkin-model.mjs:90-96 already reuses a dated night; the path is dead only because nothing writes one). Confirm the checkin-* files staying byte-identical is the acceptance you want for that, rather than a change to A3.`
