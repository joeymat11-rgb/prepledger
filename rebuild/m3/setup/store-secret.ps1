# store-secret.ps1 — companion of store-secret.cmd (Windows). Stores ONE secret as a Windows USER environment variable.
#   · the value is typed into a MASKED box (dots), never shown, never echoed, never logged, never measured
#   · written with [Environment]::SetEnvironmentVariable(name, value, 'User') → HKCU\Environment, nothing else.
#     That store is the current user's profile, protected by the Windows account only — it is NOT an encrypted vault.
#   · the ONLY things ever printed are FIXED sentences plus, where a name appears, an ALLOWLISTED name or a generated
#     EARNED_* test-variable name. No caller-supplied string is ever echoed (a misplaced secret must not reach the screen).
#   · --selftest             dummy round trip through a collision-checked TEMPORARY variable it owns (EARNED_SELFTEST_<random>);
#                            cleanup removes ONLY the exact value it wrote and always runs (finally), even when the write threw
#   · --arm-fresh-proof      writes an owned dummy variable EARNED_FRESHPROOF_<random>; prints its NAME and the SHA-256 of its value
#   · --verify-fresh-proof NAME HASH   run in a FRESH process: proves that process inherited the exact armed value
#   · --cleanup-fresh-proof NAME HASH  removes the armed variable only if its value still hashes to HASH
#   · --name <VAR>           skips the chooser; allowed names are the two below (add here, nowhere else)
#   · -AsLibrary             defines the functions and returns (used by test\store-secret.tests.ps1 with in-memory facades)
#   exit codes: 0 ok · 1 failed or unverified · 2 cancelled · 3 refused name · 4 empty value · 5 unknown/invalid argument
$ErrorActionPreference = "Stop"
$Allowed = @("CLOUDFLARE_API_TOKEN", "CLERK_SECRET_KEY")
$AllowedText = ($Allowed -join ", ")
$SelfTestPrefix  = "EARNED_SELFTEST_"           # NAME prefix of the self-test's throw-away variable
$FreshPrefix     = "EARNED_FRESHPROOF_"         # NAME prefix of the fresh-process proof variable
$OwnedMarker     = "EARNED-SELFTEST-OWNED-"     # VALUE prefix (informational; ownership is decided by EXACT value, never by prefix)
$FreshMarker     = "EARNED-FRESHPROOF-OWNED-"
$MaxAttempts     = 8
$NamePattern     = '^EARNED_FRESHPROOF_[0-9a-f]{8}$'
$HashPattern     = '^[0-9a-f]{64}$'

# ---------------------------------------------------------------- core (talks to a facade; never to Windows directly) --------
# A facade has three script blocks: .Get(name) → USER value or $null ; .Set(name, value) (Set(name,$null) removes) ;
# .GetProcess(name) → the value THIS PROCESS inherited (what a freshly started program actually sees).
function New-UserEnvFacade {
  return [pscustomobject]@{
    Get        = { param($n) [Environment]::GetEnvironmentVariable($n, "User") }
    Set        = { param($n, $v) [Environment]::SetEnvironmentVariable($n, $v, "User") }
    GetProcess = { param($n) [Environment]::GetEnvironmentVariable($n, "Process") }
  }
}

function New-HexToken {
  $b = New-Object byte[] 4; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
  return (($b | ForEach-Object { $_.ToString("x2") }) -join "")
}
function Get-Sha256Hex([string]$s) {
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try { $bytes = $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($s)); return (($bytes | ForEach-Object { $_.ToString("x2") }) -join "") }
  finally { $sha.Dispose() }
}

function Parse-StoreSecretArgs([object[]]$argv) {
  # Messages here are FIXED: the offending argument is never echoed.
  $r = [pscustomobject]@{ Mode = "store"; Name = ""; ProofName = ""; ProofHash = ""; ExitCode = 0; Message = "" }
  $i = 0
  while ($i -lt $argv.Count) {
    $a = [string]$argv[$i]
    switch -Regex ($a) {
      '^(--selftest|-SelfTest|/selftest)$' { $r.Mode = "selftest"; $i++; continue }
      '^(--help|-h|-\?|/\?)$'              { $r.Mode = "help"; $i++; continue }
      '^(-AsLibrary)$'                     { $r.Mode = "library"; $i++; continue }
      '^(--arm-fresh-proof)$'              { $r.Mode = "arm"; $i++; continue }
      '^(--name|-Name)$' {
        if ($i + 1 -ge $argv.Count) { $r.Mode = "error"; $r.ExitCode = 5; $r.Message = "store-secret: --name needs a variable name (one of: $AllowedText)"; return $r }
        $r.Name = [string]$argv[$i + 1]; $i += 2; continue
      }
      '^(--verify-fresh-proof|--cleanup-fresh-proof)$' {
        $r.Mode = $(if ($a -eq "--verify-fresh-proof") { "verify" } else { "cleanup" })
        if ($i + 2 -ge $argv.Count) { $r.Mode = "error"; $r.ExitCode = 5; $r.Message = "store-secret: $a needs NAME and HASH (as printed by --arm-fresh-proof)"; return $r }
        $n = [string]$argv[$i + 1]; $h = [string]$argv[$i + 2]
        if ($n -notmatch $NamePattern) { $r.Mode = "error"; $r.ExitCode = 5; $r.Message = "store-secret: NAME is not a fresh-proof variable name (EARNED_FRESHPROOF_ + 8 hex digits); nothing echoed"; return $r }
        if ($h -notmatch $HashPattern) { $r.Mode = "error"; $r.ExitCode = 5; $r.Message = "store-secret: HASH is not a 64-digit hex SHA-256; nothing echoed"; return $r }
        $r.ProofName = $n; $r.ProofHash = $h; $i += 3; continue
      }
      default { $r.Mode = "error"; $r.ExitCode = 5; $r.Message = "store-secret: unknown argument (use --selftest, --name <VAR>, --arm-fresh-proof, --verify-fresh-proof NAME HASH, --cleanup-fresh-proof NAME HASH, --help); the argument is not echoed"; return $r }
    }
  }
  return $r
}

function Test-AllowedSecretName([string]$n) {
  if ([string]::IsNullOrEmpty($n)) { return $false }
  return [bool]($Allowed -ccontains $n)
}

function Test-SecretPresent([string]$Name, $Facade) {
  $cur = & $Facade.Get $Name
  return -not [string]::IsNullOrEmpty([string]$cur)
}

# Store one value. Never puts the value, its length, or an unlisted name into the result. Truthful outcomes:
#   stored · unverified-readback-mismatch (write accepted, read-back differs — do NOT assume it is stored) ·
#   unverified-readback-failed · set-failed · refused-name · empty-value
function Invoke-StoreSecret([string]$Name, [string]$Value, $Facade) {
  if (-not (Test-AllowedSecretName $Name)) {
    return [pscustomobject]@{ Ok = $false; Outcome = "refused-name"; Message = "store-secret: refused — the variable name is not one of: $AllowedText (the name given is not echoed)" }
  }
  if ([string]::IsNullOrEmpty($Value)) {
    return [pscustomobject]@{ Ok = $false; Outcome = "empty-value"; Message = "store-secret: nothing entered; nothing stored" }
  }
  try { & $Facade.Set $Name $Value }
  catch { return [pscustomobject]@{ Ok = $false; Outcome = "set-failed"; Message = "store-secret: FAILED to write $Name to the USER environment (the platform refused the write; nothing verified). Nothing was printed." } }
  $back = $null
  try { $back = & $Facade.Get $Name }
  catch { return [pscustomobject]@{ Ok = $false; Outcome = "unverified-readback-failed"; Message = "store-secret: UNVERIFIED — $Name was written but could not be read back; do not assume it is stored." } }
  if ([string]$back -ceq $Value) {
    return [pscustomobject]@{ Ok = $true; Outcome = "stored"; Message = "store-secret: stored $Name as a Windows USER environment variable (value not shown)" }
  }
  return [pscustomobject]@{ Ok = $false; Outcome = "unverified-readback-mismatch"; Message = "store-secret: UNVERIFIED — $Name was written but what Windows returns differs from what was entered; do not assume it is stored." }
}

# Pick a temporary variable name that does not exist yet (collision-checked, bounded tries). $null when exhausted.
function Find-FreeTempName([string]$Prefix, $Facade, [scriptblock]$Rng) {
  for ($k = 0; $k -lt $MaxAttempts; $k++) {
    $cand = $Prefix + [string](& $Rng)
    if ([string]::IsNullOrEmpty([string](& $Facade.Get $cand))) { return $cand }
  }
  return $null
}

# Remove $Name only if it still holds EXACTLY $Value (ours). Anything else is left alone and reported.
#   returns: removed · already-gone · foreign-value-not-removed · cleanup-failed · cleanup-unverified
function Remove-OwnedTempVar([string]$Name, [string]$Value, $Facade) {
  $cur = $null
  try { $cur = & $Facade.Get $Name } catch { return "cleanup-unverified" }
  if ($null -eq $cur -or [string]$cur -eq "") { return "already-gone" }
  if ([string]$cur -cne $Value) { return "foreign-value-not-removed" }
  try { & $Facade.Set $Name $null } catch { return "cleanup-failed" }
  try { if ([string]::IsNullOrEmpty([string](& $Facade.Get $Name))) { return "removed" } else { return "cleanup-failed" } }
  catch { return "cleanup-unverified" }
}

# Dummy-only self-test of the persistence mechanism through the facade. The write is marked as ATTEMPTED before Set is
# called, so a Set that lands the value and then throws is still cleaned up; cleanup removes only the exact value written.
function Invoke-SelfTest($Facade, [scriptblock]$Rng = $null) {
  if ($null -eq $Rng) { $Rng = ${function:New-HexToken} }
  $res = [pscustomobject]@{ Ok = $false; Outcome = "not-started"; Name = ""; Message = "" }
  $name = Find-FreeTempName $SelfTestPrefix $Facade $Rng
  if ($null -eq $name) { $res.Outcome = "collision-exhausted"; $res.Message = "store-secret selftest FAIL — could not find a free temporary variable name after $MaxAttempts tries; nothing written"; return $res }
  $res.Name = $name
  $value = $OwnedMarker + [string](& $Rng)
  $attempted = $false
  try {
    $attempted = $true
    try { & $Facade.Set $name $value }
    catch { $res.Outcome = "set-failed"; $res.Message = "store-secret selftest FAIL — the USER environment refused the write (nothing verified)"; return $res }
    $back = $null
    try { $back = & $Facade.Get $name }
    catch { $res.Outcome = "unverified-readback-failed"; $res.Message = "store-secret selftest FAIL — written but could not be read back"; return $res }
    if ([string]$back -cne $value) { $res.Outcome = "unverified-readback-mismatch"; $res.Message = "store-secret selftest FAIL — the value read back is not the value written; persistence UNVERIFIED"; return $res }
    $res.Ok = $true; $res.Outcome = "ok"
    $res.Message = "store-secret selftest OK — a temporary owned variable round-tripped through the Windows USER environment and was removed"
    return $res
  }
  finally {
    if ($attempted) {
      $c = Remove-OwnedTempVar $name $value $Facade
      switch ($c) {
        "removed"      { }
        "already-gone" { }
        "foreign-value-not-removed" { $res.Ok = $false; if ($res.Outcome -eq "ok") { $res.Outcome = "foreign-value-not-removed" }; $res.Message = "store-secret selftest FAIL — $name no longer holds the exact value written (changed by something else); it was NOT removed; inspect it by hand" }
        default        { $res.Ok = $false; $res.Outcome = $c; $res.Message = "store-secret selftest FAIL — the temporary variable $name could not be removed or its removal could not be verified; remove it by hand (it holds only a dummy marker)" }
      }
    }
  }
}

# ---- fresh-process proof: arm (this process) → verify (a FRESH process) → cleanup. Dummy values only; exact-hash ownership. ----
function Invoke-FreshProofArm($Facade, [scriptblock]$Rng = $null) {
  if ($null -eq $Rng) { $Rng = ${function:New-HexToken} }
  $res = [pscustomobject]@{ Ok = $false; Outcome = "not-started"; Name = ""; Hash = ""; Message = "" }
  $name = Find-FreeTempName $FreshPrefix $Facade $Rng
  if ($null -eq $name) { $res.Outcome = "collision-exhausted"; $res.Message = "store-secret fresh-proof ARM FAIL — no free variable name after $MaxAttempts tries; nothing written"; return $res }
  $res.Name = $name
  $value = $FreshMarker + [string](& $Rng) + [string](& $Rng)
  $hash = Get-Sha256Hex $value
  try { & $Facade.Set $name $value }
  catch {
    $c = Remove-OwnedTempVar $name $value $Facade
    $res.Outcome = "set-failed"; $res.Message = "store-secret fresh-proof ARM FAIL — the USER environment refused the write (cleanup: $c)"; return $res
  }
  $back = $null
  try { $back = & $Facade.Get $name } catch { $back = $null }
  if ([string]$back -cne $value) {
    $c = Remove-OwnedTempVar $name $value $Facade
    $res.Outcome = "unverified-readback-mismatch"; $res.Message = "store-secret fresh-proof ARM FAIL — the value read back is not the value written (cleanup: $c)"; return $res
  }
  $res.Ok = $true; $res.Outcome = "armed"; $res.Hash = $hash
  $res.Message = "store-secret fresh-proof ARMED — variable $name written to the USER environment. Now CLOSE every Claude Code window and terminal, open the program FRESH from the Start menu, and run:  store-secret.cmd --verify-fresh-proof $name $hash"
  return $res
}

function Invoke-FreshProofVerify([string]$Name, [string]$Hash, $Facade) {
  $res = [pscustomobject]@{ Ok = $false; Outcome = "not-started"; Name = $Name; Message = "" }
  if ($Name -notmatch $NamePattern -or $Hash -notmatch $HashPattern) { $res.Outcome = "invalid-arguments"; $res.Message = "store-secret fresh-proof VERIFY FAIL — NAME/HASH not in the armed format; nothing echoed"; return $res }
  $userVal = $null; $procVal = $null
  try { $userVal = & $Facade.Get $Name } catch { $res.Outcome = "user-read-failed"; $res.Message = "store-secret fresh-proof VERIFY FAIL — could not read the USER environment"; return $res }
  if ([string]::IsNullOrEmpty([string]$userVal)) { $res.Outcome = "not-armed"; $res.Message = "store-secret fresh-proof VERIFY FAIL — $Name is not in the USER environment (not armed, or already cleaned up)"; return $res }
  if ((Get-Sha256Hex ([string]$userVal)) -ne $Hash) { $res.Outcome = "foreign-value"; $res.Message = "store-secret fresh-proof VERIFY FAIL — $Name holds a value that is not the armed one (nothing touched)"; return $res }
  try { $procVal = & $Facade.GetProcess $Name } catch { $res.Outcome = "process-read-failed"; $res.Message = "store-secret fresh-proof VERIFY FAIL — could not read this process's environment"; return $res }
  if ([string]::IsNullOrEmpty([string]$procVal)) { $res.Outcome = "not-visible-in-this-process"; $res.Message = "store-secret fresh-proof VERIFY FAIL — $Name is stored for the user but THIS process did not inherit it. It was not started fresh: close the program (and whatever launched it) and open it again from the Start menu or taskbar."; return $res }
  if ([string]$procVal -cne [string]$userVal) { $res.Outcome = "process-value-differs"; $res.Message = "store-secret fresh-proof VERIFY FAIL — this process inherited a DIFFERENT value for $Name than the USER environment holds (stale environment); start the program fresh"; return $res }
  $res.Ok = $true; $res.Outcome = "ok"
  $res.Message = "store-secret fresh-proof OK — this process inherited the exact armed value of $Name from the USER environment. Clean up with:  store-secret.cmd --cleanup-fresh-proof $Name $Hash"
  return $res
}

function Invoke-FreshProofCleanup([string]$Name, [string]$Hash, $Facade) {
  $res = [pscustomobject]@{ Ok = $false; Outcome = "not-started"; Name = $Name; Message = "" }
  if ($Name -notmatch $NamePattern -or $Hash -notmatch $HashPattern) { $res.Outcome = "invalid-arguments"; $res.Message = "store-secret fresh-proof CLEANUP FAIL — NAME/HASH not in the armed format; nothing echoed"; return $res }
  $userVal = $null
  try { $userVal = & $Facade.Get $Name } catch { $res.Outcome = "cleanup-unverified"; $res.Message = "store-secret fresh-proof CLEANUP FAIL — could not read the USER environment"; return $res }
  if ([string]::IsNullOrEmpty([string]$userVal)) { $res.Ok = $true; $res.Outcome = "already-gone"; $res.Message = "store-secret fresh-proof CLEANUP OK — $Name is already gone"; return $res }
  if ((Get-Sha256Hex ([string]$userVal)) -ne $Hash) { $res.Outcome = "foreign-value-not-removed"; $res.Message = "store-secret fresh-proof CLEANUP FAIL — $Name holds a value that is not the armed one; it was NOT removed; inspect it by hand"; return $res }
  $c = Remove-OwnedTempVar $Name ([string]$userVal) $Facade
  if ($c -eq "removed" -or $c -eq "already-gone") { $res.Ok = $true; $res.Outcome = "removed"; $res.Message = "store-secret fresh-proof CLEANUP OK — $Name removed from the USER environment"; return $res }
  $res.Outcome = $c; $res.Message = "store-secret fresh-proof CLEANUP FAIL — $Name could not be removed or its removal could not be verified; remove it by hand (it holds only a dummy marker)"
  return $res
}

# ---------------------------------------------------------------- entry --------------------------------------------------------
$parsed = Parse-StoreSecretArgs $args
if ($parsed.Mode -eq "library") { return }
if ($parsed.Mode -eq "error")   { Write-Output $parsed.Message; exit $parsed.ExitCode }
if ($parsed.Mode -eq "help") {
  Write-Output "store-secret.cmd                                   interactive: choose the variable, paste the value into a masked box"
  Write-Output "store-secret.cmd --name CLOUDFLARE_API_TOKEN | CLERK_SECRET_KEY"
  Write-Output "store-secret.cmd --selftest                        dummy round trip through a temporary owned variable; no real secret"
  Write-Output "store-secret.cmd --arm-fresh-proof                 writes an owned dummy variable; prints its NAME and HASH"
  Write-Output "store-secret.cmd --verify-fresh-proof NAME HASH    in a FRESH process: proves it inherited the armed value"
  Write-Output "store-secret.cmd --cleanup-fresh-proof NAME HASH   removes the armed variable (exact-hash match only)"
  exit 0
}

$facade = New-UserEnvFacade

if ($parsed.Mode -eq "selftest") { $r = Invoke-SelfTest -Facade $facade; Write-Output $r.Message; if ($r.Ok) { exit 0 } else { exit 1 } }
if ($parsed.Mode -eq "arm")      { $r = Invoke-FreshProofArm -Facade $facade; Write-Output $r.Message; if ($r.Ok) { exit 0 } else { exit 1 } }
if ($parsed.Mode -eq "verify")   { $r = Invoke-FreshProofVerify -Name $parsed.ProofName -Hash $parsed.ProofHash -Facade $facade; Write-Output $r.Message; if ($r.Ok) { exit 0 } else { exit 1 } }
if ($parsed.Mode -eq "cleanup")  { $r = Invoke-FreshProofCleanup -Name $parsed.ProofName -Hash $parsed.ProofHash -Facade $facade; Write-Output $r.Message; if ($r.Ok) { exit 0 } else { exit 1 } }

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ---- 1. which secret ----
$Name = $parsed.Name
if (-not $Name) {
  $pick = New-Object System.Windows.Forms.Form
  $pick.Text = "Earned — which secret?"; $pick.Width = 420; $pick.Height = 170; $pick.StartPosition = "CenterScreen"; $pick.TopMost = $true
  $label = New-Object System.Windows.Forms.Label; $label.Text = "Choose the secret to store (it goes into YOUR Windows user variables only):"; $label.AutoSize = $true; $label.Left = 12; $label.Top = 12
  $combo = New-Object System.Windows.Forms.ComboBox; $combo.Left = 12; $combo.Top = 40; $combo.Width = 380; $combo.DropDownStyle = "DropDownList"
  $Allowed | ForEach-Object { [void]$combo.Items.Add($_) }; $combo.SelectedIndex = 0
  $okb = New-Object System.Windows.Forms.Button; $okb.Text = "Next"; $okb.Left = 300; $okb.Top = 80; $okb.Width = 92; $okb.DialogResult = "OK"
  $pick.Controls.AddRange(@($label, $combo, $okb)); $pick.AcceptButton = $okb
  if ($pick.ShowDialog() -ne "OK") { Write-Output "store-secret: cancelled"; exit 2 }
  $Name = [string]$combo.SelectedItem
}
if (-not (Test-AllowedSecretName $Name)) { Write-Output "store-secret: refused — the variable name is not one of: $AllowedText (the name given is not echoed)"; exit 3 }

# ---- 1b. an existing value is never overwritten silently (its content is never shown) ----
if (Test-SecretPresent -Name $Name -Facade $facade) {
  $ans = [System.Windows.Forms.MessageBox]::Show("A value for $Name already exists in your Windows user environment (it is not shown).`n`nReplace it with the one you are about to paste?", "Earned — replace existing value?", "YesNo", "Warning")
  if ($ans -ne "Yes") { Write-Output "store-secret: cancelled — existing $Name kept"; exit 2 }
}

# ---- 2. the value, masked ----
$form = New-Object System.Windows.Forms.Form
$form.Text = "Earned — paste the value of $Name"; $form.Width = 520; $form.Height = 200; $form.StartPosition = "CenterScreen"; $form.TopMost = $true
$l2 = New-Object System.Windows.Forms.Label; $l2.Text = "Paste the secret below (shown as dots). It is stored as a Windows USER environment variable`nnamed $Name and nowhere else (this is your Windows profile, not an encrypted vault).`nAfterwards open Claude Code / a terminal FRESH from the Start menu so they see it."; $l2.AutoSize = $true; $l2.Left = 12; $l2.Top = 12
$box = New-Object System.Windows.Forms.TextBox; $box.Left = 12; $box.Top = 74; $box.Width = 480; $box.UseSystemPasswordChar = $true
$ok2 = New-Object System.Windows.Forms.Button; $ok2.Text = "Store"; $ok2.Left = 400; $ok2.Top = 112; $ok2.Width = 92; $ok2.DialogResult = "OK"
$cancel = New-Object System.Windows.Forms.Button; $cancel.Text = "Cancel"; $cancel.Left = 300; $cancel.Top = 112; $cancel.Width = 92; $cancel.DialogResult = "Cancel"
$form.Controls.AddRange(@($l2, $box, $ok2, $cancel)); $form.AcceptButton = $ok2; $form.CancelButton = $cancel
$box.Select()
if ($form.ShowDialog() -ne "OK") { Write-Output "store-secret: cancelled"; exit 2 }
$value = $box.Text.Trim()
$box.Text = ""   # drop the widget's copy
if (-not $value) { Write-Output "store-secret: nothing entered; nothing stored"; exit 4 }

# ---- 3. store + verify (by comparison only; neither the value nor its length is ever printed) ----
$r = Invoke-StoreSecret -Name $Name -Value $value -Facade $facade
$value = $null
if ($r.Ok) {
  [System.Windows.Forms.MessageBox]::Show("Stored $Name in your Windows user environment (value not shown).`n`nNow CLOSE Claude Code and any terminal, and open them again FRESH from the Start menu or taskbar — a window opened from an already-running program keeps the old environment and will not see it.", "Earned — stored", "OK", "Information") | Out-Null
  Write-Output $r.Message; exit 0
}
[System.Windows.Forms.MessageBox]::Show(($r.Message + "`n`nNothing was printed. Try again; if it repeats, report the outcome word only."), "Earned — not stored", "OK", "Error") | Out-Null
Write-Output $r.Message
exit 1
