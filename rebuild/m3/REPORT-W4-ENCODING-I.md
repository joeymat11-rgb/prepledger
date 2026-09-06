# REPORT — W4 ENCODING (integrator, "I") — 2026-09-06

Executes `rebuild/m3/BRIEF-W4-ENCODING.md` (Astra's single W4 tooling follow-up claim; cowork reproduced the defect and reviews the PR). Integrator-owned setup tooling only. Nothing executed a PowerShell script; no policy option or change; no owner action; no integration edit; no merge.

## 0. Base, brief, branch
- **Base:** `cd984c70aa51e2480e5543f8a511c5e37f88ff8e` (origin/rebuild/t2-client-core, re-fetched and verified before branching).
- **Branch:** `rebuild/m3-w4-encoding`, separate clean worktree.
- **Published brief commit (first, alone):** `6ca6ca2ccfc2cf5a115b095cf1cc262238a81303` — `rebuild/m3/BRIEF-W4-ENCODING.md` only, 54 lines. Implementation followed in the next commit.
- **Preimages checked against Git at cd984c7 before touching anything:** `rebuild/m3/setup/store-secret.ps1` 25,815 B sha256 `e0807e9d57435dba9589a5467ca9a8824c7e213cda48d2a6eddf0f7b10abbe39`; `rebuild/m3/setup/test/store-secret.tests.ps1` 21,158 B sha256 `50c432ea03280559c15b840a4850fd9f93436274c2cc7499819b1f884b68cc34`. Both matched the brief's pins; both began `23 20 73` (`# s`, no BOM); non-ASCII present in 62 and 48 lines respectively. Exactly two `.ps1` files exist under `rebuild/m3/setup`.

## 1. Cause
Windows PowerShell 5.1 reads a script file that has no byte-order mark using the system ANSI code page, not UTF-8 ([about_Character_Encoding, PowerShell 5.1](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding?view=powershell-5.1)). Both setup scripts contain UTF-8 multi-byte text (typographic dashes, ellipses, arrows, the `·` separator in messages and test names). Decoded as ANSI, those sequences become stray characters inside string literals and comments and break tokenization. The owner's native host (5.1.26100.9168, policy Restricted) reported 53 parse errors on the helper, first at line 102 (UnexpectedToken); the same bytes parsed with explicit UTF-8 `ParseInput` gave 0; prefixing only `EF BB BF` gave 0 with native `ParseFile`; stripping it restored 53. The test script happened to parse to 0 on that host but carries the same ambiguity, so it gets the same BOM.

## 2. Change (six bytes, buffer concatenation, nothing else)
| file | pre (bytes · sha256) | post (bytes · sha256) | body identical to pre |
|---|---|---|---|
| `rebuild/m3/setup/store-secret.ps1` | 25,815 · `e0807e9d57435dba9589a5467ca9a8824c7e213cda48d2a6eddf0f7b10abbe39` | 25,818 · `cba564105829d581648165df23421f1538c2d1e573a4b6115995517fbdf41af6` | yes |
| `rebuild/m3/setup/test/store-secret.tests.ps1` | 21,158 · `50c432ea03280559c15b840a4850fd9f93436274c2cc7499819b1f884b68cc34` | 21,161 · `7b9da21cd27f99eb88813ecafafe58661a59b2d7808bfce947e666ad469ad452` | yes |
Both postimages equal the brief's pins. Patch performed as `Buffer.concat([EF BB BF, preimage])` and written back; each file re-read and compared: `post.subarray(3)` equals the preimage byte-for-byte. Total bytes added: **6**. `git diff --numstat` shows `1 1` per file (the first line changed by the invisible BOM only). No text normalization, no function / message / assertion / line-ending change.

Static witness (first six bytes of the helper): original `23 20 73 74 6f 72` (`# stor`) → repaired `ef bb bf 23 20 73` → stripped disposable copy `23 20 73 74 6f 72` again.

## 3. New regression test — `rebuild/m3/setup/test/powershell-encoding.test.cjs`
- Enumerates every `.ps1` under `rebuild/m3/setup` (must be exactly the two pinned files; both must contain non-ASCII).
- Per file: exactly one leading UTF-8 BOM (double BOM refused), strictly valid UTF-8 body (`TextDecoder` fatal), body sha256 and length equal to the pinned preimage, whole-file sha256 and length equal to the pinned postimage, `file === BOM ‖ body`.
- Six-byte proof across both files.
- Committed bytes: working tree compared to `git show HEAD:<path>` (the comparison is deferred with a diagnostic only while that file itself is uncommitted work in progress; in a clean checkout it is a hard comparison).
- Negative: a disposable copy of the repaired helper with ONLY the BOM stripped is refused by the SAME checker with the fixed verdict `MISSING-BOM`; its body equals the original preimage; the tracked helper is untouched; controls prove the checker accepts the repaired bytes and refuses `DOUBLE-BOM` and `INVALID-UTF8`.
- Native (Windows only): resolves the actual `%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe`, requires version 5.1 (PowerShell 7 is not a substitute and fails the version check), and calls only the static `[System.Management.Automation.Language.Parser]::ParseFile` via `-NoProfile -NonInteractive -Command`; output is limited to `VERSION`, `COUNT`, and `FIRST <ErrorId> <line>`; requires 0 errors for both files. A missing host is a failure, not a pass. Off Windows the test SKIPS with an explicit "PENDING until a Windows run reports it" message. A second observational native test parses the BOM-stripped copy and reports the observed count without asserting 53.
- Final test: every tracked `.ps1` byte-identical to its load-time snapshot (tests never rewrite tracked files; temporary files are owned `mkdtemp` directories, removed afterwards).
- Not present anywhere in the test: helper execution, dot-sourcing, AST evaluation, `-File`, `Invoke-Expression`, encoded commands, ExecutionPolicy options, WinForms, the CMD wrappers, User-environment access, credentials, authentication, provider, network or deployment actions.

## 4. Executed here (Linux 6.18.44 x86_64, Node v22.22.2; wall-clock for the implementation cell ≈ 1 s after the brief push)
```
node --test rebuild/m3/setup/test/powershell-encoding.test.cjs
ok 1 - inventory: exactly the two pinned .ps1 scripts exist under rebuild/m3/setup, both with non-ASCII content
ok 2 - encoding: rebuild/m3/setup/store-secret.ps1 starts with exactly one UTF-8 BOM and has a strictly valid UTF-8 body
ok 3 - body identity: rebuild/m3/setup/store-secret.ps1 body is byte-identical to the pinned pre-BOM preimage; whole file matches the pinned postimage
ok 4 - encoding: rebuild/m3/setup/test/store-secret.tests.ps1 starts with exactly one UTF-8 BOM and has a strictly valid UTF-8 body
ok 5 - body identity: rebuild/m3/setup/test/store-secret.tests.ps1 body is byte-identical to the pinned pre-BOM preimage; whole file matches the pinned postimage
ok 6 - six-byte proof: the two patches add exactly 3 + 3 = 6 bytes and change nothing else
ok 7 - committed bytes: the working-tree files equal the bytes committed at HEAD (skips only while the file itself is uncommitted work)
ok 8 - negative: a disposable copy of the repaired helper with ONLY the BOM stripped is refused as MISSING-BOM; its body is the exact original; the tracked file is untouched
ok 9 - native: Windows PowerShell 5.1 Parser.ParseFile returns 0 errors for both scripts (parse only; no execution) # SKIP native Windows PowerShell 5.1 is not available on this OS — result PENDING until a Windows run reports it
ok 10 - native negative (observational): the BOM-stripped disposable copy is parsed by native 5.1 and its error count is reported, not assumed # SKIP native Windows PowerShell 5.1 is not available on this OS
ok 11 - tracked bytes unchanged after all tests
# tests 11 · # pass 9 · # fail 0 · # skipped 2
```
The first run above executed before the implementation commit, so test 7 compared nothing and emitted its "deferred" diagnostic; the post-commit run (recorded in the PR description) performs the real HEAD comparison.
- `git diff --check`: clean · `node rebuild/m3/w0/scope-package.mjs`: `FROZEN-PATHS PASS` · `OLD-PACKAGE PASS — 18 allowlisted files` · launcher sources and tests unchanged vs cd984c7 (0 lines of diff) — the earlier 17/17 is an existing receipt, not a new execution claim · no private engine gate repeated.

## 5. Gate status
| gate | result |
|---|---|
| portable encoding checks | PASS (tests 1–8, 11) |
| native 5.1 ParseFile 2/2 | **PENDING** — skipped on Linux; the root runs the actual native parser before acceptance |
| missing-BOM negative | DETECTED (test 8, fixed verdict `MISSING-BOM`, body = original preimage) |
| six-byte patch / body identity | PASS; exact postimages `cba56410…` / `7b9da21c…` |
| git diff --check · scope-package | clean · PASS/PASS |

## 6. Skips and limits (honest)
- Native Windows PowerShell 5.1 parsing was NOT run here (no Windows host). The 53 / line 102 / 0-with-BOM figures are the root's observations, quoted, not reproduced.
- The observational negative deliberately does not assert 53: a UTF-8-configured Windows may parse the BOM-less file cleanly.
- No PowerShell script was executed, dot-sourced or evaluated by this work, on any OS.

## 7. NEXT
Corrected parsing precedes owner-session preparation. Still unproved: Restricted-policy script execution, the actual owner wrapper (double-click route), real User-environment persistence, a genuine fresh LOCAL Claude Code process, local sign-in and one harmless request. No W4 readiness claim, no new owner question, no product / law / frozen / soak / queue / ledger edits, no additional product stream. Cowork verifies this PR independently; nobody merges from it.
