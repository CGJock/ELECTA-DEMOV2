import { Router, Request, Response } from 'express';
import pool from '@db/db.js';

const router = Router();

// POST /api/active-election
router.post('/', async (req: Request, res: Response) => {
  const { electionRoundId } = req.body;

  if (!electionRoundId || typeof electionRoundId !== 'number') {
    return res.status(400).json({ error: 'electionRoundId (number) is required' });
  }

  try {
    // Intentamos actualizar primero
    const updateResult = await pool.query(
      `UPDATE active_election SET election_round_id = $1, updated_at = NOW() RETURNING *`,
      [electionRoundId]
    );

    // Si no hay filas actualizadas, insertamos
    if (updateResult.rowCount === 0) {
      await pool.query(
        `INSERT INTO active_election (election_round_id) VALUES ($1)`,
        [electionRoundId]
      );
    }

    res.json({ message: 'Active election round set', electionRoundId });
  } catch (error) {
    console.error('Error setting active election round:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
