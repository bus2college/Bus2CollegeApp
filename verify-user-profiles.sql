-- ===================================
-- Verify and Fix User Profiles
-- ===================================

-- Step 1: Check if trigger exists
SELECT tgname, tgrelid::regclass, tgfoid::regproc
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Step 2: Check auth.users (these are created by Supabase Auth)
SELECT id, email, created_at, raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- Step 3: Check public.users (these should match auth.users)
SELECT id, email, name, grade, registration_date
FROM public.users
ORDER BY registration_date DESC;

-- Step 4: Find users in auth.users that don't have profiles in public.users
SELECT au.id, au.email, au.raw_user_meta_data
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Step 5: Manually create profiles for existing users (if any found above)
-- Run this if Step 4 shows missing users
INSERT INTO public.users (id, email, name, grade, registration_date, last_login)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', ''),
    COALESCE(au.raw_user_meta_data->>'grade', ''),
    au.created_at,
    NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 6: Create user_data entries for users that don't have them
INSERT INTO public.user_data (user_id, student_info, colleges, essays, activities, recommenders, daily_activities)
SELECT 
    au.id,
    '{}'::jsonb,
    '[]'::jsonb,
    '{}'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb
FROM auth.users au
LEFT JOIN public.user_data ud ON au.id = ud.user_id
WHERE ud.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Step 7: Verify everything matches now
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created,
    pu.name,
    pu.grade,
    CASE WHEN pu.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_profile,
    CASE WHEN ud.user_id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_data
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
LEFT JOIN public.user_data ud ON au.id = ud.user_id
ORDER BY au.created_at DESC;
