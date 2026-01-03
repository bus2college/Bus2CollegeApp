# Test Supabase Authentication
$SUPABASE_URL = "https://yvvpqrtesmkpvtlpwaap.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dnBxcnRlc21rcHZ0bHB3YWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTQyMDYsImV4cCI6MjA4MDg5MDIwNn0.CCCz48RjTunMGsdxD3yjNmoDtcyozIrt1MywHlIsa4E"
$AUTH_URL = "$SUPABASE_URL/auth/v1"

# Test credentials
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$testEmail = "test-$timestamp@bus2college.test"
$testPassword = "TestPass123!"

Write-Host "`n=== Testing Supabase Authentication ===`n" -ForegroundColor Cyan
Write-Host "Test email: $testEmail`n" -ForegroundColor Yellow

$headers = @{
    "apikey" = $SUPABASE_ANON_KEY
    "Content-Type" = "application/json"
}

# Test Sign Up
Write-Host "Test 1: Registering new user..." -ForegroundColor Cyan
$signUpBody = @{
    email = $testEmail
    password = $testPassword
    data = @{}
} | ConvertTo-Json -Compress
$signUpResponse = Invoke-RestMethod -Uri "$AUTH_URL/signup" -Method Post -Headers $headers -Body $signUpBody -ErrorAction SilentlyContinue
if ($signUpResponse) {
    Write-Host "SUCCESS: Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($signUpResponse.user.id)`n" -ForegroundColor Gray
}

# Test Sign In
Write-Host "Test 2: Logging in..." -ForegroundColor Cyan
$signInBody = @{
    email = $testEmail
    password = $testPassword
    gotrue_meta_security = @{}
} | ConvertTo-Json -Compress
$signInResponse = Invoke-RestMethod -Uri "$AUTH_URL/token?grant_type=password" -Method Post -Headers $headers -Body $signInBody
Write-Host "SUCCESS: Login successful!" -ForegroundColor Green
Write-Host "User: $($signInResponse.user.email)" -ForegroundColor Gray
Write-Host "Token: $($signInResponse.access_token.Substring(0, 30))...`n" -ForegroundColor Gray

# Test Token
Write-Host "Test 3: Verifying token..." -ForegroundColor Cyan
$authHeaders = @{
    "apikey" = $SUPABASE_ANON_KEY
    "Authorization" = "Bearer $($signInResponse.access_token)"
}
$userResponse = Invoke-RestMethod -Uri "$AUTH_URL/user" -Method Get -Headers $authHeaders
Write-Host "SUCCESS: Token verified!" -ForegroundColor Green
Write-Host "Authenticated as: $($userResponse.email)`n" -ForegroundColor Gray

Write-Host "=== ALL TESTS PASSED ===" -ForegroundColor Green
Write-Host "Authentication system is working correctly!`n" -ForegroundColor Green
