# PREP LEDGER — HANDOFF

> **§0 below is the branch handoff for `audit/research-corpus` (v4.0.0), written
> 2026-07-29. §1 onward is the older general onboarding brief — still broadly
> useful, but see "stale in the old brief" at the end of §0 before trusting its
> numbers.**

---

# §0 · BRANCH HANDOFF — `audit/research-corpus` → v4.0.0

**Status: 10 commits, pushed, NOT merged, NOT deployed. Nothing has reached the
athlete's phone.** Suite green at 856 assertions. Working tree clean, no stashes.

## 0.1 · What the research corpus is, and what it is for

`research-brief.md` (repo root, ~450 lines) is the evidence base this app's
design decisions are supposed to rest on. `GOALS.md` — the athlete's own charter,
also on this branch — instructs every session to **read it before researching
anything new** and to *extend* rather than restart it.

It is organised as: progression & records · volume & set counting · **exercise
selection** · nutrition · training mechanics · the diet exit · morning
monitoring · **NEGATIVE FINDINGS** · **RECURRING FAILURE MODES IN THIS
CODEBASE** · what is still open.

Two sections matter more than the rest:

- **NEGATIVE FINDINGS** lists nine rules retired for having no evidence behind
  them (clean-sleep gate, weekly refeeds, "defend load on a cut", lengthened
  partials as a system, rep tempo, slow eccentrics, periodisation, planned
  deloads, machines-inferior-to-free-weights). **Do not reintroduce these.** Each
  one was in the app, shipped, and being acted on.
- **RECURRING FAILURE MODES** is the meta-lesson and the reason the file exists.

## 0.2 · The one thing to understand before touching anything

**The dominant defect in this codebase is not wrong research. It is research
that was written down and then not enforced in code.** This happened three
separate times *in the session that produced this branch*:

1. The clean-sleep gate was retired in `progressStep`, then found alive in
   **eleven** other places — two of which (`liftCall`, `rirPlan`) still decided
   what the athlete lifted.
2. `patchV33` split the deltoids into heads, retracted a card built on the pooled
   bucket, and told the athlete so in his feed — while `muscleVolume()` kept
   counting by pooled muscle, so the TRAIN screen went on printing
   `delts 17 OVER` in red for three more commits.
3. `research-brief.md` already contained *"Retention is cheap; growth is
   expensive"* with both citations, while `volumeImbalance()` was preparing to
   propose **+7 weekly sets** to a man in a deficit.

**When you merge: grep for the claim, not just the function.** A rule that
survives only in copy is still a rule, because he reads the copy.

## 0.3 · What is done

| area | state |
|---|---|
| clean-sleep gate | removed from engine **and** all copy; `patchV34` migrates saved state |
| authored constants | 9 removed — protein 175, steps 16.5k, cal floor 1700, 3500 kcal/lb (was used **three different ways** in one app), 16500/1760/2450 in the two consoles |
| protein | derived from lean mass; now a **floor**, not a symmetric band; carries a range (160–190) because his BF interval straddles the 12.2% subgroup line |
| body fat | band surfaced everywhere the point estimate appears |
| countdowns | Aug 28 / `CROSSOVER` mechanics removed (4 sites) — GOALS.md forbids them, no date is set |
| diet exit | rebuilt to his stated plan: one step to **measured** maintenance, hold, then decide. No ramp, no assumed surplus |
| volume | **phase-aware** — growth band does not apply during a deficit |
| exercise selection | audited; `exerciseSelection()`; his is already optimal |
| Analyst | law sheet + canonical block rebuilt; no authored constants reach the prompt |
| nav | static demotion to NOW / TRAIN / MORE |
| NOW | time-aware via `nowFocus()`; reading collapsed behind one tap |
| tests | 856 assertions, `MIN_ASSERTIONS = 850`; render-smoke walks demoted rooms via MORE |

## 0.4 · What is NOT done

- **No visual/polish pass.** Everything was correctness and structure. Typography,
  spacing, touch targets, colour consistency — untouched.
- **Research topics brainstormed but not run.** In priority order for this
  athlete: (1) how to actually shift a bedtime — light exposure, chronotype;
  (2) caffeine ~350 mg **interacting with his stimulant medication**, against a
  01:40 bedtime that is his single largest body-composition lever;
  (3) NEAT compensation in a deficit — erodes the measured maintenance the whole
  calorie band hangs off; (4) getting a real body-fat anchor (currently
  "coach's eye, ±3.5" — the widest uncertainty in the app, and the sole reason
  protein is a range rather than a number). Then: satiety/fibre, creatine,
  alcohol, waist+photos (he has **zero** of each logged), implementation
  intentions.
- **Hamstrings at 4 sets/week** is a real gap, deliberately **filed not proposed**
  until the deficit ends. See §0.5.
- `GOALS.md` line ~109 still says the surplus is added on top of the diet-exit
  figure. He has since said *straight to maintenance, hold, then decide* — the
  code reflects that, the charter has not been updated.

## 0.5 · Decisions that are not obvious from the files

- **Volume is phase-aware on purpose.** Pelland 2025's 6–12 band is a *growth*
  dose-response measured in people eating enough to build. Roth 2023 (n=38, 6 wk,
  30 kcal/kg deficit, 2.8 g/kg protein — nearly this athlete's exact situation)
  found ~20 weekly sets and ~12 preserved lean mass **identically** (−0.51 vs
  −0.92 kg, ns; no muscle-thickness difference). Bickel 2011 held young adults'
  thigh lean mass for 32 weeks on **one-ninth** of the volume that built it.
  `volumeImbalance()` returns `cutting` / `actionable`; the proposal fires only
  once `targets.exitStart` is set. **Do not "fix" this by making it always fire.**
- **Sleep is a body-composition lever, not a session lever.** Craven 2022 puts
  acute sleep loss at −2.85% on strength, inside test-retest CV. Nedeltcheva 2010
  puts 5.5 h vs 8.5 h at ~60% more of the loss coming off fat-free mass at a
  matched deficit. The app must never gate a rep on sleep again.
- **Bedtime, not wake time, is the named lever.** His measured clock: bed 01:45
  (±20 min), wake 09:00 (±43 min). Bedtime is the *steadier* end, so it is the one
  he can move. The app previously advised "fixed wake time is the strongest
  single move" — aimed at the end he controls least.
- **Triceps: closed, do not reopen.** Overhead beats pushdown for the long head
  (d = 0.54–0.61), but his Prime 3-peg changes the **resistance profile**, not the
  **shoulder angle** — the old `q_peg` item confused the two variables. Shown the
  case, he chose to keep the Prime. `patchV34` closes it.
- **Nav is static by design, never adaptive.** Findlater & McGrenere (CHI 2004,
  n=27): static 306.5 s, adaptive **331.6 s** (~8% slower — repositioning destroys
  spatial memory), adaptable 300.7 s once customised and preferred 15:4. **Do not
  make the tab bar promote whichever tab has news.**
- **The logging ACT is deliberately still manual.** Lower-burden methods
  (wearable, photo) produced *worse* habit formation and less than half the weight
  loss (−3.0 vs −6.8 kg, p<0.001) than a higher-burden manual app. What was cut is
  the *distance* to the act, not the act.
- **`proteinHit` tolerance is 0, deliberately.** A ±10 g band belongs around a
  bullseye; subtracting it from a *floor* just moves the floor and creates a third
  number. The app was simultaneously saying "under 158 is not defended", "anywhere
  160–190 counts", and actually passing 150.

## 0.6 · Migration safety — read before merging

`SCHEMA_V = 34`. `patchV34` rewrites queue copy, migrates `q_pivot` to the new
exit plan, and closes `q_peg`. Two invariants, both test-covered:

1. **It never touches a `done` queue item.** A finished item's `gate` field is a
   *receipt*, not a gate — `q_hack3` on his live state reads `"Debuted 7,8,7"`.
   An earlier draft of this migration would have overwritten it. That is data
   loss on a GOALS.md hard guardrail.
2. **It is idempotent** — re-running files no duplicate feed entries.

Verified against the real `ledger/state.json`: 46 reads / 42 nights / 47 dailyLogs
/ 4 sessions / 13 queue items all intact, every done-item receipt preserved.

## 0.7 · Environment warning — this bit us

The nightly analyst pipeline ran at **05:05 on 2026-07-29**, did
`pull --rebase --autostash origin main`, rebased this branch cleanly, then
**left the repo checked out on `main`** and committed there at 05:14. Subsequent
edits landed on `main` by accident and had to be recovered.

Nothing was lost, but that was luck: `--autostash` means uncommitted work would
have gone into a stash nobody would think to look for. **The pipeline and any
interactive agent are editing the same working copy with no coordination.**
Consider making it refuse to run when a feature branch is checked out, or having
it restore the previous branch. Not changed here — it is the owner's automation.

## 0.8 · Stale in the old brief below

§2 says `src/app.jsx` is ~5,000 lines (now ~8,900) and the suite is 359
assertions (now 856). It references `prep-ledger-pwa/` and GitHub Pages; the app
now deploys via GitHub Actions → Netlify, and `app.js` is committed at repo root
because Netlify serves the repo as-is. §3's environment notes still hold, except
that source surgery is done with Node rather than Python (there is no `python3`
on the current dev machine).

---

Read this first. It is the onboarding document for any agent or environment
picking up development of this app.

---

## 1 · WHAT THIS IS

A single-file React PWA — a personal training/nutrition ledger for one athlete
(Joey, 24M, ADHD, mid-cut). It is not a tracker. It is N=1 research
infrastructure: 54 derived instruments, a 12-law constitution enforced by the
test suite, and two agent employees that read the synced state nightly and
monthly.

**The athlete is the final authority.** The app rules the engines, the agents
narrate, the athlete overrides. This is Law 10 and it is not decorative.

---

## 2 · REPO LAYOUT

```
src/app.jsx              the entire app (~5,000 lines) — one file, by design
tools/engine-test.jsx    the suite (359 assertions). Red = no ship. No exceptions.
tools/render-smoke.mjs   renders every tab in every state; catches silent fallbacks
tools/ship.sh            tests -> smoke -> esbuild -> copy -> git -> push -> beacon
prep-ledger-pwa/         built artifacts: app.js, sw.js, index.html
index.html               served at repo root (GitHub Pages serves from root)
app.js, sw.js            built bundle + service worker at root
ledger/state.json        the athlete's synced state (written by the app, read by agents)
ledger/brief.md          the 4 AM overnight brief (written by the nightly agent)
ledger/deploy.json       publish beacon: {sha, version, state, at}
```

**Everything needed to rebuild lives in this repo.** Migration to any new
environment is: clone, `npm i -g esbuild` (or npx), go.

---

## 3 · ENVIRONMENT REQUIRED

- `node` + `npx` (esbuild is invoked via npx)
- `git` with push rights to this repo
- `python3` (all source surgery is done with Python string/line operations)
- A GitHub PAT with contents:write

**SECURITY:** the token must live in an environment variable (`GH_TOKEN`) or a
secret store. It must NEVER be committed to this file or any file in the repo.
This repo is public. Rotate the token whenever the development environment
changes hands.

---

## 4 · THE SHIP RITUAL

```
bash tools/ship.sh "<release note>"
```

Runs: suite -> smoke -> esbuild -> copy artifacts -> commit -> pull --rebase ->
push -> write beacon.

If ship.sh times out (rc=124) the build usually succeeded but the push did not.
Recover manually:

```
cp prep-ledger-pwa/{app.js,sw.js} <repo>/
cp prep-ledger-pwa/index.html <repo>/index.html     # only when index changed
cp src/app.jsx <repo>/src/ && cp tools/engine-test.jsx <repo>/tools/
cd <repo> && git add -A && git commit -q -m "..."
git pull --rebase && git push
```

Then confirm `ledger/deploy.json` shows the new version.

**Use `&&` between ship.sh and the manual ritual, never `;`.**
A `;` has twice let a RED suite push. Both times required an immediate
assert-amend and a green re-push.

---

## 5 · THE TWELVE LAWS

Four were written by the athlete. They are enforced by the suite — the
constitution length is asserted, so adding a law requires amending the census.

1. Attention lives on NOW
2. Simple surface, real depth
3. Many sources, one door (every machine-initiated change routes through the
   proposals inbox — nothing mutates itself)
4. Facts live, prose dawns (the live line outranks the 4 AM brief, always)
5. Done-ness is derived (one recorded exception: "Mark photos done" is an
   attestation, because a camera roll is underivable)
6. The smallest honest increment
7. One terminal failure set
8. The tilt (defaults lean toward stimulus)
9. Records need clean sleep
10. The athlete overrides
11. The morning lives in the Minute (MORNING_REGISTRY — any morning-class input
    must register or the build fails)
12. No decorative fields — every field must buy attribution; friction is what
    kills tracking systems by week nine

---

## 6 · HARD-WON LESSONS (do not relearn these)

**Source surgery**
- First-occurrence anchors are unreliable. `v{APP_V}` matched a footer before
  the tab-bar stamp; a background+borderTop pattern matched three elements and
  produced three rogue stamps. Verify with grep counts after every batch.
- `applyRead` is PURE — it clones and returns. Tests must capture the return.
- Python heredocs: never `\'` inside single-quoted strings.
- Check for symbol collisions before adding a component (`Section` already
  existed; the second declaration broke the build).
- JSX inserted between ternary branches breaks the parse. Check the surrounding
  structure, not just the line.

**iOS / PWA**
- Inputs under 16px trigger Safari's zoom-on-focus, which leaves the page
  pannable sideways. All inputs render 16px. Do not undo this.
- The frame is: normal document flow, `minHeight: 100vh` shell, tab bar
  `position: fixed; bottom: 0`, content padded to clear it. This layout ran
  gap-free for six weeks. Eight attempts to "improve" it (frozen body, dvh,
  measured height, fixed-inset shell, custom scroll pane) all failed. **Do not
  re-architect the frame.**
- The safe-area inset lives in the tab buttons' padding. Do not add a second
  one on the container.
- The service worker must never cache `api.github.com`. An `ignoreSearch` cache
  match served a stale sha for two days and produced an unkillable 409.
- Do not send a `Cache-Control` request header to the GitHub API from the
  browser — it trips CORS preflight and kills the fetch silently.

**Semantics**
- Midnight is real. A log filed at 12:30 AM belongs to yesterday. There is a
  midnight intercept, a repair door, an amend pencil, and a clear-today hatch
  because this bit the athlete three separate times.
- Cold-start data must not produce verdicts. Instruments gate on n and say
  "counting only" until mature.

---

## 7 · CURRENT STATE

- Version v3.99.0 · schema v30 · 54 instruments · 359 assertions green
- Sync: self-healing (fresh sha, 4 retries, background heal loop)
- The Minute: 8 steps in lived order (pulse -> energy -> soreness -> night ->
  temp -> weight -> grip -> brief), frozen at open, phase-labelled, each step
  carries HOW and COUNTS WHEN
- A forensic stamp sits in the tab bar (tap for glass/page/wrap heights).
  Scheduled for removal once the frame is confirmed clean.

---

## 8 · THE AGENTS

**Nightly analyst** — writes `ledger/brief.md` at ~4 AM from the last sync.
Sections: GAPS, LAST 24H, WATCHING, AUDIT, CONSIDER, QUESTION (max one).
Every claim carries its evidentiary weight: `(measured, n=X)` or `(speculation)`.
It audits its own prior findings and is expected to weaken them when the data
thins.

**Monthly auditor** — independent pipe audit on the 1st: re-verifies that every
field the app writes actually arrives in `ledger/state.json`.

Both are bound to `_dictionary`, which rides inside every sync and is the
authoritative definition of every field. Standing clauses: meds are weather and
never judgment; the app's gates are never re-derived by an agent; alcohol units
are a count-only covariate whose calories live inside the athlete's logged
calories.

---

## 9 · PENDING DOCKET

- Daylight polish pass, screenshot-driven, one tab at a time
- Remove the forensic stamp once the frame is confirmed
- Spine trio: ONE THING, tomorrow-whisper, question tap-chips
- Evening hunger 1-5 input
- Sick-day flag, weekly libido/mood — then close the intake permanently
- Kit mode: mint a second instance for the athlete's father

---

## 10 · HOW TO WORK ON THIS

Recon before editing. Read the exact anchor. Make one batch of changes. Verify
with greps that each change landed. Parse-check. Run the suite. Ship. Confirm
the beacon.

When something is broken, find the mechanism before shipping a fix. Eight
theories cost a night; one instrument (the forensic stamp) ended it in a
screenshot.
