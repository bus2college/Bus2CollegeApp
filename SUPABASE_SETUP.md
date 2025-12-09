# Bus2College - Supabase Setup Guide

## Overview
Bus2College now uses **Supabase** (PostgreSQL database) instead of Firebase. This provides SQL-like tables with better data structure and querying capabilities.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: `bus2college` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

## Step 2: Set Up Database Tables

1. In your Supabase project dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste into the SQL editor
5. Click "Run" or press Ctrl/Cmd + Enter
6. You should see: "Success. No rows returned"

This creates three tables:
- **users**: User profiles (name, email, grade, timestamps)
- **user_data**: Application data (colleges, essays, activities, etc.)
- **user_preferences**: UI settings (collapsed panels, theme, etc.)

## Step 3: Get Your API Credentials

1. In Supabase dashboard, click "Settings" (gear icon)
2. Click "API" in settings menu
3. You'll see two important values:

   **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

4. Copy both values - you'll need them next

## Step 4: Configure Your Website

### Option A: Update HTML Files Directly

1. Open `index.html` in your code editor
2. Find these lines (around line 17-21):
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace with your actual values:
   ```javascript
   const supabaseUrl = 'https://xxxxxxxxxxxxx.supabase.co';
   const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

4. Do the same in `home.html` (around line 1369-1373)

### Option B: Use Environment Variables (Advanced)

Create a `js/supabase-config.js` file:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxxxxxxxxxx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

Then update HTML files to load this config first.

## Step 5: Enable Email Authentication

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Make sure "Email" is enabled
3. Configure email settings:
   - **Enable email confirmations**: Toggle based on your preference
     - ON: Users must verify email before logging in (more secure)
     - OFF: Users can login immediately after registration (easier for testing)
4. Save changes

## Step 6: Configure Email Templates (Optional)

1. Go to "Authentication" → "Email Templates"
2. Customize templates for:
   - Confirmation email
   - Password reset email
   - Magic link email
3. Update with your branding and messaging

## Step 7: Set Up Row Level Security (RLS)

The SQL schema already enabled RLS policies. These ensure:
- Users can only see their own data
- Users can only modify their own records
- No cross-user data access

To verify RLS is active:
1. Go to "Database" → "Tables"
2. Click on `users` table
3. Look for shield icon - should say "RLS enabled"
4. Repeat for `user_data` and `user_preferences`

## Step 8: Test Your Setup

1. Open `index.html` in your browser
2. Register a new account:
   - Enter name, email, password, grade
   - Click "Register"
3. Check for success message
4. If email confirmation is enabled, check your email inbox
5. Login with your credentials
6. You should be redirected to home.html

### Verify Database

1. Go to Supabase dashboard → "Table Editor"
2. Click `users` table - you should see your new user
3. Click `user_data` table - should have a row with your user_id
4. Click `user_preferences` table - may be empty until you use the app

## Database Schema Overview

### users table
```sql
- id (UUID, primary key, links to auth.users)
- name (text)
- email (text, unique)
- grade (text)
- registration_date (timestamp)
- last_login (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

### user_data table
```sql
- id (bigserial, primary key)
- user_id (UUID, foreign key to auth.users)
- student_info (JSONB - student details)
- colleges (JSONB - array of colleges)
- essays (JSONB - essay content)
- activities (JSONB - array of activities)
- recommenders (JSONB - array of recommenders)
- daily_activities (JSONB - array of daily tasks)
- created_at (timestamp)
- updated_at (timestamp)
```

### user_preferences table
```sql
- id (bigserial, primary key)
- user_id (UUID, foreign key to auth.users)
- nav_panel_collapsed (boolean)
- how_to_states (JSONB)
- theme (text)
- created_at (timestamp)
- updated_at (timestamp)
```

## Advantages of Supabase over Firebase

1. **SQL Database**: Real SQL queries with PostgreSQL
2. **Better Data Structure**: Proper tables vs NoSQL documents
3. **Free Tier**: 500MB database, 50,000 monthly active users
4. **Row Level Security**: Built-in data isolation
5. **Real-time**: Subscribe to database changes
6. **Open Source**: Can self-host if needed
7. **Direct Access**: Query database from anywhere
8. **Better Performance**: Optimized for relational data

## API Usage Examples

### Get current user
```javascript
const { data: { user } } = await supabase.auth.getUser();
```

### Save data
```javascript
const { error } = await supabase
    .from('user_data')
    .update({ colleges: myColleges })
    .eq('user_id', userId);
```

### Load data
```javascript
const { data, error } = await supabase
    .from('user_data')
    .select('colleges')
    .eq('user_id', userId)
    .single();
```

## Troubleshooting

### "Invalid API key" error
- Double-check your supabaseUrl and supabaseAnonKey
- Make sure you copied the ANON key, not the service role key
- Remove any extra spaces or quotes

### "User already registered" error
- This email is already in use
- Try password reset or use different email

### "Row Level Security policy violation"
- Check that RLS policies are correctly set up
- Run the SQL schema again
- Verify user is authenticated

### Data not saving
- Check browser console for errors
- Verify table structure matches schema
- Check RLS policies allow insert/update

### Email not working
- Verify email provider is configured in Supabase
- Check spam folder
- Disable email confirmation for testing

## Migration from Firebase

Your existing Firebase data is NOT automatically migrated. To migrate:

1. Export Firebase data (use Firebase console)
2. Transform to PostgreSQL format
3. Import via Supabase SQL editor or API
4. Or start fresh with new accounts

## Security Best Practices

1. **Never expose service_role key** - only use anon key in client code
2. **Always use RLS** - protects data at database level
3. **Validate data** - add check constraints in schema
4. **Use HTTPS** - Supabase enforces this by default
5. **Rotate keys** - if anon key is compromised, regenerate it

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Create database tables
3. ✅ Add API credentials
4. ✅ Test registration and login
5. ⏭️ Build out application features
6. ⏭️ Deploy to production

## Support

- **Supabase Docs**: https://supabase.com/docs
- **SQL Reference**: https://supabase.com/docs/guides/database
- **Auth Guide**: https://supabase.com/docs/guides/auth

---

**Last Updated**: December 9, 2025
**Status**: Ready for setup
