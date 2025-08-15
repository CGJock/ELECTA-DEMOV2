import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, JWTPayload } from'@configuration/jwt.config.js';

export interface AuthenticatedRequest extends Request {
  admin?: JWTPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET_KEY) as JWTPayload;
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export const requireAccessCode = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.admin || req.admin.accessCode !== JWT_CONFIG.ACCESS_CODE) {
    return res.status(403).json({ error: 'Código de acceso inválido' });
  }
  next();
};
