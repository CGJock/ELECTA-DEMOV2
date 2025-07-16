import { Router, Request, Response } from 'express';
import { z } from 'zod';
import pool from '@db/db.js';
import { getLatestElectionRoundId } from '@utils/getLastRound.js';
import { validateApiKey, votosLimiter } from '@middlerare/security.js';
import { cleanDateField, cleanNumberField } from '@utils/validations.js';

const router = Router();

interface PartyData {
  abbr: string;
  votes: number | null;
}

interface TallyData {
  verification: string
  imageUrl: string; 
  project_id: string;
  project_name: string;
  date_start_time: Date;
  date_time_complete: Date;
}

//to check aliases in key values
const fieldAliasMap: Record<string, string> = {
  "VOTOS VÁLID0S": "validVotes",
  "VOTOS BLANCOS": "blankVotes",
  "VOTOS NULOS": "nullVotes",
  "image_url": "image_url", // por si acaso viene como image_url
  "Imagen": "image_url"     // opcional
};

// base squema to extact known values
const voteSchema = z.object({
  Departamento: z.string().transform((val) => val.trim()),
  nullVotes: cleanNumberField('nullVotes'),
  blankVotes: cleanNumberField('blankVotes'),
  validVotes: cleanNumberField('validVotes'),
}).loose(); // allow extra urls and parties

//schemma for images
const tallyImageSchema = z.object({
 verification: z.preprocess(
  (val) => {
    if (typeof val === 'string') return parseFloat(val);
    return val;
  },
  z.number()
),
  date_start_time: cleanDateField('date_start_time'),
  date_time_complete: cleanDateField('date_time_complete'),
  imageUrl: z.string().url(),
  project_id: z.string(),
  project_name: z.string()
});

router.post('/', validateApiKey,votosLimiter, async (req: Request, res: Response) => {

  // mormalize keys
  const normalizedBody: Record<string, any> = {};
  for (const [key, value] of Object.entries(req.body)) {
    const trimmedKey = key.trim();
    const mappedKey = fieldAliasMap[trimmedKey] || trimmedKey;
    normalizedBody[mappedKey] = value;
  }
  
     // validate json squema
  const parseResult = voteSchema.safeParse(normalizedBody);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.flatten() });
    return;
  }

 
  
  const body = normalizedBody;
  const department = body.Departamento?.trim();
  const null_votes = Number(body.nullVotes ?? 0);
  const blank_votes = Number(body.blankVotes ?? 0);
  const valid_votes = Number(body.validVotes ?? 0);


    //ignore keys to not be added on party values

   const IGNORE_KEYS = [
    'Departamento', 'Provincia', 'Municipio', 'Localidad', 'Recinto',
    'nullVotes', 'blankVotes', 'validVotes',
    'VOTOS VÁLID0S', 'VOTOS BLANCOS', 'VOTOS NULOS',
    'project_id', 'project_name', 'date_start_time', 'date_time_complete',
    'image_url','verification'
  ];

  const partyVotes: PartyData[] = [];
  let tallyImage: z.infer<typeof tallyImageSchema> | null = null;
  let imageUrlFound = '';

  // extracts parties and tally img
  for (const [key, value] of Object.entries(body)) {
  if (key.toLowerCase().includes('_img_url') && typeof value === 'string') {
    imageUrlFound = value;
    break; // toma la primera que encuentre
  }
}

     // Fallback: usar image_url si no se encontró otra
  if (!imageUrlFound && typeof body.image_url === 'string') {
    imageUrlFound = body.image_url;
  }

    // detects images, firts with _img_url in the name
   if (
  imageUrlFound &&
  typeof body.verification === 'string' &&
  typeof body.project_id === 'string' &&
  typeof body.project_name === 'string' &&
  typeof body.date_start_time === 'string' &&
  typeof body.date_time_complete === 'string'
) {
  try {
    tallyImage = tallyImageSchema.parse({
      verification: body.verification,
      imageUrl: imageUrlFound,
      project_id: body.project_id,
      project_name: body.project_name,
      date_start_time: body.date_start_time,
      date_time_complete: body.date_time_complete,
    });
  } catch (err) {
    res.status(400).json({
      error: 'Error al validar los datos de la imagen de boleta.',
      details: (err as z.ZodError).flatten(),
    });
    return;
  }
}

    // Parse votes per party
    for (const [key, value] of Object.entries(body)) {
  if (IGNORE_KEYS.includes(key)) continue;
  if (key.toLowerCase().includes('_img_url')) continue;

  if (typeof value === 'string') {
  const trimmed = value.trim();

  if (trimmed === '-1') {
    partyVotes.push({ abbr: key.trim().toUpperCase(), votes: null });
    continue;
  }

  const cleaned = trimmed.replace(/[^\d]/g, '');
  const num = Number(cleaned);

  if (!isNaN(num)) {
    partyVotes.push({ abbr: key.trim().toUpperCase(), votes: num });
  }
}
}

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const election_round_id = await getLatestElectionRoundId();
    if (!election_round_id) {
      throw new Error('No se encontró ninguna ronda electoral activa.');
    }

    const deptResult = await client.query(
      `SELECT code FROM departments WHERE TRIM(name) ILIKE $1`,
      [department]
    );

    if (deptResult.rows.length === 0) {
      throw new Error(`No se encontró el departamento con nombre '${department}'`);
    }

    const department_code = deptResult.rows[0].code;

    // Insertar votos generales si no existen
    await client.query(`
      INSERT INTO votes (election_round_id, valid_votes, blank_votes, null_votes)
      VALUES ($1, 0, 0, 0)
      ON CONFLICT (election_round_id) DO NOTHING;
    `, [election_round_id]);

    await client.query(`
      UPDATE votes
      SET valid_votes = valid_votes + $2,
          blank_votes = blank_votes + $3,
          null_votes = null_votes + $4
      WHERE election_round_id = $1;
    `, [election_round_id, valid_votes, blank_votes, null_votes]);

    // Insert votes per party
    for (const { abbr, votes } of partyVotes) {
  const result = await client.query(
    `SELECT id FROM political_parties WHERE TRIM(abbr) ILIKE $1`,
    [abbr]
  );

  let party_id: number;

  if (result.rows.length === 0) {
    const insertRes = await client.query(
      `INSERT INTO political_parties (abbr) VALUES ($1) RETURNING id`,
      [abbr]
    );
    party_id = insertRes.rows[0].id;
  } else {
    party_id = result.rows[0].id;
  }

  // Si votes es null, lo tratamos como 0 para la suma
  const safeVotes = votes ?? 0;

  await client.query(`
    INSERT INTO department_votes (election_round_id, department_code, party_id, votes)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (election_round_id, department_code, party_id)
    DO UPDATE SET votes = department_votes.votes + EXCLUDED.votes;
  `, [election_round_id, department_code, party_id, safeVotes])

      await client.query(`
        INSERT INTO department_votes (election_round_id, department_code, party_id, votes)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (election_round_id, department_code, party_id)
        DO UPDATE SET votes = department_votes.votes + EXCLUDED.votes;
      `, [election_round_id, department_code, party_id, votes]);
    }

    // sabes tally update info
    if (tallyImage) {
      await client.query(`
        INSERT INTO ballot_tallies (
          election_round_id, project_id, project_name,verification, department_code, image_url, date_start_time, date_time_complete
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8);
      `, [
        election_round_id,
        tallyImage.project_id,
        tallyImage.project_name,
        tallyImage.verification,
        department_code,
        tallyImage.imageUrl,
        tallyImage.date_start_time,
        tallyImage.date_time_complete,
      ]);
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Votos y datos registrados correctamente.',
      election_round_id,
      department,
      parties: partyVotes,
      TallyData: tallyImage ?? null,
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