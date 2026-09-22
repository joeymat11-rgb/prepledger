# S9 accepted-reference CI home

Status: STATIC WIRING COMPLETE. The reader itself was not executed or changed.

## Scope and custody
- Base: `5c62cb423848b72c260552dd1f425b2a31ca04c0`.
- Branch: `rebuild/b-s9-reference-home`.
- Owned paths: `.github/workflows/rebuild.yml` and this report only.
- Reader: `rebuild/lanes/c/ui-port/reference-closure.test.mjs`.
- Base reader Git blob: `bf967180e9add7cb42bf2cdeb8c9ebf73bfab469`.
- The reader's five tests and all product, runner, package, and pin files are unchanged.

## Red-first static witness
- Before the patch, the exact command occurred zero times.
- The read-only assertion refused with `S9-REFERENCE-HOME-MISSING`.
- No repository JavaScript or test module executed.

## Wiring
- Existing job: `public-gates`, matrix `ubuntu-latest` and `windows-latest`.
- Existing `actions/setup-node@v4` with Node 22 is reused.
- The new step sits between the design pack pin and release-object steps.
- It carries `if: ${{ !cancelled() }}` so preceding expected-red S9 steps cannot skip it.
- Exact command: `node --test rebuild/lanes/c/ui-port/reference-closure.test.mjs`.
- No glob, duplicate, skip, fallback, or `continue-on-error` is present.

## Green static witness
- The exact three-line step occurs once with the required condition and command.
- Workflow indentation keeps the step inside `public-gates.steps`.
- Runtime and CI conclusions remain pending independent review and actual runners.
