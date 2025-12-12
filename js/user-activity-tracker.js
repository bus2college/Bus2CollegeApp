// ===================================
// User Activity Tracker
// ===================================
// Captures all user interactions, clicks, prompts, and actions

/**
 * Activity Types
 */
const ActivityType = {
    CLICK: 'click',
    PAGE_VIEW: 'page_view',
    AI_PROMPT: 'ai_prompt',
    AI_RESPONSE: 'ai_response',
    FORM_SUBMIT: 'form_submit',
    DATA_SAVE: 'data_save',
    DATA_LOAD: 'data_load',
    BUTTON_CLICK: 'button_click',
    NAVIGATION: 'navigation',
    LOGIN: 'login',
    LOGOUT: 'logout',
    REGISTER: 'register',
    ERROR: 'error',
    EXPORT: 'export',
    IMPORT: 'import',
    SEARCH: 'search',
    FILTER: 'filter',
    MODAL_OPEN: 'modal_open',
    MODAL_CLOSE: 'modal_close'
};

/**
 * Log activity to Supabase
 */
async function logActivity(activityType, details = {}) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;
        
        if (!userId) {
            console.warn('No user logged in, skipping activity tracking:', activityType);
            return;
        }
        
        // Get the actual page title from the details or from the active page
        let pageTitle = details.page_title;
        if (!pageTitle) {
            const currentPage = document.querySelector('.content-page.active');
            pageTitle = currentPage?.querySelector('h2')?.textContent || document.title;
        }
        
        const activityData = {
            user_id: userId,
            activity_type: activityType,
            details: details,
            page_url: window.location.href,
            page_title: pageTitle,
            timestamp: new Date().toISOString(),
            session_id: getSessionId(),
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        };

        console.log('Logging activity:', activityType, 'User:', userId);

        const { data, error } = await supabase
            .from('user_activities')
            .insert([activityData]);

        if (error) {
            console.error('Error logging activity to Supabase:', error);
            console.error('Activity data:', activityData);
        } else {
            console.log('✓ Activity logged successfully:', activityType);
        }
    } catch (error) {
        console.error('Error in logActivity function:', error);
    }
}

/**
 * Get or create session ID
 */
function getSessionId() {
    let sessionId = sessionStorage.getItem('activity_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('activity_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Track all clicks on the page
 */
function initializeClickTracking() {
    document.addEventListener('click', function(event) {
        const element = event.target;
        const tagName = element.tagName.toLowerCase();
        const className = element.className || '';
        const id = element.id || '';
        const text = element.textContent?.trim().substring(0, 100) || '';
        
        // Get current page name
        const currentPage = document.querySelector('.content-page.active');
        const pageName = currentPage?.id || 'login';
        const pageTitle = currentPage?.querySelector('h2')?.textContent || document.title;
        
        // Check if it's a button and get button name
        let buttonName = null;
        let buttonType = null;
        if (tagName === 'button' || element.closest('button')) {
            const btn = tagName === 'button' ? element : element.closest('button');
            buttonName = btn.textContent?.trim() || btn.getAttribute('title') || btn.getAttribute('aria-label');
            buttonType = btn.className;
        }
        
        const clickDetails = {
            tag: tagName,
            class: className,
            id: id,
            text: text,
            href: element.href || null,
            x: event.clientX,
            y: event.clientY,
            page_name: pageName,
            page_title: pageTitle,
            button_name: buttonName,
            button_type: buttonType
        };

        logActivity(ActivityType.CLICK, clickDetails);
    }, true);
}

/**
 * Track button clicks specifically
 */
function trackButtonClick(buttonName, buttonId, additionalData = {}) {
    // Get current page info
    const currentPage = document.querySelector('.content-page.active');
    const pageName = currentPage?.id || 'login';
    const pageTitle = currentPage?.querySelector('h2')?.textContent || document.title;
    
    logActivity(ActivityType.BUTTON_CLICK, {
        button_name: buttonName,
        button_id: buttonId,
        page_name: pageName,
        page_title: pageTitle,
        ...additionalData
    });
}

/**
 * Track page navigation
 */
function trackPageView(pageName) {
    // Get page title from the h2 element
    const currentPage = document.getElementById(pageName);
    const pageTitle = currentPage?.querySelector('h2')?.textContent || pageName;
    
    logActivity(ActivityType.PAGE_VIEW, {
        page_name: pageName,
        page_title: pageTitle,
        referrer: document.referrer
    });
}

/**
 * Track AI prompt submission
 */
async function trackAIPrompt(prompt, context = {}) {
    const currentPage = document.querySelector('.content-page.active');
    const pageName = currentPage?.id || 'ai-assistant';
    const pageTitle = currentPage?.querySelector('h2')?.textContent || 'AI Assistant';
    
    console.log('🔵 Tracking AI Prompt:', prompt.substring(0, 50));
    
    await logActivity(ActivityType.AI_PROMPT, {
        prompt: prompt,
        prompt_length: prompt.length,
        page_name: pageName,
        page_title: pageTitle,
        ...context
    });
}

/**
 * Track AI response received
 */
async function trackAIResponse(prompt, response, responseTime = null) {
    const currentPage = document.querySelector('.content-page.active');
    const pageName = currentPage?.id || 'ai-assistant';
    const pageTitle = currentPage?.querySelector('h2')?.textContent || 'AI Assistant';
    
    console.log('🟢 Tracking AI Response - Length:', response?.length || 0, 'Response time:', responseTime);
    console.log('🟢 Response content:', response);
    
    // Ensure response is a string
    const responseText = typeof response === 'string' ? response : String(response || '');
    
    await logActivity(ActivityType.AI_RESPONSE, {
        prompt: prompt || '',
        prompt_preview: (prompt || '').substring(0, 200),
        response: responseText,
        response_preview: responseText.substring(0, 200),
        response_length: responseText.length,
        response_time_ms: responseTime,
        page_name: pageName,
        page_title: pageTitle
    });
}

/**
 * Track form submissions
 */
function trackFormSubmit(formName, formData = {}) {
    logActivity(ActivityType.FORM_SUBMIT, {
        form_name: formName,
        field_count: Object.keys(formData).length,
        fields: Object.keys(formData)
    });
}

/**
 * Track data save operations
 */
function trackDataSave(dataType, recordCount = 1) {
    logActivity(ActivityType.DATA_SAVE, {
        data_type: dataType,
        record_count: recordCount
    });
}

/**
 * Track data load operations
 */
function trackDataLoad(dataType, recordCount = 0) {
    logActivity(ActivityType.DATA_LOAD, {
        data_type: dataType,
        record_count: recordCount
    });
}

/**
 * Track navigation between sections
 */
function trackNavigation(fromPage, toPage) {
    logActivity(ActivityType.NAVIGATION, {
        from_page: fromPage,
        to_page: toPage
    });
}

/**
 * Track user authentication events
 */
function trackLogin(method = 'email') {
    logActivity(ActivityType.LOGIN, {
        login_method: method
    });
}

function trackLogout() {
    logActivity(ActivityType.LOGOUT, {});
}

function trackRegister(method = 'email') {
    logActivity(ActivityType.REGISTER, {
        registration_method: method
    });
}

/**
 * Track errors
 */
function trackError(errorType, errorMessage, context = {}) {
    logActivity(ActivityType.ERROR, {
        error_type: errorType,
        error_message: errorMessage,
        ...context
    });
}

/**
 * Track export operations
 */
function trackExport(exportType, format = 'json') {
    logActivity(ActivityType.EXPORT, {
        export_type: exportType,
        format: format
    });
}

/**
 * Track import operations
 */
function trackImport(importType, recordCount = 0) {
    logActivity(ActivityType.IMPORT, {
        import_type: importType,
        record_count: recordCount
    });
}

/**
 * Track search operations
 */
function trackSearch(searchQuery, resultsCount = 0, searchType = 'general') {
    logActivity(ActivityType.SEARCH, {
        search_query: searchQuery,
        results_count: resultsCount,
        search_type: searchType
    });
}

/**
 * Track filter usage
 */
function trackFilter(filterType, filterValue) {
    logActivity(ActivityType.FILTER, {
        filter_type: filterType,
        filter_value: filterValue
    });
}

/**
 * Track modal interactions
 */
function trackModalOpen(modalName) {
    logActivity(ActivityType.MODAL_OPEN, {
        modal_name: modalName
    });
}

function trackModalClose(modalName, action = 'close') {
    logActivity(ActivityType.MODAL_CLOSE, {
        modal_name: modalName,
        close_action: action
    });
}

/**
 * Track page visibility changes
 */
function initializeVisibilityTracking() {
    document.addEventListener('visibilitychange', function() {
        logActivity('visibility_change', {
            visibility_state: document.visibilityState,
            hidden: document.hidden
        });
    });
}

/**
 * Track time spent on page
 */
let pageStartTime = Date.now();
function trackPageTimeSpent() {
    const timeSpent = Date.now() - pageStartTime;
    logActivity('page_time_spent', {
        time_spent_ms: timeSpent,
        time_spent_seconds: Math.round(timeSpent / 1000)
    });
}

// Track page unload
window.addEventListener('beforeunload', function() {
    trackPageTimeSpent();
});

/**
 * Initialize all tracking
 */
function initializeActivityTracking() {
    console.log('Initializing user activity tracking...');
    
    // Initialize click tracking
    initializeClickTracking();
    
    // Initialize visibility tracking
    initializeVisibilityTracking();
    
    // Track initial page view
    const currentPage = document.querySelector('.content-page:not([style*="display: none"])')?.id || 'unknown';
    trackPageView(currentPage);
    
    console.log('User activity tracking initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActivityTracking);
} else {
    initializeActivityTracking();
}
