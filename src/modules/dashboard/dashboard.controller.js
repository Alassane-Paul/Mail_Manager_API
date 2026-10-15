const { ContactMessage, Devis, Subscriber } = require('../../models');
const { Op } = require('sequelize');

/**
 * GET /api/dashboard/stats
 * Admin - Statistiques globales du dashboard
 */
const getStats = async (_req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // ── MESSAGES ──────────────────────────────────────
    const [
      totalMessages,
      unreadMessages,
      messagesThisMonth,
      messagesLastMonth,
    ] = await Promise.all([
      ContactMessage.count(),
      ContactMessage.count({ where: { status: 'unread' } }),
      ContactMessage.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
      ContactMessage.count({
        where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } },
      }),
    ]);

    // ── DEVIS ─────────────────────────────────────────
    const [
      totalDevis,
      pendingDevis,
      acceptedDevis,
      devisThisMonth,
    ] = await Promise.all([
      Devis.count(),
      Devis.count({ where: { status: 'pending' } }),
      Devis.count({ where: { status: 'accepted' } }),
      Devis.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
    ]);

    // ── NEWSLETTER ────────────────────────────────────
    const [totalSubscribers, newSubscribersThisMonth] = await Promise.all([
      Subscriber.count({ where: { isActive: true } }),
      Subscriber.count({
        where: { isActive: true, created_at: { [Op.gte]: startOfMonth } },
      }),
    ]);

    // ── 5 DERNIERS MESSAGES ───────────────────────────
    const recentMessages = await ContactMessage.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'email', 'status', 'created_at'],
    });

    // ── 5 DERNIERS DEVIS ─────────────────────────────
    const recentDevis = await Devis.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'email', 'projectType', 'status', 'created_at'],
    });

    return res.status(200).json({
      responseCode: '200',
      responseMessage: 'Statistiques récupérées.',
      data: [
        {
          messages: {
            total: totalMessages,
            unread: unreadMessages,
            thisMonth: messagesThisMonth,
            lastMonth: messagesLastMonth,
            evolutionPercent: messagesLastMonth > 0
              ? Math.round(((messagesThisMonth - messagesLastMonth) / messagesLastMonth) * 100)
              : null,
          },
          devis: {
            total: totalDevis,
            pending: pendingDevis,
            accepted: acceptedDevis,
            thisMonth: devisThisMonth,
          },
          newsletter: {
            totalSubscribers,
            newThisMonth: newSubscribersThisMonth,
          },
          recentMessages,
          recentDevis,
        },
      ],
    });
  } catch (err) {
    console.error('getStats error:', err.message);
    return res.status(500).json({
      responseCode: '500',
      responseMessage: 'Erreur serveur.',
      data: [],
    });
  }
};

module.exports = { getStats };
