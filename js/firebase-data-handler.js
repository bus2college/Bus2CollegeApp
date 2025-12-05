// ===================================
// Firebase Data Handler
// ===================================

// Get current user from Firebase auth
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

// Save user data to Firestore
async function saveUserData(field, data) {
    const user = getCurrentUser();
    if (!user) {
        console.error('No user logged in');
        return false;
    }
    
    try {
        const updateData = {};
        updateData[field] = data;
        
        await db.collection('userData').doc(user.id).update(updateData);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Load user data from Firestore
async function loadUserData() {
    const user = getCurrentUser();
    if (!user) {
        console.error('No user logged in');
        return null;
    }
    
    try {
        const doc = await db.collection('userData').doc(user.id).get();
        if (doc.exists) {
            return doc.data();
        } else {
            // Initialize empty user data
            const emptyData = {
                studentInfo: {},
                colleges: [],
                essays: {},
                activities: [],
                recommenders: [],
                dailyActivities: []
            };
            await db.collection('userData').doc(user.id).set(emptyData);
            return emptyData;
        }
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Save student info
async function saveStudentInfoToFirebase(studentInfo) {
    return await saveUserData('studentInfo', studentInfo);
}

// Save colleges list
async function saveCollegesToFirebase(colleges) {
    return await saveUserData('colleges', colleges);
}

// Save essays
async function saveEssaysToFirebase(essays) {
    return await saveUserData('essays', essays);
}

// Save activities
async function saveActivitiesToFirebase(activities) {
    return await saveUserData('activities', activities);
}

// Save recommenders
async function saveRecommendersToFirebase(recommenders) {
    return await saveUserData('recommenders', recommenders);
}

// Save daily activities
async function saveDailyActivitiesToFirebase(dailyActivities) {
    return await saveUserData('dailyActivities', dailyActivities);
}

// Save nav panel state
async function saveNavPanelState(isCollapsed) {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
        await db.collection('userPreferences').doc(user.id).set({
            navPanelCollapsed: isCollapsed
        }, { merge: true });
    } catch (error) {
        console.error('Error saving nav state:', error);
    }
}

// Load nav panel state
async function loadNavPanelState() {
    const user = getCurrentUser();
    if (!user) return false;
    
    try {
        const doc = await db.collection('userPreferences').doc(user.id).get();
        if (doc.exists) {
            return doc.data().navPanelCollapsed || false;
        }
    } catch (error) {
        console.error('Error loading nav state:', error);
    }
    return false;
}

// Save how-to section state
async function saveHowToSectionState(sectionId, isCollapsed) {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
        const updateData = {};
        updateData[`howToStates.${sectionId}`] = isCollapsed;
        
        await db.collection('userPreferences').doc(user.id).set(updateData, { merge: true });
    } catch (error) {
        console.error('Error saving how-to state:', error);
    }
}

// Load how-to section state
async function loadHowToSectionState(sectionId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    try {
        const doc = await db.collection('userPreferences').doc(user.id).get();
        if (doc.exists) {
            const data = doc.data();
            return data.howToStates && data.howToStates[sectionId] || false;
        }
    } catch (error) {
        console.error('Error loading how-to state:', error);
    }
    return false;
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
