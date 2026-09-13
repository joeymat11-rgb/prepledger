# D2 PM318 independent replay annex

Candidate e85ad803ae8af600726c1491f35c90c7b3cd2c03; source4191eeb8; baseM100820aa. E current/RED reports and outcome archives remained unread during this phase.

1. In a separately authorized OWN worktree, reproduce the no-checkout/full-index55-input admission in d2-idle-admission.json and pm318-inputs.json. Do not hydrate the whole repository or protected paths.
2. Use verified Node22.23.2 (binary SHA in dependency inventory). Install only the two manifest-pinned packages with scripts disabled in owned scratch; verify tarball integrities first. The install script preserves original tool paths as evidence; supply an owned npm CLI for another machine. No package or Node binary is archived here.
3. Copy d2-controls.mjs and d2-reversals.mjs byte-for-byte into the owned root's .tmp directory. Controls use only explicit licensed public modules; synthetic signing/encryption keys exist in memory only. Resolve root node_modules to the own two-package install.
4. Run node --test rebuild/m3/w6/test/public-client.test.mjs rebuild/m3/w6/test/prepared-workout.test.mjs, then node --test .tmp/d2-controls.mjs with TZ=America/New_York and no NODE_OPTIONS/NODE_PATH/preload/coverage injection.
5. Replay the five bounded reversals with node .tmp/d2-reversals.mjs. It requires exact product hashes, restores source in finally, runs focused assertions, then reruns controls and the authorized pair. Run only in the assigned reviewer tree.

Original reviewer controls were8/9: I3 incorrectly required writer abort-event delivery before the head read. Actual abort/rollback permits a successor read before notification delivery. The correction observes tx.abort() returning before the read and still requires complete stored-byte equality, successful publication and exactly one native dispatch. Exact original source/output and corrected/restored outputs are retained; this is a reviewer assertion correction, not a product defect or a reversal kill.

All five reversal executions failed with intended ERR_ASSERTION; no setup/load error counts. R4 causes two failures (abort and close). Product source restored exactly; final pair254/254 and controls9/9.

The observer uses addEventListener and returns original requests; it never replaces or redispatches onsuccess. Earlier/later writers use independent real fake-indexeddb connections. Synthetic observation/configuration callbacks do not qualify production providers. Raw stored-record comparisons cover active/previous, ops/outbox and future collections in never-adopted fixtures; recovery-adoption is explicitly absent.

FILES.json hashes every other annex entry and the first review. Local .gitattributes preserves raw execution bytes without line-ending conversion. Original install/command paths are provenance, not authority to operate them. Original outcomes are distinguished from mutated-source results. No author outcome is included in this first annex.
