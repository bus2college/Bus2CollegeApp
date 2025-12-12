-- Create user_activities table for comprehensive activity tracking
-- Run this in Supabase SQL Editor

-- Drop table if exists (for clean reinstall)
-- DROP TABLE IF EXISTS public.user_activities;

-- Create the user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    page_url TEXT,
    page_title TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    session_id TEXT,
    user_agent TEXT,
    screen_resolution TEXT,
    viewport_size TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON public.user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_timestamp ON public.user_activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_session_id ON public.user_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_details ON public.user_activities USING GIN (details);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can insert their own activities
CREATE POLICY "Users can insert their own activities"
ON public.user_activities
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can view their own activities
CREATE POLICY "Users can view their own activities"
ON public.user_activities
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policy: Allow anonymous users to log activities (optional - for tracking before login)
-- Uncomment if you want to track anonymous user activities
-- CREATE POLICY "Anonymous users can insert activities"
-- ON public.user_activities
-- FOR INSERT
-- TO anon
-- WITH CHECK (true);

-- Grant permissions
GRANT INSERT, SELECT ON public.user_activities TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_activities_id_seq TO authenticated;

-- Optional: Create a view for activity analytics
CREATE OR REPLACE VIEW public.user_activity_summary AS
SELECT 
    user_id,
    activity_type,
    DATE_TRUNC('day', timestamp) as activity_date,
    COUNT(*) as activity_count,
    COUNT(DISTINCT session_id) as unique_sessions
FROM public.user_activities
GROUP BY user_id, activity_type, DATE_TRUNC('day', timestamp);

-- Grant access to the view
GRANT SELECT ON public.user_activity_summary TO authenticated;

-- Optional: Create function to clean up old activities (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_activities()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.user_activities
    WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$;

-- Optional: Create function to get user activity stats
CREATE OR REPLACE FUNCTION get_user_activity_stats(target_user_id UUID)
RETURNS TABLE (
    total_activities BIGINT,
    unique_sessions BIGINT,
    most_common_activity TEXT,
    first_activity TIMESTAMPTZ,
    last_activity TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_activities,
        COUNT(DISTINCT session_id)::BIGINT as unique_sessions,
        (
            SELECT activity_type 
            FROM public.user_activities 
            WHERE user_id = target_user_id 
            GROUP BY activity_type 
            ORDER BY COUNT(*) DESC 
            LIMIT 1
        ) as most_common_activity,
        MIN(timestamp) as first_activity,
        MAX(timestamp) as last_activity
    FROM public.user_activities
    WHERE user_id = target_user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cleanup_old_activities() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_activity_stats(UUID) TO authenticated;

COMMENT ON TABLE public.user_activities IS 'Tracks all user interactions, clicks, prompts, and actions';
COMMENT ON COLUMN public.user_activities.activity_type IS 'Type of activity (click, page_view, ai_prompt, etc.)';
COMMENT ON COLUMN public.user_activities.details IS 'JSON object containing activity-specific details';
COMMENT ON COLUMN public.user_activities.session_id IS 'Unique identifier for user session';
