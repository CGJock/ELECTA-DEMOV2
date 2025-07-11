import { Router, Request, Response } from 'express';
import pool from '@db/db.js';
import { getLatestElectionRoundId } from '@utils/getLastRound.js';

const router = Router();

interface PartyVote {
  abbr: string;
  votes: number;
}

interface TallyVoteImg {
  abbr: string;
  imageUrl: string;
}

router.post('/', async (req: Request, res: Response) => {
  const body = req.body;

  const department = body.Departamento?.trim();
  const null_votes = Number(body.nullVotes ?? 0);
  const blank_votes = Number(body.blankVotes ?? 0);
  const valid_votes = Number(body.validVotes ?? 0);

  const IGNORE_KEYS = [
    'Departamento', 'Provincia', 'Municipio', 'Localidad', 'Recinto',
    'nullVotes', 'blankVotes', 'validVotes'
  ];

  const partyVotes: PartyVote[] = [];
  const tallyImages: TallyVoteImg[] = [];

  // Parse incoming body
  for (const [key, value] of Object.entries(body)) {
    if (IGNORE_KEYS.includes(key)) continue;

    // Detect image URLs
    if (key.toLowerCase().includes('tallyvote') && typeof value === 'string') {
      const abbr = key
        .replace(/_?image_?url/i, '')
        .replace(/tallyvote/i, '')
        .replace(/_/g, ' ')
        .trim()
        .toUpperCase();

      tallyImages.push({ abbr, imageUrl: value });
      continue;
    }

    // Assume party: value is number of votes
    if (typeof value === 'string' && !isNaN(Number(value))) {
      const abbr = key.trim().toUpperCase();
      const votes = parseInt(value, 10);
      partyVotes.push({ abbr, votes });
    }
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const election_round_id = await getLatestElectionRoundId();
    if (!election_round_id) throw new Error('No se encontró ninguna ronda electoral activa.');

    const departmentTrimmed = department?.trim();

    const deptResult = await client.query(
      `SELECT code FROM departments WHERE TRIM(name) ILIKE $1`,
      [departmentTrimmed]
    );

    if (deptResult.rows.length === 0) {
      throw new Error(`No se encontró el departamento con nombre '${department}'`);
    }

    const department_code = deptResult.rows[0].code;

    // Insert base vote record if not exists
    await client.query(`
      INSERT INTO votes (election_round_id, valid_votes, blank_votes, null_votes)
      VALUES ($1, 0, 0, 0)
      ON CONFLICT (election_round_id) DO NOTHING;
    `, [election_round_id]);

    // Update general vote totals
    await client.query(`
      UPDATE votes
      SET valid_votes = valid_votes + $2,
          blank_votes = blank_votes + $3,
          null_votes = null_votes + $4
      WHERE election_round_id = $1;
    `, [election_round_id, valid_votes, blank_votes, null_votes]);

    for (const party of partyVotes) {
      const abbr = party.abbr;

      // Check if party already exists
      const result = await client.query(
        `SELECT id FROM political_parties WHERE TRIM(abbr) ILIKE $1`,
        [abbr]
      );

      let party_id: number;

      if (result.rows.length === 0) {
        // Insert new party
        const insertRes = await client.query(
          `INSERT INTO political_parties (abbr) VALUES ($1) RETURNING id`,
          [abbr]
        );
        party_id = insertRes.rows[0].id;
      } else {
        party_id = result.rows[0].id;
      }

      // Insert or update department votes
      await client.query(`
        INSERT INTO department_votes (election_round_id, department_code, party_id, votes)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (election_round_id, department_code, party_id)
        DO UPDATE SET votes = department_votes.votes + EXCLUDED.votes;
      `, [election_round_id, department_code, party_id, party.votes]);
    }

    // Save tally image if present
    const firstImage = tallyImages[0];
    if (firstImage?.imageUrl) {
      await client.query(`
        INSERT INTO ballot_tallies (election_round_id, department_code, image_url)
        VALUES ($1, $2, $3);
      `, [election_round_id, department_code, firstImage.imageUrl]);
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Votos y datos registrados correctamente.',
      election_round_id,
      department: departmentTrimmed,
      parties: partyVotes,
      tally_image: firstImage?.imageUrl ?? null
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registrando votos:', error);
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
});

export default router;
