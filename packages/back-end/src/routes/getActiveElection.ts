import { Router, Request, Response } from 'express';
import pool from '@db/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT election_round_id FROM active_election ORDER BY updated_at DESC LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active election round set.' });
    }

    return res.json({ electionRoundId: result.rows[0].election_round_id });
  } catch (error) {
    console.error('Error fetching active election round:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;