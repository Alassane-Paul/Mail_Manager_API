const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../../models');
require('dotenv').config();

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        responseCode: '401',
        responseMessage: 'Email ou mot de passe incorrect.',
        data: [],
      });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({
        responseCode: '401',
        responseMessage: 'Email ou mot de passe incorrect.',
        data: [],
      });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE, 10),
    });

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Connexion réussie.',
      data: [{ id: admin.id, email: admin.email, name: admin.name }],
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: '500',
      responseMessage: 'Erreur serveur.',
      data: [],
    });
  }
};

/**
 * POST /api/auth/register
 * (Protected route for admins only)
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({
        responseCode: '400',
        responseMessage: 'Un administrateur avec cet email existe déjà.',
        data: [],
      });
    }

    const hash = await bcrypt.hash(password, 12);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hash,
    });

    return res.status(201).json({
      responseCode: '201',
      responseMessage: 'Administrateur créé avec succès.',
      data: [{ id: newAdmin.id, email: newAdmin.email, name: newAdmin.name }],
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: '500',
      responseMessage: 'Erreur serveur.',
      data: [],
    });
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.status(200).json({
    responseCode: '200',
    responseMessage: 'Déconnexion réussie.',
    data: [],
  });
};

/**
 * GET /api/auth/me
 */
const me = (req, res) => {
  return res.status(200).json({
    responseCode: '200',
    responseMessage: 'Admin authentifié.',
    data: [req.admin],
  });
};

module.exports = { login, register, logout, me };
