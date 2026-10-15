const express = require('express');
const router = express.Router();
const {
  sendDevis,
  getDevisList,
  updateDevisStatus,
  deleteDevis,
} = require('./devis.controller');
const { validate, devisSchema } = require('../../middlewares/validate');
const { devisLimiter } = require('../../middlewares/rateLimiter');
const authMiddleware = require('../../middlewares/auth.middleware');

// Public
router.post('/send', devisLimiter, validate(devisSchema), sendDevis);

// Admin only
router.get('/list', authMiddleware, getDevisList);
router.patch('/:id/status', authMiddleware, updateDevisStatus);
router.delete('/:id', authMiddleware, deleteDevis);

module.exports = router;
