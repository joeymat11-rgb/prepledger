# EW2 ROUND 5 CELLS: WHAT THIS SPEC MEASURED, COMMITTED SO THE NEXT HAND RE-RUNS IT

These are THROWAWAY CELLS, not product and not the bar. They are committed here because the farm
scratch worktrees they were written in are ephemeral, and because every table in EW2-SPEC.md v5
that says MEASURED points at one of them by name. Nothing here is imported by any product file,
nothing here is registered in CI, and nothing here seals a bundle, opens a browser or needs the
real port. Every fixture is synthetic.

**They do not run from this directory.** Each one is a byte copy of a cell that ran from a lane
directory, so its relative imports resolve there and not here. To re-run one, copy it to the
directory named below and run it from the repository root.

| file | copy it to | run it as | sha256 |
|---|---|---|---|
| `r4b-capture-lift.mjs` | `rebuild/lanes/d/p3-real-shape/` | `node rebuild/lanes/d/p3-real-shape/r4b-capture-lift.mjs` | `5a5f820d8b42940de72e3cf956985ef0380dbccb3464e0336fceca4cdf4ba700` |
| `r5-support.mjs` | `rebuild/lanes/d/plan-edit/` | imported by the three below, never run alone | `1eccb3675afaa2c66ad7eab7ff69b2eb5f3532119c95621295e997ae732e6807` |
| `r5-idspace.mjs` | `rebuild/lanes/d/plan-edit/` | `node rebuild/lanes/d/plan-edit/r5-idspace.mjs` | `e3a0704354fff7f9b4a01fee105e5a588107c13385452129a3d1d8d46f9b7c82` |
| `r5-adoption.mjs` | `rebuild/lanes/d/plan-edit/` | `node rebuild/lanes/d/plan-edit/r5-adoption.mjs` | `f96bd4413045bf900de2926064f12395b980d4f10d6dc0f255c3c580449b81f0` |
| `r5-readday.mjs` | `rebuild/lanes/d/plan-edit/` | `node rebuild/lanes/d/plan-edit/r5-readday.mjs` | `4f61b23c5be6c72bb0df7e4c1e6e8a0024aae88e01d9e703dd19ad733be47e5b` |
| `r5-field-vocab.mjs` | `rebuild/lanes/d/plan-edit/` | `node rebuild/lanes/d/plan-edit/r5-field-vocab.mjs` | `a7ef71d281f76c5ed36238cf665eae04e8275ae2576a2d11daebecac872b0d9f` |
| `r5-fence-names.mjs` | anywhere | `node <path>/r5-fence-names.mjs <path to TODAY-SPLIT-SPEC.md>` | `d3098c87987d54f7ad45209f1a1ccc4fdac259c5b488ec9f21669326a00e53ce` |

Every run above took under three seconds. The environment they were measured in was
`MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York`, on Linux, at product head `70113da5`.

**WHICH CELL PROVES WHICH ROW OF THE SPEC.**

- `r4b-capture-lift.mjs` is REVIEW R4's own cell and is B1's evidence. It is kept unaltered. Section
  4.3 ruling 1 and section 12.6 both cite it, and `E-R21` makes it a named CONTROL on EW-17c.
- `r5-idspace.mjs` is `E-R16 PRIME` (a), (b), (c) and (d), on `variant(0)` and on `variant(7)`, at a
  capture date before and at a capture date on or after `starts_on`. Section 4.3's id-space table
  and EW-17c's rows are its output.
- `r5-adoption.mjs` is `E-R17 PRIME` (iii): the durable load count per adoption, instrumented, and
  the never-throws contract of both spellings of the read half. Section 3.4.4 and STOP 9 are its
  output.
- `r5-readday.mjs` is R4 N1: which day the adoption read is taken on. Section 3.4.4's clause and
  EW-13d's and EW-14's dates are its output.
- `r5-field-vocab.mjs` is R4 N4 turned from UNMEASURED into MEASURED: what the import screen draws
  for a `field` name its closed map has never seen. EW-20 is the cell written from it.
- `r5-fence-names.mjs` is `E-R22` (R4 B3): the MEMBER-name census of the released callback table
  against TODAY-SPLIT E.3's durable-writer word list. Section 6.8's fourth bullet is its output.

No U+2013 and no U+2014 appears in any file in this directory, counted rather than claimed.
