# PM384 standalone native slot protocol

This is an owned Windows x64 test prototype with invented data. It is not connected to the original operator, helper, engine, private fixture, gate, or app. The fixed original child command remains untouched. No capture admission, all-platform claim or independent acceptance follows.

The candidate uses C Node-API version8 and named page-file-backed Windows mappings. It exposes only opaque tagged native handles and scalar state. No raw pointer, memory view, SharedArrayBuffer, V8 C++ cast, node-addon-api wrapper or fallback is exported. All five native exports are fixed data properties; the loader rejects missing/non-native setup.

`create(name, nonce)` accepts a Local\\EarnedSlot- name with32 lowercase hex digits and a separate32-hex nonce. It creates a64-byte mapping exclusively: ERROR_ALREADY_EXISTS refuses instead of accepting someone else's region. Windows supplies the creator's process id. Each handle also records the native process/environment in which it was made.

`attach(name, nonce, ownerPid, 1, 64)` opens an existing region only. A release-published ready word, magic, protocol version, declared byte length, creator pid and nonce must match before a handle is returned. The requested view is bounded to64 bytes. Size means the fixed protocol view and creator-declared length, not an independently queried exact Windows section allocation. The exclusive owning creator establishes allocation size; arbitrary hostile native writers and OS compromise are outside this prototype's boundary.

The64-byte layout is: aligned32-bit ready, magic, version, bytes and owner pid;32 nonce bytes; aligned32-bit progress;8 reserved bytes. Static assertions enforce width/layout/alignment. Metadata is initialized before an interlocked ready publication and never changed afterwards by the candidate.

| State | Meaning | Only next valid event |
|---|---|---|
| 0 | No progress | 1: first pending |
| 1 | First pending | 2: first complete |
| 2 | First complete | 3: second pending |
| 3 | Second pending | 4: second complete |
| 4 | Second complete | None |
| 5 | Sticky refusal | None |

`advance(handle, event)` performs one compare/exchange from event-1 to event for events1–4. Missing, extra, nonnumeric, fractional, nonfinite, huge, duplicate or out-of-order input writes5. A failed compare/exchange also writes5; nothing can transition out of5. There is no incrementing counter that can wrap. A normal call returns its existing handle; it performs no diagnostic IO, JavaScript coercion callback, scheduling or new result allocation. Invalid/closed/foreign handles and unexpected header corruption throw fixed failures; VM/OS-level failure is not a universal nonthrowing guarantee.

`read(handle)` is for the actual creator's owning handle only. It returns one interlocked state after validating identity. An attached view cannot impersonate the owner. A state of4 is only a state observation: the driver may consider it complete after the entire declared writer graph has terminated with its required outcome. This prototype does not discover arbitrary detached descendants or prove the original helper's complete writer set.

`close(handle)` marks the handle closed before releasing its view and mapping handle, then drops its separate strong Node-API reference. The external's native allocation survives until its finalizer, so stale JavaScript handle calls refuse without accessing unmapped memory. Repeated successful cleanup returns false and does not repeat OS closes. OS cleanup or reference-release failures are reported; remaining resources may be retained safely for finalization rather than freed underneath a callback.

A strong Node-API reference retains every returned external until explicit close or environment teardown. An environment cleanup hook releases mapping resources and the reference before the external finalizer; a normal finalizer unregisters its still-pending cleanup hook before freeing native bookkeeping. No weak pointer or already-ended inner scope crosses the native return boundary. Callers must close handles; dropping their JS references alone intentionally retains them until teardown.

The standalone driver creates the owner, launches `node --test --test-reporter=tap` with one generated invented-data test file, and waits for the outer process to end before reading and cleaning the owner. The test file is a distinct OS process. Only a unique descriptor is propagated through that synthetic graph's environment; the outer runner is unchanged. Process identities and raw child results are recorded in own scratch, independently of mapping state.

Tests cover real two-record progress, all partial states, sticky refusal, invalid values without coercion, late third progress after the earlier diagnostic file is complete and later writes fail, owner retention through GC/child teardown, missing setup, descriptor/header mismatches, closed/forged handles, duplicate ownership and repeatable cleanup. A process-local-buffer control can print a complete diagnostic yet leaves the parent's mapping at0. A nonzero-child control can leave4 and must still refuse. Reusing a fully closed name with a new nonce must reject the old descriptor.

Two explicitly labeled incompatible fixtures compile this same C source with version2 or declared/mapped size128. They test actual existing-region header mismatch; they are not candidate binaries or accepted alternate protocols. Compiler flags, exact sources and every binary hash are recorded separately.

Build only with the PM manifest's Zig0.15.2, official Node22.23.2, official header archive and node.lib inside the fresh own worktree. `build.cjs <unique-phase> <source-head>` verifies inputs, runs the pinned compiler and records each raw result without overwriting earlier phases. All caches/temp/output are under own .tmp/native-slot. Tests use this same runtime and owned scratch. No npm, package lifecycle, system installation, external SDK, global configuration, CI/remote run or fallback toolchain.

The trusted execution boundary is the exact compiler/runtime/header/library, Windows mapping/interlocked implementation and basic allocation/handle/process-id operations. Direct definitions are pinned in source custody; this is not a general source audit. VM exhaustion, OS compromise, hostile same-user native memory modification, stronger original noninterference, private field capture, actual original argv integration and other platforms remain unproved. ER must independently review exact source before author outcomes, then execute the licensed standalone checks.
