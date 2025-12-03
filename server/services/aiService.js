// ===========================================
// AI Service - Claude API Integration
// ===========================================

const axios = require('axios');
require('dotenv').config();

class AIService {
    constructor() {
        this.apiKey = process.env.ANTHROPIC_API_KEY;
        this.apiUrl = 'https://api.anthropic.com/v1/messages';
        this.model = 'claude-3-5-sonnet-20241022';
    }

    /**
     * Get AI-powered college suggestions
     */
    async getCollegeSuggestions(profile) {
        const { gpa, testScore, testType, interests, statePreference, financialAid, collegePreferences } = profile;

        const prompt = `You are a college admissions counselor. Based on the following student profile, suggest 10 colleges that would be a good fit. Categorize them into safety, target, and reach schools.

Student Profile:
- GPA: ${gpa || 'Not provided'}
- ${testType || 'Test'} Score: ${testScore || 'Not provided'}
- Academic Interests: ${interests || 'Not specified'}
- State Preference: ${statePreference || 'No preference'}
- Financial Aid Need: ${financialAid || 'Not specified'}
- College Preferences: ${collegePreferences || 'None specified'}

Please provide:
1. A brief overall assessment of the student's competitiveness
2. 3-4 Safety Schools (high probability of admission)
3. 3-4 Target Schools (moderate probability)
2-3 Reach Schools (lower probability but worth applying)

For each college, include:
- Name and location
- Why it's a good fit for this student
- Key strengths relevant to student's interests
- Estimated admission probability

Format your response in a clear, structured way.`;

        try {
            const response = await this.callClaudeAPI(prompt, 2000);
            return {
                success: true,
                suggestions: response,
                profile
            };
        } catch (error) {
            console.error('Error getting AI suggestions:', error.message);
            throw error;
        }
    }

    /**
     * AI chat for college questions
     */
    async chat(message, conversationHistory = []) {
        const systemPrompt = `You are a helpful college admissions counselor and mentor for high school students. You provide accurate, encouraging, and practical advice about:
- College admissions process
- Application strategies
- Essay writing tips
- Financial aid and scholarships
- Campus life and college selection
- Academic programs and majors
- Standardized testing
- Extracurricular activities

Always be supportive, honest, and specific in your guidance. If you don't know something, admit it and suggest where the student can find more information.`;

        const messages = [
            ...conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: 'user',
                content: message
            }
        ];

        try {
            const response = await this.callClaudeAPI(
                messages[messages.length - 1].content,
                1500,
                systemPrompt
            );

            return {
                success: true,
                response,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error in AI chat:', error.message);
            throw error;
        }
    }

    /**
     * Review and provide feedback on college essays
     */
    async reviewEssay(essayData) {
        const { essay, prompt, collegeName, wordLimit } = essayData;

        const reviewPrompt = `You are an experienced college admissions essay reviewer. Please review the following college application essay and provide detailed, constructive feedback.

Essay Prompt: ${prompt || 'Common App Personal Statement'}
Target College: ${collegeName || 'General application'}
Word Limit: ${wordLimit || 650} words
Current Word Count: ${essay.split(/\s+/).length} words

Essay:
${essay}

Please provide:
1. Overall Assessment (1-10 score with explanation)
2. Strengths (what works well)
3. Areas for Improvement (specific suggestions)
4. Structure & Organization feedback
5. Voice & Authenticity assessment
6. Grammar & Style notes
7. Specific line-by-line suggestions for key sections
8. Final recommendations for revision

Be encouraging but honest. Focus on helping the student tell their unique story effectively.`;

        try {
            const response = await this.callClaudeAPI(reviewPrompt, 3000);
            
            return {
                success: true,
                review: response,
                essayStats: {
                    wordCount: essay.split(/\s+/).length,
                    characterCount: essay.length,
                    paragraphCount: essay.split('\n\n').length,
                    withinLimit: essay.split(/\s+/).length <= (wordLimit || 650)
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error reviewing essay:', error.message);
            throw error;
        }
    }

    /**
     * Generate essay brainstorming ideas
     */
    async brainstormEssay(topic, background) {
        const prompt = `Help a high school student brainstorm ideas for their college essay.

Essay Topic/Prompt: ${topic}
Student Background: ${background || 'Not provided'}

Please provide:
1. 5-7 potential angles or approaches to this topic
2. Questions to help the student reflect and generate ideas
3. Examples of what makes a compelling story
4. Common pitfalls to avoid
5. Tips for making the essay personal and authentic

Be creative and encouraging. Help them find their unique voice and story.`;

        try {
            const response = await this.callClaudeAPI(prompt, 1500);
            
            return {
                success: true,
                brainstorming: response,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error brainstorming essay:', error.message);
            throw error;
        }
    }

    /**
     * Get personalized application timeline
     */
    async getApplicationTimeline(profile, targetDate) {
        const prompt = `Create a personalized college application timeline for a student.

Student Profile:
- Current Grade: ${profile.grade || '12th'}
- Number of Colleges: ${profile.numColleges || '8-10'}
- Target Submission: ${targetDate || 'Regular Decision (January)'}
- Test Scores Status: ${profile.testStatus || 'Completed'}
- Essay Status: ${profile.essayStatus || 'Not started'}

Create a week-by-week timeline from now until the deadline with specific tasks including:
- Application tasks
- Essay writing milestones
- Test deadlines (if applicable)
- Recommendation letter requests
- Financial aid tasks
- Review and submission milestones

Make it realistic and manageable for a busy high school student.`;

        try {
            const response = await this.callClaudeAPI(prompt, 2000);
            
            return {
                success: true,
                timeline: response,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error generating timeline:', error.message);
            throw error;
        }
    }

    /**
     * Compare colleges
     */
    async compareColleges(colleges) {
        const collegeList = colleges.map(c => `- ${c.name} (${c.location})`).join('\n');

        const prompt = `Compare the following colleges for a high school student trying to decide where to apply:

${collegeList}

Please provide:
1. Overview of each college (brief)
2. Key similarities and differences
3. Academic strengths of each
4. Campus culture and student life comparisons
5. Location and setting differences
6. Admission selectivity comparison
7. Recommendations for which type of student would thrive at each

Be objective and balanced in your comparison.`;

        try {
            const response = await this.callClaudeAPI(prompt, 2000);
            
            return {
                success: true,
                comparison: response,
                colleges,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error comparing colleges:', error.message);
            throw error;
        }
    }

    /**
     * Call Claude API
     */
    async callClaudeAPI(userMessage, maxTokens = 1500, systemPrompt = null) {
        if (!this.apiKey) {
            throw new Error('Anthropic API key not configured');
        }

        const requestBody = {
            model: this.model,
            max_tokens: maxTokens,
            messages: [
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        };

        if (systemPrompt) {
            requestBody.system = systemPrompt;
        }

        try {
            const response = await axios.post(this.apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                timeout: 30000 // 30 second timeout
            });

            if (response.data && response.data.content && response.data.content[0]) {
                return response.data.content[0].text;
            } else {
                throw new Error('Invalid response format from Claude API');
            }
        } catch (error) {
            if (error.response) {
                console.error('Claude API error:', error.response.data);
                throw new Error(`Claude API error: ${error.response.data.error?.message || 'Unknown error'}`);
            } else if (error.request) {
                throw new Error('No response from Claude API - check network connection');
            } else {
                throw new Error(`Error calling Claude API: ${error.message}`);
            }
        }
    }

    /**
     * Generate sample essay based on topic
     */
    async generateSampleEssay(topic, style = 'formal') {
        const prompt = `Generate a sample college application essay as an example for a student.

Topic: ${topic}
Style: ${style}

Create a well-written 500-word sample essay that:
1. Directly addresses the topic
2. Shows personal growth or insight
3. Uses specific examples and details
4. Has a clear structure (intro, body, conclusion)
5. Demonstrates authentic voice
6. Avoids clichés

Note: This is a SAMPLE to help students understand structure and style, not for them to copy.`;

        try {
            const response = await this.callClaudeAPI(prompt, 2000);
            
            return {
                success: true,
                sampleEssay: response,
                disclaimer: 'This is a sample for educational purposes only. Students must write their own authentic essays.',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error generating sample essay:', error.message);
            throw error;
        }
    }
}

module.exports = new AIService();
