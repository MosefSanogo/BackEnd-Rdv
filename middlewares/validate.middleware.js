import Joi from 'joi';

// Schémas de validation par route
const schemas = {

  createAppointment: Joi.object({
    name:     Joi.string().min(2).max(100).required(),
    email:    Joi.string().email().required(),
    phone:    Joi.string().min(7).max(20).required(),
    date:     Joi.date().min('now').required(),
    service:  Joi.string().valid('consultation', 'urgence', 'suivi').required(),
    notes:    Joi.string().max(500).optional().allow(''),
  }),

  register: Joi.object({
    name:     Joi.string().min(2).max(100).required(),
    email:    Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    phone:    Joi.string().min(7).max(20).required(),
    role:     Joi.string().valid('patient', 'doctor', 'admin').default('patient'),
  }),

  login: Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().min(1).required(),
  }),
};

const validateMiddleware = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) return next();

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,   // Retourner toutes les erreurs
      stripUnknown: true,  // Supprimer les champs non définis
    });

    if (error) {
      const errors = error.details.map(d => ({
        field:   d.path[0],
        message: d.message
      }));
      return res.status(422).json({ success: false, errors });
    }

    req.body = value; // Remplacer par les données validées et nettoyées
    next();
  };
};