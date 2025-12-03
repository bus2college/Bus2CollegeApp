# 🤖 AI Essay Feedback Setup Guide

## Overview
Bus2College now includes AI-powered essay feedback using Anthropic's Claude API. Get professional-grade editorial feedback on your Common App essays in seconds!

## Features
- **Comprehensive Analysis**: Content, structure, voice, grammar, and impact
- **Specific Suggestions**: Actionable recommendations for improvement
- **Word Count Tracking**: Real-time feedback with color-coded indicators
- **Feedback History**: Save up to 10 previous feedback sessions
- **Export Capability**: Copy or export feedback for reference

---

## Setup Instructions

### Step 1: Get Your API Key

#### Option A: Anthropic Claude (Recommended)
1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up for a free account
3. Navigate to **API Keys** section
4. Click **Create Key**
5. Copy your API key (starts with `sk-ant-...`)

**Pricing**: 
- Free tier includes $5 credit
- Claude 3.5 Sonnet costs ~$0.003 per essay review
- ~1,600 essay reviews with free credit

#### Option B: Google Gemini (Alternative)
1. Visit [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click **Get API Key**
4. Copy your API key

---

### Step 2: Configure Bus2College

1. **Locate the config file**:
   - Navigate to `bus2college/js/`
   - Find `config.example.js`

2. **Create your config**:
   - Copy `config.example.js` to `config.js`
   - Or rename `config.example.js` to `config.js`

3. **Add your API key**:
   ```javascript
   const CONFIG = {
       CLAUDE_API_KEY: 'sk-ant-your-actual-key-here',
   };
   ```

4. **Save the file**

---

### Step 3: Test the Integration

1. Open Bus2College in your browser
2. Navigate to **My Common App Essay**
3. Write or paste essay content
4. Click **🤖 Get AI Feedback**
5. Wait 5-10 seconds for analysis
6. Review comprehensive feedback in modal

---

## How to Use

### Writing Your Essay
1. Select a Common App prompt from dropdown
2. Write your essay (250-650 words recommended)
3. Watch the word counter change colors:
   - 🟠 Orange: Under 250 words
   - 🟢 Green: 250-650 words (ideal)
   - 🔴 Red: Over 650 words

### Getting Feedback
1. Click **🤖 Get AI Feedback** button
2. AI analyzes your essay for:
   - Overall impression
   - Content & storytelling
   - Structure & organization
   - Voice & authenticity
   - Grammar & mechanics
   - Specific suggestions
   - Revised opening sentence (if needed)

### After Feedback
- **Copy Feedback**: Click 📋 to copy to clipboard
- **Export Essay**: Click 📥 to download with metadata
- **Revise**: Apply suggestions and get feedback again
- **History**: Your last 10 feedback sessions are saved

---

## Troubleshooting

### "Please configure your API key" error
- Ensure `config.js` exists (not `config.example.js`)
- Check that API key is correctly pasted (no extra spaces)
- Verify API key starts with `sk-ant-` for Claude

### "API Error" message
- Check your API key is valid and active
- Verify you have remaining credit
- Check internet connection
- Try refreshing the page

### Slow response times
- Normal processing: 5-10 seconds
- Longer essays may take more time
- Check your internet speed
- Try during off-peak hours

### No feedback appearing
- Open browser console (F12) to check for errors
- Clear browser cache and reload
- Verify all script files are loading
- Check that config.js is properly formatted

---

## Privacy & Security

### Your Data
- Essays are processed by Anthropic's API
- Feedback is saved locally in your browser
- No essays stored on external servers permanently
- Review Anthropic's [Privacy Policy](https://www.anthropic.com/privacy)

### API Key Security
- **Never share your API key publicly**
- Add `config.js` to `.gitignore` if using Git
- Don't commit API keys to version control
- Regenerate key if accidentally exposed

### Cost Management
- Monitor usage at [console.anthropic.com](https://console.anthropic.com/)
- Set spending limits in your account
- Each essay review costs ~$0.003-0.005
- Free tier provides ample testing credit

---

## Advanced Configuration

### Custom Model Settings
Edit `config.js` to customize:

```javascript
const CONFIG = {
    CLAUDE_API_KEY: 'your-key-here',
    
    // Use different model version
    MODEL: 'claude-3-5-sonnet-20241022',
    
    // Adjust max response length
    MAX_TOKENS: 3000
};
```

### Available Models
- `claude-3-5-sonnet-20241022` (Recommended - Best quality)
- `claude-3-opus-20240229` (Highest quality, slower)
- `claude-3-sonnet-20240229` (Balanced)
- `claude-3-haiku-20240307` (Fastest, cheaper)

---

## Tips for Best Results

### Before Requesting Feedback
1. Complete at least a rough draft (200+ words)
2. Select your prompt first
3. Run a spell check
4. Read through once yourself

### Using the Feedback
1. Read the entire feedback first
2. Focus on 2-3 major suggestions at a time
3. Don't try to implement everything at once
4. Request feedback after each major revision
5. Compare feedback across versions

### Writing Strategy
1. **Draft**: Focus on getting ideas down
2. **Revise**: Apply AI feedback on structure/content
3. **Polish**: Address grammar and word choice
4. **Finalize**: Get final AI review + human review

---

## Support

### Need Help?
- Check this guide first
- Review error messages carefully
- Visit [Anthropic Documentation](https://docs.anthropic.com/)
- Open browser console (F12) for technical errors

### Feedback & Suggestions
- Report bugs or request features
- Suggest improvements to AI prompts
- Share your success stories!

---

## FAQ

**Q: Is this really free?**  
A: Yes! Anthropic provides $5 free credit, enough for ~1,600 essay reviews.

**Q: Can I use this for supplemental essays too?**  
A: Currently optimized for Common App essays. Supplemental essay feedback coming soon!

**Q: How accurate is the feedback?**  
A: Claude 3.5 Sonnet provides professional-grade feedback comparable to human reviewers. Always get human feedback too!

**Q: Will colleges know I used AI?**  
A: AI tools are widely used for brainstorming and editing. The essay should still be your authentic voice and work.

**Q: Can I request multiple feedbacks?**  
A: Yes! Get feedback, revise, and request again. Track your improvement over iterations.

**Q: What if I exceed my free credit?**  
A: You'll need to add payment method in Anthropic console. Usage is very affordable (~$0.003/essay).

---

## Version History

### v1.0 (Current)
- ✅ Common App essay feedback
- ✅ 7 official prompts
- ✅ Word count tracking
- ✅ Feedback history
- ✅ Export functionality
- ✅ College list integration

### Coming Soon
- 🔄 Supplemental essay feedback
- 🔄 Multiple AI model support (Gemini, GPT-4)
- 🔄 Collaborative editing
- 🔄 Version comparison
- 🔄 Teacher/counselor review workflow

---

**Happy writing! 🎓✨**
