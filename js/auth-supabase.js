// Auth form handlers using direct Supabase Auth API

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return false;
    }
    
    // Check if auth API is ready
    if (!window.supabaseAuth) {
        console.error('❌ Supabase Auth API not loaded');
        alert('Authentication system is not ready. Please refresh the page.');
        return false;
    }
    
    // Show loading state
    const button = event.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Signing in...';
    button.disabled = true;
    
    // Use the API to sign in
    window.supabaseAuth.signInWithPassword(email, password).then(response => {
        if (response.error) {
            console.error('❌ Login failed:', response.error);
            
            // Check if it might be an unconfirmed email issue
            if (response.error.includes('Invalid login credentials') || response.error.includes('invalid_credentials')) {
                alert('Login failed: Invalid email or password.\n\n⚠️ If you just registered, make sure you clicked the confirmation link in your email.\n\nCheck your inbox (and spam folder) for a confirmation email from Supabase.');
            } else {
                alert('Login failed: ' + response.error);
            }
        } else if (response.data.session && response.data.user) {
            console.log('✅ Login successful! Redirecting to home page...');
            // Redirect to home page
            window.location.href = 'home.html';
        } else {
            alert('Login failed: No session returned');
        }
    }).catch(error => {
        console.error('❌ Unexpected error during login:', error);
        alert('An unexpected error occurred: ' + error.message);
    }).finally(() => {
        button.textContent = originalText;
        button.disabled = false;
    });
    
    return false;
}

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return false;
    }
    
    // Check if auth API is ready
    if (!window.supabaseAuth) {
        console.error('❌ Supabase Auth API not loaded');
        alert('Authentication system is not ready. Please refresh the page.');
        return false;
    }
    
    // Show loading state
    const button = event.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Creating account...';
    button.disabled = true;
    
    // Use the API to sign up
    window.supabaseAuth.signUp(email, password, { data: {} }).then(response => {
        if (response.error) {
            console.error('❌ Registration failed:', response.error);
            alert('Registration failed: ' + response.error);
        } else if (response.data.user) {
            console.log('✅ Registration successful!');
            
            // Check if email confirmation is required
            if (response.data.user.confirmed_at) {
                alert('Registration successful! You can now log in.');
            } else {
                alert('Registration successful!\n\n⚠️ IMPORTANT: Please check your email inbox (including spam folder) and click the confirmation link before logging in.\n\nYou will not be able to log in until you confirm your email address.');
            }
            
            // Switch to login form
            switchToLogin();
        } else {
            alert('Registration failed: No user returned');
        }
    }).catch(error => {
        console.error('❌ Unexpected error during registration:', error);
        alert('An unexpected error occurred: ' + error.message);
    }).finally(() => {
        button.textContent = originalText;
        button.disabled = false;
    if (!window.supabaseAuth) {
        console.error('❌ Supabase Auth API not loaded');
        return;
    }
    });
    
    return false;
}

// Handle logout
function handleLogout() {
    console.log('Logging out...');
    window.supabaseAuth.signOut().then(response => {
        if (response.error) {
            console.error('❌ Logout failed:', response.error);
        } else {
            console.log('✅ Logged out successfully');
            window.location.href = 'index.html';
        }
    });
}

// Switch form display
function switchToRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

function switchToLogin() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}if (!window.supabaseAuth) {
        console.log('⚠ Supabase Auth API not yet loaded');
        return;
    }
    

// Check if user is authenticated on page load
function checkAuthStatus() {
    const user = window.supabaseAuth.getUser();
    if (user && window.supabaseAuth.isAuthenticated()) {
        console.log('✓ User is already authenticated:', user.email);
        // Redirect to home page if authenticated
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            window.location.href = 'home.html';
        }
    } else {
        console.log('No authenticated user');
    }
}

// Initialize auth status check when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Auth script loaded');
    checkAuthStatus();
});
