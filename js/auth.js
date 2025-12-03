// ===================================
// Authentication Management
// ===================================

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

// Handle user registration
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const grade = document.getElementById('registerGrade').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long!', 'error');
        return false;
    }
    
    // Check if user already exists
    const users = getUsersFromStorage();
    if (users.find(u => u.email === email)) {
        showMessage('Email already registered! Please login.', 'error');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In production, this should be hashed!
        grade: grade,
        registeredDate: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    saveUsersToStorage(users);
    
    // Initialize user data files
    initializeUserData(newUser.id);
    
    showMessage('Registration successful! Please login.', 'success');
    
    // Clear form and switch to login
    document.getElementById('registerFormElement').reset();
    setTimeout(() => {
        showLoginForm();
    }, 2000);
    
    return false;
}

// Handle user login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Get users
    const users = getUsersFromStorage();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('isLoggedIn', 'true');
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    } else {
        showMessage('Invalid email or password!', 'error');
    }
    
    return false;
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Check if user is authenticated
function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('home.html') && !isLoggedIn) {
        window.location.href = 'index.html';
    }
    
    if (currentPage.includes('index.html') && isLoggedIn) {
        window.location.href = 'home.html';
    }
}

// Get users from localStorage
function getUsersFromStorage() {
    const usersData = localStorage.getItem('bus2college_users');
    return usersData ? JSON.parse(usersData) : [];
}

// Save users to localStorage
function saveUsersToStorage(users) {
    localStorage.setItem('bus2college_users', JSON.stringify(users));
}

// Initialize user-specific data structures
function initializeUserData(userId) {
    const userDataKey = `bus2college_data_${userId}`;
    
    const initialData = {
        colleges: [],
        commonAppEssay: {
            prompt: '',
            content: '',
            lastModified: null
        },
        supplementalEssays: [],
        activities: [],
        recommenders: [],
        dailyTracker: [],
        admissionsStatus: {
            notStarted: 0,
            inProgress: 0,
            submitted: 0
        }
    };
    
    localStorage.setItem(userDataKey, JSON.stringify(initialData));
}

// Get current logged-in user
function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Load user data on home page
function loadUserData() {
    const user = getCurrentUser();
    if (user) {
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) {
            userNameDisplay.textContent = user.name;
        }
        
        // Load the active page data (typically my-colleges on initial load)
        const activePage = document.querySelector('.content-page.active');
        if (activePage && typeof loadPageData === 'function') {
            loadPageData(activePage.id);
        }
    }
}

// Run authentication check on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', checkAuthentication);
}

// ===================================
// Forgot Password Functions
// ===================================

// Show forgot password modal
function showForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.add('show');
        document.getElementById('forgotPasswordEmail').focus();
    }
}

// Close forgot password modal
function closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('forgotPasswordForm').reset();
    }
}

// Handle forgot password submission
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotPasswordEmail').value.trim();
    
    // Get users
    const users = getUsersFromStorage();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showMessage('Email address not found. Please check and try again.', 'error');
        return false;
    }
    
    // Send password via email
    sendPasswordEmail(user.email, user.password, user.name);
    
    return false;
}

// Send password via email using EmailJS or similar service
function sendPasswordEmail(email, password, name) {
    // For demonstration, we'll show a success message
    // In production, you would integrate with an email service like:
    // - EmailJS (https://www.emailjs.com/)
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Or your own backend email service
    
    // Simulated email sending
    console.log('Sending password recovery email to:', email);
    console.log('Password:', password);
    
    // Close modal
    closeForgotPasswordModal();
    
    // Show success message
    showMessage(`Password has been sent to ${email}. Please check your inbox.`, 'success');
    
    // In a real implementation, you would do something like this:
    /*
    // Example using EmailJS (requires setup and API key)
    emailjs.send('service_id', 'template_id', {
        to_email: email,
        to_name: name,
        password: password,
        app_name: 'Bus2College'
    })
    .then(function(response) {
        closeForgotPasswordModal();
        showMessage(`Password has been sent to ${email}. Please check your inbox.`, 'success');
    }, function(error) {
        showMessage('Failed to send email. Please try again later.', 'error');
        console.error('Email send error:', error);
    });
    */
    
    // For now, we'll also show an alert with the password (ONLY for development/testing)
    setTimeout(() => {
        alert(`Development Mode: Your password is: ${password}\n\nIn production, this would be sent via email to ${email}`);
    }, 500);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('forgotPasswordModal');
    if (event.target === modal) {
        closeForgotPasswordModal();
    }
}
