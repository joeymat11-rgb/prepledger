# M2-S4-REAL-DAY — the shipped page boots on the real day, on a moving clock

v1.0. Lane B, ENGINE-TIER PACKAGE PROCESS, a child package of `M2-S3-COMPANION`
(`rebuild/lanes/b/tooling/b-package.cjs`), product size S. Parent artifact
`rebuild/m4/spec/acceptance-s3-companion.json`.

## 1. Why

The owner ruled at `DECISIONS:432` that Joe logs FRESH DAILY from now: "I start
using Earned fresh, with new logs, the day P0 merges." The PM's finding of
2026-09-16 is that the shipped page does not let him. `today-entry.mjs` `boot()`
with no arguments — which is exactly how the page starts itself — resolved its
day to `TodayModel.SYNTHETIC_DAY`, the frozen preview day, and every host it
opened was handed a clock pinned to one instant: `13:00Z`, offset `-05:00`, hour
8, `monotonicMs` 0 (`rebuild/m3/w6/local/today-bindings.mjs:160-170`). So a
weigh-in taken this morning is stamped on the preview day at 08:00 local, a
session left open overnight is still yesterday's in the morning, and the
installation's own first-run operation carries an offset that is simply wrong for
seven months of the year.

That last one is not cosmetic. P2's author stopped on it and said so in terms in
`rebuild/m3/w6/test/local-source-consumer.test.mjs`: an EDT day "would make
admission refuse the installation's own setup operation with
`LOCAL_SOURCE_CONTEXT_UNRESOLVED`, which is the pinned binding talking and not
this import", and P2 chose a WINTER day (2026-11-20) to get around it.
`rebuild/m3/w6/local/source-admission.mjs` compares the op's recorded
`utc_offset` against the offset the engine context reports for that instant; a
constant `-05:00` fails that comparison on every summer day.

## 2. What changes

1. **The real day.** `boot()` with no declared day resolves today from THIS
   DEVICE'S own local calendar date (`YYYY-MM-DD`, from `Date`, in the device's
   own zone — the America/New_York rule is "whatever zone the device is in") and
   hands every host it opens a MOVING clock: real `now()`, the real civil offset
   for that instant, `monotonicMs` from `performance.now`, and the real local
   hour for the engine reader.
2. **Midnight.** While the app stays open the day is re-read — on every
   visibility change and on a slow tick — and when the calendar date has moved
   the page re-opens itself on the new day. No stale "today".
3. **Real stamps.** Weigh-ins, sets, check-ins and nights are stamped with the
   instant they happened and the offset in force then. The September admission
   case above now passes; it is executed both ways in the cells.
4. **Nothing else.** A caller that DECLARES its day — `options.today`, or its own
   injected clock — keeps the frozen behaviour byte for byte. Every existing
   fixture cell is unchanged, and the cells prove it against the tip's own bytes
   rather than against a restatement of them.

## 3. Custody — the diff, by site

| File | Role | What moves |
| --- | --- | --- |
| `rebuild/m3/w6/local/today-bindings.mjs` | edited (parent product pin) | `localDayOf` / `localOffsetOf` exported; `clientClockFor(day, live)` and `engineClockFor(day, live)` take an optional live instant provider and are byte-identical without it; `liveEraClock`; `openTodayOverLocalEra` / `buildEra` / `openTodayInstallation` thread `live` to all five host clock sites; `liveClockOver(state, live)`. |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | new (not parent-pinned) | `boot()` resolves `today` and `live` from the device when no day is declared; the four `day \|\| SYNTHETIC_DAY` sites become the one resolved `today`; `watchDayRollover` exported; the return adds `today`, `live`, `rollover`. The `SETUP_BASIS_STATE_REFUSED` guard is untouched. |
| `rebuild/m3/w7-preview/today/gym-host.mjs` | new | `openTodayHosts` forwards `live`; re-exports `localDayOf` / `localOffsetOf` from the local era so there is one copy in the tree. |
| `rebuild/m3/w7-preview/today/reading-host.mjs` | new | `createReadingHost` forwards `live`. |
| `rebuild/m3/w6/test/local-real-day.test.mjs` | new | This package's own cells (section 4). |
| `rebuild/m3/w6/test/local-today-journey.test.mjs` | edited (parent product pin) | `PAGE_PINS` re-pinned for the three page files that moved; `CHILD_SPECS` / `declaredPostIn` exported. |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | edited (parent product pin) | The two B-NTC re-pin cells read the DECLARING-SPEC CHAIN (`['H3','S3','S4']`, youngest first) in place of the single `packages/S3.json` read S3 installed. The guard is unchanged. |
| `rebuild/m3/w7-preview/today/test/food.test.mjs` | new | `N1.18`'s two "did anybody move it" halves read the same chain. |
| `rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs` | new | `S10`'s two halves read the same chain. |
| `rebuild/m3/w7-preview/today/test/problem.test.mjs` | new | `N2-08`'s `today-bindings.mjs` half reads the same chain. |
| `.github/workflows/rebuild.yml` | edited (parent product pin) | The package step moves `--package S3` to `--package S4`, as S3 moved it from H3. |
| `rebuild/lanes/b/tooling/b-package.cjs` | edited (parent product pin) | `S4` added to `IDS` (after `S3`) and to `NO_REGISTER_IDS` (the S- half, as S3). No rule moves. |
| `rebuild/lanes/b/tooling/packages/S3.json` | superseded-by-child (parent EXECUTION pin) | `tooling.runnerSha256` re-pinned onto the S4 runner, as S3 re-pinned `H3.json`. |
| `rebuild/lanes/b/tooling/packages/S4.json`, `rebuild/m4/spec/acceptance-s4-real-day.json`, this brief, the author report | new files, not product | The package itself. |

**Nothing under `rebuild/engine` moves.** All 20 engine files the parent pins are
carried at the parent's post, byte-identical on disk.

### 3.1 Why the four lane-C guard cells are amended, and why that is not a weakening

Four cells on this branch ask, of `rebuild/m3/w6/local/today-bindings.mjs` and
`rebuild/m3/w6/test/local-today-journey.test.mjs`, "does this file still stand at
the byte the merged B-NTC artifact pins". S4 moves both, by name and on purpose.
`DECISIONS:144`'s rule is that a package may not touch a B-NTC pin it has not
DECLARED — and H3 wrote the licence for exactly this case (`BRIEF-H3-CLEAN-INIT`
§164): the cell reads the child's own spec, and a file is exempt only while it
stands at the post-image THAT SPEC DECLARES. S3 re-pointed the read at
`packages/S3.json`. S4 makes it a CHAIN — `['H3','S3','S4']`, searched youngest
first — so a grandchild need not restate its ancestors' declarations.

An undeclared move, a declared move that has not landed, and drift in a file no
spec names are all still red. With no such spec on the branch the exemption set
is empty and every one of the four is the original cell.

### 3.2 Why S4 declares NO gate supersession

`DECISIONS:153` retires a byte-identity carrier for a child "whose accepted brief
changes engine bytes", because those five gates RECONSTRUCT `rebuild/engine` from
a frozen BASE plus a sha-pinned carrier list and a moved engine byte is not in
that list. **S4 moves no engine byte.** So there is nothing to retire, no
`GATE-SUPERSESSION` token line is needed or claimed, `coverage.superseded` is
`null`, and `coverage.inherited` is the parent's own `coverage.byChild` map
byte-for-byte — which S3's sealed artifact leaves empty, so the nineteen gates
re-execute under `--full` exactly as they did for S3. This is the runner's
ordinary path for a child that changes only screen files; it needs no new rule
and none is added.

## 4. The bar — what has to be true before this is accepted

| # | The claim | How it is measured |
| --- | --- | --- |
| 1 | With no options the booted model's `today` IS the device's calendar date at boot | `S4/3`, over the real `boot()` on a real store, with and without an injected instant |
| 2 | The hosts' clocks MOVE: two reads differ | `S4/3`, reading `live()` twice across a real delay, beside the frozen clock asked twice |
| 3 | The offset is the device's offset FOR THAT INSTANT, EST and EDT alike | `S4/1`, on two instants 231 days apart, against the local calendar accessors |
| 4 | The day turns over at LOCAL midnight | `S4/1`, one minute either side of 00:00 local |
| 5 | Midnight with the app open re-opens the page ONCE, and never before | `S4/4`, driving `watchDayRollover` on a chosen instant |
| 6 | With `options.today` the behaviour is byte-identical to the tip | `S4/2`, a differential against the tip's OWN clock literals read out of Git at `sourceBase`; `S4/6`, the recorded triple `{local_date, 08:00, -05:00}` |
| 7 | The September admission case passes under a real-offset clock | `S4/5`, the `source-admission.mjs` offset predicate over a real first-run op |
| 8 | And was RED before | `S4/5 RED FIRST`, the same op written under the frozen clock |
| 9 | P0-B / P0-C cells still green, including P0B.12 (no fixture figure on an enrolled first frame) | the `today-13` child, all thirteen today suites by name |
| 10 | No engine byte moves | the product inventory: 20 engine files carried, 0 unlisted drift |
| 11 | No law, guard or test is weakened | every amended cell states its rule and its red side; no assertion is removed |

## 5. Runs

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S4` at the head, plus
the thirteen today files by name, the W6 suite, A0, the coach suite, A1/A5 and
`rig187`. The `--full` run with the private census is the PM's.

**Predicted pre-ruling stop, exactly.** This brief is not yet accepted by name,
so `brief.acceptedLedgerLine` is `null` and `authorizations.theme` is `null`.
Both are CI-BLOCKING open obligations, so `--ci --package S4` runs every piece of
evidence — product inventory, parent and grandparent pin re-assertion, the 45-law
baseline, every declared child, the Y1 own-child rule, coverage — and then stops,
by design, at:

```
B PACKAGE S4 OPEN theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)
B PACKAGE S4 OPEN brief rebuild/lanes/b/S4-REAL-DAY-BRIEF.md not accepted by a PM ledger line
B PACKAGE S4 CI REVIEW-PENDING: 2 open obligation(s); public evidence only; no PASS is claimed
```

exit 2. That is the whole refusal and there is no other. `PUBLIC CI EVIDENCE PASS`
becomes available the moment the PM's two lines stand on the chain branch and the
spec cites them; nothing in the code or the cells changes to get there. This is
the same state `packages/H3.json` stood in at `H3-REVIEW-r2` ("These two fields
are the only reason the run says `2 open obligation(s)`").

## 6. The two citation lines, drafted for the PM (`DECISIONS:135 (2)` shape)

The PM appends these to `rebuild/DECISIONS.md` once the brief is accepted by
name. The sha256 below is a PLACEHOLDER: it is the sha256 of the accepted bytes
of this file, and the PM substitutes the measured value when appending.

THEME:

```
- 2026-09-16 · cowork · THEME M2-S4-REAL-DAY — the shipped page boots on the REAL local calendar date and a MOVING clock, rolls over at local midnight, and stamps every record with the real instant and the real civil offset (the fix P2 stopped on: a fixed -05:00 made September admission refuse the installation's own setup op, LOCAL_SOURCE_CONTEXT_UNRESOLVED). Owner ruling DECISIONS:432 (Joe logs fresh daily from now); PM finding 2026-09-16. Its behaviour/delta contract is rebuild/lanes/b/S4-REAL-DAY-BRIEF.md; its parent is M2-S3-COMPANION, rebuild/m4/spec/acceptance-s3-companion.json sha256 fb2f6a023ac6bcfc584c115078b16fb8ec21eba3a71c1c231c573d52dbab74f2 (receipt DECISIONS:423). This child changes NO byte under rebuild/engine, so it supersedes NO byte-identity carrier and needs no GATE-SUPERSESSION token. This line is the THEME citation the seal runner requires; it authorises no PASS word by itself · ACCEPTED
```

BRIEF-BY-SHA:

```
- 2026-09-16 · cowork · BRIEF ACCEPTED BY SHA for M2-S4-REAL-DAY: rebuild/lanes/b/S4-REAL-DAY-BRIEF.md, sha256 <64-hex placeholder, the accepted bytes of this file> (<n> bytes), is the brief of record; this line carries the binding sha256 and is the citation brief.acceptedLedgerLine cites · ACCEPTED
```

No `GATE-SUPERSESSION` line is requested, and none may be written for this
package: it would name a carrier this package has no cause to retire.
