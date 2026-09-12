# C6 PART A - ANNEX (files, executed commands, check by check)

## Files

Refreshed at the RE-PIN head (WAVE1 review C2: the table below had gone stale against the files
in the tree, on three rows, and a table a reviewer cannot trust is worse than no table).

| file | lines | sha256 |
|---|---|---|
| `rebuild/coach/onboarding-tools.cjs` (new) | 446 | `4d87ae83db51ce15dd5aa1873fd81fefbd6c521d7fceeef359d948a349d66204` |
| `rebuild/coach/onboarding-text.cjs` (new) | 162 | `b8e2b4b774c67f45246c914478114b019f4582393fd31cc1e1f78dd80200d509` |
| `rebuild/coach/scripts/onboarding-script.json` (new) | 115 | `e000db9fb92c79b6a680ffa45ce86fc9aeea57aea8d4f9a3f0fab9c1f7d4b7fe` |
| `rebuild/coach/test/onboarding-tools.test.cjs` (new) | 483 | `0b76ca09a5ddbf4c66a87f399effa6d9d2100577d91b90629d8e6527d6d61c85` |
| `rebuild/coach/test/onboarding-parity.test.cjs` (new) | 339 | `cf532601c3d21f3a692a066203a9c5b8212321ba149b5cf95bb41499f54ee118` |
| `rebuild/coach/test/onboarding-closed-list.test.cjs` (new) | 144 | `6e160c5beb3ffaf1e2456a45cc50664b350ed3ec29b914b7ad60f96625fd4d77` |
| `rebuild/coach/local-world.mjs` (edited: one setup-host factory) | 278 | `8a5a3da1c7379335820d8852e60708a5930e2cf8bbfd171f940fe019450d7473` |
| `rebuild/coach/test/no-dashes.test.cjs` (extended to the onboarding strings) | 229 | `d63638b6c3bb9e66382c2aacc1f4cf8248a45080863c293419130cbe3381dc59` |

## The check list, and where each one is executed

| id | where | verdict |
|---|---|---|
| A1 byte parity, steps 1 to 3 | `onboarding-parity.test.cjs`, three tests per completing fixture | 6/6 |
| A2 durable parity | same file, `createSetupHost` over fake-indexeddb, two installations | 2/2 |
| A3 closed list | `onboarding-closed-list.test.cjs`, 13 tests | PASS |
| A4 no tool sets sets, hi or a day kind | `onboarding-tools.test.cjs`, by source AND by refusal | PASS |
| A5 review reads Earned's standard back verbatim | same, plus a source scan for re-authoring | PASS |
| A6 tier-1 confirm per fact | same, one test per tier-1 tool plus the naming test | PASS |
| A7 unknown stays blank | same, and the blocked fixtures in the parity file | PASS |
| A8 tier 3 refuses by name | same, every `NEVER_VIA_COACH` topic carried through | PASS |
| A9 no untraceable numbers | same, plus a fail-closed injection and a digit scan | PASS |
| A10 no dashes | `no-dashes.test.cjs`, extended: source, templates, fixtures, 72 spoken lines | PASS |
| A11 no network, no model | `onboarding-tools.test.cjs`, source scan of both modules | PASS |
| A12 one op | both files, complete / blocked / abandoned | PASS |
| A13 first run once | both files, in memory and on the real durable path | PASS |
| A14 zero regressions | the counts table in the report | PASS |

## Mutants (BRIEF-C6 2.4), each applied by exact string replace and restored

| mutant | what it did | suite | result |
|---|---|---|---|
| C1 | `submit` builds its own payload instead of calling `prepare` | parity | KILLED, fail 12 |
| C2 | one key reordered in the coach's read-back document | parity | KILLED, fail 6 |
| C3 | a `set_rep_target` tool added to the registry | closed-list | KILLED, fail 3 |
| C4 | `dispatch` falls through to a default handler | closed-list | KILLED, fail 5 |
| C5 | `review` re-authors the standard start string | tools | KILLED, fail 2 |
| C6 | a tier-1 tool accepted without confirmation | tools | KILLED, fail 7 |
| C7 | `sets`/`first` written when the athlete says "I don't know" | tools | KILLED, fail 1 |
| C8 | a template prints a number the turn's tools did not return | tools | KILLED, fail 2 |
| C9 | one op written per answered question | tools | KILLED, fail 1 |
| C10 | a second transcript overwrites an existing first-run op | tools | KILLED, fail 1 |

`onboarding-tools.cjs` and `onboarding-text.cjs` sha256 before the first mutation and after the last:
`a7458927...` and `b8e2b4b7...` both times, asserted by the driver.

C2 SURVIVED on the first pass: the parity test compared `setup` and `tags` one at a time, which let the
coach reorder its own document and still pass. The test now compares the whole snapshot in one
`JSON.stringify`, and C2 dies. That is the mutant doing its job and it is recorded rather than quietly
fixed.

## Executed

| command | result |
|---|---|
| `git rev-parse origin/rebuild/lane-c-a4b` | `8e558ceb2169869c2715ad5b9f8c49f61b13e9f2` |
| `node --test "rebuild/coach/test/*.test.cjs"` | tests 145, pass 145, fail 0 |
| `node --test rebuild/coach/test/onboarding-tools.test.cjs` | 41 / 41 |
| `node --test rebuild/coach/test/onboarding-parity.test.cjs` | 26 / 26 |
| `node --test rebuild/coach/test/onboarding-closed-list.test.cjs` | 13 / 13 |
| `node --test rebuild/m3/w7-preview/today/test/setup.test.mjs` | 150 / 150 |
| `node --test rebuild/m3/w7-preview/today/test/catalogue.test.mjs` | 43 / 43 |
| `node --test "rebuild/m3/w6/test/*.test.mjs"` | 552 / 552 |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS` |
| `node rebuild/m3/w7-preview/today/build.mjs` | `A1 TODAY BUILD PASS: 3 assets; 102 pinned inputs` |
| `git diff --stat 8e558ce..HEAD -- rebuild/m3 rebuild/engine rebuild/client rebuild/m4 rebuild/conform .github` | empty |
| `node --version` | v24.18.0 |

A first `--ci` run reported FAIL. This annex first called that a race under load; the reviewer showed it is
not. It is a COLD WORKTREE, and it fails deterministically on the first run in one, while the harness
materialises `test-support/import-engine/**`; runs two and after pass. The correction is kept here rather
than overwritten, because the wrong diagnosis was the more comfortable one.

## RE-PIN onto :149 - the parity re-check

A4b merged in a different final form from the one this annex was written against: the tags handling moved
off `today-bindings.mjs` into the producer (`today/setup-commands.mjs`, `envelopeOf`) plus
`today/setup-host.mjs`, and `setup-app.mjs:524` now calls `onDone({ setup, tags })` - ONE argument, an
envelope - which `today-entry.mjs:141` forwards verbatim to `host.save()`.

The C6A driver was on the OLD two-argument `save(setup, tags)`, on both sides. That is now fixed:
`onboarding-tools.cjs` submit and the tap side of the A2 test both make the screen's one-argument call.

Why this mattered even though nothing was failing: `envelopeOf` accepts both spellings, so the old call
kept producing identical bytes. Re-running the suite with submit reverted to `save(setup, tags)`, 30 of
31 parity tests still passed - every byte check, every durable check - and only the new argument-shape
test failed. A parity claim that cannot tell the screen's call from a different one is not worth much, so
the argument list itself is now pinned: `A1 submit makes the SCREEN's call: save({setup, tags}), one
argument` asserts one argument, exactly the keys `["setup","tags"]`, and equality with the envelope the
screen would have built from the same answers.

## What a reader should check first

1. `onboarding-tools.cjs` has no call to `setup.chooseSets`, `setup.chooseHi` or `setup.setDayKind`. That
   single fact is the safety argument; everything else is its consequence.
2. `submit` calls `commands.prepare` and nothing else builds a payload.
3. `review`'s standard lines are `model.standardStartLine()` and `model.standardStepLine()`, called, not
   copied.
