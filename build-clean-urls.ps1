# PowerShell script to create clean URL structure
Write-Host "🚀 Creating clean URL structure..." -ForegroundColor Green

# Create clean URL copies (without .html extension)
Copy-Item "dashboard.html" "dashboard"
Copy-Item "calendar.html" "calendar"
Copy-Item "units.html" "units" 
Copy-Item "contacts.html" "contacts"
Copy-Item "website.html" "website"
Copy-Item "aiagent.html" "aiagent"
Copy-Item "business-info.html" "business-info"

Write-Host "✅ Clean URLs created!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 File structure:" -ForegroundColor Yellow
Write-Host "   /dashboard     (clean URL)"
Write-Host "   /calendar      (clean URL)" 
Write-Host "   /units         (clean URL)"
Write-Host "   /contacts      (clean URL)"
Write-Host "   /website       (clean URL)"
Write-Host "   /aiagent       (clean URL)"
Write-Host ""
Write-Host "🌐 URLs will work as:" -ForegroundColor Blue
Write-Host "   website.com/dashboard"
Write-Host "   website.com/calendar"
Write-Host "   website.com/units"
Write-Host "   etc..."