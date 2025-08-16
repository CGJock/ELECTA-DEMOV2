import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@db/db.js';
import { JWT_CONFIG, JWTPayload } from '../config/jwt.config.js';
import  { SignOptions } from 'jsonwebtoken';
import { tr } from 'zod/locales';


const secretKey = JWT_CONFIG.SECRET_KEY;

if (!secretKey) {
  throw new Error('JWT_SECRET no definido');
}


const expiredValue = JWT_CONFIG.EXPIRES_IN;

if (!expiredValue) {
  throw new Error('JWT_EXPIRES_IN not defined')
}

const router = Router();

// Registro de administrador (solo para crear el primer admin)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, email, full_name } = req.body;

    // Verificar que el usuario no exista
    const existingUser = await pool.query(
      'SELECT id FROM admins WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar nuevo admin
    const result = await pool.query(
      'INSERT INTO admins (username, password_hash, email, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
      [username, passwordHash, email || null, full_name || null]
    );

    res.status(201).json({
      message: 'Administrador creado exitosamente',
      admin: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        full_name: result.rows[0].full_name
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login de administrador
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Buscar el usuario
    const result = await pool.query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const admin = result.rows[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Validar variables de entorno
    if (!JWT_CONFIG.SECRET_KEY) throw new Error('JWT_TOKEN no definido');
    if (!JWT_CONFIG.EXPIRES_IN) throw new Error('JWT_EXPIRES no definido');

    // Payload compatible con JWTPayload
    const payload: JWTPayload = {
      adminId: admin.id,
      username: admin.username,
      accessCode: JWT_CONFIG.ACCESS_CODE
    };

    // SignOptions
    const options: SignOptions = {
      expiresIn: JWT_CONFIG.EXPIRES_IN as any // forzamos string
    };

    // Generar token
    const token = jwt.sign(payload, JWT_CONFIG.SECRET_KEY as string, options);

    const isProd = process.env.NODE_ENV === 'production';


    // Enviar cookie HttpOnly
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: isProd,  // true en producción, false en desarrollo
      sameSite: isProd ? 'none' : 'lax', // 'none' + secure=true para cross-site en prod
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.json({ message: 'Login exitoso' });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

  function isJWTPayload(obj: any): obj is JWTPayload {
  return obj && typeof obj === 'object' &&
         'adminId' in obj &&
         'username' in obj &&
         'accessCode' in obj;
}



// Verificar token (para verificar si el token es válido)
router.get('/verify', (req: Request, res: Response) => {
  const token = req.cookies?.adminToken;



  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    
    const decodedRaw = jwt.verify(token, secretKey) as unknown;

    if (!isJWTPayload(decodedRaw)) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }

    // Ahora sí casteamos a JWTPayload
    const decoded = decodedRaw as JWTPayload;

    res.json({
      valid: true,
      admin: {
        id: decoded.adminId,
        username: decoded.username
      }
    });
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
});


router.post('/logout', (req: Request, res: Response) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: false, // cambiar a true en producción si usas HTTPS
      sameSite: 'lax',
    });
    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
