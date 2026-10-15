const express = require('express');
const router = express.Router();
const {
  sendContact,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} = require('./contact.controller');
const { validate, contactSchema } = require('../../middlewares/validate');
const { contactLimiter } = require('../../middlewares/rateLimiter');
const authMiddleware = require('../../middlewares/auth.middleware');

// Public
router.post('/send', contactLimiter, validate(contactSchema), sendContact);

// Admin only
router.get('/messages', authMiddleware, getMessages);
router.patch('/messages/:id/status', authMiddleware, updateMessageStatus);
router.delete('/messages/:id', authMiddleware, deleteMessage);

module.exports = router;
