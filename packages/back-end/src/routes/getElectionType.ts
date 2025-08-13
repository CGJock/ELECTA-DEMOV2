import { Router, Request, Response } from 'express';
import pool from '@db/db.js';

const router = Router();

// Obtener todos los election types
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT type_id AS "typeId", name_type AS "nameType" FROM election_types ORDER BY type_id;`
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching election types:', err);
    res.status(500).json({ error: 'Internal error fetching election types' });
  }
});

export default router;
