import jwt from 'jsonwebtoken';

const authMiddleware = (roles = []) => {
  return (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Vérifier le rôle si spécifié
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: 'Accès refusé' });
      }

      req.user = decoded;
      next();

    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expiré' });
      }
      return res.status(401).json({ success: false, message: 'Token invalide' });
    }
  };
};

export default authMiddleware;