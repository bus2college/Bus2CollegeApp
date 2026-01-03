/**
 * Common App API Integration
 * Handles OAuth connection and bidirectional data sync with Common Application
 */

// Connection state
let commonAppConnection = {
    isConnected: false,
    email: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    lastSync: null
};

/**
 * Initialize Common App connection state from Supabase
 */
async function initializeCommonAppConnection() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) return;

        const { data, error } = await supabase
            .from('commonapp_connections')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (data && !error) {
            commonAppConnection = {
                isConnected: true,
                email: data.commonapp_email,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresAt: new Date(data.expires_at),
                lastSync: data.last_sync ? new Date(data.last_sync) : null
            };

            updateConnectionUI(true);
        }
    } catch (error) {
        console.error('Error initializing Common App connection:', error);
    }
}

/**
 * Show Common App Connect Modal
 */
function showCommonAppConnectModal() {
    const modal = document.getElementById('commonAppConnectModal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * Close Common App Connect Modal
 */
function closeCommonAppConnectModal() {
    const modal = document.getElementById('commonAppConnectModal');
    if (modal) {
        modal.classList.remove('show');
    }
    
    // Reset form
    document.getElementById('commonAppConnectForm').reset();
    document.getElementById('connectBtnText').style.display = 'inline';
    document.getElementById('connectBtnLoading').style.display = 'none';
}

/**
 * Connect to Common App
 * This establishes an OAuth connection without storing credentials
 */
async function connectToCommonApp(event) {
    event.preventDefault();
    
    const email = document.getElementById('commonAppEmail').value;
    const password = document.getElementById('commonAppPassword').value;
    const rememberConnection = document.getElementById('rememberConnection').checked;
    
    // Show loading state
    document.getElementById('connectBtnText').style.display = 'none';
    document.getElementById('connectBtnLoading').style.display = 'inline';
    
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error('User not logged in');
        }

        // DEMO MODE: Simulate Common App connection
        // Note: Common App doesn't have a public API yet
        // This simulates a successful connection for testing
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Validate password (minimum 6 characters for demo)
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock OAuth tokens
        const result = {
            accessToken: 'demo_access_token_' + Date.now(),
            refreshToken: 'demo_refresh_token_' + Date.now(),
            expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
        };
        
        // In production, this would call:
        // const response = await fetch('/api/commonapp/connect', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password, userId })
        // });
        // const result = await response.json();

        // Store OAuth tokens in Supabase (not the password)
        const { error: saveError } = await supabase
            .from('commonapp_connections')
            .upsert({
                user_id: userId,
                commonapp_email: email,
                access_token: result.accessToken,
                refresh_token: result.refreshToken,
                expires_at: result.expiresAt,
                connected_at: new Date().toISOString(),
                last_sync: null
            });

        if (saveError) throw saveError;

        // Update local state
        commonAppConnection = {
            isConnected: true,
            email: email,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresAt: new Date(result.expiresAt),
            lastSync: null
        };

        // Update UI
        updateConnectionUI(true);
        
        // Close modal
        closeCommonAppConnectModal();
        
        // Show success message
        showToast('Successfully connected to Common App!', 'success');
        
        // Trigger initial sync
        showConfirm(
            'Would you like to sync your data now?',
            'Initial Sync',
            () => syncFromCommonApp()
        );
        
    } catch (error) {
        console.error('Error connecting to Common App:', error);
        showToast('Failed to connect: ' + error.message, 'error');
    } finally {
        // Reset loading state
        document.getElementById('connectBtnText').style.display = 'inline';
        document.getElementById('connectBtnLoading').style.display = 'none';
    }
    
    return false;
}

/**
 * Disconnect from Common App
 */
async function disconnectCommonApp() {
    showConfirm(
        'Are you sure you want to disconnect from Common App? You can reconnect anytime.',
        'Disconnect Common App',
        async () => {
            try {
                const userId = await getCurrentUserId();
                if (!userId) return;

                // Delete connection from Supabase
                const { error } = await supabase
                    .from('commonapp_connections')
                    .delete()
                    .eq('user_id', userId);

                if (error) throw error;

                // Clear local state
                commonAppConnection = {
                    isConnected: false,
                    email: null,
                    accessToken: null,
                    refreshToken: null,
                    expiresAt: null,
                    lastSync: null
                };

                // Update UI
                updateConnectionUI(false);
                
                showToast('Disconnected from Common App', 'success');
            } catch (error) {
                console.error('Error disconnecting:', error);
                showToast('Failed to disconnect: ' + error.message, 'error');
            }
        }
    );
}

/**
 * Update UI based on connection status
 */
function updateConnectionUI(connected) {
    const disconnectedDiv = document.getElementById('commonAppDisconnected');
    const connectedDiv = document.getElementById('commonAppConnected');
    
    if (connected) {
        disconnectedDiv.style.display = 'none';
        connectedDiv.style.display = 'block';
        
        // Update connection details
        document.getElementById('connectedEmail').textContent = commonAppConnection.email || '—';
        document.getElementById('lastSynced').textContent = commonAppConnection.lastSync 
            ? commonAppConnection.lastSync.toLocaleString() 
            : 'Never';
        document.getElementById('connectionStatus').textContent = 'Active';
        document.getElementById('connectionStatus').className = 'detail-value status-active';
    } else {
        disconnectedDiv.style.display = 'block';
        connectedDiv.style.display = 'none';
    }
}

/**
 * Refresh OAuth access token if expired
 */
async function refreshAccessToken() {
    if (!commonAppConnection.refreshToken) {
        throw new Error('No refresh token available');
    }

    // DEMO MODE: Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = {
        accessToken: 'demo_access_token_refreshed_' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
    };
    
    // In production, this would be:
    // const response = await fetch('/api/commonapp/refresh', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ refreshToken: commonAppConnection.refreshToken })
    // });
    // const result = await response.json();

    // Update tokens in Supabase
    const userId = await getCurrentUserId();
    await supabase
        .from('commonapp_connections')
        .update({
            access_token: result.accessToken,
            expires_at: result.expiresAt
        })
        .eq('user_id', userId);

    // Update local state
    commonAppConnection.accessToken = result.accessToken;
    commonAppConnection.expiresAt = new Date(result.expiresAt);

    return result.accessToken;
}

/**
 * Get valid access token (refresh if needed)
 */
async function getValidAccessToken() {
    if (!commonAppConnection.isConnected) {
        throw new Error('Not connected to Common App');
    }

    // Check if token is expired or will expire in next 5 minutes
    const now = new Date();
    const expiresIn = (commonAppConnection.expiresAt - now) / 1000 / 60; // minutes

    if (expiresIn < 5) {
        return await refreshAccessToken();
    }

    return commonAppConnection.accessToken;
}

/**
 * Import data from Common App
 */
async function syncFromCommonApp() {
    if (!commonAppConnection.isConnected) {
        showToast('Please connect to Common App first', 'warning');
        return;
    }

    try {
        showToast('Syncing from Common App...', 'info', 2000);

        const accessToken = await getValidAccessToken();
        const syncColleges = document.getElementById('syncColleges')?.checked !== false;
        const syncEssays = document.getElementById('syncEssays')?.checked !== false;
        const syncSupplemental = document.getElementById('syncSupplemental')?.checked !== false;

        // DEMO MODE: Simulate importing data from Common App
        // In production, this would fetch from actual Common App API
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate demo data
        const data = {};
        
        if (syncColleges) {
            // Demo colleges from Common App
            data.colleges = [
                { name: 'Harvard University', location: 'Cambridge, MA', type: 'Reach', status: 'Not Started' },
                { name: 'Stanford University', location: 'Stanford, CA', type: 'Reach', status: 'Not Started' },
                { name: 'University of California, Berkeley', location: 'Berkeley, CA', type: 'Target', status: 'Not Started' }
            ];
        }
        
        if (syncEssays) {
            // Demo essay from Common App
            data.essay = {
                prompt: 'Prompt 1: Background, identity, interest, or talent',
                content: '<p>This is a demo essay imported from Common App...</p>',
                wordCount: 350,
                lastModified: new Date().toISOString()
            };
        }
        
        if (syncSupplemental) {
            // Demo supplemental prompts
            data.supplementalPrompts = [
                { collegeName: 'Harvard University', promptText: 'Why Harvard?', wordLimit: 150 },
                { collegeName: 'Stanford University', promptText: 'What matters to you and why?', wordLimit: 250 }
            ];
        }
        
        // In production, this would be:
        // const response = await fetch('/api/commonapp/sync/import', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${accessToken}`
        //     },
        //     body: JSON.stringify({ syncColleges, syncEssays, syncSupplemental })
        // });
        // const data = await response.json();

        // Import colleges
        if (syncColleges && data.colleges && data.colleges.length > 0) {
            await importCommonAppColleges(data.colleges);
        }

        // Import essay
        if (syncEssays && data.essay) {
            await importCommonAppEssayData(data.essay);
        }

        // Import supplemental prompts
        if (syncSupplemental && data.supplementalPrompts) {
            await importSupplementalPrompts(data.supplementalPrompts);
        }

        // Update last sync time
        const userId = await getCurrentUserId();
        const now = new Date().toISOString();
        
        await supabase
            .from('commonapp_connections')
            .update({ last_sync: now })
            .eq('user_id', userId);

        commonAppConnection.lastSync = new Date(now);
        updateConnectionUI(true);

        showToast(`Successfully synced from Common App! Imported: ${data.colleges?.length || 0} colleges, ${data.essay ? '1 essay' : '0 essays'}, ${data.supplementalPrompts?.length || 0} prompts`, 'success', 6000);
        
        // Reload current page
        const currentPage = document.querySelector('.content-page.active');
        if (currentPage) {
            loadPageData(currentPage.id);
        }

    } catch (error) {
        console.error('Error syncing from Common App:', error);
        showToast('Failed to sync from Common App: ' + error.message, 'error');
    }
}

/**
 * Export data to Common App
 */
async function syncToCommonApp() {
    if (!commonAppConnection.isConnected) {
        showToast('Please connect to Common App first', 'warning');
        return;
    }

    try {
        showToast('Syncing to Common App...', 'info', 2000);

        const accessToken = await getValidAccessToken();
        const syncColleges = document.getElementById('syncColleges')?.checked !== false;
        const syncEssays = document.getElementById('syncEssays')?.checked !== false;

        // Get data from Supabase
        const colleges = syncColleges ? await loadCollegesFromSupabase() : [];
        const essays = syncEssays ? await loadEssaysFromSupabase() : {};

        // Filter Common App colleges only
        const commonAppColleges = colleges.filter(c => {
            const dbCollege = getCollegeByName(c.name);
            return dbCollege && dbCollege.commonApp === true;
        });

        // DEMO MODE: Simulate exporting data to Common App
        // In production, this would push to actual Common App API
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful export
        const result = {
            collegesExported: commonAppColleges.length,
            essayExported: essays.commonApp ? true : false,
            success: true
        };
        
        // In production, this would be:
        // const response = await fetch('/api/commonapp/sync/export', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${accessToken}`
        //     },
        //     body: JSON.stringify({ colleges: commonAppColleges, essay: essays.commonApp || null })
        // });
        // const result = await response.json();

        // Update last sync time
        const userId = await getCurrentUserId();
        const now = new Date().toISOString();
        
        await supabase
            .from('commonapp_connections')
            .update({ last_sync: now })
            .eq('user_id', userId);

        commonAppConnection.lastSync = new Date(now);
        updateConnectionUI(true);

        showToast(`Successfully synced to Common App! Exported: ${result.collegesExported || 0} colleges, ${result.essayExported ? '1 essay' : '0 essays'}`, 'success', 6000);

    } catch (error) {
        console.error('Error syncing to Common App:', error);
        showToast('Failed to sync to Common App: ' + error.message, 'error');
    }
}

/**
 * Import colleges from Common App
 */
async function importCommonAppColleges(collegesData) {
    const existingColleges = await loadCollegesFromSupabase() || [];
    
    // Merge colleges (avoid duplicates)
    const existingNames = new Set(existingColleges.map(c => c.name));
    
    const newColleges = collegesData.filter(c => !existingNames.has(c.name));
    
    if (newColleges.length > 0) {
        const updatedColleges = [...existingColleges, ...newColleges];
        await saveCollegesToSupabase(updatedColleges);
    }
    
    return newColleges.length;
}

/**
 * Import essay from Common App
 */
async function importCommonAppEssayData(essayData) {
    const essays = await loadEssaysFromSupabase() || {};
    
    essays.commonApp = {
        prompt: essayData.prompt || '',
        content: essayData.content || '',
        wordCount: essayData.wordCount || 0,
        lastModified: essayData.lastModified || new Date().toISOString()
    };
    
    await saveEssaysToSupabase(essays);
}

/**
 * Import supplemental prompts from Common App
 */
async function importSupplementalPrompts(promptsData) {
    const essays = await loadEssaysFromSupabase() || {};
    
    if (!essays.supplemental) {
        essays.supplemental = [];
    }
    
    // Add new prompts
    promptsData.forEach(prompt => {
        const exists = essays.supplemental.some(e => 
            e.collegeName === prompt.collegeName && e.promptText === prompt.promptText
        );
        
        if (!exists) {
            essays.supplemental.push({
                collegeName: prompt.collegeName,
                promptText: prompt.promptText,
                wordLimit: prompt.wordLimit,
                content: '',
                status: 'Not Started'
            });
        }
    });
    
    await saveEssaysToSupabase(essays);
}

/**
 * Update sync settings
 */
async function updateSyncSettings() {
    const settings = {
        autoSyncEnabled: document.getElementById('autoSyncEnabled')?.checked || false,
        syncColleges: document.getElementById('syncColleges')?.checked !== false,
        syncEssays: document.getElementById('syncEssays')?.checked !== false,
        syncSupplemental: document.getElementById('syncSupplemental')?.checked !== false
    };

    try {
        const userId = await getCurrentUserId();
        
        await supabase
            .from('commonapp_connections')
            .update({ 
                sync_settings: settings,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        showToast('Sync settings updated', 'success');
    } catch (error) {
        console.error('Error updating sync settings:', error);
        showToast('Failed to update settings', 'error');
    }
}

/**
 * Load settings page data
 */
async function loadSettingsPage() {
    try {
        const user = await getCurrentUser();
        if (!user) return;

        // Load account info
        document.getElementById('settingsEmail').value = user.email || '';
        
        // Load created date from user metadata
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.created_at) {
            const createdDate = new Date(userData.user.created_at);
            document.getElementById('settingsCreatedDate').value = createdDate.toLocaleDateString();
        }

        // Initialize Common App connection
        await initializeCommonAppConnection();
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.href.includes('home.html')) {
            initializeCommonAppConnection();
        }
    });
} else {
    if (window.location.href.includes('home.html')) {
        initializeCommonAppConnection();
    }
}
