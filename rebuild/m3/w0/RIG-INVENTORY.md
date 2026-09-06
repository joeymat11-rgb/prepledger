# M3 rig inventory — W0 publication

Source: PLAN-M3-v1 §6 on `8fa4912093be7d7fdf9164343be0473d2127e042`; rules stay in the original sheet/plan/owner ledger. Paths below are repository-relative. Required verdicts are future acceptance criteria unless the W0 report states an executed result. A public/mock/model result cannot satisfy a different boundary.

## Existing assertions and their next boundary

| Existing source | Actual coverage now | Required reuse / owner |
|---|---|---|
| `rebuild/conform/laws/sheet-A-authority.cjs` — all 34 IDs in frozen manifest | Synchronous authority adapter/reference; identity, replay, sequence, ownership, dependencies, leases/revocation, plan/CAS/lineage, issuance/export/commitment | W5 `sheet-a-async` wrappers map every ID onto actual asynchronous D1/HTTP; 34/34 plus race/cuts. An environment variable is insufficient |
| `rebuild/conform/laws/sheet-B-client.cjs` — all 35 IDs | Synchronous client adapter/reference; B states, projection/consent/rejection/frontier and modeled durability | W6 browser/crypto/IDB wrappers; retain each applicable assertion and add missing real boundary/fault cases; W9 installed-phone execution |
| `rebuild/conform/laws/soak.cjs` — one ID | In-memory authority survival model | W2/SOAK-30 actual elapsed idle/pressure result; never count this one law as 30 days |
| `rebuild/conform/laws/d13-d14.cjs` 20 IDs and `progression.cjs` 9 IDs | Reference/mutants GREEN; corresponding product families absent and RED as specified | Later accepted M4 briefs implement product families. W0 requires their explicit absence; M4 must update the required-family inventory deliberately |
| `rebuild/t2/rig187.cjs` | Simulated backend restart after partial write; real client plus effective rollback mutation | W6 IDB-187 adds true asynchronous commit/abort/reopen; W9 target phone. Existing PASS is not IndexedDB proof |
| `rebuild/t3/interop-astra.cjs`, `verify-astra.cjs` | Memory transport/core interop and supplemental scenarios | W5 actual HTTP rig190 and asynchronous boundary assertions; 12 supplemental tests are not the ten mutation score |
| `rebuild/t3/RIGS-PREREGISTERED.md:9–18` | Specification of five interop cases and ten mutation families | W5 owns tracked `rebuild/m3/rigs/rig190.cjs`, `rig191.cjs`, shared `run.cjs`; TASK-W5 supplies exact gate |
| `rebuild/conform/rig185.cjs` | Frozen-engine W1/W2 progression witnesses; informational in old runner | W0 explicitly requires both PASS and no SKIPPED; still not new progression-family acceptance |
| `rebuild/engine/test/second-gate.mjs --candidate` | Original engine-test assertion sites, sync-laws and surface baseline on reference and extracted engine | W0 early CI reuses unchanged gate (3072 assertions each, 18 sync laws/59 seeds, baseline bytes); M2 fixes need their separately ruled v4 expectations |
| `rebuild/conform/oracle/port-oracle.cjs` | Full three-blob compatibility and sensitivity when private inputs prepared locally | W0 public staging invokes unchanged CLI on two public blobs; candidate check in both Date modes. Full 10/10 and private compatibility remain local gates |
| `rebuild/m3/clock-spike/test/*.test.mjs` | Accepted 39 model/core tests and red witnesses; no physical iPhone evidence | W6 bounded refinement must preserve witnesses/classify changed expectation separately; W9 real clock/standing cases |
| `rebuild/m3/soak-stub/test/` and SOAK-1 | Atomic seed/reopen/tamper tests and recorded physical seed | Do not edit seeded code or reopen its origin; final SOAK-30 is timed physical evidence |
| `rebuild/conform/gates/gates.json`, coverage manifest | Hash/count/clock checks of archived model evidence and coverage declarations | W0 revalidates metadata; no claim those archived rigs were rerun or bound to new product |

## Done-line coverage: exact implementation versus acceptance

| Done-line / case | Owner and environment | Required verdict / missing boundary |
|---|---|---|
| D0 SCOPE-FREEZE | A early CI; I actual release | Frozen paths + public laws/oracle/second gate + strict; full unchanged local suite/selftest; actual uploaded old/new archive and final required implementations. W0 reports SCOPE-FREEZE PENDING |
| D1 US-CONFIG | I, intended remote account | US-CONFIG PASS from actual database configuration; W4 not yet observed |
| D1 AUTH-D1 | A W5 local D1 then I/W5 synthetic remote | 34/34 mapped laws GREEN, ten effective breaks locally; race 100 independent invocations including ownership changes/waiting drain; remote isolation/crash/replay evidence |
| D1/D3/D4 HTTP-190 | A W5, real local HTTP then HTTPS | 5/5 two same-athlete devices/separate athlete/forged verifier/replay/lost acknowledgement; C6 request-loss and post-commit reply-loss cuts |
| D2 IDB-187/MIGRATE | A W6 then W9 installed iPhone | Atomic durable save, abort/restart, quota, schema/key migration and authenticated-rejection fence before paint; full bytes and all material returned |
| D2 STANDING/CLOCK | A W6/W9 physical target | 17 versus 11 and 18; last/first time AND sequence; bounded restart policy only after refinement; skew/rollback/forward/DST/TZ/restore/kill/reboot/late arrival |
| D2 SESSION-RESUME | A W9 physical harness | Exact session/set/outbox after at least one real hour and kill; draft follows declared mechanism; no Gym UI added |
| I1/D3/D4 SYNTHETIC-TODAY/OWNER-TODAY/PHONE-2 | A W7/W9; I W10b; owner two physical phones | Real authority/offline/one-effect replay, verified remote facts + derived basis, Today parity; owner mode after pre-port gates; early W7-PREVIEW is not this PASS |
| D3 PHONE-RESTORE | A/I, separate synthetic phone installation | Reinstall/resync exact import/history/commitments/frontier/plan provenance from real D1; failure 18; no uninstall of private/idle installation |
| D5 RESTORE | I W8, isolated environment | Restore encrypted export with keys, exact frontier/history replay, approved/measured loss/time; no live Time Travel rewind |
| D6 KEYS-RECOVERY | I W8 with W5/W6 | Old-key outstanding work/history still verify, recovered account/re-enrollment/standing; revoked access denied; phone has no authority private key |
| D7 IMPORT-ROLLBACK | A W7/I W8 synthetic; I W10b private | All interruption cuts, retries/idempotency, later accepted and pending work survives; source/consent provenance preserved; private parity verdict only |
| D8 TELEMETRY-COST | I W8 actual services | Privacy-safe error delivery observed; real threshold alert observed; bounded drill/remaining exposure recorded; test email is delivery-only |
| D9 HANDOFF | I W10a clean second machine/account | Independent scoped recovery, deploy/rollback/runbook completion; primary machine state unavailable; no extra employee assumption |
| D10 SOAK-30 | I/O, seeded physical origin | STARTED already recorded; final PASS only >=30 actual idle days + pressure + full seed/outbox/integrity survival; untouched until qualifying readback |

## Runtime §C crosswalk

| Row | Actual required case(s) |
|---|---|
| C1 offline launch/write | IDB-187 + CLOCK + SYNTHETIC/OWNER-TODAY; owner-ruled bounded restart refinement |
| C2 durable payload/outbox | IDB-187 before/during/after commit and reopened complete records |
| C3 idle/pressure | SOAK-30; only actual calendar/pressure/target evidence |
| C4 storage migration | MIGRATE schema/key/transaction fault cuts on installed target |
| C5 reinstall | PHONE-RESTORE on synthetic installation with remotely durable history |
| C6 lossy transport | HTTP-190 both cuts, then physical Today/PHONE-2 |
| C7 accessibility | W9 VoiceOver + 200% text + 16px inputs/fixed-chrome behavior |
| C8 session lifecycle | SESSION-RESUME with one real hour; harness instead of Gym product UI |
| C9 low storage | IDB-187 quota refusal, state 3, typed value retained, no ghost Saved |
| C10 cold paint | W9 ten physical cold starts, each truthful paint <=2 seconds |
| C11 leases/clock | CLOCK/STANDING + real late-arrival/revocation tests; exact bounded refinement pending |

## Failure evidence and ordering

W5 rig191 must actually expose each broken behavior: extra replay append; accepted identity collision; sequence reuse; foreign reference; rejected-parent endless wait; lexical lineage order; stale basis apply; unsigned disposition; unpinned export; ignored local lease expiry. Mutation loading or a thrown harness error earns no effective break. Keep fixture meaning against the sheet, not only law names.

The full local runner/selftest must remain unchanged and PASS. Public CI deliberately never manufactures its absent private fixture or rewrites manifest pins. Final SCOPE-FREEZE also requires actual new PWA packaging, deployment checks and real boundaries that do not exist at W0. The shared case runner must say BLOCKED/PENDING with exit 2 for absent remote/physical environments; this inventory is not an implementation of that runner.
