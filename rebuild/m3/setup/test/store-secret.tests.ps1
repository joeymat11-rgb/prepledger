# store-secret.tests.ps1 — exercises the ACTUAL core of ..\store-secret.ps1 (dot-sourced in library mode)
# against in-memory DUMMY facades. No Windows User environment variable is read or written by these tests,
# no WinForms window opens, no value or length is ever printed.
#
#   Windows (owner's PC, normal PowerShell session, or double-click store-secret-tests.cmd if one is added later):
#     powershell -NoProfile -File rebuild\m3\setup\test\store-secret.tests.ps1
#
# Status: NOT RUN in the integrator's Linux cloud session (no PowerShell there). The first Windows run's
# summary line goes into REPORT-W4-SETUP-HARDENING-I.md.

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "..\store-secret.ps1") -AsLibrary

$script:Passed = 0; $script:Failed = 0
function Check([string]$name, [bool]$cond, [string]$detail = "") {
  if ($cond) { $script:Passed++; Write-Output "ok   $name" }
  else { $script:Failed++; Write-Output "FAIL $name $detail" }
}

# ---- an in-memory facade with the same two operations the real one has -----------------------------------
function New-MemoryFacade([hashtable]$seed = @{}) {
  $store = @{}
  foreach ($k in $seed.Keys) { $store[$k] = $seed[$k] }
  return [pscustomobject]@{
    Store = $store
    Get   = { param($n) if ($store.ContainsKey($n)) { return $store[$n] } else { return $null } }.GetNewClosure()
    Set   = { param($n, $v) if ($null -eq $v) { [void]$store.Remove($n) } else { $store[$n] = $v } }.GetNewClosure()
  }
}

# ---- argument parsing ------------------------------------------------------------------------------------
$p = Parse-StoreSecretArgs @("--selftest");              Check "args: --selftest"            ($p.Mode -eq "selftest")
$p = Parse-StoreSecretArgs @("-SelfTest");               Check "args: -SelfTest alias"       ($p.Mode -eq "selftest")
$p = Parse-StoreSecretArgs @("--name", "CLERK_SECRET_KEY"); Check "args: --name X"           ($p.Mode -eq "store" -and $p.Name -eq "CLERK_SECRET_KEY")
$p = Parse-StoreSecretArgs @();                          Check "args: none → interactive"    ($p.Mode -eq "store" -and $p.Name -eq "")
$p = Parse-StoreSecretArgs @("--bogus");                 Check "args: unknown flag → error 5" ($p.Mode -eq "error" -and $p.ExitCode -eq 5)
$p = Parse-StoreSecretArgs @("--name");                  Check "args: --name without value → error 5" ($p.Mode -eq "error" -and $p.ExitCode -eq 5)
$p = Parse-StoreSecretArgs @("--help");                  Check "args: --help"                ($p.Mode -eq "help")

# ---- name allowlist --------------------------------------------------------------------------------------
Check "name: CLOUDFLARE_API_TOKEN allowed" ((Test-AllowedSecretName "CLOUDFLARE_API_TOKEN") -eq $true)
Check "name: CLERK_SECRET_KEY allowed"     ((Test-AllowedSecretName "CLERK_SECRET_KEY") -eq $true)
Check "name: PATH refused"                 ((Test-AllowedSecretName "PATH") -eq $false)
Check "name: lowercase refused"            ((Test-AllowedSecretName "cloudflare_api_token") -eq $false)
Check "name: empty refused"                ((Test-AllowedSecretName "") -eq $false)

# ---- storing: happy path, existing value, mismatch, exception -------------------------------------------
$f = New-MemoryFacade
$r = Invoke-StoreSecret -Name "CLOUDFLARE_API_TOKEN" -Value "dummy-value-1" -Facade $f
Check "store: ok" ($r.Ok -and $r.Outcome -eq "stored")
Check "store: value landed in facade" ($f.Store["CLOUDFLARE_API_TOKEN"] -eq "dummy-value-1")
Check "store: result carries no value" (-not ("$($r.Message)" -like "*dummy-value-1*"))
Check "store: result carries no length" (-not ("$($r.Message)" -match "\b13\b|chars|length"))

$f = New-MemoryFacade @{ CLOUDFLARE_API_TOKEN = "already-there" }
Check "store: pre-existing value is detected" ((Test-SecretPresent -Name "CLOUDFLARE_API_TOKEN" -Facade $f) -eq $true)
Check "store: absent value is detected"       ((Test-SecretPresent -Name "CLERK_SECRET_KEY" -Facade $f) -eq $false)

# read-back differs (the platform accepted the write but returns something else): must be UNVERIFIED, not ok
$bad = [pscustomobject]@{ Get = { param($n) "something-else" }; Set = { param($n, $v) } }
$r = Invoke-StoreSecret -Name "CLERK_SECRET_KEY" -Value "dummy-value-2" -Facade $bad
Check "store: read-back mismatch → not ok, outcome unverified" ((-not $r.Ok) -and $r.Outcome -eq "unverified-readback-mismatch")

# the setter throws: must be FAILED, never a claimed success
$thrower = [pscustomobject]@{ Get = { param($n) $null }; Set = { param($n, $v) throw "access denied (dummy)" } }
$r = Invoke-StoreSecret -Name "CLERK_SECRET_KEY" -Value "dummy-value-3" -Facade $thrower
Check "store: setter exception → not ok, outcome set-failed" ((-not $r.Ok) -and $r.Outcome -eq "set-failed")
Check "store: exception message does not leak the value" (-not ("$($r.Message)" -like "*dummy-value-3*"))

Check "store: refused name never reaches the facade" ((Invoke-StoreSecret -Name "PATH" -Value "x" -Facade (New-MemoryFacade)).Outcome -eq "refused-name")
Check "store: empty value refused"                    ((Invoke-StoreSecret -Name "CLERK_SECRET_KEY" -Value "" -Facade (New-MemoryFacade)).Outcome -eq "empty-value")

# ---- self-test: owned dummy variable, collision-safe, always cleaned up ----------------------------------
$f = New-MemoryFacade @{ UNRELATED = "keep-me" }
$r = Invoke-SelfTest -Facade $f
Check "selftest: passes on a clean facade" ($r.Ok)
Check "selftest: variable name carries the EARNED_SELFTEST_ prefix" ($r.Name -like "EARNED_SELFTEST_*")
Check "selftest: never touches a fixed name" ($r.Name -ne "EARNED_SELFTEST_VAR")
Check "selftest: cleaned up (facade back to its original keys)" ($f.Store.Count -eq 1 -and $f.Store["UNRELATED"] -eq "keep-me")
Check "selftest: message has no value and no length" (-not ("$($r.Message)" -match "chars|length|EARNED-SELFTEST-OWNED"))

# collision: the first two candidate names already exist → the third is used, the two existing are untouched
$fixedRng = { $script:n = ($script:n + 1); return ("{0:x8}" -f $script:n) }
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

# ownership guard at cleanup: between write and cleanup the value was replaced by something not ours → do NOT delete it
$script:n = 0
$store = @{}
$hijack = [pscustomobject]@{
  Get = { param($n) if ($store.ContainsKey($n)) { if ($store[$n] -like "EARNED-SELFTEST-OWNED-*") { return "hijacked-by-another-process" } else { return $store[$n] } } else { return $null } }.GetNewClosure()
  Set = { param($n, $v) if ($null -eq $v) { [void]$store.Remove($n) } else { $store[$n] = $v } }.GetNewClosure()
}
$r = Invoke-SelfTest -Facade $hijack -Rng $fixedRng
Check "selftest: hijacked value → not ok" (-not $r.Ok)
Check "selftest: hijacked value is NOT deleted (ownership guard)" ($store.ContainsKey("EARNED_SELFTEST_00000001"))

# setter that throws during the self-test: cleanup still runs and the failure is truthful
$script:n = 0
$seen = @{}
$throwOnce = [pscustomobject]@{
  Get = { param($n) if ($seen.ContainsKey($n)) { return $seen[$n] } else { return $null } }.GetNewClosure()
  Set = { param($n, $v) if ($null -ne $v) { throw "access denied (dummy)" } else { [void]$seen.Remove($n) } }.GetNewClosure()
}
$r = Invoke-SelfTest -Facade $throwOnce -Rng $fixedRng
Check "selftest: setter exception → not ok, outcome set-failed" ((-not $r.Ok) -and $r.Outcome -eq "set-failed")
Check "selftest: nothing left behind after exception" ($seen.Count -eq 0)

# read-back mismatch during the self-test → unverified, and cleanup still attempted
$script:n = 0
$mismatch = [pscustomobject]@{ Get = { param($n) if ($script:written) { "not-what-we-wrote" } else { $null } }; Set = { param($n, $v) $script:written = ($null -ne $v) } }
$script:written = $false
$r = Invoke-SelfTest -Facade $mismatch -Rng $fixedRng
Check "selftest: read-back mismatch → not ok, outcome unverified" ((-not $r.Ok) -and $r.Outcome -eq "unverified-readback-mismatch")

Write-Output ("store-secret tests: {0} passed, {1} failed" -f $script:Passed, $script:Failed)
if ($script:Failed -gt 0) { exit 1 } else { exit 0 }
