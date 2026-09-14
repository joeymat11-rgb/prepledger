$ErrorActionPreference='Stop'
. '.tmp/native-slot/custody.ps1'
$slotWorkRoot=(Get-Location).Path
$slotToolRoot=Join-Path $slotWorkRoot '.tmp/native-slot/toolchain'
[IO.Directory]::CreateDirectory($slotToolRoot)|Out-Null
function Get-SafeSlotPath([string]$Name,[string]$Root) {
  if(-not $Name -or $Name.Contains('\') -or $Name.Contains(':') -or $Name.StartsWith('/')){throw "Unsafe archive path: $Name"}
  $slotParts=$Name.TrimEnd('/') -split '/'
  foreach($slotPart in $slotParts){if(-not $slotPart -or $slotPart -eq '.' -or $slotPart -eq '..' -or $slotPart -match '[ .]$' -or $slotPart -match '^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)'){throw "Unsafe member component: $Name"}}
  $slotFull=[IO.Path]::GetFullPath((Join-Path $Root $Name))
  if(-not $slotFull.StartsWith($Root+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Archive escapes own extraction root'}
  return $slotFull
}
$slotZipPath=Join-Path $slotWorkRoot '.tmp/native-slot/downloads/zig-x86_64-windows-0.15.2.zip'
if((Get-FileHash -LiteralPath $slotZipPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne '3a0ed1e8799a2f8ce2a6e6290a9ff22e6906f8227865911fb7ddedc3cc14cb0c'){throw 'Zig pre-extraction hash mismatch'}
$slotZip=[IO.Compression.ZipFile]::OpenRead($slotZipPath)
$slotSeen=[Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
foreach($slotEntry in $slotZip.Entries){$slotSafe=Get-SafeSlotPath $slotEntry.FullName $slotToolRoot;if(-not $slotSeen.Add($slotEntry.FullName.TrimEnd('/'))){throw 'Duplicate/case-colliding zip name'};$slotMode=($slotEntry.ExternalAttributes -shr 16) -band 61440;if($slotMode -eq 40960 -or ($slotMode -ne 0 -and $slotMode -ne 32768 -and $slotMode -ne 16384)){throw 'Unsupported zip link or special entry'}}
$slotZipRecords=[Collections.Generic.List[object]]::new()
foreach($slotEntry in $slotZip.Entries){$slotDest=Get-SafeSlotPath $slotEntry.FullName $slotToolRoot;if($slotEntry.FullName.EndsWith('/')){[IO.Directory]::CreateDirectory($slotDest)|Out-Null;continue};[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($slotDest))|Out-Null;$slotInput=$slotEntry.Open();$slotOutput=[IO.File]::Open($slotDest,[IO.FileMode]::CreateNew,[IO.FileAccess]::Write);try{$slotInput.CopyTo($slotOutput)}finally{$slotOutput.Dispose();$slotInput.Dispose()};$slotActual=(Get-Item -LiteralPath $slotDest).Length;if($slotActual -ne $slotEntry.Length){throw 'Zip extraction size mismatch'};$slotZipRecords.Add([pscustomobject]@{member=$slotEntry.FullName;bytes=$slotActual;sha256=(Get-FileHash -LiteralPath $slotDest -Algorithm SHA256).Hash.ToLowerInvariant()})}
$slotZip.Dispose()
[IO.File]::WriteAllText((Join-Path $slotWorkRoot '.tmp/native-slot/zig-extraction.json'),([ordered]@{archiveSha256='3a0ed1e8799a2f8ce2a6e6290a9ff22e6906f8227865911fb7ddedc3cc14cb0c';headersChecked=$slotSeen.Count;files=$slotZipRecords;safeUniqueNames=$true;executed=$false}|ConvertTo-Json -Depth 8)+"`n",[Text.UTF8Encoding]::new($false))
Write-Output "Zig safely extracted: $($slotZipRecords.Count) regular files"
$slotHeaderPath=Join-Path $slotWorkRoot '.tmp/native-slot/downloads/node-v22.23.2-headers.tar.gz'
if((Get-FileHash -LiteralPath $slotHeaderPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne 'daaf13ec5d45a38bbcfcff06d0723f72a6813b89ab27bb5af2ac8e1f6259dde0'){throw 'Header pre-extraction hash mismatch'}
Add-Type -AssemblyName System.Formats.Tar
$slotHeaderNames=[Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$slotHeaderRecords=[Collections.Generic.List[object]]::new()
$slotHeaderStream=[IO.File]::OpenRead($slotHeaderPath);$slotGzip=[IO.Compression.GZipStream]::new($slotHeaderStream,[IO.Compression.CompressionMode]::Decompress);$slotTar=[System.Formats.Tar.TarReader]::new($slotGzip)
try {while($null -ne ($slotEntry=$slotTar.GetNextEntry())){$slotDest=Get-SafeSlotPath $slotEntry.Name $slotToolRoot;if(-not $slotHeaderNames.Add($slotEntry.Name.TrimEnd('/'))){throw 'Duplicate header archive member'};if($slotEntry.EntryType.ToString() -eq 'Directory'){[IO.Directory]::CreateDirectory($slotDest)|Out-Null;continue};if($slotEntry.EntryType.ToString() -notin @('RegularFile','V7RegularFile')){throw "Unsupported header entry: $($slotEntry.EntryType)"};[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($slotDest))|Out-Null;$slotOutput=[IO.File]::Open($slotDest,[IO.FileMode]::CreateNew,[IO.FileAccess]::Write);try{$slotEntry.DataStream.CopyTo($slotOutput)}finally{$slotOutput.Dispose()};$slotActual=(Get-Item -LiteralPath $slotDest).Length;if($slotActual -ne $slotEntry.Length){throw 'Header extraction size mismatch'};$slotHeaderRecords.Add([pscustomobject]@{member=$slotEntry.Name;bytes=$slotActual;sha256=(Get-FileHash -LiteralPath $slotDest -Algorithm SHA256).Hash.ToLowerInvariant()})}}finally{$slotTar.Dispose();$slotGzip.Dispose();$slotHeaderStream.Dispose()}
[IO.File]::WriteAllText((Join-Path $slotWorkRoot '.tmp/native-slot/header-extraction.json'),([ordered]@{archiveSha256='daaf13ec5d45a38bbcfcff06d0723f72a6813b89ab27bb5af2ac8e1f6259dde0';headersChecked=$slotHeaderNames.Count;files=$slotHeaderRecords;safeUniqueNames=$true;executed=$false}|ConvertTo-Json -Depth 8)+"`n",[Text.UTF8Encoding]::new($false))
Write-Output "Node headers safely extracted: $($slotHeaderRecords.Count) regular files"
