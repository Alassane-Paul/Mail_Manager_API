require('dotenv').config();
const app = require('./app');
const { syncDatabase } = require('./models');
const { verifyMailer } = require('./config/mailer');

const PORT = process.env.PORT || 4000;

const start = async () => {
  // 1. Synchroniser la base de données
  await syncDatabase();

  // 2. Vérifier la connexion SMTP
  await verifyMailer();

  // 3. Démarrer le serveur
  app.listen(PORT, () => {
    console.log(`\n🚀 mail-manager-api démarré sur http://localhost:${PORT}`);
    console.log(`📋 Health check : http://localhost:${PORT}/health`);
    console.log(`\n📌 Routes disponibles :`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   POST   /api/auth/logout`);
    console.log(`   GET    /api/auth/me`);
    console.log(`   POST   /api/contact/send`);
    console.log(`   GET    /api/contact/messages        [admin]`);
    console.log(`   PATCH  /api/contact/messages/:id/status [admin]`);
    console.log(`   DELETE /api/contact/messages/:id   [admin]`);
    console.log(`   POST   /api/devis/send`);
    console.log(`   GET    /api/devis/list              [admin]`);
    console.log(`   PATCH  /api/devis/:id/status        [admin]`);
    console.log(`   DELETE /api/devis/:id               [admin]`);
    console.log(`   POST   /api/newsletter/subscribe`);
    console.log(`   GET    /api/newsletter/unsubscribe`);
    console.log(`   GET    /api/newsletter/subscribers  [admin]`);
    console.log(`   POST   /api/newsletter/broadcast    [admin]`);
    console.log(`   DELETE /api/newsletter/subscribers/:id [admin]`);
    console.log(`   GET    /api/dashboard/stats         [admin]`);
  });
};

start().catch((err) => {
  console.error('❌ Erreur au démarrage :', err);
  process.exit(1);
});
