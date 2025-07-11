import pool from '@db/db.js';

/**
 * Obtiene el ID de la ronda electoral más reciente (última por fecha).
 */
export async function getLatestElectionRoundId(): Promise<number | null> {
  try {
    const result = await pool.query(`
      SELECT er.id AS election_round_id
      FROM election_rounds er
      ORDER BY er.round_date DESC
      LIMIT 1;
    `);

    return result.rows[0]?.election_round_id ?? null;
  } catch (error) {
    console.error('Error al obtener la última election_round:', error);
    return null;
  }
}
