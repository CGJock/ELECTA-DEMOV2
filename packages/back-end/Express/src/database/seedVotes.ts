import pool from './db.js';

export async function insertVotes(): Promise<void> {
  try {
    await pool.query(`
    INSERT INTO votes (id, valid_votes, blank_votes, null_votes)
    VALUES (1, 0, 0, 0)
    ON CONFLICT (id) DO NOTHING;
      `);
     console.log('Vote row succesfully inserted');
  } catch (error) {
    console.error('Error insertando departamentos:', error);
  }
}