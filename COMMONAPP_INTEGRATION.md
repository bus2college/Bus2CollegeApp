# Common App API Integration - Setup Guide

## Overview

This integration allows users to connect their Common Application account to Bus2College for seamless bidirectional data synchronization.

## Features

✅ **OAuth-based Authentication** - Secure connection without storing passwords
✅ **Bidirectional Sync** - Import and export data between platforms
✅ **College List Management** - Sync college applications both ways
✅ **Essay Integration** - Export essays directly to Common App
✅ **Supplemental Prompts** - Import college-specific essay prompts
✅ **Automatic Sync** - Optional scheduled synchronization
✅ **Status Tracking** - Real-time application status updates

## Architecture

### Frontend Components

1. **Settings Page** (`home.html`)
   - Connection status display
   - Connect/Disconnect interface
   - Sync controls and preferences
   - Last sync timestamp

2. **Common App API Client** (`js/commonapp-api.js`)
   - OAuth flow management
   - Token refresh logic
   - Import/Export operations
   - Connection state management

3. **UI Styles** (`css/styles.css`)
   - Settings page layout
   - Connection status indicators
   - Sync action buttons
   - Security notices

### Backend Components (Required)

The integration requires a backend API to handle:

1. **OAuth Authentication** (`/api/commonapp/connect`)
   - Receives email/password
   - Authenticates with Common App
   - Exchanges credentials for OAuth tokens
   - Returns tokens to frontend
   - **DOES NOT store password**

2. **Token Refresh** (`/api/commonapp/refresh`)
   - Accepts refresh token
   - Gets new access token from Common App
   - Returns new access token and expiry

3. **Import Data** (`/api/commonapp/sync/import`)
   - Fetches data from Common App API
   - Returns colleges, essays, and prompts
   - Requires valid access token

4. **Export Data** (`/api/commonapp/sync/export`)
   - Sends data to Common App API
   - Updates colleges and essays
   - Requires valid access token

### Database Schema

**Table: `commonapp_connections`**

```sql
- id: BIGSERIAL PRIMARY KEY
- user_id: UUID (unique, references auth.users)
- commonapp_email: TEXT
- access_token: TEXT (encrypted)
- refresh_token: TEXT (encrypted)
- expires_at: TIMESTAMPTZ
- connected_at: TIMESTAMPTZ
- last_sync: TIMESTAMPTZ
- sync_settings: JSONB
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

## Setup Instructions

### Step 1: Database Setup

Run the migration SQL in your Supabase SQL Editor:

```bash
# Run in Supabase SQL Editor
supabase-migration-commonapp.sql
```

This creates:
- `commonapp_connections` table
- RLS policies for secure access
- Helper functions for token management
- Automatic sync scheduling functions

### Step 2: Backend API Setup

Create backend API endpoints (Node.js/Express example):

```javascript
// backend/routes/commonapp.js

const express = require('express');
const router = express.Router();
const commonAppClient = require('../services/commonAppClient');

// Connect to Common App
router.post('/connect', async (req, res) => {
    try {
        const { email, password, userId } = req.body;
        
        // Authenticate with Common App OAuth
        const tokens = await commonAppClient.authenticate(email, password);
        
        // Return tokens (password is NOT stored)
        res.json({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt: tokens.expires_at
        });
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
});

// Refresh token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await commonAppClient.refreshToken(refreshToken);
        
        res.json({
            accessToken: tokens.access_token,
            expiresAt: tokens.expires_at
        });
    } catch (error) {
        res.status(401).json({ error: 'Token refresh failed' });
    }
});

// Import data from Common App
router.post('/sync/import', async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        const { syncColleges, syncEssays, syncSupplemental } = req.body;
        
        const data = {};
        
        if (syncColleges) {
            data.colleges = await commonAppClient.getColleges(accessToken);
        }
        
        if (syncEssays) {
            data.essay = await commonAppClient.getEssay(accessToken);
        }
        
        if (syncSupplemental) {
            data.supplementalPrompts = await commonAppClient.getSupplementalPrompts(accessToken);
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Import failed' });
    }
});

// Export data to Common App
router.post('/sync/export', async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        const { colleges, essay } = req.body;
        
        const result = {};
        
        if (colleges && colleges.length > 0) {
            await commonAppClient.updateColleges(accessToken, colleges);
            result.collegesExported = colleges.length;
        }
        
        if (essay) {
            await commonAppClient.updateEssay(accessToken, essay);
            result.essayExported = true;
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Export failed' });
    }
});

module.exports = router;
```

### Step 3: Common App Client Service

Create the Common App API client:

```javascript
// backend/services/commonAppClient.js

const axios = require('axios');

const COMMON_APP_API_BASE = 'https://api.commonapp.org/v1'; // Example URL

class CommonAppClient {
    async authenticate(email, password) {
        // OAuth2 authentication flow
        const response = await axios.post(`${COMMON_APP_API_BASE}/oauth/token`, {
            grant_type: 'password',
            username: email,
            password: password,
            client_id: process.env.COMMON_APP_CLIENT_ID,
            client_secret: process.env.COMMON_APP_CLIENT_SECRET
        });
        
        return response.data;
    }
    
    async refreshToken(refreshToken) {
        const response = await axios.post(`${COMMON_APP_API_BASE}/oauth/token`, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.COMMON_APP_CLIENT_ID,
            client_secret: process.env.COMMON_APP_CLIENT_SECRET
        });
        
        return response.data;
    }
    
    async getColleges(accessToken) {
        const response = await axios.get(`${COMMON_APP_API_BASE}/colleges`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        return response.data.colleges;
    }
    
    async getEssay(accessToken) {
        const response = await axios.get(`${COMMON_APP_API_BASE}/essay`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        return response.data;
    }
    
    async getSupplementalPrompts(accessToken) {
        const response = await axios.get(`${COMMON_APP_API_BASE}/supplemental-prompts`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        return response.data.prompts;
    }
    
    async updateColleges(accessToken, colleges) {
        await axios.put(`${COMMON_APP_API_BASE}/colleges`, 
            { colleges },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    }
    
    async updateEssay(accessToken, essay) {
        await axios.put(`${COMMON_APP_API_BASE}/essay`,
            essay,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    }
}

module.exports = new CommonAppClient();
```

### Step 4: Environment Variables

Add to your `.env` file:

```env
# Common App API Credentials
COMMON_APP_CLIENT_ID=your_client_id_here
COMMON_APP_CLIENT_SECRET=your_client_secret_here
COMMON_APP_API_BASE=https://api.commonapp.org/v1
```

### Step 5: Frontend Configuration

Update your API base URL in `js/commonapp-api.js` if needed:

```javascript
// Update API endpoints to match your backend
const API_BASE = 'https://your-backend.com/api';
```

## Usage Flow

### 1. Connect to Common App

1. User navigates to Settings page
2. Clicks "Connect to Common App"
3. Enters Common App email and password
4. Frontend sends credentials to backend
5. Backend authenticates with Common App OAuth
6. Backend returns OAuth tokens (password not stored)
7. Frontend stores tokens in Supabase
8. Connection status updates to "Connected"

### 2. Import Data from Common App

1. User clicks "Import from Common App"
2. System checks if token is valid (refreshes if needed)
3. Backend fetches data from Common App API
4. Data is merged with existing Bus2College data
5. Success notification shows imported items count
6. Page refreshes to show new data

### 3. Export Data to Common App

1. User clicks "Export to Common App"
2. System loads data from Supabase
3. Data is sent to Common App API via backend
4. Common App updates user's application
5. Success notification confirms export
6. Last sync timestamp updates

### 4. Automatic Sync

1. User enables "automatic sync" in settings
2. System schedules daily sync (24-hour interval)
3. Background process checks for connections needing sync
4. Automatic bidirectional sync runs
5. User receives notification of sync results

## Security Considerations

✅ **No Password Storage** - Passwords are used once for OAuth exchange
✅ **Encrypted Tokens** - Access tokens stored encrypted in Supabase
✅ **RLS Policies** - Users can only access their own connections
✅ **Token Expiry** - Automatic token refresh before expiration
✅ **HTTPS Only** - All API calls use secure HTTPS
✅ **User Consent** - Explicit user action required for sync

## Data Mapping

### Colleges

**Bus2College → Common App:**
- College name → School selection
- Application status → Status field
- Deadline → Application deadline
- Type (Safety/Target/Reach) → Custom note

**Common App → Bus2College:**
- School selection → College name
- Status field → Application status
- Application deadline → Deadline
- Decision → Status update

### Essays

**Bus2College → Common App:**
- Prompt selection → Prompt ID
- Essay content → Text field
- Word count → Validation

**Common App → Bus2College:**
- Prompt ID → Prompt selection
- Text field → Essay content
- Last modified → Timestamp

### Supplemental Prompts

**Common App → Bus2College:**
- College name → College association
- Prompt text → Prompt field
- Word limit → Validation
- Required/Optional → Status

## Error Handling

The system handles common errors:

- **Invalid Credentials** - Clear error message, retry option
- **Token Expired** - Automatic refresh attempt
- **API Rate Limiting** - Exponential backoff retry
- **Network Errors** - Offline detection, queue for retry
- **Data Conflicts** - User choice for resolution

## Testing

1. **Test Connection**: Try connecting with valid Common App credentials
2. **Test Import**: Import a small college list from Common App
3. **Test Export**: Export test data to Common App (use test account)
4. **Test Sync**: Enable auto-sync and verify 24-hour sync works
5. **Test Disconnect**: Disconnect and verify tokens are removed

## Common App API Documentation

**Note**: As of this implementation, Common App does not have a public API. This integration is designed for the future when Common App releases their API, or for institutions with API access.

For institutions with API access:
- Contact Common App for API credentials
- Request OAuth 2.0 client ID and secret
- Review their API documentation
- Follow their rate limiting guidelines

## Support

For issues or questions:
- Check Supabase logs for backend errors
- Review browser console for frontend errors
- Verify token expiration times
- Check Common App API status
- Contact Common App support for API issues

## Future Enhancements

- [ ] Real-time sync notifications
- [ ] Conflict resolution UI
- [ ] Sync history and audit log
- [ ] Multiple account support
- [ ] Bulk operations
- [ ] Advanced filtering options
- [ ] Performance analytics
- [ ] Mobile app integration
