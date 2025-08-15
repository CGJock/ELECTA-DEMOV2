import { Request, Response } from 'express';
import pool from '@db/db.js';
import { SiteStatus, UpdateSiteStatusRequest, SiteStatusResponse } from '../types/SiteStatus.js';

export const getSiteStatus = async (req: Request, res: Response): Promise<void> => {
  console.log('🔍 [SiteStatus] GET /api/site-status - Iniciando petición');
  try {
    const result = await pool.query(
      'SELECT * FROM site_status ORDER BY id DESC LIMIT 1'
    );

    if (result.rows.length === 0) {
      console.log('📝 [SiteStatus] No hay estado, creando uno por defecto...');
      // Si no hay estado, crear uno por defecto
      const defaultStatus = await pool.query(
        'INSERT INTO site_status (is_maintenance, maintenance_message) VALUES (FALSE, \'Sitio funcionando normalmente\') RETURNING *'
      );
      
      console.log('✅ [SiteStatus] Estado por defecto creado:', defaultStatus.rows[0]);
      
      // Adaptar la respuesta para el frontend
      const adaptedDefaultData = {
        id: defaultStatus.rows[0].id,
        maintenance_mode: defaultStatus.rows[0].is_maintenance,
        private_access: false, // Por defecto no está en acceso privado
        updated_at: defaultStatus.rows[0].updated_at,
        updated_by: undefined
      };
      
      res.json({
        success: true,
        data: adaptedDefaultData,
        message: 'Estado del sitio creado por defecto'
      });
      return;
    }

    console.log('✅ [SiteStatus] Estado obtenido de la BD:', result.rows[0]);
    
    // Adaptar la respuesta para el frontend
    const adaptedData = {
      id: result.rows[0].id,
      maintenance_mode: result.rows[0].is_maintenance,
      private_access: result.rows[0].maintenance_message === 'Sitio en acceso privado',
      updated_at: result.rows[0].updated_at,
      updated_by: undefined // Campo no existe en tu tabla
    };
    
    res.json({
      success: true,
      data: adaptedData,
      message: 'Estado del sitio obtenido exitosamente'
    });
  } catch (error) {
    console.error('❌ [SiteStatus] Error al obtener estado del sitio:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Error interno del servidor'
    });
  }
};

export const updateSiteStatus = async (req: Request, res: Response): Promise<void> => {
  console.log('🔧 [SiteStatus] PUT /api/site-status - Iniciando actualización');
  console.log('📦 [SiteStatus] Body recibido:', req.body);
  try {
    const { maintenance_mode, private_access }: UpdateSiteStatusRequest = req.body;
    const adminId = (req as any).admin?.adminId; // Asumiendo que tienes middleware de autenticación

    // Validar que al menos un campo esté presente
    if (maintenance_mode === undefined && private_access === undefined) {
      res.status(400).json({
        success: false,
        data: null,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
      return;
    }

    // Construir query dinámicamente
    let query = 'UPDATE site_status SET updated_at = CURRENT_TIMESTAMP';
    const values: any[] = [];
    let paramCount = 1;

    if (maintenance_mode !== undefined) {
      query += `, is_maintenance = $${paramCount}`;
      values.push(maintenance_mode);
      paramCount++;
    }

    if (private_access !== undefined) {
      // Para private_access, actualizamos el maintenance_message
      query += `, maintenance_message = $${paramCount}`;
      const message = private_access ? 'Sitio en acceso privado' : 'Sitio funcionando normalmente';
      values.push(message);
      paramCount++;
    }

    if (adminId) {
      // Nota: updated_by no existe en tu tabla, lo omitimos
      // query += `, updated_by = $${paramCount}`;
      // values.push(adminId);
    }

    query += ' WHERE id = (SELECT id FROM site_status ORDER BY id DESC LIMIT 1) RETURNING *';

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        data: null,
        message: 'No se encontró el estado del sitio'
      });
      return;
    }

    // Adaptar la respuesta para el frontend
    const adaptedUpdatedData = {
      id: result.rows[0].id,
      maintenance_mode: result.rows[0].is_maintenance,
      private_access: result.rows[0].maintenance_message === 'Sitio en acceso privado',
      updated_at: result.rows[0].updated_at,
      updated_by: undefined
    };
    
    res.json({
      success: true,
      data: adaptedUpdatedData,
      message: 'Estado del sitio actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar estado del sitio:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Error interno del servidor'
    });
  }
};
