# S9 final pack and approved literal procedure

Status: STATIC proposal. No helper, repository module, test, or product edit ran in preparation.
Bound clean PRE_HEAD: `8a8f39227eddef224713c36d955c7bcb662938be`.
PRE_HEAD S9 spec SHA-256: `5c6d5f952da5a8d2b0a15a34b2202df10125163bbe0add987739c9e441ab1bb1`.
Pack test SHA-256: `0bf656950e277a1d25c2c79257c0b01c2ef44e1ef710b527b0bb2094e6c2d4ff`.
Approved test SHA-256: `231e7332b66d2b0e103d6cdbc367f471255dfbb2f5cd16e7ccf1abbc8c1b618b`.
Runtime design SHA-256: `9653bed81eaad9e166a55b436accd5344c0108464260b471c9a5e09ba2263f8d`.
Executed plain-copy SHA-256: `a9a675061f3bc9fa791fb724b8ef111aa2a0ae45c363afd1c13ff70f9d641a73`.
Existing pack helper SHA-256: `564579706ff25fb5b20614b59e8047d25e68e0a46d3731e44503c0a62634c984`.
The helper is sound for pack custody; only its expected-head constant is stale. Reuse it.

## Freeze and independently review before measurement
1. Require HEAD exactly `8a8f39227eddef224713c36d955c7bcb662938be`, empty
   `git status --porcelain=v1`, the bound S9 spec hash, and the three source hashes above.
2. Preserve the old pack helper/evidence. Make a PRE helper copy changing only expected head and output:
   use a fresh phase/head-qualified JSON path and `writeFileSync(..., { flag: "wx" })` so it refuses if
   the destination exists. Independently review those minimal deltas and the approved helper before use.
3. Approved helper: `%TEMP%/earned-s9-spec-proposal/S9-APPROVED-FINAL-MEASURE.cjs`.
   It evaluates only public `design.cjs` plus `plain-copy.cjs`, then reads the two runtime names.
   Review must confirm module-load effects, exact two 09-08 paths, bounded output, and no network/write.

## Measure at PRE_HEAD
4. Run `node %TEMP%/earned-s9-pack-working-preflight-PRE_HEAD.cjs`.
   Require exit 0, head PRE_HEAD, tree `3acba82531c863f0c3add26cbff7bdd2b3c2afef`, 1331 files,
   win32/linux each 6 screen PNG + 418 state PNG + both ENV.txt, and 419 shared state JSON records.
   Preserve its JSON and SHA-256. It holds exact component case, lstat/no-link, regular 100644 blobs,
   exact Git/working byte identity, byte-sorted relative paths, and only `quality/run/` plus
   `__pycache__` directory ignores.
5. Run `node %TEMP%/earned-s9-spec-proposal/S9-APPROVED-FINAL-MEASURE.cjs <repo> PRE_HEAD`.
   Pipe stdout to a distinct phase/head-qualified JSON using PowerShell `Out-File -NoClobber
   -Encoding utf8 -ErrorAction Stop`; then require native `$LASTEXITCODE -eq 0`. Preserve its SHA-256.
   Require exactly the two runtime
   `design.APPROVED` 09-08 paths; each must be exact-case, no-link, regular 100644, and Git=disk.

## Insert only two literal slots
6. Render pack rows as JSON strings `"<pack-relative path> <sha256>"`, retaining manifest byte order;
   replace only the empty placeholder comment inside pack LITERAL with rows; preserve every outside byte.
7. Render approved rows as JSON object entries `"<repository path>": "<sha256>"` in path-byte order;
   replace only its empty placeholder comment with rows; preserve outside bytes and never copy
   `design.APPROVED.sha256`.
8. Require `git diff --` to name only those two test files and only the two LITERAL bodies. Commit them.

## Rebind and prove the committed result
9. Record FINAL_HEAD. Make a separate FINAL helper copy with FINAL_HEAD, a distinct fresh output path,
   and the same exclusive `wx` write. Review it, run both helpers again; send approved stdout to its own
   FINAL/head-qualified `Out-File -NoClobber`. Require identical tree, names, rows, counts, and digests.
   Preserve PRE and FINAL artifacts independently.
10. Run the exact declared child command from repository root:
    `node --test --test-reporter=tap rebuild/lanes/c/ui-port/pack-pin.test.mjs rebuild/lanes/c/ui-port/approved-pin.test.mjs`
    Require exit 0 and TAP `ok` for both named `REAL ROW:` cases; retain the full summary and intrinsic
    platform skips without changing conditions. Then run the final package/CI procedure on both OSes.

## Dynamic effects and review boundary
- Pack helper reads Git and pack bytes and writes one TEMP JSON. Approved helper evaluates two public
  CommonJS modules, shells to read-only Git, reads four public files, and writes only via redirection.
- The two tests create/remove synthetic temp trees, exercise links, monkeypatch/restore fs helpers,
  and on Windows invoke `whoami.exe`/`icacls.exe` only on disposable ACL fixtures; failures may expose
  bounded subprocess/path text. Independent review must approve commands, helper hashes, literal-only
  diff, PRE/FINAL manifests, full TAP output, and exact-head both-OS CI before integration acceptance.
