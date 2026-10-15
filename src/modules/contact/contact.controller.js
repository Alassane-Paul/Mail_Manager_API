const { ContactMessage } = require('../../models');
const { sendMail } = require('../../config/mailer');
const {
  adminContactNotification,
  clientContactConfirmation,
} = require('../../config/templates');
require('dotenv').config();

/**
 * POST /api/contact/send
 * Public - Envoie un message de contact
 */
const sendContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];

    // Sauvegarder en BDD
    const record = await ContactMessage.create({
      name,
      email,
      phone: phone || null,
      message,
      ipAddress,
    });

    // Notifier l'admin
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `📬 Nouveau message de ${name}`,
      html: adminContactNotification({ name, email, phone, message }),
    });

    // Confirmer au client
    await sendMail({
      to: email,
      subject: 'Nous avons bien reçu votre message – Tutorat Tech',
      html: clientContactConfirmation({ name }),
    });

    return res.status(201).json({
      responseCode: '201',
      responseMessage: 'Votre message a bien été envoyé. Nous vous répondrons très bientôt.',
      data: [{ id: record.id }],
    });
  } catch (err) {
    console.error('sendContact error:', err.message);
    return res.status(500).json({
      responseCode: '500',
      responseMessage: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
      data: [],
    });
  }
};

/**
 * GET /api/contact/messages
 * Admin - Liste tous les messages avec pagination
 */
const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status; // unread | read | replied

    const where = status ? { status } : {};

    const { count, rows } = await ContactMessage.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Messages récupérés avec succès.',
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error('getMessages error:', err.message);
    return res.status(500).json({
      responseCode: '500',
      responseMessage: 'Erreur serveur.',
      data: [],
    });
  }
};

/**
 * PATCH /api/contact/messages/:id/status
 * Admin - Changer le statut d'un message
 */
const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['unread', 'read', 'replied'];
    if (!allowed.includes(status)) {
      return res.status(422).json({
        responseCode: '422',
        responseMessage: `Statut invalide. Valeurs acceptées : ${allowed.join(', ')}.`,
        data: [],
      });
    }

    const record = await ContactMessage.findByPk(id);
    if (!record) {
      return res.status(404).json({
        responseCode: '404',
        responseMessage: 'Message introuvable.',
        data: [],
      });
    }

    await record.update({ status });

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Statut mis à jour.',
      data: [record],
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
 * DELETE /api/contact/messages/:id
 * Admin - Supprimer un message
 */
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await ContactMessage.findByPk(id);
    if (!record) {
      return res.status(404).json({
        responseCode: '404',
        responseMessage: 'Message introuvable.',
        data: [],
      });
    }

    await record.destroy();

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Message supprimé.',
      data: [],
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: '500',
      responseMessage: 'Erreur serveur.',
      data: [],
    });
  }
};

module.exports = { sendContact, getMessages, updateMessageStatus, deleteMessage };
