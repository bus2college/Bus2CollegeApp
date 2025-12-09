// ===================================
// Supabase Data Handler
// ===================================
// Manages all data operations with Supabase PostgreSQL database

/**
 * Get current user's ID
 */
async function getCurrentUserId() {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
}

/**
 * Save student information
 */
async function saveStudentInfoToSupabase(studentInfo) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { error } = await supabase
            .from('user_data')
            .update({ student_info: studentInfo })
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving student info:', error);
        throw error;
    }
}

/**
 * Load student information
 */
async function loadStudentInfoFromSupabase() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { data, error } = await supabase
            .from('user_data')
            .select('student_info')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data?.student_info || {};
    } catch (error) {
        console.error('Error loading student info:', error);
        return {};
    }
}

/**
 * Save colleges list
 */
async function saveCollegesToSupabase(colleges) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { error } = await supabase
            .from('user_data')
            .update({ colleges: colleges })
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving colleges:', error);
        throw error;
    }
}

/**
 * Load colleges list
 */
async function loadCollegesFromSupabase() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { data, error } = await supabase
            .from('user_data')
            .select('colleges')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data?.colleges || [];
    } catch (error) {
        console.error('Error loading colleges:', error);
        return [];
    }
}

/**
 * Save essays
 */
async function saveEssaysToSupabase(essays) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { error } = await supabase
            .from('user_data')
            .update({ essays: essays })
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving essays:', error);
        throw error;
    }
}

/**
 * Load essays
 */
async function loadEssaysFromSupabase() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { data, error } = await supabase
            .from('user_data')
            .select('essays')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data?.essays || {};
    } catch (error) {
        console.error('Error loading essays:', error);
        return {};
    }
}

/**
 * Save activities
 */
async function saveActivitiesToSupabase(activities) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { error } = await supabase
            .from('user_data')
            .update({ activities: activities })
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving activities:', error);
        throw error;
    }
}

/**
 * Load activities
 */
async function loadActivitiesFromSupabase() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { data, error } = await supabase
            .from('user_data')
            .select('activities')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data?.activities || [];
    } catch (error) {
        console.error('Error loading activities:', error);
        return [];
    }
}

/**
 * Save recommenders
 */
async function saveRecommendersToSupabase(recommenders) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { error } = await supabase
            .from('user_data')
            .update({ recommenders: recommenders })
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving recommenders:', error);
        throw error;
    }
}

/**
 * Load recommenders
 */
async function loadRecommendersFromSupabase() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { data, error } = await supabase
            .from('user_data')
            .select('recommenders')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data?.recommenders || [];
    } catch (error) {
        console.error('Error loading recommenders:', error);
        return [];
    }
}

/**
 * Save daily activities
 */
async function saveDailyActivitiesToSupabase(dailyActivities) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { error } = await supabase
            .from('user_data')
            .update({ daily_activities: dailyActivities })
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving daily activities:', error);
        throw error;
    }
}

/**
 * Load daily activities
 */
async function loadDailyActivitiesFromSupabase() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { data, error } = await supabase
            .from('user_data')
            .select('daily_activities')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data?.daily_activities || [];
    } catch (error) {
        console.error('Error loading daily activities:', error);
        return [];
    }
}

/**
 * Load all user data at once
 */
async function loadAllUserData() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { data, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data || {};
    } catch (error) {
        console.error('Error loading all user data:', error);
        return {};
    }
}

/**
 * Save user preferences (UI state)
 */
async function saveUserPreferences(preferences) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { error } = await supabase
            .from('user_preferences')
            .upsert({
                user_id: userId,
                ...preferences,
                updated_at: new Date().toISOString()
            });
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving preferences:', error);
        throw error;
    }
}

/**
 * Load user preferences
 */
async function loadUserPreferences() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('No user logged in');
        
        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
        return data || {};
    } catch (error) {
        console.error('Error loading preferences:', error);
        return {};
    }
}
