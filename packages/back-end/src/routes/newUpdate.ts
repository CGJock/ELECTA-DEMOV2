import { Router, Request, Response } from 'express';
import { z } from 'zod';
import pool from '@db/db.js';
import { getActiveElectionRoundId } from '@utils/getActiveElectionAndRound.js';
import { validateApiKey, votosLimiter } from '@middlerare/security.js';
import { cleanDateField, cleanNumberField } from '@utils/validations.js';




export interface PartyData {
  abbr: string;
  votes: number | null | string;
}

const router = Router();

const fieldAliasMap: Record<string, string> = {
  "VOTOS VÁLIDOS": "validVotes",
  "VOTOS BLANCOS": "blankVotes",
  "VOTOS NULOS": "nullVotes",
  "image_url": "image_url", 
  "Imagen": "image_url"
};

const voteSchema = z.object({
  Departamento: z.string().transform((val) => val.trim()),
  nullVotes: cleanNumberField('nullVotes'),
  blankVotes: cleanNumberField('blankVotes'),
  validVotes: cleanNumberField('validVotes'),
}).loose();

const tallyImageSchema = z.object({
  verification: z.string().transform(val => val.trim()),
  date_start_time: cleanDateField('date_start_time'),
  date_time_complete: cleanDateField('date_time_complete'),
  imageUrl: z.string().url(),
  project_id: z.string(),
  project_name: z.string(),
});

const IGNORE_KEYS = [
  'Departamento', 'Provincia', 'Municipio', 'Localidad', 'Recinto',
  'nullVotes', 'blankVotes', 'validVotes',
  'project_id', 'project_name', 'date_start_time', 'date_time_complete',
  'image_url', 'verification'
];

router.post('/', validateApiKey, votosLimiter, async (req: Request, res: Response) => {
  const rawBody = req.body.ballot_value;

  if (!rawBody || typeof rawBody !== 'object') {
    res.status(400).json({ error: 'Invalid or missing "ballot_value" in request body.' });
    return;
  }

  const normalizedBody: Record<string, any> = {};
  for (const [key, value] of Object.entries(rawBody)) {
    const trimmedKey = key.trim();
    const mappedKey = fieldAliasMap[trimmedKey] || trimmedKey;
    normalizedBody[mappedKey] = value;
  }

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

  let hasMissingData = false;
  for (const [key, value] of Object.entries(body)) {
    if (IGNORE_KEYS.includes(key)) continue;
    if (key.toLowerCase().includes('_img_url')) continue;
    if (typeof value === 'string' && value.trim() === '-1') {
      hasMissingData = true;
      break;
    }
  }

  let imageUrlFound = '';
  for (const [key, value] of Object.entries(body)) {
    if (key.toLowerCase().includes('_img_url') && typeof value === 'string') {
      imageUrlFound = value;
      break;
    }
  }
  if (!imageUrlFound && typeof body.image_url === 'string') {
    imageUrlFound = body.image_url;
  }

  let tallyImage: z.infer<typeof tallyImageSchema> | null = null;
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
        error: 'Error validating ballot image data.',
        details: (err as z.ZodError).flatten(),
      });
      return;
    }
  }

  const partyVotes: PartyData[] = [];
  for (const [key, value] of Object.entries(body)) {
    if (IGNORE_KEYS.includes(key)) continue;
    if (key.toLowerCase().includes('_img_url')) continue;

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '-1') {
        partyVotes.push({ abbr: key.trim().toUpperCase(), votes: -1 });
        continue;
      }
      const cleaned = trimmed.replace(/[^\d-]/g, '');
      const num = Number(cleaned);
      if (!isNaN(num)) {
        partyVotes.push({ abbr: key.trim().toUpperCase(), votes: num });
      }
    }
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ---------------------------------------------
    // REPARO: Eliminamos el SELECT inicial en ballot_tallies
    // para que no rompa la transacción si el verification_code ya existe.
    // En su lugar, usamos ON CONFLICT DO NOTHING más adelante y
    // enviamos un mensaje indicando que se omitió si ya existía en ballots_data.
    // ---------------------------------------------

    // Get latest election round
    const election_round_id = await getActiveElectionRoundId();
    if (!election_round_id) {
      res.status(404).json({ error: 'No active election round found.' });
      await client.query('ROLLBACK');
      return;
    }

    // Get department code
    const deptResult = await client.query(
      `SELECT code FROM departments WHERE TRIM(name) ILIKE $1`,
      [department]
    );
    if (deptResult.rows.length === 0) {
      res.status(404).json({ error: `Department '${department}' not found.` });
      await client.query('ROLLBACK');
      return;
    }
    const department_code = deptResult.rows[0].code;

    const rawDataToSave = {
      verification_code: tallyImage?.verification,
      department_code,
      nullVotes: null_votes,
      blankVotes: blank_votes,
      parties: partyVotes,
    };

    let alreadyExistsInData = false;

    if (hasMissingData) {
      // ---------------------------------------------
      // Actas incompletas: se actualizan en ballots_missing_data
      // ---------------------------------------------
      const existingInMissing = await client.query(
        `SELECT verification_code FROM ballots_missing_data WHERE verification_code = $1`,
        [tallyImage?.verification]
      );

      if (existingInMissing.rows.length > 0) {
        await client.query(
          `UPDATE ballots_missing_data SET 
            raw_data = $1,
            election_round_id = $2,
            department_code = $3,
            project_id = $4,
            project_name = $5,
            date_start_time = $6,
            date_time_complete = $7,
            image_url = $8
           WHERE verification_code = $9`,
          [
            JSON.stringify(rawDataToSave),
            election_round_id,
            department_code,
            tallyImage?.project_id ?? '',
            tallyImage?.project_name ?? '',
            tallyImage?.date_start_time ?? null,
            tallyImage?.date_time_complete ?? null,
            tallyImage?.imageUrl ?? '',
            tallyImage?.verification
          ]
        );
      } else {
        await client.query(
          `INSERT INTO ballots_missing_data (
            verification_code,
            raw_data,
            election_round_id,
            department_code,
            project_id,
            project_name,
            date_start_time,
            date_time_complete,
            image_url
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            tallyImage?.verification,
            JSON.stringify(rawDataToSave),
            election_round_id,
            department_code,
            tallyImage?.project_id ?? '',
            tallyImage?.project_name ?? '',
            tallyImage?.date_start_time ?? null,
            tallyImage?.date_time_complete ?? null,
            tallyImage?.imageUrl ?? '',
          ]
        );
      }
    } else {
      // ---------------------------------------------
      // Actas completas: se inserta en ballots_data con ON CONFLICT DO NOTHING
      // para que no rompa la transacción si ya existe.  
      // Se registra en ballot_tallies igual con ON CONFLICT DO NOTHING.
      // Si ya existía en ballots_data, se marca ya existente para el mensaje.
      // ---------------------------------------------

      // Delete from missing data if exists
      await client.query(
        `DELETE FROM ballots_missing_data WHERE verification_code = $1`,
        [tallyImage?.verification]
      );

      const result = await client.query(
        `INSERT INTO ballots_data (
          verification_code,
          raw_data,
          election_round_id,
          department_code
        ) VALUES ($1,$2,$3,$4)
        ON CONFLICT (verification_code) DO NOTHING
        RETURNING verification_code`,
        [tallyImage?.verification, JSON.stringify(rawDataToSave), election_round_id, department_code]
      );

      if (result.rowCount === 0) {
        alreadyExistsInData = true;
      }

      if (tallyImage) {
        await client.query(`
          INSERT INTO ballot_tallies (
            project_id,
            project_name,
            date_start_time,
            date_time_complete,
            verification_code,
            election_round_id,
            department_code,
            image_url,
            raw_data
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
          ON CONFLICT (verification_code) DO NOTHING
        `, [
          tallyImage.project_id,
          tallyImage.project_name,
          tallyImage.date_start_time,
          tallyImage.date_time_complete,
          tallyImage.verification,
          election_round_id,
          department_code,
          tallyImage.imageUrl,
          JSON.stringify(rawDataToSave),
        ]);
      }
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: hasMissingData
        ? 'Data saved as missing due to incomplete values.'
        : alreadyExistsInData
          ? 'Skipped: ballot already exists in ballots_data.'
          : 'Data successfully saved as complete.',
      election_round_id,
      department,
      parties: partyVotes,
      tallyImage: tallyImage ?? null,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing ballot data:', error);
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
});

export default router;