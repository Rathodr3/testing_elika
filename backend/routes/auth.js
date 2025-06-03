
const express = require('express');
const router = express.Router();

// Simple admin login (for demonstration - in production use proper authentication)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple hardcoded admin check (replace with proper authentication)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@elikaengineering.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      // In production, generate a proper JWT token
      const token = 'admin-token-' + Date.now();
      
      res.json({
        success: true,
        token,
        user: { email, role: 'admin' }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

module.exports = router;
