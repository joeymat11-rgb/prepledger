# WAVE1-TEXT-REVIEW - coach wave one in text, the five-step demo: INDEPENDENT REVIEW (round 1)

Independent reviewer, did not write the candidate, told to disagree and execute. Head `436b05d`, base `8e558ce`
(`rebuild/lane-c-a4b`). Bar: `BRIEF-COACH-WAVE1-TEXT.md` (W1-W18, D1-D12) over `COACH-EXPERIENCE-BRIEF.md`'s demo script,
`DECISIONS:140`. Evidence and every command: `WAVE1-TEXT-REVIEW-ANNEX.md`.

## VERDICT: ACCEPT WITH CONDITIONS
The five steps do what the owner's script asks, and I proved the two claims that matter with my own code. **Step 4**: two
independent installations, one driven through the coach's `log_set` and one by calling `gym-model.logSet` directly, produce
**byte-identical** stored `session` operations, payload included. **Steps 2 and 5**: the why slot is structural (`whySlot ===
true`), reads exactly `not recorded`, carries **zero** numeric tokens, and six attempts of mine to smuggle a composed why in through
the arguments all returned `not recorded` with no digits. Step 3 stores exactly one op with payload `{profile, machine}`, keeps
`"4.5"`, `"three or four"`, `"4/5"` and `"IV"` verbatim, refuses eleven malformed shapes and an unconfirmed capture while writing
nothing, and returns the latest of three captures tagged with its op. `GYM_SESSION_ABSENT` holds with no active set and
`CONFIRMATION_REQUIRED` names **110 and 8**; traceability is unit-keyed, so `Eat 110 calories.` is refused even though 110 is the
load. Tier 3, the opt-in and the cap gates are untouched; no dashes, no network, no key, no dependency. All four conditions are
documentation or seam quality, not behaviour; none blocks a merge.
- **C1 NON-BLOCKING** - the merged `TIERS` advertises **19** tools but `dispatch()` serves **4**: the 15 C5 names all return
`WAVE1_TOOL_NOT_IN_LIST`, while `openTurn().call` serves all 19. C6 Part C's V5 builds the model's tool declaration from `TIERS` at
run time, so such a declaration would name 15 tools the dispatcher refuses. *Fix:* delegate C5 names from `dispatch` to the coach,
or export a separate declarable map, so the advertised list and the served list are one list.
- **C2 NON-BLOCKING** - `C6A-ANNEX.md`'s file table is stale: 3 of 8 sha256/line rows no longer match (`onboarding-parity.test.cjs`
274->304, `local-world.mjs` 211->278, `no-dashes.test.cjs` 227->229) because `a2f705a` and `3caca8f` edited them after it was
written. The report was refreshed; the annex was not.
- **C3 NON-BLOCKING** - `WAVE1-TEXT-REPORT.md`'s counts table says the base coach suite is **64**; it is **65** (198 - 49 wave one -
84 C6A). Same figure my C6A condition C4 corrected; `C6A-REPORT.md` now has it right.
- **C4 NON-BLOCKING** - `wave1-demo.test.cjs` sits **exactly** on its floor (26 of 26), leaving no slack.

## The injection-point judgment: an honest extension point, NOT a bypass
Answered from the accepted sources, not the report. (1) `local-client.mjs:395` `hostBindings(options)` is documented as *"C1b ...
Additive: nothing above changes"*. (2) `workoutCommands` is a **declared parameter** of it: `host-bindings.mjs:229` takes `{
workoutCommands }`, `:251` gives the per-call value precedence over the scope's, and `:262` forwards it into `createT2Stage`. (3)
The A3 precedent is the same call. (4) **Nothing was widened**: the staged command set is still exactly the five in both
`t2-stage.cjs` and `local-client.mjs`. (5) The accepted client's own gate (`rebuild/client/index.cjs:206-229`) is a shape gate -
lease `schema_version` 2, producer `schemaVersion` 2, `prepare`/`validate` present, and the producer's own `validate` re-checking
the envelope the client built - and machine-settings satisfies all four exactly as the check-in does. (6) **The class and kind are
not new**: `class:"event", kind:"fact"` is character-for-character `checkin-commands.cjs:142`, and the client does not enumerate
class/kind for `workout` at all: it delegates to the injected producer, which is the designed contract. Executed proof it is one
installation: after four captures and a gym `start()` the sealed generation holds 5 ops under **one** lease, census
`{"event/fact":4,"session/session-start":1}`. A bypass would have had to widen the command set, edit `rebuild/client`, or invent a
class or kind. I checked each; none happened.

## Counts, custody, mutants
`git diff 8e558ce..436b05d -- rebuild/m3 rebuild/engine rebuild/client rebuild/m4 rebuild/conform .github` is **empty**; all 24
changed files are under `rebuild/coach/**` or `rebuild/lanes/c/`. Coach **198/198** (C5 65 + C6A 84 + wave one 49: wave1-demo
**26**, machine-settings **23**, parity **30**); floors 26>=26 and 23>=22 met. gym **64**, checkin **28**, setup **150**, w6 **552**
all unmoved; `--ci` **PASS** run alone; `build.mjs` **PASS**; `WAVE1-TEXT-ANNEX.md` file table **9/9**. Clean demo run: 7 steps, **0
untraceable, 0 charter violations, 0 dashes**. **Mutants 16 run, 16 killed, 0 survived**: D1-D12 (D10 as a real word-to-digit
normaliser, fail 11), three of mine (`log_set` skipping the active-set check, recall reading the wrong exercise, the capture losing
its confirm guard), and the C6A C1 faithful producer-identity mutant, which **survived** in round 1 and now dies at **fail 6**.
Every mutated file restored byte-identical by sha256, tree clean, 198/198 on the restored tree.

## Residuals
Base is A4b `8e558ce`, not the `7f35e90` the brief names (disclosed): wave one genuinely does not depend on A4b, but the branch
cannot merge before it and must be re-run at its merge sha, and W18's stated figures (setup 104, coach 64) are the tip's, not this
base's. The gym-card display half of step 3 is not built and is correctly out of scope. The why stays a stub until P6; the slot is
honest and asserted, but W4's second half needs a planted fixture until then. Coach suites still not in `rebuild.yml` (`.github`
untouched). Two files under `rebuild/lanes/c/` sit outside the `{C6A-*,WAVE1-*}` custody pattern as stated to me, `C6-INDEX.md` and
`REPORT-A-PROBLEM-BRIEF.md`; both are documents and the second is the other brief `DECISIONS:140` ordered. Noted, not charged. No
model, no voice, no relay, and no cap on any account: wave one is a text rehearsal by construction.
