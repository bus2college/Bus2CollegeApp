// ===========================================
// Bus2College Backend API Server
// ===========================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize cache (TTL: 24 hours for college data, 1 hour for deadlines)
const collegeCache = new NodeCache({ stdTTL: 86400 });
const deadlineCache = new NodeCache({ stdTTL: 3600 });

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const collegeRoutes = require('./routes/colleges');
const deadlineRoutes = require('./routes/deadlines');
const searchRoutes = require('./routes/search');
const aiRoutes = require('./routes/ai');

// API Routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        cache: {
            colleges: collegeCache.getStats(),
            deadlines: deadlineCache.getStats()
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Bus2College API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            colleges: '/api/colleges',
            deadlines: '/api/deadlines',
            search: '/api/search',
            ai: '/api/ai'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Endpoint not found',
            status: 404,
            path: req.path
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Bus2College API Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

module.exports = app;
