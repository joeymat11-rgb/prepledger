# THE LEDGER BLUEPRINT
### A portable spec for building personal training-ledger apps — one per human, never shared

**What this is.** Prep Ledger is a single-file React PWA that became one athlete's entire prep system: adaptive session generation, an achievement state machine, an honest scale ledger, self-gating analytics, and a GitHub self-filing loop reviewed weekly by Claude. This document is the extraction: everything universal about *why it works* and *how it's built*, separated from everything that belongs to one specific client — so a fresh Claude instance, in a fresh chat, can build the next one for a different human on a different program.

**How to use it (operator instructions).** Start a new chat. Upload: (1) this file, (2) the starter kit from the `prepledger` repo — `src/app.jsx`, `src/history.js` (as a format example only), `tools/engine-test.jsx`, `tools/ship.sh`, plus `index.html` and `sw.js` from the repo root, and (3) whatever program/history documents the new client has. Then say: *"Build a ledger app for a new client using the blueprint. Start with the intake interview."* The rest of this document is written to that Claude.

---

## PART 1 — THE CONSTITUTION (universal; violate nothing here)

These ten laws are why the first app worked. They are person-independent even though they were discovered on one person.

1. **Rules with teeth, not intentions.** Every number logged must feed a rule; every rule must act (gate, hold, propose, mute). Detail no rule reads is decoration. Corollary: if you add an input, name the rule it feeds in the same release.
2. **One structural change per session.** Load jumps, new sets, machine swaps — one per session, auto-scheduled from a queue. Rep progression is unlimited. This keeps every training response attributable.
3. **Standards are earned, owned, and can be lost.** The state machine: GATED → EARNED (top of rep window, on a clean day) → DEBUT (runs when it wins the structural slot) → OWNED (the standard repeats) — with RECLAIM (a lost standard must be re-earned at the exact line) and PARKED (a named trigger decides, not memory). Grinds never earn. Debt-day hits log as provisional.
4. **Recovery speed is the metric, never an unbroken chain.** A miss opens a fix window; closing it *extends* the record. Streak-guilt mechanics are forbidden — they are how lapses become quits.
5. **The trend is the instrument; mornings are static.** Damped trend (30% step, spike clamp ±1.5 lb), a measured personal noise floor that auto-stamps meaningless reads, seal windows around events that quarantine reads AND mute every rate rule. The scale never gets to panic anyone.
6. **Anticipation is the payload.** The app's job on a rest day is to make tomorrow specific and slightly electric: named debuts, countdowns, "what you'll see." Reward the logging, never the checking — no mechanic may pay out for opening the app more often.
7. **Progressive disclosure everywhere.** Every card: glanceable headline → one-line plain tag → tap for WHAT IT IS (mechanism) + FOR YOU · RIGHT NOW (computed live from state). Depth on demand, never as an obstacle.
8. **Analytics self-gate on their own data.** No correlation ships under its N. Locked analytics stay *visible* with progress bars — "4/8 sessions" — so logging visibly funds the science. Predictions over platitudes; ranges over points; n printed always.
9. **One channel of human authority.** If a human coach exists, structural program changes are theirs; the app proposes and one-taps, never silently applies. If the operator (the person running these builds) is the coach, say so explicitly in config and route authority there. Ambiguity here wrecks trust.
10. **The app is a ledger, not a judge.** No red-number shaming, no penance mechanics, no compensation prompts after events. Events get protocols (protein-forward, zero-comp) and their aftermath gets pre-explained. Honest ≠ harsh.

**The standing audit:** before shipping any feature, ask — does this reward *doing* or *checking*? Does it add a decision or just data? Would it survive the client's worst week? Kill anything that fails.

---

## PART 2 — THE CHASSIS (universal architecture)

**Stack.** One React file (`src/app.jsx`, JSX, no framework beyond React), bundled by esbuild to `app.js`, served as a static PWA (manifest + service worker), state in `localStorage` under one key, deployed via GitHub → Netlify auto-deploy. No backend. No accounts. One human per app.

**Build command (exact):**
```
npx esbuild src/main.jsx --bundle --minify --format=iife --jsx=automatic \
  --loader:.jsx=jsx --define:process.env.NODE_ENV='"production"' --outfile=<site>/app.js
```

**File layout.**
```
build/
  src/app.jsx        # the entire app: theme, engine, UI, seed
  src/history.js     # auto-extracted client history (generated, never hand-edited)
  src/main.jsx       # mount shim
  tools/engine-test.jsx  # assertion suite over the pure engine
  tools/smoke2.mjs   # render smoke (header, tab rail, localStorage seed)
  tools/ship.sh      # the ship gate (below)
repo/                # git clone of the client's private repo = Netlify publish root
  index.html  sw.js  app.js  fonts.css  icons  src/  tools/  ledger/state.json
```

**State model.** One JSON object, `v`-numbered schema. Every schema change = `patchVn()` + a `migrate()` chain that NEVER loses user-logged data (union by date; user entries win over seeds for post-handoff dates; trend recomputed forward over unsealed reads). Seeds are built by a `weave()` step that folds the extracted history into reads, dailyLogs, sleep nights, weekly trend snapshots, and a trailing-7-day starting trend.

**Engine pattern.** All logic is pure functions over state — `genSession`, `completeSession`, `runAdaptive`, `currentRate`, `bfEst`, `recoveryIndex`, `observedTDEE`, `labAnalytics`, `applyRead`, `migrate` — exported via `__test` and covered by the assertion suite. UI components only call engine functions and `save()`. This is what makes weekly evolution safe.

**Key engine behaviors to port intact:**
- Sessions are *computed* from (calendar day-type × exercise state × queue), never stored. Any future date generates correctly; deferred work rolls forward automatically.
- `pickStructural`: first eligible queue item for the day type wins the slot; sleep-gates can defer debuts; riders only when human-approved.
- Seal windows: reads auto-marked `sealed`, excluded from trend, and **all rate/BF proposals muted** while sealed.
- Honest-opener enforcement: optional per-lift opener RIR; RIR-0 twice = load HELD until an honest session; a top-of-window set at RIR 0 never earns.
- Weekly self-filing: with a saved token (its own localStorage key, **never inside exported state**), first open on Sunday commits the full state to `ledger/state.json` in the client's repo. This is both backup and the Claude review channel.
- Same-day undo for every loggable (read/sleep/waist), trend-safe via stored pre-trend.
- Update banner: `controllerchange` listener (guarded so first install doesn't fire it) + `registration.update()` on every foreground → orange "UPDATE READY — TAP." Version constant `APP_V` printed in the RULES footer = the truth test.

**UI system.** Six-tab rail (NOW · TRAIN · QUEUE · BODY · SLEEP · HIST), card components (`Card/Eyebrow/H/Num/Chip/Stamp/Bar/Stepper/Btn`), the reusable `More` disclosure atom, THE LAB section in HIST. Dark "iron-and-chalk" theme (ink `#101418`, jade=earned/good, brass=caution/armed, orange=debut/action, never red), Barlow Condensed display + IBM Plex Mono, self-hosted fonts. Theme is a config knob — but keep the semantic color *grammar* even if the palette changes.

**The ship gate (non-negotiable).** Every push runs: bundle tests → run tests (**red suite blocks the push**) → prod build → smoke → copy `app.js`/`sw.js`/`src`/`tools` into repo → commit → `git pull --rebase` (the client's phone syncs to the same branch — it WILL race you) → push. Bump the `sw.js` cache string AND `APP_V` every release, no exceptions.

---

## PART 3 — THE CLIENT LAYER (replace all of it, every time)

Everything below is one person's life wearing code. **None of it ports.** The next client gets fresh values at every one of these sites in `src/app.jsx`:

| Site | What it holds | Replace with |
|---|---|---|
| `EXERCISES` | lifts, day-type, sets, rep windows, increments, state-machine fields, `setup` blurbs, `lastMeta` | the new program, in the client's real gym order, with THEIR machine settings verbatim (preserve their uncertainty marks like "(?)") |
| `PHASES` / targets / `PROTEIN` | calorie bands, protein number, step ceilings, phase ladder | the new program's numbers and phase logic |
| `s.rate` bands | floor / band / redline | rate rules appropriate to the client's size, age, and goal |
| `SEED` + `weave()` + `src/history.js` | seeded state + extracted history | extract THEIR tracker (see Part 5) |
| `EVENTS`, seal windows, crossover/checkpoint dates | social calendar, milestones | theirs |
| `bfEst` anchors, drip, `dexaPred` | lean-mass model constants | re-derive or omit BF modeling entirely if not goal-relevant |
| `labAnalytics` selection | which analytics exist and their thresholds | only ones whose *decision* exists for this client (Part 4) |
| Every copy string | the coaching voice, references to their history | rewritten in the register that fits the new client (Part 4) |
| Repo, Netlify site, token | infrastructure | **brand new per client — never reused, never shared** |

**Do-not-port list (memorize):** the first client's exercises, rep standards, rate bands, macro numbers, ADHD-specific framing, stimulant-window RIR logic, his events, his history, his repo, his token, and any sentence that mentions his numbers. The chassis travels; the person does not.

---

## PART 4 — INTAKE PROTOCOL (the new Claude's first move)

**Do not open an editor before this interview is done.** Ask in plain language, a few at a time:

1. **Goal & timeline.** Cut / build / recomp / health-first? Any date that matters? What does "success" look like in their words?
2. **Authority.** Who decides structural changes — a coach, the operator, a physician, the client alone? (Law 9. Write the answer into the app's copy.)
3. **Health screen.** Age, medications, conditions, joint history, anything a physician has restricted. For older clients default conservative: wider rep windows, smaller increments, joint-first flags weighted heavier, and an explicit "cleared by your doctor" line in RULES. You are not a medical professional and the app must say so where relevant.
4. **The program.** Days, split, exact exercises in performed order, current loads/reps, progression style they already use. If they have a tracker (sheet, notes app, paper), get it — it is the seed AND the source of truth on order, standards, and quirks (Part 5).
5. **Motivation profile.** This drives the entire reward layer, and it is the #1 thing NOT to assume. The first client had ADHD: the design answer was anticipation-as-payload, externalized time, brakes against hyperfocus, recovery-speed framing, zero-friction logging. A different person might need: bigger type and fewer tabs; gentle streak-free consistency framing; a weekly ritual instead of daily texture; family-visible milestones; or plain utilitarian minimalism. Ask: *"What has made you quit tracking things before?"* and *"What kind of progress actually feels good to you?"* Design the reward layer from those two answers.
6. **Accessibility & device.** Phone model, eyesight (font scale!), comfort with taps vs typing, one-handed use.
7. **Data consent.** Explain plainly: the app's data lives on their device and (if they enable self-filing) in a private GitHub repo; the deployed bundle embeds their seeded history at an obscure but *public* URL. Offer choices: their own GitHub account (they own the data), the operator's account (operator custodianship — get their OK), or no sync at all (manual export only). Record the choice in the repo's README.
8. **Analytics fit.** For each LAB analytic, ask: what decision would this feed for THIS client? Keep only those with an answer. A 60-year-old on a health-first program probably wants the noise floor, masked-loss monitor, and whoosh line — and has no use for a pivot cone or RIR truth-check.

Then produce a one-page **Client Config** summarizing every answer, get the operator's sign-off, and only then build.

---

## PART 5 — SEEDING FROM HISTORY (the move that makes it feel alive on day one)

If the client has any tracker, extract it — verbatim — into `src/history.js` (`{d, w, cal, pro, steps, slp, note, flag}` per day, notes truncated ~110 chars). Then let `weave()` derive: full read history, trailing-7-day starting trend, weekly snapshots (→ the rate gauge reads MEASURED on day one), sleep record, daily logs. Mine the notes for: real exercise order, machine settings, standards, recurring cues, and event episodes for the LAB.

Hard-won parsing rules: dates may arrive as datetimes OR serials — check types before filtering; trailing formula-artifact rows (auto-computed flags on empty days) must be excluded; when a curated summary and the daily log disagree, **the contemporaneous daily log wins**; keep the client's own flags verbatim (their sheet's judgments are part of the record); and never "correct" their history — display it, model around it.

No history? Seed minimal, mark every model "prior — self-corrects as you log," and let the LAB arm from zero. Do not fabricate baselines.

---

## PART 6 — BUILD SEQUENCE

1. **Scaffold** from the starter `src/app.jsx`: strip every Part-3 site to placeholders FIRST (grep for the old client's numbers to catch stragglers), keep the chassis.
2. **Config in**: exercises (their order, their setups), phases/targets, rate bands, events, authority copy, theme/accessibility knobs.
3. **Seed**: extract history → `history.js` → verify `weave()` output (reads count, trend value, snapshot count) against the source by hand.
4. **Engine tests**: port the suite, rewrite every client-specific assertion, add one test per new rule. Green before first deploy.
5. **Infra**: new private GitHub repo (`<name>ledger`), fine-grained token (Contents R/W, that repo only, expiry set), Netlify **Import from GitHub** (never drag-and-drop — that's how orphan sites happen), publish root `.`.
6. **v1 ship** through the ship gate. Version stamp in RULES footer and the update banner exist **from v1** — they end all "did it update?" debugging forever.
7. **Install**: client opens site URL → Add to Home Screen → RULES shows v-number → (optional) paste sync token → Sync now → operator's Claude reads `ledger/state.json` back as the proof-of-loop.
8. **Operate**: client logs (~90 s/day); app files itself Sundays; operator says "review the week" in the client's chat; Claude fetches state from the repo, reviews, ships next build; client taps the banner. Off-cycle contact is for exceptions only — daily reviews are noise amplification and are explicitly rejected.

---

## PART 7 — LESSONS REGISTER (paid for once; don't pay twice)

1. iOS PWAs resume from memory — "close" isn't close. The update banner exists because of this; kill-twice is only the fallback story.
2. Two similar Netlify sites = guaranteed confusion. One site, GitHub-connected, from day one; delete drag-and-drop experiments immediately.
3. A red or stale test suite WILL get pushed eventually if the push is manual — hence `ship.sh`, where red physically blocks.
4. The client's phone commits to the same branch you deploy to. `git pull --rebase` before every push, always.
5. Build containers die mid-edit. The repo carries `src/` and `tools/` on every push precisely so nothing is ever lost.
6. Tokens fail on one typo (o vs 0). Copy, never retype; verify with an API read after saving.
7. Guard-matchers on text must match phrases, not words ("REFEED SKIPPED" ate "Incline skipped"). Test matchers against the real corpus.
8. Sealed windows must mute rate rules, or the first post-event open shows a false REDLINE — the exact panic the system exists to prevent.
9. Version-pin nothing in tests (`v === 4` breaks on every schema bump); assert against `SEED.v` or ranges.
10. Every disclosure/analytic needs the FOR YOU layer computed from live state — static explanations go stale and stale text is quiet lying (the "controlled 8s" lesson).
11. sw cache string + APP_V bump every release, or the deploy is invisible.
12. Sensitive keys (sync token) live in their own localStorage key, excluded from exports and sync payloads — verify with a test.

---

## PART 8 — KNOWN NEXT CLIENT (the operator's father)

Pre-filled deltas the next Claude should expect, pending the interview: different program entirely (build his engine from HIS program doc — port zero exercises); likely different motivation profile (do not assume ADHD framing; re-derive the reward layer from his answers); age-appropriate conservative defaults (health screen first, physician line in RULES, joint flags weighted up, smaller increments, no stimulant logic); probable accessibility wants (font scale knob, consider fewer tabs); authority likely = the operator as coach — write that channel explicitly; fresh repo (`<dad>ledger`), fresh token, and his own data-consent decision recorded. Everything else — the constitution, the chassis, the ship gate, the cadence — applies unchanged.

*End of blueprint. The chassis travels; the person does not.*
