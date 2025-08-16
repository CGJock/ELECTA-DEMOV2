import { Router, Request, Response } from 'express';
import pool from '@db/db.js';
import { 
  WhitelistUser, 
  CreateWhitelistUserRequest, 
  UpdateWhitelistUserRequest, 
  WhitelistUserFilters,
  WhitelistUserResponse,
  WhitelistVerificationRequest,
  WhitelistVerificationResponse
} from '../types/WhitelistUser.js';

const router = Router();

// Middleware para verificar si el usuario es admin
const requireAdmin = (req: Request, res: Response, next: Function) => {
  // Aquí deberías verificar el token JWT del admin
  // Por ahora lo dejamos simple, pero deberías implementar la verificación completa
  const adminToken = req.headers.authorization?.replace('Bearer ', '');
  
  if (!adminToken) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token de administrador requerido' 
    });
  }
  
  // TODO: Implementar verificación JWT completa
  next();
};

// GET /api/whitelist - Obtener lista de usuarios con filtros y paginación
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query as WhitelistUserFilters;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    // Filtro por status
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    // Filtro de búsqueda
    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Calcular offset para paginación
    const offset = (page - 1) * limit;
    
    // Query para contar total de registros
    const countQuery = `SELECT COUNT(*) FROM whitelist_users ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Query principal con paginación
    const mainQuery = `
      SELECT * FROM whitelist_users 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const result = await pool.query(mainQuery, params);
    
    const response: WhitelistUserResponse = {
      success: true,
      data: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error al obtener usuarios de whitelist:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// POST /api/whitelist - Crear nuevo usuario en whitelist
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, email, notes }: CreateWhitelistUserRequest = req.body;
    
    // Validaciones básicas
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Nombre y email son requeridos'
      });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }
    
    // Verificar si el email ya existe
    const existingUser = await pool.query(
      'SELECT id FROM whitelist_users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'El email ya existe en la whitelist'
      });
    }
    
    // Insertar nuevo usuario
    const result = await pool.query(
      `INSERT INTO whitelist_users (name, email, notes, created_by) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, email, notes || null, req.body.adminId || null]
    );
    
    const response: WhitelistUserResponse = {
      success: true,
      data: result.rows[0],
      message: 'Usuario agregado a la whitelist exitosamente'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error al crear usuario en whitelist:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// PUT /api/whitelist/:id - Actualizar usuario de whitelist
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateWhitelistUserRequest = req.body;
    
    // Verificar que el usuario existe
    const existingUser = await pool.query(
      'SELECT id FROM whitelist_users WHERE id = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    // Construir query de actualización dinámicamente
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updateData.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(updateData.name);
      paramIndex++;
    }
    
    if (updateData.email !== undefined) {
      // Verificar que el nuevo email no exista en otro usuario
      const emailCheck = await pool.query(
        'SELECT id FROM whitelist_users WHERE email = $1 AND id != $2',
        [updateData.email, id]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'El email ya existe en otro usuario'
        });
      }
      
      updateFields.push(`email = $${paramIndex}`);
      values.push(updateData.email);
      paramIndex++;
    }
    
    if (updateData.status !== undefined) {
      updateFields.push(`status = $${paramIndex}`);
      values.push(updateData.status);
      paramIndex++;
    }
    
    if (updateData.notes !== undefined) {
      updateFields.push(`notes = $${paramIndex}`);
      values.push(updateData.notes);
      paramIndex++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay campos para actualizar'
      });
    }
    
    // Agregar el ID al final de los valores
    values.push(id);
    
    const updateQuery = `
      UPDATE whitelist_users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, values);
    
    const response: WhitelistUserResponse = {
      success: true,
      data: result.rows[0],
      message: 'Usuario actualizado exitosamente'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error al actualizar usuario de whitelist:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// DELETE /api/whitelist/:id - Eliminar usuario de whitelist
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe
    const existingUser = await pool.query(
      'SELECT id FROM whitelist_users WHERE id = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    // Eliminar usuario
    await pool.query('DELETE FROM whitelist_users WHERE id = $1', [id]);
    
    const response: WhitelistUserResponse = {
      success: true,
      message: 'Usuario eliminado de la whitelist exitosamente'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error al eliminar usuario de whitelist:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// POST /api/whitelist/verify - Verificar acceso de usuario
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { name, email, password }: any = req.body;
    
    // TEMPORAL: Solo verificar contraseña
    const GENERAL_PASSWORD = process.env.GENERAL_ACCESS_PASSWORD;
    
    if (!GENERAL_PASSWORD) {
      return res.status(500).json({
        success: false,
        allowed: false,
        message: 'Error de configuración del servidor'
      });
    }
    
    if (!password || password !== GENERAL_PASSWORD) {
      return res.json({
        success: true,
        allowed: false,
        message: 'Contraseña incorrecta'
      });
    }
    
    // TEMPORAL: Acceso directo con contraseña
    return res.json({
      success: true,
      allowed: true,
      message: 'Acceso permitido',
      user: { id: 0, name: 'Usuario Temporal', email: 'temp@electa.com', status: 'approved' }
    });
    
    /* CÓDIGO ORIGINAL COMENTADO - RESTAURAR PRÓXIMA SEMANA
    // Validaciones básicas
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        allowed: false,
        message: 'Nombre y email son requeridos'
      });
    }
    
    // Buscar usuario en la whitelist
    const result = await pool.query(
      'SELECT * FROM whitelist_users WHERE name = $1 AND email = $2',
      [name, email]
    );
    
    if (result.rows.length === 0) {
      const response: WhitelistVerificationResponse = {
        success: true,
        allowed: false,
        message: 'Usuario no encontrado en la lista blanca'
      };
      return res.json(response);
    }
    
    const user = result.rows[0];
    
    // Verificar status
    if (user.status === 'approved') {
      const response: WhitelistVerificationResponse = {
        success: true,
        allowed: true,
        message: 'Acceso permitido',
        user
      };
      res.json(response);
    } else if (user.status === 'denied') {
      const response: WhitelistVerificationResponse = {
        success: true,
        allowed: false,
        message: 'Acceso denegado por administrador'
      };
      res.json(response);
    } else {
      const response: WhitelistVerificationResponse = {
        success: true,
        allowed: false,
        message: 'Usuario pendiente de aprobación'
      };
      res.json(response);
    }
    */
  } catch (error) {
    console.error('Error al verificar acceso:', error);
    res.status(500).json({
      success: false,
      allowed: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;
