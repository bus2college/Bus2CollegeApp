// ===================================
// My Colleges - AI-Powered Suggestions
// ===================================

let questionnaireData = {
    gpa: null,
    testType: 'SAT',
    testScore: null,
    statePreference: 'any',
    selectedState: null,
    interests: [],
    additionalPreferences: ''
};

let suggestedColleges = [];

// Main entry point when "+ Add College" is clicked
function addCollege() {
    // Expand the button
    const button = event.currentTarget;
    button.classList.add('expanded');
    
    const modal = document.getElementById('collegeSuggestionModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Close college suggestion modal
function closeCollegeSuggestionModal() {
    // Collapse all action buttons
    document.querySelectorAll('.action-icon-btn.expanded').forEach(btn => {
        btn.classList.remove('expanded');
    });
    
    const modal = document.getElementById('collegeSuggestionModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Start the college suggestion flow
function startCollegeSuggestionFlow() {
    closeCollegeSuggestionModal();
    
    // Get saved student info
    const user = getCurrentUser();
    let studentInfo = {};
    if (user) {
        const userDataKey = `bus2college_data_${user.id}`;
        const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
        studentInfo = userData.studentInfo || {};
    }
    
    // Pre-fill questionnaire data from student info if available
    questionnaireData = {
        gpa: studentInfo.gpa ? parseFloat(studentInfo.gpa) : null,
        testType: (studentInfo.sat && !studentInfo.act) ? 'SAT' : (studentInfo.act && !studentInfo.sat) ? 'ACT' : 'SAT',
        testScore: studentInfo.sat ? parseInt(studentInfo.sat) : (studentInfo.act ? parseInt(studentInfo.act) : null),
        statePreference: studentInfo.state ? 'instate' : 'any',
        selectedState: studentInfo.state || null,
        interests: studentInfo.interests ? studentInfo.interests.split(',').map(i => i.trim()) : [],
        additionalPreferences: ''
    };
    
    // Pre-fill form inputs from student info
    document.getElementById('gpaInput').value = studentInfo.gpa || '';
    
    // Pre-fill test scores
    if (studentInfo.sat) {
        document.getElementById('satInput').value = studentInfo.sat;
        document.querySelector('input[name="testType"][value="SAT"]').checked = true;
        document.getElementById('satScoreInput').style.display = 'block';
        document.getElementById('actScoreInput').style.display = 'none';
    } else if (studentInfo.act) {
        document.getElementById('actInput').value = studentInfo.act;
        document.querySelector('input[name="testType"][value="ACT"]').checked = true;
        document.getElementById('satScoreInput').style.display = 'none';
        document.getElementById('actScoreInput').style.display = 'block';
    } else {
        document.getElementById('satInput').value = '';
        document.getElementById('actInput').value = '';
        document.querySelector('input[name="testType"][value="SAT"]').checked = true;
        document.getElementById('satScoreInput').style.display = 'block';
        document.getElementById('actScoreInput').style.display = 'none';
    }
    
    // Pre-fill state preference
    if (studentInfo.state) {
        document.querySelector('input[name="statePreference"][value="instate"]').checked = true;
        document.getElementById('stateDropdownContainer').style.display = 'block';
        document.getElementById('stateSelect').value = studentInfo.state;
    } else {
        document.querySelector('input[name="statePreference"][value="any"]').checked = true;
        document.getElementById('stateDropdownContainer').style.display = 'none';
        document.getElementById('stateSelect').value = '';
    }
    
    // Pre-fill interests
    document.querySelectorAll('.interest-checkbox input[type="checkbox"]').forEach(cb => cb.checked = false);
    if (studentInfo.interests) {
        const interests = studentInfo.interests.split(',').map(i => i.trim());
        document.querySelectorAll('.interest-checkbox input[type="checkbox"]').forEach(cb => {
            if (interests.includes(cb.value)) {
                cb.checked = true;
            }
        });
    }
    document.getElementById('otherInterestsInput').value = '';
    document.getElementById('additionalPrefsInput').value = '';
    
    // Show first question
    showQuestion(1);
    
    const modal = document.getElementById('collegeQuestionnaireModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Show specific question
function showQuestion(questionNumber) {
    // Hide all questions
    document.querySelectorAll('.question-slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show requested question
    const questionSlide = document.getElementById(`question${questionNumber}`);
    if (questionSlide) {
        questionSlide.classList.add('active');
    }
}

// Navigate to next question
function nextQuestion(currentQuestion) {
    // Validate current question
    if (currentQuestion === 1) {
        const gpa = parseFloat(document.getElementById('gpaInput').value);
        if (!gpa || gpa < 0 || gpa > 4.0) {
            alert('Please enter a valid GPA between 0.0 and 4.0');
            return;
        }
        questionnaireData.gpa = gpa;
    } else if (currentQuestion === 2) {
        const testType = document.querySelector('input[name="testType"]:checked').value;
        questionnaireData.testType = testType;
        
        if (testType === 'SAT') {
            const sat = parseInt(document.getElementById('satInput').value);
            if (!sat || sat < 400 || sat > 1600) {
                alert('Please enter a valid SAT score between 400 and 1600');
                return;
            }
            questionnaireData.testScore = sat;
        } else {
            const act = parseInt(document.getElementById('actInput').value);
            if (!act || act < 1 || act > 36) {
                alert('Please enter a valid ACT score between 1 and 36');
                return;
            }
            questionnaireData.testScore = act;
        }
    } else if (currentQuestion === 3) {
        const statePreference = document.querySelector('input[name="statePreference"]:checked').value;
        questionnaireData.statePreference = statePreference;
        
        if (statePreference === 'instate') {
            const selectedState = document.getElementById('stateSelect').value;
            if (!selectedState) {
                alert('Please select your state');
                return;
            }
            questionnaireData.selectedState = selectedState;
        }
    } else if (currentQuestion === 4) {
        // Interests validation happens in submitQuestionnaire
        // Just allow navigation
    }
    
    // Show next question
    showQuestion(currentQuestion + 1);
}

// Navigate to previous question
function previousQuestion(currentQuestion) {
    showQuestion(currentQuestion - 1);
}

// Toggle between SAT and ACT score inputs
function showTestScoreInput(testType) {
    const satInput = document.getElementById('satScoreInput');
    const actInput = document.getElementById('actScoreInput');
    
    if (testType === 'SAT') {
        satInput.style.display = 'block';
        actInput.style.display = 'none';
        document.getElementById('actInput').value = '';
    } else {
        satInput.style.display = 'none';
        actInput.style.display = 'block';
        document.getElementById('satInput').value = '';
    }
}

// Show state dropdown when in-state preference is selected
function showStateDropdown() {
    document.getElementById('stateDropdownContainer').style.display = 'block';
}

// Hide state dropdown when any state preference is selected
function hideStateDropdown() {
    document.getElementById('stateDropdownContainer').style.display = 'none';
    document.getElementById('stateSelect').value = '';
}

// Submit questionnaire and search for colleges
async function submitQuestionnaire() {
    // Collect interests
    const selectedInterests = [];
    document.querySelectorAll('.interest-checkbox input[type="checkbox"]:checked').forEach(cb => {
        selectedInterests.push(cb.value);
    });
    
    const otherInterests = document.getElementById('otherInterestsInput').value.trim();
    if (otherInterests) {
        selectedInterests.push(otherInterests);
    }
    
    if (selectedInterests.length === 0) {
        alert('Please select at least one field of interest');
        return;
    }
    
    questionnaireData.interests = selectedInterests;
    questionnaireData.additionalPreferences = document.getElementById('additionalPrefsInput').value.trim();
    
    // Show loading state
    document.querySelectorAll('.question-slide').forEach(slide => {
        slide.classList.remove('active');
    });
    document.getElementById('loadingSlide').classList.add('active');
    
    // Search for colleges using AI
    await searchCollegesWithAI();
}

// Search for colleges using Claude AI
async function searchCollegesWithAI() {
    try {
        // Check if API key is configured
        if (typeof CONFIG === 'undefined' || !CONFIG.CLAUDE_API_KEY || CONFIG.CLAUDE_API_KEY === 'your-api-key-here') {
            // Use fallback colleges if no API key
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            generateFallbackColleges();
            displayCollegeResults();
            return;
        }
        
        const prompt = `You are a college admissions counselor. Based on the following student profile, suggest exactly 9 colleges (3 safety, 3 target, and 3 reach schools):

Student Profile:
- GPA: ${questionnaireData.gpa}/4.0
- Test Score: ${questionnaireData.testType} ${questionnaireData.testScore}
- Fields of Interest: ${questionnaireData.interests.join(', ')}
${questionnaireData.statePreference === 'instate' ? `- Location Preference: In-state only (${questionnaireData.selectedState})` : '- Location Preference: Any state'}
${questionnaireData.additionalPreferences ? `- Additional Preferences: ${questionnaireData.additionalPreferences}` : ''}

${questionnaireData.statePreference === 'instate' ? `IMPORTANT: Only suggest colleges located in ${questionnaireData.selectedState}.` : ''}

For each college, provide:
1. College name
2. Location (City, State)
3. Type (Safety/Target/Reach)
4. Why it's a good fit (1 sentence)
5. Acceptance rate (approximate %)
6. Average ${questionnaireData.testType} range

Format your response as a JSON array with this structure:
[
  {
    "name": "College Name",
    "location": "City, State",
    "type": "Safety",
    "fit": "Brief explanation",
    "acceptanceRate": "XX%",
    "satRange": "XXX-XXX"
  }
]

Provide realistic, well-known colleges that match this profile. Be accurate with acceptance rates and ${questionnaireData.testType} ranges.`;

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
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('API call failed');
        }
        
        const data = await response.json();
        const aiResponse = data.content[0].text;
        
        // Extract JSON from response
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            suggestedColleges = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('Could not parse AI response');
        }
        
        displayCollegeResults();
        
    } catch (error) {
        console.error('Error searching for colleges:', error);
        // Fallback to predefined colleges
        generateFallbackColleges();
        displayCollegeResults();
    }
}

// Generate fallback colleges based on profile
function generateFallbackColleges() {
    const gpa = questionnaireData.gpa;
    const testScore = questionnaireData.testScore;
    const testType = questionnaireData.testType;
    const interests = questionnaireData.interests;
    const statePreference = questionnaireData.statePreference;
    const selectedState = questionnaireData.selectedState;
    
    // Convert ACT to SAT equivalent for comparison (approximate)
    const satEquivalent = testType === 'ACT' ? convertACTtoSAT(testScore) : testScore;
    
    // Determine if STEM-focused
    const stemInterests = ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Life Sciences'];
    const isSTEM = interests.some(interest => stemInterests.includes(interest));
    
    // Base colleges by tier (can be customized based on profile)
    let safetySchools, targetSchools, reachSchools;
    
    if (gpa >= 3.7 && satEquivalent >= 1400) {
        // High achieving student
        safetySchools = isSTEM ? [
            { name: "University of Washington", location: "Seattle, WA", satRange: "1220-1470", acceptanceRate: "53%", acceptanceValue: 53, fit: "Strong engineering programs with excellent research opportunities" },
            { name: "Purdue University", location: "West Lafayette, IN", satRange: "1190-1440", acceptanceRate: "59%", acceptanceValue: 59, fit: "Top-ranked engineering school with great industry connections" },
            { name: "University of Wisconsin-Madison", location: "Madison, WI", satRange: "1340-1500", acceptanceRate: "54%", acceptanceValue: 54, fit: "Excellent computer science program and vibrant campus life" }
        ] : [
            { name: "Boston University", location: "Boston, MA", satRange: "1350-1500", acceptanceRate: "18%", acceptanceValue: 18, fit: "Strong liberal arts with diverse academic programs" },
            { name: "University of Michigan", location: "Ann Arbor, MI", satRange: "1340-1530", acceptanceRate: "23%", acceptanceValue: 23, fit: "Top-tier public university with excellent resources" },
            { name: "University of North Carolina", location: "Chapel Hill, NC", satRange: "1300-1490", acceptanceRate: "20%", acceptanceValue: 20, fit: "Strong programs across all disciplines with great campus culture" }
        ];
        
        targetSchools = isSTEM ? [
            { name: "Georgia Tech", location: "Atlanta, GA", satRange: "1370-1530", acceptanceRate: "17%", acceptanceValue: 17, fit: "Premier technology institute with outstanding co-op program" },
            { name: "Carnegie Mellon University", location: "Pittsburgh, PA", satRange: "1460-1560", acceptanceRate: "14%", acceptanceValue: 14, fit: "World-class computer science and engineering programs" },
            { name: "UC Berkeley", location: "Berkeley, CA", satRange: "1330-1530", acceptanceRate: "14%", acceptanceValue: 14, fit: "Leading research university in STEM fields" }
        ] : [
            { name: "Northwestern University", location: "Evanston, IL", satRange: "1440-1550", acceptanceRate: "7%", acceptanceValue: 7, fit: "Top-ranked programs with interdisciplinary opportunities" },
            { name: "Emory University", location: "Atlanta, GA", satRange: "1400-1540", acceptanceRate: "11%", acceptanceValue: 11, fit: "Strong liberal arts with excellent pre-professional programs" },
            { name: "University of Southern California", location: "Los Angeles, CA", satRange: "1360-1530", acceptanceRate: "12%", acceptanceValue: 12, fit: "Diverse programs with strong alumni network" }
        ];
        
        reachSchools = isSTEM ? [
            { name: "MIT", location: "Cambridge, MA", satRange: "1520-1580", acceptanceRate: "4%", acceptanceValue: 4, fit: "World's leading technology institute with cutting-edge research" },
            { name: "Stanford University", location: "Stanford, CA", satRange: "1470-1570", acceptanceRate: "4%", acceptanceValue: 4, fit: "Top-tier engineering and computer science in Silicon Valley" },
            { name: "California Institute of Technology", location: "Pasadena, CA", satRange: "1530-1580", acceptanceRate: "3%", acceptanceValue: 3, fit: "Elite science and engineering focused institution" }
        ] : [
            { name: "Harvard University", location: "Cambridge, MA", satRange: "1460-1580", acceptanceRate: "3%", acceptanceValue: 3, fit: "Ivy League excellence with unmatched resources and opportunities" },
            { name: "Yale University", location: "New Haven, CT", satRange: "1460-1580", acceptanceRate: "5%", acceptanceValue: 5, fit: "Outstanding liberal arts education with strong residential college system" },
            { name: "Princeton University", location: "Princeton, NJ", satRange: "1450-1570", acceptanceRate: "4%", acceptanceValue: 4, fit: "Premier undergraduate focus with exceptional faculty mentorship" }
        ];
    } else if (gpa >= 3.3 && satEquivalent >= 1200) {
        // Above average student
        safetySchools = [
            { name: "Arizona State University", location: "Tempe, AZ", satRange: "1120-1360", acceptanceRate: "88%", acceptanceValue: 88, fit: "Large research university with innovative programs" },
            { name: "University of Oregon", location: "Eugene, OR", satRange: "1090-1310", acceptanceRate: "86%", acceptanceValue: 86, fit: "Strong programs with beautiful Pacific Northwest campus" },
            { name: "Ohio State University", location: "Columbus, OH", satRange: "1240-1450", acceptanceRate: "53%", acceptanceValue: 53, fit: "Comprehensive programs with Big Ten experience" }
        ];
        
        targetSchools = [
            { name: "Penn State University", location: "University Park, PA", satRange: "1190-1400", acceptanceRate: "55%", acceptanceValue: 55, fit: "Strong academic reputation with excellent career services" },
            { name: "University of Florida", location: "Gainesville, FL", satRange: "1300-1470", acceptanceRate: "23%", acceptanceValue: 23, fit: "Top public university with diverse opportunities" },
            { name: "University of Texas at Austin", location: "Austin, TX", satRange: "1230-1480", acceptanceRate: "31%", acceptanceValue: 31, fit: "Excellent programs in growing tech hub" }
        ];
        
        reachSchools = [
            { name: "University of Michigan", location: "Ann Arbor, MI", satRange: "1340-1530", acceptanceRate: "23%", acceptanceValue: 23, fit: "Top-tier public university with exceptional resources" },
            { name: "University of Virginia", location: "Charlottesville, VA", satRange: "1340-1520", acceptanceRate: "21%", acceptanceValue: 21, fit: "Premier public institution with strong academics" },
            { name: "University of California, Los Angeles", location: "Los Angeles, CA", satRange: "1290-1520", acceptanceRate: "11%", acceptanceValue: 11, fit: "Leading public university with diverse opportunities" }
        ];
    } else {
        // Average to solid student
        safetySchools = [
            { name: "University of Arizona", location: "Tucson, AZ", satRange: "1120-1370", acceptanceRate: "87%", acceptanceValue: 87, fit: "Strong programs with affordable tuition" },
            { name: "University of Alabama", location: "Tuscaloosa, AL", satRange: "1060-1280", acceptanceRate: "80%", acceptanceValue: 80, fit: "Growing academic programs with generous merit aid" },
            { name: "Iowa State University", location: "Ames, IA", satRange: "1040-1300", acceptanceRate: "90%", acceptanceValue: 90, fit: "Strong STEM programs with welcoming community" }
        ];
        
        targetSchools = [
            { name: "Temple University", location: "Philadelphia, PA", satRange: "1080-1300", acceptanceRate: "80%", acceptanceValue: 80, fit: "Urban campus with diverse program offerings" },
            { name: "University of Colorado Boulder", location: "Boulder, CO", satRange: "1170-1400", acceptanceRate: "81%", acceptanceValue: 81, fit: "Beautiful campus with growing academic reputation" },
            { name: "Michigan State University", location: "East Lansing, MI", satRange: "1100-1340", acceptanceRate: "88%", acceptanceValue: 88, fit: "Large research university with many opportunities" }
        ];
        
        reachSchools = [
            { name: "University of Washington", location: "Seattle, WA", satRange: "1220-1470", acceptanceRate: "53%", acceptanceValue: 53, fit: "Top public university in thriving tech city" },
            { name: "University of Wisconsin-Madison", location: "Madison, WI", satRange: "1340-1500", acceptanceRate: "54%", acceptanceValue: 54, fit: "Excellent academics with vibrant campus culture" },
            { name: "Ohio State University", location: "Columbus, OH", satRange: "1240-1450", acceptanceRate: "53%", acceptanceValue: 53, fit: "Strong programs with extensive resources" }
        ];
    }
    
    suggestedColleges = [
        ...safetySchools.map(c => ({ ...c, type: "Safety" })),
        ...targetSchools.map(c => ({ ...c, type: "Target" })),
        ...reachSchools.map(c => ({ ...c, type: "Reach" }))
    ];
    
    // Filter by state if in-state preference - use the database for more options
    if (statePreference === 'instate' && selectedState) {
        // First filter the generated list
        suggestedColleges = suggestedColleges.filter(college => {
            return college.location.includes(`, ${selectedState}`);
        });
        
        // If we don't have enough colleges, supplement from database
        if (suggestedColleges.length < 9) {
            console.log(`Found ${suggestedColleges.length} colleges in hardcoded list. Searching database for more ${selectedState} colleges...`);
            
            const stateColleges = getCollegesByState(selectedState);
            
            // Add colleges from database that aren't already in the list
            const existingNames = new Set(suggestedColleges.map(c => c.name));
            
            stateColleges.forEach(dbCollege => {
                if (!existingNames.has(dbCollege.name) && suggestedColleges.length < 9) {
                    // Determine type based on profile
                    let type = 'Target';
                    const safetyCount = suggestedColleges.filter(c => c.type === 'Safety').length;
                    const targetCount = suggestedColleges.filter(c => c.type === 'Target').length;
                    const reachCount = suggestedColleges.filter(c => c.type === 'Reach').length;
                    
                    if (safetyCount < 3) type = 'Safety';
                    else if (reachCount < 3) type = 'Reach';
                    
                    suggestedColleges.push({
                        name: dbCollege.name,
                        location: dbCollege.location,
                        type: type,
                        acceptanceRate: 'Varies',
                        acceptanceValue: 50, // Default middle value for sorting
                        satRange: 'Check website',
                        fit: `Located in ${selectedState} as per your preference`
                    });
                    
                    existingNames.add(dbCollege.name);
                }
            });
            
            console.log(`Total colleges after database supplement: ${suggestedColleges.length}`);
        }
    }
    
    // Sort colleges within each category by acceptance rate (higher = better chance)
    // Then limit to top 3 per category
    const sortByAdmissionProbability = (a, b) => {
        const aValue = a.acceptanceValue || parseFloat(a.acceptanceRate) || 50;
        const bValue = b.acceptanceValue || parseFloat(b.acceptanceRate) || 50;
        return bValue - aValue; // Higher acceptance rate = higher probability
    };
    
    const safety = suggestedColleges.filter(c => c.type === 'Safety').sort(sortByAdmissionProbability).slice(0, 3);
    const target = suggestedColleges.filter(c => c.type === 'Target').sort(sortByAdmissionProbability).slice(0, 3);
    const reach = suggestedColleges.filter(c => c.type === 'Reach').sort(sortByAdmissionProbability).slice(0, 3);
    
    suggestedColleges = [...safety, ...target, ...reach];
    
    console.log('Final sorted colleges:', {
        safety: safety.map(c => `${c.name} (${c.acceptanceRate})`),
        target: target.map(c => `${c.name} (${c.acceptanceRate})`),
        reach: reach.map(c => `${c.name} (${c.acceptanceRate})`)
    });
}

// Convert ACT score to SAT equivalent (approximate conversion)
function convertACTtoSAT(actScore) {
    const conversionTable = {
        36: 1600, 35: 1560, 34: 1520, 33: 1480, 32: 1450,
        31: 1420, 30: 1390, 29: 1360, 28: 1330, 27: 1300,
        26: 1270, 25: 1240, 24: 1210, 23: 1180, 22: 1150,
        21: 1120, 20: 1090, 19: 1060, 18: 1030, 17: 1000,
        16: 970, 15: 940, 14: 910, 13: 880, 12: 850,
        11: 820, 10: 790, 9: 760
    };
    return conversionTable[actScore] || 1000;
}

// Display college results
function displayCollegeResults() {
    closeCollegeQuestionnaireModal();
    
    const container = document.getElementById('collegeResultsContainer');
    
    // Check if we have any colleges
    if (!suggestedColleges || suggestedColleges.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3 style="color: var(--navy-blue); margin-bottom: 15px;">No colleges found</h3>
                <p style="color: #666;">Please try adjusting your search criteria or add colleges manually.</p>
            </div>
        `;
        const modal = document.getElementById('collegeResultsModal');
        if (modal) {
            modal.classList.add('show');
        }
        return;
    }
    
    // Group by type
    const safety = suggestedColleges.filter(c => c.type === 'Safety');
    const target = suggestedColleges.filter(c => c.type === 'Target');
    const reach = suggestedColleges.filter(c => c.type === 'Reach');
    
    console.log('College breakdown:', { 
        total: suggestedColleges.length, 
        safety: safety.length, 
        target: target.length, 
        reach: reach.length,
        sample: suggestedColleges[0]
    });
    
    container.innerHTML = `
        <div class="colleges-list-grid">
            <div class="colleges-column safety-column">
                <h3 class="column-header safety-header">🛡️ Safety Schools</h3>
                <div class="colleges-column-content">
                    ${safety.length > 0 
                        ? safety.map((college, index) => createCollegeCard(college, index)).join('')
                        : '<p class="empty-column">No safety schools match your profile</p>'
                    }
                </div>
            </div>
            <div class="colleges-column target-column">
                <h3 class="column-header target-header">🎯 Target Schools</h3>
                <div class="colleges-column-content">
                    ${target.length > 0 
                        ? target.map((college, index) => createCollegeCard(college, index)).join('')
                        : '<p class="empty-column">No target schools match your profile</p>'
                    }
                </div>
            </div>
            <div class="colleges-column reach-column">
                <h3 class="column-header reach-header">🚀 Reach Schools</h3>
                <div class="colleges-column-content">
                    ${reach.length > 0 
                        ? reach.map((college, index) => createCollegeCard(college, index)).join('')
                        : '<p class="empty-column">No reach schools match your profile</p>'
                    }
                </div>
            </div>
        </div>
    `;
    
    // Show results modal
    const modal = document.getElementById('collegeResultsModal');
    if (modal) {
        modal.classList.add('show');
    }
}



// Create college card HTML
function createCollegeCard(college, index) {
    // Use college name as unique identifier (encoded for use in IDs)
    const collegeId = college.name.replace(/[^a-zA-Z0-9]/g, '_');
    const collegeURL = typeof getCollegeURL === 'function' ? getCollegeURL(college.name) : `https://www.google.com/search?q=${encodeURIComponent(college.name)}`;
    
    return `
        <div class="college-card" onclick="toggleCollegeSelection('${collegeId}', this)">
            <div class="college-card-header">
                <div class="college-checkbox">
                    <input type="checkbox" id="college_${collegeId}" data-college-name="${college.name.replace(/"/g, '&quot;')}" onclick="event.stopPropagation();">
                </div>
                <div class="college-info">
                    <div class="college-name"><a href="${collegeURL}" target="_blank" class="college-link" onclick="event.stopPropagation();">${college.name}</a></div>
                    <div class="college-meta">
                        <span>📍 ${college.location}</span>
                        <span><strong>Acceptance:</strong> ${college.acceptanceRate}</span>
                        <span><strong>SAT Range:</strong> ${college.satRange}</span>
                    </div>
                </div>
            </div>
            ${college.fit ? `<p style="margin-top: 10px; font-size: 13px; color: #666; line-height: 1.4;">💡 ${college.fit}</p>` : ''}
        </div>
    `;
}

// Toggle college selection
function toggleCollegeSelection(collegeId, cardElement) {
    const checkbox = document.getElementById(`college_${collegeId}`);
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        cardElement.classList.add('selected');
    } else {
        cardElement.classList.remove('selected');
    }
}

// Add selected colleges to My Colleges list
function addSelectedColleges() {
    const selectedColleges = [];
    
    // Get all checked checkboxes
    const checkboxes = document.querySelectorAll('.college-card input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        const collegeName = checkbox.getAttribute('data-college-name');
        const college = suggestedColleges.find(c => c.name === collegeName);
        
        if (college) {
            // Try to get deadline from database
            const collegeData = getCollegeByName(collegeName);
            const deadline = collegeData && collegeData.regularDeadline 
                ? formatDeadline(collegeData.regularDeadline) 
                : null;
            const earlyDeadline = collegeData && collegeData.earlyDeadline
                ? formatDeadline(collegeData.earlyDeadline)
                : null;
            
            selectedColleges.push({
                name: college.name,
                location: college.location,
                type: college.type,
                acceptanceRate: college.acceptanceRate,
                satRange: college.satRange,
                status: 'Not Started',
                deadline: deadline,
                earlyDeadline: earlyDeadline,
                deadlineType: earlyDeadline ? 'Early Decision/Action' : 'Regular Decision',
                addedDate: new Date().toISOString()
            });
        }
    });
    
    if (selectedColleges.length === 0) {
        alert('Please select at least one college to add to your list.');
        return;
    }
    
    // Save to user data
    const user = getCurrentUser();
    if (user) {
        const userDataKey = `bus2college_data_${user.id}`;
        const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
        
        if (!userData.colleges) {
            userData.colleges = [];
        }
        
        // Check for duplicates and only add new colleges
        const existingNames = new Set(userData.colleges.map(c => c.name));
        const newColleges = selectedColleges.filter(c => !existingNames.has(c.name));
        const duplicates = selectedColleges.length - newColleges.length;
        
        if (newColleges.length === 0) {
            alert('All selected colleges are already in your list!');
            return;
        }
        
        userData.colleges.push(...newColleges);
        localStorage.setItem(userDataKey, JSON.stringify(userData));
        
        // Reload colleges list
        loadCollegesList(userData.colleges);
        
        closeCollegeResultsModal();
        
        let message = `Successfully added ${newColleges.length} college(s) to your list!`;
        if (duplicates > 0) {
            message += ` (${duplicates} duplicate${duplicates > 1 ? 's' : ''} skipped)`;
        }
        alert(message);
    }
}

// Close modals
function closeCollegeQuestionnaireModal() {
    const modal = document.getElementById('collegeQuestionnaireModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function closeCollegeResultsModal() {
    const modal = document.getElementById('collegeResultsModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Show manual college entry
function showManualCollegeEntry() {
    closeCollegeSuggestionModal();
    const modal = document.getElementById('manualCollegeModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeManualCollegeModal() {
    const modal = document.getElementById('manualCollegeModal');
    if (modal) {
        modal.classList.remove('show');
    }
    document.getElementById('manualCollegeForm').reset();
    document.getElementById('collegeDropdown').style.display = 'none';
    document.getElementById('collegeName').value = '';
    document.getElementById('collegeNameSearch').value = '';
}

// College search dropdown functionality
let selectedCollegeData = null;

function showCollegeDropdown() {
    filterColleges();
}

function filterColleges() {
    const searchInput = document.getElementById('collegeNameSearch');
    const dropdown = document.getElementById('collegeDropdown');
    const query = searchInput.value.trim();
    
    if (!query) {
        // Show all colleges if no search query
        const allColleges = COLLEGE_DATABASE.slice(0, 50); // Show first 50
        displayCollegeDropdown(allColleges);
        return;
    }
    
    // Search colleges
    const results = searchColleges(query);
    displayCollegeDropdown(results.slice(0, 50)); // Limit to 50 results
}

function displayCollegeDropdown(colleges) {
    const dropdown = document.getElementById('collegeDropdown');
    
    if (colleges.length === 0) {
        dropdown.innerHTML = '<div class="college-dropdown-empty">No colleges found. Try a different search term.</div>';
        dropdown.style.display = 'block';
        return;
    }
    
    dropdown.innerHTML = colleges.map(college => `
        <div class="college-dropdown-item" onclick="selectCollege('${college.name.replace(/'/g, "\\'")}')">
            <div class="college-dropdown-item-name">${college.name}</div>
            <div class="college-dropdown-item-location">${college.location}</div>
        </div>
    `).join('');
    
    dropdown.style.display = 'block';
}

function selectCollege(collegeName) {
    const college = getCollegeByName(collegeName);
    
    if (college) {
        selectedCollegeData = college;
        
        // Update form fields
        document.getElementById('collegeNameSearch').value = college.name;
        document.getElementById('collegeName').value = college.name;
        document.getElementById('collegeLocation').value = college.location;
        
        // Auto-fill deadline based on type
        updateDeadlineBasedOnType();
        
        // Hide dropdown
        document.getElementById('collegeDropdown').style.display = 'none';
    }
}

function updateDeadlineBasedOnType() {
    if (!selectedCollegeData) return;
    
    const deadlineType = document.getElementById('deadlineType').value;
    const deadlineInput = document.getElementById('applicationDeadline');
    
    let deadline = null;
    
    if (deadlineType === 'early' && selectedCollegeData.earlyDeadline) {
        deadline = formatDeadline(selectedCollegeData.earlyDeadline);
    } else if (deadlineType === 'regular' && selectedCollegeData.regularDeadline) {
        deadline = formatDeadline(selectedCollegeData.regularDeadline);
    }
    
    if (deadline) {
        deadlineInput.value = deadline;
        deadlineInput.readOnly = true;
    } else {
        deadlineInput.value = '';
        deadlineInput.readOnly = false;
    }
    
    // If custom is selected, allow manual entry
    if (deadlineType === 'custom') {
        deadlineInput.value = '';
        deadlineInput.readOnly = false;
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('collegeDropdown');
    const searchInput = document.getElementById('collegeNameSearch');
    
    if (dropdown && searchInput && 
        !dropdown.contains(event.target) && 
        event.target !== searchInput) {
        dropdown.style.display = 'none';
    }
});

// Save manually entered college
function saveManualCollege(event) {
    event.preventDefault();
    
    const collegeName = document.getElementById('collegeName').value.trim();
    
    if (!collegeName) {
        alert('Please select a college from the dropdown');
        return false;
    }
    
    const deadline = document.getElementById('applicationDeadline').value || null;
    
    const college = {
        name: collegeName,
        location: document.getElementById('collegeLocation').value.trim(),
        type: document.getElementById('collegeType').value,
        deadline: deadline,
        status: document.getElementById('applicationStatus').value,
        addedDate: new Date().toISOString()
    };
    
    // Save to user data
    const user = getCurrentUser();
    if (user) {
        const userDataKey = `bus2college_data_${user.id}`;
        const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
        
        if (!userData.colleges) {
            userData.colleges = [];
        }
        
        // Check for duplicate
        const existingCollege = userData.colleges.find(c => c.name === collegeName);
        if (existingCollege) {
            alert(`${collegeName} is already in your list!`);
            return false;
        }
        
        userData.colleges.push(college);
        localStorage.setItem(userDataKey, JSON.stringify(userData));
        
        // Reload colleges list
        loadCollegesList(userData.colleges);
        
        closeManualCollegeModal();
        
        alert(`Successfully added ${college.name} to your list!`);
    }
    
    return false;
}

// Load and display colleges list
function loadCollegesList(colleges) {
    const container = document.getElementById('collegesList');
    if (!container) return;
    
    if (!colleges || colleges.length === 0) {
        container.innerHTML = '<p class="empty-state">No colleges added yet. Click "Add College" to get started!</p>';
        return;
    }
    
    // Remove duplicates based on college name
    const uniqueColleges = [];
    const seenNames = new Set();
    
    colleges.forEach(college => {
        if (!seenNames.has(college.name)) {
            seenNames.add(college.name);
            uniqueColleges.push(college);
        }
    });
    
    // Group colleges by type
    const safetyColleges = uniqueColleges.filter(c => c.type === 'Safety');
    const targetColleges = uniqueColleges.filter(c => c.type === 'Target');
    const reachColleges = uniqueColleges.filter(c => c.type === 'Reach');
    
    container.innerHTML = `
        <div class="colleges-list-grid">
            <div class="colleges-column safety-column">
                <h3 class="column-header safety-header">🛡️ Safety Schools</h3>
                <div class="colleges-column-content">
                    ${safetyColleges.length > 0 
                        ? safetyColleges.map((college, index) => createCollegeListItem(college, colleges.indexOf(college))).join('')
                        : '<p class="empty-column">No safety schools added yet</p>'
                    }
                </div>
            </div>
            <div class="colleges-column target-column">
                <h3 class="column-header target-header">🎯 Target Schools</h3>
                <div class="colleges-column-content">
                    ${targetColleges.length > 0 
                        ? targetColleges.map((college, index) => createCollegeListItem(college, colleges.indexOf(college))).join('')
                        : '<p class="empty-column">No target schools added yet</p>'
                    }
                </div>
            </div>
            <div class="colleges-column reach-column">
                <h3 class="column-header reach-header">🚀 Reach Schools</h3>
                <div class="colleges-column-content">
                    ${reachColleges.length > 0 
                        ? reachColleges.map((college, index) => createCollegeListItem(college, colleges.indexOf(college))).join('')
                        : '<p class="empty-column">No reach schools added yet</p>'
                    }
                </div>
            </div>
        </div>
    `;
}

// Get application deadline from database for current academic year
function getApplicationDeadlineForCollege(collegeName, customDeadline) {
    // If user has set a custom deadline, use it
    if (customDeadline) {
        return { date: customDeadline, source: 'custom' };
    }
    
    // Try to find college in database
    const collegeData = getCollegeByName(collegeName);
    
    if (collegeData && collegeData.regularDeadline) {
        // Format deadline for current academic year
        const formattedDeadline = formatDeadline(collegeData.regularDeadline);
        return { 
            date: formattedDeadline, 
            source: 'database',
            early: collegeData.earlyDeadline ? formatDeadline(collegeData.earlyDeadline) : null
        };
    }
    
    return { date: null, source: 'none' };
}

// Create college list item HTML
function createCollegeListItem(college, index) {
    const deadlineInfo = getApplicationDeadlineForCollege(college.name, college.deadline);
    
    let deadlineText = 'Not set';
    let deadlineClass = 'deadline-not-set';
    let earlyDeadlineText = '';
    
    // Process early deadline
    if (deadlineInfo.early) {
        const earlyDate = new Date(deadlineInfo.early);
        const today = new Date();
        const daysUntilEarly = Math.ceil((earlyDate - today) / (1000 * 60 * 60 * 24));
        
        earlyDeadlineText = earlyDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        if (daysUntilEarly < 0) {
            earlyDeadlineText += ' (Passed)';
        } else if (daysUntilEarly <= 30) {
            earlyDeadlineText += ` (${daysUntilEarly} days)`;
        } else if (daysUntilEarly <= 60) {
            earlyDeadlineText += ` (${daysUntilEarly} days)`;
        }
    }
    
    // Process regular deadline
    if (deadlineInfo.date) {
        const deadlineDate = new Date(deadlineInfo.date);
        const today = new Date();
        const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        
        deadlineText = deadlineDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        // Add urgency indicator
        if (daysUntilDeadline < 0) {
            deadlineClass = 'deadline-passed';
            deadlineText += ' (Passed)';
        } else if (daysUntilDeadline <= 30) {
            deadlineClass = 'deadline-urgent';
            deadlineText += ` (${daysUntilDeadline} days)`;
        } else if (daysUntilDeadline <= 60) {
            deadlineClass = 'deadline-soon';
            deadlineText += ` (${daysUntilDeadline} days)`;
        }
        
        // Add source indicator
        if (deadlineInfo.source === 'database') {
            deadlineText += ' 📅';
        }
    }
    
    const statusClass = college.status ? college.status.toLowerCase().replace(' ', '-') : 'not-started';
    
    const collegeURL = typeof getCollegeURL === 'function' ? getCollegeURL(college.name) : `https://www.google.com/search?q=${encodeURIComponent(college.name)}`;
    
    // Check if college accepts Common App
    const dbCollege = typeof getCollegeByName === 'function' ? getCollegeByName(college.name) : null;
    const acceptsCA = dbCollege && dbCollege.commonApp === true;
    const commonAppURL = acceptsCA && typeof getCommonAppURL === 'function' ? getCommonAppURL(college.name) : null;
    
    // Determine deadline type to display
    let deadlineTypeLabel = '';
    if (college.deadlineType) {
        // Shorten deadline type labels
        const shortType = college.deadlineType.includes('Early Decision') ? 'ED' : 
                         college.deadlineType.includes('Early Action') ? 'EA' : 
                         college.deadlineType.includes('Regular') ? 'RD' : 
                         college.deadlineType;
        deadlineTypeLabel = ` <span class="deadline-type-badge">${shortType}</span>`;
    } else if (deadlineInfo.early && deadlineInfo.date) {
        deadlineTypeLabel = ' <span class="deadline-type-badge">ED/EA & RD</span>';
    } else if (deadlineInfo.early) {
        deadlineTypeLabel = ' <span class="deadline-type-badge">ED/EA</span>';
    } else if (deadlineInfo.date) {
        deadlineTypeLabel = ' <span class="deadline-type-badge">RD</span>';
    }
    
    // Add Common App badge
    const commonAppBadge = acceptsCA ? ` <span class="common-app-badge" title="Accepts Common Application"><span>🎓</span><span class="common-app-badge-label">Apply via Common App</span></span>` : '';
    
    return `
        <div class="college-item">
            <div class="college-item-header">
                <div class="college-item-title">
                    <div class="college-item-name">
                        <a href="${collegeURL}" target="_blank" class="college-link">${college.name}</a>${deadlineTypeLabel}
                    </div>
                    <div class="college-item-meta">
                        <span>📍 ${college.location || 'Location not specified'}</span>
                        <span><strong>Status:</strong> ${college.status || 'Not Started'}</span>
                        ${earlyDeadlineText ? `<span class="deadline-info"><strong>ED/EA:</strong> ${earlyDeadlineText}</span>` : ''}
                        ${deadlineInfo.date ? `<span class="${deadlineClass}"><strong>RD:</strong> ${deadlineText}</span>` : ''}
                    </div>
                </div>
                <div class="college-item-actions">
                    ${acceptsCA ? `<span class="common-app-badge" title="Accepts Common Application"><span>🎓</span><span class="common-app-badge-label">Apply via Common App</span></span>` : ''}
                    <button class="btn-icon btn-edit" onclick="editCollege(${index})" title="Edit"><span>✏️</span><span class="btn-icon-label">Edit</span></button>
                    <button class="btn-icon btn-delete" onclick="deleteCollege(${index})" title="Delete"><span>🗑️</span><span class="btn-icon-label">Delete</span></button>
                </div>
            </div>
            ${college.acceptanceRate ? `<div style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Acceptance:</strong> ${college.acceptanceRate} | <strong>SAT:</strong> ${college.satRange || 'N/A'}</div>` : ''}
        </div>
    `;
}

// Edit college
function editCollege(index) {
    const user = getCurrentUser();
    if (!user) return;
    
    const userDataKey = `bus2college_data_${user.id}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    
    if (!userData.colleges || !userData.colleges[index]) {
        alert('College not found');
        return;
    }
    
    const college = userData.colleges[index];
    
    // Populate edit form
    document.getElementById('editCollegeName').value = college.name;
    document.getElementById('editApplicationStatus').value = college.status || 'Not Started';
    document.getElementById('editCollegeIndex').value = index;
    
    // Get college from database to check available deadlines
    const dbCollege = getCollegeByName(college.name);
    const deadlineTypeDropdown = document.getElementById('editDeadlineType');
    
    // Clear existing options
    deadlineTypeDropdown.innerHTML = '';
    
    // Add options based on what the college offers
    if (dbCollege) {
        if (dbCollege.earlyDeadline) {
            const earlyOption = document.createElement('option');
            earlyOption.value = 'early';
            earlyOption.textContent = 'Early Decision/Action';
            deadlineTypeDropdown.appendChild(earlyOption);
        }
        if (dbCollege.regularDeadline) {
            const regularOption = document.createElement('option');
            regularOption.value = 'regular';
            regularOption.textContent = 'Regular Decision';
            deadlineTypeDropdown.appendChild(regularOption);
        }
    } else {
        // If college not in database, show both options
        const earlyOption = document.createElement('option');
        earlyOption.value = 'early';
        earlyOption.textContent = 'Early Decision/Action';
        deadlineTypeDropdown.appendChild(earlyOption);
        
        const regularOption = document.createElement('option');
        regularOption.value = 'regular';
        regularOption.textContent = 'Regular Decision';
        deadlineTypeDropdown.appendChild(regularOption);
    }
    
    // Set deadline type - map stored deadline type to dropdown value
    let selectedDeadlineType = 'regular'; // default
    if (college.deadlineType) {
        const deadlineTypeMap = {
            'ED': 'early',
            'EA': 'early',
            'RD': 'regular',
            'Early Decision': 'early',
            'Early Action': 'early',
            'Early Decision/Action': 'early',
            'Regular Decision': 'regular',
            'Custom': 'custom'
        };
        selectedDeadlineType = deadlineTypeMap[college.deadlineType] || 'regular';
    }
    
    // Check if the selected type is available, otherwise select the first available option
    const availableOptions = Array.from(deadlineTypeDropdown.options).map(opt => opt.value);
    if (availableOptions.includes(selectedDeadlineType)) {
        deadlineTypeDropdown.value = selectedDeadlineType;
    } else if (availableOptions.length > 0) {
        deadlineTypeDropdown.value = availableOptions[0];
        selectedDeadlineType = availableOptions[0];
    }
    
    // Set deadline date - use the stored deadline
    if (college.deadline) {
        const deadlineDate = new Date(college.deadline);
        const formattedDate = deadlineDate.toISOString().split('T')[0];
        document.getElementById('editApplicationDeadline').value = formattedDate;
    } else {
        // If no deadline stored, try to get from database based on deadline type
        if (dbCollege) {
            if (selectedDeadlineType === 'early' && dbCollege.earlyDeadline) {
                const earlyDate = new Date(dbCollege.earlyDeadline);
                document.getElementById('editApplicationDeadline').value = earlyDate.toISOString().split('T')[0];
            } else if (selectedDeadlineType === 'regular' && dbCollege.regularDeadline) {
                const regularDate = new Date(dbCollege.regularDeadline);
                document.getElementById('editApplicationDeadline').value = regularDate.toISOString().split('T')[0];
            } else {
                document.getElementById('editApplicationDeadline').value = '';
            }
        } else {
            document.getElementById('editApplicationDeadline').value = '';
        }
    }
    
    // Show modal
    const modal = document.getElementById('editCollegeModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeEditCollegeModal() {
    const modal = document.getElementById('editCollegeModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function updateEditDeadlineBasedOnType() {
    const deadlineType = document.getElementById('editDeadlineType').value;
    const collegeName = document.getElementById('editCollegeName').value;
    const deadlineInput = document.getElementById('editApplicationDeadline');
    
    if (deadlineType === 'custom') {
        // User will enter custom date
        return;
    }
    
    // Get college from database
    const dbCollege = getCollegeByName(collegeName);
    if (!dbCollege) return;
    
    // Set deadline based on type
    if (deadlineType === 'early' && dbCollege.earlyDeadline) {
        const earlyDate = new Date(dbCollege.earlyDeadline);
        deadlineInput.value = earlyDate.toISOString().split('T')[0];
    } else if (deadlineType === 'regular' && dbCollege.regularDeadline) {
        const regularDate = new Date(dbCollege.regularDeadline);
        deadlineInput.value = regularDate.toISOString().split('T')[0];
    }
}

function saveEditCollege(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) return false;
    
    const index = parseInt(document.getElementById('editCollegeIndex').value);
    const status = document.getElementById('editApplicationStatus').value;
    const deadlineType = document.getElementById('editDeadlineType').value;
    const deadline = document.getElementById('editApplicationDeadline').value;
    
    const userDataKey = `bus2college_data_${user.id}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    
    if (!userData.colleges || !userData.colleges[index]) {
        alert('College not found');
        return false;
    }
    
    // Update status, deadline type, and deadline
    userData.colleges[index].status = status;
    
    // Update deadline type label
    if (deadlineType === 'early') {
        userData.colleges[index].deadlineType = 'Early Decision/Action';
    } else if (deadlineType === 'regular') {
        userData.colleges[index].deadlineType = 'Regular Decision';
    }
    
    // Update deadline date
    if (deadline) {
        userData.colleges[index].deadline = deadline;
    }
    
    localStorage.setItem(userDataKey, JSON.stringify(userData));
    
    // Close modal and reload list
    closeEditCollegeModal();
    loadCollegesList(userData.colleges);
    
    return false;
}

// Delete college
function deleteCollege(index) {
    if (!confirm('Are you sure you want to remove this college from your list?')) {
        return;
    }
    
    const user = getCurrentUser();
    if (user) {
        const userDataKey = `bus2college_data_${user.id}`;
        const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
        
        if (userData.colleges && userData.colleges[index]) {
            userData.colleges.splice(index, 1);
            localStorage.setItem(userDataKey, JSON.stringify(userData));
            
            // Reload colleges list
            loadCollegesList(userData.colleges);
        }
    }
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        if (event.target.id === 'collegeSuggestionModal') {
            closeCollegeSuggestionModal();
        } else if (event.target.id === 'collegeQuestionnaireModal') {
            closeCollegeQuestionnaireModal();
        } else if (event.target.id === 'collegeResultsModal') {
            closeCollegeResultsModal();
        } else if (event.target.id === 'manualCollegeModal') {
            closeManualCollegeModal();
        }
    }
});
