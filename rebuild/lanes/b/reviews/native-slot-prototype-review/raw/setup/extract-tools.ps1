$ErrorActionPreference = 'Stop'
$taskRoot = (Get-Location).Path
if ($taskRoot -ne 'C:\Users\joeym\Documents\prepledger-dev\work\pm-caretaker\native-slot-prototype-review-er') { throw 'Wrong own root' }
$taskScratch = Join-Path $taskRoot '.tmp/native-slot'
$taskTarget = Join-Path $taskScratch 'toolchain'
$taskUtf8 = [Text.UTF8Encoding]::new($false)
function Write-TaskJson([string]$taskPath, $taskValue) {
  [IO.File]::WriteAllText($taskPath, (($taskValue | ConvertTo-Json -Depth 10).Replace("`r`n", "`n") + "`n"), $taskUtf8)
}
function Resolve-TaskMember([string]$taskMember, [string]$taskTop) {
  if (!$taskMember.StartsWith($taskTop + '/', [StringComparison]::Ordinal) -and $taskMember.TrimEnd('/') -ne $taskTop) { throw "Wrong archive root: $taskMember" }
  if ($taskMember -match '[\\:\x00-\x1f]' -or $taskMember.StartsWith('/')) { throw "Unsafe archive member: $taskMember" }
  $taskParts = $taskMember.TrimEnd('/').Split('/')
  foreach ($taskPart in $taskParts) {
    if (!$taskPart -or $taskPart -in @('.', '..') -or $taskPart.EndsWith('.') -or $taskPart.EndsWith(' ') -or $taskPart -match '^(?i:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)') { throw "Unsafe archive component: $taskMember" }
  }
  $taskResolved = [IO.Path]::GetFullPath((Join-Path $taskTarget $taskMember))
  if (!$taskResolved.StartsWith($taskTarget + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Archive path escapes own toolchain root' }
  return $taskResolved
}
function Hash-TaskFile([string]$taskPath) {
  $taskStream = [IO.File]::OpenRead($taskPath)
  try { return [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($taskStream)).ToLowerInvariant() }
  finally { $taskStream.Dispose() }
}
try {
  $taskPins = Get-Content -LiteralPath (Join-Path $taskScratch 'NATIVE-SLOT-PROTOTYPE-INPUTS.json') -Raw | ConvertFrom-Json
  $taskZipPath = Join-Path $taskScratch 'downloads/zig-x86_64-windows-0.15.2.zip'
  if ((Hash-TaskFile $taskZipPath) -ne $taskPins.toolchain.windowsX64.shasum) { throw 'Compiler archive pin mismatch before extraction' }
  [IO.Directory]::CreateDirectory($taskTarget) | Out-Null
  $taskZip = [IO.Compression.ZipFile]::OpenRead($taskZipPath)
  try {
    $taskSeen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    foreach ($taskEntry in $taskZip.Entries) {
      $null = Resolve-TaskMember $taskEntry.FullName 'zig-x86_64-windows-0.15.2'
      if (!$taskSeen.Add($taskEntry.FullName.TrimEnd('/'))) { throw "Duplicate archive member: $($taskEntry.FullName)" }
      if ((($taskEntry.ExternalAttributes -shr 16) -band 0xf000) -eq 0xa000) { throw 'Archive symlinks are not licensed' }
    }
    $taskFiles = [Collections.Generic.List[object]]::new()
    foreach ($taskEntry in $taskZip.Entries) {
      $taskOut = Resolve-TaskMember $taskEntry.FullName 'zig-x86_64-windows-0.15.2'
      if ($taskEntry.FullName.EndsWith('/')) { [IO.Directory]::CreateDirectory($taskOut) | Out-Null; continue }
      [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($taskOut)) | Out-Null
      $taskFrom = $taskEntry.Open()
      $taskTo = [IO.File]::Open($taskOut, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
      try { $taskFrom.CopyTo($taskTo) } finally { $taskTo.Dispose(); $taskFrom.Dispose() }
      if ((Get-Item -LiteralPath $taskOut).Length -ne $taskEntry.Length) { throw 'Extracted compiler file length mismatch' }
      $taskFiles.Add([ordered]@{member=$taskEntry.FullName; bytes=$taskEntry.Length; sha256=(Hash-TaskFile $taskOut)})
      if ($taskFiles.Count % 2000 -eq 0) { Write-Output ('Verified compiler files: ' + $taskFiles.Count) }
    }
    Write-TaskJson (Join-Path $taskScratch 'zig-extraction.json') ([ordered]@{archiveSha256=$taskPins.toolchain.windowsX64.shasum; safeUniqueMembers=$taskSeen.Count; files=$taskFiles.ToArray()})
    Write-Output ('Compiler extraction complete: ' + $taskFiles.Count + ' files')
  } finally { $taskZip.Dispose() }
  Add-Type -AssemblyName System.Formats.Tar
  $taskTarPath = Join-Path $taskScratch 'downloads/node-v22.23.2-headers.tar.gz'
  $taskTarPin = ($taskPins.runtimeAndHeaders.files | Where-Object path -eq 'node-v22.23.2-headers.tar.gz').sha256
  if ((Hash-TaskFile $taskTarPath) -ne $taskTarPin) { throw 'Header archive pin mismatch before extraction' }
  $taskSeen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  foreach ($taskPass in 1..2) {
    $taskFileStream = [IO.File]::OpenRead($taskTarPath)
    $taskGzip = [IO.Compression.GZipStream]::new($taskFileStream, [IO.Compression.CompressionMode]::Decompress)
    $taskReader = [System.Formats.Tar.TarReader]::new($taskGzip)
    $taskFiles = [Collections.Generic.List[object]]::new()
    try {
      while ($null -ne ($taskEntry = $taskReader.GetNextEntry())) {
        $taskOut = Resolve-TaskMember $taskEntry.Name 'node-v22.23.2'
        $taskType = $taskEntry.EntryType.ToString()
        if ($taskType -notin @('Directory', 'RegularFile', 'V7RegularFile')) { throw "Unlicensed tar member type: $taskType $($taskEntry.Name)" }
        if ($taskPass -eq 1) {
          if (!$taskSeen.Add($taskEntry.Name.TrimEnd('/'))) { throw "Duplicate header member: $($taskEntry.Name)" }
          continue
        }
        if ($taskType -eq 'Directory') { [IO.Directory]::CreateDirectory($taskOut) | Out-Null; continue }
        [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($taskOut)) | Out-Null
        $taskTo = [IO.File]::Open($taskOut, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
        try { if ($null -ne $taskEntry.DataStream) { $taskEntry.DataStream.CopyTo($taskTo) } } finally { $taskTo.Dispose() }
        if ((Get-Item -LiteralPath $taskOut).Length -ne $taskEntry.Length) { throw 'Extracted header file length mismatch' }
        $taskFiles.Add([ordered]@{member=$taskEntry.Name; bytes=$taskEntry.Length; sha256=(Hash-TaskFile $taskOut)})
      }
    } finally { $taskReader.Dispose(); $taskGzip.Dispose(); $taskFileStream.Dispose() }
  }
  Write-TaskJson (Join-Path $taskScratch 'header-extraction.json') ([ordered]@{archiveSha256=$taskTarPin; safeUniqueMembers=$taskSeen.Count; files=$taskFiles.ToArray()})
  Write-Output ('Header extraction complete: ' + $taskFiles.Count + ' files')
} catch {
  [IO.File]::WriteAllText((Join-Path $taskRoot '.tmp/native-slot-review-er/extraction-failure.txt'), ($_ | Out-String), $taskUtf8)
  throw
}
