// ==================================================================
// Common App Integration Module
// ==================================================================
// Provides integration with Common Application platform

// Save Common App Essay
function saveEssay(essayType) {
    const user = getCurrentUser();
    if (!user) {
        alert('Please log in to save your essay');
        return;
    }

    const userDataKey = `bus2college_data_${user.id}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');

    if (essayType === 'common-app') {
        // Get essay content from editor
        const essayEditor = document.getElementById('studentDraftEditor');
        const promptSelect = document.getElementById('commonAppPrompt');
        
        if (!essayEditor || !promptSelect) {
            alert('Error: Essay editor not found');
            return;
        }

        const essayContent = essayEditor.innerHTML;
        const selectedPrompt = parseInt(promptSelect.value);

        // Get word count
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = essayContent;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const wordCount = plainText.trim().split(/\s+/).filter(w => w.length > 0).length;

        // Save essay
        userData.commonAppEssay = {
            content: essayContent,
            prompt: selectedPrompt,
            wordCount: wordCount,
            lastModified: new Date().toISOString()
        };

        localStorage.setItem(userDataKey, JSON.stringify(userData));
        alert(`✅ Essay saved successfully!\n\nWord count: ${wordCount} words\nLast saved: ${new Date().toLocaleString()}`);
    }
}

// Load Common App Essay
function loadEssay() {
    const user = getCurrentUser();
    if (!user) return;

    const userDataKey = `bus2college_data_${user.id}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    const essay = userData.commonAppEssay;

    if (essay) {
        const essayEditor = document.getElementById('studentDraftEditor');
        const promptSelect = document.getElementById('commonAppPrompt');
        
        if (essayEditor && essay.content) {
            essayEditor.innerHTML = essay.content;
        }
        
        if (promptSelect && essay.prompt) {
            promptSelect.value = essay.prompt;
        }
    }
}

// Official Common App Essay Prompts (2024-2025)
function getCommonAppPrompts() {
    return [
        {
            short: "Prompt 1: Background, identity, interest, or talent",
            full: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story."
        },
        {
            short: "Prompt 2: Overcoming challenges",
            full: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?"
        },
        {
            short: "Prompt 3: Questioning or challenging a belief or idea",
            full: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?"
        },
        {
            short: "Prompt 4: Acknowledging or solving a problem",
            full: "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?"
        },
        {
            short: "Prompt 5: Personal growth or new understanding",
            full: "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others."
        },
        {
            short: "Prompt 6: Topic of such interest you lose track of time",
            full: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?"
        },
        {
            short: "Prompt 7: Topic of your choice",
            full: "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design."
        }
    ];
}

// Generate Common App college-specific URL
function getCommonAppURL(collegeName) {
    // Common App uses college codes - this is a simplified mapping
    // In production, this would connect to Common App's actual API
    const formattedName = collegeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `https://www.commonapp.org/explore/${formattedName}`;
}

// Check if college accepts Common App
function acceptsCommonApp(collegeName) {
    const college = getCollegeByName(collegeName);
    return college ? college.commonApp === true : false;
}

// Export college list to Common App format (CSV)
function exportToCommonAppFormat() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please log in to export your college list');
        return;
    }
    
    const userDataKey = `bus2college_data_${user.id}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    const colleges = userData.colleges || [];
    
    if (colleges.length === 0) {
        alert('No colleges to export. Please add colleges to your list first.');
        return;
    }
    
    // Filter only Common App colleges
    const commonAppColleges = colleges.filter(c => {
        const dbCollege = getCollegeByName(c.name);
        return dbCollege && dbCollege.commonApp === true;
    });
    
    if (commonAppColleges.length === 0) {
        alert('None of your colleges accept Common App.');
        return;
    }
    
    // Generate CSV content
    let csvContent = 'College Name,Location,Application Type,Deadline,Status,Common App URL\\n';
    
    commonAppColleges.forEach(college => {
        const deadlineInfo = getApplicationDeadlineForCollege(college.name, college.deadline);
        const deadlineDate = deadlineInfo.date || college.deadline || 'Not set';
        const commonAppURL = getCommonAppURL(college.name);
        
        csvContent += `"${college.name}","${college.location || ''}","${college.type || ''}","${deadlineDate}","${college.status || 'Not Started'}","${commonAppURL}"\\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `bus2college_commonapp_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Exported ${commonAppColleges.length} Common App colleges to CSV file!`);
}

// Export Common App essay
function exportCommonAppEssay() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    const user = getCurrentUser();
    if (!user) {
        alert('Please log in to export your essay');
        button.classList.remove('expanded');
        return;
    }
    
    const userDataKey = `bus2college_data_${user.id}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    const essay = userData.commonAppEssay || {};
    
    if (!essay.content || !essay.content.trim()) {
        alert('No Common App essay found. Please write your essay first.');
        button.classList.remove('expanded');
        return;
    }
    
    // Get word count from essay content (strip HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = essay.content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    const wordCount = plainText.trim().split(/\s+/).length;
    
    // Check word count is within Common App limits
    if (wordCount < 250 || wordCount > 650) {
        const proceed = confirm(`Warning: Your essay is ${wordCount} words. The Common App essay must be between 250-650 words. Do you want to continue exporting?`);
        if (!proceed) {
            button.classList.remove('expanded');
            return;
        }
    }
    
    // Get prompt text
    const prompts = getCommonAppPrompts();
    const promptText = prompts[essay.prompt - 1]?.full || 'Not specified';
    
    // Create formatted essay for Common App (plain text only)
    const essayContent = `COMMON APPLICATION ESSAY

Student: ${user.name}
Export Date: ${new Date().toLocaleDateString()}
Word Count: ${wordCount} words

SELECTED PROMPT:
${promptText}

-----------------------------------

${plainText}

-----------------------------------
Exported from Bus2College - Ready to paste into Common Application`;
    
    // Copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(plainText).then(() => {
            alert('✅ Essay copied to clipboard!\\n\\nYour essay is ready to paste into the Common Application. Simply:\\n1. Go to commonapp.org\\n2. Navigate to the Writing section\\n3. Paste your essay (Ctrl+V or Cmd+V)\\n\\nWord count: ' + wordCount + ' words');
        }).catch(err => {
            // Fallback to download if clipboard fails
            downloadEssay(essayContent, plainText);
        });
    } else {
        // Fallback to download if clipboard not available
        downloadEssay(essayContent, plainText);
    }
    
    // Collapse button after export
    button.classList.remove('expanded');
}

function downloadEssay(fullContent, plainText) {
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `commonapp_essay_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('✅ Essay exported and downloaded!\\n\\nYour essay file is ready. Open it and copy the essay text to paste into the Common Application at commonapp.org.');
}

// Import Common App essay (from file)
function importCommonAppEssay() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.doc,.docx';
    
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = event => {
            const content = event.target.result;
            
            // Extract essay content (skip metadata if present)
            let essayText = content;
            if (content.includes('-----------------------------------')) {
                essayText = content.split('-----------------------------------')[1].trim();
            }
            
            // Save to user data
            const user = getCurrentUser();
            if (user) {
                const userDataKey = `bus2college_data_${user.id}`;
                const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
                
                userData.commonAppEssay = {
                    ...userData.commonAppEssay,
                    content: essayText,
                    lastModified: new Date().toISOString(),
                    importedAt: new Date().toISOString()
                };
                
                localStorage.setItem(userDataKey, JSON.stringify(userData));
                
                // Update UI if on essay page
                const essayTextarea = document.getElementById('commonAppEssay');
                if (essayTextarea) {
                    essayTextarea.value = essayText;
                }
                
                alert('Essay imported successfully!');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Track Common App submission status
function updateCommonAppStatus(collegeName, status) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userDataKey = `bus2college_data_${user.id}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    const colleges = userData.colleges || [];
    
    const collegeIndex = colleges.findIndex(c => c.name === collegeName);
    if (collegeIndex !== -1) {
        if (!colleges[collegeIndex].commonAppStatus) {
            colleges[collegeIndex].commonAppStatus = {};
        }
        
        colleges[collegeIndex].commonAppStatus = {
            status: status,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(userDataKey, JSON.stringify(userData));
        return true;
    }
    
    return false;
}

// Get Common App statistics
function getCommonAppStats() {
    const user = getCurrentUser();
    if (!user) return null;
    
    const userDataKey = `bus2college_data_${user.id}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    const colleges = userData.colleges || [];
    
    const commonAppColleges = colleges.filter(c => {
        const dbCollege = getCollegeByName(c.name);
        return dbCollege && dbCollege.commonApp === true;
    });
    
    return {
        total: colleges.length,
        commonApp: commonAppColleges.length,
        nonCommonApp: colleges.length - commonAppColleges.length,
        percentage: colleges.length > 0 ? Math.round((commonAppColleges.length / colleges.length) * 100) : 0
    };
}

// Show Common App integration panel
function showCommonAppPanel() {
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    const modal = document.getElementById('commonAppIntegrationModal');
    if (modal) {
        // Update stats
        const stats = getCommonAppStats();
        if (stats) {
            document.getElementById('caStatsTotal').textContent = stats.commonApp;
            document.getElementById('caStatsPercentage').textContent = `${stats.percentage}%`;
        }
        
        modal.classList.add('show');
    }
}

function closeCommonAppPanel() {
    // Collapse all action buttons
    document.querySelectorAll('.action-icon-btn.expanded').forEach(btn => {
        btn.classList.remove('expanded');
    });
    
    const modal = document.getElementById('commonAppIntegrationModal');
    if (modal) {
        modal.classList.remove('show');
    }
}
