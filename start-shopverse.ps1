$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$javaHome = "C:\Program Files\Java\jdk-26.0.1"

if (-not $env:MYSQL_PASSWORD) {
    $securePassword = Read-Host "Enter MySQL password for root" -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $env:MYSQL_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
}

$backendCommand = @"
cd '$backend'
`$env:JAVA_HOME='$javaHome'
`$env:MYSQL_PASSWORD='$env:MYSQL_PASSWORD'
mvn spring-boot:run
"@

$frontendCommand = @"
cd '$frontend'
if (-not (Test-Path 'node_modules')) { npm install }
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand

Write-Host ""
Write-Host "ShopVerse is starting in two new PowerShell windows."
Write-Host "Backend:  http://localhost:8081/api"
Write-Host "Frontend: http://localhost:5174"
Write-Host ""
Write-Host "Keep both windows open while using the app."

