import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@db/db.js';
import { JWT_CONFIG, JWTPayload } from '../config/jwt.config.js';

const router = Router();

// Registro de administrador (solo para crear el primer admin)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, accessCode } = req.body;

    // Verificar que el código de acceso sea correcto
    if (accessCode !== JWT_CONFIG.ACCESS_CODE) {
      return res.status(403).json({ error: 'Código de acceso inválido' });
    }

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
      'INSERT INTO admins (username, password_hash, access_code) VALUES ($1, $2, $3) RETURNING id, username',
      [username, passwordHash, accessCode]
    );

    res.status(201).json({
      message: 'Administrador creado exitosamente',
      admin: {
        id: result.rows[0].id,
        username: result.rows[0].username
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
    const { username, password, accessCode } = req.body;

    // Verificar que el código de acceso sea correcto
    if (accessCode !== JWT_CONFIG.ACCESS_CODE) {
      return res.status(403).json({ error: 'Código de acceso inválido' });
    }

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

    // Generar token JWT
    const payload: JWTPayload = {
      adminId: admin.id,
      username: admin.username,
      accessCode
    };

    const token = jwt.sign(payload, JWT_CONFIG.SECRET_KEY);

    res.json({
      message: 'Login exitoso',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token (para verificar si el token es válido)
router.get('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET_KEY) as JWTPayload;
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

export default router;
