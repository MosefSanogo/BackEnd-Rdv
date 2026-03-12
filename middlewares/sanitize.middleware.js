import sanitizeUtils from "../utils/sanitize.utils.js";

const sanitizeMiddleware = (req, res, next) => {

  // Vérifie et nettoie une valeur string
  const sanitizeValue = (key, value) => {
    if (typeof value !== 'string') return value;

    if (sanitizeUtils.detectSQLInjection(value)) {
      return { __error__: true, message: 'Requête invalide détectée', field: key };
    }

    if (sanitizeUtils.detectXSS(value)) {
      return { __error__: true, message: 'Contenu non autorisé détecté', field: key };
    }

    if (key.toLowerCase().includes('email')) {
      return sanitizeUtils.cleanEmail(value);
    }
    if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel')) {
      return sanitizeUtils.cleanPhone(value);
    }
    return sanitizeUtils.cleanString(sanitizeUtils.escapeHTML(value));
  };

  // Modifie l'objet EN PLACE sans le réassigner
  const sanitizeInPlace = (obj) => {
    if (!obj || typeof obj !== 'object') return null;

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        const result = sanitizeValue(key, value);

        // Si erreur détectée, retourner l'erreur
        if (result?.__error__) return result;

        obj[key] = result;

      } else if (typeof value === 'object' && value !== null) {
        const nested = sanitizeInPlace(value);
        if (nested?.__error__) return nested;
      }
    }
    return null;
  };

  // Sanitize body (réassignable)
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return { cleaned: obj, error: null };

    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        const result = sanitizeValue(key, value);
        if (result?.__error__) return { cleaned: null, error: result };
        cleaned[key] = result;
      } else if (typeof value === 'object' && value !== null) {
        const { cleaned: nestedCleaned, error } = sanitizeObject(value);
        if (error) return { cleaned: null, error };
        cleaned[key] = nestedCleaned;
      } else {
        cleaned[key] = value;
      }
    }
    return { cleaned, error: null };
  };

  // --- body : réassignable normalement ---
  const { cleaned, error: bodyError } = sanitizeObject(req.body);
  if (bodyError) {
    return res.status(400).json({ success: false, ...bodyError });
  }
  req.body = cleaned;

  // --- query : modifier EN PLACE (read-only en Express) ---
  const queryError = sanitizeInPlace(req.query);
  if (queryError) {
    return res.status(400).json({ success: false, ...queryError });
  }

  // --- params : modifier EN PLACE (read-only en Express) ---
  const paramsError = sanitizeInPlace(req.params);
  if (paramsError) {
    return res.status(400).json({ success: false, ...paramsError });
  }

  next();
};

export default sanitizeMiddleware;