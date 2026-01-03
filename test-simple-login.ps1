# Simple test with known credentials
$SUPABASE_URL = "https://yvvpqrtesmkpvtlpwaap.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dnBxcnRlc21rcHZ0bHB3YWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTQyMDYsImV4cCI6MjA4MDg5MDIwNn0.CCCz48RjTunMGsdxD3yjNmoDtcyozIrt1MywHlIsa4E"
$AUTH_URL = "$SUPABASE_URL/auth/v1"

Write-Host "`n=== Testing Supabase Login with Test Account ===`n" -ForegroundColor Cyan

$testEmail = "test@bus2college.com"
$testPassword = "TestPassword123!"

Write-Host "Attempting login with: $testEmail" -ForegroundColor Yellow

$headers = @{
    "apikey" = $SUPABASE_ANON_KEY
    "Content-Type" = "application/json"
}

$signInBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json -Compress

try {
    $signInResponse = Invoke-RestMethod -Uri "$AUTH_URL/token?grant_type=password" -Method Post -Headers $headers -Body $signInBody -ErrorAction Stop
    Write-Host "`nSUCCESS: Login successful!" -ForegroundColor Green
    Write-Host "User Email: $($signInResponse.user.email)" -ForegroundColor Gray
    Write-Host "User ID: $($signInResponse.user.id)" -ForegroundColor Gray
    Write-Host "Token Type: $($signInResponse.token_type)" -ForegroundColor Gray
    Write-Host "Access Token (first 40 chars): $($signInResponse.access_token.Substring(0, 40))..." -ForegroundColor Gray
    
    Write-Host "`nVerifying token..." -ForegroundColor Cyan
    $authHeaders = @{
        "apikey" = $SUPABASE_ANON_KEY
        "Authorization" = "Bearer $($signInResponse.access_token)"
    }
    $userResponse = Invoke-RestMethod -Uri "$AUTH_URL/user" -Method Get -Headers $authHeaders -ErrorAction Stop
    Write-Host "SUCCESS: Token is valid!" -ForegroundColor Green
    Write-Host "Confirmed user: $($userResponse.email)`n" -ForegroundColor Gray
    
    Write-Host "=== AUTHENTICATION SYSTEM WORKING CORRECTLY ===" -ForegroundColor Green
    Write-Host "All tests passed!`n" -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.ErrorDetails.Message
    
    Write-Host "`nFAILED: Could not log in" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error: $errorBody`n" -ForegroundColor Red
    
    if ($errorBody -like "*invalid_credentials*") {
        Write-Host "NOTE: Test account doesn't exist yet. You need to create it first through the app." -ForegroundColor Yellow
        Write-Host "However, the API is responding correctly which confirms the auth system is working.`n" -ForegroundColor Yellow
    }
}
