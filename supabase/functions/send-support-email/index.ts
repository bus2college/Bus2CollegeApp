// Supabase Edge Function to send email notifications for support inquiries
// Deploy with: supabase functions deploy send-support-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') // Email service API key
const ADMIN_EMAIL = 'admin@bus2college.com'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { record } = await req.json()
    
    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Bus2College Support <support@bus2college.com>',
        to: [ADMIN_EMAIL],
        reply_to: record.email,
        subject: `New Support Inquiry: ${record.subject}`,
        html: `
          <h2>New Support Message from Bus2College</h2>
          <p><strong>From:</strong> ${record.name} (${record.email})</p>
          <p><strong>Subject:</strong> ${record.subject}</p>
          <p><strong>User ID:</strong> ${record.user_id || 'Not logged in'}</p>
          <p><strong>Submitted:</strong> ${new Date(record.submitted_at).toLocaleString()}</p>
          <hr>
          <h3>Message:</h3>
          <p>${record.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>Reply directly to this email to respond to ${record.name}.</em></p>
        `
      })
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.text()
      console.error('Resend API error:', error)
      throw new Error(`Failed to send email: ${error}`)
    }

    const emailData = await emailResponse.json()
    console.log('Email sent successfully:', emailData)

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
