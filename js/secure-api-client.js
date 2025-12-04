// ===================================
// Secure API Client
// ===================================
// This file handles API calls to the secure backend proxy

/**
 * Call the secure OpenAI API endpoint
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Optional parameters (model, temperature, max_tokens)
 * @returns {Promise<string>} - AI response text
 */
async function callSecureOpenAI(messages, options = {}) {
    const {
        model = 'gpt-4o-mini',
        temperature = 0.7,
        max_tokens = 1000
    } = options;

    try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                model,
                temperature,
                max_tokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'API request failed');
        }

        return data.response;
    } catch (error) {
        console.error('Secure API Error:', error);
        throw new Error(`Failed to get AI response: ${error.message}`);
    }
}

/**
 * Call Gemini API (fallback option - client-side)
 * @param {Array} messages - Array of message objects
 * @returns {Promise<string>} - AI response text
 */
async function callGeminiAPI(messages) {
    try {
        // Convert messages to Gemini format
        const prompt = messages.map(msg => {
            const role = msg.role === 'assistant' ? 'model' : 'user';
            return `${role}: ${msg.content}`;
        }).join('\n\n');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error(`Failed to get AI response: ${error.message}`);
    }
}

/**
 * Main AI call function - automatically selects best available API
 * @param {Array} messages - Array of message objects
 * @param {Object} options - Optional parameters
 * @returns {Promise<string>} - AI response text
 */
async function callAI(messages, options = {}) {
    // Check if secure API is available and configured
    if (CONFIG.USE_SECURE_API && CONFIG.API_ENDPOINT) {
        try {
            return await callSecureOpenAI(messages, options);
        } catch (error) {
            console.error('Secure API failed, trying fallback:', error);
            // Fall through to Gemini if secure API fails
        }
    }
    
    // Try Gemini as fallback
    if (CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
        return await callGeminiAPI(messages);
    }
    
    throw new Error('No AI service configured. Please configure API_ENDPOINT or GEMINI_API_KEY in config.js');
}
