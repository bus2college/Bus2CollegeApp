// ===================================
// Supabase Authentication Management
// ===================================

// Initialize Supabase client (configured in HTML files)
// const supabase is created in index.html and home.html

// Toggle between login and register forms
function showLoginForm() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    hideMessage();
}

function showRegisterForm() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    hideMessage();
}

// Show message to user
function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
}

function hideMessage() {
    const messageBox = document.getElementById('messageBox');
    messageBox.className = 'message-box';
}

// Handle user registration with Supabase
async function handleRegister(event) {
    event.preventDefault();
    
    // Check if supabase is initialized
    if (typeof supabase === 'undefined' || !supabase || !supabase.auth) {
        showMessage('Registration service is not initialized. Please refresh the page and try again.', 'error');
        console.error('Supabase is not initialized');
        return false;
    }
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const grade = document.getElementById('registerGrade').value;
    const agreeToTerms = document.getElementById('agreeToTerms').checked;
    
    // Validation
    if (!agreeToTerms) {
        showMessage('You must agree to the Terms of Service to register.', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long!', 'error');
        return false;
    }
    
    try {
        // Create user with Supabase Auth
        // The database trigger will automatically create entries in users and user_data tables
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                    grade: grade
                }
            }
        });
        
        if (authError) throw authError;
        
        // Check if user was created
        if (!authData.user) {
            showMessage('Registration successful! Please check your email to verify your account before logging in.', 'success');
            setTimeout(() => showLoginForm(), 3000);
            return false;
        }
        
        showMessage('Registration successful! Redirecting...', 'success');
        
        // Redirect after successful registration
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
        
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. ';
        
        if (error.message.includes('User already registered')) {
            errorMessage += 'This email is already registered.';
        } else if (error.message.includes('Invalid email')) {
            errorMessage += 'Please provide a valid email address.';
        } else {
            errorMessage += error.message;
        }
        
        showMessage(errorMessage, 'error');
    }
    
    return false;
}

// Handle user login with Supabase
async function handleLogin(event) {
    event.preventDefault();
    
    // Check if supabase is initialized
    if (typeof supabase === 'undefined' || !supabase || !supabase.auth) {
        showMessage('Login service is not initialized. Please refresh the page and try again.', 'error');
        console.error('Supabase is not initialized');
        return false;
    }
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Please enter both email and password.', 'error');
        return false;
    }
    
    try {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Update last login timestamp
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.user.id);
        
        // Track login
        if (typeof trackLogin === 'function') {
            trackLogin('email');
        }
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. ';
        
        if (error.message.includes('Invalid login credentials')) {
            errorMessage += 'Invalid email or password.';
        } else if (error.message.includes('Email not confirmed')) {
            errorMessage += 'Please verify your email first.';
        } else {
            errorMessage += error.message;
        }
        
        showMessage(errorMessage, 'error');
    }
    
    return false;
}

// Handle logout
async function handleLogout() {
    // Check if supabase is initialized
    if (typeof supabase === 'undefined' || !supabase || !supabase.auth) {
        console.error('Supabase is not initialized');
        // Force redirect to login even if supabase fails
        sessionStorage.clear();
        localStorage.removeItem('chatHistory');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        // Track logout before signing out
        if (typeof trackLogout === 'function') {
            trackLogout();
        }
        
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Clear any local storage
        sessionStorage.clear();
        localStorage.removeItem('chatHistory');
        
        // Redirect to login page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out: ' + error.message, 'error');
    }
}

// Forgot password modal functions
function showForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'block';
}

function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    document.getElementById('forgotPasswordForm').reset();
}

// Handle forgot password
async function handleForgotPassword(event) {
    event.preventDefault();
    
    // Check if supabase is initialized
    if (typeof supabase === 'undefined' || !supabase || !supabase.auth) {
        showToast('Password reset service is not initialized. Please refresh the page and try again.', 'error');
        console.error('Supabase is not initialized');
        return false;
    }
    
    const email = document.getElementById('forgotPasswordEmail').value.trim();
    
    if (!email) {
        showToast('Please enter your email address.', 'warning');
        return false;
    }
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html'
        });
        
        if (error) throw error;
        
        showToast('Password reset email sent! Please check your inbox.', 'success');
        closeForgotPasswordModal();
        
    } catch (error) {
        console.error('Password reset error:', error);
        showToast('Error sending reset email: ' + error.message, 'error');
    }
    
    return false;
}

// Check authentication status on page load (for home.html)
async function checkAuthStatus() {
    try {
        // Check if supabase is initialized
        if (typeof supabase === 'undefined' || !supabase || !supabase.auth) {
            console.error('Supabase is not initialized');
            // Wait a bit and retry
            await new Promise(resolve => setTimeout(resolve, 500));
            if (typeof supabase === 'undefined' || !supabase || !supabase.auth) {
                console.error('Supabase still not initialized after retry');
                window.location.href = 'index.html';
                return null;
            }
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
            // Not logged in, redirect to login page
            window.location.href = 'index.html';
            return null;
        }
        
        // Get user data from users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (userError) throw userError;
        
        return {
            user: session.user,
            profile: userData
        };
        
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = 'index.html';
        return null;
    }
}

// Get current user (helper function for compatibility)
async function getCurrentUser() {
    try {
        // Check if supabase is initialized
        if (typeof supabase === 'undefined' || !supabase || !supabase.auth) {
            console.error('Supabase is not initialized');
            return null;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        
        // Get profile data from users table
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
        
        return {
            id: user.id,
            email: user.email,
            name: profile?.name || '',
            grade: profile?.grade || '',
            ...profile
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Initialize auth listener (with safety check for supabase availability)
if (typeof supabase !== 'undefined' && supabase && supabase.auth) {
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
            window.location.href = 'index.html';
        }
    });
} else {
    // If supabase isn't ready, retry after a delay
    setTimeout(() => {
        if (typeof supabase !== 'undefined' && supabase && supabase.auth) {
            supabase.auth.onAuthStateChange((event, session) => {
                console.log('Auth state changed:', event);
                
                if (event === 'SIGNED_OUT') {
                    window.location.href = 'index.html';
                }
            });
        } else {
            console.error('Supabase is not initialized. Check that Supabase SDK and configuration are loaded.');
        }
    }, 500);
}
