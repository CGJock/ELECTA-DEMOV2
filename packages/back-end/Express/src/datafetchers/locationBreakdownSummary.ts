import { Pool } from 'pg';
import { getLatestElectionRoundId } from '@utils/getLastRound.js';
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

  const Key = `location:summary:${locationCode}`;

  const cached = await redisClient.get(Key);
  if (cached) {
    return JSON.parse(cached) as LocationSummary;
  }

  const roundId = await getLatestElectionRoundId();
  if (!roundId) throw new Error('No election round available');

  // get total votes by location
  const totalVotesResult = await db.query(
    `SELECT COALESCE(SUM(votes), 0) as count
     FROM department_votes
     WHERE department_code = $1 AND election_round_id = $2`,
    [locationCode, roundId]
  );
  const totalVotes = Number(totalVotesResult.rows[0].count);

  // Votes per party
  const votesPerPartyResult = await db.query(
    `
    SELECT p.name, p.abbr, COALESCE(SUM(dv.votes), 0) as count
    FROM political_parties p
    LEFT JOIN department_votes dv
      ON p.id = dv.party_id
     AND dv.department_code = $1
     AND dv.election_round_id = $2
    GROUP BY p.id, p.name, p.abbr
    ORDER BY count DESC
    `,
    [locationCode, roundId]
  );

  const partyBreakdown: PartySummary[] = votesPerPartyResult.rows.map(party => ({
    name: party.name,
    abbr: party.abbr,
    count: Number(party.count),
    percentage: totalVotes ? ((Number(party.count) / totalVotes) * 100).toFixed(2) : '0.00'
  }));

  // gets department name
  const locationNameResult = await db.query(
    `SELECT name FROM departments WHERE code = $1`,
    [locationCode]
  );
  const locationName = locationNameResult.rows[0]?.name || `ID ${locationCode}`;

  const summary: LocationSummary = {
    locationCode,
    locationName,
    totalVotes,
    partyBreakdown
  };

  // saves in redis for 10 minutes
  await redisClient.set(Key, JSON.stringify(summary), 'EX', 600);

  return summary;
}
