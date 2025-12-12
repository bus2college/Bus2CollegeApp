# User Activity Tracking System

## Overview
Comprehensive tracking system that captures all user interactions, clicks, prompts, and actions in the Bus2College application.

## Features

### Activity Types Tracked
1. **Click Events** - Every click on the page with element details
2. **Page Views** - Page navigation and section visits
3. **AI Interactions**
   - AI prompts submitted
   - AI responses received
   - Response time metrics
4. **Form Submissions** - All form data submissions
5. **Data Operations**
   - Data saves to Supabase
   - Data loads from Supabase
   - Export operations
   - Import operations
6. **Authentication Events**
   - User login
   - User logout
   - User registration
7. **Navigation** - Page-to-page navigation
8. **Errors** - Error tracking
9. **Search & Filter** - Search queries and filter usage
10. **Modal Interactions** - Modal open/close events
11. **Page Visibility** - Tab focus/blur tracking
12. **Time Tracking** - Time spent on pages

### Data Captured
For each activity, the system captures:
- User ID (if logged in)
- Activity type
- Activity-specific details (JSON)
- Page URL and title
- Timestamp (with timezone)
- Session ID (unique per browser session)
- User agent (browser info)
- Screen resolution
- Viewport size

## Setup Instructions

### Step 1: Create Database Table
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the migration file: `supabase-migration-user-activities.sql`
4. This creates:
   - `user_activities` table
   - Indexes for performance
   - Row Level Security policies
   - Helper views and functions

### Step 2: Verify Table Creation
```sql
-- Check if table exists
SELECT * FROM public.user_activities LIMIT 1;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_activities';
```

### Step 3: Integration (Already Done)
The tracking system is already integrated into:
- ✅ `home.html` - Script included
- ✅ `auth-supabase.js` - Login/logout tracking
- ✅ `ai-chat.js` - AI prompt/response tracking
- ✅ `navigation.js` - Page navigation tracking
- ✅ `data-handler.js` - Data save tracking

## Usage Examples

### Manual Tracking in Your Code

```javascript
// Track a button click
trackButtonClick('Save College', 'saveCollegeBtn', { college_name: 'MIT' });

// Track a search
trackSearch('computer science colleges', 15, 'college_search');

// Track a filter
trackFilter('deadline_type', 'Early Action');

// Track a modal
trackModalOpen('addCollegeModal');
trackModalClose('addCollegeModal', 'save');

// Track data operations
trackDataSave('colleges', 3);
trackDataLoad('essays', 5);

// Track exports/imports
trackExport('colleges', 'excel');
trackImport('activities', 10);

// Track errors
trackError('api_error', 'Failed to load colleges', { 
    endpoint: '/api/colleges',
    status: 500 
});

// Track AI interactions
trackAIPrompt('Help me write my essay', { essay_type: 'common_app' });
trackAIResponse(prompt, response, 2345); // 2345ms response time
```

## Query Examples

### View Recent Activities
```sql
SELECT 
    activity_type,
    details,
    timestamp,
    page_title
FROM user_activities
WHERE user_id = 'YOUR_USER_ID'
ORDER BY timestamp DESC
LIMIT 50;
```

### Activity Summary by Type
```sql
SELECT 
    activity_type,
    COUNT(*) as count,
    DATE_TRUNC('day', timestamp) as date
FROM user_activities
WHERE user_id = 'YOUR_USER_ID'
GROUP BY activity_type, date
ORDER BY date DESC, count DESC;
```

### AI Usage Statistics
```sql
SELECT 
    COUNT(*) as total_prompts,
    AVG((details->>'response_time_ms')::numeric) as avg_response_time,
    SUM((details->>'response_length')::numeric) as total_response_chars
FROM user_activities
WHERE activity_type = 'ai_response'
AND user_id = 'YOUR_USER_ID';
```

### User Session Analysis
```sql
SELECT 
    session_id,
    MIN(timestamp) as session_start,
    MAX(timestamp) as session_end,
    COUNT(*) as activity_count,
    COUNT(DISTINCT activity_type) as unique_activities
FROM user_activities
WHERE user_id = 'YOUR_USER_ID'
GROUP BY session_id
ORDER BY session_start DESC;
```

### Most Clicked Elements
```sql
SELECT 
    details->>'tag' as element_tag,
    details->>'class' as element_class,
    details->>'text' as element_text,
    COUNT(*) as click_count
FROM user_activities
WHERE activity_type = 'click'
AND user_id = 'YOUR_USER_ID'
GROUP BY details->>'tag', details->>'class', details->>'text'
ORDER BY click_count DESC
LIMIT 20;
```

### Page Visit Summary
```sql
SELECT 
    details->>'page_name' as page,
    COUNT(*) as visits,
    COUNT(DISTINCT session_id) as unique_sessions
FROM user_activities
WHERE activity_type = 'page_view'
AND user_id = 'YOUR_USER_ID'
GROUP BY details->>'page_name'
ORDER BY visits DESC;
```

### User Journey (Navigation Flow)
```sql
SELECT 
    details->>'from_page' as from_page,
    details->>'to_page' as to_page,
    COUNT(*) as transition_count
FROM user_activities
WHERE activity_type = 'navigation'
AND user_id = 'YOUR_USER_ID'
GROUP BY details->>'from_page', details->>'to_page'
ORDER BY transition_count DESC;
```

## Analytics Functions

### Get User Statistics
```sql
SELECT * FROM get_user_activity_stats('YOUR_USER_ID');
```

Returns:
- Total activities
- Unique sessions
- Most common activity
- First activity timestamp
- Last activity timestamp

### View Activity Summary
```sql
SELECT * FROM user_activity_summary
WHERE user_id = 'YOUR_USER_ID'
ORDER BY activity_date DESC;
```

## Data Retention

### Manual Cleanup (90+ days old)
```sql
SELECT cleanup_old_activities();
```

### Scheduled Cleanup (Optional)
Set up a Supabase cron job to run cleanup weekly:
```sql
-- In Supabase dashboard, create a cron job
SELECT cron.schedule(
    'cleanup-old-activities',
    '0 0 * * 0', -- Every Sunday at midnight
    $$SELECT cleanup_old_activities()$$
);
```

## Privacy & Security

### Row Level Security (RLS)
- ✅ Users can only view their own activities
- ✅ Users can only insert their own activities
- ✅ No update or delete permissions (immutable log)

### Anonymous Tracking
Currently disabled. To enable tracking before login:
```sql
-- Uncomment this policy in the migration file
CREATE POLICY "Anonymous users can insert activities"
ON public.user_activities
FOR INSERT
TO anon
WITH CHECK (true);
```

## Performance Optimization

### Indexes
The following indexes are created for optimal query performance:
- `user_id` - Fast user-specific queries
- `activity_type` - Filter by activity type
- `timestamp` - Chronological queries
- `session_id` - Session analysis
- `details` (GIN) - JSON field searches

### Best Practices
1. Keep activity details JSON under 5KB
2. Use specific activity types for filtering
3. Regularly clean up old data (90+ days)
4. Use the summary view for aggregated queries

## Troubleshooting

### Activities Not Being Logged
1. Check if user is authenticated (for authenticated policies)
2. Verify table exists: `SELECT * FROM user_activities LIMIT 1;`
3. Check RLS policies are enabled
4. Check browser console for errors

### Performance Issues
1. Verify indexes exist: `\d user_activities`
2. Run VACUUM ANALYZE: `VACUUM ANALYZE user_activities;`
3. Check table size: `SELECT pg_size_pretty(pg_total_relation_size('user_activities'));`
4. Consider partitioning for very large datasets

## Export Activity Data

### Export User's Activities to JSON
```javascript
async function exportUserActivities() {
    const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .order('timestamp', { ascending: false });
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], 
        { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-activities-${new Date().toISOString()}.json`;
    a.click();
}
```

## Dashboard Ideas

Use this data to create:
1. **Usage Dashboard** - Daily/weekly/monthly activity trends
2. **User Journey Map** - Visualize navigation flows
3. **Feature Adoption** - Track which features are used most
4. **AI Usage Analytics** - Prompt types, response times
5. **Error Monitoring** - Track and fix common errors
6. **Session Analysis** - Average session length, pages per session
7. **Conversion Funnel** - Track user progression through application

## Support

For questions or issues:
- Check Supabase logs for errors
- Review browser console for client-side errors
- Verify RLS policies if access issues occur
- Contact support with specific error messages
