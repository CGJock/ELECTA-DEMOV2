import { Router, Request, Response } from 'express';
import pool from '@db/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        ae.election_round_id,
        er.round_number,
        er.round_date,
        e.id AS election_id,
        e.country,
        e.year,
        et.name_type AS election_type
      FROM active_election ae
      JOIN election_rounds er ON er.id = ae.election_round_id
      JOIN elections e ON e.id = er.election_id
      JOIN election_types et ON et.type_id = e.election_type
      ORDER BY ae.updated_at DESC
      LIMIT 1;
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active election round set.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching active election round:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
