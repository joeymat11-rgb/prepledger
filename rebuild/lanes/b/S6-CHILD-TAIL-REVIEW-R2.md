# S6-B CI-TODAY-CHILD-FLAKE DIAGNOSTICS -- independent review R2

VERDICT: REJECT

Reviewed sha 210a04c29ccbbc5726fb50054ffd8b3ccb2c9bf4 (branch rebuild/b-s6-child-tail),
over tip 0ac72eadf8cfe55c010af7f0d40034d133cdccba. Reviewer cells live outside the repo at
`%TEMP%\s6b-rv\rv.test.cjs` (RV1..RV17), compile the REAL runner and its mutants, no stub.
R1's four dispositions are all confirmed fixed. Two new defects, both proven, both cheap.

## R1 dispositions, verified

- R1.1 BLOCKING (TOOLING_FILES) -- FIXED. RV10 deepEquals the nine `*.test.cjs` on disk
  against the nine `TOOLING + '/test/...'` entries; green.
- R1.2 MAJOR (composed tails) -- FIXED. Every tail in the report reproduces here verbatim.
- R1.3 MINOR (m4/workout basis) -- FIXED, and the new claim is TRUE: RV11 reads every
  `.cjs/.mjs/.js` under `rebuild/m4/workout/test` and finds no `conform/private`,
  `golden`, `live.json` or `ledger/` line; `rebuild.yml` has no open step for that root
  (only the withheld line 127), so the corrected comment is the right basis.
- R1.4 MINOR (sha, drift list) -- FIXED. Drift list below matches byte for byte.

## Findings

1. BLOCKING -- `TAIL_DENYLIST` is separator-sensitive, so on Windows the content gate
   silently does nothing for any path the OS spelled with backslashes. Three of the four
   needles carry `/` (`conform/private`, `live.json` is neutral, `ledger/`). A public-root
   child that prints `path.join('rebuild','conform','private','census','rows.cjs')` --
   `rebuild\conform\private\census\rows.cjs` -- matches no needle, and its whole 60-line
   tail is printed into CI output. RV17 proves this live on this machine: the header reads
   `last 60 lines of stdout+stderr follow` and the private-looking path stands in the tail.
   Windows is the one OS the flake this ticket diagnoses actually fires on. The gate is
   defence in depth (the four public roots spell their probe paths with `/`, e.g.
   `today/test/package.test.cjs:170-177`, so nothing leaks TODAY), but a gate that cannot
   fire on the host OS is not a gate, and the ticket names this denylist as the guard. Fix,
   one line in `childDiagnosticTail()`, proven green by RV17's second half: scan
   `combined.replace(/\\/g, '/')` and keep printing the ORIGINAL lines.

2. MAJOR -- the author report is 110 lines; the ticket allows 60. RV15 is the one red
   reviewer cell. The overshoot came from R1.2 (verbatim tails), fair in itself, but 60 is
   a ticket constraint and the Stops section can carry a pointer instead of prose.

3. MAJOR (carry-forward, not the author's to land here) -- this branch reddens a PUBLIC
   `rebuild.yml` step, and the report's "clears at the S6 reseal" is only half true.
   today-17 (rebuild.yml:199) measures `pass 665 / fail 1` here; the refusal is
   `P-MEASURE (g)` at `measure/test/boundary.test.mjs:95`, actual
   `['rebuild/lanes/b/tooling/b-package.cjs']` vs expected `[]` -- caused by THIS branch's
   runner edit, green on the tip. That cell exempts a drifted S4 pin only when a DECLARING
   spec carries its post, and it reads a hardcoded `CHILD_SPECS = ['H3','S3','S4','S5']`
   (boundary.test.mjs:82). Authoring `packages/S6.json` alone will NOT clear it: the S6
   reseal must ALSO add `'S6'` to that lane-C list, in a file S5 itself pins. Nobody has
   recorded that. The author disclosed the red honestly; the missing half is recorded here.

4. MINOR -- `PUBLIC_TAIL_ROOTS` and `TAIL_DENYLIST` are pinned by no cell, while their
   wider sibling `CHILD_ROOTS` is deepEqualled element by element by F7
   (`pinned-unchanged-and-ruled-substitutions.test.cjs:295`). RV12 proves the gap is live:
   prepending `'rebuild/conform/v4/postfix/'` to `PUBLIC_TAIL_ROOTS` makes a postfix-root
   child's stdout print with every author cell and every F-cell still green (the only
   non-public root any cell probes is `rebuild/m4/spec/`). One `deepEqual` closes it.

5. MINOR -- when `r.error` is set (spawnSync timeout at 1800000 ms, ENOENT) `r.status` is
   `null`, so the header reads `DIAGNOSTIC exit null wall 1800004 ms`. A hung child is
   exactly the flake shape being chased, so that is the first sentence a human will read.

6. NOTE -- the brief's "client 18" measures 19 (`w7-preview/test/*.test.cjs`), green.

## What is right, and proven red-side

RV1 (`--full` carries no tail; dropping the `ci` guard prints one), RV2 (non-public root
withholds; widening to `CHILD_ROOTS` prints), RV3 (denylisted stdout withholds; dropping
the content gate prints), RV4 (the denylist scans the WHOLE stream, not only the 60 lines
it would print -- a needle on line 1 of 201 still withholds), RV5 (`every`, not `some`),
RV6 (wall on every OBSERVED line in `--ci`, none in `--full`), RV7 (the exact header the
ticket names), RV8 (static wiring: `children()` runs inside the one `try` whose `catch`
prints `error.diagnostic`, no intervening `catch` re-wraps it, and the tail prints AFTER
the FAIL line), RV13 (a denylisted path on STDERR withholds too -- both author cells only
cover stdout), RV14 (the tail is the LAST 60 lines), RV16 (no assertion removed: every
pre-existing tooling cell is byte-identical to the tip). No engine byte touched. LF only;
no en/em dash in any added user-facing string (b-package.cjs's 286 are old comments).

## Tails measured by this review

- reviewer cells `tests 17 / pass 16 / fail 1` (RV15); lane B tooling `96/96, fail 0`
- `b-package.cjs --ci --package S5`:
  `B PACKAGE S5 FAIL RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER; required evidence missing or failed; local diagnostics withheld`
- today-17: `276 + 369 + 20 = 665 pass, 1 fail` (finding 3)
- measure hermetic (model, adherence): `tests 11 / pass 11 / fail 0`
- W6 586: `586/586`; w6 host 3-file step `38/38`; host-seams `9/9`; coach `231/231`;
  slice/pwa 3 files `56/56`; client `19/19` -- all `fail 0`
- rig187: `rig187 PASS  -- SUITE GAP: both subjects are 35 GREEN under run.cjs`
- A1: `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client)`
- A5: `A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256`

## Drift list (`git diff --name-only 0ac72ea HEAD`, each findstr'd against packages/S5.json)

- `rebuild/lanes/b/tooling/b-package.cjs` -- IN S5.json, twice (`"runner"` and a product
  entry) plus `tooling.runnerSha256 fdf5f550...`; the expected SEAL FACT red.
- `rebuild/lanes/b/tooling/test/child-diagnostic-tail.test.cjs` -- no match in S5.json.
- `rebuild/lanes/b/S6-CHILD-TAIL-AUTHOR-REPORT.md` -- no match in S5.json.

Minimal. `rebuild.yml`, `today/**`, `m3/w6/**`, `m4/**` and `engine/**` are untouched.
