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
    // Supabase Edge Function endpoint for secure OpenAI API calls
    // After deploying the edge function, update this URL
    API_ENDPOINT: 'https://yvvpqrtesmkpvtlpwaap.supabase.co/functions/v1/openai-chat',
    
    // Alternative: Google Gemini API (simpler setup, no backend needed)
    // Get free key at: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: '',
    
    // Application Settings
    APP_NAME: 'Bus2College',
    APP_VERSION: '1.0.0',
    
    // Use secure API (set to false to use Gemini directly)
    USE_SECURE_API: true
};

// Note: In a production environment, API keys should NEVER be stored in client-side code
// This is a simplified setup for rapid prototyping only
// For production, you would need a backend server to handle API calls securely
