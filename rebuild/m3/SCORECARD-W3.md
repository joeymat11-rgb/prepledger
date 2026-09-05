# M3 W3 — CLOCK/LEASE CONTINUITY SPIKE — cowork's verification (2026-09-05; rebuild/m3-w3-clock-spike, PR #20)
- 39/39 tests reproduced here (32 protocol-model + 7 unchanged-core red witnesses); no network calls in the probe; soak stub untouched.
- FINDING ACCEPTED AS A RED WITNESS — `C1-C11-RESTART`: a browser cannot prove how much time passed while the process was absent (kill, reboot,
  old-state restore). Two histories with identical restored state and identical post-restart observations can differ in whether the lease
  expired. Refusing both (state 20) keeps C11 safe but breaks C1 (offline cold start + writes). This is a SHEET-LEVEL decision, not a build
  defect, and it meets the four-part bar (a refused write = a lost fact; a permitted write past expiry = an untrue "Saved").
- Five unchanged-core witnesses retained for W6: wall rollback reopens expiry (client/index.cjs:112, lease.cjs:24); restored continuity flag
  ignored; whole local erasure becomes "fresh"; coherent old restore reuses a slot (T3 rejects IDENTITY_COLLISION); exhaustion face disagrees
  with refusal. These are integration obligations, already implied by PLAN-M3-v1 §3 (browser bridge, state precedence).
- NOT RUN: the iPhone hand test (15-minute tap script in the README), real DST, old-phone restore. The probe needs its own pinned origin
  (ten assets) — a second small host like earned-soak; scheduled with the pressure window in week 2, not before.
- cowork's RECOMMENDATION to the owner (ruling needed, not urgent for this week): after an unproven restart, allow offline writes while the
  phone's own clock says the lease is valid AND the sequence budget has room (the hard cap), and settle at the first reconnect with signed
  server time; the exposure is bounded by the sequence range, which the authority enforces regardless. The strict alternative (no offline
  writes after any reboot until the phone reaches the server) is safer on paper and unusable in a basement gym. Native would face the same
  choice; it is not a fix. Goes to Sol as a sheet-refinement witness after the owner rules.
