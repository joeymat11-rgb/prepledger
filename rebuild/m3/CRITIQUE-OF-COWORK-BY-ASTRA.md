# M3-PLAN TEST — critique by ASTRA

Reviewed integration base `8d573d1`. `C:L` means line L of `PLAN-COWORK.md`; `A:L` means `PLAN-ASTRA.md` at `045895b` (PR #13).
`R:L` means line L of `rebuild/conform/gates/inputs/EARNED-RUNTIME-SHEET-v1.7.38.txt`. Other repository paths below are relative to the root.
Seal verified: SHA256 `c4ba1be74f70f5f853f034e71060112d10a4f13116168baa7179f16d28d7fea0` — MATCH.
Sections A–E were completed before reading cowork's critique of ASTRA. This is not a neutral staffing assessment: I authored the competing plan. Three same-family agents assisted with bounded evidence checks; they are not the independent milestone reviewer.
Evidence: repository inspection, current primary vendor documentation, two synthetic in-memory probes of the unchanged code. No private records, live services, device tests or spending tests were accessed/executed. Both plans describe future work, not passed rigs.

## A. Where cowork's plan is WRONG

1. **The fallback changes what M3 means.** C:69 says “M3 closes on synthetic data”; C:71–72 removes the port from the critical path. Yet C:14–16 itself requires the owner's port, and `rebuild/ROADMAP.md:71–75` makes his ported data part of M3's definition of done.
   C:69 does reserve an owner ruling, which is legitimate. That ruling would have to amend the milestone and record its unmet gates; without it, the synthetic demonstration is useful progress with M3 still open. A dependency cannot leave the completion path merely because it may be late.

2. **The proposed public key is incompatible with the existing signer.** C:105–106 says “dispositions verify with the PUBLISHED authority key.” `rebuild/authority/crypto.cjs:26–40` and `rebuild/client/ops.cjs:81` sign and verify with the same HMAC material.
   Executed `PUBLIC-HMAC WITNESS PASS`: invented verification material also signed a fabricated ACCEPTED disposition; a separate client probe stored it and drained its outbox. This is a synthetic demonstration, not an actual exposed key. Assign the public-signature implementation, client verifier change and historical-key tests before publishing verification material; C:39–41 does not assign that transition.

3. **The client needs an asynchronous bridge too.** C:42 promises “T2's backend interface on IndexedDB with ONE transaction per commit.” `rebuild/client/store.cjs:68–76` returns success without awaiting `commit`; `rebuild/client/index.cjs:144–148` then publishes the model and says Saved.
   Executed `ASYNC-BRIDGE WITNESS PASS`: an unresolved commit Promise produced store success while durable=false. Stage a candidate client state and publish/acknowledge only after IndexedDB completion, with rollback on abort. C:119–120's single-blob journal alternative still needs this bridge; changing the storage format does not fix early acknowledgment.

4. **Time Travel cannot perform the named restore.** C:55–56 specifies “D1 Time Travel restore into `earned-us-restore`”; C:19 and C:109 require the isolated copy to reproduce the source log.
   Cloudflare's [Time Travel documentation](https://developers.cloudflare.com/d1/reference/time-travel/) says restore overwrites the selected database in place and cloning/forking is not yet supported. Use a recorded export/checkpoint and [import into a separate database](https://developers.cloudflare.com/d1/best-practices/import-export-data/); exercise Time Travel only within an already isolated test database. Do not rewind the live database to manufacture the rehearsal.

5. **Sign-out is state 17, not state 18.** C:54 says “sign-out never deletes the local store (state 18 path instead).” R:597–603 assigns known sign-out/revocation/closed-account/unavailable-decryption to state 17: refuse new writes, retain entered values, name recovery, and follow the recovery/erasure contract for existing material.
   State 18 is missing/evicted/corrupt storage (R:604–607); mere session expiry is state 11 and can allow valid leased logging (R:542–544). The Clerk binding needs those distinct cases. A blanket retain-store rule cannot replace the ratified recovery/erasure contract.

6. **The operational completion list does not close F2.** C:55 labels drills “last week”; C:70 orders “W5 ... W8 drills.” C:57 names signing-key rotation and reinstall, while C:115 defers “payload encryption at rest beyond D1's own (M5).”
   `rebuild/audit/REPORT-PROCESS-1-ASTRA.md:24–25` requires synthetic isolation/restore, approved loss/time objectives, account recovery, rollback and privacy-safe error/version telemetry before the private port. C:84 correctly puts rollback before import, but does not establish that ordering for the other gates. Measuring RPO/RTO is not agreeing acceptable objectives; reinstall is not lost-account recovery; suppressing health logs is not observed error delivery.
   R:102–105,201–202,640–643 also require a declared payload/identity-key and local sealing/recovery contract. D1 disk encryption alone does not demonstrate it. Assign that mapping and tests now, add missing done-lines, and make their synthetic PASS a dependency of private import. The lower estimate otherwise prices a smaller acceptance scope.

7. **The native trigger is narrowed and device cases disappear.** C:115 says “App Store / native (only if C3 fails)”; R:660 triggers native on failure of any C-row or an unmet later automatic-source need.
   C:44–45's headless-WebKit/table checks are useful preliminary tests, but R:631,654–659 requires the installed target phone, including reboot, restored state, late arrival and sequence exhaustion. C8's one-hour killed-session recovery and C9's low-storage refusal (R:649–652) have no named acceptance case. Test those through a harness without shipping Gym UI; map every C-row to an actual-device verdict.

8. **The production sign-in click-list cannot be followed as written on the ruled free tier.** C:30 specifies “Clerk application (free) with email + passkey”; C:98 repeats passkeys. Clerk's [passkey requirements](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#passkeys) require a paid production plan.
   C:121 already offers email-code fallback: select that before sending the list, rather than discovering it after setup. The [production setup](https://clerk.com/docs/guides/development/deployment/production) also needs an owned domain and DNS configuration, absent from C:93–102. Add production activation and any domain-cost decision; the synthetic soak can still use its separate preview origin.

9. **The location hint does not enforce the US ruling.** C:95 instructs “location hint: Western North America”; C:29 describes a “US location hint.” Cloudflare's [location guide](https://developers.cloudflare.com/d1/configuration/data-location/) expressly makes hints non-guaranteed.
   Current [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/d1/) and the [create API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/create/) document jurisdiction `us`. Specify that jurisdiction and verify the returned configuration on the intended account. My plan's guide-only treatment of US availability also needs correction (D4 below); neither author should substitute a hint for the ruling.

## B. Where cowork's plan is RIGHT and mine is weaker

1. **A dated decision beats an indefinite dependency.** C:67–70 gives the owner a week-one checkpoint. A:41 says what remains blocked and what can continue, but does not schedule that decision. Adopt cowork's checkpoint while preserving the real-port completion bar.

2. **Start the smallest valid soak first.** C:31–33 budgets a 3–4-hour seeded-store stub. My A:28–30 bundles an eight-hour clock/storage spike before the two-hour hosting step. F1 asks for the minimal installed experiment immediately. Split my extra clock investigation from the minimum safe seed/commit/integrity work so it does not delay the 30-day clock. Neither estimate is a demonstrated duration.

3. **Reuse is clearer in cowork's work packages.** C:37–45 explicitly connects the authority laws, ten-break test, restart test and HTTP interop to new boundaries. My A:77–94 names fuller acceptance cases without equally clear reuse mapping. Keep those existing assertions and add only the missing boundary cases; link the tracked restart rig and publish the missing HTTP/mutation entry points, as D2 notes.

4. **A second device provides a better visible round-trip proof.** C:8–13,105 sends phone A's entry to phone B. My A:85–86 exercises reconnect and reinstall but never expressly proves this simultaneous-device propagation. Add cowork's simple probe and assert the displayed fact as well as the frontier. This strengthens M3; it is not a claim that the roadmap required M4's whole multi-device feature now.

5. **His schedule is easier for the owner to scan.** C:67–70 fits day one, week one and week two into four lines, and C:93–102 names concrete owner actions. My acceptance table is more complete, but its long cells and jargon make it a poor daily task list. Use cowork's concise weekly presentation, corrected for accounts and gates, with my detailed checks behind it.

## C. Judgment disagreements, each with the reason

1. **Import mechanism:** C:47's synthetic import device is a reasonable possible provenance mechanism; “ACCEPTED” can mean admission rather than consent. I cannot infer that cowork intends to manufacture athlete consent. It still needs an explicit mapping: R:531–541 preserves derived guidance separately from accepted targets. Prefer my checkpoint/activation approach unless a smaller import implementation proves that mapping, idempotency and post-import rollback. Numeric parity alone cannot settle it.

2. **Revision scope:** C:35's `athlete_rev` could outperform my A:47 global revision. Neither name proves atomicity. `rebuild/authority/README.md:79–87`, `store.cjs:43–46` and `admit.cjs:88–102` include foreign ownership and waiting-work drain. Cowork must guard that full dependency set; my initial global serialization is simpler for this small slice but may be unnecessarily broad. Choose after a concurrent-invocation witness, not from the label.

3. **Soak observations and storage fallback:** C:22–23,110–111 wants integrity at the M3 checkpoint; C:100–101 says leave it alone for 30 days. Opening the idle origin at week two would restart the qualifying interval (`ROADMAP:68–70`). Use an off-device seed receipt for the checkpoint and a pinned, separate origin; if C:120 changes the storage implementation, start a qualifying soak for that implementation rather than carrying over the earlier result.

4. **Cost and duration:** C:123 honestly admits uncertainty about alert versus stop. [Cloudflare now documents alerts as informational, without a usage cap](https://developers.cloudflare.com/billing/manage/budget-alerts/). C:56,110's synthetic spending burst needs a bounded owner-approved allowance, not an unbounded attempt to make email arrive. Likewise, 55–75 versus my 98 hours compares different explicit gates, not demonstrated team speed; re-estimate one agreed scope after the two bridge spikes.

## D. Errors or unverifiable claims (small)

1. C:62 says “56–75 agent-hours”; adding W1–W10 gives **55–75**, excluding the owner's 45 minutes. Several W-items omit dependencies, and C:67–68 assigns parallel Astra work without naming execution capacity. These weaken the calendar estimate, not the architecture.
2. C:37–45,105 should name exact runnable paths: rig187 exists at `rebuild/t2/rig187.cjs`, but no rig190/191 file is tracked on this base. Publish/reuse the actual HTTP and ten-break entry points. C:107's current `port-oracle.cjs check` takes an engine and labels and reads fixed fixture paths (`rebuild/conform/oracle/port-oracle.cjs:2–3,14,18–22`); add a private phone-export projection/comparison harness instead of suggesting that CLI already accepts arbitrary phone state. My proposed new runner is also unimplemented, explicitly so.
3. C:29's token scope and C:96's scope disagree (“Secrets” versus “Workers KV:Read”). Reconcile them and justify/remove KV access. Do not claim a missing separate Secrets permission: the [script-secret endpoint](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/secrets/methods/update/) accepts Workers Scripts Write. Dashboard wording and the 45-minute total remain untested.
4. **My own factual correction:** A:101 inferred no general US option from the narrative guide. The current CLI and create API cited in A9 document `us`; that earlier inference was too strong. Verify this supported path before asking the owner to weaken the US ruling. I have not created a database to establish this account's entitlement.
5. C:24–25,59–60's suite/CI list omits explicit SELFTEST and strict checks required by `ROADMAP:85–87`; keep the existing strict job and add the required rebuild job. The line “vs main” should pin the authorized frozen commit, not a moving reference. Neither plan's calendar or device claims are execution evidence.

## E. Bottom line for the owner

Adopt neither plan unchanged. Use my completion checks and recovery safeguards, with cowork's shorter weekly schedule and decision checkpoint.
Start cowork's small phone-storage experiment immediately; keep my separate, untouched test installation and full phone-test list.
Reuse existing tests and add his two-device demonstration. Correct sign-out, saving, key verification, restore and account setup before using your data.
If the engine is late, show a synthetic demonstration and keep M3 open unless you explicitly change its goal.
Correct my US-availability claim too; both plans need evidence, not deference to their author.
Cowork's task presentation is stronger; my coverage of completion risks is stronger. Neither document alone proves who should manage delivery.
Judge the manager on the first working slice: truthful progress, completed recovery drills, and how little chasing you have to do.

## Reply — after reading cowork's critique

Custody: A–E were committed as `10e99acdc5b1fa94f4db5db3e5047b8c2730562a` before I opened `CRITIQUE-OF-ASTRA-BY-COWORK.md`; this section alone was added afterwards.
- I agree with its A1–A4/A6 and its recommendation to combine stronger acceptance coverage with a simpler owner-facing schedule. Cowork's explicit admissions are useful evidence of accountable review.
- B2 is fair: my “nominated person” assumes staffing the owner has not offered. A clean second machine/account and an independently usable runbook can rehearse integrator continuity without requiring a new employee or model brand.
- B3/B5 are fair: give the owner concrete setup choices, move technical verification to the integrator, and reference any still-pending M1 decision without asking him to repeat a completed dad test.
- B4's synthetic milestone is useful and should be explicit. It is an intermediate demonstration; calling it completed M3 still requires changing the owner's ported-data requirement. My continued W1–W5 work never claimed to satisfy D3.
- I disagree with B1's claim that rotation/recovery are “M5-grade hardening in the ratified roadmap”: `ROADMAP:73–75` expressly adds them to M3, and audit F2 requires them before the private port. Keep the smallest tests that prove those obligations; broader launch hardening can wait. R:102–105/201 also requires the P1 key/payload contract to be resolved, not silently deferred.
- Both location discussions need the current documented `us` jurisdiction correction in A9/D4. Test that path before asking the owner to relax US residency; a mere location hint remains insufficient.
- My “then the separate ≥30-day experiment” wording is poor: §3 intends the soak to start immediately and run in parallel, not after operational acceptance. Rewrite that calendar sentence without weakening the real 30-day interval.
- No original A–E finding was revised after seeing the other critique. The owner still rules scope and staffing; neither our agreement nor our estimated hours proves delivery performance.
