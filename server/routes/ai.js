// ===========================================
// AI API Routes
// ===========================================

const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// AI-powered college suggestions
router.post('/suggestions', async (req, res, next) => {
    try {
        const {
            gpa,
            testScore,
            testType,
            interests,
            state,
            statePreference,
            additionalPreferences
        } = req.body;
        
        // Validate required fields
        if (!gpa || !testScore || !testType || !interests || interests.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: gpa, testScore, testType, interests'
            });
        }
        
        const suggestions = await aiService.getCollegeSuggestions({
            gpa,
            testScore,
            testType,
            interests,
            state,
            statePreference,
            additionalPreferences
        });
        
        res.json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        next(error);
    }
});

// AI chat for college advice
router.post('/chat', async (req, res, next) => {
    try {
        const { message, context = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }
        
        const response = await aiService.chat(message, context);
        
        res.json({
            success: true,
            data: {
                message: response,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        next(error);
    }
});

// Essay review endpoint
router.post('/essay/review', async (req, res, next) => {
    try {
        const { essay, prompt, wordLimit } = req.body;
        
        if (!essay) {
            return res.status(400).json({
                success: false,
                error: 'Essay text is required'
            });
        }
        
        const review = await aiService.reviewEssay(essay, prompt, wordLimit);
        
        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
