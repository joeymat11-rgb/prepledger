$ErrorActionPreference = 'Stop'
# Offline evidence comparison only. Never loads the binding, runs a test, or reads the author's workspace.
$reviewRoot = $PSScriptRoot
$taskRoot = (Get-Location).Path
$authorRoot = Join-Path $reviewRoot 'raw/author'
$utf8 = [Text.UTF8Encoding]::new($false, $true)
function ReadJson([string]$Path) { $utf8.GetString([IO.File]::ReadAllBytes($Path)) | ConvertFrom-Json -Depth 100 }
function TextFile([string]$Path) { $utf8.GetString([IO.File]::ReadAllBytes($Path)) }
function FileSha([string]$Path) { [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([IO.File]::ReadAllBytes($Path))).ToLowerInvariant() }
function Require([bool]$Condition, [string]$Message) { if (-not $Condition) { throw $Message } }
function Norm([string]$Value) {
  $v = [regex]::Replace($Value, '\\+', '/')
  $v = $v.Replace('C:/Users/joeym/Documents/prepledger-dev/work/pm-caretaker/native-slot-prototype-review-er', '<ROOT>')
  $v = $v.Replace('C:/Users/joeym/Documents/prepledger-dev/work/pm-caretaker/native-slot-prototype-b', '<ROOT>')
  $v = $v.Replace('/builds/build-01/', '/builds/<BUILD>/').Replace('/builds/er-independent-one/', '/builds/<BUILD>/')
  $v.Replace('/runs/run-01/', '/runs/<RUN>/').Replace('/runs/er-delivered-one/', '/runs/<RUN>/')
}
function SameArgs($A, $B) {
  Require ($A.Count -eq $B.Count) 'Argv count differs'
  for ($i=0; $i -lt $A.Count; $i++) { Require ((Norm $A[$i]) -ceq (Norm $B[$i])) 'Argv differs beyond own roots/phase names' }
}
function SameEnv($A, $B) {
  $ak = @($A.PSObject.Properties.Name | Sort-Object)
  $bk = @($B.PSObject.Properties.Name | Sort-Object)
  Require (($ak -join ',') -ceq ($bk -join ',')) 'Environment keys differ'
  foreach ($k in $ak) { Require ((Norm $A.$k) -ieq (Norm $B.$k)) ('Environment differs: ' + $k) }
}
function RawCensus([string]$Text) {
  $c = [ordered]@{}
  foreach ($k in @('tests','suites','pass','fail','cancelled','skipped','todo')) {
    $m = [regex]::Matches($Text, ('(?m)^# ' + $k + ' (\d+)\r?$'))
    Require ($m.Count -eq 1) ('Missing/duplicate raw census field: ' + $k)
    $c[$k] = [int]$m[0].Groups[1].Value
  }
  [pscustomobject]$c
}
function SameCensus($A, $B) {
  foreach ($k in @('tests','suites','pass','fail','cancelled','skipped','todo')) {
    Require ($A.$k -eq $B.$k) ('Raw census disagrees: ' + $k)
  }
}
function CheckStream($Record, [string]$Path) {
  Require ($Record.bytes -eq ([IO.FileInfo]$Path).Length) 'Stream byte count mismatch'
  Require ($Record.sha256 -ceq (FileSha $Path)) 'Stream hash mismatch'
}
$first = ReadJson (Join-Path $reviewRoot 'MAPPING-FIRST.json')
$archive = ReadJson (Join-Path $reviewRoot 'MAPPING-AUTHOR.json')
$jsonCount = 0
foreach ($copy in $archive.files) {
  $path = Join-Path $taskRoot $copy.copyPath
  Require (([IO.FileInfo]$path).Length -eq $copy.bytes -and (FileSha $path) -ceq $copy.sha256) 'Author copy changed'
  if ($copy.copyPath.EndsWith('.json')) { $null = ReadJson $path; $jsonCount++ }
}
$extractions = [Collections.Generic.List[object]]::new()
foreach ($kind in @('zig','header')) {
  $a = ReadJson (Join-Path $authorRoot ('custody/' + $kind + '-extraction.json'))
  $b = ReadJson (Join-Path $reviewRoot ('raw/setup/' + $kind + '-extraction.json'))
  Require ($a.archiveSha256 -ceq $b.archiveSha256) 'Extraction archive pin differs'
  Require ($a.headersChecked -eq $b.safeUniqueMembers) 'Archive member count differs'
  Require ($a.files.Count -eq $b.files.Count) 'Extraction file count differs'
  $index = [Collections.Generic.Dictionary[string,object]]::new([StringComparer]::Ordinal)
  foreach ($entry in $b.files) { $index.Add($entry.member, $entry) }
  $names = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  [long]$total = 0
  foreach ($entry in $a.files) {
    Require ($names.Add($entry.member)) 'Duplicate extraction name'
    Require ($index.ContainsKey($entry.member)) 'Extraction member differs'
    $other = $index[$entry.member]
    Require ($entry.bytes -eq $other.bytes -and $entry.sha256 -ceq $other.sha256) 'Extraction file metadata differs'
    $total += $entry.bytes
  }
  $extractions.Add([pscustomobject]@{kind=$kind;archiveSha256=$a.archiveSha256;members=$a.headersChecked;files=$a.files.Count;bytes=$total;allMemberSizeHashesMatchIndependent=$true})
}
$sharedInputs = [Collections.Generic.List[object]]::new()
foreach ($copy in $archive.files | Where-Object { $_.authorPath -match '/definitions/(node|os)/' -and $_.authorPath -notmatch '\.json$|\.error\.txt$' -or $_.authorPath -match '/authority/' }) {
  $other = @($first.files | Where-Object { $_.sha256 -ceq $copy.sha256 -and $_.bytes -eq $copy.bytes })
  Require ($other.Count -ge 1) 'Primary definition or authority differs from independent input'
  $sharedInputs.Add([pscustomobject]@{authorPath=$copy.authorPath;sha256=$copy.sha256;bytes=$copy.bytes;independentCopy=$other[0].copy})
}
Require ($sharedInputs.Count -eq 15) 'Expected twelve shared primary definitions and three authority inputs'
$authorBuild = ReadJson (Join-Path $authorRoot 'raw/build-01/build.json')
$ownBuild = ReadJson (Join-Path $reviewRoot 'raw/build/build.json')
$ownRuntimePath = [IO.Path]::GetFullPath($ownBuild.runtime.path)
Require ($ownRuntimePath.StartsWith([IO.Path]::GetFullPath($taskRoot) + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) 'Own runtime escaped review root'
Require ((FileSha $ownRuntimePath) -ceq $ownBuild.runtime.sha256) 'Own runtime bytes differ from independent pin'
$authorInputs = ReadJson (Join-Path $authorRoot 'raw/build-01/inputs.json')
Require ($authorBuild.sourceHead -ceq $first.candidate -and $authorInputs.sourceHead -ceq $first.candidate) 'Build source head differs'
foreach ($k in @('runtime','compiler','library')) { Require ($authorBuild.$k.sha256 -ceq $ownBuild.$k.sha256 -and $authorInputs.$k.sha256 -ceq $ownBuild.$k.sha256) ('Tool pin differs: ' + $k) }
Require ($authorBuild.headerArchiveSha256 -ceq $ownBuild.headerArchiveSha256 -and $authorBuild.headerFilesVerified -eq 2725) 'Header build input differs'
Require ($authorBuild.sources.Count -eq 5 -and $authorInputs.sources.Count -eq 5) 'Source count differs'
for ($i=0; $i -lt 5; $i++) {
  $a = $authorBuild.sources[$i]; $b = $ownBuild.sources[$i]; $c = $authorInputs.sources[$i]
  Require ((Norm $a.path) -ceq (Norm $b.path) -and $a.sha256 -ceq $b.sha256 -and $a.bytes -eq $b.bytes) 'Build source identity differs'
  Require ($a.sha256 -ceq $c.sha256 -and $a.bytes -eq $c.bytes) 'Build input/checkpoint source differs'
}
SameEnv $authorBuild.environment $ownBuild.environment
SameEnv $authorInputs.environment $authorBuild.environment
$builds = [Collections.Generic.List[object]]::new()
foreach ($phase in @('compiler-version','candidate','version-mismatch','size-mismatch')) {
  $a = ReadJson (Join-Path $authorRoot ('raw/build-01/' + $phase + '.result.json'))
  $b = ReadJson (Join-Path $reviewRoot ('raw/build/' + $phase + '.result.json'))
  Require ($a.status -eq 0 -and $null -eq $a.signal -and $null -eq $a.error) 'Author compiler did not succeed'
  SameArgs $a.args $b.args
  SameEnv $a.environment $b.environment
  Require ((Norm $a.executable) -ceq (Norm $b.executable) -and (Norm $a.cwd) -ceq '<ROOT>') 'Compiler location differs'
  foreach ($stream in @('stdout','stderr')) { CheckStream $a.$stream (Join-Path $authorRoot ('raw/build-01/' + $phase + '.' + $stream)) }
  $builds.Add([pscustomobject]@{phase=$phase;status=$a.status;pid=$a.pid;argvAndEnvironmentMatchAfterPathNormalization=$true;stdoutSha256=$a.stdout.sha256;stderrSha256=$a.stderr.sha256})
}
Require ((TextFile (Join-Path $authorRoot 'raw/build-01/compiler-version.stdout')).Trim() -ceq '0.15.2') 'Compiler version output differs'
$generated = ReadJson (Join-Path $authorRoot 'custody/generated-build-outputs.json')
$binaries = [Collections.Generic.List[object]]::new()
foreach ($kind in @('candidate','version-mismatch','size-mismatch')) {
  $a = $authorBuild.binaries.$kind; $b = $ownBuild.binaries.$kind
  $g = @($generated | Where-Object { (Norm $_.path) -ceq (Norm $a.path) })
  Require ($g.Count -eq 1 -and $g[0].sha256 -ceq $a.sha256 -and $g[0].bytes -eq $a.bytes) 'Generated binary metadata disagrees'
  SameArgs $a.definitions $b.definitions
  $binaries.Add([pscustomobject]@{kind=$kind;authorBytes=$a.bytes;authorSha256=$a.sha256;independentBytes=$b.bytes;independentSha256=$b.sha256;byteIdentical=($a.sha256 -ceq $b.sha256)})
}
$authorSources = ReadJson (Join-Path $authorRoot 'SOURCES.json')
$artifactPins = @($authorSources.nodeArtifacts) + @($authorSources.zigArtifact)
foreach ($pin in $artifactPins) {
  $ownPath = Join-Path $taskRoot ('.tmp/native-slot/downloads/' + (($pin.path -split '\\')[-1]))
  Require (([IO.FileInfo]$ownPath).Length -eq $pin.bytes -and (FileSha $ownPath) -ceq $pin.sha256) 'Author acquisition pin differs from independently acquired bytes'
}
Require ($artifactPins.Count -eq 4) 'Artifact count differs'
foreach ($phase in @('build-launch-01','test-launch-01')) {
  $launch = ReadJson (Join-Path $authorRoot ('custody/' + $phase + '.json'))
  Require ($launch.exit -eq 0) 'Author launch failed'
  Require ((FileSha (Join-Path $authorRoot ('custody/' + $phase + '.stdout'))) -ceq $launch.stdoutSha256) 'Author launch stdout differs'
  Require ((FileSha (Join-Path $authorRoot ('custody/' + $phase + '.stderr'))) -ceq $launch.stderrSha256) 'Author launch stderr differs'
}
$runInputs = ReadJson (Join-Path $authorRoot 'raw/run-01/run-inputs.json')
$suite = ReadJson (Join-Path $authorRoot 'raw/run-01/suite.result.json')
$suiteCensus = ReadJson (Join-Path $authorRoot 'raw/run-01/census.json')
$suiteText = TextFile (Join-Path $authorRoot 'raw/run-01/suite.stdout')
$topCensus = RawCensus $suiteText
SameCensus $topCensus $suiteCensus.census
Require ($topCensus.tests -eq 34 -and $topCensus.pass -eq 34 -and $topCensus.fail -eq 0 -and $topCensus.skipped -eq 0 -and $topCensus.cancelled -eq 0 -and $topCensus.todo -eq 0) 'Top author suite differs'
Require ($suite.status -eq 0 -and $null -eq $suite.error -and $null -eq $suite.signal -and $null -eq $suiteCensus.firstFailure) 'Top suite outcome differs'
Require ($runInputs.sourceHead -ceq $first.candidate -and $runInputs.binarySha256 -ceq $authorBuild.binaries.candidate.sha256 -and $runInputs.testSourceSha256 -ceq $authorBuild.sources[4].sha256) 'Run source/binary pins differ'
Require ($runInputs.buildManifestSha256 -ceq (FileSha (Join-Path $authorRoot 'raw/build-01/build.json'))) 'Run build manifest hash differs'
SameArgs $suite.args $runInputs.args
SameEnv $suite.environment $runInputs.environment
foreach ($stream in @('stdout','stderr')) { CheckStream $suite.$stream (Join-Path $authorRoot ('raw/run-01/suite.' + $stream)) }
$graph = ReadJson (Join-Path $authorRoot 'raw/run-01/process-census.json')
Require ($graph.records.Count -eq 33 -and $graph.outerProcesses -eq 33 -and $graph.sourceHead -ceq $first.candidate) 'Author graph census differs'
$pidSet = [Collections.Generic.HashSet[int]]::new()
$rows = [Collections.Generic.List[object]]::new()
$observationCount = 0
$expectedStates = @{ 'two-records'=4;none=0;'first-pending'=1;'first-complete'=2;'second-pending'=3;extra=5;'out-of-order'=5;duplicate=5;'forged-closed'=0 }
foreach ($record in $graph.records) {
  $dir = Join-Path $authorRoot ('raw/run-01/cases/' + $record.label)
  $ownDir = Join-Path $reviewRoot ('raw/delivered/cases/' + $record.label)
  $r = ReadJson (Join-Path $dir 'result.json'); $trace = ReadJson (Join-Path $dir 'trace.json')
  $own = ReadJson (Join-Path $ownDir 'result.json')
  $stdout = TextFile (Join-Path $dir 'stdout.raw'); $census = RawCensus $stdout
  SameCensus $census $r.census; SameCensus $census $record.census; SameCensus $census $own.census
  Require ($r.status -eq $record.status -and $r.status -eq $own.status -and $null -eq $r.signal -and $null -eq $r.error) 'Case process outcome differs'
  Require ($r.operatorPid -eq 17076 -and $record.operatorPid -eq $r.operatorPid -and $record.outerPid -eq $r.outerPid -and $record.filePid -eq $trace.pid) 'Graph identity differs'
  Require ($trace.parentPid -eq $r.outerPid -and $trace.pid -ne $r.operatorPid -and $trace.pid -ne $r.outerPid) 'Not a distinct nested OS graph'
  Require ($pidSet.Add([int]$r.outerPid) -and $pidSet.Add([int]$trace.pid)) 'Reused child PID within cohort'
  Require (($trace | ConvertTo-Json -Compress) -ceq ($r.trace | ConvertTo-Json -Compress)) 'Trace copy differs from result'
  $descriptor = $r.environment.SLOT_DESCRIPTOR | ConvertFrom-Json
  Require ($trace.ownerPid -eq $descriptor.ownerPid) 'Trace owner differs from supplied descriptor'
  SameArgs $r.args $own.args
  Require ($r.environment.SLOT_CONFIG -ceq $own.environment.SLOT_CONFIG) 'Generated control configuration differs'
  Require ((Norm $r.executable) -ceq (Norm $authorBuild.runtime.path) -and (Norm $own.executable) -ceq (Norm $ownBuild.runtime.path) -and (Norm $r.cwd) -ceq '<ROOT>') 'Graph executable/cwd differs from its own pinned runtime/root'
  foreach ($field in $authorBuild.environment.PSObject.Properties.Name) { Require ((Norm $r.environment.$field) -ieq (Norm $authorBuild.environment.$field)) 'Graph base environment differs' }
  foreach ($file in @('writer.test.cjs','stdout.raw','stderr.raw')) {
    $hashField = @{ 'writer.test.cjs'='writerSourceSha256';'stdout.raw'='stdoutSha256';'stderr.raw'='stderrSha256' }[$file]
    Require ((FileSha (Join-Path $dir $file)) -ceq $r.$hashField) 'Graph source/stream identity differs'
  }
  Require ($r.writerSourceSha256 -ceq (FileSha (Join-Path $ownDir 'writer.test.cjs'))) 'Generated author source differs from independent source'
  $failLines = [regex]::Matches($stdout, '(?m)^not ok [^\r\n]+')
  if ($record.label -eq 'nonzero') {
    Require ($r.status -eq 1 -and $census.tests -eq 2 -and $census.pass -eq 1 -and $census.fail -eq 1 -and $failLines.Count -eq 1) 'Intentional file failure missing'
    Require ($r.firstFailure -ceq $failLines[0].Value -and $stdout -match '(?m)^  exitCode: 7\r?$') 'First failure or original writer exit7 missing'
  } else { Require ($r.status -eq 0 -and $census.tests -eq 1 -and $census.pass -eq 1 -and $census.fail -eq 0 -and $failLines.Count -eq 0 -and $null -eq $r.firstFailure) 'Unexpected child failure' }
  $observation = $null
  if (Test-Path -LiteralPath (Join-Path $dir 'owner-observation.json')) {
    $observation = ReadJson (Join-Path $dir 'owner-observation.json')
    $expected = if ($record.label.StartsWith('invalid-')) { 5 } else { $expectedStates[$record.label] }
    Require ($observation.outerTerminated -and $observation.outerStatus -eq $r.status -and $observation.state -eq $expected -and $observation.completion -eq ($r.status -eq 0 -and $expected -eq 4)) 'Owner observation differs'
    $ownObservation = ReadJson (Join-Path $ownDir 'owner-observation.json')
    Require (($observation | ConvertTo-Json -Compress) -ceq ($ownObservation | ConvertTo-Json -Compress)) 'Independent owner observation differs'
    $observationCount++
  }
  if ($record.label -in @('late-io','local-control')) { Require ((TextFile (Join-Path $dir 'diagnostic.txt')) -ceq ('complete' + [char]10) -and $r.diagnostic -ceq ('complete' + [char]10)) 'Earlier diagnostic was not preserved' }
  $rows.Add([pscustomobject]@{label=$record.label;operatorPid=$r.operatorPid;outerPid=$r.outerPid;filePid=$trace.pid;status=$r.status;rawCensus=$census;firstFailure=$r.firstFailure;sourceAndStreamsVerified=$true;configurationAndSourceMatchIndependent=$true;ownerObservation=$observation})
}
Require ($pidSet.Count -eq 66 -and $observationCount -eq 19) 'Final graph/observation count differs'
$result = [pscustomobject]@{
  version=1;authorRef=$archive.authorRef;independentFirstRef=$archive.immutableFirstAssessmentRef;candidate=$first.candidate
  offlineOnly=$true;newRuntimeExecutions=0;allAuthorCopiesVerified=$true;parsedJsonFiles=$jsonCount
  extractions=$extractions;sharedPrimaryDefinitionsAndAuthority=$sharedInputs;toolArtifactPins=4
  buildChecks=$builds;binaryIdentities=$binaries
  binaryComparisonLimit='Independent binaries differ from author hashes. Same exact source/tool pins/normalized flags and observed behavior were reproduced; bit-reproducibility and the cause of differing binary bytes were not established. Author binaries were not opened or executed.'
  runtimePathDifference='Author ran its pinned downloads/node.exe; reviewer ran its verified identical runtime/node.exe copy. This is an explicit location difference with the same independently verified executable bytes, not a toolchain change.'
  authorTopSuite=[pscustomobject]@{pid=$suite.pid;ownerPid=17076;status=$suite.status;census=$topCensus;durationMs=5971.2452;stdoutSha256=$suite.stdout.sha256}
  authorNestedGraphs=$rows;distinctChildProcesses=66;separateOwnerObservations=19
  observationLimit='Late-IO/state5, local-buffer/state0, nonzero/state4-with-failed-child and remaining lifetime/setup assertions are in the pinned parent test with a passing top-level TAP result; no separate owner-observation file exists for these cases.'
  historyLimit='Setup/provider/model-switch and retention assertions are author/PM reports. Full Git end states and public copy identities were checked, but incomplete original setup logs and historical absence of other executions cannot be independently recreated from metadata.'
  extractionLimit='Author extraction helper validates Zig members before extraction; header members are validated as streamed before creation/use. Reviewer independently validated both complete archives before extraction. All 20,830 reported file identities agree, without treating metadata as an audit of compiler/SDK implementation.'
}
[IO.File]::WriteAllText((Join-Path $reviewRoot 'RECONCILIATION-CHECKS.json'), (($result | ConvertTo-Json -Depth 12).Replace([string][char]13, '') + [char]10), $utf8)
$result | Select-Object offlineOnly,newRuntimeExecutions,allAuthorCopiesVerified,parsedJsonFiles,extractions,toolArtifactPins,distinctChildProcesses,separateOwnerObservations | ConvertTo-Json -Depth 4
