
import { Pool } from 'pg';
import { getActiveElectionRoundId } from '@utils/getActiveElectionAndRound.js';
import redisClient from '@db/redis.js';

export interface PartySummary {
  name: string;
  abbr: string;
  count: number;
  percentage: string;
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

  // Query corregida: agregamos primero y luego hacemos json_agg
  const result = await db.query(
    `
    -- Totales generales
    SELECT tg.validVotes, tg.blankVotes, tg.nullVotes,
           tbp.party_array AS totals_by_party
    FROM
      (
        SELECT
          COALESCE(SUM((p.party ->> 'votes')::INTEGER), 0) AS validVotes,
          COALESCE(SUM((b.raw_data ->> 'blankVotes')::INTEGER), 0) AS blankVotes,
          COALESCE(SUM((b.raw_data ->> 'nullVotes')::INTEGER), 0) AS nullVotes
        FROM ballots_data b
        CROSS JOIN LATERAL jsonb_array_elements(b.raw_data -> 'parties') AS p(party)
        WHERE b.election_round_id = $1
          AND b.department_code = $2
      ) tg,
      (
        SELECT json_agg(t)
        FROM (
          SELECT
            p.party ->> 'abbr' AS name,
            p.party ->> 'abbr' AS abbr,
            SUM((p.party ->> 'votes')::INTEGER) AS count
          FROM ballots_data b
          CROSS JOIN LATERAL jsonb_array_elements(b.raw_data -> 'parties') AS p(party)
          WHERE b.election_round_id = $1
            AND b.department_code = $2
          GROUP BY p.party ->> 'abbr'
          ORDER BY count DESC
        ) t
      ) tbp(party_array);
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

  const validVotes = Number(row.validVotes) || 0;
  const blankVotes = Number(row.blankVotes) || 0;
  const nullVotes = Number(row.nullVotes) || 0;
  const totalVotes = validVotes + blankVotes + nullVotes;

  const partyBreakdown: PartySummary[] = (row.totals_by_party || []).map((party: any) => ({
    name: party.name,
    abbr: party.abbr,
    count: Number(party.count) || 0,
    percentage: validVotes
      ? ((Number(party.count) / validVotes) * 100).toFixed(2)
      : '0.00',
  }));

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