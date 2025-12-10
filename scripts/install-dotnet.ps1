# Install .NET SDK Script
Write-Host "Downloading .NET 8.0 SDK..." -ForegroundColor Cyan

$downloadUrl = "https://dotnet.microsoft.com/download/dotnet/scripts/v1/dotnet-install.ps1"
$installScript = "$env:TEMP\dotnet-install.ps1"

try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installScript
    Write-Host "Installing .NET 8.0 SDK..." -ForegroundColor Yellow
    & powershell -ExecutionPolicy Bypass -File $installScript -Channel 8.0 -InstallDir "$env:ProgramFiles\dotnet"
    
    # Add to PATH
    $env:Path = "$env:ProgramFiles\dotnet;$env:Path"
    [Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)
    
    Write-Host "Verifying installation..." -ForegroundColor Yellow
    & "$env:ProgramFiles\dotnet\dotnet.exe" --version
    Write-Host "[OK] .NET SDK installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to install .NET SDK: $_" -ForegroundColor Red
    Write-Host "Please install manually from: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
}


