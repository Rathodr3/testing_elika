
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', (req, res) => {
  const healthData = {
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };

  res.json(healthData);
});

module.exports = router;
