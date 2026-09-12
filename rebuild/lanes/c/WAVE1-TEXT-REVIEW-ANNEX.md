# WAVE1-TEXT-REVIEW-ANNEX - executed evidence (independent reviewer, round 1 at 436b05d)

Reviewer did not write the candidate. Everything below was executed in
`work/lane-c/review-coach` detached at `436b05d`, base `8e558ce`. Probes ran under
`rebuild/coach/test/.review-scratch/` and were deleted; `rebuild/coach` was
restored byte-identical after every mutation and the tree is clean.

## 1. Custody and counts

| check | result |
|---|---|
| `git diff --stat 8e558ce..436b05d -- rebuild/m3 rebuild/engine rebuild/client rebuild/m4 rebuild/conform .github` | **empty** |
| `git diff --stat 8e558ce..436b05d` | 24 files, 4597 insertions, 4 deletions, all under `rebuild/coach/**` or `rebuild/lanes/c/` |
| `node --test "rebuild/coach/test/*.test.cjs"` | **tests 198 / pass 198 / fail 0**, `not ok` 0 |
| per file | traceability 16, tiers 13, local-era 9, cost-cap 12, charter 8, no-dashes 7 (**C5 = 65**), onboarding-tools 41, parity **30**, closed-list 13 (**C6A = 84**), **wave1-demo 26**, **machine-settings 23** |
| floors (brief 4) | wave1-demo 26 >= 26 (**exactly at the floor**), machine-settings 23 >= 22 |
| `node --check` on both new modules | OK |
| gym 64 / checkin 28 / setup 150 / w6 552 | **all unmoved**, 0 fail |
| `native-carriers-package.cjs --ci` alone | **PASS** (15 lines, `PUBLIC CI EVIDENCE PASS`); this worktree's `test-support/` was already warm from the C6A round, so the cold-run FAIL I diagnosed there did not recur |
| `build.mjs` | **A1 TODAY BUILD PASS** |
| `WAVE1-TEXT-ANNEX.md` file table | **9 / 9** sha256 + line counts match |
| `C6A-ANNEX.md` file table | **5 / 8** match; 3 stale (see condition C2) |

198 = 65 (C5) + 84 (C6A, parity 26 -> 30 under the applied conditions) + 49 (wave one).

## 2. THE INJECTION-POINT JUDGMENT: an honest extension point, not a bypass

This is the question that decides the review, so I answered it from the accepted
sources rather than from the report.

1. **The entry point is named and documented as additive.**
   `rebuild/m3/w6/local/local-client.mjs:395` is
   `hostBindings(options) { return localHostBindings(internalScope(), options); }`
   under the comment *"C1b. The durable-client scope createDurablePublicClient /
   composeWorkoutHost need, supplied from THIS installation. Additive: nothing
   above changes, and a host that never calls it gets exactly the C1 client."*
2. **`workoutCommands` is a declared parameter of that point, with per-call
   precedence.** `rebuild/m3/w6/local/host-bindings.mjs:229` is
   `buildLocalHostBindings(scope, { workoutCommands, clock: hostClock } = {})`;
   `:251` is `const commands = workoutCommands === undefined ? scope.workoutCommands : workoutCommands;`
   and `:262` forwards it into `createT2Stage(..., { workoutCommands: commands })`.
   Handing a producer in is the parameter's purpose, not a loophole.
3. **The A3 precedent is the same call.** `checkin-host.mjs` injects the check-in's
   producer through this mechanism, and `checkin-commands.cjs:11-19` states the
   rule: `workout` is the only producer-injected command `createT2Stage` takes.
4. **Nothing was widened.** The staged command set is still exactly the five in
   BOTH files: `t2-stage.cjs` and `local-client.mjs` each read
   `["weighIn", "logSet", "logSession", "finishSession", "workout"]`.
5. **The accepted client's own gate is satisfied the same way the check-in
   satisfies it.** `rebuild/client/index.cjs` :206 requires
   `cfg.lease.schema_version === 2`; :216-217 require
   `cfg.workoutCommands.schemaVersion === 2` with `prepare` and `validate`
   functions; :218 calls the producer's `prepare`; :226 builds the op; :229 calls
   the producer's own `validate` on the envelope it built. The client does **not**
   enumerate allowed class/kind for `workout` - it delegates to the injected
   producer, which is the designed contract.
6. **The op class/kind is NOT new.** `machine-settings-commands.cjs:94` is
   `class: "event", kind: "fact"` - character-for-character what
   `checkin-commands.cjs:142` already writes. `schemaVersion` is 2 in both.

**Executed proof that it really is one installation**, not a parallel store: after
four captures and a gym `start()`, the sealed generation holds 5 operations under
**one** lease id (`local-era:ff6022...`), census
`{"event/fact": 4, "session/session-start": 1}`. The machine facts sit beside the
workout's own operation, in the same generation, under the same lease.

**Verdict on the question: honest use of a named extension point.** A bypass would
have had to widen the command set, edit `rebuild/client`, invent a class or kind
the client does not already carry, or reach round the producer contract. None of
those happened, and I checked each one rather than accepting the report's word.

## 3. The five steps, my own probes

### Step 2 and 5, the why slot
- No reason on disk: `whySlot === true`, `recorded === false`, the slot reads
  **exactly** `"not recorded"`, and `numericTokens()` of the sentence is `[]` -
  **zero** digits, so it cannot have been built from a plan number.
- **Six smuggling attacks**, every one refused to move it:
  `{topic, why: "You are 2262 kcal today so it is lighter."}`, `{topic:"calories"}`,
  `{topic, plan:{kcal:2262}}`, `{topic:{toString(){return "instruction"}}}`,
  `{topic, recorded:true}`, `{topic, source:"engine.reason"}` - all returned
  `"not recorded"` with 0 digits. The tool reads only the injected `reasons`
  provider; there is no argument path into the sentence.
- With a reason planted on disk it reads the engine's words verbatim and the tag's
  `source` is `engine.reason.planted (recorded)`.
- The whole clean demo run: step 2 ends `Why: not recorded.` and step 5 is
  `Why: not recorded.` - one sentence, no arithmetic.

### Step 3, capture and recall
- `"seat four, pin three"` capture stores **exactly one** op with payload
  `{"profile":"earned/machine-settings/v1","machine":{"exercise_id":"chest-press","settings":[{"name":"seat","value":"4"},{"name":"pin","value":"3"}]}}`
  - two payload keys, nothing else.
- **Nothing is interpreted**: `"4.5"`, `"three or four"`, `"4/5"`, `"IV"` are all
  accepted and stored byte-for-byte. `"  4  "` stores as `"4"`, which is the
  brief's own specified trim, not a derivation.
- **Eleven refusals, nothing written** (lane op count unchanged across all of
  them): no settings and no cues, 13 pairs, a 41-char name, a 41-char value,
  duplicate names, empty `exercise_id`, an 81-char `exercise_id`, 401-char cues,
  an empty settings array, a numeric (non-string) value - all
  `COACH_MACHINE_SETTINGS_INVALID`; and no confirm -> `COACH_CONFIRMATION_REQUIRED`.
- **Latest wins**: three captures for `chest-press` leave three ops and the tool
  returns `"6"`; `row` stays `"9"`; a never-captured id gives the brief's own
  sentence *"I do not have it yet. Tell me while you are there and I will keep
  it."* and writes nothing. Four captures, four ops, append-only.
- Every recalled value is tagged with its op:
  `"machine-settings.op op-earned-coach-device-3 settings[0].value"`.
- **W15 durability**: the fact survives `restart()` byte-identical, and a
  **freshly constructed** `createMachineSettingsHost` over the same client reads
  the same `{exercise_id, settings, cues}`.
- **The producer's own validate**: `true` for its envelope, `false` for a third
  payload key, a wrong profile, and `kind: "reading"`. `prepare` refuses a
  no-answer machine, a third `machine` member and a third `input` member.

### Step 4, hands-free logging
- **My own byte comparison**: two independent installations, one driven by the
  coach tool (`log_set`, `"110"/"8"/effort "one"`) and one by calling
  `gym-model.logSet` directly with the same set. The stored `class: "session"`
  operations are **byte-identical**, payload included:
  `{"load":{"value":110,"unit":"lb"},"reps":{"value":8,"unit":"rep"},"reserve":{"tag":"exact","value":1,"unit":"rep"}}`.
- No active set -> `COACH_GYM_SESSION_ABSENT` *"The session is ready, so there is
  no set to log."*
- No confirm -> `COACH_CONFIRMATION_REQUIRED` *"Say yes and I will log 110 lb for
  8 reps. Nothing is recorded yet."* - it **names 110 and 8**.
- Unknown effort word, no effort, no load, no reps: all refuse
  (`COACH_EFFORT_REQUIRED`, `COACH_SET_NOT_RECORDED`), and the generation's op
  count is unchanged across every refusal.
- **Unit-keyed traceability on the successful confirm**:
  `"Logged 110 lb for 8 reps."` accepted; `"Logged 111 lb for 8 reps."` -> `["111"]`;
  `"Logged 110 lb for 9 reps."` -> `["9"]`; `"Eat 110 calories."` -> `["110"]`
  (the load cannot travel into a kcal slot); `"That was set 1."` accepted.

### The demo end to end
Clean run (no pre-seeding): **7 steps, 0 untraceable, 0 charter violations, 0
dashes**, in the owner's order, with step 3 showing the miss then the capture then
the read-back. (An earlier run of mine reported `s3a` untraceable; that was my own
pre-capture contaminating the "never captured yet" step, not a defect - the clean
run is `[]`.)

### Gates and tiers
`WAVE1_TIERS` is `{plan_why:0, machine_settings:0, record_machine_settings:1, log_set:1}`,
exactly the brief's tiers. Tier 3 still refuses from a wave-one turn. An unknown
tool name gives `WAVE1_TOOL_NOT_IN_LIST` naming it. `verifyCostCap(undefined)` ->
`COACH_COST_CAP_ABSENT`, `startLiveSession({})` -> `COACH_COST_CAP_ABSENT`,
`verifyOptIn(true,"joe")` -> `COACH_OPT_IN_REQUIRED`, `NAMED_USERS` is
`["joe","dad"]`. Unchanged.

### No network, no key, no dependency
`wave1-tools.cjs`, `wave1-text.cjs`, `machine-settings-commands.cjs` and
`local-world.mjs`: **0** code dashes and **0** hits for `fetch(`,
`node:http|https|net|tls|dgram|dns`, a URL, `WebSocket`/`XMLHttpRequest`,
`process.env`, `child_process`, or any key shape. `scripts/wave1-script.json`: 0
dashes. `no-dashes.test.cjs` names all three new modules.

## 4. Mutants: 16 run, 16 killed, 0 survived

| mutant | fail | RED test |
|---|---|---|
| D1 compose the why from the plan numbers | 2 | "W4 the why is NEVER composed from the plan numbers" |
| D2 print `not recorded` when a reason IS on disk | 1 | "W4 with a reason ON DISK the slot reads the engine's own words, VERBATIM" |
| D3 drop the why slot entirely | 1 | "W3 the WHY SLOT exists on step 2 and step 5, asserted structurally" |
| D4 `log_set` writes its own operation | 1 | "W7 step 4 logs through the GYM CARD'S write path, byte-identical to gym-model" |
| D5 log without the confirm | 2 | "W8 ... the confirm NAMES the weight and the reps" |
| D6 confirm without naming weight and reps | 1 | same |
| D7 speak a setting the store does not hold | 2 | "W6 step 3 after a capture returns the stored settings as TAGGED values, in order" |
| D8 return the FIRST capture not the latest | 11 | "the world opens on ONE local installation" |
| D9 accept a machine with neither settings nor cues | 7 | "W13 AT LEAST ONE of settings or cues, or nothing is written" |
| D10 normalise a spoken word to a digit in a stored value | 11 | "W13 settings are stored in the ORDER given, verbatim, and nothing is interpreted" |
| D11 make `record_machine_settings` tier 0 | 1 | "W10 the tier map carries the four new tools, at the tiers the brief names" |
| D12 an em dash in a new sentence | 2 | "W16 no dash reaches the athlete in any wave-one string or transcript" |
| **R1 (mine)** `log_set` skips the active-set check | 1 | "W8 step 4 refuses GYM_SESSION_ABSENT when no set is active" |
| **R2 (mine)** `machine_settings` reads the WRONG exercise | 1 | "W6 the recall is FOR THAT EXERCISE ID and no other" |
| **R3 (mine)** `record_machine_settings` drops the confirm guard | 1 | "W10 the two tier-1 tools refuse without a yes, and write nothing" |
| **C6A C1 (reproduced)** `submit` hand-builds the payload, key order preserved | **6** | "A1 two_day: the spoken op and the tapped op are the SAME BYTES" |

`wave1-tools.cjs`, `wave1-text.cjs`, `machine-settings-commands.cjs`,
`onboarding-tools.cjs` and `onboarding-parity.test.cjs` all restored
byte-identical by sha256; `git status --short` empty; 198/198 on the restored tree.

## 5. The C6A delta, verified

- **C1 CLOSED.** `onboarding-parity.test.cjs` now wraps the producer in a counting
  spy (`spyOn(commands)`) and asserts `prepareCalls.length === 1`,
  `prepareCalls[0].action === voice.action` (**reference identity**, stronger than
  the byte check I asked for), the request's action name, and that the request has
  exactly `["action","input"]`. My round-1 faithful mutant - the one that
  **survived** then - now dies at **fail 6**, exactly the figure claimed.
- **C2 CLOSED.** `for (const fixture of COMPLETE)` - all six, not `.slice(0, 2)`.
- **C3 CLOSED.** `storedPayload(row)` is one `JSON.stringify({setup, tags})` and is
  the durable assertion; the two separate stringifies are gone.
- **C4 CLOSED.** `C6A-REPORT.md` now reads "12 / 13 with the faithful C1 killed
  after the fix" and "145 = 65 + 80 ... A10 took `no-dashes` from 6 to 7".

## 6. Residuals

1. **`TIERS` advertises more than `dispatch` serves** (condition C1) - the merged
   map has 19 names, `dispatch()` answers 4 and refuses the 15 C5 names with
   `WAVE1_TOOL_NOT_IN_LIST`; `openTurn().call` answers all 19. Measured, not
   inferred.
2. **`C6A-ANNEX.md`'s file table is stale** (condition C2): `onboarding-parity.test.cjs`
   (274 -> 304 lines), `local-world.mjs` (211 -> 278) and `no-dashes.test.cjs`
   (227 -> 229) were edited by `a2f705a` and `3caca8f` after the annex was written.
   The report was refreshed; the annex's hashes were not.
3. **Base is A4b `8e558ce`, not the tip** the brief names (`7f35e90`), disclosed in
   the report's first paragraph. Wave one genuinely does not depend on A4b (it
   reads `today_plan`, `gym-model.mjs` and its own lane), but the branch still
   cannot merge before A4b and must be re-run at A4b's merge sha. W18's stated
   figures (setup 104, coach 64) are the tip's, not this base's.
4. **`wave1-demo.test.cjs` is exactly at its floor** (26 of 26 required). No slack.
5. **The gym-card display half of step 3 is not built** - a `today/**` follow-on,
   correctly out of scope and named in the brief.
6. **The why is a stub until P6.** The slot is honest and asserted, but the second
   half of W4 depends on a planted fixture until reason-on-disk lands.
7. **CI residual unchanged**: the coach suites are not in `rebuild.yml`;
   `.github` is untouched, correctly.
8. Two files under `rebuild/lanes/c/` fall outside the `{C6A-*,WAVE1-*}` custody
   pattern as stated to me: `C6-INDEX.md` and `REPORT-A-PROBLEM-BRIEF.md`. Both
   are documents, neither is code, and the second is the other brief `DECISIONS:140`
   ordered. Noted, not charged.
