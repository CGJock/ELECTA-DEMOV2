import { Pool } from 'pg';
import { getLatestElectionRoundId } from '@utils/getLastRound.js';
import { toPercenData } from '@utils/toPercentage.js';

export interface VotesBreakdown {
  totalVotes: number;
  nullVotes: number;
  nullPercent: number;
  blankVotes: number;
  blankPercent: number;
  validVotes: number;
  validPercent: number;
}
//election round id comes from the getLatestElectionRoundId function that gets the last id of elections round
//makes an addition of the values in the table votes
export async function getVotesSummary(pool: Pool): Promise<VotesBreakdown> {
  const electionRoundId = await getLatestElectionRoundId();
  if (!electionRoundId) throw new Error('No se encontró una ronda electoral válida');
  const result = await pool.query(
  `
  SELECT
    COALESCE(SUM(valid_votes), 0) AS "validVotes",
    COALESCE(SUM(blank_votes), 0) AS "blankVotes",
    COALESCE(SUM(null_votes), 0) AS "nullVotes",
    COALESCE(SUM(valid_votes + blank_votes + null_votes), 0) AS "totalVotes"
  FROM votes
  WHERE election_round_id = $1
  `,
  [electionRoundId]
);
    //it's using results in the first row so is the only information needed
  const row = result.rows[0];

 const raw = {
  totalVotes: Number(row.totalVotes) || 0,
  nullVotes: Number(row.nullVotes) || 0,
  blankVotes: Number(row.blankVotes) || 0,
  validVotes: Number(row.validVotes) || 0,
};

  return toPercenData(raw);
}

