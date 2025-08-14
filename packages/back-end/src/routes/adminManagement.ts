import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '@db/db.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

// Middleware para verificar que solo super admins puedan gestionar otros admins
const requireSuperAdmin = async (req: AuthenticatedRequest, res: Response, next: Function) => {
  try {
    // Por ahora, permitimos que cualquier admin autenticado pueda gestionar
    // En el futuro puedes implementar roles más específicos
    next();
  } catch (error) {
    res.status(403).json({ error: 'Acceso denegado' });
  }
};

// Obtener todos los administradores
router.get('/', authenticateToken, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, full_name, created_at FROM admins ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      admins: result.rows
    });
  } catch (error) {
    console.error('Error al obtener administradores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener un administrador por ID
router.get('/:id', authenticateToken, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT id, username, email, full_name, created_at FROM admins WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }
    
    res.json({
      success: true,
      admin: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo administrador
router.post('/', authenticateToken, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { username, password, email, full_name } = req.body;
    
    // Validaciones básicas
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    // Verificar que el username no exista
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
      'INSERT INTO admins (username, password_hash, email, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name, created_at',
      [username, passwordHash, email || null, full_name || null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      admin: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar administrador
router.put('/:id', authenticateToken, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, full_name, password } = req.body;
    
    // Verificar que el administrador existe
    const existingAdmin = await pool.query(
      'SELECT id FROM admins WHERE id = $1',
      [id]
    );
    
    if (existingAdmin.rows.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }
    
    // Si se está cambiando el username, verificar que no exista
    if (username) {
      const usernameCheck = await pool.query(
        'SELECT id FROM admins WHERE username = $1 AND id != $2',
        [username, id]
      );
      
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe' });
      }
    }
    
    // Construir query de actualización
    let updateQuery = 'UPDATE admins SET ';
    let updateValues = [];
    let paramCount = 1;
    
    if (username) {
      updateQuery += `username = $${paramCount}, `;
      updateValues.push(username);
      paramCount++;
    }
    
    if (email !== undefined) {
      updateQuery += `email = $${paramCount}, `;
      updateValues.push(email);
      paramCount++;
    }
    
    if (full_name !== undefined) {
      updateQuery += `full_name = $${paramCount}, `;
      updateValues.push(full_name);
      paramCount++;
    }
    
    // Si se está cambiando la contraseña
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }
      
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      updateQuery += `password_hash = $${paramCount}, `;
      updateValues.push(passwordHash);
      paramCount++;
    }
    
    // Remover la última coma y espacio
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = $${paramCount}`;
    updateValues.push(id);
    
    await pool.query(updateQuery, updateValues);
    
    // Obtener el admin actualizado
    const result = await pool.query(
      'SELECT id, username, email, full_name, created_at FROM admins WHERE id = $1',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Administrador actualizado exitosamente',
      admin: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar administrador
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar que el administrador existe
    const existingAdmin = await pool.query(
      'SELECT id FROM admins WHERE id = $1',
      [id]
    );
    
    if (existingAdmin.rows.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }
    
    // No permitir eliminar el admin principal (id = 1)
    if (parseInt(id) === 1) {
      return res.status(400).json({ error: 'No se puede eliminar el administrador principal' });
    }
    
    // Eliminar el admin
    await pool.query('DELETE FROM admins WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Administrador eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Cambiar contraseña del administrador actual
router.post('/change-password', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
          const adminId = req.admin?.adminId;

    if (!adminId) {
      return res.status(401).json({ success: false, error: 'No autorizado' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Contraseña actual y nueva son requeridas' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Obtener admin actual
    const adminResult = await pool.query('SELECT password_hash FROM admins WHERE id = $1', [adminId]);
    if (adminResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Administrador no encontrado' });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, adminResult.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, error: 'Contraseña actual incorrecta' });
    }

    // Hash nueva contraseña
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $1', [newPasswordHash, adminId]);

    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Resetear contraseña de otro admin (solo super admin)
router.post('/reset-password/:id', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const adminId = parseInt(req.params.id);
    const { newPassword } = req.body;

    if (!adminId || adminId <= 0) {
      return res.status(400).json({ success: false, error: 'ID de administrador inválido' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar que el admin existe
    const adminResult = await pool.query('SELECT username FROM admins WHERE id = $1', [adminId]);
    if (adminResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Administrador no encontrado' });
    }

    // No permitir resetear contraseña del admin principal (ID 1)
    if (adminId === 1) {
      return res.status(403).json({ success: false, error: 'No se puede resetear la contraseña del administrador principal' });
    }

    // Hash nueva contraseña
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [newPasswordHash, adminId]);

    res.json({ 
      success: true, 
      message: `Contraseña reseteada exitosamente para ${adminResult.rows[0].username}`,
      newPassword: newPassword // Solo para mostrar al admin que reseteó
    });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

export default router;
