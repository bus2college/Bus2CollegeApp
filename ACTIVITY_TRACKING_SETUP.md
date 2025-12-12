# Quick Setup Guide - User Activity Tracking

## 🚀 Quick Start (5 minutes)

### Step 1: Create Database Table (2 minutes)
1. Go to your Supabase project: https://supabase.com/dashboard/project/yvvpqrtesmkpvtlpwaap
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase-migration-user-activities.sql` from your project
5. Copy ALL the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. You should see: "Success. No rows returned"

### Step 2: Verify Setup (1 minute)
Run this query in SQL Editor to verify:
```sql
-- Check table exists
SELECT COUNT(*) as table_exists FROM information_schema.tables 
WHERE table_name = 'user_activities';

-- Should return: table_exists = 1
```

### Step 3: Test Tracking (2 minutes)
1. Open your app: https://bus2college.app
2. Log in with your account
3. Click around, navigate between pages, send an AI message
4. Go back to Supabase SQL Editor and run:
```sql
SELECT * FROM user_activities 
ORDER BY timestamp DESC 
LIMIT 10;
```
5. You should see your recent activities!

## ✅ That's it! 

Your app is now tracking:
- ✅ Every click
- ✅ Every page view
- ✅ Every AI prompt and response
- ✅ All form submissions
- ✅ Login/logout events
- ✅ Navigation between pages
- ✅ Data save/load operations
- ✅ Export/import actions
- ✅ Errors

## 📊 View Your Data

### Recent Activities
```sql
SELECT 
    activity_type,
    details->>'text' as action_text,
    page_title,
    timestamp
FROM user_activities
WHERE user_id = auth.uid()
ORDER BY timestamp DESC
LIMIT 20;
```

### Activity Summary
```sql
SELECT 
    activity_type,
    COUNT(*) as count,
    MAX(timestamp) as last_occurrence
FROM user_activities
WHERE user_id = auth.uid()
GROUP BY activity_type
ORDER BY count DESC;
```

### AI Usage Stats
```sql
SELECT 
    COUNT(*) as total_prompts,
    AVG((details->>'response_time_ms')::numeric)::int as avg_response_ms
FROM user_activities
WHERE activity_type = 'ai_response'
AND user_id = auth.uid();
```

## 📖 Full Documentation
See `USER_ACTIVITY_TRACKING.md` for:
- Complete API reference
- Advanced queries
- Analytics examples
- Dashboard ideas
- Troubleshooting

## 🛠️ Need Help?
- Check browser console (F12) for errors
- Verify you're logged in
- Check Supabase logs if queries fail
- Make sure RLS policies are enabled on the table
