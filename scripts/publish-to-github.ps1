# Публикация проекта на GitHub
# Запуск: powershell -ExecutionPolicy Bypass -File .\scripts\publish-to-github.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$repoName = "iks-wallpaper-calculator"
$description = "Калькулятор бесшовных обоев MSD — экосистема ИКС"

Write-Host "==> git init"
if (-not (Test-Path .git)) { git init }

Write-Host "==> git add"
git add -A

Write-Host "==> git status"
git status

$status = git status --porcelain
if ($status) {
  git commit -m "Initial commit: IKS MSD wallpaper calculator"
} else {
  Write-Host "Нет изменений для коммита (возможно, уже закоммичено)"
}

Write-Host "==> gh auth status"
gh auth status
if ($LASTEXITCODE -ne 0) {
  Write-Host "Выполните: gh auth login"
  exit 1
}

Write-Host "==> gh repo create"
gh repo create $repoName --public --source=. --remote=origin --push --description $description
if ($LASTEXITCODE -ne 0) {
  $repoName = "iks-msd-wallpaper-calculator"
  Write-Host "Повтор с именем: $repoName"
  gh repo create $repoName --public --source=. --remote=origin --push --description $description
}

Write-Host "`nГотово. URL:"
git remote get-url origin
