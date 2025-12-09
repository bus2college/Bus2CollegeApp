# Bus2College - System Architecture

## Current Implementation Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                  │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    FRONTEND APPLICATION                             │    │
│  │                                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │ index.html   │  │  home.html   │  │ CSS Styles   │             │    │
│  │  │ (Login Page) │  │ (Dashboard)  │  │ (Day Theme)  │             │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │           JAVASCRIPT MODULES (Client-Side)                   │   │    │
│  │  │                                                               │   │    │
│  │  │  ┌─────────────────┐  ┌────────────────────┐                │   │    │
│  │  │  │ auth-firebase.js│  │ firebase-data-     │                │   │    │
│  │  │  │ - Registration  │  │ handler.js         │                │   │    │
│  │  │  │ - Login/Logout  │  │ - Firestore CRUD   │                │   │    │
│  │  │  │ - Session Mgmt  │  │ - User Data Sync   │                │   │    │
│  │  │  └─────────────────┘  └────────────────────┘                │   │    │
│  │  │                                                               │   │    │
│  │  │  ┌─────────────────┐  ┌────────────────────┐                │   │    │
│  │  │  │ navigation.js   │  │ ai-chat.js         │                │   │    │
│  │  │  │ - Page Routing  │  │ - Chat Interface   │                │   │    │
│  │  │  │ - UI Controls   │  │ - Message History  │                │   │    │
│  │  │  │ - Menu Toggle   │  │ - AI Integration   │                │   │    │
│  │  │  └─────────────────┘  └────────────────────┘                │   │    │
│  │  │                                                               │   │    │
│  │  │  ┌─────────────────┐  ┌────────────────────┐                │   │    │
│  │  │  │ colleges.js     │  │ data-handler.js    │                │   │    │
│  │  │  │ - College List  │  │ - LocalStorage Ops │                │   │    │
│  │  │  │ - Essay Mgmt    │  │ - JSON Export      │                │   │    │
│  │  │  │ - AI Feedback   │  │ - Data Validation  │                │   │    │
│  │  │  └─────────────────┘  └────────────────────┘                │   │    │
│  │  │                                                               │   │    │
│  │  │  ┌─────────────────┐  ┌────────────────────┐                │   │    │
│  │  │  │ secure-api-     │  │ college-database.js│                │   │    │
│  │  │  │ client.js       │  │ - College Data     │                │   │    │
│  │  │  │ - API Routing   │  │ - Search/Filter    │                │   │    │
│  │  │  │ - Gemini API    │  │ - College Info     │                │   │    │
│  │  │  └─────────────────┘  └────────────────────┘                │   │    │
│  │  │                                                               │   │    │
│  │  │  ┌─────────────────┐  ┌────────────────────┐                │   │    │
│  │  │  │ common-app-     │  │ config.js          │                │   │    │
│  │  │  │ integration.js  │  │ - Configuration    │                │   │    │
│  │  │  │ - Essay Templates│  │ - (No API Keys)    │                │   │    │
│  │  │  └─────────────────┘  └────────────────────┘                │   │    │
│  │  └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │           LOCAL DATA STORAGE                                 │   │    │
│  │  │                                                               │   │    │
│  │  │  ┌──────────────┐    ┌──────────────┐                        │   │    │
│  │  │  │ localStorage │    │ sessionStorage│                        │   │    │
│  │  │  │ - User Data  │    │ - Session Info│                        │   │    │
│  │  │  │ - Essays     │    │ - Auth State  │                        │   │    │
│  │  │  │ - Activities │    │               │                        │   │    │
│  │  │  └──────────────┘    └──────────────┘                        │   │    │
│  │  └───────────────────────────────────────────────────────────────┘   │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────┬───────────────────────┬───────────────────────────┘
                           │                       │
                           │ HTTPS                 │ HTTPS
                           │                       │
        ┌──────────────────▼─────────┐  ┌──────────▼─────────────────┐
        │  FIREBASE SERVICES          │  │  NETLIFY FUNCTIONS         │
        │  (Google Cloud)             │  │  (Serverless)              │
        │                             │  │                            │
        │  ┌──────────────────────┐   │  │  ┌──────────────────────┐ │
        │  │ Firebase Auth        │   │  │  │ openai-proxy.js      │ │
        │  │ - User Management    │   │  │  │ - Secure API Calls   │ │
        │  │ - Email/Password     │   │  │  │ - CORS Handling      │ │
        │  │ - Session Tokens     │   │  │  │ (Currently Unused)   │ │
        │  └──────────────────────┘   │  │  └──────────────────────┘ │
        │                             │  │                            │
        │  ┌──────────────────────┐   │  │  Environment Variables:   │
        │  │ Cloud Firestore      │   │  │  - OPENAI_API_KEY        │
        │  │ - User Profiles      │   │  │  (Not configured)         │
        │  │ - Application Data   │   │  └────────────────────────────┘
        │  │ - Real-time Sync     │   │
        │  └──────────────────────┘   │
        │                             │
        │  Firebase Config:            │
        │  - apiKey: (Removed)         │
        │  - authDomain               │
        │  - projectId                │
        └─────────────────────────────┘
                           │
                           │ HTTPS
                           │
        ┌──────────────────▼─────────────────┐
        │  EXTERNAL AI SERVICES               │
        │  (Direct from Browser - Backup)     │
        │                                     │
        │  ┌──────────────────────────────┐   │
        │  │ Google Gemini API            │   │
        │  │ generativelanguage.googleapis│   │
        │  │ - Free Tier: 60 req/min      │   │
        │  │ - Direct Client Calls        │   │
        │  │ - API Key: (Removed)         │   │
        │  └──────────────────────────────┘   │
        └─────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           HOSTING & DEPLOYMENT                               │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ GitHub Pages / Netlify                                            │       │
│  │ Domain: bus2college.com                                           │       │
│  │                                                                    │       │
│  │ Static Files:                                                     │       │
│  │  - HTML, CSS, JavaScript                                          │       │
│  │  - Images & Assets                                                │       │
│  │  - No Server-Side Code                                            │       │
│  └──────────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer (Client-Side)

#### **HTML Pages**
- **index.html**: Login/Registration page
- **home.html**: Main application dashboard with 3-panel layout

#### **JavaScript Modules**

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| `auth-firebase.js` | Authentication | Registration, Login, Logout, Session Management |
| `firebase-data-handler.js` | Data Persistence | CRUD operations with Firestore |
| `navigation.js` | UI Navigation | Page routing, menu controls, panel toggles |
| `ai-chat.js` | AI Chat Interface | Message handling, conversation history |
| `colleges.js` | College Management | College list, essay management, AI feedback |
| `data-handler.js` | Local Storage | LocalStorage operations, JSON export |
| `secure-api-client.js` | API Integration | Routes to Gemini API or backend proxy |
| `college-database.js` | College Data | College information, search, filtering |
| `common-app-integration.js` | Essay Templates | Common App essay helpers |

#### **Data Storage**
- **localStorage**: User data, essays, activities, colleges (persistent)
- **sessionStorage**: Session info, auth state (temporary)

### 2. Backend Services

#### **Firebase (Google Cloud)**
- **Firebase Authentication**
  - User registration and login
  - Email/password authentication
  - Session token management
  
- **Cloud Firestore**
  - User profiles: `/users/{userId}`
  - Application data: `/userData/{userId}`
  - Real-time synchronization
  - Structured NoSQL database

#### **Netlify Functions (Serverless)**
- **openai-proxy.js**
  - Purpose: Secure proxy for OpenAI API calls
  - Status: Currently unused (no API key configured)
  - CORS: Configured for bus2college.com
  - Environment: OPENAI_API_KEY (not set)

### 3. External AI Services

#### **Google Gemini API** (Primary AI - Currently Disabled)
- Endpoint: `generativelanguage.googleapis.com`
- Model: `gemini-pro`
- Free tier: 60 requests/minute
- Implementation: Direct client-side calls
- Status: API key removed for security

#### **OpenAI API** (Secondary - Via Proxy)
- Model: `gpt-4o-mini`
- Access: Through Netlify function proxy
- Status: Not configured

### 4. Hosting & Deployment

- **Static Hosting**: GitHub Pages or Netlify
- **Domain**: bus2college.com
- **CDN**: Built-in (GitHub/Netlify)
- **HTTPS**: Automatic SSL certificates

## Data Flow Diagrams

### User Registration Flow
```
User Input (index.html)
    ↓
auth-firebase.js → handleRegister()
    ↓
Firebase Auth → createUserWithEmailAndPassword()
    ↓
Firestore → Store user profile & initialize data
    ↓
Redirect to home.html
```

### User Login Flow
```
User Input (index.html)
    ↓
auth-firebase.js → handleLogin()
    ↓
Firebase Auth → signInWithEmailAndPassword()
    ↓
Firestore → Update lastLogin timestamp
    ↓
Set sessionStorage & redirect to home.html
```

### AI Chat Flow
```
User Message (home.html)
    ↓
ai-chat.js → sendMessage()
    ↓
secure-api-client.js → determineAIService()
    ↓
┌──────────────────┴──────────────────┐
│                                     │
▼                                     ▼
Gemini API (Direct)          Netlify Function (Proxy)
generativelanguage.googleapis    openai-proxy.js
    ↓                                 ↓
AI Response                      OpenAI API
    └──────────────┬──────────────────┘
                   ↓
           Display in Chat UI
                   ↓
      Store in localStorage (history)
```

### Data Persistence Flow
```
User Action (home.html)
    ↓
colleges.js / navigation.js
    ↓
┌────────────┴────────────┐
│                         │
▼                         ▼
localStorage           firebase-data-handler.js
(Immediate)                    ↓
                          Firestore
                        (Cloud Sync)
```

## Security Architecture

### Current Security Measures
1. ✅ **HTTPS Only**: All communications encrypted
2. ✅ **Firebase Auth**: Secure user authentication
3. ✅ **API Keys Removed**: No exposed keys in client code
4. ✅ **CORS Protection**: Netlify functions restrict origins
5. ✅ **Firebase Rules**: Server-side data validation

### Security Gaps (To Address)
1. ⚠️ **No API Keys**: AI features currently non-functional
2. ⚠️ **Client-Side Logic**: Business logic exposed
3. ⚠️ **No Rate Limiting**: Client-side AI calls unrestricted

## Technology Stack

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling (Day mode theme)
- **JavaScript (ES6+)**: Client-side logic
- **SheetJS**: Excel import/export (placeholder)

### Backend
- **Firebase Auth**: User authentication
- **Cloud Firestore**: NoSQL database
- **Netlify Functions**: Serverless compute (Node.js)

### External Services
- **Google Gemini API**: AI text generation
- **OpenAI API**: Alternative AI (via proxy)

### Deployment
- **Git**: Version control (GitHub)
- **GitHub Pages / Netlify**: Static hosting
- **Custom Domain**: bus2college.com

## Scalability & Performance

### Current Limitations
- Client-side only architecture
- localStorage has 5-10MB limit
- No caching strategy
- Direct API calls from browser

### Scaling Considerations
- Firebase: Auto-scales to millions of users
- Netlify Functions: Serverless auto-scaling
- Static hosting: Global CDN distribution

## Future Architecture Recommendations

### Backend Enhancement
```
Add Node.js/Express Backend
    ↓
- Centralized API management
- Server-side validation
- Rate limiting
- API key security
```

### Database Migration
```
Current: Firestore + localStorage
    ↓
Future: Firestore (primary) + Redis (cache)
```

### AI Service Management
```
Create AI Service Layer
    ↓
- Load balancing across providers
- Fallback mechanisms
- Response caching
- Cost optimization
```

## Deployment Pipeline

```
Developer → Git Push
    ↓
GitHub Repository (bus2college/Bus2CollegeApp)
    ↓
GitHub Actions / Netlify Build
    ↓
Deploy to Production
    ↓
bus2college.com (Live)
```

## Monitoring & Analytics

### Currently Implemented
- None (manual testing only)

### Recommended
- Google Analytics
- Firebase Analytics
- Error tracking (Sentry)
- Performance monitoring (Lighthouse CI)

---

**Document Version**: 1.0  
**Last Updated**: December 6, 2025  
**Status**: Production (with API keys removed for security)
