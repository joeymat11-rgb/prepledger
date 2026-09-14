param([ValidateSet('build', 'delivered', 'controls')][string]$Phase)
$ErrorActionPreference = 'Stop'
$taskRoot = (Get-Location).Path
if ($taskRoot -ne 'C:\Users\joeym\Documents\prepledger-dev\work\pm-caretaker\native-slot-prototype-review-er') { throw 'Wrong own root' }
$taskScratch = Join-Path $taskRoot '.tmp/native-slot'
$taskNode = Join-Path $taskScratch 'runtime/node.exe'
$taskUtf8 = [Text.UTF8Encoding]::new($false)
$taskSource = '2592f091f9cd2956f5f6c442d36c8763e247cff6'
function Hash-TaskFile([string]$taskPath) { return (Get-FileHash -Algorithm SHA256 -LiteralPath $taskPath).Hash.ToLowerInvariant() }
if ((Hash-TaskFile $taskNode) -ne '0d0f5e39f9f3d9587bc19f73eab3c2c9c4903fd02d6dbf9c853dd81b3d95fad4') { throw 'Runtime pin mismatch' }
$taskInputs = Get-Content -LiteralPath '.tmp/native-slot-review-er/inputs/NATIVE-SLOT-PROTOTYPE-REVIEW-INPUTS.json' -Raw | ConvertFrom-Json
foreach ($taskInput in $taskInputs.sourceFiles) {
  if ((Hash-TaskFile (Join-Path $taskRoot $taskInput.path)) -ne $taskInput.sha256) { throw ('Candidate source changed: ' + $taskInput.path) }
}
$taskEvidence = Join-Path $taskRoot ('.tmp/native-slot-review-er/runs/' + $Phase)
if (Test-Path -LiteralPath $taskEvidence) { throw 'Evidence directory already exists; no automatic repeat' }
[IO.Directory]::CreateDirectory($taskEvidence) | Out-Null
$taskSystemRoot = [Environment]::GetEnvironmentVariable('SystemRoot')
if (!$taskSystemRoot) { throw 'SystemRoot unavailable' }
$taskEnvironment = [ordered]@{
  SystemRoot = $taskSystemRoot; WINDIR = $taskSystemRoot
  SystemDrive = [IO.Path]::GetPathRoot($taskSystemRoot).TrimEnd('\')
  ComSpec = Join-Path $taskSystemRoot 'System32/cmd.exe'
  PATH = Join-Path $taskSystemRoot 'System32'; PATHEXT = '.COM;.EXE;.BAT;.CMD'
  NODE_OPTIONS = ''; NODE_PATH = ''
  TEMP = Join-Path $taskScratch 'temp'; TMP = Join-Path $taskScratch 'temp'; TMPDIR = Join-Path $taskScratch 'temp'
  ZIG_GLOBAL_CACHE_DIR = Join-Path $taskScratch 'cache/global'; ZIG_LOCAL_CACHE_DIR = Join-Path $taskScratch 'cache/local'
}
foreach ($taskKey in @('TEMP', 'TMP', 'TMPDIR', 'ZIG_GLOBAL_CACHE_DIR', 'ZIG_LOCAL_CACHE_DIR')) { [IO.Directory]::CreateDirectory($taskEnvironment[$taskKey]) | Out-Null }
if ($Phase -eq 'build') {
  $taskArgs = @('rebuild/lanes/b/tooling/native-slot-prototype/build.cjs', 'er-independent-one', $taskSource)
} else {
  $taskRun = Join-Path $taskScratch ('runs/er-' + $Phase + '-one')
  if (Test-Path -LiteralPath $taskRun) { throw 'Run directory already exists' }
  [IO.Directory]::CreateDirectory($taskRun) | Out-Null
  $taskEnvironment.EARNED_SLOT_RUN_ROOT = $taskRun
  $taskEnvironment.EARNED_SLOT_BUILD_JSON = Join-Path $taskScratch 'builds/er-independent-one/build.json'
  $taskTest = if ($Phase -eq 'delivered') { 'rebuild/lanes/b/tooling/native-slot-prototype/test/prototype.test.cjs' } else { 'rebuild/lanes/b/reviews/native-slot-prototype-review/bounded-controls.cjs' }
  $taskArgs = @('--expose-gc', '--test', '--test-reporter=tap', $taskTest)
}
$taskStart = [Diagnostics.ProcessStartInfo]::new($taskNode)
$taskStart.WorkingDirectory = $taskRoot
$taskStart.UseShellExecute = $false
$taskStart.CreateNoWindow = $true
$taskStart.RedirectStandardOutput = $true
$taskStart.RedirectStandardError = $true
$taskStart.Environment.Clear()
foreach ($taskKey in $taskEnvironment.Keys) { $taskStart.Environment[$taskKey] = $taskEnvironment[$taskKey] }
foreach ($taskArg in $taskArgs) { $taskStart.ArgumentList.Add($taskArg) }
$taskRecord = [ordered]@{phase=$Phase; sourceHead=$taskSource; executable=$taskNode; executableSha256=(Hash-TaskFile $taskNode); args=$taskArgs; cwd=$taskRoot; environment=$taskEnvironment; startUtc=[DateTime]::UtcNow.ToString('o')}
$taskOutPath = Join-Path $taskEvidence 'stdout.raw'
$taskErrPath = Join-Path $taskEvidence 'stderr.raw'
$taskOut = [IO.File]::Open($taskOutPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::Read)
$taskErr = [IO.File]::Open($taskErrPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::Read)
try {
  $taskProcess = [Diagnostics.Process]::Start($taskStart)
  $taskRecord.pid = $taskProcess.Id
  $taskCopyOut = $taskProcess.StandardOutput.BaseStream.CopyToAsync($taskOut)
  $taskCopyErr = $taskProcess.StandardError.BaseStream.CopyToAsync($taskErr)
  $taskProcess.WaitForExit()
  $taskCopyOut.GetAwaiter().GetResult()
  $taskCopyErr.GetAwaiter().GetResult()
  $taskRecord.status = $taskProcess.ExitCode
} catch {
  $taskRecord.error = $_.Exception.Message
} finally {
  $taskOut.Dispose(); $taskErr.Dispose()
  $taskRecord.endUtc = [DateTime]::UtcNow.ToString('o')
  $taskRecord.stdout = [ordered]@{path=$taskOutPath; bytes=(Get-Item -LiteralPath $taskOutPath).Length; sha256=(Hash-TaskFile $taskOutPath)}
  $taskRecord.stderr = [ordered]@{path=$taskErrPath; bytes=(Get-Item -LiteralPath $taskErrPath).Length; sha256=(Hash-TaskFile $taskErrPath)}
  [IO.File]::WriteAllText((Join-Path $taskEvidence 'result.json'), (($taskRecord | ConvertTo-Json -Depth 9).Replace("`r`n", "`n") + "`n"), $taskUtf8)
}
Write-Output ($taskRecord | ConvertTo-Json -Depth 5)
if ($taskRecord.Contains('error') -or $taskRecord.status -ne 0) { throw 'Phase failed; original raw evidence retained, do not retry automatically' }
