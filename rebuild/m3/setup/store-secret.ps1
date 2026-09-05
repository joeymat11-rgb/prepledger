# store-secret.ps1 — companion of store-secret.cmd (Windows). Stores ONE secret as a USER environment variable.
#   · the value is typed into a MASKED box (PasswordChar), never shown, never echoed, never logged
#   · written with [Environment]::SetEnvironmentVariable(name, value, 'User') → HKCU\Environment, nothing else
#   · the only thing printed is the variable NAME and the LENGTH of what was stored
#   · --selftest stores a throw-away value under EARNED_SELFTEST_VAR, reads it back, compares, deletes it, prints OK/FAIL
#   · --name <VAR> skips the chooser; allowed names are listed below (add here, nowhere else)
param(
  [string]$Name = "",
  [switch]$SelfTest
)
$ErrorActionPreference = "Stop"
$Allowed = @("CLOUDFLARE_API_TOKEN", "CLERK_SECRET_KEY")

function Store-UserVar([string]$n, [string]$v) {
  [Environment]::SetEnvironmentVariable($n, $v, "User")
  $back = [Environment]::GetEnvironmentVariable($n, "User")
  return ($back -eq $v)
}

if ($SelfTest) {
  $n = "EARNED_SELFTEST_VAR"
  $bytes = New-Object byte[] 24; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $v = [Convert]::ToBase64String($bytes)
  $ok = Store-UserVar $n $v
  $len = ([Environment]::GetEnvironmentVariable($n, "User")).Length
  [Environment]::SetEnvironmentVariable($n, $null, "User")   # remove
  $gone = -not [Environment]::GetEnvironmentVariable($n, "User")
  if ($ok -and $gone -and $len -eq $v.Length) { Write-Output "store-secret selftest OK — $n round-tripped ($len chars) and was removed"; exit 0 }
  Write-Output "store-secret selftest FAIL — stored=$ok removed=$gone length=$len"; exit 1
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ---- 1. which secret ----
if (-not $Name) {
  $pick = New-Object System.Windows.Forms.Form
  $pick.Text = "Earned — which secret?"; $pick.Width = 420; $pick.Height = 170; $pick.StartPosition = "CenterScreen"; $pick.TopMost = $true
  $label = New-Object System.Windows.Forms.Label; $label.Text = "Choose the secret to store (it goes into YOUR Windows user variables only):"; $label.AutoSize = $true; $label.Left = 12; $label.Top = 12
  $combo = New-Object System.Windows.Forms.ComboBox; $combo.Left = 12; $combo.Top = 40; $combo.Width = 380; $combo.DropDownStyle = "DropDownList"
  $Allowed | ForEach-Object { [void]$combo.Items.Add($_) }; $combo.SelectedIndex = 0
  $okb = New-Object System.Windows.Forms.Button; $okb.Text = "Next"; $okb.Left = 300; $okb.Top = 80; $okb.Width = 92; $okb.DialogResult = "OK"
  $pick.Controls.AddRange(@($label, $combo, $okb)); $pick.AcceptButton = $okb
  if ($pick.ShowDialog() -ne "OK") { Write-Output "cancelled"; exit 2 }
  $Name = [string]$combo.SelectedItem
}
if ($Allowed -notcontains $Name) { Write-Output "refused: '$Name' is not one of: $($Allowed -join ', ')"; exit 3 }

# ---- 2. the value, masked ----
$form = New-Object System.Windows.Forms.Form
$form.Text = "Earned — paste the value of $Name"; $form.Width = 520; $form.Height = 190; $form.StartPosition = "CenterScreen"; $form.TopMost = $true
$l2 = New-Object System.Windows.Forms.Label; $l2.Text = "Paste the secret below (shown as dots). It is stored as a Windows USER environment variable`nnamed $Name and nowhere else. Restart Claude Code / terminals afterwards."; $l2.AutoSize = $true; $l2.Left = 12; $l2.Top = 12
$box = New-Object System.Windows.Forms.TextBox; $box.Left = 12; $box.Top = 60; $box.Width = 480; $box.UseSystemPasswordChar = $true
$ok2 = New-Object System.Windows.Forms.Button; $ok2.Text = "Store"; $ok2.Left = 400; $ok2.Top = 100; $ok2.Width = 92; $ok2.DialogResult = "OK"
$cancel = New-Object System.Windows.Forms.Button; $cancel.Text = "Cancel"; $cancel.Left = 300; $cancel.Top = 100; $cancel.Width = 92; $cancel.DialogResult = "Cancel"
$form.Controls.AddRange(@($l2, $box, $ok2, $cancel)); $form.AcceptButton = $ok2; $form.CancelButton = $cancel
$box.Select()
if ($form.ShowDialog() -ne "OK") { Write-Output "cancelled"; exit 2 }
$value = $box.Text.Trim()
$box.Text = ""   # drop the widget's copy
if (-not $value) { Write-Output "nothing entered; nothing stored"; exit 4 }

# ---- 3. store + verify (by comparison only; the value is never printed) ----
$stored = Store-UserVar $Name $value
$len = $value.Length
$value = $null
if ($stored) {
  [System.Windows.Forms.MessageBox]::Show("Stored $Name ($len characters) in your Windows user environment.`n`nClose and reopen Claude Code / any terminal so they pick it up.", "Earned — stored", "OK", "Information") | Out-Null
  Write-Output "stored $Name ($len chars) as a USER environment variable"; exit 0
}
[System.Windows.Forms.MessageBox]::Show("Could not verify the stored value of $Name. Nothing was printed. Try again.", "Earned — not stored", "OK", "Error") | Out-Null
Write-Output "FAILED to store $Name"; exit 1
