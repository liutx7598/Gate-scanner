param(
  [switch]$SelfTest
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$nodeExe = Join-Path $root "runtime\node.exe"
$apiEntry = Join-Path $root "app\api\dist\apps\api\src\server.js"
$webEntry = Join-Path $root "app\support\portable-static-server.mjs"
$logsDir = Join-Path $root "runtime-logs"
$launcherLog = Join-Path $logsDir "desktop-launcher.log"
$profileDir = Join-Path $env:TEMP ("GateScannerPortableProfile-" + [guid]::NewGuid().ToString("N"))

Add-Type -AssemblyName PresentationFramework
New-Item -ItemType Directory -Force $logsDir | Out-Null
Set-Content -Path $launcherLog -Value ""

function Write-LaunchLog {
  param([string]$Message)

  Add-Content -Path $launcherLog -Value ("[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message)
}

function Stop-ProcessTree {
  param([int]$ProcessId)

  if ($ProcessId -le 0) {
    return
  }

  try {
    $existingProcess = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if (-not $existingProcess) {
      return
    }

    & taskkill.exe /PID $ProcessId /T /F *> $null
  } catch {
    return
  }
}

function Test-PortBusy {
  param([int]$Port)

  try {
    $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop
    return $null -ne $connection
  } catch {
    return $false
  }
}

function Wait-Endpoint {
  param(
    [string]$Url,
    [int]$TimeoutSeconds
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    try {
      Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 | Out-Null
      return
    } catch {
      Start-Sleep -Milliseconds 800
    }
  }

  throw "Timed out while waiting for service: $Url"
}

function Resolve-AppBrowser {
  $candidates = @()
  $candidates += "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
  $candidates += "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
  $candidates += "C:\Program Files\Google\Chrome\Application\chrome.exe"
  $candidates += "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

  return ($candidates | Where-Object { Test-Path $_ } | Select-Object -First 1)
}

function Get-AppBrowserProcesses {
  param([string]$ProfileDir)

  return Get-CimInstance Win32_Process | Where-Object {
    ($_.Name -in @('msedge.exe', 'chrome.exe')) -and
    $_.CommandLine -and
    $_.CommandLine -like "*$ProfileDir*"
  }
}

function Wait-AppBrowserClose {
  param(
    [string]$ProfileDir,
    [int]$StartupTimeoutSeconds = 20
  )

  $startupDeadline = (Get-Date).AddSeconds($StartupTimeoutSeconds)

  while ((Get-Date) -lt $startupDeadline) {
    if ((Get-AppBrowserProcesses -ProfileDir $ProfileDir).Count -gt 0) {
      while ((Get-AppBrowserProcesses -ProfileDir $ProfileDir).Count -gt 0) {
        Start-Sleep -Milliseconds 800
      }

      return
    }

    Start-Sleep -Milliseconds 500
  }

  throw "The app browser window did not stay open."
}

if (-not (Test-Path $nodeExe)) {
  [System.Windows.MessageBox]::Show("Bundled node.exe was not found.", "Gate Scanner") | Out-Null
  exit 1
}

if (-not (Test-Path $apiEntry) -or -not (Test-Path $webEntry)) {
  [System.Windows.MessageBox]::Show("Portable package files are incomplete. Please extract the zip again.", "Gate Scanner") | Out-Null
  exit 1
}

if ((Test-PortBusy -Port 3001) -or (Test-PortBusy -Port 4173)) {
  [System.Windows.MessageBox]::Show(
    "Port 3001 or 4173 is already in use. Please close the previous Gate Scanner window and try again.",
    "Gate Scanner"
  ) | Out-Null
  exit 1
}

$browserPath = $null
if (-not $SelfTest) {
  $browserPath = Resolve-AppBrowser
  if (-not $browserPath) {
    [System.Windows.MessageBox]::Show(
      "Edge or Chrome was not found. Gate Scanner could not open an app window.",
      "Gate Scanner"
    ) | Out-Null
    exit 1
  }
}

$apiProcess = $null
$webProcess = $null
$exitCode = 0

try {
  Write-LaunchLog "Portable launcher started."

  $apiProcess = Start-Process -FilePath $nodeExe -ArgumentList ('"{0}"' -f $apiEntry) -WorkingDirectory (Join-Path $root "app\api") `
    -RedirectStandardOutput (Join-Path $logsDir "api.out.log") -RedirectStandardError (Join-Path $logsDir "api.err.log") -PassThru -WindowStyle Hidden

  $webRoot = Join-Path $root "app\web\dist"
  $webArguments = '"{0}" --root "{1}" --host 127.0.0.1 --port 4173' -f $webEntry, $webRoot
  $webProcess = Start-Process -FilePath $nodeExe -ArgumentList $webArguments -WorkingDirectory (Join-Path $root "app\support") `
    -RedirectStandardOutput (Join-Path $logsDir "web.out.log") -RedirectStandardError (Join-Path $logsDir "web.err.log") -PassThru -WindowStyle Hidden

  Wait-Endpoint -Url "http://127.0.0.1:3001/health" -TimeoutSeconds 45
  Wait-Endpoint -Url "http://127.0.0.1:4173/health" -TimeoutSeconds 45

  if ($SelfTest) {
    Write-LaunchLog "Self test passed."
    return
  }

  New-Item -ItemType Directory -Force $profileDir | Out-Null
  Start-Process -FilePath $browserPath -ArgumentList @(
    "--new-window",
    "--no-first-run",
    "--user-data-dir=$profileDir",
    "--app=http://127.0.0.1:4173",
    "--window-size=1500,980"
  ) | Out-Null

  Wait-AppBrowserClose -ProfileDir $profileDir
} catch {
  Write-LaunchLog "Portable launcher failed: $($_.Exception.Message)"
  [System.Windows.MessageBox]::Show($_.Exception.Message, "Gate Scanner failed to start") | Out-Null
  $exitCode = 1
} finally {
  $browserProcesses = Get-AppBrowserProcesses -ProfileDir $profileDir
  foreach ($process in $browserProcesses) {
    Stop-ProcessTree -ProcessId $process.ProcessId
  }

  if ($apiProcess) {
    Stop-ProcessTree -ProcessId $apiProcess.Id
  }

  if ($webProcess) {
    Stop-ProcessTree -ProcessId $webProcess.Id
  }

  Remove-Item -LiteralPath $profileDir -Recurse -Force -ErrorAction SilentlyContinue
  Write-LaunchLog "Portable launcher cleanup finished."
}

exit $exitCode
