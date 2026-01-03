// Direct Supabase Auth API calls (bypassing SDK issues)
// This provides a lightweight authentication layer without depending on the full SDK

// Use credentials from parent window scope (defined in HTML)
const AUTH_URL = `${SUPABASE_URL}/auth/v1`;

class SupabaseAuthAPI {
    constructor() {
        this.sessionKey = 'sb-auth-session';
        this.currentSession = this.loadSession();
    }

    // Load session from localStorage
    loadSession() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (e) {
            console.error('Error loading session:', e);
            return null;
        }
    }

    // Save session to localStorage
    saveSession(session) {
        if (session) {
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            this.currentSession = session;
        }
    }

    // Clear session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        this.currentSession = null;
    }

    // Make authenticated API request
    async makeRequest(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            ...options.headers
        };

        // Add authorization header if session exists
        if (this.currentSession && this.currentSession.access_token) {
            headers['Authorization'] = `Bearer ${this.currentSession.access_token}`;
        }

        const response = await fetch(`${AUTH_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                error: data.error_description || data.error || data.message || 'Unknown error'
            };
        }

        return data;
    }

    // Sign up with email and password
    async signUp(email, password, options = {}) {
        try {
            console.log('🔐 Signing up user:', email);
            
            const body = {
                email,
                password,
                data: options.data || {}
            };

            const data = await this.makeRequest('/signup', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            // Save session if signup successful
            if (data.session) {
                this.saveSession(data.session);
                console.log('✅ Signup successful, session saved');
            }

            return {
                data: {
                    user: data.user,
                    session: data.session || null
                },
                error: null
            };
        } catch (e) {
            console.error('❌ Signup error:', e);
            return {
                data: { user: null, session: null },
                error: e.error || e.message || 'Signup failed'
            };
        }
    }

    // Sign in with email and password
    async signInWithPassword(email, password) {
        try {
            console.log('🔐 Signing in user:', email);
            
            const body = {
                email,
                password
            };

            const data = await this.makeRequest('/token?grant_type=password', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            // Save session if signin successful
            if (data.session) {
                this.saveSession(data.session);
                console.log('✅ Sign in successful, session saved');
            }

            return {
                data: {
                    user: data.user,
                    session: data.session || null
                },
                error: null
            };
        } catch (e) {
            console.error('❌ Sign in error:', e);
            return {
                data: { user: null, session: null },
                error: e.error || e.message || 'Sign in failed'
            };
        }
    }

    // Sign out
    async signOut() {
        try {
            console.log('👋 Signing out user');
            this.clearSession();
            console.log('✅ Signed out successfully');
            return { error: null };
        } catch (e) {
            console.error('❌ Sign out error:', e);
            return { error: e.message };
        }
    }

    // Get current session
    getSession() {
        return this.currentSession;
    }

    // Get current user
    getUser() {
        if (this.currentSession && this.currentSession.user) {
            return this.currentSession.user;
        }
        return null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!(this.currentSession && this.currentSession.access_token && this.currentSession.user);
    }
}

// Create global instance
window.supabaseAuth = new SupabaseAuthAPI();
console.log('✓ Supabase Auth API initialized');
