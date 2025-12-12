-- Create commonapp_connections table for OAuth token storage
-- Run this in Supabase SQL Editor

-- Create the commonapp_connections table
CREATE TABLE IF NOT EXISTS public.commonapp_connections (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    commonapp_email TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    last_sync TIMESTAMPTZ,
    sync_settings JSONB DEFAULT '{"autoSyncEnabled": false, "syncColleges": true, "syncEssays": true, "syncSupplemental": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_commonapp_connections_user_id ON public.commonapp_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_commonapp_connections_expires_at ON public.commonapp_connections(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.commonapp_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can insert their own connections
CREATE POLICY "Users can insert their own connections"
ON public.commonapp_connections
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can view their own connections
CREATE POLICY "Users can view their own connections"
ON public.commonapp_connections
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policy: Users can update their own connections
CREATE POLICY "Users can update their own connections"
ON public.commonapp_connections
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own connections
CREATE POLICY "Users can delete their own connections"
ON public.commonapp_connections
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Grant permissions
GRANT INSERT, SELECT, UPDATE, DELETE ON public.commonapp_connections TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE commonapp_connections_id_seq TO authenticated;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_commonapp_connections_updated_at
    BEFORE UPDATE ON public.commonapp_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to check if token is expired
CREATE OR REPLACE FUNCTION is_token_expired(connection_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    expires_time TIMESTAMPTZ;
BEGIN
    SELECT expires_at INTO expires_time
    FROM public.commonapp_connections
    WHERE id = connection_id;
    
    RETURN expires_time < NOW();
END;
$$;

-- Create function to get connections needing sync (for automated sync)
CREATE OR REPLACE FUNCTION get_connections_needing_sync()
RETURNS TABLE (
    user_id UUID,
    commonapp_email TEXT,
    last_sync TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.user_id,
        c.commonapp_email,
        c.last_sync
    FROM public.commonapp_connections c
    WHERE 
        c.sync_settings->>'autoSyncEnabled' = 'true'
        AND (
            c.last_sync IS NULL 
            OR c.last_sync < NOW() - INTERVAL '24 hours'
        )
        AND c.expires_at > NOW();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_token_expired(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_connections_needing_sync() TO authenticated;

COMMENT ON TABLE public.commonapp_connections IS 'Stores OAuth tokens for Common App API integration';
COMMENT ON COLUMN public.commonapp_connections.access_token IS 'OAuth access token (encrypted)';
COMMENT ON COLUMN public.commonapp_connections.refresh_token IS 'OAuth refresh token for renewing access';
COMMENT ON COLUMN public.commonapp_connections.sync_settings IS 'User preferences for automatic sync';
