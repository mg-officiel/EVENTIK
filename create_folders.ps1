$folders = @(
    "src\lib",
    "src\context",
    "src\hooks",
    "src\pages",
    "src\services",
    "src\styles",
    "src\types",
    "src\utils",
    "src\assets",
    "src\constants",
    "src\features"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "Created folder: $folder"
    } else {
        Write-Host "Folder already exists: $folder"
    }
}

Write-Host "All folders have been created successfully!" -ForegroundColor Green
