# Diagnostic test for Supabase Auth
$SUPABASE_URL = "https://yvvpqrtesmkpvtlpwaap.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dnBxcnRlc21rcHZ0bHB3YWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTQyMDYsImV4cCI6MjA4MDg5MDIwNn0.CCCz48RjTunMGsdxD3yjNmoDtcyozIrt1MywHlIsa4E"
$AUTH_URL = "$SUPABASE_URL/auth/v1"

Write-Host "`n=== Supabase Auth Diagnostic ===" -ForegroundColor Cyan
Write-Host "Testing API endpoints...`n" -ForegroundColor Yellow

$headers = @{
    "apikey" = $SUPABASE_ANON_KEY
    "Content-Type" = "application/json"
}

# Test 1: Check if auth endpoint is reachable
Write-Host "Test 1: Checking auth endpoint..." -ForegroundColor Cyan
try {
    $healthCheck = Invoke-WebRequest -Uri "$AUTH_URL/health" -Method Get -Headers $headers -ErrorAction SilentlyContinue -TimeoutSec 5
    Write-Host "SUCCESS: Auth endpoint is reachable" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Health check endpoint not responding" -ForegroundColor Yellow
}

# Test 2: Try to get current user (should fail with 401)
Write-Host "`nTest 2: Testing /user endpoint (should return 401)..." -ForegroundColor Cyan
try {
    $userCheck = Invoke-RestMethod -Uri "$AUTH_URL/user" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "UNEXPECTED: Got user without auth" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "SUCCESS: Endpoint working correctly (401 unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Unexpected response: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Test login with your credentials
Write-Host "`nTest 3: Testing login with your credentials..." -ForegroundColor Cyan
Write-Host "Enter your email address:" -ForegroundColor Yellow
$email = Read-Host
Write-Host "Enter your password:" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

$signInBody = @{
    email = $email
    password = $passwordPlain
} | ConvertTo-Json -Compress

Write-Host "`nAttempting login..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$AUTH_URL/token?grant_type=password" -Method Post -Headers $headers -Body $signInBody -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "`nSUCCESS: Login worked!" -ForegroundColor Green
    Write-Host "User: $($data.user.email)" -ForegroundColor Gray
    Write-Host "User ID: $($data.user.id)" -ForegroundColor Gray
    Write-Host "Email Confirmed: $($data.user.confirmed_at)" -ForegroundColor Gray
    Write-Host "Token expires: $($data.expires_in) seconds" -ForegroundColor Gray
    Write-Host "`n=== Authentication is WORKING ===" -ForegroundColor Green
    
} catch {
    Write-Host "`nFAILED: Login did not work" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorData = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error Code: $($errorData.error_code)" -ForegroundColor Red
        Write-Host "Error Message: $($errorData.msg)" -ForegroundColor Red
        
        if ($errorData.error_code -eq "invalid_credentials") {
            Write-Host "`nPossible causes:" -ForegroundColor Yellow
            Write-Host "  1. Wrong email or password" -ForegroundColor Yellow
            Write-Host "  2. Email not confirmed (check Supabase dashboard)" -ForegroundColor Yellow
            Write-Host "  3. User account disabled or deleted" -ForegroundColor Yellow
            Write-Host "  4. Password was changed in Supabase dashboard" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n"
