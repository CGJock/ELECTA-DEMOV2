// import { Pool } from 'pg';
// import { getLatestElectionRoundId } from '@utils/getLastRound.js';
// import redisClient from '@db/redis.js';

// export interface PartySummary {
//   name: string;
//   abbr: string;
//   count: number;
//   percentage: string;
// }

// export interface LocationSummary {
//   locationCode: string;
//   locationName: string;
//   totalVotes: number;
//   partyBreakdown: PartySummary[];
// }

// export async function getLocationSummary(db: Pool, locationCode: string): Promise<LocationSummary> {

//   const Key = `location:summary:${locationCode}`;

//   const cached = await redisClient.get(Key);
//   if (cached) {
//     return JSON.parse(cached) as LocationSummary;
//   }

//   const roundId = await getLatestElectionRoundId();
//   if (!roundId) throw new Error('No election round available');

//   // get total votes by location
//   const totalVotesResult = await db.query(
//     `SELECT COALESCE(SUM(votes), 0) as count
//      FROM department_votes
//      WHERE department_code = $1 AND election_round_id = $2`,
//     [locationCode, roundId]
//   );
//   const totalVotes = Number(totalVotesResult.rows[0].count);

//   // Votes per party
//   const votesPerPartyResult = await db.query(
//     `
//     SELECT p.name, p.abbr, COALESCE(SUM(dv.votes), 0) as count
//     FROM political_parties p
//     LEFT JOIN department_votes dv
//       ON p.id = dv.party_id
//      AND dv.department_code = $1
//      AND dv.election_round_id = $2
//     GROUP BY p.id, p.name, p.abbr
//     ORDER BY count DESC
//     `,
//     [locationCode, roundId]
//   );

//   const partyBreakdown: PartySummary[] = votesPerPartyResult.rows.map(party => ({
//     name: party.name,
//     abbr: party.abbr,
//     count: Number(party.count),
//     percentage: totalVotes ? ((Number(party.count) / totalVotes) * 100).toFixed(2) : '0.00'
//   }));

//   // gets department name
//   const locationNameResult = await db.query(
//     `SELECT name FROM departments WHERE code = $1`,
//     [locationCode]
//   );
//   const locationName = locationNameResult.rows[0]?.name || `ID ${locationCode}`;

//   const summary: LocationSummary = {
//     locationCode,
//     locationName,
//     totalVotes,
//     partyBreakdown
//   };

//   // saves in redis for 10 minutes
//   await redisClient.set(Key, JSON.stringify(summary), 'EX', 600);

//   return summary;
// }

//new location 
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
  const key = `location:summary:${locationCode}`;

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

  // Totales
  const totalsResult = await db.query(
    `
    SELECT
      COALESCE(SUM((p.party ->> 'votes')::INTEGER), 0) AS "validVotes",
      COALESCE(SUM((b.raw_data ->> 'blankVotes')::INTEGER), 0) AS "blankVotes",
      COALESCE(SUM((b.raw_data ->> 'nullVotes')::INTEGER), 0) AS "nullVotes"
    FROM ballots_data b
    JOIN LATERAL jsonb_array_elements(b.raw_data -> 'parties') AS p(party) ON true
    WHERE b.election_round_id = $1
      AND b.department_code = $2
    `,
    [roundId, locationCode]
  );

  const validVotes = Number(totalsResult.rows[0]?.validVotes || 0);
  const blankVotes = Number(totalsResult.rows[0]?.blankVotes || 0);
  const nullVotes = Number(totalsResult.rows[0]?.nullVotes || 0);
  const totalVotes = validVotes + blankVotes + nullVotes;

  // Votos por partido
  const votesPerPartyResult = await db.query(
    `
    SELECT 
      COALESCE(pp.name, p.party ->> 'abbr') AS "name",
      p.party ->> 'abbr' AS "abbr",
      COALESCE(SUM((p.party ->> 'votes')::INTEGER), 0) AS "count"
    FROM ballots_data b
    CROSS JOIN LATERAL jsonb_array_elements(b.raw_data -> 'parties') AS p(party)
    LEFT JOIN political_parties pp ON pp.abbr = p.party ->> 'abbr'
    WHERE b.election_round_id = $1
      AND b.department_code = $2
    GROUP BY COALESCE(pp.name, p.party ->> 'abbr'), p.party ->> 'abbr'
    ORDER BY count DESC
    `,
    [roundId, locationCode]
  );

  const partyBreakdown: PartySummary[] = votesPerPartyResult.rows.map(row => ({
    name: row.name,
    abbr: row.abbr,
    count: Number(row.count),
    percentage: validVotes
      ? ((Number(row.count) / validVotes) * 100).toFixed(2)
      : '0.00',
  }));

  // Nombre de ubicación
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

