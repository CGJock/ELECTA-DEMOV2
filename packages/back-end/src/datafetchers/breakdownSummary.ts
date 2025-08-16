

import { Pool } from 'pg';
import redisClient from '@db/redis.js';
import { getActiveElectionRoundId } from '@utils/getActiveElectionAndRound.js';

export interface PartySummary {
  abbr: string;
  count: number;
  percentage: number;
}

export interface GlobalSummary {
  blankVotes: number;
  nullVotes: number;
  validVotes: number;
  politicalParties: PartySummary[];
}

export async function getTotalSummary(db: Pool): Promise<GlobalSummary> {
  // Intentar usar cache
  const cached = await redisClient.get('votes:parties:summary');
  if (cached) return JSON.parse(cached) as GlobalSummary;

  const roundId = await getActiveElectionRoundId();

  // Si no hay elección activa → devolver datos vacíos
  if (!roundId) {
    return {
      blankVotes: 0,
      nullVotes: 0,
      validVotes: 0,
      politicalParties: [],
    };
  }

  const result = await db.query(
    `
    WITH total_valid_votes AS (
      SELECT COALESCE(SUM((party ->> 'votes')::INTEGER), 0) AS total
      FROM ballots_data b
      CROSS JOIN LATERAL jsonb_array_elements(b.raw_data -> 'parties') AS p(party)
      WHERE b.election_round_id = $1
    )
    SELECT
      tv.total AS "validVotes",
      COALESCE(SUM((b.raw_data ->> 'blankVotes')::INTEGER), 0) AS "blankVotes",
      COALESCE(SUM((b.raw_data ->> 'nullVotes')::INTEGER), 0) AS "nullVotes",
      p.party ->> 'abbr' AS "abbr",
      SUM((p.party ->> 'votes')::INTEGER) AS "count"
    FROM ballots_data b
    CROSS JOIN LATERAL jsonb_array_elements(b.raw_data -> 'parties') AS p(party),
    total_valid_votes tv
    WHERE b.election_round_id = $1
    GROUP BY tv.total, abbr
    ORDER BY count DESC;
    `,
    [roundId]
  );

  const rows = result.rows;

  if (rows.length === 0) {
    return {
      blankVotes: 0,
      nullVotes: 0,
      validVotes: 0,
      politicalParties: [],
    };
  }

  const validVotes = Number(rows[0].validVotes) || 0;
  const blankVotes = Number(rows[0].blankVotes) || 0;
  const nullVotes = Number(rows[0].nullVotes) || 0;

  const politicalParties: PartySummary[] = rows.map(row => ({
    abbr: row.abbr,
    count: Number(row.count) || 0,
    percentage: validVotes
      ? Number(((Number(row.count) / validVotes) * 100).toFixed(2))
      : 0,
  }));

  const summary: GlobalSummary = {
    blankVotes,
    nullVotes,
    validVotes,
    politicalParties,
  };

  await redisClient.set(
    'votes:parties:summary',
    JSON.stringify(summary),
    'EX',
    600
  );

  return summary;
}
