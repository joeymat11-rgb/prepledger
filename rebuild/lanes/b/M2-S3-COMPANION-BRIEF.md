# BRIEF - M2-S3-COMPANION (v1.2)

Changelog: v1.1 added lane C's P0 HIS NUMBERS disclosed hunk (four files, commit 4eec4738); v1.2 withdraws it under DECISIONS:416 (a) - P0 leaves this package so it does not wait on the engine gate - and the custody below is v1.0's exactly, on the tip 47d31806 (docs-only moves :415/:416).

Lane B, engine tier. Package id `M2-S3-COMPANION`, runner id `S3`. Branch `rebuild/b-s3-companion`,
sourceBase `2ae28401d65453dc59c68a9a804e32dda44a8d83` (= `origin/rebuild/t2-client-core` at dispatch,
DECISIONS:415). Parent: `rebuild/m4/spec/acceptance-h3-clean-init.json`
sha256 `b457b539a384d8c72531b880cd771e996c6b231f034a49272e899c1fba61e61f` (receipt DECISIONS:187,
judgment :188, merged :189), reviewed commit `5f0c3781a227e18ffdf8236090fe2499ecd8782b`.

Authority: DECISIONS:414 (2) adopts `rebuild/lanes/pm/CRITICAL-PATH-2026-09-15.md` section 4 as PM
routing, whose P1 names this package, its three files and its acceptance bar verbatim; :415
dispatches it. The exact product contract is `rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md`
(D to PM, 2026-09-13), of which ONLY the B companion custody is this package: `rebuild/engine/merge.cjs`,
`rebuild/engine/today.cjs`, `rebuild/m4/workout/engine-runtime.cjs`, plus B-named companion tests,
registration and pins. The D parts (`rebuild/m4/import/**`, `rebuild/m3/w6/local/source-admission.mjs`,
the provider, profile and admission tests) are NOT this package and are not touched.

## 1. Custody

| File | Role | What |
| --- | --- | --- |
| `rebuild/engine/merge.cjs` | edited | `createMerge(E, { clock, nativeDate = Date })`; the five parse sites (`_corrOf`; `_fileCorr` twice; the `_richerSession` 3:2 rule `_mergeSession` reaches; `_adjInstant`) and the one constructor site (`_fileCorr`'s live +1 ms bump: `new nativeDate(nativeDate.parse(latest9) + 1).toISOString()`) go through the injected constructor. Default native, so every existing caller is byte-unchanged in behaviour. The `new Date()` at the v7.54.4 comment is commentary, not a call. `_sessionAtMs` stays numeric coercion. |
| `rebuild/engine/today.cjs` | edited | `genSession`'s exOrder / exActive / sort pool extracted verbatim into private `_sessionPool(s, dt)`; `genSession` keeps its day guard and its pickStructural -> active -> pool order and calls the helper at the pool step. New returned reader `sessionMembership(s, iso)`: `null` for the existing non-U/L predicate, else a fresh frozen `{ day, exercise_ids }` with the complete ordered pool ids. Reads no sleep, calls no structural picker, computes no target, aliases no exercise object. |
| `rebuild/m4/workout/engine-runtime.cjs` | edited | `sessionMembership: (s, iso) => E.sessionMembership(s, iso)` joins the frozen facade; `EXPOSED` / `COMPOSITION.exposed` 4 -> 5. Module exports unchanged (`createEngineRuntime`, `COMPOSITION`, `absentProvider`). No writer, seed, migration or merge becomes reachable. |
| `rebuild/m3/w6/host/engine-runtime-host.cjs` | edited (mirror) | The W6 host mirror of the runtime restates `EXPOSED` and the forwarders; `engine-equivalence.test.cjs` and `native-trend-context.test.cjs` assert the two agree name for name, so the mirror moves with the accepted runtime exactly as it did under M2-B-NTC (DECISIONS:109). This is the one file beyond the proposal's three and it is the precedent's own file. |
| `rebuild/m3/w6/host/test/journey.test.mjs` | edited (pins) | The two runtime sha pins and the exact EXPOSED list move to the S3 bytes and five names, as H3 moved them before. |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` | edited (pin) | The exact EXPOSED list on both runtimes: five names. |
| `.github/workflows/rebuild.yml` | edited | The standing cumulative step becomes `--ci --package S3`, succeeding H3's exactly as H3's succeeded B-NTC's (ce38aa3 precedent, H3 r3c). |
| `rebuild/lanes/b/tooling/b-package.cjs` | edited (H3 declared it a product, so the runner requires `edited`, not `superseded-by-child`) | `S3` registered in `IDS` and `NO_REGISTER_IDS` (S- = slice-plan item, DECISIONS:93); grandchild supersession (section 4). |
| `rebuild/lanes/b/tooling/packages/H3.json` | superseded-by-child | `tooling.runnerSha256` re-pinned onto the S3 runner, as H3 re-pinned B-NTC.json. |
| `rebuild/m4/workout/test/s3-companion-merge-native-date.test.cjs` | new | 9 cells, section 3. |
| `rebuild/m4/workout/test/s3-companion-membership.test.cjs` | new | 9 cells, section 3. |
| `rebuild/m4/workout/test/s3-companion-gensession-differential.test.cjs` | new | 3 cells, section 3. |
| `rebuild/m4/workout/test/s3-supersede-{source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate}.test.cjs` | new | one red-first cell file per superseded carrier, templated on H3's five (4 + 3 + 3 + 3 + 3 cells). |
| `rebuild/m4/workout/test/s3-engine-files-differential.cjs` | new | DECISIONS:153 (ii) named-files engine differential, templated on H3's. |
| `rebuild/lanes/b/tooling/test/{gate-supersession,pinned-unchanged-and-ruled-substitutions}.test.cjs`, `README.md` | tooling | The F6 id cell and two grandchild cells; the README section. |

Every other file H3 pins is carried byte-identical. No file under `rebuild/conform/private`, `src/history.js`,
`ledger/` or a protected soak path is read or written. No U+2013/U+2014 enters a user-facing string
(no UI string is touched at all). LF throughout.

## 2. Product diff, by site

`merge.cjs`: signature :4; `_corrOf` :87 (`nativeDate.parse(at)`); `_fileCorr` :172 (`nativeDate.parse(at)`) and
:188 (`new nativeDate(nativeDate.parse(latest9) + 1).toISOString()`); `_richerSession` :526
(`nativeDate.parse(c.at)`, the 3:2 rule); `_adjInstant` :576 (`nativeDate.parse(x.at)`). Live-only branch,
+1 ms, raw stamps, native coercion / NaN / invalid-Date RangeError and the existing `catch` preserved.
`today.cjs`: `_sessionPool` :68-74, `sessionMembership` :82-86, `genSession` :94 (`const pool = _sessionPool(s, dt);`),
export :654. `engine-runtime.cjs`: EXPOSED :40, facade :69. The inverse construction in
`s3-companion-gensession-differential.test.cjs` S3/GD-3 and `s3-supersede-source-carriers.test.cjs` S3/SUP-1/2
prove HEAD minus the declared hunks is the sourceBase byte for byte, both files.

## 3. Evidence, executed

* **Native-vs-injected equivalence** (`s3-companion-merge-native-date.test.cjs`, S3/MD-1..9): all five parse
  sites and the constructor, native vs a recording adapter that captures the real implementation; the
  offset-free March DST pair (`2026-03-08T02:30:00` in the skipped hour and `2026-03-08T03:30:00`, both
  landing on 07:30Z in America/New_York) beside explicit-offset controls; malformed / NaN fallbacks at every
  site; the live +1 ms boundary, off-live no-bump and later-act no-bump; the constructor on a malformed
  latest (native RangeError, caught by `_fileCorr`'s own catch, record unchanged); the default path never
  consults an adapter (poison control); read-only inputs; and a parent differential compiling the sourceBase
  merge.cjs privately: every vector and `mergeState` over diverged public replicas byte-identical.
* **Membership** (`s3-companion-membership.test.cjs`, S3/SM-1..9): reader ids equal the real
  `genSession(..., recordedFixtureSleep).ex` ids on the ordinary public fixture (`rebuild/m3/w7-preview/fixtures.cjs`)
  and on the pending-hack-debut construction (lower-day lift renamed `hack`, one queued debut) whether the
  recorded night lets the debut fire (8 h) or defers it (4 h); the journey clean-init athlete; ordering
  (exOrder, partial order, other-day order), retirement (retirements map, quarantined, all retired -> empty
  pool not null) and rest-day (null) controls; no sleep read and no structural picker call (throwing
  proxies on `sleep` and `queue`); frozen, fresh, ids only, state untouched; both runtimes expose the fifth
  name and forward the engine's own reader. `recordedFixtureSleep` is the engine's own `sleepInfo` over the
  fixture's recorded nights, never invented.
* **genSession byte-identical to the parent** (`s3-companion-gensession-differential.test.cjs`, S3/GD-1..3):
  the sourceBase today.cjs compiled privately over the same fifteen other modules; six fixtures x four days x
  three sleep readings, `genSession` and `pickStructural` JSON byte-identical (identical throws counted as
  identical); the member sets differ by exactly `sessionMembership`; inverse construction.
* **Supersession evidence** (section 4): five red-first cell files, the engine-files differential
  (27 tracked `rebuild/engine` files outside the product, byte-identical to the parent), the legacy
  differential (`a0-journeys`), the writers differential (`today-suites`), the provider cells and H3's own cells.

## 4. Gate supersession: the five byte-identity carriers, exactly as H3, plus one tooling fact

The five NATIVE-CARRIERS carriers (`source-carriers`, `inherited-carriers`, `defect-witnesses`,
`writers-differential`, `second-gate`) reconstruct `rebuild/engine` from a frozen BASE plus a sha-pinned
carrier list and assert every path the parent spec declares at the parent post. S3 changes two engine
files, so no substitution can carry them (DECISIONS:113 (1) (c), :147; the wall H3 measured in
BRIEF-H3-CLEAN-INIT section 9). Under the standing role DECISIONS:153, `packages/S3.json` declares the five
SUPERSEDED with one red-first cell per carrier, the runner's own clean census line, the legacy and writers
differentials and the named-files engine differential, in H3's exact shape. The nine gates they retire are
the nine H3 retired (`migrate-source`, `merge-source`, `writers-source`; `witnesses-2`, `witnesses-5`,
`migrate-differential`; `witnesses-7`; `writers-differential`; `second-gate`); the other ten re-execute under
`--full` on the PC with the private census.

**The tooling fact.** The runner derived a parent's carriers from its artifact's `coverage.byChild` alone.
H3's artifact carries `byChild: {}` (it covered nothing; it retired nine and re-ran ten), so a child of H3
refused `GATE-SUPERSESSION-CARRIER-IS-NOT-A-PARENT-CARRIER` on all five and its `--full` would have re-run
the nine reconstructions. `:153` promises every later package - all children of H3 - its own token line
"under the same conditions", so the runner now reads the parent's own `coverage.supersededByCarrier` as the
second half of its carrier map (`parentCarrierGates`): a carrier the parent retired may be retired again by
the child under the child's OWN token line and OWN evidence; nothing else is inherited; the terminal says so
per carrier. Two new cells in `gate-supersession.test.cjs` measure it; README section "S3".

**The token line this package needs, and cannot write.** Under the r10b N1 shape, alone in its own `·` clause,
on a RULED line on `origin/rebuild/t2-client-core`:

    GATE-SUPERSESSION M2-S3-COMPANION source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate

`coverage.superseded.rulingLineSha256` is the placeholder `null` until it lands; `--ci` refuses
`GATE-SUPERSESSION-RULING-NOT-CITED` by name until then, which is the runner's documented pre-ruling state.

## 5. The bar (CRITICAL-PATH-2026-09-15 section 4 P1, verbatim items -> where each is met)

1. Brief accepted by sha as a ledger line - this file; the PM's line (`:135 (2)` shape, bare `· cowork ·` role).
2. Closed cumulative profile `rebuild/m4/spec/acceptance-s3-companion.json` with H3's artifact as immutable
   parent - written from the runner's own `proposed()` after the spec is committed; `review-s3-companion.json`
   PENDING until the PM's receipt.
3. Five carriers SUPERSEDED under the :153/:160 token - section 4; S3's own token line pending.
4. 45/45 laws executed, no new D-id - `dIds: []`, Y1 own-child rule; the laws run needs esbuild 0.28.1
   (`Reference.create`), see the author report for where it could and could not execute.
5. `genSession` byte-identical to the parent on the ordinary and pending-hack-debut fixtures - S3/GD-1.
6. Native-vs-injected Date equivalence incl. the March DST pair, malformed/NaN and +1 ms - S3/MD-1..9.
7. Membership vs `genSession(..., recordedFixtureSleep).ex` ids, ordering/retirement/rest-day controls - S3/SM-1..9.
8. `--ci --package S3` PUBLIC CI EVIDENCE PASS exit 0 in the cloud; `--full --package S3` POSTFIX PACKAGE PASS on
   the PC with the private census - the author report records exactly what each printed and why.
9. Existing suites unchanged-green - the author report, baseline vs after.

## 6. Ledger lines drafted for the PM (never appended by this lane; :135 (2) applies after acceptance by name)

THEME (bare cowork role, ends `· ACCEPTED`, names the package id):

    - 2026-09-15 · cowork · THEME M2-S3-COMPANION — the S3 companion capability (createMerge nativeDate seam, sessionMembership reader, runtime EXPOSED 4->5), CRITICAL-PATH-2026-09-15 section 4 P1 adopted at DECISIONS:414 (2). Its behaviour/delta contract is rebuild/lanes/b/M2-S3-COMPANION-BRIEF.md; its parent is M2-H3-CLEAN-INIT, rebuild/m4/spec/acceptance-h3-clean-init.json sha256 b457b539a384d8c72531b880cd771e996c6b231f034a49272e899c1fba61e61f (receipt DECISIONS:187), whose five byte-identity carriers this child supersedes again under DECISIONS:153 and its own token clause. This line is the THEME citation the seal runner requires; it authorises no PASS word by itself · ACCEPTED

BRIEF-BY-SHA (the sha256 and byte count of this file as committed; see the author report):

    - 2026-09-15 · cowork · BRIEF ACCEPTED BY SHA for M2-S3-COMPANION: rebuild/lanes/b/M2-S3-COMPANION-BRIEF.md, sha256 <sha256> (<bytes> bytes), is the brief of record; this line carries the binding sha256 and is the citation brief.acceptedLedgerLine cites · ACCEPTED

TOKEN (alone in its own clause, RULED terminal):

    - 2026-09-15 · cowork (PM) · GATE-SUPERSESSION M2-S3-COMPANION source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate · the token clause for DECISIONS:153, same conditions (i)-(iii), for the child of M2-H3-CLEAN-INIT · RULED
