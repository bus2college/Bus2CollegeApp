# Bus2College - Setup and Testing Guide

## Quick Start

### 1. Configure API Key

Before using the AI chat feature, you need to configure your Anthropic Claude API key:

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Open `js/config.js`
3. Replace `'your-api-key-here'` with your actual API key:

```javascript
const CONFIG = {
    CLAUDE_API_KEY: 'sk-ant-api03-...',  // Your actual key here
    // ... rest of config
};
```

### 2. Replace Logo

The Bus2College logo is already in place:
- Located at `assets/bus2college.png`
- Used on login page and dashboard header
- Also set as the browser favicon

### 3. Open the Application

Simply open `index.html` in your web browser (Chrome, Firefox, Edge, etc.)

## Testing the Application

### Test User Registration

1. Open `index.html`
2. Click "Register here"
3. Fill in the registration form:
   - Full Name: Test Student
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
   - Grade: 11th Grade
4. Click "Register"
5. You should see "Registration successful!" message

### Test Login

1. After registration, you'll be switched to the login form
2. Enter:
   - Email: test@example.com
   - Password: test123
3. Click "Login"
4. You should be redirected to `home.html`

### Test Navigation

1. Once logged in, you'll see the three-panel interface
2. Click on each menu item in the left panel:
   - My Colleges
   - My Common App Essay
   - My Supplemental Essays
   - My Activities
   - My Recommenders
   - Daily Activity Tracker
   - Admissions Status Summary
3. Each page should display correctly in the center panel

### Test AI Chat

1. In the right panel, type a question like:
   - "What should I write about in my Common App essay?"
   - "How do I choose the right colleges?"
   - "Can you help me brainstorm activities to include?"
2. Click "Send" or press Enter
3. The AI should respond with helpful advice

**Note:** The AI chat requires a valid API key to work!

### Test Essay Writing

1. Navigate to "My Common App Essay"
2. Select a prompt from the dropdown
3. Write some essay content
4. Click "Save Essay" to save your work
5. Click "Get AI Feedback" to ask the AI assistant for feedback

### Test Data Persistence

1. Add some content (essay, notes, etc.)
2. Click "Logout"
3. Log back in with the same credentials
4. Your data should still be there (stored in browser localStorage)

## Generate Sample Data

To quickly populate the app with sample data for testing:

1. Open browser console (F12)
2. Type: `generateSampleData()`
3. Press Enter
4. Refresh the page to see sample colleges, activities, and recommenders

## Exporting Data

To export your data:

1. Open browser console (F12)
2. Type: `exportAsJSON()`
3. A JSON file will be downloaded with all your data

## Features Overview

### Authentication
- ✅ User registration with validation
- ✅ Secure login system
- ✅ Session management
- ✅ Logout functionality

### Navigation
- ✅ 7 main sections accessible from left sidebar
- ✅ Smooth page transitions
- ✅ Active state highlighting
- ✅ Responsive layout

### AI Assistant
- ✅ Real-time chat with Claude AI
- ✅ Conversation history
- ✅ Context-aware responses
- ✅ Essay feedback capability
- ✅ College application advice

### Data Management
- ✅ localStorage for data persistence
- ✅ JSON export/import
- ✅ Excel export support (via SheetJS)
- ✅ User-specific data storage

### User Interface
- ✅ Bus2College branding
- ✅ Navy, yellow, and orange color scheme
- ✅ Responsive design
- ✅ Clean, modern layout
- ✅ Intuitive navigation

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

## Known Limitations (Prototype Phase)

1. **Data Storage**: Currently uses browser localStorage
   - Data is stored only in the browser
   - Clearing browser data will delete all information
   - No cloud sync between devices

2. **API Key Security**: API key is stored in client-side code
   - **Not suitable for production use**
   - In production, API calls should go through a backend server

3. **Add/Edit Forms**: Currently show placeholder alerts
   - Full CRUD forms will be implemented in next phase
   - Can add sample data using console commands

4. **File Uploads**: No support for uploading documents yet
   - Will be added in future iterations

5. **Email Notifications**: Not implemented
   - Will be added for deadline reminders

## Next Steps for Development

### Phase 2 Features (To Be Implemented)
1. Detailed add/edit forms for all sections
2. File upload for essays and documents
3. Calendar integration for deadlines
4. Email reminders
5. Progress tracking dashboards
6. College search and recommendation engine
7. Essay templates and examples
8. Peer review system
9. Mobile app version

### Phase 3 (Production Ready)
1. Backend server (Node.js/Express or Python/FastAPI)
2. Database (PostgreSQL or MongoDB)
3. Secure authentication (OAuth, JWT)
4. API key management
5. Cloud storage for documents
6. Multi-device sync
7. Admin panel
8. Analytics and insights
9. Payment integration (if needed)
10. Domain deployment

## Troubleshooting

### "API Error" in Chat
- Check that your API key is correctly configured in `js/config.js`
- Verify the API key is valid at console.anthropic.com
- Check browser console (F12) for detailed error messages

### Data Not Saving
- Ensure browser allows localStorage
- Check if browser is in private/incognito mode
- Try a different browser

### Pages Not Loading
- Ensure all files are in the correct directory structure
- Check browser console for JavaScript errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Logo Not Displaying
- The logo is located at `assets/bus2college.png`
- Check file exists in the assets folder
- Verify image format is PNG
- Try hard refresh (Ctrl+Shift+R)

## Support

For issues or questions during development:
1. Check browser console (F12) for error messages
2. Review this setup guide
3. Check the README.md file
4. Verify all files are in place with correct names

## File Structure Reference

```
bus2college/
├── index.html              # Login/registration page
├── home.html               # Main application interface
├── README.md               # Project documentation
├── SETUP_GUIDE.md          # This file
├── .gitignore              # Git ignore rules
├── css/
│   └── styles.css          # All application styles
├── js/
│   ├── auth.js             # Authentication logic
│   ├── navigation.js       # Page navigation
│   ├── ai-chat.js          # AI chat integration
│   ├── data-handler.js     # Data management
│   └── config.js           # API configuration
├── assets/
│   └── bus2college.png    # Bus2College logo
└── data/               # Placeholder for future Excel files
```

## Production Deployment Checklist

When ready to deploy to your public domain:

- [ ] Replace API key with backend proxy
- [ ] Set up backend server
- [ ] Configure database
- [ ] Implement proper authentication
- [ ] Add HTTPS
- [ ] Set up domain DNS
- [ ] Configure CORS
- [ ] Add error logging
- [ ] Implement backup system
- [ ] Add monitoring
- [ ] Create privacy policy
- [ ] Add terms of service
- [ ] Test thoroughly
- [ ] Set up CI/CD pipeline

---

**Version:** 1.0.0 (Prototype)
**Last Updated:** November 21, 2025
**Status:** Development/Testing Phase
