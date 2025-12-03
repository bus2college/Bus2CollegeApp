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
    // Anthropic Claude API Key
    // Get yours at: https://console.anthropic.com/
    CLAUDE_API_KEY: 'your-api-key-here',
    
    // Alternative: You can also use Google Gemini API
    // Get yours at: https://makersuite.google.com/app/apikey
    // GEMINI_API_KEY: 'your-gemini-api-key-here',
    
    // Model Configuration (optional - defaults to claude-3-5-sonnet)
    MODEL: 'claude-3-5-sonnet-20241022',
    
    // Max tokens for essay feedback (optional - default 3000)
    MAX_TOKENS: 3000
};
