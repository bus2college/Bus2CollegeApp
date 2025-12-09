# Supabase Edge Functions Setup for Bus2College

This guide explains how to deploy and use Supabase Edge Functions for secure AI API integration.

## Why Use Supabase Edge Functions?

✅ **All-in-one solution**: Database + Auth + Edge Functions in Supabase
✅ **Secure API keys**: Keys stored server-side, never exposed to client
✅ **Global edge network**: Fast response times worldwide
✅ **Built-in TypeScript**: Type-safe development
✅ **No extra services**: Eliminates need for Netlify Functions

## Prerequisites

1. **Supabase CLI** installed
2. **OpenAI API Key** (get from https://platform.openai.com/api-keys)
3. **Supabase Account** with your Bus2College project

## Installation Steps

### Step 1: Install Supabase CLI

```powershell
# Install via npm
npm install -g supabase

# Or via Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 2: Login to Supabase

```powershell
supabase login
```

This will open a browser window to authenticate.

### Step 3: Link Your Project

```powershell
# Get your project reference ID from Supabase Dashboard
# URL format: https://supabase.com/dashboard/project/{PROJECT_REF}
# For Bus2College: yvvpqrtesmkpvtlpwaap

supabase link --project-ref yvvpqrtesmkpvtlpwaap
```

### Step 4: Deploy the Edge Function

```powershell
# Deploy the OpenAI chat function
supabase functions deploy openai-chat
```

### Step 5: Set OpenAI API Key as Secret

```powershell
# Add your OpenAI API key as an environment secret
supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
```

Replace `your-openai-api-key-here` with your actual OpenAI API key.

## Update Frontend Configuration

After deploying, update `js/config.js`:

```javascript
const CONFIG = {
    // Supabase Edge Function endpoint
    API_ENDPOINT: 'https://yvvpqrtesmkpvtlpwaap.supabase.co/functions/v1/openai-chat',
    
    // Application Settings
    APP_NAME: 'Bus2College',
    APP_VERSION: '1.0.0',
    
    // Use secure API
    USE_SECURE_API: true
};
```

## Testing the Function

Test locally before deploying:

```powershell
# Start local development server
supabase functions serve openai-chat

# Test with curl (in another terminal)
curl -i --location --request POST 'http://localhost:54321/functions/v1/openai-chat' \
  --header 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"Hello!"}]}'
```

## Usage in Your App

The existing `js/secure-api-client.js` already supports this! Just update the API_ENDPOINT in config.js and it will work automatically.

## Monitoring & Logs

View function logs in Supabase Dashboard:
1. Go to **Edge Functions** tab
2. Click on `openai-chat` function
3. View **Logs** and **Invocations**

## Cost Considerations

**Supabase Edge Functions:**
- Free tier: 500,000 invocations/month
- Additional: $2 per 1M invocations

**OpenAI API:**
- GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Typical college essay review: ~$0.01-0.05 per request

## Security Best Practices

✅ API keys stored in Supabase secrets (server-side only)
✅ CORS configured to allow only your domain
✅ Input validation on all requests
✅ Rate limiting available via Supabase
✅ No API keys in client-side code

## Troubleshooting

**Function not deploying:**
- Check Supabase CLI is logged in: `supabase login`
- Verify project is linked: `supabase projects list`

**API key not working:**
- Verify secret is set: `supabase secrets list`
- Check function logs for error messages

**CORS errors:**
- Update corsHeaders in function to match your domain
- Or use '*' for development (change to specific domain in production)

## Alternative: Use Gemini API (Simpler Setup)

If you prefer a simpler setup without edge functions, you can use Google Gemini API directly from the client (it's designed for this):

1. Get free API key: https://makersuite.google.com/app/apikey
2. Update `js/config.js`:
```javascript
const CONFIG = {
    API_ENDPOINT: '',
    GEMINI_API_KEY: 'your-gemini-api-key-here',
    USE_SECURE_API: false
};
```

Gemini API:
- ✅ Free tier: 60 requests/minute (unlimited)
- ✅ Designed for client-side use
- ✅ No backend needed
- ⚠️ Slightly lower quality than GPT-4

## Next Steps

1. Deploy the edge function
2. Update config.js with the endpoint URL
3. Test AI chat on your website
4. Monitor usage in Supabase dashboard

---

**Questions?** Check Supabase Edge Functions docs: https://supabase.com/docs/guides/functions
