// ===================================
// Navigation Management
// ===================================

// Toggle left navigation panel
async function toggleNavPanel() {
    const navPanel = document.getElementById('leftNavPanel');
    const toggleIcon = document.getElementById('toggleNavIcon');
    const isCollapsed = navPanel.classList.toggle('collapsed');
    
    // Keep hamburger icon - no change needed
    toggleIcon.textContent = '☰';
    
    // Save state to Supabase
    const user = await getCurrentUser();
    if (user) {
        await saveNavPanelState(isCollapsed);
    }
}

// Initialize navigation panel state on load
async function initializeNavPanelState() {
    const user = await getCurrentUser();
    if (user) {
        const isCollapsed = await loadNavPanelState();
        if (isCollapsed) {
            const navPanel = document.getElementById('leftNavPanel');
            const toggleIcon = document.getElementById('toggleNavIcon');
            if (navPanel && toggleIcon) {
                navPanel.classList.add('collapsed');
                toggleIcon.textContent = '☰';
            }
        }
    }
}

// Navigate to different pages/sections
function navigateToPage(event, pageId) {
    event.preventDefault();
    
    // Get current page before switching
    const currentPage = document.querySelector('.content-page.active')?.id || 'unknown';
    
    // Track navigation
    if (typeof trackNavigation === 'function') {
        trackNavigation(currentPage, pageId);
    }
    if (typeof trackPageView === 'function') {
        trackPageView(pageId);
    }
    
    // Hide all content pages
    const allPages = document.querySelectorAll('.content-page');
    allPages.forEach(page => page.classList.remove('active'));
    
    // Remove active class from all nav links
    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach(link => link.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Add active class to clicked link
    event.currentTarget.classList.add('active');
    
    // Load page-specific data
    loadPageData(pageId);
}

// Load data for specific page
async function loadPageData(pageId) {
    const user = await getCurrentUser();
    if (!user) return;
    
    switch(pageId) {
        case 'student-info':
            const studentInfo = await loadStudentInfoFromSupabase();
            loadStudentInfo(studentInfo);
            break;
        case 'my-colleges':
            const colleges = await loadCollegesFromSupabase();
            loadCollegesList(colleges);
            break;
        case 'common-app-essay':
            const essays = await loadEssaysFromSupabase() || {};
            console.log('Loading Common App essay from Supabase:', essays.commonApp);
            loadCommonAppEssay(essays.commonApp || {});
            break;
        case 'supplemental-essays':
            // TODO: Load from Supabase
            loadSupplementalEssays([]);
            break;
        case 'my-activities':
            const activities = await loadActivitiesFromSupabase();
            loadActivities(activities);
            break;
        case 'my-recommenders':
            const recommenders = await loadRecommendersFromSupabase();
            loadRecommenders(recommenders);
            break;
        case 'daily-tracker':
            const dailyActivities = await loadDailyActivitiesFromSupabase();
            loadDailyTracker(dailyActivities);
            break;
        case 'admissions-status':
            // TODO: Load from Supabase
            loadAdmissionsStatus({});
            break;
    }
}

// ===================================
// Page-specific loading functions
// ===================================
// loadCollegesList function is now in colleges.js

async function loadStudentInfo(studentInfo) {
    const user = await getCurrentUser();
    if (!user) return;
    
    // Pre-fill email from user account
    const emailField = document.getElementById('studentEmail');
    if (emailField) {
        emailField.value = user.email;
    }
    
    // Load other student info fields
    const fields = {
        'studentName': studentInfo.name || user.name || '',
        'studentGrade': studentInfo.grade || user.grade || '',
        'studentGPA': studentInfo.gpa || '',
        'studentSAT': studentInfo.sat || '',
        'studentACT': studentInfo.act || '',
        'studentState': studentInfo.state || '',
        'studentAddress': studentInfo.address || '',
        'studentCity': studentInfo.city || '',
        'studentZip': studentInfo.zip || '',
        'studentPhone': studentInfo.phone || '',
        'studentDateOfBirth': studentInfo.dateOfBirth || '',
        'studentCitizenship': studentInfo.citizenship || '',
        'parent1Name': studentInfo.parent1?.name || '',
        'parent1Relationship': studentInfo.parent1?.relationship || '',
        'parent1Email': studentInfo.parent1?.email || '',
        'parent1Phone': studentInfo.parent1?.phone || '',
        'parent1Occupation': studentInfo.parent1?.occupation || '',
        'parent1Employer': studentInfo.parent1?.employer || '',
        'parent1Education': studentInfo.parent1?.education || '',
        'parent1College': studentInfo.parent1?.college || '',
        'parent2Name': studentInfo.parent2?.name || '',
        'parent2Relationship': studentInfo.parent2?.relationship || '',
        'parent2Email': studentInfo.parent2?.email || '',
        'parent2Phone': studentInfo.parent2?.phone || '',
        'parent2Occupation': studentInfo.parent2?.occupation || '',
        'parent2Employer': studentInfo.parent2?.employer || '',
        'parent2Education': studentInfo.parent2?.education || '',
        'parent2College': studentInfo.parent2?.college || '',
        'householdIncome': studentInfo.household?.income || '',
        'householdSize': studentInfo.household?.size || '',
        'siblingsInCollege': studentInfo.household?.siblingsInCollege || '',
        'studentInterests': studentInfo.interests || ''
    };
    
    for (const [fieldId, value] of Object.entries(fields)) {
        const field = document.getElementById(fieldId);
        if (field && value) {
            field.value = value;
        }
    }
}

async function saveStudentInfo() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    const user = await getCurrentUser();
    if (!user) {
        button.classList.remove('expanded');
        return;
    }
    
    const studentInfo = {
        name: document.getElementById('studentName').value,
        grade: document.getElementById('studentGrade').value,
        gpa: document.getElementById('studentGPA').value,
        sat: document.getElementById('studentSAT').value,
        act: document.getElementById('studentACT').value,
        state: document.getElementById('studentState').value,
        address: document.getElementById('studentAddress').value,
        city: document.getElementById('studentCity').value,
        zip: document.getElementById('studentZip').value,
        phone: document.getElementById('studentPhone').value,
        dateOfBirth: document.getElementById('studentDateOfBirth').value,
        citizenship: document.getElementById('studentCitizenship').value,
        parent1: {
            name: document.getElementById('parent1Name').value,
            relationship: document.getElementById('parent1Relationship').value,
            email: document.getElementById('parent1Email').value,
            phone: document.getElementById('parent1Phone').value,
            occupation: document.getElementById('parent1Occupation').value,
            employer: document.getElementById('parent1Employer').value,
            education: document.getElementById('parent1Education').value,
            college: document.getElementById('parent1College').value
        },
        parent2: {
            name: document.getElementById('parent2Name').value,
            relationship: document.getElementById('parent2Relationship').value,
            email: document.getElementById('parent2Email').value,
            phone: document.getElementById('parent2Phone').value,
            occupation: document.getElementById('parent2Occupation').value,
            employer: document.getElementById('parent2Employer').value,
            education: document.getElementById('parent2Education').value,
            college: document.getElementById('parent2College').value
        },
        household: {
            income: document.getElementById('householdIncome').value,
            size: document.getElementById('householdSize').value,
            siblingsInCollege: document.getElementById('siblingsInCollege').value
        },
        interests: document.getElementById('studentInterests').value,
        lastUpdated: new Date().toISOString()
    };
    
    const success = await saveStudentInfoToSupabase(studentInfo);
    
    if (success) {
        alert('Student information saved successfully!');
    } else {
        alert('Failed to save student information. Please try again.');
    }
    
    // Collapse button after save
    button.classList.remove('expanded');
}

async function exportStudentInfoToCommonApp() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    const user = await getCurrentUser();
    if (!user) {
        alert('Please log in to export your information.');
        button.classList.remove('expanded');
        return;
    }
    
    const info = await loadStudentInfoFromSupabase() || {};
    
    // Format the data for Common App
    let exportText = `COMMON APPLICATION - STUDENT INFORMATION\n`;
    exportText += `Generated: ${new Date().toLocaleDateString()}\n`;
    exportText += `\n${'='.repeat(60)}\n\n`;
    
    // Personal Information
    exportText += `PERSONAL INFORMATION\n`;
    exportText += `${'-'.repeat(60)}\n`;
    exportText += `Full Name: ${info.name || 'Not provided'}\n`;
    exportText += `Email: ${user.email || 'Not provided'}\n`;
    exportText += `Phone: ${info.phone || 'Not provided'}\n`;
    exportText += `Date of Birth: ${info.dateOfBirth || 'Not provided'}\n`;
    exportText += `Citizenship: ${info.citizenship || 'Not provided'}\n`;
    exportText += `\nAddress:\n`;
    exportText += `  ${info.address || 'Not provided'}\n`;
    exportText += `  ${info.city || ''}, ${info.state || ''} ${info.zip || ''}\n`;
    
    // Academic Information
    exportText += `\n${'='.repeat(60)}\n\n`;
    exportText += `ACADEMIC INFORMATION\n`;
    exportText += `${'-'.repeat(60)}\n`;
    exportText += `Current Grade: ${info.grade ? info.grade + 'th Grade' : 'Not provided'}\n`;
    exportText += `GPA (4.0 scale): ${info.gpa || 'Not provided'}\n`;
    exportText += `SAT Score: ${info.sat || 'Not provided'}\n`;
    exportText += `ACT Score: ${info.act || 'Not provided'}\n`;
    exportText += `Academic Interests: ${info.interests || 'Not provided'}\n`;
    
    // Parent/Guardian 1 Information
    if (info.parent1 && info.parent1.name) {
        exportText += `\n${'='.repeat(60)}\n\n`;
        exportText += `PARENT/GUARDIAN 1 INFORMATION\n`;
        exportText += `${'-'.repeat(60)}\n`;
        exportText += `Name: ${info.parent1.name}\n`;
        exportText += `Relationship: ${info.parent1.relationship || 'Not provided'}\n`;
        exportText += `Email: ${info.parent1.email || 'Not provided'}\n`;
        exportText += `Phone: ${info.parent1.phone || 'Not provided'}\n`;
        exportText += `Occupation: ${info.parent1.occupation || 'Not provided'}\n`;
        exportText += `Employer: ${info.parent1.employer || 'Not provided'}\n`;
        exportText += `Education Level: ${info.parent1.education || 'Not provided'}\n`;
        exportText += `College Attended: ${info.parent1.college || 'Not provided'}\n`;
    }
    
    // Parent/Guardian 2 Information
    if (info.parent2 && info.parent2.name) {
        exportText += `\n${'='.repeat(60)}\n\n`;
        exportText += `PARENT/GUARDIAN 2 INFORMATION\n`;
        exportText += `${'-'.repeat(60)}\n`;
        exportText += `Name: ${info.parent2.name}\n`;
        exportText += `Relationship: ${info.parent2.relationship || 'Not provided'}\n`;
        exportText += `Email: ${info.parent2.email || 'Not provided'}\n`;
        exportText += `Phone: ${info.parent2.phone || 'Not provided'}\n`;
        exportText += `Occupation: ${info.parent2.occupation || 'Not provided'}\n`;
        exportText += `Employer: ${info.parent2.employer || 'Not provided'}\n`;
        exportText += `Education Level: ${info.parent2.education || 'Not provided'}\n`;
        exportText += `College Attended: ${info.parent2.college || 'Not provided'}\n`;
    }
    
    // Family Financial Information
    if (info.household) {
        exportText += `\n${'='.repeat(60)}\n\n`;
        exportText += `FAMILY INFORMATION\n`;
        exportText += `${'-'.repeat(60)}\n`;
        exportText += `Annual Household Income: ${info.household.income || 'Not provided'}\n`;
        exportText += `Household Size: ${info.household.size || 'Not provided'}\n`;
        exportText += `Siblings in College: ${info.household.siblingsInCollege || '0'}\n`;
    }
    
    exportText += `\n${'='.repeat(60)}\n\n`;
    exportText += `INSTRUCTIONS:\n`;
    exportText += `1. Copy this information (Ctrl+A, then Ctrl+C)\n`;
    exportText += `2. Go to commonapp.org and log in\n`;
    exportText += `3. Navigate to the Profile section\n`;
    exportText += `4. Fill in the corresponding fields using this information\n`;
    exportText += `5. Save your progress regularly\n`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(exportText).then(() => {
        alert('Student information copied to clipboard!\n\nYou can now paste this into your Common App profile.\n\n1. Go to commonapp.org\n2. Log in to your account\n3. Navigate to Profile section\n4. Fill in the information from the clipboard');
        button.classList.remove('expanded');
    }).catch(err => {
        // Fallback: download as text file
        downloadStudentInfo(exportText);
        button.classList.remove('expanded');
    });
}

function downloadStudentInfo(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CommonApp_StudentInfo.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Student information downloaded!\n\nOpen the file and use it to fill in your Common App profile at commonapp.org');
}

async function loadCommonAppEssay(essay) {
    console.log('loadCommonAppEssay called with:', essay);
    const promptSelect = document.getElementById('commonAppPrompt');
    const studentDraftEditor = document.getElementById('studentDraftEditor');
    const aiFeedbackEditor = document.getElementById('aiFeedbackEditor');
    
    // Load Common App colleges list from Supabase
    const user = await getCurrentUser();
    if (user) {
        const colleges = await loadCollegesFromSupabase() || [];
        
        // Filter Common App colleges
        const commonAppColleges = colleges.filter(c => {
            const dbCollege = getCollegeByName(c.name);
            return dbCollege && dbCollege.commonApp === true;
        });
        
        const collegesListElement = document.getElementById('commonAppCollegesList');
        if (collegesListElement) {
            if (commonAppColleges.length === 0) {
                collegesListElement.innerHTML = '<em>No Common App colleges added yet. Add colleges to your list first!</em>';
            } else {
                collegesListElement.textContent = commonAppColleges.map(c => c.name).join(', ');
            }
        }
    }
    
    // Populate prompts dropdown with official 2024-2025 Common App prompts
    if (promptSelect) {
        const prompts = getCommonAppPrompts();
        promptSelect.innerHTML = '<option value="">Choose a prompt...</option>' + 
            prompts.map((p, idx) => 
                `<option value="${idx + 1}" data-full="${p.full.replace(/"/g, '&quot;')}">${p.short}</option>`
            ).join('');
        
        if (essay.prompt) {
            promptSelect.value = essay.prompt;
            updatePromptDescription();
        } else {
            // No prompt selected - ensure editor is disabled
            updatePromptDescription();
        }
    }
    
    // Load saved essay content
    if (studentDraftEditor && essay.content) {
        studentDraftEditor.innerHTML = essay.content;
        updateWordCount();
    }
    
    // Load saved AI feedback if exists
    if (aiFeedbackEditor && essay.aiFeedback) {
        aiFeedbackEditor.innerHTML = essay.aiFeedback;
    }
    
    // Load saved health score if exists
    if (essay.healthScore) {
        displayHealthMeter(essay.healthScore);
    }
    
    // Add input listener for word count and clearing health/feedback on edit
    if (studentDraftEditor) {
        studentDraftEditor.addEventListener('input', updateWordCount);
        studentDraftEditor.addEventListener('input', clearHealthAndFeedbackOnEdit);
    }
}

function updatePromptDescription() {
    const promptSelect = document.getElementById('commonAppPrompt');
    const descriptionDiv = document.getElementById('promptDescription');
    const descriptionText = document.getElementById('promptDescriptionText');
    const studentDraftEditor = document.getElementById('studentDraftEditor');
    
    console.log('updatePromptDescription called - prompt value:', promptSelect?.value);
    
    if (!promptSelect || !descriptionDiv) return;
    
    const selectedOption = promptSelect.options[promptSelect.selectedIndex];
    const fullPrompt = selectedOption.getAttribute('data-full');
    
    if (fullPrompt && promptSelect.value) {
        console.log('Enabling editor - prompt selected');
        if (descriptionText) {
            descriptionText.textContent = fullPrompt;
        }
        descriptionDiv.style.display = 'block';
        
        // Enable the essay editor when prompt is selected
        if (studentDraftEditor) {
            studentDraftEditor.contentEditable = 'true';
            studentDraftEditor.classList.remove('editor-disabled');
            studentDraftEditor.setAttribute('data-placeholder', 'Start writing your essay here...');
            console.log('Editor enabled - contentEditable:', studentDraftEditor.contentEditable);
        }
    } else {
        console.log('Disabling editor - no prompt selected');
        descriptionDiv.style.display = 'none';
        
        // Disable the essay editor when no prompt is selected
        if (studentDraftEditor) {
            studentDraftEditor.contentEditable = 'false';
            studentDraftEditor.classList.add('editor-disabled');
            studentDraftEditor.setAttribute('data-placeholder', 'Please select a prompt above to start writing...');
            console.log('Editor disabled - contentEditable:', studentDraftEditor.contentEditable);
        }
    }
}

function clearHealthAndFeedbackOnEdit() {
    // Clear AI feedback
    const aiFeedbackEditor = document.getElementById('aiFeedbackEditor');
    if (aiFeedbackEditor && aiFeedbackEditor.innerHTML.trim() !== '') {
        aiFeedbackEditor.innerHTML = '';
    }
    
    // Clear health meter
    const healthMeter = document.getElementById('essayHealthMeter');
    const healthMeterFill = document.getElementById('healthMeterFill');
    const healthScoreText = document.getElementById('healthScoreText');
    
    if (healthMeter && healthMeter.style.display !== 'none') {
        healthMeter.style.display = 'none';
        if (healthMeterFill) healthMeterFill.style.width = '0%';
        if (healthScoreText) healthScoreText.textContent = '--';
        
        // Clear individual indicators
        const indicators = [
            'healthIndicatorContent',
            'healthIndicatorStructure', 
            'healthIndicatorGrammar',
            'healthIndicatorVoice',
            'healthIndicatorPlagiarism'
        ];
        
        indicators.forEach(id => {
            const indicator = document.getElementById(id);
            if (indicator) {
                const scoreSpan = indicator.querySelector('.indicator-score');
                if (scoreSpan) scoreSpan.textContent = '--';
                indicator.classList.remove('good', 'medium', 'poor');
            }
        });
        
        // Clear stored health score
        delete healthMeter.dataset.lastHealthScore;
    }
}

function updateWordCount() {
    const studentDraftEditor = document.getElementById('studentDraftEditor');
    const wordCountSpan = document.getElementById('essayWordCount');
    
    if (!studentDraftEditor || !wordCountSpan) return;
    
    const text = studentDraftEditor.innerText.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    
    wordCountSpan.textContent = wordCount;
    
    // Color code based on word count (250-650 is the range)
    if (wordCount < 250) {
        wordCountSpan.style.color = '#C8511F'; // Orange - too short
    } else if (wordCount > 650) {
        wordCountSpan.style.color = '#dc3545'; // Red - too long
    } else {
        wordCountSpan.style.color = '#28a745'; // Green - good range
    }
}

function loadSupplementalEssays(essays) {
    const container = document.getElementById('supplementalEssaysList');
    if (!container) return;
    
    if (essays.length === 0) {
        container.innerHTML = '<p class="empty-state">No supplemental essays added yet. Click "Add Supplemental Essay" to begin!</p>';
        return;
    }
    
    container.innerHTML = essays.map((essay, index) => `
        <div class="data-item" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #C8511F;">
            <h4 style="color: #002855; margin-bottom: 5px;">${essay.college}</h4>
            <p style="font-size: 14px; color: #666;">
                <strong>Prompt:</strong> ${essay.prompt.substring(0, 100)}...
            </p>
            <p style="font-size: 14px; color: #666;">
                <strong>Word Count:</strong> ${essay.wordCount || 0} / ${essay.maxWords}
            </p>
        </div>
    `).join('');
}

function loadActivities(activities) {
    const container = document.getElementById('activitiesList');
    if (!container) return;
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="empty-state">No activities added yet. Click "Add Activity" to start building your list!</p>';
        return;
    }
    
    container.innerHTML = activities.map((activity, index) => `
        <div class="data-item" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #C8511F;">
            <h4 style="color: #002855; margin-bottom: 5px;">${activity.name}</h4>
            <p style="font-size: 14px; color: #666;">
                <strong>Type:</strong> ${activity.type} | 
                <strong>Role:</strong> ${activity.role}
            </p>
            <p style="font-size: 14px; color: #666;">
                ${activity.description.substring(0, 150)}...
            </p>
        </div>
    `).join('');
}

function loadRecommenders(recommenders) {
    const container = document.getElementById('recommendersList');
    if (!container) return;
    
    if (recommenders.length === 0) {
        container.innerHTML = '<p class="empty-state">No recommenders added yet. Click "Add Recommender" to get started!</p>';
        return;
    }
    
    container.innerHTML = recommenders.map((rec, index) => `
        <div class="data-item" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #C8511F;">
            <h4 style="color: #002855; margin-bottom: 5px;">${rec.name}</h4>
            <p style="font-size: 14px; color: #666;">
                <strong>Title:</strong> ${rec.title} | 
                <strong>Email:</strong> ${rec.email}
            </p>
            <p style="font-size: 14px; color: #666;">
                <strong>Status:</strong> ${rec.status}
            </p>
        </div>
    `).join('');
}

function loadDailyTracker(activities) {
    const container = document.getElementById('dailyActivitiesList');
    if (!container) return;
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="empty-state">No activities logged yet. Click "Log Today\'s Activity" to begin!</p>';
        return;
    }
    
    // Sort by date (most recent first)
    const sortedActivities = [...activities].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    container.innerHTML = sortedActivities.map((activity, index) => `
        <div class="data-item" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #C8511F;">
            <h4 style="color: #002855; margin-bottom: 5px;">${new Date(activity.date).toLocaleDateString()}</h4>
            <p style="font-size: 14px; color: #666;">
                <strong>Activity:</strong> ${activity.activity}
            </p>
            <p style="font-size: 14px; color: #666;">
                ${activity.notes}
            </p>
        </div>
    `).join('');
}

function loadAdmissionsStatus(userData) {
    // Update statistics
    const colleges = userData.colleges || [];
    const stats = {
        notStarted: colleges.filter(c => c.status === 'Not Started').length,
        inProgress: colleges.filter(c => c.status === 'In Progress').length,
        submitted: colleges.filter(c => c.status === 'Submitted').length
    };
    
    document.getElementById('statsNotStarted').textContent = stats.notStarted;
    document.getElementById('statsInProgress').textContent = stats.inProgress;
    document.getElementById('statsSubmitted').textContent = stats.submitted;
    
    // Load upcoming deadlines
    const upcomingDeadlines = colleges
        .filter(c => c.deadline && new Date(c.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
    
    const deadlinesContainer = document.getElementById('upcomingDeadlines');
    if (deadlinesContainer) {
        if (upcomingDeadlines.length === 0) {
            deadlinesContainer.innerHTML = '<p class="empty-state">No upcoming deadlines</p>';
        } else {
            deadlinesContainer.innerHTML = upcomingDeadlines.map(college => `
                <div style="padding: 10px; background: white; margin-bottom: 8px; border-radius: 8px; border-left: 3px solid #C8511F;">
                    <strong style="color: #002855;">${college.name}</strong><br>
                    <span style="font-size: 14px; color: #666;">${new Date(college.deadline).toLocaleDateString()}</span>
                </div>
            `).join('');
        }
    }
}

// ===================================
// Placeholder functions for add buttons
// ===================================

// addCollege() is now in colleges.js

function addSupplementalEssay() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    alert('Add Supplemental Essay functionality - To be implemented with detailed form');
    
    // Collapse button after action
    button.classList.remove('expanded');
}

function addActivity() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    alert('Add Activity functionality - To be implemented with detailed form');
    
    // Collapse button after action
    button.classList.remove('expanded');
}

function addRecommender() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    alert('Add Recommender functionality - To be implemented with detailed form');
    
    // Collapse button after action
    button.classList.remove('expanded');
}

function addDailyActivity() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    alert('Log Daily Activity functionality - To be implemented with detailed form');
    
    // Collapse button after action
    button.classList.remove('expanded');
}

async function saveEssay(type) {
    console.log('saveEssay called with type:', type);
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    const user = await getCurrentUser();
    if (!user) {
        console.log('saveEssay - No user logged in');
        button.classList.remove('expanded');
        return;
    }
    
    console.log('saveEssay - Loading essays from Supabase...');
    const essays = await loadEssaysFromSupabase() || {};
    console.log('saveEssay - Current essays:', essays);
    
    if (type === 'common-app') {
        const prompt = document.getElementById('commonAppPrompt').value;
        const studentDraftEditor = document.getElementById('studentDraftEditor');
        const aiFeedbackEditor = document.getElementById('aiFeedbackEditor');
        const healthScoreText = document.getElementById('healthScoreText');
        
        // Validate prompt selection
        if (!prompt) {
            alert('⚠️ Please select an essay prompt before saving.');
            button.classList.remove('expanded');
            return;
        }
        
        if (!studentDraftEditor) {
            button.classList.remove('expanded');
            return;
        }
        
        // Get current health score if available
        let healthScore = null;
        if (healthScoreText && healthScoreText.textContent !== '--') {
            // Store the complete health score object from the last calculation
            const healthMeter = document.getElementById('essayHealthMeter');
            if (healthMeter && healthMeter.dataset.lastHealthScore) {
                healthScore = JSON.parse(healthMeter.dataset.lastHealthScore);
            }
        }
        
        essays.commonApp = {
            prompt: prompt,
            content: studentDraftEditor.innerHTML,
            aiFeedback: aiFeedbackEditor ? aiFeedbackEditor.innerHTML : '',
            healthScore: healthScore,
            lastModified: new Date().toISOString()
        };
        
        console.log('Saving Common App essay to Supabase:', essays.commonApp);
        await saveEssaysToSupabase(essays);
        console.log('Common App essay saved successfully to Supabase');
        alert('✅ Common App essay saved to Supabase! [v2024-12-09]');
    }
    
    // Collapse button after save
    button.classList.remove('expanded');
}

function clearEditors() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    if (confirm('Are you sure you want to clear both the draft and AI feedback? This cannot be undone.')) {
        const studentDraftEditor = document.getElementById('studentDraftEditor');
        const aiFeedbackEditor = document.getElementById('aiFeedbackEditor');
        
        if (studentDraftEditor) {
            studentDraftEditor.innerHTML = '';
        }
        if (aiFeedbackEditor) {
            aiFeedbackEditor.innerHTML = '';
        }
        
        updateWordCount();
    }
    
    // Collapse button after action
    button.classList.remove('expanded');
}

function requestAIFeedback(type) {
    const studentDraftEditor = document.getElementById('studentDraftEditor');
    const aiFeedbackEditor = document.getElementById('aiFeedbackEditor');
    const promptSelect = document.getElementById('commonAppPrompt');
    const selectedPrompt = promptSelect ? promptSelect.options[promptSelect.selectedIndex] : null;
    const promptText = selectedPrompt ? selectedPrompt.getAttribute('data-full') : '';
    
    // Validate prompt selection first
    if (!promptSelect || !promptSelect.value) {
        alert('⚠️ Please select an essay prompt before requesting AI feedback.');
        return;
    }
    
    if (!studentDraftEditor) return;
    
    const essayContent = studentDraftEditor.innerText.trim();
    
    if (!essayContent) {
        alert('Please write some content in your essay first!');
        return;
    }
    
    // Check if any API key is configured
    if (typeof CONFIG === 'undefined' || (!CONFIG.API_ENDPOINT && !CONFIG.GEMINI_API_KEY)) {
        alert('Please configure API in js/config.js file first!\n\nFor secure setup, deploy the backend API following instructions in bus2college-api/README.md');
        return;
    }
    
    // Show loading message in AI feedback editor
    if (aiFeedbackEditor) {
        aiFeedbackEditor.innerHTML = '<div style="text-align: center; padding: 40px;"><div style="display: inline-block; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div><p style="margin-top: 15px; color: #666;">Analyzing your essay...</p></div>';
    }
    
    // Get AI feedback (inline version)
    getEssayFeedbackInline(essayContent, promptText);
}

async function getEssayFeedback(essayContent, promptText) {
    try {
        const wordCount = essayContent.trim().split(/\s+/).length;
        
        // Create messages for AI
        const messages = [
            {
                role: 'system',
                content: 'You are an expert college admissions essay reviewer. Provide detailed, constructive feedback on essays.'
            },
            {
                role: 'user',
                content: `Please review this college essay and provide detailed feedback.\n\nPrompt: ${promptText}\n\nEssay (${wordCount} words):\n${essayContent}\n\nProvide feedback on: 1) Content & Story, 2) Structure & Flow, 3) Language & Style, 4) Overall Impact, 5) Specific Suggestions for Improvement.`
            }
        ];
        
        // Use secure API client
        const feedback = await callAI(messages, {
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 1500
        });
        
        // Display feedback in modal
        showEssayFeedbackModal('success', feedback);
        
        // Save feedback to essays data
        const user = await getCurrentUser();
        if (user) {
            const essays = await loadEssaysFromSupabase() || {};
            
            if (!essays.feedbackHistory) {
                essays.feedbackHistory = [];
            }
            
            essays.feedbackHistory.push({
                timestamp: new Date().toISOString(),
                essayType: 'Common App',
                wordCount: wordCount,
                feedback: feedback,
                essaySnapshot: essayContent.substring(0, 200) + '...'
            });
            
            // Keep only last 10 feedback sessions
            if (essays.feedbackHistory.length > 10) {
                essays.feedbackHistory = essays.feedbackHistory.slice(-10);
            }
            
            await saveEssaysToSupabase(essays);
        }
        
    } catch (error) {
        console.error('Error getting essay feedback:', error);
        showEssayFeedbackModal('error', error.message);
    }
}

async function getEssayFeedbackInline(essayContent, promptText) {
    const aiFeedbackEditor = document.getElementById('aiFeedbackEditor');
    
    try {
        const wordCount = essayContent.trim().split(/\s+/).length;
        
        // Create messages for AI
        const messages = [
            {
                role: 'system',
                content: 'You are an expert college admissions essay reviewer. Provide detailed, constructive feedback on essays.'
            },
            {
                role: 'user',
                content: `Please review this college essay and provide detailed feedback.\n\nPrompt: ${promptText}\n\nEssay (${wordCount} words):\n${essayContent}\n\nProvide feedback on: 1) Content & Story, 2) Structure & Flow, 3) Language & Style, 4) Overall Impact, 5) Specific Suggestions for Improvement.`
            }
        ];
        
        // Use secure API client
        const feedback = await callAI(messages, {
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 1500
        });
        
        // Calculate and display health score
        const healthScore = calculateEssayHealth(feedback, essayContent, wordCount);
        displayHealthMeter(healthScore);
        
        // Display formatted feedback in the AI feedback editor
        if (aiFeedbackEditor) {
            aiFeedbackEditor.innerHTML = formatFeedbackForEditor(feedback);
        }
        
        // Save feedback to essays data
        const user = await getCurrentUser();
        if (user) {
            const essays = await loadEssaysFromSupabase() || {};
            
            if (!essays.commonApp) {
                essays.commonApp = {};
            }
            
            essays.commonApp.aiFeedback = aiFeedbackEditor ? aiFeedbackEditor.innerHTML : '';
            essays.commonApp.lastFeedback = new Date().toISOString();
            essays.commonApp.healthScore = healthScore;
            
            await saveEssaysToSupabase(essays);
        }
        
    } catch (error) {
        console.error('Error getting essay feedback:', error);
        if (aiFeedbackEditor) {
            aiFeedbackEditor.innerHTML = `
                <div style="padding: 20px; color: #dc3545;">
                    <h4 style="color: #dc3545; margin-bottom: 10px;">⚠️ Error Getting Feedback</h4>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p style="margin-top: 15px; font-size: 13px;">Please check your API key configuration in js/config.js</p>
                </div>
            `;
        }
        // Hide health meter on error
        const healthMeter = document.getElementById('essayHealthMeter');
        if (healthMeter) {
            healthMeter.style.display = 'none';
        }
    }
}

function formatFeedbackForEditor(content) {
    // Convert markdown-style formatting to HTML for the editor
    let formatted = content;
    
    // Headers with **Header:**
    formatted = formatted.replace(/\*\*([^*:]+):\*\*/g, '<h4 style="color: #002855; margin-top: 20px; margin-bottom: 10px; font-size: 16px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">$1</h4>');
    
    // Bold text
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #002855;">$1</strong>');
    
    // Numbered lists
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li style="margin-bottom: 8px;">$1</li>');
    
    // Bullet points
    formatted = formatted.replace(/^[-*]\s+(.+)$/gm, '<li style="margin-bottom: 8px;">$1</li>');
    
    // Wrap consecutive list items
    formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, '<ul style="margin: 10px 0; padding-left: 25px; color: #333;">$&</ul>');
    
    // Paragraphs
    formatted = formatted.split('\n\n').map(para => {
        if (!para.trim()) return '';
        if (para.includes('<h4') || para.includes('<ul')) return para;
        return `<p style="margin-bottom: 12px; color: #333; line-height: 1.7;">${para}</p>`;
    }).join('');
    
    return formatted;
}

async function getOpenAIFeedback(essayContent, promptText, wordCount) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.OpenAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert college admissions essay reviewer with years of experience helping students craft compelling Common Application essays. Provide detailed, constructive feedback that helps students improve their writing while maintaining their authentic voice.'
                },
                {
                    role: 'user',
                    content: `Please review this Common Application essay and provide detailed editorial feedback.\n\n**Essay Prompt:** ${promptText || 'Not specified'}\n\n**Word Count:** ${wordCount}/650 words\n\n**Essay Content:**\n${essayContent}\n\n**Please provide:**\n1. **Overall Impression** (2-3 sentences on the essay's strengths and main areas for improvement)\n2. **Content & Storytelling** (Does it answer the prompt? Is the story compelling? What specific details stand out or need enhancement?)\n3. **Structure & Organization** (How well does it flow? Are transitions smooth? Does the opening hook and closing resonate?)\n4. **Voice & Authenticity** (Does it sound genuine? Does the writer's personality come through? Any clichés to avoid?)\n5. **Grammar & Mechanics** (Any grammatical issues, awkward phrasing, or word choice improvements?)\n6. **Specific Suggestions** (3-5 concrete action items to improve the essay)\n7. **Revised Opening Sentence** (Suggest a more compelling opening if needed)\n\nBe encouraging but honest. Remember, this essay represents the student to admissions officers.`
                }
            ],
            temperature: 0.7,
            max_tokens: 3000
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

async function getClaudeFeedback(essayContent, promptText, wordCount) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': CONFIG.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 3000,
            system: `You are an expert college admissions essay reviewer with years of experience helping students craft compelling Common Application essays. Provide detailed, constructive feedback that helps students improve their writing while maintaining their authentic voice.

Your feedback should be structured, specific, and actionable. Focus on:
1. Content & storytelling
2. Structure & organization
3. Voice & authenticity
4. Grammar & mechanics
5. Overall impact on admissions readers`,
            messages: [
                {
                    role: 'user',
                    content: `Please review this Common Application essay and provide detailed editorial feedback.

**Essay Prompt:** ${promptText || 'Not specified'}

**Word Count:** ${wordCount}/650 words

**Essay Content:**
${essayContent}

**Please provide:**
1. **Overall Impression** (2-3 sentences on the essay's strengths and main areas for improvement)
2. **Content & Storytelling** (Does it answer the prompt? Is the story compelling? What specific details stand out or need enhancement?)
3. **Structure & Organization** (How well does it flow? Are transitions smooth? Does the opening hook and closing resonate?)
4. **Voice & Authenticity** (Does it sound genuine? Does the writer's personality come through? Any clichés to avoid?)
5. **Grammar & Mechanics** (Any grammatical issues, awkward phrasing, or word choice improvements?)
6. **Specific Suggestions** (3-5 concrete action items to improve the essay)
7. **Revised Opening Sentence** (Suggest a more compelling opening if needed)

Be encouraging but honest. Remember, this essay represents the student to admissions officers.`
                }
            ]
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

function showEssayFeedbackModal(status, content = '') {
    let modal = document.getElementById('essayFeedbackModal');
    
    // Create modal if it doesn't exist
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'essayFeedbackModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    let modalContent = '';
    
    if (status === 'loading') {
        modalContent = `
            <div class="modal-content" style="max-width: 500px;">
                <div style="text-align: center; padding: 40px 20px;">
                    <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <h3 style="color: #002855; margin-bottom: 10px;">Analyzing Your Essay...</h3>
                    <p style="color: #666;">Our AI is carefully reviewing your essay and preparing detailed feedback.</p>
                </div>
            </div>
        `;
    } else if (status === 'error') {
        modalContent = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>⚠️ Error Getting Feedback</h3>
                    <button class="modal-close" onclick="closeEssayFeedbackModal()">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <p style="color: #dc3545; margin-bottom: 15px;">
                        <strong>Error:</strong> ${content}
                    </p>
                    <p>Please check your API key configuration and try again. If you don't have an API key yet:</p>
                    <p><strong>Option 1 - Google Gemini (Recommended):</strong></p>
                    <ol style="margin: 15px 0; padding-left: 25px;">
                        <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" style="color: #667eea;">makersuite.google.com/app/apikey</a></li>
                        <li>Sign in with your Google account</li>
                        <li>Click "Get API Key"</li>
                        <li>Add it to <code>js/config.js</code> as GEMINI_API_KEY</li>
                    </ol>
                    <p><strong>Option 2 - Anthropic Claude:</strong></p>
                    <ol style="margin: 15px 0; padding-left: 25px;">
                        <li>Visit <a href="https://console.anthropic.com/" target="_blank" style="color: #667eea;">console.anthropic.com</a></li>
                        <li>Sign up for a free account</li>
                        <li>Generate an API key</li>
                        <li>Add it to <code>js/config.js</code> as CLAUDE_API_KEY</li>
                    </ol>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeEssayFeedbackModal()">Close</button>
                </div>
            </div>
        `;
    } else if (status === 'success') {
        // Format the feedback content
        const formattedFeedback = formatFeedbackContent(content);
        modalContent = `
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>📝 Essay Feedback</h3>
                    <button class="modal-close" onclick="closeEssayFeedbackModal()">&times;</button>
                </div>
                <div class="modal-body" style="padding: 25px; line-height: 1.6;">
                    ${formattedFeedback}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="copyFeedbackToClipboard()">📋 Copy Feedback</button>
                    <button class="btn-primary" onclick="closeEssayFeedbackModal()">Close</button>
                </div>
            </div>
        `;
    }
    
    modal.innerHTML = modalContent;
    modal.classList.add('show');
    
    // Add spinner animation if not already in styles
    if (!document.getElementById('spinnerStyle')) {
        const style = document.createElement('style');
        style.id = 'spinnerStyle';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function formatFeedbackContent(content) {
    // Convert markdown-like formatting to HTML with better styling
    let formatted = content;
    
    // Headers with **Header:**
    formatted = formatted.replace(/\*\*([^*:]+):\*\*/g, '<h4 style="color: #002855; margin-top: 25px; margin-bottom: 10px; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">$1</h4>');
    
    // Bold text
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #002855;">$1</strong>');
    
    // Numbered lists
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li style="margin-bottom: 10px;">$1</li>');
    
    // Bullet points
    formatted = formatted.replace(/^[-*]\s+(.+)$/gm, '<li style="margin-bottom: 10px;">$1</li>');
    
    // Wrap consecutive list items
    formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, '<ul style="margin: 15px 0; padding-left: 25px; color: #333;">$&</ul>');
    
    // Paragraphs
    formatted = formatted.split('\n\n').map(para => {
        if (!para.trim()) return '';
        if (para.includes('<h4') || para.includes('<ul')) return para;
        return `<p style="margin-bottom: 15px; color: #333;">${para}</p>`;
    }).join('');
    
    return formatted;
}

function closeEssayFeedbackModal() {
    const modal = document.getElementById('essayFeedbackModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function copyFeedbackToClipboard() {
    const modal = document.getElementById('essayFeedbackModal');
    const feedbackText = modal.querySelector('.modal-body').innerText;
    
    navigator.clipboard.writeText(feedbackText).then(() => {
        alert('Feedback copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy feedback. Please select and copy manually.');
    });
}

// ===================================
// Essay Health Meter Functions
// ===================================

function calculateEssayHealth(feedback, essayContent, wordCount) {
    const feedbackLower = feedback.toLowerCase();
    
    // Initialize scores for different aspects
    let contentScore = 50; // Base score
    let structureScore = 50;
    let grammarScore = 50;
    let voiceScore = 50;
    
    // Content & Storytelling Analysis
    if (feedbackLower.includes('compelling') || feedbackLower.includes('strong story') || feedbackLower.includes('excellent details')) {
        contentScore += 30;
    } else if (feedbackLower.includes('weak story') || feedbackLower.includes('lacks detail') || feedbackLower.includes('vague')) {
        contentScore -= 20;
    }
    
    if (feedbackLower.includes('answers the prompt well') || feedbackLower.includes('effectively addresses')) {
        contentScore += 20;
    } else if (feedbackLower.includes('doesn\'t answer') || feedbackLower.includes('strays from prompt')) {
        contentScore -= 30;
    }
    
    // Structure & Organization Analysis
    if (feedbackLower.includes('well-organized') || feedbackLower.includes('smooth transitions') || feedbackLower.includes('flows well')) {
        structureScore += 30;
    } else if (feedbackLower.includes('disorganized') || feedbackLower.includes('abrupt transitions') || feedbackLower.includes('poor flow')) {
        structureScore -= 20;
    }
    
    if (feedbackLower.includes('strong opening') || feedbackLower.includes('compelling hook')) {
        structureScore += 20;
    } else if (feedbackLower.includes('weak opening') || feedbackLower.includes('needs a hook')) {
        structureScore -= 15;
    }
    
    // Grammar & Mechanics Analysis
    const grammarIssues = (feedbackLower.match(/grammar|spelling|punctuation|typo|error/g) || []).length;
    grammarScore -= grammarIssues * 10;
    
    if (feedbackLower.includes('well-written') || feedbackLower.includes('polished') || feedbackLower.includes('clean prose')) {
        grammarScore += 30;
    } else if (feedbackLower.includes('many errors') || feedbackLower.includes('needs editing')) {
        grammarScore -= 20;
    }
    
    // Voice & Authenticity Analysis
    if (feedbackLower.includes('authentic') || feedbackLower.includes('genuine voice') || feedbackLower.includes('personality shines')) {
        voiceScore += 30;
    } else if (feedbackLower.includes('generic') || feedbackLower.includes('cliché') || feedbackLower.includes('lacks personality')) {
        voiceScore -= 20;
    }
    
    if (feedbackLower.includes('unique perspective') || feedbackLower.includes('distinct voice')) {
        voiceScore += 20;
    }
    
    // Plagiarism & Originality Analysis
    let plagiarismScore = 85; // Base score (assume original)
    if (feedbackLower.includes('original') || feedbackLower.includes('unique') || feedbackLower.includes('personal')) {
        plagiarismScore = 100;
    } else if (feedbackLower.includes('cliché') || feedbackLower.includes('generic') || feedbackLower.includes('common phrase')) {
        plagiarismScore = 75;
    }
    if (feedbackLower.includes('plagiarism') || feedbackLower.includes('copied') || feedbackLower.includes('not original')) {
        plagiarismScore = 20;
    }
    if (feedbackLower.includes('authentic voice') || feedbackLower.includes('personal story')) {
        plagiarismScore = Math.min(100, plagiarismScore + 15);
    }
    
    // Word count factor
    let wordCountScore = 100;
    if (wordCount < 250) {
        wordCountScore = 40;
    } else if (wordCount < 400) {
        wordCountScore = 70;
    } else if (wordCount > 650) {
        wordCountScore = 80;
    } else if (wordCount >= 500 && wordCount <= 650) {
        wordCountScore = 100;
    }
    
    // Clamp scores between 0-100
    contentScore = Math.max(0, Math.min(100, contentScore));
    structureScore = Math.max(0, Math.min(100, structureScore));
    grammarScore = Math.max(0, Math.min(100, grammarScore));
    voiceScore = Math.max(0, Math.min(100, voiceScore));
    plagiarismScore = Math.max(0, Math.min(100, plagiarismScore));
    
    // Calculate overall score (weighted average)
    const overallScore = Math.round(
        (contentScore * 0.30) + 
        (structureScore * 0.20) + 
        (grammarScore * 0.15) + 
        (voiceScore * 0.15) +
        (plagiarismScore * 0.20)
    );
    
    // Return individual scores as percentages
    return {
        overall: overallScore,
        content: Math.round(contentScore),
        structure: Math.round(structureScore),
        grammar: Math.round(grammarScore),
        voice: Math.round(voiceScore),
        plagiarism: Math.round(plagiarismScore)
    };
}

function displayHealthMeter(healthScore) {
    const healthMeter = document.getElementById('essayHealthMeter');
    const healthMeterFill = document.getElementById('healthMeterFill');
    const healthScoreText = document.getElementById('healthScoreText');
    
    // Update indicators
    const contentIndicator = document.getElementById('healthIndicatorContent');
    const structureIndicator = document.getElementById('healthIndicatorStructure');
    const grammarIndicator = document.getElementById('healthIndicatorGrammar');
    const voiceIndicator = document.getElementById('healthIndicatorVoice');
    const plagiarismIndicator = document.getElementById('healthIndicatorPlagiarism');
    
    if (!healthMeter) return;
    
    // Store health score in dataset for later saving
    healthMeter.dataset.lastHealthScore = JSON.stringify(healthScore);
    
    // Show the health meter
    healthMeter.style.display = 'block';
    
    // Update overall score
    healthScoreText.textContent = `${healthScore.overall}%`;
    
    // Color code the score text
    if (healthScore.overall >= 80) {
        healthScoreText.style.background = '#d4edda';
        healthScoreText.style.color = '#155724';
    } else if (healthScore.overall >= 60) {
        healthScoreText.style.background = '#fff3cd';
        healthScoreText.style.color = '#856404';
    } else {
        healthScoreText.style.background = '#f8d7da';
        healthScoreText.style.color = '#721c24';
    }
    
    // Animate the health bar
    setTimeout(() => {
        healthMeterFill.style.width = `${healthScore.overall}%`;
    }, 100);
    
    // Update individual indicators
    updateIndicator(contentIndicator, healthScore.content, '📝 Content');
    updateIndicator(structureIndicator, healthScore.structure, '🏗️ Structure');
    updateIndicator(grammarIndicator, healthScore.grammar, '✍️ Grammar');
    updateIndicator(voiceIndicator, healthScore.voice, '🎭 Voice');
    updateIndicator(plagiarismIndicator, healthScore.plagiarism, '🔍 Originality');
}

function updateIndicator(element, score, label) {
    if (!element) return;
    
    const labelSpan = element.querySelector('.indicator-label');
    const scoreSpan = element.querySelector('.indicator-score');
    
    if (labelSpan) labelSpan.textContent = label;
    if (scoreSpan) scoreSpan.textContent = `${score}%`;
    
    element.classList.remove('good', 'medium', 'poor');
    
    if (score >= 75) {
        element.classList.add('good');
    } else if (score >= 50) {
        element.classList.add('medium');
    } else {
        element.classList.add('poor');
    }
}

// ===================================
// How to Use Section Toggle
// ===================================

function toggleHelpPopover(helpId) {
    const popover = document.getElementById(helpId + 'Popover');
    if (!popover) return;
    
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('helpOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'helpOverlay';
        overlay.className = 'help-popover-overlay';
        overlay.onclick = () => closeHelpPopover(helpId);
        document.body.appendChild(overlay);
    }
    
    // Show popover and overlay
    popover.style.display = 'block';
    overlay.style.display = 'block';
}

function closeHelpPopover(helpId) {
    const popover = document.getElementById(helpId + 'Popover');
    const overlay = document.getElementById('helpOverlay');
    
    if (popover) popover.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

// Close popover on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const popovers = document.querySelectorAll('.help-popover');
        const overlay = document.getElementById('helpOverlay');
        
        popovers.forEach(popover => {
            if (popover.style.display === 'block') {
                popover.style.display = 'none';
            }
        });
        
        if (overlay) overlay.style.display = 'none';
    }
});

function toggleHowToUse(sectionId) {
    const content = document.getElementById(sectionId + 'Content');
    const toggle = document.getElementById(sectionId + 'Toggle');
    
    if (!content || !toggle) return;
    
    const isCollapsed = content.classList.toggle('collapsed');
    toggle.classList.toggle('collapsed', isCollapsed);
    
    // Save state to Firestore
    const user = getCurrentUser();
    if (user) {
        saveHowToSectionState(sectionId, isCollapsed);
    }
}

// Initialize How to Use section state
async function initializeHowToUseState(sectionId) {
    const user = getCurrentUser();
    if (user) {
        const isCollapsed = await loadHowToSectionState(sectionId);
        if (isCollapsed) {
            const content = document.getElementById(sectionId + 'Content');
            const toggle = document.getElementById(sectionId + 'Toggle');
            if (content && toggle) {
                content.classList.add('collapsed');
                toggle.classList.add('collapsed');
            }
        }
    }
}

