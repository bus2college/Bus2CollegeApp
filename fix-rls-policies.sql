-- ===================================
-- Fix RLS Policies for Registration
-- ===================================
-- Run this in Supabase SQL Editor to fix the registration error

-- Step 1: Drop conflicting policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.user_data;
DROP POLICY IF EXISTS "Service role can manage user data" ON public.user_data;
DROP POLICY IF EXISTS "Users can upsert own preferences" ON public.user_preferences;

-- Step 2: Create permissive insert policies for registration
CREATE POLICY "Allow user registration"
    ON public.users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow user data creation"
    ON public.user_data FOR INSERT
    WITH CHECK (true);

-- Step 3: Keep strict policies for other operations
-- (SELECT and UPDATE policies already exist and are correct)

-- Step 4: Verify RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Step 5: Check all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
