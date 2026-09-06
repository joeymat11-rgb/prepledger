# store-secret.tests.ps1 — exercises the ACTUAL core of ..\store-secret.ps1 (dot-sourced in library mode)
# against in-memory DUMMY facades. No Windows environment variable is read or written by these tests,
# no WinForms window opens, no value or length is ever printed.
#
#   Windows (owner's PC): double-click ..\store-secret-tests.cmd
#   or, from a normal PowerShell session:  powershell -NoProfile -File rebuild\m3\setup\test\store-secret.tests.ps1
#
# Status: NOT RUN in the integrator's Linux cloud session (no PowerShell there); a Windows static parse PASSED
# (Astra, 2026-09-06, script not executed). The first Windows run's summary line goes into the next report.

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "..\store-secret.ps1") -AsLibrary

$script:Passed = 0; $script:Failed = 0
function Check([string]$name, [bool]$cond, [string]$detail = "") {
  if ($cond) { $script:Passed++; Write-Output "ok   $name" }
  else { $script:Failed++; Write-Output "FAIL $name $detail" }
}
function NoEcho([string]$text, [string]$sentinel) { return (-not ("$text" -like "*$sentinel*")) }

# ---- an in-memory facade with the same three operations the real one has -----------------------------------
# $ProcessView: $null → GetProcess mirrors the user store (a "fresh" process); a hashtable → a stale process snapshot.
function New-MemoryFacade([hashtable]$seed = @{}, [hashtable]$ProcessView = $null) {
  $store = @{}
  foreach ($k in $seed.Keys) { $store[$k] = $seed[$k] }
  $pv = $ProcessView
  return [pscustomobject]@{
    Store      = $store
    Get        = { param($n) if ($store.ContainsKey($n)) { return $store[$n] } else { return $null } }.GetNewClosure()
    Set        = { param($n, $v) if ($null -eq $v) { [void]$store.Remove($n) } else { $store[$n] = $v } }.GetNewClosure()
    GetProcess = { param($n) if ($null -eq $pv) { if ($store.ContainsKey($n)) { return $store[$n] } else { return $null } } else { if ($pv.ContainsKey($n)) { return $pv[$n] } else { return $null } } }.GetNewClosure()
  }
}
# a deterministic rng facade: 00000001, 00000002, …
$script:n = 0
$fixedRng = { $script:n = ($script:n + 1); return ("{0:x8}" -f $script:n) }

# ---- argument parsing: fixed messages, nothing echoed ------------------------------------------------------
$p = Parse-StoreSecretArgs @("--selftest");                Check "args: --selftest"                 ($p.Mode -eq "selftest")
$p = Parse-StoreSecretArgs @("-SelfTest");                 Check "args: -SelfTest alias"            ($p.Mode -eq "selftest")
$p = Parse-StoreSecretArgs @("--name", "CLERK_SECRET_KEY"); Check "args: --name X"                  ($p.Mode -eq "store" -and $p.Name -eq "CLERK_SECRET_KEY")
$p = Parse-StoreSecretArgs @();                            Check "args: none → interactive"         ($p.Mode -eq "store" -and $p.Name -eq "")
$p = Parse-StoreSecretArgs @("--help");                    Check "args: --help"                     ($p.Mode -eq "help")
$p = Parse-StoreSecretArgs @("--arm-fresh-proof");         Check "args: --arm-fresh-proof"          ($p.Mode -eq "arm")
$h64 = ("ab" * 32)
$p = Parse-StoreSecretArgs @("--verify-fresh-proof", "EARNED_FRESHPROOF_0123abcd", $h64); Check "args: --verify-fresh-proof NAME HASH" ($p.Mode -eq "verify" -and $p.ProofName -eq "EARNED_FRESHPROOF_0123abcd" -and $p.ProofHash -eq $h64)
$p = Parse-StoreSecretArgs @("--cleanup-fresh-proof", "EARNED_FRESHPROOF_0123abcd", $h64); Check "args: --cleanup-fresh-proof NAME HASH" ($p.Mode -eq "cleanup")
$p = Parse-StoreSecretArgs @("--verify-fresh-proof", "EARNED_FRESHPROOF_0123abcd"); Check "args: verify without HASH → error 5" ($p.Mode -eq "error" -and $p.ExitCode -eq 5)
$p = Parse-StoreSecretArgs @("--verify-fresh-proof", "SENTINEL-not-a-name-7Q9", $h64); Check "args: verify with bad NAME → error 5, not echoed" ($p.Mode -eq "error" -and $p.ExitCode -eq 5 -and (NoEcho $p.Message "SENTINEL"))
$p = Parse-StoreSecretArgs @("--verify-fresh-proof", "EARNED_FRESHPROOF_0123abcd", "SENTINEL-hash"); Check "args: verify with bad HASH → error 5, not echoed" ($p.Mode -eq "error" -and (NoEcho $p.Message "SENTINEL"))
$p = Parse-StoreSecretArgs @("SENTINEL-misplaced-secret-8Z1"); Check "args: unknown argument → error 5, NOT echoed" ($p.Mode -eq "error" -and $p.ExitCode -eq 5 -and (NoEcho $p.Message "SENTINEL"))
$p = Parse-StoreSecretArgs @("--name");                    Check "args: --name without value → error 5" ($p.Mode -eq "error" -and $p.ExitCode -eq 5)

# ---- name allowlist ----------------------------------------------------------------------------------------
Check "name: CLOUDFLARE_API_TOKEN allowed" ((Test-AllowedSecretName "CLOUDFLARE_API_TOKEN") -eq $true)
Check "name: CLERK_SECRET_KEY allowed"     ((Test-AllowedSecretName "CLERK_SECRET_KEY") -eq $true)
Check "name: PATH refused"                 ((Test-AllowedSecretName "PATH") -eq $false)
Check "name: lowercase refused"            ((Test-AllowedSecretName "cloudflare_api_token") -eq $false)
Check "name: empty refused"                ((Test-AllowedSecretName "") -eq $false)

# ---- storing: happy path, existing value, mismatch, exception, no-echo ----------------------------------------
$f = New-MemoryFacade
$r = Invoke-StoreSecret -Name "CLOUDFLARE_API_TOKEN" -Value "dummy-value-1" -Facade $f
Check "store: ok" ($r.Ok -and $r.Outcome -eq "stored")
Check "store: value landed in facade" ($f.Store["CLOUDFLARE_API_TOKEN"] -eq "dummy-value-1")
Check "store: result carries no value" (NoEcho $r.Message "dummy-value-1")
Check "store: result carries no length" (-not ("$($r.Message)" -match "\b13\b|chars|length"))

$f = New-MemoryFacade @{ CLOUDFLARE_API_TOKEN = "already-there" }
Check "store: pre-existing value is detected" ((Test-SecretPresent -Name "CLOUDFLARE_API_TOKEN" -Facade $f) -eq $true)
Check "store: absent value is detected"       ((Test-SecretPresent -Name "CLERK_SECRET_KEY" -Facade $f) -eq $false)

$bad = [pscustomobject]@{ Get = { param($n) "something-else" }; Set = { param($n, $v) }; GetProcess = { param($n) $null } }
$r = Invoke-StoreSecret -Name "CLERK_SECRET_KEY" -Value "dummy-value-2" -Facade $bad
Check "store: read-back mismatch → not ok, outcome unverified" ((-not $r.Ok) -and $r.Outcome -eq "unverified-readback-mismatch")

$thrower = [pscustomobject]@{ Get = { param($n) $null }; Set = { param($n, $v) throw "access denied (dummy)" }; GetProcess = { param($n) $null } }
$r = Invoke-StoreSecret -Name "CLERK_SECRET_KEY" -Value "dummy-value-3" -Facade $thrower
Check "store: setter exception → not ok, outcome set-failed" ((-not $r.Ok) -and $r.Outcome -eq "set-failed")
Check "store: exception message does not leak the value" (NoEcho $r.Message "dummy-value-3")

$r = Invoke-StoreSecret -Name "SENTINEL-name-4K2" -Value "x" -Facade (New-MemoryFacade)
Check "store: refused name never reaches the facade, NOT echoed" ($r.Outcome -eq "refused-name" -and (NoEcho $r.Message "SENTINEL"))
Check "store: empty value refused" ((Invoke-StoreSecret -Name "CLERK_SECRET_KEY" -Value "" -Facade (New-MemoryFacade)).Outcome -eq "empty-value")

# ---- self-test: owned dummy variable, collision-safe, exact-value cleanup, always cleaned up -------------------
$script:n = 0
$f = New-MemoryFacade @{ UNRELATED = "keep-me" }
$r = Invoke-SelfTest -Facade $f -Rng $fixedRng
Check "selftest: passes on a clean facade" ($r.Ok)
Check "selftest: variable name carries the EARNED_SELFTEST_ prefix" ($r.Name -like "EARNED_SELFTEST_*")
Check "selftest: never touches a fixed name" ($r.Name -ne "EARNED_SELFTEST_VAR")
Check "selftest: cleaned up (facade back to its original keys)" ($f.Store.Count -eq 1 -and $f.Store["UNRELATED"] -eq "keep-me")
Check "selftest: message has no value and no length" (-not ("$($r.Message)" -match "chars|length|EARNED-SELFTEST-OWNED"))

# collision: the first two candidate names already exist → the third is used, the two existing are untouched
$script:n = 0
$seed = @{ "EARNED_SELFTEST_00000001" = "someone-elses"; "EARNED_SELFTEST_00000002" = "also-theirs" }
$f = New-MemoryFacade $seed
$r = Invoke-SelfTest -Facade $f -Rng $fixedRng
Check "selftest: skips colliding names" ($r.Ok -and $r.Name -eq "EARNED_SELFTEST_00000003")
Check "selftest: colliding foreign variables untouched" ($f.Store["EARNED_SELFTEST_00000001"] -eq "someone-elses" -and $f.Store["EARNED_SELFTEST_00000002"] -eq "also-theirs")
Check "selftest: own variable removed afterwards" (-not $f.Store.ContainsKey("EARNED_SELFTEST_00000003"))

# collision exhaustion: every candidate exists → fails closed, nothing written
$script:n = 0
$seed = @{}; 1..8 | ForEach-Object { $seed["EARNED_SELFTEST_{0:x8}" -f $_] = "taken" }
$f = New-MemoryFacade $seed
$r = Invoke-SelfTest -Facade $f -Rng $fixedRng
Check "selftest: exhaustion → not ok, outcome collision-exhausted" ((-not $r.Ok) -and $r.Outcome -eq "collision-exhausted")
Check "selftest: exhaustion wrote nothing" ($f.Store.Count -eq 8)

# ownership guard (1): SAME PREFIX, DIFFERENT VALUE at cleanup (e.g. another attempt's value) → NOT deleted
$script:n = 0
$store = @{}
$swapPrefix = [pscustomobject]@{
  Get        = { param($n) if ($store.ContainsKey($n)) { if ($store[$n] -like "EARNED-SELFTEST-OWNED-*") { return "EARNED-SELFTEST-OWNED-deadbeef" } else { return $store[$n] } } else { return $null } }.GetNewClosure()
  Set        = { param($n, $v) if ($null -eq $v) { [void]$store.Remove($n) } else { $store[$n] = $v } }.GetNewClosure()
  GetProcess = { param($n) $null }
}
$r = Invoke-SelfTest -Facade $swapPrefix -Rng $fixedRng
Check "selftest: same-prefix/different-value → not ok" (-not $r.Ok)
Check "selftest: same-prefix/different-value is NOT deleted (exact-value ownership)" ($store.ContainsKey("EARNED_SELFTEST_00000001"))

# ownership guard (2): value replaced by something without the prefix → NOT deleted
$script:n = 0
$store = @{}
$hijack = [pscustomobject]@{
  Get        = { param($n) if ($store.ContainsKey($n)) { if ($store[$n] -like "EARNED-SELFTEST-OWNED-*") { return "hijacked-by-another-process" } else { return $store[$n] } } else { return $null } }.GetNewClosure()
  Set        = { param($n, $v) if ($null -eq $v) { [void]$store.Remove($n) } else { $store[$n] = $v } }.GetNewClosure()
  GetProcess = { param($n) $null }
}
$r = Invoke-SelfTest -Facade $hijack -Rng $fixedRng
Check "selftest: hijacked value → not ok" (-not $r.Ok)
Check "selftest: hijacked value is NOT deleted (ownership guard)" ($store.ContainsKey("EARNED_SELFTEST_00000001"))

# setter that throws WITHOUT writing: truthful set-failed, nothing left behind
$script:n = 0
$seen = @{}
$throwNoWrite = [pscustomobject]@{
  Get        = { param($n) if ($seen.ContainsKey($n)) { return $seen[$n] } else { return $null } }.GetNewClosure()
  Set        = { param($n, $v) if ($null -ne $v) { throw "access denied (dummy)" } else { [void]$seen.Remove($n) } }.GetNewClosure()
  GetProcess = { param($n) $null }
}
$r = Invoke-SelfTest -Facade $throwNoWrite -Rng $fixedRng
Check "selftest: setter exception (no write) → not ok, outcome set-failed" ((-not $r.Ok) -and $r.Outcome -eq "set-failed")
Check "selftest: nothing left behind after exception" ($seen.Count -eq 0)

# setter that WRITES THE VALUE and then throws: still set-failed, and the landed value IS cleaned up (attempted flag set before Set)
$script:n = 0
$seen2 = @{}
$throwAfterWrite = [pscustomobject]@{
  Get        = { param($n) if ($seen2.ContainsKey($n)) { return $seen2[$n] } else { return $null } }.GetNewClosure()
  Set        = { param($n, $v) if ($null -ne $v) { $seen2[$n] = $v; throw "landed then threw (dummy)" } else { [void]$seen2.Remove($n) } }.GetNewClosure()
  GetProcess = { param($n) $null }
}
$r = Invoke-SelfTest -Facade $throwAfterWrite -Rng $fixedRng
Check "selftest: side-effect-then-throw → not ok, outcome set-failed" ((-not $r.Ok) -and $r.Outcome -eq "set-failed")
Check "selftest: side-effect-then-throw → the landed value was cleaned up" ($seen2.Count -eq 0)

# cleanup itself throws → cleanup-failed (not a silent success)
$script:n = 0
$seen3 = @{}
$cleanupThrows = [pscustomobject]@{
  Get        = { param($n) if ($seen3.ContainsKey($n)) { return $seen3[$n] } else { return $null } }.GetNewClosure()
  Set        = { param($n, $v) if ($null -eq $v) { throw "cannot remove (dummy)" } else { $seen3[$n] = $v } }.GetNewClosure()
  GetProcess = { param($n) $null }
}
$r = Invoke-SelfTest -Facade $cleanupThrows -Rng $fixedRng
Check "selftest: cleanup throw → not ok, outcome cleanup-failed" ((-not $r.Ok) -and $r.Outcome -eq "cleanup-failed")

# read-back throws at cleanup → cleanup-unverified (truthful ambiguity)
$script:n = 0
$calls = @{ get = 0 }; $seen4 = @{}
$readFailsLater = [pscustomobject]@{
  Get        = { param($n) $calls.get++; if ($calls.get -ge 2) { throw "registry unreadable (dummy)" }; if ($seen4.ContainsKey($n)) { return $seen4[$n] } else { return $null } }.GetNewClosure()
  Set        = { param($n, $v) if ($null -eq $v) { [void]$seen4.Remove($n) } else { $seen4[$n] = $v } }.GetNewClosure()
  GetProcess = { param($n) $null }
}
$r = Invoke-SelfTest -Facade $readFailsLater -Rng $fixedRng
Check "selftest: read-back failure after write → not ok, outcome names the ambiguity" ((-not $r.Ok) -and ($r.Outcome -in @("unverified-readback-failed", "cleanup-unverified")))

# read-back mismatch during the self-test → unverified
$script:n = 0
$script:written = $false
$mismatch = [pscustomobject]@{ Get = { param($n) if ($script:written) { "not-what-we-wrote" } else { $null } }; Set = { param($n, $v) $script:written = ($null -ne $v) }; GetProcess = { param($n) $null } }
$r = Invoke-SelfTest -Facade $mismatch -Rng $fixedRng
Check "selftest: read-back mismatch → not ok, outcome unverified" ((-not $r.Ok) -and $r.Outcome -eq "unverified-readback-mismatch")

# ---- fresh-process proof: arm → verify → cleanup ---------------------------------------------------------------
$script:n = 0
$f = New-MemoryFacade @{ UNRELATED = "keep-me" }          # process view mirrors the store = a FRESH process
$a = Invoke-FreshProofArm -Facade $f -Rng $fixedRng
Check "fresh: arm ok" ($a.Ok -and $a.Outcome -eq "armed")
Check "fresh: arm name has the EARNED_FRESHPROOF_ prefix" ($a.Name -match '^EARNED_FRESHPROOF_[0-9a-f]{8}$')
Check "fresh: arm hash is 64 hex" ($a.Hash -match '^[0-9a-f]{64}$')
Check "fresh: arm message carries NAME and HASH but not the value" (("$($a.Message)" -like "*$($a.Name)*") -and ("$($a.Message)" -like "*$($a.Hash)*") -and (NoEcho $a.Message "EARNED-FRESHPROOF-OWNED"))
Check "fresh: arm hash matches the stored value" ((Get-Sha256Hex $f.Store[$a.Name]) -eq $a.Hash)
$v = Invoke-FreshProofVerify -Name $a.Name -Hash $a.Hash -Facade $f
Check "fresh: verify ok in a fresh process" ($v.Ok -and $v.Outcome -eq "ok")
Check "fresh: verify message carries no value" (NoEcho $v.Message "EARNED-FRESHPROOF-OWNED")
$c = Invoke-FreshProofCleanup -Name $a.Name -Hash $a.Hash -Facade $f
Check "fresh: cleanup removed" ($c.Ok -and $c.Outcome -eq "removed" -and -not $f.Store.ContainsKey($a.Name) -and $f.Store["UNRELATED"] -eq "keep-me")
$c2 = Invoke-FreshProofCleanup -Name $a.Name -Hash $a.Hash -Facade $f
Check "fresh: second cleanup → already-gone, ok" ($c2.Ok -and $c2.Outcome -eq "already-gone")

# stale process: the process view does NOT have the variable → FAIL not-visible; user value untouched
$script:n = 0
$stale = New-MemoryFacade @{} @{}                          # empty process snapshot
$a = Invoke-FreshProofArm -Facade $stale -Rng $fixedRng
$v = Invoke-FreshProofVerify -Name $a.Name -Hash $a.Hash -Facade $stale
Check "fresh: stale process → not ok, outcome not-visible-in-this-process" ((-not $v.Ok) -and $v.Outcome -eq "not-visible-in-this-process")
Check "fresh: stale process → user value untouched" ($stale.Store.ContainsKey($a.Name))
Check "fresh: stale message tells the owner to start fresh" ("$($v.Message)" -like "*fresh*")

# process inherited a DIFFERENT value than the user store → FAIL process-value-differs
$script:n = 0
$diff = New-MemoryFacade @{} @{}
$a = Invoke-FreshProofArm -Facade $diff -Rng $fixedRng
$diff.GetProcess = { param($n) "an-older-value" }
$v = Invoke-FreshProofVerify -Name $a.Name -Hash $a.Hash -Facade $diff
Check "fresh: process value differs → not ok, outcome process-value-differs" ((-not $v.Ok) -and $v.Outcome -eq "process-value-differs")

# foreign value under the armed name (hash does not match) → verify FAIL foreign-value; cleanup refuses to remove
$script:n = 0
$f = New-MemoryFacade
$a = Invoke-FreshProofArm -Facade $f -Rng $fixedRng
$f.Store[$a.Name] = "EARNED-FRESHPROOF-OWNED-someone-elses-arm"
$v = Invoke-FreshProofVerify -Name $a.Name -Hash $a.Hash -Facade $f
Check "fresh: foreign (same-prefix) value → verify not ok, outcome foreign-value" ((-not $v.Ok) -and $v.Outcome -eq "foreign-value")
$c = Invoke-FreshProofCleanup -Name $a.Name -Hash $a.Hash -Facade $f
Check "fresh: foreign (same-prefix) value → cleanup refuses, value kept" ((-not $c.Ok) -and $c.Outcome -eq "foreign-value-not-removed" -and $f.Store.ContainsKey($a.Name))

# not armed at all → verify not-armed
$v = Invoke-FreshProofVerify -Name "EARNED_FRESHPROOF_0000ffff" -Hash $h64 -Facade (New-MemoryFacade)
Check "fresh: never armed → not ok, outcome not-armed" ((-not $v.Ok) -and $v.Outcome -eq "not-armed")

# arm collisions and exhaustion behave like the self-test
$script:n = 0
$f = New-MemoryFacade @{ "EARNED_FRESHPROOF_00000001" = "taken" }
$a = Invoke-FreshProofArm -Facade $f -Rng $fixedRng
Check "fresh: arm skips a colliding name" ($a.Ok -and $a.Name -eq "EARNED_FRESHPROOF_00000002" -and $f.Store["EARNED_FRESHPROOF_00000001"] -eq "taken")
$script:n = 0
$seed = @{}; 1..8 | ForEach-Object { $seed["EARNED_FRESHPROOF_{0:x8}" -f $_] = "taken" }
$f = New-MemoryFacade $seed
$a = Invoke-FreshProofArm -Facade $f -Rng $fixedRng
Check "fresh: arm exhaustion → not ok, nothing written" ((-not $a.Ok) -and $a.Outcome -eq "collision-exhausted" -and $f.Store.Count -eq 8)

# arm: setter throws → set-failed, cleanup attempted, nothing left
$script:n = 0
$seen5 = @{}
$armThrows = [pscustomobject]@{
  Get        = { param($n) if ($seen5.ContainsKey($n)) { return $seen5[$n] } else { return $null } }.GetNewClosure()
  Set        = { param($n, $v) if ($null -ne $v) { $seen5[$n] = $v; throw "landed then threw (dummy)" } else { [void]$seen5.Remove($n) } }.GetNewClosure()
  GetProcess = { param($n) $null }
}
$a = Invoke-FreshProofArm -Facade $armThrows -Rng $fixedRng
Check "fresh: arm side-effect-then-throw → set-failed and cleaned" ((-not $a.Ok) -and $a.Outcome -eq "set-failed" -and $seen5.Count -eq 0)

Write-Output ("store-secret tests: {0} passed, {1} failed" -f $script:Passed, $script:Failed)
if ($script:Failed -gt 0) { exit 1 } else { exit 0 }
