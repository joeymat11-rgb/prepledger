# PREP LEDGER — HANDOFF BRIEF

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
