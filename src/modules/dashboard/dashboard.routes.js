const express = require('express');
const router = express.Router();
const { getStats } = require('./dashboard.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Admin only
router.get('/stats', authMiddleware, getStats);

module.exports = router;
