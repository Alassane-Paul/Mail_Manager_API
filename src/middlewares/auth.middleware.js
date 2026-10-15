const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      responseCode: '401',
      responseMessage: 'Accès refusé. Authentification requise.',
      data: [],
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      responseCode: '401',
      responseMessage: 'Token invalide ou expiré. Veuillez vous reconnecter.',
      data: [],
    });
  }
};

module.exports = authMiddleware;
