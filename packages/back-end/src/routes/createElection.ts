import { Router, Request, Response } from 'express';
import pool from '@db/db.js';
import { z } from 'zod';

const router = Router();

const electionCreationSchema = z.object({
  election_type: z.number(),
  country: z.string().min(2),
  year: z.number().int().min(1000).max(9999),
  round_number: z.enum(['1', '2']).transform(Number),
  round_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

router.post('/', async (req: Request, res: Response) => {
  const parseResult = electionCreationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() });
  }
  const { election_type, country, year, round_number, round_date } = parseResult.data;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insertar o actualizar elección
    const electionRes = await client.query(
      `INSERT INTO elections (election_type, country, year)
       VALUES ($1, $2, $3)
       ON CONFLICT (election_type, country, year) DO UPDATE SET country = EXCLUDED.country
       RETURNING id`,
      [election_type, country, year]
    );
    const electionId = electionRes.rows[0].id;

    // 2. Insertar o actualizar ronda
    const roundRes = await client.query(
      `INSERT INTO election_rounds (election_id, round_number, round_date)
       VALUES ($1, $2, $3)
       ON CONFLICT (election_id, round_number) DO UPDATE SET round_date = EXCLUDED.round_date
       RETURNING id`,
      [electionId, round_number, round_date]
    );
    const electionRoundId = roundRes.rows[0].id;

    // 3. Guardar la elección activa en la tabla active_election
    const updateRes = await client.query(
      `UPDATE active_election SET election_round_id = $1, updated_at = NOW()`,
      [electionRoundId]
    );

    if (updateRes.rowCount === 0) {
      // No había registro, insertamos uno nuevo
      await client.query(
        `INSERT INTO active_election (election_round_id) VALUES ($1)`,
        [electionRoundId]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Election and round created and set as active in DB.',
      electionId,
      electionRoundId,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating election and round:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

export default router;
