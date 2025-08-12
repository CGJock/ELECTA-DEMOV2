//helmet configuration to set in production
import { HelmetOptions } from 'helmet';


const isProd = process.env.NODE_ENV === 'production';

const helmetConfig: HelmetOptions = {
  hsts: isProd
    ? {
        maxAge: 86400, // 60 days
        includeSubDomains: true,
        preload: true
      }
    : false,

  contentSecurityPolicy: isProd
    ? {
        useDefaults: false, // not using defaults
        directives: {
          "default-src": ["'self'"],
          "base-uri": ["'self'"],
          "font-src": ["'self'"],
          "form-action": ["'self'"],
          "frame-ancestors": ["'self'"],
          "img-src": ["'self'", "data:"], // local images and 64
          "object-src": ["'none'"],
          "script-src": ["'self'"],
          "script-src-attr": ["'none'"],
          "style-src": ["'self'", "'unsafe-inline'"], // in line styling
          "media-src": ["'self'"], // local media
          "connect-src": ["'self'"], // prevents external conections
          "frame-src": ["'none'"], // not enmbebed
          "worker-src": ["'none'"]
        }
      }
    : false,

  frameguard: { action: 'sameorigin' },
  hidePoweredBy: true,
  xssFilter: true,
  noSniff: true,
  dnsPrefetchControl: { allow: false }
};

export default helmetConfig;
