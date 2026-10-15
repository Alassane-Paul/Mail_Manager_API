const express = require('express');
const router = express.Router();
const { login, register, logout, me } = require('./auth.controller');
const { validate, loginSchema, registerAdminSchema } = require('../../middlewares/validate');
const { authLimiter } = require('../../middlewares/rateLimiter');
const authMiddleware = require('../../middlewares/auth.middleware');

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), login);

// POST /api/auth/register
router.post('/register', authMiddleware, validate(registerAdminSchema), register);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me
router.get('/me', authMiddleware, me);

module.exports = router;
