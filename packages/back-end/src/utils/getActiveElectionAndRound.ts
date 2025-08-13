
import pool from '@db/db.js'
export async function getActiveElectionRoundId(): Promise<number | null> {
  try {
    const result = await pool.query(
      `SELECT election_round_id FROM active_election ORDER BY updated_at DESC LIMIT 1`
    );
    if (result.rows.length === 0) return null;
    return result.rows[0].election_round_id;
  } catch (error) {
    console.error('Error getting active election round id:', error);
    return null;
  }
}