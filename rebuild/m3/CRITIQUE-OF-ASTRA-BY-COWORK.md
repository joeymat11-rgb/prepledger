# M3-PLAN TEST — cowork's critique of PLAN-ASTRA.md (PR #13 @ 045895b), written after cowork's own plan was sealed (sha256 c4ba1be7…)

Method: every checkable claim in Astra's plan was checked against the repo or the cited vendor page; judgment calls are marked. Where
Astra's plan is right and mine is wrong, it says so here — the owner is choosing a project manager, and hiding that would be the
worst possible evidence about mine.

## A. Where Astra's plan is RIGHT and cowork's plan is WRONG or silent (checked)
A1. Shared-secret signatures. The T3 authority signs dispositions and leases with HMAC (rebuild/authority/crypto.cjs:12–14) and the T2
    client VERIFIES with the same `authorityKey` (rig190 passes it to createClient). On a real phone that means every device holds the
    authority's signing secret and could forge dispositions. Astra's §3.5 replaces it with a public-verification signature profile
    (P-256) at the authority's declared crypto boundary; the phone gets a verification key only. cowork's plan does not mention it at
    all. This is the single most important difference between the two plans. CONFIRMED by reading the code.
A2. D1 Time Travel restores IN PLACE. cowork's D5 says "restore into an ISOLATED database `earned-us-restore`" via Time Travel — that is
    not what Time Travel does (Astra §4.4, citing developers.cloudflare.com/d1/reference/time-travel). The isolated-restore drill needs
    export/import (Astra's RESTORE rig). CONFIRMED: cowork's plan is wrong on the mechanism.
A3. Cloudflare budget alerts do not stop spend. cowork's plan left this as an unknown (U4) to be resolved by a drill; Astra's plan
    resolves it from the billing docs and says the literal "$5 cap" cannot be satisfied without a provider-enforced option or a changed
    owner ruling. Astra's is the more useful answer: it tells the owner NOW that a ruling is needed. CONFIRMED (docs cited).
A4. Clerk production needs an owned domain with DNS access. cowork's plan has no domain anywhere; the click-list would have stalled
    on day 1. CONFIRMED (Clerk deployment docs, cited by Astra).
A5. D1 location hints are hints, not a US guarantee. cowork's click-list says "Western North America" as if that settled residency.
    Astra's plan asks the owner to rule whether a hint satisfies "US". Fair point; judgment on how much it matters for a two-person beta.
A6. State 17 vs state 11 precedence (sign-out / revocation / lost decryption refuses NEW writes even under a valid lease; mere session
    expiry pauses sync but permits leased logging). cowork's plan does not distinguish them. Astra's reading of sheet lines 542–544,
    597–604 is correct.
A7. Estimate honesty. Astra: 98 h + 30 % → 10–15 working days. cowork: 56–75 h, "2 weeks". Given A1–A4 add real work cowork did not
    plan, Astra's number is closer to true. cowork's plan under-estimated.

## B. Where cowork disagrees with Astra's plan (judgment, each with the reason)
B1. Scope inflation into M3: P1 payload encryption at rest (W4/W5), append-only key epochs and full rotation drills (KEYS-RECOVERY)
    are M5-grade hardening in the ratified roadmap. They are RIGHT to exist; putting them on M3's critical path delays the first honest
    "Today on the owner's phone" by weeks. Recommendation: A1's signature profile is M3 (it is a trust boundary the phone cannot ship
    without); payload encryption and rotation drills move to M4/M5 with the sheet's privacy contract as the gate.
B2. "Backup integrator = a nominated person". The owner has no team. The realistic backup is a SECOND MACHINE/ACCOUNT running the same
    runbook (a cloud Claude Code session or a clean laptop with scoped credentials), rehearsed once. Astra's HANDOFF rig is right; the
    staffing assumption is not.
B3. Readability for the owner. The plan is 105 lines of dense contract prose with rig names, ENV flags and state numbers. The owner
    has no coding background and must RULE on it. cowork's plan is not perfect either, but its click-list is six plain steps done on
    day 1; Astra's click-list step 2 asks the owner to "resolve the documented cap/US-location limitations" without saying what the two
    options are. A plan the owner cannot execute is a plan with a hidden dependency.
B4. Calendar honesty cuts both ways: Astra's "10–15 working days … then the separate ≥30-day experiment" is right, but its critical
    path (W1 → W4 → accepted M2 → W6 …) puts the M2 migrate/merge dependency ON the critical path, so M3 slips whenever M2 does. cowork's
    plan deliberately keeps the port OFF the critical path (stub port fallback at a week-1 checkpoint) so the skeleton walks on synthetic
    data even if M2 slips. Astra's §2 says W1–W5 continue when M2 is late, which is the same fallback in substance — but it is not
    reflected in its critical path or its done-lines (D3 requires the real port). Recommendation: make the synthetic-data skeleton an
    explicit intermediate milestone with its own done-line.
B5. The click-list asks the owner to "make the five-minute dad-test ruling already requested by M1" — true, but that is an M1 item,
    not an M3 setup step; mixing them makes the list longer than it needs to be.

## C. Errors or unverifiable claims in Astra's plan (small)
C1. "rebuild/m1 contains only the backend packet on this base" — correct on the repo; the mock is a published artifact outside the repo.
    Astra's fix (commit the mock's identifier/hash before W0 closes) is right and cowork's plan should have said it too.
C2. "D1 `enam` is not a US guarantee" — the cited page lists location hints; cowork could not find a stronger statement either way.
    Unverifiable beyond the docs; treated as a fair caution.
C3. §6's runner (`rebuild/m3/rigs/run.cjs --case … --env …`) is proposed, not built; the plan says so. Not an error, but a reader could
    mistake the table for existing rigs.

## D. Bottom line (cowork's own verdict on the two plans, before the owner's)
On substance Astra's plan is the stronger document: A1–A4 are real holes in cowork's plan, two of them (shared HMAC on the phone;
Time Travel not isolated) would have cost days if followed as written. cowork's plan is the more executable one for THIS owner and has
the better fallback structure (port off the critical path). The best M3 plan is Astra's substance with cowork's structure: adopt A1
into M3, defer B1's hardening to M4/M5, keep cowork's week-1 checkpoint and the synthetic-skeleton milestone, and rewrite the
click-list so each step names its two options. If the owner must pick one document as-is: pick Astra's, and have cowork rewrite §5
(the click-list) in plain language before day 1.
