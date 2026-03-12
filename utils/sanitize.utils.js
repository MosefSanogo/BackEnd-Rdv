import validator from 'validator';

const sanitizeUtils = {

  cleanString: (str, maxLength = 255) => {
    if (typeof str !== 'string') return '';
    return str
      .trim()
      .slice(0, maxLength)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // caractères de contrôle
      .replace(/[<>]/g, '')                                // balises HTML basiques
  },

  escapeHTML: (str) => {
    if (typeof str !== 'string') return '';
    return validator.escape(str);
  },

  cleanEmail: (email) => {
    if (typeof email !== 'string') return '';
    return validator.normalizeEmail(email.trim().toLowerCase()) || '';
  },

  cleanPhone: (phone) => {
    if (typeof phone !== 'string') return '';
    return phone.replace(/[^\d+\s\-().]/g, '').slice(0, 20);
  },

  isValidEmail: (email) => validator.isEmail(email),

  isValidPhone: (phone) => validator.isMobilePhone(phone, 'any', { strictMode: false }),

  isValidURL: (url) => validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  }),

  isStrongPassword: (password) => validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  }),

  detectSQLInjection: (str) => {
    const sqlPatterns = [
      /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
      /(\bUNION\b|\bJOIN\b|\bWHERE\b|\bHAVING\b|\bGROUP BY\b)/gi,
      /(--|;|\/\*|\*\/|xp_)/g,
      /(\bOR\b|\bAND\b)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/gi,
    ];
    return sqlPatterns.some(pattern => pattern.test(str));
  },

  detectXSS: (str) => {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript\s*:/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /<iframe|<object|<embed|<link|<meta/gi,
      /eval\s*\(/gi,
      /document\.(cookie|write|location)/gi,
    ];
    return xssPatterns.some(pattern => pattern.test(str));
  }
};

export default sanitizeUtils