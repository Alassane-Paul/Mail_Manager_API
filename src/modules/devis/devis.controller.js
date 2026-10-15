const { Devis } = require('../../models');
const { sendMail } = require('../../config/mailer');
const {
  adminDevisNotification,
  clientDevisConfirmation,
} = require('../../config/templates');
require('dotenv').config();

/**
 * POST /api/devis/send
 * Public - Soumettre une demande de devis
 */
const sendDevis = async (req, res) => {
  try {
    const { name, email, phone, company, projectType, budget, deadline, description } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];

    const record = await Devis.create({
      name,
      email,
      phone: phone || null,
      company: company || null,
      projectType,
      budget: budget || 'a_discuter',
      deadline: deadline || null,
      description,
      ipAddress,
    });

    // Notifier l'admin
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `💼 Nouvelle demande de devis – ${projectType.replace(/_/g, ' ')} de ${name}`,
      html: adminDevisNotification({ name, email, phone, company, projectType, budget, deadline, description }),
    });

    // Confirmer au client
    await sendMail({
      to: email,
      subject: 'Demande de devis reçue – Tutorat Tech',
      html: clientDevisConfirmation({ name, projectType }),
    });

    return res.status(201).json({
      responseCode: '201',
      responseMessage: 'Votre demande de devis a bien été envoyée. Nous vous contacterons sous 2 à 5 jours ouvrés.',
      data: [{ id: record.id }],
    });
  } catch (err) {
    console.error('sendDevis error:', err.message);
    return res.status(500).json({
      responseCode: '500',
      responseMessage: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
      data: [],
    });
  }
};

/**
 * GET /api/devis/list
 * Admin - Liste toutes les demandes de devis
 */
const getDevisList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status; // pending | in_review | accepted | rejected

    const where = status ? { status } : {};

    const { count, rows } = await Devis.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Demandes de devis récupérées.',
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
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
 * PATCH /api/devis/:id/status
 * Admin - Changer le statut d'un devis
 */
const updateDevisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'in_review', 'accepted', 'rejected'];
    if (!allowed.includes(status)) {
      return res.status(422).json({
        responseCode: '422',
        responseMessage: `Statut invalide. Valeurs acceptées : ${allowed.join(', ')}.`,
        data: [],
      });
    }

    const record = await Devis.findByPk(id);
    if (!record) {
      return res.status(404).json({
        responseCode: '404',
        responseMessage: 'Demande de devis introuvable.',
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
 * DELETE /api/devis/:id
 * Admin - Supprimer une demande de devis
 */
const deleteDevis = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Devis.findByPk(id);
    if (!record) {
      return res.status(404).json({
        responseCode: '404',
        responseMessage: 'Demande de devis introuvable.',
        data: [],
      });
    }

    await record.destroy();

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Demande de devis supprimée.',
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

module.exports = { sendDevis, getDevisList, updateDevisStatus, deleteDevis };
