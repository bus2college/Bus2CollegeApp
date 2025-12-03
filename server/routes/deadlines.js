// ===========================================
// Deadlines API Routes
// ===========================================

const express = require('express');
const router = express.Router();
const deadlineService = require('../services/deadlineService');

// Get deadline for a specific college
router.get('/college/:name', async (req, res, next) => {
    try {
        const { name } = req.params;
        const { type = 'regular', year } = req.query;
        
        const deadline = await deadlineService.getDeadline(name, type, year);
        
        if (!deadline) {
            return res.status(404).json({
                success: false,
                error: 'Deadline not found for this college'
            });
        }
        
        res.json({
            success: true,
            data: deadline
        });
    } catch (error) {
        next(error);
    }
});

// Get all deadlines for multiple colleges
router.post('/batch', async (req, res, next) => {
    try {
        const { colleges, type = 'regular', year } = req.body;
        
        if (!Array.isArray(colleges)) {
            return res.status(400).json({
                success: false,
                error: 'Colleges must be an array'
            });
        }
        
        const deadlines = await deadlineService.getBatchDeadlines(colleges, type, year);
        
        res.json({
            success: true,
            count: deadlines.length,
            data: deadlines
        });
    } catch (error) {
        next(error);
    }
});

// Get upcoming deadlines (next 60 days)
router.get('/upcoming', async (req, res, next) => {
    try {
        const { days = 60, type = 'all' } = req.query;
        
        const upcomingDeadlines = await deadlineService.getUpcomingDeadlines(
            parseInt(days),
            type
        );
        
        res.json({
            success: true,
            count: upcomingDeadlines.length,
            data: upcomingDeadlines
        });
    } catch (error) {
        next(error);
    }
});

// Get deadline types for a college
router.get('/types/:name', async (req, res, next) => {
    try {
        const { name } = req.params;
        
        const types = await deadlineService.getDeadlineTypes(name);
        
        res.json({
            success: true,
            data: types
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
