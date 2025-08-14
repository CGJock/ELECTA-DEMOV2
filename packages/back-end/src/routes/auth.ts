import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@db/db.js';
import { JWT_CONFIG, JWTPayload } from '../config/jwt.config.js';

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
    
    console.log('🔐 [LOGIN] Intento de login:', { username, password: password ? '***' : 'undefined' });

    // Buscar el usuario
    const result = await pool.query(
      'SELECT id, username, password_hash, email, full_name FROM admins WHERE username = $1',
      [username]
    );

    console.log('🔍 [LOGIN] Resultado de búsqueda:', { 
      encontrado: result.rows.length > 0, 
      cantidad: result.rows.length 
    });

    if (result.rows.length === 0) {
      console.log('❌ [LOGIN] Usuario no encontrado:', username);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const admin = result.rows[0];
    console.log('👤 [LOGIN] Admin encontrado:', { 
      id: admin.id, 
      username: admin.username,
      email: admin.email,
      password_hash_preview: admin.password_hash ? admin.password_hash.substring(0, 20) + '...' : 'undefined'
    });

    // Verificar contraseña
    console.log('🔑 [LOGIN] Verificando contraseña...');
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    console.log('🔑 [LOGIN] Resultado de verificación:', { 
      password_provided: !!password, 
      password_hash_exists: !!admin.password_hash,
      is_valid: isValidPassword 
    });
    
    if (!isValidPassword) {
      console.log('❌ [LOGIN] Contraseña inválida para usuario:', username);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const payload: JWTPayload = {
      adminId: admin.id,
      username: admin.username,
      accessCode: JWT_CONFIG.ACCESS_CODE // Mantenemos esto por compatibilidad
    };

    const token = jwt.sign(payload, JWT_CONFIG.SECRET_KEY);
    
    console.log('✅ [LOGIN] Login exitoso para usuario:', username);
    console.log('🎫 [LOGIN] Token generado:', token.substring(0, 20) + '...');

    res.json({
      message: 'Login exitoso',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name
      }
    });
  } catch (error) {
    console.error('💥 [LOGIN] Error en login:', error);
    console.error('💥 [LOGIN] Stack trace:', (error as Error).stack);
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
