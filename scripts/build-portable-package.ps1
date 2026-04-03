param(
  [string]$OutputRoot,
  [string]$PackageName = "Gate-Scanner-Portable",
  [switch]$SkipBuild,
  [switch]$SkipZip
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
  $OutputRoot = Join-Path $repoRoot "portable-release"
}

$packageDir = Join-Path $OutputRoot $PackageName
$zipPath = Join-Path $OutputRoot ($PackageName + ".zip")
$nodeExe = (Get-Command node.exe -ErrorAction Stop).Source
$npmCmd = Join-Path (Split-Path $nodeExe -Parent) "npm.cmd"

function Invoke-Checked {
  param(
    [string]$FilePath,
    [string[]]$Arguments,
    [string]$WorkingDirectory = $repoRoot
  )

  Push-Location $WorkingDirectory
  try {
    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
      throw "Command failed: $FilePath $($Arguments -join ' ')"
    }
  } finally {
    Pop-Location
  }
}

function New-PortablePack {
  param(
    [string]$SourcePath,
    [string]$Destination
  )

  $sourceFullPath = (Resolve-Path -LiteralPath $SourcePath).Path
  $stdoutFile = [System.IO.Path]::GetTempFileName()
  $stderrFile = [System.IO.Path]::GetTempFileName()

  New-Item -ItemType Directory -Force $Destination | Out-Null
  $destinationFullPath = (Resolve-Path -LiteralPath $Destination).Path

  try {
    Push-Location $repoRoot
    & $npmCmd pack $sourceFullPath --pack-destination $destinationFullPath --json 1>$stdoutFile 2>$stderrFile
    $exitCode = $LASTEXITCODE
  } finally {
    Pop-Location
  }

  $stdout = if (Test-Path $stdoutFile) { Get-Content -Path $stdoutFile -Raw } else { "" }
  $stderr = if (Test-Path $stderrFile) { Get-Content -Path $stderrFile -Raw } else { "" }
  Remove-Item -LiteralPath $stdoutFile, $stderrFile -Force -ErrorAction SilentlyContinue

  if ($exitCode -ne 0) {
    throw "npm pack failed for $SourcePath`nSTDOUT:`n$stdout`nSTDERR:`n$stderr"
  }

  try {
    $packInfo = $stdout | ConvertFrom-Json -ErrorAction Stop
  } catch {
    throw "npm pack returned unexpected output for $SourcePath`nSTDOUT:`n$stdout`nSTDERR:`n$stderr"
  }

  if ($packInfo -is [System.Array]) {
    return $packInfo[0].filename
  }

  return $packInfo.filename
}

if (-not $SkipBuild) {
  Invoke-Checked -FilePath "pnpm.cmd" -Arguments @("build")
}

if (Test-Path $packageDir) {
  Remove-Item -LiteralPath $packageDir -Recurse -Force
}

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

$runtimeDir = Join-Path $packageDir "runtime"
$scriptsDir = Join-Path $packageDir "scripts"
$supportDir = Join-Path $packageDir "app\support"
$webDir = Join-Path $packageDir "app\web"
$apiDir = Join-Path $packageDir "app\api"
$packDir = Join-Path $packageDir "app\packs"
$logsDir = Join-Path $packageDir "runtime-logs"

foreach ($directory in @($runtimeDir, $scriptsDir, $supportDir, $webDir, $apiDir, $packDir, $logsDir)) {
  New-Item -ItemType Directory -Force $directory | Out-Null
}

Copy-Item -LiteralPath $nodeExe -Destination (Join-Path $runtimeDir "node.exe") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "scripts\start-portable.ps1") -Destination (Join-Path $scriptsDir "start-portable.ps1") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "scripts\portable-static-server.mjs") -Destination (Join-Path $supportDir "portable-static-server.mjs") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "apps\web\dist") -Destination (Join-Path $webDir "dist") -Recurse -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "apps\api\dist") -Destination (Join-Path $apiDir "dist") -Recurse -Force

$sharedTypesPack = New-PortablePack -SourcePath ".\packages\shared-types" -Destination $packDir
$sharedUtilsPack = New-PortablePack -SourcePath ".\packages\shared-utils" -Destination $packDir
$vendorPack = New-PortablePack -SourcePath ".\vendors\gateio-api" -Destination $packDir

$sourceApiPackage = Get-Content -Path (Join-Path $repoRoot "apps\api\package.json") -Raw | ConvertFrom-Json
$dependencies = @{}
foreach ($property in $sourceApiPackage.dependencies.PSObject.Properties) {
  $dependencies[$property.Name] = $property.Value
}

$dependencies["@gate-screener/shared-types"] = "file:../packs/$sharedTypesPack"
$dependencies["@gate-screener/shared-utils"] = "file:../packs/$sharedUtilsPack"
$dependencies["gateio-api"] = "file:../packs/$vendorPack"

$portableApiPackage = @{
  name = "gate-scanner-portable-api"
  private = $true
  type = "module"
  scripts = @{
    start = "node dist/apps/api/src/server.js"
  }
  dependencies = $dependencies
}

$portableApiPackage | ConvertTo-Json -Depth 10 | Set-Content -Path (Join-Path $apiDir "package.json") -Encoding UTF8

Invoke-Checked -FilePath $npmCmd -Arguments @("install", "--omit=dev", "--no-package-lock", "--prefer-offline") -WorkingDirectory $apiDir

Remove-Item -LiteralPath $packDir -Recurse -Force

$startCmd = @'
@echo off
setlocal
set "ROOT=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%ROOT%scripts\start-portable.ps1"
'@
Set-Content -Path (Join-Path $packageDir "Start-Gate-Scanner.cmd") -Value $startCmd -Encoding ASCII

$readme = @'
Gate Scanner Portable Test Package

Usage
1. Extract the whole zip to any folder.
2. Double-click Start-Gate-Scanner.cmd.
3. The package will start local services automatically and open an Edge or Chrome app window.
4. Closing that window will also stop the background services.

Notes
- Node.js and pnpm are already bundled.
- Edge or Chrome is required.
- Runtime logs are written to the runtime-logs folder.
'@
Set-Content -Path (Join-Path $packageDir "README-Portable.txt") -Value $readme -Encoding UTF8

Invoke-Checked -FilePath "powershell.exe" -Arguments @(
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
  "-File",
  (Join-Path $scriptsDir "start-portable.ps1"),
  "-SelfTest"
) -WorkingDirectory $packageDir

if (-not $SkipZip) {
  Compress-Archive -Path $packageDir -DestinationPath $zipPath -Force
}

Write-Host "Portable package ready:" $packageDir
if (-not $SkipZip) {
  Write-Host "Portable zip ready:" $zipPath
}
