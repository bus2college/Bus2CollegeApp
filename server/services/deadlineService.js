// ===========================================
// Deadline Service - Real-time deadline fetching
// ===========================================

const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache for deadlines

// Import college database for fallback
const COLLEGE_DATABASE = require('../data/colleges.json');

class DeadlineService {
    constructor() {
        this.cache = cache;
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth();
        // Determine application year (July-June cycle)
        this.applicationYear = this.currentMonth >= 6 ? this.currentYear + 1 : this.currentYear;
    }

    /**
     * Get deadline for a specific college
     */
    async getDeadlineForCollege(collegeName) {
        const cacheKey = `deadline_${collegeName}_${this.applicationYear}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        // First check database
        const college = COLLEGE_DATABASE.find(
            c => c.name.toLowerCase() === collegeName.toLowerCase()
        );

        if (!college) {
            return {
                error: 'College not found',
                collegeName
            };
        }

        try {
            // Try to fetch real-time deadline from college website
            const realTimeDeadline = await this.scrapeDeadline(collegeName, college);
            
            if (realTimeDeadline) {
                this.cache.set(cacheKey, realTimeDeadline);
                return realTimeDeadline;
            }
        } catch (error) {
            console.error(`Error fetching deadline for ${collegeName}:`, error.message);
        }

        // Fallback to database
        const result = {
            collegeName: college.name,
            earlyDeadline: college.earlyDeadline || null,
            regularDeadline: college.regularDeadline,
            rollingAdmission: college.rollingAdmission || false,
            year: this.applicationYear,
            dataSource: 'database',
            urgency: this.calculateUrgency(college.regularDeadline)
        };

        this.cache.set(cacheKey, result);
        return result;
    }

    /**
     * Get batch deadlines for multiple colleges
     */
    async getBatchDeadlines(collegeNames) {
        const promises = collegeNames.map(name => this.getDeadlineForCollege(name));
        const results = await Promise.all(promises);
        
        return results;
    }

    /**
     * Get upcoming deadlines across all colleges
     */
    async getUpcomingDeadlines(daysAhead = 60) {
        const today = new Date();
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + daysAhead);

        const upcomingDeadlines = [];

        for (const college of COLLEGE_DATABASE) {
            if (college.regularDeadline) {
                const deadlineDate = this.parseDeadline(college.regularDeadline);
                
                if (deadlineDate && deadlineDate >= today && deadlineDate <= targetDate) {
                    upcomingDeadlines.push({
                        collegeName: college.name,
                        deadline: college.regularDeadline,
                        deadlineDate: deadlineDate.toISOString(),
                        type: 'Regular Decision',
                        daysUntil: Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)),
                        urgency: this.calculateUrgency(college.regularDeadline)
                    });
                }
            }

            if (college.earlyDeadline) {
                const earlyDate = this.parseDeadline(college.earlyDeadline);
                
                if (earlyDate && earlyDate >= today && earlyDate <= targetDate) {
                    upcomingDeadlines.push({
                        collegeName: college.name,
                        deadline: college.earlyDeadline,
                        deadlineDate: earlyDate.toISOString(),
                        type: 'Early Decision/Action',
                        daysUntil: Math.ceil((earlyDate - today) / (1000 * 60 * 60 * 24)),
                        urgency: this.calculateUrgency(college.earlyDeadline)
                    });
                }
            }
        }

        // Sort by date
        return upcomingDeadlines.sort((a, b) => 
            new Date(a.deadlineDate) - new Date(b.deadlineDate)
        );
    }

    /**
     * Get deadlines by type
     */
    async getDeadlinesByType(type) {
        const validTypes = ['early', 'regular', 'rolling'];
        
        if (!validTypes.includes(type.toLowerCase())) {
            throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
        }

        const deadlines = [];

        for (const college of COLLEGE_DATABASE) {
            switch (type.toLowerCase()) {
                case 'early':
                    if (college.earlyDeadline) {
                        deadlines.push({
                            collegeName: college.name,
                            deadline: college.earlyDeadline,
                            type: 'Early Decision/Action'
                        });
                    }
                    break;
                case 'regular':
                    if (college.regularDeadline) {
                        deadlines.push({
                            collegeName: college.name,
                            deadline: college.regularDeadline,
                            type: 'Regular Decision'
                        });
                    }
                    break;
                case 'rolling':
                    if (college.rollingAdmission) {
                        deadlines.push({
                            collegeName: college.name,
                            deadline: 'Rolling',
                            type: 'Rolling Admission'
                        });
                    }
                    break;
            }
        }

        return deadlines;
    }

    /**
     * Parse deadline string to Date object
     */
    parseDeadline(deadlineStr) {
        if (!deadlineStr || deadlineStr === 'TBD') {
            return null;
        }

        try {
            const dateStr = `${deadlineStr}, ${this.applicationYear}`;
            const date = new Date(dateStr);
            
            if (isNaN(date.getTime())) {
                return null;
            }
            
            return date;
        } catch (error) {
            return null;
        }
    }

    /**
     * Calculate urgency level based on days until deadline
     */
    calculateUrgency(deadlineStr) {
        const deadlineDate = this.parseDeadline(deadlineStr);
        
        if (!deadlineDate) {
            return 'unknown';
        }

        const today = new Date();
        const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntil < 0) {
            return 'passed';
        } else if (daysUntil <= 30) {
            return 'urgent';
        } else if (daysUntil <= 60) {
            return 'soon';
        } else {
            return 'normal';
        }
    }

    /**
     * Scrape deadline from college website
     */
    async scrapeDeadline(collegeName, college) {
        // Placeholder for web scraping logic
        // In production, implement specific scraping per college or use official APIs
        
        // Example approach:
        // 1. Build college-specific URLs from known patterns
        // 2. Use cheerio to parse HTML
        // 3. Extract deadline information using selectors
        
        // For now, return null to use database fallback
        return null;
    }

    /**
     * Get deadline with countdown information
     */
    async getDeadlineWithCountdown(collegeName) {
        const deadline = await this.getDeadlineForCollege(collegeName);
        
        if (deadline.error) {
            return deadline;
        }

        const deadlineDate = this.parseDeadline(deadline.regularDeadline);
        
        if (!deadlineDate) {
            return {
                ...deadline,
                countdown: null
            };
        }

        const today = new Date();
        const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        return {
            ...deadline,
            countdown: {
                daysUntil,
                deadlineDate: deadlineDate.toISOString(),
                formattedCountdown: this.formatCountdown(daysUntil)
            }
        };
    }

    /**
     * Format countdown message
     */
    formatCountdown(days) {
        if (days < 0) {
            return 'Deadline has passed';
        } else if (days === 0) {
            return 'Due today!';
        } else if (days === 1) {
            return 'Due tomorrow!';
        } else if (days <= 7) {
            return `Due in ${days} days`;
        } else if (days <= 30) {
            const weeks = Math.floor(days / 7);
            const remainingDays = days % 7;
            if (remainingDays === 0) {
                return `Due in ${weeks} week${weeks > 1 ? 's' : ''}`;
            }
            return `Due in ${weeks} week${weeks > 1 ? 's' : ''} and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
        } else {
            const months = Math.floor(days / 30);
            const remainingDays = days % 30;
            if (remainingDays === 0) {
                return `Due in ${months} month${months > 1 ? 's' : ''}`;
            }
            return `Due in ${months} month${months > 1 ? 's' : ''} and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
        }
    }
}

module.exports = new DeadlineService();
