# store-secret.ps1 — companion of store-secret.cmd (Windows). Stores ONE secret as a Windows USER environment variable.
#   · the value is typed into a MASKED box (dots), never shown, never echoed, never logged, never measured
#   · written with [Environment]::SetEnvironmentVariable(name, value, 'User') → HKCU\Environment, nothing else.
#     That store is the current user's profile, protected by the Windows account only — it is NOT an encrypted vault.
#   · the ONLY things ever printed are the variable NAME and an OUTCOME word (stored / unverified / failed / cancelled)
#   · --selftest  uses a collision-checked TEMPORARY variable it owns (EARNED_SELFTEST_<random>), never a fixed name;
#                 it removes only a value carrying its own marker, and always attempts cleanup in a finally block
#   · --name <VAR> skips the chooser; allowed names are the two below (add here, nowhere else)
#   · -AsLibrary  defines the functions and returns (used by test\store-secret.tests.ps1 with in-memory facades)
#   exit codes: 0 stored/ok · 1 failed or unverified · 2 cancelled · 3 refused name · 4 empty value · 5 unknown argument
$ErrorActionPreference = "Stop"
$Allowed = @("CLOUDFLARE_API_TOKEN", "CLERK_SECRET_KEY")
$SelfTestPrefix  = "EARNED_SELFTEST_"          # variable NAME prefix for the throw-away variable
$OwnedMarker     = "EARNED-SELFTEST-OWNED-"    # VALUE prefix that proves the throw-away variable is ours
$SelfTestAttempts = 8

# ---------------------------------------------------------------- core (pure with respect to Windows; talks to a facade) ----
# A facade is an object with two script blocks: .Get(name) → value or $null ; .Set(name, value) ; Set(name, $null) removes.
function New-UserEnvFacade {
  return [pscustomobject]@{
    Get = { param($n) [Environment]::GetEnvironmentVariable($n, "User") }
    Set = { param($n, $v) [Environment]::SetEnvironmentVariable($n, $v, "User") }
  }
}

function Parse-StoreSecretArgs([object[]]$argv) {
  $r = [pscustomobject]@{ Mode = "store"; Name = ""; ExitCode = 0; Message = "" }
  $i = 0
  while ($i -lt $argv.Count) {
    $a = [string]$argv[$i]
    switch -Regex ($a) {
      '^(--selftest|-SelfTest|/selftest)$' { $r.Mode = "selftest"; $i++; continue }
      '^(--help|-h|-\?|/\?)$'              { $r.Mode = "help"; $i++; continue }
      '^(--name|-Name)$' {
        if ($i + 1 -ge $argv.Count) { $r.Mode = "error"; $r.ExitCode = 5; $r.Message = "store-secret: --name needs a variable name"; return $r }
        $r.Name = [string]$argv[$i + 1]; $i += 2; continue
      }
      '^(-AsLibrary)$'                     { $r.Mode = "library"; $i++; continue }
      default { $r.Mode = "error"; $r.ExitCode = 5; $r.Message = "store-secret: unknown argument '$a' (use --selftest, --name <VAR>, --help)"; return $r }
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

# Store one value. Never puts the value or its length into the result. Truthful outcomes:
#   stored · unverified-readback-mismatch (write accepted, read-back differs — do NOT assume it is stored) · set-failed
function Invoke-StoreSecret([string]$Name, [string]$Value, $Facade) {
  if (-not (Test-AllowedSecretName $Name)) {
    return [pscustomobject]@{ Ok = $false; Outcome = "refused-name"; Message = "store-secret: refused — '$Name' is not one of: $($Allowed -join ', ')" }
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

function New-HexToken { $b = New-Object byte[] 4; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); return (($b | ForEach-Object { $_.ToString("x2") }) -join "") }

# Dummy-only self-test of the persistence mechanism through the facade:
#   pick a temporary name that does NOT exist (collision-checked, up to $SelfTestAttempts tries), write an OWNED marker value,
#   read it back, then in finally: remove it only if the current value still carries our marker; a foreign value is left alone.
function Invoke-SelfTest($Facade, [scriptblock]$Rng = $null) {
  if ($null -eq $Rng) { $Rng = ${function:New-HexToken} }
  $res = [pscustomobject]@{ Ok = $false; Outcome = "not-started"; Name = ""; Message = "" }
  $name = $null
  for ($k = 0; $k -lt $SelfTestAttempts; $k++) {
    $cand = $SelfTestPrefix + [string](& $Rng)
    if ([string]::IsNullOrEmpty([string](& $Facade.Get $cand))) { $name = $cand; break }
  }
  if ($null -eq $name) { $res.Outcome = "collision-exhausted"; $res.Message = "store-secret selftest FAIL — could not find a free temporary variable name after $SelfTestAttempts tries; nothing written"; return $res }
  $res.Name = $name
  $value = $OwnedMarker + [string](& $Rng)
  $written = $false
  try {
    try { & $Facade.Set $name $value; $written = $true }
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
    if ($written) {
      $cur = $null
      try { $cur = & $Facade.Get $name } catch { $cur = "<unreadable>" }
      if ($null -eq $cur -or [string]$cur -eq "") {
        # already gone — fine
      }
      elseif ([string]$cur -like ($OwnedMarker + "*")) {
        try {
          & $Facade.Set $name $null
          $gone = [string]::IsNullOrEmpty([string](& $Facade.Get $name))
          if (-not $gone) { $res.Ok = $false; $res.Outcome = "cleanup-failed"; $res.Message = "store-secret selftest FAIL — the temporary variable $name could not be removed; remove it by hand (it holds only a dummy marker)" }
        } catch { $res.Ok = $false; $res.Outcome = "cleanup-failed"; $res.Message = "store-secret selftest FAIL — removing the temporary variable $name threw; remove it by hand (it holds only a dummy marker)" }
      }
      else {
        # the value is no longer ours: another process changed it between write and cleanup — never delete a foreign value
        $res.Ok = $false
        if ($res.Outcome -eq "ok") { $res.Outcome = "foreign-value-not-removed" }
        $res.Message = "store-secret selftest FAIL — $name no longer holds our marker (changed by something else); it was NOT removed; inspect it by hand"
      }
    }
  }
}

# ---------------------------------------------------------------- entry --------------------------------------------------------
$parsed = Parse-StoreSecretArgs $args
if ($parsed.Mode -eq "library") { return }
if ($parsed.Mode -eq "error")   { Write-Output $parsed.Message; exit $parsed.ExitCode }
if ($parsed.Mode -eq "help") {
  Write-Output "store-secret.cmd            interactive: choose the variable, paste the value into a masked box"
  Write-Output "store-secret.cmd --name CLOUDFLARE_API_TOKEN | CLERK_SECRET_KEY"
  Write-Output "store-secret.cmd --selftest  dummy-only round trip through a temporary owned variable; no real secret involved"
  exit 0
}

$facade = New-UserEnvFacade

if ($parsed.Mode -eq "selftest") {
  $r = Invoke-SelfTest -Facade $facade
  Write-Output $r.Message
  if ($r.Ok) { exit 0 } else { exit 1 }
}

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
if (-not (Test-AllowedSecretName $Name)) { Write-Output "store-secret: refused — '$Name' is not one of: $($Allowed -join ', ')"; exit 3 }

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
