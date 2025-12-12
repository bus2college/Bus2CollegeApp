// ===================================
// AI Chat Integration
// ===================================

let conversationHistory = [];

// Initialize chat
function initializeChat() {
    // Load conversation history from localStorage
    const user = getCurrentUser();
    if (user) {
        const chatHistoryKey = `bus2college_chat_${user.id}`;
        const savedHistory = localStorage.getItem(chatHistoryKey);
        if (savedHistory) {
            conversationHistory = JSON.parse(savedHistory);
            displayChatHistory();
        }
    }
}

// Send chat message
async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendChatBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatStatus = document.getElementById('chatStatus');
    
    const userMessage = chatInput.value.trim();
    
    if (!userMessage) {
        return;
    }
    
    // Check if any API key is configured
    if (typeof CONFIG === 'undefined' || (!CONFIG.API_ENDPOINT && !CONFIG.GEMINI_API_KEY)) {
        alert('Please configure API in js/config.js file first!\n\nFor secure setup, deploy the backend API.');
        return;
    }
    
    // Disable input while processing
    chatInput.disabled = true;
    sendButton.disabled = true;
    chatStatus.textContent = 'AI is thinking...';
    
    // Track AI prompt
    if (typeof trackAIPrompt === 'function') {
        trackAIPrompt(userMessage, { source: 'ai_chat' });
    }
    
    // Add user message to chat
    addMessageToChat('user', userMessage);
    chatInput.value = '';
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });
    
    const startTime = Date.now();
    try {
        // Use the secure API client
        const aiMessage = await callAI(conversationHistory);
        const responseTime = Date.now() - startTime;
        
        // Add AI response to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: aiMessage
        });
        
        // Track AI response
        if (typeof trackAIResponse === 'function') {
            trackAIResponse(userMessage, aiMessage, responseTime);
        }
        
        // Display AI message
        addMessageToChat('ai', aiMessage);
        
        // Save conversation history
        saveChatHistory();
        
        chatStatus.textContent = '';
        
    } catch (error) {
        console.error('Error calling AI API:', error);
        addMessageToChat('ai', `I'm sorry, I encountered an error: ${error.message}. Please check your API key configuration and try again.`);
        chatStatus.textContent = 'Error occurred';
    } finally {
        // Re-enable input
        chatInput.disabled = false;
        sendButton.disabled = false;
        chatInput.focus();
    }
}

// Add message to chat display
function addMessageToChat(type, message) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    // Convert markdown-like formatting to HTML
    const formattedMessage = formatMessageContent(message);
    messageDiv.innerHTML = formattedMessage;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format message content (basic markdown support)
function formatMessageContent(content) {
    // Convert newlines to <br>
    let formatted = content.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already wrapped
    if (!formatted.startsWith('<p>')) {
        formatted = '<p>' + formatted + '</p>';
    }
    
    // Bold text: **text** or __text__
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Italic text: *text* or _text_
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // Lists: lines starting with - or *
    formatted = formatted.replace(/(<br>|<\/p><p>)[-*] (.+?)(?=<br>|<\/p>|$)/g, '$1<li>$2</li>');
    
    // Wrap consecutive list items in ul
    formatted = formatted.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');
    
    return formatted;
}

// Display chat history on page load
function displayChatHistory() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Clear existing messages except welcome message
    const welcomeMessage = chatMessages.querySelector('.ai-message');
    chatMessages.innerHTML = '';
    if (welcomeMessage) {
        chatMessages.appendChild(welcomeMessage);
    }
    
    // Display all messages from history
    conversationHistory.forEach(msg => {
        addMessageToChat(msg.role === 'user' ? 'user' : 'ai', msg.content);
    });
}

// Save chat history to localStorage
function saveChatHistory() {
    const user = getCurrentUser();
    if (user) {
        const chatHistoryKey = `bus2college_chat_${user.id}`;
        localStorage.setItem(chatHistoryKey, JSON.stringify(conversationHistory));
    }
}

// Clear chat history
function clearChatHistory() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        conversationHistory = [];
        
        const user = getCurrentUser();
        if (user) {
            const chatHistoryKey = `bus2college_chat_${user.id}`;
            localStorage.removeItem(chatHistoryKey);
        }
        
        // Clear chat display
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="chat-message ai-message">
                <p>Hello! I'm your Bus2College AI assistant. I'm here to help you with:</p>
                <ul>
                    <li>Essay writing and feedback</li>
                    <li>College application questions</li>
                    <li>Choosing the right colleges</li>
                    <li>Application timeline advice</li>
                </ul>
                <p>Ask me anything!</p>
            </div>
        `;
    }
}

// Initialize chat on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initializeChat();
        initializeChatPanelState();
    });
}

// API Helper Functions
async function callOpenAIChat(conversationHistory) {
    const systemPrompt = `You are a helpful AI assistant for Bus2College, a college application management platform. 

Your role is to help high school students with:
- Writing and reviewing college application essays (Common App and supplemental essays)
- Providing accurate information about colleges and admissions processes
- Offering guidance on choosing colleges that fit their interests and qualifications
- Answering questions about application timelines, requirements, and strategies
- Reviewing their activities lists and suggesting improvements
- Providing motivation and support during the stressful application process

Be encouraging, specific, and constructive in your feedback. Use publicly available information about colleges and admissions. When reviewing essays, provide detailed feedback on content, structure, grammar, and impact.`;
    
    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        }))
    ];
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.OpenAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callClaudeChat(conversationHistory) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': CONFIG.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            system: `You are a helpful AI assistant for Bus2College, a college application management platform. 
            
Your role is to help high school students with:
- Writing and reviewing college application essays (Common App and supplemental essays)
- Providing accurate information about colleges and admissions processes
- Offering guidance on choosing colleges that fit their interests and qualifications
- Answering questions about application timelines, requirements, and strategies
- Reviewing their activities lists and suggesting improvements
- Providing motivation and support during the stressful application process

Be encouraging, specific, and constructive in your feedback. Use publicly available information about colleges and admissions. When reviewing essays, provide detailed feedback on content, structure, grammar, and impact.`,
            messages: conversationHistory
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

// ===================================
// Chat Panel Collapse/Expand
// ===================================

function toggleChatPanel() {
    const chatPanel = document.getElementById('rightChatPanel');
    const toggleIcon = document.getElementById('toggleChatIcon');
    const isCollapsed = chatPanel.classList.toggle('collapsed');
    
    // Update icon
    toggleIcon.textContent = isCollapsed ? '▶' : '◀';
    
    // Save state to localStorage
    const user = getCurrentUser();
    if (user) {
        localStorage.setItem(`bus2college_chat_collapsed_${user.id}`, isCollapsed);
    }
}

// Initialize chat panel state on load
function initializeChatPanelState() {
    const user = getCurrentUser();
    if (user) {
        const isCollapsed = localStorage.getItem(`bus2college_chat_collapsed_${user.id}`) === 'true';
        if (isCollapsed) {
            const chatPanel = document.getElementById('rightChatPanel');
            const toggleIcon = document.getElementById('toggleChatIcon');
            if (chatPanel && toggleIcon) {
                chatPanel.classList.add('collapsed');
                toggleIcon.textContent = '▶';
            }
        }
    }
}
