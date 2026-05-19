# Install Node.js LTS on Windows
# Run as Administrator:
#   Set-ExecutionPolicy Bypass -Scope Process -Force
#   & "C:\Users\User\Documents\iks-wallpaper-calculator\scripts\install-nodejs.ps1"

$ErrorActionPreference = "Stop"

$nodePath = "C:\Program Files\nodejs\node.exe"
$npmPath = "C:\Program Files\nodejs\npm.cmd"

Write-Host "=== Check Node.js ===" -ForegroundColor Cyan
if (Test-Path $nodePath) {
    & $nodePath -v
    & $npmPath -v
    Write-Host "Node.js is already installed." -ForegroundColor Green
    exit 0
}

Write-Host "=== Try winget ===" -ForegroundColor Cyan
$wingetCmd = Get-Command winget -ErrorAction SilentlyContinue
if ($null -ne $wingetCmd) {
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    if ((Test-Path $nodePath)) {
        & $nodePath -v
        Write-Host "Done (winget)." -ForegroundColor Green
        exit 0
    }
    Write-Host "winget exit code: $LASTEXITCODE, trying MSI download..." -ForegroundColor Yellow
}

Write-Host "=== Download LTS from nodejs.org ===" -ForegroundColor Cyan
$msiFile = Join-Path $env:TEMP "node-lts-x64.msi"
$index = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json" -UseBasicParsing
$ltsEntry = $index | Where-Object { $_.lts -ne $false } | Select-Object -First 1
$ver = $ltsEntry.version
$downloadUrl = "https://nodejs.org/dist/$ver/node-$ver-x64.msi"
Write-Host "Version: $ver"
Write-Host "URL: $downloadUrl"
Invoke-WebRequest -Uri $downloadUrl -OutFile $msiFile -UseBasicParsing

Write-Host "=== Run MSI installer ===" -ForegroundColor Cyan
$msiArgs = @("/i", $msiFile, "/qn", "ADDLOCAL=ALL")
Start-Process -FilePath "msiexec.exe" -ArgumentList $msiArgs -Wait -NoNewWindow

Start-Sleep -Seconds 5

if (Test-Path $nodePath) {
    $env:Path = "C:\Program Files\nodejs;" + $env:Path
    & $nodePath -v
    & $npmPath -v
    Write-Host ""
    Write-Host "OK. Close PowerShell and open a new window, then run: node -v" -ForegroundColor Green
}
else {
    Write-Host "Node not found at $nodePath" -ForegroundColor Red
    Write-Host "Install manually: https://nodejs.org/ (LTS button)" -ForegroundColor Yellow
    exit 1
}
