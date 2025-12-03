// ===========================================
// Search API Routes
// ===========================================

const express = require('express');
const router = express.Router();
const searchService = require('../services/searchService');

// Advanced college search
router.post('/colleges', async (req, res, next) => {
    try {
        const {
            gpa,
            testScore,
            testType = 'SAT',
            interests = [],
            state,
            statePreference = 'any',
            size,
            location,
            ranking,
            limit = 50
        } = req.body;
        
        const results = await searchService.searchColleges({
            gpa,
            testScore,
            testType,
            interests,
            state,
            statePreference,
            size,
            location,
            ranking,
            limit: parseInt(limit)
        });
        
        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
});

// Get college recommendations
router.post('/recommendations', async (req, res, next) => {
    try {
        const {
            gpa,
            testScore,
            testType = 'SAT',
            interests = [],
            state,
            statePreference = 'any',
            additionalPreferences = ''
        } = req.body;
        
        const recommendations = await searchService.getRecommendations({
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
            data: {
                safety: recommendations.safety || [],
                target: recommendations.target || [],
                reach: recommendations.reach || []
            }
        });
    } catch (error) {
        next(error);
    }
});

// Quick search (text-based)
router.get('/quick', async (req, res, next) => {
    try {
        const { q, limit = 20 } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }
        
        const results = await searchService.quickSearch(q, parseInt(limit));
        
        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
