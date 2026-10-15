const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./Admin');
const ContactMessage = require('./ContactMessage');
const Devis = require('./Devis');
const Subscriber = require('./Subscriber');

/**
 * Synchronise tous les modèles et crée le compte admin par défaut
 */
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Base de données connectée');

    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés');

    // Créer admin par défaut si aucun n'existe
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD_DEFAULT, 12);
      await Admin.create({
        email: process.env.ADMIN_EMAIL_DEFAULT,
        password: hash,
        name: 'Super Admin',
      });
      console.log(`✅ Admin par défaut créé : ${process.env.ADMIN_EMAIL_DEFAULT}`);
    }
  } catch (err) {
    console.error('❌ Erreur base de données :', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, Admin, ContactMessage, Devis, Subscriber, syncDatabase };
