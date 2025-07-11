import pool from '@db/db.js';

/**
 * Inserts a second round for an existing election if not exists
 * 
 * @param electionId - ID of the Election in the table`elections`
 * @param roundDate - Second round date (format'YYYY-MM-DD')
 * @returns `true` if the rounds is inserted, `false` if already exists or there was an error
 */
export async function secondRoundSetter(electionId: number, roundDate: string, round_number: number): Promise<boolean> {
  try {
    // Verificar si ya existe la segunda ronda
    const existing = await pool.query(
      `
      SELECT 1 FROM election_rounds
      WHERE election_id = $1 AND round_number = 2;
      `,
      [electionId,round_number]
    );

    if (existing.rows.length > 0) {
      console.log(`Segunda ronda ya existe para elección ID ${electionId}`);
      return false;
    }

    // Insertar la segunda ronda
    await pool.query(
      `
      INSERT INTO election_rounds (election_id, round_number, round_date)
      VALUES ($1, 2, $2);
      `,
      [electionId, roundDate]
    );

    console.log(`Segunda ronda insertada para elección ID ${electionId}`);
    return true;
  } catch (error) {
    console.error('Error al insertar segunda ronda:', error);
    return false;
  }
}
