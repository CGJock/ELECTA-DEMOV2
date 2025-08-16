import { Pool } from 'pg';
import { getActiveElectionRoundId } from '@utils/getActiveElectionAndRound.js';
import redisClient from '@db/redis.js';

export interface PartySummary {
  name: string;
  abbr: string;
  count: number;
  percentage: number;
}

export interface LocationSummary {
  locationCode: string;
  locationName: string;
  totalVotes: number;
  partyBreakdown: PartySummary[];
}

export async function getLocationSummary(db: Pool, locationCode: string): Promise<LocationSummary> {
  const key = `votes:parties:summary:${locationCode}`;
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached) as LocationSummary;

  const roundId = await getActiveElectionRoundId();
  if (!roundId) {
    return {
      locationCode,
      locationName: `ID ${locationCode}`,
      totalVotes: 0,
      partyBreakdown: [],
    };
  }

  const result = await db.query(
    `
    WITH totals AS (
      SELECT
        COALESCE(SUM((b.raw_data ->> 'blankVotes')::INTEGER), 0) AS blankVotes,
        COALESCE(SUM((b.raw_data ->> 'nullVotes')::INTEGER), 0) AS nullVotes
      FROM ballots_data b
      WHERE b.election_round_id = $1
        AND b.department_code = $2
    ),
    parties AS (
      SELECT json_agg(t) AS party_array
      FROM (
        SELECT
          p.party ->> 'name' AS name,
          p.party ->> 'abbr' AS abbr,
          SUM((p.party ->> 'votes')::INTEGER) AS count
        FROM ballots_data b2
        CROSS JOIN LATERAL jsonb_array_elements(b2.raw_data -> 'parties') AS p(party)
        WHERE b2.election_round_id = $1
          AND b2.department_code = $2
        GROUP BY p.party ->> 'name', p.party ->> 'abbr'
        ORDER BY count DESC
      ) t
    )
    SELECT totals.blankVotes, totals.nullVotes, parties.party_array
    FROM totals, parties;
    `,
    [roundId, locationCode]
  );

  const row = result.rows[0];
  if (!row) {
    return {
      locationCode,
      locationName: `ID ${locationCode}`,
      totalVotes: 0,
      partyBreakdown: [],
    };
  }

  const blankVotes = Number(row.blankvotes) || 0;
  const nullVotes = Number(row.nullvotes) || 0;

  const partyBreakdown: PartySummary[] = (row.party_array || []).map((party: any) => ({
    name: party.name || '',
    abbr: party.abbr || '',
    count: Number(party.count) || 0,
    percentage: 0, // lo calculamos abajo
  }));

  // Calcular votos válidos
  const validVotes = partyBreakdown.reduce((sum, p) => sum + p.count, 0);
  const totalVotes = validVotes + blankVotes + nullVotes;

  // Calcular porcentajes
  partyBreakdown.forEach(p => {
    p.percentage = validVotes > 0
      ? Number(((p.count / validVotes) * 100).toFixed(2))
      : 0;
  });

  const locationNameResult = await db.query(
    `SELECT name FROM departments WHERE code = $1`,
    [locationCode]
  );
  const locationName = locationNameResult.rows[0]?.name || `ID ${locationCode}`;

  const summary: LocationSummary = {
    locationCode,
    locationName,
    totalVotes,
    partyBreakdown,
  };

  await redisClient.set(key, JSON.stringify(summary), 'EX', 600);

  return summary;
}