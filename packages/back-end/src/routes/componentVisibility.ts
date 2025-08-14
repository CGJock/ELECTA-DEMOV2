import express from 'express';
import pool from '@db/db.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// GET /phases - Obtener todas las fases disponibles
router.get('/phases', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT phase_name, phase_display_name FROM component_visibility ORDER BY phase_name'
    );
    
    const phases = result.rows.map(row => row.phase_name);
    res.json(phases);
  } catch (error) {
    console.error('Error fetching phases:', error);
    // En caso de error, devolver fases por defecto
    res.json(['before', 'during', 'after', 'results']);
  }
});

// GET /active-phase - Obtener la fase activa actual
router.get('/active-phase', async (req, res) => {
  try {
    // Buscar la fase activa en component_visibility
    const result = await pool.query(
      'SELECT phase_name FROM component_visibility WHERE is_active = true LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      return res.json({ phase_name: 'before' });
    }
    
    res.json({ phase_name: result.rows[0].phase_name });
  } catch (error) {
    console.error('Error fetching active phase:', error);
    // En caso de error, devolver fase por defecto
    res.json({ phase_name: 'before' });
  }
});

// PUT /activate-phase - Activar una fase específica
router.put('/activate-phase', async (req, res) => {
  try {
    const { phase_name } = req.body;
    
    if (!phase_name) {
      return res.status(400).json({ error: 'phase_name es requerido' });
    }

    // Verificar que la fase existe
    const phaseCheck = await pool.query(
      'SELECT COUNT(*) FROM component_visibility WHERE phase_name = $1',
      [phase_name]
    );
    
    if (parseInt(phaseCheck.rows[0].count) === 0) {
      return res.status(404).json({ error: 'Fase no encontrada' });
    }

    // Desactivar todas las fases
    await pool.query(
      'UPDATE component_visibility SET is_active = false'
    );

    // Activar la fase seleccionada
    await pool.query(
      'UPDATE component_visibility SET is_active = true WHERE phase_name = $1',
      [phase_name]
    );

    res.json({ message: 'Fase activada correctamente', phase_name });
  } catch (error) {
    console.error('Error activating phase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /phase-components/:phaseName - Obtener componentes de una fase específica
router.get('/phase-components/:phaseName', async (req, res) => {
  try {
    const { phaseName } = req.params;
    
    // Primero obtener el phase_id de component_visibility
    const phaseResult = await pool.query(
      'SELECT id FROM component_visibility WHERE phase_name = $1',
      [phaseName]
    );
    
    if (phaseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Fase no encontrada' });
    }
    
    const phaseId = phaseResult.rows[0].id;
    
    // Luego obtener los componentes de esa fase desde phase_components
    const result = await pool.query(
      'SELECT component_name, component_display_name, is_visible, sort_order FROM phase_components WHERE phase_id = $1 ORDER BY sort_order',
      [phaseId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching phase components:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /update-component - Actualizar visibilidad de un componente
router.put('/update-component', async (req, res) => {
  try {
    const { component_name, phase_name, is_visible } = req.body;
    
    if (!component_name || !phase_name || typeof is_visible !== 'boolean') {
      return res.status(400).json({ 
        error: 'component_name, phase_name e is_visible son requeridos' 
      });
    }

    // Primero obtener el phase_id de component_visibility
    const phaseResult = await pool.query(
      'SELECT id FROM component_visibility WHERE phase_name = $1',
      [phase_name]
    );
    
    if (phaseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Fase no encontrada' });
    }
    
    const phaseId = phaseResult.rows[0].id;
    
    // Actualizar la visibilidad del componente en phase_components
    const result = await pool.query(`
      UPDATE phase_components 
      SET is_visible = $1, updated_at = NOW()
      WHERE phase_id = $2 AND component_name = $3
      RETURNING component_name, component_display_name, is_visible, sort_order
    `, [is_visible, phaseId, component_name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Componente no encontrado en esta fase' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating component visibility:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /apply-changes - Aplicar cambios de visibilidad
router.post('/apply-changes', async (req, res) => {
  try {
    const { phase_name, components } = req.body;
    
    if (!phase_name || !Array.isArray(components)) {
      return res.status(400).json({ 
        error: 'phase_name y components son requeridos' 
      });
    }

    // Primero obtener el phase_id de component_visibility
    const phaseResult = await pool.query(
      'SELECT id FROM component_visibility WHERE phase_name = $1',
      [phase_name]
    );
    
    if (phaseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Fase no encontrada' });
    }
    
    const phaseId = phaseResult.rows[0].id;

    // Aplicar todos los cambios en una transacción
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const component of components) {
        await client.query(`
          UPDATE phase_components 
          SET is_visible = $1, updated_at = NOW()
          WHERE phase_id = $2 AND component_name = $3
        `, [component.is_visible, phaseId, component.component_name]);
      }
      
      await client.query('COMMIT');
      res.json({ message: 'Cambios aplicados correctamente' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error applying changes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /site-config - Obtener configuración del sitio
router.get('/site-config', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT config_key, config_value FROM site_config ORDER BY config_key'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching site config:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
