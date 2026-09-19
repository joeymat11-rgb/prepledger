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

---

# EW2 ROUND 6 CELLS: WHAT ANSWERED ASTRA'S BLIND REVIEW

Round 6 was told to take none of her thirteen findings unmeasured. These thirteen files are MY OWN,
written from scratch in a farm scratch worktree cut from `rebuild/d2-ew2-spec`; hers, on the PC at
`C:\Users\joeym\AppData\Local\Temp\astra-ew2-blind-f89ce33f`, were read as a guide and never run as
evidence. Every one of them exited 0, sequentially, one Node process at a time, under
`MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York`, in the same worktree where
`model.test.cjs` plus `durable-host.test.mjs` are **85 of 85 green** and `git status` shows no
tracked file modified.

**They do not run from this directory.** Copy them all to `rebuild/lanes/d/plan-edit/` and run each
from the repository root: `node rebuild/lanes/d/plan-edit/<file>`. `ew2r6-support.mjs` is imported
by the others and is never run alone; it is `r5-support.mjs` with ONE addition, a
`hooks.afterCommit` seam on the durable repository, which is what `ew2r6-w5-inflight.mjs` needs.

| file | what it proves | sha256 |
|---|---|---|
| `ew2r6-support.mjs` | support only | `779e9ee639147ff6572ee2be5294c59e0b187c10227990cd7d8470583c51868f` |
| `ew2r6-w1-import-identity.mjs` | **F1 / `E-R30`**: a saved edit does not cross the import boundary. Saved `sets=5`, imported raw `sets=2`, `PLAN_EDIT_TARGET_UNAVAILABLE` | `b5fbae410e540258d14e817e5f0da1a1bc22d6def6e6695db98472f9871e4131` |
| `ew2r6-w2-creation-owner.mjs` | **F2 / `E-R31`**: `E-R25`'s append plus the retained add is `PLAN_EDIT_ID_REUSED`, retired or not, with the no-append control green | `450dfcc5ae7d7a8e0ccbb72b1e09412637f76ca0a8cf774af138474a8ee7f626` |
| `ew2r6-w3-collision.mjs` | **F3 / `E-R32`**: both halves. Equal label onto an occupied handle is invisible to `idCollisions`; a folded rename of an established identity is a false collision | `baf53d97c780d5c041968da8629e254a9c5322b73d39a69b1aff9e3d7dd48c90` |
| `ew2r6-w4-pending-view.mjs` | **F6 / `E-R35`** the two dated views, and **F4 / `E-R33`** the stored `payload` being `null` | `7ab0de2ac6a63b30f97fb56c765b6fd8fb6250dbd8f5572468fef1070085bf0c` |
| `ew2r6-w5-inflight.mjs` | **F7 / `E-R36`**: `close()` and `cancel()` fired the instant the REAL durable commit returns. Both reply failure over a committed write | `86e8f1bd7a8f064e3a70b3f45b7f0820ca1f9a600f6463618d213e547980cc09` |
| `ew2r6-w6-f2-boundary.mjs` | **F8 / `E-R37`**: `SETUP_TAGS_INVALID` reaches the editor; a code-less throw lands on `PLAN_EDIT_READ_REFUSED` | `46cb9f01e41ce0c462ca23b92ad1184381e0151faa8104afd305c8fe3d48a1df` |
| `ew2r6-w6b-projector-latency.mjs` | **my own extension of F8, and the ground of 13.10's first disagreement**: `projectNewExerciseTags` is never called at review, and its throw IS contained at save | `30eb9ea60d2e652ddf9a2fbfadc041c022fa00fc71acb5ded06279d84ab6152b` |
| `ew2r6-w7-machine-note.mjs` | **F9 / `E-R38` F9** the double `draftFrom` blanking, and **duty 3's** whole-taxonomy head table, including that `chest` has no region at all | `bedeb31611253d0bbed4c978bf878f0f92b1e6e1a7abf9aa370a54b0dc1dfb56` |
| `ew2r6-proto-r30.cjs` | **the `E-R30` hunk itself**, applied to `plan-edit-model.cjs` AT RUN TIME and compiled under the product's own filename. It keeps no copy of a sealed module and refuses to run if either anchor has moved. Prints `HUNK_NET_LINES = 22` | `9c80e0fd9697eca2ac630a5bea03bb88b93c3e0e14af300f21e907cdbb83a5e2` |
| `ew2r6-p1b-j1-noHostBytes.mjs` | **JOURNEY J1 GREEN** under that hunk, driven through the real host, with the map absent as the negative control | `bf5230ecc197c1112de8a0b572d23fe5f7b0a82d9465ed80e898697efa48b812` |
| `ew2r6-p2-j2-prototype.mjs` | **JOURNEY J2 GREEN** under `E-R31`'s roster, with `PLAN_EDIT_ID_REUSED` asserted as a negative control | `03096575340b5d63320f2e6fd499288464c99d5c410e0d75fc9e1515de2216a1` |
| `ew2r6-p3-j3-prototype.mjs` | **JOURNEY J3 GREEN** under `E-R32`'s provider and two-sided rule, both of her witnesses in one file | `7707c053de269182c5384b407ad41100c742971e6ac4ccfb23b3b7fe852937d4` |

**WHAT NONE OF THEM DID.** No sealed bundle went through the real port: the farm cannot, and every
import here installs the PE16-style admitted-state fixture directly. No browser, no phone, no
Windows suspension, no full Today suite, no rig187, no conformance or private fixture, no protected
soak. 13.13 is the complete list and no sentence of section 13 claims past it.

No U+2013 and no U+2014 appears in any file in this directory, counted rather than claimed.
