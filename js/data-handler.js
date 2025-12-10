// ===================================
// Data Handler - Excel Integration
// ===================================

// Get user data from Supabase
async function getUserDataFromSupabase() {
    const user = await getCurrentUser();
    if (!user) return null;
    
    try {
        const { data, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            throw error;
        }
        
        if (data) {
            return {
                studentInfo: data.student_info || {},
                colleges: data.colleges || [],
                essays: data.essays || {},
                activities: data.activities || [],
                recommenders: data.recommenders || [],
                dailyActivities: data.daily_activities || []
            };
        } else {
            // Return empty data structure
            return {
                studentInfo: {},
                colleges: [],
                essays: {},
                activities: [],
                recommenders: [],
                dailyActivities: []
            };
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
}

// Save user data to Supabase
async function saveUserDataToSupabase(data) {
    const user = await getCurrentUser();
    if (!user) return false;
    
    try {
        const updateData = {
            user_id: user.id,
            student_info: data.studentInfo || {},
            colleges: data.colleges || [],
            essays: data.essays || {},
            activities: data.activities || [],
            recommenders: data.recommenders || [],
            daily_activities: data.dailyActivities || []
        };
        
        const { error } = await supabase
            .from('user_data')
            .upsert(updateData, { onConflict: 'user_id' });
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving user data:', error);
        return false;
    }
}

// Export data to Excel file (using SheetJS)
async function exportToExcel(dataType) {
    const userData = await getUserDataFromSupabase();
    if (!userData) {
        alert('No data to export');
        return;
    }
    
    let dataToExport = [];
    let fileName = '';
    
    switch(dataType) {
        case 'colleges':
            dataToExport = userData.colleges || [];
            fileName = 'my_colleges.xlsx';
            break;
        case 'activities':
            dataToExport = userData.activities || [];
            fileName = 'my_activities.xlsx';
            break;
        case 'recommenders':
            dataToExport = userData.recommenders || [];
            fileName = 'my_recommenders.xlsx';
            break;
        case 'dailyTracker':
            dataToExport = userData.dailyTracker || [];
            fileName = 'daily_tracker.xlsx';
            break;
        case 'all':
            // Export all data
            const user = await getCurrentUser();
            dataToExport = {
                'User Info': [user.profile],
                'Colleges': userData.colleges || [],
                'Activities': userData.activities || [],
                'Recommenders': userData.recommenders || [],
                'Daily Tracker': userData.dailyActivities || []
            };
            fileName = 'bus2college_all_data.xlsx';
            break;
    }
    
    if (typeof XLSX === 'undefined') {
        alert('Excel export library not loaded. Please refresh the page.');
        return;
    }
    
    try {
        let workbook;
        
        if (dataType === 'all') {
            // Create workbook with multiple sheets
            workbook = XLSX.utils.book_new();
            
            for (const [sheetName, sheetData] of Object.entries(dataToExport)) {
                const worksheet = XLSX.utils.json_to_sheet(sheetData);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            }
        } else {
            // Create workbook with single sheet
            workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, dataType);
        }
        
        // Download file
        XLSX.writeFile(workbook, fileName);
        alert(`Data exported successfully to ${fileName}`);
        
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Error exporting data. Please try again.');
    }
}

// Import data from Excel file
function importFromExcel(dataType, file) {
    if (typeof XLSX === 'undefined') {
        alert('Excel import library not loaded. Please refresh the page.');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            
            // Get first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Update user data
            const userData = await getUserDataFromSupabase();
            if (!userData) {
                alert('Unable to load user data');
                return;
            }
            
            switch(dataType) {
                case 'colleges':
                    userData.colleges = jsonData;
                    break;
                case 'activities':
                    userData.activities = jsonData;
                    break;
                case 'recommenders':
                    userData.recommenders = jsonData;
                    break;
                case 'dailyTracker':
                    userData.dailyActivities = jsonData;
                    break;
            }
            
            await saveUserDataToSupabase(userData);
            alert('Data imported successfully!');
            
            // Reload current page data
            const currentPage = document.querySelector('.content-page.active');
            if (currentPage) {
                loadPageData(currentPage.id);
            }
            
        } catch (error) {
            console.error('Error importing from Excel:', error);
            alert('Error importing data. Please check the file format.');
        }
    };
// Sample data generators for testing
async function generateSampleData() {
    const userData = await getUserDataFromSupabase();
    if (!userData) {
        alert('Unable to load user data');
        return;
    }
    
    // Sample colleges
    userData.colleges = [
        {
            name: 'Stanford University',
            type: 'Reach',
            deadline: '2026-01-05',
            status: 'Not Started',
            location: 'Stanford, CA'
        },
        {
            name: 'University of California, Berkeley',
            type: 'Target',
            deadline: '2025-11-30',
            status: 'In Progress',
            location: 'Berkeley, CA'
        },
        {
            name: 'University of Washington',
            type: 'Safety',
            deadline: '2025-12-01',
            status: 'Not Started',
            location: 'Seattle, WA'
        }
    ];
    
    // Sample activities
    userData.activities = [
        {
            name: 'Debate Team Captain',
            type: 'Extracurricular',
            role: 'Captain',
            description: 'Led team to state championships, organized weekly practice sessions, and mentored junior members.',
            yearsInvolved: '10-12'
        },
        {
            name: 'Community Volunteer',
            type: 'Community Service',
            role: 'Volunteer',
            description: 'Organized food drives and tutored underprivileged children in math and science.',
            yearsInvolved: '9-12'
        }
    ];
    
    // Sample recommenders
    userData.recommenders = [
        {
            name: 'Dr. Sarah Johnson',
            title: 'AP English Teacher',
            email: 'sjohnson@school.edu',
            status: 'Requested',
            subject: 'English Literature'
        },
        {
            name: 'Mr. Robert Chen',
            title: 'Calculus Teacher',
            email: 'rchen@school.edu',
            status: 'Not Requested',
            subject: 'Mathematics'
        }
    ];
    
    // Sample daily activities
    userData.dailyActivities = [
        {
            date: new Date().toISOString(),
            activity: 'Completed UC application essays',
            notes: 'Finished all 8 PIQ responses and had them reviewed'
        },
        {
            date: new Date(Date.now() - 86400000).toISOString(),
            activity: 'Requested recommendation letters',
            notes: 'Met with Dr. Johnson and Mr. Chen about letters'
        }
    ];
    
    await saveUserDataToSupabase(userData);
    alert('Sample data generated! Refresh the page to see it.');
}   ];
    
    saveUserData(userData);
    alert('Sample data generated! Refresh the page to see it.');
}

// Helper function to create downloadable link
function downloadData(data, filename, type) {
    const blob = new Blob([data], { type: type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
// Export data as JSON (alternative to Excel)
async function exportAsJSON() {
    const userData = await getUserDataFromSupabase();
    const user = await getCurrentUser();
    
    if (!userData || !user) {
        alert('No data to export');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        user: {
            name: user.profile.name,
            email: user.profile.email,
            grade: user.profile.grade
        },
        data: userData
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    downloadData(jsonString, 'bus2college_data.json', 'application/json');
}

// Import data from JSON
async function importFromJSON(file) {
    const reader = new FileReader();
    
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (importedData.data) {
                await saveUserDataToSupabase(importedData.data);
                alert('Data imported successfully!');
                window.location.reload();
            } else {
                alert('Invalid data format');
            }
        } catch (error) {
            console.error('Error importing JSON:', error);
            alert('Error importing data. Please check the file format.');
        }
    };
    
    reader.readAsText(file);
}           }
        } catch (error) {
            console.error('Error importing JSON:', error);
            alert('Error importing data. Please check the file format.');
        }
    };
    
    reader.readAsText(file);
}
