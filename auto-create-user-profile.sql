-- ===================================
-- Auto-create user profile on registration
-- ===================================
-- This trigger automatically creates entries in public.users and public.user_data
-- when a new user registers via Supabase Auth

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into public.users
    INSERT INTO public.users (id, email, name, grade, registration_date, last_login)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'grade', ''),
        NOW(),
        NOW()
    );
    
    -- Insert into public.user_data
    INSERT INTO public.user_data (user_id, student_info, colleges, essays, activities, recommenders, daily_activities)
    VALUES (
        NEW.id,
        '{}'::jsonb,
        '[]'::jsonb,
        '{}'::jsonb,
        '[]'::jsonb,
        '[]'::jsonb,
        '[]'::jsonb
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
