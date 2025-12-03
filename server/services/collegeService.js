// ===========================================
// College Service - Data Management
// ===========================================

const axios = require('axios');
const NodeCache = require('node-cache');
const cheerio = require('cheerio');

const cache = new NodeCache({ stdTTL: 86400 }); // 24 hour cache

// Import static college database as fallback
const COLLEGE_DATABASE = require('../data/colleges.json');

class CollegeService {
    constructor() {
        this.cache = cache;
    }

    /**
     * Get all colleges with filtering
     */
    async getColleges(filters = {}) {
        const cacheKey = `colleges_${JSON.stringify(filters)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        let colleges = [...COLLEGE_DATABASE];

        // Apply filters
        if (filters.state) {
            colleges = colleges.filter(c => c.state === filters.state.toUpperCase());
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            colleges = colleges.filter(c =>
                c.name.toLowerCase().includes(searchLower) ||
                c.location.toLowerCase().includes(searchLower)
            );
        }

        if (filters.limit) {
            colleges = colleges.slice(0, filters.limit);
        }

        // Try to enrich with real-time data
        colleges = await this.enrichCollegeData(colleges);

        this.cache.set(cacheKey, colleges);
        return colleges;
    }

    /**
     * Get college by name
     */
    async getCollegeByName(name) {
        const college = COLLEGE_DATABASE.find(
            c => c.name.toLowerCase() === name.toLowerCase()
        );

        if (!college) {
            return null;
        }

        // Try to get real-time details
        return await this.getCollegeDetails(name) || college;
    }

    /**
     * Get colleges by state
     */
    async getCollegesByState(state) {
        return COLLEGE_DATABASE.filter(c => c.state === state.toUpperCase());
    }

    /**
     * Get detailed college information with real-time data
     */
    async getCollegeDetails(name) {
        const cacheKey = `college_details_${name}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        const baseCollege = COLLEGE_DATABASE.find(
            c => c.name.toLowerCase() === name.toLowerCase()
        );

        if (!baseCollege) {
            return null;
        }

        try {
            // Try to scrape real-time data from college website
            const details = await this.scrapeCollegeData(name, baseCollege);
            this.cache.set(cacheKey, details);
            return details;
        } catch (error) {
            console.error(`Error fetching details for ${name}:`, error.message);
            return baseCollege;
        }
    }

    /**
     * Autocomplete search
     */
    async autocomplete(query, limit = 10) {
        const searchLower = query.toLowerCase();
        
        return COLLEGE_DATABASE
            .filter(c =>
                c.name.toLowerCase().includes(searchLower) ||
                c.location.toLowerCase().includes(searchLower)
            )
            .slice(0, limit)
            .map(c => ({
                name: c.name,
                location: c.location,
                state: c.state
            }));
    }

    /**
     * Enrich college data with real-time information
     */
    async enrichCollegeData(colleges) {
        // For now, return as-is. In production, you'd call external APIs here
        // Examples: College Scorecard API, IPEDS API, etc.
        return colleges;
    }

    /**
     * Scrape college website for real-time data
     */
    async scrapeCollegeData(name, baseCollege) {
        // Implement web scraping logic here
        // This is a placeholder - actual implementation would need specific scraping logic
        // per college website or use of official APIs

        // For now, return base college data
        return {
            ...baseCollege,
            lastUpdated: new Date().toISOString(),
            dataSource: 'database'
        };
    }

    /**
     * Get acceptance rate and statistics
     */
    async getAcceptanceStats(name) {
        const college = await this.getCollegeByName(name);
        
        if (!college) {
            return null;
        }

        return {
            name: college.name,
            acceptanceRate: college.acceptanceRate || 'N/A',
            avgSAT: college.satRange || 'N/A',
            avgACT: college.actRange || 'N/A',
            enrolled: college.enrolled || 'N/A'
        };
    }
}

module.exports = new CollegeService();
