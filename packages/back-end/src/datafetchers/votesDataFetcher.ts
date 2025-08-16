

//votes fetcher 
import { Pool } from 'pg';
import { getActiveElectionRoundId } from '@utils/getActiveElectionAndRound.js';
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

export async function getVotesSummary(pool: Pool): Promise<VotesBreakdown> {
  const electionRoundId = await getActiveElectionRoundId();
  if (!electionRoundId) {
    return {
      totalVotes: 0,
      nullVotes: 0,
      nullPercent: 0,
      blankVotes: 0,
      blankPercent: 0,
      validVotes: 0,
      validPercent: 0,
    };
  }

  const result = await pool.query(
    `
    SELECT
      COALESCE(SUM((raw_data ->> 'nullVotes')::INTEGER), 0) AS "nullVotes",
      COALESCE(SUM((raw_data ->> 'blankVotes')::INTEGER), 0) AS "blankVotes",
      COALESCE(SUM(
        (raw_data ->> 'blankVotes')::INTEGER +
        (raw_data ->> 'nullVotes')::INTEGER +
        (SELECT COALESCE(SUM((party ->> 'votes')::INTEGER), 0)
         FROM jsonb_array_elements(raw_data -> 'parties') AS party(p))
      ), 0) AS "totalVotes",
      COALESCE(SUM(
        (SELECT COALESCE(SUM((party ->> 'votes')::INTEGER), 0)
         FROM jsonb_array_elements(raw_data -> 'parties') AS party(p))
      ), 0) AS "validVotes"
    FROM ballots_data
    WHERE election_round_id = $1;
    `,
    [electionRoundId]
  );

  const row = result.rows[0];

  const raw = {
    totalVotes: Number(row.totalVotes) || 0,
    nullVotes: Number(row.nullVotes) || 0,
    blankVotes: Number(row.blankVotes) || 0,
    validVotes: Number(row.validVotes) || 0,
  };

  return toPercenData(raw);
}
