import { Router, Request, Response } from 'express';
import pool from '@db/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        er.id AS election_round_id,
        et.name_type AS election_type,
        e.country,
        e.year,
        er.round_number,
        er.round_date
      FROM election_rounds er
      JOIN elections e ON e.id = er.election_id
      JOIN election_types et ON et.type_id = e.election_type
      ORDER BY e.year DESC, e.country, er.round_number
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching election rounds:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
