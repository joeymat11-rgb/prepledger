# P3-HARDEN independent review r4 (Opus) - VERDICT: ACCEPT

Subject 466024fc6afd13a1c890249512e41434919b5c46, on a detached worktree at
that sha. `git diff --stat 397cf96 HEAD` is custody files only; no pinned path
touched. Every bundle below was INVENTED from the public fixture shape
(rebuild/conform/fixtures/preimage-2026-08-15.json, cloned and mutated in
memory). No real bundle, ledger or private path was read in this review.

## Every PM-ordered item re-proven independently

- **A / Opus1 / Fable3 (nights). CLOSED.** numeric d -> `DATE_INVALID
  <number>`; missing d -> `SHAPE_INVALID ... missing d`; object d ->
  `<object>`; null d -> `<null>`, present-but-invalid rather than missing.
  The clean fixture raises no nights issue.
- **Fable1 (--local unshaped). CLOSED**, end to end through the CLI, with a
  class and an index the author did not use: --local with reads[3].d =
  2026-02-30 refuses `local:PORT_SOURCE_DATE_INVALID`; --local with `queue`
  deleted refuses `local:PORT_SOURCE_CLASS_MISSING class queue is missing`.
  In both the --out folder is never created, the source side is not blamed,
  and the refusal lands BEFORE the ORACLE gate; a clean --local still seals
  PASS. MUTANT `if (localBytes)` -> `if (false && localBytes)` turns exactly
  those two cells red (33 tests, 2 fail), leaving the clean-local cell green;
  reverted, `git status --porcelain` empty.
- **Fable2 (corrections). CLOSED.** The day inside `op` holds at every
  boundary tried: 2026-02-28, 2026-12-31, 2024-02-29 accepted; 2026-02-29,
  2026-04-31, 2026-13-01, 2026-00-15, 2026-01-00, 2026-1-05 refused. Malformed
  ops and unparsable/empty/numeric/null/undefined/object `at` all refuse. And
  the engine's own 4-field op `kind:day:id:<ISO>`, ISO tail colons and all, is
  ACCEPTED: `_fileCorr` (engine/migrate.cjs:2501) rebuilds its key as
  `split(":").slice(0,3).join(":") + ":" + at9`, so the day stays at field 2
  and the check cannot false-refuse the engine's own writes.
- **Fable4 (privacy). CLOSED.** An object `reads[].d` yields exactly `class
  reads date at position 2 is invalid: <object>`, and the FULL CLI output
  carries none of its keys or values; a long malformed STRING date truncates
  to exactly 10 characters, tail dropped.
- **Fable5 / Opus MINOR (dashes, cell (f)). CLOSED.** Across all 630 added
  diff lines: zero U+2013/U+2014 in README.md or P3-RUNBOOK.md, zero CRLF.
  Cell (f) asserts all three pre-existing --out refusals byte-for-byte, the
  git-working-tree case included, matching the tip's wording exactly.
- **Opus MINOR 3. CLOSED**: `<null>` for null, the KEY for object nights.

## Findings

1. **MAJOR - the nights pre-guard survives one level up, and a malformed
   source still seals PASS.** `if (!entry || typeof entry !== 'object')
   continue;` silently SKIPS a night that is `null`, a string, a number or a
   boolean. Measured end to end: `sleep.nights[0] = null` prints no SHAPE
   line, exits 0, and writes both the bundle and the passphrase file. `reads`
   has no such hole (`validDay(r && r.d)` refuses a null read) and a night of
   `[]` does refuse - only non-object scalars escape. Same pre-guard class the
   PM just closed for `entry.d`, moved up rather than removed; fix by refusing
   a non-object night as `PORT_SOURCE_SHAPE_INVALID` instead of `continue`.
   Not blocking: at the tip all of these seal PASS unchecked, so the change is
   still strictly stronger, and no copy claims this case is covered.
2. **MINOR - `PORT_SOURCE_CLASS_MISSING` for `earned` names a key no source
   has.** The class is backed by `s.feed`, so deleting `feed` prints "class
   earned is missing from the source (no earned key)". Name the backing key.
3. **MINOR - a non-array `corrLog` raises no shape issue.** `Array.isArray(
   rec.corrLog) ? rec.corrLog : []` skips an object-, string- or number-typed
   corrLog. Nothing is written (PREPARE catches it as
   `IMPORT_MIGRATION_FAILED`), so safety holds, but the new code does not.
4. **MINOR - S4 --ci is red at the subject sha, and not because of this
   ticket.** It exits 1 with `SEAL-BASE-IS-NOT-THE-CHAIN-TIP`, and the same
   command on the UNMODIFIED 397cf96 fails identically: origin/rebuild/
   t2-client-core has moved to 8b484c09 (one commit, DECISIONS.md only,
   397cf96 an ancestor). Replaying both ticket commits onto 8b484c09 applies
   cleanly and gives S4 exit 0. Rebase before merge.
5. **NOTE** - a corrections line gives the position within a day's corrLog but
   not the sessionLog day, so two days each bad at index 0 read alike. And
   three U+2014/U+2013 remain on added lines, all inside port-harden.test.cjs
   (a code comment and the dash-scan cell's own two assertion literals): not
   copy Joe reads, correct as written.

## Suites (replayed onto 8b484c09; MEASURED_TEST_NOW=2026-09-03, TZ NY)

- port `test/*.test.cjs`: tests 54 / pass 54 / fail 0.
- with `rebuild/m3/w6/test/local-source-consumer.test.mjs`: 60 / 60 / 0.
- `node rebuild\t2\rig187.cjs`: `rig187 => PASS`, exit 0.
- `b-package.cjs --ci --package S4`: `PUBLIC CI EVIDENCE PASS`, exit 0.
- today 13 by name: tests 645 / pass 645 / fail 0.
