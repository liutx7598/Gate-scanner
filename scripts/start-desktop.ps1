$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$apiEntry = Join-Path $root "apps\api\dist\apps\api\src\server.js"
$webEntry = Join-Path $root "apps\web\dist\index.html"
$logsDir = Join-Path $root "runtime-logs"
$launcherLog = Join-Path $logsDir "desktop-launcher.log"
$profileDir = Join-Path $env:TEMP ("GateScannerAppProfile-" + [guid]::NewGuid().ToString("N"))

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

  cmd /c "taskkill /PID $ProcessId /T /F" 2>$null | Out-Null
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

  $candidates = $candidates | Where-Object { Test-Path $_ } | Select-Object -Unique

  foreach ($candidate in $candidates) {
    Write-LaunchLog "Browser candidate found: $candidate"
  }

  return $candidates | Select-Object -First 1
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

Set-Location $root
Write-LaunchLog "Launcher started."

$needsBuild = -not (Test-Path $apiEntry) -or -not (Test-Path $webEntry)
if ($needsBuild) {
  Write-LaunchLog "Build artifacts missing. Running pnpm desktop:prepare."
  pnpm desktop:prepare
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

if ((Test-PortBusy -Port 3001) -or (Test-PortBusy -Port 4173)) {
  Write-LaunchLog "Port check failed."
  [System.Windows.MessageBox]::Show(
    "Port 3001 or 4173 is already in use. Please close the previous Gate Scanner instance and try again.",
    "Gate Scanner"
  ) | Out-Null
  exit 1
}

$browserPath = Resolve-AppBrowser
if (-not $browserPath) {
  Write-LaunchLog "Browser was not found."
  [System.Windows.MessageBox]::Show(
    "Edge or Chrome was not found. Gate Scanner could not open an app window.",
    "Gate Scanner"
  ) | Out-Null
  exit 1
}

Write-LaunchLog "Using browser: $browserPath"

$apiProcess = $null
$webProcess = $null

try {
  Write-LaunchLog "Starting API process."
  $apiProcess = Start-Process -FilePath powershell.exe -WindowStyle Hidden -ArgumentList @(
    "-NoProfile",
    "-Command",
    "Set-Location '$root'; node '$apiEntry'"
  ) -RedirectStandardOutput (Join-Path $logsDir "api.out.log") -RedirectStandardError (Join-Path $logsDir "api.err.log") -PassThru

  Write-LaunchLog "Starting web preview process."
  $webProcess = Start-Process -FilePath powershell.exe -WindowStyle Hidden -ArgumentList @(
    "-NoProfile",
    "-Command",
    "Set-Location '$root\apps\web'; pnpm exec vite preview --host 127.0.0.1 --port 4173"
  ) -RedirectStandardOutput (Join-Path $logsDir "web.out.log") -RedirectStandardError (Join-Path $logsDir "web.err.log") -PassThru

  Write-LaunchLog "Waiting for API health endpoint."
  Wait-Endpoint -Url "http://127.0.0.1:3001/health" -TimeoutSeconds 45
  Write-LaunchLog "Waiting for web preview endpoint."
  Wait-Endpoint -Url "http://127.0.0.1:4173" -TimeoutSeconds 45

  New-Item -ItemType Directory -Force $profileDir | Out-Null
  Write-LaunchLog "Launching app browser window with profile $profileDir."

  Start-Process -FilePath $browserPath -ArgumentList @(
    "--new-window",
    "--no-first-run",
    "--user-data-dir=$profileDir",
    "--app=http://127.0.0.1:4173",
    "--window-size=1500,980"
  ) | Out-Null

  Write-LaunchLog "Waiting for app browser to close."
  Wait-AppBrowserClose -ProfileDir $profileDir
  Write-LaunchLog "App browser closed."
} catch {
  Write-LaunchLog "Launcher failed: $($_.Exception.Message)"
  [System.Windows.MessageBox]::Show($_.Exception.Message, "Gate Scanner failed to start") | Out-Null
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
  Write-LaunchLog "Launcher cleanup finished."
}
