import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

const securityMiddleware = [

  // Headers HTTP sécurisés
  helmet(),

  // Prévention injection NoSQL (MongoDB)
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`Tentative injection NoSQL détectée: ${key}`);
    }
  }),

  // Protection contre la pollution des paramètres HTTP
  hpp(),
];

export default securityMiddleware;