import pool from '@db/db.js';

/**
 * Busca el ID de la ronda de una elección específica por tipo, número de ronda y fecha.
 * 
 * @param electionTypeId - ID del tipo de elección (ej. 1 = GENERALES)
 * @param roundDate - Fecha de la ronda (ej. '2025-08-17')
 * @param roundNumber - Número de la ronda (1 o 2)
 * @returns `electionRoundId` si existe, o `null` si no se encuentra.
 */
export async function getElectionRoundId(
  electionTypeId: number = 1,
  roundDate: string = '2025-08-17',  //values that will be used to check the actual election
  roundNumber: number = 1
): Promise<number | null> {
  try {
    const result = await pool.query(
      `
      SELECT er.id AS election_round_id
      FROM elections e
      JOIN election_rounds er ON er.election_id = e.id
      WHERE e.election_type = $1
        AND er.round_number = $2
        AND er.round_date = $3;
      `,
      [electionTypeId, roundNumber, roundDate]
    );

    return result.rows[0]?.election_round_id ?? null;
  } catch (error) {
    console.error('Error al obtener election_round_id:', error);
    return null;
  }
}
