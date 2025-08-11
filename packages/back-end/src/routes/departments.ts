import { Router } from 'express';
import pool from '@db/db.js';

const router = Router();

// GET /departments
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY code');
    res.status(200).json(result.rows);
    console.log(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener departaments' });
  }
});

export default router;
