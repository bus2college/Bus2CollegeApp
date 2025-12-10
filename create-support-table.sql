-- Create support_messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    admin_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_support_messages_user_id ON public.support_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_status ON public.support_messages(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_submitted_at ON public.support_messages(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own support messages
CREATE POLICY "Users can create support messages"
    ON public.support_messages
    FOR INSERT
    WITH CHECK (true); -- Anyone can submit (including non-authenticated users)

-- Policy: Users can view their own support messages
CREATE POLICY "Users can view own support messages"
    ON public.support_messages
    FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Policy: Only admins can update support messages (you'll need to create admin role)
-- For now, no one can update via client
CREATE POLICY "No client updates"
    ON public.support_messages
    FOR UPDATE
    USING (false);

-- Comment on table
COMMENT ON TABLE public.support_messages IS 'Stores contact form submissions from the support page';
