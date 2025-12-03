// ===========================================
// Search Service - Advanced college search
// ===========================================

const collegeService = require('./collegeService');
const COLLEGE_DATABASE = require('../data/colleges.json');

class SearchService {
    constructor() {
        this.colleges = COLLEGE_DATABASE;
    }

    /**
     * Advanced college search with multiple filters
     */
    async searchColleges(criteria) {
        let results = [...this.colleges];

        // Filter by name/keyword
        if (criteria.keyword) {
            const keyword = criteria.keyword.toLowerCase();
            results = results.filter(c =>
                c.name.toLowerCase().includes(keyword) ||
                c.location.toLowerCase().includes(keyword) ||
                (c.type && c.type.toLowerCase().includes(keyword))
            );
        }

        // Filter by state
        if (criteria.state) {
            results = results.filter(c => c.state === criteria.state.toUpperCase());
        }

        // Filter by states (array)
        if (criteria.states && Array.isArray(criteria.states)) {
            const statesUpper = criteria.states.map(s => s.toUpperCase());
            results = results.filter(c => statesUpper.includes(c.state));
        }

        // Filter by acceptance rate range
        if (criteria.minAcceptance || criteria.maxAcceptance) {
            results = results.filter(c => {
                if (!c.acceptanceValue) return false;
                
                const rate = c.acceptanceValue;
                const minOk = !criteria.minAcceptance || rate >= criteria.minAcceptance;
                const maxOk = !criteria.maxAcceptance || rate <= criteria.maxAcceptance;
                
                return minOk && maxOk;
            });
        }

        // Filter by SAT range
        if (criteria.satScore) {
            results = results.filter(c => {
                if (!c.satRange) return false;
                
                // Parse SAT range like "1400-1550"
                const parts = c.satRange.split('-');
                if (parts.length !== 2) return false;
                
                const min = parseInt(parts[0]);
                const max = parseInt(parts[1]);
                
                return criteria.satScore >= min && criteria.satScore <= max;
            });
        }

        // Filter by ACT range
        if (criteria.actScore) {
            results = results.filter(c => {
                if (!c.actRange) return false;
                
                // Parse ACT range like "32-35"
                const parts = c.actRange.split('-');
                if (parts.length !== 2) return false;
                
                const min = parseInt(parts[0]);
                const max = parseInt(parts[1]);
                
                return criteria.actScore >= min && criteria.actScore <= max;
            });
        }

        // Filter by college type
        if (criteria.type) {
            results = results.filter(c =>
                c.type && c.type.toLowerCase() === criteria.type.toLowerCase()
            );
        }

        // Sort results
        if (criteria.sortBy) {
            results = this.sortResults(results, criteria.sortBy, criteria.sortOrder);
        }

        // Pagination
        const page = criteria.page || 1;
        const limit = criteria.limit || 50;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
            total: results.length,
            page,
            limit,
            totalPages: Math.ceil(results.length / limit),
            results: results.slice(startIndex, endIndex)
        };
    }

    /**
     * Get personalized recommendations based on student profile
     */
    async getRecommendations(profile) {
        const { gpa, testScore, testType, interests, statePreference } = profile;

        // Get all colleges
        let colleges = [...this.colleges];

        // Calculate match score for each college
        const scoredColleges = colleges.map(college => {
            let score = 0;
            let matchLevel = 'reach';

            // Test score matching
            if (testScore && testType) {
                const scoreMatch = this.matchTestScore(college, testScore, testType);
                score += scoreMatch.score;
                matchLevel = scoreMatch.level;
            }

            // GPA matching
            if (gpa && college.avgGPA) {
                const gpaMatch = this.matchGPA(college, gpa);
                score += gpaMatch;
            }

            // State preference
            if (statePreference) {
                if (statePreference === 'in-state' && college.state === profile.state) {
                    score += 20;
                } else if (statePreference === 'no-preference') {
                    score += 5;
                }
            }

            // Interests matching (if available)
            if (interests && college.strengths) {
                const interestMatch = this.matchInterests(interests, college.strengths);
                score += interestMatch;
            }

            return {
                ...college,
                matchScore: score,
                matchLevel
            };
        });

        // Sort by match score
        scoredColleges.sort((a, b) => b.matchScore - a.matchScore);

        // Categorize into reach, target, safety
        const categorized = {
            safety: scoredColleges.filter(c => c.matchLevel === 'safety').slice(0, 5),
            target: scoredColleges.filter(c => c.matchLevel === 'target').slice(0, 5),
            reach: scoredColleges.filter(c => c.matchLevel === 'reach').slice(0, 5)
        };

        return categorized;
    }

    /**
     * Match test score to college ranges
     */
    matchTestScore(college, score, testType) {
        let range = null;
        
        if (testType === 'SAT' && college.satRange) {
            range = college.satRange.split('-').map(s => parseInt(s));
        } else if (testType === 'ACT' && college.actRange) {
            range = college.actRange.split('-').map(s => parseInt(s));
        }

        if (!range || range.length !== 2) {
            return { score: 0, level: 'reach' };
        }

        const [min, max] = range;
        const mid = (min + max) / 2;

        if (score >= max) {
            return { score: 50, level: 'safety' };
        } else if (score >= mid) {
            return { score: 30, level: 'target' };
        } else if (score >= min - 50) {
            return { score: 10, level: 'reach' };
        } else {
            return { score: 0, level: 'reach' };
        }
    }

    /**
     * Match GPA to college
     */
    matchGPA(college, gpa) {
        if (!college.avgGPA) {
            return 0;
        }

        const diff = Math.abs(college.avgGPA - gpa);
        
        if (diff <= 0.2) {
            return 30;
        } else if (diff <= 0.5) {
            return 20;
        } else if (diff <= 1.0) {
            return 10;
        } else {
            return 0;
        }
    }

    /**
     * Match interests to college strengths
     */
    matchInterests(interests, strengths) {
        if (!interests || !strengths) {
            return 0;
        }

        const interestWords = interests.toLowerCase().split(/[\s,]+/);
        const strengthWords = strengths.toLowerCase().split(/[\s,]+/);

        let matches = 0;
        interestWords.forEach(interest => {
            if (strengthWords.some(strength => strength.includes(interest) || interest.includes(strength))) {
                matches++;
            }
        });

        return matches * 10;
    }

    /**
     * Sort results
     */
    sortResults(results, sortBy, sortOrder = 'asc') {
        const multiplier = sortOrder === 'desc' ? -1 : 1;

        return results.sort((a, b) => {
            let aVal, bVal;

            switch (sortBy) {
                case 'name':
                    aVal = a.name;
                    bVal = b.name;
                    return multiplier * aVal.localeCompare(bVal);
                
                case 'acceptance':
                    aVal = a.acceptanceValue || 100;
                    bVal = b.acceptanceValue || 100;
                    return multiplier * (aVal - bVal);
                
                case 'location':
                    aVal = a.state;
                    bVal = b.state;
                    return multiplier * aVal.localeCompare(bVal);
                
                default:
                    return 0;
            }
        });
    }

    /**
     * Quick search with autocomplete
     */
    async quickSearch(query, limit = 10) {
        const searchLower = query.toLowerCase();
        
        const results = this.colleges
            .filter(c =>
                c.name.toLowerCase().includes(searchLower) ||
                c.location.toLowerCase().includes(searchLower)
            )
            .slice(0, limit)
            .map(c => ({
                id: c.name,
                name: c.name,
                location: c.location,
                state: c.state,
                acceptanceRate: c.acceptanceRate
            }));

        return results;
    }

    /**
     * Get similar colleges
     */
    async getSimilarColleges(collegeName, limit = 5) {
        const college = this.colleges.find(
            c => c.name.toLowerCase() === collegeName.toLowerCase()
        );

        if (!college) {
            return [];
        }

        // Find colleges with similar characteristics
        const similar = this.colleges
            .filter(c => c.name !== college.name)
            .map(c => {
                let similarity = 0;

                // Same state
                if (c.state === college.state) similarity += 20;

                // Similar acceptance rate (within 10%)
                if (college.acceptanceValue && c.acceptanceValue) {
                    const diff = Math.abs(college.acceptanceValue - c.acceptanceValue);
                    if (diff <= 10) similarity += 30;
                }

                // Same type
                if (college.type && c.type === college.type) similarity += 25;

                // Similar SAT range
                if (college.satRange && c.satRange === college.satRange) similarity += 25;

                return {
                    ...c,
                    similarity
                };
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);

        return similar;
    }
}

module.exports = new SearchService();
