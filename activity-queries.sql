-- Useful queries to view user activity with page titles and button names

-- View all activities with page title and button names
SELECT 
    id,
    activity_type,
    details->>'page_title' as page_title,
    details->>'page_name' as page_name,
    details->>'button_name' as button_name,
    details->>'text' as clicked_text,
    timestamp,
    session_id
FROM user_activities
ORDER BY timestamp DESC
LIMIT 50;

-- View button clicks with page context
SELECT 
    details->>'page_title' as page_title,
    details->>'button_name' as button_name,
    details->>'text' as button_text,
    COUNT(*) as click_count,
    MAX(timestamp) as last_clicked
FROM user_activities
WHERE activity_type = 'click' 
AND details->>'button_name' IS NOT NULL
GROUP BY details->>'page_title', details->>'button_name', details->>'text'
ORDER BY click_count DESC;

-- View page navigation with titles
SELECT 
    details->>'page_title' as page_title,
    details->>'page_name' as page_id,
    COUNT(*) as view_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    MAX(timestamp) as last_viewed
FROM user_activities
WHERE activity_type = 'page_view'
GROUP BY details->>'page_title', details->>'page_name'
ORDER BY view_count DESC;

-- View navigation flow between pages
SELECT 
    details->>'from_page' as from_page,
    details->>'to_page' as to_page,
    COUNT(*) as transition_count
FROM user_activities
WHERE activity_type = 'navigation'
GROUP BY details->>'from_page', details->>'to_page'
ORDER BY transition_count DESC;

-- View most clicked buttons by page
SELECT 
    details->>'page_title' as page_title,
    details->>'button_name' as button_name,
    COUNT(*) as clicks,
    ARRAY_AGG(DISTINCT details->>'button_type') as button_types
FROM user_activities
WHERE (activity_type = 'click' OR activity_type = 'button_click')
AND details->>'button_name' IS NOT NULL
GROUP BY details->>'page_title', details->>'button_name'
ORDER BY clicks DESC
LIMIT 20;

-- Detailed activity log with all context
SELECT 
    timestamp,
    activity_type,
    details->>'page_title' as page_title,
    details->>'page_name' as page,
    details->>'button_name' as button,
    details->>'text' as text_clicked,
    details->>'tag' as html_tag,
    session_id
FROM user_activities
ORDER BY timestamp DESC
LIMIT 100;

-- Activity summary by page
SELECT 
    details->>'page_title' as page_title,
    activity_type,
    COUNT(*) as count
FROM user_activities
WHERE details->>'page_title' IS NOT NULL
GROUP BY details->>'page_title', activity_type
ORDER BY details->>'page_title', count DESC;

-- User session detail with page titles
SELECT 
    session_id,
    MIN(timestamp) as session_start,
    MAX(timestamp) as session_end,
    EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp)))/60 as duration_minutes,
    COUNT(*) as total_actions,
    COUNT(DISTINCT details->>'page_title') as pages_visited,
    ARRAY_AGG(DISTINCT details->>'page_title') as page_titles
FROM user_activities
GROUP BY session_id
ORDER BY session_start DESC
LIMIT 20;

-- Button usage heatmap (most used buttons)
SELECT 
    details->>'button_name' as button,
    details->>'page_title' as page,
    COUNT(*) as uses,
    MIN(timestamp) as first_use,
    MAX(timestamp) as last_use
FROM user_activities
WHERE details->>'button_name' IS NOT NULL
GROUP BY details->>'button_name', details->>'page_title'
ORDER BY uses DESC
LIMIT 30;
