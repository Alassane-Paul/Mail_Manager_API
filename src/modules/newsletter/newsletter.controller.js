const { Subscriber } = require('../../models');
const { sendMail } = require('../../config/mailer');
const {
  newsletterWelcome,
  newsletterBroadcast,
} = require('../../config/templates');
const { Op } = require('sequelize');
require('dotenv').config();

/**
 * POST /api/newsletter/subscribe
 * Public - S'abonner à la newsletter
 */
const subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];

    // Vérifier si déjà abonné
    const existing = await Subscriber.findOne({ where: { email } });

    if (existing) {
      if (existing.isActive) {
        return res.status(409).json({
          responseCode: '409',
          responseMessage: 'Cette adresse email est déjà abonnée à notre newsletter.',
          data: [],
        });
      }

      // Réactiver si désabonné
      await existing.update({ isActive: true, name: name || existing.name });

      await sendMail({
        to: email,
        subject: 'Bienvenue à nouveau ! – Newsletter Tutorat Tech',
        html: newsletterWelcome({ name: name || existing.name, unsubscribeToken: existing.unsubscribeToken }),
      });

      return res.status(200).json({
        responseCode: '200',
        responseMessage: 'Votre abonnement a été réactivé avec succès !',
        data: [{ id: existing.id }],
      });
    }

    // Créer nouvel abonné
    const subscriber = await Subscriber.create({
      email,
      name: name || null,
      ipAddress,
    });

    await sendMail({
      to: email,
      subject: 'Bienvenue dans la communauté Tutorat Tech 🎉',
      html: newsletterWelcome({ name, unsubscribeToken: subscriber.unsubscribeToken }),
    });

    return res.status(201).json({
      responseCode: '201',
      responseMessage: 'Abonnement réussi ! Vérifiez votre boîte mail.',
      data: [{ id: subscriber.id }],
    });
  } catch (err) {
    console.error('subscribe error:', err.message);
    return res.status(500).json({
      responseCode: '500',
      responseMessage: "Une erreur est survenue lors de l'abonnement.",
      data: [],
    });
  }
};

/**
 * GET /api/newsletter/unsubscribe?token=xxx
 * Public - Se désabonner via le lien dans l'email
 */
const unsubscribe = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        responseCode: '400',
        responseMessage: 'Token de désabonnement manquant.',
        data: [],
      });
    }

    const subscriber = await Subscriber.findOne({ where: { unsubscribeToken: token } });

    if (!subscriber) {
      return res.status(404).json({
        responseCode: '404',
        responseMessage: 'Lien de désabonnement invalide.',
        data: [],
      });
    }

    await subscriber.update({ isActive: false });

    // Réponse HTML simple pour les clics depuis l'email
    return res.send(`
      <!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Désabonnement</title>
      <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8fdf9;margin:0}
      .box{background:#fff;padding:48px;border-radius:12px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:400px}
      h2{color:#1a7a4a}p{color:#6b7280}</style></head>
      <body><div class="box"><h2>Désabonnement confirmé</h2>
      <p>Vous avez été désabonné de la newsletter Tutorat Tech.<br>Vous pouvez vous réabonner à tout moment sur notre site.</p>
      </div></body></html>
    `);
  } catch (err) {
    return res.status(500).json({
      responseCode: '500',
      responseMessage: 'Erreur serveur.',
      data: [],
    });
  }
};

/**
 * GET /api/newsletter/subscribers
 * Admin - Liste tous les abonnés actifs
 */
const getSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    const { count, rows } = await Subscriber.findAndCountAll({
      where: { isActive: true },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['unsubscribeToken', 'ipAddress'] },
    });

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Abonnés récupérés.',
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
 * POST /api/newsletter/broadcast
 * Admin - Envoyer un email à tous les abonnés actifs
 */
const broadcast = async (req, res) => {
  try {
    const { subject, html } = req.body;

    const subscribers = await Subscriber.findAll({
      where: { isActive: true },
    });

    if (subscribers.length === 0) {
      return res.status(200).json({
        responseCode: '200',
        responseMessage: 'Aucun abonné actif pour le moment.',
        data: [],
      });
    }

    let sent = 0;
    let failed = 0;

    // Envoi séquentiel pour ne pas saturer le SMTP
    for (const sub of subscribers) {
      try {
        await sendMail({
          to: sub.email,
          subject,
          html: newsletterBroadcast({ subject, html, unsubscribeToken: sub.unsubscribeToken }),
        });
        sent++;
      } catch {
        failed++;
      }
    }

    return res.status(200).json({
      responseCode: '200',
      responseMessage: `Broadcast terminé. ${sent} emails envoyés, ${failed} échecs.`,
      data: [{ sent, failed, total: subscribers.length }],
    });
  } catch (err) {
    console.error('broadcast error:', err.message);
    return res.status(500).json({
      responseCode: '500',
      responseMessage: 'Erreur lors du broadcast.',
      data: [],
    });
  }
};

/**
 * DELETE /api/newsletter/subscribers/:id
 * Admin - Supprimer un abonné manuellement
 */
const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findByPk(id);
    if (!subscriber) {
      return res.status(404).json({
        responseCode: '404',
        responseMessage: 'Abonné introuvable.',
        data: [],
      });
    }

    await subscriber.destroy();

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Abonné supprimé.',
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

module.exports = { subscribe, unsubscribe, getSubscribers, broadcast, deleteSubscriber };
