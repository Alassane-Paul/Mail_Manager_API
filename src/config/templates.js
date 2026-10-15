// ── COULEURS BRAND ────────────────────────────────────────────────────────────
const PRIMARY = '#1a7a4a';
const SECONDARY = '#e87722';
const BG_LIGHT = '#f8fdf9';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';

/**
 * Wrapper HTML commun à tous les emails
 */
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Tutorat Tech</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- HEADER -->
          <tr>
            <td style="background:${PRIMARY};padding:28px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                🌿 Tutorat Tech
              </h1>
              <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">
                Solutions digitales sur mesure
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px;color:${TEXT_DARK};font-size:15px;line-height:1.7;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:${BG_LIGHT};padding:24px 40px;text-align:center;border-top:1px solid #e5f0ea;">
              <p style="color:${TEXT_MUTED};font-size:12px;margin:0;">
                © ${new Date().getFullYear()} Tutorat Tech · Lomé, Togo
              </p>
              <p style="color:${TEXT_MUTED};font-size:12px;margin:6px 0 0;">
                📧 contact@tutoratech.com · 📞 (+228) 90 43 91 87
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Badge de statut coloré
 */
const badge = (label, color = SECONDARY) =>
  `<span style="display:inline-block;background:${color};color:#fff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;">${label}</span>`;

/**
 * Bloc d'information avec label + valeur
 */
const infoRow = (label, value) =>
  `<tr>
    <td style="padding:8px 12px;font-weight:600;color:${TEXT_MUTED};font-size:13px;white-space:nowrap;">${label}</td>
    <td style="padding:8px 12px;color:${TEXT_DARK};font-size:14px;">${value || '—'}</td>
  </tr>`;

/**
 * Bouton CTA
 */
const ctaButton = (label, href) =>
  `<a href="${href}" style="display:inline-block;margin-top:24px;padding:12px 28px;background:${SECONDARY};color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">${label}</a>`;

// ── TEMPLATES ─────────────────────────────────────────────────────────────────

/**
 * Email envoyé à l'admin quand un nouveau message de contact arrive
 */
const adminContactNotification = ({ name, email, phone, message }) =>
  baseTemplate(`
    <h2 style="color:${PRIMARY};margin:0 0 8px;font-size:20px;">📬 Nouveau message de contact</h2>
    <p style="color:${TEXT_MUTED};margin:0 0 24px;font-size:13px;">Reçu via le formulaire de contact du site</p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:${BG_LIGHT};border-radius:8px;border:1px solid #e5f0ea;margin-bottom:24px;">
      <tbody>
        ${infoRow('Nom', name)}
        ${infoRow('Email', `<a href="mailto:${email}" style="color:${PRIMARY};">${email}</a>`)}
        ${infoRow('Téléphone', phone)}
      </tbody>
    </table>

    <p style="font-weight:600;color:${TEXT_MUTED};font-size:13px;margin:0 0 8px;">Message :</p>
    <div style="background:#f9fafb;border-left:4px solid ${PRIMARY};padding:16px 20px;border-radius:0 8px 8px 0;font-size:14px;line-height:1.8;color:${TEXT_DARK};">
      ${message}
    </div>

    ${ctaButton('Répondre à ' + name, `mailto:${email}`)}
  `);

/**
 * Email de confirmation envoyé au client après son message de contact
 */
const clientContactConfirmation = ({ name }) =>
  baseTemplate(`
    <h2 style="color:${PRIMARY};margin:0 0 16px;font-size:20px;">Merci pour votre message, ${name} ! 🙏</h2>

    <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais, généralement <strong>sous 24 à 48 heures ouvrées</strong>.</p>

    <p>En attendant, n'hésitez pas à consulter nos services ou à nous appeler directement :</p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:${BG_LIGHT};border-radius:8px;border:1px solid #e5f0ea;margin:20px 0;">
      <tbody>
        ${infoRow('Téléphone', '(+228) 90 43 91 87')}
        ${infoRow('Email', 'contact@tutoratech.com')}
        ${infoRow('Adresse', '200 Rue Malfakasar, Adakpamé, Lomé')}
      </tbody>
    </table>

    <p style="color:${TEXT_MUTED};font-size:13px;">
      Cordialement,<br/>
      <strong style="color:${TEXT_DARK};">L'équipe Tutorat Tech</strong>
    </p>
  `);

/**
 * Email envoyé à l'admin pour une nouvelle demande de devis
 */
const adminDevisNotification = ({ name, email, phone, company, projectType, budget, deadline, description }) =>
  baseTemplate(`
    <h2 style="color:${PRIMARY};margin:0 0 8px;font-size:20px;">💼 Nouvelle demande de devis</h2>
    <p style="color:${TEXT_MUTED};margin:0 0 24px;font-size:13px;">
      ${badge('URGENT', SECONDARY)} À traiter dans les meilleurs délais
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:${BG_LIGHT};border-radius:8px;border:1px solid #e5f0ea;margin-bottom:24px;">
      <tbody>
        ${infoRow('Client', name)}
        ${infoRow('Email', `<a href="mailto:${email}" style="color:${PRIMARY};">${email}</a>`)}
        ${infoRow('Téléphone', phone)}
        ${infoRow('Entreprise', company)}
        ${infoRow('Type de projet', projectType?.replace(/_/g, ' '))}
        ${infoRow('Budget', budget?.replace(/_/g, ' '))}
        ${infoRow('Délai souhaité', deadline)}
      </tbody>
    </table>

    <p style="font-weight:600;color:${TEXT_MUTED};font-size:13px;margin:0 0 8px;">Description du projet :</p>
    <div style="background:#f9fafb;border-left:4px solid ${SECONDARY};padding:16px 20px;border-radius:0 8px 8px 0;font-size:14px;line-height:1.8;color:${TEXT_DARK};">
      ${description}
    </div>

    ${ctaButton('Répondre à ' + name, `mailto:${email}`)}
  `);

/**
 * Confirmation client après demande de devis
 */
const clientDevisConfirmation = ({ name, projectType }) =>
  baseTemplate(`
    <h2 style="color:${PRIMARY};margin:0 0 16px;font-size:20px;">Votre demande de devis a été reçue ! ✅</h2>

    <p>Bonjour <strong>${name}</strong>,</p>
    <p>
      Nous avons bien reçu votre demande de devis pour un projet de type
      <strong>${projectType?.replace(/_/g, ' ')}</strong>.
    </p>

    <p>Notre équipe va analyser votre besoin et vous enverra une proposition détaillée dans un délai de <strong>2 à 5 jours ouvrés</strong>.</p>

    <div style="background:${BG_LIGHT};border-radius:8px;padding:20px;border:1px solid #e5f0ea;margin:20px 0;">
      <p style="margin:0;font-weight:600;color:${PRIMARY};">🚀 Prochaines étapes</p>
      <ol style="margin:12px 0 0;padding-left:20px;color:${TEXT_DARK};font-size:14px;line-height:2;">
        <li>Analyse de votre demande par notre équipe technique</li>
        <li>Envoi de votre devis personnalisé par email</li>
        <li>Appel de cadrage pour valider les détails</li>
        <li>Démarrage du projet !</li>
      </ol>
    </div>

    <p style="color:${TEXT_MUTED};font-size:13px;">
      Cordialement,<br/>
      <strong style="color:${TEXT_DARK};">L'équipe Tutorat Tech</strong>
    </p>
  `);

/**
 * Mail de bienvenue newsletter
 */
const newsletterWelcome = ({ name, unsubscribeToken }) =>
  baseTemplate(`
    <h2 style="color:${PRIMARY};margin:0 0 16px;font-size:20px;">Bienvenue dans la communauté Tutorat Tech ! 🎉</h2>

    <p>Bonjour <strong>${name || 'cher abonné'}</strong>,</p>
    <p>
      Vous êtes maintenant abonné à notre newsletter. Vous recevrez en exclusivité :
    </p>

    <ul style="color:${TEXT_DARK};font-size:14px;line-height:2.2;padding-left:20px;">
      <li>📰 Nos dernières actualités et projets réalisés</li>
      <li>💡 Nos conseils et guides sur le digital en Afrique</li>
      <li>🎁 Nos offres et promotions exclusives</li>
    </ul>

    <p style="color:${TEXT_MUTED};font-size:12px;margin-top:32px;border-top:1px solid #e5f0ea;padding-top:16px;">
      Vous vous êtes abonné par erreur ?
      <a href="${process.env.API_URL || 'http://localhost:4000'}/api/newsletter/unsubscribe?token=${unsubscribeToken}"
         style="color:${TEXT_MUTED};text-decoration:underline;">Se désabonner</a>
    </p>
  `);

/**
 * Email de broadcast newsletter (contenu libre)
 */
const newsletterBroadcast = ({ subject, html, unsubscribeToken }) =>
  baseTemplate(`
    <h2 style="color:${PRIMARY};margin:0 0 24px;font-size:20px;">${subject}</h2>
    <div style="font-size:14px;line-height:1.8;color:${TEXT_DARK};">${html}</div>

    <p style="color:${TEXT_MUTED};font-size:12px;margin-top:32px;border-top:1px solid #e5f0ea;padding-top:16px;">
      Vous recevez cet email car vous êtes abonné à la newsletter Tutorat Tech.
      <a href="${process.env.API_URL || 'http://localhost:4000'}/api/newsletter/unsubscribe?token=${unsubscribeToken}"
         style="color:${TEXT_MUTED};text-decoration:underline;">Se désabonner</a>
    </p>
  `);

module.exports = {
  adminContactNotification,
  clientContactConfirmation,
  adminDevisNotification,
  clientDevisConfirmation,
  newsletterWelcome,
  newsletterBroadcast,
};
