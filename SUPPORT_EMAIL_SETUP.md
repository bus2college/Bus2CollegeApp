# Support Email Notification Setup

This guide explains how to set up automatic email notifications when users submit support inquiries.

## Overview

When a user submits a message via the Support page contact form:
1. Message is saved to `support_messages` table in Supabase
2. Database trigger automatically fires
3. Edge Function sends email to `support@bus2college.com`
4. Admin receives notification with user's message and can reply directly

## Setup Steps

### 1. Create Database Table

Run the SQL in `create-support-table.sql` in your Supabase SQL Editor:
- Creates `support_messages` table
- Sets up RLS policies
- Adds indexes for performance

### 2. Set Up Email Service (Resend)

We'll use [Resend](https://resend.com) for sending emails (it's free for up to 3,000 emails/month):

1. Sign up at https://resend.com
2. Verify your domain `bus2college.com` in Resend:
   - Add DNS records they provide
   - Or use their test domain for development
3. Create an API key in Resend dashboard
4. Copy the API key

### 3. Deploy Edge Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref yvvpqrtesmkpvtlpwaap

# Set the Resend API key as a secret
npx supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Deploy the email function
npx supabase functions deploy send-support-email
```

### 4. Create Database Trigger

Run the SQL in `create-support-webhook.sql` in your Supabase SQL Editor:
- Creates trigger function
- Sets up automatic trigger on new inserts
- Configures webhook to Edge Function

**Important:** You need to update the webhook URL in `create-support-webhook.sql` with your actual function URL.

### 5. Test the Setup

1. Go to https://bus2college.com/support.html
2. Fill out and submit the contact form
3. Check that:
   - Message appears in `support_messages` table
   - Email is received at support@bus2college.com

## Alternative: Simple Email Solution (No Edge Function)

If you don't want to set up the Edge Function, you can use a simpler approach:

### Option A: Client-Side Email (Resend Web API)

Add this to `support.html` instead of the Supabase insert:

```javascript
// In the form submission handler
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_RESEND_API_KEY'
  },
  body: JSON.stringify({
    from: 'noreply@bus2college.com',
    to: 'support@bus2college.com',
    subject: `Support: ${formData.subject}`,
    html: `<h3>From: ${formData.name}</h3><p>${formData.message}</p>`
  })
});
```

### Option B: Use FormSubmit.co (No Backend Required)

1. Change the form in `support.html` to:
```html
<form action="https://formsubmit.co/support@bus2college.com" method="POST">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <input type="text" name="subject" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

2. FormSubmit.co will:
   - Send emails for free
   - No registration needed
   - Automatically handle spam protection
   - Redirect after submission

### Option C: Use Supabase Database Webhooks

Go to Supabase Dashboard → Database → Webhooks:
1. Create new webhook
2. Table: `support_messages`
3. Events: INSERT
4. Type: HTTP Request
5. URL: Your email service webhook (e.g., Zapier, Make.com)

## Email Template

The email sent to support@bus2college.com includes:
- User's name and email
- Subject category
- Full message
- Timestamp
- User ID (if logged in)
- Reply-to address set to user's email

## Monitoring

View support messages in Supabase:
```sql
SELECT 
  id,
  name,
  email,
  subject,
  message,
  submitted_at,
  status
FROM support_messages
ORDER BY submitted_at DESC;
```

## Security Notes

- RLS policies ensure users can only see their own messages
- Edge Function uses service role key (never exposed to client)
- RESEND_API_KEY stored securely as Supabase secret
- Email addresses validated before sending

## Troubleshooting

**Email not received:**
- Check Supabase Edge Function logs
- Verify Resend API key is correct
- Check spam folder
- Verify domain is verified in Resend

**Database error:**
- Check RLS policies are enabled
- Verify table was created successfully
- Check Supabase logs for errors

**Trigger not firing:**
- Verify trigger was created: `SELECT * FROM pg_trigger WHERE tgname = 'on_support_message_created';`
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'notify_admin_new_support_message';`
- Review Supabase logs for errors
