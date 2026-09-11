# LANE C · DAD FIRST-RUN — BUILDER REPORT

Builder: Opus subagent under the Lane C lead. Branch `rebuild/lane-c-dad`,
base `2553300`. Docs and mock only — nothing under `rebuild/engine`,
`rebuild/client`, `rebuild/conform`, `rebuild/m1`, `rebuild/m3`, `rebuild/m4`,
`rebuild/slice` or `.github` was read-modified or touched. Not pushed.

## 1. What was built

| file | bytes | sha256 (LF, as committed) |
|---|---|---|
| `BRIEF.md` | 28,928 | `0e66698a5091e3619bfee0bb3220ef0d5b2584b89b66e7cf3b6ef9ef4530ea32` |
| `dad-first-run-mock.html` | 28,386 | `2095ce8d533dcb2e46fa29ffa926ab90821f2df5efec089337267cd62150c93d` |
| `HAND-TEST.md` | 5,408 | `5efdc75f7161b1b1b62d5704a77fc5f4c8ab6a5a763342fc23d70ab0e6c0cf7d` |
| `REPORT.md` | this file | — |

All three files are LF-only (0 CRLF), so the committed blobs are these bytes.

- **`BRIEF.md`** — purpose; the closed clean-init contract; a row-per-field map
  from each question to the member it lands in with `file:line`; the six-screen
  flow with copy, blank semantics, back/skip rules and validation wording; what
  the engine does with each answer and what happens when it is blank; explicit
  non-goals; the acceptance bar (A1–A12, executable); the hand test in brief;
  three open questions, each with the default already taken.
- **`dad-first-run-mock.html`** — a self-contained clickable mock of the whole
  flow plus the Today it hands over to. State lives in one JS object in memory;
  nothing is stored, nothing is fetched. 390px phone frame, 844px tall, works
  by tapping on iPhone Safari.
- **`HAND-TEST.md`** — the 5-minute script: what Dad is handed, the one
  sentence he is told, what the observer records, what pass and fail mean, the
  three questions afterwards, and the per-screen time budget.

## 2. Sources relied on

Read at `origin/rebuild/t2-client-core` (a read-only clone) and cited by
`file:line` throughout the brief.

| source | what it settled |
|---|---|
| `rebuild/m4/workout/athlete-state.cjs` (whole file) | the entire contract: the four `setup` members, the eight exercise members, the closed-object check, `w:null`, the autonomy floor, every refusal code |
| `rebuild/engine/plan.cjs:11-22` | `dayType` reads the last split entry with `from <= iso`; the fallback week when none covers the day |
| `rebuild/engine/progression.cjs:310-433` | what `inc`, `steps` and `hi` actually do — `loadRungs`, `nextLoad`, `prevLoad`, `snapLoad`, `deloadLoad`, `parseRungs`, `repsLostOnJump`, `windowFor`, `proposeLadder` |
| `rebuild/engine/today.cjs:80-90`, `:132`, `:171` | the DEBUT / baseline-ask path for `w == null`; `setup` passed through to the card |
| `rebuild/engine/constants.cjs:9`, `:270` | `SCHEMA_V = 60`; `AUTONOMY_LEVELS[0] = "propose"` |
| `rebuild/m3/w6/host/workout-host.mjs:38-48` | the `WORKOUT_SPLIT_NOT_IN_FORCE` guard — the split's `from` must be ≤ today |
| `rebuild/m3/w7-preview/today/today-app.cjs:59`, `:308`, `:332-336` | A1's honest empty states and its "— not wired yet" language, reused in the mock's Today |
| `rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html:5`, `:7` | the design tokens, type scale, spacing and class vocabulary, copied inline |
| `rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md:7`, `:15-18` | the owner approval; "quiet luxury" palette/type; blank ≠ zero ≠ cleared; unselected by default; never mandatory |
| `rebuild/slice/PLAN-SLICE-v1.md:11`, `:23`, `:32` | item 6's definition of Dad's FIRST-RUN; A4's place in Track A; the S4 date |
| `rebuild/DECISIONS.md:88` | design of record re-pinned; two-tier rigor (screens = one reviewer + CI) |
| `rebuild/DECISIONS.md:99` | A1's merged Today, its acceptance evidence, and the bar it had to clear (primary action inside 390×844, zero off-origin requests) |
| `rebuild/DECISIONS.md:100` | Joe starts FRESH at S2 — first-run is now also Joe's path |
| `rebuild/DECISIONS.md:93` (condition C3) | `today.cjs:92`'s `e.id === "hack"` logged as register item H1 — the standing example of a Joe-ism leaking into the product, and the reason screen 4 is equipment-agnostic |

`ledger/` and `rebuild/conform/private` were never opened.

## 3. Decisions taken

1. **First-run collects no starting load.** `PLAN-SLICE-v1.md:11` asks for
   "starting loads by what did you lift last time, or a conservative
   first-session probe". The code of record has since closed that question:
   `createCleanInitState` writes `w: null` on every exercise and has no member
   for a load (`athlete-state.cjs:111-113`), and `genSession` answers it with
   the DEBUT path (`today.cjs:80-90`). **The first session is the probe.** This
   removes roughly two minutes and a whole class of guessed numbers from the
   flow, and it is the largest single deviation from the older plan text.
2. **Equipment is collected as two facts per exercise — lightest setting and
   smallest jump — with the full rung list optional.** A one-entry `steps`
   array is valid for the constructor and leaves the engine on `inc`
   arithmetic; `proposeLadder` (`progression.cjs:310-343`) then discovers the
   real stack from the loads he actually uses. So the screen does not have to
   extract a 12-rung stack from a beginner in five minutes, and nothing is
   invented to fill the gap.
3. **`split.from` is always today, and no start date is offered.** A future
   `from` passes the constructor and then refuses at the first gym visit
   (`workout-host.mjs:43-48`). A future start belongs to a settings screen.
4. **Six screens, one question each**, with the shared sets/reps setting
   declared on screen 3 as shared rather than hidden in a per-exercise row.
5. **The single named refusal lives on screen 6**, not as a per-screen block.
   Nothing is mandatory mid-flow; everything missing is named once, each line
   tapping back to its own screen, and nothing already answered is lost.
6. **"I'm not sure" is a refusal marker, not a value.** It sets nothing and
   appears in the screen-6 list. That is the only honest way to reconcile
   "blank = unknown" with two required positive integers.
7. **5 lb is the one number the flow may supply**, shown as a named standard in
   the field's own helper line and repeated in the summary as "our standard
   step". It is the sole entry on the acceptance-A4 allowlist.
8. **Priority muscles promise nothing.** The state carries them and no engine
   reader consumes them (`athlete-state.cjs:150-153`), so the screen says so.

## 4. How the mock was checked

Headless Microsoft Edge (`--headless=new`) on the owner's PC, plus a node
parse. A temporary driver file (never committed, deleted afterwards) rendered
every screen and reported into `document.title`.

- **Parses:** `new Function(<script block>)` — PARSE OK, 21,007 chars.
- **No off-origin reference of any kind** in the file: a scan for
  `https?://` and `//host` patterns returns none. No font link, no CDN, no
  image. Typefaces fall back to the system stack.
- **Every screen renders and throws nothing.** Reported lengths
  `s1=788 s2=2080 s3=3673 s4=2068 s5=1372 s6=2189 today=1228`, each with
  exactly one `.primary`.
- **The produced `setup` document is correct** for a filled fixture:
  `split.from = 2026-09-11` (today, so `from <= today` holds),
  `map = {"0":"REST","1":"U","2":"REST","3":"REST","4":"L","5":"REST","6":"REST"}`,
  an uneven stack `"45 60 80 105"` parsed to `[45,60,80,105]`, and a blank jump
  resolving to the declared `inc = 5`.
- **The refusal path works:** with the name cleared, "I'm not sure" on sets and
  one lightest setting blank, screen 6 renders 3 named refusals and the primary
  is disabled.
- **Every input computes to 16px** (`inputfonts=16px`, one distinct value).
- **Screenshots** at 420×920 of screens 1, 2, 3, 4, 6 and Today were inspected
  by eye against the approved reference: paper ground, Instrument Serif
  headline, green label, ink primary — it reads as a screen of that app.

Not checked, and deliberately out of scope: real iPhone Safari (the owner's
own look is the approval), VoiceOver, and any build or CI integration — there
is no build here to integrate.

## 5. What I could not verify

1. **That a beginner finishes in five minutes.** The budget in `HAND-TEST.md`
   §7 is reasoned, not measured. Nobody has held this mock in front of a person
   who had not seen it. That is the whole point of the hand test, and it has
   not been run.
2. **Whether the sets/reps question is answerable by Dad at all** (open
   question Q1). If he taps "I'm not sure" on both, the flow refuses — correct
   behaviour, and possibly a wall on his first two minutes with the app. Only a
   real run tells us.
3. **`e.setup` has no home in the clean-init contract.** `genSession` passes an
   exercise's `setup` member to the card (`today.cjs:171`) and `_bornValid`
   (`plan.cjs:84`) requires it to be a string, but `setup` is not one of the
   eight members `createCleanInitState` accepts and the closed check rejects it
   (`athlete-state.cjs:60`, `:65-71`). So a new athlete's cards carry no setup
   note, and I could not determine whether any reader downstream of the A2 gym
   card depends on it. Flagged for the PM; not worked around here.
4. **Whether `priority_muscles` will stay inert.** It is inert today by the
   module's own comment. If Track B later wires it, the screen-5 copy ("It
   doesn't change your sessions yet") has to change with it.
5. **Real-device rendering.** Verified in headless Edge at 390 and 420 px, not
   on iOS Safari, and not with the Instrument typefaces installed.
6. **The A4 "no invented numbers" scan** is specified in the brief but not
   implemented — there is no test harness in this folder to implement it in.
7. **Nothing here has been reviewed.** Author ≠ reviewer: this needs one
   independent reviewer before it counts as anything under `DECISIONS.md:88`.

## 6. Open questions for the owner

Three, all with defaults already taken, all set out in `BRIEF.md` §9: who
states sets and reps (Q1); that only upper/lower sessions exist and the screen
must say so (Q2); and whether a screen may supply the 5 lb standard step (Q3).
None of them blocks looking at the mock and saying yes or no to it.

## 7. BUILD-BRIEF (added 2026-09-11)

| field | value |
|---|---|
| path | `rebuild/lanes/c/dad-first-run/BUILD-BRIEF.md` |
| lines | 457 |
| bytes | 30,971 (LF only, 0 CRLF) |
| sha256 | `14ad2009619f4ac299231db2fa229825f23e9e025f177226527f546df34705de` |
| base | `74c8412e87d9530ae5949a7330b8539fb569ea07` (`origin/rebuild/t2-client-core`) |

The screens-tier BUILD brief for slice item A4, written so the build can start
the moment the owner approves the mock by looking. Contents: custody (the six
new `setup-*` files under `rebuild/m3/w7-preview/today/`, the lane-C one-store
licence `DECISIONS:106(b)`/`:111`, the exact REQUESTS lines for everything
out of scope); the six screens mapped member-by-member onto
`athlete-state.cjs` clean-init with types, bounds and blank rules; the
persistence path (ONE op into the ONE local-era generation through
`today-bindings.mjs`, the A3 producer-hook precedent folded by C4); the
`boot({basisState})` ruling (KEYED, not deleted — `DECISIONS:102`); the
`e.setup` omission decided (A4 ships without it) with the traced consequences
and the two exact PM questions; the acceptance bar S1–S22 with the existing
suite counts pinned at the base; the review protocol with 14 mutants and the
declared CI residual (`rebuild.yml:89` enumerates five today files and A4
cannot add its own step — `DECISIONS:109`/`:112`); the owner-look dependency
and what changes if each of Q1/Q2/Q3 is reversed; out of scope.
