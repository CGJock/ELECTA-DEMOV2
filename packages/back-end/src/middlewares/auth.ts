import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, JWTPayload } from'@configuration/jwt.config.js';

export interface AuthenticatedRequest extends Request {
  admin?: JWTPayload;
}


const secretKey = JWT_CONFIG.SECRET_KEY;

if (!secretKey) {
  throw new Error('JWT_SECRET no definido');
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({ error: 'Token access required' });
  }

  try {
    if (!JWT_CONFIG.SECRET_KEY) throw new Error('JWT_SECRET Not defined');

    const decodedRaw = jwt.verify(token, secretKey);

    if (!decodedRaw || typeof decodedRaw !== 'object') {
      return res.status(403).json({ error: 'Invalid or expired Token' });
    }

 
  const decoded = decodedRaw as JWTPayload;
  req.admin = decoded;
  next();
} catch (error) {
  return res.status(403).json({ error: 'Invalid or expired Token' });
}
};

// export const requireAccessCode = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   if (!req.admin || req.admin.accessCode !== JWT_CONFIG.ACCESS_CODE) {
//     return res.status(403).json({ error: 'Token not valid' });
//   }
//   next();
// };
