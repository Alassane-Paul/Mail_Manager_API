const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers,
  broadcast,
  deleteSubscriber,
} = require('./newsletter.controller');
const { validate, subscribeSchema, broadcastSchema } = require('../../middlewares/validate');
const { newsletterLimiter } = require('../../middlewares/rateLimiter');
const authMiddleware = require('../../middlewares/auth.middleware');

// Public
router.post('/subscribe', newsletterLimiter, validate(subscribeSchema), subscribe);
router.get('/unsubscribe', unsubscribe); // Via lien dans l'email, renvoie HTML

// Admin only
router.get('/subscribers', authMiddleware, getSubscribers);
router.post('/broadcast', authMiddleware, validate(broadcastSchema), broadcast);
router.delete('/subscribers/:id', authMiddleware, deleteSubscriber);

module.exports = router;
