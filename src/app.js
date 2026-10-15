const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { globalLimiter } = require('./middlewares/rateLimiter');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const contactRoutes = require('./modules/contact/contact.routes');
const devisRoutes = require('./modules/devis/devis.routes');
const newsletterRoutes = require('./modules/newsletter/newsletter.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// ── MIDDLEWARES GLOBAUX ───────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

// Proxy trust (pour les IPs derrière Nginx/reverse-proxy)
app.set('trust proxy', 1);

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    responseCode: '200',
    responseMessage: 'API mail-manager opérationnelle.',
    data: [{ timestamp: new Date().toISOString() }],
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    responseCode: '404',
    responseMessage: 'Route introuvable.',
    data: [],
  });
});

// ── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    responseCode: '500',
    responseMessage: 'Erreur interne du serveur.',
    data: [],
  });
});

module.exports = app;
