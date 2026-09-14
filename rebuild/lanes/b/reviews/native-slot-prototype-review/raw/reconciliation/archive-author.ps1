$ErrorActionPreference = 'Stop'
$taskRoot = 'C:/Users/joeym/Documents/prepledger-dev/work/pm-caretaker/native-slot-prototype-review-er'
if ([IO.Path]::GetFullPath((Get-Location).Path) -ne [IO.Path]::GetFullPath($taskRoot)) { throw 'Wrong review root' }
$authorRef = '9cc78e7701957569fd603b9013d2ac454dacb2dd'
$candidateRef = '2592f091f9cd2956f5f6c442d36c8763e247cff6'
$baseRef = '126fac49474ab2ba8e3dccf7ceb0707ddf65d113'
$firstRef = 'dd4ae18da24a614d468ced172cdf5cc89766d402'
$authorRoot = 'rebuild/lanes/b/reviews/native-slot-prototype/'
$reviewRoot = 'rebuild/lanes/b/reviews/native-slot-prototype-review/'
$utf8 = [Text.UTF8Encoding]::new($false, $true)
function GitBytes([string[]]$GitArgs) {
  $start = [Diagnostics.ProcessStartInfo]::new('git')
  $start.WorkingDirectory = $taskRoot
  $start.UseShellExecute = $false
  $start.CreateNoWindow = $true
  $start.RedirectStandardOutput = $true
  $start.RedirectStandardError = $true
  foreach ($arg in $GitArgs) { $start.ArgumentList.Add($arg) }
  $process = [Diagnostics.Process]::Start($start)
  $errTask = $process.StandardError.ReadToEndAsync()
  $buffer = [IO.MemoryStream]::new()
  $process.StandardOutput.BaseStream.CopyTo($buffer)
  $process.WaitForExit()
  if ($process.ExitCode -ne 0) { throw ('Git read failed: ' + $errTask.Result) }
  return ,$buffer.ToArray()
}
function Sha([AllowEmptyCollection()][byte[]]$Bytes) {
  [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($Bytes)).ToLowerInvariant()
}
function GitText([string[]]$GitArgs) { $utf8.GetString((GitBytes $GitArgs)) }
function SaveExact([string]$Relative, [AllowEmptyCollection()][byte[]]$Bytes) {
  if (-not $Relative.StartsWith($reviewRoot + 'raw/author/') -or $Relative.Contains('..')) { throw 'Unlicensed copy path' }
  $dest = [IO.Path]::GetFullPath((Join-Path $taskRoot $Relative))
  $allowed = [IO.Path]::GetFullPath((Join-Path $taskRoot ($reviewRoot + 'raw/author/')))
  if (-not $dest.StartsWith($allowed, [StringComparison]::OrdinalIgnoreCase)) { throw 'Copy escaped own review' }
  if (Test-Path -LiteralPath $dest) {
    if ((Sha ([IO.File]::ReadAllBytes($dest))) -ne (Sha $Bytes)) { throw ('Existing copy differs: ' + $Relative) }
  } else {
    [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($dest)) | Out-Null
    [IO.File]::WriteAllBytes($dest, $Bytes)
  }
}
$summaries = @(
  [pscustomobject]@{path='rebuild/lanes/b/BUILD-NATIVE-SLOT-PROTOTYPE.md';bytes=8740;sha256='865685263ec740528f4710f831878d188dd479192d228e9863403838d06849fe'},
  [pscustomobject]@{path=$authorRoot+'INDEX.md';bytes=1796;sha256='a9c25188a0d7bf73a947b07174ab3c3e5181c56f220198d3e0dc2b110d3377a1'},
  [pscustomobject]@{path=$authorRoot+'INPUT-CUSTODY.json';bytes=4073;sha256='48f800c314f4dc1f7ee848f98fc2bc745f0bc1916563efd607fc1d1390f4436e'},
  [pscustomobject]@{path=$authorRoot+'SOURCES.json';bytes=11498;sha256='2cc580ca38bbe4b9ad078bf4ebcc25a4b37572962a776bcdd1cfd67d46ba3141'},
  [pscustomobject]@{path=$authorRoot+'MAPPING.json';bytes=77387;sha256='6e0b95b6bab6a07fbad74a395b3f725d139ada4f55eef4dafd133683064daa6f'}
)
$copies = [Collections.Generic.List[object]]::new()
foreach ($summary in $summaries) {
  $bytes = GitBytes @('show', ($authorRef + ':' + $summary.path))
  if ($bytes.Length -ne $summary.bytes -or (Sha $bytes) -ne $summary.sha256) { throw ('Summary identity mismatch: ' + $summary.path) }
  $dest = $reviewRoot + 'raw/author/' + [IO.Path]::GetFileName($summary.path)
  SaveExact $dest $bytes
  $copies.Add([pscustomobject]@{kind='authored';authorPath=$summary.path;copyPath=$dest;bytes=$bytes.Length;sha256=(Sha $bytes)})
}
$mapping = $utf8.GetString((GitBytes @('show', ($authorRef + ':' + $authorRoot + 'MAPPING.json')))) | ConvertFrom-Json
if ($mapping.files.Count -ne 249 -or $mapping.copiedFiles -ne 249 -or $mapping.copiedBytes -ne 5490494) { throw 'Author mapping totals mismatch' }
$seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$allowedExtensions = @('.c','.cjs','.h','.html','.json','.md','.ps1','.raw','.stderr','.stdout','.txt')
[long]$mappedBytes = 0
foreach ($entry in $mapping.files) {
  if (-not $entry.copyPath.StartsWith($authorRoot) -or $entry.copyPath.Contains('..') -or -not $seen.Add($entry.copyPath)) { throw 'Invalid/duplicate author path' }
  if ([IO.Path]::GetExtension($entry.copyPath) -notin $allowedExtensions) { throw 'Non-text artifact not licensed for copy' }
  $bytes = GitBytes @('show', ($authorRef + ':' + $entry.copyPath))
  if ($bytes.Length -ne $entry.bytes -or (Sha $bytes) -ne $entry.sha256) { throw ('Mapped blob differs: ' + $entry.copyPath) }
  $null = $utf8.GetString($bytes)
  $dest = $reviewRoot + 'raw/author/' + $entry.copyPath.Substring($authorRoot.Length)
  SaveExact $dest $bytes
  $copies.Add([pscustomobject]@{kind='mapped';authorOriginalPath=$entry.originalPath;authorPath=$entry.copyPath;copyPath=$dest;bytes=$bytes.Length;sha256=(Sha $bytes)})
  $mappedBytes += $bytes.Length
}
if ($mappedBytes -ne 5490494) { throw 'Mapped byte total differs' }
$authorPaths = (GitText @('ls-tree','-r','--name-only',$authorRef)).Split([char]10, [StringSplitOptions]::RemoveEmptyEntries)
$basePaths = (GitText @('ls-tree','-r','--name-only',$baseRef)).Split([char]10, [StringSplitOptions]::RemoveEmptyEntries)
$candidatePaths = (GitText @('ls-tree','-r','--name-only',$candidateRef)).Split([char]10, [StringSplitOptions]::RemoveEmptyEntries)
$diff = (GitText @('diff','--name-status',$baseRef,$authorRef)).Split([char]10, [StringSplitOptions]::RemoveEmptyEntries)
if ($basePaths.Count -ne 2368 -or $candidatePaths.Count -ne 2373 -or $authorPaths.Count -ne 2627 -or $diff.Count -ne 259) { throw 'Full Git inventory differs' }
foreach ($line in $diff) {
  $parts = $line.Split([char]9)
  if ($parts[0] -ne 'A' -or (-not $parts[1].StartsWith($authorRoot) -and -not $parts[1].StartsWith('rebuild/lanes/b/tooling/native-slot-prototype/') -and $parts[1] -ne 'rebuild/lanes/b/BUILD-NATIVE-SLOT-PROTOTYPE.md')) { throw 'Unlicensed author change' }
}
$supportPaths = @($authorPaths | Where-Object { $_.StartsWith($authorRoot) })
$expectedSupport = @($mapping.files.copyPath) + @($summaries.path | Where-Object { $_.StartsWith($authorRoot) })
if ($supportPaths.Count -ne 253 -or @(Compare-Object $supportPaths $expectedSupport).Count -ne 0) { throw 'Author support set is not fully accounted for' }
if ((GitText @('diff','--name-only',$candidateRef,$authorRef,'--','rebuild/lanes/b/tooling/native-slot-prototype/')).Trim().Length -ne 0) { throw 'Source changed after checkpoint' }
$candidateSources = @($mapping.files | Where-Object { $_.copyPath.StartsWith($authorRoot + 'source-2592f09/') })
foreach ($entry in $candidateSources) {
  $source = 'rebuild/lanes/b/tooling/native-slot-prototype/' + $entry.copyPath.Substring(($authorRoot + 'source-2592f09/').Length)
  if ((Sha (GitBytes @('show', ($candidateRef + ':' + $source)))) -ne $entry.sha256) { throw 'Author source copy differs from candidate' }
  if ((Sha ([IO.File]::ReadAllBytes((Join-Path $taskRoot $source)))) -ne $entry.sha256) { throw 'Own candidate changed' }
}
[long]$total = 0
foreach ($copy in $copies) { $total += $copy.bytes }
$result = [pscustomobject]@{
  version=1;authorRef=$authorRef;candidateRef=$candidateRef;baseRef=$baseRef;immutableFirstAssessmentRef=$firstRef
  meaning='Every mapped public Git blob and all five authored report/custody records verified and copied after the independent first assessment; historical original paths are claims, not reads of another actor workspace.'
  authorMappedFiles=249;authorMappedBytes=$mappedBytes;authoredRecords=5;copiedFiles=$copies.Count;copiedBytes=$total
  fullGitInventory=[pscustomobject]@{base=2368;candidate=2373;authorFinal=2627;addedOnly=259;sourceFiles=5;supportFiles=253;reportFiles=1;allSupportAccountedFor=$true;sourceUnchanged=$true}
  files=$copies
}
$json = ($result | ConvertTo-Json -Depth 8).Replace([string][char]13, '') + [char]10
[IO.File]::WriteAllText((Join-Path $taskRoot ($reviewRoot + 'MAPPING-AUTHOR.json')), $json, $utf8)
$result | Select-Object authorRef,authorMappedFiles,authorMappedBytes,authoredRecords,copiedFiles,copiedBytes,fullGitInventory | ConvertTo-Json -Depth 4
