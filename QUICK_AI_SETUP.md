# Quick Setup Guide - Supabase Edge Function for AI

## Step 1: Install Supabase CLI

**Option A: Using Windows Terminal (Recommended)**

Open PowerShell as Administrator and run:

```powershell
# Install Scoop (Windows package manager)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh -outfile 'install.ps1'
.\install.ps1 -RunAsAdmin

# Add Supabase bucket and install CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Option B: Manual Download**

1. Download from: https://github.com/supabase/cli/releases
2. Extract to a folder (e.g., `C:\supabase`)
3. Add to PATH environment variable

**Option C: Use npx (No installation needed)**

```powershell
npx supabase login
npx supabase link --project-ref yvvpqrtesmkpvtlpwaap
npx supabase functions deploy openai-chat
npx supabase secrets set OPENAI_API_KEY=your-key-here
```

## Step 2: Login and Link Project

```powershell
# Login to Supabase (opens browser)
supabase login

# Link to your Bus2College project
supabase link --project-ref yvvpqrtesmkpvtlpwaap
```

When prompted for database password, get it from:
- Supabase Dashboard → Settings → Database → Database password

## Step 3: Deploy Edge Function

```powershell
# Navigate to your project folder
cd C:\Bus2CollegeApp

# Deploy the openai-chat function
supabase functions deploy openai-chat

# Add your OpenAI API key as a secret
supabase secrets set OPENAI_API_KEY=sk-your-actual-openai-key-here
```

Get OpenAI API key from: https://platform.openai.com/api-keys

## Step 4: Test It

1. Go to https://bus2college.com
2. Login to your account
3. Click "Get AI Feedback"
4. It should now work!

## Verify Deployment

Check in Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/yvvpqrtesmkpvtlpwaap
2. Click **Edge Functions** in the sidebar
3. You should see `openai-chat` function listed
4. Click on it to view logs and invocations

## Troubleshooting

**If "supabase" command not found:**
- Use `npx supabase` instead of `supabase` for all commands
- Or install via direct download (Option B above)

**If deployment fails:**
- Make sure you're in the `C:\Bus2CollegeApp` directory
- Check that `supabase/functions/openai-chat/index.ts` exists
- Verify you're logged in: `supabase projects list`

**If AI chat still doesn't work:**
- Check browser console for errors
- Verify API endpoint in `js/config.js` matches: 
  `https://yvvpqrtesmkpvtlpwaap.supabase.co/functions/v1/openai-chat`
- Check Edge Function logs in Supabase Dashboard

## Alternative: Use Google Gemini (No Deployment Needed)

If you prefer the simplest setup:

1. Get free API key: https://makersuite.google.com/app/apikey
2. Update `js/config.js`:

```javascript
const CONFIG = {
    API_ENDPOINT: '',
    GEMINI_API_KEY: 'your-gemini-api-key-here',
    USE_SECURE_API: false
};
```

3. Commit and push:
```powershell
git add js/config.js
git commit -m "configure Gemini API for AI chat"
git push origin main
```

4. Done! Refresh website and test.

**Gemini Benefits:**
- ✅ Free & unlimited (60 req/min)
- ✅ No backend deployment needed
- ✅ Works immediately
- ✅ Good quality responses

---

Choose whichever approach works best for you!
