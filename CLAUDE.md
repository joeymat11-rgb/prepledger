# Prep Ledger — project rules

Single-file React PWA. Personal N=1 training/nutrition ledger for one athlete.
Live at <https://fitnessledger2.netlify.app>.

## START HERE — `NEXT.md`

**Read `NEXT.md` at the start of every session, before anything else.** It is the
work queue: what to build next, the decisions already locked, the standing
guardrails, and the acceptance criteria. Work the item under **NOW**. Do not start
a QUEUED item without Joe's say-so. If `NEXT.md` is untracked or uncommitted when
you start, commit it first — it is project state, not scratch.

## READ THESE FIRST, IN THIS ORDER

Do not make a substantial change before you have read all three. The dominant
defect of this codebase - found three separate times - is research that was
written down and then never enforced in code. These three files are the
enforcement. Reading them is not optional context; it is the job.

1. **`GOALS.md`** - the athlete's own charter, in his words. The objective is
   *the best body-composition change for Joe, as quickly as possible*. Every
   feature answers to it. It also carries hard guardrails: never print or expose
   a credential, never delete athlete data, keep the `/ledger` lockdown intact,
   do not break the app, and do not push straight to `main` - main deploys to
   his phone.
2. **`research-brief.md`** - the evidence corpus every engine claim rests on. It
   has a NEGATIVE FINDINGS section and a RECURRING FAILURE MODES section. Check
   a change against it *before* you write the change, not after.
3. **`HANDOFF.md`** - how the code actually works. Start at **0.23** (operations,
   access and security - how to authenticate, and why `main` moves on its own)
   and **0.14** (corrections - several earlier sections are stale and say so).

`BLUEPRINT.md` is the design reference for the UI surface - **read it with
suspicion.** It is a portable *chassis* spec for cloning this app to other
clients, and it is STALE for this one: it describes a six-tab rail (the nav was
demoted to NOW / TRAIN / MORE), the retired `tools/ship.sh` gate, and a law list
that does not match this app's constitution. Do not treat it as the current UI
reference without checking it against HANDOFF 0.3 and 0.15.

> **THIS FILE HAS CARRIED STALE CONTENT.** Four reviewers, one pass, and any
> section calling the athlete "her" or "she" was imported from a sibling app -
> this athlete is Joe, a man. Where this file and `HANDOFF.md` disagree,
> **HANDOFF.md wins**; it is newer. The specific corrections live in HANDOFF
> 0.14 (corrections), 0.22 (stale numbers), 0.23 (access and security) and
> **0.24 (what is still NOT solved - read this before you merge or ship)**.

---

## Working from scratch

Everything below assumes you have nothing but this repo and a GitHub token.

**The repo is PUBLIC as of 2026-08-05, so a bare clone works.** It was private
until then; anything in this file or `HANDOFF.md` that still says otherwise is
stale, and HANDOFF **0.23.1** carries the dated note.

Joe made it public deliberately, to get free GitHub Actions minutes after a
billing block stopped every deploy mid-release. He was shown what becomes
world-readable - sleep times, training dates, injuries, body-fat estimates, daily
food logs - and accepted it. **Do not treat this as an accident to be reverted.**

You still need `GH_TOKEN` to *push*, per HANDOFF **0.23.1** - from the
environment, or the askpass shim on Joe's PC, and never a credential in the URL.

```bash
git clone https://github.com/joeymat11-rgb/prepledger.git   # authenticate first
cd prepledger
node scripts/bootstrap.mjs
```

`setup.sh` does the same job, but the dev machine is Windows with no guaranteed
bash - `node scripts/bootstrap.mjs` is the reliable path.

`bootstrap` installs the pinned dependencies and runs the whole gate. When it
says **"Green from a bare clone"**, the checkout is proven — you can change
things.

### The five commands

| | |
|---|---|
| `npm run bootstrap` | fresh clone → proven green. Safe to re-run anytime. |
| `npm test` | the suite only (engine, render, dom and beacon smokes) |
| `npm run check` | the suite **plus** the gate. What CI runs. |
| `npm run serve` | preview the site locally, on a port the OS picks |
| `npm run ship -- "note"` | test → build → commit → push → confirm live |

### The gate — `scripts/check.mjs`

Seven things must be true before anything reaches his phone. Each one exists
because it has already gone wrong once, or would go wrong silently.

1. **Suite green** — 856 engine assertions, every tab rendered in three states,
   the committed `app.js` boots in a DOM, and the error beacon is proved unable
   to throw. The gate enforces a floor, `MIN_ASSERTIONS = 850`, so a suite that
   silently stopped running fails loudly - a 359-assertion suite would fail by
   construction. If you legitimately remove assertions, lower the floor
   deliberately.
2. **`app.js` is not stale.** `app.js` is a *committed build artifact*: Netlify
   serves this repo as-is with no build step, so an un-rebuilt commit silently
   deploys yesterday's app while every test passes. The gate rebuilds `src/` and
   compares bytes. `--strict` (CI) makes a mismatch a hard failure.
3. **Service worker version matches `APP_V`.** If `sw.js`'s cache name and
   `APP_V` drift, installed phones keep serving the old bundle forever and the
   ship is a no-op that looks like a success. `npm run ship` syncs them for you.
4. **The lockdown is intact.** `/ledger/*`, `/src/*` and `/tools/*` must still be
   404 + `no-store` in `_redirects` / `_headers`.
5. **No secrets committed.** The tree is scanned for anything token-shaped.
6. **The deploy manifest is clean.** The exact set of files sent to the CDN is
   asserted to contain everything the app needs and nothing private.
7. **The pipeline is still wired, and `ship` never rebases.** A YAML error in a
   workflow does not fail loudly — GitHub just stops running it, and everything
   after ships ungated. So the gate checks that `deploy` still needs `test` and
   is still main-only. It also reads `scripts/ship.mjs` and fails if `--rebase`
   reappears, or if the remote merge is gone. `ship` used to `pull --rebase`
   *between the gate and the push*, which is two bugs at once: the gate proved a
   tree that was not the tree pushed, and a conflict left the repo mid-rebase on
   a **detached HEAD with the local commit on zero branches** — while the next
   line was `push origin HEAD:main`. That is how a partial v7.6.0 reached main on
   2026-08-04 with `APP_V` still reading 7.5.0, and it deployed. The remote is
   now merged at step 0, *before* the gate, so what is proved is what is pushed.

### Shipping

```bash
npm run ship -- "raised the analyst read above the fold"
```

Rebuilds, runs the gate, refuses to push anything red, then waits for the deploy
beacon and only reports success once the site is actually live. It reads
`GH_TOKEN` from the environment (on Windows, from the *user* environment
variable, which a shell opened earlier will not have inherited) and hands it to
git through a credential helper — the token never lands on a command line, in a
config file, or in any output.

**Token permissions.** The fine-grained PAT needs, on this repository:

| permission | why |
|---|---|
| Contents — Read and write | ship, and the app's own ledger sync |
| Workflows — Read and write | **required to push any change under `.github/workflows/`** |

(The daily production check files its issues with the Actions `GITHUB_TOKEN`,
granted in the workflow itself — that does not come from this PAT.)

Without *Workflows*, git rejects the push outright with "refusing to allow a
Personal Access Token to create or update workflow ... without `workflow`
scope", and it rejects the **whole push**, not just that file. If you hit that,
this is why.

### CI — `.github/workflows/deploy.yml`

| job | when | what |
|---|---|---|
| `test` | **every push, every branch, every PR** | the full gate, `--strict` |
| `deploy` | `main` only, after `test` is green | production |
| `preview` | any other branch, after `test` is green | a Netlify draft URL |

Production cannot be reached from a branch, and nothing publishes without a
green suite. Commits touching only `ledger/**` skip the pipeline, so the app's
own data syncs do not trigger deploys.

**`ledger/` is no longer uploaded to Netlify at all.** The 404 rules remain as a
second layer, but his health data now never reaches the CDN in the first place,
so a bad redirect cannot expose it. `src/`, `tools/` and `scripts/` are excluded
too. If you add a new *site* asset, it deploys automatically — the zip is a
denylist, not an allowlist.

### The error beacon — `src/beacon.js`

Every test here runs in jsdom. His phone runs iOS Safari. Without this, an
iOS-only crash is invisible: he just quietly stops opening the app.

Unhandled errors, unhandled rejections, and anything React's error boundaries
catch (including `TabGuard`) are buffered in `localStorage` and filed to
`ledger/errors.json` through the same GitHub API the app already uses. No new
service, no new secret, no endpoint to keep alive.

**Read `ledger/errors.json` at the start of any debugging session.** It is the
only place an iOS fault ever shows up.

Its one rule: *it must never be able to break the app*. Every entry point is
wrapped, every failure is swallowed, the upload is deferred past first paint,
faults are deduped and rate-limited, and the payload carries only version,
message, stack and user agent — never anything from the ledger itself.

### The daily production check

`.github/workflows/prod-check.yml` runs `scripts/prod-check.mjs` every morning
and asserts that the live site loads, serves the version this repo says it
should, has every asset, **still 404s every private path**, and can still reach
GitHub and Anthropic. On failure it opens a `production-check` issue (and
comments on the existing one rather than filing a new one daily); it closes the
issue once production is healthy again.

Run it by hand anytime with `npm run prodcheck`.

### Things that will bite you on Windows

This project is developed on a Windows machine. All three of these were real,
and all three are now handled — do not reintroduce them.

- **Never hardcode `/tmp`.** Node resolves it to `C:\tmp`, which does not exist.
  Use `tmp()` from `scripts/lib.mjs`, which writes to the repo's own `.tmp/`.
- **`.gitattributes` forces LF.** With `core.autocrlf`, a Windows checkout
  rewrites the committed `app.js` and the byte comparison in check 2 can never
  pass. Do not remove that file.
- **`NODE_ENV=production` is set globally on that machine**, which makes npm
  silently skip devDependencies — esbuild and jsdom never arrive and every test
  fails with a confusing import error. Every install passes `--include=dev`.

Nothing in `scripts/` or `tools/` may hardcode an absolute path or a port.
Paths derive from `ROOT` in `scripts/lib.mjs`; servers bind to port 0.

---

## Non-negotiables

- **Every input is 16px.** Smaller triggers iOS zoom-on-focus and the page pans
  sideways. Do not "clean this up".
- **Do not re-architect the layout frame.** Normal document flow, `minHeight:
  100vh` shell, tab bar `position: fixed; bottom: 0`, content padded to clear
  it. Eight attempts at something cleverer all failed and were reverted.
- **The safe-area inset belongs to the tab buttons' padding.** Never add a
  second one to the container.
- **The service worker must not cache `api.github.com`.** A cached sha caused a
  two-day unkillable 409.
- **Never send a `Cache-Control` request header to the GitHub API** from the
  browser — CORS preflight kills the fetch silently.
- **Nothing mutates itself.** Machine-initiated changes file a proposal for the
  athlete to tap. The engines rule, the agents narrate, the athlete overrides.
- **Instruments gate on n.** Cold-start data must say "counting only", never
  produce a verdict.
- **The token lives in `GH_TOKEN`, never in a file.** This rule got *stronger*
  when the repo went public on 2026-08-05, not weaker: a committed credential is
  now readable by anyone the moment it lands, with no window to catch it. The
  old reasoning — "one bad redirect away from public" — is obsolete because the
  repo simply *is* public. `ledger/` stays excluded from the upload anyway: it
  keeps the deploy small and stops the CDN serving a stale copy of his history.
- **Never delete ledger data.** `ledger/state.json` holds his real history.
  **Do not write the count down here.** It grows, and a stale baseline makes the
  data-loss check pass silently. Read the live counts before and after
  (`reads`, `sleep.nights`, `dailyLogs`, `sessionLog`, `queue`) and assert every
  one is `>=` its own "before" — HANDOFF 0.17 has the recipe. Preserve every
  read.

## Editing this codebase

`src/app.jsx` is ~8,900 lines and is edited with string/line surgery.

- Anchors are unreliable at first occurrence — a stamp pattern once matched
  three elements and produced three rogue stamps. **Grep-count after every
  batch to confirm the change landed exactly once.**
- Check for symbol collisions before adding a component.
- JSX inserted between ternary branches breaks the parse — read the structure
  around the anchor, not just the line.
- `applyRead` is pure: it clones and returns. Tests must capture the return.
- Adding a law or an instrument requires amending the census assertions, or the
  suite fails by design.
- The beacon deliberately lives in `src/beacon.js` and wires in through
  `src/main.jsx`, so error reporting stays outside that 8,900-line blast radius.

### Progression and the debrief

`targetsFor` is autoregulated — see PROGRESSION_NOTE in `src/app.jsx` for the
evidence and the numbers that forced it. Three invariants:

- **The step is sized by the terminal RIR, capped at 3.** RIR is least accurate
  far from failure, so a claimed 5 buys the same step as a claimed 3.
- **The sleep flag sits on the DOWNSIDE ONLY.** This entry used to read *"a
  flagged day never sets the anchor"* - short sleep could not become the line
  the next target was built from, nor serve as the historical benchmark. **That
  is the retired upside gate. Do not restore it.** A short-sleep session cannot
  count toward a STALL, the same protection a rushed session gets, but it banks
  records normally and it can set the anchor. The live `CONSTITUTION` reads
  *"Records need repeating, not good sleep"* / *"Short sleep protects, it does
  not punish."* The gate was retired in `progressStep` and then found still
  alive in **eleven** other places - two of which still decided what he lifted.
  Grep for the claim, not just the function: a rule surviving only in copy is
  still a rule, because he reads the copy. An honest decline on a clean,
  unhurried day still sets the line.
- **`atTopOfWindow` allows a natural one-rep-per-set fade.** Demanding a flat
  maxed window was what produced the 10-week calves gate.

`sessionDebrief` has four rules in its header comment. The one that keeps
getting violated: **a line must be able to come out different for a different
lift**. If it can't, hoist it into the summary and say it once — that is what
`sharedWhy` does for the step reason. There is a test that fails on any sentence
repeated verbatim across lifts; do not weaken it.

### Adding a schema version

State on his phone is versioned, and every old version has to walk forward
without losing a byte. The ritual is three steps and nothing else:

1. Write `patchVn(s)` — mutate, set `s.v = n`, `return s`. It must be safe to
   run on a state that already has the field (`s.x = s.x || []`), because the
   v1/v2 path replays the whole chain over a fresh seed.
2. Append it to `PATCHES` and bump `SCHEMA_V` (declared once, next to `APP_V`).
3. Author the same shape into `SEED` inside `weave()`. **The seed is authored
   already-current — it does not go through the patch chain on a fresh
   install.** Two assertions hold `SEED.v === SCHEMA_V` and check that a fresh
   install's PREV blocks are shaped like migrated ones.

Two failures this design exists to prevent, both of which have actually
happened here:

- `migrate()` used to be a 31-deep nest of `patchV31(patchV30(...))`. A missing
  paren is invisible on review and only surfaces as an esbuild error. It is a
  `reduce` over `PATCHES` now — appending is a one-token edit.
- `SEED.v` carried the version number independently of `migrate()` and drifted
  a version behind, so fresh installs and migrated states disagreed. One
  constant, referenced from both, plus a test.

**Not every new field needs a version.** `pace` (v3.99.10) added a field to
`sessionLog` with no patch and no bump, on purpose: there was nothing in the old
records to derive it from, so a patch could only have written `null` onto four
historical sessions. Law 12 calls that a decorative field. Absent reads as
unknown at every call site (`paceRushed`), which is the correct answer for a day
the app never asked about. Bump the version when old data can be *restated* into
the new shape; skip it when the only honest value is "we don't know".

A patch may only restate what was already recorded. `patchV31` lifts the legacy
`rir` into `rirSets[0]` because `rir` has always meant the opener — that is a
restatement. It leaves every other slot `null`, because the app never asked. A
migration that invents a plausible value is worse than no migration: the ramp
cannot tell a real reading from a manufactured one.

## Workflow

Recon before editing. One batch. Grep-verify each change. Parse-check. Run the
suite. Ship **from a branch**. Confirm the beacon shows the new version.

**Never push to `main` without Joe's explicit go-ahead.** `npm run ship` pushes
whatever branch you are standing on, and `main` deploys straight to his phone.
Check where you are before you ship - a rebase has left this repo checked out on
`main` before now.

When something is broken, find the mechanism before shipping a fix. Ship an
instrument, not a theory.

## Records, noise, and sleep (v3.99.19)

Three rules were retired in this release for having no evidence behind them. If
you find yourself re-adding any of them, read this first.

**A record is confirmed against measurement error, not against sleep.**
`typicalError(s, exId)` measures his own set-to-set spread from repeats at an
identical load (currently ±0.77 reps over 31 paired sets — the middle of Mitter
2022's published 0.7–1.1 SEM range). `beatsNoise()` asks whether a session clears
the old line by two standard errors of the session total. Inside that band, a new
best waits for one repeat; outside it, it banks immediately. That is the ACSM
two-for-two rule (Ratamess 2009), which is the only published precedent and
carries no readiness qualifier.

**Short sleep does not gate progression.** Craven 2022 (69 studies, 959
participants) puts acute sleep loss at −2.85% on strength — smaller than the
1.8–3.3% test-retest CV of a trained lifter. No trial has ever tested damping
progression on low-readiness days. `progressStep` is driven by RIR, which is the
one readiness method with outcome evidence (Helms 2018, ES 0.48). The sleep flag
now sits on the *downside* only: a short-sleep session cannot count toward a
STALL, the same protection a rushed session gets.

**Two different sleep questions, two different thresholds.** `cleanAtDate()`
answers the PERFORMANCE question and uses `DEBT_LAST_H` (6.5) / `DEBT_MEAN3_H`
(7.0), because that is where the performance literature lives. `atSleepTarget()`
answers the TARGET question against `sleep.cleanH` (7.5) and drives the sleep
score and the lean-mass argument. Do not merge them: the single 7.5-hour gate
opened on 3 of his 42 nights and produced zero clean sessions ever.

**Every target is derived.** `calorieTarget` from measured maintenance,
`proteinTarget` from measured lean mass, `stepTarget` from the window the
maintenance was measured in. A constant in the UI next to a derived number makes
the card look like it knows three things when it knows one. If you add a fourth
target, derive it or gate it.

**Energy availability is banded on the conventional number.** `ea` (structured
training only) is the only figure comparable to the published 25 threshold —
that is the IOC 2023 formula. `eaAll` (walking included) is shown as a second
convention and must never drive the band or the `needKcal` instruction. Espinar
2026 measured the same swap moving free-living athletes from ~32 to ~20 with no
physiological change. Subtracting steps *and* comparing to 25 is the one thing
that is definitely wrong.

**When EA needs to rise, name food before steps.** Deficit magnitude is what the
trained-population evidence links to lean-mass loss (Murphy & Koehler 2022). No
concurrent-training meta-analysis has ever included a walking arm.

**Never claim a refeed does anything.** The only matched-energy RCT in trained
people (Campbell 2020) had its FFM result overturned by Peos 2020's reanalysis;
the resistance-trained RMR subgroup across 12 trials is 11 kcal/day, CI −67 to
+46. Diet breaks (a full week at maintenance) are the intervention with real
adherence evidence; keep the two distinct.

*(This paragraph used to end "the refeed stays on the calendar because it is his
programme, and the app proposes rather than reprograms." **That describes the
pre-retirement state.** The fixed weekly refeed has since been retired, and the
retirement is DATED - see "the refeed retirement is DATED" below. Do not "repair"
the code back to always-refeed Wednesdays.)* Every line about a refeed still has
to state what it does not buy.

**`dailyLogs` key order is insertion order, not date order.** Sort before any
`.slice()`. This silently flipped the sign of the step-drift figure; a test caught
it. Assume the same trap anywhere else you take a recency window off a plain
object.

## Matched windows, and proposals with hands (v3.99.21)

**Maintenance is a sum whose halves must share a calendar.** `observedTDEE` is
`mean intake + (weight lost × KCAL_PER_LB_MIX / days)`. The 3500 literal was
removed - it was one authored constant doing three different jobs, and energy
density here is ~3,800 kcal/lb, not 3,500 (see below). Both terms have to come
from the same period. They did not — the rate ran a 28-read regression across
35 days while the intake average ran a fixed 21-day window, and his early
fortnight was genuinely different (1,953 kcal on 20,471 steps vs 2,072 on
16,526). That read maintenance 50 kcal high. `currentRate` now returns
`from`/`to` and `observedTDEE` averages intake over exactly that span, reporting
`matched` so a snapshot-rate fallback is visible rather than assumed. If you
ever add another window, ask what it is being paired against.

**A proposal must do what its own text says it does.** `refeed_review` shipped
with `{ kind: "note" }` while its body read "the proposal is to retire the fixed
weekly refeed". He applied it; nothing happened. Before shipping a proposal,
check that `applyProposal` has a branch for its `kind` and that the branch
changes the thing the body promises. A card that takes a tap and files a note is
worse than no card.

**`dayType(iso, s)` takes optional state.** Callers reasoning about today or
tomorrow pass it; callers analysing history do not. The refeed retirement is
DATED, so past Wednesdays stay refeeds — `refeedBumps`, the post-refeed water
flag and the Tue/Fri experiment all read history and must keep reading it
truthfully. Do not make this a boolean.

**Show the weekly result next to the daily target.** A daily band says what to
eat; it does not say whether he ate it, and with one high day a week those differ
by ~72 kcal/day. `calorieTarget` now returns `wkAvg` / `wkOff` / `wkWhy` over the
last seven logged days, priced in lb/wk rather than kcal/day because that is the
unit he thinks in.

## Designed vs observed, and units that drift (v3.99.23)

**Some questions are arithmetic, not evidence.** `muscleVolume` counts sets out
of the session log and `sweepVolume` waits 14 days of it. That is right for
recovery and bar-speed questions. It is wrong for weekly sets per muscle, which
is *designed* here — a fixed split times a set count written into each lift.
Hamstrings get one exercise at two sets, twice a week: four sets, and no further
logging discovers otherwise. **Four sets is INSIDE the maintenance range, not
under a retention floor.** The corpus puts maintenance at ~2-5 weekly sets with a
minimum effective dose of 4 fractional sets, so this is a *growth* gap, not a
retention failure - and during a deficit it is deliberately filed, never
proposed. Reading it as a retention emergency is what had `volumeImbalance`
preparing to propose **+7 weekly sets** to a man in a deficit. `programmeVolume`
reads the programme and fires immediately; `muscleVolume` still reads the log.
Before gating a finding behind more data, ask whether the data could change it.

**Watch for units that drift with the thing they measure.** The rate band was
written in absolute lb/wk. At 170 lb that is 0.59–0.82 %bw/wk; at 148 lb the same
band is 0.68–0.95 %bw/wk. So it tightens as he leans out, which is backwards —
the leaner you get, the more of any deficit comes off lean tissue, and Garthe
2011's 0.7 %/wk arm gained 1.7% lean while the 1.0 %/wk arm lost 2.0%. Any
threshold expressed as an absolute against a shrinking denominator has this bug.
Check the calorie floor the same way when he gets lighter - and read it from
`calorieFloor(s)`, which derives it from energy availability at his lean mass
(currently 1750). **Never hardcode 1700.** That literal was one of the nine
authored constants this branch removed; the tell is always a round number.

**Reserved words.** See the RESERVED list in the test file. Words this app has
already spent on a tracked quantity cannot be reused colloquially — `leaner`
means body composition, `load` means weight on the bar. The fix is never a better
adjective; it is printing the numbers. `observedTDEE.split` exists for exactly
this reason.

## The drip, and the check that should have caught it years earlier (v3.99.24)

**`model.drip` is 0.0 and must stay there absent a measurement.** It was +0.3
lb/wk — an assumption that a lean multi-year-trained male gains lean mass in a
600 kcal/day deficit. See DRIP_NOTE for the evidence. The one-line refutation
needs no citations: the app's own numbers implied 4,402 kcal liberated per pound
of scale weight, and pure lipid is 4,282 (Hall 2008). `observedTDEE` now carries
`impliedPerLb` and `impossible` so that check runs continuously.

**Never integrate an unverified constant off an unverified anchor.** The old
model projected lean mass forward week by week from a coach's-eye estimate. Error
accumulated monotonically and never self-corrected. `bfEst` now returns `lo`/`hi`
as well as `pct`, widening with distance from the anchor, because the anchor's
own ±3–4 points never wash out either.

**Energy density is ~3,800 kcal/lb here, not 3,500.** Wishnofsky 1958's figure is
arithmetically equivalent to assuming 23% of loss is lean tissue — a sedentary
partitioning. For a lean, high-protein, training male it is ~87% fat.

**Never present strength as evidence of muscle retention in a deficit.** Murphy &
Koehler 2022's title is literally "impairs lean mass but *not* strength." Roth
2023 and the 2026 EJCN trial replicate. Lifts holding up is exactly what the
literature predicts while lean mass falls.

**Muscles with separately-trained heads get separate buckets.** Pooling the three
deltoid heads produced a 17 comparable to no published band, and that number is
what generated a reallocation recommendation below the literature's own noise
floor. `programmeVolume` buckets by `head || mg`, and marks `indirectOnly` for
buckets fed solely by what compounds lend — those have no exercise to add sets to.

**A recommendation below the source's smallest detectable effect must not ship.**
Pelland 2025's SDES for hypertrophy is 2.05%. `volumeImbalance` computes how many
sets are needed to clear it and stays silent when nothing does. `HYP_B = 1.76`
is calibrated so the marginal slope at 12.25 sets is 0.24%/set, which reproduces
their published "~6 sets from a base of 4" tier step.

**Half-credit for indirect sets is CORRECT** — Pelland 2025 tested exactly that
convention and made it the primary method (Bayes factors favour it over both
direct-only and total). Earlier bands (Schoenfeld 2017, Baz-Valle 2022) counted
everything as 1.0, so quoting them next to a fractional count understates.
Convert or quote Pelland's tiers.

**"Defend load on a cut" is folklore.** One trial manipulated load under energy
restriction (Carlson 2022, n=115 trained, 80% vs 60% 1RM both to failure) and
found nothing. Defend effort; treat deficit size as a graded risk, not a wall (N1, v7.48.0) — the corridor steers, 0.70%/wk is the upper default, and hard stops are reserved for health/recovery red flags.
