import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet'
import helmetConfig from '@configuration/helmet.config.js'

// Middleware for  API Key validation
export function validateApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.ENDPOINT_API_KEY;

  if (!apiKey || apiKey !== expectedKey) {
    res.status(403).json({ error: 'API key not valid' });
    return; 
  }

  next(); // calls next
}


//Middleware Helmet
export const useHelmet = helmet(helmetConfig);

// Middleware para limitar cantidad de peticiones por IP
export const votosLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,              // 100xminute requests max
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, try later.',
});
