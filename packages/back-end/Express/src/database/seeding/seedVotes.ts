import pool from '@db/db.js';
import { getElectionRoundId } from '@utils/getElectionAndRound.js';

export async function insertVotes(): Promise<void> {
  const current_election = await getElectionRoundId();
  try {
    await pool.query(
    'INSERT INTO votes (election_round_id, valid_votes, blank_votes, null_votes) VALUES ($1, $2, $3, $4) ON CONFLICT (election_round_id) DO NOTHING',
    [current_election, 0, 0, 0]
    );
     console.log('Vote row succesfully inserted');
  } catch (error) {
    console.error('Error insertando votos:', error);
  }
}