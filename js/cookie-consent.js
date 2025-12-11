// ==================================================================
// Cookie Consent Management
// ==================================================================

// Check if user has already made a cookie choice
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        document.getElementById('cookieConsent').style.display = 'block';
    } else {
        const preferences = JSON.parse(consent);
        applyCookiePreferences(preferences);
    }
}

function acceptCookies() {
    const preferences = {
        essential: true,
        analytics: true,
        functional: true,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    document.getElementById('cookieConsent').style.display = 'none';
    applyCookiePreferences(preferences);
}

function rejectCookies() {
    const preferences = {
        essential: true,
        analytics: false,
        functional: false,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    document.getElementById('cookieConsent').style.display = 'none';
    applyCookiePreferences(preferences);
}

function showCookieSettings() {
    document.getElementById('cookieSettingsModal').style.display = 'flex';
    // Load current preferences if they exist
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
        const preferences = JSON.parse(consent);
        document.getElementById('analyticsConsent').checked = preferences.analytics;
        document.getElementById('functionalConsent').checked = preferences.functional;
    } else {
        document.getElementById('analyticsConsent').checked = true;
        document.getElementById('functionalConsent').checked = true;
    }
}

function closeCookieSettings() {
    document.getElementById('cookieSettingsModal').style.display = 'none';
}

function saveeCookiePreferences() {
    const preferences = {
        essential: true,
        analytics: document.getElementById('analyticsConsent').checked,
        functional: document.getElementById('functionalConsent').checked,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    document.getElementById('cookieConsent').style.display = 'none';
    document.getElementById('cookieSettingsModal').style.display = 'none';
    applyCookiePreferences(preferences);
}

function applyCookiePreferences(preferences) {
    // Apply cookie preferences based on user choice
    console.log('Cookie preferences applied:', preferences);
    
    // Here you would enable/disable various tracking scripts based on preferences
    if (preferences.analytics) {
        // Enable analytics (e.g., Google Analytics)
        console.log('Analytics enabled');
        // Example: Load Google Analytics script here
        // loadGoogleAnalytics();
    } else {
        console.log('Analytics disabled');
    }
    
    if (preferences.functional) {
        // Enable functional cookies
        console.log('Functional cookies enabled');
    } else {
        console.log('Functional cookies disabled');
    }
}

// Show cookie banner on page load if no consent exists
window.addEventListener('DOMContentLoaded', checkCookieConsent);
