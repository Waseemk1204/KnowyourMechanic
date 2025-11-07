# Script to push KnowyourMechanic to GitHub
# Make sure you've created the repository at https://github.com/Waseemk1204/KnowyourMechanic first

Write-Host "Pushing code to GitHub..." -ForegroundColor Cyan

# Push to GitHub
git push -u origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccess! Your code has been pushed to GitHub." -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/Waseemk1204/KnowyourMechanic" -ForegroundColor Green
} else {
    Write-Host "`nError: Failed to push. Make sure:" -ForegroundColor Red
    Write-Host "1. The repository exists at https://github.com/Waseemk1204/KnowyourMechanic" -ForegroundColor Yellow
    Write-Host "2. You're authenticated with GitHub" -ForegroundColor Yellow
    Write-Host "3. You have push permissions" -ForegroundColor Yellow
}

