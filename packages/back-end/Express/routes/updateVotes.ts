import { Router, Request, Response } from 'express';
import pool from '../src/database/db.js';

const router = Router();

interface PartyVote {
  abbr: string;
  votes: number;
}

interface VoteRequestBody {
  department?: string;
  null_votes?: number;
  blank_votes?: number;
  total_votes?: number;
  partyvotes?: PartyVote[];
}

router.post('/', async (req: Request<{}, {}, VoteRequestBody>, res: Response) => {
  const {
    department,
    null_votes = 0,
    blank_votes = 0,
    total_votes = 0,
    partyvotes = []
  } = req.body;

  const valid_votes = total_votes - null_votes - blank_votes;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const departmentNormalized = department?.trim().toUpperCase();

    // ✅ Buscar el id del departamento por name
    const deptResult = await client.query(
      `SELECT id FROM departments WHERE UPPER(TRIM(name)) = $1`,
      [departmentNormalized]
    );

    if (deptResult.rows.length === 0) {
      throw new Error(`No se encontró el departamento con name '${department}'`);
    }

    const department_id = deptResult.rows[0].id;

    // makes sure the row exist, since is a single row table
    await client.query(`
        INSERT INTO votes (id, valid_votes, blank_votes, null_votes)
        VALUES (1, 0, 0, 0)
        ON CONFLICT (id) DO NOTHING;
      `);

      // update global
      await client.query(`
        UPDATE votes
        SET
          valid_votes = valid_votes + $1,
          blank_votes = blank_votes + $2,
          null_votes = null_votes + $3
        WHERE id = 1;
      `, [valid_votes, blank_votes, null_votes]);

    // ✅ Insertar votos por partido en departments_votes
    for (const party of partyvotes) {
      const partyAbbrNormalized = party.abbr?.trim().toUpperCase();

      const partyResult = await client.query(
        `SELECT id FROM political_parties WHERE UPPER(TRIM(abbr)) = $1`,
        [partyAbbrNormalized]
      );

      if (partyResult.rows.length === 0) {
        throw new Error(`No se encontró el partido con abbr '${party.abbr}'`);
      }

      const party_id = partyResult.rows[0].id;

      await client.query(`
        INSERT INTO departments_votes ( department_id, party_id, votes)
        VALUES ( $1, $2, $3)
        ON CONFLICT (department_id, party_id)
        DO UPDATE SET votes = departments_votes.votes + EXCLUDED.votes;
      `, [department_id, party_id, party.votes]);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Votos registrados correctamente.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registrando votos:', error);
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
});

export default router;
