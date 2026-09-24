# S9 fence matrix correction: author evidence R3

- Branch `rebuild/c-s9-fence-matrix-fix`; pushed head `eebe74fa68c814ae383eff2b332459b6bc22c53b`.
- Immutable parent/red head `cbe5ed2edb209f04252be620a6dd3a44b5972220`; L2 head `77037d7` and its evidence are preserved but superseded.
- Scope from parent remains one changed file: `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`. Workflow/font job bytes are unchanged.

## Mechanism and R3 correction

- Parent row 32 counted every workflow `os:` line and failed when the valid font job added a second matrix.
- L2 bound each job, but PM proved a quoted direct `"runs-on"` or `'runs-on'` key could shadow the checked bare key and still pass.
- R3 recognizes only the required literal keys in their three YAML-equivalent spellings: bare, single quoted and double quoted.
- It counts every direct occurrence of job, strategy, matrix, os and runs-on before validating the required block/value shape.
- Both required jobs must own exactly one two-OS matrix and exactly one direct `${{ matrix.os }}` runner. The whole-workflow `|| true` refusal remains.
- Inline controls retain the original eight cases and add both quoted positive forms; paired shadow job/strategy/matrix/os/runs-on cases; inline/scalar shadow values; and quoted sibling boundaries while font stays valid.

## Evidence

- Immutable parent red / exact source-reversion witness: native exit 1; 53 tests, 52 pass, 1 fail, 0 skip. Parent TAP SHA `dce293c0bb32b0c593a3a7ef631c00602ea7d7461100560076a223e87395a992`.
- No separate post-fix removal run was performed; reverting the only source delta restores the immutable parent row and unchanged workflow.
- First R3 attempt `7e5e269`, PID `24100`, exited 1 before row registration due an author fixture string syntax error. It is retained as non-evidence: stdout SHA `dea241644ef16255a550b20560bc211c0f4ae5ecc63f7afb2d3c1616a1b98a33`, empty stderr.
- Final exact run: pinned Node 24.19.0, fixed TZ/date, head `eebe74f`, chain `c3cf7de647edd96ecbe472253082246850c8498a`, PID `9308`, exit 0.
- Result: 53 tests, 53 pass, 0 fail, 0 skip; genuine S9 real row passed; 39.344 s.
- stdout `%TEMP%/earned-s9-fence-fix-eebe74f.stdout.tap`, SHA `d3fc07265d21cf937b3dbfde263e822121f9d8ccddf1f0331eb6a4c9be740ebd`.
- stderr empty, SHA `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- Runtime released immediately at terminal exit; no protected/engine/private/old-source effect was added.
