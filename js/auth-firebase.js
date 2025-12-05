// ===================================
// Firebase Authentication Management
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

// Handle user registration with Firebase
async function handleRegister(event) {
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
    
    try {
        // Create user with Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile with name
        await user.updateProfile({
            displayName: name
        });
        
        // Store additional user data in Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            grade: grade,
            registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Initialize user data structure
        await db.collection('userData').doc(user.uid).set({
            studentInfo: {},
            colleges: [],
            essays: {},
            activities: [],
            recommenders: [],
            dailyActivities: []
        });
        
        showMessage('Registration successful! Redirecting...', 'success');
        
        // Redirect to main app
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
        
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific Firebase error codes
        if (error.code === 'auth/email-already-in-use') {
            showMessage('This email is already registered. Please login instead.', 'error');
        } else if (error.code === 'auth/invalid-email') {
            showMessage('Invalid email address.', 'error');
        } else if (error.code === 'auth/weak-password') {
            showMessage('Password is too weak. Please use at least 6 characters.', 'error');
        } else {
            showMessage('Registration failed: ' + error.message, 'error');
        }
    }
    
    return false;
}

// Handle user login with Firebase
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Please enter both email and password!', 'error');
        return false;
    }
    
    try {
        // Sign in with Firebase Authentication
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update last login time
        await db.collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to main app
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific Firebase error codes
        if (error.code === 'auth/user-not-found') {
            showMessage('No account found with this email. Please register first.', 'error');
        } else if (error.code === 'auth/wrong-password') {
            showMessage('Incorrect password. Please try again.', 'error');
        } else if (error.code === 'auth/invalid-email') {
            showMessage('Invalid email address.', 'error');
        } else if (error.code === 'auth/too-many-requests') {
            showMessage('Too many failed login attempts. Please try again later.', 'error');
        } else {
            showMessage('Login failed: ' + error.message, 'error');
        }
    }
    
    return false;
}

// Handle forgot password with Firebase
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotPasswordEmail').value.trim();
    
    if (!email) {
        showMessage('Please enter your email address!', 'error');
        return false;
    }
    
    try {
        // Send password reset email
        await auth.sendPasswordResetEmail(email);
        
        showMessage('Password reset email sent! Please check your inbox.', 'success');
        
        // Close modal after 2 seconds
        setTimeout(() => {
            closeForgotPasswordModal();
        }, 2000);
        
    } catch (error) {
        console.error('Password reset error:', error);
        
        if (error.code === 'auth/user-not-found') {
            showMessage('No account found with this email address.', 'error');
        } else if (error.code === 'auth/invalid-email') {
            showMessage('Invalid email address.', 'error');
        } else {
            showMessage('Failed to send reset email: ' + error.message, 'error');
        }
    }
    
    return false;
}

// Get current user from Firebase
function getCurrentUser() {
    const user = auth.currentUser;
    if (user) {
        return {
            id: user.uid,
            email: user.email,
            name: user.displayName || 'User'
        };
    }
    return null;
}

// Check if user is logged in
function checkAuth() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}

// Logout function
async function handleLogout() {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout: ' + error.message);
    }
}

// Show/hide forgot password modal
function showForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'flex';
}

function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    hideMessage();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('forgotPasswordModal');
    if (event.target == modal) {
        closeForgotPasswordModal();
    }
}

// Export Excel functionality
async function exportToExcel() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login first');
        return;
    }
    
    try {
        // Get user data from Firestore
        const userDataDoc = await db.collection('userData').doc(user.id).get();
        const userData = userDataDoc.data() || {};
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Export Student Info
        if (userData.studentInfo && Object.keys(userData.studentInfo).length > 0) {
            const studentInfo = userData.studentInfo;
            const studentData = [[
                'Name', 'Email', 'Grade', 'GPA', 'SAT', 'ACT', 'State', 'Interests'
            ], [
                studentInfo.name || '',
                user.email || '',
                studentInfo.grade || '',
                studentInfo.gpa || '',
                studentInfo.sat || '',
                studentInfo.act || '',
                studentInfo.state || '',
                studentInfo.interests || ''
            ]];
            const ws1 = XLSX.utils.aoa_to_sheet(studentData);
            XLSX.utils.book_append_sheet(wb, ws1, 'Student Info');
        }
        
        // Export Colleges
        if (userData.colleges && userData.colleges.length > 0) {
            const collegesData = [['College Name', 'Category', 'Status', 'Deadline', 'Notes']];
            userData.colleges.forEach(college => {
                collegesData.push([
                    college.name || '',
                    college.category || '',
                    college.status || '',
                    college.deadline || '',
                    college.notes || ''
                ]);
            });
            const ws2 = XLSX.utils.aoa_to_sheet(collegesData);
            XLSX.utils.book_append_sheet(wb, ws2, 'My Colleges');
        }
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Bus2College_Data_${timestamp}.xlsx`;
        
        // Download file
        XLSX.writeFile(wb, filename);
        
        alert('Data exported successfully!');
        
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export data: ' + error.message);
    }
}

// Initialize - check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    // Use Firebase's onAuthStateChanged to avoid race conditions
    let hasRedirected = false; // Prevent multiple redirects
    
    auth.onAuthStateChanged((user) => {
        if (hasRedirected) return; // Only redirect once
        
        const isIndexPage = window.location.pathname.includes('index.html') || 
                           window.location.pathname === '/' || 
                           window.location.pathname === '/Bus2College/' ||
                           window.location.pathname === '/Bus2College/index.html';
        const isHomePage = window.location.pathname.includes('home.html');
        
        // If on index.html (login page) and user is logged in, redirect to home
        if (isIndexPage && user) {
            hasRedirected = true;
            window.location.href = 'home.html';
        }
        
        // If on home.html and user is NOT logged in, redirect to login page
        if (isHomePage && !user) {
            hasRedirected = true;
            window.location.href = 'index.html';
        }
    });
});
