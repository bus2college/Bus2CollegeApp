// ==================================================================
// Bus2College - API Configuration
// ==================================================================
// 
// SETUP REQUIRED:
// Choose ONE of the following AI providers and add your API key:
//
// Option 1: Google Gemini (Recommended - Free & Easy)
//   - Get free API key at: https://makersuite.google.com/app/apikey
//   - Free tier: 60 requests per minute (unlimited!)
//   - Best for: Quick setup, generous free tier, most students
//
// Option 2: Anthropic Claude (Premium Quality)
//   - Get API key at: https://console.anthropic.com/
//   - Free tier: $5 credit (~1,600 reviews)
//   - Best for: Highest quality feedback, competitive applications
//
// The system will automatically use whichever key you configure.
// You can configure both and the system will prefer Gemini first.
//
// ==================================================================

const CONFIG = {
    // Netlify Function Endpoint (separate from main site)
    API_ENDPOINT: 'https://bus2college-api.netlify.app/.netlify/functions/openai-proxy',
    
    // Application Settings
    APP_NAME: 'Bus2College',
    APP_VERSION: '1.0.0',
    
    // Use secure API
    USE_SECURE_API: true
};

// Note: In a production environment, API keys should NEVER be stored in client-side code
// This is a simplified setup for rapid prototyping only
// For production, you would need a backend server to handle API calls securely
