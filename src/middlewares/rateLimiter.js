const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        responseCode: '429',
        responseMessage: message,
        data: [],
      });
    },
  });

// 5 messages max / 15 min par IP (anti-spam contact)
const contactLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Trop de messages envoyés. Veuillez réessayer dans 15 minutes.'
);

// 3 devis max / heure par IP
const devisLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  'Trop de demandes de devis. Veuillez réessayer dans une heure.'
);

// 3 tentatives de subscribe / heure
const newsletterLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  "Trop de tentatives d'abonnement. Veuillez réessayer dans une heure."
);

// 10 tentatives de login / 15 min
const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
);

// Limiter général pour toutes les routes API
const globalLimiter = createLimiter(
  60 * 1000,
  100,
  'Trop de requêtes. Veuillez ralentir.'
);

module.exports = {
  contactLimiter,
  devisLimiter,
  newsletterLimiter,
  authLimiter,
  globalLimiter,
};
