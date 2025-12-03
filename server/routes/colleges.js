// ===========================================
// Colleges API Routes
// ===========================================

const express = require('express');
const router = express.Router();
const collegeService = require('../services/collegeService');

// Get all colleges with optional filtering
router.get('/', async (req, res, next) => {
    try {
        const { state, type, search, limit = 50 } = req.query;
        
        const colleges = await collegeService.getColleges({
            state,
            type,
            search,
            limit: parseInt(limit)
        });
        
        res.json({
            success: true,
            count: colleges.length,
            data: colleges
        });
    } catch (error) {
        next(error);
    }
});

// Get college by name
router.get('/name/:name', async (req, res, next) => {
    try {
        const { name } = req.params;
        const college = await collegeService.getCollegeByName(name);
        
        if (!college) {
            return res.status(404).json({
                success: false,
                error: 'College not found'
            });
        }
        
        res.json({
            success: true,
            data: college
        });
    } catch (error) {
        next(error);
    }
});

// Get colleges by state
router.get('/state/:state', async (req, res, next) => {
    try {
        const { state } = req.params;
        const colleges = await collegeService.getCollegesByState(state.toUpperCase());
        
        res.json({
            success: true,
            count: colleges.length,
            data: colleges
        });
    } catch (error) {
        next(error);
    }
});

// Get college details with real-time data
router.get('/details/:name', async (req, res, next) => {
    try {
        const { name } = req.params;
        const details = await collegeService.getCollegeDetails(name);
        
        if (!details) {
            return res.status(404).json({
                success: false,
                error: 'College details not found'
            });
        }
        
        res.json({
            success: true,
            data: details
        });
    } catch (error) {
        next(error);
    }
});

// Search colleges with autocomplete
router.get('/autocomplete', async (req, res, next) => {
    try {
        const { q, limit = 10 } = req.query;
        
        if (!q || q.length < 2) {
            return res.json({
                success: true,
                count: 0,
                data: []
            });
        }
        
        const suggestions = await collegeService.autocomplete(q, parseInt(limit));
        
        res.json({
            success: true,
            count: suggestions.length,
            data: suggestions
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
