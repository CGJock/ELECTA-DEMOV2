import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /users
router.get('/departments', async (_req, res) => {
  console.log('➡️  GET /departments hit');
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY id');
    res.json(result.rows);
    console.log(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener departaments' });
  }
});

export default router;
