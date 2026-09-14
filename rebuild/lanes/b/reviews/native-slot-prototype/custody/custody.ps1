function Get-SlotHash([byte[]]$Bytes) { ([BitConverter]::ToString(([Security.Cryptography.SHA256]::Create()).ComputeHash($Bytes))).Replace('-','').ToLowerInvariant() }
function Get-SlotBlob([string]$Ref) {
  $slotInfo=[Diagnostics.ProcessStartInfo]::new(); $slotInfo.FileName='git'; $slotInfo.Arguments='cat-file blob '+$Ref; $slotInfo.UseShellExecute=$false; $slotInfo.CreateNoWindow=$true; $slotInfo.RedirectStandardOutput=$true; $slotInfo.RedirectStandardError=$true; $slotInfo.WorkingDirectory=(Get-Location).Path
  $slotProcess=[Diagnostics.Process]::Start($slotInfo); $slotMemory=[IO.MemoryStream]::new(); $slotProcess.StandardOutput.BaseStream.CopyTo($slotMemory); $slotError=$slotProcess.StandardError.ReadToEnd(); $slotProcess.WaitForExit(); if($slotProcess.ExitCode -ne 0){throw $slotError}; return ,$slotMemory.ToArray()
}
