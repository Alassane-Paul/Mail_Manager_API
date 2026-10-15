const Joi = require('joi');

/**
 * Middleware factory - valide req.body avec un schema Joi
 * @param {Joi.Schema} schema
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).json({
      responseCode: '422',
      responseMessage: 'Données invalides.',
      data: errors,
    });
  }

  next();
};

// ── SCHEMAS ──────────────────────────────────────────────────────────────────

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères.',
    'any.required': 'Le nom est requis.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Adresse email invalide.',
    'any.required': "L'email est requis.",
  }),
  phone: Joi.string().min(8).max(20).optional().allow(''),
  message: Joi.string().min(10).max(2000).required().messages({
    'string.min': 'Le message doit contenir au moins 10 caractères.',
    'any.required': 'Le message est requis.',
  }),
});

const devisSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).max(20).optional().allow(''),
  company: Joi.string().max(150).optional().allow(''),
  projectType: Joi.string()
    .valid('site_web', 'application_mobile', 'api', 'design_ui_ux', 'maintenance', 'autre')
    .required()
    .messages({ 'any.required': 'Le type de projet est requis.' }),
  budget: Joi.string()
    .valid('moins_500k', '500k_1m', '1m_3m', '3m_plus', 'a_discuter')
    .default('a_discuter'),
  deadline: Joi.string().max(100).optional().allow(''),
  description: Joi.string().min(20).max(3000).required().messages({
    'string.min': 'La description doit contenir au moins 20 caractères.',
    'any.required': 'La description du projet est requise.',
  }),
});

const subscribeSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Adresse email invalide.',
    'any.required': "L'email est requis.",
  }),
  name: Joi.string().max(100).optional().allow(''),
});

const broadcastSchema = Joi.object({
  subject: Joi.string().min(3).max(200).required(),
  html: Joi.string().min(10).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const registerAdminSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  validate,
  contactSchema,
  devisSchema,
  subscribeSchema,
  broadcastSchema,
  loginSchema,
  registerAdminSchema,
};
