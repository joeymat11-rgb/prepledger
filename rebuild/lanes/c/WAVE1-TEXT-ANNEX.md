# COACH WAVE ONE, IN TEXT - ANNEX (files, seam, checks, mutants, commands)

## Files

| file | lines | sha256 |
|---|---|---|
| `rebuild/coach/machine-settings-commands.cjs` (new) | 172 | `c83446191bdb7c8e5514d28f864ffb138c02fb68ac06b5bbfd1512c22c36a31c` |
| `rebuild/coach/wave1-tools.cjs` (new) | 316 | `22a84878f3eb591ac50d81f8db694d87015a567bc0f0e4535756e1b6a9d24187` |
| `rebuild/coach/wave1-text.cjs` (new) | 178 | `b7e88970cb88bb3873f011ab9b830803d23e8a971b1de65b7d098177d1d10165` |
| `rebuild/coach/scripts/wave1-script.json` (new) | 67 | `be701100ed9c173258e7d5ba7e6c89e5243bacc2d323c39a6a4221d405990ca3` |
| `rebuild/coach/test/wave1-demo.test.cjs` (new) | 535 | `22d9396c2b2b2bdeacf15e7dae507c42ea0ff151e6479a51d1bbc9cd9d5349f4` |
| `rebuild/coach/test/machine-settings.test.cjs` (new) | 349 | `c1413fdfc77e407f505362b9caa770542dbfac2b0b67649032f554a848cf1976` |
| `rebuild/coach/local-world.mjs` (edited: the machine-settings host factory) | 278 | `8a5a3da1c7379335820d8852e60708a5930e2cf8bbfd171f940fe019450d7473` |
| `rebuild/coach/test/no-dashes.test.cjs` (extended to the three new modules) | 229 | `d63638b6c3bb9e66382c2aacc1f4cf8248a45080863c293419130cbe3381dc59` |
| `rebuild/coach/test/onboarding-parity.test.cjs` (C6A conditions C1 to C3) | 304 | `7914e766bc9837b1513caf98549e2d8bcf0a6d4c3fadf7908858c4956c86e6da` |

## The producer seam, in full, because it was the STOP condition

The brief required `earned/machine-settings/v1` to be written through the client's producer mechanism from a
module under `rebuild/coach/`, injected the way `local-world.mjs` already injects the check-in producer, and
to STOP if that needed an edit to `rebuild/m3/w7-preview/today/**` or `rebuild/client`. It did not.

- `today-bindings.mjs:399` `createCheckInHost` takes `commands` and `profile` as ARGUMENTS and hands them
  to `client.hostBindings({ workoutCommands: commands })`. That is the injection point.
- It is NOT reusable as-is: its `save()` hard-codes `action: "checkin"` and `input: { answers }`, and its
  read-back maps `op.payload.answers`. The machine fact is `{ profile, machine }`, so using it would have
  meant either renaming the payload member to `answers` (contradicting brief section 3) or editing w7.
- The injection point itself is one level down and already in this lane's reach:
  `local-client.mjs:395` `hostBindings(options)`, which `local-world.mjs` already calls for the gym. So the
  lane opens its own host in `local-world.mjs` with the same three moves the check-in makes:
  `hostBindings({ workoutCommands })` -> `createDurablePublicClient({ ...bindings, schemaVersion:
  LOCAL_ERA_SCHEMA_VERSION })` -> `execute('workout', { action: 'machine-settings', input: { machine } })`,
  and reads back by filtering the authenticated generation on `payload.profile`.
- Executed consequence (W15): after a Start and one capture the generation holds **2** ops, one lease, one
  device sequence, and the machine fact validates against its own producer. `machineSettingsOnLocalEra` is
  **true**, unlike the check-in's `checkInOnLocalEra: false`.

## The check list

| id | where | verdict |
|---|---|---|
| W1 | `wave1-demo.test.cjs`, the whole script over the real world, in order | PASS |
| W2 | same, step 2 reads `today_plan` only, figures tagged to that turn | PASS |
| W3 | same, the slot asserted structurally on steps 2 and 5 | PASS |
| W4 | same, three tests: not recorded, verbatim with a planted reason, and zero numeric tokens | PASS |
| W5, W6 | same, the miss writes nothing; the recall is ordered, tagged with its op, and keyed by exercise | PASS |
| W7 | same, the stored op compared byte for byte with `gym-model.logSet` in a second world | PASS |
| W8 | same, four tests: no session, no confirm, the confirm names 110 and 8, effort mapping | PASS |
| W9 | same, plus a fail-closed injection and a digit scan of the templates | PASS |
| W10, W11, W12 | same, the tier map, tier 3 unchanged, the gates untouched | PASS |
| W13, W14, W15 | `machine-settings.test.cjs`, the shape rule by rule, one op per change, durability | PASS |
| W16 | `no-dashes.test.cjs` extended to the three new modules and the transcripts | PASS |
| W17 | both new test files, source scan | PASS |
| W18 | the counts table in the report | PASS |

## Mutants D1 to D12, each applied by exact string replace and restored

| mutant | what it did | suite | result |
|---|---|---|---|
| D1 | the why composed from the plan instead of the engine's reason | demo | KILLED, fail 3 |
| D2 | `not recorded` printed when a reason IS on disk | demo | KILLED, fail 1 |
| D3 | the why slot dropped from the step record | demo | KILLED, fail 3 |
| D4 | `log_set` writes its own operation instead of going through the host | demo | KILLED, fail 1 |
| D5 | logging without the confirm | demo | KILLED, fail 2 |
| D6 | the confirm stops naming the weight and the reps | demo | KILLED, fail 1 |
| D7 | a machine setting spoken that the store does not hold | demo | KILLED, fail 2 |
| D8 | the reader returns the FIRST capture instead of the latest | fact | KILLED, fail 2 |
| D9 | a machine with neither settings nor cues accepted | fact | KILLED, fail 3 |
| D10 | "four" normalised to "4" in a stored value | fact | KILLED, fail 4 |
| D11 | `record_machine_settings` made tier 0 | demo | KILLED, fail 1 |
| D12 | an em dash put in a new sentence | dash | KILLED, fail 1 |

`wave1-tools.cjs`, `wave1-text.cjs` and `machine-settings-commands.cjs` sha256 before the first mutation and
after the last: identical, asserted by the driver.

## Executed

| command | result |
|---|---|
| `node --test "rebuild/coach/test/*.test.cjs"` | tests 198, pass 198, fail 0 |
| `node --test rebuild/coach/test/wave1-demo.test.cjs` | 26 / 26 |
| `node --test rebuild/coach/test/machine-settings.test.cjs` | 23 / 23 |
| `node --test rebuild/coach/test/onboarding-parity.test.cjs` | 30 / 30 (was 26; C2 added four) |
| `node --test rebuild/coach/test/no-dashes.test.cjs` | 7 / 7 |
| `node --test rebuild/m3/w7-preview/today/test/setup.test.mjs` | 150 / 150 |
| `node --test "rebuild/m3/w6/test/*.test.mjs"` | 552 / 552 |
| `node rebuild/m3/w7-preview/today/build.mjs` | `A1 TODAY BUILD PASS: 3 assets; 102 pinned inputs` |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS` |
| `git diff --stat 8e558ce..HEAD -- rebuild/m3 rebuild/engine rebuild/client rebuild/m4 rebuild/conform .github` | empty |
| `node --version` | v24.18.0 |

## What a reader should check first

1. `wave1-tools.cjs` `log_set` calls `gym.logSet` and builds no operation of its own. W7 compares the stored
   bytes with the gym card's, in two worlds.
2. `plan_why` returns exactly two things: the reader's words with the reader's source, or the constant
   `NOT_RECORDED`. There is no third branch.
3. `machineOf` is the one gate, used on the request and again on the envelope, and it copies rather than
   mutates. "four" is a string on the way in and a string on the way out.
