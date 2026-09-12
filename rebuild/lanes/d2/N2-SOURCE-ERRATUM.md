# N2 source correction, D2, 2026-09-12

My N2 brief READ-LIST and N2-RECON.md incorrectly say the returned era exposes only named factories and no client.hostBindings. That was my reading error.

rebuild/m3/w6/local/today-bindings.mjs:571-572 returns Object.freeze({client,...}); openTodayInstallation at :725 spreads that era into its public handle. rebuild/m3/w6/local/local-client.mjs:395 exposes hostBindings(options). The bindings file is byte-identical between the N2 recon base 5508ed3 and N1 review head 25650f8; this is not a newly added capability.

N1 and machine-settings independently demonstrate an existing same-generation producer path through era.client.hostBindings. N2 can consider that path within the PM's assigned producer custody. It does not need a new client exposure merely to obtain bindings. Same-store durability, clock discipline, consumer refresh, and the actual pinned entry/bindings restrictions still require the accepted proofs.

The accepted N2 v1.0 file and its sha256 b0969edba4f55863ea3545ce4cebab751e37b019e84ae4c77f5babdb3208a517 remain unchanged. This file corrects source reconnaissance; it grants no scope, pin waiver, authority acceptance or implementation verdict. PM/C are notified through REQUESTS.
