// ===================================
// AI Chat Integration
// ===================================

let conversationHistory = [];

// Get current page context
function getCurrentPageContext() {
    const currentPage = document.querySelector('.content-page.active');
    const pageName = currentPage?.id || 'login';
    const pageTitle = currentPage?.querySelector('h2')?.textContent || 'Bus2College Application';
    
    const pageContextMap = {
        'student-info': 'Student Information page - where users enter their academic profile, GPA, test scores, and background',
        'my-colleges': 'My Colleges page - where users build and manage their college list with deadlines and status tracking',
        'common-app-essay': 'My Common App Essay page - where users write and get AI feedback on their main Common Application essay (250-650 words)',
        'supplemental-essays': 'My Supplemental Essays page - where users manage college-specific supplemental essays',
        'my-activities': 'My Activities page - where users document their extracurricular activities, leadership roles, and achievements',
        'my-recommenders': 'My Recommenders page - where users track teachers and counselors for recommendation letters',
        'daily-tracker': 'Daily Tracker page - where users log daily college application progress and tasks',
        'admissions-status': 'Admissions Status page - where users track application status, decisions, and deadlines',
        'login': 'Login page'
    };
    
    return {
        pageName: pageName,
        pageTitle: pageTitle,
        pageDescription: pageContextMap[pageName] || pageTitle
    };
}

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
    
    // Set initial system context if conversation is empty
    if (conversationHistory.length === 0) {
        const pageContext = getCurrentPageContext();
        conversationHistory.push({
            role: 'system',
            content: `You are an AI assistant integrated into the Bus2College web application (bus2college.app), a comprehensive college application management platform. 

Current Context: The user is currently on the "${pageContext.pageTitle}" (${pageContext.pageDescription}).

Your role is to:
1. Help students with college application questions and guidance
2. Provide specific help related to the current page they're viewing
3. Assist with essay writing, brainstorming, and feedback
4. Answer questions about colleges, deadlines, and application strategies
5. Help with activity descriptions, recommendation letters, and all aspects of college applications

Always be supportive, encouraging, and provide actionable advice. When relevant, reference the specific page context in your responses.`
        });
    }
}

// Get current page content for AI context
function getCurrentPageContent() {
    const currentPage = document.querySelector('.content-page.active');
    if (!currentPage) return null;
    
    const pageName = currentPage.id;
    const pageTitle = currentPage.querySelector('h2')?.textContent || '';
    let pageContent = {};
    
    // Extract content based on page type
    switch(pageName) {
        case 'common-app-essay':
            const draftEditor = document.getElementById('studentDraftEditor');
            const promptSelect = document.getElementById('commonAppPrompt');
            pageContent = {
                page: 'Common App Essay',
                selected_prompt: promptSelect?.selectedOptions[0]?.text || 'None selected',
                draft_text: draftEditor?.textContent?.trim() || 'Empty',
                word_count: document.getElementById('essayWordCount')?.textContent || '0'
            };
            break;
        case 'my-colleges':
            const collegesList = document.getElementById('collegesList');
            pageContent = {
                page: 'My Colleges',
                colleges_added: collegesList?.querySelectorAll('.college-item').length || 0
            };
            break;
        case 'student-info':
            pageContent = {
                page: 'Student Information',
                note: 'Student profile and academic information'
            };
            break;
        default:
            pageContent = {
                page: pageTitle,
                note: 'User is viewing ' + pageTitle
            };
    }
    
    return pageContent;
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
        showToast('Please configure API in js/config.js file first! For secure setup, deploy the backend API.', 'warning', 6000);
        return;
    }
    
    // Disable input while processing
    chatInput.disabled = true;
    sendButton.disabled = true;
    chatStatus.textContent = 'AI is thinking...';
    
    // Get current page content
    const pageContent = getCurrentPageContent();
    let contextualMessage = userMessage;
    
    // Add page context to the user's message for the AI
    if (pageContent) {
        contextualMessage = `[Current Page Context: ${JSON.stringify(pageContent)}]\n\nUser Question: ${userMessage}`;
    }
    
    // Track AI prompt
    try {
        if (typeof trackAIPrompt === 'function') {
            await trackAIPrompt(userMessage, { source: 'ai_chat' });
        }
    } catch (e) {
        console.error('Error tracking prompt:', e);
    }
    
    // Add user message to chat (display original message, not contextual)
    addMessageToChat('user', userMessage);
    chatInput.value = '';
    
    // Add to conversation history with context
    conversationHistory.push({
        role: 'user',
        content: contextualMessage
    });
    
    const startTime = Date.now();
    try {
        // Use the secure API client
        const aiMessage = await callAI(conversationHistory);
        const responseTime = Date.now() - startTime;
        
        console.log('AI Response received:', aiMessage?.substring(0, 100));
        console.log('AI Response length:', aiMessage?.length);
        
        // Add AI response to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: aiMessage
        });
        
        // Track AI response
        try {
            if (typeof trackAIResponse === 'function') {
                console.log('Calling trackAIResponse with:', {
                    promptLength: userMessage.length,
                    responseLength: aiMessage?.length,
                    responseTime: responseTime
                });
                await trackAIResponse(userMessage, aiMessage, responseTime);
                console.log('✓ trackAIResponse completed');
            }
        } catch (e) {
            console.error('Error tracking response:', e);
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
    showConfirm('Are you sure you want to clear the chat history?', 'Clear Chat?', () => {
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
        
        showToast('Chat history cleared', 'success');
    });
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
