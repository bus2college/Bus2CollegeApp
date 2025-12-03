# Bus2College - Backend Installation Guide

## 🚀 Quick Start

### Prerequisites Check

Before proceeding, verify you have:
1. ✅ Node.js 16 or higher installed
2. ✅ npm (comes with Node.js)
3. ✅ Anthropic API key

### Check Node.js Installation

```powershell
node --version
npm --version
```

If you see version numbers (e.g., v16.0.0), you're good to go! If not, see **Installing Node.js** below.

---

## 📦 Installing Node.js (If Needed)

### Windows Installation

1. **Download Node.js**
   - Visit: https://nodejs.org/
   - Download the LTS (Long Term Support) version
   - Choose the Windows Installer (.msi)

2. **Run the Installer**
   - Double-click the downloaded file
   - Accept the license agreement
   - Keep default installation options
   - Make sure "Add to PATH" is checked
   - Complete the installation

3. **Verify Installation**
   - Open a NEW PowerShell window
   - Run:
   ```powershell
   node --version
   npm --version
   ```
   - You should see version numbers

---

## 🔧 Backend Setup

### Step 1: Navigate to Server Directory

```powershell
cd c:\RamVSCodeGitHub\PM-Demo-Repo\bus2college\server
```

### Step 2: Install Dependencies

```powershell
npm install
```

This will install all required packages:
- express - Web framework
- cors - Cross-origin resource sharing
- axios - HTTP client for API calls
- cheerio - Web scraping
- node-cache - In-memory caching
- dotenv - Environment variables
- helmet - Security headers
- compression - Response compression
- body-parser - Request parsing

### Step 3: Configure Environment

1. **Copy the example environment file:**
```powershell
Copy-Item .env.example .env
```

2. **Edit `.env` file** (use Notepad or VS Code):
```
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=development
```

3. **Get your Anthropic API Key:**
   - Visit: https://console.anthropic.com/
   - Sign up or log in
   - Go to API Keys section
   - Create a new key
   - Copy it to your .env file

### Step 4: Start the Server

**For production mode:**
```powershell
npm start
```

**For development mode (auto-reload):**
```powershell
npm run dev
```

You should see:
```
🚀 Bus2College API Server running on http://localhost:3000
📚 College data loaded: 50 colleges
🔧 Environment: development
```

---

## ✅ Testing the Backend

### Test 1: Check Server Health

Open your browser and visit:
```
http://localhost:3000/api/colleges
```

You should see a JSON response with college data.

### Test 2: Test in PowerShell

```powershell
# Get all colleges
Invoke-RestMethod -Uri "http://localhost:3000/api/colleges" -Method Get

# Get colleges in Washington state
Invoke-RestMethod -Uri "http://localhost:3000/api/colleges/by-state/WA" -Method Get

# Get deadline for specific college
Invoke-RestMethod -Uri "http://localhost:3000/api/deadlines/Harvard University" -Method Get
```

### Test 3: Test AI Features

```powershell
$profile = @{
    gpa = 3.8
    testScore = 1450
    testType = "SAT"
    interests = "Computer Science"
    statePreference = "no-preference"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ai/suggestions" -Method Post -Body $profile -ContentType "application/json"
```

---

## 🌐 Frontend Setup

### Option 1: VS Code Live Server (Recommended)

1. **Install Live Server Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search "Live Server"
   - Install "Live Server" by Ritwick Dey

2. **Run the Frontend**
   - Open `bus2college/home.html` in VS Code
   - Right-click in the editor
   - Select "Open with Live Server"
   - Browser will open at http://127.0.0.1:5500/home.html

### Option 2: Direct File Opening

Simply open `home.html` in your browser:
- Right-click `home.html`
- Choose "Open with" → Your browser

**Note:** Some features may not work without a local server due to CORS restrictions.

---

## 📁 Project Structure

```
bus2college/
├── server/                          # Backend API (NEW!)
│   ├── server.js                    # Express server
│   ├── package.json                 # Dependencies
│   ├── .env                         # Your environment config (create this)
│   ├── .env.example                 # Template
│   ├── README.md                    # API documentation
│   ├── routes/                      # API endpoints
│   │   ├── colleges.js              # College routes
│   │   ├── deadlines.js             # Deadline routes
│   │   ├── search.js                # Search routes
│   │   └── ai.js                    # AI routes
│   ├── services/                    # Business logic
│   │   ├── collegeService.js        # College operations
│   │   ├── deadlineService.js       # Deadline calculations
│   │   ├── searchService.js         # Search algorithms
│   │   └── aiService.js             # Claude API integration
│   └── data/
│       └── colleges.json            # College database (50 colleges)
│
├── js/                              # Frontend JavaScript
│   ├── colleges.js                  # College display
│   ├── college-database.js          # Client college data
│   ├── auth.js                      # Authentication
│   ├── ai-chat.js                   # AI chat
│   └── navigation.js                # Navigation
│
├── css/
│   └── styles.css                   # All styles
│
├── home.html                        # Main app page
├── index.html                       # Login/register
└── README.md                        # Project docs
```

---

## 🔌 API Endpoints Reference

### Colleges Endpoints

```
GET    /api/colleges                     # Get all colleges
GET    /api/colleges/by-name/:name       # Get specific college
GET    /api/colleges/by-state/:state     # Get colleges by state
GET    /api/colleges/details/:name       # Detailed college info
GET    /api/colleges/autocomplete?q=...  # Autocomplete search
```

### Deadline Endpoints

```
GET    /api/deadlines/:collegeName       # Get deadline
POST   /api/deadlines/batch              # Batch deadlines
GET    /api/deadlines/upcoming?days=60   # Upcoming deadlines
GET    /api/deadlines/type/:type         # By type (early/regular/rolling)
```

### Search Endpoints

```
POST   /api/search/colleges              # Advanced search
POST   /api/search/recommendations       # Get recommendations
GET    /api/search/quick?q=...           # Quick search
```

### AI Endpoints

```
POST   /api/ai/suggestions               # College suggestions
POST   /api/ai/chat                      # Chat with AI
POST   /api/ai/essay/review              # Review essay
```

---

## 🔥 Common Issues & Solutions

### Issue: "npm is not recognized"

**Solution:** Node.js is not installed or not in PATH.
1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Try again

### Issue: "Port 3000 is already in use"

**Solution:** Another process is using port 3000.

**Option 1:** Stop the other process:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

**Option 2:** Use a different port:
- Edit `.env` file
- Change `PORT=3000` to `PORT=3001`
- Restart server

### Issue: "API key not working"

**Checklist:**
- ✅ .env file exists in `server/` directory
- ✅ API key has no quotes or extra spaces
- ✅ API key starts with `sk-ant-`
- ✅ Server was restarted after editing .env
- ✅ API key is valid at console.anthropic.com

### Issue: CORS errors in browser

**Solution:** Make sure:
1. Backend server is running on port 3000
2. Frontend is served from http://localhost:5500 or http://127.0.0.1:5500
3. Check ALLOWED_ORIGINS in .env matches your frontend URL

### Issue: "Cannot find module"

**Solution:** Dependencies not installed properly.
```powershell
# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install
```

---

## 🚀 Next Steps

### Immediate Tasks

1. ✅ Backend server is running
2. ⬜ Test all API endpoints
3. ⬜ Update frontend to use backend APIs
4. ⬜ Replace localStorage with API calls
5. ⬜ Add error handling in UI

### Future Enhancements

- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Implement user authentication
- [ ] Add file upload for essays
- [ ] Real-time deadline scraping
- [ ] Email notifications
- [ ] Social features
- [ ] Mobile app
- [ ] Deploy to production

---

## 📚 Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs/
- **Express.js Guide:** https://expressjs.com/
- **Anthropic Claude API:** https://docs.anthropic.com/
- **Backend README:** See `server/README.md` for API details

---

## 💬 Need Help?

If you encounter issues:

1. **Check the logs** - Look at terminal output for errors
2. **Check browser console** - Press F12 to see frontend errors
3. **Review .env file** - Make sure all settings are correct
4. **Restart everything** - Stop server, close browser, start again
5. **Check the documentation** - See `server/README.md`

---

**Status:** Backend infrastructure complete ✅  
**Next Phase:** Frontend integration with backend APIs  
**Version:** 1.0.0  
**Last Updated:** November 26, 2025
