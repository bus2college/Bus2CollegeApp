// ==================================================================
// Bus2College - API Configuration
// ==================================================================
// 
// INSTRUCTIONS:
// 1. Rename this file from "config.example.js" to "config.js"
// 2. Get your free API key from: https://console.anthropic.com/
// 3. Replace 'your-api-key-here' with your actual API key
// 4. Save the file
//
// IMPORTANT: Never commit config.js with real API keys to version control!
// Add config.js to your .gitignore file.
//
// ==================================================================

const CONFIG = {
    // Google Gemini API Key (FREE - 60 requests/minute)
    GEMINI_API_KEY: 'your-gemini-api-key-here',
    
    // Secure API Endpoint (optional - for OpenAI via backend)
    // Set to your secure backend endpoint (leave empty if not using a backend)
    API_ENDPOINT: '',
    
    // Use Gemini (free) instead of secure backend
    USE_SECURE_API: false,
    
    // Application Settings
    APP_NAME: 'Bus2College',
    APP_VERSION: '1.0.0'
};
