-- Create database trigger to call Edge Function when new support message is inserted
-- This will automatically send an email to admin@bus2college.com

-- First, create the trigger function
CREATE OR REPLACE FUNCTION public.notify_admin_new_support_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to send email
  PERFORM
    net.http_post(
      url := 'https://yvvpqrtesmkpvtlpwaap.supabase.co/functions/v1/send-support-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'record', to_jsonb(NEW)
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_support_message_created ON public.support_messages;
CREATE TRIGGER on_support_message_created
  AFTER INSERT ON public.support_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_support_message();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION net.http_post TO postgres, anon, authenticated, service_role;

COMMENT ON FUNCTION public.notify_admin_new_support_message() IS 'Sends email notification to admin when new support message is submitted';
