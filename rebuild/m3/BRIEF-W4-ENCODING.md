# BRIEF-W4-ENCODING — native PowerShell Unicode decoding

Published by the Astra coordinator on 2026-09-06 as the single W4 tooling follow-up claim for the integrator ("I"). Cowork independently reproduced the defect and reviews the PR. No third product stream; no merge or integration edit; no owner action.

## Branch and base

- Branch `rebuild/m3-w4-encoding` from the verified integration tip `cd984c70aa51e2480e5543f8a511c5e37f88ff8e`, in a separate clean worktree.
- Record the actual base and the commit that published this brief; do not overwrite changed preimages (a preimage that differs from the pinned hash STOPS the work).
- One PR against `rebuild/t2-client-core`. Cowork verifies independently; nobody merges from this PR.

## Problem

Native Windows PowerShell 5.1.26100.9168 `[System.Management.Automation.Language.Parser]::ParseFile` on the current helper returns **53 errors**, the first at **line 102, UnexpectedToken**. Explicit UTF-8 `ParseInput` of the same bytes returns **0** errors. Prefixing ONLY the three bytes `EF BB BF` (UTF-8 BOM) yields native `ParseFile` **0** errors; stripping them restores 53. The test script also contains Unicode without a BOM (its original native parse happened to return 0); preserve its literal decoding by giving it the same BOM. The owner PC's effective native policy is Restricted. No script was executed; never bypass or change policy.

Cause: Windows PowerShell 5.1 decodes a BOM-less script file with the system ANSI code page, not UTF-8, so multi-byte UTF-8 sequences in string literals and comments become stray characters and break tokenization. Reference: <https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding?view=powershell-5.1>.

## Exact FIVE-file allowlist

1. `rebuild/m3/BRIEF-W4-ENCODING.md` — this published contract.
2. `rebuild/m3/setup/store-secret.ps1` — prepend exactly `EF BB BF`, preserving every existing byte. Pre: 25,815 B, sha256 `e0807e9d57435dba9589a5467ca9a8824c7e213cda48d2a6eddf0f7b10abbe39`. Post: 25,818 B, sha256 `cba564105829d581648165df23421f1538c2d1e573a4b6115995517fbdf41af6`.
3. `rebuild/m3/setup/test/store-secret.tests.ps1` — the same three-byte prefix only. Pre: 21,158 B, sha256 `50c432ea03280559c15b840a4850fd9f93436274c2cc7499819b1f884b68cc34`. Post: 21,161 B, sha256 `7b9da21cd27f99eb88813ecafafe58661a59b2d7808bfce947e666ad469ad452`.
4. `rebuild/m3/setup/test/powershell-encoding.test.cjs` — the new regression test described below.
5. `rebuild/m3/REPORT-W4-ENCODING-I.md` — factual report and NEXT.

Only SIX bytes are added to the existing scripts, by buffer concatenation: no text normalization, no function, message, assertion or line-ending change. Source hashes were checked directly against Git at `cd984c7`.

## Regression test

Entry point: `node --test rebuild/m3/setup/test/powershell-encoding.test.cjs`.

- Enumerate the setup directory's two `.ps1` scripts; both contain non-ASCII.
- Require exactly one leading UTF-8 BOM, a strictly valid UTF-8 body, body identity against the pinned preimage hashes, and unchanged tracked bytes after testing. Compare the committed Git bytes too. Tests never rewrite tracked files.
- Windows: resolve the actual native `System32\WindowsPowerShell\v1.0\powershell.exe`, require version 5.1, and invoke only `Language.Parser.ParseFile` via `-NoProfile -NonInteractive -Command`; require 0 errors for both files. Do not substitute PowerShell 7 or explicit UTF-8 `ParseInput`. A missing or wrong Windows host is "unavailable", not PASS.
- Linux executes the portable checks and explicitly skips the native-only test; the root runs the actual native parser before acceptance.
- Effective negative: a disposable copy of the repaired helper with ONLY the BOM stripped. The SAME encoding checker must refuse it with a named missing-BOM verdict, and the exact original body must be retained. The owner's actual native parser also returns 53 on the BOM-less file; report the observed count rather than assuming every Windows ANSI configuration must produce 53 (a UTF-8-configured Windows may parse it). The portable BOM negative must always detect.
- Owned temporary files only; tracked hashes unchanged. Child-process output is limited to version, public label, error count, first error id + line, and verdict.
- Forbidden in the test and in this work: helper execution, dot-sourcing, AST evaluation, `-File`, `Invoke-Expression`, encoded commands, any ExecutionPolicy option or change, WinForms, the CMD wrappers, User-environment read or write (even dummy), credential access, authentication, provider, network or deployment action.

## Gate

- Portable encoding checks PASS.
- Native 5.1 `ParseFile` 2/2 PASS — honestly PENDING on Linux until the root's receipt.
- Missing-BOM negative DETECTED.
- Six-byte source patch and body identity PASS; exact postimages as pinned above.
- `git diff --check` clean and `node rebuild/m3/w0/scope-package.mjs` PASS/PASS. No private engine gate repeat.
- Launcher sources and tests unchanged; the prior 17/17 is an existing receipt, not a new execution claim.

## Report (REPORT-W4-ENCODING-I.md)

Actual base and brief commit; pre/post hashes and lengths; cause; exact test output and OS; the original / BOM / stripped static witness; six-byte proof; skips; wall-clock; NEXT. Cite the Microsoft encoding page above. The PR body ends with the portable / native / negative / body-identity lines. Push one PR and send its link and head. Cowork verifies independently; no merge.

## NEXT

Corrected parsing precedes owner-session preparation. Still unproved: Restricted-policy script execution, the actual owner wrapper, real User-environment persistence, a genuine fresh LOCAL Claude Code process, local sign-in and one harmless request. No W4 readiness claim, no new owner question, no product / law / frozen / soak / queue / ledger edits, no additional product stream.
